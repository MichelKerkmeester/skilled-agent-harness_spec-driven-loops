---
title: "Implementation Plan: Pi Dispatch Authorization Boundary Hardening"
description: "Replace raw authorization heuristics with a bounded command-inspection contract, then verify the registered Pi tool_call boundary against adversarial shell and prompt inputs."
trigger_phrases:
  - "Pi dispatch hardening plan"
  - "dispatch tokenizer plan"
  - "tool_call integration matrix"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/038-fable-governor-pi-hook/006-dispatch-authorization-hardening"
    last_updated_at: "2026-08-04T22:26:28Z"
    last_updated_by: "phase006-evidence-refresh"
    recent_action: "Refreshed validator-recognized evidence receipts"
    next_safe_action: "Hand off evidence inventory to Phase 007"
    blockers: []
    key_files:
      - ".opencode/hooks/dispatch/lib/dispatch-audit.mjs"
      - ".opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts"
      - ".opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts"
    session_dedup:
      fingerprint: "sha256:1fa98dda1e676631d3560deae98a18392129e88789d09aa02979aa91202bdd26"
      session_id: "2026-08-04-cli-038-006-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Pi Dispatch Authorization Boundary Hardening

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript Pi extension plus dependency-free ESM shared core |
| **Framework** | Pi `ExtensionAPI` lifecycle events and Vitest/Node test runners |
| **Storage** | In-memory, session-keyed raw user-turn capture; no persistent state |
| **Testing** | Vitest, Node test runner, and headless Pi startup smoke |

### Overview
First freeze a bounded inspector that understands quotes, escapes, and top-level command separators without executing shell code. The inspector must carry the proven executor identity into the Pi policy adapter. Then capture the original input before advisor/directive composition, deny `cli-pi` before all overrides, and prove the same matrix through the registered extension callbacks.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Current source diff, current pure-helper behavior, and the safe false-positive negative control are recorded.
- [ ] Every consumer of `DISPATCH_SHAPES` and `matchDispatchShape` is inventoried.
- [ ] The direct/ambiguous/none result shape, maximum input bound, and transparent-wrapper grammar are frozen.
- [ ] The raw-capture owner and session-key behavior are confirmed against installed Pi event types.

### Definition of Done
- [ ] REQ-001 through REQ-008 have observed evidence; no P0 item is deferred.
- [ ] Pure classifier and registered Pi `input`/`tool_call` tests both pass.
- [ ] Shared audit and rule-core tests pass, with unrelated failures separately recorded.
- [ ] The scoped source diff has no ephemeral artifact comments, and this phase validates with zero warnings.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Runtime-neutral command inspection core plus a Pi-specific authorization adapter.

### Key Components
- **Command inspector**: Splits a bounded shell string into top-level segments and returns `direct`, `ambiguous`, or `none`, including an executor only for a statically proven direct invocation.
- **Pi authorization adapter**: Applies runtime/tool gating, exact executor matching, unconditional self-deny, deep-loop equality, and session-bound raw-user authorization.
- **Factory integration harness**: Registers the default extension against a fake `ExtensionAPI`, captures callbacks, and invokes them in both sibling-extension orders.

### Data Flow

```text
Original Pi input
  -> raw-user capture
  -> advisor/spec-gate/directive transforms
  -> Pi tool_call
  -> bounded command inspector
  -> direct/ambiguous/none result
  -> self-deny and exact raw-user authorization
  -> existing hard-rule lint
```

