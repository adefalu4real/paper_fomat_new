import React, { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { TextItem, } from 'pdfjs-dist/types/src/display/api';
import mammoth from 'mammoth';
import jsPDF from 'jspdf'; // REMOVE THIS LINE IN A REAL API SETUP

import { PaperType, FormatType } from './component/common/enums';
import {
  AppWrapper, MainContainer, ControlsWrapper, StyledLabel, StyledSelect, StyledInput,
  FileUploadWrapper, HiddenFileInput, FileUploadLabel, FileNameDisplay,
  StyledTextarea, LoadingIndicator, PreviewContainer, DownloadButton
} from './component/common/Styles';
import { GlobalStyle } from './GlobalStyles';
import Navbar from './Navbar';
import FormattedPaper from './component/FormattedPaper';

// --- PDF.js Worker Configuration ---
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
} catch (error) {
  console.error("Error setting PDF.js worker source:", error);
}

const fontMap: { [key: string]: 'times' | 'helvetica' | 'courier' } = {
  'Times New Roman': 'times',
  'Arial': 'helvetica',
  'Courier New': 'courier',
  'serif': 'times',
  'sans-serif': 'helvetica',
  'monospace': 'courier',
};

interface FormatRequestPayload {
  rawText: string; // Keep rawText for general fallback or debugging
  paperHeading: string;
  authorName: string;
  selectedFormat: FormatType;
  selectedPaperType: PaperType;
  // New fields for extracted content
  abstractContent: string;
  keywordsContent: string;
  referencesContent: string;
  mainBodyContent: string;
}

const getFormattingDetails = (payload: FormatRequestPayload) => {
  const { selectedPaperType, selectedFormat } = payload;

  let fontSize = 12;
  let fontFamily = 'Times New Roman';
  let lineHeightFactor = 1.5;

  switch (selectedPaperType) {
    case PaperType.Essay:
    case PaperType.ResearchPaper:
    case PaperType.Thesis:
    case PaperType.Dissertation:
      fontSize = 12;
      fontFamily = 'Times New Roman';
      lineHeightFactor = 2.0;
      break;
    case PaperType.LabReport:
      fontSize = 11;
      fontFamily = 'Arial';
      lineHeightFactor = 1.5;
      break;
    case PaperType.JournalArticle:
    case PaperType.SeminarPaper:
    case PaperType.ConferenceReport:
      fontSize = 12;
      fontFamily = 'Times New Roman';
      lineHeightFactor = 1.5;
      break;
    case PaperType.GeneralArticle:
      fontSize = 11;
      fontFamily = 'Arial';
      lineHeightFactor = 1.5;
      break;
    default:
      break;
  }

  if (selectedFormat === 'basic-apa' || selectedFormat === 'basic-mla') {
    lineHeightFactor = 2.0;
  }

  return {
    fontSize,
    fontFamily,
    lineHeightFactor,
    fontSizePx: fontSize * 1.33333,
    lineHeightPx: fontSize * lineHeightFactor * 1.33333,
    jsPdfFont: fontMap[fontFamily] || 'times',
  };
};


