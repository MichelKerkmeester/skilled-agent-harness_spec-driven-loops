# Angle 8 — RUNTIME MIRRORS, HOOKS, CI AND GOALS

## Focus

Determine how the five runtime mirrors derive from `.opencode`, how the hook layer is indexed and dispatched, which CI jobs enforce parity and quality, and how goal state is scoped and resynchronized.

## Actions Taken

- Opened the Codex, Cursor, and Devin sync manifests, the Pi extension inventory, the canonical runtime mirror hook registry, and the centralized hook README.
- Inspected the goal core/plugin contracts and the live goal state layout.
- Enumerated the 15 workflow files and their declared jobs, then inspected the mirror/parity jobs and Dependabot path hardening.
- Read only the goal, mirror, hook, and workflow contracts needed for this angle; no tooling was executed and no repository files outside the lineage were written.

## Findings

### INVENTORY

| surface | value | source |
|---|---|---|
| canonical runtime and agents | `.opencode` is the canonical source. It contains 12 agent `.md` files; `.claude` carries the same Claude-format agent set. The root policy names Claude, Codex, Cursor, Pi, and Devin agent locations explicitly. | [SOURCE: `AGENTS.md:436-440`; `.opencode/agents/*.md`; `.claude/agents/*.md`] |
| Claude mirror | Claude is the source dialect for the Cursor and Devin agent mirrors; its own settings and hooks are runtime-specific, while `.claude/agents/` is the canonical Claude-format agent tree used by those consumers. | [SOURCE: `.cursor/SYNC.md:15-23`; `.devin/SYNC.md:15-24`] |
| Codex mirror | `.codex/agents/` and `.codex/prompts/` are generated from `.opencode/agents/` and `.opencode/commands/`; hooks are per-file symlinks and Codex hook configuration is installed outbound to user-global `~/.codex/hooks.json`. No `.codex/commands/` or `.codex/skills/` tree is consumed. | [SOURCE: `.codex/SYNC.md:9-29,39-55`] |
| Cursor mirror | `.cursor/agents/` symlink to `.claude/agents/`; `.cursor/commands/` symlink to flattened `.opencode/commands/`; hooks are discovery symlinks, while `hooks.json` and rules are hand-authored. Cursor has no repo-local skills mirror. | [SOURCE: `.cursor/SYNC.md:9-29,39-55`] |
| Devin mirror | `.devin/agents/<name>/AGENT.md` is a nested symlink to `.claude/agents/<name>.md`; Devin carries no mirrored command surface and discovers `.opencode/skills/` directly; hooks are symlink discovery entries and `hooks.v1.json` is hand-authored. | [SOURCE: `.devin/SYNC.md:9-30`] |
| Pi mirror | `.pi/extensions/` is Pi's discovery mirror for guard-core bridges; some entries are real Pi TypeScript adapters and others are symlinks to portable hook cores. Goal delivery is native-session-bound for Pi, with `/goal-pi` and input/session/turn lifecycle hooks. | [SOURCE: `.pi/extensions/README.md:11-24`; `.opencode/hooks/goal/README.md:45-64`] |
| runtime-mirror registry | The canonical registry records Claude, Codex, Cursor, Devin, and Pi bindings; Pi is verified through `.pi/extensions`, while the other four runtimes have generated registration files. | [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:2-5,19-23,33-36,47-50,63-68`] |
| centralized hooks | `.opencode/hooks/` is the browsable home for hook concepts. Portable code concerns include dispatch, mcp-route-guard, post-edit-quality, and task-dispatch; skill-owned engines remain in their owning skills but are indexed by symlink. | [SOURCE: `.opencode/hooks/README.md:20-52,77-88`] |
| hook switch policy | Hook concerns default enabled and use `SYSTEM_HOOKS_DISABLED` plus canonical concern flags such as `SYSTEM_SPEC_GATE_DISABLED`, `SYSTEM_TASK_DISPATCH_DISABLED`, `OPENCODE_GOAL_DISABLED`, and `SYSTEM_LIVE_SYNC_DISABLED`; `SYSTEM_SPEC_GATE_ENFORCE` is an enforcement control, not a kill switch. | [SOURCE: `.opencode/hooks/README.md:39-70`] |
| goal state | Goal state is session-scoped and opaque: workspace + runtime + native session id resolves to one state file and archive namespace under `.opencode/skills/.state/goal/`. There is no process-global current-goal pointer; legacy `active-goal.json` is diagnostic-only. | [SOURCE: `.opencode/hooks/goal/README.md:17-28,67-91`] |
| goal runtime coverage | OpenCode uses its native plugin; Pi has native injection and management; Cursor is injection-only; Claude, Codex, and Devin are by-design unsupported for this goal core. The retained command boundaries are `/goal-opencode`, `/goal-cursor`, and `/goal-pi`. | [SOURCE: `.opencode/hooks/goal/goal-plugin.md:133-153`] |
| git hooks | The source hook set has `commit-msg`, `post-commit`, `post-merge`, `post-rewrite`, `pre-commit`, and `pre-push`; the installer chains comment-hygiene and mass-deletion/push-policy checks. | [SOURCE: `.opencode/hooks/README.md:24-28`; `.opencode/scripts/git-hooks/README.md:18-28`] |
| CI workflow roster | 15 workflow files are present: Advisory Checks, Agent Mirror Sync, Changed Packet Validation, Command Tree Parity, Comment Hygiene Gate, Markdown Link Integrity, Naming Standard Guard, Playbook Operator Contract, Prompt-Knowledge Card Sync, Routing Registry Drift Guard, Rule Canary Sync, Runtime No-Spec-Import Guard, Skill Doc Frontmatter, Spec-Kit Check, and Strict Pass Freshness Report. | [SOURCE: `.github/workflows/advisory-checks.yml:1`; `.github/workflows/agent-mirror-sync.yml:1`; `.github/workflows/changed-packet-validation.yml:1`; `.github/workflows/command-tree-parity.yml:1`; `.github/workflows/comment-hygiene.yml:1`; `.github/workflows/markdown-link-integrity.yml:1`; `.github/workflows/naming-standard-guard.yml:1`; `.github/workflows/playbook-operator-contract.yml:1`; `.github/workflows/prompt-card-sync.yml:1`; `.github/workflows/routing-registry-drift.yml:1`; `.github/workflows/rule-canary-sync.yml:1`; `.github/workflows/runtime-no-spec-import.yml:1`; `.github/workflows/skill-doc-frontmatter.yml:1`; `.github/workflows/spec-kit-check.yml:1`; `.github/workflows/strict-pass-freshness-report.yml:1`] |
| key CI jobs | The most relevant jobs are `advisory`, `agent-mirror-sync`, `changed-packets`, `command-tree-parity`, `routing-drift` plus `golden-prompt-gate`, `check` plus `mirrors`, and `strict-pass-freshness`; their run steps invoke routing, mirror, no-spec-import, shared-package, validation, and freshness gates. | [SOURCE: `.github/workflows/advisory-checks.yml:17-39`; `.github/workflows/agent-mirror-sync.yml:7-38`; `.github/workflows/command-tree-parity.yml:14-37`; `.github/workflows/routing-registry-drift.yml:69-204`; `.github/workflows/spec-kit-check.yml:43-148`; `.github/workflows/strict-pass-freshness-report.yml:22-98`] |
| mirror parity gate | Spec-Kit Check explicitly runs runtime-mirror, agent-roster, command-catalog, hook-registration, and Gate 1 pointer checks; Agent Mirror Sync separately fails closed when agent mirrors drift. | [SOURCE: `.github/workflows/spec-kit-check.yml:116-148`; `.github/workflows/agent-mirror-sync.yml:7-38`] |
| goal resynchronization | Goal state is not resynchronized through the advisor daemon: the goal plugin is session-local, and cross-runtime adapters use the shared core with native identity. OpenCode restores/checks on lifecycle events; Pi restores on `session_start`, injects on `input`, verifies on `turn_end`; Cursor only injects at session start. | [SOURCE: `.opencode/hooks/goal/goal-plugin.md:40-50,103-107,133-155`; `.opencode/hooks/goal/pi/goal-context.ts:157-206`] |

### DRIFT

| draft line | claim | verdict | actual state | severity | one-line correction | source |
|---:|---|---|---|:---:|---|---|
| 31 | Goals have the same weight in OpenCode, Cursor, and Pi and are stored per workspace instead of as a global singleton. | TRUE | The state core scopes records by workspace, runtime, and native session; OpenCode, Cursor, and Pi are the retained goal-capable runtimes. | P2 | Retain this claim, but name the runtime-specific support differences. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:31`; `.opencode/hooks/goal/README.md:17-28`; `.opencode/hooks/goal/goal-plugin.md:133-153`] |
| 98 | Advisor state can still leak into a spec folder through the hook entry point. | STALE | The current goal/hook and advisor contracts use structural state containment and explicit session scope; the old residual-leak wording is not the live containment contract. | P1 | Replace the residual-leak warning with the current structural boundary and session-scoped state rules. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:98`; `.opencode/hooks/goal/README.md:17-28`; `.opencode/skills/system-skill-advisor/mcp-server/lib/utils/workspace-root.ts:31`] |
| 226 | Goal support now reaches every tool, with Devin explicitly excluded from the shipped target. | TRUE | The current goal contract supports OpenCode, Pi, and Cursor; Claude, Codex, and Devin are explicitly by-design unsupported. | P2 | Keep the Devin exclusion, but change “every tool” to the three supported runtime surfaces. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:226`; `.opencode/hooks/goal/goal-plugin.md:141-153`] |
| 244-248 | All hooks are assembled through about 96 relative symlinks, with one `MK_HOOKS_DISABLED` switch and twenty concern switches. | STALE | The hook tree mixes portable real code and symlinked skill-owned entries; the live master switch is `SYSTEM_HOOKS_DISABLED` and the README exposes a larger named concern index. | P1 | Correct the switch names and describe the real-code versus index-symlink split. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:244-248`; `.opencode/hooks/README.md:20-52`] |
| 315 | Wrapper-launched Claude, Codex, or OpenCode sessions autosync commits to one shared live branch behind environment/worktree/hook checks. | TRUE | The sk-git contract describes the wrapper, live branch, `SPECKIT_LIVE_BRANCH`, `SPECKIT_AUTOSYNC`, and post-commit sync behavior; CI separately checks mirror parity. | P2 | Retain the autosync description and cross-link the runtime-mirror CI gate. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:315`; `.opencode/skills/sk-git/SKILL.md:289-295`; `.github/workflows/spec-kit-check.yml:116-148`] |
| 333 | New branch grammar uses `<skill>/{NNNN}-{slug}` or `skilled/{NNNN}-{slug}`. | STALE | The live worktree grammar is `worktrees/{NNN}-{slug}` or `branches/{NNN}-{slug}` with a three-digit allocator; `main` and `skilled/v*` are reserved release refs. | P1 | Replace the four-digit owner-first grammar with the current worktrees/branches allocator grammar. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:333`; `.opencode/skills/sk-git/SKILL.md:359-363`] |
| 440-443 | Upgrade notes say goals are shared across runtimes and include a four-digit branch grammar plus broad default push behavior. | STALE | Goal support is three-runtime and session-bound; branch naming is three-digit worktrees/branches, and push policy is allowlist plus per-push approval outside it. | P1 | Rewrite the upgrade bullets from the live goal and sk-git contracts. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:440-443`; `.opencode/hooks/goal/goal-plugin.md:141-155`; `.opencode/skills/sk-git/SKILL.md:299-305,359-363`] |
| 246 | The hook index is a read-only browse layer assembled from source paths. | TRUE | The centralized README explicitly distinguishes real portable hook cores from symlinked skill-owned index entries. | P2 | Retain the index concept but correct the counts and kill-switch vocabulary. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:246`; `.opencode/hooks/README.md:20-36,77-88`] |
| 18 | A compatibility symlink preserves every old `.opencode/specs/...` reference. | MISSING | This iteration did not inspect the compatibility symlink itself; the claim must be settled by a direct filesystem and link-target check in the reproduction pass. | P1 | Verify the old path and target explicitly before retaining this upgrade promise. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:18`; `AGENTS.md:292-296`] |

