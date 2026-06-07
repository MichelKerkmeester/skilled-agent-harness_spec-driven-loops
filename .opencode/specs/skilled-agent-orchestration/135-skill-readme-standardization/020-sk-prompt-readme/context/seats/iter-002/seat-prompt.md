Spec folder: skilled-agent-orchestration/135-skill-readme-standardization/020-sk-prompt-readme (pre-approved, skip Gate 3). READ-ONLY: do not write, create or edit any file. Return findings as your final assistant message only.

Role: You are verifying exact facts about the `.opencode/skills/sk-prompt/` skill so a README rewrite cites them correctly. This pass locks the precise, citable details and finds stale facts.

Context: Read `.opencode/skills/sk-prompt/SKILL.md` in full, its current `README.md`, `references/depth_framework.md`, `references/patterns_evaluation.md`, `assets/framework-registry.json` and the format guides. Verify against real file contents, not memory. This skill is the prompt-engineering engine (seven frameworks, DEPTH thinking, CLEAR scoring).

Action: Report under exactly these six headings, every claim cited to a real file path:

1. EXACT INVOCATION — the `/prompt` command, the `@prompt-improver` agent dispatch, the mode flags (quote them: interactive default, `$text`, `$raw`, any others) and their DEPTH-round counts. Note what the skill outputs (the structured prompt plus the CLEAR score).
2. CAPABILITY ROSTER — the exact seven frameworks (named), the framework-selection logic, the DEPTH methodology phases (Discover, Engineer, Prototype, Test, Harmonize) with RICCE integration, and the CLEAR scoring dimensions and threshold, copied.
3. KEY FILES — a table of the real files (path + one-line role): SKILL.md, `references/depth_framework.md`, `references/patterns_evaluation.md`, `assets/framework-registry.json`, each format guide.
4. WORKFLOWS & OUTPUTS — the documented enhancement workflow (framework selection, DEPTH rounds, CLEAR scoring and the threshold gate) and what it produces, cited.
5. TROUBLESHOOTING & FAQ — the concrete failure modes (CLEAR below threshold, wrong framework, raw mode skipping DEPTH) and the 3 to 5 questions a user most likely asks, with short grounded answers (including how it differs from sk-prompt-small-model).
6. STALE FACTS IN CURRENT README — list every claim in the current `README.md` that disagrees with `SKILL.md` or the real files (counts, paths, version, the framework list, the CLEAR threshold, the DEPTH round counts). Write "none found" if clean.

Format: One structured markdown report under those six numbered headings. Cite real file paths verbatim. Mark anything unverifiable as UNKNOWN. No preamble.
