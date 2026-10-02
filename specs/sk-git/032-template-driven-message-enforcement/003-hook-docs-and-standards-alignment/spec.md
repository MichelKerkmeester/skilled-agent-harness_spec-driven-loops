---
title: "Feature Specification: Phase 3: hook-docs-and-standards-alignment"
description: "A read-only audit of the git hook changes found docs, code READMEs and the env reference out of step with the hooks, plus three gaps against the sk-code-opencode standards."
trigger_phrases:
  - "hook docs alignment"
  - "env reference hook switches"
  - "spec trailer containment"
  - "staged blob read failure"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: hook-docs-and-standards-alignment

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-02 |
| **Branch** | `worktrees/075-git-hook-review-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-git-hook-review-residuals |
| **Successor** | None |
| **Handoff Criteria** | Every hook switch the code reads is in ENV-REFERENCE.md, the hook suites and sk-git node tests pass, and validate.sh --strict passes on this child and the parent. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the git hook review work in this packet.

**Scope Boundary**: The findings of a read-only GPT-6 Luna audit of the hook changes (`scratch/audit-report.md`) that hold up against the code, and every git hook switch missing from ENV-REFERENCE.md.

**Dependencies**:
- Phases 1 and 2, committed in this worktree.

**Deliverables**:
- Two shell fixes and one validator fix, with a test for the validator.
- Doc, README and env reference updates across the root README, sk-git, the hook READMEs, sk-code-quality and bin/lib.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The hook changes in phases 1 and 2 left their docs behind. The root README says pre-push blocks stale metadata and re-checks every pushed commit, and the remote-branch policy says a bare `SPECKIT_ALLOW_REMOTE_PUSH=1` can create a branch; the code does neither. The standalone hook README still describes a per-file, fail-open checker. Fourteen switches the hooks read are missing from ENV-REFERENCE.md. In code, a `Spec:` value such as `../README.md` passes the existence check, and both pre-commit hooks skip a staged file whose content cannot be read and leave their temp directory behind on an early exit.

### Purpose
Every doc and README that describes the hooks says what the hooks do, every hook switch is in the env reference, and the three code gaps are closed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Both pre-commit hooks block on an unreadable staged blob (a submodule entry is skipped) and clean their temp directory on any exit.
- A `Spec:` trailer that leaves the packet root fails `trailer.spec-exists`.
- Root README, remote-branch policy, both hook READMEs, two sk-git feature-catalog entries, the commit template's rule table, sk-git SKILL.md, two code-folder READMEs and the installer's closing output.
- Fourteen git hook switches added to ENV-REFERENCE.md, and the pre-push live-branch exception on `SPECKIT_AUTOSYNC` and `SPECKIT_LIVE_BRANCH`.

### Out of Scope
- Narrowing the Commit-Id copy rule to tree and message, which the audit proposed. A rebase onto a new base changes the tree, so every real copy would read as a collision. The docs now state the rule the code uses.
- Setting the V8 regex fallback in host processes that import the gate (OpenCode plugin, Pi adapter). Phase 2 set it only in processes the hooks start, on purpose.
- The audit's claim that the hook README's "Fails safe (exits 0) if `worktree-naming.sh` fails to source" is wrong: the code fails open on a source failure and blocks only when the script is missing, which the README already says.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/scripts/git-hooks/pre-commit`, `.skilled/hooks/git/pre-commit` | Modify | Unreadable blob blocks; cleanup trap |
| `.skilled/skills/sk-git/scripts/lib/message-contract.mjs`, `message-contract.test.mjs` | Modify | Spec containment and its test |
| `README.md`, `.skilled/scripts/git-hooks/README.md`, `.skilled/hooks/git/README.md` | Modify | Hook behavior |
| `.skilled/skills/sk-git/{SKILL.md,assets/commit-message-template.md,references/remote-branch-policy.md,feature-catalog/...}` | Modify | Remote gate, pushed range, Commit-Id copy rule |
| `.skilled/skills/sk-code/sk-code-quality/scripts/README.md`, `.skilled/bin/lib/README.md` | Modify | Code-folder READMEs |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modify | Hook switches |
| `.skilled/scripts/install-git-hooks.sh` | Modify | Trust note in the closing output |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-001 | Both pre-commit hooks block when a staged file's content cannot be read, skip a submodule entry, and remove their temp directory on every exit. |
| REQ-002 | A `Spec:` trailer whose path leaves the packet root fails `trailer.spec-exists`. |
| REQ-003 | Every `SPECKIT_*` and `SYSTEM_*` switch the git hooks and their libraries read appears in ENV-REFERENCE.md. |
| REQ-004 | The root README, the remote-branch policy, both hook READMEs, the sk-git catalog entries, template and SKILL.md describe the remote gate, the pushed range, the metadata warning, the trust setting and the Commit-Id copy rule as the code implements them. |
| REQ-005 | The sk-code-quality scripts README and the bin/lib README describe the changed checker and layout export. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A script that lists every hook switch the code reads finds none missing from ENV-REFERENCE.md.
- **SC-002**: All hook suites, the sk-git node tests, the skill-root metadata gate and the route guard pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Blocking on an unreadable blob blocks submodule commits in other repositories | Med | Mode `160000` entries are skipped; checked in a scratch repository |
| Risk | A doc fix copies an audit claim that is wrong | Med | Each claim checked against the hook code first; one refuted and two adjusted |
| Dependency | DeepSeek V4.1 Flash via cli-pi on opencode-go | Edits stall | One file per brief, literal text; every diff read before the next |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The blob-read change adds one `git ls-files` call only when a read fails.

### Security
- **NFR-S01**: No staged file escapes the comment check because its content could not be read.

### Reliability
- **NFR-R01**: The temp directory is removed even when a gate exits early.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- `Spec: sk-git/../../README.md` normalizes outside `specs/` and fails, like `Spec: ../README.md`.

### Error Scenarios
- A staged submodule whose commit is not in the repository: `git show` fails, the mode check sees `160000`, and the entry is skipped.

### State Transitions
- A gate exits 1 part way through the hygiene loop: the EXIT trap removes the temp directory.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | About 16 files, mostly docs |
| Risk | 8/25 | Two hook edits |
| Research | 8/20 | Every audit claim checked in code |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
