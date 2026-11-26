# Review Iteration 2 - security

## Dispatcher

- Route: mode=review, target_agent=deep-review, execution=single_review_iteration.
- Run: 2026-11-23T21:02:32.908Z, generation 4, iteration 2 of 5, dimension security.
- Review target: `.skilled/skills/system-skill-advisor` (read-only). Operator focus addressed: the advisor logic in `runtime/` and `hooks/`, prose docs only where code contradicts them.
- Lineage: config declares `lineageMode` restart while the findings registry declares resume; the iteration-1 narrative recorded the same contradiction. The record copies config, as the agent contract requires.

## Files Reviewed

- .skilled/skills/system-skill-advisor/runtime/advisor-server.ts:190-345
- .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:207-235, 402-421, 433-460, 513-520, 747-780, 1086-1215, 1278-1300, 1360-1395, 1460-1470
- .skilled/skills/system-skill-advisor/runtime/lib/auth/trusted-caller.ts:20-38
- .skilled/skills/system-skill-advisor/runtime/lib/caller-context.ts:7-34
- .skilled/skills/system-skill-advisor/runtime/lib/ipc/socket-server.ts:1-22
- .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:215-270, 331-400
- .skilled/skills/system-skill-advisor/runtime/lib/daemon/lease.ts:224-270
- .skilled/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts:23-53, 100-150
- .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:160-220, 250-330, 550-605
- .skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts:90-130, 225-310
- .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts:1-60
- .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-store.py:1-160, 300-360
- .skilled/skills/system-skill-advisor/hooks/{pi/prompt-advisor.ts,vibe/prompt-advisor.mjs,dsh/prompt-advisor.mjs} (mutation and spawn surface only)
- Context evidence outside the target, read only to test an in-target claim: .skilled/bin/system-skill-advisor-launcher.cjs:60-90, .skilled/skills/system-spec-kit/shared/ipc/socket-server.ts:180-290, 430-470, 560-580, .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:370.

## Findings - New

### P0 Findings

None. No exploit path reached a privilege boundary that the caller could not already cross by asserting `_meta.trusted`, and no injection, path traversal or shell string was found (see Ruled Out).

### P1 Findings

1. **The trusted-caller gate is trusted-by-default in the shipped launcher, so the daemon side never fails closed** -- .skilled/skills/system-skill-advisor/runtime/advisor-server.ts:247 -- `resolveTrustedCaller` refuses only a caller that marks itself untrusted and otherwise falls through to `process.env.SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT === "trusted"`, with a comment promising that absent metadata fails CLOSED and that callers cannot forge the grant.
Finding class: cross-consumer
Scope proof: the resolving function, its only production writer of the env value, and every consumer of the grant were read; `rg -n "SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT"` over .skilled returns the launcher default, the daemon resolution and the docs, and no other assignment.
Affected surface hints: advisor-server.ts:236-258 resolveTrustedCaller -> skill-advisor-cli.ts:1115-1121 spawnLauncher env:process.env -> .skilled/bin/system-skill-advisor-launcher.cjs:70-79 REPO_ENV_DEFAULTS -> handlers/advisor-rebuild.ts:123, handlers/skill-graph/scan.ts:35, handlers/skill-graph/propagate-enhances.ts:46 requireTrustedCaller
Case: a same-user IPC client that sends no `_meta` frame connects to a daemon started by any ordinary CLI invocation and calls `advisor_rebuild`; the mutation runs although the client never asserted authority, and the code comment states the opposite default.

```json
{
  "type": "auth-gate-default-inversion",
  "claim": "The daemon trusted-caller gate is documented and coded as fail-closed, but the launcher it ships with sets SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT=trusted, so a `_meta`-less caller is trusted and the mutation gate never refuses anyone.",
  "evidenceRefs": [
    ".skilled/skills/system-skill-advisor/runtime/advisor-server.ts:243-258",
    ".skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:220-229",
    ".skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1115-1121",
    ".skilled/bin/system-skill-advisor-launcher.cjs:70-79",
    ".skilled/skills/system-skill-advisor/runtime/handlers/advisor-rebuild.ts:123"
  ],
  "counterevidenceSought": "The launcher comment at :68-72 states the trusted default is deliberate repo policy and that an explicit environment value wins; `_meta.trusted` is caller-asserted anyway, so the gate was never an authentication boundary. Both reduce impact but do not restore the documented fail-closed behaviour.",
  "alternativeExplanation": "The advisor-server comment is the stale artefact and the repo default is intended; in that case only the documentation is wrong.",
  "finalSeverity": "P1",
  "confidence": 0.85,
  "downgradeTrigger": "Maintainers confirm the launcher default is intended and correct advisor-server.ts:243-249 together with ENV-REFERENCE.md:370 and the cli-trusted-gate-refusal playbook; the finding then becomes a P2 documentation drift."
}
```

