## git-hooks-check
- Purpose: SessionStart guard that checks every versioned hook under `.skilled/scripts/git-hooks/` has a valid, executable symlink in the effective hooks dir, names each invalid one (`missing`, `broken`, `mismatched`, `non-executable`) in a single stderr line with the fix command, and, when live-sync is on, self-heals by running the installer from the main checkout only. It never blocks: every path exits 0.
- Kind: hook (SessionStart advisory guard, bash)
- Code: .skilled/hooks/git-hooks-check/, .skilled/bin/check-git-hooks.sh, .skilled/scripts/install-git-hooks.sh
- Runtimes: claude, codex, cursor, devin (adapter folders); no opencode, pi or dsh folder — OpenCode runs it from `.opencode/plugins/session-cleanup.js`, and Pi and DSH run it inside their session-start advisories
- Mirrors: none same-named — launched by .opencode/plugins/session-cleanup.js and by .pi/extensions/session-start-advisories.ts (one-line re-export of .skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts)
- Kill switch: SYSTEM_GIT_HOOKS_CHECK_DISABLED (caller-side alias `SPECKIT_GIT_HOOKS_GUARD=off`, master SYSTEM_HOOKS_DISABLED)
- Packets:
  - OWNS | CHILD | specs/system-speckit/memory-search-and-knowledge/003-memory-search-intelligence/002-speckit-memory/025-git-hooks-reinstall-and-guard | Feature Specification: Git Hooks Reinstall and Presence Guard
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/015-dsh-hook-parity | Feature Specification: Phase 15: dsh-hook-parity
- Evidence: .skilled/bin/check-git-hooks.sh:33 (`[ "${SPECKIT_GIT_HOOKS_GUARD:-on}" = "off" ] && exit 0`), .skilled/bin/check-git-hooks.sh:120 (`INVALID+=("$name (mismatched)")` — the four-state symlink classification), .skilled/bin/check-git-hooks.sh:149-152 (self-heal runs only when `git-dir` equals `git-common-dir`, i.e. the main checkout)
- Unsure: The feature-name search matched only the dsh parity table; the owning packet was found by searching `check-git-hooks` (the script name) instead, and `specs/hooks-plugins-extensions/git-live-follow/001-live-sync-harden-default-on` also modifies the script without using the concern name. The warning text and the README name `.opencode/scripts/install-git-hooks.sh` while the self-heal resolves `$SOURCE_ROOT/scripts/install-git-hooks.sh`; both files exist in this checkout, so which one ships is not settled by reading.

---

