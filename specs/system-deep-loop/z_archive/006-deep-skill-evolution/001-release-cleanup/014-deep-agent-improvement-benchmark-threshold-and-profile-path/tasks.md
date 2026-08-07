---
title: "Tasks: fix deep-research LG-0004 + LG-0006"
description: "Task ledger for the two-fix remediation: align requiredAggregateScore to 80 and fix the run-benchmark default profilesDir, plus verification."
trigger_phrases:
  - "fix benchmark threshold and profile path tasks"
  - "008 remediation tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/001-release-cleanup/014-deep-agent-improvement-benchmark-threshold-and-profile-path"
    last_updated_at: "2026-05-24T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "tasks-authored"
    next_safe_action: "apply-two-fixes-then-verify"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000008003"
      session_id: "131-000-008-remediation"
      parent_session_id: "131-000-008-remediation"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: fix deep-research LG-0004 + LG-0006

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Load `sk-code` (opencode `.cjs` surface) for the verification recipe
- [ ] T002 Re-read the two fix sites: `run-benchmark.cjs:258` (profilesDir default) and `generate-profile.cjs:270` (requiredAggregateScore)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 LG-0004: `generate-profile.cjs:270` `requiredAggregateScore: 75` -> `80`
- [ ] T004 LG-0006: `run-benchmark.cjs:258` default `profilesDir` `assets/target-profiles` -> `assets/benchmark-profiles`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 `node --check` on `run-benchmark.cjs` + `generate-profile.cjs`
- [ ] T006 Run the `scripts/tests/` vitest suite; confirm no regression
- [ ] T007 Smoke: `run-benchmark.cjs --profile default --outputs-dir <tmp>` (no `--profiles-dir`) resolves `benchmark-profiles/default.json`
- [ ] T008 `rg "requiredAggregateScore"` shows 80 only; `rg "target-profiles"` shows no live default reference
- [ ] T009 Fill `implementation-summary.md`; strict validate (exit 0); scope-strict commit + push
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Both fixes applied and verified (REQ-001, REQ-002; REQ-003 via node --check + smoke + alignment-drift)
- [~] vitest suite NOT RUN (runner config absent; changes are value-only + unreferenced by any test — see implementation-summary Limitations)
- [x] Strict validate exit 0
- [x] `implementation-summary.md` filled with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Source loop**: `../005-deep-agent-improvement/research/convergence-summary.md`
<!-- /ANCHOR:cross-refs -->
