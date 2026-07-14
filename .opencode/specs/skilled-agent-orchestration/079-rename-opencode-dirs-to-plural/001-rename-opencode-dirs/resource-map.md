# Resource Map — Packet 096

Comprehensive file-level inventory for the `.opencode/{skill,agent,command}/` → plural rename. Source of truth for cli-codex dispatch prompts and post-rename verification.

---

## Repo-Wide Totals

| Path | Files | Occurrences |
|---|---|---|
| `.opencode/skills/` | 7,464 | 645,862 |
| `.opencode/agents/` | 1,532 | 8,686 |
| `.opencode/commands/` | 1,811 | 16,128 |
| **Total unique files affected** | **~9,000+** | **~670,000** |

(Inventoried 2026-05-07 by 3 parallel Explore agents.)

---

## Phase 001 — Skills (`.opencode/skills/` → `.opencode/skills/`)

### Reference distribution by file type

| File type | Count | Notes |
|---|---|---|
| `.md` | 6,148 | Bulk sed-safe — text references in docs/specs/SKILL.md |
| `.json` | 575 | Includes `opencode.json` (3 critical MCP refs), graph-metadata.json files, deep-review-config.json |
| `.jsonl` | 360 | Iteration artifacts under `specs/*/research/` and `*/review/` — bulk sed-safe |
| `.ts` / `.js` | 147 | **HIGH RISK** — includes import statements; bulk sed handles all forms |
| `.sh` | 42 | Shell scripts with $-quoted paths; bulk sed safe |
| `.yaml` / `.yml` | 38 | Workflow templates including `.opencode/commands/create/assets/create_*_auto.yaml` |
| `.py` | 16 | **HIGH RISK** — includes `skill_advisor.py` with regex + dict keys + f-strings (manual patch) |
| `.tmpl` | 4 | Spec templates |
| Other (`.tsx`, `.mts`, `.jsonc`) | 36 | Bulk sed |

### Reference distribution by directory

| Location | Count |
|---|---|
| Self-references inside `.opencode/skills/` | 1,197 |
| Inside `.opencode/specs/` | 6,189 |
| Inside `.opencode/commands/` | 58 |
| Inside `.opencode/agents/` | 7 |
| Inside `.claude/` | 9 |
| Inside `.codex/` | 10 |
| Inside `.gemini/` | 25 |
| At repo root (README.md, CONTRIBUTING.md, DEPLOYMENT.md, AGENTS_Barter.md, PUBLIC_RELEASE.md) | 5 |

### Critical config/script patches (Step 3 manual — NOT blanket sed)

1. **`opencode.json`** — 3 MCP server `command` arrays:
   - Line 23: `speckit_context_server` → `node .opencode/skills/system-spec-kit/mcp_server/dist/context-server.js`
   - Line 44: `cocoindex_code` → `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc`
   - Line 57: `mcp_code_mode` → `node .opencode/skills/mcp-code-mode/mcp_server/dist/index.js`

2. **`.claude/settings.local.json`** — 4 hook commands:
   - Line 37: user-prompt-submit hook
   - Line 49: compact-inject hook
   - Line 61: session-prime hook
   - Line 73: session-stop hook
   - All four call `node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/<name>.js`

3. **`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py`**:
   - Line ~1913: regex `_SKILL_PATH_RE = re.compile(r'\.opencode/skills/([^/]+)/')`
   - Lines ~2160, 2168: f-strings `f".opencode/skills/{folder}/SKILL.md"`
   - Lines ~1601-1685: dict keys mapping `.opencode/skills/<name>` to scores

### Tests/imports requiring care

- TypeScript test files (z_archive specs) with `import from '/Users/.../.opencode/skills/...'`
- Node require statements: `require('../../../../.opencode/skills/system-spec-kit/lib/...')`

---

## Phase 002 — Agents (`.opencode/agents/` → `.opencode/agents/`)

### Reference distribution by file type

| File type | Count | Notes |
|---|---|---|
| `.md` | 1,153 | Bulk sed |
| `.json` | 217 | Includes `runtime_capabilities.json` mirrorPath fields, graph-metadata.json |
| `.jsonl` | 91 | Iteration logs |
| `.yaml` | 17 | Workflow YAMLs |
| `.ts` | 8 | Config/metadata |
| `.sh` | 8 | Setup scripts |

### Reference distribution by directory

| Location | Count |
|---|---|
| Inside `.opencode/agents/` (self-references) | 10 |
| Inside `.opencode/skills/` | 162 |
| Inside `.opencode/specs/` | 1,295 |
| Inside `.claude/agents/` | 7 |
| Inside `.codex/agents/` | 11 |
| Inside `.gemini/agents/` | 8 |
| Repo root (AGENTS_Barter.md, README.md, PUBLIC_RELEASE.md) | 3 |

