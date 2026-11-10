---
title: "Feature Specification: v4.0.0.3 release deep review"
description: "The v4.0.0.3 release shipped 633 commits that were never reviewed as one body of work. This phase runs a 35-iteration, three-executor deep review of v4.0.0.2..v4.0.0.3 and has a fresh Opus 5.5 synthesize the findings."
trigger_phrases:
  - "v4.0.0.3 deep review"
  - "release deep review"
  - "v4.0.0.2 to v4.0.0.3 review"
  - "multi-executor deep review"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: v4.0.0.3 release deep review

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-05 |
| **Branch** | `worktrees/090-deep-review-okf-adoption` |
| **Parent Spec** | ../spec.md |
| **Phase** | 68 of 68 |
| **Predecessor** | 067-root-docs-and-git-hook-disclosure |
| **Successor** | None |
| **Handoff Criteria** | `review/review-report.md` exists with a verdict and a ranked finding list a remediation packet can plan from |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 68** of the system-speckit v4 packet: a release-wide deep review of everything shipped between the `v4.0.0.2` and `v4.0.0.3` tags.

**Scope Boundary**: findings only. This phase reads the release and writes review artifacts inside its own `review/` folder. It edits no source, skill, command or doc outside this packet.

**Dependencies**:
- The `v4.0.0.2` and `v4.0.0.3` tags (633 commits apart).
- `/deep:review:auto` fan-out through `fanout-run.cjs` and `fanout-merge.cjs`.
- Live executor routes: Pi on the ChatGPT sign-in (Luna), Pi on OpenCode Go (DeepSeek V4.1 Flash), Devin (SWE 2).

**Deliverables**:
- Five review lineages: three under `review/lineages/` and two Luna lineages under `review/luna-wave/lineages/` (added 2026-10-06). The operator converged the run early at 30 of 55 iterations.
- A merged finding registry per fan-out and `review/review-report.md`, synthesized by a fresh Opus 5.5 at high effort.
- `review/luna-halt-analysis.md`: why Luna lineages stop under interactive repo rules, written by a fresh Opus 5.5 at medium effort.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
v4.0.0.3 was released after 633 commits across about 45 spec packets. Each packet was reviewed on its own, if at all. Nobody reviewed the release as a whole, so bugs that cross packets, contract drift between skills, and docs that disagree with the code can ship unnoticed.

### Purpose
Produce one ranked, evidence-cited finding list for the whole v4.0.0.3 release, so a follow-up packet can fix what matters.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Review target: the diff and commit range `v4.0.0.2..v4.0.0.3`, including code, skills, commands, agents, hooks, docs and workflows changed in that range.
- Three fan-out lineages run in parallel (concurrency 3):
  - `luna-max`: `cli-pi`, model `gpt-6-luna` (ChatGPT sign-in), effort `max`, 10 iterations.
  - `deepseek-flash-max`: `cli-pi`, model `opencode-go/deepseek-v4.1-flash`, effort `max`, 15 iterations.
  - `swe2-max`: `cli-devin`, model `swe-2-max`, 10 iterations.
- `--stop-policy=max-iterations`, so convergence never ends a lineage early.
- Active scope expansion: each iteration may widen into files and packets its findings point to, recorded in the strategy and the dimension map.
- A fresh Opus 5.5 high-effort agent synthesizes the merged findings into `review/review-report.md`.
- Commit and push this packet to `main` when the run is done.

### Out of Scope
- Fixing any finding - remediation is planned in a later packet from the report.
- Editing the v4.0.0.3 changelog or GitHub release - the release is published and stays as shipped.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `068-v4-0-0-3-release-deep-review/review/**` | Create | Lineage state, iterations, merged registry and review report |
| `068-v4-0-0-3-release-deep-review/*.md` | Modify | Packet docs, goal and closure evidence |
| `../spec.md` | Modify | Phase map row for phase 68 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Run the fan-out lineages under `--stop-policy=max-iterations` until they finish or the operator stops the run, and keep every iteration written. |
| REQ-002 | Produce `review/review-report.md` from the merged registry, synthesized by a fresh Opus 5.5 at high effort. |
| REQ-003 | Change no file outside this packet folder and the parent phase map. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Every finding cites a file and line, or a commit, as evidence. |
| REQ-005 | The packet passes `validate.sh --strict` and is committed and pushed to `main`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 30 iteration files on disk across five lineages when the operator converged early (15 + 10 + 3 + 2 + 0).
- **SC-002**: `review/review-report.md` states a verdict and lists findings ranked P0, P1 then P2.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | OpenCode Go quota or DeepSeek latency | DeepSeek lineage stalls or times out | Per-iteration timeout of 1,800 s. On a route failure, re-run the lineage on `cline-pass/deepseek-v4.1-flash` at `xhigh`, its top tier, and record the switch |
| Dependency | Pi has no service-tier control | Luna cannot run on a "fast" tier | Run Luna at `max` with no tier, recorded as a deviation |
| Risk | The range is very large (633 commits, many renames) | Iterations spread thin | Active expansion plus 35 iterations; the synthesis ranks by severity, not coverage |
| Risk | A lineage hits the 4-hour lineage ceiling | Fewer iterations than planned | Resume the lineage with `--lineage-mode=resume` until its count is met |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Three lineages run at once (`--concurrency 3`).
- **NFR-P02**: No single iteration runs past 1,800 seconds.

### Security
- **NFR-S01**: Executors run in this worktree only and write only inside `review/`.
- **NFR-S02**: No credential or `.env` value appears in any review artifact.

### Reliability
- **NFR-R01**: A failed iteration is retried by the fan-out runner and recorded, never silently dropped.
- **NFR-R02**: Each lineage's state log lists every iteration it ran.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a lineage that returns no findings still writes its iteration files and state records.
- Maximum length: the diff is too large for one context; each iteration picks a slice and records it.
- Invalid format: an iteration file missing route-proof fields counts as a failed iteration and is retried.

### Error Scenarios
- External service failure: switch the affected lineage to its documented fallback route and record it.
- Network timeout: the runner retries; a lineage that keeps failing is resumed, not restarted.
- Concurrent access: each lineage writes only its own `review/lineages/<label>/` folder.

### State Transitions
- Partial completion: resume the lineage with `--lineage-mode=resume`.
- Session expiry: the state logs on disk carry the run; a new session resumes from them.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | 633 commits, whole release, three executors |
| Risk | 6/25 | Read-only on the release; writes only review artifacts |
| Research | 18/20 | 35 review iterations plus synthesis |
| **Total** | **44/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Executors, iteration counts, workspace and synthesis model were set by the operator on 2026-10-05.
<!-- /ANCHOR:questions -->

---
