# Batch A — Consolidated doc cleanup (deep-loop-runtime release-cleanup 001-doc-remediation)

## Role

Senior skill maintainer applying surgical find-replace edits to documentation files. You operate within the deep-loop-runtime skill's documentation surface. SC-007 invariant is HARD: zero edits to `lib/`, `scripts/`, `tests/`, `storage/` of deep-loop-runtime, and zero edits to `deep-review/scripts/reduce-state.cjs`. ALL changes are mechanical text replacements + targeted JSON field updates + small additions to existing markdown files. No template freelancing.

## Context

The parent packet's Phase 5 deep-research loop surfaced 22 findings in this batch's scope. Replacement strings + target sites are pre-specified below. You are NOT discovering new gaps; you are APPLYING the documented fixes.

### Workspace

- Repo root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`
- Target skill: `.opencode/skills/deep-loop-runtime/`
- This packet: `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/001-deep-loop-runtime/001-doc-remediation/`

### Source-of-truth allow-list for DR-035 fix

`lib/coverage-graph/coverage-graph-db.ts` enforces 10 review node kinds: `DIMENSION`, `FILE`, `FINDING`, `EVIDENCE`, `REMEDIATION`, `BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, `TEST`. The current `README.md:194` lists 6 with 1 fake (`code-surface`) and 5 missing.

## Pre-plan (medium-density, 4 steps)

1. **Read targets first** to confirm exact current line content. Files: `.opencode/skills/deep-loop-runtime/{SKILL.md, README.md, lib/README.md, changelog/v1.1.0.0.md, graph-metadata.json, references/integration_points.md, references/coverage_graph_schema.md}`. Verify the `CURRENT` strings below match before applying any `REPLACEMENT`.

2. **Apply text replacements** in the order below. Use Edit tool with exact `old_string` → `new_string` match. If any `CURRENT` string does NOT match the file, STOP that one replacement and continue with the next; report all such mismatches at end.

3. **Apply structured additions** to `graph-metadata.json` (council key_topics + key_files + entities + related_to + causal_summary + source_docs additions) and `references/integration_points.md` (7 new consumer entries). Templates for these additions are pre-specified in §"Structured additions" below.

4. **Verify**: run `git diff --stat -- .opencode/skills/deep-loop-runtime/` and confirm ONLY the 7 target files appear (SKILL.md, README.md, lib/README.md, changelog/v1.1.0.0.md, graph-metadata.json, references/integration_points.md, references/coverage_graph_schema.md). Run `git diff --stat -- '.opencode/skills/deep-loop-runtime/lib/' '.opencode/skills/deep-loop-runtime/scripts/' '.opencode/skills/deep-loop-runtime/tests/' '.opencode/skills/deep-loop-runtime/storage/' '.opencode/skills/deep-review/scripts/reduce-state.cjs'` returns empty for SC-007.

## Action

Apply all replacements + structured additions below. Report which findings closed + any mismatches.

## Replacements — Cross-arc citation drift (DR-037 supersedes DR-029)

### Replacement 1: `SKILL.md` line 144 phrase A

CURRENT: `Packet 129/001 ADR-001 extends `deep-loop-runtime/lib/` with council-compatible infrastructure primitives while keeping operator-facing and domain workflow semantics in `deep-ai-council`.`

REPLACEMENT: `Packet 131/001/008 ADR-001 (Runtime Boundary Decision) extends `deep-loop-runtime/lib/` with council-compatible infrastructure primitives while keeping operator-facing and domain workflow semantics in `deep-ai-council`.`

### Replacement 2: `SKILL.md` line 144 phrase B (second drift on same line)

CURRENT: `These primitives are consumed by downstream packet 129 phases 003-006 for per-topic orchestration, multi-topic session state, command wiring, parity tests, and docs.`

REPLACEMENT: `These primitives are consumed by downstream 131/001 phases 010-013 (per-topic-multi-round, session-findings-registry, command-and-skill-wiring, parity-cost-docs) for per-topic orchestration, multi-topic session state, command wiring, parity tests and docs.`

