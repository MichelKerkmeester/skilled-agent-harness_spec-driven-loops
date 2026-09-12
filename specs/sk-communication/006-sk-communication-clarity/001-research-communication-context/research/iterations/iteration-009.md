# Iteration 9: Is the ADHD output contract a repo rule that binds every turn, or an operator-selected mode?

## Focus

The inventory direction is saturated, so this iteration answers one binding question instead:
is the ADHD output contract in `context/i-have-adhd-main` a rule that binds on every turn, or a
mode that stays off by default? Grounded in what this repository already has: how
`sk-communication` is held off advisor routing, how its projection stays off by default, whether
`repo-rules/communication.md` permits a reader-conditional rule at all, and what `REPO RULES.md`
§4 puts in and out of scope for a repo rule.

Investigated surface: `context/i-have-adhd-main/skills/i-have-adhd/SKILL.md` (the contract),
`.opencode/skills/system-skill-advisor/runtime/config/route-exclusions.json` plus its consumer,
`.opencode/skills/sk-communication/cli-communication-projection` (enablement gate), and the two
repo-local rule docs.

Deliberate boundary, from the packet's own NON-GOALS (strategy.md:45-53): this iteration classifies
which surface *class* could carry a mode and never designs the prompt-time injection mechanism
(a different packet owns that).

## Actions Taken

1. Read state: config, state JSONL (7 iteration records + 3 events), strategy headings, §9
   exhausted approaches, §10 ruled-out, §11 next-focus, registry open questions.
2. Verified the write boundary: `iterations/iteration-009.md` and `deltas/iter-009.jsonl` absent;
   dispatch pre-substitutes iteration 9.
3. Read the ADHD contract in full (`SKILL.md:21-140`): ten rules, break conditions, pre-send check.
4. Read the repo's off-by-default machinery: `route-exclusions.json` + `route-exclusions.ts`,
   `docs/enablement.md` + `src/config/enablement.ts` + `enablement.local.json.example`.
5. Read the two rule-scope surfaces: `repo-rules/communication.md` (trigger, register, §8, §9) and
   `REPO RULES.md:75-109` (scope, carve-outs).

## Findings

1. **The repo's binding convention for a reply-shape rule is unconditional loading, with the
   conditionality placed inside the rule, not in a mode switch.** `repo-rules/communication.md:41-42`
   states the trigger is "deliberately the broadest in the set: a rule about how replies read has to
   load whenever a reply is being written, or it silently stops applying to the short answers that
   need it most". `REPO RULES.md:80-83` records the same fact from the scope side: delivery "is the
   one rule here whose trigger is every substantive reply rather than a specific action".
   `communication.md:57-60` then shows where conditionality actually lives: two registers, "clipped
   while working, dense at a boundary" — the shape varies by phase while the obligation never
   unloads. [SOURCE: repo-rules/communication.md:41-42,57-60] [SOURCE: REPO RULES.md:80-83]

2. **Two off-by-default mechanisms exist today, and neither is per-reader or per-turn.**
   (a) *Hard route exclusion*: `route-exclusions.json:2` holds `"excludedSkillIds": ["sk-communication"]`,
   resolved by `route-exclusions.ts:26,60-62` into a cached id set (consumed in scoring/fusion).
   The skill is not merely off by default, it is excluded from routing entirely.
   (b) *Per-machine enablement gate*: `docs/enablement.md:5` — "Projection is OFF by default for
   everyone"; two opt-in sources, the env var `COMMUNICATION_PROJECTION_ENABLED` and the git-ignored
   `enablement.local.json` holding `{ "enabled": true }` (`docs/enablement.md:12,42`;
   `enablement.local.json.example:1-3`); "A set variable always wins" and a false answer returns the
   exact original output (`docs/enablement.md:14-15`), enforced by
   `enablement.ts:9,25,56` (`PROJECTION_ENABLE_ENV`, `resolveProjectionEnablement`,
   `isProjectionEnabled`). [SOURCE: .opencode/skills/system-skill-advisor/runtime/config/route-exclusions.json:2]
   [SOURCE: .opencode/skills/system-skill-advisor/runtime/lib/routing/route-exclusions.ts:26,60-62]
   [SOURCE: .opencode/skills/sk-communication/cli-communication-projection/docs/enablement.md:5,12,14-15,42]
   [SOURCE: .opencode/skills/sk-communication/cli-communication-projection/src/config/enablement.ts:9,25,56]

3. **One of the ten rules contradicts an existing repo rule, and the contradiction is resolvable
   only by splitting the rule.** ADHD rule 5 mandates "Restate state every turn" (`SKILL.md:73-78`).
   `repo-rules/communication.md:196-200` (§9 SELF-CHECK) deletes a "restated summary" as filler and
   requires every sentence to carry information. The source's own `SKILL.md:80` supplies the
   resolution: "If the harness has a task or plan tool, use it for multi-step work... The checklist
   does the restating; do not also narrate the full plan as prose." The repo already has that
   surface (a task/plan tool), so the tool half is already satisfied and only the prose-restatement
   half is in conflict. [SOURCE: context/i-have-adhd-main/skills/i-have-adhd/SKILL.md:73-80]
   [SOURCE: repo-rules/communication.md:196-200]

