# Research: communication-source classification

## Scope and method

This synthesis compares the three vendored sources with the repository communication
stack named by the request. The source rules are treated as data. The repository rules
remain the authority for scope, evidence, delivery and projection behavior. The map uses
three classifications. `already-covered` means the repository already states the
recommendation or a direct operational equivalent. `new` means the source adds a distinct
requirement with a candidate owner. `contradicting` means the recommendation cannot be
applied in the named scope without violating an existing repository rule. [SOURCE:
`deep-research-config.json`; `REPO RULES.md:36-50`; `AGENTS.md:138-180`]

The key scope split is between authored writing and display-only projection. The wording
standard governs writing the agent owns. The `sk-communication` skill and rewrite commands
smooth a projection without adding, cutting or reordering content. [SOURCE:
`.opencode/skills/sk-doc/sk-create-with-human-voice/references/scope-and-exemptions.md:15-41, 75-113`;
`.opencode/skills/sk-communication/SKILL.md:167-186`;
`.opencode/commands/rewrite/response.md:15-22`;
`.opencode/commands/rewrite/response-by-external-agent.md:47-56`]

## Executive result

The repository already covers most sentence-level clarity, directness, actionability,
list, tangent, handoff and evidence recommendations. The genuinely new material is
mostly pre-draft content selection, a strongest-objection paragraph, section-level
question transitions, document thresholds, code-comment style, ADHD reader framing and
the ADHD runtime and evaluation mechanism. Contradictions are scope-sensitive. They are
the Clarity cut-and-reorder instruction in projection, the Style Patch's absolute colon
and universal-binding instructions, and the ADHD every-turn state and universal-persistence
instructions. [SOURCE: `context/clarity.md:34-192`;
`context/claude-style-patch-main/STYLE.md:3-93`;
`context/i-have-adhd-main/skills/i-have-adhd/SKILL.md:13-142`;
`repo-rules/communication.md:101-221`;
`repo-rules/prose-mechanics.md:38-127`;
`repo-rules/handoff-and-questions.md:55-136`]

## 1. Clarity rules

1. **Write for one pictured person, already-covered.** `repo-rules/presenting-decisions.md`
   already requires reader triage before drafting and names the gap between what the
   reader holds and needs. Candidate owner is `repo-rules/presenting-decisions.md`.
   [SOURCE: `context/clarity.md:34-42`; `repo-rules/presenting-decisions.md:90-100`]

2. **Know the reader's context and need, already-covered.** The same pre-draft triage
   rule directly covers this reader model. Candidate owner is
   `repo-rules/presenting-decisions.md`. [SOURCE: `context/clarity.md:45-50`;
   `repo-rules/presenting-decisions.md:92-100`]

3. **Choose one arguable takeaway near the beginning, new at general content level.**
   First-line payload and verdict-first rules govern placement, but they do not require
   one arguable takeaway for every kind of prose. Candidate owner is
   `repo-rules/presenting-decisions.md` for decision-bearing prose, or a new repo rule
   for general authored prose. [SOURCE: `context/clarity.md:52-61`;
   `repo-rules/communication.md:136-145`; `repo-rules/presenting-decisions.md:48-63`]

4. **Say something only the author could say, already-covered.** Borrowability requires
   grounding prose in what the writer observed. Candidate owner is the wording standard.
   [SOURCE: `context/clarity.md:62-69`;
   `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:93-103`]

5. **Make every sentence pay and keep a short piece tight, already-covered.** The reply
   rule removes filler and the prose rule requires information-bearing sentences without
   cutting connective tissue. Candidate owner is `repo-rules/communication.md` with
   `repo-rules/prose-mechanics.md`. [SOURCE: `context/clarity.md:71-78`;
   `repo-rules/communication.md:101-116`;
   `repo-rules/prose-mechanics.md:38-47, 118-127`]

6. **Be specific enough to be wrong and do not invent details, already-covered.** HVR
   requires data or examples, rejects vague generalisation and preserves accuracy.
   Candidate owner is the wording standard. [SOURCE: `context/clarity.md:80-91`;
   `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:78-103, 240-253`]

7. **Put a person in the sentence or use second person, already-covered.** Active voice
   and direct address are existing HVR directives. Candidate owner is the wording
   standard. [SOURCE: `context/clarity.md:93-100`;
   `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:43-51`]

8. **Use plain words and break long sentences, already-covered.** Prose mechanics
   requires one idea per sentence and plain words. HVR states the same target. Candidate
   owner is `repo-rules/prose-mechanics.md` with the wording standard. [SOURCE:
   `context/clarity.md:102-109`; `repo-rules/prose-mechanics.md:43-83`;
   `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:53-71`]

9. **Cut what does no work and keep honest uncertainty, already-covered.** Communication
   removes filler without weakening caveats, and HVR says to hedge when uncertainty is
   genuine. Candidate owner is `repo-rules/communication.md` with HVR as the accuracy
   check. [SOURCE: `context/clarity.md:112-119`; `repo-rules/communication.md:101-116, 219-221`;
   `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:86-90`]

10. **State the relation between sentences explicitly, already-covered.** Prose
    mechanics directly requires each sentence to say how it attaches to the prior one
    and gives `because`, `but`, `therefore` and `for example` as repairs. Candidate owner
    is `repo-rules/prose-mechanics.md`. [SOURCE: `context/clarity.md:121-128`;
    `repo-rules/prose-mechanics.md:60-65`]

