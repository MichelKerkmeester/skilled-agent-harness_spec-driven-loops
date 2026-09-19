---
title: "Allocation Table: sk-communication clarity program"
description: "One verdict for each of the 29 merged clarity candidates, the owning document for every adopted one, the non-work register, the rejection list and the reader-profile split."
trigger_phrases:
  - "allocation table"
  - "candidate verdicts"
  - "non-work register"
  - "rejection list"
  - "reader profile split"
importance_tier: "important"
contextType: "general"
---

# Allocation Table: sk-communication clarity program

<!-- SPECKIT_TEMPLATE_SOURCE: allocation-table | v2.2 -->

The rows are the 29-candidate merged list at `001-research-communication-context/research/iterations/iteration-004.md` finding F1, taken as written. The table adds a verdict, an owning document and an ADR reference to each. Nothing was added, merged or split.

---

<!-- ANCHOR:allocation-table -->
## 1. ALLOCATION TABLE

| # | Candidate and the failure it prevents | Merged rows | Verdict | Owning document | ADR |
|---|---|---|---|---|---|
| 1 | Reader triage before drafting - a reply addressed to a reader nobody modeled, drafting before the takeaway is fixed | c1, c2, c3, S:15 | adopt | repo-rules/presenting-decisions.md (sections 1 and 3) | none |
| 2 | Borrowability test - prose anyone could have written, with no sourcing diagnosis | c4 | adopt | .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md | none |
| 3 | Explicit sentence relation - juxtaposition fakes a logical link the writer never stated | c10 | adopt | repo-rules/communication.md, reply-shape half after the phase 003 split | none |
| 4 | Sequential progression - locally atomic paragraphs that carry nobody forward | c15, S:49 | adopt | repo-rules/communication.md, reply-shape half after the phase 003 split | none |
| 5 | First-line contract - payload, not label: an opener that announces, labels, fragments or sets up | c14, S:33, S:35, S:37, A:1 | adopt | repo-rules/communication.md, reply-shape half after the phase 003 split | none |
| 6 | Mechanism visibility - a model whose moving parts are never named | S:9 | adopt | repo-rules/communication.md, reply-shape half after the phase 003 split | none |
| 7 | Concise is not compressed - brevity that deletes necessary connective tissue or turns telegraphic | S:11 | adopt | repo-rules/communication.md, reply-shape half after the phase 003 split | none |
| 8 | Nominalization to verb, stacked compression - abstract nouns hiding actions, metaphor piled on nominalization | S:19, S:43 | adopt | .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md | none |
| 9 | Etymological word test - Latinate abstraction where a plain word holds precision | S:21 | adopt | .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md | none |
| 10 | Literal over figurative in replies - idioms the reader must decode | A:15 | adopt | .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md | none |
| 11 | Editing lane for durable prose - rewrite-as-smoothing, no lane owns cut-and-reorder | c17 | non-work | none | ADR-004 |
| 12 | Numbered step path - multi-step work the reader cannot track, unbounded steps | A:2 | adopt | repo-rules/communication.md, reply-shape half after the phase 003 split | none |
| 13 | State restatement cadence - reader must re-orient every turn | A:5 | adopt | repo-rules/handoff-and-questions.md | none |
| 14 | Concrete time estimates - silent duration expectations | A:6 | adopt | repo-rules/presenting-decisions.md (section 4) | none |
| 15 | Two-line sufficiency + closing-deletion test - outcome hidden mid-reply, farewell closers | A:12, A:16 (+A:10 residual) | adopt | repo-rules/communication.md, reply-shape half after the phase 003 split | none |
| 16 | Visible-item cap with completeness safeguard - a list that buries item six, a cap that hides it | A:9 | adopt | repo-rules/communication.md, reply-shape half after the phase 003 split | none |
| 17 | Tangent suppression, offer once at end - a second issue hijacking the reply | A:4 | adopt | repo-rules/communication.md, reply-shape half after the phase 003 split | none |
| 18 | Closing contract - one concrete next action, completed work visible and demonstrable | A:3, A:7 | adopt | repo-rules/handoff-and-questions.md | none |
| 19 | Error-report shape, qualified - an unconfirmed cause asserted as definitive | A:8 | adopt | repo-rules/evidence-and-proof.md | ADR-003 |
| 20 | Reader-model rationale layer - rules with no stated why | A:23 | adopt | repo-rules/communication.md, reply-shape half after the phase 003 split | none |
| 21 | Resident style payload / decay countermeasure - rules decay across a long session, read-only turns load nothing | A:24, A:25, S:1, README:34-35 | non-work | none | none |
| 22 | Reply-quality eval harness - no measurement of whether a rule changes a reply | A:27 | adopt | .opencode/skills/sk-communication/benchmark/ | none |
| 23 | Reply-quality release gate - a style change buys brevity with accuracy | A:28 | adopt | .opencode/skills/sk-communication/benchmark/ | none |
| 24 | Runtime mirror verification - mirror drift, load-layer breakage | A:26, A:29 | non-work | none | none |
| 25 | Comment present-state / no-archaeology - comments narrating their own history | S:31 (S:91-93) | adopt | the sk-code-quality checklist asset | none |
| 26 | Document scan test / headers as labels - a document that cannot be scanned | S:30 (S:79-81) | adopt | .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md | none |
| 27 | Worked exemplar paragraph - style described but never demonstrated | S:29 (S:73-77) | adopt | .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md | none |
| 28 | Reply hierarchy numbering - complex hierarchies flattened into unreadable prose | S:21 (S:51) | non-work | none | none |
| 29 | Rule-file shape: example + repair - a rule that names a habit without showing the fix | README:16-18 | adopt | .opencode/skills/sk-doc/sk-create-repo-rule/assets/repo-rule-template.md | none |