4. **Rule 6 (specific time estimates, `SKILL.md:82-87`) is not safely unconditional for
   agent-executed work.** An estimate for work the agent is about to do is unknowable at authoring
   time; the source's own break condition 6 rescopes it: "point time estimates at whoever executes
   the steps" (`SKILL.md:128`). Promoting it unconditionally would manufacture precision the
   evidence does not support, which the repo's never-fabricate mandate forbids.
   [SOURCE: context/i-have-adhd-main/skills/i-have-adhd/SKILL.md:82-87,128]
   [INFERENCE: based on SKILL.md:128's own rescope plus the repo's documentation-honesty mandate]

5. **Rule 9 carries its own unconditional/conditional split.** The numeric cap is the conditional
   half (`SKILL.md:103-105`: aim for no more than five items per group), while `SKILL.md:107` keeps
   the invariant: "Never omit relevant items when completeness matters. This rule shapes presentation
   only; it must not limit analysis, search, tool results, candidate generation, or retained
   information." The repo's matching counterweight is `communication.md:189-192`, "Not a license to
   omit... Cutting a required caveat to look concise is a `uncertainty-and-honesty.md` failure
   wearing this rule as cover". [SOURCE: context/i-have-adhd-main/skills/i-have-adhd/SKILL.md:103-107]
   [SOURCE: repo-rules/communication.md:189-192]

6. **Binding classification of the ten rules.** Unconditional-compatible, no existing rule
   contradicted: rules 1 (`SKILL.md:33-40`, lead with the answer/action), 2 (`:42-46`, number
   multi-step work), 4 (`:64-71`, suppress tangents and queue them), 7 (`:89-94`, make completed work
   visible), 8 (`:96-101`, matter-of-fact error tone), 10 (`:109-117`, no preamble, recap, or
   pleasantries — already covered by the filler and self-check rules). Rule 3 (`:57-62`) binds
   unconditionally only with its floor trimmed: "name one next action when something is left open",
   because its mandatory minimum ("Even 'open the file' counts", `:59`) collides with the
   every-sentence-carries-information self-check (`communication.md:196-200`) when nothing is left
   open. Reader-conditional, needing a mode or a rewrite: rule 5's prose restatement (`:73-78`),
   rule 6 (`:82-87`), and rule 9's numeric cap (`:103-105`).
   [SOURCE: context/i-have-adhd-main/skills/i-have-adhd/SKILL.md:33-117]
   [SOURCE: repo-rules/communication.md:196-200]

7. **Mode-surface answer, with the trade-off of each candidate.** The only existing machinery shaped
   like an operator-selected mode that stays off by default is the enablement gate of Finding 2b:
   git-ignored local opt-in, a set variable always wins, false returns the original output
   (`docs/enablement.md:5,12,14-15`; `enablement.ts:9,25,56`). Trade-off: it is per-machine and
   invisible to packet state, so it can express "this operator wants the reader-conditional rules"
   but not "this reply is a mode reply". The routing pattern is a poor carrier: `REPO RULES.md:85-89`
   puts skill and workflow *selection* out of scope for repo rules, and the exclusion file has
   already been used to hold `sk-communication` out of routing entirely
   (`route-exclusions.json:2`). Trade-off: advisor routing is probabilistically scored, so the mode
   would apply sometimes and silently not apply otherwise. A third option, no new surface: promote
   only the unconditional core into the existing reply-shape rule surface and leave the conditional
   three as source-level guidance. Trade-off: the conditional three then have no enforcement at all,
   which is the honest status quo rather than a solution.
   [SOURCE: .opencode/skills/sk-communication/cli-communication-projection/docs/enablement.md:5,12,14-15]
   [SOURCE: REPO RULES.md:85-89] [SOURCE: .opencode/skills/system-skill-advisor/runtime/config/route-exclusions.json:2]

**Verdict.** The ADHD contract is neither a repo rule that binds every turn nor a single operator
mode. Seven of its ten rules are delivery invariants this repo's own convention would load
unconditionally (`communication.md:41-42`); three are reader-conditional and one of those contradicts
an existing self-check (`communication.md:196-200` against `SKILL.md:73-78`). The defensible shape is
a split: the unconditional core belongs on the existing reply-shape rule surface, and the conditional
three need a mode carried by fails-closed operator machinery if the operator wants them at all.
[INFERENCE: derived from Findings 1, 2, 3, 6, 7]

## Questions Answered

- None of the five key questions fully. This iteration answers a sixth, dispatch-raised question and
  advances key question 4 (owning surface) for the ten ADHD rules by naming the carrier class for
  their conditional subset.

## Questions Remaining