const simulateFormatPreviewApi = (payload: FormatRequestPayload): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { paperHeading, authorName, selectedPaperType, abstractContent, keywordsContent, referencesContent, mainBodyContent } = payload;
      const formatting = getFormattingDetails(payload);

      let formattedHtmlContent = '';

      // Helper to add a section with title and content
      const addSection = (title: string, content: string, titleTag: string = 'h3', contentTag: string = 'p') => {
        if (content) {
          formattedHtmlContent += `<${titleTag} style="font-weight: bold; margin-top: 2em; margin-bottom: 0.8em;">${title}</${titleTag}>`;
          // Preserve line breaks for pre-formatted content
          formattedHtmlContent += `<${contentTag}>${content.trim().replace(/\n/g, '<br>')}</${contentTag}>`;
        }
      };

      switch (selectedPaperType) {
        case PaperType.Essay:
        case PaperType.GeneralArticle: {
          formattedHtmlContent += paperHeading ? `<h2 style="font-weight: bold; text-align: center; margin-bottom: 1em;">${paperHeading}</h2>` : '';
          formattedHtmlContent += authorName ? `<p style="text-align: center; margin-bottom: 2em;">By ${authorName}</p>` : '';
          formattedHtmlContent += mainBodyContent ? `<p style="white-space: pre-wrap;">${mainBodyContent}</p>` : '';
          break;
        }

        case PaperType.LabReport: {
          formattedHtmlContent += paperHeading ? `<h2 style="font-weight: bold; text-align: center; margin-bottom: 1em;">${paperHeading}</h2>` : '';
          formattedHtmlContent += authorName ? `<p style="text-align: center; margin-bottom: 2em;">Researcher: ${authorName}</p>` : '';

          addSection('Abstract:', abstractContent || '[Abstract goes here]');

          // Process main body, attempting to identify sections within it
          if (mainBodyContent) {
            const sections = mainBodyContent.split(/\n\s*\n/);
            sections.forEach(section => {
              const trimmedSection = section.trim();
              if (!trimmedSection) return;
              const sectionTitleMatch = trimmedSection.match(/^(Introduction|Methods|Results|Discussion|Conclusion)\s*:?\s*$/i);
              if (sectionTitleMatch) {
                formattedHtmlContent += `<h3 style="font-weight: bold; margin-top: 1.5em; margin-bottom: 0.8em;">${sectionTitleMatch[0]}</h3>`;
              } else {
                formattedHtmlContent += `<p>${trimmedSection.replace(/\n/g, '<br>')}</p>`;
              }
            });
          }

          addSection('References:', referencesContent || '[References list goes here]');
          break;
        }

        case PaperType.ResearchPaper:
        case PaperType.Thesis:
        case PaperType.Dissertation: {
          // --- Title Page Placeholder ---
          formattedHtmlContent += `<div style="text-align: center; margin-bottom: 5em;">`;
          formattedHtmlContent += paperHeading ? `<h1 style="font-weight: bold; margin-bottom: 0.5em; font-size: 2em;">${paperHeading}</h1>` : '';
          formattedHtmlContent += authorName ? `<p style="margin-bottom: 0.5em; font-size: 1.2em;">By ${authorName}</p>` : '';
          formattedHtmlContent += `<p style="margin-top: 3em;">[Course Name]</p><p>[Instructor Name]</p><p>[Institution Name]</p><p style="margin-top: 3em;">[Date]</p>`;
          formattedHtmlContent += `</div><hr style="margin: 5em 0;">`;

          addSection('Abstract', abstractContent || '[Abstract goes here]', 'h2');

          formattedHtmlContent += `<h2 style="font-weight: bold; text-align: center; margin-top: 3em; margin-bottom: 1em;">Table of Contents</h2><p>[Table of Contents placeholder]</p>`;

          // Process main body
          if (mainBodyContent) {
            const sections = mainBodyContent.split(/\n\s*\n/);
            sections.forEach(section => {
              const trimmedSection = section.trim();
              if (!trimmedSection) return;
              const mainSectionTitleMatch = trimmedSection.match(/^(Introduction|Literature Review|Methodology|Results|Analysis|Discussion|Conclusion)\s*:?\s*$/i);
              const subHeadingMatch = trimmedSection.match(/^[A-Z][a-z]*(\s[A-Z][a-z]*)*:?\s*$/); // Simple heuristic for subheadings
              if (mainSectionTitleMatch) {
                formattedHtmlContent += `<h2 style="font-weight: bold; margin-top: 2em; margin-bottom: 1em;">${mainSectionTitleMatch[0]}</h2>`;
              } else if (subHeadingMatch) {
                formattedHtmlContent += `<h3 style="font-weight: bold; margin-top: 1.5em; margin-bottom: 0.8em;">${subHeadingMatch[0]}</h3>`;
              } else {
                formattedHtmlContent += `<p>${trimmedSection.replace(/\n/g, '<br>')}</p>`;
              }
            });
          }

          addSection('References', referencesContent || '[References list goes here]', 'h2');
          break;
        }

        case PaperType.JournalArticle:
        case PaperType.SeminarPaper:
        case PaperType.ConferenceReport: {
          formattedHtmlContent += `<div style="text-align: center; margin-bottom: 3em;">`;
          formattedHtmlContent += paperHeading ? `<h2 style="font-weight: bold; margin-bottom: 0.5em; font-size: 1.5em;">${paperHeading}</h2>` : '';
          formattedHtmlContent += authorName ? `<p style="margin-bottom: 1.5em;">Author(s): ${authorName}</p>` : '';
          formattedHtmlContent += `</div>`;

          addSection('Abstract:', abstractContent || '[Abstract goes here]');
          if (keywordsContent) {
            formattedHtmlContent += `<p style="font-weight: bold; margin-top: 1em;">Keywords: ${keywordsContent.trim()}</p>`;
          } else {
            formattedHtmlContent += `<p style="font-weight: bold; margin-top: 1em;">Keywords: [Keywords here]</p>`;
          }


          // Process main body
          if (mainBodyContent) {
            const sections = mainBodyContent.split(/\n\s*\n/);
            sections.forEach(section => {
              const trimmedSection = section.trim();
              if (!trimmedSection) return;
              const sectionTitleMatch = trimmedSection.match(/^(Introduction|Methods|Results|Discussion|Conclusion)\s*:?\s*$/i);
              if (sectionTitleMatch) {
                formattedHtmlContent += `<h3 style="font-weight: bold; margin-top: 1.5em; margin-bottom: 0.8em;">${sectionTitleMatch[0]}</h3>`;
              } else {
                formattedHtmlContent += `<p>${trimmedSection.replace(/\n/g, '<br>')}</p>`;
              }
            });
          }

          addSection('References', referencesContent || '[References list goes here]');
          break;
        }

        default: {
          formattedHtmlContent += paperHeading ? `<h2 style="font-weight: bold; text-align: center; margin-bottom: 1em;">${paperHeading}</h2>` : '';
          formattedHtmlContent += authorName ? `<p style="text-align: center; margin-bottom: 2em;">By ${authorName}</p>` : '';
          formattedHtmlContent += mainBodyContent ? `<p style="white-space: pre-wrap;">${mainBodyContent}</p>` : '';
          break;
        }
      }

      const finalHtml = `<div style="font-family: '${formatting.fontFamily}', sans-serif; font-size: ${formatting.fontSizePx}px; line-height: ${formatting.lineHeightFactor};">${formattedHtmlContent}</div>`;
      if (!paperHeading && !mainBodyContent && !authorName && !abstractContent && !keywordsContent && !referencesContent) {
        resolve(`<div style="font-family: '${formatting.fontFamily}', sans-serif; font-size: ${formatting.fontSizePx}px; line-height: ${formatting.lineHeightFactor};"><span>Upload a file, paste text, or add a heading/author to see formatted output.</span></div>`);
      } else {
        resolve(finalHtml);
      }

    }, 500);
  });
};

