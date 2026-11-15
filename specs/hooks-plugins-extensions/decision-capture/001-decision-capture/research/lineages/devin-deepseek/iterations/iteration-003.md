# Iteration 3: Reducing judgment for chat answers

## Focus

Gap 3. The chat detector offers a candidate for every asking paragraph paired with the next typed reply, and the saving model decides whether the reply answers the question. This iteration traces what the detector actually emits, what the save step asks the model to decide, and whether a deterministic or cheaper check can reduce that judgment without auto-accepting a wrong answer.

## Actions Taken

1. Read the shared detector `chat-questions.mjs` end to end: paragraph splitting, prose filtering, option handling, pairing, caps and keys.
2. Read the save step's operator-decisions instruction and the save workflow's description of sweeps and candidates.
3. Read the 7-pair labeled fixture and its labels, which record one true answer and three non-answers among the four product candidates.
4. Read 005's acceptance criteria for the detector's guarantees, and 007 ADR-002 for the auto-accept decision and its probe.
5. Read the deep-review report's chat-candidate finding and its class list for related false-positive work.

## Findings

1. The detector pairs by position, not meaning: every asking paragraph in an assistant turn becomes a candidate against the next typed prompt, and the prompt text becomes the candidate's `answer` unchanged. Nothing checks whether the reply answers that paragraph. [SOURCE: .skilled/hooks/decision-capture/lib/chat-questions.mjs:159-217]
2. The save step delegates the decision to the saving model: it writes an `operatorDecisions` entry "for each chat candidate whose answer clearly replies to its question", and notes that several candidates can share one reply. That sentence is the entire decision rule. [SOURCE: .skilled/commands/speckit/save.md:72-74]
3. The labeled fixture holds four product candidates among its seven pairs: one is a true answer (pair 6, a numbered reply to a numbered list of four decisions) and three are non-answers (pair 1, a new investigation request; pair 3, a new deep-review instruction; pair 7, a request for another review). The detector deliberately offers all four; 005's AC-008 requires the true one to be included, not the others to be excluded. [SOURCE: .skilled/hooks/decision-capture/bin/fixtures/claude-chat-questions.labels.json:2-8] [SOURCE: specs/system-speckit/043-decision-capture/005-chat-question-detection/acceptance-criteria.md:63]
4. The three non-answers share a shape: each opens with an imperative verb that starts a new task ("Analyxe", "Do", "ask") and shares no content word with its candidate question. The one true answer opens with a numbered list that maps to the question's numbered list. [SOURCE: .skilled/hooks/decision-capture/bin/fixtures/claude-chat-questions.jsonl:12] [SOURCE: .skilled/hooks/decision-capture/bin/fixtures/claude-chat-questions.jsonl:16] [SOURCE: .skilled/hooks/decision-capture/bin/fixtures/claude-chat-questions.jsonl:24] [SOURCE: .skilled/hooks/decision-capture/bin/fixtures/claude-chat-questions.jsonl:22]
5. ADR-002 already ruled out auto-accept for a lone candidate: its probe returned one candidate for the off-topic reply "actually first fix the login bug" to "Should the badge be blue or amber?". A lone candidate is therefore not evidence of an answer. [SOURCE: specs/system-speckit/043-decision-capture/007-gap-closure/decision-record.md:123-163]
6. A deterministic accept is ruled out by the same evidence: the detector's only structural signals (closing paragraph, options present, later paragraph) do not separate the fixture's true answer from its non-answers, and a lone candidate can be off-topic. Any accept rule would record a non-answer. [SOURCE: .skilled/hooks/decision-capture/lib/chat-questions.mjs:135-146]
7. A deterministic reject-only prefilter is possible but not proven safe. The observed non-answer shape (imperative new task, zero content overlap with the question, no option match, no yes/no form) would catch all three fixture non-answers and ADR-002's reply, but it also rejects valid short answers such as "make it blue" to "which color?" or "use the darker one" to "blue or amber?", unless the rule exempts open-value questions and comparative answers. [SOURCE: .skilled/hooks/decision-capture/bin/fixtures/claude-chat-questions.labels.json:2-8] [SOURCE: specs/system-speckit/043-decision-capture/007-gap-closure/decision-record.md:150]
8. The smallest safe reduction is a deterministic evidence block on each candidate, not a filter: question type (yes/no, alternative, open value, numbered list), option-label match, content-word overlap count, imperative opening, and topic-shift marker. The sweep computes it; the save model still decides, but from structured evidence rather than raw text. It adds no auto-accept and no new write path. [SOURCE: .skilled/hooks/decision-capture/lib/chat-questions.mjs:120-133] [SOURCE: .skilled/commands/speckit/save.md:72-74]
9. If the operator wants fewer judgments rather than better ones, the next step is a reject-only filter measured on a larger labeled set. The current fixture is too small: 4 product candidates, 1 positive, so a rule that catches the 3 observed non-answers has no measured false-reject rate. [SOURCE: .skilled/hooks/decision-capture/bin/fixtures/claude-chat-questions.labels.json:2-8]
10. The deep-review report already carries a related false-positive class for a closing code or quotation paragraph, which was fixed by applying the same prose filter to the closing paragraph. That class is about detection, not answer judgment, and does not change this conclusion. [SOURCE: specs/system-speckit/043-decision-capture/review/review-report.md:134-142]

