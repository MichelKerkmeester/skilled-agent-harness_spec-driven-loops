You are a precise implementation worker dispatched by an orchestrator. Do exactly the scoped task below and nothing else. Work in the current repository (the Public code environment).

TRACKING / GATE 3: This work is tracked under the spec folder
.opencode/specs/mcp-tooling/007-mcp-skill-install-doctor-standardization
Gate 3 is PRE-APPROVED by the orchestrator. Do NOT ask about spec folders. Do NOT create or modify any spec-folder docs. Proceed directly with the file write below.

HARD CONSTRAINTS (all mandatory):
- SCOPE LOCK: Create ONLY the single file in the ALLOWLIST. Touch nothing else. No edits to install.sh, the mcp-servers scaffold, or any other file.
- READ FIRST: Read every file in REFERENCES before writing.
- House voice: NO em dashes anywhere. Avoid semicolons in prose/comment sentences (shell-syntax semicolons inside code are fine). Use plain hyphens or rewrite the sentence.
- Comment hygiene [HARD BLOCK]: NEVER put spec paths, packet numbers, ADR/REQ/CHK/task ids, or "phase N" labels in comments. Comments state the durable WHY only.
- NO git: do not run git add/commit/push or any git mutation. The orchestrator commits.
- Do NOT install anything, do NOT run installers, do NOT authenticate anything. Authoring only.
- SELF-VERIFY: after writing, run `bash -n` on the file and confirm it parses with no error.

ALLOWLIST (create this one new file):
- .opencode/skills/mcp-click-up/scripts/doctor.sh

REFERENCES (read first):
- .opencode/skills/mcp-figma/scripts/doctor.sh   (THE PATTERN to mirror: a read-only, report-only diagnostic that changes nothing and never prints secrets)
- .opencode/skills/mcp-click-up/scripts/install.sh   (learn THIS skill's real surface)
- .opencode/skills/mcp-click-up/INSTALL_GUIDE.md   (the documented install/verify/authenticate surface)
- .opencode/skills/mcp-click-up/mcp-servers/clickup-cli/README.md   (the embedded CLI: package name + verify command)
- .opencode/skills/mcp-click-up/SKILL.md   (skim: CLI + MCP-via-Code-Mode model, the ClickUp token/auth model)

TASK:
Author a NEW read-only diagnostic `scripts/doctor.sh` for the mcp-click-up skill, mirroring mcp-figma/scripts/doctor.sh in structure and tone but checking THIS skill's actual surface (derive every concrete name from the REFERENCES, do not invent).

Requirements for the script:
1. `#!/usr/bin/env bash` then a 2-line WHY comment: this is read-only diagnostics, it changes nothing, installs nothing, and never prints secrets.
2. `set -euo pipefail` and `HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"`.
3. Self-contained: define its OWN color + log helpers (log, info, ok, warn, err) exactly like the ones at the top of mcp-figma/scripts/_common.sh. This skill has NO scripts/_common.sh, so do NOT source one and do NOT create one.
4. Checks (report-only, each line ok/warn/info, never fatal except a clearly-missing core requirement):
   - Platform: Darwin -> ok, other -> warn.
   - Node: present and >= 18 -> ok, else warn. npm: present -> ok else warn.
   - The ClickUp CLI this skill embeds (get the exact binary + package name from mcp-servers/clickup-cli/README.md and install.sh): is the binary resolvable on PATH? Report found/not-found with `--version` if found.
   - pipx and/or pip presence (the install path), report-only.
   - The ClickUp MCP server / Code Mode `clickup` manual: check for the manual in the repo `.utcp_config.json`, resolved relative to the script as `"$HERE/../../../../.utcp_config.json"` (scripts -> skill -> skills -> .opencode -> repo root). Report present/absent.
   - ClickUp auth/token: report PRESENCE ONLY of the relevant env var or token file (never echo the value). Derive the env var name from the REFERENCES.
5. Change nothing, install nothing, exit 0 at the end.
6. Final `log` line: state it is read-only and point the user to `install.sh` and `INSTALL_GUIDE.md` for setup and authentication.

OUTPUT: End with a short report: the full path written, the `bash -n` result, the exact CLI binary + package name and the token env var you found in the REFERENCES, and any assumption you had to make.
