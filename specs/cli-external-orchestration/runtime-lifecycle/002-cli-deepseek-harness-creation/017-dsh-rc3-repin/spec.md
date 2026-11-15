---
title: "Feature Specification: Phase 17: dsh-rc3-repin"
description: "The dsh pin still names 0.2.2-rc.1 while the dsh on PATH is 0.2.2-rc.3, so every guarded dispatch is refused. This phase moves the literal pin and its integrity to rc.3 and repeats the re-pin runbook's probes on it."
trigger_phrases:
  - "dsh rc3 repin"
  - "phase 17 dsh rc3 repin"
  - "repin dsh to rc.3"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 17: dsh-rc3-repin

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/388-dsh-rc3-repin` |
| **Parent Spec** | ../spec.md |
| **Phase** | 17 of 17 |
| **Predecessor** | 016-ci-red-check-repairs |
| **Successor** | None |
| **Handoff Criteria** | Every pin site names 0.2.2-rc.3, the dispatch and fan-out tests pass, and each runbook probe has a recorded result |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 17** of the DeepSeek Harness packet. Phases 002 and 013 pinned dsh 0.2.2-rc.1 offline and live. This phase moves that pin to 0.2.2-rc.3.

**Scope Boundary**: the literal version and integrity at every pin site, and the runbook probes on the new release. Route defaults change only when a probe proves them.

**Dependencies**:
- The operator decision of 2026-11-14 to re-pin to rc.3, in a phase of its own.
- `references/repin-runbook.md` for the probe order.

**Deliverables**:
- The pin moved at all 15 files that name rc.1.
- One evidence file per runbook probe under `scratch/`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `pinned-version-required` rule refuses any dsh but 0.2.2-rc.1, and the dsh on PATH is now 0.2.2-rc.3. The pin text sits in 15 files, so the dispatch guard, the fan-out runner and the skill docs all name a release this machine no longer runs first.

### Purpose
Every pin site names 0.2.2-rc.3 with its registry integrity, and the runbook probes record what rc.3 does on each route.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ command -v dsh; dsh --version </dev/null; git grep -c "0\.2\.2-rc\.1" -- ":!specs" | wc -l
/Users/michelkerkmeester/.local/bin/dsh
0.2.2-rc.3
      15
$ npm view @deepseek-ai/dsh dist-tags --json
{
  "alpha": "0.2.2-alpha.3",
  "latest": "0.2.2-rc.1",
  "next": "0.2.2-rc.3"
}
$ npm view @deepseek-ai/dsh@0.2.2-rc.3 version dist.integrity --json
{
  "version": "0.2.2-rc.3",
  "dist.integrity": "sha512-S+4oUYVKWuc1SCMMp1mpUa2llxVy0o9gIgp7TDg/Ea7PuvXVkAfnykqSH1/oDXVB+y5VzEm0QIJulo1LIB3qRg=="
}
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace 0.2.2-rc.1 with 0.2.2-rc.3 at the 15 pin sites, and the integrity and dist-tags rows of the version pin table.
- Run the runbook probes T004 to T008 on rc.3 and save each result under `scratch/`.
- Restate a route as verified on rc.3 only where its probe exits 0 with a final `completed` event.

### Out of Scope
- The Mistral route rows - another session holds uncommitted edits to them in the main checkout, and this phase touches only version lines.
- Route defaults and the closed roster - nothing in this phase changes which routes may run.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | Modify | `DSH_PINNED_VERSION` |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | Modify | Pinned command strings in four cases |
| `.skilled/hooks/dispatch/README.md` | Modify | The `pinned-version-required` row |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/hard-rules.json` | Modify | The `pinned-version-required` message |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/SKILL.md` | Modify | The verified-on line |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/README.md` | Modify | The verified-on line |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/assets/prompt-templates.md` | Modify | The version check line |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/manual-testing-playbook/manual-testing-playbook.md` | Modify | The live-step precondition |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/cli-reference.md` | Modify | The version pin table |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/providers-and-models.md` | Modify | The LLM Gateway verified row |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | `DSH_VERSION` |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/shims/dsh-shim.cjs` | Modify | `DSH_VERSION` |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/live-contracts.json` | Modify | The dsh contract text |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/combo-matrix.vitest.ts` | Modify | The stub version |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | The stub versions and the pinned-version assertion |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No file outside `specs/` names 0.2.2-rc.1 as the pin | `git grep -n '0\.2\.2-rc\.1' -- ':!specs'` prints only the refusal case in `dispatch-rule-checks.test.mjs` and the dated dist-tags row, and the version pin table names `0.2.2-rc.3` with the integrity in Measured Behavior |
| REQ-002 | The dispatch guard and the fan-out runner accept rc.3 and refuse rc.1 | `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` and the system-deep-loop `fanout-run` and `combo-matrix` vitest files exit 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Each runbook probe T004 to T008 has a recorded result on rc.3 | `scratch/` holds stdout, stderr and exit for each probe run, or a line saying why the probe sent no request |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `git grep -c '0\.2\.2-rc\.1' -- ':!specs' | wc -l` prints 2 where Measured Behavior prints 15, and both are the intended mentions REQ-001 names.
- **SC-002**: The LLM Gateway probe on rc.3 exits 0 with a final `completed` event, or the docs keep the route as untested on rc.3.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The route keys for the live probes | A probe without its key cannot run | The runbook rule: record the route as untested on rc.3 and send no request |
| Risk | rc.3 sits on the `next` dist-tag while `latest` stays rc.1 | Medium. A prerelease can change behavior a probe does not cover | Pin the literal version and integrity, never a tag, and claim only what a probe shows |
| Risk | Another session edits six of the same files in the main checkout | Low. A merge conflict when it commits | Change only the version lines, which its edits do not touch |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator chose rc.3 on 2026-11-14 and chose to proceed with version lines only beside the Mistral work.
<!-- /ANCHOR:questions -->

---
