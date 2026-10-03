# Reality check

Paths are relative to the repository root. The source references below use file:line citations. Path existence was checked with test -e for each named path; a second read-only Path.exists inventory recorded the complete runtime and build-path set. Source text was read with nl -ba. JSON inspection reported field names and shapes only; no credential values were printed.

## Paths and scripts

| Item named by the workflow | Status | Evidence command and source |
|---|---|---|
| doctor-mcp-presentation.txt | Present at .skilled/commands/doctor/assets/doctor-mcp-presentation.txt | test -e on this path; nl -ba .skilled/commands/doctor/mcp.md \| sed -n '1,100p'; .skilled/commands/doctor/mcp.md:24. |
| doctor-mcp-debug.yaml | Present at .skilled/commands/doctor/assets/doctor-mcp-debug.yaml | test -e on this path; nl -ba .skilled/commands/doctor/mcp.md \| sed -n '1,100p'; .skilled/commands/doctor/mcp.md:26. |
| doctor-mcp-install.yaml | Present at .skilled/commands/doctor/assets/doctor-mcp-install.yaml | test -e on this path; nl -ba .skilled/commands/doctor/mcp.md \| sed -n '1,100p'; .skilled/commands/doctor/mcp.md:25. |
| Bare spec.md in debug YAML | Moved to specs/system-speckit/048-doctor-command-audit/002-mcp-debug-code-mode/spec.md; repo-root spec.md is missing | test -e on both paths; rg --files specs/system-speckit/048-doctor-command-audit/002-mcp-debug-code-mode. Reference: .skilled/commands/doctor/assets/doctor-mcp-debug.yaml:36-40. |
| Bare decision-record.md in debug YAML | Missing at repo root and in the target packet | test -e on both paths; find specs/system-speckit/048-doctor-command-audit -name decision-record.md -print returned no path. Reference: .skilled/commands/doctor/assets/doctor-mcp-debug.yaml:36-40. |
| Code Mode INSTALL-GUIDE.md | Present at .skilled/skills/mcp-code-mode/INSTALL-GUIDE.md | test -e on this path; .skilled/commands/doctor/assets/doctor-mcp-debug.yaml:41-46. |
| Doctor script | Present at .skilled/commands/doctor/scripts/mcp-doctor.sh | test -e on this path; .skilled/commands/doctor/assets/doctor-mcp-debug.yaml:43-45. |
| Doctor library | Present at .skilled/commands/doctor/scripts/mcp-doctor-lib.sh | test -e on this path; .skilled/commands/doctor/assets/doctor-mcp-debug.yaml:43-45. |
| YAML config target opencode.json | Present | test -e opencode.json; .skilled/commands/doctor/assets/doctor-mcp-debug.yaml:94-98. |
| YAML config target .claude/mcp.json | Present | test -e .claude/mcp.json; .skilled/commands/doctor/assets/doctor-mcp-debug.yaml:94-98. |
| YAML TOML target with path "" | Missing as written because the path is empty. The existing Code Mode TOML file is .codex/config.toml, which YAML does not name | test -e .codex/config.toml; .skilled/commands/doctor/assets/doctor-mcp-debug.yaml:94-98. |
| YAML config target .vscode/mcp.json | Missing | test -e .vscode/mcp.json; .skilled/commands/doctor/assets/doctor-mcp-debug.yaml:94-98. |
| Code Mode launcher | Present at .skilled/bin/mcp-code-mode-launcher.cjs | test -e on this path; specs/system-speckit/048-doctor-command-audit/002-mcp-debug-code-mode/scratch/doctor-run.log:9 reports launcher_exists PASS. |
| Embedded server package.json | Missing at .skilled/skills/mcp-code-mode/mcp-server/package.json | test -e on this path; specs/system-speckit/048-doctor-command-audit/002-mcp-debug-code-mode/scratch/doctor-run.log:10 reports unreadable manifest. |
| Embedded server package-lock.json, tsconfig.json and index.ts | Present | test -e on each path; .skilled/skills/mcp-code-mode/mcp-server/package-lock.json:32-34 declares Node >=24.0.0 and <25.0.0. |
| Embedded server dist/index.js and node_modules | Missing | test -e on both paths; specs/system-speckit/048-doctor-command-audit/002-mcp-debug-code-mode/scratch/doctor-run.log:11, :14 report both missing. |
| Code Mode install, doctor and UTCP validation helpers | Present at .skilled/skills/mcp-code-mode/scripts/install.sh, scripts/doctor.sh and scripts/validate_config.py; references/configuration.md is present | test -e on each path; rg --files .skilled/skills/mcp-code-mode; .skilled/skills/mcp-code-mode/scripts/doctor.sh:5-16; .skilled/skills/mcp-code-mode/scripts/install.sh:351-400; .skilled/skills/mcp-code-mode/scripts/validate_config.py:176-220; .skilled/skills/mcp-code-mode/references/configuration.md:162-185. |
| Root UTCP config | Present at .utcp_config.json and valid JSON; it has 14 manual_call_templates | Python read-only JSON inspection; specs/system-speckit/048-doctor-command-audit/002-mcp-debug-code-mode/scratch/doctor-run.log:12 reports JSON syntax PASS. Schema references: .skilled/skills/mcp-code-mode/references/configuration.md:162-185 and :208-218. |
| UTCP manual magicpath | Present but missing its required config object under the repository’s documented manual schema | Python field-name-only inspection; .utcp_config.json:143-149 has name, call_template_type and commands but no config. Required fields: .skilled/skills/mcp-code-mode/scripts/validate_config.py:217-220. Documented CLI form: .skilled/skills/mcp-code-mode/references/configuration.md:222-242. |
| Root .env and .env.example | .env is missing; .env.example is present | test -e on both paths; specs/system-speckit/048-doctor-command-audit/002-mcp-debug-code-mode/scratch/doctor-run.log:13 records .env absent. |
| .venv | Missing | test -e .venv; the YAML names it in generic deep investigation at .skilled/commands/doctor/assets/doctor-mcp-debug.yaml:187-195. |
| Old doctor path in script header | .skilled/commands/mcp_doctor/scripts/mcp-doctor.sh is missing; the script is at .skilled/commands/doctor/scripts/mcp-doctor.sh | test -e on both paths; .skilled/commands/doctor/scripts/mcp-doctor.sh:8-10. |
| Old doctor path in script help | .skilled/scripts/mcp-doctor.sh is missing; the script is at .skilled/commands/doctor/scripts/mcp-doctor.sh | test -e on both paths; .skilled/commands/doctor/scripts/mcp-doctor.sh:39-50. |
| CLI-skill script paths implied by mcp.md | Moved: .skilled/skills/mcp-tooling/mcp-figma/scripts/{install,doctor}.sh, mcp-chrome-devtools/scripts/{install,doctor}.sh and mcp-click-up/scripts/{install,doctor}.sh | rg --files .skilled/skills/mcp-tooling \| rg '/scripts/(install\|doctor)\.sh$' \| rg 'figma\|chrome\|click'; router reference: .skilled/commands/doctor/mcp.md:37. |
| Hermes project config | .hermes/config.yaml and .hermes/config.yml are missing; .hermes/SYNC.md is present and says Hermes MCP configuration is user-level | test -e on these paths; .hermes/SYNC.md:8-14 and :37-44. |
| Subsystem doctor route file | Present at .skilled/commands/doctor/update.md, outside this Code Mode scope | test -e .skilled/commands/doctor/update.md; .skilled/commands/doctor/mcp.md:36, :73 names /doctor:update. |

