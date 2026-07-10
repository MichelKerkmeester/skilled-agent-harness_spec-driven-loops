# Deep Review Iteration 009

## Dimension

correctness

## Files Reviewed

- `.opencode/skills/sk-code/code-review/references/review_core.md:28-40` - severity definitions and evidence requirements.
- `.opencode/skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:166-176` - iteration artifact contract.
- `.opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent/review/deep-review-state.jsonl:3-26` - prior iteration state and duplicate-finding guard.
- `.opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent/review/deep-review-findings-registry.json:9-270` - active finding registry, including prior path and stale-reference findings.
- `.opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent/review/deep-review-strategy.md:127-215` - exhausted correctness directions.
- `.opencode/commands/prompt-improve.md:93-143` - setup-phase save-location discovery and derived path contract.
- `.opencode/commands/prompt-improve.md:437-457` - save step paths for existing, new, and custom save locations.
- `.opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent/spec.md:88-93` - command rename and live referrer sweep scope.
- `.opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent/spec.md:124-133` - phase map showing the active packet is under `.opencode/specs/...`.
- `AGENTS.md:226-230` - tracked packet path convention for `.opencode/specs/[track]/...`.

## Findings by Severity

### P0

None.

### P1

#### R9-P1-001 [P1] `/prompt-improve` save-location workflow still discovers and creates legacy `specs/` paths

- File: `.opencode/commands/prompt-improve.md:93`
- Claim: The command's setup/save workflow routes prompt artifacts to `specs/...` instead of the active tracked packet root `.opencode/specs/...`, so option A can hide existing tracked folders and option B can create/save prompts outside the packet tree used by this program.
- Evidence: Setup discovers existing folders with `ls -d specs/*/` and derives new folders as `specs/[NNN]-[topic]/` [SOURCE: `.opencode/commands/prompt-improve.md:93-143`]. The save step repeats that base for existing and new saves, including `mkdir -p specs/[folder]/prompts/`, `ls -d specs/*/`, and `mkdir -p specs/[NNN]-[topic]/prompts/` [SOURCE: `.opencode/commands/prompt-improve.md:437-452`]. The active program explicitly moved the command into `.opencode/commands/prompt-improve.md` and tracks its current phased spec under `.opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent/...` [SOURCE: `.opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent/spec.md:88-93`; `.opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent/spec.md:124-133`]. The workspace convention says tracked packets use `.opencode/specs/[track]/[###-short-name]/`, with legacy `specs/[###-short-name]/` only as a compatibility possibility [SOURCE: `AGENTS.md:226-230`].
- Counterevidence sought: Checked prior registry entries for duplicate coverage. R2 and R6 cover containment/sanitization of custom and new path branches, but neither records that the command searches and writes the wrong root for ordinary spec-folder saves [SOURCE: `.opencode/specs/skilled-agent-orchestration/124-sk-prompt-parent/review/deep-review-findings-registry.json:40-124`].
- Alternative explanation: The command may intentionally support legacy `specs/` folders. That does not explain why it only lists `specs/*/` and confirms `specs/...` paths while the current tracked packet and command migration operate under `.opencode/specs/...`.
- Final severity: P1.
- Confidence: 0.84.
- Downgrade trigger: Downgrade to P2 if the command is explicitly documented as legacy-only and a separate `.opencode/specs` save path exists in another command surface that users are expected to use instead.
- Finding class: cross-consumer.
- Scope proof: Grep confirmed stale `/prompt` references are already covered in both runtime agents, and direct reads narrowed this new finding to save-location root handling rather than previously registered command-name or path-sanitization defects.
- Affected surface hints: [`/prompt-improve` setup Q2, existing spec folder save, new spec folder save, memory-visible packet placement]
- Recommendation: Update the command's discovery and save examples to prefer `.opencode/specs/[track]/...` or explicitly route through the spec-folder gate, and keep legacy `specs/` only as an explicit compatibility fallback.

### P2

None.

## Traceability Checks

- Core `spec_code`: FAIL for the `/prompt-improve` save-location path contract. The current command/save workflow still points at `specs/...` while the packet and active spec convention use `.opencode/specs/...`.
- Core `checklist_evidence`: PARTIAL. The active registry already carries unresolved P1 findings, and this iteration adds a new required correctness finding in command save placement.
- Overlay `skill_agent`: PARTIAL. The command still invokes the correct `sk-prompt` packet, but its persistence path can place prompt outputs outside the tracked packet root.
- Overlay `agent_cross_runtime`: NOT RETRIED as a new finding because stale runtime-agent `/prompt` metadata remains covered by `R1-P1-001`.
- Overlay `feature_catalog_code`: NOT APPLICABLE. No feature-catalog file is part of the declared review scope.
- Overlay `playbook_capability`: DEFERRED. This pass focused on command persistence correctness, not manual playbook scenario completeness.

## SCOPE VIOLATIONS

None.

## Verdict

CONDITIONAL. This iteration found one new P1 correctness issue and no P0 issues.

## Next Dimension

security, unless the loop controller overrides for the final max-iteration pass.

Review verdict: CONDITIONAL
