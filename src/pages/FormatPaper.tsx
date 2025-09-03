import React, { useState, useEffect } from "react";

enum PaperType {
    Essay = "Essay",
    ResearchPaper = "Research Paper",
    JournalArticle = "Journal Article",
    Thesis = "Thesis",
    Report = "Report",
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
const StyledInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => <input {...props} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50" />;
const StyledTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => <textarea {...props} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50" />;
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

// Declare ReactQuill and external libraries as global types
declare global {
    interface Window {
        ReactQuill: any;
        Quill: any;
        html2canvas: any;
        jspdf: any;
        saveAs: any;
    }
}

// --- CONFIGURATION ---
const paperTypeConfig: Record<PaperType, { hasAbstract: boolean; hasKeywords: boolean; hasStructuredBody: boolean }> = {
    [PaperType.Essay]: { hasAbstract: false, hasKeywords: false, hasStructuredBody: false },
    [PaperType.ResearchPaper]: { hasAbstract: true, hasKeywords: true, hasStructuredBody: true },
    [PaperType.JournalArticle]: { hasAbstract: true, hasKeywords: true, hasStructuredBody: true },
    [PaperType.Thesis]: { hasAbstract: true, hasKeywords: true, hasStructuredBody: true },
    [PaperType.Report]: { hasAbstract: true, hasKeywords: false, hasStructuredBody: false },
};

// --- FORMATTING FUNCTIONS ---

const formatTextToParagraphs = (htmlContent: string): string => {
    return htmlContent;
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

    if (payload.paperHeading) {
        html += `<p style="text-align: center; font-weight: bold; margin-bottom: 0;">${payload.paperHeading}</p>`;
    }
    if (payload.authorName) {
        html += `<p style="text-align: center; margin-top: 0;">${payload.authorName}</p><br/>`;
    }

    if (payload.abstractContent) {
        html += `<h2 style="text-align: center; font-weight: bold; margin-top: 1em; margin-bottom: 0.5em;">Abstract</h2>`;
        html += `<div style="text-indent: 0.5in;">${formatTextToParagraphs(payload.abstractContent)}</div>`;
    }

    if (payload.keywordsContent) {
        html += `<p style="text-indent: 0.5in; margin-top: 0.5em;"><i>Keywords:</i> <span>${payload.keywordsContent}</span></p>`;
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
                html += `<h2 style="text-align: center; font-weight: bold; margin-top: 1em; margin-bottom: 0.5em;">${section.title}</h2>`;
                html += `<div style="text-indent: 0.5in;">${formatTextToParagraphs(section.content)}</div>`;
            }
        });
    } else if (payload.mainBodyContent) {
        html += `<div style="text-indent: 0.5in; margin-top: 1em;">${formatTextToParagraphs(payload.mainBodyContent)}</div>`;
    }

    if (payload.referencesContent) {
        html += `<h2 style="text-align: center; font-weight: bold; margin-top: 1em; margin-bottom: 0.5em;">References</h2>`;
        
        const referencesArray = payload.referencesContent.split('\n')
            .filter(ref => ref.trim() !== '')
            .sort((a, b) => {
                const nameA = (a.match(/<[^>]+>([^<]+)<\/[^>]+>/) ? a.match(/<[^>]+>([^<]+)<\/[^>]+>/)![1] : a).split('(')[0].trim().toLowerCase();
                const nameB = (b.match(/<[^>]+>([^<]+)<\/[^>]+>/) ? b.match(/<[^>]+>([^<]+)<\/[^>]+>/)![1] : b).split('(')[0].trim().toLowerCase();
                return nameA.localeCompare(nameB);
            });

        const formattedReferences = referencesArray
            .map(ref => `<p style="margin-bottom: 0; text-indent: -0.5in; padding-left: 0.5in;">${ref.trim()}</p>`)
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

    if (payload.authorName) {
        html += `<p style="margin-bottom: 0;">${payload.authorName}</p>`;
    }
    html += `<p style="margin-bottom: 0;">Professor Name</p>`;
    html += `<p style="margin-bottom: 0;">Course Name</p>`;
    html += `<p style="margin-bottom: 1em;">${date}</p>`;

    if (payload.paperHeading) {
        html += `<h1 style="text-align: center; font-weight: normal; font-size: 1.5rem; margin-top: 0; margin-bottom: 1em;">${payload.paperHeading}</h1>`;
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
            .map(ref => `<p style="margin-bottom: 0; text-indent: -0.5in; padding-left: 0.5in;">${ref.trim()}</p>`)
            .join('');
            
        html += `<div>${formattedReferences}</div>`;
    }

    html += `</div>`;
    return html;
};

