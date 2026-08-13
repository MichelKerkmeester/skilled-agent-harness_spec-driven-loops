---
title: "Implementation Plan: Injection Contract Directive Sync"
description: "Verify the three advisor directives against their owning modules, then align the injection-contract entry so every directive has a named owner and accurate per-runtime channel."
trigger_phrases:
  - "injection contract sync plan"
  - "directive ownership plan"
  - "contract grep verification plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/007-fable-governor-pi-hook/009-injection-contract-directive-sync"
    last_updated_at: "2026-08-04T20:15:00Z"
    last_updated_by: "pi-planning-agent"
    recent_action: "Authored contract-sync implementation plan"
    next_safe_action: "Run the source greps before touching the contract wording"
    blockers: []
    key_files:
      - ".opencode/hooks/injection-contract.md"
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/render.ts"
      - ".opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs"
    session_dedup:
      fingerprint: "sha256:7114dbc0800edb77fd7d41939ea81b7def00246753934248238060128f73f4e6"
      session_id: "2026-08-04-cli-038-009-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Injection Contract Directive Sync

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown reference doc plus TypeScript/ESM source (read-only) |
| **Framework** | None; grep-based assertions and the spec-kit strict validator |
| **Storage** | `.opencode/hooks/injection-contract.md` (implementation); phase docs (planning) |
| **Testing** | `rg` ownership/channel assertions and `validate.sh --strict` |

### Overview
First read the live contract and the advisor render core to build a three-directive inventory (comment hygiene, governor, proof-over-appearance) with their exporting constants and per-runtime channels. Then align only the contract wording so every directive has a named owning module and an accurate channel tag, and prove the result with grep assertions that exit nonzero when anything is missing. No directive text, render-core constant, bridge, or adapter is modified.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The live `injection-contract.md` Skill Advisor Brief entry is read and its current directive coverage recorded.
- [ ] `render.ts` exports `HYGIENE_DIRECTIVE`, `GOVERNOR_DIRECTIVE`, and `TERMINAL_PROOF_DIRECTIVE` inside `renderAdvisorBrief`, confirmed by grep.
- [ ] The OpenCode bridge fallback and the Pi `prompt-advisor.ts` transform path are confirmed by grep.
- [ ] The intended contract edits are limited to the Skill Advisor Brief entry.

### Definition of Done
- [ ] REQ-001 through REQ-006 have grep-backed evidence from the final state.
- [ ] Each of the three directives appears in the contract with a named owning module and channel row.
- [ ] The strict validator exits 0 with no warnings for this phase.
- [ ] No source file outside the contract was modified, and the scoped diff contains no ephemeral identifiers or spec paths in comments.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only source-of-truth inventory followed by single-document alignment.

### Key Components
- **Directive inventory**: a planning-time table mapping each of the three directives to its constant name, exporting module, fallback emitter, and per-runtime channel, backed by grep output.
- **Contract entry alignment**: rewording only the Skill Advisor Brief entry in `injection-contract.md` so the inventory is fully named there.
- **Grep gate**: assertion commands that fail when a directive name, owner path, or channel tag is absent or stale.

### Data Flow

```text
render.ts constants + bridge fallback + Pi adapter scan
  -> three-directive inventory (names, owners, channels)
  -> current contract entry diffed against inventory
  -> minimal contract wording alignment
  -> grep assertions + strict validation exit 0
```

The render core remains the authoritative text source; the contract names it, it never re-publishes new directive text.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/hooks/injection-contract.md` | Cross-runtime injection reference | Align the Skill Advisor Brief entry: name all three directives, the owning module and constants, the OpenCode fallback emitter, and accurate channel tags | `rg -n "comment-hygiene|HARD BLOCK|governor|proof-over-appearance|renderAdvisorBrief|mk-skill-advisor-bridge|prompt-advisor"` |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts` | Authoritative directive constants | Read only; inventory `HYGIENE_DIRECTIVE`, `GOVERNOR_DIRECTIVE`, `TERMINAL_PROOF_DIRECTIVE` | `rg -n "HYGIENE_DIRECTIVE|GOVERNOR_DIRECTIVE|TERMINAL_PROOF_DIRECTIVE|renderAdvisorBrief"` |
| `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs` | OpenCode fallback emitter | Read only; confirm it emits the same three directives | `rg -n "HYGIENE_DIRECTIVE|GOVERNOR_DIRECTIVE|TERMINAL_PROOF_DIRECTIVE|directive"` |
| `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` | Pi visible input transform | Read only; confirm the `[MSG]` channel and forwarder role | `rg -n "transform|input|directive"` |

