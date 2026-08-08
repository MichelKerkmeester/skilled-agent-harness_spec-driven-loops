#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const EXIT_OK = 0;
const EXIT_VIOLATIONS = 1;
const EXIT_USAGE = 2;
const ROOT_FILENAME = 'manual-testing-playbook.md';
const SCENARIO_EXT = '.md';
const CONTRACT = 'operator-scenario';
const RESULT_PERSISTENCE_MARKER = 'MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT';
const REQUIRED_OUTCOME_VOCABULARY = Object.freeze(['PASS', 'FAIL', 'SKIP']);
const FORBIDDEN_VERDICTS = ['PARTIAL', 'READY', 'UNAUTOMATABLE', 'BLOCKED'];
const REQUIRED_SECTIONS = [
  /^1\.\s+OVERVIEW$/i,
  /^2\.\s+SCENARIO CONTRACT$/i,
  /^3\.\s+TEST EXECUTION$/i,
  /^4\.\s+(?:REFERENCES|SOURCE FILES)$/i,
  /^5\.\s+SOURCE METADATA$/i,
];

// Existing fleet packages start in warning mode so the first enforcement run
// reports the backlog without making the unverified baseline a release gate.
const WARN_PACKAGE_IDS = Object.freeze([
  'cli-external-orchestration',
  'mcp-code-mode',
  'mcp-tooling',
  'sk-code',
  'sk-design',
  'sk-doc',
  'sk-git',
  'sk-prompt',
  'system-deep-loop',
  'system-skill-advisor',
  'system-spec-kit',
]);

function usage() {
  return [
    'Usage: node validate-playbook-package.cjs [options]',
    '',
    'Validates the operator-scenario contract defined by',
    'sk-create-manual-testing-playbook. It is separate from the routing-gold',
    'contract enforced by validate-playbook-topology.cjs.',
    '',
    'Options:',
    '  --package ID|PATH   Validate one package or an explicit playbook root',
    '  --repo-root PATH    Repository root (defaults from this script)',
    '  --skills-root PATH  Skills root (defaults to <repo>/.opencode/skills)',
    '  --manifest PATH     Corpus manifest (defaults to this packet manifest)',
    '  --format text|json  Report format (default: text)',
    '  --json              Alias for --format json',
    '  --strict            Fail closed (default)',
    '  --no-strict         Report violations without failing the process',
    '  --help              Show this message',
  ].join('\n');
}

function parseArgs(argv) {
  const args = { packageFilter: null, repoRoot: null, skillsRoot: null, manifest: null, format: 'text', strict: true };
  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i];
    if (value === '--help' || value === '-h') args.help = true;
    else if (value === '--package') args.packageFilter = argv[++i];
    else if (value === '--repo-root') args.repoRoot = argv[++i];
    else if (value === '--skills-root') args.skillsRoot = argv[++i];
    else if (value === '--manifest') args.manifest = argv[++i];
    else if (value === '--format') args.format = argv[++i];
    else if (value === '--json') args.format = 'json';
    else if (value === '--strict') args.strict = true;
    else if (value === '--no-strict') args.strict = false;
    else throw new Error(`unknown argument: ${value}`);
  }
  if (!['text', 'json'].includes(args.format)) throw new Error(`unsupported format: ${args.format}`);
  if (args.packageFilter === undefined || args.repoRoot === undefined || args.skillsRoot === undefined || args.manifest === undefined) {
    throw new Error('an option is missing its value');
  }
  return args;
}

function defaultPaths() {
  const repoRoot = path.resolve(__dirname, '../../../../..');
  return {
    repoRoot,
    skillsRoot: path.join(repoRoot, '.opencode', 'skills'),
    manifest: path.join(__dirname, '..', 'playbook-corpus-manifest.json'),
  };
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function walkMarkdown(root) {
  const files = [];
  const visit = (current) => {
    const entries = fs.readdirSync(current, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) visit(full);
      else if (entry.isFile() && entry.name.toLowerCase().endsWith(SCENARIO_EXT)) files.push(full);
    }
  };
  visit(root);
  return files;
}

function isWithin(candidate, parent) {
  const relative = path.relative(parent, candidate);
  return relative === '' || (relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative));
}

