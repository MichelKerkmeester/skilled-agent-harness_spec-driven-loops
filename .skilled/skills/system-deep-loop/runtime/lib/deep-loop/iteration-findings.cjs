'use strict';

// Keep Markdown finding extraction shared so iteration verification and registry
// reconstruction count the same entries. A section is read in one shape only, the
// first one present of numbered subheadings, numbered lines and F### bullets, so a
// finding restated in a second shape is not counted twice.
function parseIterationMarkdownFindings(content, run, sourcePath) {
  const lines = content.split(/\r?\n/);
  const headingIndex = lines.findIndex((line) => /^##\s+Findings\s*$/i.test(line.trim()));
  if (headingIndex < 0) return [];
  const sectionLines = [];
  for (let index = headingIndex + 1; index < lines.length; index += 1) {
    const line = lines[index].trimEnd();
    if (/^##\s+/.test(line.trim())) break;
    sectionLines.push(line);
  }
  const subheadingFindings = sectionLines.flatMap((line) => {
    const match = line.trim().match(/^###\s+\d+\.\s+(.+)$/);
    return match ? [match[1]] : [];
  });
  // Only a line at the left margin opens a finding. An indented numbered line is a
  // step or a piece of evidence under the finding above it.
  const numberedFindings = sectionLines.flatMap((line) => {
    const match = line.match(/^\d+\.\s+(.+)$/);
    return match ? [match[1]] : [];
  });
  const bulletFindings = sectionLines.flatMap((line) => {
    const match = line.match(/^-\s+\*\*F\d+\*\*:\s*(.+)$/);
    return match ? [match[1]] : [];
  });
  const findingTexts = [subheadingFindings, numberedFindings, bulletFindings]
    .find((texts) => texts.length > 0) ?? [];
  return findingTexts.map((text, index) => ({
    id: `iteration-${run}-finding-${index + 1}`,
    title: text,
    text,
    addedAtIteration: run,
    _iteration_source: sourcePath,
  }));
}

// Append-only logs can contain corrected attempts. Keep the last record for each
// numeric iteration so the gate, the merge and the closeout share one state view.
function latestIterationRecords(records) {
  const lastIndexByIteration = new Map();
  records.forEach((record, index) => {
    if (!record || record.type !== 'iteration') return;
    const iteration = Number(record.iteration ?? record.run);
    if (Number.isSafeInteger(iteration)) lastIndexByIteration.set(iteration, index);
  });
  return records.filter((record, index) => {
    if (!record || record.type !== 'iteration') return true;
    const iteration = Number(record.iteration ?? record.run);
    return !Number.isSafeInteger(iteration) || lastIndexByIteration.get(iteration) === index;
  });
}

// A delta row is filed under its own iteration, and under the delta file's number
// only when it names none.
function deltaRowIteration(row, fileRun) {
  const iterationNumber = Number(row?.iteration);
  return Number.isFinite(iterationNumber) ? Math.floor(iterationNumber) : fileRun;
}

function normalizeFindingKey(value) {
  return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

// Every identity a finding can be matched by. The closeout and the merge must agree
// on what makes a state finding present in a registry, so both read these keys.
function findingKeys(candidate) {
  if (typeof candidate === 'string') {
    const key = normalizeFindingKey(candidate);
    return key ? [key] : [];
  }
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return [];
  return [...new Set([
    candidate.id,
    candidate.findingId,
    candidate.title,
    candidate.summary,
    candidate.text,
    candidate.finding,
    candidate.description,
  ].map(normalizeFindingKey).filter(Boolean))];
}

module.exports = {
  parseIterationMarkdownFindings,
  latestIterationRecords,
  deltaRowIteration,
  normalizeFindingKey,
  findingKeys,
};
