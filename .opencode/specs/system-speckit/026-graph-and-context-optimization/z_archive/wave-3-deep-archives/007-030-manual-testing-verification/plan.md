---
title: "Implementation Plan: 016 Manual Testing Verification"
description: "Execute existing manual_testing_playbook scenarios + Layer-2 post-rename smoke probes for the system-code-graph skill."
trigger_phrases:
  - "016 plan"
  - "manual testing verification plan"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/030-manual-testing-verification"
    last_updated_at: "2026-05-14T20:05:00Z"
    last_updated_by: "orchestrator-patch"
    recent_action: "Restructured plan to template anchors"
    next_safe_action: "Run deep-review"
    blockers: []
    key_files:
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "016-manual-testing-verification-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 016 Manual Testing Verification

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Run all 15 existing scenarios in `.opencode/skills/system-code-graph/manual_testing_playbook/` against the live system (read-only) and create 6 new Layer-2 smoke probes for post-rename gaps. Record per-scenario verdicts with evidence. Verify the mk-code-index rename, MCP tool surface, database path, fresh-tsc emit, and 009 tsconfig fix.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Each executed scenario carries concrete evidence (command output, file presence, return code) in checklist.md
- All Layer-2 smoke probes (016-021) PASS
- FAIL count = 0; SKIP scenarios documented with reason
- 016 packet validates strict (0E/0W)
- Commit on main with opencode co-author trailer
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Two-layer verification approach:

- **Layer 1 (existing scenarios):** Iterate through every file in `manual_testing_playbook/`; for each scenario, follow documented steps against live system. Scenarios needing disposable workspace mutations (file deletion, 50+ file mutation) flagged as SKIP — equivalent read-path behavior covered by Layer-2 probes.
- **Layer 2 (new smoke probes):** Six new scenarios (016-021) added to the playbook covering post-rename gaps:
  - 016: MCP tool manifest post-rename
  - 017: Launcher startup prefix
  - 018: mcp.json server key rename
  - 019: Database path verification
  - 020: TypeScript build and entry point
  - 021: Unicode-normalization fix from packet-009
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## 4. AFFECTED SURFACES

| Surface | Action |
|---------|--------|
| `.opencode/skills/system-code-graph/manual_testing_playbook/**` | Add 6 new scenarios (016-021) |
| `.opencode/specs/.../016-manual-testing-verification/` | New L2 packet docs |
| Live MCP server | Read-only probes via JSON-RPC tools/list, code_graph_status, etc. |
| `.claude/mcp.json` | Read-only verification |
| `.opencode/bin/mk-code-index-launcher.cjs` | Read-only launch probe |
| `.opencode/skills/system-code-graph/dist/` | Read-only check for emit artifacts |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES

### Phase 1: Inventory (existing scenarios)
- `find manual_testing_playbook -name '*.md'` to enumerate
- Read each scenario's documented steps + expected outcomes

### Phase 2: Layer-1 Execution
- For each scenario: execute steps, capture observed output, classify PASS/FAIL/SKIP with evidence

### Phase 3: Layer-2 Smoke Probe Creation + Execution
- Author 016-021 in the playbook
- Execute each new probe; record PASS/FAIL/SKIP with concrete output

### Phase 4: Packet Production
- Author 016 packet docs (spec, plan, tasks, checklist, implementation-summary)
- Run validate.sh --strict
- Stage and commit on main
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

Verification IS the testing. Each PASS verdict is itself a test result captured in checklist.md. The packet's `implementation-summary.md` records all 21 verdicts with evidence anchors. No separate test artifacts needed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

- Packets 010-015 shipped on main (rename, docs, READMEs, architecture)
- 009 tsconfig fix in dist
- node-llama-cpp Metal binary working (verified in 041)
- Live spec_kit_memory + mk_code_index MCP children reachable
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

Verification-only packet — no rollback needed for the packet itself. If a future regression surfaces against any of the 21 verdicts, file a follow-on packet with the specific failure evidence; this packet's checklist.md serves as the reference baseline.
<!-- /ANCHOR:rollback -->
