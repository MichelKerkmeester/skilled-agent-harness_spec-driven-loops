## post-edit-quality
- Purpose: Runs quality checkers against a file right after it is written or edited and surfaces bounded, redacted findings back to the model, with one path-dispatch table in `lib/post-edit-router.cjs` deciding which checker applies so policy cannot drift between runtimes. It is warn-only by contract: a missing checker becomes one `quality-notice` finding, every other failure path resolves to no finding, and the edit itself is never blocked.
- Kind: mix: library router core + per-runtime hook adapters + OpenCode plugin + Pi extension
- Code: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs, .skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs, .skilled/hooks/post-edit-quality/codex/post-edit-quality.cjs, .skilled/hooks/post-edit-quality/cursor/post-tool-use.mjs, .skilled/hooks/post-edit-quality/devin/post-edit-quality.cjs, .skilled/hooks/post-edit-quality/dsh/post-edit-quality.mjs, .skilled/hooks/post-edit-quality/pi/post-edit-quality.ts, .skilled/hooks/post-edit-quality/opencode/sk-code-post-edit-quality.js
- Runtimes: claude, codex, cursor, devin, dsh, pi (adapter folders); opencode (browsability symlink to the real plugin in .opencode/plugins/)
- Mirrors: .opencode/plugins/sk-code-post-edit-quality.js, .pi/extensions/post-edit-quality.ts
- Kill switch: SK_CODE_POST_EDIT_QUALITY_DISABLED
- Packets:
  - MENTIONS | CHILD | specs/sk-code/quality-and-review-modes/002-quality-agnostic-gate/001-honest-checker | Feature Specification: Phase 1: honest-checker
  - MENTIONS | CHILD | specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/002-pins-imports-dual-export | Feature Specification: Phase 2: pins-imports-dual-export
  - MENTIONS | CHILD | specs/sk-code/hub-architecture/003-sk-code-poinytail-based-refinement/007-follow-up-fixes/004-hook-stdin-deadline | Feature Specification: Phase 4: hook-stdin-deadline
  - MENTIONS | CHILD | specs/system-speckit/runtime-and-release/001-system-speckit-v4/041-skilled-source-root-migration/006-dual-root-code-and-contracts | Feature Specification: Phase 6: dual-root-code-and-contracts
  - MENTIONS | CHILD | specs/sk-code/verification-guards/001-code-conformance-alignment/001-conformance-rulings-and-gate-repair | Feature Specification: Conformance Rulings and Gate Repair
  - MENTIONS | CHILD | specs/sk-code/hub-architecture/003-sk-code-poinytail-based-refinement/010-round-three-remediation/003-quality-mode | Feature Specification: Phase 3: quality-mode
  - MENTIONS | TOP-LEVEL | specs/hooks-plugins-extensions/hook-platform/003-hook-library-mk-rename | Feature Specification: Hook Library mk- Prefix Rename
  - MENTIONS | TOP-LEVEL | specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat | Research Record: OpenCode v1 and v2 dual compatibility research
  - MENTIONS | CHILD | specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/042-hooks-and-plugins-held-fixes | Feature Specification: Phase 42: hooks-and-plugins-held-fixes
  - MENTIONS | CHILD | specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/006-deep-review-2-remediation | Feature Specification: Phase 6: deep-review-2-remediation
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/015-dsh-hook-parity | Feature Specification: Phase 15: dsh-hook-parity
  - MENTIONS | TOP-LEVEL | specs/hooks-plugins-extensions/goal/001-goal-hooks-cross-runtime/007-opencode-plugin-symlinks | Feature Specification: OpenCode plugin browsability symlinks in the hooks tree
  - 15 more MENTIONS omitted