11. **Take a position, state its weakness and answer or concede the strongest real
    objection, new for the strongest-objection clause.** Presenting decisions already
    requires a verdict, one path, trade-offs and relevant alternatives. It does not
    state that the strongest objection gets its own paragraph and an answer or
    concession. Candidate owner is `repo-rules/presenting-decisions.md`. [SOURCE:
    `context/clarity.md:130-138`; `repo-rules/presenting-decisions.md:55-86`]

12. **Write conversationally and read aloud, already-covered.** HVR contains both
    directives. Candidate owner is the wording standard. [SOURCE: `context/clarity.md:140-149`;
    `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:63-71`]

13. **Do not perform erudition, humility or a studied voice, already-covered.** The
    communication rule rejects performed voice and the wording standard requires
    authenticity without marketing spin. Candidate owner is
    `repo-rules/communication.md` with HVR. [SOURCE: `context/clarity.md:150-153`;
    `repo-rules/communication.md:212-218`;
    `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:73-76`]

14. **Make the first sentence earn the second and remove topic or intent setup,
    already-covered.** Communication puts the answer, verdict or action in the first
    line. HVR removes setup language. Candidate owner is `repo-rules/communication.md`
    with HVR. [SOURCE: `context/clarity.md:156-161`;
    `repo-rules/communication.md:136-145`;
    `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:176-193`]

15. **Make each paragraph earn the next, already-covered.** Communication says each
    paragraph carries the reader forward and names what changed, what it implies and
    what comes next. Candidate owner is `repo-rules/communication.md`. [SOURCE:
    `context/clarity.md:163-168`; `repo-rules/communication.md:149-156`]

16. **Stop where the thought stops, already-covered.** Communication ends when the
    answer is done and HVR rejects generic positive conclusions. Candidate owner is
    `repo-rules/communication.md` with HVR. [SOURCE: `context/clarity.md:170-175`;
    `repo-rules/communication.md:185-195`;
    `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:290-300`]

17. **Rewrite by cutting and reordering, contradicting in display-only projection.**
    Clarity defines rewriting as moving paragraphs and deleting sections. The two rewrite
    commands and the communication skill define their pass as copy editing that cannot
    cut, add or reorder. Candidate owner of the existing constraint is the skill and its
    two rewrite commands. HVR remains the owner for authored-document rewriting. [SOURCE:
    `context/clarity.md:177-186`;
    `.opencode/skills/sk-communication/SKILL.md:167-186`;
    `.opencode/commands/rewrite/response.md:15-22`;
    `.opencode/commands/rewrite/response-by-external-agent.md:47-56`;
    `.opencode/skills/sk-doc/sk-create-with-human-voice/references/scope-and-exemptions.md:25-50, 97-113`]

18. **Read the prose aloud before sending, already-covered.** The wording standard
    already includes the read-aloud check. Candidate owner is HVR. [SOURCE:
    `context/clarity.md:187-192`;
    `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:63-71`]

## 2. Claude Style Patch and README

### Style Patch directives

1. **Treat the section as binding, contradicting if made universal.** The repository's
   communication rules are routed by trigger and scope. A project-scoped style can be
   adopted, but an unconditional global copy would bypass that routing and apply
   writer-owned voice rules to projection. Candidate owner for a scoped version is the
   existing communication rule or skill. [SOURCE:
   `context/claude-style-patch-main/STYLE.md:3`;
   `REPO RULES.md:36-50`; `AGENTS.md:397-405`;
   `.opencode/skills/sk-doc/sk-create-with-human-voice/references/scope-and-exemptions.md:15-41, 75-113`]

2. **Recheck style when a thread becomes dense or long, new.** The current stack has
   long-stretch path updates and state restatement triggers, but it does not have this
   style-specific recheck. Candidate owner is `repo-rules/communication.md` or the root
   `AGENTS.md` if it is intended as universal execution behavior. [SOURCE:
   `context/claude-style-patch-main/STYLE.md:3`;
   `repo-rules/presenting-decisions.md:115-133`;
   `repo-rules/handoff-and-questions.md:55-84`]

3. **Use straightforward, mostly short declarative prose with clear transitions and
   plain words, already-covered.** Prose mechanics and HVR already state this shape.
   Candidate owners are `repo-rules/prose-mechanics.md` and HVR. [SOURCE:
   `context/claude-style-patch-main/STYLE.md:7-7, 19-21`;
   `repo-rules/prose-mechanics.md:38-65, 78-86`;
   `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:43-71`]

4. **Give explanations conceptual grip, name moving parts and show the mechanism,
   already-covered.** Prose mechanics requires the actor, target and change. HVR asks for
   actionable information backed by data or examples. Candidate owner is
   `repo-rules/prose-mechanics.md`. [SOURCE:
   `context/claude-style-patch-main/STYLE.md:9-9`;
   `repo-rules/prose-mechanics.md:67-72`;
   `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:78-81`]

5. **Be concise without becoming compressed or telegraphic, already-covered.** The
   prose rule preserves connective tissue and says that brevity must not make the reader
   rebuild the argument. Candidate owner is `repo-rules/prose-mechanics.md`. [SOURCE:
   `context/claude-style-patch-main/STYLE.md:11-11`;
   `repo-rules/prose-mechanics.md:118-127`; `repo-rules/communication.md:219-221`]

6. **Use a pre-draft thinking block to set the job and cut merely additive material,
   already-covered at the operational level.** The root workflow requires planning, a
   pre-write restraint pass and the smallest complete result. The exact hidden thinking
   block is not a public contract, so its implementation should not be copied as a new
   user-facing rule. Candidate owners are root `AGENTS.md` and
   `repo-rules/communication.md`. [SOURCE:
   `context/claude-style-patch-main/STYLE.md:15-15`;
   `AGENTS.md:175-180, 182-186`; `repo-rules/communication.md:101-116`]

