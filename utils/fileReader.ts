import * as fs from 'fs';
import * as path from 'path';

export async function readJsonFileAsync(filePath: string): Promise<any> {
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    const fileContent = await fs.promises.readFile(fullPath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    throw new Error(`Failed to read JSON file ${filePath}: ${error}`);
  }
}
