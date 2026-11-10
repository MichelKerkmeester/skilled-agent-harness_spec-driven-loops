# Deep Review Report - Lineage devin-b

## 1. Executive Summary

- **Verdict**: CONDITIONAL
- **Active findings**: P0=0, P1=1 (F006), P2=10
- **hasAdvisories**: true (P2 > 0)
- **Scope**: Lane devin-b of the 15-iteration alignment review of the remediated deep-loop tree — six alignment dimensions from spec `014-alignment-review` (sk-code/OpenCode, feature catalog/playbooks, SKILL.md vs references/assets, command YAMLs, agents, general architecture) read against the repo rules and the parent packet `045-fanout-write-containment-hardening` requirements.
- **Iterations**: 5 of 5 (lineage cap) — one per lane; Lane E+F combined in iteration 5.
- **Convergence reason**: stopPolicy=max-iterations with convergenceMode off; stopped at maxIterationsReached (5/5). Convergence signals were telemetry only: severity-weighted new-findings ratio declined 1.00 → 0.70 → 0.17 → 0.14 → 0.07.
- **Release readiness**: in-progress (one active P1 blocks `converged`).

## 2. Planning Trigger

The verdict is CONDITIONAL: no P0, one confirmed P1 (F006). Per the verdict contract, CONDITIONAL routes to `/speckit:plan` for remediation. F006 is a missing-mandated-migration finding (parent REQ-006): the deep-review loop protocol lacks the two containment rules that the research protocol carries and the hub SKILL.md pointer assumes. It is bound to a proposed new phase under the parent packet: **`016-review-containment-doc-alignment`** (migrate the two rules into `deep-review/references/protocol/loop-protocol.md` and amend the hub pointer at `system-deep-loop/SKILL.md:128` to name both protocols). The ten P2 findings are advisories for the same or a follow-on doc-alignment pass; the merged fan-out report should aggregate sibling-lane findings and apply strongest-restriction across lanes.

## 3. Active Finding Registry

| ID | Severity | Dimension | Title | Evidence | First/Last |
|----|----------|-----------|-------|----------|------------|
| F001 | P2 | maintainability | Hub SKILL.md surface axis under-specified vs registry | .opencode/skills/sk-code/SKILL.md:65; mode-registry.json:16-20 | 1/1 |
| F002 | P2 | traceability | sk-code-review cache write path not carved out of containment attribution | .opencode/skills/sk-code/mode-registry.json:50; fanout-run.cjs:3358-3366 | 1/1 |
| F003 | P2 | maintainability | ROUTER.md prose names only PI_REMOTE as bundled evidence surface | .opencode/skills/sk-code/ROUTER.md:41 vs 593-596 | 1/1 |
| F006 | P1 | traceability | deep-review loop protocol missing the two containment rules (REQ-006 partial) | system-deep-loop/SKILL.md:128; deep-research loop-protocol.md:287-290; deep-review loop-protocol.md:275-308 | 2/2 |
| F004 | P2 | maintainability | Runtime catalog fanout-run entry lists stale executor kinds | runtime/feature-catalog/fanout/fanout-run.md:42 vs executor-config.ts:11 | 2/2 |
| F005 | P2 | traceability | Runtime feature catalog lacks write-containment entry | runtime/feature-catalog/feature-catalog.md:19 vs hub catalog:57 | 2/2 |
| F007 | P2 | maintainability | system-deep-loop hub SKILL.md improvement-lane and mode-count contradictions | SKILL.md:27/58/80/131/161 vs mode-registry.json:30-152 | 3/3 |
| F008 | P2 | maintainability | cli-external-orchestration SKILL.md says all six modes, seven registered | SKILL.md:74 vs leaf-manifest.json:14-108 | 3/3 |
| F009 | P2 | maintainability | Stale inline containment comments in auto YAML codex branches | deep-review-auto.yaml:1517-1519; deep-research-auto.yaml:1622-1624 vs write-containment.ts:1603 | 4/4 |
| F010 | P2 | maintainability | Compiled-contracts README contradicts itself on contract count | compiled/README.md:171 vs 175 | 4/4 |
| F011 | P2 | maintainability | deep-review loop protocol shared fan-out adapter list omits cli-hermes | deep-review loop-protocol.md:281 vs fanout-run.cjs:479,2616-2643 | 5/5 |

