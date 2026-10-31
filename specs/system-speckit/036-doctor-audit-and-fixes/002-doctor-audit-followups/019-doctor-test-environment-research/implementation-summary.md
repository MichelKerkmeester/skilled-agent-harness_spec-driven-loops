---
title: "Implementation Summary"
description: "A two-lineage deep research run produced a cited plan for both doctor contract fixes and for a long-lived local /doctor:update test environment, plus the list of doctor scenarios to move onto it."
trigger_phrases:
  - "doctor test environment research summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-doctor-audit-followups/019-doctor-test-environment-research"
    last_updated_at: "2026-10-04T17:45:00Z"
    last_updated_by: "doctor-test-environment-research"
    recent_action: "Merged the DeepSeek and LUNA lineages into research.md"
    next_safe_action: "Operator picks the worktree name and whether a second environment is built; then implement the fixes and the environment"
    blockers: []
    key_files:
      - "specs/system-speckit/049-doctor-audit-followups/019-doctor-test-environment-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-test-environment-research"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Worktree name: allocator-numbered with a symlink, or the exact requested name"
      - "A second long-lived environment for the non-update suites"
    answered_questions: []
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
| **Spec Folder** | 019-doctor-test-environment-research |
| **Completed** | 2026-10-04 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The two doctor contract gaps and the `/doctor:update` test environment now have a cited plan. `research/research.md` gives each fix, the environment's fixtures and reset, the scenarios to change and the order to build it in.

### Phase 19: doctor-test-environment-research

- **`/doctor:speckit`.** Report phrase quality as an advisory outside `severity_max`, so a fresh index reports OK. The YAML's reason for the old rule, that flagged phrases never rank, is wrong.
- **`/doctor:mcp`.** Add an `unknown_flag` error and keep the cross-sub-action error.
- **`/doctor:update` environment.** A worktree from `v4.0.0.0` with the current updater overlaid and four committed fixtures, one per unit status. sk-code gets a derived `sk-code-web-dev` packet rather than losing its modes, and sk-git is replaced by the Barter snapshot.
- **Other suites.** They test current code, so they belong in a current-code environment. DOC-370 stays on a disposable clone because a linked worktree shares the main checkout's `.git/config`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/` | Created | Fan-out config, two lineages, merged registry, attribution, resource map and `research.md` |
| `spec.md` | Modified | Phase content and the generated findings block under Open Questions |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The `/deep:research:auto` fan-out ran two lineages one at a time. LUNA 6 at max effort, fast tier, through cli-codex ran two iterations. DeepSeek V4.1 Flash first failed six times on the opencode-go route, which answered `This Go model requires Global regions`, a setting in the operator's workspace. It then ran three iterations through Cline, where its top thinking tier is `xhigh`. `fanout-merge.cjs` merged the registries, and the orchestrator checked each load-bearing claim against the source before writing the merged report.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Side with the DeepSeek scoping over moving all 27 scenarios onto the updater fixture | The updater fixture sits on `v4.0.0.0` with sk-git replaced, while the other suites test current code |
| Leave the worktree name to the operator | The requested name falls outside the sk-git allocator grammar, which the operator's request overrides only by explicit choice |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Lineages | DeepSeek 3 of 3 and LUNA 2 of 2 iterations, both `research.md` written; fan-out merge `status: ok`, 2 lineages, 25 key findings |
| Claim checks | Shared worktree config, index enumeration, dirty-target refusal, status-list mismatch, scorer and legacy tag trees all confirmed in the source |
| Barter snapshot | Present in the main checkout with 10 files; both lineages reported it missing because it sits outside the research worktree |
| Spec doc check | See the parent packet's strict validation |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The DeepSeek lineage wrote timestamps after its run window.** The runner flagged 4 of 5 state records, so those timestamps are not trustworthy. The findings were checked independently.
2. **The research run on DeepSeek used `xhigh`, not `max`.** Cline offers no higher tier. The opencode-go route needs the Global region enabled in the operator's workspace.
<!-- /ANCHOR:limitations -->

---
