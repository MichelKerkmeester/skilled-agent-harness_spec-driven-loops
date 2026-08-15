---
title: "Implementation Plan: Architecture Reference"
description: "Execution plan for planning one system architecture document for Pi Remote authored to the sk-create-skill reference and system-skill architecture style."
trigger_phrases:
  - "pi remote architecture reference"
  - "pi mobile phase 11"
  - "architecture reference"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/011-architecture-reference"
    last_updated_at: "2026-08-13T16:35:13Z"
    last_updated_by: "deepseek-v4-flash"
    recent_action: "Authored 011 architecture-reference spec set as Draft"
    next_safe_action: "Approved 011 plan, then begin 012 docs-as-skill-references drafting"
    blockers:
      - "Draft planning phase; implementation evidence pending"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 0
---

# Implementation Plan: Architecture Reference

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown reference over the TypeScript monorepo at `Apps/Pi Mobile/` |
| **Framework** | Architecture Reference boundary within the Pi relay/PWA system |
| **Storage** | No new durable store; one document is the deliverable |
| **Testing** | `sk-doc` reference extraction and validation; source-to-doc trace check |

### Overview

Plans one system architecture document at `Apps/Pi Mobile/docs/architecture.md`, authored to the `sk-create-skill` reference-template shape, covering the relay, protocol, PWA, and extension with the typed event envelope, mutation authority loop, sync/replay barrier, redaction, containment, and data flows.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The current `docs/architecture.md` content and the `packages/pi-rpc-protocol/` surface are reviewed.
- [ ] The `sk-create-skill` reference-template sections are confirmed.
- [ ] Owned paths, the phase 012 boundary, rollback, and the authoritative gate are confirmed.

### Definition of Done
- [ ] The reference exists at the exact path in the reference-template shape with all P0 content.
- [ ] Focused checks and the authoritative phase gate pass from final state.
- [ ] No secret, temporary output, unrelated edit, or unsupported claim remains.
- [ ] Successor inputs, parent status, and rollback state agree.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One canonical reference document using the `sk-create-skill` reference structure: frontmatter, H1 with a short intro, `## 1. OVERVIEW` with a Core Principle, then numbered ALL-CAPS H2 sections with decision logic, before/after and comparison material where helpful, and explicit scope limitations.

### Key Components
- **Relay runtime**: `apps/pi-remote-relay/src/` zones, supervision, state, sessions, and transport.
- **Typed event envelope**: `packages/pi-rpc-protocol/src/` types, guards, and approval/auth contracts.
- **Mutation authority loop**: `src/approval/`, `src/policy/`, and `extensions/pi-remote-approval/` lease flow.
- **Sync/replay barrier**: `src/replay/sync.ts` and `src/store/transcript-projector.ts`.
- **Redaction**: `src/store/redaction.ts` persistence and broadcast behavior.
- **Containment**: `deploy/containment/pi-remote.sb` boundary and escape classes.
- **PWA data flow**: `apps/pi-remote-web/src/` state, cache, relay client, and attention inbox.

### Data Flow
The document maps the phone-to-relay-to-Pi path, the extension lease transport, and the redacted ledger broadcast, with each zone's dependencies and fail-closed behavior stated.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

This table maps the planned reference content to the live subsystems.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `apps/pi-remote-relay/src/` | Relay supervision, auth, approval, push, replay, sessions, store | Documented | Source-to-doc trace review |
| `packages/pi-rpc-protocol/src/` | Typed envelope and runtime guards | Documented | Source-to-doc trace review |
| `apps/pi-remote-web/src/` | PWA state, cache, relay client, attention | Documented | Source-to-doc trace review |
| `extensions/pi-remote-approval/` | Final-boundary extension | Documented | Source-to-doc trace review |
| `deploy/containment/pi-remote.sb` | macOS containment profile | Documented | Boundary and escape-class review |
| `docs/architecture.md` | Existing prose narrative | Rewritten to reference format | Reference extraction and validation |
| Parent and successor packets | Scope and handoff consumers | Reconcile status and exact outputs | Recursive phase validation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the current `docs/architecture.md` content, protocol surface, owned paths, and the phase 012 boundary.
- [ ] Review the `sk-create-skill` reference-template structure and Core Principle placement rules.

### Phase 2: Core Implementation
- [ ] Read the relay, protocol, web, and extension sources and record confirmed module and function anchors.
- [ ] Author the reference: overview, subsystem sections, typed envelope, authority loop, sync/replay barrier, redaction, containment, and data flows.
- [ ] Add decision logic and validation checkpoints where the system branches or gates.
- [ ] Mark operator-unverified boundaries explicitly as scope limitations.

### Phase 3: Verification
- [ ] Run focused reference extraction and validation during implementation.
- [ ] Trace each load-bearing claim to a source file or export.
- [ ] Run the authoritative phase gate from final state and reconcile handoff.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Primary | Reference structure | `python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py docs/architecture.md` |
| Integration | Link and reference validation | `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py docs/architecture.md` |
| Evidence | Source-to-doc trace | Manual review of module and function anchors |
| Evidence | Envelope contract diff | Diff against `packages/pi-rpc-protocol/src/` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Stable relay, protocol, web, and extension sources | Internal | Pending phase preflight | Phase remains blocked |
| `sk-create-skill` reference template | Internal skill resource | Available | Reference shape unavailable |
| `sk-doc` validation scripts | Internal skill resource | Available | Validation unavailable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any P0 gate, trace check, extraction, or validation command fails.
- **Procedure**: Revert the reference to the last verified narrative or correct the failing section; block until the check passes.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Confirm sources --> review template --> author reference --> focused checks
       --> trace check --> authoritative gate --> handoff
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 010-code-readme-coverage | Implementation |
| Implementation | Setup and the protocol/relay sources | Verification |
| Verification | Authored reference | 012-docs-as-skill-references |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and source reading | Medium | 0.5-1.5 engineer-days |
| Core implementation | Medium | 1-3 engineer-days |
| Verification and handoff | Medium | 0.5-1.5 engineer-days |
| **Total** | | **2-6 engineer-days, refined after preflight** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] The prior `docs/architecture.md` content is captured before the rewrite.
- [ ] The phase 012 boundary excludes `architecture.md`.
- [ ] No runtime, database, or authority surface is touched by this phase.

### Rollback Procedure
1. Restore the prior `docs/architecture.md` narrative.
2. Correct the failing reference sections.
3. Re-run extraction, validation, and the trace check.
4. Record unresolved claims and operator impact.

### Data Reversal
- **Has data migrations?** No migration is planned for this phase.
- **Reversal procedure**: Restore the prior document; no other state is changed.
<!-- /ANCHOR:enhanced-rollback -->

---
