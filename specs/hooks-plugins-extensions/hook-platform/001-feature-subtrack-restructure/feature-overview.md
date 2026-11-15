---
title: "Hook, Plugin and Extension Feature Overview"
description: "One card per hook, plugin and extension feature this repository ships: purpose, code paths, runtimes, kill switch and the spec packets that own or mention it."
trigger_phrases:
  - "hook feature overview"
  - "plugin and extension feature inventory"
  - "which packet owns a hook feature"
  - "hook feature cards"
importance_tier: "normal"
contextType: "reference"
---

# Hook, Plugin and Extension Feature Overview

One card per feature this repository ships as a hook, plugin or extension. Each card names what the feature does, where its code lives, which runtimes it covers, its kill switch and the spec packets that own or mention it.

Source: read from the code and READMEs on 2026-11-15 by six DeepSeek V4.1 Flash workers, one file each under `scratch/wave-a/`, then merged here. Every `Code:` path and every `file:line` in an `Evidence:` line was resolved against the checkout by script.

Packet rows read: `OWNS` means the feature is that packet's main subject, `MENTIONS` means it is only referenced. `TOP-LEVEL` is a whole packet, `CHILD` is a phase inside another packet.

---

## ask-surface-guard
- Purpose: A runtime-neutral guard that detects a turn ending in a prose option menu and sends that turn back once with an instruction to ask the same question through the runtime's question tool. Each operator message is sent back at most once, so a runtime without its own re-entry flag cannot loop.
- Kind: hook (shared library plus per-runtime adapters, with an OpenCode plugin)
- Code: .skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs, .skilled/hooks/ask-surface-guard/lib/advisory-stop.cjs, .skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs, .skilled/hooks/ask-surface-guard/codex/ask-surface-stop.cjs, .skilled/hooks/ask-surface-guard/devin/ask-surface-stop.cjs, .skilled/hooks/ask-surface-guard/dsh/ask-surface-guard.mjs, .skilled/hooks/ask-surface-guard/pi/ask-surface-guard.ts, .opencode/plugins/ask-surface-guard.js
- Runtimes: claude, codex, devin, dsh, pi (no cursor/ or opencode/ folder in the feature tree)
- Mirrors: .opencode/plugins/ask-surface-guard.js; .pi/extensions/ask-surface-guard.ts
- Kill switch: SYSTEM_ASK_SURFACE_DISABLED
- Packets:
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/ask-surface-guard/001-ask-surface-enforcement | Enforce asking operator decisions through each runtime's native ask-question tool instead of prose option menus
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
  - MENTIONS | TOP-LEVEL | specs/hooks-plugins-extensions/ask-surface-guard/001-ask-surface-enforcement | Enforce asking operator decisions through each runtime's native ask-question tool instead of prose option menus
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
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/decision-capture/001-decision-capture | Decision capture series
  - OWNS | CHILD | specs/hooks-plugins-extensions/decision-capture/001-decision-capture/001-decision-capture-build | Automatic operator decision capture
  - OWNS | CHILD | specs/hooks-plugins-extensions/decision-capture/001-decision-capture/002-table-row-matching | Phase 2: table-row-matching
  - OWNS | CHILD | specs/hooks-plugins-extensions/decision-capture/001-decision-capture/003-codex-and-pi-capture | Phase 3: codex-and-pi-capture
  - OWNS | CHILD | specs/hooks-plugins-extensions/decision-capture/001-decision-capture/004-opencode-devin-live-capture | Phase 4: opencode-devin-live-capture
  - OWNS | CHILD | specs/hooks-plugins-extensions/decision-capture/001-decision-capture/005-chat-question-detection | Phase 5: chat-question-detection
  - OWNS | CHILD | specs/hooks-plugins-extensions/decision-capture/001-decision-capture/006-live-conversation-test | Phase 6: live-conversation-test
  - OWNS | CHILD | specs/hooks-plugins-extensions/decision-capture/001-decision-capture/007-gap-closure | Phase 7: gap-closure
  - OWNS | CHILD | specs/hooks-plugins-extensions/decision-capture/001-decision-capture/008-project-scoped-state | Phase 8: project-scoped-state
  - OWNS | CHILD | specs/hooks-plugins-extensions/decision-capture/001-decision-capture/009-chat-answer-evidence | Phase 9: chat-answer-evidence
  - OWNS | CHILD | specs/hooks-plugins-extensions/decision-capture/001-decision-capture/010-decision-routing-vocabulary | Phase 10: decision-routing-vocabulary
  - MENTIONS | TOP-LEVEL | specs/hooks-plugins-extensions/ask-surface-guard/001-ask-surface-enforcement | Enforce asking operator decisions through each runtime's native ask-question tool instead of prose option menus
