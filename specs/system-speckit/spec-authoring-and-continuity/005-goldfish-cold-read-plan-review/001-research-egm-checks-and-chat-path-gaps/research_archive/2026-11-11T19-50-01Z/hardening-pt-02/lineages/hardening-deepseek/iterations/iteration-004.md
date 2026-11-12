# Iteration 4: Sweep for defect classes the leads did not name

## Focus

A class sweep rather than a lead: look for defect shapes that recur across all three files and that none of the eight leads describes — config keys nothing reads, enforcement keywords that contradict each other in one file, thresholds on different scales, and validators run in a scope their own rule table rejects.

## Actions Taken

1. `rg circuit_breaker` repo-wide (excluding `specs/`) to test whether any step consumes it.
2. `rg skip_allowed|optional: true|skip_if:` across the three files.
3. Read `.skilled/skills/system-spec-kit/references/validation/validation-rules.md:30-70` (severity table and rule summary) and `:216` (`FILE_EXISTS`).
4. `rg "SPECKIT_RULES="` to find a scoped invocation and compare it with the three bare ones.
5. `rg` for `max 3`, `confidence_score < 60`, `No [NEEDS CLARIFICATION]`, `default_level` with line numbers.
6. Read `speckit-complete.yaml:745-762` (the `phase_3_research` trigger) and `:711-720` (`phase_predecessor_validation`).

## Findings

1. **Class: declarative config with no consumer — and it is not only `quality_gates`.** `circuit_breaker` is defined in all three files (`plan:429`, `implement:408`, `complete:535`) and referenced by no step in any of them; the same key is boilerplate in more than twenty `create/` command assets, which makes "a block nobody reads" a house pattern rather than a one-off. `confidence_framework`, `request_analysis_framework` and `workflow_enforcement` are in the same position: their only effect is on a reader who trusts them. What actually binds is prose inside a step — `action_if_failed`, `on_fail`, `enforcement: HARD_BLOCK`, an explicit `STOP`. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:429-433] [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:408-412]

2. **A working example of the same intent sits in the same file, which fixes the target shape.** Complete's `phase_predecessor_validation` (`:711-720`) carries `trigger`, `skip_if`, `on_fail: "HARD BLOCK — predecessor phase not complete. Report status and halt."` and `on_pass`, all inside the step that must enforce it. That is the shape the dead blocks are missing: the condition, the failure and the continuation in one place, owned by a step. [SOURCE: .skilled/commands/speckit/assets/speckit-complete.yaml:711-720]

3. **`skip_allowed: false` contradicts two steps in the same file that declare themselves skippable.** Implement's enforcement block states `mode: strict`, `step_order: sequential_mandatory`, `skip_allowed: false`, and the same file marks step 5.5 `optional: true` with `skip_if: ["Quick fix (<10 LOC)", "Continuation with existing PREFLIGHT"]` and step 7.5 `optional: true` with its own `skip_if`. A reader taking `skip_allowed: false` literally cannot execute the quick-fix path the file defines. [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:436-439] [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:570-573]

4. **Plan's clarification step caps resolution at three markers while complete's hard phase gate requires zero.** Plan step 4's first activity is "Extract `[NEEDS CLARIFICATION]` markers (max 3)"; complete's `phase_gate_checkpoint` requires "No `[NEEDS CLARIFICATION]` in spec.md" and is `enforcement: HARD_BLOCK`. A spec carrying four or more markers cannot satisfy both: plan stops resolving at three and complete refuses to proceed, so the packet bounces between two commands that each believe they have done their part. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:656] [SOURCE: .skilled/commands/speckit/assets/speckit-complete.yaml:1042-1052]

5. **All three files run `validate.sh --strict` unscoped as a post-write gate, and the repository's own deep-research workflow scopes the identical command for exactly the reason these three do not.** `FILE_EXISTS` is an ERROR for the detected level, so a bare `--strict` on a packet that is legitimately mid-scaffold reports a missing-file error, and the `on_fail` text in plan says the repair is "template drift in plan.md" — the wrong repair for that error. Deep research's equivalent step passes `SPECKIT_RULES=FRONTMATTER_VALID,LEVEL_DECLARED,TEMPLATE_SOURCE,PLACEHOLDER_FILLED,ANCHORS_VALID,SPEC_DOC_INTEGRITY,TOC_POLICY` and says why: it enforces the authored-document contract "without applying full-packet required-file or completeness checks". Damage is bounded to the partial-folder and repair paths that plan's own step 0.5 classifies, because the normal path scaffolds all files at step 3 first. [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:47] [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:533] [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:783-784]

