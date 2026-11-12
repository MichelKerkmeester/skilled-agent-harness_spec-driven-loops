# Research: Command Surfacing and Workflow Enforcement

Merged synthesis of a three-lineage `/deep:research:auto` fan-out, 10 iterations each, run 2026-11-12 with stop policy `max-iterations`.

| Lineage | Executor | Model | Iterations | Wall time |
|---|---|---|---|---|
| `codex-luna` | `cli-codex` | `gpt-6-luna`, max, fast | 10 | 61 min |
| `opencode-deepseek` | `cli-opencode` (OpenCode 1.19.4) | `opencode-go/deepseek-v4.1-flash`, max | 10 | 29 min |
| `pi-deepseek` | `cli-pi` (1.5.0) | `deepseek-v4.1-flash-1017` via LLM Gateway, max | 10 | 8 min |

Each lineage's own synthesis is at `lineages/<label>/research.md`. This file merges them, keeps their disagreements visible and marks which claims the orchestrator opened and confirmed. The two DeepSeek lineages are the same model family, so agreement between them is one lens, not two.

---

## 1. EXECUTIVE SUMMARY

The advisor can already name commands, but only the doctor family reaches the model in a form it can act on. All three lineages found the same four stacked gaps, and the orchestrator confirmed the cited lines for each.

1. **Inventory.** 45 command files exist. The bridge projection holds 62 rows over 43 command strings, built from three hand-kept sources and activated by a fourth. 22 rows are off in the TypeScript scorer, which is the one the hooks use. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:4]
2. **Scoring.** Non-doctor command projections carry slash strings as their only keywords, so plain prose has nothing to match. `command-deep-research` is projected with `routingEnabled: false`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:86] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1062]
3. **Contract.** The recommendation schema has no kind, no runnable string and no policy. The brief renders a runnable line only from a generated doctor map. [SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:294] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:109]
4. **Binding.** The hook is advisory and fails open, and no sentence in `AGENTS.md` tells a model what to do with a surfaced command. [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:25]

The recommended design is five changes in a fixed order: one generated inventory with a risk class per command, plain-language intent phrases per command, four new fields on the recommendation, a policy derived from the risk class, and one sentence in Gate 2. Section 12 gives the per-command verdicts and section 13 the open decision on how strict the run-or-ask default is.

---

## 2. METHOD

Three CLI lineages each ran the full loop in an isolated directory under `lineages/`, then `fanout-merge.cjs` merged the three registries. The orchestrator read the three lineage syntheses, opened the citations listed in section 16 and wrote this file. The pi lineage executed no advisor command, by its own containment choice, so its claims come from source reading only. The opencode lineage ran `advisor_recommend` with the threshold set to 0 to see candidates that the shipped threshold hides.

---

## 3. INVENTORY (angle 1)

- 45 command files: 13 create, 3 deep, 3 design, 17 doctor, 1 prompt, 7 speckit and the loose `local-skilled-alignment.md`. All three lineages agree.
- 62 bridge rows from 19 metadata entries, 8 allow-list entries and 35 doctor routes. 40 are active for TypeScript and 50 for Python. Confirmed from the `counts` block of the generated file.
- Five shipped commands have no bridge under their own name: `/prompt:improve`, `/speckit:handoff`, `/speckit:save`, `/speckit:search` and `/local-skilled-alignment`. The opencode lineage counted four because it left the loose file out.
- Three bridge names have no command file: `/spec_kit`, `/memory:save` and `/prompt`.
- The 22 TypeScript-inactive rows cover every deep command, every design command, 11 of 13 create commands and `/speckit:plan`, `/speckit:complete`, `/speckit:implement` and `/speckit:resume`.
- Ten command strings carry more than one bridge id, all doctor routes. A per-id recommendation cannot become a per-command contract without a grouping key.

**R1.** Derive one inventory from the command tree plus each hub's `mode-registry.json`. The deriver fails when a live command is in neither, and when a bridge names a spelling the tree does not hold. Keep route-level targets as records beneath the command, because flattening `/doctor:mcp` loses its subroutes.

---

## 4. SCORING (angle 2)