Notes:

1. The ten reply-shape rows are assigned to the half rather than to the whole file because `repo-rules/communication.md` records its own length ceiling and an earlier split decision, and the research makes the split the default first step of phase 003 (iteration-004.md F3, citing communication.md:49-51).
2. Rows 9 and 10 are the two reply-facing wording candidates. Their adoption flows through the voice-half delegation, so the wording standard and the reply-shape half move together or the rule loads for documents and not for replies (iteration-004.md F3, research.md section 4).
3. Rows 22 and 23 adopt with the benchmark folder as their one owning surface. The harness and the gate themselves belong to the measurement phase (iteration-004.md F4).
4. Row 25's owning document is the sk-code-quality checklist asset, the designation the research gives. Its exact repository path was not verified for this table. The run later recorded the candidate as partially covered and narrowed the residual to present-state narration (iteration-004.md F1 row 25, iteration-004.md Questions Remaining, iteration-005.md finding F4).
5. No row carries the verdict reject or already-covered. The 34 source rows the stack already covers were classified as covered before the merge and produced no candidate, so no merged row qualifies for either verdict (iteration-004.md F1).
6. F1's closing arithmetic note totals 24 assigned rows and a residuum of 5. Its surface tally leaves row 29's template owner out and its residuum note adds the doctor and CI leg of row 24 a second time. This table assigns every row, so it records 25 adopted rows, 4 non-work rows and no residuum. Both readings total 29 (iteration-004.md F1, closing arithmetic note).

<!-- /ANCHOR:allocation-table -->

---

<!-- ANCHOR:non-work-register -->
## 2. NON-WORK REGISTER

