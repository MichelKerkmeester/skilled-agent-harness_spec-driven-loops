'use strict';

const path = require('path');
const fs = require('fs');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const validator = require(path.join(DIST_DIR, 'memory', 'validate-memory-quality.js'));
const contamination = require(path.join(DIST_DIR, 'extractors', 'contamination-filter.js'));
const decisionExtractor = require(path.join(DIST_DIR, 'extractors', 'decision-extractor.js'));
const qualityScorer = require(path.join(DIST_DIR, 'extractors', 'quality-scorer.js'));

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function runValidatorRuleTests() {
  const validContent = `\
\`\`\`yaml
spec_folder: "003-system-spec-kit/136-mcp-working-memory-hybrid-rag"
tool_count: 9
trigger_phrases:
  - "memory"
  - "quality"
\`\`\`

# Title

Decision: adopt deterministic scoring.
`;

  const valid = validator.validateMemoryQualityContent(validContent);
  assert(valid.valid === true, 'V-all should pass on valid fixture');

  const v1 = validator.validateMemoryQualityContent(validContent.replace('Decision: adopt deterministic scoring.', 'decisions: [TBD]'));
  assert(v1.failedRules.includes('V1'), 'V1 should fail when [TBD] leaks');

  const v2 = validator.validateMemoryQualityContent(validContent.replace('tool_count: 9', 'tool_count: 9\nblockers: [N/A]'));
  assert(v2.failedRules.includes('V2'), 'V2 should fail when [N/A] leaks with tools');

  const v3 = validator.validateMemoryQualityContent(validContent.replace('spec_folder: "003-system-spec-kit/136-mcp-working-memory-hybrid-rag"', 'spec_folder: "**bad**"'));
  assert(v3.failedRules.includes('V3'), 'V3 should fail malformed spec_folder');

  const v4 = validator.validateMemoryQualityContent(validContent + '\nNo specific decisions were made during this session.\n');
  assert(v4.failedRules.includes('V4'), 'V4 should fail fallback sentence');

  const v5 = validator.validateMemoryQualityContent(validContent.replace('  - "memory"\n  - "quality"', '  []'));
  assert(v5.failedRules.includes('V5'), 'V5 should fail empty trigger_phrases with >=5 tools');
}

function runContaminationTests() {
  const filtered1 = contamination.filterContamination("I'll execute this step by step and then proceed.");
  assert(filtered1.hadContamination === true, 'contamination positive #1 should detect');

  const filtered2 = contamination.filterContamination('Let me analyze the failure and report back.');
  assert(filtered2.hadContamination === true, 'contamination positive #2 should detect');

  const clean1 = contamination.filterContamination('Decision: adopt typed validator module.');
  assert(clean1.hadContamination === false, 'contamination negative #1 should pass');

  const clean2 = contamination.filterContamination('I needled this case in a test title.');
  assert(clean2.hadContamination === false, 'contamination negative #2 should pass');

  const empty = contamination.filterContamination('');
  assert(empty.cleanedText === '', 'contamination empty input should return empty text');
}

async function runDecisionCueTests() {
  const result = await decisionExtractor.extractDecisions({
    SPEC_FOLDER: '003-system-spec-kit/136-mcp-working-memory-hybrid-rag',
    observations: [
      { narrative: 'We decided to keep strict validation in post-render stage.' },
      { narrative: 'Selected a fallback strategy for sparse trigger phrases.' },
      { narrative: 'This is just an implementation detail without choice wording.' },
    ],
    userPrompts: [
      { prompt: 'We will use lexical cues for decision extraction.' },
      { prompt: 'Prefer deterministic quality score calculations.' },
    ],
  });

  assert(result.DECISION_COUNT >= 4, 'decision lexical cues should produce concrete decisions');

  const noDecision = await decisionExtractor.extractDecisions({
    SPEC_FOLDER: '003-system-spec-kit/136-mcp-working-memory-hybrid-rag',
    observations: [{ narrative: 'Updated tests and cleaned output format.' }],
    userPrompts: [{ prompt: 'Run validation and collect logs.' }],
  });

  assert(noDecision.DECISION_COUNT === 0, 'no lexical cues should keep decision count at 0');
}