- Evidence: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:246 (`resolveDispatch` maps an edited file to its applicable checker and returns the first match only), .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:444 (`runChecks` spawns the resolved checker under a shared deadline and collects findings), .skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs:157 (findings leave as a PostToolUse `hookSpecificOutput.additionalContext` envelope; a clean edit writes nothing)
- Unsure: The hub README's per-runtime table covers Claude, Codex, Devin, Cursor, Pi and OpenCode but not DSH, while `dsh/post-edit-quality.mjs` and its own README exist and `.dsh/plugins/repo-guards/adapters/post-edit-quality.mjs` links to it. No `spec.md` takes the router as its main subject under this name: all 27 hits are references, and the closest, `001-honest-checker`, is about the comment-hygiene checker the router spawns.

---

## session-cleanup
- Purpose: Runs bounded startup guards and teardown cleanup. The shell script kills only MCP helper processes it can prove are descendants of an explicit session PID, re-proving that ancestry immediately before each kill and deliberately never falling back to the hook's PPID; the OpenCode plugin also runs the startup guards and a backgrounded primary-reconcile on session start and surfaces any guard warnings once per session.
- Kind: mix: shell teardown script + per-runtime symlinked entries + OpenCode plugin
- Code: .skilled/scripts/session-cleanup.sh, .skilled/hooks/session-cleanup/claude/session-cleanup.sh, .skilled/hooks/session-cleanup/codex/session-cleanup.sh, .skilled/hooks/session-cleanup/cursor/session-cleanup.sh, .skilled/hooks/session-cleanup/devin/session-cleanup.sh, .skilled/hooks/session-cleanup/opencode/session-cleanup.js, .opencode/plugins/session-cleanup.js
- Runtimes: claude, codex, cursor, devin (relative symlinks to the one teardown script); opencode (browsability symlink to the real plugin). No pi and no dsh folder.
- Mirrors: .opencode/plugins/session-cleanup.js; no .pi/extensions entry
- Kill switch: SYSTEM_SESSION_CLEANUP_DISABLED
- Packets:
  - OWNS | CHILD | specs/system-speckit/memory-search-and-knowledge/001-graph-and-context-optimization/007-mcp-daemon-reliability/029-cross-session-kill-scoping | Feature Specification: Cross-Session Kill Scoping + Post-Crash Integrity Gate [system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/029-cross-session-kill-scoping/spec]
  - OWNS | CHILD | specs/system-speckit/memory-search-and-knowledge/001-graph-and-context-optimization/007-mcp-daemon-reliability/021-orphan-sweep-stop-hook-activation | Feature Specification: Orphan-sweep Stop-hook activation
  - OWNS | CHILD | specs/system-speckit/memory-search-and-knowledge/001-graph-and-context-optimization/006-operator-tooling/004-runtime-agnostic-session-lifecycle-scripts | Feature Specification: Runtime-agnostic session lifecycle scripts
  - OWNS | CHILD | specs/system-speckit/memory-search-and-knowledge/001-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/022-orphan-mcp-leak-prevention | Feature Specification: Orphan MCP Leak Prevention
  - MENTIONS | CHILD | specs/system-speckit/memory-search-and-knowledge/003-memory-search-intelligence/002-speckit-memory/040-opencode-temp-worker-reaping | Feature Specification: OpenCode Temp Worker Reaping and Vitest Runaway Prevention
  - MENTIONS | CHILD | specs/system-speckit/memory-search-and-knowledge/003-memory-search-intelligence/002-speckit-memory/042-embedder-relisten-and-reaper-hardening | Feature Specification: Phase 32: Embedder Demand-Listener Relisten and Reaper Hardening
  - MENTIONS | CHILD | specs/system-speckit/runtime-and-release/001-system-speckit-v4/014-daemon-and-test-harness-hardening/002-orphan-daemon-reaping | Feature Specification: Phase 2: Orphan Daemon Reaping
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/015-dsh-hook-parity | Feature Specification: Phase 15: dsh-hook-parity
  - MENTIONS | CHILD | specs/system-speckit/runtime-and-release/001-system-speckit-v4/021-decommission-debt-and-cli-nesting/005-hook-fallback-failure-signal | Feature Specification: Phase 5: hook-fallback-failure-signal
  - MENTIONS | CHILD | specs/system-speckit/memory-search-and-knowledge/001-graph-and-context-optimization/006-operator-tooling/005-worktree-per-session-automation | Feature Specification: Worktree-per-AI-session automation
  - MENTIONS | CHILD | specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/042-hooks-and-plugins-held-fixes | Feature Specification: Phase 42: hooks-and-plugins-held-fixes
  - MENTIONS | TOP-LEVEL | specs/hooks-plugins-extensions/git-live-follow/001-live-sync-harden-default-on | Feature Specification: live-sync hardening and default-on for the always-current live branch
  - 10 more MENTIONS omitted
