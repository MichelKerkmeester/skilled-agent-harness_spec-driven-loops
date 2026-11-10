# Research: Template System and Acceptance Criteria — Documentation-Implementation Audit

- Lineage: `glm-5-3-flash-templates` · sessionId `fanout-glm-5-3-flash-templates-1788737392077-m8w16s`
- Packet: `specs/system-speckit/035-spec-kit-simplification-research/004-template-system-and-acceptance-criteria`
- Executor: inline detached fan-out (this process; no nested dispatch) · loop: research · stopPolicy: max-iterations · **10/10 iterations, stopReason `maxIterationsReached`**
- Method: ground-truth-first adjudication — the manifest (`templates/spec-kit-docs.json`), `create.sh`, and the validator rules are truth; README.md, SKILL.md, and references/ prose are claims tested against them. Every finding cites `[SOURCE: path:line]`. Angles 1-8 from the charter, each one iteration; iterations 9-10 = residue verification + cross-angle consistency (forced depth; convergence was telemetry only).
- Final tally: **35 findings — 0×P0, 15×P1, 20×P2**. Recommendations: fix 18 · document 15 · merge 1 · remove 1 (primary verbs; several rows allow either). Full machine corpus: `findings-registry.json`; per-iteration evidence: `iterations/iteration-001..010.md` + `deltas/iter-*.jsonl`.

## 1. The headline (one paragraph)

The spec-kit template system's enforcement does not run through the manifest's most human-readable section, and the prose describes a different (mostly older, partly imaginary) system. `templates/spec-kit-docs.json` carries two parallel descriptions of the template world: the `documents[]` taxonomy (owner/creationTrigger/absenceBehavior — consumed by nobody) and the `levels.N` arrays (consumed by everything). The prose surfaces — repo-root README first among them — describe a cumulative per-level ladder, "optional with warning" gates, and `explicit-option` ask-surfaces that either no longer exist or never existed. The real system is: four required core docs + one lifecycle doc from the level contract; acceptance-criteria.md scaffolded by a substring grep at L2/3/3+ and enforced as a hard ERROR post-cutoff; four lazy addons behind an undocumented flag; a completion checklist in tasks.md enforced by a tool outside the validator; and a goal addon that is fully contract-defined but has no creator. Nothing found is a P0: the enforcement machinery works; the documentation and two maintenance tools have drifted from it.

## 2. Findings ledger (maintainer-facing; one row per finding)

Severity: P1 = wrong-or-unused (misleads maintainers/users or a real capability is dead) · P2 = cosmetic/taxonomic/refinement. "Fix" = change behavior or text to match the acting truth; "document" = make the existing behavior explicit in prose; "merge"/"remove" = consolidation actions.

### P1 (15)

