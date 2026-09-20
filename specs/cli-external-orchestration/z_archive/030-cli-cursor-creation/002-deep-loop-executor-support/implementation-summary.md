---
title: "Implementation Summary: Cursor deep-loop executor support"
description: "cli-cursor added as a typed deep-loop executor kind across executor-config.ts, executor-audit.ts, fanout-run.cjs, dispatch-model.cjs, and profile-validator.cjs, with a fail-closed buildCursorLineageCommand adapter."
trigger_phrases: ["cli-cursor deep-loop executor summary", "cli-cursor executor support implementation"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/002-deep-loop-executor-support"
    last_updated_at: "2026-07-24T09:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Implemented, tested, and validated phase 002 (cli-cursor executor wiring)"
    next_safe_action: "Begin phase 003 (cli-cursor skill packet)"
    blockers: []
    key_files: ["../../../../.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts", "../../../../.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts", "../../../../.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-implementation", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: ["Cursor's session-id env var is CURSOR_CONVERSATION_ID (live-verified).", "The SandboxMode -> Cursor approval-flag mapping is read-only->ask (unflagged default), workspace-write->auto-review, danger-full-access->force.", "reasoningEffort-via-model-bracket does NOT work on the live CLI (rejected outright); reasoningEffort is unsupported for cli-cursor instead."]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- ANCHOR:metadata -->
## METADATA
| Field | Value |
|---|---|
| **Spec Folder** | 002-deep-loop-executor-support |
| **Completed** | 2026-07-24 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## WHAT WAS BUILT

`cli-cursor` is now a real, dispatchable deep-loop executor kind, widened across the 5 hand-synced files the parent packet named, plus 2 new exports in `executor-config.ts`. All three of phase 002's open unknowns were resolved with live evidence (not TBD) because `cursor-agent login` was completed by the operator mid-session.

### executor-config.ts
- `EXECUTOR_KINDS` grew from 4 to 5 members: `['native', 'cli-codex', 'cli-claude-code', 'cli-opencode', 'cli-cursor']`.
- `EXECUTOR_KIND_FLAG_SUPPORT['cli-cursor'] = ['model', 'sandboxMode', 'timeoutSeconds', 'liveTools']` — no `reasoningEffort` (see below), no `configDir` (no confirmed Cursor CLI flag isolates the shared `.cursor/` config dir), no `serviceTier` (no documented flag).
- `EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX['cli-cursor'] = { inherit: true, disabled: false, cached: false, live: false }` — mirrors `cli-claude-code`'s flag-less shape; `cursor-agent --help` has no web-search flag (checked live).
- New `CURSOR_SUPPORTED_MODELS = ['auto', 'composer-2.5', 'composer-2.5-fast']` + `CursorSupportedModel` type — all 3 ids confirmed live via `cursor-agent --list-models` (authenticated, account `mkerkmeester@proton.me`, Pro tier). Not exhaustive by design (the live roster has 150+ ids); this is a typo-checked reference to the router default and the Cursor-native model only.
- New `CursorApprovalMode = 'ask' | 'auto-review' | 'force'` type + `resolveCursorApprovalMode()` function, mapping the generic `SandboxMode` to Cursor's real approval flags.

### executor-audit.ts
- `EXECUTOR_BINARY_BY_KIND['cli-cursor'] = 'cursor-agent'` (canonical, not the `agent` alias).
- `EXECUTOR_SESSION_ENV_BY_KIND['cli-cursor'] = 'CURSOR_CONVERSATION_ID'` — **confirmed live**, not deferred: a scratch `cursor-agent -p --force` dispatch asked the agent to `env | grep -i cursor`, which surfaced `CURSOR_CONVERSATION_ID` (matching the `--output-format json` `session_id` field exactly), plus `CURSOR_AGENT=1`, `CURSOR_INVOKED_AS=cursor-agent`, `CURSOR_RIPGREP_PATH`.
- `EXECUTOR_STATE_ENV_BY_KIND['cli-cursor'] = ['SPECKIT_CURSOR_STATE_DIR']` — repo-owned only; no `CURSOR_HOME`-style override exists in `cursor-agent --help` (checked live), so none was invented.
- `EXECUTOR_DEFAULT_HOME_DIR_BY_KIND['cli-cursor'] = '.cursor'`.
- `EXECUTOR_ENV_PREFIXES_BY_KIND['cli-cursor'] = ['CURSOR_']`.
- These rows automatically extend the existing kind-generic `validateExecutorDispatchAllowed()` self-invocation recursion guard (ancestry/env/lockfile layers) to `cli-cursor` at no extra cost — this is the runtime-layer safety net, distinct from the packet-owned skill-level self-invocation guard design phase 003 still owns.

### fanout-run.cjs
- `SPECKIT_STATE_ENV_BY_KIND['cli-cursor'] = 'SPECKIT_CURSOR_STATE_DIR'`.
- New `isCursorBinaryAvailable(env)` — `command -v cursor-agent` preflight, mirrors `isCodexBinaryAvailable` exactly.
- New `buildCursorLineageCommand(lineage, prompt, resolvedSandbox, resolvedPermission, options)`, registered in `LINEAGE_COMMAND_ADAPTERS`. Fails closed via `isCursorBinaryAvailable` before constructing any command. Builds `cursor-agent -p "<prompt>" --output-format text --model <id> [--force|--auto-review] --sandbox <enabled|disabled>` (no flags at all for the `read-only` case beyond `--sandbox enabled` — see approval mapping below). Prompt is a positional arg (`promptArgIndexes: [1]`, `input: undefined`), same convention as `buildClaudeLineageCommand`; the generic spawn layer already sets `stdio[0]: 'ignore'` when `input` is unset, which is the `</dev/null`-equivalent behavior REQ-006 asked to verify — confirmed live (a real `cursor-agent -p ... </dev/null` dispatch completed normally, no hang).
- The approval-flag mapping is inlined in the adapter (not imported from `executor-config.ts`), intentionally mirroring `resolveCursorApprovalMode()` rather than calling it — consistent with how `buildCodexLineageCommand`/`buildOpencodeLineageCommand` already derive their own kind-specific flags directly from the `resolvedSandbox` parameter rather than calling a shared resolver. `resolveCursorApprovalMode()` stays independently exported and independently unit-tested per REQ-003.
- Exported `isCursorBinaryAvailable` alongside `isCodexBinaryAvailable` in `module.exports`.

### dispatch-model.cjs / profile-validator.cjs
- `dispatch-model.cjs`: `KNOWN_EXECUTORS` gains `'cli-cursor'`; new `buildSpawnSpec` `case 'cli-cursor'` builds `-p <prompt> --model <id> --output-format text [--auto-review]` (write-capable opt-in only), honoring `CURSOR_AGENT_BIN` env override matching the `OPENCODE_BIN`/`CLAUDE_BIN` pattern. `variant` is never forwarded (no flag exists for it — see below).
- `profile-validator.cjs`: `KNOWN_EXECUTORS` gains `'cli-cursor'` in the same commit, restoring parity for the new kind only (the sets' pre-existing divergence for other kinds, e.g. `native`/`cli-codex`, is untouched per the spec's explicit out-of-scope note).
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED
1. Re-read `../001-cursor-contract-pin/implementation-summary.md` for the confirmed flag surface.
2. Confirmed `cursor-agent login` was completed by the operator mid-session (`cursor-agent about` moved from "Not logged in" to `mkerkmeester@proton.me`, Pro tier) — this unlocked live resolution of all 3 open questions instead of leaving them TBD.
3. Live-probed the session-id env var by asking an authenticated `cursor-agent -p --force` dispatch to dump its own `CURSOR_`-prefixed environment.
4. Pulled the live model roster via `cursor-agent --list-models`/`models` (150+ ids) and selected the 3-id `CURSOR_SUPPORTED_MODELS` seed from confirmed output only.
5. Live-tested the parameterized `model[effort=...]` bracket against two real model ids — both rejected outright by the CLI ("Cannot use this model"), settling the reasoning-effort open question against the bracket approach.
6. Live-verified a full working dispatch shape (`-p ... --output-format text --model auto --auto-review --sandbox enabled`) and the `--force --sandbox disabled` + `</dev/null` combination.
7. Read the `027-cli-codex-revival` precedent (`buildCodexLineageCommand`/`isCodexBinaryAvailable`, `EXECUTOR_KIND_FLAG_SUPPORT`, `EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX`, the 4 hand-synced maps in `executor-audit.ts`, `KNOWN_EXECUTORS` in both model-benchmark files) as the structural mirror for every new row/function.
8. Implemented the 5 production-file changes, then the 4 test-file changes, following each existing kind's test pattern 1:1.
9. Ran strict typecheck (`npm run typecheck` in `runtime/`) — 0 errors.
10. Ran the 3 runtime Vitest files (`executor-config`, `executor-audit`, `fanout-run`) — 178/178 passed.
11. Ran `remediation.vitest.ts` — 24/25 passed; isolated the 1 failure via `git stash` (see Known Limitations) and confirmed it is pre-existing and unrelated.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## KEY DECISIONS
- **reasoningEffort is unsupported for `cli-cursor`, not bracket-based.** Live-tested `--model 'gpt-5.2[effort=high]'` and the exact doc-cited example `--model 'claude-opus-4-8[context=1m,effort=high,fast=false]'` — both rejected with "Cannot use this model" against the full enumerated id list. The CLI bakes effort into the model id suffix instead (`gpt-5.2-high`, `claude-opus-4-8-xhigh`, etc). `reasoningEffort` is omitted from `EXECUTOR_KIND_FLAG_SUPPORT['cli-cursor']`; callers select an effort-suffixed `model` id directly.
- **Approval-flag mapping**: `read-only` → the CLI's own unflagged prompt-and-block default (`ask`) rather than an explicit flag — Cursor has no read-only-specific flag, and its default already blocks writes pending approval nothing unattended can supply. `workspace-write` → `--auto-review` ("Smart Auto"). `danger-full-access` → `--force`/`--yolo` ("Run Everything"), matching the spec's own edge-case note. `--sandbox` tracks a parallel 2-way toggle: `enabled` for read-only/workspace-write, `disabled` only for danger-full-access.
- **`resolveCursorApprovalMode()` kept independent of `buildCursorLineageCommand`'s own inline mapping.** The two encode the same logic but are not wired together: `buildCursorLineageCommand` derives its flags directly from the already-resolved `resolvedSandbox` parameter (matching how the codex/opencode adapters already work, and remaining robust to direct-call tests that omit `options`), while `resolveCursorApprovalMode()` stays a standalone, independently-tested export satisfying REQ-003. A comment cross-references the two so a future reader does not mistake this for incidental drift.
- **Session-env var confirmed live, not deferred.** REQ-011 allowed deferring `EXECUTOR_SESSION_ENV_BY_KIND['cli-cursor']` until confirmed; since the operator completed `cursor-agent login` this session, it was confirmed directly (`CURSOR_CONVERSATION_ID`) rather than left unset.
- **Default model is `'auto'`** (lowercase, confirmed via `--list-models`), matching Cursor's documented router default.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## VERIFICATION
| Item | Result |
|---|---|
| `EXECUTOR_KINDS` contains `cli-cursor`; strict typecheck | PASS — `npm run typecheck` (runtime/) exits 0 |
| `buildLineageCommand({kind:'cli-cursor',...})` shape | PASS — matches confirmed `cursor-agent -p ... --output-format text --model ...` shape; live end-to-end dispatch also verified (not just unit test) |
| Fail-closed without `cursor-agent` on `PATH` | PASS — `buildCursorLineageCommand` throws `cli-cursor executor unavailable: command -v cursor-agent failed` before any spawn; test explicitly asserts this ignores the always-0 `-p` exit code |
| `dispatch-model.cjs` + `profile-validator.cjs` `KNOWN_EXECUTORS` parity for `cli-cursor` | PASS |
| Focused Vitest — `executor-config.vitest.ts` | PASS — included in 178/178 (3 runtime files) |
| Focused Vitest — `executor-audit.vitest.ts` | PASS — included in 178/178 |
| Focused Vitest — `fanout-run.vitest.ts` | PASS — included in 178/178 |
| Focused Vitest — `remediation.vitest.ts` | PARTIAL — 24/25; 1 pre-existing, unrelated failure (see Known Limitations) |
| Zero regressions in `native`/`cli-codex`/`cli-claude-code`/`cli-opencode` assertions | PASS — every hunk in the 5 production files is a pure addition (`git diff` reviewed); no existing row/case/line was modified or reordered |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS
1. **Pre-existing, unrelated test failure in `remediation.vitest.ts`**: `F-P1-1 > rejects a retired executor before spawn spec construction` uses `retiredKind = ['cli', 'opencode'].join('-')`, which literally evaluates to `'cli-opencode'` — an active, non-retired kind — so `buildSpawnSpec` never throws and the assertion fails. Confirmed via `git stash` isolation that this fails identically on `HEAD` before any phase-002 change touched either `dispatch-model.cjs` or this test file; it is unrelated to `cli-cursor` (its scope is the `cli-opencode` name) and out of this phase's scope per Scope Lock. Not fixed here; flagged for a future, separately-scoped fix.
2. `CURSOR_SUPPORTED_MODELS` is a 3-id reference (`auto`, `composer-2.5`, `composer-2.5-fast`), not the full live roster (150+ ids) — intentional per REQ-003's "explicitly extensible" instruction; the CLI accepts any valid `--model` id regardless of this list's contents.
3. The self-invocation guard *signal design* for `cli-cursor` at the skill-packet level (distinct from the runtime-layer `validateExecutorDispatchAllowed()` recursion guard this phase's map rows already extend to `cli-cursor`) remains phase 003's responsibility, as scoped.
<!-- /ANCHOR:limitations -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`
- `../001-cursor-contract-pin/implementation-summary.md`