- Evidence: .skilled/hooks/decision-capture/lib/capture-core.mjs:4, .skilled/hooks/decision-capture/lib/capture-core.mjs:7, .skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs:5, .skilled/hooks/decision-capture/bin/README.md:17
- Unsure: The feature folder has no top-level README.md; the Purpose comes from the lib, claude and bin READMEs and the code headers. Ten more MENTIONS are omitted (22 packets match; 11 OWNS and 11 MENTIONS). .skilled/hooks/README.md:239 records that there is no opencode/ mirror in this tree.

---

## directive-lifecycle
- Purpose: Records, per session, whether the Skill Advisor's constant directive block has already been delivered, and re-arms full delivery only on a lifecycle boundary (`startup` / `resume` / `compact` / `clear` / `post-compact`) so the block appears at startup and after a compaction rather than on every turn. A decision function picks `full` or `suppressed` against a durable file-backed store, and a boundary adapter advances that store on host lifecycle events.
- Kind: mix: library (decision core + store) and hook (Claude boundary adapter)
- Code: .skilled/hooks/directive-lifecycle/README.md, .skilled/hooks/directive-lifecycle/claude/directive-lifecycle-boundary.ts, .skilled/hooks/directive-lifecycle/claude/speckit-directive-lifecycle-boundary.ts, .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts, .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-contract.ts, .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts
- Runtimes: claude (the only runtime subfolder; codex, cursor, devin, opencode and pi reach the same decision core inside their shared prompt-submit paths, with no standalone adapter folder)
- Mirrors: none
- Kill switch: SYSTEM_DIRECTIVE_LIFECYCLE_DISABLED (.skilled/hooks/hook-flags.env.example:29)
- Packets:
  - OWNS | CHILD | specs/hooks-plugins-extensions/directive-lifecycle/001-injection-bloat-reduction/014-cross-runtime-directive-lifecycle | Spec: Cross-Runtime Directive Lifecycle
  - OWNS | CHILD | specs/hooks-plugins-extensions/directive-lifecycle/001-injection-bloat-reduction/015-directive-docs-alignment | Spec: Directive-Lifecycle Documentation Alignment
  - OWNS | CHILD | specs/hooks-plugins-extensions/directive-lifecycle/001-injection-bloat-reduction/016-directive-playbook-alignment | Spec: Directive-Lifecycle Playbook Alignment
  - OWNS | CHILD | specs/hooks-plugins-extensions/directive-lifecycle/001-injection-bloat-reduction/017-adapter-live-delivery-verification | Spec: Adapter Live-Delivery Verification
  - OWNS | CHILD | specs/hooks-plugins-extensions/directive-lifecycle/001-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery | Feature Specification: Fix Code-Review P0-P3 Findings for Directive-Lifecycle Delivery
  - OWNS | CHILD | specs/hooks-plugins-extensions/directive-lifecycle/001-injection-bloat-reduction/019-pi-directive-startup-compaction-only | Feature Specification: Directive Delivery — Startup + Compaction Only (Pi directives-only gap fix)
  - MENTIONS | CHILD | specs/hooks-plugins-extensions/directive-lifecycle/001-injection-bloat-reduction/013-pi-local-directive-dedup | Spec: Pi-Local Directive De-Duplication
  - MENTIONS | TOP-LEVEL | specs/hooks-plugins-extensions/directive-lifecycle/001-injection-bloat-reduction | Per-Prompt Injection Bloat Reduction
  - MENTIONS | TOP-LEVEL | specs/hooks-plugins-extensions/directive-lifecycle/003-retire-governor-and-proof-directives | Feature Specification: Retire the Governor and Proof-Over-Appearance Directives
  - MENTIONS | CHILD | specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/004-headless-fallback-status-and-dedup | Feature Specification: Headless Fallback Status and Dedup
  - MENTIONS | CHILD | specs/system-skill-advisor/runtime-lifecycle/004-defect-and-hardening-fixes/003-fix-remaining-advisor-defects | Feature Specification: Restore the pi advisor dedup return, renew the drifted advisor battery and close the stale documentation surfaces
  - MENTIONS | CHILD | specs/hooks-plugins-extensions/skill-advisor/002-pi-advisor-bridge/001-restore-pi-advisor-brief | Feature Specification: restore the pi skill advisor brief: probe either root name for the warm-CLI assets and key the directive dedup receipt on the full contribution
  - 13 more MENTIONS omitted
