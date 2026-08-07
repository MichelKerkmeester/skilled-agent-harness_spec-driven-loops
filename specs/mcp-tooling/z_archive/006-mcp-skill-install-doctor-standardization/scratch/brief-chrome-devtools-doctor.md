You are a precise implementation worker dispatched by an orchestrator. Do exactly the scoped task below and nothing else. Work in the current repository (the Public code environment).

TRACKING / GATE 3: This work is tracked under the spec folder
.opencode/specs/mcp-tooling/006-mcp-skill-install-doctor-standardization
Gate 3 is PRE-APPROVED by the orchestrator. Do NOT ask about spec folders. Do NOT create or modify any spec-folder docs. Proceed directly with the file write below.

HARD CONSTRAINTS (all mandatory):
- SCOPE LOCK: Create ONLY the single file in the ALLOWLIST. Touch nothing else. No "while I'm here" cleanups, no edits to install.sh or any other file.
- READ FIRST: Read every file in REFERENCES before writing.
- House voice: NO em dashes anywhere. Avoid semicolons in prose/comment sentences (shell-syntax semicolons inside code are fine). Use plain hyphens or rewrite the sentence.
- Comment hygiene [HARD BLOCK]: NEVER put spec paths, packet numbers, ADR/REQ/CHK/task ids, or "phase N" labels in comments. Comments state the durable WHY only.
- NO git: do not run git add/commit/push or any git mutation. The orchestrator commits.
- Do NOT install anything, do NOT run installers, do NOT connect or wire anything. Authoring only.
- SELF-VERIFY: after writing, run `bash -n` on the file and confirm it parses with no error.

ALLOWLIST (create this one new file):
- .opencode/skills/mcp-chrome-devtools/scripts/doctor.sh

REFERENCES (read first):
- .opencode/skills/mcp-figma/scripts/doctor.sh   (THE PATTERN to mirror: a read-only, report-only diagnostic that changes nothing and never prints secrets)
- .opencode/skills/mcp-chrome-devtools/scripts/install.sh   (learn THIS skill's real surface: exact binary/package name, transport, what it verifies)
- .opencode/skills/mcp-chrome-devtools/INSTALL_GUIDE.md   (the documented install/verify surface)
- .opencode/skills/mcp-chrome-devtools/SKILL.md   (skim: is it CLI-primary, MCP-via-Code-Mode, or both? what binary?)

TASK:
Author a NEW read-only diagnostic `scripts/doctor.sh` for the mcp-chrome-devtools skill, mirroring mcp-figma/scripts/doctor.sh in structure and tone but checking THIS skill's actual surface (derive every concrete name from the REFERENCES, do not invent).

Requirements for the script:
1. `#!/usr/bin/env bash` then a 2-line WHY comment: this is read-only diagnostics, it changes nothing, installs nothing, and never prints secrets.
2. `set -euo pipefail` and `HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"`.
3. Self-contained: define its OWN color + log helpers (log, info, ok, warn, err) exactly like the ones at the top of mcp-figma/scripts/_common.sh. This skill has NO scripts/_common.sh, so do NOT source one and do NOT create one.
4. Checks (report-only, each line ok/warn/info, never fatal except a clearly-missing core requirement):
   - Platform: Darwin -> ok, other -> warn (unsupported/unverified).
   - Node: present and >= 18 -> ok, else warn (print `node -v`).
   - npm: present -> ok else warn.
   - The actual chrome-devtools binary/package this skill uses (get the exact name from install.sh / INSTALL_GUIDE): is it resolvable on PATH or via npx? Report found/not-found.
   - Chrome or Chromium presence (the skill drives a browser): check the usual macOS app paths and/or a binary on PATH. Report found/not-found, never launch it.
   - Optional Code Mode manual: if this skill registers a manual in the repo `.utcp_config.json`, check for it. Resolve the repo root relative to the script as `"$HERE/../../../../.utcp_config.json"` (scripts -> skill -> skills -> .opencode -> repo root). Report whether the manual is present. If the skill has no Code Mode manual, omit this check.
5. Never expose secrets or tokens: if a token/key file or env var is relevant, report presence only (never echo the value).
6. Change nothing, install nothing, exit 0 at the end.
7. Final `log` line: state it is read-only and point the user to `install.sh` and `INSTALL_GUIDE.md` for setup.

OUTPUT: End with a short report: the full path written, the `bash -n` result, the exact binary/package name you found in install.sh, and any assumption you had to make.
