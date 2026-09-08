# Deep-Research Strategy — glm-5-3-flash-ripgrep-search-r3

Round three of the ripgrep-search lane. Five bounded iterations, one angle each, in the
order fixed by the dispatch. convergenceThreshold=3 is telemetry only (dispatch:
converge never before iteration 5; stopReason must be `maxIterationsReached`).

## Charter

- **Topic:** lexical retrieval in system-spec-kit after the memory-database decommission.
- **Role:** skeptical auditor — every claim unverified until cited; the checked-in source
  overrides every document and every self-reported success.
- **Target:** a cited defect-and-simplification ledger organized by angle, not a narrative.
- **Non-goals:** no edits; no redesign; no prose-style review; no repository-wide census.
- **Hard limits (override everything):** ≤12 tool calls per iteration; no scripts,
  harnesses, or census programs — read files, compare by hand; sample ≤8 items per larger
  set; never run validate.sh, node tooling, or git (the compiled dist directories are
  untracked and stale); never reuse an earlier count — recount or say the count was not
  retaken; an iteration that would exceed the call budget stops and records what it did
  not read as an open question.
- **Census rule:** read `research/confirmed-findings.md` ONCE, in iteration 1. Do not
  re-report a row the census marks fixed/kept/recorded unless new evidence contradicts its
  stated reason. Earlier syntheses are read only if an angle sends me there.

## Known Context (pointer-only; prior rounds not read unless needed)

- Round 1 synthesis: `.../lineages/glm-5-3-flash-ripgrep-search/research.md` (10 iterations)
- Round 2 synthesis: `.../lineages/deepseek-v4-flash-ripgrep-search/research.md` (10 iterations)
- Census: `research/confirmed-findings.md` (judged every row of both rounds)
- Remediations: `specs/system-speckit/006-retrieval-drift-remediation`,
  `specs/system-speckit/013-trigger-phrase-quality-enforcement`

## Angle → primary evidence map (fixed by dispatch)

| # | Angle | Primary sources |
|---|-------|-----------------|
| 1 | Gate 1 parity across runtimes | root instruction docs (AGENTS.md, CLAUDE.md, REPO RULES.md, .codex/AGENTS.md, .cursor/rules/*, .pi/.devin equivalents), `runtime/cli/retrieval/lookup-trigger-index.mjs` |
| 2 | doctor retrieval target | `commands/doctor/assets/doctor-speckit-retrieval.yaml`, its dispatcher, the fixture/data artifacts each check names |
| 3 | residue sweep + allowlist | `runtime/cli/retrieval/sweep-memory-residue.mjs`, `fixtures/residue-allowlist.json`, ≤8 sampled allowlisted paths |
| 4 | two boundary tables | `feature-catalog/feature-catalog.md` boundary table, `references/retrieval/retrieval-conventions.md` §1, `runtime/cli/retrieval/README.md` limits |
| 5 | authoring guidance vs judge | `runtime/cli/retrieval/lib/phrase-judge.mjs`, trigger-phrase guidance in `templates/spec-kit-docs.json` / retrieval-conventions.md §8 / sk-doc rule |

## Finding-row format (every iteration)

`path:line` on the claim side and on the actual side; claimed vs actual in one sentence
each; severity (P0 broken / P1 wrong-unused / P2 cosmetic); recommendation
(remove/merge/fix/document); ≤12 rows per iteration; a short list of what the angle
verified as correct; open questions close the pass.

## What Worked / What Failed / Next Focus

- Next Focus: **Iteration 1 — Gate 1 parity across runtimes.**
- What Worked / What Failed: recorded per iteration inside `iterations/iteration-NNN.md`
  (call budget); consolidated here at synthesis.
- Machine-readable state: `deltas/iter-NNN.jsonl` (line 1 = iteration event record carrying
  `type`, `iteration`, `newInfoRatio`, `status`, `focus`, `noveltyJustification`) + the
  mirrored append in `deep-research-state.jsonl` and `state-events.jsonl`. The append
  gateway (`append-mode-event.cjs`) cannot run in this lineage (no node tooling — hard
  limit), so the records are written directly; the runner's reducer may replay them.
