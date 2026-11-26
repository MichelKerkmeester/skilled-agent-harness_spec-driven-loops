const fs = require('fs');
const path = require('path');

const L = '/Users/michelkerkmeester/worktrees/public/546-sk-code-rust/specs/sk-code/code-surfaces/007-sk-code-rust/research/lineages/vibe-3';
const N = 7;
const SESSION = 'fanout-vibe-3-1795694320828-so5yva';

const SK = '.skilled/skills/sk-code/sk-code-skilled';
const RA = 'specs/z_external-repo-library/rust-anything-main';

// Exact registry text, so the reducer can resolve these questions.
const Q1 = "How is rust-anything's own Rust written: Cargo.toml lints, edition and rust-version, module layout across src/, error handling, the clap CLI, serde settings, test layout and fixtures under tests/, and the cargo fmt, clippy and test finish gate in its CLAUDE.md?";
const Q2 = "What are rust-anything's record, bridge, diff, bench, shadow and gate methods (docs/how-it-works.md), docs/pitfalls.md and DECISIONS.md, and which of them apply to any Rust port checked against an original?";
const Q3 = "How does docs/types.md map values across napi-rs, PyO3, the C ABI and the other bridges?";
const Q4 = "How do skills/rust-anything/SKILL.md and whole-app.md steer a coding agent through a port?";
const Q5 = "For each finding, does the existing sk-code Rust set under .skilled/skills/sk-code/sk-code-skilled/references/rust/ and assets/checklists/rust-checklist/ cover it, contradict it or lack it, and what does an app-style Rust project such as a CLI or a ratatui terminal screen need that the set lacks?";

