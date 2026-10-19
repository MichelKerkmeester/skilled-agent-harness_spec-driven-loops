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
| **Status** | Complete |
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

**Executor (D6)**: DeepSeek (DeepSeek V4.1 Flash max, through cli-devin) writes each doc change. The markdown agent persona from `.claude/agents/markdown.md` is inlined into every DeepSeek dispatch. Luna (GPT-6 Luna max fast, through cli-codex) reviews each doc change. The orchestrator runs every validator, score, package check and grep itself (scratch/decisions.txt 0).

**Frozen decisions that bind this phase**:
- D2: `opencode.json` stays in the v1 shape, with the singular `permission` map and `mcp.servers`. Docs show it that way and never show `permissions`, `plugins` or `disabled`.
- D3: Docs say that version comes from parsed `--version` output, not from the binary name. Docs show `run --standalone` for every v2 child dispatch.
- D4: Docs may warn against `opencode upgrade --major`, but they never recommend it as a step. They never tell a reader to restart the v2 background service.
- D6: Executor routing as above.
- D7: Each doc follows the sk-doc mode for its type.
- D8: Docs carry no public compatibility claim. Phase 011 writes the scoped claim.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name. No phase of this packet has a ../changelog/ folder, and none was created. The build's release note is the cli-opencode changelog entry v1.5.0.0, which this phase writes.
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

Reconciled with the work: `doc-inventory.md` lists all 41 docs this phase wrote or reviewed, one row each, with its mode, validator and results. The table groups them. Rows marked amendment joined after planning, each for the reason given (scratch/decisions.txt).

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/README.md` | Modify | The dual export, `lib/`, the v2 tests, and the audit's `opencode2` match. |
| `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` | Modify | Dispatch shapes for both versions, the binary pick that matches the resolver, the install-reference link, a cut back under the 5,000-word limit (decision 11), version 1.5.0.0. |
| `.skilled/skills/cli-external-orchestration/cli-opencode/README.md` | Modify | Overview and FAQ lines for both versions. |
| `.skilled/skills/cli-external-orchestration/cli-opencode/references/` | Modify | `cli-reference.md` (v2 column, two-row matrix, description), `providers-and-models.md` (`#variant` twins), `agent-delegation.md`, `context-budget.md`, `destructive-scope-violations.md`, `integration-patterns.md` and `opencode-tools.md` (version tags and v2 twins). |
| `.skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md` | Review | Created by phase 007. Validator exit 0, DQI 94, HVR exit 0. |
| `.skilled/skills/cli-external-orchestration/cli-opencode/assets/prompt-templates.md` | Modify | v2 renderings beside the invocations. |
| `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/` | Modify | The root page and 17 scenarios: version notes, v2 twins and v2 pass readings. |
| `.skilled/skills/cli-external-orchestration/feature-catalog/` | Modify, Create | `cli-dispatch-authorization` updated, `opencode-dual-version-dispatch` created, the root index lists it (decision 8). |
| `.skilled/skills/cli-external-orchestration/cli-opencode/changelog/v1.5.0.0.md` | Create | The build's release entry (decision 9). |
| `.skilled/skills/cli-external-orchestration/cli-devin/references/providers-and-models.md`, `cli-claude-code/references/claude-tools.md` | Modify | Sibling references that named OpenCode's v1-only flags. |
| `.skilled/command-support/deep/assets/compiled/README.md` | Modify | The manifest path phase 009 moved. |
| `.skilled/skills/system-deep-loop/runtime/scripts/README.md` | Modify | The `opencode-version.cjs` entry. |
| `.opencode/plugins/tests/README.md`, `.skilled/skills/system-deep-loop/runtime/tests/unit/README.md` | Modify (amendment) | Their test tables lacked the build's new suites (decision 10). |
| `.skilled/command-support/doctor/scripts/README.md` | Review, Modify | Phase 008's battery doc. Validated as `readme`. Its three uses of a blocked word, phase 008's own text, were replaced. |
| `/doctor:opencode` route doc | Not written | It waits for Q1 with its route entry (008 decisions 4 and 15). The battery is documented in the doctor scripts README. |
| Agent, command and support docs that phase 004 changed | Review | 32 docs, each with the same validator and HVR exit before and after 004 (decision 3). |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-external-orchestration/manifest.json` and its authored copy under `specs/sk-doc/z_archive/019-skill-routing-refactor/` | Modify (amendment) | Re-minted, because the hub's policy hash covers every packet SKILL.md byte (decision 14). |
| `.hermes/skills/cli-opencode/SKILL.md` | Regenerate (amendment) | The generated Hermes copy of SKILL.md (decision 13). |
| `doc-inventory.md` in this folder | Create | One row per doc, the findings and how each closed. |
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

- Answered: the playbook set is the 17 scenarios the v1-only search found, plus the root page (`scratch/inventory.tsv`), not the research's 20.
- Answered: the catalog home is `.skilled/skills/cli-external-orchestration/feature-catalog/`. One entry changed and one was added (decision 8).
<!-- /ANCHOR:questions -->
