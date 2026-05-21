---
title: "Tasks: 016/005/005 CocoIndex install hygiene"
description: "Task list for verifying pipx/local ccc drift, attempting editable repair, and recording the sandbox blocker."
trigger_phrases:
  - "016/005/005 tasks"
  - "cocoindex install hygiene tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/005-cross-cutting-quality/005-cocoindex-install-hygiene"
    last_updated_at: "2026-05-18T18:47:20Z"
    last_updated_by: "codex"
    recent_action: "Marked diagnosis complete and repair diagnosis-only complete"
    next_safe_action: "Retry editable pipx repair outside sandbox"
    blockers:
      - "Sandbox blocks writes under /Users/michelkerkmeester/.local/pipx"
    key_files:
      - "spec.md"
      - "plan.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000005005"
      session_id: "016-005-005-cocoindex-install-hygiene-tasks"
      parent_session_id: "016-005-005-cocoindex-install-hygiene"
    completion_pct: 35
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 016/005/005 CocoIndex install hygiene

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

- `[x]` - completed
- `[ ]` - pending
- `[B]` - diagnosis-only complete by environment permissions
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP

- [x] T001 - Confirm PATH `ccc` resolves to `/Users/michelkerkmeester/.local/bin/ccc`.
- [x] T002 - Confirm pipx `direct_url.json` has `dir_info: {}`.
- [x] T003 - Confirm pipx package directory lacks `reranker.py`, `fts_index.py`, `fusion.py`, and `registered_embedders.py`.
- [x] T004 - Confirm local venv `direct_url.json` has `{"editable": true}`.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

- [B] T005 - Run `pipx install --force --editable <mcp_server>`.
- [B] T006 - Fallback to pipx venv Python `pip install --no-deps --force-reinstall --editable <mcp_server>`.
- [x] T007 - Verify pipx remains runnable after failed repair attempt.
- [x] T008 - Verify pipx remains stale after failed repair attempt.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

- [ ] T009 - After pipx repair succeeds, patch the bake-off harness to prefer local venv `ccc`.
- [ ] T010 - After pipx repair succeeds, add stale pipx troubleshooting to `INSTALL_GUIDE.md`.
- [ ] T011 - After pipx repair succeeds, run all four module import checks from the pipx venv Python.
- [x] T012 - Stop before harness and guide edits while the repair is diagnosis-only complete.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA

- Diagnosis is captured with command evidence.
- Repair blocker is specific and reproducible.
- No half-shipped harness or install-guide edits are present while pipx remains stale.
- This packet passes strict SpecKit validation.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES

- Parent: `../spec.md` (016/005-cross-cutting-quality)
- Source benchmark harness: `../../004-code-index-stack/004-extended-bake-off/evidence/run-extended-bake-off-with-hybrid-rerank.sh`
- Skill install guide: `.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md`
<!-- /ANCHOR:cross-refs -->


Dispatch A scope reconciliation: this packet is complete for diagnosis only. The pipx repair is intentionally split to a separate follow-on packet scaffolded by Dispatch B; harness/guide edits shipped in commit `339387694a`.
