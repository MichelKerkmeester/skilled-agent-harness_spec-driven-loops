Spec folder: skilled-agent-orchestration/135-skill-readme-standardization/017-sk-doc-readme (pre-approved, skip Gate 3). OUTPUT-ONLY task: do NOT write, create or edit any file. Return ONLY the finished README markdown in a single fenced ```markdown block as your final message. No preamble, no commentary.

Role: You are a technical writer rewriting the README for the `sk-doc` skill in a specific house voice. This is the documentation-standards skill itself, so its README must be an exemplar of the voice.

Context you must use:
- The factual map is in `.opencode/specs/skilled-agent-orchestration/135-skill-readme-standardization/017-sk-doc-readme/context/context-report.md`. Read it. Every fact, path and command must come from it (or from re-reading `.opencode/skills/sk-doc/` to confirm).
- The required structure and voice are in `.opencode/skills/sk-doc/assets/skill/skill_readme_template.md`. Read it and follow the fillable scaffold exactly.
- The golden example is `.opencode/skills/sk-git/README.md`. Read it; yours should read like it.
- The voice rules are in `.opencode/skills/sk-doc/references/global/hvr_rules.md`. Read and obey them exactly.

Hard requirements on facts:
- Do NOT cite a version number (the docs disagree: 1.5.0.0, 1.6.0.0, 1.7.0.0).
- Do NOT pin any count: not the number of scripts, references, flowchart patterns, skill templates, modes or use cases (the current README is stale on every one of these). Describe the capabilities and name the families instead.
- The core principle is "structure first, then content, then quality." Scripts handle deterministic parsing and metrics; the AI handles quality judgment.
- The DQI scores out of 100 (structure 40, content 30, style 30) in four bands (Excellent 90+, Good 75-89, Acceptable 60-74, Needs Work below 60).
- Enforcement is document-type-aware: SKILL and command docs strict, README usability-focused, knowledge moderate, active spec loose.
- The `/create:*` commands are `/create:agent`, `/create:sk-skill`, `/create:feature-catalog`, `/create:testing-playbook`, `/create:folder_readme` and `/create:changelog`, plus the `@markdown` agent. The core scripts are `validate_document.py`, `extract_structure.py`, `init_skill.py`, `package_skill.py`, `quick_validate.py` and `validate_flowchart.sh`.
- Every cited path must resolve.

Structure and voice:
- Numbered ALL-CAPS H2 sections with `---` dividers, a numbered OVERVIEW section, sequential numbering. No table of contents.
- Frontmatter (title `sk-doc`, one-sentence description, trigger_phrases such as "documentation", "readme", "create skill", "validate doc", "changelog"), then H1, then a one-line `>` blockquote pitch.
- Section 1 = AT A GLANCE (4-row table). Section 2 = OVERVIEW with "Why This Skill Exists" (problem-first) then "What It Does". Then QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, an optional VERIFICATION, and a final RELATED DOCUMENTS section. Drop any section that does not fit and renumber.
- Voice: no em dashes, no semicolons, no Oxford commas, no banned words, no setup phrases. Lead with the reader. Prose carries the explanation; tables only for genuine 4-plus-item lookups. Vary subsection counts.
- Lead the distinctive value: sk-doc makes structure the first gate, so a deterministic script extracts and scores a document before the AI judges quality, which is how every doc of a given type comes out the same shape and passes the same bar. It also scaffolds and packages components and builds flowcharts, install guides, playbooks, catalogs and benchmark folders. In QUICK START show a `validate_document.py` run and an `extract_structure.py` run with expected output. In HOW IT WORKS cover the structure-first pipeline, the scripts-versus-AI split, the DQI and the document-type enforcement. INTEGRATION states the boundary with `sk-code` (code) and `system-spec-kit` (spec folders).
- Target length roughly 240 to 340 lines. Every command shows its expected output.

Return the complete README as one ```markdown fenced block. Nothing else.
