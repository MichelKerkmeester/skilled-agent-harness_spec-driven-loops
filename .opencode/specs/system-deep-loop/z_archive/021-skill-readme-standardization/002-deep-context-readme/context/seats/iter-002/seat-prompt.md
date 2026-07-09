Spec folder: skilled-agent-orchestration/z_archive/109-skill-readme-standardization/007-deep-context-readme (pre-approved, skip Gate 3). READ-ONLY: do not write, create or edit any file. Return findings as your final assistant message only.

Role: You are verifying exact facts about the `.opencode/skills/deep-context/` skill so a README rewrite cites them correctly. This pass locks the precise, citable details and finds stale facts.

Context: Read `.opencode/skills/deep-context/SKILL.md` in full and its current `README.md`. Read the reference files under `references/` (the convergence/, protocol/, state/ and guides/ subfolders) that define the loop, convergence signals and the Context Report. Verify against real file contents, not memory.

Action: Report under exactly these six headings, every claim cited to a real file path:

1. EXACT INVOCATION — the precise command (`/deep:start-context-loop:auto` / `:confirm`), key flags (--spec-folder, --max-iterations, --executors), quoted from the skill. Note what it writes (the Context Report and state) and where.
2. CAPABILITY ROSTER — the exact convergence signals, executor-seat model and Context Report sections the skill documents, copied from the skill.
3. KEY FILES — a table of the real files (path + one-line role): SKILL.md, every references/ subfolder file, every assets/ file, scripts if any.
4. CONVERGENCE & OUTPUTS — the convergence signals and what the loop produces, cited to the skill.
5. TROUBLESHOOTING & FAQ — the concrete failure modes the skill documents and the 3 to 5 questions a user most likely asks, with short grounded answers.
6. STALE FACTS IN CURRENT README — list every claim in the current `README.md` that disagrees with `SKILL.md` or the real files. Write "none found" if clean.

Format: One structured markdown report under those six numbered headings. Cite real file paths verbatim. Mark anything unverifiable as UNKNOWN. No preamble.