---
title: "Feature Specification: Phase 2: router-reach-misroutes"
description: "The doctor router-reach fleet recorded 14 wrong-hub and 18 outranked phrases from a degraded local-scorer run whose advisor generation was unknown; the fleet has never been rerun live, and the three recorded examples now route to their expected hubs."
trigger_phrases:
  - "router reach misroutes"
  - "wrong hub phrases"
  - "outranked routing phrases"
  - "live fleet rerun"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 2: router-reach-misroutes

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

The doctor's router-reach probe recorded 14 wrong-hub and 18 outranked phrases across seven hubs, but it scored a degraded local-scorer envelope with `advisor generation: unknown`, so the numbers describe the fallback scorer rather than live routing. A planning-time live probe of the three cited examples showed each one now reaching its expected hub, which is exactly why the recorded list cannot be fixed as-is. This phase reruns the full fleet against the live advisor, keeps only the misroutes that reproduce, and fixes those in the owning skills' routing vocabulary.

**Key Decisions**: The live fleet run is the gate before any vocabulary edit; fixes land in the owning skill's routing vocabulary, never in the probe or the doctor; allowlist entries require a recorded rationale for the phrase, the winner and the dispute.

**Critical Dependencies**: A live advisor daemon answering with a generation number; the probe script and allowlist at `.skilled/skills/sk-doc/sk-create-skill/scripts/`; the doctor route contract from `specs/system-speckit/048-doctor-command-audit/008-router-reach`.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-03 |
| **Branch** | `scaffold/002-router-reach-misroutes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 3 |
| **Predecessor** | 001-freshness-and-scan-truth |
| **Successor** | 003-status-contract-and-docs |
| **Handoff Criteria** | The full fleet is rerun against the live advisor; every reproduced wrong-hub and outranked phrase is fixed in the owning vocabulary or has a recorded allowlist rationale; the rerun reports none of either or a decision record waives what remains |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Make the advisor's freshness, scan and routing reports match what is on disk specification.

**Scope Boundary**: Routing vocabulary and the verification of recorded misroutes. The probe script's fail-closed behavior, the doctor route workflow and the presentation were fixed in the source audit and are consumed here unchanged.

**Dependencies**:
- A live advisor daemon reachable by `.skilled/bin/skill-advisor.cjs`, answering with `trustState.generation` and no degraded marker.
- The full-fleet inventory: every hub with both `ROUTER.md` and `mode-registry.json` under `.skilled/skills/` (seven hubs at audit time).
- The recorded audit evidence in `specs/system-speckit/048-doctor-command-audit/008-router-reach/scratch/`, including the misroute list and the degraded-response proof.

**Deliverables**:
- A recorded live full-fleet run with its generation number and complete classification counts.
- The reproduction list: which recorded phrases still fail live, with the winner that beat the owning hub.
- Vocabulary fixes in the owning skills for every reproduced failure, and a rerun showing none of either failure class or a decision record for the remainder.
- Scratch evidence for the run, the fixes and the rerun.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The source audit's fleet run reported `checked=7 hub(s), wrong-hub=14, outranked=18, no-reach=221, allowed=8, probe-error=0`, `advisor generation: unknown`, `RESULT: FAILED` (`specs/system-speckit/048-doctor-command-audit/008-router-reach/scratch/doctor-run.log:303-305`). The same log shows the advisor response used for scoring was a degraded local-scorer envelope with no recommendations and no trust state (`doctor-run.log:21-34`), which the phase summary records as a limitation: the wrong-hub and outranked rows are fallback-scoring observations, not verified live routes (limitations 1-2). Recorded examples include `jev mcp server` losing to `mcp-code-mode=0.8500`, `full plugin and memory stack` ranking `memory:save` and `system-spec-kit` at 0.9500, and `notion mcp` losing to `mcp-code-mode=0.9500` (`doctor-run.log:43,45,66`). Only one hub was rerun live after the batch (`--hub sk-doc --limit 5`, advisor generation 3, `RESULT: PASSED`; limitation 3), so the fleet-wide truth is unknown. At planning time, live probes of the three cited examples answered from a live advisor (`trustState.generation: 7`, `sourceSignaturePresent: true`) with the expected hub on top: `jev mcp server` → `cli-classifier` 0.792, `full plugin and memory stack` → `cli-external-orchestration` 0.770, `notion mcp` → `mcp-tooling` 0.727. The recorded list therefore cannot be treated as a fix list; it must be re-derived against the live scorer.

### Purpose
Replace fallback-scoring observations with live routing facts: rerun the full fleet, fix the misroutes that actually reproduce in the vocabulary that owns them, and leave a rerun that proves the fleet reaches its hubs or records why a remaining case is accepted.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The full-fleet live rerun of `ci-router-vocabulary-reach.cjs` with no hub filter and no sampling limit, recording complete output, the advisor generation and the exit status.
- Classification of the recorded 14 wrong-hub and 18 outranked phrases into reproduced, no-longer-reproduced and probe-error, with the top-scoring winner for each reproduced case.
- Routing vocabulary fixes in the owning skill's `graph-metadata.json` (and its `ROUTER.md` intent signals where the phrase is declared there).
- Allowlist changes only as a documented decision naming the phrase, the winning hub and the rationale.
- A final full-fleet rerun after the fixes, and scratch evidence for each step.

### Out of Scope
- The probe script, doctor route workflow, presentation and route validator - fixed and verified in `specs/system-speckit/048-doctor-command-audit/008-router-reach`.
- `no-reach` rows: the workflow reports them but does not fail on them (`doctor-router-reach.yaml:34-35`).
- `allowed` disputes: accepted by the allowlist contract.
- Scoring lane weight changes, phrase bounds and fusion behavior - Phase 3 owns the scorer contract.
- Changes to hubs with no reproduced failure, and any vocabulary edit whose only evidence is the degraded audit run.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/*/graph-metadata.json` | Modify | Add or adjust the intent signals and derived triggers for the phrases a live run reproduces as wrong-hub or outranked |
| `.skilled/skills/*/ROUTER.md` | Modify | Align the router's declared intent signals where the phrase lives there |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/router-reach-allowlist.json` | Modify | Only entries justified by a recorded phrase/winner/rationale decision |
| `scratch/live-fleet.log` | Create | The complete live full-fleet run output |
| `scratch/reproduction.md` | Create | The reproduced/no-longer-reproduced classification with winners |
| `scratch/verification.md` | Create | The post-fix rerun and its generation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The full fleet must be rerun against the live advisor with no hub filter and no `--limit`, and the complete output, advisor generation and exit status recorded. A degraded, non-live or generation-less answer fails the run; it is not scored. |
| REQ-002 | Every wrong-hub and outranked phrase the live run reproduces must be fixed in the routing vocabulary of the hub that declares it, and a full-fleet rerun after the fixes must report `wrong-hub= 0` and `outranked= 0`, or a decision record must waive each remaining phrase with its winner and rationale. |
| REQ-003 | No allowlist entry may be added or widened for a phrase the live run reproduces unless a decision record names the phrase, the winning hub and why the dispute is acceptable. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The phase records the before and after counts, the exact commands and the advisor generation in scratch evidence, and leaves the probe script, the doctor workflow and the run command unchanged. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A live full-fleet run exists with its generation number and complete counts, and every recorded phrase is classified as reproduced, no-longer-reproduced or probe-error.
- **SC-002**: The post-fix full-fleet rerun against the live advisor reports zero wrong-hub and zero outranked phrases, or every remainder names a decision record.
- **SC-003**: Each vocabulary edit cites the phrase and the live winner it fixes; no fix rests on the degraded audit run alone.
- **SC-004**: The probe script, route workflow and presentation are untouched; the doctor route validator still exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Live advisor daemon reachable through the CLI | No live run is possible; recorded counts stay unverified | Verify with `advisor_recommend --warm-only` before the run; if the daemon is unavailable, record the blocker and stop rather than scoring a degraded answer |
| Risk | A vocabulary fix for one hub steals a phrase from another | The full-fleet rerun shows new wrong-hub rows | Always rerun the full fleet, not one hub, after each fix batch; never widen an allowlist as a shortcut |
| Risk | The fleet run is long | The run gets sampled or skipped, which is how the phrases stayed broken | Use the script's default concurrency (8) and record the full unsampled inventory; `--limit` stays refused under `CI` |
| Risk | No-reach noise gets mistaken for misroutes | Fixes target phrases that fail on length, not ownership | Keep the script's classification: only wrong-hub and outranked gate the phase; no-reach stays recorded |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The full-fleet rerun completes with the script's default concurrency and records its wall time; the phase does not add a new sequential bottleneck.

