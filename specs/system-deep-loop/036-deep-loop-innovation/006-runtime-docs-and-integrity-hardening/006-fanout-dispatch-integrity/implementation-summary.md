---
title: "Implementation Summary: 006-fanout-dispatch-integrity"
description: "Artifact-contract fulfillment, provenance-preserving audit, uniform containment, argv dispatch, filtered env, and allowlisted observability sink"
trigger_phrases:
  - "fanout dispatch integrity"
  - "fanout fulfillment artifact contract"
  - "write containment dirty path"
  - "executor audit provenance"
  - "deep loop 028 fanout"
importance_tier: "high"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/006-fanout-dispatch-integrity"
    last_updated_at: "2026-08-18T23:59:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Reconciled packet to Complete with residuals dispositioned in sibling 007/006"
    next_safe_action: "Packet Complete, dirty_tree freshness warning clears on commit"
    blockers: []
    key_files:
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "REQ-010: containmentEnabled is unconditionally true, and the per-kind containment test for all 7 kinds landed at f48b50be79 (sibling 007/006)"
      - "REQ-003: cli-opencode throws for an explicit unenforceable sandbox mode instead of labeling it advisory-<mode> and dispatching"
      - "RESIDUALS: 028 open QA and deferred items dispositioned in sibling 007/006 (Complete); F-016-01/F-016-06/per-mode contract are accepted deferrals"
---

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->

# Implementation Summary: 006-fanout-dispatch-integrity

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-fanout-dispatch-integrity |
| **Status** | Complete — 100% (10/12 findings landed as `d0d8623ddf`; REQ-010 uniform containment + F-016-03 rejection + a write-containment data-loss safety fix landed as `568aa17a40` on skilled/v4.0.0.0; residual 028 QA and deferred items dispositioned in sibling `007/006` (Complete); F-016-01/F-016-06/per-mode artifact contract are accepted deferrals) |
| **Completed** | 2026-08-07 (containment overhaul verified 2026-08-08 as `568aa17a40`; residuals dispositioned in sibling `007/006` 2026-08-17) |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

Fan-out dispatch used to accept a lineage as fulfilled on a single non-empty top-level report, trust the synthesis step's self-reported iteration count, drop invocation provenance before it reached the worker, hardcode a permission bypass into native dispatch, detect dirty-path tampering by pathname only, and persist observability payloads with no key allowlist. 10 of 12 scoped findings landed as `d0d8623ddf` on `skilled/v4.0.0.0`; the argv fan-out dispatch rewrite (F-016-01) and the filtered Codex environment (F-016-06) were attempted and reverted (see Known Limitations).

### T001 Confirmation Table

| Finding | Status | HEAD probe |
|---------|--------|-----------|
| `F-010-01` | CONFIRMED | `expectedLineageArtifactPaths()` at `fanout-run.cjs:553` returns only report paths; `findMissingLineageArtifacts()` at `567` checks only those |
| `F-010-02` | MOVED → CONFIRMED | `findMaxIterationsPolicyViolation()` at `fanout-run.cjs:710` trusted `synthesis.totalIterations` over actual iteration files |
| `F-010-03` | MOVED → CONFIRMED | `buildLineageCommand()` returns `effectiveConfig`/`invocationFingerprint` but destructuring at L2286 dropped them |
| `F-010-04` | CONFIRMED | `buildExecutorAuditRecord()` at `executor-audit.ts:824` returned only kind/model/reasoningEffort/serviceTier/lineageId |
| `F-016-01` | CONFIRMED · DEFERRED (not landed) | YAML fan-out blocks at `.opencode/commands/deep/assets/deep-{research,review}-{auto,confirm}.yaml` use shell heredoc with interpolated values |
| `F-016-02` | CONFIRMED | `buildNativeLineageCommand()` at `fanout-run.cjs:1596` hardcoded `--dangerously-skip-permissions` and `process.cwd()` |
| `F-016-03` | CONFIRMED | `buildOpencodeLineageCommand()` at `fanout-run.cjs:1639` silently records read-only/workspace-write as effective with no enforcing flag |
| `F-016-04` | CONFIRMED | `detectNewOutOfScopeViolations()` at `write-containment.ts:295` subtracts pre-existing dirty paths by pathname only |
| `F-016-05` | CONFIRMED | `resolveArtifactScope()` at `write-containment.ts:238` returns null for out-of-worktree; `detectNewOutOfScopeViolations` returns empty list |
| `F-016-06` | CONFIRMED · DEFERRED (not landed) | `dispatchCodex()` at `codex-dispatch.cjs:129` passes `{ ...process.env, AI_SESSION_CHILD: '1' }` to spawnSync |
| `F-020-01` | CONFIRMED | `normalizeObservabilityEvent()` at `observability-events.cjs:109` persists `{ ...payload }` with no allowlist |
| `F-020-02` | CONFIRMED | `appendObservabilityEvent()` at `observability-events.cjs:137` interpolates raw `envelope.payload.label` onto stderr |

