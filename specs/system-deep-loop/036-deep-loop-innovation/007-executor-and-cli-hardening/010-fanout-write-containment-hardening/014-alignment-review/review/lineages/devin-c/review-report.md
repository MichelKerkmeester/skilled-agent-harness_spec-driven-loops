# Deep Review Report — lane devin-c

## 1. Executive Summary

- **Verdict: CONDITIONAL** — no active P0, one active P1 (F003), five P2 advisories.
- **Active findings**: P0=0, P1=1, P2=5. **hasAdvisories**: false.
- **Scope**: lane devin-c of the fifteen-iteration alignment review (5 of 15 iterations) over the deep-loop tree: deep-loop command alignment, general architecture / write containment, SKILL.md vs references/assets, deep-loop agent alignment, feature catalog and playbook alignment, read against `REPO RULES.md` and the packet docs.
- **Convergence reason**: `maxIterationsReached` — stop policy is max-iterations with convergence off (goal.md D3); convergence signals were telemetry only.
- **Lane lineage**: sessionId `fanout-devin-c-1789432854146-6hhsgk`, generation 1, lineageMode new, executor cli-devin model deepseek-v4-flash-max. The merged verdict across lanes is strongest-restriction (any lineage P0 → merged FAIL), owned by `fanout-merge.cjs`.

## 2. Planning Trigger

CONDITIONAL verdict routes to `/speckit:plan` for remediation. F003 requires a documentation fix in the deep-review loop-protocol (one section); the P2 set is hygiene work that can ride along or be deferred. PASS-level lanes should route to `/create:changelog`; this lane does not qualify while F003 is active.

## 3. Active Finding Registry

| ID | Severity | Dimension | Title | Evidence | First/Last seen | Status |
|----|----------|-----------|-------|----------|-----------------|--------|
| F001 | P2 | correctness | Duplicated comment banner in deep-review-auto.yaml header | `.opencode/commands/deep/assets/deep-review-auto.yaml:1-5` | 1/1 | active |
| F002 | P2 | correctness | Confirm workflow lacks resource-map coverage audit step | `.opencode/commands/deep/assets/deep-review-confirm.yaml:1564-1572` vs `deep-review-auto.yaml:2150`; loop-protocol Step 3b | 1/1 | active |
| F003 | P1 | security | Deep-review loop-protocol understates shipped write-containment posture | `.opencode/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:280` vs `deep-review-auto.yaml:1443-1795`, `fanout-run.cjs:3376-3494`, deep-research loop-protocol:287-290 | 2/2 | active |
| F004 | P2 | maintainability | Deep-research loop-protocol self-contradicts on containment mechanisms | `.opencode/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:275` vs `:287-290` | 2/2 | active |
| F005 | P2 | traceability | Hub SKILL.md improvement-mode count contradicts registry and itself | `.opencode/skills/system-deep-loop/SKILL.md:80` vs `mode-registry.json` and `SKILL.md:58` | 3/3 | active |
| F006 | P2 | maintainability | Compiled-contracts README counts four contracts where three exist | `.opencode/commands/deep/assets/compiled/README.md:19` | 5/5 | active |

All findings carry file:line evidence; F003 carries an adjudicated claim packet (confidence 0.85, upheld by stabilization replay in iteration 5).

## 4. Remediation Workstreams

1. **Protocol-doc containment alignment (F003, F004)** — update `deep-review/references/protocol/loop-protocol.md` executor-resolution section to describe the git-diff containment guard (or reference the deep-research section), and reconcile the stale "only real containment" sentence at deep-research loop-protocol:275. Order: F003 first (P1), F004 alongside (same section family).
2. **Counting-drift hygiene (F005, F006)** — fix "3 improvement modes" in `system-deep-loop/SKILL.md:80` and "four flattened command contracts" in `compiled/README.md:19`. Both are one-line text corrections.
3. **Workflow parity (F002)** — add `step_resource_map_coverage_gate` to `deep-review-confirm.yaml` to restore auto/confirm parity for the resource-map audit.
4. **Source cleanup (F001)** — collapse the duplicated banner block in `deep-review-auto.yaml:1-5`.

## 5. Spec Seed

- `deep-review/references/protocol/loop-protocol.md` §Executor Resolution: replace the "only real containment is (a)...(b)" claim with the three-mechanism reality (prompt contract, post-dispatch validation, git-diff write-containment guard) or a pointer to the deep-research containment section.
- `deep-research/references/protocol/loop-protocol.md` §Executor Resolution: delete or reconcile the stale sentence at line 275.
- `system-deep-loop/SKILL.md` §Routing rule: "the 3 improvement modes" → "the two improvement lanes".
- `compiled/README.md` OVERVIEW: "four flattened command contracts" → "three".
- `deep-review-confirm.yaml`: add the resource-map coverage audit step.
- No runtime behavior changes required by this lane: the containment guard, fan-out runner, merge, agents, catalogs, and playbooks were found aligned with their documentation.