- The shipped threshold is 0.8. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/compat/contract.ts:10] With the threshold at 0 the planning prompt's candidates are `sk-doc` 0.62, `sk-code` 0.59 and `system-spec-kit` 0.59. No command is among them (opencode lineage, measured).
- A command candidate loses 0.08 in the sort when the prompt has no slash. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1197] The pi lineage reported that no such constant exists. That claim is wrong: the orchestrator opened the line.
- A typed command is scored to rank its owner skill above its own bridge, for example `/deep:research` gives `system-deep-loop` 1.6 and `command-spec-kit` 0.45. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:97]
- Only a command flagged read-only can lift off the read-only floor on its own phrase, and the deriver sets that flag only for doctor routes classed `read-only`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:689] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:306]
- Prose reaches a non-doctor command id through hand-written phrase rows covering three commands. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:169]

**R2.** Do not lower the threshold. Give every command plain-language intent phrases generated from its metadata `userIntent.ownedSignals`, and enable its TypeScript row. Keep the 0.08 adjustment as a tie-break. Add a precedence rule scoped to a command and its own owner skill, modelled on the existing doctor rule.

---

## 5. OUTPUT CONTRACT (angle 3)

- The recommendation object carries `skillId`, `score`, `confidence`, `uncertainty`, `dominantLane` and optional diagnostics. Nothing says whether an entry is a command or how to start it.
- The brief has two sentence forms, "use X" and "ambiguous: X vs Y". A typed `/speckit:plan` renders as `ambiguous: command-spec-kit 0.82/0.20 vs system-spec-kit 0.82/0.18` (opencode lineage, measured, and matching the orchestrator's earlier read-only run).
- The cap is 80 tokens, 120 when ambiguous, at four characters per token. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:97] A typical head is far below it, so the budget is not the blocker. The codex lineage adds the caveat that the optional `Also:` line is dropped when it does not fit, so anything the model must act on belongs in the required head.

**R3.** Add `kind`, `command`, `policy` and `ownerSkillId` to the recommendation. Render `use <skill> → <command> (<policy>)` in the head for every family, generated from the inventory instead of the doctor-only map. Do not raise the cap.

---

## 6. RUN OR ASK (angle 4)

- Only the doctor manifest declares risk per route: `read-only`, `add-only` or `mutates`, with the write target. The 19 metadata entries and the remaining commands declare nothing.
- `allowed-tools` cannot stand in for risk, because every command declares `Bash` (pi lineage). The command name cannot either: `/doctor:install` is a read-only guide and `/doctor:env` mutates.
- Route confidence and execution authority are separate decisions (codex lineage). A match can load the workflow. The workflow's own setup, Gate 3 and the reversibility ladder still ask where they must.
- 25 commands accept `:auto` or `:confirm`, and omitting the suffix lands on a confirm or ask path in the inspected routers.

**R4.** Carry a risk class and write target in each command's metadata and derive `policy` from it. The lineages disagree on where the line sits, see section 13.

---

## 7. INVOCATION MECHANICS (angle 5)

- Six runtimes mirror the command tree as a user-facing slash surface. Devin has none.
- Seven brief adapters exist over one renderer. The hook reference documents six and omits DSH. The runtime enum, the hook list, the registration test and the validation playbook do not describe one matching set (codex lineage).
- Both DeepSeek lineages concluded that no runtime gives the model a way to start a slash command itself. **The orchestrator contradicts this for Claude Code from direct observation:** in this session the Skill tool lists the repository's commands, among them `speckit:plan`, `deep:research` and `doctor:setup`, as model-invocable. Claude Code's public documentation, cited by the opencode lineage, describes the same merge of commands into model-invocable skills. The claim still stands unverified for the other six runtimes.
- A command file is a router over repository Markdown and YAML, so a model that can read files can follow it without slash expansion. This works on every runtime, Devin included.

**R5.** Describe invocation per runtime as an adapter over one command identity. Where the host exposes a model-invocable command, use it. Elsewhere load the command document and follow it, or name the command and ask the user to type it. Derive the active runtime list from the hook registrations.

---

## 8. CHAT-ONLY USERS (angle 6)

- The brief fires on every prompt but cannot bind, by contract.
- `AGENTS.md` is the one document every runtime loads. Its only command sentence today is the Gate 4 tie-break.
- A pointer from a skill to its command cannot cause discovery, because skills load after routing. Runner refusal fires only once the runner is loaded.
- The ruleset already forbids hand-rolling a workflow that a plan names. What it lacks is the discovery step for a workflow nobody named.
- The earlier packet `system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review` chose a refusal in the fan-out runner for one specific hand-roll and rejected hook and doc wording for that case. That is a backstop for one workflow, and it is compatible with the mechanism below.

