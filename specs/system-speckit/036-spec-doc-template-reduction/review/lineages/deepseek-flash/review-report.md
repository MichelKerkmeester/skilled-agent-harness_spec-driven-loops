---
title: "Deep Review Report — 036-spec-doc-template-reduction"
trigger_phrases: []
---
# Deep Review Report — 036-spec-doc-template-reduction

> Lineage: deepseek-flash fan-out | sessionId `fanout-deepseek-flash-1787805958244-hkfwxl` | generation 1 | stop policy: max-iterations (10/10)

## 1. Executive Summary

**Verdict: CONDITIONAL** — no active P0 findings; 8 active P1 findings require remediation before the packet can proceed to implementation.

| Severity | Active |
|----------|--------|
| P0 | 0 |
| P1 | 8 |
| P2 | 18 |

- **hasAdvisories:** true (18 P2 advisories)
- **Scope:** spec folder `specs/system-speckit/036-spec-doc-template-reduction` (Level-2 phase parent + 6 child phases), the referenced template corpus (`templates/examples/level-1|2`, `templates/manifest/*.tmpl`), and the generator/validator surfaces the packet claims to change (`create.sh`, `check-anchors.sh`, `template-structure.js`, `graph-metadata-parser.ts`, `orchestrator.ts`, `spec-doc-structure.ts`, `authored-continuity-snapshot.ts`, `check-ac-coverage.sh`, `spec-kit-docs.json`)
- **Convergence reason:** stop-policy=max-iterations reached at iteration 10; composite convergence was not the stop trigger (telemetry only per fan-out contract). Coverage: all 4 dimensions covered with 1 stabilization pass.
- **Protocol results:** spec_code partial (10 verified pass / 2 fail), checklist_evidence FAIL, feature_catalog_code pass (advisory), playbook_capability partial (advisory).

## 2. Planning Trigger

CONDITIONAL routes to `/speckit:plan`. Eight P1 findings block implementation: the packet's plans and tasks are un-authored (F001/F019), the scaffold generator corrupts continuity session ids and example metadata (F002/F009), the 001 analysis phase has no authored spec contract (F003), status derivation silently suppresses tasks state (F014), the 003 phase's central premise is stale (F017), implementation summaries assert false completion (F018), and the packet's graph metadata orphans every child phase (F020). Phases 002-006 as specified are otherwise implementable — their claims verified 10/11 at code level.

## 3. Active Finding Registry