## git-live-follow
- Purpose: SessionStart primitive that keeps the operator's primary checkout current with the shared live branch: `--start` backgrounds exactly one follower per checkout, which fetches on an interval and advances a behind-only tip with `git merge --ff-only`, logging each state change under the git common dir. It never merges, rebases or resets, so a diverged or colliding tree is warned about and left alone.
- Kind: hook (SessionStart primitive plus a detached background follower, bash)
- Code: .skilled/hooks/git-live-follow/, .skilled/bin/git-live-follow.sh
- Runtimes: claude, codex, cursor, devin, dsh, pi (adapter folders); no opencode folder — OpenCode runs it from `.opencode/plugins/session-cleanup.js`
- Mirrors: none same-named — launched by .opencode/plugins/session-cleanup.js and by .pi/extensions/session-start-advisories.ts; `.dsh/plugins/repo-guards/adapters/` has no link for it, DSH runs it from its session-start advisories
- Kill switch: SYSTEM_LIVE_FOLLOW_DISABLED (master SYSTEM_LIVE_SYNC_DISABLED disables the whole loop; SYSTEM_HOOKS_DISABLED above both)
- Packets:
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/git-live-follow/001-live-sync-harden-default-on | Feature Specification: live-sync hardening and default-on for the always-current live branch
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/git-live-follow/002-live-follow-disjoint-ff | Feature Specification: Live-Sync Disjoint Fast-Forward
  - OWNS | CHILD | specs/system-speckit/runtime-and-release/001-system-speckit-v4/014-daemon-and-test-harness-hardening/004-live-follow-log-hygiene | Feature Specification: Phase 4: Live-Follow Log Hygiene
  - MENTIONS | TOP-LEVEL | specs/hooks-plugins-extensions/git-primary-reconcile/002-rebase-abort-head-preservation | Feature Specification: Rebase-Abort HEAD Preservation
  - MENTIONS | TOP-LEVEL | specs/cli-classifier/003-cli-jev-workflow-integration/055-alignment-and-hook-parity | Feature Specification: Phase 55: alignment-and-hook-parity
  - MENTIONS | TOP-LEVEL | specs/system-speckit/runtime-and-release/001-system-speckit-v4/014-daemon-and-test-harness-hardening | Feature Specification: Daemon Lifecycle and Test-Harness Hardening
  - MENTIONS | CHILD | specs/system-speckit/runtime-and-release/001-system-speckit-v4/014-daemon-and-test-harness-hardening/002-orphan-daemon-reaping | Feature Specification: Phase 2: Orphan Daemon Reaping
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/015-dsh-hook-parity | Feature Specification: Phase 15: dsh-hook-parity
  - MENTIONS | TOP-LEVEL | specs/system-skill-advisor/runtime-lifecycle/003-model-server-lifecycle | Feature Specification: Model server lifecycle: default spawn and daemon memory
  - MENTIONS | CHILD | specs/system-skill-advisor/runtime-lifecycle/003-model-server-lifecycle/002-advisor-daemon-memory | Feature Specification: Advisor daemon memory footprint
  - MENTIONS | TOP-LEVEL | specs/sk-code/verification-guards/001-code-conformance-alignment | Feature Specification: Code Conformance Alignment to the sk-code / code-skilled Standard
  - MENTIONS | CHILD | specs/commands/002-doctor-audit-and-fixes/002-doctor-audit-followups/032-orphan-process-check | Feature Specification: Phase 32: orphan-process-check
  - 2 more MENTIONS omitted
- Evidence: .skilled/bin/git-live-follow.sh:234 (`git merge --ff-only --quiet "$remote_tip"` — the only advance path), .skilled/bin/git-live-follow.sh:248 (`log_state_change "diverged:$ahead:$behind"` — divergence is recorded, never repaired), .skilled/bin/git-live-follow.sh:174-175 (`hook_enabled live-sync` / `hook_enabled live-follow` gate `--start`)
- Unsure: The README's runtime table lists Claude, Codex, Cursor, Devin, Pi and OpenCode but not DSH, while `dsh/` holds a README plus a symlink and `.skilled/hooks/README.md:356` does count dsh. The feature-name search returned 14 packets, so the packet list is a selection, not a census.

---

## git-primary-reconcile
- Purpose: SessionStart primitive that converges the primary checkout onto its live branch: it fast-forwards a behind-only tip, and when the checkout is ahead on a clean tree it rebases onto the remote tip and pushes, aborting the rebase back to the exact pre-rebase HEAD on failure. It acts only in the main checkout, only on the resolved live branch, and records every outcome (skip / advance / block / publish) to a common-dir log.
- Kind: hook (SessionStart primitive, bash)
- Code: .skilled/hooks/git-primary-reconcile/, .skilled/bin/git-primary-reconcile.sh
- Runtimes: claude, codex, cursor, devin, dsh, pi (adapter folders); no opencode folder — OpenCode runs it from `.opencode/plugins/session-cleanup.js`
- Mirrors: none same-named — launched by .opencode/plugins/session-cleanup.js and by .pi/extensions/session-start-advisories.ts; `.dsh/plugins/repo-guards/adapters/` has no link for it, DSH runs it from its session-start advisories
- Kill switch: SYSTEM_PRIMARY_RECONCILE_DISABLED (master SYSTEM_LIVE_SYNC_DISABLED disables the whole loop; SYSTEM_HOOKS_DISABLED above both)
- Packets:
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/git-primary-reconcile/001-hook-gate-hardening | Feature Specification: git hook gate hardening
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/git-live-follow/002-live-follow-disjoint-ff | Feature Specification: Live-Sync Disjoint Fast-Forward
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/git-primary-reconcile/002-rebase-abort-head-preservation | Feature Specification: Rebase-Abort HEAD Preservation
  - MENTIONS | TOP-LEVEL | specs/hooks-plugins-extensions/git-hooks/003-prepush-naming-gate-residue | Feature Specification: Remove the deleted pre-push naming gate's residue
  - MENTIONS | TOP-LEVEL | specs/cli-classifier/003-cli-jev-workflow-integration/055-alignment-and-hook-parity | Feature Specification: Phase 55: alignment-and-hook-parity
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/015-dsh-hook-parity | Feature Specification: Phase 15: dsh-hook-parity
  - MENTIONS | CHILD | specs/commands/002-doctor-audit-and-fixes/002-doctor-audit-followups/030-cursor-reconcile-test-exemption | Feature Specification: Phase 30: cursor-reconcile-test-exemption