- The five key questions stay open as recorded in strategy.md:34-43; this iteration did not close any.
- Open for the reducer: if the operator adopts the split model, who owns the mode's failure mode when
  the enablement file is absent but the reader still needs the conditional rules (silent-off by design
  against visible-off on request).
- Carried forward: 001 to 002 handoff's missing `research.md`; baseline-capture scheduling; the
  unread comment sections in `code-style-guide.md` §4 / Webflow §5; C-4 republication.

## Next Focus

Iteration 10, the final one. No new research direction is needed for the binding question, which is
now answered with file:line evidence. The highest-value remaining move is a consolidation pass: state
the split model in the form phase 002 can consume (unconditional core, conditional three, carrier
class per conditional rule) and hand the mode-carrier recommendation to the reducer, without
re-opening the saturated inventory. If instead the reducer prefers raw coverage, the untouched item
is the ADHD mechanism half (session-start hook, runtime mirrors, eval harness, release gate) as its
own question, but that direction is already key question 5 and remains unstarted.

---

## Ruled Out (this iteration)

- Re-deriving covered-vs-new coverage for the ADHD rules: saturated and barred by strategy §9
  (iterations 4 and 7 entries) plus the dispatch focus.
- Treating the ADHD contract as a whole either as a uniform repo rule or a uniform mode: seven of ten
  rules are unconditional-compatible while three are reader-conditional (Finding 6), so both uniform
  answers are wrong.
- Carrying the mode on advisor routing: `REPO RULES.md:85-89` keeps route selection out of scope for
  repo rules, and `route-exclusions.json:2` already excludes `sk-communication` from routing.
- Promoting rule 5's prose restatement as-is: it contradicts `communication.md:196-200`; only the
  tool-mediated half (`SKILL.md:80`) survives contact with the existing rules.

## Dead Ends

- The prose half of ADHD rule 5 (`SKILL.md:73-78`) is a candidate for reducer promotion to
  "exhausted" as a promotable rule: it cannot be promoted without amending the existing self-check,
  and the amendment is operator territory.
- Re-deriving the mechanism-half inventory inside this iteration: dropped for budget, and it is a
  declared key question rather than part of this dispatch focus.

## Edge Cases

- Missing dependency: none material.
- Partial success: none; all planned reads succeeded.
- Ambiguous input: none; the dispatch focus is explicit and the strategy §11 next-focus anchor is
  empty, so dispatch context governed the focus per the precedence order.
- Observation for the reducer: the state log holds 7 iteration records (001-007) plus a
  `dispatch_failure` event for iteration 8 (`reason: timeout`) and two `containment_violation` events
  whose paths are in unrelated packets under `specs/hooks/022-smart-rule-injection/`. This iteration
  is therefore the run's 9th slot with 7 completed narratives, and the pre-substituted 009 path did
  not previously exist. The containment events are not this packet's state and were left untouched.

## Sources Consulted

- `specs/sk-communication/006-sk-communication-clarity/context/i-have-adhd-main/skills/i-have-adhd/SKILL.md:21-140`
- `specs/sk-communication/006-sk-communication-clarity/context/i-have-adhd-main/` (tree listing)
- `repo-rules/communication.md:30-60,181-200`
- `REPO RULES.md:75-109`
- `.opencode/skills/system-skill-advisor/runtime/config/route-exclusions.json:1-3`
- `.opencode/skills/system-skill-advisor/runtime/lib/routing/route-exclusions.ts:26,60-62,88`
- `.opencode/skills/sk-communication/cli-communication-projection/docs/enablement.md:1-80,112,143`
- `.opencode/skills/sk-communication/cli-communication-projection/src/config/enablement.ts:9,25,33,56`
- `.opencode/skills/sk-communication/cli-communication-projection/enablement.local.json.example:1-8`
- `research/deep-research-config.json`, `research/deep-research-state.jsonl`, `research/deep-research-strategy.md`

## Assessment

- New information ratio: 0.80
- Questions addressed: the dispatch binding question; key question 4 for the ADHD rules' conditional subset
- Questions answered: none of the five tracked key questions

## Reflection

- What worked and why: reading the repo's own machinery before judging the source. The repo already
  answered the design question twice (unconditional load with internal registers in
  `communication.md`; fails-closed opt-in in the enablement gate), and both answers were discoverable
  in a handful of anchored reads rather than any web research.
- What did not work and why: the first attempt to read `REPO RULES.md` failed on an unquoted path with
  a space, and the ADHD `SKILL.md` was not at the source root (it lives under `skills/i-have-adhd/`).
  Both were path assumptions, not evidence problems; the re-reads were narrow and cited.
- What I would do differently: locate a nested skill entry point with `find -name SKILL.md` before
  reading rule content, and quote every path containing a space.

## Recommended Next Focus

One consolidation pass for iteration 10: express the split model (unconditional core, conditional
three, carrier class) in phase-002-consumable form, route the mode-carrier recommendation to the
reducer, and leave the ADHD mechanism half (key question 5) as the only untouched direction — starting
it would be a new research commitment, not a continuation, and the run has one iteration left.
