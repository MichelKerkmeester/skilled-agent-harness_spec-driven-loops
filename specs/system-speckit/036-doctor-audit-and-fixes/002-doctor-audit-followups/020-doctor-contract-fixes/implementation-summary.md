---
title: "Implementation Summary"
description: "/doctor:speckit now reports a fresh index as OK with its phrase-quality counts shown as advisories, its status list matches its presentation, and /doctor:mcp refuses an unknown flag with its own error."
trigger_phrases:
  - "doctor contract fixes summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-doctor-audit-followups/020-doctor-contract-fixes"
    last_updated_at: "2026-10-04T18:30:00Z"
    last_updated_by: "doctor-contract-fixes"
    recent_action: "Applied both doctor contract fixes with contract tests and scenarios"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml"
      - ".skilled/commands/doctor/assets/doctor-mcp-presentation.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-contract-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 020-doctor-contract-fixes |
| **Completed** | 2026-10-04 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A healthy trigger index can now report OK, and an unknown `/doctor:mcp` flag no longer falls through the contract.

### Phase 20: doctor-contract-fixes

- **Phrase quality is an advisory.** The low-quality phrase counts move out of the staleness signals into a `quality_advisories` block, shown on an `Advisories:` line. They never change the status or the recommendation. The old reason, that the phrases never rank, is replaced: the lookup does score them, so a corpus fix waits for a measured lookup problem.
- **Status rules are explicit.** MISSING, STALE, ATTENTION and OK each have a rule, and `DEGRADED`, which the presentation cannot render, is gone.
- **Unknown mcp flags.** A flag neither sub-action accepts gets `STATUS=FAIL ERROR="unknown_flag"` with the valid flag named, and a flag owned by the other sub-action keeps the cross-sub-action error.
- **Scenarios.** DOC-349 expects OK with advisories, DOC-350 checks the advisories add no severity, and the new DOC-380 tests the unknown-flag error.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `doctor-speckit-retrieval.yaml`, `doctor-speckit-presentation.txt` | Modified | Advisories and status rules |
| `mcp.md`, `doctor-mcp-presentation.txt` | Modified | The unknown-flag error |
| `doctor-speckit-contract.test.cjs`, `doctor-mcp-contract.test.cjs` | Created | Contract tests |
| `scripts/tests/README.md` | Modified | List the suites |
| DOC-349, DOC-350, system-spec-kit doctor README | Modified | Match the new rules |
| DOC-380, mcp-code-mode root playbook and doctor README | Created/Modified | The unknown-flag scenario |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The changes follow the phase 019 research. Each contract test was run against copies of the pre-fix contracts and against the new ones before the suite joined `run-all.sh`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| No share threshold for phrase quality | The research found no retrieval-precision evidence to set one, so any constant would be arbitrary |
| Keep a separate cross-sub-action error | A flag the other sub-action owns deserves a hint pointing there, which an unknown flag cannot have |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| New contract tests | 5 of 5 pass; against the old contracts 4 fail and the cross-sub-action guard passes |
| `run-all.sh` | 7 suites passed, 0 failed, 224 node tests |
| Playbooks | system-spec-kit PASS (88 scenarios, 0 violations); mcp-code-mode DOC-380 `validateScenario` returns `[]` |
| Hermes prompt copies | PASS, 37 prompts in sync |
| Voice scans | DOC-380 and DOC-349 at 100, DOC-350 at 98, no hard blockers |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The scenarios are written, not run.** Phase 022 points them at the test environments, where they can be run.
<!-- /ANCHOR:limitations -->

---
