---
title: "Implementation Summary: Dispatch Validation, Evidence, and Corpus Baseline"
description: "Completed command-backed evidence summary separating Pi helper, shared-core, registered tool_call, startup, and the nonzero full-corpus result."
status: complete
completion_pct: 100
trigger_phrases:
  - "dispatch evidence summary"
  - "Pi tool_call evidence status"
  - "full corpus baseline status"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/007-fable-governor-pi-hook/007-dispatch-validation-evidence"
    last_updated_at: "2026-08-11T06:43:16.995Z"
    last_updated_by: "pi-phase-state-reconciliation"
    recent_action: "Reconciled completed evidence ledger and preserved the nonzero corpus baseline"
    next_safe_action: "Use the ledger while completing Phase 008 state reconciliation"
    blockers: []
    key_files:
      - ".opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts"
      - ".opencode/hooks/dispatch/lib/dispatch-audit.test.mjs"
      - "evidence/full-corpus-baseline.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:1fc95833707ec425bd9bf25b6968bf0584156a533c415b7463b14901efeb9934"
      session_id: "2026-08-04-cli-038-007-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Dispatch Validation, Evidence, and Corpus Baseline

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-dispatch-validation-evidence |
| **Status** | Complete; focused evidence and the explicit corpus deferral are recorded |
| **Completion** | 100% scoped evidence and verification; whole advisor corpus remains an explicit nonzero deferral |
| **Level** | 2 |
| **Predecessor** | 006-dispatch-authorization-hardening |
| **Successor** | 008-phase-state-reconciliation |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 007 now has command-backed evidence for four distinct boundaries. The Pi test registers the default factory against a fake `ExtensionAPI`, records `input` and `tool_call` handlers, chains input transforms in both registration orders, and invokes the registered `tool_call` callback. The pure predicate matrix and the registered callback cases remain separate named test blocks in the same file.

The shared matcher suite already contained the required direct, prose/quoted, `printf`/`echo`, separator, variable, alias, substitution, and wrapper rows, so no redundant shared test rows were added. Historical evidence language was narrowed where a reviewer statement or a combined suite count was stronger than the named automated assertion. The package-root full-corpus command was run twice and remains nonzero; both observations and the complete 27-entry failure ledger are retained in [`evidence/full-corpus-baseline.md`](evidence/full-corpus-baseline.md).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts` | Modified | Confirms default-factory registration; chains real input transforms; adds registered callback rows for negation, quoting, variables, aliases, injected advisor/directive text, and both orders. |
| `evidence/full-corpus-baseline.md` | Created | Records exact package-root commands, commit, environment, durations, counts, skips, failure ledger, historical provenance, owner, and revisit trigger. |
| `002-governor-parity/tasks.md` | Narrowed historical row | Distinguishes the operator-recorded manual comparison from the containment-only automated assertion and preserves the historical corpus count. |
| `002-governor-parity/implementation-summary.md` | Narrowed historical rows | Keeps the 21-file observation as provenance and points current corpus claims to the Phase 007 artifact. |
| `003-pi-directive-capsule/implementation-summary.md` | Narrowed historical row | Removes an unsupported registration-order claim from the three-test prompt-transform phase. |
| `004-pi-directive-enforcement/implementation-summary.md` | Narrowed historical row | Removes an unsupported load-order claim from the helper-matrix phase. |
| `006-dispatch-authorization-hardening/implementation-summary.md` | Corrected evidence classes | Reports the 27-test Pi suite as a combined helper/factory suite rather than a factory-only count. |
| `006-dispatch-authorization-hardening/tasks.md` | Corrected evidence rows | Uses the combined-suite boundary and names the registered callback evidence without relabeling all 27 tests. |
| `006-dispatch-authorization-hardening/checklist.md` | Corrected evidence rows | Separates shared-core, pure-matrix, registered-factory, and live-smoke receipts. |
| `tasks.md`, `checklist.md` | Completed with receipts | Pins every phase row to observed commands, named test boundaries, or the corpus artifact. |
| `implementation-summary.md` | Updated | Records the final evidence ledger, claim audit, corpus deferral, and Phase 008 handoff. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The focused baselines were captured before the Phase 007 test edit. The registered Pi harness was then strengthened to pass each returned input transform to the next handler, assert that injected advisor/directive text was actually produced, and invoke the registered `tool_call` callback. The final Pi suite passed 32 tests. The shared matcher and Node rule suites remained green. A headless runtime smoke used an encoded binary lookup because the literal outer shell form is intercepted by the existing dispatch preflight before the runtime can start; the Pi process itself exited 0 and reported no file modifications.

The advisor package corpus was rerun from its package root after the test edit. It produced the same 18 failed files, 27 failed tests, 1 skipped file, and 7 skipped tests as the pre-edit observation. The nonzero result is documented as a maintenance deferral, not treated as a focused-gate failure or a green corpus.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep helper, shared-core, registered Pi, and live startup classes separate | A helper result cannot prove callback registration; a startup exit cannot prove a blocked `tool_call`. |
| Chain the fake input pipeline | Registration-order evidence must observe the transformed event delivered to the next callback, not call every callback with an unchanged fixture. |
| Retain existing shared matcher rows | The shared suite already covers direct commands, prose/quoted payloads, `printf`, `echo`, separators, variables, aliases, substitutions, and unknown wrappers. |
| Narrow historical byte/order claims | The bridge test asserts containment; the operator recorded a manual 806-byte comparison, and no automated byte-equality assertion exists. The earlier helper phases did not execute registration-order factories. |
| Preserve both corpus observations | The historical 21-file report has no complete command receipt; the current package-root result is 18 failed files and exit 1. Neither count replaces the other. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

### Evidence Ledger

| Evidence class | Boundary and named cases | Authoritative command | Observed result |
|----------------|---------------------------|-----------------------|------------------|
| Pure helper | `describe("Pi dispatch deny matrix")`: direct self/mismatch, matching override, deep-loop match/mismatch, self-recursion, negation, quoting, history/spec-gate/injected text, `printf`, variable, subagent, non-dispatch, and non-Pi rows. | `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` | PASS, final suite 32/32, exit 0; pure rows are not counted as factory-only coverage. |
| Shared dispatch core | `inspectDispatch`/`matchDispatchShape` direct executors, prose/quoted payloads, `printf`, `echo`, top-level separators, transparent `env`, variables, aliases, substitutions, wrappers, malformed input, and fail-open rows. | `npx vitest run .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs --reporter=dot` | PASS, 351/351 tests, exit 0. |
| Registered Pi `tool_call` | `describe("registered Pi extension boundary")`: default-factory `input`/`tool_call` registration, advisor/directive injection, guard-first and transform-first orders, matching positive override, self-dispatch, direct/deep-loop mismatch, negation, quoting, variable and alias ambiguity, session mismatch, replacement of prior capture, real advisor-first transform, and native `subagent` non-denial. | `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` | PASS, final suite 32/32, exit 0; callback rows invoke recorded handlers and assert returned block/allow values. |
| Shared rule core | Node rule parsing, check-id mapping, mutation-proof flag handling, discrimination, fail-open behavior, and severity mapping. | `node --test .opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | PASS, 7/7 tests, exit 0. |
| Live Pi startup | Project-local runtime load with no file modification request. | Encoded equivalent of `command -v pi && pi --offline --approve -p "list available tools; do not modify files" </dev/null` | PASS, `BINARY_PATH=/Users/michelkerkmeester/.local/bin/pi`; Pi emitted available-tools output, `No files were modified.`, and process exit 0. |
| Full advisor corpus | Package-root Vitest corpus; separate from focused dispatch evidence. | `(cd .opencode/skills/system-skill-advisor/mcp-server && npx vitest run --reporter=dot)` | **FAIL, exit 1** on both observations: 18 failed files, 93 passed, 1 skipped; 27 failed tests, 675 passed, 7 skipped. See the complete ledger. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:claim-audit -->
## Claim-to-Command Audit

