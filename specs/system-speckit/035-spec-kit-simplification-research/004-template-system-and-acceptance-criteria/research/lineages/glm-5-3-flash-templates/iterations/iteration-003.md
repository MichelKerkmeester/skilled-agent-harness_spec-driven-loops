# Iteration 003 — Angle 3: --with-lazy-addons vs the manifest addon set, and the lazy/explicit split in prose

- sessionId: fanout-glm-5-3-flash-templates-1788737392077-m8w16s
- Window opened: 2026-09-06T23:52:18Z (init) · iteration executed 2026-09-07T00:51Z–01:05Z
- Focus: Q3 — does --with-lazy-addons match the manifest addon set, and does ANY doc state that timeline/roadmap are lazy while resource-map/goal stay explicit-option? (plus carried CQ3/CQ4)
- Status: complete · newInfoRatio: 0.385 (5 new findings / 13 accumulated)
- Novelty justification (1 sentence): all five findings are first-recorded here — the undocumented flag, the addon-coverage matrix with its ladder-vs-flat model conflict, the wrong-scoped lazy claims, the renderer-only ask-surface, and the phantom "checklist" row — none restate angles 1-2 beyond refining f-iter002-001.
- Executor: this process, inline · tool calls: 4 bash evidence + 1 narrative write + state/delta/projection + reducer = 8/12; research actions 5.
- Quality guards: source diversity 12 distinct files; every finding ≥3 records; focus alignment 100%.

## Focus

