## goal
- Purpose: Passive session-goal steering for runtimes that can supply a native session identity: each read or mutation resolves one composite scope (workspace + runtime + native session id) to an opaque state record, and the directive itself is read from the bound packet's `goal.md` on every render rather than from a remembered copy. A runtime-neutral core owns scope validation, atomic state I/O, the lifecycle, the rendered `[active_goal]` block, the heuristic verifier and packet binding, and each adapter only binds it to a native lifecycle event.
- Kind: mix: library core (`lib/`) + manage CLI (`bin/`) + per-runtime hook adapters + OpenCode-native plugin
- Code: .skilled/hooks/goal/lib/goal-core.cjs, .skilled/hooks/goal/lib/goal-slice.cjs, .skilled/hooks/goal/bin/goal.cjs, .skilled/hooks/goal/cursor/goal-inject.mjs, .skilled/hooks/goal/devin/goal-inject.mjs, .skilled/hooks/goal/dsh/goal-context.mjs, .skilled/hooks/goal/dsh/goal-manage.mjs, .skilled/hooks/goal/pi/goal-context.ts, .skilled/hooks/goal/opencode/opencode-goal.js
- Runtimes: cursor, devin, dsh, pi (adapter folders); opencode (browsability symlink to the real plugin in .opencode/plugins/). No claude/ or codex/ adapter folder — both keep their native goal command.
- Mirrors: .opencode/plugins/opencode-goal.js, .pi/extensions/goal-context.ts
- Kill switch: OPENCODE_GOAL_DISABLED
- Packets:
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/goal/001-goal-hooks-cross-runtime | Feature Specification: Cross-runtime goal hooks + dispatch-shape coverage + OpenCode symlink mirror
  - OWNS | CHILD | specs/hooks-plugins-extensions/goal/001-goal-hooks-cross-runtime/001-goal-core-and-state | Feature Specification: Runtime-neutral goal core + shared active-goal state + manage CLI
  - OWNS | CHILD | specs/hooks-plugins-extensions/goal/001-goal-hooks-cross-runtime/003-devin-goal-hooks | Feature Specification: Devin goal hooks (UserPromptSubmit inject, SessionStart restore, Stop verify/continue)
  - OWNS | CHILD | specs/hooks-plugins-extensions/goal/001-goal-hooks-cross-runtime/004-cursor-goal-hooks | Feature Specification: Cursor goal hooks
  - OWNS | CHILD | specs/hooks-plugins-extensions/goal/001-goal-hooks-cross-runtime/005-pi-goal-hooks | Feature Specification: Pi goal extension (input-transform injection, session_start restore, turn-end verify)
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/goal/002-goal-hook-playbooks-and-validation | Feature Specification: Goal-Hook Playbooks and Live Cross-Runtime Validation
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/goal/003-goal-isolation | Feature Specification: Cross-Runtime Goal Isolation
  - OWNS | CHILD | specs/hooks-plugins-extensions/goal/003-goal-isolation/002-session-scoped-core | Implementation Phase: Session-Scoped Goal Core
  - OWNS | CHILD | specs/system-speckit/runtime-and-release/001-system-speckit-v4/038-goal-unification | Feature Specification: Goal unification
  - OWNS | CHILD | specs/system-speckit/runtime-and-release/001-system-speckit-v4/038-goal-unification/004-goal-core-packet-backed | Feature Specification: Goal core packet-backed
  - MENTIONS | CHILD | specs/hooks-plugins-extensions/session-handover/002-session-relaunch-loop/038-goal-and-workflow-resume | Feature Specification: Goals and running workflows survive a session hop on every runtime
  - MENTIONS | CHILD | specs/system-speckit/runtime-and-release/001-system-speckit-v4/010-goal-file-addon | Feature Specification: Nested Goal Addon
  - 702 more hits omitted
