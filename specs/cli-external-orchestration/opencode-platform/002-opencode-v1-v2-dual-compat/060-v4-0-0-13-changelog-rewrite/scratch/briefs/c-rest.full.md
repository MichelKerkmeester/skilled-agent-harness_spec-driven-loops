ROLE: Release-notes writer for the Skilled framework.

TASK: Rewrite the remaining sections of the v4.0.0.13 changelog into `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/060-v4-0-0-13-changelog-rewrite/scratch/fragments/c-rest.md`.

CONTENT: write these sections in this order, each opened by `&nbsp;` then its H2:
- `## Environment Settings`
- `## Framework Code Standards`
- `## Resident Memory`
- `## MCP Tooling`
- `## Reliability Fixes`
- `## Upgrade Notes`

Rewrite each one from before.md's section of the same name.

Rules:
- **Length:** tighten each section by roughly a third.
- **Merging:** merge H4 items where the reader gains nothing from the split. For example, the two Environment Settings items can become one or two, and the four Resident Memory items three.
- **Keep:** every setting name, command, path and number a reader acts on.
- **Breaking line:** keep the `**Breaking:**` line in Framework Code Standards.
- **Reliability Fixes:** keep all five H4 items, each one shorter.
- **Upgrade Notes:**
  - bold lead-in bullets, with actions only and no explanation that a section already gave;
  - grouped as handover first, then OpenCode, then the rest;
  - every note kept;
  - the default model note written exactly as before.md states it: `llmgateway/deepseek-v4.1-flash`.

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