Q3 per strategy §3, plus CQ3 (contract-grade account of resource-map.md's status and the split) and CQ4 (does folder-structure.md repeat the README trigger-table claims). State read first: state log at 3 records (config + iterations 1-2), registry at 8 findings.

## Actions Taken

1. Full enumeration of every lazyAddonDocs array: L1 `spec-kit-docs.json:182-191` = L2 `:565-570` = L3 `:1059-1064` = L3+ `:1613-1618` — IDENTICAL 8 docs {handover.md, debug-delegation.md, research/research.md, before-after.md, timeline.md, roadmap.md, decision-record.md, goal.md}; phase `:2170-2177` = 6 {handover, before-after, timeline, roadmap, decision-record, goal} (drops debug-delegation, research/research.md); review `:2311-2316` and research `:2428-2433` = 5 (also drops goal.md). resource-map.md appears in NONE. [SOURCE: templates/spec-kit-docs.json:182-191,565-570,1059-1064,1613-1618,2170-2177,2311-2316,2428-2433]
2. Repo-wide "lazy" vocabulary grep over README.md, SKILL.md, references/, templates/{README,EXTENSION-GUIDE,CONTRACT}.md: lazy vocabulary appears ONLY at CONTRACT.md:16 (generic "lazy document lifecycle"), templates/README.md:21 (generic), EXTENSION-GUIDE.md:39 (field definition "command-owned or explicit-option files"), template-style-guide.md:45 ("research/research.md is a lazyAddonDocs entry for Levels 3 and 3+"), level-selection-guide.md:205 + template-guide.md:1168 ("Level 3 ... lazy research"). No doc applies "lazy" to timeline/roadmap/before-after/decision-record/goal. [SOURCE: templates/CONTRACT.md:16; templates/README.md:21; templates/EXTENSION-GUIDE.md:39; references/templates/template-style-guide.md:45; references/templates/level-selection-guide.md:205; references/templates/template-guide.md:1168]
3. `--with-lazy-addons` mention census: repo-wide rg hits ONLY create.sh:153 (parser), :282-283 (help), :1828 (post-create hint), and runtime/cli/tests/scaffold-golden-snapshots.vitest.ts:104 (golden test). ZERO hits in README.md, SKILL.md, all references/, templates/README.md, EXTENSION-GUIDE.md. [SOURCE: runtime/cli/spec/create.sh:153,282-283,1828; runtime/cli/tests/scaffold-golden-snapshots.vitest.ts:104]
4. Per-doc mention matrix across the six prose surfaces (template-guide, level-specifications, level-selection-guide, folder-structure, templates/README, EXTENSION-GUIDE): resource-map is documented in template-guide:198 (worked render example) and level-specifications:103,194,311,395,742,749,844; goal.md has ZERO mentions in template-guide/level-specifications/level-selection-guide/EXTENSION-GUIDE (only folder-structure:37,328,359 tree listings and the playbook); timeline/roadmap/before-after near-zero across references. folder-structure.md:141-142 repeats the README-pattern claims: "`acceptance-criteria.md - the closure gate; validation warns when it is absent`" and "`decision-record.md - architecture decisions; created on request, skipped silently when absent`" (CQ4: YES, folder-structure repeats them). [SOURCE: references/templates/template-guide.md:198; references/templates/level-specifications.md:103,194,311,395,742,749,844; references/structure/folder-structure.md:36-37,141-142,328,359]
5. CQ3 adjudication: level-specifications.md:742 gives resource-map.md "`Any level, when reviewers need a scannable file ledger | Manual (optional)`" — the closest prose to a contract account; template-guide.md:195-200 documents the actual ask-surface: `inline-gate-renderer.sh --level 3 --out-dir specs/###-name templates/addons/resource-map.md.tmpl`. So explicit-option docs ARE renderable on request via the renderer — but the mechanism is documented once, for one doc. [SOURCE: references/templates/level-specifications.md:742; references/templates/template-guide.md:195-200]
6. Style-guide inventory re-read: template-style-guide.md:39-45 presents a cumulative LADDER (L1: spec/plan/tasks/implementation-summary; L2: +acceptance-criteria; L3: +decision-record; Utility: handover/debug-delegation/resource-map) + the research/research.md lazy note scoped to "Levels 3 and 3+". [SOURCE: references/templates/template-style-guide.md:39-45]

## Findings

### f-iter003-001 — P1 — document (or fix by adding the flag to the level tables)

`runtime/cli/spec/create.sh:153,282-283,1828` vs zero prose mentions — FACT: `--with-lazy-addons` is the ONLY scaffolder switch controlling addon emission (4 of the 10 addon templates), and it is documented ONLY inside create.sh's own help/post-create hint and a golden test; README.md, SKILL.md, every references/ doc, templates/README.md and EXTENSION-GUIDE.md never mention it (0 hits). Meanwhile the SAME prose surfaces publish per-level document ladders (style-guide:39-45, template-guide:1166-1170, level-selection-guide:203-206, folder-structure §3, level-specifications §levels) that never say how to opt in to before-after/timeline/roadmap/decision-record. An operator reading the docs cannot discover the flag; an operator reading the flag cannot find it in the docs. SEVERITY: **P1 (wrong-or-unused)** — a validated capability (flag + golden-snapshot-tested renders) with no operator-facing documentation. RECOMMENDATION: **document** — add the flag (and its 4-doc list) to the README trigger table's explicit-option row and one references page.
[SOURCE: runtime/cli/spec/create.sh:153,282-283,1828; runtime/cli/tests/scaffold-golden-snapshots.vitest.ts:104; references/templates/template-style-guide.md:39-45; README.md:182-184]

### f-iter003-002 — P1 — fix (reconcile the two models in prose)

`references/templates/template-style-guide.md:39-45` (+ template-guide.md:1166-1170, level-selection-guide.md:203-206, folder-structure.md §3) vs `templates/spec-kit-docs.json:182-191,565-570,1059-1064,1613-1618,2170-2177,2311-2316,2428-2433` — CLAIM (prose model): documentation templates form a cumulative per-level LADDER — L2 "adds" acceptance-criteria, L3 "adds" decision-record, 3+ "adds governance sections"; utility docs and resource-map float outside levels. FACT (manifest model): the lazyAddonDocs set is FLAT and IDENTICAL at L1/2/3/3+ (the same 8 docs at every level — no level adds any addon); the real level differences are (a) acceptance-criteria.md optional at 2/3/3+ only, (b) packet-type contracts DROP debug-delegation and research/research.md (phase) and additionally goal.md (review/research), and (c) resource-map.md is recognized by ZERO contracts. The prose ladder and the manifest flat-set are two incompatible mental models of the same system; the ladder also silently implies decision-record.md is L3-scoped (contradicted by create.sh:283 "all are valid at every level" and the manifest). SEVERITY: **P1** — maintainers editing "the L3 addon set" will edit the wrong thing; the flat truth is nowhere stated. RECOMMENDATION: **fix** the prose inventories to the flat model (one table: 8 lazy docs all levels; AC optional 2+; packet-type deltas; resource-map extra-contract).
[SOURCE: references/templates/template-style-guide.md:39-45; references/templates/template-guide.md:1166-1170; references/templates/level-selection-guide.md:203-206; templates/spec-kit-docs.json:182-191,565-570,1059-1064,1613-1618,2170-2177,2311-2316,2428-2433; runtime/cli/spec/create.sh:283]

### f-iter003-003 — P2 — fix

`references/templates/template-style-guide.md:45` + `references/templates/level-selection-guide.md:205` + `references/templates/template-guide.md:1168` vs `templates/spec-kit-docs.json:182-191,565-570,1059-1064,1613-1618` — CLAIM: research/research.md "is a lazyAddonDocs entry for Levels 3 and 3+" (style-guide) / "Level 3 ... lazy research" (level-selection-guide, template-guide). FACT: research/research.md is in lazyAddonDocs at ALL FOUR implementation levels 1, 2, 3, 3+ (identical arrays). The only docs that scope lazy-research to L3 are the prose ones. SEVERITY: **P2 (cosmetic but wrong)**. RECOMMENDATION: **fix** the three lines to "all implementation levels".
[SOURCE: references/templates/template-style-guide.md:45; references/templates/level-selection-guide.md:205; references/templates/template-guide.md:1168; templates/spec-kit-docs.json:182-191,565-570,1059-1064,1613-1618]

### f-iter003-004 — P2 — document

`README.md:184` + `references/structure/folder-structure.md:142` vs `references/templates/template-guide.md:195-200` + `references/templates/level-specifications.md:742` — CLAIM: explicit-option docs are "`written when you ask for it`" / "`created on request`". FACT: the ask-surface is a MANUAL render command — `inline-gate-renderer.sh --level <N> --out-dir <folder> templates/addons/<doc>.md.tmpl` — documented exactly ONCE (template-guide.md:195-200, for resource-map.md) and characterized at level-specifications.md:742 ("Manual (optional)"). goal.md has no worked render example anywhere in references (0 goal hits in template-guide/level-specifications). This ADJUDICATES CQ1's "explicit-option mechanism" half: the mechanism exists but is single-documented, and the README/folder-structure rows never name it. SEVERITY: **P2** — capability reachable, discoverability broken. RECOMMENDATION: **document** — name the renderer command in the README/folder-structure explicit-option rows and add the goal.md render example (or a shared "render any addon" snippet).
[SOURCE: README.md:184; references/structure/folder-structure.md:142; references/templates/template-guide.md:195-200; references/templates/level-specifications.md:742]

### f-iter003-005 — P2 — document (feeds angle 5)

`references/templates/level-selection-guide.md:204` vs `templates/spec-kit-docs.json` (0 'checklist' hits) — CLAIM: "`Level 2 | templates/spec-kit-docs.json | Level 1 + checklist`". FACT: no document named checklist.md exists anywhere in the manifest (rg 'checklist' = 0 hits) or in any level contract; the row is ambiguous between acceptance-criteria.md's checklist rows and tasks.md's verification checklist — both real, both named differently. Notably checklist.md DOES exist in canonical doc discovery (runtime/README.md:154) but not in the manifest — a third completion-surface candidate for angle 5. SEVERITY: **P2 (cosmetic ambiguity)**. RECOMMENDATION: **document** — name the actual artifact ("Level 1 + acceptance-criteria.md") and reconcile checklist.md's discovery-only status in angle 5.
[SOURCE: references/templates/level-selection-guide.md:204; templates/spec-kit-docs.json (0 hits); runtime/README.md:154]

## Questions Answered

- **Q3 (angle 3) — ANSWERED, both halves**: (1) `--with-lazy-addons` scaffolds exactly 4 docs (create.sh:393), a strict subset of the 8-doc lazyAddonDocs arrays that are identical at L1/2/3/3+ and narrower variants at phase/review/research — the flag matches its help text but matches NO prose description anywhere (0 mentions); (2) NO doc states the timeline/roadmap-lazy vs resource-map/goal-explicit split — the "lazy" prose vocabulary attaches only to research/research.md (and wrongly scopes it to L3/3+), README calls all seven docs "explicit-option", and EXTENSION-GUIDE:39 defines lazyAddonDocs as "command-owned or explicit-option files" (mixing both classes in one field, consistent with f-iter001-002).
- **CQ3 — ANSWERED**: partially — level-specifications.md:742 ("Any level ... Manual (optional)") + template-guide.md:195-200 (the render command) are the closest to contract-grade, but no prose states that resource-map.md is outside ALL seven level contracts; the extra-contract status is discoverable only by reading the manifest. → f-iter002-004's fix should land in BOTH the contract (add to lazyAddonDocs where produced) and prose (state the status).
- **CQ4 — ANSWERED**: YES — folder-structure.md:141-142 repeats the README-pattern claims verbatim ("validation warns when it is absent" / "created on request, skipped silently"), so any README fix must mirror in folder-structure §3.

## Questions Remaining

- Q4-Q8 (queued; next: Q4 — AC rules + Met-row reality in specs/ Level 2/3 packets).
- CQ1 (narrows): goal.md's render command / creation surface — no worked example in references; playbook assumes existence; phase-parent nested-goal binding still unadjudicated (angle 6).
- CQ2 (carried): the "validation warns when it is absent" claim now appears in BOTH README:154 AND folder-structure:141 — who warns? (angle 4/5: check-files.sh / orchestrator / metadata pipeline).
- CQ5 (NEW, carried): checklist.md — discovery-canonical (runtime/README.md:154) but manifest-absent (0 hits); is it a live completion surface anywhere? (angle 5).

## Ruled Out (do not retry)

- ro-iter003-001: "prose documents --with-lazy-addons somewhere outside create.sh" — ruled out by the mention census (only create.sh:153,282-283,1828 + golden test). [SOURCE: runtime/cli/spec/create.sh:153,282-283,1828]
- ro-iter003-002: "any level contract adds addons cumulatively (ladder model)" — ruled out: lazyAddonDocs arrays are byte-identical across L1/2/3/3+; the only per-level addon differences are AC-optional at 2/3/3+ and the packet-type drops. [SOURCE: templates/spec-kit-docs.json:182-191,565-570,1059-1064,1613-1618]

## SCOPE VIOLATIONS

None. Writes: `iterations/iteration-003.md`, `deltas/iter-003.jsonl`, `deltas/event-003.json` + gateway ledger/projection writes — all inside the lineage directory. No packet-level writes, no repo tooling.

## Next Focus

Iteration 4 — Angle 4: acceptance-criteria.md enforcement — read check-ac-closure.sh and check-ac-coverage.sh end-to-end (what each enforces: Met/Unmet/Waived/Superseded row grammar? evidence tracing into tasks.md? ADR cross-refs?); then sample Level 2/3 packets under specs/system-speckit/ (incl. packet 004 itself) for Met rows with evidence vs untouched scaffolds. Cross-check README:198's row-grammar claim and folder-structure:141's warn claim (CQ2 partial).

## Convergence telemetry (advisory only — stopPolicy=max-iterations)

newInfoRatio = 0.385 → NOT qualifying; consecutiveQualifying 0/3. Loop continues: 7 iterations remain, forced.
