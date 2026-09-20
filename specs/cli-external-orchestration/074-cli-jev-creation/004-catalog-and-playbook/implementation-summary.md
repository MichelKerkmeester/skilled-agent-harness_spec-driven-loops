---
title: "Implementation Summary"
description: "The transport has a feature catalog and a 22-scenario manual testing playbook: every scenario written around an observable a shell produces, 20 executed as part of this work and 2 recorded as skips at close, later closed by the authenticated verification."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/074-cli-jev-creation/004-catalog-and-playbook"
    last_updated_at: "2026-09-20T10:30:00Z"
    updated_by: "claude-fable-5-1"
    recent_action: "Feature catalog and the 22-scenario playbook authored; run report recorded"
    last_updated_by: "claude-fable-5-1"
    next_safe_action: "Run the two authenticated scenarios once a provider key exists"
    blockers: []
    key_files:
      - ".skilled/skills/cli-external-orchestration/cli-jev/feature-catalog/feature-catalog.md"
      - ".skilled/skills/cli-external-orchestration/cli-jev/manual-testing-playbook/manual-testing-playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-074-004-catalog-and-playbook"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "The two authenticated scenarios (the live judgment per type and the authenticated half of the auth pair) - blocked on a provider credential"
    answered_questions:
      - "How many scenarios can be proven without a credential? Twenty of twenty-two; the other two need one live call each"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-catalog-and-playbook |
| **Completed** | 2026-09-20 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An inventory and a test plan for a mode whose interesting surface is mostly invisible: the judgment that comes back, the exit code that means "not billed", the guard that refuses a command the CLI would happily send. The catalog names what exists; the playbook says how to prove it still works after an upgrade.

### Phase 4: catalog and playbook

The catalog is a root index plus four category files — transport classification, judgment primitives, dispatch guards and surfaces — each carrying implementation anchors so a claim is checkable at the file it names. The playbook is a root plus twenty-two scenario files, one per scenario, grouped in five category directories (invocation, exit codes, dispatch guards, providers, MCP), and the cross-surface cardinality asymmetry is carried by the per-surface rows. Each scenario has a command and an expected observable, and the run report records which were executed and which were skipped.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `cli-jev/feature-catalog/feature-catalog.md` | Create | Root index with the category table and the not-here list |
| `cli-jev/feature-catalog/transport-classification/transport-classification.md` | Create | Why transport, what the registration declares, the pairing rule, alias hygiene |
| `cli-jev/feature-catalog/judgment-primitives/judgment-primitives.md` | Create | The four primitives, with the traps and the per-surface cardinality table |
| `cli-jev/feature-catalog/dispatch-guards/dispatch-guards.md` | Create | The eight rules, the audit shape and the three enforcement gates |
| `cli-jev/feature-catalog/surfaces/surfaces.md` | Create | CLI, MCP and provider surfaces |
| `cli-jev/manual-testing-playbook/manual-testing-playbook.md` | Create | Playbook root, execution policy, the 22-entry index and failure triage |
| `cli-jev/manual-testing-playbook/cli-invocation/` | Create | Four scenario files: binary discovery, root help, the hidden endpoint flag, one judgment per type |
| `cli-jev/manual-testing-playbook/exit-codes/` | Create | Eleven scenario files: the taxonomy, the credential check, the two controls and the cardinality pair |
| `cli-jev/manual-testing-playbook/dispatch-guards/` | Create | Three scenario files: audit resolution, the prose false-positive check, the rule bijection |
| `cli-jev/manual-testing-playbook/providers/` | Create | Three scenario files: the endpoint rule, the invalid environment value, the auth surface |
| `cli-jev/manual-testing-playbook/mcp-server/` | Create | The handshake scenario |
| `cli-jev/benchmark/reports/2026-09-20-phase-004-unauthenticated-pass/skill-benchmark-report.md` | Create | The run record: verdicts, raw evidence paths, delta statement |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Delivered

Every scenario was written around something a shell can observe: an exit status, a stdout string, a JSON field, or a test-suite verdict. That constraint is what makes the playbook usable without a provider key, and it is also what forced the run report to be honest — two scenarios have no observable that can be produced without one, so they are recorded as skips with their blocker rather than reformulated into something that would pass.

The catalog's anchors were written last, after the registration landed, so each one points at a file that exists. The alternative — writing the catalog first and pointing at the intended paths — would have produced a document that looks verified and is not.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Twenty executed, two skipped, none reformulated.** A scenario that cannot be run is evidence of coverage limits, and turning it into a weaker check would have hidden that.
- **The playbook's scenarios reference captured transcripts where one exists.** The exit-code scenarios cite the matrix that already exists rather than re-running it, so the playbook and the pin share one artifact.
- **The catalog separates what is here from what is not.** No executor kind, no MCP registration, no write capability and no repo-owned model roster are listed as deliberate absences, because each is something a reader would otherwise assume.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Scenario count | 22 scenarios, one file per scenario, across five category directories |
| Playbook package validator | `validate-playbook-package.cjs --package cli-external-orchestration/cli-jev` printed `PASS ... scenarios=22 categories=5 operator=22 violations=0` (one advisory hand-typed-census warning, matching the derived count) |
| Catalog package validator | `validate_catalog_package.py` printed `PASS` for `cli-external-orchestration/cli-jev` with 0 violations |
| Executed without a credential | 20 pass, 0 fail |
| Skipped scenarios | 2, each naming the missing credential as the blocker |
| Guard scenarios | Backed by the two dispatch suites, which pass |
| Run report | Written with verdicts, evidence paths and a delta statement |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Two scenarios were unexecuted when this phase closed.** They need one live judgment call each, which needs a provider credential this workspace did not have; they were recorded as skips, not as passes, and the authenticated verification later closed both with an operator-stored `official` key (report under `cli-jev/benchmark/reports/2026-09-20-authenticated-verification/`).
- **No latency or throughput numbers.** Any such figure would require a live call, and none was made; the baseline report says so rather than quoting the vendor's README.
- **The playbook tested the unauthenticated surface thoroughly and the authenticated surface not at all.** The first is where a dispatcher's mistakes live; the second is where an upgrade would change the answer values. The authenticated gap closed with the verification run that followed this phase.
<!-- /ANCHOR:limitations -->