### Files inside `.opencode/agents/` (12 files moved by `git mv`)

`debug.md`, `deep-agent-improvement.md`, `prompt-improver.md`, `context.md`, `deep-review.md`, `create.md`, `deep-research.md`, `README.txt`, `code.md`, `review.md`, `orchestrate.md`, `multi-ai-council.md`.

### Critical patches

1. **`CLAUDE.md` §5** (line ~301) — Runtime Agent Directory routing table:
   - "Opencode | `.opencode/agents/` | Load base agent definitions" → plural
2. **`.opencode/skills/sk-prompt/graph-metadata.json`** — `mirrorPath: ".opencode/agents/prompt-improver.md"`
3. **`.opencode/skills/deep-research/assets/runtime_capabilities.json`** — `mirrorPath: ".opencode/agents/deep-research.md"`
4. **`audit_descriptions.py`** — `.opencode/agents/<name>.md` validators (path file is itself moved in Phase 003; only its content for agent refs is patched here)
5. **Mirror-runtime file copies**: `.claude/agents/*.md`, `.codex/agents/*.toml`, `.gemini/agents/*.md` — these contain text references to `.opencode/agents/...` (caught by Step 2 blanket sed)

### Mirror-runtime layout

- `.claude/agents/` — 12 file copies (NOT symlinks); per-agent `.md` files
- `.codex/agents/` — 12 file copies in `.toml` format
- `.gemini/agents/` — 12 file copies in `.md` format
- 0 symlinks pointing into `.opencode/agents/`

---

## Phase 003 — Commands (`.opencode/commands/` → `.opencode/commands/`)

### Reference distribution by file type

| File type | Count | Notes |
|---|---|---|
| `.md` | 1,451 | Bulk sed |
| `.json` | 170 | graph-metadata.json, deep-review-config.json |
| `.jsonl` | 101 | Iteration logs |
| `.yaml` | 14 | Workflow YAMLs |
| `.jsonc` | 13 | Includes `target_manifest.jsonc` |
| `.ts` | 12 | Config |
| `.sh` | 10 | Includes `mcp-doctor.sh` |

### Reference distribution by directory

| Location | Count |
|---|---|
| Inside `.opencode/commands/` (self-references) | 33 |
| Inside `.opencode/skills/` | 199 |
| Inside `.opencode/specs/` | 1,570 |
| Inside `.claude/commands/` | 33 (file copies / nested dir) |
| Inside `.codex/commands/` | 0 (uses `.codex/prompts/` symlink instead) |
| Inside `.gemini/commands/` | 15 |

### Files inside `.opencode/commands/` (69 files across 6 subdirs)

`.opencode/commands/agent_router.md` and subdirs: `create/`, `doctor/`, `improve/`, `memory/`, `spec_kit/`.

### Critical patches

1. **`audit_descriptions.py`** — command-half validators (`.opencode/commands/**`)
2. **`.opencode/skills/deep-agent-improvement/assets/target_manifest.jsonc`** — `.opencode/commands/speckit/handover.md`
3. **`.opencode/commands/doctor/scripts/mcp-doctor.sh`** — review for hardcoded path strings

### Cross-cutting

735 files reference BOTH `.opencode/agents/` AND `.opencode/commands/`. Most live in `.opencode/specs/` (research/iteration logs) and root-level docs. Bulk sed handles them — agents phase replaces agent refs and leaves command refs intact for the next phase.

---

## Phase 004 — Symlinks

### Symlinks to redirect

| Path | Old target | New target | Type |
|---|---|---|---|
| `.claude/skills` | `../.opencode/skill` | `../.opencode/skills` | symlink |
| `.claude/commands` | `../.opencode/command` | `../.opencode/commands` | symlink |
| `.codex/skills` | `../.opencode/skill` | `../.opencode/skills` | symlink |
| `.codex/prompts` | `../.opencode/command` (codex calls them "prompts") | `../.opencode/commands` | symlink |
| `.gemini/skills` | `../.opencode/skill` | `../.opencode/skills` | symlink |

### Symlinks NOT changed (already correct or unrelated)

- `.claude/specs`, `.codex/specs`, `.gemini/specs` — point at `.opencode/specs/` (already plural)
- `.claude/changelog`, `.codex/changelog`, `.gemini/changelog` — point at `.opencode/changelog/` (already singular per opencode convention)

### Pre-existing broken (NOT in scope)

- `.gemini/workflows/*` — 19 broken symlinks pointing to absolute path `/Users/.../Opencode Env/Public/.opencode/commands/...` (note: wrong directory name "Opencode Env" — pre-dates this packet). Document only; out of scope.

---

## Critical Hard-coded Path Locations (cross-phase summary)