DISAGREEMENTS: Sync manifests claim 13 agents/35 prompts or commands in their narrative, while the current source inventory has 12 `.opencode/agents/*.md` files and 48 command Markdown files; treat the manifests' historical counts as documentation drift and use generated mirror checks as authority. The draft's `MK_HOOKS_DISABLED`/twenty-concern wording conflicts with the live `SYSTEM_HOOKS_DISABLED` index. The draft's “every tool” goal wording conflicts with the explicit three-runtime goal table.

CONFIDENCE: Confirmed: mirror mechanisms, hook registry shape, goal scope, goal runtime coverage, git-hook source names, and workflow/job names from opened manifests, registries, READMEs, source contracts, and workflow files. Inferred: the exact status of the old specs compatibility symlink remains unresolved because this iteration did not perform the requested link-target reproduction; no claim is made beyond MISSING.

## Questions Answered

- How do the five mirrors work? Codex is generated, Cursor and Devin are symlink-shaped, Pi discovers extension bridges, and Claude is the source dialect for the latter two.
- Where do hook concerns live? In `.opencode/hooks/` as portable cores plus symlinked indexes, with generated runtime registration projections and runtime-specific config shapes.
- What does CI gate? Mirror parity, agent/command tree parity, registry routing drift, changed-packet validation, no-spec imports, naming/frontmatter/link/comment quality, and strict-pass freshness among 15 workflows.
- How are goals contained? By workspace + runtime + native session identity; legacy singleton state is diagnostic-only and goal handling is not routed through the advisor daemon.

## Questions Remaining

- Which old-path symlinks and runtime compatibility aliases still resolve in practice?
- Which v3.6.0.0-to-v4 renames, exit codes, and defaults are code-confirmed rather than changelog-inferred?
- Which claims throughout the entire draft are true, stale, false, or missing after all ten angles are reconciled?

## Next Focus

Iteration 9: BREAKING CHANGES AND UPGRADE NOTES.

## Reflection

The operational layer confirms that “mirror” does not mean one mechanism: generated projections, symlinks, direct discovery, and hand-authored runtime configs coexist. The largest release-note risk is therefore contract drift in counts and defaults, not absence of enforcement. The next pass should use the tagged-history boundary and live code paths to separate confirmed breaking changes from narrative claims.
