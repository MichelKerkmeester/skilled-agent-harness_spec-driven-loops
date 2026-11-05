TASK: fix four metadata and packet-accuracy defects (workstream WS-2 in facts.md). Make exactly the edits below and nothing else.
READ FIRST: specs/sk-design/021-deprecate-fundamentals/004-review-remediation/scratch/facts.md, the WS-2 block, and each file before you edit it.

EDITS:
1. `.skilled/skills/sk-design/graph-metadata.json`, field `derived.intent_signals`: replace the ten retired values phrases with these ten: "extract design tokens", "write a design.md", "style reference from a url", "which chart should i use", "build a bar chart", "make a heatmap", "draw a flowchart", "ascii diagram", "mermaid diagram", "drawio diagram". Change only that array. The file uses 2-space indent and has no trailing newline; keep both.
2. `.skilled/skills/sk-code/SKILL.md`: the surface table row for `sk-code-frontend` says "Stack-agnostic frontend evidence: web markup and CSS, web layout and accessibility, and Figma-to-code checks. Read-only." Make it "Stack-agnostic frontend evidence: web markup and CSS, web layout and accessibility, visual values, visual hierarchy and review, motion and interaction, the `tokens.css` starter tokens and Figma-to-code checks. Read-only." In the surface list line for Frontend, add the visual values, hierarchy and motion guidance. If the layout tree in the same file lists sk-code-frontend contents, name the three visual references and `assets/tokens.css` there.
3. `.skilled/skills/sk-code/description.json`: in `description`, change "frontend (web and Figma-to-code)" to "frontend (web, visual values, hierarchy, motion and Figma-to-code)". Set `lastUpdated` to "2026-11-05". Keep the file's existing formatting.
4. `specs/sk-design/021-deprecate-fundamentals/002-retire-fundamentals/implementation-summary.md`: delete the table row that names `node-to-token-markup.md`. That file never changed.
5. `specs/sk-design/021-deprecate-fundamentals/001-frontend-upgrade/acceptance-criteria.md`, row AC-005: make Given say "Given the five baseline value prompts" and make Verification say: `compiled-route --hub sk-code` routes "what padding should this have", "what type scale should I use", "build a color palette for this app", "why does this look wrong" and "what animation duration should this dropdown use" to single sk-code-frontend. Keep Status Met. If spec.md REQ-005 or tasks.md in the same folder says eight prompts, make it say these five.

ALLOWED WRITE PATHS: the five files above, plus `001-frontend-upgrade/spec.md` and `001-frontend-upgrade/tasks.md` only for edit 5.
BANNED OPERATIONS: any git command that changes state, deleting files, editing any other file, reformatting a whole JSON file.

VERIFY BEFORE YOU FINISH and paste the output:
  node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-design
  bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-design/021-deprecate-fundamentals/001-frontend-upgrade --strict
  bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-design/021-deprecate-fundamentals/002-retire-fundamentals --strict
