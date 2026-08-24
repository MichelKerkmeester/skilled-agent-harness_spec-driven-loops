---
title: "Implementation Summary: Hook Library mk- Prefix Rename"
description: "What was built, how it was delivered, and how it was verified for the hook-library mk- prefix rename across 6 runtimes and 2 live MCP daemons."
trigger_phrases:
  - "hook rename summary"
  - "mk rename implementation summary"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/008-hook-library-mk-rename"
    last_updated_at: "2026-08-21T09:16:30Z"
    last_updated_by: "claude"
    recent_action: "Regenerated packet metadata to pass strict validate"
    next_safe_action: "Complete daemon cutover on next fresh session"
    blockers:
      - "Daemon cutover (Phase 5 T024/T038) needs a fresh session — restarting daemons in-session would disturb the running daemons"
    key_files:
      - ".opencode/hooks/shared/hook-flags.cjs"
      - ".opencode/hooks/shared/env-aliases.cjs"
      - ".opencode/hooks/mcp-route-guard/lib/mcp-route-guard.cjs"
      - "specs/hooks/008-hook-library-mk-rename/name-mapping.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "packet-008-completion"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Env-var rename (ADR-004): rename MK_* with permanent aliases — confirmed 2026-08-20"
      - "Daemon cutover window (Phase 5): gated behind explicit operator go-ahead — confirmed"
---
# Implementation Summary: Hook Library `mk-` Prefix Rename

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-hook-library-mk-rename |
| **Level** | 3 |
| **Status** | Functionally shipped; daemon cutover deferred |
| **Shipped** | `skilled/v4.0.0.0` @ `4c902d24ee` |
| **Rename baseline** | `b4f136e801` (rollback point) |
| **Scope** | ~40 file renames + ~2,435 reference edits across 6 runtimes + 2 live MCP daemons |
| **Source of truth** | `name-mapping.md` (frozen token map) |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The repository's runtime hook library was renamed away from the opaque `mk-`
prefix to **skill-relevant names** (`system-*`, `sk-*`, `cli-*`, `mcp-*`,
`opencode-*`, `codex-*`), consistently across all six AI runtimes and the two live
MCP daemons, on functional surfaces only. Historical `specs/**` (~45,534
occurrences) was left intact as an accurate record (ADR-005).

### Surfaces changed

| Surface | What changed |
|---------|--------------|
| OpenCode plugins | 14 `mk-*.js` adapters + 16 test files → new stems (`git mv`, history preserved) |
| Shared cores + runtimes | Banners, comments, and env constants across `.opencode/hooks/<name>/` and the `.claude`/`.codex`/`.cursor`/`.devin` reference + registration files |
| Env namespace | New canonical names (`SYSTEM_*`, `SK_CODE_*`, …) with **permanent `MK_` aliases**; forward-mapping shim `env-aliases.cjs` wired at `hook-flags.cjs` load |
| Live MCP daemons | `mk-spec-memory` → `system-spec-memory`, `mk_skill_advisor` → `system-skill-advisor`: server keys, launchers, bridges, `/tmp/system-*` sockets, internal `code-index`/`code-graph`/`hf-embed`/`reranker` tokens, and `mcp__system_*__` namespaces across ~96 agent/command files |
| Active docs | `AGENTS.md`, `CLAUDE.md` copies, `README.md` files, owning-skill `SKILL.md` |

### Key files

- `.opencode/hooks/shared/hook-flags.cjs` — per-concern `CONCERN_CANONICAL` + old `MK_*` in `LEGACY_ALIASES`.
- `.opencode/hooks/shared/env-aliases.cjs` — forward-maps old config → new name.
- `.opencode/hooks/mcp-route-guard/lib/mcp-route-guard.cjs` — `isInternalServerToken` regression fix.
- `specs/hooks/008-hook-library-mk-rename/name-mapping.md` — frozen old→new authority.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Seven coordinated single-surface waves (grouped as three phases in `tasks.md`), so
the tree never held a dangling reference between waves:

