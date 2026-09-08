# Research: Template System and Acceptance Criteria — ROUND TWO (post-remediation audit)

- Lineage: `deepseek-v4-flash-templates` · sessionId `fanout-deepseek-v4-flash-templates-1788761493727-f3q25r`
- Packet: `specs/system-speckit/035-spec-kit-simplification-research/004-template-system-and-acceptance-criteria`
- Executor: inline detached fan-out (this process; no nested dispatch) · loop: research · stopPolicy: max-iterations · **10/10 iterations, stopReason `maxIterationsReached`**
- Method: ground-truth-first verification of the 010-template-contract-alignment remediation against the checked-in tree (never validate.sh / node / git; dist/ stale and untracked), plus fresh-angle hunting for what round one (GLM 5.3 Flash, 35 findings, 15 P1/20 P2) missed, plus kept-row re-examination under the new-evidence rule. Angles 1-8 cover the remediation clusters; iteration 9 the surfaces round one covered once or not at all (`--sharded`, upgrade-level.sh, changelog/, stress-test/, privateTaxonomy); iteration 10 the final consistency sweep.
- Final tally: **34 findings — 0×P0, 6×P1, 28×P2**. Recommendations (primary verb): fix 26 · document 5 · remove 3. Full machine corpus: `findings-registry.json`; per-iteration evidence: `iterations/iteration-001..010.md` + `deltas/iter-*.jsonl`.

## 1. The headline (one paragraph)

The 010 remediation's machine-level claims are all true — `--with-goal` scaffolds goal.md at every creatable level, the acceptance-criteria decision is list-driven, the coverage enforce switch fails, the staleness checker reads the right manifest, and 16/16 template versions now agree with their markers. What the lane did not fix is the code and prose directly beside its changes: the completion-evidence sentinel still gates its entire evaluation on `statSync(checklist.md)` — a file retired by the same program — so the tasks-checklist enforcement the hooks README now describes never runs from the Stop hook (P1); the template guide still calls decision-record.md "Required Templates" at Level 3 three lines above its own "lazy add-on at every level" (P1); the extension guide says the lazy list is "the same at every level" when phase and review/research rows differ (P1); the lane's own acceptance-criteria.md scores 0/6 covered by the rule it shipped (P1); and `--sharded` — a flag no round-one pass ever examined — is help-advertised with a templates directory that does not exist, warning and touching empty stubs (P1). Round one's classes recur instead of being closed: doc-inclusion authority (still three-way, plus a duplicated continuity set that now disagrees with itself), golden coverage (the new flag is unpinned, exactly as the old four were), list-doc-set drift (ToC, auto-upgrade, template-source, the SKILL gate), and checklist.md (prose swept clean, code left behind). Nothing is P0: the enforcement machinery works; the program's repair work is real but stopped at the seams it did not look at.

## 2. Findings ledger (one row per finding)

Severity: P1 = wrong-or-unused (misleads or a capability is dead) · P2 = cosmetic/refinement. Action verbs: fix / document / merge / remove.

### P1 (6)