- Evidence: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts:121 (`decideDirectiveLifecycleDelivery`); .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-contract.ts:7 (`DIRECTIVE_SEPARATOR = '\nDirectives:'`); .skilled/skills/system-skill-advisor/hooks/claude/directive-lifecycle-boundary.ts:36 (`advanceDirectiveLifecycleBoundary(state, input?.session_id)`)
- Unsure: The hub folder holds only relative symlinks, so the cited line numbers are in the canonical skill sources, not in files under .skilled/hooks/directive-lifecycle/. I did not open `.skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts` or the Pi `prompt-advisor.ts` the README names, so the durable-store internals and Pi's embedded dedup are the README's account.

---

## dispatch
- Purpose: Evaluates a composed CLI dispatch command's declared hard rules before it spawns, denying on a `block`-severity violation and attaching an advisory on a `warn`, then appends one scrubbed, truncated JSONL line per completed dispatch to a size-rotated audit log. Both cores are dependency-free and shared by every runtime adapter, and the audit never decides, it only records.
- Kind: mix: hook adapters + library cores
- Code: .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs, .skilled/hooks/dispatch/lib/dispatch-audit.mjs, .skilled/hooks/dispatch/claude/, .skilled/hooks/dispatch/codex/, .skilled/hooks/dispatch/cursor/, .skilled/hooks/dispatch/devin/, .skilled/hooks/dispatch/dsh/, .skilled/hooks/dispatch/opencode/, .skilled/hooks/dispatch/pi/
- Runtimes: claude, codex, cursor, devin, dsh, opencode, pi
- Mirrors: .opencode/plugins/cli-dispatch-audit.js; .pi/extensions/dispatch-audit.ts, .pi/extensions/dispatch-preflight-lint.ts
- Kill switch: SYSTEM_DISPATCH_DISABLED, SYSTEM_DISPATCH_GUARD_DISABLED (.skilled/hooks/hook-flags.env.example:30-31)
- Packets:
  - OWNS | CHILD | specs/hooks-plugins-extensions/goal/001-goal-hooks-cross-runtime/006-dispatch-shape-coverage | Feature Specification: Dispatch-shape coverage for devin/cursor/pi + Codex fold-in
  - OWNS | CHILD | specs/hooks-plugins-extensions/directive-lifecycle/002-fable-governor-pi-hook/006-dispatch-authorization-hardening | Pi Dispatch Authorization Boundary Hardening
  - OWNS | CHILD | specs/hooks-plugins-extensions/directive-lifecycle/002-fable-governor-pi-hook/007-dispatch-validation-evidence | Dispatch Validation, Evidence, and Corpus Baseline
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/dispatch/001-dispatch-adapter-test-repair | Feature Specification: Document the owning runner for the dispatch adapter vitest suites
  - OWNS | CHILD | specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/040-dispatch-lint-held-fixes | Feature Specification: Phase 40: dispatch-lint-held-fixes
  - OWNS | CHILD | specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/051-dispatch-lint-nested-quote-gap | Feature Specification: Phase 51: dispatch-lint-nested-quote-gap
  - OWNS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/007-dispatch-recognition-and-stress-adapter | Feature Specification: Phase 7: dispatch-recognition-and-stress-adapter
  - OWNS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/007-dispatch-recognition-and-hard-rules | Feature Specification: Phase 7: dispatch-recognition-and-hard-rules
  - OWNS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/001-cli-hermes-creation/014-extend-dispatch-coverage | Feature Specification: Phase 2: extend-dispatch-coverage
  - MENTIONS | TOP-LEVEL | specs/cli-classifier/003-cli-jev-workflow-integration/040-hard-rules-sidecar | Feature Specification: Phase 40: hard-rules-sidecar
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/001-cli-hermes-creation/011-dispatch-preflight-parity-research | Feature Specification: Phase 1: dispatch-preflight-parity-research
  - MENTIONS | CHILD | specs/sk-code/hub-architecture/003-sk-code-poinytail-based-refinement/015-closeout/004-dispatch-guard-and-vitest | Feature Specification: Phase 4: dispatch-guard-and-vitest
  - 64 more MENTIONS omitted
