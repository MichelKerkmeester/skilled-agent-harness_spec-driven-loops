---
title: "Tasks: Phase 004 — Notion Bases + Dataview real-vault install and verification"
description: "Task Format: T### [P?] Description (file path) [effort]"
trigger_phrases:
  - "015 plugin install tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/004-plugin-install-and-verification"
    last_updated_at: "2026-08-21T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Shipped OBS-023 scenario, verify-notion-migration-parity.sh, and playbook/README edits"
    next_safe_action: "Operator runs BRAT install of notion-bases in real vault, then runs the parity script"
    blockers: []
    key_files: ["../001-deep-research/research/research.md", "spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-004-plugin-install-and-verification"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
# Tasks: Phase 004: Notion Bases + Dataview real-vault install and verification

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Re-read `research.md` §8, §9, §10 (`../001-deep-research/research/research.md`) [15m]
  - **Evidence**: §8/§9/§10 re-read this session; the required-plugin list, the mcp-notion/mcp-obsidian division of labor, and the 11-check verification protocol were cited directly into `spec.md` and this scenario/script.
- [x] T002 [P] Re-read `manual-testing-playbook/plugin-tie-ins/brat-headless-install.md` (`OBS-013`) [10m]
  - **Evidence**: `OBS-013` read in full; its stage/register/activate/verify sequence, safe-id guard, and section shape are mirrored in `OBS-023`.
- [x] T003 Re-confirm the next free `OBS-###` id in `manual-testing-playbook.md` [5m]
  - **Evidence**: last registered id was `OBS-022`; `OBS-023` confirmed free and used.
- [x] T004 Re-confirm the real vault path against the current operator instruction [5m]
  - **Evidence**: `/Users/michelkerkmeester/Library/Mobile Documents/iCloud~md~obsidian/Documents/Michel Kerkmeester` named in `OBS-023` §3 "Recommended Orchestration Process"; not read or written this session.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

<!-- Planning artifacts only in this phase — no vault write. -->

- [x] T005 Author the `OBS-023` scenario: stage/register/activate/verify for both plugins, plugin id derived from fetched `manifest.json`, explicit rollback, iCloud/personal-vault blast-radius flag (`.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/plugin-tie-ins/notion-bases-dataview-install.md`) [1.5h]
  - **Evidence**: file created; `validate_document.py --type reference` = 0 issues; credential scan clean; safe-id guard present at line 75.
- [x] T006 [P] Author `verify-notion-migration-parity.sh`: 11 checks from research §10 Pass 1, `--vault`/`--ledger` flags, `SKIP` (not `FAIL`) for ledger-dependent checks when absent (`.opencode/skills/mcp-tooling/mcp-obsidian/scripts/verify-notion-migration-parity.sh`) [2h]
  - **Evidence**: file created, `chmod +x`; `bash -n` clean; `shellcheck` clean; ran against an empty `mktemp -d` (3 PASS, 0 FAIL, 8 SKIP, exit 0) and against a synthetic fixture with a ledger (8 PASS, 3 FAIL, 0 SKIP, exit 1) to prove both the SKIP-without-ledger path and the real-comparison path work.
- [x] T007 Register `OBS-023` in `manual-testing-playbook.md` index tables [10m]
  - **Evidence**: §1 range, §12 subsection, §14 cross-reference row added; `validate_document.py --type playbook` = 0 issues.
- [x] T008 Document the new script in `scripts/README.md` [10m]
  - **Evidence**: new §4 added (usage, 11-check table, SKIP semantics); `validate_document.py --type reference` and `--type feature_catalog` both = 0 issues.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

<!-- Covers the planning artifacts only, not the real install. -->

- [x] T009 Run `validate_document.py --type skill` on the scenario doc — 0 issues [10m]
  - **Evidence**: `--type reference` (the dispatch-specified type for this file) = 0 issues; run and confirmed this session.
- [x] T010 Run `shellcheck` (or a manual syntax read if unavailable) on `verify-notion-migration-parity.sh` [10m]
  - **Evidence**: `shellcheck` 0.11.0 available; ran clean after one fix (SC1087 brace-expansion on `$uuid_re`).
- [x] T011 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` — Errors:0 [5m]
  - **Evidence**: `RESULT: PASSED`, `Summary: Errors: 0  Warnings: 0`.
- [x] T012 Confirm `git status` shows no file touched outside this phase folder and `mcp-obsidian/` [5m]
  - **Evidence**: `git status --short` scoped to this phase folder plus `.opencode/skills/mcp-tooling/mcp-obsidian/` only; no other path touched.
- [x] T013 Refresh `implementation-summary.md` + continuity with the actual result [10m]
  - **Evidence**: this file, `spec.md`, `checklist.md`, and `implementation-summary.md` all reconciled to the actual shipped state below.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Phase 1-3 tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `validate_document.py --type skill` = 0 issues on created/edited files
  - **Evidence**: `OBS-023` and `scripts/README.md` validated with `--type reference` (0 issues each); `scripts/README.md` also checked with `--type feature_catalog` (0 issues); `manual-testing-playbook.md` validated with `--type playbook` (0 issues, fixing the pre-existing `global_evidence_requirements` gap).
- [x] `validate.sh <this-folder> --strict` = Errors:0
  - **Evidence**: `RESULT: PASSED`, `Summary: Errors: 0  Warnings: 0`.
- [x] The real install (Phase 4 in `plan.md`) remains explicitly unexecuted pending operator go-ahead
  - **Evidence**: no vault path under `iCloud~md~obsidian` was read or written this session; `OBS-023` documents the procedure without running it.
- [x] `checklist.md` fully verified for this phase's own planning scope
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Predecessor**: `../003-notion-bases-plugin-tie-in/`
- **Next phase**: None — closes the 015 phased build
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS (~100 lines)
- Core + Level 2 detail
- Effort estimates per task
- Explicit verification tasks
-->