### Credential references checked without values

The read-only Python scan extracted variable names from .utcp_config.json and printed only required-key names plus .env/process present booleans. All nine referenced keys are absent from both sources; no credential values were printed.

| Reference | Manual | Required Code Mode key | .env value present | Process value present | Config evidence |
|---|---|---|---|---|---|
| CLICKUP_API_KEY | clickup_official | clickup_official_CLICKUP_API_KEY | No | No | .utcp_config.json:66, :78 |
| CLICKUP_TEAM_ID | clickup_official | clickup_official_CLICKUP_TEAM_ID | No | No | .utcp_config.json:66, :79 |
| FIGMA_API_KEY | figma | figma_FIGMA_API_KEY | No | No | .utcp_config.json:86, :99 |
| GITHUB_PERSONAL_ACCESS_TOKEN | github | github_GITHUB_PERSONAL_ACCESS_TOKEN | No | No | .utcp_config.json:106, :118 |
| NOTION_TOKEN | notion | notion_NOTION_TOKEN | No | No | .utcp_config.json:189, :201 |
| OBSIDIAN_API_KEY | obsidian | obsidian_OBSIDIAN_API_KEY | No | No | .utcp_config.json:208, :220 |
| OBSIDIAN_BASE_URL | obsidian | obsidian_OBSIDIAN_BASE_URL | No | No | .utcp_config.json:208, :221 |
| OBSIDIAN_VERIFY_SSL | obsidian | obsidian_OBSIDIAN_VERIFY_SSL | No | No | .utcp_config.json:208, :222 |
| WEBFLOW_TOKEN | webflow | webflow_WEBFLOW_TOKEN | No | No | .utcp_config.json:247, :259 |

