---
title: "Implementation Summary"
description: "A deep review's three terminal gates are now computed by a script from the run's config, state log and registry, and the review workflow records that result instead of the loop agent's judgment, failing closed when the script errors."
trigger_phrases:
  - "terminal gates script implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/007-agent-alignment-follow-ups/024-terminal-gates-script"
    last_updated_at: "2026-11-15T18:14:00Z"
    last_updated_by: "generate-context"
    recent_action: "Built and verified phase 24"
    next_safe_action: "Run the stop path proofs in child 025"
    packet_purpose: "Purpose: The recorded terminal gates are computed from the run's state, so the verdict no longer rests on the loop agent's judgment."
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:4d55627f68b840e7af749d1c5652db5384d9795521710cdfdfc0844d5d8e38b8"
      session_id: "scaffold-024-terminal-gates-script"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "a84f4eed-26f9-49ac-91eb-e2375c207e96"
      workspace: "/Users/michelkerkmeester/worktrees/public/384-agent-alignment-follow-ups"
      savedAt: "2026-11-15T18:14:00Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 024-terminal-gates-script |
| **Completed** | 2026-11-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

When a deep review stops, its evidence, scope and coverage gates now come from a script, so the session verdict no longer rests on the loop agent's reading of a prose rule. If the script fails, the step records all three gates as failed.

### Phase 24: terminal-gates-script

`terminal-gates.cjs` builds the review facts with the same `buildStopDecisionInput` the stop decision uses. It takes evidence from `evidenceDensityGate` and coverage from `dimensionCoverageGate`, and computes scope by matching each open finding's file against the config's `reviewScopeFiles`. An absolute finding path from another checkout matches by its tail; a relative path must match an entry or sit under a directory entry. Findings with no recorded scope fail as `scope-unrecorded`. Each row carries the sha256 of the summary it was decided from. `record_terminal_gates` in `deep-review.yaml` now runs the script, keeps its ledger append, and binds three failing rows on a script error.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/scripts/terminal-gates.cjs` | Created | Gate computation and CLI |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/terminal-gates.vitest.ts` | Created | 11 cases: each gate passing and failing, digests, CLI |
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Modified | Exports `readJsonObjectFile` and `readStateLogRows` |
| `.skilled/commands/deep/assets/deep-review.yaml` | Modified | `record_terminal_gates` runs the script |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown` | Regenerated | Source digest |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash at `--thinking max` through cli-pi built three tasks, one per dispatch, and the conductor read every diff. Review of the script found the suffix rule admitting a relative path such as `.skilled/other/README.md` against the entry `README.md`. A third dispatch limited the suffix match to absolute paths and added a test that fails on the old rule.

Before wiring, the script ran on 40 recorded review packets: each returned three rows with no error. Coverage failed in nearly all of them because their iterations never recorded the `spec_code` and `checklist_evidence` traceability results the rule needs, and scope failed in about half, mostly on scope lists holding prose or globs. The operator chose to wire the script strictly anyway (decision record).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Wire the script strictly now | The operator chose it on 2026-11-15; verdicts follow the contract exactly |
| A separate script, not a mode inside `convergence.cjs` | That script's entry point needs a session namespace and opens the coverage graph; the gates need neither |
| Fail scope when findings exist but no scope was recorded | A missing list cannot show the findings were in scope |
| Fail closed on a script error | A gate nobody computed must not pass |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `terminal-gates.vitest.ts` | PASS: 11 of 11 |
| Runtime suite | PASS: 178 files, 3,035 passed, 9 skipped (baseline 177 files, 3,024 passed; the +11 are the new file) |
| `npm run typecheck` | PASS: exit 0 |
| `check-contract-drift.cjs` | PASS: `OK commands=2` |
| spec-kit `deep-review-contract-parity.vitest.ts` | PASS: 12 of 12 |
| Script on 40 recorded review packets | PASS: three rows each, no error |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Most reviews will now FAIL on coverage.** Review iterations rarely record `traceabilityChecks` results for the core protocols, so the coverage gate fails until they do. The fix belongs in the deep-review iteration contract.
2. **Unclean scope lists fail scope.** Some runs record prose, brace globs or another checkout's absolute paths in `reviewScopeFiles`. The fix belongs in the scope step at init, which should record plain repo-relative paths.
3. **The verdict step itself is still prose.** The workflow reads the recorded gates into the verdict by instruction; phase 25 tests that chain.
<!-- /ANCHOR:limitations -->

---
