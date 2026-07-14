Spec folder: skilled-agent-orchestration/z_archive/109-skill-readme-standardization/005-cli-opencode-readme (pre-approved, skip Gate 3). READ-ONLY: do not write, create or edit any file. Return findings as your final assistant message only.

Role: You are verifying exact facts about the `.opencode/skills/cli-opencode/` skill so a README rewrite cites them correctly. This pass locks the precise, citable details and finds stale facts.

Context: Read `.opencode/skills/cli-opencode/SKILL.md` in full and its current `README.md`. Read the reference files under `references/` that define the dispatch flags, the provider list and the agent roster. Verify against real file contents, not memory.

Action: Report under exactly these six headings, every claim cited to a real file path:

1. EXACT INVOCATION — the precise default `opencode run` dispatch shape and the real flags the skill documents (model, variant, format, dir, agent, the mandatory </dev/null). Quote the canonical default invocation verbatim.
2. PROVIDER & MODEL ROSTER — the exact configured providers and model ids the skill documents (opencode-go default, deepseek, minimax-coding-plan, xiaomi-token-plan-ams, openai), copied from the skill.
3. KEY FILES — a table of the real files (path + one-line role): SKILL.md, every references/ file, every assets/ file, scripts if any.
4. SELF-INVOCATION GUARD — the exact env var / signal that makes the skill refuse to load, and the one parallel-detached exception.
5. TROUBLESHOOTING & FAQ — the concrete failure modes the skill documents and the 3 to 5 questions a user most likely asks, with short grounded answers.
6. STALE FACTS IN CURRENT README — list every claim in the current `README.md` that disagrees with `SKILL.md` or the real files. Write "none found" if clean.

Format: One structured markdown report under those six numbered headings. Cite real file paths verbatim. Mark anything unverifiable as UNKNOWN. No preamble.