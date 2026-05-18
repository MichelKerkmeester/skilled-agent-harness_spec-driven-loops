# Deep Review Strategy - fleet-marker-validation-sweep

Command-owned deep review of `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold`, with artifacts written only under this packet's local `review/` directory.

## Review Charter

- Target: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/007-marker-validation-unused-scaffold`
- Target type: `spec_folder`
- Execution mode: `auto`
- Executor: model `gpt-5.5`, requested reasoning effort `high`
- Max iterations: 5
- Convergence threshold: 0.10
- Resource map at target root: absent. Skip resource-map coverage gate and derive implementation scope from phase markers plus the 010 template-system implementation ledger.
- Target authority: do not write to any other phase folder, especially `006-command-markdown-yaml-workflow-alignment`.

## Non-Goals

- Do not remediate reviewed implementation files during this review.
- Do not reuse or write artifacts under the historical `006-command-markdown-yaml-workflow-alignment/review` packet.
- Do not broaden into unrelated memory/runtime work unless required to prove a finding against the marker validation sweep.

## Stop Conditions

- Stop after five configured dimensions are covered or `maxIterations` is reached.
- Stop early only if all configured dimensions are covered, no active P0/P1 findings remain, evidence/scope/coverage gates pass, and convergence allows it.
- Any active P1 yields a `CONDITIONAL` verdict; any active P0 yields a `FAIL` verdict.

## Review Dimensions

- [x] D1 implementation-spec-alignment - Confirm target packet, marker intent, and implementation ledger evidence align. Iteration 001 found active P1 alignment gaps in target authoring and graph metadata.
- [x] D2 code-correctness - Check marker emission logic and related command/runtime assumptions for behavioral correctness. Iteration 002 found an active P1 validator-consumer gap where scaffold marker comments are counted as authored evidence.
- [x] D3 template-rendering-correctness - Verified scaffold marker behavior does not corrupt rendered Level output or template-source contracts. Iteration 003 found no new rendering defect and kept F003 scoped to validator consumers.
- [x] D4 validator-coverage - Verified the default validation path, semantic shell validators, registry metadata, and tests. Iteration 004 found an active P1 coverage gap: the Node validation path omits SECTION_COUNTS and AI_PROTOCOLS.
- [x] D5 cross-runtime-mirror-consistency - Checked command/agent/mirror wording and cli-copilot executor authority parity. Iteration 005 found an active P1 wiring gap: auto mode passes the wrong discriminator to the target-authority helper and confirm mode bypasses it.

## Files Under Review

| File | Dimensions | Iterations | Findings | Status |
|------|------------|------------|----------|--------|
| `007-marker-validation-unused-scaffold/spec.md` | implementation-spec-alignment, template-rendering-correctness, validator-coverage | 001 | P1-001 | reviewed |
| `007-marker-validation-unused-scaffold/plan.md` | implementation-spec-alignment, template-rendering-correctness, validator-coverage | 001 | P1-001 | reviewed |
| `007-marker-validation-unused-scaffold/tasks.md` | implementation-spec-alignment, validator-coverage | 001 | P1-001 | reviewed |
| `007-marker-validation-unused-scaffold/checklist.md` | implementation-spec-alignment, validator-coverage | 001 | P1-001 | reviewed |
| `007-marker-validation-unused-scaffold/implementation-summary.md` | implementation-spec-alignment | 001 | P1-001 | reviewed |
| `007-marker-validation-unused-scaffold/decision-record.md` | implementation-spec-alignment | 001 | P1-001 | reviewed |
| `007-marker-validation-unused-scaffold/description.json` | implementation-spec-alignment | 001 | P1-002 | reviewed |
| `007-marker-validation-unused-scaffold/graph-metadata.json` | implementation-spec-alignment | 001 | P1-002 | reviewed |
| `003-manifest-template-implementation-plan/resource-map.md` | implementation-spec-alignment | 001 | - | reviewed |
| `003-manifest-template-implementation-plan/implementation-summary.md` | implementation-spec-alignment | 001 | - | reviewed |
| `.opencode/skills/system-spec-kit/scripts/spec/create.sh` | code-correctness, template-rendering-correctness | 001, 002, 003 | F003 | reviewed |
| `.opencode/skills/system-spec-kit/scripts/rules/check-ai-protocols.sh` | code-correctness, validator-coverage | 002 | F003 | reviewed |
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | validator-coverage | 002, 004 | F004 | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts` | validator-coverage | 004 | F004 | reviewed |
| `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` | validator-coverage | 004 | F004 | reviewed |
| `.opencode/skills/system-spec-kit/scripts/rules/check-*.sh` | code-correctness, validator-coverage | 002, 004 | F003/F004 | reviewed |
| `.opencode/skills/system-spec-kit/templates/manifest/*.tmpl` | template-rendering-correctness | 003 | - | reviewed |
| `.opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json` | template-rendering-correctness, validator-coverage | 003 | - | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/lib/templates/level-contract-resolver.ts` | template-rendering-correctness | 003 | - | reviewed |
| `.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.*` | template-rendering-correctness | 003 | - | reviewed |
| `.opencode/commands/spec_kit/deep-review.md` | cross-runtime-mirror-consistency | 005 | F005 context | reviewed |
| `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml` | cross-runtime-mirror-consistency | 005 | F005 | reviewed |
| `.opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | cross-runtime-mirror-consistency | 005 | F005 | reviewed |
| `.opencode/agents/deep-review.md` and runtime mirrors | cross-runtime-mirror-consistency | 005 | - | reviewed |
| `.opencode/skills/sk-deep-review/assets/prompt_pack_iteration.md.tmpl` | cross-runtime-mirror-consistency | 005 | carry-forward from packet 005 | reviewed |
| `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts` | cross-runtime-mirror-consistency | 005 | F005 context | reviewed |

