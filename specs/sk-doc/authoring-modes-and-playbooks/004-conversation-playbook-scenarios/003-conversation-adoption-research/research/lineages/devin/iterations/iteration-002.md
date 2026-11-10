# Deep Research Iteration 2

## Focus

Audit mcp-mobbin, mcp-refero, the sk-code hub, sk-code-ci and sk-code-quality, reading each root index plus any plugin, hook, session or approval scenario.

## Actions Taken

- Read the mcp-mobbin and mcp-refero root playbooks and their nine-scenario coverage tables.
- Read the sk-code hub root playbook and the SD-003 UNKNOWN-fallback scenario file.
- Read the sk-code-ci root playbook and its eight-scenario index.
- Read the sk-code-quality root playbook and its 23-scenario index.
- Checked `ROUTER.md` section 6 for the behavior that follows the UNKNOWN disambiguation answer.

## Findings

1. mcp-mobbin has no conversation candidate: its nine scenarios are read-only wiring, discovery, retrieval or refusal checks, each driven by one prompt or one `doctor.sh` command; the "fresh Code Mode session" precondition reloads an MCP server, not a runner session, so Q2 does not apply and Q4 keeps them single prompt. [SOURCE: .skilled/skills/mcp-tooling/mcp-mobbin/manual-testing-playbook/manual-testing-playbook.md:25] [SOURCE: .skilled/skills/mcp-tooling/mcp-mobbin/manual-testing-playbook/manual-testing-playbook.md:139] [SOURCE: .skilled/skills/mcp-tooling/mcp-mobbin/manual-testing-playbook/manual-testing-playbook.md:54]
2. mcp-refero has no conversation candidate: its nine scenarios are read-only wiring, discovery, funnel, quota or refusal checks, and the three-layer funnel runs inside one prompt; the Pro-account OAuth step is operator-only, so Q2 finds no answer-dependent turn and Q4 keeps them single prompt. [SOURCE: .skilled/skills/mcp-tooling/mcp-refero/manual-testing-playbook/manual-testing-playbook.md:25] [SOURCE: .skilled/skills/mcp-tooling/mcp-refero/manual-testing-playbook/manual-testing-playbook.md:134] [SOURCE: .skilled/skills/mcp-tooling/mcp-refero/manual-testing-playbook/manual-testing-playbook.md:53]
3. sk-code-ci has no conversation candidate: its eight scenarios are routing recall, routing-floor negatives, rule-reference fixtures and two doctor-script runs, each decided by a command transcript and exit status; Q2 finds no second exchange and Q4 keeps them single prompt. [SOURCE: .skilled/skills/sk-code/sk-code-ci/manual-testing-playbook/manual-testing-playbook.md:37] [SOURCE: .skilled/skills/sk-code/sk-code-ci/manual-testing-playbook/manual-testing-playbook.md:44] [SOURCE: .skilled/skills/sk-code/sk-code-ci/manual-testing-playbook/manual-testing-playbook.md:53]
4. sk-code-quality has no conversation candidate: its 23 scenarios each run the quality runner or a doctor script over a fixture and read a gate, exit code or check row; CQ-009's trust grant is a config key set between two runs, not a conversational answer, so Q2 does not apply and Q4 keeps them single prompt. [SOURCE: .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/manual-testing-playbook.md:154] [SOURCE: .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/manual-testing-playbook.md:300] [SOURCE: .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/manual-testing-playbook.md:576]
5. The sk-code hub has one add candidate: 22 of its 23 operator scenarios are one-prompt routing, load-set, restraint or hook checks (Q4), but SD-003 stops at the UNKNOWN disambiguation question and never exercises the answer-dependent turn that `ROUTER.md` section 6 requires, so a two-turn companion that answers runtime and verification commands would cover behavior no scenario checks (Q2). [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/surface-detection/unknown-fallback.md:33] [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/surface-detection/unknown-fallback.md:43] [SOURCE: .skilled/skills/sk-code/ROUTER.md:162] [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md:154]

## Ruled Out

- Treating mcp-mobbin's or mcp-refero's "fresh Code Mode session" precondition as a runner `restart`. The runner restarts the subject runtime, not the Code Mode MCP server, and no check would observe the server reload.
- Converting sk-code-quality's CQ-009 trust sequence. Setting `skilled.trustRepoChecks` is an operator config action between two command runs, not a scripted answer in a conversation.

## Dead Ends

- Package-level keyword scans for "session" or "OAuth" in the MCP transports. Both terms describe operator prerequisites, not runtime-session behavior.

## Edge Cases

- Ambiguous input: "answer-dependent next step" is read as the runtime asking a question whose answer changes its next action. An operator setting a config key between runs is not that.
- Contradictory evidence: none.
- Missing dependencies: none; all five root playbooks and the SD-003 file were readable.
- Partial success: none; all five packages reached a verdict.

## Sources Consulted

- .skilled/skills/mcp-tooling/mcp-mobbin/manual-testing-playbook/manual-testing-playbook.md
- .skilled/skills/mcp-tooling/mcp-refero/manual-testing-playbook/manual-testing-playbook.md
- .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md
- .skilled/skills/sk-code/manual-testing-playbook/surface-detection/unknown-fallback.md
- .skilled/skills/sk-code/ROUTER.md
- .skilled/skills/sk-code/sk-code-ci/manual-testing-playbook/manual-testing-playbook.md
- .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/manual-testing-playbook.md

## Assessment

- New information ratio: 1.00
- Questions addressed: Which of the 28 packages meet Q2 or Q3 (five more packages).
- Questions answered: none in full; the first question spans all 28 packages.

## Reflection

- What worked and why: reading the per-feature scenario file for the UNKNOWN fallback exposed the missing post-answer turn that the root index only hints at.
- What did not work and why: the package indexes alone would have kept sk-code at "no candidate", because SD-003's contract describes the question but not the turn after it.
- What I would do differently: for any scenario whose contract ends in a question, check the router's follow-on rule before deciding the package has no candidate.

## Recommended Next Focus

Audit sk-code-skilled, the sk-design hub, sk-design-diagram and sk-design-fundamentals, reading each root index and any scenario that ends in a question or an approval.

Timestamp: 2026-11-02T18:19:52Z
