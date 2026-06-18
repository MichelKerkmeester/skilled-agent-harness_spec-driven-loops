Spec folder: skilled-agent-orchestration/135-skill-readme-standardization/009-deep-loop-runtime-readme (pre-approved, skip Gate 3). READ-ONLY: do not write, create or edit any file, and do not run the skill. Return findings as your final assistant message only.

Role: You are a documentation analyst gathering an accurate factual map of one skill so its README can be rewritten.

Context: The skill lives at `.opencode/skills/deep-loop-runtime/`. Read its `SKILL.md` in full, its current `README.md`, and the files under `references/`, `lib/` and `scripts/` that `SKILL.md` cites. Stay within that skill directory. This is the SHARED RUNTIME the four deep loops (deep-research, deep-review, deep-context, deep-ai-council, plus deep-improvement) ride; note that relationship in boundaries.

Action: Produce a factual map for a README rewrite. Report under exactly these eight headings:

1. PURPOSE — one sentence: what the runtime provides.
2. PROBLEM — 2 to 4 sentences: the human pain point it removes (why a shared runtime exists rather than each loop rolling its own).
3. MODES & CAPABILITIES — the main components, each one line (executor dispatch, prompt-pack, output validation, atomic state, coverage-graph, Bayesian scoring, fallback routing, fan-out).
4. INVOCATION — how it is consumed (it is a library/runtime used by the loop skills, not a user command); the key scripts and entry points.
5. KEY FILES — a table of the real files (path + one-line purpose): SKILL.md, references, lib subdirs, scripts.
6. BOUNDARIES — that it is the shared foundation; which consumer skills ride it; what it does NOT do (it is not a user-facing loop).
7. TROUBLESHOOTING & FAQ MATERIAL — common failure modes, gotchas, and the 2 to 4 questions a developer actually asks.
8. STALE FACTS — anything in the current README.md that is inaccurate versus SKILL.md and the real files. Write "none found" if clean.

Format: Return one structured markdown report under those eight numbered headings. Cite real file paths verbatim. Mark anything you cannot verify as UNKNOWN. No preamble, no closing commentary.