7. **Use SVO order, active voice, concrete nouns and verbs instead of nominalizations,
   already-covered.** HVR and prose mechanics already contain these requirements.
   Candidate owners are HVR and `repo-rules/prose-mechanics.md`. [SOURCE:
   `context/claude-style-patch-main/STYLE.md:19-19`;
   `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:43-61`;
   `repo-rules/prose-mechanics.md:45-48`]

8. **Prefer Anglo-Saxon words when precision is unchanged, already-covered.** HVR's
   plain-word rule has the same conditional precision test. Candidate owner is HVR.
   [SOURCE: `context/claude-style-patch-main/STYLE.md:21-21`;
   `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:95-97`]

9. **Make antecedents clear, already-covered.** HVR flags ambiguous `it` and `this` and
   asks for a specific noun. Candidate owner is HVR. [SOURCE:
   `context/claude-style-patch-main/STYLE.md:23-23`;
   `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:443-449`]

10. **Ban a colon before a clause except for a literal list of three or more,
    contradicting.** The repository permits a colon where the sentence needs it as an
    em-dash replacement and does not make colon use itself a failure. Candidate owners of
    the existing boundary are `repo-rules/prose-mechanics.md` and HVR. The narrower ban
    on label-colon announcing is already-covered by first-line and setup rules. [SOURCE:
    `context/claude-style-patch-main/STYLE.md:25-29`;
    `repo-rules/prose-mechanics.md:90-107`;
    `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:107-117`;
    `repo-rules/communication.md:136-145`]

11. **Lead with the point, use plain connectors and do not announce, already-covered.**
    Communication puts the payload first and removes empty openers. Prose mechanics
    requires explicit relation words. Candidate owners are the communication and prose
    rules. [SOURCE: `context/claude-style-patch-main/STYLE.md:31-33`;
    `repo-rules/communication.md:101-145`; `repo-rules/prose-mechanics.md:60-65`]

12. **Merge verbless fragments into the sentence doing the work, already-covered.**
    Communication rejects fragment openers and HVR rejects setup phrases and empty
    heading restatements. Candidate owners are `repo-rules/communication.md` and HVR.
    [SOURCE: `context/claude-style-patch-main/STYLE.md:35-37`;
    `repo-rules/communication.md:136-145`;
    `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:302-315, 386-401`]

13. **Remove depth-signaling and reserve not-X-but-Y for genuine competing explanations,
    already-covered.** HVR removes setup, significance inflation and the repeated
    antithesis pattern. Candidate owner is HVR. [SOURCE:
    `context/claude-style-patch-main/STYLE.md:39-39`;
    `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:133-178, 290-333, 386-401`]

14. **Avoid stacked compression, keep verbs as verbs, limit adjacent metaphor and cash
    metaphors out, already-covered.** HVR has nominalization, metaphor and generalisation
    repairs. Candidate owner is HVR. [SOURCE:
    `context/claude-style-patch-main/STYLE.md:41-43`;
    `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:206-253`]

15. **Use bullets for parallelism and paragraphs for causality or sequence,
    already-covered.** Prose mechanics assigns list and prose forms by the relation
    between items. Candidate owner is `repo-rules/prose-mechanics.md`. [SOURCE:
    `context/claude-style-patch-main/STYLE.md:45-47`;
    `repo-rules/prose-mechanics.md:50-62`]

16. **Make transitions functional and have each section answer an implied reader
    question, new for the section-level test.** Communication covers paragraph movement
    and HVR covers heading restatement, but neither requires every section to answer an
    implied question. Candidate owner is a new repo rule or HVR's document section.
    [SOURCE: `context/claude-style-patch-main/STYLE.md:49-49`;
    `repo-rules/communication.md:149-156`;
    `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:302-315`]

17. **Use emphasis only when additive, already-covered.** HVR already constrains
    asterisk emphasis and asks that formatting carry meaning. Candidate owner is HVR.
    [SOURCE: `context/claude-style-patch-main/STYLE.md:51-51`;
    `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:107-117`]

18. **Use Tractatus numbering for complex hierarchy but not short lists, new optional
    guidance.** The repository has numbered steps, but not this hierarchy-specific
    numbering preference. Candidate owner is HVR's document section or a new document
    format repo rule. [SOURCE: `context/claude-style-patch-main/STYLE.md:51-51`;
    `repo-rules/communication.md:160-168`]

19. **Keep the answer's shape proportional to the task, already-covered.** Communication
    and the root quality standard match effort to reader need and scope. Candidate owner
    is `repo-rules/communication.md`. [SOURCE:
    `context/claude-style-patch-main/STYLE.md:53-55`;
    `repo-rules/communication.md:219-221`; `AGENTS.md:204-209`]

20. **End when content ends without a summarizing or uplifting closer, already-covered.**
    Communication and HVR both make this an explicit check. Candidate owners are those
    two surfaces. [SOURCE: `context/claude-style-patch-main/STYLE.md:57-57`;
    `repo-rules/communication.md:185-195`;
    `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:290-300`]

21. **Ask clarifying questions only when essential and never use engagement bait,
    already-covered.** Handoff rules restrict questions to decisions that change the
    approach and the close. Candidate owner is `repo-rules/handoff-and-questions.md`.
    [SOURCE: `context/claude-style-patch-main/STYLE.md:59-59`;
    `repo-rules/handoff-and-questions.md:104-136`]

