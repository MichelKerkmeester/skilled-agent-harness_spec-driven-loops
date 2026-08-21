---
title: "Feature Specification: Hook Library mk- Prefix Rename"
description: "Rename the repo hook library away from the mk- prefix to skill-relevant names, across plugins, cores, per-runtime scripts, the two live MCP daemons, env flags, and active docs — without touching historical spec docs."
trigger_phrases:
  - "hook library rename"
  - "mk prefix rename"
  - "plugin rename"
  - "mk to system"
  - "daemon rename"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: Hook Library `mk-` Prefix Rename

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

The repository's runtime hook library is prefixed `mk-` across 14 OpenCode plugin
files, their tests, shared cores, per-runtime scripts, two live MCP daemons, and
a large `MK_*` env namespace. The prefix is opaque. This packet renames the
library to **skill-relevant names** (`system-*`, `sk-*`, `cli-*`, `mcp-*`,
`opencode-*`, `codex-*`) so each hook reads as the concern or skill it serves.

The rename spans **functional surfaces only**: ~2,435 live references
(code/config/agents/active-docs). The ~45,534 historical `specs/**` references
are an accurate record of past work and are **explicitly out of scope**.

**Key decisions**: full-convention change including the two live MCP daemons
(operator-selected); daemons deliberately carried `mk-` from prior rename packets,
so their rename is gated and staged (ADR-001, ADR-002); env vars renamed with
**permanent `MK_` aliases** so no operator config breaks (ADR-004).

**Critical dependencies**: bare worktree lacks `node_modules`/`dist`, so
strict-validate, metadata generation, and memory reindex run on `main`
post-merge (sk-git large-reorg rule).

<!-- /ANCHOR:executive-summary -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Planning |
| **Created** | 2026-08-20 |
| **Branch** | `worktrees/024-hook-library-mk-rename` |
| **Worktree** | `.worktrees/024-hook-library-mk-rename` |
| **Estimated scope** | ~40 file renames + ~2,435 reference edits across 6 runtimes |
| **Source of truth** | `name-mapping.md` (frozen token map) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every runtime hook entry point is named `mk-<concern>` (e.g. `mk-post-edit-quality.js`,
`mk-deep-loop-guard.js`). The `mk-` prefix carries no meaning to a reader and does
not connect a hook to the skill or subsystem that owns it. The two live MCP
daemons (`mk-spec-memory`, `mk_skill_advisor`) and a wide `MK_*` env namespace
share the same opaque prefix.

### Purpose
Rename the hook library to names that state each hook's owning skill or concern,
consistently across all six runtimes, without rewriting the historical spec
record and without breaking any live daemon, installed hook, or operator config.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 14 OpenCode plugin files + 16 plugin test files (`.opencode/plugins/**`).
- Shared hook-core internals (`.opencode/hooks/<name>/`) — banner/comment/env-constant updates.
- Per-runtime hook scripts + registrations: `.claude/settings.json`, `.cursor/hooks.json`, codex install path, `.devin/hooks`.
- The two live MCP daemons: server keys, launchers, bridges, socket dirs, internal `code-index`/`code-graph`/`hf-embed`/`reranker` tokens, and `mcp__mk_*__` tool namespaces across ~96 active agent/command files.
- `MK_*` env vars → new canonical names **with permanent `MK_` aliases**.
- Active authoritative docs: `AGENTS.md`, `CLAUDE.md` (all runtime copies), `README.md` files, owning-skill `SKILL.md`, plugin `README.md`.
- All non-`specs/**` references to any renamed token.

### Out of Scope
- **Historical `specs/**` docs and past packet folder names** (~45,534 occurrences) — accurate record, left as-is.
- `.worktrees/*` sibling copies; `barter/ai-speckit/coder/` subproject.
- `node_modules/`, `dist/` outputs (regenerated on `main`).
- Any behavior change to a hook, daemon, or tool — this is a **pure rename**.

### Files to Change
See `name-mapping.md` for the complete frozen table. Summary of rename-target
files (the reference edits are enumerated per phase in `tasks.md`):

