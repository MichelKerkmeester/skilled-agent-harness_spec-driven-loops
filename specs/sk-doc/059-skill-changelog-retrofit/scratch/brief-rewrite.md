GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound to this packet folder, which owns the rewrite job:
  specs/sk-doc/059-skill-changelog-retrofit
That packet folder is never the changelog's spec folder. It never appears in the changelog you write.

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
Your task is complete only when the file is rewritten on disk and the checks in step 5 have been run.

AGENT: @markdown (LEAF, Depth: 1, dispatched by @orchestrate)

ROLE
You rewrite one existing skill changelog into the current house format. You keep every fact and add none.

CONTEXT
Everything you need is in this brief. Do not open other files to learn the format.
- The working directory is {{ROOT}}. Every path in this brief is relative to it. Read, write and run commands with those relative paths, or with the working directory copied exactly in front of them. Never retype the working directory from memory: a mistyped path reads as a missing file, and the file you rewrite always exists.
- The format contract, sections 2 to 5 of .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md:
<<<CONTRACT
{{CONTRACT}}
CONTRACT>>>
- The house style, the first 60 lines of .skilled/skills/system-spec-kit/changelog/v4.0.0.0.md. Take its voice, never its content:
<<<HOUSE STYLE
{{HOUSE_STYLE}}
HOUSE STYLE>>>
- The ORIGINAL changelog, untouched. A copy is saved at {{OLD}}:
<<<ORIGINAL
{{ORIGINAL}}
ORIGINAL>>>
- The file records what shipped in that version. Paths and names in it stay as written, even where they have since moved.

ACTION
1. {{FILE}} is the file you rewrite. On a first attempt it still holds the ORIGINAL above, so you need not read it. When a PREVIOUS ATTEMPT section follows this brief, the file holds your previous draft, shown in that section: fix it rather than starting over. The orchestrator wrote {{FILE}} moments before this brief reached you, so it always exists. If a read or write of it reports not found, the path you typed is wrong: use the relative path {{FILE}} exactly as written here and continue. Never halt on a missing {{FILE}}.
2. Count the changes it records. Use the compact format for under 10 changes when the version is not a major bump and nothing breaks. Use the expanded format for 10 or more changes, a major bump, or any breaking change. A major bump is vX.0.0.0 with X of 2 or more. A first release (v1.0.0.0 or any v0.x) is not a bump: choose its format by change count and breaking changes alone.
3. Before writing, list for yourself every change the ORIGINAL records outside its Files Changed table and outside any section headed Verification or Verified: each bullet, each H4 item and each claim in its opening, notes and upgrade section, including counts, before-and-after values, statements of what stayed unchanged, corrections of earlier wording and support claims. Step 5 checks each one against your file.
4. Rewrite {{FILE}} in place in that format, as one whole-file write. Do not edit it by line ranges or line hashes: a rewrite replaces every line, and a range edit can be rejected on a line-number mismatch. If any edit is rejected, write the whole file again rather than stopping.
5. Run the three checks. Fix the file and rerun until the first two pass:
   python3 {{CHECKER}} {{FILE}} --old {{OLD}}
   (exit 0 required)
   python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py {{FILE}}
   (0 hard blockers required)
   python3 {{COVERAGE}} --one {{FILE}}
   (lists the code identifiers the ORIGINAL names and your file lacks. For each one, confirm that the fact it belongs to is still stated in your file or that the fact rules below drop it, and restore any fact you lost. No exit code is required.)
   Then check every change from step 3 against your file, and restore any that is missing.

