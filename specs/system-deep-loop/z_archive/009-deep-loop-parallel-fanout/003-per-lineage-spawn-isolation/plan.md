---
title: "Implementation Plan: Phase 003 — Per-lineage spawn + sub-packet isolation"
description: "Reconstructed Level 2 implementation plan for the per-lineage spawn phase. It restates the spec.md purpose, scope and success criteria; the original plan was never written."
trigger_phrases:
  - "per-lineage spawn isolation plan"
  - "fanout spawn subpacket plan"
importance_tier: "important"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: Phase 003 — Per-lineage spawn + sub-packet isolation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js runtime scripts (`fanout-pool.cjs`) plus the deep-loop YAML command assets |
| **Framework** | deep-loop-runtime fan-out with per-lineage sub-packets |
| **Storage** | Per-lineage sub-packet trees under `{artifact_dir}/lineages/{label}/` |
| **Testing** | Integration test with a stub command spawning two lineages |

### Overview
Run each lineage as the existing deep-loop command verbatim inside its own isolated sub-packet, supplying a single synthesized `config.executor` per lineage and an `--artifact-dir-override` so no lineage writes into another's tree.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 002 capped pool available
- [ ] Executor dispatch strategy recorded in `decision-record.md`

### Definition of Done
- [ ] Sub-packet trees isolated per lineage with distinct sessionIds
- [ ] No lock contention across lineages
- [ ] `validate.sh` passes for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Per-kind native dispatch, recorded in `decision-record.md`: CLI kinds run as pooled headless subprocesses, `native` runs as sequential YAML agent dispatches.

### Key Components
- `fanout-pool.cjs` spawn path
- `step_resolve_artifact_root` override branch in all 4 deep-loop YAMLs
- Recursion guard scoped through per-kind state-dir env hooks

### Data Flow
Each lineage command receives `SPECKIT_FANOUT_LINEAGE_ID={label}` and writes stdout to `{sub-packet}/logs/iter-NNN.out` inside its own sub-packet.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns task state.

### Phase 1: Spawn path
- [ ] Synthesize one `config.executor` per lineage in `fanout-pool.cjs`

### Phase 2: Artifact isolation
- [ ] Add the `--artifact-dir-override` branch to `step_resolve_artifact_root` in all 4 YAMLs

### Phase 3: Verification
- [ ] Integration test: two stub lineages, distinct trees and sessionIds, no lock contention
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Integration coverage with a stub command; exact command output is Not recorded.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 capped pool + status ledger | Internal | Not recorded | Spawn path has no pool to run in |
| `decision-record.md` dispatch strategy | Internal | Accepted | Kind-specific spawn mechanism unspecified |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Not recorded — no rollback steps were captured when the phase was worked.
<!-- /ANCHOR:rollback -->
