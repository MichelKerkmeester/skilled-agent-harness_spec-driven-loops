---
title: "Injection Contract Directive Sync"
description: "Synchronize the hook and plugin injection contract so the comment-hygiene, governor, and proof-over-appearance directives are each documented with their owning module and per-runtime channel."
trigger_phrases:
  - "injection contract directive sync"
  - "injection-contract.md directives"
  - "advisor directive ownership"
  - "three directives contract"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/038-fable-governor-pi-hook/009-injection-contract-directive-sync"
    last_updated_at: "2026-08-05T00:10:10Z"
    last_updated_by: "pi-phase-009-implementation"
    recent_action: "Synchronized the injection contract with shared and Pi-only directive ownership"
    next_safe_action: "Phase 008 must reconcile the parent packet metadata after this scoped validation"
    blockers:
      - "Parent recursive strict validation remains blocked by pre-existing generated-metadata drift in phases 001-008."
    key_files:
      - ".opencode/hooks/injection-contract.md"
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/render.ts"
      - ".opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs"
      - ".opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts"
    session_dedup:
      fingerprint: "sha256:2cb98f19a3b4c65ba355d4f140aeba89a792b5abc5af33368c888b2481ce5da7"
      session_id: "2026-08-05-cli-038-009-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does the live contract doc name every directive constant that render.ts defines?"
      - "Do the per-runtime channel rows and Pi-only ownership still match the prompt-advisor transform behavior?"
    answered_questions:
      - "Yes — the final contract and source greps name all three shared constants and the Pi-only owner."
      - "Yes — final scans match the visible Pi input transform and shared-directive forwarder role."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Injection Contract Directive Sync

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P3 |
| **Status** | Complete |
| **Created** | 2026-08-04 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 9 of 9 |
| **Predecessor** | 008-phase-state-reconciliation |
| **Successor** | None |
| **Handoff Criteria** | The injection contract documents all three advisor directives with their owning modules and per-runtime channels, verified by the named grep and validation commands. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The review's P3 finding requires `injection-contract.md` to document all three fixed advisor directives — comment hygiene, governor, and proof-over-appearance — and the modules that own their text. The contract is the only cross-runtime reference a reader can use to answer "what does this hook add to my session," so a directive that is missing, mis-attributed, or described with a stale channel silently undermines every runtime that relies on the same advisor brief.

### Purpose
Make the directive section of the injection contract complete, accurate, and verifiable: every directive constant that the advisor render core appends to a brief is named there, its owning module is the actual defining file, the OpenCode fallback bridge is documented as the second emitter, and Pi's visible-transform channel stays honestly labeled while `prompt-advisor.ts` is marked as the forwarder of shared directives and owner of the Pi-only dispatch directive.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A verified inventory of the three directive constants and their defining module (`HYGIENE_DIRECTIVE`, `GOVERNOR_DIRECTIVE`, `TERMINAL_PROOF_DIRECTIVE` in the advisor render core, plus the OpenCode plugin-bridge fallback emitter).
- Contract-doc wording that names each directive, its owning module, and its per-runtime channel without duplicating the authoritative directive text.
- Grep-based acceptance assertions that fail loudly when a directive or owner is missing or mislabeled.
- A rollback boundary that restores the prior contract wording without touching the render core.

