---
title: "Feature Specification: Phase 20: vibe-dispatch-hardening"
description: "A hand-composed Vibe dispatch that skips the hook render step runs with no guards and no rule refuses it, fan-out lineages run auto-approved with the spec gate off and no decision on record, the repo-guards tests run in no CI job, and the lineage dist-rebuild switch is undocumented. This phase closes the four carried dispatch gaps."
trigger_phrases:
  - "vibe dispatch hardening"
  - "phase 20 vibe dispatch hardening"
  - "vibe render step hard rule"
  - "vibe lineage auto-approve posture"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 20: vibe-dispatch-hardening

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
| **Branch** | `worktrees/383-mistral-vibe-runtime` |
| **Parent Spec** | ../spec.md |
| **Phase** | 20 of 21 |
| **Predecessor** | 019-vibe-relaunch-command-tier |
| **Successor** | 021-vibe-hook-docs-correction |
| **Handoff Criteria** | The render-step rule refuses an unrendered dispatch, the lineage posture decision is recorded, and the repo-guards tests run in CI |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 20** of the Mistral Vibe runtime mode build specification.

**Scope Boundary**: The four dispatch gaps carried out of phases 009 and 011: the missing render-step rule, the undecided lineage posture, the repo-guards tests outside CI and the undocumented lineage dist-rebuild switch. No new guard and no hook behavior change.

**Dependencies**:
- Phase 013, which fixes the `isolated-vibe-home` base directory in the same rule file; this phase builds on that fix.
- The dispatch rule engine (`.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs`) and the cli-mistral-vibe `hard-rules.json`.
- The operator, for the lineage posture decision.

**Deliverables**:
- A seventh Vibe hard rule and its tests.
- A recorded lineage posture decision and, if it tightens, the lineage adapter change.
- The repo-guards tests in a CI job, and the dist-rebuild switch documented.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The six Vibe hard rules (Measured Behavior) check print mode, home isolation, the output folder, the roster, the cwd and stdin, but none checks that `render-home-hooks.cjs` wrote the run's `hooks.toml`, so a hand-composed dispatch that skips that step runs every tool with no guard. Fan-out lineages pass `--auto-approve` (`fanout-run.cjs:3236`) and set `SYSTEM_SPEC_GATE_DISABLED=1` (`fanout-run.cjs:3891`) with no recorded decision on that posture. The renderer and spec-gate tests live under `.vibe/plugins/repo-guards/tests/`, outside the `.skilled/hooks` tree the CI node:test job collects, and that workflow's path filters omit `.vibe/**`. The lineage's `SPECKIT_DIST_AUTO_REBUILD=0` (`fanout-run.cjs:3909`) appears in no doc.

### Purpose
No Vibe dispatch can run without its guards unnoticed, the lineage posture is a recorded decision, and every Vibe hook test runs in CI.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node -e 'const j=require("./.skilled/skills/cli-external-orchestration/cli-mistral-vibe/hard-rules.json");console.log(j.map(x=>x.id).join(" "))'
print-mode-only isolated-vibe-home output-dir-required vibe-closed-roster no-repo-root-cwd stdin-redirect-required
$ rg -n "'--auto-approve'" .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs
3236:    '--auto-approve',
$ find .skilled/hooks .vibe -name "*.test.mjs" | rg "vibe"
.skilled/hooks/goal/vibe/goal-vibe.test.mjs
.vibe/plugins/repo-guards/tests/spec-gate.test.mjs
.vibe/plugins/repo-guards/tests/render-home-hooks.test.mjs
$ rg -c '\.vibe/' .github/workflows/opencode-plugin-tests.yml; echo "exit=$?"
exit=1
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `rendered-home-hooks` hard rule: a `vibe` dispatch is refused unless the same command runs `render-home-hooks.cjs` with a home argument textually equal to the `VIBE_HOME` it sets, chained before the run. This holds for a literal home and for a variable home such as `$RUN_DIR/.vibe-home`, so a copy of the documented recipe with the render step removed is refused. Without it, the documented render step is a convention nothing checks.
- Record the lineage posture decision in the parent packet's existing `decision-record.md`, appended as a new decision. It covers two axes: approval (keep `--auto-approve` with named compensating guards, or tighten with `--enabled-tools`, `--add-dir` or a narrower agent) and the spec gate (keep `SYSTEM_SPEC_GATE_DISABLED=1` in the lineage env at `fanout-run.cjs:3891`, or lift it). Apply it to the lineage adapter if it tightens.
- Add the repo-guards node:test files and the `.vibe/**` path filter to the CI hook node:test job.
- Run the Vibe hook suites in pre-commit when T003 finds the pre-commit hook already runs hook node:test suites; otherwise record why CI is the gate.
- Document the lineage's `SPECKIT_DIST_AUTO_REBUILD=0` in the env reference and the cli-mistral-vibe lineage section.
- Add node:test suites for the three Vibe mirror generators (`sync-agents-vibe.cjs`, `sync-prompts-vibe.cjs`, `sync-skills-vibe.cjs`), which the sk-code audit found untested while their dsh siblings carry suites; phase 013 handed this item here. List the three files in `.github/workflows/advisory-checks.yml` beside the dsh siblings (`advisory-checks.yml:139-142`), because the hook node:test job does not walk `system-spec-kit/runtime/cli/tests/`.

