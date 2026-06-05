# Handover — Barter Framework Setup (post Public→Barter shared-skills sync)

> **Run this from inside a Barter OpenCode session.** The work below touches Barter's MCP
> subsystem databases, which can only be rebuilt from a session whose MCP tools are
> Barter-scoped (sockets `/tmp/mk-*-barter`). A Public session cannot do it.
>
> **Repo:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Barter | v3.5/coder`
> (path has a space and a literal `|` — always quote it). Its `.opencode/` is **gitignored**
> → not git-reversible; back up before any overwrite/delete.
> **Source of truth:** Public = `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`, HEAD `8683890935`.

---

## ✅ Already done (FROM a Public session — do NOT redo)

1. **153 shared-skill files** synced Public→Barter under `.opencode/skills/` (checksum rsync,
   verified 0 remaining diffs). Excluded: `sk-code`, `sk-git`, the two Barter-unique skills,
   `specs/`, env-specific `skill-graph.json`, and all runtime state.
1b. **43 non-skills framework files** also synced under `.opencode/`: `commands/` (27 — create
   /deep/doctor cmds + assets + doctor scripts), `agents/` (6 — ai-council, deep-improvement,
   deep-review, orchestrate, prompt-improver, README), `changelog/agent-orchestration/` (8),
   `install_guides/` (2). Verified 0 remaining. `bin/` was already current (no launcher `.cjs`
   to ship → no fresh-session needed for it). `specs/`, `node_modules/`, root `opencode.json`
   (Barter permission block) untouched.
2. **`cli-gemini` skill deleted** in Barter (43 files) + `cli-devin/.../028-from-cli-gemini.md`.
3. **Stale dist fixed + synced**: `system-spec-kit` and `system-code-graph` `runtime-detection.js`
   (gemini `.gemini/settings.json` hook-read removed) plus code-graph `config.js`/`code-graph-tools.js`
   rebuilt in Public and synced — Barter's dist is now current and paired with its source.
4. **Backups** (rollback source): `/tmp/barter-sync-20260605-120307/`
   (`overwritten/` = 149 pre-sync originals; `deleted/cli-gemini/` = the removed skill).

So: **the files are already in place.** Your job is to *activate* them in Barter's runtime and
re-align Barter's subsystem databases.

---

## 🔒 Preserve list — NEVER overwrite/sync these from Public

- Skills: `sk-code`, `sk-git`, `sk-bartender-endpoint-interpreter`, `sk-bo-notifications-templates`
- `opencode.json` → only the `permission` block (Barter-unique read-allowlist + git policy)
- Env-specific: `system-skill-advisor/mcp_server/scripts/skill-graph.json` (Barter's lists its
  unique skills; Public's lists webflow/motion_dev — overwriting corrupts Barter's skill graph)
- All runtime state: `*.sqlite`/`-wal`/`-shm`, telemetry (`shadow-deltas*`, `search-decisions`),
  owner/lease json (`.mk-*-launcher.json`, `.*-owner.json`, `*readiness.json`), `*.tsbuildinfo`,
  `.advisor-state/`, `.smart-router-telemetry/`. **Copying a daemon-lease sqlite corrupts live Barter daemons.**

---

## 🛠️ Setup steps

### 0. Confirm you are inside Barter
```bash
pwd   # …/Barter | v3.5/coder
env | grep -q OPENCODE_ && echo "in opencode ✓"
ls /tmp/mk-spec-memory-barter /tmp/mk-code-index-barter   # Barter's socket dirs
```
If `pwd` shows `Public`, STOP — you're in the wrong runtime.

### 1. Verify the sync landed
```bash
[ -d .opencode/skills/cli-gemini ] && echo "FAIL: cli-gemini still present" || echo "OK: cli-gemini gone"
grep -m1 '^version:' .opencode/skills/cli-opencode/SKILL.md          # expect 1.3.13.0 (Public parity)
grep -c '\.gemini' .opencode/skills/system-spec-kit/mcp_server/dist/lib/runtime-detection.js  # expect 0
ls .opencode/skills | wc -l    # 23 skill dirs + README (was 24 before cli-gemini removal)
```

### 2. Drop `cli-gemini` from Barter's skill-advisor seed (env-specific — the sync skipped it)
Barter's seed still references the now-deleted skill (Public's seed already = 0 entries):
```bash
SEED=.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json
grep -c '"cli-gemini"' "$SEED"   # currently 1 → should be 0 after this step
```
Back it up, then remove **only** the `cli-gemini` node/entry (keep
`sk-bartender-endpoint-interpreter` and `sk-bo-notifications-templates`, and any edges that
*point to* cli-gemini from other skills). Do this with a JSON-aware edit (node/jq), not a blind
line delete, so the file stays valid JSON.

### 3. Rebuild all subsystem databases — the canonical "set everything up"
```
/doctor:update
```
Run it in the Barter session. It rebuilds in dependency order
**code-graph → context-index → causal → skill-graph → advisor → deep-loop → eval** with
snapshot / validate / rollback, re-indexing Barter's own content against the new framework +
new dist. The skill-graph rebuild scans the skill *directories* (cli-gemini is gone) → expect
**23 nodes** (was 24).

*Minimal alternative* (if you don't want the full doctor run): rebuild just skill-graph +
advisor — re-run `scripts/init-skill-graph.sh` (or the in-process `indexSkillMetadata(skillsRoot)`),
then `advisor_rebuild`. Confirm node count 23 and no `cli-gemini`.

### 4. Confirm the new dist is live
Barter's daemons spawn from the synced (current) dist on session start. Verify via MCP:
```
memory_health        → databaseConnected true, memories indexed (Barter's own content)
code_graph_status    → ready
advisor_status       → live, 23 skills
```
*Optional belt-and-suspenders:* `npm run build` in `.opencode/skills/system-spec-kit/mcp_server`
and in `.opencode/skills/system-code-graph` (use `--prefix`, avoid `cd`). Usually unnecessary —
the sync shipped paired source+dist. (No `npm install` needed: no `package.json` was in the synced set.)

### 5. Final verification
- `advisor_recommend` on a gemini-flavoured prompt (e.g. "dispatch gemini cli") → must **not**
  surface `cli-gemini`.
- `memory_health` + `code_graph_status` healthy.
- (optional) run the spec-kit / code-graph vitest suites.

---

## 🚫 Do NOT

- **Do NOT purge the ~62 remaining `cli-gemini` references** in `system-spec-kit` docs /
  `feature_catalog` / `manual_testing_playbook` / tests / `dist/matrix_runners/adapter-cli-gemini.*`.
  These **mirror Public** (Public has 65 of them; the matrix adapters exist there too). cli-gemini
  deprecation is Public **packet 132** (`specs/skilled-agent-orchestration/132-cli-gemini-deprecation`),
  *in progress* — the skill removal is only step one. Purging these in Barter would **diverge** from
  Public; they will clear on a future sync once Public finishes packet 132.
- Do NOT overwrite any preserve-list file.
- Do NOT copy Public's sqlite / daemon-lease files into Barter.
- Do NOT recycle a code-index/advisor daemon by SIGTERM-ing its child — those launchers *exit*
  instead of respawning (only mk-spec-memory's front-proxy respawns transparently). Use a fresh
  session / `/mcp` reconnect to reload dist for those.

---

## 📌 Sync scope — COMPLETE for the 17-commit delta

Both `.opencode/skills/` (153 files) **and** the changed non-skills surfaces
(`commands/`, `agents/`, `changelog/`, `install_guides/` — 43 files) are now at Public parity.
`bin/`, `hooks/`, `plugins/`, `scripts/`, and `.opencode/package.json` were unchanged in the
delta. `specs/` and root `opencode.json` are intentionally excluded (Barter-specific). Nothing
framework-side remains to sync from Public HEAD `8683890935`.

## 🔁 Reference — the exact sync command (to re-verify or extend scope)
```bash
PUB="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/"
BAR="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Barter | v3.5/coder/.opencode/skills/"
# add -n for a dry-run; drop it to apply. --backup-dir preserves overwritten files.
rsync -ac --itemize-changes --backup --backup-dir="/tmp/barter-resync-$(date +%Y%m%d-%H%M%S)" \
  --exclude='sk-code/' --exclude='sk-git/' \
  --exclude='sk-bartender-endpoint-interpreter/' --exclude='sk-bo-notifications-templates/' \
  --exclude='system-skill-advisor/mcp_server/scripts/skill-graph.json' --exclude='**/database/skill-graph.json' \
  --exclude='.DS_Store' --exclude='.advisor-state/' --exclude='.smart-router-telemetry/' \
  --exclude='*.sqlite' --exclude='*.sqlite-wal' --exclude='*.sqlite-shm' --exclude='*.db' --exclude='*.db-wal' --exclude='*.db-shm' \
  --exclude='node_modules/' --exclude='**/database/.code-graph-owner.json' --exclude='**/database/.spec-memory-owner.json' \
  --exclude='**/.mk-*-launcher.json' --exclude='**/shadow-deltas*.jsonl' --exclude='**/shadow-deltas*.rotated' \
  --exclude='**/search-decisions.jsonl' --exclude='**/readiness.json' --exclude='**/.code-graph-readiness.json' \
  --exclude='**/.unclean-shutdown' --exclude='**/.embeddings-cache/' --exclude='**/*.tsbuildinfo' \
  "$PUB" "$BAR"
```
A dry-run (`-n`) reporting **0** itemized changes = Barter is at Public parity for shared skills.
```