### Security
- **NFR-S01**: The run is read-only against the advisor; vocabulary edits touch only routing metadata, and no allowlist entry may hide a phrase without a recorded decision.

### Reliability
- **NFR-R01**: A degraded, non-live or generation-less advisor answer stops the run with the reason recorded; it is never classified or fixed.

---

## 8. EDGE CASES

### Data Boundaries
- A hub with zero declared phrases: skipped by the inventory, recorded as zero.
- A phrase declared by two hubs: the live winner decides; both declarations are inspected before editing.
- A replicated phrase that no longer reproduces: recorded as no-longer-reproduced with its current winner, no edit.

### Error Scenarios
- Probe error on a phrase: kept as `probe-error`, retried once, and recorded as a phase blocker if it persists.
- Advisor generation missing from the live answer: treated as a failed run, not a pass.
- The daemon restarts mid-run: the run is rerun from the start, because a mixed-generation report is not one fact.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 10/25 | Files: 2-6, LOC: small metadata edits, Systems: routing corpus and probe |
| Risk | 12/25 | Auth: N, API: N, Breaking: vocabulary edits can shift other phrases |
| Research | 12/20 | The live run must exist before the fix list does; reproduction is the work |
| Multi-Agent | 3/15 | Workstreams: 1; one executor owns the run and the edits |
| Coordination | 5/15 | Dependencies: 2 (live daemon, doctor route contract) |
| **Total** | **42/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The live run reproduces little or nothing, making the phase a verification-only pass | L | M | That is a valid outcome; record it, keep the run as evidence and close REQ-002 with the zero counts |
| R-002 | Vocabulary edits shift adjacent phrases | M | M | Full-fleet rerun after each batch and phrase-level probes for the edited hub |
| R-003 | Daemon unavailability blocks the run | M | L | Pre-check with a warm-only probe; record the blocker instead of substituting a degraded run |

---

## 11. USER STORIES

### US-001: A router phrase reaches the hub that declares it (Priority: P0)

**As an** operator whose request uses a phrase a hub advertises, **I want** that hub to rank first, **so that** the request lands on the workflow the phrase promises.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Recorded misroute counts are verified before they are fixed (Priority: P1)

**As a** maintainer reading the audit's misroute list, **I want** each count re-derived against the live advisor, **so that** vocabulary edits rest on live routing and not on a fallback scorer.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- How many of the 18 outranked phrases reproduce once the live scorer answers? The live run answers this before any edit.
- Should the live fleet run become a periodic gate, or stay a manual verification step? `--limit` is already refused under `CI`; the phase records the run time so a later decision has a cost figure.
- When a reproduced phrase belongs to a hub whose vocabulary already contains it, does the fix belong in the phrase's boost, the competing hub's penalty, or the declaring hub's intent signals? The plan chooses per case, with the winner and the phrase's declaration site as the deciding evidence.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`
