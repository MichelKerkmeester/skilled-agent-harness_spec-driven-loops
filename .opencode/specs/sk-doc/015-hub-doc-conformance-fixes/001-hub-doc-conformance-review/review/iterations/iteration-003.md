# Review Iteration 003

## Dimension

- Focus: `sk-doc-conformance`
- Dimensions audited: `sk-doc-conformance`, `reality-alignment`
- Scope class: complex
- Enforcement: strict
- Validators: all 30 files passed `validate_document.py --type asset`; DQI range was 84-91, above the required 75.
- Expected schema gaps: none of the established repo-wide validator gaps were promoted to findings.

## Files Reviewed

1. `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/agent-routing/multi-ai-council-multi-strategy-planning.md`
2. `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/agent-routing/orchestrate-agent-multi-step.md`
3. `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/agent-routing/research-agent-investigation.md`
4. `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/agent-routing/review-agent-security-audit.md`
5. `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/agent-routing/speckit-agent-spec-folder.md`
6. `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/session-continuity/continue-previous-conversation.md`
7. `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/session-continuity/resume-specific-session-by-id.md`
8. `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/integration-patterns/generate-review-fix-cycle.md`
9. `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/integration-patterns/structured-output-with-json-schema.md`
10. `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/prompt-templates/clear-quality-card-5-check.md`
11. `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/prompt-templates/prompt-template-usage-from-assets.md`
12. `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/cost-and-background/background-execution.md`
13. `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/cost-and-background/max-budget-usd-cap.md`
14. `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/manual_testing_playbook.md`
15. `.opencode/skills/cli-external/cli-opencode/manual_testing_playbook/cli-invocation/base-non-interactive-invocation.md`
16. `.opencode/skills/cli-external/cli-opencode/manual_testing_playbook/cli-invocation/dir-flag-working-directory.md`
17. `.opencode/skills/cli-external/cli-opencode/manual_testing_playbook/cli-invocation/file-attachment-via-f-flag.md`
18. `.opencode/skills/cli-external/cli-opencode/manual_testing_playbook/cli-invocation/format-default-vs-json.md`
19. `.opencode/skills/cli-external/cli-opencode/manual_testing_playbook/cli-invocation/pure-and-print-logs.md`
20. `.opencode/skills/cli-external/cli-opencode/manual_testing_playbook/external-dispatch/from-claude-code.md`
21. `.opencode/skills/cli-external/cli-opencode/manual_testing_playbook/external-dispatch/self-invocation-refusal.md`
22. `.opencode/skills/cli-external/cli-opencode/manual_testing_playbook/multi-provider/deepseek-direct-api.md`
23. `.opencode/skills/cli-external/cli-opencode/manual_testing_playbook/multi-provider/variant-levels-comparison.md`
24. `.opencode/skills/cli-external/cli-opencode/manual_testing_playbook/agent-routing/context-leaf-agent.md`
25. `.opencode/skills/cli-external/cli-opencode/manual_testing_playbook/agent-routing/deep-research-agent-iterations.md`
26. `.opencode/skills/cli-external/cli-opencode/manual_testing_playbook/agent-routing/deep-review-agent-audit.md`
27. `.opencode/skills/cli-external/cli-opencode/manual_testing_playbook/agent-routing/general-agent-default.md`
28. `.opencode/skills/cli-external/cli-opencode/manual_testing_playbook/agent-routing/multi-ai-council-multi-strategy.md`
29. `.opencode/skills/cli-external/cli-opencode/manual_testing_playbook/agent-routing/orchestrate-agent-multi-agent.md`
30. `.opencode/skills/cli-external/cli-opencode/manual_testing_playbook/agent-routing/review-agent-security-audit.md`

## Findings by Severity

### P0

#### R3-P0-001: Nine OpenCode scenarios use a top-level agent route the current skill forbids

- File: `.opencode/skills/cli-external/cli-opencode/manual_testing_playbook/cli-invocation/base-non-interactive-invocation.md:15`
- Affected files: CO-001, CO-002, CO-003, CO-004, CO-005, CO-006, CO-011, CO-012 and CO-013 scenario files.
- Issue: Each command pins `--agent general`, while the current cli-opencode contract says the default invocation omits `--agent` because top-level `general` is rejected or falls back. CO-013 additionally cites the nonexistent `.opencode/agents/general.md`.
- Exact fix: Remove `--agent general` from ordinary top-level invocations, rewrite CO-013 to validate the unflagged default-agent path and update agent assertions to match observable current runtime metadata.
- Scope proof: The nine files in this slice contain the stale route; `.opencode/skills/cli-external/cli-opencode/SKILL.md:271-277,299-309,333-337` defines the current contract.

