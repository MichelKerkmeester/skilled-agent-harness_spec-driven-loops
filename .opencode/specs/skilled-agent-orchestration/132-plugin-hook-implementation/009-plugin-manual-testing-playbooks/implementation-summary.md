---
title: "Phase Close-Out: Plugin Manual-Testing Playbooks (11 scenarios, all PASS)"
description: "11 manual-testing-playbook scenarios shipped and reviewer-verified for every plugin and hook pair"
trigger_phrases:
  - "plugin manual testing playbooks shipped"
  - "plugins-and-hooks scenarios complete"
  - "11 scenario playbook delivery"
  - "plugin hook playbook review pass"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-plugin-hook-implementation/009-plugin-manual-testing-playbooks"
    last_updated_at: "2026-07-11T17:04:41Z"
    last_updated_by: "cross-model-validation"
    recent_action: "Cross-model validated 11 scenarios and fixed 4 harness defects, all re-confirmed PASS"
    next_safe_action: "None; phase 9 of 9 is complete, no successor phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/manual_testing_playbook/plugins-and-hooks/"
      - ".opencode/skills/cli-external/manual_testing_playbook/plugins-and-hooks/"
      - ".opencode/skills/system-code-graph/manual_testing_playbook/plugins-and-hooks/"
      - ".opencode/skills/sk-code/manual_testing_playbook/plugins-and-hooks/"
      - ".opencode/skills/mcp-code-mode/manual_testing_playbook/plugins-and-hooks/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/009-plugin-manual-testing-playbooks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Skipped plugins already covered: mk-skill-advisor, mk-goal, mk-deep-loop-guard"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-plugin-manual-testing-playbooks |
| **Completed** | 2026-07-11 |
| **Status** | Complete |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase closes out the plugin/hook implementation program with the operator-facing proof that each pair actually works. It adds 11 runnable manual-testing-playbook scenarios, one per plugin/hook pair, so an operator can live-validate every guard, sentinel, and router the program shipped instead of trusting unit tests alone.

### The 7 scenarios for this program's plugin/hook pairs

Each scenario reads the pair's real shared core plus both adapters and runs the pair's actual test suite before writing a verdict: `cli-dispatch-audit-trail.md` (mk-cli-dispatch-audit, core suite 38/38), `code-graph-freshness-guard.md` (mk-code-graph-freshness, unit 12/12 plus freshness-core vitest 19/19), `post-edit-quality-router.md` (mk-post-edit-quality, suite 38/38), `completion-evidence-sentinel.md` (mk-completion-sentinel, plugin 4/4 plus core vitest 28/28), `mcp-route-guard.md` (mk-mcp-route-guard, suite 16/16), `spec-mutation-gate-enforce.md` (mk-spec-gate, core 66 passed/0 failed plus plugin 11/11, with enforce-OFF/ON/child/exempt/kill-switch all live-verified and its false-positive rate measured from live telemetry), and `speckit-completion-exposer.md` (mk-speckit-completion, live completion-state resolution including the `.opencode/specs` fallback path).

### The 4 backfill scenarios for pre-existing plugins

`code-graph-plugin.md` (mk-code-graph), `spec-memory-plugin.md` (mk-spec-memory), `dist-freshness-guard.md` (mk-dist-freshness-guard), and `session-cleanup-plugin.md` (session-cleanup) had no dedicated scenario before this phase even though the plugins themselves predate this program. Backfilling them gives the new category full 11-of-11 coverage instead of leaving it partial.

### Playbook index registration

Each of the 5 owning skills' own `manual_testing_playbook.md` now lists `plugins-and-hooks/` alongside its other categories, with a one-line description of what it covers: system-spec-kit (6 scenarios), cli-external (1), system-code-graph (2), sk-code (1), and mcp-code-mode (1). Each skill's scenario runner discovers files by recursive directory listing, so one index entry per owning skill is enough to make that skill's scenarios reachable.