22. **Make corrections direct, specific and unabashed, already-covered.** The root rule
    requires truth over agreement and evidence-based correction. Candidate owner is root
    `AGENTS.md`. [SOURCE: `context/claude-style-patch-main/STYLE.md:61-63`;
    `AGENTS.md:204-209`]

23. **Allow natural color and playfulness, already-covered for authored writing.** HVR
    allows personality, opinions, complexity and controlled imperfection in writing the
    agent owns. The projection contract excludes a reaction the original did not hold.
    Candidate owner is HVR. [SOURCE: `context/claude-style-patch-main/STYLE.md:65-67`;
    `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:337-369`;
    `.opencode/skills/sk-communication/SKILL.md:167-186`]

24. **Ban empty engagement questions, already-covered.** Handoff rules own the final
    question boundary. Candidate owner is `repo-rules/handoff-and-questions.md`. [SOURCE:
    `context/claude-style-patch-main/STYLE.md:68-68`;
    `repo-rules/handoff-and-questions.md:55-84, 104-136`]

25. **Ban `honestly`, already-covered.** HVR lists it as filler. Candidate owner is HVR.
    [SOURCE: `context/claude-style-patch-main/STYLE.md:69-69`;
    `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:427-445`]

26. **Ban `load-bearing` and `crux`, new lexical filters with a scope limit.** HVR does
    not list these two terms as the same ban, so they are new if desired in authored
    output. The filter cannot erase framework terminology in the root document, which
    uses `load-bearing`. Candidate owner is HVR's authored-output word list. [SOURCE:
    `context/claude-style-patch-main/STYLE.md:69-69`;
    `AGENTS.md:140-153`; `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:405-449`]

27. **Use planning and simplicity as guiding maxims, already-covered as posture.** The
    root workflow already requires planning before action and the smallest solution that
    solves the stated problem. Candidate owner is root `AGENTS.md`. [SOURCE:
    `context/claude-style-patch-main/STYLE.md:70-71`; `AGENTS.md:175-180, 204-209`]

28. **Make design documents scannable in 30 seconds and nest only when hierarchy earns
    it, new.** The existing wording standard covers heading substance but does not state
    either threshold. Candidate owner is the wording standard. [SOURCE:
    `context/claude-style-patch-main/STYLE.md:79-81`;
    `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:302-315`]

29. **Use one idea per bullet and avoid ornamental connective tissue, already-covered at
    the general prose level.** The prose and filler rules cover the information and
    decoration failures. Candidate owners are `repo-rules/prose-mechanics.md`,
    `repo-rules/communication.md` and HVR. [SOURCE:
    `context/claude-style-patch-main/STYLE.md:79-81`;
    `repo-rules/prose-mechanics.md:43-58`;
    `repo-rules/communication.md:101-116`]

30. **Use tables for parallel comparisons and key-value pairs for specs, mixed.** HVR
    already allows a table in a document someone returns to, so the document table
    direction is covered at the general level. The narrower comparison and key-value
    selection rules are new document-format guidance. Candidate owner is HVR or a new
    document-format repo rule. [SOURCE:
    `context/claude-style-patch-main/STYLE.md:79-81`;
    `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:144-151`]

31. **Keep code comments concise, present-state oriented, non-historic and visually
    spaced, new.** The root comment rule only bans ephemeral artifact labels and keeps
    the durable why. Candidate owner is root `AGENTS.md`. [SOURCE:
    `context/claude-style-patch-main/STYLE.md:83-89`; `AGENTS.md:44-46`]

32. **Explain options before presenting an AskUser fork, already-covered.** Presenting
    decisions already uses ASK, DO and THEN, while the root protocol consolidates
    questions. Candidate owners are `repo-rules/presenting-decisions.md` and root
    `AGENTS.md`. [SOURCE: `context/claude-style-patch-main/STYLE.md:91-93`;
    `repo-rules/presenting-decisions.md:102-111`; `AGENTS.md:108-112`]

### README directives

33. **Prefer concrete bans with examples and repairs over stated preferences,
    already-covered.** The wording standard already uses directives, wrong and right
    examples, borrowability, tests and an exemplar. Candidate owner is HVR. [SOURCE:
    `context/claude-style-patch-main/README.md:16-18`;
    `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:39-103`]

34. **Append the patch globally or to project and system instructions, mixed.** A
    project-scoped authored-writing rule can fit the existing scope. A global or
    unscoped copy would bypass `REPO RULES.md` routing and could apply writer-owned voice
    to projection. Candidate owner for adoption is the skill with explicit scope, not a
    second canonical root copy. [SOURCE:
    `context/claude-style-patch-main/README.md:20-30`;
    `REPO RULES.md:36-50`;
    `.opencode/skills/sk-doc/sk-create-with-human-voice/references/scope-and-exemptions.md:15-41, 75-113`;
    `.opencode/skills/sk-communication/SKILL.md:1-14`]

35. **Expect compliance to degrade on long threads and use an explicit reminder before
    long prompts, new.** The repository has long-stretch path updates but no equivalent
    style reminder. Candidate owner is root `AGENTS.md` or
    `repo-rules/communication.md`. [SOURCE:
    `context/claude-style-patch-main/README.md:32-37`;
    `AGENTS.md:150-153`; `repo-rules/presenting-decisions.md:115-133`]

