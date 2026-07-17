# Iteration 4: Threshold and prompt-policy synchronization

## Focus

This iteration tested Q3 narrowly: whether prompt eligibility and recommendation acceptance are actually duplicate threshold paths, and whether the Claude hook and MCP recommendation tool converge on the same default, environment, and call-specific confidence/uncertainty policy.

## Actions Taken

1. Traced the compatibility defaults and environment resolution.
2. Traced `shouldFireAdvisor` prompt eligibility and its independently configurable prompt-policy thresholds.
3. Traced MCP `advisor_recommend` option resolution through the handler and scorer.
4. Traced the Claude hook handoff into the shared brief builder.
5. Ran the filename-filtered prompt-policy, brief, compatibility, and recommendation Vitest files. Targeted Vitest files passed (11 files).

## Findings

1. `shouldFireAdvisor` is not a second implementation of the 0.80/0.35 recommendation gate. It decides whether a prompt merits advisor work using prompt length, meaningful-token, work-intent, casual-acknowledgement, command, and explicit-marker rules. Those integer thresholds have their own `SPECKIT_ADVISOR_PROMPT_POLICY_*` overrides. Recommendation confidence and uncertainty are evaluated only after this eligibility stage. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/prompt-policy.ts:46] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/prompt-policy.ts:100]

2. The recommendation paths do share one default/environment resolver. `resolvedConfidenceThreshold` and `resolvedUncertaintyThreshold` own the 0.80/0.35 defaults and validate `SPECKIT_ADVISOR_CONFIDENCE_THRESHOLD` / `SPECKIT_ADVISOR_UNCERTAINTY_THRESHOLD` within 0..1. The brief builder snapshots those resolved defaults and `resolveAdvisorThresholdConfig` gives call-specific values precedence; the MCP handler calls that same resolver for public effective thresholds and forwards the same call options into scoring. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/compat/contract.ts:5] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-advisor-brief.ts:112] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-advisor-brief.ts:137] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:369] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:418]

3. The Claude hook does not carry an independent confidence/uncertainty implementation; it delegates the prompt to `buildSkillAdvisorBrief`, whose shared resolver, subprocess forwarding, local post-filter, cache key, and renderer all receive the same `thresholdConfig`. This establishes code-level parity between hook-side recommendation acceptance and MCP-side call overrides, while leaving prompt eligibility intentionally separate. [SOURCE: .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:.opencode/skills/system-skill-advisor/mcp_server/tests/hooks/runtime-parity.vitest.ts:99:] [SOURCE: .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:.opencode/skills/system-skill-advisor/mcp_server/tests/legacy/advisor-prompt-cache.vitest.ts:19:] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-advisor-brief.ts:401] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-advisor-brief.ts:481] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-advisor-brief.ts:506]

4. Environment overrides are resolved into module-level constants, so they are synchronized for a normally started process but do not dynamically refresh if `process.env` changes after module import. Call-specific overrides remain dynamic and win through nullish precedence. This is a test-isolation and long-lived-process caveat, not evidence of current cross-path numeric drift. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/compat/contract.ts:17] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-advisor-brief.ts:112] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/prompt-policy.ts:30] [INFERENCE: module-level constant initialization plus per-call nullish override ordering]

## Questions Answered

- Q3: Answered. There is no semantic requirement for `shouldFireAdvisor` to share the recommendation thresholds because it is an earlier eligibility gate. After eligibility, the Claude brief path and MCP handler share the compatibility defaults/environment resolver and honor call-specific overrides through the same resolution function.

## Questions Remaining

- Q1 remains: quantify RRF normalization, confidence-floor saturation, ambiguity clusters, and held-out correctness.
- Q5 remains: prioritize implementation changes, including an explicit cross-surface parity matrix for defaults, valid/invalid environment overrides, and call-specific overrides.
- The test inventory should be strengthened with one named end-to-end parity suite even though the targeted existing tests passed in this run.

## Ruled Out

- Treating `shouldFireAdvisor` prompt eligibility as a duplicate or drifting copy of the confidence/uncertainty acceptance gate. The code separates these stages and their configuration domains.

## Dead Ends

None. The initially referenced hook path was relative to the skill root rather than the MCP server root; resolving it from the repository located the canonical hook without changing the research direction.

## Edge Cases

- Ambiguous input: The word "synchronization" can mean shared numeric values or coordinated stage behavior. This iteration answered both by separating eligibility from acceptance.
- Contradictory evidence: None.
- Missing dependencies: Spec Memory remained unavailable by prior packet state and was not retried because that direction is blocked.
- Partial success: None; targeted tests passed.

## Sources Consulted

- `.opencode/skills/system-skill-advisor/mcp_server/lib/compat/contract.ts:5-35`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/prompt-policy.ts:30-197`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-advisor-brief.ts:112-163,401-513`
- `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:369-424,485-498`
- `.opencode/skills/system-skill-advisor/mcp_server/tools/advisor-recommend.ts:12-35`
- `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:.opencode/skills/system-skill-advisor/mcp_server/tests/hooks/runtime-parity.vitest.ts:99:`
- Targeted Vitest command over: `tests/handlers/advisor-recommend.vitest.ts`, `tests/handlers/advisor-recommend-descriptor-parity.vitest.ts`, `tests/handlers/advisor-recommend-unavailable.vitest.ts`, `tests/legacy/advisor-prompt-policy.vitest.ts`, `tests/compat/python-compat.vitest.ts`, `tests/compat/plugin-bridge.vitest.ts`, `tests/compat/plugin-bridge-smoke.vitest.ts`, `tests/compat/redirect-metadata.vitest.ts`, `tests/compat/shim.vitest.ts`, `tests/compat/daemon-probe.vitest.ts`, `tests/compat/README.md`

## Assessment

- New information ratio: 0.85
- Novelty justification: Two findings were new and two refined earlier threshold-path evidence; the stage separation removes a false parity requirement.
- Questions addressed: Q3
- Questions answered: Q3
- Confidence: High for source-level stage and precedence behavior; medium for operational parity across process restarts because environment mutation-after-import is not a supported live reconfiguration path.

## Reflection

- What worked and why: Following configuration values from their owning resolver into both consumers exposed the actual shared boundary.
- What did not work and why: Searching for the hook beneath `mcp_server/hooks` failed because the canonical skill hook is a sibling of `mcp_server`.
- What I would do differently: Start cross-surface traces from imported symbols and resolve their real paths before running focused tests.

## Next Focus

Q1: empirically quantify shared RRF normalization, confidence-floor saturation, ambiguity clusters, and held-out correctness. Carry Q3 into Q5 as a concrete recommendation: add one table-driven parity suite covering defaults, invalid and valid environment values at fresh module load, and per-call overrides across hook brief and MCP handler.

## SCOPE VIOLATIONS

None.

