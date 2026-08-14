# Hook Feature-Flag Coverage and Hub Index Research

> Canonical synthesis for `specs/hooks/010-hook-feature-flags-and-hub-index`. The Cursor/Grok lineage completed all 10 forced iterations. The Devin/GLM lineage failed before creating state after six attempts, so findings below are complete single-lineage evidence, not two-model consensus. See `orchestration-summary.json` and `lineages/glm52-max/logs/fanout-lineage.out`.

## Executive Verdict

`isHookEnabled(concern)` is the correct common UX and already covers the portable hook families, session lifecycle, git preflight, spec memory, goal, and most OpenCode plugins. Coverage is not universal.

Three classes of work remain:

1. Discrete adapters and plugins still bypass `isHookEnabled`, so `MK_HOOKS_DISABLED` cannot silence them.
2. Shell and core paths use incompatible disable grammars such as `SPECKIT_*_GUARD=off` and direct `ENV === "1"` checks.
3. Hub documentation overclaims some coverage, understates other gaps, and lacks one canonical concern-to-flag index.

The smallest coherent solution is to route every entry point through the shared concern guard, preserve existing environment names as aliases, and make `.opencode/hooks/README.md` the canonical switch index. Do not add per-adapter flags or a fourth competing flag document.

## Gap Inventory

### Priority A: Master-Switch Gaps

| Concern | Canonical targets | Current behavior | Required change |
|---|---|---|---|
| `skill-advisor` | `system-skill-advisor/hooks/{claude,codex,cursor,devin}/user-prompt-submit.ts`, Pi `prompt-advisor.ts`, compiled mirrors | Checks `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` directly; master ignored | Call `isHookEnabled("skill-advisor")`; retain existing names as aliases |
| `spec-gate` | `system-spec-kit/mcp-server/hooks/**/spec-gate-*`, Cursor prebind, `spec-gate-core.mjs` | Core checks `MK_SPEC_GATE_DISABLED === "1"`; master and truthy forms ignored | Route core through `isHookEnabled("spec-gate")`; keep `MK_SPEC_GATE_ENFORCE` as the scoped deny control |
| `directive-lifecycle` | Skill-advisor and spec-kit Claude lifecycle-boundary adapters | Dedup controls exist, but no off switch | Add `isHookEnabled("directive-lifecycle")` |
| `completion` | Claude/Codex/Devin completion-evidence stops, `mk-completion-sentinel.js` | No shared guard | Gate all with `isHookEnabled("completion")` |
| `codex-watchdog` | `.opencode/plugins/mk-codex-hooks-watchdog.js` | No kill-switch | Gate with `isHookEnabled("codex-watchdog")` |
| `permission-policy` | Devin `permission-request-policy.mjs` | README claims coverage; code has none | Gate with `isHookEnabled("permission-policy")` |

Evidence: `lineages/grok46-xhigh/research.md` sections 3, 4, and 8; direct source anchors are recorded there.

### Priority B: Shell, Install, Teardown, and Git Gaps

| Concern | Canonical target | Current control | Required change |
|---|---|---|---|
| `worktree-guard` | `.opencode/bin/worktree-guard.sh` | `SPECKIT_WORKTREE_GUARD=off` only | Honor master + canonical concern flag; keep current value as alias |
| `git-hooks-check` | `.opencode/bin/check-git-hooks.sh` | `SPECKIT_GIT_HOOKS_GUARD=off` only | Same shared shell behavior |
| `dist-freshness` | `check-dist-staleness.sh`, `mk-dist-freshness-guard.js` | Rebuild toggle is not a skip-check flag | Add a real concern kill-switch; do not alias `SPECKIT_DIST_AUTO_REBUILD` |
| `session-cleanup` | `.opencode/scripts/session-cleanup.sh`, plugin | None | Add master and concern off switch |
| `hook-install` | `.opencode/bin/install-codex-hooks.mjs` | None | Add master and concern off switch |
| `git-commit-hooks` | `.opencode/hooks/git/pre-commit` canonical chain | Always-on deny; source bypass annotation only | Add emergency env off plus master; default remains on |
| `completion` | `mk-speckit-completion.js`, `completion-state.cjs` | Legacy `MK_SPECKIT_COMPLETION_DISABLED` | Route through shared concern guard and retain alias |

