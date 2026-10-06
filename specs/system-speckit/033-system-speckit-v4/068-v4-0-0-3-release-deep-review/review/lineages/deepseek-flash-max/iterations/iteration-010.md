---
title: "Deep Review Iteration 010 — system-skill-advisor runtime"
trigger_phrases: []
---

# Iteration 10: Correctness — system-skill-advisor runtime

## Focus

Dimension: **correctness**. Slice: the advisor's front door and trust surfaces —
`.skilled/bin/skill-advisor.cjs` (shim preflight, socket dir, dist freshness, exit taxonomy),
`runtime/tools/advisor-recommend.ts` (command schema), `runtime/skill-advisor-cli.ts`
(trust default, degraded fallback marking), `runtime/lib/auth/trusted-caller.ts`,
`runtime/lib/compat/daemon-probe.ts`, and the socket server's bind hardening in
`system-spec-kit/shared/ipc/socket-server.ts`. Static review only: the CLI is daemon-backed and a
live invocation could write state outside this lineage's containment.

## Files Reviewed

- `.skilled/bin/skill-advisor.cjs` (full, 1-117)
- `.skilled/skills/system-skill-advisor/runtime/tools/advisor-recommend.ts` (schema and description)
- `.skilled/skills/system-skill-advisor/runtime/dist/runtime/skill-advisor-cli.js` (trust default, option parsing; source line references below)
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts` (degraded fallback, lines 1476-1534)
- `.skilled/skills/system-skill-advisor/runtime/lib/auth/trusted-caller.ts` (full)
- `.skilled/skills/system-spec-kit/shared/ipc/socket-server.ts` (bind hardening, lines 430-470)
- `.skilled/skills/system-skill-advisor/SKILL.md` (§ CLI front door, lines 297-344), `README.md` (§ guardrails), `references/runtime/cli-front-door-contract.md` (referenced)
- `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:388` (trust env row)

## Findings

### P0 Findings

None.

### P1 Findings

None new. Carried: F001 and F002 remain active (unchanged this iteration).

### P2 Findings

None new. Carried: F003-F007 remain active (unchanged this iteration).

## Claim Adjudication

No new findings. Two candidate observations were checked to ground rather than reported: the
undocumented-looking second trust env name, and the degraded-fallback claim; both are documented
or implemented as claimed (see Ruled Out).

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | carried partial (iteration 8) | Unchanged this iteration. |
| `checklist_evidence` | carried partial (iteration 8) | Unchanged this iteration. |
| `skill_agent` | carried pass at surface level | Advisor surfaces checked this iteration remain consistent. |

## Ruled Out

- "The CLI contract in `SKILL.md` diverges from the implemented command": ruled out — `advisor_recommend` requires a non-empty `prompt` (max 10,000) and supports `includeAbstainReasons` (`advisor-recommend.ts:13-20`), matching the documented `--json '{"prompt":…}'` invocation and its failure-mode notes (`SKILL.md:297-301`).
- "Trust resolution can default to trusted": ruled out — the default is `SYSTEM_SKILL_ADVISOR_CLI_TRUSTED === '1' || SPECKIT_SKILL_ADVISOR_CLI_TRUSTED === '1'`, else untrusted (`skill-advisor-cli.js:300-301, 344`), `--untrusted` can force it back off (`:400-401`), and the guard refuses anything without `trusted === true` (`trusted-caller.ts:23-40`).
- "A second trust env name is undocumented": ruled out — `ENV-REFERENCE.md:388` records the primary name, its purpose, the mutation commands it unlocks, and the `SPECKIT_SKILL_ADVISOR_CLI_TRUSTED` alias.
- "The daemon-unreachable fallback can masquerade as a live answer": ruled out — the fallback path sets `degraded: true` and an explanatory field beside the recommendations (`skill-advisor-cli.ts:1531-1534`), and the docs state a degraded answer is stale rather than missing.
- "`/tmp/system-skill-advisor` is an insecure predictable temp directory": ruled out on the bind side — the server refuses a pre-existing socket dir not owned by the current uid, refuses a group/world-writable dir, and refuses to bind over a symlink at the socket path (`socket-server.ts:437-468`), with the attacker-planted-dir case named in the comment.
- "A stale or missing dist can still serve": ruled out — the shim checks package freshness and exits 69 (protocol) or 75 (retryable, warm-only) before spawning the daemon CLI (`skill-advisor.cjs:70-83`), matching the documented exit taxonomy.

## Dead Ends

- Invoking the advisor CLI end to end: not attempted — it cold-starts a daemon and writes under a state directory outside the lineage; the contract checks above are static and the limitation is stated.

## Assessment

- New findings ratio: 0.0 (no new findings; weighted new = weighted total = 0)
- Dimensions addressed: correctness (advisor slice)
- Novelty justification: the advisor's front door, trust defaults and fallback marking were read against the documented contract and against the socket server's own hardening; every claim checked resolves, and the two near-misses were closed by locating the documenting line before writing anything down.

## Next Focus

Dimension: correctness / cross-skill. Focus area: the contract surface between `system-spec-kit` and `system-deep-loop` — `shared/review-research-paths.cjs`, artifact-root resolution, the gateway's stem/schema names consumed by spec-kit tooling, and the contract-parity tests the release ships. Required evidence: both sides of each contract read at file:line. Rotations status: cross-skill pass 1 of 3.

Review verdict: CONDITIONAL
