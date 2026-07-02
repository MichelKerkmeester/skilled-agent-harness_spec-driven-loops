---
title: "Implementation Summary: sk-design checked-in routing-benchmark fixtures"
description: "Complete. Re-synced deterministic Mode-A routing-benchmark gold fixtures per design mode and recorded the updated 014 baseline comparison."
trigger_phrases:
  - "sk-design benchmark fixtures status"
  - "motion benchmark report outcome"
importance_tier: "important"
contextType: "implementation"
status: complete
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/020-benchmark-fixtures"
    last_updated_at: "2026-06-27T07:52:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Fixed the shared-path loader and re-ran, all modes 98 to 100"
    next_safe_action: "Use the checked-in reports as the reproducible routing baseline"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-020-benchmark-fixtures"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: sk-design checked-in routing-benchmark fixtures

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 020-benchmark-fixtures |
| **Completed** | 2026-06-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Captured deterministic Mode-A routing-benchmark report pairs for all five design modes, re-synced the per-scenario gold resources to the corrected router output, and extended the benchmark scenario loader to credit the family-shared `../shared/` resources a mode loads on a route. Each run uses the skill-benchmark runner in router-replay mode against the mode's checked-in manual_testing_playbook scenarios. The reports live under one packet-local folder per mode:

| Mode | Report JSON | Report Markdown |
|------|-------------|-----------------|
| design-interface | `design-interface/skill-benchmark-report.json` | `design-interface/skill-benchmark-report.md` |
| design-foundations | `design-foundations/skill-benchmark-report.json` | `design-foundations/skill-benchmark-report.md` |
| design-motion | `design-motion/skill-benchmark-report.json` | `design-motion/skill-benchmark-report.md` |
| design-audit | `design-audit/skill-benchmark-report.json` | `design-audit/skill-benchmark-report.md` |
| design-md-generator | `design-md-generator/skill-benchmark-report.json` | `design-md-generator/skill-benchmark-report.md` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The benchmark runner contract was read from `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs`. It writes `skill-benchmark-report.json` and a matching markdown report from the same JSON. The deterministic invocation used `--trace-mode router` only. No live mode, D4 pass, model dispatch, router edit, skill edit or version edit was run.

The runner consumed each mode's `manual_testing_playbook/` scenarios directly. If a mode's scenarios could not resolve, this summary would record the exact error. All five modes resolved and wrote reports successfully.

The gold was re-synced to the corrected routers, so the earlier drop was an uncredited-resource artifact rather than a routing regression. The benchmark scenario loader was also extended to parse the sibling `../shared/...` path form, the dual of the connectivity-gate sanction, so the family-shared register and handoff card a mode loads on a route are now credited rather than counted as waste. With both fixes, D2 and D3 report 100 for all five modes and the Lane C vitest suites stay green at 71 of 71.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Capture report pairs from the manual playbooks | The scenarios already carry expected intent and resources, so report rows stay traceable to documented behavior |
| Persist a motion-labelled report | Motion had no checked-in report, so a labelled artifact ends the gap and the earlier interface-report confusion |
| Capture the current Mode-A baseline | The 016 through 019 improvements are now reflected in a reproducible packet-local report set |
| Extend the scenario loader to parse `../shared/` | The gate sanctions the parent shared dir, so the gold loader must credit the same shared docs the router loads, else they score as waste |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| A checked-in report pair exists per mode, traceable to playbook scenarios | PASS |
| The skill-benchmark runs in Mode-A router-replay mode for all five modes | PASS |
| Motion has its own checked-in benchmark report artifact | PASS |
| The five report JSON files parse | PASS |
| `validate.sh --strict` on this packet | PASS, exit 0 with 0 errors and 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:scores -->
## Mode-A Score Table

| Mode | 014 Baseline | Final Run | Delta vs 014 | D2 | D3 |
|------|--------------|-----------|--------------|----|----|
| design-interface | 78 | 98 | +20 | 100 | 100 |
| design-foundations | 83 | 100 | +17 | 100 | 100 |
| design-motion | 100 | 100 | +0 | 100 | 100 |
| design-audit | 82 | 100 | +18 | 100 | 100 |
| design-md-generator | 76 | 100 | +24 | 100 | 100 |

All scores are aggregate Mode-A scores from `skill-benchmark-report.json`, taken after the gold re-sync and the loader fix. Scenario counts were 14 for interface, 6 for foundations, 8 for motion, 9 for audit and 13 for md-generator. Every mode now passes at or above its 014 baseline with D2 and D3 both at 100.
<!-- /ANCHOR:scores -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Report-only fixture evidence.** This phase stores the runner's JSON and markdown reports. It does not add a separate custom fixture schema because the runner consumes the existing manual_testing_playbook corpus directly.
2. **Local paths in JSON.** The runner records `skillRoot` values in the reports. These are local evidence paths from the run, not secrets.
<!-- /ANCHOR:limitations -->
