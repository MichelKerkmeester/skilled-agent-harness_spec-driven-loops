## Dimension

security

## Files Reviewed

- `.opencode/skills/sk-code/code-review/references/review_core.md:28-40` — severity contract and P0/P1/P2 calibration.
- `.opencode/skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:166-176` — iteration artifact and state checklist.
- `.opencode/specs/sk-prompt/006-sk-prompt-parent/review/deep-review-state.jsonl:3-17` — prior iterations and active prior security finding context.
- `.opencode/specs/sk-prompt/006-sk-prompt-parent/review/deep-review-findings-registry.json:9-176` — active registry counts and prior findings.
- `.opencode/specs/sk-prompt/006-sk-prompt-parent/review/deep-review-findings-registry.json:424-459` — prior custom-path and router path-escape coverage.
- `.opencode/specs/sk-prompt/006-sk-prompt-parent/review/deep-review-findings-registry.json:678-733` — prior ruled-out security directions.
- `.opencode/commands/prompt-improve.md:101-151` — setup flow, Q2 save options, and branch preconditions.
- `.opencode/commands/prompt-improve.md:437-457` — save implementation branches for existing folder, new folder, and specific path.
- `.opencode/commands/prompt-improve.md:528-579` — example saved prompt paths and prompts directory note.
- `.opencode/skills/sk-prompt/SKILL.md:32-85` — hub routing and skill-root resource guard.
- `.opencode/skills/sk-prompt/prompt-improve/SKILL.md:1-4` — prompt-improve tool surface includes write and bash capabilities.
- `.opencode/skills/sk-prompt/prompt-improve/SKILL.md:151-156` — packet resource path containment guard.
- `.opencode/skills/sk-prompt/prompt-improve/SKILL.md:446-470` — agent read-only handoff and tool usage guidance.
- `.opencode/skills/sk-prompt/mode-registry.json:16-40` — prompt-improve mutating tool surface and prompt-models read-only tool surface.
- `.opencode/skills/sk-prompt/hub-router.json:4-27` — router policy and packet resource mapping.
- `.opencode/agents/prompt-improver.md:1-19` — OpenCode agent permission boundary.
- `.opencode/agents/prompt-improver.md:101-103` and `.opencode/agents/prompt-improver.md:151-158` — OpenCode agent no-execution/no-mutation boundary.
- `.claude/agents/prompt-improver.md:1-5` — Claude agent tool boundary.
- `.claude/agents/prompt-improver.md:86-88` and `.claude/agents/prompt-improver.md:136-143` — Claude agent no-execution/no-mutation boundary.

## Findings by Severity

### P0

None.

### P1

#### R6-P1-001 [P1] New spec-folder save branch derives a shell-created path from unsanitized topic text

- Claim: The `/prompt-improve` Q2=B branch creates `specs/[NNN]-[topic]/prompts/` from prompt topic text without a documented slug, containment, or shell-argument guard, so a user-provided topic can become a filesystem path segment in a mutating Bash/Write workflow.
- Evidence: Q0 accepts pasted prompt text, topic, or goal as the prompt input, while Q2=B selects “Save to new spec folder” and stores `save_path` from Q2 [SOURCE: `.opencode/commands/prompt-improve.md:101-116`; `.opencode/commands/prompt-improve.md:132-143`]. The save step then creates `specs/[NNN]-[topic]/prompts/` with `mkdir -p` and writes the enhanced prompt there, but the same section only specifies a hyphen-case rule for the filename, not for the `[topic]` folder segment [SOURCE: `.opencode/commands/prompt-improve.md:448-457`; `.opencode/commands/prompt-improve.md:441-445`]. The command has mutating tools available [SOURCE: `.opencode/commands/prompt-improve.md:4`], and the prompt-improve packet itself advertises Write/Bash for user-specified output and validation work [SOURCE: `.opencode/skills/sk-prompt/prompt-improve/SKILL.md:1-4`; `.opencode/skills/sk-prompt/prompt-improve/SKILL.md:465-470`].
- Counterevidence sought: Searched the command and spec packet for slug/sanitize/containment wording around topic, new spec folder, filename, custom path, and save path; found only filename hyphen-case guidance and the previously recorded custom-path containment finding for Q2=C, not a guard for Q2=B.
- Alternative explanation: The runtime operator may manually normalize `[topic]` before creating the folder, but the command contract does not require that normalization and is intended to be executable from the workflow text.
- Final severity: P1.
- Confidence: 0.82.
- Downgrade trigger: Downgrade to P2 or resolve if the command explicitly requires deriving a safe slug for `[topic]`, rejects path separators/shell metacharacters, resolves under the intended specs root, and refuses overwrite/collision cases before any directory creation.

### P2

None.

## Traceability Checks

- Core `spec_code`: PARTIAL. The parent hub router and skill-root resource guards remain contained [SOURCE: `.opencode/skills/sk-prompt/SKILL.md:47-57`; `.opencode/skills/sk-prompt/prompt-improve/SKILL.md:151-156`], but the command save contract still exposes path-handling gaps in a mutating branch.
- Core `checklist_evidence`: PARTIAL. Prior active findings remain open in the registry, and this pass adds a related but distinct Q2=B path derivation finding [SOURCE: `.opencode/specs/sk-prompt/006-sk-prompt-parent/review/deep-review-findings-registry.json:9-176`].
- Overlay `skill_agent`: PASS for prompt-improver agent execution boundaries. Both runtime agents remain read-only and explicitly do not execute tools, commands, or MCP surfaces [SOURCE: `.opencode/agents/prompt-improver.md:1-19`; `.opencode/agents/prompt-improver.md:101-103`; `.claude/agents/prompt-improver.md:1-5`; `.claude/agents/prompt-improver.md:86-88`].
- Overlay `agent_cross_runtime`: PASS for the execution boundary in this security slice; stale command naming remains covered by prior finding R1-P1-001 and was not re-raised.
- Overlay `feature_catalog_code`: NOT APPLICABLE. No feature-catalog file is in the declared review scope.
- Overlay `playbook_capability`: DEFERRED. This pass did not inspect manual playbook coverage for the new Q2=B slug/containment branch.

## SCOPE VIOLATIONS

None.

## Verdict

CONDITIONAL — one new P1 security finding was recorded.

## Next Dimension

traceability
Review verdict: CONDITIONAL
