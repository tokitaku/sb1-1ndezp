import Papa from 'papaparse';
import { Question } from '../types';

export const parseCSV = (file: File): Promise<Question[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (results) => {
        const questions: Question[] = results.data
          .filter((row: any) => row.no && row.quiz && row.answer)
          .map((row: any) => ({
            id: parseInt(row.no),
            question: row.quiz,
            answer: row.answer
          }));
        resolve(questions);
      },
      header: true,
      error: (error) => reject(error),
      skipEmptyLines: true
    });
  });
};