function runQualityScorerTests() {
  const allBad = qualityScorer.scoreMemoryQuality({
    content: 'x',
    validatorSignals: [
      { ruleId: 'V1', passed: false },
      { ruleId: 'V2', passed: false },
      { ruleId: 'V3', passed: false },
      { ruleId: 'V4', passed: false },
      { ruleId: 'V5', passed: false },
    ],
    hadContamination: true,
    messageCount: 0,
    toolCount: 0,
    decisionCount: 0,
  });
  assert(allBad.qualityScore === 0, 'all bad case should clamp to 0.0');

  const allGood = qualityScorer.scoreMemoryQuality({
    content: '# good',
    validatorSignals: [
      { ruleId: 'V1', passed: true },
      { ruleId: 'V2', passed: true },
      { ruleId: 'V3', passed: true },
      { ruleId: 'V4', passed: true },
      { ruleId: 'V5', passed: true },
    ],
    hadContamination: false,
    messageCount: 10,
    toolCount: 7,
    decisionCount: 2,
  });
  assert(allGood.qualityScore >= 0.9, 'all good case should be >= 0.9');

  const mixed = qualityScorer.scoreMemoryQuality({
    content: '# mixed',
    validatorSignals: [
      { ruleId: 'V1', passed: false },
      { ruleId: 'V2', passed: false },
      { ruleId: 'V3', passed: true },
      { ruleId: 'V4', passed: true },
      { ruleId: 'V5', passed: true },
    ],
    hadContamination: false,
    messageCount: 0,
    toolCount: 0,
    decisionCount: 0,
  });
  assert(Math.abs(mixed.qualityScore - 0.5) < 0.0001, 'mixed two-failure case should equal 0.5');

  const empty = qualityScorer.scoreMemoryQuality({ content: '' });
  assert(empty.qualityScore === 0, 'empty file should score 0');

  const bonusClamp = qualityScorer.scoreMemoryQuality({
    content: '# bonus',
    validatorSignals: [
      { ruleId: 'V1', passed: true },
      { ruleId: 'V2', passed: true },
      { ruleId: 'V3', passed: true },
      { ruleId: 'V4', passed: true },
      { ruleId: 'V5', passed: true },
    ],
    messageCount: 50,
    toolCount: 20,
    decisionCount: 10,
  });
  assert(bonusClamp.qualityScore <= 1, 'bonus case should clamp to 1.0');
}

function runBenchmarkFixtureTest() {
  const base = path.join(
    __dirname,
    '..', '..', '..', '..', 'specs',
    '003-system-spec-kit',
    '136-mcp-working-memory-hybrid-rag',
    'scratch',
    'quality-benchmarks'
  );

  const badDir = path.join(base, 'bad');
  const goodDir = path.join(base, 'good');

  const badFiles = fs.readdirSync(badDir).filter((name) => name.endsWith('.md'));
  const goodFiles = fs.readdirSync(goodDir).filter((name) => name.endsWith('.md'));

  for (const name of badFiles) {
    const content = fs.readFileSync(path.join(badDir, name), 'utf-8');
    const result = validator.validateMemoryQualityContent(content);
    assert(result.valid === false, `bad fixture should fail: ${name}`);
  }

  for (const name of goodFiles) {
    const content = fs.readFileSync(path.join(goodDir, name), 'utf-8');
    const result = validator.validateMemoryQualityContent(content);
    assert(result.valid === true, `good fixture should pass: ${name}`);
  }
}

async function main() {
  runValidatorRuleTests();
  runContaminationTests();
  await runDecisionCueTests();
  runQualityScorerTests();
  runBenchmarkFixtureTest();
  console.log('test-memory-quality-lane: PASS');
}

main().catch((error) => {
  console.error('test-memory-quality-lane: FAIL');
  console.error(error.message);
  process.exit(1);
});
