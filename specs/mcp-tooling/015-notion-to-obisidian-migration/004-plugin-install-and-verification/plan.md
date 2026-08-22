---
title: "Implementation Plan: Phase 004 — Notion Bases + Dataview real-vault install and verification"
description: "Plan the OBS-023 headless install scenario for the real vault, its rollback, and the 11-check verify-notion-migration-parity.sh script. Planning only; execution needs a fresh operator go-ahead."
trigger_phrases:
  - "015 plugin install plan"
  - "verify-notion-migration-parity plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/004-plugin-install-and-verification"
    last_updated_at: "2026-08-21T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Spec/plan/tasks/checklist authored from the 001 research verdict; no install has run"
    next_safe_action: "Get operator go-ahead, then run tasks.md against the real vault"
    blockers: []
    key_files:
      - "../001-deep-research/research/research.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-004-plugin-install-and-verification"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Phase 004: Notion Bases + Dataview real-vault install and verification

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | 1 manual-testing scenario (bash-documented, `curl`/`jq`) + 1 shipped bash verification script + 1 edited index + 1 edited README |
| **Framework** | `OBS-013`'s stage/register/activate/verify BRAT-install pattern, generalized to two plugins and a real (non-throwaway) vault |
| **Storage** | Real vault `.obsidian/` JSON files (execution-time only, out of repo) |
| **Testing** | `validate_document.py --type skill`, `shellcheck` on the new script, `validate.sh --strict` |

### Overview
Plan an `OBS-023` scenario that installs Notion Bases and Dataview into the operator's real vault the same way `OBS-013` installs a BRAT beta plugin — fetch the exact release, derive the plugin id from `manifest.json`, stage the three asset files, back up and update `community-plugins.json` — generalized to two plugins and a real, persistent, iCloud-synced vault instead of a throwaway fixture. Plan the 11-check `verify-notion-migration-parity.sh` script from research §10 alongside it. **This plan documents the procedure; it does not execute it.**
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 001 research verdict §8/§9/§10 read and cited
- [x] `OBS-013` (`brat-headless-install.md`) read in full as the stage/register/activate/verify shape
- [x] Real vault path confirmed from the dispatch instruction: `/Users/michelkerkmeester/Library/Mobile Documents/iCloud~md~obsidian/Documents/Michel Kerkmeester`
- [x] Phase 003's `notion-bases/` tree planned as the knowledge this install makes usable

### Definition of Done
- [ ] `OBS-023` scenario created with rollback + blast-radius flag, following `spec.md` §4 REQ-001/REQ-002
- [ ] `verify-notion-migration-parity.sh` created implementing all 11 checks (REQ-003), with `SKIP` (not `FAIL`) for ledger-dependent checks when no ledger is provided
- [ ] `manual-testing-playbook.md` and `scripts/README.md` updated
- [ ] `validate_document.py --type skill` = 0 issues; `validate.sh <this-folder> --strict` = Errors:0
- [ ] **The real install itself remains unexecuted** until a future session receives an explicit operator go-ahead
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Generalize the existing single-plugin, throwaway-vault BRAT pattern (`OBS-013`) to a two-plugin, real-vault install, plus a standalone bash verification script — no new architecture invented.

### Key Components
- **`OBS-023` scenario**: stage (fetch release, derive id, copy 3 files) → register/activate (`community-plugins.json`) → verify (jq re-parse) → **explicit rollback** (delete plugin dirs, restore JSON backups).
- **`verify-notion-migration-parity.sh`**: 11 checks from research §10 Pass 1 — page existence, link validation, attachment integrity, row count, property schema parity, formula output accuracy, comment count parity, view count parity, hierarchy parity, property-type mismatch, relation resolution. Accepts `--vault <path>` and an optional `--ledger <path>`; ledger-dependent checks `SKIP` when the ledger is absent.

### Data Flow
Future execution session → operator go-ahead → `OBS-023` stages + activates both plugins in the real vault → later, an actual migration run produces a ledger → `verify-notion-migration-parity.sh --vault <path> --ledger <path>` reports the 11-check pass/fail report.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

