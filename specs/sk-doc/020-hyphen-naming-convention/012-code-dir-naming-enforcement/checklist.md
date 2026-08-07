---
title: "Verification Checklist: code-directory naming enforcement (020 phase 012)"
description: "QA checklist for the code-dir naming-enforcement phase."
parent: "sk-doc/020-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/012-code-dir-naming-enforcement"
    last_updated_at: "2026-07-20T10:42:52Z"
    last_updated_by: "spec-author"
    recent_action: "Author the phase QA checklist"
    next_safe_action: "Verify each item as the phase is built"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-skill/scripts/package_skill.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: code-directory naming enforcement (020 phase 012)

<!-- ANCHOR:protocol -->
## Verification Protocol

- Mark `[x]` only with cited evidence (`[SOURCE: file:line]`, `[TESTED: ...]`). Items are `[ ]` until the phase is built.

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The 020 exemption boundary is read and applied verbatim before writing the checker.
- [ ] CHK-002 [P1] The concrete `styles/` code-dir case is inventoried (`_db`, `_engine`, `_harness`, `__tests__`).

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] One shared checker owns code-dir enforcement; consumers call it, no duplicated scan logic.
- [ ] CHK-011 [P1] The canon extension is the single source of truth; per-mode restatements forward-point to it.

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Positive fixtures: `_db`/`__tests__` dirs fail the checker.
- [ ] CHK-021 [P0] Exempt fixtures: Python packages, `__snapshots__/`, `__mocks__/`, tool-mandated names pass.
- [ ] CHK-022 [P0] DB + engine `node --test` suites green after the `styles/` rename.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] REQ-001..006 each satisfied.
- [ ] CHK-031 [P1] `package_skill.py` and `check_no_new_snake_case.py` both call the shared checker.

<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P1] The checker reads paths only; no untrusted execution.
- [ ] CHK-041 [P1] The `styles/` rename preserves content + provenance; only dir names + imports change.

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P0] `filesystem-naming-convention.md` documents the leading-underscore clause + `__tests__/` decision.
- [ ] CHK-051 [P1] `core-standards.md` §2 forward-pointer reconciled to the canon.

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P1] The shared checker lives in `shared/scripts/`, not a per-mode folder.
- [ ] CHK-061 [P1] No stray files; scope stays within the 012 phase + the named enforcement/style targets.

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] CHK-070 [P0] `validate.sh .../012-code-dir-naming-enforcement --strict` -> Errors 0.
- [ ] CHK-071 [P0] A fresh `_x` code dir is rejected by the wired gate.

<!-- /ANCHOR:summary -->
