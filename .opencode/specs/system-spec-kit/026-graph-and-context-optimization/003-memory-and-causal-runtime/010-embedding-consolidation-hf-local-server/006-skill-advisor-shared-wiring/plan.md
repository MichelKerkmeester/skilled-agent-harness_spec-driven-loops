---
title: "Implementation Plan: Wire skill-advisor to the shared hf model server"
description: "Point skill-advisor's semantic embedding lane at the shared hf model-server socket, add cross-launcher respawn-lock coverage, and document new HF_EMBED_SERVER env and troubleshooting contracts."
trigger_phrases:
  - "skill-advisor shared wiring plan"
  - "skill-advisor shared embeddings implementation plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/006-skill-advisor-shared-wiring"
    last_updated_at: "2026-05-29T13:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Extraction + wiring delivered per plan; shared lib + both launchers; review fixes applied"
    next_safe_action: "Reconcile parent 029 packet; Option B 6/6 complete"
    blockers: []
    key_files:
      - ".opencode/bin/lib/model-server-supervision.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000396"
      session_id: "029-006-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Wire skill-advisor to the shared hf model server

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript/JavaScript (Node ESM/CJS), local HTTP over UDS/tcp |
| **Framework** | system-spec-kit embeddings, launcher, and MCP server tooling |
| **Storage** | Launcher database dir socket path where applicable |
| **Testing** | vitest plus focused static grep/TypeScript checks |

### Overview
Shared consumer wiring: default both services to one canonical socket, preserve override escape hatches, and document operational states.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (dependsOn: 005-retire-sidecar.)

### Definition of Done
- [x] All P0 acceptance criteria met
- [x] Focused tests and static checks for this phase pass
- [x] Docs/spec/plan/tasks stay aligned
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared consumer wiring: default both services to one canonical socket, preserve override escape hatches, and document operational states.

### Key Components
- Set skill-advisor's semantic lane to use HF_EMBED_SERVER_URL pointing at mk-spec-memory's <dbDir>/hf-embed.sock by default.
- Allow skill-advisor launcher to win model-server spawn when mk-spec-memory is absent through socket-keyed respawn lock.
- Update ENV_REFERENCE.md with new HF model-server envs and sidecar deprecations.
- Document single-resident-model plus 404 fallback contract.
- Add troubleshooting notes for not-started/loading/crash-looped/model-mismatch health states.

### Data Flow
skill-advisor semantic lane resolves shared HF_EMBED_SERVER_URL -> probes model server -> uses rewritten hf-local client -> model mismatch returns 404 and cascades; absent server path uses respawn lock so one launcher starts it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `system-skill-advisor/mcp_server/lib/embedders/index.ts` | Phase surface | Point semantic lane at shared server URL/socket | focused phase tests/static checks |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Phase surface | Add HF_EMBED_SERVER envs and deprecate sidecar envs | focused phase tests/static checks |
| `README.md / troubleshooting docs` | Phase surface | Document health states and single-resident-model contract | focused phase tests/static checks |
| `mcp_server/tests/*skill-advisor*.vitest.ts` | Phase surface | Cross-launcher shared socket and absent-mk-spec-memory spawn coverage | focused phase tests/static checks |

Inventory: use targeted `rg` for the symbols named in this plan before editing. Invariant: skill-advisor and mk-spec-memory can share one resident HF model server.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm phase predecessor handoff is satisfied (005-retire-sidecar)
- [x] Inventory affected symbols and tests before editing

### Phase 2: Core Implementation
- [x] Wire skill-advisor semantic embeddings to the shared model-server URL/socket [REQ-001]
- [x] Add absent-mk-spec-memory cross-launcher respawn-lock coverage [REQ-002]
- [x] Update ENV_REFERENCE.md with new server envs and deprecated sidecar envs [REQ-003]
- [x] Document single-resident-model and 404 fallback behavior [REQ-004]

### Phase 3: Verification
- [x] Add troubleshooting notes for health states [REQ-005]
- [x] Verify multi-consumer load-once behavior [REQ-006]
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | phase-local helpers, parsing, and branch behavior | vitest |
| Integration | end-to-end behavior across touched phase surfaces | vitest |
| Static | imports, stale-symbol grep, and TypeScript safety | rg + tsc |
| Manual | only if lifecycle/socket behavior cannot be fully headless | local launcher session |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 005-retire-sidecar | Internal | Pending | This phase should not implement until predecessor handoff passes |
| dependsOn: 005-retire-sidecar. | Internal | Pending | Required for endpoint/lifecycle contract stability |
| Focused test harness | Internal | Yellow | Phase cannot be claimed complete without behavior coverage |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: This phase causes provider, launcher, socket, or documentation behavior to regress.
- **Procedure**: Revert this phase's scoped files only, preserving prior phases that already validated; keep env/deprecation shims until their owning phase is safely reverted or replaced.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

