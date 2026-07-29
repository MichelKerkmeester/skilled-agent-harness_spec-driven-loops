# Iteration 004 — Hooks, Lifecycle Automation, CI, Session Reapers, /doctor

**Lineage:** glm | **Iteration:** 4 of 5 | **Focus:** Runtime hooks, CI job, git post-commit, session reapers, /doctor surface
**Timestamp:** 2026-07-27T20:46:00.000Z

## Focus
Map every hook, lifecycle automation, CI job, session reaper, and /doctor surface that references the code graph. These are the "three per-runtime freshness hooks, a git post-commit hook, two session reapers, a CI job, and the /doctor surface" cited in the spec.

## Method
- `rg --hidden --no-ignore -n` for code-graph references in each hook/config/script file.
- `wc -l` for file sizes.

## Findings

### F4.1 — Three per-runtime freshness hooks (CONFIRMED, blocking)
Each runtime registers a PostToolUse hook that shells out to a runtime-specific freshness script inside the code-graph skill:
1. **`.claude/settings.json:165`** — `"command": "bash -c '... node .opencode/skills/system-code-graph/runtime/hooks/claude/code-graph-freshness.cjs'"` [SOURCE: .claude/settings.json:165]
2. **`.codex/hooks.json:101`** — `"command": "bash -c '... node .opencode/skills/system-code-graph/runtime/hooks/codex/code-graph-freshness.cjs || ...'"` (with fallback error output) [SOURCE: .codex/hooks.json:101]
3. **`.devin/hooks.v1.json:109`** — `"command": "bash -c '... node .opencode/skills/system-code-graph/runtime/hooks/devin/code-graph-freshness.cjs'"` [SOURCE: .devin/hooks.v1.json:109]
- **Failure mode if skill removed:** Each hook fires on PostToolUse. If the freshness script is absent, the hook command fails. Claude/Codex may surface an error; Devin may silently fail. All three hook entries must be removed from their respective settings files in lockstep with the skill deletion.
- **Note:** These are the "three per-runtime freshness hooks" from the spec. The `.claude/settings.json` is a hidden file that `rg --hidden --no-ignore` catches but visible-only `rg` would miss.

### F4.2 — CI job: `isolation-check.yml` (CONFIRMED, blocking)
- **File:** `.github/workflows/isolation-check.yml`
- **Step 1 (lines 19-38):** "Audit spec-kit MCP source for system-code-graph imports" — `rg -n "from ['\"]?.*system-code-graph"` in spec-kit MCP source. Fails if spec-kit imports from system-code-graph at the TS source level. Enforces the boundary wrapper pattern.
- **Step 2 (lines 43-61):** "Audit code-graph MCP source for system-spec-kit imports (reverse direction)" — fails if code-graph imports from spec-kit.
- **Step 3 (lines 110-126):** "Audit code-graph for @spec-kit/* workspace-alias imports" — fails if code-graph uses workspace aliases.
- **Failure mode if skill removed:** Steps 2 and 3 audit a directory that no longer exists. The CI job will either error (no directory) or pass vacuously depending on `rg` behavior. Step 1's audit target (spec-kit) still exists but the pattern it guards against becomes moot. The entire workflow must be removed or rewritten. [SOURCE: isolation-check.yml:19-61,110-126]

### F4.3 — Git post-commit hook: code-graph invalidation (CONFIRMED, blocking)
- **File:** `.opencode/scripts/git-hooks/post-commit` (121+ lines)
- **Purpose:** "code-graph SQLite stale so the next MCP launcher boot triggers a fresh scan" (line 5)
- **Bypass env:** `SPECKIT_SKIP_CODE_GRAPH_POST_COMMIT=1` (line 14)
- **DB paths:** `CANONICAL_DB_DIR="$REPO_ROOT/.opencode/skills/system-code-graph/mcp-server/database"` (line 73), `LEGACY_DB_DIR="$REPO_ROOT/.opencode/.spec-kit/code-graph/database"` (line 74)
- **Logic:** Counts changed files in HEAD; if >= threshold, writes atomic invalidation marker to code-graph SQLite readiness files (lines 77-121)
- **Failure mode if skill removed:** Hook references a non-existent DB directory. The script has guards (`-f` checks) so it may no-op silently, but the hook entry and the script must be removed. [SOURCE: post-commit:5,14,73,74,77-121]
- **Regression test:** `.opencode/scripts/git-hooks/tests/post-commit-code-graph-invalidation.sh` (208 lines) — full regression harness with `seed_code_graph_files()` (line 75). [SOURCE: post-commit-code-graph-invalidation.sh:5,75]

### F4.4 — Session reaper: `session-cleanup.sh` (CONFIRMED, blocking)
- **File:** `.opencode/scripts/session-cleanup.sh`
- **Lines 99, 102:** Kills processes matching `mk-code-index-launcher.cjs` and `system-code-graph/mcp-server/dist/index.js`
- **Purpose:** Session cleanup kills orphaned MCP server processes on session end.
- **Failure mode if skill removed:** The match patterns become dead code. Not a crash, but the reaper must be updated to remove the code-graph process patterns. [SOURCE: session-cleanup.sh:99,102]