## 6. Plan Seed

1. Edit `deep-review/references/protocol/loop-protocol.md` executor section (F003) and `deep-research/references/protocol/loop-protocol.md:275` (F004); verify with a grep for "only real containment".
2. Edit `system-deep-loop/SKILL.md:80` (F005) and `compiled/README.md:19` (F006); verify with the registry diff.
3. Add the resource-map coverage gate step to `deep-review-confirm.yaml` (F002); verify step-set parity between auto and confirm.
4. Collapse the banner in `deep-review-auto.yaml:1-5` (F001).

## 7. Traceability Status

| Protocol | Status | Gate Class | Evidence |
|----------|--------|------------|----------|
| spec_code (core) | partial | hard | Compiled-contract digests all match live sources (16/16 for /deep:review; spot checks for research/council); F003 and F005 document the drifts found |
| checklist_evidence (core) | pass | hard | No `[x]` completion claims in the packet docs to verify |
| skill_agent (overlay) | pass | advisory | deep-review SKILL.md vs `.opencode/agents/deep-review.md` agree |
| agent_cross_runtime (overlay) | pass | advisory | Four runtime mirrors carry the same contract |
| feature_catalog_code (overlay) | pass | advisory | fanout-write-containment catalog matches runtime and cited tests |
| playbook_capability (overlay) | pass | advisory | WC-001 scenario executable against shipped behavior |

Resource Map Coverage Gate: skipped — `resource-map.md` not present at init (`resource_map_present: false`).

## 8. Deferred Items

- P2 advisories F001, F002, F004, F005, F006 — non-blocking; can be bundled into the remediation workstreams or deferred with documented reason.
- Line-level re-review of the seven original fixes and six remediations — explicitly out of scope per the packet spec; this lane read alignment across surfaces only.
- The `agent_config.model: opus` native-branch default vs CLI-lane models — no contradiction established; left as a follow-up check, not a finding.

## 9. Audit Appendix

### Iteration table

| Run | Focus | Dimension | Ratio | New findings | Verdict |
|-----|-------|-----------|-------|--------------|---------|
| 1 | Command alignment | correctness | 1.00 | P0=0 P1=0 P2=2 | PASS |
| 2 | Write containment | security | 0.75 | P0=0 P1=1 P2=1 | CONDITIONAL |
| 3 | SKILL vs references | traceability | 0.11 | P0=0 P1=0 P2=1 | PASS |
| 4 | Agents/catalog/playbook | traceability | 0.00 | P0=0 P1=0 P2=0 | PASS |
| 5 | Dead paths + replay | maintainability | 0.10 | P0=0 P1=0 P2=1 | PASS |

### Convergence signal replay

- Ratios: 1.00, 0.75, 0.11, 0.00, 0.10. Rolling pair averages: (1.00+0.75)/2=0.875, (0.75+0.11)/2=0.43, (0.11+0.00)/2=0.055, (0.00+0.10)/2=0.05 — all above/below thresholds were telemetry only (convergence mode off).
- stopReason: `maxIterationsReached` (maxIterations=5 lane cap). No blocked-stop, stuck-recovery, or pause events recorded.

### File coverage matrix

- Commands: deep-review-auto/confirm YAML, deep-research-auto YAML, compiled contracts (review/research/council) + manifest, legacy bodies/READMEs.
- Runtime: write-containment.ts, fanout-run.cjs, fanout-merge.cjs, append-mode-event.cjs, reduce-state.cjs (schema read), verify-iteration.cjs (contract read).
- Skills: system-deep-loop hub SKILL.md/ROUTER.md/mode-registry.json/hub-router.json/leaf-manifest.json; deep-review SKILL.md + references; cli-external-orchestration SKILL.md + mode-registry; sk-code SKILL.md + mode-registry.
- Agents: deep-review/deep-research/deep-improvement/orchestrate across .opencode/.claude/.pi/.codex.
- Catalogs/playbooks: fanout-write-containment feature entry; write-containment WC-001 playbook.
- Packet docs: spec.md, goal.md, tasks.md, acceptance-criteria.md, review/deep-review-config.json.

### Dimension breakdown

- correctness: command/compiled-contract alignment (F001, F002)
- security: write-containment posture documentation (F003), runtime guard verification (no runtime defect)
- traceability: registry/routing prose drift (F005), core + overlay protocol execution
- maintainability: self-contradictions, counting drifts, dead-path checks (F004, F006)

### Route-proof audit (REQ-001)

Every iteration state record in `deep-review-state.jsonl` carries `mode: review`, `target_agent: deep-review`, `agent_definition_loaded: true`, and a non-empty `resolved_route`, matching `.opencode/agents/deep-review.md:230` and `verify-iteration.cjs`.

### Lane metadata (SC-001)

- kind: cli-devin, model: deepseek-v4-flash-max, label: devin-c, iterations: 5 of 15.
- All writes confined to `review/lineages/devin-c/`; no repo tooling was executed; no out-of-scope writes.
