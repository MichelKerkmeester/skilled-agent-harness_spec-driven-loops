---
title: "Feature Specification: Phase 16: authoring-hub-manifests-and-drift"
description: "The skill packager wrote zips into the repository root, the CLI prompt card and several release notes and command hints state counts, flags and links that are wrong, and two sk-doc checkers count or report in ways that hide problems. This phase fixes them and records why the sk-doc leaf manifest needs no change."
trigger_phrases:
  - "authoring hub manifests and drift"
  - "phase 16 authoring hub manifests and drift"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 16: authoring-hub-manifests-and-drift

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
| **Phase** | 16 of 17 |
| **Predecessor** | 015-cli-hub-routing-and-classifier |
| **Successor** | 017-over-engineering-cuts |
| **Handoff Criteria** | sk-doc, sk-design and sk-prompt package checks hold their baselines |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 16** of the v4 release line remediation specification.

**Scope Boundary**: Verified findings V43 and V42 (P2), the packager half of V24 (added by the lead), and the orchestrator-confirmed 002 P2s `f-iter002-002`, `f-iter003-001`, `f-iter001-002`, `f-iter002-001`, `f-iter003-005`, `f-iter004-001`, `f-iter004-002`, `f-iter004-003`, `f-iter006-001`, `f-iter008-002` and `f-iter009-001`.

**Dependencies**:
- None. Phase 015 owns `system-skill-advisor/**` and the doctor routing metadata, which this phase does not edit.

**Deliverables**:
- A packager that cannot write into a repository root, and authoring docs and checkers that state what the code does.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`package_skill.py` without `--check` writes `<skill>.zip` into the working directory, which planted three zips in the repository root. The sk-doc leaf manifest lists five quality-control leaves at packet paths that do not exist. The v4.0.0.0 and v4.0.0.16 notes, the create index, the `/create:changelog` hint, the sk-prompt card and one playbook link state wrong names, counts, flags or paths. sk-design declares a router outcome nothing defines (recorded, not changed), the repo-rule checker's short-stem token inflates the denominator it was added to help, and the packager reports only the first frontmatter error.

### Purpose
Authoring tools write only where they are told, and their docs and checks say what is true.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ sed -n 1839,1845p .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py
    if output_dir:
        output_path = Path(output_dir).resolve()
        ...
        output_path = Path.cwd()

$ ls .skilled/skills/sk-doc/sk-create-quality-control/references/hvr-rules.md
ls: ...: No such file or directory

$ node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/sk-prompt/manual-testing-playbook
  WARN BACKTICK_PATH_UNRESOLVED clear-scoring/forty-of-fifty-threshold.md:82 ... ../../manual-testing-playbook.md

$ sed -n 50p .skilled/commands/create/README.txt
... Author a standalone HTML chart from a catalog of 21 forms, one per reader question |
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Require an output directory to package, and refuse a repository top level (V24 packager half).
- Correct the release notes, create index, changelog hint, prompt card and playbook link (the 002 doc P2s).
- Count a short stem once in the repo-rule coverage and report every frontmatter error in one run (`f-iter009-001`, V42).
- Decide V43 against the leaf-alias design.

### Out of Scope
- `f-iter006-001`, the `opencode` routing tokens on sk-code-skilled - changing advisor vocabulary needs an advisor rebuild and a routing benchmark, and the advisor tree now belongs to phase 015.
- Hand-editing `leaf-manifest.json` - it is generated.
- `f-iter008-002`, sk-design's undefined `none` outcome - removing it changes the hub's policy hash and stales the committed compiled-routing activation manifest, which only its generator may rewrite.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py`, `shared/references/quick-reference.md` | Modify | Output directory required, frontmatter errors |
| `.skilled/changelog/skilled/v4.0.0.0.md`, `v4.0.0.16.md` | Modify | Surface names, DEPTH claim, quality flag |
| `.skilled/commands/create/README.txt`, `changelog.md` | Modify | Chart count, bump values |
| `.skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md`, one playbook scenario | Modify | Card roster and links, playbook path |
| `sk-create-repo-rule/scripts/check-repo-rules.cjs` | Modify | Coverage units |
| `sk-create-skill/references/skill/creation-workflow.md`, `.skilled/skills/README.txt` | Modify | Packager usage |
| Tests beside each | Modify | One case per behaviour |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `package_skill.py <skill>` with no output directory exits 2 and writes no zip; an output directory at a git top level is refused. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | The sk-prompt playbook validator prints no BACKTICK_PATH_UNRESOLVED and the card-sync guard exits 0. |
| REQ-003 | Every corrected doc sentence matches the code or registry it cites. |
| REQ-004 | The sk-design `none` outcome is recorded with the regeneration it needs, and sk-design's compiled routing stays ready. |
| REQ-005 | A short-stem bullet reaches full coverage, and every real repo-rule bullet still passes. |
| REQ-006 | Two frontmatter errors both appear in one packager run. |
| REQ-007 | sk-doc, sk-design and sk-prompt package checks, the sk-doc script tests, root metadata and leaf-manifest freshness hold their baselines. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No authoring script writes into a repository root by default.
- **SC-002**: Every listed check holds or grows its pass count.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A caller packages without an output directory | Low | Callers grepped; the create workflows run `--check` only |
| Risk | Removing a router outcome changes a derived hash | Low | Root metadata and parent-skill checks rerun |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: One `git rev-parse` per packaging run.

### Security
- **NFR-S01**: The packager writes only to the directory it is given.

### Reliability
- **NFR-R01**: `--check` and `--json` behave as before.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: no output directory exits 2.
- Maximum input: a SKILL.md with several frontmatter errors lists them all.
- Failure path: an output directory inside a repository but below its top level still packages.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | About fifteen files, mostly prose |
| Risk | 8/25 | Authoring tools, no runtime path |
| Research | 4/20 | Evidence from the parent synthesis |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. V43, the added V24 scope and the deferral are in `decision-record.md`.
<!-- /ANCHOR:questions -->

---
