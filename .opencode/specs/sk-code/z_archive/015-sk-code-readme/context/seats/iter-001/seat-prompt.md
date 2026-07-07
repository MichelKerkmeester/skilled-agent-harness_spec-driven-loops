Spec folder: sk-code/z_archive/015-sk-code-readme (pre-approved, skip Gate 3). READ-ONLY: do not write, create or edit any file, and do not run the skill. Return findings as your final assistant message only.

Role: You are a documentation analyst gathering an accurate factual map of one skill so its README can be rewritten.

Context: The skill lives at `.opencode/skills/sk-code/`. Read its `SKILL.md` in full, its current `README.md`, and the files and subfolders under `references/` and `assets/`. Stay within that skill directory. This skill is the single code-work skill: a surface-aware smart router that detects the active code surface, then loads that surface's implementation, quality, debugging and verification resources. It pairs with `sk-code-review` (sk-code supplies the surface evidence). Note the sibling skills `sk-code-review`, `sk-doc` and `sk-git` only to describe boundaries.

Action: Produce a factual map for a README rewrite. Report under exactly these eight headings:

1. PURPOSE — one sentence: what the skill does.
2. PROBLEM — 2 to 4 sentences: the human pain point it removes (problem-first, not a feature list). Why one generic code skill cannot serve multiple stacks well, and why surface detection plus mandatory verification evidence (the Iron Law) beats ad-hoc coding.
3. MODES & CAPABILITIES — the two-axis routing model (surface detection across the supported surfaces, then intent classification), the phases (implementation, the code-quality gate, verification), the Iron Law, and the template-customization role, each one line.
4. INVOCATION — how it is triggered, the surface-detection markers and precedence (OPENCODE over WEBFLOW), the intent classification, and the verification commands that produce evidence. Note when it is NOT used.
5. KEY FILES — a table of the real files and subfolders (path + one-line purpose): SKILL.md, the per-surface `references/<surface>/` folders, `assets/`, scripts.
6. BOUNDARIES — what it does NOT own: documentation (`sk-doc`), git (`sk-git`), browser inspection (`mcp-chrome-devtools`), findings-first review output (`sk-code-review`). Note that docs-only edits to skill markdown route to sk-doc even under `.opencode/skills/`.
7. TROUBLESHOOTING & FAQ MATERIAL — common failure modes, gotchas (mixed-marker workspaces, unknown surface, verification skipped), and the 2 to 4 questions a user actually asks.
8. STALE FACTS — anything in the current README.md that is inaccurate versus SKILL.md and the real files (counts, paths, version, surface list). Write "none found" if clean.

Format: Return one structured markdown report under those eight numbered headings. Cite real file paths verbatim. Mark anything you cannot verify as UNKNOWN. No preamble, no closing commentary.
