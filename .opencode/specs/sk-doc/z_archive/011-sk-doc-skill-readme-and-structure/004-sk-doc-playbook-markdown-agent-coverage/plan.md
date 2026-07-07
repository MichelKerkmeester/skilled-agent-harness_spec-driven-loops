---
title: "Implementation Plan: sk-doc playbook markdown-agent coverage"
description: "Plan for authoring SD-018/019/020 scenarios and executing the @markdown agent across cli-claude-code, cli-codex, and cli-opencode."
trigger_phrases:
  - "sk-doc playbook markdown agent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/z_archive/082-sk-doc-skill-readme-and-structure/004-sk-doc-playbook-markdown-agent-coverage"
    last_updated_at: "2026-05-11T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored Level 2 plan"
    next_safe_action: "Author scenario files and execute"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "102-004-sk-doc-playbook-markdown-agent-coverage"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: sk-doc playbook markdown-agent coverage

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + YAML frontmatter + shell dispatch |
| **Framework** | sk-doc manual testing playbook (custom format) |
| **Storage** | Filesystem only |
| **Testing** | Manual execution; verdicts captured into evidence transcripts |

### Overview
Author 3 scenario files following the existing SD-010 shape, replace the routing-trace Setup block with real CLI dispatch, execute sequentially, and persist transcripts as evidence. Use `/create:changelog` for a stub skill `sk-test-dummy` as the common task across all 3 CLIs so verdicts are comparable.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Spec is signed off (Status: Active).
- [ ] All 3 named CLIs are installed and authenticated.
- [ ] `@markdown` agent is reachable (verified by `ls .opencode/agents/markdown.md` + per-runtime mirrors).

### Definition of Done
- [ ] All P0 checklist items marked `[x]` with evidence.
- [ ] All P1 checklist items marked `[x]` or carry user-approved deferral.
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh --strict <004-folder>` exits 0.
- [ ] `implementation-summary.md` filled with results table.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Scenario-as-evidence: each scenario is a self-contained markdown file with YAML frontmatter and a runnable Setup block. The Setup block is the test harness. Evidence is the verbatim CLI transcript.

### Key Components
- **Scenario file**: declarative contract + executable Setup block. Format mirrors SD-010 with `execution_mode: dispatch_real` added.
- **Evidence file**: plain-text transcript of the scenario's CLI run, persisted under `004/evidence/`.
- **Index update**: `manual_testing_playbook.md` registers the new section in Categories + Scenario Index + Global Preconditions.

### Data Flow
1. Scenario file declares prompt + expected outcome.
2. Executor (Claude Code session) reads the Setup block and dispatches the named CLI verbatim.
3. CLI returns transcript including routing trace + final output.
4. Executor scores against playbook §Pass/Fail Grading.
5. Executor writes the transcript + verdict line into the evidence file.
6. `implementation-summary.md` aggregates the 3 verdicts into a single table.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Verify `@markdown` agent files exist in all 4 runtime mirrors.
- [ ] Verify `/create:changelog` command is reachable.
- [ ] Decide stub skill name (`sk-test-dummy`) and version (`v0.1.0`).

### Phase 2: Authoring
- [ ] Author SD-018 (cli-claude-code).
- [ ] Author SD-019 (cli-codex).
- [ ] Author SD-020 (cli-opencode + DeepSeek v4 Pro direct API).
- [ ] Update `manual_testing_playbook.md`: preamble fix + Categories row + Scenario Index block + Global Preconditions note.

### Phase 3: Execution
- [ ] Run SD-018; capture transcript to `evidence/SD-018-cli-claude-code.txt`.
- [ ] Run SD-019; capture transcript to `evidence/SD-019-cli-codex.txt`.
- [ ] Run SD-020; capture transcript to `evidence/SD-020-cli-opencode.txt`.

### Phase 4: Verification
- [ ] Score each transcript using playbook §Pass/Fail Grading.
- [ ] Populate `implementation-summary.md` with the 3-row results table.
- [ ] Run `validate.sh --strict` against this folder.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:dispatch -->
## 5. CLI DISPATCH SHAPES

| CLI | Invocation skeleton | Memory hints |
|-----|---------------------|--------------|
| cli-claude-code | `claude --model claude-opus-4-7 "<prompt>" </dev/null` | Foreground OK; capture transcript via `tee`. |
| cli-codex | `codex exec -c service_tier="fast" -c sandbox_workspace_write.network_access=true "<prompt>" </dev/null` | `service_tier="fast"` and network-access flags both required (memory). |
| cli-opencode | `opencode run --pure --model deepseek/deepseek-v4-pro --variant high --agent general --format json --dir <repo> "<prompt>" </dev/null` | `--pure` mandatory for DeepSeek; `</dev/null` mandatory when redirecting stdout. |

### Common prompt across all 3 scenarios
```
Use the @markdown agent to scaffold a v0.1.0 changelog for a stub skill named sk-test-dummy via /create:changelog. Write the result to /tmp/sk-test-dummy-CHANGELOG-<cli>.md. Do NOT install the stub skill into the .opencode/skills/ tree. Report which agent received the work, which sk-doc resources were loaded, and the changelog sections produced.
```
<!-- /ANCHOR:dispatch -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | 3 CLI dispatches + transcript review | named CLI binaries |
| Routing-trace audit | Confirm `@markdown` was invoked (not direct sk-doc) | grep on transcript |
| Output shape | Changelog has Added/Changed/Fixed/Removed sections | grep + diff against `assets/changelog_template.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `@markdown` agent in 4 runtime mirrors | Internal | Green | All 3 scenarios fail. |
| `/create:changelog` command | Internal | Green | Scenario task unrunnable; pick alternate. |
| DeepSeek v4 Pro provider auth | External | Yellow | SD-020 records SKIP if missing. |
| cli-claude-code binary `claude` | External | Green | SD-018 records SKIP if missing. |
| cli-codex binary `codex` | External | Green | SD-019 records SKIP if missing. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

