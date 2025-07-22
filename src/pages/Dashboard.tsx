import React, { useState, useEffect } from "react";
// Assuming these are correctly defined in your project structure
import { PaperType, FormatType } from "../component/common/enums";
import {
  AppWrapper,
  MainContainer,
  ControlsWrapper,
  StyledLabel,
  StyledSelect,
  StyledInput,
  StyledTextarea,
  LoadingIndicator,
  // Updated PreviewContainer for A4 dimensions
  PreviewContainer,
  DownloadButton,
  ErrorMessage,
  // New styles for download options
  DownloadOptionsContainer,
  DownloadOptionButton,
} from "../component/common/Styles"; // Make sure to add new styles to Styles.ts
import { GlobalStyle } from "../GlobalStyles";
import FormattedPaper from "../component/FormattedPaper";
import { Header } from "./Landingpage";

// --- TYPE DEFINITIONS (No Change) ---
interface PaperTypeFeatures {
  hasAbstract: boolean;
  hasKeywords: boolean;
  hasStructuredBody: boolean;
}

type PaperTypeConfigMap = {
  [key in PaperType]: PaperTypeFeatures;
};

const paperTypeConfig: PaperTypeConfigMap = {
  [PaperType.Essay]: { hasAbstract: false, hasKeywords: false, hasStructuredBody: false },
  [PaperType.ResearchPaper]: { hasAbstract: true, hasKeywords: true, hasStructuredBody: true },
  [PaperType.JournalArticle]: { hasAbstract: true, hasKeywords: true, hasStructuredBody: true },
  [PaperType.Thesis]: { hasAbstract: true, hasKeywords: true, hasStructuredBody: true },
  [PaperType.Report]: { hasAbstract: true, hasKeywords: false, hasStructuredBody: false },
};

interface PayloadState {
  paperHeading: string;
  authorName: string;
  selectedFormat: FormatType;
  selectedPaperType: PaperType;
  abstract: string;
  keywords: string;
  references: string;
  introduction: string;
  literatureReview: string;
  methodology: string;
  results: string;
  discussion: string;
  conclusion: string;
  mainContent: string;
}

const createPayload = (state: PayloadState) => ({
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
  } : {
    mainBodyContent: state.mainContent,
  })
});

const formatTextToParagraphs = (text: string, lineHeight: number = 1.5): string => {
  if (!text) return "";
  return text.split('\n')
    .filter(p => p.trim() !== '')
    .map(p => `<p style="text-align: justify; line-height: ${lineHeight}; margin-bottom: 1em;">${p}</p>`)
    .join('');
};

function toRoman(num: number): string {
  const roman: { [key: string]: number } = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
  let str: string = '';
  for (const key of Object.keys(roman)) {
    const q = Math.floor(num / roman[key]);
    num -= q * roman[key];
    str += key.repeat(q);
  }
  return str;
}

interface FormatterPayload {
  paperHeading: string;
  authorName: string;
  selectedFormat: FormatType;
  selectedPaperType: PaperType;
  abstractContent: string;
  keywordsContent: string;
  referencesContent: string;
  introductionContent: string;
  literatureReviewContent: string;
  methodologyContent: string;
  resultsContent: string;
  discussionContent: string;
  conclusionContent: string;
  mainBodyContent: string;
}

