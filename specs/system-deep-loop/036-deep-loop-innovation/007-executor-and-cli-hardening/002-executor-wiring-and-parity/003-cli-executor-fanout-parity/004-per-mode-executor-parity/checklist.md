---
title: "Checklist: Per-Mode Executor Parity"
description: "QA checklist for giving model-benchmark, skill-benchmark, and ai-council cli-cursor/cli-devin/cli-pi parity through the shared buildLineageCommand; leaf 1 and leaf 3 built and gated, leaf 2 exempt by design, external SOL and operator gates deferred."
trigger_phrases:
  - "per-mode executor parity checklist"
  - "model-benchmark cursor devin pi checklist"
  - "buildLineageCommand delegation checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-executor-wiring-and-parity/003-cli-executor-fanout-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/002-executor-wiring-and-parity/003-cli-executor-fanout-parity/004-per-mode-executor-parity"
    last_updated_at: "2026-08-18T23:59:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed evidenced parity items and deferred external SOL and operator sign-off"
    next_safe_action: "Await SOL verdicts and operator review before the combo-matrix phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs"
      - ".opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

# QA Checklist: Per-Mode Executor Parity

<!-- ANCHOR:protocol -->
## Verification Protocol
Per leaf: targeted lane test (full output, never through `tail`) + a stash-baseline delta requiring the post-change failure set to be a strict subset of the pre-change set (zero new failures) + whole-runtime tsc + a require smoke test + SOL cross-verify before landing.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-001 [P1] Per-mode coverage matrix produced; the three gap modes identified [File: spec.md:60]
- [x] CHK-002 [P1] Confirmed the shared builder fits cursor/devin/pi and is reused, not forked [File: implementation-summary.md:52]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-003 [P0] Leaf 1: cursor/devin/pi delegate to `buildLineageCommand`; opencode/claude untouched; fan-out builders untouched [File: .opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:466]
- [x] CHK-004 [P0] Leaf 1: stale local cursor/pi allowlists removed with no dangling references; `cli-devin` registered in both registries [File: .opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/profile-validator.cjs:39]
- [x] CHK-005 [P1] Leaf 3 (ai-council) delegates cursor/devin/pi to `buildLineageCommand`; leaf 2 (skill-benchmark) is a documented design exemption at the dispatch branch (`executor-dispatch.cjs:147`), not a shared-builder delegate [File: .opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:268]
- [x] CHK-006 [P2] Comment hygiene: durable WHY only, no ephemeral ids/spec paths [File: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:147]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-007 [P0] Leaf 1 targeted test 32/32; tsc 0; require smoke test ok [File: implementation-summary.md:99]
- [x] CHK-008 [P0] Leaf 1 stash-baseline delta: zero new failures (post-change set is a strict subset of the pre-change baseline) [File: implementation-summary.md:100]
- [x] CHK-009 [P1] Leaf 1 SOL cross-verify: 3 P1 found — two fixed + scenario-tested (sweep-abort throw, pi exit-0 false-success), one documented (unused bin-override); re-gate 35/35, tsc 0 [File: .opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:551]
- [x] CHK-010 [P0] Leaf 3 built + baseline-verified: council suite 105/105 (baseline 94/94), zero new failures; leaf 2 exempt-by-design (doc-only); external SOL sign-off tracked at CHK-019 [File: implementation-summary.md:121]
- [x] CHK-011 [P0] `validate.sh --strict` passes for this phase: Errors 0 [File: implementation-summary.md:105]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-012 [P1] Leaf 1: model-benchmark's cli-pi stub removed and its stale cursor read-only fiction replaced with the hardened flags [File: .opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:466]
- [x] CHK-013 [P1] model-benchmark and ai-council reach cursor/devin/pi parity via `buildLineageCommand`; skill-benchmark is a documented design exemption (observation-model limitation) [File: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/executor-dispatch.cjs:147]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security
- [x] CHK-014 [P0] Read-only-by-default preserved: write-capable is the explicit opt-in mapping to `workspace-write` [File: .opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:416]
- [x] CHK-015 [P0] Read-only cursor/devin/pi dispatches inherit the hardened, genuinely-read-only flags from the shared builder [File: .opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:268]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-016 [P2] Each mode's delegation documents the durable WHY (reuse the single hardened source, no fork) [File: implementation-summary.md:91]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-017 [P1] Leaf 1 confined to model-benchmark's `dispatch-model.cjs`, `profile-validator.cjs`, and its lane test [File: implementation-summary.md:56]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
- [x] CHK-018 [P1] Leaf 1 unit + baseline-delta evidence recorded in the implementation summary [File: implementation-summary.md:99]
- [Deferred: SOL verdict is external sign-off, pending] CHK-019 [P1] SOL verdicts recorded per leaf (leaf 1 and leaf 3 dev-time SOL dispositions recorded; leaf 2 exempt; final external SOL acceptance pending)

Local implementation evidence is complete: leaf 1 (model-benchmark) and leaf 3 (ai-council) delegate cursor/devin/pi to the shared `buildLineageCommand`, both suites are green with zero new failures against their baselines, and leaf 2 (skill-benchmark) is a documented design exemption. CHK-019 and CHK-020 are deferred pending external sign-off, non-blocking gates this packet cannot grant itself.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off
- [Deferred: operator review is external sign-off, pending] CHK-020 [P0] Operator review before the combo-matrix phase (005) exercises the parity end-to-end
<!-- /ANCHOR:sign-off -->