## Cross-Reference Status

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | fail | 004 | Target scaffold docs do not describe the marker sweep, validator consumers count marker comments as semantic evidence, and the active default validation path omits those semantic validators. |
| `checklist_evidence` | core | fail | 004 | Target checklist is scaffolded, generic, and unchecked; iteration 004 confirmed there is no negative marker-comment fixture proving scaffold comments are rejected as authored validation evidence. |
| `skill_agent` | overlay | partial | 005 | `sk-deep-review` command-owned dispatch and delta contract are sound, but the shared prompt-pack doctrine path remains stale as already recorded in packet 005. |
| `agent_cross_runtime` | overlay | pass | 005 | Canonical and runtime mirror deep-review agents share the same LEAF, binding, and write-boundary contracts. |
| `command_yaml` | overlay | fail | 005 | cli-copilot auto and confirm branches do not consistently apply `buildCopilotPromptArg` target-authority semantics. |
| `feature_catalog_code` | overlay | notApplicable | - | No feature catalog files are primary scope for this marker sweep. |
| `playbook_capability` | overlay | notApplicable | - | No manual playbook files are primary scope for this marker sweep. |

## Known Context

- The target packet `007-marker-validation-unused-scaffold` is the approved authority and artifact owner.
- `resource-map.md` is absent in the target; the workflow skips the resource-map coverage gate.
- The target `implementation-summary.md` is scaffolded, so implementation scope must be derived from phase markers and the 010 implementation ledger.
- The relevant implementation markers are emitted by `.opencode/skills/system-spec-kit/scripts/spec/create.sh`: `SCAFFOLD_VALIDATION_COUNTS` appended to `spec.md` and `SCAFFOLD_AI_PROTOCOL_MARKERS` appended to Level 3+ `plan.md`.
- Iteration 002 confirmed marker append is idempotent for normal reruns and Level-gated for AI-protocol markers, but `check-section-counts.sh` and `check-ai-protocols.sh` consume the marker comments as authored evidence.
- Iteration 003 confirmed scaffold markers are absent from manifest template sources and are appended after inline-gate rendering plus `SPECKIT_TEMPLATE_SOURCE` normalization, so F003 remains a validator-consumer defect rather than a template-rendering defect.
- Iteration 004 confirmed F003 has a distinct validator-coverage companion issue: default strict validation exits through the Node orchestrator before `SECTION_COUNTS` and `AI_PROTOCOLS` shell rules run, and the reviewed tests lack negative `SCAFFOLD_*` HTML-comment fixtures.
- Historical artifacts under `006-command-markdown-yaml-workflow-alignment/review_archive/...` mention this same target, but they are not the legal artifact owner for this run.
- Iteration 005 confirmed the agent mirrors themselves are consistent, but cli-copilot workflow parity is not: auto mode passes `{ type: 'approved' }` to a helper that expects `{ kind: 'approved' }`, and confirm mode bypasses the helper.

## Running Findings

