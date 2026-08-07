## Dispatcher

- Workflow: `/speckit:deep-review:auto`
- Iteration: 2 of 5
- Focus dimension: security
- Focus area: path-resolution, sandbox, authorization, proposal-only boundaries, untrusted interpolation, and stale-path security impact after the `@deep-agent-improvement` rename.
- Budget profile: verify
- Status: complete

## Files Reviewed

- `.opencode/commands/deep/start-agent-improvement-loop.md`
- `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml`
- `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml`
- `.gemini/commands/deep/start-agent-improvement-loop.toml`
- `.opencode/agents/deep-agent-improvement.md`
- `.opencode/skills/deep-agent-improvement/SKILL.md`
- `.opencode/skills/deep-agent-improvement/scripts/promote-candidate.cjs`
- `.opencode/skills/deep-agent-improvement/manual_testing_playbook/08--agent-discipline-stress-tests/014-proposal-only-boundary.md`
- `.opencode/skills/deep-agent-improvement/manual_testing_playbook/08--agent-discipline-stress-tests/015-active-critic-overfit.md`
- `.opencode/skills/sk-code-review/references/review_core.md`

## Findings - New

### P0 Findings

- None.

### P1 Findings

- None.

### P2 Findings

- None.

## Traceability Checks

- Security baseline loaded from `.opencode/skills/sk-code-review/references/review_core.md:18` through `.opencode/skills/sk-code-review/references/review_core.md:34`; no active P0/P1 security issue was supported by file-line evidence.
- Proposal-only boundary remains explicit in the renamed agent: it must write only one packet-local candidate and stop before scoring, promotion, or packaging [SOURCE: `.opencode/agents/deep-agent-improvement.md:24`, `.opencode/agents/deep-agent-improvement.md:26`, `.opencode/agents/deep-agent-improvement.md:38`, `.opencode/agents/deep-agent-improvement.md:40`].
- Command setup still requires a `.opencode/agents/*.md` target and confirmed spec-folder value before workflow execution [SOURCE: `.opencode/commands/deep/start-agent-improvement-loop.md:79`, `.opencode/commands/deep/start-agent-improvement-loop.md:83`, `.opencode/commands/deep/start-agent-improvement-loop.md:122`, `.opencode/commands/deep/start-agent-improvement-loop.md:136`].
- YAML workflow validation requires `target_path` and `spec_folder`, requires the target to exist, and constrains the target to `.opencode/agents/*.md` [SOURCE: `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml:57`, `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml:60`; auto parity at `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml:56`, `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml:59`].
- Guarded promotion remains outside the proposal agent and is blocked unless approval, proposal-only config disablement, promotion enablement, target/config/manifest alignment, benchmark pass, repeatability pass, and positive score delta are all present [SOURCE: `.opencode/skills/deep-agent-improvement/scripts/promote-candidate.cjs:81`, `.opencode/skills/deep-agent-improvement/scripts/promote-candidate.cjs:101`, `.opencode/skills/deep-agent-improvement/scripts/promote-candidate.cjs:106`, `.opencode/skills/deep-agent-improvement/scripts/promote-candidate.cjs:151`, `.opencode/skills/deep-agent-improvement/scripts/promote-candidate.cjs:156`].

## Integration Evidence

- OpenCode command selects renamed YAML assets for both modes, so the canonical command path does not fall back to obsolete `deep_start-agent-improvement-loop_*` workflow files [SOURCE: `.opencode/commands/deep/start-agent-improvement-loop.md:268`, `.opencode/commands/deep/start-agent-improvement-loop.md:270`].
- Gemini still names obsolete YAML assets, but security review found this is a load-path correctness failure rather than a fallback, traversal, sandbox escape, or authorization-bypass path because the file only instructs loading those exact relative asset names after setup resolution [SOURCE: `.gemini/commands/deep/start-agent-improvement-loop.toml:57`, `.gemini/commands/deep/start-agent-improvement-loop.toml:61`].
- Manual-testing CP-041/CP-042 still `cat .opencode/agents/improve-agent.md`; security review classified this as a stale absent-path test failure, not a broad read or sandbox escape, because the commands read one fixed in-repo path and then run in `/tmp/cp-041-*` or `/tmp/cp-042-*` sandboxes [SOURCE: `.opencode/skills/deep-agent-improvement/manual_testing_playbook/08--agent-discipline-stress-tests/014-proposal-only-boundary.md:70`, `.opencode/skills/deep-agent-improvement/manual_testing_playbook/08--agent-discipline-stress-tests/014-proposal-only-boundary.md:77`; `.opencode/skills/deep-agent-improvement/manual_testing_playbook/08--agent-discipline-stress-tests/015-active-critic-overfit.md:73`].

## Edge Cases

- Existing workflow command strings interpolate `{spec_folder}`, `{target_path}`, `{candidate_path}`, and related placeholders into shell command templates. This remains security-sensitive if a future executor substitutes untrusted shell metacharacters, but this iteration did not classify it as a new rename security finding because the reviewed evidence shows the rename changed agent/YAML identifiers, while setup validation and proposal/promotion gates still constrain target identity and canonical mutation.
- The command prompt offers `C) Use temporary directory` for spec-folder setup [SOURCE: `.opencode/commands/deep/start-agent-improvement-loop.md:106`, `.opencode/commands/deep/start-agent-improvement-loop.md:109`]. This may be worth traceability review against current spec-folder policy, but security evidence in this iteration did not show it authorizes canonical target edits or bypasses promotion gates.

## Confirmed-Clean Surfaces

- Renamed OpenCode agent: proposal-only and packet-local candidate boundary preserved.
- OpenCode auto/confirm YAML: target validation and packet-local improvement output paths preserved.
- Promotion helper: canonical target mutation remains gated by explicit `--approve`, runtime config, manifest, benchmark, repeatability, and score checks.
- F001 re-check: stale Gemini YAML names create unavailable workflow references, not an unsafe fallback or path traversal.
- F002 re-check: stale manual playbook `cat` path creates failed test prompt construction, not a broad file read or sandbox escape.

## Ruled Out

- No P0/P1 security finding for stale renamed paths: evidence supports correctness breakage, not exploitability.
- No finding for secrets or credentials: scoped searches across active command/YAML/agent/skill surfaces found security-relevant path and environment wording but no new secret value, credential material, or environment-precedence change tied to the rename.
- No finding for proposal-boundary bypass: the renamed agent and promotion helper keep candidate generation separate from scoring/promotion.
- No repeat of F001/F002 as correctness findings; they were considered only for security impact.

## Next Focus

- Dimension: traceability
- Focus area: spec, tasks, checklist, resource-map, implementation-summary, command mirrors, and active playbook references against the completed rename claims.
- Reason: security completed with no new P0/P1/P2 findings; prior correctness findings remain open and should be cross-checked against packet evidence and claimed completion status.
- Rotation status: correctness and security completed; traceability pending; maintainability pending.
- Blocked/productive carry-forward: productively inspect implementation-summary placeholders, Gemini command asset naming, active playbook old-path references, and resource-map/checklist coverage.
- Required evidence: direct file-line citations from packet docs and active runtime surfaces; do not treat historical `z_archive` references as active defects unless current docs cite them as live evidence.
