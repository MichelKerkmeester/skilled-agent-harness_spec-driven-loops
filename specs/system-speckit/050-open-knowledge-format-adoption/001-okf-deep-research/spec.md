---
title: "Feature Specification: Phase 1: okf-deep-research"
description: "Ten-iteration deep research comparing how system-spec-kit works today with Google's Open Knowledge Format, plus online source discovery, ending in a ranked adopt, adapt or reject verdict."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: okf-deep-research

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-04 |
| **Branch** | `worktrees/086-okf-adoption-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 3 |
| **Predecessor** | None |
| **Successor** | 002-baseline-and-decisions |
| **Handoff Criteria** | `research/research.md` holds a ranked verdict list and every cited source resolves |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Open Knowledge Format adoption for system-spec-kit: research, design, implementation specification.

**Scope Boundary**: Research only. No spec-kit code, template or validator is edited in this phase. The only writes are inside this folder: `research/` (the loop owns it) and `scratch/seed/` (orchestrator-fetched source copies).

**Dependencies**:
- `pi` on PATH with the `opencode-go` provider authenticated; `cline-pass` as the fallback route.
- Network reachable from the child shell, confirmed by a smoke dispatch that fetched a GitHub raw URL with HTTP 200.

**Deliverables**:
- Ten iteration files under `research/iterations/` and the loop state files.
- `research/research.md`: the synthesized findings with a ranked verdict list.
- `implementation-summary.md`: the orchestrator review, including which findings were verified and which were rejected.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
No one has compared system-spec-kit against the Open Knowledge Format (OKF) with evidence. Spec-kit has rich frontmatter, two metadata files per packet, a trigger index and ripgrep retrieval, but it has no declared interchange format, and its search and provenance conventions were never tested against an outside standard that targets the same job: markdown knowledge that agents read, write and share.

### Purpose
A ranked list of OKF-derived ideas, each marked adopt, adapt or reject, with repository and source evidence an operator can check.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Current-system analysis: spec docs per level, templates and anchors, frontmatter and `_memory.continuity`, `description.json`, `graph-metadata.json`, validators, trigger index, ripgrep retrieval, skill advisor and resume.
- OKF analysis: `SPEC.md` v0.2 and `README.md` (seeded in `scratch/seed/`), the Google Cloud article, the `GoogleCloudPlatform/knowledge-catalog` repository, and related online resources the agents find.
- Crosswalk, gap analysis and an adversarial counter-case.
- Ranked recommendations feeding phase 002.

### Out of Scope
- Editing spec-kit code, templates or validators - research phase, edits belong to phase 003.
- Designing the adopted changes - that is phase 002 and needs the verdict first.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/**` | Create | Loop-owned research artifacts |
| `scratch/seed/okf-SPEC.md`, `scratch/seed/okf-README.md` | Create | Orchestrator-fetched copies of the OKF source |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Run ten deep-research iterations on `opencode-go/deepseek-v4.1-flash` at `--thinking max` through `cli-pi`, with `cline-pass/deepseek-v4.1-flash` at `xhigh` only as a fallback. |
| REQ-002 | Cover every focus in the Research Charter below, each claim carrying a `file:line` or URL citation. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Agents search the open web beyond the seed link and record each source with its URL and what it contributed. |
| REQ-004 | The orchestrator verifies a sample of citations and records the verdict on each iteration before accepting the synthesis. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Ten iteration files exist and the state log shows ten completed iterations.
- **SC-002**: `research/research.md` ranks every recommendation as adopt, adapt or reject with cited evidence, and at least five non-seed web sources are recorded.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | opencode-go monthly usage window | Loop stalls mid-run | Re-dispatch the remaining iterations on the Cline route at `xhigh` |
| Risk | A single model family drives all ten iterations, so agreement is one opinion | Med | An adversarial iteration argues against adoption, and the orchestrator verifies citations itself |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each iteration finishes inside the 1800-second executor timeout.
- **NFR-P02**: A child that stalls is detected by reading its state files, not by its exit code.