### Out of Scope
- Changing the directive text, the render core, the OpenCode bridge, or any runtime adapter; this phase only documents the existing injection contract.
- Evidence-class or corpus reconciliation; Phase 007 owns evidence claims.
- Packet status and generated metadata reconciliation; Phase 008 owns state artifacts.
- Rewording the governor doctrine itself or the AGENTS.md operating discipline.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/hooks/injection-contract.md` | Modify (implementation) | Name all three shared directives, canonical ownership, OpenCode fallback parity, accurate runtime channels, and Pi-only directive ownership. |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts` | Read only | Source of truth for the three shared directive constants and the canonical owner path. |
| `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs` | Read only | Confirms the fallback bridge mirrors the same three directives and delegates to the canonical renderer when available. |
| `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` | Read only | Confirms Pi forwards the shared brief and owns the Pi-only dispatch directive in the visible input transform. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The Skill Advisor Brief entry in `injection-contract.md` documents all three fixed directives (comment-hygiene HARD BLOCK, governor, proof-over-appearance) in one place. | A grep over the contract finds each directive's name and at least one distinguishing phrase; no directive is mentioned only in a sample block. |
| REQ-002 | The owning module row names the actual defining module of the directive constants. | The contract's ownership text resolves to `system-skill-advisor/mcp-server/lib/render.ts` and names `renderAdvisorBrief` plus the three constant names, matching a grep of that file. |
| REQ-003 | The OpenCode fallback emitter is documented as a second source of the same three directives. | The contract names `plugin-bridges/mk-skill-advisor-bridge.mjs` as the fallback path that emits the same directives on the OpenCode bridge. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Per-runtime channel rows and Pi-only directive ownership stay accurate for the advisor brief. | The contract still tags Claude/Cursor/Devin/Codex `[SYS]`, OpenCode `[SYS]` via `experimental.chat.system.transform`, and Pi `[MSG]` via `prompt-advisor.ts`; it marks the adapter as the `PI_SUBAGENT_DISPATCH_DIRECTIVE` owner and shared-directive forwarder, and a grep confirms the transform append. |
| REQ-005 | The contract does not duplicate or drift from the authoritative directive text. | The directive section names constants and owners and keeps sample text clearly illustrative; no wording claims a directive moved to a new module unless the source grep proves it. |
| REQ-006 | Contract accuracy is verified by reproducible commands, not prose. | The objective grep and validation commands exit 0 from the final state, and a dated verification row records the result. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** the live `injection-contract.md`, **when** the three directive names are searched, **then** each appears with a named owning module and a per-runtime channel row, and no directive is documented as missing or relocated.
- **SC-002**: **Given** the advisor render core, **when** its exported directive constants are listed, **then** the contract's ownership row matches the actual file and constant names.
- **SC-003**: **Given** the OpenCode plugin bridge, **when** its fallback emission is checked, **then** the contract names the bridge as the second emitter of the same three directives.
- **SC-004**: **Given** the Pi prompt-advisor adapter, **when** its transform behavior is checked, **then** the contract labels Pi `[MSG]`, marks the adapter as a forwarder of the three shared directives, and names it as the owner of the Pi-only `PI_SUBAGENT_DISPATCH_DIRECTIVE`.
- **SC-005**: **Given** a planning-only phase state, **when** the live contract is inspected, **then** any drift found is recorded in this phase's evidence rather than edited, and the phase does not claim the contract is already synchronized.
- **SC-006**: **Given** the final state, **when** the objective commands run, **then** every grep assertion exits 0 and strict validation reports zero structural errors; any dirty-worktree completion-freshness warning is recorded separately because this task must not commit.

**Objective verification commands:**

