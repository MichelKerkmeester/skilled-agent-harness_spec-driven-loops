// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ goal-fixtures — isolated packet goal conformance fixtures               ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const TICK = String.fromCharCode(96);
const CHILDREN = ['001-contract', '002-result', '003-handoff'];
const VALID_CRITERIA = [
  'The report includes the packet result.',
  'Each phase has one goal target in the parent table.',
  'The author can check each result from the report.'
];
const OBJECTIVE_PLACEHOLDER =
  '[One sentence. What this packet is for. Not how, not progress.]';
const DECISION_PLACEHOLDER =
  '[The decision, stated so a reader can tell whether work honors it]';
const CRITERION_PLACEHOLDER =
  '[A check whose answer is an exit code, a count, or a named artifact]';

// ─────────────────────────────────────────────────────────────────────────────
// 3. FIXTURE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function defaultBindingRows(children) {
  return children.map((child, index) => {
    let target = child + '/goal.md';
    if (index === 0) target = TICK + target + TICK;
    if (index === 1) target = '[Read child goal](' + target + ')';
    return '| ' + child + ' | ' + target + ' | Read before phase work. |';
  });
}

function buildGoal(options = {}) {
  const children = options.children === undefined ? CHILDREN : options.children;
  const bindingRows = options.bindingRows === undefined
    ? defaultBindingRows(children)
    : options.bindingRows;
  const criteria = options.criteria === undefined ? VALID_CRITERIA : options.criteria;
  const objective = options.objective === undefined
    ? 'Make each packet goal complete, bounded and ready for a clear handoff.'
    : options.objective;
  const decision = options.decision === undefined
    ? 'Keep each completion result observable in the packet.'
    : options.decision;
  const directiveCriteria = options.directiveCriteria || [];
  const completionOpen = options.completionAnchor ? ['<!-- ANCHOR:completion -->'] : [];
  const completionClose = options.completionAnchor ? ['<!-- /ANCHOR:completion -->'] : [];

  const lines = [
    '---',
    'title: Fixture Goal',
    '---',
    '# Goal: Fixture',
    '',
    '## 1. DURABLE DIRECTIVE',
    '',
    '**Objective:** ' + objective,
    '',
    '### Decisions',
    '',
    'Frozen choices. Changing one is an amendment.',
    '',
    '| ID | Decision |',
    '|----|----------|',
    '| D1 | ' + decision + ' |',
    '',
    ...(directiveCriteria.length === 0 ? [] : [
      '### Completion criteria',
      '',
      ...directiveCriteria.map((criterion, index) => (index + 1) + '. ' + criterion),
      ''
    ]),
    '<!-- ANCHOR:binding -->',
    '## 2. BINDING',
    '',
    '| Phase | Goal document | Purpose |',
    '|-------|---------------|---------|',
    ...bindingRows,
    '<!-- /ANCHOR:binding -->',
    '',
    ...completionOpen,
    '## 3. COMPLETION CRITERIA',
    '',
    'Three checkable results.',
    '',
    ...criteria.map((criterion) => '- [ ] ' + criterion),
    ...completionClose,
    '',
    '<!-- ANCHOR:log -->',
    '## 4. LOG'
  ];
  return lines.join('\n') + '\n';
}

function writePacket(parentDir, name, options = {}) {
  const packetDir = path.join(parentDir, name);
  fs.mkdirSync(packetDir, { recursive: true });

  const children = options.children === undefined ? CHILDREN : options.children;
  for (const child of children) {
    const childDir = path.join(packetDir, child);
    fs.mkdirSync(childDir, { recursive: true });
    fs.writeFileSync(path.join(childDir, 'spec.md'), '# Fixture phase\n', 'utf8');
    fs.writeFileSync(path.join(childDir, 'goal.md'), '# Goal: Fixture phase\n', 'utf8');
  }

  fs.writeFileSync(path.join(packetDir, 'goal.md'), buildGoal(options), 'utf8');
  return packetDir;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create the passing packets and six isolated negative packet fixtures.
 *
 * @param {string} fixtureRoot - Temporary directory owned by the caller.
 * @returns {{positive: string, directiveCriteria: string, negatives: Object<string, string>}} Fixture paths by name.
 */
function createGoalFixtures(fixtureRoot) {
  fs.mkdirSync(fixtureRoot, { recursive: true });

  const positive = writePacket(fixtureRoot, 'positive');
  // Numbered directive criteria sit ahead of the anchored bullets, as in real goals.
  const directiveCriteria = writePacket(fixtureRoot, 'directive-criteria', {
    completionAnchor: true,
    directiveCriteria: VALID_CRITERIA
  });

  const negatives = {
    'binding-row-removed-but-identifier-mentioned': writePacket(
      fixtureRoot,
      'binding-row-removed-but-identifier-mentioned',
      {
        children: [CHILDREN[0]],
        bindingRows: [],
        criteria: [
          'The report includes the packet result.',
          'The 001-contract child remains named in this criterion.',
          'Each result can be checked from the report.'
        ]
      }
    ),
    'objective-placeholder': writePacket(
      fixtureRoot,
      'objective-placeholder',
      { objective: OBJECTIVE_PLACEHOLDER }
    ),
    'decision-placeholder': writePacket(
      fixtureRoot,
      'decision-placeholder',
      { decision: DECISION_PLACEHOLDER }
    ),
    'criterion-placeholder': writePacket(
      fixtureRoot,
      'criterion-placeholder',
      {
        criteria: [
          CRITERION_PLACEHOLDER,
          VALID_CRITERIA[1],
          VALID_CRITERIA[2]
        ]
      }
    ),
    'criteria-count-out-of-range': writePacket(
      fixtureRoot,
      'criteria-count-out-of-range',
      { criteria: VALID_CRITERIA.slice(0, 2) }
    ),
    'over-budget-parent': writePacket(
      fixtureRoot,
      'over-budget-parent',
      { objective: 'A'.repeat(4200) }
    )
  };

  return { positive, directiveCriteria, negatives };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  createGoalFixtures
};
