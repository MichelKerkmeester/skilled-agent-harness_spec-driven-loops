---
title: "Feature Specification: SKILL.md Template Conformance — system-deep-loop"
description: "Audit and bring every system-deep-loop SKILL.md (hub + 4 workflow packets) into conformance with sk-doc/create-skill's canonical templates; fix the concrete gaps found."
trigger_phrases:
  - "deep loop skillmd conformance"
  - "system-deep-loop template audit"
  - "sk-doc create-skill compliance sweep"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-unification/006-skillmd-template-conformance"
    last_updated_at: "2026-07-08T15:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Audit + fix workflow complete; all checkers pass"
    next_safe_action: "None — packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/SKILL.md"
      - ".opencode/skills/system-deep-loop/deep-research/SKILL.md"
      - ".opencode/skills/system-deep-loop/deep-review/SKILL.md"
      - ".opencode/skills/system-deep-loop/deep-improvement/SKILL.md"
      - ".opencode/skills/system-deep-loop/deep-ai-council/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-unification-052-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Follow-up scope: trim oversized SKILL.md files + rename non-conforming assets + fix changelog frontmatter, all via a workflow — confirmed by operator over 'document audit only'."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: SKILL.md Template Conformance — system-deep-loop

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-08 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 6 of 6 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Following the deep-loop-workflows + deep-loop-runtime merge into `system-deep-loop` (phases 001-005 of this parent packet), no pass had specifically verified that every SKILL.md under the new `system-deep-loop` tree (the hub itself, plus its 4 workflow packets — `deep-research`, `deep-review`, `deep-improvement`, `deep-ai-council`) actually conforms to the canonical templates defined in `sk-doc`'s `create-skill` module (`skill_md_template.md` for leaf/packet skills, `parent_skill_hub_template.md` for the two-axis hub).

### Purpose
Run the authoritative structural checkers (`package_skill.py --check` for leaf skills, `parent-skill-check.cjs` for the hub) against all 5 SKILL.md files, confirm or fix structural conformance, and address any concrete deviations found (word-count budget, asset naming convention, changelog frontmatter completeness) rather than relying on manual inspection.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run `package_skill.py --check` against `deep-research`, `deep-review`, `deep-improvement`, `deep-ai-council`.
- Run `parent-skill-check.cjs` against the `system-deep-loop` hub.
- Fix concrete deviations found: SKILL.md word-count budget overages (3 files), non-snake_case asset filenames (131 files in `deep-improvement/assets/`), missing changelog frontmatter `version` fields (4 files), missing frontmatter on one asset doc.
- Fix every reference (embedded JSON ids, config fixture arrays, path/prose citations) broken by the asset rename.
- Independently verify every fix (no self-certified changes).

### Out of Scope
- Rewriting closed historical records (changelog entries, archived transcripts, completed spec-folder docs) to cite renamed files — matches this session's "don't rewrite history" precedent.
- Any change to the hub's two-axis structure (`mode-registry.json`, `hub-router.json`) — the hub already passes all 34 canon checks with 0 warnings; no gap found there.
- Renaming asset-tree directory segments (e.g. `benchmark-profiles/`) — the checker only validates file basenames, not directory names; renaming directories would add risk (breaking hardcoded directory-path references) without fixing anything the checker flags.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/system-deep-loop/deep-improvement/assets/**` (131 files) | Rename | Hyphen-case → snake_case basenames |
| `.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/{default,reviewer-regression}.json` | Modify | Update `fixtures[]` array stems to match renamed files |
| Renamed skill-benchmark fixture JSON pairs | Modify | Update embedded `scenarioId`/id fields to match new stems |
| `.opencode/skills/system-deep-loop/deep-improvement/assets/skill_benchmark/fixtures/deep-loop-workflows/routing_precision.md` | Modify | Add missing frontmatter block |
| `.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.{14,15,16,17}.0.0.md` | Modify | Add missing `version` frontmatter field |
| `.opencode/skills/system-deep-loop/{deep-research,deep-review,deep-improvement}/SKILL.md` | Modify | Trim to under the 3000-word soft budget; move detail to `references/` |
| Any live path/prose reference to a renamed asset | Modify | Update to the new filename |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| REQ-001 | Every SKILL.md under `system-deep-loop` passes its correct structural checker | `package_skill.py --check` returns `Result: PASS` (0 errors) for all 4 packets and the hub; `parent-skill-check.cjs` returns 0 warnings for the hub |
| REQ-002 | No live reference to a renamed asset file is left pointing at the old name | Repo-wide check finds zero live (non-historical) hits for old filename stems |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| REQ-003 | All 131 flagged assets renamed to snake_case | `package_skill.py --check` on `deep-improvement` shows 0 snake_case warnings (excluding the `.gitkeep` edge case) |
| REQ-004 | 3 oversized SKILL.md files under the 3000-word soft budget | Each of `deep-research`, `deep-review`, `deep-improvement`'s SKILL.md word count is comfortably under 3000, with no operational content lost (verified, not assumed) |
| REQ-005 | 4 changelog files have valid `version` frontmatter | `package_skill.py --check` no longer flags missing version on these files |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 5 SKILL.md files pass their authoritative structural checker with 0 errors.
- **SC-002**: The soft warnings found at audit time (word count, asset naming, changelog frontmatter) are resolved or explicitly, narrowly deferred.
- **SC-003**: The deep-improvement skill-benchmark harness still functions correctly after the asset rename (no broken fixture resolution).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Asset rename breaks fixture resolution for the skill-benchmark/model-benchmark harness (hardcoded paths, embedded ids, config fixture arrays) | Silent benchmark harness breakage | Scoped the blast radius before renaming (glob-discovered vs hardcoded-reference audit); dispatched dedicated fix agents for content/config/prose references; independent verification agent re-checks fixture resolution end-to-end |
| Risk | SKILL.md word-count trims lose operational content | Live skills used by other agents could regress | Trim agents instructed to move-and-signpost, not delete; verification agent spot-checks that specific facts survive in either SKILL.md or the new reference file |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None outstanding — follow-up cleanup scope was confirmed by the operator (see frontmatter `answered_questions`).
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-001
REQ-002
REQ-003
REQ-004
REQ-005
**Given**
**Given**
**Given**
**Given**
**Given**
-->
