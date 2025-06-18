import jsPDF from 'jspdf';
import { PaperType, FormatType } from '../component/common/enums';

// --- Type Definitions and Constants (No Change) ---
export const fontMap: { [key: string]: 'times' | 'helvetica' | 'courier' } = {
    'Times New Roman': 'times',
    'Arial': 'helvetica',
    'Courier New': 'courier',
    'serif': 'times',
    'sans-serif': 'helvetica',
    'monospace': 'courier',
};

export interface FormatRequestPayload {
    rawText: string;
    paperHeading: string;
    authorName: string;
    selectedFormat: FormatType;
    selectedPaperType: PaperType;
    abstractContent: string;
    keywordsContent: string;
    referencesContent: string;
    mainBodyContent: string;
}

// --- Formatting Logic (No Change) ---
export const getFormattingDetails = (payload: Omit<FormatRequestPayload, 'rawText'>) => {
    const {  selectedFormat } = payload;
    let fontSize = 12;
    let fontFamily = 'Times New Roman';
    let lineHeightFactor = 1.5;

    // Format-specific overrides
    switch (selectedFormat) {
        case FormatType.BasicAPA:
        case FormatType.BasicMLA:
        case FormatType.APA7:
            lineHeightFactor = 2.0;
            fontSize = 12;
            fontFamily = 'Times New Roman';
            break;
        case FormatType.Chicago:
            lineHeightFactor = 2.0;
            fontSize = 12;
            fontFamily = 'Times New Roman';
            break;
        case FormatType.IEEE:
            fontFamily = 'Times New Roman';
            fontSize = 10;
            lineHeightFactor = 1.2;
            break;
    }

    return {
        fontSize,
        fontFamily,
        lineHeightFactor,
        fontSizePx: fontSize * 1.33333,
        jsPdfFont: fontMap[fontFamily] || 'times',
    };
};

// --- PRIVATE HTML GENERATION HELPERS (No Change) ---

const addHtmlSection = (title: string, content: string, formatting: ReturnType<typeof getFormattingDetails>, titleTag: string = 'h3', contentTag: string = 'p'): string => {
    if (!content) return '';
    const headerFontSize = (formatting.fontSizePx || 16) * 1.1;
    let html = `<${titleTag} style="font-weight: bold; margin-top: 2em; margin-bottom: 0.8em; font-size: ${headerFontSize}px;">${title}</${titleTag}>`;
    html += `<${contentTag}>${content.trim().replace(/\n/g, '<br>')}</${contentTag}>`;
    return html;
};

function generateIeeeHtml(payload: FormatRequestPayload, formatting: ReturnType<typeof getFormattingDetails>): string {
    const { paperHeading, authorName, keywordsContent, referencesContent, mainBodyContent, abstractContent } = payload;
    const titleFontSize = formatting.fontSizePx * 2;
    const authorFontSize = formatting.fontSizePx * 1.2;
    let html = '';

    html += paperHeading ? `<h1 style="font-weight: bold; text-align: center; font-size: ${titleFontSize}px; margin-bottom: 1em;">${paperHeading}</h1>` : '';
    html += authorName ? `<p style="text-align: center; font-size: ${authorFontSize}px; margin-bottom: 2em;">${authorName}</p>` : '';
    if (abstractContent) html += `<p><strong><em>Abstract—</em></strong>${abstractContent.trim()}</p><br/>`;
    if (keywordsContent) html += `<p><strong><em>Keywords—</em></strong>${keywordsContent.trim()}</p><br/>`;
    if (mainBodyContent) html += `<p style="text-align: justify;">${mainBodyContent.replace(/\n/g, '<br>')}</p>`;
    html += addHtmlSection('References', referencesContent || '[References list goes here]', formatting, 'h2');
    return html;
}

function generateApa7Html(payload: FormatRequestPayload, formatting: ReturnType<typeof getFormattingDetails>): string {
    const { paperHeading, authorName, abstractContent, mainBodyContent, referencesContent } = payload;
    let html = '';
    html += `<div style="text-align: center; border: 2px dashed #ccc; padding: 2rem; margin-bottom: 3rem;">`;
    html += `<p style="font-weight: bold; font-size: ${formatting.fontSizePx * 1.3}px;">${paperHeading || '[Paper Title]'}</p>`;
    html += `<p>${authorName || '[Author Name]'}</p>`;
    html += `<p>[Affiliation]</p><p>[Course Number and Name]</p><p>[Instructor Name]</p><p>[Due Date]</p>`;
    html += `</div>`;
    if (abstractContent) {
        html += `<div style="margin-bottom: 3rem;"><h2 style="text-align: center; font-weight: bold;">Abstract</h2><p>${abstractContent}</p></div>`;
    }
    html += mainBodyContent ? `<p>${mainBodyContent.replace(/\n\s*\n/g, '</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')}</p>` : '';
    if (referencesContent) {
        html += `<h2 style="text-align: center; font-weight: bold; margin-top: 3rem;">References</h2>`;
        html += `<p style="text-indent: -0.5in; padding-left: 0.5in;">${referencesContent.replace(/\n/g, '<br>')}</p>`;
    }
    return html;
}

