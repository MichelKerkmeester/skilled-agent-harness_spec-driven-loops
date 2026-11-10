# Iteration 4: Q4 — What the validators already check, and which concise-format failures are mechanically detectable

## Focus

Q4. Establish what `validate_document.py` and `hvr_scan.py` check today for changelog entries, then decide, per concise-format failure mode named in the brief, whether a mechanical check is possible, where it would live (function plus line), and whether it discriminates between the short entry (must pass) and the long one at `bc28fcbbba` (should fail). No re-derivation of Q1–Q3.

Path note: `hvr_scan.py` is not in the changelog path and not under `shared/`. It lives only at `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py` (641 lines). Findings 8 and 10-H below settle what that means for Q4.

## Actions Taken

1. Read config, state log (9 lines) and strategy; confirmed Q4 open and the "next focus" pointer, plus 17 BLOCKED approaches to avoid (no keyword-grep method, no re-derivation of Q1/Q2, no reading the YAMLs for a length rule again).
2. Located `hvr_scan.py` by `find .skilled -name "*hvr*"` — one hit, in the human-voice packet; no copy under `shared/`.
3. Grepped `validate_document.py` (3277 lines) for `changelog`, then read the changelog region 2540–2740 in full, plus `template-rules.json` 445–510, plus the dispatch site 3035–3060.
4. Read `validate_general_structure` (664–730), `validate_render_checks` head (1676–1710) and the section finder inside `validate_required_sections` (1815–1849).
5. Grepped both validators and the rules file for any length/ceiling vocabulary (`maxLines|max_length|ceiling|maxWords`) — zero hits in either.
6. Grepped the repo for any invocation of `hvr_scan.py` outside its own packet (scripts, YAML, docs).
7. Measured the two entries with a script: line totals, H4 totals, per-section H4 maxima, max H4 body word count, `(Level N)` presence, and the existing test-count regex's hit count on each.

## Findings

### What is already checked

1. **Document type is decided by folder, before the filename.** A path containing `/changelog/` returns `('changelog', 'rule')`, and only then does the type-specific code run. [SOURCE: .skilled/skills/sk-doc/shared/scripts/validate_document.py:305-310]

2. **Only entry-shaped files get the changelog checks.** `CHANGELOG_ENTRY_NAME` matches `v\d+(\.\d+){1,3}.md` or `changelog-*.md`; a `README.md` in the same folder keeps only the generic structural rules. [SOURCE: .skilled/skills/sk-doc/shared/scripts/validate_document.py:2554-2558] Both changelog validators early-return on this gate [SOURCE: .skilled/skills/sk-doc/shared/scripts/validate_document.py:2617-2618] [SOURCE: .skilled/skills/sk-doc/shared/scripts/validate_document.py:2697-2698]

3. **Five frontmatter checks, all blocking**: block missing, block unclosed, any required key missing, `trigger_phrases` declared but empty, and a version file with no phrase naming its version. [SOURCE: .skilled/skills/sk-doc/shared/scripts/validate_document.py:2604-2677] The required-key list is read from the rules file, not hardcoded: `title, description, trigger_phrases, importance_tier, contextType`. [SOURCE: .skilled/skills/sk-doc/shared/assets/template-rules.json:492-499]

4. **Content checking is exactly two regexes, both `warning` severity.** `CHANGELOG_INTERNAL_ID` matches `[A-Z]{2,4}-\d{3}` or `T\d{3}` minus the algorithm-name prefixes (`SHA`, `AES`, `RSA`, `CRC`, `DES`); `CHANGELOG_TEST_COUNT` matches `\b\d+\s+(?:cases|tests|PASS lines)\b`. [SOURCE: .skilled/skills/sk-doc/shared/scripts/validate_document.py:2675-2684] The frontmatter block and every `>` line are exempt, and inline code spans are masked before the match. [SOURCE: .skilled/skills/sk-doc/shared/scripts/validate_document.py:2701-2709] Two warnings is the entire body-level contract enforcement in the repository today.

5. **No length rule exists anywhere.** Greps for `maxLines|max_length|ceiling|maxWords` over `validate_document.py` and `template-rules.json` return zero hits, and the changelog block declares no length key between its section lists and its frontmatter contract. [SOURCE: .skilled/skills/sk-doc/shared/assets/template-rules.json:451-502] This extends iteration 3's finding (no ceiling in the command YAMLs) to the validator side: nothing in the pipeline measures an entry's size.

6. **`h2DividerRequired: true` is inert for changelogs.** The check collects H2s matching `^##\s+(\d+)\.\s+(.+?)\s*$` whose title is caps-only. [SOURCE: .skilled/skills/sk-doc/shared/scripts/validate_document.py:677-682] A changelog H2 is unnumbered title case (`## What's New at a Glance` [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:39]), so the rule declared for this type [SOURCE: .skilled/skills/sk-doc/shared/assets/template-rules.json:487] can never fire on a conforming entry.