const formatAsIEEE = (payload: FormatRequestPayload): string => {
    let html = `<div style="padding: 1in; font-family: 'Times New Roman', serif;">`;
    if (payload.paperHeading) html += `<h1 style="text-align: center; font-weight: bold; font-size: 1.5rem; margin-bottom: 0.25rem;">${payload.paperHeading}</h1>`;
    if (payload.authorName) html += `<p style="text-align: center; font-size: 1.125rem; margin-bottom: 1.5rem;">${payload.authorName}</p>`;
    if (payload.abstractContent) html += `<p><b><em>Abstract</em>—<span>${formatTextToParagraphs(payload.abstractContent)}</span></b></p>`;
    if (payload.keywordsContent) html += `<p><b><em>Keywords</em>—<span>${payload.keywordsContent}</span></b></p><br/>`;

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

    html += `<div style="column-count: 2; column-gap: 20px;">`;
    let romanNumeral = 1;
    Object.entries(sectionsToRender).forEach(([title, content]) => {
        if (content) {
            html += `<h2 style="font-weight: bold; text-transform: uppercase; font-size: 0.875rem; margin-top: 1rem;"> ${toRoman(romanNumeral++)}. <span>${title}</span></h2><div>${formatTextToParagraphs(content)}</div>`;
        }
    });
    html += `</div>`;

    if (payload.referencesContent) {
        html += `<h2 style="font-weight: bold; text-transform: uppercase; font-size: 0.875rem; margin-top: 1rem; column-span: all;">References</h2>`;
        
        const referencesArray = payload.referencesContent.split('\n')
            .filter(ref => ref.trim() !== '');

        const formattedReferences = referencesArray
            .map((ref, index) => `<p style="margin-bottom: 0; text-indent: -1.25em; padding-left: 1.25em;">[${index + 1}] <span>${ref.trim()}</span></p>`)
            .join('');
            
        html += `<div style="column-count: 2; column-gap: 20px; font-size: 0.9em; line-height: 1.4;">${formattedReferences}</div>`;
    }
    
    html += `</div>`;
    return html;
};

const formatAsSpringer = (payload: FormatRequestPayload): string => {
    let html = `<div style="padding: 1in; font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.5;">`;

    if (payload.paperHeading) {
        html += `<h1 style="text-align: center; font-size: 16pt; font-weight: bold; margin-bottom: 0.5em;">${payload.paperHeading}</h1>`;
    }
    if (payload.authorName) {
        html += `<p style="text-align: center; font-size: 10pt; margin-bottom: 1.5em;">${payload.authorName}</p>`;
    }

    if (payload.abstractContent) {
        html += `<div style="font-size: 10pt; border: 1px solid #eee; padding: 10px; margin-bottom: 1.5em;">`;
        html += `<p style="font-weight: bold; margin-bottom: 0.5em;">Abstract</p>`;
        html += `<div>${formatTextToParagraphs(payload.abstractContent)}</div>`;
        html += `</div>`;
    }

    if (payload.keywordsContent) {
        html += `<p style="font-size: 10pt; margin-bottom: 1.5em;"><b>Keywords:</b> <span>${payload.keywordsContent}</span></p>`;
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
        sectionsToRender["MAIN BODY"] = payload.mainBodyContent;
    }

    let sectionNumber = 1;
    Object.entries(sectionsToRender).forEach(([title, content]) => {
        if (content) {
            html += `<h2 style="font-size: 13pt; font-weight: bold; margin-top: 1.5em; margin-bottom: 0.5em;">${sectionNumber++} <span>${title}</span></h2>`;
            html += `<div>${formatTextToParagraphs(content)}</div>`;
        }
    });

    if (payload.referencesContent) {
        html += `<h2 style="font-size: 14pt; font-weight: bold; margin-top: 2em; margin-bottom: 1em;">References</h2>`;
        
        const formattedReferences = payload.referencesContent.split('\n')
            .filter((ref: string) => ref.trim() !== '')
            .map((ref: string, index: number) => {
                const hangingIndentStyle = `text-indent: -0.2in; padding-left: 0.2in;`;
                return `<p style="margin-bottom: 0.5em; ${hangingIndentStyle}">[${index + 1}] ${ref.trim()}</p>`;
            })
            .join('');
            
        html += `<div style="font-size: 10pt;">${formattedReferences}</div>`;
    }

    html += `</div>`;
    return html;
};

