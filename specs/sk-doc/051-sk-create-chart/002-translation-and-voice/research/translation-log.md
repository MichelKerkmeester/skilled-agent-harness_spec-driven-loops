---
title: "Translation Log: lieflat-charts Chinese to English"
description: "Every place where a literal rendering and a natural one pulled apart, the choice made and the reason. Plus the source defects, the disagreements with the upstream English README and the accepted voice exceptions."
trigger_phrases:
  - "translation log"
  - "literal versus natural"
  - "lieflat charts translation"
  - "chinese source defects"
importance_tier: "important"
contextType: "implementation"
---

# Translation Log: lieflat-charts Chinese to English

> The operator instruction was to keep the source as literal as possible while making it
> all English. This log exists because a rewrite dressed as a translation leaves no trace
> unless something records it.

---

## 1. METHOD AND SOURCES

The Chinese is the source of truth. The upstream `README.en.md` was read only after the
Chinese, and only as a cross-check. Where the two disagree, the Chinese won and the
disagreement is recorded in section 6.

| Item | Value |
|---|---|
| Upstream | `https://github.com/larashero3-dotcom/lieflat-charts.git` |
| Commit | `4eef5ce` (the clone holds exactly 1 commit, so there is no history to diff against) |
| Character measure | Han only, `U+4E00` to `U+9FFF`, which is what reconciles with the phase brief |
| Residue scan | Han plus CJK punctuation, `U+3000-303F`, `U+FF00-FFEF`, `U+FE30-FE4F` |
| Voice standard | `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md` |
| Scope gate | `.opencode/skills/sk-doc/sk-create-with-human-voice/references/scope-and-exemptions.md` |

---

## 2. WHAT WAS TRANSLATED

Seven authored documents. The first six came from the phase brief. `THIRD_PARTY_NOTICES.md`
did not, and is recorded as finding S-05.

| Source file | Han chars | Output |
|---|---:|---|
| `SKILL.md` | 8,304 | `scratch/translated/SKILL.md` |
| `README.md` | 3,180 | `scratch/translated/README.md` |
| `catalog.md` | 1,986 | `scratch/translated/catalog.md` |
| `report-catalog.md` | 1,010 | `scratch/translated/report-catalog.md` |
| `templates/color/README.md` | 652 | `scratch/translated/templates/color/README.md` |
| `examples/README.md` | 515 | `scratch/translated/examples/README.md` |
| `THIRD_PARTY_NOTICES.md` | 128 | `scratch/translated/THIRD_PARTY_NOTICES.md` |
| **Total** | **15,775** | 7 files, zero Han characters remaining |

The brief's six files sum to 15,647. Adding the notices file gives 15,775, which is the
exact reconciliation.

---

## 3. THE WHOLE-TREE CENSUS

The brief said its list came from a targeted scan and should be treated as a starting
point. It was right to. A sweep of every non-binary file in the clone found roughly three
times as much Chinese as the six briefed documents hold.

| Class | Files | Han chars | Owner |
|---|---:|---:|---|
| A. Authored prose | 7 | 15,775 | This phase, done |
| B. Upstream English README | 1 | 2 | Cross-check only, the language switcher |
| C. Shared JS, comments and design notes | 2 | 1,281 | Phase 4 |
| D. Build scripts, comments, messages and assertions | 2 | 355 | Phase 4, see S-06 |
| E. Gallery chrome and comments | 4 | 1,889 | Phase 4 |
| F. Colour sample chrome and comments | 18 | 6,835 | Phase 4 |
| G. Report `.zh.html` templates, Chinese by design | 12 | 11,748 | Placement decision, not translation |
| H. Report `.en.html` templates, Chinese in comments only | 12 | 6,285 | Phase 4, see S-07 |
| I. Report index chrome | 1 | 818 | Phase 4 |
| J. Worked example, Chinese by design | 1 | 790 | Placement decision |
| **Total** | **60** | **45,778** | |

Class A is the only class this phase owns. Everything below it is inventoried here so a
later phase inherits a work list instead of a surprise.

