# Iteration 008 — Residue sweep and the merge/drop ledger (RQ8)

- Angle: what the remediation left behind in the template tree itself — inventories, unexercised manifest sections, unanchored surfaces — and which surfaces could merge or drop now.
- Verdict: three leftovers with names; one class recurrence; two clean confirmations. The 010 lane touched templates/README.md and still omitted the template it was fixing there; privateTaxonomy is now the only manifest region with zero consumers anywhere in the repo; the golden suite still pins only the lazy-4, so the flag that just shipped has no snapshot; stress-test/ is corpus content only. The retired checklist.md sweep is COMPLETE (the only remaining mention is a correct historical-preserve list); CONTRACT.md:41 is accurate; MIGRATION.md's co-location comment is fixed.
- Findings: 4 (all P2). Tool calls: 7/12.

## Findings

### f-iter008-001 [P2] — templates/README.md's addons tree and KEY FILES omit goal.md.tmpl
- THE CLAIM: `templates/README.md:103-116` (directory tree) and :138-143 (KEY FILES) — the addons inventory.
- WHAT THE CODE DOES: the tree lists 9 addon templates (acceptance-criteria, decision-record, handover, debug-delegation, research, resource-map, before-after, timeline, roadmap) — goal.md.tmpl is absent although it exists (templates/addons/goal.md.tmpl, read at :1-119) — 4+9+2 = 15 templates in the README vs the 16 the manifest versions{} and the root README:178 declare. The KEY FILES table (:138-143) also omits goal.md. The example row :110 also names `level_3+/` while the directory is `level-3+/` (examples/: ls).
- VERDICT ON 010: the summary's own Files Changed list says templates/README.md was modified — the fix landed everywhere except the one tree row for the very template the lane flagged and corrected (goal.md.tmpl author slug).
- SEVERITY: P2 (inventory misdirection in the template-package's own README; the count is wrong by one).
- RECOMMENDATION: fix — add goal.md.tmpl to the tree and KEY FILES; correct `level_3+/` → `level-3+/`.

### f-iter008-002 [P2] — privateTaxonomy is the last manifest region with zero consumers
- THE CLAIM: spec-kit-docs.json:24-58 — `privateTaxonomy` (kinds: implementation/phase-parent/review-record; capabilities: qa-verification/architecture-decisions/governance-expansion; presets: 1/2/3/3+/phase/review/research) — and CONTRACT.md:35-38's boundary note ("It must not expose private taxonomy in command help, generated packet files, agent prompts or policy docs") implying live use.
- WHAT THE CODE DOES: repo-wide grep for `privateTaxonomy` (runtime sources, references, scripts, non-fixture JSON) returns the manifest itself and none else — zero consumers, same class as the `documents[]` index the 010 lane demoted to descriptive (and documented as such). After that demotion, privateTaxonomy is the only manifest region neither consumed nor declared inert.
- SEVERITY: P2 (dead manifest data; 020 of the class round one graded P1 for documents[] because prose claimed enforcement; here no prose claims it — inert by silence).
- RECOMMENDATION: remove or document — either delete it (the presets are derivable from the levels) or add an inline comment "descriptive, not consumed" like the documents[] note in EXTENSION-GUIDE.

### f-iter008-003 [P2] — golden snapshots still pin only the lazy-4; the goal flag is unpinned
- THE CLAIM (010 verification): "Goldens, resolver, parity and invariance suites — PASS, 22 tests" with --with-goal exercised only by --path smoke scaffolds.
- WHAT THE CODE DOES: scaffold-golden-snapshots.vitest.ts:76-94 renders each lazy addon template for its anchor structure (before-after/timeline/roadmap/decision-record); :98-118 scaffolds with `--with-lazy-addons` only; 'goal' appears ZERO times in the test. So the newest flag's rendered shape (IF wrapper, directive/completion/log/binding anchors, memory-block frontmatter with the fixed author slug) has no snapshot: a future template edit that breaks the goal render surfaces only in the smoke path, which is not in the test suite.
- VERDICT: round one's f-iter008-003 (goldens covered only the flag-4 → exactly the drifted templates were untested) recurred for the newest flag — the class was recorded, not fixed, and the new feature inherited it.
- SEVERITY: P2 (shape-drift detection gap; the parity suite covers version drift, not rendered shape).
- RECOMMENDATION: fix — add goal.md to the golden lazy-anchor set and a `--with-goal` opt-in scaffold case.

### f-iter008-004 [P2] — templates/stress-test/ is an unanchored surface: no consumer, no manifest entry
- THE CLAIM: templates/stress-test/ exists in the template tree (templates/README.md:111 lists it next to changelog/ and scratch/).
- WHAT THE CODE DOES: its files (findings-rubric.schema.md, findings-rubric.template.json, findings.template.md) are referenced by NOTHING in runtime/, references/, README.md, SKILL.md or any guide (repo grep: only retrieval-corpus fixture strings in runtime/cli/retrieval/fixtures/* list the path as corpus content). No manifest entry, no version, no create.sh path, no test import. It is corpus content by accident of path, not a template surface.
- SEVERITY: P2 (dead weight in the template package; a maintainer counts 16 templates by manifest but sees 4 more surfaces — README:111, changelog/, stress-test/, scratch/).
- RECOMMENDATION: remove or document — move findings-rubric.* to wherever its consumer lives (deep-review assets?) or note it as tooling assets, not templates; keep scratch/ out of the tree listing.

## Confirmations (sweep clean)

- checklist.md retired-name sweep: COMPLETE — only rename-pattern.md:49 ("Historical spec docs… /checklist.md/ PRESERVE") remains, which is a correct historical note; SKILL.md:196 / root README:641 mention `spec-folder-authoring-checklist.md`, a DIFFERENT real file (references/workflows/spec-folder-authoring-checklist.md — exists, verified).
- CONTRACT.md:41 — "Provides the closure-gating acceptance criteria document for Levels 2, 3 and 3+" — accurate; the old "required addon" phrasing round one cited is gone.
- MIGRATION.md:12-14 — "Lives beside spec-kit-docs.json under templates/…" — true (f-iter009-002 landed).
- context-index.md: no residual consumer in any scoped surface (only database `context-index.sqlite` internals, unrelated).

## Merge/drop ledger (round-two update; supersedes nothing, adds entries)

| Surface | Round-one verdict | Round-two update |
|---|---|---|
| documents[] | demoted to descriptive (EXTENSION-GUIDE) | Stays; now mostly truthful — only the level-qualified acceptance-criteria "scaffold" value needs a qualifier (f-iter002-004) |
| checklist.md prose | retired everywhere | COMPLETE — no live claims remain |
| privateTaxonomy | not examined in round one (angle 1 focused on documents[]) | Dead section — remove or comment (f-iter008-002) |
| stress-test/ | not examined | Orphan surface — remove or rehome (f-iter008-004) |
| changelog/ | not examined | Version-untracked but guide-documented — version it or exempt it (f-iter007-002) |
| sentinel checklist.md branch | "docs fixed" | CODE left behind — the real fix is here (f-iter005-001, P1) |

## Ruled out (this iteration)
- one more live `checklist.md` claim survives the 010 sweep: RULED OUT — the only genuine mention is the correct historical-preserve row.
- templates/README's tree count discrepancy is a cosmetic typo: RULED OUT as a typo — it is an inventory omission (goal.md.tmpl), with a real count claim (15 vs 16).