- Evidence: .skilled/scripts/session-cleanup.sh:8 (the script kills only processes it can prove are descendants of an explicit session PID and re-proves ancestry immediately before each kill, with no PPID fallback), .skilled/scripts/session-cleanup.sh:122 (the kill-time re-proof walks the live ppid chain because the `pgrep` walk is only a snapshot), .opencode/plugins/session-cleanup.js:342 (the plugin acts only on `session.created` to run the startup guards)
- Unsure: The OpenCode plugin's `dispose` runs the teardown with no session PID, so its kill path is a no-op by design; that is what the README states and I did not run the script to observe it. The orphan sweeper the no-session-PID fallback delegates to, `.skilled/scripts/orphan-mcp-sweeper.sh`, is outside this folder and I only saw it named, not read.

---

## session-lifecycle
- Purpose: Primes continuity context into a fresh session, checkpoints state on stop and re-injects the recovered brief after a compaction, through one adapter per runtime that fires on that runtime's session start, stop and compaction boundaries. Every adapter is advisory and context-only and fails open: a missing payload, unreadable transcript, parse error or internal error resolves to a no-op.
- Kind: mix: per-runtime hook adapters + Pi extensions + DSH plugin adapters (the real code lives in `system-spec-kit/runtime/hooks/`)
- Code: .skilled/hooks/session-lifecycle/claude/session-prime.ts, .skilled/hooks/session-lifecycle/claude/session-stop.ts, .skilled/hooks/session-lifecycle/claude/compact-inject.ts, .skilled/hooks/session-lifecycle/codex/session-start.ts, .skilled/hooks/session-lifecycle/codex/session-stop.ts, .skilled/hooks/session-lifecycle/codex/compact-inject.ts, .skilled/hooks/session-lifecycle/cursor/session-start.ts, .skilled/hooks/session-lifecycle/cursor/session-end.ts, .skilled/hooks/session-lifecycle/cursor/precompact.ts, .skilled/hooks/session-lifecycle/devin/session-start.ts, .skilled/hooks/session-lifecycle/devin/session-stop.ts, .skilled/hooks/session-lifecycle/devin/post-compaction.cjs, .skilled/hooks/session-lifecycle/dsh/session-start-context.mjs, .skilled/hooks/session-lifecycle/pi/session-start-context.ts
- Runtimes: claude, codex, cursor, devin, dsh, pi (adapter folders); no opencode folder, by design — OpenCode session events run inside the owning plugins
- Mirrors: .pi/extensions/session-start-context.ts, .pi/extensions/session-stop-context.ts, .pi/extensions/session-compact-context.ts, .pi/extensions/session-start-advisories.ts; no .opencode/plugins mirror
- Kill switch: SYSTEM_SESSION_LIFECYCLE_DISABLED
- Packets:
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/015-dsh-hook-parity | Feature Specification: Phase 15: dsh-hook-parity
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/011-vibe-context-and-goal-hooks | Feature Specification: Phase 11: vibe-context-and-goal-hooks
  - MENTIONS | CHILD | specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/004-conversation-adoption-build/001-cli-pi | Feature Specification: Phase 1: cli-pi
  - MENTIONS | CHILD | specs/system-speckit/memory-search-and-knowledge/001-graph-and-context-optimization/006-operator-tooling/004-runtime-agnostic-session-lifecycle-scripts | Feature Specification: Runtime-agnostic session lifecycle scripts
  - MENTIONS | CHILD | specs/system-speckit/runtime-and-release/001-system-speckit-v4/032-recorded-findings-closure/001-hook-adapter-thin-transports | Feature Specification: Phase 1: hook-adapter-thin-transports
  - MENTIONS | CHILD | specs/system-speckit/runtime-and-release/001-system-speckit-v4/032-recorded-findings-closure/013-gate1-instruction-parity | Feature Specification: Phase 13: gate1-instruction-parity
  - MENTIONS | TOP-LEVEL | specs/system-speckit/memory-search-and-knowledge/001-graph-and-context-optimization | Feature Specification: Graph and Context Optimization [system-spec-kit/026-graph-and-context-optimization/spec]
  - MENTIONS | CHILD | specs/system-speckit/memory-search-and-knowledge/001-graph-and-context-optimization/000-release-and-program-cleanup/013-comprehensive-audit-remediation/002-retrieval-scope-hardening | Feature Specification: Phase 2: retrieval-scope-hardening
  - MENTIONS | CHILD | specs/sk-git/worktree-lifecycle/004-fsmonitor-daemon-and-worktree-relocation-regression/006-numbered-worktree-cleanup | Feature Specification: Phase 6: numbered-worktree-cleanup
  - MENTIONS | CHILD | specs/sk-git/worktree-lifecycle/004-fsmonitor-daemon-and-worktree-relocation-regression/005-reaper-hardening | Feature Specification: Phase 5: reaper-hardening
  - MENTIONS | CHILD | specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/004-conversation-adoption-build | Feature Specification: Conversation adoption build
  - MENTIONS | TOP-LEVEL | specs/hooks-plugins-extensions/skill-advisor/001-pi-input-hook-latency | Feature Specification: PI input-hook latency (drop the synchronous spawn chain)
