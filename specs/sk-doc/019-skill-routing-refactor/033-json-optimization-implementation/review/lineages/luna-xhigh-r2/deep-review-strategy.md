# Deep Review Strategy - Session Tracking

## Topic

Review the phase-parent spec and its twelve child packets for implementation correctness, security, traceability, and maintainability against the current repository tree.

## Review Charter

- Target: `.opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation` (spec-folder)
- Dimensions: correctness, security, traceability, maintainability
- Stop policy: run all four configured iterations; convergence is telemetry only.
- Max iterations: 4
- Convergence threshold: 0.10
- Resource map: `resource-map.md` not present; skipping coverage gate.

## Non-Goals

- Do not modify the reviewed spec, implementation, tests, workflows, or source files.
- Do not re-implement or repair findings during this review.
- Do not use external resources or broaden the target beyond the parent packet, its children, and implementation files explicitly referenced by them.

## Stop Conditions

- Stop only at the configured four-iteration ceiling, unless a fatal executor or state-integrity error makes continuation impossible.

## Completed Dimensions

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| correctness | conditional | 1 | Parent/child completion state and phase-011 live-generation acceptance are inconsistent; 2 P1 and 1 P2 recorded. |
| security | pass-with-advisory | 2 | No P0/P1 security issue found; one P2 hardening item recorded for implicit CI token permissions around dependency-backed commands. |
| traceability | conditional | 3 | Program-close strict-validation evidence does not support Complete; root feature catalog has packet-count drift against the live sk-doc registry. |
| maintainability | pass-with-advisory | 4 | Generated deep-routing and command-bridge check surfaces are maintainable, but the obsolete TS-only derived sync writer remains as an exported full-object schema path; 1 P2 recorded. |

## Running Findings

- P0 (Critical): 0 active
- P1 (Major): 3 active
- P2 (Minor): 4 active
- Delta this iteration: +0 P0, +0 P1, +1 P2

## What Worked

- Initialization: scope is anchored to the parent packet and implementation references.
- Iteration 1: parent/child status matrix plus command-bridge implementation anchors produced concrete correctness evidence.
- Iteration 2: security scan of CI workflow, Python subprocess call sites, and derived metadata boundaries separated one CI hardening advisory from clean shell-injection/path-boundary surfaces.
- Iteration 3: direct reconciliation of the parent close gate, phase-012 evidence artifact, sk-doc feature catalog, and manual playbook produced one gate-relevant traceability finding and one catalog drift advisory.
- Iteration 4: maintainability scan confirmed the generated deep-routing projection and command-bridge check flags are bounded, then isolated one obsolete exported derived-sync writer as an advisory.

## What Failed

- Iteration 1: broad status search was noisy because it included prior review lineage artifacts; direct rereads replaced it for evidence.
- Iteration 2: two dispatcher-declared implementation anchors were stale or missing in the current tree, so those exact paths could not be covered.
- Iteration 3: the strategy's exhausted-approaches section incorrectly labels the traceability next-focus overlays as blocked; the review proceeded by using the rendered iteration prompt and recording the contradiction as an edge case.
- Iteration 4: declared scope still included stale relocated paths and broad spec-folder searches surfaced older review-lineage artifacts; both were treated as edge-case noise rather than finding evidence.

## Exhausted Approaches

- Iteration 1: parent Phase Documentation Map status sweep is saturated for discovery; revisit only to verify remediation.
- Iteration 1: phase-011 live command-bridge generation acceptance is saturated for discovery; revisit only to verify a spec amendment or generated live cutover.
- Iteration 4: generated deep-loop alias projection drift is saturated for discovery; revisit only if the generated block hash or registry projection changes.
- Iteration 4: obsolete TS-only derived sync writer discovery is saturated; revisit only to verify removal, deprecation, or rewrite onto the preserve-first regenerator contract.

## Next Focus

complete — all configured review dimensions are covered; proceed to synthesis/remediation planning.

## Known Context

- Target pointers: parent `spec.md`, all twelve child phase packets, their checklists/plans/tasks/summaries, and source paths named by those packets.
- Behavior claims: the parent requires baseline-gated, dependency-ordered, guarded implementation of O1-O11 and strict validation across parent plus children.
- Reuse/conventions: generated blocks, compiler freshness checks, routing corpus gates, and phase transition rules are the declared control points.
- Review risks: stale completion evidence and claims of reverted live cutovers require direct source verification.

