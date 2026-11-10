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
