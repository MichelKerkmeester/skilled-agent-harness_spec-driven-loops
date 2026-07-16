# Research Brief R3 — Render-contract design: exact edits for verbatim setup prompts

READ-ONLY RESEARCH TASK. No file writes are requested. Do not ask about spec
folders or documentation scope. Do not ask any questions; produce the design.

## Context (verified by prior research)

GPT halts correctly on bare commands but renders PARTIAL setup presentation:
the consolidated prompt is a fenced human-instruction block in a referenced
asset ("EXECUTE THIS SINGLE CONSOLIDATED PROMPT", review presentation ~94-99,
question text ~163-202); the command doc instructs loading it (review.md:15)
but nothing enforces verbatim rendering. Claude copies by convention.

## Your task — produce the exact minimal edits

Read (repo-root relative):
1. `.opencode/commands/deep/assets/deep_review_presentation.txt` lines 80-210
2. `.opencode/commands/deep/review.md` lines 1-100
3. For mirror scope: list which sibling presentation assets exist under
   `.opencode/commands/deep/assets/` (ls) — do not read them all.

Deliverables (before/after fenced blocks, exact file targets):
1. The SETUP_PROMPT_START/END marker wrapping + "render only the marked block
   verbatim after applying the stated omissions; do not paraphrase, summarize,
   or reorder" instruction for deep_review_presentation.txt — minimal diff.
2. The one-paragraph halt-render rule insertion for review.md's mode-routing
   section ("If halting for setup: output the marked block from the
   presentation asset verbatim; do not summarize; stop.") — minimal diff.
3. The mirror checklist: file list + the same two edits named per file, so the
   change can be applied mechanically across all five command surfaces.
4. A verification note: which 033 cells prove it (RVB-002, CXB-002 presentation
   2/2; the IMB-003 D2 gap), and what marker text the benchmark should assert.

## Output contract (strict)
Markdown, no preamble, sections DELIVERABLE 1-4, cite file:line. Minimal
diffs; no rewrite of surrounding prose.