| ID | Where | The claim | What the enforcement side does | Action |
|---|---|---|---|---|
| f-iter001-001 | spec-kit-docs.json:61-164 | 17 documents declare template/owner/creationTrigger/absenceBehavior | ZERO consumers: doc→file = `.tmpl` naming convention + role-folder scan (template-utils.sh:201-226); scaffold set = levels arrays + flag + AC grep (create.sh:421-437); validator reads the same arrays (orchestrator.ts:473,507); `hard-error/warn/silent-skip` exist only in a comment (doctor.sh:6); sole definition is prose (EXTENSION-GUIDE.md:28-34) | fix (wire) or document (demote to descriptive index) |
| f-iter002-001 | README.md:182-184 (+:154) | trigger table: 7 docs "written when you ask for it"; "machine contract is spec-kit-docs.json" | only 4 have an ask-surface (`--with-lazy-addons`, hardcoded at create.sh:393); goal/resource-map/context-index have none; the pointed-to contract's semantics are dead | fix the table |
| f-iter002-002 | README.md:149-151,165 | L3 = "+decision-record (optional, on request)"; L3+ = "+approval workflow, compliance checkpoints, stakeholder matrix" (files); L2 AC "(optional, warns)" | decision-record is level-agnostic lazy (:189,565,1059,1613); L3+ items are sectionGates + inline-gated core-template anchors (spec.md.tmpl:329,369), not files; AC is scaffolded BY DEFAULT at L2/3/3+ (create.sh:431-433) and absence is a hard error post-cutoff | fix the three rows |
| f-iter002-003 | README.md:168,173 | loops "emit resource-map.md automatically next to review-report.md"; render from the addon template | loops emit `{artifact_dir}/resource-map.md` (the research/lineage dir) via delta extraction (reduce-state.cjs:14,1660), NOT the packet root, NOT a template render | fix + document the two-artifact distinction |
| f-iter002-004 | SKILL.md:65 + manifest:98-102 + README:168 | resource-map.md "optional at any level", explicit-option+warn | in NO level contract; structure-checked when present only via a hardcoded list (spec-doc-structure.ts:224 — refined by f-iter008-001); no producer; warn producerless; yet discovery-indexed | fix (contract membership) + document |
| f-iter003-001 | create.sh:153,282-283,1828 | `--with-lazy-addons` (4 of 10 addon templates, golden-tested) | documented NOWHERE outside create.sh + golden test (mention census) | document |
| f-iter003-002 | template-style-guide.md:39-45 (+3 more ladders) | cumulative per-level addon ladder | lazyAddonDocs byte-identical at L1/2/3/3+; only real differences: AC-optional at 2+, packet-type drops, resource-map extra-contract | fix prose to the flat model |
| f-iter004-001 | README.md:198 | "AC_COVERAGE requires each criterion's evidence to trace back into tasks.md" | canonical evidence lives in acceptance-criteria.md's own Verification column (check-ac-coverage.sh:195-247,292-298); tasks.md is the pre-rollout fallback | fix |
| f-iter004-002 | README.md:149-151,154,165 + folder-structure.md:125,141 | missing acceptance-criteria.md "warns" | AC_CLOSURE = severity ERROR; post-cutoff (2026-08-30) absence FAILS (check-ac-closure.sh:247-257) | fix both files |
| f-iter005-002 | runtime/lib/hooks/README.md:12 + sentinel.cjs:7,217 | sentinel "reads checklist.md via check-completion.sh" | check-completion.sh hardcodes tasks.md (`:441`); zero checklist.md logic; the described branch does not exist | fix hooks docs to tasks.md reality |
| f-iter005-003 | validator-registry.json vs check-completion.sh:48 | README:198 presents the two gates as linked | split-brain: validate.sh gates AC only (39 registry rules, no completion rule); the tasks checklist is enforced only by the completion exposer + Stop hook; zero shared enforcement code | document the boundary or merge (register the rule) |
| f-iter006-001 | README.md:184 + manifest:158-162 | goal.md "written when you ask for it"; most gate-profiled doc (L1 gate :521, phase profile, lazy 5/7 levels); 75 live files | NOTHING creates it: 0 create.sh/command/rule hits; opencode-goal plugin stores objective strings, never writes goal.md; manual renderer documented once, for resource-map only | document the render path (+ optional tiny creator) |
| f-iter007-001 | spec-kit-docs.json:4-22 vs 5 template self-markers | all 17 versions v2.2 | research:16, resource-map:17, handover:17, debug-delegation:18, context-index:15 self-declare v1.0/v1.1 — manifest↔shipped drift, undeterminable which side is wrong | fix (reconcile; pin with goldens) |
| f-iter007-002 | check-template-staleness.sh:61-71,114-118 | "compares each folder's version against the current template version" | default manifest path `templates/manifest/spec-kit-docs.json` does NOT exist (real: templates/spec-kit-docs.json) → "unknown" fallback → every folder misclassified; not in the registry, so silent | fix the path + self-test |
| f-iter009-001 | template-guide.md:178,225 | "**Enforcement:** Hard block if decision-record.md missing" | no gate exists: lazyAddonDocs everywhere; FILE_EXISTS needs only spec/plan/tasks; check-level-match warns INVERSE (present-at-L1) | fix the prose |

