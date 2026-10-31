---
title: "Iteration 1: Per-part byte decomposition of the 13 repo rules"
trigger_phrases: []
---
# Iteration 1: Per-part byte decomposition of the 13 repo rules

## Focus

Steer question: split each of the 13 rules into the parts — Fires when, rule statement, failure it prevents, examples, self-check, "what this is not", cross-references, rationale — and report one row per rule with bytes per part and total, the counting method stated, totals reconciled to `prep/evidence-pack.md` §1.

## How bytes were counted

Deterministic block-level classification, `scratch/classify-parts.py` (this lineage; output `scratch/parts-dump.txt`):

1. Each file is split into **blocks** — maximal runs of non-blank lines. Each block owns the blank lines that follow it, so block byte spans partition the file and every per-file sum equals `wc -c` exactly (all 13 diffs = 0; grand total 107,092, matching `prep/evidence-pack.md:23`).
2. Every block gets exactly one label by **dominant function**: a block is `rule-statement` when a model could violate it (issues or refines a checkable norm); `rationale` when it explains motivation/mechanism/design without adding a norm; `failure-prevents` when its payload is naming the specific failure forestalled; `cross-references` when its payload is "the substance lives elsewhere"; `examples` for demonstrations (quoted utterances, fill-in templates, sample sentences); `fires-when`/`what-this-is-not`/`self-check` by containing section.
3. Two parts outside the steer's eight were added so totals reconcile: `frontmatter` (the YAML block, dominated by `trigger_phrases`) and `header` (`# ` title, `> ` routing quote, `## ` section headings, `---` separators — all headings count as structure, not as their section's part).
4. Deterministic rules classify ~85% of blocks; **40 explicit overrides** (encoded in the script's `OVERRIDES` map with per-block reasons) handle the three systematic edge cases: `> ` blockquotes that are demonstrations or disclosures rather than routing boilerplate; quote-heavy normative blocks; pointer sentences that cite by inline-code `.md` reference rather than markdown link. Borderline calls are listed in §5.

## Findings

### 1. The parts table (bytes per part per rule; every row sums to `wc -c`)

| file | frontmatter | header | fires-when | rule-statement | failure-prev | examples | cross-refs | rationale | what-not | self-check | total |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| answer-the-actual-request | 857 | 578 | 352 | 2,847 | 0 | 0 | 0 | 0 | 556 | 454 | 5,644 |
| blast-radius | 694 | 534 | 357 | 4,402 | 378 | 194 | 0 | 0 | 0 | 595 | 7,154 |
| communication-decisions | 994 | 598 | 342 | 3,827 | 568 | 0 | 133 | 244 | 501 | 817 | 8,024 |
| communication-handoff | 1,086 | 668 | 419 | 6,014 | 813 | 0 | 271 | 0 | 595 | 937 | 10,803 |
| communication-prose | 614 | 474 | 195 | 3,591 | 825 | 0 | 255 | 0 | 168 | 760 | 6,882 |
| communication | 808 | 633 | 160 | 4,973 | 1,239 | 753 | 707 | 262 | 695 | 1,228 | 11,458 |
| delegation-and-orchestration | 803 | 623 | 441 | 7,206 | 613 | 0 | 0 | 366 | 496 | 1,164 | 11,712 |
| evidence-and-proof | 893 | 677 | 349 | 7,600 | 491 | 0 | 0 | 165 | 0 | 1,648 | 11,823 |
| prevent-overengineering | 768 | 493 | 383 | 3,571 | 0 | 188 | 857 | 0 | 342 | 772 | 7,374 |
| root-cause-and-debugging | 673 | 568 | 302 | 4,258 | 0 | 0 | 0 | 0 | 0 | 790 | 6,591 |
| scope-discipline | 668 | 612 | 373 | 3,493 | 218 | 0 | 706 | 0 | 0 | 655 | 6,725 |
| skill-hub-routing | 713 | 765 | 421 | 2,418 | 571 | 0 | 484 | 712 | 0 | 489 | 6,573 |
| uncertainty-and-honesty | 675 | 509 | 320 | 3,647 | 193 | 177 | 176 | 0 | 0 | 632 | 6,329 |
| **TOTAL** | **10,246** | **7,732** | **4,414** | **57,847** | **5,909** | **1,312** | **3,589** | **1,749** | **3,353** | **10,941** | **107,092** |

[SOURCE: scratch/parts-dump.txt; totals `wc -c` at .skilled/repo-rules/]

### 2. Aggregate shape of the corpus

- **Normative payload is ~54%** (rule-statement 57,847). Adding the trigger list and the checklists that restate it (fires-when + self-check) puts the operative surface at 73,202 B = **68.4%**.
- **Apparatus is ~17%** (frontmatter 10,246 + header 7,732). Nearly all frontmatter mass is `trigger_phrases` — e.g. 27 phrases in `communication.md:4-29`, 33 in `communication-handoff.md:4-33` — retrieval metadata the model reads but cannot act on [SOURCE: prep/evidence-pack.md §1 counting, file reads].
- **Support prose is ~15%** (failure-prevents 5,909 + cross-refs 3,589 + what-this-is-not 3,353 + rationale 1,749 + examples 1,312). The corpus is already lean on *why*: rationale is only 1.6%.

### 3. The "failure it prevents" device is systematic but uneven

10 of 13 files carry named-failure sentences (5,909 B total), phrased as "The failure this prevents:" — e.g. `communication.md:74-75`, `communication-prose.md:112-113`. Three files never use it: `answer-the-actual-request.md` (its sections are single normative blocks), `prevent-overengineering.md`, `root-cause-and-debugging.md` (names failures inside normative text instead, e.g. `root-cause-and-debugging.md:70` "Each is evidence you are patching in the wrong place").

### 4. Examples are nearly absent — the corpus argues by criterion, not instance

Only **5 demonstration blocks** exist in 107 KB (1,312 B total): the banned-phrase list `communication.md:108-116`, the stakes-read samples `blast-radius.md:48-50`, the climbing-sentence quote `prevent-overengineering.md:80-82`, the LOGIC-SYNC template `uncertainty-and-honesty.md:100-102`, and the runtime-surface table… correction: 4 demonstration blocks + quoted offenders embedded inside normative blocks. The design choice is criterion language ("a caveat earns its place by naming a failure that can happen here", `answer-the-actual-request.md:50`) over before/after instances.

### 5. Self-check is the largest single non-normative part: 10,941 B (10.2%)

Every file ends in a `- [ ]` checklist restating its own rules in checkable form (e.g. `communication.md:239-250` 12 items, `delegation-and-orchestration.md:219-232` 13 items). `evidence-and-proof.md` carries a second checklist mid-file at `:180-185` (counted as self-check: same function). The checklist is the only part that mechanically restates every norm — the closest thing the format has to an enforcement summary, and the largest single compression candidate.

### 6. Cross-references are small but load-bearing for navigation

3,589 B, concentrated where a file defers to `AGENTS.md` or a sibling rule: `scope-discipline.md:106-109` ("Read it there"), `prevent-overengineering.md:104,130`, `uncertainty-and-honesty.md:48-49` (the confidence scale lives in `AGENTS.md` §2, no second copy). Several files restate a sibling's content while pointing — `scope-discipline.md:123-131` restates `AGENTS.md` §3 bindings before adding its own two items (counted cross-references; ~90 B of it is restated norm content — borderline call).

### 7. Where the measured behaviour change sits

The one prohibition with a measured read-effect — semicolons, `prep/evidence-pack.md:46` (37.0%→17.0%) — is a **9-word rule-statement** inside a 6,882 B file: "**No semicolon.** Two sentences, or a conjunction." `communication-prose.md:109`. The measured no-effect prohibition — tables, `prep/evidence-pack.md:45` (17.4%→20.3%) — is a **~500-byte rule-statement block** with embedded justification and an exception `communication.md:91-99`. The byte structure supports a hypothesis for iteration 2: the behaviour-changing unit is the short imperative prohibition; length and embedded justification may dilute it.

## Questions Answered

- Bytes per part per rule: table in §1, method in §0, reconciliation exact (diff 0 on all 13, total 107,092 = `prep/evidence-pack.md:23`).
- Which parts dominate: rule-statement (54%) + self-check (10.2%) + frontmatter (9.6%); support prose is already thin (rationale 1.6%, examples 1.2%).

## Questions Remaining

- Which compression patterns exist inside the rule-statement mass (iteration 2).
- What a shortened `communication.md` / `evidence-and-proof.md` costs in enforcement terms (iteration 3).

## Ruled Out

- Sentence-level classification for the parts table: blocks are the file's authored units (one blank-line-separated idea each); dominant-function per block is auditable and reconciles exactly.
- Counting `> ` routing quotes and `## ` headings inside their sections: they are apparatus, uniform across files.

## Assessment

- `newInfoRatio`: `0.90`
- Novelty justification: produced the corpus's first per-part byte map with exact `wc -c` reconciliation, and surfaced three structural facts the brief did not state: the failure-prevents device is absent in exactly the 3 files that argue inline; demonstrations are ~1% (the corpus teaches by criterion); self-check is the largest non-normative part at 10.2%.
- Confidence: high on the numbers (deterministic script + byte-exact reconciliation); medium on dominant-function labels for ~10 borderline blocks, each listed in `OVERRIDES` with its reason.

## Reflection

- Worked: block spans that own their trailing blank lines reconcile to `wc -c` exactly — zero unexplained bytes.
- Worked: reading all 13 files before writing the classifier caught the `> ` blockquote trap (4 non-header quote blocks) the naive rule would have hidden.
- Limitation: dominant-function is a judgment for mixed blocks (norm + pointer in one block); the 40 overrides make every such call inspectable rather than burying it in a heuristic.

## Recommended Next Focus

Iteration 2 per steer: compression patterns — name, before/after sentence, bytes saved, enforcement at risk — then per-rule token targets. Rich sources already visible: 10,941 B of self-check restatement, ~2,600 B of near-identical routing boilerplate, 10,246 B of trigger-phrase frontmatter, wrapped-line filler inside normative blocks.

## Sources Consulted

- [SOURCE: steer.md (lineage dir)]
- [SOURCE: prep/evidence-pack.md:19-26,45-51]
- [SOURCE: .skilled/repo-rules/ — all 13 files, read in full]
- [SOURCE: scratch/classify-parts.py; scratch/parts-dump.txt]
- [SOURCE: research/deep-research-config.json (fanout executor spec)]
