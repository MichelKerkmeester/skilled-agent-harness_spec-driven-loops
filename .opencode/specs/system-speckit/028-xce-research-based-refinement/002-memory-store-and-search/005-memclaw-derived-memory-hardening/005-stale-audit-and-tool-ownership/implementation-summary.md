---
title: "Implementation Summary: stale-audit-and-tool-ownership"
description: "Completed read-only stale/status hard-exclusion audit plus derived TOOL_DEFINITIONS ownership lint. Recall behavior and stored data are unchanged."
trigger_phrases:
  - "stale exclusion audit implementation status"
  - "tool ownership lint implemented"
  - "phase 5 completed diagnostics governance"
  - "derived ownership map implementation summary"
  - "recall diagnostic planned not started"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/002-memory-store-and-search/005-memclaw-derived-memory-hardening/005-stale-audit-and-tool-ownership"
    last_updated_at: "2026-06-10T14:35:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Shipped read-only audit and ownership lint"
    next_safe_action: "Monitor health and ownership drift surfaces"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-stale-audit-and-tool-ownership"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-stale-audit-and-tool-ownership |
| **Status** | Completed |
| **Completed** | 2026-06-10 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

<!-- Voice guide:
     Open with a hook: what changed and why it matters. One paragraph, impact first.
     Then use ### subsections per feature. Each subsection: what it does + why it exists.
     Write "You can now inspect the trace" not "Trace inspection was implemented."
     NO "Files Changed" table for Level 3/3+. The narrative IS the summary.
     For Level 1-2, a Files Changed table after the narrative is fine.
     Reference: specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/implementation-summary.md -->

You can now inspect hard recall exclusions without changing recall. The implementation exposes the existing search exclusion predicates as read-only metadata, adds a health audit that classifies intended archived exclusions separately from deprecated-tier silent-risk exclusions, and adds a generated ownership map plus blocking drift gate derived from `TOOL_DEFINITIONS`.

### Stale/Status Hard-Exclusion Audit

`hybrid-search.ts` now exposes hard-exclusion predicate metadata through `getHardExclusionPredicates()`. `memory_health` reads that metadata, applies an in-memory intended-exclusion policy, returns `data.exclusionAudit`, and appends diagnostic hints for silent-risk or unclassified exclusions. `/doctor memory` now registers `hard_exclusion_risk` from that health payload.

### Derived Tool-Ownership Lint

`tool-schemas.ts` now derives a deterministic 37-tool ownership/stability map from `TOOL_DEFINITIONS`. The committed fixture under `mcp_server/tests/fixtures/tool-ownership-map.json` is generated output. The pre-commit hook runs a source-derived comparison and blocks on missing tools, extra tools, field drift, malformed map, or unreadable definitions.

### Files Changed

<!-- Include for Level 1-2. Omit for Level 3/3+ where the narrative carries. -->

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/search/hybrid-search.ts` | Modified | Exposed hard-exclusion predicate metadata without editing recall predicates |
| `mcp_server/handlers/memory-crud-health.ts` | Modified | Added observe-only audit output and health hints |
| `.opencode/commands/doctor/assets/doctor_memory.yaml` | Modified | Registered `hard_exclusion_risk` from `memory_health.data.exclusionAudit` |
| `mcp_server/tool-schemas.ts` | Modified | Added deterministic ownership-map derivation and drift comparison helpers |
| `.opencode/scripts/git-hooks/pre-commit` | Modified | Added blocking tool-ownership drift gate |
| `mcp_server/tests/stale-audit-tool-ownership.vitest.ts` | Added | Covers exclusion audit and ownership lint edge cases |
| `mcp_server/tests/tool-ownership-lint-runner.mjs` | Added | Source-derived pre-commit runner that fails closed |
| `mcp_server/tests/fixtures/tool-ownership-map.json` | Added | Committed generated ownership map fixture |
| `references/config/hook_system.md` | Modified | Documents audit and ownership-lint firing surfaces |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

Delivered as source-only diagnostics and generated governance lint. The audit runs from the health path and only reads predicate metadata plus row counts. The lint runs from pre-commit and compares the committed generated map to a fresh source derivation. Verification used in-memory SQLite and source-level tests only; no build, daemon, git command, memory indexing, or stored-data mutation was used.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Audit reports exclusion risk but does not change recall policy | We do not want to silently widen recall; flag the risk and let a separate decision change behavior |
| Derive the ownership map from `TOOL_DEFINITIONS`, treat docs as outputs | Hand-maintained docs drift; the normalized definitions are the only trustworthy source |
| Use a source parser for the pre-commit runner | The hook must work without `npm run build` or compiled `dist` files |
| Reject op-dispatch tool consolidation | Collapsing the 37-tool surface harms LLM tool discoverability, which matters more than tidiness here |
| Reject SemVer / release-please governance | This is a single-user local system, not a public-versioned package; that governance adds cost with no payoff |
| Keep runtime exclusion checks in health/`/doctor`, not pre-commit | A commit gate is not a runtime safety guarantee; pre-commit only gates ownership drift |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| `npx vitest run tests/stale-audit-tool-ownership.vitest.ts` | PASS: 1 file, 6 tests |
| `npx vitest run tests/search-archival.vitest.ts tests/handler-memory-search.vitest.ts` | PASS: 2 files, 41 tests |
| `npx vitest run tests/stale-audit-tool-ownership.vitest.ts tests/search-archival.vitest.ts tests/handler-memory-search.vitest.ts` | PASS: 3 files, 47 tests |
| `npx tsc --noEmit -p tsconfig.json` | PASS: clean |
| `node tests/tool-ownership-lint-runner.mjs` | PASS: clean 37-tool map |
| Comment hygiene | PASS with `python3 .opencode/skills/sk-code/scripts/check-comment-hygiene.sh <file>` on changed code files |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/005-memclaw-derived-memory-hardening/005-stale-audit-and-tool-ownership --strict` | PASS: 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **Recall policy is intentionally unchanged.** The audit only reports exclusion risk; widening recall to include deprecated rows requires a separate policy decision.
2. **Direct skill-budget YAML was not edited.** It was outside the allowed write list, so ownership drift is enforced by pre-commit and documented in the hook reference rather than by modifying `doctor_skill-budget.yaml`.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
