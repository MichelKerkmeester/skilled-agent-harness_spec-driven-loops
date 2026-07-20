---
title: "Feature Specification: code-directory naming enforcement (020 phase 012)"
description: "Close the naming gap the 000-011 migration never scoped: leading-underscore and __tests__ code directories inside skills. Extend the canon, broaden enforcement to code dirs, de-duplicate per-mode restatements, and rename the sk-design styles code dirs."
parent: "sk-doc/020-hyphen-naming-convention"
trigger_phrases:
  - "code directory naming enforcement"
  - "leading underscore db engine tests naming"
  - "naming checker code dirs scope gap"
importance_tier: important
contextType: planning
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/012-code-dir-naming-enforcement"
    last_updated_at: "2026-07-20T10:42:52Z"
    last_updated_by: "spec-author"
    recent_action: "Author the 012 code-dir naming-enforcement phase spec"
    next_safe_action: "Plan then build the shared code-dir naming checker and canon extension"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md"
      - ".opencode/skills/sk-doc/shared/scripts/check_no_new_snake_case.py"
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

# Feature Specification: code-directory naming enforcement (020 phase 012)

> Phase adjacency under the 020 parent: this is a follow-on extension after the migration's `011-integrate-and-closeout`. The 000-011 program migrated doc/catalog/reference/asset trees and root names from snake_case to kebab-case; it never scoped **code directories** inside skills. This phase closes that gap. Parent back-reference: `../spec.md`.

<!-- ANCHOR:metadata -->
## 1. METADATA

- **Parent Spec:** `../spec.md`
- **Origin:** Phase 012 of the 020 kebab-case filesystem-naming program (follow-on, post-`011-integrate-and-closeout`)
- **Predecessor:** `011-integrate-and-closeout` (the migration closeout)
- **Successor:** none (last phase)
- **Level:** 2 (Planned — nothing built in this phase yet)

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The canonical rule (`shared/references/filesystem-naming-convention.md`) says kebab-case is the sole in-scope form, but three enforcement gaps let non-canonical **code** directories ship — as seen in `sk-design/styles/{_db,_engine,_harness,__tests__}`:

1. **Enforcement never scans code dirs.** `create-skill/scripts/package_skill.py` walks only `RESOURCE_DOC_SUBTREES = ['references','assets']`; a skill's arbitrary code directories are outside the scanned scope.
2. **Leading-underscore is unruled.** The canon forbids nothing about the `_`-prefix "internal" idiom, and `check_no_new_snake_case.py` targets snake_case plus legacy underscore **roots**, not `_db`-style subdirs.
3. **`__tests__/` is undecided.** The exemption table lists `__snapshots__/` and `__mocks__/` but not `__tests__/`; tests run via `node --test` (which needs no `__tests__/`) should be `tests/`, but the doc is silent.

### Purpose

Consolidate naming-logic ownership so future generated or authored code directories cannot regress: extend the canon, broaden enforcement to code dirs, point per-mode restatements at the shared doc, and fix the concrete `styles/` case.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Extend `filesystem-naming-convention.md`: an explicit leading-underscore clause and a runner-dependent `__tests__/` decision.
- A single shared checker (in `shared/scripts/`) that scans all authored dirs of a skill, applying the exemption boundary; wire it into `package_skill.py` and the repo-wide `check_no_new_snake_case.py` gate.
- Point the per-mode SKILL.md naming restatements (create-diff, create-readme, create-feature-catalog, create-manual-testing-playbook, create-skill) at the shared canon.
- Backfill: rename `sk-design/styles/{_db,_engine,_harness,__tests__}` -> `{db,engine,harness,tests}` and update all imports/references.

### Out of Scope

- Re-running the 000-011 snake_case-to-kebab migration (complete).
- Doc/catalog/reference/asset trees and root names (already covered).
- Python source files and import-package directories (permanently exempt).

### Files to Change

| File | Change |
|---|---|
| `sk-doc/shared/references/filesystem-naming-convention.md` | Add leading-underscore clause + `__tests__/` decision. |
| `sk-doc/shared/scripts/` | New/extended shared code-dir naming checker. |
| `sk-doc/create-skill/scripts/package_skill.py` | Invoke the shared checker over code dirs, not just `references/`/`assets/`. |
| `sk-doc/shared/scripts/check_no_new_snake_case.py` | Also fail closed on non-exempt leading-underscore subdirs. |
| `sk-design/styles/{_db,_engine,_harness,__tests__}` | Rename to kebab/plain + update imports (the concrete case). |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance |
|---|---|---|
| REQ-001 | Canon covers code dirs | `filesystem-naming-convention.md` states leading-underscore is non-canonical and gives a runner-dependent `__tests__/` rule. |
| REQ-002 | Enforcement scans code dirs | A shared checker flags non-canonical code directories (e.g. `_db`, `__tests__`) with the exemption boundary applied; `package_skill.py` invokes it beyond `references/`/`assets/`. |
| REQ-003 | Repo-wide gate catches leading-underscore | `check_no_new_snake_case.py` fails closed on new non-exempt leading-underscore subdirs, not only snake_case + roots. |

### P1 - Required

| ID | Requirement | Acceptance |
|---|---|---|
| REQ-004 | Single source of truth | The 5 per-mode SKILL.md naming restatements forward-point to the shared canon instead of restating ad-hoc. |
| REQ-005 | Concrete backfill | `styles/{_db,_engine,_harness,__tests__}` renamed to `{db,engine,harness,tests}`; all imports/refs updated; DB + engine test suites green. |
| REQ-006 | No exemption regressions | Python source/packages, tool-mandated names, and test-runner magic (`__snapshots__/`, `__mocks__/`) still pass unchanged. |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The shared checker flags `_db`/`__tests__` and passes exempt cases [VERIFIED: checker fixtures].
- `styles/` code dirs renamed, imports updated, `node --test` on the DB + engine suites green [TESTED: node --test].
- No new leading-underscore/snake_case code dir can pass the gate [VERIFIED: `check_no_new_snake_case.py`].

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Risk:** an over-broad checker flags legitimately-exempt dirs. Mitigated — the exemption boundary from the canon is applied verbatim; fixtures cover every exempt class.
- **Risk:** the `styles/` rename churns imports. Mitigated — a scripted rename + reference update, tests as the gate; done in an isolated worktree.
- **Dependency:** the shared canon (`filesystem-naming-convention.md`) and the 020 exemption boundary.

<!-- /ANCHOR:risks -->

---

## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

Research/enforcement only; the checker is a bounded filesystem walk with the exemption boundary applied — negligible cost in packaging + the repo-wide gate.

### Security

No new untrusted inputs; the checker reads paths only. The `styles/` rename preserves file content and provenance; only directory names + import paths change.

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the shared checker be advisory-then-blocking (a debt window) or fail-closed immediately for code dirs?
- Does any skill legitimately need a Jest-style `__tests__/` (which stays exempt), and how does the checker detect the runner?

<!-- /ANCHOR:questions -->
