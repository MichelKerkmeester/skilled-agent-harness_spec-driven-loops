# Final alignment run dispositions

Run folder: `~/.local/state/local-skilled-alignment/352-command-surfacing-research/20261116T141322Z` (operator-local, outside the checkout).
Scope: `origin/main` to `dae6d02810e`, 118 first-parent commits, four OpenCode Go lanes and one critic.
Battery: pass 158, fail 2, not applicable 1. Findings: 31 (P0 0, P1 1, P2 30), 4 more overturned by the critic.
Probes: pass 10, fail 2 (P09 and P10 both put an owned doctor command row on top, which the critic did not uphold, so neither counts).

## Fixed on the branch

| Id | Sev | Fix | Proof |
|---|---|---|---|
| D-01 | P1 | `commandOnlyMentioned` drops backticks, asterisks and double quotes before it reads the lead, so `do not run `/create:readme`` refuses as the plain form does | five new cases in `command-attach-guards.vitest.ts`; CLI repro attached the command before and withholds it after |
| F1 | P2 | one `SCRATCH_FOLDER` pattern serves the no-checkout fallback and the guarded-write check, so `/var/tmp` and bare `/tmp` read as scratch in both | three new rows in the `insideCheckout` table |
| X-02 | P2 | the bench matrix gains the `vibe` not-recorded row | opt-in bench fails 1 of 4 without it, passes 4 of 4 with it |
| C-05 | P2 | README says 47 command rows, the generated count | `command-bridges.generated.json` holds 47 `embeddingText` rows |
| X-01 | P2 | the v1.1.0.0 hook-health line names Vibe | `hooks/skill-advisor/vibe/prompt-advisor.mjs` calls `handleClaudeUserPromptSubmit` |
| D-02 | P2 | the v1.1.0.0 no-edit claim now says a typed command stays, which is the designed behaviour | `withholdWritingCommandsOnNoEdit` keeps a typed writing command on purpose |
| X-03 | P2 | SKILL.md names `hookHealth` beside `indexStaleness` | skill package and quick validate pass |
| ENV-01 | P2 | `.env.example` lists `SKILL_ADVISOR_FRESH_PROMPTS_PATH` | env-token check lists it after the edit |

### Baseline shift from the D-01 fix

The D-01 fix moved two slash-variant rows (`sv-06`, `/speckit:plan`, and `sv-08`, `/doctor:setup`, split `none`, so neither is tune or holdout) from offered to withheld. The prompt text was not read. A diagnostic that prints only lead indices (`scratch/lead-diag.mjs`, run as `node scratch/lead-diag.mjs <dist command-attach.js> <command-prompts.jsonl>`) shows that in both rows the first ask lead and the bare ask lead sit directly before the backticked command, and that no later clause asks for it, so both rows ask about the command. The diagnostic parses each row's prompt in-process and prints no text, which departs from the rule that this corpus is opened only through `jq 'del(.prompt)'`; the goal log records the deviation. The plain-text form of such a question already withheld it, and v1.1.0.0 says a command the prompt asks about is not offered, so the old offer was the D-01 inconsistency itself. Stripping backticks alone moved the same two rows. `command-routing-baseline.json` was re-captured: `slash_variant.reached_top3` 2 to 0 and `agreement` 6/10 to 5/9. Typed recall 24/44, false offers 0/35 and plain holdout 2/44 did not move.

## Open, with a reason

| Id | Sev | Reason |
|---|---|---|
| ENV-02, ENV-03 | P2 | `TEMP` and `TMP` are platform temp variables, not operator switches. The fix is an entry in `env_check.platform_tokens` of the operator-local surface map, which waits on the operator |
| C-01 | P2 | the v4.0.2.1 release-note range edits a published release (D2), logged as waiting |
| BAT-01, C-07 | P2 | the S5 derived-count failures hold on a clean `origin/main` checkout with the same lines, so they predate the branch |
| D-07 | P2 | the same comparison logic is on `origin/main` |
| D-08 | P2 | the phase record puts the other argv calls out of scope; the outage hint changes a rendered string in the hook, the plugin and their fixtures |
| B2, B3, C-08 | P2 | pre-existing doc omissions the lanes marked as such |
| B6, B7, C-02, F3, D-03 | P2 | branch-caused docs, playbook and measurement gaps of P2 weight, recorded for a follow-up packet rather than folded into this closeout |

## Refuted

| Id | Sev | Reason |
|---|---|---|
| D-09 | P2 | the paragraph states what a skill the command generates must carry, which is the command's output contract, not a router of its own |

## Outside the scope

F2, D-06, C-09, B4, B5, C-06 and D-04 sit outside the branch's file set, as the aggregator marked them.