- Evidence: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:6 (the SessionStart hook injects context by branching on the session source: compact, startup, resume, clear), .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:8 (PreCompact caches the merged context to hook state and deliberately emits no stdout), .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:5 (the Stop hook parses the transcript for token usage and updates session state)
- Unsure: No `spec.md` takes this concern as its main subject under the name `session-lifecycle`; all 12 hits are references. The closest, `004-runtime-agnostic-session-lifecycle-scripts`, is about the shell cleanup scripts (session-cleanup), not these adapters. The hub entries are symlinks into `system-spec-kit/runtime/hooks/` and their `.js` siblings point at `dist/`, so the executed files resolve only after a build.

---

## session-relaunch
- Purpose: Hands unfinished work to a fresh session in the same terminal when a runtime nears its context limit: each adapter asks for a handoff near its threshold, the sender prepares a note and the adapter arms a matching record, and `skilled-loop` relaunches the runtime with a claim seed when the record is armed, fresh and below the hop cap. A record still pending at exit makes the wrapper print a manual claim command for the selected runtime and consume the record.
- Kind: mix: shared core library + per-runtime adapters + OpenCode plugin + Pi extension + CLI + shell wrapper
- Code: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs, .skilled/hooks/session-relaunch/lib/nudge.cjs, .skilled/hooks/session-relaunch/lib/killer.cjs, .skilled/hooks/session-relaunch/bin/session-relaunch.cjs, .skilled/hooks/session-relaunch/claude/context-nudge.mjs, .skilled/hooks/session-relaunch/claude/stop-arm.mjs, .skilled/hooks/session-relaunch/codex/context-nudge.mjs, .skilled/hooks/session-relaunch/codex/stop-arm.mjs, .skilled/hooks/session-relaunch/opencode/session-relaunch.js, .skilled/hooks/session-relaunch/pi/session-relaunch.ts, .skilled/bin/skilled-loop
- Runtimes: claude, codex, opencode, pi (adapter folders); cursor and devin are command-only with no adapter folder
- Mirrors: .opencode/plugins/session-relaunch.js, .pi/extensions/session-relaunch.ts
- Kill switch: SYSTEM_SESSION_RELAUNCH_DISABLED
- Packets:
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/session-handover/002-session-handover-loop | Feature Specification: Session relaunch loop
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration | Feature Specification: Move the session history lookup out of the compaction path and into the in-session handover, so a receiving session can look up the sender's earlier turns.
  - OWNS | CHILD | specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/003-relaunch-goal-quote | Feature Specification: Phase 3: relaunch-goal-quote
  - OWNS | CHILD | specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/045-relaunch-takeover-lock-identity | Feature Specification: Phase 45: relaunch-takeover-lock-identity
  - OWNS | CHILD | specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/048-skilled-loop-shared-nudge-formatter | Feature Specification: Phase 48: skilled-loop-shared-nudge-formatter
  - OWNS | CHILD | specs/system-speckit/repo-operations/002-ci-workflow-efficiency/013-killer-test-spawn-race | Feature Specification: Phase 13: killer-test-spawn-race
  - MENTIONS | TOP-LEVEL | specs/hooks-plugins-extensions/pi-extensions/012-file-relative-adapter-imports | Feature Specification: Pi loads hook adapters on every version
  - MENTIONS | TOP-LEVEL | specs/hooks-plugins-extensions/ask-surface-guard/001-ask-surface-enforcement | Feature Specification: Enforce asking operator decisions through each runtime's native ask-question tool instead of prose option menus
  - MENTIONS | CHILD | specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/008-hop-purpose-rule-parity | Feature Specification: Phase 8: hop-purpose-rule-parity
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/008-vibe-repo-guards | Feature Specification: Phase 8: vibe-repo-guards
  - MENTIONS | CHILD | specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/019-plugins-compat-docs | Feature Specification: Phase 19: plugins-compat-docs
  - MENTIONS | CHILD | specs/system-deep-loop/review-lineage/001-review-and-cli-lineage/009-findings-summary-integrity | Feature Specification: Phase 9: findings-summary-integrity
  - 140 more MENTIONS omitted
