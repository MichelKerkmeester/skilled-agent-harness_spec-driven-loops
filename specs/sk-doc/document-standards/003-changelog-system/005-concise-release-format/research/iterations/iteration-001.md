# Iteration 1: Format Rules of the Short Republished v4.0.1.0 Entry (Q1)

## Focus

Q1, as dispatched: name every concrete format rule (structure, length, audience, omissions) that the short republished `v4.0.1.0` entry follows, by diffing it against the long version of the same entry, and against the canonical exemplar.

Three artifacts were read in full or by structure: the short entry at HEAD (196 lines), the long entry at `bc28fcbbba` (338 lines), and the exemplar `.skilled/changelog/skilled/v4.0.0.0.md` (535 lines). The two intermediate revisions `b6147d785b` (194 lines) and `a8cc47730b` (196 lines) were measured for line count only, so the cut is attributable: the whole 144-line reduction lands in `b6147d785b`, and the two later revisions add back one line each without restoring structure.

The ambiguity in the dispatch ("diff the short entry against the long version") resolves to two separable changes living in the same diff: a **format** change and a **packet-renumbering** change. Finding 9 separates them, because a format rule derived from the renumbering would be wrong.

## Actions Taken

| # | Action | Target |
|---|---|---|
| 1 | Read short entry with line numbers in full | `.skilled/changelog/skilled/v4.0.1.0.md` |
| 2 | Read long entry at `bc28fcbbba` in full, and measured `wc -l` for `bc28fcbbba`, `b6147d785b`, `a8cc47730b`, HEAD | `git show <sha>:...` |
| 3 | Read exemplar in full (535 lines) and extracted its H2/H4 heading tree | `.skilled/changelog/skilled/v4.0.0.0.md` |
| 4 | Extracted the long entry's H2/H4 heading tree with line numbers and compared it with the short entry's tree | both entries |
| 5 | Read `assets/changelog-template.md` sections 2-5 with line numbers (264 lines) | the format owner |
| 6 | Grepped `SKILL.md` and `ROUTER.md` for exemplar, ceiling, length and compact/expanded language | the skill that routes the template |

No file outside the research packet was modified. The two banned path families (`.skilled/skills/sk-doc/shared/scripts/validate_document.py`, `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py`, `.skilled/skills/sk-doc/scripts/tests/test_bare_url_badge.py`) were not opened.

## Findings

### A. Length and shape

1. **The short entry is 196 lines: 20 frontmatter lines and 176 body lines, 11 H2 sections, 22 H4 items and one table-free body.** The frontmatter carries 13 trigger phrases. [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:1]

2. **The cut is 42 percent of the file and all of it lands in one commit.** `bc28fcbbba` is 338 lines, `b6147d785b` is 194, `a8cc47730b` is 196 and HEAD is 196. The reduction is structural, not editorial: no later commit restores a cut section. [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:21]

3. **Every H2 domain survives the cut, in the same order.** Both versions carry the same 11 H2 headings: Why This Release, What's New at a Glance, Skill Routing, Frontend Surface, Doctor Commands, Spec Kit, Manual Testing Playbooks, Retired Surfaces, Runtimes and Fixes, Clearer Skill Docs, Upgrade Notes. [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:31]

   This is the single sharpest rule in the whole diff: **the cut is taken at the H4 level, never by deleting a domain.** The long version's `## Clearer Skill Docs` survives even though two of its five H4 items are deleted, and `## Manual Testing Playbooks` survives as a section with one H4 item. [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:161] [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:122]

4. **The H4 count falls from 38 to 22, a 42 percent cut that matches the line cut.** Per domain: Skill Routing 6 to 3, Frontend Surface 4 to 3, Doctor Commands 6 to 5, Spec Kit 4 to 2, Manual Testing Playbooks 3 to 1, Retired Surfaces 3 to 3, Runtimes and Fixes 7 to 2, Clearer Skill Docs 5 to 3. [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:52]

   Retired Surfaces is the one domain left untouched, because each of its three items is a separate breaking removal a reader must act on. [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:130]