const findings = [
  {
    id: 'F-7-1',
    label: 'All fifteen sk-code target sections exist at the stated line ranges (Scope 32, Protected Contracts 44, CI Clippy Deny List 168, Narrow Lint Suppressions 190, Review Evidence Template 123, Validation Commands 156, Conversion Policies 118, Collection Selection 140, Canonical Serialization 212, Public API and ABI Contracts 248, Sidecar Contract 361, Acceptance Standard 36, Error and Panic Translation 124, Panic Policy 178, Testing Layout 136); no row names a section that does not exist',
    sources: [SK + '/assets/checklists/rust-checklist/overview-and-p0-parity.md:32', SK + '/assets/checklists/rust-checklist/p1-required.md:190', SK + '/assets/checklists/rust-checklist/p2-evidence-validation-and-resources.md:123', SK + '/references/rust/quality-standards/modeling-collections-and-api.md:361', SK + '/references/rust/quality-standards/docs-errors-and-async.md:178', SK + '/references/rust/quality-standards/build-and-organization.md:136']
  },
  {
    id: 'F-7-2',
    label: 'REFINEMENT to row 14: src/main.rs:824-834 verified - fn main() -> ExitCode matches run() -> Result<ExitCode>, the error path prints eprintln!("error: {e:#}") and returns ExitCode::from(2); the row should name the code 2 and the {e:#} context chain because "a documented non-zero code" is not a contract a test can assert',
    sources: [RA + '/src/main.rs:824', RA + '/src/main.rs:825', RA + '/src/main.rs:829', RA + '/src/main.rs:834']
  },
  {
    id: 'F-7-3',
    label: 'REFINEMENT to row 15: src/main.rs:6-12 verified - broken pipe is handled by a say! macro that discards the write error (let _ = writeln!(std::io::stdout().lock(), ...)) with a say_raw! twin using write!, and the doc comment names "| head"; the rule is "discard the write error on stdout and route every print through one macro", not "install a SIGPIPE handler", which needs no unsafe and is testable by piping to head',
    sources: [RA + '/src/main.rs:6', RA + '/src/main.rs:7', RA + '/src/main.rs:9', RA + '/src/main.rs:14']
  },
  {
    id: 'F-7-4',
    label: 'REFINEMENT to rows 3 and 14: src/main.rs:21-52 verified - clap derive set is three (Parser, Subcommand, ValueEnum), the top-level type carries #[command(name, version, about, after_help)] and the subcommand enum is #[derive(Subcommand)]; ValueEnum is what makes a flag accepted values appear in --help and after_help is where the loop is documented in the CLI itself',
    sources: [RA + '/src/main.rs:21', RA + '/src/main.rs:25', RA + '/src/main.rs:52']
  },
  {
    id: 'F-7-5',
    label: 'docs/types.md anchors verified: 123 is the C ABI width-and-sign sentence, 127 is the int -> std::ffi::c_int row, 155 is the enum-is-c_int and typedef-is-that-scalar sentence, 167 is the all-scalar struct becomes #[repr(C)] sentence, and 188/217/242 each map char/Character/Char to "refused - a UTF-16 code unit"; rows 7 and 8 quote their sources accurately',
    sources: [RA + '/docs/types.md:123', RA + '/docs/types.md:155', RA + '/docs/types.md:167', RA + '/docs/types.md:188']
  },
  {
    id: 'F-7-6',
    label: 'tests/rules.rs:11 verified as const CLI: &str = env!("CARGO_BIN_EXE_rust-anything"); and the same pattern appears in four test files (rules.rs:11, switch.rs:295, tools.rs:11, recording.rs:29), which strengthens row 13',
    sources: [RA + '/tests/rules.rs:11', RA + '/tests/switch.rs:295', RA + '/tests/tools.rs:11']
  },
  {
    id: 'F-7-7',
    label: 'whole-app.md anchors verified: 136 the app owns the entry point, 143 the CLI fallback passes output and exit code through, 148 the front-door scaffolds a clap parser or an axum app, 152 the fallback rate only goes down, 232 app lift ends with replay, 238 a mismatch is a bug in the port never in the cases, 247 shadow live traffic before cutover; rows 1, 2, 3, 4 and 16 quote their sources accurately',
    sources: [RA + '/skills/rust-anything/whole-app.md:136', RA + '/skills/rust-anything/whole-app.md:143', RA + '/skills/rust-anything/whole-app.md:148', RA + '/skills/rust-anything/whole-app.md:152', RA + '/skills/rust-anything/whole-app.md:232', RA + '/skills/rust-anything/whole-app.md:238', RA + '/skills/rust-anything/whole-app.md:247']
  },
  {
    id: 'F-7-8',
    label: 'skills/rust-anything/SKILL.md anchors verified: 142 the fancy-regex and non-ASCII engine sentence, 147 the unicode(false) and ASCII-class remedy, 150 cargo test with no tests proves nothing, 151 #[expect(lint, reason)] over #[allow], 245-246 the unwrap/expect/panic rule with the // INFALLIBLE: <why> marker; rows 6, 10, 11 and 12 quote their sources accurately',
    sources: [RA + '/skills/rust-anything/SKILL.md:142', RA + '/skills/rust-anything/SKILL.md:147', RA + '/skills/rust-anything/SKILL.md:150', RA + '/skills/rust-anything/SKILL.md:151', RA + '/skills/rust-anything/SKILL.md:245']
  },
  {
    id: 'F-7-9',
    label: 'DECISIONS.md:48 and Cargo.toml anchors verified: DECISIONS.md:48 is the L14 row row 5 reproduces; Cargo.toml:15 anyhow, 16 clap with the derive feature, 26 regex, 28 the float_roundtrip comment, 29 serde_json with float_roundtrip, preserve_order and unbounded_depth; row 9 claim that all three feature names appear zero times in the set was re-run and holds',
    sources: [RA + '/DECISIONS.md:48', RA + '/Cargo.toml:15', RA + '/Cargo.toml:16', RA + '/Cargo.toml:26', RA + '/Cargo.toml:28', RA + '/Cargo.toml:29']
  },
  {
    id: 'F-7-10',
    label: 'Row 17 negative result re-verified: grep -rl "ratatui|crossterm" over the whole rust-anything repository returns zero files, so the TUI gap is real and unsourced and the completion criterion "or research.md names why one is absent" is the honest route',
    sources: [RA + '/Cargo.toml:15', RA + '/Cargo.toml:26']
  },
  {
    id: 'F-7-11',
    label: 'The three questions the reducer still holds open are answered; they stayed open because iterations 1, 2 and 5 recorded paraphrased answeredQuestions text and the reducer resolves a question only on an exact text match, which is why questions 3 and 4 resolved at iteration 6 where their exact text was copied - a lineage can look unconverged purely because its records paraphrased the questions',
    sources: [L + '/findings-registry.json', L + '/iterations/iteration-006.md']
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
  focus: 'Verification of the seventeen-row edit list against the target sections and the rust-anything source lines, plus closing the three key questions the reducer still holds open',
  findingsCount: findings.length,
  newInfoRatio: 0.3,
  noveltyJustification: '3 of 11 findings are refinements that sharpen a row (the exit code 2, the say! macro, the ValueEnum derive); the other 8 are confirmations of rows already written, counted as redundant',
  keyQuestions: [Q1, Q2, Q3, Q4, Q5],
  answeredQuestions: [Q1, Q2, Q3, Q4, Q5],
  ruledOut: [
    'Treating the three open questions as unanswered research - they are answered and the record text was the problem',
    'Re-verifying the fifteen sk-code sections by reading each in full - the heading grep establishes existence and line range, which is what the rows claim'
  ],
  focusTrack: 'verification',
  edgeCase: 'missing-dependency',
  toolsUsed: ['Read', 'Grep', 'Bash'],
  sourcesQueried: [
    RA + '/src/main.rs:1-30,45-60,815-840',
    RA + '/docs/types.md:123,155,167,188,217,242',
    RA + '/tests/rules.rs:11',
    RA + '/tests/switch.rs:295',
    RA + '/tests/tools.rs:11',
    RA + '/skills/rust-anything/whole-app.md:136,143,148,152,232,238,247',
    RA + '/skills/rust-anything/SKILL.md:142,147,150,151,245-246',
    RA + '/DECISIONS.md:48',
    RA + '/Cargo.toml:15,16,26,28-29',
    SK + '/assets/checklists/rust-checklist/overview-and-p0-parity.md:32,44',
    SK + '/assets/checklists/rust-checklist/p1-required.md:168,190',
    SK + '/assets/checklists/rust-checklist/p2-evidence-validation-and-resources.md:123,156',
    SK + '/references/rust/quality-standards/modeling-collections-and-api.md:118,140,212,248,361',
    SK + '/references/rust/quality-standards/determinism-and-parity.md:36',
    SK + '/references/rust/quality-standards/docs-errors-and-async.md:124,178',
    SK + '/references/rust/quality-standards/build-and-organization.md:136'
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
    'Treating the three open questions as unanswered research - they are answered and the record text was the problem',
    'Re-verifying the fifteen sk-code sections by reading each in full - the heading grep establishes existence and line range, which is what the rows claim'
  ]
}));
lines.push(JSON.stringify({
  type: 'observation',
  iteration: N,
  label: 'Recording defect worth carrying to synthesis: the reducer resolves a key question only on an exact text match, so a lineage whose records paraphrase the questions looks unconverged even when every question is answered',
  sources: [L + '/findings-registry.json']
}));

const deltaPath = path.join(L, 'deltas', 'iter-00' + N + '.jsonl');
fs.mkdirSync(path.dirname(deltaPath), { recursive: true });
if (fs.existsSync(deltaPath)) {
  throw new Error('delta already exists, refusing to overwrite: ' + deltaPath);
}
fs.writeFileSync(deltaPath, lines.join('\n') + '\n', 'utf8');

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

console.log(JSON.stringify({
  deltaPath,
  lines: parsed.length,
  findingRows: findingRows.length,
  findingsCount: first.findingsCount,
  answeredQuestions: first.answeredQuestions.length,
  recordPath,
  status: first.status,
  newInfoRatio: first.newInfoRatio
}, null, 2));
