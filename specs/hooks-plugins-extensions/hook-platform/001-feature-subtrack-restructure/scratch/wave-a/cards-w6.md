## spec-gate
- Purpose: The single runtime-neutral Gate-3 policy: it asks for a spec folder before the first file mutation of a session, remembers the answer in per-session state, and turns each Write, Edit or Bash call into `allow`, `advise` or `deny`. The question is delivered at the first mutation rather than appended to a write-intent turn, and denial is opt-in.
- Kind: mix: library policy core + per-runtime hook adapters + OpenCode plugin + Pi extensions
- Code: .skilled/hooks/spec-gate/, .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs, .skilled/hooks/spec-gate/claude/spec-gate-classify.mjs, .skilled/hooks/spec-gate/claude/spec-gate-enforce.mjs, .skilled/hooks/spec-gate/codex/spec-gate-enforce.mjs, .skilled/hooks/spec-gate/cursor/spec-gate-prebind.mjs, .skilled/hooks/spec-gate/devin/spec-gate-enforce.mjs, .skilled/hooks/spec-gate/dsh/spec-gate-enforce.mjs, .skilled/hooks/spec-gate/pi/spec-gate-enforce.ts, .skilled/hooks/spec-gate/opencode/system-spec-gate.js
- Runtimes: claude, codex, cursor, devin, dsh, pi (adapter folders); opencode (browsability symlink to the real plugin in .opencode/plugins/)
- Mirrors: .opencode/plugins/system-spec-gate.js, .pi/extensions/spec-gate-classify.ts, .pi/extensions/spec-gate-enforce.ts
- Kill switch: SYSTEM_SPEC_GATE_DISABLED
- Packets:
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/spec-gate/001-spec-gate-question-noise | Feature Specification: Spec-gate question noise (stop per-turn re-injection across all runtimes)
  - OWNS | CHILD | specs/system-speckit/runtime-and-release/001-system-speckit-v4/048-gate-3-mutation-time-delivery | Feature Specification: Phase 1: gate-3-mutation-time-delivery
  - OWNS | CHILD | specs/hooks-plugins-extensions/directive-lifecycle/001-injection-bloat-reduction/005-gate3-relay-edge-triggering | Feature Specification: Gate-3 Relay Edge-Triggering
  - OWNS | CHILD | specs/system-speckit/runtime-and-release/001-system-speckit-v4/040-gate-3-option-merge | Feature Specification: Phase 1: gate-3-option-merge
  - OWNS | CHILD | specs/system-speckit/runtime-and-release/001-system-speckit-v4/049-gate-3-delivery-residue | Feature Specification: Phase 49: Gate-3 delivery residue
  - OWNS | CHILD | specs/system-speckit/spec-folder-tooling/001-spec-folder-lifecycle/003-spec-folder-tooling/009-gate-3-menu-series-parent | Feature Specification: Carry the series parent into the runtime Gate 3 menu
  - OWNS | CHILD | specs/system-speckit/spec-folder-tooling/001-spec-folder-lifecycle/003-spec-folder-tooling/016-research-recommendations/014-gate-3-menu-parity | Feature Specification: Gate 3 menu parity
  - OWNS | CHILD | specs/system-speckit/runtime-and-release/004-v4-release-line-research/009-gate3-and-continuity-root | Feature Specification: Phase 9: gate3-and-continuity-root
  - MENTIONS | TOP-LEVEL | specs/hooks-plugins-extensions/hook-platform/004-hook-feature-flags-and-hub-index | Feature Specification: Hook Feature Flags + Full Hub Index
  - MENTIONS | TOP-LEVEL | specs/hooks-plugins-extensions/skill-advisor/001-pi-input-hook-latency | Feature Specification: PI input-hook latency (drop the synchronous spawn chain)
  - MENTIONS | CHILD | specs/system-speckit/runtime-and-release/001-system-speckit-v4/032-recorded-findings-closure/001-hook-adapter-thin-transports | Feature Specification: Phase 1: hook-adapter-thin-transports
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/015-dsh-hook-parity | Feature Specification: Phase 15: dsh-hook-parity
  - 46 more hits omitted
