---
title: "Implementation Summary: Full spec-kit advisor import decoupling [template:level_3/implementation-summary.md]"
description: "Import isolation is implemented: spec-kit no longer imports advisor source from its MCP server tree, advisor tests pass, and memory regressions are classified as baseline-red."
trigger_phrases:
  - "019 implementation summary"
  - "advisor decoupling complete"
  - "zero advisor imports"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-extraction/019-spec-kit-advisor-decoupling"
    last_updated_at: "2026-05-15T09:20:00Z"
    last_updated_by: "codex"
    recent_action: "Completed regression classification, advisor fixture fix, and 019 validation repair."
    next_safe_action: "Stage only scoped decoupling files, commit, and push to origin/main."
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks/"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/"
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/"
      - ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Advisor post-fix suite passes: 52 files, 338 passed, 4 skipped."
      - "Memory post-change failed test count equals baseline: 114."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | `019-spec-kit-advisor-decoupling` |
| **Completed** | 2026-05-15 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## WHAT WAS BUILT

The import-isolation slice is implemented. `system-spec-kit/mcp_server` now has zero direct `from.*system-skill-advisor` imports, advisor-owned hooks/tests/stress coverage live under `system-skill-advisor`, and spec-kit keeps only local helpers or process-boundary stubs.

### Advisor Ownership Move

Moved Claude, Codex, and Gemini advisor prompt hook implementations to `system-skill-advisor/hooks/{claude,codex,gemini}`. Spec-kit keeps executable compatibility stubs at the old hook paths so existing runtime configs continue to work while avoiding in-process imports.

### Test And Stress Ownership

Moved advisor-owned unit tests, hook tests, rebuild tests, and stress tests into `system-skill-advisor/mcp_server`. Added advisor stress config coverage and fixed the moved lane-weight sweep fixture paths to the current `006-corpus-seeded-sweep` and `007-harder-intent-corpus-resweep` packets.

### Spec-Kit Boundary Cleanup

Dropped advisor schema imports from spec-kit tool schemas, removed the SQLite neutral re-export, localized the skill-label sanitizer, and replaced residual type-only imports with local structural types.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED

Delivery was gated by stash-based baseline comparison. The memory suite was run before and after restoring decoupling changes; both runs reported 114 failed tests, so this packet introduced no memory test regressions. Advisor baseline was red before decoupling restore, then post-change advisor failed only on a dissolved packet path; updating that fixture path made the full advisor suite pass.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Why |
|----------|-----|
| Move advisor hook logic into advisor | The hook logic renders advisor recommendations and belongs with advisor-owned code |
| Keep spec-kit hook paths as process stubs | Existing runtime paths keep working without source coupling |
| Keep plugin bridge as a gateway | It communicates over MCP/process boundaries and does not import advisor source |
| Document memory failures as baseline-red | The post-change failed test count did not increase from baseline |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## VERIFICATION

| Check | Result |
|-------|--------|
| Exact import audit | PASS, zero `from.*system-skill-advisor` lines in `system-spec-kit/mcp_server` |
| Advisor vitest baseline | FAIL baseline, 6 failed files, 302 passed, 7 skipped |
| Advisor vitest after fixes | PASS, 52 files passed, 338 passed, 4 skipped |
| Memory vitest baseline | FAIL baseline, 114 failed tests, 11,345 passed, 86 skipped |
| Memory vitest post-change | FAIL baseline-red unchanged, 114 failed tests, 11,394 passed, 93 skipped |
| Memory regressions introduced by decoupling | PASS, 0 introduced by failed test count comparison |
| 019 strict validate | Pending final rerun after template normalization |
| Parent strict validate | Pending final rerun after template normalization |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS

1. **Spec-kit memory full suite remains baseline-red.** The failed test count is unchanged by decoupling, so those failures are documented and not fixed in this packet.
2. **The worktree contains unrelated dirty files.** Commit staging must include only decoupling-related files and exclude parallel-session drift.
<!-- /ANCHOR:limitations -->
