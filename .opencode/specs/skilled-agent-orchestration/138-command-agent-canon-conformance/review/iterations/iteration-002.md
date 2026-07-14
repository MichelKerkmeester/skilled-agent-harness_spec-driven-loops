# Deep Review Iteration 002

## Dimension

Correctness: scope reconciliation, validator behavior, sync-generator invariants, cross-runtime parity, and deferred external-path behavior.

## Files Reviewed

- Parent scope and handoff: .opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance/spec.md:88-113.
- Command and agent lane configuration: 000-foundations/lane-config.json:1-28.
- Codex prompt parity contract: 003-codex-command-parity/spec.md:58-104.
- Review matrix: review/deep-review-config.json:47, 80-107, and 147-155.
- Validator implementation: .opencode/skills/sk-doc/shared/scripts/validate_document.py:323-352.
- Sync implementations: sync-agents.cjs:20-37 and 59-97; sync-prompts.cjs:10-105.
- All 28 direct seven-family command files, all 26 agent markdown files, 13 Codex TOML outputs, 37 Codex prompt outputs, plus phase-002 task/checklist evidence.

## Findings

### P0

None.

### P1

#### P1-001 — Review matrix conflates the seven-family canon lane with the 37-source prompt-parity lane

- File: .opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance/review/deep-review-config.json:47.
- Evidence: lane-config.json:8-14 and parent spec:90 intentionally define 28 command files for template-canon validation. Phase 003 defines recursive command discovery and requires 37 generated prompts at spec.md:60-62 and 86. The review matrix lists the 28 family commands but only nine prompt outputs, so it does not make the two coverage contracts explicit.
- Finding class: matrix/evidence.
- Scope proof: exact family validation covered 28/28 with zero failures; sync-prompts.cjs discovered 37/37 sources and the committed mirror passed its aggregate check. The remaining gap is review-scope representation, not an unvalidated family command.
- Status: carried forward and narrowed. The nine deep/router sources are intentionally outside the seven-family canon lane, but they remain part of phase-003 prompt parity.
- Recommendation: split reviewScopeFiles into named canon and prompt-parity surfaces, or document the aggregate sync check as the owner for all 37 prompt sources and list the nine excluded canon sources explicitly.

#### P1-002 — sync-agents.cjs --check is red while phase 002 claims 13/13 parity

- Files: .codex/agents/ai-council.toml:1 and .codex/agents/context.toml:1.
- Evidence: sync-agents.cjs --check returned exit 1 and reported STALE for exactly those two outputs. Phase-002 tasks.md:75 and :88 claim the same gate is GREEN for 13/13.
- Finding class: cross-consumer.
- Scope proof: the gate enumerated all 13 canonical agent sources and found no missing or extra output; the failure is reproducible on two generated consumers.
- Recommendation: regenerate the two TOMLs from current canonical markdown, rerun --check, and reconcile phase-002 completion evidence.

#### P1-003 — Parent completion criteria still require home prompt installation that child 003 explicitly defers

- Files: parent spec.md:92 and :113; 003-codex-command-parity/spec.md:64-66 and :90-92.
- Evidence: the parent lists ~/.codex/prompts/ installation and stale create-symlink repair in scope, while the child explicitly defers both pending operator confirmation. sync-prompts.cjs has no home-directory or symlink mutation path, and ~/.codex/prompts/create is absent in this environment.
- Finding class: matrix/evidence.
- Scope proof: the repo-local 37/37 prompt tree and --check gate pass; the unresolved condition is the parent handoff contract for the deferred external mutation.
- Recommendation: amend the parent handoff/scope to record the approved deferral, or obtain the required operator decision and add a separately authorized home-install step.

### P2

#### P2-002 — HISTORICAL_SETTINGS omits deep-alignment from the explicit legacy-settings map

- File: .opencode/skills/system-spec-kit/scripts/codex/sync-agents.cjs:20-37.
- Evidence: the source inventory contains 13 agents, but HISTORICAL_SETTINGS names 12 and omits deep-alignment. That agent currently succeeds through deriveSandboxMode/default fallback and does not cause drift, but its Codex settings are not pinned by the same historical-preservation path.
- Finding class: class-of-bug.
- Scope proof: source-name versus map-name comparison found exactly one missing key; sync-agents.cjs --check still passes for deep-alignment.
- Recommendation: add the missing explicit entry if historical settings are authoritative for every agent, or document why deep-alignment intentionally uses derived defaults.

The section-0 validator result is not a new defect. The full 26-file sweep exited 0 for every agent and emitted exactly the documented 22 warnings for the 11 agents carrying canon-required section 0. P2-001 from iteration 1 is resolved as an instance-only representative finding.

## Traceability Checks

- Core spec_code: partial. The 28-file seven-family scope is internally consistent; phase 003 expands the prompt source set to 37, but the review matrix does not separate those ownership surfaces.
- Core checklist_evidence: failed for the live parity claim. Phase-002 evidence says 13/13, while the current sync gate reports two stale files.
- Validator coverage: pass. 28/28 in-scope command files and 26/26 agent markdown files exited 0; 22 agent warnings match the documented section-0 dialect.
- sync-prompts correctness: pass. --check reports 37 prompts in sync; the flat-name probe found 37 unique source/output names and no collisions; spot checks reference the correct canonical commands and forward arguments.
- sync-agents correctness: fail. --check reports two stale generated outputs.
- Agent cross-runtime: partial. Frontmatter dialect differences are expected; after normalizing runtime-path references, 10/13 bodies are exact and the remaining three differences are two formatting-only changes plus one runtime-path wording change, with no observed workflow divergence.
- Home prompt/symlink behavior: explicitly deferred by child 003, but not reconciled with the parent handoff criteria.
- Resource-map coverage: skipped because review/resource-map.md is absent.

## Verdict

CONDITIONAL. No P0 findings. Three active P1 findings remain; the settings-map gap is advisory. The prior representative validator warning is resolved.

## Next Dimension

Security: inspect trust boundaries, path handling, command execution, generated-file mutation, and home-directory assumptions in the sync and validation tooling.

Review verdict: CONDITIONAL
