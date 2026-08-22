---
title: "Verification Checklist: Phase 003 — Notion Bases plugin knowledge tie-in"
description: "Verification checklist for the notion-bases plugin reference tree build; all items verified with real command evidence after tasks.md executed."
trigger_phrases:
  - "015 notion bases plugin checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/003-notion-bases-plugin-tie-in"
    last_updated_at: "2026-08-22T04:06:26Z"
    last_updated_by: "claude"
    recent_action: "Built notion-bases 4-file tree, catalog entry, OBS-022 scenario, router intent, manifest regen"
    next_safe_action: "Phase 004: real-vault install + verification script"
    blockers: []
    key_files: ["spec.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-003-notion-bases-plugin-tie-in"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Phase 003: Notion Bases plugin knowledge tie-in

<!-- SPECKIT_LEVEL: 2 -->

<!-- NOTE: originally authored at spec-planning time with items pending. The same
session then executed tasks.md end to end; every item below now carries real
verification evidence gathered from that implementation pass. -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: `spec.md` authored with 9 sections including NFRs and Edge Cases
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: `plan.md` includes architecture, phases, effort estimate, rollback
- [x] CHK-003 [P1] Source research re-verified immediately before drafting
  - **Evidence**: `research.md` §5 (three-way recovery matrix), §7 (multi-view/hierarchy), §8 (required/optional plugins) re-read in full at implementation time, plus the underlying `research/lineages/{glm,deepseek}/iterations/` evidence §5/§7/§8 cite, before drafting any reference content (T001)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] All 4 `notion-bases/` files (plus the feature-catalog entry) pass `validate_document.py`
  - **Evidence**: `python3 .opencode/skills/sk-doc/scripts/validate_document.py <file> --type feature_catalog` = `Total issues: 0` on `notion-bases.md`, `data-model.md`, `workflows.md`, `troubleshooting.md`, and `feature-catalog/plugins/notion-bases.md` (5/5 clean; probed against sibling `OBS-013` first per the dispatch instruction)
- [x] CHK-011 [P0] Edited `SKILL.md` passes `validate_document.py --type skill` with no new warnings
  - **Evidence**: `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md --type skill` = `✅ VALID`, `Total issues: 0`
- [x] CHK-012 [P1] Router addition is additive-only — `PLUGIN_DATAVIEW` and other existing intents unaltered
  - **Evidence**: `git diff` on `SKILL.md` shows only additions — one new `Notion Bases:` block in §2, one new `PLUGIN_NOTION_BASES` entry in `INTENT_SIGNALS`, `"seventeen"→"eighteen"` in the count comment, `PLUGIN_NOTION_BASES` appended to `specific_plugin_intents`, one new `RESOURCE_MAP` entry, one appended line in the `PLUGINS` aggregate, and 4 new bullets in §8 References; every existing `PLUGIN_DATAVIEW`/other-intent line is byte-identical
- [x] CHK-013 [P1] `notion-bases/` tree structurally mirrors `dataview/` (index + data-model + workflows + troubleshooting)
  - **Evidence**: `references/plugins/notion-bases/{notion-bases,data-model,workflows,troubleshooting}.md` exist 1:1 against `references/plugins/dataview/{dataview,data-model,workflows,troubleshooting}.md`; the index follows the `feature-catalog/plugins/dataview.md` OVERVIEW/HOW IT WORKS/SOURCE FILES/GUARDRAILS shape per the dispatch instruction
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] REQ-001 through REQ-005 acceptance criteria met
  - **Evidence**: REQ-001 — 4/4 `notion-bases/` files present, each citing research §5/§7/§8. REQ-002 — `workflows.md` §7 "Dataview Supplement" section present, citing the research §5 supplement finding. REQ-003 — `PLUGIN_NOTION_BASES` present in `INTENT_SIGNALS`/`RESOURCE_MAP`/`PLUGINS`; `PLUGIN_DATAVIEW` and all other intents unmodified (CHK-012). REQ-004 — `feature-catalog/plugins/notion-bases.md` and `OBS-022` both present; `manual-testing-playbook.md` index updated. REQ-005 — `leaf-manifest.json` regenerated, `ci-leaf-manifest-freshness.cjs` reports `OK mcp-tooling`, all validator runs 0 issues
