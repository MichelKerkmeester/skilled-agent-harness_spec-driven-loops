GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/014-sk-design-doc-and-routing-check

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.

=== BEGIN AGENT PERSONA (resolved runtime path: .claude/agents/markdown.md; focused summary for a one-change brief) ===
You are @markdown, a leaf documentation editor dispatched by an orchestrator (Depth: 1). Never dispatch another agent.
Scope: edit only the files this brief names. The orchestrator already applied sk-doc's rules when it wrote the new text, so apply it exactly as given.
Keep frontmatter, anchors, headings, tables and surrounding prose byte-identical outside the named edit.
Verification: run only the checks this brief lists and report exact commands, result lines and exit codes.
Output: end with the HANDBACK block, STATUS DONE or BLOCKED.
=== END AGENT PERSONA (resolved persona: markdown) ===

You are a mechanical editor in one repository. Do exactly the step below, nothing more.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/014-sk-design-doc-and-routing-check
- Other workers edit other files in this tree at the same time. Touch only the files this brief names.
- The orchestrator runs the test suites, spec validation and every git commit after you return.
- Your sandbox may block test runners that open local sockets (tsx, vitest). Run only the checks listed here; the orchestrator runs the rest.

DON'T
- Edit, create or delete any file this brief does not name.
- Run a git command that writes (add, commit, stash, checkout, restore, reset, merge, rebase, push).
- Install anything (npm/pnpm/pip/brew install, npm ci) or touch node_modules.
- Open any .env file, print environment variables, or write a key or token into any file.
- Call jev, the local Deem server (127.0.0.1:8300) or any network service.
- Put spec paths, packet or phase numbers, or REQ/task ids in code comments.
- Reformat, reorder or "improve" anything outside the named edit.
- Ask a question. If a step cannot be done exactly as written, stop and report BLOCKED with the reason.

STEP 1: correct SD-007's routing gold in its frontmatter
Scope: 1 file, `.skilled/skills/sk-design/manual-testing-playbook/unknown-fallback/ambiguous-multi-intent.md`. Anchor: lines 1-22 are the frontmatter (line 1 and line 22 are `---`).
Replace lines 3 to 20 (from the `title:` line through the last `leaf_resource_id:` line) with the literal new text below. Keep line 1 (`---`), line 2 (`id: SD-007`), the `version: 2.1.0.21` line and the closing `---` exactly as they are. Change nothing below the frontmatter.

Literal old text (lines 3-20):
```text
title: 'Ambiguous prompt scores CHART and FLOWCHART within delta'
description: "This scenario validates ambiguous CHART and FLOWCHART routing for SD-007."
stage: routing
expected_intent: sk-design-chart+sk-design-diagram
expected_resources:
  - sk-design-chart/references/catalog.md
  - sk-design-chart/references/template-contract.md
  - sk-design-diagram/assets/ascii-patterns/simple-workflow.md
  - sk-design-diagram/assets/ascii-patterns/decision-tree-flow.md
expected_workflow_mode: sk-design-chart+sk-design-diagram
expected_leaf_resources:
  - workflow_mode: sk-design-chart
    leaf_resource_id: references/catalog.md
  - workflow_mode: sk-design-chart
    leaf_resource_id: references/template-contract.md
  - workflow_mode: sk-design-diagram
    leaf_resource_id: assets/ascii-patterns/simple-workflow.md
  - workflow_mode: sk-design-diagram
```
(line 21, `    leaf_resource_id: assets/ascii-patterns/decision-tree-flow.md`, stays.)

Literal new text (replaces lines 3-20):
```text
title: 'Doc-quality prompt asking for flowcharts routes to DIAGRAM'
description: "This scenario validates that a doc-quality prompt asking for flowcharts routes to the diagram mode for SD-007."
stage: routing
expected_intent: sk-design-diagram
expected_resources:
  - sk-design-diagram/assets/ascii-patterns/simple-workflow.md
  - sk-design-diagram/assets/ascii-patterns/decision-tree-flow.md
expected_workflow_mode: sk-design-diagram
expected_leaf_resources:
  - workflow_mode: sk-design-diagram
    leaf_resource_id: assets/ascii-patterns/simple-workflow.md
  - workflow_mode: sk-design-diagram
```
Accept when: 1 file changed, 4 lines added and 10 removed (18 old lines become 12), the frontmatter still opens and closes with `---`, and no line below the frontmatter moved in content.

VERIFY (paste each command with its result line and exit code)
  sed -n 1,17p .skilled/skills/sk-design/manual-testing-playbook/unknown-fallback/ambiguous-multi-intent.md
  grep -c 'sk-design-chart' .skilled/skills/sk-design/manual-testing-playbook/unknown-fallback/ambiguous-multi-intent.md    # the count of chart mentions left; the frontmatter holds none of them
  sed -n 1,17p .skilled/skills/sk-design/manual-testing-playbook/unknown-fallback/ambiguous-multi-intent.md | grep -c 'sk-design-chart'    # expect 0
  git diff --numstat -- .skilled/skills/sk-design/manual-testing-playbook/unknown-fallback/ambiguous-multi-intent.md    # expect 4 added, 10 removed

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
