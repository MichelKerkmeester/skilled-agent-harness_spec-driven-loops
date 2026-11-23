# Iteration 002 - Security

## Dispatcher

- Run: 2 of 5, generation 2, lineage `restart`, session `2026-11-23T05:51:03.170Z`.
- Dimension: security (D2).
- Iteration number derived from the state log: one prior `type:"iteration"` record, so this is iteration 2, matching the dispatch.
- Operator focus: covered bridge env parity (launcher child env and Python native-bridge env), the crash fallback's process handling, the subprocess output cap, and the Ollama and embedding lane residue tool's delete and kill paths, judged from code and the parity test rather than packet tables. The doctor cleanup surface was only read through the residue tool's apply step; its YAML wiring is left for traceability.

## Files Reviewed

- `.skilled/bin/system-skill-advisor-launcher.cjs` (env file loader and repo defaults 28-80, `CHILD_ENV_ALLOWLIST` 111-166, `createChildEnv` 289-307)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` (`NATIVE_BRIDGE_ENV_ALLOWLIST` 214-252, `LAUNCHER_ONLY_ENV_KEYS` 253-261, `_native_bridge_env` 697-707, `_sanitize_native_label` 710-721, `_run_native_bridge` 735-790, stdin read before early exits 5778-5795)
- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2787-2793` (launcher/bridge allowlist drift test)
- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts` (`capOutput` 108-156, `runSpawnAttempt` 210-310)
- `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` (`findCliFallbackPaths` 177-205, `childEnvForCli` 207-213, CLI spawn 240-331)
- `.skilled/commands/doctor/assets/doctor-update-apply.yaml` (lane-cleanup step around 219-228), context only
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs` (`normalizeOllamaHost` 883-896, `resolveContainedTarget` 1792-1821, `deleteContained` 1834-1854, `stopProcess` 1873-1886, `removeEmptyDir` 1896-1915, process ownership 1384-1425), context read named by the operator focus; it is not in `reviewScopeFiles`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Python-advisor spawn has no error listener on the child's stdin** -- .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:247 -- `runSpawnAttempt` writes the whole prompt with `child.stdin?.write(args.prompt)` and attaches `error` listeners only to the child process, never to `child.stdin` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:228-248]. When the child exits or is killed before draining stdin, the pipe write fails with EPIPE and Node raises it as an `error` event on the stdin socket; with no listener that becomes an uncaught exception in the calling process (the hook or the daemon that builds the brief), not the fail-open result the function otherwise returns. The sibling crash-fallback spawn already guards the same write with `child.stdin?.on('error', () => undefined)` [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:278], so the pattern is known in this codebase and simply missing here. Python normally reads stdin before any early exit [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5778-5795], which keeps the window narrow: it opens only when the interpreter dies at import (for example `compat-contract.json` unreadable at module load [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:207]) or the timeout SIGKILLs it while a prompt larger than the pipe buffer is still being written. Availability impact on a fail-open boundary, so P2.
   Finding class: missing-guard (process I/O error handling)
   Scope proof: one write site in `runSpawnAttempt`; the only other prompt-to-child write in scope (CLI fallback) is guarded
   Affected surface hints: runtime/lib/subprocess.ts runSpawnAttempt; callers in runtime/lib/skill-advisor-brief.ts; runtime/tests/subprocess-output-cap.vitest.ts as the natural test home
   Case: a prompt over 64 KB sent while skill_advisor.py fails at import, so the child exits before reading stdin and the write raises an unhandled EPIPE in the caller.

Severity doctrine: P2 per `sk-code-review` review-core (robustness defect with a bounded, non-default trigger and no data exposure); not raised to P1 because the trigger needs a broken interpreter or a timeout during a very large prompt write, and inference rather than a reproduced crash supports the uncaught-exception step.

## Traceability Checks

