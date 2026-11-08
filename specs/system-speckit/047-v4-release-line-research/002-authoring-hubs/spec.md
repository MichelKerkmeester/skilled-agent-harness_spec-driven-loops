---
title: "Feature Specification: Phase 2: authoring-hubs"
description: "Forced-depth deep research over authoring-hubs across the nineteen v4 releases, v4.0.0.0 to v4.0.2.0, for drift, misalignment, bugs, improvements, UX, over-engineering and extension ideas, each backed by file and line evidence."
trigger_phrases:
  - "authoring hubs"
  - "phase 2 authoring hubs"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: authoring-hubs

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-08 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 5 |
| **Predecessor** | 001-spec-kit-core |
| **Successor** | 003-cli-and-deep-loop |
| **Handoff Criteria** | `research/research.md` holds ranked findings with `[SOURCE: path:line]` citations, the release that introduced each one and a way to verify it, and the depth checkpoint in `decision-record.md` clears. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Deep research of the Skilled v4 release line v4.0.0.0 to v4.0.2.0: drift, bugs, alignment, over-engineering and extension opportunities specification.

**Scope Boundary**: Research only, over the authoring hubs: `.skilled/skills/sk-doc/**`, `sk-code/**`, `sk-design/**`, `sk-prompt/**` and the `/create:*`, `/design:*` and `/prompt:*` commands. Every write stays inside this folder.

**Dependencies**:
- The `/deep:research:auto` workflow and its cli-devin executor running `deepseek-v4-1-flash-max`, with the same-family fallbacks recorded in `decision-record.md`.

**Deliverables**:
- `research/research.md` with ranked, verified findings across the seven finding types.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every v4 release from v4.0.0.0 to v4.0.2.0 changed the authoring hubs: `.skilled/skills/sk-doc/**`, `sk-code/**`, `sk-design/**`, `sk-prompt/**` and the `/create:*`, `/design:*` and `/prompt:*` commands, and no pass has read the release notes, the code and the docs against each other. Drift, latent bugs, standard misalignment and over-built surfaces in this cluster are likely and unmeasured.

### Purpose
A ranked list of findings for this cluster, each typed, given a severity, cited to `file:line`, tied to the release that introduced it, and paired with a command that verifies it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ git diff --shortstat <prev>..<tag> -- .skilled/skills/sk-doc .skilled/skills/sk-code .skilled/skills/sk-design .skilled/skills/sk-prompt .skilled/commands/create .skilled/commands/design .skilled/commands/prompt
v4.0.0.0-beta.1..v4.0.0.0: 9782 files
v4.0.0.0..v4.0.0.1: 28 files
v4.0.0.1..v4.0.0.2: 254 files
v4.0.0.2..v4.0.0.3: 362 files
v4.0.0.3..v4.0.0.4 (covers .4 to .10): 466 files
v4.0.0.4..v4.0.0.11: 29 files
v4.0.0.11..v4.0.0.12: 22 files
v4.0.0.12..v4.0.0.13: 225 files
v4.0.0.13..v4.0.0.14: 382 files
v4.0.0.14..v4.0.0.15: 289 files
v4.0.0.15..v4.0.0.16: 325 files
v4.0.0.16..v4.0.1.0: 1257 files
v4.0.1.0..v4.0.2.0: 111 files
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run one `/deep:research:auto` loop over hub routers and mode registries, sk-doc validators, templates and changelog modes, sk-code modes, surfaces and quality config, sk-design chart, diagram and extract modes, sk-prompt prompt-improve and prompt-models, and the commands that route to them, ten iterations with no early stop, extended by five while the depth checkpoint fails.
- Steer every iteration toward unread releases, unprobed finding types and unverified claims, and check at least two citations per iteration.
- Close with `research/research.md`, a coverage table of release against finding type, and a strict validation pass on this folder.

### Out of Scope
- Fixing any finding - this phase researches only, and remediation belongs to packets the parent synthesis proposes.
- Surfaces owned by the sibling phases - each cluster has its own child, so overlap is cited and handed over, not researched twice.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` (this folder only) | Create | Run state, iteration files, deltas and `research.md` |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `decision-record.md` | Modify | Research charter, plan, task state, coverage table and run decisions |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The research loop records at least ten iterations of type `iteration` in its state log. | Counting `"type":"iteration"` rows in `research/deep-research-state.jsonl` gives 10 or more. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Every finding in `research/research.md` carries a type, a severity, a `[SOURCE: path:line]` tag, an introducing release and a verify step. | Reading the findings tables in `research/research.md` shows all five fields on every row. |
| REQ-003 | The coverage table in `implementation-summary.md` shows every release that touched this cluster and every finding type. | The table has one row per release range and one column per finding type. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate.sh` on this folder with `--strict` prints `RESULT: PASSED`.
- **SC-002**: The two strongest citations of every iteration were opened by the orchestrator and their verdict is logged in `decision-record.md`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | cli-devin with `deepseek-v4-1-flash-max` | No iterations run | Switch to cli-deepseek-harness, then cli-pi, then cli-opencode, all DeepSeek V4.1 Flash, and log each switch with its error. |
| Risk | An iteration restates the release notes or cites a line that does not say what it claims | Med | The orchestrator opens two citations per iteration and redirects the next focus to redo shallow ground. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Audit the Skilled v4 authoring hubs, .skilled/skills/sk-doc/**, .skilled/skills/sk-code/**, .skilled/skills/sk-design/**, .skilled/skills/sk-prompt/** and the commands in .skilled/commands/create/, .skilled/commands/design/ and .skilled/commands/prompt/, across releases v4.0.0.0 to v4.0.2.0: what drift, misalignment, bugs, UX friction, over-engineering and extension room does each release leave? The twelve key questions in `research/deep-research-strategy.md` break this down.

### Research Context

A deep-research run is active for this topic, and `research/research.md` stays the canonical synthesis.
<!-- BEGIN GENERATED: deep-research/spec-findings -->
### Research Findings

The four authoring hubs mostly do what their notes say, but their own validators are weaker than the release line claims. The skill validator stops at the first frontmatter error, so link and routing checks never run on a broken skill, and the v4.0.1.0 claim that a missing ROUTER.md fails cannot be observed on a fresh skill. Most other defects are stale indexes and counts (chart forms, command trees, agent and card mirrors) and command hints that advertise flags no asset reads. Over half of the attributable code-level defects predate v4.0.0.0; the v4 line carried them rather than introduced them.

48 findings after removing 1 withdrawn or rejected ones: 0 P0, 4 P1, 44 P2. By type: 9 bug, 18 drift, 4 misalignment, 6 ux, 3 over-engineering, 4 improvement, 4 extension.

The ranked findings live in `research/research.md`, which stays canonical.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---
