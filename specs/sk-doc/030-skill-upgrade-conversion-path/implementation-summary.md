---
title: "Implementation Summary: Skill Upgrade / Single-to-Parent Conversion Path"
description: "Phase 1 adopter upgrade guide shipped and verified; Phase 2 promote operation deferred."
trigger_phrases:
  - "skill upgrade summary"
  - "single to parent summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/030-skill-upgrade-conversion-path"
    last_updated_at: "2026-08-15T11:59:34Z"
    last_updated_by: "claude-code"
    recent_action: "Phase 1 guide shipped and verified"
    next_safe_action: "Phase 2 promote op if adopter demand appears"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Skill Upgrade / Single-to-Parent Conversion Path

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 030-skill-upgrade-conversion-path |
| **Completed** | 2026-08-15 |
| **Level** | 2 |
| **Actual Effort** | ~3.5 hours (estimated: 3-4 hours) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An adopter-facing upgrade guide, plus its cross-links, so downstream adopters can reconcile their own customized skills to the v4 parent-skill format. The guide gives the convert-vs-keep-single decision rule; the ordered single→parent procedure using existing tooling only, each step naming the failure it prevents; the concrete adopter cases (`sk-code` convert-to-parent OR keep-own-single; `sk-git` single OR promote); and an explicit repo-agnostic list warning adopters not to over-migrate.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md` | Created | The adopter upgrade guide (257 lines) |
| `.opencode/skills/sk-doc/sk-create-skill/SKILL.md` | Modified | References-section cross-link |
| `.opencode/skills/sk-doc/sk-create-skill/README.md` | Modified | Cross-link in overview + references |
| `.opencode/skills/sk-doc/leaf-manifest.json` | Modified | Registered the new reference as a declared leaf |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Dispatched read/write to cli-cursor `cursor-grok-4.6-xhigh` in an isolated detached worktree (`--auto-review --sandbox enabled`), scope-locked with an explicit banned-operations list (no git, no deletes, only the guide plus the two cross-links). The executor's output was reviewed against clean HEAD, then the four files were integrated into the main tree. The sk-doc `leaf-manifest.json` was refreshed so the new reference registers as a declared leaf. Packet docs were then conformed to the live Level-2 templates and metadata regenerated with `generate-description.js` + `backfill-graph-metadata.js`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Doc-only Phase 1, code Phase 2 deferred | The manual path is fully expressible in a guide; a `promote` command is only worth building on observed adopter demand |
| cli-cursor `cursor-grok-4.6-xhigh` executor | Switched from cli-devin per operator; read/write in an isolated worktree |
| Read-only worker, parent integrates | Executor scope-locked (no git, no deletes); output reviewed against clean HEAD before integrating |
| Cite existing tooling only | Avoids inventing a command surface; every step uses a real `/create:*` operation |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| package_skill --check | Pass | sk-doc package | `validate_skill_package.py` |
| parent-skill-check | Pass | one-identity + leaf-manifest | Was FAIL on HEAD for the new leaf; leaf-manifest refresh fixed it |
| compiled-routing | Fail (pre-existing) | sk-doc activation snapshot | Identical `causeCode: compile-error` on clean HEAD; unrelated to this doc |
| Surface accuracy | Pass | every cited command/flag/path | All confirmed present in repo |

### Command Surface Confirmed

| Command / Path | Exists |
|----------------|--------|
| `/create:skill`, `/create:skill-parent` | Yes |
| `validate_skill_package.py` | Yes |
| `mode-registry.json`, `hub-router.json`, `graph-metadata.json` | Yes |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-R01 | No invented surface | Every cited command/path verified | Pass |
| NFR-R02 | One-identity invariant preserved | Procedure keeps one hub `graph-metadata.json` | Pass |
| NFR-S01 | Guide instructs, never mutates | Instructional prose only | Pass |
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Compiled-routing FAIL is pre-existing** and out of scope — it needs the sk-doc compiled-routing activation snapshot regenerated (a runtime task, not a doc change).
2. **Phase 2 not built** — the optional `/create:skill-parent promote` operation (seed a mode packet from an existing single skill) remains a follow-on; tracked in `tasks.md` (T013–T015).
3. **Metadata regeneration** — `description.json` / `graph-metadata.json` were regenerated with `generate-description.js` + `backfill-graph-metadata.js`; re-run after any further doc edits.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| cli-devin (`grok-4-6-xhigh`) executor | cli-cursor (`cursor-grok-4.6-xhigh`) | Operator directed the switch |
| Hand-written lean metadata stubs | Regenerated via real generators | Local generators work without the MCP daemon |
<!-- /ANCHOR:deviations -->