function extractFrontmatter(text) {
  const match = /^(?:\s*<!--(?:[\s\S]*?)-->\s*)?---\s*\n([\s\S]*?)\n---\s*(?:\n|$)/.exec(text);
  if (!match) return null;
  const fields = {};
  for (const line of match[1].split('\n')) {
    const field = /^\s*([A-Za-z0-9_-]+)\s*:\s*(.*?)\s*$/.exec(line);
    if (!field) continue;
    let value = field[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    fields[field[1]] = value;
  }
  return { block: match[1], fields, end: match[0].length };
}

function hasRoutingGoldSignature(frontmatter) {
  const block = frontmatter?.block || '';
  const modeMatch = /(?:^|\n)[ \t]*expected_workflow_mode:[ \t]*["']?([^"'\n]+?)["']?[ \t]*(?:\n|$)/.exec(block);
  if (!modeMatch || !modeMatch[1].trim()) return false;

  const listMatch = /(?:^|\n)[ \t]*expected_leaf_resources:[ \t]*\n((?:[ \t]*-[ \t]*workflow_mode:.*\n[ \t]*leaf_resource_id:.*\n?)+)/.exec(block);
  if (!listMatch) return false;

  const pairRe = /-[ \t]*workflow_mode:[ \t]*["']?([^"'\n]+?)["']?[ \t]*\n[ \t]*leaf_resource_id:[ \t]*["']?([^"'\n]+?)["']?[ \t]*(?:\n|$)/g;
  return Array.from(listMatch[1].matchAll(pairRe)).some((pair) => pair[1].trim() && pair[2].trim());
}

function extractFeatureId(text, frontmatter) {
  if (frontmatter && frontmatter.fields.id && frontmatter.fields.id.trim()) return frontmatter.fields.id.trim();
  const metadata = /(?:^|\n)\s*(?:[-*]\s*)?(?:Playbook ID|Feature ID)\s*:\s*`?([^`\n]+)`?/i.exec(text);
  if (metadata && metadata[1].trim() && !/^scenario$|^\{[^}]+\}$/i.test(metadata[1].trim())) return metadata[1].trim();
  const heading = /(?:^|\n)#\s+([A-Z][A-Z0-9]*-\d{3}|\d{2,4})(?:\s+[-:|]|\s|$)/.exec(text);
  if (heading) return heading[1];
  const table = /\|\s*([A-Z][A-Z0-9]*-\d{3}|\d{2,4})\s*\|/.exec(text);
  return table ? table[1] : null;
}

function lineNumberAt(text, offset) {
  return text.slice(0, offset).split('\n').length;
}

function issue(code, filePath, message, severity = 'error', line = null) {
  return { code, severity, file: filePath, ...(line ? { line } : {}), message };
}

function sectionChecks(text, relPath) {
  const headings = [];
  const headingRe = /^##\s+(.+?)\s*$/gm;
  let match;
  while ((match = headingRe.exec(text)) !== null) headings.push({ value: match[1], line: lineNumberAt(text, match.index) });
  const errors = [];
  const positions = REQUIRED_SECTIONS.map((pattern) => headings.findIndex((heading) => pattern.test(heading.value)));
  if (positions.some((position) => position < 0)) {
    if (positions[4] < 0) errors.push(issue('SECTION_5_MISSING', relPath, 'missing required section 5: SOURCE METADATA'));
    for (let i = 0; i < positions.length - 1; i += 1) {
      if (positions[i] < 0) errors.push(issue('SECTION_MISSING', relPath, `missing required section ${i + 1}`));
    }
  }
  if (positions.every((position) => position >= 0) && positions.some((position, index) => index > 0 && position <= positions[index - 1])) {
    errors.push(issue('SECTION_ORDER_MISMATCH', relPath, 'required numbered sections are not in order'));
  }
  return errors;
}

function hasMarker(text, pattern) {
  return pattern.test(text);
}

function executionContractChecks(text, relPath) {
  const warnings = [];
  if (!text.includes(RESULT_PERSISTENCE_MARKER)) {
    warnings.push(issue(
      'RESULT_PERSISTENCE_MARKER_MISSING',
      relPath,
      `root playbook is missing the advisory ${RESULT_PERSISTENCE_MARKER} completion marker`,
      'warning',
    ));
  }
  const missingOutcomes = REQUIRED_OUTCOME_VOCABULARY.filter(
    (outcome) => !new RegExp(`\\b${outcome}\\b`).test(text),
  );
  if (missingOutcomes.length > 0) {
    warnings.push(issue(
      'RESULT_OUTCOME_VOCABULARY_MISSING',
      relPath,
      `root playbook is missing advisory outcome vocabulary: ${missingOutcomes.join(', ')}`,
      'warning',
    ));
  }
  return warnings;
}

function scenarioTableState(text) {
  const lines = text.split('\n');
  for (let index = 0; index < lines.length; index += 1) {
    if (!/^\s*\|\s*Feature ID\s*\|/i.test(lines[index])) continue;
    const columns = lines[index].split('|').slice(1, -1).map((cell) => cell.trim().toLowerCase());
    let row = null;
    for (let rowIndex = index + 1; rowIndex < lines.length; rowIndex += 1) {
      if (!/^\s*\|/.test(lines[rowIndex])) break;
      if (/^\s*\|[\s|:-]+\|\s*$/.test(lines[rowIndex])) continue;
      row = lines[rowIndex].split('|').slice(1, -1).map((cell) => cell.trim());
      break;
    }
    return { columns, row };
  }
  return null;
}

function tableFieldPresent(table, fieldName) {
  if (!table) return false;
  const index = table.columns.indexOf(fieldName.toLowerCase());
  return index >= 0 && Boolean(table.row && table.row[index] && !/^\{[^}]+\}$/.test(table.row[index]));
}

function requiredContentChecks(text, relPath, frontmatter, featureId) {
  const errors = [];
  const table = scenarioTableState(text);
  const checks = [
    ['REQUIRED_FEATURE_ID', Boolean(featureId), 'feature ID is missing'],
    ['REQUIRED_PROMPT', hasMarker(text, /(?:^|\n)\s*(?:[-*]\s*)?(?:realistic user prompt|operator prompt|orchestrator prompt|exact prompt|prompt)\s*:/im) || tableFieldPresent(table, 'exact prompt'), 'operator or orchestrator prompt is missing'],
    ['REQUIRED_COMMAND_SEQUENCE', hasMarker(text, /(?:^|\n)\s*#{2,4}\s+(?:exact )?command(?:s| sequence)\b/im) || tableFieldPresent(table, 'exact command sequence'), 'exact command sequence is missing'],
    ['REQUIRED_EXPECTED_SIGNALS', hasMarker(text, /(?:^|\n)\s*(?:[-*]\s*)?(?:expected signals|expected)\s*:/im) || hasMarker(text, /^#{2,4}\s+Expected(?: Signals)?\b/im) || tableFieldPresent(table, 'expected signals'), 'expected signals are missing'],
    ['REQUIRED_EVIDENCE', hasMarker(text, /(?:^|\n)\s*(?:[-*]\s*)?evidence(?: requirements)?\s*:/im) || hasMarker(text, /^#{2,4}\s+Evidence\b/im) || tableFieldPresent(table, 'evidence'), 'evidence requirements are missing'],
    ['REQUIRED_PASS_FAIL', hasMarker(text, /(?:pass\s*\/\s*fail|pass\/fail|pass\s+if|\*\*pass\*\*|\*\*fail\*\*)/i) || tableFieldPresent(table, 'pass/fail criteria'), 'pass/fail criteria are missing'],
    ['REQUIRED_FAILURE_TRIAGE', hasMarker(text, /(?:^|\n)\s*#{2,4}\s+Failure Triage\b/im) || hasMarker(text, /Failure Triage\s*:/i) || tableFieldPresent(table, 'failure triage'), 'failure triage is missing'],
    ['REQUIRED_ROOT_LINK', hasMarker(text, /(?:^|[(/` ])manual-testing-playbook\.md(?:[)#` ]|$)/i), 'root playbook link is missing'],
  ];
  for (const [code, present, message] of checks) if (!present) errors.push(issue(code, relPath, message));

  const requiresUserRequest = frontmatter?.fields.requires_realistic_user_request === 'true'
    || /clarifies user intent|realistic user request required|user-facing request required/i.test(text);
  if (requiresUserRequest && !/realistic user request\s*:/i.test(text)) {
    errors.push(issue('CONDITIONAL_REALISTIC_USER_REQUEST', relPath, 'this scenario declares that user intent must be clarified, but has no realistic user request'));
  }
  const hasScenarioTable = Boolean(table);
  if (hasScenarioTable && !tableFieldPresent(table, 'exact prompt')) {
    errors.push(issue('CONDITIONAL_TABLE_PROMPT', relPath, 'a scenario table is present but its exact prompt cell is empty'));
  }
  const catalogApplicable = frontmatter?.fields.catalog_applicable === 'true'
    || /catalog\s+(?:entry|link)\s+(?:applies|applicable|required)|feature-catalog\s+(?:entry|link)\s+(?:applies|applicable|required)/i.test(text);
  if (catalogApplicable && !/feature-catalog/i.test(text)) {
    errors.push(issue('CONDITIONAL_CATALOG_LINK', relPath, 'catalog applicability is declared but no feature-catalog link is present'));
  }
  return errors;
}