### 3.1 Coverage against the coordinator's revised figures

The coordinator's whole-tree total, 45,778 Han across 60 files, matches the independent
sweep above exactly. The per-agent split does not.

| Figure | Source | Note |
|---|---:|---|
| 45,778 Han / 60 files | Both counts agree | Whole tree, every non-binary file |
| 42,598 Han / 59 files | Coordinator, "falls to you" | 45,778 minus 42,598 is 3,180, and 60 minus 59 is 1. 3,180 is exactly `README.md`. That file is item 2 of the phase brief's own list and is translated here, so the figure appears to have dropped it by accident |
| 15,775 Han / 7 files | This phase, complete | Class A, all authored prose |
| 30,003 Han / 53 files | Not this phase | Everything else |

Of the 30,003 not done here, 12,538 across 13 files is Chinese by design, the 12 `.zh.html`
report templates plus the Chinese worked example. Translating those deletes the bilingual
report feature rather than adopting it. That leaves **17,463 Han across 39 files** of
genuinely translatable non-prose: gallery and colour-sample chrome, build comments in the
shared JS and the two scripts, the report index, and the comment blocks inside the
misleadingly named `.en.html` templates.

That remainder is not refused, it is placed. This phase's scope excludes template
rendering logic, and every one of those 39 files has to still render after editing, which
is proved by the source's own `validate.mjs` and `smoke-new-charts.mjs`. That proof is
phase 4's handoff criterion. Doing the edit here would move the work without moving the
check that makes it safe. The inventory above is what phase 4 needs to start.


---

## 4. DIVERGENCES: LITERAL AGAINST NATURAL

Thirty-seven places where the two pulled apart. The choice and the reason are on each row.

### 4.1 Punctuation and notation

| ID | Source | Literal would give | Chosen | Why |
|---|---|---|---|---|
| D-01 | Section ordinals 零、一、六点五 | "Zero,", "One,", "Six point five" | `0.`, `1.`, `6.5` | They are section numbers. The document's own cross-references say "section 6.5", so numerals preserve the reference graph |
| D-02 | `——` as an aside connector, 12 places | Em dash | Comma, colon or full stop | Em dash is a hard blocker in the voice standard. No meaning moved |
| D-03 | `；` full-width semicolon, frequent | Semicolon | Two sentences, or "and" / "but" | Semicolon is a hard blocker |
| D-26 | `—` as the empty-cell marker in catalog tables, 20 cells | Em dash | `None` | Hard blocker. The cell meant "no sister chart", which `None` says outright |
| D-33 | Full-width `（）、，` in running text | Keep full-width forms | ASCII equivalents | They are Chinese-script punctuation, so they fall under "make it all English" |
| D-34 | `「」` and `《》` | Keep the brackets | Straight double quotes | Same reason. Straight quotes also satisfy the curly-quote ban |
| D-27 | Ranges written `L1–L20`, `2–3`, `30–60` | Keep every en dash | En dash kept in tables and identifiers, "to" in running prose | Readability. This choice has a downstream consequence, see S-06 |
| D-31 | `<title>Mono — {图名}</title>` in the section 9 code fence | Strip the em dash | Kept the em dash | Sample code. The scope gate puts code out of the voice standard's reach |
| D-32 | `⚠️` markers, 2 in SKILL.md | Drop one to satisfy the one-emoji guidance | Kept both | They are source emphasis markers, not decoration, and one sits inside a code fence |

### 4.2 Terms with no clean English equivalent

