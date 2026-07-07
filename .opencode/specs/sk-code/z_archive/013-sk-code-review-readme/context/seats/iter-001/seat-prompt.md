Spec folder: sk-code/z_archive/013-sk-code-review-readme (pre-approved, skip Gate 3). READ-ONLY: do not write, create or edit any file, and do not run the skill. Return findings as your final assistant message only.

Role: You are a documentation analyst gathering an accurate factual map of one skill so its README can be rewritten.

Context: The skill lives at `.opencode/skills/sk-code-review/`. Read its `SKILL.md` in full, its current `README.md`, and the files under `references/`. Stay within that skill directory. This skill is a stack-agnostic, findings-first code-review baseline. It pairs with `sk-code` (which supplies the detected-surface standards) and shares review doctrine with `deep-review`. Note the sibling skills `sk-code` and `deep-review` only to describe boundaries.

Action: Produce a factual map for a README rewrite. Report under exactly these eight headings:

1. PURPOSE — one sentence: what the skill does.
2. PROBLEM — 2 to 4 sentences: the human pain point it removes (problem-first, not a feature list). Why ad-hoc review misses security and correctness, and why a stack-agnostic baseline plus surface-specific evidence beats a single generic checklist.
3. MODES & CAPABILITIES — the findings-first severity model, the baseline-plus-surface-evidence model (baseline minimums always enforced, surface standards override generic style/build/test), review-only (no code edits), and the risk checklists, each one line.
4. INVOCATION — how it is triggered (the `@review` agent dispatch, the `CODE-REVIEW` prompt marker, pre-commit or gate validation, the review-only no-edit contract) and what it outputs (severity-ranked findings with file:line evidence).
5. KEY FILES — a table of the real files (path + one-line purpose): SKILL.md, every references/ file (note review_core.md is shared with deep-review).
6. BOUNDARIES — what it does NOT own: it is single-pass not the multi-iteration loop (`deep-review`), it does not supply surface style/build/test standards (`sk-code`), and it does not edit code.
7. TROUBLESHOOTING & FAQ MATERIAL — common failure modes, gotchas (unknown surface, surface-vs-baseline precedence), and the 2 to 4 questions a user actually asks (especially how it differs from deep-review and from sk-code).
8. STALE FACTS — anything in the current README.md that is inaccurate versus SKILL.md and the real files (counts, paths, version, the non-numbered example sections in the current README). Write "none found" if clean.

Format: Return one structured markdown report under those eight numbered headings. Cite real file paths verbatim. Mark anything you cannot verify as UNKNOWN. No preamble, no closing commentary.