const formatAsFPI = (payload: FormatRequestPayload): string => {
    let html = `<div style="padding: 1in; font-family: 'Times New Roman', serif; font-size: 12pt;">`;
    const bodyLineHeight = 1.5;

    if (payload.paperHeading) {
        html += `<h1 style="text-align: center; font-weight: bold; font-size: 16pt; margin-bottom: 0.5em;">${payload.paperHeading}</h1>`;
    }

    if (payload.authorName) {
        html += `<p style="text-align: center; font-weight: bold; font-size: 12pt; margin-bottom: 0;">${payload.authorName}</p>`;
        html += `<p style="text-align: center; font-size: 10pt; margin-top: 0; margin-bottom: 1.5em;">Department Name, The Federal Polytechnic, Ilaro, Ogun State, Nigeria.</p>`;
    }

    if (payload.abstractContent) {
        html += `<h2 style="text-align: center; font-weight: bold; font-size: 12pt; margin-top: 1em; margin-bottom: 0.5em;">ABSTRACT</h2>`;
        html += `<div style="text-align: justify; line-height: 1; margin-bottom: 1em;">${formatTextToParagraphs(payload.abstractContent)}</div>`;
    }

    if (payload.keywordsContent) {
        html += `<p style="margin-bottom: 1em;"><b><i>Keywords:</i></b> <span>${payload.keywordsContent}</span></p>`;
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
            html += `<h2 style="font-weight: bold; font-size: 12pt; text-align: left; margin-top: 1.5em; margin-bottom: 0.5em;">${sectionNumber++}. <span>${title}</span></h2>`;
            html += `<div style="text-align: justify; line-height: ${bodyLineHeight};">${formatTextToParagraphs(content)}</div>`;
        }
    });

    if (payload.referencesContent) {
        html += `<h2 style="text-align: center; font-weight: bold; font-size: 12pt; margin-top: 2em; margin-bottom: 1em;">REFERENCES</h2>`;

        const referencesArray = payload.referencesContent.split('\n')
            .filter(ref => ref.trim() !== '')
            .sort((a, b) => {
                const nameA = (a.match(/<[^>]+>([^<]+)<\/[^>]+>/) ? a.match(/<[^>]+>([^<]+)<\/[^>]+>/)![1] : a).split('(')[0].trim().toLowerCase();
                const nameB = (b.match(/<[^>]+>([^<]+)<\/[^>]+>/) ? b.match(/<[^>]+>([^<]+)<\/[^>]+>/)![1] : b).split('(')[0].trim().toLowerCase();
                return nameA.localeCompare(nameB);
            });

        const formattedReferences = referencesArray
            .map(ref => `<p style="margin-bottom: 0.5em; text-indent: -0.5in; padding-left: 0.5in; line-height: ${bodyLineHeight}; text-align: justify;">${ref.trim()}</p>`)
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
                case FormatType.FPI: html = formatAsFPI(payload); break;
                default: html = `<p style="color: red;">Unsupported format selected.</p>`;
            }
            resolve(html);
        }, 500);
    });
};

