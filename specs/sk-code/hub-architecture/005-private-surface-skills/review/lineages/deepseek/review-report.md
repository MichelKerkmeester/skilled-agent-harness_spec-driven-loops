# Deep Review Report — `sk-code/013-private-surface-skills`

**Lineage:** `deepseek` (fan-out) · **Session:** `fanout-deepseek-1792944728998-cwb2cp` · **Generation:** 1
**Target:** `specs/sk-code/013-private-surface-skills` (spec-folder, Level 2 phase parent with five children)
**Iterations:** 5 of 5 · **Stop reason:** `maxIterationsReached`
**Executor:** `cli-pi` · `deepseek-v4.1-flash-1017`

---

## 1. Executive Summary

- **Overall verdict:** CONDITIONAL
- **hasAdvisories:** false (the verdict is not PASS)
- **Active findings:** P0 = 0, P1 = 4, P2 = 13 (17 total, 0 resolved, 0 contested)
- **Review scope:** the parent `spec.md` and `goal.md`, all five children's `acceptance-criteria.md` and status-bearing documents, and the implementation surfaces the packet names: the hub registries, the root ignore rules, the pre-commit guard and its harness, the advisor's containment helper and its sixteen scan sites, the Hermes mirror, and the committed trigger index.

What holds, verified by command or by direct read:

- The hub ships `sk-code-quality`, `sk-code-review` and `sk-code-skilled` and neither removed surface; no live tracked path outside `specs/` matches `local-(webflow|obsidian)` or `sk-code-(webflow|obsidian)`; the 108 retained spec rows and the 336 rows at `42b41dd286` match the goal's numbers exactly.
- The four slash-less ignore rules match all four roots; the guard's regex covers the eight skill roots, blocks staged `ACMR` paths and has no bypass variable; seven harness cases exercise it.
- The realpath containment rule is implemented twice (TypeScript and Python) with the same fail-closed semantics, and every tracked-output writer skips a `local-*` name before its first probe.
- No private path reaches the committed trigger index, the compiled fallback graph or the Hermes mirror.

What does not hold:

- The packet cannot prove its own completion. The parent spec states `Status | Complete` while its own phase map marks phases 2-4 unfinished; phase 2's closure table marks AC-013 `Met` in one place and `Unmet` in another and leaves AC-014 `Unmet` although both of its commits are on `origin/main`; phase 3's AC-026 and AC-027 are `Unmet` although the goal records the phase `Done`.
- The new blocking gate is absent from the hooks reference that enumerates pre-commit gates.

## 2. Planning Trigger

`/speckit:plan` is required: four P1 findings need remediation, and all four are documentation-state corrections rather than code changes.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": { "P0": 0, "P1": 4, "P2": 13, "total": 17 },
  "remediationWorkstreams": [
    "W1-reconcile-parent-state",
    "W2-reconcile-phase2-closure",
    "W3-reconcile-phase3-closure",
    "W4-document-the-guard"
  ],
  "specSeed": [
    "Parent spec.md: bring the phase map and the continuity block to the committed state, or label them historical.",
    "Phase 002: resolve the AC-013 row/evidence contradiction and re-evaluate AC-014 against the commits already on origin/main.",
    "Phase 003: decide whether AC-026 and AC-027 are met and record the evidence, or state that the review closure is unrecorded."
  ],
  "planSeed": [
    "Update the parent phase map and continuity block from the goal's progress log and the commit ancestry.",
    "Re-run the AC-013 routing probe and record the compiled-route outcome; then set the row and the evidence paragraph to the same value.",
    "Re-run the AC-014 validator against the final tree and mark the row Met or Superseded with the commit id.",
    "Decide the phase-003 review closure: attach a durable review artifact or supersede AC-027 with an ADR.",
    "Add the private-skill gate to the hooks README inventory and correct the sub-gate count."
  ],
  "findingClasses": [
    "doc-state-contradiction",
    "closure-gate-contradiction",
    "stale-closure-gate",
    "stale-narrative",
    "stale-verification-command",
    "unscoped-completion-criterion",
    "non-durable-evidence",
    "uneven-evidence-standard",
    "unrecorded-guard-limit",
    "undocumented-capability",
    "dangling-pointer",
    "stale-frozen-decision",
    "rule-duplication",
    "hand-maintained-inventory"
  ],
  "affectedSurfacesSeed": [
    "specs/sk-code/013-private-surface-skills/spec.md",
    "specs/sk-code/013-private-surface-skills/goal.md",
    "specs/sk-code/013-private-surface-skills/002-hub-surface-removal/acceptance-criteria.md",
    "specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/acceptance-criteria.md",
    ".skilled/scripts/git-hooks/README.md"
  ],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

