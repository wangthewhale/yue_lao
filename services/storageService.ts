
import { UserData, RelationshipType, AnalysisResult } from '../types';
// @ts-ignore
import * as XLSX from 'xlsx';

const STORAGE_KEY = 'YUE_LAO_SUBMISSIONS_DB';

interface SubmissionRecord extends UserData {
  id: string;
  timestamp: string;
  relationshipType: RelationshipType;
  analysisResult?: AnalysisResult;
}

export const saveSubmission = (userData: UserData, type: RelationshipType, result?: AnalysisResult) => {
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
  } catch (error) {
    console.error('Failed to save submission. LocalStorage might be full.', error);
    // Fallback: If quota exceeded (due to images), try saving without photo
    if (userData.photo) {
        try {
            const cleanData = { ...userData, photo: 'IMAGE_TOO_LARGE_NOT_SAVED' };
            saveSubmission(cleanData, type, result);
        } catch (e) {
            console.error('Even text save failed', e);
        }
    }
  }
};

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
        // Photo: record.photo ? "Base64 Image Present" : "No Image" // Keeping excel clean
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
