---
title: "Plan: Injection Measurement and Rollback Harness"
description: "Completed execution record for source-executed byte measurement, Gate-3 wiring verification, and per-phase rollback documentation."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "injection measurement and rollback plan"
  - "migration measurement receipts"
  - "fallback counter plan"
importance_tier: "high"
contextType: "plan"
parent: "hooks/002-injection-bloat-reduction"
predecessor: "001-per-prompt-injection-audit"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/019-injection-measurement-and-rollback"
    last_updated_at: "2026-08-09T14:53:04Z"
    last_updated_by: "sol"
    recent_action: "Added measurement, Gate-3, and rollback tooling"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/render.ts"
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts"
      - ".opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs"
      - "specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation/rollback-procedure.md"
    session_dedup:
      fingerprint: "sha256:9aa9b97f0d6f4f69195450d90b28a09dd43a3c6e2bf001ce11951e1473db7a52"
      session_id: "2026-08-09-injection-measurement-rollback"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: Injection Measurement and Rollback Harness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

The repository exposed deterministic directive composition and an existing Gate-3 suppression helper. Those seams supported source-level measurement and wiring verification without changing runtime behavior.

### Overview

The phase added one measurement script, one four-check Gate-3 verifier, and one rollback procedure covering phases 015-018.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- Identify the source composition paths for the four required byte counts.
- Identify the `shouldSuppressGate3Delivery` export and call path.
- Inventory the disable and state-clear surfaces for phases 015-018.

### Definition of Done

- Four concrete byte counts are reported.
- Four Gate-3 export-and-wiring checks pass.
- Rollback guidance covers all four prior phases.
- No runtime behavior changes.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

The phase used packet-local verification tools. Measurements executed repository source paths, the Gate-3 script inspected active wiring, and rollback stayed documentary.

### Key Components

- `scripts/measure-injection-footprint.cjs`: source-executed byte counts.
- `scripts/verify-037-live.cjs`: four checks for the Gate-3 suppression export and wiring.
- `rollback-procedure.md`: per-phase disable, clear, and confirm actions.

### Data Flow

`repository sources` → `packet-local measurement/verifier` → `concrete result` → `completion evidence`.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline Inventory

The source composition paths, Gate-3 helper path, and phase 015-018 rollback surfaces were identified.

### Phase 2: Measurement and Verification

The measurement script and Gate-3 verifier were added. The former produced four byte counts; the latter passed four checks.

### Phase 3: Rollback Documentation

The rollback procedure recorded the disable flag, state-clear action, and confirmation command for every phase from 015 through 018.

### Phase 4: Verification

The packet results were reconciled without a runtime change.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The measurement harness executed the actual source composition paths and reported 763 B, 554 B, 1,364 B, and 42 B for the four named cases. The Gate-3 verifier ran four checks against the exported and wired `shouldSuppressGate3Delivery` path. Rollback coverage was inspected directly in `rollback-procedure.md`.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Canonical directive and Pi dispatch composition sources.
- The existing Gate-3 core module and `shouldSuppressGate3Delivery`.
- Existing disable flags and state-reset surfaces for phases 015-018.
- No new runtime dependency.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The phase made no runtime change. Removing the two packet-local scripts and rollback document reverts its artifacts. Runtime rollback for phases 015-018 follows `rollback-procedure.md`, which names each disable flag, state-clear action, and confirmation command.

<!-- /ANCHOR:rollback -->