The README's license statement permits copying and forking. It is source metadata, not a
communication recommendation or an owning-surface candidate. [SOURCE:
`context/claude-style-patch-main/README.md:39-41`]

## 3. i-have-adhd output rules

1. **Shape output so an ADHD reader can act, new reader-profile requirement.** The
   repository already values actionability, but it does not name this reader profile as
   a separate mode. Candidate owner is the skill, scoped to explicit ADHD mode. [SOURCE:
   `context/i-have-adhd-main/skills/i-have-adhd/SKILL.md:13-29`;
   `repo-rules/communication.md:49-59`]

2. **Keep the mode active until an explicit stop phrase, new when opt-in and
   contradicting if universal.** The source has explicit mode activation and stop
   phrases, so persistence can live in an opt-in skill. Universal activation would
   conflict with the communication projection's default-off behavior and routed scope.
   Candidate owner is the skill. [SOURCE:
   `context/i-have-adhd-main/skills/i-have-adhd/SKILL.md:15-19`;
   `.opencode/skills/sk-communication/SKILL.md:1-14`;
   `.opencode/skills/sk-doc/sk-create-with-human-voice/references/scope-and-exemptions.md:15-41`]

3. **Lead with an action, command, path or snippet, mixed.** First-line payload and
   verdict-first delivery already cover the action-first part. The literal preference for
   a command, path or snippet first is a new conditional refinement and must yield to a
   decision verdict. Candidate owner is `repo-rules/communication.md` with the skill.
   [SOURCE: `context/i-have-adhd-main/skills/i-have-adhd/SKILL.md:33-40`;
   `repo-rules/communication.md:136-145`; `repo-rules/presenting-decisions.md:48-63`]

4. **Number more than one step, use bounded chunks and keep the fewest steps,
   already-covered with reader-specific emphasis.** Communication numbers multi-step
   work and retains information the reader needs. Candidate owner is
   `repo-rules/communication.md`, with the skill for optional reader emphasis. [SOURCE:
   `context/i-have-adhd-main/skills/i-have-adhd/SKILL.md:42-55, 119-128`;
   `repo-rules/communication.md:160-181`; `AGENTS.md:204-209`]

5. **End an open task with one concrete next action under two minutes, mixed.** The
   concrete handoff action is already-covered. The two-minute default is new and cannot
   replace a necessary longer action or required verification. Candidate owner is
   `repo-rules/handoff-and-questions.md`. [SOURCE:
   `context/i-have-adhd-main/skills/i-have-adhd/SKILL.md:57-62, 119-128`;
   `repo-rules/handoff-and-questions.md:55-112`;
   `evidence-and-proof.md:1-40`]

6. **Suppress tangents and offer a second issue once at the end, already-covered.**
   Communication has the same boundary. Candidate owner is
   `repo-rules/communication.md`. [SOURCE:
   `context/i-have-adhd-main/skills/i-have-adhd/SKILL.md:64-71`;
   `repo-rules/communication.md:199-206`]

7. **Restate state every turn, contradicting as a literal rule.** The repository
   restates handoff state when it changes or when a new boundary needs to be handed back.
   An every-turn recap would conflict with that event-driven rule and with filler removal.
   Candidate owner of the existing boundary is
   `repo-rules/handoff-and-questions.md`. [SOURCE:
   `context/i-have-adhd-main/skills/i-have-adhd/SKILL.md:73-80, 109-117`;
   `repo-rules/handoff-and-questions.md:55-84`; `repo-rules/communication.md:101-116`]

8. **Use a task or plan tool when the harness provides one, mixed.** Planning before a
   multi-step stretch is already-covered. Requiring a particular tool is runtime-specific
   new behavior. Candidate owners are root `AGENTS.md` for planning and the skill for
   integration. [SOURCE: `context/i-have-adhd-main/skills/i-have-adhd/SKILL.md:73-80`;
   `AGENTS.md:175-179`]

9. **Give concrete time estimates, mixed.** Presenting decisions already requires
   minutes or hours before a long invisible stretch. A general estimate expectation is
   new only when a task has an open duration or checkpoint. Candidate owner is
   `repo-rules/presenting-decisions.md`. [SOURCE:
   `context/i-have-adhd-main/skills/i-have-adhd/SKILL.md:82-87`;
   `repo-rules/presenting-decisions.md:115-133`]

10. **Show visible progress, mixed.** Root execution registers and decision checkpoints
    already provide progress updates. Per-action progress signals are a new optional
    ADHD-mode emphasis. Candidate owners are root `AGENTS.md` and
    `repo-rules/presenting-decisions.md`. [SOURCE:
    `context/i-have-adhd-main/skills/i-have-adhd/SKILL.md:89-94`;
    `AGENTS.md:150-153`; `repo-rules/presenting-decisions.md:115-133`]

11. **State errors matter-of-factly, already-covered.** The root quality rule requires
    evidence-based correction and communication rejects performance. Candidate owners
    are root `AGENTS.md` and `repo-rules/communication.md`. [SOURCE:
    `context/i-have-adhd-main/skills/i-have-adhd/SKILL.md:96-101`;
    `AGENTS.md:204-209`; `repo-rules/communication.md:210-218`]

12. **Cap visible lists at five while retaining completeness, already-covered.**
    Communication has the same visible cap, ranking and disclosure rule. Candidate owner
    is `repo-rules/communication.md`. [SOURCE:
    `context/i-have-adhd-main/skills/i-have-adhd/SKILL.md:103-107`;
    `repo-rules/communication.md:172-181, 219-221`]

