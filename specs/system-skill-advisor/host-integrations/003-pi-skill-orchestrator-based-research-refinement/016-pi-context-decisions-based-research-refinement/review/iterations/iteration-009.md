# Review Iteration 009

## Dispatcher

- Mode: review
- Agent: @deep-review (LEAF, single iteration)
- Route: Resolved route: mode=review target_agent=deep-review
- Run: 8, generation 5, lineageMode `completed-continue`, session `2026-11-23T21:41:17.101Z`
- Iteration: 9 of 9 (JSONL-derived: 8 `type:"iteration"` records + 1)
- Dimension: security (final verification pass)
- Target: `.skilled/skills/system-skill-advisor` at HEAD `52f0bcb9a98` + working-tree fixes
- HEAD: `52f0bcb9a98`; 87 files changed against HEAD, all advisor fixes plus packet state

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4073-4120` (policy loader, `meaningful_token_count`, `is_low_information_prompt`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5111-5117`, `:5177-5180` (call sites)
- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2944-2968` (PROMPT-POLICY-MISSING case)
- `.skilled/skills/system-skill-advisor/runtime/lib/owned-private-dir.ts:12-16` (new shared helper)
- `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:181`, `:260-317`, `:337-341`
- `.skilled/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts:19`, `:146-219`
- `.skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts:29`, `:282-285`
- `.skilled/bin/lib/launcher-ipc-bridge.cjs:179-228`, `:468-476`
- `.gitignore:208-214`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **A hardened writer turns silent on a platform where mode bits carry no meaning** -- `.skilled/skills/system-skill-advisor/runtime/lib/owned-private-dir.ts:16` -- The new shared helper concludes "not private" from `(stat.mode & forbiddenModeBits) === 0`. On win32 Node reports a directory's mode as `0o40777`, so `0o777 & 0o077` is `0o077` and the predicate is false for every directory on the platform. `metrics.ts` gates its whole durable write on this predicate (`privateDirReady` at `:264-273`) and returns before appending (`:341`), with no warning and no fallback, so the hook metrics store writes nothing at all on win32 -- where the pre-fix code appended even when its `chmod` no-opped. `shadow-sink.ts:147-160` inherits the same behaviour for a caller-supplied log folder.
   Case: on win32 a prompt-time hook calls `writeAdvisorHookDiagnosticRecord`; `mkdir` succeeds, `isOwnedPrivateDir(dir, 0)` passes (mode mask 0), `chmod` resolves, then `isOwnedPrivateDir(dir)` fails on the mode bits, so `dirReady` stays false and every durable metrics line is dropped with exit 0 and empty stderr.
   Finding class: silent_failure_regression
   Scope proof: both files are in `reviewScopeFiles`; the predicate is new in this fix batch (`git status` shows `??` for owned-private-dir.ts), and `metrics.ts:264-273` is added by `git diff HEAD`.
   Affected surface hints: `runtime/lib/metrics.ts` durable diagnostic/outcome logs, `runtime/lib/shadow/shadow-sink.ts`, any future caller of `isOwnedPrivateDir` on win32.
   ```json
   {"type":"claim","claim":"isOwnedPrivateDir's mode check is POSIX-only, and metrics.ts converts that false negative into a silent no-op for every durable write on win32","evidenceRefs":["runtime/lib/owned-private-dir.ts:16","runtime/lib/metrics.ts:266","runtime/lib/metrics.ts:272","runtime/lib/metrics.ts:341","runtime/lib/shadow/shadow-sink.ts:150"],"counterevidenceSought":"searched runtime/lib, runtime/handlers and hooks for a win32/platform branch around the metrics or shadow writes and found none; the only win32 handling in the changed set is launcher-ipc-bridge.cjs, so nothing relaxes the mode check","alternativeExplanation":"the advisor may not support win32 at all, in which case the false negative is unreachable","finalSeverity":"P2","confidence":0.6,"downgradeTrigger":"drop to non-finding if the advisor declares POSIX-only support (no win32 install path, no platform doc claim)"}
   ```

2. **A tracked module imports a file that git does not yet contain** -- `.skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts:29` -- Three tracked files now import `owned-private-dir.js` (`hooks/lib/route-receipt.ts:29`, `runtime/lib/metrics.ts:11`, `runtime/lib/shadow/shadow-sink.ts:19`) while `git status --porcelain` reports the module itself as `??` and `git diff HEAD --stat` does not list it. The module is not covered by `.gitignore` (`git check-ignore -v` exits 1), so this is an un-staged production dependency rather than an ignored artifact: a commit made with `-a`, or a cherry-pick of the three modified files, leaves a tree whose hook import cannot resolve, and the prompt-submit hook fails at load rather than degrading.
   Case: an operator commits the fix batch with `git commit -am "harden advisor writers"`; the commit carries the three importers but not `runtime/lib/owned-private-dir.ts`, so the next clone's `hooks/lib/route-receipt.ts` import throws `ERR_MODULE_NOT_FOUND` on the first prompt.
   Finding class: unshipped_dependency
   Scope proof: importers and the missing module both sit inside the declared target `.skilled/skills/system-skill-advisor`; the evidence is `git status --porcelain` plus `git check-ignore -v`, neither of which touches a file.
   Affected surface hints: `hooks/lib/route-receipt.ts` import, `runtime/lib/metrics.ts` import, `runtime/lib/shadow/shadow-sink.ts` import, hook bootstrap for claude/pi/vibe/dsh.
   ```json
   {"type":"claim","claim":"the fix batch depends at import time on a source file that is untracked and unstaged, so a partial commit ships a broken hook","evidenceRefs":["hooks/lib/route-receipt.ts:29","runtime/lib/metrics.ts:11","runtime/lib/shadow/shadow-sink.ts:19","runtime/lib/owned-private-dir.ts:12"],"counterevidenceSought":"ran git check-ignore (exit 1, not ignored) and git diff HEAD --stat (module absent), so the file is neither ignored nor part of the diff","alternativeExplanation":"the file may simply be added to the index before the batch is committed","finalSeverity":"P2","confidence":0.85,"downgradeTrigger":"drop once the module is added to the index"}
   ```

## Verification of Prior Findings

- **G5-I8-P2-001 (Python fallback hard-fails at import) -- CONFIRMED FIXED, closed.** `_load_prompt_policy_stop_words` (`skill_advisor.py:4085-4096`) catches `OSError, ValueError, KeyError, TypeError`, warns once on stderr and returns a `set()`. Ran the fallback against a missing policy: `SPECKIT_ADVISOR_PROMPT_POLICY_PATH=/nonexistent/prompt-policy.json python3 skill_advisor.py "implement a retry helper in the python client" --force-local` exited 0, printed `skill_advisor: unusable prompt policy /nonexistent/prompt-policy.json: [Errno 2] ...` on stderr and emitted a normal recommendation payload (`sk-code`, confidence 0.95). The PROMPT-POLICY-MISSING case (`tests/python/test_skill_advisor.py:2944`) asserts the same three conditions.
- **G5-I2-P2-002 (shadow sink path not gitignored, no mode guard) -- CONFIRMED FIXED, closed.** `git check-ignore -v` resolves the default path through `.gitignore:212` and the rotation through `.gitignore:214`, and the patterns cover both the `.opencode` and `.skilled` copies; `.gitignore:208-214` reads as straight path globs with no negation below them. The guard half also landed: `shadow-sink.ts:183-207` opens with `O_NOFOLLOW` and mode `0o600`, rejects a symlink (`ELOOP`), a multiply-linked or foreign file, and `fchmod`s an over-permissive one; `:214` refuses to rotate a path that is not a plain file. A caller-supplied `logPath` remains the caller's choice, as the dispatch allowed.

## Traceability Checks

- `spec_code` -- pass. Each fix now does what its finding asked, at the cause: `skill_advisor.py:4085` degrades instead of raising, `shadow-sink.ts:183` refuses instead of appending through a link, `metrics.ts:264` verifies the folder before writing, `route-receipt.ts:285` routes through the same helper it used to hand-roll.
- `checklist_evidence` -- notApplicable. The target is a skill, not a packet with a tasks/checklist contract.

## Integration Evidence

- `.skilled/bin/lib/launcher-ipc-bridge.cjs:205-228` (`checkIpcSocketOwnership`) inspects the socket and, when the parent is the configured socket dir, that parent too; `:471-476` refuses before the deep probe. Read as the client-side half of the boundary iteration 8 closed.
- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2944` exercises the fallback through `subprocess` with the env override, matching the production entry point.