- Evidence: .skilled/hooks/dispatch/lib/dispatch-audit.mjs:51 (`DISPATCH_SHAPES` registry); .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:548 (`CHECKS`); .skilled/hooks/dispatch/lib/dispatch-audit.mjs:1227 (`recordDispatch`)
- Unsure: The README says 41 checks are registered; I confirmed `CHECKS` exists at line 548 but did not count its entries. The bare term "dispatch" matched 802 spec.md files, so the packet search was narrowed to the concern's own identifiers (`cli-dispatch`, `dispatch-preflight`, `dispatch-audit`, `dispatch-rule-checks`), which matched 76.

---

## dist-freshness
- Purpose: Compares compiled `dist/` output against its TypeScript sources and, when stale, triggers a rebuild so a session that imports a compiled script never runs against an out-of-date build. The OpenCode plugin owns the mid-session projection into system context, and a per-runtime shell check surfaces a bounded stdout banner on the editor runtimes.
- Kind: mix: plugin (OpenCode projection) + hook (per-runtime shell banner)
- Code: .opencode/plugins/system-dist-freshness-guard.js, .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh, .skilled/hooks/dist-freshness/claude/, .skilled/hooks/dist-freshness/codex/, .skilled/hooks/dist-freshness/cursor/, .skilled/hooks/dist-freshness/devin/, .skilled/hooks/dist-freshness/opencode/
- Runtimes: claude, codex, cursor, devin, opencode
- Mirrors: .opencode/plugins/system-dist-freshness-guard.js (the `opencode/` subfolder is a browsability-only symlink back to it); none in .pi/extensions
- Kill switch: SYSTEM_DIST_FRESHNESS_DISABLED (.skilled/hooks/hook-flags.env.example:32)
- Packets:
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/dist-freshness/001-dist-staleness-rebuild-on-drift | Spec: Dist Staleness Rebuild-on-Drift
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/dist-freshness/002-dist-guard-skip-unprovisioned | Spec: Dist Guard Skip Unprovisioned Packages
  - OWNS | CHILD | specs/system-speckit/memory-search-and-knowledge/003-memory-search-intelligence/003-spec-data-quality/016-validate-sh-dist-freshness-and-repo-remediation | Feature Specification: validate.sh Dist Freshness + Repo-Wide Remediation
  - OWNS | CHILD | specs/system-speckit/memory-search-and-knowledge/003-memory-search-intelligence/003-spec-data-quality/016-validate-sh-dist-freshness-and-repo-remediation/001-dist-freshness-enforcement | Feature Specification: Dist Freshness Enforcement
  - MENTIONS | TOP-LEVEL | specs/system-skill-advisor/runtime-lifecycle/005-build-freshness-record | Feature Specification: Record the advisor runtime dist build so a fresh build writes its own freshness attestation
  - MENTIONS | CHILD | specs/system-skill-advisor/codebase-conformance/004-advisor-status-truthfulness/001-freshness-and-scan-truth | Feature Specification: Phase 1: freshness-and-scan-truth
  - MENTIONS | CHILD | specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/028-plugin-kill-switch-coverage | Feature Specification: Phase 28: plugin-kill-switch-coverage
  - MENTIONS | TOP-LEVEL | specs/hooks-plugins-extensions/hook-platform/003-hook-library-mk-rename | Feature Specification: Hook Library mk- Prefix Rename
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/015-dsh-hook-parity | Feature Specification: Phase 15: dsh-hook-parity
  - MENTIONS | CHILD | specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/002-pins-imports-dual-export | Feature Specification: Phase 2: pins-imports-dual-export
  - MENTIONS | CHILD | specs/sk-code/quality-and-review-modes/002-quality-agnostic-gate/010-alignment-audit | Feature Specification: Phase 10: alignment-audit
  - MENTIONS | CHILD | specs/sk-doc/doc-validation-tooling/002-readme-validation-debt/001-repo-doc-debt/007-alignment-fixes | Feature Specification: doc checker accuracy and README debt fixes
  - 31 more MENTIONS omitted
