const fs = require('fs');
const path = require('path');

const L = '/Users/michelkerkmeester/worktrees/public/546-sk-code-rust/specs/sk-code/code-surfaces/007-sk-code-rust/research/lineages/vibe-3';
const N = 5;
const SESSION = 'fanout-vibe-3-1795694320828-so5yva';

const SK = '.skilled/skills/sk-code/sk-code-skilled';
const RA = 'specs/z_external-repo-library/rust-anything-main';

const findings = [
  {
    id: 'F-5-1',
    label: 'Root cause of the app-style gap is a scope statement: the checklist assigns "daemon and CLI wiring" to TypeScript by name, so clap/ratatui/crossterm are absent by decision, not oversight',
    sources: [
      SK + '/assets/checklists/rust-checklist/overview-and-p0-parity.md:32',
      SK + '/assets/checklists/rust-checklist/overview-and-p0-parity.md:34',
      SK + '/assets/checklists/rust-checklist/overview-and-p0-parity.md:38',
      SK + '/assets/checklists/rust-checklist/overview-and-p0-parity.md:42'
    ]
  },
  {
    id: 'F-5-2',
    label: 'Protected Contracts table is eight rows and every one is a parity contract, so an app has no contract to be held to (exit code, --help output, broken pipe, startup budget, terminal restore all absent)',
    sources: [
      SK + '/assets/checklists/rust-checklist/overview-and-p0-parity.md:44',
      SK + '/assets/checklists/rust-checklist/overview-and-p0-parity.md:45',
      SK + '/assets/checklists/rust-checklist/overview-and-p0-parity.md:46',
      SK + '/assets/checklists/rust-checklist/overview-and-p0-parity.md:47',
      SK + '/assets/checklists/rust-checklist/overview-and-p0-parity.md:48',
      SK + '/assets/checklists/rust-checklist/overview-and-p0-parity.md:49',
      SK + '/assets/checklists/rust-checklist/overview-and-p0-parity.md:50',
      SK + '/assets/checklists/rust-checklist/overview-and-p0-parity.md:51'
    ]
  },
  {
    id: 'F-5-3',
    label: 'Validation block is twenty workspace-shaped commands with no program-as-program check; assert_cmd, trycmd and tempfile appear zero times, so no --help snapshot, exit-code assertion, stdin/stdout test or filesystem fixture exists',
    sources: [
      SK + '/assets/checklists/rust-checklist/p2-evidence-validation-and-resources.md:158',
      SK + '/assets/checklists/rust-checklist/p2-evidence-validation-and-resources.md:165',
      SK + '/assets/checklists/rust-checklist/p2-evidence-validation-and-resources.md:180',
      SK + '/assets/checklists/rust-checklist/p2-evidence-validation-and-resources.md:222'
    ]
  },
  {
    id: 'F-5-4',
    label: 'CORRECTION to iteration 1 finding 8: sk-code does have a panic policy and it is stronger than credited - the CI clippy deny list denies unwrap_used, expect_used, panic, float_cmp, as_conversions and indexing_slicing; what it lacks is the INFALLIBLE escape marker and the "where the original returns an error" scoping',
    sources: [
      SK + '/assets/checklists/rust-checklist/p1-required.md:168',
      SK + '/assets/checklists/rust-checklist/p1-required.md:171',
      SK + '/assets/checklists/rust-checklist/p1-required.md:173',
      SK + '/assets/checklists/rust-checklist/p1-required.md:179'
    ]
  },
  {
    id: 'F-5-5',
    label: 'CORRECTION to iteration 1 finding 2: sk-code\'s deny over forbid has a stated reason ("so an exceptional local suppression remains possible after review"); resolution is by lint kind - forbid is right for unsafe_code in a crate shipping no unsafe, deny is right for clippy lints where a reviewed suppression must remain possible',
    sources: [
      SK + '/assets/checklists/rust-checklist/p1-required.md:188',
      RA + '/Cargo.toml:43'
    ]
  },
  {
    id: 'F-5-6',
    label: 'CORRECTION to iteration 4 finding 4: IndexMap IS present in the collection selection table and two reference files; fancy-regex is genuinely absent, as is any rule about \\w, \\b, \\d or case-insensitive matching differing on non-ASCII text',
    sources: [
      SK + '/references/rust/quality-standards/modeling-collections-and-api.md:149',
      RA + '/skills/rust-anything/SKILL.md:142',
      RA + '/skills/rust-anything/SKILL.md:147'
    ]
  },
  {
    id: 'F-5-7',
    label: 'The async runtime has a policy ("Use Tokio only for genuine Rust-owned asynchronous I/O", P1) and the app-side async stack has none: axum, tracing and env_logger appear zero times',
    sources: [
      SK + '/references/rust/quality-standards/docs-errors-and-async.md:278',
      SK + '/references/rust/quality-standards/build-and-organization.md:222',
      SK + '/assets/checklists/rust-checklist/p2-evidence-validation-and-resources.md:114'
    ]
  },
  {
    id: 'F-5-8',
    label: 'The application error story has a home (anyhow permitted in a sidecar main or outermost non-ABI shell, P2) and the application entry point does not: ExitCode, std::process, broken pipe and SIGPIPE appear zero times',
    sources: [
      SK + '/references/rust/quality-standards/docs-errors-and-async.md:147',
      SK + '/references/rust/quality-standards/docs-errors-and-async.md:148',
      RA + '/src/main.rs:824',
      RA + '/src/main.rs:6'
    ]
  },
  {
    id: 'F-5-9',
    label: 'A Rust CLI needs seven things the set lacks: clap 4 derive with Parser/Subcommand, fn main() -> ExitCode with an inner run() and exit code 2, broken-pipe safety, --help/--version as tested output, an exit-code contract row, assert_cmd/trycmd/tempfile, and config loading with platform paths',
    sources: [
      RA + '/src/main.rs:25',
      RA + '/src/main.rs:52',
      RA + '/src/main.rs:824',
      RA + '/src/main.rs:829',
      RA + '/src/main.rs:7'
    ]
  },
  {
    id: 'F-5-10',
    label: 'A ratatui terminal screen needs five things the set lacks: ratatui plus crossterm, terminal state restored on panic and early return, a TestBackend render loop testable without a terminal, terminal size and resize tolerance, and a cell-grid-after-events oracle instead of byte parity',
    sources: [
      RA + '/src/main.rs:25',
      RA + '/skills/rust-anything/SKILL.md:142'
    ]
  },
  {
    id: 'F-5-11',
    label: 'The RUST router route cannot reach an app-style request: nine of its twelve keywords name a binding technology, so clap, ratatui, crossterm, tokio or axum match only rust, .rs or cargo.toml',
    sources: [SK + '/ROUTER.md:81']
  },
  {
    id: 'F-5-12',
    label: 'The set is 6,642 lines across 17 reference files and 4 checklist parts with an app-style line count of zero, so the gap is a shortage of subject rather than of material and the edit list can be short',
    sources: [
      SK + '/references/rust',
      SK + '/assets/checklists/rust-checklist'
    ]
  },
  {
    id: 'F-5-13',
    label: 'The surface\'s one behavioural statement about Rust is the binding framing ("Rust preserves the TypeScript contract... compatibility implementations, not independent behavior authorities"), which is the sentence to amend because an app is the authority for its own behaviour',
    sources: [SK + '/SKILL.md:139']
  },
  {
    id: 'F-5-14',
    label: 'The packet completion criterion is satisfiable by naming the reason, and the reason is a scope decision: all three terms are absent because overview-and-p0-parity.md:42 assigns daemon and CLI wiring to TypeScript and lists only binding shapes as in-scope',
    sources: [
      'specs/sk-code/code-surfaces/007-sk-code-rust/goal.md:56',
      SK + '/assets/checklists/rust-checklist/overview-and-p0-parity.md:42'
    ]
  },
  {
    id: 'F-5-15',
    label: 'The set\'s strengths must survive the app work and beat rust-anything in four places: the six-lint clippy deny list, --locked on every dependency-resolving command, the cargo deny/audit/vet supply-chain gate, and the golden-provenance record',
    sources: [
      SK + '/assets/checklists/rust-checklist/overview-and-p0-parity.md:71',
      SK + '/assets/checklists/rust-checklist/p1-required.md:171',
      SK + '/references/rust/quality-standards/build-and-organization.md:196',
      SK + '/references/rust/quality-standards/build-and-organization.md:185',
      SK + '/assets/checklists/rust-checklist/p2-evidence-validation-and-resources.md:212'
    ]
  }
];

