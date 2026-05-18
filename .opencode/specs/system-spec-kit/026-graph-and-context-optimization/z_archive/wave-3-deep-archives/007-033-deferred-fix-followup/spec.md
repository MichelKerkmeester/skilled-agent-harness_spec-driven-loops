---
title: "Feature Specification: 019 Deferred-Fix Follow-up"
description: "Closes the 5 deferred findings from 018 (F001, F006/F011, F012, F017, F018) — architecture.md reconstruction, launcher kitDir-derived path, source-map verification, 3 new playbook scenarios."
trigger_phrases:
  - "019 deferred fix followup"
  - "architecture md reconstruction"
  - "code graph apply scenarios"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/033-deferred-fix-followup"
    last_updated_at: "2026-05-14T21:35:00Z"
    last_updated_by: "orchestrator-deferred-fix"
    recent_action: "Closed all 5 deferred findings from 018"
    next_safe_action: "Validate + commit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "019-deferred-fix-followup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 019 Deferred-Fix Follow-up

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-05-14 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Packet 018 fixed 14 of 17 actionable findings from the 017 deep-review, deferring 5 (F001, F006/F011, F012, F017, F018) with documented rationale. The user requested all deferred items be addressed. This packet closes them.

The reconstruction of `architecture.md` is the load-bearing piece — the original 26KB content from packet `1fcc5a1f5` (later rebased to `81f28435af`) was wiped by a parallel-session force-push, leaving an empty file. Reconstructing it lets F006/F011 close cleanly and restores a critical architectural reference.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (5 deferred findings)
- **F001**: Documented acknowledgment (already-resolved during 017 review)
- **F006/F011**: Reconstruct `architecture.md` with correct 10-tool count and no stale claims
- **F012**: Replace hardcoded directory name in launcher.cjs with `path.basename(kitDir)` (resilience to future renames)
- **F017**: Verify source maps reference correct paths after clean rebuild attempt; document that contents are correct
- **F018**: Add 3 new playbook scenarios covering coverage gaps (blast_radius multi-subject, apply sub-operations, multi-file detect_changes)

### Out of Scope
- Force-pushing or rewriting prior commits
- Modifying the 017 review report or 018 packet docs
- Touching `system-spec-kit/`, `system-skill-advisor/`, `mcp-coco-index/` source
- Per-tool exhaustive test coverage (the 3 new scenarios close the highest-priority gaps; remaining gaps tracked as accepted-as-is per 017 reviewer)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Priority | Requirement | Acceptance Criteria |
|----|----------|-------------|---------------------|
| REQ-001 | P1 | architecture.md non-empty, no "12 tools" claim | grep verifies file size > 5KB and contains "10 tools" |
| REQ-002 | P1 | Launcher build fallback uses path.basename | grep verifies `path.basename(kitDir)` present |
| REQ-003 | P1 | 3 new playbook scenarios authored | scenarios 022 / 023 / 024 exist and registered in index |
| REQ-004 | P1 | Launcher startup unchanged | smoke test still produces `[mk-code-index-launcher]` prefix |
| REQ-005 | P0 | Strict validate passes | `validate.sh --strict` exit 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All 5 deferred findings from 018 closed with corresponding diffs
- Reconstructed architecture.md is internally consistent (10 tools, no stale open questions)
- Launcher still starts cleanly post-edit
- All 3 new playbook scenarios validate against the existing playbook index format
- validate.sh --strict on 019 exits 0
- Commit lands on main under correct identity
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

### Dependencies
- 018 packet shipped (`c8925e9e0`)
- 017 deep-review findings registry as authoritative scope

### Risks
- **Architecture.md may get blown away again** by future parallel session activity (same root cause that wiped the original). If this happens, the content can be restored from this commit's HEAD via `git show <019-commit-sha>:.opencode/skills/system-code-graph/architecture.md`. Long-term fix would require investigating which parallel-session workflow is force-pushing over architecture.md — out of scope here.
- F012's `path.basename(kitDir)` change is defensive; existing behavior preserved when the directory remains `system-code-graph`.

### Out of Scope (Won't Address)
- Investigating the force-push root cause that wiped the original architecture.md
- Full per-parameter test coverage (3 new scenarios target highest-priority gaps only)
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. Deferred set closed.
<!-- /ANCHOR:questions -->
