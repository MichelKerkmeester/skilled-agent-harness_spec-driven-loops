---
title: "Implementation Summary: Cross-Runtime Coverage and Verification"
description: "Command-backed record of the R1-P1-001 quoted-executor fix, its shared-lib test evidence, cross-runtime documentation coverage, and the explicit R2-P1-002/R2-P1-003 deferral."
status: complete
completion_pct: 100
trigger_phrases:
  - "quoted executor fix summary"
  - "cross-runtime coverage status"
  - "R1-P1-001 resolution evidence"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/007-fable-governor-pi-hook/010-cross-runtime-coverage-and-verification"
    last_updated_at: "2026-08-11T06:43:17.475Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded the evidence ledger for the quoted-executor dispatch fix"
    next_safe_action: "Confirm commit of the fix and open a system-deep-loop packet for R2 findings"
    blockers:
      - "The fix files remain uncommitted in the working tree at authoring time"
    key_files:
      - ".opencode/hooks/dispatch/lib/dispatch-audit.mjs"
      - ".opencode/hooks/dispatch/lib/dispatch-audit.test.mjs"
      - ".opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts"
      - ".opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts"
      - "../review/deep-review-findings-registry.json"
    session_dedup:
      fingerprint: "sha256:1a4aaea57bc396194ce9e97a85c5f9c6ebbaeb4dc6190cf56d615f9856215f8f"
      session_id: "2026-08-05-cli-038-010-doc"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Cross-Runtime Coverage and Verification

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-cross-runtime-coverage-and-verification |
| **Status** | Complete; documentation-only recording of an already-applied fix, with the fix files still uncommitted |
| **Completion** | 100% of this phase's documentation and verification scope; the underlying fix commit and the R2-P1-002/R2-P1-003 remediation packet are explicit follow-ups, not this phase's scope |
| **Level** | 2 |
| **Predecessor** | 007-dispatch-validation-evidence (evidence taxonomy this ledger follows) |
| **Successor** | None planned inside packet 007; R2-P1-002/R2-P1-003 belong to a separate `system-deep-loop` packet |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase built no code. It recorded, with independently re-run command evidence, a fix that already existed in the working tree when this phase began authoring.

**Root cause (R1-P1-001)**: `directExecutor()` in `.opencode/hooks/dispatch/lib/dispatch-audit.mjs` previously carried a blanket guard that returned `null` for any quoted command-position executor token, so `"devin" -p "task"` classified as `{ kind: 'none' }`. The Pi `tool_call` preflight handler (`.opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts:243`) reads `if (inspection.kind === "none") return;` immediately after calling `inspectDispatch`, so a `kind: none` classification skips both the authorization check and the audit record. The same `inspectDispatch` function backs `matchDispatchShape` (`dispatch-audit.mjs:264-267`), which is the cross-runtime audit-trail entry point, so the same misclassification also produced a gap in the audit trail shared by the four inspector-consuming runtimes (Claude, Codex, Devin, Pi — the `EXECUTOR_BASENAMES` set at `dispatch-audit.mjs:41`).

**Fix**: the blanket quoted-executor guard was removed. `directExecutor()` now classifies a command-position token via exact basename-set membership (`EXECUTOR_BASENAMES.has(basename(executable.value))`, lines 196-197) regardless of whether the token is quoted. An inline comment at lines 191-195 documents the rationale: a quoted command-position token still names the exact binary the shell will run, so `"devin" -p x` invokes `devin` exactly as the unquoted form does, while set-membership stays exact so multi-word quoted prose (`"devin -p task"`) and quoted arguments (`echo "devin" -p "hi"`) correctly remain non-matches. Because both the Pi preflight authorization path and `matchDispatchShape`'s audit-trail path read the same `inspectDispatch` output, this one shared-lib change closes both the authorization-deny bypass and the cross-runtime audit gap.

### Files Confirmed (not modified by this phase)

| File | State observed | Role in this record |
|------|-----------------|----------------------|
| `.opencode/hooks/dispatch/lib/dispatch-audit.mjs` | Modified, uncommitted | Contains the fix (`directExecutor()` lines 186-197). |
| `.opencode/hooks/dispatch/lib/dispatch-audit.test.mjs` | Modified, uncommitted | Contains the 4 new `inspectDispatch` rows + 1 new `matchDispatchShape` test. |
| `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts` | Modified, uncommitted | Contains the `kind === "none"` short-circuit the bypass exploited (line 243). |
| `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts` | Untracked, uncommitted | Pi factory/deny-matrix suite; benefits from the fix via `inspectDispatch` without needing a dedicated new test row. |
| `.opencode/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/cli-dispatch-preflight-authorization.md` | Present, 11414 bytes | Cross-runtime manual-testing scenario authored separately by the orchestrator. |
| `.opencode/skills/cli-external-orchestration/feature-catalog/cli-dispatch-authorization/cli-dispatch-authorization.md` | Present, 5386 bytes | Cross-runtime feature-catalog entry authored separately by the orchestrator. |