const record = {
  type: 'iteration',
  iteration: N,
  runId: SESSION,
  sessionId: SESSION,
  lineageId: SESSION,
  mode: 'research',
  target_agent: 'deep-research',
  agent_definition_loaded: true,
  resolved_route: 'Resolved route: mode=research target_agent=deep-research',
  run: N,
  status: 'complete',
  focus: 'Coverage pass: for each finding, does the sk-code Rust set cover, contradict or lack it, and what does an app-style Rust project (CLI, ratatui screen) need that the set lacks',
  findingsCount: findings.length,
  newInfoRatio: 0.85,
  noveltyJustification: '12 of 15 findings are new coverage verdicts; 3 are corrections of this lineage\'s own earlier overstatements, counted as partially new',
  keyQuestions: [
    'For each finding, does the existing sk-code Rust set cover it, contradict it or lack it, by file and section, and what does an app-style Rust project such as a CLI or a ratatui terminal screen need that the set lacks?'
  ],
  answeredQuestions: [],
  ruledOut: [
    'Concluding that clap, ratatui and crossterm were forgotten - the scope statement excludes them by name',
    'Recommending forbid over deny for the clippy lints - sk-code\'s stated reason for deny is correct for a lint a legitimate case can need'
  ],
  focusTrack: 'coverage-pass',
  edgeCase: 'missing-dependency',
  toolsUsed: ['Read', 'Grep', 'Bash'],
  sourcesQueried: [
    SK + '/assets/checklists/rust-checklist/overview-and-p0-parity.md:32-100',
    SK + '/assets/checklists/rust-checklist/p0-safety-and-boundary-discipline.md:31-60',
    SK + '/assets/checklists/rust-checklist/p1-required.md:158-212',
    SK + '/assets/checklists/rust-checklist/p2-evidence-validation-and-resources.md:29-230',
    SK + '/references/rust/quality-standards/build-and-organization.md:136-230',
    SK + '/references/rust/quality-standards/modeling-collections-and-api.md:140-180',
    SK + '/references/rust/quality-standards/docs-errors-and-async.md:147-148,276-278',
    SK + '/SKILL.md:139',
    SK + '/ROUTER.md:81',
    RA + '/Cargo.toml:43',
    RA + '/src/main.rs:6,25,52,824,829',
    RA + '/skills/rust-anything/SKILL.md:142-147',
    'specs/sk-code/code-surfaces/007-sk-code-rust/goal.md:56'
  ],
  graphEvents: []
};

