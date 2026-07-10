---
title: "Implementation Plan: 019 Deferred-Fix Follow-up"
description: "File-by-file plan for closing the 5 deferred findings from 018."
trigger_phrases:
  - "019 plan"
  - "deferred fix followup plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/z_archive/wave-3-deep-archives/007-033-deferred-fix-followup"
    last_updated_at: "2026-05-14T21:35:00Z"
    last_updated_by: "orchestrator-deferred-fix"
    recent_action: "Authored plan"
    next_safe_action: "Validate + commit"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "019-deferred-fix-followup-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 019 Deferred-Fix Follow-up

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Close 5 deferred findings from 018 in a single packet. Architecture.md reconstructed from scratch (original content lost to force-push). Launcher.cjs minor resilience edit. 3 new playbook scenarios for the coverage gaps the 017 reviewer flagged.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- architecture.md content reflects current 10-tool reality (NOT the prior stale 12-tool claim)
- Launcher startup smoke test PASSES after the kitDir-basename edit
- All 3 new scenarios pass markdown frontmatter validation
- validate.sh --strict on 019 exits 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

5 deferred findings split into 3 work classes:

1. **Reconstruction** — F006/F011: write a fresh architecture.md aligned with sk-doc's architecture template, current MCP boundary, 10-tool surface, AST + SQLite + sqlite-vec layers, readiness state machine.
2. **Resilience edit** — F012: launcher.cjs `buildIfNeeded` no longer hardcodes the skill directory name; uses `path.basename(kitDir)` so a future rename doesn't break the fallback path.
3. **Playbook expansion** — F018: 3 new scenarios closing coverage gaps for `code_graph_query blast_radius` multi-subject + transitive, `code_graph_apply` 5 operations, and multi-file `detect_changes`.
4. **Documented acknowledgments** — F001 (already-resolved) and F017 (verified-correct, source maps reference current paths after rebuild) close via implementation-summary notes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## 4. AFFECTED SURFACES

| File | Action |
|------|--------|
| `.opencode/skills/system-code-graph/architecture.md` | Reconstructed from scratch (was 0 bytes) — sk-doc architecture template, ~7KB |
| `.opencode/bin/mk-code-index-launcher.cjs` | F012 single-block edit using `path.basename(kitDir)` |
| `.opencode/skills/system-code-graph/manual_testing_playbook/06--mcp-tool-surface/022-code-graph-query-blast-radius.md` | NEW scenario (F018) |
| `.opencode/skills/system-code-graph/manual_testing_playbook/08--doctor-code-graph/023-code-graph-apply-sub-operations.md` | NEW scenario (F018) |
| `.opencode/skills/system-code-graph/manual_testing_playbook/03--detect-changes/024-detect-changes-multi-file-diff.md` | NEW scenario (F018) |
| `.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md` | Index updated to register the 3 new scenarios |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES

### Phase 1: Reconstruction
- Write fresh `architecture.md` matching sk-doc architecture template

### Phase 2: Launcher Resilience
- Apply F012 edit (path.basename derivation)
- Verify launcher startup smoke test

### Phase 3: Playbook Expansion
- Author 022 (blast_radius multi-subject + transitive)
- Author 023 (apply sub-operations)
- Author 024 (multi-file detect_changes)
- Update playbook index to register the new scenarios

### Phase 4: Verification + Commit
- validate.sh --strict on 019
- Scope review of staged files
- Commit on main
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

- Launcher smoke: `timeout 5 node .opencode/bin/mk-code-index-launcher.cjs </dev/null`
- Architecture.md sanity: file size > 5KB, no "12 tools" string, mentions all 10 tools in §3 Components
- Scenarios self-test: each new scenario file has valid frontmatter and pass-criteria checklist
- validate.sh --strict on 019
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

- 018 packet on main (`c8925e9e0`)
- 017 findings registry as authoritative
- Launcher file accessible
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

- All changes are additive or surgical; `git revert <019-commit-sha>` cleanly removes everything
- Architecture.md prior state was empty, so reverting restores empty — equivalent to the pre-019 state
- Launcher edit is one logical block; reverting restores the previous string-hardcoded path
<!-- /ANCHOR:rollback -->
