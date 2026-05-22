---
title: "Memory Leak Remediation Arc — Phase Parent"
description: "Phase parent for memory and process lifecycle remediation across Spec Kit Memory, deep-loop CLI dispatch, CocoIndex, Code Graph, rerank sidecars, and Apple Silicon host-memory verification."
trigger_phrases:
  - "memory leak remediation arc"
  - "009 memory leak arc"
  - "process lifecycle cleanup"
  - "sidecar daemon memory cleanup"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation-arc"
    last_updated_at: "2026-05-22T13:31:36Z"
    last_updated_by: "opencode"
    recent_action: "completed-phase-006-cocoindex-lifecycle"
    next_safe_action: "start-007-code-graph-launcher"
    blockers: []
    key_files:
      - "spec.md"
      - "description.json"
      - "graph-metadata.json"
      - "001-research-synthesis-and-remediation-map/research/source-research/"
    session_dedup:
      fingerprint: "sha256:0090090090090090090090090090090090090090090090090090090090090090"
      session_id: "009-memory-leak-remediation-arc"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions:
      - "Original research artifacts from packets 020 and 024 are archived under phase 001 research/source-research/."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-parent | v2.2 -->
# Memory Leak Remediation Arc

<!-- SPECKIT_LEVEL: phase-parent -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  This is a lean phase-parent control file. Control docs stay limited to
  {spec.md, description.json, graph-metadata.json}. Historical source research
  is archived under phase 001 research/source-research/ for provenance; heavy
  working docs live in each phase child where they stay accurate to that phase's actual work.
-->

---

<!-- ANCHOR:root-purpose -->
## 1. ROOT PURPOSE

Coordinate memory and process-lifecycle remediation across the 016 embedder architecture umbrella. The arc covers CLI dispatch containment, deep-loop state safety, expected-daemon classification, host-memory telemetry, CocoIndex indexing lifecycle, Code Graph launcher ownership, rerank sidecar/model cleanup, and Spec Kit Memory runtime retention.

The operating rule is verification first: no cleanup path may claim memory relief or kill a process unless ownership, resource identity, and before/after telemetry are explicit.
<!-- /ANCHOR:root-purpose -->

---

<!-- ANCHOR:phase-map -->
## 2. PHASE MAP

| Phase | Focus | Priority | Status |
|---|---|---|---|
| `001-research-synthesis-and-remediation-map/` | Research Synthesis and Remediation Map | P0 | Completed |
| `002-telemetry-and-process-verification-harness/` | Telemetry and Process Verification Harness | P0 | Completed |
| `003-cli-dispatch-containment-and-recursion-guards/` | CLI Dispatch Containment and Recursion Guards | P0 | Completed |
| `004-deep-loop-locks-state-and-recovery/` | Deep Loop Locks, State, and Recovery | P1 | Completed |
| `005-expected-daemon-classifier-and-process-sweep/` | Expected Daemon Classifier and Process Sweep | P1 | Completed |
| `006-cocoindex-remove-cancel-and-index-lifecycle/` | CocoIndex Remove, Cancel, and Index Lifecycle | P1 | Completed |
| `007-code-graph-launcher-and-db-lifecycle/` | Code Graph Launcher and DB Lifecycle | P1 | Planned |
| `008-sidecar-local-model-and-adapter-lifecycle/` | Sidecar, Local Model, and Adapter Lifecycle | P1 | Planned |
| `009-spec-memory-runtime-retention-cleanup/` | Spec Memory Runtime Retention Cleanup | P1 | Planned |
| `010-final-regression-and-operator-runbook/` | Final Regression and Operator Runbook | P1 | Planned |

### Phase Transition Rules

- Phase 001 creates the authoritative remediation map before runtime fixes begin.
- Phase 002 supplies the telemetry and process verification harness used by later phases.
- Destructive cleanup remains disabled until exact ownership and dry-run evidence exist.
- Each child phase validates independently before its successor starts.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|----|----------|--------------|
| `001-research-synthesis-and-remediation-map` | `002-telemetry-and-process-verification-harness` | Strict spec validation plus manual evidence-link spot checks | Phase summary records evidence and next risks. |
| `002-telemetry-and-process-verification-harness` | `003-cli-dispatch-containment-and-recursion-guards` | Synthetic child/grandchild, stale lock, sidecar, and vm_stat/sysctl fixtures | Phase summary records evidence and next risks. |
| `003-cli-dispatch-containment-and-recursion-guards` | `004-deep-loop-locks-state-and-recovery` | Nested CLI fixtures, ignored SIGTERM child fixture, dispatch audit failure records | Phase summary records evidence and next risks. |
| `004-deep-loop-locks-state-and-recovery` | `005-expected-daemon-classifier-and-process-sweep` | Kill-during-append, corrupt-trailing-line, dead-PID lock, concurrent run fixtures | Phase summary records evidence and next risks. |
| `005-expected-daemon-classifier-and-process-sweep` | `006-cocoindex-remove-cancel-and-index-lifecycle` | Fixture process tables for ancestors, EPERM, stale PIDs, sidecars, ccc daemons, browser sessions | Phase summary records evidence and next risks. |
| `006-cocoindex-remove-cancel-and-index-lifecycle` | `007-code-graph-launcher-and-db-lifecycle` | remove-during-index, load-time cancel, stale cancel identity, threadpool shutdown, post-remove search/index usability | Phase summary records evidence and next risks. |
| `007-code-graph-launcher-and-db-lifecycle` | `008-sidecar-local-model-and-adapter-lifecycle` | Same-effective-DB, symlink, EPERM, PPID-1 orphan, child-survival, closeDb fixtures | Phase summary records evidence and next risks. |
| `008-sidecar-local-model-and-adapter-lifecycle` | `009-spec-memory-runtime-retention-cleanup` | Healthy reuse, unknown-owner refusal, stale exact-PID cleanup, sidecar 5xx fallback RSS, adapter close idempotence | Phase summary records evidence and next risks. |
| `009-spec-memory-runtime-retention-cleanup` | `010-final-regression-and-operator-runbook` | Stress save/search/index workloads, pending-job caps, retry abort, lease cleanup, timer shutdown, audit rotation cap | Phase summary records evidence and next risks. |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:what-needs-done -->
## 3. WHAT NEEDS DONE

1. Build the consolidated finding and dependency map from source packets 020 and 024.
2. Build telemetry and process verification before claiming fixes.
3. Fix CLI containment and deep-loop state hazards that can create new process storms.
4. Fix daemon, sidecar, model, adapter, graph DB, and Spec Kit Memory runtime lifecycle gaps.
5. Finish with an operator runbook that separates safe cleanup from reboot-only Apple Silicon pressure.

Source evidence from packets 020 and 024 has been relocated under `001-research-synthesis-and-remediation-map/research/source-research/` in this arc and is linked through graph metadata. This arc owns remediation coordination and implementation sequencing.
<!-- /ANCHOR:what-needs-done -->
