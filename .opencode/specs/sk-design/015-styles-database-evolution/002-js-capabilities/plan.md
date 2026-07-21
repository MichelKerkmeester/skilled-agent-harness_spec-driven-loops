---
title: "JS Capability Features (Roadmap Phase 1)"
description: "Level 2 implementation plan for Roadmap Phase 1 of the sk-design styles-database evolution: architecture, data flow, phased rollout, and rollback for the five JS-only capability lanes."
trigger_phrases:
  - "js capability features implementation plan"
  - "styles db phase 1 architecture shadow flag lanes"
  - "batched embedding watcher reconciliation plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/015-styles-database-evolution/002-js-capabilities"
    last_updated_at: "2026-07-20T09:19:14Z"
    last_updated_by: "spec-author"
    recent_action: "Author Level 2 spec-folder docs (spec/plan/tasks/checklist/implementation-summary) for"
    next_safe_action: "Plan and build 001-foundation (Phase 0) first; 002-js-capabilities remains PLANNED until Phase"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/_db/retrieval.mjs"
      - ".opencode/skills/sk-design/styles/_db/vectors.mjs"
      - ".opencode/specs/sk-design/015-styles-database-evolution/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: JS Capability Features (Roadmap Phase 1)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (Node ESM) |
| **Framework/Module** | sk-design styles database module |
| **Storage/Runtime** | Existing Node ONNX/Transformers.js (onnxruntime-node) + sharp/libvips + Chokidar |
| **Testing** | `node --test`; parity checks where a lane overlaps an existing output |

### Overview
This phase sequences five JS-only capability features (plus one optional, telemetry-gated feature) onto the existing Node stack once Phase 0's measurement plane exists. Every feature ships behind a shadow/flag path with parity where it overlaps an existing output. No Rust is introduced anywhere in this phase.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 0 (`001-foundation`) manifest + telemetry + oracle + fixtures shipped
- [ ] Shadow/flag scaffolding pattern agreed for all five lanes
- [ ] REQ-001 through REQ-007 documented in spec.md

### Definition of Done
- [ ] Each feature (REQ-001–REQ-005) behind a shadow/flag path with measured parity where it overlaps an existing output
- [ ] REQ-006 either shipped (on positive telemetry) or explicitly deferred
- [ ] Default read path shows zero regression
- [ ] Zero Rust introduced

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shadow/flag feature lanes layered on the existing Node styles-database module — each new capability is additive and gated, never replacing the default path until measured and promoted.

### Key Components
- **Layout fingerprint extractor**: derives fingerprints from the crawler's existing per-viewport geometry (rectangles/padding/margins/gaps/flex/grid/landmarks)
- **Screenshot feature pipeline**: sharp/libvips-backed palette/statistics + pHash near-duplicate signal
- **Shadow multimodal lane**: text+image/CLIP retrieval over the existing onnxruntime-node (ONNX/Transformers.js) stack
- **Batched embedding scheduler**: replaces per-call embedder draining with batch-aware queue processing
- **Watcher + reconciliation**: Chokidar watcher as trigger, periodic reconciliation as the correctness authority
- **Optional parsed-projection cache**: conditional on Phase 0 cold-build telemetry

### Data Flow
1. The crawler's existing per-viewport geometry -> layout fingerprints (REQ-001)
2. Screenshots -> sharp/libvips palette/stats + pHash near-dup signal (REQ-002)
3. Text + image -> shadow CLIP lane over the ONNX stack (REQ-003)
4. Embedding jobs -> batched queue (REQ-004)
5. Filesystem changes -> watcher (trigger) -> reconciliation (authority) -> reindex into a new generation, published via the Phase 0 manifest (REQ-005)

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A — planning packet, not a bug fix.

<!-- /ANCHOR:affected-surfaces -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Entry Gate
- [ ] Phase 0 complete: manifest, stage telemetry, pinned TS differential oracle, 1x/10x/100x fixtures, labeled relevance judgments all shipped

### Phase 1: Feature Track (parallelizable behind shadow/flag)
- [ ] Layout fingerprints (REQ-001)
- [ ] Screenshot palette/stats + pHash near-dup dedupe (REQ-002)
- [ ] Shadow multimodal CLIP lane (REQ-003)
- [ ] Batched embedding queue (REQ-004)
- [ ] Auto-reindex watcher + reconciliation (REQ-005)

### Phase 2: Optional Track
- [ ] Parsed-projection cache — conditional on Phase 0 cold-build telemetry proving value (REQ-006)

### Exit Gate
- [ ] Each feature behind shadow/flag with measured parity where overlapping
- [ ] New lanes measured against Phase 0 telemetry
- [ ] No regression to the default path

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Fingerprint extraction, palette/stat + pHash functions, batching scheduler | `node --test` |
| Parity | Each lane that overlaps an existing output vs. the current default path | Phase 0 differential oracle |
| Telemetry | New-lane throughput/latency vs. Phase 0 baselines | Phase 0 stage telemetry |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 0 (`001-foundation`) | Internal | Planned | Hard blocker — no Phase 1 feature can be measured or entry-gated |
| Node ONNX/Transformers.js (onnxruntime-node) | Internal (existing) | Green | Shadow multimodal lane (REQ-003) has no runtime |
| sharp/libvips | Internal (existing) | Green | Screenshot palette/stats + pHash dedupe (REQ-002) has no runtime |
| Chokidar | Internal (existing) | Green | Auto-reindex watcher (REQ-005) has no trigger |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any shadow/flag lane shows non-parity against the default path, or Phase 0 telemetry is unavailable
- **Procedure**: Disable the affected flag; the default read path is never touched by a Phase 1 lane, so rollback is a flag flip, not a data migration

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 0 (Foundation) ──> Entry Gate ──> Feature Track (parallel: REQ-001..005) ──> Exit Gate
                                          └─> Optional Track (REQ-006, conditional)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Entry Gate | Phase 0 (`001-foundation`) | Feature Track, Optional Track |
| Feature Track | Entry Gate | Exit Gate |
| Optional Track | Entry Gate, Phase 0 cold-build telemetry | Exit Gate (only if pursued) |
| Exit Gate | Feature Track (+ Optional Track if pursued) | `003-measured-native` |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Entry Gate confirmation | Low | Deferred — depends on Phase 0 completion date |
| Feature Track (5 lanes) | High | Deferred — largest capability surface in the 015 roadmap |
| Optional Track (REQ-006) | Low-Medium | Deferred — conditional on telemetry |
| **Total** | | **Not estimated — planning packet, Status: PLANNED** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Phase 0 telemetry baseline captured before any lane is measured
- [ ] Each feature's shadow/flag default is OFF
- [ ] Reconciliation pass verified authoritative before the watcher is trusted

### Rollback Procedure
1. **Immediate**: Flip the affected feature's flag off
2. **Revert code**: `git revert` the feature's commits if the flag alone is insufficient
3. **Data**: No default-path data is touched by any Phase 1 lane, so no data reversal is required
4. **Verify**: Confirm the default read path telemetry returns to its Phase 0 baseline

### Data Reversal
- **Has data migrations?** No — every Phase 1 feature is additive and shadow/flag-gated; the default path's data is never modified
- **Reversal procedure**: N/A

<!-- /ANCHOR:enhanced-rollback -->
