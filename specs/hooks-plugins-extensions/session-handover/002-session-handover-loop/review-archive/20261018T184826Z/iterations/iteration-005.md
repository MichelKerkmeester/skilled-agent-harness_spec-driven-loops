# Review Iteration 5

## Dispatcher

- Mode: review; target agent `@deep-review`; resolved route `Resolved route: mode=review target_agent=deep-review`.
- Run: session `2026-10-18T12:41:21.177Z`, generation 1, lineage mode `new`.
- Budget profile: verify (11-13 calls). Focus taken from the strategy Next Focus: correctness second pass.
- Review target: `specs/hooks/023-session-relaunch-loop`; all reviewed files were read-only.

## Dimension

Correctness, second pass. Scope: the runtime adapters (`claude`, `codex`, `hermes`, `pi`, `opencode`) and the wrapper's per-runtime case arms and decline paths, plus a fresh-evidence re-check of the ten open P2 findings.

## Files Reviewed

- `.skilled/bin/skilled-loop:59` (manual seed options), `:98` (Gate-3 Skip suffix), `:152` (per-runtime argv), `:405-505` (relaunch and decline branches), `:443` (cd-before-consume).
- `.skilled/hooks/session-relaunch/claude/context-nudge.mjs:53,59,76,118`
- `.skilled/hooks/session-relaunch/claude/stop-arm.mjs:80,90,102,122,124`
- `.skilled/hooks/session-relaunch/codex/shared.mjs:57,66,86,102,138`
- `.skilled/hooks/session-relaunch/codex/stop-arm.mjs:139-144,152,160`
- `.skilled/hooks/session-relaunch/codex/prompt-seed.mjs:15`, `.skilled/hooks/session-relaunch/codex/context-nudge.mjs:15`
- `.skilled/hooks/session-relaunch/hermes/context-nudge.mjs:19,57,67,80`
- `.skilled/hooks/session-relaunch/hermes/session-end-arm.mjs:100-104,116,124`
- `.skilled/hooks/session-relaunch/pi/session-relaunch.ts:140,167,180,194,353,359`
- `.skilled/hooks/session-relaunch/opencode/session-relaunch.js:47,56,152,352,361`
- `.opencode/plugins/session-relaunch.js:1` (cmp-identical to the skilled symlink target)
- `.skilled/hooks/session-relaunch/lib/nudge.cjs:13,15,143,152`
- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:141-144,300-315,554-575`
- `.skilled/hooks/session-relaunch/lib/killer.cjs:113,250`
- `.skilled/hooks/session-relaunch/tests/codex-adapters.test.cjs:316`
- `.skilled/skills/sk-code/sk-code-review/references/review-core.md:1` (severity doctrine)
- Symlink targets: `.cursor/commands/speckit-handoff.md`, `.claude/commands/speckit/handoff.md`, `.pi/extensions/session-relaunch.ts`.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Claude stop-arm re-arms an already-armed record and spawns a redundant killer** -- `.skilled/hooks/session-relaunch/claude/stop-arm.mjs:90` -- the Claude arm path validates `record.sessionId` but never `record.status`; `arm()` returns the existing armed record unchanged (`relaunch-core.cjs:309`), so `armed.status !== 'armed'` at `stop-arm.mjs:122` cannot filter a re-arm and `spawnKiller` runs again at `:125`.
   - Case: a Claude session emits Stop; the first killer arms the record but has not fired yet; the session emits a second Stop while the record is still armed; the second Stop calls `arm()`, receives the already-armed record, and spawns a second killer.
   - Finding class: cross-consumer
   - Scope proof: read-only reads of all five stop/session-end adapters plus `arm()`; Codex (`stop-arm.mjs:139-144`), Hermes (`session-end-arm.mjs:100-104`), Pi (`session-relaunch.ts:353-357`) and OpenCode (`session-relaunch.js:351-356`) all require `status === 'pending'`, and `codex-adapters.test.cjs:316` asserts the already-armed case is ignored. The missing guard is unique to Claude.
   - Affected surface hints: `claude/stop-arm.mjs`, `lib/relaunch-core.cjs`, `claude-adapters.test.cjs`
   - Evidence: the second killer loses the `createLock` EEXIST race against the live first owner and exits (`killer.cjs:250` area), so the routine cost is one redundant detached Node process per extra Stop plus log noise; during the stale-lock takeover window recorded as R2-P2-001 two killers can both unlink and recreate the lock.
   - Counterevidence: whether the asymmetry is deliberate retry-after-spawn-failure; `arm()` runs before spawn in every adapter, siblings filter pending, and no document names a Claude retry path, so the omission reading stands.
   - Recommendation: add the same `record.status !== 'pending'` guard used by the four sibling adapters, and add a Claude test mirroring `codex-adapters.test.cjs:316`.

## Re-confirmation of Open Findings

| Finding | Status this iteration | Fresh evidence |
|---------|----------------------|----------------|
| R1-P2-001 appendLog read-modify-write drops concurrent lines | Confirmed | `relaunch-core.cjs:554-575` reads the whole log, rewrites it through `atomicWriteFile`, and holds no lock across the read/write. |
| R1-P2-002 Gate-3 Skip suffix unbalanced parenthesis | Confirmed | `nudge.cjs:13` and `:15` carry `(Gate 3 answered D) Skip ...)`; `skilled-loop:98` prints the same literal; `SPEC_FOLDER_SKIP_SUFFIX` round-trips it, so this is user-facing text only. |
| R1-P2-003 killer aborts on an unreadable transcript | Carried, not re-confirmed | `killer.cjs:113` `fs.statSync` still throws; the caller's catch was not re-read this pass. |
| R2-P2-001 stale-lock takeover is not atomic | Confirmed | `killer.cjs:250` area: EEXIST -> owner liveness check -> unlink -> create; the unlink/recreate window remains. |
| R2-P2-002 shared-temp state-dir fallback | Confirmed | `relaunch-core.cjs:141-144`: `path.join(env?.XDG_RUNTIME_DIR || os.tmpdir(), 'skilled-relaunch')`, no per-user component. |
| T3-P2-001 checklist evidence pointers | Carried, not re-read | Packet docs are outside this correctness pass. |
| T3-P2-002 interface contract section 7 order contradiction | Carried, not re-read | Packet docs are outside this correctness pass. |
| M4-P2-001 plannedNotePath drift | Confirmed | Claude `context-nudge.mjs:60-66` and Codex `shared.mjs:66-78` `path.join` an unresolved root; Hermes `:67`, Pi `:177` and OpenCode `:57` call `path.resolve`. |
| M4-P2-002 Pi re-reads hook config per event | Confirmed | `pi/session-relaunch.ts:142` loads config in `isEnabled()` and `:169` loads it again in `relaunchThreshold()`. |
| M4-P2-003 notePathFromSeed divergence | Confirmed | Hermes `:80-87` requires the exact prefix and an absolute path; Pi `:194-204` and OpenCode `:152-162` search for the marker anywhere and fall back to `<handoff-path>`. |

No open finding was refuted. One new P2 was opened.

## Traceability Checks

- `spec_code` (core): carried partial. This pass re-checked the code side of the ten P2 claims only; sections 11.10-11.11 of the interface contract remain unread from D1.
- `checklist_evidence` (core): carried partial (T3-P2-001); packet task lists were not re-read.
- `skill_agent` (overlay): carried partial from D3.
- `agent_cross_runtime` (overlay): carried pass from D3; no registry or generated-config file was re-read.
- `feature_catalog_code` (overlay): carried partial; SL-208 quantitative claim remains deferred.
- `playbook_capability` (overlay): carried partial from D3.

No traceability protocol was expanded this iteration; the dimension was correctness.

## Integration Evidence

- Wrapper arms and decline paths: `.skilled/bin/skilled-loop:152-222` (per-runtime argv), `:405-505` (relaunch, consume, manual-command fallback, exit preservation), `:443` (cd before consume, matching the contract amendment).
- Adapter entry points: `.claude/hooks/stop-arm.mjs` -> `.skilled/hooks/session-relaunch/claude/stop-arm.mjs`; `.codex/hooks/stop-arm.mjs` -> Codex adapter; Hermes plugin bridge -> `hermes/session-end-arm.mjs`; Pi extension -> `pi/session-relaunch.ts`; OpenCode plugin (`.opencode/plugins/session-relaunch.js`) is the regular file and `.skilled/hooks/session-relaunch/opencode/session-relaunch.js` is a symlink to it.
- Command mirrors: `.cursor/commands/speckit-handoff.md`, `.claude/commands/speckit/handoff.md` and `.pi/extensions/session-relaunch.ts` are true symlinks to their canonical files.

## Edge Cases

- The Claude re-arm asymmetry could be a deliberate retry path after a failed killer spawn. It does not survive the shared design: `arm()` runs before spawn everywhere and returns the armed record rather than a transition signal, and the four siblings plus a Codex test treat already-armed as ignore. Severity stays P2 because the killer lock bounds the duplicate to a wasted process outside the stale-takeover race.
- The malformed Skip suffix round-trips through `SPEC_FOLDER_SKIP_SUFFIX`, so no path or parsing defect follows; R1-P2-002 remains text-only.
- SL-205 resolved in the opposite direction from the earlier guess: `.opencode/plugins/session-relaunch.js` is the regular file and the `.skilled/.../opencode/` path is the symlink, so the canonical source lives under `.opencode/plugins/`.
- Hermes spawns the killer without `--transcript` while the other four pass one. Inference: the Hermes session-end payload has no transcript path; not verified against the contract this iteration.
- `appendLog` concurrency remains confirmed by code structure only; no interleaving test was run.

## Confirmed-Clean Surfaces

- Claude `context-nudge.mjs:76` reads the hook config once per run; the nudge state file is read only after the ratio crosses the threshold (`:118-124`).
- Codex `shared.mjs:96-97` gates on the registered event name and handles the seed only on `UserPromptSubmit`.
- `codex/stop-arm.mjs:139-144`, `hermes/session-end-arm.mjs:100-104`, `pi/session-relaunch.ts:353-357` and `opencode/session-relaunch.js:351-356` all require a pending record plus a matching session and runtime before arming.
- Wrapper decline handling preserves the runtime exit (`:498`, `:504`), exits 130 on interrupt (`:450-455`), and falls back to the manual command for unreadable records, line breaks and `cd` failure (`:416-448`).
- All five killer spawn sites pass argv arrays with no `shell: true` (`claude/stop-arm.mjs:44-47`, `codex/stop-arm.mjs:92-95`, `hermes/session-end-arm.mjs:124-134`, `pi/session-relaunch.ts:265-269`, `opencode/session-relaunch.js:250-254`).
- `.opencode/plugins/session-relaunch.js` and the skilled symlink target are byte-identical (`cmp`).

## Ruled Out

- SL-205 mirror link shape: both handoff mirrors and the Pi extension are real symlinks; the README claim is accurate. Deferral closed.
- SL-108 adapter payload argv audit: all five spawn sites construct argv arrays and never enable a shell, so the deferred D2 direction is closed.
- `findCodexPid` (`codex/stop-arm.mjs:67-88`) and `findHermesPid` (`hermes/session-end-arm.mjs:49-70`) are byte-identical. Real duplication, but the same root cause as M4-P2-001/M4-P2-003; folded into their shared-helper remediation instead of opening a fifth duplication finding.
- Pi/OpenCode `notePathFromSeed` accepting the marker anywhere is gated by `isSeedPrompt` before use (`pi:330`, `opencode:337`), so quoted text alone cannot trigger a seed on the message path.
- Absence of the pending guard as a P1: the redundant killer exits on the live lock; bounded to P2.

## Next Focus

- Dimension: cross-reference / synthesis (all four dimensions are covered; this was the second correctness pass).
- Focus area: adjudicate the 11 open P2 advisories and reconcile strategy section 14 with the findings registry; no new code direction remains.
- Reason: one new weighted P2 against 11 accumulated findings gives `newFindingsRatio` 0.09, below the 0.10 convergence threshold, and no P0/P1 is active.
- Rotation status: post-coverage; dimension rotation complete.
- Blocked/productive carry-forward: T3-P2-001 and T3-P2-002 remain carried (packet docs not re-read); SL-208 remains deferred; SL-205 and SL-108 are closed.
- Required evidence: reducer-refreshed registry and dashboard, plus the two carried packet-doc findings.
- Recovery note: none; the iteration state is coherent.

Review verdict: PASS