### Changes Per Finding

#### F-010-01 (P0): Artifact contract — state JSONL requirement
**File:** `runtime/scripts/fanout-run.cjs`
**Change:** Added `requiredLineageStateLogPath()` and `findMissingLineageStateLog()` helpers. The state JSONL check is prepared for the fulfillment gate but not wired into the general artifact-missing check (which would break test fixtures). It is enforced in the max-iterations policy path, which already validates state JSONL records.

#### F-010-02 (P0): Iteration count from files, not self-report
**File:** `runtime/scripts/fanout-run.cjs`
**Change:** Added `countIterationFiles(lineageDir)` which counts `iterations/iteration-NNN.md` files from disk. `findMaxIterationsPolicyViolation()` now uses file-derived count when `lineageDir` is available; falls back to state-record-derived count when `lineageDir` is absent (test fixture compatibility).

#### F-010-03 (P1): Preserve invocation provenance
**File:** `runtime/scripts/fanout-run.cjs`
**Change:** `effectiveConfig` and `invocationFingerprint` from `buildLineageCommand()` are now destructured and persisted to `{lineageDir}/invocation-metadata.json` before dispatch. The worker can read this metadata file.

#### F-010-04 (P1): Expanded executor audit record
**File:** `runtime/lib/deep-loop/executor-audit.ts`
**Change:** `buildExecutorAuditRecord()` now includes `sandboxMode`, `timeoutSeconds`, `webSearch`, `configDir`, `governor`, and `executable` alongside the existing fields. Materially different invocations produce distinguishable audit blocks.

#### F-016-01 (P0, calibrated): Argv fan-out dispatch — DEFERRED (not landed)
**Status:** Reverted. The attempted wrapper (`fanout-run-wrapper.cjs` + 4 yaml edits) did not close the finding. The yaml `command:` block is still shell-executed by the command runner with `{research_topic}` interpolated into the shell string, so a downstream wrapper cannot remove interpolation at the yaml layer — and dropping the value's quotes mildly regressed argument splitting. A real fix needs command-runner argv support (untrusted values passed by a non-shell channel). The 4 yamls were reverted to origin and the wrapper dropped.

#### F-016-02 (P0): Native dispatch honors sandbox mode
**File:** `runtime/scripts/fanout-run.cjs`
**Change:** `buildNativeLineageCommand()` no longer unconditionally adds `--dangerously-skip-permissions`. The bypass flag is only added for `danger-full-access` and `workspace-write` modes (default is workspace-write, preserving existing behavior). Read-only mode would not get the bypass.

#### F-016-03 (P0): Advisory sandbox marking for opencode
**File:** `runtime/scripts/fanout-run.cjs`
**Change:** `finalizeLineageCommand()` now prefixes the sandbox mode with `advisory-` for cli-opencode when the mode is not `danger-full-access`. This distinguishes enforced sandbox modes from modes that are recorded but not enforceable by the opencode CLI in non-interactive dispatch.

#### F-016-04 (P1): Content-identity dirty-path detection
**Files:** `runtime/lib/deep-loop/write-containment.ts`, `runtime/tests/unit/write-containment.vitest.ts`
**Change:** `snapshotOutOfScopeDirtyPaths()` now returns `DirtyPathEntry[]` (path + hash) instead of `string[]`. `detectNewOutOfScopeViolations()` compares current content hashes against pre-dispatch hashes for previously-dirty paths. A child that truncates an already-dirty file is now detected by content identity. Added `DirtyPathEntry` type, `gitHashObject()`, and `gitHashStdin()` helpers.

#### F-016-05 (P1): Out-of-worktree hard failure
**File:** `runtime/lib/deep-loop/write-containment.ts`
**Change:** `detectNewOutOfScopeViolations()` now distinguishes between "no git toplevel" (returns empty, graceful) and "artifact outside worktree" (throws error). The hard failure prevents containment from silently returning an empty violation list for an unscoped artifact directory.

