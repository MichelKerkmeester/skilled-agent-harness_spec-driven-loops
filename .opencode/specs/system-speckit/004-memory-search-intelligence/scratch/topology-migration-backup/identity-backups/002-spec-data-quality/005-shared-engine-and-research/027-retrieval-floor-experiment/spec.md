---
title: "Feature Specification: Retrieval Floor Experiment [template:level_2/spec.md]"
description: "The prod retrieval path guarantees a never-cut-below-3 minimum then narrows the returned set through a cliff-conditional confidence truncation and a token budget, with no measurement of whether results 4-10 are signal or noise on this corpus. The whole frozen Tier-C truncation-law constraint rests on an untested assumption about that tail."
trigger_phrases:
  - "retrieval floor experiment"
  - "raise the retrieval floor"
  - "default min results"
  - "truncation law measurement"
  - "tail signal or noise"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-spec-data-quality/005-shared-engine-and-research/027-retrieval-floor-experiment"
    last_updated_at: "2026-07-04T17:12:04.022Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the retrieval floor experiment implementation spec from research.md"
    next_safe_action: "Run /speckit:plan after 015-c2 lands the prod-mode recall gate"
    blockers:
      - "Depends on 015-prodmode-recall-gate which must ship the prod-mode completeRecall@3 instrument first"
    key_files:
      - "../research/research.md"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs"
    session_dedup:
      fingerprint: "sha256:7f1c4d92a8e0356b41d9c7e2a6b58043e9c70d1f8a23b46d5e7081c2d94f6a18"
      session_id: "phase-027-retrieval-floor-experiment"
      parent_session_id: "phase-027-retrieval-floor-experiment"
    completion_pct: 0
    open_questions:
      - "Which floor settings to sweep beyond the current 3 (5, 8, 10) and whether to vary the gap-cliff multiplier in the same pass"
    answered_questions:
      - "Whether this phase changes the prod default floor, it does NOT, it measures and reports a verdict on the tail"
---
# Feature Specification: Retrieval Floor Experiment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope and verification evidence.
- Remove placeholders, stale status and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-06-21 |
| **Branch** | `027-retrieval-floor-experiment` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The prod retrieval path guarantees a never-cut-below-3 minimum (`confidence-truncation.ts:35`, `DEFAULT_MIN_RESULTS = 3`, a floor not a cap), then layers a cliff-conditional confidence truncation that returns 3 to 20 at roughly 2x the median gap and a token budget that is the real prod-limiting stage, all applied at the prod seam `if (!evaluationMode)` in `hybrid-search.ts` (the minimum guarantee surfaces at `hybrid-search.ts:2065` as `minResultsGuaranteed: DEFAULT_MIN_RESULTS`). The frozen Tier-C retrieval slate and the entire truncation-law framing rest on one untested assumption, that results 4 through 10 are noise the truncation stages are right to cut. Nobody has measured whether that tail carries real recall on this corpus. If the tail is signal the truncation-law constraint loosens and the frozen Tier-C slate must be re-evaluated. If it is noise the never-cut-below-3 minimum and the framing are confirmed. The experiment cannot run until there is a prod-mode completeRecall@3 instrument to read, which is exactly what 015-c2 builds.

### Purpose
Run a prod-mode measurement that raises the retrieval floor and token budget across a small sweep and reports whether the recovered tail is signal or noise, producing one verdict that either loosens or confirms the truncation-law constraint.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A measurement-only floor sweep that runs the C2 prod-mode harness with the minimum guarantee raised above the current 3 (for example 5, 8 and 10) and a correspondingly widened token budget, on the same copy DB the harness already builds.
- An env-flagged override named `SPECKIT_FLOOR_OVERRIDE` over `DEFAULT_MIN_RESULTS` and the token budget, default-off and read only inside the experiment driver, so the prod default at `confidence-truncation.ts:35` is never changed on disk.
- A delta report that reads ONLY the prod-lens completeRecall@3 column per floor setting and quantifies the recall recovered by each step up from 3, against the C2 baseline.
- One written verdict, signal or noise, that either re-opens the frozen Tier-C retrieval slate for re-evaluation or confirms the never-cut-below-3 minimum and the truncation-law framing.