- Evidence: .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1611 (`classifyIntent` opens the gate on a mutation-intent turn or parses an answer to an already-open gate), .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:1763 (`evaluateMutation` returns allow/advise/deny from the cached gate state), .skilled/hooks/spec-gate/claude/spec-gate-enforce.mjs:5 (the Claude adapter imports the shared core and only formats its answer)
- Unsure: The `.skilled/hooks/spec-gate/` tree holds relative symlinks; the real adapter files live under `system-spec-kit/runtime/hooks/`. `SYSTEM_SPEC_GATE_ENFORCE` promotes advise to deny and is not a kill switch, so it is not listed as one. I did not open the DSH adapter beyond confirming the symlink.

---

## task-dispatch
- Purpose: Gates Task-tool dispatches before they run: a runtime-neutral core resolves the real target agent, warns or rejects a Deep Route mode the agent's registry does not list, and counts non-command-driven hand-offs to the two command-owned loop executors so a recreated iteration loop is caught. A Claude-only guard denies the three subagent shapes that would inherit a Fable main-loop model.
- Kind: mix: library policy core + per-runtime hook adapters + OpenCode plugin + Pi extension
- Code: .skilled/hooks/task-dispatch/lib/dispatch-guard.cjs, .skilled/hooks/task-dispatch/claude/task-dispatch-guard.cjs, .skilled/hooks/task-dispatch/claude/fable-subagent-guard.mjs, .skilled/hooks/task-dispatch/cursor/task-dispatch-guard.mjs, .skilled/hooks/task-dispatch/devin/task-dispatch-guard.cjs, .skilled/hooks/task-dispatch/dsh/task-dispatch-guard.mjs, .skilled/hooks/task-dispatch/pi/task-dispatch-guard.ts
- Runtimes: claude, cursor, devin, dsh, pi (adapter folders); opencode (browsability symlink to the real plugin in .opencode/plugins/); no codex adapter
- Mirrors: .opencode/plugins/system-deep-loop-guard.js, .pi/extensions/task-dispatch-guard.ts
- Kill switch: SYSTEM_TASK_DISPATCH_DISABLED
- Packets:
  - MENTIONS | CHILD | specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/042-hooks-and-plugins-held-fixes | Feature Specification: Phase 42: hooks-and-plugins-held-fixes
  - MENTIONS | CHILD | specs/system-deep-loop/loop-architecture/001-deep-loop-innovation/023-cross-runtime-dispatch | Feature Specification: Retire the deep/* Dispatch-Context (Phase-0) Gate
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/001-cli-hermes-creation/010-hermes-hook-parity | Feature Specification: Phase 1: hermes-hook-parity
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/015-dsh-hook-parity | Feature Specification: Phase 15: dsh-hook-parity
  - MENTIONS | CHILD | specs/hooks-plugins-extensions/goal/001-goal-hooks-cross-runtime/007-opencode-plugin-symlinks | Feature Specification: OpenCode plugin browsability symlinks in the hooks tree
  - MENTIONS | CHILD | specs/sk-code/hub-architecture/003-sk-code-poinytail-based-refinement/007-follow-up-fixes/004-hook-stdin-deadline | Feature Specification: Phase 4: hook-stdin-deadline
  - MENTIONS | CHILD | specs/sk-code/hub-architecture/003-sk-code-poinytail-based-refinement/009-round-two-follow-ups/005-hook-stdin-deadlines | Feature Specification: Phase 5: hook-stdin-deadlines
  - MENTIONS | CHILD | specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/043-v2-default-model-and-follow-ups | Feature Specification: Phase 43: v2-default-model-and-follow-ups
  - MENTIONS | CHILD | specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/041-goal-held-fixes | Feature Specification: Phase 41: goal-held-fixes
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/008-dsh-repo-guards-safety-wave | Feature Specification: Phase 8: dsh-repo-guards-safety-wave
  - MENTIONS | CHILD | specs/system-speckit/runtime-and-release/001-system-speckit-v4/005-skills-runtime-state-consolidation | Feature Specification: Consolidate the seven skills-root state directories into .state
  - MENTIONS | CHILD | specs/system-deep-loop/loop-architecture/003-deprecate-improvement-modes/004-commands-and-runtime-mirrors | Feature Specification: Phase 4: commands-and-runtime-mirrors
  - 6 more hits omitted
- Evidence: .skilled/hooks/task-dispatch/lib/dispatch-guard.cjs:993 (`evaluateDispatch` returns the transport-free allow/warn/reject decision), .skilled/hooks/task-dispatch/lib/dispatch-guard.cjs:269 (`resolveTargetIdentity` parses the target agent from the prompt body before falling back to `subagent_type`), .skilled/hooks/task-dispatch/claude/task-dispatch-guard.cjs:6 ("rejects a deep-loop mode mismatch before the dispatch runs")
- Unsure: No packet takes task-dispatch as its main subject under that name, so every hit is MENTIONS. The codex adapter is absent by design (the README says the captured spawn payload encrypts the message), and the Pi adapter is advisory only and does not cover workflow-nested (`runs.run`) dispatches.

---

## session-history-lookup
- Purpose: A read-only lookup core that lets a model page back turns a compaction dropped: an adapter projects its own store into `HistoryEntry[]` and the core answers `search`, `browse`, `load` and `page` under a 16,384-byte reply cap without exposing the raw transcript. A persisted `hl1_` locator plus the shared `## History Lookup` section is what a later turn redeems through the CLI.
- Kind: mix: library core + redemption CLI + per-runtime compaction adapters + OpenCode plugin
- Code: .skilled/skills/system-spec-kit/runtime/hooks/lib/history/, .opencode/plugins/session-history-lookup.js, .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts, .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts, .skilled/skills/system-spec-kit/runtime/hooks/codex/compact-inject.ts, .skilled/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs, .skilled/skills/system-spec-kit/runtime/hooks/dsh/session-compact-context.mjs, .skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts
- Runtimes: claude, codex, devin, dsh, pi (compaction adapters); opencode (plugin); cursor's precompact adapter delegates to the Claude adapter and its delivery is unconfirmed
- Mirrors: .opencode/plugins/session-history-lookup.js; .pi/extensions/session-compact-context.ts (one-line re-export of the Pi compaction adapter that builds the offer)
- Kill switch: SYSTEM_SESSION_LIFECYCLE_DISABLED (the OpenCode plugin keys on the `session-lifecycle` concern)
- Packets:
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration | Feature Specification: Move the session history lookup out of the compaction path and into the in-session handover, so a receiving session can look up the sender's earlier turns.
  - OWNS | CHILD | specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/001-hop-recall-baseline | Feature Specification: Phase 1: hop-recall-baseline
  - OWNS | CHILD | specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/002-history-core-relocation | Feature Specification: Phase 2: history-core-relocation
  - OWNS | CHILD | specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/003-mint-locator-at-prepare | Feature Specification: Phase 3: mint-locator-at-prepare
  - OWNS | CHILD | specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/004-offer-lookup-at-claim | Feature Specification: Phase 4: offer-lookup-at-claim
  - OWNS | CHILD | specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/005-deprecate-compaction-offer | Feature Specification: Phase 5: deprecate-compaction-offer
  - OWNS | CHILD | specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/006-docs-and-live-hop-proof | Feature Specification: Phase 6: docs-and-live-hop-proof
  - MENTIONS | CHILD | specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/039-hop-dialog-goal-title | Feature Specification: A Claude Code hop refuses a question dialog after prepare, starts the receiver on the packet goal and keeps the generated session title
  - MENTIONS | CHILD | specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/039-hop-dialog-goal-title/008-history-test-database-env | Feature Specification: Phase 8: history-test-database-env
  - MENTIONS | CHILD | specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/040-claude-default-on-release-notes | Feature Specification: Claude Code session handover on by default and v4.0.2.1 release notes
  - MENTIONS | TOP-LEVEL | specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers | Feature Specification: Keep a packet's core purpose across handovers and compactions
- Evidence: .skilled/skills/system-spec-kit/runtime/hooks/lib/history/core.ts:68 (`createHistoryLookup` wires projection, navigation, loads, pages and the reply bound), .skilled/skills/system-spec-kit/runtime/hooks/lib/history/response.ts:8 (`MAXIMUM_RECOVERY_REPLY_BYTES = 16_384`), .opencode/plugins/session-history-lookup.js:4 (the plugin saves a history locator on `session.compacted` and adds the `## History Lookup` section while it is fresh)
- Unsure: The parent packet and all six of its phase children carry the `[YOUR_VALUE_HERE: ...]` placeholder in their problem statement, so the OWNS classification rests on the packet title and the folder relationship rather than a written problem. Cursor has no history adapter of its own; its `precompact.ts` proxies the Claude adapter, whose preCompact delivery is recorded as unconfirmed.

---

## pi-cache-optimizer
- Purpose: A Pi extension that raises provider-side prompt/KV cache hit rates: it reorders the system prompt so stable content precedes dynamic context, compresses skill listings, adds an OpenAI-compatible `prompt_cache_key` fallback, warns about proxy cache-routing gaps, and shows read-only footer cache statistics. It also stops paid retry loops by escalating only when a whole tool-call batch fails repeatedly.
- Kind: extension (Pi)
- Code: .pi/extensions/pi-cache-optimizer/index.ts, .pi/extensions/pi-cache-optimizer/package.json, .pi/extensions/pi-cache-optimizer/README.md
- Runtimes: pi only
- Mirrors: none
- Kill switch: none found in hook-flags.env.example; the extension has its own `/cache-optimizer disable` command and `PI_CACHE_OPTIMIZER_NO_*` opt-outs
- Packets:
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/pi-cache-optimizer/006-cache-optimizer-improvement-research | Feature Specification: cache optimizer improvement research
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/pi-cache-optimizer/007-cache-optimizer-measurement-fixes | Feature Specification: cache optimizer measurement and pricing fixes
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/pi-cache-optimizer/005-cache-optimizer-review-remediation | Feature Specification: cache optimizer review remediation
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/pi-cache-optimizer/009-cache-optimizer-single-copy-guard | Feature Specification: Let a second pi-cache-optimizer copy stand down so pi starts in git worktrees
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/pi-cache-optimizer/003-pi-cache-affinity-compat | Feature Specification: pi-cache-optimizer OpenRouter session-affinity compat
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/pi-cache-optimizer/004-cache-optimizer-absorbs-deep-pi | Feature Specification: One cache extension covering every Pi model, with measured economics and paid-retry guards
  - OWNS | CHILD | specs/hooks-plugins-extensions/pi-cache-optimizer/001-pi-caching-like-reasonix/003-fork-and-guard-cache-optimizer | Feature Specification: Fork pi-cache-optimizer with a DeepSeek Exclusion Guard
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/pi-cache-optimizer/008-compat-opt-in-and-image-declaration | Feature Specification: Gate DeepSeek cache-compat advice on an explicit wire-protocol opt-in and declare image input for the llmgateway model
  - OWNS | CHILD | specs/hooks-plugins-extensions/pi-cache-optimizer/002-pi-extension-playbooks/001-cache-optimizer-playbook | Feature Specification: Phase 1 cache-optimizer playbook
  - MENTIONS | TOP-LEVEL | specs/hooks-plugins-extensions/pi-cache-optimizer/001-pi-caching-like-reasonix | Phase Parent: Pi Reasonix-Style Prompt Caching — Research → Build Decision
  - MENTIONS | CHILD | specs/hooks-plugins-extensions/pi-cache-optimizer/001-pi-caching-like-reasonix/006-fork-and-improve-deep-pi | Phase Parent: Fork and Improve deep-pi
  - MENTIONS | TOP-LEVEL | specs/cli-external-orchestration/dispatch-surface-maintenance/004-pi-extension-brace-expansion | Feature Specification: Bump brace-expansion in two Pi extension lockfiles to close four Dependabot alerts
  - 39 more hits omitted
- Evidence: .pi/extensions/pi-cache-optimizer/index.ts:104 ("Reorders Pi's system prompt so stable content is sent before dynamic context"), .pi/extensions/pi-cache-optimizer/index.ts:844 (`optimizeSystemPrompt` builds the stable prefix and reorders only when every marker survives), .pi/extensions/pi-cache-optimizer/index.ts:1400 (`shouldInjectOpenAIPromptCacheKey` gates the OpenAI-compatible cache-key fallback)
- Unsure: The vendored copy carries its own `node_modules/` and `package-lock.json`; I did not run its suite. `index.ts` is about 420 KB, so the Purpose line follows the README and the module header rather than an exhaustive read of every hook.

---

## pi-fast-mode-w-subagent-support
- Purpose: A Pi extension that adds a per-session Fast Mode toggle for configured OpenAI and OpenAI-Codex models by adding `service_tier: "priority"` to matching provider payloads, and hands the parent's preference to child subagents through the `PI_FAST_MODE_W_SUBAGENT_SUPPORT` environment variable.
- Kind: extension (Pi)
- Code: .pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts, .pi/extensions/pi-fast-mode-w-subagent-support/src/payload.ts, .pi/extensions/pi-fast-mode-w-subagent-support/src/handoff.ts, .pi/extensions/pi-fast-mode-w-subagent-support/src/config.ts, .pi/extensions/pi-fast-mode-w-subagent-support/src/commands.ts, .pi/extensions/pi-fast-mode-w-subagent-support/src/status.ts, .pi/extensions/pi-fast-mode-w-subagent-support/src/types.ts
- Runtimes: pi only
- Mirrors: none
- Kill switch: none found in hook-flags.env.example; `/fast off` and the persisted config are the extension's own switches
- Packets:
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/pi-fast-mode/001-pi-fast-mode-w-subagent-support | Feature Specification: pi-fast-mode-w-subagent-support [hooks/011-pi-fast-mode-w-subagent-support/spec]
  - OWNS | CHILD | specs/hooks-plugins-extensions/pi-fast-mode/001-pi-fast-mode-w-subagent-support/001-fork-and-package | Feature Specification: fork-and-package workstream [hooks/011-pi-fast-mode-w-subagent-support/001-fork-and-package/spec]
  - OWNS | CHILD | specs/hooks-plugins-extensions/pi-fast-mode/001-pi-fast-mode-w-subagent-support/002-subagent-handoff | Feature Specification: subagent-handoff workstream [hooks/011-pi-fast-mode-w-subagent-support/002-subagent-handoff/spec]
  - OWNS | CHILD | specs/hooks-plugins-extensions/pi-fast-mode/001-pi-fast-mode-w-subagent-support/003-integration-and-tests | Feature Specification: integration-and-tests [hooks/011-pi-fast-mode-w-subagent-support/003-integration-and-tests/spec]
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/pi-fast-mode/002-cli-pi-worktree-extension-clash | Feature Specification: Let a second copy of the Pi fast-mode extension stand down, so cli-pi runs from a git worktree
  - OWNS | CHILD | specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/021-pi-fast-mode-trusted-flag | Feature Specification: Phase 21: pi-fast-mode-trusted-flag
  - OWNS | CHILD | specs/hooks-plugins-extensions/pi-fast-mode/001-pi-fast-mode-w-subagent-support/001-fork-and-package/001-source-baseline | Feature Specification: Phase [hooks/011-pi-fast-mode-w-subagent-support/001-fork-and-package/001-source-baseline/spec]
  - OWNS | CHILD | specs/hooks-plugins-extensions/pi-fast-mode/001-pi-fast-mode-w-subagent-support/002-subagent-handoff/001-handoff-contract | Feature Specification: [hooks/011-pi-fast-mode-w-subagent-support/002-subagent-handoff/001-handoff-contract/spec]
  - OWNS | CHILD | specs/hooks-plugins-extensions/pi-fast-mode/001-pi-fast-mode-w-subagent-support/003-integration-and-tests/001-extension-integration-suite | Feature [hooks/011-pi-fast-mode-w-subagent-support/003-integration-and-tests/001-extension-integration-suite/spec]
  - MENTIONS | TOP-LEVEL | specs/hooks-plugins-extensions/pi-cache-optimizer/002-pi-extension-playbooks | Feature Specification: Pi extension manual-testing playbooks
  - MENTIONS | TOP-LEVEL | specs/cli-external-orchestration/dispatch-surface-maintenance/004-pi-extension-brace-expansion | Feature Specification: Bump brace-expansion in two Pi extension lockfiles to close four Dependabot alerts
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/015-dsh-hook-parity | Feature Specification: Phase 15: dsh-hook-parity
  - 14 more hits omitted
- Evidence: .pi/extensions/pi-fast-mode-w-subagent-support/src/payload.ts:72 (`applyFastModePayload` writes `service_tier` into the provider payload), .pi/extensions/pi-fast-mode-w-subagent-support/src/types.ts:60 (`HANDOFF_ENV = "PI_FAST_MODE_W_SUBAGENT_SUPPORT"`), .pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts:193 (`pi.registerCommand("fast", ...)`)
- Unsure: I did not start Pi to confirm the live toggle, and the README's target list is the shipped default rather than a reading of the active `.pi/settings.json`. The duplicate-copy claim is documented in the README and the worktree-clash packet, not re-verified here.

---

## hook-platform
- Purpose: The shared plumbing every repo-authored hook imports: a default-on kill-switch resolver, fail-open stdin/JSON helpers, a read-only per-runtime session reader package, and the runtime adapter folders that translate each runtime's payload onto a runtime-neutral core. `.skilled/hooks/README.md` is the browsable index of every concern, its canonical flag, its aliases and its runtime coverage.
- Kind: mix: library (shared helpers and session readers) + per-runtime hook adapters + documentation index
- Code: .skilled/hooks/shared/, .skilled/hooks/hook-flags.env.example, .skilled/hooks/README.md, .skilled/skills/system-spec-kit/runtime/hooks/
- Runtimes: claude, codex, cursor, devin, dsh, opencode, pi (runtime adapter folders under .skilled/skills/system-spec-kit/runtime/hooks/)
- Mirrors: .opencode/plugins/ (19 plugin files reference `.skilled/hooks/shared/hook-flags.cjs`), .pi/extensions/ (22 one-line entries re-export the runtime adapters), .pi/extensions/lib/claude-hook-adapter.ts
- Kill switch: SYSTEM_HOOKS_DISABLED (master) plus SYSTEM_<CONCERN>_DISABLED per concern
- Packets:
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/hook-platform/004-hook-feature-flags-and-hub-index | Feature Specification: Hook Feature Flags + Full Hub Index
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/hook-platform/003-hook-library-mk-rename | Feature Specification: Hook Library mk- Prefix Rename
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/pi-extensions/012-file-relative-adapter-imports | Feature Specification: Pi loads hook adapters on every version
  - OWNS | CHILD | specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/028-plugin-kill-switch-coverage | Feature Specification: Phase 28: plugin-kill-switch-coverage
  - MENTIONS | TOP-LEVEL | specs/sk-doc/doc-validation-tooling/001-doc-validation-off-switches | Feature Specification: Doc validation off switches
  - MENTIONS | CHILD | specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/034-default-off-opt-in | Feature Specification: Session relaunch hooks off by default, opt in with SYSTEM_SESSION_RELAUNCH_ENABLED
  - MENTIONS | TOP-LEVEL | specs/hooks-plugins-extensions/git-hooks/001-git-hook-gate-reduction | Feature Specification: Git Hook Gate Reduction
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/015-dsh-hook-parity | Feature Specification: Phase 15: dsh-hook-parity
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/008-vibe-repo-guards | Feature Specification: Phase 8: vibe-repo-guards
  - MENTIONS | CHILD | specs/system-speckit/runtime-and-release/001-system-speckit-v4/049-gate-3-delivery-residue | Feature Specification: Phase 49: Gate-3 delivery residue
  - MENTIONS | CHILD | specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/012-ci-red-check-repairs | Feature Specification: Phase 12: ci-red-check-repairs
  - MENTIONS | CHILD | specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/038-goal-and-workflow-resume | Feature Specification: Goals and running workflows survive a session hop on every runtime
  - 32 more hits omitted
- Evidence: .skilled/hooks/shared/README.md:15 (the folder "is pure plumbing for the adapters that do", holding the kill-switch resolver, the stdin/JSON helpers and the session readers), .skilled/hooks/shared/hook-flags.cjs:206 (`isHookEnabled` resolves the master switch, the concern switch and the config file), .skilled/hooks/shared/hook-adapter-shared.cjs:29 (`readStdin` resolves at a 3000 ms deadline with the bytes read so far)
- Unsure: `.skilled/hooks/shared/` is runtime-neutral and holds only a `dsh/` subfolder, so the "runtime adapter folders" half of this feature is the `system-spec-kit/runtime/hooks/` tree rather than a folder per runtime under `shared/`. The 44-hit count is the union of the `hook-flags` and `hook library` searches, and the 19/22 mirror counts come from `rg -l` over those two folders.
