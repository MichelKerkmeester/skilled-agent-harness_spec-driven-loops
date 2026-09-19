# Iteration 3 - Claude Style Patch and README

## Focus

This pass maps the Style Patch's sentence, structure, document, comment and question
recommendations. It distinguishes requirements that the repository already states from
new refinements and from rules that would overreach the existing routing or punctuation
contracts.

## Findings

- **Style framing, binding scope, already-covered and contradicting.** The source asks the
  whole style section to bind and to be rechecked when a thread becomes dense or long. The
  repository already makes communication rules bind on substantive replies through the
  root communication section and the routed rule. Making the vendored section globally
  binding would contradict the repository's trigger and scope model. The dense-thread
  recheck is a new operational refinement. Candidate owners are the named existing
  `repo-rules/communication.md` for the scoped rule and the root `AGENTS.md` only if a
  universal recheck is deliberately added. [SOURCE: `claude-style-patch-main/STYLE.md:3`;
  `AGENTS.md:397-405`; `repo-rules/communication.md:1-35`;
  `scope-and-exemptions.md:15-41`]

- **Straightforward prose, already-covered.** Short declaratives, clear transitions,
  plain words and direct sentences are already required by prose mechanics and the
  wording standard. Candidate owners are `repo-rules/prose-mechanics.md` and the wording
  standard. [SOURCE: `claude-style-patch-main/STYLE.md:7-7, 19-21`;
  `repo-rules/prose-mechanics.md:38-65, 78-86`;
  `hvr-rules.md:43-71, 95-103`]

- **Conceptual grip and mechanism visibility, already-covered.** The source asks an
  explanation to map the territory, name moving parts and show how they work. Prose
  mechanics already requires the actor, target and change, and the wording standard
  requires actionable claims backed by data or examples. Candidate owner is
  `repo-rules/prose-mechanics.md`, with the wording standard for evidence. [SOURCE:
  `claude-style-patch-main/STYLE.md:9-9`; `repo-rules/prose-mechanics.md:67-72`;
  `hvr-rules.md:78-81`]

- **Concise without telegraphing, already-covered.** The source keeps enough steps for a
  reader to climb and rejects compression that removes connective tissue. The prose rule
  names the same failure and preserves the because, contrast and antecedent joints.
  Candidate owner is `repo-rules/prose-mechanics.md`. [SOURCE:
  `claude-style-patch-main/STYLE.md:11-11`; `repo-rules/prose-mechanics.md:118-127`;
  `communication.md:219-221`]

- **Pre-draft job and deletion test, already-covered at the operational level.** The
  source asks for a thinking block that fixes the response job and cuts merely additive
  material. The root workflow already requires planning, a pre-write restraint pass and
  the smallest complete result, while communication names filler to remove. The exact
  hidden thinking-block mechanism is not a public repository contract. Candidate owners
  are the root `AGENTS.md` and `repo-rules/communication.md`. [SOURCE:
  `claude-style-patch-main/STYLE.md:15-15`; `AGENTS.md:175-180, 182-186`;
  `communication.md:101-116`]

- **SVO, active voice, concrete nouns, verbs and plain roots, already-covered.** The
  source's sentence construction and Anglo-Saxon preference are covered by the wording
  standard's active voice and plain-word directives and by prose mechanics' plain-word
  rule. Candidate owners are the wording standard and `repo-rules/prose-mechanics.md`.
  [SOURCE: `claude-style-patch-main/STYLE.md:19-21`; `hvr-rules.md:43-61, 95-97`;
  `prose-mechanics.md:45-48, 78-86`]

- **Clear antecedents, already-covered.** The source requires pronouns and noun phrases
  to identify their referents. The wording standard flags ambiguous `it` and `this` and
  tells the writer to replace them with a specific noun. Candidate owner is the wording
  standard. [SOURCE: `claude-style-patch-main/STYLE.md:23-23`; `hvr-rules.md:443-449`]

- **Absolute colon rule, contradicting.** The source bans a colon before a clause except
  for a literal list of at least three items. The repository permits a colon when the
  sentence wants one as an em-dash replacement, and its punctuation rule does not ban
  colons. A narrower ban on label-colon announcing is already-covered by first-line and
  setup rules. Candidate owners for the existing contract are `repo-rules/prose-mechanics.md`
  and the wording standard. [SOURCE: `claude-style-patch-main/STYLE.md:25-29`;
  `prose-mechanics.md:90-107`; `hvr-rules.md:107-117`]