6. **The confidence scale has a fourth threshold that lives outside `confidence_framework`, on a scale the framework does not define.** Complete triggers its research phase on `confidence_score < 60`, while the framework's bands are 80+/40-79/0-39 and every other threshold in the family is 40, 70 or 80. Sixty sits inside the "proceed with caution" band, so most of the band that the framework says to proceed through instead dispatches research. The number is also self-assigned, like the rest. [SOURCE: .skilled/commands/speckit/assets/speckit-complete.yaml:752-762]

7. **`available_templates.default_level: level_2` contradicts the level table's own default in the same file.** Plan's template block defaults to Level 2 while its `documentation_levels.level_selection.default` reads "Level 1 for simple tasks, escalate based on analysis"; implement and complete carry the same Level 2 template default. A new packet's level therefore has two answers, and the stricter one is the table that names a default. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:279]

## Questions Answered

None of the eight strategy questions was open for this iteration — all eight were answered by iteration 3. This iteration answers the two questions iteration 3 opened: the circuit-breaker divergence is a symptom of the larger "dead config" class, and complete's duplicated plan/implement steps are worth reconciling only where the duplicate is the copy that is actually wired (complete's `phase_gate_checkpoint` and `phase_predecessor_validation` are step-level and live; its `quality_gates` copies are not).

## Questions Remaining

No strategy question remains. The ranking deliverable remains: order every confirmed defect by the damage it allows and attach the smallest existing-line change plus an overengineering verdict.

## Ruled Out

- **Proposing that the dead config blocks be wired up.** Wiring `circuit_breaker` would add a runtime consumer for a block whose three copies contradict each other; deleting or demoting the copies is cheaper and does not create a fourth behaviour to reconcile.
- **Treating the unscoped `--strict` as a normal-path blocker.** The normal path scaffolds the trio before validating, so the damage is confined to repair and partial-folder runs. Reported at that size.

## Dead Ends

- Looking for any reader of `quality_gates` or `circuit_breaker` outside the command assets: `rg` over `.skilled` returns only definition sites, including the twenty-plus `create/` assets. No consumer exists to cite.

## Edge Cases

- Ambiguous input: "same class of defect" could mean same shape in one file or same shape across the family. Selected family-wide, because the sweep's purpose is to find what one-file reading misses.
- Contradictory evidence: complete's `phase_predecessor_validation` and `phase_gate_checkpoint` both work while its `quality_gates` does not — the same file demonstrates both the defect and the fix. Recorded rather than resolved.
- Missing dependencies: none.
- Partial success: the `--strict` scoping claim rests on the rule table's `FILE_EXISTS` severity plus deep research's comment; no run was executed, because running `validate.sh` against the parent packet is outside this lineage's write-and-run boundary.

## SCOPE VIOLATIONS

None executed. `validate.sh` was deliberately not run against the parent packet, which would be an out-of-scope mutation.

## Sources Consulted

- `.skilled/commands/speckit/assets/speckit-plan.yaml:279`, `:429-433`, `:656`, `:783-784`
- `.skilled/commands/speckit/assets/speckit-implement.yaml:408-412`, `:436-439`, `:570-573`
- `.skilled/commands/speckit/assets/speckit-complete.yaml:535-540`, `:711-720`, `:752-762`, `:1042-1052`
- `.skilled/skills/system-spec-kit/references/validation/validation-rules.md:47`, `:216`
- `.skilled/commands/deep/assets/deep-research-auto.yaml:533`
- `rg circuit_breaker` over `.skilled` (definition sites only)

## Assessment

- New information ratio: 0.93
- Questions addressed: the two questions iteration 3 opened
- Questions answered: none of the eight remain open, so none were newly answerable

## Reflection

- What worked and why: looking for a *consumer* rather than a *definition*. Every lead so far described something declared; the sweep's question — who reads this key — produced the class that explains four of the earlier findings and found `circuit_breaker` in the same state.
- What did not work and why: an initial pass compared the three `quality_gates` blocks field by field, which produced a long list of differences and no damage estimate. The comparison only became useful after asking which copy is invoked.
- What I would do differently: for a config-heavy workflow file, build the consumer list first (which keys a step body names) and treat every unlisted key as suspect before reading a single definition.

## Recommended Next Focus

Close the run: rank every confirmed defect by the damage it allows, state the smallest existing-line change for each, name the spec levels each touches, and apply the reversal-cost test to decide which fixes are worth making and which are overengineering.
