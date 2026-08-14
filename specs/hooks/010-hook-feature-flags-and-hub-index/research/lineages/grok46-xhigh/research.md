# Research Synthesis: Hook Feature-Flag Coverage and Hub Index

**Lineage:** grok46-xhigh (`cli-cursor` / `cursor-grok-4.6-xhigh`)
**Session:** `fanout-grok46-xhigh-1786683561232-gr1nay`
**Spec:** `specs/hooks/010-hook-feature-flags-and-hub-index`
**Stop reason:** `maxIterationsReached` (10/10; `stopPolicy: max-iterations`; convergence was telemetry only)
**Mode:** Report-only — no product implementation in this lineage.

---

## 1. Executive verdict

The shared guard `isHookEnabled(concern)` in `.opencode/hooks/shared/hook-flags.cjs` is the right disable UX and is already wired for the portable families plus several Phase-4 families (session-lifecycle including compiled `dist/`, git-preflight, spec-memory, goal via `goal-core`, OpenCode plugins for dispatch / post-edit-quality / task-dispatch / mcp-route-guard / spec-gate / skill-advisor / git-preflight). **It is not universal.**

Three problems remain:

1. **Call-site gaps** — unique canonical files that never call `isHookEnabled` (skill-advisor and spec-gate *discrete* adapters, completion-stop, sentinel, watchdog, dist-freshness plugin, session-cleanup, hook-install, directive-lifecycle, permission-policy, git pre-commit, warn-only shells).
2. **Parallel grammars** — `MK_*_DISABLED` + `isTruthy`, core `ENV === '1'`, and shells `SPECKIT_*_GUARD=off`. Master `MK_HOOKS_DISABLED` therefore cannot silence spec-gate discrete adapters, skill-advisor discrete adapters, or any shell.
3. **Docs overclaim and contradict** — hub README, per-concern READMEs, injection-contract, spec.md rollback, and a prior deep-review P1 list disagree with live code in both directions (some families now gated but still called pending; other READMEs claim gating that does not exist).

**Do not** invent per-adapter flags or a fourth hub doc. **Do** (a) route remaining entry points through `isHookEnabled`, (b) alias the live second grammars, (c) add a kill-switch matrix to `.opencode/hooks/README.md` and ENV-REFERENCE rows for the master switch.

The prior deep-review WS-1 plugin list (F003/F005/F014/F004 and OpenCode half of F015) is **stale** — those plugins now call `isHookEnabled`. Remaining work is discrete adapters, shells, completion-stop, and documentation.

---

## 2. Answers to key questions

### Q1 — Complete inventory, which entry points lack `isHookEnabled`?

140 adapter-like files under `.opencode/hooks` (tests/`node_modules` excluded). Most skill-owned paths are **symlinks**; gate the canonical target. Unique ungated (or not-via-`isHookEnabled`) targets are the Rank A/B tables in §3. [SOURCE: iteration-002 symlink census] [SOURCE: iteration-008]

### Q2 — Per-runtime adapter / dist wiring?

| Family | claude | codex | cursor | devin | opencode | pi |
|---|---|---|---|---|---|---|
| mcp-route-guard / dispatch / post-edit-quality / task-dispatch | wired | wired | wired (Cursor post-tool-use: dispatch flag only — §8) | wired | wired | wired |
| goal | n/a adapter | n/a | inherits via goal-core | n/a | wired | inherits via goal-core |
| session-lifecycle | source+dist wired | source+dist | source+dist | source+dist | n/a (plugins) | wired; **bundles 4 shells** |
| git-preflight | shared.mjs wired | shared | shared | shared | plugin wired | ts wired |
| spec-memory | folded into session-lifecycle | same | same | same | plugin wired | folded |
| skill-advisor | SPECKIT alias only | same | same | same | `isHookEnabled` | SPECKIT alias only |
| spec-gate | core `MK_SPEC_GATE_DISABLED==='1'` | same | same + prebind | same | `isHookEnabled` | core flag |
| completion | stop `.cjs` **unwired** | stop unwired | evidence **wired** | stop unwired | sentinel unwired; tool plugin legacy name | evidence **wired** |