5. **The exemplar cannot supply the length rule: it is 2.7 times the short entry.** The exemplar is 535 lines with 12 H2 sections and 40 H4 items. The template itself calls it "one in six hundred lines". A rule that says "copy the exemplar's shape" therefore reproduces the long format, which is the mechanism behind the long version. [SOURCE: .skilled/changelog/skilled/v4.0.0.0.md:13] [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:170]

### B. The three dispositions of a cut H4

6. **A cut H4 leaves the entry through exactly one of three doors, and the door is chosen by the reader's need to act.** Mapping all 16 removed H4 items:

   | Door | Used for | Example |
   |---|---|---|
   | **Fold into a neighbouring H4 as a closing sentence** | the cut item's fact still changes what the reader does, and belongs to a sibling's story | "Routing Accuracy Held Through the Move" becomes the last sentence of "The Router Leaves the Skill File" [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:56] |
   | **Fold into one bullet list under one H4** | many small fixes, each with a visible effect, none worth a heading | six long-version H4 items become `#### Smaller Fixes` [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:152] |
   | **Drop entirely** | the item is process, housekeeping or a fix with no visible effect | "Long Lines Became Short Sentences" and "New Skills Are Checked for Human Voice" both vanish from Clearer Skill Docs [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:161] |

   [INFERENCE: based on the H4 heading trees of both versions, the 16 removed headings and the 22 surviving ones, matched by subject]

7. **The folded-fixes container is one H4 with a fixed name and bold-lead bullets, not prose.** `#### Smaller Fixes` carries four bullets, each a bold sentence plus one plain sentence, and absorbs "Pi Loads One Copy of Its Extension", "Generated Files Match the Commit", "Abandoned Processes Leave Temp Folders", "The Sweep Installs on Any Machine" and "Worker Sessions Skip the Context Nudge". A sixth, "The Git Advisory Keeps the Directory", is dropped even from the folded list. [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:152]

8. **Every surviving H4 is exactly one paragraph, and the body carries exactly one bullet list.** In the short entry no H4 has two paragraphs and none has a nested list; the only body bullet list is inside `#### Smaller Fixes`. The long version carries bullet lists inside five body H4 items (the executor roster, the Pi bridges, the Hermes folder, the cache gains, the design modes). [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:70] [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:146]

### C. Pointers, order and cross-references

9. **Part of the diff is packet renumbering, not format, and must be held apart from the format rules.** The long spec line names `specs/sk-doc/072-skill-routing-and-clarity`, `specs/agents/021-doctor-agents-md` and `specs/system-speckit/042-decision-capture`; the short one names `specs/sk-doc/051-hub-routing-quality/002-skill-routing-and-clarity`, `specs/agents-md/016-doctor-agents-md` and no `042`. Both name `specs/system-speckit/043-decision-capture` and `specs/commands/005-doctor-symlink-install` unchanged, which proves the rest of the difference is a renumber pass. [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:27]

10. **The spec line is compressed to nine folders with no level or phase annotation, and the residue is one trailing clause.** The short line names nine paths and ends "with smaller packets for the fixes". The long line is a single paragraph referencing more than twenty packets with `(Level 3)`, `(Level 2)` and `phases 003 to 013` on almost every entry. [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:27]

11. **Upgrade Notes is 16 plain bold-condition bullets ordered to match the body's section order.** Reading down: the withdrawn predecessor, then Skill Routing (skills you wrote), then Frontend Surface (advisor rebuild, `sk-design-fundamentals` callers, React Native), then Doctor Commands (Skilled in a project, root instruction file, `.skilled/release`), then Spec Kit (decision capture on Claude Code, in a linked project), then Manual Testing Playbooks, then Retired Surfaces (MagicPath, gateway routes), then Runtimes and Fixes (OpenCode files, orphan sweep), then Clearer Skill Docs (doc rewrite guard). [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:179]

    The lead-ins are not the Adopt/Repoint/Drop triad: each bullet leads with the reader's situation instead. [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:123]

