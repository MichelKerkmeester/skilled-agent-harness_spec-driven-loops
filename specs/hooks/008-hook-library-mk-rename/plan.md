---
title: "Implementation Plan: Hook Library mk- Prefix Rename"
description: "Six-phase execution plan for the hook-library mk- rename: inventory, plugin+test renames, core/runtime alignment, env layer, gated live-daemon rename, and active-docs sweep, with verification and rollback."
trigger_phrases:
  - "hook rename plan"
  - "mk rename phases"
  - "daemon rename plan"
importance_tier: "high"
contextType: "general"
---
# Implementation Plan: Hook Library `mk-` Prefix Rename

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Nature** | Pure rename / refactor across 6 runtimes |
| **Workspace** | `.worktrees/024-hook-library-mk-rename` (bare — no deps) |
| **Toolchain** | `git mv` for renames; deterministic token sweep + `cli-cursor` Composer 2.5 for judgment-heavy reclassification |
| **Validation** | Deferred to `main` post-merge: `validate.sh --strict`, generators, memory reindex |
| **Source of truth** | `name-mapping.md` → materialized `token-map.tsv` |

### Overview
Execution proceeds in six phases. Phases 1–4 (inventory, plugin+test renames,
core/runtime alignment, env layer) are low-to-medium risk and reversible via
`git`. Phase 5 (live daemon rename) is **high-blast** — it touches running
sockets and the tool namespaces every agent depends on — so it is **gated behind
an explicit operator go-ahead** and carries a named rollback. Phase 6 sweeps
active docs and runs the final grep + validation gates.

The rename is applied as **coordinated waves**: each surface's file rename and its
reference updates land together, so the tree is never left with a dangling import
between phases.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Frozen `name-mapping.md` authored and reviewed
- [x] Scope boundary confirmed (library + 2 daemons; historical specs excluded)
- [x] Worktree created via sk-git allocator
- [ ] Operator go-ahead recorded for Phase 5 (daemon cutover)

### Definition of Done
- [ ] Every REQ-001..010 acceptance criterion met
- [ ] Grep gate: 0 canonical `mk-`/`mk_`/`MK_` tokens in functional surfaces
- [ ] `git` shows `R` (rename) history for every moved file
- [ ] No `specs/**` path in the diff
- [ ] `validate.sh --strict` Exit 0 on `main`
- [ ] Plugin test suite green on `main`; both daemons respond over renamed sockets

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Surfaces (the "what" of the rename)
```
┌─ .opencode/plugins/mk-*.js  (14 adapters)  ── carry new identity ──┐
│  └─ .opencode/plugins/tests/mk-*.test.cjs  (16)                    │
├─ .opencode/hooks/<name>/    (runtime-neutral cores) ── stems kept, │
│  .claude|.codex|.cursor|.devin/hooks/*      internals updated ─────┤
├─ MK_* env namespace  ── new canonical + permanent MK_ alias ───────┤
├─ LIVE DAEMONS (gated):                                             │
│  opencode.json / .claude/mcp.json / .codex/config.toml  server keys│
│  .opencode/bin/*-launcher.cjs, plugin-bridges/*-bridge.mjs         │
│  /tmp/mk-* sockets, mcp__mk_*__ namespaces (~96 agent/cmd files)   │
└─ Active docs: AGENTS.md, CLAUDE.md×N, README×N, SKILL.md ──────────┘
```

### Tooling model
- **File renames**: `git mv` only (preserves history — REQ-004).
- **Reference sweep**: derive `token-map.tsv` from `name-mapping.md`; apply
  longest-token-first replacement to avoid prefix collisions (`mk-spec-memory-launcher`
  before `mk-spec-memory`). Restrict to non-`specs/**`, non-vendored paths.
- **Judgment cases** (live vs prose vs already-correct): dispatch to
  `cli-cursor` Composer 2.5 at highest thinking per operator instruction, then
  re-grep to confirm.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Inventory freeze + token map (no runtime change)
