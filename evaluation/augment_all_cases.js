import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allCasesPath = path.join(__dirname, 'all_cases.json');
const resultsPath = path.join(__dirname, 'results', 'eval_results.jsonl');

if (!fs.existsSync(allCasesPath)) {
  console.error("all_cases.json not found.");
  process.exit(1);
}

if (!fs.existsSync(resultsPath)) {
  console.error("eval_results.jsonl not found.");
  process.exit(1);
}

// 1. Read all_cases.json
const allCases = JSON.parse(fs.readFileSync(allCasesPath, 'utf8'));

// 2. Read eval_results.jsonl
const resultsText = fs.readFileSync(resultsPath, 'utf8');
const resultLines = resultsText.split('\n').filter(line => line.trim().length > 0);

// Map where we'll keep the most "successful" result for each case
const resultsMap = {};

for (const line of resultLines) {
  try {
    const data = JSON.parse(line);
    const id = data.run_id || data.case_id;
    if (!id) continue;
    
    const existing = resultsMap[id];
    
    // We prefer a successful result with a response
    const hasResponse = data.response !== null || data.final_response !== undefined;
    const isSuccess = data.status === 'success';
    
    if (!existing) {
        resultsMap[id] = data;
    } else {
        const existingHasResponse = existing.response !== null || existing.final_response !== undefined;
        // Overwrite if new one has a response and the old one didn't, or if new is success and old isn't
        if ((hasResponse && !existingHasResponse) || (isSuccess && existing.status !== 'success')) {
            resultsMap[id] = data;
        }
    }
  } catch (e) {
      console.warn("Could not parse line: ", line);
  }
}

// 3. Update allCases
let updatedCount = 0;
for (const testCase of allCases) {
    const id = testCase.run_id || testCase.case_id;
    const match = resultsMap[id];
    
    if (match) {
        if (match.response !== undefined || match.final_response !== undefined) {
            testCase.response = match.response || match.final_response;
        }
        if (match.model_name !== undefined) testCase.model_name = match.model_name;
        if (match.latency_ms !== undefined) testCase.latency_ms = match.latency_ms;
        if (match.timestamp !== undefined) testCase.timestamp = match.timestamp;
        if (match.status !== undefined) testCase.status = match.status;
        updatedCount++;
    }
}

// 4. Save back to all_cases.json
fs.writeFileSync(allCasesPath, JSON.stringify(allCases, null, 2), 'utf8');
console.log(`Successfully updated ${updatedCount} cases in all_cases.json with eval results.`);
