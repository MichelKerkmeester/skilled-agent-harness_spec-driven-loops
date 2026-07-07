---
title: "Tasks: Phase 3 — Exact-Wording Guards (canary)"
description: "Task breakdown for the rule-canary guard + test + CI workflow."
trigger_phrases:
  - "phase 3 tasks canary guard"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/z_archive/015-sk-code-ponytail-based-refinement/003-wording-invariant-guards"
    last_updated_at: 2026-06-13T15:20:00Z
    last_updated_by: claude-opus
    recent_action: "Phase 3 implemented and verified; canary script + test + CI"
    next_safe_action: "/speckit:plan Phase 4"
---
# Tasks: Phase 3 — Exact-Wording Guards (canary)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[x]` complete · `[ ]` pending.

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Recon exact `Review status:` strings (per-file scope) + the Iron Law lines in sk-code/SKILL.md + CLAUDE.md.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-002 Write `check-rule-copies.js` (ESM, no deps, `--root`; exact-substring per-file + Iron-Law-line token checks; collect all failures; missing file = failure).
- [x] T-003 Write `check-rule-copies.test.sh` (run_case style; PASS on real repo; FAIL on missing triplet; FAIL on reworded Iron Law).
- [x] T-004 Write `.github/workflows/rule-canary-sync.yml` (pull_request → main; runs the canary; ::error:: on drift; ::warning:: + exit 0 if missing).

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-005 `node --check` OK; `node check-rule-copies.js` → exit 0; test suite → 3/3 PASS.
- [x] T-006 Negative control: tampered root → exit 1 (canary actually catches drift).
- [x] T-007 alignment-drift exit 0; comment-hygiene on the `.js` exit 0; scope = only 3 new files.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Canary passes clean, fails on drift, wired into CI as a script (not a vitest).
- [x] No wording edit to SKILL.md / CLAUDE.md (minimal-invariant lock).
- [x] `.js` passes alignment-drift + comment-hygiene.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` · Plan: `plan.md` · Summary: `implementation-summary.md`
- Research: `../research/research.md` (recs #3, #8; Bonus Bug 1)

<!-- /ANCHOR:cross-refs -->
