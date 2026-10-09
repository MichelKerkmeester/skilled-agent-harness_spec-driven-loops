---
title: "Feature Specification: Phase 1: skill-and-command-removal"
description: "Remove the sk-communication skill, its two rewrite commands, runtime mirrors and OpenCode plugin, then remove live references from active repository surfaces. Preserve the repository's historical specs and changelogs."
trigger_phrases:
  - "skill and command removal"
  - "sk-communication removal"
  - "rewrite command removal"
  - "communication projection plugin removal"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: skill-and-command-removal

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-02 |
| **Branch** | `worktrees/074-sk-communication-removal` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 of 2 |
| **Predecessor** | None |
| **Successor** | `002-communication-rule-upgrade` |
| **Handoff Criteria** | Runtime surfaces are absent; the retained route-exclusion mechanism, four prompt/skill mirror checks and final trigger-index regeneration/check have recorded passing evidence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the sk-communication removal and communication-rule upgrade packet.

**Scope Boundary**: Remove the skill package, rewrite commands, runtime mirrors, OpenCode plugin and active references assigned to this phase. Acceptance criteria are met, and the phase checks plus packet-level trigger-index verification are recorded.

**Dependencies**:
- Operator-supplied scope and the baseline commit `ecf2897455` define the removal surface.
- The rule upgrade belongs to phase 2; this phase supplies the clean runtime and reference baseline for it.
- The route-exclusion loader and filtering mechanism remain supported after the skill-specific list entry is removed.

**Deliverables**:
- The `.skilled/skills/sk-communication/` package, its package changelog and `.hermes/skills/sk-communication/` mirror are absent.
- Both rewrite commands and their runtime prompt/command mirrors are absent.
- The OpenCode projection plugin and test are absent.
- Active references, installers and route metadata no longer depend on the removed surfaces.

**Changelog**:
- Changelog files are historical records in this packet's scope and remain untouched.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The communication projection feature has several linked runtime surfaces: a skill package, two operator commands, mirrors for supported runtimes and an OpenCode plugin. Removing only the package would leave commands, routing, install steps and active documentation pointing at files that no longer exist.

### Purpose

Remove the complete runtime feature and its active integration references while preserving unrelated routing infrastructure and historical records.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Delete the skill package, its changelog directory and the Hermes skill mirror.
- Delete both rewrite commands, all runtime prompts and command mirrors, and the OpenCode plugin and test.
- Remove active references from sk-doc, advisor routing, sk-git provisioning, CI, plugin and command READMEs, root README counts and retrieval fixtures.
- Empty the advisor's skill-specific route-exclusion list while preserving the mechanism and its Vitest coverage.
- Keep the Codex, Hermes and Pi prompt generators and Hermes skill generator in sync.

### Out of Scope