Skill-advisor hub `.js` files are shims that spawn `mcp-server/dist/hooks/<rt>/user-prompt-submit.js` with no extra guard. [SOURCE: user-prompt-submit.js:16] [SOURCE: user-prompt-submit.ts:216]

### Q3 — Named special surfaces?

See Rank B in §3. Short form: worktree-guard and git-hooks-check have `SPECKIT_*_GUARD=off`; dist-freshness has rebuild switch only; session-cleanup, hook-install, watchdog, directive-lifecycle, permission-policy have no kill-switch; git pre-commit has only `// hygiene-ok`.

### Q4 — Easiest disable UX + spec-gate scoping?

Reuse `isHookEnabled`. One sentence for operators: `MK_HOOKS_DISABLED=1` silences the enforcement layer; `MK_<CONCERN>_DISABLED=1` silences one family (`isTruthy`: 1/true/yes/on). Absorb existing names as aliases. **Do not exempt spec-gate from master** — deny is already opt-in via `MK_SPEC_GATE_ENFORCE`. Route `spec-gate-core` through `isHookEnabled('spec-gate')`. Git pre-commit needs a new env off (only always-on denier). Details in §6–8.

### Q5 — Exact hub / README / injection-contract / coverage-rationale additions?

Kill-switch **matrix in hub README** (authority); extend injection-contract paragraph; pointer-only in coverage-rationale; truth-up per-concern READMEs (retract invented aliases); ENV-REFERENCE section for master + canonical flags. File-by-file list in §10.

---

## 3. Full gap inventory (unique canonical files)

### Rank A — Master cannot reach (inject or deny)

| Canonical file | Concern | Today | Effect |
|---|---|---|---|
| `system-skill-advisor/hooks/{claude,codex,cursor,devin}/user-prompt-submit.ts`, `hooks/pi/prompt-advisor.ts` (+ dist via shims) | skill-advisor | `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED==='1'` | inject |
| `system-spec-kit/mcp-server/hooks/**/spec-gate-{classify,enforce}.*`, `cursor/spec-gate-prebind.mjs`, `spec-gate-core.mjs` | spec-gate | `MK_SPEC_GATE_DISABLED==='1'` in core; no master; core ignores `SPECKIT_SPEC_GATE_DISABLED` | classify inject; enforce deny iff ENFORCE |
| `system-skill-advisor/hooks/claude/directive-lifecycle-boundary.ts` and spec-kit sibling | directive-lifecycle | none (DEDUP flags are not offs) | inject |
| `system-spec-kit/mcp-server/hooks/{claude,codex,devin}/completion-evidence-stop.cjs` | completion | none | inject/warn |
| `.opencode/plugins/mk-completion-sentinel.js` | completion | none | inject |
| `.opencode/plugins/mk-codex-hooks-watchdog.js` | codex-watchdog | none | poll/warn |
| `system-spec-kit/mcp-server/hooks/devin/permission-request-policy.mjs` | permission-policy | none (README claims `isHookEnabled`) | advise |

### Rank B — No `isHookEnabled`; warn / teardown / install / tool

| Canonical file | Concern | Today | Effect |
|---|---|---|---|
| `.opencode/bin/worktree-guard.sh` | worktree-guard | `SPECKIT_WORKTREE_GUARD=off` | warn |
| `.opencode/bin/check-git-hooks.sh` | git-hooks-check | `SPECKIT_GIT_HOOKS_GUARD=off` | warn |
| `sk-code/sk-code-quality/scripts/check-dist-staleness.sh` | dist-freshness | `SPECKIT_DIST_AUTO_REBUILD` only | warn + rebuild |
| `.opencode/plugins/mk-dist-freshness-guard.js` | dist-freshness | none | warn/rebuild |
| `.opencode/scripts/session-cleanup.sh`, `.opencode/plugins/session-cleanup.js` | session-cleanup | none | teardown |
| `.opencode/bin/install-codex-hooks.mjs` | hook-install | none | install/check |
| `.opencode/hooks/git/pre-commit` (live chain: `.opencode/scripts/git-hooks/pre-commit`) | git-commit-hooks | `// hygiene-ok` only | **deny** |
| `.opencode/plugins/mk-speckit-completion.js` + `completion-state.cjs` | completion | `MK_SPECKIT_COMPLETION_DISABLED==='1'` | tool |