7. **Section rules are inert twice over.** `requiredSections` is empty, so nothing can be required [SOURCE: .skilled/skills/sk-doc/shared/assets/template-rules.json:453]; and the finder that would check it only scans `^## \d+\.\s+[^\n]+` [SOURCE: .skilled/skills/sk-doc/shared/scripts/validate_document.py:1834], which an unnumbered changelog H2 cannot match. Populating `requiredSections` alone would change nothing.

8. **Every render check is skipped for entries.** `validate_render_checks` returns `[]` when `renderChecks` is absent and `sectionReferenceChecks` is false [SOURCE: .skilled/skills/sk-doc/shared/scripts/validate_document.py:1686-1689], which is the changelog configuration [SOURCE: .skilled/skills/sk-doc/shared/assets/template-rules.json:501]. So the bold-label-join, setext, bare-url, repeated-label, H2-sequence and section-citation checks never run on an entry. [SOURCE: .skilled/skills/sk-doc/shared/scripts/validate_document.py:1693-1705]

9. **`hvr_scan.py` is not part of the changelog pipeline at all.** It is a prose scanner for the human-voice standard: it parses `hvr-rules.md` at run time rather than carrying term lists [SOURCE: .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py:55-58], and its own docstring limits it to "punctuation bans, the hard blocker words of section 6, the phrase blockers of section 7, and the soft deductions of section 8", explicitly excluding structural and voice findings that need a reader. [SOURCE: .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py:15-21] A grep for `hvr_scan` across `.skilled/skills/sk-doc` and `.skilled/commands` finds only that packet's own changelog entries, references and playbook pages — no invocation from the changelog skill, the command YAMLs or `validate_document.py`. It has no changelog mode, no section model and no length model, so Q4's answer for `hvr_scan.py` is: nothing to extend, and adding one would duplicate a validator whose whole design is type-agnostic prose.

### Measured discrimination baselines

10. **The two entries separate cleanly on four mechanical measures, and not at all on the fifth.**

| Measure | Short (must pass) | Long (should fail) | Existing check |
|---|---|---|---|
| Total lines | 197 | 339 | none |
| H4 (`####`) count | 22 | 38 | none |
| Max H4 per section | 5 (`Doctor Commands`) | 7 (`Runtimes and Fixes`) | none |
| Max H4 body words | 80 (`Your Answers Reach the Decision Record`) | 148 (`Router Tooling Follows the Phrases It Ships`) | none |
| `(Level N)` on spec line | absent | present | none |
| `CHANGELOG_TEST_COUNT` hits | 0 | 0 | exists, catches neither |

The existing test-count regex misses both versions: the short entry writes the count as a word (`Sixteen render checks` [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:171]) and the long version's accounting does not use the regex's vocabulary either. [INFERENCE: measured by running the regex from validate_document.py:2683 over both files; short figures from the file, long figures from `git show bc28fcbbba:.skilled/changelog/skilled/v4.0.1.0.md`]

### Checkability verdict per failure mode

11. **At-a-glance presence and size: mechanical.** A count-ratio test discriminates where presence alone does not, because the long version has the section too (`## What's New at a Glance` at long line 50). Short: 8 bullets against 22 H4s (8 ≥ ⌈22/4⌉ = 6, passes). Long: 8 bullets against 38 H4s (8 < ⌈38/4⌉ = 10, fails). The short entry's section is at line 39 with 8 bullets. [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:39-48] Implementation: a new `validate_changelog_shape(content, file_path)` beside `validate_changelog_omissions` and called from the `doc_type == 'changelog'` branch [SOURCE: .skilled/skills/sk-doc/shared/scripts/validate_document.py:3049-3051]; the H2 normalisation already exists as `normalize_section_name`. Severity should start at `warning`, because a small release legitimately has no at-a-glance list.

12. **At-a-glance bullet order: not mechanically checkable today, and no validator edit can make it so.** The bullets' bold leads are prose, not section names — `**Each skill keeps its router in its own file.**` sits under `## Skill Routing`, `**More requests reach the right skill.**` under the same section. [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:41-48] Mapping bullet to section needs semantics. This is a template dependency for Q5: order becomes checkable only if the template makes each bullet declare its section (a bold section-name prefix or a trailing section tag), after which a monotonic-index check over the emitted section order is trivial. Recording it as a constraint, not a defect.

