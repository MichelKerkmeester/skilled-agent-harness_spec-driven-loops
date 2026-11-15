## ask-surface-guard
- Purpose: A runtime-neutral guard that detects a turn ending in a prose option menu and sends that turn back once with an instruction to ask the same question through the runtime's question tool. Each operator message is sent back at most once, so a runtime without its own re-entry flag cannot loop.
- Kind: hook (shared library plus per-runtime adapters, with an OpenCode plugin)
- Code: .skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs, .skilled/hooks/ask-surface-guard/lib/advisory-stop.cjs, .skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs, .skilled/hooks/ask-surface-guard/codex/ask-surface-stop.cjs, .skilled/hooks/ask-surface-guard/devin/ask-surface-stop.cjs, .skilled/hooks/ask-surface-guard/dsh/ask-surface-guard.mjs, .skilled/hooks/ask-surface-guard/pi/ask-surface-guard.ts, .opencode/plugins/ask-surface-guard.js
- Runtimes: claude, codex, devin, dsh, pi (no cursor/ or opencode/ folder in the feature tree)
- Mirrors: .opencode/plugins/ask-surface-guard.js; .pi/extensions/ask-surface-guard.ts
- Kill switch: SYSTEM_ASK_SURFACE_DISABLED
- Packets:
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/session-turn-boundaries/003-ask-surface-enforcement | Enforce asking operator decisions through each runtime's native ask-question tool instead of prose option menus
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/007-dispatch-recognition-and-hard-rules | Phase 7: dispatch-recognition-and-hard-rules
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/008-vibe-repo-guards | Phase 8: vibe-repo-guards
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/009-deep-loop-executor-kind | Phase 9: deep-loop-executor-kind
  - MENTIONS | TOP-LEVEL | specs/sk-doc/doc-validation-tooling/004-doc-tooling-prose-and-release-amend | Doc tooling fixes found while writing the install guide and v4.0.2.0 notes
  - MENTIONS | TOP-LEVEL | specs/system-skill-advisor/routing-and-scoring/006-runtime-name-implementation-routing | Route implementation prompts that name a runtime surface to the code skill, not the CLI executor
  - MENTIONS | CHILD | specs/system-speckit/runtime-and-release/004-v4-release-line-research/004-advisor-hooks-relaunch | Phase 4: advisor-hooks-relaunch
  - MENTIONS | CHILD | specs/system-speckit/runtime-and-release/004-v4-release-line-research/012-hook-guards-and-audit-log | Phase 12: hook-guards-and-audit-log
- Evidence: .skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs:4, .skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs:91, .skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs:5, .opencode/plugins/ask-surface-guard.js:4
- Unsure: The feature folder has no README.md; the Purpose is taken from the core and adapter comments and from .skilled/hooks/README.md:175 and .skilled/hooks/README.md:48. The OpenCode adapter lives only in .opencode/plugins, so the feature tree has no opencode/ folder.

---

