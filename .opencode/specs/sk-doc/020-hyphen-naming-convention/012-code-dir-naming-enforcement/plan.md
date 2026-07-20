---
title: "Implementation Plan: code-directory naming enforcement (020 phase 012)"
description: "Plan to extend the naming canon to code dirs, broaden enforcement, de-duplicate per-mode restatements, and rename the sk-design styles code dirs."
parent: "sk-doc/020-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/012-code-dir-naming-enforcement"
    last_updated_at: "2026-07-20T10:42:52Z"
    last_updated_by: "spec-author"
    recent_action: "Author the 012 phase plan"
    next_safe_action: "Build Phase 1: extend the canon and the shared checker"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md"
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

# Implementation Plan: code-directory naming enforcement (020 phase 012)

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

The 020 program's canon already lives in `shared/references/filesystem-naming-convention.md`; enforcement lives in `shared/scripts/` + `create-skill/package_skill.py`. This phase closes the code-dir scope gap on top of that existing foundation.

### Overview

Extend the canon for code dirs, add one shared checker that covers all authored dirs (not just references/assets), wire it into packaging + the repo-wide gate, forward-point the per-mode restatements, and rename the concrete `styles/` code dirs.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- The 000-011 migration is complete and the exemption boundary is settled.

### Definition of Done

- Shared checker flags code-dir violations + passes exempt classes; `styles/` renamed with green tests; `validate.sh` on this phase Errors 0.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

One shared checker owns code-dir naming enforcement; every consumer (packaging, the repo-wide gate) invokes it rather than re-implementing scan logic.

### Key Components

- `filesystem-naming-convention.md` — the extended rule (leading-underscore + `__tests__/`).
- A shared `shared/scripts/` checker — the single scan applying the exemption boundary.
- `package_skill.py` + `check_no_new_snake_case.py` — consumers that call it.

### Data Flow

Authored skill dirs -> shared checker (exemption boundary applied) -> violation report -> packaging gate + repo-wide gate fail closed; passing tree publishes.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Canon + checker

Extend `filesystem-naming-convention.md` (leading-underscore clause, `__tests__/` decision); build the shared code-dir checker with exemption-boundary fixtures.

### Phase 2: Wire enforcement

Invoke the checker from `package_skill.py` over code dirs; extend `check_no_new_snake_case.py` to fail closed on non-exempt leading-underscore subdirs; forward-point the 5 per-mode restatements.

### Phase 3: Backfill + verify

Rename `styles/{_db,_engine,_harness,__tests__}` -> `{db,engine,harness,tests}`; update imports; run the DB + engine test suites; prove the gate now rejects a fresh `_x` dir.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Fixture-driven: positive (a `_db`/`__tests__` dir fails), exempt (Python packages, `__snapshots__/`, tool-mandated names pass), and the concrete `styles/` rename gated by `node --test` on the DB + engine suites.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The 020 canon + exemption boundary; the existing `naming_root_resolver.py` + `check_no_new_snake_case.py`; the sk-design styles test suites as the backfill gate.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Enforcement changes are additive + flag-gateable (advisory before blocking). The `styles/` rename reverts by renaming back + restoring imports; a single-commit revert restores the prior state.

<!-- /ANCHOR:rollback -->
