# sk-create-skill readability review (fresh Opus, read-only)

Paths are relative to `.skilled/skills/sk-doc/` unless they start with `.skilled/`, `.github/` or `specs/`. C = confirmed by the reviewer, I = inferred.

Orchestrator spot-checks, all held: SKILL.md:93 gate without `--strict`; creation-workflow.md:335 "frontmatter only"; `system-deep-loop/runtime/references/integration-points.md:151` render_h2_numbering ungated; no `.github/workflows` file runs validate_document or package_skill; only the routing-shape ledger has a ratchet test; skill-md-template.md:314 and :400 carry two REFERENCES sections; validate_document.py:1117-1121 matches "related" as a substring.

Grounding: 57 consolidated 066 findings.md files hold 1,764 findings. By rubric rule: r7 packed paragraph 377, r1 template 303, r4 overview missing Purpose/When to Use 299, r3 intro 217, r9 progress tokens/ids 161, r5 decision order 151, r8 index completeness 112, r2 render 108, r10 numbering 61. 121 review verdicts: 73 FIX, 48 PASS.

## P1

1. Overview subsection check (C). r4 is the largest mechanical class (239 on references). template-rules.json gives references only requiredSections ["overview"]; an OVERVIEW without `### Purpose` raises nothing. 80 of 479 references opening with OVERVIEW lack `### Purpose`. skill-reference-template.md:20-36 and skill-asset-template.md:18-20 break their own skeleton yet validate at 0. Change: add `render_overview_subsections` to shared/scripts/validate_document.py (reference: Purpose then When to Use; asset: Purpose then Usage); seed current hits into render-known-debt.json or fix them; restructure both templates' OVERVIEW. Verify: fixture fires and clears; both templates validate 0.

2. One strict completion gate (C). sk-create-skill/SKILL.md:93 and :246 run validate_skill_package.py without --strict, which runs package_skill.py --check where render findings stay warnings (validate_skill_package.py:264-270). creation-workflow.md:329-331 names package_skill.py --check --strict; :335 says "The gate reads resource frontmatter only", stale since package_skill.py:280 promoted "render check". Change: one command, `validate_skill_package.py <path> --strict`, in SKILL.md Validation, creation-workflow Step 6, README; drop the stale framing. Verify: grep returns one form.

3. Wider scan and CI (C). _render_findings reads only references/ and assets/ (package_skill.py:138, 941-960). template-rules.json opts SKILL.md and ROUTER.md into renderChecks but packaging never validates them; README has no renderChecks. Hub shared/ trees (sk-code/shared/references, sk-doc/shared/references, cli-external-orchestration/shared/references) and system-deep-loop/runtime/references are never scanned. Live ungated finding: system-deep-loop/runtime/references/integration-points.md:151. No workflow runs validate_document or package_skill. Change: scan SKILL.md, ROUTER.md and hub shared/ trees; add a CI sweep of .skilled/skills with the ledger applied. Verify: sweep reports integration-points, then 0 once fixed.

4. Render ledger ratchet (C). routing-shape ledger has sk-create-skill/scripts/tests/routing-shape-known-debt-ratchet.test.cjs run by .github/workflows/routing-registry-drift.yml:198-203. render-known-debt.json:2 "never raise one" has no test and no frozen fixture. Change: render-known-debt-ratchet.test.cjs with a frozen fixture covering debt counts and exempt keys. Verify: raising a count fails.

5. One exempt mechanism (C). Three copies: validate_document.py:186-195 and :253-258 skip all validation with no consumer; package_skill.py:886-921 skips render only; 066 scope-gate.py re-implements. Validator CLI ignores the map (deep-research-dashboard.md still reports render_h2_numbering) while rubric.md:3 tells reviewers to drive render warnings to zero. Doc keys never checked for existence; consumer only has to exist, not name the doc. Unlisted pinned consumers: sk-code/sk-code-review/scripts/check-rule-copies.js:55-118 pins strings in sk-code/shared/references/universal/code-quality-standards.md and review-core.md. Change: one loader in shared/scripts; validator labels exempt findings with consumer; fail on missing doc key or consumer that does not contain the doc's name; advisory `pinned` scan keyed on read calls (readFileSync/open/read_text) of literal .md paths. A naive path-mention scan gave 75 hits, mostly pointers (C); whether keying on read calls suffices is I.

6. Ship the rewrite guard (C). 237 review findings: dropped content ~87, changed code blocks 47, cited section numbers 37, intros 29, frontmatter 18. Guards live only in specs/sk-doc/066-skill-readability-refinement/010-sk-prompt/scratch/tools/ (lost-lines.py, intro-diff.py, code-blocks.py, citations.py, frontmatter-diff.py, inbound-anchors.py, scope-links.py). sk-create-skill/references/skill/examples-and-maintenance.md:166-174 Update Workflow has no safety step. Change: shared/scripts/doc-rewrite-guard.py --base <ref> <paths>; hard: frontmatter unchanged but version, fenced blocks byte-identical, citations kept, cited H2 numbers/anchors kept, exempt and pinned docs untouched; advisory: lost lines, intro diff. Add a "refine existing docs" step to Update Workflow and creation-workflow. Verify: replay one 066 FIX diff and the guard flags it.

