---
title: "Feature Specification: Hand-over doc alignment: fix the 58 findings of the doc alignment run and add vibe to the loop shell shim"
description: "A check of all 83 hand-over docs against the code on main found 58 statements that no longer hold, most about Vibe, history lookup and agent-session test commands. This packet fixes the 45 outside the READMEs worktree 411 rewrites, sends the other 13 to that worktree, and adds vibe to the loop shell shim."
trigger_phrases:
  - "handover doc alignment"
  - "hand-over doc alignment fixes"
  - "vibe skilled-loop shell shim"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Hand-over doc alignment: fix the 58 findings of the doc alignment run and add vibe to the loop shell shim

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-16 |
| **Branch** | `worktrees/424-handover-doc-alignment` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The operator asked for every doc, md file and README on the session hand-over to match the current logic. A `/local-doc-alignment session-handover` run reviewed 83 docs with DeepSeek Flash lanes and a critic and recorded 58 findings: 1 P0, 23 P1 and 34 P2. They cluster on Vibe (described as gated, never arming or missing from runtime and flag lists), on history lookup (still described as offered at compaction) and on playbook test commands that fail in an agent session.

### Purpose
Every finding is fixed in the doc that states it, or handed to worktree 411 where that worktree rewrites the doc. A plain `vibe` launch runs under the loop like the other runtimes.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/commands/assets/local-skilled-alignment/aggregate-findings.cjs --run-dir ~/.local/state/local-doc-alignment/Skilled/20261116T053904Z --map .skilled/commands/assets/local-doc-alignment/doc-map.yaml
STATUS=OK aggregate-findings: findings=58 P0=1 P1=23 P2=34 inferred=0 outside_scope=0 overturned=0 problems=0

$ grep -n -i vibe .skilled/bin/skilled-loop-shell.sh
(no output)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fix the 45 findings in docs outside the seven READMEs worktree 411 rewrites, each through DeepSeek V4.1 Flash at max.
- Add `vibe` to `skilled-loop-shell.sh` (resolver, subcommand and flag pass-through lists, launch function) with shim test cases.
- Update the hop-recall harness to the history CLI's current path.
- Send the 13 findings in 411's rewritten READMEs to that session with their evidence.
- Review the whole change with a fresh Opus medium agent and fix what it confirms.

### Out of Scope
- The seven READMEs 411 rewrites (44 to 531 changed lines each). Editing them here would conflict with that rewrite.
- A full review of the nine docs the timed-out lane never read. The critic covered four of their findings, and a rerun is a separate request.
- Clearing `AI_SESSION_CHILD` inside the Codex, Pi and OpenCode test sandboxes. The docs give the working command instead.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/skilled-loop-shell.sh` | Modify | Wrap `vibe` |
| `.skilled/hooks/session-handover/tests/skilled-loop-shell.test.cjs` | Modify | Vibe interactive and pass-through cases |
| Hand-over docs in the spec-kit playbook and catalog, cli-mistral-vibe, runtime READMEs, hooks docs and commands | Modify | Fix the 45 findings |
| `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/001-hop-recall-baseline/scratch/harness/hop-recall.sh` | Modify | Current history CLI path |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every finding fixed here is either fixed in its doc or shown wrong by the code | Each of the 45 findings is fixed, or its NOT FIXED reason is confirmed against the code |
| REQ-002 | A plain `vibe` launch in a shell that sources the shim runs under skilled-loop | `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-handover/tests/skilled-loop-shell.test.cjs` passes with the Vibe cases |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The 13 findings in 411's rewritten READMEs reach that session | The message is delivered to the 411 session |
| REQ-004 | A fresh Opus medium review finds no unfixed P0 or P1 | The review result and the fixes for what it confirmed are recorded |
| REQ-005 | No unrelated file changes | `git diff --stat` lists only the scoped docs, the shim, its test, the harness and this packet |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The 45 findings are fixed or refuted with code evidence, and the shim suite passes with Vibe cases.
- **SC-002**: The handover, OpenCode plugin and drift-guard checks pass on the final tree.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Worktree 411 rewrites seven hook READMEs | Those findings land only when 411 applies them | They went to 411 with evidence; 424 leaves those files alone |
| Risk | A model-written fix states something new that is also wrong | A doc trades one false claim for another | A fresh Opus medium review reads every changed line against the code |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: docs and a shell shim, no service.

### Security
- **NFR-S01**: The shim still wraps only a trusted wrapper from the checkout that owns it; the Vibe addition reuses `skilled_loop_launch` unchanged.

### Reliability
- **NFR-R01**: A Vibe subcommand or flag that does not open a session (`mcp`, `config`, `update`, `-p`, `--version`) runs Vibe directly, never through the loop.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a bare `vibe` opens an interactive session and is wrapped.
- Maximum input: a prompt word after the first argument that matches a subcommand stays a prompt, as for the other runtimes.
- Failure path: a finding the code refutes is left unchanged and reported with its evidence.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | About 24 docs, one shell shim and its test |
| Risk | 8/25 | Docs plus a shim change covered by its suite |
| Research | 8/20 | Each finding is verified against the code before its fix |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
