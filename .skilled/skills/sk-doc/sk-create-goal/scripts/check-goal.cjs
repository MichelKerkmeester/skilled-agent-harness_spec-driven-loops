// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ check-goal — read-only packet goal conformance checker                  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

const {
  extractDurableSlice,
  resolveGoalBudget,
  splitFrontmatter,
  LOG_ANCHOR
} = require(path.resolve(__dirname, '../../../../../.skilled/hooks/goal/lib/goal-slice.cjs'));

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const TAG = '[check-goal]';
const GOAL_FILE = 'goal.md';
const PHASE_SPEC_FILE = 'spec.md';
// Archived goals are historical evidence and stay out of active scan totals.
const ARCHIVE_DIR = 'z_archive';
const TICK = String.fromCharCode(96);
const PLACEHOLDERS = {
  objective: '[One sentence. What this packet is for. Not how, not progress.]',
  decision: '[The decision, stated so a reader can tell whether work honors it]',
  criteria: [
    '[A check whose answer is an exit code, a count, or a named artifact]',
    '[Another]'
  ]
};
const CHECKS = [
  { name: 'missing-binding-row', run: evaluateMissingBindingRows },
  { name: 'placeholder', run: evaluatePlaceholders },
  { name: 'criteria-count', run: evaluateCriteriaCount },
  { name: 'parent-budget', run: evaluateParentBudget }
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function getDefaultWorkspaceRoot() {
  return path.resolve(__dirname, '../../../../../');
}

function pathIsFile(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (error) {
    if (error && (error.code === 'ENOENT' || error.code === 'ENOTDIR')) return false;
    throw error;
  }
}

function listDirectPhaseChildren(packetDir) {
  return fs.readdirSync(packetDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => pathIsFile(path.join(packetDir, name, PHASE_SPEC_FILE)))
    .sort();
}

function isPhaseChildFolder(packetDir) {
  return pathIsFile(path.join(path.dirname(packetDir), PHASE_SPEC_FILE));
}

function getPacketLabel(packetDir, workspaceRoot) {
  const relativePath = path.relative(workspaceRoot, packetDir);
  return relativePath && !relativePath.startsWith('..') && !path.isAbsolute(relativePath)
    ? relativePath
    : packetDir;
}

function loadPacketContext(packetDir, options = {}) {
  const absolutePacketDir = path.resolve(packetDir);
  const packetStat = fs.statSync(absolutePacketDir);
  if (!packetStat.isDirectory()) {
    throw new Error('packet path is not a directory');
  }

  const goalPath = path.join(absolutePacketDir, GOAL_FILE);
  const content = fs.readFileSync(goalPath, 'utf8');
  const frontmatter = splitFrontmatter(content);
  if (frontmatter.broken) {
    throw new Error('goal frontmatter opener has no closing fence');
  }

  const durableSlice = extractDurableSlice(content);
  const logOffset = frontmatter.body.indexOf(LOG_ANCHOR);
  if (logOffset >= 0 && frontmatter.body.slice(0, logOffset) !== durableSlice) {
    throw new Error('shared durable-slice boundary did not match the log anchor');
  }

  const workspaceRoot = path.resolve(options.workspaceRoot || getDefaultWorkspaceRoot());
  const phaseChildren = options.phaseChildren || listDirectPhaseChildren(absolutePacketDir);
  const budget = options.budget === undefined
    ? resolveGoalBudget(workspaceRoot)
    : options.budget;

  return {
    packetDir: absolutePacketDir,
    packetLabel: getPacketLabel(absolutePacketDir, workspaceRoot),
    goalPath,
    content,
    durableSlice,
    phaseChildren,
    isPhaseChild: isPhaseChildFolder(absolutePacketDir),
    budget,
    workspaceRoot
  };
}

function createFinding(check, code, detail, context) {
  return {
    check,
    code,
    packet: context.packetLabel,
    detail
  };
}

function getAnchorBody(content, anchorName) {
  const open = '<!-- ANCHOR:' + anchorName + ' -->';
  const close = '<!-- /ANCHOR:' + anchorName + ' -->';
  const openIndex = content.indexOf(open);
  const closeIndex = content.indexOf(close);
  if (openIndex < 0 || closeIndex < 0 || closeIndex < openIndex) return null;
  if (content.indexOf(open, openIndex + open.length) >= 0) return null;
  if (content.indexOf(close, closeIndex + close.length) >= 0) return null;
  return content.slice(openIndex + open.length, closeIndex);
}

function getSecondTableCell(line) {
  const match = line.match(/^\|\s*[^|]*\|([^|]*)\|/u);
  return match ? match[1].trim() : null;
}

function extractBindingTarget(cell) {
  const value = cell.trim();
  const link = value.match(/^\[[^\]]*\]\(([^)]+)\)$/u);
  if (link) return link[1].trim();

  const code = value.match(new RegExp('^' + TICK + '([^' + TICK + ']+)' + TICK + '$', 'u'));
  if (code) return code[1].trim();

  return /^[^/\\\s]+\/goal\.md$/u.test(value) ? value : null;
}