Claim adjudication:
- claim: The documented commands do not exercise the current supported default invocation.
- evidenceRefs: [`.opencode/skills/cli-external/cli-opencode/manual_testing_playbook/cli-invocation/base-non-interactive-invocation.md:15`, `.opencode/skills/cli-external/cli-opencode/manual_testing_playbook/agent-routing/general-agent-default.md:27`, `.opencode/skills/cli-external/cli-opencode/SKILL.md:271-277`]
- counterevidenceSought: Checked live `opencode run --help` and the current skill's primary/subagent routing section.
- alternativeExplanation: The files may preserve an older OpenCode version's accepted invocation shape.
- finalSeverity: P0
- confidence: 0.99
- downgradeTrigger: A real dispatch on the supported baseline proves `--agent general` loads the intended project agent and the current SKILL contract is amended accordingly.

#### R3-P0-002: Deep-loop scenarios bypass the command-owned state machine

- File: `.opencode/skills/cli-external/cli-opencode/manual_testing_playbook/agent-routing/deep-research-agent-iterations.md:27`
- Affected files: CO-032 and CO-033.
- Issue: The scenarios advertise raw `opencode run --agent deep-research|deep-review` and implement an `orchestrate` simulation with `/tmp` state. Current contracts make these loop executors command-owned by `/deep:research` and `/deep:review`, with canonical packet-local config, strategy, state, iteration and delta artifacts.
- Exact fix: Exercise the owning `/deep:*` command workflow against a pre-bound packet and validate the real packet-local artifacts; do not synthesize `/tmp` state or route loop executors through a generic orchestrator simulation.

Claim adjudication:
- claim: The tests cannot prove the production deep-loop contract because they bypass its state owner.
- evidenceRefs: [`.opencode/skills/cli-external/cli-opencode/manual_testing_playbook/agent-routing/deep-research-agent-iterations.md:27-33`, `.opencode/skills/cli-external/cli-opencode/manual_testing_playbook/agent-routing/deep-review-agent-audit.md:27-33`, `.opencode/skills/cli-external/cli-opencode/SKILL.md:303-311`]
- counterevidenceSought: Read both LEAF agent definitions for any supported standalone state initialization path.
- alternativeExplanation: The files call themselves simulators and may have been intended only as agent smoke tests.
- finalSeverity: P0
- confidence: 0.99
- downgradeTrigger: Reclassify the scenarios explicitly as non-production agent-shape smokes and add separate command-owned end-to-end coverage.

#### R3-P0-003: Claude scenarios invoke absent `research` and `speckit` agents

- File: `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/agent-routing/research-agent-investigation.md:27`
- Affected files: CC-023 and CC-024.
- Issue: Both scenarios require `--agent research|speckit`, but neither `.opencode/agents/research.md` nor `.opencode/agents/speckit.md` exists, and no `.claude/agents/` equivalents exist in the workspace.
- Exact fix: Add and register the documented agents on the actual Claude-discovery surface, or replace these scenarios with commands using extant agents/workflows and update the roster count.

Claim adjudication:
- claim: The exact commands target agent slugs without backing definitions in this workspace.
- evidenceRefs: [`.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/agent-routing/research-agent-investigation.md:27-31`, `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/agent-routing/speckit-agent-spec-folder.md:27-31`]
- counterevidenceSought: Searched both `.opencode/agents/` and `.claude/agents/` for the full documented roster.
- alternativeExplanation: The operator may have user-global agents with these names.
- finalSeverity: P0
- confidence: 0.98
- downgradeTrigger: Project-local or explicitly required global agent definitions are present and verified by `claude --agent` dispatch.

#### R3-P0-004: Eight source tables point at a deleted uppercase root filename

- File: `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/agent-routing/orchestrate-agent-multi-step.md:64`
- Affected files: CC-022, CC-023, CC-024, CC-026, CC-027, CO-032, CO-033 and CO-034.
- Issue: Their source tables and metadata cite `MANUAL_TESTING_PLAYBOOK.md`; the real file is lowercase `manual_testing_playbook.md` after the recorded rename.
- Exact fix: Replace every uppercase source reference in these eight files with `manual_testing_playbook.md` and keep the source metadata synchronized.

Claim adjudication:
- claim: The source anchors are dead on the case-sensitive canonical path contract.
- evidenceRefs: [`.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/agent-routing/orchestrate-agent-multi-step.md:64`, `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/cost-and-background/max-budget-usd-cap.md:64`, `.opencode/skills/cli-external/cli-opencode/manual_testing_playbook/agent-routing/deep-review-agent-audit.md:64`]
- counterevidenceSought: Checked both uppercase and lowercase paths and the cli-claude-code rename changelog.
- alternativeExplanation: Case-insensitive macOS filesystems may hide the failure locally.
- finalSeverity: P0
- confidence: 1.0
- downgradeTrigger: None while the canonical filename remains lowercase.

