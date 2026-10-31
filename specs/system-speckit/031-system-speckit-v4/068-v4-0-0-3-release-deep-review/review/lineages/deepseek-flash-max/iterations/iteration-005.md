---
title: "Deep Review Iteration 005 — spec-kit retrieval and trigger index"
trigger_phrases: []
---

# Iteration 5: Correctness — retrieval and trigger index

## Focus

Dimension: **correctness**. Slice: the retrieval lane — `runtime/cli/retrieval/lookup-trigger-index.mjs`
(index loading, scope filter, scoring, CLI exit contract), `generate-trigger-index.mjs` and its
`--check` mode, `lib/freshness.mjs` (the one staleness definition shared by save and check), and
`lib/corpus.mjs` (corpus roots and exclusions). Executed read-only controls: the lookup CLI on a
known query, the generator's `--check` mode, and two phrase lookups against the release changelog.

## Files Reviewed

- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` (lines 77-340)
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` (header, `checkIndex`, CLI, lines 1-103, 509-680)
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/freshness.mjs` (full, 1-81)
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs` (roots and exclusions, lines 30-175)
- `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` (committed artifact; read through the loader)
- `.github/workflows/advisory-checks.yml` (trigger-index step, lines 55-68)
- Git history: the index rebuild and the changelog commits between it and `v4.0.0.3`

## Findings

### P0 Findings

None.

### P1 Findings

None new. Carried: F001 and F002 remain active (unchanged this iteration).

### P2 Findings

- F004 — The v4.0.0.3 release shipped with a trigger index stale for its own changelog entry — `.skilled/changelog/skilled/v4.0.0.3.md` against `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` — The last commit in the range that touched the index is `903c983c39` (2026-10-05, "rebuild the trigger index after rebasing onto main"). Six later commits rewrote the changelog entry's title and trigger phrases (`80dba263f0`, `e52309a715`, `c93029d4d0`, `40e2cb521a`, `3d5e502e74`, `bebcf9c349`, `364d74b502`), and no commit after then rebuilt the index: the index blob at the tag equals the blob at HEAD (`6dfeb68c81`). The repo's own checker says so on the tagged tree: `generate-trigger-index.mjs --check` exits 1 with `.skilled/changelog/skilled/v4.0.0.3.md` stale (`added: ["doctor update command"]`, `removed: ["doctor command split"]`). Observed consequence, both lookups executed read-only: querying the current phrase `doctor update command` returns two older spec docs and never the changelog entry, while the stale phrase `doctor command split` still returns the changelog entry at score 1.0. The CI step that runs the same check is `continue-on-error: true`, so the drift stayed advisory and green (`.github/workflows/advisory-checks.yml:55-68`). The packet docs the same check also reports stale (`specs/.../068-.../*.md`) are branch-local: they do not exist at the tag, so they are not part of this finding.

  Finding class: `cross-consumer`
  Scope proof: Compared the tagged index blob with HEAD's, listed the commits that touched the index and the changelog inside the range, ran the repo's own `--check` (exit 1), and executed both phrase lookups against the shipped index. The finding is scoped to the tagged release; branch-local packet docs are excluded explicitly.
  Affected surface hints: [`.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`, `.skilled/changelog/skilled/v4.0.0.3.md`, `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs`]

## Claim Adjudication

No new P0/P1; F004 is an advisory with an executed reproduction. Counterevidence considered: is the staleness caused by this review run? No — the flagged changelog entry and the index blob both predate the run (the index blob is identical at `v4.0.0.3` and at HEAD), and the only stale documents added by this run's work are the branch-local packet docs, which are excluded from the finding.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pending | Full traceability pass scheduled for iteration 8. |
| `checklist_evidence` | pending | Scheduled with the same pass. |

## Ruled Out

- "The lookup's scope filter can match a sibling folder by prefix": ruled out — `specFolderMatches` cuts at the last slash and tests folder equality or a `/`-boundary prefix (`lookup-trigger-index.mjs:107-111`), so `specs/a` cannot capture `specs/ab`.
- "The lookup CLI's exit contract contradicts the retrieval convention": ruled out — exit 0 with rows, 1 with no rows (a clean no-hit), 2 on a bad invocation or unreadable index (`lookup-trigger-index.mjs:312-336`), matching the convention quoted in the deep-review agent contract.
- "A malformed index can be silently half-read": ruled out — `loadIndex` runs the same shape assertion the generator enforces at publish time and refuses to return a partial result (`lookup-trigger-index.mjs:81-92`).
- "The generator and the checker can disagree on what stale means": ruled out — both import `compareDocumentPhrases`/`indexedPhrasesFor` from `lib/freshness.mjs`, which documents itself as the single definition (`freshness.mjs:4-8`); the checker rebuilds the corpus and compares against the committed index (`generate-trigger-index.mjs:533-556`).
- "The corpus walk indexes review artifacts and inflates the corpus": ruled out — `specs/**/lineages/**` is excluded (`lib/corpus.mjs:66`), which is why this lineage's own iteration files do not appear in the check report.

## Dead Ends

- Regenerating the index to verify the fix direction: not attempted — the generator writes the committed artifact, which is outside the lineage write surface.

## Assessment

- New findings ratio: 1.0 (one new P2; weighted new = weighted total = 1)
- Dimensions addressed: correctness
- Novelty justification: this slice executed the retrieval lane rather than only reading it. The lookup and scope logic read clean; the executed checker and two phrase lookups produced the one new finding (F004) with a reproducible miss and a reproducible stale hit.

## Next Focus

Dimension: security. Focus area: spec-kit hooks and trust boundaries (`runtime/hooks/lib/spec-gate/**`, per-runtime adapters, `completion-evidence-sentinel.cjs`, hook registration sync) plus environment precedence in `hook-flags`. Required evidence: file:line for every gate decision path; no suite execution. Rotations status: security slice 2 of 2.

Review verdict: CONDITIONAL
