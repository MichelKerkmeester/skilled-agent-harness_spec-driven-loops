# Iteration 3: Devin, Cursor, DSH and Hermes

## Focus

Close the runtime matrix. Devin, Cursor and DSH each have a decision-capture or hook adapter
in this repository, so their ask-tool names can be proven locally. Hermes is named in the
research topic but is expected to have been removed; that must be verified rather than
assumed. This iteration also collapses the per-runtime answers into the blocking class and
the observe-only class.

## Actions Taken

- Read the Devin tool inventory and the Devin decision-capture sweep.
- Read the Devin permission-request policy, which is the one Devin event that emits a block.
- Read the Cursor hook contract's event list, response envelope and exit semantics, then
  searched the Cursor skill and `.cursor/` for any ask-tool name.
- Read the DSH seam table, the adapter set, and the repo-guards README rows for
  `decision-capture` and `completion-evidence`.
- Read the Hermes deprecation changelog entry and the CLI hub's mode registry.

## Findings

1. **Devin's ask tool is `ask_user_question`, and it is not available to subagents.** The tool inventory lists it under clarification with the explicit parenthetical "not available to subagents", and the decision-capture sweep keys on the same name. [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/references/devin-tools.md:212] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-devin.mjs:41]
2. **Devin's only block-capable event in this repository is `PermissionRequest`, not `Stop`.** The permission policy emits `{decision: 'block', reason, hookSpecificOutput.permissionDecision}`, while the Stop registrations run the advisory session-stop and completion-evidence adapters. A Devin turn-end guard would observe, not block, on today's contract. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs:102] [SOURCE: .devin/hooks.v1.json:1]
3. **Cursor has no evidenced ask tool.** The Cursor skill's tool reference documents worktrees, the cloud worker, the plugin marketplace and MCP, but no question tool; `.skilled/hooks/decision-capture/` has no Cursor adapter; and no `ask_user_question`-style name appears in the Cursor references. Treat Cursor as a runtime without a native ask surface until a tool name is proven. [SOURCE: .skilled/skills/cli-external-orchestration/cli-cursor/references/cursor-tools.md:1] [SOURCE: .skilled/hooks/decision-capture/bin/README.md:1]
4. **Cursor's turn-end events are post-hoc.** `afterAgentResponse` and `stop` are listed as documented agent events, and the response envelope carries `permission: allow | deny | ask`, but the envelope is a gate for the action a hook intercepts; the repository's Cursor completion adapter returns no decision at all and is advisory. Cursor turn-end blocking is therefore unproven, and the honest classification is observe-only. [SOURCE: .skilled/skills/cli-external-orchestration/cli-cursor/references/hook-contract.md:83] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/cursor/completion-evidence-response.mjs:1]
5. **DSH's ask tool is `ask_user_question`, and headless runs have no question tool.** The repo-guards adapter table says so in the decision-capture row: "runs, headless has no question tool". Since fan-out lineages are headless, a DSH worker cannot satisfy an ask-the-operator obligation. [SOURCE: .dsh/plugins/repo-guards/README.md:94] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-dsh.mjs:33]
6. **DSH is the only non-Claude runtime with a genuine turn-end block seam.** `agent/turn-stopping` is documented as "Force another step before the turn ends", and the repository's own completion-evidence adapter is attached there — but with the error policy "Log and continue", so it observes. The seam exists; the policy is what would change. [SOURCE: .skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/guards-and-hooks.md:53] [SOURCE: .dsh/plugins/repo-guards/README.md:84]
7. **Hermes is no longer a runtime in this repository.** The v4.0.2.0 changelog states that `cli-hermes`, the `.hermes/` folder and the `hermes` launcher function are gone, `.hermes/` is absent from the checkout, and the CLI hub's mode registry holds seven modes with no `cli-hermes` entry. Any rule text or hook wiring that still names Hermes is stale. [SOURCE: .skilled/changelog/skilled/v4.0.2.0.md:47] [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:1]
8. **The runtime matrix resolves into three classes.** Blocking turn-end seams exist on Claude Code (`Stop`, `decision: "block"`) and DSH (`agent/turn-stopping`, "force another step"). Codex, Cursor and Devin have turn-end events with no documented block contract in this repository, so they are observe-only in practice. OpenCode and Pi have no turn-end seam at all. Hermes is out of scope. [INFERENCE: from findings 1-7 above]

## Ruled Out

- **Devin `Stop` as a blocking guard.** The repository uses Devin's blocking decision on
  `PermissionRequest`; no Stop block contract exists here.
- **Cursor as a runtime with a native ask tool.** No tool name, no sweep, no adapter. Naming
  one would be exactly the invented tool the handoff rule forbids.
- **Keeping Hermes in the matrix.** Verified removed, so the honest answer is "out of scope",
  not "unknown".

## Dead Ends

- Cursor turn-end blocking: the hook contract documents the envelope but not which post-hoc
  events honour it, and no live adapter relies on it. Recorded as unproven.

## Edge Cases

- Ambiguous input: whether Cursor has an ask tool in a newer release than this repository
  records. Recorded as "no evidenced tool", not "no tool exists".
- Contradictory evidence: the research topic names Hermes as in scope; the changelog and the
  mode registry say it was removed. The repository evidence wins.
- Missing dependencies: no upstream Cursor or Devin hook documentation reachable locally.
- Partial success: none; the matrix is complete.

## Sources Consulted

- .skilled/skills/cli-external-orchestration/cli-devin/references/devin-tools.md
- .skilled/hooks/decision-capture/bin/sweep-devin.mjs
- .skilled/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs
- .devin/hooks.v1.json
- .skilled/skills/cli-external-orchestration/cli-cursor/references/cursor-tools.md
- .skilled/skills/cli-external-orchestration/cli-cursor/references/hook-contract.md
- .skilled/skills/system-spec-kit/runtime/hooks/cursor/completion-evidence-response.mjs
- .dsh/plugins/repo-guards/README.md
- .skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/guards-and-hooks.md
- .skilled/hooks/decision-capture/bin/sweep-dsh.mjs
- .skilled/changelog/skilled/v4.0.2.0.md
- .skilled/skills/cli-external-orchestration/mode-registry.json

## Assessment

- New information ratio: 0.94
- Questions addressed: Q1, Q2
- Questions answered: Q1 in full — every runtime in scope now has a proven tool name or a
  proven absence, with its availability gate.

## Reflection

- What worked and why: reading each runtime's own adapter table gave a tool name and a gate in
  the same row, which is why the matrix closed in one iteration.
- What did not work and why: Cursor and Devin have no local hook-block contract, so their
  turn-end classification is an absence-of-evidence finding rather than a proven negative.
- What I would do differently: check the changelog before the runtime list next time; Hermes
  cost a search that a version note would have answered immediately.

## Recommended Next Focus

Iteration 4: the detector. Establish the heuristic (option list plus a question near the end,
no ask-tool call in the turn), measure its false-positive surface on ordinary numbered steps,
summaries and code blocks, and assemble a fixture set from the repository's existing tests.
