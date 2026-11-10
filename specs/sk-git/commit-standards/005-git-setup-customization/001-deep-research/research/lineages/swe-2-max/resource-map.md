---
title: "Resource Map — swe-2-max detached lineage"
trigger_phrases: []
---
# Resource Map — swe-2-max detached lineage

Emitted at synthesis. All sources are local repository paths; no external fetches were used.

## sk-code precedent (doctor setup model)

| Resource | Role | Iterations |
|---|---|---:|
| .skilled/commands/doctor/sk-code.md | Owner-scoped doctor command shape | 1 |
| .skilled/commands/doctor/scripts/sk-code-setup-check.cjs | Read-only battery contract: per-leg PASS/FAIL/SKIP, repair: lines, exit 0/1/2, STATUS= last line | 1, 2 |
| .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml | Single-step read-only workflow; repair-is-operator-action invariant | 2, 5 |
| .skilled/commands/doctor/assets/doctor-sk-code-presentation.txt | Verdict table + result templates | 1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build | External-surface design decisions | 2 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build | Setup battery implementation spec; rejected alternatives X1-X11 | 2 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/028-surface-setup-hardening-research | Placement decision matrix; owner-scoped target recommendation | 2 |

## sk-git skill surface

| Resource | Role | Iterations |
|---|---|---:|
| .skilled/skills/sk-git/SKILL.md | Behavioral contract: workspace rules, push permission, commit grammar, preflight advisory, provisioning invariant | 3 |
| .skilled/skills/sk-git/hard-rules.json | 17 warn-severity advisory rules {id,check,message} | 3, 5 |
| .skilled/skills/sk-git/assets/commit-message-template.md | §7 "Enforced rules" JSON block = the enforced contract; .sk-git/ override documented | 3 |
| .skilled/skills/sk-git/scripts/lib/message-contract.mjs | resolveContractDir order: skgit.contractDir → .sk-git/ → shipped assets; ContractError on missing dir | 3 |
| .skilled/skills/sk-git/scripts/validate-message.mjs | Exit 1 violation / 2 contract-broken (treated as block); --explain mode | 3 |
| .skilled/skills/sk-git/scripts/remote-branch-allowlist.txt | Additive glob exemptions file | 3 |
| .skilled/skills/sk-git/references/remote-branch-policy.md | main+skilled/v* hardcoded; SPECKIT_ALLOW_REMOTE_PUSH semantics; fail-open boundary | 3 |
| .skilled/skills/sk-git/scripts/worktree-naming.sh | worktrees/branches NNN-slug grammar; speckit.worktreeBase/SPECKIT_WORKTREE_BASE; allowlist + provision-paths resolvers | 3, 5 |
| .skilled/skills/sk-git/scripts/worktree-provision-paths.txt | Per-repo provisioning dependency list | 3, 5 |
| .skilled/skills/sk-git/scripts/commit-id-naming.sh | 7-digit ordinal allocator; common-dir lock + high-water | 3 |
| .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs | PreToolUse advisory; MAX_ADVISORIES=3; fail-open; SKGIT_ADVISORY* tiers | 4 |
| .skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs | Agent-side blocking gate; per-runtime envelopes; no suppression | 4 |
| .skilled/skills/sk-git/scripts/hooks/opencode/, pi/ | Runtime adapter copies of advisory + message gate | 4 |

## Global git hooks

| Resource | Role | Iterations |
|---|---|---:|
| .skilled/scripts/git-hooks/README.md | Hook system contract: gates inventory, trust semantics, source-root selection | 4 |
| .skilled/scripts/git-hooks/pre-commit, pre-push, commit-msg, prepare-commit-msg, post-commit, post-merge, post-rewrite | Six lifecycle hooks; identical source-root + trust blocks | 4 |
| .skilled/scripts/git-hooks/lib/gates.tsv | Single gate registry: 13 persistable + 2 non-persistable approvals | 4 |
| .skilled/scripts/git-hooks/lib/gate-config.sh | speckit.hooks.<key> reader (local/global, never -c) | 4 |
| .skilled/scripts/git-hooks/lib/commit-id-policy.sh | skilled.commitId local-only opt-in + auto-detect | 3, 4 |
| .skilled/scripts/install-git-hooks.sh | Installer: ownership check, --status (scope, SHADOWED, contract), --uninstall, worktree warning | 4 |
| .skilled/hooks/shared/hook-flags.{cjs,mjs} | isHookEnabled: SYSTEM_HOOKS_DISABLED master + per-concern keys | 4 |
| .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs | evaluate()/readHardRules: unknown check names silently skipped | 5 |

## Doctor command surface

| Resource | Role | Iterations |
|---|---|---:|
| .skilled/commands/doctor/git.md | /doctor:git router: input gate, execution targets, presentation boundary | 4, 5 |
| .skilled/commands/doctor/_routes.yaml | Canonical route manifest; schema; sk-code setup + git hooks/standards rows | 5 |
| .skilled/commands/doctor/scripts/git-standards.cjs | status/init/set/disable/check; dry-run default; .sk-git/ override tool | 3 |
| .skilled/commands/doctor/scripts/git-hook-gates.cjs | list/set over gates.tsv; refuses non-persistable | 4 |
| .skilled/commands/doctor/assets/doctor-git-hooks.yaml, doctor-git-standards.yaml | Mutating workflows (repair side) | 5 |
| .skilled/commands/doctor/assets/doctor-git-presentation.txt | Presentation contract for a new target | 5 |

## Workflow contract sources

| Resource | Role | Iterations |
|---|---|---:|
| .skilled/skills/system-deep-loop/deep-research/SKILL.md | Loop contract | init |
| .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl | Per-iteration output contract | init |
| .skilled/agents/deep-research.md | Leaf-agent contract | init |
