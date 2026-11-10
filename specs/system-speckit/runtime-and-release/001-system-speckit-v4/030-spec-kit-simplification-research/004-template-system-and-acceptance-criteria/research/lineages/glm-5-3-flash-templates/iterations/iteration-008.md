# Iteration 008 — Angle 8: merge/drop candidates — the consolidation ledger

- sessionId: fanout-glm-5-3-flash-templates-1788737392077-m8w16s
- Window opened: 2026-09-06T23:52:18Z (init) · iteration executed 2026-09-07T01:36Z–01:55Z
- Focus: Q8 — which templates or surfaces could merge or drop without losing a validated capability? (consolidation across angles 1-7)
- Status: complete · newInfoRatio: 0.138 (4 new findings / 33 accumulated; 1 correction to a prior finding)
- Novelty justification (1 sentence): first-recorded — the three-authority doc-inclusion split (with a correction to iteration 2's negative knowledge), the deliberate-retirement contradiction, and the golden-coverage gap; the merge/drop ledger itself consolidates rather than repeats.
- Executor: this process, inline · tool calls: 9 bash evidence + writes = within 12; research actions 6.
- Quality guards: source diversity 8 distinct files; every finding ≥3 records; focus alignment 100%; one prior record corrected (see f-iter008-001 and the ruled-out amendment).

## Focus

Q8 per strategy §3. State read first: state log 8 records, registry 29 findings. Method: for each candidate surface, establish whether a VALIDATED capability (golden snapshot, registry rule, pinned test, enforced rule) exists, or whether its existence is prose-only.

## Actions Taken

1. Golden snapshot coverage mapped (`runtime/cli/tests/scaffold-golden-snapshots.vitest.ts`, 157 lines): renders required+required+lifecycle docs for L1/2/3/3+ with frontmatter/marker/no-IF assertions + snapshots (`:45-62`); phase-parent spec render (`:65-74`); anchor-structure checks for EXACTLY the flag-4 lazy addons {before-after, timeline, roadmap, decision-record} (`:76-84`); `--with-lazy-addons` opt-in/default spawn test (`:100-121`); L1 minimum-viability contract pin (`:126-134`). NOT covered: handover, debug-delegation, research/research.md, goal, resource-map, context-index templates (0 hits in the file). [SOURCE: runtime/cli/tests/scaffold-golden-snapshots.vitest.ts:45-62,65-74,76-84,100-121,126-134]
2. checklist.md retirement is DELIBERATE and test-pinned: "`carries verification in the merged tasks document and nowhere else`" — "`The standalone verification document is retired: it must appear in no bucket at all, or a scaffold would start producing it again.`" with assertions over all four buckets (`:136-147`). Corpus confirms completion: `find specs -name checklist.md` = 0. [SOURCE: runtime/cli/tests/scaffold-golden-snapshots.vitest.ts:136-147; find specs -name checklist.md = 0]
3. Doc-inclusion authority audit (corrects iteration 2): `runtime/lib/validation/spec-doc-structure.ts:216-226` — collectDocuments builds contractDocs from requiredCore/requiredAddon/lifecycle/lazyAddonDocs PLUS HARDCODED `'resource-map.md'` (`:224`) and `'context-index.md'` (`:225`), minus FREEFORM_WORKFLOW_DOCS. So a PRESENT resource-map.md/context-index.md IS structure-checked (frontmatter/anchor rules) — via a hardcoded list, not via the contract, and NOT via orchestrator.ts:507-510 (validationDocsForLevel, which omits both). THREE inclusion authorities now known: contract arrays (orchestrator), hardcoded extras (spec-doc-structure), FREEFORM exclusions (both). [SOURCE: runtime/lib/validation/spec-doc-structure.ts:200,216-226; runtime/lib/validation/orchestrator.ts:500-514; templates/spec-kit-docs.json:180-191]
4. Capability census per candidate (from angles 1-7 + this pass): context-index.md — manifest documents[]+versions+v1.0 self-marker (angle 7), packet-types template, 1 prose mention (level-specifications:103 family), 0 contract membership, 0 producers, structure-checked only via the hardcoded list; resource-map.md — 3 vocabularies (f-iter002-004) + hardcoded inclusion (action 3) + loop-emission namesake (f-iter002-003) + manual render example (f-iter003-004); goal.md — 75 files, full gate profile, no creator (f-iter006-001), plugin pinned by speckit-goal-offer-contract.test.cjs + opencode-goal-tool-path.test.cjs (session-goal side IS test-pinned); checklist.md — retired, test-pinned, 4 stale prose references (README:154 discovery list, hooks README:12, sentinel comments :7/:217, level-selection-guide:204); documents[] — zero consumers (f-iter001-001); staleness checker — broken default path (f-iter007-002). [SOURCE: angle findings as cited; .opencode/plugins/tests/speckit-goal-offer-contract.test.cjs:71-81; .opencode/plugins/tests/opencode-goal-tool-path.test.cjs:40]

## Findings

### f-iter008-001 — P2 — fix (with correction to f-iter002-004 / ro-iter002-001)

`runtime/lib/validation/spec-doc-structure.ts:224-225` vs `runtime/lib/validation/orchestrator.ts:500-514` + `templates/spec-kit-docs.json:180-191,565-570` — FACT: document-inclusion authority is split across THREE lists: (a) the contract arrays (which omit resource-map/context-index), (b) spec-doc-structure's hardcoded `{resource-map.md, context-index.md}` extras, (c) the orchestrator's validationDocsForLevel which follows (a) only. CORRECTION to iteration 2: f-iter002-004 said resource-map.md is "never structure-checked" and ro-iter002-001 ruled out present-addon validation — the TRUE statement is narrower: it is structure-checked WHEN PRESENT via the hardcoded list, but its inclusion is invisible to the contract, unrepresentable in EXTENSION-GUIDE's workflow (which teaches contract editing only), and absent from the orchestrator's doc list. The defect stands but its mechanism was mis-attributed; severity holds at P1-for-the-claim/P2-for-this-refinement. SEVERITY: **P2** — three authorities for one question guarantees future drift (this audit itself tripped on it). RECOMMENDATION: **fix** — make the contract the single authority: add resource-map.md (and context-index.md if kept) to lazyAddonDocs where produced, delete the hardcoded set, keep FREEFORM as the only exception list.
[SOURCE: runtime/lib/validation/spec-doc-structure.ts:200,216-226; runtime/lib/validation/orchestrator.ts:500-514; templates/spec-kit-docs.json:180-191,565-570,98-108; templates/EXTENSION-GUIDE.md:31-40]

### f-iter008-002 — P2 — remove (prose references to a deliberately retired document)

`runtime/cli/tests/scaffold-golden-snapshots.vitest.ts:136-147` vs `runtime/README.md:154` + `runtime/lib/hooks/README.md:12` + `runtime/lib/hooks/completion-evidence-sentinel.cjs:7,217` + `references/templates/level-selection-guide.md:204` — FACT: checklist.md's retirement is a PINNED DECISION ("must appear in no bucket at all"; corpus = 0 files), yet four prose surfaces still treat it as live (discovery list, hooks input, sentinel comments, the L2 level row "Level 1 + checklist"). The prose is not merely stale — it contradicts a test-enforced design decision, which is the strongest form of drift this audit has found. SEVERITY: **P2** (each individual surface already filed: f-iter005-001, f-iter005-002, f-iter003-005; this finding names the root decision). RECOMMENDATION: **remove** the four prose references (and note the retirement in MIGRATION.md so future readers stop reintroducing it).
[SOURCE: runtime/cli/tests/scaffold-golden-snapshots.vitest.ts:136-147; runtime/README.md:154; runtime/lib/hooks/README.md:12; runtime/lib/hooks/completion-evidence-sentinel.cjs:7,217; references/templates/level-selection-guide.md:204; find specs -name checklist.md = 0]

### f-iter008-003 — P2 — fix (extend the golden coverage)

`runtime/cli/tests/scaffold-golden-snapshots.vitest.ts:76-84` (expectedAnchors = flag-4 only) vs `templates/addons/{handover,goal,resource-map,debug-delegation,research}.md.tmpl` + `templates/packet-types/context-index.md.tmpl` — FACT: six of the ten addon/packet-type templates have NO golden render/anchor test; they are exactly the templates that drifted on version markers (five v1.0/v1.1 self-markers, f-iter007-001) and the ones whose contract membership is disputed (resource-map, context-index). The test gap and the drift occupy the same six files — untested surfaces drifted, tested ones did not. SEVERITY: **P2**. RECOMMENDATION: **fix** — extend the expectedAnchors map (or a data-driven sweep over templates/) to all templates; include a version-marker-vs-manifest assertion, which would have caught f-iter007-001 and pins f-iter007-002's fix.
[SOURCE: runtime/cli/tests/scaffold-golden-snapshots.vitest.ts:76-84; templates/addons/research.md.tmpl:16; templates/addons/resource-map.md.tmpl:17; templates/addons/handover.md.tmpl:17; templates/addons/debug-delegation.md.tmpl:18; templates/packet-types/context-index.md.tmpl:15; templates/addons/goal.md.tmpl:31]

### f-iter008-004 — P2 — merge (the goal surfaces under one name discipline)

`.opencode/plugins/opencode-goal.js` + `speckit-goal-offer-contract.test.cjs` + `opencode-goal-tool-path.test.cjs` vs `templates/addons/goal.md.tmpl` + `references/workflows/goal-set-string-playbook.md` — FACT: the SESSION-GOAL side is well-built and test-pinned (two test files; 8 YAML offers), the GOAL-DOCUMENT side is contract-rich but creatorless (f-iter006-001) and conventionally bound (f-iter006-002), and nothing ties them except the operator's hands (f-iter006-003). The validated capability on each side is real and distinct — NEITHER should be dropped; the gap is the bridge. SEVERITY: **P2**. RECOMMENDATION: **merge** the naming/documentation (one "goal" section covering session objective + goal.md + the derivation step), optionally with a small bridge: `opencode_goal` gains a `fromPacketGoal: <path>` action that reads goal.md's directive/criteria and drafts the objective string.
[SOURCE: .opencode/plugins/opencode-goal.js:1-6,27-29; .opencode/plugins/tests/speckit-goal-offer-contract.test.cjs:71-81; .opencode/plugins/tests/opencode-goal-tool-path.test.cjs:40; templates/addons/goal.md.tmpl:41-62; references/workflows/goal-set-string-playbook.md:27-31]

## The consolidation ledger (deliverable for research.md — decision-ready; every row cites its finding)

| Surface | Capability that is REAL (validated) | Capability that is PROSE-ONLY | Verdict | Action |
|---|---|---|---|---|
| documents[] (17×owner/creationTrigger/absenceBehavior) | none — zero consumers | the whole trigger/absence semantics story | DROP or WIRE | f-iter001-001 (P1): wire into create.sh+validator, or demote to documented index |
| lazyAddonDocs (8-doc lists) | subset check (create.sh:394-398) + validator union | "lazy" prose vocabulary (mis-scoped ×3) | KEEP, RE-LABEL | f-iter001-002 + f-iter003-002/003: split flag-lazy vs lifecycle; fix prose to flat model |
| requiredAddonDocs (empty ×7) | validator union site (orchestrator.ts:473) | CONTRACT.md:41's "closure-gating for L2/3/3+" | FIX | f-iter001-003: move acceptance-criteria.md into it at L2/3/3+, retire the grep |
| --with-lazy-addons (flag-4) | golden-tested (snapshots:100-121) | undocumented anywhere in prose | DOCUMENT | f-iter003-001 (P1) |
| acceptance-criteria.md | AC_CLOSURE (error) + AC_COVERAGE (info) + level inference | "optional, warns" prose family | FIX PROSE | f-iter004-002 (P1) + f-iter004-001 (P1 evidence-cell claim) |
| tasks.md verification checklist | check-completion.sh + plugin + Stop hook (outside validator) | README:198 "linked" framing | DOCUMENT the split | f-iter005-003 (P1) |
| checklist.md | retirement is test-pinned (snapshots:136-147) | all four live references | REMOVE references | f-iter008-002 |
| resource-map.md | manual renderer + hardcoded structure check + loop namesake (different artifact) | "explicit-option + warn" + README:173 loop claim | FIX + DOCUMENT | f-iter002-003/004 + f-iter008-001 |
| context-index.md | hardcoded structure check only | everything else (1 prose mention, 0 producers, v1.0 marker) | DROP or ADOPT | this ledger; f-iter007-001 version pair; no finding argues a live use |
| goal.md (document) | gate profile + renderer + 75 live files | the creation surface; the binding-as-gate | DOCUMENT (+optional creator) | f-iter006-001/002 (P1/P2) |
| session goal (opencode_goal) | two pinned test files + 8 YAML offers | the bridge to goal.md | MERGE naming | f-iter006-003 + f-iter008-004 |
| versions{} + templateVersions | resolver exposure (resolver-only) | version-compare (staleness checker dead path) | FIX checker, EXTEND goldens | f-iter007-001/002/003 + f-iter008-003 |
| SPECKIT_AC_COVERAGE_ENFORCE | none (reserved) | registry lists it as live flag | DOCUMENT | f-iter005-004 + f-iter004-003 |

## Questions Answered

- **Q8 (angle 8) — ANSWERED**: merge/drop is decidable per row of the ledger above. Drops that lose NOTHING validated: checklist.md prose references (retirement already test-pinned), context-index.md (single hardcoded mention, no producer, no prose body), documents[] semantics if not wired (zero consumers today). Merges with real payoff: the two completion stacks under one documented boundary (or registered rule), the goal naming under one section, the three doc-inclusion authorities into the contract. Everything else is fix/documentation work on surfaces whose validated capability must be kept.

## Questions Remaining

- None of Q1-Q8 remain open. Iterations 9-10 (forced): breadth/residue pass — verify the least-corroborated earlier findings (spot re-reads), sweep prose surfaces not yet touched (MIGRATION.md details, template-guide full-body claims, phase-definitions.md vs the phase contract), then final cross-angle consistency and synthesis preparation.

## Ruled Out (do not retry)

- ro-iter008-001 (amends ro-iter002-001): "resource-map.md is never structure-checked" — AMENDED: it IS structure-checked when present via the hardcoded set (spec-doc-structure.ts:224); what is ruled out is contract-mediated inclusion. [SOURCE: runtime/lib/validation/spec-doc-structure.ts:216-226]
- ro-iter008-002: "checklist.md retirement is accidental drift" — ruled out: golden test comment + assertions pin it as deliberate (snapshots:136-147); corpus 0 files. [SOURCE: runtime/cli/tests/scaffold-golden-snapshots.vitest.ts:136-147]

## SCOPE VIOLATIONS

None. Writes: `iterations/iteration-008.md`, `deltas/iter-008.jsonl`, `deltas/event-008.json` + gateway ledger/projection writes — all inside the lineage directory. No packet-level writes, no repo tooling.

## Next Focus

Iteration 9 — breadth/residue pass (forced-depth broadening): (a) spot re-read the 3 least-corroborated P1s (f-iter001-001, f-iter002-002, f-iter007-001) to confirm citations still hold; (b) sweep untouched prose: templates/MIGRATION.md full body, references/structure/phase-definitions.md vs the phase contract thresholds, references/templates/template-guide.md claims not yet adjudicated (decision-record/handover rows); (c) any new mismatch feeds a finding; clean passes feed convergence telemetry as qualifying (per skill semantics) — telemetry only, loop continues.

## Convergence telemetry (advisory only — stopPolicy=max-iterations)

newInfoRatio = 0.138 → NOT qualifying; consecutiveQualifying 0/3. Loop continues: 2 iterations remain, forced.
