# Deep Review Strategy - Session Tracking

## Topic
Review the shipped v4.0.0.12 doctor command routing and related advisor work.

## Review Target and Boundaries
- Target: specs/system-skill-advisor/035-doctor-command-routing (review_target_type: spec-folder).
- The lead steer selects shipped code and documentation; packet specification files are not review targets.
- Five passes are required. Convergence is telemetry; stop only at maxIterations=5.
- Security is secondary and receives incidental checks, not a dedicated pass.
- Write authority is this lineage directory. Reviewed files remain read-only.
- Init deviations: legacy-state migration and coverage-graph upsert are skipped because their commands can write outside this lineage. Record this in iteration 1.

## Review Dimensions
- [ ] Correctness: advisor code and command behavior (iterations 1-2).
- [ ] Security: spot-check when the reviewed code surfaces it.
- [ ] Traceability: command references and cross-repository listings (iterations 2, 4-5).
- [ ] Maintainability: authoring standards and cross-surface parity (iterations 2-3, 5).

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 7
- Resolved: 1

<!-- /ANCHOR:running-findings -->
## What Worked
None yet.

## What Failed
None yet. The spec-folder discovery heuristic is not used because the lead steer supplies the shipped-work scope.

## Exhausted Approaches
None yet.

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## Ruled Out Directions
None yet.

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
security

<!-- /ANCHOR:next-focus -->
## Known Context
- The lead steer is the scope authority and names target groups and authoring standards.
- The workflow's fan-out lineage branch requires in-process iteration work.
- Do not run test runners, builds, installs, or commands that write outside this lineage.

## Cross-Reference Status
| Protocol | Level | Status | Notes |
|---|---|---|---|
| spec_code | core | pending | Review code against shipped command and skill references only. |
| checklist_evidence | core | partial | The target is not packet spec/checklist documentation. |
| skill_agent | overlay | pending | Review advisor skills, hooks, and runtime guidance. |
| agent_cross_runtime | overlay | pending | Review command mirrors across runtimes. |
| feature_catalog_code | overlay | pending | Review catalog paths and implementation anchors. |
| playbook_capability | overlay | pending | Review DOC-385..DOC-391 coverage and references. |

## Files Under Review
The authoritative complete path list is the reviewScopeFiles array in deep-review-config.json (52 files).

### Advisor code and tests
- .skilled/skills/system-skill-advisor/runtime/lib/render.ts
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts
- .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md
- .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts
- .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts
- .opencode/plugins/system-skill-advisor.js
- .opencode/plugins/lib/skill-advisor-render.js
- .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs
- Named doctor routing tests and single-writer lease stress test.

### Command and runtime mirrors
- .skilled/commands/doctor/setup.md
- .skilled/commands/doctor/assets/doctor-setup.yaml
- .skilled/commands/doctor/assets/doctor-setup-presentation.txt
- .skilled/commands/doctor/_routes.yaml
- .skilled/commands/doctor/assets/doctor-router-reach.yaml
- .skilled/commands/doctor/assets/doctor-skill-advisor-rebuild.yaml
- .claude/commands/doctor/setup.md
- .codex/prompts/doctor-setup.md
- .cursor/commands/doctor-setup.md
- .pi/prompts/doctor-setup.md
- .hermes/prompts/doctor-setup.md

### Skill documentation and cross-references
- DOC-385..DOC-391 scenarios and manual-testing-playbook index.
- Three doctor routing feature leaves and feature-catalog index.
- Advisor hook docs, Pi README, advisor README, and SKILL.md.
- Root README, .skilled/commands/README.txt, system-spec-kit doctor category, and system-spec-kit SKILL.md.

### Changelogs
- .skilled/skills/system-skill-advisor/changelog/v0.16.0.0.md
- .skilled/skills/system-spec-kit/changelog/v2.8.0.0.md
- .skilled/changelog/skilled/v4.0.0.12.md

## Review Boundaries
- Session: fanout-luna-max-fast-1792125949812-grdnrc.
- Generation: 1; lineageMode: new; executionMode: auto.
- Max iterations: 5; convergence threshold: 0.1; convergence mode: default; stop policy: max-iterations.
- Executor: cli-codex, gpt-6-luna, max reasoning, fast tier.
- State log: deep-review-state.jsonl. Findings registry: deep-review-findings-registry.json.
- Started: 2026-10-16T04:51:56Z.

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
- [ ] security

<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `command-catalog-mirror-check.cjs` passed: all 39 commands are listed in the command index and applicable hub metadata. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `command-catalog-mirror-check.cjs` passed: all 39 commands are listed in the command index and applicable hub metadata.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `command-catalog-mirror-check.cjs` passed: all 39 commands are listed in the command index and applicable hub metadata.

### `route-validate.sh` passed: 14 routes validated, 38 script invocations resolve to workflow activity, J1 route-target parity passed, and K1/K2 found no read-only route declaring a write. It emitted two informational repeated-`--dry-run` warnings for skill-advisor and git targets. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `route-validate.sh` passed: 14 routes validated, 38 script invocations resolve to workflow activity, J1 route-target parity passed, and K1/K2 found no read-only route declaring a write. It emitted two informational repeated-`--dry-run` warnings for skill-advisor and git targets.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `route-validate.sh` passed: 14 routes validated, 38 script invocations resolve to workflow activity, J1 route-target parity passed, and K1/K2 found no read-only route declaring a write. It emitted two informational repeated-`--dry-run` warnings for skill-advisor and git targets.

