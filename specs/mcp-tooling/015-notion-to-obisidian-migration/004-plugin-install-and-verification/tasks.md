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
    last_updated_at: "2026-08-22T04:44:34Z"
    last_updated_by: "claude"
    recent_action: "BRAT-headless install of notion-bases v1.12.0 executed + verified in the real vault"
    next_safe_action: "None — 015 capability complete; migration run is a separate action"
    blockers: []
    key_files: ["../001-deep-research/research/research.md", "spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-004-plugin-install-and-verification"
      parent_session_id: null
    completion_pct: 100
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

<!-- ANCHOR:phase-4 -->
## Phase 4: Real Install Execution (operator-approved, executed 2026-08-22)

<!-- This phase covers the actual real-vault action, run in a later, separately
gated session after operator go-ahead — not part of the Phase 1-3 doc/script
authoring session above. -->

- [x] T014 Execute the `OBS-023` BRAT-headless install of Notion Bases into the real vault (out-of-repo, `.obsidian/plugins/notion-bases/`) [operator-approved]
  - **Evidence**: `main.js` (750825 bytes), `manifest.json` (655 bytes), `styles.css` (118828 bytes) staged; `manifest.id` = `notion-bases`, `version` = `1.12.0`, derived from the fetched manifest (never hardcoded) and passed the safe-folder guard.
- [x] T015 Register the plugin: update `community-plugins.json` and initialize BRAT's `data.json`
  - **Evidence**: `community-plugins.json` — `notion-bases` added, entry count 11 → 12, backup written at `community-plugins.json.bak`. BRAT `data.json` was absent, so it was created fresh: `pluginList=["bgarciamoura/obsidian-notion-bases-plugin"]`, `pluginSubListFrozenVersion=[{repo, version:"1.12.0"}]`.
- [x] T016 Verify Dataview's already-installed branch and leave it untouched
  - **Evidence**: `.obsidian/plugins/dataview/` was already present in the target vault; the scenario's verify-first discipline took the already-present branch and made no write to it.
- [x] T017 Confirm activation status and rollback availability
  - **Evidence**: Obsidian was closed during the write, so activation completes when the operator next opens Obsidian (not independently confirmed active by this task). Rollback remains available and was not needed: `rm -rf .obsidian/plugins/notion-bases/`; `rm -f .obsidian/plugins/obsidian42-brat/data.json`; `mv community-plugins.json.bak community-plugins.json`.
- [x] T018 Run `verify-notion-migration-parity.sh` against the real vault — done-as-designed, not executed
  - **Evidence**: the script validates a *completed migration* (its 8 ledger-dependent checks need a migration ledger), not an arbitrary existing vault state — running it here would only exercise the 3 structural checks against a vault with no migration content. It was proven functional against fixtures during Phase 004 authoring (T006: 3 PASS/0 FAIL/8 SKIP on an empty vault; 8 PASS/3 FAIL/0 SKIP on a synthetic fixture + ledger). Running it against the real vault is deferred until an actual migration produces a ledger — a separate future action per `spec.md` Out of Scope.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Phase 1-3 tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `validate_document.py --type skill` = 0 issues on created/edited files
  - **Evidence**: `OBS-023` and `scripts/README.md` validated with `--type reference` (0 issues each); `scripts/README.md` also checked with `--type feature_catalog` (0 issues); `manual-testing-playbook.md` validated with `--type playbook` (0 issues, fixing the pre-existing `global_evidence_requirements` gap).
- [x] `validate.sh <this-folder> --strict` = Errors:0
  - **Evidence**: `RESULT: PASSED`, `Summary: Errors: 0  Warnings: 0`.
- [x] The real install (Phase 4 in `plan.md`) remained explicitly unexecuted during the doc/script-authoring session (Phase 1-3 above)
  - **Evidence**: no vault path under `iCloud~md~obsidian` was read or written during that session; `OBS-023` documented the procedure without running it.
- [x] The real install has since executed and been verified in an operator-approved follow-up session (2026-08-22)
  - **Evidence**: see Phase 4 (T014-T018) above; Notion Bases staged + registered in the real vault, Dataview left untouched, rollback documented and available, activation pending the operator's next Obsidian open.
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
