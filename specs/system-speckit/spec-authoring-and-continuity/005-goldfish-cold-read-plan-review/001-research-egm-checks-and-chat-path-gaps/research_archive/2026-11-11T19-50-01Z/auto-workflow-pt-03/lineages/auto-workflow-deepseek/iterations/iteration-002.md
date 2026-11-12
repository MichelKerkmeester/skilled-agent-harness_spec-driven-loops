# Iteration 2: Where a plan only its author can follow passes the chat path

## Focus

Question 6: the concrete failure. A plan whose steps only its author can follow is a plan that leaves a design decision to the implementer. This iteration traces every surface that reads `plan.md` on the natural-chat path, and asks which one could have refused such a plan, and what the smallest change to an existing line would be.

## Actions Taken

1. Read `plan.md.tmpl` for what the plan document must contain, where quality guidance lives, and which sections could hold an open decision.
2. Read the `PLACEHOLDER_FILLED` rule's severity lifecycle and the `ANCHORS_VALID` / `LEVEL_MATCH` / `FILE_EXISTS` summary rows.
3. Read the authoring card's §5 (one action per section), §6 (the plan shape), §7 (task lines) and §11 (when to stop and ask), each of which ends in an Acceptance/Verify pair.
4. Read `AGENTS.md` Gate 2's artifact trigger and Gate 3's write-path contract.
5. Read the implement workflow's `plan_clarity` gate slot and `tasks.md.tmpl`'s Verify clause format.

## Findings

1. **Every plan-quality instruction in the template is an HTML comment, and no validator rule reads comment prose.** The plan template's guidance is `<!-- FILL: ... GOOD: ... WEAK: ... -->` adjacent to each anchor [SOURCE: .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:67], while the rules covering `plan.md` are `FILE_EXISTS` (file present) [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:56], `PLACEHOLDER_FILLED` (tokens) [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:57], `ANCHORS_VALID` (anchor pairing and template anchors) [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:62] and `LEVEL_MATCH` (level consistency and required files) [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:773]. None judges whether a step can be executed without a choice.

2. **A plan can pass `--strict` with its architecture still an unfilled menu token, because `PLACEHOLDER_FILLED` downgrades to WARNING while `spec.md` says Draft.** The rule's severity table reads `Draft | WARNING | ERROR` for an unfilled `[YOUR_VALUE_HERE: ...]` token and only a non-Draft status makes it an ERROR [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:330] [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:334]. The plan template's pattern line is exactly such a token: `[YOUR_VALUE_HERE: MVC | MVVM | Clean Architecture | Serverless | Monolith | Other]` [SOURCE: .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:87].

3. **The plan template has no open-decisions section, so a decision hides inside prose fields that pass every rule.** The candidate hides in the pattern menu [SOURCE: .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:87], in the free-text component list [SOURCE: .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:89] or in the data-flow line [SOURCE: .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:93]. Each is a place a sentence can be written that names no choice, and none is machine-checked.

4. **The authoring card's plan-shape check is a presence check, not a decision test.** Section 6's acceptance is "`plan.md` holds its three phases in one line each" and its verify is `rg -n '^## 4' <packet folder>/plan.md` prints one line [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:123] [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:124]. Three vague one-line phases satisfy it exactly as well as three executable ones.

5. **The chat path deliberately exempts spec-folder documents from the documentation-skill route, so no skill reviews plan prose.** Gate 2's artifact trigger routes the first `.md` write through `sk-doc` "except spec-folder docs (`system-spec-kit`'s) ... which no skill owns" [SOURCE: AGENTS.md:68]. The exemption is reasonable for ownership, and its side effect is that `plan.md` prose is authored under `system-spec-kit` rules that are presence rules.

6. **Gate 3 binds where the write lands, never whether the plan can be followed.** Gate 3 fires "when the turn will write a file" and its options A/B/C/D all answer a folder question [SOURCE: AGENTS.md:72], so a plan with an open decision passes Gate 3 by naming a valid folder.

7. **The workflow's one plan-quality judgment is a hard-blocking rubric slot that the chat path has no counterpart for.** Implement's pre-implementation gate scores `plan_clarity` at 25 of 100 with `blocking: hard` and `on_fail: "Fix blocking issues before coding"` [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:386] [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:390]; the chat path scores nothing.

