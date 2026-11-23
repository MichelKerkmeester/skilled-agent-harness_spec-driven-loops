# Iteration 002 - Security

## Dispatcher

- Iteration 2 of 5, generation 3, sessionId 2026-11-23T09:35:31.105Z, lineageMode restart (config). The state log holds one iteration record, so the derived number is 2 and matches dispatch.
- Dimension: security. Operator focus addressed by walking the epic's trust and file-system surfaces in turn: the route-receipt store and the hook input it keys on, the pasted-reply strip regexes, the bridge env parity between the launcher and the Python bridge, and the residue tool's apply-mode delete and process-stop paths (the doctor cleanup's engine).

## Dimension

D2 Security.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts:97-331` (base dir, file name hash, parse, FileRouteReceiptStore, ownedFolder, makeRoom)
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:340-418` (receipt session id, transcript size)
- `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:68-108` (head receipt store)
- `.skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:243-274` (PASTED_REPLY_CUE, TASK_MARKER, strip loop)
- `.skilled/bin/system-skill-advisor-launcher.cjs:28-80, 111-160, 289-310` (.env load, repo defaults, CHILD_ENV_ALLOWLIST, createChildEnv)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:214-268, 695-756` (NATIVE_BRIDGE_ENV_ALLOWLIST, LAUNCHER_ONLY_ENV_KEYS, _native_bridge_env)
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1233-1290, 1396-1425, 1781-2130` (context read: the residue tool named by the operator focus and by `doctor-update-apply.yaml:221-222`; not in the declared scope file list)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The Vibe head-receipt store trusts its folder, unlike the route-receipt store beside it** -- .skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:99 -- `writeHeadReceipt` runs `mkdirSync(directory, { recursive: true, mode: 0o700 })` and then `writeFileSync(target, head, { mode: 0o600 })` with no check of who owns the folder, whether the folder or the target is a symlink, or the folder's mode. `mkdirSync` does not fail or re-mode an existing folder, and `writeFileSync` follows a symlinked target. `readHeadReceipt` (line 79) reads whatever file sits at the hashed name. The route-receipt store in the same hook family refuses all of that through `ownedFolder` (route-receipt.ts:283-291: symlink, uid and `mode & 0o077` checks on both the base and the subfolder) and writes through a `wx` temp file plus rename (route-receipt.ts:249-251). Where the default base resolves to a shared temp folder (`join(tmpdir(), 'speckit-advisor')` at line 70; on Linux `/tmp` is shared, on macOS `TMPDIR` is per user, so the default there is not exposed), another local user who pre-creates `speckit-advisor/vibe-turn-start` can plant `<digest>.head` as a symlink, and the victim's next write overwrites the link's target with the routing head text. The same user can also plant a receipt equal to the next head and so suppress it. Eviction (line 88-96) only unlinks `*.head` names, which limits the delete side. Severity is P2: it needs a shared temp folder plus the session id to predict the 16-hex digest, and the written content is not attacker-chosen.
   Finding class: missing defense-in-depth on a per-session state file (inconsistent with the sibling store's rule)
   Scope proof: the Vibe hook is in the declared review scope; `git log -L` attributes the head-receipt code to the cli-mistral-vibe commits `36ddad5062d` and `45e37473e64`, not to this epic, so this is a scoped file's pre-existing weakness and not a regression from 016.
   Affected surface hints: `hooks/vibe/prompt-advisor.mjs` headReceiptDir, readHeadReceipt, writeHeadReceipt, evictOldestReceipts; the `ownedFolder` rule in `hooks/lib/route-receipt.ts` is the pattern to reuse.
   Case: on a Linux host, a second local user creates `/tmp/speckit-advisor/vibe-turn-start/<digest>.head` as a symlink to a file the Vibe user owns, and the Vibe user's next turn overwrites that file with the routing head text.

## Traceability Checks

- spec_code (partial): bridge env parity claim from 027 checked in code. A set diff of `CHILD_ENV_ALLOWLIST` (launcher) against `NATIVE_BRIDGE_ENV_ALLOWLIST` (Python) shows the launcher-only keys are exactly `LAUNCHER_ONLY_ENV_KEYS` (skill_advisor.py:254-261), and the only Python-only key is `SPECKIT_OPENCODE_HOOK_TIMEOUT_MS`. `NATIVE_BRIDGE_ENV_DEFAULTS` mirrors the launcher's `SPECKIT_ADVISOR_DOC_TRIGGERS` default (launcher.cjs:72-74, skill_advisor.py:265-267). Doc-side claims stay for iteration 3.
- checklist_evidence: not run this iteration.

## Integration Evidence

- Probe (outside the repo, `/private/tmp/claude-501/redos-probe.mjs`) ran `stripLeadingPastedReply` from the rebuilt `runtime/dist/runtime/lib/prompt-policy.js` on five adversarial inputs between 200k and 1.1M characters (dot runs, repeated `now:` markers, nested cues, a long space run, dot-space-`task` runs): each finished in 0-2 ms, exit 0. No super-linear backtracking.
- `doctor-update-apply.yaml:221-222` names `sweep-lane-residue.mjs machine --json` and `apply --json [--shared-model delete|keep] </dev/null` as the doctor's cleanup commands; that is the delete path reviewed.

## Edge Cases

- Scope: the residue tool `sweep-lane-residue.mjs` is not in the declared scope file list, though the operator focus names it. It was read as context only; no finding is raised on it.
- The receipt store's default base on Linux is a shared `/tmp`; a foreign-owned `speckit-advisor` folder disables receipts (ownedFolder fails) and the guard delivers. That is a denial of the feature only, and it fails open to the no-receipt behavior, so it is not a finding.

## Confirmed-Clean Surfaces

- Route receipts: file name is a sha256 prefix of the session id (route-receipt.ts:102-104), so a session id cannot traverse; read rejects a non-file or oversize entry and a record whose sessionId differs (route-receipt.ts:116-124, 232-234); write is `wx` temp plus rename at 0o600 inside a 0o700 folder checked for symlink, owner and mode (route-receipt.ts:245-251, 283-291). Eviction only touches regular `.json` and stale `.tmp` entries.
- Claude hook: only a trimmed, confirmed session id keys a receipt (user-prompt-submit.ts:340-345); the transcript path is only `stat`ed for size (user-prompt-submit.ts:348-351).
- Pasted-reply strip: TASK_MARKER keeps its post-boundary whitespace off newlines (prompt-policy.ts:248), and the fixed-point loop shrinks the string each pass (prompt-policy.ts:267-273); probe above confirms linear time.
- Bridge env: both allowlists are exact-key sets, no prefix widening; the Python bridge leaves out `SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT`, the safer direction for a scoring child.
- Residue apply mode: `resolveContainedTarget` refuses empty, dot, dot-dot and slash segments, a symlinked target, and a real parent outside the real root (sweep-lane-residue.mjs:1792-1821); a directory is removed only where the fixed name is a folder (1842-1845); only node running this checkout's own model-server script, compared by real folder and fixed basename, is signalled (1400-1422, 2080-2092); server files go only when no server may still use them and never through a symlinked folder (2094-2107); the shared model is deleted only on `--shared-model delete` or an explicit terminal yes (2116-2129); a checkout that still holds a lane source deletes nothing (1988-1990).

## Ruled Out

- ReDoS in the pasted-reply strip: ruled out by the timing probe.
- Bridge env drift between launcher and Python bridge: none beyond the documented launcher-only keys.
- Residue apply-mode deleting outside its roots or signalling a foreign process: ruled out by direct read of the containment and ownership guards.
- Route-receipt path traversal or symlink redirection: ruled out by direct read.

## Next Focus

- Dimension: traceability
- Focus area: phase 028 doc-side claims (children 007 to 010 statuses, receipt-guard catalog sources naming every hook, 027 AC-006 reproduction), feature catalog to code (pasted-reply stripping, weak-follow-up receipt guard, lifecycle), playbook capability, and the agent_cross_runtime overlay generation 2 never recorded.
- Reason: planned rotation; spec_code is still partial and checklist_evidence plus all overlays are unrun.
- Rotation status: 2/4 dimensions covered.
- Carry-forward: probe-by-input stayed productive (timing probe); direct reads of guard code settled the delete paths cheaply.
- Required evidence: file:line on both sides of every doc-to-code claim; record each overlay protocol, notApplicable where it does not apply.

Review verdict: PASS
