---
title: "Feature Specification: Phase 9: runtime contract remediation"
description: "Close the four runtime-contract defects the packet review surfaced: engine-only external dispatch needs a coded model default, local mode projects static target text instead of a live CLI capture, read-only is enforced where a CLI verifiably supports it and honestly documented where it does not, and the phase/graph/completion metadata is reconciled."
trigger_phrases:
  - "runtime contract remediation"
  - "external cli model default"
  - "local mode static text projection"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/002-sk-communication-triggers/009-runtime-contract-remediation"
    last_updated_at: "2026-08-20T21:40:00.000Z"
    last_updated_by: "claude"
    recent_action: "Closed all four runtime-contract defects; package gate green"
    next_safe_action: "Parent closeout; the fixes are uncommitted"
    blockers: []
    key_files:
      - ".opencode/skills/sk-communication/cli-communication-projection/src/transports/cli-engines.ts"
      - ".opencode/skills/sk-communication/cli-communication-projection/src/runtime/local-projection.ts"
      - ".opencode/skills/sk-communication/cli-communication-projection/bin/external-cli-project.mjs"
      - ".opencode/commands/rewrite/response-by-external-agent.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-009-runtime-contract-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "pi keeps requiring an explicit model: its skill documents no default model, so only the other five engines get a coded default."
      - "Read-only is enforced only where a CLI supports it without altering the rewrite output (codex sandbox, pi tool allowlist, devin least-privilege mode); the remaining engines rest on the non-mutating prompt plus fail-closed, documented honestly."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 9: runtime contract remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-20 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 10 |
| **Predecessor** | 008-spawn-process-group-hardening |
| **Successor** | (parent closeout) |
| **Handoff Criteria** | Engine-only external dispatch resolves a model for the five engines that document one, local mode projects the resolved target text through the local provider, read-only is enforced where a CLI verifiably supports it and documented honestly where it does not, the packet metadata is internally consistent, and the package gate plus recursive strict validation are green. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the sk-communication trigger commands packet.

**Scope Boundary**: The four runtime-contract defects a post-build review of this packet surfaced. No change to the projection pipeline, privacy routing, fidelity validation, or the default-off invariant; every fix routes through the existing `projectMessage` tail and its fail-closed-to-exact-original guarantee.

**Dependencies**:
- Phase 005 shipped the external-cli provider and the local provider config loader.
- Phase 006 shipped the external-cli static-text entrypoint and the per-engine command table.
- Phase 007 moved the commands into the `rewrite/` namespace.

**Deliverables**:
- A coded per-engine default model so the command's engine-only contract reaches a runnable dispatch.
- A local static-text projection entrypoint so `local` mode rewrites the resolved target text, symmetric with the external and native branches.
- Read-only enforcement where a CLI supports it without changing the rewrite output, plus an honest description of the mechanism where it does not.
- Reconciled phase, graph, and completion metadata across the parent and the affected children.

**Changelog**:
- On phase close, refresh the matching parent changelog entry.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A review of the shipped packet found four contract defects:

1. **Engine-only external dispatch cannot run.** `external-cli-project.mjs` requires both `<engine>` and `<model>` and exits `2` without a model, but the command's user contract accepts only an engine and relies on the acting agent resolving a model from a skill doc — with no coded fallback, an unresolved model degrades to a status-2 failure.
2. **Local mode has a contract mismatch.** Branch C routes the resolved target text through `cli-output-wrapper.mjs`, which wraps and captures a *live* CLI subprocess and projects its stream — it has no path that rewrites a static piece of target text, so `local` cannot do what the `native` and external branches do.
3. **Read-only is over-claimed.** The implementation summary claims a read-only per-engine argv, but only `codex` carries a sandbox flag; `devin` uses an auto-approve mode and the rest carry no read-only flag.
4. **Metadata is inconsistent.** The parent's active-child pointer is stale, the parent spec still names pre-rename command paths and unresolved-fork language, and the per-child phase count disagrees across children.

### Purpose

