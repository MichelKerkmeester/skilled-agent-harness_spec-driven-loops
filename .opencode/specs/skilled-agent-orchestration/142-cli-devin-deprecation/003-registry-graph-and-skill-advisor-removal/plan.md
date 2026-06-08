---
title: "Plan: Phase 3: registry-graph-and-skill-advisor-removal"
description: "Technical plan for cli-devin deprecation phase 3"
trigger_phrases:
  - "phase 3 plan"
  - "registry-graph-and-skill-advisor-removal plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/142-cli-devin-deprecation/003-registry-graph-and-skill-advisor-removal"
    last_updated_at: "2026-06-08T17:36:07.655Z"
    last_updated_by: "deprecation-host"
    recent_action: "Phase 3 plan executed"
    next_safe_action: "Proceed to phase 4"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ctx-142-cli-devin-20260608151217"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Phase 3: registry-graph-and-skill-advisor-removal

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Remove cli-devin/swe-1.6 from the model registry and skill-graph, and remove the full Devin IDE-runtime hook surface. Verified line-resolved edit list: ../context/context-report.md §2.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Every edit applied READ-first, scope-locked to named files.
- No dangling references, no broken syntax, no half-removed blocks.
- Verification command (below) passes before phase is marked complete.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Surgical reference/edit removal across the cli-devin active-wiring surface; no new abstractions. Canonical content that other skills depend on is re-homed rather than deleted (phase 1). Runtime executor union shrinks from 5 to 4 kinds; remaining executors unaffected.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Delete swe-1.6 model; drop cli-devin executor rows from deepseek/kimi/glm
2. Remove cli-devin edges from 6 graph-metadata.json + 2 skill-graph.json exports
3. Delete .devin/hooks.v1.json + hooks/devin/ sources + dist; remove 'devin' runtime enum
4. Decrement advisor playbook scenario count 45->44
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Verification command:

```bash
npx vitest run tests/hooks/runtime-parity.vitest.ts tests/manual-testing-playbook.vitest.ts (5 passed); jq empty the 8 graph JSON files
```
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Predecessor phase complete (see ../spec.md phase map).
- Context Report (../context/context-report.md) as the authoritative edit list.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Nothing is committed during execution; `git restore`/`git checkout` reverts the working-tree changes. Re-homed assets and the deleted skill directory are recoverable from git history until the operator commits.
<!-- /ANCHOR:rollback -->
