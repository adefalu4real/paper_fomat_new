import React, { useState, useEffect } from "react";

enum PaperType {
    Essay = "Essay",
    ResearchPaper = "Research Paper",
    JournalArticle = "Journal Article",
    Thesis = "Thesis",
    Report = "Report",
    ProjectWriteup = "Project Write-up",
}

enum FormatType {
    APA7 = "APA 7",
    MLA9 = "MLA 9",
    IEEE = "IEEE",
    Springer = "Springer",
    FPI = "FPI",
}

// Interface for the component's state to avoid using 'any'
interface PaperContentState {
    paperHeading: string;
    authorName: string;
    selectedFormat: FormatType;
    selectedPaperType: PaperType;
    abstract: string;
    keywords: string;
    mainContent: string;
    introduction: string;
    literatureReview: string;
    methodology: string;
    results: string;
    discussion: string;
    conclusion: string;
    recommendation: string;
    references: string;
    introductionTitle: string;
    literatureReviewTitle: string;
    methodologyTitle: string;
    resultsTitle: string;
    discussionTitle: string;
    conclusionTitle: string;
    recommendationTitle: string;
}

// Interface for the data payload sent to formatting functions
interface FormatRequestPayload {
    paperHeading: string;
    authorName: string;
    selectedFormat: FormatType;
    selectedPaperType: PaperType;
    abstractContent: string;
    keywordsContent: string;
    referencesContent: string;
    mainBodyContent?: string;
    introductionContent?: string;
    literatureReviewContent?: string;
    methodologyContent?: string;
    resultsContent?: string;
    discussionContent?: string;
    conclusionContent?: string;
    recommendationContent?: string;
    introductionTitle?: string;
    literatureReviewTitle?: string;
    methodologyTitle?: string;
    resultsTitle?: string;
    discussionTitle?: string;
    conclusionTitle?: string;
    recommendationTitle?: string;
}

// Placeholder components
const AppWrapper: React.FC<{children: React.ReactNode}> = ({ children }) => <div className="bg-gray-100 min-h-screen font-sans">{children}</div>;
const MainContainer: React.FC<{children: React.ReactNode}> = ({ children }) => <main className="container mx-auto p-4 lg:p-8 grid lg:grid-cols-2 gap-8">{children}</main>;
const ControlsWrapper: React.FC<{children: React.ReactNode}> = ({ children }) => <div className="bg-white p-6 rounded-xl shadow-lg space-y-2 max-h-[90vh] overflow-y-auto">{children}</div>;
const StyledLabel: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ htmlFor, children, ...props }) => <label htmlFor={htmlFor} className="block text-sm font-semibold text-gray-700 mb-1 mt-4" {...props}>{children}</label>;
const StyledSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => <select {...props} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50" />;
const LoadingIndicator: React.FC<{children: React.ReactNode}> = ({ children }) => <p className="text-gray-500">{children}</p>;
const PreviewContainer: React.FC<{children: React.ReactNode}> = ({ children }) => <div id="preview-container" className="bg-gray-200 p-4 rounded-xl shadow-inner flex items-center justify-center max-h-[90vh] sticky top-[95px]">{children}</div>;
const DownloadButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => <button {...props} className="w-full mt-4 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400" />;
const ErrorMessage: React.FC<{children: React.ReactNode}> = ({ children }) => <p className="text-red-500 text-sm mt-2">{children}</p>;
const DownloadOptionsContainer: React.FC<{children: React.ReactNode}> = ({ children }) => <div className="flex justify-around mt-2 gap-4">{children}</div>;
const DownloadOptionButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => <button {...props} className="flex-1 bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition-colors" />;

const GlobalStyle = () => null;

const HeaderComponent: React.FC = () => (
    <header className="bg-white shadow-md sticky top-0 z-20 border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold" style={{
                    background: 'linear-gradient(to right, #3b82f6, #9333ea)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    color: 'transparent',
                    letterSpacing: '-0.01562em'
                }}>
                    FuTera
                </h1>
            </div>
        </div>
    </header>
);

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        html2canvas: (element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        jspdf: { jsPDF: new (options?: any) => any };
        saveAs: (blob: Blob, filename: string) => void;
    }
}

// --- CONFIGURATION ---
const paperTypeConfig: Record<PaperType, { hasAbstract: boolean; hasKeywords: boolean; hasStructuredBody: boolean }> = {
    [PaperType.Essay]: { hasAbstract: false, hasKeywords: false, hasStructuredBody: false },
    [PaperType.ResearchPaper]: { hasAbstract: true, hasKeywords: true, hasStructuredBody: true },
    [PaperType.JournalArticle]: { hasAbstract: true, hasKeywords: true, hasStructuredBody: true },
    [PaperType.Thesis]: { hasAbstract: true, hasKeywords: true, hasStructuredBody: true },
    [PaperType.Report]: { hasAbstract: true, hasKeywords: false, hasStructuredBody: false },
    [PaperType.ProjectWriteup]: { hasAbstract: true, hasKeywords: true, hasStructuredBody: true },
};

