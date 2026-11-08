---
title: "Feature Specification: Phase 16: ci-red-check-repairs"
description: "Five CI workflows on main have been red since the DeepSeek Harness landed: a private command's DSH prompt was committed, a dispatch test passes only where dsh is installed, two playbooks break the operator contract, and two sk-doc frozen baselines predate the hooks folder reorganisation. This phase repairs all four causes."
trigger_phrases:
  - "ci red check repairs"
  - "phase 16 ci red check repairs"
  - "dsh prompt local stub untracked"
  - "dispatch test stub dsh path"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 16: ci-red-check-repairs

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-08 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 16 of 16 |
| **Predecessor** | 015-dsh-hook-parity |
| **Successor** | None |
| **Handoff Criteria** | Each of the four causes reproduces before its fix and passes after it locally, and the five workflows report on the pushed commit |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 16** of the DeepSeek Harness packet. Three of the four causes trace to the commit that added the harness, `6a24503322`; the fourth to the hooks folder reorganisation of 2026-11-07. The operator asked for every red check to be repaired, the `system-skilled-doctor` playbook included.

**Scope Boundary**: `.gitignore`, the untracked DSH prompt, one dispatch test, six lines across five playbook scenarios, and two sk-doc frozen baselines. No product code changes.

**Dependencies**:
- Phases 001 to 015, which produced the files repaired here.

**Deliverables**:
- Command Tree Parity, Dispatch Enforcement Guard, OpenCode Plugin Tests, Playbook Operator Contract and sk-doc Script Tests pass on the inputs that failed them.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.dsh/prompts/local-skilled-alignment.md` was committed although its source, the operator's private command, is gitignored, so CI and every new worktree reported it as an extra prompt. The dispatch test for a variable `DSH_HOME` resolves `dsh` on PATH, so it passes only on a machine with the harness installed. The DSH playbook bakes three dated run results into scenario truth and has a SKIP without a named blocker. The doctor playbook has two such SKIPs, which its own session fixes in worktree 324. The sk-doc durable-directory manifest misses the 143 hook adapter folders added on 2026-11-07, and the README verdict baseline pins a warning at a line that moved by one.

### Purpose
Main's CI reports only real problems, and a new worktree commits without tripping the mirror gate.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
# CI on 3a4e34734a, 2026-11-08:
Command Tree Parity      [dsh-prompt-sync] EXTRA .dsh/prompts/local-skilled-alignment.md
Dispatch Enforcement     not ok 36 - a variable directory with a literal patch file name and a variable DSH_HOME pass every dsh rule
OpenCode Plugin Tests    not ok 209 - the same test
Playbook Operator        FAIL cli-deepseek-harness violations=4; FAIL system-skilled-doctor violations=2
sk-doc Script Tests      FAIL test_readme_manifest.py; FAIL test_readme_verdict_parity.py (line 279 expected, 280 actual)
# Locally, without ~/.local/bin on PATH:
$ node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs
ℹ pass 46
ℹ fail 1
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Ignore `/.dsh/prompts/local-*` like every other runtime's private mirror, and untrack the committed stub.
- Give the dispatch test a stub `dsh` on a temporary PATH.
- Remove the dates from three recorded results and name the blocker in three SKIP rules.
- Refresh the durable-directory manifest and correct the one drifted verdict line.

### Out of Scope
- The two `system-skilled-doctor` playbook SKIPs - worktree 324 committed the same fix at 09:10 on 2026-11-08, with version bumps, so a second copy here would only conflict with it.
- Rewriting the whole README verdict baseline - `--write` would add 152 verdicts for READMEs added since it was frozen, any of which may differ on a runner, for a drift of one line number.
- The DSH prompt generator's symlink handling - with the stub untracked, a fresh worktree has nothing for it to report.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.gitignore` | Modify | `/.dsh/prompts/local-*` |
| `.dsh/prompts/local-skilled-alignment.md` | Untrack | Generated from a private source |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | Modify | Stub `dsh` on PATH |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/manual-testing-playbook/{fanout/deep-research-lineage,model-dispatch/llmgateway-route,patches/guards-patch-boot}.md` | Modify | Dates and one SKIP blocker |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/{durable-directory-manifest,baseline-readme-verdicts}.json` | Modify | Baselines |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No product behavior changes | The diff touches only the files in section 3 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The DSH prompt check passes in CI and in a fresh worktree | `sync-prompts-dsh.cjs --check` prints `PASS` with the provisioned private link present and no stub |
| REQ-003 | The dispatch test passes with and without `dsh` installed | `node --test dispatch-rule-checks.test.mjs` prints `fail 0` with `~/.local/bin` removed from PATH, where it printed `fail 1` |
| REQ-004 | The DSH playbook passes the operator contract | `validate-playbook-package.cjs --strict` reports `cli-deepseek-harness violations=0` |
| REQ-005 | Both sk-doc baselines reproduce | `test_readme_manifest.py` and `test_readme_verdict_parity.py` exit 0, and the full runner passes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The five workflows that failed on `3a4e34734a` pass on the pushed commit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Untracking the stub deletes it from checkouts on their next pull | Low: in a checkout that holds the private command, the pre-commit gate reports it missing | Rerun `sync-prompts-dsh.cjs` there; it writes the stub as an ignored file |
| Risk | The doctor playbook stays red until worktree 324 lands | Low: Playbook Operator Contract keeps one failing package | Its fix is committed there and waits for that session's push |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The operator chose this phase's location and its full scope on 2026-11-08.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