### Out of Scope
- New guards or hook behavior - phases 015 to 019 own new hooks.
- The `isolated-vibe-home` base-directory fix - phase 013 owns it.
- Vibe sandbox mode - Vibe has no sandbox flag or config field, so confinement here means tool and directory limits only.
- Changing the deep-loop runner for other executor kinds - the posture decision covers Vibe lineages only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | Modify | The `rendered-home-hooks` check |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | Modify | Refuse and accept cases for the new rule |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/hard-rules.json` | Modify | The seventh rule row |
| `../decision-record.md` (parent packet) | Modify (append) | The lineage posture decision, approval and spec-gate axes |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` and its tests | Modify (only if the decision tightens) | The lineage's Vibe flags |
| `.github/workflows/opencode-plugin-tests.yml` | Modify | `.vibe/**` path filter and the repo-guards test files in the node:test collection |
| `.github/workflows/advisory-checks.yml` | Modify | The three Vibe sync-generator test files beside the dsh siblings |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-{agents,prompts,skills}-vibe.test.mjs` | Create | node:test suites for the three Vibe mirror generators |
| The pre-commit hook T003 names | Modify (only if it already runs hook suites) | The Vibe hook suites |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, cli-mistral-vibe `references/cli-reference.md` | Modify | The lineage dist-rebuild switch |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | An unrendered Vibe dispatch is refused | The rule suite has refuse cases for a literal `VIBE_HOME` and for a variable `VIBE_HOME` (`$RUN_DIR/.vibe-home`) with the render step removed, a refuse case where the render names a different home, and a case where the documented cli-mistral-vibe dispatch shape passes; `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` prints `fail 0` |
| REQ-002 | The lineage posture is a recorded decision | The parent's `decision-record.md` holds a new decision naming the chosen approval posture and spec-gate setting, the compensating guards or the tightened flags, and the operator's approval |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The Vibe tests run in CI | `rg -c '\.vibe/' .github/workflows/opencode-plugin-tests.yml` prints at least 2, the collection command run locally lists every file matching `.vibe/plugins/repo-guards/tests/*.test.mjs`, and `rg -c 'sync-.*-vibe.test.mjs' .github/workflows/advisory-checks.yml` prints 3 |
| REQ-004 | The lineage dist-rebuild switch is documented | `rg -n 'SPECKIT_DIST_AUTO_REBUILD' .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md .skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/cli-reference.md` prints a Vibe lineage line in each |
| REQ-005 | A tightened posture keeps lineages working | If the decision tightens, the Vibe unit and stress cases in the deep-loop suites print `fail 0` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` prints `fail 0` and `cd .skilled && npx vitest run hooks/dispatch/lib/dispatch-audit.test.mjs` reports every test passed, with the new rule's cases.
- **SC-002**: The parent's `decision-record.md` holds the posture decision, both axes, with the operator's approval line.
- **SC-003**: The CI collection command, run locally, lists every Vibe node:test file under `.skilled/hooks` and every file matching `.vibe/plugins/repo-guards/tests/*.test.mjs`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The operator's posture decision | High: REQ-002 and REQ-005 wait on it | T004 prepares the options with evidence, so the decision is one answer |
| Risk | The render-step rule cannot see a render done in an earlier command, so a caller that renders first and dispatches later is refused | Med | Intended: the documented shape chains the render in the same command. The refusal message names the one-line render step to chain, and the fan-out runner renders inside its own process, outside this rule |
| Risk | Tightening the lineage flags stalls a headless lineage on a tool the allowlist omits | Med | The decision lists the tools a research and a review iteration use, and REQ-005 reruns the Vibe suites |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which lineage posture: keep `--auto-approve` behind the rendered strict guards, or tighten with `--enabled-tools`, `--add-dir` or a narrower agent; and keep or lift `SYSTEM_SPEC_GATE_DISABLED=1`? The operator decides in T005.
- Does the repository's pre-commit hook run any hook node:test suite? T003 records it; if none, CI is the gate.
<!-- /ANCHOR:questions -->

---
