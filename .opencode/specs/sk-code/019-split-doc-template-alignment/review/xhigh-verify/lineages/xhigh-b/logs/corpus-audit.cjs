'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const roots = [
  '.opencode/skills/sk-code/code-opencode/',
  '.opencode/skills/sk-code/code-webflow/',
  '.opencode/skills/sk-code/code-quality/',
];

const tracked = execFileSync('git', [
  'ls-files',
  '--',
  '.opencode/skills/sk-code/code-opencode/references',
  '.opencode/skills/sk-code/code-opencode/assets',
  '.opencode/skills/sk-code/code-webflow/references',
  '.opencode/skills/sk-code/code-webflow/assets',
  '.opencode/skills/sk-code/code-quality/references',
  '.opencode/skills/sk-code/code-quality/assets',
], { encoding: 'utf8' })
  .trim()
  .split('\n');
const files = tracked.filter((file) =>
  roots.some((root) => file.startsWith(root))
  && /\/(references|assets)\//.test(file)
  && file.endsWith('.md'));

function stripFences(content) {
  let inside = false;
  return content.split('\n').filter((line) => {
    if (/^\s*```/.test(line)) {
      inside = !inside;
      return false;
    }
    return !inside;
  }).join('\n');
}

function normalize(content) {
  return content
    .toLowerCase()
    .replace(/[`*_#.:;,!?()\[\]{}"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const defects = {
  hyphen: [],
  frontmatter: [],
  triggerCount: [],
  triggerShape: [],
  metadataEnum: [],
  version: [],
  h1: [],
  intro: [],
  overview: [],
  modeSection: [],
  numbering: [],
  relatedLast: [],
  introPurposeDuplicate: [],
  validator: [],
};
const bySurface = {};

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const surface = file.split('/')[3];
  bySurface[surface] = (bySurface[surface] || 0) + 1;

  if (path.basename(file).includes('-')) {
    defects.hyphen.push(file);
  }

  const frontmatter = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!frontmatter) {
    defects.frontmatter.push(file);
    continue;
  }

  for (const key of ['title', 'description', 'trigger_phrases', 'importance_tier', 'contextType']) {
    if (!new RegExp(`^${key}:`, 'm').test(frontmatter[1])) {
      defects.frontmatter.push(`${file}:${key}`);
    }
  }

  const triggerBlock = frontmatter[1].match(
    /^trigger_phrases:\s*\n((?:[ \t]+-\s+.*(?:\n|$))+)/m,
  );
  const triggerPhrases = triggerBlock
    ? triggerBlock[1]
      .trim()
      .split('\n')
      .map((line) => line.replace(/^\s*-\s+/, '').trim().replace(/^['"]|['"]$/g, ''))
    : [];
  if (triggerPhrases.length < 3 || triggerPhrases.length > 8) {
    defects.triggerCount.push(`${file}:${triggerPhrases.length}`);
  }
  if (triggerPhrases.some((phrase) => phrase !== phrase.toLowerCase() || !phrase.includes(' '))) {
    defects.triggerShape.push(file);
  }

  const importance = (frontmatter[1].match(/^importance_tier:\s*['"]?([^\s'"]+)/m) || [])[1];
  const contextType = (frontmatter[1].match(/^contextType:\s*['"]?([^\s'"]+)/m) || [])[1];
  if (!['normal', 'important', 'critical', 'constitutional', 'temporary', 'archived', 'deprecated'].includes(importance)
      || !['planning', 'research', 'implementation', 'general'].includes(contextType)) {
    defects.metadataEnum.push(file);
  }

  const version = frontmatter[1].match(/^version:\s*["']?([^\s"']+)/m);
  if (!version || !/^\d+\.\d+\.\d+\.\d+$/.test(version[1])) {
    defects.version.push(file);
  }

  const lines = stripFences(content.slice(frontmatter[0].length)).split('\n');
  const h1 = lines.findIndex((line) => line.trim());
  if (h1 < 0 || !/^#\s+[^#]/.test(lines[h1])) {
    defects.h1.push(file);
  }

  const overview = lines.findIndex((line, index) =>
    index > h1 && /^##\s+1\.\s+OVERVIEW\s*$/i.test(line.trim()));
  if (overview < 0) {
    defects.overview.push(file);
  } else {
    const introLines = lines
      .slice(h1 + 1, overview)
      .map((line) => line.trim())
      .filter(Boolean)
      .filter((line) => line !== '---');
    if (!introLines.length || introLines.some((line) => /^#{2,}/.test(line))) {
      defects.intro.push(file);
    }

    const nextH2 = lines.findIndex((line, index) => index > overview && /^##\s+/.test(line));
    const overviewText = lines.slice(overview, nextH2 < 0 ? lines.length : nextH2).join('\n');
    const modeHeading = file.includes('/assets/') ? 'Usage' : 'When to Use';
    if (!new RegExp(`^###\\s+${modeHeading}\\b.*$`, 'mi').test(overviewText)
        || !/^###\s+Purpose\s*$/mi.test(overviewText)) {
      defects.modeSection.push(file);
    }

    const purposeMatch = overviewText.match(
      /^###\s+Purpose\s*\n+([\s\S]*?)(?=\n###\s+|$)/mi,
    );
    const intro = normalize(introLines.join(' '));
    const purpose = normalize(purposeMatch ? purposeMatch[1] : '');
    if (intro && purpose && (intro === purpose || intro.includes(purpose) || purpose.includes(intro))) {
      defects.introPurposeDuplicate.push(file);
    }
  }

  const h2Headings = lines
    .filter((line) => /^##\s+/.test(line.trim()))
    .map((line) => line.trim());
  const contentHeadings = h2Headings.filter((line) => !/RELATED RESOURCES/i.test(line));
  const numbered = contentHeadings
    .map((line) => (line.match(/^##\s+(\d+)\./) || [])[1])
    .filter(Boolean)
    .map(Number);
  if (numbered.length !== contentHeadings.length || numbered.some((number, index) => number !== index + 1)) {
    defects.numbering.push(file);
  }

  const related = h2Headings.findIndex((line) => /RELATED RESOURCES/i.test(line));
  if (related >= 0 && related !== h2Headings.length - 1) {
    defects.relatedLast.push(file);
  }

  const type = file.includes('/assets/') ? 'asset' : 'reference';
  const result = spawnSync(
    'python3',
    ['.opencode/skills/sk-doc/shared/scripts/validate_document.py', file, '--type', type],
    { encoding: 'utf8' },
  );
  if (result.status !== 0) {
    defects.validator.push({
      file,
      status: result.status,
      output: `${result.stdout || ''}${result.stderr || ''}`.trim().slice(-500),
    });
  }
}

const totalDefects = Object.values(defects).reduce((count, entries) => count + entries.length, 0);
process.stdout.write(`${JSON.stringify({
  files: files.length,
  bySurface,
  totalDefects,
  defectCounts: Object.fromEntries(
    Object.entries(defects).map(([key, entries]) => [key, entries.length]),
  ),
  samples: Object.fromEntries(
    Object.entries(defects)
      .filter(([, entries]) => entries.length)
      .map(([key, entries]) => [key, entries.slice(0, 8)]),
  ),
}, null, 2)}\n`);
