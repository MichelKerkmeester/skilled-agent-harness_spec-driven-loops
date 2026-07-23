---
title: "Feature Specification: sk-git Non-Hub Router Rollout"
description: "The authored sk-git router has no compiled policy, typed scorer projection, or reversible shadow-activation proof. This child compiles that existing router without changing the skill, shared compiler, frozen scorer, or live authority."
trigger_phrases:
  - "sk-git non-hub router rollout"
  - "sk-git compiled policy parity"
  - "sk-git fenced rollback"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/009-non-hub-rollout/001-sk-git"
    last_updated_at: "2026-07-19T10:40:49Z"
    last_updated_by: "codex"
    recent_action: "Completed the target-local sk-git rollout and strict validation"
    next_safe_action: "No remaining packet work"
    blockers: []
    key_files:
      - "harness/run-sk-git.cjs"
      - "compiled/sk-git/policy.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-rollout-20260719"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# sk-git Non-Hub Router Rollout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-19 |
| **Branch** | Existing worktree; no branch mutation authorized |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`sk-git` carries a standalone authored `INTENT_SIGNALS`/`RESOURCE_MAP` router, but the rollout program has no target-local compiled policy, typed scorer fixtures, or fenced rollback proof for it. Reusing the stale `mcp-code-mode` checked artifacts would test the wrong skill and would not prove `sk-git` against the frozen scorer.

### Purpose

Compile the authored `sk-git` router through the shared generic compiler, emit three deterministic read-only projections and typed fixtures, prove shadow parity at zero live authority, and demonstrate one-generation fenced activation with byte-exact rollback.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- One standalone `sk-git` destination with five authored intent selectors and ten authored leaf resources.
- The authored `references/quick-reference.md` default with its observed legacy always-union behavior on positive routes.
- Typed route, defer, one-turn clarify, and forbidden-reject decisions.
- Deterministic policy, advisor projection, typed route-gold, policy card, fixtures, activation manifests, and fence state.
- Real frozen-scorer replay, legacy shadow parity, closed-algebra checks, syntax checks, protected-file hashing, and rollback drill.

### Out of Scope

- Edits to `sk-git`, the shared compiler, the compiler baseline child, the frozen scorer, or live routing configuration.
- Hub routing, cross-target composition, bundle rules, handoff edges, overlays, or adaptive provenance.
- Live activation, network access, package installation, git commit, or git push.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `harness/*.cjs` | Create | Target-local source adapter, deterministic builder, real-scorer boundary, and fingerprint helpers |
| `compiled/sk-git/**` | Create | Compiled policy, projections, policy card, and typed fixtures |
| `activation/**` | Create | Shadow manifests, fence state, and shared fenced-manifest adapter |
| `parity/shadow-parity.cjs` | Create | Thin adapter to the shared parity implementation |
| Packet documentation and metadata | Create | Level-2 scope, plan, tasks, checklist, evidence, and memory graph metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Compile authored router facts without a skill-name branch | The shared generic compiler receives one candidate, five selectors, ten leaves, empty bundle/handoff/cross-target collections, `overlay=null`, and `P=static` |
| REQ-002 | Emit deterministic artifacts | Five compiles across two processes produce identical policy hashes and all 13 checked artifacts byte-match regeneration |
| REQ-003 | Pass the real frozen scorer | Nine typed rows score through the protected read-only path and a fabricated extra resource makes the falsifier fail |
| REQ-004 | Preserve shadow-only authority | Legacy remains serving-authoritative, compiled effects stay zero, and every mismatch is classified without updating gold |
| REQ-005 | Close the decision algebra | Zero signal defers, ambiguous evidence produces exactly one clarify, forbidden force-push evidence rejects, and non-route decisions have no target or commit authority |
| REQ-006 | Prove reversible activation | A one-generation fence pins the candidate, rejects stale epochs, and rollback restores prior manifest bytes exactly |
| REQ-007 | Preserve protected scorer bytes | All three scorer SHA-256 values match the pre-write baseline |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Keep the gate target-local and read-only by default | `node harness/run-sk-git.cjs` checks only this child and fails on artifact drift; `--write` is the explicit generation path |
| REQ-009 | Keep artifacts and docs contract-compliant | Every target CommonJS file passes `node --check`, and strict Level-2 packet validation exits zero before completion |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The target-local gate prints `GREEN result=PASS live_authority=legacy scorer_unchanged=true`.
- **SC-002**: Recompilation is byte-identical across five compiles and two processes.
- **SC-003**: Nine real-scorer rows pass and the deliberate extra-resource falsifier is rejected.
- **SC-004**: Shadow parity reports zero effects, six exact matches, and three fully classified semantic mismatches.
- **SC-005**: Closed-algebra and byte-exact rollback assertions pass.
- **SC-006**: The protected scorer hashes remain unchanged and all six CommonJS files parse.
- **SC-007**: Strict packet validation exits zero with no errors or warnings.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Shared generic compiler and canonical contract modules | Compilation cannot proceed if their APIs drift | Import the frozen modules directly and assert emitted shape locally |
| Dependency | Protected scorer modules | Real compatibility cannot be claimed without their exact behavior | Execute them in a read-only subprocess and hash their bytes before handoff |
| Risk | Legacy default semantics differ from typed zero-signal algebra | A silent parity mismatch could be mistaken for drift | Keep zero signal typed as `defer(no-match)` and classify the legacy default union explicitly |
| Risk | Stale baseline artifacts in the compiler child | Running its phase gate would block on unrelated drift | Never invoke that gate; compile `sk-git` locally from authored sources only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Determinism

- **NFR-D01**: Canonical output bytes and hashes must be stable across repeated and isolated-process compiles.
- **NFR-D02**: Checked generation must emit no timestamps or host-dependent ordering.

### Safety

- **NFR-S01**: Verification must not mutate the live skill, scorer, shared compiler, or routing configuration.
- **NFR-S02**: Non-route decisions must be target-free and authority-free.

### Operability

- **NFR-O01**: The default harness invocation must be read-only and produce concise line-oriented receipts.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Zero leaf evidence**: Emit `defer(no-match)` rather than routing to the only candidate.
- **Near-tied leaf evidence**: Emit one clarification request with no target or authority.
- **Forbidden operation**: Reject `force push to main/master` even though the legacy router falls back to its default resource.
- **Fabricated resource**: The real scorer must reject a row containing `references/not-authored.md`.
- **Stale fencing epoch**: Reject activation after a newer epoch has been observed.
- **Rollback**: Preserve monotonic fence state while restoring prior manifest bytes exactly.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None. The user froze the child path, source skill, compiler reuse boundary, scorer boundary, and verification contract.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`.
- **Task Breakdown**: See `tasks.md`.
- **Verification Checklist**: See `checklist.md`.
- **Evidence Summary**: See `implementation-summary.md`.
<!-- /ANCHOR:related-docs -->