### Files Changed

| File | Owning Skill | Action | Purpose |
|------|--------------|--------|---------|
| `.opencode/skills/cli-external/manual_testing_playbook/plugins-and-hooks/cli-dispatch-audit-trail.md` | cli-external | Created | Live scenario for mk-cli-dispatch-audit |
| `.opencode/skills/system-code-graph/manual_testing_playbook/plugins-and-hooks/code-graph-freshness-guard.md` | system-code-graph | Created | Live scenario for mk-code-graph-freshness |
| `.opencode/skills/sk-code/manual_testing_playbook/plugins-and-hooks/post-edit-quality-router.md` | sk-code | Created | Live scenario for mk-post-edit-quality |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/plugins-and-hooks/completion-evidence-sentinel.md` | system-spec-kit | Created | Live scenario for mk-completion-sentinel |
| `.opencode/skills/mcp-code-mode/manual_testing_playbook/plugins-and-hooks/mcp-route-guard.md` | mcp-code-mode | Created | Live scenario for mk-mcp-route-guard |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/plugins-and-hooks/spec-mutation-gate-enforce.md` | system-spec-kit | Created | Live scenario for mk-spec-gate |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/plugins-and-hooks/speckit-completion-exposer.md` | system-spec-kit | Created | Live scenario for mk-speckit-completion |
| `.opencode/skills/system-code-graph/manual_testing_playbook/plugins-and-hooks/code-graph-plugin.md` | system-code-graph | Created | Backfill scenario for mk-code-graph |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/plugins-and-hooks/spec-memory-plugin.md` | system-spec-kit | Created | Backfill scenario for mk-spec-memory |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/plugins-and-hooks/dist-freshness-guard.md` | system-spec-kit | Created | Backfill scenario for mk-dist-freshness-guard |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/plugins-and-hooks/session-cleanup-plugin.md` | system-spec-kit | Created | Backfill scenario for session-cleanup |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | system-spec-kit | Modified | Registered the plugins-and-hooks/ category (6 scenarios) |
| `.opencode/skills/cli-external/manual_testing_playbook/manual_testing_playbook.md` | cli-external | Modified | Registered the plugins-and-hooks/ category (1 scenario) |
| `.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md` | system-code-graph | Modified | Registered the plugins-and-hooks/ category (2 scenarios) |
| `.opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md` | sk-code | Modified | Registered the plugins-and-hooks/ category (1 scenario) |
| `.opencode/skills/mcp-code-mode/manual_testing_playbook/manual_testing_playbook.md` | mcp-code-mode | Modified | Registered the plugins-and-hooks/ category (1 scenario) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A Sonnet-5 xhigh agent authored each scenario against the real plugin/hook/core source and ran the pair's actual unit test for evidence, one scenario at a time. A second Sonnet-5 xhigh agent then independently reviewed all 11 scenarios, re-checking every command and expected signal against the code rather than trusting the first pass, and fixed 6 real defects inline across 5 of the scenarios. The 4 backfill scenarios followed the same authoring shape as the 7 new ones so the category reads as one consistent set.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Two-agent author-then-review pipeline instead of single-pass authoring | The reviewer pass is what actually caught the 6 real defects across 5 scenarios; a single author would have shipped those unnoticed |
| Backfill the 4 pre-existing plugins into this phase instead of leaving them out | Gives the new plugins-and-hooks/ category full 11-of-11 coverage instead of a category that looks half-finished |
| Exclude mk-skill-advisor, mk-goal, and mk-deep-loop-guard | Each already has manual-testing coverage elsewhere; a second scenario here would fork the source of truth |
| Register the category once per owning skill's own index rather than one entry per scenario | Each skill's scenario runner already discovers files by recursive directory listing, so one category line per owning skill is sufficient |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| cli-dispatch-audit-trail.md live run | PASS - core suite 38/38, kill-switch and redaction confirmed live |
| code-graph-freshness-guard.md live run | PASS - unit 12/12 + freshness-core vitest 19/19, live gate-order confirmed |
| post-edit-quality-router.md live run | PASS - suite 38/38, live PostToolUse hygiene banner + kill-switch confirmed |
| completion-evidence-sentinel.md live run | PASS - plugin 4/4 + core vitest 28/28, live claim-detection + dedup confirmed |
| mcp-route-guard.md live run | PASS - suite 16/16, warn-on-registered/silent-on-unregistered confirmed live |
| spec-mutation-gate-enforce.md live run | PASS - core 66 passed/0 failed + plugin 11/11, enforce-OFF/ON/child/exempt/kill-switch all live-verified |
| speckit-completion-exposer.md live run | PASS - live completion-state resolution incl. .opencode/specs fallback confirmed |
| 4 backfill scenarios (code-graph, spec-memory, dist-freshness-guard, session-cleanup) | PASS - confirmed against existing plugin coverage |
| Independent review pass | PASS - 6 real defects found and fixed inline across 5 scenarios, 0 remaining after fix |
| `validate.sh --strict` on this phase folder | PASS - Errors: 0 (see checklist.md for the run detail) |