// --- FORMATTING FUNCTIONS ---
const formatTextToParagraphs = (htmlContent: string): string => {
    // Convert line breaks to paragraphs and ensure proper formatting
    if (!htmlContent) return '';

    // If it's already HTML, return as is
    if (htmlContent.includes('<p>') || htmlContent.includes('<div>') || htmlContent.includes('<h')) {
        return htmlContent;
    }

    // Convert plain text with line breaks to paragraphs, detecting subheadings
    const lines = htmlContent.split('\n');
    const result: string[] = [];
    let currentParagraph = '';

    for (const line of lines) {
        const trimmedLine = line.trim();

        if (!trimmedLine) {
            // Empty line - if we have content, add it as a paragraph
            if (currentParagraph) {
                result.push(`<p style="margin-bottom: 1em; text-align: justify; text-indent: 0.5in;">${currentParagraph.trim()}</p>`);
                currentParagraph = '';
            }
            continue;
        }

        // Check if this looks like a subheading
        const isSubheading = (
            trimmedLine.length > 0 &&
            trimmedLine.length < 100 && // Reasonable subheading length
            (trimmedLine === trimmedLine.toUpperCase() || // All caps
             /^\d+\./.test(trimmedLine) || // Numbered (1., 2., etc.)
             /^[A-Z][^.!?]*$/.test(trimmedLine) && trimmedLine.length < 50) // Title case, short
        );

        if (isSubheading) {
            // Add any pending paragraph first
            if (currentParagraph) {
                result.push(`<p style="margin-bottom: 1em; text-align: justify; text-indent: 0.5in;">${currentParagraph.trim()}</p>`);
                currentParagraph = '';
            }
            // Add subheading
            result.push(`<h3 style="margin-top: 1.5em; margin-bottom: 0.5em; font-weight: bold; text-align: left; text-transform: uppercase;">${trimmedLine}</h3>`);
        } else {
            // Add to current paragraph
            if (currentParagraph) {
                currentParagraph += ' ' + trimmedLine;
            } else {
                currentParagraph = trimmedLine;
            }
        }
    }

    // Add any remaining content
    if (currentParagraph) {
        result.push(`<p style="margin-bottom: 1em; text-align: justify; text-indent: 0.5in;">${currentParagraph.trim()}</p>`);
    }

    return result.join('');
};
function toRoman(num: number): string {
    const roman: { [key: string]: number } = {M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1};
    let str: string = '';
    for (const key of Object.keys(roman)) {
        const q = Math.floor(num / roman[key]);
        num -= q * roman[key];
        str += key.repeat(q);
    }
    return str;
}
const formatAsAPA = (payload: FormatRequestPayload): string => {
    let html = `<div style="padding: 1in; font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 2;">`;

    // Title Page
    if (payload.paperHeading) {
        html += `<div style="text-align: center; margin-bottom: 2in;">`;
        html += `<h1 style="font-size: 18pt; font-weight: bold; margin-bottom: 0.5in; text-transform: capitalize;">${payload.paperHeading}</h1>`;
        if (payload.authorName) {
            html += `<p style="font-size: 14pt; margin-bottom: 0.25in;">${payload.authorName}</p>`;
            html += `<p style="font-size: 12pt;">Institutional Affiliation</p>`;
        }
        html += `<p style="margin-top: 1in; font-size: 12pt;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>`;
        html += `</div><div style="page-break-before: always;"></div>`;
    }

    // Abstract
    if (payload.abstractContent) {
        html += `<h2 style="text-align: center; font-weight: bold; font-size: 12pt; margin-top: 1em; margin-bottom: 0.5em;">Abstract</h2>`;
        html += `<div style="text-align: justify; text-indent: 0.5in; margin-bottom: 1em;">${formatTextToParagraphs(payload.abstractContent)}</div>`;
    }

    // Keywords
    if (payload.keywordsContent) {
        html += `<p style="text-indent: 0.5in; margin-bottom: 1em;"><i>Keywords:</i> <span>${payload.keywordsContent}</span></p>`;
    }

    const isStructured = paperTypeConfig[payload.selectedPaperType].hasStructuredBody;

    if (isStructured) {
        // Table of Contents for structured papers
        html += `<h2 style="text-align: center; font-weight: bold; margin-top: 2em; margin-bottom: 1em;">Table of Contents</h2>`;
        html += `<div style="margin-bottom: 2em;">`;
        html += `<p>Abstract........................................................................................................................ii</p>`;
        if (payload.keywordsContent) html += `<p>Keywords.......................................................................................................................iii</p>`;
        html += `<p>Introduction.....................................................................................................................1</p>`;
        html += `<p>Literature Review.................................................................................................................2</p>`;
        html += `<p>Methodology........................................................................................................................3</p>`;
        html += `<p>Results.................................................................................................................................4</p>`;
        html += `<p>Discussion...........................................................................................................................5</p>`;
        html += `<p>Conclusion............................................................................................................................6</p>`;
        html += `<p>References...........................................................................................................................7</p>`;
        html += `</div><div style="page-break-before: always;"></div>`;

        const sections = [
            { title: payload.introductionTitle || "Introduction", content: payload.introductionContent },
            { title: payload.literatureReviewTitle || "Literature Review", content: payload.literatureReviewContent },
            { title: payload.methodologyTitle || "Methodology", content: payload.methodologyContent },
            { title: payload.resultsTitle || "Results", content: payload.resultsContent },
            { title: payload.discussionTitle || "Discussion", content: payload.discussionContent },
            { title: payload.conclusionTitle || "Conclusion", content: payload.conclusionContent },
            { title: payload.recommendationTitle || "Recommendation", content: payload.recommendationContent },
        ];

        sections.forEach(section => {
            if (section.content) {
                html += `<h2 style="font-weight: bold; font-size: 12pt; margin-top: 1.5em; margin-bottom: 0.5em; text-align: left;">${section.title}</h2>`;
                html += `<div style="text-align: justify; text-indent: 0.5in;">${formatTextToParagraphs(section.content)}</div>`;
            }
        });
    } else if (payload.mainBodyContent) {
        html += `<div style="text-align: justify; text-indent: 0.5in; margin-top: 1em;">${formatTextToParagraphs(payload.mainBodyContent)}</div>`;
    }

    // References
    if (payload.referencesContent) {
        html += `<h2 style="font-weight: bold; font-size: 12pt; margin-top: 2em; margin-bottom: 1em;">References</h2>`;

        const referencesArray = payload.referencesContent.split('\n')
            .filter(ref => ref.trim() !== '')
            .sort((a, b) => {
                const nameA = (a.match(/<[^>]+>([^<]+)<\/[^>]+>/) ? a.match(/<[^>]+>([^<]+)<\/[^>]+>/)![1] : a).split('(')[0].trim().toLowerCase();
                const nameB = (b.match(/<[^>]+>([^<]+)<\/[^>]+>/) ? b.match(/<[^>]+>([^<]+)<\/[^>]+>/)![1] : b).split('(')[0].trim().toLowerCase();
                return nameA.localeCompare(nameB);
            });

        const formattedReferences = referencesArray
            .map(ref => `<p style="margin-bottom: 0.5em; text-indent: -0.5in; padding-left: 0.5in; line-height: 2;">${ref.trim()}</p>`)
            .join('');

        html += `<div>${formattedReferences}</div>`;
    }

    html += `</div>`;
    return html;
};
const formatAsMLA = (payload: FormatRequestPayload): string => {
    const today = new Date();
    const date = `${today.getDate()} ${today.toLocaleString('default', { month: 'long' })} ${today.getFullYear()}`;
    let html = `<div style="padding: 1in; font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 2;">`;

    // Header
    if (payload.authorName) {
        html += `<p style="margin-bottom: 0;">${payload.authorName}</p>`;
    }
    html += `<p style="margin-bottom: 0;">Professor Name</p>`;
    html += `<p style="margin-bottom: 0;">Course Name</p>`;
    html += `<p style="margin-bottom: 1em;">${date}</p>`;

    // Title
    if (payload.paperHeading) {
        html += `<h1 style="text-align: center; font-weight: normal; font-size: 1.5rem; margin-top: 0; margin-bottom: 1em; text-decoration: underline;">${payload.paperHeading}</h1>`;
    }

    const isStructured = paperTypeConfig[payload.selectedPaperType].hasStructuredBody;

    if (isStructured) {
        const sections = [
            { title: payload.introductionTitle || "Introduction", content: payload.introductionContent },
            { title: payload.literatureReviewTitle || "Literature Review", content: payload.literatureReviewContent },
            { title: payload.methodologyTitle || "Methodology", content: payload.methodologyContent },
            { title: payload.resultsTitle || "Results", content: payload.resultsContent },
            { title: payload.discussionTitle || "Discussion", content: payload.discussionContent },
            { title: payload.conclusionTitle || "Conclusion", content: payload.conclusionContent },
            { title: payload.recommendationTitle || "Recommendation", content: payload.recommendationContent },
        ];

        sections.forEach(section => {
            if (section.content) {
                html += `<h2 style="text-align: left; font-weight: bold; font-size: 1.17em; margin-top: 1em; margin-bottom: 0.5em;">${section.title}</h2>`;
                html += `<div style="text-indent: 0.5in;">${formatTextToParagraphs(section.content)}</div>`;
            }
        });
    } else if (payload.mainBodyContent) {
        html += `<div style="text-indent: 0.5in; margin-top: 0;">${formatTextToParagraphs(payload.mainBodyContent)}</div>`;
    }

    // Works Cited
    if (payload.referencesContent) {
        html += `<h2 style="text-align: center; font-weight: normal; font-size: 1.5rem; margin-top: 2em; margin-bottom: 1em;">Works Cited</h2>`;

        const referencesArray = payload.referencesContent.split('\n')
            .filter(ref => ref.trim() !== '')
            .sort((a, b) => {
                const nameA = (a.match(/<[^>]+>([^<]+)<\/[^>]+>/) ? a.match(/<[^>]+>([^<]+)<\/[^>]+>/)![1] : a).split('(')[0].trim().toLowerCase();
                const nameB = (b.match(/<[^>]+>([^<]+)<\/[^>]+>/) ? b.match(/<[^>]+>([^<]+)<\/[^>]+>/)![1] : b).split('(')[0].trim().toLowerCase();
                return nameA.localeCompare(nameB);
            });

        const formattedReferences = referencesArray
            .map(ref => `<p style="margin-bottom: 0.5em; text-indent: -0.5in; padding-left: 0.5in; line-height: 2;">${ref.trim()}</p>`)
            .join('');

        html += `<div>${formattedReferences}</div>`;
    }

    html += `</div>`;
    return html;
};
const formatAsIEEE = (payload: FormatRequestPayload): string => {
    let html = `<div style="padding: 1in; font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.5;">`;

    // Title and Author
    if (payload.paperHeading) html += `<h1 style="text-align: center; font-weight: bold; font-size: 24pt; margin-bottom: 0.5rem;">${payload.paperHeading}</h1>`;
    if (payload.authorName) html += `<p style="text-align: center; font-size: 11pt; margin-bottom: 1rem;">${payload.authorName}</p>`;

    // Abstract and Keywords
    if (payload.abstractContent) html += `<p style="margin-bottom: 0.5rem;"><b><em>Abstract</em></b>—${formatTextToParagraphs(payload.abstractContent)}</p>`;
    if (payload.keywordsContent) html += `<p style="margin-bottom: 1rem;"><b><em>Index Terms</em></b>—${payload.keywordsContent}</p>`;

    const isStructured = paperTypeConfig[payload.selectedPaperType].hasStructuredBody;

    const sectionsToRender: { [key: string]: string | undefined } = {};

    if (isStructured) {
        if (payload.introductionContent) sectionsToRender[payload.introductionTitle?.toUpperCase() || "INTRODUCTION"] = payload.introductionContent;
        if (payload.literatureReviewContent) sectionsToRender[payload.literatureReviewTitle?.toUpperCase() || "LITERATURE REVIEW"] = payload.literatureReviewContent;
        if (payload.methodologyContent) sectionsToRender[payload.methodologyTitle?.toUpperCase() || "METHODOLOGY"] = payload.methodologyContent;
        if (payload.resultsContent) sectionsToRender[payload.resultsTitle?.toUpperCase() || "RESULTS"] = payload.resultsContent;
        if (payload.discussionContent) sectionsToRender[payload.discussionTitle?.toUpperCase() || "DISCUSSION"] = payload.discussionContent;
        if (payload.conclusionContent) sectionsToRender[payload.conclusionTitle?.toUpperCase() || "CONCLUSION"] = payload.conclusionContent;
        if (payload.recommendationContent) sectionsToRender[payload.recommendationTitle?.toUpperCase() || "RECOMMENDATION"] = payload.recommendationContent;
    } else if (payload.mainBodyContent) {
        sectionsToRender["MAIN BODY"] = payload.mainBodyContent;
    }

    html += `<div style="column-count: 2; column-gap: 0.25in;">`;
    let romanNumeral = 1;
    Object.entries(sectionsToRender).forEach(([title, content]) => {
        if (content) {
            html += `<h2 style="font-weight: bold; text-transform: uppercase; font-size: 10pt; margin-top: 1rem; margin-bottom: 0.5rem;">${toRoman(romanNumeral++)}. ${title}</h2><div style="font-size: 10pt; text-align: justify;">${formatTextToParagraphs(content)}</div>`;
        }
    });
    html += `</div>`;

    if (payload.referencesContent) {
        html += `<h2 style="font-weight: bold; text-transform: uppercase; font-size: 10pt; margin-top: 1rem; column-span: all;">References</h2>`;

        const referencesArray = payload.referencesContent
            .split('\n')
            .filter(ref => ref.trim() !== '')
            .sort();

        const formattedReferences = referencesArray
            .map((ref, index) => `<p style="margin-bottom: 0.25rem; text-indent: -0.25in; padding-left: 0.25in; font-size: 9pt;">[${index + 1}] ${ref.trim()}</p>`)
            .join('');

        html += `<div style="column-count: 2; column-gap: 0.25in; font-size: 9pt; line-height: 1.4;">${formattedReferences}</div>`;
    }

    html += `</div>`;
    return html;
};

