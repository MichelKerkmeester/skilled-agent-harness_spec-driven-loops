---
title: "Feature Specification: Implement the improvement-research findings (make C-plus real + hardening)"
description: "Implement the actionable findings from the 5-iteration improvement research: make the C-plus routing guarantee real (CI gate + /doctor advisor-sync coverage + codegen), give deep-loop-runtime its own dependency manifest, unify loop-locking across the graph-backed modes, and a set of low-regret hardening. All findings preserve the invariants; the meta 'do not' recommendations (no rearchitecture, no deep-improvement split, no ai-council rename, no lexical-regex codegen) are explicitly out of scope."
trigger_phrases:
  - "implement improvement research findings"
  - "make C-plus real CI advisor-sync"
  - "deep-loop runtime self-contained loop-lock"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/155-parent-nested-skill-pattern/004-improvement-implementation"
    last_updated_at: "2026-06-15T15:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Made C-plus real (CI gate + /doctor advisor-sync); clusters B/C/D in flight"
    next_safe_action: "Integrate the cluster agents, verify, commit; track the codegen follow-on"
    blockers: []
    key_files:
      - ".github/workflows/routing-registry-drift.yml"
      - ".opencode/commands/doctor/scripts/parent-skill-check.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-155-004-improvement-implementation"
      parent_session_id: null
    completion_pct: 60
    open_questions:
      - "Codegen the projection maps from the registry (P1) — staged as a follow-on; A3+A4 already make drift reliably caught"
    answered_questions: []
---
# Feature Specification: Implement the improvement-research findings

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-06-15 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Phase** | 004 (parent: `155-parent-nested-skill-pattern`) |
| **Depends on** | `../improvement-research/improvement-research.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 5-iteration improvement research found the deep-loop architecture is sound but the C-plus routing guarantee is *aspirational* (the drift-guard test exists but nothing runs it; the guard + `/doctor` are hardcoded to the canonical skill, so a 2nd parent skill's `advisorRouting` is inert + unguarded), the runtime is "MCP-free in name but parasitic on `system-spec-kit`'s node_modules", loop-locking is inconsistent (prose-only / missing across modes), and a set of low-regret hardening gaps exist.

### Purpose
Implement the actionable findings (7 P1 + the actionable P2/P3), all invariant-preserving, decomposed into independent clusters and parallelized.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (by cluster)
- **A — Make C-plus real** (orchestrator): a CI workflow that runs the drift-guard + parity + `/doctor` on PR; a `/doctor` advisor-sync coverage check (flag inert lexical modes); [follow-on] codegen the projection maps from the registry + a registry JSON Schema.
- **B — Runtime self-containment** (agent, worktree): `deep-loop-runtime` own `package.json` + bare specifiers replacing the 8 `system-spec-kit/node_modules` reach-ins + a seam guard test.
- **C — Loop-locking** (agent): route research/review/ai-council through the promoted runtime loop-lock CLI; race-safe stale-reclaim; atomic fan-out-merge write.
- **D — Hardening** (agent): lifecycle-taxonomy drift-guard + `userPaused` reconcile; advisory benchmark mode-precision signal; the stale `@deep-ai-council` doc fix; runtime_capabilities conformance test.

### Out of Scope (the meta "do NOT" recommendations + deliberate defers)
- No rearchitecture; no `deep-improvement` split; no `ai-council` rename (machine-guard the grandfather instead); no codegen of the lexical regex weights.
- The shared reducer-core (P3) is an "investigate" with a wrong-abstraction risk — deferred by decision.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **R1 (MUST):** A PR-triggered CI gate runs the routing drift-guard + parity suites + `/doctor:parent-skill`.
- **R2 (MUST):** `/doctor` surfaces the inert-routing gap — a lexical mode whose `legacyAdvisorId` is absent from the advisor map WARNs (not fails); the canonical still asserts exact equality.
- **R3 (MUST):** `deep-loop-runtime` resolves its deps from its own manifest (zero `system-spec-kit/node_modules` reach-ins); its full test suite stays green.
- **R4 (MUST):** All four graph-backed modes acquire a real lock via the promoted CLI; the lock primitive is race-safe; fan-out-merge writes atomically.
- **R5 (MUST):** The hardening items land with guard tests; no mode behavior changes beyond added safety; invariants preserved.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- CI workflow present + YAML-valid; `/doctor` canonical PASS, inert-lexical throwaway WARNs (verified).
- Runtime: zero node_modules reach-ins, own manifest, tests green (or the change reverted + reported if infeasible).
- Loop-lock: 4 modes locked via the CLI; lock + fan-out tests green.
- Hardening: guard tests green; doc fix accurate.
- `validate.sh --strict` green on this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

**Depends on:** `../improvement-research/improvement-research.md`.

- **Runtime manifest (B)** is the highest-risk item (native better-sqlite3 binding version must match; bare-specifier resolution must work) — the agent works in an isolated worktree with an explicit "revert + report if infeasible" mandate.
- **Loop-lock (C)** is behavior-adjacent (concurrency) — verified against the lock test suite.
- The **codegen (A follow-on)** must byte-match the current maps — deferred to careful work; A3+A4 already make drift reliably caught.

Rollback is per-cluster `git restore`; clusters are independent.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **Invariant-preserving:** one identity, no mode behavior change beyond added safety, runtime stays MCP-free, parity fixtures green.
- **Verification:** each cluster independently verified before integration.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- A scaffolded non-canonical skill with a lexical mode: `/doctor` WARNs (inert), exit 0 — structurally valid, advisor-wiring pending.
- Runtime `npm install` infeasible / native-binding mismatch: cluster B reverts + reports rather than ship a half-working runtime.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

Medium-high breadth (advisor, runtime, loop, tooling, docs), low-to-medium risk per item, all invariant-preserving. Parallelized across 3 agents + the orchestrator; the codegen refactor is the one deferred P1.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Codegen the projection maps from the registry (the i01 top pick) — staged as a follow-on; the CI gate + advisor-sync check already deliver reliable drift-catching.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent control file**: `../spec.md`.
- **The research being implemented**: `../improvement-research/improvement-research.md`.
- **Cluster A deliverables**: `.github/workflows/routing-registry-drift.yml`, `commands/doctor/scripts/parent-skill-check.cjs`.