### `sync-runtime-mirrors.cjs --check` passed: 185 mirrors across eight runtime trees are in sync. The Claude and Cursor files also match the canonical setup router; Codex, Pi, and Hermes contain their generated entry-point wrappers. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `sync-runtime-mirrors.cjs --check` passed: 185 mirrors across eight runtime trees are in sync. The Claude and Cursor files also match the canonical setup router; Codex, Pi, and Hermes contain their generated entry-point wrappers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `sync-runtime-mirrors.cjs --check` passed: 185 mirrors across eight runtime trees are in sync. The Claude and Cursor files also match the canonical setup router; Codex, Pi, and Hermes contain their generated entry-point wrappers.

### `validate_document.py --type command` passed for the canonical router with zero issues. The HVR scan exited 0 with no hard blockers; it reported two mechanical candidates on the router and review-only wording candidates. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `validate_document.py --type command` passed for the canonical router with zero issues. The HVR scan exited 0 with no hard blockers; it reported two mechanical candidates on the router and review-only wording candidates.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `validate_document.py --type command` passed for the canonical router with zero issues. The HVR scan exited 0 with no hard blockers; it reported two mechanical candidates on the router and review-only wording candidates.

### Changelog validator: all three files valid, zero issues, exit 0. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Changelog validator: all three files valid, zero issues, exit 0.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Changelog validator: all three files valid, zero issues, exit 0.

### HVR scan: exit 0, zero hard blockers; review-only comma candidates and one soft deduction remain. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: HVR scan: exit 0, zero hard blockers; review-only comma candidates and one soft deduction remain.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: HVR scan: exit 0, zero hard blockers; review-only comma candidates and one soft deduction remain.

### No runtime tests, test runners, builds, or validators were run in this iteration, as directed. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: No runtime tests, test runners, builds, or validators were run in this iteration, as directed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No runtime tests, test runners, builds, or validators were run in this iteration, as directed.

### No test runner, build, or runtime probe was run. The prior blocked doctor-probe search debt remains because that probe writes outside the lineage directory. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: No test runner, build, or runtime probe was run. The prior blocked doctor-probe search debt remains because that probe writes outside the lineage directory.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No test runner, build, or runtime probe was run. The prior blocked doctor-probe search debt remains because that probe writes outside the lineage directory.

### Runtime tests and the doctor phrase-reach probe were not run. The probe would create a temporary database directory under `os.tmpdir()` (`doctor-phrase-reach.cjs:152`), outside the bound write surface. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Runtime tests and the doctor phrase-reach probe were not run. The probe would create a temporary database directory under `os.tmpdir()` (`doctor-phrase-reach.cjs:152`), outside the bound write surface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Runtime tests and the doctor phrase-reach probe were not run. The probe would create a temporary database directory under `os.tmpdir()` (`doctor-phrase-reach.cjs:152`), outside the bound write surface.

### Setup-hint cases cover positive setup wording and a generic unrelated no-match without setup verbs; they do not cover a generic “check” prompt that misses all skills. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Setup-hint cases cover positive setup wording and a generic unrelated no-match without setup verbs; they do not cover a generic “check” prompt that misses all skills.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Setup-hint cases cover positive setup wording and a generic unrelated no-match without setup verbs; they do not cover a generic “check” prompt that misses all skills.

### Static call-path review confirms warm-only does not cold-start the daemon; with an alive daemon, the requested advisor_status command still executes. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Static call-path review confirms warm-only does not cold-start the daemon; with an alive daemon, the requested advisor_status command still executes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Static call-path review confirms warm-only does not cold-start the daemon; with an alive daemon, the requested advisor_status command still executes.

### The advisor release note's unrelated-prompt statement is covered by P2-002. The “no previously correct route changes” statement is covered by P2-001. The “writes nothing” and read-only claims are covered by P2-008. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: The advisor release note's unrelated-prompt statement is covered by P2-002. The “no previously correct route changes” statement is covered by P2-001. The “writes nothing” and read-only claims are covered by P2-008.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The advisor release note's unrelated-prompt statement is covered by P2-002. The “no previously correct route changes” statement is covered by P2-001. The “writes nothing” and read-only claims are covered by P2-008.

### The bridge generator derives doctor phrases and runnable strings from `_routes.yaml`; the TypeScript bridge and renderer tests independently recompute manifest expectations. Those checks were read, not run. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The bridge generator derives doctor phrases and runnable strings from `_routes.yaml`; the TypeScript bridge and renderer tests independently recompute manifest expectations. Those checks were read, not run.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The bridge generator derives doctor phrases and runnable strings from `_routes.yaml`; the TypeScript bridge and renderer tests independently recompute manifest expectations. Those checks were read, not run.

### The routing slice and ordering cases cover direct slash invocation and doctor-versus-skill placement, but do not cover a quoted slash-command reference. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The routing slice and ordering cases cover direct slash invocation and doctor-versus-skill placement, but do not cover a quoted slash-command reference.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The routing slice and ordering cases cover direct slash invocation and doctor-versus-skill placement, but do not cover a quoted slash-command reference.

### The setup presentation, route, workflow, and repair-command table agree on the five read-only legs and the listed repair commands by direct inspection. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The setup presentation, route, workflow, and repair-command table agree on the five read-only legs and the listed repair commands by direct inspection.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The setup presentation, route, workflow, and repair-command table agree on the five read-only legs and the listed repair commands by direct inspection.

<!-- /ANCHOR:exhausted-approaches -->
