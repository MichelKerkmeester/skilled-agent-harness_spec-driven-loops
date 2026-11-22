---
title: "Feature Specification: Phase 1: research"
description: "Research charter for the mcp-browser-use hub: a ten-iteration deep-research run that settles capability, lane rules, hub contract, blast radius, naming, macOS verification and security before anything is built."
trigger_phrases:
  - "phase 1 research"
  - "browser use hub research"
  - "bladebro research charter"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: research

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-11-21 |
| **Branch** | `worktrees/505-mcp-browser-use-hub` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 6 |
| **Predecessor** | None |
| **Successor** | 002-hub-scaffold |
| **Handoff Criteria** | `research/research.md` answers KQ1-KQ8 below, and the specs of 002-006 are refined from it |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the mcp-browser-use hub: Bladebro, Aside and Chrome DevTools browser modes specification.

**Scope Boundary**: Findings only. The run writes under `research/` in this folder and changes nothing else in the repository.

**Dependencies**:
- `/deep:research` workflow (`.skilled/commands/deep/research.md`) with the `cli-opencode` executor.
- An opencode-go login so `opencode-go/hy4-flash-free#high` resolves (`.skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md`).
- Read access to github.com/dondai44423/bladebro for upstream facts.

**Deliverables**:
- `research/research.md`: ranked answers to KQ1-KQ8 with citations.
- A synthesis section per downstream phase (002-006) that the next session uses to refine those specs.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The program has to choose a hub contract, mode names, a CLI-versus-Code-Mode rule and a migration scope before it builds anything, and none of those is settled. Bladebro is new to this repository, its live browser probes were never run on macOS upstream, and the operator works on macOS. Building first would bake guesses into registries, routers and about 45 referencing files.

### Purpose
One evidence-cited research synthesis answers the eight key questions below well enough that 002-006 can each be written as a concrete plan.

### Key Questions

| ID | Question | Answered means |
|----|----------|----------------|
| KQ1 | What can Bladebro, Chrome DevTools (`bdg` plus chrome-devtools-mcp) and Aside each do, and where does each stop? | A capability matrix with rows for page model, actions, console/network logs, HAR, heap/perf trace, Lighthouse, raw CDP, iframes, signed-in profiles, stealth; each cell cited |
| KQ2 | When does each mode use its CLI and when its MCP server through Code Mode? | One lane rule per mode, with the detection command and the fallback trigger |
| KQ3 | What hub contract does `mcp-browser-use` need? | Proposed `mode-registry.json`, `hub-router.json` and `leaf-manifest.json` shapes, the advisor `routingClass` per mode and the `packetKind` per mode, each checked against `mcp-tooling`'s files |
| KQ4 | What is the full blast radius of moving the two existing modes? | Every file outside and inside `mcp-tooling` that names them, split into hand-edit, regenerate and leave-as-history |
| KQ5 | Do the modes keep the `mcp-` prefix inside the new hub? | One naming decision with the folder, `workflowMode` and `packetSkillName` for each mode |
| KQ6 | How is Bladebro verified on macOS? | A step list from install through a live agent-browser and real-browser probe, each step with its expected output and its rollback |
| KQ7 | What are the security risks? | Findings on signed-in profiles, stealth and site terms of service, and the npm binary supply chain, each with a mitigation the 004 safety rules can quote |
| KQ8 | Should Bladebro take over Aside's deterministic signed-in work? | A yes or no with the cases that decide it |
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ for c in bladebro aside bdg; do printf '%s: ' $c; command -v $c || echo absent; done
bladebro: absent
aside: /Users/michelkerkmeester/.local/bin/aside
bdg: /opt/homebrew/bin/bdg
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run `/deep:research` for 10 iterations on `cli-opencode` with `opencode-go/hy4-flash-free` at reasoning `high` and stop policy `max-iterations`.
- Answer KQ1-KQ8 with file:line citations for local claims and URLs for upstream Bladebro claims.
- Write a per-phase synthesis that names what 002-006 should change in their draft specs.

### Out of Scope
- Installing Bladebro - the install is an operator stop-for-yes that 006 asks for.
- Editing any file outside `research/` - the deep-research runner fails a lineage whose repository changes while it runs.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` (this folder) | Create | Deep-research config, state log, iterations, dashboard and `research.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The run completes ten iterations | `research/deep-research-state.jsonl` holds 10 iteration records and `research/iterations/iteration-001.md` through `iteration-010.md` exist |
| REQ-002 | Each key question is answered to its "answered means" bar | `research/research.md` has one section per KQ1-KQ8, each ending in a stated answer |
| REQ-003 | KQ5 ends in one naming decision | `research/research.md` names the folder, `workflowMode` and `packetSkillName` for all three modes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The synthesis feeds every downstream phase | `research/research.md` has a section for each of 002-006 |
| REQ-005 | Local claims are checkable | One cited file:line, opened by the orchestrator, resolves to the quoted text |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -c '"type":"iteration"' research/deep-research-state.jsonl` prints 10.
- **SC-002**: `rg -o 'KQ[1-8]' research/research.md | sort -u | wc -l` prints 8, and each of 002-006 is named in `research/research.md`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | opencode-go login for `hy4-flash-free` | The run cannot start | Check `opencode models --standalone` lists the id first; if not, stop and ask the operator to log in |
| Risk | A repository edit during the run fails the lineage | High | Change nothing in the repository while the lineage runs |
| Risk | Upstream Bladebro moves fast (40 releases in 4 months) | Med | Pin every upstream claim to a version and read date |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None beyond KQ1-KQ8, which this phase exists to answer.
- Deep-research topic: mcp-browser-use hub: answer kq1-kq8 in spec.md (capability, lane rule, hub contract, blast radius, naming, macos verification, security, aside overlap)

**Research Context**: a deep-research run is active for this topic. `research/research.md` is the canonical synthesis and this section only points to it.
<!-- /ANCHOR:questions -->

---
