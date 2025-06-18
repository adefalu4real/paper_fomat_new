import React, { useState, useEffect,  } from 'react';
import { PaperType, FormatType } from './component/common/enums';
import {
    AppWrapper, MainContainer, ControlsWrapper, StyledLabel, StyledSelect, StyledInput,
    FileUploadWrapper, HiddenFileInput, FileUploadLabel, FileNameDisplay,
    StyledTextarea, LoadingIndicator, PreviewContainer, DownloadButton, ErrorMessage
} from './component/common/Styles';
import { GlobalStyle } from './GlobalStyles';
import Navbar from './component/Navbar';
import FormattedPaper from './component/FormattedPaper';
import { useFileProcessor } from './hooks/useFileProcessor';
import { parseDocumentSections } from './utils/parsing';
import { simulateFormatPreviewApi, simulateGeneratePdfApi, FormatRequestPayload } from './services/api';

const App: React.FC = () => {
    // State for user inputs
    const [rawText, setRawText] = useState<string>('');
    const [paperHeading, setPaperHeading] = useState<string>('');
    const [authorName, setAuthorName] = useState<string>('');
    const [selectedFormat, setSelectedFormat] = useState<FormatType>(FormatType.Basic);
    const [selectedPaperType, setSelectedPaperType] = useState<PaperType>(PaperType.Essay);

    // State for parsed content
    const [parsedContent, setParsedContent] = useState({
        abstract: '',
        keywords: '',
        references: '',
        mainContent: '',
    });

    // State for UI
    const [formattedContent, setFormattedContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    // Custom hook for file processing
    const { isProcessing: isFileProcessing, fileName, error: fileError, processFile, setFileName } = useFileProcessor();

    // Parse document whenever raw text changes
    useEffect(() => {
        const sections = parseDocumentSections(rawText);
        setParsedContent(sections);
    }, [rawText]);

    // Generate formatted preview
    useEffect(() => {
        const handler = setTimeout(() => {
            setIsLoading(true);
            const payload: FormatRequestPayload = {
                rawText,
                paperHeading,
                authorName,
                selectedFormat,
                selectedPaperType,
                abstractContent: parsedContent.abstract,
                keywordsContent: parsedContent.keywords,
                referencesContent: parsedContent.references,
                mainBodyContent: parsedContent.mainContent,
            };
            simulateFormatPreviewApi(payload)
                .then(html => setFormattedContent(html))
                .catch(error => {
                    console.error("Error formatting preview:", error);
                    setFormattedContent('<p style="color: red;">Error loading preview.</p>');
                })
                .finally(() => setIsLoading(false));
        }, 300);

        return () => clearTimeout(handler);
    }, [rawText, paperHeading, authorName, selectedFormat, selectedPaperType, parsedContent]);


    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          try {
              const text = await processFile(file);
              setRawText(text);
          } catch { // FIX: The unused '(err: unknown)' parameter has been removed.
              // The `useFileProcessor` hook already logs the error and sets the error message.
              // This block just needs to reset the component's state.
              setRawText('');
          }
      } else {
          setFileName(null);
          setRawText('');
      }
  };

    const handleDownloadPdf = async () => {
        setIsLoading(true);
        const payload: FormatRequestPayload = {
            rawText,
            paperHeading,
            authorName,
            selectedFormat,
            selectedPaperType,
            abstractContent: parsedContent.abstract,
            keywordsContent: parsedContent.keywords,
            referencesContent: parsedContent.references,
            mainBodyContent: parsedContent.mainContent,
        };
        try {
            await simulateGeneratePdfApi(payload);
        } catch (error) {
            console.error("Error generating PDF:", error);
            // In a real app, you'd show a toast notification here
        } finally {
            setIsLoading(false);
        }
    };

    // UX Enhancement: Conditionally show certain fields
    const showKeywordsInput = selectedFormat === FormatType.IEEE || selectedPaperType === PaperType.JournalArticle;
    const isDownloadEnabled = rawText.trim() !== '' || paperHeading.trim() !== '' || authorName.trim() !== '';
    const showLoading = isLoading || isFileProcessing;

    return (
        <>
            <GlobalStyle />
            <Navbar />
            <AppWrapper>
                <MainContainer>
                    <ControlsWrapper>
                        <StyledLabel htmlFor="paperHeading">Paper Heading:</StyledLabel>
                        <StyledInput id="paperHeading" type="text" value={paperHeading} onChange={(e) => setPaperHeading(e.target.value)} placeholder="e.g @The role of computer in human life " />

                        <StyledLabel htmlFor="authorName">Author Name:</StyledLabel>
                        <StyledInput id="authorName" type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="e.g., Jane Doe" />

                        {/* Add more conditional fields here if needed */}
                        {showKeywordsInput && (
                             <>
                                <StyledLabel htmlFor="keywords">Keywords:</StyledLabel>
                                <StyledInput id="keywords" type="text" value={parsedContent.keywords} 
                                   onChange={(e) => setParsedContent({...parsedContent, keywords: e.target.value})}
                                   placeholder="e.g., Artificial Intelligence, Ethics..." />
                             </>
                        )}
                        
                        <StyledLabel htmlFor="paperType">Paper Type:</StyledLabel>
                        <StyledSelect id="paperType" value={selectedPaperType} onChange={(e) => setSelectedPaperType(e.target.value as PaperType)}>
                            {Object.values(PaperType).map((type) => (<option key={type} value={type}>{type}</option>))}
                        </StyledSelect>

                        <StyledLabel htmlFor="formatType">Formatting Style:</StyledLabel>
                        <StyledSelect id="formatType" value={selectedFormat} onChange={(e) => setSelectedFormat(e.target.value as FormatType)}>
                            {Object.values(FormatType).map((format) => (<option key={format} value={format}>{format}</option>))}
                        </StyledSelect>

                        <FileUploadWrapper>
                            <HiddenFileInput id="file-upload" type="file" accept=".pdf,.docx,.txt" onChange={handleFileChange} />
                            <FileUploadLabel htmlFor="file-upload">Choose File</FileUploadLabel>
                            {fileName && <FileNameDisplay>{fileName}</FileNameDisplay>}
                        </FileUploadWrapper>
                        {fileError && <ErrorMessage>{fileError}</ErrorMessage>}

                        <StyledTextarea
                            placeholder="Paste your raw text here or upload a file..."
                            value={rawText}
                            onChange={(e) => setRawText(e.target.value)}
                            rows={15}
                        />

                        <DownloadButton onClick={handleDownloadPdf} disabled={showLoading || !isDownloadEnabled}>
                            {showLoading ? 'Processing...' : 'Download Formatted PDF'}
                        </DownloadButton>
                    </ControlsWrapper>
                    <PreviewContainer>
                        {showLoading ? (
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