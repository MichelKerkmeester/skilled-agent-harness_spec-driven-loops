---
title: "Tasks: Unified Router Rollout — sk-prompt"
description: "Completed tasks for the two-mode compiled policy, bounded default, ordered bundle, real scorer proof, and reversible shadow canary."
trigger_phrases:
  - "sk-prompt rollout tasks"
  - "prompt default canary tasks"
  - "sk-prompt real-green tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/006-parent-hub-rollout/005-sk-prompt"
    last_updated_at: "2026-07-19T23:59:59Z"
    last_updated_by: "codex"
    recent_action: "Completed all implementation and verification tasks"
    next_safe_action: "Retain the green child for parent-hub rollout review"
    blockers: []
    key_files:
      - "lib/registry-compiler.cjs"
      - "lib/router.cjs"
      - "harness/validate-canary.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-prompt-rollout-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Unified Router Rollout — sk-prompt

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|---|---|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the complete sibling archetype, hub inputs, shared contracts, and design authority. [EVIDENCE: `002-system-deep-loop` and five live authored inputs read before writing]
- [x] T002 Confirm the child was absent and capture authored and scorer digests. [EVIDENCE: `sha256sum` baseline recorded for eight protected and authored files]
- [x] T003 Freeze writes to this child and retain legacy/shadow rollback boundaries. [EVIDENCE: `git status --short` scope inventory and shadow-only manifests]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Adapt authored router and registry data into shared compiler inputs. [EVIDENCE: `lib/registry-compiler.cjs` calls the shared compiler]
- [x] T005 Compile two weighted workflow destinations and one ordered composition rule. [EVIDENCE: `compiled/policy.json` has 2 destinations and 1 rule]
- [x] T006 Implement weighted singles, one ambiguity clarify, explicit bundle, defer, reject, and bounded default. [EVIDENCE: `lib/router.cjs` covers the closed decision algebra]
- [x] T007 Generate deterministic policy, advisor, graph, policy card, and typed route-gold. [EVIDENCE: `node harness/build-artifacts.cjs` emits 5 compiled artifacts]
- [x] T008 Generate shadow candidate, prior, serving, acceptance, and fence artifacts. [EVIDENCE: `activation/manifest.candidate.json` remains shadow-only]
- [x] T009 Bind delivered route-gold rows and authored sources to SHA-256 identities. [EVIDENCE: `compiled/route-gold.typed.json` carries 8 row hashes]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Score all eight cases through the real frozen scorer. [EVIDENCE: `node harness/validate-canary.cjs` reports 8/8 real-green]
- [x] T011 Drive corruption, algebra, bundle-order, document, execution, and generation falsifiers. [EVIDENCE: `validate-canary.cjs` reports every named hard block]
- [x] T012 Prove the bounded default and ordered bundle exactly. [EVIDENCE: `zero-signal-default` and `explicit-ordered-bundle` rows pass]
- [x] T013 Prove byte-identical rebuild and byte-exact rollback. [EVIDENCE: artifact hashes and restoredHash]
- [x] T014 Run syntax checks on every CommonJS file. [EVIDENCE: seven node --check passes]
- [x] T015 Re-read the three protected scorer files and match baseline hashes. [EVIDENCE: `protectedScorerHashes` contains 3 unchanged SHA-256 values]
- [x] T016 Reconcile Level-2 docs and generated metadata. [EVIDENCE: `validate.sh --strict` template and metadata gates pass]
- [x] T017 Run strict packet validation. [EVIDENCE: validate.sh --strict exit 0]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks are marked complete. [EVIDENCE: T001 through T017 checked]
- [x] No blocked tasks remain. [EVIDENCE: blockers list empty]
- [x] Manual and automated verification passed. [EVIDENCE: REAL-GREEN canary and strict validator]
- [x] Legacy remains serving-authoritative and no commit or push occurred. [EVIDENCE: activation state and git scope check]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Verification**: See `checklist.md` and `implementation-summary.md`.
<!-- /ANCHOR:cross-refs -->