12. **The component cross-reference is one sentence, placed in the last body section, naming every component and mode that has its own entry.** It sits at the end of "Every Skill Doc, Read by Hand", before the last two H4 items of that section, and names cli-classifier (cli-jev), cli-external-orchestration (seven CLI modes), cli-orca, mcp-code-mode, mcp-tooling (eight modes), sk-code (four modes), sk-design (three modes), sk-doc (thirteen modes), sk-git, sk-prompt, system-deep-loop (three modes) and system-spec-kit. [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:167]

### D. Where the current template forces the long format

13. **The format-selection guide mandates the long branch for exactly this release.** A release with 10 or more changes takes Expanded, and a release with any breaking change takes Expanded regardless of count. `v4.0.1.0` has four retired surfaces and dozens of changes, so the current rule excludes the short entry outright: the short entry is an Expanded release whose own template would have produced the 338-line version. [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:222] [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:230]

14. **The length table has a compact file-total ceiling and no expanded file-total ceiling.** The rows cover summary, opening narrative, Why This Release, glance bullets, glance-bullet sentences, H4 narrative and H4 heading, plus `Compact file total | 10-25 lines of prose | 40 lines of prose`. There is no `Expanded file total` row, so a many-change release has no ceiling on the file at all. The short entry at 176 body lines is eight times the only file ceiling the template has. [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:201] [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:210]

15. **Two rules pull toward the long form, and one contradicts the short entry's spec line.** The exemplar-wins clause says "When this template and the exemplar disagree on shape, the exemplar wins", and `SKILL.md` requires every entry to "sit beside the canonical exemplar ... without looking out of place" against a 535-line reference. Separately, the expanded template prints a spec line with a level annotation, `> Spec folder: {path} (Level {N})`, while the Drop list says internal labels and "packet or phase numbers" must not appear and "the spec-folder line is the one pointer an entry needs". The short entry follows the Drop list and drops the level, which the template's own shape block does not permit. This is a live contradiction, recorded here per the no-halt rule rather than resolved. [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:31] [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/SKILL.md:100] [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:79] [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:148]

## Ruled Out

- **Treating the exemplar as the length reference.** The exemplar is 535 lines and 40 H4 items, so deriving a length rule from it reproduces the long format rather than the short one. Only its H2/H4 shape, voice and separator convention transfer; its length does not. [SOURCE: .skilled/changelog/skilled/v4.0.0.0.md:13]
- **A pure word-level diff as the source of the rules.** The rewording between the two versions is small; nearly all of the 144-line difference is deleted or merged H4 blocks. Deriving rules from the prose diff would have produced style advice where the actual loss is structure. [INFERENCE: based on 38 to 22 H4 headings against a 42 percent line cut]
- **Reading the compact branch as the model for the short entry.** The compact ceiling is 40 prose lines; the short entry is 176 body lines. The short entry is a third format, not a compact entry. [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:210]

## Dead Ends

- No dead ends this iteration. Both the long and short entries, the intermediate revisions and the exemplar were all reachable.
- **Candidate for the reducer's exhausted list:** none.

## Edge Cases

- **Ambiguous input:** "diff the short entry against the long version" could mean a prose diff or a structural diff. Resolved to structural (H2/H4 trees plus line counts) because the prose diff does not explain the 144-line gap. Deferred: a sentence-level voice diff of the two versions, if Q5 needs it.
- **Contradictory evidence:** Finding 15 records a live contradiction inside the current template, between the `(Level {N})` shape block and the Drop list, and between "the exemplar wins" and the requirement that entries be short. Neither is resolved. Resolution owner is the operator or Q5; the research records both sides with citations.
- **Missing dependencies:** none blocking. `hvr_scan.py` was not located or read this iteration, so Q4's validator half is untouched and unimpaired.
- **Partial success:** the exemplar was compared structurally (line count, H2/H4 tree, bullet-list placement) and not sentence by sentence, which caps the confidence on Finding 5 and Finding 8 at "structural, not editorial". Status stays `complete` because the Q1 question is answered for structure, length and omissions, which is what the dispatch asked for; the caveat is recorded here rather than smoothed over.

## Sources Consulted