| ID | Source | Literal would give | Chosen | Why |
|---|---|---|---|---|
| D-04 | 本体 in section 6 step 1 | "noumenon" or "ontology" | "the underlying question", "the underlying thing" | The source means what the chart fundamentally encodes. A transliteration would carry nothing |
| D-05 | 抄形不抄魂 | "copy the form, not the soul" | "Copying the shape without the soul" | Kept the idiom. It reads as an idiom in English too |
| D-06 | 例句 and 成文 in the examples README | "example sentence" and "finished writing" | Kept both, in quotes | The writing metaphor is the point of that paragraph |
| D-07 | 现场造句 | "compose a sentence on the spot" | Kept literally | The natural English is "improvise", which loses the link to D-06's metaphor |
| D-08 | 家具 for non-data chart elements | "furniture" | "furniture" | Literal and natural agree. It is established data-visualization vocabulary |
| D-11 | 版心 | "type area" (a print term) | "type area", or "type-area width" where the value is a pixel count | The catalog's column holds widths, so the measurement reading is the accurate one |
| D-12 | 气质 | "temperament" | "character" | "Temperament" reads oddly of a colour palette |
| D-13 | 召回 in the retrieval sense | "recall" | "recall" | Kept. "Shortlist" would read better and would lose the retrieval sense the source intends |
| D-14 | 姊妹 column | "sister" | "Sister" | Kept |
| D-18 | 冲天 | "pierce the sky" | "let the extreme value run off the top" | The literal is not readable as an instruction |
| D-19 | 撕柱不撕轴 | "tear the bar, not the axis" | Kept literally | It is a rule name the document repeats |
| D-20 | 明度即数据 | "lightness is the data" | Kept literally | It is the skill's central claim |
| D-21 | 一眼一家人 | "one glance, one family" | "look like one family at a glance" | Minimum smoothing to make it a sentence |
| D-10 | 寒酸 | "shabby", "impoverished" | "threadbare" | Register match |
| D-17 | 三秒快读 | "three-second fast read" | "three-second read" | Dropped one redundant word |

### 4.3 Where the voice standard pushed the wording

| ID | Source | Natural English | Chosen | Why |
|---|---|---|---|---|
| D-09 | 摊回可数单位 | "`unpack` back into countable units" | "break the aggregate back down into countable units" | `unpack` is a hard-blocked word. The longer phrase says the same thing |
| D-35 | Not a source divergence | Serial commas before "and" or "or" | Removed in 30 places across the set | The voice standard bans the Oxford comma. Clause-joining commas were kept, see X-05 |
| D-36 | Sentence-case headings | House style wants numbered H2 headings in capitals | Kept the source's heading case | Restructuring is out of scope for this phase and belongs to phase 3 |
| D-37 | Three-item lists and three-subsection groups | House style discourages exactly three | Kept the source's counts | Section order and emphasis are part of what is being adopted |

### 4.4 Things the upstream English README dropped, and this translation kept

| ID | Source | Upstream English | Chosen | Why |
|---|---|---|---|---|
| D-22 | 零门槛快速使用 | "Quick Start" | "Zero-Barrier Quick Start" | The Chinese says zero barrier. The claim is the author's to make |
| D-23 | 5 张中文版图表 ... 公众号长文 | "five charts for a long-form article" | "5 Chinese-language charts suited to a long-form WeChat Official Account article" | The English dropped both the language and the platform. Chinese wins |
| D-24 | 青瓷蓝 / 椰林绿 / 编辑部红 | Names dropped, only porcelain / palm / wire kept | "celadon blue", "palm-grove green", "newsroom red" alongside the code identifiers | The Chinese names are content. The identifiers are code |
| D-25 | Bilingual template names, column `中文名 / English` | Only the English names | One `Name` column, using the source's own English names | An English-only document cannot carry a "Chinese name" column. The two names that lost nuance are recorded in section 6, E-09 |

### 4.5 Choices that translation itself breaks

| ID | Source | Problem | Chosen | Why |
|---|---|---|---|---|
| D-28 | `中文 \| [English](README.en.md)` | Once the page is English, a switcher labelling the current page "Chinese" is wrong | Rendered literally as `Chinese \| [English](README.en.md)`, and flagged | Deleting it would drop a section, which is the same failure as a rewrite. Phase 4 decides whether a single-language adoption keeps a switcher at all |
| D-29 | `readme-hero-zh.png`, `moxt-quick-start-zh.png`, `docs/assets/reports/report-NN.png`, `moxt.ai/zh-CN/hub` | These point at Chinese-language screenshots and a Chinese locale | Kept exactly as the Chinese source has them | Re-pointing assets is a content decision, not a translation. The upstream English README uses `-en.png`, `reports/en/` and `moxt.ai/hub`, and those files exist on disk, so the swap is available to phase 4 |
| D-30 | Chinese `alt` text on those same images | The alt describes a Chinese screenshot | Translated the alt, left the `src` | Alt text is prose a reader hears. The result is English alt text on a Chinese screenshot, which is the visible symptom of D-29 |