- **Point first, functional connectors and no announcements, already-covered.** The
  source says to lead with the point, use plain connectors and remove discourse labels.
  Communication puts the payload in the first line and removes empty openers, while
  prose mechanics names relation words as the repair. Candidate owners are
  `repo-rules/communication.md` and `repo-rules/prose-mechanics.md`. [SOURCE:
  `claude-style-patch-main/STYLE.md:31-33`; `communication.md:101-116, 136-145`;
  `prose-mechanics.md:60-65`]

- **Fragments, depth-signaling and habitual antithesis, already-covered.** The source
  asks writers to merge fragment openers, remove depth-signaling and reserve contrast for
  real competing explanations. The communication and wording standards remove fragment
  setup, generic signaling, false significance and repeated antithesis. Candidate owner
  is the wording standard, with communication for replies. [SOURCE:
  `claude-style-patch-main/STYLE.md:35-39`; `communication.md:136-145, 210-221`;
  `hvr-rules.md:290-333, 386-401`]

- **Stacked compression and metaphor cash-out, already-covered.** The source limits
  adjacent compression, nominalization and metaphor and asks writers to unpack the
  sentence. The wording standard has the same nominalization, metaphor and generalisation
  repairs. Candidate owner is the wording standard. [SOURCE:
  `claude-style-patch-main/STYLE.md:41-43`; `hvr-rules.md:206-253`]

- **Bullets for parallelism and paragraphs for causality, already-covered.** The source
  assigns list and paragraph forms by relationship. Prose mechanics already says that
  lists imply independent items and prose carries a single argument. Candidate owner is
  `repo-rules/prose-mechanics.md`. [SOURCE: `claude-style-patch-main/STYLE.md:45-47`;
  `prose-mechanics.md:50-62`]

- **Question-driven section transitions, new.** The source proposes that each section
  answer an implied reader question. Existing communication requires paragraph movement,
  and HVR requires scannable documentation, but neither supplies this section-level test.
  Candidate owner is a new repo rule or the wording standard's document section. [SOURCE:
  `claude-style-patch-main/STYLE.md:49-49`; `communication.md:149-156`;
  `hvr-rules.md:302-315`]

- **Formatting proportion and Tractatus numbering, mixed.** Using emphasis only when it
  adds meaning is already consistent with the wording standard's output emphasis rule.
  Tractatus numbering for complex hierarchies and the instruction not to use it for short
  lists are new optional document-format guidance. Candidate owners are the wording
  standard for emphasis and a new repo rule for the numbering preference. [SOURCE:
  `claude-style-patch-main/STYLE.md:51-51`; `hvr-rules.md:107-117`]

- **Proportional shape and no empty closer, already-covered.** The source says the answer
  should fit the task and end when the content ends. Communication requires the answer to
  end when done, and HVR rejects generic positive conclusions. Candidate owners are
  `repo-rules/communication.md` and the wording standard. [SOURCE:
  `claude-style-patch-main/STYLE.md:53-59`; `communication.md:185-195, 219-221`;
  `hvr-rules.md:290-300`]

- **Targeted questions and direct corrections, already-covered.** The source limits
  questions to essential missing information and makes corrections direct and specific.
  Handoff rules restrict questions to decisions the operator must make, while the root
  quality rule requires evidence-based correction. Candidate owners are
  `repo-rules/handoff-and-questions.md` and the root `AGENTS.md`. [SOURCE:
  `claude-style-patch-main/STYLE.md:59-63`; `handoff-and-questions.md:116-136`;
  `AGENTS.md:204-209`]

- **Natural color, playfulness and the three banned words, mixed.** Natural personality
  is already supported for writing the agent owns, and the repository excludes personality
  from a projection that carries another author's message. The specific ban on
  `honestly` is already present in HVR. The bans on `load-bearing` and `crux` are new
  lexical filters, but they cannot erase the root document's existing terminology. The
  candidate owner is the wording standard, scoped to authored output. [SOURCE:
  `claude-style-patch-main/STYLE.md:65-71`; `hvr-rules.md:337-369, 427-445`;
  `AGENTS.md:142-153`; `sk-communication/SKILL.md:167-186`]

- **Document scannability and nesting, new.** The source asks for a design document that
  can be scanned in 30 seconds and for nesting only when the hierarchy earns it. The
  existing wording standard covers direct document prose and heading restatement, but it
  does not state either threshold. Candidate owner is the wording standard. [SOURCE:
  `claude-style-patch-main/STYLE.md:79-81`; `hvr-rules.md:302-315`]