const formatAsAPA = (payload: FormatterPayload): string => {
  let html = `<div style="padding: 1in; font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 2;">`;

  if (payload.paperHeading) {
    html += `<p style="text-align: center; font-weight: bold; margin-bottom: 0;">${payload.paperHeading}</p>`;
  }
  if (payload.authorName) {
    html += `<p style="text-align: center; margin-top: 0;">${payload.authorName}</p><br/>`;
  }

  if (payload.abstractContent) {
    html += `<h2 style="text-align: center; font-weight: bold; margin-top: 1em; margin-bottom: 0.5em;">Abstract</h2>`;
    html += `<div style="text-indent: 0.5in;">${formatTextToParagraphs(payload.abstractContent, 2)}</div>`;
  }

  if (payload.keywordsContent) {
    html += `<p style="text-indent: 0.5in; margin-top: 0.5em;"><i>Keywords:</i> ${payload.keywordsContent}</p>`;
  }

  const isStructured = paperTypeConfig[payload.selectedPaperType].hasStructuredBody;

  if (isStructured) {
    const sections = [
      { title: "Introduction", content: payload.introductionContent },
      { title: "Literature Review", content: payload.literatureReviewContent },
      { title: "Methodology", content: payload.methodologyContent },
      { title: "Results", content: payload.resultsContent },
      { title: "Discussion", content: payload.discussionContent },
      { title: "Conclusion", content: payload.conclusionContent },
    ];

    sections.forEach(section => {
      if (section.content) {
        html += `<h2 style="text-align: center; font-weight: bold; margin-top: 1em; margin-bottom: 0.5em;">${section.title}</h2>`;
        html += `<div style="text-indent: 0.5in;">${formatTextToParagraphs(section.content, 2)}</div>`;
      }
    });
  } else if (payload.mainBodyContent) {
    html += `<div style="text-indent: 0.5in; margin-top: 1em;">${formatTextToParagraphs(payload.mainBodyContent, 2)}</div>`;
  }

  if (payload.referencesContent) {
    html += `<h2 style="text-align: center; font-weight: bold; margin-top: 1em; margin-bottom: 0.5em;">References</h2>`;
    const formattedReferences = payload.referencesContent.split('\n')
      .filter(ref => ref.trim() !== '')
      .map(ref => `<p style="margin-bottom: 0; text-indent: -0.5in; padding-left: 0.5in;">${ref.trim()}</p>`)
      .join('');
    html += `<div>${formattedReferences}</div>`;
  }

  html += `</div>`;
  return html;
};

const formatAsMLA = (payload: FormatterPayload): string => {
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
      { title: "Introduction", content: payload.introductionContent },
      { title: "Literature Review", content: payload.literatureReviewContent },
      { title: "Methodology", content: payload.methodologyContent },
      { title: "Results", content: payload.resultsContent },
      { title: "Discussion", content: payload.discussionContent },
      { title: "Conclusion", content: payload.conclusionContent },
    ];

    sections.forEach(section => {
      if (section.content) {
        html += `<h2 style="text-align: left; font-weight: bold; font-size: 1.17em; margin-top: 1em; margin-bottom: 0.5em;">${section.title}</h2>`;
        html += `<div style="text-indent: 0.5in;">${formatTextToParagraphs(section.content, 2)}</div>`;
      }
    });
  } else if (payload.mainBodyContent) {
    html += `<div style="text-indent: 0.5in; margin-top: 0;">${formatTextToParagraphs(payload.mainBodyContent, 2)}</div>`;
  }

  if (payload.referencesContent) {
    html += `<h2 style="text-align: center; font-weight: normal; font-size: 1.5rem; margin-top: 2em; margin-bottom: 1em;">Works Cited</h2>`;
    const formattedReferences = payload.referencesContent.split('\n')
      .filter(ref => ref.trim() !== '')
      .map(ref => `<p style="margin-bottom: 0; text-indent: -0.5in; padding-left: 0.5in;">${ref.trim()}</p>`)
      .join('');
    html += `<div>${formattedReferences}</div>`;
  }

  html += `</div>`;
  return html;
};

const formatAsIEEE = (payload: FormatterPayload): string => {
  let html = `<div style="padding: 1in; font-family: 'Times New Roman', serif;">`;
  if (payload.paperHeading) html += `<h1 style="text-align: center; font-weight: bold; font-size: 1.5rem; margin-bottom: 0.25rem;">${payload.paperHeading}</h1>`;
  if (payload.authorName) html += `<p style="text-align: center; font-size: 1.125rem; margin-bottom: 1.5rem;">${payload.authorName}</p>`;
  if (payload.abstractContent) html += `<p><b><em>Abstract</em>—${payload.abstractContent}</b></p>`;
  if (payload.keywordsContent) html += `<p><b><em>Keywords</em>—${payload.keywordsContent}</b></p><br/>`;

  const isStructured = paperTypeConfig[payload.selectedPaperType].hasStructuredBody;

  const sectionsToRender: { [key: string]: string } = {};

  if (isStructured) {
    if (payload.introductionContent) sectionsToRender["INTRODUCTION"] = payload.introductionContent;
    if (payload.literatureReviewContent) sectionsToRender["LITERATURE REVIEW"] = payload.literatureReviewContent;
    if (payload.methodologyContent) sectionsToRender["METHODOLOGY"] = payload.methodologyContent;
    if (payload.resultsContent) sectionsToRender["RESULTS"] = payload.resultsContent;
    if (payload.discussionContent) sectionsToRender["DISCUSSION"] = payload.discussionContent;
    if (payload.conclusionContent) sectionsToRender["CONCLUSION"] = payload.conclusionContent;
  } else if (payload.mainBodyContent) {
    sectionsToRender["MAIN BODY"] = payload.mainBodyContent;
  }

  html += `<div style="column-count: 2; column-gap: 20px;">`;
  let romanNumeral = 1;
  Object.entries(sectionsToRender).forEach(([title, content]) => {
    if (content) {
      html += `<h2 style="font-weight: bold; text-transform: uppercase; font-size: 0.875rem; margin-top: 1rem;"> ${toRoman(romanNumeral++)}. ${title}</h2>${formatTextToParagraphs(content, 1.2)}`;
    }
  });
  html += `</div>`;

  if (payload.referencesContent) {
    html += `<h2 style="font-weight: bold; text-transform: uppercase; font-size: 0.875rem; margin-top: 1rem;">References</h2><div style="font-size: 0.9em; line-height: 1.4;">${formatTextToParagraphs(payload.referencesContent, 1.2)}</div>`;
  }
  html += `</div>`;
  return html;
};