| # | Candidate | Blocking reason | Owning document |
|---|---|---|---|
| 11 | Editing lane for durable prose | No lane owns cut and reorder today. The rewrite command is display-only and the skill bars file editing (research.md section 2, the clarity table, rule 17). ADR-004 keeps the projection a smoothing pass and rejects both alternatives, which leaves the candidate unhomed (decision-record.md, ADR-004). | none |
| 21 | Resident style payload / decay countermeasure | Gap statement only. The 022 smart-rule-injection packet owns the decay decision and the program strategy declares the mechanism a non-goal (iteration-004.md F1, row 21). | none |
| 24 | Runtime mirror verification | Currently unverified where it matters for this program and deferred. The run's open-questions list kept the byte-compare question and the CI question open for this candidate, and the final synthesis keeps it the one unverified residuum item (iteration-004.md F1 row 24, iteration-004.md Questions Remaining, research.md section 4, iteration-005.md finding F5). | none |
| 28 | Reply hierarchy numbering | No surface today and the lowest value of the four. The numbering rules sit in the document half that the reply exclusion keeps out of replies, so adoption would need a reply-level numbering scheme. Deferred rather than forced onto an existing file (iteration-004.md F1 row 28 and F3, research.md section 2). | none |

<!-- /ANCHOR:non-work-register -->

---

<!-- ANCHOR:rejection-list -->
## 3. REJECTION LIST

| # | Rejected option | Settled by | Reason |
|---|---|---|---|
| 1 | The colon-clause ban | ADR-001 | One instruction per punctuation mark survives, no grandfather clause enters the rule set, and the failure the ban targets (announcing a point before making it) is already covered by the first-line contract and the label-before-payload principle. A punctuation ban adds audit cost without adding coverage. |
| 2 | Renaming the framework term | ADR-002 | The term is the vocabulary the proof standards are written around. Renaming it for a stylistic reason scored lowest of the three options. The adopted form bans the phrase in reply prose and exempts framework wording in the same list entry. |
| 3 | Keeping the evidence rule unchanged on cause ordering | ADR-003 | Error reports would keep burying the fix behind hedging, which is the failure the source names. The adopted qualifier keeps the cause-then-fix order and marks an unconfirmed cause as suspected. |
| 4 | The cut-and-reorder lane | ADR-004 | Doing it properly needs the fidelity contract to become position-aware for prose, which reopens an invariant the original packet froze. |
| 5 | A second, declared operation | ADR-004 | It adds a second lane to a skill whose whole argument is that it has exactly one. |
| 6 | Detectors carried inside the wording standard | ADR-005 | The standard would gain a structured format it has never had, and another skill owns that file. |
| 7 | Detectors in engine code | ADR-005 | They would be a second home for wording knowledge, which the skill's own rule forbids. |
| 8 | A proportion threshold for content loss | ADR-006 | A legitimately tightened paragraph fails while a same-length rewrite that drops a caveat passes. |
| 9 | No content-loss floor | ADR-006 | The omission case stays unchecked by anything, and it is the likeliest failure of a plainer rewrite. |
| 10 | Rejecting an unchanged candidate as not-a-projection | ADR-007 | A correct no-change judgment would read as a failure, indistinguishable from a broken provider. |
| 11 | Passing an unchanged candidate silently | ADR-007 | A no-op stays hidden inside a pass, so the measurement phase cannot tell a rewrite from a provider that did nothing. |
| 12 | Disabled thinking mode on both profiles | ADR-008 | Any provider without confirmed thinking-control capability becomes unusable rather than silently working. Provider-default skips the thinking block, so nothing can fail on that axis. |
| 13 | Keeping the two thinking-mode values different | ADR-008 | The divergence stays unintentional and the two measurement lanes stay non-comparable. |
| 14 | The not-X-but-Y permission | closed, no ADR | The wording standard already bans the antithesis shape outright at hvr-rules.md:140-145, which is the stricter side. The source's permission adds nothing. No change (research.md section 3, conflict C-3). |

<!-- /ANCHOR:rejection-list -->

---

<!-- ANCHOR:reader-profile-split -->
## 4. READER PROFILE SPLIT