- Evidence: .skilled/bin/git-primary-reconcile.sh:229 (`git merge --ff-only --quiet "$REMOTE_TIP"` — the behind-only advance), .skilled/bin/git-primary-reconcile.sh:267 (a pre-existing rebase is refused, never aborted), .skilled/bin/git-primary-reconcile.sh:177-178 (`hook_enabled live-sync` / `hook_enabled primary-reconcile` short-circuit to a recorded skip)
- Unsure: The README's runtime table omits DSH although `dsh/` exists and `.skilled/hooks/README.md:355` counts it. `030-cursor-reconcile-test-exemption` is about the test that asserts the Cursor wiring rather than the script itself, so its OWNS/MENTIONS call is a judgment.

---

## git-worktree-guard
- Purpose: SessionStart guard that warns when a top-level session is running on the shared checkout instead of an isolated worktree, naming the branch and the `worktree-session.sh` launch command. It skips orchestrated children (`AI_SESSION_CHILD=1`) and linked worktrees, and always exits 0.
- Kind: hook (SessionStart advisory guard, bash)
- Code: .skilled/hooks/git-worktree-guard/, .skilled/bin/worktree-guard.sh
- Runtimes: claude, codex, cursor, devin (adapter folders); no opencode, pi or dsh folder — `.opencode/plugins/session-cleanup.js` and the Pi/DSH session-start advisories run it
- Mirrors: none same-named — launched by .opencode/plugins/session-cleanup.js and by .pi/extensions/session-start-advisories.ts (one-line re-export of .skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts)
- Kill switch: SYSTEM_GIT_WORKTREE_GUARD_DISABLED (legacy alias `SYSTEM_WORKTREE_GUARD_DISABLED`, caller-side `SPECKIT_WORKTREE_GUARD=off`, master SYSTEM_HOOKS_DISABLED)
- Packets:
  - OWNS | CHILD | specs/system-speckit/memory-search-and-knowledge/001-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening/006-sessionstart-worktree-guard | Feature Specification: Wire worktree-guard into the Claude SessionStart hook chain
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/015-dsh-hook-parity | Feature Specification: Phase 15: dsh-hook-parity
  - MENTIONS | CHILD | specs/system-speckit/memory-search-and-knowledge/003-memory-search-intelligence/002-speckit-memory/025-git-hooks-reinstall-and-guard | Feature Specification: Git Hooks Reinstall and Presence Guard
- Evidence: .skilled/bin/worktree-guard.sh:43 (`[ "${AI_SESSION_CHILD:-}" = "1" ] && exit 0` — the orchestrated-child exemption), .skilled/bin/worktree-guard.sh:46 (`git rev-parse --git-common-dir` — the shared-vs-isolated test), .skilled/bin/worktree-guard.sh:81 (the one warning line naming the branch and `worktree-session.sh`)
- Unsure: The feature-name search matched only the dsh parity table; the owning packet was found by searching `worktree-guard` (the script name). No Pi or DSH adapter folder exists, but both run the script from their session-start advisories, so the folder list understates coverage.

---

