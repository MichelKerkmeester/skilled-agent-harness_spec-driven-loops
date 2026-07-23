---
title: "Implementation Plan: Measured Native Experiments (Roadmap Phase 2)"
description: "Implementation plan for the SLO-gated native-candidate evaluation phase — entry gate, three candidate evaluations, sk-code/018 shell/adapter/core shape, and the oracle-win plus byte-parity promotion gate."
trigger_phrases:
  - "measured native experiments implementation plan"
  - "sk-code 018 shell adapter core shape"
  - "oracle win byte parity promotion gate"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/002-style-database/004-measured-native"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "spec-author"
    recent_action: "Authored Level 2 planning docs (spec/plan/tasks/checklist/implementation-summary) for phase"
    next_safe_action: "Await parent orchestrator to finalize description.json/graph-metadata.json and run validate.sh"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/_db/retrieval.mjs"
      - ".opencode/skills/sk-design/styles/_db/vectors.mjs"
      - ".opencode/specs/sk-design/012-sk-design-program/002-style-database/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Measured Native Experiments (Roadmap Phase 2)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JS (Node ESM) shell; conditional Rust via a thin napi-rs adapter over a pure `#![forbid(unsafe_code)]` core (sk-code/018) |
| **Framework** | `legacy\|shadow\|persistent` adapter selection inside the existing styles database |
| **Candidates** | sqlite-vec (native exact), Rust `ort` sidecar, bounded Rust parse core |
| **Testing** | End-to-end oracle win + byte-for-byte differential parity vs the pinned TS oracle |

### Overview
This phase is CONDITIONAL. Nothing runs unless Phase 0 (`001-foundation`) telemetry flags a named stage crossing a measured SLO. When it does, exactly one candidate kernel is prototyped behind the `legacy\|shadow\|persistent` adapter, replayed byte-for-byte against the pinned TS oracle, and measured end-to-end. The TS shell always retains transport, adapter selection, flags, publication, and fallback — any Rust is a thin, isolated adapter over one measured kernel, never a rewrite.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified (Phase 0 oracle/telemetry, sk-code/018 contract)
- [ ] NFRs defined with targets

### Definition of Done
- [ ] All P0 requirements met or explicitly resolved to "no Rust"
- [ ] Every promoted candidate passes end-to-end oracle win + byte-for-byte parity
- [ ] Docs updated (spec/plan/tasks) and reconciled
- [ ] Checklist items verified

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shell/adapter/core (sk-code/018) — the TS shell owns transport, adapter selection, flags, DB writes, publication, and fallback; any Rust is a thin napi-rs adapter over exactly one pure kernel.

### Key Components
- **Entry Gate**: Reads Phase 0 telemetry and confirms a named-stage SLO crossing before anything else runs
- **Candidate A (sqlite-vec)**: Maintained native exact vector search, evaluated behind the adapter
- **Candidate B (`ort` sidecar)**: Supervised Rust inference process for crash/RSS/deployment isolation, not speed
- **Candidate C (bounded parse core)**: A single Rust kernel scoped to one measured parse hotspot
- **Promotion Gate**: Enforces end-to-end oracle win + byte-for-byte parity before any candidate may replace the default path

### Data Flow
Phase 0 telemetry flags a stage SLO crossing → a single candidate kernel is prototyped behind the `legacy\|shadow\|persistent` adapter → it replays the pinned TS oracle byte-for-byte AND is measured end-to-end → promote via the manifest or reject ("no Rust"); the TS shell always retains transport, selection, flags, publication, and fallback.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A — planning packet, not a bug fix. No runtime file is modified by this packet; `retrieval.mjs`, `vectors.mjs`, and any future Rust adapter/core boundary are referenced for orientation only (see spec.md Section 3, Files to Change).

<!-- /ANCHOR:affected-surfaces -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Entry Gate
- [ ] Confirm a Phase 0 telemetry SLO crossing on a specific named stage; absent a crossing, stop and record "no Rust"

### Phase 1: Candidate A — Maintained sqlite-vec / Native Exact Vector Search
- [ ] Evaluate sqlite-vec as an EXACT (not approximate) vector search path that removes JSON-parse + JS-sort

