---
title: "Task Breakdown: /doctor + Install-Guide Alignment"
description: "Task list for the five-cluster parallel doc-alignment sweep, adversarial verification, and orchestrator fix-ups across the /doctor command surface and three subsystem install guides."
trigger_phrases:
  - "doctor install alignment tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-doctor-install-alignment"
    last_updated_at: "2026-06-02T20:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All sweep + fix-up tasks complete; re-grep clean"
    next_safe_action: "Metadata + validate + commit"
    blockers: []
    key_files:
      - ".opencode/commands/doctor/_routes.yaml"
      - ".opencode/commands/doctor/scripts/mcp-doctor.sh"
      - ".opencode/install_guides/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-remediation-session"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Task Breakdown: /doctor + Install-Guide Alignment

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

- [x] T-01 Author spec.md + plan.md with anchors; partition strictly by subsystem into five disjoint clusters — spec.md/plan.md
- [x] T-02 Re-confirm R1 ground truth (code-graph DB is skill-local; old shared path superseded 2026-05-29) — config.ts:20 default
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-03 [P] Cluster A — /doctor command surface (12 files): R2 mutation-class reconciliation (memory/causal-graph/code-graph/deep-loop → read-only; KEPT skill-advisor=mutates + install/debug/update=mutates), R1 code-graph path → skill-local, R3 "6 servers"→5, R4 drop `:apply`/`:apply-confirm` + per-subsystem colon-forms (KEPT `/doctor:mcp` + `/doctor:update`), R6 doctor_skill-advisor rebuild target + lane tuple, Node 18+→>=20.11 — _routes.yaml, speckit.md, mcp.md, update.md, 7 assets, mcp-doctor.sh
- [x] T-04 [P] Cluster B — system-spec-kit docs (7 files): R1/R3/R4/R5/R6 — 35→36 tools (opencode.json:33 note), Node>=20.11, drop phantom v1.8.1, "6 servers"→5, embeddings wording, launcher-vs-backend, fix invalid MCP-call examples; preserved 014 README additions — README.md, mcp_server/{README,INSTALL_GUIDE}.md, opencode.json, feature_catalog/16.../232, manual_testing_playbook/{23.../README,manual_testing_playbook}.md
- [x] T-05 [P] Cluster C — system-code-graph docs: 0 edits — only old-path refs are legitimate historical/migration context (INSTALL_GUIDE.md:53,211 + database_path_policy.md migration log) already naming skill-local canonical; preserved
- [x] T-06 [P] Cluster D — system-skill-advisor docs (4 files): R6/R11 — lane ids → explicit_author/lexical/graph_causal/derived_generated/semantic_shadow; semantic_shadow LIVE; "9 public"→"8 public + 1 internal"; embeddings wording (Python sentence-transformers sidecar gone) — README.md, INSTALL_GUIDE.md, references/scoring/{advisor_scorer,lane_weight_tuning}.md
- [x] T-07 [P] Cluster E — install (2 files): R1/R3/R5 — launcher front-proxy command, counts, embeddings wording — scripts/setup/install.sh, install_guides/README.md
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-08 Adversarial verification per cluster — A/B/C/D pass; E returned issues
- [x] T-09 Orchestrator fix-up: install_guides/README.md → Ollama-default local-first (Ollama → HF Local fallback → opt-in OpenAI/Voyage); corrected stale HF model EmbeddingGemma-300m → nomic-ai/nomic-embed-text-v1.5 (verified hf-local.ts is nomic-only) — install_guides/README.md (4 spots)
- [x] T-10 Orchestrator fix-up: mcp-doctor.sh inverted-logic bug — swapped so db_dir=skill-local canonical, legacy_db_dir=former-shared; corrected comment; verified vs config.ts:20 + on-disk reality; `bash -n` clean — mcp-doctor.sh
- [x] T-11 Final re-grep across doctor surface + install README — clean (no old-path-as-current, no "all 6", no "/doctor code_graph", no hf-local-as-default, no embeddinggemma); opencode.json valid JSON; mcp-doctor.sh `bash -n` clean
- [ ] T-12 description.json + graph-metadata.json
- [ ] T-13 validate.sh --strict → 0
- [ ] T-14 Commit explicit paths to main
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All five clusters returned verified edit summaries (25 files edited; Cluster C 0-edit by design)
- [x] No `[B]` blocked tasks remaining
- [x] Final re-grep clean; opencode.json valid; mcp-doctor.sh `bash -n` clean
- [ ] Ship tasks (metadata, validate, commit) complete
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
