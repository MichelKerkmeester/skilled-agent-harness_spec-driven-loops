---
title: "Synthesis: what the three lenses found, and what was applied"
description: "Ranked change list from the Opus, GPT-6 Luna and MiMo lenses on AGENTS.md, the repo rules and sk-prompt, each item re-checked against the vendor page and the repository before it was accepted or rejected."
trigger_phrases:
  - "prompting guide alignment synthesis"
  - "vendor prompting findings applied"
importance_tier: "normal"
contextType: "research"
---
# Synthesis: what the three lenses found, and what was applied

Seven lens files fed this list: `lens-opus.md` (written before any delegate output was opened), and `lens-luna-{agents,rules,prompt}.md` and `lens-mimo-{agents,rules,prompt}.md` from GPT-6 Luna max-fast on cli-devin and MiMo v2.6 pro high on cli-pi. Every row below was re-opened at the cited vendor line and repository line before it was accepted. Agreement between lenses raised an item's priority; it never replaced that check, and three items that two lenses agreed on were rejected once the file was read.

Vendor line numbers refer to the page copies listed in `sources.md`. Repository line numbers refer to base `c70180f373`.

## 1. How the delegate runs were checked

- All six briefs exited 0 with empty stderr: Luna 500, 382 and 340 seconds; MiMo 605, 665 and 462 seconds.
- Every lens file has the three required sections and stays within the 12-finding cap.
- `git diff | shasum` after both lanes matched the pre-dispatch hash `44a31fdf`, and the only new paths are the lens files and lane logs inside this packet, so neither delegate wrote to the worktree.
- No delegate asked a Gate 3 question; both treated the stated pre-resolution as binding.

## 2. Applied

Ranked by how many lenses reached the item independently, then by how directly the vendor page addresses it.

| # | Change | Target | Lenses | Vendor evidence | Repository evidence |
|---|--------|--------|--------|-----------------|---------------------|
| 1 | Ask the one consolidated question before the work its answer would change, after reading what could answer it; Gate 3 keeps its place first | `AGENTS.md` §2 Consolidated Question Protocol; `uncertainty-and-honesty.md` §1 | Opus, Luna ×2, MiMo | `openai-gpt-6.md:68-71` | `AGENTS.md:104` "before any analysis or tool calls" against `uncertainty-and-honesty.md:51` "Investigate before you ask"; the same file repeats the clash at `:56` |
| 2 | sk-prompt asks its one question only in an interactive run whose goal is open; agent and non-interactive runs proceed on stated assumptions | `sk-prompt/SKILL.md` §4 ALWAYS 1, NEVER 1 | Opus, Luna, MiMo | `openai-gpt-6.md:62-71` | `SKILL.md:329` and `:351` against `prompt-improver.md:44` and `:92` (a leaf that cannot wait for a reply) |
| 3 | Name the file and quote the line when a rule, skill or gate makes the agent pause, ask or leave work undone | `AGENTS.md` §10 | Opus, MiMo ×2 | `openai-gpt-6.md:86-89` | No such instruction anywhere in `AGENTS.md` or the rules |
| 4 | Drop the unsourced Success Rate column | `sk-prompt/SKILL.md` §3 matrix; `references/patterns-evaluation.md` §2 matrix | Opus, Luna ×2, MiMo | `claude-prompting-best-practices.md:32`; `openai-gpt-6.md:40` (re-check measured claims on your own workload) | Seven percentages at `SKILL.md:309-315` and `patterns-evaluation.md:44-50` with no measurement cited anywhere in the skill |
| 5 | Add 3–5 varied examples in `<example>` tags to the few-shot pattern | `patterns-evaluation.md` §4 TIDD-EC + Few-Shot | Opus, Luna, MiMo | `claude-prompting-best-practices.md:85-90` | The pattern at `:392-405` has three bare cases and no separation from instructions |
| 6 | Put long source material first and end with the ask | `cli-prompt-quality-card.md` §4 Arrangement | Opus, Luna, MiMo | `claude-prompting-best-practices.md:242-248` | `:75` fixes the order as task first, context after, with no long-input case |
| 7 | Law 4 halts where the §2 table says to ask, instead of on any uncertainty | `AGENTS.md` §1 Law 4 | Luna, MiMo | `openai-gpt-6.md:44` | `AGENTS.md:16` "Stop immediately if uncertain" against `:75` "40-79%: Proceed with caveats" |
| 8 | Replace "frequent self-checks and reasoning loops" with a recheck on new evidence, a failed check or an open risk | `AGENTS.md` §3 Execution Behavior | Luna, MiMo | `prompting-claude-opus-5.md:61`; `prompting-claude-opus-5-5.md:53` | `AGENTS.md:123`; the final-state and completion gates stay untouched |
| 9 | Violation Recovery asks Gate 3 only when it fired and nothing answers it; any other skipped gate runs before the next tool call | `AGENTS.md` §2 Violation Recovery | Luna, MiMo | `openai-gpt-6.md:80` | `AGENTS.md:107` sends every skipped gate to a Gate 3 question, against `:60` (the answer holds for the session) and `:61` (children never emit it) |
| 10 | Model ids, CLI flags and tool versions are checked against the live tool before being named as current | `uncertainty-and-honesty.md` §2 | Opus, Luna | `prompting-claude-fable-5-1.md:851-854` | This packet's own roster work: the cli-devin docs listed 2 of 12 live Luna ids and none of the GPT-6 family |
| 11 | Before a tier-3 stop, finish every reversible step the approval does not depend on | `blast-radius.md` §3 | Opus, MiMo | `openai-gpt-6.md:68-71` | `blast-radius.md:86-91` requires the rollback and the wait, and says nothing about the work before it |
| 12 | A re-orientation restatement carries the operator's standing constraints and decisions in their own words | `communication-handoff.md` §1 | Luna, MiMo | `prompting-claude-fable-5-1.md:831-836` | `:72-76` lists done, open and changed, and nothing about constraints |
| 13 | Enhanced prompts address the executing model in the second person for the role line | `sk-prompt/SKILL.md` §4 NEVER 4 | Opus, MiMo | `claude-prompting-best-practices.md:102-104` | `SKILL.md:360` bans the second person, while the skill's own card opens its persona block with "You are dispatched AS" (`cli-prompt-quality-card.md:153`) |
| 14 | Ask for conclusions and the criteria behind them, not a transcript of the reasoning | `patterns-evaluation.md` §4 RCAF + CoT | Luna, MiMo | `prompting-claude-opus-5-5.md:53`, `:83` (reasoning-extraction declines) | `patterns-evaluation.md:371` "Show reasoning at each step" |
| 15 | Name what to do in the wording check, not only what to avoid | `cli-prompt-quality-card.md` §4 Expression | Opus; Luna and MiMo raised it against the agent file | `claude-prompting-best-practices.md:341` | `:74` checks specificity only |
| 16 | The approach list is three to five bullets | `communication-decisions.md` §3 | MiMo | `openai-gpt-6.md:80` | `:106` "three to seven" against the five-item cap at `communication.md:181` |
| 17 | RICCE is defined once, as the five prompt elements | `references/depth-framework.md` §4 | Luna | `openai-gpt-6.md:80` | `SKILL.md:341` and playbook SP-012 expand RICCE as Role, Instructions, Context, Constraints, Examples; `depth-framework.md:263-271` maps it as Relevance, Correctness, Coherence, Clarity, Efficiency |
| 18 | Skill guidance ranks with the rule files, below an explicit operator instruction and below every hard blocker | `REPO RULES.md` Precedence | MiMo; Opus found the gap | `openai-gpt-6.md:80-83` | `REPO RULES.md:22-27` ranks rule files and never mentions skills |

