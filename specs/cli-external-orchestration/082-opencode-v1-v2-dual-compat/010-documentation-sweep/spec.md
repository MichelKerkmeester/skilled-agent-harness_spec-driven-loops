---
title: "Feature Specification: Phase 10: documentation-sweep"
description: "Bring every doc that the OpenCode build changes or needs up to its sk-doc mode. Each touched doc gets a validator pass, a quality score and a human-voice pass."
trigger_phrases:
  - "documentation sweep"
  - "phase 10 documentation sweep"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 10: documentation-sweep

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-10-18 |
| **Branch** | `scaffold/010-documentation-sweep` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 11 |
| **Predecessor** | 009-sk-code-opencode-alignment |
| **Successor** | 011-two-version-proof-and-closeout |
| **Handoff Criteria** | Every touched doc exits 0 from its validator, every changed skill, hub and playbook package exits 0 from its package check and no touched doc describes the v1-only dispatch shape as universal. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the OpenCode v1 and v2 dual compatibility build specification.

**Scope Boundary**: The docs that phases 002 to 009 change or need. Each doc goes through the sk-doc mode for its type, and that mode's validator gates it. This phase changes no code. It does not write the public compatibility claim, because phase 011 writes that claim under D8.

**Dependencies**:
- Phase 009 closed, so the code that the docs describe is settled.
- The phase 004 agent wording, the phase 006 dispatch shapes, the phase 007 install reference and the phase 008 `/doctor:opencode` route doc, which this phase reviews.
- The sk-doc hub and its packets under `.skilled/skills/sk-doc/`, which set each mode and its validator.

**Deliverables**:
- Updated code-folder READMEs, cli-opencode skill docs, playbook scenarios, catalog entries and changelog entries, each written through its sk-doc mode.
- `doc-inventory.md` in this folder, with one row per touched doc. Each row names its mode, its validator, its DQI score and its human-voice result.
- A reviewed `install-and-versions.md` and `/doctor:opencode` route doc, validated under their modes.

**Executor (D6)**: DeepSeek (DeepSeek V4.1 Flash max, through cli-devin) writes each doc change. The markdown agent persona from `.claude/agents/markdown.md` is inlined into every DeepSeek dispatch. Luna (GPT-6 Luna max fast, through cli-codex) reviews each doc change. The orchestrator runs every validator, score, package check and grep itself.

**Frozen decisions that bind this phase**:
- D2: `opencode.json` stays in the v1 shape, with the singular `permission` map and `mcp.servers`. Docs show it that way and never show `permissions`, `plugins` or `disabled`.
- D3: Docs say that version comes from parsed `--version` output, not from the binary name. Docs show `run --standalone` for every v2 child dispatch.
- D4: Docs may warn against `opencode upgrade --major`, but they never recommend it as a step. They never tell a reader to restart the v2 background service.
- D6: Executor routing as above.
- D7: Each doc follows the sk-doc mode for its type.
- D8: Docs carry no public compatibility claim. Phase 011 writes the scoped claim.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The build changes the cli-opencode dispatch shape, the install steps, the plugin layout and the agent and command trees. The cli-opencode docs describe one v1 dispatch shape. Some of them pin v1.3.17, and some use flags that v2 `run` does not have, such as `--command`, `--dir`, `--share`, `--port` and `--pure` (`research/research.md` section 6). A reader who copies those lines on v2 gets a broken command, with no warning.

### Purpose
Every doc that the build touched or needed passes its sk-doc validator and its package check, scores 75 or higher on DQI and describes both versions wherever it describes dispatch.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Code-folder READMEs for the code that phases 002 to 008 changed, through the readme mode.
- The cli-opencode `SKILL.md`, `README.md`, references and assets that encode dispatch shape, through the skill mode.
- The manual testing playbook scenarios that name the v1 flag set, through the playbook mode.
- Feature catalog entries for the plugin and dispatch changes, through the catalog mode.
- Changelog entries for the build, through the changelog mode.
- A human-voice pass and a DQI score on every touched doc.
- Validation of the `/doctor:opencode` route doc that phase 008 writes in command mode.

### Out of Scope
- Code changes. Phase 009 owns code, and a doc finding that needs a code fix goes back to phase 009.
- The public compatibility claim. Phase 011 writes it under D8.
- The nine irreducible gaps. Phase 007 documents them, and this phase links to that reference rather than rewriting it.
- Docs for skills that the build did not touch.
- Rewriting prose only to raise a DQI score.

### Files to Change

