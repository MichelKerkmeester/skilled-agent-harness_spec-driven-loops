---
title: "Iteration 4: The five hook adapters against the core"
trigger_phrases: []
---
# Iteration 4: The five hook adapters against the core

## Focus

Read `runtime/lib/hooks/completion-evidence-sentinel.cjs`'s exported function signatures, then the completion-evidence adapter per runtime (claude, codex, cursor, devin, pi). An adapter that calls a function the core does not export, passes a request shape the core does not read, or documents a status the core no longer emits, is a finding.

## Actions Taken

1. Core inventory: `lib/hooks/completion-evidence-sentinel.cjs` (the only file in lib/hooks; grep treats it as binary — read with `grep -a`). Exports (lines 547-570): constants COMPLETION_CLAIM_PATTERN, SPEC_FOLDER_TEXT_PATTERN, STATE_DIR_RELATIVE_PATH, LOG_RELATIVE_PATH, KILL_SWITCH_ENV, CHECK_TIMEOUT_MS_ENV, LOG_MAX_BYTES_ENV, RETENTION_DAYS_ENV, SWEEP_INTERVAL_MS_ENV, DEFAULT_CHECK_TIMEOUT_MS, DEFAULT_RETENTION_DAYS, DEFAULT_SWEEP_INTERVAL_MS; functions detectCompletionClaim, resolveSpecFolderFromText, resolveSentinelPaths, evaluateCompletionEvidence, appendAdvisoryLog, sweepStaleSentinelState.
2. Core request/result contract (lines 483-545): reads only `request.env`, `request.claimText`, `request.specFolder`, `request.projectDir`; returns `{ decision: 'ok' | 'advise', detail, deduped }`; kill-switch early-returns `ok`; any internal error fails open to `ok`.
3. Adapters read in full (all five): claude (cjs), codex (cjs), devin (cjs — verified import/call lines), cursor (mjs response), pi (ts).
4. Import-base check: `runtime/.opencode` does not exist (`ls`: No such file or directory).

## Adapter call census

| Adapter | Core calls | Request fields sent | Guard style |
|---|---|---|---|
| claude/completion-evidence-stop.cjs | KILL_SWITCH_ENV (90), sweepStaleSentinelState (98), detectCompletionClaim (119), evaluateCompletionEvidence (125), appendAdvisoryLog (134) | specFolder, claimText, projectDir, env | `try { require(hook-flags.cjs) } catch {}` (39) |
| codex/completion-evidence-stop.cjs | same set (81, 88, 107, 113, 122) | specFolder, claimText, projectDir, env | `try { require } catch {}` (35) |
| devin/completion-evidence-stop.cjs | same set (verified 21-23 imports; call lines match the claude/codex pattern) | specFolder, claimText, projectDir, env | try/catch import |
| cursor/completion-evidence-response.mjs | detectCompletionClaim (46), resolveSpecFolderFromText (50), evaluateCompletionEvidence (54), appendAdvisoryLog (…), isHookEnabled via hook-flags.mjs (13) | specFolder, claimText, projectDir, env | top-level static import (no guard) |
| pi/completion-evidence.ts | detectCompletionClaim (59), resolveSpecFolderFromText (62), evaluateCompletionEvidence (66), appendAdvisoryLog (73), isHookEnabled (12) | specFolder, claimText, projectDir, env (66-71) | top-level static import (no guard); `turn_end` body try/catch (80) |

## Findings

