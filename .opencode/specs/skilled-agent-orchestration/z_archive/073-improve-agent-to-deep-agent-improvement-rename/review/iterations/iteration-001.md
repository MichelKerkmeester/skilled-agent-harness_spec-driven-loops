## Dispatcher

- Command: `/speckit:deep-review:auto`
- Agent: `@deep-review` LEAF iteration only; no sub-agent dispatch used.
- Iteration: 1 of 5
- Focus: correctness
- Budget profile: `verify` (chosen because this pass needed existence checks plus command/runtime reference verification)
- Status: complete

## Files Reviewed

- `specs/skilled-agent-orchestration/z_archive/073-improve-agent-to-deep-agent-improvement-rename/review/deep-review-config.json`
- `specs/skilled-agent-orchestration/z_archive/073-improve-agent-to-deep-agent-improvement-rename/review/deep-review-state.jsonl`
- `specs/skilled-agent-orchestration/z_archive/073-improve-agent-to-deep-agent-improvement-rename/review/deep-review-findings-registry.json`
- `specs/skilled-agent-orchestration/z_archive/073-improve-agent-to-deep-agent-improvement-rename/review/deep-review-strategy.md`
- `specs/skilled-agent-orchestration/z_archive/073-improve-agent-to-deep-agent-improvement-rename/implementation-summary.md`
- `specs/skilled-agent-orchestration/z_archive/073-improve-agent-to-deep-agent-improvement-rename/resource-map.md`
- `.opencode/commands/deep/start-agent-improvement-loop.md`
- `.claude/commands/deep/start-agent-improvement-loop.md`
- `.gemini/commands/deep/start-agent-improvement-loop.toml`
- `.opencode/commands/README.txt`
- `.claude/commands/README.txt`
- `.gemini/commands/deep/start-agent-improvement-loop.toml`
- `.opencode/commands/deep/assets/`
- `.claude/commands/deep/assets/`
- `.opencode/skills/deep-agent-improvement/manual_testing_playbook/08--agent-discipline-stress-tests/014-proposal-only-boundary.md`
- `.opencode/skills/deep-agent-improvement/manual_testing_playbook/08--agent-discipline-stress-tests/015-active-critic-overfit.md`
- `.opencode/skills/sk-code-review/references/review_core.md`

## Findings - New

### P0 Findings

- None.

### P1 Findings

- **F001**: Gemini improve command still points at obsolete YAML asset names -- `.gemini/commands/deep/start-agent-improvement-loop.toml:60` -- The active Gemini command says auto mode loads `assets/deep_start-agent-improvement-loop_auto.yaml` and confirm mode loads `assets/deep_start-agent-improvement-loop_confirm.yaml`, while the active renamed assets exist only as `deep_start-agent-improvement-loop_{auto,confirm}.yaml` under the command asset directories and the implementation summary claims the YAML filenames were renamed. This leaves the Gemini command instructions referencing stale, absent workflow filenames.
   - Finding class: cross-consumer
   - Scope proof: `.opencode/commands/deep/start-agent-improvement-loop.md:269` and `.claude/commands/deep/start-agent-improvement-loop.md:269` both reference `assets/deep_start-agent-improvement-loop_auto.yaml`, but `.gemini/commands/deep/start-agent-improvement-loop.toml:60` still references `assets/deep_start-agent-improvement-loop_auto.yaml`; `.gemini/commands/deep/start-agent-improvement-loop.toml:158` repeats the stale auto filename.
   - Affected surface hints: [`Gemini command mirror`, `improve command workflow asset routing`, `runtime command docs`]
   - Recommendation: Update the Gemini command TOML and README to the renamed `deep_start-agent-improvement-loop_{auto,confirm}.yaml` asset names, or explicitly document why Gemini does not load YAML assets if that is the intended runtime convention.
   - Claim adjudication: `{"type":"gate-relevant-p1","claim":"Gemini active command docs reference obsolete deep_start-agent-improvement-loop YAML filenames after the rename.","evidenceRefs":[".gemini/commands/deep/start-agent-improvement-loop.toml:60",".gemini/commands/deep/start-agent-improvement-loop.toml:61",".gemini/commands/deep/start-agent-improvement-loop.toml:158",".gemini/commands/deep/start-agent-improvement-loop.toml:159",".opencode/commands/deep/start-agent-improvement-loop.md:269",".claude/commands/deep/start-agent-improvement-loop.md:269"],"counterevidenceSought":"Checked OpenCode and Claude command docs/assets for the renamed filename pattern; both use deep_start-agent-improvement-loop_{auto,confirm}.yaml. Checked the Gemini improve command directory and found only improve-agent.toml plus README.txt, not replacement old-name assets.","alternativeExplanation":"Gemini may intentionally be a TOML-only mirror, but its active prompt still instructs loading assets/old-name YAML files, so the stale reference remains a correctness issue unless the command is rewritten to avoid YAML loading.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade to P2 only if Gemini runtime is formally documented as never loading these YAML asset references and the TOML text is non-executable prose."}`