- **Document bullets, tables, key-value specs and ornamental tissue, mixed.** One idea per
  bullet and no decorative connective tissue follow existing sentence and filler rules.
  Tables are already allowed when a reader returns to a document, while the narrower
  recommendation to use tables for parallel comparisons and key-value pairs for specs is
  new. The source's no-fragment and no-antithesis checks are already-covered. Candidate
  owner is the wording standard, with a new document-format rule for the narrower table
  and key-value guidance. [SOURCE: `claude-style-patch-main/STYLE.md:79-81`;
  `prose-mechanics.md:43-56`; `communication.md:90-97`;
  `hvr-rules.md:144-151, 302-315`]

- **Code comments, new.** The source requires concise present-state comments, removes
  unnecessary history and recommends clean visual spacing. The root comment-hygiene rule
  only bans ephemeral artifact labels, so it does not cover this full present-state and
  spacing standard. Candidate owner is the root `AGENTS.md`. [SOURCE:
  `claude-style-patch-main/STYLE.md:83-89`; `AGENTS.md:44-46`]

- **Clear options before asking, already-covered.** The source asks the writer to explain
  options before presenting a fork. Presenting decisions already requires the ASK, DO and
  THEN sequence, and consolidated questions are a root requirement. Candidate owners are
  `repo-rules/presenting-decisions.md` and the root `AGENTS.md`. [SOURCE:
  `claude-style-patch-main/STYLE.md:91-93`; `presenting-decisions.md:102-111`;
  `AGENTS.md:108-112`]

- **Concrete ban plus repair as an authoring method, already-covered.** The README says
  concrete rules with examples and rewrites work better than stated preferences. HVR
  already uses directives, wrong and right examples, borrowability and an exemplar as its
  document test. Candidate owner is the wording standard. [SOURCE:
  `claude-style-patch-main/README.md:16-18`; `hvr-rules.md:39-103`]

- **Global and project installation, mixed with a contradiction.** The README recommends
  appending the patch to a global config or a project instruction file and pasting it into
  a system prompt. A project-scoped wording rule is compatible in principle, but global
  application of the whole patch conflicts with the repository's routed rules and with
  the authored-versus-projection boundary. Candidate owner for any adoption mechanism is
  the skill, not a new canonical root copy. [SOURCE:
  `claude-style-patch-main/README.md:20-30`; `REPO RULES.md:36-50`;
  `scope-and-exemptions.md:15-41, 75-113`; `sk-communication/SKILL.md:1-14`]

- **Long-thread degradation and explicit recheck, new.** The README reports degraded
  compliance on long threads and recommends direct reminders to hew to the style before
  long prompts. The current stack has intended-path updates and state restatement, but no
  equivalent style recheck trigger. Candidate owners are the root execution rule or
  `repo-rules/communication.md`. [SOURCE: `claude-style-patch-main/README.md:32-37`;
  `AGENTS.md:150-153`; `handoff-and-questions.md:55-84`]

## Contradiction list

- **C-S-01, universal binding and installation.** Treating the whole patch as a universal
  instruction would bypass the repository's routed scope and would apply writer-owned
  personality rules to display projections. The compatible repair is to keep any adopted
  style in its owning surface and preserve projection fidelity. [SOURCE:
  `STYLE.md:3`; `README.md:20-30`; `REPO RULES.md:36-50`;
  `scope-and-exemptions.md:15-41, 75-113`; `sk-communication/SKILL.md:167-186`]

- **C-S-02, absolute colon ban.** The patch's exception list still bans colons that the
  existing punctuation standard allows when a colon is the sentence's correct structure.
  A narrower no-label-colon rule can be retained. [SOURCE: `STYLE.md:25-29`;
  `prose-mechanics.md:90-107`; `hvr-rules.md:107-117`]

## Convergence telemetry

The pass adds three new areas: dense-thread recheck, question-driven sections and
present-state code comments. It also confirms that the patch's main sentence repairs
mostly duplicate the repository's prose and wording standards. New-information estimate
is 0.61, and the max-iterations policy keeps the loop open. [SOURCE:
`STYLE.md:3-93`; `README.md:16-35`; `deep-research-config.json`]

## Next focus

Map the ADHD source's output rules and its mechanism half. Read the session-start hook,
runtime mirrors, command registrations, eval harness and release gates as mechanism
evidence, then classify literal rules against the repository's triggered state and
evidence contracts.
