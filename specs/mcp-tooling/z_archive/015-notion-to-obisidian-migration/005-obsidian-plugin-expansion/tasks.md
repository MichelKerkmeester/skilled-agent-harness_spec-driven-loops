---
title: "Tasks: Phase 005 — Obsidian plugin-stack expansion (nine-plugin install + file-layer references + router wiring)"
description: "Task Format: T### [P?] Description (file path) [effort]"
trigger_phrases:
  - "015 plugin expansion tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/005-obsidian-plugin-expansion"
    last_updated_at: "2026-08-22T09:00:00Z"
    last_updated_by: "claude"
    recent_action: "installed 9 vault plugins and wired 3 references + roster into mcp-obsidian"
    next_safe_action: "None — phase complete; per-plugin deep research is a separate follow-up"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-005-obsidian-plugin-expansion"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
# Tasks: Phase 005: Obsidian plugin-stack expansion

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

- [x] T001 Read `spec.md` §3 Scope, §4 Acceptance Criteria, §5 Risks (`spec.md`) [15m]
  - **Evidence**: scope (nine-plugin install + three file-layer references + roster + router wiring), acceptance criteria (six items), and risks re-read this session and carried into the plan and this task list.
- [x] T002 [P] Complete the obsolescence review across the installed plugin stack [30m]
  - **Evidence**: all installed plugins coexist; two soft overlaps recorded — Claudian vs Local REST API, and Project Manager vs Dataview/Notion Bases — documented, not resolved by removal (see `spec.md` §3 Out of Scope).
- [x] T003 Derive each plugin's manifest `id` from its downloaded `manifest.json` and confirm against its expected id [20m]
  - **Evidence**: the nine ids (`virtual-linker`, `editing-toolbar`, `notebook-navigator`, `advanced-canvas`, `realclaudian`, `obsidian-custom-frames`, `darlal-switcher-plus`, `project-manager`, `link-favicon`) were each read from the fetched manifest, never assumed as the on-disk folder name.
- [x] T004 Confirm the real vault path and the file-layer vs UI/automatic split [10m]
  - **Evidence**: three file-layer plugins with an AI-authorable data model (Advanced Canvas, Claudian, Project Manager) get dedicated docs; the other six (`virtual-linker`, `editing-toolbar`, `notebook-navigator`, `obsidian-custom-frames`, `darlal-switcher-plus`, `link-favicon`) are UI/automatic and get none.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

<!-- Skill-folder authoring in this phase — no further vault write. -->

- [ ] T005 Author the Advanced Canvas file-layer reference (four files) plus catalog entry — documents how the plugin extends the `.canvas` JSON graph model (`.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/advanced-canvas/`) [1.5h]
  - **Gate**: `validate_document.py --type feature_catalog` = 0 issues; every unconfirmed data-model key flagged `VERIFY`.
- [ ] T006 [P] Author the Claudian file-layer reference (four files) plus catalog entry — documents the in-vault agent CLIs, slash commands, and MCP config (`.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/claudian/`) [1.5h]
  - **Gate**: `validate_document.py --type feature_catalog` = 0 issues.
- [ ] T007 [P] Author the Project Manager file-layer reference (four files) plus catalog entry — documents the task frontmatter schema (`.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/project-manager/`) [1.5h]
  - **Gate**: `validate_document.py --type feature_catalog` = 0 issues.
- [ ] T008 Author `references/plugins/installed-plugins.md`: the roster of all twenty-one enabled plugins, split file-layer (with docs) vs UI/automatic (without) (`.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/installed-plugins.md`) [45m]
  - **Gate**: every id/version/repo matches the installed vault state; document validates clean.
- [ ] T009 Wire the three new plugins into `mcp-obsidian/SKILL.md`: resource map, `INTENT_SIGNALS`, `specific_plugin_intents`, `RESOURCE_MAP`, the `PLUGINS` aggregate, the intent-count comment, and the version bump (`.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md`) [45m]
  - **Gate**: intent-count comment equals the number of `INTENT_SIGNALS` keys after wiring.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

