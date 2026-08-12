---
title: "Feature Specification: sk-create-diagram manual playbook execution"
description: "Run all 9 manual-testing-playbook scenarios for real against the shipped packet, using Deepseek v4 Flash via the direct DeepSeek API, and gather results through the canonical benchmark wrapper."
trigger_phrases:
  - "sk-create-diagram manual playbook execution"
  - "diagram playbook results gathered"
  - "deepseek direct api playbook run"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/009-manual-playbook-execution"
    last_updated_at: "2026-08-12T13:21:22.000Z"
    last_updated_by: "claude"
    recent_action: "Ran all 9 scenarios, verified, recorded results"
    next_safe_action: "Hand back to the user for a commit decision"
    blockers: []
    key_files:
      - "spec.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "'Manual testing playbooks' means the one playbook this packet ships (9 scenarios, 3 categories) — no other packet in the repo was in scope given the conversation's continuity."
      - "'Through the deepseek api' means the direct deepseek/deepseek-v4-flash provider via cli-opencode, not the opencode-go/deepseek-v4-flash proxy used in phases 002-004/007."
      - "IMP-001/IMP-002 needed fixture inputs the playbook assumed but never shipped (docs/system.drawio, docs/onboarding.md) — provisioned and smoke-tested against the real extraction scripts before dispatch."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: sk-create-diagram manual playbook execution

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-12 |
| **Branch** | `sk-doc/0145-sk-create-diagram` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 9 of 9 |
| **Predecessor** | `../008-resource-reorganization-and-code-alignment/spec.md` |
| **Successor** | None — extends the packet post-merge |
| **Handoff Criteria** | All 9 scenarios executed for real, every dispatched claim independently verified, results persisted through the canonical wrapper into `benchmark/reports/`, release-readiness rule evaluated |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## PHASE CONTEXT

**Scope Boundary**: Execute and gather results only. No packet content changes beyond what the scenarios themselves produce (new files under `docs/`, new `benchmark/reports/` folders). Findings surfaced during execution are documented, not silently fixed.

**Dependencies**: Phase 008 closed the packet with a clean reorganized structure; this phase exercises that shipped structure end-to-end.

**Deliverables**: 9 real scenario executions, 9 `benchmark/reports/<date>--manual-testing-playbook--<variant>/` folders (harness-generated, never hand-authored), a release-readiness verdict.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The manual-testing-playbook shipped in phase 007 had never actually been run — its 9 scenarios existed as documented contracts with no execution evidence, and its own coverage note claimed every scenario was "runnable today" without that claim ever being tested.

### Purpose

Execute all 9 scenarios for real using Deepseek v4 Flash via the direct DeepSeek API (`deepseek/deepseek-v4-flash`, not the `opencode-go` proxy used in earlier phases), independently verify every claimed result against the actual files/checksums/registry content produced, and persist PASS/FAIL/SKIP outcomes through the canonical `run-manual-playbook-scenario.cjs` wrapper so results are genuinely gathered, not just reported in a chat transcript.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Provision the 2 fixture inputs (`docs/system.drawio`, `docs/onboarding.md`) the playbook's IMP-001/IMP-002 scenarios assume but never shipped; smoke-test both against the real extraction scripts before dispatch.
- Dispatch 3 batches to `deepseek/deepseek-v4-flash` via `cli-opencode` (direct DeepSeek API provider), covering all 9 scenarios (DIA-001..004, IMP-001..003, CMD-001..002), each executing the scenario's exact prompt for real (reading real references, running real scripts, writing real output files).
- Independently verify every dispatched claim: file existence, byte counts, checksums, accessible-SVG contract, registry content, XML validity — never accept a self-report at face value.
- Record every scenario's verdict through `run-manual-playbook-scenario.cjs` with real, independently-verified evidence.
- Confirm the harness-generated run index (`benchmark/reports/README.md`) reflects all 9 results.
- Evaluate the playbook's own Release Readiness Rule against the actual outcomes.

### Out of Scope

- Fixing findings surfaced during execution (the `export.md` unescaped-`&` SVG snippet, the `export diagram` alias missing from `hub-router.json`'s vocabulary class) — documented as follow-ups, not silently patched, since the user's ask was to run and gather results, not to re-open the packet's content.
- Committing the new `docs/` fixtures/outputs or the `benchmark/reports/` evidence — left for an explicit operator decision, matching this session's established push/merge discipline.
- Re-running phases 001-008's own validation gates.

### Aggregate File Scope

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `docs/system.drawio`, `docs/onboarding.md` | Create | Fixture inputs for IMP-001/IMP-002 |
| `docs/checkout-architecture.html`, `docs/support-handoff.html`, `docs/compounding-loop.html`, `docs/system-redrawn.html`, `docs/onboarding-flow.html`, `docs/order-flow.html`, `docs/checkout-architecture.svg` | Create | Real scenario output artifacts (evidence) |
| `.opencode/skills/sk-doc/sk-create-diagram/benchmark/reports/` | Create | 9 harness-generated result folders + run index |
| `009-manual-playbook-execution/` | Create | This phase's spec-folder history |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 9 scenarios executed for real (not simulated) via `deepseek/deepseek-v4-flash` direct API. | 3 dispatch logs show real file reads/writes/script runs, not descriptions of what would happen. |
| REQ-002 | Every scenario's outcome is independently verified against the real filesystem/registry state before being recorded. | For each scenario, at least one concrete check (file exists, checksum, grep, XML parse) beyond the dispatch's own claim. |
| REQ-003 | Every outcome is persisted via `run-manual-playbook-scenario.cjs`, not hand-authored. | 9 `benchmark/reports/` folders exist with harness-generated `skill-benchmark-report.md`/`.json`; run index auto-updated. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Any discrepancy between a dispatched claim and independently-verified reality is caught and corrected before recording, never silently trusted. | Documented: the `checkout-architecture.html` checksum claim mismatch (dispatch fabricated a hash; real file was untouched, confirmed via mtime/bytes/content). |
| REQ-005 | The playbook's own Release Readiness Rule is evaluated against the real outcomes. | Recorded in `implementation-summary.md`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 9/9 scenarios executed and independently verified; 0 FAIL, all 5 critical-path scenarios (DIA-001, DIA-002, IMP-001, IMP-002, CMD-001) PASS.
- **SC-002**: `benchmark/reports/README.md` (harness-generated) shows all 9 results with the correct verdicts.
- **SC-003**: Every finding surfaced during execution — real or a dispatch fabrication — is documented honestly, whether or not it was fixed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A dispatched agent's self-reported evidence (e.g. a checksum) could be fabricated rather than actually computed. | Medium (realized) | Independently recomputed every claimed checksum/count; caught 1 real discrepancy (IMP-003's claimed "before" hash for `checkout-architecture.html` did not match reality) before recording. |
| Risk | IMP-003's PNG sub-step requires Playwright, unavailable in this environment. | Low (expected) | Playbook's own coverage note already documents this as an expected `SKIP`; confirmed the blocker for real rather than assuming it. |
| Dependency | Phase 008's clean reorganized packet structure | High | Every dispatch read from the final `references/{types,primitives,...}/` and `assets/{examples,templates}/` paths. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — scope, dispatch target, and fixture provisioning are all resolved above.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Plan: `plan.md`
- Tasks: `tasks.md`
- Checklist: `checklist.md`
- Packet root: `../spec.md`
- Executed against: `.opencode/skills/sk-doc/sk-create-diagram/manual-testing-playbook/manual-testing-playbook.md`
- Results: `.opencode/skills/sk-doc/sk-create-diagram/benchmark/reports/README.md`