## Cross-Reference Status

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| spec_code | core | fail | 3 | Phase 011 generated-live-bridge acceptance remains unreconciled; phase-012 also leaves the parent Complete claim unsupported by the parent strict-validation gate. |
| checklist_evidence | core | fail | 3 | Phase-012 checklist marks parent completion reconciliation done while its final evidence records `validate.sh --strict` still blocked. |
| skill_agent | overlay | notApplicable | — | Target is a spec folder. |
| agent_cross_runtime | overlay | notApplicable | — | Target is a spec folder. |
| feature_catalog_code | overlay | partial | 3 | Root feature catalog and per-feature page cover sk-doc routing, but conflate twelve workflow modes with twelve packets. |
| playbook_capability | overlay | pass | 3 | Root manual playbook links the compiled-routing scenario and the scenario requires compiled serving plus legacy parity. |
| ci_token_permissions | security | partial | 2 | Routing-registry workflow has no explicit token permission floor while dependency-backed commands execute. |
| subprocess_shell_injection | security | pass | 2 | Reviewed subprocess sites use list-form invocations without shell interpolation. |
| derived_metadata_boundary | security | pass | 2 | Derived sync constrains skill directories to workspace root and sanitizer rejects instruction-shaped labels. |

## Files Under Review

The complete packet tree is under review. Implementation anchors:

- .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts\n- .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/aliases.ts\n- .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py\n- .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py\n- .opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/score-routing-corpus.py\n- .opencode/skills/system-skill-advisor/mcp-server/lib/derived/sync.ts\n- .opencode/skills/system-skill-advisor/mcp-server/lib/derived/sanitizer.ts\n- .opencode/skills/system-skill-advisor/mcp-server/lib/lifecycle/schema-migration.ts\n- .opencode/skills/system-skill-advisor/mcp-server/lib/skill-derived-v2.ts\n- .opencode/skills/system-skill-advisor/mcp-server/handlers/skill-graph/validate.ts\n- .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts\n- .opencode/skills/sk-doc/create-skill/scripts/init_skill.py\n- .github/workflows/routing-registry-drift.yml

## Review Boundaries

- Session: fanout-luna-xhigh-r2-1785384990122-crx2xm, generation 1, lineage new
- Artifact directory: .opencode/specs/sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/review/lineages/luna-xhigh-r2
- Review target files are read-only.
- Findings require [SOURCE: file:line] evidence.
- Every new P0/P1 requires a typed claim-adjudication packet.
- All workflow artifacts are confined to this lineage directory.

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 3
- P2 (Suggestions): 4
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `checklist_evidence`: partial. This iteration sampled status and implementation-summary evidence, not all checklist rows. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence`: partial. This iteration sampled status and implementation-summary evidence, not all checklist rows.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: partial. This iteration sampled status and implementation-summary evidence, not all checklist rows.

### `feature_catalog_code`: deferred to traceability iteration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `feature_catalog_code`: deferred to traceability iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: deferred to traceability iteration.

### `feature_catalog_missing_compiled_routing`: ruled out. Root and per-feature catalog pages cover the compiled-routing surface. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `feature_catalog_missing_compiled_routing`: ruled out. Root and per-feature catalog pages cover the compiled-routing surface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_missing_compiled_routing`: ruled out. Root and per-feature catalog pages cover the compiled-routing surface.

### `generated_deep_alias_projection_drift`: ruled out. The generated deep routing projection in `aliases.ts` is isolated by generated markers and hash metadata. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `generated_deep_alias_projection_drift`: ruled out. The generated deep routing projection in `aliases.ts` is isolated by generated markers and hash metadata.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `generated_deep_alias_projection_drift`: ruled out. The generated deep routing projection in `aliases.ts` is isolated by generated markers and hash metadata.

### `p0_maintainability_blocker`: ruled out. The new issue is an obsolete exported writer contract with no evidenced immediate destructive behavior, auth bypass, or credential exposure. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `p0_maintainability_blocker`: ruled out. The new issue is an obsolete exported writer contract with no evidenced immediate destructive behavior, auth bypass, or credential exposure.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `p0_maintainability_blocker`: ruled out. The new issue is an obsolete exported writer contract with no evidenced immediate destructive behavior, auth bypass, or credential exposure.

### `p0_traceability_blocker`: ruled out. No evidence of immediate harm, exploit path, or destructive data loss in this traceability slice. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `p0_traceability_blocker`: ruled out. No evidence of immediate harm, exploit path, or destructive data loss in this traceability slice.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `p0_traceability_blocker`: ruled out. No evidence of immediate harm, exploit path, or destructive data loss in this traceability slice.