| ID | Where | The claim | What the enforcement side does | Action |
|---|---|---|---|---|
| f-iter001-001 | orchestrator.ts:82-91 vs spec-doc-structure.ts:202-213 | "the contract is the one authority" (010 summary) | OPTIONAL_CONTINUITY_DOCS is defined TWICE with 9 vs 10 members (only spec-doc-structure has acceptance-criteria.md); both feed the same `_memory`-required rule (orchestrator.ts:879, spec-doc-structure.ts:668) so the same file gets two different verdicts | fix (one shared constant; adjudicate AC's class) |
| f-iter002-001 | templates/EXTENSION-GUIDE.md:40 | "The list is the same at every level" | lazyAddonDocs: numbered levels identical (9 docs) but phase = 7 (drops debug-delegation, research/research.md), review/research = 6 (also drops goal.md) — spec-kit-docs.json:2170-2180, 2312-2322, 2430-2440 | fix (qualify) |
| f-iter003-001 | references/templates/template-guide.md:178 | "**Required Templates:** Level 2 + `decision-record.md`" | decision-record.md is lazy at every level (spec-kit-docs.json:182,565,1060,1615); create.sh scaffolds it only under --with-lazy-addons (:399); the same section's :225 says "lazy add-on at every level" | fix (drop the word Required) |
| f-iter004-001 | 010-template-contract-alignment/acceptance-criteria.md:22-28 | the lane that shipped "Cite file:line" | its own six Met rows name no `file:NN`; check-ac-coverage.sh:215-238 counts 0/6 covered, 6 malformed; SPECKIT_AC_COVERAGE_ENFORCE=true (branches :381-396) would fail this packet | fix (retro-cite with file:line) |
| f-iter005-001 | runtime/lib/hooks/completion-evidence-sentinel.cjs (evaluateCompletionEvidence) | hooks README:12: sentinel reads the tasks.md checklist via check-completion.sh | the path is gated on `statSync(checklist.md)` — retired, absent everywhere (spec-doc-paths.ts:17-29; goldens pin the retirement) — so check-completion.sh never runs from the Stop hook; verdictFromImplementationSummary only stats implementation-summary.md; the P0-evidence/priority-context machinery is unreachable | fix (gate on tasks.md's ANCHOR:protocol; delete the checklist.md branch) |
| f-iter009-001 | runtime/cli/spec/create.sh:284,332,1722-1762 | "--sharded — Create sharded spec sections (Level 3 only)" | templates/sharded/ does not exist (inventory of templates/); the block warns five times and `touch`es EMPTY stubs into spec-sections/; no manifest row, no reference doc, no validator knowledge | remove (flag + block + help rows), or restore templates/sharded/ + docs |

### P2 (28)

| ID | Where | One-line summary | Action |
|---|---|---|---|
| f-iter001-002 | resource-map.md.tmpl + both continuity sets | resource-map.md is now contract-lazy at every level but in neither OPTIONAL_CONTINUITY_DOCS copy and its template ships no `_memory` → every manual render warns FRONTMATTER_002 | fix (add to both sets, or ship `_memory`) |
| f-iter001-003 | spec-doc-structure.ts:196-199 | FREEFORM exemption comment "inert for Levels 1-3+ and phase parents" is false — research/research.md IS in numbered lazy lists and is exempted there | fix (comment) + document the exemption policy once |
| f-iter001-004 | spec-doc-structure.ts:224-237 | collectDocuments unions required+lifecycle+lazy but not optionalAddonDocs; AC rides an fs.existsSync special case — a future optional doc escapes validation | fix (union + present-addon filter) |
| f-iter001-005 | spec-doc-structure.ts:214,1011-1022 | goal.md has contract sectionGates (directive/completion/log[+binding]) but is not in LAZY_DOCS_WITH_STATIC_ANCHORS → goal anchors never required; decision-record's omission is deliberate (template-structure.js:470-487) | fix (add goal.md; document decision-record) |
| f-iter002-002 | EXTENSION-GUIDE.md:29-31 | field semantics: creationTrigger "the workflow that creates it" ≠ the values (scaffold/explicit-option/phase-scaffold/…); absenceBehavior enum still lists `warn` though no rule produces it (round-one CQ2) | fix (align descriptions; drop or justify warn) |
| f-iter002-003 | README.md:279 | "handover.md, debug-delegation.md, research.md and resource-map.md render through the workflow that owns them" — no workflow owns resource-map.md; only the manual inline gate renderer does | fix (split the sentence) |
| f-iter002-004 | spec-kit-docs.json:146-151 | documents[] "creationTrigger: scaffold" for acceptance-criteria.md is level-qualified reality (L2/3/3+ only; optionalAddonDocs :555/:1050/:1605) the index cannot express | document (qualify) |
| f-iter003-002 | template-style-guide.md:42 | "Lazy add-ons, every level" lists 6 docs — omits handover/debug-delegation/research/research.md; "every level" false at review/research | fix (add or label; qualify) |
| f-iter003-003 | README.md:184 | trigger row joins `--with-goal` (goal.md only) and the renderer (resource-map.md) into one two-by-two | fix (split the row) |
| f-iter003-004 | template-guide.md:182-200 | the per-level scaffold walkthrough never names either flag (4 other surfaces do) | document |
| f-iter003-005 | template-guide.md:758 + SKILL.md:494 | ToC-policy guide list (9 docs) vs check-toc-policy.sh:25-31 (7 docs) — disagrees in both directions | fix (mirror the rule) |
| f-iter004-002 | repo census | 157 AC files, 138 Met-bearing, 31 cite file:line (22%) — the malformed class persists; ENFORCE flips ~78% of Met-bearing packets to fail | document (floor is aspirational) |
| f-iter004-003 | template-structure.js:190-194 + check-template-source.sh:52-55 | TEMPLATE_SOURCE checks required docs only — the default-scaffolded AC and all lazy docs are invisible to the marker rule | fix (include optional + flag-scaffoldable) |
| f-iter004-004 | check-ac-coverage.sh:215,262 | has_file_line counts "at 09:05" and URL ports as file:line evidence | fix (require a path-like token) |
| f-iter005-002 | sentinel top comment | "checklist.md via check-completion.sh --json" — stale with the code fix | fix (same edit) |
| f-iter005-003 | README.md:199 | "enforced by check-completion.sh and the completion Stop hook" — the Stop hook leg does not evaluate the tasks checklist | fix (name the exposer) |
| f-iter005-004 | README.md:199 | "AC_CLOSURE … fails on an unmet criterion" — fails only when the packet claims completion (:345-361) | fix (qualify) |
| f-iter006-001 | goal-set-string-playbook.md:85 | "No command writes goal.md on its own" — falsified by the same section's item 1 (create.sh --with-goal) | fix (reword) |
| f-iter006-002 | SKILL.md:61 | gate list omits goal/before-after/timeline/roadmap (flag-owned) while including 3 command/workflow docs — RE-LIST of round-one f-iter002-005 (its disposition criterion no longer matches) | fix (add the four or re-scope) |
| f-iter006-003 | template-utils.sh:201-226 | _manifest_template_path cannot resolve research/research.md (looks for addons/research/research.md.tmpl; the file is addons/research.md.tmpl) | fix (key off documents[].template) |
| f-iter007-001 | check-template-staleness.sh:67-91 | the repaired checker compares ONE template (spec.md.tmpl via spec.md's marker); 15 of 16 versioned templates invisible to it | fix (per-document) or document |
| f-iter007-002 | templates/changelog/root.md:12, phase.md | changelog templates carry v1.0 markers, are guide-cited (template-guide:181-184), but have no manifest entry, no versions{} key, no parity coverage | document (declare untracked) or version |
| f-iter007-003 | check-template-staleness.sh:159-171 | --auto-upgrade doc set (5 docs) omits acceptance-criteria.md and goal.md | fix (add both) |
| f-iter008-001 | templates/README.md:103-116,138-143 | addons tree and KEY FILES omit goal.md.tmpl (15 vs 16 templates; example row `level_3+/` vs `level-3+/`) | fix (add the rows) |
| f-iter008-002 | spec-kit-docs.json:24-58 | privateTaxonomy/presets: zero consumers repo-wide — the last manifest region neither consumed nor declared inert | remove (or demote to a comment) |
| f-iter008-003 | scaffold-golden-snapshots.vitest.ts:76-118 | goldens pin only the lazy-4; --with-goal's rendered shape (and the fixed author slug) has no snapshot — round-one f-iter008-003's class recurred | fix (add goal golden + --with-goal case) |
| f-iter008-004 | templates/stress-test/ | findings-rubric.* has no consumer (retrieval-corpus path strings only) — orphan surface | remove (or rehome) |
| f-iter009-002 | template-version-parity.vitest.ts:72-77 | parity suite pins only the numbered lazy lists; phase (7) and review/research (6) shapes unpinned — the rows that changed most in 010 | fix (pin or assert the deltas) |

## 3. The consolidation ledger (drop/merge decisions)

Drops that lose NOTHING validated: (1) `--sharded` (help-advertised flag whose backend directory does not exist; the surface was already gone — the flag's removal is what's missing); (2) `privateTaxonomy` (zero consumers; presets derivable from levels); (3) `templates/stress-test/` (no consumer; corpus strings only). Fixes with payoff, in priority order: (1) the sentinel branch (enforcement surface 3 — the only machine-level break); (2) 010's own AC evidence (the showcase packet); (3) the two doc-level P1s (template-guide:178, EXTENSION-GUIDE:40); (4) the continuity-set unification + member realignment; (5) goal.md golden + anchor enforcement; (6) the doc-set drift family (ToC, TEMPLATE_SOURCE, auto-upgrade, SKILL gate); (7) templates/README tree; (8) the checker scope; (9) has_file_line; (10) resolution-path map for research/research.md. Everything else keeps a validated capability and needs document-level attention.

## 4. Ruled-out directions (negative knowledge, 22 entries)

Every machine-level 010 claim verified true (flag, AC list decision, enforce switch, staleness path, parity, resolver consumer, playbook paths, SKILL:65 resource-map, ENV rows, phase-parent AC exemption, upgrade-level no-goal-staleness, templates/sharded absent-not-untracked, root README sharded-free, no live checklist.md claim survives, no cross-finding contradiction). Full list: `findings-registry.json` ruledOut[]; per-iteration detail in iterations/iteration-001..010.md.

## 5. Convergence report

- Stop reason: **maxIterationsReached** (stopPolicy=max-iterations; convergence treated as telemetry only — newInfoRatio fell 1.0 → 0.444 → 0.417 → 0.364 → 0.308 → 0.214 → 0.273 → 0.222 → 0.167 → 0.0 and never reached 3 consecutive ≤0.05 before the cap; the loop did not stop early).
- Total iterations: 10/10 (files `iterations/iteration-001.md`–`iteration-010.md`; 10 `type:iteration` records in `deep-research-state.jsonl`; per-iteration deltas in `deltas/`).
- Questions: 8/8 charter angles answered (RQ1-RQ8) plus 9 carried questions (CQ-001..CQ-009) closed or scope-noted; 1 amendment chain (round-one f-iter002-005 → f-iter006-002, re-listed with new evidence).
- Yield: 34 findings (6 P1 / 28 P2), 22 ruled-out directions, ~55 distinct files cited, 1 amended round-one row, 5 recurring round-one classes documented as such.

## 6. Non-goals honored

No file edits outside this lineage; no new templates; no prose-style review; no implementation (fixes are the maintainers' follow-up); no repo tooling runs (no generate-context.js / validate.sh / node tooling / git writes); dist/ never trusted (check-in source only).