**R6.** Three layers. The brief carries the command and its policy. One sentence in Gate 2 binds the behaviour: when the brief names a command with policy run, start that command's workflow, when ask, offer it and wait, and when no brief arrived, call the advisor before hand-rolling. The command file stays the executable body. All three lineages reached this mechanism independently, and all three rejected a hook-only mechanism, a static list of 45 commands in `AGENTS.md` and a new gate.

---

## 9. SKILL AND COMMAND LINKAGE (angle 7)

- Linkage is carried three ways: a `skill_agent` tag on doctor routers, `ownerMode` plus `choreography` in metadata, or nothing.
- The metadata says the mode `SKILL.md` loads second, but several routers never load it, for example `/create:skill` and `/create:agent`. 27 of 45 command files reference no skill path (pi lineage, not re-counted by the orchestrator).
- `/create:skill-parent` names an owner mode with no directory of its own (pi lineage, not re-checked).
- Nine skills have no command front door.

**R7.** Link command-first. The command declares its owner skill and the advisor surfaces both. A skill recommendation implies a command only when the selected mode's registry row records one. Never invent a front door for a skill that has none.

---

## 10. MEASUREMENT (angle 8)

- The labeled corpus has 195 rows and scores skill top-1, 158 of 195 at the 2026-10-11 baseline. No row is keyed to a command group outside doctor and memory-save.
- The ambiguity slice has no expected-ambiguous labels, and the replay gate does not assert abstention on rows whose gold answer is none (codex lineage).
- Existing command tests check that bridges exist and resolve. Only the doctor family has a behaviour proof.

**R8.** Add a command-routing harness beside the calibration corpus. Per command: a typed-slash row, a plain-chat row, a near-miss row where the owner skill should win, a row with a missing argument and a row that must not start a mutating command. Add child-session variants. Report command recall at 1, command precision, unsafe-run rate, ask recall and precision, and child auto-start rate. Set thresholds from a captured baseline, not from the doctor packet's 12 of 14.

---

## 11. PRIOR ART AND FAILURE MODES (angles 9 and 10)

**Prior art.** Claude Code merged custom commands into skills that the model may invoke, with a `disable-model-invocation` field for side-effect workflows. Codex deprecated custom prompts in favour of skills invoked explicitly or implicitly. GitHub Copilot documents a slash picker whose commands vary by context. The pattern supports one packaged workflow with two entry points and a per-workflow invocation policy. Host frontmatter cannot be the mechanism here, because one runtime of seven reads it. Cursor and Devin documentation was not fetched.

**Failure modes and controls (R10).**
- Command against its own owner skill ties inside the ambiguity margin. Control: the same-owner precedence rule in R2.
- A dispatched child has stop-for-yes turned into record-and-continue. [SOURCE: AGENTS.md:84] Control: a child may start read-only and add-only commands only, unless its parent's brief names the command. This risk is derived from the rule text. No child was observed starting a command.
- A command workflow writes, which re-fires Gate 2. Control: route once per turn and command.
- Doctor lead phrases over-trigger, measured as "disable comment hygiene gate" leading with `/doctor:git hooks`. Control: keep lead phrases diagnostic.
- The loop command must keep its parent and leaf boundary: the leaf agent never dispatches.

---

## 12. PER-COMMAND VERDICTS

Every command should be surfaced. Risk is `declared` for doctor commands, from `_routes.yaml`, and `inferred` elsewhere. "Strict" is the opencode lineage's line, ask before any write. "Ladder" is the pi lineage's line, run tracked in-repo writes. "Merged" is the orchestrator's judgment explained in section 13: start means begin the command's own setup, which asks for mode, target and spec folder where its contract requires.