function generateChicagoHtml(payload: FormatRequestPayload, formatting: ReturnType<typeof getFormattingDetails>): string {
    const { paperHeading, authorName, mainBodyContent, referencesContent } = payload;
    let html = '';
    html += `<div style="text-align: center; border: 2px dashed #ccc; padding: 2rem; margin-bottom: 3rem; min-height: 50vh; display: flex; flex-direction: column; justify-content: space-around;">`;
    html += `<div><h1 style="font-size: ${formatting.fontSizePx * 1.8}px;">${paperHeading || '[Paper Title]'}</h1></div>`;
    html += `<div><p>${authorName || '[Author Name]'}</p><p>[Course Information]</p><p>[Date]</p></div>`;
    html += `</div>`;
    html += mainBodyContent ? `<p>${mainBodyContent.replace(/\n\s*\n/g, '</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')}</p>` : '';
    if (referencesContent) {
        html += `<h2 style="text-align: center; font-weight: bold; margin-top: 3rem;">Bibliography</h2>`;
        html += `<p style="text-indent: -0.5in; padding-left: 0.5in;">${referencesContent.replace(/\n/g, '<br>')}</p>`;
    }
    return html;
}

function generateDefaultHtml(payload: FormatRequestPayload, formatting: ReturnType<typeof getFormattingDetails>): string {
    const { paperHeading, authorName, mainBodyContent } = payload;
    const headingFontSize = formatting.fontSizePx * 1.5;
    let html = '';
    html += paperHeading ? `<h2 style="font-weight: bold; text-align: center; margin-bottom: 1em; font-size: ${headingFontSize}px;">${paperHeading}</h2>` : '';
    html += authorName ? `<p style="text-align: center; margin-bottom: 2em;">By ${authorName}</p>` : '';
    html += mainBodyContent ? `<p style="white-space: pre-wrap;">${mainBodyContent}</p>` : '';
    return html;
}

// --- SIMULATED PUBLIC API FUNCTIONS ---

/**
 * Simulates an API call to get a formatted HTML preview of a document.
 * @param payload - The full request payload containing text and formatting options.
 * @returns A promise that resolves with an HTML string for the preview.
 */
export const simulateFormatPreviewApi = (payload: FormatRequestPayload): Promise<string> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const formatting = getFormattingDetails(payload);
            let formattedHtmlContent = '';

            // --- Dispatch to the correct helper function ---
            // FIX: The logic for each case is now correctly called.
            switch(payload.selectedFormat) {
                case FormatType.IEEE:
                    formattedHtmlContent = generateIeeeHtml(payload, formatting);
                    break;
                case FormatType.APA7:
                    formattedHtmlContent = generateApa7Html(payload, formatting);
                    break;
                case FormatType.Chicago:
                    formattedHtmlContent = generateChicagoHtml(payload, formatting);
                    break;
                default:
                    formattedHtmlContent = generateDefaultHtml(payload, formatting);
                    break;
            }

            const finalHtml = `<div style="font-family: '${formatting.fontFamily}', sans-serif; font-size: ${formatting.fontSizePx}px; line-height: ${formatting.lineHeightFactor};">${formattedHtmlContent}</div>`;
            
            if (!payload.paperHeading && !payload.mainBodyContent && !payload.authorName && !payload.abstractContent && !payload.keywordsContent && !payload.referencesContent) {
                resolve(`<div style="font-family: '${formatting.fontFamily}', sans-serif; font-size: ${formatting.fontSizePx}px; line-height: ${formatting.lineHeightFactor};"><span>Upload a file, paste text, or add a heading/author to see formatted output.</span></div>`);
            } else {
                resolve(finalHtml);
            }
        }, 500);
    });
};

/**
 * Simulates an API call to generate and download a formatted PDF document.
 * @param payload - The full request payload containing text and formatting options.
 * @returns A promise that resolves when the PDF has been generated and triggered for download.
 */
export const simulateGeneratePdfApi = (payload: FormatRequestPayload): Promise<void> => {
    // This function would also be updated with helpers like `generateApa7Pdf` and `generateChicagoPdf`
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                const formatting = getFormattingDetails(payload);
                const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
                
                doc.setFont(formatting.jsPdfFont, 'normal');
                doc.setFontSize(formatting.fontSize);
                doc.text(payload.paperHeading || "Formatted Document", 40, 40);
                doc.text(payload.mainBodyContent || "No content.", 40, 60);

                const pdfBlob = doc.output('blob');
                const url = URL.createObjectURL(pdfBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${payload.paperHeading || 'Formatted_Document'}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                resolve();

            } catch (error: unknown) {
                console.error("Error generating PDF:", error);
                if (error instanceof Error) {
                    reject(error);
                } else {
                    reject(new Error(String(error)));
                }
            }
        }, 1000);
    });
};