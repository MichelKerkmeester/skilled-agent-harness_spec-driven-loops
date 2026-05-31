---
title: "Feature Specification: Substrate skip-not-fail validation research"
description: "Deep-research validation of the five behavioral claims of the skip-not-fail-on-live-owner substrate harness fix."
trigger_phrases:
  - "substrate skip-not-fail"
  - "live owner skip"
  - "substrate harness validation"
  - "liveOwnerForService"
  - "deep research substrate"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Substrate skip-not-fail validation research

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-31 |
| **Branch** | `main` |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The substrate stress harness was changed so that a connection failure is reclassified from `FAIL` to a tolerated `SKIP` when a live operator daemon holds the single-writer lease and bridging is disabled. The change is verified at the suite level (79/79), but its behavioral claims have not been adversarially validated: that genuine crashes still FAIL, that the false-green guard survives, that the evidence is reproducible, and that no unintended writes occur.

### Purpose
Run a bounded deep-research loop that interrogates the five claims with file:line evidence and concrete failure scenarios, producing a cited report that either upholds each claim or characterizes exactly where it breaks.


<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

<!-- DR-SEED:SCOPE -->

### In Scope
- Behavioral analysis of `liveOwnerForService()`, `isPidAlive()`, and the reworked `connectSharedClient` catch block in `run-substrate-stress-harness.mjs`.
- The relaxed 410 false-green guard in `substrate-runner-harness.vitest.ts`.
- Reproducibility of the evidence TSV (`runner:* SKIP` rows + owning pids).
- Whether the `graph-metadata.json` churn and the `SPECKIT_CODE_GRAPH_MAINTAINER_MODE` leak are correctly attributed and bounded.

### Out of Scope
- Implementing further fixes (findings only; remediation is a separate follow-up).
- Full hermeticity redesign of the harness (explicitly deferred option).
- Unrelated stress suites (search-quality, session, matrix).

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/specs/system-spec-kit/037-substrate-skip-not-fail-validation/research/research.md | Create | Synthesized research report |


<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

<!-- DR-SEED:REQUIREMENTS -->

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Validate that genuine daemon crashes still FAIL | Evidence that `liveOwnerForService()` returns null when no live owner holds the lease; failure scenarios enumerated |
| REQ-002 | Validate the false-green guard still fires in a clean env | Evidence that 410 must be PASS/PARTIAL when daemons connect; guard-defeat scenarios characterized |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Confirm evidence TSV reproducibility | TSV shows `runner:* SKIP` with owning pids and a stable explanation |
| REQ-004 | Attribute graph-metadata churn and bound the maintainer-mode leak | Evidence the harness child exits before any scan; clean-env blast radius quantified |


<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each of the five claims has a PROVEN / NOT-PROVEN / REGRESSION verdict with file:line evidence.
- **SC-002**: Concrete failure scenarios are documented for any claim that does not hold unconditionally.


<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | opencode CLI + MiniMax M2.7-highspeed | Iterations cannot run | Verified available before init |
| Risk | Small-model output-contract adherence | Iteration artifacts malformed | post_dispatch_validate + reducer recovery |
| Risk | Operator daemon state changes mid-run | Evidence drift | Capture pids/leases per iteration |


<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Do genuine daemon crashes still FAIL the suite (TOCTOU, recycled PID, EPERM-as-alive)?
- Can a partial/zombie connect defeat the 410 false-green guard?
- Is the maintainer-mode leak truly sidestepped, or merely hidden in interactive sessions?

<!-- BEGIN GENERATED: deep-research/spec-findings -->
### Deep-research findings (5/5 iterations, stop: maxIterationsReached)

All five claims **PROVEN** via cli-opencode + MiniMax M2.7-highspeed. Canonical synthesis: `research/research.md`.

- **Q1 — crashes still FAIL: PROVEN.** Null-vs-non-null branch on `liveOwnerForService` is the sole FAIL arbiter; `isPidAlive` ESRCH→dead/EPERM→alive correct; TOCTOU not exploitable (synchronous lease read). Caveat **F-005**: PID-recycling can mask a hard crash as SKIP (narrow, real).
- **Q2 — false-green guard fires: PROVEN.** Guard at `substrate-runner-harness.vitest.ts:79-83` catches an all-SKIP 410; the only bypass is the same F-005 path.
- **Q3 — TSV reproducible: PROVEN.** Structure deterministic; pid *values* are session-specific; EPERM-locked-TSV fallback is a stale-pid hazard.
- **Q4 — churn non-harness: PROVEN.** Harness writes zero graph-metadata; child exits before the INDEX scan (`mk-code-index-launcher.cjs:864` < `:944`); operator maintainer-mode daemon is the writer.
- **Q5 — maintainer-mode leak: PROVEN, refined.** "Merely hidden" in interactive sessions (child exits before scan), **live in clean env / CI**; orthogonal to skip-not-fail. `.env.local:4` + unscrubbed env propagation (`buildChildEnv`, `buildDaemonEnv`).

Recommendations: optional PID-identity check for F-005; run-id stamp on the TSV; scrub `SPECKIT_CODE_GRAPH_MAINTAINER_MODE` / temp `SPECKIT_CODE_GRAPH_DB_DIR` for hermetic CI.
<!-- END GENERATED: deep-research/spec-findings -->

<!-- /ANCHOR:questions -->

---
