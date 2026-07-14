---
title: "Feature Specification: cli-opencode permissions-matrix — structured replacement for RM-8 four-layer prose mitigation"
description: "Phase B of 114 follow-on roadmap. Introduce a JSON permissions-matrix schema + runtime pre-tool-call enforcer for cli-opencode iter dispatches, replacing the brittle four-layer prose mitigation shipped after the RM-8 2026-05-04 incident."
trigger_phrases:
  - "permissions matrix cli-opencode"
  - "RM-8 structured replacement"
  - "pre-tool-call gate"
  - "structured permissions schema"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/093-small-ai-model-optimization/003-structured-permissions-matrix"
    last_updated_at: "2026-05-18T14:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 003 spec.md L3"
    next_safe_action: "Author 003 plan.md"
    blockers: []
    key_files:
      - "../001-research-smallcode/research/research.md"
      - ".opencode/skills/cli-opencode/references/destructive_scope_violations.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000007"
      session_id: "114-003-spec-init"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Schema shape: nested per-operation or flat allow-list?"
      - "Runtime enforcer location: cli-opencode skill code vs system-spec-kit deep-loop wrapper?"
    answered_questions:
      - "Replace four-layer prose, do not extend it"
---

# Feature Specification: cli-opencode permissions-matrix

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase B of the 114 follow-on roadmap. Replace the four-layer prose mitigation shipped to cli-opencode after the RM-8 2026-05-04 incident (44 files deleted by deepseek-v4-pro under `--dangerously-skip-permissions`) with a structured JSON permissions-matrix that a runtime pre-tool-call gate enforces deterministically. The schema encodes file-glob × operation-class × scope tuples; the enforcer rejects any tool call falling outside the allowlist BEFORE execution. Effort: ~12 hours. Highest blast-radius prevention in the 114 arc — proven against the RM-8 replay scenario in 001-research-smallcode/iter-009.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Implemented with documented hook-scope deviation |
| **Created** | 2026-05-18 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` (114 phase parent) |
| **Predecessor** | 002-foundation-routing (must ship first; advisor routing surfaces sk-small-model which links to the schema doc) |
| **Successor** | (none planned) — Phase 007 deleted 2026-05-18; schema-lint CI check deferred or out of scope |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

cli-opencode v1.3.3.0 ALWAYS rule #13 ships a four-layer prose mitigation for destructive scope violations (RM-8 follow-on): (L1) prompt contains literal `BANNED OPERATIONS` + `ALLOWED WRITE PATHS` strings, (L2) `--dir` points at fresh worktree, (L3) main git status clean, (L4) prefer cli-copilot + gpt-5.5 for multi-phase targets. This works but is fragile — every dispatch is a roll of the dice, and L1's literal-string check is easily defeated by prompt rewrites. Research iter 9 confirmed a structured schema would have deterministically blocked all 44 file deletions from the 2026-05-04 incident.

### Purpose

Ship a JSON `permissions-matrix.schema.json` + runtime pre-tool-call gate that rejects tool calls outside the active matrix BEFORE execution. Replace the four-layer prose mitigation with the matrix as the primary defense; mark prose mitigation as deprecated-but-supported during transition.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- New schema file: `.opencode/skills/cli-opencode/assets/permissions-matrix.schema.json` defining {target_glob, operation_class, scope, allow|deny, rationale}
- 3 example matrices: read-only-corpus, packet-local-write, repo-wide-write (with reasoning per entry)
- New reference doc: `.opencode/skills/cli-opencode/references/permissions-matrix.md` (schema explanation + integration + RM-8 walkthrough)
- Runtime enforcer: small TS function in `system-spec-kit/mcp_server/lib/deep-loop/` that reads the active matrix and gates tool calls pre-dispatch
- Update `cli-opencode/SKILL.md` ALWAYS #13 to reference matrix as primary; mark four-layer prose deprecated-but-supported

### Out of Scope

- Per-tool permission enforcement at the agent-config-iter-recipe layer (cli-devin already has this; this packet focuses on cli-opencode)
- Migration of all existing dispatch invocations to the new schema (the prose mitigation stays valid as fallback)
- CI lint for over-broad globs (Phase 007 deleted 2026-05-18; rely on PR review or a future packet)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-opencode/assets/permissions-matrix.schema.json` | Create | JSON schema |
| `.opencode/skills/cli-opencode/assets/permissions-matrix.example-readonly.json` | Create | Example matrix #1 |
| `.opencode/skills/cli-opencode/assets/permissions-matrix.example-packet-local.json` | Create | Example matrix #2 |
| `.opencode/skills/cli-opencode/assets/permissions-matrix.example-repo-wide.json` | Create | Example matrix #3 |
| `.opencode/skills/cli-opencode/references/permissions-matrix.md` | Create | Reference doc |
| `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/permissions-gate.ts` | Create | Runtime enforcer |
| `.opencode/skills/cli-opencode/SKILL.md` | Modify | Update ALWAYS #13 |
| `.opencode/skills/sk-small-model/references/pattern-index.md` | Modify | Add row pointing at new permissions-matrix.md |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | permissions-matrix.schema.json validates as well-formed JSON Schema draft-2020-12 | `npx ajv compile -s schema.json` exits 0 |
| REQ-002 | 3 example matrices validate against the schema | `npx ajv validate -s schema.json -d example.json` exits 0 for all 3 |
| REQ-003 | RM-8 replay test: feed deepseek-v4-pro the original 2026-05-04 prompt with the packet-local matrix active; all 44 file deletions blocked at the gate | Test harness produces deletion-attempt count = 0 |
| REQ-004 | Runtime enforcer blocks tool calls outside the active matrix with a clear error | Manual smoke test: dispatch with read-only matrix + attempted Write blocked + error mentions matrix rule violated |

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | cli-opencode SKILL.md ALWAYS #13 updated; prose mitigation marked deprecated-but-supported | grep confirms updated wording |
| REQ-006 | sk-small-model pattern-index.md row added for the new permissions-matrix.md | grep confirms entry |
| REQ-007 | Reference doc explains schema fields + 3 example matrices + RM-8 walkthrough + migration path | manual review |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: RM-8 replay test blocks 44/44 deletions deterministically
- **SC-002**: Schema rejects overly-broad globs (`**`, `/*`) at validation time unless explicitly allowlisted
- **SC-003**: Existing cli-opencode dispatches without a matrix configured still work (backward compat)
- **SC-004**: Runtime enforcer overhead < 50ms per tool call (negligible)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Schema with `**` wildcard defeats the point | Critical — re-opens RM-8 class | 007-hardening-ci adds CI lint to reject; for now, document the smell in reference doc |
| Risk | Runtime enforcer adds latency to every tool call | Slows iter wall-clock | Benchmark <50ms; optimize via cached glob compile |
| Dependency | system-spec-kit deep-loop dispatch wrapper | Enforcer needs to hook here | Read existing post-dispatch-validate.ts for the analog pattern |
| Dependency | cli-opencode iter recipe | Must consume matrix path from config | Recipe gets a new optional `permissions_matrix` field |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Enforcer overhead < 50ms per tool call
- **NFR-P02**: Schema validation at recipe-load time < 200ms

