---
title: "Implementation Plan: Phase 5: cli-orchestration-repoint"
description: "Repoint every cli-external-orchestration reference off the deleted packet: 63 canonical-card paths move, and the rest are prose about a capability that no longer exists."
trigger_phrases:
  - "008 phase 005 plan"
  - "cli-orchestration-repoint plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: cli-orchestration-repoint

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| Language/Stack | Markdown, JSON, Node.js 20 |
| Framework | None |
| Storage | None |
| Testing | Grep-based residue checks and the markdown link-integrity guard |

### Overview
The 46 remaining references split by whether their target survived. All 63 canonical-card references share the inner segment that changed, so one depth-preserving substitution handles every relative form at once and is then verified by resolving each against disk. The rest assert a per-model override contract; those are prose edits, mostly a repeated three-tier precedence rule that becomes a two-tier rule once its middle tier is removed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented — evidence: `spec.md` §2 states the problem and §3 fixes the scope
- [x] Success criteria measurable — evidence: `spec.md` §5 states each criterion as an observable check
- [x] Dependencies identified — evidence: §6 of this plan lists them

### Definition of Done
- [x] All acceptance criteria met — evidence: the Verification table in `implementation-summary.md`
- [x] Tests passing (if applicable) — evidence: recorded in the phase-3 verification tasks
- [x] Docs updated (spec/plan/tasks) — evidence: this folder validates with Errors: 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Split mechanical from semantic: substitute what moved, rewrite what was removed.

### Key Components
- **The canonical prompt-quality card**: Survives at a new location; 63 references repoint to it
- **The three-tier precedence rule**: Repeated across executors; loses its model-override tier and renumbers to two
- **Per-model scenarios**: Two deleted outright, one rewritten to keep its surviving half

### Data Flow
Executor cards delegate framework selection and the CLEAR check to one canonical card by relative path. Removing the per-model tier removes one branch of that delegation; the remaining branches and the canonical card are unchanged.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Two objective checks: a recursive search for the retired name across live surfaces must return zero, and the repository-wide markdown link-integrity guard must report zero broken links. Both were run after the edits.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The canonical card must already exist at its new location, which an earlier phase ensured.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the scoped diff. The deleted scenario file is recoverable from git history.
<!-- /ANCHOR:rollback -->

---