function verdictChecks(text, relPath) {
  const errors = [];
  for (const verdict of FORBIDDEN_VERDICTS) {
    const pattern = new RegExp(`\\b${verdict}\\b`);
    const match = pattern.exec(text);
    if (match) errors.push(issue('FORBIDDEN_VERDICT', relPath, `forbidden verdict vocabulary: ${verdict}`, 'error', lineNumberAt(text, match.index)));
  }
  if (/\bSKIP\b/.test(text) && !/(?:skip|blocker|sandbox|unavailable|missing|blocked by)[^\n]{0,180}(?:blocker|sandbox|unavailable|missing|environment|credential|remote)/i.test(text)) {
    errors.push(issue('SKIP_BLOCKER_MISSING', relPath, 'SKIP is present without a specific blocker'));
  }
  return errors;
}

function filenameChecks(absPath, playbookRoot, relPath) {
  const errors = [];
  const relative = path.relative(playbookRoot, absPath).split(path.sep);
  const fileName = relative.pop();
  const slug = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*\.md$/;
  if (!slug.test(fileName) || /^\d+-/.test(fileName)) errors.push(issue('FILENAME_NOT_KEBAB', relPath, 'per-feature filename must be a letter-led kebab-case slug with no numeric prefix'));
  for (const category of relative) {
    if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(category) || /^\d+-/.test(category)) {
      errors.push(issue('CATEGORY_NOT_KEBAB', relPath, `category directory is not a bare kebab-case slug: ${category}`));
    }
  }
  return errors;
}

