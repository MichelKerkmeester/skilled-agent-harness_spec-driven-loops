ROLE: Release-notes writer for the Skilled framework.

TASK: Write the top of the rewritten v4.0.0.13 changelog into `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/060-v4-0-0-13-changelog-rewrite/scratch/fragments/a-top.md`.

CONTENT, in this order:
1. Frontmatter with exactly these keys in order: title, description, trigger_phrases, importance_tier ("normal"), contextType ("general").
   - title: "v4.0.0.13, Sessions That Never Run Out and Plugins on Both OpenCodes", or a sharper one that names BOTH headlines equally, under 80 characters, in the shape `v4.0.0.13, <editorial title>`.
   - description: 250 characters at most, names both headlines equally.
   - trigger_phrases: "v4.0.0.13 release notes", "skilled v4.0.0.13", "in-session handover", "opencode 1 and 2 support", "session relaunch loop".
2. H1 equal to the title.
3. Opening narrative, at most 5 short paragraphs:
   - Paragraph 1: one confident lead for BOTH headlines together, saying what you can now do.
   - Paragraph 2: the handover.
   - Paragraph 3: OpenCode 1 and 2. Make paragraphs 2 and 3 about the same length.
   - Paragraph 4, one or two sentences: the rest of the release, meaning the new name for the framework code surface, sturdier state and reliability fixes, the local model that frees its memory, and the ClickUp, Figma and Code Mode fixes.
4. The spec-folder blockquote line, copied from before.md verbatim except one fix: add the missing comma after the first `(Level 2)` that is followed by `` `specs/sk-code/012 ``.
5. `&nbsp;` then `## Why This Release`: at most 4 sentences or two short paragraphs. One gap per headline (auto-compaction losing detail, and OpenCode 2 loading none of the plugins), then the gain.
6. `&nbsp;` then `## What's New at a Glance`: at most 12 bullets, each a bold sentence plus one or two plain sentences.
   - Order: alternate the two headlines for the first six bullets (handover, OpenCode, handover, OpenCode, handover, OpenCode), so both lead equally.
   - Then the remaining topics: the rename, settings and `/doctor:env`, state, locks and reliability, local model memory, and ClickUp, Figma and Code Mode.
   - Merge bullets to stay at 12 or fewer. Fold the testing proof into an OpenCode bullet and the thirteen-situation live proof into a handover bullet.

Write nothing after the glance list.

SOURCE OF FACTS: `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/060-v4-0-0-13-changelog-rewrite/scratch/before.md` (the current v4.0.0.13 changelog). Every fact, number, path, command and name you write must already be in that file. Add no new claim. You may drop low-value detail and merge repeats.

STYLE MODEL: read `.skilled/changelog/skilled/v4.0.0.0.md` first (at least its opening, Why This Release, glance list and two topical sections). Match its voice: confident, benefit-first, concise, a smart non-developer reader, what you can now do before how it works. Mechanism only where it earns its place.

HARD RULES (the validator enforces them):
- No Oxford commas, no em dashes, no semicolons.
- No phase numbers, finding ids or internal labels.
- H4 (`####`) headings of 2-7 words, benefit-led, never numbered. No H3.
- Exactly one `&nbsp;` line before every H2 and nothing between H4 items. No `---` rule in the body.
- One idea per sentence, active voice, no hedging. No metrics soup.
- Say each fact once, in the section whose job it is.

THE RELEASE HAS TWO CO-EQUAL HEADLINES: (1) in-session handover, where a session near its context limit hands itself to a fresh session in the same terminal; (2) the framework on OpenCode 1 and 2, where all 17 plugins, the agents, the commands and one config run on both versions, side by side, tested live on 1.19.3 and 2.0.32. Neither may read as secondary.

OUTPUT: write ONLY the fragment file named in your task, as plain markdown. Do not edit any other file. When done, print the word count of your fragment.