### P2 Findings

2. **The shadow delta log writes the raw prompt with default file and directory modes and no owner or symlink guard** -- .skilled/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts:135 -- `ShadowDeltaRecord` carries `prompt: string`, and `recordShadowDelta` creates the directory with `mkdirSync(dirname(logPath), { recursive: true })` and appends with `appendFileSync(logPath, ...)`, neither of which sets a mode or checks the owner.
Finding class: class-of-bug
Scope proof: `rg -n "ShadowDeltaRecord|shadow" runtime --glob "!**/dist/**"` shows this sink is the only writer of prompt text to a log, and the sibling receipt store in the same skill already implements the stronger contract (0700 dir, 0600 file, lstat owner check).
Affected surface hints: shadow-sink.ts:23-31 record shape -> shadow-sink.ts:135-141 append with default mode -> hooks/lib/route-receipt.ts:245-250 the 0700/0600 contract not applied here
Case: on a machine with two local accounts, shadow mode is on and another user reads runtime/data/shadow-deltas.jsonl (0644 under the usual 022 umask) to collect every prompt the first user typed.

3. **The prompt-time mutation refusal lives only in the CLI front door, not in the daemon that every client shares** -- .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:747 -- `assertTrustedForMutation` refuses a mutation when `promptTime` is set and is reached only from `validateCommand`, while the daemon builds caller context from `_meta` with no prompt-time concept at all.
Finding class: cross-consumer
Scope proof: `rg -n "promptTime|PROMPT_TIME"` over the runtime and hooks shows the flag is parsed and consumed only in skill-advisor-cli.ts and forced only by hooks/lib/skill-advisor-cli-fallback.ts:211; advisor-server.ts never reads it.
Affected surface hints: skill-advisor-cli.ts:747-761 prompt-time refusal -> skill-advisor-cli.ts:779 sole call site -> hooks/lib/skill-advisor-cli-fallback.ts:207-212 the env that keeps hooks on the CLI path -> advisor-server.ts:317-341 the socket dispatch that has no equivalent rule
Case: a new hook in the same skill calls the socket bridge directly to avoid the CLI cold-start cost and asserts `trusted: true`; no layer refuses the mutation at prompt time, and no test pins the CLI-only placement as an invariant.

## Traceability Checks

- spec_code (core, hard): partial. Compared the documented trusted-caller guarantee with the code: `.skilled/skills/system-skill-advisor/references/graph/propagate-enhances.md:76` states untrusted callers receive an authentication error before detection, and `advisor-server.ts:236-258` plus the launcher default in .skilled/bin/system-skill-advisor-launcher.cjs:70-79 make that conditional on the caller declining to claim authority. R1-P1-001 is the resulting finding; the protocol stays partial because no spec-document comparison of the advisor runtime ran this pass.
- checklist_evidence (core, hard): not run this iteration; it is a traceability-dimension activity and dimension 3 owns it.

## Integration Evidence

Exact surfaces checked as trust boundaries, not as nearby files:
- Daemon IPC dispatch: .skilled/skills/system-skill-advisor/runtime/advisor-server.ts:303-345 builds `CallerContext` from the caller-supplied `_meta` block and runs the handler inside it, so `requireTrustedCaller` sees exactly what the client sent.
- Hook to CLI bridge: .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:207-212 spreads the parent env and forces `SYSTEM_SKILL_ADVISOR_CLI_PROMPT_TIME=1`; :256-273 spawns `process.execPath` with the dist CLI and writes the prompt to the child stdin, never to a shell.
- CLI to daemon launcher: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1115-1121 spawns the launcher detached with the caller env, which is the path the launcher default rides in on.
- Python fallback: .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:331-400 spawns `python3 <workspaceRoot>/.skilled/.../skill_advisor.py --stdin` with an argv array and the prompt on stdin.

