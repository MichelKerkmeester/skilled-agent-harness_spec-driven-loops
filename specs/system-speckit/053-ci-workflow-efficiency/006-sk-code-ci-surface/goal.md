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
    last_updated_at: "2026-10-24T22:10:00Z"
    last_updated_by: "markdown"
    recent_action: "Closed the goal: all criteria ticked"
    next_safe_action: "None; reopen only for a failing gate"
    blockers: []
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
    completion_pct: 100
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
| G8 | The concurrency template records `cancel-in-progress: ${{ github.event_name == 'pull_request' }}` as the recommended PR-only default `D2=pr-only` (operator, 2026-10-23), and names `cancel-in-progress: true` on main as the alternative in one line. No task reads a sibling phase for that value. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `test -f .skilled/skills/sk-code/sk-code-ci/SKILL.md && test -f .skilled/skills/sk-code/sk-code-ci/references/protected-set.md && test -L .skilled/skills/sk-code/sk-code-ci/references/workflow-verify.md` exits `0` [EVIDENCE: all three exited 0 on 2026-10-24]
- [x] `grep -c '"CI_WORKFLOW"' .skilled/skills/sk-code/ROUTER.md` returns `2` [EVIDENCE: printed 2 on 2026-10-24]
- [x] `grep -c "'sk-code-ci'" .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` returns `1` [EVIDENCE: printed 1 on 2026-10-24. The guard keeps one surface list, so the planned count of 2 was a planning error and the criterion now reads 1]
- [x] `node --test .skilled/bin/tests/compiled-route-surface-hint.test.cjs` exits `0` and its summary reads `pass 8` with `fail 0` [EVIDENCE: exit 0, `tests 8`, `pass 8`, `fail 0` on 2026-10-24. The planned 7 grew to 8 when the routing amendment added the test that keeps non-CI prompts off the surface]
- [x] `grep -c 'intentional-exception' .skilled/skills/sk-code/sk-code-ci/references/trigger-and-filter-rules.md` returns at least `1`, and `git diff --exit-code -- .github/workflows/message-contract.yml` exits `0` [EVIDENCE: printed 2 and the diff exited 0 on 2026-10-24; the range diff from 028bd0f5cd~1 to HEAD also exits 0]
- [x] `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs` exits `0` with `doc-claims: 4/4 checks passed` [EVIDENCE: exit 0 and the line `doc-claims: 4/4 checks passed` on 2026-10-24]
- [x] `rg -c 'specs/' .skilled/skills/sk-code/sk-code-ci` exits `1` with no output [EVIDENCE: no output, exit 1 on 2026-10-24]
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
| Plan authored | Done | `spec.md` (REQ-001 to REQ-010), `plan.md`, `tasks.md` (T001 to T068), `acceptance-criteria.md` (AC-001 to AC-012), `decision-record.md` (ADR-001 to ADR-010) |
| Baseline | Done | `scratch/phase-baseline.md` records the five gate baselines |
| Packet | Done | `.skilled/skills/sk-code/sk-code-ci/` holds SKILL.md, README.md, the changelog, four references, three symlinks, two templates and the playbook |
| Registration | Done | `mode-registry.json`, `hub-router.json`, `description.json`, `ROUTER.md` and the generated manifests name `sk-code-ci`; registration snapshots compare `true true true true true true true` |
| Implementation | Done | Phase commit `028bd0f5cd`, graph fix `c903c0d103`, closure record `25aa533f0b`, all on `origin/main` |
| CI | Done | Run `40113489423` (Routing Registry Drift Guard) for `c903c0d103` completed with conclusion `success`; 15 of 15 runs for that commit succeeded |

### Deviations and findings

| Item | Note |
|------|------|
| Advisor vocabulary changed | The operator approved three routing-vocabulary changes outside the original scope on 2026-10-24; `spec.md` and `decision-record.md` record them |
| Stale compiled graph | The phase gates did not include the graph freshness check; CI caught it and `c903c0d103` fixed it |
| Criteria counts corrected | The guard count is 1 and the surface-hint summary is 8, not the 2 and 7 planned |
<!-- /ANCHOR:log -->
