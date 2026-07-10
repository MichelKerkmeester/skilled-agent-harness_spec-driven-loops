---
title: "Task Breakdown: README & References Accuracy Audit + Remediation"
description: "Task list for the 3-stage parallel audit -> verify -> remediate workflow over the user-facing command READMEs and system-spec-kit references/assets."
trigger_phrases:
  - "readme accuracy tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/009-readme-and-references-accuracy"
    last_updated_at: "2026-06-03T07:32:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All audit + verify + remediate tasks complete; 142 fixes / 61 files / 0 skipped"
    next_safe_action: "Metadata + validate + reconcile"
    blockers: []
    key_files:
      - ".opencode/install_guides"
      - ".opencode/skills/system-spec-kit/references"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-references-accuracy-session"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Task Breakdown: README & References Accuracy Audit + Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### Description — evidence`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-01 Census the README surface — 322 total; ~250 nested stubs excluded; ~33 user-facing command READMEs in scope
- [x] T-02 [P] Run 10 parallel read-only gpt-5.5-fast audits over ~33 READMEs + 41 references + 4 assets — 159 raw findings captured
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-03 [P] Run 10 parallel adversarial verifiers re-checking all 159 findings against the real filesystem
- [x] T-04 Classify findings — 144 CONFIRMED / 13 REJECTED
- [x] T-05 Reject the dist build-artifact false-positive class — `dist` is gitignored but present locally; gpt-5.5 couldn't see it (+ a `.mcp.json` analogue)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-06 [P] Run 10 parallel edit agents partitioned by the same 10 areas (disjoint files) — 142 fixes / 61 files / 0 skipped
- [x] T-07 Fix theme 1: `.opencode/skill` -> `.opencode/skills` (install_guides + skills/README; commands, `init_skill.py --path`, doc links)
- [x] T-08 Fix theme 2: MCP entrypoint = launcher `node .opencode/bin/mk-spec-memory-launcher.cjs` (per opencode.json), not bare `dist/context-server.js`
- [x] T-09 Fix theme 3: tool-API drift — `memory_embedding_reconcile mode:[dry-run,apply]`, Code Mode `call_tool_chain({code})`, `SPECKIT_EMBEDDER`→`EMBEDDINGS_PROVIDER`, plugin `mk-skill-advisor.js`
- [x] T-10 Fix theme 4: validation-reference drift — validation_rules/template_compliance_contract/path_scoped_rules realigned to validator-registry.json + spec-kit-docs.json
- [x] T-11 Fix theme 5: memory/embedder + hooks drift — level_selection_guide §2 → recommend-level.sh 4-factor model; embedder_architecture trimmed to nomic-only MANIFESTS
- [x] T-12 grepClean — typo/path/tool-API classes confirmed gone across edited files
- [x] T-13 Orchestrator spot-verify of 4 highest-risk content clusters vs live source — all correct (one fd false-negative caught via `rg --files`)
- [ ] T-14 description.json + graph-metadata.json
- [ ] T-15 validate.sh --strict → 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All audit + verify + remediate tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] 142 fixes applied / 61 files / 0 skipped / grepClean
- [ ] Ship tasks (metadata, validate) complete
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