### Replacement 3: `README.md` line 198

CURRENT: `Packet 129/001 ADR-001 extended this skill with council-compatible runtime primitives. Operator-facing semantics live in `deep-ai-council`. This skill owns the durability primitives only.`

REPLACEMENT: `Packet 131/001/008 ADR-001 (Runtime Boundary Decision) extended this skill with council-compatible runtime primitives. Operator-facing semantics live in `deep-ai-council`. This skill owns the durability primitives only.`

### Replacement 4: `README.md` line 247

CURRENT: `│   └── council/                          # 5 cjs modules (per packet 129/001 ADR-001)`

REPLACEMENT: `│   └── council/                          # 5 cjs modules (per packet 131/001/008 ADR-001)`

### Replacement 5: `README.md` line 417

CURRENT: `Packet 129/001 ADR-001 decided that durability primitives (multi-seat dispatch, round-state JSONL, adjudicator scoring, cost guards, session-state hierarchy) belong with the other deep-loop durability primitives.`

REPLACEMENT: `Packet 131/001/008 ADR-001 (Runtime Boundary Decision) decided that durability primitives (multi-seat dispatch, round-state JSONL, adjudicator scoring, cost guards, session-state hierarchy) belong with the other deep-loop durability primitives.`

### Replacement 6: `changelog/v1.1.0.0.md` line 63

CURRENT: `- 3.5 Council primitives (5 modules per packet 129/001 ADR-001)`

REPLACEMENT: `- 3.5 Council primitives (5 modules per packet 131/001/008 ADR-001)`

## Replacements — Review node kind fix (DR-035 + DR-036)

### Replacement 7: `README.md` line 194 — review node kinds

Locate the line/paragraph in `README.md` §3.4 COVERAGE GRAPH that lists review node kinds. The current text claims node kinds like `dimension, file, finding, evidence, remediation, code-surface` (6 with `code-surface` being fabricated). Replace with the source-of-truth 10-kind list.

CURRENT (likely shape): `The deep-review loop adds review nodes (dimension, file, finding, evidence, remediation, code-surface).`

REPLACEMENT: `The deep-review loop adds review nodes (DIMENSION, FILE, FINDING, EVIDENCE, REMEDIATION, BUG_CLASS, INVARIANT, PRODUCER, CONSUMER, TEST).`

If the actual file uses different surrounding text or different casing, preserve the surrounding prose and only replace the kind enumeration. The 10 kinds and their order should match `lib/coverage-graph/coverage-graph-db.ts:130-149` allow-list.

### Replacement 8: `references/coverage_graph_schema.md` line 36

Same fabrication echo. Locate the prose line at L36 that mentions `code-surface`. Replace with the 10-kind list verbatim from coverage-graph-db.ts. If line 36 is part of a different section, search for `code-surface` and apply the fix wherever it appears in the prose (the §3 authoritative table at L52-65 is already correct — do NOT touch it).

## Replacements — Cross-doc count fixes

### Replacement 9: `README.md` line 3 (frontmatter description)

CURRENT (substring): `22 vitest files`

REPLACEMENT: `27 vitest files`

### Replacement 10: `README.md` line 82 (OVERVIEW key-statistics table or similar)

If the OVERVIEW section or §3 features table has "22 vitest files" or "21 vitest files", replace with `27 vitest files` (14 unit + 7 integration + 1 lifecycle + 5 council).

### Replacement 11: `README.md` line 242 (STRUCTURE changelog tree)

CURRENT (likely shape): The changelog directory tree in §4 STRUCTURE shows only `v1.0.0.0.md`.

REPLACEMENT: Add `v1.1.0.0.md` to the changelog tree. Exact addition:

```
├── changelog/
│   ├── v1.0.0.0.md                       # Initial shipped release (arc 118 consolidation)
│   └── v1.1.0.0.md                       # Phase-1-3 release-cleanup pass
```