Rows 16 and 17 come from one lens each. They were kept because each is a contradiction a reader can confirm in two lines, and GPT-6's page names exactly this kind of conflict as a cause of early pauses (`openai-gpt-6.md:80`).

## 3. For the operator

These three survived verification but are not mine to settle.

**LOGIC-SYNC: how many improvement cycles `@prompt-improver` runs.** `sk-prompt/SKILL.md:464` (§7 Deterministic Agent Rules) allows "up to 3 total improvement cycles", and two playbook scenarios assert that cap for `@prompt-improver` (`manual-testing-playbook/depth-clear-loop/depth-iteration-cap.md:30`, `clear-scoring/forty-of-fifty-threshold.md:30`). The agent itself says "retry exactly once" (`prompt-improver.md:83`) and "Retry at most once" (`:189`). Luna and MiMo both found it. The first draft of this synthesis resolved it toward the agent by reading `SKILL.md:456` as naming the agent the canonical home, but that line closes the Model Eligibility subsection and covers only eligibility. Either answer changes tested behavior, so neither file was changed.

**LOGIC-SYNC: the mandatory stop-for-yes against the reversibility ladder.** `AGENTS.md:116` requires a rollback and a wait before any delete, overwrite, migrate, deploy, send or install, and says no rule file relaxes it. `blast-radius.md:61-62` prices a deleted tracked file as "Proceed" and an installed dependency or reversible migration as "Say what undoing costs, then proceed". Luna and MiMo both proposed narrowing `AGENTS.md` to the irreversible tier (`openai-gpt-6.md:71` says reversible work needs no permission). By `AGENTS.md`'s own precedence the rule file is the one that is wrong, but relaxing a mandatory wait is a safety call, so neither file was changed. The two ways to settle it are to narrow `AGENTS.md:116` to tier 3, or to bring `blast-radius.md` §2 up to the `AGENTS.md` list.

