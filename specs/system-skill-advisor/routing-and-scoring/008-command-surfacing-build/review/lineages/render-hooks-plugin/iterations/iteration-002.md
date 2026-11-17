# Review Iteration 002

## Dispatcher

- Mode: review (fan-out lineage `render-hooks-plugin`)
- Session: `fanout-render-hooks-plugin-1794550137809-1ecgc7`, generation 1, lineage mode `new`
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
- Area: `render-hooks-plugin`
- Operator review focus addressed this iteration: "safety of offering a mutating command" and "holdout hygiene, so no tune, fix or report path reads or leaks holdout rows". Both were executed directly: the command-offer guard was traced from the policy vocabulary to the rendered label, and the advisor runtime, hook library, plugin and session readers were searched for any holdout read path.
- Budget profile: `adjudicate` (9 analysis actions)

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:140-190`, `:188-262`, `:500-610` — label sanitizer, child downgrade, brief render
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:44-110` — policy and mutating vocabulary
- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:180-260` — spawn, env, stdout accumulation
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:60-100` — brief options surface
- `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:200-300` — child env, stdout cap, process-group kill
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:340-370`, `:470-510` — policy producer
- `.opencode/plugins/system-skill-advisor.js:255-300`, `:540-600`, `:1240-1280` — recommendations mapper, CLI spawn env
- `.skilled/hooks/shared/session-readers/claude.mjs:160-183`, `pi.mjs:162-174`, `devin.mjs:185-212`, `dsh.mjs:240-256` — injected-text boundary

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The child-session command downgrade is decided only by a process-wide env flag** -- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:522` -- `const childSession = options.childSession ?? process.env.AI_SESSION_CHILD === '1'`. The option exists on the renderer's own type (`render.ts:51`) but not on `SkillAdvisorBriefOptions` (`skill-advisor-brief.ts:75-82`, which carries `workspaceRoot`, `runtime`, `maxTokens`, `thresholdConfig` and `subprocessTimeoutMs` only), so no hook or plugin can classify a session per request. The OpenCode plugin then spawns the advisor CLI with the host's environment (`system-skill-advisor.js:1268`), and the hook fallback forwards that environment unchanged (`skill-advisor-cli-fallback.ts:206-212`). Every session a single host process serves therefore receives the same classification, and `parentNamedOnly` (`render.ts:194-199`) never fires for a child that the host dispatches in-process.
Finding class: cross-consumer
Scope proof: `rg -n "childSession" .skilled/skills/system-skill-advisor .skilled/hooks .opencode/hooks` returns the renderer only; `skill-advisor-brief.ts` exposes no such option, `skill-advisor-cli-fallback.ts:206-212` never sets or infers it, and `system-skill-advisor.js` never passes it. So the env flag at `render.ts:522` is the sole input on every production path.
Affected surface hints: ["brief renderer", "hook CLI fallback", "OpenCode advisor plugin", "child-session policy"]
Case: a host process that launched without `AI_SESSION_CHILD=1` dispatches an in-process subagent; that child's brief renders `/create:readme (start)` or `/deep:review (ask)` as fully visible instead of `(parent-named)`, so the child is invited to start a command the guard exists to withhold.

```json
{
  "type": "claim",
  "claim": "The child-session command downgrade depends on a process-wide environment flag that no caller can override per session, so a child rendered by a host process launched as a parent receives no downgrade.",
  "evidenceRefs": [
    ".skilled/skills/system-skill-advisor/runtime/lib/render.ts:522",
    ".skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:75",
    ".skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:206",
    ".opencode/plugins/system-skill-advisor.js:1268"
  ],
  "counterevidenceSought": "Searched every caller of renderAdvisorBrief for an explicit childSession argument; found none outside the renderer's own type. Checked whether childEnvForCli sets AI_SESSION_CHILD per request; it sets SPECKIT_IPC_SOCKET_DIR and SYSTEM_SKILL_ADVISOR_CLI_PROMPT_TIME only.",
  "alternativeExplanation": "Each host may dispatch children as fresh processes started with AI_SESSION_CHILD=1, in which case the flag is correct for every child and the guard holds. The reviewed code cannot distinguish that deployment from an in-process one.",
  "finalSeverity": "P1",
  "confidence": 0.6,
  "downgradeTrigger": "Proof that every host which renders a child brief launches a dedicated process with AI_SESSION_CHILD=1 set at spawn; that would make the env flag a faithful per-session signal and reduce this to P2 (missing per-session override)."
}
```