| ID | Severity | Dimension | Evidence | Status |
|----|----------|-----------|----------|--------|
| P1-001 | P1 | implementation-spec-alignment | `007/spec.md:79`, `007/plan.md:39`, `007/tasks.md:50`, `create.sh:528` | active |
| P1-002 | P1 | implementation-spec-alignment | `007/graph-metadata.json:5`, `007/description.json:10`, `010/graph-metadata.json:6`, `010/spec.md:86` | active |
| P1-003 | P1 | code-correctness | `check-section-counts.sh:61`, `check-ai-protocols.sh:60`, `create.sh:528` | active |
| P1-004 | P1 | validator-coverage | `validate.sh:1019`, `orchestrator.ts:355`, `validator-registry.json:123`, `validator-registry.json:187` | active |
| P1-005 | P1 | cross-runtime-mirror-consistency | `spec_kit_deep-review_auto.yaml:703`, `executor-config.ts:101`, `executor-config.ts:275`, `spec_kit_deep-review_confirm.yaml:700` | active |

## What Worked

- Init: Resolved flat artifact root to `007-marker-validation-unused-scaffold/review/` and created fresh state.
- Iteration 001: Confirmed the scaffold marker comments in 007 match the marker emission blocks in `create.sh`.
- Iteration 002: Confirmed marker emission is idempotent for normal reruns and AI-protocol marker emission is Level 3+ gated.
- Iteration 003: Confirmed template rendering and template-source placement are clean; scaffold markers are post-render finalization comments.
- Iteration 004: Confirmed the validator coverage gap is distinct from F003: active validation orchestration omits the registered semantic marker validators and scoped tests lack negative comment fixtures.
- Iteration 005: Confirmed canonical and mirrored deep-review agents share the same packet-boundary contract, then isolated the target-authority failure to cli-copilot YAML/helper wiring.

## What Failed

- Iteration 001: `spec_code` and `checklist_evidence` alignment checks failed because 007 remains scaffold-authored and graph-disconnected.
- Iteration 002: Code correctness failed because semantic validators count `SCAFFOLD_*` comment tokens as real requirements, scenarios, and AI-protocol content.
- Iteration 003: No new rendering failure; active failures remain F001/F002/F003 carry-forward items.
- Iteration 004: Validator coverage failed because default strict validation exits through the Node orchestrator before `SECTION_COUNTS` and `AI_PROTOCOLS` run, so F003 is not enforceable through the active validation path.
- Iteration 005: Cross-runtime command/YAML parity failed because cli-copilot auto mode passes the wrong target-authority discriminator and confirm mode bypasses the helper, allowing the authority preamble to be omitted.

## Exhausted Approaches

- None yet.

## Edge Cases

- The target packet contains scaffold placeholders and marker comments by design or fixture role; severity must distinguish fixture intent from active release readiness. Iteration 001 classified this as P1 because the packet is the approved review authority.
- The validator may count marker comments as real content because shell grep scans comments unless explicitly excluded.
- The default Node validation path may mask shell semantic-validator regressions unless rule parity or fallback orchestration is added.
- cli-copilot deep-review dispatch needs a correctly shaped target-authority token before `--allow-all-tools`; otherwise recovered or historical context can regain influence over write authority.

## Next Focus

- Dimension: synthesis/max-iterations
- Focus area: Compile final review-report.md with active P1 findings and CONDITIONAL verdict.
- Reason: All five configured custom dimensions are covered and maxIterations has been reached.
- Rotation status: D1, D2, D3, D4, and D5 complete.
- Blocked/productive carry-forward: P1-001, P1-002, P1-003, P1-004, and P1-005 remain active for synthesis.
- Required evidence: final report should cite target scaffold/metadata evidence, semantic marker validator behavior, default validation path bypass, and cli-copilot authority wiring.

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
- [ ] security
- [ ] maintainability

<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] traceability

<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 5
- P2 (Suggestions): 0
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Ruled out a Level-gating defect for `SCAFFOLD_AI_PROTOCOL_MARKERS`; the AI-protocol marker is intentionally limited to Level 3+ by numeric level comparison. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Ruled out a Level-gating defect for `SCAFFOLD_AI_PROTOCOL_MARKERS`; the AI-protocol marker is intentionally limited to Level 3+ by numeric level comparison.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out a Level-gating defect for `SCAFFOLD_AI_PROTOCOL_MARKERS`; the AI-protocol marker is intentionally limited to Level 3+ by numeric level comparison.

