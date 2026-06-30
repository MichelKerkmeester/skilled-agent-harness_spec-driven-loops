---
title: "Feature Specification: sk-design routing-efficiency benchmark across the five design modes"
description: "Executed Level-1 benchmark-evidence phase: ran a routing-efficiency benchmark of the five sk-design modes two ways, deterministic router-replay (Mode A) and live dispatch via Kimi k2.7 through opencode (Mode B), and recorded the per-mode report pairs plus the combined verdict table. Evidence and verdict only, no skill content changed."
trigger_phrases:
  - "sk-design routing benchmark"
  - "design mode routing efficiency"
  - "design router replay vs live dispatch"
  - "design benchmark verdict table"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/014-routing-benchmark"
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the Level-1 doc set over the five benchmark report pairs and recorded the verdict table"
    next_safe_action: "Benchmark evidence captured pending commit, RESOURCE_MAP trims route to a future phase"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-014-routing-benchmark"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Two scoring modes reconciled: Mode A is the deterministic router-replay CI gate, Mode B is live dispatch through Kimi k2.7 and folds in intentRecall which reads 0 across all modes as a measurement artifact"
      - "Routing economy is the actionable signal: audit and md-generator are heavy fan-out and route to a future RESOURCE_MAP trim"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-design routing-efficiency benchmark across the five design modes

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-27 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../013-mdgen-boundary-cleanup/spec.md |
| **Successor** | ../015-per-skill-improvement-research/spec.md |
| **Handoff Criteria** | The five per-mode report pairs (`<mode>/skill-benchmark-report.{json,md}`) exist for design-interface, design-foundations, design-motion, design-audit, and design-md-generator, the combined two-mode verdict table is recorded in `implementation-summary.md`, and the actionable routing-economy finding (trim the audit and md-generator RESOURCE_MAP fan-out) is captured. No sk-design skill content was changed by this phase |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The five sk-design mode packets (interface, foundations, motion, audit, md-generator) each ship a router that points a model at the references and assets a task needs. Before this phase there was no measured evidence that those routers actually target the right resources, no comparison between deterministic router-replay and a live small model walking the same packets, and no checked-in fixture set to back any score a mode claims. The parallel improvement research in `../015-per-skill-improvement-research` flagged exactly this gap: no mode had its claimed score backed by checked-in fixtures. Without a benchmark, router precision and resource-loading correctness stayed asserted rather than verified, and there was no data to tell a lean router from a heavy one.

### Purpose
Run a routing-efficiency benchmark of the five design modes two ways and record the evidence. Mode A is deterministic router-replay, the CI gate that scores intent routing, discovery, efficiency, and connectivity without a live model. Mode B is live dispatch through Kimi k2.7 over opencode, which walks each packet as a real small model would and folds in usefulness and the live composite. The phase captures the per-mode report pairs as the evidence, records the combined verdict table, and names the one actionable follow-up: trim the RESOURCE_MAP fan-out for the two heavy modes. This is a benchmark-evidence phase, so it changes no sk-design skill content.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The five per-mode benchmark report pairs `<mode>/skill-benchmark-report.{json,md}` for design-interface, design-foundations, design-motion, design-audit, and design-md-generator, captured as the evidence.
- The combined two-mode verdict table (Mode A deterministic router-replay score and verdict, plus the Kimi live aggregate, resourceRecall, routing economy d3, and routed-vs-wasted per query), recorded in `implementation-summary.md`.
- The plain-English findings: strong resource targeting across all modes, the live aggregate gap explained by the intentRecall measurement artifact, and the sharp routing-economy variance that makes audit and md-generator heavy.
- The single actionable follow-up: trim the RESOURCE_MAP fan-out for audit and md-generator, which matches the independent GPT-5.5 improvement research.

### Out of Scope
- Any edit to the sk-design hub, the five mode packets, their references, assets, or routers. This phase records evidence and does not act on it.
- Building the RESOURCE_MAP trim itself. That is the named follow-up and routes to a future phase, not this one.
- The per-skill improvement research synthesis, which is its own sibling phase `../015-per-skill-improvement-research`.

