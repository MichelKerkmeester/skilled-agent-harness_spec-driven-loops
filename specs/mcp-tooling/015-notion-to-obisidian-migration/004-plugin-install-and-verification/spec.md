---
title: "Phase 004: Notion Bases + Dataview real-vault install and migration-parity verification"
description: "Plan the high-blast real-world leg: headless file-layer install of the Notion Bases and Dataview plugins into the operator's real, iCloud-synced vault, plus a shipped 11-check parity verification script. Planning only in this session — execution needs a fresh operator go-ahead and is out of scope here."
trigger_phrases:
  - "015 plugin install verification"
  - "notion bases dataview install real vault"
  - "migration parity verification script"
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
    key_files:
      - "../001-deep-research/research/research.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-004-plugin-install-and-verification"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Phase 004: Notion Bases + Dataview real-vault install and verification

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-21 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 4 of 4 |
| **Predecessor** | `003-notion-bases-plugin-tie-in` |
| **Successor** | None — closes the 015 phased build |
| **Handoff Criteria** | Notion Bases staged and registered in the operator's real vault via BRAT-headless file-layer install (executed and verified 2026-08-22); activation completes when the operator next opens Obsidian. Dataview was already installed and left untouched. `verify-notion-migration-parity.sh` (11 checks) shipped under `mcp-obsidian/scripts/`; a manual-testing scenario (`OBS-023`) documents the procedure; rollback proven reversible and remains available. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4**, the closing phase of the 015 migration capability. Phases 002-003 planned the method and the plugin knowledge; this phase plans the one leg that touches a real, persistent, iCloud-synced vault outside the repo — installing Notion Bases and Dataview so the plugin-driven reconstruction in `notion-bases/workflows.md` is actually usable, and shipping the 11-check verification script (research §10 Pass 1) that proves a migration held.

**This is a planning phase only.** It produces the spec/plan/tasks/checklist package below. **Execution of the real install is explicitly deferred and requires a fresh operator go-ahead** — per the framework's blast-radius rule, a rollback must be named and confirmation obtained before any delete/overwrite/install against a real, synced, personal vault. This spec-authoring session does not install anything, and does not read or write inside the target vault.

**Scope Boundary**: Plan the install procedure, the rollback, and the verification script only. Neither this session nor Phase 002/003 touch any vault; Phase 004's own *execution* (a future, operator-approved session) is the only leg of the whole 015 packet that does.

**Update (2026-08-22, real install executed and verified)**: the operator-approved BRAT-headless install of Notion Bases (`manifest.id: notion-bases`, `version: 1.12.0`) has since run against the real vault — see Handoff Criteria above and `implementation-summary.md` for the full verified result. Dataview was already present and was left untouched. The two paragraphs above describe this phase's original doc/script-authoring session and remain an accurate historical record of that session's own scope; they no longer describe the phase's current, now-Complete status.

**Dependencies**:
- 001 research verdict §8 (required plugins, minimum viable install: Notion Bases + Dataview), §10 (11-check verification protocol), §9 (human-required GUI vs AI-automatable split).
- Phase 003's `notion-bases/` reference tree (the plugin knowledge this install makes usable).
- `mcp-obsidian`'s existing headless-install pattern (`manual-testing-playbook/plugin-tie-ins/brat-headless-install.md`, `OBS-013`) as the stage/register/activate/verify shape.

**Deliverables** (this phase): `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`. No plugin is installed and no vault file is touched in this phase.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 003 plans the Notion Bases knowledge layer, but knowledge without the plugin installed is inert — an agent can describe a two-way relation column it cannot yet write, because neither Notion Bases nor (potentially) Dataview is confirmed present in the operator's actual vault. Separately, research §10 confirms that migration correctness cannot be claimed without an 11-check parity pass (page count, link resolution, attachment integrity, row counts, schema parity, formula accuracy, comment counts, view counts, hierarchy, property types, relation resolution) — and no such script currently exists in either skill.