- Evidence: .opencode/plugins/system-dist-freshness-guard.js:142 (`MkDistFreshnessGuardPlugin`); .opencode/plugins/system-dist-freshness-guard.js:236 (`experimental.chat.system.transform`); .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:163 (`STALE DIST WARNING` with the rebuild command)
- Unsure: The shared checker core `.skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs` was not opened; I confirmed only that the plugin imports `checkAllFreshness` from it at line 26. The README calls `check-dist-staleness.sh` a Python 3 script despite the `.sh` suffix, which I did not verify beyond its Python-style contents.

---

## env-secret-guard
- Purpose: Denies a file-tool call or a shell call that would read or write a dotenv file, then after a shell call puts back any dotenv file that changed, was deleted or was created and scans the output for a dotenv value. It also answers three value-free questions about a dotenv file: the keys it defines, the lines that fail to parse, and an HMAC-SHA256 fingerprint of one value keyed by `ENV_SECRET_GUARD_PEPPER`.
- Kind: mix: hook + plugin + extension + CLI
- Code: .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs, .skilled/hooks/env-secret-guard/lib/env-secret-watch.cjs, .skilled/hooks/env-secret-guard/cli/env-secret.cjs, .skilled/hooks/env-secret-guard/command-hook/, .skilled/hooks/env-secret-guard/pi/, .skilled/hooks/env-secret-guard/dsh/, .skilled/hooks/env-secret-guard/opencode/, .skilled/hooks/env-secret-guard/tests/
- Runtimes: dsh, opencode, pi (plus `command-hook/` shared by claude, codex, cursor and devin)
- Mirrors: .opencode/plugins/env-secret-guard.js; .pi/extensions/env-secret-guard.ts
- Kill switch: SYSTEM_ENV_SECRET_GUARD_DISABLED (.skilled/hooks/hook-flags.env.example:33, which notes it is environment-only and not read from that file)
- Packets:
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/env-secret-guard/001-env-secret-guard | Feature Specification: env secret guard for every runtime
  - MENTIONS | TOP-LEVEL | specs/hooks-plugins-extensions/pi-extensions/012-file-relative-adapter-imports | Feature Specification: Pi loads hook adapters on every version
  - MENTIONS | TOP-LEVEL | specs/system-speckit/repo-operations/005-main-ci-red-checks | Feature Specification: Repair the five checks that fail on main
- Evidence: .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:770 (`evaluateToolCall`); .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:998 (`fingerprint`, keyed by `ENV_SECRET_GUARD_PEPPER` at line 25); .skilled/hooks/env-secret-guard/lib/env-secret-watch.cjs:277 (`reviewToolResult`)
- Unsure: The runtime registration files the README names (`.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json`) were not opened, so the per-runtime deny shapes are the README's account. I also did not open `.skilled/hooks/env-secret-guard/dsh/env-secret-guard.mjs` or the Pi `env-secret-guard.ts` adapter.

---