### Ruled out a manifest-template contamination defect: the scoped manifest templates do not contain `SCAFFOLD_*` marker strings. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Ruled out a manifest-template contamination defect: the scoped manifest templates do not contain `SCAFFOLD_*` marker strings.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out a manifest-template contamination defect: the scoped manifest templates do not contain `SCAFFOLD_*` marker strings.

### Ruled out a marker-emission idempotence defect for normal reruns because both append blocks are guarded by marker-presence checks. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Ruled out a marker-emission idempotence defect for normal reruns because both append blocks are guarded by marker-presence checks.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out a marker-emission idempotence defect for normal reruns because both append blocks are guarded by marker-presence checks.

### Ruled out a P0 severity because no exploit, credential exposure, destructive write, or data-loss behavior was observed in this review dimension. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Ruled out a P0 severity because no exploit, credential exposure, destructive write, or data-loss behavior was observed in this review dimension.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out a P0 severity because no exploit, credential exposure, destructive write, or data-loss behavior was observed in this review dimension.

### Ruled out a P0 severity: no security, data-loss, or destructive runtime behavior was found in this alignment pass. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Ruled out a P0 severity: no security, data-loss, or destructive runtime behavior was found in this alignment pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out a P0 severity: no security, data-loss, or destructive runtime behavior was found in this alignment pass.

### Ruled out a template-source placement defect: marker finalization runs after `ensure_template_source_near_top`, and generated target files show the template-source marker directly after frontmatter. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Ruled out a template-source placement defect: marker finalization runs after `ensure_template_source_near_top`, and generated target files show the template-source marker directly after frontmatter.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out a template-source placement defect: marker finalization runs after `ensure_template_source_near_top`, and generated target files show the template-source marker directly after frontmatter.

### Ruled out an inline-gate rendering defect for marker comments: inline gates are stripped by the renderer, while scaffold marker comments are appended by `create.sh` after rendering. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Ruled out an inline-gate rendering defect for marker comments: inline gates are stripped by the renderer, while scaffold marker comments are appended by `create.sh` after rendering.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out an inline-gate rendering defect for marker comments: inline gates are stripped by the renderer, while scaffold marker comments are appended by `create.sh` after rendering.

### Ruled out duplicating F003: this iteration found no evidence that rendering corrupts output; F003 remains a validator-consumer defect. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Ruled out duplicating F003: this iteration found no evidence that rendering corrupts output; F003 remains a validator-consumer defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out duplicating F003: this iteration found no evidence that rendering corrupts output; F003 remains a validator-consumer defect.

### Ruled out duplicating P1-001/P1-002; this iteration's code-correctness evidence introduces a distinct validator-consumer issue rather than changing the prior alignment or metadata findings. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Ruled out duplicating P1-001/P1-002; this iteration's code-correctness evidence introduces a distinct validator-consumer issue rather than changing the prior alignment or metadata findings.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out duplicating P1-001/P1-002; this iteration's code-correctness evidence introduces a distinct validator-consumer issue rather than changing the prior alignment or metadata findings.

### Ruled out flagging target `resource-map.md` absence as a finding because the prompt explicitly configured the resource-map gate as skipped. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Ruled out flagging target `resource-map.md` absence as a finding because the prompt explicitly configured the resource-map gate as skipped.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out flagging target `resource-map.md` absence as a finding because the prompt explicitly configured the resource-map gate as skipped.

### Ruled out P0 severity: no exploit, credential exposure, destructive write, data loss, or release-blocking rendering corruption was observed in this dimension. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Ruled out P0 severity: no exploit, credential exposure, destructive write, data loss, or release-blocking rendering corruption was observed in this dimension.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out P0 severity: no exploit, credential exposure, destructive write, data loss, or release-blocking rendering corruption was observed in this dimension.

### Ruled out treating historical `006-command-markdown-yaml-workflow-alignment` review artifacts as authority; this iteration used 007-local review state only. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Ruled out treating historical `006-command-markdown-yaml-workflow-alignment` review artifacts as authority; this iteration used 007-local review state only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out treating historical `006-command-markdown-yaml-workflow-alignment` review artifacts as authority; this iteration used 007-local review state only.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: `synthesis/max-iterations` - Focus area: Compile final review-report.md with active P1 findings and CONDITIONAL verdict. - Carry-forward: F001/P1-001, F002/P1-002, F003/P1-003, F004/P1-004, and F005/P1-005 remain active and should inform synthesis.

<!-- /ANCHOR:next-focus -->
