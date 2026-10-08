---
title: "Feature Specification: Phase 4: trigger-index-rebuild-hardening"
description: "The CI job that rebuilds the trigger index stages only one of the four files the generator writes, guards its loop on a subject prefix and pushes with no retry. This phase fixes those. The token is left as it is, by operator decision."
trigger_phrases:
  - "trigger index rebuild hardening"
  - "phase 4 trigger index rebuild hardening"
  - "ci trigger index job hardening"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: trigger-index-rebuild-hardening

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-10-08 |
| **Branch** | `worktrees/091-consolidate-small-packets` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 16 |
| **Predecessor** | 003-archive-path-follow-ups |
| **Successor** | 005-healer-phrase-seeding |
| **Handoff Criteria** | The post-commit `--check` passes with all four files staged, the loop guard matches exactly, and a retry push regenerates and checks the index first |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Research recommendations specification. Research recommendation [SH-04](../../014-spec-auto-healing-research/research/research.md#section-11-row-sh-04) found the rebuild job runs a fine-grained token while checking out and running repository code and stages only one of the four files the generator writes. Commit abb53ecc698 already added `npm ci` and moved the job to Node 22. The operator decided on 2026-10-08 to leave the token as it is (section 10).

**Scope Boundary**: `.github/workflows/trigger-index-rebuild.yml` and its README.

**Dependencies**: None. The phase is independent.

**Deliverables**:
- All four generator outputs staged and checked for completeness.
- A loop guard that matches the rebuild commit exactly, or by a marker, instead of a subject prefix.
- Explicit error handling, and one retry on non-fast-forward that regenerates the index and runs `--check` before it pushes.

**Changelog**: When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The generator writes four tracked files but `.github/workflows/trigger-index-rebuild.yml` diffs and stages only `trigger-index.json` (lines 53-61). The loop guard at line 24 skips a run when the head commit message starts with the rebuild subject, so a renamed subject reopens the loop, and any commit whose subject happens to start that way is skipped. The push gets no retry on non-fast-forward races, and its error text always blames the ruleset.

### Purpose
Make the job commit all four generator outputs, guard its loop exactly, and recover once from a push race with a freshly regenerated and checked index.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Stage all four generator files and add a post-commit `--check`.
- Replace the subject-prefix loop guard with an exact match on the rebuild subject, or a marker trailer the job writes and checks.
- On non-fast-forward: fetch, rebase to the branch tip, regenerate the index, run `--check`, then push once more.
- Distinguish non-fast-forward errors from other failures.
- Document the four files and the retry in the workflow README.

### Out of Scope
- Any change to the token: no `persist-credentials` change, no GitHub environment, no secret move. Decided 2026-10-08 by the operator.
- The `skilled/**` trigger stays.
- Replacing the token with a GitHub App token.
- Changes to the generator itself.
- Changes to validator or other CI jobs.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.github/workflows/trigger-index-rebuild.yml` | Modify | Stage all four outputs, exact or marker loop guard, regenerate-and-check retry, explicit error messages |
| `.github/workflows/README.md` | Modify | Document the four files, the loop guard and non-fast-forward recovery |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-002 | All four generator outputs are staged and verified present before commit |
| REQ-003 | Non-fast-forward errors are distinguished from auth or other failures |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | A non-fast-forward push is retried once after fetching and rebasing to the branch tip, regenerating the index and passing `--check` |
| REQ-006 | The loop guard skips only the job's own rebuild commit, by an exact subject match or a marker trailer |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A local run of `generate-trigger-index.mjs` produces byte-identical output to the CI run.
- **SC-002**: A commit whose subject only starts with the rebuild subject still triggers the job, and the job's own rebuild commit does not.
- **SC-003**: An intentionally stale corpus triggers a rebuild, the job's post-commit `--check` passes, and all four files are in the final commit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The token stays in the checkout credential while repository code runs, on `main` and `skilled/**` | Med | Accepted by the operator on 2026-10-08. No `skilled/**` branch existed on the remote at decision time |
| Risk | A non-fast-forward race is rare but means the job exits cleanly while the index does not update | Med | Retry teaches the job to recover from the race rather than silent failure |
| Risk | The three sidecars (`corpus-manifest.json`, `generation-diagnostics.json`, `phrase-variants.json`) are rarely read and their presence is easy to forget | Med | The post-commit `--check` catches a missing file before the push |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: A non-fast-forward race is retried once before failing.

### Maintainability
- **NFR-M02**: The four files the workflow stages are listed so a future change names them explicitly.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- The generator rewrites the same file path on every run, so no merge conflict occurs.

### Error Scenarios
- No changes to the index: job exits early after the diff check (current behavior).
- Authentication failure on push: error message names the ruleset as the likely cause (current behavior).
- Non-fast-forward on push: fetch, rebase, regenerate, run `--check`, retry once, then fail with a distinct message naming the race.
- A human commit whose subject starts with the rebuild subject: the job still runs.
- Missing sidecar file: post-commit check fails and names the file.

### State Transitions
- A push succeeds: the workflow completes normally.
- A retry succeeds: the workflow completes normally and the log shows one rebase message.
- Both attempts fail: the job exits 1 with the final error message.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One workflow file (file staging, loop guard, retry), README |
| Risk | 10/25 | CI job; a bug breaks the nightly index rebuild; caught immediately if main is active |
| Research | 2/20 | Phase 14 named the issues exactly; no investigation needed |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None open. Decided 2026-10-08 by the operator:

- **The token is left as it is.** No `persist-credentials: false`, no GitHub environment, no secret move, and the workflow keeps its `skilled/**` trigger. The change was considered because the checkout receives `TRIGGER_INDEX_PUSH_TOKEN`, a ruleset-bypass token, with credentials persisted while `generate-trigger-index.mjs` runs from the pushed commit (`trigger-index-rebuild.yml:29-48`), and because no ruleset covers `skilled/**`. Branch protection checked on 2026-10-08 with `gh api repos/{owner}/{repo}/rulesets` and `gh api repos/{owner}/{repo}/branches/main/protection`: two rulesets, both targeting `~DEFAULT_BRANCH` (`main`). `main-protection` (id 11725786) is disabled. `message-contract-required` (id 24326453) is active with one rule, required_status_checks. Classic protection on main returns 404. At decision time `git ls-remote --heads origin` showed no `skilled/**` branch.
- **The rest of the hardening stays:** stage all four generated files, an exact-match or marker loop guard, and regenerate plus `--check` before the retry push.

<!-- /ANCHOR:questions -->

---