## P2

7. Section reference check (C). 22 findings, mostly P1, where §N / Section N points at a missing or wrong section (system-deep-loop/deep-research/SKILL.md:229 "see §8 EXAMPLES"; deep-review/references/protocol/loop-state-and-gates.md:93). Change: render_section_reference; in-file §N must match an H2 number and title; resolve `file.md §N` with the inbound-anchors.py regex.

8. Intro template contradictions plus checks (C). skill-reference-template.md:77 and skill-asset-template.md:134 say `description: [One-line description - same as intro]`, yet ~23 findings flag intro repeating description. Templates call the intro a "hook/summary" (:89, asset :146) and say it states "what this reference covers" (:176); rubric.md:4 says a pointer is not a hook; 75 pointer intros and 66 missing intros. _render_intro_restates_purpose compares whole intro to first Purpose sentence (validate_document.py:1250-1265); a two-sentence intro copying Purpose verbatim raised nothing. Change: templates say description and intro differ, drop "summary", list bad pointer phrases; checks render_intro_missing, render_intro_pointer (closed phrase list from rubric.md:4), and per-sentence restate check against Purpose and description.

9. README first section, then README render checks (C). template-rules.json readme firstSectionName overview; sk-create-skill/assets/skill/skill-readme-template.md:183 and parent-skill-readme-template.md:148 open with AT A GLANCE; sk-create-readme/assets/readme-template.md:177 opens with OVERVIEW. Dry run with renderChecks on 54 skill/mode READMEs: 52 render_section_order, all from this mismatch. OPERATOR DECISION: OVERVIEW. Then renderChecks true for readme; extend _code_folder_has_flat_inventory (validate_document.py:1648-1662) to "WHAT IS IN THE PACKAGE" and structure trees (r8 had 59 README findings).

10. One REFERENCES section (C). skill-md-template.md has `## 5. REFERENCES` (:314) and `## 8. REFERENCES AND RELATED RESOURCES` (:400); scaffold stops at `## 7. INTEGRATION POINTS`; fleet's last H2 splits 27/10/9. Change: one section, last, same name in template, skill-scaffold-template.md and rules.

11. render_section_order substring false positive (C). validate_document.py:1119-1121 matches "related" anywhere (RELATED SPECS, UNRELATED CHANGES, CORRELATED SIGNALS). Pushed a heading rename in system-spec-kit/references/templates/level-specifications.md:649. Change: match only a leading related token or the alias set.

## P3

12. One SKILL.md size table (C). skill-md-template.md:41 <1000 lines, :425 800-1000, :981 three bands; creation-workflow.md:436 "800 words"; package_skill.py:103 3000 lines; largest fleet SKILL.md 529 lines. Change: one table generated from script constants.

13. Small check defects (C). bold_label_join flags a two-space hard break; h2_numbering calls `7.1` "Unnumbered"; gaps and duplicates (## 1, ## 3, ## 3) not caught; stale-debt message never promoted because "render known-debt" lacks the "render check" marker.

14. Fence-aware SKILL.md section scan (C). package_skill.py:461-462 reads every `## ` line including fenced ones, hence the `\##` escape (common-pitfalls.md:33); templates mix escaped and unescaped (skill-reference-template.md:93 vs :180); a fenced example heading can satisfy required sections. Change: use _fenced_spans (:1202), retire `\##`.

Not worth checks (C): progress tokens (TODO/WIP/TBD 69 hits, mostly legitimate; only a specs/<track>/<NNN> path regex is precise, 8 hits); packed paragraphs stay a judgment call.

## Keep as is
Render checks skip fences and frontmatter; packaging imports the one shared validator; findings stay warnings until strict; ledger fails closed; exempt entries need a reason and an in-root consumer; reference skeleton block (skill-reference-template.md:169-233) is the right shape; checks are quiet (6 findings across 8,175 docs, 5 on exempt docs).

## Operator decisions (2026-11-05)
- Scope: all of P1-P3.
- Spec folder: child of 066 (this packet).
- Skill READMEs open with OVERVIEW.
- Docs whose strings code pins: protect from rewrites, render checks still run (a `pinned` list, not the exempt map).

## Open questions
- Are the 80 references without `### Purpose` deliberate (frozen by inbound references) or missed? Not sampled.
- Is leaving hub shared/ trees out of packaging deliberate? Nothing found says so.
