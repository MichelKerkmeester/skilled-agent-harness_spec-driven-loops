You are a deep-research analyst on ONE angle, in the repo at the current --dir. READ-ONLY: never edit/write/delete anything. Investigate against the real files.

## CONTEXT
The command system was recently split into presentation .md files (.opencode/commands/<family>/*.md) + workflow assets (.opencode/commands/<family>/assets/*). Live tests dispatching bare commands to a mid-tier model showed mixed presentation-contract adherence: /doctor rendered its router menu verbatim, Gate-3 question blocks rendered perfectly across three commands, but /memory:search ignored the parseable render template defined in .opencode/commands/memory/assets/search_presentation.md section 2 and answered in free prose. Goal: find how to improve render-contract adherence for dispatched models.

## YOUR ANGLE (#9)
Presentation-contract compression: propose compressed render templates (<=10 lines) for the worst-adherence surfaces that preserve parseability while being short enough to inline into every command doc without bloating context.

## OUTPUT
ONLY a fenced ```json block:
{"angle": 9, "findings": [{"class": "DOC-DRIFT|REFINEMENT|NEW-FEATURE|BUG", "severity": "P1|P2|P3", "title": "<short>", "evidence": "<file:line or concrete comparison>", "detail": "<2-3 sentences>", "fix_sketch": "<one sentence>"}], "summary": "<2 sentences>"}