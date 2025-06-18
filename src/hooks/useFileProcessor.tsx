import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { TextItem } from 'pdfjs-dist/types/src/display/api';

// Point to the worker file that will be copied into our 'public' folder.
pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

export const useFileProcessor = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const processFile = async (file: File): Promise<string> => {
        if (!file) {
            setFileName(null);
            throw new Error("No file selected.");
        }

        setFileName(file.name);
        setIsProcessing(true);
        setError(null);

        try {
            if (file.type === 'application/pdf') {
                const data = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data }).promise;
                let extractedText = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const textItems = textContent.items.filter((item): item is TextItem => 'str' in item);
                    extractedText += textItems.map((item) => item.str).join(' ') + '\n';
                }
                return extractedText;
            } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                // FIX: Restored the .docx processing logic that uses the 'mammoth' library.
                const arrayBuffer = await file.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer });
                return result.value;
            } else if (file.type === 'text/plain') {
                return await file.text();
            } else {
                throw new Error("Unsupported file type. Please upload a PDF, DOCX, or TXT file.");
            }
        } catch (err: unknown) {
            let message = 'An unknown error occurred';
            if (err instanceof Error) {
                message = err.message;
            } else if (typeof err === 'string') {
                message = err;
            }
            const errorMessage = `Failed to read ${file.name}: ${message}`;
            console.error(errorMessage, err);
            setError(errorMessage);
            
            throw err;
        } finally {
            setIsProcessing(false);
        }
    };

    return { isProcessing, fileName, error, processFile, setFileName };
};