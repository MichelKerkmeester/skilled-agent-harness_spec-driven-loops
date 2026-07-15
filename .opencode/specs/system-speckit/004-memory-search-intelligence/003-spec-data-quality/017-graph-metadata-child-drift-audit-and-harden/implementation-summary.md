---
title: "Implementation Summary [template:level_3/implementation-summary.md]"
description: "The repo-wide audit and the permanent child-drift check shipped and are verified in the default validate.sh --strict path. The backfill is deferred because every genuine drift the audit found is owned by a concurrent session, another phase, or another project."
trigger_phrases:
  - "graph-metadata drift summary"
  - "children_ids drift check shipped"
  - "child drift audit result"
  - "drift check advisory enforce"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/003-spec-data-quality/017-graph-metadata-child-drift-audit-and-harden"
    last_updated_at: "2026-07-06T18:49:48.848Z"
    last_updated_by: "michel-kerkmeester"
    recent_action: "Shipped repo-wide audit, the drift check and its wiring; backfill deferred"
    next_safe_action: "Reconcile drifted parents once their owning sessions release them"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata-child-drift.sh"
      - ".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json"
      - ".opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/051-graph-metadata-child-drift-audit-and-harden"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 051-graph-metadata-child-drift-audit-and-harden |
| **Completed** | In Progress. Audit and drift check shipped and verified; backfill deferred |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Repo-wide children_ids drift audit

A standalone audit compared every phase parent's `graph-metadata.json` `children_ids` against its on-disk numbered children and found 21 drifted parents. The audit split into two classes. Genuine drift, where a real child is absent from `children_ids`: `sk-design` (missing `009-sk-design-claude-parity`), `system-deep-loop` (missing the renamed `036`/`037`), `barter` (3 children), and `skilled-agent-orchestration` (missing `124`/`125`). False positives, where a numbered folder exists but lacks `spec.md`/`description.json`: these are not drift, because the graph-metadata writer keeps them and its merge never prunes.

### A permanent child-drift check, wired into the default validate path

`is-phase-parent.ts` now exports `listDerivedChildNames()`, which mirrors the graph-metadata writer's own child enumeration (`SPEC_LEAF_SEGMENT_PATTERN`, name-only, no metadata requirement), proven byte-identical to the real writer. A dedicated rule `GRAPH_METADATA_CHILD_DRIFT` (`check-graph-metadata-child-drift.sh`, registered in `validator-registry.json`) compares `children_ids` against that set and reports the missing children. It is flag-only and never edits a file.

### Severity and definition, corrected against reality

Two of the phase's own assumptions changed once the code met the repo:
- The check reuses the writer's child definition, not `countPhaseChildren`. The two diverge on underscore, bare-`NNN`, and metadata-less folders, and only the writer's set matches what actually gets written to `children_ids`, so any other definition false-positives.
- The check ships advisory by default and blocks only under `SPECKIT_CHILD_DRIFT_ENFORCE=true`. The ADR assumed the repo could reconcile to zero drift before the check goes live, but 21 parents cannot reconcile now (each is owned by concurrent, cross-phase, or cross-project work). Advisory default lets the check ship without failing every drifted packet at once; the enforce flag promotes it once reconciliation catches up.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The check surfaces in a plain `validate.sh --strict` run through a distinct registry rule that the compiled orchestrator's `runRegistryShellRules` picks up (a non-native rule id, so it is not deduped like the built-in `GRAPH_METADATA_PRESENT`). This needed no change to `orchestrator.ts` or `validate.sh` and no `mcp_server` rebuild, because the registry is read at runtime.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Advisory by default, enforce behind a flag | 21 parents are drifted and cannot reconcile now; a hard failure would break every drifted packet's `--strict` on day one for a defect the check just surfaced. |
| Reuse the writer's child enumeration, not `countPhaseChildren` | `children_ids` is written by the graph-metadata writer, so the only truthful drift signal is what the writer would produce. Any other definition false-positives (confirmed: `026/007`'s metadata-less `031` folder is legitimate, not drift). |
| A distinct registry rule, not an edit to the compiled orchestrator | Firing in the default path this way avoids touching the daemon-loaded `mcp_server` dist and stays reversible by removing one registry entry. |
| Defer the backfill | Every genuine drift is owned by another session, phase, or project; reconciling them now would collide with live work. The check surfaces each for reconciliation when its owner releases it. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Repo-wide audit | Ran. 21 drifted parents found and classified. |
| Writer byte-parity | Passed on 4 real folders (derived set identical to the real writer). |
| RED/GREEN test | 8/8 pass (advisory, enforce, clean, underscore-writer-pattern, extra-not-drift, leaf, and two default-path integration cases). |
| Default-path firing | Confirmed. Plain `validate.sh 005 --strict` prints the advisory (adds 0 warnings); with the enforce flag it becomes a warning (exit 2). |
| No false positive | `026/007-mcp-daemon-reliability` and a reconciled clean parent both pass under enforce. |
| Regression baseline | Full suites unchanged from baseline; the always-on advisory adds zero failures. `orchestrator.ts`/`validate.sh` untouched. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The backfill did not run.** Every genuine drift is owned by concurrent, cross-phase, or cross-project work (`sk-design/009`, `system-deep-loop/036,037`, `barter`, `skilled-agent-orchestration/124,125`), so no parent was safe to reconcile in this phase. The check exists precisely to surface them for reconciliation when each owner releases it.
2. **The check is missing-only.** It flags children absent from `children_ids`, not stale extras, because the writer's merge is add-only and never prunes. Pruning stale references (for example `skilled-agent-orchestration` listing folders since moved to `z_archive`) is a separate concern that a pruning-capable writer would own.
3. **The enforce flag stays off until the repo reconciles.** A parent that drifts again before the flag is promoted produces an advisory line, not a failure.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
