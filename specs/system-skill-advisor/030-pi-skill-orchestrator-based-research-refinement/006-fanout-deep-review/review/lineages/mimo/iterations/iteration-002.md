# Iteration 002 - Security (hooks, daemon request path, plugin mirror)

Resolved route: mode=review target_agent=deep-review

- **Iteration**: 2 of 3 (mimo lineage, `stopPolicy: max-iterations`)
- **Focus**: security — trust boundaries between prompt content, hook shims, the advisor CLI/daemon path, and the OpenCode plugin mirror
- **Session**: fanout-mimo-1790437845885-htqb7q | generation 1 | lineageMode new

## Dimension

Security (injection, exposure, trust boundaries) over the phase-2/3 surfaces: the hook deadline nesting in the system-spec-kit shim, the hook-side CLI spawn (`skill-advisor-cli-fallback.ts`), the daemon request path and stale-daemon retry (`skill-advisor-cli.ts`), the prompt-brief renderer guard, and the plugin mirror.

## Files Reviewed

- `.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:85-150` (shim deadline nesting, bounded stdin)
- `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:40-330` (envelope, request build, CLI spawn)
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1385-1465,1055-1100` (stale-daemon retry, socket-dir guard)
- `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:225-310` (deadline race, dedup delivery)
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:225-345` (gate ordering, render, dedup)
- `.opencode/plugins/system-skill-advisor.js:238-247,640-760` (shadow renderer load, brief parse/render)
- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:170-264` (contrast: stdin prompt transport)

## Findings by Severity

### P0

None. No remotely reachable vulnerability, injection sink, or auth boundary break found: labels pass `sanitizeSkillLabel` and rendering fails closed when the shadow renderer cannot load (`.opencode/plugins/system-skill-advisor.js:244-247,681-704`), the IPC socket directory is created `0o700` and refused when group/world-writable (`.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1056-1066`), every child spawn uses argv arrays with no shell interpolation and capped stdout, and the casual-prompt gate skips only the advisor call — the hygiene directives still ride the fallback heads (`.skilled/skills/system-skill-advisor/runtime/lib/render.ts:481-486`).

### P1

None.

### P2

**R2-P2-001 — the hook's advisor CLI child receives the full user prompt in its process arguments.**
`runCliRecommend` spawns the CLI with `--json JSON.stringify(payload)` where `payload.prompt` is the raw turn text (`.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:214-246`). Process arguments are readable by any local user via `ps` and are commonly captured by crash reporters and audit tooling; hook prompts routinely embed source code, file paths and occasionally tokens. The same subsystem already carries prompts safely over stdin (`runtime/lib/subprocess.ts:204`, "prompt input carried over stdin"), so the transport is inconsistent rather than required by the CLI. On a single-user workstation the exposure is small; on shared hosts or managed CI it is a genuine disclosure channel. Counterfactual for severity: deployment on shared hosts would make this a P1.

**R2-P2-002 — the shim's nested deadline holds only when the operator has not set `SPECKIT_CLAUDE_HOOK_TIMEOUT_MS`.**
The shim seeds the child's advisor budget to `CHILD_TIMEOUT_MS - CHILD_START_MARGIN_MS` only when the env is unset or empty (`.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:102-106`); any operator value at or above the 2,500 ms `CHILD_TIMEOUT_MS` passes through unchanged and the child is then `SIGKILL`ed at 2,500 ms (`:114-116`) before its fallback can emit — the exact dropped-fallback failure phase 2 exists to fix returns under a plausible config. A clamp of `min(env, CHILD_TIMEOUT_MS - margin)` would make the invariant unconditional. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:102-116]

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| spec_code | core | partial | Phase 2 R1/R12 and phase 3 R2/R5 mechanisms located and checked against their motivating failure modes |
| checklist_evidence | core | n/a | Level 1 packet, no checklist.md |
| skill_agent | overlay | partial | plugin mirror renders through the canonical compiled renderer (guard parity holds) |
| agent_cross_runtime | overlay | partial | shim/Claude/Pi paths reviewed; Codex/Cursor/Devin shims inherit the Claude handler (deferred full pass to iteration 3) |
| feature_catalog_code | overlay | n/a | — |
| playbook_capability | overlay | n/a | — |

## Verdict

PASS with advisories — no P0/P1; two P2 findings (R2-P2-001, R2-P2-002).

`newFindingsRatio` this iteration: 0.10 (weighted new findings (1+1)/20; weights P0=10, P1=5, P2=1).

## Next Dimension

Traceability and maintainability — manifest vs `../002..005` requirements, test coverage mapping, docs (`skill-advisor-hook.md`, `ARCHITECTURE.md`, cache-optimizer README), and the remaining cross-runtime shims.

Review verdict: PASS