### Security

- **NFR-S01**: Default-deny semantics — if matrix is malformed or missing, BLOCK (don't fail-open)
- **NFR-S02**: Enforcer error messages don't leak filesystem structure beyond the violated rule
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Empty matrix (no rules): default-deny — block all tool calls
- Multiple matching rules: most-specific wins (longest glob; allow > deny is NOT a valid resolution)
- Tool call to a symlink: resolve symlink first, then apply matrix
- Race condition during matrix reload: cache previous matrix until reload completes atomically
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Schema + 3 examples + ref doc + TS enforcer + SKILL.md edit |
| Risk | 15/25 | Touches runtime gate; default-deny semantics must be bulletproof |
| Research | 8/20 | Already done in 001 iter-009 |
| Coordination | 10/25 | Crosses skill + system-spec-kit boundaries |
| Reversibility | 10/15 | Pure additive; enforcer can be disabled via config flag |
| **Total** | **55/110** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Likelihood | Impact | Mitigation | Owner |
|---------|-------------|-----------|--------|------------|-------|
| R-001 | Schema with overly-broad glob (`**`) defeats the gate | M | Critical | Reference doc smell warning + PR review (no CI lint; Phase 007 deleted) | implementer + reviewer |
| R-002 | Default-deny breaks existing dispatches that don't have a matrix | H | Medium | Backward compat: matrix is OPTIONAL; absent matrix = fall back to four-layer prose | implementer |
| R-003 | Runtime enforcer crashes mid-dispatch | L | High | Default-deny on enforcer error (fail-safe); add try/catch + log | implementer |
| R-004 | Migration confusion (which dispatches use matrix vs prose) | M | Low | Reference doc has migration checklist | docs |
| R-005 | Symlink resolution loops | L | Medium | Use realpath() with depth cap | implementer |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

- **US-001 — As an operator** dispatching cli-opencode with `--dangerously-skip-permissions`, I want a structured allowlist to enforce my "don't touch outside packet X" intent so a single missed prompt-line doesn't cause an RM-8 repeat.
- **US-002 — As a maintainer** reviewing dispatch logs, I want every blocked tool call to log which matrix rule rejected it, so I can debug or expand the matrix scope confidently.
- **US-003 — As a PR reviewer**, I want overly-broad globs in committed matrices to be obvious during code review (reference doc has a smell warning section); a future CI lint may automate this but is out of scope today.
- **US-004 — As a new contributor**, I want the reference doc to explain the schema fields + show 3 worked examples + walk through the RM-8 counter-example so I understand WHY the matrix exists.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Should the enforcer hook into `post-dispatch-validate.ts` or a new sibling `pre-dispatch-validate.ts`?
- Schema field naming: `target_glob` vs `path_pattern` vs `scope_pattern`?
- Should matrices support `include` + `exclude` semantics (gitignore-style) or just allow + deny?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase parent**: `../spec.md`
- **Predecessor**: `../002-foundation-routing/spec.md` (must ship first)
- **Research**: `../001-research-smallcode/research/research.md` §RQ4 (permissions matrix patterns) + iter-009 (RM-8 walkthrough)
- **RM-8 incident doc**: `.opencode/skills/cli-opencode/references/destructive_scope_violations.md`
- **Sibling docs**: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md
