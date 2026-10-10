# Review Iteration 7: Traceability overlays

## Dimension

Traceability, broadened to the overlay protocols. This is a fresh review of the failed iteration-7 attempt; its record is absent from the state log.

## Files Reviewed

- Anchor integrity catalog and implementation: [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/anchor-integrity-and-nesting-check.md:18], [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:796], [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:109].
- Anchor repair catalog and implementation: [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/heal-spec-docs-anchor-repair.md:28], [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:417], [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:597].
- Healer lane-mode catalog and implementation: [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/heal-spec-docs-lane-modes.md:28], [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1332], [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1360].
- Repository-era catalog, implementation, and tests: [SOURCE: .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/repo-era-report.md:28], [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs:421], [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs:448], [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/repo-era.vitest.ts:283].
- Doctor check and compatibility playbooks and command assets: [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-check.md:14], [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-compat.md:14], [SOURCE: .skilled/commands/doctor/assets/doctor-update-check.yaml:16], [SOURCE: .skilled/commands/doctor/assets/doctor-update-compat-action.yaml:5].
- Healer anchor-repair, lane-mode, and repo-era playbooks: [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/heal-spec-docs-anchor-repair-dry-run.md:14], [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/heal-spec-docs-anchor-repair-apply.md:26], [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/heal-spec-docs-lane-modes.md:26], [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/repo-era-report.md:26].
- Canonical skill, Hermes mirror, repository policy, and command flow: [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:499], [SOURCE: .hermes/skills/system-spec-kit/SKILL.md:504], [SOURCE: AGENTS.md:86], [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:56].
- Cross-runtime deep-review agent definitions: [SOURCE: .codex/agents/deep-review.toml:3], [SOURCE: .claude/agents/deep-review.md:2], [SOURCE: .hermes/agents/deep-review.md:2], [SOURCE: .opencode/agents/deep-review.md:2], [SOURCE: .pi/agents/deep-review.md:2].
- Changelog claims for the reviewed tooling surfaces: [SOURCE: .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md:47], [SOURCE: .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md:81], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:49], [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:83].

Manual scenarios were compared with command contracts but were not executed. Raw `cmp` of the canonical skill and Hermes mirror returned exit 1. The diff shows a generated-mirror banner and runtime-relative link rewrites; the mirror is not byte-identical.

## Findings by Severity

### P0

None.

### P1

#### R7-P1-001: Child-dispatch Gate 3 exception is missing from the skill and implementation command

- File: .skilled/skills/system-spec-kit/SKILL.md:499
- Evidence: The root policy pre-resolves Gate 3 for non-interactive child dispatches [SOURCE: AGENTS.md:86]. The canonical skill still says to ask and wait for A/B/C/D on file changes and forbids proceeding without confirmation [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:499] [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:526]. The implementation command also says to stop, ask, and wait, without the exemption [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:56] [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:59]. A child that follows these lower-level instructions literally can wait for an answer that is unavailable.
- Claim: The skill and implementation command omit the root policy exception for child dispatches and can block an already-bound non-interactive worker.
- Counterevidence sought: Checked the root exception, both skill copies, and the command Gate 3 wording; searched those surfaces for the child-dispatch environment markers. The root exception is explicit, but the skill and command text does not repeat it.
- Alternative explanation: The root policy has higher precedence, and a dispatch prompt may carry the exemption explicitly, which can prevent a compliant worker from waiting.
- Finding class: cross-consumer.
- Scope proof: The unconditional wait appears in the canonical skill and implementation command; the root exception is the conflicting consumer policy.
- Affected surface hints: canonical system-spec-kit skill, Hermes skill mirror, speckit implementation command.
- Recommendation: State the child-dispatch exemption next to the skill and command Gate 3 waits while retaining the question for interactive sessions.
- Final severity: P1. Confidence: 0.86.
- Downgrade trigger: A runtime conformance check proves child-dispatch markers suppress both prompts, and the skill and command document that behavior.

### P2

#### R7-P2-001: Repository-era catalog overstates the no-specs case

- File: .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/repo-era-report.md:28
- Evidence: The catalog says that no `specs` folder means v3. The implementation sets v3 only when a distinct `.opencode/specs` root or description residue exists, and otherwise returns `unknown` when neither layout root exists [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs:421] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs:442] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs:448].
- Claim: The catalog omits the legacy-root condition, so its sentence also describes a checkout with neither root as v3.
- Counterevidence sought: The catalog introduces both roots and its v3 example could be read as assuming the legacy root exists; the implementation and tests confirm v3 for that legacy-root case.
- Alternative explanation: The sentence may intend the ordinary v3-only layout, but it does not state that the legacy root must exist.
- Finding class: instance-only.
- Scope proof: Directly compared the catalog sentence with the layout predicate and returned `kind` in `repo-era.mjs`.
- Recommendation: Say that an existing legacy `.opencode/specs` root with no `specs` root is v3; a checkout with neither root is unknown.
- Final severity: P2. Confidence: 0.97.

## Traceability Checks

- `feature_catalog_code`: Anchor integrity, anchor repair, and the five lane-mode descriptions align with their implementation. The repo-era catalog has the P2 overstatement above.
- `playbook_capability`: Doctor check and compatibility approval stages, plus healer dry-run/apply scenarios, match the command contracts in a static comparison. Scenarios were not run.
- `skill_agent`: Raw byte comparison is false. The observed diff is the generated Hermes banner and runtime-relative link rewrites. The child-dispatch Gate 3 mismatch is R7-P1-001.
- `agent_cross_runtime`: Deep-review definitions exist for Codex, Claude, Hermes, OpenCode, and Pi. Their review instructions match; differences are runtime-specific path references and frontmatter/string serialization.
- `changelog_claims`: The selected System Spec Kit claims in v2.7.1.0 and v4.0.0.4 about lane-mode behavior, doctor preview/approval, anchor validation, and anchor repair match the shipped code and command assets. No manual scenario was executed.
- Core `spec_code` and `checklist_evidence` protocols remain pending; this dispatch is limited to the named overlay protocols.

## Verdict

One P1 finding makes this iteration conditional. One P2 catalog finding is advisory.

## Next Dimension

Continue with iteration 8 under the reducer-selected focus. Core traceability remains pending.

## SCOPE VIOLATIONS

None. Only the authorized iteration artifacts were written; the append gateway owns the state log.

Review verdict: CONDITIONAL
