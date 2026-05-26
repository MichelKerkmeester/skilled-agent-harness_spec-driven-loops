---
title: "Feature Specification: Remove residual ccc references from system-code-graph docs and align doc names to code-graph's own current naming [template:level_2/spec.md]"
description: "system-code-graph docs still reference the old ccc-era handler/adapter/catalog naming (ccc-status.ts, lib/ccc/, 07--ccc-integration/, ccc_bridge_integration.md, cccStatus schema fields, retired-search-path.ts/'ccc binary') even though the code was renamed to its own clean names. The 013 deep-review surfaced this residue class; this packet aligns the docs to reality."
trigger_phrases:
  - "code-graph ccc residue"
  - "remove ccc references code-graph"
  - "code-graph naming remediation"
  - "ccc doc cleanup"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/014-remediate-codegraph-naming"
    last_updated_at: "2026-05-25T15:05:00Z"
    last_updated_by: "main-agent"
    recent_action: "Authored spec from 013 deep-review iter-5/7 verified findings"
    next_safe_action: "Edit the 11 system-code-graph docs to drop ccc residue"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/feature_catalog/feature_catalog.md"
      - ".opencode/skills/system-code-graph/SKILL.md"
      - ".opencode/skills/system-code-graph/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "remediate-codegraph-naming-001"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Remove residual ccc references from system-code-graph docs and align doc names to code-graph's own current naming

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-25 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 014 deprecation renamed code-graph's handlers and tools to their own clean identifiers — handlers are `status.ts` / `scan.ts` / `verify.ts` (+ `query.ts`, `context.ts`, `apply.ts`, `detect-changes.ts`, `index.ts`), tools are `code_graph_*`, the engine is tree-sitter, and `lib/` is `{ipc,shared,utils}/`. But the skill's **documentation** was never updated: it still references the old ccc-era names — `ccc-status.ts` / `ccc-reindex.ts` / `ccc-feedback.ts`, a deleted `lib/ccc/` adapter dir, a deleted `feature_catalog/07--ccc-integration/` section, a deleted `references/integrations/ccc_bridge_integration.md`, dead `cccStatus`/`cccReindex`/`cccFeedback` schema fields, a non-existent `retired-search-path.ts` "local `ccc` binary", and ghost test names (`ccc-integration-stress.vitest.ts`, `code-graph-context-retired-search-telemetry-passthrough.vitest.ts`). The 013 post-deprecation deep-review (iters 5–7, cli-devin/SWE-1.6) surfaced this class; it was independently re-verified by exact grep. The 007/009 doc-sweep missed system-code-graph's own docs.

### Purpose
Every system-code-graph doc uses code-graph's own current names and contains zero `ccc` references; no doc links to a deleted file.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace `ccc-*.ts` handler filenames with the real `status.ts` / `scan.ts` / `verify.ts` (and describe them as code-graph handlers, not a "ccc bridge").
- Remove dead references to deleted artifacts: `lib/ccc/`, `feature_catalog/07--ccc-integration/`, `references/integrations/ccc_bridge_integration.md`, `retired-search-path.ts`.
- Replace dead schema-field names (`cccStatus`/`cccReindex`/`cccFeedback`) with the real dispatch (`code-graph-tools.ts` → `handlers/*.ts`) in `tool_surface.md`.
- Fix ghost test/file names to the real ones (`code-graph-context-handler.vitest.ts`; remove `ccc-integration-stress.vitest.ts`).
- Correct "local `ccc` binary" prose — code-graph is tree-sitter, no external binary.
- **(Expanded during execution)** Also clean the *renamed* ccc residue the deprecation's botched `ccc → "structural search"` find-replace left behind — even though it no longer spells `ccc`, it is the same defect and violates "code-graph uses its own names": false "structural search **bridge/binary/CLI/facade**" prose, a phantom `code_graph_* and detect_changes` tool, a broken identifier `getstructural searchBinaryPath`, double-word garbles ("structural search search"), and a "separate semantic-index runtime" bridge that no longer exists. Verified against code: seeds are `manual`/`graph` only (no semantic provider), no external binary, no sqlite-vec/embedding path.

