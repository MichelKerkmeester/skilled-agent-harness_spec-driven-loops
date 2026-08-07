# Deep Review Iteration 002

## Dimension

`reality-alignment`, with sk-doc template conformance checked for every document in the slice.

## Files Reviewed

All 30 assigned documents were read in full:

- `.opencode/skills/cli-external/cli-opencode/references/permissions-matrix.md`
- `.opencode/skills/mcp-tooling/mcp-chrome-devtools/references/cdp_patterns.md`
- `.opencode/skills/mcp-tooling/mcp-chrome-devtools/references/session_management.md`
- `.opencode/skills/mcp-tooling/mcp-chrome-devtools/references/troubleshooting.md`
- `.opencode/skills/mcp-tooling/mcp-click-up/references/cupt_commands.md`
- `.opencode/skills/mcp-tooling/mcp-click-up/references/mcp_tools.md`
- `.opencode/skills/mcp-tooling/mcp-click-up/references/troubleshooting.md`
- `.opencode/skills/mcp-tooling/mcp-figma/references/figma_cli_reference.md`
- `.opencode/skills/mcp-tooling/mcp-figma/references/mcp_wiring.md`
- `.opencode/skills/mcp-tooling/mcp-figma/references/tool_surface.md`
- `.opencode/skills/mcp-tooling/mcp-figma/references/troubleshooting.md`
- `.opencode/skills/cli-external/cli-claude-code/assets/prompt_quality_card.md`
- `.opencode/skills/cli-external/cli-claude-code/assets/prompt_templates.md`
- `.opencode/skills/cli-external/cli-opencode/assets/prompt_quality_card.md`
- `.opencode/skills/cli-external/cli-opencode/assets/prompt_templates.md`
- `.opencode/skills/mcp-tooling/mcp-figma/assets/env_template.md`
- `.opencode/skills/mcp-tooling/mcp-figma/assets/utcp_figma_manual.md`
- `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/cli-invocation/base-non-interactive-invocation.md`
- `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/cli-invocation/default-model-selection-sonnet.md`
- `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/cli-invocation/output-format-text-vs-json.md`
- `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/cli-invocation/stream-json-incremental-output.md`
- `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/permission-modes/accept-edits-auto-approve-writes-sandboxed.md`
- `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/permission-modes/bypass-permissions-guard-rail-sandboxed.md`
- `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/permission-modes/plan-mode-read-only-enforcement.md`
- `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/reasoning-and-models/haiku-fast-classification.md`
- `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/reasoning-and-models/opus-extended-thinking.md`
- `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/reasoning-and-models/sonnet-balanced-default.md`
- `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/agent-routing/context-agent-codebase-exploration.md`
- `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/agent-routing/debug-agent-fresh-perspective-root-cause.md`
- `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/agent-routing/handover-agent-context-transfer.md`

Conformance results: all 30 real `validate_document.py` invocations exited 0. DQI scores ranged from 85 to 100, so every document cleared the required 75 threshold. The relative-link resolver found no broken Markdown links. Compact playbook frontmatter, repository-wide filename conventions, and the established validator-schema gaps were treated as expected and did not produce findings.

## Findings by Severity

### P0

#### R2-P0-001: ClickUp MCP reference knowingly routes readers to nonexistent tools

- Evidence: `.opencode/skills/mcp-tooling/mcp-click-up/references/mcp_tools.md:23`, `:58`, `:85`, `:109`, `:118`, `:212`, `:231`, `:250`, `:307`.
- Issue: the document records that live discovery found no goals, bulk-create, webhook, checklist, guest, user-group, or audit-log tools, then continues to recommend and provide executable examples for those same nonexistent tools.
- Exact fix: replace Sections 4-10 and 12 with the verified 51-tool inventory, use the actual callable `clickup.clickup_clickup_*` names, and remove every unsupported routing row and example.
- Claim adjudication: claim=`the reference advertises operations its own live evidence says do not exist`; counterevidence sought=`the verification note and troubleshooting tool-name guidance`; alternative explanation=`the lower sections are intentionally retained historical material`; final severity=`P0` because the active decision table and copy-paste examples still instruct execution; confidence=`0.99`; downgrade trigger=`all stale sections are visibly quarantined as non-routable history and no active route points to them`.

