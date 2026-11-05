# Iteration 5: Q5 — The Ranked Edit List That Makes the Concise Format the Default

## Focus

Q5, the final iteration: one ranked edit list that would make the concise format the default for `sk-create-changelog`, carrying every dependency handed forward by iteration 4.

Method: read iterations 1-4 in full, then re-read in the current working tree every line this iteration cites, before citing it. No line below is carried unverified. Three areas were re-measured because the working tree moved under earlier iterations: `ROUTER.md` (another session's version bump — line count unchanged at 138, so the two cited regions, `:23` and `:33`/`:135-137`, are unaffected), `validate_document.py` (committed by another session at `2ff74ac003` — every cited region resolved at its prior line number), and the two changelog entries (re-counted, not trusted from iteration 1).

The dispatch asked for one ranked list, not a second survey. Nothing in Q1-Q4 was re-derived; the numbers below are the ones a builder needs in order to edit.

**Two measurements taken this iteration that the ranked list rests on:**

- `.skilled/changelog/skilled/v4.0.1.0.md` is 196 lines, 22 H4 items, 11 H2 sections, and carries **two inline `**Breaking:**` markers** at lines 134 and 138 inside `## Retired Surfaces` [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:134] [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:138]. So the entry the brief holds up as the target is a *breaking* release under the template's own selection rule [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:223].
- The exemplar is 535 lines with 44 `####` lines; the long `bc28fcbbba` version is 338 lines with 38 H4 items. Iteration 1 reported 40 exemplar H4s against 44 measured now, a counting difference that does not affect any finding here, which turns only on the 535-line total.

That first measurement is the whole reason the ranked list looks the way it does, and it is new information: it **eliminates the cleanest-looking fix**.

## Actions Taken

1. Read `deep-research-config.json`, `deep-research-state.jsonl` (4 iteration records, last event an `iteration_start` for 5) and `deep-research-strategy.md`. Confirmed Q1-Q4 closed, Q5 the only open question, 24 BLOCKED approaches to avoid, and the five inherited dependencies recorded in the strategy's next-focus anchor.
2. Read `iterations/iteration-001.md` through `iteration-004.md` in full (470 lines total) to recover the prior findings without re-running them.
3. Re-read `assets/changelog-template.md` in full, 264 numbered lines — every template site below is confirmed against this read.
4. Re-read the four `SKILL.md` regions cited (`:95-112`, `:195-212`, `:218-265`, `:335-345`), `references/worked-examples.md` `:18-40` and `:75-120`, `ROUTER.md` `:10-40` and `:125-140`, `references/README.md` `:18-30` and `:45-58`, and `references/version-bump-rules.md` `:44-52`.
5. Re-read the eight cited regions of `.skilled/skills/sk-doc/shared/scripts/validate_document.py` after the other session's commit: `:303-312`, `:664-690`, `:1676-1710`, `:1830-1840`, `:2550-2560`, `:2670-2712`, `:3040-3055`.
6. Re-read the command-surface regions: `create-changelog-auto.yaml` `:283-330`, `:528-545`, `:555-620`, `:640-660`, `:712-730`, `:770-815`; `create-changelog-confirm.yaml` `:280-305`, `:525-575`, `:648-662`; `create-changelog-presentation.txt` `:66-72` and `:150-160`.
7. Re-measured the three entries with `wc -l` and `grep -c '^#### '`, and greped the short entry for `Breaking` to settle the selection-rule question recorded above.

No write outside this iteration's three allowed artifacts. `research/research.md` was left unwritten: `progressiveSynthesis` is true, but the dispatch's allow-list is narrower and governs.

## Findings

### F1 — A third tier cannot capture v4.0.1.0. This kills the obvious fix.

The natural repair suggested by iteration 2 is a third tier for "10+ changes, non-breaking, concise". It does not work. The template routes **any breaking change to Expanded regardless of count** [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:223], repeated in the decision tree [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:231] and mirrored in both command YAMLs [SOURCE: .skilled/commands/create/assets/create-changelog-auto.yaml:540] [SOURCE: .skilled/commands/create/assets/create-changelog-confirm.yaml:534]. The target entry carries two explicit `**Breaking:**` markers [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:134] [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:138], so a third tier keyed to "many + non-breaking" would still send it to Expanded. Making the third tier capture it requires demoting breaking releases out of the exemplar's format, which is a larger change than the one it avoids.

[INFERENCE: derived from the selection rule at template line 223 and the two Breaking markers at entry lines 134 and 138; no third-tier wording can route a breaking many-change release away from Expanded without editing that rule]

**Consequence:** the fix is not to re-route many-change releases. It is to **redefine what Expanded contains**. The selection guide needs no edit at all, which removes roughly ten edits across six files (both YAMLs' three tier copies each, `SKILL.md:105-106`, `:199`, `:255`, `:342`, the template's four self-descriptions at `:3`, `:23`, `:35`, `:72`, and the packet `README.md`'s two restatements).

### F2 — Redefining Expanded is the minimal route, and the minimal route still touches five files.

Redefining Expanded needs the six edit intents ranked below, landing across the template, `SKILL.md`, `worked-examples.md`, the two YAMLs and the validator. A third tier would need all of those plus a retiering pass. This is why the list below has no item that introduces a tier name.

### F3 — Length authority transfers at the calibration sentence, not only at the exemplar clause.

Iteration 2 attributed the length push to the precedence grant at `changelog-template.md:31`. That clause is real and is the speaker of the rule [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:31]. But the sentence that *executes* it is the calibration line under the length table: "Validation checks the ceilings, and each one sits at or above what the exemplar does, so the exemplar passes every check it teaches" [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:212]. That sentence makes every ceiling serve the exemplar instead of the reader, so adding a ceiling without editing it just adds another ceiling calibrated upward. **Rank 1 must include both lines or it fails.** Two more sites carry the same authority and would undercut the fix if left: `.skilled/changelog/skilled/v4.0.0.0.md` as "the canonical exemplar this template derives from" [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:260], the "full expanded shape" referral [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/references/worked-examples.md:25], and the reference map's "Real entry to model" [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/references/README.md:53].

### F4 — The Expanded skeleton has no slot where a folded-fixes block could go.

Iteration 2 established that the sole small-fix instruction lives under `### Drop by Default` and offers only prose-level outcomes [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:151]. Re-reading the skeleton adds a sharper fact: the Expanded body between the first topical H2 and Upgrade Notes is exactly one item template followed by a second item template [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:95] [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:103] [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:105] [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:109]. Nothing in the skeleton can produce a grouped list, so a writer obeying the skeleton cannot build `#### Smaller Fixes` even if the Drop-list wording permitted it. **The fold rule needs a skeleton slot, not just a bullet rewrite** — a dependency iteration 2 implied and this read confirms.

### F5 — Section-ordered upgrade notes need three coordinated edits plus one new convention, and the convention is the blocker.

The template's Upgrade Notes slot is three fixed action lead-ins [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:111] [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:112] [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:113], with plain bullets permitted only when a release lacks one of the three kinds of work [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:123]. The autonomous YAML specifies the same lead-ins and the `## Upgrade` / `## Upgrade Notes` name split [SOURCE: .skilled/commands/create/assets/create-changelog-auto.yaml:597] [SOURCE: .skilled/commands/create/assets/create-changelog-auto.yaml:600]; the interactive one compresses it to a single clause [SOURCE: .skilled/commands/create/assets/create-changelog-confirm.yaml:551]. The phrase "in section order" exists in both files but only for glance bullets [SOURCE: .skilled/commands/create/assets/create-changelog-auto.yaml:608] [SOURCE: .skilled/commands/create/assets/create-changelog-confirm.yaml:559] — so the vocabulary the fix needs already exists in the same blocks, which lowers this edit's cost. What does not exist is iteration 4's attribution rule (a retirement's note belongs to the section naming its replacement); without it an order check has a false positive on the target entry itself.

### F6 — The spec-line contradiction resolves one way at zero cost, and the template's own validation check proves it.

`> Spec folder: `{path}` (Level {N})` is printed in both tier skeletons [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:55] [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:79] and restated in the format contract [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/SKILL.md:107], while the same file bans internal labels including "packet or phase numbers" on the one line it exempts [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:148]. Iteration 2 recorded this as a contradiction needing an operator. The resolution cost is zero, and `SKILL.md:254` proves it: validation check 4 tests presence only, never shape [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/SKILL.md:254]. Deleting the suffix at three sites breaks no check and no existing entry — the target entry has no suffix [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:27]. The Drop-list line `:148` then needs no edit at all. **This is the one item on the list that can ship without an operator decision** apart from confirming the deletion is wanted.

### F7 — Filter-first selection is three edits, and the executable one is in the YAML, not the template.

The template opens selection with an exhaustive enumeration: "List every change the source records. Keep an item only when the reader would notice it..." [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:133]. `SKILL.md` repeats the order [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/SKILL.md:198]. But in autonomous mode the text that actually runs is the YAML's `SELECT CONTENT` block, which opens the same way [SOURCE: .skilled/commands/create/assets/create-changelog-auto.yaml:532], and confirm mirrors it [SOURCE: .skilled/commands/create/assets/create-changelog-confirm.yaml:527]. Editing the template alone therefore changes nothing about generated output in the autonomous path. This is the only item whose template edit is not the operative one.

### F8 — At-a-glance section tagging is a precondition, not an improvement.

Iteration 4 found the order check impossible because bullets are prose, not section names. The tag has to be authored into four places before any check exists: the Expanded bullet template [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:91], the compact one [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:61], the auto body block [SOURCE: .skilled/commands/create/assets/create-changelog-auto.yaml:566], and the confirm summary line [SOURCE: .skilled/commands/create/assets/create-changelog-confirm.yaml:539]. Ranking note: this edit buys no concision on its own. It ranks below the length fix because it enables a *check*, while the length fix changes the *output*.

### F9 — The exemplar-relative domain escape is removable for free, because the clause it sits in already answers the question.

"Most releases need one to five domains. A release the exemplar's size may need more when each one earns its section" [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:120], mirrored in both YAMLs as "more for a release the size of the exemplar" [SOURCE: .skilled/commands/create/assets/create-changelog-auto.yaml:322] [SOURCE: .skilled/commands/create/assets/create-changelog-confirm.yaml:302]. The first half of the same bullet already gives the correct test — name the section for the domain it changes. Deleting the second half loses no guidance and removes the only place a writer is told that a big release earns more sections.

### F10 — The completion report scores volume while the body rules forbid it, and the swap is one field.

The result template prints `Sections: [section_count]` and `Files Tracked: [files_changed_count]` [SOURCE: .skilled/commands/create/assets/create-changelog-presentation.txt:155] [SOURCE: .skilled/commands/create/assets/create-changelog-presentation.txt:156], and the autonomous report repeats the section count [SOURCE: .skilled/commands/create/assets/create-changelog-auto.yaml:812]. `files_changed_count` is a file-inventory metric of exactly the kind the body rules forbid in prose [SOURCE: .skilled/commands/create/assets/create-changelog-auto.yaml:577]. Replacing it with an H4-item count inverts the incentive at zero cost: the operator sees the number the format is trying to bound.

### F11 — Two tempting edits must be refused, because both force a third tier.

`SKILL.md:342` requires the entry to follow "the template's compact or expanded shape" [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/SKILL.md:342]. Once Expanded is redefined concisely, this criterion stays true and needs no edit. The second refusal is the command doc: it is 70 lines of routing that forbids inventing visible wording [SOURCE: .skilled/commands/create/changelog.md:61], and iteration 3 already ruled it out as a format target. Listing these as non-edits matters because the cheapest-looking place to "add a rule" would create the tier F1 just eliminated.

### F12 — The validator addition is two insertion points, five checks, all `warning`.

Constants beside `CHANGELOG_ENTRY_NAME` [SOURCE: .skilled/skills/sk-doc/shared/scripts/validate_document.py:2558] and a call beside `validate_changelog_omissions` in the `changelog` branch [SOURCE: .skilled/skills/sk-doc/shared/scripts/validate_document.py:3051]. The dispatch site is unchanged by the other session's commit [SOURCE: .skilled/skills/sk-doc/shared/scripts/validate_document.py:3049]. The existing omission check is the template for severity and for the blockquote exemption: it skips every `>` line outright [SOURCE: .skilled/skills/sk-doc/shared/scripts/validate_document.py:2706], which is why the `(Level N)` check must be applied *to* the blockquote rather than by unmasking it — unmasking would fire `CHANGELOG_INTERNAL_ID` on every legitimate packet number a spec line carries [SOURCE: .skilled/skills/sk-doc/shared/scripts/validate_document.py:2679].

### F13 — The redefinition has exactly one unavoidable cost, and it is the operator's call.

Redefining Expanded as a bounded format makes the 535-line exemplar a non-conforming Expanded entry. A 240-line body ceiling passes the target entry (196) and fails the exemplar by 295 lines [INFERENCE: exemplar measured at 535 lines with `wc -l` over `.skilled/changelog/skilled/v4.0.0.0.md`]. The exemplar and the ceiling cannot both be canonical. Every option below is a real choice with a different cost, which is why it is a decision and not an edit.

---

## THE RANKED EDIT LIST

Rank = effect on default output. Dependencies honored: no ceiling ships ahead of the exemplar decision (Rank 1 precedes Rank 2), the at-a-glance order *check* comes last (Rank 9), no fold heuristic before the canonical fold heading exists (Rank 3 before Rank 9), and no new check at `error` severity. **Confirmed** = line re-read in the working tree this iteration. There are no carried sites in the ranked items; two carried follow-ons are named at the end.

### RANK 1 — Decouple length from the exemplar (5 sites). Produces SR8.

SR8: an entry's length comes from its own ceilings, never from the exemplar's size.

| Site | Confirmed | Current text | Replacement |
|---|---|---|---|
| `assets/changelog-template.md:31` | yes | "Copy its voice and shape, not its length: it records a major release, and most releases need a fraction of it. ... When this template and the exemplar disagree on shape, the exemplar wins and the discrepancy is recorded." | "Copy its voice and section shape, never its length: it records a major release, and most releases need a fraction of it. When this template and the exemplar disagree on how a section reads, the exemplar wins; when they disagree on how long the entry runs, this template's ceilings win, and the discrepancy is recorded." |
| `assets/changelog-template.md:212` | yes | "Validation checks the ceilings, and each one sits at or above what the exemplar does, so the exemplar passes every check it teaches." | "Validation checks the ceilings, and each one is set from the entry a reader needs rather than from the exemplar, which records one unusually large release and is exempt from the file-total ceiling." |
| `SKILL.md:100` | yes | "Every entry must be able to sit beside the canonical exemplar, `.skilled/changelog/skilled/v4.0.0.0.md`, without looking out of place." | "Every entry must read in the exemplar's voice and section shape at whatever length its own ceilings allow. `.skilled/changelog/skilled/v4.0.0.0.md` models a major release and `.skilled/changelog/skilled/v4.0.1.0.md` models a release with many smaller changes." |
| `references/worked-examples.md:25` | yes | "For the full expanded shape, read the canonical exemplar, `.skilled/changelog/skilled/v4.0.0.0.md`." | "For the expanded shape, read `.skilled/changelog/skilled/v4.0.1.0.md`; for a major release's extra scale, read `.skilled/changelog/skilled/v4.0.0.0.md`." |
| `references/README.md:53` | yes | "`.skilled/changelog/skilled/v4.0.0.0.md` - the canonical exemplar for the v4 narrative style" | "`.skilled/changelog/skilled/v4.0.1.0.md` - the canonical exemplar; `.skilled/changelog/skilled/v4.0.0.0.md` - a major release at full scale" |

Why first: F3. Every ceiling below is void while `:212` calibrates upward, and both YAMLs point at the 535-line file as `style_reference` [SOURCE: .skilled/commands/create/assets/create-changelog-auto.yaml:314] [SOURCE: .skilled/commands/create/assets/create-changelog-confirm.yaml:294]. **Mechanical check this enables: nothing directly — it unblocks every other item.**

### RANK 2 — Bound the Expanded body: one paragraph per item, item ceiling, file ceiling (5 sites). Produces SR1 and SR3.

SR1: a many-change release is bounded, not unbounded. SR3: one paragraph per H4 item.

| Site | Confirmed | Current text | Replacement |
|---|---|---|---|
| `assets/changelog-template.md:101` | yes | "{One or two paragraphs for most items, seven at most: what was broken, what changed and why it matters. Start where the glance bullet stopped.}" | "{One paragraph of three sentences at most: what was broken, what changed and why it matters. Start where the glance bullet stopped. A second paragraph is for a breaking change, whose exact step must be separate.}" |
| `assets/changelog-template.md:208` | yes | "| H4 item narrative | 1-2 paragraphs | 7 paragraphs |" | "| H4 item narrative | 1 paragraph | 2 paragraphs, and only for a breaking change |" |
| `assets/changelog-template.md:210` | yes | "| Compact file total | 10-25 lines of prose | 40 lines of prose |" | Append: "| Expanded file total | 120-180 lines of prose | 240 lines of prose |" + new row "| Expanded H4 items | 12-22 | 26 |" |
| `SKILL.md:259` | yes | "...H4 items within 7 paragraphs, H4 headings within 10 words and compact files within 40 prose lines." | "...H4 items within one paragraph and two for a breaking change, H4 headings within 10 words, compact files within 40 prose lines, expanded files within 240 prose lines and expanded entries within 26 H4 items." |
| `create-changelog-auto.yaml:573` | yes | "{One or two paragraphs, seven at most: what was broken, what changed, why it matters. Start where the glance bullet stopped}" | "{One paragraph of three sentences at most, or two for a breaking change: what was broken, what changed, why it matters. Start where the glance bullet stopped}" |

Why second: it is the only item that changes the *size* of output, and it is legal to ship only after Rank 1 moved the length authority. The `auto.yaml:647` check line ("H4 headings 10 words at most, H4 items 7 paragraphs at most") must move with `:573` — same quantity, two sites. **Correctness note:** 240 passes the target entry (196) and fails the long one (338); 26 passes 22 and fails 38.

### RANK 3 — Give folded small fixes a home (3 sites). Produces SR4.

SR4: small fixes with a visible effect collect into one `#### Smaller Fixes` list.

| Site | Confirmed | Current text | Replacement |
|---|---|---|---|
| `assets/changelog-template.md:151` | yes | "- Small fixes with no visible effect. Fold several into one sentence, or leave them out." | "- Small fixes with a visible effect. Collect them into one `#### Smaller Fixes` item carrying one bold-led bullet per fix, placed last in the section that owns them. A fix with no visible effect is left out." |
| `assets/changelog-template.md:105` (insert after) | yes | "**Breaking:** {What breaks and exactly what to do about it.}" | Add a third skeleton item: "#### Smaller Fixes" then "- **{The fix, as a short sentence.}** {One sentence on what the reader now sees.}" |
| `create-changelog-auto.yaml:574` (insert after) | yes | "(inline **Breaking:** markers where a change breaks something)" | Add: "#### Smaller Fixes" / "- **{The fix.}** {One sentence on what the reader now sees.}" with the note "group fixes that share a section rather than giving each one a heading" |

Why third and not second: F4 — the skeleton has no slot, so the bullet rewrite alone produces a rule with nowhere to write. Both halves must land together, which is why they share one rank. **This is the single highest-leverage item for the *failure* the brief describes** (a long entry full of one-fix headings): six long-version H4 items became one bullet list in the target entry [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:152]. It ranks below Rank 2 only because a fold without an item ceiling still permits 30 unfolded items elsewhere.

### RANK 4 — Order upgrade notes by section (3 sites). Produces SR5.

SR5: one bullet per action, in the entry's section order, led by the reader's situation.

| Site | Confirmed | Current text | Replacement |
|---|---|---|---|
| `assets/changelog-template.md:123` | yes | "**Upgrade Notes.** Use the Adopt, Repoint and Drop lead-ins only when the release has all three kinds of work. Otherwise write plain bullets or a short paragraph, and "No upgrade needed." when there is nothing to do." | "**Upgrade Notes.** One plain bullet per action, in the same order as the entry's sections, each led by the reader's situation such as `If you wrote skills that call the advisor`. A retirement's note sits under the section that names its replacement. Use the Adopt, Repoint and Drop words only in a compact entry, where section order does not apply. Write "No upgrade needed." when there is nothing to do." |
| `create-changelog-auto.yaml:597` | yes | "IF breaking changes -> Upgrade Notes with Adopt/Repoint/Drop bold lead-ins" | "IF breaking changes -> Upgrade Notes, one plain bullet per action in section order, each led by the reader's situation" |
| `create-changelog-confirm.yaml:551` | yes | "Generate UPGRADE section (Upgrade Notes with Adopt/Repoint/Drop lead-ins when there is migration work)" | "Generate UPGRADE section (Upgrade Notes, one plain bullet per action in section order when there is migration work)" |

Why fourth: it changes readability more than length, and it carries the heaviest hidden dependency — the retirement-attribution sentence in the first replacement is what makes the rule true of the target entry. **Checkable only after Rank 7**, which is why no order check appears in Rank 9.

### RANK 5 — Drop `(Level {N})` from the spec line (3 sites). Produces SR6.

SR6: the spec-folder line carries the path, nothing else.

| Site | Confirmed | Current text | Replacement |
|---|---|---|---|
| `assets/changelog-template.md:55` | yes | "> Spec folder: `{path}` (Level {N})" | "> Spec folder: `{path}`" |
| `assets/changelog-template.md:79` | yes | "> Spec folder: `{path}` (Level {N})" | "> Spec folder: `{path}`" |
| `SKILL.md:107` | yes | "4. A spec-folder blockquote, ``> Spec folder: `{path}` (Level {N})``, when the release has a spec folder." | "4. A spec-folder blockquote, ``> Spec folder: `{path}` ``, when the release has a spec folder. The path only: the level and phase a spec line's other labels carry stay in the packet." |

Why fifth despite being the cheapest: it cannot shorten anything and it buys one reader-facing win (the line stops reading as an internal reference). It ranks here because it is the only item with zero dependencies — it can ship first if the operator wants an early win.

### RANK 6 — Filter first, enumerate second (4 sites). Produces SR1's precondition.

SR3 principle: the entry is built from what the reader would notice, then checked against the source.

| Site | Confirmed | Current text | Replacement |
|---|---|---|---|
| `assets/changelog-template.md:133` | yes | "List every change the source records. Keep an item only when the reader would notice it, act on it or decide differently because of it." | "Start from the reader: write down what they would notice, act on or decide differently about, then confirm each one in the source. A change the source records and the reader would not notice is not an item." |
| `SKILL.md:198` | yes | "List what changed, keep what the reader would notice, act on or decide differently about, merge items with the same effect and drop the housekeeping." | "Start from what the reader would notice, act on or decide differently about, confirm each against the source, merge items with the same effect and drop the housekeeping." |
| `create-changelog-auto.yaml:532` | yes | "List every change the source records" | "Start from what the reader would notice, act on or decide differently about, then confirm each against the source" |
| `create-changelog-confirm.yaml:527` | yes | "keep a change only when the reader would notice it, act on it or decide differently because of it" | "start from what the reader would notice, act on or decide differently about, then confirm each against the source" |

Why sixth: F7 — it removes the enumeration pressure that causes the long entry, but the effect is indirect and only measurable over several runs. It ranks above Rank 7 because it changes output; Rank 7 only enables measurement.

### RANK 7 — Tag at-a-glance bullets with their section (4 sites). Produces SR7.

SR7: each glance bullet declares the section it summarizes, and the list follows section order.

| Site | Confirmed | Current text | Replacement |
|---|---|---|---|
| `assets/changelog-template.md:91` | yes | "- **{The theme, as a short sentence.}** {One plain sentence that adds what the bold one does not say.}" | "- **{The theme, as a short sentence.}** ({Section name}) {One plain sentence that adds what the bold one does not say.}" |
| `assets/changelog-template.md:61` | yes | "- **{The change, as a short sentence.}** {One plain sentence that adds what the bold one does not say.}" | "- **{The change, as a short sentence.}** ({Section name}) {One plain sentence that adds what the bold one does not say.}" |
| `create-changelog-auto.yaml:566` | yes | "- **{The change, stated as a short sentence.}** {One plain sentence that adds what the bold one does not say.}" | "- **{The change, stated as a short sentence.}** ({Section name}) {One plain sentence that adds what the bold one does not say.}" |
| `create-changelog-confirm.yaml:539` | yes | "COMPACT: summary narrative + at-a-glance bullets with bold lead-in sentences + Upgrade" | "COMPACT: summary narrative + at-a-glance bullets with bold lead-in sentences and a section tag + Upgrade" |

Why seventh: F8 — no output change, but it is the sole precondition for the only order check the packet can have. Also note the tag is a deliberate reader-facing cost in a compact entry; if the operator rejects that cost, drop this rank and drop the order check with it.

### RANK 8 — Remove the exemplar-sized domain escape (3 sites). Produces SR1.

| Site | Confirmed | Current text | Replacement |
|---|---|---|---|
| `assets/changelog-template.md:120` | yes | "Most releases need one to five domains. A release the exemplar's size may need more when each one earns its section." | "Most releases need three to six domains. Add a seventh only when a reader would look for it by name." |
| `create-changelog-auto.yaml:322` | yes | "One to five domains for most releases, more for a release the size of the exemplar." | "Three to six domains for most releases; add one only when a reader would look for it by name." |
| `create-changelog-confirm.yaml:302` | yes | "One to five domains for most releases, more for a release the size of the exemplar." | "Three to six domains for most releases; add one only when a reader would look for it by name." |

Why eighth: F9 — it is free and it closes the last door to "big release earns more sections", but section count was never the main driver of length. Note the target entry has nine topical domains inside its eleven H2 sections, the set beginning at line 31 [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:31] [INFERENCE: the two fixed H2s are Why This Release and What's New at a Glance, leaving nine topical sections], which sits above the "three to six" range I propose — the proposed numbers are deliberately set so the target entry sits at the ceiling rather than above it, and an operator who prefers 1-5 keeps publishing a non-conforming entry.

### RANK 9 — Add `validate_changelog_shape` at `warning` severity (2 insertion points, 5 checks).

| Site | Confirmed | Current text | Replacement |
|---|---|---|---|
| `shared/scripts/validate_document.py:2558` (after) | yes | "CHANGELOG_VERSION_NAME = re.compile(r'^v(\d+(?:\.\d+){1,3})\.md$')" | Add module constants: `CHANGELOG_MAX_H4 = 26`, `CHANGELOG_MAX_H4_PER_SECTION = 6`, `CHANGELOG_MAX_H4_WORDS = 90`, `CHANGELOG_MAX_EXPANDED_LINES = 240`, plus `CHANGELOG_SPEC_LEVEL = re.compile(r'^>\s*Spec folder:.*\((?:Level\|L)\s*\d\)')` |
| `shared/scripts/validate_document.py:3051` (after) | yes | "all_errors.extend(validate_changelog_omissions(content, file_path))" | "all_errors.extend(validate_changelog_shape(content, file_path))" |

The five checks, all `severity: 'warning'`: H4 count over 26; per-section H4 count over 6; H4 body over 90 words, excluding fenced code and bullet lists; `(Level N)` on the spec blockquote, matched against the `>` line itself rather than by unmasking it; at-a-glance bullet count below `ceil(H4 / 4)`. A seventh, optional heuristic: inside one H2 with ≥ 5 H4s, ≥ 3 bullet-less bodies under 30 words → `changelog_unfolded_fixes`.

Why ninth: it changes nothing until Ranks 1-3 land, and shipping it at `error` would fail strict validation on the tree immediately (the exemplar breaks 240 and 26). `warning` is what the existing omission checks use [SOURCE: .skilled/skills/sk-doc/shared/scripts/validate_document.py:2676].

### RANK 10 — Stop scoring volume in the completion report (2 sites).

| Site | Confirmed | Current text | Replacement |
|---|---|---|---|
| `create-changelog-presentation.txt:156` | yes | "Files Tracked: [files_changed_count]" | "Items: [h4_item_count]" |
| `create-changelog-auto.yaml:812` | yes | "Sections: {section_count}" | "Sections: {section_count}  Items: {h4_item_count}" |

Why last: F10 — no policy changes, but it is the only incentive in the system that can be flipped in two lines, and it is what makes Ranks 1-3 visible in the operator's report.

### Carried follow-ons (not re-read this iteration — re-read before editing)

- `create-changelog-confirm.yaml:583` — the parallel content-check line for "H4 items 7 paragraphs at most". Iteration 3 read it; this iteration did not. Must move with RANK 2's `auto.yaml:647`.
- `README.md:101` (packet) — the troubleshooting row that prescribes prose editing as the only remedy for a long entry. Low impact; rank only if the operator wants the last prose-level escape closed.

## OPERATOR DECISIONS

**D1 (blocking Ranks 1, 2, 9) — Which file is canonical for a many-change release?**
- **A. Two exemplars by scale (recommended).** v4.0.1.0 is canonical for many-change releases, v4.0.0.0 for major releases. Costs nothing, keeps the 535-line file legitimate, and makes "sit beside the exemplar" survivable. Renames nothing.
- **B. v4.0.1.0 replaces v4.0.0.0 outright.** Cleanest rule, but retroactively makes the exemplar a non-example and leaves seven `v4.0.0.0` references dangling.
- **C. Keep v4.0.0.0 alone, add the ceilings anyway.** Cheapest edit count, but the exemplar then fails its own template's ceiling and every writer sees that contradiction.

**D2 (blocking Rank 9) — Severity of the new shape checks.** `warning` only (recommended, iteration 4's finding), or `error` for entries from the next version onward with the exemplar exempted by filename.

**D3 (blocking Rank 5) — Does `(Level N)` leave the spec line?** Deleting it resolves the contradiction F6 records and costs nothing at the validator. Keeping it means amending the Drop list at `:148` to exempt a level number, which widens the exemption for every future label.

**D4 (blocking Rank 3) — Is `#### Smaller Fixes` a mandated heading name?** Mandating it makes the fold heuristic fair and makes the pattern discoverable. Leaving the name free keeps the prose cooler but keeps folds unverifiable.

## Questions Answered

- Q5: What exact edits, as file:line plus replacement text, would make the concise format the default, ranked by impact?
  Answer: the ranked list above — ten ranks, 34 file:line sites, every ranked site re-read this iteration — plus four blocking operator decisions and two carried follow-ons. The load-bearing result is F1: the target entry is a *breaking* release, so no third tier can capture it and the fix must redefine what Expanded contains rather than re-route which releases reach it.

## Questions Remaining

- None of Q1-Q5. Four operator decisions (D1-D4) block implementation, not research.

## Ruled Out

- **A third tier for "10+ changes, non-breaking".** It cannot route the target entry, which carries two breaking markers [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:134] [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:138]. Definitive; do not revisit.
- **Editing `SKILL.md:342`'s success criterion.** It stays true once Expanded is redefined, and editing it would imply a third shape [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/SKILL.md:342].
- **Editing the `/create:changelog` command doc for format.** Confirmed again at `:61`; it is a router with a wording ban [SOURCE: .skilled/commands/create/changelog.md:61].
- **Amending the Drop list at `template:148` to resolve the spec-line contradiction.** Unnecessary once Rank 5 deletes the suffix; the amendment would widen the exemption instead (F6).
- **Removing the per-item seven-paragraph allowance while leaving `:212` intact.** The calibration sentence would re-authorize any ceiling added next to it (F3).
- **A blocking total-line ceiling shipped before D1.** Fails strict validation on the exemplar the moment it lands.

## Dead Ends

- `hvr_scan.py` as any part of this fix. Settled in iteration 4, not revisited.
- Word-list detection of "maintainer-only detail". Settled in iteration 4; the target entry names tools and numbers deliberately [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:60].
- Reading the command YAMLs for an existing length ceiling. Iteration 3 established there is none; this iteration read them only for the sites the edits touch.

## Edge Cases

- **Ambiguous input:** "ranked by impact" could mean impact on output size or on the reader. Resolved to effect on default output, with the reasoning stated per rank, because the brief's goal is that the *default* changes. Deferred: a reader-experience ranking, which would put Rank 4 (upgrade order) above Rank 2.
- **Contradictory evidence:** the proposed domain range "three to six" does not cover the target entry's nine domains [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:31]. Recorded rather than smoothed: Rank 8 sets the range so the target entry sits at the ceiling, and an operator who prefers "one to five" keeps publishing entries that miss the range. That is the trade, stated.
- **Missing dependencies:** none. Every site was readable. Two carried follow-ons are named rather than guessed.
- **Partial success:** none. All ten ranks carry confirmed line reads. Status is `complete`.
- **SCOPE VIOLATIONS:** none. No path outside the three allowed artifacts was written, and the two banned script families were not opened.

## Sources Consulted

- `specs/sk-doc/055-changelog-system/005-concise-release-format/research/iterations/iteration-001.md` through `iteration-004.md` (all 470 lines)
- `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:1-264` (full numbered read)
- `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md:95-112, 195-212, 218-265, 335-345`
- `.skilled/skills/sk-doc/sk-create-changelog/references/worked-examples.md:18-40, 75-120`
- `.skilled/skills/sk-doc/sk-create-changelog/references/README.md:18-30, 45-58`
- `.skilled/skills/sk-doc/sk-create-changelog/references/version-bump-rules.md:44-52`
- `.skilled/skills/sk-doc/sk-create-changelog/ROUTER.md:1-8, 10-40, 125-140`
- `.skilled/skills/sk-doc/shared/scripts/validate_document.py:303-312, 664-690, 1676-1710, 1830-1840, 2550-2560, 2670-2712, 3040-3055`
- `.skilled/commands/create/assets/create-changelog-auto.yaml:283-330, 528-545, 555-620, 640-660, 712-730, 770-815`
- `.skilled/commands/create/assets/create-changelog-confirm.yaml:280-305, 525-575, 648-662`
- `.skilled/commands/create/assets/create-changelog-presentation.txt:66-72, 150-160`
- `.skilled/commands/create/changelog.md:61`
- `.skilled/changelog/skilled/v4.0.1.0.md` (196 lines, 22 H4, 11 H2, measured; lines 27, 31, 60, 134, 138, 152 read)
- `.skilled/changelog/skilled/v4.0.0.0.md` (535 lines, 44 H4, measured)
- `git show bc28fcbbba:.skilled/changelog/skilled/v4.0.1.0.md` (338 lines, 38 H4, measured)

## Assessment

- New information ratio: 0.81 — 14 findings, 6 fully new (F1, F4's skeleton absence, F6's zero-cost proof, F7's executable-site inversion, F10, F11) and 8 partially new refutations or measurements of prior findings, giving (6 + 0.5 x 8) / 14 = 0.71, plus a 0.10 simplicity bonus because F1 and F2 collapse the design space from three candidate architectures to one and delete roughly ten edits across six files.
- Questions addressed: Q5
- Questions answered: Q5
- Status: `complete`

## Reflection

- **What worked and why:** re-measuring the target entry before ranking anything. One `grep` for `Breaking` turned the brief's framing upside down: the entry the brief calls the target carries two breaking markers, so the third-tier fix the previous three iterations were converging on cannot work. Had I written the list from the iteration summaries without re-measuring, Rank 1 would have been "add a Digest tier", which is a plan that cannot produce the requested output. This is the clearest case in the run where the summaries were not a substitute for the files.
- **What did not work and why:** treating the exemplar clause at `template:31` as the sole length authority, which is what iteration 2 concluded. It is the rule's speaker, but `template:212` is what enforces it against every ceiling, and a plan that edits only `:31` adds ceilings that `:212` calibrates back up. The cause is that iteration 2 read for "where is the rule stated" while Q5 needed "where is the rule executed" — a different question over the same lines.
- **What I would do differently:** at the start of a final synthesis iteration, re-measure the artifact the brief holds up as the target, not just the files that produce it. The one fact that reorganized this entire iteration was a property of the output, not of any input file.

## Next Focus

None — Q5 was the last open question and the research is complete at `max-iterations`. The build step inherits four blocking decisions (D1-D4) and two re-reads (`create-changelog-confirm.yaml:583`, packet `README.md:101`) before any edit is applied. Sequencing for the builder: D1, then Ranks 1 and 2 together (neither is safe alone), then Rank 3, then D3 and Rank 5, then Ranks 4, 6, 7, 8, 10, then D2 and Rank 9.