### F4.5 — Orphan MCP sweeper: `orphan-mcp-sweeper.sh` (CONFIRMED, blocking)
- **File:** `.opencode/scripts/orphan-mcp-sweeper.sh`
- **Line 209:** `*"mk-code-index-launcher.cjs"*) printf '%s\n' "mk-code-index-launcher"; return 0 ;;`
- **Line 213:** `*"system-code-graph/mcp-server/dist/index.js"*) printf '%s\n' "code-graph-server"; return 0 ;;`
- **Purpose:** Identifies and reaps orphaned MCP server processes.
- **Failure mode if skill removed:** Dead match patterns. Must be removed. [SOURCE: orphan-mcp-sweeper.sh:209,213]

### F4.6 — `/doctor` surface: `code-graph` route (CONFIRMED, blocking)
- **`_routes.yaml:27-28`** — "Code-graph implementation/docs are owned by .opencode/skills/system-code-graph/; stable code_graph/detect-changes MCP tools are registered through mk-code-index."
- **`_routes.yaml:83-105`** — `code-graph` route targeting `doctor-code-graph.yaml`, with gate3 location, MCP tool grants (`mcp__mk_code_index__code_graph_status/query/context`, `mcp__mk_code_index__detect_changes`), warm-only probe instructions, and 4 symptom labels (index drift, rebuild, stale excludes, corruption recover). [SOURCE: _routes.yaml:27-28,83-105]

### F4.7 — `/doctor` surface: `doctor-code-graph.yaml` (CONFIRMED, live doc)
- **File:** `.opencode/commands/doctor/assets/doctor-code-graph.yaml` (278 lines)
- **Role:** "Diagnostic Operator running code-graph health audit in confirm mode" (line 4)
- **Skill owner:** `.opencode/skills/system-code-graph/` (line 7)
- **CLI health command:** `node .opencode/bin/code-index.cjs code_graph_status --format json --timeout-ms 500 --warm-only` (line 29)
- **Scope:** Full diagnostic operator spec with phases, resilience assets, enforcement rules. [SOURCE: doctor-code-graph.yaml:4,7,29,58-88]
- **Classification:** This entire file is a code-graph-specific doctor route. Must be removed with the skill.

### F4.8 — `/doctor` surface: `doctor-mcp-debug.yaml` and `doctor-mcp-install.yaml` (CONFIRMED, live doc)
- **`doctor-mcp-debug.yaml`** — `mk_code_index` in supported servers list (line 27, 87), install guide ref (line 45, 97), build/repair commands (lines 145-157): `cd .opencode/skills/system-code-graph && npm install && tsc --build`, launcher restore, database dir creation. [SOURCE: doctor-mcp-debug.yaml:27,45,87,97,145-157]
- **`doctor-mcp-install.yaml`** — `mk_code_index` install validation (lines 45, 83, 99, 143-154): skill_dir, launcher file_exists check, database dir_exists check. Node/npm version requirements list `mk_code_index` (lines 267-268). [SOURCE: doctor-mcp-install.yaml:45,83,99,143-154,267-268]
- **Classification:** These are multi-server doctor assets. The `mk_code_index` entries must be stripped, but the files themselves remain for the other servers (mk-spec-memory, mk_skill_advisor, code_mode, sequential_thinking).

### F4.9 — `/doctor` surface: `mcp-doctor.sh` (CONFIRMED, live doc)
- **File:** `.opencode/commands/doctor/scripts/mcp-doctor.sh`
- **Lines 16, 50, 61:** `mk_code_index` in supported server names, display name "System Code Graph (Node.js MCP, structural AST + 8 tools)"
- **Lines 252, 367-378:** `diagnose_mk_code_index()` function with skill_dir, launcher, legacy_db_dir paths. [SOURCE: mcp-doctor.sh:16,50,61,252,367-378]
- **Classification:** Shell script with a dedicated function for mk_code_index. Must remove the function and all mk_code_index references.

### F4.10 — `doctor-update.yaml` and `doctor-mcp-presentation.txt` (CONFIRMED, live doc)
- `doctor-update.yaml` — references system-code-graph in update tier routing (from iteration-1 hit list). [SOURCE: iteration-1 hit list]
- `doctor-mcp-presentation.txt` — mk_code_index in presentation text (from iteration-1 hit list). [SOURCE: iteration-1 hit list]

## Assessment
- **newInfoRatio:** 0.85 — all 10 findings are new, but the hook/CI/reaper pattern was partially anticipated by the spec's problem statement. The specific file:line evidence and the /doctor surface decomposition are the novel contribution.
- **Questions advanced:** q3 (hooks, CI, session reapers, /doctor — all confirmed with file:line), q5 (ordering: hooks must be removed before/with skill; CI job must be removed; /doctor route + assets must be stripped).
- **Critical ordering constraint:** The three freshness hooks (F4.1) fire on PostToolUse. If the skill is deleted before the hook entries are removed from `.claude/settings.json`, `.codex/hooks.json`, `.devin/hooks.v1.json`, every tool call triggers a failed shell-out. Hooks MUST be removed first (or simultaneously).

## Dead Ends
- `.github/hooks/scripts/session-start.sh` — checked for code-graph refs; none found. Not a touchpoint.

## Next Focus
Iteration 5: Doctrine claims, doc references, agent tool grants (full cross-runtime agent tree), and the ordering graph. Consolidate all touchpoints into a dependency-ordered removal graph with rollback risk per consumer. Produce the per-consumer remove-vs-fallback recommendation.