---

## 5. SOURCE DEFECTS FOUND

Translated faithfully and recorded, per the phase rule that something reading wrong is a
finding rather than something to fix inside a translation.

| ID | Where | What | Severity |
|---|---|---|---|
| S-01 | `README.md` Templates table and Structure block | Says Lupi Editorial 15, Lupi Basics 13, Glance 18 and "49 chart types", while `catalog.md` says 20, 17, 22 and 64, and the README's own Preview section says 20, 17 and 22 | Confusing, not wrong. See the derivation below |
| S-02 | `templates/color/README.md` | Cites "the gate one rule in SKILL.md". SKILL.md has no section or rule of that name | Dangling cross-reference |
| S-03 | Wire preset | Named 编辑部红, newsroom **red**, but described everywhere as grayscale plus one fluorescent **orange** | Name contradicts description |
| S-04 | `examples/README.md` | Lists "Hundred Faces" and "Ballot Rings" among 8 templates. Neither is in `catalog.md` | They are out-of-library builds, which SKILL.md section 6 permits, but the table calls them templates |
| S-05 | `THIRD_PARTY_NOTICES.md` | An authored document carrying 128 Han characters that the phase brief did not list | Caught by the whole-tree sweep. Now translated |
| S-06 | `scripts/validate.mjs` | Asserts Chinese string literals against `SKILL.md` and `catalog.md`. Any faithful translation breaks them | P0 for phase 4. Detail in section 8 |
| S-07 | `templates/reports/report-NN.en.html`, 12 files | Carry 6,285 Han characters between them, all in build and design comments. "English version" describes the rendered page, not the file | P1 for phase 4 |

**S-01 derivation.** 15 is exactly L1 to L15, 13 is exactly F1 to F13 and 18 is exactly
G1 to G18. Those are precisely the primary-tier boundaries SKILL.md section 0 rule 3.1
states, and 15 + 13 + 18 + 3 interactive charts gives 49, which matches the Structure
block. So the table is almost certainly counting the primary tier. This is DERIVED, not
confirmed: the README never says "primary tier", and its own Preview section quotes the
full counts two screens earlier. Recorded as U-01.

---

## 6. DISAGREEMENTS WITH THE UPSTREAM ENGLISH README

`README.en.md` is a separately written summary, not a translation. Nine disagreements.

| ID | Chinese says | `README.en.md` says | Resolution |
|---|---|---|---|
| E-01 | Report screenshots at `docs/assets/reports/report-NN.png` | `docs/assets/reports/en/report-NN.png` | Kept the Chinese path, see D-29 |
| E-02 | `readme-hero-zh.png`, `moxt-quick-start-zh.png`, `moxt.ai/zh-CN/hub` | The `-en` and non-locale variants | Kept the Chinese, see D-29 |
| E-03 | 零门槛快速使用, zero-barrier quick start | "Quick Start" | Kept the Chinese claim, see D-22 |
| E-04 | The first example prompt asks for Chinese-language charts for a WeChat Official Account article | "five charts for a long-form article" | Kept the Chinese, see D-23 |
| E-05 | The Design section closes on what the new idea is, that chart selection, editorial typography, browser interaction and whole-page narrative go into one reusable skill | The sentence is absent | Kept the Chinese sentence |
| E-06 | Presets carry Chinese names alongside the identifiers | Only porcelain, palm and wire | Kept the Chinese names, see D-24 |
| E-07 | Families labelled Lupi (编辑叙事型), Glance (快速判断型), Basics (基础编辑型) | Descriptors dropped, Basics renamed "Lupi Basics" | Kept the Chinese descriptors |
| E-08 | Templates table 15 / 13 / 18 and 49 chart types | The same numbers | **They agree, and both disagree with `catalog.md`.** So the English README is not an independent check on S-01 |
| E-09 | 年度数据海报 (annual data poster) and 单位人群一页 (unit-population one-pager) | "Year in Data" and "Population One-Pager" | Used the source's English names, per D-25. The words "poster" and "unit" are the nuance lost |