**This spec-authoring session touches nothing outside `specs/mcp-tooling/015-notion-to-obisidian-migration/004-plugin-install-and-verification/`.** Once implemented (a future session), the *planning* artifacts (scenario doc + script + two index edits) touch only `mcp-obsidian`. The *execution* of the install (a separate, further future, operator-approved action) is the only leg of the entire 015 packet that writes outside the repo, into the real vault named in §3. That execution requires its own fresh go-ahead per the blast-radius rule — this plan does not grant it in advance.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Re-read `research.md` §8, §9, §10 immediately before drafting
- [ ] Re-read `OBS-013` (`brat-headless-install.md`) as the shape reference
- [ ] Re-confirm the next free `OBS-###` id (accounting for whichever of `OBS-022`/003 landed first)
- [ ] Re-confirm the real vault path against the current dispatch/operator instruction — do not assume it is unchanged

### Phase 2: Core Implementation (planning artifacts only)
- [ ] Author the `OBS-023` scenario: stage/register/activate/verify + rollback + blast-radius flag
- [ ] Author `verify-notion-migration-parity.sh`: 11 checks, `--vault`/`--ledger` flags, `SKIP` for ledger-dependent checks when absent
- [ ] Register `OBS-023` in `manual-testing-playbook.md`
- [ ] Document the new script in `scripts/README.md`

### Phase 3: Verification (of the planning artifacts, not the real install)
- [ ] `validate_document.py --type skill` on the scenario doc — 0 issues
- [ ] `shellcheck` (or manual syntax read if unavailable) on `verify-notion-migration-parity.sh`
- [ ] `validate.sh <this-folder> --strict` — Errors:0
- [ ] Confirm no file outside this phase folder was created or edited during this session
- [ ] Refresh `implementation-summary.md` + continuity with the actual result

### Phase 4 (future, separate session — NOT part of this plan's scope): Real install execution
- Obtain an explicit, fresh operator go-ahead naming the rollback
- Run the `OBS-023` scenario against the real vault
- Confirm both plugins enabled; run `verify-notion-migration-parity.sh` against a live migration ledger once one exists
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | Scenario doc, README edit | `validate_document.py --type skill` |
| Script syntax | `verify-notion-migration-parity.sh` | `shellcheck` (or manual read) |
| Content fidelity | All 11 checks trace to research §10; rollback matches `OBS-013`'s shape | Manual cross-check |
| Scope containment | No file outside this phase folder touched during planning | `git status` before/after this session |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001 research verdict §8/§9/§10 | Internal | Green | No source content |
| Phase 003's `notion-bases/` tree | Internal | Planned | Install has nothing to make usable without it |
| `OBS-013` shape | Internal | Green | Structural drift |
| Operator go-ahead for the real install | External — **future** | Not yet requested | Real install execution stays blocked indefinitely, by design |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger (planning artifacts)**: scenario or script found unsafe on review.
- **Procedure (planning artifacts)**: delete the scenario doc and script, revert the two index edits. Contained to `mcp-obsidian`.
- **Trigger (real install, future execution only)**: either plugin misbehaves, or the operator wants to undo.
- **Procedure (real install, future execution only)**: delete `.obsidian/plugins/<notion-bases-id>/` and `.obsidian/plugins/<dataview-id>/`, restore `.obsidian/community-plugins.json` from its pre-install backup.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──> Phase 2 (Core) ──> Phase 3 (Verify) ──> [future] Phase 4 (Real install)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | Real install (future, gated on operator go-ahead) |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 20 minutes |
| Core Implementation (planning artifacts) | Medium-High | 3-4 hours |
| Verification (of planning artifacts) | Low | 30 minutes |
| Real install execution (future, separate, gated) | Low-Med | 15-20 minutes, once approved |
| **Total (this phase's own scope)** | | **~3.5-4.5 hours** |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Scenario explicitly states the vault path, the derived-not-assumed plugin ids, and the backup step before any write
- [ ] Script defaults to a dry-run-safe report (read-only checks) with no vault-mutating flag

### Rollback Procedure
1. **Planning artifacts**: `git checkout -- <touched files>` if malformed
2. **Real install (future only)**: delete both plugin directories, restore `community-plugins.json` from backup, confirm Obsidian reloads clean
3. **Verify**: re-run the scenario's own verify step against the restored state

### Data Reversal
- **Has data migrations?** No, for this phase's own planning scope. The future real-install execution creates two plugin directories and one JSON edit in a real vault, fully reversible per the rollback above.
<!-- /ANCHOR:l2-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Level 2 addendum
- Phase dependencies and effort estimation
- Enhanced rollback procedure
-->
