---
title: "Tasks: ClickUp doc divider spacing on API-written pages"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "clickup doc divider spacing tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: ClickUp doc divider spacing on API-written pages

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`M` is `.skilled/skills/mcp-tooling/mcp-click-up`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Measure the gap on API-written and editor-built pages (Code Mode, docs `2kyq4d0p-147395` and `2kyq4d0p-102035`). Verify: the `"text/plain"` read-backs differ as `spec.md` records, and the `"text/md"` read-backs match.
- [x] T002 Prove the editor fix on 65 pages (`mcp-chrome-devtools`). Verify: 0 gaps left and 65 of 65 markdown read-backs equal to their baseline.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the divider subsection, the ID fields and the no-delete note (`M/references/mcp-tools.md`). Verify: `rg -n 'Divider spacing on pages the server writes' M/references/mcp-tools.md` prints one line.
- [x] T004 Add the symptom entry (`M/references/troubleshooting.md`). Verify: `rg -n 'extra blank line under every divider' M/references/troubleshooting.md` prints one line.
- [x] T005 Add the contract line and bump to 1.2.10.0 (`M/SKILL.md`). Verify: `rg -n 'Doc page dividers|^version: 1.2.10.0' M/SKILL.md` prints two lines.
- [x] T006 Write the release note (`M/changelog/v1.2.10.0.md`). Verify: the file exists with `version: 1.2.10.0`.
- [x] T007 Regenerate the Hermes copy (`.hermes/skills/mcp-click-up/SKILL.md`). Verify: `sync-skills-hermes.cjs --check` prints `PASS: 65 Hermes skill copies in sync`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Validate the changed docs (`validate_document.py`). Verify: both references and the changelog report 0 issues. `SKILL.md` keeps its one existing warning about section 0.
- [x] T009 Validate the package (`validate_skill_package.py M`). Verify: `package_skill.py --check: PASS`.
- [x] T010 Check the route (`compiled-route.cjs --hub mcp-tooling`). Verify: the divider prompt routes to `mcp-click-up` with policy hash `360bf02a...`, unchanged.
- [x] T011 Move the compiled-routing directive back into section 5 and release the hubs (`mcp-tooling/ROUTER.md`, `sk-doc/ROUTER.md`, versions 1.9.5.0 and 2.4.3.0). Verify: `validate_skill_package.py` prints `compiled-ready: PASS` for both hubs, where it printed `Missing directive markers` before.
- [x] T012 Run the sk-create-skill fleet checks. Verify: `ci-leaf-manifest-freshness`, `ci-skill-derived-freshness`, `ci-skill-root-metadata` and `validate-playbook-topology` exit 0, and `package_skill.py --check --strict` passes on both hubs and on `mcp-click-up`.
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
