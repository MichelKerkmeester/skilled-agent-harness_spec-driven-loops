---
title: "Feature Specification: /doctor + Install-Guide Alignment"
description: "The /doctor command router, its per-target assets, and the three subsystem install guides drifted from the shipped reality of system-spec-kit, system-code-graph, and system-skill-advisor. ~148 cited misalignments span DB paths, mutation classes, tool counts, command syntax, launch instructions, and embedding architecture."
trigger_phrases:
  - "doctor command alignment"
  - "install guide drift"
  - "code-graph db path docs"
  - "doctor mutation class"
  - "tool count drift"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/006-operator-tooling/006-doctor-install-alignment"
    last_updated_at: "2026-06-02T20:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Five-cluster sweep + fix-ups shipped; spec synced to shipped state"
    next_safe_action: "Validate --strict and commit"
    blockers: []
    key_files:
      - ".opencode/commands/doctor/_routes.yaml"
      - ".opencode/skills/system-code-graph/mcp_server/core/config.ts"
      - ".opencode/skills/system-skill-advisor/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-remediation-session"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "R2 mutation-class: align route declarations to the read-only reality of the doctor.sh scripts (in-scope alignment), NOT implement the apply/rebuild paths (out-of-scope feature work)."
---
# Feature Specification: /doctor + Install-Guide Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-02 |
| **Branch** | `131-doctor-install-alignment` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A 10-lineage parallel audit (round-2 re-verified: 73 confirmed, 0 false positives, +75 new) found the `/doctor` command router, its per-target assets, the three subsystem install guides, and the subsystem READMEs are **not** aligned with current reality. The drift is systemic across nine clusters: a code-graph DB-path that moved skill-local (2026-05-29) but is still documented at the old shared location; doctor-router mutation classes that promise apply/rebuild behavior the read-only `doctor.sh` scripts do not implement; tool-count/version drift (35→36 tools, Node 18→20.11, phantom v1.8.1, "6 servers"→5); incomplete colon-form `/doctor:*` deprecation; install guides that launch the backend directly instead of the front-proxy launcher; a Python `sentence-transformers` sidecar that is now pure-Node hf-local; stale tool lists with invalid MCP-call examples; wrong rebuild targets; and skill-advisor lane-id drift (`semantic_shadow` now live, not shadow-only).

