---
title: "Implementation Summary: Phase 3: playbook-catalog-truth"
description: "A ten-iteration deep-research run found that the repository already owns most of the self-check playbooks and catalogs need, and recommends wiring and small in-place extensions rather than new machinery."
trigger_phrases:
  - "playbook catalog truth implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/003-playbook-catalog-truth"
    last_updated_at: "2026-10-11T17:35:00Z"
    last_updated_by: "deep-research-orchestrator"
    recent_action: "Ran ten deep-research iterations and wrote the checked synthesis with ten ranked recommendations"
    next_safe_action: "Plan the fix phase from research.md R1 to R7"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/deep-research-state.jsonl"
      - "goal.md"
    session_dedup:
      fingerprint: "sha256:1920bba8246a41bf540c883ae34a63935926011c0944f60600dfc39328ff4132"
      session_id: "scaffold-003-playbook-catalog-truth"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Where playbook scenarios and catalog entries drift from the code, and what catches it"
      - "The lightest self-check the two modes and their validators can run"
      - "Which drift classes that check would still miss"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-playbook-catalog-truth |
| **Completed** | 2026-10-11 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You now have a checked answer to how playbook scenarios and catalog entries can test themselves against the code. The short version: the repository already has the checker. A citation scanner resolves every `path:line` in both corpora in under five seconds and finds live drift today, and the catalog package validator runs green across all 29 packages. Neither runs in CI.

### Phase 3: playbook-catalog-truth

The run found eight drift classes, each with a live instance or a remediated one. Examples: past-end line anchors in a deep-research scenario, a catalog anchor pointing at an import line instead of the constant it names, a scenario naming a command file that moved to another directory, and a truncated expected warning. `research/research.md` ranks ten recommendations. Six extend existing checkers in place: run the scanner and the catalog validator in CI, let the validator read two-column `File` tables, add the skill `runtime/` base to the scanner's resolver, print the scanner's existing identifier-overlap verdict, and resolve backticked paths in scenarios. One corrects the live drift by hand. Three say build nothing, because the producer, the scenario run and the compiled-route admission step already cover options, expected answers and router answers.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/` | Created | Loop config, state log and ledgers, strategy, registry, ten iterations and deltas, dispatch receipts, resource map and the checked synthesis `research.md` |
| `spec.md` | Modified | The workflow's bounded pre-init note and the generated findings fence under Open Questions |
| `goal.md`, `tasks.md`, `implementation-summary.md` | Modified | Log, task state and this summary |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator executed the `/deep:research` auto YAML step by step for the bound packet. Each of the ten iterations ran through the YAML's cli-pi branch on `llmgateway/deepseek-v4.1-flash` at `--thinking max`, and each passed `verify-iteration.cjs` on its first dispatch. DevPass never reported a usage limit, so the Cline Pass fallback was not used. After the loop the orchestrator read every iteration, re-ran the scanner census, the catalog validator and `--advise` itself, read every path:line cited in the recommendation rows, and corrected the lineage where the tree disagreed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Recommend wiring the existing scanner before any new check | It already covers both corpora, makes no model call and reports two past-end anchors today |
| Build nothing for option and expected-answer checks | `create.sh` rejects unknown options at run time, about a dozen expected blocks hold a literal transcript, and a naive flag check fails on the flagship scenario |
| Reuse `flagByIdentifierOverlap` instead of a new token-at-line function | The function exists and reaches prose bullets and bare-relative paths the catalog validator never reads |
| Prepend the child-dispatch preamble to each rendered prompt | `cli-pi` SKILL.md rule 11 requires it; the prompt pack alone does not carry it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Iteration records in `research/deep-research-state.jsonl` | PASS: 10 |
| Recommendation rows / rows without path:line / rows without a named move | PASS: 10 / 0 / 0 |
| Every evidence-column path:line read by the orchestrator | PASS: 22 full-path citations resolve; one is the stale citation quoted as written |
| Spot-checks against the tree | PASS: suffix strip at `validate_catalog_package.py:593`, no workflow names the scanner or the catalog validator, `create.sh:1637` against the truncated Expected line, `spec-folder-mutex.ts:22`, `advisor-tool-schemas.ts:268`, two-column skip at `validate_catalog_package.py:306` |
| `check-goal.cjs` | PASS: 5/5 |
| Strict validation | Recorded in `goal.md` after the final run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Executor provenance is lost from the state log.** The workflow patches each iteration record with an `executor` block by direct write, and the gateway's next projection refresh drops it. The ten dispatch receipts in `research/dispatch-receipts/` still name the route for every iteration.
2. **Two counts are the lineage's own.** The 273 false absences in option attribution and the 3.5 percent residual for backticked tokens were not rerun by the orchestrator, and `research.md` marks them so.
3. **No fix was made.** Every recommendation, including the live drift corrections, is for a later phase.
<!-- /ANCHOR:limitations -->