### Rank C — Wired to the wrong concern or bundled

- Cursor `system-spec-kit/mcp-server/hooks/cursor/post-tool-use.mjs:103` — `isHookEnabled('dispatch')` only; `MK_POST_EDIT_QUALITY_DISABLED` does not skip Write post-edit; `MK_DISPATCH_DISABLED` skips both. [SOURCE: post-tool-use.mjs:100-129]
- Pi `session-start-advisories.ts:8-36` — worktree-guard, check-git-hooks, dist-staleness, install-codex-hooks all behind `isHookEnabled('session-lifecycle')`.

### Not gaps

Portable cores (mcp-route-guard, dispatch, post-edit-quality, task-dispatch except Rank C), goal via core, git-preflight, spec-memory plugin, session-lifecycle source **and** dist, OpenCode plugins: `mk-cli-dispatch-audit`, `mk-post-edit-quality`, `mk-deep-loop-guard`, `mk-goal`, `mk-spec-gate`, `mk-skill-advisor`, `mk-mcp-route-guard`, `mk-git-preflight-advisory`. Hub `lib/` files are not entry points.

---

## 4. Per-runtime adapter notes

- **OpenCode** plugins: 9/13 `mk-*.js` call `isHookEnabled`. Ungated: `mk-speckit-completion` (legacy name), `mk-dist-freshness-guard`, `mk-completion-sentinel`, `mk-codex-hooks-watchdog`. Plus non-`mk-` `session-cleanup.js`.
- **Claude / Codex / Devin:** discrete spec-gate + skill-advisor + completion-stop + shells. Advisor `.js` in the hub is a shim, not the implementation.
- **Cursor:** same plus multiplexed post-tool-use; completion-evidence **is** gated.
- **Pi:** advisor + spec-gate ungated to master; session-start-advisories coupling; completion-evidence gated; relative `../../.opencode/hooks/shared/hook-flags.mjs` import (review F016 — not re-tested here).

---

## 5. Named special surfaces

Covered in Rank B. Additional facts:

- Four hub runtime folders for worktree-guard / git-hooks-check / dist-freshness / session-cleanup / hook-install are **one canonical script** each. [SOURCE: iteration-002]
- `coverage-rationale.md` correctly explains *why folders are uneven*; it is not a kill-switch catalog. [SOURCE: coverage-rationale.md:20-36]
- Hub README coverage matrix claims dist-freshness on Claude–Devin is “OpenCode owns” while the Additional centralized hooks table lists the discrete `.sh` — fix the matrix. [SOURCE: README.md:182 vs 204]

---

## 6. Recommended disable UX

**Keep** the three-layer model in `hook-flags.cjs`:

1. Master `MK_HOOKS_DISABLED` (isTruthy)
2. Canonical `MK_<CONCERN>_DISABLED` via `concernFlag()` (hyphens → underscores)
3. `LEGACY_ALIASES` (do not break existing operator config)
4. Default on

**Do not** add per-adapter flags (operator-locked: per-concern-family). [SOURCE: spec.md:38]

**Absorb** into aliases + call sites:

