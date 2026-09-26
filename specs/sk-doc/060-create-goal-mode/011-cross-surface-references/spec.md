---
title: "Feature Specification: Phase 11: cross-surface-references"
description: "The create-goal mode shipped, but the READMEs, the markdown agent, the sk-doc feature catalog, the advisor command bridges and the create command's asset roster still listed only its siblings. This phase names it wherever the other create modes are named."
trigger_phrases:
  - "create-goal readme references"
  - "create-goal command bridge"
  - "create asset roster goal"
  - "sk-doc mode count"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 11: cross-surface-references

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-26 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 11 |
| **Predecessor** | 010-asset-templates-and-folder-readmes |
| **Successor** | None |
| **Handoff Criteria** | Every list that names the sibling create modes also names `sk-create-goal` or `/create:goal`, the advisor command-bridge projection is fresh, and the create command asset tests and the advisor metadata census pass. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the Create the sk-create-goal sk-doc mode specification. The operator asked for it on 2026-09-26, after phase 010 shipped: update the root README and the other READMEs that should name the mode, link its changelog into the `.skilled` changelog hub, and make sure it has a command like the other sk-doc create modes.

**Scope Boundary**: Documents and generated projections that enumerate the sk-doc create modes or their commands, plus the two tests that pin those enumerations. The mode's own files stay unchanged.

**Dependencies**:
- Phase 010 shipped the mode at 1.1.0.0.
- The operator chose to work on the current branch in the main checkout.

**Deliverables**:
- The root README, the sk-doc hub README, the `@markdown` agent and its mirrors, and the sk-doc feature catalog name the mode.
- A fresh advisor command-bridge projection that carries `/create:goal`.
- A create command asset roster and an advisor metadata census that count the goal command.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The mode was reachable, yet a reader of the root README, the sk-doc hub README, the `@markdown` agent or the sk-doc feature catalog would not learn it exists, and the root README still counted fourteen modes. The advisor's command-bridge projection was never regenerated after `/create:goal` joined `command-metadata.json`, so its freshness check failed, and the advisor metadata census and the create command asset roster both still counted the commands as they were before.

### Purpose
Name `sk-create-goal` everywhere its siblings are named and bring every projection and census that counts the create commands back in step.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The root README's sk-doc summary and CREATE section, and the sk-doc hub README's description, command list, FAQ and related-documents table.
- The `@markdown` agent's valid-command list, count and template map, carried to every runtime copy.
- Both sk-doc feature-catalog files that list the workflow modes and count the packets.
- Regenerating the advisor command-bridge projection, with the memory-save wording already committed in the TypeScript projection moved into its authored input so regeneration keeps it.
- The advisor metadata census and the create command asset roster.

### Out of Scope
- The `.skilled/changelog/sk-doc/create-goal` symlink. It already existed from the first mode commit and resolves to both releases.
- The `/create:goal` command files and their runtime mirrors. They already match every sibling's set.
- Regenerating the trigger index. The main checkout holds other sessions' uncommitted spec folders, whose phrases would leak into a committed index.
- The root README's CREATE section omitting other existing commands, and its stale `/create:testing-playbook` name.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `README.md` | Modify | Mode count, a goal-authoring line and a `/create:goal` entry |
| `.skilled/skills/sk-doc/README.md` | Modify | Description, overview, command list, FAQ and related-documents row |
| `.skilled/agents/markdown.md` and its Claude, Pi, Codex and Hermes copies | Modify | Valid command, count and template-map row |
| `.skilled/skills/sk-doc/feature-catalog/feature-catalog.md`, `packet-authored-registry-routing/packet-authored-registry-routing.md` | Modify | Mode list and counts |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json` | Modify | Memory-save wording moved into the authored input |
| `command-bridges.generated.json`, `lib/scorer/projection.ts`, `scripts/skill_advisor.py` | Regenerate | The `/create:goal` bridge |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-metadata-e2e.vitest.ts` | Modify | Census 20 to 21 |
| `.skilled/commands/create/assets/tests/fixtures/emitted-name-contract.json`, `test_emitted_name_contract.py` | Modify | Roster rebuilt from disk, YAML count 26 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The root README and the sk-doc hub README name `sk-create-goal` or `/create:goal` wherever they list the sibling create modes or commands, and their counts match `mode-registry.json`. |
| REQ-002 | `derive-command-bridges.cjs --check` reports `fresh`, the projection carries `/create:goal`, and no committed bridge wording changes. |
| REQ-003 | The create command asset tests and the advisor metadata census pass. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The `@markdown` agent lists `/create:goal` with its templates, and every runtime copy stays in sync. |
| REQ-005 | The sk-doc feature catalog lists `sk-create-goal` and counts fifteen modes across fourteen packets. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `python3 -m unittest discover .skilled/commands/create/assets/tests` passes 13 of 13.
- **SC-002**: `derive-command-bridges.cjs --check` reports `"status": "fresh"`.
- **SC-003**: `validate.sh specs/sk-doc/060-create-goal-mode --recursive --strict` prints `RESULT: PASSED` for all 12 folders.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Regenerating the bridges overwrites the hand-edited memory-save wording | The TypeScript scorer loses the `/speckit:save` keywords | The wording moves into `scoring-compatibility.json`, so the regenerated projection matches the committed one |
| Risk | Another session edits the advisor runtime at the same time | A commit picks up its files | Stage only the files named in this spec |
| Dependency | The live skill graph | The divergence ratchet reads it | Compare the Python scorer before and after on the failing prompt |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The new bridge is disabled in both scorers, so no prompt's scoring changes.

### Security
- **NFR-S01**: No credential, session state or goal state is written.

### Reliability
- **NFR-R01**: Every changed test counts what is on disk, so a later mode change fails it loudly instead of passing silently.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- The asset roster had drifted before this phase: it still named six chart and diagram assets that moved to sk-design. Rebuilding it from disk removes them.

### Error Scenarios
- The bridge deriver fails closed on a duplicate or malformed authored entry, and leaves the projection untouched.

### State Transitions
- The Cursor and Devin agent copies are symlinks to the Claude copy, so editing the Claude copy updates them.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | About 17 files across docs, agents, the advisor and command tests |
| Risk | 8/25 | Advisor scoring blocks are regenerated, with no scoring change |
| Research | 5/20 | Finding every list that names the create modes |
| **Total** | **25/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The operator chose the current branch in the main checkout on 2026-09-26.
<!-- /ANCHOR:questions -->

---
