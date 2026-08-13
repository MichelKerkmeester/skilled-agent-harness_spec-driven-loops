---
title: "Implementation Plan: Dispatch Validation, Evidence, and Corpus Baseline"
description: "Build a four-class evidence ledger, exercise the registered Pi tool_call boundary, and capture a reproducible full-corpus baseline before correcting historical claims."
trigger_phrases:
  - "dispatch evidence plan"
  - "Pi factory test plan"
  - "Vitest corpus baseline plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/007-fable-governor-pi-hook/007-dispatch-validation-evidence"
    last_updated_at: "2026-08-04T18:45:00Z"
    last_updated_by: "pi-planning-agent"
    recent_action: "Authored evidence reconciliation plan"
    next_safe_action: "Capture baseline commands and exact exit codes"
    blockers: []
    key_files:
      - ".opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts"
      - ".opencode/hooks/dispatch/lib/dispatch-audit.test.mjs"
      - "evidence/full-corpus-baseline.md"
    session_dedup:
      fingerprint: "sha256:2afe9e9868c8cdfd86f0b400d37c01beeabe8a44c5072a9371c716a4855b7dd2"
      session_id: "2026-08-04-cli-038-007-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Dispatch Validation, Evidence, and Corpus Baseline

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript/ESM tests and Markdown evidence artifacts |
| **Framework** | Vitest, Node test runner, Pi `ExtensionAPI` test double |
| **Storage** | Phase-local Markdown baseline and existing implementation summaries |
| **Testing** | Focused dispatch tests, factory integration, headless Pi smoke, package-root Vitest |

### Overview
Capture the actual commands and exit codes before changing any claim. Add or verify factory-level tests that invoke callbacks registered by the default Pi extension, then maintain an evidence ledger that distinguishes helper, shared-core, factory, and startup observations. Finally, run the advisor package's full corpus from its package root and record every failure, including a nonzero result, with a bounded owner and revisit trigger.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 006's final test surface and current pure-helper behavior are known.
- [ ] The four evidence classes and their authoritative commands are listed.
- [ ] The historical 21-file observation is preserved as provenance, not treated as the current count.
- [ ] The package-root Vitest config and baseline output location are fixed.

### Definition of Done
- [ ] P0 factory evidence exists for self-dispatch and mismatch.
- [ ] Unsupported parity/order/coverage claims are corrected or backed by named assertions.
- [ ] `evidence/full-corpus-baseline.md` has command, commit, counts, failure ledger, owner, and revisit trigger.
- [ ] Focused gates are green and a full-corpus failure is explicitly deferred rather than hidden.
- [ ] This phase validates with no warnings.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Evidence taxonomy plus command-bound reconciliation.

### Key Components
- **Factory harness**: A fake `ExtensionAPI` records `pi.on` registrations, feeds raw input, and invokes the registered `tool_call` callback.
- **Evidence ledger**: A table maps each claim to evidence class, command/test name, observed result, and limitation.
- **Corpus baseline**: A durable Markdown artifact stores current package-root Vitest facts and a deferral contract.
- **Historical summaries**: Existing phase summaries are narrowed where claims exceed their evidence; their original scope is not rewritten.

### Data Flow

```text
focused baseline -> factory/shared tests -> evidence ledger
                         |                    |
                         +-> package-root corpus -> failure ledger/owner/revisit trigger
```

