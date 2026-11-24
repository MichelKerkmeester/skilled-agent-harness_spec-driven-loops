---
title: "Implementation Summary"
description: "Every derived layer is rebuilt without cli-orca."
trigger_phrases:
  - "cli orca removal regeneration"
  - "cli orca zero reference proof"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-orca/003-cli-orca-deprecation/004-regeneration-and-zero-reference-proof"
    last_updated_at: "2026-11-24T14:46:10Z"
    last_updated_by: "generate-context"
    recent_action: "Recorded why the cite-drift rows stay"
    next_safe_action: "None; phase complete"
    packet_purpose: "Purpose: Regenerate every derived layer from its source and prove nothing live still names cli-orca."
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/shared/scripts/cite-drift-labels.jsonl"
    session_dedup:
      fingerprint: "sha256:7c3806d75b4ff0faa21bffc3601dc406995b62a80c4cfa373de9f6ae01b72904"
      session_id: "cli-orca-deprecation-004-regeneration-and-zero-reference-proof"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "0b81ad2f-04a7-4ad7-b174-0b3f9930b833"
      workspace: "/Users/michelkerkmeester/worktrees/public/538-orca-labels-graph-provision"
      savedAt: "2026-11-24T14:46:10Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-regeneration-and-zero-reference-proof |
| **Status** | Complete |
| **Completed** | 2026-11-24 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every derived layer is rebuilt without cli-orca. The advisor graph counts 14 skills, the trigger index and README fixtures carry no path under the skill, the mcp-tooling hub serves compiled routing again, and an Orca prompt now gets no recommendation.

### Phase 4: regeneration-and-zero-reference-proof

Regenerate every derived layer from its source and prove nothing live still names cli-orca.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `skill-graph.json` | Regenerate | Advisor graph |
| `trigger-index.json` and three retrieval fixtures | Regenerate | Trigger index |
| two sk-doc README fixtures | Modify | cli-orca rows dropped |
| `local-native-approved-divergences.json` | Modify | Resolved entry dropped |
| mcp-tooling activation manifest, served and authored | Regenerate | Policy hash |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

I ran this phase directly with each artifact's own tool: the graph compiler, the trigger index generator, the advisor build and the manifest refresh. For the two README fixtures I removed only the cli-orca rows, because `--write` would also have absorbed three unrelated directories.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Remove ledger entry rr-hub6-207 | The ratchet requires a resolved divergence to be removed. With the mcp-tooling edge gone, the Python scorer now also picks mcp-tooling, the gold answer |
| Re-mint before commit | The pre-commit gate would do the same refresh and copy |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Residue sweep | PASS, every remaining hit is on the keep list |
| Advisor vitest | PASS, `npx vitest run` in the advisor runtime: 2738 passed, 0 failed (baseline 13 failed) |
| Ratchet | PASS, 9/9 |
| mcp-tooling routing | PASS, compiled-serving |
| Trigger index | PASS, `--check` exits 0 |
| README parity | PASS, diff is empty |
| Advisor replay | PASS, no recommendation for an Orca prompt |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. One compiled-route test fails because two served files differ from their authored copies at HEAD. Neither file is touched here.
2. The README manifest check still reports three sk-code benchmark directories that predate this packet.
3. The cite-drift label rows live-02, live-09 and live-16 still name the deleted cli-orca benchmark report. They stay by the phase 1 keep decision: each is read at its pinned commit `ebcc68e8`, where the report exists, and removing them would drop the set below the scan's 40-row label gate. No remote branch or tag contains `ebcc68e8`, so a fresh clone cannot read any of the 40 rows. That risk covers the whole label set, not only these three.
<!-- /ANCHOR:limitations -->

---
