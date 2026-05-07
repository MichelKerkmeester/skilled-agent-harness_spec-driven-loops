# Iteration 1: Q1 helper script concrete shape

## Focus

Answer Q1: propose a concrete shape for the multi-ai-council artifact persistence helper so packet 081 can start implementation without re-deciding script path, language, CLI args, parser contract, exit codes, tests, or reducer boundaries.

## Actions Taken

- Read `.opencode/skills/deep-research/scripts/reduce-state.cjs`.
- Read `.opencode/skills/deep-review/scripts/reduce-state.cjs`.
- Read `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/council-report.md`.
- Read `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/decision-record.md`.
- Read `.opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-validator.vitest.ts`.

## Findings

### Proposed Path And Language

Implement the helper at:

```text
.opencode/skills/system-spec-kit/scripts/multi-ai-council/persist-artifacts.cjs
```

Use Node CJS with an executable shebang:

```js
#!/usr/bin/env node
'use strict';
```

The round-1 report used the example name `persist-artifacts.sh`, but CJS is the better concrete shape. `deep-research/scripts/reduce-state.cjs` and `deep-review/scripts/reduce-state.cjs` already establish the local convention for reducer-like artifact helpers: pure Node, small filesystem helpers, regex markdown parsing, exported functions for tests, and a CLI entry point behind `require.main === module`.

Bash would be worse here because packet 081 needs fixture-driven parser tests and reusable parser exports. The helper is parser-heavy, not shell-heavy.

### CLI Contract

Usage:

```bash
node .opencode/skills/system-spec-kit/scripts/multi-ai-council/persist-artifacts.cjs \
  <packet-spec-folder> \
  [--round NNN] \
  [--input-file FILE] \
  [--strict-output]
```

Arguments:

- `<packet-spec-folder>`: required packet root, for example `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol`.
- `--round NNN`: optional explicit round; normalize `1` and `001` to `001`.
- `--input-file FILE`: optional council markdown source. If absent, read stdin.
- `--strict-output`: optional ADD-2 mode. Missing optional sections still do not fail parsing, but the helper writes stable placeholder sections/files instead of omitting optional-derived outputs.

Round discovery when `--round` is absent: inspect existing `ai-council/seats/round-*` directories, pick max + 1, and default to `001` when none exist.

Output paths for round `001`:

```text
<packet>/ai-council/council-report.md
<packet>/ai-council/ai-council-state.jsonl
<packet>/ai-council/seats/round-001/seat-001-analytical.md
<packet>/ai-council/seats/round-001/seat-002-critical.md
<packet>/ai-council/deliberations/round-001.md
```

### Parser Strategy

Use the same family of helpers as the deep reducers:

- `deep-research` uses `extractSection(markdown, heading)` for named `##` sections, plus list parsing.
- `deep-review` uses `extractSection()` and `extractSubsection()` to parse structured findings under severity headings.
- Council should reuse that heading-extraction approach but stop there. It should not inherit reducer state machinery.

Core helpers:

```js
function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractSection(markdown, heading) {
  const pattern = new RegExp(
    `(?:^|\\n)##\\s+${escapeRegExp(heading)}(?:\\s+[-:].*)?\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)`,
    'i',
  );
  const match = markdown.match(pattern);
  return match ? match[1].trim() : '';
}
```

Strict-required sections:

```js
const REQUIRED_SECTIONS = [
  'Council Composition',
  'Recommended Plan',
  'Plan Confidence',
];
```

Strict-required seat input:

```text
Per-seat sections OR parseable Council Composition table rows.
```

ADD-2 says "Per-seat sections" are strict-required, but packet 080's live `council-report.md` summarizes seats in `## Council Composition` and stores detailed seat reasoning in separate files. Packet 081 should accept either explicit seat sections or composition-table rows. That keeps the helper compatible with packet-080-shaped reports.

Optional sections:

```js
const OPTIONAL_SECTIONS = [
  'Strategy Comparison',
  'Winning Strategy',
  'Implementation Steps',
  'Prerequisites',
  'Dropped Alternatives',
  'Risks & Mitigations',
  'Cross-References',
  'Deliberation Notes',
  'Round-2 Addendum',
];
```

Optional-section contract:

- Missing optional sections never exit 1.
- Without `--strict-output`, omit optional-derived subfiles/sections.
- With `--strict-output`, write placeholders such as `_Not present in council output._`.

Seat extraction:

