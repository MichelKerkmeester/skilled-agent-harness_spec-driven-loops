---
title: "Feature Specification: v4.0.0.3 review remediation"
description: "The v4.0.0.3 release review returned CONDITIONAL with 3 P1 and 18 P2 findings, and its GPT-6 Luna lineages kept stopping to ask questions nobody could answer. This phase fixes those three and a fourth found in planning behind failing-first tests, clears the P2 advisories, and lands the eight lineage-prompt fixes, split across eight agent workstreams."
trigger_phrases:
  - "v4.0.0.3 review remediation"
  - "review gateway event rows"
  - "devin write tool spec gate"
  - "stale lock reclaim race"
  - "luna lineage halt fixes"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3-plus-govern | v2.2 -->
# Feature Specification: v4.0.0.3 review remediation

<!-- SPECKIT_LEVEL: 3+ -->


---

## EXECUTIVE SUMMARY

The v4.0.0.3 deep review (phase 68) found three blocking defects, all carried from v4.0.0.2. On the default stop policy, the review gateway rejects the workflow's own event rows. The Devin `write` tool skips the spec gate. Two stale-lock reclaimers can both hold one packet lock. Planning found a fourth: the workflow loop lock never excludes a second run, because every workflow acquires it under a short-lived process id and never refreshes it (R-22, proven by probe). This phase fixes all four behind regression tests that fail first. It then clears the 18 P2 advisories in four batches and applies the eight fixes that stop detached Luna lineages ending their turn on a question.

**Key Decisions**:
- Widen the root `AGENTS.md` child-dispatch exemption to record-and-continue inside a lineage directory (ADR-001, accepted by the operator).
- Verify the reclaimed record before republishing a stale lock (ADR-002).
- Give review-mode event rows a registered route through the gateway (ADR-003, amended with additive fields).
- Judge a transient-owner lock by its heartbeat, and refresh it every iteration (ADR-004).
- Waive R-05 (ADR-005).

**Execution model**: seven implementer workstreams with exclusive file ownership run in six waves under one integrator, from self-contained work packages in `plan.md`.