## Ruled Out

- **Auto-accept a lone candidate.** ADR-002's probe shows a lone candidate can be an off-topic reply.
- **Auto-accept a candidate whose reply matches an option label.** It would accept "b" to a product question with options, but it still cannot tell a reply that names an option from one that merely mentions it, and most questions offer no options.
- **A lexical-overlap threshold as an accept rule.** "yes" answers a yes/no question with zero overlap, and "make it blue" answers "which color?" with zero overlap against the question's words.
- **Ranking candidates and asking the model only about the top one per reply.** Several candidates can share one reply, so a ranking cut can drop the real answer.
- **A full local classifier.** It is a larger change than the evidence block, needs training data the packet does not have, and adds a new model surface to a save path that must stay deterministic.

## Dead Ends

- Looking for a confidence score on candidates: the detector emits none.
- Looking for a question-type field: candidates carry only key, kind, question, answer and turn ids.
- Looking for a save-side deterministic check: the save step is a model instruction, not a script.

## Edge Cases

- **Ambiguous input:** "reduce that judgment" could mean fewer candidates or a cheaper decision per candidate. Chosen interpretation: both, with auto-accept excluded.
- **Contradictory evidence:** the detector's ranking prefers closing paragraphs and options, which sounds like confidence. Resolution: the ranking only decides which candidates survive the cap; it never decides whether a reply answers.
- **Missing dependencies:** the labeled set is 7 pairs, 4 product candidates, 1 positive. Any filter's false-reject rate is unmeasured.
- **Partial success:** no live save was run to observe the model's decisions; the evidence is the fixture labels and the save instruction.

## Sources Consulted

- `.skilled/hooks/decision-capture/lib/chat-questions.mjs`
- `.skilled/hooks/decision-capture/lib/chat-questions.test.mjs`
- `.skilled/commands/speckit/save.md`
- `.skilled/skills/system-spec-kit/references/memory/save-workflow.md`
- `.skilled/hooks/decision-capture/bin/fixtures/claude-chat-questions.jsonl`
- `.skilled/hooks/decision-capture/bin/fixtures/claude-chat-questions.labels.json`
- `specs/system-speckit/043-decision-capture/005-chat-question-detection/spec.md`
- `specs/system-speckit/043-decision-capture/005-chat-question-detection/acceptance-criteria.md`
- `specs/system-speckit/043-decision-capture/007-gap-closure/decision-record.md`
- `specs/system-speckit/043-decision-capture/review/review-report.md`

## Assessment

- New information ratio: 0.84
- Questions addressed: whether a deterministic or cheaper check can reduce the chat-answer judgment.
- Questions answered: the chat-judgment key question.

## Reflection

- What worked and why: reading the labeled fixture rather than only the detector showed that the true answer is structurally distinct (numbered mapping) while the non-answers are imperative task switches, which is the evidence any rule must use.
- What did not work and why: looking for a confidence score or question-type field. Neither exists, so the evidence block is a real addition rather than a threshold change.
- What I would do differently: label more than seven pairs before proposing any reject rule; one positive cannot measure a false-reject rate.

## Recommended Next Focus

Cross-check the three fixes: ownership under the series goal, sequencing and interaction, the verification cost of each, and what remains unresolved before a plan can be written.
