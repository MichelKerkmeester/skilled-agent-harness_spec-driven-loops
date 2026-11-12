# Research: Command-workflow protection for natural-chat sessions

Lineage `auto-workflow-deepseek`, ten iterations. Every claim traces to a numbered finding in `iterations/iteration-00N.md`; file and line citations are inline.

## 1. The question

How can a natural-chat session get the protection of the spec-kit command workflows without the user typing a command, while staying flexible? A chat session that writes files loads `AGENTS.md`, the `system-spec-kit` skill, the authoring card, the packet templates and `validate.sh` — and never loads `.skilled/commands/speckit/assets/speckit-plan.yaml`, `speckit-implement.yaml` or `speckit-complete.yaml`. The advisor recommends a skill or command in a hook brief, and the question asks whether that recommendation becomes automatic use.

## 2. The answer

**Yes, at a bounded level of protection, on one condition the evidence makes concrete: the protection has to travel as a fill note in the authoring card, and the card has to load on an ordinary write.**

Three findings decide it.

1. **The gap is one workflow rule, not a program.** The plan workflow's ALWAYS list carries `document_all_decisions` with no level qualifier [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:873]. The chat path has no equivalent at any level: its rules cover level, templates, placeholders, completion gates and validation, and its authoring card's stop-and-ask list names contradictions and over-scoping but never decisions [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:200].
2. **The card is already the shared surface both paths read, and it is the cheap one.** `SKILL.md` says a write starts with it [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:94], the plan and implement routers both name it [SOURCE: .skilled/commands/speckit/plan.md:106] [SOURCE: .skilled/commands/speckit/implement.md:92], and it costs about 2.4k tokens against the plan workflow's 16.3k [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:1].
3. **Its one failure is a keyword table, which is one line.** The card loads on `plan`, `design`, `new spec`, `implement`, `build`, `execute`, `workflow` [SOURCE: .skilled/skills/system-spec-kit/ROUTER.md:161] [SOURCE: .skilled/skills/system-spec-kit/ROUTER.md:163], and the router falls back to a disambiguation checklist below a 0.5 top score [SOURCE: .skilled/skills/system-spec-kit/ROUTER.md:373]. "Add a `--keep` flag" matches none of them, even though the router's prose promises that a create, an add, an update or a fix reaches the skill [SOURCE: .skilled/skills/system-spec-kit/ROUTER.md:27].

## 3. What the workflows check that chat does not (iteration 1)

The plan workflow runs seven checkpoints, each closing on a named validation: `understanding_confirmed`, `principles_established`, `spec_complete`, `requirements_clear`, `approach_defined`, `context_saved_successfully`, `workflow_finish_confirmed` [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:21]. It also runs a planning gate that requires `plan.md` with a technical approach before proceeding [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:461], and two scored hard-blocking quality gates at threshold 70 [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:403]. Implement's pre-implementation gate is the strongest single check: threshold 70, `blocking: hard`, and 25 of its points are `plan_clarity` [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:384].

Already duplicated on the chat path, and therefore not to be re-added: level determination before any file change [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:200], scaffold-from-template and placeholder fill, both completion gates [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:207], and `validate.sh` before completion [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:211]. The chat path is *stronger* than the workflow on folder selection: Gate 3 is a hard block that fires on any write [SOURCE: AGENTS.md:72], while the plan workflow's intake classifier can proceed without asking on a populated folder.

Continuity is a checkpoint in the workflow and a suggestion in chat [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:801] [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:213], and ambiguity is capped and resolved by the workflow but only forbidden by the chat path.

## 4. Where an author-only plan gets through (iteration 2)

A plan that only its author can follow is a plan whose steps force the implementer to make a design choice. It passes today because:

- every plan-quality instruction in the template is an HTML comment, and no validator rule reads comment prose [SOURCE: .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:67];
- `PLACEHOLDER_FILLED` downgrades an unfilled token to a WARNING while `spec.md` says Draft [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:334], so the architecture pattern can still be a menu of options and the run still passes `--strict` [SOURCE: .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:87];
- the plan template has no open-decisions section, so a decision hides in the pattern line, the component list or the data-flow sentence;
- the authoring card's plan-shape check is `rg -n '^## 4' plan.md` prints one line [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:124] — a presence check;
- Gate 2 deliberately exempts spec-folder docs from the documentation-skill route [SOURCE: AGENTS.md:68], and Gate 3 binds where the write lands, not whether the plan can be followed.

At Level 1 the plan is the last document before code, because `acceptance-criteria.md` is not required there [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:773].

