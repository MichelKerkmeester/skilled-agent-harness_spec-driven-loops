---
title: "Implementation Summary"
description: "The .skilled layout is decided: one relative .opencode -> .skilled link, a frozen 25-step cutover with checks and rollbacks, and a keep-list, all accepted after a GPT-5.6 review whose seven findings were applied."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/004-migration-design"
    last_updated_at: "2026-09-16T20:45:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Resolved the layout and accepted the cutover design"
    next_safe_action: "Start phase 005 gate and CI readiness"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-004-migration-design"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-migration-design |
| **Completed** | 2026-09-16 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The migration now has a decided shape and a frozen order. `.opencode` becomes one tracked relative link to `.skilled`. That is the only layout under which every runtime phase 003 probed keeps working, including the three opencode plugins that import packages. Phases 005 to 011 run a 25-step cutover. Every step has a runnable check and a rollback, and two boundaries after which recovery is a push: step 5 for the compatible bands, step 24 for the moved tree.

### Phase 4: migration-design

A second model family reviewed the design and found seven gaps, three of them blocking, and all seven were fixed before acceptance:
- **Hooks during the landing:** the global hooks are bridged through regular-file copies for the whole landing, because git skips a dangling hook silently.
- **Hermes:** its launcher argument stays on `.opencode`, because consumer projects expose only that name.
- **Forward fix:** a revert archives and restores ignored state.
- **Backups:** step 18 proves them before anything moves.
- **Rollbacks:** steps 22 and 23 reverse the home changes in order.
- **Step 11:** it checks the commit, not only the index.
- **Boundaries:** step 5 is recorded as the first distributed boundary.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `decision-record.md` | Modified | ADR-001 resolved to L1 with every probe verdict, ADR-002 boundaries, ADR-003 keep-list K1 to K13, review adjudication; all Accepted |
| `plan.md` | Modified | Step 11 L1-only with a post-commit check, bridge in steps 19 and 20, Hermes kept in step 21, rollbacks for 22 to 24, probe crosswalk, traceability and critical path updates |
| `spec.md` | Modified | Answered open questions, risk and blocker classes, status Complete |
| `evidence/hook-opencode-lines.md`, `ci-workflow-root-surface.md`, `gitignore-root-rules.md`, `hand-made-link-targets.md` | Created | E1 to E4, verified against direct counts |
| `review/design-review-brief.md`, `review/gpt-5-6-sol-design-review.md` | Created | The GPT-5.6 review and its brief |
| `scratch/briefs/*.md` | Created | The dispatch briefs the evidence files cite |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator read the nine phase 003 records, resolved the decision tree, and fixed the layout-dependent lines. DeepSeek V4.1 Flash on cli-pi ran four read-only evidence units, which were checked against direct counts: E1 missed three `pre-commit` lines and E2 returned empty twice for ten workflows, and both gaps were filled from source and logged. GPT-5.6 sol at `xhigh` on cli-codex reviewed the resolved design read-only in 428 seconds. The orchestrator opened each finding's evidence, accepted all seven, applied them, and then set ADR-001 to ADR-003 to Accepted.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| L1, one `.opencode -> .skilled` link | Probes P1 and P3 pass for it; per-entry links break package-importing plugins |
| Hooks bridged for the landing | Git skips a dangling hook silently, and the landing replaces hook targets one file at a time |
| Hermes launcher argument kept on `.opencode` (K13) | It resolves per project, and consumer projects expose only `.opencode`; the parent criterion 6 was amended to allow ADR-003 kept paths |
| Step 5 recorded as a distributed boundary | Published compatible bands already need pushed reverts |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `grep -c '\*\*Check\*\*' plan.md`, `grep -c '\*\*Rollback\*\*' plan.md` | 25 and 25 |
| Cutover commands through `bash -n` | 75 extracted, 0 failures |
| Ten sampled citations | all open to the claimed text |
| Naming guard since `728c4f3efc` | PASS |
| Review findings ruled | 7 of 7, all accepted and applied |
| Strict validation | recorded in `goal.md` log |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two UNKNOWNs remain by design.** The Codex trust entry's target is settled in step 21, and home state on other machines needs its own enumeration there.
2. **Step 22's duration is estimated, not measured.** Phase 010 records the real figure.
<!-- /ANCHOR:limitations -->

---