**The agent template's emphasis labels.** `prompt-improver.md` uses CRITICAL ×2, IMPORTANT, HARD BLOCK ×2 and MANDATORY ×5, the register `claude-prompting-best-practices.md:489` says now over-triggers and that `cli-prompt-quality-card.md:59` already measured as underperforming. Opus, Luna and MiMo all flagged it. The labels come from `sk-create-agent/assets/agent-template.md` (`:155`, `:157`, `:428`, `:433`, `:438`), and the template's own checklist at `:814` requires the CRITICAL and IMPORTANT statements, so rewriting one agent would break its conformance with the other eleven. The proposed amendment is to that template: replace the `**CRITICAL**:` and `**IMPORTANT**:` lead-ins with plain statements of the same boundary, drop `(MANDATORY)` from the checklist headings, and change the `:814` check to "Boilerplate has Path Convention and states the agent's main boundary and secondary constraint".

## 4. Rejected

| Proposal | Lenses | Why it was not applied |
|----------|--------|------------------------|
| Reword the §2 preamble "BEFORE using ANY tool" | Opus, MiMo | It does not contradict Gate 3 or Gate 1 once read closely: "applicable" limits it to gates that fire, the Gate Actions list exempts the Gate 1 lookup, and `AGENTS.md:98` places the Gate 5 read behind Gate 3. The emphasis sits on a hard-gate heading, which Opus's lens decided to keep |
| Remove or narrow verification instructions | MiMo (evidence-and-proof), Luna (verification-only dispatch) | `prompting-claude-opus-5.md:61` describes Opus 5. This repository runs many models and keeps its gates because green runs have been wrong in recorded ways (`AGENTS.md` §4). Row 8 trims the one self-check prompt instead |
| Say when delegation pays | Luna, MiMo ×2 | Restraint test (`decision-tests.md` §4): no failure observed here. `delegation-and-orchestration.md` §1 already decides both directions with one cost check |
| Relax the card's per-step verification clause | Luna, MiMo | `cli-prompt-quality-card.md:56` rests on the repository's own measurement across executors, which outranks a note about one model |
| Treat ASK/DO/THEN as internal triage | Luna ×2 | One model family. It fires only on ambiguous requests, where restating the reading is most of the reply. The tension with `communication.md` §5 is noted, not settled |
| Allow tables in replies when clearer | Luna | `openai-gpt-6.md:46` tells the operator to specify the style they need, and `communication.md:91-96` is that specification |
| Ask about embedded instructions only when material | Luna | The other two lenses judged `AGENTS.md:284` covered, and surfacing embedded instructions is an injection defense |
| Add a parallel-tool-call line | Luna | `uncertainty-and-honesty.md:118` already says to batch tool calls, and the harness injects its own |
| Require a progress line at each checkpoint | MiMo | `uncertainty-and-honesty.md:118` already says to report at checkpoints, and the line Fable's page warns about, "hold all findings for the final response", is not present |
| Add a per-model behavior reference to sk-prompt | MiMo | It reverses the v3.0.0.0 removal of per-model profiles without anyone to keep it current |
| Make DEPTH's perspective and phase quotas optional | Luna | One lens, and a rewrite of the methodology rather than an alignment fix |
| Read a request's mood (act or assess); ban unasked negatives | Opus | Only my own lens raised them, and no delegate backed either |
| Put the dispatch prompt above skill text in the persona block | MiMo | One lens. Row 19 settles skill precedence for every session that loads the router |
| Separate `<40%` handling and an open-work checklist | MiMo | Covered by the table's own "or mark UNKNOWN" and by `AGENTS.md:125` |
| Separate the §7 escalation bar from the table | Luna | §7 applies after two failed attempts, a different state from a first read. Whether Gate 1's "proceed bar" means 80% or 40% is left open |

**Contradictions that did not hold up:**
- The estimate rule (`answer-the-actual-request.md:93-96` names `communication-decisions.md` §4 and explains how the two fit).
- Filler against receipts (`communication.md:113` covers announcing a call before it runs; `communication-handoff.md:86` covers the close-out after it).
- PLAN-WORKFLOW steps 2 and 4 (the text separates them by whether you can comply).
- `AGENTS.md:283` against `:125` (the first ends "or say nothing is").
- A new file outside the named area (`scope-discipline.md:80` tests scope and `blast-radius.md:61` tests reversibility; both apply).
- The RCAF complexity ranges (one table keys on primary need, the other on task traits).
- Em dashes in `AGENTS.md` (`communication-prose.md` governs replies).

Two further contradictions, `depth-framework.md:110,130` against the agent's no-wrapper-prose rule and "maximum power" against "start simple" in `patterns-evaluation.md`, were not verified and were not acted on.

## 5. Outside the three surfaces

- `run-all-drift-guards.sh` exits 1 at this base. All nine errors are in tracked files this packet does not touch: six probe scripts under `cli-jev/.../benchmark/reports/*/raw/` without `set -uo pipefail`, and three `ROUTER-DEAD-PATH` hits in skill copies inside old spec-folder containment directories.
- `cli-external-orchestration/shared/references/child-dispatch-preamble.md:61` defines completion as files existing on disk, which a read-only dispatch cannot meet.
- The cli-devin docs disagree on the default permission mode and default model, note Gemini as retired while the allowlist keeps `gemini-3-8-flash-high`, and list Grok without an allowlist entry.