## git
- Purpose: A standalone, opt-in Git hook surface: `install-hooks.sh` symlinks `pre-commit` into the repository's git hook directory, and `pre-commit` runs the comment-hygiene and agent-mirror-sync gates over staged files, exiting 0 when neither blocks. The README calls this the standalone/legacy surface and names `.skilled/scripts/install-git-hooks.sh` as the repository's primary installer.
- Kind: git hook
- Code: .skilled/hooks/git/install-hooks.sh, .skilled/hooks/git/pre-commit, .skilled/hooks/git/install-hooks.test.sh
- Runtimes: none (a native Git hook invoked from the git hook directory, with no per-runtime adapters)
- Mirrors: none
- Kill switch: SYSTEM_GIT_COMMIT_HOOKS_DISABLED (.skilled/hooks/hook-flags.env.example:34), read through `hook_enabled git-commit-hooks`
- Packets:
  - MENTIONS | CHILD | specs/hooks-plugins-extensions/git-preflight-and-message-gate/001-template-driven-message-enforcement/001-git-hook-review-fixes | Feature Specification: Phase 1: git-hook-review-fixes
  - MENTIONS | CHILD | specs/hooks-plugins-extensions/git-preflight-and-message-gate/001-template-driven-message-enforcement/002-git-hook-review-residuals | Feature Specification: Phase 2: git-hook-review-residuals
  - MENTIONS | CHILD | specs/hooks-plugins-extensions/git-preflight-and-message-gate/001-template-driven-message-enforcement/003-hook-docs-and-standards-alignment | Feature Specification: Phase 3: hook-docs-and-standards-alignment
  - MENTIONS | CHILD | specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/042-hooks-and-plugins-held-fixes | Feature Specification: Phase 42: hooks-and-plugins-held-fixes
  - MENTIONS | CHILD | specs/sk-code/hub-architecture/003-sk-code-poinytail-based-refinement/007-follow-up-fixes/003-codex-mirror-gate | Feature Specification: Phase 3: codex-mirror-gate
  - MENTIONS | CHILD | specs/sk-code/quality-and-review-modes/004-portable-code-modes/002-quality-hygiene-policy | Feature Specification: Phase 2: quality-hygiene-policy
  - MENTIONS | CHILD | specs/system-speckit/runtime-and-release/001-system-speckit-v4/041-skilled-source-root-migration/012-fix-deep-review-p1-p2-findings-for-source-root-migration | Feature Specification: Phase 12: fix-deep-review-p1-p2-findings-for-source-root-migration
  - MENTIONS | CHILD | specs/sk-git/worktree-lifecycle/004-fsmonitor-daemon-and-worktree-relocation-regression/005-reaper-hardening | Feature Specification: Phase 5: reaper-hardening
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/015-dsh-hook-parity | Feature Specification: Phase 15: dsh-hook-parity
  - MENTIONS | CHILD | specs/sk-code/hub-architecture/003-sk-code-poinytail-based-refinement/008-round-two-recommendations/004-debt-report-and-hermes-gate | Feature Specification: Phase 4: debt-report-and-hermes-gate
  - MENTIONS | CHILD | specs/sk-code/quality-and-review-modes/002-quality-agnostic-gate/001-honest-checker | Feature Specification: Phase 1: honest-checker
  - MENTIONS | CHILD | specs/system-speckit/runtime-and-release/001-system-speckit-v4/041-skilled-source-root-migration/005-gate-and-ci-readiness | Feature Specification: Gate and CI Readiness
  - 11 more MENTIONS omitted
- Evidence: .skilled/hooks/git/pre-commit:29 (`hook_enabled git-commit-hooks || exit 0`); .skilled/hooks/git/pre-commit:75 (`git_bounded diff --cached --name-only -z --diff-filter=ACM`); .skilled/hooks/git/install-hooks.sh:22 (`ln -sf "$HOOKS_SRC/pre-commit" "$HOOKS_DEST/pre-commit"`)
- Unsure: The bare term "git" matched 201 spec.md files, so the packet search was narrowed to the feature's own paths (`hooks/git/pre-commit`, `hooks/git/install-hooks`, `hooks/git/README`), which matched 23; every one of those references the folder without making it the packet's subject. I did not open the primary hook at `.skilled/scripts/git-hooks/pre-commit`.

---

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

---

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

---

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
  - MENTIONS | CHILD | specs/hooks-plugins-extensions/session-handover/002-session-relaunch-loop/006-deep-review-2-remediation | Feature Specification: Phase 6: deep-review-2-remediation
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