### Purpose
Plan (a) a headless, file-layer install of Notion Bases and Dataview into the operator's real vault, following the BRAT scenario's stage/register/activate/verify discipline and an explicit rollback, and (b) a shipped `verify-notion-migration-parity.sh` implementing the 11 checks — so the migration capability the whole 015 packet builds toward is actually usable and independently verifiable end to end.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A manual-testing scenario (`manual-testing-playbook/plugin-tie-ins/notion-bases-dataview-install.md`, id `OBS-023`) documenting the headless file-layer install procedure for **both** plugins into the real vault at:
  `/Users/michelkerkmeester/Library/Mobile Documents/iCloud~md~obsidian/Documents/Michel Kerkmeester`
  — download the tagged GitHub release for each plugin, derive the exact plugin id from the fetched `manifest.json` (never hardcode an assumed id, mirroring `OBS-013`'s discipline), stage `main.js`/`manifest.json`/`styles.css` under `.obsidian/plugins/<id>/`, back up and update `.obsidian/community-plugins.json` to enable both ids.
- An explicit **rollback procedure**: delete both `.obsidian/plugins/<id>/` directories and remove both ids from `.obsidian/community-plugins.json`, restoring the pre-install backup.
- An explicit **blast-radius flag**: the target vault is iCloud-synced (`iCloud~md~obsidian`) and personal — writes may propagate to other synced devices before the operator can review them; Obsidian should be closed before file-layer writes, mirroring `OBS-013`.
- `mcp-obsidian/scripts/verify-notion-migration-parity.sh`: the 11-check parity verification script from research §10 Pass 1 (page existence, link validation, attachment integrity, row count, property schema parity, formula output accuracy, comment count parity, view count parity, hierarchy parity, property-type mismatch, relation resolution).
- `mcp-obsidian/scripts/README.md`: document the new script.
- `manual-testing-playbook/manual-testing-playbook.md`: register `OBS-023`.

### Out of Scope
- **Actually running the install.** This phase's own execution is a separate, future, operator-approved action — not part of this spec-authoring session, and not implied by this spec's existence. **Update**: this real-world install has since executed and been verified in an operator-approved follow-up session on 2026-08-22 — see Handoff Criteria above and `implementation-summary.md`. Running an actual Notion→Obsidian migration remains a separate future action, not part of this packet.
- Reading or inspecting the real vault's current plugin state — this session does not touch anything outside `specs/mcp-tooling/015-notion-to-obisidian-migration/`.
- A live end-to-end Notion→Obsidian migration round-trip — this phase installs the plugins and ships the verification tool; running a real migration against a real Notion workspace is a separate future action.
- Any change to `notion-bases/` reference content — Phase 003.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/plugin-tie-ins/notion-bases-dataview-install.md` | Create | `OBS-023` real-vault headless install scenario, with rollback and blast-radius flag |
| `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/manual-testing-playbook.md` | Edit | Register `OBS-023` in the index tables |
| `.opencode/skills/mcp-tooling/mcp-obsidian/scripts/verify-notion-migration-parity.sh` | Create | 11-check parity verification script (research §10 Pass 1) |
| `.opencode/skills/mcp-tooling/mcp-obsidian/scripts/README.md` | Edit | Document the new script |
| (out-of-repo, real vault) `.obsidian/plugins/<notion-bases-id>/{main.js,manifest.json,styles.css}` | Create — **future, operator-approved execution only** | Notion Bases plugin files |
| (out-of-repo, real vault) `.obsidian/plugins/<dataview-id>/{main.js,manifest.json,styles.css}` | Create — **future, operator-approved execution only** | Dataview plugin files (VERIFY: may already be present — this session did not check) |
| (out-of-repo, real vault) `.obsidian/community-plugins.json` | Edit — **future, operator-approved execution only** | Enable both plugin ids |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `OBS-023` scenario documents a plugin-id-derived (not hardcoded), stage/register/activate/verify install of both plugins into the named real vault | Scenario present; derives each id from fetched `manifest.json`; names the exact vault path |
| REQ-002 | The scenario names an explicit rollback and the iCloud/personal-vault blast-radius flag | Rollback section present (delete plugin dirs + revert `community-plugins.json`); blast-radius flag stated |
| REQ-003 | `verify-notion-migration-parity.sh` implements all 11 checks from research §10 Pass 1 | Script present; each of the 11 checks implemented or explicitly stubbed with a documented reason |
| REQ-004 | Execution of the real install is not implied or performed by this spec-authoring session | `spec.md` and `implementation-summary.md` state explicitly that no vault was touched |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `manual-testing-playbook.md` registers `OBS-023`; `scripts/README.md` documents the new script | Both edits present |
| REQ-006 | Scenario and script pass the skill-document validator | `validate_document.py --type skill` = 0 issues |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A future, operator-approved execution of `OBS-023` can install both plugins into the real vault using only the scenario's documented commands, with no hardcoded plugin id. **Met 2026-08-22**: Notion Bases installed via BRAT-headless (`manifest.id: notion-bases`, `version: 1.12.0`, derived from the fetched manifest, never hardcoded); Dataview was already present and left untouched.
- **SC-002**: `verify-notion-migration-parity.sh` runs standalone against a ledger + vault path and reports pass/fail per check.
- **SC-003**: `validate_document.py --type skill` = 0 issues; `validate.sh <this-folder> --strict` = Errors:0; no file outside `specs/mcp-tooling/015-notion-to-obisidian-migration/` was touched by this planning session.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The target vault is iCloud-synced — a file-layer write can propagate to other devices before review | High | Close Obsidian before writes (mirrors `OBS-013`); back up both JSON files first; name the rollback in the scenario itself |
| Risk | Assuming a plugin's manifest id instead of deriving it (e.g. guessing `notion-bases` vs the repo's actual id) | Med | Follow `OBS-013`'s discipline exactly: fetch the release, read `manifest.json.id`, reject any id that is not a safe folder name |
| Risk | Dataview may already be installed in this vault; treating it as a fresh install could overwrite a newer/older version the operator relies on | Med | Scenario states this as a VERIFY step at execution time — check for an existing `.obsidian/plugins/dataview/` before staging |
| Risk | The 11-check script's "row count" and "formula output" checks need a migration ledger this phase does not produce | Med | Script accepts a ledger path as input and reports those specific checks as `SKIP: no ledger provided` rather than failing silently |
| Dependency | 001 research verdict §8/§9/§10 | No source content without it | Already complete |
| Dependency | Phase 003's `notion-bases/` tree | The install has nothing to make usable without it | Phase 003 planned in this same session |
| Dependency | `OBS-013` headless-install shape | Structural drift if not mirrored | Read in full during Phase 002-003 planning |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Safety
- **NFR-S01**: Every write path in the scenario is preceded by a stated backup step and followed by a stated rollback step, matching `OBS-013`'s contract.
- **NFR-S02**: The scenario explicitly flags the vault as iCloud-synced and personal, and instructs closing Obsidian before file-layer writes.

### Consistency
- **NFR-C01**: Every one of the 11 verification checks traces to research §10; none invented beyond what the research documents.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Install Boundaries
- **Plugin already installed**: if either plugin's manifest id already has a folder under `.obsidian/plugins/`, the scenario treats this as an update-or-skip decision at execution time, not a blind overwrite.
- **Release has no `styles.css`**: optional asset, mirrored from `OBS-013`'s conditional-copy pattern.
- **Vault app is running during the write**: the scenario requires closing Obsidian first; if that's not possible, the write is deferred rather than risking a live-file conflict with iCloud sync.

### Verification Boundaries
- **No ledger available**: `verify-notion-migration-parity.sh` reports the ledger-dependent checks as `SKIP`, not `FAIL`, so the script stays runnable standalone (e.g. right after a fresh plugin install, before any migration has run).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- **RESOLVED 2026-08-22**: Dataview was already installed in the target vault; the install session left it untouched per the scenario's verify-first discipline.
- **RESOLVED 2026-08-22**: Notion Bases' `manifest.id` = `notion-bases`, `version` = `1.12.0`, derived from the fetched release manifest at execution time (never hardcoded), and it passed the safe-folder guard.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Research source**: `../001-deep-research/research/research.md`

<!-- /ANCHOR:related-docs -->

---

<!--
LEVEL 2 SPEC (~120 lines)
- Core + Level 2 addendum
- NFRs and Edge Cases added
- Verification-focused documentation
-->