### `parent_implementation_summary_absence_as_finding`: ruled out. The target is a phase parent, where lean parent docs are expected. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `parent_implementation_summary_absence_as_finding`: ruled out. The target is a phase parent, where lean parent docs are expected.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `parent_implementation_summary_absence_as_finding`: ruled out. The target is a phase parent, where lean parent docs are expected.

### `playbook_capability`: deferred to traceability iteration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `playbook_capability`: deferred to traceability iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: deferred to traceability iteration.

### `playbook_missing_compiled_routing`: ruled out. Root playbook indexes compiled-routing coverage and the scenario has pass/fail criteria. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `playbook_missing_compiled_routing`: ruled out. Root playbook indexes compiled-routing coverage and the scenario has pass/fail criteria.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_missing_compiled_routing`: ruled out. Root playbook indexes compiled-routing coverage and the scenario has pass/fail criteria.

### `python_command_bridge_uncheckable`: ruled out. The CLI exposes dump/check modes for bridge comparison; the still-unmet live generation cutover was already covered by prior correctness findings and was not re-entered. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `python_command_bridge_uncheckable`: ruled out. The CLI exposes dump/check modes for bridge comparison; the still-unmet live generation cutover was already covered by prior correctness findings and was not re-entered.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `python_command_bridge_uncheckable`: ruled out. The CLI exposes dump/check modes for bridge comparison; the still-unmet live generation cutover was already covered by prior correctness findings and was not re-entered.

### `spec_code`: fail for correctness. Phase 011 acceptance requires generated live command bridge blocks, while source still exposes live hand-authored bridge definitions. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code`: fail for correctness. Phase 011 acceptance requires generated live command bridge blocks, while source still exposes live hand-authored bridge definitions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: fail for correctness. Phase 011 acceptance requires generated live command bridge blocks, while source still exposes live hand-authored bridge definitions.

### core.checklist_evidence: carried-forward fail from prior iterations; this iteration used phase 003 checklist evidence only to confirm the preserve-first maintenance contract. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: core.checklist_evidence: carried-forward fail from prior iterations; this iteration used phase 003 checklist evidence only to confirm the preserve-first maintenance contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: core.checklist_evidence: carried-forward fail from prior iterations; this iteration used phase 003 checklist evidence only to confirm the preserve-first maintenance contract.

### core.checklist_evidence: fail. Phase 012 checklist marks completion reconciliation done while its own evidence cites a blocked strict-validation gate. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: core.checklist_evidence: fail. Phase 012 checklist marks completion reconciliation done while its own evidence cites a blocked strict-validation gate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: core.checklist_evidence: fail. Phase 012 checklist marks completion reconciliation done while its own evidence cites a blocked strict-validation gate.

### core.spec_code: carried-forward fail from prior iterations; not re-entered except where phase 003 explicitly names the maintainability contract for derived metadata. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: core.spec_code: carried-forward fail from prior iterations; not re-entered except where phase 003 explicitly names the maintainability contract for derived metadata.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: core.spec_code: carried-forward fail from prior iterations; not re-entered except where phase 003 explicitly names the maintainability contract for derived metadata.

### core.spec_code: fail. The parent completion requirement is not traceable to a passing strict-validation close artifact. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: core.spec_code: fail. The parent completion requirement is not traceable to a passing strict-validation close artifact.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: core.spec_code: fail. The parent completion requirement is not traceable to a passing strict-validation close artifact.

### Derived metadata path traversal: `skillDir` must stay under `workspaceRoot` before the write target is derived. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Derived metadata path traversal: `skillDir` must stay under `workspaceRoot` before the write target is derived.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Derived metadata path traversal: `skillDir` must stay under `workspaceRoot` before the write target is derived.

### Derived metadata prompt injection through generated labels: instruction-shaped and markup-shaped strings are rejected before storage. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Derived metadata prompt injection through generated labels: instruction-shaped and markup-shaped strings are rejected before storage.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Derived metadata prompt injection through generated labels: instruction-shaped and markup-shaped strings are rejected before storage.

### Did not classify the stale child `spec.md` continuity as P1 because implementation-summary continuity appears current enough to keep the primary resume path intact. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Did not classify the stale child `spec.md` continuity as P1 because implementation-summary continuity appears current enough to keep the primary resume path intact.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Did not classify the stale child `spec.md` continuity as P1 because implementation-summary continuity appears current enough to keep the primary resume path intact.

