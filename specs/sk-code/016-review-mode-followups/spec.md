---
title: "Feature Specification: sk-code-review follow-ups"
description: "Six still-open recommendations from the sk-code-review research: a review cache key with no remote, a quality-evidence header, a user-mode review contract, a summary-versus-status check, live finding-accuracy scenarios, repository-neutral examples and path-only workflow routing."
trigger_phrases:
  - "review mode followups"
  - "sk code review follow ups cache key fallback"
  - "overall assessment contradicts status line"
  - "path-only workflow review routing"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: sk-code-review follow-ups

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-27 |
| **Branch** | `worktrees/230-review-mode-followups` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-code-review research left six recommendations open after the operator closed the repo review profile. A review of only a workflow file path dropped the review mode, a report could state one verdict in its summary and another on its status line and still pass, the PR-state cache key needed an `origin` remote, and nothing measured whether a live review finds real defects.

### Purpose
Close ranks 4, 6, 8, 9, 10, 11 and 12 of `specs/sk-code/014-code-modes-research/002-review-mode-research/research/research.md` section 6, and align the agents and commands that consume the review mode.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "review .github/workflows/ci.yml"
{"hubId":"sk-code","action":"route","selectionKind":"single","targets":[{"backendKind":"evidence-base","packetId":"sk-code-ci",...}]}
$ node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "review this GitHub Actions workflow"
{"hubId":"sk-code","action":"route","selectionKind":"surfaceBundle","targets":[{"packetId":"sk-code-review",...},{"packetId":"sk-code-ci",...}]}
$ rg -n 'remote get-url|repo-ref' -g '!specs/**' .
SKILL.md:532 and references/pr-state-dedup.md:47 only: no code computes the key, and neither doc names a fallback
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove the duplicate `.github/workflows/` CI keyword so a path-only workflow review bundles review and CI, then regenerate the routing artifacts.
- Make `check-review-final-line.js` fail a report whose Overall assessment contradicts its status line, with a fixture and tests.
- Add the `Quality gate evidence: present|absent` header line, the no-remote cache-key fallback and pathspec scope, and the user-authored mode review contract to the mode docs.
- Add four playbook scenarios, three for live finding accuracy and one for a user surface through both routing stages, and run the finding-accuracy three live.
- Reword repository-bound examples, align the review agent, bump versions and write changelogs.
- Reopened: add a reach calibration to the severity rules so a P0 or P1 must name an input the code's stated contract allows or a real caller, keep every restatement in step, let the clean control allow a NaN hardening note at P2, and rerun the finding-accuracy scenarios three times each.