- Evidence: .skilled/hooks/goal/lib/goal-core.cjs:510 (`renderGoalBrief` returns '' unless the record is `active`, and re-reads the bound packet's `goal.md` instead of a stored copy), .skilled/hooks/goal/lib/goal-core.cjs:1127 (`bindGoal` resolves the packet inside the workspace and raises `PACKET_GOAL_NOT_FOUND` when there is no `goal.md`), .skilled/hooks/goal/bin/goal.cjs:6 ("The manage command for runtimes with no plugin tool surface ... It never writes goal state directly")
- Unsure: The top-level README's per-runtime table covers Pi, Cursor, Devin, OpenCode, Claude and Codex but not DSH, while `dsh/` holds two adapters with their own README; whether DSH counts as a supported runtime for this feature is not stated at the top level. The "goal" search matched 714 `spec.md` files, so the packet list is a selection, not a census.

---

## hook-install
- Purpose: Keeps Codex's user-global hook file free of copies of this repository's hooks, because Codex already loads the project's `.codex/hooks.json` for a trusted checkout and a duplicated entry runs every hook twice per event. The installer removes entries whose identity matches a source hook, removes repo-owned orphans under `.skilled/` or `.opencode/` whose adapter no longer exists, and leaves every third-party entry untouched.
- Kind: mix: repository tooling (one CLI installer script) with per-runtime symlink entries — explicitly not a runtime event hook
- Code: .skilled/bin/install-codex-hooks.mjs, .skilled/hooks/hook-install/claude/install-codex-hooks.mjs, .skilled/hooks/hook-install/cursor/install-codex-hooks.mjs, .skilled/hooks/hook-install/devin/install-codex-hooks.mjs
- Runtimes: claude, cursor, devin (relative symlinks to the one real installer); codex is the cleanup target, not an installer host; no opencode, pi or dsh entry
- Mirrors: none
- Kill switch: SYSTEM_HOOK_INSTALL_DISABLED
- Packets:
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/001-cli-hermes-creation/010-hermes-hook-parity | Feature Specification: Phase 1: hermes-hook-parity
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/015-dsh-hook-parity | Feature Specification: Phase 15: dsh-hook-parity
  - MENTIONS | CHILD | specs/hooks-plugins-extensions/directive-lifecycle/001-injection-bloat-reduction/012-playbook-fails-remediation | Design Specification: Manual Testing Playbook FAIL Remediation
  - MENTIONS | CHILD | specs/system-deep-loop/loop-architecture/003-deprecate-improvement-modes/011-pre-existing-gate-failures | Feature Specification: Phase 11: pre-existing-gate-failures
  - MENTIONS | CHILD | specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/009-test-findings-remediation | Feature Specification: Remediating the Cross-CLI Test Findings
- Evidence: .skilled/bin/install-codex-hooks.mjs:138 (`reconcileHooks` builds the reconciled target from the source identities and leaves every other entry untouched), .skilled/bin/install-codex-hooks.mjs:202 (`analyzeDrift` classifies `duplicate`, `orphaned` and structural drift for the non-mutating check), .skilled/bin/install-codex-hooks.mjs:318 (`main()` returns immediately when `isHookEnabled('hook-install')` is false)
- Unsure: The README calls this "repository tooling rather than a runtime event hook", so its place in a hook-platform feature inventory is a judgment call rather than something the files settle. The `--check` consumer is the `codex-watchdog` plugin, which I did not open.

---

## mcp-route-guard
- Purpose: Decides whether a native external MCP tool call (`mcp__*` / `mcp_*`) should carry a just-in-time advisory pointing the model at Code Mode's `call_tool_chain` instead of calling the server directly. It has exactly two outcomes, `allow` (silent) and `warn` (attach the advisory), no deny path, and every error resolves to `allow` so a bug in the guard can never block an MCP call.
- Kind: mix: library policy core + per-runtime hook adapters + OpenCode plugin + Pi extension
- Code: .skilled/hooks/mcp-route-guard/lib/mcp-route-guard.cjs, .skilled/hooks/mcp-route-guard/claude/mcp-route-guard.cjs, .skilled/hooks/mcp-route-guard/codex/mcp-route-guard.cjs, .skilled/hooks/mcp-route-guard/devin/mcp-route-guard.cjs, .skilled/hooks/mcp-route-guard/cursor/mcp-route-guard.mjs, .skilled/hooks/mcp-route-guard/dsh/mcp-route-guard.mjs, .skilled/hooks/mcp-route-guard/pi/mcp-route-guard.ts, .skilled/hooks/mcp-route-guard/opencode/mcp-route-guard.js
- Runtimes: claude, codex, cursor, devin, dsh, pi (adapter folders); opencode (browsability symlink to the real plugin in .opencode/plugins/)
- Mirrors: .opencode/plugins/mcp-route-guard.js, .pi/extensions/mcp-route-guard.ts
- Kill switch: MCP_ROUTE_GUARD_DISABLED
- Packets:
  - MENTIONS | TOP-LEVEL | specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat | Research Record: OpenCode v1 and v2 dual compatibility research
  - MENTIONS | CHILD | specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/002-pins-imports-dual-export | Feature Specification: Phase 2: pins-imports-dual-export
  - MENTIONS | CHILD | specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/042-hooks-and-plugins-held-fixes | Feature Specification: Phase 42: hooks-and-plugins-held-fixes
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/001-cli-hermes-creation/010-hermes-hook-parity | Feature Specification: Phase 1: hermes-hook-parity
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/008-dsh-repo-guards-safety-wave | Feature Specification: Phase 8: dsh-repo-guards-safety-wave
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/010-dsh-mcp-code-mode | Feature Specification: Phase 10: dsh-mcp-code-mode
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/015-dsh-hook-parity | Feature Specification: Phase 15: dsh-hook-parity
  - MENTIONS | CHILD | specs/hooks-plugins-extensions/goal/001-goal-hooks-cross-runtime/007-opencode-plugin-symlinks | Feature Specification: OpenCode plugin browsability symlinks in the hooks tree
  - MENTIONS | TOP-LEVEL | specs/hooks-plugins-extensions/hook-platform/003-hook-library-mk-rename | Feature Specification: Hook Library mk- Prefix Rename
  - MENTIONS | CHILD | specs/sk-code/hub-architecture/003-sk-code-poinytail-based-refinement/009-round-two-follow-ups/005-hook-stdin-deadlines | Feature Specification: Phase 5: hook-stdin-deadlines
  - MENTIONS | CHILD | specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/004-conversation-adoption-build/012-mcp-code-mode | Feature Specification: Phase 12: mcp-code-mode
  - MENTIONS | CHILD | specs/system-speckit/runtime-and-release/001-system-speckit-v4/016-sequential-thinking-residue-removal | Feature Specification: Retire the decommissioned MCP server from the doctor tooling and clear stale spec residue
  - 4 more MENTIONS omitted
- Evidence: .skilled/hooks/mcp-route-guard/lib/mcp-route-guard.cjs:224 (`evaluateNativeMcpCall` returns `allow` on a disabled flag, an unparsable name or an internal server, and `warn` only for a manifest-registered family), .skilled/hooks/mcp-route-guard/lib/mcp-route-guard.cjs:40 (the `MCP_ROUTE_GUARD_DISABLED` constant the core short-circuits on), .opencode/plugins/mcp-route-guard.js:29 (the OpenCode plugin requires the same `hooks/mcp-route-guard/lib/mcp-route-guard.cjs` core)
- Unsure: No packet in `specs/` takes this feature as its main subject under the exact name `mcp-route-guard`; all 16 hits are references, so the OWNS/MENTIONS split is uniformly MENTIONS. The DSH adapter's own README says it turns a `warn` into a deny because DSH has no advisory channel, which is a per-runtime exception to the "no deny path" property.

---

## overlay-guard
- Purpose: Refuses a write to a file that a vendored Skilled tree's overlay owns, before the write happens, and names the overlay file to edit instead — because a vendored tree is replaced wholesale at each re-pin and a direct edit to an overlay-owned file is lost. The core never judges ownership itself: it asks the overlay engine's `--guard` query once per path and passes the engine's `refuse:` line through, and with `strictWrites` on it also refuses a vendored write no overlay owns.
- Kind: mix: library policy core + per-runtime hook adapters + OpenCode plugin + Pi extension
- Code: .skilled/hooks/overlay-guard/lib/overlay-guard.cjs, .skilled/hooks/overlay-guard/claude/overlay-guard.cjs, .skilled/hooks/overlay-guard/codex/overlay-guard.cjs, .skilled/hooks/overlay-guard/cursor/overlay-guard.mjs, .skilled/hooks/overlay-guard/devin/overlay-guard.cjs, .skilled/hooks/overlay-guard/dsh/overlay-guard.mjs, .skilled/hooks/overlay-guard/pi/overlay-guard.ts, .skilled/hooks/overlay-guard/opencode/overlay-guard.js
- Runtimes: claude, codex, cursor, devin, dsh, pi (adapter folders); opencode (browsability symlink to the real plugin in .opencode/plugins/)
- Mirrors: .opencode/plugins/overlay-guard.js, .pi/extensions/overlay-guard.ts
- Kill switch: SYSTEM_OVERLAY_GUARD_DISABLED
- Packets:
  - OWNS | CHILD | specs/system-skilled-doctor/001-skill-and-overlay-build/004-guard-hook | Feature Specification: Phase 4: guard-hook
  - OWNS | CHILD | specs/system-skilled-doctor/001-skill-and-overlay-build/008-overlay-first-write-checks | Feature Specification: Phase 8: overlay-first-write-checks
  - OWNS | CHILD | specs/system-skilled-doctor/001-skill-and-overlay-build/009-overlay-write-checks-follow-up | Feature Specification: Phase 9: overlay-write-checks-follow-up
  - MENTIONS | TOP-LEVEL | specs/system-skilled-doctor/001-skill-and-overlay-build | Feature Specification: Build system-skilled-doctor and the doctor overlay command
  - MENTIONS | TOP-LEVEL | specs/hooks-plugins-extensions/pi-extensions/012-file-relative-adapter-imports | Feature Specification: Pi loads hook adapters on every version
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/015-dsh-hook-parity | Feature Specification: Phase 15: dsh-hook-parity
- Evidence: .skilled/hooks/overlay-guard/lib/overlay-guard.cjs:108 (`evaluateWrite` allows at once when the tree carries no overlay setting or folder, and otherwise denies only on an engine refusal), .skilled/hooks/overlay-guard/lib/overlay-guard.cjs:80 (`guardOne` spawns `<engine> --guard <path> --root <treeRoot>` with a timeout), .skilled/hooks/overlay-guard/lib/overlay-guard.cjs:61 (`couldHaveOverlays` is the two file-existence checks behind the no-manifest fast exit)
- Unsure: The OWNS classification for `004-guard-hook` rests on its problem statement (Barter's private guard hooks with a hard-coded `barter-overlays` folder); I did not read that packet's tasks to confirm it shipped this exact `lib/overlay-guard.cjs`. The README also says the guard's registrations come from `hook-registry.json`, which I did not open.

---

## permission-policy
- Purpose: Answers Devin's `PermissionRequest` event with a binding allow-or-deny decision, composing two existing shared cores instead of reimplementing policy: write-class tool calls delegate to `spec-gate-core`'s `isExemptTargetPath`, and exec-class tool calls delegate to `dispatch-rule-checks`' hard-rule evaluator. It fails closed — malformed JSON, missing identity, a missing path or command, an unknown tool class or any evaluation error resolves to `deny` — and the only allow paths are an exempt write target, a command that violates no dispatch hard rule, or the kill switch being explicitly disabled.
- Kind: hook (Devin `PermissionRequest` adapter)
- Code: .skilled/hooks/permission-policy/devin/permission-request-policy.mjs, .skilled/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs
- Runtimes: devin only (by design; Claude and Codex influence permissions through `PreToolUse`, and Cursor, OpenCode and Pi expose no separate approval event)
- Mirrors: none
- Kill switch: SYSTEM_PERMISSION_POLICY_DISABLED
- Packets:
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/001-cli-hermes-creation/010-hermes-hook-parity | Feature Specification: Phase 1: hermes-hook-parity
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/015-dsh-hook-parity | Feature Specification: Phase 15: dsh-hook-parity
- Evidence: .skilled/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs:145 (`evaluatePermission` denies on bad identity, routes write and exec classes, and denies any unknown tool class), .skilled/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs:124 (`evaluateWrite` allows only when `guardCore.isExemptTargetPath` is true), .skilled/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs:133 (`evaluateExec` allows only when `readHardRules` reports no violation)
- Unsure: Only two `spec.md` files mention this feature and neither owns it, so no packet records why the Devin-only scope was chosen beyond the README's coverage-matrix sentence. The real adapter lives outside the feature folder under `system-spec-kit`, so `Code` spans two trees and the hub entry is a relative symlink.