```js
function extractSeatSections(markdown) {
  const pattern = /(?:^|\n)#{2,3}\s+(Seat\s+\d+[^\n]*)\n([\s\S]*?)(?=\n#{2,3}\s+Seat\s+\d+|\n##\s|$)/gi;
  const seats = [];
  let match;
  while ((match = pattern.exec(markdown)) !== null) {
    seats.push({ title: normalizeText(match[1]), body: match[2].trim() });
  }
  return seats;
}
```

Composition-table fallback:

```js
function parseCompositionRows(sectionText) {
  return sectionText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^\|/.test(line))
    .filter((line) => !/^\|\s*-+/.test(line))
    .filter((line) => /\|\s*seat[- ]?\d+/i.test(line))
    .map(parseSeatTableRow)
    .filter(Boolean);
}
```

Parser return shape:

```js
function parseCouncilMarkdown(markdown) {
  const sections = Object.fromEntries(
    REQUIRED_SECTIONS.map((heading) => [heading, extractSection(markdown, heading)]),
  );
  const explicitSeats = extractSeatSections(markdown);
  const compositionRows = parseCompositionRows(sections['Council Composition']);
  const seats = explicitSeats.length ? explicitSeats : compositionRows.map(rowToPlaceholderSeat);
  const missing = REQUIRED_SECTIONS.filter((heading) => !sections[heading]);
  if (!seats.length) missing.push('Per-seat sections or Council Composition table rows');
  return { sections, seats, missing, optional: extractOptionalSections(markdown), sourceMarkdown: markdown };
}
```

### Artifact Rendering

Build all outputs in memory before writing:

```js
function buildArtifacts(specFolder, parsed, options) {
  const councilDir = path.join(specFolder, 'ai-council');
  const round = options.round || discoverNextRound(councilDir);
  const roundDir = `round-${round}`;

  return {
    round,
    files: [
      { path: path.join(councilDir, 'council-report.md'), content: parsed.sourceMarkdown.trimEnd() + '\n' },
      ...parsed.seats.map((seat, index) => ({
        path: path.join(councilDir, 'seats', roundDir, seatFileName(seat, index)),
        content: renderSeatFile(seat, parsed, { round, index }),
      })),
      {
        path: path.join(councilDir, 'deliberations', `${roundDir}.md`),
        content: renderDeliberation(parsed, { round, strictOutput: options.strictOutput }),
      },
    ],
    stateLines: renderStateEvents(parsed, { round }),
  };
}
```

State events should append to:

```text
<packet>/ai-council/ai-council-state.jsonl
```

Minimal event set: `round_start`, one `seat_returned` per seat, `deliberation_synthesized`, `round_end`, and `council_complete`. Add `schemaVersion: 1` immediately. It is cheap forward-compatibility and does not promote the helper into a validator.

### Exit Codes

Use exactly the requested codes:

- `0`: success. Strict-required sections and seat data parsed. Optional sections may be absent.
- `1`: parse or invocation error before artifact writes. Examples: missing packet folder, missing input, missing `Council Composition`, missing `Recommended Plan`, missing `Plan Confidence`, no seat data.
- `2`: partial-write recovery needed. Use only when at least one artifact write has happened and a later write fails.

Implementation rule: parse and render everything first, then write in deterministic order. If a write fails after earlier files landed, throw an error with `code = 'COUNCIL_PARTIAL_WRITE'` and `writtenPaths`.

CLI entry:

```js
async function main() {
  try {
    const options = parseArgs(process.argv.slice(2));
    const markdown = options.inputFile ? readUtf8(options.inputFile) : await readStdin();
    const parsed = parseCouncilMarkdown(markdown);
    validateStrictRequired(parsed);
    const result = persistArtifacts(options.specFolder, parsed, options);
    process.stdout.write(JSON.stringify({ round: result.round, filesWritten: result.files.length }) + '\n');
  } catch (error) {
    if (error.code === 'COUNCIL_PARTIAL_WRITE') process.exit(2);
    process.stderr.write(`[multi-ai-council] ${error.message || String(error)}\n`);
    process.exit(1);
  }
}
```

### Fixture-Test Layout

Add tests beside the existing validator regression:

```text
.opencode/skills/system-spec-kit/scripts/tests/
  multi-ai-council-persist-artifacts.vitest.ts
  fixtures/
    multi-ai-council/
      council-output-full.md
      council-output-minimal.md
      council-output-missing-required.md
```

`council-output-full.md`:

