# Iteration 2 - Clarity rules 06-18

## Focus

This pass maps the remaining Clarity rules to sentence mechanics, the wording standard, decision presentation and the projection contract. The key distinction is authored prose versus a display-only rewrite.

## Findings

- **Clarity 06, be specific enough to be wrong, already-covered.** The source requires verifiable specifics and forbids invented details. The wording standard backs claims with data or examples and its generalisation checks name the source, person, number or date. Candidate owner is the wording standard. [SOURCE: `specs/sk-communication/006-sk-communication-clarity/context/clarity.md:80-91`; `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:78-103`, `240-253`]

- **Clarity 07, put someone in the sentence, already-covered.** The source requires human agency and permits second-person address when no specific actor fits. The wording standard requires active voice and direct address. Candidate owner is the wording standard. [SOURCE: `specs/sk-communication/006-sk-communication-clarity/context/clarity.md:93-100`; `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:41-51`]

- **Clarity 08, use the plain word and break the long sentence, already-covered.** The source asks for common words and single-idea sentences. Prose mechanics already requires one idea per sentence and plain words, while the wording standard repeats both requirements. Candidate owner is `repo-rules/prose-mechanics.md`, with the wording standard as the cross-surface standard. [SOURCE: `specs/sk-communication/006-sk-communication-clarity/context/clarity.md:102-109`; `repo-rules/prose-mechanics.md:43-83`; `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:53-71`]

- **Clarity 09, cut what does no work and keep honest uncertainty, already-covered.** The source combines deletion of superfluous prose with a warning against stripping real hedges. Communication removes filler and the wording standard says to keep hedging that reflects genuine uncertainty. Candidate owner is `repo-rules/communication.md`, with the wording standard as the accuracy check. [SOURCE: `specs/sk-communication/006-sk-communication-clarity/context/clarity.md:112-119`; `repo-rules/communication.md:101-116, 219-221`; `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:86-90`]

- **Clarity 10, say the relation instead of implying it, already-covered.** The source requires explicit causal or concessive connectors between sentences. Prose mechanics states the same rule and names `because`, `but`, `therefore` and `for example` as the repair. Candidate owner is `repo-rules/prose-mechanics.md`. [SOURCE: `specs/sk-communication/006-sk-communication-clarity/context/clarity.md:121-128`; `repo-rules/prose-mechanics.md:60-65`]

- **Clarity 11, take a position and say where it is weak, new for its strongest-objection clause.** Presenting decisions already requires a verdict, one recommendation, a trade-off and relevant alternatives. It does not require the strongest real objection to receive its own paragraph and an answer or concession. Candidate owner is the named existing repo rule `repo-rules/presenting-decisions.md`, by extending its decision handoff rather than adding a second general voice rule. [SOURCE: `specs/sk-communication/006-sk-communication-clarity/context/clarity.md:130-138`; `repo-rules/presenting-decisions.md:55-86`]

- **Clarity 12, write the way you would say it, already-covered.** The source asks for conversational prose and a read-aloud test. The wording standard says to write naturally and read the text aloud. Candidate owner is the wording standard. [SOURCE: `specs/sk-communication/006-sk-communication-clarity/context/clarity.md:140-149`; `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:63-71`]

- **Clarity 13, do not perform, already-covered.** The source rejects fake erudition, fake humility and a studied voice. The repository communication rule rejects performance and timid delivery, while the wording standard requires authenticity without marketing spin. Candidate owner is `repo-rules/communication.md`, with the wording standard providing the prose test. [SOURCE: `specs/sk-communication/006-sk-communication-clarity/context/clarity.md:150-153`; `repo-rules/communication.md:212-218`; `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:73-76`]

- **Clarity 14, give the first sentence its one job, already-covered.** The source rejects topic or intent setup and asks the opening to earn the next sentence. Communication requires the first line to carry the payload and HVR removes setup language. Candidate owner is `repo-rules/communication.md`, with HVR as the wording standard. [SOURCE: `specs/sk-communication/006-sk-communication-clarity/context/clarity.md:156-161`; `repo-rules/communication.md:136-145`; `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:176-193`]

- **Clarity 15, make each paragraph earn the next, already-covered.** The source requires causal or question-driven progression between paragraphs. Communication says that each paragraph carries the reader forward and names what changed, what it implies and what comes next. Candidate owner is `repo-rules/communication.md`. [SOURCE: `specs/sk-communication/006-sk-communication-clarity/context/clarity.md:163-168`; `repo-rules/communication.md:149-156`]

- **Clarity 16, stop where the thought stops, already-covered.** The source rejects summary litany and vague optimism. Communication ends when the answer is done, and HVR forbids generic positive conclusions. Candidate owner is `repo-rules/communication.md`, with HVR as the document check. [SOURCE: `specs/sk-communication/006-sk-communication-clarity/context/clarity.md:170-175`; `repo-rules/communication.md:185-195`; `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:290-300`]

- **Clarity 17, rewrite by cutting and reordering, contradicting on the projection lane.** The source defines rewriting as moving paragraphs and deleting sections. The repository's in-context and external rewrite commands define the pass as copy editing without reordering, cutting or adding, and `sk-communication` calls its provider pass smoothing only. Candidate owner of the existing constraint is `.opencode/skills/sk-communication/SKILL.md` and the two rewrite commands. This is a conditional contradiction. HVR still governs authored documentation, but a display projection carries the author's meaning and may not change its structure. [SOURCE: `specs/sk-communication/006-sk-communication-clarity/context/clarity.md:177-186`; `.opencode/commands/rewrite/response.md:15-22`; `.opencode/commands/rewrite/response-by-external-agent.md:47-56`; `.opencode/skills/sk-communication/SKILL.md:172-186`]

- **Clarity 18, read it aloud, already-covered.** The source makes an every-send read-aloud check. HVR makes reading aloud part of the conversational-tone directive. Candidate owner is the wording standard. [SOURCE: `specs/sk-communication/006-sk-communication-clarity/context/clarity.md:187-192`; `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:63-71`]

## Contradiction list

- **C-CL-17.** Cutting and reordering is valid for a writer editing their own document, but it conflicts with the repository's display-only copy-editing contract. The repair is to keep the source rule in an authored-writing lane and reject it as a projection behavior. [SOURCE: `scope-and-exemptions.md:25-50, 97-113`; `response.md:15-22`; `response-by-external-agent.md:47-56`]

## Convergence telemetry

Pre-cap convergence is treated as continue. New-information estimate is 0.68 because Clarity 10 and 15 are explicit matches in the current stack, Clarity 11 adds one missing objection-handling detail and Clarity 17 exposes a projection-specific contradiction. [SOURCE: `deep-research-config.json`; `deep-research-strategy.md`]

## Next focus

Map the Claude Style Patch and README, including its colon rule, repair format, structure advice, document and comment scope and personality guidance.