| ID | Sev | Dim | Title | Evidence | First/Last |
|----|-----|-----|-------|----------|-----------|
| F001 | P1 | correctness | Implementation plans for phases 2-6 are un-authored scaffold templates | 002-tasks-checklist-merge/plan.md:3,50,83,121 (also 003-006/plan.md:3) | 1/1 |
| F002 | P1 | correctness | create.sh double-prefix bug emits malformed `scaffold-scaffold/` session ids; save path never refreshes 4 of 5 docs | scripts/spec/create.sh:529,545,599-615; authored-continuity-snapshot.ts:195-220; spec-doc-structure.ts:779-789 | 1/2 |
| F003 | P1 | correctness | 001-analysis spec.md is 100% placeholder although 002-006 cite its R1-R6 research as grounding; research.md (17.6KB) exists but was never promoted | 001-analysis/spec.md:2-3,49-50,169-182; 002/003/004/005 spec.md citations | 1/1 |
| F009 | P1 | correctness | Example/template corpus descriptions garbled or truncated — systemic, 7+ docs (level-1 ×4, level-2 ×3 with literal `-->`, decision-record.md.tmpl:4, 002 description.json:4) | templates/examples/level-1/{spec,plan,tasks,implementation-summary}.md:3; level-2/{tasks,checklist,implementation-summary}.md:3 | 2/10 |
| F014 | P1 | correctness | deriveStatus precedence silently suppresses tasks.md state whenever checklist.md exists | mcp-server/lib/graph/graph-metadata-parser.ts:1186-1198,1227-1232 | 3/3 |
| F017 | P1 | traceability | 003 spec's "138 identical lines L3≡L3+" premise contradicts shipped template (skeleton shared; ~24 frontmatter lines duplicated; L3+ description garbled) | templates/manifest/decision-record.md.tmpl:1-167; 003-template-dedup/spec.md:32,85 | 4/4 |
| F018 | P1 | traceability | Scaffolded implementation-summary.md claims `Completed 2026-08-26` for unstarted phases (all 6 phases) | 001-analysis/implementation-summary.md:42; 002-tasks-checklist-merge/implementation-summary.md:42; sizes 4126-4156B across 003-006 | 5/5 |
| F020 | P1 | traceability | Parent graph-metadata.json orphans all six children (children_ids [] , child parent_id null, promised last_active_child_id absent) | 036/graph-metadata.json:6; 001-analysis/graph-metadata.json:5; spec.md:142 | 5/5 |
| F004 | P2 | correctness | Parent phase map `[Phase N scope]` placeholders + all-Pending status | 036/spec.md:102-107 | 1/1 |
| F005 | P2 | correctness | Parent continuity block template defaults (`scaffold/…`, `template-session`) | 036/spec.md:11,20 | 1/1 |
| F006 | P2 | correctness | goal-file-manifest.txt omits tasks/impl-summary/description/graph-metadata/.tmpl entries | goal-file-manifest.txt:50-61 | 1/1 |
| F007 | P2 | correctness | FIX ADDENDUM unconditionally shipped in base L1 plan template | templates/manifest/plan.md.tmpl:152 | 1/2 |
| F008 | P2 | correctness | `[template:level-N/…]` tag leaks into all child doc titles | 001-analysis/spec.md:2 (all 12 child docs) | 1/1 |
| F010 | P2 | correctness | Level-1 example docs drifted from manifest templates (_memory/SELF-CHECK/FIX ADDENDUM absent) | templates/manifest/plan.md.tmpl:152 vs examples/level-1/plan.md | 2/2 |
| F011 | P2 | correctness | Instructional HTML comment leakage confirmed (SELF-CHECK/voice guides/footers) — 19-52% of scaffold doc bytes | 001-analysis/plan.md:33-39; measured shares spec 24.2%, plan 19.4%, impl-summary 51.9% | 2/2 |
| F012 | P2 | correctness | SCAFFOLD_VALIDATION_COUNTS appended unconditionally with phantom REQ-003..REQ-008 | scripts/spec/create.sh:550-582; 001-analysis/spec.md:169-182 | 2/2 |
| F013 | P2 | security | check-anchors.sh depends on externally-sourced is_phase_parent (shell-common.sh:48) — standalone runs misbehave | scripts/rules/check-anchors.sh:34 | 3/3 |
| F015 | P2 | security | create.sh substitution fragile to `/`, `\`, `"` in feature names (perl s/// without escaping) | scripts/spec/create.sh:529-545 | 3/3 |
| F016 | P2 | traceability | 004 spec key_files points to wrong resume-ladder path (lib/resume/, not lib/graph/) | 004-continuity-single-source/spec.md:22 | 4/4 |
| F019 | P2 | traceability | tasks.md 100% scaffold in all phases; no REQ→task mapping | 001-analysis/tasks.md:63-66 | 5/5 |
| F021 | P2 | traceability | 001 description.json placeholder pollution (keywords tokenized from placeholder text; level encoding inconsistent) | 001-analysis/description.json:4-14 | 5/5 |
| F022 | P2 | traceability | 002 description.json truncated mid-sentence (F009 family) | 002-tasks-checklist-merge/description.json:4 | 5/5 |
| F023 | P2 | maintainability | 005 draft byte budgets infeasible (L1 spec 4280B>3.5KB; impl-summary 3365B>2.5KB; L2 spec 6627B>3.5KB) | 005-comment-extraction/spec.md:97 | 6/6 |
| F024 | P2 | maintainability | 004 duplication estimate ~2.8x measured (~80 lines L2 packet, not ~227) | 004-continuity-single-source/spec.md:86; 16-line block × 5 docs | 6/6 |
| F025 | P2 | correctness | ANCHORS_VALID silently skips required-anchor validation when compare is unsupported | scripts/rules/check-anchors.sh:191-193; template-structure.js:439-447 | 7/7 |
| F026 | P2 | traceability | Continuity save path updates handover.md + implementation-summary.md only; handover surface unplanned in 004; key_files omits continuity modules | mcp-server/lib/continuity/authored-continuity-snapshot.ts:195-220 | 8/8 |

