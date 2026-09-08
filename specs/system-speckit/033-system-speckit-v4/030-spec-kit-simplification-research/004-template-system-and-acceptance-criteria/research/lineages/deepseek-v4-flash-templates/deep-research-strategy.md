---
title: Deep Research Strategy — deepseek-v4-flash-templates (detached fan-out lineage)
sessionId: fanout-deepseek-v4-flash-templates-1788761493727-f3q25r
contextType: planning
version: 1.1.0
---

# Deep Research Strategy — lineage deepseek-v4-flash-templates

## 1. OVERVIEW

Round TWO of the template-system lane (sibling of `glm-5-3-flash-templates`, round one: 10 iterations, 35 findings, all remediated in sibling `010-template-contract-alignment`). Per the execution mode, THIS session is the inline executor for EVERY iteration; the reducer function is likewise performed inline, deriving strictly from the iteration delta records; the state record was written directly into `deep-research-state.jsonl` (append-gateway semantics; the gateway binary was not invoked). artifact_dir bound directly via the config override; no resolveArtifactRoot node command executed. Write surface: this lineage directory ONLY. Reads anywhere. No generate-context.js, no validate.sh, no node tooling, no git writes; dist/ directories are stale and untracked — check-in source only.

## 2. TOPIC

Documentation-implementation audit of the spec-kit template system and acceptance-criteria enforcement, ROUND TWO — the 010 remediation under verification, plus what round one missed.

## 3. KEY QUESTIONS (remaining)

[None — RQ1-RQ8 all answered; CQ-001..CQ-009 closed or scoped.]

