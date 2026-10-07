---
title: "Research: thinking discipline coverage map and decision-test verdicts"
description: "Maps the nine proposed thinking-discipline points to their existing homes in AGENTS.md and the repo rules, records two external reviews, and runs the residue through the four sk-create-repo-rule decision tests."
trigger_phrases:
  - "thinking discipline coverage map"
  - "settled and reopened decision tests"
importance_tier: "normal"
contextType: "research"
---
# Research: thinking discipline coverage map and decision-test verdicts

<!-- ANCHOR:verdict -->
## 1. VERDICT

Don't adopt the text as written, and don't create a new rule file. Six of the nine points (1 and 5–9) are already covered, and point 9 is nearly word for word. A small residue from points 2–4 is new: a settled conclusion stays settled, re-reading is not a check, and reopening needs a named reason. The operator confirmed the failure happens, so Test 4 passes. It went in as §7 of `uncertainty-and-honesty.md`, with a one-line pointer in AGENTS.md §3 Execution Behavior.

The three lenses agree on everything except the residue. DeepSeek V4.1 Flash (max) admits a small section. GPT-6 Luna (max, fast) says nowhere, because it found no recorded failure. Both full outputs are in `reviews/`.
<!-- /ANCHOR:verdict -->

<!-- ANCHOR:coverage -->
## 2. PER-POINT COVERAGE

1. **Check the request first.** Covered: `.skilled/repo-rules/uncertainty-and-honesty.md` §3 (correct a wrong premise) and `.skilled/repo-rules/answer-the-actual-request.md:60-65` (no silent reinterpretation). Its mandatory visible recap conflicts with `.skilled/repo-rules/communication.md:90-92` ("Restated summaries").
2. **Finish one approach.** Mostly covered: `.skilled/repo-rules/root-cause-and-debugging.md:87-101` (restate one level up, then change approach) and `AGENTS.md:189` (three failed fixes). An earlier packet already declined a new numeric threshold for approach switching (`specs/agents/001-terminal-proof-discipline/review-report.md:145`). New part: switch only on a blocker you can name.
3. **Stop after one check.** Partly covered: `.skilled/repo-rules/evidence-and-proof.md:143-144` ("Re-reading your own arithmetic is not an independent derivation"). Conflicts as written with `AGENTS.md` FINAL-STATE VERIFICATION and `evidence-and-proof.md` §9, which require reruns. New part: re-reading for reassurance is not a check. The proposal's claim that this is "the main source of errors on easy steps" has no source: UNKNOWN.
4. **Doubt is not evidence.** New wording. It is near `evidence-and-proof.md:64-72` and conflicts as written with `AGENTS.md` "Blockers/conflicts → ask regardless of score", the <40% band and `uncertainty-and-honesty.md` §4's contradiction halt.
5. **Don't revise just to agree.** Covered: `AGENTS.md:168` ("Never agree for conversational flow") and `uncertainty-and-honesty.md` §3. Risk: the operator's reaffirm is their decision (§3), and `REPO RULES.md` ranks an operator instruction above rule files. "Ask what fact backs the pushback" is useful only as a question, never as a demand.
6. **New evidence reopens the case.** Covered: `AGENTS.md:185` ("Recheck your work when something changes") and `uncertainty-and-honesty.md` §5.
7. **Verify against real checks.** Covered: `evidence-and-proof.md` (receipts, the command output rule) and AGENTS.md Verification Standards. Conflict: it treats "the source document" as decisive, while `evidence-and-proof.md:213-215` says docs are worthless as the final word on what happens.
8. **Don't perform caution.** Covered: `uncertainty-and-honesty.md` §6 (qualify only when it changes what the reader does) and `answer-the-actual-request.md`. Don't let it cancel real adversarial checks.
9. **Correct only material earlier errors.** Covered almost verbatim by `uncertainty-and-honesty.md` §5.
<!-- /ANCHOR:coverage -->

<!-- ANCHOR:load-gap -->
## 3. STRUCTURAL GAP