const formatAsSpringer = (payload: FormatRequestPayload): string => {
    let html = `<div style="padding: 1in; font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.5;">`;

    // Title and Author
    if (payload.paperHeading) {
        html += `<h1 style="text-align: center; font-size: 18pt; font-weight: bold; margin-bottom: 0.5em;">${payload.paperHeading}</h1>`;
    }
    if (payload.authorName) {
        html += `<p style="text-align: center; font-size: 12pt; margin-bottom: 1em;">${payload.authorName}<sup>1</sup></p>`;
        html += `<p style="text-align: center; font-size: 10pt; margin-bottom: 1.5em;"><sup>1</sup>Institutional Affiliation, City, Country</p>`;
    }

    // Abstract
    if (payload.abstractContent) {
        html += `<div style="font-size: 10pt; border: 1px solid #ccc; padding: 15px; margin-bottom: 1.5em; background-color: #f9f9f9;">`;
        html += `<p style="font-weight: bold; margin-bottom: 0.5em; text-transform: uppercase;">Abstract</p>`;
        html += `<div style="text-align: justify;">${formatTextToParagraphs(payload.abstractContent)}</div>`;
        html += `</div>`;
    }

    // Keywords
    if (payload.keywordsContent) {
        html += `<p style="font-size: 10pt; margin-bottom: 1.5em;"><b>Keywords:</b> <span style="font-style: italic;">${payload.keywordsContent}</span></p>`;
    }

    const isStructured = paperTypeConfig[payload.selectedPaperType].hasStructuredBody;

    const sectionsToRender: { [key: string]: string | undefined } = {};

    if (isStructured) {
        if (payload.introductionContent) sectionsToRender[payload.introductionTitle || "Introduction"] = payload.introductionContent;
        if (payload.literatureReviewContent) sectionsToRender[payload.literatureReviewTitle || "Literature Review"] = payload.literatureReviewContent;
        if (payload.methodologyContent) sectionsToRender[payload.methodologyTitle || "Methodology"] = payload.methodologyContent;
        if (payload.resultsContent) sectionsToRender[payload.resultsTitle || "Results"] = payload.resultsContent;
        if (payload.discussionContent) sectionsToRender[payload.discussionTitle || "Discussion"] = payload.discussionContent;
        if (payload.conclusionContent) sectionsToRender[payload.conclusionTitle || "Conclusion"] = payload.conclusionContent;
        if (payload.recommendationContent) sectionsToRender[payload.recommendationTitle || "Recommendation"] = payload.recommendationContent;
    } else if (payload.mainBodyContent) {
        sectionsToRender["Main Body"] = payload.mainBodyContent;
    }

    let sectionNumber = 1;
    Object.entries(sectionsToRender).forEach(([title, content]) => {
        if (content) {
            html += `<h2 style="font-size: 14pt; font-weight: bold; margin-top: 2em; margin-bottom: 0.5em;">${sectionNumber}. ${title}</h2>`;
            html += `<div style="text-align: justify;">${formatTextToParagraphs(content)}</div>`;
        }
        sectionNumber++;
    });

    // References
    if (payload.referencesContent) {
        html += `<h2 style="font-size: 14pt; font-weight: bold; margin-top: 2.5em; margin-bottom: 1em;">References</h2>`;

        const referencesArray = payload.referencesContent.split('\n')
            .filter((ref: string) => ref.trim() !== '')
            .sort();

        const formattedReferences = referencesArray
            .map((ref: string, index: number) => {
                const hangingIndentStyle = `text-indent: -0.25in; padding-left: 0.25in;`;
                return `<p style="margin-bottom: 0.5em; ${hangingIndentStyle}">[${index + 1}] ${ref.trim()}</p>`;
            })
            .join('');

        html += `<div style="font-size: 10pt;">${formattedReferences}</div>`;
    }

    html += `</div>`;
    return html;
};
const formatAsFPI = (payload: FormatRequestPayload): string => {
    let html = `<div style="padding: 1in; font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5;">`;

    // Title Page
    if (payload.paperHeading) {
        html += `<div style="text-align: center; margin-bottom: 2in;">`;
        html += `<h1 style="font-size: 18pt; font-weight: bold; margin-bottom: 1in; text-transform: uppercase;">${payload.paperHeading}</h1>`;
        if (payload.authorName) {
            html += `<p style="font-size: 14pt; margin-bottom: 0.5in;">${payload.authorName}</p>`;
            html += `<p style="font-size: 12pt;">Department of Computer Engineering<br/>The Federal Polytechnic, Ilaro<br/>Ogun State, Nigeria</p>`;
        }
        html += `<p style="margin-top: 1in; font-size: 12pt;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>`;
        html += `</div><div style="page-break-before: always;"></div>`;
    }

    // Abstract
    if (payload.abstractContent) {
        html += `<h2 style="text-align: center; font-weight: bold; font-size: 14pt; margin-top: 1em; margin-bottom: 0.5em; text-transform: uppercase;">Abstract</h2>`;
        html += `<div style="text-align: justify; text-indent: 0.5in; margin-bottom: 1em;">${formatTextToParagraphs(payload.abstractContent)}</div>`;
    }

    // Keywords
    if (payload.keywordsContent) {
        html += `<p style="text-indent: 0.5in; margin-bottom: 1em;"><b><i>Keywords:</i></b> <span>${payload.keywordsContent}</span></p>`;
    }

    const isStructured = paperTypeConfig[payload.selectedPaperType].hasStructuredBody;

    const sectionsToRender: { [key: string]: string | undefined } = {};

    if (isStructured) {
        if (payload.introductionContent) sectionsToRender[payload.introductionTitle?.toUpperCase() || "INTRODUCTION"] = payload.introductionContent;
        if (payload.literatureReviewContent) sectionsToRender[payload.literatureReviewTitle?.toUpperCase() || "LITERATURE REVIEW"] = payload.literatureReviewContent;
        if (payload.methodologyContent) sectionsToRender[payload.methodologyTitle?.toUpperCase() || "METHODOLOGY"] = payload.methodologyContent;
        if (payload.resultsContent) sectionsToRender[payload.resultsTitle?.toUpperCase() || "RESULTS"] = payload.resultsContent;
        if (payload.discussionContent) sectionsToRender[payload.discussionTitle?.toUpperCase() || "DISCUSSION"] = payload.discussionContent;
        if (payload.conclusionContent) sectionsToRender[payload.conclusionTitle?.toUpperCase() || "CONCLUSION"] = payload.conclusionContent;
        if (payload.recommendationContent) sectionsToRender[payload.recommendationTitle?.toUpperCase() || "RECOMMENDATION"] = payload.recommendationContent;
    } else if (payload.mainBodyContent) {
        sectionsToRender["MAIN BODY"] = payload.mainBodyContent;
    }

    let sectionNumber = 1;
    Object.entries(sectionsToRender).forEach(([title, content]) => {
        if (content) {
            html += `<h2 style="font-weight: bold; font-size: 14pt; text-align: left; margin-top: 2em; margin-bottom: 0.5em;">${sectionNumber}. ${title}</h2>`;
            html += `<div style="text-align: justify; text-indent: 0.5in;">${formatTextToParagraphs(content)}</div>`;
        }
        sectionNumber++;
    });

    // References
    if (payload.referencesContent) {
        html += `<h2 style="text-align: center; font-weight: bold; font-size: 14pt; margin-top: 2.5em; margin-bottom: 1em; text-transform: uppercase;">References</h2>`;

        const referencesArray = payload.referencesContent.split('\n')
            .filter(ref => ref.trim() !== '')
            .sort((a, b) => {
                const nameA = (a.match(/<[^>]+>([^<]+)<\/[^>]+>/) ? a.match(/<[^>]+>([^<]+)<\/[^>]+>/)![1] : a).split('(')[0].trim().toLowerCase();
                const nameB = (b.match(/<[^>]+>([^<]+)<\/[^>]+>/) ? b.match(/<[^>]+>([^<]+)<\/[^>]+>/)![1] : b).split('(')[0].trim().toLowerCase();
                return nameA.localeCompare(nameB);
            });

        const formattedReferences = referencesArray
            .map(ref => `<p style="margin-bottom: 0.5em; text-indent: -0.5in; padding-left: 0.5in; line-height: 1.5; text-align: justify;">${ref.trim()}</p>`)
            .join('');

        html += `<div>${formattedReferences}</div>`;
    }

    html += `</div>`;
    return html;
};