### Replacement 12: `README.md` line 438 (§9 RELATED DOCUMENTS table)

CURRENT: The RELATED DOCUMENTS table within this skill should reference both changelogs. Locate the row for `changelog/v1.0.0.0.md` and add a sibling row for `changelog/v1.1.0.0.md` immediately after.

REPLACEMENT: Add this row after the v1.0.0.0.md row:

```
| [`changelog/v1.1.0.0.md`](changelog/v1.1.0.0.md) | Phase-1-3 release-cleanup pass (README rewrite + 4 surgical SKILL.md edits) |
```

### Replacement 13: `README.md` §4 + §9 scenario-count consistency

The README §4 STRUCTURE tree says "18 manual-test scenarios" while §9 might claim "17 entries". Both should reflect: 17 scenarios (per the catalog count of 17 features) + 1 root playbook index = 18 files but 17 scenarios. Locate any "18 manual-test scenarios" wording and change to "17 manual-test scenarios" if it refers to scenario count (or "18 manual-test files" if it refers to file count). If both wordings exist, pick scenario-count framing consistently.

### Replacement 14: `SKILL.md` line 266 (§8 REFERENCES)

CURRENT: `- changelog: `changelog/v1.0.0.0.md``

REPLACEMENT: Two lines:
```
- changelog: `changelog/v1.0.0.0.md` (initial shipped release)
- changelog: `changelog/v1.1.0.0.md` (Phase-1-3 release-cleanup pass)
```

## Replacements — Sub-readme link omission (DR-027)

### Replacement 15: `lib/README.md` line 31

The line currently lists 2 of 3 lib/ sub-domain READMEs and omits `lib/deep-loop/README.md`. Add the missing entry.

CURRENT (likely shape): A list of 2 README references (lib/coverage-graph/README.md, lib/council/README.md) with no entry for `lib/deep-loop/README.md`.

REPLACEMENT: Add `lib/deep-loop/README.md` to the list in the same shape as the existing 2 entries.

## Structured additions

### Addition 1: `graph-metadata.json` — domains + key_topics + key_files + entities + related_to + causal_summary + source_docs

This is a JSON file. Read the current content fully first; then apply targeted JSON-aware patches:

a. `domains` field (if present at top-level): add `"council"` entry to the array.

b. `derived.key_topics` array: append the 5 council module slugs:
   - `"multi-seat-dispatch"`
   - `"round-state-jsonl"`
   - `"adjudicator-verdict-scoring"`
   - `"cost-guards"`
   - `"session-state-hierarchy"`