```md
# Council Report: Example

## Council Composition

| Seat | Strategy Lens | AI Vantage Target | Distinct Mandate | Confidence |
|------|---------------|-------------------|------------------|------------|
| seat-001 | Analytical | cli-claude-code | Check architecture symmetry | 80 |
| seat-002 | Critical | cli-codex | Attack failure modes | 86 |

## Seat 1 - Analytical

Seat 1 reasoning body.

## Seat 2 - Critical

Seat 2 reasoning body.

## Recommended Plan

Adopt orchestrator-mediated persistence.

## Plan Confidence

- Overall: 84/100

## Risks & Mitigations

- R1: Caller bypass.
```

`council-output-minimal.md`:

```md
# Council Report: Minimal

## Council Composition

| Seat | Strategy Lens | AI Vantage Target | Distinct Mandate | Confidence |
|------|---------------|-------------------|------------------|------------|
| seat-001 | Pragmatic | cli-copilot | Ship smallest helper | 82 |

## Recommended Plan

Create the CJS helper.

## Plan Confidence

- Overall: 82/100
```

`council-output-missing-required.md` should omit either `## Plan Confidence` or all parseable seat data.

Core test assertions:

```ts
it('writes report, seats, deliberation, and state JSONL from full output', () => {
  execFileSync('node', [helper, packet, '--round', '001', '--input-file', fullFixture]);
  expect(existsSync(join(packet, 'ai-council/council-report.md'))).toBe(true);
  expect(existsSync(join(packet, 'ai-council/seats/round-001/seat-001-analytical.md'))).toBe(true);
  expect(existsSync(join(packet, 'ai-council/deliberations/round-001.md'))).toBe(true);
  expect(readFileSync(join(packet, 'ai-council/ai-council-state.jsonl'), 'utf8')).toMatch(/"type":"council_complete"/);
});

it('accepts minimal output and creates placeholder seats from composition rows', () => {
  execFileSync('node', [helper, packet, '--round', '002', '--strict-output', '--input-file', minimalFixture]);
  expect(readFileSync(join(packet, 'ai-council/seats/round-002/seat-001-pragmatic.md'), 'utf8'))
    .toMatch(/Detailed per-seat reasoning was not present/);
});

it('exits 1 before writes when strict-required sections are missing', () => {
  expect(() => execFileSync('node', [helper, packet, '--input-file', missingFixture])).toThrow();
  expect(existsSync(join(packet, 'ai-council'))).toBe(false);
});
```

Also test parser exports directly: `parseCouncilMarkdown()` should report missing strict sections without touching the filesystem.

### Reducer-Derived Simplifications

Do not clone the deep reducers.

The council helper does not need:

- `findings-registry.json`
- dashboard rendering
- resource-map emission
- graph events
- convergence math
- strategy mutation
- lifecycle state machine
- YAML workflow ownership
- a dedicated `.opencode/skills/multi-ai-council/` folder

The whole job is:

```text
markdown input -> section parse -> strict-required validation -> artifact render -> file writes -> state JSONL append
```

That preserves ADR-001. The helper is shared script infrastructure under `system-spec-kit`, not a new skill.

### Packet 081 Implementation Sequence

1. Add `persist-artifacts.cjs` with exported parser/render functions and CLI entry.
2. Add fixture markdown files under `scripts/tests/fixtures/multi-ai-council/`.
3. Add `multi-ai-council-persist-artifacts.vitest.ts`.
4. Run the focused vitest file.
5. Then update §17 caller recipes and command-side invocations.

This matches ADD-6: manual invocation works before YAML wiring exists.

### Caveat For Q3

Q3 should define the shared §8 OUTPUT FORMAT artifact before packet 081 freezes parser aliases. The helper can start from the strict-required list above, but the final parser should cite one schema source so the agent body and script do not drift.

## Questions Answered

- [x] Q1: What concrete shape should the persist-artifacts.sh helper take?

## Questions Remaining

- [ ] Q2: Should §17 be added to agent body or live in a reference file?
- [ ] Q3: How should the §8 OUTPUT FORMAT shared schema artifact be expressed?
- [ ] Q4: Does validator need explicit ai-council/ awareness?
- [ ] Q5: Should skill advisor scoring include multi-ai-council triggers?
- [ ] Q6: How to automate 4-runtime mirror-sync?
- [ ] Q7: state.jsonl forward-compat / versioning strategy?
- [ ] Q8: Should /memory:save anchor council-completion events?
- [ ] Q9: ADD-1..ADD-6 risk mitigation specifics?
- [ ] Q10: Lightweight-bound revisit conditions?

## Next Focus

Q3: define the shared §8 OUTPUT FORMAT schema artifact. Q2 depends on what §17 points to, and the helper parser should reference the same schema source rather than baking section names into prose only.