// Helper function to extract subheadings from content
const extractSubheadings = (content: string): string[] => {
    if (!content) return [];

    const lines = content.split('\n');
    const subheadings: string[] = [];

    for (const line of lines) {
        const trimmedLine = line.trim();

        // Check if this looks like a subheading
        const isSubheading = (
            trimmedLine.length > 0 &&
            trimmedLine.length < 100 && // Reasonable subheading length
            (trimmedLine === trimmedLine.toUpperCase() || // All caps
             /^\d+\./.test(trimmedLine) || // Numbered (1., 2., etc.)
             /^[A-Z][^.!?]*$/.test(trimmedLine) && trimmedLine.length < 50) // Title case, short
        );

        if (isSubheading) {
            subheadings.push(trimmedLine);
        }
    }

    return subheadings;
};

// Helper function to estimate page number based on content length
const estimatePageNumber = (content: string, basePage: number, previousContentLength: number): number => {
    // Rough estimation: ~3000 characters per page
    const charsPerPage = 3000;
    const totalChars = content.length + previousContentLength;
    return basePage + Math.floor(totalChars / charsPerPage);
};

const formatAsProjectWriteup = (payload: FormatRequestPayload): string => {
    let html = `<div style="padding: 1in; font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5;">`;

    // Title Page
    if (payload.paperHeading) {
        html += `<div style="text-align: center; margin-bottom: 2in;">`;
        html += `<h1 style="font-size: 18pt; font-weight: bold; margin-bottom: 1in; text-transform: uppercase;">${payload.paperHeading}</h1>`;
        if (payload.authorName) {
            html += `<p style="font-size: 14pt; margin-bottom: 0.5in;">${payload.authorName}</p>`;
            html += `<p style="font-size: 12pt;">Department of Computer Engineering<br/>The Federal Polytechnic, Ilaro<br/>Ogun State, Nigeria</p>`;
        }
        html += `<p style="margin-top: 1in; font-size: 12pt;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>`;
        html += `</div><div style="page-break-before: always;"></div>`;
    }

    // Abstract
    if (payload.abstractContent) {
        html += `<h2 style="text-align: center; font-weight: bold; font-size: 14pt; margin-top: 1em; margin-bottom: 0.5em; text-transform: uppercase;">Abstract</h2>`;
        html += `<div style="text-align: justify; text-indent: 0.5in; margin-bottom: 1em;">${formatTextToParagraphs(payload.abstractContent)}</div>`;
    }

    // Keywords
    if (payload.keywordsContent) {
        html += `<p style="text-indent: 0.5in; margin-bottom: 1em;"><b><i>Keywords:</i></b> <span>${payload.keywordsContent}</span></p>`;
    }

    // Generate dynamic Table of Contents
    html += `<h2 style="text-align: center; font-weight: bold; font-size: 14pt; margin-top: 2em; margin-bottom: 1em; text-transform: uppercase;">Table of Contents</h2>`;
    html += `<div style="margin-bottom: 2em;">`;

    // Static entries
    html += `<p>Abstract........................................................................................................................ii</p>`;
    if (payload.keywordsContent) html += `<p>Keywords.......................................................................................................................iii</p>`;

    // Main sections with subheadings
    const sections = [
        { title: payload.introductionTitle || "Introduction", content: payload.introductionContent, number: 1 },
        { title: payload.literatureReviewTitle || "Literature Review", content: payload.literatureReviewContent, number: 2 },
        { title: payload.methodologyTitle || "Methodology", content: payload.methodologyContent, number: 3 },
        { title: payload.resultsTitle || "Results and Analysis", content: payload.resultsContent, number: 4 },
        { title: payload.discussionTitle || "Discussion", content: payload.discussionContent, number: 5 },
        { title: payload.conclusionTitle || "Conclusion", content: payload.conclusionContent, number: 6 },
        { title: payload.recommendationTitle || "Recommendations", content: payload.recommendationContent, number: 7 },
    ];

    let currentPage = 1;
    let accumulatedLength = 0;

    sections.forEach(section => {
        if (section.content) {
            // Main section entry
            const sectionPage = estimatePageNumber(section.content, currentPage, accumulatedLength);
            const dots = '.'.repeat(Math.max(1, 100 - section.title.length));
            html += `<p>${section.number}. ${section.title}${dots}${sectionPage}</p>`;

            // Extract and add subheadings
            const subheadings = extractSubheadings(section.content);
            subheadings.forEach(subheading => {
                const subPage = estimatePageNumber(subheading, sectionPage, accumulatedLength);
                const subDots = '.'.repeat(Math.max(1, 95 - subheading.length));
                html += `<p style="margin-left: 1em; font-style: italic;">${subheading}${subDots}${subPage}</p>`;
            });

            accumulatedLength += section.content.length;
            currentPage = sectionPage;
        }
    });

    // References
    const referencesPage = estimatePageNumber(payload.referencesContent || '', currentPage, accumulatedLength);
    html += `<p>References.....................................................................................................................${referencesPage}</p>`;
    html += `</div><div style="page-break-before: always;"></div>`;

    // Main Content Sections
    sections.forEach(section => {
        if (section.content) {
            html += `<h2 style="font-weight: bold; font-size: 14pt; margin-top: 1.5em; margin-bottom: 0.5em;">${section.number}. ${section.title}</h2>`;
            html += `<div style="text-align: justify; text-indent: 0.5in;">${formatTextToParagraphs(section.content)}</div>`;
        }
    });

    // References
    if (payload.referencesContent) {
        html += `<h2 style="font-weight: bold; font-size: 14pt; margin-top: 2em; margin-bottom: 1em;">References</h2>`;

        const referencesArray = payload.referencesContent.split('\n')
            .filter(ref => ref.trim() !== '')
            .sort((a, b) => {
                const nameA = (a.match(/<[^>]+>([^<]+)<\/[^>]+>/) ? a.match(/<[^>]+>([^<]+)<\/[^>]+>/)![1] : a).split('(')[0].trim().toLowerCase();
                const nameB = (b.match(/<[^>]+>([^<]+)<\/[^>]+>/) ? b.match(/<[^>]+>([^<]+)<\/[^>]+>/)![1] : b).split('(')[0].trim().toLowerCase();
                return nameA.localeCompare(nameB);
            });

        const formattedReferences = referencesArray
            .map((ref, index) => `<p style="margin-bottom: 0.5em; text-indent: -0.5in; padding-left: 0.5in;">[${index + 1}] ${ref.trim()}</p>`)
            .join('');

        html += `<div>${formattedReferences}</div>`;
    }

    html += `</div>`;
    return html;
};

