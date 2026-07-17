---
title: "Feature Specification: README & References Accuracy Audit + Remediation"
description: "A gpt-5.5-fast deep-research accuracy audit of all user-facing command READMEs plus the system-spec-kit references/assets, followed by adversarial verification against the real filesystem and parallel remediation of the confirmed findings. 159 raw findings -> 144 confirmed (13 rejected, almost entirely the dist build-artifact false-positive class) -> 142 fixes applied across 61 files."
trigger_phrases:
  - "readme accuracy audit"
  - "system-spec-kit references drift"
  - "opencode skill singular typo"
  - "mcp launcher entrypoint readme"
  - "tool api drift remediation"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/009-readme-and-references-accuracy"
    last_updated_at: "2026-06-03T07:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Reconciled completion metadata after 142 fixes shipped; validate strict PASSED"
    next_safe_action: "None packet complete"
    blockers: []
    key_files:
      - ".opencode/install_guides"
      - ".opencode/skills/system-spec-kit/references"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-references-accuracy-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "User directive: audit only user-facing command READMEs (not the ~250 nested architecture/test stubs); audit system-spec-kit references + assets."
---
# Feature Specification: README & References Accuracy Audit + Remediation

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
| **Created** | 2026-06-03 |
| **Branch** | `133-readme-and-references-accuracy` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The user-facing command READMEs and the `system-spec-kit` references/assets had accumulated documentation drift: stale paths, outdated tool API signatures, wrong MCP entrypoints, and validation-reference statements that no longer matched the live validator registry. The most pervasive class was the `.opencode/skill` (singular) typo, which broke copy-paste verification commands, `init_skill.py --path` invocations, and inline doc links. Other classes contradicted the canonical sources of truth (`opencode.json`, `validator-registry.json`, `spec-kit-docs.json`, `recommend-level.sh`, the embeddings `registry.ts`), meaning a reader following the docs would run commands that fail or describe behavior the system no longer has.

### Purpose
Run a faithful, evidence-grounded accuracy audit of the user-facing command READMEs and the `system-spec-kit` references/assets, adversarially verify every raw finding against the real filesystem to strip false positives, and remediate only the confirmed findings so the documentation matches the live system.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **AUDIT** ~33 user-facing command READMEs: root, `install_guides`, `bin`, `plugins`, `scripts`, the ~20 skill top-level READMEs, and the 3 `mcp_server` READMEs.
- **AUDIT** 41 `system-spec-kit` references + 4 assets.
- **VERIFY** all 159 raw findings adversarially against the real filesystem.
- **REMEDIATE** the 144 confirmed findings across the partitioned areas.

### Out of Scope
- The ~250 nested architecture/test-dir README stubs (the repo has 322 READMEs total; only user-facing command READMEs were audited — deliberate scope exclusion).
- Editing source code or config files: only documentation (READMEs + references/assets) is touched.
- The `dist/...` build artifacts themselves (gitignored; the false-positive class that produced 13 rejections).
- Any behavioral change to the validator, embedder, or MCP servers — docs are realigned to the live behavior, not the reverse.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/install_guides/**` (READMEs) | Modify | `.opencode/skill` -> `.opencode/skills` verification commands + doc links |
| `.opencode/skills/**/README.md` (~20 skill top-level + 3 mcp_server) | Modify | path, MCP-entrypoint, tool-API, plugin-name fixes |
| `.opencode/skills/system-spec-kit/references/**` (41 files) | Modify | validation-reference, hooks, memory/embedder drift realignment |
| `.opencode/skills/system-spec-kit/assets/**` (4 files) | Modify | assorted confirmed drift fixes |
| repo-root + `bin` + `plugins` + `scripts` READMEs | Modify | MCP launcher entrypoint, plugin filename, command/path fixes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Audit produces an evidence-grounded finding set | 10 parallel read-only gpt-5.5-fast audits over the in-scope READMEs + references + assets; raw findings captured with file + claim |
| REQ-002 | Every raw finding verified against the real filesystem | 10 parallel adversarial verifiers re-check all 159; each finding marked CONFIRMED or REJECTED with filesystem evidence |
| REQ-003 | Only confirmed findings are remediated | The 13 rejected findings (dist build-artifact false-positive class + a `.mcp.json` analogue) are NOT applied |
| REQ-004 | Remediation stays within audit scope | All edits land in the audited READMEs + references/assets; no scope leak into source/config |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The 5 dominant themes are fixed faithfully | singular-`skill` typo, MCP launcher entrypoint, tool-API drift, validation-reference drift, memory/embedder + hooks drift all corrected to the live source of truth |
| REQ-006 | Highest-risk content clusters spot-verified against live source | path/command/tool fixes, validation_rules vs validator-registry, level_selection_guide §2 vs recommend-level.sh, embedder_architecture vs registry.ts — all confirmed correct |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 159 raw findings are reduced to 144 confirmed via adversarial filesystem verification; the false-positive `dist` class is rejected, not applied.
- **SC-002**: 142 fixes are applied across 61 documentation files with 0 skipped and no scope leak; grepClean confirms the typo/path/tool-API classes are gone.
- **SC-003**: The 4 highest-risk content clusters spot-verify clean against live source; `validate.sh --strict` Errors 0 for this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | gpt-5.5-fast cannot see gitignored `dist/` artifacts | False "file does not exist" findings | Adversarial verify stage re-checks against the real local filesystem; 13 such findings rejected |
| Risk | Verification tooling can itself mislead (fd false-negative) | A real file mis-flagged as a hallucination | Cross-check with a second tool (`rg --files`); confirmed `recommend-level.sh` exists, scoring fix is real |
| Risk | 10 parallel edit agents touching overlapping files | Conflicting edits / lost writes | Partition by the same 10 audit areas with disjoint file sets per agent |
| Risk | Doc fix could "improve" beyond confirmed findings | Scope creep | Remediation is finding-driven: only confirmed findings applied; grepClean validates |
| Dependency | Canonical sources of truth (`opencode.json`, `validator-registry.json`, `spec-kit-docs.json`, `recommend-level.sh`, `registry.ts`) | — | Used as ground truth for both verification and remediation |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: No secrets or credentials introduced or exposed by the doc edits; remediation is path/command/API text only.
- **NFR-S02**: Read-only audit stage uses isolated parallel workflows with no write access to the filesystem.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. L2: EDGE CASES

- A finding references `dist/context-server.js` directly → REJECTED: `dist` is a gitignored build artifact present locally; the canonical entrypoint per `opencode.json` is the launcher `node .opencode/bin/mk-spec-memory-launcher.cjs`.
- A finding claims a file "does not exist" → re-check with `rg --files` (not just `fd`) before treating as a hallucination; one such fd false-negative initially mis-flagged the `recommend-level.sh` scoring fix.
- A reference contradicts the live registry (e.g. rule severity `WARN` vs `error`) → realign the doc to `validator-registry.json` / `spec-kit-docs.json`, not the other way.
- A README links to `.opencode/skill/...` (singular) → corrected to `.opencode/skills/...` (plural), including `init_skill.py --path`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 61 doc files across READMEs + references + assets, partitioned into 10 areas |
| Risk | 8/25 | Documentation-only; no source/config change; finding-driven remediation |
| Research | 14/20 | 3-stage parallel workflow: audit (10) + verify (10) + remediate (10); cross-tool verification |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Scope (user-facing command READMEs + system-spec-kit references/assets; exclude the ~250 nested stubs) and method (audit → verify → remediate confirmed only) confirmed by the user.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Confirmed findings detail**: `/tmp/readme-research/AUDIT-REPORT.md` + `confirmed.json`