#### R3-P0-005: CC-027 waits for a background PID from a different shell

- File: `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/cost-and-background/background-execution.md:50`
- Issue: Step 2 backgrounds Claude and exits its shell; step 4 starts another shell and runs `wait <pid>`. A shell can only wait for its own children, so the documented acceptance path fails independently of Claude behavior.
- Exact fix: Launch, responsiveness probe, `wait`, exit capture and output assertion in one shell process, or rewrite the scenario around the current `claude --bg` plus `claude agents` lifecycle.

Claim adjudication:
- claim: The scenario's own shell mechanics make its required `wait_exit=0` impossible.
- evidenceRefs: [`.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/cost-and-background/background-execution.md:27-33`, `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/cost-and-background/background-execution.md:50`]
- counterevidenceSought: Checked whether the command sequence declares a shared shell or job-control session; it does not.
- alternativeExplanation: A human might paste all displayed steps into one interactive shell despite the per-step `bash:` notation.
- finalSeverity: P0
- confidence: 0.99
- downgradeTrigger: The playbook explicitly binds the steps to one shell and captures the child exit there.

#### R3-P0-006: The Claude root playbook contradicts its own verdict vocabulary

- File: `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/manual_testing_playbook.md:9`
- Issue: The execution policy permits only PASS, FAIL or SKIP, while section 5 defines and propagates PARTIAL at lines 107-116.
- Exact fix: Choose one canonical verdict enum and use it in the execution policy, scenario rules, feature rollup and release gate.

Claim adjudication:
- claim: Two mutually exclusive verdict contracts make result classification non-deterministic.
- evidenceRefs: [`.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/manual_testing_playbook.md:9`, `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/manual_testing_playbook.md:107-116`]
- counterevidenceSought: Checked later release-readiness rules for an override; none reconciles the enums.
- alternativeExplanation: The first policy may intend to ban only UNAUTOMATABLE, not PARTIAL.
- finalSeverity: P0
- confidence: 0.98
- downgradeTrigger: The policy text explicitly admits PARTIAL and defines when it is legal.

#### R3-P0-007: CO-012 uses contradictory DeepSeek variant ceilings

- File: `.opencode/skills/cli-external/cli-opencode/manual_testing_playbook/multi-provider/variant-levels-comparison.md:27`
- Issue: The mandatory test dispatches `deepseek/deepseek-v4-pro --variant max`, while its own provider table lists `xhigh` for that same model and then duplicates the model with a conflicting `max` row. The current skill only establishes `high` as the standing DeepSeek default.
- Exact fix: Resolve the live provider-supported variant set first, use two accepted endpoints for the comparison and remove the duplicate contradictory model rows.

Claim adjudication:
- claim: The test's upper-bound command is not supported by a consistent documented provider contract.
- evidenceRefs: [`.opencode/skills/cli-external/cli-opencode/manual_testing_playbook/multi-provider/variant-levels-comparison.md:27-33`, `.opencode/skills/cli-external/cli-opencode/manual_testing_playbook/multi-provider/variant-levels-comparison.md:49`, `.opencode/skills/cli-external/cli-opencode/manual_testing_playbook/multi-provider/variant-levels-comparison.md:53-60`]
- counterevidenceSought: Checked live `opencode run --help` and current cli-opencode model-selection guidance; the help labels variants provider-specific and does not define DeepSeek's ceiling.
- alternativeExplanation: The direct provider may accept `max` even though the table was duplicated incorrectly.
- finalSeverity: P0
- confidence: 0.95
- downgradeTrigger: A live model-capability probe proves `max` is accepted and the table is corrected to one unambiguous row.

#### R3-P0-008: CO-017's no-write oracle contradicts the current AI Council contract

- File: `.opencode/skills/cli-external/cli-opencode/manual_testing_playbook/agent-routing/multi-ai-council-multi-strategy.md:15`
- Issue: The scenario requires no file modifications and describes ai-council as planning-only, but the current agent is a scoped-write planner that must persist packet-local `ai-council/**` artifacts and has write/edit permission there.
- Exact fix: Pre-bind a spec packet, require the canonical council route and assert writes occur only under that packet's `ai-council/**` subtree while all other paths remain unchanged.

Claim adjudication:
- claim: A conforming current AI Council run can fail this scenario solely by producing its required artifacts.
- evidenceRefs: [`.opencode/skills/cli-external/cli-opencode/manual_testing_playbook/agent-routing/multi-ai-council-multi-strategy.md:15-19`, `.opencode/skills/cli-external/cli-opencode/manual_testing_playbook/agent-routing/multi-ai-council-multi-strategy.md:27-33`, `.opencode/agents/ai-council.md:25-29`]
- counterevidenceSought: Read the live ai-council frontmatter and write-boundary rules.
- alternativeExplanation: The scenario may target an older read-only council implementation.
- finalSeverity: P0
- confidence: 1.0
- downgradeTrigger: The active council contract returns to read-only and no longer requires artifact persistence.