- **F002**: Active manual-testing playbook commands still load the removed agent path -- `.opencode/skills/deep-agent-improvement/manual_testing_playbook/08--agent-discipline-stress-tests/014-proposal-only-boundary.md:77` -- The CP-041 playbook builds its `@deep-agent-improvement` prompt by running `cat .opencode/agents/improve-agent.md`, but the active agent file was renamed to `.opencode/agents/deep-agent-improvement.md` and old active paths are absent. The same stale path appears in CP-042, so these active verification commands fail before exercising the renamed agent.
   - Finding class: cross-consumer
   - Scope proof: Direct existence check found only `.opencode/agents/deep-agent-improvement.md`, `.claude/agents/deep-agent-improvement.md`, `.gemini/agents/deep-agent-improvement.md`, and `.codex/agents/deep-agent-improvement.toml`; no active `improve-agent` agent files were returned. CP-041 and CP-042 both still shell out to `cat .opencode/agents/improve-agent.md`.
   - Affected surface hints: [`deep-agent-improvement manual testing playbook`, `CP-041 proposal-only test`, `CP-042 critic-overfit test`, `agent rename verification`]
   - Recommendation: Replace the stale `cat .opencode/agents/improve-agent.md` prompt-materialization paths with `.opencode/agents/deep-agent-improvement.md` in active playbook command blocks and update evidence table wording that still says Call B prepends the old file.
   - Claim adjudication: `{"type":"gate-relevant-p1","claim":"Active deep-agent-improvement playbook command blocks still depend on the removed .opencode/agents/improve-agent.md path.","evidenceRefs":[".opencode/skills/deep-agent-improvement/manual_testing_playbook/08--agent-discipline-stress-tests/014-proposal-only-boundary.md:77",".opencode/skills/deep-agent-improvement/manual_testing_playbook/08--agent-discipline-stress-tests/014-proposal-only-boundary.md:93",".opencode/skills/deep-agent-improvement/manual_testing_playbook/08--agent-discipline-stress-tests/015-active-critic-overfit.md:73"],"counterevidenceSought":"Checked renamed agent file inventory and found the four deep-agent-improvement files present with old active agent paths absent; checked whether these playbook references were under z_archive/spec history and they are active skill docs, not historical z_archive/spec references.","alternativeExplanation":"The playbook may preserve old transcript names as historical context, but these lines are executable command blocks and expected-signal tables for current manual tests, so they should follow the active renamed path.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade to P2 only if these CP-041/CP-042 files are formally retired from active playbook execution and marked historical."}`

- **F003**: Completion artifact still contains required-population placeholders while claiming COMPLETE -- `specs/skilled-agent-orchestration/z_archive/073-improve-agent-to-deep-agent-improvement-rename/implementation-summary.md:33` -- The implementation summary marks the packet `COMPLETE` and claims the summary itself is populated, but the same file still contains `[POPULATE-T-023: ...]` placeholders in the completed date, impact hook, delivery story, commit evidence, limitations, and changelog cross-reference. That contradicts the completion and verification claims for the packet's acceptance artifact.
   - Finding class: matrix/evidence
   - Scope proof: The contradiction is instance-local to the packet completion artifact: `implementation-summary.md:33` says complete, `implementation-summary.md:125` says REQ-010 is met because this file is populated, but `implementation-summary.md:43`, `implementation-summary.md:55`, `implementation-summary.md:79`, `implementation-summary.md:133`, `implementation-summary.md:134`, `implementation-summary.md:147`, and `implementation-summary.md:161` still contain `[POPULATE]` placeholders.
   - Affected surface hints: [`implementation-summary`, `completion evidence`, `memory/resume continuity`, `release readiness`]
   - Recommendation: Populate or remove all T-023 placeholders before claiming the packet complete; if commit evidence is intentionally unavailable, record that limitation explicitly instead of leaving placeholders.
   - Claim adjudication: `{"type":"gate-relevant-p1","claim":"The implementation summary's COMPLETE/REQ-010 claims are contradicted by unresolved [POPULATE] placeholders in the same active file.","evidenceRefs":["specs/skilled-agent-orchestration/z_archive/073-improve-agent-to-deep-agent-improvement-rename/implementation-summary.md:33","specs/skilled-agent-orchestration/z_archive/073-improve-agent-to-deep-agent-improvement-rename/implementation-summary.md:43","specs/skilled-agent-orchestration/z_archive/073-improve-agent-to-deep-agent-improvement-rename/implementation-summary.md:55","specs/skilled-agent-orchestration/z_archive/073-improve-agent-to-deep-agent-improvement-rename/implementation-summary.md:79","specs/skilled-agent-orchestration/z_archive/073-improve-agent-to-deep-agent-improvement-rename/implementation-summary.md:125","specs/skilled-agent-orchestration/z_archive/073-improve-agent-to-deep-agent-improvement-rename/implementation-summary.md:133"],"counterevidenceSought":"Checked whether placeholders were limited to historical z_archive/spec references; they are in the active implementation-summary file for the reviewed packet. Checked strategy known context, which also flags placeholder content as known context.","alternativeExplanation":"Some placeholders may be low-impact editorial scaffolding, but the file explicitly claims the implementation-summary requirement is met because the file is populated, making unresolved placeholders a completion-evidence correctness bug.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade to P2 only if the workflow accepts placeholder implementation summaries as complete artifacts and documents that policy elsewhere."}`