## git-preflight-and-message-gate
- Purpose: Two pre-tool git guards over one rule engine: the advisory evaluates a directly visible `git ...` command against 17 state-based checks and surfaces up to three findings without changing permission or exit path, while the message gate denies a `git commit` message, a `gh pr create`/`edit` body or a branch name that breaks the repository's own sk-git templates. The advisory fails open on every error; the gate allows only what it cannot read.
- Kind: mix: hook (advisory) + hook (blocking gate) + shared rule-engine library
- Code: .skilled/hooks/git-preflight/, .skilled/hooks/git-message-gate/, .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs, .skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs, .skilled/skills/sk-git/scripts/lib/git-rule-checks.mjs, .skilled/skills/sk-git/scripts/lib/git-context.mjs, .skilled/skills/sk-git/scripts/lib/message-contract.mjs
- Runtimes: dsh, opencode, pi (adapter folders) plus `shared/` and `tests/`; claude, codex, cursor and devin register the shared `.mjs` directly from `.skilled/skills/sk-git/scripts/hooks/` and have no folder of their own
- Mirrors: .opencode/plugins/sk-git-preflight-advisory.js, .opencode/plugins/sk-git-message-gate.js, .pi/extensions/git-preflight-advisory.ts, .pi/extensions/git-message-gate.ts (one-line re-exports), .dsh/plugins/repo-guards/adapters/git-preflight-advisory.mjs, .dsh/plugins/repo-guards/adapters/git-message-gate.mjs
- Kill switch: SK_GIT_PREFLIGHT_DISABLED for the advisory (plus `SKGIT_ADVISORY=0` and `SKGIT_ADVISORY_SKIP`); none found for the message gate
- Packets:
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/git-preflight-and-message-gate/001-template-driven-message-enforcement | Feature Specification: Template-driven, repo-agnostic enforcement of commit messages and PR descriptions
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/git-preflight-and-message-gate/002-advisory-cd-prefix-env-steps | Feature Specification: Teach the git preflight advisory that environment assignments between cd and git keep the cd
  - MENTIONS | TOP-LEVEL | specs/cli-classifier/003-cli-jev-workflow-integration/040-hard-rules-sidecar | Feature Specification: Phase 40: hard-rules-sidecar
  - MENTIONS | CHILD | specs/sk-git/commit-standards/005-git-setup-customization/005-setup-check-hardening | Feature Specification: Phase 5: setup-check-hardening
  - MENTIONS | CHILD | specs/hooks-plugins-extensions/goal/001-goal-hooks-cross-runtime/007-opencode-plugin-symlinks | Feature Specification: OpenCode plugin browsability symlinks in the hooks tree
  - MENTIONS | CHILD | specs/sk-code/hub-architecture/003-sk-code-poinytail-based-refinement/012-post-merge-deep-review/001-hook-stdin-deadlines | Feature Specification: Phase 1: hook-stdin-deadlines
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/015-dsh-hook-parity | Feature Specification: Phase 15: dsh-hook-parity
  - MENTIONS | CHILD | specs/hooks-plugins-extensions/directive-lifecycle/001-injection-bloat-reduction/012-playbook-fails-remediation | Design Specification: Manual Testing Playbook FAIL Remediation
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/009-dsh-context-guards-and-goal-bridge | Feature Specification: Phase 9: dsh-context-guards-and-goal-bridge
  - MENTIONS | CHILD | specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/028-plugin-kill-switch-coverage | Feature Specification: Phase 28: plugin-kill-switch-coverage
  - MENTIONS | CHILD | specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/002-pins-imports-dual-export | Feature Specification: Phase 2: pins-imports-dual-export
  - MENTIONS | CHILD | specs/system-speckit/runtime-and-release/001-system-speckit-v4/069-v4-0-0-3-review-remediation | Feature Specification: v4.0.0.3 review remediation
  - 4 more MENTIONS omitted
- Evidence: .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:96 (`!GIT_SHAPE.test(command)` returns `approve()` — the shape gate), .skilled/skills/sk-git/scripts/lib/git-rule-checks.mjs:241 (`export const GIT_CHECKS = {` — the 17 state-based checks), .skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:306 (`export function evaluateCommand`) and :373 (`permissionDecision: 'deny'`)
- Unsure: Neither feature has a claude/codex/cursor/devin folder because those four register the shared `.mjs` directly, which is why the folder list looks thin. The message gate's switchless design is documented at `.skilled/hooks/README.md:36` rather than enforced by a flag, and `hook-flags.env.example` holds no flag for it. This card merges two features, so the packet list is a 12-entry selection across both searches with 4 low-relevance hits omitted.