## Edge Cases

- The `dirReady` module global (`metrics.ts:181`, `:264`) short-circuits the ownership check after the first success. All durable paths derive from one root (`metrics.ts:324` joins `DURABLE_METRICS_ROOT`), so the second path cannot reach a different directory today; recorded as an invariant that a future second root would break.
- `rotateIfNeeded` (`shadow-sink.ts:214`) no longer rotates a hard-linked path, so such a path grows past `maxBytes` unbounded. Left as an edge case: reaching it needs a hard link a private folder stops anyone else from creating.
- `isOwnedPrivateDir` throws on `ENOENT`; already swept at iteration 8 for the four callers and not re-entered.
- Overlay protocols (`feature_catalog_code`, `playbook_capability`) were not re-run: the fix batch is code-only, but note the claiming doc pages for supersession/rollback/schema-migration are deleted in this diff (`git status`: `D .../feature-catalog/lifecycle-routing/supersession.md`), which is what held `feature_catalog_code` at `partial`. Synthesis should re-run that protocol against the reduced catalog rather than reading it as still-partial for the same reason.

## Confirmed-Clean Surfaces

- `checkIpcSocketOwnership` and its caller: no `tcp://` gap inside the in-repo path (a `tcp://` endpoint is a loopback choice the caller makes, not a file the caller can be tricked into), and the directory check precedes the connect.
- `appendPrivateLine` in both writers refuses before writing when `open` raises `ELOOP`/`EMLINK`, when the target is not a regular file, when it is multiply linked, or when it belongs to another uid; the descriptor is always closed in `finally`.
- `route-receipt.ts:282-285` is behaviourally identical to the inline loop it replaced: same two paths, same `lstat`, same symlink, uid and `0o077` tests.

