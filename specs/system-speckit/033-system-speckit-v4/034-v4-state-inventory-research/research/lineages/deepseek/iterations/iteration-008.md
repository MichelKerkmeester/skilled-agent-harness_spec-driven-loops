# Iteration 8: Angle 8 — RUNTIME MIRRORS, HOOKS, CI AND GOALS

## Focus
Inventory the runtime mirrors (.claude/.codex/.cursor/.devin/.pi) and their sync mechanics, the hook dispatch surface and symlink count, every .github/workflows job and what it gates, and the goal system with its resync rule.

## INVENTORY

| Surface | Value | SOURCE |
|---|---|---|
| .claude mirror | SYNC.md, agents/, commands/, hooks/, mcp.json, settings.json, manual-testing-playbook | .claude/ ls |
| .codex mirror | AGENTS.md, SYNC.md, agents/, config.toml, hooks/, hooks.json, prompts/ | .codex/ ls |
| .cursor mirror | SYNC.md, agents/, commands/, hooks/, hooks.json, mcp.json, rules/ | .cursor/ ls |
| .devin mirror | SYNC.md, agents/, config.local.json, hooks/, hooks.v1.json, mcp_config.json | .devin/ ls |
| .pi mirror | PLUGINS.md, SYNC.md, agents/, custom-providers.md, deep-pi-stats.json, extensions/, git/ | .pi/ ls |
| Mirror mechanics | Symlinks onto canonical files; .devin agents = nested `.devin/agents/<name>/AGENT.md` symlinks sourcing .claude/agents/; Devin carries NO mirrored command surface (operator decision); only hooks.v1.json authored locally | .devin/SYNC.md |
| Hook symlink count | 102 symlinks under .opencode/hooks (draft said ~96) | find .opencode/hooks -type l |
| Hook concern dirs | 21: codex-watchdog, completion, directive-lifecycle, dispatch, dist-freshness, git, git-hooks-check, git-preflight, git-primary-reconcile, git-worktree-guard, goal, hook-install, mcp-route-guard, permission-policy, post-edit-quality, session-cleanup, session-lifecycle, sk-vision, skill-advisor, spec-gate, task-dispatch | .opencode/hooks/ ls |
| Cross-runtime hook matrix | completion/ and dist-freshness/ cover all six runtimes (claude, codex, cursor, devin, opencode, pi); git-preflight has opencode+pi+shared | find -type l breakdown |
| CI workflows | 15: advisory-checks, agent-mirror-sync, changed-packet-validation, command-tree-parity, comment-hygiene, markdown-link-integrity, naming-standard-guard, playbook-operator-contract, prompt-card-sync, routing-registry-drift, rule-canary-sync, runtime-no-spec-import, skill-doc-frontmatter, spec-kit-check, strict-pass-freshness-report | .github/workflows/ ls |
| Mirror parity CI | spec-kit-check.yml `mirrors` job: "Runtime mirrors agree with their sources"; workflow triggers on every mirror source and output (.opencode/commands, agents, skills/*/command-metadata.json, .codex, .claude, .cursor, .devin, .pi) | spec-kit-check.yml:9-32,116-117 |
| Goal system | .opencode/skills/.state/goal/ (README.md tracked, runtime data git-ignored; opencode-goal.js plugin state, session-keyed) | .state/goal/README.md |
| Goal hook runtimes | .opencode/hooks/goal/: cursor, opencode, pi (+ bin, lib, goal-plugin.md) — NO devin (goal hooks decommissioned) | hooks/goal/ ls |

## DRIFT

| Draft line | Claim | Verdict | Actual state | Severity | Correction | SOURCE |
|---|---|---|---|---|---|---|
| "around ninety-six of them [hook symlinks]" | ~96 hook symlinks | STALE | 102 symlinks today | P2 | 102, not ~96 | find count |
| "a master MK_HOOKS_DISABLED flag ... with a canonical MK_<concern>_DISABLED flag for each of the twenty concerns" | 20 concerns | STALE | 21 concern dirs (git/ plus the 20 named) — count depends on whether git/ subsumes git-* concerns | P2 | 20-21 concern dirs; flag mechanics not individually verified | hooks/ ls |
| "the .opencode/hooks/ directory gathers every hook through relative symlinks" | Symlink assembly | TRUE | 102 symlinks confirmed | — | Confirmed | find -type l |
| "Goals ... now reach Cursor and Pi too" | Goal across runtimes | TRUE | hooks/goal/{cursor,opencode,pi} all present | — | Confirmed | hooks/goal/ ls |
| "Devin goal hooks were prototyped ... then deliberately decommissioned, so Devin is not a goal target" | No Devin goal hook | TRUE | No devin/ dir under hooks/goal/ | — | Confirmed | hooks/goal/ ls |
| "they are now stored per workspace, runtime and session" | Per-workspace goal store | TRUE | .state/goal/README.md: session-keyed files, git-ignored, per-machine state | — | Confirmed | .state/goal/README.md |
| "The pre-commit hook runs the same six mirror checks CI runs" | Six mirror checks in pre-commit | UNVERIFIED | Mirror-parity job exists in CI; the six-check detail not traced into the pre-commit hook this pass | P2 | Not contradicted | spec-kit-check.yml:116 |
| "CI mirror parity ... every .github/workflows job and what it gates" (briefing) | Jobs gate mirrors, frontmatter, naming, parity | TRUE | agent-mirror-sync, command-tree-parity, routing-registry-drift, skill-doc-frontmatter, naming-standard-guard etc. all present | — | Confirmed | workflows ls + job names |
| "a goal you set now carries the same weight in OpenCode, Cursor and Pi" | Goal hook coverage | TRUE | goal hook has opencode, cursor, pi runtimes | — | Confirmed | hooks/goal/ ls |
| "the goal-resync rule: when anything above the log changes, resend the full parent goal.md" | Resync rule | TRUE (per 029 packet) | Packet 029 shipped the rule; goal addon template carries it (template addon exists) | — | Confirmed via timeline + templates/addons/goal.md.tmpl | timeline.md:95; templates/addons/ |

## Sources Consulted
- .claude/.codex/.cursor/.devin/.pi ls + .devin/SYNC.md; .opencode/hooks find + ls; .github/workflows ls + spec-kit-check.yml; .opencode/skills/.state/goal/README.md; hooks/goal/ ls; timeline.md

## Assessment
- **newInfoRatio**: 0.9 — mirror shapes, symlink count, workflow roster and goal store are new; hook-concern count known from draft.
- **Confidence**: Confirmed for all rows except the six-check pre-commit detail (UNVERIFIED).

## Reflection
- Worked: one `find -type l` settles the hook-count claim; .devin/SYNC.md is a precise mirror-mechanics source.
- Failed: six-check pre-commit detail not traced (would need hook-install/git-hooks-check read).
- Ruled out: reading every SYNC.md — .devin's suffices as the canonical mechanics example.

## Recommended Next Focus
Angle 9: BREAKING CHANGES AND UPGRADE NOTES — confirmed-by-code renames/removals/moves since v3.6.0.0 (git log with filters, timeline), separating confirmed from inferred.
