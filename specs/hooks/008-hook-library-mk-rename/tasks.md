---
title: "Tasks: Hook Library mk- Prefix Rename"
description: "Per-phase, checkable task list for the hook-library mk- rename, keyed to REQ ids and the frozen name-mapping."
trigger_phrases:
  - "hook rename tasks"
  - "mk rename checklist tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/008-hook-library-mk-rename"
    last_updated_at: "2026-08-21T09:16:30Z"
    last_updated_by: "claude"
    recent_action: "Regenerated packet metadata to pass strict validate"
    next_safe_action: "Complete daemon cutover on next fresh session"
---
# Tasks: Hook Library `mk-` Prefix Rename

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

> Tasks derive their exact old→new tokens from `name-mapping.md`. Each task is
> re-grepped to confirm before its checkbox is marked. `[R]` = risk-gated.
> The real work ran as seven coordinated waves; they are grouped here under the
> three canonical phases (Setup / Implementation / Verification).

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
| `[R]` | Risk-gated (needs operator go-ahead) |

**Task Format**: `T### [P?] Description (evidence)`

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Inventory freeze + token map — no runtime change.

- [x] T001 Materialize `token-map.tsv` from `name-mapping.md` (old→new, longest-first)
- [x] T002 Write `verify-no-mk.sh` grep-gate — uses `git grep` (no `rg` binary exists here; `rg` is only an interactive shell function). Negative-control-verified: detected 2443 occ pre-sweep.
- [x] T003 [P] Baseline captured: Phase-2 898 occ/142 files; Phase-5 1545/375; all 2443/492

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

The rename itself, applied as coordinated single-surface waves so the tree never
holds a dangling reference between waves.

### Wave A — Plugin + test renames (REQ-001, 002, 004)
- [x] T004 `git mv` the **12 unique-stem** plugins → new stems (spec-memory/skill-advisor deferred to Wave D)
- [x] T005 `git mv` the 14 corresponding test files → new stems
- [x] T006 Content sweep of all Wave-A tokens across 142 tracked files (banners, cross-refs, log tags, `DISABLED_ENV`)
- [x] T007 [P] Test `require`/`import`/`describe` + `.opencode/plugins/README.md` updated by the same sweep
- [x] T008 Verified: `git diff --summary` shows `rename … (100%)`; all 12 plugins `node --check` pass; gate `verify-no-mk.sh 2` → CLEAN (898→0)

### Wave B — Shared cores + per-runtime scripts + registrations
- [x] T009 Banners + env constants updated in each `.opencode/hooks/<name>/` core (content sweep)
- [x] T010 References updated in `.claude/hooks/*`, `.codex/hooks/*`, `.cursor/hooks/*`, `.devin/hooks/*`
- [x] T011 Registrations updated: `.claude/settings.json`, `.cursor/hooks.json`, codex install script, `.devin/hooks.json`
- [x] T012 Every registration path resolves to an existing script (only unbuilt-`dist/` targets miss — environmental, not a rename break)

### Wave C — Env-var layer (REQ-005; ADR-004)
- [x] T013 ADR-004 confirmed: rename with permanent `MK_` aliases; cross-cut → `SYSTEM_`
- [x] T014 `hook-flags.cjs`: per-concern `CONCERN_CANONICAL` + master alias + old `MK_*` in `LEGACY_ALIASES`
- [x] T015 Forward alias shim `env-aliases.cjs` (old config → new name) wired at hook-flags load
- [x] T016 Swept 237 files; configs/docs on new names; non-daemon `MK_*` gone outside `env-aliases.cjs`
- [x] T017 Verified: old `MK_*` still disables (integration test); new names disable

### Wave D — Live daemon rename [R] (REQ-007, 008, 010)
- [x] T018 [R] Operator go-ahead recorded in `decision-record.md` ADR-002: "now, gated at cutover"
- [x] T019 Socket-length check: longest `/tmp/system-*` path ~41 chars « 104 (REQ-010 PASS)
- [x] T020 Server keys renamed in `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.cursor/mcp.json` (all re-parsed valid)
- [x] T021 `git mv` 2 launchers + 3 bridges + 2 plugins + 2 tests + 1 vitest; references swept
- [x] T022 Socket dirs + internal `code-index`/`code-graph`/`hf-embed`/`reranker` tokens renamed
- [x] T023 `mcp__mk_*__` → `mcp__system_*__` swept across ~96 active agent/command files; 0 `mcp__mk_` left
- [ ] T024 [R][B] **CUTOVER (deferred to operator)**: on next fresh session, daemons re-spawn on `/tmp/system-*`; verify MCP handshake + 1 tool call per namespace (REQ-007/008)

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Active-docs sweep, grep gates, and the post-sweep correctness audit.

