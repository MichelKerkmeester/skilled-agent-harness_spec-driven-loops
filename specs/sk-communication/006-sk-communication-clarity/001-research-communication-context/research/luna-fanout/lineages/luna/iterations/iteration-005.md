# Iteration 5 - complete classification and sibling reconciliation

## Focus

This pass consolidates the three source routes into recommendation-level classifications.
It preserves mixed recommendations where one part is covered and another part is new or
contradicting. It also records disagreements with the sibling synthesis as reasons rather
than reducing them to a count.

## Classification anchors

- **Clarity.** Rules 01-02, 04-10, 12-16 and 18 are already-covered. Rule 03 is new at
  general content level, rule 11 is new for strongest-objection handling and rule 17 is a
  conditional contradiction only when applied to the display-only projection lane. [SOURCE:
  `context/clarity.md:34-192`; `repo-rules/presenting-decisions.md:48-100`;
  `repo-rules/prose-mechanics.md:38-65`; `repo-rules/communication.md:101-195`;
  `.opencode/skills/sk-communication/SKILL.md:167-186`;
  `.opencode/commands/rewrite/response.md:15-22`]

- **Claude Style Patch.** Its plain prose, mechanism, sentence, structure, ending and
  question repairs are already-covered by the repository. New refinements are the
  dense-thread recheck, implied-question section test, Tractatus numbering, document
  scan and nesting thresholds, narrow document table guidance, present-state comments
  and two lexical bans. The absolute colon rule and universal binding or installation
  scope contradict existing boundaries. [SOURCE:
  `context/claude-style-patch-main/STYLE.md:3-93`;
  `context/claude-style-patch-main/README.md:16-35`;
  `repo-rules/prose-mechanics.md:38-127`;
  `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:39-117, 206-333`;
  `REPO RULES.md:36-50`; `scope-and-exemptions.md:15-41`]

- **ADHD output.** The action-first, numbered, bounded, tangent, list-cap, error,
  handoff and escape-hatch rules are already-covered or mixed refinements. The reader
  profile is new. Every-turn state restatement is contradicting. Persistence is new when
  explicitly activated and contradicting only if made universal. [SOURCE:
  `context/i-have-adhd-main/skills/i-have-adhd/SKILL.md:13-142`;
  `repo-rules/communication.md:49-221`;
  `repo-rules/handoff-and-questions.md:55-136`;
  `.opencode/skills/sk-communication/SKILL.md:1-14`]

- **ADHD mechanism.** The source supplies an opt-in session-start hook, runtime mirrors
  with persisted state, cross-runtime manifests, case-based evaluation and load or
  release gates. The fail-closed gate shape is already present in `sk-communication`, but
  the ADHD implementation, manifests, cases and judge are new mechanism evidence.
  [SOURCE: `context/i-have-adhd-main/hooks/always-on.mjs:1-44`;
  `context/i-have-adhd-main/.opencode/plugins/i-have-adhd.mjs:1-99`;
  `context/i-have-adhd-main/extensions/i-have-adhd.ts:1-240`;
  `context/i-have-adhd-main/evals/README.md:1-84`;
  `context/i-have-adhd-main/.github/workflows/plugin-load-check.yml:1-47`;
  `.opencode/skills/sk-communication/SKILL.md:142-165`]

## Contradiction list

- **C-CL-17.** Cutting and reordering is a valid authored-document rewrite, but it
  contradicts display-only copy editing that preserves structure and meaning. [SOURCE:
  `context/clarity.md:177-186`; `scope-and-exemptions.md:25-50, 97-113`;
  `response.md:15-22`; `response-by-external-agent.md:47-56`]

- **C-S-01.** Global binding or installation would bypass routed scope and project the
  writer-owned voice personality into a message that carries someone else's wording.
  [SOURCE: `STYLE.md:3`; `README.md:20-30`; `REPO RULES.md:36-50`;
  `scope-and-exemptions.md:15-41, 75-113`; `sk-communication/SKILL.md:167-186`]

- **C-S-02.** The absolute colon ban conflicts with the current punctuation contract,
  which permits a colon when that is the sentence's correct structure. [SOURCE:
  `STYLE.md:25-29`; `prose-mechanics.md:90-107`; `hvr-rules.md:107-117`]

- **C-A-01.** Every-turn state restatement conflicts with event-driven handoff state and
  would reintroduce the recap boundary. [SOURCE: `SKILL.md:73-80, 109-117`;
  `handoff-and-questions.md:55-84`; `communication.md:101-116`]

- **C-A-02.** Universal ADHD persistence conflicts with default-off and triggered routing.
  Persistence after explicit activation remains compatible. [SOURCE:
  `SKILL.md:15-19`; `sk-communication/SKILL.md:1-14`; `scope-and-exemptions.md:15-41`]