8. **At Level 1 the plan is the last document before code that could state a decision, because `acceptance-criteria.md` is not required there.** Level 1's required set is `spec.md, plan.md, tasks.md, implementation-summary.md` [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:773], so the first artifact that must name a concrete action is a task line, whose format is `T### [P?] Description (file path). Verify: <command> prints <expected output>` [SOURCE: .skilled/skills/system-spec-kit/templates/core/tasks.md.tmpl:53]. A vague plan can therefore be preceded by nothing and followed by arbitrary tasks, and both documents pass.

9. **The smallest change candidate already exists as a numbered stop condition with a working verify command.** The authoring card's §11 lists four conditions that require writing `Open question:` into `goal.md`, and its verify is `rg -n 'Open question:' <packet folder>/goal.md` prints at least one line [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:200] [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:206]. Adding a fifth condition — a plan step that forces the implementer to choose — reuses the section's existing acceptance pair and its existing output surface rather than adding a file, a command or a gate.

10. **A written open question is not by itself a blocker, and that is the honest limit of the smallest change.** Nothing in `validate.sh`'s rule set reads `goal.md`'s open questions as a completion condition; `SPEC_DOC_SUFFICIENCY` reads the goal's budget and binding row instead [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:69]. So the smallest change converts an invisible defect into a recorded, re-injectable one; making it blocking costs a new rule.

## Ruled Out

- Proposing a new `plan-decisions.md` artifact: the packet's own reversal-cost order puts a new file above editing an existing line, and the plan template's seven anchors leave no room for a second plan document at Level 1.
- Proposing that `PLACEHOLDER_FILLED` evaluate prose: the rule is a token scanner over five files by construction [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:326]; broadening it into prose judgment would duplicate the document's purpose in a text validator.

## Dead Ends

- "The validator will catch it once the status is no longer Draft": true for tokens, false for prose. A plan with every token filled and every anchor present can still leave a decision open, so status escalation does not close this hole.
- "The authoring card already says one action per section": §5's acceptance is about content under headings, not about decisions inside a section [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:106].

## Edge Cases

- Ambiguous input: "a plan only its author can follow" was read as "a plan step that forces the implementer to make a design choice the plan does not resolve", which is the decision-free framing the packet already uses. A broader reading (any under-specified plan) would make the failure untestable.
- Contradictory evidence: none. The template's comments and the validator's rules do not conflict; they operate on different parts of the file.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:67`, `:87`, `:89`, `:93`
- `.skilled/skills/system-spec-kit/templates/core/tasks.md.tmpl:53`
- `.skilled/skills/system-spec-kit/references/validation/validation-rules.md:56`, `:57`, `:62`, `:69`, `:330`, `:334`, `:773`
- `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:106`, `:123`, `:124`, `:200`, `:206`
- `AGENTS.md:68`, `:72`
- `.skilled/commands/speckit/assets/speckit-implement.yaml:386`, `:390`

## Assessment

- New information ratio: 0.9
- Questions addressed: Where does a plan only its author can follow get through on the chat path today, and what is the smallest change that stops it?
- Questions answered: Where does a plan only its author can follow get through on the chat path today, and what is the smallest change that stops it?
- Novelty justification: 9 of 10 findings are new to the packet; the Draft-severity downgrade and the §11 stop-condition reuse are the two that decide the recommendation.

## Reflection

- What worked and why: tracing "which document reads plan.md" instead of "which rule should exist" found the answer fast. Only four rule families touch the file, and all four are structural, so the hole is structural rather than a missing check inside an existing checker.
- What did not work and why: expecting the authoring card's Acceptance/Verify pairs to be machine-run. They are instructions with a human-run command, so a section whose acceptance is a heading count cannot carry a decision test no matter how it is worded. That reframes "smallest change" as "cheapest recorded signal", not "cheapest enforced gate".
- What I would do differently: read the severity table before the template, because the Draft downgrade changes what "passes validation" means for every plan written before implementation starts.

## Recommended Next Focus

Test the five candidate mechanisms against this failure and the iteration-1 inventory, starting with the cheapest and most universal: the `AGENTS.md` gate that routes a write request into workflow steps, measured by what text it needs and which runtimes read it.