function getGoalSections(durableSlice) {
  const lines = durableSlice.split(/\r\n|\r|\n/u);
  const headingSection = (pattern) => {
    const start = lines.findIndex((line) => pattern.test(line));
    if (start < 0) return [];
    const heading = lines[start].match(/^(#{1,6})\s+/u);
    const depth = heading ? heading[1].length : 6;
    const section = [];

    for (let index = start + 1; index < lines.length; index += 1) {
      const nextHeading = lines[index].match(/^(#{1,6})\s+/u);
      if (nextHeading && nextHeading[1].length <= depth) break;
      section.push(lines[index]);
    }
    return section;
  };

  const objectiveIndex = lines.findIndex((line) => line.includes('**Objective:**'));
  let objective = '';
  if (objectiveIndex >= 0) {
    const firstLine = lines[objectiveIndex].replace(/^.*?\*\*Objective:\*\*/u, '');
    const objectiveLines = [firstLine];
    for (let index = objectiveIndex + 1; index < lines.length; index += 1) {
      if (lines[index].trim() === '' || /^#{1,6}\s+/u.test(lines[index])) break;
      objectiveLines.push(lines[index]);
    }
    objective = objectiveLines.join('\n');
  }

  // A directive can carry its own "Completion criteria" heading ahead of the
  // template section, so the completion anchor wins whenever the goal has one.
  const completionBody = getAnchorBody(durableSlice, 'completion');
  return {
    objective,
    decisions: headingSection(/^#{2,6}\s+(?:\d+(?:\.\d+)*\.\s*)?Decisions\b/iu),
    criteria: completionBody === null
      ? headingSection(/^#{1,6}\s+(?:\d+(?:\.\d+)*\.\s*)?Completion Criteria\b/iu)
      : completionBody.split(/\r\n|\r|\n/u)
  };
}

function isTableDivider(cell) {
  return /^:?-{3,}:?$/u.test(cell.replace(/\s+/gu, ''));
}

function getCriterionItems(lines) {
  return lines
    .map((line) => line.match(/^[-*+]\s+(?:\[[ xX]\]\s*)?(.*)$/u))
    .filter(Boolean)
    .map((match) => match[1]);
}

function makeCheckResult(name, findings = [], errors = []) {
  return {
    name,
    findings,
    errors,
    passed: findings.length === 0 && errors.length === 0
  };
}

function runOneCheck(name, run, packetDir, options = {}) {
  try {
    const context = loadPacketContext(packetDir, options);
    return makeCheckResult(name, run(context));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return makeCheckResult(name, [], [{
      packet: path.resolve(packetDir),
      message
    }]);
  }
}

function evaluateMissingBindingRows(context) {
  if (context.phaseChildren.length === 0) return [];
  const bindingBody = getAnchorBody(context.durableSlice, 'binding');
  const coveredChildren = new Set();

  if (bindingBody !== null) {
    for (const line of bindingBody.split(/\r\n|\r|\n/u)) {
      const cell = getSecondTableCell(line);
      if (!cell || isTableDivider(cell)) continue;
      const target = extractBindingTarget(cell);
      if (!target) continue;
      const match = target.match(/^([^/]+)\/goal\.md$/u);
      if (match) coveredChildren.add(match[1]);
    }
  }

  return context.phaseChildren
    .filter((child) => !coveredChildren.has(child))
    .map((child) => createFinding(
      'missing-binding-row',
      'missing-binding-row',
      bindingBody === null
        ? 'binding anchor is missing or malformed for ' + child + '/goal.md'
        : 'no binding-table target row for ' + child + '/goal.md',
      context
    ));
}

function evaluatePlaceholders(context) {
  const sections = getGoalSections(context.durableSlice);
  const findings = [];
  if (sections.objective.includes(PLACEHOLDERS.objective)) {
    findings.push(createFinding(
      'placeholder',
      'template-placeholder',
      'objective contains unfilled template text',
      context
    ));
  }

  for (const line of sections.decisions) {
    const cell = getSecondTableCell(line);
    if (cell && !isTableDivider(cell) && cell.includes(PLACEHOLDERS.decision)) {
      findings.push(createFinding(
        'placeholder',
        'template-placeholder',
        'decision table contains unfilled template text',
        context
      ));
    }
  }

  const criterionItems = getCriterionItems(sections.criteria);
  for (const criterion of criterionItems) {
    if (PLACEHOLDERS.criteria.some((placeholder) => criterion.includes(placeholder))) {
      findings.push(createFinding(
        'placeholder',
        'template-placeholder',
        'completion criterion contains unfilled template text',
        context
      ));
    }
  }
  return findings;
}

function evaluateCriteriaCount(context) {
  const sections = getGoalSections(context.durableSlice);
  const criteria = getCriterionItems(sections.criteria);
  if (criteria.length >= 3 && criteria.length <= 7) return [];
  return [createFinding(
    'criteria-count',
    'criteria-count',
    'completion criteria count is ' + criteria.length + '; expected 3 through 7',
    context
  )];
}

function evaluateParentBudget(context) {
  if (context.isPhaseChild) return [];
  if (!context.budget || !Number.isInteger(context.budget.errorChars)) {
    return [createFinding(
      'parent-budget',
      'parent-budget',
      'configured durable-slice budget could not be resolved',
      context
    )];
  }

  const durableChars = context.durableSlice.length;
  if (durableChars <= context.budget.errorChars) return [];
  return [createFinding(
    'parent-budget',
    'parent-budget',
    'durable slice is ' + durableChars + ' characters, over the '
      + context.budget.errorChars + '-character limit',
    context
  )];
}

function evaluateChecks(context) {
  return CHECKS.map(({ name, run }) => {
    try {
      return makeCheckResult(name, run(context));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return makeCheckResult(name, [], [{
        packet: context.packetLabel,
        message
      }]);
    }
  });
}

function createPacketResult(context) {
  const checks = evaluateChecks(context);
  const errors = checks.flatMap((check) => check.errors);
  return {
    packet: context.packetDir,
    packetLabel: context.packetLabel,
    phaseChildCount: context.phaseChildren.length,
    isPhaseChild: context.isPhaseChild,
    checks,
    errors,
    contextError: false,
    passed: errors.length === 0 && checks.every((check) => check.findings.length === 0)
  };
}

function displayCheckResults(result) {
  let passed = 0;
  result.checks.forEach((check, index) => {
    const isPassing = !result.contextError
      && check.findings.length === 0
      && check.errors.length === 0;
    if (isPassing) passed += 1;
    const verdict = result.contextError ? 'SKIP' : isPassing ? 'PASS' : 'FAIL';
    console.log(
      TAG + ' ' + (index + 1) + '/' + result.checks.length + ' ' + verdict + ' '
      + check.name + ' findings=' + check.findings.length
    );
    for (const finding of check.findings) {
      console.log(TAG + ' FINDING ' + finding.check + ' ' + finding.packet + ': ' + finding.detail);
    }
  });

  for (const error of result.errors) {
    console.error(TAG + ' ERROR ' + error.packet + ': ' + error.message);
  }

  const status = result.passed ? 'PASSED' : 'FAILED';
  const suffix = result.errors.length > 0 ? '; errors=' + result.errors.length : '';
  console.log(
    TAG + ' RESULT: ' + status + ' (' + passed + '/' + result.checks.length
    + ' checks' + suffix + ')'
  );
}
function walkGoalFiles(specsDir, errors) {
  const goalFiles = [];
  const visit = (directory) => {
    let entries;
    try {
      entries = fs.readdirSync(directory, { withFileTypes: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push({ path: directory, message });
      return;
    }

    for (const entry of entries) {
      const absolutePath = path.join(directory, entry.name);
      if (entry.isFile() && entry.name === GOAL_FILE) {
        goalFiles.push(absolutePath);
      } else if (entry.isDirectory() && entry.name !== ARCHIVE_DIR) {
        visit(absolutePath);
      }
    }
  };

  visit(specsDir);
  return goalFiles.sort();
}

function scanWorkspace(workspaceRoot) {
  const root = path.resolve(workspaceRoot);
  const specsDir = path.join(root, 'specs');
  const errors = [];
  const goalFiles = [];

  if (!pathIsFile(specsDir) && !fs.existsSync(specsDir)) {
    try {
      fs.statSync(specsDir);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push({ path: specsDir, message });
    }
  }
  if (errors.length === 0) {
    try {
      if (!fs.statSync(specsDir).isDirectory()) {
        errors.push({ path: specsDir, message: 'active specs path is not a directory' });
      } else {
        goalFiles.push(...walkGoalFiles(specsDir, errors));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push({ path: specsDir, message });
    }
  }

  const budget = resolveGoalBudget(root);
  const findings = [];
  let phaseParentsScanned = 0;

  for (const goalPath of goalFiles) {
    const packetDir = path.dirname(goalPath);
    let phaseChildren = [];
    try {
      phaseChildren = listDirectPhaseChildren(packetDir);
      if (phaseChildren.length > 0) phaseParentsScanned += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push({ path: packetDir, message });
      continue;
    }

    try {
      const context = loadPacketContext(packetDir, {
        workspaceRoot: root,
        budget,
        phaseChildren
      });
      const result = createPacketResult(context);
      findings.push(...result.checks.flatMap((check) => check.findings));
      errors.push(...result.errors.map((error) => ({
        path: error.packet,
        message: error.message
      })));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push({ path: goalPath, message });
    }
  }

  const counts = Object.fromEntries(CHECKS.map((check) => [check.name, 0]));
  for (const finding of findings) counts[finding.check] += 1;

  return {
    workspaceRoot: root,
    goalsScanned: goalFiles.length,
    phaseParentsScanned,
    counts,
    findings,
    errors
  };
}

function printCorpusReport(report) {
  console.log('goals_scanned=' + report.goalsScanned);
  console.log('phase_parents_scanned=' + report.phaseParentsScanned);
  for (const check of CHECKS) {
    console.log(check.name + '_findings=' + report.counts[check.name]);
  }
  if (report.goalsScanned === 0) console.log('no_input=true');
  for (const finding of report.findings) {
    console.log(
      TAG + ' FINDING ' + finding.check + ' ' + finding.packet + ': ' + finding.detail
    );
  }
  for (const error of report.errors) {
    console.error(TAG + ' ERROR ' + error.path + ': ' + error.message);
  }
}

function parseArguments(argv) {
  const options = {
    workspaceRoot: null,
    scanAll: false,
    packetArg: null
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--all') {
      options.scanAll = true;
    } else if (argument === '--root') {
      const value = argv[index + 1];
      if (!value) throw new Error('--root requires a path');
      options.workspaceRoot = path.resolve(value);
      index += 1;
    } else if (argument.startsWith('-')) {
      throw new Error('unknown option: ' + argument);
    } else if (options.packetArg === null) {
      options.packetArg = argument;
    } else {
      throw new Error('only one packet directory may be checked at a time');
    }
  }

  if (options.scanAll && options.packetArg !== null) {
    throw new Error('--all cannot be combined with a packet directory');
  }
  return options;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check the parent binding table against its direct phase-child directories.
 *
 * @param {string} packetDir - Packet directory containing goal.md.
 * @param {Object} [options] - Optional workspace context.
 * @param {string} [options.workspaceRoot] - Repository root for budget lookup.
 * @param {{errorChars: number} | null} [options.budget] - Pre-resolved budget.
 * @returns {Object} Check name, findings, read errors and pass state.
 */
function checkMissingBindingRows(packetDir, options = {}) {
  return runOneCheck('missing-binding-row', evaluateMissingBindingRows, packetDir, options);
}

/**
 * Find unfilled template text in the objective, decision table and criteria.
 *
 * @param {string} packetDir - Packet directory containing goal.md.
 * @param {Object} [options] - Optional workspace context.
 * @param {string} [options.workspaceRoot] - Repository root for budget lookup.
 * @param {{errorChars: number} | null} [options.budget] - Pre-resolved budget.
 * @returns {Object} Check name, findings, read errors and pass state.
 */
function checkPlaceholders(packetDir, options = {}) {
  return runOneCheck('placeholder', evaluatePlaceholders, packetDir, options);
}

/**
 * Count top-level completion-criteria bullets against the template range.
 *
 * @param {string} packetDir - Packet directory containing goal.md.
 * @param {Object} [options] - Optional workspace context.
 * @param {string} [options.workspaceRoot] - Repository root for budget lookup.
 * @param {{errorChars: number} | null} [options.budget] - Pre-resolved budget.
 * @returns {Object} Check name, findings, read errors and pass state.
 */
function checkCriteriaCount(packetDir, options = {}) {
  return runOneCheck('criteria-count', evaluateCriteriaCount, packetDir, options);
}

/**
 * Measure a non-child goal with the shared durable-slice budget.
 *
 * @param {string} packetDir - Packet directory containing goal.md.
 * @param {Object} [options] - Optional workspace context.
 * @param {string} [options.workspaceRoot] - Repository root for budget lookup.
 * @param {{errorChars: number} | null} [options.budget] - Pre-resolved budget.
 * @returns {Object} Check name, findings, read errors and pass state.
 */
function checkParentBudget(packetDir, options = {}) {
  return runOneCheck('parent-budget', evaluateParentBudget, packetDir, options);
}

/**
 * Check one packet goal and return each named conformance result.
 *
 * @param {string} packetDir - Packet directory containing goal.md.
 * @param {Object} [options] - Optional workspace context.
 * @param {string} [options.workspaceRoot] - Repository root for budget lookup.
 * @param {{errorChars: number} | null} [options.budget] - Pre-resolved budget.
 * @returns {Object} Packet metadata, check results and error state.
 */
function checkGoalPacket(packetDir, options = {}) {
  try {
    return createPacketResult(loadPacketContext(packetDir, options));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const errors = [{ packet: path.resolve(packetDir), message }];
    return {
      packet: path.resolve(packetDir),
      packetLabel: path.resolve(packetDir),
      phaseChildCount: 0,
      isPhaseChild: false,
      checks: CHECKS.map((check) => makeCheckResult(check.name)),
      errors,
      contextError: true,
      passed: false
    };
  }
}

/**
 * Scan active specs goals without changing any input file.
 *
 * @param {string} [workspaceRoot] - Repository root containing specs.
 * @returns {Object} Scan counts, findings and read errors.
 */
function scanCorpus(workspaceRoot = getDefaultWorkspaceRoot()) {
  return scanWorkspace(workspaceRoot);
}

function main(argv) {
  const options = parseArguments(argv);
  const workspaceRoot = options.workspaceRoot || getDefaultWorkspaceRoot();

  if (options.scanAll || options.packetArg === null) {
    const report = scanCorpus(workspaceRoot);
    printCorpusReport(report);
    return report.errors.length === 0 ? 0 : 2;
  }

  const packetDir = path.resolve(workspaceRoot, options.packetArg);
  const result = checkGoalPacket(packetDir, { workspaceRoot });
  console.log(TAG + ' packet=' + result.packetLabel);
  displayCheckResults(result);
  if (result.errors.length > 0) return 2;
  return result.passed ? 0 : 1;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  CHECKS: CHECKS.map(({ name }) => name),
  checkMissingBindingRows,
  checkPlaceholders,
  checkCriteriaCount,
  checkParentBudget,
  checkGoalPacket,
  scanCorpus
};

if (require.main === module) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(TAG + ' ERROR ' + message);
    process.exitCode = 2;
  }
}
