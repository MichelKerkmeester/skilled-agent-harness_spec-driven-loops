Spec folder: skilled-agent-orchestration/z_archive/109-skill-readme-standardization/016-sk-code-readme (pre-approved, skip Gate 3). READ-ONLY: do not write, create or edit any file. Return findings as your final assistant message only.

Role: You are verifying exact facts about the `.opencode/skills/sk-code/` skill so a README rewrite cites them correctly. This pass locks the precise, citable details and finds stale facts.

Context: Read `.opencode/skills/sk-code/SKILL.md` in full, its current `README.md`, and the `references/` and `assets/` subfolders. Verify against real file contents, not memory. This skill is the surface-aware code-work router (surface detection then intent then surface resources then verification evidence).

Action: Report under exactly these six headings, every claim cited to a real file path:

1. EXACT SURFACE DETECTION — the precise surface list and the detection markers for each (quote the STACK_FOLDERS or equivalent), the precedence rule, and the UNKNOWN fallback. Note how CWD plus changed/target files drive detection.
2. CAPABILITY ROSTER — the routing model, the phases (implementation, code-quality gate with its P0/P1/P2 checks, verification), the Iron Law wording, the authoring checklists surfaced for `.opencode/` targets, and the template-customization contract, copied.
3. KEY FILES — a table of the real files and subfolders (path + one-line role): SKILL.md, each `references/<surface>/` folder, `assets/` subfolders, scripts, benchmark.
4. WORKFLOWS & OUTPUTS — the documented workflow phases and the verification commands per surface that produce the evidence, cited.
5. TROUBLESHOOTING & FAQ — the concrete failure modes (mixed-marker precedence, unknown surface, verification evidence missing) and the 3 to 5 questions a user most likely asks, with short grounded answers (including how it differs from sk-code-review).
6. STALE FACTS IN CURRENT README — list every claim in the current `README.md` that disagrees with `SKILL.md` or the real files (counts, paths, version, surface list, the supported-surface set). Write "none found" if clean.

Format: One structured markdown report under those six numbered headings. Cite real file paths verbatim. Mark anything unverifiable as UNKNOWN. No preamble.
