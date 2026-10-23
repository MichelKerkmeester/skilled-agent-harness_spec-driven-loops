---
title: "Goal: Phase 6: sk-code-ci-surface"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/006-sk-code-ci-surface"
    last_updated_at: "2026-10-23T15:40:00Z"
    last_updated_by: "markdown-planner"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers:
      - "004-setup-caching-provisioning has not landed; the composite-action rule records status: proposed"
      - "specs/sk-code/013-private-surface-skills/002-hub-surface-removal edits the same registration files"
      - "The worktree is not provisioned, so parent-skill-check leg 12-lib fails before this phase starts"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "acceptance-criteria.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-006-sk-code-ci-surface"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 6: sk-code-ci-surface

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Deliver a read-only `sk-code-ci` surface packet that states the repository's GitHub Actions rules with their evidence, registers it in every sk-code hub artifact, and records message-contract's every-branch push trigger as an intentional exception without editing the workflow.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| G1 | The packet is a read-only surface: `packetKind: surface`, `backendKind: evidence-base`, `mutatesWorkspace: false`, tools `Read, Bash, Grep, Glob`. It is never a workflow mode and never a standalone skill. |
| G2 | Every registration inserts and never rewrites; `scratch/registration-before.json` and `scratch/registration-after.json` are the proof that nothing was lost. |
| G3 | The playbook scenario lives in the packet's own `manual-testing-playbook/`, because router-sync leg 4 walks packet-level playbooks only. |
| G4 | `CI_WORKFLOW` carries the same four reference paths in the packet map and in the parent `ROUTER.md` projection, the parent with a `sk-code-ci/` prefix. |
| G5 | The rule data cites `.github/` files and lines, never a `specs/` path, and no packet file names an R-id, a D-id or a phase number. |
| G6 | Generated artifacts are written only by their generators; `graph-metadata.json`'s `derived.causal_summary` is the one authored field. |
| G7 | The hub release is `2.4.0.0`, or `2.5.0.0` when `changelog/v2.4.0.0.md` already exists. |
| G8 | The concurrency template records `cancel-in-progress: ${{ github.event_name == 'pull_request' }}` as the recommended PR-only default pending operator D2, and names `cancel-in-progress: true` on main as the alternative in one line. No task reads a sibling phase for that value. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `test -f .skilled/skills/sk-code/sk-code-ci/SKILL.md && test -f .skilled/skills/sk-code/sk-code-ci/references/protected-set.md && test -L .skilled/skills/sk-code/sk-code-ci/references/workflow-verify.md` exits `0`
- [ ] `grep -c '"CI_WORKFLOW"' .skilled/skills/sk-code/ROUTER.md` returns `2`
- [ ] `grep -c "'sk-code-ci'" .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` returns `2`
- [ ] `node --test .skilled/bin/tests/compiled-route-surface-hint.test.cjs` exits `0` and its summary reads `pass 7` with `fail 0`
- [ ] `grep -c 'intentional-exception' .skilled/skills/sk-code/sk-code-ci/references/trigger-and-filter-rules.md` returns at least `1`, and `git diff --exit-code -- .github/workflows/message-contract.yml` exits `0`
- [ ] `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs` exits `0` with `doc-claims: 4/4 checks passed`
- [ ] `rg -c 'specs/' .skilled/skills/sk-code/sk-code-ci` exits `1` with no output
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Plan authored | Done | `spec.md` (REQ-001 to REQ-010), `plan.md` (L3 dependency graph, critical path, milestones and decision summary), `tasks.md` (T001 to T068), `acceptance-criteria.md` (AC-001 to AC-012), `decision-record.md` (ADR-001 to ADR-010) |
| Baseline | Pending | `scratch/phase-baseline.md` is not written |
| Packet | Pending | `.skilled/skills/sk-code/sk-code-ci/` does not exist |
| Registration | Pending | `mode-registry.json` declares three surfaces and no `sk-code-ci` entry |
| Implementation | Pending | No file named by `tasks.md` has changed |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | The phase has not started, so no work has diverged from the directive |
<!-- /ANCHOR:log -->
