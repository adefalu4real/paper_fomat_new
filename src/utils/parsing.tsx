export const parseDocumentSections = (text: string) => {
    let currentText = text;
    let abstract = '';
    let keywords = '';
    let references = '';
    let body = '';

    // Abstract extraction
    const abstractRegex = /^(?:Abstract\s*:?\s*)(.*?)(?=\n\n|\n\s*(?:Introduction|Methods|Results|Discussion|Conclusion|Keywords|References|Bibliography|\d+\.\s*\w+)\s*:?\s*|$)/is;
    const abstractMatch = currentText.match(abstractRegex);
    if (abstractMatch && abstractMatch[1]) {
        abstract = abstractMatch[1].trim();
        currentText = currentText.substring(abstractMatch[0].length).trim();
    }

    // Keywords extraction
    const keywordsRegex = /^(?:Keywords\s*:?\s*)(.*?)(?=\n\n|\n\s*(?:Introduction|Methods|Results|Discussion|Conclusion|References|Bibliography|\d+\.\s*\w+)\s*:?\s*|$)/is;
    const keywordsMatch = currentText.match(keywordsRegex);
    if (keywordsMatch && keywordsMatch[1]) {
        keywords = keywordsMatch[1].trim();
        currentText = currentText.substring(keywordsMatch[0].length).trim();
    }

    // References extraction
    const referencesRegex = /(?:References|Bibliography)\s*:?\s*(.*)$/is;
    const referencesMatch = currentText.match(referencesRegex);
    if (referencesMatch && referencesMatch[1]) {
        body = currentText.substring(0, referencesMatch.index).trim();
        references = referencesMatch[1].trim();
    } else {
        body = currentText.trim();
    }

    return {
        abstract,
        keywords,
        references,
        mainContent: body,
    };
};