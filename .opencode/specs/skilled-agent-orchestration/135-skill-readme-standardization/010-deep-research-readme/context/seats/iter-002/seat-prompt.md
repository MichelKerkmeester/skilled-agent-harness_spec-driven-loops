Spec folder: skilled-agent-orchestration/135-skill-readme-standardization/010-deep-research-readme (pre-approved, skip Gate 3). READ-ONLY: do not write, create or edit any file. Return findings as your final assistant message only.

Role: You are verifying exact facts about the `.opencode/skills/deep-research/` skill so a README rewrite cites them correctly. This pass locks the precise, citable details and finds stale facts.

Context: Read `.opencode/skills/deep-research/SKILL.md` in full and its current `README.md`. Read the reference files that define the loop, convergence model, externalized state and fan-out. Verify against real file contents, not memory.

Action: Report under exactly these six headings, every claim cited to a real file path:

1. EXACT INVOCATION — the precise command (`/deep:start-research-loop:auto` / `:confirm`), key flags and inputs, quoted. Note what it writes (research.md, iterations, state) and where.
2. CAPABILITY ROSTER — the exact convergence model, iteration/fresh-context mechanism and fan-out support the skill documents, copied.
3. KEY FILES — a table of the real files (path + one-line role): SKILL.md, every references/ file (note subfolders), assets, scripts.
4. CONVERGENCE & OUTPUTS — how the loop decides it is done and what it produces, cited.
5. TROUBLESHOOTING & FAQ — the concrete failure modes and the 3 to 5 questions a user most likely asks, with short grounded answers.
6. STALE FACTS IN CURRENT README — list every claim in the current `README.md` that disagrees with `SKILL.md` or the real files. Write "none found" if clean.

Format: One structured markdown report under those six numbered headings. Cite real file paths verbatim. Mark anything unverifiable as UNKNOWN. No preamble.