`uncertainty-and-honesty.md` loads through Gate 5's trigger table, on the first write of a session. Gate 6 loads only the communication files before a reply. Pushback that flips an answer happens mid-conversation, often on a read-only turn, where this rule may not be in context. Only `AGENTS.md:168` ("Never agree for conversational flow") is always present there. So a section in the rule file alone may not reach the moment it targets. A one-line pointer in `AGENTS.md` §3 Execution Behavior, next to "Recheck your work when something changes", would reach it. That spot is past the 16 KB Devin delivery prefix, so it costs no prefix budget, and Devin never sees it.
<!-- /ANCHOR:load-gap -->

<!-- ANCHOR:decision-tests -->
## 4. DECISION TESTS ON THE RESIDUE

Source: `.skilled/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md`.

- **Test 1, always-loaded.** No for a rule file. The residue binds only when a premise, doubt or pushback exists. The AGENTS.md line in §3 is the only always-present option.
- **Test 2, scope.** In. It is thinking posture, which `REPO RULES.md` lists as in scope.
- **Test 3, four-part refusal.** A new file is refused: an existing home already owns it (`uncertainty-and-honesty.md` §3 and §5). Per §5 of the tests, the route is "a new section inside the rule that already owns it".
- **Test 4, restraint.** Passes on the operator's confirmation (2026-10-07) that the failure happens. No packet had recorded it before; the only trace was a dispatch norm ("do not re-litigate settled decisions without new evidence") in an agents/016 iteration prompt.
<!-- /ANCHOR:decision-tests -->

<!-- ANCHOR:refusals -->
## 5. RECORDED REFUSALS

- A new rule file: refused on Tests 1, 3 and 4.
- Points 1 and 5–9 as text: refused, because existing homes cover them (Test 3, part 2).
- The visible recap from point 1: refused, because it conflicts with `communication.md` restated-summary guidance.
- "Stop after one check" as an absolute: refused, because it conflicts with required final-state proof.
- A new numeric threshold for approach switching: refused, as recorded earlier in agents/001.
<!-- /ANCHOR:refusals -->

<!-- ANCHOR:draft -->
## 6. CHOSEN DESTINATION AND SHIPPED TEXT

The operator picked the rule section plus the AGENTS.md line. The section went in as §7, after TWO REGISTERS, because `communication.md` and `communication-decisions.md` both cite §6 for the two registers; only SELF-CHECK moved, to §8. The shipped wording below is what landed in the rule file, so read the live file rather than this copy.

```markdown
## 7. SETTLED AND REOPENED

A conclusion is settled once you have derived it and run the check that settles it; for
a computed answer that check is the second derivation in `evidence-and-proof.md` §6.
Re-reading it for reassurance is not a check. Carry one approach to its conclusion, and
switch only on a reason you can name in one line; a repeat with no new evidence is one,
and `root-cause-and-debugging.md` §3 says what comes next.

Reopen a settled conclusion only for a reason you can name: a failing check, a fact that
contradicts it, a counterexample, an independent derivation that disagrees, or a changed
state. A hunch is not a reason, and neither is the bare chance of an unseen objection.
When the operator pushes back without a new fact, first check whether they could be
right, and ask what backs it only if you cannot. An instruction or decision they reaffirm
stays theirs (§3); a factual conclusion moves only on a fact. The §4 halt, the §1 bands
and the final-state proof in `evidence-and-proof.md` still apply. Without this, answers
flip under pressure and settled steps get re-checked until a correct result is talked away.
```

The AGENTS.md line, in §3 Execution Behavior right after "Recheck your work when something changes": "**Settled stays settled.** Reopen a checked conclusion only for a reason you can name, such as a failing check, a contradicting fact, a counterexample or a changed state. Pushback with no new fact is not one: first check whether they could be right, and ask what backs it only if you cannot." It points at §7.
<!-- /ANCHOR:draft -->

<!-- ANCHOR:third-review -->
## 7. THIRD REVIEW (CLAUDE OPUS 5.5, HIGH)

A fresh Opus high subagent reviewed the shipped edits read-only and said "ship with changes": no P0, three P1, seven P2. Its citations were re-read and held. The operator chose to apply all of them:

