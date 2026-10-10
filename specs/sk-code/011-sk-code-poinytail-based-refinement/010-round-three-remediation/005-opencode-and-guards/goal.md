---
title: "Goal: Phase 5: opencode-and-guards"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/005-opencode-and-guards"
    last_updated_at: "2026-10-10T14:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-010-005-opencode-and-guards"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 5: opencode-and-guards

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Add a documentation claim checker as the fourth sk-code drift guard, make the router-sync guard and hub version parity read their facts from the declared sources, cover the OBSIDIAN-versus-WEBFLOW precedence in the canary and leave the OpenCode packet with no checker hit.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The checker is `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_doc_claims.cjs` with four checks (paths, names, surfaces, tiers) and an `ALLOWED` data block whose every row carries a reason; its known-bad inputs are written by its test into a temp hub, never kept as files under the hub. |
| D2 | `code-quality` and `code-review` count as retired names only in backticks or after `sk-code:`, and the surfaces check matches count claims only, never a list of two surface packets. |
| D3 | Router-sync check 2 reads the `ROUTER.md` `SHARED_CONTROL_RESOURCES` list and `DEFAULT_RESOURCE` preamble and accepts a workflow mode's own leaf through `leaf-manifest.json`; the three shared workflow-doc allowlist entries and their comment stay. |
| D4 | Doctor 13c warns, not fails, only for `cli-classifier`, `cli-external-orchestration`, `sk-doc` and `system-deep-loop`, and checker hits in files other children own are handed off, never edited here. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node --test .skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify_doc_claims.test.cjs` prints `pass 6` and `fail 0` and exits 0.
- [ ] `node .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs && node --test .skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify_router_sync.test.cjs` prints `router-sync: 5/5 checks passed`, `pass 5` and `fail 0` and exits 0.
- [ ] `node .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_doc_claims.cjs | grep -c 'sk-code-opencode/'` prints `0` and exits 1.
- [ ] `node .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs` prints `pass 98` and `fail 0` and exits 0.
- [ ] `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` prints `PASS: doc-claims` and `run-all-drift-guards: all 4 guards PASSED` and exits 0, which holds only after children 001 to 004 have landed.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/005-opencode-and-guards --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Checker test passes 6 of 6 | Done | `node --test verify_doc_claims.test.cjs` -> exit 0, pass 6, fail 0 |
| Router-sync 5/5 and its test 5 of 5 | Done | `router-sync: 5/5 checks passed`; test pass 5, fail 0 |
| No checker hit under `sk-code-opencode/` | Done | `verify_doc_claims.cjs \| grep -c 'sk-code-opencode/'` -> 0, grep exit 1 |
| Doctor test 98 of 98 | Done | exit 0, pass 98, fail 0 |
| Umbrella passes four guards | Done | exit 0; four PASS, `run-all-drift-guards: all 4 guards PASSED`; `doc-claims: 4/4 checks passed` |
| Folder validates strict | Done | `validate.sh <folder> --strict` -> RESULT: PASSED, Errors 0 |

### Deviations and findings

| Item | Note |
|------|------|
| Phase 1 skipped by the builder | No `before-*` files exist; before state was taken from HEAD, plan.md section 6 and `scratch/plan-doc-claims.txt` |
| Checker false positive | The four `ROUTER.md:605` hits were correct prose. Fixed by FX1 and FX2 (applied; `scratch/fix-units-applied.json`); the test stays at 6 by extending the existing clean-hub and tiers tests, so criterion 1 keeps `pass 6` |
| Compiled routing and Hermes | `compiled-route-guard` reads `sk-code stale-manifest` and Hermes `--check` reports drift: PENDING-ORCHESTRATOR |
<!-- /ANCHOR:log -->
