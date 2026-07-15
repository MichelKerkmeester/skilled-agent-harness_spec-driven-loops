---
title: "Feature Specification: 026 Program Research and Remediation [system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/018-program-research-and-remediation/spec]"
description: "Deep research over the closed 026 program (50 angles, 3 models) plus the verified code remediation it drove. Measurement experiments tracked as a backlog."
trigger_phrases:
  - "026 program research"
  - "research driven remediation"
  - "026 retrospective"
  - "deep research synthesis"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/000-release-and-program-cleanup/018-program-research-and-remediation"
    last_updated_at: "2026-06-06T12:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Ran backlog item 4 (fan-out diversity experiment)"
    next_safe_action: "Run backlog item 5 (advisor calibration) or item 2 (cloud A/B)"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
      - "research/research.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Feature Specification: 026 Program Research and Remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-05 |
| **Updated** | 2026-06-06 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 026 graph-and-context-optimization program closed without a retrospective, and a deep review suggested it shipped mechanisms while deferring the measurements that prove them optimal. Separately, that review surfaced concrete code defects that needed fixing.

### Purpose

Deep-research the closed 026 program across 50 falsifiable angles using three diverse models, then remediate the verified, fixable defects the research surfaced — keeping the measurement experiments (runs, not fixes) as a tracked, actionable backlog.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- 50 research angles across the eight 026 tracks plus runtime/process themes (`research/research-angles.md`).
- A three-model parallel-lane deep research (MiMo-V2.5-Pro / DeepSeek-v4-pro / MiniMax-M3) with a cross-model synthesis (`research/research.md`).
- The four verified code fixes the research drove (causal cache invalidation, MiniMax `--variant`, launcher fixture, code-graph `depthTruncated`).
- A ranked measurement backlog with commands + blockers (`research/measurement-backlog.md`).
- The first backlog experiment, run 2026-06-06 per operator direction (Gate 3: existing packet): fan-out lineage diversity (angles 31/35), pre-registered design + analysis in `research/experiments/fanout-diversity/`.

### Out of Scope

- Running the remaining measurement experiments (backlog items 1–3, 5–7 — deferred; see the handover and the backlog). Item 4 was pulled into scope and completed on 2026-06-06.

### Files to Change

- `mcp_server/handlers/causal-graph.ts`
- `deep-improvement/scripts/skill-benchmark/live-executor.cjs`
- `mcp_server/tests/launcher-ipc-bridge.vitest.ts`
- `system-code-graph/mcp_server/handlers/query.ts` (+ its query-handler test)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

- Each research finding is verified against source before any fix; refuted findings are not "fixed".
- Each fix builds its dist (where applicable) and passes its targeted test suite.

### P1 - Required (complete OR user-approved deferral)

- Cross-model synthesis identifies the dominant theme and the highest-value fixes/experiments.
- Two research findings corrected during verification; one verified in-file bonus fix folded in and disclosed.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- 50 angles researched by three models; synthesis written.
- Four fixes shipped with green builds + targeted tests, and activated at runtime.
- Measurement experiments captured as an actionable backlog, not silently dropped.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Removing the MiniMax variant exception could break dispatches if the model rejected the flag — mitigated by a live acceptance test before editing.
- Rebuilt dists are inert until runtime activation (mk-spec-memory recycle, code-graph reconnect).
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. The remaining experiment runs are tracked in `research/measurement-backlog.md` and `handover.md`.
<!-- /ANCHOR:questions -->