// --- API & FORMATTING SIMULATION ---
const createPayload = (state: PaperContentState): FormatRequestPayload => ({
    paperHeading: state.paperHeading,
    authorName: state.authorName,
    selectedFormat: state.selectedFormat,
    selectedPaperType: state.selectedPaperType,
    abstractContent: state.abstract,
    keywordsContent: state.keywords,
    referencesContent: state.references,
    ...(paperTypeConfig[state.selectedPaperType].hasStructuredBody ? {
        introductionContent: state.introduction,
        literatureReviewContent: state.literatureReview,
        methodologyContent: state.methodology,
        resultsContent: state.results,
        discussionContent: state.discussion,
        conclusionContent: state.conclusion,
        recommendationContent: state.recommendation,
        introductionTitle: state.introductionTitle,
        literatureReviewTitle: state.literatureReviewTitle,
        methodologyTitle: state.methodologyTitle,
        resultsTitle: state.resultsTitle,
        discussionTitle: state.discussionTitle,
        conclusionTitle: state.conclusionTitle,
        recommendationTitle: state.recommendationTitle,
    } : {
        mainBodyContent: state.mainContent,
    })
});
const simulateFormatPreviewApi = (payload: FormatRequestPayload): Promise<string> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            let html;
            switch (payload.selectedFormat) {
                case FormatType.APA7: html = formatAsAPA(payload); break;
                case FormatType.MLA9: html = formatAsMLA(payload); break;
                case FormatType.IEEE: html = formatAsIEEE(payload); break;
                case FormatType.Springer: html = formatAsSpringer(payload); break;
                case FormatType.FPI:
                    if (payload.selectedPaperType === PaperType.ProjectWriteup) {
                        html = formatAsProjectWriteup(payload);
                    } else {
                        html = formatAsFPI(payload);
                    }
                    break;
                default: html = `<p style="color: red;">Unsupported format selected.</p>`;
            }
            resolve(html);
        }, 500);
    });
};