### Out of Scope
- The other 013 findings that are **not** code-graph: `.gemini/GEMINI.md` coco routing (P0), `/memory:manage` ccc subcommand, advisor `database/skill-graph.json`, `.gitignore`, `.opencode/bin/lib/sidecar-env-allowlist.cjs` `RERANK_`, and the system-spec-kit `250-session-start` `.venv/bin/ccc` playbook — these belong to a separate remediation per the 013 review-report; this packet is scoped to `system-code-graph/` per the operator directive.
- Any code change — the code is already clean; this is documentation-only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-code-graph/mcp_server/handlers/README.md` | Modify | ccc-*.ts → status/scan/verify; drop "ccc bridge" prose |
| `.opencode/skills/system-code-graph/README.md` | Modify | handler-path table + ccc_bridge_integration link + §3.5 anchor |
| `.opencode/skills/system-code-graph/SKILL.md` | Modify | ccc_/ccc keywords + 07--ccc-integration + ccc_bridge_integration refs |
| `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md` | Modify | 07--ccc-integration section/links + "local ccc binary" |
| `.opencode/skills/system-code-graph/references/runtime/tool_surface.md` | Modify | cccStatus/lib/ccc → code-graph-tools.ts/handlers; bridge cross-ref |
| `.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md` | Modify | 07--ccc-integration section + links |
| `.opencode/skills/system-code-graph/mcp_server/tools/README.md` | Modify | ccc_* tools; ghost telemetry test name |
| `.opencode/skills/system-code-graph/mcp_server/lib/shared/README.md` | Modify | retired-search-path.ts rows + "ccc binary path" |
| `.opencode/skills/system-code-graph/mcp_server/tests/README.md` | Modify | ghost retired-search-telemetry test name |
| `.opencode/skills/system-code-graph/mcp_server/tests/lib/README.md` | Modify | shared/retired-search-path.ts ref |
| `.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/README.md` | Modify | "CCC bridge" prose + ghost ccc-integration-stress test |
| `.opencode/skills/system-code-graph/ARCHITECTURE.md` | Modify | (expanded) "structural search bridge" subsystem + diagram + false sqlite-vec/semantic-runtime claims |
| `.opencode/skills/system-code-graph/feature_catalog/06--mcp-tool-surface/01-tool-registrations.md` | Modify | (expanded) phantom `code_graph_* and detect_changes` tool name |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Zero `ccc` tokens in system-code-graph docs (excl `changelog/`, `package-lock.json`) | `rg -i ccc .opencode/skills/system-code-graph -g '!**/changelog/**' -g '!*package-lock.json'` returns 0 matches |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Replacement names point to real current files/ids | Every handler/tool/test name cited in the edited docs resolves to an existing file or live tool id |
| REQ-003 | No doc links to deleted artifacts | No remaining links to `07--ccc-integration/`, `ccc_bridge_integration.md`, `retired-search-path.ts`, `lib/ccc/` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -i ccc` over `system-code-graph/` (excl changelog + package-lock) returns 0. ✅ ACHIEVED
- **SC-002**: `validate.sh <packet> --strict` exits 0/1 (no errors); no broken intra-doc links to deleted files. ✅ ACHIEVED
- **SC-003**: Full residue sweep — `code_graph_* and detect_changes` phantom tool, `structural search` bridge/binary/CLI, `getstructural searchBinaryPath`, `retired-search`, `separate semantic-index runtime` — all 0 (only ARCHITECTURE.md's explicit *negation* of the runtime remains). ✅ ACHIEVED
- **SC-004**: Both renumbered docs (feature_catalog 1–8, playbook 1–17) have gap-free ToC↔heading numbering. ✅ ACHIEVED
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-reach into accurate "retired-search" names | Low | Verified zero `retired-search-*` files exist — all such refs are confirmed ghosts, safe to remove |
| Risk | Breaking a live cross-ref while removing a dead one | Low | Each replacement target verified against the real tree before edit |
| Dependency | None — code already renamed (013 confirmed) | n/a | Documentation-only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A — documentation-only change, no runtime impact.

### Security
- **NFR-S01**: N/A — no secrets, no auth surface touched.

### Reliability
- **NFR-R01**: Docs must not cite non-existent files (broken-link reliability).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Innocuous `ccc` substrings (none expected after sweep): final grep must show literal 0, not "only false positives".

### Error Scenarios
- A `ccc` ref that maps to a still-live concept: re-frame to the code-graph-native term rather than delete blindly.

### State Transitions
- Partial completion: REQ-001 grep is the gate — packet is not complete until it returns 0.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 11 docs, ~60–120 line edits, single skill |
| Risk | 4/25 | Doc-only, no code/runtime, reversible |
| Research | 6/20 | Already done in 013 + this session's exact-grep verification |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None — scope and target names are fully resolved against the real tree.
<!-- /ANCHOR:questions -->