13. **Remove preambles, recaps, tangents, empty hedges and idioms before sending,
    mixed.** The individual deletions are already-covered by communication and HVR. The
    combined pre-send checklist and first-line or last-line test are new as one workflow,
    subject to evidence and scope exceptions. Candidate owner is HVR with
    `repo-rules/communication.md`. [SOURCE:
    `context/i-have-adhd-main/skills/i-have-adhd/SKILL.md:109-117, 130-142`;
    `repo-rules/communication.md:101-116, 136-206`;
    `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:290-333, 386-449`]

14. **Use escape hatches for full explanation, destructive confirmation, debugging,
    ambiguity, task wins and harness or system priority, already-covered.** These match
    the root gates and handoff rules. Candidate owners are root `AGENTS.md` and the
    relevant repo rules. [SOURCE:
    `context/i-have-adhd-main/skills/i-have-adhd/SKILL.md:119-128`;
    `AGENTS.md:59-86, 175-196`; `repo-rules/handoff-and-questions.md:88-136`;
    `repo-rules/blast-radius.md:1-80`]

The ADHD README's ten-rule summary restates the SKILL directives. It adds no separate
recommendation or owner beyond the skill. [SOURCE:
`context/i-have-adhd-main/README.md:67-80`]

## 4. ADHD mechanism

### Session-start hook

The Claude hook is an opt-in mechanism. `always-on.mjs` reads a marker under
`$CLAUDE_CONFIG_DIR`, defaults to `~/.claude`, resolves the skill relative to the plugin,
strips frontmatter and prints the banner. Missing configuration does not block startup.
`hooks.json` runs it for startup, resume, clear and compact with a 30-second timeout.
The shell and PowerShell launchers are fallback surfaces. Candidate owner is the skill's
runtime hook, not a communication repo rule. [SOURCE:
`context/i-have-adhd-main/hooks/always-on.mjs:1-44`;
`context/i-have-adhd-main/hooks/hooks.json:1-17`;
`context/i-have-adhd-main/hooks/always-on.sh:1-37`;
`context/i-have-adhd-main/hooks/always-on.ps1:1-50`]

### Runtime mirrors and persistence

The OpenCode plugin registers the canonical skill on demand, exposes the command and
appends the rules through a system transform. The Pi extension persists mode state,
tracks whether rules are in context, reinjects them after compaction and handles stop
phrases. The compatibility module supplies safe API fallbacks. This is new mechanism
evidence. Candidate owner is the skill's runtime integration layer. [SOURCE:
`context/i-have-adhd-main/.opencode/plugins/i-have-adhd.mjs:1-99`;
`context/i-have-adhd-main/extensions/i-have-adhd.ts:1-240`;
`context/i-have-adhd-main/extensions/context-compat.ts:1-61`]

### Runtime manifests

The source keeps separate load metadata for these runtime surfaces. This makes cross-runtime
parity an explicit mechanism concern and is new relative to the requested communication
rules.

- Root plugin: `plugin.json:1-4`.
- Codex plugin: `.codex-plugin/plugin.json:1-38`.
- Claude plugin: `.claude-plugin/plugin.json:1-14`.
- Claude marketplace: `.claude-plugin/marketplace.json:1-16`.
- Agents marketplace: `.agents/plugins/marketplace.json:1-21`.
- OpenCode: `opencode.json:1-4`.
- Gemini: `gemini-extension.json:1-6`.
- Qwen: `qwen-extension.json:1-6`.
- Kimi: `kimi.plugin.json:1-12`.
- Package entrypoint: `package.json:1-16`.
- OpenCode command: `.opencode/command/i-have-adhd.md:1-8`.
- Gemini instructions: `GEMINI.md:1-5`.

All paths in this manifest list are under `context/i-have-adhd-main`. Candidate owner is
the skill's runtime manifest set. [SOURCE:
`context/i-have-adhd-main/plugin.json:1-4`;
`context/i-have-adhd-main/.codex-plugin/plugin.json:1-38`;
`context/i-have-adhd-main/.claude-plugin/plugin.json:1-14`;
`context/i-have-adhd-main/.claude-plugin/marketplace.json:1-16`;
`context/i-have-adhd-main/.agents/plugins/marketplace.json:1-21`;
`context/i-have-adhd-main/opencode.json:1-4`;
`context/i-have-adhd-main/gemini-extension.json:1-6`;
`context/i-have-adhd-main/qwen-extension.json:1-6`;
`context/i-have-adhd-main/kimi.plugin.json:1-12`;
`context/i-have-adhd-main/package.json:1-16`;
`context/i-have-adhd-main/.opencode/command/i-have-adhd.md:1-8`;
`context/i-have-adhd-main/GEMINI.md:1-5`]

### Evaluation harness

The eval harness validates, plans, runs, judges and scores identical cases with isolation
flags, a pinned model, retries and resumability. Its rubric requires no blockers,
correctness and safety within 0.1 of baseline or better, and a higher weighted score.
The case file contains 14 cases. The recorded run reports baseline weighted score 4.045,
candidate 4.473, a 0.427 increase, candidate blockers 3 versus baseline 7 and a release
gate failure because the absolute no-blocker rule was not met. The judge uses blind
grouping and deterministic permutation. The gate shape is already-covered by
`sk-communication`'s fail-closed release rule. The ADHD case matrix, rubric, judge and
metrics are new mechanism evidence. Candidate owner is the skill's eval surface. [SOURCE:
`context/i-have-adhd-main/evals/README.md:1-84`;
`context/i-have-adhd-main/evals/rubric.md:1-26`;
`context/i-have-adhd-main/evals/cases.jsonl:1-14`;
`context/i-have-adhd-main/evals/RESULTS.md:1-111`;
`context/i-have-adhd-main/scripts/run_evals.py:119-216, 330-372`;
`context/i-have-adhd-main/scripts/judge.py:35-80, 135-240`;
`.opencode/skills/sk-communication/SKILL.md:142-165`]

