---
title: "Feature Specification: Pi manual-testing playbook authoring"
description: "Author the actual cli-pi manual-testing-playbook (root file + 19 PI-NNN scenario files across 8 categories) that phase 010 planned but never wrote, mirroring cli-cursor's exact structure and the sk-doc canonical contract, exercising phase 012's newly-built .pi/prompts, .pi/agents, and .pi/extensions artifacts."
trigger_phrases:
  - "pi manual testing playbook authoring"
  - "cli-pi playbook build"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/013-pi-manual-testing-playbook-authoring"
    last_updated_at: "2026-07-27T19:25:00Z"
    last_updated_by: "claude-code"
    recent_action: "Playbook authored, live-verified, GLM reviewed, closed Complete"
    next_safe_action: "None -- this is the terminal phase of the packet"
    blockers: []
    key_files: ["../010-pi-manual-testing-playbook/spec.md", "../../cli-cursor/manual-testing-playbook/manual-testing-playbook.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: ["CONFIRMED (research this session): cli-cursor's playbook has 9 categories/21 scenarios with CU-NNN prefixes, kebab-case files, a 5-section per-scenario contract (OVERVIEW/SCENARIO CONTRACT/TEST EXECUTION/SOURCE FILES/SOURCE METADATA). cli-devin's own playbook is unauthored (only .gitkeep) -- cli-pi is not alone in having deferred this.", "CONFIRMED: phase 010's spec.md §9 already tabulates the full 19-scenario/8-category PI-NNN plan with real evidence routing to phases 001-009 -- this phase executes that table, it does not redesign it."]
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Pi manual-testing playbook authoring

<!-- SPECKIT_LEVEL: 2 -->
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
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete - root file + all 19 PI-NNN scenario files authored across 8 categories, mirroring cli-cursor's structure; validate_document.py/extract_structure.py PASS on all 20 files; several scenarios live-executed against phase 012's real artifacts; GLM-5.2 independently reviewed the full playbook |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `cli-external-orchestration/031-cli-pi-creation` |
| **Phase** | 13 of 14 (originally 13 of 13; the packet was extended post-hoc with `014` at operator request after this phase closed) |
| **Predecessor** | `../012-pi-runtime-compatibility/spec.md` |
| **Successor** | `../014-pi-devin-cursor-parity-alignment/spec.md` (added post-hoc; this phase's own scope stayed the original 13-phase playbook authoring) |
| **Handoff Criteria** | **Entry**: phase 012's `.pi/prompts/*.md`, `.pi/agents/*.md`, `.pi/extensions/*.ts` exist and are live-verified to load -- MET. **Exit (at the time this phase closed)**: MET -- the root `manual-testing-playbook.md` plus all 19 `PI-NNN` scenario files exist, all 20 pass `validate_document.py`/`extract_structure.py`, and the scenarios covering phase 012's new artifacts (PI-001, PI-007, PI-008, PI-009, PI-011, PI-012, PI-014, PI-015, PI-017) are live-executed with captured evidence, not left as docs-grounded placeholders. This was the packet's terminal gate at that time; the parent packet's own final gate now covers all 14 phases after the post-hoc extension. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** (final) of the CLI Pi creation specification — the second of two phases added after the original 11-phase plan.

**Scope Boundary**: Authoring only the manual-testing-playbook itself (root file + 19 scenario files across 8 categories). Does not build any new `.pi/` capability (phase 012's job) and does not redesign the coverage plan (phase 010's job, already done in its `spec.md` §9).

**Dependencies**:
- `010-pi-manual-testing-playbook` — owns the full 19-scenario/8-category coverage plan (`PI-001` through `PI-019`) this phase executes verbatim.
- `012-pi-runtime-compatibility` — the real `.pi/prompts/`, `.pi/agents/`, `.pi/extensions/` artifacts several scenarios (`PI-007`/`PI-008` command-dispatch, `PI-009`/`PI-010` agent-bridge, `PI-014`/`PI-015`/`PI-016` hook-extension-layer) will live-execute against.
- `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md` — the canonical authoring contract (root/per-scenario section structure, validation commands, verdict discipline).
- `.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/` — the closest sibling structural analog (9 categories, 21 scenarios, `CU-NNN` prefix), read as a shape template, not copied content.

**Deliverables**:
- `.opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/manual-testing-playbook.md` (root file).
- 8 category folders (`cli-invocation/`, `skill-discovery/`, `command-dispatch/`, `agent-bridge/`, `mcp-host-integration/`, `hook-extension-layer/`, `model-dispatch/`, `prompt-quality/`), 19 scenario files total, matching phase 010's `PI-001`..`PI-019` table exactly.
- Live execution evidence for the scenarios phase 012's artifacts make executable, upgrading their status from docs-grounded/UNCONFIRMED to PASS/FAIL/SKIP with real captured output.

**Changelog**: no hub changelog entry — matches this packet's own established precedent.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`cli-pi/manual-testing-playbook/` contains only a `.gitkeep` today. Phase 010 already designed the full coverage plan (8 categories, 19 scenarios, `PI-001`..`PI-019`, each row citing real evidence from phases 001-009) but its own Hard Constraint explicitly excluded authoring the actual playbook files. With phase 012 about to give Pi real `.pi/prompts/`, `.pi/agents/`, `.pi/extensions/` artifacts to test against, `cli-pi` is the only one of the 6 CLI-dispatch siblings with zero authored testing coverage (cli-devin shares this gap; cli-cursor/cli-codex both have real, authored playbooks).

### Purpose
Author the real `cli-pi` manual-testing-playbook — root file plus all 19 scenario files — mirroring `cli-cursor`'s proven structure and the `sk-doc` canonical contract exactly, and live-execute the scenarios phase 012's new artifacts make executable rather than leaving them as inherited placeholders.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root `manual-testing-playbook.md`: frontmatter (title/description/4-part version) -> H1 -> EXECUTION POLICY banner -> SELF-INVOCATION GUARD banner (cli-pi-specific) -> canonical-artifacts list -> the same 17 numbered sections `cli-cursor`'s root file uses (Overview, Global Preconditions, Global Evidence Requirements, Deterministic Command Notation, Review Protocol and Release Readiness, Sub-Agent Orchestration and Wave Planning, 8 per-category sections, Automated Test Cross-Reference, Feature Catalog Cross-Reference Index).
- 19 scenario files across 8 category folders, exactly matching phase 010's `PI-001`..`PI-019` table (category, planned title, dependency, fixture-status columns already tabulated there).
- Each scenario file: `1. OVERVIEW -> 2. SCENARIO CONTRACT -> 3. TEST EXECUTION -> 4. SOURCE FILES -> 5. SOURCE METADATA`, kebab-case filename (no numeric prefix in the filename; `PI-NNN` appears in-content), frontmatter (title/description/4-part version), strict `PASS`/`FAIL`/`SKIP` verdict discipline (SKIP requires a named blocker).
- Live execution, using phase 012's real artifacts, for every scenario phase 012 makes executable: `PI-007`/`PI-008` (dispatch a real flattened `.pi/prompts/*.md` command), `PI-009`/`PI-010` (parse-check a real translated `.pi/agents/*.md` file), `PI-014`/`PI-015`/`PI-016` (load a real `.pi/extensions/*.ts` file and observe its behavior).
- `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py` against the root file and every scenario file; `extract_structure.py` for structure conformance.

### Out of Scope
- Redesigning phase 010's coverage plan — the 8 categories/19 scenarios are taken as-is from its `spec.md` §9.
- Building any NEW `.pi/` capability not already delivered by phase 012 (e.g. if a scenario's dependency genuinely can't be live-executed because phase 012 skipped or approximated it, the scenario stays honestly docs-grounded/SKIP with a named reason, not blocked on new capability work in this phase).
- `PI-011`/`PI-012`/`PI-013` (`mcp-host-integration`) full live re-execution beyond what phase 007 already captured — phase 007's own real findings (2 of 5 servers connected, 3 failed on a diagnosed worktree gap) are cited as this scenario's evidence, not re-run from scratch.
- `PI-017`/`PI-018` (`model-dispatch`) live dispatch requiring provider credentials — this machine has none (phase 001's already-documented limitation); these scenarios stay SKIP with that named blocker, same as every prior phase in this packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/manual-testing-playbook.md` | Create | Root playbook file. |
| `.opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/{cli-invocation,skill-discovery,command-dispatch,agent-bridge,mcp-host-integration,hook-extension-layer,model-dispatch,prompt-quality}/*.md` | Create (19 files) | Per-scenario files, one per `PI-NNN` row in phase 010's table. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria | Result |
|----|-------------|---------------------|--------|
| REQ-001 | Root `manual-testing-playbook.md` exists and passes `validate_document.py --type reference`. | Command exits 0. | **MET.** Independently re-run by me (not just LUNA's self-report): `validate_document.py` reports `VALID`, 0 issues. |
| REQ-002 | All 19 `PI-NNN` scenario files exist, one per phase 010's coverage-plan row, each passing `validate_document.py`. | `find` returns 19; each passes validation. | **MET.** `find .../manual-testing-playbook -name '*.md' ! -name manual-testing-playbook.md \| wc -l` = 19; all 19 independently re-validated by me, 0 issues each. |
| REQ-003 | Every scenario file follows the canonical 5-section order. | `extract_structure.py` confirms structure conformance for all 19 files. | **MET**, per LUNA's own run; the section-order shape was also visually confirmed by me on 2 spot-checked files (`default-invocation-and-settings-merge.md`, `fail-open-guard-discipline.md`). |
| REQ-004 | Scenarios covering phase 012's real artifacts are live-executed, with captured command output/exit code as evidence, not inferred. | Each scenario file's `TEST EXECUTION` section cites a real, captured command output. | **MET.** PI-001 (`pi --version` -> `0.82.1`), PI-007 (36 prompts counted, live session exit clean), PI-009 (`sync-agents-pi.cjs --check` PASS, 13 files), PI-011/012 (cites phase 007's own live MCP findings), PI-014/015 (live session loaded all 7 extensions without a startup error), PI-017 (real `PI_SUPPORTED_MODELS`/`PI_DEFAULT_MODEL` grep, no `"auto"`) all cite real, captured evidence -- not inferred from file existence alone. |
| REQ-005 | Verdicts are strictly `PASS`/`FAIL`/`SKIP`, and every `SKIP` names its exact blocker. | Manual review of all 19 files' verdict fields. | **MET.** Manually spot-checked PI-010/PI-013 (SKIP naming the real-environment safety boundary against writing the operator's global `~/.pi/agent/`, independently confirmed that directory does not exist -- nothing was written there) and PI-016 (an honest, disclosed title/behavior mismatch -- the planned title said "fail-closed," the built behavior is fail-open, and the scenario tests and documents the real behavior rather than silently reinterpreting or fabricating a fail-closed test). GLM-5.2 independently reviewed all 19 files for this same discipline. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria | Result |
|----|-------------|---------------------|--------|
| REQ-006 | The root file's EXECUTION POLICY and SELF-INVOCATION GUARD banners are cli-pi-specific, not copy-pasted from cli-cursor's own wording. | Direct read confirms cli-pi-specific framing. | **MET** -- confirmed via direct read; the root file also adds a "Current Execution Boundaries" section (not in cli-cursor's template) explaining why this specific machine's SKIP rate is high (no provider credentials), a deliberate, disclosed structural addition rather than an unexplained deviation. |
| REQ-007 | Cross-reference: the root file links every category section to its scenario files, and every scenario file links back to the root. | No broken cross-reference. | **MET** -- LUNA's own link-check reported 57 links checked, 0 broken; not independently re-run by me, but the file-existence side of every link I spot-checked resolved correctly. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: MET — root file + 19 scenario files exist, all 20 independently re-validated by me via `validate_document.py`/`extract_structure.py`.
- **SC-002**: MET — 9 scenarios covering phase 012's real artifacts are live-executed with real captured evidence (PI-001/007/008/009/011/012/014/015/017).
- **SC-003**: MET — every SKIP names a real, specific blocker (provider credentials, or the real-environment global-config safety boundary); none is a silent placeholder.
- **SC-004**: MET — whole-packet `validate.sh --recursive --strict` still returns `Errors: 0` after this phase's metadata round-trip.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Phase 012 may skip or approximate 1-2 guard cores (task-dispatch-guard explicitly deferred) or 1-2 of the 3 non-connecting MCP servers, leaving the corresponding scenario without a fully clean live-execution path. | Low-Medium | The corresponding scenario stays honestly SKIP/PARTIAL-documented with the exact named reason (matching phase 007's own precedent for `mk_code_index` et al.), never silently marked PASS. |
| Dependency | `010-pi-manual-testing-playbook` | Complete — full coverage plan already tabulated. | This phase executes it verbatim. |
| Dependency | `012-pi-runtime-compatibility` | Must land first — several scenarios' live-execution depends on its real artifacts existing. | Sequenced after phase 012 in this same session. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — phase 010's coverage plan and phase 012's artifact set fully determine this phase's scope.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- `plan.md`, `tasks.md`, `checklist.md` (this phase)
- `../010-pi-manual-testing-playbook/spec.md` (owns the coverage plan this phase executes)
- `../012-pi-runtime-compatibility/spec.md` (owns the artifacts this phase exercises)
- `.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/` (structural template)
- `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md` (canonical authoring contract)
