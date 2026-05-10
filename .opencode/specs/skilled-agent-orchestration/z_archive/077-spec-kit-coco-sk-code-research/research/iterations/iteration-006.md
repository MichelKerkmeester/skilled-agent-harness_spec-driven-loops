# Iteration 6 — sk-code OpenCode Reference Coverage

## Focus
Audited `sk-code` OpenCode references for staleness and coverage gaps. This pass compared the `SKILL.md` OpenCode scope and language sub-detection claims against `references/opencode/`, `assets/opencode/`, and the manual testing playbook.

## Actions Taken
- Action 1: Read strategy Sections 3, 6-12 and iterations 1-5 to avoid repeating the surface map, CocoIndex ingestion, and validator/MCP drift findings.
- Action 2: Inventoried `references/opencode/`, `assets/opencode/`, and `manual_testing_playbook/` and compared the files present with the OpenCode scope in `SKILL.md`.
- Action 3: Read the OpenCode language sub-detection table, router reference, language-sub-detection playbook scenarios, and representative shared OpenCode references.
- Action 4: Checked cross-cutting system-spec-kit touchpoints in sk-code references: spec-folder invariants, verification guidance, and integration-point wording.

## Findings

### sk-code

### F-006-001 — JavaScript OpenCode route is declared but not covered by language-sub-detection scenarios [P2]
`sk-code` declares `JAVASCRIPT` as an OpenCode language route with `.js`, `.mjs`, `.cjs`, CommonJS, Node, and MCP signals at `.opencode/skills/sk-code/SKILL.md:100`-`.opencode/skills/sk-code/SKILL.md:102`. The manual testing playbook coverage note lists OPENCODE language sub-detection for TypeScript, Python, Shell, and JSON/JSONC only at `.opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md:52`-`.opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md:57`, and the language scenario table is explicitly `LS-001..LS-004` for TypeScript, Python, Shell, and Config at `.opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md:209`-`.opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md:216`.

Concrete target: add an `LS-005` JavaScript scenario that targets a real `.opencode/**.{js,mjs,cjs}` file and asserts `references/opencode/javascript/{style_guide,quality_standards,quick_reference}.md` plus `assets/opencode/checklists/javascript_checklist.md` load without TypeScript/Python/Shell/Config leakage.

### F-006-002 — Skills/agents/commands are in scope but lack first-class authoring references or checklists [P1]
`sk-code` says OPENCODE covers `.opencode/` skills, agents, commands, MCP servers, hooks, scripts, tests, config, and language code at `.opencode/skills/sk-code/SKILL.md:20`-`.opencode/skills/sk-code/SKILL.md:23`. The canonical OpenCode references include a skill directory sketch at `.opencode/skills/sk-code/references/opencode/shared/code_organization.md:394`-`.opencode/skills/sk-code/references/opencode/shared/code_organization.md:418` and a detailed MCP server structure immediately after, but there are no equivalent first-class reference files or checklists for authoring `.opencode/agents/*` or `.opencode/commands/*` artifacts. The asset checklist set is language-only: JavaScript, TypeScript, Python, Shell, Config, and Universal under `.opencode/skills/sk-code/assets/opencode/checklists/`.

Concrete target: add `references/opencode/shared/skill_authoring.md`, `agent_authoring.md`, and `command_authoring.md` or an explicit `authoring_artifacts.md`, plus matching checklist entries. If this is intentionally owned by `sk-doc` or another skill, narrow `sk-code`'s OPENCODE scope so agents do not expect code-quality guidance for those artifact types here.

### F-006-003 — OpenCode directory convention reference still shows pre-domain paths [P2]
The current router says OpenCode resources live under `references/opencode/` and `assets/opencode/` at `.opencode/skills/sk-code/SKILL.md:110`-`.opencode/skills/sk-code/SKILL.md:117`. The shared OpenCode directory convention still documents an OpenCode skill structure with `references/shared/`, `references/javascript/`, `references/typescript/`, and `assets/checklists/` directly under the skill root at `.opencode/skills/sk-code/references/opencode/shared/code_organization.md:397`-`.opencode/skills/sk-code/references/opencode/shared/code_organization.md:416`. It also omits the Config resource folder despite `CONFIG` being a declared OpenCode language route at `.opencode/skills/sk-code/SKILL.md:100`-`.opencode/skills/sk-code/SKILL.md:106`.

Concrete target: update the directory convention to either describe the generic shape for new skills without implying sk-code's own nested resource layout, or make it match the current `references/opencode/{shared,javascript,typescript,python,shell,config}/` and `assets/opencode/checklists/` structure. This should be fixed alongside the stale checklist relative link from iteration 1.

### F-006-004 — system-spec-kit integration is named, but spec-folder write guidance stays at path-safety level [P2]
`sk-code` lists `system-spec-kit` as the integration owner for spec folder gates, validation, memory, and context preservation at `.opencode/skills/sk-code/SKILL.md:200`-`.opencode/skills/sk-code/SKILL.md:203`, and the OPENCODE verification row mentions "spec validation for changed spec folders" at `.opencode/skills/sk-code/SKILL.md:127`-`.opencode/skills/sk-code/SKILL.md:132`. The loaded OpenCode references and checklist only cover spec-folder path invariants: allowed roots, naming pattern, containment checks, and restore safety at `.opencode/skills/sk-code/references/opencode/shared/universal_patterns.md:418`-`.opencode/skills/sk-code/references/opencode/shared/universal_patterns.md:426` and `.opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md:89`-`.opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md:96`.

Concrete target: add a cross-skill OpenCode recipe for "code changes that create/update spec folders" that names the `system-spec-kit` validation command, when to load spec docs, and how to combine `verify_alignment_drift.py` with spec validation evidence. Iterations 7-10 should check whether assets already have a better home for that recipe.

## Questions Answered
- Q5: Partially answered. The strongest OpenCode reference gaps are JavaScript route test coverage, skills/agents/commands authoring guidance, and stale directory-convention paths.
- Q7: Partially answered. sk-code does acknowledge system-spec-kit integration and spec-folder validation, but current loaded OpenCode resources mostly encode path-safety invariants rather than the full spec-folder write workflow.

## Questions Remaining
- Q5: Still open for a deeper asset/checklist pass, especially whether missing authoring guidance belongs in `assets/opencode/` checklists or in `references/opencode/shared/`.
- Q6: Still open for a formal `STACK_FOLDERS` and resource-map drift comparison.
- Q7: Still open for live `/spec_kit:complete` or spec-folder-write routing behavior across sk-code and system-spec-kit.

## Next Focus (for iteration 7)
Audit `sk-code` OpenCode assets and verification recipes. Start with `assets/opencode/checklists/`, `references/opencode/shared/alignment_verification_automation.md`, and the manual testing playbook's expected loaded assets; then decide whether missing skills/agents/commands authoring checks and the spec-folder validation recipe should be added as checklists, shared references, or cross-skill integration docs.