| # | Severity | Claim side | Actual side | Verdict |
|---|----------|-----------|-------------|---------|
| F1 | P1 (conditional) | `runtime/hooks/pi/completion-evidence.ts:12` — `import { isHookEnabled } from "../../.opencode/hooks/shared/hook-flags.mjs"` | Resolved from checked-in location `<root>/.opencode/skills/system-spec-kit/runtime/hooks/pi/`, `../../.opencode` is `<root>/.opencode/skills/system-spec-kit/runtime/.opencode`, which does not exist (verified). The correct relative path to the repo's `.opencode/hooks/shared/hook-flags.mjs` is five ups (`../../../../../hooks/shared/hook-flags.mjs`); the claude/codex cjs adapters use six ups, correct for their depth. The import is unguarded top-level, unlike its cjs siblings (try/catch at claude:39, codex:35) | If the pi loader loads this file as checked in, module evaluation fails at the import and the whole pi completion-evidence adapter never registers (fail-silent); if the loader relocates the module, the path resolves. Either way the checked-in path is wrong. Recommend: **fix** — correct the depth or guard the import like the cjs siblings |
| F2 | P2 | `runtime/hooks/pi/completion-evidence.ts:20` — fallback `import("../../.opencode/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs")` | Same wrong base (resolves to `runtime/.opencode/skills/...`, nonexistent); it also duplicates the primary import (line 18, correct `../../lib/hooks/...`), so the fallback is dead in the one case it would run (primary import failure ≥ resolution failure of the fallback too), and its failure would propagate out of the catch into the caller | Dead, wrong, misleading fallback. Recommend: **fix** — remove the fallback or point it at the real absolute-relative path |

## Verified Correct (no finding)

- No adapter calls a function the core does not export: every `sentinelCore.X` across claude/codex/devin/cursor/pi is in the exports list (547-570). Devin's adapter mirrors the claude/codex trio exactly.
- Request shape: all five adapters pass only {specFolder, claimText, projectDir, env}; the core reads exactly those four (483-545). Cursor additionally reads its own payload fields (text, workspace_roots, session_id) — payload-level, outside the core contract, consistent.
- Status vocabulary: the core emits only `ok`/`advise` (+deduped); claude's comment line — "never {decision:'block'}" — is a negative-statement comment consistent with the core (the comment documents what is NOT emitted; no adapter branches on `block`).
- Kill-switch behavior: adapters check `process.env[sentinelCore.KILL_SWITCH_ENV] === '1'` after also querying hook-flags; KILL_SWITCH_ENV is still exported, and the claude:36 comment ("legacy ... check below remains") matches the code below it — not stale.
- `resolveSpecFolderFromText` is exported and used by cursor/pi (not by claude/codex, which resolve via their own session-state read) — an implementation difference, not a contract break.

## Questions Answered

- Which adapter deviates from the core's contract? None on exports/request/status; the deviation is import-path resolution in the pi adapter (F1/F2).
- Is the pi hook family loaded with relocation? Unverified — no in-repo loader for `runtime/hooks/pi/*` was found (repo-wide grep for `hooks/pi/` consumers returns only specs/docs; the pi extension registration was not located).

## Open Questions

1. How does the pi runtime load `runtime/hooks/pi/*.ts`, and does that loader relocate modules (making the 2-up path resolve) or silently drop a failed adapter? The same 2-up pattern appears in all five pi hook files (session-compact-context.ts:16, session-start-advisories.ts:6, session-start-context.ts:6, session-stop-context.ts:6), so the question covers the whole family, not just completion-evidence.
2. Does the pi adapter's `isHookEnabled("completion")` reach the documented `SYSTEM_COMPLETION_DISABLED` kill-switch, or does the concern-slug derivation (`SYSTEM_<concern>_DISABLED`) produce a different flag? The hook-flags registry's CONCERN_CANONICAL list (goal, dispatch, mcp-route-guard, codex-watchdog, git-preflight, post-edit-quality) does not include "completion" — the derivation question is open.

## Ruled Out

- Cursor's `isHookEnabled` static import as a finding: read path `../../../../../../.opencode/hooks/shared/hook-flags.mjs` from hooks/cursor resolves to `<root>/.opencode/hooks/shared/hook-flags.mjs` (six ups = repo root) — correct, unlike the pi depth.
- The "advisory-only v1" comments: documented policy, not a status the adapters consume.
