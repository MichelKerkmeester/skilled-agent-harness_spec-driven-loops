---
title: "Feature Specification: Harden CI mirror parity at commit time and remediate Dependabot alerts"
description: "Spec-Kit Check failed fifteen pushes in a row on a regenerated but unstaged codex prompt mirror, and forty-four open Dependabot alerts sat on the default branch. The pre-commit hook gated one of the six mirror checks CI runs, the workflow only triggered on the spec-kit runtime, and no packet owned dependency hygiene."
trigger_phrases:
  - "ci mirror parity"
  - "runs failed emails"
  - "spec-kit check failing"
  - "dependabot alerts"
  - "pre-commit mirror gate"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Harden CI mirror parity at commit time and remediate Dependabot alerts

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-07 |
| **Branch** | `skilled/v4.0.0.0` (also on `main`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The operator received a "runs failed" email on every push for days. Fifteen consecutive Spec-Kit Check runs were red, fourteen of them on a single cause: the codex prompt mirror had been regenerated after a command rename but never staged. Nothing at commit time caught it, because the pre-commit hook ran one of the six mirror-parity checks CI runs. Nothing on the causing push caught it either, because the workflow only triggered on the spec-kit runtime path, so the drift surfaced on whoever next touched the runtime. Separately, GitHub reported forty-four open Dependabot alerts on the default branch with no packet owning them.

### Purpose
A commit that would fail CI's mirror job cannot be made, CI runs on the commit that causes mirror drift rather than a later one, and the open Dependabot count reaches zero.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The pre-commit hook runs the same six mirror checks the CI mirror job runs and blocks on any unstaged or untracked change under a generated mirror output.
- The Spec-Kit Check workflow triggers on every mirror source and every mirror output.
- The command catalog and the sk-design hub metadata match the chart and diagram commands that moved under `design/`.
- Every open Dependabot alert is either fixed by a lockfile update or dismissed with a written reason.

### Out of Scope
- GitHub's failure-email preference - it is a per-user UI setting with no API; the operator flips it.
- Direct dependency upgrades - every alert was transitive and fixable within the current semver ranges.
- The other session's in-flight advisor corpus edits - untouched under the shared-checkout rule.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/scripts/git-hooks/pre-commit` | Modify | Unified six-check mirror-parity gate plus an unstaged-output check |
| `.github/workflows/spec-kit-check.yml` | Modify | Trigger paths widened to mirror sources and outputs on push and pull_request |
| `.opencode/commands/README.txt` | Modify | Chart and diagram rows moved to the design group, counts corrected |
| `.opencode/skills/sk-design/command-metadata.json` | Modify | `/design:extract` entry description and argument hint repaired |
| `package-lock.json` | Modify | `qs` lifted past the advisory range |
| `.opencode/package-lock.json` | Modify | `fast-uri` and `toml` lifted past their advisory ranges |
| `.opencode/skills/system-skill-advisor/mcp-server/package-lock.json` | Modify | `fast-uri` and `qs` lifted |
| `.opencode/skills/mcp-code-mode/mcp-server/package-lock.json` | Modify | `fast-uri` and `qs` lifted |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A commit whose generated mirrors would fail any of CI's six mirror checks is refused at pre-commit with a message naming the failing check. |
| REQ-002 | A commit is refused when a generated mirror output carries unstaged or untracked changes. |
| REQ-003 | Spec-Kit Check runs on a push that touches only a command, agent, hub metadata, or mirror output. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Zero open Dependabot alerts on the default branch, each closure traceable to a lockfile change or a dismissal reason. |
| REQ-005 | Every package whose lockfile changed still installs and its test suite still passes. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Spec-Kit Check is green on both `main` and `skilled/v4.0.0.0` for the hardening commit.
- **SC-002**: The four-shape gate test (clean, unregenerated, regenerated-untracked, incomplete catalog) blocks exactly the three shapes CI would fail.
- **SC-003**: `gh api .../dependabot/alerts?state=open` returns an empty list.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Node on the committing machine | The gate skips silently without `node` | The hook checks `command -v node` and the CI job remains the backstop |
| Risk | Gate slows every commit | Six checks add latency | Measured combined runtime is under a quarter of a second; `SPECKIT_SKIP_MIRROR_PARITY=1` exists for emergencies |
| Risk | Lockfile bump breaks a package | Runtime regression in an MCP server | Each package reinstalled and tested; advisor suite run as a negative control against the HEAD lockfile |
| Risk | Dismissed alerts hide a real exposure | Vendored snapshot is later executed | Dismissal comments state the condition under which they must be reopened |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The mirror-parity gate adds under one second to a commit on a warm checkout.

### Security
- **NFR-S01**: No dependency remains inside a published advisory range in any installed manifest.

### Reliability
- **NFR-R01**: The gate fails closed: a check that errors, not just one that reports drift, blocks the commit.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a commit touching no mirror source or output passes the gate in the same run time.
- Maximum length: a rename that regenerates mirrors across all five runtime trees is caught by the unstaged-output scan.
- Invalid format: a check script that is missing from the checkout is skipped, since the CI job would fail on it anyway.

### Error Scenarios
- External service failure: none; the gate is local.
- Network timeout: not applicable.
- Concurrent access: another session's unstaged mirror edits block this session's commit by design, so the shared checkout cannot ship half a mirror.

### State Transitions
- Partial completion: a regenerated mirror that is staged in part fails the catalog check with the same message CI would print.
- Session expiry: not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Eight files, roughly two hundred lines |
| Risk | 6/25 | Shared hook and shared lockfiles; no auth, API or schema change |
| Research | 4/20 | Root cause read from the CI run logs |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The one item outside this packet's reach, the email preference, is the operator's.
<!-- /ANCHOR:questions -->

---
