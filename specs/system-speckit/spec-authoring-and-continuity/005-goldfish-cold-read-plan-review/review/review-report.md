# Deep Review Report: 005-goldfish-cold-read-plan-review (children 002-006)

<!-- MACHINE-OWNED: review-report-meta START -->
- Session: `2026-11-12T00:11:44.581Z` · generation 1 · lineageMode new
- Executor: cli-pi, model `deepseek-v4.1-flash-1017` (pi selector `llmgateway/deepseek-v4.1-flash-1017`), reasoning max, one fresh `pi` process per iteration
- Iterations: 5 of 5 · stop reason `maxIterationsReached` (stopPolicy `max-iterations`)
<!-- MACHINE-OWNED: review-report-meta END -->

## 1. Executive Summary

- **Verdict: CONDITIONAL.** No P0 or P1 finding is active. On findings alone the verdict would be PASS with advisories. It is carried as CONDITIONAL because two security leads from iteration 2 were deferred unread, and open search debt holds the verdict at CONDITIONAL until they are covered or ruled out.
- **hasAdvisories:** true · **hasSearchDebt:** true
- **Active findings:** P0 = 0, P1 = 0, P2 = 12. The reducer registered 14. Two are folded in as repeats: R4-P2-001 restates R2-P2-001 at the same `file:line`, and R5-P2-001 narrows R3-P2-002.
- **Scope:** 37 files. These are the 26 working-tree changes owned by children 002-006, plus the parent `spec.md` and each child's `spec.md` and `acceptance-criteria.md`. All four dimensions were covered (correctness, security, traceability, maintainability), followed by a broadened consolidation pass.
- **Operator review focus:** The uncommitted implementation of child phases 002 to 006: the one-lineage refusal in .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs and its tests and fixtures, the executor binding wording in .skilled/commands/deep/research.md, review.md and both presentation assets plus the regenerated compiled contracts, the plan phase-line example in plan.md.tmpl and spec-authoring-card.md with the regenerated scaffold snapshot, the authoring-card pointers in create.sh, spec-gate-core.mjs and system-spec-kit ROUTER.md, and the gate repairs in the three speckit workflow YAML files. Judge the changed code and docs against each child's spec.md and acceptance-criteria.md. See the change set with git diff.
- **Moving target:** another session edited child spec docs under 002, 004, 005 and 006 while iterations 1-5 ran. Write containment recorded them as contested paths, and pi's session logs show none came from a review dispatch. The status-drift findings (R3-P2-001, R3-P2-002, R3-P2-004) describe the docs as each iteration read them, so re-read the current files before acting on them.

## 2. Planning Trigger

`/speckit:plan` is **not required** for a blocker, because nothing is P0 or P1. Two follow-ups do need doing before the packet claims more than PASS-with-advisories: read the two deferred security leads, and run the contract-parity suite and `check-card-sync.sh`. None of the five iterations executed a test suite. The P2 items are cheap documentation and guard-predicate fixes and fit inside the open children (003, 004 and 006) rather than a new packet.

