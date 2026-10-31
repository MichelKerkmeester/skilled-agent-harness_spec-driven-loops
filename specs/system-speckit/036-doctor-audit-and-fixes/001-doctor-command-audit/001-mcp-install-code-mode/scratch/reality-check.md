# Reality check: /doctor:mcp install

## Evidence method

I read the router, full install YAML, and presentation file with line-numbered source reads: nl -ba .skilled/commands/doctor/mcp.md | sed -n '1,90p'; nl -ba .skilled/commands/doctor/assets/doctor-mcp-install.yaml | sed -n '1,330p'; and nl -ba .skilled/commands/doctor/assets/doctor-mcp-presentation.txt | sed -n '1,210p'. Source-line citations below identify the claim. For on-disk status, I ran a shell loop whose probe for each expanded path was test -e "$p"; it printed PRESENT or MISSING. The commands listed in the command inventory were checked in the source with those line-numbered reads; installer commands were not executed. The read-only doctor command and full result are in doctor-run.log.

## Referenced paths and scripts

| Reference | Status in this checkout | Command or source evidence |
|---|---|---|
| .skilled/commands/doctor/mcp.md | Present | test -e .skilled/commands/doctor/mcp.md; install routing is at mcp.md:20-27, 42-56, 71-73. |
| .skilled/commands/doctor/assets/doctor-mcp-install.yaml | Present | test -e .skilled/commands/doctor/assets/doctor-mcp-install.yaml; referenced by mcp.md:24-25, 48-50. |
| .skilled/commands/doctor/assets/doctor-mcp-debug.yaml | Present | nl -ba .skilled/commands/doctor/assets/doctor-mcp-debug.yaml | sed -n '1,260p'; router names it at mcp.md:26, 49-50. |
| .skilled/commands/doctor/assets/doctor-mcp-presentation.txt | Present | test -e .skilled/commands/doctor/assets/doctor-mcp-presentation.txt; mcp.md:24, 44, 62-68. |
| spec.md | Missing at the YAML's referenced relative path | test -e spec.md; YAML names this bare path at doctor-mcp-install.yaml:37-43. The packet spec is present at specs/system-speckit/048-doctor-command-audit/001-mcp-install-code-mode/spec.md, confirmed by test -f specs/system-speckit/048-doctor-command-audit/001-mcp-install-code-mode/spec.md. |
| decision-record.md | Missing at the YAML's referenced relative path | test -e decision-record.md; YAML names this bare path at doctor-mcp-install.yaml:37-43. No replacement was established in this audit. |
| .skilled/skills/mcp-code-mode/INSTALL-GUIDE.md | Present | test -e .skilled/skills/mcp-code-mode/INSTALL-GUIDE.md; YAML:42-45, 89-93. |
| .skilled/skills/mcp-code-mode | Present | test -e .skilled/skills/mcp-code-mode; YAML:97-107. |
| .skilled/skills/mcp-code-mode/mcp-server | Present | test -e .skilled/skills/mcp-code-mode/mcp-server; package-lock and source reads show its contents. |
| .skilled/skills/mcp-code-mode/mcp-server/package.json | Missing | test -e .skilled/skills/mcp-code-mode/mcp-server/package.json; health script expects this manifest at mcp-doctor.sh:139-146; install.sh also checks it at install.sh:115-125. |
| .skilled/skills/mcp-code-mode/mcp-server/package-lock.json | Present | test -e .skilled/skills/mcp-code-mode/mcp-server/package-lock.json; its locked package declares Node >=24.0.0 <25.0.0 at package-lock.json:1-34. |
| .skilled/skills/mcp-code-mode/mcp-server/tsconfig.json | Present | test -e .skilled/skills/mcp-code-mode/mcp-server/tsconfig.json; the tsconfig has outDir ./dist. |
| .skilled/skills/mcp-code-mode/mcp-server/.nvmrc | Present | test -e .skilled/skills/mcp-code-mode/mcp-server/.nvmrc; its content is 24.9.0. |
| .skilled/skills/mcp-code-mode/mcp-server/dist/index.js | Missing | test -e .skilled/skills/mcp-code-mode/mcp-server/dist/index.js; YAML expects it at doctor-mcp-install.yaml:101-107; doctor reports it missing in doctor-run.log. |
| .skilled/skills/mcp-code-mode/mcp-server/node_modules | Missing | test -e .skilled/skills/mcp-code-mode/mcp-server/node_modules; YAML expects it at doctor-mcp-install.yaml:105-107; doctor reports it missing in doctor-run.log. |
| .skilled/skills/mcp-code-mode/scripts/install.sh | Present | test -e .skilled/skills/mcp-code-mode/scripts/install.sh; YAML invokes it at doctor-mcp-install.yaml:101-110. It was not run. |
| .skilled/bin/mcp-code-mode-launcher.cjs | Present | test -e .skilled/bin/mcp-code-mode-launcher.cjs; doctor checks it at mcp-doctor.sh:139-146; all seven project runtime configs reference it. |
| .skilled/bin/lib/node-engine-resolver.cjs | Present | test -e .skilled/bin/lib/node-engine-resolver.cjs; doctor source identifies it at mcp-doctor.sh:139-146; INSTALL-GUIDE.md:159-162 describes manifest-based interpreter resolution. |
| .utcp_config.json | Present | test -e .utcp_config.json; YAML:112-114; the file loads .env and has a manual_call_templates array at .utcp_config.json:1-15. |
| .env | Missing | test -e .env; the doctor treats it as optional without external API credentials at mcp-doctor.sh:216-224; INSTALL-GUIDE.md:247-287 describes creating it. |
| .env.example | Present | test -e .env.example; .gitignore allows it at .gitignore:23-28; the installer writes an example at install.sh:285-290. |
| .venv | Missing | test -e .venv; YAML mentions removing it in the unrelated pip recovery action at doctor-mcp-install.yaml:312-317. |
| .skilled/commands/doctor/scripts/mcp-doctor.sh | Present | test -e .skilled/commands/doctor/scripts/mcp-doctor.sh; this is the YAML's health check path at doctor-mcp-install.yaml:44-45, 275-279. |
| .skilled/commands/doctor/scripts/mcp-doctor-lib.sh | Present | test -e .skilled/commands/doctor/scripts/mcp-doctor-lib.sh; the health script sources it at mcp-doctor.sh:26-28. |
| .skilled/commands/mcp_doctor/scripts/mcp-doctor.sh | Missing; stale help path | test -e .skilled/commands/mcp_doctor/scripts/mcp-doctor.sh; mcp-doctor.sh:8-9 prints this old path. The current path is .skilled/commands/doctor/scripts/mcp-doctor.sh. |
| .skilled/scripts/mcp-doctor.sh | Missing; stale help path | test -e .skilled/scripts/mcp-doctor.sh; mcp-doctor.sh:39-44 prints this old path. The current path is .skilled/commands/doctor/scripts/mcp-doctor.sh. |
| .skilled/skills/mcp-tooling/mcp-figma | Present | test -e .skilled/skills/mcp-tooling/mcp-figma; YAML:124-132. |
| .skilled/skills/mcp-tooling/mcp-figma/scripts/install.sh | Present | test -e .skilled/skills/mcp-tooling/mcp-figma/scripts/install.sh; YAML:125-132. |
| .skilled/skills/mcp-tooling/mcp-figma/scripts/doctor.sh | Present | test -e .skilled/skills/mcp-tooling/mcp-figma/scripts/doctor.sh; YAML:130-132. |
| .skilled/skills/mcp-tooling/mcp-figma/INSTALL-GUIDE.md | Present | test -e .skilled/skills/mcp-tooling/mcp-figma/INSTALL-GUIDE.md; YAML:132. |
| .skilled/skills/mcp-tooling/mcp-chrome-devtools | Present | test -e .skilled/skills/mcp-tooling/mcp-chrome-devtools; YAML:133-140. |
| .skilled/skills/mcp-tooling/mcp-chrome-devtools/scripts/install.sh | Present | test -e .skilled/skills/mcp-tooling/mcp-chrome-devtools/scripts/install.sh; YAML:135-140. |
| .skilled/skills/mcp-tooling/mcp-chrome-devtools/scripts/doctor.sh | Present | test -e .skilled/skills/mcp-tooling/mcp-chrome-devtools/scripts/doctor.sh; YAML:138-140. |
| .skilled/skills/mcp-tooling/mcp-chrome-devtools/INSTALL-GUIDE.md | Present | test -e .skilled/skills/mcp-tooling/mcp-chrome-devtools/INSTALL-GUIDE.md; YAML:140. |
| .skilled/skills/mcp-tooling/mcp-click-up | Present | test -e .skilled/skills/mcp-tooling/mcp-click-up; YAML:141-148. |
| .skilled/skills/mcp-tooling/mcp-click-up/scripts/install.sh | Present | test -e .skilled/skills/mcp-tooling/mcp-click-up/scripts/install.sh; YAML:143-148. |
| .skilled/skills/mcp-tooling/mcp-click-up/scripts/doctor.sh | Present | test -e .skilled/skills/mcp-tooling/mcp-click-up/scripts/doctor.sh; YAML:146-148. |
| .skilled/skills/mcp-tooling/mcp-click-up/INSTALL-GUIDE.md | Present | test -e .skilled/skills/mcp-tooling/mcp-click-up/INSTALL-GUIDE.md; YAML:148. |
| opencode.json | Present; Code Mode wired | test -e opencode.json; registration at opencode.json:10-20. |
| .mcp.json | Present; Code Mode wired | test -e .mcp.json; registration at .mcp.json:1-13. |
| .claude/mcp.json | Present; Code Mode wired | test -e .claude/mcp.json; registration at .claude/mcp.json:1-13. |
| .codex/config.toml | Present; Code Mode wired | test -e .codex/config.toml; registration at .codex/config.toml:11-16. |
| .cursor/mcp.json | Present; Code Mode wired | test -e .cursor/mcp.json; registration at .cursor/mcp.json:1-13. |
| .pi/mcp.json | Present; Code Mode wired | test -e .pi/mcp.json; registration at .pi/mcp.json:1-13. |
| .devin/mcp_config.json | Present; Code Mode wired | test -e .devin/mcp_config.json; registration at .devin/mcp_config.json:1-13. |
| .vscode/mcp.json | Missing | test -e .vscode/mcp.json; it is named by the YAML at doctor-mcp-install.yaml:164-168 and the guide at INSTALL-GUIDE.md:381-397. |
| .hermes/SYNC.md | Present; documents user-level setup | nl -ba .hermes/SYNC.md | sed -n '1,55p'; it says Hermes MCP config is user-level and gives registration steps at SYNC.md:8-14, 37-44. |
| .hermes/config.yaml | Missing in this repository | test -e .hermes/config.yaml; SYNC.md:8-14, 37-44 says Hermes config lives under the operator's ~/.hermes, outside this repository. |

