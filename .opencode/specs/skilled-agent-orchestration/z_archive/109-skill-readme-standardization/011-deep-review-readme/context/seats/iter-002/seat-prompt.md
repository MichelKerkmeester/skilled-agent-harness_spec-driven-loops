Spec folder: skilled-agent-orchestration/z_archive/109-skill-readme-standardization/011-deep-review-readme (pre-approved, skip Gate 3). READ-ONLY: do not write, create or edit any file. Return findings as your final assistant message only.

Role: You are verifying exact facts about the `.opencode/skills/deep-review/` skill so a README rewrite cites them correctly. This pass locks the precise, citable details and finds stale facts.

Context: Read `.opencode/skills/deep-review/SKILL.md` in full and its current `README.md`. Read the reference files that define the loop, convergence model, severity findings, externalized state and fan-out. Verify against real file contents, not memory.

Action: Report under exactly these six headings, every claim cited to a real file path:

1. EXACT INVOCATION — the precise command (`/deep:start-review-loop:auto` / `:confirm`), the target argument, key flags and inputs, quoted. Note what it writes (the report, iterations, state) and where.
2. CAPABILITY ROSTER — the exact convergence model (note the threshold default and how it differs from deep-research 0.05 and deep-ai-council 0.20), the P0/P1/P2 severity model, the iteration/fresh-context mechanism, any review modes, and fan-out support the skill documents, copied.
3. KEY FILES — a table of the real files (path + one-line role): SKILL.md, every references/ file (note subfolders), assets, scripts.
4. CONVERGENCE & OUTPUTS — how the loop decides it is done and what it produces (the review report, findings by severity, dashboard), cited.
5. TROUBLESHOOTING & FAQ — the concrete failure modes and the 3 to 5 questions a user most likely asks, with short grounded answers.
6. STALE FACTS IN CURRENT README — list every claim in the current `README.md` that disagrees with `SKILL.md` or the real files (counts, paths, version). Write "none found" if clean.

Format: One structured markdown report under those six numbered headings. Cite real file paths verbatim. Mark anything unverifiable as UNKNOWN. No preamble.