The paths below are known from the phase plans and research. The final list comes from `doc-inventory.md`, which T001 builds from the 002 to 008 diffs and a grep.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/README.md` | Modify | Code-folder README through readme mode. Covers the plugin shape, the v2 `setup` leg and the test layout. |
| `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` | Modify | Dispatch shape at the line sites that `research/iterations/iteration-013.md` F7 lists. The version guard fix from phase 006 lands here too. |
| `.skilled/skills/cli-external-orchestration/cli-opencode/README.md` | Modify | Overview lines that describe a v1-only dispatch shape. |
| `.skilled/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md` | Modify | Flag table with a v2 column. The version pin becomes a two-row matrix. |
| `.skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md` | Modify | Every `--variant` example gains its v2 `#variant` twin. |
| `.skilled/skills/cli-external-orchestration/cli-opencode/assets/prompt-templates.md` | Modify | The six rendered invocations gain a v2 rendering. |
| `.skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md` | Review | Created by phase 007. Validated here under the skill reference mode. |
| `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/` | Modify | Scenarios that name the v1 flag set. The set comes from the grep in T004. |
| `.skilled/skills/cli-external-orchestration/feature-catalog/` | Modify | Catalog entries for the plugin and dispatch changes. The exact entries come from the phase 002 to 008 diffs. |
| `.skilled/skills/cli-external-orchestration/cli-opencode/changelog/` | Create | Changelog entry for the build, through the changelog mode. |
| `.skilled/commands/doctor/` route doc for `/doctor:opencode` | Review | Written by phase 008 in command mode. Validated here. |
| Agent and command files that phase 004 changed | Review | Validated through the sk-doc agent or command mode. The wording comes from phase 004. |
| READMEs in script folders that phases 002 to 008 changed | Modify | Code-folder READMEs through the readme mode, code_folder type. |
| `doc-inventory.md` in this folder | Create | One row per touched doc, with its mode, validator, DQI and human-voice result. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every touched doc exits 0 from the validator named by its sk-doc mode. |
| REQ-002 | Every changed skill, hub and playbook package exits 0 from its sk-doc package check. |
| REQ-003 | No touched doc describes a v1-only dispatch shape as universal. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Every touched doc scores 75 or higher on DQI, read from `extract_structure.py` output. |
| REQ-005 | Every touched doc passes `hvr_scan.py` with exit status 0, and its manual human-voice pass is recorded. |
| REQ-006 | Each doc follows the sk-doc mode named for its type (D7). |
| REQ-007 | Each version-specific claim names 1.19.3 or 2.0.32, or it says the claim is unverified. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every touched doc exits 0 from its validator.
- **SC-002**: Every changed package exits 0 from its package check.
- **SC-003**: A search for the v1-only flags finds them only on lines that name version 1.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 009 closed | The docs describe code that is still moving | Start only after phase 009 closes |
| Dependency | `.claude/agents/markdown.md` persona | DeepSeek lacks the doc standard | Inline the persona into every DeepSeek dispatch brief |
| Dependency | cli-devin (DeepSeek) and cli-codex (Luna) | A dispatch fails or times out | Retry the same brief once, then record the failure and stop that doc |
| Risk | The playbook file set is wider or narrower than the research count | A stale scenario ships | The T004 grep sets the set. The research count is not trusted (Med) |
| Risk | A doc is trimmed only to raise its DQI score | Content the reader needs disappears | Raise the score through structure and style only (Med) |
| Risk | A doc states the public claim early | The claim lands before the phase 011 proof | Write no claim here. A grep in tasks.md confirms it (Med) |
| Risk | The validator passes while the prose still describes v1 only | A green gate hides wrong content | The REQ-003 search reads each hit, not only the exit status (High) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The validators and scorers run offline. `validate_document.py` makes no model call unless its `--jev` backend flag is set.
- **NFR-P02**: Each dispatch covers one doc or one small doc group, so each brief stays short.

### Security
- **NFR-S01**: Docs carry no provider key, session token or other secret value.
- **NFR-S02**: Docs show `opencode.json` in the v1 shape only, and they show no secret value in it.

### Reliability
- **NFR-R01**: A validator rerun on the same file gives the same exit status.
- **NFR-R02**: DQI is read from `extract_structure.py` output and never estimated by hand.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: A file in the inventory that needs no change is still validated, and its row says unchanged.
- Maximum length: The sk-doc mode sets the limit. This phase does not trim content only to pass a score.
- Invalid format: A frontmatter error is fixed first, because later checks read the frontmatter.

### Error Scenarios
- External service failure: A dispatch fails. Retry the same brief once. If it fails again, record it and stop that doc.
- Network timeout: A timed-out dispatch counts as failed. Claim no partial doc.
- Concurrent access: Each doc belongs to one dispatch at a time. The orchestrator assigns the docs.

### State Transitions
- Partial completion: Some docs pass and others do not. The inventory shows each state, and the phase stays In Progress.
- Session expiry: Resume from `doc-inventory.md` and the open checkboxes in `tasks.md`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | About 20 playbook files, plus the cli-opencode docs, catalog entries, changelog and READMEs. The inventory sets the exact count. |
| Risk | 10/25 | Docs can mislead an operator about dispatch. There is no code risk. |
| Research | 8/20 | The sk-doc validators and modes are known. The flag set is listed in research. |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- The research names 20 playbook files. Its own grouped list sums to 21 before the `intra-routing-recall` group, and the named group folders now hold 34 files. The T004 grep sets the real set, and this packet follows that grep rather than either number.
- The plugins have no feature catalog folder of their own. The candidate is `.skilled/skills/cli-external-orchestration/feature-catalog/`. The phase 002 to 008 diffs confirm which entries change.
<!-- /ANCHOR:questions -->