13. **H4 item-count ceiling: mechanical.** Total ≤ 26 passes short (22) and fails long (38); per-section ≤ 5 passes short (max 5) and fails long (max 7 with three sections at 5+). Both belong in the new `validate_changelog_shape` with module-level constants next to `CHANGELOG_ENTRY_NAME` [SOURCE: .skilled/skills/sk-doc/shared/scripts/validate_document.py:2558] and can reuse `_fenced_line_numbers` for masking.

14. **H4 narrative length: mechanical.** Cap the words in an H4 body at 90: short's longest is 80, long's is 148. Fenced code and bullet lists must be excluded from the count (the short entry's longest H4 body by bullet count is a 16-item list [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:173-178]), and severity must be `warning` — one long paragraph can be legitimate in a legal entry.

15. **Folded small fixes: heuristic, and good enough at `warning`.** Detector: inside one H2, if there are ≥ 5 H4s and ≥ 3 of them have a bullet-less body under 30 words, emit `changelog_unfolded_fixes`. Test: the short `## Runtimes and Fixes` has 2 H4s, one prose and one 4-item list under `#### Smaller Fixes` [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:146-158], so it does not trigger; the long version's same section splits the same fixes into 7 separate H4s [INFERENCE: `git show bc28fcbbba:...` section `## Runtimes and Fixes`, headings at lines 258-278], so it does. This check also needs the template to supply a canonical fold heading, which Q2/Q5 own.

16. **"Upgrade notes ordered by section": the premise needs an attribution rule the format does not state — this is a contradiction in the brief, recorded rather than halted (no operator present).** Under a literal reading the short entry's upgrade list is not monotonic: `Callers of sk-design-fundamentals` maps to `Retired Surfaces` (section 6) and the next-but-one note maps to `Frontend Surface` (section 2). [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:179-195] The list becomes monotonic under a different rule — *a retirement's note is attributed to the section that names its replacement* — leaving exactly one note with no section at all, the advisor rebuild [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:183]. So the truthful statement of the rule is "ordered by section, with a retirement attributed to its replacement", and it is only mechanically checkable once the entry declares a section list and notes carry a section reference. Recording as a Q5 constraint: do not ship an order check before the template carries the mapping.

17. **Spec-folder `(Level N)`: mechanical and cheap, but blocked by a deliberate exemption.** The only reason it is missing today is that every `>` line is skipped wholesale [SOURCE: .skilled/skills/sk-doc/shared/scripts/validate_document.py:2707-2709], because that line is where packet labels are allowed to live. The narrow fix is a third regex applied *to* the blockquote instead of masking it: flag `\((?:Level|L)\s*\d\)` on a line starting `> Spec folder`. Short has none [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:27]; long has one.

18. **Maintainer-only detail beyond test counts: not separable by vocabulary, and the kept entry proves it.** The short entry names `package_skill.py --strict` [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:60], `skill-advisor.cjs` [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:183], a token delta (`328,333` to `238,406`) [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:56] and a spelled-out count of render checks [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:171]. Every one of those is on the keep side of the target format, so any lexical "internal tooling" or "number in prose" ban deletes material the exemplar retains. Consequence for Q5: the drop rule stays prose in the template and skill, and the validator may enforce only shapes it can name — internal ids, test accounting, `(Level N)`. Code spans already mask the tool names [SOURCE: .skilled/skills/sk-doc/shared/scripts/validate_document.py:2679-2681], which is why they survive the current checks.

19. **File-total ceiling: no infrastructure, and it cannot be blocking without retrofitting the exemplar.** A 240-line body ceiling passes short (197) and fails long (339), but the canonical exemplar is 535 lines [SOURCE: .skilled/changelog/skilled/v4.0.0.0.md], so a blocking total ceiling fails `validate.sh --strict` on the tree the moment it lands. Ship it as `warning` first, or gate it to entries at or below a version cut. This is the sharpest dependency in Q5: the exemplar and the ceiling cannot both be canonical.

## Questions Answered

- Q4: Which checks could validate_document.py or hvr_scan.py add to detect the long-format failure modes (maintainer-only detail, missing at-a-glance list, unfolded small fixes, upgrade-note order)?
  Answer: `hvr_scan.py` can add none — it is not in the changelog path and is type-agnostic by design. `validate_document.py` today enforces five blocking frontmatter rules and two warning-severity body regexes, and its section, divider and render machinery is inert for unnumbered changelog H2s (findings 3–8). A new `validate_changelog_shape` called beside `validate_changelog_omissions` [SOURCE: .skilled/skills/sk-doc/shared/scripts/validate_document.py:3049-3051] can mechanically add: at-a-glance presence and bullet-to-H4 ratio (11), H4 total and per-section ceilings (13), H4 body word ceiling (14), the `(Level N)` check on the spec line (17), and a `warning` fold heuristic (15). Two named modes resist it: at-a-glance *order* (12) and maintainer-detail *vocabulary* (18); and the total-line ceiling collides with the exemplar (19).

## Questions Remaining

- Q5: What exact edits, as file:line plus replacement text, would make the concise format the default, ranked by impact? — with five new dependencies inherited from this iteration: the template must tag at-a-glance bullets with their section before an order check exists (12); it must supply a canonical fold heading before the fold heuristic is fair (15); it must carry a section-reference convention before upgrade-note order is checkable (16); the new shape checks should ship at `warning` severity because the exemplar fails any total ceiling (19); and ranking must not put a blocking total ceiling ahead of an exemplar decision.

## Ruled Out

- **A changelog mode on `hvr_scan.py`.** The scanner has no document-type concept and its own standard excludes the structural findings Q4 cares about [SOURCE: .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py:15-21]; a changelog mode would be a second scanner wearing the first one's name.
- **Populating `requiredSections` in `template-rules.json` as a fix.** The finder regex only reads numbered H2s [SOURCE: .skilled/skills/sk-doc/shared/scripts/validate_document.py:1834], so the edit would be a no-op on real entries.
- **Reusing `h2DividerRequired` as the section-shape hook.** It is already declared true and never fires (finding 6); extending it would mean changing the heading pattern for every document type.
- **A semantic at-a-glance order check without a template change.** Measured against the short entry's actual bullet text [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:41-48], no lexical mapping from bullet to H2 exists.
- **A vocabulary ban on tool names or numbers as the maintainer-detail check.** Finding 18: the kept entry names tools and numbers deliberately.
- **Reading the command YAMLs again for a length home.** Iteration 3 already established there is no ceiling there, and it is on the exhausted list.

## Dead Ends

- `hvr_scan.py` as a validation surface for changelogs. Definitive: wrong packet, wrong contract, wrong layer.
- Validator-side detection of "maintainer-only detail" by word list. Definitive: the target format keeps the same vocabulary.

## Edge Cases

- **Ambiguous input:** the brief said `hvr_scan.py` lives under `.skilled/skills/sk-doc`; there is no copy there beyond the human-voice packet. Resolved by reading the one real file and reporting the path (no fallback needed).
- **Contradictory evidence:** finding 16 — "upgrade notes ordered by section" is not literally true of the short entry. Both readings recorded with citations; no halt, per the unattended-run rule.
- **Missing dependencies:** none. Both entries and all four validator files were readable.
- **Partial success:** none. Every planned action succeeded; status is `complete`.

## Sources Consulted

- `.skilled/skills/sk-doc/shared/scripts/validate_document.py:305-310, 664-730, 1676-1710, 1815-1849, 2540-2740, 3035-3060`
- `.skilled/skills/sk-doc/shared/assets/template-rules.json:451-502`
- `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py:1-80` (and its 641-line extent)
- `.skilled/changelog/skilled/v4.0.1.0.md:1-197` (short entry, current HEAD)
- `git show bc28fcbbba:.skilled/changelog/skilled/v4.0.1.0.md` (long entry, measured only)
- `.skilled/changelog/skilled/v4.0.0.0.md` (exemplar, line total only)
- `specs/sk-doc/055-changelog-system/005-concise-release-format/research/deep-research-strategy.md`

## Assessment

- New information ratio: 0.91
- Questions addressed: Q4
- Questions answered: Q4

Calculation: 11 findings, 9 fully new (1–9, 13–14 counted within 10–19 as new validator mechanics), 2 partially new (16, 18 sharpen a Q1/Q2 conclusion with new evidence). Rounded to 0.91. No simplicity bonus applied, since the iteration adds external evidence rather than compressing it.

## Reflection

- **What worked and why:** reading the dispatch site (3035–3060) before the individual validators. It showed that `validate_render_checks` and `validate_required_sections` are called for every type, which turned the question from "what is missing" into "which of these actually fire on an unnumbered H2" — the source of findings 6, 7 and 8, none of which a reader of the rules file alone would find.
- **What did not work and why:** my first attempt to establish a baseline went through the config's own `wc -l` figures before measuring the H4 block structure. Line totals alone told me nothing about which ceiling would discriminate; the per-H4 measurements were what let me name 90 words, 26 H4s and 5-per-section with a pass and a fail side.
- **What I would do differently:** measure first, read second, when the question is "which check could exist". The numbers in finding 10 fixed the shape of findings 11–14 before I read the second validator.

## Recommended Next Focus

Q5, the ranked edit list, carrying the five dependencies in Questions Remaining. Two are hard ordering constraints, not style choices: the at-a-glance order rule and the upgrade-note order rule both require a template syntax change before any validator can check them, and a blocking total-line ceiling cannot ship while the 535-line exemplar is canonical.
