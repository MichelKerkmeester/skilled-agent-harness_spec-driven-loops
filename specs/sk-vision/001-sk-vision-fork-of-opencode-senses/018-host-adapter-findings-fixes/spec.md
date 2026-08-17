---
title: "Feature Specification: Fix the five sk-vision host-adapter findings"
description: "Implement the deep-research recommendations: tolerant base64 decode, OCR task guard, settings passthrough, plus OCR/Cursor-env and cli-cursor/cli-devin MCP docs."
trigger_phrases:
  - "sk-vision host-adapter findings fixes"
  - "sk-vision base64 padding fix"
  - "sk-vision ocr task guard"
  - "sk-vision settings passthrough"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/018-host-adapter-findings-fixes"
    last_updated_at: "2026-08-17T20:30:00.000Z"
    last_updated_by: "claude"
    recent_action: "DeepSeek Flash fixed all 5 findings across 3 phases; Claude verified."
    next_safe_action: "Commit the packet on v4."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/018-host-adapter-findings-fixes/spec.md"
      - ".opencode/skills/sk-vision/vision-runtime/python/runtime.py"
      - ".opencode/skills/sk-vision/vision-runtime/src/providers/types.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-018-host-adapter-findings-fixes"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Fix the five sk-vision host-adapter findings

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-17 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `specs/sk-vision/001-sk-vision-fork-of-opencode-senses` |
| **Predecessor** | `017-cursor-devin-testing-playbook` |
| **Successor** | N/A |
| **Handoff Criteria** | The three real bugs (base64 decode, OCR task guard, settings passthrough) are fixed with tests; the four doc gaps (OCR model, Cursor env, cli-cursor/cli-devin MCP) are documented; runtime tests + skill package green. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This packet implements the `048` deep-research §6 plan. The 10-iteration DeepSeek V4 Flash research root-caused five host-adapter findings; three are real code bugs and three are documentation/contract gaps. Implementation is dispatched to DeepSeek V4 Flash (cli-pi, OpenRouter, max thinking) and verified here.

**Scope Boundary**: the sk-vision `vision-runtime` (`runtime.py`, `types.ts`, `photon.ts`, `tools.ts`), sk-vision `SKILL.md` + `hooks/README.md`, and the `cli-cursor`/`cli-devin` `SKILL.md`. No MCP-server or adapter contract changes.

**Deliverables**: fixed runtime + updated docs across three phases.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Three real bugs: (F5a) `runtime.py::_resolve_image` uses strict `base64.b64decode`, so unpadded/URL-safe data URLs raise `Incorrect padding`; (F3a) `handle_ocr` never calls `_require_task("ocr")`, so the OCR-incapable default `moondream2` returns silent garbage instead of failing loud; (F5b) the TS layer (`types.ts`/`photon.ts`/`tools.ts`) drops `settings`, so `max_tokens`/`temperature` cannot reach the model even though the Python runtime accepts them. Three doc gaps: (F3b) OCR needs a Moondream 3.x checkpoint; (F4) Cursor honors per-server env only from its own `.cursor/mcp.json` scope; (F1) cli-cursor's non-interactive MCP path is `--approve-mcps`; (F2) cli-devin's non-interactive MCP path is a `permissions.allow` allowlist, not `dangerous`.

### Purpose
Land the three code fixes (with tests) and the four documentation fixes so the sk-vision host adapters are correct and their operational contracts are documented.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Phase 1 (code):** F5a tolerant base64 decode; F3a `_require_task("ocr")` in `handle_ocr`; F5b `settings` passthrough across `types.ts` + `photon.ts` + `tools.ts` — with runtime tests.
- **Phase 2 (sk-vision docs):** F3b OCR-model guidance + F4 Cursor env-scope in `SKILL.md` / `hooks/README.md`.
- **Phase 3 (cli docs):** F1 `--approve-mcps` recipe in `cli-cursor/SKILL.md`; F2 `permissions.allow` MCP contract in `cli-devin/SKILL.md`.

### Out of Scope
- The moondream3-preview digit-doubling artifact (model-quality; documented, not fixed).
- MCP server / adapter contract changes; new tools.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-vision/vision-runtime/python/runtime.py` | Update | 1 | tolerant base64 (F5a) + `_require_task("ocr")` (F3a) |
| `.opencode/skills/sk-vision/vision-runtime/src/providers/types.ts` | Update | 1 | `settings?` on Query/OCR/Scene requests |
| `.opencode/skills/sk-vision/vision-runtime/src/providers/photon.ts` | Update | 1 | forward `settings` in query/ocr/scene payloads |
| `.opencode/skills/sk-vision/vision-runtime/src/opencode/tools.ts` | Update | 1 | optional `settings` arg on `sk_vision_ocr` + `sk_vision_inspect` |
| `.opencode/skills/sk-vision/vision-runtime/python/runtime.test.ts` (+ `photon.test.ts`) | Update | 1 | base64 + settings-passthrough coverage |
| `.opencode/skills/sk-vision/SKILL.md`, `hooks/README.md` | Update | 2 | OCR model (F3b) + Cursor env-scope (F4) |
| `.opencode/skills/cli-external-orchestration/cli-cursor/SKILL.md` | Update | 3 | `--approve-mcps` recipe (F1) |
| `.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md` | Update | 3 | MCP `permissions.allow` contract (F2) |

### Verification evidence
- Phase 1: `python3 -c` proves `base64.b64decode('iVBORw0KGgo')` fails before and the new decode path succeeds; `handle_ocr` raises for a non-OCR model; `settings` reaches the Python payload; `tsc`/runtime tests green.
- Phases 2-3: grep confirms each documented recipe/contract is present; skill package `--check` PASS.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Tolerant base64 (F5a) | Unpadded + URL-safe data URLs decode; a clear error names the param on true corruption |
| REQ-002 | OCR task guard (F3a) | `handle_ocr` raises when the model lacks `ocr`, mirroring `handle_segment` |
| REQ-003 | Settings passthrough (F5b) | `settings` flows tools.ts → photon.ts → Python for query/ocr/scene |
| REQ-004 | Tests green | Runtime + provider tests pass; `tsc` clean |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P1 | Doc gaps closed | OCR-model, Cursor-env, cli-cursor, cli-devin recipes documented; package `--check` PASS |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [x] F5a tolerant base64 lands. Evidence: `runtime.py` diff + fail-then-pass probe.
- [x] F3a OCR guard lands. Evidence: `runtime.py` line 478.
- [x] F5b settings passthrough lands (3 files). Evidence: `tools.ts` diff; `tsc` 0.
- [x] Runtime tests + `tsc` green. Evidence: provider/server 6/6; runtime 3/3; `tsc` 0.
- [x] F3b/F4/F1/F2 docs land; package PASS. Evidence: grep + `validate_skill_package.py` PASS.
- [ ] Changes committed on v4. Evidence: pending the commit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Small-model dispatch mis-edits a fix | Wrong or incomplete change | Precise per-file instructions; verify each with tests before proceeding |
| Risk | Settings type shape drift | `tsc` break | Mirror the existing optional-field pattern; run `tsc` |
| Dependency | `048` research §6 | The fix spec | Landed + pushed; this packet implements it |
<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

### Answered Questions
- **Q**: Who implements? **A**: DeepSeek V4 Flash (cli-pi, OpenRouter, max thinking); Claude verifies (no Claude agents for implementation).
- **Q**: Fix the moondream3 doubling? **A**: No — a preview-model sampling artifact; documented under F3b, not fixed.

### Open Questions
- None.
<!-- /ANCHOR:questions -->