---

## 7. ACCEPTED VOICE EXCEPTIONS

The scanner reports these and they were left alone. Recording them is what stops the next
pass re-litigating each one.

| ID | Finding | Count | Why it stays |
|---|---|---:|---|
| X-01 | `do` flagged as a vague verb in `SKILL.md` | 50 | Every one is the auxiliary or the negative imperative, "do you enter report mode", "do not read the template name". The vague-verb sense does not occur. Word sense decides, not spelling |
| X-02 | `honest` and `honestly` | 4 | The source's own moral vocabulary, 诚实. Removing it changes what the rules claim |
| X-03 | `make` | 13 | Mostly quoted user speech, "make a few charts", "make this blue a bit deeper", which the scope gate puts out of reach |
| X-04 | `good` | 3 | Renders 好看. The source's register is plain and the sentence is about whether a chart looks good |
| X-05 | Oxford comma candidates remaining | 82 | Clause-joining commas, not serial lists. The scanner classes them `review` at zero points, which is the standard's own signal that a reader decides. The genuine serial commas were removed, see D-35 |
| X-06 | Em dash inside the section 9 code fence | 1 | Sample code |
| X-07 | Heading case and three-item structures | Throughout | Frozen source structure, see D-36 and D-37 |

---

## 8. THE DECISION ON TEMPLATE STRINGS

The phase asked whether user-visible strings inside the chart templates count as authored
text. They do, and they are not translated here.

**What the evidence shows.** The strings a reader of the *output* sees are already
English. Card headlines ("What they fear, tick by tick"), subtitles, source lines and
chart data labels all ship in English in the galleries. The Chinese inside the templates
is two other things: gallery chrome, meaning the page `<title>`, the `<h1>`, the intro
paragraph and the per-card `<span class="badge">` labels, and build comments explaining
design decisions. Gallery chrome is seen by someone browsing the reference gallery, never
by a reader of a delivered chart, because what gets copied out is one card.

**The decision.** That chrome has to become English for an English-only adoption, and
phase 4 does it, not this phase. Two reasons. This phase's scope excludes template
rendering logic, and editing those files requires re-running the source's own
`validate.mjs` and `smoke-new-charts.mjs` to prove the templates still render, which is
phase 4's handoff criterion rather than this one's.

**One class stays Chinese on purpose.** The 12 `.zh.html` report templates and the
`r04-financial-report.zh.html` worked example are Chinese-language variants by design.
Translating them deletes the bilingual report feature rather than adopting it. Whether the
adopted skill keeps the pair is a placement decision, not a translation one.

### The validator collision, S-06 in detail

`scripts/validate.mjs` asserts Chinese literals against the two documents this phase
translated. Running its document-level assertions against the translated files:

```text
assertions run: 40   PASS: 38   FAIL: 2

  FAIL  SKILL.md primary-tier rule: 'L1–L15 与 F1–F13'
  FAIL  catalog.md primary/backup note: '主力与后备'
```

The other 38 pass, including all 16 catalog row assertions, the 5 backup chart names, the
5 custom-palette role tokens and all 12 report-catalog rows, because those are already
English or are identifiers.

The two failures are structural, not accidental. `validate.mjs` line 172 requires the
literal `L1–L15 与 F1–F13` in `SKILL.md`, and line 180 requires `主力与后备` in
`catalog.md`. Both assertions are written in Chinese, so any faithful translation breaks
them. The fix belongs in phase 4 and it is to change the assertion literals to their
English equivalents, "L1 to L15 and F1 to F13" and "Primary and backup". Bending the
translation back toward Chinese to satisfy a test would be the wrong direction.

