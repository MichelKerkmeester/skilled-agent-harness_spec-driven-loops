---
title: "Iteration 1: D1 Correctness — retrieval recipe parity and CLI boundaries"
trigger_phrases: []
---

# Iteration 1: D1 Correctness — retrieval recipe parity and CLI boundaries

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
- executor: `cli-codex model=gpt-5.6-luna`
- nested_dispatch: `false`

## Focus and method

Correctness review of the current ripgrep lane, public wrapper, convention recipes and focused wrapper tests. The scope source contains 438 paths; this pass directly reviewed eight listed source or test paths and used a read-only module import as a negative control. No target files were changed and no repository validator or test runner was invoked because the user-bound lineage is the entire write surface.

## Scorecard

- Dimensions covered: correctness
- Files reviewed: 8
- New findings: P0=0 P1=1 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0
- Convergence: score 0, threshold 3; telemetry only under `max-iterations`

## Findings

### P0, Blocker

- None.

### P1, Required

- **F001 — The public ripgrep wrapper is out of parity with the hidden-document retrieval lane.** The wrapper's `GLOBS` at `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/rg-wrapper.mjs:68-76]` omits both `--hidden` and the `.git` exclusion, and all three wrapper builders reuse that set at `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/rg-wrapper.mjs:91-119]`. The shared lane explicitly makes `--hidden` and `!**/.git/**` part of its common recipe at `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/rg-lane.mjs:28-47]` and uses those flags for structured, path and count searches at `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/rg-lane.mjs:85-118]`. The wrapper advertises `assertRecipeParity` as the guard against running different searches under one name at `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/rg-wrapper.mjs:128-154]`, while its focused test expects no divergences at `[SOURCE: .opencode/skills/system-spec-kit/scripts/tests/rg-wrapper-recipes.vitest.ts:108-110]`. Read-only import evidence returned three divergences, one for each recipe, with the lane vectors containing `--hidden` and `!**/.git/**` and wrapper vectors missing them. A hidden Markdown file beneath `.opencode` is therefore silently outside the wrapper's default corpus, and the wrapper cannot satisfy the shared lane's documented corpus contract.`
  - Recommendation: centralize the wrapper builders on the shared lane flags or add the exact hidden and `.git` flags to every wrapper recipe, then make the parity test fail on any drift. Add a fixture containing a nested dotted Markdown path and a `.git` path so completeness and exclusion are both proven.

### P2, Suggestion

- **F002 — The copyable retrieval recipes omit the mandatory `.git` exclusion.** The convention says `--hidden` and the `.git` exclusion are mandatory at `[SOURCE: .opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:71-76]`, but each structured, path-only and count command at `[SOURCE: .opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:83-107]` includes `--hidden` without `--glob '!**/.git/**'`. This is a separate manual-consumer surface from F001: a reader copying the documented commands can search hidden repository internals even though the shared executable lane excludes them. The context/anchor examples repeat the same omission at `[SOURCE: .opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:114-125]`.
  - Recommendation: add the `.git` exclusion to every copyable recipe, including context and anchor examples, and add a documentation parity check against the executable recipe vectors.

- **F003 — The wrapper silently discards positional arguments after the phrase.** `parseArgs` accumulates all non-flag tokens but destructures only `[recipe, phrase]` at `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/rg-wrapper.mjs:236-263]`; it neither rejects nor joins additional positional tokens. A read-only import of `parseArgs(['path', 'foo', 'bar'])` returned `{recipe:'path', phrase:'foo', roots:['specs','.opencode']}` with `bar` lost. The usage contract shows one `<phrase>` argument at `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/rg-wrapper.mjs:29-33]`, and the focused parser tests cover valid multi-word phrases only when already passed as one token at `[SOURCE: .opencode/skills/system-spec-kit/scripts/tests/rg-wrapper-recipes.vitest.ts:188-204]`. This turns a common unquoted CLI invocation into a successful search for a different phrase.
  - Recommendation: reject `positional.length > 2` with a usage error, or explicitly join the remaining tokens and document that shell behavior; add a regression test for an extra positional token.

## Claim adjudication

```json
{
  "findingId": "F001",
  "claim": "The public ripgrep wrapper silently searches a different corpus from the shared hidden-document lane.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/scripts/retrieval/rg-wrapper.mjs:68-119",
    ".opencode/skills/system-spec-kit/scripts/retrieval/lib/rg-lane.mjs:28-47,85-118",
    ".opencode/skills/system-spec-kit/scripts/tests/rg-wrapper-recipes.vitest.ts:108-110"
  ],
  "counterevidenceSought": "Compared every wrapper recipe with its shared-lane counterpart and imported the builders and parity checker directly; the checker returned three divergences.",
  "alternativeExplanation": "The wrapper might intentionally search a public-only corpus. Rejected for this packet because the wrapper's own parity contract compares it with the shared lane, its default roots include .opencode, and no alternate corpus is declared.",
  "finalSeverity": "P1",
  "confidence": 0.99,
  "downgradeTrigger": "If the wrapper contract is explicitly narrowed to a non-hidden corpus and its parity assertion is changed to compare against that intentionally different lane, downgrade to contract/documentation drift.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Direct parity divergence plus reachable hidden-document completeness gap" }
  ]
}
```

## Search and ruled-out checks

- The shared lane does include the hidden and `.git` controls at `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/rg-lane.mjs:28-47]`; the current defect is the public wrapper and copyable documentation, not a re-report of the repaired shared-lane omission.
- The wrapper preserves execution errors rather than treating them as clean misses at `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/rg-wrapper.mjs:180-210,303-323]`; no new exit-status conflation finding was opened.
- The recipe tests cover output-mode exclusivity, `--no-config`, hyphen-leading phrases, clean misses and bad roots at `[SOURCE: .opencode/skills/system-spec-kit/scripts/tests/rg-wrapper-recipes.vitest.ts:87-149]`. They do not currently protect hidden/.git parity or extra positional rejection.

## Traceability checks

- `spec_code`: partial. The packet's retrieval/decommission claims can be checked against the current sources, but F001 shows the wrapper does not implement the shared retrieval contract.
- `checklist_evidence`: blocked. No root `checklist.md` exists and the authoritative validation/checklist commands were not run under the lineage-only write constraint.
- `feature_catalog_code`: not applicable to this focused pass.
- `playbook_capability`: not applicable to this focused pass.

## Adversarial self-check

- Hunter: compared all three wrapper recipes with all three shared-lane recipes, then inspected the copyable command variants and parsed a deliberately overlong positional vector.
- Skeptic: F001 is not inferred solely from missing flags; the imported `assertRecipeParity` result supplied three observed divergences. F002 is independent because it affects users of the prose commands even if the executable wrapper is fixed. F003 is P2 because the documented interface expects one phrase token, but silent successful truncation is still an input-boundary defect.
- Referee: no P0. F001 remains P1 because the public front door silently omits reachable live documentation and its own parity guard is currently contradicted. F002 and F003 remain P2.

## Next dimension

D2 Security — embedding HTTP authorization, remote-bind controls, IPC trust boundaries and process supervision.

Review verdict: CONDITIONAL