#### R2-P0-002: bdg documentation invents concurrent named sessions over a single-session CLI

- Evidence: `.opencode/skills/mcp-tooling/mcp-chrome-devtools/references/session_management.md:236-291` and `.opencode/skills/mcp-tooling/mcp-chrome-devtools/references/cdp_patterns.md:649-668`; live `bdg 0.6.10 --help` exposes one global `status`/`stop` lifecycle and no session selector or named-session option.
- Issue: both examples start multiple sessions but all later operations call the same global `bdg status` and `bdg stop`; the associative array tracks labels locally without selecting distinct bdg sessions.
- Exact fix: remove the concurrent/named-session claims, document sequential single-session use, or provide real isolated daemon/profile/port commands with explicit selectors proven by live help.
- Claim adjudication: claim=`the examples cannot address the distinct sessions they claim to manage`; counterevidence sought=`live CLI help for session IDs, names, or selectors`; alternative explanation=`different background PIDs implicitly isolate state`; final severity=`P0` because every control command still targets global state; confidence=`0.96`; downgrade trigger=`a supported selector is documented and each command is rewritten to use it`.

#### R2-P0-003: Figma `arrange` is classified as non-destructive against live CLI truth

- Evidence: `.opencode/skills/mcp-tooling/mcp-figma/references/tool_surface.md:102`, `:193`; `.opencode/skills/mcp-tooling/mcp-figma/references/figma_cli_reference.md:247`; live `figma-ds-cli 1.2.0 --help` says `arrange ALL top-level frames on canvas - destructive, sorts alphabetically`.
- Issue: the policy explicitly says `arrange` is not destructive and omits it from the destructive set, contradicting the installed binary's own warning.
- Exact fix: classify `arrange` as DESTRUCTIVE, add it to the omit-by-default set and rollback table, and require explicit target/scope, confirmation, and duplicate/version-history rollback.
- Claim adjudication: claim=`the safety taxonomy understates arrange`; counterevidence sought=`source-note rationale that it only repositions`; alternative explanation=`destructive is being reserved for deletion only`; final severity=`P0` because the installed command labels itself destructive and affects all top-level frames; confidence=`0.99`; downgrade trigger=`live subcommand help proves a bounded dry-run or non-destructive mode and the docs route exclusively to it`.

#### R2-P0-004: Claude templates dispatch agents that do not exist in the current roster

- Evidence: `.opencode/skills/cli-external/cli-claude-code/assets/prompt_templates.md:294`, `:303`, `:442-443`; `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/agent-routing/handover-agent-context-transfer.md:27-50`; the current `.opencode/agents/` roster has `markdown.md` but no `write.md` or `handover.md`, and `.claude/agents/` is absent.
- Issue: copy-paste commands route to `--agent write` and `--agent handover`; the handover scenario therefore cannot test the claimed current capability.
- Exact fix: route documentation work to the real `markdown` agent, replace handover dispatch with the canonical continuity workflow or add a real runtime-correct handover agent before retaining the scenario.
- Claim adjudication: claim=`the named agents are not loadable from the current project agent directories`; counterevidence sought=`both runtime-specific agent directories and the skill roster`; alternative explanation=`Claude Code provides hidden built-in agents with these names`; final severity=`P0` because project docs claim project-defined routing and no definitions exist; confidence=`0.95`; downgrade trigger=`a live `claude --agent` run or checked-in definition proves both names resolve`.

#### R2-P0-005: Multiple JSON playbooks query stale envelope fields

- Evidence: `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/cli-invocation/default-model-selection-sonnet.md:49`, `reasoning-and-models/haiku-fast-classification.md:49`, `reasoning-and-models/opus-extended-thinking.md:49`, and `reasoning-and-models/sonnet-balanced-default.md:49` query `.cost` and `.duration`, while the current Claude Code single-result envelope uses `total_cost_usd` and `duration_ms`.
- Issue: the checks read null values and cannot enforce their cost/runtime gates.
- Exact fix: update every jq query and assertion to `total_cost_usd` and `duration_ms`, preserve the raw envelope as evidence, and fail explicitly when a required field is null.
- Claim adjudication: claim=`the playbook queries do not match the current JSON envelope`; counterevidence sought=`current 2.1.206 help and all alternate key fallbacks already present in the slice`; alternative explanation=`an account-specific wrapper adds aliases`; final severity=`P0` because no wrapper is named and null fields invalidate the gate; confidence=`0.90`; downgrade trigger=`a captured 2.1.206 envelope proves `.cost` and `.duration` are populated aliases`.

