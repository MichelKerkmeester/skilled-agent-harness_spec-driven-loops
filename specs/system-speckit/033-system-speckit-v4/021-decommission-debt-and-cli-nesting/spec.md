---
title: "Feature Specification: Decommission debt fixes and runtime alignment"
description: "Close the debt the memory-decommission review loop recorded, move the trigger index under runtime, and align the runtime and scripts packages with the OpenCode code standards and code-folder README contract."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Decommission debt fixes and runtime alignment

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-05 |
| **Parent Spec** | `../spec.md` |
| **Phase** | 21 of 24 |
| **Predecessor** | `../020-runtime-package-rename/spec.md` |
| **Successor** | `../022-shared-containment-helper/spec.md` |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The landing and rename packets closed with debt recorded rather than fixed: the scripts freshness table counted the trigger-index generator's fixtures as sources, the fan-out runner discarded lineage stderr, the review leaf could write iteration files at the cwd, a rollback runbook documented retired automation, a dead response type and a stale test name survived. The skill also kept two `data/` folders and its runtime and scripts code had drifted from the OpenCode code standards and code-folder README contract.

### Purpose
Every recorded debt item is fixed at source or deleted, the skill has one data folder under `runtime/`, and every code folder in `runtime/` and `scripts/` conforms to the code standards and carries a current-state code README.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The six debt items from the 052 goal log, fixed at source with tests where behavior changed.
- `data/trigger-index.json` moved to `runtime/data/`, every reader, writer and document following; the retired `search-decisions.jsonl` removed.
- The retired working-memory rollback runbook deleted with its README, alias and manifest entries.
- Code alignment of `runtime/` and `scripts/` with `sk-code-opencode` standards, behavior-preserving, by fresh agents on disjoint folder sets.
- A conforming code-folder README in every code folder of both packages.

### Out of Scope
- Nesting `scripts/` under `runtime/` - a rename on the scale of packet 053 that needs its own packet and review pass; it follows this one.
- Behavior changes in either package - alignment is stylistic and structural only; anything needing a behavior change is listed, not applied.
- The preserved set (skill advisor, shared IPC and embeddings, model server) - untouched.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `system-spec-kit/scripts/lib/dist-freshness.cjs` | Modify | Exclude `fixtures` from the scripts package sources |
| `system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Retain bounded lineage stderr and write `logs/fanout-lineage.err` |
| `.opencode/agents/deep-review.md` and mirrors | Modify | Resolve review paths against the dispatched artifact directory |
| `system-spec-kit/references/workflows/rollback-runbook.md` | Delete | Documented retired automation |
| `system-spec-kit/shared/types.ts` | Modify | Remove the unused MCP response type |
| `system-spec-kit/data/trigger-index.json` | Move | To `runtime/data/trigger-index.json` with all references |
| `system-spec-kit/runtime/**`, `system-spec-kit/scripts/**` | Modify | Standards alignment and code READMEs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every debt item recorded in packet 052's goal log is fixed or deleted, with a test where the fix changes behavior |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | The skill has one data folder, `runtime/data/`, and every reference resolves there |
| REQ-003 | Every code folder in `runtime/` and `scripts/` carries a code README that passes the sk-doc validator |
| REQ-004 | Code alignment changes no behavior: typecheck, the touched test suites and the packet gates pass before and after |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `dist-freshness.cjs check-all` stays fresh across two trigger-index runs without a re-stamp.
- **SC-002**: A failed lineage leaves a non-empty `logs/fanout-lineage.err`.
- **SC-003**: `validate_document.py` reports 0 issues on every code README in both packages; the folders without a README before this packet have one.
- **SC-004**: Typecheck of shared, scripts and runtime exits 0; the touched suites pass; validate strict passes on 052, 053 and this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `sk-code-opencode` and `sk-create-readme` contracts | Agents align to the wrong standard | Each agent reads the router and loads what it resolves before editing |
| Risk | Stylistic alignment slips into a behavior change | High | Behavior changes are forbidden in the brief; typecheck and suites run before and after; anything needing one is reported, not applied |
| Risk | Five agents collide on a file | Med | Disjoint folder sets; my own edits committed before launch |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Trigger-index lookup time unchanged by the move (same file, new path).
- **NFR-P02**: Retained lineage stderr capped at 256 KiB so a chatty child cannot grow the runner's memory.

### Security
- **NFR-S01**: No new env contract; the hook override rule stays absolute-regular-file.
- **NFR-S02**: No secrets in retained stderr beyond what the executor already prints to a terminal.

### Reliability
- **NFR-R01**: A dangling or fixture path never turns a freshness check into an error.
- **NFR-R02**: Every alignment edit is reverted if a touched suite regresses.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty stderr: `fanout-lineage.err` is written as an empty file.
- Oversized stderr: retained up to the cap, the rest drained.
- Fixture rewrite: byte-identical or not, the scripts package stays fresh.

### Error Scenarios
- Executor refusal: the refusal text lands in the lineage log instead of being lost.
- Missing runtime dist on a fresh checkout: the freshness walker skips the dangling link.
- Concurrent agents: disjoint scopes, one committer.

### State Transitions
- Partial alignment: each agent's report lists what it left untouched and why.
- Interrupted run: committed lanes stand alone; uncommitted agent edits are inspected before commit.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Two packages, about 350 source files touched stylistically, one shared runtime script |
| Risk | 10/25 | Behavior-preserving by contract; gates before and after |
| Research | 4/20 | Causes were established in the review loop |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open. The `scripts/` nesting is deferred by decision, not by uncertainty.
<!-- /ANCHOR:questions -->

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, verification, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-continuity-freshness-claim-binding/ | Bind a completion claim to one fingerprint, fix the silent skip-as-pass, extend tests | complete |
| 2 | 002-scripts-into-runtime-nesting/ | Resolution-based inventory and the executed scripts/ to runtime/cli/ move carrying phase 007 stage B; six review passes, every reproducible finding fixed and each fix commit recorded | complete |
| 3 | 003-retrieval-coverage-alignment/ | Align the trigger-index and ripgrep exclusion/root policies, add a parity test | complete |
| 4 | 004-save-and-resume-freshness/ | Save-time trigger-index staleness check; resume ladder trusts validated continuity over a newer unbound handover | complete |
| 5 | 005-hook-fallback-failure-signal/ | Machine-detectable drift signal for Codex/Devin hook fallbacks; decide the Copilot wrapper fate | complete |
| 6 | 006-orphaned-types-and-dead-modules/ | Delete or re-home seven orphaned types and two dead modules; fix two never-run tests and one empty catch | complete |
| 7 | 007-memory-command-family-naming-decision/ | Rename the memory command family into /speckit:save, /speckit:search and /doctor speckit-retrieval, hard cutover; code paths moved with phase 002 | complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-continuity-freshness-claim-binding | 002-scripts-into-runtime-nesting | [Criteria TBD] | [Verification TBD] |
| 002-scripts-into-runtime-nesting | 003-retrieval-coverage-alignment | [Criteria TBD] | [Verification TBD] |
| 003-retrieval-coverage-alignment | 004-save-and-resume-freshness | [Criteria TBD] | [Verification TBD] |
| 004-save-and-resume-freshness | 005-hook-fallback-failure-signal | [Criteria TBD] | [Verification TBD] |
| 005-hook-fallback-failure-signal | 006-orphaned-types-and-dead-modules | [Criteria TBD] | [Verification TBD] |
| 006-orphaned-types-and-dead-modules | 007-memory-command-family-naming-decision | [Criteria TBD] | [Verification TBD] |
<!-- /ANCHOR:phase-map -->
