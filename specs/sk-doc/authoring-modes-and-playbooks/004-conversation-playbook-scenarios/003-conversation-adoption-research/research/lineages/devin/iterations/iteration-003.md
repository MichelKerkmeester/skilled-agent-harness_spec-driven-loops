# Deep Research Iteration 3

## Focus

Audit sk-code-skilled, the sk-design hub, sk-design-diagram and sk-design-fundamentals, reading each root index and any scenario that ends in a question or an approval.

## Actions Taken

- Read the sk-code-skilled root playbook and its twelve routing-recall scenarios.
- Read the sk-design hub root playbook and the SD-007 ambiguous-multi-intent scenario.
- Read the sk-design-diagram root playbook and the DIA-003 onboarding-flow contract.
- Read the sk-design-fundamentals root playbook plus SKD-021 and SKD-022.
- Checked `depth-and-detail.md` for whether the shadow-system choice is an operator question or a project inspection.

## Findings

1. sk-code-skilled has no conversation candidate: its twelve scenarios are routing-recall contracts where one prompt must emit one intent's resource set, plus the shared tier and surface-detection checks; OC-008 runs guards but reads their exit statuses in one pass, so Q2 finds no second exchange and Q4 keeps them single prompt. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/manual-testing-playbook/manual-testing-playbook.md:28] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/manual-testing-playbook/manual-testing-playbook.md:47] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/manual-testing-playbook/manual-testing-playbook.md:62]
2. The sk-design hub keeps SD-005, SD-H05 and SD-H10 single prompt as routing traces (Q4), but SD-007 is an add candidate: its contract allows the router to "explicitly ask the user to disambiguate, citing both candidate intents and their scores", and no turn scripts the answer that would then select CHART or FLOWCHART (Q2). Add a companion conversation rather than convert the routing-gold file. [SOURCE: .skilled/skills/sk-design/manual-testing-playbook/manual-testing-playbook.md:27] [SOURCE: .skilled/skills/sk-design/manual-testing-playbook/unknown-fallback/ambiguous-multi-intent.md:97] [SOURCE: .skilled/skills/sk-design/manual-testing-playbook/unknown-fallback/ambiguous-multi-intent.md:99]
3. sk-design-diagram keeps eight of ten scenarios single prompt (Q1 for the judged DIA-002 and CAP-001, Q4 for the rest), but DIA-003 needs updating to a conversation: its contract makes the approval halt load-bearing, says `style-guide.md` changes only after explicit approval, and instructs the agent to stop and wait, so a two-turn script that approves or declines is the only way a shell check can observe the write decision (Q2). [SOURCE: .skilled/skills/sk-design/sk-design-diagram/manual-testing-playbook/diagram-generation/onboarding-flow.md:30] [SOURCE: .skilled/skills/sk-design/sk-design-diagram/manual-testing-playbook/diagram-generation/onboarding-flow.md:31] [SOURCE: .skilled/skills/sk-design/sk-design-diagram/manual-testing-playbook/diagram-generation/onboarding-flow.md:49] [SOURCE: .skilled/skills/sk-design/sk-design-diagram/manual-testing-playbook/manual-testing-playbook.md:202]
4. sk-design-fundamentals has no conversation candidate: its twelve scenarios are one-prompt routing, value-scale, conflict and boundary checks, and SKD-022 expects the agent to choose the shadow system from how much work shadows do in the project rather than to ask the operator, so Q2 does not apply and Q4 keeps them single prompt. [SOURCE: .skilled/skills/sk-design/sk-design-fundamentals/manual-testing-playbook/manual-testing-playbook.md:111] [SOURCE: .skilled/skills/sk-design/sk-design-fundamentals/manual-testing-playbook/conflict-handling/shadow-system-consistency.md:32] [SOURCE: .skilled/skills/sk-design/sk-design-fundamentals/references/depth-and-detail.md:123]

## Ruled Out

- Converting SD-007 itself into a conversation. It is a routing-gold file whose YAML contract and expected resources feed the typed-gold gate; a companion operator scenario keeps that gate intact while adding the answer turn.
- Treating SKD-022 as an approval gate. The reference tells the agent to choose the shadow system from the project's needs, not to ask the operator.

## Dead Ends

- Reading the sk-design hub root for scenario detail. It is only a 55-line index; the SD-007 contract lives in the category file and carries the disambiguation branch.

## Edge Cases

- Ambiguous input: "approval" is read as a turn whose answer changes whether a write happens. DIA-003's stop-and-wait step is that; SKD-021's escalation is not, because the skill's job ends at offering the two hatches.
- Contradictory evidence: none.
- Missing dependencies: none; all four root playbooks and the two scenario files were readable.
- Partial success: none; all four packages reached a verdict.

## Sources Consulted

- .skilled/skills/sk-code/sk-code-skilled/manual-testing-playbook/manual-testing-playbook.md
- .skilled/skills/sk-design/manual-testing-playbook/manual-testing-playbook.md
- .skilled/skills/sk-design/manual-testing-playbook/unknown-fallback/ambiguous-multi-intent.md
- .skilled/skills/sk-design/sk-design-diagram/manual-testing-playbook/manual-testing-playbook.md
- .skilled/skills/sk-design/sk-design-diagram/manual-testing-playbook/diagram-generation/onboarding-flow.md
- .skilled/skills/sk-design/sk-design-fundamentals/manual-testing-playbook/manual-testing-playbook.md
- .skilled/skills/sk-design/sk-design-fundamentals/manual-testing-playbook/conflict-handling/shadow-system-consistency.md
- .skilled/skills/sk-design/sk-design-fundamentals/manual-testing-playbook/conflict-handling/contrast-escape-hatches.md
- .skilled/skills/sk-design/sk-design-fundamentals/references/depth-and-detail.md

## Assessment

- New information ratio: 1.00
- Questions addressed: Which of the 28 packages meet Q2 or Q3 (four more packages).
- Questions answered: none in full; the first question spans all 28 packages.

## Reflection

- What worked and why: reading the scenario file rather than the root index surfaced both answer-dependent gates; the roots describe DIA-003 and SD-007 without their approval and disambiguation branches.
- What did not work and why: the sk-design hub's 55-line index carries no contract detail, so a root-only pass would have missed SD-007 entirely.
- What I would do differently: for every design scenario whose objective names an operator decision, read the reference the scenario cites to see whether the agent asks or infers.

## Recommended Next Focus

Audit sk-design-md-generator, sk-prompt, sk-create-agent and sk-create-benchmark, reading each root index plus any scenario that names an approval, question or session.

Timestamp: 2026-11-02T18:20:24Z