- [x] Full categorized inventory captured (this packet's discovery)
- [ ] Materialize `token-map.tsv` (old<TAB>new, longest-first) from `name-mapping.md`
- [ ] Write the grep-gate script (`verify-no-mk.sh`) that later phases must pass
- **Risk**: none (authoring only). **Reversible**: n/a.

### Phase 2: Plugin + test file renames (coordinated wave)
- [ ] `git mv` the **12 unique-stem** plugin files + their test files to new stems
  — all except `mk-spec-memory.js` and `mk-skill-advisor.js`, whose stems are
  identical strings to their live daemon keys, so they ride Phase 5 (a blanket
  replace can't separate the plugin ref from the `"mk-spec-memory"` server key)
- [ ] Update each plugin's COMPONENT banner, self-references, cross-plugin references, and `DISABLED_ENV` constant
- [ ] Update test `require()`/`import` paths and describe labels
- [ ] Update `.opencode/plugins/README.md`
- [ ] Gate: `verify-no-mk.sh 2` → CLEAN (baseline 898 occ / 142 files → 0)
- **Risk**: low. **Reversible**: `git`. **Gate**: plugins parse; tests reference resolves.

### Phase 3: Shared cores + per-runtime scripts + registrations
- [ ] Update core banners + env constants in `.opencode/hooks/<name>/`
- [ ] Align `.claude/hooks`, `.codex/hooks`, `.cursor/hooks`, `.devin/hooks` references
- [ ] Update registrations: `.claude/settings.json`, `.cursor/hooks.json`, codex install script, `.devin/hooks.json`
- **Risk**: medium (5 runtimes). **Reversible**: `git`. **Gate**: registrations point to existing scripts.

### Phase 4: Env-var layer (ADR-004 — resolve operator veto first)
- [ ] Add new canonical names + wire every old `MK_*` as alias (`LEGACY_ALIASES` + `readEnv` helper)
- [ ] Update `hook-flags.env` / `.example`, configs, and read sites
- **Risk**: medium (operator-facing config). **Reversible**: `git` + aliases mean no runtime break either way.
- **GATE**: confirm ADR-004 (rename vs keep `MK_`) before executing.

### Phase 5: Live daemon rename — HIGH-BLAST, GATED
- [ ] **STOP: obtain explicit operator go-ahead + name rollback before starting**
- [ ] `git mv` the `mk-spec-memory.js` / `mk-skill-advisor.js` **plugin files + tests** here (stems shared with the daemon keys)
- [ ] Rename server keys (`opencode.json`, `.claude/mcp.json`, `.codex/config.toml`)
- [ ] `git mv` launchers + bridges; update all references
- [ ] Rename socket dirs; **verify longest path < 104 chars (REQ-010)** before cutover
- [ ] Rename internal `code-index`/`code-graph`/`hf-embed`/`reranker` tokens
- [ ] Update `mcp__mk_*__` → `mcp__system_*__` across ~96 active agent/command files (4 runtimes)
- [ ] Cutover: stop old daemons, start on new sockets, verify MCP handshake + a tool call
- **Risk**: HIGH. **Reversible**: `git revert` + restart on old sockets (rollback §7).

### Phase 6: Active docs + final verification
- [ ] Sweep `AGENTS.md`, `CLAUDE.md` (all runtime copies), `README.md` files, owning-skill `SKILL.md`
- [ ] Run `verify-no-mk.sh` → 0 canonical tokens in functional surfaces
- [ ] Confirm no `specs/**` in diff; confirm `R` rename history
- [ ] **On `main` post-merge**: `validate.sh --strict`, plugin tests, generators, memory reindex

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method | Gate |
|-----------|-------|--------|------|
| Grep gate | All functional surfaces | `verify-no-mk.sh` (0 canonical tokens) | Blocking |
| Rename history | Every moved file | `git diff --summary` shows `rename` | Blocking |
| Plugin unit | `.opencode/plugins/tests` | Node test runner (on `main`) | Blocking |
| Daemon smoke | spec-memory + skill-advisor | Fresh start + MCP handshake + 1 tool call | Blocking (Phase 5) |
| Agent allowlist | `mcp__system_*__` refs | Cross-check each namespace resolves | Blocking (Phase 5) |
| Strict validate | This packet | `validate.sh --strict` on `main` | Blocking |
| Scope containment | Whole diff | no `specs/**` path present | Blocking |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `name-mapping.md` frozen | Internal | Green | No source of truth for edits |
| Operator go-ahead (Phase 5) | External | Pending | Daemon rename cannot start |
| ADR-004 resolution | External | Pending | Phase 4 blocked (only) |
| `main` post-merge deps | Internal | Green | Cannot validate/generate in worktree |
| `cli-cursor` Composer 2.5 | Tool | Green | Fall back to manual reclassification |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any daemon fails to bind renamed socket; agent tool-calls fail to resolve; tests regress.
- **Phases 1–4/6 (files, refs, env, docs)**: `git revert` the phase commit(s); working tree returns to `mk-` names. No runtime state to unwind (env aliases keep both names live).
- **Phase 5 (daemons)**:
  1. **Immediate**: revert the daemon-rename commit(s) so configs point back to `mk-*` keys/sockets/launchers.
  2. **Restart**: stop any daemon bound to `/tmp/system-*`, restart on `/tmp/mk-*`.
  3. **Verify**: MCP handshake succeeds; a `mcp__mk_spec_memory__*` tool call resolves.
  4. **Caches**: clear any warm-session pointer to the new socket.
- **Data**: none — no schema/data migration; DBs are path-addressed and unchanged.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (map) ──> Phase 2 (plugins+tests) ──> Phase 3 (cores+runtimes) ──┐
                                              Phase 4 (env, ADR-004) ─────┤
                                              Phase 5 (daemons, GATED) ───┴──> Phase 6 (docs+verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 Map | Discovery | All |
| 2 Plugins | 1 | 3, 6 |
| 3 Cores/runtimes | 2 | 6 |
| 4 Env | 1 (+ADR-004) | 6 |
| 5 Daemons | 1 (+operator go-ahead) | 6 |
| 6 Docs/verify | 2,3,4,5 | None |

<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Notes |
|-------|------------|-------|
| 1 Map | Low | authoring + one script |
| 2 Plugins+tests | Medium | 30 file renames + banners/requires |
| 3 Cores/runtimes | Medium | 5-runtime alignment |
| 4 Env | Medium | alias wiring + read sites |
| 5 Daemons | High | gated; sockets + 96 agent files + cutover |
| 6 Docs/verify | Medium | doc sweep + gates |

<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l3-adr-summary -->
## L3: ARCHITECTURE DECISION SUMMARY

See `decision-record.md`:

| ADR | Decision | Rationale |
|-----|----------|-----------|
| ADR-001 | Include the 2 live daemons in the rename | Operator selected full-convention change |
| ADR-002 | Gate + stage the daemon rename (Phase 5) | Live sockets + 96 agent files = high blast radius |
| ADR-003 | Keep shared-core dir stems; rename only adapters | Cores are runtime-neutral + already unprefixed |
| ADR-004 | Env vars renamed with permanent `MK_` aliases | Consistency without breaking operator config (veto-able) |
| ADR-005 | Leave historical `specs/**` untouched | 95% of hits are an accurate record; rewriting risks spec metadata |
| ADR-006 | Defer validate/generate/reindex to `main` | Bare worktree lacks deps (sk-git ALWAYS #8) |

<!-- /ANCHOR:l3-adr-summary -->