const formatAsSpringer = (payload: FormatterPayload): string => {
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
    html += formatTextToParagraphs(payload.abstractContent, 1.2);
    html += `</div>`;
  }

  if (payload.keywordsContent) {
    html += `<p style="font-size: 10pt; margin-bottom: 1.5em;"><b>Keywords:</b> ${payload.keywordsContent}</p>`;
  }

  const isStructured = paperTypeConfig[payload.selectedPaperType].hasStructuredBody;

  const sectionsToRender: { [key: string]: string } = {};

  if (isStructured) {
    if (payload.introductionContent) sectionsToRender["Introduction"] = payload.introductionContent;
    if (payload.literatureReviewContent) sectionsToRender["Literature Review"] = payload.literatureReviewContent;
    if (payload.methodologyContent) sectionsToRender["Methodology"] = payload.methodologyContent;
    if (payload.resultsContent) sectionsToRender["Results"] = payload.resultsContent;
    if (payload.discussionContent) sectionsToRender["Discussion"] = payload.discussionContent;
    if (payload.conclusionContent) sectionsToRender["Conclusion"] = payload.conclusionContent;
  } else if (payload.mainBodyContent) {
    sectionsToRender["Main Body"] = payload.mainBodyContent;
  }

  let sectionNumber = 1;
  Object.entries(sectionsToRender).forEach(([title, content]) => {
    if (content) {
      html += `<h2 style="font-size: 13pt; font-weight: bold; margin-top: 1.5em; margin-bottom: 0.5em;">${sectionNumber++} ${title}</h2>`;
      html += formatTextToParagraphs(content);
    }
  });

  if (payload.referencesContent) {
    html += `<h2 style="font-size: 14pt; font-weight: bold; margin-top: 2em; margin-bottom: 1em;">References</h2>`;
    const formattedReferences = payload.referencesContent.split('\n')
      .filter((ref: string) => ref.trim() !== '')
      .map((ref: string, index: number) => `<p style="margin-bottom: 0.5em; text-indent: -0.2in; padding-left: 0.2in;">[${index + 1}] ${ref.trim()}</p>`)
      .join('');
    html += `<div style="font-size: 10pt;">${formattedReferences}</div>`;
  }

  html += `</div>`;
  return html;
};

