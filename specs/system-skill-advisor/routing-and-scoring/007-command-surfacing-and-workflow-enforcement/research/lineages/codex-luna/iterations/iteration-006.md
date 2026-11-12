# Iteration 6: Plain-chat command routing

## Focus

Investigate Angle 6: how a user who never types a slash command can reach the matching command workflow, and where the current plain-chat path has coverage limits. The reducer still recommends Q1 on source-of-truth, while the dispatch orders chat-only users sixth; I followed the explicit angle and retained Q1 for synthesis.

## Findings
1. The hook reads ordinary user prompt text and passes it to the advisor CLI. The TypeScript explicit lane scores declared keywords and intentSignals; the /create:agent bridge, for example, includes “create new agent,” “new agent,” and “make new agent.” This supports plain-chat routing without a leading slash. It only works when a command has an active bridge with useful phrases. [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:33-38] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:377-410] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:14-45]

2. AGENTS Gate 2 specifies the non-hook path: call advisor_recommend directly when no hook brief is present, then invoke a skill when confidence reaches 0.8. A runtime-independent model instruction can therefore call the same advisor on ordinary chat, then follow the selected command/owner workflow. This supports a shared fallback; it does not bypass each command's mode, argument or safety gates. [SOURCE: AGENTS.md:63-70] [SOURCE: .skilled/commands/doctor/git.md:12-20]

3. The inventory contains 45 command files, but five shipped command identifiers are absent from the projection under their own names; the generated sources are 19 metadata entries, 8 allow-list entries and 35 doctor routes, with route multiplicity and aliases. Exact-name absence does not prove a workflow is unreachable, but the current counts do not prove all 45 have a chat phrase and enabled route. [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/iterations/iteration-001.md:12-14] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:4-10]

4. Plain-chat matching is not runtime-uniform for doctor routes: the README says TypeScript derives natural-language keywords and intent signals, while Python matches doctor bridges only on typed slash commands. Since the advisor CLI may fall back to Python with degraded status, a chat-only diagnostic request can be lost on that fallback path. The shared CLI and bridge metadata support most routes; the specific doctor behavior contradicts parity for no-slash prompts. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md:58-62] [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:38]

5. Hook no-match behavior is not a generic command resolver. The prompt gate skips brief acknowledgements, the renderer can return “no skill matched,” and only setup/health wording gets the /doctor:setup fallback. Keep that targeted fallback; do not claim it resolves arbitrary requests. A positive command phrase bridge supports plain-chat routing, while the narrow no-match fallback contradicts universal coverage. [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:35-43] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:509-523]

## Ruled Out

- Requiring a leading slash before command intent can be scored; bridge metadata can carry natural-language keywords and intentSignals.
- Assuming TypeScript and Python doctor matching are equivalent for chat-only requests; the bridge documentation says Python's doctor match requires a typed slash command.

## Dead Ends

- None established. Exact-name gaps and runtime-specific matching remain open; an all-command phrase coverage map is still needed.

## Edge Cases

- Contradictory evidence: TypeScript bridge metadata supports plain phrases; Python doctor fallback matches only typed slash commands. The command reach claim is therefore runtime-path dependent.
- Missing dependencies: None for the tested source data.
- Partial success: Plain-chat path is clear for active TypeScript bridge routes and direct AGENTS fallback; full 45-command phrase coverage and parity are not established.
- Ambiguous input: Reducer Next Focus remains Q1, but the dispatched sequence names Angle 6; followed the explicit sequence and carried Q1 forward.

## Sources Consulted

- .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:33-43
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:377-410
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:4-10, 14-45
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md:58-62
- AGENTS.md:63-70
- .skilled/commands/doctor/git.md:12-20
- specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/iterations/iteration-001.md:12-14
- specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-strategy.md:254-255

## Assessment

- New information ratio: 0.90 (four findings map the plain-chat path and current gaps; one extends runtime parity evidence).
- Questions addressed: No-slash phrase scoring, direct CLI fallback when no hook is present, and coverage asymmetry.
- Questions answered: None fully. The path exists, but all-45 route coverage and consistent behavior across active runtimes need a canonical route map and measurement.

## Reflection

- What worked and why: Reading the hook, explicit lane, generated bridge example and compatibility guide established the full plain-language path and a concrete Python fallback exception.
- What did not work and why: The generated bridge counts are not command-file coverage counts; aliases and multi-target routes make row totals insufficient to prove that each command matches chat language.
- What I would do differently: Build a command-by-command prompt corpus from canonical metadata and test both hook and direct-CLI paths across each active runtime.

## Recommended Next Focus

Angle 7: analyze how each command's owning skill is represented and loaded, whether command and skill identities should share one record, and how the selected workflow path survives routing into the skill.