A missing raw capture never grants permission. An opaque command cannot be upgraded by a generic `cli-*` mention, and the policy must not spawn a shell.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/hooks/dispatch/lib/dispatch-audit.mjs` | Shared raw-regex registry and audit matcher | Add a bounded inspection result while preserving a compatible direct-match adapter for existing consumers | `rg -n "DISPATCH_SHAPES|matchDispatchShape|inspectDispatch" .opencode/hooks/dispatch` plus shared tests |
| `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts` | Pi `tool_call` guard and current-turn bookkeeping | Consume the inspected result, deny self-recursion, bind authorization to the executor, and stop using transformed text | Pure matrix and factory callback test |
| `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` | Pi input transform that appends advisor context and the Pi directive | Preserve the raw event text at the pre-transform seam if no immutable accessor exists | Reverse registration-order test |
| `.pi/extensions/dispatch-preflight-lint.ts` and `.pi/extensions/prompt-advisor.ts` | Relative discovery mirrors | Keep the mirror topology and avoid a second implementation | `readlink` plus headless Pi load |
| `.opencode/hooks/dispatch/lib/dispatch-audit.test.mjs` | Shared matcher evidence | Add prose, quote, separator, wrapper, variable, and alias-shaped rows | `npx vitest run .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs --reporter=dot` |
| `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts` | Existing pure helper matrix | Retain useful rows and add factory, order, mismatch, injected-text, quoted, and negated cases | `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` |

Required inventories before implementation:
- Same-class producers: `rg -n "DISPATCH_SHAPES|matchDispatchShape|cli-(opencode|claude-code|codex|devin|cursor|pi)" .opencode/hooks .opencode/skills --glob '*.mjs' --glob '*.ts'`.
- Consumers of changed symbols: `rg -n "matchDispatchShape|DISPATCH_SHAPES|recordDispatch" . --glob '*.mjs' --glob '*.ts' --glob '*.md'`.
- Matrix axes: runtime, tool name, direct/ambiguous/none command form, matched executor, override executor, override polarity, transformed-text presence, session match, and handler registration order.
- Invariant: only a statically proven direct executor can be authorized; opaque syntax cannot be upgraded by a generic mode mention.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Capture the current focused baseline and reproduce the raw-text false-positive negative control without launching a CLI.
- [ ] Inventory matcher consumers and read the installed Pi extension event declarations.
- [ ] Freeze the inspection result, direct executor vocabulary, separator rules, wrapper policy, and ambiguous-deny rule.

### Phase 2: Core Implementation
- [ ] Implement the bounded tokenizer/inspector without shell evaluation or external process execution.
- [ ] Carry the executor identity from inspection into authorization; reject `cli-pi` before every override branch.
- [ ] Replace marker stripping with raw-user capture owned at the pre-transform boundary and keyed by session.
- [ ] Preserve existing hard-rule lint as a later step after Pi policy authorization succeeds.

### Phase 3: Verification
- [ ] Run pure classifier tests for direct, prose/quoted, separator, wrapper, variable, alias, negation, and injected-text cases.
- [ ] Register the actual Pi factory and invoke `input` and `tool_call` handlers in both extension orders.
- [ ] Run shared dispatch tests, the Node rule suite, and headless Pi startup smoke.
- [ ] Inspect the scoped diff and strict-validate this phase before handing evidence to Phase 007.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Pure unit | Inspector output and authorization predicate | `npx vitest run .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` |
| Factory integration | Registered Pi `input` and `tool_call`, reverse order, session mismatch | `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` |
| Shared regression | Audit metadata/log behavior and dispatch rule engine | `npx vitest run .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs --reporter=dot` and `node --test .opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` |
| Runtime smoke | Project-local Pi extension parsing/loading | `command -v pi && pi --offline --approve -p "list available tools; do not modify files" </dev/null` |
| Static boundary | No transformed-text authorization, stale consumer, or comment-hygiene residue | `rg -n "stripInjectedContent|additionalContext.*authorization|DISPATCH_SHAPES|matchDispatchShape" .opencode/hooks/dispatch .opencode/skills/system-skill-advisor/hooks/pi` and `git diff --check` |

Reports must label pure helper assertions separately from factory-level Pi tool-call evidence. A green predicate matrix is not proof that Pi registered or blocked a tool call.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Installed Pi extension types | Internal runtime | Read during planning; event accessor still to confirm | Block the factory harness until the actual callback shape is known; do not guess. |
| Shared dispatch audit tests | Internal | Files present | A shared matcher change cannot hand off without consumer regression evidence. |
| Pi binary and mirror | Local runtime | Binary and symlink mirror present | Provider failure is not an extension-load result; record the distinction in evidence. |
| Phase 005 runtime surface | Internal predecessor | Child and mirror present | Do not add a second Pi adapter or bypass the existing mirror. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A direct dispatch is falsely allowed, a mismatched executor authorizes a command, self-recursion is reachable, a factory test fails, or non-Pi audit recognition regresses.
- **Procedure**: Revert the Pi authorization/capture changes and shared inspector as separate units, restore the last known direct-match behavior, rerun shared and Pi focused tests, and keep opaque forms blocked rather than restoring raw authorization heuristics.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 005 runtime surface and the current source diff | Core implementation |
| Core implementation | Frozen inspection and raw-capture contracts | Pure and factory verification |
| Verification | Core implementation | Phase 007 evidence reconciliation |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and contract freeze | Medium | 1-2 hours |
| Bounded inspector and Pi policy | High | 4-8 hours |
| Pure, factory, and runtime verification | High | 3-5 hours |
| **Total** | | **8-15 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Capture shared matcher and Pi matrix baselines before changing the classifier.
- [ ] Confirm no new package or shell parser dependency is required.
- [ ] Confirm the Pi mirror still points to the canonical extension source.

### Rollback Procedure
1. Revert the Pi policy/capture change while retaining no new allow path.
2. Revert the shared inspector only if shared audit behavior is the source of the regression.
3. Run the pure matcher test, factory integration test, rule test, and headless startup smoke.
4. Record the exact failing command and output before reopening implementation.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Restore the affected source/test files to the pre-phase revision; no persistent state migration is permitted.
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS

- Specification: [spec.md](spec.md)
- Tasks: [tasks.md](tasks.md)
- Checklist: [checklist.md](checklist.md)
- Next evidence phase: [../007-dispatch-validation-evidence/plan.md](../007-dispatch-validation-evidence/plan.md)
