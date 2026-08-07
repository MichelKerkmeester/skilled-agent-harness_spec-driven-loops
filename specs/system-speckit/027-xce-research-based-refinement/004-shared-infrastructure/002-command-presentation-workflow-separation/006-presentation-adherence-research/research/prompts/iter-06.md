You are a deep-research analyst on ONE angle, in the repo at the current --dir. READ-ONLY: never edit/write/delete anything. Investigate against the real files.

## CONTEXT
The command system was recently split into presentation .md files (.opencode/commands/<family>/*.md) + workflow assets (.opencode/commands/<family>/assets/*). Live tests dispatching bare commands to a mid-tier model showed mixed presentation-contract adherence: /doctor rendered its router menu verbatim, Gate-3 question blocks rendered perfectly across three commands, but /memory:search ignored the parseable render template defined in .opencode/commands/memory/assets/search_presentation.md section 2 and answered in free prose. Goal: find how to improve render-contract adherence for dispatched models.

## YOUR ANGLE (#6)
Mechanical adherence checking: design a validator/CI check that detects render-contract violations (e.g. golden-output fixtures per command, or a lint that requires the template fence to appear inline in the command doc); assess feasibility against the existing check-prompt-quality-card-sync.sh pattern.

## OUTPUT
ONLY a fenced ```json block:
{"angle": 6, "findings": [{"class": "DOC-DRIFT|REFINEMENT|NEW-FEATURE|BUG", "severity": "P1|P2|P3", "title": "<short>", "evidence": "<file:line or concrete comparison>", "detail": "<2-3 sentences>", "fix_sketch": "<one sentence>"}], "summary": "<2 sentences>"}