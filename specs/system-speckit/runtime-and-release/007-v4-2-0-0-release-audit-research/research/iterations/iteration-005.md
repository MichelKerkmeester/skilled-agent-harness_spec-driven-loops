# Iteration 5: Hub metadata paths and registry consumer

## Focus

Q3 follow-up: inspect stage-one hub metadata and the executor-registry consumer, then confirm every declared hub-router resource path resolves. Keep Q4 and Q5 for later iterations.

## Actions Taken

- Read the current config, state log, strategy, and findings registry first. Four canonical iterations were present, so this is iteration 5; the run session id is `2026-11-26T11:28:30Z`.
- Reviewed `routerPolicy.defaultResource` and `routerSignals[*].resources` in the current `mcp-browser-use`, `mcp-tooling`, and `cli-external-orchestration` hub routers.
- Ran a bounded Node `fs.existsSync` scan against each declared path relative to its owning hub directory. The scan checked 23 paths and each resolved to an existing file.
- Read the executor-registry loader and its fusion call site, then compared the loader's expected `packetKind`, `packetSkillName`, and `aliases` fields with the current CLI mode registry.
- Reviewed the previous Q3 static-manifest result in iteration 4. Did not repeat its registry/version comparison.

## Findings

1. All 23 declared hub-router resource paths resolve under their owning hub roots: 5 in `mcp-browser-use`, 8 in `mcp-tooling`, and 10 in `cli-external-orchestration`. The verified declarations are in each router's fallback and per-mode resource lists. [SOURCE: .skilled/skills/mcp-browser-use/hub-router.json:17] [SOURCE: .skilled/skills/mcp-browser-use/hub-router.json:36] [SOURCE: .skilled/skills/mcp-browser-use/hub-router.json:46] [SOURCE: .skilled/skills/mcp-browser-use/hub-router.json:56] [SOURCE: .skilled/skills/mcp-tooling/hub-router.json:20] [SOURCE: .skilled/skills/mcp-tooling/hub-router.json:39] [SOURCE: .skilled/skills/mcp-tooling/hub-router.json:53] [SOURCE: .skilled/skills/mcp-tooling/hub-router.json:63] [SOURCE: .skilled/skills/mcp-tooling/hub-router.json:73] [SOURCE: .skilled/skills/mcp-tooling/hub-router.json:83] [SOURCE: .skilled/skills/mcp-tooling/hub-router.json:93] [SOURCE: .skilled/skills/cli-external-orchestration/hub-router.json:22] [SOURCE: .skilled/skills/cli-external-orchestration/hub-router.json:40] [SOURCE: .skilled/skills/cli-external-orchestration/hub-router.json:50] [SOURCE: .skilled/skills/cli-external-orchestration/hub-router.json:60] [SOURCE: .skilled/skills/cli-external-orchestration/hub-router.json:70] [SOURCE: .skilled/skills/cli-external-orchestration/hub-router.json:80] [SOURCE: .skilled/skills/cli-external-orchestration/hub-router.json:90] [SOURCE: .skilled/skills/cli-external-orchestration/hub-router.json:100] [SOURCE: .skilled/skills/cli-external-orchestration/hub-router.json:110] [INFERENCE: based on the declared resource values and the 23-path filesystem existence scan.]
2. The executor-registry consumer's expected schema matches the active CLI registry: it keeps entries with `packetKind: "workflow"`, reads each `packetSkillName` and string aliases, and the registry currently declares eight workflow entries. Fusion passes the configured workspace root to the consumer. No static consumer/schema mismatch was found. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts:204] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts:211] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts:212] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts:267] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1514] [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:20] [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:57] [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:87] [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:118] [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:148] [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:179] [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:213] [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:242]

## Questions Answered

- Q3: Do the changed mcp-browser-use, mcp-tooling, cli-external-orchestration and cli-orca modes hold broken paths, registry or hub-router drift, or executor builder bugs? No issue was confirmed in the reviewed source and metadata. Iteration 4 found no registry/router mismatch or changed executor-builder defect; this follow-up resolved every declared resource path and found no consumer/schema mismatch. The compiled route CLI was not invoked, so this is source and metadata review rather than end-to-end route evidence. [SOURCE: specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/iterations/iteration-004.md:21] [SOURCE: specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/iterations/iteration-004.md:22] [SOURCE: specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/iterations/iteration-004.md:27] [SOURCE: .skilled/skills/mcp-browser-use/hub-router.json:17] [SOURCE: .skilled/skills/mcp-tooling/hub-router.json:20] [SOURCE: .skilled/skills/cli-external-orchestration/hub-router.json:22] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts:204]

## Questions Remaining

- Q4: Do the changed system-spec-kit runtime and hooks (decision-capture, session-handover, cli-dispatch, overlay-guard, git hooks) hold logic bugs or doc drift against what v4.2.0.0 claims?
- Q5: Do the doctor commands and skill, sk-doc, sk-code, sk-git, runtime mirrors, CI workflows and the v4.2.0.0 changelog agree with the code they describe?

## Ruled Out

- No missing or broken resource path was found among the 23 declarations checked.
- No field-shape mismatch was found between the current CLI mode registry and the executor consumer.
- The iteration 4 registry/version comparison was not repeated because strategy marks it exhausted.

## Dead Ends

- None.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none; no source read or filesystem scan failed. The compiled route CLI was not invoked, so runtime route decisions were outside this pass.

## Sources Consulted

- `.skilled/skills/mcp-browser-use/hub-router.json`
- `.skilled/skills/mcp-tooling/hub-router.json`
- `.skilled/skills/cli-external-orchestration/hub-router.json`
- `.skilled/skills/cli-external-orchestration/mode-registry.json`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/lib/registry-compiler.cjs`
- `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/iterations/iteration-004.md`
- `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/deep-research-strategy.md`

## Assessment

- New information ratio: 1.0
- Questions addressed: Q3 stage-one hub metadata, resource paths, and executor-registry consumer.
- Questions answered: Q3.
- Questions remaining: Q4 and Q5.

## Reflection

- What worked and why: resolving every declared resource against its owning hub root gave a direct answer to the remaining broken-path question; reading the consumer alongside the current registry confirmed the active field contract.
- What did not work and why: no compiled route invocation was made, so this pass establishes path existence and static consumer alignment, not an end-to-end routing result.
- What I would do differently: move to the Q4 runtime and hook surfaces next, keeping the compiled-route execution question separate unless new evidence makes it material.

## Recommended Next Focus

Q4: inspect the changed system-spec-kit runtime and hooks (decision-capture, session-handover, cli-dispatch, overlay-guard, git hooks) for logic bugs or doc drift against what v4.2.0.0 claims.