### Phase 2: Candidate B — Supervised Rust `ort` Inference Sidecar
- [ ] Evaluate a Rust `ort` sidecar for crash/RSS/deployment ISOLATION — not presumed speed, since both Node and Rust wrap the same native ONNX kernels

### Phase 3: Candidate C — Bounded Rust Parse Core
- [ ] Evaluate a single-kernel Rust parse core, only if parse cost is itself a measured SLO crosser

### Per-Candidate Promotion Gate
- [ ] Promote a candidate only if it beats the TS oracle end-to-end AND passes byte-for-byte parity; otherwise reject and record "no Rust" for that candidate

### Exit Gate
- [ ] Confirm every candidate is either promoted or rejected; no default-path change happens until both the parity and telemetry gates pass

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Entry-gate check | Confirm a named-stage SLO crossing before any candidate work begins | Phase 0 telemetry + pinned TS oracle (`001-foundation`) |
| End-to-end oracle win | Each candidate vs. the pinned TS oracle | Phase 0 differential-oracle harness |
| Byte-for-byte parity | Each candidate's output vs. the TS oracle, byte-for-byte | Phase 0 fixture set (1x/10x/100x) |
| Residency-honesty review | Every performance claim in this phase's docs | Manual review against the native-vs-JS-resident decomposition |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-foundation` telemetry + pinned TS oracle | Internal | Planned (hard blocker) | No candidate can be measured or promoted |
| sk-code/018 shell/adapter/core contract | Internal | Planned | No sanctioned shape for introducing Rust |
| Maintained `sqlite-vec` library | External | Conditional | Candidate A cannot be evaluated |
| Rust `ort` crate | External | Conditional | Candidate B cannot be evaluated |
| `napi-rs` | External | Conditional | No sanctioned Rust-to-Node adapter boundary |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A promoted candidate later fails byte parity, or a "no Rust" determination is found to rest on a misread SLO crossing
- **Procedure**: This packet ships no runtime code, so there is nothing to revert at this phase; a future execution phase that promotes a candidate rolls back to the TS-owned default path, which retains no native dependency

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Entry Gate (SLO crossing) ──┬──> Candidate A (sqlite-vec)  ──┐
                             ├──> Candidate B (ort sidecar)  ├──> Per-Candidate Gate ──> Exit Gate
                             └──> Candidate C (parse core)   ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Entry Gate | Phase 0 (`001-foundation`) SLO crossing | Candidates A, B, C |
| Candidate A (sqlite-vec) | Entry Gate | Per-Candidate Gate |
| Candidate B (`ort` sidecar) | Entry Gate | Per-Candidate Gate |
| Candidate C (parse core) | Entry Gate + a measured parse-cost crossing | Per-Candidate Gate |
| Per-Candidate Gate | Candidates A, B, C | Exit Gate |
| Exit Gate | Per-Candidate Gate | `004-growth` (Roadmap Phase 3) |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Entry Gate check | Low | 0 hours this packet (evaluation criterion only; executed in a future measurement phase) |
| Candidate A (sqlite-vec) | Conditional | TBD — incurred only if the entry gate crosses |
| Candidate B (`ort` sidecar) | Conditional | TBD — incurred only if the entry gate crosses |
| Candidate C (parse core) | Conditional | TBD — incurred only if parse cost is a measured crosser |
| **Total (this packet)** | | **0 hours — planning-only; all execution effort deferred to a conditional future phase** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (N/A — no code shipped this packet)
- [ ] Feature flag configured (N/A — no candidate promoted this packet)
- [ ] Monitoring alerts set (deferred to a future execution phase, if triggered)

### Rollback Procedure
1. **Immediate**: N/A — this packet ships no runtime code
2. **Revert code**: N/A this packet; a future execution phase would revert to the TS-owned default path
3. **Database**: N/A — no schema or data changes in this packet
4. **Verify**: N/A this packet
5. **Notify**: N/A this packet

### Data Reversal
- **Has data migrations?** No (planning packet)
- **Reversal procedure**: N/A

<!-- /ANCHOR:enhanced-rollback -->