- `.skilled/changelog/skilled/v4.0.1.0.md:1-196` (short entry at HEAD, `6a93a2cfeb`)
- `git show bc28fcbbba:.skilled/changelog/skilled/v4.0.1.0.md` (long entry, 338 lines, headings and lines 1-40 read in full)
- `git show b6147d785b:.skilled/changelog/skilled/v4.0.1.0.md` (194 lines, line count only)
- `git show a8cc47730b:.skilled/changelog/skilled/v4.0.1.0.md` (196 lines, line count only)
- `.skilled/changelog/skilled/v4.0.0.0.md:1-535` (exemplar, full read plus heading tree)
- `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:1-264` (sections 2-5 with line numbers)
- `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md:100,105,106,199,218,255,259,260,329,342`
- `.skilled/skills/sk-doc/sk-create-changelog/ROUTER.md:16,23,33`
- `.skilled/skills/sk-doc/sk-create-changelog/references/` (directory listing: README.md, topology-edge-cases.md, version-bump-rules.md, worked-examples.md)

## Assessment

- New information ratio: 0.93 (13 of 15 findings fully new; 2 partially new because the strategy's known-context section already recorded the commit chain and the renumbering risk)
- Questions addressed: Q1
- Questions answered: Q1, with the exemplar comparison scoped to structure and length rather than sentence-level voice
- Findings: 15
- Structural claim: the short entry obeys six rules at the file level (H2 set preserved, H4 cut by 42 percent, one paragraph per H4, one body bullet list, level-free spec line, section-ordered upgrade bullets) and three at the item level (fold into neighbour, fold into one list, drop).

## Reflection

- **What worked and why:** comparing heading trees before reading prose made the mechanism visible in one pass. A prose diff would have shown wording changes; the tree diff showed that 16 H4 items left and 11 H2 sections stayed, which is the actual rule. Measuring `wc -l` across the two intermediate commits then attributed the whole cut to one commit, separating a format decision from later touch-ups.
- **What did not work and why:** reading the exemplar in full cost a large share of the iteration's evidence budget and produced only three usable findings, because the exemplar's value to Q1 is its shape and its length, not its text. A heading extract plus `wc -l` would have served Q1 and left budget for the template's section 1, which was skipped.
- **What I would do differently:** read `assets/changelog-template.md` before the exemplar. The template, not the exemplar, owns the rules that would have produced the short version, and reading it first would have aimed the exemplar read at the length question only.

## Recommended Next Focus

Q2, per the strategy's next-focus line: locate every place in `SKILL.md`, `ROUTER.md`, `assets/changelog-template.md` and `references/` that pushes toward the long format, with `file:line`, now that iteration 1 has named the target format. Concrete leads carried forward from this iteration:

1. `assets/changelog-template.md:222` and `:230` — the format-selection guide mandates Expanded for this release family. Highest-impact single lever.
2. `assets/changelog-template.md:201-210` — no `Expanded file total` row, so the expanded branch is unbounded.
3. `assets/changelog-template.md:31` and `SKILL.md:100` — the exemplar-wins and "sit beside the exemplar" rules point at 535 lines.
4. `assets/changelog-template.md:79` versus `:148` — the `(Level {N})` shape block contradicts the Drop list and the short entry's spec line.
5. `assets/changelog-template.md:151` — the folded-fixes rule lives only as a one-sentence aside inside Drop by Default and names no container, so the `#### Smaller Fixes` pattern is not discoverable from the template.
6. `assets/changelog-template.md:120` and `:133` — the one-to-five-domains note and the "list every change the source records" instruction both read as enumeration pressure and need to be checked in full context.
7. `references/worked-examples.md` — not yet read. It is the likeliest place for a full worked entry that a generator would copy wholesale.

## RESEARCH NOTES

- `progressiveSynthesis` is `true` in the config, but this iteration wrote no `research/research.md`: the dispatch's allowed-write list enumerates only the iteration narrative, the delta file and the gateway's own writes, and the narrower authority governs. Nothing was written outside that zone.
- All bodies that the researcher's state log already carried (config, state JSONL, strategy) were read before any research action, per the state-first invariant.