### Out of Scope
- Ranks 1, 3 and 5 (repo review profile, profile surface evidence, extensible never-skip list) - the operator closed them.
- A row in `parent-skills-nested-packets.md` section 7 - research rank 8 names it as owned by a packet outside this hub.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/hub-router.json`, `ROUTER.md` | Modify | Drop the duplicate workflow path keyword, raise versions |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` and its archived twin | Modify | Refreshed activation manifest |
| `.skilled/bin/tests/compiled-route-surface-hint.test.cjs` | Modify | Path-only workflow review regression test |
| `.skilled/skills/sk-code/sk-code-review/SKILL.md` | Modify | Header line, summary agreement, cache key, neutral paths, user-authored modes |
| `.skilled/skills/sk-code/sk-code-review/references/pr-state-dedup.md` | Modify | No-remote fallback and pathspec scope |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js` | Modify | Overall assessment comparison |
| `.skilled/skills/sk-code/sk-code-review/scripts/review-output-fixture/*`, `scripts/tests/check-rule-copies.test.sh`, `scripts/README.md` | Create/Modify | Contradictory fixture, header line, tests, packet-relative commands |
| `.skilled/skills/sk-code/sk-code-review/manual-testing-playbook/**` | Create/Modify | CR-025 to CR-028 and the root index |
| `.skilled/skills/sk-code/sk-code-review/benchmark/reports/**` | Create/Modify | Live finding-accuracy run folder and index row |
| `.skilled/agents/review.md` and runtime mirrors | Modify | Summary agreement paragraph |
| Version carriers and changelogs for sk-code-review and the sk-code hub | Modify/Create | Patch releases |
| `.skilled/skills/sk-code/sk-code-review/references/review-core.md`, `SKILL.md`, `README.md`, `.skilled/agents/review.md` and runtime copies | Modify | Reach calibration and its restatements |
| `.skilled/skills/sk-code/sk-code-review/manual-testing-playbook/finding-accuracy/clean-control.md`, `benchmark/reports/2026-10-27--finding-accuracy-calibrated--live/` | Modify/Create | Allowed P2 note and the rerun report |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "review .github/workflows/ci.yml"` returns `surfaceBundle` with `sk-code-review` then `sk-code-ci`, and a test pins it. |
| REQ-002 | `check-review-final-line.js` exits 1 on a report whose Overall assessment names a different status than its final line, and the contradictory fixture and test cases pass the harness. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | `SKILL.md` section 9.1 and `pr-state-dedup.md` document a root-path fallback when `origin` is absent and an optional pathspec scope. |
| REQ-004 | The report template carries `**Quality gate evidence**: [present \| absent]` and says no baseline check is skipped, and the valid fixtures carry the line. |
| REQ-005 | `SKILL.md` documents the review side of a user-authored mode, and scenario CR-028 replays a user security surface through both routing stages. |
| REQ-006 | Live finding-accuracy scenarios exist and a live run records executor, model, duration and tokens, and the playbook scenario count is reconciled. |
| REQ-007 | `SKILL.md` and `scripts/README.md` hold no `.skilled/` path. |
| REQ-008 | The agents and commands that consume the review mode are checked and aligned, with mirrors regenerated. |
| REQ-009 | `references/review-core.md` section 2 requires a P0 or P1 to name its reach, holds out-of-contract input at P2 unless the code claims to validate it, and limits the low-confidence escalation rule to findings whose reach is named. SKILL.md, README.md and the review agent with its runtime copies restate it in agreement. |
| REQ-010 | The clean-control scenario states that a NaN or non-number hardening note is an allowed P2, and the playbook validator passes. |
| REQ-011 | The three finding-accuracy scenarios run live three times each on the first run's executor, plus one supplemental run without the range guard, and a new report folder records per-run verdict, duration and tokens. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both compiled-route prompts in section 2 return `surfaceBundle` with `sk-code-review, sk-code-ci`.
- **SC-002**: `bash .skilled/skills/sk-code/sk-code-review/scripts/tests/check-rule-copies.test.sh` ends `All rule-canary test cases passed`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The llmgateway DeepSeek endpoint for the live run | Without it D4 cannot be measured | Run recorded with its date; a failed run would be marked NOT RUN |
| Risk | Removing a CI keyword changes other prompts that name a workflow path | Med | Replayed the quality, fix and review path prompts; the quality prompt now matches its own scenario's `single` route |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A. The checker adds one linear pass over the report lines.

### Security
- **NFR-S01**: The review mode still writes only its cache file, outside the reviewed repository.

### Reliability
- **NFR-R01**: The cache-key fallback can only cause a cache miss and a full review, never a skipped review.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a report with no Overall assessment line passes the new comparison unchanged.
- Maximum input: a template placeholder value such as `[APPROVED / REQUESTED_CHANGES / COMMENTED]` is not compared.
- Failure path: a contradiction exits 1 with `Overall assessment "<value>" contradicts the final status line "Review status: <token>"`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | About 30 files across one mode, the hub router, one agent and mirrors |
| Risk | 8/25 | One routing vocabulary change, replayed against neighbouring prompts |
| Research | 6/20 | Recommendations came from a finished research packet |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The clean-control false positive was settled in favour of the scenario: the severity rules now require a reachable input for a blocker, and the clean control allows the NaN note at P2.
<!-- /ANCHOR:questions -->

---