The seven project config files above each carry a Code Mode entry with command node, launcher .skilled/bin/mcp-code-mode-launcher.cjs, and UTCP_CONFIG_FILE set to .utcp_config.json; the Pi entry also specifies stdio and lazy lifecycle (.pi/mcp.json:3-10). Hermes has no project config file in this checkout; its documented procedure writes user-level state (.hermes/SYNC.md:8-14, 37-44). VS Code is the only YAML-configured project runtime whose target file is absent (doctor-mcp-install.yaml:153-168; test -e .vscode/mcp.json).

## Commands, flags, and variables named by install sources

| Name | Status | Command or source evidence |
|---|---|---|
| /doctor:mcp install | Present as the install route | Source read: nl -ba .skilled/commands/doctor/mcp.md | sed -n '42,56p'; install maps to doctor-mcp-install.yaml at mcp.md:48-50. |
| /doctor:mcp debug | Present as the other route; not an install action | Source read: nl -ba .skilled/commands/doctor/mcp.md | sed -n '42,56p'; the router keeps its schema separate at mcp.md:32-35, 51-54. |
| /doctor <target> and /doctor:update | Present as other command routes, not install substeps | Source read: nl -ba .skilled/commands/doctor/mcp.md | sed -n '30,38p'; mcp.md:36 routes subsystem checks away from this command. |
| $ARGUMENTS | Present as the router input placeholder | Source read: nl -ba .skilled/commands/doctor/mcp.md | sed -n '42,56p'; presentation.txt:7. It is not a Code Mode server environment variable. |
| --server <name> | Present in the install source schema; the only YAML server is code_mode | Source read: mcp.md:3, 32-35, 51-54; doctor-mcp-install.yaml:75-86, 97-114. Presentation's install example system_skill_advisor does not match that server key (presentation.txt:175-184; YAML:97-114). |
| --runtime <name> | Present; YAML only accepts opencode, claude, vscode today | Source read: mcp.md:3, 51-54; doctor-mcp-install.yaml:75-86. This runtime list omits six project config files present above. |
| --fix | Present only in the shared argument hint and debug-related examples; it is not an install flag | Source read: mcp.md:3, 51-54; presentation.txt:31-40, 175-184. |
| --json | Present in the install workflow's health-check command and supported by the doctor script | Source read: doctor-mcp-install.yaml:271-283; mcp-doctor.sh:68-82. The one requested run is logged in doctor-run.log. |
| node --version | Present in the YAML preflight; node is available | Source read: doctor-mcp-install.yaml:175-183; command -v node returned a path; the run reported v26.8.2 in doctor-run.log. |
| npm --version | Present in the YAML preflight; npm is available | Source read: doctor-mcp-install.yaml:175-180; command -v npm returned a path; the run reported 11.19.1 in doctor-run.log. |
| npx | Named by install troubleshooting and the guide; available | Source read: presentation.txt:186-195 and INSTALL-GUIDE.md:164-168; command -v npx returned a path. |
| Python >=3.11 | Present as a stated prerequisite, but the check does not enforce that minimum | YAML:25-32, 175-186; presentation.txt:186-195; the run reports Python 3.9.6 as PASS (doctor-run.log:10); mcp-doctor.sh:118-125 passes whenever python3 exists. |
| python3 -m json.tool < {config_file} | Present as the JSON validation command | Source read: doctor-mcp-install.yaml:264-267. The concrete JSON check for UTCP is documented at INSTALL-GUIDE.md:689-697. |
| grep syntax for TOML | Present as text, but not an executable validation command | Source read: doctor-mcp-install.yaml:264-267; there is no grep expression or TOML parser specified there. |
| bash {skill_dir}/scripts/install.sh | Present as a command template resolving to .skilled/skills/mcp-code-mode/scripts/install.sh; not run because it is an installer | Source read: doctor-mcp-install.yaml:97-110; target path probe above. |
| cd {skill_dir}/mcp-server && npm install && npm run build | Present as YAML fallback; currently blocked by absent package.json and dist/index.js | Source read: doctor-mcp-install.yaml:108-113; package.json and dist probes above. It was not run. |
| bash .skilled/commands/doctor/scripts/mcp-doctor.sh --json | Present and run once, without --fix | Source read: doctor-mcp-install.yaml:271-283; command and exit code 2 are in doctor-run.log. |
| npm cache clean --force | Present as automatic retry advice, not run | Source read: doctor-mcp-install.yaml:308-319; the command was not run. |
| Remove .venv, then retry with install script | Present as unrelated Python recovery text; .venv is missing | Source read: doctor-mcp-install.yaml:312-317; test -e .venv. No cleanup was run. |
| /doctor:mcp debug --server {name} | Present as install failure advice pointing into the separate debug workflow | Source read: doctor-mcp-install.yaml:235-246; router's debug schema is mcp.md:51-54. |
| /doctor:mcp install --server system_skill_advisor | Present in presentation but invalid against YAML's sole code_mode server | Source read: presentation.txt:175-184; doctor-mcp-install.yaml:97-114. |
| /doctor:mcp install --runtime claude | Present as presentation example; claude is in the current YAML allowlist | Source read: presentation.txt:175-184; doctor-mcp-install.yaml:75-86. |
| /doctor:mcp debug --fix | Present in the examples and troubleshooting text; it belongs to debug, not install | Source read: presentation.txt:175-195; router's debug schema is mcp.md:51-54. |
| UTCP_CONFIG_FILE | Not named in the router, install YAML, or install presentation text; it is present in the actual runtime registrations | Direct config reads: .mcp.json:8-10, opencode.json:17-19, .claude/mcp.json:8-10, .codex/config.toml:15-16, .cursor/mcp.json:8-10, .pi/mcp.json:8-10, .devin/mcp_config.json:8-10; Hermes command is .hermes/SYNC.md:42. |
| Explicit server credential environment variables | None are named by the router, install YAML, or install presentation text | Source reads: mcp.md:1-73, doctor-mcp-install.yaml:1-319, presentation.txt:58-89 and 138-157. Code Mode credentials are instead documented in INSTALL-GUIDE.md:405-481. |

## Other named MCP servers and CLI skills

The install YAML names three CLI-primary skills outside Code Mode: mcp-figma, mcp-chrome-devtools, and mcp-click-up (doctor-mcp-install.yaml:116-148; mcp.md:37). The presentation adds Skill Advisor and System Code Graph rows (presentation.txt:58-70, 138-157), and uses system_skill_advisor as an install example (presentation.txt:175-184). The generic phrase “all 5 MCP servers” does not enumerate the other server names (presentation.txt:9-14).
