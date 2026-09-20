---
title: "Tasks: Remove the openrouter provider from the cli-pi and cli-opencode skills"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "openrouter removal tasks"
  - "classify then edit"
  - "residue sweep verification"
  - "roster narrowing checklist"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Remove the openrouter provider from the cli-pi and cli-opencode skills

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Enumerate every OpenRouter mention with a case-insensitive binary-safe grep over both skill trees. Result: cli-pi 12 lines across 3 files, cli-opencode 13 lines across 6 files, matching the brief's starting figures
- [x] T002 Read every mention in context and assign it a class: live wiring, historical record, or generated artifact
- [x] T003 [P] Check whether any non-markdown file inside either skill carries the token. Result: zero, so nothing needed regeneration
- [x] T004 [P] Check whether OpenRouter is a documented default, fallback or example anywhere in either skill, since that would stop the work
- [x] T005 Capture pre-change baselines: `ci-leaf-manifest-freshness`, `ci-skill-derived-freshness`, `ci-router-vocabulary-reach`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Drop `openrouter` from the provider sentence and change seven to six (`cli-pi/SKILL.md`)
- [x] T007 Cut the `### openrouter` section and its two rows; de-reference the roster sourcing note, both `cline-pass` rows and the DevPass fan-out rationale (`cli-pi/references/providers-and-models.md`)
- [x] T008 Drop the advisor keyword, change seven to six, and reduce the id-shape footgun to the two remaining shapes (`cli-opencode/SKILL.md`)
- [x] T009 Cut the `### openrouter` section and its two rows; repoint the GLM-5.3-Flash-on-Cline callout at `opencode-go` and `llmgateway` (`cli-opencode/references/providers-and-models.md`)
- [x] T010 Remove the OpenRouter login line from the all-providers-missing pre-flight tree (`cli-opencode/references/cli-reference.md`)
- [x] T011 [P] Drop OpenRouter from the retired-CO-011 coverage note and the CO-012 scenario prose (`cli-opencode/manual-testing-playbook/`)
- [x] T012 Bump the frontmatter version on all seven edited docs
- [x] T013 Write one changelog entry per skill, each naming what was deliberately not changed (`cli-pi/changelog/v1.5.1.0.md`, `cli-opencode/changelog/v1.4.4.0.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Residue sweep: `grep -rani openrouter` over both skills. Expected exactly three hits, all under `changelog/`
- [x] T015 Confirm the changelogs are byte-identical via `git diff --name-only`
- [x] T016 Re-run all three CI checkers and compare the `cli-external-orchestration` row against its baseline
- [x] T017 Run the deep-loop roster unit tests as a negative control, proving no runtime file moved
- [x] T018 Confirm `git diff --name-only` lists no non-markdown file and no file outside the two skills
- [x] T019 Run `validate.sh <packet> --strict` and require an explicit `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
