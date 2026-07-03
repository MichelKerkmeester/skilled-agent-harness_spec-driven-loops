---
title: "Phase Parent: Command Contract Compiler (carved from 035)"
description: "Design-first structural packet carved from 035 (GPT-reliability fixes) after the phase-003 design pass confirmed the contract compiler is research-sized, not a single implementation phase. Builds the build-time unified command-contract compiler that collapses the ~14-file resolution chain into one self-contained typed contract per command, plus the deterministic setup loader, the drift-guard contract, the retrofit of all deep commands + 14 agent files to contract pointers, the deferred AGENTS.md autonomous-precedence bridge, the rollout emitter-wiring, and pacing/resume. Phase 001 is the design; later phases are decomposed once the design is verified."
trigger_phrases:
  - "command contract compiler"
  - "036 contract compiler"
  - "compiled command contract"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/036-command-contract-compiler"
    last_updated_at: "2026-07-03T19:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Packet carved from 035 phase-003; design seed captured"
    next_safe_action: "Verify + expand the 001 design, then decompose the build/retrofit phases"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "036-parent-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Why a separate packet? The 035 phase-003 design pass returned a feasibility verdict of research-sized (schema+compiler M, loader L, drift-CI M-L, retrofit L), matching the plan-review's GAP-53/54. Forcing it into one 035 phase was rejected; it is carved here."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase Parent: Command Contract Compiler (carved from 035)

<!-- SPECKIT_LEVEL: phase -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | phase |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-07-03 |
| **Parent Packet** | None (top-level under deep-loops; carved from 035-gpt-reliability-fixes) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

GPT executors don't reliably see a command's contract because it's distributed across a ~14-file resolution chain and weighted by file position — the single root defect behind most of the 034 findings. The 035 plan-review (GAP-58) recommended collapsing it into one build-time self-contained typed contract per command. The 035 phase-003 design pass (seed in `001-contract-compiler-design/design.md`) confirmed this is research-sized structural work, not one implementation phase, so it is carved into this packet. This packet builds the compiler, the deterministic setup loader, the drift-guard contract, the retrofit of all deep commands + 14 agent files to contract pointers, plus the items 035 deferred behind it: the `AGENTS.md` autonomous-precedence bridge prose, the rollout emitter-wiring (035 shipped only the rollout core), and pacing/resume.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:** the contract schema + compiler + one canonical build target; the external-ref type taxonomy; the drift-guard contract (fail/warn/override, resolve order, recovery); the deterministic setup loader; the render/executor-contract/injection fold-in; the retrofit of all deep commands + 14 agents; the deferred `AGENTS.md` bridge; the rollout manifest-capture + comparator + emitter-wiring; pacing/resume.

**Out of scope:** the 035 acute fixes (harness, Gate-3 validator, dispatch receipts + progress) — those stay in 035 and this packet references them.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: Phase 001 verifies + expands the seed design into an implementable spec (schema, compiler, ref taxonomy, drift-guard contract, setup loader), resolving the three named unknowns: the OpenCode prompt-injection insertion point, checksum ownership over generated markdown, and CLI-executor receipt/progress parity under fan-out.
- **REQ-002**: Later phases are decomposed from the verified design (compiler + review prototype; drift-guard + CI; setup loader; retrofit; AGENTS.md bridge; rollout wiring; pacing/resume) and each carries its own acceptance.
- **REQ-003**: The compiled contract references the 035 dispatch-receipt + progress-record mechanisms; it does not re-implement them.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. Phase 001 produces a verified, implementable design with the three unknowns resolved.
2. Subsequent phases build the compiler + retrofit with a drift guard that hard-fails on source/compiled divergence.
3. Executors read one self-contained contract; maintainers keep the layered sources; the 035 acceptance harness confirms no regression on the affected cells.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk / Dependency | Handling |
|---|---|
| Research-sized effort mislabeled | This packet exists precisely to scope it properly; phase 001 is design-only |
| Injection insertion-point unknown | Named as a phase-001 unknown to resolve before building |
| Source/compiled drift (new class) | Drift-guard contract designed before the compiler ships |
| Depends on 035 receipts + progress | 035 phase 004 builds them; this packet references them |
| Concurrent churn on injection plugins | Emitter-wiring waits for the tree to settle |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The full phase decomposition is authored after phase 001 verifies the seed design; the seed's feasibility tiers (compiler M, loader L, drift-CI M-L, retrofit L) guide it.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:phases -->
## 8. PHASE DOCUMENTATION MAP

| Phase | Status | Purpose |
|-------|--------|---------|
| [`001-contract-compiler-design`](./001-contract-compiler-design/spec.md) | Planned | Verify + expand the seed design (`design.md`) into an implementable spec; resolve the injection-insertion-point, checksum-ownership, and CLI-parity unknowns. Then decompose the build/retrofit phases. |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:related -->
## 9. RELATED DOCUMENTS

- `context-index.md` — how this packet was carved from 035.
- `001-contract-compiler-design/design.md` — the seed design (GPT-produced, grounded in the real `/deep:review` chain).
- `../035-gpt-reliability-fixes/` — the parent effort; its receipts + progress mechanisms are referenced here.
<!-- /ANCHOR:related -->
