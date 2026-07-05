---
title: "Spec: Contract Compiler Design"
description: "Phase 001 of packet 036 (command contract compiler, carved from 035). Design-first: verify and expand the seed design (design.md, produced during the 035 phase-003 pass and grounded in the real /deep:review 14-file authority chain) into an implementable spec, resolving the three named unknowns — the OpenCode prompt-injection insertion point, checksum ownership over generated markdown, and CLI-executor receipt/progress parity under fan-out — then decompose the build and retrofit phases."
trigger_phrases:
  - "036 phase 001"
  - "contract compiler design"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-gpt-reliability/007-compiled-contract-compiler/001-contract-compiler-design"
    last_updated_at: "2026-07-03T19:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Design seed captured from 035 phase-003 pass"
    next_safe_action: "Verify the seed design; resolve the three unknowns; then decompose build phases"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "036-001-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Contract Compiler Design

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-07-03 |
| **Parent Packet** | ../ (036-command-contract-compiler) |
| **Parent Spec** | ../spec.md |
| **Effort** | M |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The build-time command-contract compiler is research-sized (per the 035 phase-003 feasibility verdict), so it starts with a design phase. A seed design already exists (`../001-contract-compiler-design/design.md` — grounded in the real `/deep:review` chain, with a concrete contract schema, compiler inputs, external-ref taxonomy, drift-guard contract, and setup loader). This phase verifies that seed against the live files and resolves the three unknowns it names, producing an implementable spec plus the decomposition of the build/retrofit phases.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:** verifying the seed design's file citations; resolving the OpenCode prompt-injection insertion point, checksum ownership over generated markdown, and CLI-executor receipt/progress parity under fan-out; finalizing the contract schema + compiler + drift-guard contract as an implementable spec; decomposing the subsequent build/retrofit phases.

**Out of scope:** building the compiler (a later phase); the 035 acute fixes.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: Verify every file citation in `design.md` against the live tree; correct any drift; confirm the 14-file chain and 3-way setup authority are fully captured.
- **REQ-002**: Resolve the injection insertion-point unknown: identify exactly where a compiled contract is injected into a command-scoped run (the seed notes injection is plugin-additive + `AGENTS.md` runtime-loaded — pin the concrete seam).
- **REQ-003**: Resolve checksum ownership: define who owns the compiled-artifact hash, where it lives, and how the drift guard reads both source and compiled digests.
- **REQ-004**: Resolve CLI-executor parity: confirm the compiled contract's receipt/progress references work identically on the native Task path and the CLI branches under fan-out.
- **REQ-005**: Produce the implementable spec + the phase decomposition (compiler + review prototype; drift-guard + CI; setup loader; retrofit; AGENTS.md bridge; rollout wiring; pacing/resume) with per-phase effort + acceptance.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. The seed design's citations are verified/corrected; the three unknowns are resolved with cited evidence.
2. An implementable contract-compiler spec exists.
3. The build/retrofit phases are decomposed with effort + acceptance each.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk / Dependency | Handling |
|---|---|
| Seed design citations drift | REQ-001 verifies each against the live tree |
| Injection seam still unclear | REQ-002 resolves it before any build phase |
| Depends on 035 receipts + progress | The contract references them; 035 phase 004 builds them |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The subsequent phase decomposition is an output of this phase, not fixed in advance.
<!-- /ANCHOR:questions -->