| Live name | Maps to concern | Action |
|---|---|---|
| `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` (already in LEGACY_ALIASES) | skill-advisor | Call `isHookEnabled` from advisor TS (today the adapter checks the env itself, so master does not apply) |
| `SPECKIT_SPEC_GATE_DISABLED` (already in LEGACY_ALIASES) | spec-gate | Teach `spec-gate-core` via `isHookEnabled` (core currently ignores this alias) |
| `MK_SPEC_GATE_DISABLED` | spec-gate | Already canonical; keep as DISABLED_ENV but go through `isTruthy`/`isHookEnabled` |
| `SPECKIT_WORKTREE_GUARD=off` | worktree-guard | Alias; add bash helper or node `-e` preamble |
| `SPECKIT_GIT_HOOKS_GUARD=off` | git-hooks-check | Same |
| `MK_SPECKIT_COMPLETION_DISABLED` | completion | Already alias; switch plugin to `isHookEnabled` |
| `MK_COMPLETION_SENTINEL_DISABLED` | completion | Already alias; wire sentinel plugin |

**Do not alias** `SPECKIT_DIST_AUTO_REBUILD` as the dist-freshness kill-switch (rebuild vs skip-check).

**Truthy:** replace `=== '1'` in cores with `isTruthy` / `isHookEnabled` so `true|yes|on` work.

**Pi bundles:** each of the four `CHECKS` in `session-start-advisories.ts` should test `isHookEnabled` for *that* concern (and still honor script-level SPECKIT offs).

**Cursor proxy:** skip the whole proxy only if both concerns are disabled; gate Write vs Shell branches separately.

---

## 7. Alias table (live vs invented)

**Live in `LEGACY_ALIASES`:** goal←`MK_GOAL_PLUGIN_DISABLED`; dispatch←`MK_CLI_DISPATCH_AUDIT_DISABLED`; skill-advisor←four `*_SKILL_ADVISOR_{HOOK,PLUGIN}_DISABLED`; completion←`MK_COMPLETION_SENTINEL_DISABLED` / `MK_SPECKIT_COMPLETION_DISABLED`; spec-memory←`MK_SPEC_MEMORY_PLUGIN_DISABLED` / `SPECKIT_…`; spec-gate←`SPECKIT_SPEC_GATE_DISABLED`. [SOURCE: hook-flags.cjs:14-26]

**Invented in concern READMEs, not in LEGACY_ALIASES, not wired:** `MK_DIST_FRESHNESS_GUARD_DISABLED`, `MK_CODEX_HOOKS_WATCHDOG_DISABLED`. Do not document as live. Add to aliases only when the adapter actually calls `isHookEnabled`.

---

## 8. Hard blockers (spec-gate and git pre-commit)

**spec-gate** already has two levers: `MK_SPEC_GATE_DISABLED` (full no-op in core) and `MK_SPEC_GATE_ENFORCE` (deny opt-in, default off). Child sessions no-op via `AI_SESSION_CHILD=1`. Recommendation: wire core to `isHookEnabled('spec-gate')` so **master works**; keep ENFORCE as the deny opt-in. Do **not** exempt spec-gate from master — that would break “one switch.” Discrete adapters already go through core, so one core change covers classify/enforce/prebind. OpenCode plugin is already on `isHookEnabled`. [SOURCE: spec-gate-core.mjs:67-69,1400]

**git pre-commit** always blocks on hygiene (exit 1) with only `// hygiene-ok`. Recommend `MK_GIT_COMMIT_HOOKS_DISABLED` (and master) as an emergency escape, documented as such, default on. This is the only always-on denier without an env off. [SOURCE: .opencode/hooks/git/pre-commit:29-35]

Warn-only shells are not hard blockers; their offs can be aggressive.

---

## 9. Hub documentation wiring (what is wrong today)