const lines = [JSON.stringify(record)];
for (const f of findings) {
  lines.push(JSON.stringify({ type: 'finding', id: f.id, label: f.label, iteration: N, sources: f.sources }));
}
lines.push(JSON.stringify({
  type: 'ruled_out',
  iteration: N,
  approaches: [
    'Concluding that clap, ratatui and crossterm were forgotten - the scope statement excludes them by name',
    'Recommending forbid over deny for the clippy lints - sk-code\'s stated reason for deny is correct for a lint a legitimate case can need'
  ]
}));
lines.push(JSON.stringify({
  type: 'observation',
  iteration: N,
  label: 'Three corrections to earlier iterations (F-5-4, F-5-5, F-5-6) were caused by grepping lowercase crate names and by reading an rg probe as a policy; the edit list must not inherit those overstatements',
  sources: [SK + '/assets/checklists/rust-checklist/p1-required.md:171', SK + '/references/rust/quality-standards/modeling-collections-and-api.md:149']
}));

const deltaPath = path.join(L, 'deltas', 'iter-00' + N + '.jsonl');
fs.mkdirSync(path.dirname(deltaPath), { recursive: true });
if (fs.existsSync(deltaPath)) {
  throw new Error('delta already exists, refusing to overwrite: ' + deltaPath);
}
fs.writeFileSync(deltaPath, lines.join('\n') + '\n', 'utf8');

// validate
const raw = fs.readFileSync(deltaPath, 'utf8').split('\n').filter(Boolean);
const parsed = raw.map((l, i) => {
  try { return JSON.parse(l); } catch (e) { throw new Error('line ' + (i + 1) + ' is not JSON: ' + e.message); }
});
const first = parsed[0];
if (first.type !== 'iteration') throw new Error('line 1 is not the iteration record');
const findingRows = parsed.filter(r => r.type === 'finding');
if (first.findingsCount !== findingRows.length) {
  throw new Error('findingsCount ' + first.findingsCount + ' != finding rows ' + findingRows.length);
}
for (const r of findingRows) {
  if (!r.id || !r.label || !Array.isArray(r.sources) || r.sources.length === 0) {
    throw new Error('finding row missing id/label/sources: ' + JSON.stringify(r));
  }
}

const recordPath = path.join(L, 'prompts', 'iter-00' + N + '-record.json');
fs.mkdirSync(path.dirname(recordPath), { recursive: true });
fs.writeFileSync(recordPath, JSON.stringify(record), 'utf8');

return {
  deltaPath,
  lines: parsed.length,
  findingRows: findingRows.length,
  findingsCount: first.findingsCount,
  recordPath,
  status: first.status,
  newInfoRatio: first.newInfoRatio
};