### Inputs (read-only)
- The five report pairs under `design-interface/`, `design-foundations/`, `design-motion/`, `design-audit/`, and `design-md-generator/` produced by the two benchmark runs.
- The sibling research deliverables in `../015-per-skill-improvement-research/00N-<mode>/research/lineages/gpt55fast/research.md`, which independently called for checked-in benchmark fixtures and flagged the heavy fan-out branches.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Created | This benchmark-evidence specification, recording purpose, scope, and the verdict reference |
| `plan.md` | Created | The benchmark execution plan: two modes, five packets, evidence capture |
| `tasks.md` | Created | The task list for running both modes and recording the evidence |
| `implementation-summary.md` | Created | The verdict: the combined two-mode table embedded verbatim plus the plain-English findings and the actionable follow-up |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The five per-mode report pairs exist as the benchmark evidence | Each of `design-interface/`, `design-foundations/`, `design-motion/`, `design-audit/`, and `design-md-generator/` holds `skill-benchmark-report.json` and `skill-benchmark-report.md` |
| REQ-002 | The combined two-mode verdict table is recorded | `implementation-summary.md` embeds the verdict table with Mode A score and verdict, Kimi live aggregate, resourceRecall, routing economy d3, and routed-vs-wasted per query for all five modes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The plain-English findings are captured | `implementation-summary.md` records strong resource targeting (recall 0.78 to 0.93), the live-aggregate gap explained by the uniform intentRecall artifact, and the routing-economy variance singling out audit and md-generator |
| REQ-004 | The actionable follow-up is named and routed | `implementation-summary.md` states the RESOURCE_MAP fan-out trim for audit and md-generator as the next action and notes it matches the independent GPT-5.5 improvement research, with the build itself out of scope here |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The benchmark ran both ways, Mode A deterministic router-replay and Mode B live dispatch via Kimi k2.7 over opencode, across all five design modes, and the per-mode report pairs are captured as the evidence.
- **SC-002**: The combined two-mode verdict table and the plain-English findings are recorded in `implementation-summary.md`, and the one actionable follow-up (trim the audit and md-generator RESOURCE_MAP fan-out) is named and routed to a future phase without changing any sk-design content here.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The live aggregate is read as a per-skill quality drop | Modes look worse than they are and trigger needless rework | Record that the gap is the uniform intentRecall artifact (the live model loads the right resources directly instead of emitting intent-key labels), so it is not a per-skill signal |
| Risk | The verdict table is treated as a pass-fail gate rather than evidence | Conditional modes get blocked when the real signal is routing economy | Frame Mode A as the CI verdict and the rest as diagnostic signals, and route the only action to a RESOURCE_MAP trim |
| Risk | The benchmark evidence drifts from what the modes actually load | Future scores cannot be trusted | Keep the report pairs checked in per mode as the first fixture set, which the sibling research called for |
| Dependency | The five report pairs from the two runs | Evidence cannot be recorded | Confirm each `<mode>/skill-benchmark-report.{json,md}` is present before recording the verdict |
| Dependency | `../015-per-skill-improvement-research` | The actionable follow-up loses its cross-check | Cross-reference the GPT-5.5 research that independently flagged the heavy fan-out branches and missing fixtures |
| Dependency | Kimi k2.7 over opencode | Mode B cannot be reproduced | Record the live scoring method and trace mode in the per-mode reports |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The intentRecall reads 0 across all five modes in live mode. This is a measurement artifact (the live model loads the right resources directly rather than emitting intent-key labels) and is uniform, so it is treated as a live-mode scoring caveat, not a per-skill defect. Whether to add an intent-label probe to live mode is a future benchmark-harness question, not this phase.
- The RESOURCE_MAP fan-out trim for audit and md-generator is the named follow-up. Which references each heavy branch should drop is decided in the build phase that acts on this evidence, informed by the GPT-5.5 improvement research.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