## Ruled Out

- TOCTOU between the ownership check and the connect: the checked directory is private and owned, so nobody else can swap the socket inside the window; the connect uses the same resolved path.
- Unused-import build break from the fix batch: `existsSync`, `statSync`-successor `lstatSync`, `chmodSync` and `realpathSync` are all still referenced in `shadow-sink.ts` (`:73`, `:94`, `:101`, `:156`, `:214`), and `lstatSync` is still used twice in `route-receipt.ts` (`:233`, `:296`).
- Mode-bit loss on `skill_advisor.py` (`100755` -> `100644`): every in-repo entry point passes the interpreter explicitly (`runtime/lib/subprocess.ts:367` sets `command = options.pythonBin ?? 'python3'`, `runtime/scripts/init-skill-graph.sh:86` runs `python3 ...`, `runtime/scripts/routing-accuracy/score-routing-corpus.py:33` loads it as a module), so no caller executes it by shebang.
- A missing prompt policy crashing the TypeScript runtime: `runtime/lib/prompt-policy.ts:46` reads without a guard, but that is pre-existing, out of this fix batch, and separate from the Python degradation the fix introduced on purpose.

## Next Focus

- Dimension: none remaining -- final iteration of a `max-iterations` run.
- Focus area: synthesis.
- Reason: all four dimensions covered; both carried P2s closed against the current tree; two new P2s recorded above and neither raises the verdict.
- Rotation status: complete (4/4).
- Blocked/productive carry-forward: `SL-004` (state_transition, deferred at iteration 8) remains the only open search debt.
- Required evidence: none for another review iteration; synthesis should re-run `feature_catalog_code` against the reduced catalog and re-check the two new P2s.
- Recovery note: not applicable.

Review verdict: PASS