// --- MAIN APP COMPONENT ---

interface FormattedPaperProps {
    htmlContent: string;
    setHtmlContent: (html: string) => void;
    quillModules: any;
    quillFormats: any;
}

const FormattedPaper: React.FC<FormattedPaperProps> = ({ htmlContent, setHtmlContent, quillModules, quillFormats }) => {
    return (
        <div id="formatted-paper" className="bg-white rounded-lg shadow-xl w-full h-full overflow-y-auto border border-gray-300">
            {window.ReactQuill ? (
                <div className="flex flex-col h-full">
                    <window.ReactQuill
                        theme="snow"
                        value={htmlContent}
                        onChange={setHtmlContent}
                        modules={quillModules}
                        formats={quillFormats}
                        className="flex-grow min-h-[100px] h-full"
                    />
                    <style>
                        {`
                        #formatted-paper .ql-toolbar.ql-snow {
                            background-color: #f0f0f0 !important;
                            border-bottom: 1px solid #ccc !important;
                            position: sticky;
                            top: 0;
                            z-index: 10;
                        }
                        #formatted-paper .ql-container.ql-snow {
                            border-top: none !important;
                            flex-grow: 1;
                            overflow-y: auto;
                        }
                        `}
                    </style>
                </div>
            ) : (
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} className="p-4" />
            )}
        </div>
    );
};

// WYSIWYG Editor Component
interface WysiwygEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    height?: string;
}

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({ value, onChange, placeholder, height = "200px" }) => {
    const quillModules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['link', 'image'],
            ['clean']
        ],
    };

    const quillFormats = [
        'header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'align', 'link', 'image'
    ];

    return (
        <div className="wysiwyg-editor-container border border-gray-300 rounded-lg overflow-hidden">
            {window.ReactQuill ? (
                <window.ReactQuill
                    theme="snow"
                    value={value}
                    onChange={onChange}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder={placeholder}
                    style={{ height, minHeight: height }}
                />
            ) : (
                <StyledTextarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    style={{ height, minHeight: height }}
                    className="w-full p-3"
                />
            )}
        </div>
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

    // Quill toolbar configuration for the main preview
    const quillModules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['link', 'image'],
            ['clean']
        ],
    };

    const quillFormats = [
        'header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'align', 'link', 'image'
    ];

    // Load external scripts for downloads and WYSIWYG editors
    useEffect(() => {
        const scriptsToLoad = [
            'https://unpkg.com/react@18/umd/react.production.min.js',
            'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js',
            'https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.min.js',
            'https://cdn.jsdelivr.net/npm/react-quill@2.0.0/dist/react-quill.min.js',
            'https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.snow.css'
        ];

        let loadedCount = 0;
        const totalScripts = scriptsToLoad.length;
        const scriptErrors: string[] = [];

        const handleScriptLoad = (src: string) => {
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

    // Reset fields when paper type changes
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

    // Format content when inputs change
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
                .then(html => setFormattedContent(html))
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

        const paperElement = document.getElementById('formatted-paper');
        if (!paperElement || !window.html2canvas || !window.jspdf) {
            setError("PDF download library not ready. Please try again in a moment.");
            setIsLoading(false);
            return;
        }
        
        try {
            const { jsPDF } = window.jspdf;
            const canvas = await window.html2canvas(paperElement, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
            });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth * ratio, imgHeight * ratio);
            pdf.save('formatted_paper.pdf');
        } catch (err) {
            console.error("PDF generation failed:", err);
            setError("Failed to generate PDF. Please try again.");
        } finally {
            setIsLoading(false);
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
            const filename = `${paperHeading || 'formatted-paper'}.doc`;
            const htmlContent = formattedContent;

            const blob = new Blob(['<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>', htmlContent, '</body></html>'], {
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
                                    quillModules={quillModules} 
                                    quillFormats={quillFormats} 
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