---
title: "Spec: Benchmark Harness Hardening"
description: "Phase 001 of packet 035 (implement 034 GPT-reliability fixes). Closes findings F-014, F-025 (effort S). Make the 033 behavior-benchmark trustworthy as the acceptance harness BEFORE any runtime fix is verified against it. Two instrument gaps found during 034: the runner only detects N"
trigger_phrases:
  - "035 phase 001"
  - "benchmark-harness-hardening"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/035-gpt-reliability-fixes/001-benchmark-harness-hardening"
    last_updated_at: "2026-07-03T13:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Phase scaffolded from 034 synthesis"
    next_safe_action: "Execute per dependency order; plan.md/tasks.md authored at execution"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "035-001-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Benchmark Harness Hardening

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-03 |
| **Parent Packet** | ../ (035-gpt-reliability-fixes) |
| **Parent Spec** | ../spec.md |
| **Closes findings** | F-014, F-025 |
| **Effort** | S |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Make the 033 behavior-benchmark trustworthy as the acceptance harness BEFORE any runtime fix is verified against it. Two instrument gaps found during 034: the runner only detects NEW fixture files (missing rewrites), and the vague-ask scenario prompts embed fixture paths whose tokens leak intent to the router.

Findings closed: F-014, F-025. Full mechanism + evidence in `../../034-gpt-reliability-research/research/findings-registry.md`; the ranked package in `../../034-gpt-reliability-research/research/synthesis.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:** behavior-bench-run.cjs detection logic + tests; the three vague-ask scenario contracts under the deep-loop-workflows behavior_benchmark packages.

**Out of scope:** Runtime/command changes (later phases); re-running full 033 legs (only affected cells).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: The behavior-bench-run fixtureGained detection compares before/after file CONTENT (hash or mtime), not only new-file presence, so a run that rewrites existing fixture artifacts is scored consistently (F-014).
- **REQ-002**: The vague-ask scenario prompts (ACB-003, IMB-003, RSB-004) are rewritten path-free so routing measures natural language, not leaked path tokens; provenance note added (F-025).
- **REQ-003**: Hermetic runner suite stays green; re-score any affected historical cells and note deltas.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. fixtureGained detects rewrites (unit-tested)
2. vague-ask prompts carry no fixture-path tokens
3. hermetic suite exit 0

**Acceptance harness (033 behavior-benchmark cells):** Harness-internal (enables every later phase's cell-flip verification). Re-run the affected cells (gpt-fast-med + gpt-fast-high legs) after the change; record primary/secondary cause for any multi-cause cell.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk / Dependency | Handling |
|---|---|
| Regressing the Claude-native path | Re-run the baseline leg; it must stay green after every change |
| Phase ordering | Depends on the parent dependency order; phase 002 (Gate-3) must land before P1 phases are verified |
| Design drift from the 034 designs | The 034 iter-011/012/013/014 designs are the reference; verify quoted current-text before applying |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Resolved at execution: exact file targets are named in the closed findings + 034 design iterations; plan.md/tasks.md are authored when this phase starts.
<!-- /ANCHOR:questions -->
