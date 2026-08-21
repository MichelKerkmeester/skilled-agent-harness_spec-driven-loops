---
title: "Task Breakdown: Hook Library mk- Prefix Rename"
description: "Per-phase, checkable task list for the hook-library mk- rename, keyed to REQ ids and the frozen name-mapping."
trigger_phrases:
  - "hook rename tasks"
  - "mk rename checklist tasks"
importance_tier: "normal"
contextType: "general"
---
# Task Breakdown: Hook Library `mk-` Prefix Rename

<!-- SPECKIT_LEVEL: 3 -->

> Tasks derive their exact old→new tokens from `name-mapping.md`. Each task is
> re-grepped to confirm before its checkbox is marked. `[R]` = risk-gated.

---

## Phase 1 — Inventory freeze + token map  ✅ DONE
- [x] T1.1 Materialize `token-map.tsv` from `name-mapping.md`
- [x] T1.2 Write `verify-no-mk.sh` grep-gate — **uses `git grep`** (no `rg` binary exists here; `rg` is only an interactive shell function). Negative-control-verified: detected 2443 occ pre-sweep.
- [x] T1.3 Baseline: Phase-2 898 occ/142 files; Phase-5 1545/375; all 2443/492

## Phase 2 — Plugin + test renames  ✅ DONE  (REQ-001, 002, 004)
- [x] T2.1 `git mv` the **12 unique-stem** plugins → new stems (spec-memory/skill-advisor → Phase 5)
- [x] T2.2 `git mv` the 14 corresponding test files → new stems
- [x] T2.3 Content sweep of all Phase-2 tokens across 142 tracked files (banners, cross-refs, log tags, `DISABLED_ENV`)
- [x] T2.4 Test `require`/`import`/`describe` updated by the same sweep
- [x] T2.5 `.opencode/plugins/README.md` updated by the sweep
- [x] T2.6 Verified: `git diff --summary` shows `rename … (100%)`; all 12 plugins `node --check` pass; gate `phase 2` → CLEAN (898→0)

## Phase 3 — Shared cores + per-runtime scripts + registrations  ✅ DONE
- [x] T3.1 Banners + env constants updated in each `.opencode/hooks/<name>/` core (content sweep)
- [x] T3.2 References updated in `.claude/hooks/*`, `.codex/hooks/*`, `.cursor/hooks/*`, `.devin/hooks/*`. **Gap found+fixed in Phase 7:** the per-concern `opencode/` entry symlinks (`hooks/<c>/opencode/mk-*.js`) were content-invisible to `git grep` and survived the sweep.
- [x] T3.3 Registrations updated: `.claude/settings.json`, `.cursor/hooks.json`, codex install script, `.devin/hooks.json`
- [x] T3.4 Every registration path resolves to an existing script — verified (only unbuilt-`dist/` targets miss, which is environmental, not a rename break)

## Phase 4 — Env-var layer  ✅ DONE  (REQ-005; ADR-004 confirmed)
- [x] T4.0 ADR-004 confirmed: rename with permanent MK_ aliases; cross-cut → SYSTEM_
- [x] T4.1 `hook-flags.cjs`: per-concern `CONCERN_CANONICAL` + master alias + old `MK_*` in `LEGACY_ALIASES` (17/17 unit + integration pass)
- [x] T4.2 Forward alias shim `env-aliases.cjs` (bidirectional-safe: old config → new name) wired at hook-flags load (15/15 tests)
- [x] T4.3 Swept 237 files; `hook-flags.env`/configs/docs on new names; non-daemon `MK_` fully gone outside the 2 alias files
- [x] T4.4 Verified: old `MK_*` still disables (integration test); new names disable

## Phase 5 — Live daemon rename  [R] — RENAMES DONE, CUTOVER GATED  (REQ-007, 008, 010)
- [x] T5.0 Operator go-ahead: "now, gated at cutover"
- [x] T5.1 Socket-length check: longest `/tmp/system-*` path ~41 chars « 104 (REQ-010 PASS)
- [x] T5.2 Server keys renamed in `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, **`.cursor/mcp.json`** (all JSON re-parsed valid; TOML intact)
- [x] T5.3 `git mv` 2 launchers + 3 bridges + 2 plugins + 2 tests + 1 vitest; references swept
- [x] T5.4 Socket dirs + `HF_EMBED_SERVER_URL`/`SPECKIT_IPC_SOCKET_DIR` → `/tmp/system-*`
- [x] T5.5 Internal `code-index`/`code-graph`/`hf-embed`/`reranker` tokens renamed
- [x] T5.6 `mcp__mk_*__` → `mcp__system_*__` swept; **0 `mcp__mk_` left**; `.gitignore` lock refs updated
- [ ] T5.7 **CUTOVER (deferred to operator)**: on merge, next session re-spawns daemons on `/tmp/system-*`; verify MCP handshake + 1 tool call. No live restart done in-session (would disturb the running session).
- [ ] T5.8 Verify each `mcp__system_*__` agent allowlist resolves post-cutover (REQ-008)

## Phase 6 — Active docs + final verification  ✅ DONE  (REQ-003, 006; SC-001..005)
- [x] T6.1 Swept `AGENTS.md`, `CLAUDE.md` copies, `README.md` files, owning-skill `SKILL.md`
- [x] T6.2 `verify-no-mk.sh all` → CLEAN (content + symlink); delta 2443 → 0
- [x] T6.3 No `specs/**` path in the diff outside this packet (REQ-006)
- [x] T6.4 Moved plugin/test/launcher files show `R` history; retargeted symlinks are delete+add by nature
- [ ] T6.5 **On `main` post-merge**: `validate.sh … --strict` (Exit 0); full plugin/advisor vitest green; `generate-context.js` + graph-metadata backfill; memory reindex

## Phase 7 — Post-sweep correctness audit remediation  ✅ DONE
> Independent Composer 2.5 diff audit (cli-cursor `ask` mode) over the 617-file diff, targeting blind-sed failures a token grep can't see. Each finding verified against code before fixing; fixes are additive (no canonical name changed).
- [x] T7.1 **P0** skill-advisor plugin gating — `SYSTEM_SKILL_ADVISOR_HOOK/PLUGIN_DISABLED` added to `LEGACY_ALIASES['skill-advisor']`
- [x] T7.2 **P0** bridge disable — `advisorDisabledByEnv()` honors both the contract `SPECKIT_…` and exported `SYSTEM_…`; contract + 8 dependent tests untouched
- [x] T7.3 **P1** resolver — `hook-flags.test.cjs` 4 failing assertions fixed → 13/13; goal-core 49/49, goal-pi 21/21
- [x] T7.4 **P1** example-doc + completion + spec-memory + dispatch names now resolve via aliases
- [x] T7.5 **Note** 15 stale `mk-*.js` `opencode/` entry symlinks renamed + retargeted; `verify-no-mk.sh` hardened to scan symlink name/target
- [x] T7.6 Regression sweep: zero `AssertionError` across `.opencode/plugins/tests/` (remaining failures are env-only `@opencode-ai/plugin`/`dist` absence)
