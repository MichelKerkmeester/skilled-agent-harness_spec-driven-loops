---
title: "Feature Specification: Phase 40: dispatch-lint-held-fixes"
description: "Phase 039's sk-code review held ten dispatch-hook findings for the operator because fixing them changes behaviour: three P0 ways to run a CLI dispatch past the Pi authorization gate, four P1 rule-check and resolver gaps, and three P2 audit mismatches. The operator approved fixing all of them on 2026-10-21."
trigger_phrases:
  - "dispatch lint held fixes"
  - "phase 40 dispatch lint held fixes"
  - "pi dispatch authorization bypass"
  - "dispatch resolver every executor"
  - "heredoc script dispatch"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 40: dispatch-lint-held-fixes

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-10-21 |
| **Branch** | `worktrees/182-dispatch-lint-held-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 40 of 40 |
| **Predecessor** | 039-sk-code-opencode-alignment-audit |
| **Successor** | None |
| **Handoff Criteria** | Every b09 dispatch finding has a fix and a test that fails on the old code, the command corpus moves only where a finding says the old verdict was wrong, and CI passes at the pushed commit |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 40** of the OpenCode v1 and v2 dual compatibility specification. Phase 039 reviewed every plugin and hook file against sk-code and held 35 findings for the operator because each fix changes behaviour. On 2026-10-21 the operator chose to fix all 35. This phase takes the ten in the dispatch hooks; phases 041 and 042 take the goal files and the remaining hooks and plugins.

**Scope Boundary**: `.skilled/hooks/dispatch/lib/dispatch-audit.mjs`, `lib/dispatch-rule-checks.mjs`, `pi/dispatch-preflight-lint.ts`, the Claude, Codex and Devin dispatch adapters, their tests, the dispatch README where it describes the changed behaviour, the OpenCode `cli-dispatch-audit.js` call site if the resolver's return shape requires it, and this packet. `.opencode/hooks` is a symlink to `.skilled/hooks`, so the sources are edited once.

**Dependencies**:
- `../039-sk-code-opencode-alignment-audit/review.md` §3, which states each held finding, and `scratch/luna/confirm-b09-hooks-dispatch.txt`, Luna's confirmation with the suggested remedy.
- `../005-version-aware-guards/` and `../011-two-version-proof-and-closeout/`, whose v1 command corpus and wrapper list the regression check reuses.

**Deliverables**:
- One fix per finding, each with a test that fails on the pre-change engine.
- A before/after verdict comparison over the dispatch command corpus, with every moved verdict traced to a finding.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Pi preflight decides with `inspectDispatch`, which returns `none` for `echo "$(codex exec task)"` (its expansion check wants a print flag Codex does not have) and for wrapped calls such as `nohup opencode run ...` or `command codex exec task`, so those dispatches skip authorization and every hard rule. A negated or quoted `/deep:... --executor cli-X` mention counts as the user naming that executor. The shared resolver returns only the first dispatch in a chain, misses a script a heredoc writes and the same call runs, and the rule checks read flags and `</dev/null` inside a quoted prompt as real ones. `claude --model m -p` escapes the permission-mode check. The audit side records only what `inspectDispatch` calls direct, and the Codex and Devin audit adapters match the raw shape list, so a dispatch quoted inside heredoc data is logged.

### Purpose
Every dispatch the shell would run is classified, authorized and linted the same way by the preflight and the audit, and nothing a call only writes or quotes is read as a dispatch.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- b09-hooks-dispatch-006, N01, N02 (P0); 012, N03, N04, N05 (P1); N06, N07, N08 (P2), as stated in `039/review.md` §3.
- Tests for each, and the README and playbook lines that describe the behaviour this changes.

### Out of Scope
- The goal plugin and goal core findings, which phase 041 takes.
- The remaining hook and plugin findings, which phase 042 takes.
- Rules other than the ones the findings name; a check that reads raw text elsewhere stays as it is.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` | Modify | Codex in expansions, every dispatch in a chain, heredoc-run scripts, wrapper-aware audit matching |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | Modify | Permission-mode shape, quote-aware stdin and model checks |
| `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts` | Modify | Wrapper-aware inspection, positive unquoted deep-loop directive |
| `.skilled/hooks/dispatch/{claude,codex,devin}/*.mjs` | Modify | Lint every resolved dispatch; audit through the shared classifier |
| `.skilled/hooks/dispatch/**/*.test.*` | Modify | One failing-first test per finding |
| `.skilled/hooks/dispatch/README.md` | Modify | Only where it states the changed behaviour |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/040-dispatch-lint-held-fixes/` | Create | This packet |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/spec.md` | Modify | Phase map row and handoff row for 040 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A Codex dispatch inside a command substitution is not `none` (006). | `inspectDispatch('echo "$(codex exec task)"')` is not `none`, and the Pi preflight denies it; the test fails on the old engine. |
| REQ-002 | A wrapped dispatch reaches Pi authorization and lint (N01). | `command codex exec task` and `nohup opencode run ...` are denied without a user naming the executor and linted when one does; the test fails on the old code. |
| REQ-003 | Only a positive, unquoted, unnegated deep-loop directive authorizes (N02). | A negated or quoted `/deep:... --executor cli-X` mention does not authorize; a plain one still does. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | `claude` with flags before `-p` is checked for permission mode (012). | `claude --model sonnet -p "x"` violates the rule; the bypass forms still pass. |
| REQ-005 | Every dispatch in a chain is linted (N03). | A command whose second dispatch breaks its own packet's rule reports that violation. |
| REQ-006 | Flags and redirects inside a quoted prompt do not satisfy the stdin and model checks (N04). | `opencode run "--model p/m </dev/null"` violates both; a real flag or redirect, also inside a `bash -c` payload, still passes. |
| REQ-007 | A script a heredoc writes and the same call runs is resolved (N05). | `cat > f.sh <<'EOF'` with a dispatch, then `bash f.sh`, resolves to that dispatch; a heredoc that is only written still does not. |
| REQ-008 | The audit records what the preflight resolves (N06, N07, N08). | A wrapped dispatch is audited; a dispatch quoted only in heredoc data is not, under Codex and Devin. |
| REQ-009 | No other verdict moves. | The corpus comparison lists only commands a finding names. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each of the ten findings has a test that fails on the pre-change engine and passes after.
- **SC-002**: The hook, plugin and battery suites are at or above their starting counts, and CI passes at the pushed commit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A broader classifier refuses a call that dispatches nothing | High | The corpus comparison over 260 commands from the suites; every moved verdict is traced to a finding |
| Risk | Linting every dispatch in a chain doubles a violation | Low | Violations are de-duplicated by rule id |
| Dependency | Luna's usage limit | Med | Wait and retry; no change ships unverified |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator approved every behaviour change on 2026-10-21.
<!-- /ANCHOR:questions -->

---
