const fs = require('fs');
const path = require('path');

const L = '/Users/michelkerkmeester/worktrees/public/546-sk-code-rust/specs/sk-code/code-surfaces/007-sk-code-rust/research/lineages/vibe-3';
const N = 8;
const SESSION = 'fanout-vibe-3-1795694320828-so5yva';

const SK = '.skilled/skills/sk-code/sk-code-skilled';
const RA = 'specs/z_external-repo-library/rust-anything-main';

const Q1 = "How is rust-anything's own Rust written: Cargo.toml lints, edition and rust-version, module layout across src/, error handling, the clap CLI, serde settings, test layout and fixtures under tests/, and the cargo fmt, clippy and test finish gate in its CLAUDE.md?";
const Q2 = "What are rust-anything's record, bridge, diff, bench, shadow and gate methods (docs/how-it-works.md), docs/pitfalls.md and DECISIONS.md, and which of them apply to any Rust port checked against an original?";
const Q3 = "How does docs/types.md map values across napi-rs, PyO3, the C ABI and the other bridges?";
const Q4 = "How do skills/rust-anything/SKILL.md and whole-app.md steer a coding agent through a port?";
const Q5 = "For each finding, does the existing sk-code Rust set under .skilled/skills/sk-code/sk-code-skilled/references/rust/ and assets/checklists/rust-checklist/ cover it, contradict it or lack it, and what does an app-style Rust project such as a CLI or a ratatui terminal screen need that the set lacks?";

const findings = [
  {
    id: 'F-8-1',
    label: 'All five key questions are answered and the reducer agrees: 5 resolved, 0 open, 0 uncovered; Q1 in iterations 1 and 5, Q2 in iteration 2, Q3 in iteration 3, Q4 in iteration 4, Q5 in iterations 5 and 6 and verified in iteration 7',
    sources: [L + '/findings-registry.json']
  },
  {
    id: 'F-8-2',
    label: 'The single most consequential finding is a scope statement, not a missing rule: overview-and-p0-parity.md:42 assigns "daemon and CLI wiring" to TypeScript by name, which is why clap, ratatui and crossterm are absent from a 6,642-line Rust set, and every other app-style gap follows from it',
    sources: [SK + '/assets/checklists/rust-checklist/overview-and-p0-parity.md:42']
  },
  {
    id: 'F-8-3',
    label: 'The app rules exist in rust-anything but in whole-app.md rather than the per-function skill: 136 the app owns the entry point, 148 a clap parser or axum app is scaffolded, 152 the fallback rate only goes down, 232-238 the replay-and-drift proof loop with "a mismatch is a bug in the port, never in the cases", 247 shadow live traffic before cutover; this reframing is what makes the edit list traceable rather than inventive',
    sources: [RA + '/skills/rust-anything/whole-app.md:136', RA + '/skills/rust-anything/whole-app.md:148', RA + '/skills/rust-anything/whole-app.md:152', RA + '/skills/rust-anything/whole-app.md:238']
  },
  {
    id: 'F-8-4',
    label: 'The seventeen-row edit list is verified and ranked in four tiers: rank 1 unblocks the app case (scope, SKILL.md:139 framing, router keywords, three app contract rows), rank 2 is correctness risk (recorded-literal guard, regex trap, UTF-16 code unit, C ABI mapping, three serde_json features, INFALLIBLE marker, expect over allow, no-tests-proves-nothing), rank 3 is app mechanics (CARGO_BIN_EXE pattern, ExitCode entry point, broken-pipe macro, app proof loop), rank 4 is the one unsourced row',
    sources: [L + '/iterations/iteration-006.md']
  },
  {
    id: 'F-8-5',
    label: 'Three rows were sharpened by verification because a rule has to be assertable: the error exit code is specifically 2 with the {e:#} context chain on stderr, broken pipe is a say! macro that discards the write error rather than a signal handler, and clap derive set is three (Parser, Subcommand, ValueEnum) with after_help carrying the loop',
    sources: [RA + '/src/main.rs:829', RA + '/src/main.rs:7', RA + '/src/main.rs:21']
  },
  {
    id: 'F-8-6',
    label: 'One row cannot be traced to rust-anything and the honest position is to say so: the five ratatui and crossterm rules have no source because grep -rl over the whole repository returns zero files and the dependency list has no TUI crate, so the completion criterion "or research.md names why one is absent" is the route rather than stretching a citation',
    sources: [RA + '/Cargo.toml:15', RA + '/Cargo.toml:29']
  },
  {
    id: 'F-8-7',
    label: 'The set strengths are real and the edit list does not touch them: byte-for-byte parity, the eight-row contract table, the six-lint clippy deny list, --locked everywhere, cargo deny/audit/vet, SAFETY: on every unsafe, the golden-provenance record and CI=true INSTA_UPDATE=no; in four places the set is better than rust-anything, so the work is additive',
    sources: [SK + '/assets/checklists/rust-checklist/p1-required.md:171', SK + '/references/rust/quality-standards/build-and-organization.md:196']
  },
  {
    id: 'F-8-8',
    label: 'Convergence position: seven productive iterations with a ratio trend of 1.00, 1.00, 1.00, 1.00, 0.85, 0.75, 0.30 and this analytical iteration at 0.05; 100 findings, zero open questions, zero corruption warnings, zero rejected patterns; the ratio fell because the questions ran out, not because the search narrowed',
    sources: [L + '/deep-research-dashboard.md']
  },
  {
    id: 'F-8-9',
    label: 'Two recording defects affect how this lineage numbers should be read: the reducer resolves a key question only on an exact text match so questions 1, 2 and 5 looked unanswered for five iterations after they were answered and the convergence score was understated for that reason alone; and three of iteration 1 findings were overstated because they came from lowercase crate-name greps and from reading an rg probe as a policy',
    sources: [L + '/findings-registry.json', SK + '/assets/checklists/rust-checklist/p1-required.md:171']
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
  status: 'thought',
  focus: 'The convergence position: what the lineage established, what it verified, and what it could not establish, stated from prior packet evidence only',
  findingsCount: findings.length,
  newInfoRatio: 0.05,
  noveltyJustification: 'No new external evidence; the only new claim is the convergence position itself and the other eight findings restate verified findings from iterations 1 to 7',
  keyQuestions: [Q1, Q2, Q3, Q4, Q5],
  answeredQuestions: [Q1, Q2, Q3, Q4, Q5],
  ruledOut: [
    'Opening new research in the final iteration - the five questions are answered and the list is verified',
    'Stretching a rust-anything citation for the ratatui row - zero hits'
  ],
  focusTrack: 'convergence',
  edgeCase: 'missing-dependency',
  toolsUsed: ['Read', 'Grep'],
  sourcesQueried: [
    L + '/findings-registry.json',
    L + '/deep-research-dashboard.md',
    L + '/iterations/iteration-006.md',
    RA + '/skills/rust-anything/whole-app.md:136,148,152,238',
    RA + '/src/main.rs:7,21,829',
    RA + '/Cargo.toml:15,29',
    SK + '/assets/checklists/rust-checklist/overview-and-p0-parity.md:42',
    SK + '/assets/checklists/rust-checklist/p1-required.md:171',
    SK + '/references/rust/quality-standards/build-and-organization.md:196'
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
    'Opening new research in the final iteration - the five questions are answered and the list is verified',
    'Stretching a rust-anything citation for the ratatui row - zero hits'
  ]
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
