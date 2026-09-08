---
title: Deep Research Strategy — glm-5-3-flash-templates (detached fan-out lineage)
sessionId: fanout-glm-5-3-flash-templates-1788737392077-m8w16s
contextType: planning
version: 1.1.0
---

# Deep Research Strategy — lineage glm-5-3-flash-templates

## 1. OVERVIEW

Detached fan-out lineage of spec packet `specs/system-speckit/035-spec-kit-simplification-research/004-template-system-and-acceptance-criteria`. Per the execution mode, THIS session is the inline executor for EVERY iteration (no nested CLI/agent/subprocess dispatch; the workflow's per-iteration executor-dispatch steps are satisfied inline). The reducer function (strategy machine-owned sections, findings-registry.json, deep-research-dashboard.md) is likewise performed inline by this executor, deriving strictly from the iteration delta records — no reduce-state.cjs invocation, keeping every write inside the lineage directory. The iteration state record is written through the append gateway (`runtime/scripts/append-mode-event.cjs --mode research --run-directory <this lineage dir>`), whose ledger/fencing directories are runner-seeded here (`deep-research-audit-ledger/`, `deep-research-effect-ledger/`, `locks-and-fencing-v1/`).

- artifact_dir bound directly via `config.fanout_lineage_artifact_dir` override (step_resolve_artifact_root not run; no resolveArtifactRoot node command executed).
- Write surface: this lineage directory ONLY. Reads anywhere. No writes to the packet `research/` dir or anywhere else; no generate-context.js, no validate.sh, no git writes.
- resource_map_present: false at init (packet research/ carries no resource-map.md) — informational, not a failure.
- Gateway notes (learned at init/iteration 1): legacy event `started` is refused (`legacy-event-has-no-lossless-mode-event`); the accepted shapes are `type:config`→`deep_research.run_initialized` and `type:iteration`→`deep_research.iteration_completed`; the projection stores the canonical subset (type/iteration/run/status/newInfoRatio/ruledOut/timestamp), findings travel in the deltas.
- Iteration-numbering discipline (learned at iteration 2): findings are numbered f-iterNNN-### where NNN = the iteration file number, NOT the global registry count — the global running index belongs to the registry/dashboard narrative, never to ids embedded in iteration-scoped files.

## 2. TOPIC

Documentation-implementation audit of the spec-kit template system and acceptance-criteria enforcement. Ground truth: `templates/spec-kit-docs.json` (manifest), `runtime/cli/spec/create.sh` (--with-lazy-addons, --phase), `runtime/cli/templates/inline-gate-renderer.ts`, `runtime/lib/templates/level-contract-resolver.ts`, `runtime/cli/rules/{check-ac-closure,check-ac-coverage,check-files}.sh`, native ANCHORS_VALID/SPEC_DOC_SUFFICIENCY checks in `runtime/lib/validation/`. Claims under test (prose, never ground truth): `README.md` (repo root), system-spec-kit `SKILL.md`, `references/structure/{folder-structure,phase-definitions}.md`, `references/templates/*.md`, `references/workflows/goal-set-string-playbook.md`, `templates/README.md`, `templates/EXTENSION-GUIDE.md`. Deliverable: decision-ready findings ledger (fix / merge / document) for spec-kit maintainers, one finding per entry with severity P0/P1/P2 and [SOURCE: path:line] citations.

## 3. KEY QUESTIONS (remaining)

- [ ] Q2 (angle 2): Do README.md and SKILL.md label resource-map.md, timeline.md, roadmap.md, goal.md, before-after.md, decision-record.md as core vs addon in agreement with the manifest and create.sh?
- [ ] Q3 (angle 3): Does --with-lazy-addons match the manifest addon set, and does ANY doc state that timeline/roadmap are lazy while resource-map/goal stay explicit-option?
- [ ] Q4 (angle 4): Which rules read acceptance-criteria.md (AC_CLOSURE, AC_COVERAGE) and what does each enforce; do Level 2/3 packets under specs/ carry Met rows with evidence or leave it a scaffold?
- [ ] Q5 (angle 5): Are checklist.md, acceptance-criteria.md, and the tasks.md verification checklist three distinct completion-gate surfaces, and which one do the validator and the completion exposer actually read?
- [ ] Q6 (angle 6): Does the goal addon's render path actually run through inline-gate-renderer.ts, does any command offer it, and do phase parents in specs/ honor the nested-goal binding?
- [ ] Q7 (angle 7): Do template version fields vs SPECKIT_TEMPLATE_SOURCE headers show drift between the manifest and shipped files?
- [ ] Q8 (angle 8): Which templates or surfaces could merge or drop without losing a validated capability?

Iterations 9-10 broaden/complete: least-corroborated angles, EXTENSION-GUIDE/phase-definitions contract checks, cross-angle residue, consolidated merge/drop ledger.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- **Q1 — ANSWERED (iteration 1)**: The manifest's per-document owner/creationTrigger/absenceBehavior semantics are implemented by NOBODY — the documents[] section (spec-kit-docs.json:61-164) is unwired; the acting truth is levels.N.requiredCoreDocs + lifecycleRequiredDocs + the acceptance-criteria substring grep (create.sh:431-433) + the 4-doc --with-lazy-addons list (create.sh:393) + the .tmpl naming convention with role-folder priority (template-utils.sh:201-226). Findings f-iter001-001 (P1), f-iter001-002 (P2), f-iter001-003 (P2); carried: CQ1 (who creates goal.md), CQ2 (who warns).
- **Q2 — ANSWERED (iteration 2)**: NO — README/SKILL mislabel against manifest+create.sh in five concrete ways: nonexistent ask-surfaces for 3 of 7 explicit-option docs (README:184 vs create.sh:393; f-iter002-001 P1); level-table misdescriptions of L2/L3/L3+ (README:149-151 vs manifest lazyAddonDocs at :189,565,1059,1613 + default AC scaffold create.sh:431-433; f-iter002-002 P1); loop-emission path+provenance wrong (README:173 vs reduce-state.cjs:1660; f-iter002-003 P1); resource-map.md claimed-optional-but-never-contracted-or-validated (SKILL:65 + manifest:98-102 vs all 7 contracts + orchestrator.ts:507-510; f-iter002-004 P1); SKILL gates omit 4 template-backed docs (SKILL:61,494 vs manifest:4-22; f-iter002-005 P2). Carried: CQ3, CQ4.
- **Q3 — ANSWERED (iteration 3)**: (1) --with-lazy-addons scaffolds exactly 4 docs (create.sh:393), a strict subset of the 8-doc lazyAddonDocs arrays (byte-identical at L1/2/3/3+ :182-191/:565-570/:1059-1064/:1613-1618; phase 6 :2170-2177; review/research 5 :2311-2316/:2428-2433; resource-map.md in none) — the flag matches its help but matches NO prose description anywhere (0 mentions; f-iter003-001 P1); (2) NO doc states the timeline/roadmap-lazy vs resource-map/goal-explicit split — lazy prose attaches only to research/research.md and wrongly scopes it to L3/3+ (f-iter003-003 P2), README calls all seven explicit-option, and the prose ladder model conflicts with the manifest flat model (f-iter003-002 P1). CQ3 partially (renderer ask-surface exists, once-documented — f-iter003-004 P2); CQ4 YES (folder-structure:141-142 repeats the README claims). Carried: CQ1, CQ2, CQ5.
- **Q4 — ANSWERED (iteration 4)**: acceptance-criteria.md is read by exactly two registry rules: AC_CLOSURE (error severity; post-cutoff L2+ presence gate with 2026-08-30 default cutoff; Met/Waived/Superseded tally; ADR-backed waiver check; blocks only when the packet claims completion; header-name table parser; malformed rows never skipped) and AC_COVERAGE (info severity, advisory; floor 0.9; evidence coverage on the file's OWN Verification column once the implementation lifecycle starts; tasks.md only as the pre-rollout fallback; SPECKIT_AC_COVERAGE_ENFORCE to escalate). Reality: the 035 family (post-cutoff L2) carries authored tables, all rows Unmet with source-naming cells; 144 AC files repo-wide, Met rows common but rarely file:line-cited (advisory-malformed, not covered). Findings f-iter004-001 (P1), f-iter004-002 (P1), f-iter004-003 (P2), f-iter004-004 (P2). CQ2's AC leg adjudicated (no warn exists); residue carried. Carried: CQ1, CQ2-residue, CQ5, CQ6.
- **Q5 — ANSWERED (iteration 5)**: NOT three live completion surfaces — TWO live + one dead. acceptance-criteria.md: validator-gated (AC_CLOSURE error + AC_COVERAGE info) and read by the completion exposer for level inference (completion-state.cjs:45). tasks.md verification checklist: read ONLY by check-completion.sh (UNTAGGED blocks, P0/P1 need evidence markers, :69/:441), consumed by the completion exposer (plugin system_speckit_completion → completion-state.cjs:241) and the Stop-hook sentinel — outside the validator registry (39 rules, no completion rule). checklist.md: DEAD — absent from SPEC_DOCUMENT_FILENAMES (spec-doc-paths.ts:17-29), the manifest, and check-completion.sh; alive only in stale prose (runtime/README.md:154; hooks README:12; sentinel comments :7/:217). The validator reads neither the tasks checklist nor checklist.md; the exposer reads tasks.md + AC-presence. Findings f-iter005-001 (P2), f-iter005-002 (P1), f-iter005-003 (P1: split-brain topology), f-iter005-004 (P2: reserved ENFORCE flag). CQ2 CLOSED (no warn producer for ANY of the three claimed docs); CQ6 answered (reserved-by-design, missing from ENV-REFERENCE).
- **Q6 — ANSWERED (iteration 6)**: (1) render path YES — goal.md.tmpl is gated (IF level:1,2,3,3+,phase wrapper :1; phase-only ANCHOR:binding :67-85) and rendered by inline-gate-renderer.ts (RenderLevel includes phase, :15), but only via the manual renderer — no scaffold/command feeds it; (2) offering NO — the goal offer in 8 speckit YAMLs sets a plugin-persisted objective STRING (opencode_goal → skills/.state/goal/), a different artifact; nothing creates goal.md (75 live files; most contract-defined: L1 gate :521, phase gate profile, lazyAddonDocs 5/7 levels) — f-iter006-001 (P1); CQ1 CLOSED; (3) nested binding PARTIALLY honored — enforced only when a template-shaped parent goal.md exists (019 parent honors end-to-end; 033 parent — which built the goal system — has none; 018/013 freeform; 15/75 carry ANCHOR:binding); presence is optional-presence so a parent without one is unconstrained; operator objective string unchecked by design (playbook:20) — f-iter006-002 (P2), f-iter006-003 (P2: session-goal vs goal-document conflation).
- **Q7 — ANSWERED (iteration 7)**: YES, drift in four forms: (1) manifest-internal — five of 17 manifest-declared-v2.2 templates self-declare v1.0/v1.1 in their own inline markers (research:16, resource-map:17, handover:17, debug-delegation:18, context-index:15) — f-iter007-001 (P1); (2) tool-side — check-template-staleness.sh (the only version-comparing tool) reads `templates/manifest/spec-kit-docs.json`, which does not exist; default run resolves to "unknown" — f-iter007-002 (P1); (3) architecture — versions{} keys per-.tmpl while markers are per-rendered-document composition names (spec vs spec-core), enforced presence-only (check-template-source.sh:56-66; orchestrator.ts:664-672), templateVersions exposed by the resolver with zero consumers — f-iter007-003/004 (P2); (4) corpus — 4340×v2.2 + 32×v1.0 markers (14 live packets) grandfathered by MIGRATION.md policy with no tool expressing it — f-iter007-005 (P2).
- **Q8 — ANSWERED (iteration 8)**: merge/drop decidable per the consolidation ledger (iteration-008.md). Drops losing nothing validated: checklist.md prose references (retirement test-pinned, snapshots:136-147; corpus 0 files), context-index.md (single hardcoded mention, no producer, no prose body), documents[] semantics if unwired (zero consumers). Merges with payoff: the two completion stacks under one documented boundary, the goal naming under one section (+ optional opencode_goal fromPacketGoal bridge), the three doc-inclusion authorities into the contract. CORRECTION: f-iter008-001 (P2) amends f-iter002-004 — resource-map.md IS structure-checked when present via the hardcoded set (spec-doc-structure.ts:224); contract-mediated inclusion is what is absent. Also f-iter008-002 (P2: prose contradicting a pinned retirement), f-iter008-003 (P2: 6 of 10 templates outside golden coverage — exactly the drifted ones), f-iter008-004 (P2: goal bridge gap).
- **Residue pass — COMPLETE (iteration 9)**: spot re-reads confirm f-iter001-001 (documents[] :152-156), f-iter002-002 (README:148-151), f-iter007-001 (five low-version markers) hold verbatim. New findings: f-iter009-001 (P1: template-guide:178,225 claims "Hard block if decision-record.md missing" — no gate exists; decision-record is lazyAddonDocs at every level, FILE_EXISTS needs only spec/plan/tasks, check-level-match warns in the INVERSE direction), f-iter009-002 (P2: MIGRATION.md:14 self-describes living at templates/manifest/ — a nonexistent directory, the same phantom the staleness checker reads). Folded: template-guide:27 fifth checklist reference + :27-29 ladder lines into f-iter008-002/f-iter003-002. phase-definitions.md:59-62 clean (two-scoring-systems note). MIGRATION.md:24-27,46-47,33-38 consistent with legacy policy and the hardcoded extras.
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- Wiring-disproof by negative grep across the whole runtime before asserting the P1: one finding, defensible (iteration 1)
- Ground-truth-first pairing of every documents[] value to actual behavior BEFORE comparing any prose — no prose contamination in angle 1 (iteration 1)
- Levels-array key-structure scan (spec-kit-docs.json:546-2467) surfaced the 7×empty requiredAddonDocs and the acceptance-criteria.md placement in one pass (iteration 1)
- Claim-side grep of the two prose surfaces (README:149-198, SKILL:61/65/494) BEFORE re-reading ground truth kept the comparison auditable finding-by-finding (iteration 2)
- Mention-census + byte-diff method: the 0-mention flag census and the byte-identical lazy-array diff each converted a suspicion into a one-command proof (iteration 3)
- Registry-first wiring probes: validator-registry.json answered in one call what a validate.sh source-hunt spent a dozen calls establishing (iteration 4)
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- First-pass assumption "documents[x].template wires the copy" — disproved by template-utils.sh:201-226 (naming convention + role-folder scan) and corrected before asserting (iteration 1)
- Init: first gateway attempt used legacy event `started` → RUNTIME_ERROR legacy-event-has-no-lossless-mode-event; resolved by the canonical `type:config`→run_initialized shape (iteration 0, init — setup, not research)
- First reduction of iteration 2 numbered its new findings against the global registry index instead of the iteration number; caught in the pre-projection sweep and corrected in the delta before the state append — zero records entered state with wrong ids (iteration 2)
- Iteration 4 exceeded the 12-tool-call budget (~20) on the validate.sh wiring hunt — validate.sh implements no rules itself; the registry JSON was the right first probe. registry-first probe order, timeboxed (iteration 4)
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

[None yet — no approach tried from multiple angles without success]
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

- documents[x].template wires the renderer/copy: disproved — template-utils.sh:201-226 uses the `${name}.tmpl` convention + core→addons→packet-types priority scan, never documents[] (iteration 1, evidence: runtime/cli/lib/template-utils.sh:201-226)
- acceptance-criteria.md is a required addon at L2+ (per CONTRACT.md:41): disproved at contract level — requiredAddonDocs []×7 (spec-kit-docs.json:180,560,1054,1608,2170,2311,2428); the requirement is manufactured by the scaffolder grep (create.sh:431-433) and, pending angle 4, check-ac-closure.sh (iteration 1, evidence: templates/spec-kit-docs.json:560,1054,1608; templates/CONTRACT.md:41; runtime/cli/spec/create.sh:428-433)
- resource-map.md is validated as a present addon when it exists: disproved — orchestrator.ts:507-510 scans optionalAddonDocs∪lazyAddonDocs only, and resource-map.md is in neither array in any of the 7 contracts (iteration 2, evidence: runtime/lib/validation/orchestrator.ts:507-510; templates/spec-kit-docs.json:165-2467)
- deep loops render templates/addons/resource-map.md.tmpl: disproved — reduce-state.cjs:14 uses shared/synthesis/resource-map.cjs over lineage deltas; the addon template is only a manual render source (README:173, SKILL:65) (iteration 2, evidence: .opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:14,1660)
- prose documents --with-lazy-addons outside create.sh: disproved by the mention census (only create.sh:153,282-283,1828 + the golden test) (iteration 3, evidence: runtime/cli/spec/create.sh:153,282-283,1828)
- level contracts add addons cumulatively (ladder model): disproved — lazyAddonDocs arrays are byte-identical across L1/2/3/3+; the only per-level addon differences are AC-optional at 2/3/3+ and the packet-type drops (iteration 3, evidence: templates/spec-kit-docs.json:182-191,565-570,1059-1064,1613-1618,2170-2177,2311-2316,2428-2433)
- check-completion.sh is a validator-registry rule: disproved — the registry does not mention it; it is the separate Completion Verification Rule at runtime/cli/spec/check-completion.sh:48 (iteration 4, evidence: runtime/cli/lib/validator-registry.json; runtime/cli/spec/check-completion.sh:48)
- AC_COVERAGE can fail a packet: disproved — no fail branch in the script; under-floor returns pass + advisory; escalation only via the ENFORCE registry flag (iteration 4, evidence: runtime/cli/rules/check-ac-coverage.sh:368-377; runtime/cli/lib/validator-registry.json)
- checklist.md is discovered or enforced anywhere in code: disproved — SPEC_DOCUMENT_FILENAMES omits it (spec-doc-paths.ts:17-29), check-completion.sh never mentions it (0 hits), registry has no checklist rule (iteration 5, evidence: runtime/lib/config/spec-doc-paths.ts:17-29; runtime/cli/spec/check-completion.sh:441-452; runtime/cli/lib/validator-registry.json)
- validate.sh --strict enforces the tasks.md P0/P1/P2 checklist: disproved — check-completion.sh is not a registry rule; validate.sh delegates to the registry only (iteration 5, evidence: runtime/cli/spec/validate.sh:8-10; runtime/cli/lib/validator-registry.json)
- the nested-goal binding is enforced unconditionally: ruled out — presence is optional (lazyAddonDocs) and the binding binds only when a template-shaped parent goal.md exists; 15/75 carry the anchor; freeform goals sit outside the anchor system (iteration 6, evidence: templates/addons/goal.md.tmpl:67-85; specs/mcp-tooling/019-official-obsidian-cli/goal.md:60,75,109; ls specs/system-speckit/033-system-speckit-v4/)
- the validator compares marker versions to the manifest: disproved — check-template-source.sh:56-66 and orchestrator.ts:664-672 are presence-only (iteration 7, evidence: runtime/cli/rules/check-template-source.sh:56-66; runtime/lib/validation/orchestrator.ts:664-672)
- templateVersions has a live consumer: disproved — 0 rg hits outside the resolver; the staleness checker re-reads the JSON itself via the dead path (iteration 7, evidence: runtime/lib/templates/level-contract-resolver.ts:264,288; runtime/cli/spec/check-template-staleness.sh:61-71)
- resource-map.md is never structure-checked: AMENDED — it IS structure-checked when present via the hardcoded set (spec-doc-structure.ts:224); what is ruled out is contract-mediated inclusion (amendment iteration 8, evidence: runtime/lib/validation/spec-doc-structure.ts:216-226)
- checklist.md retirement is accidental drift: ruled out — the golden test pins it as deliberate with assertions over all four buckets; corpus = 0 files (iteration 8, evidence: runtime/cli/tests/scaffold-golden-snapshots.vitest.ts:136-147)
- a hard block on missing decision-record.md exists somewhere not yet searched: ruled out for the surfaces in scope — FILE_EXISTS (helper docs), the registry (39 rules), check-level-match (warn-only, inverse), AC rules, create.sh (iteration 9, evidence: runtime/cli/lib/validator-registry.json; runtime/cli/rules/check-level-match.sh:222-223; runtime/cli/utils/template-structure.js)
- phase-definitions thresholds contradict the phase contract: ruled out — the contract carries no threshold data; the two-scoring-systems note pre-empts the conflation (iteration 9, evidence: references/structure/phase-definitions.md:59-62)
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet (angle 1 complete; saturation judgment deferred until the cross-angle residue pass, iterations 9-10)
- Pivot lineage: none yet
- Remaining frontier: angles 2-8 queued; carried CQ1/CQ2; telemetry-only convergence under stopPolicy=max-iterations
<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS

- CQ1 (iteration 1, NARROWED iteration 3): what surface creates goal.md? 0 hits in create.sh; the explicit-option ask-surface is the manual renderer (template-guide.md:195-200) but goal.md has no worked render example in references; playbook assumes existence; phase-parent nested-goal binding still unadjudicated (angle 6).
- CQ2 (iteration 1, NARROWED iteration 3): who produces the promised warn — now claimed in BOTH README:154 and folder-structure:141 ("validation warns when it is absent")? Candidates: check-files.sh / orchestrator / metadata pipeline (angles 4/5).
- CQ5 (iteration 3): checklist.md is discovery-canonical (runtime/README.md:154) but manifest-absent (0 hits) — is it a live completion surface anywhere? (angle 5).
- CQ6 (iteration 4): where is SPECKIT_AC_COVERAGE_ENFORCE actually consumed (orchestrator severity escalation?) and is it documented anywhere? (angle 5).
- CQ2-residue (iteration 1, narrowed 3-4, CLOSED iteration 5): the resource-map.md/context-index.md legs of the promised absenceBehavior=warn — adjudicated: no warn producer exists for ANY of the three claimed documents; FILE_EXISTS covers only contract-required docs and the addon scan checks only present addons.
- CQ1 (iteration 1, CLOSED iteration 6): goal.md's creation surface is the manual inline-gate-renderer render, documented once for resource-map.md only; no command/flag/rule creates it; the opencode-goal plugin is a different artifact (f-iter006-001).
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Iteration 10 — final cross-angle consistency sweep + synthesis preparation: registry dedup/severity normalization check across the 35 findings; confirm the consolidation ledger's verdicts against the full delta corpus; then phase_synthesis writes research.md + resource-map.md inside the lineage with stopReason maxIterationsReached.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

### Bounded Context Snapshot (pointer-based; populated at init)

Source pointers (ground truth — line counts at init, 2026-09-06):

| Path (under .opencode/skills/system-spec-kit/) | Lines | Role |
|---|---|---|
| templates/spec-kit-docs.json | 2467 | THE manifest |
| templates/CONTRACT.md | 105 | manifest field-semantics contract |
| templates/README.md | 221 | template-tree claims (test) |
| templates/EXTENSION-GUIDE.md | 75 | extension claims (test) |
| templates/MIGRATION.md | — | migration notes (test) |
| templates/core/{spec,plan,tasks,implementation-summary}.md.tmpl | — | core templates |
| templates/addons/*.md.tmpl (10: acceptance-criteria, before-after, debug-delegation, decision-record, goal, handover, research, resource-map, roadmap, timeline) | — | addon templates |
| templates/packet-types/{context-index,phase-parent.spec,review.spec} | — | packet-type overrides |
| runtime/cli/spec/create.sh | 1844 | packet generator (--with-lazy-addons, --phase) |
| runtime/cli/templates/inline-gate-renderer.ts | 299 | inline gate/goal rendering |
| runtime/lib/templates/level-contract-resolver.ts | 291 | per-level required/optional doc contract |
| runtime/cli/rules/check-ac-closure.sh | 363 | AC closure rule |
| runtime/cli/rules/check-ac-coverage.sh | 381 | AC coverage rule |
| runtime/cli/rules/check-files.sh | 106 | required-files rule |
| runtime/cli/rules/check-template-source.sh | 105 | SPECKIT_TEMPLATE_SOURCE rule |
| runtime/lib/validation/{orchestrator,spec-doc-structure,generated-metadata-integrity}.ts | — | ANCHORS_VALID / SPEC_DOC_SUFFICIENCY native checks |
| references/structure/folder-structure.md | 372 | level/doc requirements (claim) |
| references/structure/phase-definitions.md | 253 | phase thresholds (claim) |
| references/templates/level-selection-guide.md (218), level-specifications.md (855), template-guide.md (1198), template-style-guide.md (289) | — | prose contracts (test) |
| references/workflows/goal-set-string-playbook.md | 114 | goal-set claims (test) |
| SKILL.md | 551 | skill prose (test) |
| README.md (repo root) | 1053 | root prose (test) |

Reuse candidates / integration points: level-contract-resolver.ts vs references/templates/level-specifications.md (duplicated level contracts?); packet 004 itself (phase child; has acceptance-criteria.md, goal.md, tasks.md) as a live evidence surface for angles 4/6; other packets under specs/system-speckit/ for Level 2/3 Met-row sampling (read-only).

Constraints and risks: evidence ONLY from the cited files; every claim cited [SOURCE: path:line]; ground-truth-first adjudication (manifest/create.sh/validator rules beat prose); a mismatch between two ground truths is itself a finding, adjudicated by the enforcement side (script/rule) as the acting truth.

Init-iteration facts now established (ground truth, for later angles):
- documents[] = 17×{template,owner,creationTrigger,absenceBehavior} at spec-kit-docs.json:61-164 — implementation-dead (f-iter001-001).
- levels: 1 (:166), 2 (:546), 3 (:1041), 3+ (:1595), phase (:2164), review (:2304), research (:2421). requiredAddonDocs []×7 (:180,560,1054,1608,2170,2311,2428). acceptance-criteria.md in optionalAddonDocs at 2/3/3+ (:562,1056,1610) + sectionGates (:998,1552,2121). lazyAddonDocs: L1 8 (:182-191); L2/3/3+ lists start at :565/:1059/:1613 (contents unverified). phase/review/research contracts omit acceptance-criteria.md entirely.
- L1 sectionGates.goal.md exists (:521) though goal.md cannot be scaffolded at L1.
- create.sh: --level 1/2/3/3+/phase (:83-102); --with-lazy-addons (:153-155, help :282-283); requested-4 hardcoded (:393); scaffold_contract_docs :421-437; copy_template at :937/:736/:1431; copy_templates_batch :1647.
- template-utils.sh: copy_template :67-111 (renders via inline gate renderer :88-100); _manifest_template_path :201-226 (convention + core→addons→packet-types→root); resolve_level_contract :244-260 (TS resolver first, raw-JSON fallback); level_contract_docs_from_json :295-313 (requiredCoreDocs∪requiredAddonDocs only).
- Validator consumers: orchestrator.ts:473,507; spec-doc-structure.ts:217-223; FREEFORM_WORKFLOW_DOCS = {review/review-report.md, research/research.md} (spec-doc-structure.ts:200). Discovery: spec-doc-discovery.ts:139-145; runtime/README.md:154 (checklist.md IS in canonical discovery — relevant to angle 5). Deep-loop's resource-map.md ({artifact_dir}/resource-map.md; deep-research-confirm.yaml:187,1356-1371; deep-review-auto.yaml:161,267-275) is a DIFFERENT artifact sharing the name with templates/addons/resource-map.md.tmpl — loop emission provenance = shared/synthesis/resource-map.cjs over lineage deltas (reduce-state.cjs:14,1660), not a template render.
- Angle-2 claim surface pinned: README.md:149-151 (level table), :154 (hard requirements + machine-contract pointer), :165-168 (tree), :173 (loop emission), :182-185 (trigger table), :198 (completion gates); SKILL.md:61 (authored-docs template gate), :65 (resource-map), :494 (ToC list). L3+ artifacts live as sectionGates compliance-verify (:1310-1312,1873-1875) + inline-gated anchors in core/spec.md.tmpl (:329 approval-workflow, :369 stakeholder-matrix) — 54 gated IF-blocks in spec.md.tmpl across 11 level predicates. lazyAddonDocs arrays: byte-identical 8 docs at L1/2/3/3+; phase 6 (drops debug-delegation, research/research.md); review/research 5 (also drops goal.md); resource-map.md in none.
- Angle-3 claim surface pinned: template-style-guide.md:39-45 (cumulative ladder inventory), template-guide.md:195-200 (THE renderer ask-surface example), :1166-1170 (ladder table), level-selection-guide.md:203-206 (ladder + phantom checklist row :204), level-specifications.md:103/194/311/395/742/749/844 (resource-map rows; :742 "Any level, Manual (optional)"), folder-structure.md:125-142 (level trees; AC-warn + decision-record claims), :36-37/:328/:359 (goal/decision-record tree listings), templates/README.md:21-22/63/139-142 (addon descriptions).
- Checklist fact (angle 5 seed): 'checklist' has 0 hits in spec-kit-docs.json; checklist.md IS canonical in discovery (runtime/README.md:154). The completion-gate surfaces for angle 5: checklist.md, acceptance-criteria.md, tasks.md verification checklist.
- Angle-4 ground truth pinned: AC_CLOSURE (error; check-ac-closure.sh: cutoff 2026-08-30 :43-57; Created from spec.md :59-76; status-cell completion :78-101; header-name parser :104-167; ADR declarations :169-187; absent=post-cutoff fail :247-257; dangling waiver fail :287-305; unmet blocks only on completion claim :350-358). AC_COVERAGE (info; check-ac-coverage.sh: floor 0.9 :30-48; lifecycle gate :61-93; canonical single-parse analyzer :195-247,292-298; advisory under floor :368-377). FILE_EXISTS = check-files.sh:24. check-completion.sh:48 = Completion Verification Rule (outside rules/, outside registry). Packet 004's AC rows (acceptance-criteria.md:53-58) are self-referential to this lineage (AC-001 = 10 iteration files + 10 state events here).
- Angle-5 ground truth pinned: SPEC_DOCUMENT_FILENAMES = 11 entries, no checklist.md (spec-doc-paths.ts:17-29). check-completion.sh: tasks.md hardcoded (:441), ANCHOR:protocol required (:443), UNTAGGED blocking + evidence markers (:69), ANCHOR:summary/sign-off counting (:124-144). completion-state.cjs: spawns check-completion.sh (:141,160,241), infers level from AC presence (:45). Consumers: plugin system_speckit_completion (plugins/system-speckit-completion.js:7,58), bin/speckit-completion.cjs, Stop-hook sentinel (hooks/completion-evidence-sentinel.cjs:160-188,227-229). Registry: 39 rules, no completion rule. ENV-REFERENCE.md:166-167 lacks the reserved ENFORCE flag.
- Angle-6 ground truth pinned: goal.md.tmpl = single IF wrapper (:1) + phase-only binding (:67-85) + completion (:87-97) + log (:101-119); inline SPECKIT_TEMPLATE_SOURCE: goal | v2.2 at :31 (markers survive rendering). inline-gate-renderer.ts:15 RenderLevel = 1|2|3|3+|phase. Phase sectionGates.goal.md = {directive,completion,log: [1,2,3,3+,phase]; binding: [phase]} (node dump). opencode-goal.js: state dir skills/.state/goal/ (:27-29), tools opencode_goal/_status (:3060,3072), 0 goal.md refs; wired via goal_prompt_choice/goal_objective in 8 speckit YAMLs (speckit-plan-auto.yaml:98-99,123-137); offer pinned by tests/speckit-goal-offer-contract.test.cjs:81. specs/: 75 goal.md files, 15 with ANCHOR:binding; 019 honors; 033 parent lacks goal.md; 018/013 freeform.
- Angle-7 ground truth pinned: markers = presence-only enforcement (check-template-source.sh:56-66; orchestrator.ts:664-672, head 60-70 lines). Manifest versions 17×v2.2 (:4-22). Template self-markers: research v1.0 (:16), resource-map v1.1 (:17), handover v1.0 (:17), debug-delegation v1.0 (:18), context-index v1.0 (:15); all others v2.2; spec.md.tmpl has 3 markers (:36-43). Staleness checker: manifest path templates/manifest/ DEAD (:61-71,114-118); unknown fallback; not in registry. Corpus: 4340×v2.2 + 32×v1.0 (14 live) on spec.md. templateVersions: resolver-only (:34,65,264,288). MIGRATION.md:24,46: legacy indefinite.
- Angle-8 ground truth pinned: golden snapshots cover required+lifecycle (L1-3+), phase-parent, and ONLY the flag-4 lazy anchors (snapshots:45-62,65-74,76-84,100-121,126-134); checklist.md retirement pinned (snapshots:136-147). spec-doc-structure.ts collectDocuments: contract arrays + HARDCODED resource-map.md (:224) + context-index.md (:225) minus FREEFORM (:200). opencode-goal pinned by two test files (speckit-goal-offer-contract.test.cjs:71-81; opencode-goal-tool-path.test.cjs:40).

## 13. RESEARCH BOUNDARIES

- Max iterations: 10 (forced; stopPolicy=max-iterations — convergence before cap is telemetry only)
- Convergence threshold: 3 (operationalized: 3 consecutive iterations with newInfoRatio ≤ 0.05 = converged signal; TELEMETRY ONLY — the loop does NOT stop early)
- newInfoRatio operationalization: newly-registered findings / total accumulated findings after the iteration, +0.10 simplicity bonus when the iteration yields a consolidation/merge insight, capped 1.0; computed from delta records.
- Per-iteration budget: 12 tool calls, 10 minutes (target 3-5 research actions; iteration-001 used 10/12, 8 research actions — overshoot documented, not silent)
- Progressive synthesis: true
- research.md ownership: this workflow (phase_synthesis) — written inside the lineage; packet research/research.md NOT touched (outside lineage write surface; the parent orchestration owns the packet-level reconciliation)
- Machine-owned sections: this executor's reducer function controls Sections 3, 6, 7-11A
- Question injection: no inbox.jsonl (lineage-confined; questions tracked in the registry inside findings-registry.json)
- Lifecycle: new (lineageMode), generation 1
- Last iteration: 10 complete 2026-09-07T01:47:18Z (ledger stream_sequence 11, gateway exit 0, projectionRefreshed true; synthesis_complete appended directly — gateway refuses legacy synthesis_complete by design, authorization per executor instruction)
- Started: 2026-09-06T23:52:18Z
