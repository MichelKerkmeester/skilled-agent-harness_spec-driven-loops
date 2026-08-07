# Deep Review Iteration 001

## Dimension

correctness

## Files Reviewed

- `.opencode/skills/sk-code/code-review/references/review_core.md:28-40` — severity and evidence doctrine loaded before final severity calls.
- `.opencode/specs/sk-prompt/007-sk-prompt-parent/spec.md:88-94` — approved scope requires `/prompt` to be renamed to `/prompt-improve` and both packets to live under `sk-prompt`.
- `.opencode/specs/sk-prompt/007-sk-prompt-parent/spec.md:124-133` — all phases are marked complete, including command rename and cutover.
- `.opencode/specs/sk-prompt/007-sk-prompt-parent/008-cutover-and-rollout/implementation-summary.md:63-65` — terminal stale-reference sweep claims zero remaining live stale references.
- `.opencode/commands/prompt-improve.md:279-284` — live command correctly reads `sk-prompt/prompt-improve/SKILL.md`.
- `.opencode/agents/prompt-improver.md:62-83` — OpenCode runtime agent still identifies `/prompt` via `.opencode/commands/prompt.md`.
- `.opencode/agents/prompt-improver.md:220-231` — OpenCode runtime agent still documents `command_surface: </prompt|other command>`.
- `.opencode/agents/prompt-improver.md:344-363` — OpenCode runtime summary still names `/prompt`.
- `.claude/agents/prompt-improver.md:47-68` — Claude runtime mirror carries the same stale `/prompt` and `.opencode/commands/prompt.md` integration mapping.
- `.claude/agents/prompt-improver.md:205-216` — Claude runtime mirror still documents `command_surface: </prompt|other command>`.
- `.claude/agents/prompt-improver.md:329-348` — Claude runtime mirror summary still names `/prompt`.
- `.opencode/skills/sk-prompt/prompt-models/README.md:46-56` — README quick-start points operators at `.opencode/skills/prompt-models/SKILL.md`.
- `.opencode/skills/sk-prompt/prompt-models/README.md:173-180` — README verification commands point at `.opencode/skills/prompt-models/...`.

## Findings by Severity

### P0

None.

### P1

#### R1-P1-001 [P1] Prompt-improver agents still route integration metadata to removed `/prompt` command

- File: `.opencode/agents/prompt-improver.md:62`
- Evidence: The completed parent spec requires `/prompt` to be renamed to `/prompt-improve` and lists `.opencode/commands/prompt.md` moving to `.opencode/commands/prompt-improve.md` [SOURCE: `.opencode/specs/sk-prompt/007-sk-prompt-parent/spec.md:91`, `.opencode/specs/sk-prompt/007-sk-prompt-parent/spec.md:110`]. The actual command tree only contains `.opencode/commands/prompt-improve.md`, and that command loads the nested prompt-improve packet [SOURCE: `.opencode/commands/prompt-improve.md:279-284`]. However both live prompt-improver agent definitions still map `INT-CMD-PROMPT-IMPROVER` to `/prompt` via `.opencode/commands/prompt.md`, still present `command_surface: </prompt|other command>`, and still summarize the command as `/prompt` [SOURCE: `.opencode/agents/prompt-improver.md:62-83`, `.opencode/agents/prompt-improver.md:220-231`, `.opencode/agents/prompt-improver.md:344-363`, `.claude/agents/prompt-improver.md:47-68`, `.claude/agents/prompt-improver.md:205-216`, `.claude/agents/prompt-improver.md:329-348`]. This contradicts the terminal phase's stale-reference sweep claim that live references were clean [SOURCE: `.opencode/specs/sk-prompt/007-sk-prompt-parent/008-cutover-and-rollout/implementation-summary.md:63-65`].
- Claim: Live agent routing metadata can preserve or emit the removed command/path instead of the current `/prompt-improve` command.
- Counterevidence sought: Checked command discovery for `.opencode/commands/prompt*.md`; only `.opencode/commands/prompt-improve.md` exists. Checked the live command file; its packet read path is already corrected.
- Alternative explanation: `/prompt` could be an undocumented alias outside the markdown command tree, but no such alias was present in the scoped command file discovery, and the approved spec explicitly chose a rename rather than alias retention.
- Finding class: cross-consumer
- Scope proof: The exact search for `.opencode/commands/prompt.md`, `/prompt`, and `INT-CMD-PROMPT-IMPROVER` found matching live agent references in both OpenCode and Claude runtime surfaces; scoped command discovery found only `prompt-improve.md`.
- Affected surface hints: [`OpenCode prompt-improver agent`, `Claude prompt-improver mirror`, `/prompt-improve command handoff`]
- riskScore: 6 (advisory only)
- Recommendation: Update the prompt-improver agent integration rows, handoff payload example, and summary in both runtime surfaces to `/prompt-improve` and `.opencode/commands/prompt-improve.md`, then rerun the stale-reference sweep with `/prompt` command-token coverage.
- Confidence: 0.89
- Downgrade trigger: Downgrade to P2 if a current command router intentionally aliases `/prompt` to `/prompt-improve` and that compatibility contract is documented as supported for agent handoff inputs.