| ID | Sev | Title | Dimension | File:line | Disposition |
|---|---|---|---|---|---|
| R3-P1-001 | P1 | The parent spec contradicts itself on whether the packet is complete | traceability | `spec.md:50` | active |
| R3-P1-002 | P1 | One acceptance row says Met and the same file's evidence says Unmet | traceability | `002-hub-surface-removal/acceptance-criteria.md:69` | active |
| R3-P1-003 | P1 | The closure gate still blocks a phase whose commits are on `origin/main` | traceability | `002-hub-surface-removal/acceptance-criteria.md:70` | active |
| R3-P1-004 | P1 | Phase 3's closure gate is unmet while the goal reports the phase done | traceability | `003-advisor-vocabulary-cleanup/acceptance-criteria.md:79` | active |
| R1-P2-001 | P2 | A completion criterion's command no longer produces its stated output | correctness | `goal.md:91` | active |
| R1-P2-002 | P2 | The symlink half of the same criterion is unverifiable outside the operator checkout | correctness | `goal.md:91` | active |
| R2-P2-001 | P2 | D3 records four limits but not the one that decides whether the guard runs at all | security | `spec.md:102` | active |
| R3-P2-001 | P2 | Phase 2's implementation summary still calls the work uncommitted | traceability | `002-hub-surface-removal/implementation-summary.md:41` | active |
| R3-P2-002 | P2 | Phase 3's own spec and summary still point at commit-and-push work | traceability | `003-advisor-vocabulary-cleanup/spec.md:33` | active |
| R3-P2-003 | P2 | The 003-to-004 handoff expected test count no longer matches the suite | traceability | `spec.md:188` | active |
| R3-P2-004 | P2 | AC-027's proof is an ephemeral temp file | traceability | `003-advisor-vocabulary-cleanup/acceptance-criteria.md:347` | active |
| R3-P2-005 | P2 | D1's hub composition predates a fourth packet | traceability | `spec.md:100` | active |
| R4-P2-001 | P2 | Sixteen scan sites each restate the rule, and nothing detects one that omits it | maintainability | `003-advisor-vocabulary-cleanup/implementation-summary.md:58` | active |
| R4-P2-002 | P2 | The two root inventories are hand-maintained and the reason they differ is not recorded at the guard | maintainability | `.skilled/scripts/git-hooks/pre-commit:105` | active |
| R4-P2-003 | P2 | Evidence durability is uneven, and the two contested phases are the ones with no durable proof | maintainability | `002-hub-surface-removal/implementation-summary.md:82` | active |
| R5-P2-001 | P2 | The hooks README gate inventory omits the new blocking gate | completeness | `.skilled/scripts/git-hooks/README.md:24` | active |
| R5-P2-002 | P2 | The parent related-documents pointer names a field that does not exist | completeness | `spec.md:223` | active |

Per-finding evidence, counterevidence, alternative explanation and downgrade trigger are recorded in the iteration narratives and in the state log's `findingDetails` (`iterations/iteration-001.md` … `iteration-005.md`).

## 4. Remediation Workstreams