// --- MAIN APP COMPONENT ---
interface FormattedPaperProps {
    htmlContent: string;
    setHtmlContent: (html: string) =>void;
}

const FormattedPaper: React.FC<FormattedPaperProps> = ({ htmlContent, setHtmlContent }) => {
    const handleCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
    };

    return (
        <div id="formatted-paper-container" className="bg-white rounded-lg shadow-xl w-full h-full overflow-y-auto border border-gray-300">
            <div className="toolbar p-2 border-b border-gray-300 flex gap-2 flex-wrap">
                <button onClick={() => handleCommand('bold')} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 font-bold" title="Bold">B</button>
                <button onClick={() => handleCommand('italic')} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 italic" title="Italic">I</button>
                <button onClick={() => handleCommand('underline')} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 underline" title="Underline">U</button>
                <button onClick={() => handleCommand('strikeThrough')} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 line-through" title="Strikethrough">S</button>
                <button onClick={() => handleCommand('subscript')} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" title="Subscript">X₂</button>
                <button onClick={() => handleCommand('superscript')} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" title="Superscript">X²</button>
                <button onClick={() => handleCommand('insertUnorderedList')} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" title="Bullet List">•</button>
                <button onClick={() => handleCommand('insertOrderedList')} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" title="Numbered List">1.</button>
                <button onClick={() => handleCommand('indent')} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" title="Increase Indent">→</button>
                <button onClick={() => handleCommand('outdent')} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" title="Decrease Indent">←</button>
                <button onClick={() => handleCommand('justifyLeft')} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" title="Align Left">⬅</button>
                <button onClick={() => handleCommand('justifyCenter')} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" title="Align Center">⬌</button>
                <button onClick={() => handleCommand('justifyRight')} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" title="Align Right">➡</button>
                <button onClick={() => handleCommand('justifyFull')} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" title="Justify">⬌⬌</button>
                <button onClick={() => handleCommand('formatBlock', 'h1')} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" title="Heading 1">H1</button>
                <button onClick={() => handleCommand('formatBlock', 'h2')} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" title="Heading 2">H2</button>
                <button onClick={() => handleCommand('formatBlock', 'h3')} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" title="Heading 3">H3</button>
                <button onClick={() => handleCommand('formatBlock', 'p')} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" title="Paragraph">P</button>
                <button onClick={() => handleCommand('formatBlock', 'blockquote')} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" title="Blockquote">"</button>
                <button onClick={() => handleCommand('removeFormat')} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" title="Remove Formatting">⌫</button>
                <button onClick={() => handleCommand('undo')} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" title="Undo">↶</button>
                <button onClick={() => handleCommand('redo')} className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" title="Redo">↷</button>
            </div>
            <div
                className="p-4 h-full overflow-y-auto"
                contentEditable
                dangerouslySetInnerHTML={{ __html: htmlContent }}
                onInput={(e) => setHtmlContent(e.currentTarget.innerHTML)}
            />
        </div>
    );
};

interface WysiwygEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    height?: string;
}

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({ value, onChange, placeholder, height = "200px" }) => {
    return (
        <textarea
            className="wysiwyg-editor-container border border-gray-300 rounded-lg p-2 w-full"
            style={{ height }}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
        />
    );
};


