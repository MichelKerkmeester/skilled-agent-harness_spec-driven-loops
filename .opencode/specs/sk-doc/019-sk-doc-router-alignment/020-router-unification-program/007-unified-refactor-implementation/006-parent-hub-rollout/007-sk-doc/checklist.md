---
title: "Verification Checklist: sk-doc Compiled Router Rollout"
description: "Evidence-backed Level-2 completion checklist for the sk-doc parent-hub canary."
trigger_phrases: ["sk-doc checklist", "sk-doc real green evidence", "sk-doc scorer verification"]
importance_tier: "critical"
contextType: "implementation"
status: "in_progress"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/006-parent-hub-rollout/007-sk-doc"
    last_updated_at: "2026-07-19T00:00:00.000Z"
    last_updated_by: "codex"
    recent_action: "Verified rollout checklist"
    next_safe_action: "Retain shadow-only candidate"
    blockers: []
    key_files: ["checklist.md", "harness/validate-canary.cjs"]
    session_dedup:
      fingerprint: "sha256:74f51b4af2f5710ce8bcc116bcd8859ee862214ee02cf53c58dcb250d0e07993"
      session_id: "sk-doc-rollout-checklist"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: sk-doc Compiled Router Rollout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---
<!-- ANCHOR:protocol -->
## Verification Protocol

P0 is a blocker; P1 is required; P2 is optional with documented deferral.
<!-- /ANCHOR:protocol -->

---
<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Read every requested source before implementation. [EVIDENCE: `harness/validate-canary.cjs` pins the derived authored contract.]
  - **Evidence**: Derived 12 modes, 11 packets, null default, delta 1, and one bundle.
- [x] CHK-002 [P0] Fix scope and rollback before edits. [EVIDENCE: `activation/manifest.prior.json` is the retained rollback preimage.]
  - **Evidence**: Task writes are child-local; rollback removes this additive child.
<!-- /ANCHOR:pre-impl -->

---
<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Reuse the shared compiler and projector. [EVIDENCE: `lib/registry-compiler.cjs` and `harness/build-artifacts.cjs` import them.]
  - **Evidence**: Imports frozen `compile`, canonical helpers, decision parser, and projector.
- [x] CHK-011 [P0] Keep output deterministic and dependency-free. [EVIDENCE: `node harness/validate-canary.cjs` reports byte-identical output.]
  - **Evidence**: Consecutive builds are byte-identical using built-ins and committed modules.
- [x] CHK-012 [P0] Pass syntax checking. [EVIDENCE: `node --check` exited code 0 for seven files.]
  - **Evidence**: All seven `.cjs` files pass `node --check`.
<!-- /ANCHOR:code-quality -->

---
<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Pass frozen schemas. [EVIDENCE: `node harness/validate-canary.cjs` reports schemaValidation pass.]
  - **Evidence**: Policy, advisor, card, and 18 typed rows validate.
- [x] CHK-021 [P0] Pass the real scorer. [EVIDENCE: `node harness/validate-canary.cjs` reports 18/18 REAL-GREEN.]
  - **Evidence**: 18/18 evaluated and persisted rows pass; writeback is false.
- [x] CHK-022 [P0] Prove scorer teeth. [EVIDENCE: `node harness/validate-canary.cjs` rejects the corrupted observation.]
  - **Evidence**: A corrupted positive resource observation fails.
- [x] CHK-023 [P0] Close bundle and negative algebra. [EVIDENCE: `node harness/validate-canary.cjs` validates bundle and target-free negatives.]
  - **Evidence**: Exact bundle order holds; zero defers; forbidden rejects; negatives have no targets.
- [x] CHK-024 [P0] Pass document and advisor parity. [EVIDENCE: `node harness/validate-canary.cjs` validates 20 document variants.]
  - **Evidence**: 20 document variants match; advisor drift and absence cannot rewrite.
- [x] CHK-025 [P0] Pass execution and rollback fences. [EVIDENCE: `node harness/validate-canary.cjs` reports epoch 2 and exact bytes.]
  - **Evidence**: PREPARE→VERIFY→COMMIT; exact prior hash restored at fence epoch 2.
<!-- /ANCHOR:testing -->

---
<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Keep public modes injective. [EVIDENCE: `node harness/validate-canary.cjs` reports 12 distinct destinations.]
  - **Evidence**: 12 identity tuples remain distinct despite one shared packet.
- [x] CHK-031 [P0] Refuse authored drift. [EVIDENCE: `node harness/validate-canary.cjs` drives five authored falsifiers.]
  - **Evidence**: Tie-break, bundle, resource, and source-identity drift fail closed.
- [x] CHK-032 [P1] Bind generated artifacts to acceptance. [EVIDENCE: `activation/acceptance.json` contains artifact and source digests.]
  - **Evidence**: Digests bind five artifacts, policy/prior tuples, sources, and fence.
<!-- /ANCHOR:fix-completeness -->

---
<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] Prevent authority on negative branches. [EVIDENCE: `node harness/validate-canary.cjs` checks target and authority absence.]
  - **Evidence**: Frozen parser plus structural checks enforce target-free negatives.
- [x] CHK-041 [P0] Protect immutable inputs. [EVIDENCE: `node harness/validate-canary.cjs` verifies pre/post SHA-256.]
  - **Evidence**: Authored and scorer hashes match before and after execution.
- [x] CHK-042 [P1] Avoid external side effects. [EVIDENCE: `activation/manifest.candidate.json` remains shadow-only and legacy-authoritative.]
  - **Evidence**: No network, install, live flip, secret, commit, or push; candidate is shadow-only.
<!-- /ANCHOR:security -->

---
<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] Keep Level-2 documents consistent. [EVIDENCE: `validate.sh --strict` passes document structure and metadata rules.]
  - **Evidence**: All packet docs report complete shadow-only REAL-GREEN status.
- [ ] CHK-051 [P0] Clear strict completion freshness after the packet is committed.
  - **Evidence**: `validate.sh --strict` has zero errors and one dirty-path freshness warning; this task forbids the commit required to clear it.
  - **Evidence**: Repository strict validator exits zero after final rebuild.
<!-- /ANCHOR:docs -->

---
<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] Separate source, harness, fixture, generated, activation, and docs. [EVIDENCE: `find 007-sk-doc -type f` shows the required layout.]
  - **Evidence**: Files use `lib/`, `harness/`, `fixtures/`, `compiled/`, `activation/`, and root.
- [x] CHK-061 [P0] Keep task writes child-local. [EVIDENCE: `git status --short` shows the additive child path only for this task.]
  - **Evidence**: Final git scope audit reports no task write outside this packet.
<!-- /ANCHOR:file-org -->

---
<!-- ANCHOR:summary -->
## Verification Summary

| Priority | Total | Verified |
|----------|-------|----------|
| P0 | 16 | 15/16 |
| P1 | 2 | 2/2 |
| P2 | 0 | 0/0 |

**Verification Date**: 2026-07-19  
**Scope**: Compile, schemas, decisions, shared projection, real scorer, parity, authority,
activation, rollback, syntax, packet, hash, and file-scope gates.
<!-- /ANCHOR:summary -->