## Code Mode runtime registrations in this repository

| Runtime config | Status and registration evidence |
|---|---|
| opencode.json | Present, valid JSON; mcp.code_mode names the launcher and sets UTCP_CONFIG_FILE=.utcp_config.json (opencode.json:11-19; sanitized JSON inspection). |
| .mcp.json | Present, valid JSON; mcpServers.code_mode names the launcher and sets UTCP_CONFIG_FILE=.utcp_config.json (.mcp.json:3-10; sanitized JSON inspection). |
| .claude/mcp.json | Present, valid JSON; mcpServers.code_mode names the launcher and sets UTCP_CONFIG_FILE=.utcp_config.json (.claude/mcp.json:3-10; sanitized JSON inspection). |
| .codex/config.toml | Present; its Code Mode section, launcher args and UTCP_CONFIG_FILE are present (.codex/config.toml:11-16; sanitized field inspection). Full TOML parsing is unconfirmed because python3 is 3.9.6 (specs/system-speckit/048-doctor-command-audit/002-mcp-debug-code-mode/scratch/doctor-run.log:7) and importing standard-library tomllib failed with ModuleNotFoundError. |
| .cursor/mcp.json | Present, valid JSON; launcher and UTCP_CONFIG_FILE are present (.cursor/mcp.json:3-10; sanitized JSON inspection). |
| .pi/mcp.json | Present, valid JSON; launcher and UTCP_CONFIG_FILE are present, with stdio transport and lazy lifecycle preserved (.pi/mcp.json:3-10; sanitized JSON inspection). |
| .devin/mcp_config.json | Present, valid JSON; launcher and UTCP_CONFIG_FILE are present (.devin/mcp_config.json:3-10; sanitized JSON inspection). |
| Hermes | No project config to inspect. The repository manifest says ~/.hermes/config.yaml owns Hermes MCP server configuration and gives the operator-level Code Mode command (.hermes/SYNC.md:8-14, :37-44). |

The sanitized runtime inspection confirmed all seven project files contain the Code Mode launcher and .utcp_config.json setting (opencode.json:11-19; .mcp.json:3-10; .claude/mcp.json:3-10; .codex/config.toml:11-16; .cursor/mcp.json:3-10; .pi/mcp.json:3-10; .devin/mcp_config.json:3-10). The doctor checks only opencode.json and .claude/mcp.json, then skips the absent .vscode/mcp.json; it does not inspect .mcp.json, Codex, Cursor, Pi or Devin (specs/system-speckit/048-doctor-command-audit/002-mcp-debug-code-mode/scratch/doctor-run.log:15-17; .skilled/commands/doctor/scripts/mcp-doctor.sh:259-295). The sibling install proposal names the same seven project configs and keeps Hermes operator-managed (specs/system-speckit/048-doctor-command-audit/001-mcp-install-code-mode/scratch/proposal.md:23-34).

## Commands and flags named by the workflow