Required inventories before implementation:
- Directive producers: `rg -n "HYGIENE_DIRECTIVE|GOVERNOR_DIRECTIVE|TERMINAL_PROOF_DIRECTIVE" .opencode/skills/system-skill-advisor --glob '*.ts' --glob '*.mjs'`.
- Contract consumers: `rg -n "Skill Advisor Brief|directive|HYGIENE_DIRECTIVE|GOVERNOR_DIRECTIVE|TERMINAL_PROOF_DIRECTIVE" .opencode/hooks/injection-contract.md`.
- Matrix axes: directive, owning module, fallback emitter, per-runtime channel, sample-vs-named mention.
- Invariant: every directive has exactly one owning module named in the contract; sample text never substitutes for an ownership row.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read the live contract's Skill Advisor Brief entry and record which directives and owners it already names.
- [ ] Grep the render core for the three constants and `renderAdvisorBrief`; grep the bridge for the fallback emission.
- [ ] Freeze the directive inventory and the exact contract section in scope.

### Phase 2: Core Implementation
- [ ] Align the contract entry: name each directive, its owning module and constants, the OpenCode fallback emitter, and the per-runtime channel rows.
- [ ] Keep sample text clearly illustrative and mark `prompt-advisor.ts` as a forwarder on the Pi `[MSG]` channel.
- [ ] Do not modify render-core, bridge, adapter, or any runtime hook file.

### Phase 3: Verification
- [ ] Run every objective grep assertion from the final state and record exit codes.
- [ ] Inspect the scoped diff and strict-validate this phase with zero warnings.
- [ ] Hand the dated verification row and any residual drift note to Phase 008 reconciliation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Directive presence | All three directives named in the contract | `rg -n "comment-hygiene|HARD BLOCK" .opencode/hooks/injection-contract.md` plus governor and proof-over-appearance greps |
| Ownership | Constant names resolve to the render core | `rg -n "HYGIENE_DIRECTIVE|GOVERNOR_DIRECTIVE|TERMINAL_PROOF_DIRECTIVE|renderAdvisorBrief" .opencode/skills/system-skill-advisor/mcp-server/lib/render.ts` |
| Fallback emitter | Bridge named as second source | `rg -n "mk-skill-advisor-bridge|same three|three directives" .opencode/hooks/injection-contract.md` |
| Channel accuracy | Pi `[MSG]` and other runtimes `[SYS]` | `rg -n "prompt-advisor|\[MSG\]|experimental.chat.system.transform" .opencode/hooks/injection-contract.md` |
| Structural | Phase docs and metadata | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/hooks/007-fable-governor-pi-hook/009-injection-contract-directive-sync --strict` |

A green grep is only evidence for the exact pattern it searched; the phase records each command and its exit status rather than summarizing them.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Advisor render core and bridge | Internal | Read-only; present | The inventory cannot be frozen until the constants are grep-confirmed. |
| Live injection-contract.md | Internal | Present | Implementation is a no-op verification pass if the entry already satisfies the inventory. |
| Pi prompt-advisor adapter | Internal | Read-only; present | Channel rows stay accurate only if the transform path is re-checked. |
| Phase 008 metadata pass | Internal | Pending | This phase validates independently; final packet status promotion waits for Phase 008. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A directive or owner is missing from the contract after the change, a channel tag contradicts the adapter scan, or the strict validator fails.
- **Procedure**: Revert only the Skill Advisor Brief entry from the scoped diff, re-run the source greps to confirm the render core was never touched, restore the prior wording, and re-run the objective commands.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Live contract and render-core greps | Core implementation |
| Core implementation | Frozen directive inventory | Verification |
| Verification | Core implementation | Phase 008 final state reconciliation |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and inventory | Low | 30-60 minutes |
| Contract alignment | Low | 30-60 minutes |
| Verification and validation | Low | 30-60 minutes |
| **Total** | | **1.5-3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Capture the current contract entry and the source greps before editing.
- [ ] Confirm no render-core, bridge, or adapter file appears in the planned diff.
- [ ] Confirm the contract section in scope is only the Skill Advisor Brief entry.

### Rollback Procedure
1. Revert the contract entry wording to the captured baseline.
2. Re-run the objective greps and confirm the render core still exports all three constants.
3. Re-run strict validation for this phase.
4. Record the failing assertion before reopening implementation.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Restore the contract file from the pre-phase revision; no other file is permitted to change.
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS

- Specification: [spec.md](spec.md)
- Tasks: [tasks.md](tasks.md)
- Checklist: [checklist.md](checklist.md)
- Live contract: `.opencode/hooks/injection-contract.md`
- State predecessor: [../008-phase-state-reconciliation/plan.md](../008-phase-state-reconciliation/plan.md)