```bash
rg -n "comment-hygiene|Comment hygiene|HARD BLOCK" .opencode/hooks/injection-contract.md
rg -n "governor|Governor" .opencode/hooks/injection-contract.md
rg -n "proof-over-appearance|proof over appearance" .opencode/hooks/injection-contract.md
rg -n "HYGIENE_DIRECTIVE|GOVERNOR_DIRECTIVE|TERMINAL_PROOF_DIRECTIVE|renderAdvisorBrief" .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts
rg -n "mk-skill-advisor-bridge|three directives|same three" .opencode/hooks/injection-contract.md .opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs
rg -n "prompt-advisor|\[MSG\]|input.*transform" .opencode/hooks/injection-contract.md .opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts
rg -n "PI_SUBAGENT_DISPATCH_DIRECTIVE|Pi-only directive ownership|forwarder|native pi-subagents|cli-\\* override" .opencode/hooks/injection-contract.md .opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/009-injection-contract-directive-sync --strict
```
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The contract is edited without re-reading the current render core, creating a second source of truth. | High | Require the source grep first; the contract names constants and owners, never new text. |
| Risk | A runtime channel row drifts from the adapter behavior (for example Pi's visibility). | Medium | Re-verify the Pi transform path and keep the `[MSG]`/`[SYS]` tags sourced from the adapter scan. |
| Risk | A directive is documented only inside the illustrative sample block. | Medium | Require a named mention plus owning-module row outside the sample for each directive. |
| Dependency | Phase 008 state reconciliation | Low | This phase's docs validate independently; parent packet state remains owned by Phase 008. |
| Dependency | Advisor render-core and bridge paths | Low | Read-only dependencies; the implementation records their current constant inventory. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: All verification commands are local greps and the strict validator; no network, CLI dispatch, or test-suite run is required.
- **NFR-P02**: The contract stays a reference document; directive text is not re-published there.

### Security
- **NFR-S01**: No directive text, constant value, or adapter code is modified by this phase's planning scope.
- **NFR-S02**: Ownership claims are backed by grep output, never by reviewer assertion.

### Reliability
- **NFR-R01**: Re-running the objective commands is idempotent; output is compared, not appended.
- **NFR-R02**: A missing directive or owner in the live contract blocks the implementation handoff rather than passing silently.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A directive name appears in the sample block only: treat as undocumented; require a named mention and ownership row.
- The render core exports additional constants beyond the three: record them in the inventory and keep the contract focused on the three fixed directives.
- The bridge re-emits directives with different constant names: the contract documents the bridge path as a fallback emitter, not a duplicate owner.

### Error Scenarios
- Grep finds no owning-module row for a directive: the contract must be corrected during implementation; planning records the gap.
- A channel tag contradicts the adapter scan: correct the tag to the adapter behavior, not the other way around.
- The live contract is already complete: implementation reduces to verification, and the phase records the PASS without an edit.

### State Transitions
- Planning-only phase: contract drift is recorded as evidence; no live file is edited.
- Implementation phase: contract wording is corrected only after source greps pass.
- Completed phase: the dated verification row cites the exact grep commands that exit 0.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | One contract entry, three directives, two emitter paths, and per-runtime channel rows. |
| Risk | 12/25 | Documentation accuracy only; no runtime behavior changes, but a second source of truth would rot. |
| Research | 12/20 | Live contract, render core constants, bridge fallback, and Pi adapter must be re-read during implementation. |
| **Total** | **38/70** | Level 2; low-risk contract synchronization with strict grep verification. |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does the live contract already satisfy the three-directive inventory, reducing implementation to verification?
- Should the contract name each directive constant inline, or is one constant list per owning module enough?
<!-- /ANCHOR:questions -->

---

## REMEDIATION TRACEABILITY

| Finding | Requirement(s) | Acceptance scenario(s) | Task(s) | Rollback boundary | Objective verification |
|---------|----------------|------------------------|---------|-------------------|------------------------|
| P3 injection-contract.md must document all three directives and their owning modules | REQ-001, REQ-002, REQ-003 | SC-001, SC-002, SC-003 | T002-T005 | Revert only the contract-doc wording; never revert render-core, bridge, or adapter files, which are read-only for this phase. | `rg -n "comment-hygiene|HARD BLOCK" .opencode/hooks/injection-contract.md` and `rg -n "HYGIENE_DIRECTIVE|GOVERNOR_DIRECTIVE|TERMINAL_PROOF_DIRECTIVE" .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts` |
| P3 directive ownership and per-runtime channel accuracy | REQ-004, REQ-005, REQ-006 | SC-004, SC-005, SC-006 | T001, T005, T006 | Restore the prior contract entry from the scoped diff; keep source greps as the acceptance baseline. | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/009-injection-contract-directive-sync --strict` |

## RELATED DOCUMENTS

- Parent packet: [../spec.md](../spec.md)
- Live contract: `.opencode/hooks/injection-contract.md`
- Advisor render core: `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts`
- OpenCode fallback bridge: `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`
- Pi adapter: `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`
- State predecessor: [../008-phase-state-reconciliation/spec.md](../008-phase-state-reconciliation/spec.md)
