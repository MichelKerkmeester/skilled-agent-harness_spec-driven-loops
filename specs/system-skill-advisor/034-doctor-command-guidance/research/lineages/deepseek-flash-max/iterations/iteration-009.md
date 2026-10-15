---
title: "Iteration 9: Ideas to reject, with reasons"
trigger_phrases: []
---
# Iteration 9: Ideas to reject, with reasons

## Focus

Answer Q9: name the candidate ideas to reject and the reason each fails. This iteration consolidates the rejects already recorded in earlier iterations and adds the ones the full evidence picture now makes rejectable, each grounded in the binding constraint it violates.

## Actions Taken

- Re-verified the binding constraints that ground the rejections: advisory-only hook contract, no-MCP architecture, interactive doctor mode, mutation-bearing targets, and projection-based scoring inputs.
- Consolidated every earlier `ruled_out` record and added newly rejectable ideas.

## Findings

1. Reject: auto-dispatching or auto-running a doctor command from the advisor. The hook contract is advisory-only and must never replace explicit skill loading, and every doctor route runs `execution_mode: INTERACTIVE`; the advisor can name a command but cannot execute it. [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:21] [SOURCE: .skilled/commands/doctor/skill-advisor.md:42]

2. Reject: faking a skill id per doctor route to reuse skill plumbing. Commands already have a first-class `kind: 'command'` projection path with `routingEnabled` and generated bridges; fake skills would pollute skill lifecycle state, dashboards and the skill namespace for no routing gain. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:75-151]

3. Reject: a special lower confidence threshold for doctor commands. Thresholds are uniform and calibrated (0.8 confidence / 0.35 uncertainty in the measured envelopes), and phrase specificity plus documented gates already carry the routing signal; a special threshold would emit weak recommendations and break the shared calibration semantics. [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-01.json]

4. Reject: teaching the advisor to inspect repository state before recommending a doctor route. The advisor scores a prompt against a projection; state inspection is exactly what the doctor batteries exist to do, and doing it early would add IO and failure modes to every prompt. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1103-1144]

5. Reject: reading `_routes.yaml` live on every advisor request. Scoring inputs are the SQLite projection (or the filesystem fallback) plus the committed bridges; a runtime file read would drift from the pinned projection the drift guard protects. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1226-1242]

6. Reject: stuffing doctor phrases into sk-git, sk-code or sk-doc `graph-metadata.json`. A skill's `graph-metadata.json` is what makes that skill routable, so this routes users to the skills rather than the doctor commands - the wrong destination - and pollutes curated skill signals the reach check tracks. [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:338] [SOURCE: .skilled/commands/doctor/_routes.yaml:14-21]

7. Reject: relaxing the doctor input gate to let routers guess a target. Several targets mutate real state (git config hook keys, `.sk-git/` standards, advisor lane files and the skill graph database); guessing is precisely what the gate exists to prevent. The advisor stays a recommendation, the operator keeps the choice. [SOURCE: .skilled/commands/doctor/git.md:13-18] [SOURCE: .skilled/commands/doctor/_routes.yaml:236-273]

8. Reject: shipping an MCP server or transport for doctor diagnostics. The advisor package ships no MCP transport by design (no stdio server, no SDK, no server declaration); doctor commands are CLI/command surfaces, and a server would multiply the surface with no routing benefit. [SOURCE: .skilled/skills/system-skill-advisor/ARCHITECTURE.md:22]

9. Reject: unconditional onboarding guidance on every prompt. The brief is a bounded advisory line built to route one prompt; always-on text spends the injection budget and undermines the honest `no skill matched` status. Onboarding guidance belongs to matched onboarding phrases and optionally one bounded fallback sentence. [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:43]

10. Reject: expanding the hook fallback into a routing table. Fallback text is injected on every unmatched prompt, and its current shape is a single status line plus the directives block; a table would bloat the smallest useful output. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:476-487]

11. Reject: building the onboarding battery as a new skill instead of a command. The deliverable is a diagnostic run across existing owned checks; the command family already provides the route manifest, presentation contract, mutation classes and validation, while a new skill would add a routing identity with no workflow of its own. [SOURCE: .skilled/commands/doctor/_routes.yaml:23-33]

12. Reject: a big-bang launch admitting all thirteen routes at once. Measured contested phrases tie with incumbents when duplicated, so the staged path is: umbrella plus currently-empty phrases first, then contested routes one at a time behind the slice gates. [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-index.json]

## Carried Ruled-Out (from iterations 1-8)

- Harvester extension to parse `_routes.yaml` (iteration 5): new root and file type in two implementations.
- Hand-written `PHRASE_BOOSTS` as primary admission (iteration 5): bypasses inventory, parity and drift guard.
- One bridge per doctor command (iteration 5): target granularity required by the input gate.
- Verbatim phrase duplication (iteration 6): measured ties, not handoffs.
- Relying on the 0.08 command demotion (iteration 6): too small and slashless-only.
- Onboarding as a `/doctor:skill-advisor` target (iteration 7): ownership mismatch.
- Per-route bridges alone as onboarding answer (iteration 7): no single generic route.
- New accuracy harness from scratch (iteration 8): corpus, gate and probe already exist.
- Reach probe reuse unchanged (iteration 8): hub filter excludes doctor commands.

## Ruled Out

- This iteration's rule-set is itself the reject list; no additional dead ends.

## Dead Ends

- None.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts
- .skilled/skills/system-skill-advisor/ARCHITECTURE.md
- .skilled/commands/doctor/skill-advisor.md
- .skilled/commands/doctor/git.md
- .skilled/commands/doctor/_routes.yaml
- events/measure-iter2-01.json, measure-iter6-index.json

## Assessment

- New information ratio: 0.6
- Questions addressed: reject list (Q9)
- Questions answered: Q9

## Reflection

- What worked and why: verifying the binding constraints (advisory-only, no MCP, interactive mode, mutation classes) turned each rejection into a rule violation rather than a preference.
- What did not work and why: mostly synthesis; the only fresh evidence is the constraint verification.
- What I would do differently: nothing material; the reject list needed the full design first.

## Recommended Next Focus

Final iteration: assemble the ranked recommendations and the phased implementation plan (Q10), using the accepted mechanisms, guards, entry point and test design, and close the remaining strategy questions.
