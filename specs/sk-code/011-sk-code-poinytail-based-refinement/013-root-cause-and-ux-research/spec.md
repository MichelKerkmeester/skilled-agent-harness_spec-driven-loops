---
title: "Feature Specification: Phase 13: root-cause-and-ux-research"
description: "Ten-iteration deep research into the root causes of the process errors and open product issues in the sk-code Ponytail refinement epic, and into what breaks or confuses external users who adopt this framework in their own repositories."
trigger_phrases:
  - "root cause and ux research"
  - "phase 13 root cause and ux research"
  - "external user experience research"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 13: root-cause-and-ux-research

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `worktrees/094-root-cause-ux-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 13 |
| **Predecessor** | 011-round-four-remediation |
| **Successor** | None |
| **Handoff Criteria** | `research/research.md` exists, its load-bearing claims are marked VERIFIED or INFERRED, and it ends with ranked implementation phases |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the sk-code Ponytail 5 refinement.

**Scope Boundary**: Read-only research. The run writes only under this folder. The parent `spec.md` gains one phase-map row.

**Dependencies**:
- The finished children 001 to 011 of this epic, their implementation summaries and goal logs.
- The `pi` binary with the llmgateway credential, or the cline-pass credential as the fallback route.

**Deliverables**:
- `research/research.md`, the checked synthesis with ranked implementation phases.
- The lineage state and iterations under `research/lineages/dsflash-llmgw/`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The epic shipped, but its build hit repeated process errors: a helper's `String.replace` read a dollar-apostrophe sequence as a replacement pattern, the spec validator parsed link-shaped task text, a wildcard `rm` deleted scratch helpers, generated artifacts drifted and needed re-mints, and two branches minted the same changelog version. It also left open product issues, such as a deferred canary, a pinned corpus size, failing manifest tests and advisor false positives. Nobody has traced these to the mechanism that produced them, or asked what they cost a person who installs this framework into another repository.

### Purpose
Name the root cause of each issue with evidence, and rank the smallest fixes by how much they improve the experience of external users.
### Research Findings

<!-- BEGIN GENERATED: deep-research/spec-findings -->
One ten-iteration lineage on DeepSeek V4.1 Flash (cli-pi, llmgateway, max effort) ran the research; the orchestrator re-checked every claim the phases depend on. Full synthesis: `research/research.md`.

- **Common root cause:** two copies of one fact kept in step by hand, with no reader that fails when they part. Examples: a served runtime file and its authored source, three copies of the 500 ms stdin deadline, test pins on growing sets, and a changelog version chosen from the local branch only.
- **Highest external-user impact:** the default compiled-route rebuild fails on main. `compiled-route-sync.cjs --check` exits 1 because the authored cli-classifier harness still names the removed `cli-deem` mode; the epic verified with `--verify`, which reads only the served copy. The same line causes 15 of the 16 manifest test failures.
- **Other confirmed issues:** a pinned corpus size of 80 against 86, a stale canary case left in the wrong hub, an unactionable Pi denial, silent git hooks in untrusted clones, a three-way Node floor disagreement, silent loss of late hook payloads, and local-only version minting.
- **Next phases:** nine single-file fixes ranked by external-user impact, led by deleting the stale harness line.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The process errors and open product issues named in the track brief, plus any the packet's Known Limitations, Deviations and goal logs record.
- The external-user path: setup, generated artifacts, version numbering, hook timing, routing, error messages and recovery.
- Proposed implementation phases, each naming one file and one proving command.

### Out of Scope
- Changing product code, skills, hooks or tests. Implementation is a later phase.
- The post-merge review of the epic's commits, which the sibling review track owns.
- Skill authoring ergonomics, which the sibling skill-authoring track owns.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` | Create | Deep-research config, lineage state, iterations and synthesis |
| `../spec.md` | Modify | One phase-map row for this phase |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run ten deep-research iterations on DeepSeek V4.1 Flash at max effort through cli-pi | The lineage state log holds 10 iteration records |
| REQ-002 | Mark each load-bearing claim VERIFIED or INFERRED after spot-checking it | research.md carries the marks and its SOURCE tags resolve |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Apply the overengineering rule to every proposed fix | research.md has a Rejected Ideas section with a reason per idea |
| REQ-004 | Rank proposed phases by external-user impact against cost | research.md has a Proposed Implementation Phases section; each phase names one file and one command |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each issue in the brief has a named root cause or is marked UNKNOWN with what would settle it.
- **SC-002**: No product file differs from the base commit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | llmgateway route for DeepSeek V4.1 Flash | The lineage fails at start | Switch to the cline-pass route |
| Risk | The model reports a fix or a count it did not check | A wrong root cause reaches the phases | The orchestrator spot-checks load-bearing claims and marks each one |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking the run.
<!-- /ANCHOR:questions -->

---
