---
title: "Implementation Summary: Phase 21 completion-verifier-wiring"
description: "Production goal completion now has a fail-closed default verifier plus an opt-in LLM verifier tier, with provenance in status output and adversarial safety coverage."
trigger_phrases:
  - "completion verifier wiring summary"
  - "goal verifier provenance"
  - "MK_GOAL_VERIFIER"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/026-goal-opencode-plugin/021-completion-verifier-wiring"
    last_updated_at: "2026-07-03T17:50:00Z"
    last_updated_by: "opencode-gpt-5.5"
    recent_action: "Verified verifier wiring; orchestrator refreshed metadata"
    next_safe_action: "Packet complete - all 8 phases shipped"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/plugins/tests/mk-goal-supervisor.test.cjs"
      - ".opencode/skills/system-spec-kit/references/hooks/goal_plugin.md"
      - ".opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-phase-021-completion-verifier-wiring-20260703"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "2026-07-03, operator: selected option (c) hybrid, heuristic default plus env-gated LLM verifier tier."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 021-completion-verifier-wiring |
| **Status** | Complete |
| **Completed** | 2026-07-03 |
| **Level** | 1 |
| **completion_pct** | 100 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The goal plugin can now complete a goal in production without a test-only injected verifier. The default path stays conservative: ambiguous evidence remains open, while explicit objective-specific completion evidence can mark a goal complete.

### Default Verifier Wiring

`normalizeOptions` now resolves an effective `supervisorVerifier` with injected-verifier precedence first, then a production default. `MK_GOAL_VERIFIER=heuristic` is the default. `MK_GOAL_VERIFIER=llm` opts into the model-backed tier through `ctx.client.session.promptAsync`, and the `session.idle` event path threads `client: ctx?.client` into `maybeVerifyGoal` so that tier has the runtime handle it needs.

The heuristic checks the latest assistant evidence in this order: missing or very short evidence returns `not_met`; blocking or incomplete-work language overrides everything and returns `not_met`; truncated evidence returns `not_met`; evidence without an explicit completion phrase returns `not_met`; evidence that does not reference enough objective keywords returns `not_met`; only explicit completion evidence tied to the objective returns `met`. Blocking language includes failed, error, cannot, TODO, not yet, partially, still need, incomplete, waiting, and pending.

### Provenance

Verifier results now carry `verifierSource` in the `maybeVerifyGoal` envelope and persist `lastVerifierSource` on goal state. Status output renders `verifier_source=none|injected|default-heuristic|default-llm`, so operators can tell whether a verdict came from a test/custom verifier, deterministic default, or opt-in LLM tier.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/mk-goal.js` | Modified | Added default verifier selection, heuristic verifier, LLM verifier, provenance persistence/output, and client threading. |
| `.opencode/plugins/tests/mk-goal-supervisor.test.cjs` | Modified | Added positive default verifier, eight-case negative matrix, LLM error/success paths, and provenance assertions. |
| `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md` | Modified | Documented default verifier behavior, `MK_GOAL_VERIFIER`, `verifier_source`, and heuristic rules. |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified | Added `MK_GOAL_VERIFIER` as the thirteenth `MK_GOAL_*` variable and updated the total variable count. |
| `.opencode/skills/system-spec-kit/feature_catalog/ux-hooks/goal-opencode-plugin.md` | Modified | Synced feature catalog behavior and supervisor-test role. |
| `.opencode/skills/system-skill-advisor/feature_catalog/hooks-and-plugin/goal-opencode-plugin.md` | Modified | Synced feature catalog behavior and supervisor-test role. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/ux-hooks/goal-opencode-plugin.md` | Modified | Added verifier env, provenance, and default-verifier safety expectations. |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/cli-hooks-and-plugin/goal-opencode-plugin.md` | Modified | Added verifier env, provenance, and default-verifier failure triage. |
| `.opencode/specs/system-deep-loop/026-goal-opencode-plugin/021-completion-verifier-wiring/tasks.md` | Modified | Recorded task completion evidence. |
| `.opencode/specs/system-deep-loop/026-goal-opencode-plugin/021-completion-verifier-wiring/implementation-summary.md` | Modified | Replaced scaffold content with this implementation summary. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation stayed inside the existing verifier seam and did not change status membership, transition maps, phase 020 capabilities, or command-surface files. The rollout is default-on for the deterministic heuristic and explicit opt-in for the LLM tier through `MK_GOAL_VERIFIER=llm`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep injected-verifier precedence | Tests and custom callers already rely on this seam, so production defaults must fill only the missing case. |
| Default to heuristic verifier | The operator selected the hybrid design, and the fail-closed heuristic avoids silent cost, latency, and nondeterminism. |
| Treat mixed signals as `not_met` | A false completion ends autonomy early, so blocker language wins over completion phrases. |
| Require objective specificity | Generic closings such as "Done" do not prove the active goal was completed. |
| Use `ctx.client.session.promptAsync` only under `MK_GOAL_VERIFIER=llm` | The LLM tier is feasible when client is threaded, but it must never activate silently. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline full mk-goal suite | PASS: `node --test .opencode/plugins/tests/mk-goal*.test.cjs` baseline `93/93`, `0` failures. |
| Supervisor targeted suite | PASS: `node --test .opencode/plugins/tests/mk-goal-supervisor.test.cjs` current `11/11`, `0` failures. |
| Final full mk-goal suite | PASS: `node --test .opencode/plugins/tests/mk-goal*.test.cjs` current `97/97`, `0` failures. Delta from baseline: `+4` tests, no new failures. |
| Syntax checks | PASS: `node --check .opencode/plugins/mk-goal.js` and `node --check .opencode/plugins/tests/mk-goal-supervisor.test.cjs` produced no output. |
| Comment hygiene | PASS: `python3 .opencode/skills/sk-code/scripts/check-comment-hygiene.sh` on modified files produced no output. |
| Alignment drift | PASS: `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/plugins` reported `Findings: 0`, `Errors: 0`, `Warnings: 0`, `Violations: 0`. |
| Doc sync grep | PASS: all six required documentation surfaces contain `MK_GOAL_VERIFIER`, `verifier_source`, or default provenance values. |
| Checklist check | PASS: no `checklist.md` exists for this Level 1 phase, so no checklist update was required. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Heuristic is intentionally strict.** Some genuinely completed goals will remain `not_met` if evidence is generic, too short, truncated, or does not echo objective-specific terms. This preserves the prior under-completion behavior rather than risking false completion.
2. **LLM verifier is opt-in.** `MK_GOAL_VERIFIER=llm` requires `ctx.client.session.promptAsync`; tests confirmed the client threading works, and missing `promptAsync` fails closed as `blocked`.
3. **Metadata refresh was external.** `description.json`/`graph-metadata.json` were outside this dispatch's allowed write paths by design; the orchestrator regenerated them post-dispatch and confirmed `Errors: 0`.
<!-- /ANCHOR:limitations -->

---