const formatAsFPI = (payload: FormatterPayload): string => {
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
    html += `<div style="text-align: justify; line-height: 1; margin-bottom: 1em;">${payload.abstractContent.split('\n').map(p => p.trim()).filter(p => p !== '').join(' ')}</div>`;
  }

  if (payload.keywordsContent) {
    html += `<p style="margin-bottom: 1em;"><b><i>Keywords:</i></b> ${payload.keywordsContent}</p>`;
  }

  const isStructured = paperTypeConfig[payload.selectedPaperType].hasStructuredBody;

  const sectionsToRender: { [key: string]: string } = {};

  if (isStructured) {
    if (payload.introductionContent) sectionsToRender["INTRODUCTION"] = payload.introductionContent;
    if (payload.literatureReviewContent) sectionsToRender["LITERATURE REVIEW"] = payload.literatureReviewContent;
    if (payload.methodologyContent) sectionsToRender["METHODOLOGY"] = payload.methodologyContent;
    if (payload.resultsContent) sectionsToRender["RESULTS"] = payload.resultsContent;
    if (payload.discussionContent) sectionsToRender["DISCUSSION"] = payload.discussionContent;
    if (payload.conclusionContent) sectionsToRender["CONCLUSION"] = payload.conclusionContent;
  } else if (payload.mainBodyContent) {
    sectionsToRender["MAIN BODY"] = payload.mainBodyContent;
  }

  let sectionNumber = 1;
  Object.entries(sectionsToRender).forEach(([title, content]) => {
    if (content) {
      html += `<h2 style="font-weight: bold; font-size: 12pt; text-align: left; margin-top: 1.5em; margin-bottom: 0.5em;">${sectionNumber++}. ${title}</h2>`;
      html += formatTextToParagraphs(content, bodyLineHeight);
    }
  });

  if (payload.referencesContent) {
    html += `<h2 style="text-align: center; font-weight: bold; font-size: 12pt; margin-top: 2em; margin-bottom: 1em;">REFERENCES</h2>`;
    const formattedReferences = payload.referencesContent.split('\n')
      .filter(ref => ref.trim() !== '')
      .map(ref => `<p style="margin-bottom: 0.5em; text-indent: -0.5in; padding-left: 0.5in; line-height: ${bodyLineHeight}; text-align: justify;">${ref.trim()}</p>`)
      .join('');
    html += `<div>${formattedReferences}</div>`;
  }

  html += `</div>`;
  return html;
};