### P2 Findings

2. **The low-level advisor spawn accumulates child output without a byte cap** -- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:239` -- `stdout += chunk` runs with no ceiling, while the hook fallback caps the same stream through `capStdout` against `MAX_STDOUT_BYTES` (`skill-advisor-cli-fallback.ts:214-219`). Only `timeoutMs` bounds the wait, so a child that keeps writing grows the caller's heap for the whole timeout.
Finding class: cross-consumer
Scope proof: `subprocess.ts` defines no `MAX_*` constant and both `stdout +=` and the stderr listener append unbounded; the fallback path in the same skill caps both, so the two consumers of one CLI disagree on boundedness.
Affected surface hints: ["advisor subprocess", "hook CLI fallback", "advisor daemon"]
Case: a CLI that emits a long stream — a runaway log line or a large JSON envelope — grows the parent process memory without limit until the timeout kills it.

3. **The child downgrade reads mutability from the skill row, not from the command that is printed** -- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:233` -- `policyWord(policy, row?.mutating, childSession)` takes `mutating` from `commandRowFor(recommendation.skill)`, while the printed command may come from `recommendation.command` (`render.ts:226`). When a recommendation supplies its own command and the row for its skill describes a different one, the downgrade decision is made on the row's mutability rather than the command's.
Finding class: instance-only
Scope proof: `render.ts:223-237` is the only label builder; `row?.mutating` is read exactly once at `:233`, and `advise` producers in `advisor-recommend.ts:356-359` and `:502-503` always pair a command with its own row, which is the counterevidence that keeps this advisory.
Affected surface hints: ["brief renderer", "command label", "child-session policy"]
Case: a recommendation from a caller that attaches `/doctor:overlay apply` while resolving the read-only `sk-doc` row renders `(run)` in a child because `row.mutating` says `read-only`.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | The three-word policy vocabulary at `command-attach.ts:50` (`run`/`start`/`ask`) maps one-to-one onto `parentNamedOnly` at `render.ts:194-199`; no policy value escapes the downgrade except `run` with `read-only`. |
| `checklist_evidence` | core | pending | Deferred to the traceability dimension. |
| `skill_agent` | overlay | pending | Deferred. |
| `agent_cross_runtime` | overlay | partial | The downgrade is the same code on every runtime, which is exactly why finding 1 is cross-runtime rather than runtime-specific. |
| `feature_catalog_code` | overlay | pending | Deferred. |
| `playbook_capability` | overlay | notApplicable | No playbook row covers this area. |

## Holdout Hygiene Check