These are unique canonical targets. Runtime hub copies are often symlinks and must not be counted as separate implementations.

### Priority C: Wrong-Concern Coupling

- Cursor `post-tool-use.mjs` gates the whole multiplexed path with `dispatch`; `MK_POST_EDIT_QUALITY_DISABLED` cannot independently silence the Write branch. Gate shell and write branches separately.
- Pi `session-start-advisories.ts` places worktree guard, git-hooks check, dist freshness, and hook installation behind `session-lifecycle`. Each check needs its own concern gate while retaining any script-level legacy off.

## Already Covered

Do not reopen these families without a failing call-site check:

- Portable `mcp-route-guard`, `dispatch`, `post-edit-quality`, and `task-dispatch` adapters, except the Cursor coupling above.
- `goal` through `goal-core`.
- `git-preflight` shared adapters and OpenCode advisory plugin.
- `spec-memory` OpenCode plugin and folded session paths.
- `session-lifecycle` source and compiled dist adapters.
- OpenCode plugins for dispatch, post-edit quality, deep-loop/task dispatch, goal, spec gate, skill advisor, MCP route guard, and git preflight.

The earlier packet review's OpenCode-plugin findings are largely superseded by later wiring. Use live call-site evidence, not the stale plugin list.

## Disable UX

Use one operator model everywhere:

1. `MK_HOOKS_DISABLED=1` disables all repo-authored hook concerns.
2. `MK_<CONCERN>_DISABLED=1` disables one concern family; normalize hyphens to underscores.
3. Existing `MK_*`, `SPECKIT_*`, and `SPECKIT_*_GUARD=off` names remain supported aliases where they are already live.
4. All hooks default on.
5. Truthy parsing remains `1`, `true`, `yes`, or `on`, case-insensitive.

### Hard Blockers

`spec-gate` should honor the master switch. Its deny behavior remains separately scoped by `MK_SPEC_GATE_ENFORCE`, which is already opt-in. Exempting spec gate from the master would violate the promised one-switch emergency off without adding safety.

The git pre-commit hook is the only identified always-on denier with no environment off. Add `MK_GIT_COMMIT_HOOKS_DISABLED` and master handling as an emergency bypass, default on.

### Alias Rules

Preserve these live names through the concern guard:

- `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` -> `skill-advisor`
- `SPECKIT_SPEC_GATE_DISABLED` and `MK_SPEC_GATE_DISABLED` -> `spec-gate`
- `SPECKIT_WORKTREE_GUARD=off` -> `worktree-guard`
- `SPECKIT_GIT_HOOKS_GUARD=off` -> `git-hooks-check`
- `MK_SPECKIT_COMPLETION_DISABLED` and `MK_COMPLETION_SENTINEL_DISABLED` -> `completion`

Do not document `MK_DIST_FRESHNESS_GUARD_DISABLED` or `MK_CODEX_HOOKS_WATCHDOG_DISABLED` as live until both alias registration and call-site wiring exist. Do not treat `SPECKIT_DIST_AUTO_REBUILD` as a kill-switch; it controls remediation, not whether the check runs.

## Canonical Hub Index

Make `.opencode/hooks/README.md` the single operator-facing index. Add one table with these columns:

| Column | Meaning |
|---|---|
| Concern slug | Argument passed to `isHookEnabled` |
| Canonical flag | `MK_<CONCERN>_DISABLED` |
| Legacy aliases | Existing accepted names and special `off` grammar |
| Default | Always `enabled` |
| Effect | `inject`, `warn`, `deny`, `install`, `teardown`, or `tool` |
| Runtime coverage | Claude, Codex, Cursor, Devin, OpenCode, Pi |
| Status | `wired`, `partial`, or `unwired` |
| Notes | Multiplexing, bundling, or scoped controls such as `MK_SPEC_GATE_ENFORCE` |

Populate the table for every concern in the packet plus `worktree-guard`, `git-hooks-check`, `hook-install`, `session-cleanup`, and `git-commit-hooks`. Keep rows marked partial until every runtime entry point routes through the shared guard.

## Documentation Wiring

