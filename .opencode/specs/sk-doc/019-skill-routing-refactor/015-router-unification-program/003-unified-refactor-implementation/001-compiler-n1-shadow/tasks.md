---
title: "Tasks: Shadow Compiler + mcp-code-mode N=1 Compile"
description: "Ordered, checkable execution list for Phase 1 of the unified router refactor: build the pure fail-closed compiler, compile mcp-code-mode as the degenerate N=1 case, emit the three projections + legacy-gold compatibility + typed fixtures, run zero-authority shadow parity, and prove fenced one-generation activation with byte-exact rollback. Scorer never touched."
trigger_phrases:
  - "shadow compiler n1 tasks"
  - "mcp-code-mode compile task list"
  - "fenced activation rollback tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/001-compiler-n1-shadow"
    last_updated_at: "2026-07-18T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Executed and verified all 26 shadow-compiler tasks"
    next_safe_action: "Run strict validation and metadata regeneration from the orchestrator"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Shadow Compiler + mcp-code-mode N=1 Compile

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending or explicitly deferred |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm Phase 0 schema + deterministic serialization is frozen and importable; if absent, fail closed and halt (dependency; spec REQ-002) (`../000-contract-schemas/`)
- [x] T002 Capture the Stage-0 legacy route-gold baseline and confirm it is green BEFORE any shadow artifact exists (Stage 0 handshake; synthesis §9)
- [x] T003 Ingest `mcp-code-mode` authored sources read-only and verify against synthesis §5 confirmed line refs (`.../mcp-code-mode/SKILL.md`, `.../mcp-code-mode/leaf-manifest.json`)
- [x] T004 Confirm `mcp-route-guard.cjs` is advisory (`allow`/`warn`, fails open) and record that it MUST NOT become destination VERIFY (synthesis §5.2)
- [x] T005 [P] Stand up the isolated `<shadow-root>/` tree and the append-only typed-fixture location; confirm no live routing path is writable
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### 2a. Compiler + N=1 compile

- [x] T006 Implement `compile()` as a total, side-effect-free function `authoredSources → CompiledPolicyV1 | CompileError` building `destinations[]`, `detectors[]`, `selectors[]`, `compositionRules[]`, `authorityGraph[]`, `(T,R,P)` posture, and `basePolicyHash`/`overlayHash?`/`effectivePolicyHash` (spec REQ-001; synthesis §2.1) (`<shadow-root>/compiler/`)
- [x] T007 Add fail-closed guard: missing referenced mode → typed `CompileError`, no artifact written (spec REQ-002)
- [x] T008 Add fail-closed guard: leaf that does not resolve to a destination → typed `CompileError`, no artifact written (spec REQ-002; synthesis §5.2)
- [x] T009 Add fail-closed guard: authority-graph contradiction → typed `CompileError`, no artifact written (spec REQ-002)
- [x] T010 Compile `mcp-code-mode`; assert N=1 shape `candidateCount=1`, `selectionKinds={single}`, `crossTargetEdges=[]`, `bundleRules=[]`, `handoffEdges=[]`, `overlay=null`, `P=static` (spec REQ-003; synthesis §5.1) (`<shadow-root>/compiled/mcp-code-mode/policy.json`)
- [x] T011 Verify empties emerge by partial evaluation over empty inputs — NOT a name branch; `rg -n "mcp-code-mode"` shows zero branching use in the compiler/evaluator path (spec REQ-003 / SC-002; synthesis §5.1)
- [x] T012 Preserve leaf-level routing inside the destination: 7 leaves, 6 selector classes, near-tie path, zero-signal fallback; zero leaf signal ⇒ `defer(no-match)` (never default-to-self); ambiguous leaf evidence ⇒ exactly one `clarify` (spec REQ-004; synthesis §5.2)

### 2b. Projections + compatibility + fixtures

- [x] T013 [P] Generate `AdvisorProjectionV1` from the snapshot — omit paths/tools/mutation-scope/fences/handoff-leases/commit-authority; stamp `effectivePolicyHash` + projection hash (spec REQ-005; synthesis §8.1) (`<shadow-root>/compiled/mcp-code-mode/advisor-projection.json`)
- [x] T014 [P] Generate `PolicyCardV1.md` FROM the same snapshot (not a hash-matched hand-written view); include identity/hashes, admission/precedence, `(T,R,P)`, negative reasons, explicit limitations (spec REQ-005/REQ-010; synthesis §8.3) (`<shadow-root>/compiled/mcp-code-mode/policy-card.md`)
- [x] T015 Build the compatibility projector: positive routes → `observedIntents`/`observedResources`; `clarify|defer|reject` → existing empty-intent convention (spec REQ-006; synthesis §8.2)
- [x] T016 Author typed fixtures incl. exact single route, zero-signal idle defer (no default union), one-turn clarify, forbidden reject, and the singular-omission + zero-rank-call assertion (spec REQ-006; synthesis §8.2) (`<shadow-root>/compiled/mcp-code-mode/route-gold.typed.json`)
- [x] T017 Confirm all three projections carry the same `effectivePolicyHash` (SC-007)

### 2c. Shadow parity + fenced activation + rollback

- [x] T018 Implement the read-only shadow parity harness; run typed replay + compatibility projection vs legacy route-gold; classify mismatches; NEVER auto-update gold (spec REQ-007; synthesis §9) (`<shadow-root>/parity/`)
- [x] T019 Assert zero live authority: legacy stays serving-authoritative, compiled policy emits no COMMIT/effect (spec REQ-007 / SC-005; synthesis §10)
- [x] T020 Implement fenced activation of the single generation: token lock + fencing epoch checked immediately before an atomic temp/fsync/rename; one generation pinned per request (spec REQ-008; synthesis §9) (`<shadow-root>/activation/manifest.json`)
- [x] T021 Retain the prior generation and run the byte-exact rollback drill: swap to the prior manifest; assert restored bytes hash-equal to the pre-activation manifest (spec REQ-008 / SC-006; synthesis §9)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T022 Determinism: recompile ≥3× and assert byte-identical body + identical `effectivePolicyHash` (SC-001)
- [x] T023 Fail-closed: run the three negative fixtures (T007–T009) and assert typed error + zero artifacts written (SC-003)
- [x] T024 Scorer untouched: protected `router-replay.cjs` checksum is exact; route-gold evaluator green with projected fields and a deliberate falsifier red; existing gold byte-unchanged (SC-004; synthesis §8.2, §10)
- [x] T025 Standalone document-only route from `PolicyCardV1.md` alone reaches single/clarify/defer/reject + `PREPARED_DRAFT` and honestly terminates `DOCUMENT_ONLY_UNATTESTED` (spec REQ-010; synthesis §8.3)
- [x] T026 Confirm the Migration Stage-1 gate (spec §6) is satisfied and dual-read fail-closed resolution holds for `mcp-code-mode`, so Phase 2 (`../002-decision-evaluator/`) may activate
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All P0 requirements (REQ-001..008) verified with evidence
- [x] Hard constraints held: scorer untouched, authority destination-local, reversible + gated, no over-emission (spec §7; synthesis §10)
- [x] Migration Stage-1 gate satisfied (spec §6)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Verification Checklist**: `checklist.md`
- **Master plan**: `../spec.md`
- **Source design**: `../../006-unified-refactor-research/unified-refactor-synthesis.md`
<!-- /ANCHOR:cross-refs -->
