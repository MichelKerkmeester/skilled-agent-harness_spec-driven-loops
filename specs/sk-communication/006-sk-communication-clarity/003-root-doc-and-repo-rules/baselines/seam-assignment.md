# Seam assignment: communication.md

Pre-change record for the phase 003 split. Every line number is the line in the named file at commit 4512473a, the head this phase captured. See scratch/measurement-baseline.md for the full hash and the hashes of every scanned file. Nothing has been moved.

The conductor's decision, applied here as found. Sections 2, 3 and 4 become repo-rules/prose-mechanics.md, which the next dispatch creates, see tasks.md:50. Sections 1, 5, 6, 7 and 8 stay in repo-rules/communication.md. Section 9 splits by the section each checklist item checks. Each frontmatter trigger phrase goes with the section its words come from.

## Section to side

| Section | Lines | Side | Why |
|---|---|---|---|
| Frontmatter and scope | 1-53 | communication.md | scope contract, the split rewrites it |
| 1. THE REGISTER YOU ARE IN | 57-66 | communication.md | the register, not mechanics |
| 2. SENTENCES AND PARAGRAPHS | 70-84 | prose-mechanics.md | sentence and paragraph mechanics |
| 3. WORDS | 88-98 | prose-mechanics.md | word choice |
| 4. PUNCTUATION THE READER TRIPS ON | 102-126 | prose-mechanics.md | punctuation mechanics |
| 5. LENGTH | 130-144 | communication.md | reply length, no tables |
| 6. CUT FILLER | 148-161 | communication.md | filler, whole reply |
| 7. WHEN THE READER DID NOT FOLLOW | 165-177 | communication.md | repair, whole reply |
| 8. WHAT THIS RULE IS NOT | 181-192 | communication.md | scope and exemptions |
| 9. SELF-CHECK, the heading | 196 | structural | travels with its items |
| 9a. item, the three marks | 198 | prose-mechanics.md | checks section 4 |
| 9b. item, sentence information | 199 | communication.md | checks section 6 |
| 9c. item, length | 200 | communication.md | checks section 5 |
| 9d. item, modality | 201 | communication.md | checks section 7 |
| 9e. item, omissions | 202 | communication.md | checks section 8 |

Item wording, communication.md:198-202. Line 198 reads "No em dash, no semicolon, no serial comma." Line 199 reads "Every sentence carries information; no empty opener, restated summary, or unnamed warning survived." Lines 200, 201 and 202 check length, repair and the scope exemptions.

Coverage note: sections 1, 2 and 3 have no checklist item. After the split the mechanics half inherits exactly one item, 198, and the reply-shape half inherits 199 through 202.

## Boundary cases

Each case: the line, what it governs, the call. Nothing moved.

| Where | What | Call |
|---|---|---|
| communication.md:3 and 46-47 | The one-sentence contract names a mechanics unit, one idea per sentence, and a reply-shape unit, nothing that does not carry information. The description at line 3 spans both the same way. | Both stay whole in communication.md as the scope contract. The mechanics half states its purpose by reference, it does not carry the contract. |
| communication.md:40-42 | The note says this file carries what AGENTS.md section 8, line 399, used to hold in full. That stops being true once the mechanics half exists. | Stays. Phase 2 rewrites it with the scope statement, see tasks.md:52. |
| communication.md:80-82 | The paragraph section carries the list-versus-prose guidance, which governs reply shape, the other side's unit. | Moves with section 2. Phase 2 keeps it consistent with the no-tables rule at 141-144, which sends parallel items to a bulleted list. |
| communication.md:116-126 | The punctuation section carries three things. The delegation of the full standard to the hvr reference, 116-119. The adoption terms at 121-122 and the fact at 123-124 that a reply has no headings, no front matter and no publish step. The verdict at 124-126 that a message presenting a long run's result is a reply by delivery. | Moves with section 2. Lines 123-124 are the reply-shape side's only instruction about headers in a reply, and 124-126 decide what counts as a reply. Both facts must stay reachable from the reply-shape half after the move. |
| communication.md:17 | The trigger phrase "table or prose" draws its words from section 5 and, through the word prose, from section 2 at line 81. | Primary section 5, the phrase goes to communication.md. |

