---
title: "Iteration 1: D1 Correctness — retrieval coverage and CLI boundaries"
trigger_phrases: []
---

# Iteration 1: D1 Correctness — retrieval coverage and CLI boundaries

## Setup and route

- review_target: `.opencode/specs/system-speckit/052-memory-decommission-landing`
- review_target_type: `spec-folder`
- review_dimensions: `all`
- spec_folder: `.opencode/specs/system-speckit/052-memory-decommission-landing`
- execution_mode: `AUTONOMOUS`
- lineage_mode: `auto`
- target_agent: `deep-review`
- agent_definition_loaded: `true`
- resolved_route: `Resolved route: mode=review target_agent=deep-review`

## Focus

Dimension: correctness. The slice covers the ripgrep recipes, their retrieval contract, the trigger-index reader and artifact gate, the zvec hidden-path precedent, and focused tests. The review asks whether the advertised `.opencode` root is complete and whether CLI input validation and fail-closed behavior match the public contract.

## Scorecard

- Dimensions covered: correctness
- Files reviewed: 13
- New findings: P0=0 P1=1 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0
- Scope inventory: 438 paths in `scratch/review-scope.txt`; this iteration reviewed 13 listed paths

## Findings

### P0, Blocker

- None.

### P1, Required

- **F001 — Free-text ripgrep recipes omit hidden documentation beneath the advertised `.opencode` root.** `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/rg-lane.mjs:28-43]` The shared recipes search `specs` and `.opencode` but never pass `--hidden`. The retrieval contract calls this lane a scan over the corpus and defines `specs .opencode` as the Everything scope `[SOURCE: .opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:36-38,141-145]`. The sibling zvec lane explicitly documents that omitting `--hidden` drops the dotted `.opencode` tree and adds the flag `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/zvec-lane.mjs:636-642]`. Negative control: the wrapper returns exit 1/no-match for `daemon-backed plugin bridge`, while the same literal search with `--hidden` finds `.opencode/skills/.state/goal/README.md:101`; the default and hidden Markdown inventories differ (8,594 versus 8,601 files). This is a silent completeness failure for an advertised exhaustive free-text lane and can make retrieval disagree with the indexed corpus.
  - Recommendation: add `--hidden` to every free-text recipe, or narrow the documented corpus and add an explicit, tested exclusion policy for dotted paths. Add a regression fixture proving a nested dotted Markdown file is either intentionally excluded or returned.

### P2, Suggestion

- **F002 — `lookup-trigger-index.mjs` accepts malformed `--limit` values despite declaring a non-negative integer.** `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs:254-261]` The parser uses `Number.parseInt(value, 10)` and checks only finiteness and non-negativity. A direct read-only invocation with `--limit 2junk` exits 0 and returns two rows; `--limit 1.9` exits 0 and returns one row. The usage and error text promise <n> as a non-negative integer, so malformed input is silently coerced rather than rejected. `--limit -1` correctly exits 2, which confirms the missing check is specifically the integer/whole-token grammar.
  - Recommendation: validate the raw value as a decimal integer before conversion (or use `Number` plus `Number.isInteger`) and add CLI cases for suffixes, decimals, exponent notation, whitespace, zero and negative values.

## Claim adjudication

```json
{
  "findingId": "F001",
  "claim": "The free-text ripgrep lane silently omits nested dotted documentation while advertising .opencode as an Everything root.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/scripts/retrieval/lib/rg-lane.mjs:28-43",
    ".opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:36-38",
    ".opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:141-145",
    ".opencode/skills/system-spec-kit/scripts/retrieval/zvec-lane.mjs:636-642"
  ],
  "counterevidenceSought": "Compared the shared recipe flags with the zvec and residue-sweep lanes, counted default versus hidden Markdown inventories, and ran the same literal query through the wrapper and an explicit hidden search.",
  "alternativeExplanation": "Dotted runtime directories might be intentionally outside the corpus. Rejected for the current contract: the free-text lane advertises .opencode as the Everything root, while no exclusion for .state is declared in the recipe or contract and the trigger-index walker includes these files.",
  "finalSeverity": "P1",
  "confidence": 0.97,
  "downgradeTrigger": "If the contract explicitly narrows .opencode to a documented non-hidden subset and the index corpus applies the same exclusion, downgrade to documentation-only drift.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery with negative control" }
  ]
}
```

```json
{
  "findingId": "F002",
  "claim": "The lookup CLI accepts suffixes and fractions as valid limits even though the public contract requires a non-negative integer.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs:254-261"
  ],
  "counterevidenceSought": "Ran the CLI with 2junk, 1.9 and -1. The first two were accepted and truncated; the negative value was rejected.",
  "alternativeExplanation": "The parser may intentionally accept JavaScript numeric prefixes. Rejected because its own error says non-negative integer and the invocation is a public command boundary.",
  "finalSeverity": "P2",
  "confidence": 0.99,
  "downgradeTrigger": "If the CLI contract is changed to document prefix parsing and callers never rely on strict limits, retain as a documentation advisory only.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P2", "reason": "Initial discovery with direct CLI probes" }
  ]
}
```

## Search and ruled-out checks

- The trigger-index reader/generator share `assertTriggerIndexShape`; malformed posting types, empty postings, out-of-range path IDs and schema-version drift are rejected `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/artifact.mjs:145-190]` and are covered by focused tests `[SOURCE: .opencode/skills/system-spec-kit/scripts/tests/trigger-index.vitest.ts:638-680]`. No new finding there.
- The ripgrep wrapper preserves exit 2+ as an error and does not parse failed stdout `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/rg-wrapper.mjs:187-214,300-322]`; focused tests cover missing roots `[SOURCE: .opencode/skills/system-spec-kit/scripts/tests/rg-wrapper-recipes.vitest.ts:136-149]`. No execution-status conflation finding in this slice.
- JSONL parser diagnostics are surfaced as `unparsedLines` in wrapper, sweep and parity records `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/rg-wrapper.mjs:206-210,282; .opencode/skills/system-spec-kit/scripts/retrieval/sweep-memory-residue.mjs:353-368,457]`; the focused parser test expects one malformed line to be counted `[SOURCE: .opencode/skills/system-spec-kit/scripts/tests/parity-check.vitest.ts:446-453]`. Deferred whether callers should fail closed on a non-zero diagnostic count.

## Traceability checks

- `spec_code`: partial. The retrieval replacement and its bounded source paths are documented in the target context, but the free-text contract has the hidden-path mismatch (F001). Repository-level validation was not run because the requested lineage write surface forbids its output paths.
- `checklist_evidence`: blocked for this iteration. No root `checklist.md` exists and the authoritative validator/checklist tooling was intentionally not invoked.

## Adversarial self-check

- Hunter: compared all three relevant recipe families and ran a hidden-path negative control; probed strict and malformed limit forms.
- Skeptic: F001 is not inferred from a missing flag alone—the wrapper/no-match versus explicit-hidden match proves the omission on this checkout. F002 is P2 because it affects input contract fidelity, not an observed data-loss path by itself.
- Referee: no P0. F001 remains P1 because the advertised exhaustive search silently returns no result for a reachable Markdown document; F002 remains P2.

## Next dimension

D2 Security — trust boundaries, path/command handling, preserved embedding and IPC surfaces, and hook/process safety.

Review verdict: CONDITIONAL
