Spec folder: sk-code/z_archive/013-sk-code-review-readme (pre-approved, skip Gate 3). READ-ONLY: do not write, create or edit any file. Return findings as your final assistant message only.

Role: You are verifying exact facts about the `.opencode/skills/sk-code-review/` skill so a README rewrite cites them correctly. This pass locks the precise, citable details and finds stale facts.

Context: Read `.opencode/skills/sk-code-review/SKILL.md` in full, its current `README.md`, and the `references/` files. Verify against real file contents, not memory. This skill is the stack-agnostic findings-first review baseline that pairs with `sk-code` and shares `review_core.md` with `deep-review`.

Action: Report under exactly these six headings, every claim cited to a real file path:

1. EXACT INVOCATION — how the skill is dispatched (the `@review` agent, the `CODE-REVIEW` prompt-marker prepend, pre-commit/gate validation), the review-only no-edit contract, and the exact severity taxonomy used for findings (quote the labels). Note what the review outputs and in what shape.
2. CAPABILITY ROSTER — the baseline-plus-surface ownership split (what the baseline always enforces vs what the surface overrides), the findings-first contract, and the full set of risk checklists, copied.
3. KEY FILES — a table of the real files (path + one-line role): SKILL.md, every references/ file. Mark which files are shared with deep-review.
4. WORKFLOWS & OUTPUTS — the documented review flow (the STEP 0 load, the phases) and the findings output format, cited.
5. TROUBLESHOOTING & FAQ — the concrete failure modes (unknown surface, baseline-vs-surface precedence) and the 3 to 5 questions a user most likely asks, with short grounded answers (including how it differs from deep-review and sk-code).
6. STALE FACTS IN CURRENT README — list every claim in the current `README.md` that disagrees with `SKILL.md` or the real files (counts, paths, version, the non-numbered `## Findings` / `## Review Context` sections that break the heading sequence). Write "none found" if clean.

Format: One structured markdown report under those six numbered headings. Cite real file paths verbatim. Mark anything unverifiable as UNKNOWN. No preamble.