### Load and release gates

The source tests native hooks, Claude scratch installation, Cursor parity and Pi
installation. The Pi checker validates manifest parity, command and status behavior,
persisted mode and reload. Hook tests check parity, silence, frontmatter handling and
missing-plugin behavior. The fail-closed shape is already-covered by the communication
skill. The cross-runtime workflows and checks are new mechanism evidence. Candidate owner
is the skill's release workflow. [SOURCE:
`context/i-have-adhd-main/.github/workflows/plugin-load-check.yml:1-47`;
`context/i-have-adhd-main/.github/workflows/cursor-skill-sync.yml:1-25`;
`context/i-have-adhd-main/.github/workflows/pi-load-check.yml:1-31`;
`context/i-have-adhd-main/scripts/check_pi_extension.py:23-38, 304-400`;
`context/i-have-adhd-main/tests/test_always_on_hooks.py:88-169`;
`.opencode/skills/sk-communication/SKILL.md:188-217`]

## 5. Contradictions, listed separately

1. **Clarity 17, cut and reorder versus projection fidelity.** The source rule is valid
   for authored writing. It contradicts the display-only rewrite contract if applied to a
   projection. Existing owner is `.opencode/skills/sk-communication/SKILL.md` with the
   two rewrite commands. [SOURCE: `context/clarity.md:177-186`;
   `.opencode/skills/sk-communication/SKILL.md:167-186`;
   `.opencode/commands/rewrite/response.md:15-22`;
   `.opencode/commands/rewrite/response-by-external-agent.md:47-56`]

2. **Style Patch universal binding and installation versus routed scope.** A global copy
   would bypass `REPO RULES.md` routing and could apply voice personality to a projection.
   Keep adoption scoped to the skill or an authored-writing surface. [SOURCE:
   `context/claude-style-patch-main/STYLE.md:3`;
   `context/claude-style-patch-main/README.md:20-30`;
   `REPO RULES.md:36-50`;
   `.opencode/skills/sk-doc/sk-create-with-human-voice/references/scope-and-exemptions.md:15-41, 75-113`]

3. **Style Patch absolute colon ban versus the existing punctuation contract.** The
   repository permits a colon when the sentence wants one as an em-dash replacement.
   Preserve the narrower no-label-colon repair and reject the absolute ban. [SOURCE:
   `context/claude-style-patch-main/STYLE.md:25-29`;
   `repo-rules/prose-mechanics.md:90-107`;
   `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:107-117`]

4. **ADHD every-turn state restatement versus event-driven handoff state.** The source's
   literal frequency conflicts with the repository's triggered state boundary and would
   reintroduce recap filler. Keep the existing trigger and offer more reminders only in
   explicit ADHD mode. [SOURCE:
   `context/i-have-adhd-main/skills/i-have-adhd/SKILL.md:73-80, 109-117`;
   `repo-rules/handoff-and-questions.md:55-84`;
   `repo-rules/communication.md:101-116`]

5. **ADHD universal persistence versus default-off routing.** Persistence after explicit
   activation is compatible. Universal persistence would conflict with the communication
   skill's default-off projection and the repository's triggered scope. [SOURCE:
   `context/i-have-adhd-main/skills/i-have-adhd/SKILL.md:15-19`;
   `.opencode/skills/sk-communication/SKILL.md:1-14`;
   `.opencode/skills/sk-doc/sk-create-with-human-voice/references/scope-and-exemptions.md:15-41`]

## 6. Disagreements with the sibling DeepSeek synthesis

The sibling artifact is a separate ten-iteration synthesis. The disagreements below are
about its classifications or ownership conclusions. They are not a tally of findings.

- **Reader model.** The sibling classifies Clarity rules 01 and 02 as new because it sees
  the nearest stack lines as modeling the operator only after the request arrives. This
  lineage finds a direct match in the repository's pre-draft reader triage, which requires
  identifying who will read, what they hold and what they need before the first sentence.
  [SIBLING: `research/research.md:61-71`;
  EVIDENCE: `context/clarity.md:34-50`;
  `repo-rules/presenting-decisions.md:90-100`]

- **Explicit sentence relations.** The sibling calls Clarity rule 10 new because it treats
  a communication clause as sentence-internal. The prose-mechanics rule directly requires
  each sentence to state how it attaches to the previous sentence and gives relation words
  as repairs. This lineage therefore marks rule 10 already-covered. [SIBLING:
  `research/research.md:66-70, 148-157`;
  EVIDENCE: `context/clarity.md:121-128`;
  `repo-rules/prose-mechanics.md:60-65`]

- **Paragraph progression.** The sibling calls Clarity rule 15 new after separating
  atomicity from progression. The axes are distinct, but the repository separately states
  that each paragraph carries the reader forward and names what changed, what it implies
  and what comes next. The progression recommendation is therefore already-covered.
  [SIBLING: `research/research.md:66-71, 148-158`;
  EVIDENCE: `context/clarity.md:163-168`;
  `repo-rules/communication.md:149-156`]

