Spec folder: skilled-agent-orchestration/135-skill-readme-standardization/019-sk-prompt-small-model-readme (pre-approved, skip Gate 3). READ-ONLY: do not write, create or edit any file, and do not run the skill. Return findings as your final assistant message only.

Role: You are a documentation analyst gathering an accurate factual map of one skill so its README can be rewritten.

Context: The skill lives at `.opencode/skills/sk-prompt-small-model/`. Read its `SKILL.md` in full, its current `README.md`, and the files under `references/` (including `references/models/`), `assets/` and `benchmarks/`. Stay within that skill directory. This skill is the per-model prompt-craft hub for small-model dispatch: it owns the per-model prompt-craft profiles in `references/models/` (framework, scaffold, gotchas, mirroring `model-profiles.json`), while executor mechanics (binary flags, invocation wrappers) live in `cli-devin` and `cli-opencode`. Note the sibling skills `cli-devin`, `cli-opencode` and `sk-prompt` only to describe boundaries.

Action: Produce a factual map for a README rewrite. Report under exactly these eight headings:

1. PURPOSE — one sentence: what the skill does.
2. PROBLEM — 2 to 4 sentences: the human pain point it removes (problem-first, not a feature list). Why each small model wants a different prompt framework and scaffold, and why separating prompt-craft from executor mechanics keeps both clean.
3. MODES & CAPABILITIES — the per-model profiles, the model-profiles.json registry the profiles mirror, the prompt-craft-versus-mechanics split, the advisor co-surfacing through enhances edges, and the benchmarks, each one line.
4. INVOCATION — how it is reached (the advisor co-surfaces it with cli-devin or cli-opencode), the navigation path (`references/models/_index.md` to pick the profile, then `references/pattern-index.md` to the executor mechanics in the cli-X), and what a profile contains. Note it carries no tools or runtime code.
5. KEY FILES — a table of the real files (path + one-line purpose): SKILL.md, `references/models/` profiles and `_index.md`, `references/pattern-index.md`, `assets/cli_prompt_quality_card.md`, `assets/model-profiles.json`, benchmarks.
6. BOUNDARIES — what it does NOT own: executor mechanics (`cli-devin`, `cli-opencode`), the general prompt-engineering engine (`sk-prompt`), and any runtime logic (no shell or scripts).
7. TROUBLESHOOTING & FAQ MATERIAL — common failure modes, gotchas (no profile authored yet for a model, craft-vs-mechanics confusion), and the 2 to 4 questions a user actually asks.
8. STALE FACTS — anything in the current README.md that is inaccurate versus SKILL.md and the real files (counts, paths, version, the model list). Write "none found" if clean.

Format: Return one structured markdown report under those eight numbered headings. Cite real file paths verbatim. Mark anything you cannot verify as UNKNOWN. No preamble, no closing commentary.