FACT RULES (these outrank every style rule)
- Every statement must come from the original. Add no fact, number, path, name, reason or benefit that the original does not state or directly imply.
- Keep every user-visible behavior change, every breaking change with its migration step, everything the reader must do, and every correction of an earlier wrong claim.
- A rename keeps both names: say what it was called before and what it is called now.
- Keep what the original says stayed unchanged (a default, a rule, an allowlist, a behavior), briefly, because readers rely on it, and keep its exact noun: if the original says routing is unchanged, do not write model routing or dispatch behavior. A list of untouched files is the exception.
- Keep each fact's timing and actor as the original gives them. Never add a word such as still, remains, stays or earlier that turns a new fact into an old one or the reverse, and never say who does something (operators, a registration step) when the original does not.
- Never explain a term the original does not explain, as in "SQLite (a file-based database)". The fact check counts such a gloss as an added claim. Name the term as the original does.
- Keep a statement of scope, for example that a release is documentation-only or does not change behavior. When the original's upgrade or migration note says more than that nothing is needed, such as that the change is rule-only or wording-only, or that readers can pull the latest version when convenient, keep that after the fixed phrase. A statement of scope never becomes a step the reader must take. Keep the original's force: a step it only recommends (should, if desired) stays a recommendation, and a release it says needs no migration gets no **Breaking:** marker. A benefit phrase (simpler, clearer, easier to adopt) may be merged or dropped while the change it belongs to is still stated.
- Keep every support claim, for example that a model id was list-verified but not dispatch-tested. Drop verification evidence: the checks, guards, tests and validators that passed, and how the release was proven.
- Name each changed thing by the identifier the original uses (a mode, command, skill, flag or file), because that is what the reader types or looks for.
- Drop what the contract drops: Files Changed tables, file-by-file lists, test counts, review-pass counts, line-count deltas and internal machinery the reader never touches.
- Keep the YAML frontmatter byte-identical when the file has one. Never add frontmatter.
- Remove the retired machine header: a bare version title such as `## [**1.2.0.0**] - 2026-03-02` or `# cli-pi v1.5.9.0`, a date line or a back link. An editorial H1 that pairs the version with a real title may stay.
- A trailing `Source:` line, or another mention of the spec folder, becomes one line directly after the summary: > Spec folder: `<the path as the original writes it>` (Level N). When the original states the level, keep it exactly as written. Otherwise take N from the SPECKIT_LEVEL marker in that folder's spec.md, and if the folder no longer exists, write the line without the (Level N) part. When the original credits more than one spec folder, put the release's own folder on that line, or join two with 'and', and keep every other credited folder where the original uses it. A credited spec folder is never dropped.
- If the original is too thin to fill a section honestly, keep the section short. Never pad it.
- The file speaks for itself. Never mention the original, a rewrite, a review, a finding or this brief in it: state each fact directly, as the release's own record.
- Every sentence must carry information from the original. Never write filler such as "The release records this detail." When a bullet has nothing more to say, state in plain words what the change means for the reader, using only the original's facts, or merge it into another bullet.
- Never repeat a sentence across sections, not even with a word or two changed. The at-a-glance bullets summarize, the H4 items explain, and Why This Release gives the motivation only. An at-a-glance bullet states the change itself, with its key name or value, never that a section below records, lists or explains it.
- ## Why This Release states only a reason the original gives outside its Verification section. A detail from a Verification section is not a reason, and neither is one change among several. When the original gives no reason, a compact file leaves the section out, and an expanded file keeps it to one sentence built from what the original's opening says the release fixes or adds.
- Never leave a section empty. With no upgrade work, the compact ## Upgrade reads exactly "No migration required." and the expanded ## Upgrade Notes reads exactly "No upgrade needed." Those fixed phrases are the template's, not a new fact.

STYLE RULES
- Plain English for a smart reader who is not a developer. Lead with why the release matters, and make the opening say what the release does, not only the problem it answers.
- At-a-glance bullets read: - **A short sentence stating the change.** One or two plain sentences on what it means.
- Compact: a summary of at most 3 sentences, an optional ## Why This Release, then ## What's New at a Glance, then ## Upgrade last ("No migration required." when there is nothing to do).
- Expanded: an opening narrative, ## Why This Release, ## What's New at a Glance, one H2 per domain (never "New Features" or "Bug Fixes"), H4 items (never H3) with benefit-led headings of 2 to 7 words, each item at least two sentences or a list (merge a thin item into its neighbor instead of leaving one sentence alone, and never reach two sentences with one that restates the heading or announces the next sentence), &nbsp; between H4 items, --- only between H2 sections, inline **Breaking:** markers only where the original calls a change breaking or gives a step existing users must take, and ## Upgrade Notes last.
- In the expanded format the bullets and the H4 items split the facts between them. A bullet gives the change and its key name or value in its bold sentence, plus at most one short sentence on what it means for the reader. The H4 item gives the rest: every number, name, reason and condition the bullet leaves out, each stated once. An H4 item never restates its bullet, the opening or its own heading. When the original says no more about a change than its bullet does, fold that change into a neighboring H4 item instead of repeating the bullet.
- No em dashes, no semicolons, no Oxford commas.

BOUNDARY
Write only {{FILE}}. No other file. No git commands.
Your handback is not a completion claim for the packet folder. The orchestrator owns that folder, its documents and its validation. Do not edit anything in the folder, do not open its documents and do not run validate.sh. The three commands in step 5 are the only checks this task needs.

HANDBACK: end your reply with exactly this line
RETURN: <PASS|FAIL> | format=<compact|expanded> | checker_exit=<n> | hvr_hard_blockers=<n>
