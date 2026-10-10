# Iteration 13: sk-code-webflow fresh pass

## Focus

Part 3, second surface: the Webflow packet's scripts and fixtures after the checker fix, the templates and assets the resource map loads, and the package's section cross-references against the split reference tree. This follows iteration 12's Recommended Next Focus.

## Actions Taken

1. Verified every path the Webflow `SKILL.md` names (104 backtick paths) against disk.
2. Ran the runtime checker inside both shipped fixture roots and captured exit status with the pipeline removed, then re-ran it with no fixture root to check the no-files path.
3. Swept the template assets for legacy path families and section cross-references.
4. Followed the HTML style guide's section pointers into the JavaScript references to test their targets.

## Findings

1. **The Webflow template assets still carry the legacy path family in their instructional comments.** Nine rows across five files: `component-template.css:8`, `component-template.js:7`, `embed-template.html:6,80`, `form-scaffold-template.html:7,202,203,204`, and `head-footer-code-template.html:8` all cite `references/webflow/...` [SOURCE: .skilled/skills/sk-code/sk-code-webflow/assets/templates/component-template.js:7] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/assets/templates/form-scaffold-template.html:202]. The hub has no `references/webflow/` tree; the live guides are `sk-code-webflow/references/{javascript,css,html}/...` [SOURCE: .skilled/skills/sk-code/ROUTER.md:504]. These are files shipped to be copied into projects, so the dead pointers travel with the scaffold. Reproducing case: `rg -n "references/(webflow|css|javascript|html)" .skilled/skills/sk-code/sk-code-webflow/assets/templates/` prints nine rows; `test -d .skilled/skills/sk-code/references/webflow` returns no. NEW, P2 (same family as f-iter002-001, but on the Webflow packet's shipped assets rather than the shared tier).
2. **The HTML style guide points at a section that lives in another file and a section number that no longer exists.** Line 78 says Action Routing Pattern is in `javascript/quality-standards/init-dom-error-and-async.md §13` [SOURCE: .skilled/skills/sk-code/sk-code-webflow/references/html/style-guide.md:78], but that file's headings stop at §5 Async Patterns, and the `Action Routing Pattern` heading lives in `shared-listener-and-weakmap.md` [SOURCE: .skilled/skills/sk-code/sk-code-webflow/references/javascript/quality-standards/shared-listener-and-weakmap.md:91]. The same claim is carried in the shipped template as `references/webflow/javascript/quality-standards.md §13 Action Routing Pattern` [SOURCE: .skilled/skills/sk-code/sk-code-webflow/assets/templates/embed-template.html:80]. Reproducing case: `rg -n "Action Routing Pattern" .skilled/skills/sk-code/sk-code-webflow/references` prints the pointer at html/style-guide.md:78 and the heading at shared-listener-and-weakmap.md:91, and `rg -n "^## 13" references/javascript/quality-standards/init-dom-error-and-async.md` exits 1. NEW, P2 (cross-file section pointer broken by the reference split).
3. **The HTML style guide also misnumbers the JavaScript quick reference's form-validation section.** Line 103 cites `javascript/quick-reference.md §10 Form Validation Classes` [SOURCE: .skilled/skills/sk-code/sk-code-webflow/references/html/style-guide.md:103] while the section is §5 in the current file [SOURCE: .skilled/skills/sk-code/sk-code-webflow/references/javascript/quick-reference.md:268]. The template's own §5 label is correct, so the guide and the template disagree about the same target. Reproducing case: `rg -n "Form Validation Classes" .skilled/skills/sk-code/sk-code-webflow/references/javascript/quick-reference.md` prints §5, and the guide's §10 pointer resolves to no such heading. NEW, P2 (same split-renumbering class as Finding 2).
4. **The D1 fix and its fixture pairs run to their documented verdicts.** From `runtime-fixture/known-bad`, the checker reports `Failed: 4/4` and exits 1; from `known-good`, all pass and it exits 0; with no `src/2_javascript/z_minified` under the working directory it prints "No minified files found" and exits 1. The checker reads no argv, matching the README's "run from `known-bad/`" instruction [SOURCE: .skilled/skills/sk-code/sk-code-webflow/assets/scripts/README.md:72], and a path argument is ignored rather than misapplied. ALREADY-ADOPTED, P2, no action; this closes round one's D1 residual with an observed receipt.

## Questions Answered

- Part 3's Webflow leg is mapped: the checker residual is closed; the defects are documentation pointers in the guides and shipped templates.

## Questions Remaining

- `sk-code-opencode`, `sk-code-obsidian`, the hub files, `benchmark/` and the root playbook.

## Ruled Out

- **"File the missing argv support as a defect."** The README documents the cd-based usage, and the no-files path exits 1, not 0; no green-without-check path exists.
- **"File the runtime fixtures' location."** They live under `assets/scripts/runtime-fixture/` exactly as the README row states.
- **"Treat the template legacy pointers as harmless comments."** They are the shipped instructions a project adopter reads first; iteration 2 filed the same family as a defect.

## Dead Ends

- All 104 SKILL-named Webflow paths resolve; no orphan or missing resource in this packet.
- The Motion overlay's `references/animation/*` tree is consistently named across the SKILL and the router; no `motion_dev/` residue in this packet's live files.

## Edge Cases

- Ambiguous input: whether `§13` in the HTML guide refers to a historical monolithic file. Chosen interpretation: either way the pointer is dead today, which is the defect.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/sk-code/sk-code-webflow/SKILL.md`
- `.skilled/skills/sk-code/sk-code-webflow/assets/templates/{component-template.css,component-template.js,embed-template.html,form-scaffold-template.html,head-footer-code-template.html}`
- `.skilled/skills/sk-code/sk-code-webflow/assets/scripts/README.md`
- `.skilled/skills/sk-code/sk-code-webflow/assets/scripts/test-minified-runtime.mjs`
- `.skilled/skills/sk-code/sk-code-webflow/assets/scripts/runtime-fixture/known-bad/`
- `.skilled/skills/sk-code/sk-code-webflow/assets/scripts/runtime-fixture/known-good/`
- `.skilled/skills/sk-code/sk-code-webflow/references/html/style-guide.md`
- `.skilled/skills/sk-code/sk-code-webflow/references/javascript/quick-reference.md`
- `.skilled/skills/sk-code/sk-code-webflow/references/javascript/quality-standards/{init-dom-error-and-async.md,shared-listener-and-weakmap.md}`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/lineages/r3-dsflash-llmgw/steer.md`

## Assessment

- New information ratio: 0.85 (three fully new findings, one ALREADY-ADOPTED receipt closing D1's residual).
- Questions addressed: Part 3 Webflow leg.
- Questions answered: none fully.

## Reflection

- What worked and why: running the checker inside the fixture roots and stripping the pipeline before reading the exit status. The earlier piped runs reported `tail`'s status; the corrected runs produced the documented verdicts.
- What did not work and why: "exit 0 is correct for no files" was wrong — the no-files path exits 1; the mistake was mine, caught by re-running without the pipe.
- What I would do differently: never read an exit status through a pipeline again; capture it directly or with `pipefail`.

## Recommended Next Focus

`sk-code-opencode`: the router-sync guard's wired legs, the alignment references, and any drift between the SKILL's claims and the scripts.