const simulateGeneratePdfApi = (payload: FormatRequestPayload): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const { paperHeading, authorName, selectedPaperType, abstractContent, keywordsContent, referencesContent, mainBodyContent } = payload;
        const formatting = getFormattingDetails(payload);

        const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });

        doc.setFont(formatting.jsPdfFont, 'normal');
        doc.setFontSize(formatting.fontSize);

        const pageHeight = doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 72;
        const maxLineWidth = pageWidth - margin * 2;
        let cursorY = margin;

        const addTextToPdf = (text: string, fontStyle: 'normal' | 'bold' | 'italic' | 'bolditalic' = 'normal', size: number = formatting.fontSize, spacingFactor: number = formatting.lineHeightFactor, align: 'left' | 'center' | 'right' = 'left', addMarginAfter: boolean = true) => {
          if (!text || text.trim() === '') return; // Don't add empty text
          doc.setFont(formatting.jsPdfFont, fontStyle);
          doc.setFontSize(size);
          const lines = doc.splitTextToSize(text, maxLineWidth);
          const lineHeight = size * spacingFactor;

          lines.forEach((line: string) => {
            if (cursorY + lineHeight > pageHeight - margin) {
              doc.addPage();
              cursorY = margin;
              doc.setFontSize(10);
              doc.text(String(doc.getNumberOfPages()), pageWidth - margin, margin / 2, { align: 'right' });
              doc.setFontSize(size);
              doc.setFont(formatting.jsPdfFont, fontStyle);
            }
            const x = align === 'center' ? pageWidth / 2 : (align === 'right' ? pageWidth - margin : margin);
            doc.text(line, x, cursorY, { align: align });
            cursorY += lineHeight;
          });
          if (addMarginAfter) {
            cursorY += formatting.fontSize * spacingFactor * 0.5; // Default space after text block
          }
          doc.setFont(formatting.jsPdfFont, 'normal');
          doc.setFontSize(formatting.fontSize);
        };

        const addNewPageAndNumber = () => {
          doc.addPage();
          cursorY = margin;
          doc.setFontSize(10);
          doc.text(String(doc.getNumberOfPages()), pageWidth - margin, margin / 2, { align: 'right' });
          doc.setFontSize(formatting.fontSize);
        };

        // Initial page number (will be overwritten for academic types)
        doc.setFontSize(10);
        doc.text(String(doc.getNumberOfPages()), pageWidth - margin, margin / 2, { align: 'right' });
        doc.setFontSize(formatting.fontSize);

        switch (selectedPaperType) {
          case PaperType.Essay:
          case PaperType.GeneralArticle: {
            if (paperHeading) addTextToPdf(paperHeading, 'bold', formatting.fontSize * 1.2, formatting.lineHeightFactor, 'center');
            if (authorName) addTextToPdf(`By ${authorName}`, 'normal', formatting.fontSize, formatting.lineHeightFactor, 'center');
            addTextToPdf(mainBodyContent, 'normal', formatting.fontSize, formatting.lineHeightFactor, 'left');
            break;
          }

          case PaperType.LabReport: {
            if (paperHeading) addTextToPdf(paperHeading, 'bold', formatting.fontSize * 1.2, formatting.lineHeightFactor, 'center');
            if (authorName) addTextToPdf(`Researcher: ${authorName}`, 'normal', formatting.fontSize, formatting.lineHeightFactor, 'center');

            addTextToPdf('Abstract:', 'bold', formatting.fontSize, 1.2, 'left');
            addTextToPdf(abstractContent || '[Abstract goes here]', 'normal', formatting.fontSize, formatting.lineHeightFactor, 'left');

            if (mainBodyContent) {
              const sections = mainBodyContent.split(/\n\s*\n/);
              sections.forEach(section => {
                const trimmedSection = section.trim();
                if (!trimmedSection) return;
                const sectionTitleMatch = trimmedSection.match(/^(Introduction|Methods|Results|Discussion|Conclusion)\s*:?\s*$/i);
                if (sectionTitleMatch) {
                  addTextToPdf(sectionTitleMatch[0], 'bold', formatting.fontSize, 1.2, 'left');
                } else {
                  addTextToPdf(trimmedSection, 'normal', formatting.fontSize, formatting.lineHeightFactor, 'left');
                }
              });
            }

            addTextToPdf('References:', 'bold', formatting.fontSize, 1.2, 'left');
            addTextToPdf(referencesContent || '[References list goes here]', 'normal', formatting.fontSize, formatting.lineHeightFactor, 'left');
            break;
          }

          case PaperType.ResearchPaper:
          case PaperType.Thesis:
          case PaperType.Dissertation: {
            // Title Page
            cursorY = pageHeight / 2 - (formatting.fontSize * 3);
            if (paperHeading) addTextToPdf(paperHeading, 'bold', formatting.fontSize * 1.8, 2.0, 'center');
            if (authorName) addTextToPdf(authorName, 'normal', formatting.fontSize * 1.2, 1.5, 'center');
            addTextToPdf('[Course Name]', 'normal', formatting.fontSize, 1.5, 'center');
            addTextToPdf('[Instructor Name]', 'normal', formatting.fontSize, 1.5, 'center');
            addTextToPdf('[Institution Name]', 'normal', formatting.fontSize, 1.5, 'center');
            addTextToPdf('[Date]', 'normal', formatting.fontSize, 1.5, 'center', false); // No extra margin for last item on title page

            addNewPageAndNumber();
            addTextToPdf('Abstract', 'bold', formatting.fontSize * 1.2, 1.5, 'center');
            addTextToPdf(abstractContent || '[Abstract goes here]', 'normal', formatting.fontSize, formatting.lineHeightFactor, 'left');

            addNewPageAndNumber();
            addTextToPdf('Table of Contents', 'bold', formatting.fontSize * 1.2, 1.5, 'center');
            addTextToPdf('[Table of Contents will be generated here]', 'normal', formatting.fontSize, formatting.lineHeightFactor, 'left');

            // Main Body
            if (mainBodyContent) {
              const sections = mainBodyContent.split(/\n\s*\n/);
              sections.forEach(section => {
                const trimmedSection = section.trim();
                if (!trimmedSection) return;
                const mainSectionTitleMatch = trimmedSection.match(/^(Introduction|Literature Review|Methodology|Results|Analysis|Discussion|Conclusion)\s*:?\s*$/i);
                const subHeadingMatch = trimmedSection.match(/^[A-Z][a-z]*(\s[A-Z][a-z]*)*:?\s*$/);
                if (mainSectionTitleMatch) {
                  addTextToPdf(mainSectionTitleMatch[0], 'bold', formatting.fontSize * 1.1, 1.5, 'left');
                } else if (subHeadingMatch) {
                  addTextToPdf(subHeadingMatch[0], 'bold', formatting.fontSize, 1.5, 'left');
                } else {
                  addTextToPdf(trimmedSection, 'normal', formatting.fontSize, formatting.lineHeightFactor, 'left');
                }
              });
            }

            addNewPageAndNumber();
            addTextToPdf('References', 'bold', formatting.fontSize * 1.2, 1.5, 'center');
            addTextToPdf(referencesContent || '[References list goes here]', 'normal', formatting.fontSize, formatting.lineHeightFactor, 'left');
            break;
          }

          case PaperType.JournalArticle:
          case PaperType.SeminarPaper:
          case PaperType.ConferenceReport: {
            if (paperHeading) addTextToPdf(paperHeading, 'bold', formatting.fontSize * 1.5, 1.5, 'center');
            if (authorName) addTextToPdf(`Author(s): ${authorName}`, 'normal', formatting.fontSize, 1.2, 'center');

            addTextToPdf('Abstract:', 'bold', formatting.fontSize, 1.2, 'left');
            addTextToPdf(abstractContent || '[Abstract goes here]', 'normal', formatting.fontSize, formatting.lineHeightFactor, 'left');

            addTextToPdf(`Keywords: ${keywordsContent || '[Keywords here]'}`, 'bold', formatting.fontSize, 1.2, 'left');

            if (mainBodyContent) {
              const sections = mainBodyContent.split(/\n\s*\n/);
              sections.forEach(section => {
                const trimmedSection = section.trim();
                if (!trimmedSection) return;
                const sectionTitleMatch = trimmedSection.match(/^(Introduction|Methods|Results|Discussion|Conclusion)\s*:?\s*$/i);
                if (sectionTitleMatch) {
                  addTextToPdf(sectionTitleMatch[0], 'bold', formatting.fontSize, 1.2, 'left');
                } else {
                  addTextToPdf(trimmedSection, 'normal', formatting.fontSize, formatting.lineHeightFactor, 'left');
                }
              });
            }

            addTextToPdf('References', 'bold', formatting.fontSize, 1.2, 'center');
            addTextToPdf(referencesContent || '[References list goes here]', 'normal', formatting.fontSize, formatting.lineHeightFactor, 'left');
            break;
          }

          default: {
            if (paperHeading) addTextToPdf(paperHeading, 'bold', formatting.fontSize * 1.2, formatting.lineHeightFactor, 'center');
            if (authorName) addTextToPdf(`By ${authorName}`, 'normal', formatting.fontSize, formatting.lineHeightFactor, 'center');
            addTextToPdf(mainBodyContent, 'normal', formatting.fontSize, formatting.lineHeightFactor, 'left');
            break;
          }
        }

        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${paperHeading || 'Formatted_Document'}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        resolve();

      } catch (error) {
        console.error("Error generating PDF:", error);
        reject(error);
      }
    }, 1000);
  });
};


