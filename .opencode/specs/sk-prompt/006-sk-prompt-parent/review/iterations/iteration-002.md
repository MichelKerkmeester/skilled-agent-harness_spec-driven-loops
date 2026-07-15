# Deep Review Iteration 002

## Dimension

- Dimension: security
- Budget profile: scan
- Dispatcher: `deep-review`
- Resolved route: `Resolved route: mode=review target_agent=deep-review`
- Agent definition loaded: yes (`.opencode/agents/deep-review.md:1-19`)

## Files Reviewed

- `.opencode/skills/sk-code/code-review/references/review_core.md:28-40` - severity definitions and security/correctness gate calibration.
- `.opencode/specs/sk-prompt/006-sk-prompt-parent/review/deep-review-config.json:9-17` - target, dimensions, lineage, and resource-map state.
- `.opencode/specs/sk-prompt/006-sk-prompt-parent/review/deep-review-strategy.md:111-172` - prior completed dimension, exhausted approaches, and next focus.
- `.opencode/skills/sk-prompt/SKILL.md:47-57` and `.opencode/skills/sk-prompt/SKILL.md:151-156` - hub-local resource path guard pattern.
- `.opencode/skills/sk-prompt/mode-registry.json:16-40` - mutating versus read-only packet tool surfaces.
- `.opencode/skills/sk-prompt/hub-router.json:4-26` - router policy and resources.
- `.opencode/commands/prompt-improve.md:112-116` - setup exposes a user-selected `specific path` save option.
- `.opencode/commands/prompt-improve.md:141-143` - setup validates custom path existence but does not state containment or overwrite checks.
- `.opencode/commands/prompt-improve.md:437-457` - save branch creates and writes to `[custom-path]` without a documented safe root.
- `.opencode/commands/prompt-improve.md:578-579` - notes describe spec-folder prompt storage as the normal path.
- `.opencode/agents/prompt-improver.md:6-19` and `.claude/agents/prompt-improver.md:1-5` - agent tool surfaces are read-only.
- `.opencode/agents/prompt-improver.md:101-103` and `.claude/agents/prompt-improver.md:86-88` - MCP/CLI execution boundary.
- `.opencode/agents/prompt-improver.md:151-158` and `.claude/agents/prompt-improver.md:136-143` - agent refuses execution, file edits, and scope widening.

## Findings by Severity

### P0 Findings

- None.

### P1 Findings

1. **Custom save path lacks containment and overwrite guard** -- `.opencode/commands/prompt-improve.md:454-457` -- The command's save workflow lets Q2=C create `[custom-path]/` and write `[custom-path]/[filename].md` with no documented requirement that the resolved path stay under the workspace, an approved spec folder, or a prompt-artifact root, and no documented no-overwrite check. The setup phase only says to validate the custom path exists (`.opencode/commands/prompt-improve.md:141-143`) while the normal product framing says saved prompts go under spec-folder `prompts/` directories (`.opencode/commands/prompt-improve.md:217`, `.opencode/commands/prompt-improve.md:578-579`). Because this command has `Write` and `Bash` in frontmatter (`.opencode/commands/prompt-improve.md:4`), a prompt-save flow can become an arbitrary user-directed write primitive if the executor follows the command literally.
   - Finding class: cross-consumer
   - Scope proof: Exact searches for `custom path`, `specific path`, `outside`, `workspace`, `overwrite`, and `save location` across `.opencode/commands/prompt-improve.md`, `.opencode/skills/sk-prompt/**`, and the 124 spec folder found explicit custom-path write steps but no matching containment or overwrite guard in the command; hub packet loaders do have path guards for their own resource loads (`.opencode/skills/sk-prompt/SKILL.md:47-57`, `.opencode/skills/sk-prompt/prompt-models/SKILL.md:136-140`), showing the guard pattern exists but is absent from save output handling.
   - Affected surface hints: [`/prompt-improve` command save flow, prompt artifact writes, spec-folder prompt library]
   - riskScore: 6 (advisory only)
   - Recommendation: Treat Q2=C as scoped artifact output: require realpath containment under the workspace or an approved spec folder/prompts root, reject `..`/absolute path escape where applicable, and refuse overwriting an existing file unless the user explicitly confirms the exact target path.
   - Claim adjudication: `{ "type": "claim_adjudication", "claim": "The prompt-improve command permits a custom save path without a documented containment or overwrite guard.", "evidenceRefs": [".opencode/commands/prompt-improve.md:112-116", ".opencode/commands/prompt-improve.md:141-143", ".opencode/commands/prompt-improve.md:437-457", ".opencode/commands/prompt-improve.md:578-579", ".opencode/commands/prompt-improve.md:4"], "counterevidenceSought": "Searched the command, sk-prompt skill tree, and 124 spec docs for custom-path, workspace/outside, overwrite, and save-location guard language; also checked read-only prompt-improver agent boundaries and hub resource guards.", "alternativeExplanation": "The executor runtime may independently sandbox writes, and the user must explicitly choose Q2=C, so this is not proven arbitrary filesystem compromise. The command contract itself still lacks the containment rule downstream executors need.", "finalSeverity": "P1", "confidence": 0.84, "downgradeTrigger": "Downgrade to P2 if the command runtime enforces workspace/spec-folder write containment and no-overwrite semantics before command markdown steps are executed." }`

