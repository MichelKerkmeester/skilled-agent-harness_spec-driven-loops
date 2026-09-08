---
title: "Feature Specification: Phase 4: hash-verified edits"
description: "Exact-string editing silently applies to the wrong place when content moves between read and write. Hash-anchored editing annotates read output with per-line hashes and refuses an edit whose endpoint hashes no longer match, so drift fails loudly instead of corrupting a file."
trigger_phrases:
  - "pi cache hash-verified"
  - "cache optimizer edits"
  - "phase 4 cache optimizer"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/016-cache-optimizer-absorbs-deep-pi/004-port-hash-verified-edits"
    last_updated_at: "2026-09-08T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored against a read of the source module"
    next_safe_action: "Dispatch implementation to cli-devin"
    blockers: []
    key_files:
      - ".pi/extensions/pi-cache-optimizer/index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-016-004-port-hash-verified-edits"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Refusal, never a fuzzy fallback: a looser match is exactly the silent corruption this phase prevents"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 4: hash-verified edits

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

An edit built against what a model was shown can land on different content if the file moved underneath it. This phase annotates read output with per-line content hashes and verifies those hashes before applying an inclusive line-range replacement, refusing on drift.

**Key Decisions**: refusal is the failure mode, never a fuzzy fallback; the refusal names what drifted

**Critical Dependencies**: phase 003-port-retry-loop-guard.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-09-08 |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 003-port-retry-loop-guard |
| **Successor** | 005-remove-deep-pi |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the parent decomposition.

**Scope Boundary**: this capability only. No change to cache measurement, prompt rewriting or compat handling.

**Dependencies**: phase 003-port-retry-loop-guard landed.

**Deliverables**: the behavior described below, with tests that fail without it.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Exact-string editing has a failure mode that is silent and destructive: the model reads a file,
composes an edit against what it saw, and by the time the edit applies the content has moved. The
edit still matches somewhere, so it succeeds — against the wrong lines. Nothing reports an error.

Hash-anchored editing removes the ambiguity by carrying the evidence: read output is annotated with
per-line content hashes, and an edit declares the endpoint hashes it expects. If they no longer
match, the edit is refused.

**This phase adds a tool, not only a check.** Hashline editing in the source implementation
registers an `edit_lines` tool and hooks `tool_result` to annotate reads. That is an editing
responsibility inside an extension whose other work is caching, and the parent packet should
confirm that placement rather than inherit it by default.

### Purpose

An edit is applied only when the target still hashes to what the model was shown; otherwise it is refused with a message naming the drift.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Per-line content-hash annotation on read output.
- An inclusive line-range replacement guarded by endpoint hashes.
- Refusal on hash mismatch, naming what drifted.

### Out of Scope

- **Fuzzy or best-effort matching.** A stale hash never falls back to a looser match; that is the failure this phase exists to prevent.
- **Replacing Pi's existing edit path.** The guarded path is additive; nothing removes what already works.
- **Cache measurement, retry guarding and prompt rewriting** — untouched.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/extensions/pi-cache-optimizer/index.ts` | Modify | Hash annotation on read output, the guarded line-range edit, refusal on mismatch |
| `.pi/extensions/pi-cache-optimizer/tests/*.test.ts` | Create | Drifted target refused; unchanged target applies; refusal names the drift |
| `.pi/extensions/pi-cache-optimizer/README.md` | Modify | Document the guarded edit path and its refusal contract |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | An edit whose endpoint hashes no longer match is refused |
| REQ-002 | An edit against an unchanged target applies normally |
| REQ-003 | Refusal never falls back to a fuzzy match |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The refusal message names what drifted |
| REQ-005 | The placement of an editing tool inside this extension is confirmed, or the capability is sited elsewhere |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A test moves content between read and write and asserts refusal.
- **SC-002**: A test edits an unchanged target and asserts success.
- **SC-003**: `npm --prefix .pi/extensions/pi-cache-optimizer run check` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | An editing tool inside a cache extension surprises the next reader | Medium — capability sited where nobody looks for it | Raised as REQ-005 and an open question rather than inherited silently |
| Risk | Hash annotation bloats read output | Medium | Annotation is measured against a real read before it ships |
| Risk | Refusal blocks legitimate edits after unrelated formatting | Medium | The refusal names the drift so the next attempt is informed, and the unguarded path still exists |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Does an `edit_lines` tool belong in a cache extension?** It arrived there because verified edits reduce paid retries, which is a cost concern. That is a real link, but the capability is editing, not caching. Confirm the placement with the operator before shipping, or site it separately.
<!-- /ANCHOR:questions -->
