// src/component/common/Styles.ts
import styled from 'styled-components';

export const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f0f2f5;
`;

export const MainContainer = styled.main`
  display: flex;
  flex: 1; /* Allows it to grow and take available space */
  padding: 20px;
  gap: 20px;
  max-width: 1200px;
  margin: 20px auto;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;

  @media (max-width: 992px) {
    flex-direction: column;
    margin: 10px;
    padding: 15px;
  }
`;

export const ControlsWrapper = styled.section`
  flex: 0 0 300px; /* Fixed width for controls */
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);

  @media (max-width: 992px) {
    flex: none;
    width: 100%;
    padding: 15px;
  }
`;

export const StyledLabel = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
  display: block;
`;

export const StyledSelect = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  appearance: none; /* Remove default arrow on select */
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13.2-5.4H18.4c-4.8%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%204.8%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%208.1%205.4%2012.9%205.4s9.3-1.8%2012.9-5.4l128-127.9c3.6-3.6%205.4-8.1%205.4-12.9s-1.8-9.3-5.4-12.9z%22%2F%3E%3C%2Fsvg%3E');
  background-repeat: no-repeat;
  background-position: right 10px top 50%;
  background-size: 0.6em auto;
  cursor: pointer;

  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box; /* Ensures padding doesn't increase width */

  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

export const FileUploadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  border: 2px dashed #007bff;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s ease-in-out, background-color 0.2s ease-in-out;
  background-color: rgba(0, 123, 255, 0.05);

  &:hover {
    border-color: #0056b3;
    background-color: rgba(0, 123, 255, 0.1);
  }
`;

export const HiddenFileInput = styled.input.attrs({ type: 'file' })`
  display: none;
`;

export const FileUploadLabel = styled.label`
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

export const FileNameDisplay = styled.span`
  margin-top: 5px;
  font-size: 0.9rem;
  color: #555;
`;

export const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 200px;
  resize: vertical;
  box-sizing: border-box;

  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

export const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  color: #007bff;
  height: 50px; /* Adjust as needed */

  &::after {
    content: '';
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid #007bff;
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 1s linear infinite;
    margin-left: 10px;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const PreviewContainer = styled.section`
  flex: 1; /* Allows it to grow and fill remaining space */
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fff;
  overflow-y: auto; /* Enable scrolling for long content */
  position: relative; /* For loading overlay */

  @media (max-width: 992px) {
    padding: 15px;
  }
`;

export const DownloadButton = styled.button`
  background-color: #28a745;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 20px;
  align-self: center; /* Center button in controls */

  &:hover {
    background-color: #218838;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;