### P2 Findings

- None.

## Traceability Checks

- Core `spec_code`: PARTIAL. The approved command surface is `/prompt-improve`; security review found its documented save branch permits a custom output path without the same containment style used in skill resource loaders.
- Core `checklist_evidence`: PARTIAL. Existing phase evidence emphasizes spec-folder prompt storage and read-only prompt-models behavior, but does not cover custom save-path containment for `/prompt-improve`.
- Overlay `skill_agent`: PASS for prompt-improver agent execution boundary. The OpenCode agent denies write/edit/bash/task and states it never executes tools, commands, or MCP surfaces (`.opencode/agents/prompt-improver.md:6-19`, `.opencode/agents/prompt-improver.md:101-103`, `.opencode/agents/prompt-improver.md:151-158`).
- Overlay `agent_cross_runtime`: PASS for the same execution boundary in the Claude mirror (`.claude/agents/prompt-improver.md:1-5`, `.claude/agents/prompt-improver.md:86-88`, `.claude/agents/prompt-improver.md:136-143`).
- Overlay `feature_catalog_code`: NOT APPLICABLE. No feature-catalog file is in this iteration's security target slice.
- Overlay `playbook_capability`: DEFERRED. The prompt-improve manual playbook says its scenarios are read+score+return, not command save-path mutation coverage (`.opencode/skills/sk-prompt/prompt-improve/manual_testing_playbook/manual_testing_playbook.md:59`).

## Scope Violations

- None. Reviewed target files were read-only; writes were limited to the review packet artifact paths.

## Ruled Out

- Prompt-improver agent arbitrary execution: ruled out for this slice because both runtime agent definitions deny mutating/execution tools and explicitly say MCP/CLI/tool names are downstream constraints only.
- Hub router path traversal for resource loading: ruled out for this slice because hub and prompt-models routing pseudocode resolve resources under `SKILL_ROOT` before loading.
- Prompt-models mutating workspace surface: ruled out for this slice because the registry marks `prompt-models` `mutatesWorkspace:false` and forbids `Write`, `Edit`, `Task`, and `Bash`.

## Verdict

- CONDITIONAL: one new P1 security finding, no P0 findings.

## Next Dimension

- dimension: traceability
- focus area: connect phase specs/checklists to live command, agent, and skill artifacts after correctness and security findings.
- reason: correctness and security now have coverage; remaining required dimensions are traceability and maintainability.
- rotation status: continue dimension queue.
- blocked/productive carry-forward: avoid retrying the iteration-1 stale `/prompt` command-token sweep as a correctness path; carry the Q2=C save-path containment finding into traceability evidence instead.
- required evidence: checklist rows for `/prompt-improve` save behavior, command docs, and live agent/skill contracts.
- recovery note: none.
Review verdict: CONDITIONAL
