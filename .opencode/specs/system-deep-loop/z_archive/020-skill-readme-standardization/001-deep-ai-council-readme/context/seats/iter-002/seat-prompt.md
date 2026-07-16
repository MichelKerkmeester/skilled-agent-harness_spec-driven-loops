Spec folder: skilled-agent-orchestration/z_archive/109-skill-readme-standardization/006-deep-ai-council-readme (pre-approved, skip Gate 3). READ-ONLY: do not write, create or edit any file. Return findings as your final assistant message only.

Role: You are verifying exact facts about the `.opencode/skills/deep-ai-council/` skill so a README rewrite cites them correctly. This pass locks the precise, citable details and finds stale facts.

Context: Read `.opencode/skills/deep-ai-council/SKILL.md` in full and its current `README.md`. Read the reference and asset files that define the seats, convergence model, artifact layout and the driving command. Verify against real file contents, not memory.

Action: Report under exactly these six headings, every claim cited to a real file path:

1. EXACT INVOCATION — the precise command or agent that drives the loop (slash command, :auto / :confirm modes, key inputs), quoted from the skill. Note what it writes (the `ai-council/**` artifacts) and where.
2. CAPABILITY ROSTER — the exact seats, convergence signals or stages the skill documents, copied from the skill.
3. KEY FILES — a table of the real files (path + one-line role): SKILL.md, every references/ file, every assets/ file, scripts if any.
4. CONVERGENCE & ARTIFACTS — how the loop decides it is done and what artifacts persist, cited to the skill.
5. TROUBLESHOOTING & FAQ — the concrete failure modes the skill documents and the 3 to 5 questions a user most likely asks, with short grounded answers.
6. STALE FACTS IN CURRENT README — list every claim in the current `README.md` that disagrees with `SKILL.md` or the real files. Write "none found" if clean.

Format: One structured markdown report under those six numbered headings. Cite real file paths verbatim. Mark anything unverifiable as UNKNOWN. No preamble.