| Command or flag | Status | Evidence |
|---|---|---|
| bash .skilled/commands/doctor/scripts/mcp-doctor.sh --json | Present and run once, without --fix or --server. It returned exit code 2, with 8 pass, 0 warn and 3 fail | Output and exit code are saved in specs/system-speckit/048-doctor-command-audit/002-mcp-debug-code-mode/scratch/doctor-run.log:1-21. Prescribed at .skilled/commands/doctor/assets/doctor-mcp-debug.yaml:121-130; flag parsing at .skilled/commands/doctor/scripts/mcp-doctor.sh:68-82. |
| bash .skilled/commands/doctor/scripts/mcp-doctor.sh --json [--server name] | Present in YAML; --server is supported but unnecessary because the doctor has one server, code_mode | .skilled/commands/doctor/assets/doctor-mcp-debug.yaml:121-130; .skilled/commands/doctor/scripts/mcp-doctor.sh:58-60, :73-76. |
| bash .skilled/commands/doctor/scripts/mcp-doctor.sh --json {server_flag} | Present as the post-repair recheck; remove its server placeholder in the replacement | .skilled/commands/doctor/assets/doctor-mcp-debug.yaml:201-215. |
| cd .skilled/skills/mcp-code-mode/mcp-server && npm install && npm run build | Present as YAML text but not run. package.json is missing, so the sibling proposal requires a stop before npm install/build | .skilled/commands/doctor/assets/doctor-mcp-debug.yaml:103-110; path inventory; specs/system-speckit/048-doctor-command-audit/001-mcp-install-code-mode/scratch/proposal.md:15-17. |
| cd .skilled/skills/mcp-code-mode/mcp-server && npm install | Present as YAML text but not run for the same missing-manifest reason | .skilled/commands/doctor/assets/doctor-mcp-debug.yaml:108-110; specs/system-speckit/048-doctor-command-audit/001-mcp-install-code-mode/scratch/proposal.md:15-17. |
| ls .skilled/commands/doctor/scripts/mcp-doctor.sh | Present and points at an existing path | .skilled/commands/doctor/assets/doctor-mcp-debug.yaml:255-258; test -e .skilled/commands/doctor/scripts/mcp-doctor.sh. |
| bash .skilled/commands/doctor/scripts/mcp-doctor.sh --help | Present as the YAML error-handling command; not run | .skilled/commands/doctor/assets/doctor-mcp-debug.yaml:255-258; test -e .skilled/commands/doctor/scripts/mcp-doctor.sh. |
| command -v node | Present in error handling and exercised by the doctor run, which reports Node v26.8.2 | .skilled/commands/doctor/assets/doctor-mcp-debug.yaml:259-261; specs/system-speckit/048-doctor-command-audit/002-mcp-debug-code-mode/scratch/doctor-run.log:6. |
| bash .skilled/commands/doctor/scripts/mcp-doctor.sh without --json | Present as the YAML fallback; not run | .skilled/commands/doctor/assets/doctor-mcp-debug.yaml:262-263. |
| bash .skilled/scripts/mcp-doctor.sh --help | Missing at the path printed by script help. The current command path is bash .skilled/commands/doctor/scripts/mcp-doctor.sh --help | .skilled/commands/doctor/scripts/mcp-doctor.sh:39-50; path inventory. |
| /mcp_doctor --server name | Missing/obsolete. Current route is /doctor:mcp debug, with optional --fix | .skilled/commands/doctor/assets/doctor-mcp-debug.yaml:235-238; .skilled/commands/doctor/mcp.md:8, :45-56; rg -n /mcp_doctor .skilled/commands. |
| /doctor <target> and /doctor:update | Named as separate subsystem routes and outside this Code Mode audit | .skilled/commands/doctor/mcp.md:36, :73; doctor/update.md is present in the command inventory. |
| --fix | Present in the router, YAML and doctor script. In the script it enables auto-repair; YAML contradicts itself by requiring per-fix approval and saying --fix auto-repairs all | .skilled/commands/doctor/mcp.md:3, :53; .skilled/commands/doctor/assets/doctor-mcp-debug.yaml:25-31, :74-83, :151-175; .skilled/commands/doctor/scripts/mcp-doctor.sh:68-78, :236-253. |
| --server name | Present in the public router and YAML, and supported internally only for code_mode. Remove it from the single-target public contract | .skilled/commands/doctor/mcp.md:3, :51-54; .skilled/commands/doctor/assets/doctor-mcp-debug.yaml:53-69, :74-83; .skilled/commands/doctor/scripts/mcp-doctor.sh:48-50. |
| --runtime name | Present for install, not debug; retain install-only behavior from the sibling proposal | .skilled/commands/doctor/mcp.md:3, :52-54; .skilled/commands/doctor/assets/doctor-mcp-presentation.txt:38-40; specs/system-speckit/048-doctor-command-audit/001-mcp-install-code-mode/scratch/proposal.md:67-71. |
| --json | Present and used for internal health results | .skilled/commands/doctor/scripts/mcp-doctor.sh:45-50, :68-72; .skilled/commands/doctor/assets/doctor-mcp-debug.yaml:121-130. |
| --help, -h and --root path | Present in the script CLI but not as /doctor:mcp debug inputs | .skilled/commands/doctor/scripts/mcp-doctor.sh:45-51, :68-80. |
| /doctor:mcp install; /doctor:mcp install --server system_skill_advisor; /doctor:mcp install --runtime claude; /doctor:mcp debug; /doctor:mcp debug --fix | Present as presentation examples, not executed during this audit | .skilled/commands/doctor/assets/doctor-mcp-presentation.txt:175-184. |
| /doctor:mcp | Present as the router command | .skilled/commands/doctor/mcp.md:8; .skilled/commands/doctor/assets/doctor-mcp-presentation.txt:1-3. |
| Node >=20.11.0, Python >=3.11, npm and npx | Present as presentation troubleshooting prerequisites; Node range conflicts with Code Mode Node 24 guidance | .skilled/commands/doctor/assets/doctor-mcp-presentation.txt:186-195; .skilled/skills/mcp-code-mode/INSTALL-GUIDE.md:144-167. |

