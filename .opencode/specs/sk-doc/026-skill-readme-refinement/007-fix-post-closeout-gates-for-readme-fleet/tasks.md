---
title: "Tasks: Fix post-closeout gates for the README fleet"
description: "Evidence-backed work plan for restoring global documentation gates and aligning the CLI mode README family."
trigger_phrases:
  - "README fleet remediation tasks"
  - "link guard repair tasks"
  - "CLI README alignment tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/007-fix-post-closeout-gates-for-readme-fleet"
    last_updated_at: "2026-08-05T08:05:14Z"
    last_updated_by: "phase-executor"
    recent_action: "Closed out link, version, and CLI README remediation"
    next_safe_action: "Regenerate metadata and run strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-fix-post-closeout-gates-for-readme-fleet"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Fix post-closeout gates for the README fleet

<!-- SPECKIT_LEVEL: 3 -->

---
<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---
<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create the Level-3 remediation phase and capture the live baseline. [evidence: `create.sh`, `96` broken reports, `6` missing versions]
- [x] T002 Read the global link-guard exception policy and frontmatter version standard. [evidence: `check-markdown-links.cjs`, `frontmatter-versioning.md`]
- [x] T003 Read the CLI hub and `cli-opencode` contracts before planning README changes. [evidence: `cli-external-orchestration/SKILL.md`, `cli-opencode/SKILL.md`]
- [x] T004 [P] Classify every link report as a real target repair, exact template placeholder, or intentionally invalid fixture. [evidence: `classification` matrix: `25` repairs, `11` pairs, `2` classes]
- [x] T005 [P] Derive the six missing frontmatter versions from their nearest skill anchors. [evidence: `frontmatter-version.mjs compute` `6` rows]
<!-- /ANCHOR:phase-1 -->

---
<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Repair every real relative target in the reported source documents. [evidence: global link guard `0 broken`]
- [x] T007 Add narrowly scoped guard exceptions for intentional fixtures and copy-time template placeholders. [evidence: `--self-test` `6/6`, guard diff]
- [x] T008 Insert six compliant four-part version fields line-wise. [evidence: version gate `ok=3233`]
- [x] T009 Compare all six CLI child README claims to their local `SKILL.md` contracts. [evidence: `comparison` matrix over `6` modes]
- [x] T010 Update `cli-opencode` identity, full sibling matrix, version, and changelog entry. [evidence: README validator `0 issues`]
- [x] T011 Align the sibling CLI READMEs with the same reader-facing navigation standard and release records. [evidence: `3/3` validators, sibling tables `6/6`]
<!-- /ANCHOR:phase-2 -->

---
<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run the link guard self-test and full global guard twice. [evidence: `--self-test` `6/6`, two `0 broken` runs]
- [x] T013 Run the frontmatter-version gate twice. [evidence: two `ok=3233` runs]
- [x] T014 Run README and changelog checks across all six CLI modes. [evidence: `6/6` validators, changelog heads `3/3`]
- [x] T015 Update parent phase map, regenerate child and parent metadata, and validate the packet. [evidence: `validate.sh --strict`]
- [x] T016 Write the final implementation summary and reconcile this task list and checklist. [evidence: `closeout` records reconciled]
<!-- /ANCHOR:phase-3 -->

---
<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remain.
- [x] Global link and version gates pass deterministically.
- [x] CLI README family validators pass.
- [x] Parent and phase records validate with zero errors.
<!-- /ANCHOR:completion -->

---
<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Verification Checklist**: See `checklist.md`.
- **Decision Record**: See `decision-record.md`.
<!-- /ANCHOR:cross-refs -->