## Trigger phrase split

Frontmatter trigger_phrases, communication.md:4-24, twenty phrases. Each goes with the section its words come from.

To prose-mechanics.md:

- "one idea per sentence", line 5, from section 2
- "atomic paragraphs", line 6, from section 2
- "vary the rhythm", line 7, from section 2
- "plain words", line 8, from section 3
- "em dash", line 21, from section 4
- "remove the dashes", line 22, from section 4
- "punctuation", line 23, from section 4

To communication.md:

- "cut filler", line 9, from section 6
- "empty opener", line 10, from section 6
- "corporate language", line 11, from section 6
- "marketing language", line 12, from section 6
- "match length to the question", line 13, from section 5
- "wall of text", line 14, from section 5
- "no tables", line 15, from section 5
- "don't use tables in chat", line 16, from section 5
- "table or prose", line 17, from section 5, see the boundary case
- "change modality not volume", line 18, from section 7
- "I don't follow", line 19, from section 7
- "in simple terms", line 20, from section 7
- "too abstract", line 24, from section 7

Seven phrases to the mechanics half, thirteen to the reply-shape half. Twenty, which is the whole list at 5-24.

## REPO RULES.md rows that reach this rule

- Trigger-table row, REPO RULES.md:47. You are about to: Write any substantive reply, or the reader says they did not follow. Load: communication.md. Its third column reads: "How a reply reads: sentence shape, plain words, punctuation, length, filler, and no table in a reply." After the split three of those six units, sentence shape, plain words and punctuation, live in the mechanics half. Phase 2 updates the row, see tasks.md:53.
- Index row, REPO RULES.md:65. Its summary reads: "Write so the reader can act after one pass: one idea per sentence, plain words, no table in a reply, nothing that does not carry information." It spans the seam the same way. Phase 2 updates it, see tasks.md:54.

No other row in the 36-70 window reaches this rule. The window covers the trigger table, 36-51, then the divider and the index heading at 52-53, then the whole index, 54-69. Line 70 opens the bounded-by sentence and the window cuts it. The same statement appears complete at communication.md:33.

## AGENTS.md pointers at this rule

- AGENTS.md:146, in section 3. "Registers are expanded by [communication.md] and [presenting-decisions.md] (the intended-path bullet), blast radius by [blast-radius.md]." The register work lives in section 1, which stays. The pointer stays true.
- AGENTS.md:399, the section 8 lead. "How a reply reads is governed by repo-rules/communication.md, and it fires on every substantive reply. Load it before answering: sentence and paragraph shape, plain words, punctuation, length, filler, and what to do when the reader says they did not follow." Three of the six named units, sentence and paragraph shape, plain words and punctuation, move to the mechanics half. The pointer stays true once the scope statement at communication.md:40-42 forwards the reader, the phase 2 task at tasks.md:52. Until then the clause names more than the pointed-at file alone holds.
- AGENTS.md:487, in section 10. "Expanded by [communication.md], and [handoff-and-questions.md] for the close-out row below." Same one-hop dependence as 399. True after the scope statement lands, overstated until then.

These are the only lines in AGENTS.md that name the rule by its path. The search keyed on the literal communication.md across the whole file and returned 146, 399 and 487, which matches the three the dispatch named. A pointer that named the rule without the path would not surface.

## SIZE BEFORE SPLIT

wc -l -c repo-rules/communication.md at commit 4512473a:

```
     202    8512 repo-rules/communication.md
```

202 lines, 8512 characters. This is the input the phase 2 size baseline divides, see tasks.md:56.

## SIZE AFTER SPLIT

wc -l -c repo-rules/communication.md repo-rules/prose-mechanics.md, immediately after the phase 2 edits:

```
     135    5658 repo-rules/communication.md
     106    3945 repo-rules/prose-mechanics.md
     241    9603 total
```

135 lines and 5658 characters where the reply-shape half had 202 and 8512, the mechanics half adds 106 lines and 3945 characters. Same measure, wc, both halves. This is the baseline the later phases check their own additions against, see tasks.md:62.