#### R2-P0-006: Base invocation scenario never captures the Claude process exit code

- Evidence: `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/cli-invocation/base-non-interactive-invocation.md:48-50` runs Claude through `tee`, then runs `echo "Exit: $?"` as a separate Bash step.
- Issue: `$?` in the later shell cannot refer to the prior Claude process; without `pipefail`, the pipeline status is also `tee`'s status. A failed dispatch can pass the exit-code criterion.
- Exact fix: run under `set -o pipefail`, capture `${PIPESTATUS[0]}` in the same shell invocation, persist it, and assert it equals zero.
- Claim adjudication: claim=`the scenario's exit evidence is disconnected from the process under test`; counterevidence sought=`same-shell chaining or PIPESTATUS capture`; alternative explanation=`the playbook runner preserves shell state between numbered Bash steps`; final severity=`P0` because each step is explicitly a separate Bash invocation; confidence=`0.99`; downgrade trigger=`the runner contract proves a shared shell and pipefail, or the command is rewritten to capture status atomically`.

#### R2-P0-007: stream-json test corrupts its own JSON channel

- Evidence: `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/cli-invocation/stream-json-incremental-output.md:47-49` merges stderr into stdout with `2>&1`, writes the mixture as `.jsonl`, and requires every line to parse as JSON.
- Issue: any warning or diagnostic on stderr makes the asserted JSONL unparsable even when Claude's stdout stream is valid; the test confounds transport correctness with stderr cleanliness.
- Exact fix: capture stdout to the JSONL evidence file and stderr to a separate log, capture the process exit atomically, parse only stdout, and report stderr independently.
- Claim adjudication: claim=`the test can fail a valid JSON stream by mixing channels`; counterevidence sought=`a CLI guarantee that stderr is always empty in stream-json mode`; alternative explanation=`2>&1 is intended to preserve all diagnostics in one artifact`; final severity=`P0` because that artifact is then required to be pure JSONL; confidence=`0.98`; downgrade trigger=`the current CLI contract guarantees all diagnostics are JSON events on stdout and emits nothing on stderr`.

### P1

None. All 30 assigned documents passed the real structural validator and DQI threshold; established compact playbook/frontmatter conventions were not misclassified as defects.

### P2

#### R2-P2-001: Bypass playbook names the same sibling twice

- Evidence: `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/permission-modes/bypass-permissions-guard-rail-sandboxed.md:54`.
- Issue: the optional check says to cross-check `cli-opencode` and `cli-opencode`, losing the intended second family member.
- Exact fix: replace one duplicate with `cli-claude-code` or name the actual second sibling intended by the cross-family check.

## Traceability Checks

- `validate_document.py`: 30/30 exit 0 using `reference` for references and `asset` for assets/playbook scenarios.
- `extract_structure.py`: 30/30 DQI >=75; minimum 85, maximum 100.
- Relative Markdown links: no unresolved paths in the 30-document slice.
- Nested hub paths: no active stale top-level path defect found in the slice; bare packet-local names were treated as local shorthand where their context made resolution unambiguous.
- Capability checks: live `claude 2.1.206`, `bdg 0.6.10`, `cupt 0.8.0`, and `figma-ds-cli 1.2.0` help were compared with the assigned docs.
- Expected gaps not filed: repository-wide TOC policy, compact playbook shape, established filename conventions, and pointer-card assets.

## SCOPE VIOLATIONS

- During read-only capability verification, invoking `bdg --version` unexpectedly started the bdg daemon and performed its internal stale-session cleanup before printing version `0.6.10`. No reviewed file was changed and no cleanup/stop action was attempted because that would add another out-of-scope mutation. This side effect should be avoided in later iterations by using package metadata or a documented no-start probe.

## Verdict

FAIL: seven confirmed P0 reality/test-contract defects remain in this 30-document slice.

## Next Dimension

Continue `reality-alignment` on the next assigned corpus slice, prioritizing feature catalogs and remaining playbook capability claims.

Review verdict: FAIL
