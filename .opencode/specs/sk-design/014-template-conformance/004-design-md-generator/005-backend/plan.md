---
title: "Plan: design-md-generator backend/ structural conformance"
description: "Plan to audit backend/'s tracked structure (excluding dist/ and node_modules/) against overview.md and package_skill.py."
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/004-design-md-generator/005-backend"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author backend structural audit plan"
    next_safe_action: "Enumerate backend/ tree excluding dist/ and node_modules/"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Plan: design-md-generator backend/ structural conformance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Artifact type** | Real TypeScript package: config files + 29 `scripts/*.ts` + 19 `tests/*.ts` + fixtures |
| **Governing rules** | `create-skill/references/shared/overview.md` (directory purpose) + `package_skill.py` (kebab/file-type) |
| **Verification** | Rule-by-rule structural check + `validate.sh` |

### Overview
A structure-only audit (no template diff exists for a code package). Enumerate the tracked tree, explicitly excluding `dist/` and `node_modules/`, and confirm the "tests/ required when scripts/ exists" rule against real evidence.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `overview.md` directory rules read in full
- [ ] `package_skill.py` naming/file-type checks identified
- [ ] Tracked `backend/` tree enumerated, `dist/`/`node_modules/` explicitly excluded

### Definition of Done
- [ ] Structure and naming checked against both sources
- [ ] "tests/ required when scripts/ exists" rule confirmed satisfied with cited evidence
- [ ] Confirmed gaps fixed
- [ ] `validate.sh` passes for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Rules-based structural audit (no template diff), scoped to tracked files only.

### Key Components
- **Target:** `backend/{package.json,package-lock.json,tsconfig*.json,vitest.config.ts,README.md,.npmignore}` + `backend/scripts/*.ts` (29) + `backend/tests/**` (19 `.ts` + fixtures).
- **Excluded:** `backend/dist/`, `backend/node_modules/` (gitignored).
- **Reference:** `overview.md` directory rules, `package_skill.py` naming checks.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read `overview.md` directory rules
- [ ] Identify `package_skill.py`'s naming/file-type checks
- [ ] Enumerate tracked `backend/` tree, excluding `dist/`/`node_modules/`

### Phase 2: Core Implementation
- [ ] Check package-config file placement against `overview.md`
- [ ] Check `scripts/` and `tests/` naming against `package_skill.py`
- [ ] Confirm the "tests/ required when scripts/ exists" rule with the 173-test count as evidence
- [ ] Fix confirmed gaps

### Phase 3: Verification
- [ ] Re-check the fixed structure
- [ ] Run `validate.sh`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual rule check | Directory placement + naming, tracked files only | Read + compare |
| Evidence citation | "tests/ required when scripts/ exists" rule | `find backend/tests -name "*.test.ts" \| wc -l` |
| Validation | Spec-doc structure | `validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `overview.md` | Internal | Green | Cannot check directory purpose without it |
| `package_skill.py` | Internal | Green | Cannot check naming/file-type without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A structural fix accidentally touches `dist/` or `node_modules/`, or breaks a `package.json` script reference.
- **Procedure**: `git checkout -- <path>` restores the pre-fix state; re-run `vitest` to confirm the test suite still resolves.
<!-- /ANCHOR:rollback -->
