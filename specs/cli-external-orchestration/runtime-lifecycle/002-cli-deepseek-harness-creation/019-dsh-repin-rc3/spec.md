---
title: "Feature Specification: Phase 19: dsh-repin-rc3"
description: "The installed DeepSeek Harness is 0.2.2-rc.3 while every pin site still names 0.2.2-rc.1, so the fan-out builder and the dispatch contract refuse every run. This phase moves the pin to rc.3 and repeats the runbook's route, confinement, reasoning and fan-out probes on it."
trigger_phrases:
  - "dsh repin rc3"
  - "phase 19 dsh repin rc3"
  - "dsh 0.2.2-rc.3 pin"
  - "deepseek harness repin"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 19: dsh-repin-rc3

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/376-dsh-single-executor-loop` |
| **Parent Spec** | ../spec.md |
| **Phase** | 19 of 19 |
| **Predecessor** | 018-dsh-single-executor-hardening |
| **Successor** | None |
| **Handoff Criteria** | Every pin site names `0.2.2-rc.3`, the runbook probes T004 to T008 are recorded in `evidence/` and the touched suites pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 19** of the DeepSeek Harness packet. The operator chose to repin the harness to 0.2.2-rc.3 before any more DeepSeek workers run. Another session installed rc.3 on this machine for the Mistral route, and no branch carried a repin.

**Scope Boundary**: the literal version pin in the runtime, the dispatch hook, the hard rules, the skill references and the tests that stub the version, plus the runbook evidence. No install or uninstall. The binary on `PATH` is already rc.3. No route, patch or builder behavior changes.

**Dependencies**:
- `dsh` 0.2.2-rc.3 on `PATH` at `~/.local/bin/dsh`.
- `LLMGATEWAY_API_KEY` and `OPENCODE_API_KEY` in the launch environment, never read or printed.

**Deliverables**:
- Every pin site names `0.2.2-rc.3`, with the registry integrity recorded.
- The runbook's T004 to T008 probes, saved under `evidence/`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `dsh` on `PATH` reports `0.2.2-rc.3`, while the fan-out builder, the dispatch hook, the hard rules and the skill references all pin `0.2.2-rc.1`. So `buildLineageCommand` throws for every harness lineage, and the skill's dispatch contract says to refuse and escalate before any build worker runs.

### Purpose
Pin the harness to the release that is installed, and prove the routes, the confinement and a fan-out lineage still behave on it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Run from the worktree root on 2026-11-14, before any edit. The version probe ran in a throwaway home outside the checkout.
```text
$ <version probe in a temp home>
0.2.2-rc.3

$ rg -n "const DSH_VERSION|const DSH_PINNED_VERSION" .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs
.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2948:const DSH_VERSION = '0.2.2-rc.1';
.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:32:const DSH_PINNED_VERSION = '0.2.2-rc.1';

$ npm view @deepseek-ai/dsh dist-tags --json
{ "alpha": "0.2.2-alpha.3", "latest": "0.2.2-rc.1", "next": "0.2.2-rc.3" }

$ npm view @deepseek-ai/dsh@0.2.2-rc.3 dist.integrity
sha512-S+4oUYVKWuc1SCMMp1mpUa2llxVy0o9gIgp7TDg/Ea7PuvXVkAfnykqSH1/oDXVB+y5VzEm0QIJulo1LIB3qRg==
```
The pin search outside `specs/` and changelogs found 22 lines naming `0.2.2-rc.1` across 15 files. Eighteen are pin sites and test stubs. Four state that a route was verified on rc.1.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move every literal pin from `0.2.2-rc.1` to `0.2.2-rc.3`, with the rc.3 integrity and dist-tags in the version table.
- Run the runbook's probes: both routes, the four boundary probes, the reasoning stderr check and one fan-out research lineage.
- Restate the route status lines that named rc.1 as the verified release, now that rc.3 passed the same probes.

### Out of Scope
- Installing or removing any release - rc.3 is already installed, and the operator ruled out any global change.
- The Mistral route - another session owns it, and this worktree does not carry its patch.
- Rewriting the history of earlier phases - their evidence records what ran on rc.1.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | `DSH_VERSION` |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | Modify | `DSH_PINNED_VERSION` |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | Modify | Four pinned `npx` command strings |
| `.skilled/hooks/dispatch/README.md` | Modify | The `pinned-version-required` row |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/hard-rules.json` | Modify | The `pinned-version-required` message |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/cli-reference.md` | Modify | The version table: version, integrity, dist-tags and their evidence |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/providers-and-models.md` | Modify | The LLM Gateway status row |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/SKILL.md` | Modify | The verified-route banner |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/README.md` | Modify | The verified-route sentence |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/assets/prompt-templates.md` | Modify | The preflight version check |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/manual-testing-playbook/manual-testing-playbook.md` | Modify | The live-step precondition |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/shims/dsh-shim.cjs` | Modify | The shim's reported version |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/live-contracts.json` | Modify | The dsh contract sentence |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/combo-matrix.vitest.ts` | Modify | The stub's reported version |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | Three stub versions, the pin assertion and the wrong-version error regex |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No pin site outside `specs/` and changelogs names `0.2.2-rc.1`, only record lines do, and `DSH_VERSION`, `DSH_PINNED_VERSION` and the hard rule name `0.2.2-rc.3` |
| REQ-002 | The LLM Gateway route probe on rc.3 exits 0 with a last `final` event whose `reason.kind` is `completed` |
| REQ-003 | The dispatch hook tests and the deep-loop tests that stub the version pass |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The OpenCode Go probe runs because its key is set, and its result is recorded |
| REQ-005 | The four boundary probes and the reasoning stderr check are recorded, with a home write denied |
| REQ-006 | One fan-out research lineage on rc.3 completes with no out-of-lineage write and no harness home left behind |
| REQ-007 | `~/.dsh` is unchanged after the probes and no evidence file holds a key value |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The pin search outside `specs/` and changelogs prints only 3 record lines for `0.2.2-rc.1`, down from 22.
- **SC-002**: The two route probes and the fan-out lineage each record exit 0 and a `completed` final event in `evidence/`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | rc.3 on `PATH`, installed by another session | A downgrade by that session would make the new pin refuse again | The version probe runs before every dispatch, so a mismatch fails closed |
| Risk | rc.3 changed a behavior the rc.1 probes pinned | Med | Every runbook probe ran again on rc.3, and the one new behavior, an escalation hint in the sandbox error, is recorded |
| Risk | A main-checkout change pins differently | Low | The merge will show the conflict on the same lines |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The pin is a string compare, so a dispatch costs the same one version probe as before.

### Security
- **NFR-S01**: No probe reads or prints a key. Keys reach dsh only through the launch environment.
- **NFR-S02**: Every probe runs from a fresh temp cwd with a fresh `DSH_HOME`, never from the checkout root or `~/.dsh`.

### Reliability
- **NFR-R01**: A binary at any other release still fails closed in the builder and in the skill preflight.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a missing key skips that route's probe and records it as untested on rc.3, as the runbook says. Both keys were present.
- Maximum input: the fan-out lineage runs one iteration at most.
- Failure path: a binary that reports rc.1 or any other release makes `buildLineageCommand` throw before any home is made.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | 15 files, one string each in most, plus evidence |
| Risk | 8/25 | A pin every harness dispatch reads, guarded by the live probes |
| Research | 4/20 | The runbook names every probe |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Repin to rc.3 or install rc.1 in a temp prefix? Answered by the operator on 2026-11-14: repin to rc.3, with no global install or uninstall.
<!-- /ANCHOR:questions -->

---
