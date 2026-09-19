# Per-mark baseline: punctuation and reply-shape rules

Pre-change record. Every reference is the line in the named file at commit 4512473a. Where one file instructs a mark, one row. Where two files instruct the same mark, both rows appear and the note says whether they agree. The instruction cell carries one clause.

Coverage. The instruction text was read in full in repo-rules/communication.md, 202 lines, and in the hvr reference. Every other file was swept twice. First pass: em dash, en dash, semicolon, serial, Oxford, exclamation, ellipsis, parentheses, bullet, bold, header, table, colon, backtick, code span, inline code and the not X but construction, across AGENTS.md, REPO RULES.md and the eleven files under repo-rules/. Second pass: quotation, curly, full stop, apostrophe, asterisk, hyphen, question mark and bracket, which closed the vocabulary gaps the first pass left. The second sweep returned only verb uses of the word quote, no hidden instruction.

What the roots carry. AGENTS.md section 8, lines 397-408, holds the pointer at 399 and no mark instruction of its own. REPO RULES.md holds the trigger row at 47 and the index row at 65, both summaries. Neither root instructs any mark directly. The sweeps found mark instructions in exactly two rule files besides communication.md. Delegation-and-orchestration.md:84-85 governs the answer shape of a delegate brief. Presenting-decisions.md:91 governs the intended-path instruction. Delegation-and-orchestration also uses the words at 40, 136, 152 and 185, still usage. evidence-and-proof.md, root-cause-and-debugging.md and scope-discipline.md returned no hits at all. blast-radius.md, handoff-and-questions.md, prevent-overengineering.md, skill-hub-routing.md and uncertainty-and-honesty.md returned usage only.

Where this note says hvr-rules.md it means .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md. Line references into communication.md:104-126, 141-144, 153 and 157 refer to the pre-change file, those lines move or change under the phase 2 diff. The hashes in scratch/measurement-baseline.md pin the wording.

## Governed