### Post-Delivery Cross-Model Validation (2026-07-11)

Every one of the 11 scenarios was then independently re-executed by an external model, GPT-5.6-sol-fast (`--variant high`, direct OpenAI provider), acting as a blind test operator that ran each scenario's TEST EXECUTION commands verbatim and reported its own verdict. 7 scenarios passed clean on the first pass. The run surfaced 4 defects, all in the scenario/harness layer, never in plugin logic; every plugin's own unit suite stayed green throughout.

| Scenario | Defect surfaced by independent execution | Fix applied |
|----------|-------------------------------------------|-------------|
| completion-evidence-sentinel | The Stop-hook step invoked the hook by a repo-relative path after `cd` into a temp dir, so it failed with `MODULE_NOT_FOUND` | Capture the repo root first and invoke the hook by absolute path while the working directory stays the temp project |
| spec-mutation-gate-enforce | The unit test and the live enforce-deny step inherited the operator's ambient `AI_SESSION_CHILD=1`, which forces advise-only and suppresses the expected deny | Neutralize `AI_SESSION_CHILD` (and `MK_SPEC_GATE_ENFORCE`) with `env -u` on the two deny-path commands |
| session-cleanup-plugin | The live-injection assertion assumed `worktree-guard.sh` always emits, but it is git-state-driven and stays silent in an isolated checkout or when `AI_SESSION_CHILD=1` | Pin a throwaway shared-checkout fixture and `env -u AI_SESSION_CHILD` so the real guard emits deterministically; document the empty-when-silenced branch as a valid pass with the second-call-always-empty invariant |
| spec-memory-plugin | A cleanup step deleted the live-check fixture before a later step re-ran it | Move the single teardown to after the final step that uses the fixture |

After the fixes, all 4 were re-confirmed PASS by two independent operators (GPT-5.6-sol-fast and Sonnet), each running the corrected commands under the same leaky operator environment (`AI_SESSION_CHILD=1 MK_SPEC_GATE_ENFORCE=0`) the defects were originally exposed under.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Backfill scenarios were re-executed post-delivery.** The 4 backfill scenarios (`code-graph-plugin.md`, `spec-memory-plugin.md`, `dist-freshness-guard.md`, `session-cleanup-plugin.md`) originally recorded a PASS verdict against existing plugin coverage rather than a fresh run captured inside this phase. The 2026-07-11 cross-model validation pass (see Verification) has since re-executed all of them live on GPT-5.6-sol-fast, so their evidence is no longer inherited-only.
2. **No CI wiring yet.** These 11 scenarios run on operator demand per the playbook's manual EXECUTION POLICY; nothing schedules them automatically. A future phase could wire a subset into CI if that becomes valuable.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
