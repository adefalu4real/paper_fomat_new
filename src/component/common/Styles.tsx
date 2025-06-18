import styled from 'styled-components';

export const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #f4f7fc;
  min-height: 100vh;
`;

export const MainContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  width: 100%;
  max-width: 1400px;
  justify-content: center;
`;

export const ControlsWrapper = styled.div`
  flex: 1;
  min-width: 350px;
  max-width: 500px;
  background: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
`;

export const StyledLabel = styled.label`
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #4a5568;
`;

export const StyledSelect = styled.select`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1.5rem;
  border-radius: 5px;
  border: 1px solid #cbd5e0;
  background-color: #fff;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #0052cc;
    box-shadow: 0 0 0 2px rgba(0, 82, 204, 0.2);
  }
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1.5rem;
  border-radius: 5px;
  border: 1px solid #cbd5e0;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #0052cc;
    box-shadow: 0 0 0 2px rgba(0, 82, 204, 0.2);
  }
`;

export const FileUploadWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const FileUploadLabel = styled.label`
  padding: 0.8rem 1.5rem;
  background-color: #e2e8f0;
  color: #4a5568;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
  &:hover {
    background-color: #cbd5e0;
  }
`;

export const FileNameDisplay = styled.span`
  margin-left: 1rem;
  font-style: italic;
  color: #718096;
`;

export const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1.5rem;
  border-radius: 5px;
  border: 1px solid #cbd5e0;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 150px;
  &:focus {
    outline: none;
    border-color: #0052cc;
    box-shadow: 0 0 0 2px rgba(0, 82, 204, 0.2);
  }
`;

export const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 1.2rem;
  color: #718096;
`;

export const PreviewContainer = styled.div`
  flex: 2;
  min-width: 350px;
  max-width: 800px;
  height: 80vh;
  background: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
  border: 1px solid #e2e8f0;
`;

export const DownloadButton = styled.button`
  padding: 1rem;
  background-color: #0052cc;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: background-color 0.2s;
  &:hover {
    background-color: #0041a3;
  }
  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }
`;

// --- ADD THIS EXPORT ---
export const ErrorMessage = styled.p`
  color: #D8000C; // A standard error red color
  background-color: #FFD2D2; // A light red background
  border: 1px solid #D8000C;
  padding: 10px;
  margin-top: -1rem; /* Pull it up to sit below the file input */
  margin-bottom: 1.5rem;
  border-radius: 5px;
  font-size: 0.9rem;
  text-align: left;
`;