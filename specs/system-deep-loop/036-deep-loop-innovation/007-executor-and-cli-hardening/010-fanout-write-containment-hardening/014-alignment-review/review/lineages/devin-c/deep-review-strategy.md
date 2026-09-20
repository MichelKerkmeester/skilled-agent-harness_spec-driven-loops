# Deep Review Strategy (lane devin-c)

## topic

Fifteen-iteration alignment review of the remediated deep-loop tree (lane devin-c, iterations 1-5 of 5): deep-loop command alignment, general architecture / write containment, SKILL.md against references and assets, deep-loop agent alignment, feature catalog and playbook alignment, read against the repo rules. Target: `specs/system-deep-loop/045-fanout-write-containment-hardening/014-alignment-review` (spec-folder, Level 2).

## review-dimensions

- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

## completed-dimensions

- [x] correctness — iteration 1: command/compiled-contract alignment. Verdict PASS. Findings F001, F002.
- [x] security — iteration 2: write-containment architecture. Verdict CONDITIONAL. Finding F003 (P1), F004.
- [x] traceability — iterations 3-4: SKILL vs references (core protocols) + agent/catalog/playbook overlays. Verdict PASS/PASS. Finding F005; all four overlay protocols pass.
- [x] maintainability — iteration 5: dead paths, counting drifts, stabilization replay. Verdict PASS. Finding F006; replay upheld F001-F005.

## running-findings

- P0: 0 active
- P1: 1 active (F003)
- P2: 5 active (F001, F002, F004, F005, F006)

## what-worked

- Hash-compare of compiled-contract source digests against live files (iteration 1) — decisive, cheap alignment evidence.
- Step-identifier set diff between auto/confirm workflows (iterations 1, 3) — surfaced the resource-map parity gap (F002).
- Cross-surface containment wiring check via grep of `snapshotOutOfScopeDirtyPaths`/`enforceWriteContainment` (iteration 2) — proved the runtime has the guard everywhere and the review protocol doc lags (F003).
- Registry-driven packet existence resolution (iteration 3) — cleared all 18 mode entries across three skills.

## what-failed

- Nothing failed outright; iteration 4 (overlays) produced no findings, which was treated as a genuine clean pass rather than a stall (convergence off).

## exhausted-approaches

- Line-by-line re-review of the seven original fixes and six remediations — out of scope by packet decision; alignment-across-surfaces only.

## ruled-out-directions

- Compiled-contract staleness (ruled out, iteration 1): all digests match.
- Missing script paths in command YAMLs (ruled out, iteration 1): 12/12 exist.
- Missing containment control in runtime (ruled out, iteration 2): guard wired in every branch.
- Orphaned legacy/compiled artifacts (ruled out, iteration 5): strict 3:3 pairing documented and present.
- Worktree residue in catalogs/playbooks (ruled out, iterations 3-4): zero matches.

## next-focus

Synthesis complete. Lane report: `review-report.md`. Findings F001-F006 ready for the merged registry (strongest-restriction merge: any lineage P0 → merged FAIL; this lane has none).

## known-context

- Packet: Phase 14 of 14 under 045-fanout-write-containment-hardening; 15-iteration alignment review across six surfaces read against `REPO RULES.md` and `repo-rules/`.
- REQ-001 route-proof fields carried on every iteration state record; REQ-002 executor chain (devin primary, codex LUNA, pi via gateway) matches the review-root config fallback list; REQ-003: every P0/P1 verified against the repository — F003 was re-verified in the iteration-5 stabilization replay.
- resource-map.md not present at init. Skipping coverage gate.
- Review was observation-only; all writes confined to `review/lineages/devin-c/`.

## cross-reference-status

Core (hard):
- spec_code: partial — compiled contracts fully aligned; two doc drifts (F003, F005)
- checklist_evidence: pass — no checked claims in packet docs

Overlay (advisory):
- skill_agent: pass (iteration 4)
- agent_cross_runtime: pass (iteration 4)
- feature_catalog_code: pass (iteration 4)
- playbook_capability: pass (iteration 4)

## files-under-review

| File / surface | Coverage | Notes |
|----------------|----------|-------|
| `.opencode/commands/deep/assets/*.yaml` + `compiled/` + `legacy/` | reviewed (it1, it5) | F001, F002, F006 |
| `runtime/scripts/fanout-run.cjs`, `fanout-merge.cjs`, `append-mode-event.cjs`, `reduce-state.cjs` | reviewed (it2) | containment wiring verified |
| `runtime/lib/deep-loop/write-containment.ts` | reviewed (it2) | guard semantics match docs |
| `system-deep-loop/SKILL.md`, `mode-registry.json`, `ROUTER.md`, `hub-router.json`, `leaf-manifest.json` | reviewed (it3) | F005 |
| `deep-review/SKILL.md` + `references/**` | reviewed (it1, it3) | F003 |
| `deep-research/references/protocol/loop-protocol.md` | reviewed (it2) | F004 |
| `cli-external-orchestration/SKILL.md` + `mode-registry.json` | reviewed (it3) | 7/7 modes resolve |
| `sk-code/SKILL.md` + `mode-registry.json` | reviewed (it3) | 6/6 modes resolve |
| `.opencode/.claude/.pi/.codex` agent mirrors (4 agents) | reviewed (it4) | parity pass |
| `feature-catalog/fanout-write-containment/*` | reviewed (it4) | pass |
| `manual-testing-playbook/write-containment/*` | reviewed (it4) | WC-001 executable |
| Packet docs (`spec.md`, `goal.md`, `tasks.md`, `acceptance-criteria.md`) | reviewed (it3, it5) | checklist_evidence pass |

## review-boundaries

- maxIterations: 5 (lane cap; stopPolicy max-iterations, convergence off) — reached; stopReason `maxIterationsReached`.
- convergenceThreshold: 0.10 (telemetry only)
- severityThreshold: P2
- Non-Goals: no line-by-line re-review of the seven original fixes and six remediations; no surfaces outside deep-loop, cli-external-orchestration, sk-code, and the repo rules; no implementation or fixes — findings only.
- Stop Conditions: 5 iterations completed → synthesis; P0 findings do not halt the loop (max-iterations policy); 3 consecutive failures or state corruption → halt and report. None triggered.