### P2 Findings

- None.

## Traceability Checks

- `spec_code`: partial for correctness. The 4 renamed agent files exist and old active agent paths were absent in the checked runtime agent glob. Command references are inconsistent in Gemini, producing P1-001.
- `checklist_evidence`: partial for correctness. Implementation-summary verification claims were checked against current files; P1-003 shows the completion artifact is not fully populated.
- `skill_agent`: partial for correctness. Active deep-agent-improvement playbook references were checked as correctness evidence; P1-002 shows stale old-path command blocks.
- `agent_cross_runtime`: clean for direct agent-file existence/absence in the checked 4 runtime agent locations.

## Integration Evidence

- `.opencode/commands/deep/start-agent-improvement-loop.md:269` and `.claude/commands/deep/start-agent-improvement-loop.md:269` point to `assets/deep_start-agent-improvement-loop_auto.yaml`; `.gemini/commands/deep/start-agent-improvement-loop.toml:60` still points to `assets/deep_start-agent-improvement-loop_auto.yaml`.
- `.opencode/commands/deep/assets/` and `.claude/commands/deep/assets/` contain only the renamed `deep_start-agent-improvement-loop_{auto,confirm}.yaml` files.
- Direct runtime agent inventory found the renamed 4-agent set: `.opencode/agents/deep-agent-improvement.md`, `.claude/agents/deep-agent-improvement.md`, `.gemini/agents/deep-agent-improvement.md`, `.codex/agents/deep-agent-improvement.toml`.

## Edge Cases

- The dispatch requested a delta file in addition to the agent contract's canonical writable set. Because the dispatch explicitly resolved it under the review packet root, this iteration writes `review/deltas/iter-001.jsonl` as packet-local loop state.
- Historical `z_archive` and `.opencode/specs/...` references were treated as out of scope unless an active file used them as current evidence. Active skill playbook files are not historical z_archive/spec records and were therefore in scope for correctness evidence.
- `.gemini/commands/deep/` has no local `assets/` directory in the checked directory listing, so the stale TOML references may be command-text drift rather than a missing-file-only issue; either way, current active instructions point at obsolete YAML names.

## Confirmed-Clean Surfaces

- 4 renamed agent files exist in the checked runtime agent locations, and old active `improve-agent` agent paths were absent from the runtime-agent glob.
- OpenCode and Claude improve command markdown reference the renamed YAML asset filenames.
- OpenCode and Claude improve asset directories contain the renamed `deep_start-agent-improvement-loop_auto.yaml` and `deep_start-agent-improvement-loop_confirm.yaml` files.

## Ruled Out

- Did not treat historical `z_archive` references as active defects.
- Did not flag the unchanged slash command `/deep:start-agent-improvement-loop` or unchanged Gemini command filename `.gemini/commands/deep/start-agent-improvement-loop.toml`; the packet explicitly documents those as intentional non-renames.
- Did not review unrelated deep-agent-improvement behavior beyond rename/path correctness.

## Next Focus

- Dimension: security
- Focus area: verify the rename did not introduce path-resolution, sandbox, authorization, or trust-boundary regressions in active command/YAML/agent surfaces.
- Reason: correctness pass found no agent-file existence issue, but stale active command/playbook references create path-resolution risk that security should inspect for unsafe fallbacks or unintended file access.
- Rotation status: correctness completed with 3 active P1 findings.
- Blocked/productive carry-forward: Productive evidence sources were command mirrors, asset directories, implementation-summary, and active deep-agent-improvement playbook docs.
- Required evidence: direct line citations from active command/YAML/agent/security-relevant docs; avoid historical z_archive/spec references unless active files claim them as current behavior.
