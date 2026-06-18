# Handover — 027/005/006 deep-review remediation (broaden round complete)

## Continuation prompt (paste into the new chat)
> Continue 027 deep-review remediation on branch `system-speckit/027-xce-research-based-refinement`. The gpt-5.5 broaden round is DONE and committed/pushed (9 fixes + P0 regression test at `55b977951d`, synthesis at `0ac83c99ce`). Read `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/handover.md` then pick up the open follow-ups below. Daemon/MCP may be flapping — use the CLI front doors (`node .opencode/bin/spec-memory.cjs …`) not MCP if it hangs.

## State
- **Branch:** `system-speckit/027-xce-research-based-refinement` — in sync with origin (everything pushed).
- **Recent commits (newest first):**
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

## Open follow-ups (priority order)
1. **Deploy the broaden fixes live** — `dist/` is gitignored and STALE (dist `retrieval-rescue.js` is from Jun 11; today's source fixes are NOT compiled). Run `cd .opencode/skills/system-spec-kit/mcp_server && npm run build`, then recycle the daemon (SIGTERM the context-server child of the launcher — transparent recycle for mk-spec-memory ONLY; see memory `mcp-front-proxy-deploy-recycle`). Until then the fixes are shipped (committed) but not live on real searches.
2. **Soft-delete completion packet** — REAL but `SPECKIT_SOFT_DELETE_TOMBSTONES` is default-OFF and `ENV_REFERENCE.md` says keep OFF until recall filters `deleted_at IS NULL`. Completing it = `deleted_at IS NULL` filters across ~8 recall/list/dedup paths + tombstone child cascade + tests. Dedicated packet, not a batch fix.
3. **Durable `@deep-review` CLI-fallback** — bake the "use the warm-daemon CLI front doors / Grep-Read instead of blocking on a wedged MCP call" rule into the `@deep-review` agent definition (+ `.claude`/`.codex` mirrors), not just the per-scope briefs.
4. **Doc-currency refresh for the broaden round** — timeline / changelog / before-after / feature-catalog for `55b977951d` if you want the 027 docs fully current.

## Gotchas (load-bearing)
- **dist is gitignored** — source fixes don't reach the live daemon until `npm run build` + recycle.
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
