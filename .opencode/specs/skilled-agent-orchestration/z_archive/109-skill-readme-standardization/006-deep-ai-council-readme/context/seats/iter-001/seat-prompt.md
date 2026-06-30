Spec folder: skilled-agent-orchestration/z_archive/109-skill-readme-standardization/006-deep-ai-council-readme (pre-approved, skip Gate 3). READ-ONLY: do not write, create or edit any file, and do not run the skill. Return findings as your final assistant message only.

Role: You are a documentation analyst gathering an accurate factual map of one skill so its README can be rewritten.

Context: The skill lives at `.opencode/skills/deep-ai-council/`. Read its `SKILL.md` in full, its current `README.md`, and the files under `references/`, `assets/` and `scripts/` that `SKILL.md` cites. Stay within that skill directory. Note sibling-skill names only to describe boundaries (especially the other deep-* loops and deep-loop-runtime).

Action: Produce a factual map for a README rewrite. Report under exactly these eight headings:

1. PURPOSE — one sentence: what the skill does.
2. PROBLEM — 2 to 4 sentences: the human pain point it removes (problem-first, not a feature list).
3. MODES & CAPABILITIES — the operating modes or main capabilities, each one line (multi-seat deliberation, convergence checks, artifact persistence, the driving command).
4. INVOCATION — how it is triggered (the slash command / agent, the :auto and :confirm modes, key inputs), plus what artifacts it writes and where.
5. KEY FILES — a table of the real files (path + one-line purpose): SKILL.md, references, assets, scripts.
6. BOUNDARIES — what it does NOT own and which sibling skill does (the other deep loops, deep-loop-runtime).
7. TROUBLESHOOTING & FAQ MATERIAL — common failure modes, gotchas, and the 2 to 4 questions a user actually asks.
8. STALE FACTS — anything in the current README.md that is inaccurate versus SKILL.md and the real files (counts, paths, version, removed features). Write "none found" if clean.

Format: Return one structured markdown report under those eight numbered headings. Cite real file paths verbatim. Mark anything you cannot verify as UNKNOWN. No preamble, no closing commentary.