| File | Claim | Live |
|---|---|---|
| README.md:32 | session-lifecycle / git-preflight / spec-memory still Phase 4 ungated | Those families **are** wired |
| README.md:32 | remaining = those three + non-OpenCode advisor/gate | Omits shells, plugins, completion-stop, directive-lifecycle, permission-policy, git commit |
| README.md:45 | skill-owned index entries honor `isHookEnabled` | False for discrete spec-gate/advisor, completion-stop, directive-lifecycle |
| README.md:182 | dist-freshness Claude–Devin = OpenCode owns | Discrete `.sh` exist (line 204) |
| injection-contract.md:20 | closest to code for Phase 4 | Still omits shells, core spec-gate flag, advisor alias-without-master, ungated plugins |
| permission-policy / dist-freshness / codex-watchdog / completion / directive-lifecycle READMEs | honor `isHookEnabled` | Mostly false; some invent aliases |
| session-lifecycle / spec-memory READMEs | honor `isHookEnabled` | True |
| git-preflight / hook-install / git READMEs | (no kill-switch sentence) | git-preflight **is** wired; others not |
| spec-gate/README.md | documents core DISABLED/ENFORCE | Omits master / isHookEnabled pending on discrete |
| shared/README.md | resolver API correct | Consumer list over-broad |
| ENV-REFERENCE.md | `MK_SPEC_GATE_DISABLED` row | **No** `MK_HOOKS_DISABLED` |
| spec.md:68-72 | only non-OpenCode advisor/gate remain | Understates Rank B/C |
| implementation-summary.md:80-82 | Phases 3-6 pending | Stale vs spec.md and vs code |

---

## 10. Exact documentation / index additions

1. **`.opencode/hooks/README.md`**
   - Replace § Full index + kill-switches with shipped / partial / unwired lists.
   - Add **Kill-switch matrix**: concern × canonical flag × aliases × wired? × effect (inject/warn/deny/tool) × notes (Cursor coupling, Pi bundle).
   - Label §2 directory tree “portable cores (real code here)” and point at coverage matrix + Additional table as the full index.
   - Fix dist-freshness Claude–Devin coverage-matrix cells.
   - Add `git/` (commit) to Additional centralized hooks; Pi row for the four bundled shells: `by-design: session-start-advisories` + “not independently flagged.”
   - Line 45: “indexed here; see kill-switch matrix” instead of “honors isHookEnabled.”

2. **`.opencode/hooks/injection-contract.md:20`** — keep the accurate shipped sentence; append spec-gate core flag, advisor alias-without-master, shell grammar, git pre-commit, ungated plugin names; pointer to README matrix.

3. **`.opencode/hooks/coverage-rationale.md`** — one pointer after §1: kill-switch status is the README matrix. Optional sentence on Pi bundling.

4. **Per-concern READMEs** — retract overclaims listed in §9; add kill-switch one-liners to git-preflight (wired), hook-install and git (unwired). Do not add invented aliases until LEGACY_ALIASES **and** call sites exist.

5. **`.opencode/hooks/shared/README.md`** — split “resolver API” vs “currently wired consumers.”

6. **`system-spec-kit/mcp-server/ENV-REFERENCE.md`** — new Hook flags section: `MK_HOOKS_DISABLED`; every spec.md concern `MK_<CONCERN>_DISABLED`; LEGACY_ALIASES; `SPECKIT_WORKTREE_GUARD` / `SPECKIT_GIT_HOOKS_GUARD` (`off`); `SPECKIT_DIST_AUTO_REBUILD` marked **not** a kill-switch; existing `MK_SPEC_GATE_DISABLED` / `MK_SPEC_GATE_ENFORCE` stay.

7. **Packet follow-up (out of this lineage’s write scope):** qualify spec.md §6–7 rollback the same way; refresh implementation-summary Phases 3-6.

**Index:** symlinks for skill-owned concerns already exist. The missing index feature is the **kill-switch column**, not more folders.

**Rejected:** a fourth hub file `kill-switches.md`.

---

## 11. Recommendations (implementation order)

