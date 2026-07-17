Spec folder: sk-doc/014-skill-readme-standardization/020-sk-prompt-readme (pre-approved, skip Gate 3). READ-ONLY: do not write, create or edit any file, and do not run the skill. Return findings as your final assistant message only.

Role: You are a documentation analyst gathering an accurate factual map of one skill so its README can be rewritten.

Context: The skill lives at `.opencode/skills/sk-prompt/`. Read its `SKILL.md` in full, its current `README.md`, and the files under `references/` and `assets/`. Stay within that skill directory. This skill is the prompt-engineering engine: it transforms vague inputs into structured prompts using seven frameworks with automatic selection, DEPTH thinking and CLEAR quality scoring. Note the sibling skills `sk-prompt-models` (the per-model dispatch hub) and the `@prompt-improver` agent only to describe boundaries.

Action: Produce a factual map for a README rewrite. Report under exactly these eight headings:

1. PURPOSE — one sentence: what the skill does.
2. PROBLEM — 2 to 4 sentences: the human pain point it removes (problem-first, not a feature list). Why a vague prompt yields a poor result and why a framework plus a structured thinking pass plus a quality score beats ad-hoc prompting.
3. MODES & CAPABILITIES — the seven frameworks and automatic selection, the DEPTH thinking methodology, the CLEAR scoring with its threshold, and the invocation modes (interactive, text, raw), each one line.
4. INVOCATION — how it is triggered (the `/prompt` command, the `@prompt-improver` agent, the mode flags like `$raw` and `$text`), the workflow phases (framework selection, DEPTH processing, scoring), and what it outputs.
5. KEY FILES — a table of the real files (path + one-line purpose): SKILL.md, `references/depth_framework.md`, `references/patterns_evaluation.md`, `assets/framework-registry.json`, the format guides.
6. BOUNDARIES — what it does NOT own: the per-model dispatch choice (`sk-prompt-models`, which chooses from this engine's framework set), and any executor mechanics. Clarify that this skill owns the generic framework definitions.
7. TROUBLESHOOTING & FAQ MATERIAL — common failure modes, gotchas (low CLEAR score, framework mis-selection), and the 2 to 4 questions a user actually asks.
8. STALE FACTS — anything in the current README.md that is inaccurate versus SKILL.md and the real files (counts, paths, version, the framework list, the CLEAR threshold). Write "none found" if clean.

Format: Return one structured markdown report under those eight numbered headings. Cite real file paths verbatim. Mark anything you cannot verify as UNKNOWN. No preamble, no closing commentary.