| Command | Risk basis | Strict | Ladder | Merged |
|---|---|---|---|---|
| `/create:agent` | inferred, tracked write | ask | run | start |
| `/create:benchmark` | inferred, tracked write | ask | run | start |
| `/create:changelog` | inferred, tracked write | ask | run | start |
| `/create:command` | inferred, tracked write | ask | run | start |
| `/create:diff` | inferred, report only | run | run | start |
| `/create:feature-catalog` | inferred, tracked write | ask | run | start |
| `/create:goal` | inferred, tracked write | ask | run | start |
| `/create:manual-testing-playbook` | inferred, tracked write | ask | run | start |
| `/create:readme` | inferred, tracked write | ask | run | start |
| `/create:repo-rule` | inferred, tracked write | ask | run | start |
| `/create:skill` | inferred, tracked write | ask | run | start |
| `/create:skill-parent` | inferred, tracked write | ask | run | start |
| `/create:with-human-voice` | inferred, edits prose | ask | run | start |
| `/deep:ai-council` | inferred, multi-model cost | ask | ask | ask |
| `/deep:research` | inferred, executors and long budget | ask | ask | ask |
| `/deep:review` | inferred, multi-iteration cost | run | ask | ask |
| `/design:chart` | inferred, new artifact | run | run | start |
| `/design:diagram` | inferred, new artifact | run | run | start |
| `/design:extract` | inferred, live URL | run | ask | ask |
| `/doctor:agents-md` | declared, embed and restore mutate | ask | ask | ask, check runs |
| `/doctor:ci` | declared, scaffold and toggle mutate | ask | ask | ask, report runs |
| `/doctor:deep-loop` | declared, add-only | run | run | start |
| `/doctor:env` | declared, mutates | ask | ask | ask |
| `/doctor:git` | declared, mutates | ask | ask | ask |
| `/doctor:helper` | declared, read-only | run | run | start |
| `/doctor:install` | declared, guide is read-only | ask | run | start |
| `/doctor:mcp` | declared, install mutates | ask | ask | ask |
| `/doctor:overlay` | declared, apply and repin mutate | ask | ask | ask, status runs |
| `/doctor:runtime-mirrors` | declared, read-only | run | run | start |
| `/doctor:setup` | declared, read-only | run | run | start |
| `/doctor:sk-code` | declared, quality mutates | ask | ask | ask, setup runs |
| `/doctor:sk-skill` | declared, convert mutates | ask | ask | ask, check runs |
| `/doctor:skill-advisor` | declared, tune and rebuild mutate | ask | ask | ask, read routes run |
| `/doctor:speckit` | declared, add-only | run | run | start |
| `/doctor:symlink` | declared, link and unlink mutate | ask | ask | ask, check runs |
| `/doctor:update` | declared, mutates | ask | ask | ask |
| `/prompt:improve` | inferred | ask | run | start |
| `/speckit:plan` | inferred, tracked write | ask | run | start |
| `/speckit:implement` | inferred, writes code | ask | run | ask |
| `/speckit:complete` | inferred, plans and writes code | ask | run | ask |
| `/speckit:resume` | inferred | ask | run | start |
| `/speckit:save` | inferred, tracked write | ask | run | start |
| `/speckit:search` | inferred, read-only | run | run | start |
| `/speckit:handoff` | inferred, prepares a relaunch | ask | run | ask |
| `/local-skilled-alignment` | inferred, findings report | ask | run | start |

The policy belongs to the route where a command has several: a doctor command's read-only route starts while its mutating route asks.

---

## 13. OPEN DECISION: HOW STRICT IS THE DEFAULT

The lineages split on one judgment. The opencode lineage asks before 27 commands, anything that writes. The pi lineage asks before 15, only declared mutations, out-of-repo effects and long model budgets. Both come from the same model family, so the split is evidence that the question is a preference and not a finding.

The codex lineage offers the grounding that resolves most rows: starting a command is not the same as authorizing its effects. A started command still runs its own setup, which asks for a mode where none was typed, asks Gate 3 before the first write and stops for a yes at an irreversible step. Under that reading the default can be to start, with ask-first reserved for what the command's own gates do not cover: model cost, effects outside the repository, a hand-off into code writing and declared mutations of settings.

**Operator decisions, 2026-11-12, after the independent review in `synthesis-review.md`.**

| ID | Decision |
|---|---|
| D1 | A surfaced command that writes tracked files the user asked for is started, in its confirming mode and never `:auto`. |
| D2 | The command is surfaced beside its hub mode as a suggestion, and the model picks freely between the command path and the skill path, even for the whole job. The operator chose this looser reading over "command by default". Either path must still be the skill's or the command's own workflow, never an improvised one. |
| D5 | The private, untracked `/local-skilled-alignment` command is excluded. The inventory covers the 44 tracked commands. |
| D3 | A deep loop is offered to a chat user only on depth wording, and always asked before it starts. |
| D4 | The umbrella bridge id `command-spec-kit` is retired from Gate 4 once each `/speckit` command has its own row. |

The review corrects this section's premise: a started command does not reliably run its own setup, so D1 depends on the review's G2 check that a started command is followed.

