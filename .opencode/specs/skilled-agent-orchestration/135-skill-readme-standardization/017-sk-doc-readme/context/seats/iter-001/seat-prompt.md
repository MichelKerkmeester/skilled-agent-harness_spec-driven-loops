Spec folder: skilled-agent-orchestration/135-skill-readme-standardization/017-sk-doc-readme (pre-approved, skip Gate 3). READ-ONLY: do not write, create or edit any file, and do not run the skill. Return findings as your final assistant message only.

Role: You are a documentation analyst gathering an accurate factual map of one skill so its README can be rewritten.

Context: The skill lives at `.opencode/skills/sk-doc/`. Read its `SKILL.md` in full, its current `README.md`, and the files under `references/` (including `references/global/`), `assets/` and `scripts/`. Stay within that skill directory. This skill is the documentation and OpenCode-component specialist: it owns the doc quality pipeline (structure enforcement plus content optimization plus validation), component creation (skills, agents, commands), flowcharts, install guides, manual testing playbooks, feature catalogs and benchmark folders. Note the sibling skills `sk-code` (code), `system-spec-kit` (spec docs) and the `@markdown` agent only to describe boundaries.

Action: Produce a factual map for a README rewrite. Report under exactly these eight headings:

1. PURPOSE — one sentence: what the skill does.
2. PROBLEM — 2 to 4 sentences: the human pain point it removes (problem-first, not a feature list). Why docs drift in structure and quality without enforcement, and why a structure-first pipeline with deterministic scripts plus AI judgment fixes it.
3. MODES & CAPABILITIES — the use cases (document quality, component creation, flowcharts, install guides, manual testing playbooks, feature catalogs, benchmarks), the "structure first, then content, then quality" principle, the scripts-versus-AI split, the DQI score and the document-type-aware enforcement levels, each one line.
4. INVOCATION — how it is triggered (the `/create:*` commands, the `@markdown` agent, direct script runs) and the key scripts (`validate_document.py`, `extract_structure.py`, `init_skill.py`, `package_skill.py`) with what each produces.
5. KEY FILES — a table of the real files and subfolders (path + one-line purpose): SKILL.md, the `references/` creation guides, `references/global/` standards (note `hvr_rules.md`), the `assets/` template families, scripts.
6. BOUNDARIES — what it does NOT own: code (`sk-code`), spec-folder docs and validation (`system-spec-kit`), and that it handles only markdown.
7. TROUBLESHOOTING & FAQ MATERIAL — common failure modes, gotchas (document-type detection, validation levels), and the 2 to 4 questions a user actually asks.
8. STALE FACTS — anything in the current README.md that is inaccurate versus SKILL.md and the real files (counts, paths, version, the use-case set, the script list). Write "none found" if clean.

Format: Return one structured markdown report under those eight numbered headings. Cite real file paths verbatim. Mark anything you cannot verify as UNKNOWN. No preamble, no closing commentary.
