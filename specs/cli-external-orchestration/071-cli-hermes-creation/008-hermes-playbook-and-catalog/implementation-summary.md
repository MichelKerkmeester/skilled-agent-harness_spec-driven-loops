---
title: "Implementation Summary"
description: "A 36-scenario cli-hermes playbook executed twice (first pass 17 of 19 with two failures that became runtime fixes, second pass 22 of 22), 14 hermetic stress cells, and a fail-closed feature catalog with symbol-level anchors."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/071-cli-hermes-creation/008-hermes-playbook-and-catalog"
    last_updated_at: "2026-09-14T23:20:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Second pass 22 of 22; catalog validated"
    next_safe_action: "None; phase closed"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-hermes/manual-testing-playbook/manual-testing-playbook.md"
      - ".opencode/skills/cli-external-orchestration/cli-hermes/feature-catalog/feature-catalog.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-071-008-hermes-playbook-and-catalog"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The old read-only toolset failure is intermittent (zero bytes or a fragment), so the empty-stdout gate checks content, not length"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-hermes-playbook-and-catalog |
| **Completed** | 2026-09-14 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every Hermes claim in the packet is now a scenario someone can run, and running them found the two things the earlier phases had wrong.

### Phase 8: playbook and catalog

You get a 36-scenario playbook in the Pi package shape: 22 Hermes-specific scenarios across ten categories (invocation, permission modes, agent routing, prompt templates, integration patterns, session continuity, cost and background, git preflight advisory, goal hook, skills and plugins) and the 14 shared stress cells. The first pass ran 19 scenarios and failed two: a template dispatch returned no output because the read-only toolset had no file tools, and the git advisory never reached a session. Both became fixes in phases 003 and 006, together with four boundaries (a `-s` versus `--ignore-rules` conflict, a useless `hermes status` probe, exit 0 without a response, and a goal-less session prompt). The second pass re-ran every live scenario on the corrected contract, added three, and passed 22 of 22. A feature catalog inventories the shipped surface in five capability groups with symbol-level source and test anchors, and the hub catalog now counts seven packets.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `cli-hermes/manual-testing-playbook/manual-testing-playbook.md` | Rewritten (v1.1.0.0) | root, census, preconditions, evidence contract |
| `cli-hermes/manual-testing-playbook/<10 categories>/*.md` | Created (22) | live scenarios `HERMES-001` to `HERMES-022` |
| `cli-hermes/manual-testing-playbook/stress/*.md` | Created (14) | hermetic cells `cli-hermes-EC-001` to `EC-014` |
| `cli-hermes/benchmark/reports/2026-09-14-phase-008-{first,second}-pass/` | Created | recorded runs; the first marked superseded |
| `cli-hermes/feature-catalog/**` | Created (12) | root plus 11 leaves |
| `cli-external-orchestration/feature-catalog/**` | Modified | seven packets |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two lanes authored the packages from the skills' templates; the playbook lane executed every live scenario with a 300-second alarm, writing outcomes into the run folder. Findings went back to the runtime and plugin, and the lane was resumed with the corrected contract to re-execute rather than carry results forward.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Re-execute every live scenario after the contract change | A recorded result must match the command it documents; the toolset correction changed nearly every command line |
| Keep the first pass, marked superseded | Its two failures are the evidence for the phase 003 and 006 fixes |
| Content gate, not length gate, for the empty-response check | The old failure returned zero bytes once and a fragment another time |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Operator contract validator | `PASS package=cli-external-orchestration/cli-hermes tier=FAIL_CLOSED scenarios=36 categories=11 violations=0 warnings=1` (census warning: hand-typed and derived agree) |
| Stress bijection validator | `PASS ... cells: 112 ... missing tests: 0, missing playbooks: 0` |
| Second pass | 22 PASS, 0 FAIL, 0 SKIP |
| `validate_catalog_package.py --strict` | cli-hermes `PASS: 0 violations`; hub `0 fail, 9 warn` (pre-existing) |
| `validate_document.py` on the playbook root and the catalog files | `Total issues: 0` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Read-only enforcement needs the plugin.** The read-only scenario passes because `repo-guards` is enabled on this machine; without it a `file,todo` leaf can write.
2. **The hub catalog carries nine pre-existing parity warnings** on the compiled-routing leaf, unrelated to this packet.
<!-- /ANCHOR:limitations -->

---