### maintainability.generated_projection_contract: partial. `aliases.ts` has a bounded generated deep-routing block with a hash [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/aliases.ts:21`], and Python exposes projection check flags [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:4418`], but the derived metadata writer surface still contains an obsolete full-object path. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: maintainability.generated_projection_contract: partial. `aliases.ts` has a bounded generated deep-routing block with a hash [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/aliases.ts:21`], and Python exposes projection check flags [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:4418`], but the derived metadata writer surface still contains an obsolete full-object path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: maintainability.generated_projection_contract: partial. `aliases.ts` has a bounded generated deep-routing block with a hash [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/aliases.ts:21`], and Python exposes projection check flags [SOURCE: `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:4418`], but the derived metadata writer surface still contains an obsolete full-object path.

### maintainability.stale_path_declarations: edge case only. The rendered scope still names `.opencode/skills/sk-doc/create-skill/scripts/init_skill.py`, while the actual file lives under `.opencode/skills/sk-doc/sk-create-skill/scripts/init_skill.py`; this was already recorded in the lineage as a declared-scope path ambiguity, so it is not duplicated as a new finding. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: maintainability.stale_path_declarations: edge case only. The rendered scope still names `.opencode/skills/sk-doc/create-skill/scripts/init_skill.py`, while the actual file lives under `.opencode/skills/sk-doc/sk-create-skill/scripts/init_skill.py`; this was already recorded in the lineage as a declared-scope path ambiguity, so it is not duplicated as a new finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: maintainability.stale_path_declarations: edge case only. The rendered scope still names `.opencode/skills/sk-doc/create-skill/scripts/init_skill.py`, while the actual file lives under `.opencode/skills/sk-doc/sk-create-skill/scripts/init_skill.py`; this was already recorded in the lineage as a declared-scope path ambiguity, so it is not duplicated as a new finding.

### No nested Task/sub-agent dispatch was requested or performed. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: No nested Task/sub-agent dispatch was requested or performed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No nested Task/sub-agent dispatch was requested or performed.

### No source modification or remediation attempt was made. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: No source modification or remediation attempt was made.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No source modification or remediation attempt was made.

### overlay.agent_cross_runtime: notApplicable. Target is a spec-folder review, not a runtime mirror review. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: overlay.agent_cross_runtime: notApplicable. Target is a spec-folder review, not a runtime mirror review.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: overlay.agent_cross_runtime: notApplicable. Target is a spec-folder review, not a runtime mirror review.

### overlay.feature_catalog_code: carried-forward partial; not re-entered. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: overlay.feature_catalog_code: carried-forward partial; not re-entered.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: overlay.feature_catalog_code: carried-forward partial; not re-entered.

### overlay.feature_catalog_code: partial. Feature catalog coverage exists for root routing and compiled routing, but one packet-count claim is stale against the live registry/SKILL contract. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: overlay.feature_catalog_code: partial. Feature catalog coverage exists for root routing and compiled routing, but one packet-count claim is stale against the live registry/SKILL contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: overlay.feature_catalog_code: partial. Feature catalog coverage exists for root routing and compiled routing, but one packet-count claim is stale against the live registry/SKILL contract.

### overlay.playbook_capability: carried-forward pass; not re-entered. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: overlay.playbook_capability: carried-forward pass; not re-entered.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: overlay.playbook_capability: carried-forward pass; not re-entered.

### overlay.playbook_capability: pass for the sampled compiled-routing capability. The manual playbook indexes `SD-CR-001`, and the scenario requires compiled serving authority plus legacy parity [SOURCE: `.opencode/skills/sk-doc/manual-testing-playbook/manual-testing-playbook.md:34`] [SOURCE: `.opencode/skills/sk-doc/manual-testing-playbook/compiled-routing/bundle-rules-compiled-routing.md:61`]. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: overlay.playbook_capability: pass for the sampled compiled-routing capability. The manual playbook indexes `SD-CR-001`, and the scenario requires compiled serving authority plus legacy parity [SOURCE: `.opencode/skills/sk-doc/manual-testing-playbook/manual-testing-playbook.md:34`] [SOURCE: `.opencode/skills/sk-doc/manual-testing-playbook/compiled-routing/bundle-rules-compiled-routing.md:61`].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: overlay.playbook_capability: pass for the sampled compiled-routing capability. The manual playbook indexes `SD-CR-001`, and the scenario requires compiled serving authority plus legacy parity [SOURCE: `.opencode/skills/sk-doc/manual-testing-playbook/manual-testing-playbook.md:34`] [SOURCE: `.opencode/skills/sk-doc/manual-testing-playbook/compiled-routing/bundle-rules-compiled-routing.md:61`].