All findings carry file:line evidence; the single P1 (F006) carries a typed claim-adjudication packet (iteration 2) adjudicated `passed:true`, finalSeverity P1, confidence 0.9.

## 4. Remediation Workstreams

1. **WS-1 (P1, blocking) — Review-loop containment documentation migration** → proposed phase `016-review-containment-doc-alignment` under the parent packet. Constituents: F006. Copy the two containment rules from `deep-research/references/protocol/loop-protocol.md:287-290` into `deep-review/references/protocol/loop-protocol.md` Executor Resolution; amend the hub pointer at `system-deep-loop/SKILL.md:128` to name both protocols; verify by grepping the deep-review skill tree for `Two containment rules`.
2. **WS-2 (P2) — Hub prose count alignment** (folds into the same or a follow-on doc pass). Constituents: F001, F003, F007, F008, F010. Align every numeric/prose claim in sk-code, system-deep-loop, cli-external-orchestration hubs and the compiled README to their registries.
3. **WS-3 (P2) — Catalog completeness** (runtime inventory). Constituents: F004, F005. Add the write-containment entry to the runtime feature catalog and correct the executor-kind list in the fanout-run entry.
4. **WS-4 (P2) — Containment-surface hygiene**. Constituents: F002, F009, F011. Either carve `.opencode/.code-review-cache/` out of containment attribution or document the interaction; refresh the stale codex-branch comments in the two auto YAMLs; add cli-hermes to the deep-review loop-protocol adapter list.

## 5. Spec Seed

- Parent spec REQ-006's "both loop protocols" clause is only half-fulfilled: extend the phase-016 acceptance criteria to require the deep-review loop protocol to carry the two containment rules (F006).
- The runtime feature catalog's inventory contract ("canonical inventory for the live runtime/ feature surface", runtime/feature-catalog/feature-catalog.md:19) should list write-containment as a fanout-group feature (F005) and the fanout-run entry's kind list should mirror `EXECUTOR_KINDS` (F004).
- The review spec's SC-001/SC-002 (attribution table, no unverified P0) are unaffected by this lane; lane findings are documented for the merged attribution pass.

## 6. Plan Seed

1. `016-review-containment-doc-alignment` phase: edit `deep-review/references/protocol/loop-protocol.md` (insert two-rules paragraph), edit `system-deep-loop/SKILL.md:128` (name both protocols), verify with grep + `validate.sh` on the parent packet. (F006)
2. Update `runtime/feature-catalog/fanout/fanout-run.md:42` kind list to the 7 CLI kinds; add `fanout-write-containment.md` entry to the runtime catalog index. (F004, F005)
3. Correct hub prose: sk-code SKILL.md §2/§3 (four surfaces), ROUTER.md §1 (four surfaces), system-deep-loop SKILL.md (5 modes, 2 improvement lanes), cli-external-orchestration SKILL.md:74 (seven), compiled/README.md:171 (three). (F001, F003, F007, F008, F010)
4. Containment hygiene: decide carve-out vs documentation for `.opencode/.code-review-cache/`; update YAML codex-branch comments; add cli-hermes to the loop-protocol adapter list. (F002, F009, F011)

## 7. Traceability Status

| Protocol | Level | Status | Gate | Evidence |
|----------|-------|--------|------|----------|
| spec_code | core | partial (1 fail in iter 2, then pass/partial) | hard | REQ-006 migration incomplete for deep-review loop protocol (F006); REQ-001..004 shipped in runner; YAML inline behavior migrated |
| checklist_evidence | core | notApplicable | hard | acceptance-criteria.md scaffolded (Unmet); no checked claims exist yet |
| skill_agent | overlay | partial | advisory | Routing mechanics align in all three hubs; hub prose count claims drift (F001, F003, F007, F008) |
| agent_cross_runtime | overlay | pass | advisory | .opencode/.claude/.codex/.pi mirrors in parity for deep-research/deep-review/deep-improvement/orchestrate |
| feature_catalog_code | overlay | fail (iter 2) | advisory | Stale kind claim (F004) and missing containment entry (F005) in the runtime catalog; sk-code leaf paths verified clean (iter 1) |
| playbook_capability | overlay | pass | advisory | WC-001 scenario exists, correctly referenced, matches preserve-by-default behavior |