This is the orchestrator's judgment from one reading. What would change it: a recorded case where a started command skipped its own setup question on a runtime, or a baseline from the R8 harness showing a high unsafe-run rate.

---

## 14. ELIMINATED ALTERNATIVES

| Alternative | Why eliminated | Lineages |
|---|---|---|
| Lower the 0.8 threshold | At threshold 0 the planning prompt surfaces three skills and no command | opencode |
| Raise the brief token cap | Measured heads fit, the gap is in the data contract | all three |
| Enforce at the hook | The hook is advisory and fails open | all three |
| Rely on runner refusal alone | It fires after the workflow is already chosen | opencode, pi |
| Put a static list of 45 commands in `AGENTS.md` or in every fallback | It drifts and spends the rule budget, and the doctor packet rejected the same idea | all three |
| Add a new gate or a fifth registry | Gate 2 already holds the per-turn slot, and four sources already drift | pi |
| Derive risk from `allowed-tools` or from the command name | `Bash` is declared everywhere, and names invert the truth | pi |
| Infer a command from a skill recommendation | 27 commands point at no skill and one owner mode dangles | pi, opencode |
| Treat a high score as execution approval | Selection, loading and effect are separate gates | codex |
| Use host frontmatter as the policy carrier | One runtime of seven reads it | opencode |
| Reuse skill top-1 accuracy as proof of command coverage | The gold labels are skills | codex |

## Divergence Map

No lineage ran in divergent mode, and none recorded a pivot. The disagreements between lineages are the divergence worth keeping:

- Run-or-ask strictness, section 13. Unresolved, operator decision.
- Whether a model can start a slash command itself. Two lineages said no runtime allows it. The orchestrator observed that Claude Code does. Other runtimes unverified.
- The 0.08 no-slash adjustment. One lineage denied it exists. The line is confirmed.
- Which source should own command identity: the command tree, hub metadata, the allow-list or the doctor manifest. R1 picks the tree plus mode registries. The codex lineage holds that the evidence supports reconciliation but does not settle ownership.
- Remaining frontier: a measured command-recall baseline, an observed child session, and brief delivery exercised on Cursor, Devin, Pi and DSH.

---

## 15. OPEN QUESTIONS

1. How strict is the run-or-ask default, section 13.
2. Which skill owns `/prompt:improve`, `/speckit:save`, `/speckit:search`, `/speckit:handoff` and `/local-skilled-alignment` in the inventory. They carry no owner metadata today.
3. Is the brief delivered in a dispatched child session on each runtime. Inferred from source, not observed.
4. Do the 17 doctor workflows load the skill their router tags. Not verified.
5. Which runtimes besides Claude Code let the model start a command itself.
6. The run's own config carried `stopPolicy: max-iterations` at top level and `antiConvergence.stopPolicy: fail-closed` beneath it. The cap won, but the two fields disagree and deserve one owner (codex lineage).

---

## 16. EVIDENCE STATUS

Opened and confirmed by the orchestrator: `fusion.ts:1197` and `:689`, `render.ts:97` and `:109`, `projection.ts:86` and `:1062`, `advisor-tool-schemas.ts:294`, `explicit.ts:97` and `:169`, `contract.ts:10`, `AGENTS.md:84`, `derive-command-bridges.cjs:306`, `skill-advisor-hook.md:25`, `sk-doc/mode-registry.json:12`, and the `counts` block of the generated bridge file.

Two lineages cite `AGENTS.md:90` for the Gate 4 tie-break. In this checkout that line is blank and the sentence sits one line above. The claim holds, the line number is off by one.

Not re-checked by the orchestrator and carried on the lineage's word: the per-prompt candidate scores at threshold 0, the counts of commands that reference no skill path, the dangling owner mode, the corpus class sizes and every external documentation quote.

---

## 17. CONVERGENCE REPORT

- Stop reason: `maxIterationsReached` in all three lineages, as the stop policy forced.
- Total iterations: 30, 10 per lineage.
- Angles addressed: 10 of 10 in every lineage.
- New-information ratios stayed far above the 0.05 threshold, which was telemetry only. The pi lineage reported 1.00 for every iteration, which reads as each iteration opening a new angle and not as a measure of depth.
- Merged registry: `findings-registry.json`. Attribution: `fanout-attribution.md`. Resource map: `resource-map.md`, cited here because the run emitted it.
- The recommendations converge across lineages on R1, R2, R3, R6, R7 and R8. They diverge on the strictness of R4.
