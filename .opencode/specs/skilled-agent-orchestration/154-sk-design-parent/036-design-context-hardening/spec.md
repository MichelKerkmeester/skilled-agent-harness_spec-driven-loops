---
title: "Feature Specification: harden the context-loading contract (review/benchmark remediation)"
description: "Level-1 hardening phase acting on the 031 deep-review + benchmark findings: fixes the safety defect (F-005, unsafe CO-037 command), the cross-reference robustness gap (F-003, bare filenames → relative paths), and the inventory drift (F-006, Template 16 placement + 13→16 template counts), and adds the deterministic contrast checker (research §17) wired into the foundations SKILL, the contract, and the contrast-pair worksheet."
trigger_phrases:
  - "context contract hardening"
  - "contrast checker script"
  - "design contract review fixes"
  - "F-005 F-003 F-006 remediation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/036-design-context-hardening"
    last_updated_at: "2026-06-27T16:45:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Applied F-005/F-003/F-006 fixes + added the deterministic contrast checker"
    next_safe_action: "Optional: executable orchestrator gate (review F-004); commit the arc"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
      - "../035-design-context-benchmark/review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-154-036-design-context-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The deterministic contrast checker closes the benchmark's weakest link (weak-model contrast arithmetic) by giving the inventory a calculator that exits non-zero on a body-contrast fail"
      - "The executable orchestrator-path gate (review F-004) remains the larger deferred follow-up"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: harden the context-loading contract

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

This phase acts on the 031 deep-review + benchmark. It fixes the three concrete defects the review surfaced and closes the benchmark's weakest link. F-005 (safety): the CO-037 manual scenario shipped `--dangerously-skip-permissions` + an unverified `--variant` that contradicted the MiniMax profile — removed. F-003: the shared contract cited bare filenames that did not resolve — made relative. F-006: the new design dispatch template sat after RELATED RESOURCES and the playbook claimed "13 templates" (now 16) — reordered and reconciled. And the marquee addition: a **deterministic contrast checker** (`scripts/contrast_check.py`) wired into the foundations SKILL, the contract, and the worksheet, so the contrast inventory is computed, not eyeballed.

**Key Decisions**: surgical, additive fixes; the larger executable orchestrator-path gate (review F-004) stays deferred.

**Critical Dependencies**: the 031 review/benchmark findings; the live `sk-design` / `cli-opencode` contract files.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-27 |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../035-design-context-benchmark/spec.md |
| **Type** | Hardening (acts on review/benchmark findings) |
| **Handoff Criteria** | F-005/F-003/F-006 fixed; `contrast_check.py` added + wired into the SKILL/contract/worksheet; all edited files pass sk-doc; smart-routers intact |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 031 evaluation proved the contract works but found a safety defect (F-005), a cross-reference robustness gap (F-003), inventory drift (F-006), and an empirical soft spot: a weak model (Kimi) ran the contrast inventory but mislabeled two failing pairs as pass. None of these are closed by prose alone.

### Purpose
Apply the concrete review fixes and give the contrast inventory a deterministic calculator so the check is correct, not just present.

> **Phase note:** acts on the sibling 031 review/benchmark; no new design direction.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- F-005: remove the unsafe flags from the CO-037 manual scenario.
- F-003: convert bare filenames in `context_loading_contract.md` to resolving relative paths.
- F-006: reorder Template 16 before RELATED RESOURCES; reconcile "13 templates" → "16 templates" across the cli-opencode playbook.
- New: `design-foundations/scripts/contrast_check.py` + wiring into the foundations SKILL row, the contract's CONTRAST PAIRS field, and the contrast-pair worksheet.

### Out of Scope
- The executable orchestrator-path gate (review F-004) — larger, deferred.
- Any new design capability beyond the checker.
- The pre-existing dirty design-family files (unrelated cleanup).

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `cli-opencode/.../minimax-design-context-manifest.md` | Edited | F-005 unsafe command removed |
| `sk-design/shared/context_loading_contract.md` | Edited | F-003 relative paths + checker reference |
| `cli-opencode/assets/prompt_templates.md` + playbook files | Edited | F-006 reorder + count reconciliation |
| `sk-design/design-foundations/scripts/contrast_check.py` | Created | Deterministic WCAG checker |
| `sk-design/design-foundations/SKILL.md` + `assets/contrast_pair_inventory.md` | Edited | Wire the checker |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Created | Wrapper |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The safety defect is removed | CO-037 contains no `--dangerously-skip-permissions` and no MiniMax `--variant` |
| REQ-002 | The contrast checker is deterministic + wired | `contrast_check.py` returns correct ratios + non-zero on a body fail; referenced by the SKILL, contract, and worksheet |

### P1 - Required (complete OR user-approved deferral)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Contract cross-references resolve | Bare filenames replaced with relative paths that exist |
| REQ-004 | Inventory drift reconciled | Template 16 sequential; no "13 templates" claim remains |
| REQ-005 | No regressions | All edited files pass sk-doc; smart-router blocks + anchors intact |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: F-005/F-003/F-006 resolved and the deterministic checker added + wired; `contrast_check.py` correctly flags `#787878`/white (4.42, fail) and passes `#043367`/white (12.54).
- **SC-002**: every edited markdown file passes `sk-doc validate_document.py`; no smart-router/anchor damage.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Template reorder breaks the file | Inventory/test drift | sk-doc validated post-edit; section numbering sequential |
| Risk | Relative paths still wrong | Broken cross-refs | Each target path existence-checked before writing |
| Dependency | 031 review/benchmark findings | No basis for fixes | Present + cited |
| Dependency | python3 | Checker cannot run | Stdlib-only; smoke-tested |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Hardening complete. The remaining larger follow-up is the executable orchestrator-path gate (review F-004) — wiring the contract into a per-mode router auto-load or a deterministic pre-dispatch proof check so the orchestrator's own path is enforced, not just the delegated path. Deferred by size, not by doubt.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Findings source**: `../035-design-context-benchmark/review/review-report.md`, `../035-design-context-benchmark/benchmark-matrix.md`
- **Checker**: `.opencode/skills/sk-design/design-foundations/scripts/contrast_check.py`