The answer to the reader-profile question is the split, recorded here as a decision. The delivery rules bind whenever a reply is written. The reader-conditional rules need an operator-selected mode that stays off by default. That is what the acceptance criteria ask the answer to be (acceptance-criteria.md AC-007), and it is the classification the research reached: the ADHD contract is neither a rule that binds every turn nor a single operator mode (iteration-009.md, Findings 6 and 7 and the verdict, research.md section 1, result 3).

The seven delivery rules, unconditional-compatible, with no existing rule contradicted (iteration-009.md, Finding 6). Each address is a line range into the vendored source skill, `context/i-have-adhd-main/skills/i-have-adhd/SKILL.md`, whose full path sits under this packet's context folder:

1. Lead with the answer or the action (`SKILL.md:33-40`).
2. Number multi-step work (`SKILL.md:42-46`).
3. Name one next action when something is left open (`SKILL.md:57-62`). This one binds only with its floor trimmed, because its mandatory minimum collides with the every-sentence-carries-information self-check when nothing is left open (iteration-009.md, Finding 6).
4. Suppress tangents and queue them (`SKILL.md:64-71`).
5. Make completed work visible (`SKILL.md:89-94`).
6. Matter-of-fact error tone (`SKILL.md:96-101`).
7. No preamble, no recap, no pleasantries (`SKILL.md:109-117`). The research notes the existing filler and self-check rules already cover this one (iteration-009.md, Finding 6).

The three reader-conditional rules, needing a mode or a rewrite (iteration-009.md, Finding 6):

1. Rule 5's prose restatement (`SKILL.md:73-78`). It is the one of the three that contradicts an existing rule. The reply self-check deletes a restated summary as filler (`communication.md:196-200`), so only the rule's tool-mediated half survives as written (iteration-009.md, Finding 3).
2. Rule 6, specific time estimates (`SKILL.md:82-87`). Not safely unconditional, because an estimate for work the agent is about to do is unknowable when the rule is written, and the source's own break condition points the estimates at whoever executes the steps (iteration-009.md, Finding 4).
3. Rule 9's numeric cap, aim for no more than five items per group (`SKILL.md:103-105`). Its completeness invariant (`SKILL.md:107`) stays unconditional, and the repo's matching counterweight is the not-a-license-to-omit clause (`communication.md:189-192`, iteration-009.md, Finding 5).

The seven load through the existing reply-shape rule surface, because that rule's convention is unconditional loading with conditionality placed inside the rule rather than in a switch (`repo-rules/communication.md:41-42`, iteration-009.md, Finding 1). The three need a mode carried by fail-closed operator machinery. The only existing machinery shaped like that is the projection's enablement gate, which is per-machine, stays off by default, and can say that this operator wants the conditional rules but not that this reply is a mode reply (iteration-009.md, Finding 7). Who owns the mode's failure mode, silent-off by design against visible-off on request, stayed open with the research, and this record does not settle it (iteration-009.md, Questions Remaining).

Adopting a rule here and marking part of it reader-conditional there are not in conflict. Row 13 adopts the cadence gap and row 16 adopts the cap together with its completeness safeguard. What stays conditional is rule 5's mandatory every-turn prose restatement and rule 9's numeric enforcement, which are the parts that need the mode (iteration-009.md, Findings 3, 5 and 6, table rows 13 and 16).

<!-- /ANCHOR:reader-profile-split -->

---

<!-- ANCHOR:wording-standard-shape -->
## 5. WORDING STANDARD SHAPE

The wording standard becomes a base plus a supplement rather than two halves. A reply loads the base. A document loads the base plus the publish machinery, which moves to the supplement. The base names the supplement, so neither file can be loaded in ignorance of the other (decision-record.md, ADR-009). Rows 2, 8, 9, 10, 26 and 27 of the table are the six wording-standard rows, and they are allocated on that assumption. Rows 9 and 10 are the reply-facing two. Their adoption flows through the voice-half delegation, so the wording standard and the reply-shape half of `repo-rules/communication.md` move together and neither surface ends up with a rule the other lacks (iteration-004.md F3, research.md section 4). The reply base is also what the projection's provider instruction resolves to, which is why the instruction decision depends on this restructure (decision-record.md, ADR-009 context, ADR-005 decision).