- Phase 2 changes to communication rules, REPO RULES trigger rows or AGENTS §8.
- Historical records under `specs/` outside this authorized packet and historical `changelog/` files remain untouched. The skill-specific `.skilled/changelog/sk-communication/` package directory is part of the phase 1 removal set.
- The operator's global `~/.claude/CLAUDE.md`.
- Removal of the advisor route-exclusion loader or filter; only the skill-specific entry is removed.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-communication/` | Delete | Remove the 317-file skill package |
| `.skilled/changelog/sk-communication/` | Delete | Remove the skill's package changelog directory |
| `.hermes/skills/sk-communication/` | Delete | Remove the Hermes skill mirror |
| `.skilled/commands/rewrite/`, `.claude/commands/rewrite/`, `.cursor/commands/rewrite-*.md` | Delete | Remove canonical and runtime command copies |
| `.codex/prompts/rewrite-response*.md`, `.pi/prompts/rewrite-response*.md`, `.hermes/prompts/rewrite-response*.md` | Delete | Remove runtime prompt copies |
| `.opencode/plugins/sk-communication-projection.js`, `.opencode/plugins/tests/sk-communication-projection.test.cjs` | Delete | Remove the projection plugin and its test |
| `.skilled/skills/system-skill-advisor/runtime/config/route-exclusions.json` and associated test | Modify | Remove only the skill-specific exclusion entry and update focused assertions |
| Active sk-doc, sk-git, CI, README and retrieval-fixture files | Modify | Remove live references and install/provisioning support |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The skill package, its changelog directory, Hermes mirror, both rewrite commands and every runtime prompt/command mirror are absent. |
| REQ-002 | The OpenCode projection plugin and its test are absent, and no active installer, CI step, README or routing record requires them. |
| REQ-003 | A live-reference search over non-historical repository paths is empty after phase 2 completes; `specs/` and `changelog/` remain excluded from this search and untouched. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The advisor route-exclusion list no longer names the removed skill, while the exclusion mechanism still handles empty and configured lists correctly. |
| REQ-005 | Codex, Hermes and Pi prompt sync plus Hermes skill sync report no drift. |
| REQ-006 | Trigger-index fixtures and active sk-doc/infrastructure references reflect the removed feature before packet closure. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every specified runtime package, command, prompt mirror and plugin path is absent.
- **SC-002**: The four prompt/skill mirror checks and the focused advisor route-exclusions test pass.
- **SC-003**: After phase 2, the required live-reference search prints no matches outside `specs/` and `changelog/`.
- **SC-004**: No historical spec or changelog file is changed by this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Runtime prompt and skill mirror generators | Stale copies could keep deleted commands discoverable or break mirror checks | Run each canonical `--check` command and inspect generated paths |
| Dependency | Advisor route-exclusion loader and Vitest test | Removing the whole mechanism would break unrelated routing behavior | Remove only the skill-specific entry; run the focused test |
| Risk | Historical specs and changelogs contain the removed name | A broad grep can misreport historical mentions as live references | Exclude `specs/` and all `changelog/` paths in the live-reference command |
| Risk | Installers or provisioning scripts still name deleted files | Fresh setup or CI could fail even when local runtime paths are absent | Search active sk-doc, sk-git, CI and README surfaces before closure |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Removing the feature adds no runtime latency or new runtime dependency.
- **NFR-P02**: The retained advisor exclusion mechanism accepts an empty committed list without throwing.

### Security
- **NFR-S01**: No credentials, user message contents or generated response bytes are added to the replacement documentation.
- **NFR-S02**: The removal does not weaken unrelated advisor routing or installation checks.

### Reliability
- **NFR-R01**: Every supported mirror generator produces the same absence state as its canonical command/prompt source.
- **NFR-R02**: Repository setup and CI no longer install or invoke the deleted package or plugin.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty list: the advisor route-exclusion mechanism treats an empty `excludedSkillIds` list as no exclusions and continues routing other eligible skills.
- Historical path: matches inside historical `specs/` and `changelog/` are deliberately excluded from the live-reference gate; the current packet remains the only authorized spec write scope.
- Symlinked command mirror: verify the canonical source and the visible runtime target are both absent.

### Error Scenarios
- Mirror drift: a `--check` failure blocks phase handoff until canonical source and mirror state agree.
- Missing optional config: the advisor exclusion loader retains its safe empty-list behavior.
- Stale install step: CI or provisioning still requiring the deleted path blocks closure.

### State Transitions
- Partial completion: phase 1 can hand off only after deletion, cleanup and focused mirror/advisor checks are all recorded.
- Concurrent repository work: this phase's task ownership remains limited to the files listed here; phase 2 owns communication-rule edits.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 23/25 | 333 tracked deletions plus cross-runtime commands, plugin and active integration references |
| Risk | 13/25 | Generated mirrors, routing and CI can retain stale consumers if one surface is missed |
| Research | 7/20 | Removal list and phase boundary are operator-specified; command checks provide direct evidence |
| **Total** | **43/70** | **Level 2 child** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None. The authorized deletion set, active-reference boundary and history exclusions are specified in the parent packet.
<!-- /ANCHOR:questions -->

---
