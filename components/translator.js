const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require('./british-only.js');

class Translator {
  
  // Invierte un diccionario clave-valor
  reverseDictionary(obj) {
    return Object.keys(obj).reduce((acc, key) => {
      acc[obj[key]] = key;
      return acc;
    }, {});
  }

  // Traduce de americano a británico
  translateAmericanToBritish(text) {
    let translated = text;
    const lowerText = text.toLowerCase();
    
    // 1. Traducir títulos (Mr. -> Mr)
    Object.keys(americanToBritishTitles).forEach(americanTitle => {
      const britishTitle = americanToBritishTitles[americanTitle];
      const regex = new RegExp(`\\b${americanTitle.replace('.', '\\.')}`, 'gi');
      
      translated = translated.replace(regex, (match) => {
        // Mantener capitalización
        const isCapitalized = match[0] === match[0].toUpperCase();
        return isCapitalized 
          ? britishTitle.charAt(0).toUpperCase() + britishTitle.slice(1)
          : britishTitle;
      });
    });

    // 2. Traducir términos específicos americanos
    Object.keys(americanOnly).forEach(americanTerm => {
      const britishTerm = americanOnly[americanTerm];
      const regex = new RegExp(`\\b${americanTerm}\\b`, 'gi');
      
      translated = translated.replace(regex, (match) => {
        const isCapitalized = match[0] === match[0].toUpperCase();
        return isCapitalized 
          ? britishTerm.charAt(0).toUpperCase() + britishTerm.slice(1)
          : britishTerm;
      });
    });

    // 3. Traducir ortografía americana a británica
    Object.keys(americanToBritishSpelling).forEach(americanWord => {
      const britishWord = americanToBritishSpelling[americanWord];
      const regex = new RegExp(`\\b${americanWord}\\b`, 'gi');
      
      translated = translated.replace(regex, (match) => {
        const isCapitalized = match[0] === match[0].toUpperCase();
        return isCapitalized 
          ? britishWord.charAt(0).toUpperCase() + britishWord.slice(1)
          : britishWord;
      });
    });

    // 4. Traducir formato de hora (12:15 -> 12.15)
    translated = translated.replace(/(\d{1,2}):(\d{2})/g, '$1.$2');

    return translated;
  }

  // Traduce de británico a americano
  translateBritishToAmerican(text) {
    let translated = text;
    const lowerText = text.toLowerCase();
    
    // Invertir diccionarios
    const britishToAmericanTitles = this.reverseDictionary(americanToBritishTitles);
    const britishToAmericanSpelling = this.reverseDictionary(americanToBritishSpelling);

    // 1. Traducir títulos (Mr -> Mr.)
    Object.keys(britishToAmericanTitles).forEach(britishTitle => {
      const americanTitle = britishToAmericanTitles[britishTitle];
      const regex = new RegExp(`\\b${britishTitle}\\b`, 'gi');
      
      translated = translated.replace(regex, (match) => {
        const isCapitalized = match[0] === match[0].toUpperCase();
        return isCapitalized 
          ? americanTitle.charAt(0).toUpperCase() + americanTitle.slice(1)
          : americanTitle;
      });
    });

    // 2. Traducir términos específicos británicos
    Object.keys(britishOnly).forEach(britishTerm => {
      const americanTerm = britishOnly[britishTerm];
      const regex = new RegExp(`\\b${britishTerm}\\b`, 'gi');
      
      translated = translated.replace(regex, (match) => {
        const isCapitalized = match[0] === match[0].toUpperCase();
        return isCapitalized 
          ? americanTerm.charAt(0).toUpperCase() + americanTerm.slice(1)
          : americanTerm;
      });
    });

    // 3. Traducir ortografía británica a americana
    Object.keys(britishToAmericanSpelling).forEach(britishWord => {
      const americanWord = britishToAmericanSpelling[britishWord];
      const regex = new RegExp(`\\b${britishWord}\\b`, 'gi');
      
      translated = translated.replace(regex, (match) => {
        const isCapitalized = match[0] === match[0].toUpperCase();
        return isCapitalized 
          ? americanWord.charAt(0).toUpperCase() + americanWord.slice(1)
          : americanWord;
      });
    });

    // 4. Traducir formato de hora (12.15 -> 12:15)
    translated = translated.replace(/(\d{1,2})\.(\d{2})/g, '$1:$2');

    return translated;
  }

  // Resalta las traducciones con spans
  highlightTranslation(original, translated) {
    if (original === translated) {
      return translated;
    }

    let highlighted = translated;
    const originalWords = original.toLowerCase().split(/\b/);
    const translatedWords = translated.toLowerCase().split(/\b/);
    
    // Buscar diferencias y resaltar
    let result = translated;
    
    // Diccionarios combinados para búsqueda
    const allTranslations = {
      ...americanOnly,
      ...americanToBritishSpelling,
      ...britishOnly,
      ...this.reverseDictionary(americanToBritishSpelling)
    };

    // Resaltar términos traducidos
    Object.keys(allTranslations).forEach(term => {
      const translation = allTranslations[term];
      const regex = new RegExp(`\\b${translation}\\b`, 'gi');
      
      result = result.replace(regex, (match) => {
        if (original.toLowerCase().includes(term.toLowerCase())) {
          return `<span class="highlight">${match}</span>`;
        }
        return match;
      });
    });

    // Resaltar títulos traducidos
    const britishToAmericanTitles = this.reverseDictionary(americanToBritishTitles);
    const allTitles = {...americanToBritishTitles, ...britishToAmericanTitles};
    
    Object.keys(allTitles).forEach(title => {
      const translation = allTitles[title];
      const regex = new RegExp(`\\b${translation.replace('.', '\\.')}\\b`, 'gi');
      
      result = result.replace(regex, (match) => {
        if (!match.includes('span')) {
          return `<span class="highlight">${match}</span>`;
        }
        return match;
      });
    });

    // Resaltar cambios de hora
    result = result.replace(/(\d{1,2})[.:](\d{2})/g, (match) => {
      const originalFormat = original.match(/(\d{1,2})[.:](\d{2})/);
      if (originalFormat && originalFormat[0] !== match) {
        return `<span class="highlight">${match}</span>`;
      }
      return match;
    });

    return result;
  }

  // Método principal de traducción
  translate(text, locale) {
    if (text === '') {
      return { error: 'No text to translate' };
    }

    if (!text) {
      return { error: 'Required field(s) missing' };
    }

    if (!locale) {
      return { error: 'Required field(s) missing' };
    }

    if (locale !== 'american-to-british' && locale !== 'british-to-american') {
      return { error: 'Invalid value for locale field' };
    }

    let translated;
    
    if (locale === 'american-to-british') {
      translated = this.translateAmericanToBritish(text);
    } else {
      translated = this.translateBritishToAmerican(text);
    }

    if (text === translated) {
      return { text, translation: 'Everything looks good to me!' };
    }

    const highlightedTranslation = this.highlightTranslation(text, translated);

    return {
      text,
      translation: highlightedTranslation
    };
  }
}

module.exports = Translator;