const App: React.FC = () => {
    const [areDownloadScriptsLoaded, setAreDownloadScriptsLoaded] = useState(false);
    const [scriptLoadingError, setScriptLoadingError] = useState<string | null>(null);

    // State management
    const [paperHeading, setPaperHeading] = useState<string>("");
    const [authorName, setAuthorName] = useState<string>("");
    const [selectedFormat, setSelectedFormat] = useState<FormatType>(FormatType.FPI);
    const [selectedPaperType, setSelectedPaperType] = useState<PaperType>(PaperType.ResearchPaper);
    const [abstract, setAbstract] = useState<string>("");
    const [keywords, setKeywords] = useState<string>("");
    const [mainContent, setMainContent] = useState<string>("");
    const [introduction, setIntroduction] = useState<string>("");
    const [literatureReview, setLiteratureReview] = useState<string>("");
    const [methodology, setMethodology] = useState<string>("");
    const [results, setResults] = useState<string>("");
    const [discussion, setDiscussion] = useState<string>("");
    const [conclusion, setConclusion] = useState<string>("");
    const [recommendation, setRecommendation] = useState<string>("");
    const [references, setReferences] = useState<string>("");
    const [introductionTitle, setIntroductionTitle] = useState<string>("Introduction");
    const [literatureReviewTitle, setLiteratureReviewTitle] = useState<string>("Literature Review");
    const [methodologyTitle, setMethodologyTitle] = useState<string>("Methodology");
    const [resultsTitle, setResultsTitle] = useState<string>("Results");
    const [discussionTitle, setDiscussionTitle] = useState<string>("Discussion");
    const [conclusionTitle, setConclusionTitle] = useState<string>("Conclusion");
    const [recommendationTitle, setRecommendationTitle] = useState<string>("Recommendation");
    const [formattedContent, setFormattedContent] = useState<string>("<p>Start typing or paste your paper content here!</p>");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showDownloadOptions, setShowDownloadOptions] = useState<boolean>(false);

    const configKey = selectedPaperType;
    const { hasAbstract, hasKeywords, hasStructuredBody } = paperTypeConfig[configKey];

    useEffect(() => {
        const scriptsToLoad = [
            'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js'
        ];

        let loadedCount = 0;
        const totalScripts = scriptsToLoad.length;
        const scriptErrors: string[] = [];

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const handleScriptLoad = (_src: string) => {
            loadedCount++;
            if (loadedCount === totalScripts && scriptErrors.length === 0) {
                setAreDownloadScriptsLoaded(true);
                setScriptLoadingError(null);
            } else if (loadedCount === totalScripts && scriptErrors.length > 0) {
                setScriptLoadingError(`Some download features might not work. Failed to load: ${scriptErrors.map(s => s.split('/').pop()).join(', ')}`);
            }
        };

        const handleScriptError = (src: string) => {
            scriptErrors.push(src);
            loadedCount++;
            if (loadedCount === totalScripts) {
                setScriptLoadingError(`Some download features might not work. Failed to load: ${scriptErrors.map(s => s.split('/').pop()).join(', ')}`);
                setAreDownloadScriptsLoaded(false);
            }
        };

        scriptsToLoad.forEach(src => {
            const isCss = src.endsWith('.css');
            const element = document.createElement(isCss ? 'link' : 'script');
            
            if (isCss) {
                (element as HTMLLinkElement).rel = 'stylesheet';
                (element as HTMLLinkElement).href = src;
            } else {
                (element as HTMLScriptElement).src = src;
                (element as HTMLScriptElement).async = true;
            }
            
            element.onload = () => handleScriptLoad(src);
            element.onerror = () => handleScriptError(src);
            document.head.appendChild(element);
        });

        return () => {
            scriptsToLoad.forEach(src => {
                const existingElement = document.querySelector(`[src="${src}"], [href="${src}"]`);
                if (existingElement) {
                    existingElement.remove();
                }
            });
        };
    }, []);

    useEffect(() => {
        if (!hasAbstract) setAbstract("");
        if (!hasKeywords) setKeywords("");

        if (hasStructuredBody) {
            setMainContent("");
            setIntroductionTitle("Introduction");
            setLiteratureReviewTitle("Literature Review");
            setMethodologyTitle("Methodology");
            setResultsTitle("Results");
            setDiscussionTitle("Discussion");
            setConclusionTitle("Conclusion");
            setRecommendationTitle("Recommendation");
        } else {
            setIntroduction("");
            setLiteratureReview("");
            setMethodology("");
            setResults("");
            setDiscussion("");
            setConclusion("");
            setRecommendation("");
            setIntroductionTitle("");
            setLiteratureReviewTitle("");
            setMethodologyTitle("");
            setResultsTitle("");
            setDiscussionTitle("");
            setConclusionTitle("");
            setRecommendationTitle("");
        }
    }, [selectedPaperType, hasAbstract, hasKeywords, hasStructuredBody]);

    useEffect(() => {
        const currentState: PaperContentState = {
            paperHeading, authorName, selectedFormat, selectedPaperType,
            abstract, keywords, mainContent, introduction, literatureReview,
            methodology, results, discussion, conclusion, recommendation, references,
            introductionTitle, literatureReviewTitle, methodologyTitle,
            resultsTitle, discussionTitle, conclusionTitle, recommendationTitle
        };

        const handler = setTimeout(() => {
            setIsLoading(true);
            setError(null);
            const payload = createPayload(currentState);

            simulateFormatPreviewApi(payload)
                .then(html => {
                    setFormattedContent(html);
                    // Save to localStorage for demo purposes
                    const savedPapers = JSON.parse(localStorage.getItem('formattedPapers') || '[]');
                    const paperData = {
                        id: Date.now(),
                        title: payload.paperHeading || 'Untitled Paper',
                        format: payload.selectedFormat,
                        content: html,
                        timestamp: new Date().toISOString()
                    };
                    savedPapers.unshift(paperData); // Add to beginning
                    // Keep only last 10 papers
                    if (savedPapers.length > 10) savedPapers.splice(10);
                    localStorage.setItem('formattedPapers', JSON.stringify(savedPapers));
                })
                .catch(err => {
                    console.error("Error formatting preview:", err);
                    setError("Could not load preview. Please try again.");
                    setFormattedContent(`<p style="color: red;">Error loading preview.</p>`);
                })
                .finally(() => setIsLoading(false));
        }, 500);

        return () => clearTimeout(handler);
    }, [
        paperHeading, authorName, selectedFormat, selectedPaperType,
        abstract, keywords, mainContent, introduction, literatureReview,
        methodology, results, discussion, conclusion, recommendation, references,
        introductionTitle, literatureReviewTitle, methodologyTitle,
        resultsTitle, discussionTitle, conclusionTitle, recommendationTitle
    ]);

    const handleDownloadClick = () => {
        if (!formattedContent.trim()) {
            setError("Please provide content to format before downloading.");
            setShowDownloadOptions(false);
            return;
        }

        if (scriptLoadingError) {
            setError(scriptLoadingError);
            setShowDownloadOptions(false);
            return;
        }

        if (!areDownloadScriptsLoaded) {
            setError("Download libraries are still loading. Please wait a moment.");
            setShowDownloadOptions(false);
            return;
        }
        
        setShowDownloadOptions(prev => !prev);
        setError(null);
    };

    const handleDownloadPdf = async () => {
        setShowDownloadOptions(false);
        setIsLoading(true);
        setError(null);

        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.width = '8.5in';
        tempContainer.innerHTML = formattedContent;
        document.body.appendChild(tempContainer);
    
        if (!tempContainer || !window.html2canvas || !window.jspdf) {
            setError("PDF download library not ready. Please try again in a moment.");
            setIsLoading(false);
            document.body.removeChild(tempContainer);
            return;
        }
        
        try {
            const { jsPDF } = window.jspdf;
            const canvas = await window.html2canvas(tempContainer, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgProps = pdf.getImageProperties(imgData);
            const imgWidth = imgProps.width;
            const imgHeight = imgProps.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

            let currentHeight = 0;
            const pageHeight = pdf.internal.pageSize.height;
            const canvasPage = document.createElement('canvas');
            canvasPage.width = imgWidth;
            canvasPage.height = pageHeight / ratio;

            const ctx = canvasPage.getContext('2d');
            while (currentHeight < imgHeight) {
                ctx?.drawImage(canvas, 0, currentHeight, imgWidth, canvasPage.height, 0, 0, imgWidth, canvasPage.height);
                const pageData = canvasPage.toDataURL('image/png', 1.0);
                
                if (currentHeight > 0) {
                    pdf.addPage();
                }
                pdf.addImage(pageData, 'PNG', 0, 0, pdfWidth, 0, undefined, 'FAST');
                currentHeight += canvasPage.height;
            }

            pdf.save(`${(paperHeading.replace(/<[^>]*>?/gm, '') || 'formatted-paper').substring(0, 50)}.pdf`);
        } catch (err) {
            console.error("PDF generation failed:", err);
            setError("Failed to generate PDF. Please try again.");
        } finally {
            setIsLoading(false);
            document.body.removeChild(tempContainer);
        }
    };

    const handleDownloadWord = async () => {
        setShowDownloadOptions(false);
        setIsLoading(true);
        setError(null);

        if (!window.saveAs) {
            setError("Word download functionality not ready. Please try again in a moment.");
            setIsLoading(false);
            return;
        }

        try {
            const cleanPaperHeading = paperHeading.replace(/<[^>]*>?/gm, '');
            const filename = `${cleanPaperHeading || 'formatted-paper'}.doc`;
            
            const blob = new Blob(['<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>', formattedContent, '</body></html>'], {
                type: 'application/msword'
            });

            window.saveAs(blob, filename);
        } catch (err) {
            console.error("Error generating Word document:", err);
            setError("Failed to generate Word document. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const isDownloadEnabled = formattedContent.trim() !== "" && areDownloadScriptsLoaded && !scriptLoadingError;

    return (
        <>
            <GlobalStyle />
            <HeaderComponent />
            <AppWrapper>
                <MainContainer>
                    <ControlsWrapper>
                        <StyledLabel htmlFor="paperHeading">Paper Title:</StyledLabel>
                        <WysiwygEditor
                            value={paperHeading}
                            onChange={setPaperHeading}
                            placeholder="e.g., The Future of Artificial Intelligence"
                            height="100px"
                        />

                        <StyledLabel htmlFor="authorName">Author Name(s):</StyledLabel>
                        <WysiwygEditor
                            value={authorName}
                            onChange={setAuthorName}
                            placeholder="e.g., Jane Doe, John Smith"
                            height="100px"
                        />

                        <StyledLabel htmlFor="paperType">Paper Type:</StyledLabel>
                        <StyledSelect
                            id="paperType"
                            value={selectedPaperType}
                            onChange={(e) => setSelectedPaperType(e.target.value as PaperType)}
                        >
                            {Object.values(PaperType).map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </StyledSelect>

                        <StyledLabel htmlFor="formatType">Formatting Style:</StyledLabel>
                        <StyledSelect
                            id="formatType"
                            value={selectedFormat}
                            onChange={(e) => setSelectedFormat(e.target.value as FormatType)}
                        >
                            {Object.values(FormatType).map((format) => (
                                <option key={format} value={format}>{format}</option>
                            ))}
                        </StyledSelect>

                        {hasAbstract && (
                            <>
                                <StyledLabel htmlFor="abstract">Abstract:</StyledLabel>
                                <WysiwygEditor
                                    value={abstract}
                                    onChange={setAbstract}
                                    placeholder="Provide a brief summary..."
                                    height="200px"
                                />
                            </>
                        )}

                        {hasKeywords && (
                            <>
                                <StyledLabel htmlFor="keywords">Keywords:</StyledLabel>
                                <WysiwygEditor
                                    value={keywords}
                                    onChange={setKeywords}
                                    placeholder="e.g., AI, Machine Learning, Ethics..."
                                    height="100px"
                                />
                            </>
                        )}

                        {hasStructuredBody ? (
                            <>
                                <StyledLabel htmlFor="introductionTitle">Introduction Title:</StyledLabel>
                                <WysiwygEditor
                                    value={introductionTitle}
                                    onChange={setIntroductionTitle}
                                    placeholder="e.g., Preamble"
                                    height="80px"
                                />
                                
                                <StyledLabel htmlFor="introduction">Introduction Content:</StyledLabel>
                                <WysiwygEditor
                                    value={introduction}
                                    onChange={setIntroduction}
                                    placeholder="State the problem and purpose..."
                                    height="200px"
                                />

                                <StyledLabel htmlFor="literatureReviewTitle">Literature Review Title:</StyledLabel>
                                <WysiwygEditor
                                    value={literatureReviewTitle}
                                    onChange={setLiteratureReviewTitle}
                                    placeholder="e.g., Related Works"
                                    height="80px"
                                />
                                
                                <StyledLabel htmlFor="literatureReview">Literature Review Content:</StyledLabel>
                                <WysiwygEditor
                                    value={literatureReview}
                                    onChange={setLiteratureReview}
                                    placeholder="Summarize relevant research..."
                                    height="200px"
                                />

                                <StyledLabel htmlFor="methodologyTitle">Methodology Title:</StyledLabel>
                                <WysiwygEditor
                                    value={methodologyTitle}
                                    onChange={setMethodologyTitle}
                                    placeholder="e.g., Research Design"
                                    height="80px"
                                />
                                
                                <StyledLabel htmlFor="methodology">Methodology Content:</StyledLabel>
                                <WysiwygEditor
                                    value={methodology}
                                    onChange={setMethodology}
                                    placeholder="Describe your research methods..."
                                    height="200px"
                                />

                                <StyledLabel htmlFor="resultsTitle">Results Title:</StyledLabel>
                                <WysiwygEditor
                                    value={resultsTitle}
                                    onChange={setResultsTitle}
                                    placeholder="e.g., Findings"
                                    height="80px"
                                />
                                
                                <StyledLabel htmlFor="results">Results Content:</StyledLabel>
                                <WysiwygEditor
                                    value={results}
                                    onChange={setResults}
                                    placeholder="Present your findings..."
                                    height="200px"
                                />

                                <StyledLabel htmlFor="discussionTitle">Discussion Title:</StyledLabel>
                                <WysiwygEditor
                                    value={discussionTitle}
                                    onChange={setDiscussionTitle}
                                    placeholder="e.g., Analysis"
                                    height="80px"
                                />
                                
                                <StyledLabel htmlFor="discussion">Discussion Content:</StyledLabel>
                                <WysiwygEditor
                                    value={discussion}
                                    onChange={setDiscussion}
                                    placeholder="Interpret your findings..."
                                    height="200px"
                                />

                                <StyledLabel htmlFor="conclusionTitle">Conclusion Title:</StyledLabel>
                                <WysiwygEditor
                                    value={conclusionTitle}
                                    onChange={setConclusionTitle}
                                    placeholder="e.g., Summary"
                                    height="80px"
                                />
                                
                                <StyledLabel htmlFor="conclusion">Conclusion Content:</StyledLabel>
                                <WysiwygEditor
                                    value={conclusion}
                                    onChange={setConclusion}
                                    placeholder="Summarize your work and its implications..."
                                    height="200px"
                                />

                                <StyledLabel htmlFor="recommendationTitle">Recommendation Title:</StyledLabel>
                                <WysiwygEditor
                                    value={recommendationTitle}
                                    onChange={setRecommendationTitle}
                                    placeholder="e.g., Future Work"
                                    height="80px"
                                />
                                
                                <StyledLabel htmlFor="recommendation">Recommendation Content:</StyledLabel>
                                <WysiwygEditor
                                    value={recommendation}
                                    onChange={setRecommendation}
                                    placeholder="Suggest future research directions..."
                                    height="200px"
                                />
                            </>
                        ) : (
                            <>
                                <StyledLabel htmlFor="mainContent">Main Body:</StyledLabel>
                                <WysiwygEditor
                                    value={mainContent}
                                    onChange={setMainContent}
                                    placeholder="Paste the main content of your paper here..."
                                    height="400px"
                                />
                            </>
                        )}

                        <StyledLabel htmlFor="references">References:</StyledLabel>
                        <WysiwygEditor
                            value={references}
                            onChange={setReferences}
                            placeholder="List your references here, one per line."
                            height="200px"
                        />

                        {(error || scriptLoadingError) && <ErrorMessage>{error || scriptLoadingError}</ErrorMessage>}

                        <DownloadButton
                            onClick={handleDownloadClick}
                            disabled={isLoading || !isDownloadEnabled}
                        >
                            {isLoading ? "Processing..." : "Download Formatted Paper"}
                        </DownloadButton>

                        {showDownloadOptions && (
                            <DownloadOptionsContainer>
                                <DownloadOptionButton onClick={handleDownloadPdf} disabled={!areDownloadScriptsLoaded || !!scriptLoadingError}>Download as PDF</DownloadOptionButton>
                                <DownloadOptionButton onClick={handleDownloadWord} disabled={!areDownloadScriptsLoaded || !!scriptLoadingError}>Download as Word</DownloadOptionButton>
                            </DownloadOptionsContainer>
                        )}
                    </ControlsWrapper>
                    <PreviewContainer>
                        {isLoading ? (
                            <LoadingIndicator>Updating preview...</LoadingIndicator>
                        ) : (
                            <div className="w-full h-full flex flex-col">
                                <FormattedPaper 
                                    htmlContent={formattedContent} 
                                    setHtmlContent={setFormattedContent} 
                                />
                            </div>
                        )}
                    </PreviewContainer>
                </MainContainer>
            </AppWrapper>
        </>
    );
};

export default App;