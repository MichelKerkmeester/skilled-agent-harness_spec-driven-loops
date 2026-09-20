---
title: "Feature Specification: V4 Documentation Freshness"
description: "CHANGELOG-v4.0.0.0.md and the root README.md were last reconciled with the repository before the .skilled source-root migration, the deep-loop ledger and admission work, and the retirement moves landed. This packet runs a ten-iteration cited research lane over both documents and records a claim-by-claim verdict on every reference that may now be stale."
trigger_phrases:
  - "v4 doc freshness"
  - "changelog drift audit"
  - "readme drift audit"
  - "documentation freshness verdict"
  - "stale dot-opencode references in release docs"
  - "ten iteration release doc research"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: V4 Documentation Freshness

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-19 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 42 of 42 |
| **Predecessor** | 041-skilled-source-root-migration |
| **Successor** | None |
| **Handoff Criteria** | This child validates under `validate.sh --strict`, and the parent validates under `--recursive --strict` with the child registered in its graph metadata |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 42** of the V4 documentation freshness: ten-iteration deep research into whether the v4 changelog and the root README still match the repository specification.

**Scope Boundary**: The two release documents and the evidence that decides them. The lane may correct what a cited verdict confirms and nothing else.

**Dependencies**:
- 041-skilled-source-root-migration — the source-root move is the largest single source of candidate drift in both documents
- The deep-loop work that landed after the changelog's last refresh, including the ledger, protocol and admission changes

**Deliverables**:
- A completed ten-iteration research lane under `research/`, with iteration files, gateway-receipted state events and a synthesized `research/research.md`
- `research/verdict-changelog.md` and `research/verdict-readme.md`, each row carrying the stale claim, its current-truth evidence and the proposed correction
- Verdict-confirmed corrections applied to `../CHANGELOG-v4.0.0.0.md` and `../../../README.md`, or a recorded "no correction" outcome when a verdict finds the document current

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Both release documents were written to describe a tree that has since moved. The changelog's upgrade notes point the advisor front door and the spec-kit engine at `.opencode/...` paths, while the live root is `.skilled/...`; the migration deliberately kept a compatibility root and restored one `.opencode/bin` alias until its callers move, so some of those references may still be true. Nothing in the repository currently distinguishes the references that remain accurate from the ones that quietly went stale, and no one has audited the root README against the same commits.

### Purpose

Decide, claim by claim with cited evidence, which statements in the two documents are still true, and correct only the ones a verdict confirms are not.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A ten-iteration research lane over both documents, with no early convergence
- Two verdict documents in `research/`, one per target document, each row carrying claim, cited current truth, proposed correction and confidence
- Targeted edits to `../CHANGELOG-v4.0.0.0.md` and `../../../README.md` for the rows a verdict confirms

### Out of Scope

- A full rewrite of either document - a verdict recommending one is recorded as a recommendation; executing it is separate work
- Commits and pushes - the tree is left dirty for an sk-git pass
- The cli-devin skill roster line and the 041 continuity block - both are known-stale and belong to their own packets

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/verdict-changelog.md` | Create | Claim-by-claim verdict for the v4 changelog |
| `research/verdict-readme.md` | Create | Claim-by-claim verdict for the root README |
| `../CHANGELOG-v4.0.0.0.md` | Modify | Verdict-confirmed corrections only |
| `../../../README.md` | Modify | Verdict-confirmed corrections only |
| `research/**` | Create | Loop-owned state: iterations, strategy, registry, dashboard, synthesis |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The research lane runs exactly ten iterations under `--stop-policy=max-iterations`, with convergence recorded as telemetry only |
| REQ-002 | Each iteration leaves a non-empty iteration file and a gateway-receipted state event carrying the route-proof fields (`target_agent`, `resolved_route`, `agent_definition_loaded`, `mode`) |
| REQ-003 | `research/research.md` synthesizes the run with `[SOURCE: ...]` citations and no placeholder residue |
| REQ-004 | Every verdict row states the exact stale, missing or understated claim, the evidence that decides it, and the proposed correction |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Only verdict-confirmed corrections are applied, and the scoped diff is limited to this packet plus the two release documents |
| REQ-006 | The packet validates under `validate.sh --strict` after every spec-doc write and at close |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Ten non-empty iteration files, ten gateway-receipted events with route-proof fields, and a convergence report reading total 10 with stop reason `max_iterations`
- **SC-002**: Both verdict documents exist, every row carries a resolvable citation, and each correction the lane applies is reproducible from the cited commit or file
- **SC-003**: `validate.sh --strict` returns `RESULT: PASSED`, and the diff contains no path outside this packet and the two release documents
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The Devin CLI seat and the `deepseek-v4-1-flash-max` allowlist entry | The lane cannot run on the named executor | Pre-flight `devin auth status` at execution; halt and report rather than substituting an executor |
| Risk | A compatibility path makes an apparently stale reference still true | A wrong "stale" verdict leads to a wrong edit | Every row must cite the live file or commit that decides it; the loop's citation is checked before any edit |
| Risk | A verdict recommends a full rewrite | The lane cannot deliver a rewrite inside its scope | The recommendation is recorded and that lane stops |
| Risk | Mid-run executor failure | Fewer than ten usable iterations | The loop's own recovery retries; three consecutive failures escalate instead of retrying silently |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The lane completes within its ten-iteration ceiling; iterations chain one at a time with no parallel duplicate dispatch.
- **NFR-P02**: The evidence pass reads the last ~100 commits and the live tree rather than re-summarizing the request.

### Security
- **NFR-S01**: No credential, token or seat detail is written into packet artifacts.
- **NFR-S02**: The executor runs with write authority bound to this packet's `research/` directory.

### Reliability
- **NFR-R01**: A completed run never records fewer than ten iteration files; a short run is reported as short rather than completed.
- **NFR-R02**: Every applied correction traces to a verdict row, and every verdict row traces to a citation.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty iteration file: counts as a failed iteration and stays visible in the record rather than being overwritten.
- Missing route-proof fields in a state record: the run does not pass verification, regardless of iteration count.
- A citation that names a path no longer in the tree: the row is re-verified against the repository before any edit.

### Error Scenarios
- Executor unavailable mid-run: the loop resumes from its own state; three consecutive failures escalate with a stuck report.
- Convergence reached before iteration ten: recorded as telemetry, and the loop continues to the ceiling.
- A verdict row and the document disagree after an edit: the verdict governs, and the mismatch is reported rather than patched silently.

### State Transitions
- Both verdicts return "current": the edit step is a no-op by design, and that outcome is the finding.
- A lane blocked on a rewrite recommendation: recorded, and the remaining verdict work still completes.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Two release documents, one research lane, two verdict documents, no code |
| Risk | 10/25 | Documentation-only edits, reversible with `git restore`; the failure mode is a wrong correction, not a broken build |
| Research | 18/20 | The whole deliverable is a cited-evidence judgment over roughly a hundred commits |
| **Total** | **46/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Both target documents and the evidence path are named.
<!-- /ANCHOR:questions -->

---