function trimLinkTarget(raw) {
  return decodeURIComponent(raw.split('#', 1)[0].trim()).replace(/^<|>$/g, '').replace(/[),.;:]+$/, '');
}

function hasCaseMismatch(candidate, root) {
  let current = root;
  for (const segment of path.relative(root, candidate).split(path.sep).filter(Boolean)) {
    let entries;
    try { entries = fs.readdirSync(current); } catch { return false; }
    const actual = entries.find((entry) => entry.toLowerCase() === segment.toLowerCase());
    if (!actual) return false;
    if (actual !== segment) return true;
    current = path.join(current, actual);
  }
  return false;
}

function pathChecks(text, absPath, repoRoot, relPath) {
  const errors = [];
  const realRepoRoot = fs.realpathSync(repoRoot);
  const linkRe = /!?\[[^\]]*\]\(([^)]+)\)/g;
  let match;
  while ((match = linkRe.exec(text)) !== null) {
    const target = trimLinkTarget(match[1]);
    if (!target || target.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('//') || target.startsWith('/tmp/')) continue;
    const candidate = path.resolve(path.dirname(absPath), target);
    if (!isWithin(candidate, repoRoot)) {
      errors.push(issue('PATH_OUTSIDE_REPO', relPath, 'local link resolves outside the repository', 'error', lineNumberAt(text, match.index)));
      continue;
    }
    if (!fs.existsSync(candidate)) {
      errors.push(issue('PATH_MISSING', relPath, 'cited local link does not resolve', 'error', lineNumberAt(text, match.index)));
      continue;
    }
    const real = fs.realpathSync(candidate);
    if (!isWithin(real, realRepoRoot)) errors.push(issue('PATH_SYMLINK_OUTSIDE_REPO', relPath, 'cited local link resolves through a symlink outside the repository', 'error', lineNumberAt(text, match.index)));
    else {
      const realRelative = path.relative(realRepoRoot, real);
      const candidateRelative = path.relative(repoRoot, candidate);
      if (hasCaseMismatch(candidate, repoRoot)
        || (realRelative !== candidateRelative && realRelative.toLowerCase() === candidateRelative.toLowerCase())) {
        errors.push(issue('PATH_CASE_MISMATCH', relPath, 'cited local link differs from the on-disk path only by case', 'error', lineNumberAt(text, match.index)));
      }
    }
  }
  return errors;
}

