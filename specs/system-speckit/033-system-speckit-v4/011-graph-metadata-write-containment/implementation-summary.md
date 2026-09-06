---
title: "Implementation Summary: Workspace Path Containment"
description: "The graph-metadata write guard classified a destination as spec-shaped and wrote it, so any path containing a specs segment was accepted - including one outside the repository. Membership is now proven against the configured roots."
trigger_phrases:
  - "implementation"
  - "summary"
  - "template"
  - "impl summary core"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/043-workspace-path-containment"
    last_updated_at: "2026-08-30T08:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Proved root membership in the graph-metadata write guard"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-043-workspace-path-containment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 043-workspace-path-containment |
| **Status** | Complete |
| **Completed** | 2026-08-30 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A write boundary that proves what its error message claims. `writeGraphMetadataFile` canonicalized its destination and then asked a classifier whether the result could hold graph metadata; that classifier's containment test is a substring match for a specs segment. It established that a path *looks* like a spec document, never that it belongs to this workspace, so any destination on the filesystem passed. A write into a temporary directory outside the repository succeeded while the guard reported that it refuses exactly that.

Membership is now proven against the roots the workspace actually configures, reusing the existing resolver rather than inventing a second notion of where specs live.

### Why membership is measured before canonicalization

Four tracks in this repository are symlinks into sibling repositories. Canonicalizing first would resolve those to paths outside every root and refuse writes that were always legitimate — trading a loose guard for a broken one. The parent directory is still canonicalized, which is what rejects a broken or dangling link.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp-server/lib/graph/graph-metadata-parser.ts` | Modified | Root-membership proof before the write |
| `scripts/tests/graph-metadata-write-containment.sh` | Created | Pins the escape, the empty-refusal, and the symlinked track |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The escape was reproduced first, as a real write to a real path outside the repository, so the fix had something to disprove rather than a description to satisfy.

The interesting constraint was not the escape but the shape of the fix: the obvious version — canonicalize, then require the result under a root — closes the hole and breaks every symlinked track. Both directions are pinned by the suite so neither can be reintroduced.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

**The classifier keeps its job.** It answers "does this look like a spec document", which is still wanted. What was missing was a membership proof beside it, not a rewrite of it.

**Membership is measured against two workspaces, and the second is the one that matters.** The first version asked `getSpecsBasePaths()` with no argument, which resolves roots from the calling process. That is not the workspace the bytes land in. Any caller running from elsewhere — a hook launched from the home directory, a fixture repository built under a temporary directory — was refused, including refused from writing into the real repository. Deriving roots from the destination as well answers the question that was actually being asked. It does not let a destination authorize itself: a root counts only when it exists on disk and its workspace is anchored on a real `.opencode` directory, so a path that merely contains a `specs` segment still yields no roots.

**Two sibling findings are tracked, not folded in.** A symlink-redirect gap in resume containment and a scan-to-write gap in the repair script are the same family — proving membership rather than matching a shape — on different surfaces.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Spec-shaped path outside the workspace, with no `.opencode` among its ancestors | Refused, no file created |
| Traversal escaping the workspace | Refused |
| In-repo destination | Written |
| Symlinked sibling-repo track | Written |
| Nested packet in a symlinked repo | Written |
| Another workspace, anchored on `.opencode` | Written |
| The same shape with no anchor | Refused |
| In-repo destination from a foreign working directory | Written |
| `graph-metadata-write-containment` | 8/8 |
| Negative control on the three added cases | 2 fail against the first shipped guard; the no-anchor refusal passes both ways, which is what it is there to show |
| Suites the first version broke | follow-up-api, generator-hardening, identity-resolver-merge-safety, graph-metadata-refresh, continuity-freshness, workflow-canonical-save-metadata, trigger-phrase-no-prose-bigrams — 21 failed before, 52 passed / 2 skipped / 0 failed after |
| Graph-adjacent slice | 32 failures before, 24 after, none added; the remainder pre-date this packet |
| Surrounding suites | ac-coverage 16/16, ac-closure 29/29, goal-shape 11/11, fingerprint-docset 6/6 |
| Build | `tsc` 0 errors, dist rebuilt |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A directory named `.opencode` beside a destination authorizes writes there.** That is the whole of what the guard measures, so it bounds a caller passing an arbitrary destination and nothing more. Reasoning and the two stricter variants that were built and measured as worse: ADR-001.
2. **A symlink planted inside a configured root still redirects the write.** Creating one already requires write access to the repository, so this guard bounds arbitrary destinations rather than replacing filesystem permissions.
3. **`repair-derived` still refuses symlinked tracks outright**, by its own pre-existing packet-tree guard. Unrelated to this boundary, and unchanged here.
4. **A workspace is recognized by a real `.opencode` directory beside it.** Planting one next to a destination authorizes writes there. Like limitation 1, that requires filesystem write access at the destination, which this guard does not attempt to replace.
<!-- /ANCHOR:limitations -->

---
