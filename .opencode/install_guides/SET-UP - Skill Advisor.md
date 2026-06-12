# SET-UP - Skill Advisor

Tune the OpenCode skill advisor scoring tables (TOKEN_BOOSTS, PHRASE_BOOSTS, derived triggers, CATEGORY_HINTS) so the advisor can route prompts to every skill in your repo.

> **Part of OpenCode Installation.** See the [Master Installation Guide](./README.md) for complete setup.
> **Command:** `/doctor skill-advisor` (auto + confirm modes) — full reference in `.opencode/commands/doctor/speckit.md`.
> **Ownership:** As of `013/009/008`, `skill_graph_*` tools are served by the `mk_skill_advisor` MCP server, not `mk-spec-memory`. Operations remain identical; public tool ids are unchanged.

---

## TABLE OF CONTENTS

0. [AI-FIRST PROMPT](#0-ai-first-prompt)
1. [OVERVIEW](#1-overview)
2. [PREREQUISITES & INSTALLATION](#2-prerequisites--installation)
3. [QUICK TUNING (NO REBUILD REQUIRED) — RECOMMENDED FOR EXTERNAL CLONES](#3-quick-tuning-no-rebuild-required--recommended-for-external-clones)
4. [RUN](#4-run)
5. [WHAT IT TOUCHES](#5-what-it-touches)
6. [VERIFICATION](#6-verification)
7. [ROLLBACK](#7-rollback)
8. [TROUBLESHOOTING](#8-troubleshooting)
9. [RESOURCES](#9-resources)

---

## 0. AI-FIRST PROMPT

Paste this into your AI client to run a guided optimization:

```text
Run the skill-advisor command to tune my OpenCode skill advisor scoring system.

PREREQUISITE CHECK (verify before proceeding):
- [ ] At least one skill exists at .opencode/skills/<name>/SKILL.md
- [ ] system-skill-advisor MCP server is built (dist/ exists)
- [ ] skill_graph_scan tool is in your tool list
- [ ] Baseline advisor tests pass before any changes

If any prerequisite fails: STOP and report which one. Do NOT proceed.

Steps:
1. Invoke /doctor skill-advisor (interactive mode for first run).
2. At setup: scope=A (all), tests=A (run), apply=A (apply changes).
3. Walk me through Phase 0 → 1 → 2 → 3 → 4 with approval at each gate.
4. On success: summarize files modified and how to undo if needed.
5. On test failure: run the per-run rollback script that Phase 3 generated under <packet_scratch>/rollback-<timestamp>.sh
   (it restores only the exact files this run modified, so any unrelated WIP is preserved).
   The script also runs npm --prefix .opencode/skills/system-skill-advisor/mcp_server run build at the end.
```

**Expected duration:** 5–10 minutes interactive | 1–2 minutes autonomous.

---

## 1. OVERVIEW

The Skill Advisor tunes its routing accuracy by scoring user prompts against every skill's `graph-metadata.json` + SKILL.md token/phrase/intent signals. This guide configures the advisor for your specific skill set: how to install fresh, how to add or change signals without rebuilding, how to run the full doctor flow, and how to roll back per-run.

Two installation paths exist:

- **Fresh clone setup** — when this is your first time configuring the advisor in a new clone or after a hard reset. Builds the MCP server and seeds the SQLite graph.
- **Quick tuning loop** — when the MCP server is already built and you just want to add or change `intent_signals` without a TypeScript build cycle.

The default workflow is the `/doctor skill-advisor` command, which gates each phase behind operator approval and writes a per-run rollback script. Use the AI-FIRST PROMPT above to drive it from your AI client, or follow the manual steps below for direct shell invocation.

---

## 2. PREREQUISITES & INSTALLATION

**Fresh clone setup (run these FIRST):**

```bash
# 1. Install MCP server dependencies (no package-lock.json is committed; install resolves latest compatible versions)
npm --prefix .opencode/skills/system-spec-kit/mcp_server install

# 2. Build advisor dist/ (compiled output the runtime loads)
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run build
```

**Verification checks (after build):**

| Requirement | Check |
| --- | --- |
| At least one skill exists | `ls .opencode/skills/*/SKILL.md` returns paths |
| MCP server is built | `ls .opencode/skills/system-skill-advisor/mcp_server/dist/` shows JS |
| `skill_graph_scan` available | Tool appears in your AI client's tool list |
| Baseline tests pass | `npm --prefix .opencode/skills/system-skill-advisor/mcp_server test` is green |

---

## 3. QUICK TUNING (NO REBUILD REQUIRED) — RECOMMENDED FOR EXTERNAL CLONES

Most "tweak it to match my setup" needs are signal additions, not lane-weight changes. The simple path is:

1. **Edit `intent_signals`** in the per-skill `graph-metadata.json`:
   ```bash
   # Example: add a code-work signal to sk-code
   $EDITOR .opencode/skills/sk-code/graph-metadata.json
   # Append phrases like "throw on missing", "add a flag" to the intent_signals array
   ```
2. **Re-index the SQLite graph** (REQUIRED — without this, signal edits have ZERO effect on routing):
    - Via your AI client's MCP tool list: call `skill_graph_scan({})`
    - Via the daemon-backed CLI: `node .opencode/bin/skill-advisor.cjs skill_graph_scan --trusted --format json`
    - Or via Python compatibility: `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py --export-json --pretty` then re-index through MCP or the trusted CLI form above
3. **Verify**: query `advisor_recommend({ prompt: "your test phrase", options: { topK: 3 } })` — your skill should now appear.

**Why this is the recommended path for external users:**
- No TypeScript editing
- No `npm run build` cycle
- Instant feedback (re-index is < 1 second)
- Skill-local: edits only affect the skill you touch, no risk to other skills

The full `/doctor skill-advisor` workflow (Section 4 below) is for batch optimization across all skills + lane-weight tuning. Use it after large repo restructures or when adding 5+ new skills.

> **Critical**: The advisor reads scoring inputs from `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite`, NOT from `graph-metadata.json` directly. Editing JSON without running `skill_graph_scan` will produce identical pre-edit scores.

---

## 4. RUN

| Use case | Command |
| --- | --- |
| First-time tuning | `/doctor skill-advisor` |
| Re-tune after adding a skill | `/doctor skill-advisor` |
| Preview without writing | `/doctor skill-advisor --dry-run` |
| Tune one lane only | `/doctor skill-advisor --scope=explicit` (or `derived` / `lexical`) |
| Skip post-apply tests | `/doctor skill-advisor --skip-tests` (not recommended) |

**The five phases (see command markdown for full detail):**

```
Phase 0 Discovery → Phase 1 Analysis → Phase 2 Proposal
                                           ↓
                Phase 4 Verify ← Phase 3 Apply
```

The command rebuilds `dist/`, runs `skill_graph_scan`, and runs the advisor test suite as part of Phase 4.

---

## 5. WHAT IT TOUCHES

**Mutates only:**
- `lib/scorer/lanes/explicit.ts` (TOKEN_BOOSTS, PHRASE_BOOSTS)
- `lib/scorer/lanes/lexical.ts` (CATEGORY_HINTS)
- `.opencode/skills/<name>/graph-metadata.json` (`intent_signals` array, `derived.trigger_phrases`, `derived.key_topics`)

**Never touches:** any `SKILL.md` content, `weights-config.ts`, fusion scorer, daemon code.

> **Indexing follow-up**: After Phase 3 mutates these files, the doctor command runs `advisor_rebuild` + `skill_graph_scan` automatically. If you edit any of these files MANUALLY (e.g. via the Quick Tuning recipe in Section 3), you MUST re-index yourself — call `skill_graph_scan({})` through MCP, or use `node .opencode/bin/skill-advisor.cjs skill_graph_scan --trusted --format json` on the daemon-backed CLI. The SQLite graph is the runtime source of truth.

---

## 6. VERIFICATION

```bash
# Tests still green
npm --prefix .opencode/skills/system-skill-advisor/mcp_server test

# Graph re-indexed (in your AI client)
skill_graph_status({})
# Expected: skill_count matches .opencode/skills/* count, lastScanAt is recent

# Optional: confirm a routing improvement
advisor_recommend({ prompt: "your test prompt", options: { topK: 3 } })
```

---

## 7. ROLLBACK

Phase 3 generates a per-run rollback script at `<packet_scratch>/rollback-<timestamp>.sh` (under `<spec-folder>/scratch/` or `.opencode/scratch/`) listing the exact files modified. Use it for clean recovery:

```bash
# 1. Run the per-run rollback script (restores only files modified by this run)
bash <packet_scratch>/rollback-<timestamp>.sh

# 2. Verify rollback
npm --prefix .opencode/skills/system-skill-advisor/mcp_server test
```

**Why the per-run script and not `git checkout HEAD --`?** A broad `git checkout HEAD -- .opencode/skills/...` would discard any unrelated WIP in those paths. The per-run script restores only the files this command touched, leaving other changes intact.

**If the per-run script is unavailable** (e.g., the run failed before Phase 3 step 3 completed):

```bash
# Stash any unrelated WIP first to avoid loss
git stash push -m "skill-advisor-rollback-safety" -- \
  .opencode/skills/system-skill-advisor/mcp_server/lib/ \
  .opencode/skills/*/graph-metadata.json

# Then restore
git restore --source=HEAD -- \
  .opencode/skills/system-skill-advisor/mcp_server/lib/ \
  .opencode/skills/*/graph-metadata.json

npm --prefix .opencode/skills/system-skill-advisor/mcp_server run build
```

---

## 8. TROUBLESHOOTING

| Problem | Fix |
| --- | --- |
| `"no skills found"` | Create at least one skill via `/create:skill` |
| `"graph health: missing"` | Run `skill_graph_scan({})` through MCP, or `node .opencode/bin/skill-advisor.cjs skill_graph_scan --trusted --format json` on the daemon-backed CLI, then re-run the command |
| Build fails after apply | Rollback (see Section 7), inspect diff in `<spec-folder>/scratch/skill-advisor-proposal-*.md` (or `.opencode/scratch/...` outside a spec folder) |
| Tests fail after apply | Rollback, then re-run with `--scope=derived` only |
| Command not found | Verify `.opencode/commands/doctor/speckit.md` exists; restart your AI client |
| Wrong skill in `advisor_recommend` | Stale graph index — run `skill_graph_scan({})` through MCP, or the trusted daemon-backed CLI form |
| Edited `graph-metadata.json` but scores unchanged | Forgot to re-index — call `skill_graph_scan({})` through MCP, or `node .opencode/bin/skill-advisor.cjs skill_graph_scan --trusted --format json`. The advisor reads from `database/skill-graph.sqlite`, not the JSON file. |
| `skill_graph_scan` reports `scannedFiles: 20, indexedFiles: 18` | Normal — the indexer skips `scripts/test-fixtures/*/graph-metadata.json` (test scaffolding, not real skills). The 18 is your real skill count. |
| Cannot parse `explicit.ts` | `git restore --source=HEAD -- .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts` (restores from HEAD without affecting unrelated WIP) |
| MCP server missing | `npm --prefix .opencode/skills/system-spec-kit/mcp_server install && npm --prefix .opencode/skills/system-skill-advisor/mcp_server run build` |

---

## 9. RESOURCES

- **Command reference:** `.opencode/commands/doctor/speckit.md`
- **Workflow YAML:** `.opencode/commands/doctor/assets/doctor_skill-advisor_{auto,confirm}.yaml`
- **Operator setup + native MCP install (merged 2026-05-15):** `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md`
