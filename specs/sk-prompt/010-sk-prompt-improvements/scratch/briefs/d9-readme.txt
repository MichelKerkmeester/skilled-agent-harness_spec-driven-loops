TASK: update one file, .skilled/skills/sk-prompt/README.md, so it describes the rebuilt skill.
Read this file, .skilled/skills/sk-prompt/SKILL.md and
.skilled/skills/sk-prompt/references/improvement-checklist.md. Read nothing else. These two are
the source of truth; do not invent behaviour they do not state.

Keep the README's structure, headings order and tone. Change only passages that describe DEPTH,
rounds, phases, perspectives, RICCE, energy, "one retry", or framework selection by scoring.

Required end state:
1. Frontmatter description (line 3): "Prompt engineering engine that turns a vague request into a
   structured prompt in one pass: a ten-row checklist, one component skeleton with optional
   framework presets, and CLEAR screening." Bump the README frontmatter version by one major step
   if it has one (for example 3.x.y.z -> 4.0.0.0).
2. The overview paragraph (about line 38) describes the one-pass flow: route on the user's own
   words, check ten rows, exit early on a good prompt, write from the skeleton or a named preset,
   self-check, CLEAR screen, deliver first with open items and a change report.
3. The example transparency report (about lines 66-82): replace `DEPTH ROUNDS: 10` with
   `EFFORT: standard` and add `CHECKLIST: 7 present, 2 added, 1 not needed`, `QUICK TEST: NOT RUN`,
   and a `CHANGES:` line. The sentence after it says `$short` shows `EFFORT: quick` and `$raw` runs
   no checklist.
4. Replace the "### The DEPTH Thinking Pass" subsection (heading, its sentences and its phase
   table) with "### The One-Pass Checklist": one short paragraph, then a numbered list of the ten
   rows copied from improvement-checklist.md section 2, then one sentence on early exit and one on
   effort levels.
5. In the modes table rename the `DEPTH rounds` column to `Effort` with values: standard for
   default/text/improve/json/yaml, quick for short, thorough for refine, none for raw.
6. The FAQ answer about naming a framework (about line 187): the named preset shapes the prompt
   and is named in the change report; nothing is scored in the background.
7. Resource table rows: the depth-framework row becomes
   `| [`references/improvement-checklist.md`](./references/improvement-checklist.md) | The one-pass checklist, early exit, effort levels, quick test and change report |`
   and the playbook rows say "the checklist pass" instead of "the DEPTH-CLEAR loop".
8. Mention the router fixtures once where testing is described:
   `bash .skilled/skills/sk-prompt/benchmark/router/run_fixtures.sh` runs 12 routing fixtures.

VERIFY
Run: rg -n "DEPTH|depth-framework|RICCE|erspective|rounds|one retry" .skilled/skills/sk-prompt/README.md
Expected: rg prints nothing (exit 1).