## Edge Cases

- Socket peer identity is not verified by the target: `JsonRpcSocketClient.connect` (skill-advisor-cli.ts:1181-1215) calls `net.createConnection` and never checks the peer uid. The ownership and mode hardening that would cover it lives in the shared transport (.skilled/skills/system-spec-kit/shared/ipc/socket-server.ts:259-290, 439-470, 570-580) and in .skilled/bin/lib/launcher-ipc-bridge.cjs, both outside the declared review target, so no finding was filed against the target; it is recorded here for the traceability pass.
- `SPECKIT_IPC_SOCKET_DIR` defaults to the fixed path /tmp/system-skill-advisor in skill-advisor-cli.ts:33 and hooks/lib/skill-advisor-cli-fallback.ts:92, while the effective socket path is composed from `dbDir` (skill-advisor-cli.ts:1365). Whether the fixed default is reachable at all depends on the bridge module outside the target; the fixed-path risk is therefore not claimed as a finding.
- Python and TypeScript state stores were compared for parity rather than reviewed separately: directive-lifecycle-store.py anchors every operation to a directory fd with O_NOFOLLOW, O_EXCL, uid and nlink checks, and route-receipt.ts applies the equivalent rule through `ownedFolder`; the two agree, so no parity finding.

## Confirmed-Clean Surfaces

- Mutation refusal in the CLI is structurally unreachable from a prompt-time hook: `assertTrustedForMutation` refuses when `promptTime` is set even if trust was asserted (.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:747-761), and the hook bridge forces that flag into every child env (hooks/lib/skill-advisor-cli-fallback.ts:211).
- No shell string carries a prompt: hooks spawn with argv arrays and `stdio: ["pipe","pipe","ignore"]` (hooks/lib/skill-advisor-cli-fallback.ts:256-273) and the runtime spawn uses `spawn(command, commandArgs)` with no `shell` option (runtime/lib/subprocess.ts:231-235).
- Receipt reads and writes are owner- and mode-checked before use, writes go through a `wx` temp file renamed into place, and a symlinked base or folder disables the store (hooks/lib/route-receipt.ts:228-260, 278-296).
- The Python store refuses a record whose file has more than one link, is not owned by the caller, or is group- or world-accessible, and it renames a temp file into place under the directory fd (hooks/lib/directive-lifecycle-store.py:39-45, 112-145).
- Lease liveness uses `process.kill(pid, 0)` only, so a workspace-controlled lease cannot be turned into a signal against another process (runtime/lib/daemon/lease.ts:248-270).

## Ruled Out

- Prompt injection steering a mutation through a hook: every hook path goes through the CLI, whose prompt-time refusal is set by env the wrapper controls, so the prompt never reaches a mutating tool (hooks/lib/skill-advisor-cli-fallback.ts:207-212, runtime/skill-advisor-cli.ts:747-761).
- Executing the workspace-resolved `skill_advisor.py` at prompt time as a supply-chain escalation (runtime/lib/subprocess.ts:337-347): this repository vendors `.skilled`, so the workspace copy is the installed product, and executing it is the same trust decision as running any repo tool. Recorded, not filed.
- A workspace-controlled lease file redirecting a signal at another process: liveness only probes with signal 0 and treats EPERM as held (runtime/lib/daemon/lease.ts:248-262).
- Unverified assumptions about `/tmp/system-skill-advisor` ownership: the shared bridge refuses a socket directory it does not own and one that is group- or world-writable, and refuses a non-socket leaf, which covers the bind and reclaim paths (.skilled/skills/system-spec-kit/shared/ipc/socket-server.ts:439-470, 570-580).

## Next Focus

- Dimension: traceability.
- Focus area: spec_code and checklist_evidence against the epic 016 packet and the advisor references, plus the socket peer-identity question recorded under Edge Cases (bridge module in .skilled/bin and the shared package).
- Reason: security covered the caller-authority, subprocess and state-file boundaries; the trust chain still has two unverified links outside the target, and the reference documents now contradict the shipped daemon default.
- Rotation status: security is reviewed but not closed; R2-P1-001 carries forward to synthesis, and R1-P2-001 through R1-P2-005 remain active.
- Required evidence: file:line receipts for each reference claim checked, and a named consumer for every traceability finding.

Review verdict: CONDITIONAL