**W1 — Reconcile the parent state (R3-P1-001, R3-P2-005, R1-P2-001, R1-P2-002, R5-P2-002).**
Rewrite the parent phase map and continuity block from `goal.md`'s progress log and the commit ancestry; either restore a three-packet inventory sentence in D1 or add the amendment note that `sk-code-ci` arrived with packet 014; make the goal's completion criteria reproducible (narrow the `git status` proof to `local-*` paths and state that the symlink criterion is checked in the operator's main checkout); fix or remove the `derived.last_active_child_id` pointer.

**W2 — Reconcile phase 2's closure (R3-P1-002, R3-P1-003, R3-P2-001).**
Re-run the AC-013 routing probe and make the row and the evidence paragraph agree; re-run the AC-014 validator on the final tree and mark the row `Met` or `Superseded` with `e3beac65f4`; update the implementation summary's status line.

**W3 — Reconcile phase 3's closure (R3-P1-004, R3-P2-002, R3-P2-004).**
Attach a durable review artifact for the four rounds the goal cites, or supersede AC-027 with an ADR that records why the review closure is not a file; decide AC-026 against `HEAD == origin/main`; update the phase spec's status row and the summary's next action.

**W4 — Document the guard (R5-P2-001, R2-P2-001, R4-P2-002, R4-P2-003, R4-P2-001).**
Add the private-skill gate to `.skilled/scripts/git-hooks/README.md` and correct the sub-gate count; add the activation limits (`--no-verify`, per-clone `skilled.trustRepoHooks` trust, machine-wide `core.hooksPath`, no CI check) to D3; note at the guard why only four roots carry ignore rules; adopt one evidence standard across phases; optionally extract the shared `local-*` name predicate.

**P2 advisories (no workstream):** R3-P2-003 (stale expected test count), R3-P2-005 (D1 inventory), R5-P2-002 (dangling pointer) are documentation corrections that can ride along with W1/W4.

## 5. Spec Seed

- The packet's durable claim — "the hub sheds both surfaces and nothing private reaches a tracked file" — is **verified**; the seed is not about the outcome but about the record that proves it.
- Every phase should close with one durable artifact per acceptance row that cannot be re-derived from the tree (routing probes, review verdicts), because the two phases that relied on prose are exactly the two whose closure is now contested.
- A frozen decision that states an inventory ("the hub keeps three packets") needs an amendment note when a later packet changes that inventory; otherwise the decision silently becomes false.

## 6. Plan Seed

1. Update `spec.md` phase map rows 2-4 and the `_memory.continuity` block from `goal.md:111-113` and `git merge-base --is-ancestor`.
2. Re-run AC-013's probe; set both the row and the evidence paragraph to the same disposition.
3. Re-run AC-014's validator; mark `Met` with the commit id or `Superseded` with an ADR.
4. For phase 003, attach the review artifact or supersede AC-027; re-decide AC-026.
5. Update `.skilled/scripts/git-hooks/README.md:20,24` to eleven sub-gates and name the private-skill gate.
6. Extend D3 with the activation limits; add the four-rule rationale at `pre-commit:105`.
7. Correct `goal.md:91`'s two criteria so each is reproducible where it is read.

## 7. Traceability Status

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | fail | Implementation matches the spec; four P1 record contradictions mean the spec cannot prove it. |
| `checklist_evidence` | core | fail | 107 acceptance rows: 103 Met, 3 Unmet, 1 Waived (ADR-008 exists). Two rows contradict themselves or the commits. |
| `skill_agent` | overlay | pass | `.skilled/agents/code.md:110` carries the advisor-named `local-*` fallback. |
| `agent_cross_runtime` | overlay | pass | `.opencode/agents/code.md` is byte-identical to the canonical file; `.claude/agents/code.md:95` carries the same fallback in Claude's frontmatter form. |
| `feature_catalog_code` | overlay | pass | No removed-surface token in the hub catalogs; the advisor's `auto-indexing/provenance-and-trust-lanes.md` names the changed edge module. |
| `playbook_capability` | overlay | partial | The harness covers the guard with seven cases; neither manual-testing playbook has a row for it. |

**AC_COVERAGE:** exempt — the packet carries `acceptance-criteria.md` but no `checklist.md`, so the lifecycle predicate is not active.

## 8. Deferred Items

- **R4-P2-001 (shared `local-*` predicate).** Worth doing when a seventeenth scan is added; not worth a refactor now.
- **The edge applier's non-realpath boundary check.** Pre-existing, outside D6's boundary; recorded as an observation in iteration 2, not a finding.
- **512 tracked files naming the operator's home path.** Pre-existing and mostly dated records; D6 excludes them.
- **Suite execution.** `validate.sh --recursive --strict`, the vitest suites and the pre-commit harness were not executed by this lineage (its write surface is the artifact directory only). Every claim about them is read from source or from the packet's record.

## Dimension Expansion Map

- **Swept directions:** none — no pivot was attempted (`convergenceMode: default`, `stopPolicy: max-iterations`).
- **Completed pivots:** 0 · **Failed pivots:** 0 · **Audited overrides:** 0
- **Saturated directions:** none recorded.
- **Selected directions:** correctness (claims vs tree), security (exposure and containment), traceability (state vs record), maintainability (rule spread and evidence), completeness (closure coverage and documentation).
- **Remaining frontier:** none; the run reached its iteration ceiling with all five dimensions covered.

## 9. Search Ledger

- `searchCoverage.graphCoverageMode`: `graphless_fallback` for every iteration (no graph or semantic index was available to this lineage; every search was a direct read, an exact grep or a git plumbing query).
- **Ruled out with proof:** a private path in the committed trigger index (iteration 1); a tracked-writer leak, a containment escape and an unrecorded guard bypass (iteration 2); a waiver without an ADR and a cross-runtime agent drift (iteration 5); a one-sided containment test (iteration 4).
- `searchDebt`: empty. `candidateCoverage.deferred`: empty. `candidateCoverage.blocked`: empty.
- `hasSearchDebt: false`.

## 10. Audit Appendix

**Convergence.** No convergence vote was taken as a stop condition: `stopPolicy` is `max-iterations`, so all five iterations ran and convergence signals are telemetry only. Final active counts: P0 0, P1 4, P2 13.

**Coverage.** Four configured dimensions covered (correctness, security, traceability, maintainability) plus one completeness pass. The full review scope is listed in `deep-review-config.json` (`reviewScopeFiles`); each iteration's `filesReviewed` names the regions it actually read.

**Ruled-out claims.** See §9.

**Sources reviewed.** Parent `spec.md`, `goal.md`, `description.json`, `graph-metadata.json`; all five children's `acceptance-criteria.md` plus the status-bearing documents for 002 and 003 and the decision record for 003; `.gitignore`; the pre-commit guard and its harness; `.skilled/scripts/install-git-hooks.sh`; the hooks README; `.skilled/skills/sk-code/mode-registry.json`; `private-skill-target.ts`; `skill_advisor_runtime.py`; `skill_graph_compiler.py`; `projection.ts`; `watcher.ts`; `freshness.ts`; `skill-graph-db.ts`; `metadata-loader.ts`; `apply-graph-metadata-patch.ts`; `derive-command-bridges.cjs`; `sync-skills-hermes.cjs`; `generate-trigger-index.mjs`; `corpus.mjs`; `trigger-index.json`; `skill-graph.json`; the two named vitest suites; `test_skill_advisor.py`; `.skilled/agents/code.md` and its two runtime mirrors.

**Cross-reference appendix — Core Protocols.** `spec_code` fail, `checklist_evidence` fail (see §7).

**Cross-reference appendix — Overlay Protocols.** `skill_agent` pass, `agent_cross_runtime` pass, `feature_catalog_code` pass, `playbook_capability` partial.

**Verification limits.** This lineage wrote only inside `specs/sk-code/013-private-surface-skills/review/lineages/deepseek/`. It did not run the packet's validation, vitest or harness suites, and it did not modify the review target. A `RESULT: PASSED` line in the packet's own record was read, not reproduced.

Review verdict: CONDITIONAL