1. **A1** — `isHookEnabled('skill-advisor')` in advisor TS (and thus dist). Unblocks master for the only human-visible [MSG] inject (Pi).
2. **A2** — `spec-gate-core` uses `isHookEnabled('spec-gate')` (covers all discrete classify/enforce/prebind). Keep `MK_SPEC_GATE_ENFORCE`.
3. **A3** — completion-stop `.cjs` (3 runtimes) + `mk-completion-sentinel.js` + `mk-speckit-completion.js` via `isHookEnabled('completion')`.
4. **A4** — git pre-commit env off + master (only always-on denier).
5. **B** — tiny bash helper for shells: honor `MK_HOOKS_DISABLED` / `MK_<CONCERN>_DISABLED` / existing `SPECKIT_*_GUARD=off`. Same for session-cleanup, hook-install, dist-freshness check (not just rebuild), watchdog, permission-policy, directive-lifecycle.
6. **C** — Cursor post-tool-use branch-local flags; Pi advisories per-concern flags.
7. **Docs** — README matrix + ENV-REFERENCE + retract overclaims (can ship in parallel with A1–A2 as “partial” rows).

---

## Eliminated Alternatives

| Approach | Reason eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Trust hub README directory tree as complete inventory | Tree still shows only portable cores + goal | README.md:53-97 | 1 |
| Treat session-lifecycle compiled `.js` as a second ungated family | Dist copies already call `isHookEnabled` | session-prime.js | 1, 10 |
| Hub-only wrappers around skill-owned symlinks | Live code is the symlink target / dist child | user-prompt-submit.js:16 | 2 |
| Treat goal cursor/pi as ungated because adapter files lack the token | `goal-core.isPluginDisabled` uses `isHookEnabled` | goal-core.cjs:121-123 | 2 |
| Count four `worktree-guard.sh` copies as four bugs | All symlink to one script | `.opencode/bin/worktree-guard.sh` | 2, 3 |
| Assume dist-freshness has a skip-check flag | Only `SPECKIT_DIST_AUTO_REBUILD` | check-dist-staleness.sh:75-81 | 3 |
| Per-adapter env flags | Operator-locked per-concern-family | spec.md:38 | 4 |
| Exempt spec-gate from `MK_HOOKS_DISABLED` | Deny already opt-in via ENFORCE | spec-gate-core.mjs:67 | 4 |
| Put the full flag table only in `shared/README.md` | Operators land on hub README first | README trigger_phrases | 5 |
| Turn coverage-rationale into a flag catalog | Wrong document (folder-absence rationale) | coverage-rationale.md:1-16 | 5 |
| Treat Cursor proxy as two independently gated adapters | One process | post-tool-use.mjs:103 | 6 |
| Document `MK_SESSION_LIFECYCLE_DISABLED` as the Pi worktree-guard off | Coupling bug, not UX | session-start-advisories.ts:8-36 | 6 |
| Rely on shell headers as the user-facing catalog | Undiscoverable | worktree-guard.sh:18 | 7 |
| Add invented README aliases to LEGACY_ALIASES without wiring | Docs would be “true” while hooks still run | codex-watchdog/README.md:19 | 7, 9 |
| New `kill-switches.md` fourth hub doc | Three files already disagree | README vs injection-contract vs concern READMEs | 9 |
| Treat deep-review report as current gap inventory | Plugin P1s superseded | review-report.md vs live plugins | 10 |
| Re-open session-lifecycle as ungated | Source and dist gated | session-prime.ts:34 | 10 |

---

## Divergence Map

- Saturated directions: hub token-grep; symlink-target census; shell-header grammar; disable-UX unification; hub-doc contradictions; Cursor/Pi coupling; ENV-REFERENCE; unique-target ranking; review triangulation.
- Pivots taken: none (sequential broadening under max-iterations; no divergent-pivot seats).
- Pivot failures / audited overrides: none.
- Remaining frontier: whether git pre-commit env-off is acceptable to operators (recommended, not confirmed); Pi `--preserve-symlinks` import brittleness (review F016, not re-measured); packet spec.md/tasks.md continuity edits (out of lineage write scope).
- Council artifacts: none.

---

## 12. Open Questions