- Searched `.skilled/skills/system-skill-advisor/runtime/lib`, `runtime/skill-advisor-cli.ts`, `hooks/`, `.opencode/plugins/system-skill-advisor.js` and `.skilled/hooks/shared` for `holdout`. The only hit is prose in `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook-validation.md:94` ("Corpus/holdout/parity/safety/latency slices still render"), which is a validation note, not a read path.
- No tune, fix, report or scoring path inside this area opens `holdout-prompts.jsonl` or the split holdout inside `command-prompts.jsonl`. Recorded as a confirmed-clean surface, not as a finding. No holdout row was read or printed by this iteration.

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:356-359` and `:502-503` both take `policy` from the same generated row as `command`, so the renderer's `recommendation.policy ?? row?.policy` precedence (`render.ts:227`) does not currently diverge from the row.
- `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:279-292` documents and implements a process-group kill for the shim's grandchild (`detached: true` plus `process.kill(-pid)`), so a timed-out advisor cannot outlive the hook budget.
- `.opencode/plugins/system-skill-advisor.js:1123-1124` bounds concurrent advisor runs at 2, and `:1268` passes the inherited environment to each spawn.

## Edge Cases

- **Same-process vs per-process child dispatch (finding 1):** the reviewed code cannot tell these apart. The finding states the in-process case as its reach and records the per-process case as the downgrade trigger, rather than asserting which host does which.
- **Declaration files:** not re-entered, per the exhausted-approach record.
- **`cursor` runtime:** declared `gated` in the capability table (`index.mjs:59-64`) and has no reader in this area's changed set, so it is outside the operator's named six and was not reviewed as a security surface.

## Confirmed-Clean Surfaces

- `render.ts:159-175` refuses a skill label that is multi-line or matches `INSTRUCTION_LABEL_PATTERN`, so a repository-authored label cannot place a second line into the brief.
- `render.ts:194-199` downgrades every `start`, every `ask` and every non-read-only `run` to `PARENT_NAMED_POLICY` for a child, which is the intended containment shape; the defect in finding 1 is the input to this function, not the function.
- `skill-advisor-cli-fallback.ts:277-278` sends the user's prompt on stdin, never in argv, so it does not appear in the process table.
- `skill-advisor-cli-fallback.ts:214-219` caps the fallback path's stdout at `MAX_STDOUT_BYTES`.
- `claude.mjs:174-183`, `pi.mjs:165-174`, `devin.mjs:189-212` and `dsh.mjs:244-256` all keep injected harness text out of `records`, so one runtime's stored hook brief cannot be re-read as operator text.
- `.opencode/plugins/system-skill-advisor.js:1631-1657` wraps the whole delivery path so a failure injects a status-headed fallback and never blocks the prompt; no path writes to stdout or stderr.

## Ruled Out

- "The plugin passes the raw CLI stdout into model context": ruled out. `cliRecommendations` (`system-skill-advisor.js:558-591`) copies only `skillId`, numeric scores, `command`, `policy`, `ownerSkillId`, `needsMode` and `ambiguousWith`, each type-checked.
- "A recommendation can relabel a mutating command as `read-only` to escape the child downgrade": ruled out. `command-attach.ts:50-51` is the only `mutating` vocabulary, `render.ts:233` reads it from the generated row, and the CLI response has no `mutating` field (verified against `skill-advisor-cli-fallback.ts:228-245` and `advisor-recommend.ts:356-359`).
- "The hook fallback leaves an advisor grandchild running after a timeout": ruled out. `skill-advisor-cli-fallback.ts:279-292` kills the process group.
- "An env-secret value reaches the advisor through argv": ruled out. The payload is written to stdin.

## Next Focus

- Dimension: traceability
- Focus area: docs-versus-code drift across `feature-catalog/cli-surface/advisor-recommend.md`, `feature-catalog/cli-surface/skill-advisor-cli.md`, `feature-catalog/hooks-and-plugin/claude-hook.md`, `hooks/skill-advisor-hook.md`, `hooks/lib/README.md`, `.opencode/plugins/README.md`, and `runtime-mirrors/README.md`, checked against the code this iteration and iteration 1 read.
- Reason: three P1-relevant behaviours are now pinned (child downgrade input, fallback envelope, injected-text boundary); the documents that describe them must be checked before the finding set freezes.
- Rotation status: D1 and D2 complete, D3 next, D4 after.
- Blocked/productive carry-forward: `.d.mts` parity stays blocked; the `README`-vs-constant comparison (found `SPECKIT_OPENCODE_HOOK_TIMEOUT_MS` documented as 3000 against `DEFAULT_BRIDGE_TIMEOUT_MS = 2500`) is productive and becomes concrete evidence this iteration.
- Required evidence: `file:line` on both sides of every doc claim.

Review verdict: CONDITIONAL