| Group | Count | Path |
|-------|-------|------|
| Plugin files | 14 | `.opencode/plugins/mk-*.js` |
| Plugin tests | 16 | `.opencode/plugins/tests/mk-*.test.cjs` |
| Launchers | 2 | `.opencode/bin/mk-*-launcher.cjs` |
| Bridges | 2–3 | `…/mcp-server/plugin-bridges/mk-*-bridge.mjs` |
| Daemon server keys | 2 | `opencode.json`, `.claude/mcp.json`, `.codex/config.toml` |
| Skill validation docs | 2 | `…/system-deep-loop/**/mk-deep-loop-guard.md` |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every plugin file renamed per `name-mapping.md` | `rg --files .opencode/plugins` shows only new stems; no `mk-*.js` remains |
| REQ-002 | Plugins still load in OpenCode after rename | Plugin export contracts unchanged; import/require paths resolve |
| REQ-003 | All non-spec references updated to new tokens | `rg 'mk-<token>' <non-spec>` returns 0 for every renamed token |
| REQ-004 | `git mv` preserves rename history | `git status` shows `R` (rename), not delete+add, for every moved file |
| REQ-005 | No operator config breaks | Every old `MK_*` env name honored as alias; old socket/daemon fallbacks documented |
| REQ-006 | Historical `specs/**` untouched | `git diff --name-only` contains no `specs/**` path |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Daemons boot on renamed sockets/keys | Fresh daemon start binds new `/tmp/system-*` sockets; MCP handshake succeeds |
| REQ-008 | Agent tool allowlists resolve | Every `mcp__system_*__` namespace in agent defs matches a live tool |
| REQ-009 | Tests pass for renamed plugins | `.opencode/plugins/tests` suite green on `main` post-merge |
| REQ-010 | Socket paths stay under macOS `sun_path` 104-char limit | Longest `/tmp/system-*` socket path measured < 104 |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Zero `mk-`/`mk_`/`MK_` (canonical) tokens remain in functional surfaces (grep gate passes, `MK_` aliases excepted).
- **SC-002**: `validate.sh specs/hooks/008-hook-library-mk-rename --strict` → Exit 0 (run on `main`).
- **SC-003**: OpenCode session loads all renamed plugins with no error; both daemons respond over renamed sockets.
- **SC-004**: `git log --follow` traces each renamed file through the rename.
- **SC-005**: No `specs/**` file appears in the packet diff.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Renaming live daemon sockets breaks a running daemon/warm session | Session loses spec-memory/advisor mid-work | Phase 5 gated; restart daemons at cutover; document rollback |
| Risk | Missed `mcp__mk_*__` reference in an agent def | Agent tool-call fails to resolve | Grep-gate every namespace to 0 before completion |
| Risk | Renamed env var read without alias | Operator's disable flag silently ignored | Permanent `MK_` alias for every var; dual-read helper |
| Risk | Socket path exceeds 104-char `sun_path` limit | Daemon fails to bind | REQ-010 measures longest path pre-cutover |
| Risk | Half-renamed state between phases | Broken import mid-migration | File rename + reference sweep done as one coordinated wave per surface |
| Dependency | `node_modules`/`dist` absent in worktree | Cannot validate/generate here | Defer to `main` post-merge (sk-git ALWAYS #8) |
| Dependency | Prior daemon-rename packets chose `mk-` deliberately | Reversing an intentional choice | ADR-001 records why the operator reversed it now |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Pure rename — no hook/daemon behavior changes. Same inputs → same outputs.
- **NFR-R02**: Fail-open preserved: renamed hooks keep their fail-open/kill-switch semantics.
- **NFR-R03**: Backward compatibility: every old `MK_*` name and old socket/daemon identity honored until an explicit deprecation packet removes them.

### Maintainability
- **NFR-M01**: Each renamed hook name states its owning skill or concern.
- **NFR-M02**: The frozen `name-mapping.md` is the only source of new names; no ad-hoc renames.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **`mk` as a substring of an unrelated word** (e.g. `bookmark`, `mktemp`): the sweep matches only anchored tokens `mk-<kebab>`, `mk_<snake>`, `MK_<SCREAM>`, and the specific daemon/tool strings — never a bare `mk`.
- **Cross-plugin references**: `mk-post-edit-quality.js` comments reference `mk-dist-freshness-guard.js`; both stems must update together.
- **Hyphen vs underscore daemon keys**: `mk-spec-memory` (hyphen) and `mk_skill_advisor` (underscore) coexist in configs; the map covers both separator forms.
- **Tool namespace derivation**: OpenCode derives `mcp__<key-with-underscores>__` from the server key; renaming the key changes the namespace, so agent allowlists must change in lockstep.
- **Env var read sites**: some `MK_*` vars are read via `process.env.MK_*` directly (not through hook-flags); those need the dual-read helper, not just `LEGACY_ALIASES`.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:risk-matrix -->
## 9. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Live daemon socket rename breaks active sessions | H | M | Gate Phase 5; cutover + restart; documented rollback |
| R-002 | Missed tool-namespace ref in an agent def | H | M | Grep-gate to 0 across all runtimes |
| R-003 | Env alias omission silently disables/enables a hook | M | M | Permanent aliases + dual-read + test |
| R-004 | Socket path > 104 chars | H | L | Measure pre-cutover (REQ-010) |
| R-005 | Accidental `specs/**` edit | L | L | Diff-gate excludes `specs/**` (REQ-006) |
| R-006 | Rename recorded as delete+add, losing history | M | L | Verify `R` status post-`git mv` (REQ-004) |

<!-- /ANCHOR:risk-matrix -->
---

<!-- ANCHOR:open-questions -->
## 10. OPEN QUESTIONS

- **Env-var rename (ADR-004)**: rename `MK_*` → new prefixes with permanent aliases, or keep `MK_` (unique, collision-safe namespace) untouched? **Recommendation: rename with permanent aliases; operator may veto before Phase 4 — non-blocking for Phases 1–3, 5.**
- **Daemon cutover window**: perform the daemon rename (Phase 5) in this packet, or split into a follow-up once Phases 1–4 land? **Recommendation: gate Phase 5 behind an explicit operator go-ahead at cutover time.**

<!-- /ANCHOR:open-questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Frozen token map**: `name-mapping.md`
- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Records**: `decision-record.md`

<!-- /ANCHOR:related-docs -->