function evergreenChecks(text, relPath) {
  const errors = [];
  const lines = text.split('\n');
  lines.forEach((line, index) => {
    if (/\/(?:Users|home)\/[^\s`)'"|]+/i.test(line) || /[A-Za-z]:\\Users\\/i.test(line)) {
      errors.push(issue('DEVELOPER_ABSOLUTE_PATH', relPath, 'developer-absolute path appears in scenario truth', 'error', index + 1));
    }
    if (/(?:run|transcript|execution|measured|observed|result|verdict|last validated|as of|timestamp)\b[^\n]{0,140}\b20\d{2}-\d{2}-\d{2}\b/i.test(line)
      || /"timestamp"\s*:\s*"20\d{2}-\d{2}-\d{2}/i.test(line)) {
      errors.push(issue('BAKED_RUN_TRANSCRIPT', relPath, 'dated run evidence appears in scenario truth', 'error', index + 1));
    }
  });
  return errors;
}

function placeholderChecks(text, relPath) {
  if (/placeholder remains|no execution contract|retired .* scenario|reserved only to keep/i.test(text)
    && !/^##\s+1\.\s+OVERVIEW/m.test(text)) {
    return [issue('PLACEHOLDER_SCENARIO', relPath, 'placeholder file has no executable scenario contract')];
  }
  return [];
}

function parseRootCensus(text) {
  const matches = [];
  const patterns = [
    /(\d+)\s+deterministic scenarios?\s+across\s+(\d+)\s+categor(?:y|ies)/i,
    /(\d+)[- ]scenario battery/i,
  ];
  for (const pattern of patterns) {
    const match = pattern.exec(text);
    if (match) matches.push({ scenarios: Number(match[1]), categories: match[2] ? Number(match[2]) : null, index: match.index });
  }
  return matches;
}

function relativeKey(filePath) {
  return path.normalize(filePath);
}

function extractRootIndexLinks(rootText, rootPath, playbookRoot, repoRoot) {
  const links = new Set();
  const problems = [];
  const linkRe = /\[[^\]]*\]\(([^)]+)\)/g;
  let match;
  while ((match = linkRe.exec(rootText)) !== null) {
    const target = trimLinkTarget(match[1]);
    if (!target || target.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('//')) continue;
    const candidate = path.resolve(path.dirname(rootPath), target);
    if (!isWithin(candidate, playbookRoot) || candidate === rootPath || path.basename(candidate).toLowerCase() === 'readme.md') continue;
    if (!fs.existsSync(candidate)) {
      problems.push(issue('INDEX_PHANTOM_FILE', ROOT_FILENAME, 'root index points to a missing per-feature file', 'error', lineNumberAt(rootText, match.index)));
      continue;
    }
    links.add(relativeKey(candidate));
  }
  return { links, problems };
}

function loadManifest(manifestPath, repoRoot) {
  if (!fs.existsSync(manifestPath)) throw new Error(`manifest not found: ${manifestPath}`);
  let manifest;
  try { manifest = JSON.parse(readText(manifestPath)); } catch (error) { throw new Error(`manifest is not valid JSON: ${error.message}`); }
  if (!Array.isArray(manifest.routingGoldRoots) || manifest.routingGoldRoots.length === 0) throw new Error('manifest routingGoldRoots must be a non-empty array');
  const roots = manifest.routingGoldRoots.map((entry) => {
    if (typeof entry !== 'string' || !entry || path.isAbsolute(entry) || entry.split('/').includes('..')) throw new Error(`manifest root is not repository-relative: ${entry}`);
    const resolved = path.resolve(repoRoot, entry);
    if (!isWithin(resolved, repoRoot)) throw new Error(`manifest root escapes repository: ${entry}`);
    if (!fs.existsSync(resolved) || !fs.statSync(resolved).isDirectory()) throw new Error(`manifest root does not exist: ${entry}`);
    return resolved;
  });
  return {
    version: manifest.version,
    defaultContract: manifest.defaultContract || CONTRACT,
    routingGoldRoots: [...new Set(roots)],
    warnPackages: Array.isArray(manifest.warnPackages) ? manifest.warnPackages : WARN_PACKAGE_IDS,
    sourcePath: manifestPath,
  };
}

function isRoutingGold(filePath, routingGoldRoots) {
  return routingGoldRoots.some((root) => isWithin(filePath, root));
}

function isRoutingGoldScenario(filePath, routingGoldRoots) {
  if (isRoutingGold(filePath, routingGoldRoots)) return true;
  return hasRoutingGoldSignature(extractFrontmatter(readText(filePath)));
}

function resolvePackageFilter(filter, skillsRoot) {
  if (!filter) return null;
  const direct = path.resolve(skillsRoot, filter, 'manual-testing-playbook');
  if (fs.existsSync(direct) && fs.statSync(direct).isDirectory()) return direct;
  const explicit = path.resolve(filter);
  if (fs.existsSync(explicit) && fs.statSync(explicit).isDirectory()) {
    if (path.basename(explicit) === 'manual-testing-playbook') return explicit;
    const nested = path.join(explicit, ROOT_FILENAME);
    if (fs.existsSync(nested)) return explicit;
  }
  throw new Error(`package does not resolve to a manual-testing-playbook root: ${filter}`);
}

function discoverPackages(skillsRoot) {
  return fs.readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(skillsRoot, entry.name, 'manual-testing-playbook', ROOT_FILENAME)))
    .map((entry) => ({ id: entry.name, playbookRoot: path.join(skillsRoot, entry.name, 'manual-testing-playbook') }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

function packageId(playbookRoot, skillsRoot) {
  const relative = path.relative(skillsRoot, playbookRoot);
  if (relative.endsWith(`${path.sep}manual-testing-playbook`)) return relative.slice(0, -`${path.sep}manual-testing-playbook`.length).split(path.sep).join('/');
  return path.basename(playbookRoot);
}

function validateScenario(absPath, playbookRoot, repoRoot) {
  const relPath = path.relative(playbookRoot, absPath).split(path.sep).join('/');
  let text;
  try { text = readText(absPath); } catch { return [issue('UNREADABLE_FILE', relPath, 'scenario file cannot be read')]; }
  const frontmatter = extractFrontmatter(text);
  const featureId = extractFeatureId(text, frontmatter);
  const errors = [];
  if (!frontmatter) errors.push(issue('FRONTMATTER_MISSING', relPath, 'scenario frontmatter is missing'));
  else {
    if (!frontmatter.fields.title) errors.push(issue('FRONTMATTER_TITLE_MISSING', relPath, 'frontmatter title is missing'));
    if (!frontmatter.fields.description) errors.push(issue('FRONTMATTER_DESCRIPTION_MISSING', relPath, 'frontmatter description is missing'));
    if (!/^\d+\.\d+\.\d+\.\d+$/.test(frontmatter.fields.version || '')) errors.push(issue('FRONTMATTER_VERSION_INVALID', relPath, 'frontmatter version must have four numeric parts'));
  }
  errors.push(...sectionChecks(text, relPath));
  errors.push(...requiredContentChecks(text, relPath, frontmatter, featureId));
  errors.push(...verdictChecks(text, relPath));
  errors.push(...filenameChecks(absPath, playbookRoot, relPath));
  errors.push(...pathChecks(text, absPath, repoRoot, relPath));
  errors.push(...evergreenChecks(text, relPath));
  errors.push(...placeholderChecks(text, relPath));
  return errors;
}

function validatePackage({ playbookRoot, repoRoot, skillsRoot, manifest }) {
  const rootPath = path.join(playbookRoot, ROOT_FILENAME);
  if (!fs.existsSync(playbookRoot) || !fs.statSync(playbookRoot).isDirectory()) throw new Error(`missing playbook root: ${playbookRoot}`);
  if (!fs.existsSync(rootPath)) throw new Error(`missing root playbook: ${rootPath}`);
  const allFiles = walkMarkdown(playbookRoot).filter((file) => path.basename(file).toLowerCase() !== 'readme.md');
  const scenarioFiles = allFiles.filter((file) => file !== rootPath);
  const routingFiles = scenarioFiles.filter((file) => isRoutingGoldScenario(file, manifest.routingGoldRoots));
  const operatorFiles = scenarioFiles.filter((file) => !isRoutingGoldScenario(file, manifest.routingGoldRoots));
  const categoryDirs = fs.readdirSync(playbookRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
  const rootText = readText(rootPath);
  const derivedCensus = {
    scenarioFiles: scenarioFiles.length,
    categoryDirs: categoryDirs.length,
    operatorScenarioFiles: operatorFiles.length,
    routingGoldFilesExcluded: routingFiles.length,
  };
  const warnings = [];
  warnings.push(...executionContractChecks(rootText, ROOT_FILENAME));
  const census = parseRootCensus(rootText);
  for (const statement of census) {
    warnings.push(issue('HAND_TYPED_CENSUS', ROOT_FILENAME, `root contains a hand-typed census (${statement.scenarios} scenarios${statement.categories === null ? '' : `, ${statement.categories} categories`}); derived census is ${derivedCensus.scenarioFiles} scenarios across ${derivedCensus.categoryDirs} categories`, 'warning'));
    if (statement.scenarios !== derivedCensus.scenarioFiles || (statement.categories !== null && statement.categories !== derivedCensus.categoryDirs)) {
      warnings.push(issue('CENSUS_MISMATCH', ROOT_FILENAME, 'hand-typed census disagrees with the walked tree', 'warning', lineNumberAt(rootText, statement.index)));
    }
  }
  const errors = [];
  const validationRoot = isWithin(playbookRoot, repoRoot) ? repoRoot : playbookRoot;
  const ids = new Map();
  for (const file of operatorFiles) {
    const fileErrors = validateScenario(file, playbookRoot, validationRoot);
    errors.push(...fileErrors);
    const text = readText(file);
    const id = extractFeatureId(text, extractFrontmatter(text));
    if (id) {
      if (!ids.has(id)) ids.set(id, []);
      ids.get(id).push(path.relative(playbookRoot, file).split(path.sep).join('/'));
    }
  }
  for (const [id, files] of ids) if (files.length > 1) errors.push(issue('DUPLICATE_FEATURE_ID', files.join(', '), `feature ID maps to multiple files: ${id}`));
  const index = extractRootIndexLinks(rootText, rootPath, playbookRoot, repoRoot);
  errors.push(...index.problems);
  const indexed = index.links;
  for (const file of operatorFiles) {
    if (!indexed.has(relativeKey(file))) errors.push(issue('INDEX_ORPHAN_FILE', path.relative(playbookRoot, file).split(path.sep).join('/'), 'per-feature file is not linked from the root index'));
  }
  const idMap = new Map();
  for (const file of operatorFiles) {
    const id = extractFeatureId(readText(file), extractFrontmatter(readText(file)));
    if (id) idMap.set(id, file);
  }
  const packageName = packageId(playbookRoot, skillsRoot);
  const hasOperatorFiles = operatorFiles.length > 0;
  const violationCount = errors.length;
  const warnTier = manifest.warnPackages.includes(packageName);
  const status = !hasOperatorFiles ? 'SKIP' : violationCount > 0 ? (warnTier ? 'WARN' : 'FAIL') : (warnTier && warnings.length ? 'WARN' : 'PASS');
  return {
    package: packageName,
    contract: CONTRACT,
    playbookRoot: path.relative(repoRoot, playbookRoot).split(path.sep).join('/'),
    status,
    tier: warnTier ? 'WARN' : 'FAIL_CLOSED',
    derivedCensus,
    indexedFiles: indexed.size,
    featureIds: idMap.size,
    violations: errors,
    warnings,
  };
}

function runValidation(options = {}) {
  const defaults = defaultPaths();
  const repoRoot = path.resolve(options.repoRoot || defaults.repoRoot);
  const skillsRoot = path.resolve(options.skillsRoot || defaults.skillsRoot);
  const manifestPath = path.resolve(options.manifest || defaults.manifest);
  if (!fs.existsSync(repoRoot) || !fs.existsSync(skillsRoot)) throw new Error('repository or skills root does not exist');
  const manifest = loadManifest(manifestPath, repoRoot);
  const selected = resolvePackageFilter(options.packageFilter || null, skillsRoot);
  const packages = selected
    ? [{ id: packageId(selected, skillsRoot), playbookRoot: selected }]
    : discoverPackages(skillsRoot);
  if (packages.length === 0) throw new Error('no direct skill packages with manual-testing-playbook roots were found');
  const reports = packages.map((pkg) => validatePackage({ playbookRoot: pkg.playbookRoot, repoRoot, skillsRoot, manifest }));
  const strict = options.strict !== false;
  const hasFailClosedViolation = reports.some((report) => report.status === 'FAIL');
  const hasWarnedViolations = reports.some((report) => report.status === 'WARN' && report.violations.length > 0);
  return {
    contract: CONTRACT,
    routingGoldContract: 'routing-gold',
    manifest: path.relative(repoRoot, manifestPath).split(path.sep).join('/'),
    strict,
    warnPackages: manifest.warnPackages,
    packages: reports,
    exitCode: strict && hasFailClosedViolation ? EXIT_VIOLATIONS : EXIT_OK,
    warnedViolationCount: hasWarnedViolations
      ? reports.filter((report) => report.status === 'WARN').reduce((sum, report) => sum + report.violations.length, 0)
      : 0,
  };
}

function formatText(report) {
  const lines = [
    `contract=${report.contract} routing_gold_contract=${report.routingGoldContract} strict=${report.strict ? 'on' : 'off'}`,
    `manifest=${report.manifest}`,
    `warn_packages=${report.warnPackages.join(',')}`,
  ];
  for (const pkg of report.packages) {
    const c = pkg.derivedCensus;
    lines.push(`${pkg.status} package=${pkg.package} tier=${pkg.tier} scenarios=${c.scenarioFiles} categories=${c.categoryDirs} operator=${c.operatorScenarioFiles} routing_gold_excluded=${c.routingGoldFilesExcluded} violations=${pkg.violations.length} warnings=${pkg.warnings.length}`);
    for (const problem of pkg.violations) lines.push(`  ${problem.code} ${problem.file}${problem.line ? `:${problem.line}` : ''} ${problem.message}`);
    for (const warning of pkg.warnings) lines.push(`  WARN ${warning.code} ${warning.file}${warning.line ? `:${warning.line}` : ''} ${warning.message}`);
  }
  lines.push(`exit=${report.exitCode}`);
  return lines.join('\n');
}

module.exports = {
  EXIT_OK,
  EXIT_VIOLATIONS,
  EXIT_USAGE,
  CONTRACT,
  RESULT_PERSISTENCE_MARKER,
  REQUIRED_OUTCOME_VOCABULARY,
  WARN_PACKAGE_IDS,
  REQUIRED_SECTIONS,
  parseArgs,
  extractFrontmatter,
  hasRoutingGoldSignature,
  executionContractChecks,
  extractFeatureId,
  walkMarkdown,
  loadManifest,
  validateScenario,
  isRoutingGoldScenario,
  validatePackage,
  runValidation,
  formatText,
};

if (require.main === module) {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
      process.stdout.write(`${usage()}\n`);
      process.exit(EXIT_OK);
    }
    const report = runValidation({
      packageFilter: args.packageFilter,
      repoRoot: args.repoRoot,
      skillsRoot: args.skillsRoot,
      manifest: args.manifest,
      strict: args.strict,
    });
    process.stdout.write(args.format === 'json' ? `${JSON.stringify(report, null, 2)}\n` : `${formatText(report)}\n`);
    process.exit(args.strict ? report.exitCode : EXIT_OK);
  } catch (error) {
    process.stderr.write(`validate-playbook-package: ${error.message}\n`);
    process.exit(EXIT_USAGE);
  }
}