## 5. The five mechanisms, scored

Scores come from iterations 3-9; "reach" means deliverability in all seven runtimes *and* in a dispatched child.

| Mechanism | Reach | Enforcement | Cost | Level 1 lightness | Change cost | Rank |
|---|---|---|---|---|---|---|
| **B. Shared step reference (the authoring card)** | 7/7 — a file read | Instruction, with an executable Verify per section | ~2.4k tokens, writing sessions only | Per-section shape, no new artifact | One clause in an existing note | **1** |
| **D. Templates + validate.sh** | 7/7 — a shell script | Real failure, but only for shapes | 0 per turn | Native — rules branch on level | A script plus a registry row, or a corpus regrade | 2 |
| **C. Hook injection** | Tool time 7/7; child: none | Notice; deny is opt-in | ~50-90 tokens per delivery | Neutral (delivery only) | A core plus seven adapters plus a kill switch | 3 |
| **E. Advisor-driven command invocation** | 6/7 (Devin has none) | None — the session still chooses | ~16.3k tokens per run | None; `confirm` mode stalls four times | A bridge schema and a scoring-lane change | 4 |
| **A. AGENTS.md routing gate** | 6/7 (Cursor gets only a Gate 1 pointer) | Instruction; nothing verifies the route ran | ~130 marginal tokens | Needs a third written exemption | A shipped product surface | 5 |

## 6. The recommendation

**Carry the check in the authoring card, and make the card load on an ordinary write.** Concretely, three one-line edits to existing files and nothing else:

1. **`templates/core/plan.md.tmpl` §3's architecture fill note** — extend the existing sentence "Name what fails today without each component you add, or drop it" [SOURCE: .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:84] with the one thing the workflow asks for and chat does not: name every choice a task would otherwise have to make, or resolve it before the status leaves Draft. The card already declares that a fill note *is* the section contract [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:86], which is why this is a clause rather than a new section.
2. **`ROUTER.md`'s `INTENT_SIGNALS`** — add the write verbs the router's own prose already promises, so an ordinary "add/update/fix/create" request loads the card instead of falling to `UNKNOWN_FALLBACK` [SOURCE: .skilled/skills/system-spec-kit/ROUTER.md:27] [SOURCE: .skilled/skills/system-spec-kit/ROUTER.md:373].
3. **`AGENTS.md`'s bypass-phrase line** — add one phrase so the opt-out is one sentence already in the session's context [SOURCE: AGENTS.md:108].

Optional, and the operator's call rather than part of the minimum: one clause in the card's §11 stop-and-ask list, which already writes `Open question:` into `goal.md` and already has a working verify command [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:206].

**Why not the others, in one line each.** `AGENTS.md` would ship to every adopting project and still miss Cursor [SOURCE: AGENTS.md:296] [SOURCE: .cursor/rules/skill-routing.md:20]. A hook is advisory by default, invisible in the child, and visible on Pi's own prompt [SOURCE: .skilled/hooks/spec-gate/README.md:16]. The validator cannot read judgment, and the check that matters is a judgment. The advisor already invokes skills automatically above 0.8 [SOURCE: AGENTS.md:67]; it cannot recommend a command from natural language because its bridges are slash-keyed [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:1997].

## 7. Level 1 and the opt-out (iteration 9)

Level 1 is four documents and no closure gate [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:773] [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:81], so any mechanism that adds a fifth required artifact breaks the level contract. The recommendation adds none: a fill note costs one sentence inside a document Level 1 already writes, and its verification is a read of that document.

The workflow is already level-aware in the places that matter — `use_checklist_for_verification_level_2_plus` [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:877], and implement's step 4 opens with `Skip for Level 1, MANDATORY for Level 2+` [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:539] — which is the shape to copy if a later packet wants the check to scale differently.

Opt-out is one phrase, because the carrier already exists: the bypass-phrase line in the consolidated question protocol [SOURCE: AGENTS.md:108], and, for an operator who wants it off at the runtime level, a `SYSTEM_<CONCERN>_DISABLED` switch per hook concern [SOURCE: .skilled/hooks/README.md:45].

## 8. Token cost, measured (iteration 9)

Byte counts from `wc -c`; token figures are an inference at 4 bytes per token.

