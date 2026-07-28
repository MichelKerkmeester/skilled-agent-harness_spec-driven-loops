---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "implementation"
  - "summary"
  - "template"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/036-code-graph-decommission/012-ci-and-binaries"
    last_updated_at: "2026-07-28T09:42:16Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-012-ci-and-binaries"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-ci-and-binaries |
| **Completed** | 2026-07-27 |
| **Level** | 3 |
| **Status** | Complete |
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

Nothing in the repository can now attempt to start, test, or police the code-graph subsystem. The launcher, CLI shim, and their test suites are gone, the shared launcher bridge is stripped of its code-graph branch but still serves the two surviving daemons, and the CI isolation job that guarded the import boundary is deleted.

### Shared bridge stripped, not deleted

The `launcher-ipc-bridge.cjs` library branches on `serviceName` for three daemons: mk-spec-memory, mk-code-index, and mk-skill-advisor. Only the code-graph branch was removed; the library itself was never deleted, because the surviving mk-spec-memory and mk-skill-advisor daemons still load it. Both surviving daemons were verified to start and serve after the strip.

### CI and deploy surface cleaned

The isolation-check CI workflow, whose entire purpose was to forbid source-level imports across the spec-kit boundary, was deleted because the boundary no longer exists. The `build_pkg "code-graph"` step was removed from the deploy script, smoke matrices were stripped of the removed CLI, and gitignore patterns for the subsystem's database and build artifacts were cleared.

### Files Changed

<!-- Include for Level 1-2. Omit for Level 3/3+ where the narrative carries. -->

| File | Action | Purpose |
|------|--------|---------|
| `mk-code-index-launcher.cjs` | Deleted | Registered launcher for the removed server |
| `code-index.cjs` | Deleted | CLI front door |
| `mk-code-index-launcher-*.vitest.ts` (6 suites) | Deleted | Covered the removed launcher |
| `lib/launcher-ipc-bridge.cjs` | Stripped | Code-graph branch removed; library kept for surviving daemons |
| `cli-*-smoke*.cjs` | Modified | Removed CLI from smoke matrices |
| `deploy-mcp.sh` | Modified | Removed `build_pkg "code-graph"` step |
| `.github/workflows/isolation-check.yml` | Deleted | Guarded a boundary that no longer exists |
| `.gitignore` | Modified | Artifact patterns cleared |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

The launcher, CLI, and their tests were deleted by a concurrent session before this session completed the remainder. This session stripped the shared bridge branch, then started both surviving daemons to verify the strip did not break them. The CI isolation job was deleted and the remaining workflow suite confirmed green.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Strip the shared bridge, never delete it | The library serves mk-spec-memory and mk-skill-advisor; deleting it would break both surviving daemons at startup |
| Delete the CI isolation job rather than repurpose it | The guard policed the spec-kit import boundary, which no longer exists; repurposing would test nothing real |
| Remove the `build_pkg "code-graph"` step from deploy-mcp.sh | The deploy script builds packages; the removed package no longer exists |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| Both surviving daemons start and serve | PASS — mk-spec-memory and mk-skill-advisor verified loading after bridge strip |
| Remaining CI green | PASS — isolation job absent, no other job newly failing |
| No executable targeting the subsystem | PASS — bin directory clean |
| No gitignore orphan pattern | PASS — no ignore rule points inside the removed folder |
| Smoke scripts pass | PASS — offline and exit-taxonomy smokes run without the removed CLI |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **Launcher and CLI deletion was performed by a concurrent session.** This session completed the shared-bridge strip, smoke matrices, gitignore, deploy step, and CI job, but the initial binary deletion landed in the main tree before this session ran. The surviving-daemon start check confirmed the concurrent deletion did not break the shared bridge.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->