## 4. NEW FACTS ESTABLISHED AT INIT — see previous revision §4 (16-entry versions{}, 9/7/6 lazy lists, create.sh 1880 lines, spec-doc-structure.ts 1351 lines, OPTIONAL_CONTINUITY_DOCS 10 vs 9, LAZY_DOCS_WITH_STATIC_ANCHORS {before-after,timeline,roadmap}, getContractDocs = required only, and the 010 file-modified list).

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- **RQ1 — ANSWERED (iteration 1)**: the contract-single-authority claim is PARTIAL. The hardcoded pair is gone; but the doc-universe authority is still three-way (contract arrays + FREEFORM_WORKFLOW_DOCS + the fs.existsSync acceptance-criteria special case at spec-doc-structure.ts:224-237), the OPTIONAL_CONTINUITY_DOCS set is DUPLICATED with a divergence (orchestrator.ts:82-91 = 9 docs without AC; spec-doc-structure.ts:202-213 = 10 with AC), resource-map.md's new contract membership meets a continuity set that does not know it (its template ships no _memory → every render warns), the FREEFORM comment ("inert for Levels 1-3+") is false (research/research.md IS in numbered lazy lists), and goal.md's contract sectionGates are enforced by nobody (LAZY_DOCS_WITH_STATIC_ANCHORS omits it). Findings f-iter001-001..005.
- **RQ2 — ANSWERED (iteration 2)**: yes, the mechanics land: --with-goal validates goal.md against lazyAddonDocs at every creatable level (1/2/3/3+/phase-parent; review/research not creatable — create.sh:87-101); AC is decided by contract_lists_optional_addon (create.sh:462-465), not a whole-contract grep; the goal author slug is scaffold-safe (goal.md.tmpl:25); the playbook documents both paths. The misses are prose: EXTENSION-GUIDE:40 ("same at every level" — phase 7 / review-research 6), EXTENSION-GUIDE:29-31 field semantics (creationTrigger "the workflow" vs scaffold/explicit-option values; absenceBehavior still lists warn), root README:279 (resource-map "workflow that owns them" — no workflow owns it), documents[]:146-151 (acceptance-criteria "scaffold" unqualified).
- **RQ3 — ANSWERED (iteration 3)**: NO surface states the old timeline/roadmap-vs-resource-map/goal split anymore (that angle is clean). What remains: template-guide:178 "Required Templates: Level 2 + decision-record.md" contradicts the manifest AND template-guide:225 — the f-iter009-001 fix left it; template-style-guide:42 enumeration (6 docs, misses 3, "every level" false at review/research); root README:184 trigger row joins --with-goal and the renderer into one two-by-two; template-guide:182-200 walkthrough never names either flag; template-guide:758 ToC list (9 docs) vs check-toc-policy.sh:25-31 (7 docs).
- **RQ4 — ANSWERED (iteration 4)**: AC_CLOSURE is exactly as documented (error; post-cutoff L2+ presence; completion-claim-only unmet blocking; ADR-backed waivers; phase/review/research exempt via _acc_numeric_level). AC_COVERAGE's ENFORCE switch is real (check-ac-coverage.sh:381-396) and documented (ENV-REFERENCE:166-168, .env.example:137). The headline: the 010 lane's own acceptance-criteria.md:22-28 carries ZERO file:line citations — its own analyzer marks all six malformed (0/6 covered); with ENFORCE on, the packet that added the switch fails it. Repo census (recounted): 157 AC files, 138 Met-bearing, 31 with any file:line. TEMPLATE_SOURCE checks required docs only (getContractDocs = requiredCore+requiredAddon; template-structure.js:190-194) — the default-scaffolded AC and all lazy docs are invisible to it. has_file_line counts "at 09:05"/URL ports as evidence.
- **RQ5 — ANSWERED (iteration 5)**: the docs landed (hooks README:12, runtime README, spec-doc-paths.ts 11 entries incl. no checklist.md); the CODE did not: completion-evidence-sentinel.cjs's evaluateCompletionEvidence gates the whole evaluation path on statSync(checklist.md) — retired file, always absent — so check-completion.sh (the tasks.md checklist) NEVER runs from the Stop hook, verdictFromImplementationSummary only stats implementation-summary.md, and the P0-evidence/priority-context machinery is unreachable. Root README:199's "completion Stop hook" claim and "AC_CLOSURE fails on an unmet criterion" are both imprecise (the rule fails only on a completion claim).
- **RQ6 — ANSWERED (iteration 6)**: end-to-end chain confirmed (create.sh:467-474 → template-utils.sh:87-107 → _inline_gate_renderer_path :233 → inline-gate-renderer.ts RenderLevel '1'|'2'|'3'|'3+'|'phase'; goal.md.tmpl:1 IF-wrapper). Leftovers: playbook:85 "No command writes goal.md on its own" (falsified by its own item 1); SKILL.md:61 gate list omits the four flag docs (round-one f-iter002-005 RE-LISTED — its disposition criterion "docs an author writes" does not match the list, which includes 3 command/workflow docs and excludes goal.md — now flag-owned); _manifest_template_path cannot resolve research/research.md (addons/research/research.md.tmpl vs the real addons/research.md.tmpl). Binding convention: verified live — 035 parent goal carries a fully-populated 12-row binding table; 88 goal docs/26 with ANCHOR:binding; nothing gates it.
- **RQ7 — ANSWERED (iteration 7)**: 16/16 manifest↔marker parity confirmed + pinned; staleness checker path fixed; templateVersions consumer confirmed (level-contract-resolver.vitest.ts:94-95,104). New: the repaired checker compares ONE template (spec.md.tmpl, via spec.md's marker only) — 15 of 16 versioned templates invisible to it; changelog/root.md:12 + phase.md carry v1.0 markers but sit outside the manifest (no versions{} key, no documents[] entry, no parity coverage); the --auto-upgrade doc set (5 docs) omits acceptance-criteria.md and goal.md.
- **RQ8 — ANSWERED (iterations 8-9)**: merge/drop ledger updated: REMOVE --sharded (P1: help-advertised at create.sh:284,332; templates/sharded/ does not exist; block :1722-1762 warns and touches EMPTY stubs into spec-sections/ — zero manifest/reference/validator awareness), REMOVE privateTaxonomy (zero consumers repo-wide — the last manifest region neither consumed nor declared inert), REMOVE or rehome templates/stress-test/ (findings-rubric.* — corpus strings only). FIX: templates/README addons tree + KEY FILES omit goal.md.tmpl (15 vs 16; example row level_3+/), goldens still lazy-4 only (--with-goal unpinned), parity suite pins only the numbered lazy lists. KEEP: documents[] descriptive (now mostly truthful), changelog (document or version), sentinel branch (fix). Confirmations: checklist.md retired-name sweep COMPLETE (only rename-pattern:49 historical row), CONTRACT.md:41 accurate, MIGRATION.md co-location comment fixed, context-index residue zero.

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- Reading both validator engines side by side surfaced the duplicated+divergent continuity set in one pass (iteration 1)
- The 010 verification-summary table read then falsified against the tree made every "landed" claim auditable row by row (iterations 2,4,6,7)
- The "showcase packet" probe — read the lane that wrote the rule against the rule's own analyzer — produced the strongest P1 of the run (iteration 4)
- Decoding the sentinel (a data-typed .cjs) with a small python extractor exposed a branch condition no plain grep could name (iteration 5)
- Inventory-first proof of --sharded (ls templates/ + block read) converted a suspicion into a falsifiable claim with no ambiguity (iteration 9)
- The recount discipline (157/138/31 AC census; 88/26 goal docs; 39 registry rules) kept every number tree-fresh
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- Iteration 004's first probe (registry structure dump) consumed a call before targeting the rule files; the direct rule reads were the productive path
- Iteration 005 initially treated the sentinel as committed-only prose and had to double-check with a second decode — the file is a `data` type, so grep reported "Binary file matches" with no context; the second pass was cheap but the first was wasted
- The iteration-005 draft twice stated "41 registry rules" from a visual count before the recount (39) — corrected in the final sweep; the rule now is: always recount, never trust a sight count
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

[None — no approach was retried from multiple angles without success.]
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS (22)

- decision-record anchor non-enforcement is accidental (template-structure.js:470-487 deliberate dynamic contract) (it-001)
- a registry rule enforces template required headers/anchors for lazy docs (TEMPLATE_SOURCE markers only; compare unregistered) (it-001)
- editing a phase/review lazy list silently breaks --with-goal (exit-3 helper; review/research not creatable) (it-002)
- any doc still states timeline/roadmap lazy while resource-map/goal explicit-option (root README:160,168,173 + EXTENSION-GUIDE:46-47 flat model) (it-003)
- template-guide:1168 contradicts the manifest (consistent with lazyAddonDocs) (it-003)
- phase parents are subject to AC_CLOSURE despite no AC scaffold (_acc_numeric_level -> 1; phase-definitions:99) (it-004)
- SPECKIT_AC_COVERAGE_ENFORCE documented but unconsumed after 010 (fail branches real; ENV rows present) (it-004)
- ENV-REFERENCE omits SPECKIT_AC_CLOSURE/CUTOFF (rows :169-170) (it-004)
- checklist.md in the discovery canonical list (spec-doc-paths.ts 11 entries) (it-005)
- check-completion.sh reads anything but tasks.md (:132,:441) (it-005)
- completion exposer relies on the sentinel (completion-state.cjs:31,141 spawns check-completion itself) (it-005)
- goal.md exempted from anchor checks via a dedicated contract (decision-record special-case only) (it-006)
- nested-goal binding enforced anywhere (88 goal docs/26 binding; 035 parent honors; nothing gates) (it-006)
- templateVersions consumerless after the parity test (level-contract-resolver.vitest.ts:94-95,104) (it-007)
- v2.1 marker is a live template (MIGRATION.md prose) (it-007)
- one more live checklist.md claim survives the 010 sweep (only rename-pattern:49 historical row) (it-008)
- templates/README count discrepancy is a cosmetic typo (it is an inventory omission with a count claim) (it-008)
- upgrade-level.sh fails to re-render goal.md on a bump (goal gates identical at 1/2/3/3+) (it-009)
- level-specifications:741 resource-map row still ladder-scoped (any level/Manual optional) (it-009)
- templates/sharded exists but untracked (absent from the checked-in tree) (it-009)
- cross-finding contradictions (spot re-checks held) (it-010)
- root README advertises --sharded (zero mentions) (it-010)
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0 · Failed pivots: 0 · Audited overrides: 0
- Saturated: the eight charter angles plus the fresh surfaces (sharded, upgrade-level, changelog, stress-test, privateTaxonomy, CONTRACT/MIGRATION/templates-README) — iteration 10 registered 0 new findings at newInfoRatio 0.0 over the whole corpus
- Pivot lineage: none · Remaining frontier: none (the loop hit its cap with the surface saturated)
<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- CQ-001 (it-006): no other validator enforces goal anchors — CLOSED via registry inventory (39 rules; spec-doc-structure is the only anchor-requirement engine).
- CQ-002 (it-010 part): the two engines' docs-for-level constructions share the required/lifecycle split but the continuity set differs — CLOSED with finding f-iter001-001.
- CQ-003 (it-004): phase parents exempt from AC_CLOSURE — CLOSED.
- CQ-004 (it-003/006): the README names both flags and the renderer — CLOSED (the trigger-table row join is the residual, f-iter003-003).
- CQ-005 (it-003): implementation-summary lifecycle-required; root README:153-156 describes it correctly — CLOSED.
- CQ-006 (it-004): L1 phase children: AC_COVERAGE's lifecycle gate uses the same numeric-level logic → inactive below L2 — CLOSED (mechanism-level detail noted in synthesis; not re-verified line-by-line within budget).
- CQ-007 (it-005): the runtime adapters' path to the sentinel is outside the cited file set — SCOPE-NOTED, not verifiable here.
- CQ-008 (it-009): upgrade-level.sh knows nothing of the goal flag; no re-render needed because gates are level-invariant for goal — CLOSED.
- CQ-009 (it-008): stress-test/ consumers — CLOSED (none; f-iter008-004).
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

None — lineage complete. Phase_synthesis has written research.md + resource-map.md inside the lineage with stopReason maxIterationsReached.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->

## 13. RESEARCH BOUNDARIES

- Max iterations: 10 (reached; stopPolicy=max-iterations)
- Convergence threshold: 3 (telemetry only; never reached 3 consecutive ≤0.05 before the cap)
- newInfoRatio operationalization: newly-registered findings / total accumulated findings, +0.10 simplicity bonus when the iteration yields a consolidation insight, capped 1.0
- Lifecycle: new (lineageMode), generation 1 · Started: 2026-09-07T08:20:00Z · Last state append: iteration 10, 2026-09-07T10:42:00Z