### P2 (20)

| ID | Where | One-line summary | Action |
|---|---|---|---|
| f-iter001-002 | manifest:182-190 + create.sh:393 | lazyAddonDocs = 8 listed, 4 scaffolded, 2 ownership models, 1 field | document or split the field |
| f-iter001-003 | manifest:180,560,1054,1608,2170,2311,2428 + create.sh:431-433 | requiredAddonDocs []×7 while AC rides optionalAddonDocs + a whole-JSON substring grep (fragile: any stray mention flips scaffolding) | fix (move AC into requiredAddonDocs, retire the grep) |
| f-iter002-005 | SKILL.md:61,494 | template/ToC gates omit 4 template-backed docs | document the principle |
| f-iter003-003 | style-guide:45 + level-selection:205 + template-guide:1168 | research/research.md lazy "at L3/3+" — actually all four implementation levels | fix the three lines |
| f-iter003-004 | README:184 + folder-structure:142 vs template-guide:195-200 | explicit-option ask-surface = manual renderer, documented once, never named by the rows promising it | document (name the command) |
| f-iter003-005 | level-selection-guide.md:204 | "Level 2 = Level 1 + checklist" — no checklist doc exists in the manifest | document the real artifact |
| f-iter004-003 | check-ac-coverage.sh:368-377 + registry | AC_COVERAGE advisory end-to-end (floor 0.9, pass under floor); README says "requires" | document advisory default + ENFORCE escalation |
| f-iter004-004 | packet 004 acceptance-criteria.md:53-58 | 004's AC is self-referential to this lineage (AC-001 = 10 files + 10 events HERE); repo-wide Met rows rarely cite file:line (advisory-malformed, not covered) | document |
| f-iter005-001 | runtime/README.md:154 vs spec-doc-paths.ts:17-29 | discovery list names checklist.md; the code set (11 entries) omits it | fix the list |
| f-iter005-004 | registry + validation-rules.md vs ENV-REFERENCE.md:166-167 | SPECKIT_AC_COVERAGE_ENFORCE reserved-by-design, unconsumed, missing from ENV-REFERENCE | document |
| f-iter006-002 | goal.md.tmpl:67-85 + playbook:27-31 vs specs/ reality | nested-goal binding is a convention, not a gate (15/75 carry ANCHOR:binding; 033 parent — which built the system — has none; presence optional) | document (or advisory rule) |
| f-iter006-003 | opencode-goal.js:1-6,27-29 + 8 YAMLs | two artifacts named "goal": session objective string vs goal.md document; no code bridge | document the distinction |
| f-iter007-003 | level-contract-resolver.ts:34,65,264,288 | templateVersions exposed, zero consumers | document intended consumer or remove |
| f-iter007-004 | spec.md.tmpl:36-43 + check-template-source.sh:78-93 | versions{} keyed per-.tmpl vs markers per-rendered-document (spec vs spec-core); remediation example names a nonexistent `checklist` template; presence-only enforcement | document; update the example |
| f-iter007-005 | corpus census (4340×v2.2 + 32×v1.0; 14 live) | legacy markers supported indefinitely (MIGRATION.md:24,46) but the (fixed) staleness checker would call them all stale | document the grandfathering in checker output |
| f-iter008-001 | spec-doc-structure.ts:216-226 vs orchestrator.ts:500-514 | doc-inclusion split across THREE authorities (contract arrays, hardcoded {resource-map, context-index}, FREEFORM exclusions) — this audit itself tripped on it; amends f-iter002-004 | fix (contract as single authority) |
| f-iter008-002 | snapshots:136-147 vs 4 prose surfaces (+template-guide:27) | checklist.md retirement is deliberate and test-pinned ("must appear in no bucket at all"; corpus 0) while 5 prose surfaces still present it live | remove the references; note in MIGRATION.md |
| f-iter008-003 | snapshots:76-84 vs 6 templates | golden coverage covers only the flag-4 — exactly the 6 untested templates drifted (the five v1.0 markers + context-index) | fix (extend goldens + a version-vs-manifest assertion) |
| f-iter008-004 | opencode-goal side vs goal.md side | session-goal well-built and test-pinned (2 test files); goal.md contract-rich but creatorless; the bridge is the operator's hands | merge naming (+ optional `fromPacketGoal` bridge action) |
| f-iter009-002 | MIGRATION.md:14 | self-describes living at templates/manifest/ — a nonexistent directory (same phantom as f-iter007-002) | fix the comment (or move the file + fix the checker together) |

