---
title: "Phase 002: Notion→Obsidian migration playbook (mcp-obsidian + mcp-notion references)"
description: "Plan the core migration capability: a new mcp-obsidian reference carrying the 8-step migration method, the mcp-notion-reads/mcp-obsidian-writes division of labor, the relation/rollup/formula recovery matrix, comment reconstruction, and the 11-check verification protocol; plus a new mcp-notion migration-inventory reference for the 7-step inventory + 5 API-gap reads."
trigger_phrases:
  - "015 migration playbook"
  - "notion obsidian migration playbook"
  - "migration playbook reference"
  - "notion-migration.md"
  - "migration-inventory.md"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/002-migration-playbook"
    last_updated_at: "2026-08-22T03:41:25Z"
    last_updated_by: "claude"
    recent_action: "Built and verified both migration reference docs and router edits"
    next_safe_action: "Phase 003: build the Notion Bases plugin reference tree"
    blockers: []
    key_files:
      - "../001-deep-research/research/research.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-002-migration-playbook"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Phase 002: Notion→Obsidian migration playbook

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
| **Phase** | 2 of 4 |
| **Predecessor** | `001-deep-research` |
| **Successor** | `003-notion-bases-plugin-tie-in` |
| **Handoff Criteria** | `.opencode/skills/mcp-tooling/mcp-obsidian/references/notion-migration.md` and `.opencode/skills/mcp-tooling/mcp-notion/references/migration-inventory.md` exist and carry the content in §4; both SKILL.md files route to them; `leaf-manifest.json` regenerated fresh; `validate_document.py --type skill` = 0 issues on all four files. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the 015 migration capability. It builds the two reference docs that turn the 001 research verdict into an operable method — the `mcp-obsidian`-side migration method (what to reconstruct and verify after the human runs the Obsidian Importer) and the `mcp-notion`-side inventory method (what to read before the import runs). The Files to Change table below is built and verified; see `implementation-summary.md` for the build evidence.

**Scope Boundary**: Plan the two reference files and their SKILL.md routing pointers only. Phase 003 plans the Notion Bases plugin knowledge gap; Phase 004 plans the real-vault plugin install and the 11-check verification script implementation.

**Dependencies**:
- 001 research verdict (`../001-deep-research/research/research.md`), specifically §3 (mcp-notion read surface), §4 (mcp-obsidian write surface), §5 (relations/rollups/formulas recovery), §6 (files/attachments/comments), §9 (division of labor), §10 (verification protocol).
- `mcp-obsidian`'s existing plugin-reference pattern (`references/plugins/dataview/dataview.md` etc.) as the authoring shape for `notion-migration.md`.
- `mcp-notion`'s existing `references/api-gap-tools.md` as the authoring shape for `migration-inventory.md`.

**Deliverables** (this phase): the two reference docs and SKILL.md routing edits in the Files to Change table below, plus `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` recording the build.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 001 research verdict decided the flawless-migration method, but nothing in `mcp-obsidian` or `mcp-notion` carries it. An agent asked to migrate a Notion workspace today has no reference for the 8-step reconstruction method, the three-way relation/rollup/formula recovery matrix, the comment-reconstruction pattern, or the 11-check verification protocol — and no reference for the 7-step Notion inventory procedure that must run before any of it. Without these, an agent would either invent an ad-hoc method or silently drop data the research already proved is recoverable.

### Purpose
Plan two new reference docs — `mcp-obsidian/references/notion-migration.md` (the write-side reconstruction method) and `mcp-notion/references/migration-inventory.md` (the read-side inventory method) — plus the SKILL.md routing changes that make an agent discover them, so the 001 verdict becomes an operable, repeatable capability in both skills.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `mcp-obsidian/references/notion-migration.md`: the 8-step method (inventory → import → relations → rollups → formulas → files/comments → views → verification, research §9); the mcp-notion-reads / mcp-obsidian-writes division-of-labor table (§9); the three-way relation/rollup/formula recovery matrix (§5); comments → `[!comment]` callout reconstruction (§6); the 11-check verification protocol (§10, both AI and human passes).
- `mcp-notion/references/migration-inventory.md`: the 7-step inventory procedure (§3) plus the 5 API-gap reads used during inventory (file uploads, saved views, non-truncated property items, async-task polling, daily notes); the read limits that shape inventory design (25-reference truncation, title-only search, `data_source_id` vs `database_id`, ~3 req/s rate limit).
- SKILL.md routing edits in both skills: a new intent (or an extended existing intent) pointing at the new reference, added to §2 Resource Loading Levels, the router's `INTENT_SIGNALS`/`RESOURCE_MAP`, and §8 References. `mcp-notion`'s SKILL.md already carries a "Migration (packet 015)" Integration Points line and a "When NOT to Use" note pointing at packet 015 — this phase's routing edit fulfills that existing forward reference rather than introducing a new claim.
- Regenerating `.opencode/skills/mcp-tooling/leaf-manifest.json` for the two new leaves.

