Spec folder: sk-doc/014-skill-readme-standardization/002-cli-claude-code-readme (pre-approved, skip Gate 3). READ-ONLY: do not write, create or edit any file. Return findings as your final assistant message only.

Role: You are verifying exact facts about the `.opencode/skills/cli-claude-code/` skill so a README rewrite cites them correctly. Iteration 1 already captured the skill's purpose and modes. This pass locks the precise, citable details and finds stale facts.

Context: Read `.opencode/skills/cli-claude-code/SKILL.md` in full and its current `README.md`. Read the reference files under `references/` that define the dispatch flags and the agent roster. Verify against the real file contents, not memory.

Action: Report under exactly these six headings, every claim cited to a real file path:

1. EXACT INVOCATION — the precise default `claude -p` dispatch shape and the real flags the skill documents (model, effort/thinking, permission-mode, agent, json-schema, budget, continue/resume). Quote the canonical example verbatim if one exists.
2. AGENT ROSTER — the exact list of agents the skill can delegate to via `--agent`, copied from the skill, not invented.
3. KEY FILES — a table of the real files in the skill (path + one-line role): SKILL.md, every references/ file, every assets/ file, scripts if any. List what actually exists.
4. SELF-INVOCATION GUARD — the exact env var / signal that makes the skill refuse to load, and why.
5. TROUBLESHOOTING & FAQ — the concrete failure modes the skill documents and the 3 to 5 questions a user most likely asks, with short answers grounded in the files.
6. STALE FACTS IN CURRENT README — list every claim in the current `README.md` that disagrees with `SKILL.md` or the real files (wrong counts, paths, flags, model ids, removed features). Write "none found" if clean.

Format: One structured markdown report under those six numbered headings. Cite real file paths verbatim. Mark anything unverifiable as UNKNOWN. No preamble.