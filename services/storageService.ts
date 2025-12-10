
import { UserData, RelationshipType, AnalysisResult } from '../types';
// @ts-ignore
import * as XLSX from 'xlsx';

const STORAGE_KEY = 'YUE_LAO_SUBMISSIONS_DB';

// ⚠️ IMPORTANT: Replace this URL with your own Google Apps Script Web App URL
// Deploy Instructions:
// 1. Create Google Sheet -> Extensions -> Apps Script
// 2. Paste the doPost code
// 3. Deploy -> New Deployment -> Web App -> Access: "Anyone"
const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_SCRIPT_WEB_APP_URL_HERE"; 

interface SubmissionRecord extends UserData {
  id: string;
  timestamp: string;
  relationshipType: RelationshipType;
  analysisResult?: AnalysisResult;
}

export const saveSubmission = async (userData: UserData, type: RelationshipType, result?: AnalysisResult) => {
  // 1. Save to Local Storage (Backup & Admin Panel)
  try {
    const existingDataStr = localStorage.getItem(STORAGE_KEY);
    const submissions: SubmissionRecord[] = existingDataStr ? JSON.parse(existingDataStr) : [];

    const newSubmission: SubmissionRecord = {
      ...userData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      relationshipType: type,
      analysisResult: result
    };

    submissions.push(newSubmission);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    console.log('Submission saved to local DB', newSubmission.id);

    // 2. Send to Google Sheets
    if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.includes("script.google.com")) {
        sendToGoogleSheets(newSubmission);
    }

  } catch (error) {
    console.error('Failed to save submission.', error);
  }
};

const sendToGoogleSheets = async (data: SubmissionRecord) => {
    try {
        // Remove photo data before sending to Sheets (too large)
        const { photo, ...cleanData } = data;
        
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Important for Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cleanData)
        });
        console.log("Sent to Google Sheets");
    } catch (e) {
        console.error("Google Sheets Sync Error", e);
    }
}

export const getSubmissions = (): SubmissionRecord[] => {
    try {
        const str = localStorage.getItem(STORAGE_KEY);
        return str ? JSON.parse(str) : [];
    } catch (e) {
        return [];
    }
};

export const exportToExcel = () => {
    const data = getSubmissions();
    if (data.length === 0) {
        alert("No data to export");
        return;
    }

    // Flatten data for Excel
    const rows = data.map(record => ({
        ID: record.id,
        Timestamp: record.timestamp,
        Name: record.name,
        Email: record.email,
        Age: record.age,
        Gender: record.gender,
        Orientation: record.sexualOrientation,
        Goal: record.relationshipType,
        Height: record.height,
        Weight: record.weight,
        Occupation: record.occupation,
        Income: record.income,
        MBTI: record.mbti,
        Extroversion: record.introExtroScale,
        Thinking: record.thinkingFeelingScale,
        Interests: record.interests,
        Values: record.values,
        DarkSide: record.darkSide,
        Archetype: record.analysisResult?.archetypeTitle || 'N/A',
        Score: record.analysisResult?.compatibilityScore || 'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Submissions");
    
    XLSX.writeFile(workbook, `YueLao_Data_Export_${new Date().toISOString().slice(0,10)}.xlsx`);
};

export const clearDatabase = () => {
    if(confirm("Are you sure you want to delete all user data?")) {
        localStorage.removeItem(STORAGE_KEY);
        window.location.reload();
    }
};
