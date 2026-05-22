---
title: "Implementation Summary: 118/005 — YAML Workflow Update"
description: "Placeholder for post-implementation summary. Filled when phase 005 ships the 10 call-site rewrites across 4 deep-* workflow YAMLs."
trigger_phrases:
  - "118 yaml implementation summary"
  - "deep-loop yaml rewrite summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/005-yaml-workflow-update"
    last_updated_at: "2026-05-22T19:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded placeholder doc."
    next_safe_action: "Fill sections post-implementation."
    blockers:
      - "Cannot populate Verification / NFR / Deviations sections until implementation completes."
    completion_pct: 5
    key_files:
      - "implementation-summary.md"
      - "checklist.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:1180055180055180055180055180055180055180055180055180055180050000"
      session_id: "118-005-summary-scaffold"
      parent_session_id: null
---

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Summary: 118/005 — YAML Workflow Update

> **Placeholder.** Populate when phase 005 lands. The Files Changed table, Test Coverage Summary, NFR Verification, and Deviations sections must reflect actual diff stats and smoke-run evidence — not scaffold guesses.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/005-yaml-workflow-update` |
| **Completed** | TBD |
| **Level** | 2 |
| **Actual Effort** | TBD (estimated: ~1.5-2 hours) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

> TBD. Summary will read: "Rewrote ten `mcp_tool:` call sites across four `spec_kit_deep-{review,research}_{auto,confirm}.yaml` workflow files to bash invocations of the deep-loop-runtime `.cjs` script shims authored in phase 003. Every input binding, output capture, JSONL append, and skip/guard clause preserved byte-for-byte. Workflow runner now resolves graph-convergence and graph-upsert via direct script dispatch instead of the removed MCP tool surface."

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Modify | Convergence + upsert call sites rewritten to bash shim |
| `.opencode/commands/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Modify | Convergence + upsert call sites rewritten to bash shim |
| `.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Modify | Convergence + upsert call sites rewritten to bash shim |
| `.opencode/commands/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Modify | Convergence + upsert call sites rewritten to bash shim |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

> TBD. Expected delivery flow when phase 005 lands:
>
> 1. **Setup (~20m)** — Confirm phases 003 + 004 marked Complete in their `implementation-summary.md`; re-run `grep -n` against the 4 YAMLs to refresh line numbers; smoke-test that `node .opencode/skills/deep-loop-runtime/scripts/convergence.cjs --spec-folder <sandbox> --loop-type review --session-id smoke-test` emits valid JSON.
> 2. **Implementation (~45-60m)** — File-by-file rewrite of 10 call sites. For each call site: locate the `mcp_tool:` block, replace with a single-line `bash:` invocation that quotes all placeholder substitutions, preserve every adjacent block (`outputs:`, `append_jsonl:` / `append_to_jsonl:`, `skip_conditions:`, `if_graph_events_present:` / `if_graph_events_missing:`, `note:`), and run `python3 -c "import yaml; yaml.safe_load(open(...))"` per file before moving to the next. Files rewritten in order: `deep-review_auto.yaml` → `deep-review_confirm.yaml` → `deep-research_auto.yaml` → `deep-research_confirm.yaml`.
> 3. **Verification (~30m)** — Run `grep -c "mcp__mk_spec_memory__deep_loop_graph\|deep_loop_graph_"` across all 4 files; expect 0 per file. Run `yaml.safe_load` parse on all 4 files. Smoke-run one `/spec_kit:deep-review` iteration against a sandbox spec folder to exercise both `step_graph_convergence` and `step_graph_upsert`; capture relevant JSONL events. Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ... --strict`. Tick every checklist item with paste-in evidence.
> 4. **Closeout** — Update this section with actual diffs, grep outputs, parse exit codes, smoke-run JSONL snippet, and the implementation commit SHA.

### Delivery Tools

| Tool | Purpose |
|------|---------|
| `grep -n` | Locate all `mcp_tool: mcp__mk_spec_memory__deep_loop_graph_*` call sites per file |
| `Edit` tool | Surgical per-call-site rewrite (preferred over file rewrite to minimize diff scope) |
| `python3 -c "import yaml; yaml.safe_load(...)"` | Per-file parse smoke test |
| `node .../convergence.cjs` / `.../upsert.cjs` | Sandbox smoke-test of the script shims before YAML edits |
| `/spec_kit:deep-review` | End-to-end one-iteration smoke run against a sandbox spec |
| `validate.sh --strict` | Final spec-folder doc compliance check |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Invoke scripts via `node .../convergence.cjs` rather than `./convergence.cjs` shebang | Matches the example block in the dispatch prompt; avoids reliance on executable-bit semantics across runtimes |
| Pass `nodes` / `edges` arrays as inline `--nodes` / `--edges` CLI args (not files) | Matches current MCP-tool surface; revisit only if argv length limits become an issue in real workloads |
| Update `note:` field where prior text claimed "Call directly - NEVER through Code Mode" | Prior caveat applied to MCP-tool dispatch only; bash invocation does not have the same constraint |
| Preserve every adjacent block (`outputs`, `append_jsonl`, guards) byte-for-byte | Reducer / state-machine consumers downstream are unchanged; this phase is purely an interface swap |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Static (grep) | TBD | 4/4 files | `grep -c "mcp__mk_spec_memory__deep_loop_graph\|deep_loop_graph_"` returns 0 each |
| Static (YAML parse) | TBD | 4/4 files | `python3 -c "import yaml; yaml.safe_load(...)"` exits 0 |
| Smoke (deep-review iter) | TBD | 1 iteration | Sandbox spec used; graph_convergence + graph_upsert events emitted cleanly |
| Strict validate | TBD | 1 spec folder | `validate.sh ... --strict` exits 0 |

### Static Verification Numbers

| File | MCP grep count (pre) | MCP grep count (post) |
|------|---------------------|----------------------|
| `spec_kit_deep-review_auto.yaml` | 3 | TBD (target: 0) |
| `spec_kit_deep-review_confirm.yaml` | 3 | TBD (target: 0) |
| `spec_kit_deep-research_auto.yaml` | 2 | TBD (target: 0) |
| `spec_kit_deep-research_confirm.yaml` | 2 | TBD (target: 0) |

### Smoke Run Evidence

```
TBD — paste relevant JSONL events from the smoke deep-review iteration here.
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-P01 | Bash shim latency < 1500ms warm | TBD | TBD |
| NFR-P02 | Cold-start latency < 3000ms | TBD | TBD |
| NFR-R01 | Non-zero exits surface back to runner | TBD | TBD |
| NFR-R02 | Malformed stdout triggers recordable error | TBD | TBD |
| NFR-M01 | Step block names unchanged | TBD | TBD (grep `step_graph_convergence\|step_graph_upsert` returns same count pre/post) |
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Inline argv length** — if a future workload pushes node/edge JSON payloads above the macOS ~256 KB argv limit, phase 003 will need to add a `--nodes-file` / `--edges-file` path-based fallback. Not addressed in 005.
2. **Latency sensitivity** — bash invocation adds Node startup cost vs in-process MCP handler. Acceptable for current deep-loop cadence (seconds-per-iteration scale).
3. **`note:` prose updates** — minor cosmetic rewrites only where literal "Call directly - NEVER through Code Mode" appeared; other prose preserved.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| TBD | TBD | TBD |
<!-- /ANCHOR:deviations -->