- The AGENTS.md line now says to check whether the operator could be right before asking what backs the pushback, so it no longer conflicts with "Investigate before you ask".
- Its reasons are examples ("such as … or a changed state"), so it no longer reads as a closed list that contradicts the "Recheck your work" line above it.
- Gate 3 option C says "a different change" again, the defined term in `phase-definitions.md` §2, condition 3. It also says "meets both thresholds independently", which restores the meaning the "Which to choose" trim had dropped.
- §7 names the second derivation for computed answers, switches on a reason rather than only a blocker, drops the redundant "named error", spells out what stays the operator's, and fixes two grammar slips.
- The Fires-when bullet and the router phrase now read "change a checked answer after pushback or doubt".

To pay for the restored wording, two of this packet's own trims went further: option B now says "Decide independently", and the Router commands bullet says "like any mutation". Blast-Radius now ends at byte 16,373, leaving 11 bytes of margin. The full output is in `reviews/claude-opus-5.5-high.md`.
<!-- /ANCHOR:third-review -->

<!-- ANCHOR:devin-probe -->
## 8. DEVIN READ-THE-REST PROBE (2026-10-07)

Question: would a line at the top of AGENTS.md ("If it reached you cut off, read the rest of it with your file tool before your first action") make Devin read the part past its 16,384-byte cut?

Setup: Devin 3000.11.3, `swe-2-max`, `--permission-mode auto`, run from worktree 090. Tool calls were taken from `--export` JSON, not from Devin's own account. For the B runs, the line was added to the main checkout's AGENTS.md and that file was then restored with `git checkout`; the restored file's shasum `cffdf43…` matched the original.

What Devin loads: four always-on rules, each cut at 16,384 bytes: `~/.claude/CLAUDE.md` (a symlink to the main checkout's AGENTS.md), Windsurf `global_rules.md`, `.cursor/rules/sk-vision.md` and `.cursor/rules/skill-routing.md`. The repository's own AGENTS.md is "triggered but could not be injected due to token limits", so it arrives only as a path pointer. A worktree session therefore sees the main checkout's copy. Devin also appends its own note at the cut: "Read the full file at … for additional content."

Results:
- A, without the line, prompt said not to open files: read nothing and reported NOT IN CONTEXT.
- A', without the line, the question needed content past the cut: searched, read two rule files, grepped AGENTS.md and answered correctly.
- B, with the line, same question: its first call was a grep. It then read AGENTS.md in full and loaded the Gate 6 reply rules.
- A3, without the line, a trivial task: no AGENTS.md read.
- B3 and B4, with the line, a trivial task: no AGENTS.md read in either run.

Verdict: the line does not make Devin read the file before its first action (0 of 3 runs). Devin already reads the instructions on demand when a task needs them, with or without the line. The line was not adopted. The sample is small (one model, six runs), so this is evidence against the line, not proof.
<!-- /ANCHOR:devin-probe -->

<!-- ANCHOR:devin-fix -->
## 9. DEVIN FIX: LOAD THE CHECKOUT'S OWN AGENTS.MD

Devin's documented `read_config_from` setting (docs.devin.ai, Rules & AGENTS.md, "Controlling Imports") takes `"claude": false`. A project-local probe showed it does two things. It stops loading `~/.claude/CLAUDE.md`, so the checkout's own AGENTS.md is injected with no token-limit notice. It also drops 15 of 17 skills, because Devin was finding them through `.claude/skills`. The shipped fix pairs the switch with a `.devin/skills` link to `../.skilled/skills`, one of Devin's native skill paths.

The mirror sync script's orphan pruning reads `.devin/skills/<name>/` and removes what it does not expect. Through a whole-directory link those are the canonical `.skilled/skills/<name>/SKILL.md` files. The old script, run with `--check`, listed all 14 as EXTRA, so the next `--apply` would have deleted them. The script now skips a symlinked parent.

Live result with the committed config: 14 Skilled skills plus Devin's built-ins, 12 agents plus `subagent_explore` and `subagent_general`, and rules `global_rules`, `sk-vision`, `skill-routing` and AGENTS from the worktree, all injected. The only skill lost was the personal nodeterm skill in `~/.claude/skills`, which the operator then deleted.
<!-- /ANCHOR:devin-fix -->