- Evidence: .skilled/hooks/session-relaunch/lib/nudge.cjs:132 (the nudge text reports the context fill as `[session-relaunch] Context is about N% full.`), .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:50 (the claim seed the wrapper relaunches with is `[session-relaunch] claim and continue handoff `), .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:29 (`prepare` validates the note, writes the pending record the runtime arms, and prints the claim command outside a loop or at the hop limit)
- Unsure: 95 of the 152 `spec.md` hits are children of `002-session-relaunch-loop`; the brief asked for that packet once, so its children are inside the omitted count rather than listed. `skilled-loop` and `skilled-loop-shell.sh` sit in `.skilled/bin/`, outside the feature folder: I confirmed both exist but read the wrapper only through the README, not its body. Cursor and Devin have no adapter folder, so their hop runs only after `/speckit:handoff`.

---

## skill-advisor
- Purpose: Surfaces prompt-safe routing context when a user submits a prompt: it scores the prompt against the maintained skill graph and, when a match clears the confidence threshold, injects an advisory brief naming the matching skill or the runnable command that owns it. The brief never replaces explicit skill loading, never persists raw prompt text, and never blocks the prompt — a timeout, failure or no-route resolves to the directives fallback instead.
- Kind: mix: per-runtime hook adapters + OpenCode plugin + Pi extension (the handler and scoring live in `system-skill-advisor`)
- Code: .skilled/hooks/skill-advisor/claude/user-prompt-submit.ts, .skilled/hooks/skill-advisor/codex/user-prompt-submit.ts, .skilled/hooks/skill-advisor/cursor/user-prompt-submit.ts, .skilled/hooks/skill-advisor/devin/user-prompt-submit.ts, .skilled/hooks/skill-advisor/dsh/prompt-advisor.mjs, .skilled/hooks/skill-advisor/pi/prompt-advisor.ts, .skilled/hooks/skill-advisor/opencode/system-skill-advisor.js
- Runtimes: claude, codex, cursor, devin, dsh, pi, opencode (all seven folders exist)
- Mirrors: .opencode/plugins/system-skill-advisor.js, .pi/extensions/prompt-advisor.ts
- Kill switch: SYSTEM_SKILL_ADVISOR_DISABLED
- Packets:
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/skill-advisor/002-pi-advisor-bridge | Feature Specification: Pi advisor bridge: brief restore and stderr diagnostic
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/skill-advisor/001-pi-input-hook-latency | Feature Specification: PI input-hook latency (drop the synchronous spawn chain)
  - OWNS | CHILD | specs/hooks-plugins-extensions/skill-advisor/002-pi-advisor-bridge/001-restore-pi-advisor-brief | Feature Specification: restore the pi skill advisor brief: probe either root name for the warm-CLI assets and key the directive dedup receipt on the full contribution
  - OWNS | CHILD | specs/hooks-plugins-extensions/skill-advisor/002-pi-advisor-bridge/002-pi-advisor-diagnostic-stderr | Feature Specification: Pi advisor diagnostic on stderr
  - OWNS | CHILD | specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/002-hook-deadline-and-diagnostics | Feature Specification: Hook Deadline and Diagnostics
  - MENTIONS | TOP-LEVEL | specs/hooks-plugins-extensions/hook-platform/002-hook-docs-relocation | Feature Specification: Hook Reference Docs Relocation
  - MENTIONS | TOP-LEVEL | specs/hooks-plugins-extensions/hook-platform/004-hook-feature-flags-and-hub-index | Feature Specification: Hook Feature Flags + Full Hub Index
  - MENTIONS | CHILD | specs/system-speckit/memory-search-and-knowledge/001-graph-and-context-optimization/006-operator-tooling/001-hook-parity/004-fix-opencode-plugin-loader-bridge | ...ystem-spec-kit/026-graph-and-context-optimization/007-hook-parity/005-fix-opencode-plugin-loader-bridge/spec]
  - MENTIONS | TOP-LEVEL | specs/system-skill-advisor/host-integrations/001-mcp-decommission-cli-front-door | Feature Specification: skill advisor MCP decommission
  - MENTIONS | TOP-LEVEL | specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement | Phase Parent: Pi Skill Orchestrator Research for Skill Advisor Refinement
  - MENTIONS | CHILD | specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/004-headless-fallback-status-and-dedup | Feature Specification: Headless Fallback Status and Dedup
  - MENTIONS | CHILD | specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/010-review-advisories-and-codex-cleanup | Feature Specification: Closing the Review Advisories and the Codex Hook Cleanup
  - 22 more MENTIONS omitted
- Evidence: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:5 (the handler runs on Claude Code UserPromptSubmit and emits a JSON `additionalContext` envelope, failing open on all errors), .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:73 (`isHookEnabled('skill-advisor')` gates the handler), .opencode/plugins/system-skill-advisor.js:713 (the plugin shells out to the advisor CLI's `advisor_recommend` front door)
- Unsure: The bare term `skill-advisor` matches 518 `spec.md` files, so this list follows the two narrower searches the brief named (`skill-advisor hook`, `prompt-advisor`), which yield 34 hits; it is a selection, not a census. The hub's `pi/prompt-advisor.ts` is a symlink to `system-skill-advisor/hooks/pi/prompt-advisor.ts`, and the Claude/Codex/Cursor/Devin hub entries are symlinks to the shims and compiled hooks. One listed title is stored truncated in its own frontmatter, so it is reproduced as found.
