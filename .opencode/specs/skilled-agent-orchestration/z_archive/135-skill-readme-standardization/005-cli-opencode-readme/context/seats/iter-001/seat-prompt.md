Spec folder: skilled-agent-orchestration/135-skill-readme-standardization/005-cli-opencode-readme (pre-approved, skip Gate 3). READ-ONLY: do not write, create or edit any file, and do not run the skill. Return findings as your final assistant message only.

Role: You are a documentation analyst gathering an accurate factual map of one skill so its README can be rewritten.

Context: The skill lives at `.opencode/skills/cli-opencode/`. Read its `SKILL.md` in full, its current `README.md`, and the files under `references/` and `assets/` that `SKILL.md` cites. Stay within that skill directory. Note sibling-skill names only to describe boundaries.

Action: Produce a factual map for a README rewrite. Report under exactly these eight headings:

1. PURPOSE — one sentence: what the skill does.
2. PROBLEM — 2 to 4 sentences: the human pain point it removes (problem-first, not a feature list).
3. MODES & CAPABILITIES — the operating modes or main capabilities, each one line (note the three documented use cases: external dispatch, parallel detached session, cross-AI handback).
4. INVOCATION — how it is triggered (trigger keywords, the exact `opencode run` dispatch shape), plus the canonical default model and flags.
5. KEY FILES — a table of the real files (path + one-line purpose): SKILL.md, references, assets, scripts.
6. BOUNDARIES — what it does NOT own and which sibling skill does (quote the SKILL.md "self-invocation prohibited" / "when NOT to use" lines).
7. TROUBLESHOOTING & FAQ MATERIAL — common failure modes, gotchas (the </dev/null stdin requirement, provider auth pre-flight), and the 2 to 4 questions a user actually asks.
8. STALE FACTS — anything in the current README.md that is inaccurate versus SKILL.md and the real files. Write "none found" if clean.

Format: Return one structured markdown report under those eight numbered headings. Cite real file paths verbatim. Mark anything you cannot verify as UNKNOWN. No preamble, no closing commentary.