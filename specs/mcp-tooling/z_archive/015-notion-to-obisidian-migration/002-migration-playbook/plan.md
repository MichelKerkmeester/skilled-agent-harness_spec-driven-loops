---
title: "Implementation Plan: Phase 002 — Notion→Obsidian migration playbook"
description: "Author notion-migration.md (mcp-obsidian) and migration-inventory.md (mcp-notion), wire both SKILL.md routers to them, and regenerate leaf-manifest.json — grounded in the 001 research verdict."
trigger_phrases:
  - "015 migration playbook plan"
  - "notion-migration.md plan"
  - "migration-inventory.md plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/002-migration-playbook"
    last_updated_at: "2026-08-22T03:41:25Z"
    last_updated_by: "claude"
    recent_action: "All 3 implementation phases executed and verified"
    next_safe_action: "Phase 003: build the Notion Bases plugin reference tree"
    blockers: []
    key_files:
      - "../001-deep-research/research/research.md"
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-002-migration-playbook"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Phase 002: Notion→Obsidian migration playbook

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown authoring (2 reference docs) + 2 SKILL.md router edits + 1 generated JSON manifest — no runtime code |
| **Framework** | `mcp-obsidian`/`mcp-notion` existing reference + smart-router conventions |
| **Storage** | None (docs + `leaf-manifest.json`) |
| **Testing** | `validate_document.py --type skill`, `ci-leaf-manifest-freshness.cjs`, `validate.sh --strict` |

### Overview
Two reference docs turn the 001 research verdict into an operable method: `notion-migration.md` on the `mcp-obsidian` side (reconstruction + verification, the write half of the 7-step method) and `migration-inventory.md` on the `mcp-notion` side (the read half — inventory + API gaps). Both SKILL.md smart routers gain an additive route to their new reference, and `leaf-manifest.json` is regenerated so the fleet audit stays green.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 001 research verdict read in full, §3/§4/§5/§6/§9/§10 identified as source sections
- [x] `mcp-obsidian` reference authoring shape confirmed (`references/plugins/dataview/dataview.md` as the pattern)
- [x] `mcp-notion` reference authoring shape confirmed (`references/api-gap-tools.md` as the pattern)
- [x] Both SKILL.md routers read in full; additive insertion points identified

### Definition of Done
- [x] `notion-migration.md` and `migration-inventory.md` created with the content in spec.md §4
- [x] Both SKILL.md routers edited additively (new `NOTION_MIGRATION` intent on both sides, plus §2/§8 pointers)
- [x] `leaf-manifest.json` regenerated; `ci-leaf-manifest-freshness.cjs` reports `OK mcp-tooling`
- [x] `validate_document.py --type skill` = 0 issues on all four touched/created files (reference docs via `--type feature_catalog` per spec.md's verification command)
- [x] `validate.sh <this-folder> --strict` = Errors:0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two additive reference docs plus two additive router entries — no restructuring of either skill's existing content.

### Key Components
- **`notion-migration.md`**: 8-step method → division-of-labor table → three-way recovery matrix → comment reconstruction → 11-check verification protocol.
- **`migration-inventory.md`**: 7-step inventory procedure → 5 API-gap reads → read-limit constraints.
- **Router additions**: one new/extended intent per skill, scored by migration-flavored keywords (`migration`, `migrate`, `notion import`, `obsidian import`, `relation recovery`, `rollup recovery`, `comment reconstruction`, `parity verification`).
- **`leaf-manifest.json`**: regenerated, not hand-edited.

### Data Flow
Agent migration request → SKILL.md router scores the new intent → loads `notion-migration.md` (mcp-obsidian) or `migration-inventory.md` (mcp-notion) → agent follows the cited method against the live workspace/vault in a later phase.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase, once implemented, touches two shipped skills (`mcp-obsidian`, `mcp-notion`) and one shared hub artifact (`.opencode/skills/mcp-tooling/leaf-manifest.json`). It does not touch `.utcp_config.json`, `.env.example`, `opencode.json`, `mode-registry.json`, or `hub-router.json` — no new mode is added, only new reference content inside two existing modes. This spec-authoring session itself touches nothing outside `specs/mcp-tooling/015-notion-to-obisidian-migration/002-migration-playbook/`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Re-read `research.md` §3/§4/§5/§6/§9/§10 immediately before drafting (do not draft from memory of this plan)
- [x] Re-read the `dataview.md` and `api-gap-tools.md` shape references
- [x] Confirm the current `INTENT_SIGNALS`/`RESOURCE_MAP` insertion points in both SKILL.md files are unchanged since this plan was authored

### Phase 2: Core Implementation
- [x] Author `mcp-obsidian/references/notion-migration.md`
- [x] Author `mcp-notion/references/migration-inventory.md`
- [x] Edit `mcp-obsidian/SKILL.md`: router + §8 References
- [x] Edit `mcp-notion/SKILL.md`: router + §8 References
- [x] Run `generate-leaf-manifest.cjs --write .opencode/skills/mcp-tooling`

### Phase 3: Verification
- [x] `validate_document.py --type skill` on all four touched/created files — 0 issues
- [x] `ci-leaf-manifest-freshness.cjs` — `OK mcp-tooling`
- [x] `validate.sh <this-folder> --strict` — Errors:0
- [x] Refresh `implementation-summary.md` + continuity with the actual result
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | Both reference docs, both SKILL.md | `validate_document.py --type skill` |
| Router logic | New intent scores on migration keywords without shadowing existing intents | Manual read + `rg` on `INTENT_SIGNALS` |
| Manifest freshness | `leaf-manifest.json` matches the on-disk reference set | `ci-leaf-manifest-freshness.cjs` |
| Content fidelity | Every claim in the new references traces to a cited research section | Manual cross-check against `research.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001 research verdict | Internal | Green | No source content for either reference |
| `mcp-obsidian`/`mcp-notion` current SKILL.md shape | Internal | Green | Router edit could drift from house style |
| `generate-leaf-manifest.cjs` / `ci-leaf-manifest-freshness.cjs` | Internal tool | Green | Manifest drift goes undetected |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: router edit breaks an existing intent's scoring, or the fleet audit fails after regeneration.
- **Procedure**: delete the two new reference files, revert the two SKILL.md edits, and regenerate `leaf-manifest.json` again from the reverted tree. No other skill or shared config is touched, so the blast radius is contained to `mcp-obsidian`/`mcp-notion`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──> Phase 2 (Core) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | Phase 003 (plugin-tie-in extends the same routers) |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 20 minutes |
| Core Implementation | Medium | 2-3 hours |
| Verification | Low | 30 minutes |
| **Total** | | **~3-3.5 hours** |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Both SKILL.md files backed up (git diff reviewable) before editing
- [ ] `leaf-manifest.json` diff reviewed before commit — additive only, no unrelated entries removed

### Rollback Procedure
1. **Immediate**: `git checkout -- <touched files>` if the router edit is malformed
2. **Manifest**: re-run `generate-leaf-manifest.cjs --write` after reverting content files
3. **Verify**: `ci-leaf-manifest-freshness.cjs` reports `OK mcp-tooling` on the reverted tree

### Data Reversal
- **Has data migrations?** No — documentation and one generated JSON manifest only.
<!-- /ANCHOR:l2-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Level 2 addendum
- Phase dependencies and effort estimation
- Enhanced rollback procedure
-->