### Purpose
Bring every `/doctor` command surface and install guide back into exact agreement with the shipped code — so operators and install flows act on accurate paths, counts, commands, and behaviors.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **R1** — replace the superseded shared `.opencode/.spec-kit/code-graph/...` DB path with the skill-local `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite` everywhere it is presented as the *current* path.
- **R2** — reconcile `_routes.yaml` mutation classes to the read-only reality of the four subsystem `doctor.sh` scripts (downgrade overstated `mutates`/`add-only` to `read-only` where the script only health-checks).
- **R3** — version/count sweep: mk-spec-memory 35→36 tools, Node 18→20.11, drop phantom v1.8.1, "all 6 MCP servers"→5 registered, `/doctor code_graph`→`code-graph`, "41-tool"/"54-tool" miscounts.
- **R4** — retire the per-subsystem `/doctor:<name>` colon-forms in favor of argv-positional `/doctor <target>`, and drop unsupported `:apply`/`:apply-confirm` suffixes. **Keep** `/doctor:mcp` and `/doctor:update` — verification showed these are the surviving colon-form commands (the audit's "retire them" was wrong). Fix `/doctor code_graph`→`code-graph`.
- **R5** — install guides: launcher front-proxy command (not `dist/context-server.js` directly) + the missing `SPECKIT_BACKEND_ONLY` / `SPECKIT_IPC_SOCKET_DIR` env rows; Python `sentence-transformers` → pure-Node `@huggingface/transformers` hf-local wording.
- **R6** — fix invalid MCP-call examples (`advisor_validate` needs `confirmHeavyRun:true`, etc.), stale tool lists (add `code_graph_verify`, `skill_graph_validate`, …; `code_graph_*` belong to `mk_code_index` not mk-spec-memory), wrong rebuild targets, and skill-advisor lane ids / `semantic_shadow` now-live wording.

### Out of Scope
- Implementing the apply/rebuild paths the overstated routes *promise* — that is new feature work, not alignment. (R2 aligns docs to reality only.)
- Any change to `config.ts`/`database_path_policy.md` historical/migration references that *legitimately* mention the old shared path as superseded — those are correct and MUST be preserved.
- The launcher `.cjs` UTF-8 fix deploy and any code-behavior change — docs/config-doc only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/doctor/**` (router, speckit.md, per-target + mcp/update assets, scripts) | Modify | Cluster A — R1/R2/R3/R4/R6 within the command surface |
| `.opencode/skills/system-spec-kit/{README.md, mcp_server/README.md, mcp_server/ENV_REFERENCE.md, mcp_server/INSTALL_GUIDE.md}`, `feature_catalog/**`, `manual_testing_playbook/**`, `opencode.json`, env-var ref | Modify | Cluster B — R1/R3/R4/R5/R6 in spec-kit docs (preserve 014/003 additions) |
| `.opencode/skills/system-code-graph/{README.md, INSTALL_GUIDE.md, references/**}` | Modify | Cluster C — R1 current-refs + R6 (preserve historical/migration refs) |
| `.opencode/skills/system-skill-advisor/{README.md, INSTALL_GUIDE.md, scorer/tuning refs}` | Modify | Cluster D — R5 (Python→Node), R6/lane-drift |
| `scripts/setup/install.sh`, `install_guides/README.md` | Modify | Cluster E — R1/R3/R5 top-level install |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | R1 code-graph DB path corrected wherever presented as current | `rg "\.opencode/\.spec-kit/code-graph"` returns only legitimate historical/superseded refs (config.ts comment, database_path_policy.md migration log) |
| REQ-002 | No legitimate historical reference is rewritten | config.ts:18 supersession comment + database_path_policy.md migration entries unchanged |
| REQ-003 | Tool/version counts match source of truth | mk-spec-memory = 36 (`TOOL_DEFINITIONS.length`), 5 registered MCP servers, Node ≥20.11, no v1.8.1 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | R2 mutation classes match `doctor.sh` read-only reality | `_routes.yaml` declarations reconciled; no route promises behavior its script lacks |
| REQ-005 | R4 per-subsystem colon-forms retired; `/doctor:mcp` + `/doctor:update` KEPT | Per-subsystem `/doctor:<name>`→argv-positional `/doctor <target>`; `:apply` suffixes dropped; `/doctor:mcp` + `/doctor:update` preserved; `code_graph`→`code-graph` |
| REQ-006 | R5 install guides use launcher + correct embedding wording | Launcher command documented; `SPECKIT_BACKEND_ONLY` present; no Python sentence-transformers sidecar wording |
| REQ-007 | R6 examples + tool lists + lane ids valid | Invalid MCP-call examples corrected; skill-advisor lanes = `explicit_author, lexical, graph_causal, derived_generated, semantic_shadow`; semantic_shadow = live |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every behavioral/path/count claim in the doctor + install surface traces to a cited current source anchor; zero stale "current" references remain.
- **SC-002**: `validate.sh <packet> --strict` → Errors 0; comment hygiene clean; legitimate historical references preserved.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-replacing the old DB path (rewriting historical/migration refs) | Docs lose migration provenance | Each agent fixes only refs presenting the old path as *current*; preserve superseded/migration mentions |
| Risk | Clobbering the 014/003 README additions (SPECKIT_BACKEND_ONLY, schema narrative) | Regress freshly-shipped docs | Cluster B agent reads current file state; surgical line-level edits only |
| Risk | Parallel agents touching shared files | Merge contention | Partition is strictly by subsystem → disjoint file sets |
| Dependency | The audit deliverable `/tmp/doctor-research/` (ALIGNMENT-REPORT + out-R*.md) | Source of finding sites | Each agent re-verifies its finding against live source before editing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Every edit is grep-verifiable (old string gone where it should be; cited anchor still resolves).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. L2: EDGE CASES

### Data Boundaries
- A doc that mentions BOTH the old path (historical) and new path (current): edit only the current-presenting occurrence.
- A finding whose source line moved since the audit: re-locate by content, not line number; skip if no longer present.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | ~25 files across 3 subsystems + commands + install; ~148 fixes |
| Risk | 8/25 | Docs/config-doc only; main risk is over-replacement, mitigated |
| Research | 6/20 | Audit already done + round-2 verified; R1 ground-truth re-confirmed |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking. R2 scope answered (align-to-read-only). Launcher `.cjs` deploy is a separate, user-gated action tracked outside this packet.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Audit deliverable**: `/tmp/doctor-research/ALIGNMENT-REPORT.md` (+ `out-R1..R5.md`, `out-V1..V5.md`)