const App: React.FC = () => {
  const [rawText, setRawText] = useState<string>('');
  const [paperHeading, setPaperHeading] = useState<string>('');
  const [authorName, setAuthorName] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<FormatType>(FormatType.Basic);
  const [selectedPaperType, setSelectedPaperType] = useState<PaperType>(PaperType.Essay);

  // New state variables for extracted content
  const [extractedAbstract, setExtractedAbstract] = useState<string>('');
  const [extractedKeywords, setExtractedKeywords] = useState<string>('');
  const [extractedReferences, setExtractedReferences] = useState<string>('');
  const [mainContent, setMainContent] = useState<string>('');

  const [formattedContent, setFormattedContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string | null>(null);

  // Function to parse the document sections
  const parseDocumentSections = (text: string) => {
    let currentText = text;
    let abstract = '';
    let keywords = '';
    let references = '';
    let body = '';

    
    const abstractRegex = /^(?:Abstract\s*:?\s*)(.*?)(?=\n\n|\n\s*(?:Introduction|Methods|Results|Discussion|Conclusion|Keywords|References|Bibliography|\d+\.\s*\w+)\s*:?\s*|$)/is;
    const abstractMatch = currentText.match(abstractRegex);

    if (abstractMatch && abstractMatch[1]) {
      abstract = abstractMatch[1].trim();
      currentText = currentText.substring(abstractMatch[0].length).trim();
    }

    
    const keywordsRegex = /^(?:Keywords\s*:?\s*)(.*?)(?=\n\n|\n\s*(?:Introduction|Methods|Results|Discussion|Conclusion|References|Bibliography|\d+\.\s*\w+)\s*:?\s*|$)/is;
    const keywordsMatch = currentText.match(keywordsRegex);
    if (keywordsMatch && keywordsMatch[1]) {
      keywords = keywordsMatch[1].trim();
      currentText = currentText.substring(keywordsMatch[0].length).trim();
    }

   
    const referencesRegex = /(?:References|Bibliography)\s*:?\s*(.*)$/is;
    const referencesMatch = currentText.match(referencesRegex);

    if (referencesMatch && referencesMatch[1]) {
      
      body = currentText.substring(0, referencesMatch.index).trim();
      references = referencesMatch[1].trim();
    } else {
    
      body = currentText.trim();
    }

    setExtractedAbstract(abstract);
    setExtractedKeywords(keywords);
    setExtractedReferences(references);
    setMainContent(body); // The rest of the text is the main body
  };


  // Effect to parse document sections whenever rawText changes
  useEffect(() => {
    parseDocumentSections(rawText);
  }, [rawText]); // Dependency array: run when rawText changes

  // Effect to update formatted content based on inputs and parsed sections
  useEffect(() => {
    const handler = setTimeout(() => {
      setLoading(true);
      const payload: FormatRequestPayload = {
        rawText, // Still pass rawText, but for context/fallback
        paperHeading,
        authorName,
        selectedFormat,
        selectedPaperType,
        abstractContent: extractedAbstract,
        keywordsContent: extractedKeywords,
        referencesContent: extractedReferences,
        mainBodyContent: mainContent,
      };
      simulateFormatPreviewApi(payload)
        .then(html => setFormattedContent(html))
        .catch(error => {
          console.error("Error formatting content for preview:", error);
          setFormattedContent('<p style="color: red;">Error loading preview.</p>');
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [rawText, paperHeading, authorName, selectedFormat, selectedPaperType, extractedAbstract, extractedKeywords, extractedReferences, mainContent]);


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setLoading(true);
      const reader = new FileReader();

      reader.onload = async (e) => {
        const fileContent = e.target?.result;
        let extractedText = '';

        if (file.type === 'application/pdf') {
          try {
            const pdf = await pdfjsLib.getDocument({ data: fileContent as ArrayBuffer }).promise;
            const numPages = pdf.numPages;
            for (let i = 1; i <= numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              const textItems = textContent.items.filter(
                (item): item is TextItem => 'str' in item
              );
              extractedText += textItems.map((item) => item.str).join(' ') + '\n';
            }
            setRawText(extractedText);
          } catch (error) {
            console.error("Error reading PDF file:", error);
            alert("Failed to read PDF file. Please try again.");
            setRawText('');
          }
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          try {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
            extractedText = result.value;
            setRawText(extractedText);
          } catch (error) {
            console.error("Error reading DOCX file:", error);
            alert("Failed to read DOCX file. Please try again.");
            setRawText('');
          }
        } else if (file.type === 'text/plain') {
          extractedText = fileContent as string;
          setRawText(extractedText);
        } else {
          alert("Unsupported file type. Please upload a PDF, DOCX, or TXT file.");
          setRawText('');
        }
        setLoading(false);
      };

      reader.onerror = () => {
        setLoading(false);
        alert("Failed to read file.");
        setRawText('');
        setFileName(null);
      };

      if (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    } else {
      setFileName(null);
      setRawText('');
    }
  };

  const handleDownloadPdf = async () => {
    setLoading(true);
    const payload: FormatRequestPayload = {
      rawText, // Still pass rawText
      paperHeading,
      authorName,
      selectedFormat,
      selectedPaperType,
      abstractContent: extractedAbstract,
      keywordsContent: extractedKeywords,
      referencesContent: extractedReferences,
      mainBodyContent: mainContent,
    };
    try {
      await simulateGeneratePdfApi(payload);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Determine if the download button should be enabled
  const isDownloadEnabled =
    rawText.trim() !== '' ||
    paperHeading.trim() !== '' ||
    authorName.trim() !== '';


  return (
    <>
      <GlobalStyle />
      <Navbar />
      <AppWrapper>
        <MainContainer>
          <ControlsWrapper>
            <StyledLabel htmlFor="paperHeading">Paper Heading:</StyledLabel>
            <StyledInput
              id="paperHeading"
              type="text"
              value={paperHeading}
              onChange={(e) => setPaperHeading(e.target.value)}
              placeholder="e.g., The Impact of AI on Society"
            />

            <StyledLabel htmlFor="authorName">Author Name:</StyledLabel>
            <StyledInput
              id="authorName"
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g., John Doe"
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

            <FileUploadWrapper>
              <HiddenFileInput
                id="file-upload"
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
              />
              <FileUploadLabel htmlFor="file-upload">Choose File</FileUploadLabel>
              {fileName && <FileNameDisplay>{fileName}</FileNameDisplay>}
            </FileUploadWrapper>

            <StyledTextarea
              placeholder="Paste your raw text here or upload a file..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              rows={15}
            />

            <DownloadButton onClick={handleDownloadPdf} disabled={loading || !isDownloadEnabled}>
              {loading ? 'Generating PDF...' : 'Download Formatted PDF'}
            </DownloadButton>

          </ControlsWrapper>

          <PreviewContainer>
            {loading ? (
              <LoadingIndicator>Loading preview...</LoadingIndicator>
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