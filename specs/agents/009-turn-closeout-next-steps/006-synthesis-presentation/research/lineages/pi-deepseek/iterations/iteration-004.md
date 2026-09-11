# Iteration 4: Q6 HVR in a Reply and Q7 Duplication Line

## Focus

Two boundary questions that decide the shape of any answer. Q6: `communication.md` section 4 says the
full HVR standard applies "when writing a document rather than a reply", while the operator wants a
chat presentation "structured written with HVR". Quote the boundary, then decide whether HVR can bind
a reply, whether the rule should reach into HVR for the tells while `communication.md` keeps the
reply, or whether the boundary needs changing. Q7: with the sibling packet
`specs/system-deep-loop/046-synthesis-chat-presentation` changing the deep-loop presentation
contracts, where is the line between what a repo rule binds and what a mode contract specifies?

## Findings

**F4.1 The boundary, quoted.** `communication.md` section 4 closes with: "This rule carries the ban
because it fires on every substantive reply. The full standard, including the vocabulary and
structural tells this one does not repeat, is `hvr-rules.md` in `sk-doc`. Load it when writing a
document rather than a reply." [SOURCE: repo-rules/communication.md:117-120]

**F4.2 HVR is document-scoped by its own text.** Its purpose is "Linguistic standards for all
documentation output" [SOURCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:17],
and its usage line applies it "to all AI-generated documentation: READMEs, implementation summaries,
decision records, install guides and spec folder docs"
[SOURCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:29]. Its
pre-publish structure list is document-shaped: "H2 sections numbered ALL CAPS, separated by `---`
dividers", "No Table of Contents and no `<!-- ANCHOR -->` navigation comments"
[SOURCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:455-459]. A chat
message has no H2 hierarchy and no TOC, so that layer cannot bind a reply.

**F4.3 HVR's voice and tell layers are modality-neutral and can bind a reply.** The ten voice
directives are active voice, direct address, conciseness, simple language, clarity, conversational
tone, authenticity, practical focus, sentence rhythm and certainty
[SOURCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:54-106]. The word
and tell lists are the same: hard blocker words, phrase blockers, setup language, the "not just X,
but also Y" construction, three-item enumeration, significance inflation and generic conclusions
[SOURCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:136-149,155-168,283-295,348-378].
None of those requires a document; all of them improve a recommendation message. `communication.md`
already carries the punctuation subset for replies and says HVR holds "the vocabulary and structural
tells this one does not repeat" [SOURCE: repo-rules/communication.md:105-119].

**F4.4 The correct treatment is to reach into HVR for the tells while `communication.md` keeps the
reply, and to name the subset where it is invoked.** Section 4's own sentence already anticipates the
split; its only gap is that the load is scoped to documents, so "written with HVR" on a chat message
is an instruction that contradicts the rule unless the invoking text names the applicable layers. The
mode presentation contracts are the natural place to name them, because a completion message is their
artifact. A wholesale boundary change is not needed for this case. If the operator later wants HVR
grading to bind every reply, the thing to change is section 4's one-line load sentence, a sentence
edit rather than a section: `communication.md` is at 244 lines against the 250 ceiling
[SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/rule-anatomy.md:105,92], and a new
section cannot fit, while the boundary sentence itself is already there to amend.

**F4.5 Q7: the rule-versus-contract line has a test.** If a statement is true in the same way for
every mode and for replies that are not loop output, it is reply doctrine and lives in
`communication.md` or the always-loaded document. If it varies by what the mode produces, it is
mode-contract content. Per-mode field lists vary (iteration 3), so they are contract content; "lead
with the verdict" is identical everywhere, so it is rule content and already exists
[SOURCE: repo-rules/communication.md:154-165]. The existing contracts already demonstrate the split:
the model-benchmark router loads the Lane B contract and "never restates" its flag support
[SOURCE: .opencode/commands/deep/assets/deep-model-benchmark-presentation.txt:270-276], and the
skill-benchmark presentation boundary forbids the router from emitting "benchmark scores, verdicts,
ranked bottlenecks, scenario rows, report wording"
[SOURCE: .opencode/commands/deep/assets/deep-skill-benchmark-presentation.txt:115-119]. The owning
document is the one closest to the artifact.

**F4.6 Q7 applied: what 046 can carry, and what a repo rule would duplicate.** If the sibling packet
adds a content field per mode, the contracts consume the operator's request at the moment it arises: a
research completion message carries the answer, a review message carries the verdict and P0s, and so
on. A repo rule saying the same would restate `communication.md` sections 7 and 8, which already
carry the recommendation shape, the trade-off, required-versus-optional and the stated assumption
[SOURCE: repo-rules/communication.md:169-186]. The corpus's own duplication guard is explicit: "Don't
restate another rule. Link instead" [SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/creation-standards.md:132-145],
and rules default to zero sideways links [SOURCE: .opencode/skills/sk-doc/sk-create-repo-rule/references/rule-anatomy.md:120-128].
The router's scope statement says the same from the other side: Out content is "deliberately absent
here so each has exactly one place to change" [SOURCE: REPO RULES.md:85-87].

**F4.7 Convergence of the test battery.** Q1 passes (trigger-shaped; the mode contract is the load
path at the presentation moment). Q2 passes (In; no fifth widening). Q3 refuses the new-file route on
Part 1 (single row) and Part 2 (the delivery doctrine already has a home; the length ceiling removes
the in-place option). Q4 finds a real failure, so the behaviour should exist, and locates that failure
in the presentation templates. The placement that satisfies all four without duplication is the mode
contracts, which is one of the named verdict options. No rule text is drafted; no file outside the
lineage is touched.

## Question Answers

- **KQ-6: HVR can bind a reply in part, and the tells route is the right one.** Voice directives and
  the word/tell lists apply to any prose; the document-structure layer (numbered ALL-CAPS H2s,
  dividers, no TOC) does not. The mode contracts should invoke the applicable subset by name.
  Section 4's boundary does not need to change for this case; only if HVR is to bind every reply
  generally does its one-line load sentence need a targeted amendment, which fits under the ceiling.
- **KQ-7: rule binds cross-cutting reply posture; contract binds what the mode produces and what its
  completion message carries.** Per-mode field lists cannot be a rule without restating
  `communication.md` sections 7 and 8; the contract is also the only artifact that loads at the
  fan-out and non-interactive completion moments. The sibling packet is the right owner, and the
  rule set needs no change.

## Ruled-Out Directions

- **"Written with HVR" as a wholesale instruction for a chat reply.** HVR section 9 imposes document
  structure; a reply is not a document.
- **A new repo rule restating the recommendation doctrine to bind the contracts.** It would duplicate
  `communication.md` sections 7 and 8, and `communication.md` has no room for it.

## New Information Ratio

0.6. The voice-versus-structure split inside HVR and the rule-versus-contract test are net-new; Q6's
outcome largely confirms the section 4 design, and Q7 assembles findings from iterations 1 to 3
rather than discovering new ground. The convergence is by design: the iteration cap is four.