## classifier-injection-screen
- Purpose: After a fetch, splits the fetched web text into sections and asks Jev whether each section reads as instructions aimed at an AI agent, then adds one advisory line to the agent's context when a section does. The fetch result always reaches the model unchanged.
- Kind: hook (shared library plus per-runtime adapters, with an OpenCode plugin)
- Code: .skilled/hooks/classifier-injection-screen/lib/classifier-injection-advisory.mjs, .skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.mjs, .skilled/hooks/classifier-injection-screen/claude/classifier-injection-screen-posttooluse.mjs, .skilled/hooks/classifier-injection-screen/devin/classifier-injection-screen-posttooluse.mjs, .skilled/hooks/classifier-injection-screen/dsh/classifier-injection-screen.mjs, .skilled/hooks/classifier-injection-screen/pi/classifier-injection-screen.ts, .opencode/plugins/classifier-injection-screen.js
- Runtimes: claude, devin, dsh, opencode, pi (no codex/ or cursor/ folder)
- Mirrors: .opencode/plugins/classifier-injection-screen.js (the feature's opencode/ entry is a browsability symlink to it); .pi/extensions/classifier-injection-screen.ts
- Kill switch: SYSTEM_INJECTION_SCREEN_DISABLED (also off with JEV_FEATURE_INJECTION_SCREEN=0 or JEV_FEATURES=0)
- Packets:
  - OWNS | TOP-LEVEL | specs/cli-classifier/003-cli-jev-workflow-integration/035-fetched-text-injection-screen | Phase 35: fetched-text-injection-screen
  - OWNS | CHILD | specs/cli-classifier/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/004-injection-screen-research | Research: improve the Jev fetched-text injection screen (035)
  - OWNS | CHILD | specs/cli-classifier/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/004-injection-screen-improvements | Build: improve the Jev fetched-text injection screen (035)
  - MENTIONS | TOP-LEVEL | specs/cli-classifier/003-cli-jev-workflow-integration/054-classifier-module-names | Phase 54: classifier-module-names
  - MENTIONS | TOP-LEVEL | specs/cli-classifier/003-cli-jev-workflow-integration/055-alignment-and-hook-parity | Phase 55: alignment-and-hook-parity
  - MENTIONS | CHILD | specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/002-pins-imports-dual-export | Phase 2: pins-imports-dual-export
  - MENTIONS | CHILD | specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/020-plugins-purity-dual-export | Phase 20: plugins-purity-dual-export
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/008-dsh-repo-guards-safety-wave | Phase 8: dsh-repo-guards-safety-wave
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/015-dsh-hook-parity | Phase 15: dsh-hook-parity
  - MENTIONS | CHILD | specs/sk-code/hub-architecture/003-sk-code-poinytail-based-refinement/009-round-two-follow-ups/005-hook-stdin-deadlines | Phase 5: hook-stdin-deadlines
  - MENTIONS | CHILD | specs/system-speckit/runtime-and-release/001-system-speckit-v4/069-v4-0-0-3-review-remediation | v4.0.0.3 review remediation
- Evidence: .skilled/hooks/classifier-injection-screen/README.md:16, .skilled/hooks/classifier-injection-screen/README.md:20, .skilled/hooks/classifier-injection-screen/README.md:30, .skilled/hooks/classifier-injection-screen/lib/classifier-injection-advisory.mjs:74
- Unsure: The exact-name search returns 8 packets, none of which owns the feature; the three OWNS packets predate the folder rename and match on "injection screen" instead. Cursor and Codex carry no adapter by design (README.md:20 and README.md:84).

---

## codex-watchdog
- Purpose: An OpenCode plugin that, on each session start, runs the Codex hook installer's non-mutating `--check` and records drift in a bounded workspace log. It surfaces a stale or duplicated `~/.codex/hooks.json` entry only; repair stays an explicit installer run.
- Kind: plugin (OpenCode plugin hosted concern)
- Code: .opencode/plugins/codex-hooks-watchdog.js, .skilled/hooks/codex-watchdog/opencode/codex-hooks-watchdog.js
- Runtimes: opencode
- Mirrors: .opencode/plugins/codex-hooks-watchdog.js (the feature's opencode/ entry is a browsability symlink to it); no .pi/extensions mirror
- Kill switch: CODEX_WATCHDOG_DISABLED (canonical name CODEX_HOOKS_WATCHDOG_DISABLED)
- Packets:
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/001-cli-hermes-creation/010-hermes-hook-parity | Phase 1: hermes-hook-parity
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/015-dsh-hook-parity | Phase 15: dsh-hook-parity
  - MENTIONS | CHILD | specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/009-test-findings-remediation | Remediating the Cross-CLI Test Findings
- Evidence: .skilled/hooks/codex-watchdog/README.md:17, .skilled/hooks/codex-watchdog/README.md:29, .opencode/plugins/codex-hooks-watchdog.js:4
- Unsure: No packet owns this feature; all three hits treat it as one hook among many. The installer the plugin calls, .skilled/bin/install-codex-hooks.mjs, is outside the feature folder and was not read.

---

## completion
- Purpose: When the assistant claims a task is done, these hooks check that the claim carries objective evidence, either checklist completion or a recorded implementation summary, and add an advisory warning to a bounded log when it does not. The sentinel is advisory only and never blocks a turn.
- Kind: hook (runtime-neutral core plus per-runtime adapters, and two OpenCode plugins)
- Code: .skilled/hooks/completion/, .skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs, .skilled/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs, .skilled/skills/system-spec-kit/runtime/hooks/codex/completion-evidence-stop.cjs, .skilled/skills/system-spec-kit/runtime/hooks/cursor/completion-evidence-response.mjs, .skilled/skills/system-spec-kit/runtime/hooks/devin/completion-evidence-stop.cjs, .skilled/skills/system-spec-kit/runtime/hooks/dsh/completion-evidence.mjs, .skilled/skills/system-spec-kit/runtime/hooks/pi/completion-evidence.ts, .opencode/plugins/system-completion-sentinel.js, .opencode/plugins/system-speckit-completion.js
- Runtimes: claude, codex, cursor, devin, dsh, opencode, pi
- Mirrors: .opencode/plugins/system-completion-sentinel.js, .opencode/plugins/system-speckit-completion.js; .pi/extensions/completion-evidence.ts
- Kill switch: SYSTEM_COMPLETION_DISABLED
- Packets:
  - OWNS | TOP-LEVEL | specs/cli-classifier/003-cli-jev-workflow-integration/026-completion-claim-audit | Phase 26: completion-claim-audit
  - OWNS | CHILD | specs/cli-classifier/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/010-completion-claims-improvements | Build: improve the Jev completion-claim audit (026)
  - OWNS | CHILD | specs/system-speckit/runtime-and-release/001-system-speckit-v4/030-spec-kit-simplification-research/016-template-seams-and-sentinel-repair | Template seams and sentinel repair
  - OWNS | CHILD | specs/system-speckit/runtime-and-release/001-system-speckit-v4/030-spec-kit-simplification-research/017-completion-gate-and-catalog-alignment | Completion gate and catalog alignment
  - OWNS | CHILD | specs/system-speckit/runtime-and-release/001-system-speckit-v4/055-advisory-false-alarms | Stop the sk-git pathspec advisory and the completion-evidence sentinel from raising false alarms
  - MENTIONS | CHILD | specs/cli-classifier/003-cli-jev-workflow-integration/003-goal-verifier-jev-shadow | Goal Verifier Pi Census, Zero-Call Arms and Opt-In Jev Shadow Mode
  - MENTIONS | TOP-LEVEL | specs/hooks-plugins-extensions/session-turn-boundaries/003-ask-surface-enforcement | Enforce asking operator decisions through each runtime's native ask-question tool instead of prose option menus
  - MENTIONS | CHILD | specs/sk-code/hub-architecture/003-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines | Phase 7: spec-kit-hook-deadlines
  - MENTIONS | CHILD | specs/system-speckit/runtime-and-release/001-system-speckit-v4/005-skills-runtime-state-consolidation | Consolidate the seven skills-root state directories into .state
  - MENTIONS | CHILD | specs/system-speckit/runtime-and-release/001-system-speckit-v4/032-recorded-findings-closure/001-hook-adapter-thin-transports | Phase 1: hook-adapter-thin-transports
  - MENTIONS | CHILD | specs/system-speckit/runtime-and-release/001-system-speckit-v4/032-recorded-findings-closure/003-playbook-provenance-lines | Phase 3: playbook-provenance-lines
  - MENTIONS | CHILD | specs/system-speckit/runtime-and-release/001-system-speckit-v4/069-v4-0-0-3-review-remediation | v4.0.0.3 review remediation
- Evidence: .skilled/hooks/completion/README.md:18, .skilled/hooks/completion/README.md:20, .skilled/hooks/completion/README.md:31, .opencode/plugins/system-completion-sentinel.js:4
- Unsure: The bare feature name "completion" matches 1,835 spec.md files, so the packet list uses the hook-specific terms (completion-evidence, completion-sentinel, completion-evidence-stop). Packets that use only the generic word are not listed. Every adapter file in the feature folder is a symlink; the real code sits under .skilled/skills/system-spec-kit/runtime/hooks/.

---

## decision-capture
- Purpose: Queues each answered question-tool call into one deduplicated, project-local decision queue, fed both by live runtime adapters and by save-time sweeps that replay a runtime's session record. A later full-auto save can then quote the operator's exact wording, and a pending-answer line nudges the operator when captured answers are not yet recorded.
- Kind: mix: hook adapters, a shared library, and save-time sweep CLIs
- Code: .skilled/hooks/decision-capture/lib/capture-core.mjs, .skilled/hooks/decision-capture/lib/chat-questions.mjs, .skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs, .skilled/hooks/decision-capture/devin/ask-capture-posttooluse.mjs, .skilled/hooks/decision-capture/dsh/decision-capture.mjs, .skilled/hooks/decision-capture/pi/decision-capture.ts, .skilled/hooks/decision-capture/bin/, .opencode/plugins/decision-capture.js
- Runtimes: claude, devin, dsh, pi (no codex/, cursor/ or opencode/ folder; Codex and OpenCode are covered by the save-time sweeps and the OpenCode plugin)
- Mirrors: .opencode/plugins/decision-capture.js; .pi/extensions/decision-capture.ts
- Kill switch: SYSTEM_DECISION_CAPTURE_DISABLED
- Packets:
  - OWNS | TOP-LEVEL | specs/system-speckit/spec-authoring-and-continuity/004-decision-capture | Decision capture series
  - OWNS | CHILD | specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/001-decision-capture-build | Automatic operator decision capture
  - OWNS | CHILD | specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/002-table-row-matching | Phase 2: table-row-matching
  - OWNS | CHILD | specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/003-codex-and-pi-capture | Phase 3: codex-and-pi-capture
  - OWNS | CHILD | specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/004-opencode-devin-live-capture | Phase 4: opencode-devin-live-capture
  - OWNS | CHILD | specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/005-chat-question-detection | Phase 5: chat-question-detection
  - OWNS | CHILD | specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/006-live-conversation-test | Phase 6: live-conversation-test
  - OWNS | CHILD | specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/007-gap-closure | Phase 7: gap-closure
  - OWNS | CHILD | specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/008-project-scoped-state | Phase 8: project-scoped-state
  - OWNS | CHILD | specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/009-chat-answer-evidence | Phase 9: chat-answer-evidence
  - OWNS | CHILD | specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/010-decision-routing-vocabulary | Phase 10: decision-routing-vocabulary
  - MENTIONS | TOP-LEVEL | specs/hooks-plugins-extensions/session-turn-boundaries/003-ask-surface-enforcement | Enforce asking operator decisions through each runtime's native ask-question tool instead of prose option menus
- Evidence: .skilled/hooks/decision-capture/lib/capture-core.mjs:4, .skilled/hooks/decision-capture/lib/capture-core.mjs:7, .skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs:5, .skilled/hooks/decision-capture/bin/README.md:17
- Unsure: The feature folder has no top-level README.md; the Purpose comes from the lib, claude and bin READMEs and the code headers. Ten more MENTIONS are omitted (22 packets match; 11 OWNS and 11 MENTIONS). .skilled/hooks/README.md:239 records that there is no opencode/ mirror in this tree.