<!-- /ANCHOR:wording-standard-shape -->

---

<!-- ANCHOR:baseline-handoff -->
## 6. BASELINE HANDOFF

The pre-change baseline is captured during phase 003's setup, before its first edit. A baseline taken after the rules change cannot support a regression claim (tasks.md, T016). The measurement side's own dependency says the same thing: the baseline must be captured before the phases that change replies, or the measurement has no before (iteration-004.md F4).

<!-- /ANCHOR:baseline-handoff -->

---

<!-- ANCHOR:lineage-disagreements -->
## 7. LINEAGE DISAGREEMENTS

No disagreement between the two research runs reached this phase. What was compared: the wording-standard question, where the first research answers it (research.md section 1, result 2) and the second research's answer, recorded as ADR-009, adopts the same base plus supplement shape (decision-record.md, ADR-009). The error-report qualifier, where the first research drafts the wording (iteration-004.md F2, conflict C-1) and ADR-003 adopts it as drafted (decision-record.md, ADR-003). The unhomed candidates, where the first research's residuum of four (research.md section 4) and ADR-004's recorded outcome for the editing lane agree (decision-record.md, ADR-004, consequences). Both runs answered the wording-standard question the same way, so the honest record is agreement rather than a tally. The five engine questions only one run addressed could not disagree with anything.

One disagreement is documented inside the first run, and it carries a diagnosis. The C-4 row of iteration-004 F2 named the addresses of the banned term's four occurrences, and the later census found four occurrences at different addresses, two of them in the evidence rule (iteration-006.md, finding F2). Diagnosis: thin evidence. The earlier row carried the right count without the right addresses. The correction was absorbed before this phase: the handoff takes the 29-candidate map as corrected by iteration-006 F2 (research.md section 8), and ADR-002's record protects exactly the occurrences the census found (decision-record.md, ADR-002, implementation).

What was not compared: the second synthesis document itself, which this session did not read. Its decisions are compared as the decision record states them.

<!-- /ANCHOR:lineage-disagreements -->

---

<!-- ANCHOR:arithmetic -->
## 8. ARITHMETIC

The classified union is 81 rows: 34 covered and 47 candidate or decision rows (iteration-004.md F1). Of the 47, three are pure decisions: the colon rule `S:25-29`, not-X-but-Y `S:39` and the load-bearing word ban `S:69`. They resolve as conflicts, not as candidates, so they appear in the rejection list and not in the table (iteration-004.md F1). That leaves 44 candidate rows, which merge into 29 by the failure each one prevents. 15 duplicate rows collapse.

The 29 rows are 25 adopted rows and 4 non-work rows, numbers 11, 21, 24 and 28. Adopted owners: 10 to the reply-shape half of `repo-rules/communication.md`, 6 to the wording standard, 2 to `repo-rules/presenting-decisions.md`, 2 to `repo-rules/handoff-and-questions.md`, 2 to the skill's benchmark folder, 1 to `repo-rules/evidence-and-proof.md`, 1 to the sk-code-quality checklist asset and 1 to the repo-rule template. 10+6+2+2+2+1+1+1 = 25, and 25+4 = 29.

F1's closing arithmetic note totals 24 assigned rows and a residuum of 5, because its surface tally leaves row 29's template owner out and its residuum note adds the doctor and CI leg of row 24 a second time (iteration-004.md F1, closing arithmetic note). This table assigns every row, so it records 25 adopted rows and 4 non-work rows. Both readings total 29.

Section 1 above holds rows 1 through 29, numbered, no gaps. The count was verified mechanically after writing: 29 numbered rows in this section, 29 rows whose verdict cell reads adopt or non-work, and an owner tally that sums to 25.

<!-- /ANCHOR:arithmetic -->
