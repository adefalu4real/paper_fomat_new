import styled from 'styled-components';

// App Layout Components
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
  flex-wrap: wrap; /* Allows items to wrap to the next line on smaller screens */
  gap: 2rem; /* Space between controls and preview */
  width: 100%;
  max-width: 1400px; /* Max width for the entire layout */
  justify-content: center; /* Center items when there's extra space */

  @media (max-width: 768px) {
    flex-direction: column; /* Stack vertically on small screens */
    align-items: center; /* Center items when stacked */
  }
`;

export const ControlsWrapper = styled.div`
  flex: 1; /* Allows it to grow and shrink */
  min-width: 350px; /* Minimum width before wrapping */
  max-width: 500px; /* Maximum width for the controls column */
  background: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%; /* Take full width on small screens */
    max-width: none; /* Remove max-width constraint */
  }
`;

// Form Elements
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

// --- Preview Container (A4 Dimensions) ---
export const PreviewContainer = styled.div`
  flex: 2; /* Allows it to grow and shrink, taking more space */
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  overflow-y: auto; /* Enable vertical scrolling for content overflow */

  /* A4 Dimensions (portrait) - approximately */
  width: 210mm; /* 8.27 inches */
  height: 297mm; /* 11.69 inches */
  max-width: 210mm; /* Ensure it doesn't expand beyond A4 width */
  min-height: 297mm; /* Ensure it's at least A4 height, allowing it to grow for content */

  /* Responsive adjustments for smaller screens */
  @media (max-width: 1200px) {
    width: 100%; /* Take full width on smaller screens */
    height: auto; /* Auto height to allow scrolling */
    max-width: none; /* Remove max-width constraint */
    min-height: auto; /* Remove min-height constraint */
  }
  
  margin-left: 20px; /* Space from controls */
  display: flex;
  justify-content: center; /* Center content horizontally within the container */
  align-items: flex-start; /* Align content to the top */
  flex-shrink: 0; /* Prevent it from shrinking more than its content needs */

  @media (max-width: 768px) {
    margin-left: 0; /* Remove left margin when stacked */
    margin-top: 20px; /* Add top margin when stacked */
  }
`;

// Download Button and Options
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
  width: 100%; /* Make button full width */
  &:hover {
    background-color: #0041a3;
  }
  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }
`;

export const DownloadOptionsContainer = styled.div`
  position: absolute;
  bottom: calc(100% + 10px); /* Position above the button with some spacing */
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 100; /* Ensure it's above other elements */
  min-width: 180px; /* Adjust as needed */
  overflow: hidden; /* Ensures rounded corners */
`;

export const DownloadOptionButton = styled.button`
  background: none;
  border: none;
  padding: 10px 15px;
  text-align: left;
  cursor: pointer;
  font-size: 1rem;
  color: #333;
  width: 100%; /* Make option buttons full width of container */
  &:hover {
    background-color: #f0f0f0;
  }
  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
`;

// Error Message
export const ErrorMessage = styled.p`
  color: #D8000C; /* A standard error red color */
  background-color: #FFD2D2; /* A light red background */
  border: 1px solid #D8000C;
  padding: 10px;
  margin-top: -1rem; /* Pull it up to sit below the file input */
  margin-bottom: 1.5rem;
  border-radius: 5px;
  font-size: 0.9rem;
  text-align: left;
`;