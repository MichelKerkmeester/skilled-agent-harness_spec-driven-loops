---
title: "Implementation Summary: code-directory naming enforcement (020 phase 012)"
description: "PLANNED phase that closes the code-dir naming gap the 000-011 migration never scoped."
parent: "sk-doc/020-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/012-code-dir-naming-enforcement"
    last_updated_at: "2026-07-20T10:42:52Z"
    last_updated_by: "spec-author"
    recent_action: "Author the 012 phase spec, plan, tasks, checklist"
    next_safe_action: "Build Phase 1: canon extension and shared checker"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/references/filesystem-naming-convention.md"
      - ".opencode/skills/sk-design/styles/_db"
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

# Implementation Summary: code-directory naming enforcement (020 phase 012)

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| **Spec Folder** | 012-code-dir-naming-enforcement |
| **Level** | 2 |
| **Status** | Planned |
| **Parent** | sk-doc/020-hyphen-naming-convention (follow-on after `011-integrate-and-closeout`) |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet — this phase is the roadmap. It closes the naming gap the 000-011 migration never scoped: **code directories** inside skills (leading-underscore + `__tests__/`), which the current enforcement (packaging scans only `references/`/`assets/`; the repo-wide gate targets snake_case + roots) does not catch.

### Files Created / Changed

- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` — the phase record (this packet).
- Named future targets (not touched here): `filesystem-naming-convention.md`, a shared `shared/scripts/` checker, `package_skill.py`, `check_no_new_snake_case.py`, and `sk-design/styles/{_db,_engine,_harness,__tests__}`.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Authored from a read-only investigation that mapped where naming logic lives (the shared canon + shared scripts + create-skill checker + scattered per-mode restatements) and identified the three enforcement gaps that let `styles/_db` ship.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **The canon stays the source of truth.** `filesystem-naming-convention.md` owns the rule; this phase extends it rather than adding a new authority.
- **One shared checker, many consumers.** Enforcement is centralized in `shared/scripts/`; packaging + the repo-wide gate call it, avoiding per-mode drift.
- **`__tests__/` is runner-dependent.** `node --test` needs no `__tests__/` (so `tests/`); Jest-style `__tests__/` stays exempt.
- **Follow-on, not a re-run.** 012 extends the closed 000-011 program for the code-dir gap; it does not repeat the snake_case-to-kebab migration.

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- Not applicable yet — status Planned. Verification gates are enumerated in `checklist.md` and gated by `node --test` on the `styles/` suites once built.
- `validate.sh .../012-code-dir-naming-enforcement --strict` -> Errors 0 [TESTED: strict validation run].

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

Advisory-vs-fail-closed rollout and Jest-runner detection are open questions in `spec.md` §7, to resolve at build time. This phase reopens the 020 program past its 011 closeout by design, to cover a gap the migration did not scope.

<!-- /ANCHOR:limitations -->
