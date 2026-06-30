Spec folder: skilled-agent-orchestration/z_archive/109-skill-readme-standardization/017-sk-doc-readme (pre-approved, skip Gate 3). READ-ONLY: do not write, create or edit any file. Return findings as your final assistant message only.

Role: You are verifying exact facts about the `.opencode/skills/sk-doc/` skill so a README rewrite cites them correctly. This pass locks the precise, citable details and finds stale facts.

Context: Read `.opencode/skills/sk-doc/SKILL.md` in full, its current `README.md`, and the `references/`, `references/global/`, `assets/` and `scripts/` trees. Verify against real file contents, not memory. This skill is the documentation and component-creation specialist (structure first, then content, then quality).

Action: Report under exactly these six headings, every claim cited to a real file path:

1. EXACT INVOCATION — the precise script commands (`validate_document.py`, `extract_structure.py`, `init_skill.py`, `package_skill.py`, `quick_validate.py`, `validate_flowchart.sh`) with their key flags and outputs, plus the `/create:*` commands and the `@markdown` agent dispatch. Quote them.
2. CAPABILITY ROSTER — the full use-case set, the structure-first principle, the scripts-versus-AI split, the DQI score, and the document-type-aware enforcement levels (SKILL/command vs README vs knowledge vs active spec), copied.
3. KEY FILES — a table of the real files and subfolders (path + one-line role): SKILL.md, each `references/` creation guide, the `references/global/` standards, the `assets/` template families, each script.
4. WORKFLOWS & OUTPUTS — the documented pipelines (the doc quality workflow, the skill-creation process, the validation workflow) and what they produce, cited.
5. TROUBLESHOOTING & FAQ — the concrete failure modes (wrong document type detected, validation level mismatch, filename violations) and the 3 to 5 questions a user most likely asks, with short grounded answers.
6. STALE FACTS IN CURRENT README — list every claim in the current `README.md` that disagrees with `SKILL.md` or the real files (counts, paths, version, use-case set, script list). Write "none found" if clean.

Format: One structured markdown report under those six numbered headings. Cite real file paths verbatim. Mark anything unverifiable as UNKNOWN. No preamble.