1. `.opencode/hooks/README.md`: add the canonical matrix; replace stale shipped/pending claims; distinguish portable real-code folders from the full symlinked index; fix dist-freshness runtime cells; add git commit hooks to centralized surfaces.
2. `.opencode/hooks/injection-contract.md`: summarize master/per-concern behavior, list current exceptions while partial, and point to the README matrix rather than maintaining another inventory.
3. `.opencode/hooks/coverage-rationale.md`: add only a pointer to the README matrix and a short Pi-bundling note. Keep this file focused on why runtime folders differ.
4. Per-concern READMEs: retract unsupported `isHookEnabled` claims and invented aliases; state `wired`, `partial`, or `unwired` exactly.
5. `.opencode/hooks/shared/README.md`: separate the resolver API from the list of currently wired consumers.
6. `system-spec-kit/mcp-server/ENV-REFERENCE.md`: add `MK_HOOKS_DISABLED`, every canonical concern flag, live aliases, special shell `off` values, and a warning that `SPECKIT_DIST_AUTO_REBUILD` is not a disable flag.
7. Packet docs: update rollback and status text after implementation so `spec.md`, `tasks.md`, and `implementation-summary.md` agree with live coverage.

Do not add `kill-switches.md`. A fourth catalog would increase the contradiction risk already present across three documents.

## Ranked Implementation Plan

1. Route skill-advisor adapters through `isHookEnabled("skill-advisor")`.
2. Route `spec-gate-core` through `isHookEnabled("spec-gate")`; retain enforcement scoping.
3. Gate completion stops, sentinel, and completion tool plugin as one `completion` family.
4. Add master and concern bypasses to the git pre-commit chain.
5. Add a shared shell-compatible flag helper or equivalent common implementation for worktree guard, git-hooks check, dist freshness, cleanup, and install paths.
6. Gate watchdog, permission policy, and directive lifecycle.
7. Split Cursor and Pi multiplexed paths by concern.
8. Publish the README matrix and ENV reference, then truth-up all secondary docs.
9. Run cross-runtime negative controls: baseline output, `MK_HOOKS_DISABLED=1`, each per-concern flag, each live alias, and default-on regression checks.

## Eliminated Alternatives

| Alternative | Reason eliminated |
|---|---|
| Per-adapter flags | Violates the operator-locked per-concern model and creates roughly 90 controls |
| Exempt spec gate from master | Enforcement is already separately opt-in; exemption breaks the emergency-off promise |
| Count symlink mirrors as separate gaps | The canonical target is the implementation boundary |
| Treat rebuild controls as kill-switches | Rebuild behavior and check execution are different controls |
| Add a fourth flag catalog | Increases documentation drift instead of creating one authority |
| Reuse the old review plugin list | Several findings are superseded by live `isHookEnabled` wiring |

## Evidence And Limitations

- Completed evidence: `lineages/grok46-xhigh/iterations/iteration-001.md` through `iteration-010.md`, `lineages/grok46-xhigh/research.md`, and its lineage registry/state.
- Route proof is present on all 10 completed iteration records: `target_agent=deep-research`, `agent_definition_loaded=true`, `mode=research`, and the resolved route.
- Stop reason for the completed lineage: `maxIterationsReached`; convergence was telemetry only.
- Failed evidence: `glm52-max` created no iteration, delta, state, registry, or synthesis artifacts after six attempts. It cannot support or contradict any finding.
- The merge runtime preserved attribution but dropped the successful lineage's string-valued `keyFindings` from the root merged registry; use the lineage registry and this synthesis as the evidence surfaces. This is a merge-schema limitation, not evidence that zero findings were produced.
- No hook implementation was changed by this research run.

## Convergence Report

- Requested lineages: 2
- Completed lineages: 1
- Failed lineages: 1
- Completed iterations: 10 / 20 requested across both lineages
- Completed-lineage stop reason: `maxIterationsReached`
- Questions answered by completed lineage: 5 / 5
- Novelty trend: `1.00 -> 0.85 -> 0.78 -> 0.70 -> 0.72 -> 0.62 -> 0.55 -> 0.48 -> 0.40 -> 0.42`
- Overall workflow status: partial because the Devin lineage failed