Close all four so the command's three engine branches each reach a runnable, display-only, fail-closed projection, the read-only guarantee is truthful, and the packet metadata is internally consistent.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A coded per-engine default model for `claude-code`, `codex`, `cursor`, `devin`, and `opencode`; `pi` keeps requiring an explicit model per its skill.
- A launcher fallback so an omitted model resolves to the coded default, with a clear error for `pi`.
- A local static-text projection entrypoint over `projectMessage` and the local provider config, plus a runnable launcher, plus Branch C rewired to it.
- Read-only flags where a CLI supports them without altering the rewrite: `codex` sandbox retained, `pi` read-only tool allowlist added, `devin` moved off auto-approve to its documented least-privilege print mode.
- Honest correction of the read-only claim for `claude-code`, `cursor`, and `opencode`.
- Reconciliation of parent and child phase, graph, and completion metadata.

### Out of Scope
- Any change to the projection pipeline stages, privacy routing, fidelity validation, or the default-off invariant.
- Live-verifying each CLI's argv against installed authenticated binaries.
- Committing or pushing; that is a separate, operator-gated step.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.../src/transports/cli-engines.ts` | Modify | Add `defaultModelForEngine`; add pi read-only tool allowlist; move devin off auto-approve. |
| `.../src/transports/index.ts` | Modify | Export `defaultModelForEngine`. |
| `.../src/runtime/local-projection.ts` | Create | `runLocalProjection`: project static target text through the local provider config and `projectMessage`. |
| `.../src/runtime/index.ts` | Modify | Export `runLocalProjection` and its input type. |
| `.../bin/external-cli-project.mjs` | Modify | Fall back to the coded default model when the model argument is omitted; clear error for pi. |
| `.../bin/local-project.mjs` | Create | Runnable local static-text launcher; friendly failure when no local provider is configured. |
| `.../test/transports/cli-engines.test.ts` | Modify | Cover the default-model map and the updated pi/devin argv. |
| `.../test/runtime/local-projection.test.ts` | Create | Cover the local static-text projection and its exact-original fallback. |
| `.../package.json` | Modify | Add `runLocalProjection` to the public import smoke. |
| `.opencode/commands/rewrite/response-by-external-agent.md` | Modify | Note engine-only is valid; rewrite Branch C to the local entrypoint. |
| `../006-external-cli-runtime-wiring/implementation-summary.md` | Modify | Correct the read-only claim to the true mechanism. |
| `../spec.md`, `../graph-metadata.json`, `../description.json` | Modify | Add phase 9; refresh the active-child pointer; drop pre-rename paths and unresolved-fork language. |
| `../006/007/008 spec.md + implementation-summary.md` | Modify | Reconcile the `Phase X of N` denominator. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Engine-only external dispatch resolves a model. | `external-cli-project <engine>` with no model argument uses the coded default for `claude-code`/`codex`/`cursor`/`devin`/`opencode` and does not exit `2`; `pi` with no model prints a clear "explicit model required" message. |
| REQ-002 | Local mode projects the resolved target text. | A `runLocalProjection` entrypoint takes target text plus a local provider config and returns a validated projection or the byte-exact original through `projectMessage`; Branch C invokes the new launcher with target text, not a target command. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Read-only is enforced where verifiable and documented honestly elsewhere. | `codex --sandbox read-only` retained; `pi` carries a read-only tool allowlist; `devin` no longer uses the auto-approve mode; the read-only claim for `claude-code`/`cursor`/`opencode` is corrected to state the non-mutating prompt plus fail-closed mechanism. |
| REQ-004 | Packet metadata is internally consistent. | Parent `last_active_child_id` points at this phase; `children_ids` includes it; the parent spec drops pre-rename command paths and unresolved-fork language; the `Phase X of N` denominator agrees across 006/007/008/009. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npm run check` (typecheck, build, test, import smoke) exits 0, including the new and updated tests.
- **SC-002**: The updated devin/pi argv assertions fail against the pre-change table and pass after (a negative control for the read-only change); the new local-projection tests fail without the module and pass with it.
- **SC-003**: Recursive `validate.sh --strict` on the packet passes with zero errors, and runtime-mirror parity passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A per-engine argv or default model is documentation-verified, not live-verified | Low | An unexpected engine output fails closed to the exact original through the shared fidelity validation, so a wrong flag never corrupts the display. |
| Risk | The local entrypoint diverges from the external one | Low | Both build one synthetic completed message and reuse `projectMessage`; the local branch reuses the shipped local provider config loader wholesale. |
| Dependency | The phase-006 entrypoint and phase-005 local provider config | Low | Both shipped; this phase adds a sibling entrypoint and a launcher, touching neither. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