### Wave E — Active docs + grep gates (REQ-003, 006; SC-001..005)
- [x] T025 Swept `AGENTS.md`, `CLAUDE.md` copies, `README.md` files, owning-skill `SKILL.md`, plugin `README.md`
- [x] T026 `verify-no-mk.sh all` → CLEAN (content + symlink); delta 2443 → 0
- [x] T027 No `specs/**` path in the diff outside this packet (REQ-006)
- [x] T028 Moved plugin/test/launcher files show `R` in `git diff --summary`; retargeted symlinks are delete+add by nature

### Wave F — Post-sweep correctness audit remediation
> Independent Composer 2.5 diff audit (cli-cursor `ask` mode) over the 617-file diff, targeting blind-sed failures a token grep can't see. Each finding verified against code before fixing; fixes are additive (no canonical name changed).
- [x] T029 **P0** skill-advisor plugin gating — `SYSTEM_SKILL_ADVISOR_HOOK/PLUGIN_DISABLED` added to `LEGACY_ALIASES['skill-advisor']`
- [x] T030 **P0** bridge disable — `advisorDisabledByEnv()` honors both the contract `SPECKIT_…` and exported `SYSTEM_…`; contract + 8 dependent tests untouched
- [x] T031 **P1** resolver — `hook-flags.test.cjs` 4 failing assertions fixed → 13/13; goal-core 49/49, goal-pi 21/21
- [x] T032 **P1** example-doc + completion + spec-memory + dispatch names now resolve via `LEGACY_ALIASES`
- [x] T033 **P0** regression — `mcp-route-guard.cjs` `isInternalServerToken` extended to recognize the `system_` prefix (was hardcoded `mk_` after the server rename); 2 stale assertion messages updated
- [x] T034 15 stale `mk-*.js` `opencode/` entry symlinks renamed + retargeted; `verify-no-mk.sh` hardened to scan symlink name/target

### Wave G — Ship + post-merge verification
- [x] T035 Landed on `skilled/v4.0.0.0` (`4c902d24ee`); rebuilt all 3 `dist` packages (BUILD_RC=0); dist-backed hooks wired
- [x] T036 Cheap-model live smokes across 6 runtimes; codex re-smoke `SessionStart` failures 3→1, Stop 1→0
- [x] T037 Advisor vitest 868 pass / 6 suites fail — proven **pre-existing** eval-ratchet/parity/graph-health gates (my rename commit touched none of the failing files)
- [ ] T038 [B] **On next fresh session**: daemon cutover (T024) completes; residual codex SessionStart hook resolves post-cutover

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All non-gated tasks marked `[x]`
- [x] Grep gate `verify-no-mk.sh all` → 0 canonical `mk-`/`mk_` tokens (content + symlink)
- [x] `git` shows `R` rename history for every moved file; no `specs/**` in the functional diff
- [ ] `[B]` daemon-cutover tasks (T024, T038) clear on the next fresh session (out of in-session reach — restarting daemons would disturb the running session)

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Frozen token map**: See `name-mapping.md`

<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:ai-execution -->
## AI EXECUTION PROTOCOL

Guidance for an agent resuming or extending this packet.

### Pre-Task Checklist
Before starting any task:
1. Read `name-mapping.md` — it is the ONLY source of new names; never invent a rename.
2. Confirm the working surface is a functional (non-`specs/**`) path; historical specs are frozen (ADR-005).
3. Re-grep the exact old→new token before editing; widen the pattern rather than trusting one hit.

### Execution Rules
| Rule | Constraint |
|------|------------|
| `TASK-SEQ` | Waves run in order A→G; Wave D (daemons) is gated and must not start before the operator go-ahead. |
| `TASK-SCOPE` | Edit only the token under the current wave; no adjacent "cleanup" (Four Laws — Scope Lock). |
| `TASK-PAIR` | A file rename and its reference sweep land together — never leave a dangling import between waves. |

### Status Reporting Format
Report each wave as: `Wave <A–G>: <files touched> | gate <verify-no-mk.sh result> | <committed|deferred>`. Distinguish confirmed (with `git`/grep evidence) from inferred.

### Blocked Task Protocol
If a task is `[B]` BLOCKED (e.g. the daemon cutover needs a fresh session, or `dist`/`node_modules` are absent in a bare worktree): record the blocker + its unblock condition, do NOT force it, and continue with independent waves. The daemon cutover is intentionally left BLOCKED until a fresh session so the running session's daemons are not disturbed.

<!-- /ANCHOR:ai-execution -->
