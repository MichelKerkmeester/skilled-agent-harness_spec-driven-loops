# Handover — 027/005/006 deep-review remediation (broaden round DEPLOYED; #1/#3/#4 done — only soft-delete remains)

## Continuation prompt (paste into the new chat)
> 027/005/006 follow-ups #1 (deploy live), #3 (agent CLI-fallback) and #4 (doc-currency) are DONE, committed and pushed on `system-speckit/027-xce-research-based-refinement` (`61b5aab102` agent-fallback, `73518a2983` doc-currency; broaden fixes `55b977951d`, synthesis `0ac83c99ce`). The ONLY remaining open item is **#2 soft-delete tombstone completion**, which is a dedicated packet (NOT a batch fix) — `SPECKIT_SOFT_DELETE_TOMBSTONES` stays default-off until `deleted_at IS NULL` filters land across ~8 recall/list/dedup paths + tombstone child cascade + tests. Daemon/MCP may flap on resume — use the CLI front doors (`node .opencode/bin/spec-memory.cjs …`) not MCP if it hangs; a `/mcp reconnect` re-binds native tools by adopting the warm daemon.

## State
- **Branch:** `system-speckit/027-xce-research-based-refinement` — in sync with origin (everything pushed).
- **Recent commits (newest first):**
  - `73518a2983` — doc-currency refresh (timeline regen, changelog 2026-06-18 section, before-after §5 + CURRENT STATE)
  - `61b5aab102` — wedged-daemon CLI-fallback baked into 8 daemon-using agents × 3 runtime mirrors (24 files)
  - `0ac83c99ce` — broaden-round synthesis + scope briefs
  - `55b977951d` — 9 broaden-round fixes + P0 regression test (search scope leaks, folderBoost, schema, infra hygiene)
  - `2b64f293b2` — round-2 (017-021) gpt-5.5 verify fixes (cancel-delay guard, bounded-read note, vec-quirk doc)
  - `cf2e49b2c4` — doc-currency sweep (timeline + system-spec-kit README/SKILL)
  - `4faff94927` / `4c14606d66` / `973de49faf` — original 017-021 remediation + docs

## Done this session
1. **017-021 remediation** + round-1 gpt-5.5 re-verify (4 P2 fixes) — committed.
2. **Doc-currency sweep** — timeline regenerated, system-spec-kit README/SKILL drift fixed (37→39 tools, 3 fictional search signals removed); advisor + code-graph docs verified clean.
3. **Daemon recycle** — the live daemon was recycled onto the 017-021 dist (the `degraded`/`vec<fts` flag is a vec0 `vec_memories` COUNT quirk; DB-verified 100% vector coverage, 20050/20050 — NOT a real gap).
4. **gpt-5.5 broaden round** — 30 passes (search/retrieval, store/index, server infra), 52 findings → 8 refute-first verifiers → **9 fixed + verified + tested** (tsc clean, 448 affected tests pass, new P0 scope-isolation test, 0 new failures vs baseline). Full disposition in `review-r2/broaden-synthesis.md`.

## Follow-ups (status — 2026-06-18 session)
- ✅ **#1 Deploy the broaden fixes live** — `mcp_server` dist rebuilt (`npm run build`; scope-fix confirmed present in compiled `retrieval-rescue.js`) and the live spec-memory daemon recycled onto it (now PID-supervised on fresh dist). The recycle was NOT transparent — see Gotchas; recovered via a CLI front-door cold-start.
- ⏳ **#2 Soft-delete tombstone completion** — **THE ONLY REMAINING ITEM.** Dedicated packet, not a batch fix. `SPECKIT_SOFT_DELETE_TOMBSTONES` stays default-OFF until `deleted_at IS NULL` filters land across ~8 recall/list/dedup paths + tombstone child cascade + tests.
- ✅ **#3 Durable wedged-daemon CLI-fallback** (`61b5aab102`) — baked into 8 daemon-using agents × 3 runtime mirrors. Bash-enabled (deep-review, deep-research, review, debug, deep-improvement) → CLI-front-door variant; Bash-denied (context, deep-context, ai-council) → Grep/Read-only variant. No shared inheritance point exists (convention is inline-per-agent, like the efficiency governor), so it's inline. The `agent-mirror-sync` pre-commit gate confirmed all mirrors in sync.
- ✅ **#4 Doc-currency refresh** (`73518a2983`) — timeline regenerated, `changelog-005-006` gained a 2026-06-18 section, `before-vs-after.md` §5 + CURRENT STATE updated. Feature-catalog deliberately untouched: the 005-verification track is not cataloged by convention (no sibling remediation phase has an entry).

## Gotchas (load-bearing)
- **dist is gitignored** — source fixes don't reach the live daemon until `npm run build` + recycle.
- **Daemon recycle is NOT always transparent (2026-06-18 lesson)** — the documented `mcp-front-proxy-deploy-recycle` transparent recycle assumes a LIVE lease-holder launcher. When the daemon child is orphaned at PPID 1 (no healthy lease-holder), SIGTERM-ing it takes the shared daemon AND every launcher down with no auto-respawn (briefly affects all concurrent sessions). Recover with a deliberate CLI front-door cold-start (`node .opencode/bin/spec-memory.cjs memory_stats`), which spawns a fresh launcher + daemon from current dist — a healthier, properly-supervised state. Check the daemon's PPID with `ps` before SIGTERM.
- **zsh does NOT word-split unquoted vars** — use a `files=( … )` array for `git add -- $files` / `git commit … -- $files`, or quote each path. A plain `$VAR` of space-joined paths becomes ONE pathspec and fails.
- **Shared git index** — multiple sessions share it; always scope commits with explicit pathspec and verify `git show --stat HEAD` before push.
- **Daemon flaps on session resume** — MCP (`mk-spec-memory`/`mk-code-index`) can drop; sockets usually still present. Use CLI front doors. The review scope briefs already carry an explicit MCP-fallback section.
- **Known-baseline test failures (NOT regressions):** `handler-memory-index-cooldown`, `handler-memory-index-needs-rebuild` (mock-export gap), `retry-manager` T49, `trigger-threshold-tuning`. Confirm any "new" failure against this baseline (stash-and-compare).
- **Raw gpt-5.5 lineages** are on-disk scratch (uncommitted): broaden round in `review-r2/lineages/gpt55r2-*`; round-1 in `review/lineages/gpt55-*`. Synthesis docs are the durable record.
- **Refuted findings** (don't re-fix): memory_delete id+specFolder (id is a unique PK), session-proxy replay (rowid-idempotent), retention-sweep (logic inverted), atomic-save ordering (startup-recovered).

## Verify commands
- Typecheck: `cd .opencode/skills/system-spec-kit/mcp_server && npm run typecheck`
- Affected suites: `npx vitest run retrieval-rescue memory-search community-search memory-summaries handler-memory-save handler-memory-index tool-input-schema hybrid-search` (substring filters; vitest config root is the skill dir).
- Strict spec validate: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict`