## Disagreements with the sibling synthesis

- **Reader model.** The sibling calls Clarity rules 01 and 02 new because its nearest
  lines model the operator only after the request arrives. The current stack explicitly
  tells the writer to identify the reader, what they hold and what they need before the
  first sentence. That direct operational match makes these rules already-covered.
  [SIBLING: `research/research.md:61-71`; EVIDENCE:
  `context/clarity.md:34-50`; `repo-rules/presenting-decisions.md:90-100`]

- **Explicit relations.** The sibling treats Clarity rule 10 as new because it reads a
  communication clause as sentence-internal. The repository's prose-mechanics rule
  explicitly requires each sentence to say how it attaches to the previous one and gives
  relation words as the repair. That rule is a direct match, so this lineage marks rule 10
  already-covered. [SIBLING: `research/research.md:66-70, 148-157`; EVIDENCE:
  `context/clarity.md:121-128`; `repo-rules/prose-mechanics.md:60-65`]

- **Paragraph progression.** The sibling separates atomicity from progression and calls
  Clarity rule 15 new. The repository separately states that each paragraph carries the
  reader forward and names what changed, what it implies and what comes next. The axes
  are distinct, but the progression axis is already present, so rule 15 is not new.
  [SIBLING: `research/research.md:66-71, 148-158`; EVIDENCE:
  `context/clarity.md:163-168`; `repo-rules/communication.md:149-156`]

- **Rewrite ownership.** The sibling says Clarity rule 17 has no owning surface because
  the rewrite command is display-only. This lineage finds an owning constraint in the
  `sk-communication` skill and both rewrite commands, while the authored-document side
  remains owned by the wording standard. The correct result is a conditional contradiction,
  not an ownerless recommendation. [SIBLING: `research/research.md:70-72, 113-127`;
  EVIDENCE: `.opencode/skills/sk-communication/SKILL.md:167-186`;
  `.opencode/commands/rewrite/response.md:15-22`;
  `.opencode/commands/rewrite/response-by-external-agent.md:47-56`;
  `.opencode/skills/sk-doc/sk-create-with-human-voice/references/scope-and-exemptions.md:25-50`]

- **Style Patch enforcement shape.** The sibling treats named ban-plus-repair rules as
  mostly partial or ownerless because their form differs from a rule with a rationale.
  The wording standard already uses directives, wrong and right examples, borrowability,
  tests and an exemplar. The form is therefore already-covered even where a particular
  ban is new or too broad. [SIBLING: `research/research.md:73-81, 148-161`;
  EVIDENCE: `context/claude-style-patch-main/README.md:16-18`;
  `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:39-103`]

- **Fragments and numbering.** The sibling lists the fragment ban and label-before-payload
  principle as having no owning surface and treats reply numbering as unavailable. The
  communication first-line rule and HVR setup blockers already own fragment and label
  repairs. Tractatus numbering is new optional document guidance, so it has a candidate
  wording-standard owner rather than no owner. [SIBLING: `research/research.md:77-81, 152-159`;
  EVIDENCE: `STYLE.md:35-39, 51`; `communication.md:136-145`;
  `hvr-rules.md:386-401`]

- **Root ownership.** The sibling concludes that no new root-doc clause is needed. This
  lineage does not force such a change, but it names the root as the candidate owner for
  universal dense-thread recheck and code-comment behavior because the root already owns
  execution registers and comment hygiene. That is a different ownership conclusion from
  the sibling's no-root allocation. [SIBLING: `research/research.md:32-35, 113-127`;
  EVIDENCE: `STYLE.md:3, 83-89`; `AGENTS.md:44-46, 150-153`]

- **ADHD contract.** The sibling calls the ADHD contract neither a rule nor a mode and
  assigns seven rules unconditional status. The source itself provides explicit opt-in
  activation, an always-on marker and stop phrases, while the repository's communication
  projection is default-off. This lineage therefore keeps the reader profile and runtime
  persistence in an opt-in skill mode and does not promote them to unconditional rules.
  [SIBLING: `research/research.md:49-53, 83-88, 192-199`;
  EVIDENCE: `context/i-have-adhd-main/skills/i-have-adhd/SKILL.md:1-19`;
  `context/i-have-adhd-main/hooks/always-on.mjs:1-44`;
  `.opencode/skills/sk-communication/SKILL.md:1-14`]

## Synthesis readiness

All five required iterations are represented by iteration narratives, deltas and gateway
state records. The final synthesis must preserve the exact stop reason
`maxIterationsReached` and must carry the full recommendation map, mechanism evidence,
contradiction list, candidate owners and disagreement reasons. [SOURCE:
`deep-research-config.json`; `deep-research-state.jsonl:1-5`]