### Files Created By This Phase

| File | Action | Purpose |
|------|--------|---------|
| `spec.md` | Created | Root cause, fix, scope, and explicit R2-P1-002/R2-P1-003 deferral. |
| `plan.md` | Created | Verification-first plan and affected-surfaces table. |
| `tasks.md` | Created | Command-backed task evidence, T001-T013. |
| `checklist.md` | Created | P0/P1/P2 verification gates with evidence rows. |
| `implementation-summary.md` | Created | This document. |
| `description.json` | Created (script-generated) | Generated via `generate-description.js`; see Verification below. |
| `graph-metadata.json` | Created (script-generated) | Generated via `backfill-graph-metadata.js`; see Verification below. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The finding text, file, and line for R1-P1-001, R2-P1-002, and R2-P1-003 were read directly from `../review/deep-review-findings-registry.json` (parked deep-review session `review-1785915676506`). The fix location was confirmed by reading the current `directExecutor()` source and the Pi preflight consumer's `kind === "none"` short-circuit. The three focused test suites and a whole-directory sweep were then re-run independently during this phase's authoring (not copied from an earlier phase's summary), and the two cross-runtime documentation artifacts were confirmed present with `ls -la`. The uncommitted state of the four fix files was captured verbatim with `git status --porcelain` so the claim of "already fixed" is distinguishable from "already committed."
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Record the fix without committing it | This phase's write boundary is documentation only; committing is a separate git action requiring an explicit operator go-ahead per the project's push/commit discipline. |
| Re-run all three focused suites fresh rather than cite the dispatch-provided counts | An independently reproduced result is stronger evidence than a restated claim, and the counts matched exactly (356/356, 32/32, 7/7), confirming the dispatch description was accurate. |
| Treat the whole-directory sweep's 1 failed *file* as expected, not a regression | `dispatch-rule-checks.test.mjs` uses `node:test` syntax and is not Vitest-collectible; its `node --test` run (CHK-022) independently confirms 7/7 pass, so the sweep's file-level failure is a tooling-boundary artifact, not a test failure. |
| Name R2-P1-002 and R2-P1-003 in every scope-bearing document, not just once | A reader who only opens `checklist.md` or only `spec.md` must still see the same deferred disposition; omitting it from any one document would risk it being read as silently dropped. |
| Do not build an independent in-process harness for `shouldDenyPiDispatch` | The existing Pi preflight suite already contains named, passing tests for the exact self-dispatch and quoted-mention scenarios (`cli-pi self-recursion`, `quoted mode mention`, `denies self-dispatch before an override can apply`); re-running that suite is equivalent evidence without duplicating a TypeScript-import harness for a module the suite already exercises end-to-end. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

### Evidence Ledger

| Evidence class | Boundary and named cases | Authoritative command | Observed result |
|----------------|---------------------------|------------------------|------------------|
| Root-cause/fix citation | `directExecutor()` lines 186-197; no blanket quoted-executor guard; `EXECUTOR_BASENAMES` set at line 41. | `grep -n "quoted\|EXECUTOR_BASENAMES\|directExecutor" .opencode/hooks/dispatch/lib/dispatch-audit.mjs` | Confirmed by direct read; guard absent, basename-set membership present. |
| Consumer short-circuit citation | Pi `tool_call` handler's `kind === "none"` early return. | `grep -n 'kind === "none"' .opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts` | Confirmed at line 243. |
| Shared inspector suite | `matchDispatchShape`/`inspectDispatch` direct/prose/quoted/ambiguous/malformed rows, including the 4 new quoted-executor rows and 1 new quote-safe `matchDispatchShape` test. | `npx vitest run .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs --reporter=dot` | PASS, 8 test files, 356/356 tests, exit 0. |
| Pi preflight suite | Deny matrix + registered `input`/`tool_call` factory boundary, including quoted self-dispatch and quoted-mention denial cases. | `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` | PASS, 1 test file, 32/32 tests, exit 0. |
| Node rule suite | Hard-rule parsing, check-id mapping, fail-open behavior. | `node --test .opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | PASS, 7/7 tests, exit 0. |
| Whole-`dispatch/`-directory sweep | Every Vitest-collectible file under `.opencode/hooks/dispatch`, worktree mirrors excluded. | `npx vitest run .opencode/hooks/dispatch --reporter=dot --exclude "**/.worktrees/**"` | 1 failed file (expected: `dispatch-rule-checks.test.mjs`, `node:test`-format, not Vitest-collectible) \| 2 passed files; 102/102 tests passed, 0 failed. Combined with the Node rule suite result above, 0 tests fail anywhere under `.opencode/hooks/dispatch`. |
| Cross-runtime documentation artifacts | Manual-testing-playbook scenario + feature-catalog entry. | `ls -la .opencode/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/cli-dispatch-preflight-authorization.md .opencode/skills/cli-external-orchestration/feature-catalog/cli-dispatch-authorization/cli-dispatch-authorization.md` | Both present: 11414 bytes and 5386 bytes respectively. |
| Working-tree state of the fix | Uncommitted-state disclosure for the four fix files. | `git status --porcelain -- .opencode/hooks/dispatch` | ` M .opencode/hooks/dispatch/lib/dispatch-audit.mjs`<br>` M .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs`<br>` M .opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts`<br>`?? .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:claim-audit -->
## Claim-to-Command Audit

| Dispatch-provided claim | Independently confirmed? | Command or artifact |
|---------------------------|---------------------------|----------------------|
| Blanket `if (executable.quoted) return null;` guard removed | Confirmed by direct read; guard absent, replaced by exact basename-set membership. | `dispatch-audit.mjs:186-197` |
| 4 `inspectDispatch` rows + 1 `matchDispatchShape` test added | Confirmed by direct read: `quote-safe executor`, `quote-safe path executor`, `quoted executor without print flag`, `quoted executor as an argument stays prose` (lines 75-78); `records a quote-safe command-position executor as a direct dispatch` (line 41). | `dispatch-audit.test.mjs:41-44,73-78` |
| Shared inspector suite 356/356 passed | Confirmed by fresh run in this phase (identical count). | `npx vitest run .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs --reporter=dot` |
| Pi preflight suite 32/32 passed | Confirmed by fresh run in this phase (identical count). | `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` |
| Whole `.opencode/hooks/dispatch` dir fail 0 | Confirmed with a caveat: the sweep reports 1 failed *file* due to a `node:test`/Vitest collection mismatch on `dispatch-rule-checks.test.mjs`, not a test failure; that file independently passes 7/7 under its correct runner (`node --test`). 0 tests fail anywhere in the directory. | `npx vitest run .opencode/hooks/dispatch --reporter=dot --exclude "**/.worktrees/**"` + `node --test .opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` |
| "3 assertions FAILED pre-fix (classified none/null)" | Not independently reproduced by this phase — reproducing it would require temporarily reverting the fix, which is outside this phase's documentation-only, no-code-modification boundary. Recorded here as the dispatch-provided claim, not re-derived. | N/A (reported, not re-verified) |
| Real deny-gate in-process harness results (`"devin" -p task` -> denied=true/false by user-text override; `"pi" --offline -p x` self-dispatch -> denied=true) | Equivalent coverage independently confirmed via the existing named Pi preflight tests rather than a new standalone harness: `cli-pi self-recursion` (line 118), `quoted mode mention` (line 120), `denies self-dispatch before an override can apply` (line 170) — all passing under the 32/32 suite result above. | `dispatch-preflight-lint.test.ts:118,120,170` + suite run above |
<!-- /ANCHOR:claim-audit -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The fix is uncommitted.** `git status --porcelain` shows all four dispatch files as locally modified/untracked at authoring time. This phase records the fix as applied-in-working-tree, not as shipped-on-a-commit. Committing is an operator-approved follow-up action, not performed by this phase.
2. **R2-P1-002 (receipt MAC advisory) is unresolved and out of scope.** File: `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts:771`. This phase did not open that file for edit. A separate `system-deep-loop` packet owns its remediation.
3. **R2-P1-003 (dirty-path containment) is unresolved and out of scope.** File: `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:265`. This phase did not open that file for edit. A separate `system-deep-loop` packet owns its remediation.
4. **The negative-control claim (3 pre-fix failing assertions) was reported, not independently reproduced**, because reproducing it would require reverting the shared-lib fix, which this documentation-only phase is not authorized to do.
5. **The parent packet's Phase Documentation Map in `../spec.md` was not updated** to list this Phase 10, per the dispatch instruction to write only inside this phase's own folder.

### Rollback boundary

Revert only this phase's own five Markdown files and two generated metadata files if a citation is found wrong. Never edit `.opencode/hooks/dispatch/**`, `.opencode/skills/system-deep-loop/**`, or `../review/**` from inside this phase.

### Safe continuation point

The next safe actions are (a) an explicit, separately-approved commit of the four uncommitted dispatch files, and (b) opening a new `system-deep-loop`-scoped packet for R2-P1-002 and R2-P1-003. Neither action was taken by this phase.
<!-- /ANCHOR:limitations -->