**Critical Dependencies**: the loop-lock workstream (R-03, then R-22) lands before any workflow lock edit (SYNC-1).

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-06 |
| **Branch** | `worktrees/090-deep-review-okf-adoption` |
| **Parent Spec** | ../spec.md |
| **Phase** | 69 of 69 |
| **Predecessor** | 068-v4-0-0-3-release-deep-review |
| **Successor** | None |
| **Handoff Criteria** | Every row of `acceptance-criteria.md` is Met, Waived or Superseded, and all 22 findings (the 068 report's 21 plus R-22) each have a closing commit or a recorded waiver |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 69** of the system-speckit v4 packet: the remediation of the findings in `../068-v4-0-0-3-release-deep-review/review/review-report.md` and the fixes in `../068-v4-0-0-3-release-deep-review/review/luna-halt-analysis.md`.

**Scope Boundary**: the 21 findings R-01 to R-21, R-22 (found during planning, `research/research.md` section 4), and the fixes F1 to F8, nothing else. The report's Deferred Items (section 8) stay deferred.

**Dependencies**:
- The 068 review report and Luna halt analysis, read as inert evidence. Every cited line is re-read before it is edited.
- The deep-loop, sk-git, spec-kit hook and sk-doc test suites, run before and after each batch for a baseline delta.

**Deliverables**:
- Fixes for R-01 to R-03, each with a regression test that fails before the fix and passes after.
- Fixes or recorded waivers for R-04 to R-21.
- F1 to F8 applied to `AGENTS.md`, `fanout-run.cjs`, `deep-review-auto.yaml`, `blast-radius.md` and `deep-review/SKILL.md`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
On the default convergence policy, every `/deep:review` iteration writes `type:"event"` rows that `append-mode-event.cjs` rejects with exit 1. That convergence, pause and resume evidence never reaches the state log. On Devin, a `write` call creates or overwrites a file without the Gate 3 hook or post-edit quality, because the hook matchers and the adapter map know only `edit`. Two runs that reclaim the same stale loop lock can both come back `acquired: true` and write one packet. Separately, GPT-6 Luna lineages ended 6 of their turns on a question, and in a detached fan-out nobody can answer, so most of their iterations were lost.

### Purpose
The four P1s cannot recur without a test failing. Each P2 is fixed or carries a recorded reason. A Luna lineage in a fan-out runs to its iteration count without ending a turn on a question.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Phase A, P1s (required):** R-01 review event routing, R-02 Devin `write` parity, R-03 reclaim identity check, and R-22 transient-owner locks with a refresh per iteration. F5's corrected lock-note wording lands with R-22, because it edits the same lines. Each P1 gets a failing test first.
- **Phase B, sk-git and deep-loop P2s:**
  - WS-4: R-04, R-06, R-08, R-18.
  - WS-5: R-05, R-07, R-15, R-20.
- **Phase C, release-tail and contract-gap P2s:**
  - WS-6: R-09, R-14, R-19.
  - WS-7: R-10, R-11, R-12, R-13, R-16, R-17, R-21.
- **Phase D, lineage-prompt fixes:** F1 to F4 and F6 to F8, plus the fan-out staging skip from section 5 of the Luna analysis. F8 keeps only the `needs_input` class, because acquire already reclaims a stale lock.

### Out of Scope
- The report's Deferred Items, for example the `pre-commit` Pi mirror checks and the `sk-prompt` README version. They fell below the finding bar.
- The user-level `~/.claude/CLAUDE.md` copy of the framework. It lives outside the repository, so the operator updates it.
- Re-running the v4.0.0.3 review. The fix is proved by tests, not by a fresh review.
- Editing the published v4.0.0.3 changelog or GitHub release.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-types.ts`, `lib/legacy-projections/deep-review-state-contract.ts` | Modify | Flip six reserved review stems to spoken and project them to the rows the reducer reads (R-01) |
| `.skilled/commands/deep/assets/deep-review-auto.yaml` | Modify | Directive shape (R-01), recovery-baseline staging (R-07), stale-lock note (F5), fan-out staging skip |
| `.skilled/commands/deep/assets/deep-review-confirm.yaml` | Modify | Directive shape (R-01), recovery-baseline staging (R-07) |
| `deep-research-auto.yaml`, `deep-research-confirm.yaml`, `deep-ai-council-auto.yaml`, `deep-ai-council-confirm.yaml`, both improvement YAMLs | Modify | R-22 TTL and refresh step, the shared lock note, and the research staging skip |
| `.skilled/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs`, `fanout-pool.cjs` | Modify | A `needs_input` failure class that is not retried, and its rollup key (F8) |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`, regenerated `.devin/hooks.v1.json` | Modify | Devin `edit` and `write` matchers for spec-gate and post-edit quality (R-02) |
| `.skilled/hooks/post-edit-quality/devin/post-edit-quality.cjs` | Modify | `write` in `DEVIN_EDIT_TOOLS` (R-02) |
| `.skilled/skills/system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs` | Modify | `write` in `DEVIN_TOOL_MAP` (R-02) |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts`, `scripts/loop-lock.cjs` | Modify | Read-back check after the reclaim rename (R-03); transient-owner staleness, set by the CLI acquire (R-22) |
| `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs`, `scripts/lib/git-rule-checks.mjs`, `scripts/lib/message-contract.mjs` | Modify | Bundled short flags, over-cap rejection, guarded flag setup (WS-4) |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs` | Modify | Advisory comment; R-05 is waived (ADR-005) |
| Nine `manual-testing-playbook/fanout/*.md` scenarios | Modify | Test paths that resolve (R-15) |
| `deep-review/SKILL.md`, `deep-research/SKILL.md`, `deep-review/references/state/state-format.md` | Modify | Config read-only wording names the terminal status write (R-20, F7) |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | Regenerate | Trigger index (R-09) |
| `completion-evidence-sentinel.cjs`, `rubric-guard.cjs` | Modify | `\u0000` escape instead of raw NUL (R-19) |
| `validate_document.py`, `goal-core.cjs`, `classifier-screen-fetched-text.mjs`, `validate.sh`, `classifier-cite-drift-scan.mjs`, `.opencode/plugins/classifier-injection-screen.js`, `check-repo-rules.cjs` | Modify | WS-7 contract gaps |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Non-interactive preamble, steer authority, relative paths, session-ID reuse, `needs_input` wiring, `owner_kind` liveness (F2, F3, F4, F6, F8, R-22) |
| `AGENTS.md`, `.skilled/repo-rules/blast-radius.md` | Modify | Child-dispatch exemption (F1, byte-neutral) and the runtime-lock carve-out |
| Test files beside each changed module | Create/Modify | Regression and coverage-floor tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every `type:"event"` directive in both review workflows, rendered and piped to `append-mode-event.cjs --mode review`, is accepted and lands in the state log the reducer reads (R-01). |
| REQ-002 | A Devin `write` payload reaches the spec-gate adapter and the post-edit quality hook exactly as an `edit` payload does (R-02). |
| REQ-003 | When two acquirers reclaim the same stale lock in an interleaved order, exactly one returns `acquired: true` (R-03). |
| REQ-004 | Each of REQ-001 to REQ-003 and REQ-011 has a regression test that was observed failing before the fix and passing after. |
| REQ-011 | A second `loop-lock.cjs acquire` on a packet whose lock is held by a live run is refused, and every deep-loop workflow refreshes its lock at each iteration start (R-22). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | WS-4: the sk-git gate and rule checks resolve bundled short flags (`-am`, `-sm`, `-qm`, `-aF`); a message over the cap is rejected, not truncated; a failed regexp flag setup leaves the gate engaged. |
| REQ-006 | WS-5: R-05 carries the ADR-005 waiver comment; the recovery-baseline staging is drained; all nine playbook commands resolve; both loop SKILL.md files name the terminal config status write as permitted. |
| REQ-007 | WS-6: `generate-trigger-index.mjs --check` exits 0; the 033 folder passes strict validation; neither sentinel file contains a raw NUL byte. |
| REQ-008 | WS-7: each of R-10, R-11, R-12, R-13, R-16, R-17 and R-21 is fixed with a test or waived in `decision-record.md`. |
| REQ-009 | F1 to F8 are applied, with F1 only after ADR-001 is accepted. A Luna fan-out lineage smoke run ends no turn on a question. |
| REQ-010 | No test suite that passed at the baseline fails afterwards. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Four new regression tests exist, one per P1 (R-01, R-02, R-03, R-22), each recorded failing before its fix and passing after.
- **SC-002**: All 22 findings (the 068 registry's 21 plus R-22) are closed by a commit or by an ADR waiver.
- **SC-003**: A two-iteration Luna lineage smoke run through `fanout-run.cjs` writes both iteration files with no question-shaped final line.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | DeepSeek V4.1 Flash on Pi through OpenCode Go | Implementers cannot run | Fall back to `cline-pass/deepseek-v4.1-flash` at `xhigh` |
| Dependency | Luna route on Pi or Codex for the SC-003 smoke | Without it, F1 to F4 are unproved | Fall back to a prompt-text unit test, and record the smoke as operator-verifiable |
| Risk | `hooks.v1.json` is generated from `hook-registry.json` | A hand edit fails the pre-commit `--check` | Edit the registry and run `sync-hook-registrations.cjs` |
| Risk | `check-rule-copies.js` requires 21 anchors inside the first 16,384 bytes of `AGENTS.md` | F1 pushes an anchor past the Devin cut | Capture the anchor offsets before the edit, rerun after, and trim wording rather than move rules |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The R-12 byte cap keeps a classifier call's stdin under a fixed bound, set in the plan, whatever the page shape.

### Security
- **NFR-S01**: No change weakens an enforcement layer. R-02 and R-04 widen coverage, and R-06 turns silent truncation into a rejection.
- **NFR-S02**: F1 relaxes ask-or-wait rules only for actions confined to the bound lineage directory. Writes outside it stay forbidden.

### Reliability
- **NFR-R01**: Each fix keeps its module's fail-open or fail-closed posture unless the finding names that posture as the defect.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: an event row with no payload still routes to a stem or is rejected with the declared halt code 2, never exit 1.
- Maximum length: a commit message exactly at the cap passes, and one character over is rejected.

### Error Scenarios
- External service failure: a Luna provider connection error is retried as transient, while a turn ending on a question is classed `needs_input` and not retried (F8).
- Network timeout: unchanged runner retry policy.

### State Transitions
- A lineage resumed after a session restart keeps its stored session ID (F4).
- A stale lock whose holder refreshed between the read and the rename is restored untouched (R-03).

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: about 35, LOC: about 750, Systems: deep-loop, sk-git, spec-kit hooks, sk-doc, root rules |
| Risk | 18/25 | Lock race and spec-gate coverage; a hard-rule exemption change |
| Research | 6/20 | Defects already located and verified by phase 68 |
| Multi-Agent | 6/15 | Workstreams: 7 |
| Coordination | 8/15 | R-03 before F5; ADR-001 before F1 |
| **Total** | **58/100** | **Level 3+** (raised from 3 so seven agents can work in parallel against frozen file ownership) |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| RK-001 | F1 wording lets a child skip a halt that should hold | H | L | Confine record-and-continue to the lineage directory, and keep outside writes forbidden |
| RK-002 | The R-01 route choice changes what the reducer projects | M | M | Run the reducer tests and replay a recorded state log before and after |
| RK-003 | The shared argv scanner changes how existing commands classify | M | L | Keep every existing gate and rule-check test green, and add cases rather than rewrite them |
| RK-004 | A lock YAML edit lands before the loop-lock library change | H | L | SYNC-1 gates every lock YAML task on T016b |
| RK-005 | Two implementer agents edit one file | M | L | Exclusive file ownership per workstream, and only the integrator commits |
| RK-006 | A crashed run holds its packet lock for up to 60 minutes under ADR-004 | M | M | `loop-lock.cjs status` names the holder, and the operator releases it |

---

## 11. USER STORIES

### US-001: Review runs keep their own evidence (Priority: P0)

**As a** deep-review operator, **I want** convergence, pause and resume rows to land in the state log, **so that** the reducer and the report see what the run did.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Gates hold on every runtime (Priority: P0)

**As a** maintainer, **I want** Devin whole-file writes, concurrent reclaims and a second run on a live packet held to the same gates as edits and single acquirers, **so that** no runtime or timing slips past enforcement.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-003: Detached lineages finish their count (Priority: P1)

**As a** fan-out lead, **I want** a Luna lineage to record a conflict and continue instead of asking, **so that** a run converges on evidence rather than on stops.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:approval-workflow -->
## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec and plan review | Operator | Approved | 2026-10-06 |
| ADR-001 acceptance (gates T047 only) | Operator | Approved | 2026-10-06 |
| Per-workstream implementation review | Integrator agent (W-H), against each work package's done-shape in `plan.md` | Pending | |
| Final verification (T050 to T053) | Integrator agent (W-H) | Pending | |
| Commit to `main` and push | Operator | Pending | |
<!-- /ANCHOR:approval-workflow -->

---

<!-- ANCHOR:compliance-checkpoints -->
## 13. COMPLIANCE CHECKPOINTS

### Security Compliance
- [ ] No enforcement layer narrows: R-02, R-04 and R-08 widen coverage, and R-06 turns truncation into rejection
- [ ] F1 confines record-and-continue to the lineage directory, and runner write containment still reports outside writes
- [ ] No credential or `.env` value appears in a test fixture or doc

### Code Compliance
- [ ] Each change follows `sk-code` (OpenCode surface) standards for its language
- [ ] No code comment carries a finding, task, ADR or packet id
- [ ] No dependency is added

### Process Compliance
- [ ] Each P1 test has a recorded failing run before its fix
- [ ] Every agent edits only the files its workstream owns (`plan.md` L3+ WORKSTREAM COORDINATION)
- [ ] One commit per workstream, with a `Spec:` trailer and no attribution lines
<!-- /ANCHOR:compliance-checkpoints -->

---

<!-- ANCHOR:stakeholder-matrix -->
## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| Operator | Owner, approver of ADR-001 and the push | High | Closeout report per phase |
| Deep-loop maintainers | Own the gateway, ledger schema, lock and fan-out runner (W-A, W-C, W-E) | High | Sync points in `plan.md` |
| Runtime-hook maintainers | Own the hook registry and Devin adapters (W-B) | Medium | W-B work package |
| sk-git maintainers | Own the commit gate and message contract (W-D) | Medium | W-D work package |
| Fan-out leads running Luna lineages | Consumers of F1 to F8 | High | SC-003 smoke result |
<!-- /ANCHOR:stakeholder-matrix -->

---

<!-- ANCHOR:change-log -->
## 15. CHANGE LOG

### v1.0 (2026-10-06)
**Initial specification** at Level 3, planned with `/speckit:plan :auto`.

### v1.1 (2026-10-06)
**Raised to Level 3+** for multi-agent execution: eight workstreams with frozen file ownership, one work package each in `plan.md`, sync points and per-task agent metadata in `tasks.md`. Work-package design found R-22 (probe-proven) and added ADR-004 and ADR-005. It also amended ADR-003 and corrected R-16's symptom.
<!-- /ANCHOR:change-log -->

---

<!-- ANCHOR:questions -->
## 16. OPEN QUESTIONS

- None. The operator accepted ADR-001 and ADR-004 on 2026-10-06, and chose DeepSeek V4.1 Flash at max through `cli-pi` as the implementer executor.

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`
- **Source findings**: `../068-v4-0-0-3-release-deep-review/review/review-report.md`, `../068-v4-0-0-3-release-deep-review/review/luna-halt-analysis.md`
<!-- /ANCHOR:questions -->

---