A pure helper result can support classifier correctness but cannot satisfy a claim about Pi callback registration. A nonzero corpus command is still evidence when its output and exit code are recorded.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts` | Current pure helper matrix | Add factory registration and callback invocation, or explicitly prove an existing harness does so | Test names invoke `pi.on` callbacks and assert returned block/allow values |
| `.opencode/hooks/dispatch/lib/dispatch-audit.test.mjs` | Shared matcher tests | Separate shared-core recognition from Pi policy evidence | Focused Vitest command and class-labelled ledger |
| `001-research/implementation-summary.md` through `006-dispatch-authorization-hardening/implementation-summary.md` | Historical claims and phase status narratives | Replace unsupported byte/order/helper coverage claims with exact evidence class and command | `rg -n "byte[- ]equal|transform.order|tool_call|pure helper"` plus changed summaries |
| `007-dispatch-validation-evidence/evidence/full-corpus-baseline.md` | New corpus evidence | Record the exact package-root run, counts, failure names, owner, and revisit trigger | File existence, required headings, and command output reference |
| `.opencode/skills/system-skill-advisor/mcp-server/vitest.config.ts` | Full-corpus root/config | Read only; use its root and include/exclude behavior for the baseline | `sed`/`rg` inspection and package-root command |
| `.pi/extensions/*.ts` | Live startup surface | Read only for smoke-test scope; do not call startup success full tool-call coverage | `command -v pi && pi ... </dev/null` |

Required inventories:
- Evidence producers: `rg -n "expect\(|describe\(|it\(|tool_call|pi\.on|byte|parity" .opencode/hooks/dispatch .opencode/skills/system-skill-advisor --glob '*.test.*' --glob '*.vitest.*'`.
- Claim consumers: `rg -n "PASS|FAIL|byte[- ]equal|transform.order|tool_call|pure helper|21 files|full corpus" .opencode/specs/hooks/007-fable-governor-pi-hook --glob '*.md'`.
- Matrix axes: helper vs factory, runtime, tool, command shape, executor/override match, injection presence, registration order, and corpus root.
- Invariant: each claim is no stronger than its observed boundary.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Run focused dispatch tests and record output/exit status as the pre-change baseline.
- [ ] Run the package-root full corpus and preserve the historical 21-file count separately.
- [ ] Inventory all claims and map each to a test boundary or mark it unsupported.

### Phase 2: Core Implementation
- [ ] Add or verify the registered Pi factory harness, including both extension registration orders and the injected-directive negative control.
- [ ] Add shared matcher evidence for prose/quote/printf false positives and ambiguous shell forms if Phase 006 leaves that test seam here.
- [ ] Create `evidence/full-corpus-baseline.md` with immutable command facts, failure ledger, owner, and revisit trigger.
- [ ] Correct summaries and checklist/task evidence placement without changing enforcement behavior.

### Phase 3: Verification
- [ ] Run pure, shared-core, factory, and startup commands separately and record counts.
- [ ] Re-run the full corpus from the same package root and append a dated observation if the count changes.
- [ ] Scan for unsupported parity/order/coverage wording and run strict validation.
- [ ] Hand off the final evidence inventory and corpus deferral to Phase 008.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Pure helper | `shouldDenyPiDispatch` and inspector rows | `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` |
| Shared core | Direct/prose/quoted/ambiguous dispatch classification | `npx vitest run .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs --reporter=dot` |
| Factory integration | Registered `input`/`tool_call`, self, mismatch, injection, order, native subagent | Same Pi test command, with named factory tests |
| Runtime smoke | Extension parse/load only | `command -v pi && pi --offline --approve -p "list available tools; do not modify files" </dev/null` |
| Corpus baseline | Advisor package full test corpus | `(cd .opencode/skills/system-skill-advisor/mcp-server && npx vitest run --reporter=dot)` |
| Claim scan | Unsupported wording and stale counts | `rg -n "byte[- ]equal|byte parity|transform.order|tool_call|pure helper|21 files|full corpus" .opencode/specs/hooks/007-fable-governor-pi-hook --glob '*.md'` |

The evidence ledger must put command output, exit status, and class beside every result. If the corpus command exits nonzero, focused gates may still pass, but the packet must not call the whole corpus green.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 006 factory harness | Internal | Planned | P0 runtime evidence cannot be claimed until callbacks are observable. |
| Advisor package dependencies | Local | To baseline | Corpus ledger records missing modules or fixtures rather than hiding them. |
| Pi binary and extensions | Local runtime | Present during planning | Startup smoke can distinguish loader errors from provider/auth failures. |
| Historical phase summaries | Internal docs | Present but inconsistent | Unsupported claims must be corrected, not silently copied. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A new evidence test alters enforcement behavior, the baseline artifact records the wrong root/commit, or a wording correction removes a claim that is actually backed by a test.
- **Procedure**: Revert new fixtures and wording as separate commits/changes, retain the raw baseline output for review, restore only claims supported by a named command, and rerun focused gates. Do not delete the historical 21-file observation when the current count differs.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Baseline | Phase 006 source/test surface | Evidence corrections |
| Factory and claim audit | Baseline and Phase 006 handlers | Final evidence ledger |
| Corpus reconciliation | Stable package-root command | Phase 008 state reconciliation |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Workstream | Complexity | Estimated Effort |
|------------|------------|------------------|
| Baseline and claim inventory | Medium | 1-2 hours |
| Factory/evidence tests | High | 3-6 hours |
| Corpus ledger and wording reconciliation | Medium | 2-4 hours |
| **Total** | | **6-12 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Preserve raw focused and full-corpus output before changing evidence wording.
- [ ] Verify the factory harness is not only a direct helper invocation.
- [ ] Pin the package-root command, commit, and environment facts in the baseline artifact.

### Rollback Procedure
1. Revert evidence fixtures independently from enforcement code.
2. Revert wording rows only when the named command or test is wrong.
3. Re-run focused commands and retain the corpus ledger even when unrelated failures remain.
4. Reopen the phase if a claim cannot be tied to an observed boundary.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Remove only the new evidence fixture and phase-local baseline when its provenance is invalid; never erase historical failure provenance from summaries without a replacement explanation.
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS

- Specification: [spec.md](spec.md)
- Tasks: [tasks.md](tasks.md)
- Checklist: [checklist.md](checklist.md)
- Enforcement predecessor: [../006-dispatch-authorization-hardening/plan.md](../006-dispatch-authorization-hardening/plan.md)
- State successor: [../008-phase-state-reconciliation/plan.md](../008-phase-state-reconciliation/plan.md)