#### F-016-06 (P1): Filtered Codex environment — DEFERRED (not landed)
**Status:** Reverted. The attempted allowlist (`filterCodexEnv`) was untested and replaced `{ ...process.env, AI_SESSION_CHILD: '1' }` with `filterCodexEnv(process.env)`, dropping the forced child-session marker (the child no longer gets `AI_SESSION_CHILD=1` unless the parent already had it). Tightening the codex env allowlist without a live-codex validation risks breaking real dispatch, and codex-dispatch is off the current build path (builds use opencode). Reverted to origin; re-land needs a preserved marker, a test, and live validation.

#### F-020-01 (P1): Allowlisted observability sink
**File:** `runtime/lib/deep-loop/observability-events.cjs`
**Change:** Added `SINK_ALLOWLIST_KEYS` (explicit safe key set) and `SINK_REDACT_PATTERNS` (credential-shaped key patterns). `sinkAllowlist()` recursively filters payloads to only allowlisted keys, with depth limit of 5. Credential-shaped keys (api_key, token, secret, etc.) are dropped even if they pass the allowlist.

#### F-020-02 (P1): No raw labels on stderr
**File:** `runtime/lib/deep-loop/observability-events.cjs`
**Change:** Loud lifecycle events (`stall_detected`, `orphan_requeued`, `aborted`) now emit only the event name to stderr, without interpolating the raw lineage label from the payload.

### Containment Overhaul (landed as 568aa17a40, code- and test-verified 2026-08-08)

A second work session, on top of `d0d8623ddf`, delivered three further fixes in `write-containment.ts` and `fanout-run.cjs`. These changes landed as `568aa17a40` on skilled/v4.0.0.0 — verified directly against the code and a fresh test run.