- Should session-cleanup honor master given it is teardown, not injection? Recommendation: yes, for a uniform off switch; default on.
- Exact bash helper shape for shells (source a `.opencode/hooks/shared/hook-flags.sh` vs `node -e`)? Not designed here; either is fine if it calls the same names.
- Packet-level spec.md/implementation-summary/tasks.md refresh is a follow-up `/speckit:plan`, not this lineage.

All five charter questions are answered at research fidelity. Remaining items are implementation choices.

---

## 13. Review cross-check

Deep-review `review/review-report.md` (CONDITIONAL, P0=0, P1=8) is a **hypothesis**. Replay:

| ID | Review claim | This research |
|---|---|---|
| F003, F005, F014, F004 | OpenCode dispatch/post-edit/task-dispatch/goal ungated | **Superseded** — plugins/core now call `isHookEnabled` |
| F015 | spec-gate + skill-advisor ignore master | **Half** — OpenCode plugins wired; discrete adapters still ignore master |
| F001, F006 | Docs overclaim | **Still true** (narrowed to README/concern READMEs/rollback vs Rank B) |
| F002 | tasks.md / continuity stale | Confirmed (implementation-summary still “Phases 3-6 pending”) |
| F009 | Cursor proxy no isHookEnabled | **Mutated** — dispatch-only guard; dual-concern remains |
| F010 | session-lifecycle ungated | **Superseded** |
| F008, F017 | shared README / validation omit hook-flags | **Superseded** |

Review missed Rank B shells, watchdog, completion-stop, directive-lifecycle, permission-policy, git pre-commit, invented aliases, ENV-REFERENCE gap.

---

## 14. References

- `.opencode/hooks/shared/hook-flags.cjs`
- `.opencode/hooks/README.md`, `injection-contract.md`, `coverage-rationale.md`, per-concern READMEs, `shared/README.md`
- `.opencode/plugins/mk-*.js`, `session-cleanup.js`
- `system-skill-advisor/hooks/claude/user-prompt-submit.ts`
- `system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs`
- `system-spec-kit/mcp-server/hooks/cursor/post-tool-use.mjs`
- `system-spec-kit/mcp-server/hooks/pi/session-start-advisories.ts`
- `system-spec-kit/mcp-server/ENV-REFERENCE.md`
- `.opencode/bin/worktree-guard.sh`, `check-git-hooks.sh`, `install-codex-hooks.mjs`
- `.opencode/hooks/git/pre-commit`
- `specs/hooks/010-hook-feature-flags-and-hub-index/{spec.md,implementation-summary.md,review/review-report.md}`
- This lineage `iterations/iteration-001.md` … `iteration-010.md`

resource-map.md was not present on the spec folder at init; no placeholder citation.

---

## 15. Implementation notes (non-goals of this run)

No adapter or hub file was modified. Recommended follow-up: `/speckit:plan` from this `research.md` + live code (not from the stale review WS-1 plugin list alone).

---

## 16. Lineage metadata

- Artifact dir: `specs/hooks/010-hook-feature-flags-and-hub-index/research/lineages/grok46-xhigh`
- Executor: cli-cursor / cursor-grok-4.6-xhigh
- `resource_map_present` at init: false
- Reducer: lineage-local (parent `reduce-state.cjs` resolves `{spec_folder}/research/` and was not invoked — write containment)
- spec.md mutation: skipped (fan-out containment)

---

## Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 10
- Questions answered: 5 / 5
- Remaining questions: 0 charter questions; 3 implementation-choice opens (§12)
- Last 3 iteration summaries: run 8: ranked unique gap list (0.48); run 9: exact doc additions (0.40); run 10: review triangulation (0.42 insight)
- Convergence threshold: 0.05 (telemetry only under `stopPolicy: max-iterations`)
- newInfoRatio trend: 1.00 → 0.85 → 0.78 → 0.70 → 0.72 → 0.62 → 0.55 → 0.48 → 0.40 → 0.42
- Divergence summary: no divergent pivots; frontier listed in Divergence Map
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.
