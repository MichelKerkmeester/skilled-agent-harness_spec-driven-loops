Spec folder: skilled-agent-orchestration/z_archive/109-skill-readme-standardization/019-sk-prompt-models-readme (pre-approved, skip Gate 3). READ-ONLY: do not write, create or edit any file. Return findings as your final assistant message only.

Role: You are verifying exact facts about the `.opencode/skills/sk-prompt-models/` skill so a README rewrite cites them correctly. This pass locks the precise, citable details and finds stale facts.

Context: Read `.opencode/skills/sk-prompt-models/SKILL.md` in full, its current `README.md`, the `references/models/` profiles, `references/pattern-index.md`, `assets/cli_prompt_quality_card.md`, `assets/model-profiles.json` and the `benchmarks/` tree. Verify against real file contents, not memory. This skill is the per-model prompt-craft hub for small-model dispatch.

Action: Report under exactly these six headings, every claim cited to a real file path:

1. EXACT INVOCATION & NAVIGATION — how the skill is reached (advisor enhances edges from cli-devin and cli-opencode), the navigation chain (`_index.md` to the per-model profile to `pattern-index.md` to the cli-X mechanics), and what each profile documents (framework primary and fallback, pre-planning density, scaffold, gotchas). Quote the relevant lines.
2. CAPABILITY ROSTER — the exact model list with each model's recommended framework (from `model-profiles.json` and the profiles), the prompt-craft-versus-mechanics ownership split, and the pattern set (context budget, output verification, model profile, structured permissions, quota fallback, tool scoring), copied.
3. KEY FILES — a table of the real files (path + one-line role): SKILL.md, every `references/models/` profile, `references/pattern-index.md`, `assets/cli_prompt_quality_card.md`, `assets/model-profiles.json`, the benchmarks.
4. WORKFLOWS & OUTPUTS — the documented lookup workflow (read the profile before dispatch, then follow to the executor mechanics) and what the model-profiles.json registry provides, cited.
5. TROUBLESHOOTING & FAQ — the concrete failure modes (no profile for a model, looking for mechanics here, model id drift) and the 3 to 5 questions a user most likely asks, with short grounded answers (including how it differs from sk-prompt and from the cli-X executors).
6. STALE FACTS IN CURRENT README — list every claim in the current `README.md` that disagrees with `SKILL.md` or the real files (counts, paths, version, the model list, the framework recommendations). Write "none found" if clean.

Format: One structured markdown report under those six numbered headings. Cite real file paths verbatim. Mark anything unverifiable as UNKNOWN. No preamble.