## session-handover
- Purpose: Hands unfinished work to a fresh session in the same terminal when a runtime nears its context limit: each adapter asks for a handoff near its threshold, the sender prepares a note and the adapter arms a matching record, and `skilled-loop` relaunches the runtime with a claim seed when the record is armed, fresh and below the hop cap. A record still pending at exit makes the wrapper print a manual claim command for the selected runtime and consume the record.
- Kind: mix: shared core library + per-runtime adapters + OpenCode plugin + Pi extension + CLI + shell wrapper
- Code: .skilled/hooks/session-handover/lib/relaunch-core.cjs, .skilled/hooks/session-handover/lib/nudge.cjs, .skilled/hooks/session-handover/lib/killer.cjs, .skilled/hooks/session-handover/bin/session-handover.cjs, .skilled/hooks/session-handover/claude/context-nudge.mjs, .skilled/hooks/session-handover/claude/stop-arm.mjs, .skilled/hooks/session-handover/codex/context-nudge.mjs, .skilled/hooks/session-handover/codex/stop-arm.mjs, .skilled/hooks/session-handover/opencode/session-handover.js, .skilled/hooks/session-handover/pi/session-handover.ts, .skilled/bin/skilled-loop
- Runtimes: claude, codex, opencode, pi (adapter folders); cursor and devin are command-only with no adapter folder
- Mirrors: .opencode/plugins/session-handover.js, .pi/extensions/session-handover.ts
- Kill switch: SYSTEM_SESSION_HANDOVER_ENABLED=0
- Packets:
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/session-handover/002-session-relaunch-loop | Feature Specification: Session relaunch loop
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
- Evidence: .skilled/hooks/session-handover/lib/nudge.cjs:132 (the nudge text reports the context fill as `[session-handover] Context is about N% full.`), .skilled/hooks/session-handover/lib/relaunch-core.cjs:50 (the claim seed the wrapper relaunches with is `[session-handover] claim and continue handoff `), .skilled/hooks/session-handover/bin/session-handover.cjs:29 (`prepare` validates the note, writes the pending record the runtime arms, and prints the claim command outside a loop or at the hop limit)
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

---

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
  - MENTIONS | CHILD | specs/hooks-plugins-extensions/session-handover/002-session-relaunch-loop/039-hop-dialog-goal-title | Feature Specification: A Claude Code hop refuses a question dialog after prepare, starts the receiver on the packet goal and keeps the generated session title
  - MENTIONS | CHILD | specs/hooks-plugins-extensions/session-handover/002-session-relaunch-loop/039-hop-dialog-goal-title/008-history-test-database-env | Feature Specification: Phase 8: history-test-database-env
  - MENTIONS | CHILD | specs/hooks-plugins-extensions/session-handover/002-session-relaunch-loop/040-claude-default-on-release-notes | Feature Specification: Claude Code session handover on by default and v4.0.2.1 release notes
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
  - MENTIONS | CHILD | specs/hooks-plugins-extensions/session-handover/002-session-relaunch-loop/034-default-off-opt-in | Feature Specification: Session relaunch hooks off by default, opt in with SYSTEM_SESSION_RELAUNCH_ENABLED
  - MENTIONS | TOP-LEVEL | specs/hooks-plugins-extensions/git-hooks/001-git-hook-gate-reduction | Feature Specification: Git Hook Gate Reduction
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/015-dsh-hook-parity | Feature Specification: Phase 15: dsh-hook-parity
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/008-vibe-repo-guards | Feature Specification: Phase 8: vibe-repo-guards
  - MENTIONS | CHILD | specs/system-speckit/runtime-and-release/001-system-speckit-v4/049-gate-3-delivery-residue | Feature Specification: Phase 49: Gate-3 delivery residue
  - MENTIONS | CHILD | specs/hooks-plugins-extensions/session-handover/002-session-relaunch-loop/012-ci-red-check-repairs | Feature Specification: Phase 12: ci-red-check-repairs
  - MENTIONS | CHILD | specs/hooks-plugins-extensions/session-handover/002-session-relaunch-loop/038-goal-and-workflow-resume | Feature Specification: Goals and running workflows survive a session hop on every runtime
  - 32 more hits omitted
- Evidence: .skilled/hooks/shared/README.md:15 (the folder "is pure plumbing for the adapters that do", holding the kill-switch resolver, the stdin/JSON helpers and the session readers), .skilled/hooks/shared/hook-flags.cjs:206 (`isHookEnabled` resolves the master switch, the concern switch and the config file), .skilled/hooks/shared/hook-adapter-shared.cjs:29 (`readStdin` resolves at a 3000 ms deadline with the bytes read so far)
- Unsure: `.skilled/hooks/shared/` is runtime-neutral and holds only a `dsh/` subfolder, so the "runtime adapter folders" half of this feature is the `system-spec-kit/runtime/hooks/` tree rather than a folder per runtime under `shared/`. The 44-hit count is the union of the `hook-flags` and `hook library` searches, and the 19/22 mirror counts come from `rg -l` over those two folders.

---