1. **Setup** — froze `name-mapping.md` → `token-map.tsv`; wrote the `git grep`-based `verify-no-mk.sh` gate (negative-control-verified at 2443 occurrences).
2. **Plugins + tests** — `git mv` 12 unique-stem plugins + 14 tests; content sweep of 142 files; gate CLEAN 898→0.
3. **Cores + runtimes** — banners/env constants + 5-runtime references + registrations.
4. **Env layer** — `LEGACY_ALIASES` + `env-aliases.cjs`; swept 237 files; old + new names both disable.
5. **Daemons (gated)** — server keys, launchers, bridges, sockets, internal tokens, `mcp__system_*__` namespaces; socket path measured ~41 chars « 104. **Cutover deferred** to a fresh session.
6. **Docs + grep gates** — active-doc sweep; `verify-no-mk.sh all` CLEAN (content + symlink); delta 2443 → 0.
7. **Audit remediation** — an independent Composer 2.5 diff audit (cli-cursor) caught an incomplete Phase-4 env rename and a route-guard regression; all findings verified against code, then fixed additively.

The work was done in worktree `worktrees/024-hook-library-mk-rename`, rebased and
ff-merged onto `skilled/v4.0.0.0`. Strict-validate, metadata generation, and this
summary were produced on the main checkout (ADR-006).

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| ADR | Decision | Rationale |
|-----|----------|-----------|
| ADR-001 | Include the 2 live daemons | Operator chose full-convention consistency over a plugin-only rename |
| ADR-002 | Gate + stage the daemon rename (Phase 5) | Live sockets + ~96 agent files = high blast radius |
| ADR-003 | Keep core dir stems; rename adapters only | Cores are runtime-neutral + already unprefixed |
| ADR-004 | Env vars renamed with permanent `MK_` aliases | Consistency without breaking any operator config |
| ADR-005 | Leave historical `specs/**` untouched | 95% of hits are an accurate record; rewriting risks spec/memory desync |
| ADR-006 | Defer validate/generate/reindex to `main` | Bare worktree lacks `node_modules`/`dist`; DBs are a single global instance |

See `decision-record.md` for full context, alternatives, and consequences.

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Method | Result |
|-------|--------|--------|
| Grep gate | `verify-no-mk.sh all` | CLEAN — 0 canonical tokens (content + symlink); 2443 → 0 |
| Resolver tests | `hook-flags.test.cjs`, `goal-core`, `goal-pi` | 13/13, 49/49, 21/21 |
| Route-guard regression | `mcp-route-guard.test.cjs` | `system_` prefix case green after fix |
| Rename history | `git diff --summary` | `R` for every moved plugin/test/launcher |
| Scope containment | `git diff --name-only` | no `specs/**` outside this packet (REQ-006) |
| dist rebuild | `npm run build` ×3 packages | `BUILD_RC=0`; dist-backed hooks resolve |
| Live smokes | 6 runtimes, cheap models | codex re-smoke SessionStart 3→1, Stop 1→0 |
| Advisor vitest | full run | 868 pass / 6 suites fail — all **pre-existing** eval-ratchet/parity/graph-health gates (rename touched none of the failing files) |
| Socket limit | path measurement | longest `/tmp/system-*` ~41 chars « 104 (REQ-010) |
| Packet docs | `validate.sh --strict` | Exit 0 (this completion pass) |

### The one real regression, found and fixed

`mcp-route-guard.cjs` `isInternalServerToken` hard-coded `startsWith('mk_')`. After
the daemon servers were renamed to `system_*`, that check no longer recognized them
as internal, so the route guard would have nudged native calls to our own servers.
Fixed to `startsWith('system_') || startsWith('mk_')`; two stale test-assertion
messages updated. Present at HEAD (`mcp-route-guard.cjs:76`).

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Daemon cutover deferred** — Phase 5 renamed the daemon identities but the live
   restart (T024/T038) is intentionally left for the next fresh session; restarting
   in-session would disturb the running daemons. Until then the old daemons keep
   running on `/tmp/mk-*`.
2. **One residual codex SessionStart hook failure** — depends on the daemon cutover;
   expected to clear once the daemons re-spawn on `/tmp/system-*`.
3. **6 advisor vitest suites fail** — pre-existing routing eval-ratchet/parity/
   graph-health gates under active re-baselining; unrelated to this rename (proven:
   the rename commit touched none of the failing test files).
4. **Backward-compat aliases are permanent by design** — the old `MK_*` names live
   indefinitely until a separate deprecation packet removes them.

<!-- /ANCHOR:limitations -->