## 4. Remediation Workstreams

**WS-1 — Scaffold generator repair (F002, F009, F012, F015, F018, F021)** — highest-leverage lane: fix `create.sh` (session_id composition, description splicing, SCAFFOLD_VALIDATION_COUNTS emission, substitution escaping, Completed-date emission) and purge the shipped residue in the 036 packet (001-006 scaffolds). Re-scaffold or hand-repair the 036 docs.

**WS-2 — Phase-1 contract completion (F001, F003, F019)** — author 001-analysis spec.md from `research/research.md` (R1-R6), then author plans for 002-006 from their specs, and replace placeholder tasks.md with REQ-mapped task breakdowns.

**WS-3 — 002 tasks/checklist merge unblock (F013, F025, F017-adjacent)** — resolve the check-anchors-vs-compare divergence with the structural findings from iteration 7 (two classification paths; silent supported-gate skip; external is_phase_parent sourcing), then execute the merge; re-baseline the 003 problem statement (WS-4) first since the decision-record dedup premise is stale.

**WS-4 — Spec premise re-baselines (F017, F023, F024, F026, F016)** — correct the quantitative premises in 003 (138-line claim), 004 (~227-line claim, handover surface, key_files paths), 005 (byte budgets) before planning.

**WS-5 — Status-signal integrity (F014, F018, F020, F022, F021)** — fix deriveStatus precedence (or land 002's unified doc), remove false completion claims, regenerate graph metadata with child links, repair description.json pollution.

**WS-6 — Doc hygiene (F004, F005, F006, F007, F008, F010, F011, F019)** — parent phase map/continuity, manifest completeness, FIX ADDENDUM gating, title tags, example-template reconciliation, comment extraction (lands naturally under 005).

## 5. Spec Seed

Minimal spec deltas implied by findings:
- 001-analysis: promote research/ artifacts into spec.md (REQ/SC from R1-R6); remove phantom REQ-003..008.
- 002-tasks-checklist-merge: add a pre-flight task to fix check-anchors environment sourcing + supported-gate warn behavior before the merge re-attempt; record the iteration-7 structural verification as the BLOCKER's code-level diagnosis.
- 003-template-dedup: re-state problem statement (decision-record skeleton already shared; remaining dup = frontmatter + garbled L3+ description).
- 004-continuity-single-source: scope handover.md as a second continuity surface; correct key_files (lib/resume/resume-ladder.ts, mcp-server/lib/continuity/*).
- 005-comment-extraction: re-derive byte budgets from measured sizes (spec ≤3.5KB infeasible; use 4.3KB L1 example as floor).
- 006-verify-rollout: add graph-metadata regeneration + description.json repair to the fleet sweep.

## 6. Plan Seed

1. Fix `create.sh` (WS-1) → regenerate/purge 036 scaffolds; verify `scaffold-scaffold/` never recurs.
2. Author 001 spec.md + 002-006 plans/tasks (WS-2).
3. Land check-anchors fixes (F013/F025) and re-run the 002 merge A/B (WS-3).
4. Re-baseline 003/004/005 premises (WS-4) and re-plan each phase's REQ set.
5. Fix deriveStatus precedence + graph metadata + description.json (WS-5).
6. Doc hygiene sweep (WS-6).
7. Close-out per 006: golden snapshots, deriveStatus fleet delta, validate.sh --strict, no-residue sweep.

## 7. Traceability Status

| Protocol | Level | Status | Evidence summary |
|----------|-------|--------|------------------|
| spec_code | core | partial | 10 claims verified pass (002 five reader surfaces, check-anchors second path, detectLevel/PRIORITY_TAGS lines, check-ac-coverage bindings, FRONTMATTER_MEMORY_BLOCK, SELF-CHECK no-consumer, research.md.tmpl 948 lines + widget taxonomy, manifest rows); 2 fail (F016 path drift, F017 stale premise); 002 BLOCKER structural claims confirmed at code level — exact 9-issue reproduction blocked (no tool execution) |
| checklist_evidence | core | FAIL | F018: Completed-date claims on unstarted phases have no delivery evidence |
| feature_catalog_code | overlay | pass | template-composition-system.md consistent with manifest + observed scaffolds |
| playbook_capability | overlay | partial | playbook dirs exist; scenario parity not executed (advisory) |

## 8. Deferred Items

- **Blocked check:** exact reproduction of the 002 BLOCKER's 9 ANCHORS_VALID issues (requires executing check-anchors.sh/compare; out of scope for this write-safe lineage) — 002 phase must re-verify.
- **Advisory (playbook_capability):** scenario-level parity audit for template tooling.
- **Out-of-scope observation:** 001-analysis research lineage state log shows 13 timestamp anomalies (4.3-6.1M ms after window) — deep-research internals, not packet docs; flag for the research-loop owner.
- **P2 advisories:** all 18 P2 findings listed in §3 — no P2 blocks PASS, but F007/F010/F011/F012 should ride along with 005's comment-extraction work.

## 9. Audit Appendix

### Iteration table
| Run | Focus | Ratio | New (P0/P1/P2) |
|-----|-------|-------|-----------------|
| 1 | D1 inventory & scaffold audit | 0.95 | 0/3/5 |
| 2 | D1 template corpus deep dive | 0.28 | 0/1/3 |
| 3 | D2 security & status-signal integrity | 0.24 | 0/1/2 |
| 4 | D3 spec_code sweep | 0.20 | 0/1/1 |
| 5 | D3 cross-doc consistency | 0.24 | 0/2/3 |
| 6 | D4 bloat measurements | 0.04 | 0/0/2 |
| 7 | 002 BLOCKER deep-dive | 0.02 | 0/0/1 |
| 8 | continuity save-path | 0.02 | 0/0/1 |
| 9 | overlay protocols | 0.00 | 0/0/0 |
| 10 | stabilization/adversarial | 0.00 | 0/0/0 |

### Convergence replay
- Stop trigger: `maxIterationsReached` (stop-policy=max-iterations; convergence before the ceiling treated as telemetry and angles broadened per fan-out contract).
- Composite stop score never gated the run; last 2 ratios (0.00, 0.00) would satisfy rolling-average vote if it had; dimension coverage 4/4 stable for 1 stabilization pass.
- P0 override: N/A (no P0 findings).

### File coverage matrix
Covered: parent spec.md, all 6 child spec.md + plan.md + tasks.md + implementation-summary.md, description.json ×2, graph-metadata.json ×2, goal-file-manifest, templates/examples/level-1 ×4 + level-2 ×4, templates/manifest (8 tmpl + spec-kit-docs.json), scripts/spec/create.sh, scripts/rules/{check-anchors,check-ac-coverage,check-template-headers}.sh, scripts/utils/template-structure.js, scripts/memory/generate-context.ts, mcp-server/lib/{graph/graph-metadata-parser,validation/orchestrator,validation/spec-doc-structure,resume/resume-ladder,continuity/*}.ts, feature-catalog template-composition-system, references/templates/{level-selection-guide,level-specifications}.md. Not individually read (pattern-verified): 003-006 tasks.md/implementation-summary.md bodies (size-family match), level-3/3+ example dirs, remaining feature-catalog entries.

### Claim adjudication
8 P1 packets emitted (F001, F002, F003, F009, F014, F017, F018, F020) — all passed with finalSeverity == original; 0 downgrades, 0 transitions beyond discovery.

### Quality gates
Evidence gate: all 26 findings carry file:line evidence, none inference-only. Scope gate: all reviewed files within the declared review scope. Coverage gate: 4/4 dimensions + required protocols (spec_code, checklist_evidence) covered. Severity-field coverage: all findings carry severity/category/file:line/contentHash. riskScore: not used for verdict logic. Adversarial P0 replay: no P0 candidates survived. Security-sensitive override (minStabilizationPasses=2): target touches validation/path-adjacent surfaces (check-anchors, create.sh) — stabilization ran 1 pass (iteration 10) with 0 new findings; noted as an advisory for the merged lineage, not applied as a hard gate.
