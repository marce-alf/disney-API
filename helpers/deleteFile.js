import fsPromises from 'fs/promises';
import fs from 'fs';
import { API_URL } from '../config/config.js';

export default async (file) => {
  try {
    if (!file || file.includes('default.png')) return console.log('Nothing to remove.');
    file = file.replace(`${API_URL}`, 'data\\');
    if (!fs.existsSync(file)) throw new Error('File not found or does not exist!');
    await fsPromises.unlink(file);
    console.log(`file: ${file} removed successfully.`);
  } catch (err) {
    console.error(err);
  }
};