### Out of Scope
- The Notion Bases plugin knowledge gap (relations/rollups/views specific to that community plugin) — Phase 003.
- Installing any plugin, or any live vault/API round-trip — Phase 004.
- Editing `mcp-obsidian/SKILL.md` or `mcp-notion/SKILL.md` beyond the routing/reference additions named above — no unrelated refactor.
- Writing the actual 11-check verification script — Phase 004 (this phase only documents the 11 checks as prose in `notion-migration.md`).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/notion-migration.md` | Create | 8-step method, division-of-labor table, three-way recovery matrix, comment reconstruction, 11-check verification protocol |
| `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md` | Edit | Add `NOTION_MIGRATION` intent to §2 Resource Loading Levels / `INTENT_SIGNALS` / `RESOURCE_MAP`; add to §8 References |
| `.opencode/skills/mcp-tooling/mcp-notion/references/migration-inventory.md` | Create | 7-step inventory procedure, 5 API-gap reads used for inventory, read-limit constraints |
| `.opencode/skills/mcp-tooling/mcp-notion/SKILL.md` | Edit | Add `references/migration-inventory.md` to §2 Resource Loading Levels and the `NOTION_API_GAP` (or a new `NOTION_MIGRATION`) `RESOURCE_MAP` entry; add to §8 References; reconcile with the existing packet-015 forward references |
| `.opencode/skills/mcp-tooling/leaf-manifest.json` | Edit (regenerate) | Add the two new reference-file leaves under the `mcp-obsidian` and `mcp-notion` packets |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `notion-migration.md` carries the 8-step method, division of labor, recovery matrix, comment reconstruction, and 11-check protocol, cited to research §5/§6/§9/§10 | File present; all five content blocks present; each cites the source research section |
| REQ-002 | `migration-inventory.md` carries the 7-step inventory procedure, the 5 API-gap reads, and the read-limit constraints, cited to research §3 | File present; all three content blocks present; cites research §3 |
| REQ-003 | Both SKILL.md files route to the new references without breaking existing intents | Router additions parse; existing `INTENT_SIGNALS`/`RESOURCE_MAP` entries unmodified except the additions; no CLI claims introduced |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | `leaf-manifest.json` regenerated for the two new leaves | `generate-leaf-manifest.cjs --write` produces the two new entries; `ci-leaf-manifest-freshness.cjs` reports `OK mcp-tooling` |
| REQ-005 | Both new reference docs and both edited SKILL.md pass the skill-document validator | `validate_document.py --type skill` = 0 issues on all four files |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An agent asked "how do I migrate relations after a Notion import" reaches `notion-migration.md` through the `mcp-obsidian` router without being told to guess.
- **SC-002**: An agent asked to inventory a Notion workspace before migration reaches `migration-inventory.md` through the `mcp-notion` router.
- **SC-003**: `validate_document.py --type skill` = 0 issues; `ci-leaf-manifest-freshness.cjs` reports `OK mcp-tooling`; `validate.sh <this-folder> --strict` = Errors:0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Router additions could shadow or reorder an existing intent's score | Med | Additive-only edit: new intent/keywords appended, existing `INTENT_SIGNALS` entries untouched, re-verify with the router's own scoring logic before/after |
| Risk | `leaf-manifest.json` drifts from the fleet-audit expectation if regenerated by hand | Low | Use `generate-leaf-manifest.cjs --write`, never hand-edit the JSON |
| Risk | Content copied from research.md paraphrased loosely enough to drop a caveat (e.g. the comments gap, the 25-ref truncation) | Med | Cite the exact research section per content block; cross-check against `research.md` during review |
| Dependency | 001 research verdict | Both reference files have no source content without it | Already complete — `research.md` read in full for this phase |
| Dependency | `mcp-obsidian`/`mcp-notion` SKILL.md current router shape | Routing edit must match the existing `INTENT_SIGNALS`/`RESOURCE_MAP` pattern exactly | Both files read in full for this phase |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Consistency
- **NFR-C01**: Every claim in the new references traces to a cited research section; no new claims invented beyond what `research.md` supports.
- **NFR-C02**: The `mcp-notion` SKILL.md routing edit is additive-only — it must not alter the meaning of the existing `NOTION_API_GAP` intent for non-migration requests.

### Maintainability
- **NFR-M01**: The two reference files follow the existing per-skill reference authoring shape (`references/*.md` headed docs with the same section conventions as sibling references in each skill).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Content Boundaries
- **Ambiguous file placement**: content that could belong to either `notion-migration.md` (write side) or `migration-inventory.md` (read side) — e.g. the property-item non-truncation gap — belongs to inventory (read) with a cross-reference from the migration method, matching research §9's read/write split.
- **Router intent collision**: if a migration-flavored request also matches an existing intent (e.g. `NOTION_DATA` for "query my Notion database for migration"), the router's existing tie-break order applies; this phase does not change tie-break logic, only adds a route.

### Verification Boundaries
- **No live API/vault access in this phase**: REQ-005's validator run is a structural/document check only; no Notion or Obsidian round-trip is claimed or required to close Phase 002.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None blocking. Whether the `mcp-notion` routing edit lands as a new `NOTION_MIGRATION` intent or an extension of `NOTION_API_GAP` is an implementation-time call for whoever executes this spec; either satisfies REQ-003 as written.
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