| File | Bytes | ≈ tokens | When it is read |
|---|---|---|---|
| `AGENTS.md` | 27,372 | 6.8k | every session |
| `ROUTER.md` | 26,012 | 6.5k | every skill invocation |
| `quick-reference.md` | 30,232 | 7.6k | first touch on every invocation |
| `SKILL.md` | 28,185 | 7.0k | every skill invocation |
| `spec-authoring-card.md` | 9,699 | 2.4k | when a writing intent selects it |
| `validation-rules.md` | 47,234 | 11.8k | on failure diagnosis |
| `plan.md.tmpl` | 15,050 | 3.8k | every plan write |
| `speckit-plan.yaml` | 65,265 | 16.3k | only if the workflow runs |

The chat path already carries roughly 30k tokens across `AGENTS.md`, `SKILL.md`, `ROUTER.md`, `quick-reference.md` and the card. Against that baseline, the recommended change is about 130 tokens; running the plan workflow instead is 16.3k.

## 9. Across runtimes and in a child (iteration 8)

`AGENTS.md` arrives in six of seven runtimes; Cursor receives only a generated Gate 1 pointer inside its own rule file. Command surfaces exist in six runtimes in two forms — slash commands in OpenCode, Claude and Cursor; eight `speckit-*.md` prompt templates each in Codex, Pi and DSH — and Devin has neither [SOURCE: .devin/README.md:41]. Hook delivery is complete for tool time in all seven [SOURCE: .skilled/hooks/README.md:343] but returns nothing to a dispatched child [SOURCE: .skilled/hooks/spec-gate/README.md:24], and Gate 3 in a child is pre-resolved into record-and-continue [SOURCE: AGENTS.md:84]. The card and the validator are the only two mechanisms that need no adapter, which is the structural reason they lead the ranking.

## 10. What not to build

- A new command, agent or skill — excluded by the question, and the command surface does not exist on one runtime.
- A new hook concern — a core plus seven adapters plus a kill-switch row [SOURCE: .skilled/hooks/README.md:45].
- A new validator rule — a script plus a registry row [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:3], and it cannot read judgment.
- A new plan artifact — Level 1 has no room for a fifth required document.
- A chat-mode variant of the workflow — a second procedure that would drift from the first, with 16.3k tokens of duplication.
- A confidence-gated auto-invoke — the ceiling is 0.95 and ties report ambiguous [SOURCE: .skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md:130].
- A blocking gate at Level 1, or a new required plan anchor at the current template version [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:450].

## 11. What this research cannot say

- **It cannot say the recommendation works.** A fill-note clause and a keyword fix are instructions; the measurable question is whether plans written after the change leave fewer decisions unresolved. The counters exist already: `Open question:` rows in `goal.md` and `[DEVIATION: ...]` markers in `tasks.md` [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:206].
- **It cannot supply a fresh reader.** The packet's sibling lineage established that a check scored by the context that wrote the document has the wrong evaluator, and no mechanism in this ranking dispatches one. The honest claim is a lower frequency of author-only plans, not a ceiling.
- **One question stayed open in the state record.** The mechanism-cost question was answered branch by branch across iterations 3-7 but never marked answered in a single iteration, so the registry shows it open. The branches are all covered in sections 5 and 6 of this document.
- **No runtime session and no live advisor call were exercised.** Every runtime claim rests on checked-in mirrors, adapters and contracts; `/doctor:runtime-mirrors` is the command that would confirm currency.
- **Containment note.** Every artifact this lineage created lives inside its lineage directory. Diagnostic stdout from the append gateway was captured to five `/tmp` files during iterations 2-10 and the synthesis; that is a write outside the lineage and is recorded here rather than repeated. No repository path outside the lineage was created, modified or deleted, and no git operation, `validate.sh` run or `generate-context.js` run was executed.

## 12. References

- `iterations/iteration-001.md` … `iterations/iteration-010.md` — the per-iteration findings, one numbered list each.
- `deltas/iter-001.jsonl` … `deltas/iter-010.jsonl` — the structured delta streams.
- `.skilled/commands/speckit/assets/speckit-plan.yaml`, `speckit-implement.yaml`, `speckit-complete.yaml`
- `.skilled/skills/system-spec-kit/SKILL.md`, `ROUTER.md`, `references/workflows/spec-authoring-card.md`, `references/workflows/quick-reference.md`, `references/validation/validation-rules.md`
- `.skilled/skills/system-spec-kit/templates/core/plan.md.tmpl`, `tasks.md.tmpl`
- `.skilled/hooks/README.md`, `.skilled/hooks/injection-contract.md`, `.skilled/hooks/spec-gate/README.md`
- `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md`, `references/scoring/advisor-scorer.md`, `runtime/scripts/command-bridges/command-bridges.generated.json`
- `AGENTS.md`, `REPO RULES.md`, `.cursor/rules/skill-routing.md`