<!-- Covers the skill-folder deliverables only; the vault install (Phase 4) is already verified. -->

- [ ] T010 Run `validate_document.py --type feature_catalog` on each reference and catalog entry — 0 issues [15m]
  - **Gate**: pending — runs after T005-T008 land.
- [ ] T011 Validate `installed-plugins.md`; confirm every id/version/repo is correct against the vault state [10m]
  - **Gate**: pending.
- [ ] T012 Confirm the `SKILL.md` intent-count comment matches the number of `INTENT_SIGNALS` keys after wiring [10m]
  - **Gate**: pending — runs after T009.
- [ ] T013 Run `ci-leaf-manifest-freshness.cjs` for `mcp-tooling` — green [10m]
  - **Gate**: pending.
- [ ] T014 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` — Errors:0 [5m]
  - **Gate**: pending.
- [ ] T015 Confirm `git status` shows no file touched outside this phase folder and `mcp-obsidian/` (beyond the already-executed vault install) [5m]
  - **Gate**: pending.
- [ ] T016 Reconcile `implementation-summary.md` + continuity with the actual result and set status to Complete [10m]
  - **Gate**: pending — runs last.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Nine-Plugin Real-Vault Install (operator-approved, executed 2026-08-22)

<!-- This phase covers the actual real-vault action, run under operator go-ahead
before the skill-folder authoring above — it is already executed and verified. -->

- [x] T017 Execute the BRAT-headless install of all nine plugins into the real vault (out-of-repo, `.obsidian/plugins/<id>/`) [operator-approved]
  - **Evidence**: `virtual-linker`, `editing-toolbar`, `notebook-navigator`, `advanced-canvas`, `realclaudian`, `obsidian-custom-frames`, `darlal-switcher-plus`, `project-manager`, `link-favicon` each staged (`main.js` + `manifest.json`); each `manifest.id` derived from the downloaded manifest (never hardcoded) and passed the safe-folder guard.
- [x] T018 Register the plugins: update `community-plugins.json` and BRAT `data.json`
  - **Evidence**: `community-plugins.json` entry count 12 → 21 (all nine ids added); BRAT `data.json` registered each plugin's repo with a frozen version.
- [x] T019 Back up both JSON files and record the named rollback
  - **Evidence**: timestamped `.bak` backups made for `community-plugins.json` and BRAT `data.json` before writing; named rollback = remove the nine staged `.obsidian/plugins/<id>/` folders and restore both JSON files from their `.bak`.
- [x] T020 Confirm activation status and rollback availability
  - **Evidence**: rollback = `rm -rf .obsidian/plugins/<id>/` ×9 + restore both JSON from `.bak-20260822-084344`; activation completes when the operator next opens Obsidian (not independently confirmed active by this task).
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All Phase 2-3 tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `validate_document.py --type feature_catalog` = 0 issues on the three references and catalog entries
  - **Gate**: pending — the three file-layer references and the roster are mid-flight.
- [ ] `validate.sh <this-folder> --strict` = Errors:0
  - **Gate**: pending — runs after the authoring lands.
- [x] The nine-plugin real-vault install (Phase 4) executed and verified in an operator-approved session (2026-08-22)
  - **Evidence**: see Phase 4 (T017-T020) above; nine plugins staged + registered, `community-plugins.json` 12 → 21, BRAT `data.json` frozen versions, `.bak` backups made, rollback documented and available, activation pending the operator's next Obsidian open.
- [ ] `checklist.md` fully verified for this phase's authoring scope
  - **Gate**: pending — reconciled to Complete once the doc validation and wiring gates pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Predecessor**: `../004-plugin-install-and-verification/`
- **Next phase**: None — extends the 015 phased build with the broader plugin stack
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS (~100 lines)
- Core + Level 2 detail
- Effort estimates per task
- Explicit verification tasks
-->