c. `derived.key_files` array: append 10 paths (5 lib/council/*.cjs + 5 tests/council/*.vitest.ts):
   - `"lib/council/multi-seat-dispatch.cjs"`
   - `"lib/council/round-state-jsonl.cjs"`
   - `"lib/council/adjudicator-verdict-scoring.cjs"`
   - `"lib/council/cost-guards.cjs"`
   - `"lib/council/session-state-hierarchy.cjs"`
   - `"tests/council/multi-seat-dispatch.vitest.ts"`
   - `"tests/council/round-state-jsonl.vitest.ts"`
   - `"tests/council/adjudicator-verdict-scoring.vitest.ts"`
   - `"tests/council/cost-guards.vitest.ts"`
   - `"tests/council/session-state-hierarchy.vitest.ts"`

d. `derived.entities` array: append 6 entries (5 council modules + cli-guards.cjs):
   ```json
   {"name": "multi-seat-dispatch", "kind": "module", "path": "lib/council/multi-seat-dispatch.cjs", "source": "derived"},
   {"name": "round-state-jsonl", "kind": "module", "path": "lib/council/round-state-jsonl.cjs", "source": "derived"},
   {"name": "adjudicator-verdict-scoring", "kind": "module", "path": "lib/council/adjudicator-verdict-scoring.cjs", "source": "derived"},
   {"name": "cost-guards", "kind": "module", "path": "lib/council/cost-guards.cjs", "source": "derived"},
   {"name": "session-state-hierarchy", "kind": "module", "path": "lib/council/session-state-hierarchy.cjs", "source": "derived"},
   {"name": "cli-guards", "kind": "script", "path": "scripts/lib/cli-guards.cjs", "source": "derived"}
   ```

e. `manual.related_to` array: append:
   - `"deep-ai-council"` (full path: `"skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/004-deep-ai-council"` — use whichever shape the existing entries use; mirror existing convention)

f. `derived.causal_summary` string: ensure it mentions council. If current text doesn't reference council, append a sentence: ` lib/council/ adds 5 cjs modules for multi-seat dispatch, round-state JSONL, adjudicator verdict scoring, cost guards and session-state hierarchy per packet 131/001/008 ADR-001 (Runtime Boundary Decision).`

g. `derived.source_docs` array: ensure both changelogs are listed:
   - `"changelog/v1.0.0.0.md"`
   - `"changelog/v1.1.0.0.md"`

### Addition 2: `references/integration_points.md` — 7 hidden-consumer entries

Locate the existing §"Consumers" or §"Integration Points" section that currently lists consumers (deep-review, deep-research, deep-ai-council). Add 7 new consumer entries below the existing list. Use the same row/bullet shape the file already uses.

The 7 hidden consumers are:

1. **`/deep:ask-ai-council` command files** — `.opencode/commands/deep/assets/deep_ask-ai-council_{auto,confirm}.yaml` load 3 lib/council/*.cjs modules
2. **`deep-ai-council` orchestration scripts** — `.opencode/skills/deep-ai-council/scripts/orchestrate-{session,topic}.cjs` carry 8 require() calls across 5 of 5 lib/council/*.cjs modules
3. **`/doctor` route manifest** — `.opencode/commands/doctor/_routes.yaml:88-104` with gate3_location + 4 script_invocations + 4 trigger_phrases routing to deep-loop-runtime scripts
4. **`/doctor` update command** — `.opencode/commands/doctor/update.md:28, :220, :272` references deep-loop scripts + the `.pre-doctor-update.*.bak` backup pattern
5. **`system-code-graph` playbook scenarios** — `.opencode/skills/system-code-graph/manual_testing_playbook/05--coverage-graph/009-*.md` + `010-*.md` exercise the coverage-graph scripts
6. **`system-spec-kit/mcp_server` legacy READMEs** — `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/README.md:25-68` + `.../handlers/coverage-graph/README.md` document the original-location stubs
7. **`commands/doctor` assets + deep-agent-improvement** — `.opencode/commands/doctor/assets/doctor_deep-loop.yaml` + `doctor_update.yaml` + `.opencode/skills/deep-agent-improvement/scripts/lib/README.md:26` cross-reference deep-loop runtime

Also note the cross-package vitest discovery (DR-023): `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-reducer.vitest.ts:9` imports `'../../../../deep-review/scripts/reduce-state.cjs'` — physically in mcp_server but exercises deep-review code, discovered via deep-loop-runtime's vitest glob in `vitest.config.ts:20`. Add an §"Note: cross-package test discovery" subsection covering this.

## Format

After applying all changes, return a compact JSON summary to stdout:

```json
{
  "batch": "A",
  "exit_code": 0,
  "replacements_applied": N,
  "replacements_skipped": [{"id": 1, "reason": "CURRENT did not match — actual: ..."}],
  "structured_additions_applied": ["graph-metadata.json:domains", "graph-metadata.json:key_topics", "graph-metadata.json:key_files", "graph-metadata.json:entities", "graph-metadata.json:related_to", "graph-metadata.json:causal_summary", "graph-metadata.json:source_docs", "integration_points.md:7-new-consumers"],
  "sc_007_held": true,
  "files_touched": ["..."],
  "files_NOT_touched_outside_scope": true,
  "findings_closed": ["DR-001", "DR-002", "..."]
}
```

Do not write a separate report file. Stdout JSON only.