### P2

#### R1-P2-001 [P2] prompt-models README quick-start and verification commands point at a non-existent top-level skill path

- File: `.opencode/skills/sk-prompt/prompt-models/README.md:55`
- Evidence: The approved hub scope places `prompt-models` under `.opencode/skills/sk-prompt/prompt-models/` [SOURCE: `.opencode/specs/sk-prompt/007-sk-prompt-parent/spec.md:88-94`, `.opencode/specs/sk-prompt/007-sk-prompt-parent/spec.md:124-133`]. The README still tells operators to read `.opencode/skills/prompt-models/SKILL.md` and to validate `.opencode/skills/prompt-models/{README.md,SKILL.md}` [SOURCE: `.opencode/skills/sk-prompt/prompt-models/README.md:46-56`, `.opencode/skills/sk-prompt/prompt-models/README.md:173-180`].
- Claim: Operator-facing documentation for the nested prompt-models packet includes stale top-level paths that will fail if followed literally.
- Counterevidence sought: Read the README context and parent hub scope; the nested `prompt-models` packet is the current in-scope path.
- Alternative explanation: The missing `sk-prompt` segment might be a typo rather than a migrated-path miss; impact is still the same for readers copying the commands.
- Finding class: instance-only
- Scope proof: Scoped exact search found these stale `.opencode/skills/prompt-models` README examples in the prompt-models README; surrounding README content otherwise describes the nested hub correctly.
- Affected surface hints: [`prompt-models README`, `operator quick start`, `documentation validation commands`]
- riskScore: 3 (advisory only)
- Recommendation: Replace the quick-start and verification command paths with `.opencode/skills/sk-prompt/prompt-models/...`.
- Confidence: 0.93
- Downgrade trigger: Downgrade to advisory note only if a filesystem compatibility link from `.opencode/skills/prompt-models` exists and is intentionally documented.

## Traceability Checks

- Core `spec_code`: FAIL for the prompt-improver agent integration path. Spec and command evidence point to `/prompt-improve`; live agent metadata still points to `/prompt`.
- Core `checklist_evidence`: PARTIAL. The terminal implementation summary claims clean stale-reference sweeps, but this iteration found live stale command-token references outside changelog/spec history.
- Overlay `skill_agent`: FAIL for prompt-improver agent command integration metadata.
- Overlay `agent_cross_runtime`: FAIL in both `.opencode/agents/prompt-improver.md` and `.claude/agents/prompt-improver.md` for the same stale command mapping.
- Overlay `feature_catalog_code`: NOT APPLICABLE in this correctness slice; no feature catalog file was in the declared scope list.
- Overlay `playbook_capability`: DEFERRED to maintainability/traceability dimensions; this iteration only checked README and agent command-path correctness.

## SCOPE VIOLATIONS

None. No reviewed target files were modified.

## Verdict

CONDITIONAL: one P1 correctness finding and one P2 documentation-path finding were recorded.

## Next Dimension

security

Review verdict: CONDITIONAL