- `spec_code` (partial): the third-round "bridge env parity" claim holds. Every scorer setting in the launcher's `CHILD_ENV_ALLOWLIST` [SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:111-166] appears in `NATIVE_BRIDGE_ENV_ALLOWLIST` [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:214-252] or in the explicit `LAUNCHER_ONLY_ENV_KEYS` set, and a test fails on drift in either direction [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2787-2793]. The crash-fallback claim (prompt on stdin, process-group kill on timeout, capped stdout, settle on exit) matches code [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:256-331]. Doctor cleanup wiring still unchecked, so the protocol stays partial.

## Integration Evidence

- Launcher to daemon: `createChildEnv` filters by exact key, adds only the launcher pid, the db dir and the resolved socket dir [SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:289-307].
- Python CLI to native bridge: `_native_bridge_env` filters by exact key and applies only the doc-trigger default [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:697-707]; the bridge script is inline with absolute module URLs and the payload travels on stdin.
- Doctor update apply step to residue tool: `node .../sweep-lane-residue.mjs apply --json [--shared-model delete|keep] </dev/null`, with the shared-model delete bound to an explicit operator yes [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:222-228].

## Edge Cases

- Scope ambiguity: the operator focus names the residue tool, but `sweep-lane-residue.mjs` is not in `reviewScopeFiles` (the scope list is built from commit trailers). Read as context under the operator focus; no finding raised against it.
- `SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT: 'trusted'` is a repo policy default in the launcher [SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:72-80] that predates this epic (its last change is the `.opencode` to `.skilled` move). Out of epic scope; the bridge child deliberately does not get it, so the Python path keeps the fail-closed code default.
- Key-name asymmetry: the Python allowlist forwards `SPECKIT_OPENCODE_HOOK_TIMEOUT_MS` while the launcher forwards `SPECKIT_CODEX_HOOK_TIMEOUT_MS` (listed as launcher-only). Neither is a scorer setting, so no wrong output; noted for maintainability.

## Confirmed-Clean Surfaces

- Env forwarding is allowlist-only in all three spawns that cross a trust step (launcher, Python bridge); the CLI fallback passes the caller's own env to its own child, which is the same principal.
- User prompt never travels in argv: stdin in `subprocess.ts`, the CLI fallback and the Python bridge.
- Output caps: both `capOutput` and `capStdout` stop growth at the cap; the busy-marker scan still sees text past the cap.
- Native label output from the bridge is sanitized against instruction-like text before it reaches a brief [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:710-721].
- Residue tool delete path: fixed segments only, `..` and `/` refused, symlink targets refused, parent realpath must stay under the root realpath, directories deleted only where the caller declares a folder, `rmSync` with `force:false` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1792-1854]. Kill path: SIGTERM only to a node process whose first script is this checkout's model-server script compared by realpath of its folder.

## Ruled Out

- Prompt disclosure through the process table: ruled out, every prompt-carrying spawn uses stdin.
- Env leak of unrelated secrets to the daemon or bridge child: ruled out, exact-key allowlists with no prefix match.
- Residue tool deleting outside its root through a symlink or traversal: ruled out by `resolveContainedTarget`.
- Residue tool signalling another checkout's or another user's process: ruled out by the ownership check on the script folder realpath.

## Next Focus

- Dimension: D3 traceability.
- Focus area: spec_code and checklist_evidence across child packets 001 to 027 against HEAD; the doctor cleanup wiring (`.skilled/commands/doctor/assets/doctor-update-apply.yaml`, `doctor-update-contract.test.cjs`); feature-catalog and playbook entries for pasted-reply stripping, route receipts and crash fallback against code.
- Reason: correctness and security are clean apart from one P2; the open protocols (checklist_evidence, the four overlays) are all traceability.
- Rotation status: D1 and D2 done, D3 and D4 pending.
- Carry-forward: R2-P2-001 open; the residue tool's scope gap (not in `reviewScopeFiles`) is worth a traceability note.
- Required evidence: file:line for each acceptance-criteria row checked and each catalog claim matched or contradicted.

Review verdict: PASS
