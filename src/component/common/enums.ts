// src/component/common/enums.ts

export enum PaperType {
  Essay = 'essay',
  ResearchPaper = 'research-paper',
  Thesis = 'thesis',
  Dissertation = 'dissertation',
  LabReport = 'lab-report',
  JournalArticle = 'journal-article',
  SeminarPaper = 'seminar-paper',
  ConferenceReport = 'conference-report',
  GeneralArticle = 'general-article',
  // Add more as needed
}

export enum FormatType {
  Basic = 'basic', // A default, unspecific format
  'basic-apa' = 'basic-apa', // Simple APA-like formatting
  'basic-mla' = 'basic-mla', // Simple MLA-like formatting
  // Add more specific formats like APA 7th, MLA 9th, Chicago, IEEE, etc.
}