### Out of Scope
- Any change to the prod default minimum, the gap-cliff multiplier or the token budget on disk - this phase is a measurement experiment, not a default change. The never-cut-below-3 minimum stays at 3 in `confidence-truncation.ts:35` after this phase.
- Building or changing the prod-mode harness or the recall gate - that is 015-c2 and this phase consumes it unchanged.
- Eval-mode @K and external @5/@10/@20 numbers as a verdict input - they are inadmissible because the prod truncation stages hide exactly the band under test.
- Any retrieval-class ranking, re-embed or coverage-guard work - the C1 and downstream Tier-C builds are gated on the verdict this phase produces, not done here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-floor-experiment.mjs` | Create | Experiment driver that sweeps floor settings via the env override and reports the prod-column completeRecall@3 delta per setting against the C2 baseline |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts` | Modify | Read the default-off `SPECKIT_FLOOR_OVERRIDE` env override for `DEFAULT_MIN_RESULTS` and the token budget so the on-disk prod default stays 3 |
| `.opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/005-shared-engine-and-research/027-retrieval-floor-experiment/floor-experiment-report.md` | Create | The measured per-setting recall deltas and the one signal-or-noise verdict |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The experiment MUST read the prod-lens completeRecall@3 column from the C2 harness and never the eval-lens column | A driver assertion confirms the verdict input is the prod profile and an eval-lens input is refused |
| REQ-002 | The floor override `SPECKIT_FLOOR_OVERRIDE` MUST be env-gated and default-off so the on-disk prod default at `confidence-truncation.ts:35` stays `DEFAULT_MIN_RESULTS = 3` after the run | A diff confirms the literal `3` is unchanged and a run with no env flag uses the 3-result minimum |
| REQ-003 | The experiment SHALL report prod completeRecall@3 for each swept floor setting against the stored C2 baseline | The report carries one prod-column delta row per floor setting referencing the baseline source DB |
| REQ-004 | The experiment SHALL emit one verdict, signal or noise, with the recall threshold that decides it stated up front | The report states the decision threshold before the numbers and the verdict follows from the measured delta |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The driver SHALL reuse the `run-eval-v2.mjs` prod lens through the C2 export rather than re-implementing truncation | The driver imports the harness lens and class symbols with no lens or floor logic duplicated |
| REQ-006 | WHEN the verdict is signal the report SHALL name the frozen Tier-C items to re-evaluate and WHEN noise it SHALL record the 3-floor confirmation | The report's closing section lists the affected Tier-C slate or the explicit confirmation, not both |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A floor sweep runs on the C2 prod-mode harness and produces a prod-column completeRecall@3 number per setting, proving the tail was measured rather than assumed.
- **SC-002**: The on-disk prod default at `confidence-truncation.ts:35` is still `DEFAULT_MIN_RESULTS = 3` after the experiment, proving the change was a measurement not a default flip.
- **SC-003**: The report states one signal-or-noise verdict against a pre-stated threshold, so the truncation-law constraint is either loosened with named follow-ups or confirmed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 015-prodmode-recall-gate | Hard blocker - there is no prod-mode completeRecall@3 instrument to read without C2 | Sequence this phase after C2 lands and consume its harness export and baseline unchanged |
| Dependency | `run-eval-v2.mjs` dual-mode harness | The experiment reads its prod lens and breaks if the lens contract changes | Consume only the C2-exported lens and class symbols and never fork the lens body |
| Risk | The override leaks into the on-disk prod default | High | Gate the override behind a default-off env flag and verify the literal `3` is unchanged by diff |
| Risk | A reviewer reads the eval column and calls a phantom tail signal | High | REQ-001 hard-binds the verdict to the prod column and the driver refuses an eval-lens input |
| Risk | The verdict is read as a license to raise the prod floor | Medium | Scope freezes the default change out - a signal verdict re-opens the Tier-C slate, it does not itself move the floor |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The sweep runs on the existing copy-DB path the C2 harness already builds, with no second DB backup introduced per floor setting.

### Reliability
- **NFR-R01**: The experiment is deterministic on a fixed copy DB, gold set and floor setting, so the measured prod completeRecall@3 per setting is stable across reruns of the same inputs.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A query whose relevant targets all sit within the first 3 results: it saturates and contributes no delta as the floor rises, which is itself the noise signal for that query.
- A query whose targets sit in ranks 4 through 10: it is the exact case the sweep exists to surface and its recovered recall is the signal evidence.

### Error Scenarios
- The C2 baseline or harness export is missing: the driver fails at import with a clear dependency error rather than silently re-implementing a lens or floor.
- The `SPECKIT_FLOOR_OVERRIDE` env override is set but unread by `confidence-truncation.ts`: the driver detects the floor did not move and fails closed rather than reporting a flat no-signal result.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One net-new driver, one env-gated read on `confidence-truncation.ts`, one report |
| Risk | 10/25 | No ranking change but touches the live floor seam behind a flag and depends on C2 |
| Research | 5/20 | Floor seam verified to `confidence-truncation.ts:35` and the harness prod lens to file in research.md sections 4 and 5 |
| **Total** | **23/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which floor settings to sweep beyond 3 (5, 8, 10) and whether to vary the gap-cliff multiplier in the same pass or hold it fixed.
- What completeRecall@3 delta over the C2 baseline counts as signal, set as a fixed threshold before the run so the verdict is not fit to the numbers.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:verdict -->
## 11. VERDICT

Experiment, the operator-agreed measurement. This is not a GO on a default change and not a default flip - it is a prod-mode experiment that asks one question and returns one answer. The verdict it produces is conditional-C2-gated, because the experiment cannot run until 015-c2 ships the prod-mode completeRecall@3 instrument it reads. If the swept tail is signal the truncation-law constraint loosens and the frozen Tier-C retrieval slate (C1, C3, C4, C5) re-opens for re-evaluation. If the tail is noise the never-cut-below-3 minimum at `confidence-truncation.ts:35` and the truncation-law framing are confirmed. Prod-mode for the read is non-negotiable, eval-mode @K and external @5/@10/@20 numbers are inadmissible because the prod truncation stages hide exactly the band under test.
<!-- /ANCHOR:verdict -->
