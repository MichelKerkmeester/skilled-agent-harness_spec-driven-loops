---
title: "Implementation Plan: 026 Program Research and Remediation [system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/018-program-research-and-remediation/plan]"
description: "Two-stage plan: a 3-model deep research over the closed 026 program, then verify-first remediation of the defects it surfaced."
trigger_phrases:
  - "026 program research plan"
  - "research remediation plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/000-release-and-program-cleanup/018-program-research-and-remediation"
    last_updated_at: "2026-06-06T10:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Planned the research + remediation phase"
    next_safe_action: "Run the measurement experiments in research/measurement-backlog.md"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Implementation Plan: 026 Program Research and Remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

Two stages in one phase: a three-model deep research over the closed 026 program (50 angles), then a verify-first remediation of the concrete defects it surfaced across mcp_server (TS), code-graph (TS), deep-improvement (CJS), and the test suite.

### Overview

Generate angles, fan out across MiMo / DeepSeek / MiniMax-M3 in parallel lanes, synthesize, then fix the verified defects in isolation with per-fix build + targeted tests. Treat findings as hypotheses, not facts.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- Each finding reproduced against current source with file:line evidence.

### Definition of Done

- Build green where a dist exists; targeted suite green; diff scope-locked; measurement experiments tracked.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Parallel-lane fan-out for research (one provider per lane); shared post-mutation hook for cache invalidation; conditional-spread response fields for optional signals; fixture parity for launcher tests.

### Key Components

- `runPostMutationHooks` (mutation-hooks.ts) — shared cache invalidation.
- `computeBlastRadius` (code-graph query.ts) — gains the `depthTruncated` signal.

### Data Flow

Angles -> three model lanes -> per-angle notes -> synthesis -> verified fixes -> runtime activation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

- `mcp_server/handlers/causal-graph.ts` — causal link/unlink cache invalidation (+ relation-vocab alignment).
- `deep-improvement/scripts/skill-benchmark/live-executor.cjs` — MiniMax `--variant` forwarding.
- `mcp_server/tests/launcher-ipc-bridge.vitest.ts` — fixture `lib/` copy.
- `system-code-graph/mcp_server/handlers/query.ts` (+ query-handler test) — `depthTruncated` signal.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Generate 50 angles; confirm the three providers live.

### Phase 2: Core Implementation

Run the three-model fan-out + synthesis; land the four verified fixes.

### Phase 3: Verification

Per-fix build + targeted vitest; activate dists (daemon recycle, code-graph reconnect).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Per-fix targeted vitest (293 causal, 35 playbook, 35+15 code-graph) + a launcher un-skip proof. Builds via each subsystem's `npm run build`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Three cli-opencode providers (MiMo / DeepSeek / MiniMax-M3) configured + live.
- `runPostMutationHooks` already exported; code-graph builds from its skill root.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Each fix is isolated + additive; revert the remediation commit to back all four out. Research artifacts are read-only and carry no runtime risk.
<!-- /ANCHOR:rollback -->