Two further notes for whoever does that work. The gallery range checks at lines 56, 62 and
67 match `/F1–F17|17 张/`, `/L1–L20|20 张/` and `/22 张|Glance 22/` against the gallery
HTML files, which this phase did not touch, so they still pass today. They will break as
soon as phase 4 translates the gallery chrome, unless the en-dash identifier form survives.
And `validate.mjs` writes its own failure messages in Chinese, which is class D in the
census.

---

## 9. LICENCE NOTICES

A licence conflict now gates the adoption. The source is PolyForm Noncommercial 1.0.0 and
this repository is MIT. That is the operator's decision to make. What this phase can
report is where the notices live, because a translation is exactly the step at
which a notice gets dropped without anyone noticing.

**There are no per-file licence headers anywhere in the source.** A grep for `polyform`,
`copyright` and `SPDX` across every `.md`, `.js`, `.mjs`, `.html` and `.yaml` file in the
tree returns hits in three documents and nowhere else. Not one of the 50 chart templates,
neither shared JS file and neither build script carries a header.

So the entire licence notice chain is these four artifacts:

| Artifact | What it carries | Status after this phase |
|---|---|---|
| `LICENSE` | The full PolyForm Noncommercial 1.0.0 text | Not a translation target, carried as is. Must travel with the work |
| `README.md` License section | Names the licence, links `LICENSE`, states the noncommercial terms, points at the notices file | Translated, all four elements intact |
| `THIRD_PARTY_NOTICES.md` | States that Chart.js, ECharts and Inter are outside the repository's PolyForm licence and keep their own | Translated, the PolyForm reference intact |
| `README.en.md` License section | The upstream English equivalent | Cross-check only, not rewritten |

Two consequences worth stating plainly.

**The chain is short and therefore fragile.** Two of its four links are documents this
phase rewrote. Because no file carries its own header, dropping the README License section
or the notices file during migration would stop the terms travelling with the work
entirely, and nothing in the tree would flag it. Both survived here, verified by grep
against the translated output.

**If the resolution is to vendor with the terms travelling alongside**, the missing
per-file headers become a task rather than a discovery. Adding them is easier before 50
templates are edited than after.

Nothing produced by this phase left
`specs/sk-doc/051-sk-create-chart/002-translation-and-voice/scratch/translated/`. Nothing
was copied into `.opencode/skills/`.

---

## 10. UNKNOWNS

| ID | Question | What would settle it |
|---|---|---|
| U-01 | Are the README's 15 / 13 / 18 and 49 counts a deliberate primary-tier count, or stale numbers left behind when 16 charts were added? | Ask upstream. Git cannot answer it: the clone holds a single squashed commit that adds every file at once, so there is no before state to diff |
| U-02 | Does the adopted skill keep the bilingual report pair, the 12 `.zh.html` templates and the Chinese worked example? | Phase 1's placement decision and phase 4's migration scope |
| U-03 | Does gallery chrome count as user-visible for the adopted skill, or is a gallery an internal reference page? | Phase 4, when it decides what a delivered chart carries |
| U-04 | Is 门一, "gate one", a renamed section in an earlier version of SKILL.md, or a typo? | Upstream. The current SKILL.md has no such section, see S-02 |

---

## 11. VERIFICATION

| Check | Command | Result |
|---|---|---|
| Zero Chinese in the translated set | Perl scan over Han plus CJK punctuation ranges, all 7 files | 0 characters |
| Voice scanner clean | `hvr_scan.py` over all 7 files | Exit 0, hard blockers 0 in every file |
| Section-for-section match | Heading extraction and comparison against each source | See section 11 |
| Source validator assertions | The 40 document assertions from `scripts/validate.mjs` | 38 pass, 2 fail by construction, S-06 |

`SKILL.md` runs to 355 lines. Per the scope gate's length caveat, the number to read for
it is the hard-blocker count of 0 and a deduction density of 20.6 per hundred lines, not
the absolute mechanical ceiling of 27 out of 100, which length alone drives down.

---

## 12. RELATED DOCUMENTS

- **Translated output**: `../scratch/translated/`
- **Phase specification**: `../spec.md`
- **Parent specification**: `../../spec.md`