Core gate note: the spec_code partial/fail stems from documentation surfaces (loop protocol), not from shipped runtime behavior; the runtime itself passed every REQ-001..REQ-004 verification this lane ran.

## 8. Deferred Items

- F002's severity is contingent on a lane actually triggering the sk-code-review dedup gate; if the gate is never invoked inside fan-out lanes, downgrade to a doc-note.
- deep-improvement agent route-proof fields: out of scope for review REQ-001 (improvement is host-driven); flag for the merged report.
- Full leaf-manifest existence sweep (300+ sk-code leaves) was spot-checked, not exhaustive.
- Sibling lanes devin-a/devin-c findings are merged by the fan-out merge step (strongest-restriction); this report covers lane devin-b only.
- `resource-map.md not present. Skipping coverage gate` (no Resource Map Coverage Gate section).

## 9. Audit Appendix

### Iteration Table

| Run | Focus | Files | New P0/P1/P2 | Ratio | Verdict |
|-----|-------|-------|--------------|-------|---------|
| 1 | Lane A: sk-code + OpenCode alignment | 8 | 0/0/3 | 1.00 | PASS |
| 2 | Lane B: feature catalog + playbook alignment | 11 | 0/1/2 | 0.70 | CONDITIONAL |
| 3 | Lane C: SKILL.md vs references/assets | 7 | 0/0/2 | 0.17 | PASS |
| 4 | Lane D: command alignment | 10 | 0/0/2 | 0.14 | PASS |
| 5 | Lane E+F: agents + architecture | 12 | 0/0/1 | 0.07 | PASS |

### Convergence Replay (telemetry)

- Ratios: 1.00, 0.70, 0.17, 0.14, 0.07 — monotonic decline after iteration 2, consistent with an alignment review saturating on doc drift; P0 stayed 0; P1 count stable at 1 from iteration 2.
- Replayed decision: CONTINUE through run 5 (max-iterations policy); STOP at run 5 with stopReason `maxIterationsReached`.
- P0 override check: no new P0 at any point; no legal-stop gates evaluated (convergence off).
- Claim adjudication: 1 packet (F006), passed:true, no missing packets, no severity transitions.

### File Coverage Matrix

| File | Iterations |
|------|-----------|
| .opencode/skills/sk-code/* (SKILL.md, mode-registry.json, ROUTER.md, leaf-manifest.json) | 1, 3 |
| .opencode/skills/system-deep-loop/SKILL.md, mode-registry.json, leaf-manifest.json, ROUTER.md | 2, 3 |
| .opencode/skills/system-deep-loop/runtime/* (feature-catalog, write-containment.ts, fanout-run.cjs, fanout-pool.cjs, executor-config.ts, executor-audit.ts, README.md) | 1, 2, 4, 5 |
| .opencode/skills/system-deep-loop/deep-review/* (loop-protocol.md, feature-catalog, SKILL.md) | 2, 3, 4, 5 |
| .opencode/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md | 2 |
| .opencode/skills/system-deep-loop/feature-catalog/*, manual-testing-playbook/* | 2 |
| .opencode/skills/cli-external-orchestration/* (SKILL.md, mode-registry.json, leaf-manifest.json) | 3 |
| .opencode/commands/deep/assets/*.yaml, compiled/*, review.md | 4 |
| .opencode/agents/*, .claude/agents/*, .codex/agents/*, .pi/agents/* | 1, 5 |
| opencode.json | 1 |

### Audit Detail

- 48 file reads across 5 iterations; every finding cites file:line; the single P1 was re-verified by targeted grep absence checks before recording (counterevidence sought across the whole deep-review skill tree).
- No files under review were modified; all writes stayed inside `review/lineages/devin-b/` (lineage write surface).
- Replay validation: JSONL state (6 records: config + 5 iterations + 1 claim_adjudication event + 1 synthesis event) reconciles with the iteration files, the registry (11 open findings), the strategy, and the dashboard.

Review verdict: CONDITIONAL