## 3. The consolidation ledger (drop/merge decisions)

Drops that lose NOTHING validated: (1) the four-five stale checklist.md prose references (retirement is test-pinned, snapshots:136-147); (2) context-index.md (one hardcoded mention, no producer, no prose body, v1.0 marker — its only capability is being structure-checked if someone hand-creates it); (3) documents[] semantics if not wired (zero consumers today). Merges with real payoff: the two completion stacks under one documented boundary (validator = AC closure; completion tool + Stop hook = tasks checklist); the goal naming under one section (+ optional bridge); the three doc-inclusion authorities into the contract. Everything else keeps a validated capability and needs fix/documentation work. Full table with citations: `iterations/iteration-008.md` §The consolidation ledger.

## 4. Ruled-out directions (negative knowledge, 20 entries)

documents[].template does not wire the renderer/copy (template-utils.sh:201-226); acceptance-criteria.md is not a required addon anywhere (grep manufactures it); resource-map.md is not contract-included (hardcoded instead, f-iter008-001); deep loops do not render the resource-map template (delta extraction, reduce-state.cjs:14); no prose documents --with-lazy-addons; level contracts do not add addons cumulatively; check-completion.sh is not a registry rule; AC_COVERAGE cannot fail (no fail branch; ENFORCE reserved); checklist.md is undiscovered/unenforced; validate.sh --strict does not run the tasks checklist; no command creates goal.md; the speckit goal offer writes objective strings only; the nested-goal binding is not unconditional; the validator does not compare marker versions (presence-only); templateVersions has no consumer; the staleness checker as shipped cannot classify anything; no hard block exists for missing decision-record.md; phase-definitions thresholds do not contradict the phase contract; checklist.md retirement is deliberate; further angles produced no P0 (10 forced iterations).

## 5. Convergence report

- Stop reason: **maxIterationsReached** (stopPolicy=max-iterations; convergence before cap treated as telemetry only — newInfoRatio fell 1.0 → 0.625 → 0.385 → 0.308 → 0.235 → 0.125 → 0.208 → 0.138 → 0.061 → 0.0 and qualifying passes reached only 1/3 consecutive at iteration 10; the loop did not stop early).
- Total iterations: 10/10 (files `iterations/iteration-001.md`–`iteration-010.md`; 10 `type:iteration` records in `deep-research-state.jsonl` via the append gateway; per-iteration deltas in `deltas/`).
- Questions: 14/14 answered (Q1-Q8 charter angles + CQ1-CQ6 carried questions; CQ2 closed in two legs; CQ5 folded into f-iter003-005/f-iter005-001). One amendment chain: f-iter002-004 → f-iter008-001 (mechanism attribution narrowed, verdict unchanged).
- Yield: 35 findings (15 P1 / 20 P2), 20 ruled-out directions, ~38 distinct files cited, 1 consolidation ledger.

## 6. Non-goals honored

No file edits outside this lineage; no new templates; no prose-style review; no implementation (fixes are the maintainers' follow-up); no repo tooling runs (no generate-context.js / validate.sh / git writes).
