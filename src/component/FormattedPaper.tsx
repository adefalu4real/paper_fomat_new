// src/component/FormattedPaper.tsx
import React from 'react';
import styled from 'styled-components';

interface FormattedPaperProps {
  htmlContent: string;
}

const PaperDisplay = styled.div`
  
  padding: 20px; /* Example padding */
  background-color: #fff;
  min-height: 400px;
  border: 1px solid #eee;
  line-height: inherit; 
  font-family: inherit; 

  h1, h2, h3, h4, h5, h6 {
    text-align: center; /* Basic centering for headings within the paper for example */
    margin-top: 1.5em;
    margin-bottom: 0.8em;
  }

  p {
    text-indent: 0.5in; 
    margin-bottom: 0; 
    text-align: justify; 
  }

 
  p[style*="font-weight: bold; margin-top: 1em;"] { 
    text-indent: 0;
    text-align: left;
  }
`;

const FormattedPaper: React.FC<FormattedPaperProps> = ({ htmlContent }) => {
 
  return (
    <PaperDisplay dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
};

export default FormattedPaper;