- **Rewrite ownership.** The sibling says Clarity rule 17 has no owning surface because
  the rewrite command is display-only. This lineage finds an existing owning constraint in
  the `sk-communication` skill and both rewrite commands, while authored-document editing
  belongs to HVR. The classification is a conditional contradiction with an owner, not an
  ownerless recommendation. [SIBLING: `research/research.md:70-72, 113-127`;
  EVIDENCE: `.opencode/skills/sk-communication/SKILL.md:167-186`;
  `.opencode/commands/rewrite/response.md:15-22`;
  `.opencode/commands/rewrite/response-by-external-agent.md:47-56`;
  `.opencode/skills/sk-doc/sk-create-with-human-voice/references/scope-and-exemptions.md:25-50`]

- **Ban-plus-repair enforcement shape.** The sibling treats the Style Patch's named tics
  with repairs as a different enforcement shape from a rule with rationale. The wording
  standard already uses directives, wrong and right examples, borrowability, tests and an
  exemplar. The form is already-covered even when an individual ban is new or too broad.
  [SIBLING: `research/research.md:73-81, 148-161`;
  EVIDENCE: `context/claude-style-patch-main/README.md:16-18`;
  `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:39-103`]

- **Fragments and numbering.** The sibling lists the fragment ban and label-before-payload
  principle as ownerless and treats reply numbering as unavailable. Communication and HVR
  already own the fragment and label repairs. Tractatus numbering is new optional document
  guidance, so it has a candidate HVR or document-rule owner. [SIBLING:
  `research/research.md:77-81, 152-159`;
  EVIDENCE: `context/claude-style-patch-main/STYLE.md:35-39, 51`;
  `repo-rules/communication.md:136-145`;
  `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:386-401`]

- **Root ownership.** The sibling concludes that no new root-doc clause is needed. This
  lineage does not force a root edit, but it names root `AGENTS.md` as a candidate owner
  for universal dense-thread recheck and code-comment behavior because root already owns
  execution registers and comment hygiene. This is an ownership difference, not a claim
  that a root edit is already authorized. [SIBLING: `research/research.md:32-35, 113-127`;
  EVIDENCE: `context/claude-style-patch-main/STYLE.md:3, 83-89`;
  `AGENTS.md:44-46, 150-153`]

- **ADHD contract shape.** The sibling calls the ADHD contract neither a rule nor a mode
  and assigns seven rules unconditional status. The source provides explicit opt-in
  activation, an always-on marker and stop phrases. The communication projection is also
  default-off. This lineage keeps the reader profile and runtime persistence in an opt-in
  skill mode rather than promoting them to unconditional rules. [SIBLING:
  `research/research.md:49-53, 83-88, 192-199`;
  EVIDENCE: `context/i-have-adhd-main/skills/i-have-adhd/SKILL.md:1-19`;
  `context/i-have-adhd-main/hooks/always-on.mjs:1-44`;
  `.opencode/skills/sk-communication/SKILL.md:1-14`]

The sibling's mechanism observation is consistent with this lineage. Its release warning
also aligns with the recorded ADHD result, where a higher weighted score did not satisfy
the absolute blocker gate. [SIBLING: `research/research.md:83-88, 131-144`;
EVIDENCE: `context/i-have-adhd-main/evals/rubric.md:1-26`;
`context/i-have-adhd-main/evals/RESULTS.md:1-111`]

## 7. Candidate owner summary

- **Root `AGENTS.md`:** universal execution recheck if adopted, code-comment style and
  existing planning or correction obligations. [SOURCE: `AGENTS.md:44-46, 150-153, 175-180, 204-209`]
- **Named existing repo rules:** `communication.md` for reply payload, filler, movement,
  lists and tangents. `prose-mechanics.md` for sentence relation and list shape.
  `presenting-decisions.md` for reader triage, verdicts, strongest objections and
  questions. `handoff-and-questions.md` for state, concrete handback and question scope.
  [SOURCE: `communication.md:101-221`; `prose-mechanics.md:38-127`;
  `presenting-decisions.md:48-133`; `handoff-and-questions.md:55-136`]
- **New repo rule candidates:** general one-takeaway content, section-question
  transitions, Tractatus numbering, narrow document-format guidance and any universal
  dense-thread recheck if those requirements are adopted. [SOURCE:
  `context/clarity.md:52-61`;
  `context/claude-style-patch-main/STYLE.md:3, 49-51, 79-81`]
- **The skill:** opt-in ADHD reader mode, session state, runtime mirrors, manifests,
  evals and release gates. The `sk-communication` skill remains the owner of projection
  fidelity and provider routing, not a general authored-writing rubric. [SOURCE:
  `context/i-have-adhd-main/skills/i-have-adhd/SKILL.md:13-142`;
  `context/i-have-adhd-main/hooks/always-on.mjs:1-44`;
  `.opencode/skills/sk-communication/SKILL.md:1-14, 167-217`]
- **The wording standard:** authored prose clarity, plain language, evidence, read-aloud,
  authenticity, document checks, ban-and-repair examples and authored personality. Its
  personality section does not transfer into a projection. [SOURCE:
  `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:39-103, 206-369`;
  `.opencode/skills/sk-doc/sk-create-with-human-voice/references/scope-and-exemptions.md:15-41, 75-113`]

## 8. Run record

The loop ran all five required iterations under the max-iterations policy. Each iteration
has a narrative, a delta and a gateway-backed iteration record. The terminal synthesis
record carries `stopReason` `maxIterationsReached`, and all writes for this run are inside
the bound lineage directory. [SOURCE: `deep-research-config.json`;
`deep-research-state.jsonl:1-6`]