const simulateFormatPreviewApi = (payload: FormatterPayload): Promise<string> => {
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

// --- Updated Simulate Download APIs ---
const simulateDownloadPdf = (payload: FormatterPayload): Promise<void> => {
  return new Promise((resolve) => {
    console.log("Generating PDF with payload:", payload);
    setTimeout(() => {
      alert("PDF download would start now! (This is a simulation)");
      resolve();
    }, 1500);
  });
};

const simulateDownloadWord = (payload: FormatterPayload): Promise<void> => {
  return new Promise((resolve) => {
    console.log("Generating Word document with payload:", payload);
    setTimeout(() => {
      alert("Word document download would start now! (This is a simulation)");
      resolve();
    }, 1500);
  });
};


// --- MAIN APP COMPONENT ---

const App: React.FC = () => {
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
  const [references, setReferences] = useState<string>("");

  const [formattedContent, setFormattedContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showDownloadOptions, setShowDownloadOptions] = useState<boolean>(false); // New state for download options

  const { hasAbstract, hasKeywords, hasStructuredBody } = paperTypeConfig[selectedPaperType];

  useEffect(() => {
    if (!hasAbstract) setAbstract("");
    if (!hasKeywords) setKeywords("");

    if (hasStructuredBody) {
      setMainContent("");
    } else {
      setIntroduction("");
      setLiteratureReview("");
      setMethodology("");
      setResults("");
      setDiscussion("");
      setConclusion("");
    }
  }, [selectedPaperType, hasAbstract, hasKeywords, hasStructuredBody]);

  useEffect(() => {
    const currentState: PayloadState = {
      paperHeading, authorName, selectedFormat, selectedPaperType,
      abstract, keywords, mainContent, introduction, literatureReview,
      methodology, results, discussion, conclusion, references
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
    methodology, results, discussion, conclusion, references
  ]);

  // Handler to toggle download options visibility
  const handleDownloadClick = () => {
    if (isDownloadEnabled) {
      setShowDownloadOptions(prev => !prev);
    }
  };

  const handleDownloadPdf = async () => {
    setShowDownloadOptions(false); // Hide options after selection
    setIsLoading(true);
    setError(null);
    const currentState: PayloadState = {
      paperHeading, authorName, selectedFormat, selectedPaperType,
      abstract, keywords, mainContent, introduction, literatureReview,
      methodology, results, discussion, conclusion, references
    };
    const payload = createPayload(currentState);
    try {
      await simulateDownloadPdf(payload); // Call PDF specific download
    } catch (err) {
      console.error("Error generating PDF:", err);
      setError("Failed to generate PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadWord = async () => {
    setShowDownloadOptions(false); // Hide options after selection
    setIsLoading(true);
    setError(null);
    const currentState: PayloadState = {
      paperHeading, authorName, selectedFormat, selectedPaperType,
      abstract, keywords, mainContent, introduction, literatureReview,
      methodology, results, discussion, conclusion, references
    };
    const payload = createPayload(currentState);
    try {
      await simulateDownloadWord(payload); // Call Word specific download
    } catch (err) {
      console.error("Error generating Word document:", err);
      setError("Failed to generate Word document. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isDownloadEnabled = [
    paperHeading, authorName, references,
    hasStructuredBody ? introduction || literatureReview || methodology || results || discussion || conclusion : mainContent
  ].some(field => field !== undefined && field.trim() !== "");

  return (
    <>
      <GlobalStyle />
      <Header />
      <AppWrapper>
        <MainContainer>
          <ControlsWrapper>
            <StyledLabel htmlFor="paperHeading">Paper Title:</StyledLabel>
            <StyledInput
              id="paperHeading"
              type="text"
              value={paperHeading}
              onChange={(e) => setPaperHeading(e.target.value)}
              placeholder="e.g., The Future of Artificial Intelligence"
            />

            <StyledLabel htmlFor="authorName">Author Name(s):</StyledLabel>
            <StyledInput
              id="authorName"
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g., Jane Doe, John Smith"
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
                <StyledTextarea id="abstract" value={abstract} onChange={(e) => setAbstract(e.target.value)} placeholder="Provide a brief summary..." rows={4}></StyledTextarea>
              </>
            )}

            {hasKeywords && (
              <>
                <StyledLabel htmlFor="keywords">Keywords:</StyledLabel>
                <StyledInput id="keywords" type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="e.g., AI, Machine Learning, Ethics..." />
              </>
            )}

            {hasStructuredBody ? (
              <>
                <StyledLabel htmlFor="introduction">Introduction:</StyledLabel>
                <StyledTextarea id="introduction" value={introduction} onChange={(e) => setIntroduction(e.target.value)} placeholder="State the problem and purpose..."></StyledTextarea>

                <StyledLabel htmlFor="literatureReview">Literature Review:</StyledLabel>
                <StyledTextarea id="literatureReview" value={literatureReview} onChange={(e) => setLiteratureReview(e.target.value)} placeholder="Summarize relevant research..."></StyledTextarea>

                <StyledLabel htmlFor="methodology">Methodology:</StyledLabel>
                <StyledTextarea id="methodology" value={methodology} onChange={(e) => setMethodology(e.target.value)} placeholder="Describe your research methods..."></StyledTextarea>

                <StyledLabel htmlFor="results">Results:</StyledLabel>
                <StyledTextarea id="results" value={results} onChange={(e) => setResults(e.target.value)} placeholder="Present your findings..."></StyledTextarea>

                <StyledLabel htmlFor="discussion">Discussion:</StyledLabel>
                <StyledTextarea id="discussion" value={discussion} onChange={(e) => setDiscussion(e.target.value)} placeholder="Interpret your findings..."></StyledTextarea>

                <StyledLabel htmlFor="conclusion">Conclusion:</StyledLabel>
                <StyledTextarea id="conclusion" value={conclusion} onChange={(e) => setConclusion(e.target.value)} placeholder="Summarize your work and its implications..."></StyledTextarea>
              </>
            ) : (
              <>
                <StyledLabel htmlFor="mainContent">Main Body:</StyledLabel>
                <StyledTextarea id="mainContent" value={mainContent} onChange={(e) => setMainContent(e.target.value)} placeholder="Paste the main content of your paper here..." rows={15}></StyledTextarea>
              </>
            )}

            <StyledLabel htmlFor="references">References:</StyledLabel>
            <StyledTextarea id="references" value={references} onChange={(e) => setReferences(e.target.value)} placeholder="List your references here, one per line." rows={5}></StyledTextarea>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <div style={{ position: 'relative', width: '100%' }}>
              <DownloadButton
                onClick={handleDownloadClick}
                disabled={isLoading || !isDownloadEnabled}
              >
                {isLoading ? "Processing..." : "Download Formatted Document"}
              </DownloadButton>

              {showDownloadOptions && (
                <DownloadOptionsContainer>
                  <DownloadOptionButton onClick={handleDownloadPdf}>Download PDF</DownloadOptionButton>
                  <DownloadOptionButton onClick={handleDownloadWord}>Download Word Doc</DownloadOptionButton>
                </DownloadOptionsContainer>
              )}
            </div>
          </ControlsWrapper>
          <PreviewContainer>
            {isLoading ? (
              <LoadingIndicator>Updating preview...</LoadingIndicator>
            ) : (
              <FormattedPaper htmlContent={formattedContent} />
            )}
          </PreviewContainer>
        </MainContainer>
      </AppWrapper>
    </>
  );
};

export default App;