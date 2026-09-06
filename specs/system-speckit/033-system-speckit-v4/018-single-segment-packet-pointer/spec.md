---
title: "Spec: Single-Segment Packet Pointer"
description: "Let SPECDOC_FRONTMATTER_004 accept a single safe path segment in packet_pointer instead of demanding a track/name pair, so a repository that keeps packets directly under specs/ can pass."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "single segment packet pointer"
  - "packet_pointer two segment requirement"
  - "SPECDOC_FRONTMATTER_004"
  - "flattened specs tree pointer"
importance_tier: "high"
contextType: "spec"
parent: "system-speckit"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/018-single-segment-packet-pointer"
    last_updated_at: "2026-09-02T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored spec, plan and tasks for the single-segment packet_pointer widening"
    next_safe_action: "Implement the regex change in spec-doc-structure.ts (external cli-devin dispatch), then verify"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/lib/validation/spec-doc-structure.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-050"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Accept a single safe segment; keep every other guard (no leading slash, no .., no absolute path, safe chars, trailing-slash handling) — operator decision, 2026-09-02"
---
# Spec: Single-Segment Packet Pointer

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 050-single-segment-packet-pointer |
| **Status** | Draft |
| **Created** | 2026-09-02 |
| **Level** | 1 |
| **Predecessor** | None |
| **Successor** | None |
| **Priority** | P1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

`SPECDOC_FRONTMATTER_004` in `spec-doc-structure.ts` validates `_memory.continuity.packet_pointer` against `/^[a-z0-9._-]+(?:\/[a-z0-9._-]+)+\/?$/` — the `(?:\/[a-z0-9._-]+)+` group requires **at least one slash**, so the rule demands two or more path segments. That assumption held while every repository nested its packets under a track directory (`track/NNN-name`). It breaks for a repository that deliberately keeps packets directly under `specs/` with no track layer: the Obsidian plugin repository flattened its tree on 2026-09-01, and its `specs/` is this repository's `specs/obsidian` by symlink.

`METADATA_DISK_PATH_CONSISTENCY` already checks `packet_pointer` against the packet's real on-disk leaf folder, independently of segment count. For a single-segment packet that check is satisfiable with the correct value; `SPECDOC_FRONTMATTER_004`'s two-segment demand adds no extra guarantee on top of it — it only rejects a layout the disk-consistency check would otherwise accept. Tested 2026-09-02: no `packet_pointer` spelling passes both rules together from either repository root for a single-segment packet.

### Purpose

`SPECDOC_FRONTMATTER_004` accepts a `packet_pointer` with one safe segment as well as two-or-more, so a flattened `specs/` layout can pass validation without weakening any of the rule's other guards.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:** the `packet_pointer` regex/guard in `SPECDOC_FRONTMATTER_004` (`spec-doc-structure.ts`, the check block around lines 720-765) — widen it to accept exactly one safe path segment in addition to the current two-or-more, while keeping every other guard: no leading slash, no `..` traversal, no absolute path, safe-character class, and existing trailing-slash handling. A vitest case proving the RED-to-GREEN transition for a single-segment pointer, and confirming the existing negative cases (leading slash, `..`, absolute path, unsafe characters) still fail.

**Out of scope:** `METADATA_DISK_PATH_CONSISTENCY` and any other rule in the file — they are unaffected and untouched. Any change to how `packet_pointer` values are generated or chosen by `create.sh`, `backfill-graph-metadata.ts`, or any other authoring tool. Any repository-specific packaging or symlink change. The regex for any frontmatter field other than `packet_pointer`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/system-spec-kit/mcp-server/lib/validation/spec-doc-structure.ts` | Modify | Widen the `packet_pointer` pattern in the `SPECDOC_FRONTMATTER_004` check to accept a single safe segment |
| `.opencode/skills/system-spec-kit/mcp-server/lib/validation/spec-doc-structure.test.ts` (or the sibling test file the existing `SPECDOC_FRONTMATTER_004` cases live in) | Modify | Add a single-segment positive case; confirm existing negative cases are unchanged |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 [P0]** A `packet_pointer` consisting of exactly one safe segment (matching the existing per-segment character class `[a-z0-9._-]+`, optionally trailing-slashed) passes `SPECDOC_FRONTMATTER_004` — currently rejected with `is not a safe relative packet path` (RED, observed 2026-09-02 against `spec-doc-structure.ts` lines 720-765; no packet_pointer spelling for a single-segment packet currently passes the rule).
- **REQ-002 [P0]** Every existing negative case for `SPECDOC_FRONTMATTER_004` (leading slash, `..` traversal, absolute path, unsafe characters) still fails after the change — the widening adds an accepted shape, it does not relax the other guards.
- **REQ-003 [P0]** Two-or-more-segment pointers continue to pass exactly as before — the change is additive, not a replacement of the existing multi-segment branch.
- **REQ-004 [P1]** `npm run build` in `mcp-server` exits 0 after the change, so `validate.sh` does not refuse to run with `compiled validation orchestrator is stale`.
- **REQ-005 [P0]** `validate.sh specs/obsidian/005-component-surface-system --strict` reports zero `SPECDOC_FRONTMATTER_004` diagnostics and its first `RESULT:` line reads `RESULT: PASSED` — currently that packet cannot pass both `SPECDOC_FRONTMATTER_004` and `METADATA_DISK_PATH_CONSISTENCY` with any pointer spelling (observed 2026-09-02).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A new vitest case for a single-segment `packet_pointer` is observed RED against the current regex, then GREEN after the widening — both runs' output captured as evidence.
- **SC-002**: The full existing `SPECDOC_FRONTMATTER_004` test suite (including every negative case) passes unchanged after the widening.
- **SC-003**: `npm run build` in `.opencode/skills/system-spec-kit/mcp-server` exits 0.
- **SC-004**: `NODE_PRESERVE_SYMLINKS=1 bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/obsidian/005-component-surface-system --strict` prints `RESULT: PASSED` as its first `RESULT:` line, with zero `SPECDOC_FRONTMATTER_004` lines in the output.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Blast radius.** `.opencode` is symlinked into every repository that uses this spec kit, so `spec-doc-structure.ts` is shared code — this change widens what `SPECDOC_FRONTMATTER_004` accepts for every one of them; it narrows nothing, so no previously-passing packet_pointer in any repository can newly fail.
- **Risk.** A regex change that is too permissive could silently accept an unsafe value the rule was meant to catch. Mitigated by keeping the existing character class, `..`, leading-slash, and absolute-path guards untouched — only the segment-count minimum changes, from "one or more repeated groups" to "zero or more".
- **Dependency.** `METADATA_DISK_PATH_CONSISTENCY` remains the check that ties `packet_pointer` to the real on-disk folder; this change does not touch it and relies on it continuing to catch a pointer that names the wrong folder.
- **Dependency.** The compiled validation orchestrator must be rebuilt (`npm run build` in `mcp-server`) before `validate.sh` will run at all — a stale build exits 3 with no rule output, which would misreport as "nothing to fix" rather than a failing gate.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The operator decided the accepted shape on 2026-09-02: a single safe segment, with every other `packet_pointer` guard unchanged.
<!-- /ANCHOR:questions -->