### overlay.skill_agent: notApplicable. Target is a spec-folder review, not an agent contract. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: overlay.skill_agent: notApplicable. Target is a spec-folder review, not an agent contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: overlay.skill_agent: notApplicable. Target is a spec-folder review, not an agent contract.

### P0 security blocker: no immediate credential exposure, destructive write, auth bypass, or `pull_request_target` execution path was evidenced in the reviewed security slice. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: P0 security blocker: no immediate credential exposure, destructive write, auth bypass, or `pull_request_target` execution path was evidenced in the reviewed security slice.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: P0 security blocker: no immediate credential exposure, destructive write, auth bypass, or `pull_request_target` execution path was evidenced in the reviewed security slice.

### security.ci_token_permissions: partial - implicit token permissions remain while dependency-backed commands execute. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: security.ci_token_permissions: partial - implicit token permissions remain while dependency-backed commands execute.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: security.ci_token_permissions: partial - implicit token permissions remain while dependency-backed commands execute.

### security.declared_scope_paths: partial - two dispatcher-declared implementation anchors were missing in the current tree; the actual `init_skill.py` path was reviewed as workflow integration context. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: security.declared_scope_paths: partial - two dispatcher-declared implementation anchors were missing in the current tree; the actual `init_skill.py` path was reviewed as workflow integration context.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: security.declared_scope_paths: partial - two dispatcher-declared implementation anchors were missing in the current tree; the actual `init_skill.py` path was reviewed as workflow integration context.

### security.derived_metadata_path_boundary: pass - derived sync resolves `workspaceRoot` and `skillDir`, rejects directories outside the workspace, then writes only the joined graph metadata path [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/derived/sync.ts:71] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/derived/sync.ts:95]. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: security.derived_metadata_path_boundary: pass - derived sync resolves `workspaceRoot` and `skillDir`, rejects directories outside the workspace, then writes only the joined graph metadata path [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/derived/sync.ts:71] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/derived/sync.ts:95].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: security.derived_metadata_path_boundary: pass - derived sync resolves `workspaceRoot` and `skillDir`, rejects directories outside the workspace, then writes only the joined graph metadata path [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/derived/sync.ts:71] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/derived/sync.ts:95].

### security.derived_metadata_prompt_boundary: pass - derived values are length-limited, instruction-shaped content is rejected, and values pass through label sanitization before storage [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/derived/sanitizer.ts:28] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/derived/sanitizer.ts:41]. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: security.derived_metadata_prompt_boundary: pass - derived values are length-limited, instruction-shaped content is rejected, and values pass through label sanitization before storage [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/derived/sanitizer.ts:28] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/derived/sanitizer.ts:41].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: security.derived_metadata_prompt_boundary: pass - derived values are length-limited, instruction-shaped content is rejected, and values pass through label sanitization before storage [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/derived/sanitizer.ts:28] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/derived/sanitizer.ts:41].

### security.subprocess_shell_injection: pass - reviewed Python subprocess sites use list-form arguments and no `shell=True` evidence was found [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:676] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/score-routing-corpus.py:72]. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: security.subprocess_shell_injection: pass - reviewed Python subprocess sites use list-form arguments and no `shell=True` evidence was found [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:676] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/score-routing-corpus.py:72].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: security.subprocess_shell_injection: pass - reviewed Python subprocess sites use list-form arguments and no `shell=True` evidence was found [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py:676] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/score-routing-corpus.py:72].

### Shell injection in reviewed Python subprocess sites: commands use list arguments rather than shell interpolation. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Shell injection in reviewed Python subprocess sites: commands use list arguments rather than shell interpolation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Shell injection in reviewed Python subprocess sites: commands use list arguments rather than shell interpolation.

<!-- /ANCHOR:exhausted-approaches -->

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. NEXT FOCUS
- dimension: none - focus area: synthesis/remediation planning - reason: all four configured dimensions are now covered; active P1s still require remediation planning before promotion - rotation status: terminal - blocked/productive carry-forward: do not repeat saturated discovery except to verify remediation - required evidence: accumulated iteration artifacts, registry state, and direct file:line rereads of any claimed fixes

<!-- /ANCHOR:next-focus -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- dimension: none - focus area: synthesis/remediation planning - reason: final configured iteration complete; active P1s require remediation planning before promotion. - rotation status: terminal - blocked/productive carry-forward: do not rerun saturated correctness, security, traceability, or maintainability discovery except to verify remediation. - required evidence: use the accumulated finding details and registry state. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
