---
title: "Sources: vendor prompting pages read for this packet"
description: "The five vendor pages every lens read, with their URLs and fetch date. The page text itself was kept in scratch/sources/ only for the run and deleted at closeout."
trigger_phrases:
  - "vendor prompting sources"
importance_tier: "normal"
contextType: "research"
---
# Sources: vendor prompting pages read for this packet

All five pages were fetched as markdown on 2026-09-24. Every lens read the same copies. The copies sat in `scratch/sources/` for the run and were deleted at closeout, because this repository is published and the page text belongs to its publishers. Line numbers cited in the lens files refer to those copies, which match the `.md` rendering each URL serves.

| Page | URL | What it covers |
|------|-----|----------------|
| Claude prompting best practices | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices | Techniques for all current Claude models, plus migration notes |
| Prompting Claude Opus 5.5 | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5 | Effort, unattended runs, progress updates, pasted text, multi-app exploration |
| Prompting Claude Opus 5 | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5 | Verbosity, task scope, over-verification, subagent damping, self-correction |
| Prompting Claude Fable 5.1 | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-1 | Finishing the task, scope of the deliverable, tests, writing density, search triggering |
| Using GPT-6 (OpenAI) | https://developers.openai.com/api/docs/guides/latest-model | GPT-6 Astra, Sol and Luna. Prompting section covers initiative, instruction following, style, delegation, testing |

The OpenAI URL resolves to the GPT-6 family page (`latestModelInfo.model: gpt-6-astra`). Its prompting advice was measured on GPT-6 Astra, and the page asks readers to evaluate it on Sol and Luna for their own workload.
