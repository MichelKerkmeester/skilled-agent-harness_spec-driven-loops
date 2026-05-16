---
title: "Implementation Summary: Real-World Usefulness Test Execution"
description: "Summary of the sandboxable usefulness test execution, trial counts, verdicts, and gaps."
trigger_phrases:
  - "real-world usefulness execution"
  - "026/007/012/001"
  - "usefulness synthesis"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/011-real-world-usefulness-test/001-execution"
    last_updated_at: "2026-05-06T04:35:32.335Z"
    last_updated_by: "cli-codex-gpt-5.5"
    recent_action: "Completed local trial execution and synthesis"
    next_safe_action: "Review synthesis gaps or rerun deferred live runtime cells"
    blockers:
      - "Authenticated/networked external CLI runtimes unavailable in sandbox"
      - "Claude Code and OpenCode native live sessions unavailable from sandbox"
    key_files:
      - "implementation-summary.md"
      - "trials/trial-log.jsonl"
      - "analysis/aggregated-metrics.md"
      - "synthesis-report.md"
    session_dedup:
      fingerprint: "sha256:0260070120010260070120010260070120010260070120010260070120010260"
      session_id: "026-007-012-001-execution"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3 pre-approved for this execution packet."
---
# Implementation Summary: Real-World Usefulness Test Execution

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | system-spec-kit/026-graph-and-context-optimization/007-code-graph/011-real-world-usefulness-test/001-execution |
| **Completed** | 2026-05-06 |
| **Level** | 2 |
| **Parent Packet** | system-spec-kit/026-graph-and-context-optimization/007-code-graph/011-real-world-usefulness-test |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This execution packet turns the parent campaign from a plan into partial empirical evidence. It ran the sandboxable code graph and hook checks, preserved raw outputs, aggregated metrics, and named the runtime cells that need a live authenticated follow-up.

### Trial Corpus

The packet now has 74 trial-log rows: 36 completed assisted rows, 3 blocked assisted rows, and 35 control rows. Raw outputs live under `trials/raw/`; controls live under `trials/control/`.

### Analysis and Synthesis

The aggregation reports summarize mean time, estimated tokens, hit rate, relevance, and usefulness by scenario and CLI. The synthesis classifies code graph as useful, hooks as mixed, and plugin/runtime integration as overhead under sandbox constraints.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md` | Update | Declared execution scope, requirements, and sandbox limits. |
| `plan.md` | Update | Listed completed sandbox-direct cells and deferred live/runtime cells. |
| `tasks.md` | Update | Tracked one task per planned matrix cell plus analysis and synthesis. |
| `checklist.md` | Update | Recorded P0/P1/P2 evidence for completed and deferred work. |
| `decision-record.md` | Create | Captured execution ADRs for deferrals and scoring mechanics. |
| `implementation-summary.md` | Update | Summarized trials, verdicts, and validation status. |
| `trials/trial-log.jsonl` | Create | Append-only structured trial log. |
| `trials/raw/` | Create | Raw assisted output and blocked external smoke outputs. |
| `trials/control/` | Create | Manual/control workflow records. |
| `analysis/aggregated-metrics.md` | Create | Scenario and CLI metrics aggregation. |
| `analysis/per-scenario-deltas.md` | Create | Assisted-vs-control deltas. |
| `synthesis-report.md` | Create | Verdict, wins, overheads, deferrals, and backlog. |
| `description.json` | Create | Discovery metadata for the execution packet. |
| `graph-metadata.json` | Update | Packet graph metadata. |
| `../graph-metadata.json` | Update | Parent children_ids includes 001-execution. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The execution used read-only local systems: SQLite for the code graph, `rg` for controls, the Python skill advisor, the compiled Gate 3 classifier, and the startup brief builder. External CLI smoke checks were attempted separately and recorded as blocked rather than expanded into fake model trials.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Defer live native/runtime cells | The sandbox cannot observe interactive Claude Code/OpenCode state or authenticated external model calls. |
| Use local lower-bound controls | They are reproducible and keep paired control evidence attached to every local scenario. |
| Estimate tokens from text length | Local tools do not expose model token accounting, so exact token claims would be false. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Parent docs read | PASS: `../spec.md`, `../plan.md`, `../tasks.md`, and `../decision-record.md` read before execution. |
| Trial log entries | PASS: 74 rows written to `trials/trial-log.jsonl`. |
| Analysis docs | PASS: `analysis/aggregated-metrics.md` and `analysis/per-scenario-deltas.md` written. |
| Synthesis report | PASS: `synthesis-report.md` written with required sections. |
| Strict validation | PASS: `validate.sh --strict` exited 0 after final docs update. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Runtime integration is sandbox-limited.** External CLI cells did not complete model calls because of DNS/auth/browser-login blockers.
2. **Compaction recovery is unmeasured.** S-HK-04 needs a real long-running session and compaction event.
3. **Controls are lower bounds.** `rg` command timings are faster than a real human orientation workflow.
4. **Token counts are estimates.** Local tools did not expose model-token metrics.
<!-- /ANCHOR:limitations -->
