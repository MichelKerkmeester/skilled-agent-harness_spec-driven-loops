---
title: "Implementation Summary: Advisor source-provenance guard"
description: "Advisor edge propagation now stamps server-derived source_kind and protects manual provenance from automated overwrites."
trigger_phrases:
  - "implementation"
  - "summary"
  - "template"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph/002-advisor-provenance-guard"
    last_updated_at: "2026-06-10T23:03:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed advisor provenance guard implementation"
    next_safe_action: "Re-run guard tests before edge apply changes"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/apply-graph-metadata-patch.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/index.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/types.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/propagate-enhances.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/cross-skill-edges.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-advisor-provenance-guard"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Automated propagation derives automated provenance; trusted-maintainer helper writes derive trusted provenance."
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
| **Spec Folder** | 002-advisor-provenance-guard |
| **Completed** | 2026-06-10 |
| **Level** | 1 |
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

The advisor's automated edge propagation now records where an edge write came from and refuses to replace manually maintained provenance. Automated `skill_graph_propagate_enhances` writes stamp `source_kind: "automated"`; trusted-maintainer server writes can intentionally update protected fields and stamp `source_kind: "trusted"`.

### Source Provenance Guard

The guarded apply path derives provenance from server-side write intent, not from candidate payload fields. Existing manual or trusted edges are treated as protected during automated propagation, while legacy edges without `source_kind` remain valid and idempotent.

### Files Changed

<!-- Include for Level 1-2. Omit for Level 3/3+ where the narrative carries. -->

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/apply-graph-metadata-patch.ts` | Modified | Derives `source_kind`, blocks automated manual overwrites, and supports trusted-maintainer updates |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/index.ts` | Modified | Passes write intent into the guarded apply helper and treats protected existing edges as skipped |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/types.ts` | Modified | Adds edge source and write-intent types |
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/propagate-enhances.ts` | Modified | Forces propagation writes to automated server intent |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/cross-skill-edges.vitest.ts` | Modified | Adds guard coverage for provenance derivation, manual protection, trusted update, and legacy tolerance |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

The change shipped as a local TypeScript-only guard in the advisor MCP server. Verification covered typecheck, build, targeted guard/cross-skill/skill-graph Vitest suites, full-suite observation, alignment drift, and comment hygiene.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Keep MCP propagation writes automated | Client payloads should not be able to self-declare manual or trusted provenance. |
| Use `trusted` as the durable edge `source_kind` for trusted-maintainer writes | It keeps JSON provenance compact while the server API still uses the clearer `trusted-maintainer` write intent. |
| Treat legacy edges without `source_kind` as existing edges | Existing graph metadata remains readable and idempotent without requiring a migration. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck` | PASS |
| `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run build` | PASS |
| Targeted Vitest: cross-skill and skill-graph files | PASS: 8 files, 30 passed, 1 skipped |
| Full advisor Vitest suite | Out-of-scope failures: `tests/hooks/settings-driven-invocation-parity.vitest.ts` missing `SETTINGS.hooks`; full parallel run also surfaced `tests/handlers/advisor-validate.vitest.ts`, which passes in isolation. Full run count: 2 failed, 68 passed, 1 skipped; 434 passed, 36 failed, 5 skipped |
| `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-skill-advisor` | PASS: 269 files, 0 findings |
| Comment hygiene on modified TypeScript files | PASS after rerunning the Python checker with `python3` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **Out-of-scope full-suite failures remain.** `tests/hooks/settings-driven-invocation-parity.vitest.ts` still fails because the local `.claude/settings.local.json` does not expose the expected hooks block. The full parallel run also surfaced `tests/handlers/advisor-validate.vitest.ts`, but that file passes in isolation. This phase did not touch hooks settings or advisor validation telemetry.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
