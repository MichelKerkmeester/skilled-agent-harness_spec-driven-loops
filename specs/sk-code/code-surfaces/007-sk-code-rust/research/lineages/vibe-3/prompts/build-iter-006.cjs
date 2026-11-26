const fs = require('fs');
const path = require('path');

const L = '/Users/michelkerkmeester/worktrees/public/546-sk-code-rust/specs/sk-code/code-surfaces/007-sk-code-rust/research/lineages/vibe-3';
const N = 6;
const SESSION = 'fanout-vibe-3-1795694320828-so5yva';

const SK = '.skilled/skills/sk-code/sk-code-skilled';
const RA = 'specs/z_external-repo-library/rust-anything-main';

const findings = [
  {
    id: 'F-6-1',
    label: 'RANK 1: overview-and-p0-parity.md Scope (32-42) - add app-style Rust as a second target shape whose contracts are the process observable surface (exit code, stdout/stderr bytes, --help/--version text, terminal state on exit); this row must land first because every other row lands in a document whose scope excludes its subject',
    sources: [SK + '/assets/checklists/rust-checklist/overview-and-p0-parity.md:42', RA + '/skills/rust-anything/whole-app.md:136', RA + '/skills/rust-anything/whole-app.md:138']
  },
  {
    id: 'F-6-2',
    label: 'RANK 1: SKILL.md:139 - amend the binding framing to "Rust preserves the TypeScript contract when there is one" and state that an app with no oracle is the authority for its own behaviour; rust-anything is itself an app (a [package] with a binary, no cdylib or napi surface)',
    sources: [SK + '/SKILL.md:139', RA + '/Cargo.toml:1', RA + '/Cargo.toml:2', RA + '/skills/rust-anything/whole-app.md:136']
  },
  {
    id: 'F-6-3',
    label: 'RANK 1: ROUTER.md:81 - append clap, ratatui, crossterm, axum and tokio to the RUST keyword list so an app request reaches the set instead of matching only rust, .rs or cargo.toml',
    sources: [SK + '/ROUTER.md:81', RA + '/skills/rust-anything/whole-app.md:148', RA + '/skills/rust-anything/whole-app.md:150']
  },
  {
    id: 'F-6-4',
    label: 'RANK 1: overview-and-p0-parity.md Protected Contracts (44-51) - add three app rows to the eight parity rows: exit-code contract (P0), fallback rate only goes down (P1), terminal state restored on every exit path including panic (P0)',
    sources: [SK + '/assets/checklists/rust-checklist/overview-and-p0-parity.md:44', SK + '/assets/checklists/rust-checklist/overview-and-p0-parity.md:51', RA + '/skills/rust-anything/whole-app.md:143', RA + '/skills/rust-anything/whole-app.md:152']
  },
  {
    id: 'F-6-5',
    label: 'RANK 2: p2-evidence-validation-and-resources.md VALIDATION COMMANDS (156-222) and REVIEW EVIDENCE TEMPLATE (123-155) - add the recorded-literal guard: fail a port that writes three or more recorded values the original never spells out, mentions the recording files, has fewer tests or assertions than at the last passing gate, or runs on a changed cases.jsonl; // recorded-literal: <reason> is the escape',
    sources: [RA + '/DECISIONS.md:48', SK + '/assets/checklists/rust-checklist/p2-evidence-validation-and-resources.md:156']
  },
  {
    id: 'F-6-6',
    label: 'RANK 2: modeling-collections-and-api.md Collection Selection (140-153) and determinism-and-parity.md Acceptance Standard (36-50) - add fancy-regex for lookaround/backreferences and the non-ASCII trap: \\w, \\b, \\d and case-insensitive matching differ from the source engine, so set unicode(false) or spell out ASCII classes where the original \\w is ASCII-only',
    sources: [RA + '/skills/rust-anything/SKILL.md:142', RA + '/skills/rust-anything/SKILL.md:147', SK + '/references/rust/quality-standards/modeling-collections-and-api.md:140']
  },
  {
    id: 'F-6-7',
    label: 'RANK 2: modeling-collections-and-api.md Conversion Policies (118-137) - add the UTF-16 code-unit rule: a JS char/Character/Char is a UTF-16 code unit, not a Unicode scalar, so refuse the conversion rather than mapping to Rust char; index a Vec<u16> where the original indexes by code unit',
    sources: [RA + '/docs/types.md:188', RA + '/docs/types.md:217', RA + '/docs/types.md:242', SK + '/references/rust/quality-standards/modeling-collections-and-api.md:118']
  },
  {
    id: 'F-6-8',
    label: 'RANK 2: modeling-collections-and-api.md PUBLIC API AND ABI CONTRACTS (248-368) - add a C ABI Contract section after Sidecar Contract: int is std::ffi::c_int, an enum is c_int, a typedef of a scalar is that scalar, an all-scalar struct by value is #[repr(C)], and const char* is Option<&[u8]> which costs a strlen per argument',
    sources: [RA + '/docs/types.md:123', RA + '/docs/types.md:127', RA + '/docs/types.md:155', RA + '/docs/types.md:167', RA + '/skills/rust-anything/SKILL.md:138', SK + '/references/rust/quality-standards/modeling-collections-and-api.md:361']
  },
  {
    id: 'F-6-9',
    label: 'RANK 2: modeling-collections-and-api.md Canonical Serialization (212-247) - name the three serde_json features that close two of the four differences the set already warns about: float_roundtrip (recorded floats survive a parse and a write bit for bit), preserve_order (insertion order instead of sorted keys), unbounded_depth (no recursion limit); all three appear zero times in the set',
    sources: [RA + '/Cargo.toml:28', RA + '/Cargo.toml:29', SK + '/references/rust/quality-standards/modeling-collections-and-api.md:214']
  },
  {
    id: 'F-6-10',
    label: 'RANK 2: p1-required.md CI Clippy Deny List (168-179) and docs-errors-and-async.md Panic Policy (178-208) - add the INFALLIBLE escape marker: a // INFALLIBLE: <why> comment on a function whose original also treats the state as impossible; the deny list itself is already stronger than iteration 1 credited, so the edit is the marker not the list',
    sources: [RA + '/skills/rust-anything/SKILL.md:245', RA + '/skills/rust-anything/SKILL.md:246', SK + '/assets/checklists/rust-checklist/p1-required.md:171', SK + '/assets/checklists/rust-checklist/p1-required.md:179']
  },
  {
    id: 'F-6-11',
    label: 'RANK 2: p1-required.md Narrow Lint Suppressions (190-211) - require #[expect(lint, reason = "...")] over #[allow] so a suppression is flagged once it no longer applies; this composes with sk-code own reason for deny over forbid because #[expect] makes the reviewed suppression self-expiring',
    sources: [RA + '/skills/rust-anything/SKILL.md:151', RA + '/skills/rust-anything/SKILL.md:152', SK + '/assets/checklists/rust-checklist/p1-required.md:188', SK + '/assets/checklists/rust-checklist/p1-required.md:190']
  },
  {
    id: 'F-6-12',
    label: 'RANK 2: p2-evidence-validation-and-resources.md VALIDATION COMMANDS (156-222) and build-and-organization.md Testing Layout (136-169) - state that cargo test passing with no tests proves nothing: the recorded cases are the proof',
    sources: [RA + '/skills/rust-anything/SKILL.md:150', RA + '/skills/rust-anything/SKILL.md:151', SK + '/references/rust/quality-standards/build-and-organization.md:136']
  },
  {
    id: 'F-6-13',
    label: 'RANK 3: build-and-organization.md Testing Layout (136-169) - add the binary test pattern: env!("CARGO_BIN_EXE_<name>") plus std::process::Command asserting on stdout, stderr and exit status; this is the honest answer to the assert_cmd/trycmd gap because rust-anything uses neither and std is enough',
    sources: [RA + '/tests/rules.rs:11', RA + '/tests/switch.rs:295', RA + '/tests/tools.rs:11', SK + '/references/rust/quality-standards/build-and-organization.md:136']
  },
  {
    id: 'F-6-14',
    label: 'RANK 3: docs-errors-and-async.md ERROR AND PANIC TRANSLATION (124-219) - add an Application Entry Point section: fn main() -> ExitCode with an inner fn run() -> Result<ExitCode>, the error path returning a documented non-zero code rather than panicking; ExitCode appears zero times in the set, which is why the anyhow-in-main permission is only half a rule',
    sources: [RA + '/src/main.rs:824', RA + '/src/main.rs:829', SK + '/references/rust/quality-standards/docs-errors-and-async.md:148']
  },
  {
    id: 'F-6-15',
    label: 'RANK 3: docs-errors-and-async.md Panic Policy (178-208) - add the broken-pipe rule: a closed stdout is not an error, so prog | head must exit quietly rather than panic on a failed write; broken pipe, SIGPIPE and std::process all appear zero times in the set',
    sources: [RA + '/src/main.rs:6', RA + '/src/main.rs:7', SK + '/references/rust/quality-standards/docs-errors-and-async.md:178']
  },
  {
    id: 'F-6-16',
    label: 'RANK 3: p2-evidence-validation-and-resources.md VALIDATION COMMANDS (156-222) - add the app proof loop: replay every recorded case against the built binary after any change, run the drift check in CI, shadow live traffic before a server cutover, and treat a mismatch as a bug in the port never in the cases',
    sources: [RA + '/skills/rust-anything/whole-app.md:232', RA + '/skills/rust-anything/whole-app.md:238', RA + '/skills/rust-anything/whole-app.md:247']
  },
  {
    id: 'F-6-17',
    label: 'RANK 4 UNSOURCED: the ratatui and crossterm rules have no rust-anything source - grep -rl over the whole repository returns zero files and the dependency list has no TUI crate - so this row cannot satisfy the traceability requirement and must be sourced from ratatui own documentation in a later packet or left out with the completion criterion naming why',
    sources: [RA + '/Cargo.toml:15', RA + '/Cargo.toml:26', RA + '/Cargo.toml:29']
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
  focus: 'The ranked edit list: each row names the target sk-code Rust part by file and section, the change in sk-code own words, and the rust-anything file:line that sources it',
  findingsCount: findings.length,
  newInfoRatio: 0.75,
  noveltyJustification: '9 of 17 rows rest on sources first read this iteration, 5 are synthesis of prior findings into edit form, 3 restate earlier findings; a +0.10 simplicity bonus applies because whole-app.md reframes the app rules as present in rust-anything rather than missing',
  keyQuestions: [
    'For each finding, does the existing sk-code Rust set cover it, contradict it or lack it, and what does an app-style Rust project need that the set lacks?',
    'What is the ranked edit list, each row naming the target sk-code Rust part, the change and the rust-anything source line?'
  ],
  answeredQuestions: [
    'How is rust-anything own Rust written (Cargo.toml lints, edition, rust-version, module layout, error handling, clap CLI, serde settings, test layout, finish gate)?',
    'What are its record, bridge, diff, bench, shadow and gate method, and which apply to any Rust port checked against an original?',
    'How does docs/types.md map values across napi-rs, PyO3, the C ABI and the other bridges?',
    'How do skills/rust-anything/SKILL.md and whole-app.md steer a coding agent through a port?',
    'For each finding, does the sk-code Rust set cover, contradict or lack it, and what does an app-style Rust project need that the set lacks?',
    'What is the ranked edit list?'
  ],
  ruledOut: [
    'Sourcing the ratatui rules from rust-anything anyway - zero hits across the repository',
    'Recommending assert_cmd or trycmd for CLI tests - rust-anything uses neither and CARGO_BIN_EXE with std::process::Command covers the same ground',
    'Adding forbid anywhere in the edit list - sk-code deny has a stated reason and the #[expect] row composes with it'
  ],
  focusTrack: 'edit-list',
  edgeCase: 'missing-dependency',
  toolsUsed: ['Read', 'Grep', 'Bash'],
  sourcesQueried: [
    RA + '/skills/rust-anything/whole-app.md:136-155,230-265',
    RA + '/skills/rust-anything/SKILL.md:138-152,245-246',
    RA + '/DECISIONS.md:48',
    RA + '/docs/types.md:123-127,155,167,188,217,242',
    RA + '/Cargo.toml:1-2,15,26,28-29',
    RA + '/tests/rules.rs:11',
    RA + '/tests/switch.rs:295',
    RA + '/tests/tools.rs:11',
    RA + '/src/main.rs:6-7,824,829',
    SK + '/assets/checklists/rust-checklist/overview-and-p0-parity.md:32-51',
    SK + '/assets/checklists/rust-checklist/p1-required.md:168-211',
    SK + '/assets/checklists/rust-checklist/p2-evidence-validation-and-resources.md:123-222',
    SK + '/references/rust/quality-standards/modeling-collections-and-api.md:118-137,140-153,212-247,248-368',
    SK + '/references/rust/quality-standards/determinism-and-parity.md:36-50',
    SK + '/references/rust/quality-standards/docs-errors-and-async.md:124-219,276-284',
    SK + '/references/rust/quality-standards/build-and-organization.md:136-169',
    SK + '/SKILL.md:139',
    SK + '/ROUTER.md:81'
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
    'Sourcing the ratatui rules from rust-anything anyway - zero hits across the repository',
    'Recommending assert_cmd or trycmd for CLI tests - rust-anything uses neither and CARGO_BIN_EXE with std::process::Command covers the same ground',
    'Adding forbid anywhere in the edit list - sk-code deny has a stated reason and the #[expect] row composes with it'
  ]
}));
lines.push(JSON.stringify({
  type: 'observation',
  iteration: N,
  label: 'Reframing: the app rules are not missing from rust-anything, they are in whole-app.md (the whole-app workflow) rather than skills/rust-anything/SKILL.md (the per-function rules); iteration 5 read them as one document and concluded the app content was absent',
  sources: [RA + '/skills/rust-anything/whole-app.md:136', RA + '/skills/rust-anything/whole-app.md:230']
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
  recordPath,
  status: first.status,
  newInfoRatio: first.newInfoRatio
}, null, 2));