- [x] CHK-021 [P0] `validate.sh <this-folder> --strict` reports Errors:0
  - **Evidence**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/mcp-tooling/015-notion-to-obisidian-migration/003-notion-bases-plugin-tie-in --strict` → `Summary: Errors: 0  Warnings: 0` / `RESULT: PASSED`
- [x] CHK-022 [P1] `ci-leaf-manifest-freshness.cjs` reports `OK mcp-tooling`
  - **Evidence**: `node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs` → `OK    mcp-tooling  <hash>` line present; `checked=13 fresh=13 failed=0`
- [x] CHK-023 [P1] `PLUGIN_NOTION_BASES` and `PLUGIN_DATAVIEW` score correctly on 3 disambiguation phrases (e.g. "notion bases rollup" vs "dataview rollup")
  - **Evidence**: replaying `SKILL.md`'s scoring function against the two intents' real keyword lists: `"notion bases rollup"` → notion_bases=10, dataview=0 (routes `PLUGIN_NOTION_BASES`); `"dataview rollup"` → notion_bases=0, dataview=5 (routes `PLUGIN_DATAVIEW`); `"two-way relation in my notion bases database"` → notion_bases=10, dataview=0 (routes `PLUGIN_NOTION_BASES`) — no cross-contamination on any of the 3 phrases
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

<!-- Not applicable: this phase authors new reference content, not a bug fix.
Items below are answered N/A with the reasoning, kept for template-structure
compliance rather than left blank. -->

- [x] CHK-FIX-001 [P0] Finding class assigned, if applicable
  - **Evidence**: N/A — see `spec.md` §3 Out of Scope: green-field authoring, not a fix
- [x] CHK-FIX-002 [P0] Same-class producer inventory, if applicable
  - **Evidence**: N/A — no producer class exists per `spec.md` §3 Out of Scope
- [x] CHK-FIX-003 [P0] Consumer inventory for changed helpers/policies/schema/docs/tests
  - **Evidence**: consumers listed in `spec.md` §3 Files to Change; covered by CHK-012
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
  - **Evidence**: see `spec.md` §3 Files to Change — docs-only, no token or credential surface
- [x] CHK-031 [P0] No unsafe path handling introduced
  - **Evidence**: no scripts appear in `spec.md` §3 Files to Change (docs + generated JSON only)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/checklist synchronized with the actual implementation
  - **Evidence**: `spec.md` Status → Complete and Phase Context rewritten to reflect the build; `tasks.md` T001-T017 and Completion Criteria all `[x]`; this `checklist.md` reconciled with real evidence; `_memory.continuity` blocks (`recent_action`/`next_safe_action`/`completion_pct`) updated consistently across all four docs
- [x] CHK-041 [P1] `implementation-summary.md` honestly frames the actual final state
  - **Evidence**: `implementation-summary.md` rewritten post-build with the real files-changed table, validator evidence, and an explicit "no plugin installed / no vault touched" scope note
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files created outside a scratch directory
  - **Evidence**: the `OBS-022` scenario's file-layer dry run used `/tmp/_pbtest-notion-bases-relation-rollup` exclusively and removed it with `rm -rf` at the end; no other temp path was created
- [x] CHK-051 [P1] No files touched outside the 9 items named in `spec.md` §3 Files to Change plus this spec folder
  - **Evidence**: `git status --short` for the implementation session shows changes limited to the `notion-bases/` reference tree (4 files), the feature-catalog entry, the `OBS-022` scenario, `manual-testing-playbook.md`, `SKILL.md`, `leaf-manifest.json`, and this `003-notion-bases-plugin-tie-in/` folder; no pre-existing dirty file (`INSTALL-GUIDE.md`, other READMEs, `references/mcp-tools.md`, `references/troubleshooting.md`, `.utcp_config.json`, other specs) was touched
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 9 | 9/9 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-08-21/22 (spec-authoring pass, then implementation pass in the same session)
**Verified By**: AI Assistant (Claude) — implementation session
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