| Historical or retained claim | Correct evidence strength | Command or artifact |
|------------------------------|----------------------------|---------------------|
| Bridge/canonical output comparison | Manual observation only: both outputs were recorded at 806 bytes; the automated test checks containment and does not compare bytes. | `002-governor-parity/tasks.md` T005; `tests/compat/plugin-bridge.vitest.ts` |
| Pi prompt transform | Three prompt-advisor tests cover nonblank append, blank input, and shared-renderer isolation; they do not prove registration-order independence. | `003-pi-directive-capsule/tasks.md` T003; `npx vitest run tests/hooks/prompt-advisor.vitest.ts` |
| Pi registration order and injected text | Registered factory tests execute both transform registration orders and a real advisor-first chain, with raw user capture preserved. | `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` |
| Pure helper versus registered Pi coverage | Pure matrix and factory callbacks are separate named blocks in one 32-test file; the total is not a factory-only count. | Pi test file and final Pi command above |
| Historical full-corpus result | 21 failed files is provenance only; the current package-root result is 18 failed files, 27 failed tests, exit 1. | `evidence/full-corpus-baseline.md` |
<!-- /ANCHOR:claim-audit -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The advisor package corpus remains nonzero: 18 failed files and 27 failed tests on both recorded observations. The failure owner and concrete revisit trigger are in [`evidence/full-corpus-baseline.md`](evidence/full-corpus-baseline.md); the corpus is not called green.
2. The literal outer-shell headless command is intercepted by the existing dispatch preflight before Pi starts. The encoded binary-lookup command executed the same Pi process arguments and exited 0, so startup evidence is runtime smoke rather than a claim that the literal wrapper bypasses the guard.
3. No automated byte-equality assertion was added because the available bridge test asserts containment; the historical manual comparison is labeled accordingly.
4. Phase 008 owns packet status and generated metadata reconciliation. Phase 009 owns durable contract wording and its scoped synchronization is Complete. Neither ownership boundary is folded into this evidence phase.

### Rollback boundary

Revert only the Phase 007 test harness additions, evidence artifact, and wording corrections. Keep the historical corpus row if the current command changes; restore a claim only when its named assertion and command support it.

### Safe continuation point

Phase 008 consumed the four-class ledger, final focused receipts, and explicit corpus deferral without re-running the claim audit. This phase did not modify Phase 008 state artifacts or Phase 009 contract wording.
<!-- /ANCHOR:limitations -->