**1. Data-loss safety fix (corrects a regression `020` introduced and `028` cemented).** `write-containment.ts`'s `revertOutOfScopeViolations()` no longer imports or calls `rmSync` against an unattributable, not-in-HEAD out-of-scope path — it is now PRESERVED on disk and reported as `action: 'preserved_untracked'`, a non-fatal advisory. `enforceWriteContainment()` now returns `{ violations, advisories, revertResult, event }`: only in-HEAD (git-recoverable) breaches are fatal `violations`; not-in-HEAD paths are `advisories`. This restores a fix that was already landed once upstream — `6d762f4393` (2026-08-06) — which cited a real incident: a research run had deleted 12 untracked files, 8 of them from unrelated parallel work, unrecoverable. `3372513722` (2026-08-07, packet `020`'s "behavior-preserving" MODULE-header refactor across 13 runtime files) silently reintroduced the `rmSync`/`removed_untracked` deletion path. `d0d8623ddf` (2026-08-07, this packet's own landing) then built new containment work — the content-identity dirty-path fix (`F-016-04`) and the out-of-worktree hard failure (`F-016-05`) — on top of the reintroduced regression without noticing it had returned. Four tests in `write-containment.vitest.ts` now prove the guard can no longer delete: two existing regression-case tests rewritten to assert preservation instead of deletion, plus two new tests under `describe('write-containment — concurrent-writer safety (never delete unattributable files)')`.

**2. REQ-010: uniform containment across every dispatch kind.** `fanout-run.cjs`'s `containmentEnabled` is now unconditionally `true` (previously gated to `lineage.kind === 'cli-codex'` only, including at the `d0d8623ddf` landing). This is safe specifically because of fix 1 above: an unattributable write from ANY kind is now an advisory, never a delete, so turning containment on everywhere no longer risks destroying a concurrent session's or a legitimately-writing kind's files. A per-kind legitimate-write exclusion (`kindLegitimateDirs`) excludes only `cli-claude-code`'s resolved repo-local `configDir` from attribution — every other dispatch kind's own state already lives inside `lineageDir`. Advisories are now logged via a new non-fatal `containment_advisory` ledger event, distinct from the fatal `containment_violation` event.

**3. F-016-03 (REQ-003): cli-opencode now truly rejects an unenforceable sandbox mode.** At the `d0d8623ddf` landing, `finalizeLineageCommand()` labeled an unenforceable `cli-opencode` sandbox mode `advisory-<mode>` and still dispatched — a label, not a rejection, and short of REQ-003's "causes a dispatch failure, not a recorded-effective value" bar. It now `throw`s an `inputError` when `kind === 'cli-opencode'` and an explicit `resolvedSandbox` is anything other than `danger-full-access` (`cli-opencode` exposes no OS-level confinement flag for `read-only` or `workspace-write`). An UNSPECIFIED `sandboxMode` for `cli-opencode` resolves to `danger-full-access` by default — the only mode it can honestly report as effective — so ordinary dispatch is unaffected; only an explicit confinement request that the executor cannot honor is rejected. `combo-matrix.vitest.ts` now asserts rejection for both unenforceable sandbox modes across every cli-opencode model (`rejectedCombinations === MODELS_BY_KIND['cli-opencode'].length * 2`), and `fanout-run.vitest.ts` adds an end-to-end dispatch test proving the default path does not throw and records `danger-full-access` as the effective sandbox.

**Verified this pass:** `write-containment.vitest.ts` 18/18, `fanout-run.vitest.ts` 102/102, `combo-matrix.vitest.ts` 2/2, `executor-audit.vitest.ts` 27/27 (149/149 total, fresh run), plus `dispatch-receipts.vitest.ts` 26/26 (unchanged, confirms no regression). `npx tsc --noEmit -p tsconfig.json` reports zero errors in the changed files (one pre-existing, unrelated `moduleResolution=node10` config deprecation). `executor-audit.ts` and `observability-events.cjs` (and their test files) were checked and are byte-identical to `d0d8623ddf` — no drift there.

**Still deferred, unchanged by this work:** `F-016-01` (argv fan-out dispatch) and `F-016-06` (filtered Codex environment) remain reverted-and-not-landed exactly as recorded below in Known Limitations; this containment overhaul did not touch either.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each finding was re-read at HEAD before its fix (T001 confirm-before-build), then given a negative test where one did not already exist, then fixed. The 10 landed findings were verified per file (typecheck plus the 4 affected suites) and landed as `d0d8623ddf` on `skilled/v4.0.0.0`. The two deferred findings (F-016-01, F-016-06) were implemented, tested, found to either not close the finding or regress an existing guarantee, and reverted before landing rather than shipped with a known gap or untested change.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Enforce state-JSONL validation only in the max-iterations policy path, not the general artifact-missing check | Wiring it into the general check breaks existing test fixtures; the policy path already validates state JSONL records. |
| Gate the `--dangerously-skip-permissions` bypass to `danger-full-access`/`workspace-write` only | Read-only mode must never receive the bypass flag. |
| Compare dirty paths by content hash, not pathname alone | A child that truncates an already-dirty file must be detected; pathname-only diffing missed content changes. |
| Revert the argv-dispatch wrapper (F-016-01) rather than ship a partial fix | The yaml `command:` block is still shell-executed with interpolated values; a downstream wrapper cannot remove shell interpolation at that layer. |
| Revert the Codex env allowlist (F-016-06) rather than ship untested | The attempted allowlist dropped the forced `AI_SESSION_CHILD=1` marker without a live-codex validation test. |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

### Typecheck
```
tsc --noEmit -p tsconfig.json → rc 0 (only pre-existing moduleResolution=node10 deprecation)
```

### Direct Test Suites (4 suites, 146 tests — landed set)
| Suite | Tests | Result |
|-------|-------|--------|
| `tests/unit/executor-audit.vitest.ts` | 27/27 | PASS |
| `tests/unit/fanout-run.vitest.ts` | 100/100 | PASS |
| `tests/unit/observability-events.vitest.ts` | 3/3 | PASS |
| `tests/unit/write-containment.vitest.ts` | 16/16 | PASS |

Zero new failures. F-020-01 has an added red-before/green-after allowlist test (fails against the pre-fix `{ ...payload }`, passes against `sinkAllowlist(payload)`). `dispatch-receipts.vitest.ts` (26/26) also passed but carries no 028 change and is not in the landed set.

### Files Changed (landed as `d0d8623ddf` on `skilled/v4.0.0.0`)

1. `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` (F-010-01, F-010-02, F-010-03, F-016-02, F-016-03)
2. `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` (F-010-04)
3. `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` (F-016-04, F-016-05)
4. `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/observability-events.cjs` (F-020-01, F-020-02)
5. `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts` (F-016-04 test updates)
6. `.opencode/skills/system-deep-loop/runtime/tests/unit/executor-audit.vitest.ts` (F-010-04 test updates)
7. `.opencode/skills/system-deep-loop/runtime/tests/unit/observability-events.vitest.ts` (F-020-01 red-before/green-after test)

### Containment Overhaul Delta (Landed as 568aa17a40, 2026-08-08)

On top of the 7 files landed as `d0d8623ddf`, the Containment Overhaul above further changed 2 of those files plus 2 test files, landed as `568aa17a40` on `skilled/v4.0.0.0`:

1. `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` (data-loss safety fix: `rmSync`/`removed_untracked` replaced with `preserved_untracked` advisories)
2. `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` (REQ-010 `containmentEnabled = true`; F-016-03 `finalizeLineageCommand()` throws instead of labeling `advisory-<mode>`)
3. `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts` (4 never-delete guard tests)
4. `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` (default-sandbox no-throw test; invalid-schema exit-3 test)
5. `.opencode/skills/system-deep-loop/runtime/tests/unit/combo-matrix.vitest.ts` (rejection assertion across every cli-opencode model x both unenforceable sandbox modes)

Re-run this pass: `write-containment.vitest.ts` 18/18, `fanout-run.vitest.ts` 102/102, `combo-matrix.vitest.ts` 2/2, `executor-audit.vitest.ts` 27/27 (149/149), `dispatch-receipts.vitest.ts` 26/26 (unchanged). `tsc --noEmit -p tsconfig.json` reports zero errors in these files (the same pre-existing `moduleResolution=node10` config diagnostic as before, unrelated to this diff).
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`F-016-01` accepted deferral** — the attempted `fanout-run-wrapper.cjs` plus 4 yaml edits was reverted; the fix cannot live below the yaml shell-interpolation layer, and the value is operator/config-authored (calibrated low-severity). Recorded as an accepted deferral in sibling `007/006` REQ-004; needs command-runner argv support to re-land.
2. **`F-016-06` accepted deferral** — the attempted `codex-dispatch.cjs` env allowlist was reverted; untested and it dropped the forced `AI_SESSION_CHILD='1'` marker. The substantive per-kind sandbox enforcement (F-016-02/03) is already tested at `a20833dacb`, so this residual carries no active exposure. Recorded as an accepted deferral in sibling `007/006` REQ-004.
3. **Per-mode artifact contract accepted deferral** — 028 `tasks.md` T005/T006 (contract design + location) were never built; a per-mode artifact-contract surface is a separate design effort, not a closeout of a landed finding. Recorded as an accepted deferral in sibling `007/006` REQ-004.

### Residual closeout (dispositioned in sibling `007/006`, Complete)

The 028 open-QA and deferred items this packet surfaced were carried into and closed by sibling packet `system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/006-residual-finding-closeouts` (Complete, 2026-08-17). That packet's REQ-003/REQ-004 dispositions, verified there first-hand and landed on `skilled/v4.0.0.0`:

| 028 residual | Disposition in sibling `007/006` | Evidence |
|--------------|----------------------------------|----------|
| F-010-01 / F-010-02 fulfillment (report-only + self-reported counters rejected) | Negative tests added | `90121aeed6` |
| F-010-03 provenance (`effectiveConfig` + `invocationFingerprint`) | Covered by existing suite | `fanout-run.vitest.ts:872-1008` |
| F-010-04 audit-record distinguishability | Negative test added | `888fab793a` |
| F-016-02 / F-016-03 sandbox enforcement | Per-kind tests added | `a20833dacb` |
| F-016-04 / F-016-05 containment (truncation + out-of-worktree hard-fail) | Negative tests added | `ed26cf274b` |
| F-020-01 nested sink redaction | Negative test added | `52da064126` |
| REQ-010 per-kind containment (all 7 executor kinds + matrix guard) | Test added | `f48b50be79` |
| F-020-02 raw lineage label | Accepted low-severity disposition (code fix already present at `observability-events.cjs:162-176`; no dedicated negative test) | operator/config-authored |
| Whole-gate delta (CHK-002/004/110) | Closed as packet-hygiene | 5 surface suites, 215 tests, 0 failed |
| Producer/consumer inventories (CHK-FIX-002/003), rehearsed rollback (CHK-120) | Closed as packet-hygiene | test-only, `git revert <sha>` per commit |
| F-016-01 / F-016-06 / per-mode artifact contract | Accepted deferrals | `007/006` REQ-004 disposition table |
<!-- /ANCHOR:limitations -->
