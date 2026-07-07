---
title: "Implementation Plan: Touchpoint Research — CocoIndex / Rerank-Sidecar Deprecation Discovery"
description: "Execution plan for the 12-iteration deep-research loop mapping CocoIndex, rerank-sidecar, and code-graph coupling touchpoints. Dispatch matrix, charter, and convergence settings."
trigger_phrases:
  - "touchpoint research plan"
  - "deep-research dispatch strategy"
  - "cocoindex deprecation research plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/002-deprecate-coco-index/001-touchpoint-research"
    last_updated_at: "2026-05-25T08:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored research execution plan; run complete"
    next_safe_action: "Plan/execute deprecation phases 002-008"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000014001"
      session_id: "014-001-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Touchpoint Research — CocoIndex / Rerank-Sidecar Deprecation Discovery

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown research artifacts; bash / grep / Read evidence gathering |
| **Framework** | deep-research loop (deep-loop-runtime) |
| **Storage** | research/ JSONL state + iteration markdown |
| **Testing** | convergence detection + post-dispatch-validate gate |

### Overview
Run the deep-research loop in this subphase to produce a classified touchpoint resource map. Ten iterations dispatch via cli-devin swe-1.6 under the read-only research-iter agent-config recipe; two closing iterations dispatch via cli-opencode deepseek-v4 for adversarial cross-model gap-finding. Iterations run one at a time with a SIGKILL between dispatches to avoid memory thrash.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in spec.md
- [x] Success criteria measurable (SC-001 through SC-003)
- [x] Dependencies identified (deep-loop-runtime present and verified)

### Definition of Done
- [ ] resource-map.md classifies every live touchpoint with a mutation class
- [ ] Deprecation phase DAG scaffolded in the 014 parent
- [ ] Both dangerous couplings carry evidence-cited remediation paths
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Iterative deep-research loop with fresh context per iteration and externalized JSONL state.

### Dispatch Matrix

| Iterations | Executor | Model | Notes |
|-----------|----------|-------|-------|
| 1-10 | cli-devin | swe-1.6 | research-iter recipe, gtimeout 900, read-only |
| 11-12 | cli-opencode | deepseek-v4 | --pure, --variant, stdin from /dev/null, adversarial gap-find |

### Research Charter (RQ1-RQ7)
RQ1 exhaustive classified inventory; RQ2 rerank consumers plus memory fallback; RQ3 code-graph decouple edit-set; RQ4 semantic-search replacement policy; RQ5 four-runtime mirror plus configs; RQ6 phase DAG, ordering, risk, negative knowledge; RQ7 deletion completeness.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Init
Resolve artifact dir, write config (executor cli-devin swe-1.6, maxIterations 12, convergence 0.02), seed strategy with the RQ charter, initialize state log and registry.

### Phase 2: Loop
Dispatch iterations 1-10 (cli-devin swe-1.6) then 11-12 (cli-opencode deepseek-v4), one at a time, evaluating convergence and reducing state after each.

### Phase 3: Synthesis
Compile research.md, emit resource-map.md, promote the map to the 014 root, and scaffold the deprecation phase DAG.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each iteration passes post-dispatch-validate (iteration markdown present, JSONL appended with required fields, delta record present). Convergence requires the 3-signal vote plus the graph-convergence gate. Quality guards (source diversity, focus alignment) must pass before STOP.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- deep-loop-runtime (executor-config, prompt-pack, convergence.cjs, upsert.cjs)
- deep-research/scripts/reduce-state.cjs
- cli-devin binary + research-iter agent-config recipe + sequential_thinking MCP registration
- cli-opencode binary reachable for the deepseek closing iterations
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Research is read-only and produces only packet artifacts under research/. Rollback is deletion of the research/ directory; no source or config is modified by this subphase. Deletion phases (002+) are scaffolded but not executed here.
<!-- /ANCHOR:rollback -->
