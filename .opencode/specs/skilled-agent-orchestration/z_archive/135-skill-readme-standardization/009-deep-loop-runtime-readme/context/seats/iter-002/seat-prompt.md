Spec folder: skilled-agent-orchestration/135-skill-readme-standardization/009-deep-loop-runtime-readme (pre-approved, skip Gate 3). READ-ONLY: do not write, create or edit any file. Return findings as your final assistant message only.

Role: You are verifying exact facts about the `.opencode/skills/deep-loop-runtime/` shared runtime so a README rewrite cites them correctly. This pass locks the precise, citable details and finds stale facts.

Context: Read `.opencode/skills/deep-loop-runtime/SKILL.md` in full and its current `README.md`. Read the reference, lib and script files that define the executor, prompt-pack, validation, atomic-state, coverage-graph, Bayesian-scoring and fallback-routing components. Verify against real file contents, not memory.

Action: Report under exactly these six headings, every claim cited to a real file path:

1. COMPONENT ROSTER — the exact components/modules the runtime provides (executor, prompt-pack, validation, atomic-state, coverage-graph, Bayesian scoring, fallback routing, fan-out), copied from the skill with their owning files.
2. CONSUMERS — which skills ride this runtime and how they consume it (scripts, lib imports), cited.
3. KEY FILES — a table of the real files/dirs (path + one-line role): SKILL.md, references, lib subdirs, scripts.
4. ENTRY POINTS — the key scripts/CLI entry points (e.g. convergence.cjs, upsert.cjs, fanout-run, multi-seat-dispatch.cjs), cited.
5. TROUBLESHOOTING & FAQ — the concrete failure modes and the 3 to 5 questions a developer most likely asks, with short grounded answers.
6. STALE FACTS IN CURRENT README — list every claim in the current `README.md` that disagrees with `SKILL.md` or the real files. Write "none found" if clean.

Format: One structured markdown report under those six numbered headings. Cite real file paths verbatim. Mark anything unverifiable as UNKNOWN. No preamble.