#### R3-P0-009: CC-024 advertises a stale top-level spec-folder path

- File: `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/agent-routing/speckit-agent-spec-folder.md:31`
- Issue: The expected path is `.opencode/specs/[###-short-name]/`, but tracked packets currently require `.opencode/specs/[track]/[###-short-name]/` unless a concrete legacy location applies.
- Exact fix: Update the expected signal and prompt to include the track segment and distinguish tracked from legacy packet locations.

Claim adjudication:
- claim: The scenario teaches a path that violates the current tracked-packet convention.
- evidenceRefs: [`.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/agent-routing/speckit-agent-spec-folder.md:27-33`]
- counterevidenceSought: Checked the repository's active spec-folder convention and current packet topology.
- alternativeExplanation: The scenario may intend a legacy untracked packet.
- finalSeverity: P0
- confidence: 0.99
- downgradeTrigger: The scenario explicitly labels the path as legacy and tests a legacy-only workflow.

#### R3-P0-010: CC-026 can pass when cost metadata is missing

- File: `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/cost-and-background/max-budget-usd-cap.md:50`
- Issue: The final assertion defaults a missing `.total_cost_usd` and `.cost` to `0`, so `OK_UNDER_CAP` is emitted even though the scenario requires a present numeric cost field. Its `2>&1 > file` order also leaves stderr outside the evidence file.
- Exact fix: Fail unless one supported cost field exists and is numeric, compare that value to the cap and redirect with `> file 2>&1` when a combined evidence file is intended.

Claim adjudication:
- claim: The oracle produces a false PASS for the exact missing-metadata condition it says must fail.
- evidenceRefs: [`.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/cost-and-background/max-budget-usd-cap.md:27-33`, `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/cost-and-background/max-budget-usd-cap.md:50`]
- counterevidenceSought: Checked whether an earlier step fails on an empty cost; extraction uses `empty` but does not enforce a non-empty result.
- alternativeExplanation: The author may have assumed the CLI always emits one of the keys.
- finalSeverity: P0
- confidence: 1.0
- downgradeTrigger: The assertion uses `jq -e` to require a numeric field before comparison.

#### R3-P0-011: CC-014 claims high-effort depth but omits the effort flag

- File: `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/agent-routing/multi-ai-council-multi-strategy-planning.md:31`
- Issue: Expected signals require `--effort high` style depth, but the exact command supplies Opus, ai-council and plan mode without `--effort high`; the supplemental note then guesses that some agent definitions inject it.
- Exact fix: Add `--effort high` to the exact command and assert the explicit invocation, or remove effort-specific acceptance criteria and test only observable strategy/rubric output.

Claim adjudication:
- claim: The scenario cannot attribute observed depth to the flag it never passes.
- evidenceRefs: [`.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/agent-routing/multi-ai-council-multi-strategy-planning.md:27-33`, `.opencode/skills/cli-external/cli-claude-code/manual_testing_playbook/agent-routing/multi-ai-council-multi-strategy-planning.md:49-53`]
- counterevidenceSought: Checked the current ai-council definition for an explicit effort injection contract; none was established in the reviewed evidence.
- alternativeExplanation: The agent prompt itself may induce long output without the CLI effort flag.
- finalSeverity: P0
- confidence: 0.96
- downgradeTrigger: A registered agent contract explicitly guarantees the same effort setting and the test verifies that resolved setting.

### P1

None. All files passed the structural validator and exceeded DQI 75.

### P2

None.

## Traceability Checks

- `playbook_capability`: fail, 11 findings; current commands, agents, state ownership and test oracles do not consistently match executable reality.
- `feature_catalog_code`: not applicable to this slice.
- `skill_agent`: partial; existing context/review/orchestrate/deep-loop agents were checked, but absent research/speckit definitions block full roster alignment.
- `agent_cross_runtime`: fail; no `.claude/agents/` files exist while cli-claude-code SKILL.md names that surface, and project-local `.opencode/agents/` lacks two tested slugs.
- Markdown links: 52 checked, 0 broken. Code-span source references were also audited, yielding R3-P0-004.
- Validator conformance: 30/30 exit 0.
- DQI: 30/30 at or above 75; minimum 84.

## SCOPE VIOLATIONS

None. Review targets remained read-only and all writes stayed in the pre-bound review packet.

## Verdict

FAIL. Eleven P0 reality-alignment defects make scenarios non-executable, falsely passing or incompatible with current command/agent contracts.

## Next Dimension

Continue `sk-doc-conformance` on the next unreviewed corpus slice, preserving the paired reality-alignment audit and prioritizing remaining manual playbook command/oracle drift.

Review verdict: FAIL