| Mark | Where | Instruction | Note |
|---|---|---|---|
| Em dash | communication.md:104-106 | never use one, replace it with a comma, a full stop or a colon, whichever the sentence actually wanted | |
| Em dash | hvr-rules.md:114 | never use, replace with a comma, a full stop or a colon | the two agree, same direction, same three replacements. hvr:457 and 470 repeat the ban in the scoring material |
| Semicolon | communication.md:110 | none, write two sentences or use a conjunction | |
| Semicolon | hvr-rules.md:115 | never use, two sentences or a conjunction | the two agree, the wording matches. hvr:127-128 gives the worked example, hvr:470 repeats the ban |
| Serial comma | communication.md:111 | drop it before the and or or that closes a list | |
| Serial comma | hvr-rules.md:116 | never the Oxford comma, drop it before the and or or, examples at 130-131 | the two agree. hvr:470 and 457 repeat it |
| Colon before a clause | communication.md:104 | one of the three replacements for the dash, whichever the sentence actually wanted | the only instruction the clause colon gets. The colon at 105 introducing the aside is usage, not instruction |
| Colon before a list | communication.md:106 | the list the dash was hiding belongs after a colon | same passage, same scope. No general rule for either colon exists anywhere in the scanned set |
| Table in a reply | communication.md:141-144 | none, one or two facts go in a sentence, parallel items go in a bulleted list, a table earns its place in a file someone returns to, never in a reply they read once | |
| Table in a reply | hvr-rules.md:147-154 | scoped to a conversational reply, never to a document, same three-part rule, worked example at 156-164 | the two agree. The hvr section reads as the expansion, it adds the reason, a reply is read once while a document is scanned again |
| Table in a delegate brief | delegation-and-orchestration.md:84-85 | a table with named columns is one acceptable answer shape a delegate returns | a different scope, a brief rather than a reply, it sits beside the reply ban without contradicting it |
| Bullet list | communication.md:80-82 | prefer prose when a list would fragment a single argument, the list format implies the items are independent and readers believe it | |
| Bullet list | communication.md:142-143 | parallel items go in a bulleted list | same file, second rule, no conflict, one decides when to fragment, the other says what goes in the list |
| Bullet list | hvr-rules.md:153 | put parallel items in a bulleted list | agrees with communication.md:142 |
| Bullet list, intended path | presenting-decisions.md:91 | state the intended path as three to seven bullets | its own rule, the disclosure before a long stretch. Consistent with the reply-side rules, different scope |
| Three-item enumeration | hvr-rules.md:166-168 | avoid exactly three items, use 2, 4 or 5, cut one or add a fourth if three arise, checklist repeat at 481 | one source. hvr:25 names it an AI tell |
| Bold | hvr-rules.md:117 | never asterisk emphasis in output, let the word carry the weight, allowed in the Markdown source | reaches a reply through the voice-half adoption, communication.md:121-122. The checklist at 470-471 repeats the asterisk rule |
| Headers in a reply | communication.md:122-124 | a reply has no headings, no front matter and no publish step, so the document-structure half of hvr does not apply | the hvr document-side header rules, the triple-header count at 170-172 and fragmented headers at 287-300, govern documents, not replies |
| Ellipsis | hvr-rules.md:118 | at most one per piece, a trailing thought, never dramatic pauses | the checklist at 471 repeats it, 457 lists it under the punctuation attention row |
| Quotation marks | hvr-rules.md:119 | straight quotes only, never the curly kind | the nearest thing to the quotation-of-a-path-or-command item. No file in the scanned set says how to mark a quoted path or command. Backticks are used throughout, for example communication.md:111 and REPO RULES.md:50, recorded as usage, not instruction |
| Not X but Y | hvr-rules.md:138-140 | never the construction or its variants, not only X but Y, it's not X it's Y, more than just X, lead with the stronger point or use and, worked example at 142-145, checklist repeat at 480 | one source |
| Sentence rhythm | communication.md:79-80 | vary the rhythm, uniform sentence length reads mechanical and uniform structure hides emphasis | |
| Sentence rhythm | hvr-rules.md:98-99 | vary sentence lengths, mix short, under 8 words, with medium, 8-15, and long, 15-25 | the two agree in substance, the hvr version adds the numbers. communication.md:116-119 routes the full standard, the vocabulary and the tells this rule does not repeat, to the hvr reference |
| Emoji | hvr-rules.md:120 | at most one per piece, it must add clarity or tone, not decoration | the punctuation checklist at 470-471 repeats the other bans but not this one |
| Corporate register | communication.md:157 | cut the corporate and marketing register, its named offenders: robust, seamless, leverage, best-in-class | |
| Corporate register | hvr-rules.md:375 | leverage, robust and seamless are hard blocker words, minus 5 each, with the replacements use, strong and smooth | the two agree, the hvr list is longer and scores. The soft list at 415-417 adds scalable and actionable as buzzword-usage deductions |
| Empty opener | communication.md:153 | cut the openers, "Great question", "Let me take a look", "I'll now" | |
| Empty opener | hvr-rules.md:180, 435 | the setup-language list at 180-187 and the AI-phrase list at 435 cover the same ground, "Let's take a look" and "Great question" | the two agree in substance, the wording differs, Let me take a look at 153 against Let's take a look at 180 |

Eighteen marks governed, twenty-eight rows. Two of the minimum list, the clause colon and the list colon, draw their entire instruction from one passage, 104-106.

## Not governed

- En dash: no instruction found in the scanned set. The rule names the em dash, communication.md:104, then speaks of "A dash" at 105 and "dashes" at 113. Trigger 22, "remove the dashes", is the plural. The en dash sits in the gap between the singular instruction and the plural trigger, recorded as a gap.
- Exclamation mark: no instruction found in the scanned set.
- Parentheses: no instruction found in the scanned set.

The quotation-of-a-path-or-command item is recorded under the quotation-marks row above. Its marking mechanism, the backtick, is usage in the scanned set and instruction nowhere.