The health command above was the only doctor health invocation. No installer, npm install, build or live Code Mode server was run. The command evidence is the recorded invocation result at specs/system-speckit/048-doctor-command-audit/002-mcp-debug-code-mode/scratch/doctor-run.log:1-21.

## Environment names

The only environment-like token in those workflow sources is $ARGUMENTS, which mcp.md uses as its command-input placeholder; YAML values [FIX], [SERVER_FILTER], fix_mode and server_filter are workflow values (.skilled/commands/doctor/mcp.md:45-53; .skilled/commands/doctor/assets/doctor-mcp-debug.yaml:53-83). The runtime configs additionally set UTCP_CONFIG_FILE to .utcp_config.json, and the shared doctor library checks NO_COLOR (opencode.json:18; .mcp.json:9; .claude/mcp.json:9; .codex/config.toml:16; .cursor/mcp.json:9; .pi/mcp.json:9; .devin/mcp_config.json:9; .skilled/commands/doctor/scripts/mcp-doctor-lib.sh:15-27).

Code Mode resolves UTCP_CONFIG_FILE before falling back to .utcp_config.json in the working directory (.skilled/skills/mcp-code-mode/mcp-server/index.ts:350-383).

## Other names outside Code Mode

- The debug presentation names Skill Advisor and System Code Graph alongside Code Mode; the YAML final report names System Code Graph (.skilled/commands/doctor/assets/doctor-mcp-presentation.txt:91-103, :159-172; .skilled/commands/doctor/assets/doctor-mcp-debug.yaml:239-247).
- The router names CLI skills mcp-figma, mcp-chrome-devtools and mcp-click-up. Their scripts are under .skilled/skills/mcp-tooling/, separate from Code Mode (.skilled/commands/doctor/mcp.md:37; path inventory).
- The presentation’s install example names system_skill_advisor. This is an install-only example, not a debug target (.skilled/commands/doctor/assets/doctor-mcp-presentation.txt:175-184).
- YAML says “all 5” servers and includes generic @spec-kit/shared and .venv investigation branches; it does not name the other server identities (.skilled/commands/doctor/assets/doctor-mcp-debug.yaml:25-31, :53-69, :187-195; .skilled/commands/doctor/assets/doctor-mcp-presentation.txt:10-12).
- Code Mode manuals in .utcp_config.json are in scope as UTCP entries; Code Mode distinguishes them from native MCP registrations (.skilled/skills/mcp-code-mode/SKILL.md:269-282, :284-319).

## Observed doctor result

The saved run reports status unhealthy, exitCode 2, 8 pass, 0 warn and 3 fail. It passes launcher existence and UTCP JSON syntax, fails the unreadable engine manifest, missing dist/index.js and missing node_modules, passes OpenCode and Claude registration checks, and skips the absent VS Code config (specs/system-speckit/048-doctor-command-audit/002-mcp-debug-code-mode/scratch/doctor-run.log:1-21). Global prerequisites report Node v26.8.2, Python 3.9.6 and npm 11.19.1; Code Mode’s documented engine is Node 24, not the generic >=20.11.0 doctor threshold (specs/system-speckit/048-doctor-command-audit/002-mcp-debug-code-mode/scratch/doctor-run.log:6-8; .skilled/skills/mcp-code-mode/INSTALL-GUIDE.md:144-167; .skilled/skills/mcp-code-mode/mcp-server/package-lock.json:32-34).