- **Trigger**: Playbook index becomes inconsistent; scenarios fail to parse.
- **Procedure**: `git restore .opencode/skills/sk-doc/manual_testing_playbook/manual_testing_playbook.md` and `rm -rf .opencode/skills/sk-doc/manual_testing_playbook/06--agent-dispatch/`. The 004 spec folder remains for re-attempt.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## 9. PHASE DEPENDENCIES

| Phase | Depends On | Provides | Notes |
|-------|-----------|----------|-------|
| Phase 1: Setup | 003-markdown-agent-rename (Complete) | `@markdown` agent + `/create:*` reachability | Verification only; no writes. |
| Phase 2: Implementation (authoring) | Phase 1 | 3 scenario files + playbook index updates | All writes localized to `06--agent-dispatch/` + `manual_testing_playbook.md`. |
| Phase 3: Execution | Phase 2 | 3 evidence transcripts | Sequential (not parallel) per CLI-reliability memory. |
| Phase 4: Verification | Phase 3 | Verdicts + `implementation-summary.md` + strict-validate pass | Closes the packet. |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 10. EFFORT ESTIMATION

| Activity | Estimate | Drivers |
|----------|----------|---------|
| Phase 1: Setup verification | 5 min | Direct `ls`/`grep` checks. |
| Phase 2: Author 3 scenarios + index update | 30 min | One author pass; mirror SD-010 shape. |
| Phase 3: Sequential CLI dispatches | 15 min | ~5 min per CLI: dispatch + capture. |
| Phase 4: Grading + summary fill + validate | 10 min | Manual scoring; one validate run. |
| **Total** | **~60 min** | Single-session execution. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## 11. ENHANCED ROLLBACK

### Failure Modes & Rollback Triggers

| Failure Mode | Trigger | Rollback Action |
|--------------|---------|-----------------|
| Playbook index corruption | `manual_testing_playbook.md` fails markdown parsing or grep checks return unexpected counts | `git restore .opencode/skills/sk-doc/manual_testing_playbook/manual_testing_playbook.md` |
| Scenario file malformed | YAML frontmatter parser rejects scenario file | `rm <scenario>.md` and re-author from SD-010 template |
| Section-folder pollution | Unexpected files appear under `06--agent-dispatch/` (e.g., evidence persisted to the wrong root) | `rm -rf .opencode/skills/sk-doc/manual_testing_playbook/06--agent-dispatch/` and re-author |
| CLI dispatch produces unsafe writes | Evidence shows `@markdown` wrote into `.opencode/skills/` proper (violates NFR-S02) | Revert the offending writes via `git restore`, capture the violation in `decision-record.md` follow-up, and re-run with explicit forbid-install prompt addendum |

### State Preserved Across Rollback

- 004 spec folder (spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, description.json, graph-metadata.json) remains intact for retry.
- Parent 102 spec.md updates (Phase Count 4, handoff row, related docs) remain — they reflect the umbrella commitment, not the in-flight execution.
- Evidence files for SCENARIOS THAT PASSED before the failure stay (do not delete them); only failed-scenario evidence is purged.

### Recovery Procedure

1. Identify the failing artifact (scenario file vs. index update vs. evidence).
2. Apply the matching rollback action above.
3. Re-run the affected phase from `tasks.md` (Phase 2 author or Phase 3 dispatch).
4. Re-validate via `validate.sh --strict`.
<!-- /ANCHOR:enhanced-rollback -->