```json
{
  "label": "Planning Packet",
  "triggered": false,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "hasSearchDebt": true,
  "activeFindings": [
    {"id": "R1-P2-001", "severity": "P2", "file": ".skilled/commands/deep/assets/deep-research-presentation.txt:109"},
    {"id": "R1-P2-002", "severity": "P2", "file": ".skilled/commands/deep/research.md:122"},
    {"id": "R1-P2-003", "severity": "P2", "file": ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:35"},
    {"id": "R1-P2-004", "severity": "P2", "file": ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3397"},
    {"id": "R1-P2-005", "severity": "P2", "file": ".skilled/commands/speckit/assets/speckit-implement.yaml:390"},
    {"id": "R1-P2-006", "severity": "P2", "file": ".skilled/commands/deep/assets/compiled/deep-ai-council.contract.markdown:140"},
    {"id": "R2-P2-001", "severity": "P2", "file": ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3400"},
    {"id": "R3-P2-001", "severity": "P2", "file": "specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines/implementation-summary.md:107"},
    {"id": "R3-P2-002", "severity": "P2", "file": "specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/spec.md:133"},
    {"id": "R3-P2-003", "severity": "P2", "file": ".skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/fanout-dispatch.md:52"},
    {"id": "R3-P2-004", "severity": "P2", "file": "specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/implementation-summary.md:116"},
    {"id": "R4-P2-002", "severity": "P2", "file": ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:2207"}
  ],
  "remediationWorkstreams": [
    "WS-A one-lineage refusal hardening (child 003): R2-P2-001, R1-P2-004, R1-P2-003, R3-P2-003",
    "WS-B executor-binding wording (child 002): R1-P2-001, R1-P2-002, R1-P2-006",
    "WS-C packet status reconciliation (children 004, 006, parent): R3-P2-001, R3-P2-002, R3-P2-004, R1-P2-005",
    "WS-D authoring-card pointer single source (child 005): R4-P2-002",
    "WS-E search debt: SL-203 lineage label containment, SL-204 single-executor configDir trust"
  ],
  "specSeed": [
    "003: state that the refusal predicate uses ACTIVE_FANOUT_LOOP_TYPES and document --allow-single-lineage on the runner's public surfaces",
    "006: reconcile CHK-012 'remain unchanged' wording with REQ-001's plan_clarity criteria row",
    "002: name the field an --executors entry's iterations value binds"
  ],
  "planSeed": [
    "Replace the literal loop-type pair at fanout-run.cjs:3400 with ACTIVE_FANOUT_LOOP_TYPES.has(loopType) (or drop the predicate, since assertActiveFanoutLoopType already ran)",
    "Accept or explicitly reject the value form of --allow-single-lineage, and name the opt-in in the refusal or its docs",
    "Add the refusal and opt-in to fanout-dispatch.md and the --executors rows in research.md/review.md",
    "Update parent spec.md phase map and the 004/006 implementation summaries to the current child status",
    "Read expandLineages label validation and the single-executor configDir path to close SL-203/SL-204"
  ],
  "findingClasses": ["instruction_ambiguity", "stale_doc_row", "undocumented_escape_hatch", "fail_closed_input_shape", "recorded_intra_packet_contradiction", "out_of_scope_fix", "latent_fail_open_on_duplicated_allowlist", "documentation/closure-state reconciliation", "traceability/status drift", "traceability/feature-catalog parity", "traceability/checklist-evidence contradiction", "duplicated literal with a single upstream owner"],
  "affectedSurfacesSeed": [
    ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs",
    ".skilled/commands/deep/research.md",
    ".skilled/commands/deep/review.md",
    ".skilled/commands/deep/assets/deep-research-presentation.txt",
    ".skilled/commands/deep/assets/deep-review-presentation.txt",
    ".skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/fanout-dispatch.md",
    ".skilled/commands/speckit/assets/speckit-implement.yaml",
    ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh",
    "specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/spec.md"
  ],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

Each finding is the review leaf's claim. Three were re-read against source during synthesis and held: R2-P2-001 (`fanout-run.cjs:3400` against `:475`), R1-P2-005 (`speckit-implement.yaml:390` against 006 `tasks.md:123`) and R1-P2-004's guard shape (`args.allowSingleLineage !== true`). The rest are unverified beyond the leaf's cited evidence.

| ID | Sev | Title | Dimension | file:line | Evidence | Impact | Fix recommendation | Disposition | findingClass | scopeProof | affectedSurfaceHints |
|----|-----|-------|-----------|-----------|----------|--------|--------------------|-------------|--------------|------------|----------------------|
| R2-P2-001 | P2 | Refusal gate hard-codes the loop-type pair instead of the file's allowlist | security (repeated as maintainability R4-P2-001) | `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3400` | Guard tests `loopType === 'research' \|\| loopType === 'review'`; the set is owned by `ACTIVE_FANOUT_LOOP_TYPES` at `:475` and already enforced at `:3306`, so the predicate is always true today | Fails open for a third active loop type: the one-lineage refusal would silently not cover it | Use the constant, or drop the redundant predicate | active (synthesis-verified) | latent_fail_open_on_duplicated_allowlist | child 003 change | `fanout-run.cjs:475`, `:1114`, `:3408` |
| R1-P2-004 | P2 | Value form of the opt-in is refused, and the message hides the opt-in | correctness | `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3397` | Parser at `:113` stores a string when the flag is followed by a non-flag token; the guard compares `!== true` | A caller who opted in with `--allow-single-lineage 1` is refused by a message that sends them away from the opt-in | Accept truthy values or reject them with a message that names the flag form | active | fail_closed_input_shape | child 003 change | child 003 REQ-002, `fanout-run.vitest.ts:2571` |
| R1-P2-003 | P2 | `--allow-single-lineage` has no public documentation | correctness | `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:35` | Absent from every public flag table; the only in-repo use is one runbook command | A refused operator with a real need has no documented route | Document the flag beside the runner's other flags | active | undocumented_escape_hatch | runner, command pages, runbook in scope | `repin-runbook.md:153`, `research.md:110`, `review.md:88` |
| R3-P2-003 | P2 | Refusal and opt-in absent from every capability surface that documents the runner | traceability | `.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/fanout-dispatch.md:52` | The catalog states only the routing rule; the refusal at `fanout-run.cjs:3400-3407` is tested at `fanout-run.vitest.ts:2536-2543` but described nowhere | Feature-catalog parity gap for a new behaviour | Add the refusal and opt-in to the catalog entry | active | traceability/feature-catalog parity | catalog in scope | `research.md`, `review.md`, presentation assets |
| R1-P2-001 | P2 | One-lineage `--executors` branch pins an ambiguous maxIterations binding | correctness | `.skilled/commands/deep/assets/deep-research-presentation.txt:109` | "its iterations value sets maxIterations" reads as either `config.executor.iterations` or top-level `maxIterations` (`executor-config.ts:827`, `:839`) | Two conforming readings give different run ceilings | Name the exact field the value binds, in all five carriers | active | instruction_ambiguity | five carriers in scope | `deep-review-presentation.txt:137`, `deep-research.contract.markdown:266`, `research.md:124`, `review.md:97` |
| R1-P2-002 | P2 | `--executors` option row still says "the whole fan-out matrix" | correctness | `.skilled/commands/deep/research.md:122` | Row contradicts the one-entry → `config.executor` policy two lines below; same at `review.md:94` | A one-entry matrix plus `--concurrency` silently drops the concurrency setting | Reword the row to "executor matrix; one lineage runs the single-executor path" | active | stale_doc_row | command pages in scope | `review.md:94`, `deep-research-presentation.txt:68` |
| R1-P2-006 | P2 | A generated contract changed with no owning phase | correctness | `.skilled/commands/deep/assets/compiled/deep-ai-council.contract.markdown:140` | Hash-pin refresh is a correct drift fix, but no child's Files to Change table lists it | A reviewer reconciling the tree against frozen scope finds an unowned change | Widen child 002's scope table or record the refresh separately | active | out_of_scope_fix | scope tables in `002/spec.md` | `compiled/README.markdown` |
| R1-P2-005 | P2 | Installed `plan_clarity` criteria contradicts the packet's own CHK-012 | correctness | `.skilled/commands/speckit/assets/speckit-implement.yaml:390` | `criteria` key added inside `quality_gates`, while 006 `tasks.md:123` CHK-012 still requires those entries to "remain unchanged" and is left open | 006 cannot close cleanly; the contradiction is self-disclosed | Amend CHK-012 to allow the scoped `plan_clarity` row REQ-001 requires | active (synthesis-verified) | recorded_intra_packet_contradiction | asset and 006 docs in scope | 006 CHK-012, `speckit-implement.yaml:559` |
| R3-P2-004 | P2 | Phase 6 marks all five criteria Met while its summary records an unresolved P1 checklist conflict | traceability | `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/implementation-summary.md:116` | Summary says Draft because of CHK-012; `acceptance-criteria.md:64-68` marks AC-001..005 Met | A closure check that reads only the AC file would close 006 with the conflict still open | Resolve CHK-012 (see R1-P2-005), then reconcile both docs | active (target changed during the run) | traceability/checklist-evidence contradiction | both docs in scope | — |
| R3-P2-001 | P2 | Phase 4 summary still declares closure blocked after AC-002 closed | traceability | `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines/implementation-summary.md:107` | Body says AC-002 Unmet; `acceptance-criteria.md:61` marks it Met against `build-evidence.md:152` | A resume reads stale status and may re-run T006 | Update the summary body to the closed state | active (target changed during the run) | documentation/closure-state reconciliation | in target | — |
| R3-P2-002 | P2 | Parent phase map marks implementation phases Pending while children report closed | traceability | `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/spec.md:133` | Rows 133-137 read Pending; 002/003/004 report 100% and 006 reports 96%. Narrowed by R5-P2-001: Pending is correct for 005 (`005/acceptance-criteria.md:60`, `:64` `Closeable: No`) | Resume from the parent map is sent to closed phases | Update rows for 002, 003, 004 and 006 only | active (narrowed) | traceability/status drift | in target | `/speckit:resume` entry path |
| R4-P2-002 | P2 | One authoring-card instruction hand-duplicated across two scaffold branches, plus a third variant | maintainability | `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:2207` | Byte-identical echo at `:2207` and `:2416`; `spec-gate-core.mjs:178` words it differently | A card rename needs three edits; the test catches drift only when run | Hoist the sentence into one shell variable or function | active | duplicated literal with a single upstream owner | child 005 change | `create.sh:2416`, `spec-gate-core.mjs:178` |

Folded in as repeats (not counted): **R4-P2-001** repeats R2-P2-001 (same `fanout-run.cjs:3400`, maintainability lens). **R5-P2-001** narrows R3-P2-002 and is recorded in its row.

## 4. Remediation Workstreams

No P0 or P1 workstream. Advisories in suggested order:

1. **WS-E search debt (do first).** It is the only thing holding the verdict at CONDITIONAL. SL-203: read `expandLineages` and prove or disprove that a caller-supplied lineage label cannot escape `lineagesDir` at `fanout-run.cjs:3573`. SL-204: confirm the single-executor path re-applies the `.claude*` configDir root restriction enforced at `fanout-run.cjs:686-694`.
2. **WS-A one-lineage refusal hardening (child 003):** R2-P2-001, R1-P2-004, R1-P2-003, R3-P2-003.
3. **WS-C packet status reconciliation (children 004 and 006, plus the parent):** R1-P2-005 first, since it unblocks R3-P2-004. Then R3-P2-001 and R3-P2-002, re-reading the docs first because they changed during this run.
4. **WS-B executor-binding wording (child 002):** R1-P2-001, R1-P2-002, R1-P2-006.
5. **WS-D single source for the authoring-card pointer (child 005):** R4-P2-002.

## 5. Spec Seed

- Child 003 spec: the refusal predicate must derive from `ACTIVE_FANOUT_LOOP_TYPES`, and `--allow-single-lineage` must appear on the runner's documented flag surface and in the fan-out feature catalog.
- Child 006 spec/tasks: reword CHK-012 so it allows exactly the `plan_clarity` row REQ-001 adds, then re-run the closeout diff check.
- Child 002 spec: name the config field an `--executors` entry's `iterations` value binds, and either own the `deep-ai-council` contract refresh or record it as a drift fix outside the phase.
- Parent spec: phase-map rows must follow child status, and Phase 5 stays Pending until its AC-001 is Met.

## 6. Plan Seed

1. Read `expandLineages` label validation (SL-203) and the single-executor `configDir` handling (SL-204); record a pass or a finding for each.
2. Change `fanout-run.cjs:3400` to use `ACTIVE_FANOUT_LOOP_TYPES`; add a unit case for the value form of `--allow-single-lineage`.
3. Document the refusal and opt-in in `fanout-dispatch.md`, `research.md` and `review.md`, then regenerate the compiled contracts and run the contract-parity suite.
4. Reword the `--executors` rows and the "iterations sets maxIterations" sentence in all five carriers.
5. Reconcile CHK-012 with REQ-001 in child 006, then update the 004 and 006 implementation summaries and the parent phase map.
6. Hoist the duplicated authoring-card sentence in `create.sh`; run `scaffold-passes-its-own-gate.vitest.ts` and `check-card-sync.sh`.

## 7. Traceability Status

**Core protocols**

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `spec_code` | partial | 003 traced end to end: the guard precedes every side effect, and the cited test lines land on the asserted expressions (iteration 1). 005's REQ-004 was confirmed across three carriers, `ROUTER.md:39`, `:163` and `:203-211` (iteration 5) | Contract parity was text-level only; the suite was not executed |
| `checklist_evidence` | partial | AC rows were read for 002-006 | 006 CHK-012 open against five Met AC rows (R3-P2-004). 005 AC-001 Unmet, which is self-disclosed and consistent. 004 summary was stale against AC-002 Met (R3-P2-001) |

**Overlay protocols**

| Protocol | Status | Evidence |
|----------|--------|----------|
| `feature_catalog_code` | partial | The fan-out catalog lacks the refusal (R3-P2-003) |
| `skill_agent` | pass (text-level) | The authoring-card pointers in `ROUTER.md`, `SKILL.md` and `spec-authoring-card.md` agree (iteration 5) |
| `agent_cross_runtime` | not applicable | No agent definitions changed |
| `playbook_capability` | pass (text-level) | The `check-card-sync.sh` named in 005 AC-004 exists with both cited sentinels (`:85`, `:152`); it was not run |

**AC_COVERAGE:** advisory-shortfall. Children 002, 003 and 004 report every AC Met. 005 has AC-001 Unmet. 006 has five AC rows Met, but its closure is blocked by CHK-012.

## 8. Deferred Items

- SL-203 (security, path_traversal, deferred): lineage label containment at `fanout-run.cjs:3573`; `expandLineages` was not read inside the iteration budget.
- SL-204 (security, config_dir_trust, deferred): whether the single-executor path re-applies the configDir root restriction (`deep-review-presentation.txt:137`, `fanout-run.cjs:686`).
- No suite or checker was executed by any iteration: the contract-parity suite, `check-card-sync.sh`, the scaffold snapshot test and the spec-gate tests all remain unrun in this review.

## Dimension Expansion Map

- Saturated directions: none recorded by the reducer. Completed, failed and overridden pivots: none. No Council artifacts.
- Selected review directions: correctness (1), security (2), traceability (3), maintainability (4), then a broadened correctness consolidation pass (5).
- Remaining frontier: the two deferred security leads (SL-203, SL-204).

## 9. Search Ledger

- `searchCoverage`: required bug classes `split_carrier_drift`, `dangling_reference`, `false_closure_claim`, `keyword_collision`. Covered: `split_carrier_drift`. Ruled out: the other three. graphCoverageMode `graphless_fallback`.
- `candidateCoverage.covered`: allowlist_duplication, checklist_contradiction, dead_predicate, doc_code_contract_drift, documentation_duplication, documentation_parity, duplicated_literal, instruction_ambiguity, out_of_scope_change, split_carrier_drift, status_drift, undocumented_capability.
- `ruledOutCandidates`: 15. Examples are a guard bypass through loop-type variation, opt-in enabling by value coercion, prompt injection through the new model-facing text, a divergent duplicate IMPLEMENT keyword list, a dangling reference in AC-004, and keyword collisions across the 22 `INTENT_SIGNALS` arrays.
- `cleanSearchProof`: SL-001 records that the guard has no bypass reach, because it precedes every side effect and no shipped caller bypasses it.
- `searchDebt`: SL-203, SL-204 (see Deferred Items). **hasSearchDebt: true**, so the verdict is carried as CONDITIONAL.

## 10. Audit Appendix

**Convergence summary**

| Iter | Focus | New P0/P1/P2 | newFindingsRatio | Dispatch seconds |
|------|-------|--------------|------------------|------------------|
| 1 | correctness (+ inventory) | 0/0/6 | 1.00 | 237 |
| 2 | security | 0/0/1 | 0.14 | 116 |
| 3 | traceability | 0/0/4 | 0.36 | 118 |
| 4 | maintainability | 0/0/2 | 0.15 | 87 |
| 5 | broadened correctness consolidation | 0/0/0 (one refinement) | 0.04 | 84 |

Stop was forced by `maxIterationsReached`. Convergence was telemetry only under `stopPolicy=max-iterations`. The graph decision stayed `STOP_BLOCKED` on every pass, and its final graph convergence score was 0.669. Every iteration passed `verify-iteration.cjs` (narrative, route proof and delta), and every claim-adjudication event passed, with no new P0 or P1.

**Coverage summary:** 4/4 dimensions. All 37 scope files were read in at least one iteration; per-file status is in `deep-review-strategy.md` §15 and `resource-map.md`.

**Ruled-out claims:** see the Search Ledger.

**Write containment:** every dispatch exited 0. Containment advisories flagged `.skilled/changelog/skilled/v4.0.2.1.md` and `.skilled/skills/system-skilled-doctor/SKILL.md` (iteration 1), plus contested child spec docs under 002, 004, 005 and 006 (iterations 1-5). Pi's own session logs show that every review dispatch wrote only inside `review/`. The flagged edits came from a separate pi build worker and another session.

**Sources reviewed — Core Protocols:** parent `spec.md`; `spec.md` and `acceptance-criteria.md` for each of children 002-006; `implementation-summary.md` and `tasks.md` for 004, 005 and 006; `scratch/build-evidence.md`.

**Sources reviewed — Overlay Protocols:** `fanout-run.cjs` and its unit and stress tests and fixture; `research.md`, `review.md`, both presentation assets and the three compiled contracts; `fanout-dispatch.md`; `repin-runbook.md`; `plan.md.tmpl`, `spec-authoring-card.md`, `SKILL.md` and the scaffold snapshot; `create.sh`, `spec-gate-core.mjs`, `ROUTER.md`, `scaffold-passes-its-own-gate.vitest.ts` and `spec-gate-core.test.mjs`; `speckit-plan.yaml`, `speckit-implement.yaml` and `speckit-complete.yaml`.