### Security
- **NFR-S01**: No credential or key appears in any prompt, iteration file or log.
- **NFR-S02**: Children write only inside this phase folder.

### Reliability
- **NFR-R01**: A failed iteration is re-run, never skipped.
- **NFR-R02**: A fabricated citation found in review is recorded as a finding and the iteration is re-dispatched.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A source URL that no longer resolves: record it as unreachable and do not cite it.
- A web page that contradicts the seed copy: record both and name which is newer.
- A claim with no repository or URL evidence: mark UNKNOWN.

### Error Scenarios
- Provider 429 or quota limit: switch route to Cline at `xhigh` and note the downgrade in the iteration file.
- Network timeout on a fetch: retry once, then record the source as unreachable.
- Another session editing the repository: the worktree isolates this run.

### State Transitions
- Partial completion: resume the loop from its state log; completed iterations are not repeated.
- Orchestrator session ends: `/speckit:resume` recovers from the packet docs.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Research files only, no code |
| Risk | 4/25 | External model and web calls, read-only |
| Research | 18/20 | Two systems plus open web |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## RESEARCH CHARTER

Ten iterations, one focus each. Every focus cites `file:line` for repository claims and a URL for web claims.

1. **Spec-kit anatomy.** Spec docs per level, templates, anchors, contracts, the phase-parent shape. Start at `.skilled/skills/system-spec-kit/SKILL.md` and `references/structure/folder-structure.md`.
2. **Spec-kit metadata.** Frontmatter fields in every doc type, `description.json`, `graph-metadata.json`, `_memory.continuity`, `trigger_phrases`, `importance_tier`, `contextType`, and which validator enforces each.
3. **Spec-kit search and navigation.** Trigger index, ripgrep recipes in `references/retrieval/retrieval-conventions.md`, skill advisor, `/speckit:search`, `/speckit:resume`, graph traversal. What an agent can and cannot find today.
4. **OKF specification, deep read.** `scratch/seed/okf-SPEC.md` v0.2 and the upstream repository `https://github.com/GoogleCloudPlatform/knowledge-catalog/tree/main/okf`, including `src`, `bundles`, `samples` and `tests`. Reserved filenames, concept types, `sources`, `generated`, `verified`, `status`, `stale_after`, index and log files, conformance.
5. **OKF ecosystem and online resources.** The Google Cloud article, the Knowledge Catalog, the enrichment agent and visualizer, community write-ups, the LLM-wiki pattern, and comparable standards such as `llms.txt`, Agent Skills `SKILL.md` frontmatter and `AGENTS.md`. Find and record sources beyond the seed link.
6. **Crosswalk.** Field-by-field and file-by-file mapping between spec-kit and OKF: what matches, what is missing on each side, what conflicts.
7. **Candidate ideas and feasibility.** For each idea worth taking, the touched surfaces, callers, validators and an effort and benefit estimate. Candidates to test: typed concepts, per-folder index files, a change log file, provenance and freshness fields, bundle export or import.
8. **Compatibility and blast radius.** What each candidate does to the 4,544 existing `spec.md` files, validators, templates, hooks, the trigger index and the advisor. Additive or migration.
9. **Adversarial counter-case.** Argue against adoption. Find OKF weaknesses, cases where spec-kit is already better, and alternatives that solve the same problem more cheaply.
10. **Synthesis.** Ranked recommendations, each adopt, adapt or reject with evidence, effort, risk and a proposed shape for phase 002.

---

## 10. OPEN QUESTIONS

- Does the OKF v0.2 trust and lifecycle model (`generated`, `verified`, `status`, `stale_after`) map onto spec-kit `importance_tier` and `_memory.continuity`, or does it add something missing?
- Is a per-folder `index.md` for progressive disclosure cheaper than the current trigger index for agent navigation?
<!-- /ANCHOR:questions -->

---


