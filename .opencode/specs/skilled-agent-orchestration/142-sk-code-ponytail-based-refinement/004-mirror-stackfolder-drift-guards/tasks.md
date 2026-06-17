---
title: "Tasks: Phase 4 — Drift Guards"
description: "Task breakdown for the agent-mirror-sync gate + STACK_FOLDERS validator + drift fixes."
trigger_phrases:
  - "phase 4 tasks drift guards"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: .opencode/specs/skilled-agent-orchestration/142-sk-code-ponytail-based-refinement/004-mirror-stackfolder-drift-guards
    last_updated_at: 2026-06-13T16:30:00Z
    last_updated_by: claude-opus
    recent_action: "Phase 4 implemented + verified; gate + stack-folders + drift fixed"
    next_safe_action: "/speckit:plan Phase 5"
---
# Tasks: Phase 4 — Drift Guards

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

- [x] T-001 Pre-flight audit: ran the mirror check over all 12 agents → found context + orchestrate already drifted (committed). Chose changed-files-scoped gate design.
- [x] T-002 Diagnose each drift: context/codex = real (dropped Tool-Inventory row); orchestrate = false positive (per-runtime self-description not allowlisted).

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-003 `check-agent-mirror-sync.cjs` (changed paths or --all; per-runtime drift output; exit 1 on drift).
- [x] T-004 Extend `.opencode/hooks/pre-commit` with an independent, staged-agents-only mirror gate (comment-hygiene preserved; fail-safe).
- [x] T-005 `.github/workflows/agent-mirror-sync.yml` (PR→main, changed agent files).
- [x] T-006 `verify_stack_folders.py` (STACK_FOLDERS ↔ references/ + assets/ binding).
- [x] T-007 Refine `normalizeRuntimeSpecificText` to clear the orchestrate self-description false positive (conservative).
- [x] T-008 Fix the real context/codex drift: restore the dropped "Structure / Semantic and exact discovery" Tool-Inventory row to match canonical.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-009 `check-agent-mirror-sync.cjs --all` → all 12 in-sync, exit 0.
- [x] T-010 `verify_stack_folders.py` → exit 0; normalizer tamper control → real drift still caught; pre-commit hook tested via throwaway index (clean→0, drift→1).
- [x] T-011 Scope: only the intended files changed (the concurrent session's spec-memory files left untouched).

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Gate wired into pre-commit + CI, changed-files-scoped, fail-safe.
- [x] All 12 agent mirrors in-sync; the 2 pre-existing drifts fixed.
- [x] STACK_FOLDERS validator passes; normalizer fix is conservative.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` · Plan: `plan.md` · Summary: `implementation-summary.md`
- Research: `../research/research.md` (rec #10; Bonus Bugs 2, 3) · Lib: `deep-improvement/scripts/lib/mirror-sync-verify.cjs`

<!-- /ANCHOR:cross-refs -->
