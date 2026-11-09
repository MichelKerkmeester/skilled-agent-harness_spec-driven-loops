---
title: "Feature Specification: Phase 9: gate3-and-continuity-root"
description: "Gate 3 depends on word order and lets a read-only word cancel a resume, a save outside any spec-kit repository writes into the Skilled checkout, and the CLI writer and create.sh templates resolve from the wrong place. This phase fixes all five."
trigger_phrases:
  - "gate3 and continuity root"
  - "phase 9 gate3 and continuity root"
  - "gate 3 word order"
  - "project root fallback"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 9: gate3-and-continuity-root

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-08 |
| **Branch** | `worktrees/334-v4-release-remediation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 17 |
| **Predecessor** | 008-write-containment-scoping |
| **Successor** | 010-validate-and-retrieval-exit-honesty |
| **Handoff Criteria** | The four Gate 3 probe prompts classify as listed in REQ-001 and REQ-002, and the spec-kit suites hold their baseline counts |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the v4 release line remediation specification.

**Scope Boundary**: The verified findings V25, V26, V27, V28 and V29 from `../research/research.md` section 2. Nothing else in the classifier, the continuity writer or `create.sh` changes.

**Dependencies**:
- None. Phase 010 depends on this one because both touch the spec-kit runtime.

**Deliverables**:
- An order-independent Gate 3 classifier where a resume instruction fires next to a read-only word
- A save that refuses an unknown project root instead of writing into the Skilled checkout
- An install probe and repair text that cover the CLI writer
- `create.sh` templates resolved from its own skill
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Gate 3 fires for "Review the README and update it." but not for "Update the README and review the result.", and a read-only word cancels a resume instruction such as "review the packet and resume". A save started outside any spec-kit repository silently writes into the Skilled checkout, the install probe never checks the CLI writer that `/speckit:save` runs, and `create.sh` looks for templates in the caller's repository while it loads its libraries from its own.

### Purpose
Gate 3 decides on what a prompt asks, never on word order, and every continuity write lands in the repository the operator is working in or is refused.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node g3probe.mjs shared/dist/gate-3-classifier.js
"Update the README and review the result." false read_only_override
"Review the README and update it." true file_write_match
"resume the packet" true resume_match
"review the packet and resume" false no_match

$ node -e "import('runtime/cli/dist/core/config.js').then(m=>console.log(m.resolveProjectRoot('<scratch>/norepo')))"
[spec-kit] <scratch>/norepo is not inside a repository that uses spec-kit; using the runtime repository /Users/michelkerkmeester/worktrees/public/334-v4-release-remediation as the project root

$ cd <scratch>/v29repo && bash .../runtime/cli/spec/create.sh --level 1 --short-name probe "probe feature"
Error: Templates directory not found at <scratch>/v29repo/.skilled/skills/system-spec-kit/templates

$ git check-ignore -v .skilled/skills/system-spec-kit/runtime/cli/dist
.gitignore:60:dist/	.skilled/skills/system-spec-kit/runtime/cli/dist
$ sed -n 34p .skilled/commands/doctor/assets/doctor-install.yaml
  spec_kit_build_check: "test -d .skilled/skills/system-spec-kit/runtime/dist (...)"
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Make the read-only override in `gate-3-classifier.ts` independent of whether the write verb comes before or after the read-only verb (V25).
- Make a resume instruction ("... and resume", "... then resume", a prompt that starts with resume) require Gate 3 even when a read-only word is present, while a read-only question about resume stays quiet, as the labeled corpus requires (V26).
- Make `/doctor:install` probe the CLI writer and make the repair text `validate.sh` prints build every workspace the runtime needs (V27).
- Refuse a save whose project root would fall back to the runtime repository, unless `--project-root` names one (V28).
- Resolve `create.sh` templates and the inline gate renderer from the script's own skill, and document `SPECKIT_TEMPLATES_BASE` (V29).

### Out of Scope
- Tracking `runtime/cli/dist` in git - a generated build stays gitignored; the fix is to probe and build it.
- New Gate 3 vocabulary or new trigger words - not part of any verified finding.
- The labeled corpus's four existing disagreements (rr-iter2-018, rr-iter2-059, rr-iter3-085, rr-iter3-183) - present before this phase and not in the verified set.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/shared/gate-3-classifier.ts` | Modify | Order-independent mixed write tail; resume not cancelled by a read-only word |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/gate-3-classifier.vitest.ts` | Modify | Probe prompts for both orders and the resume case |
| `.skilled/skills/system-spec-kit/runtime/cli/core/config.ts` | Modify | Mark a fallback project root so a writer can refuse it |
| `.skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts` | Modify | Refuse a fallback root unless `--project-root` is given |
| `.skilled/commands/doctor/assets/doctor-install.yaml` and `doctor-install-presentation.txt` | Modify | Probe the CLI writer as well as the runtime build |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` | Modify | Repair text builds all spec-kit workspaces |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modify | Templates and renderer from the script's own skill |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modify | Document `SPECKIT_TEMPLATES_BASE` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `classifyPrompt("Update the README and review the result.")` and `classifyPrompt("Review the README and update it.")` both return `triggersGate3: true`. |
| REQ-002 | `classifyPrompt("review the packet and resume")` returns `triggersGate3: true`, and `classifyPrompt("review the packet")` still returns `false`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | A save run whose working directory is outside any spec-kit repository exits non-zero, names `--project-root`, and writes nothing into the runtime repository. |
| REQ-004 | `/doctor:install` checks `runtime/cli/dist/continuity/generate-context.js` in addition to `runtime/dist`, and `validate.sh`'s missing or stale build text names a command that builds `runtime/cli`. |
| REQ-005 | `create.sh` run inside a repository with no `.skilled` tree finds its templates and creates the folder; `SPECKIT_TEMPLATES_BASE` still overrides the location and is documented. |
| REQ-006 | The labeled Gate 3 corpus agrees with its labels on at least the 191 of 195 rows it agreed on before the change. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The four probe prompts in Measured Behavior all return `triggersGate3: true` after the change, and `review the packet` stays `false`.
- **SC-002**: The spec-kit cli vitest project, the spec-gate hook test and the validation shell suites hold their baseline pass counts.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `shared/dist` build, which the hooks import | A source change has no effect until rebuilt | Rebuild `shared` in the worktree before running the hook test and corpus |
| Risk | Widening the mixed-tail rule fires Gate 3 on read-only prompts that mention a write word | Med | Score the 195-row labeled corpus before and after; no row that agreed may flip |
| Risk | Refusing the fallback root breaks a caller that relied on it | Med | Refuse only in the save path; read-only tools keep the fallback and its stderr note |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: the classifier stays a single regex pass over one prompt; no measured budget applies.

### Security
- **NFR-S01**: A save never writes outside the repository the operator named or is working in.

### Reliability
- **NFR-R01**: Every refusal exits non-zero with a message naming the fix.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an empty prompt still classifies `no_match`, `triggersGate3: false`.
- Maximum input: a prompt with several write and read-only verbs fires when any write verb is joined to a read-only verb by `and`, `then`, `if` or a comma, in either order.
- Failure path: a save with a fallback root exits non-zero before taking the save lock.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Eight files across classifier, continuity writer, create.sh and two doctor assets |
| Risk | 16/25 | Gate 3 runs on every session prompt |
| Research | 4/20 | Findings and evidence come from the parent synthesis |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Design decisions are in `decision-record.md`.
<!-- /ANCHOR:questions -->

---
