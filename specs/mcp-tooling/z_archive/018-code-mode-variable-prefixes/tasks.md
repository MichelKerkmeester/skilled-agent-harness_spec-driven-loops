---
title: "Tasks: Code Mode manual variable prefixes"
description: "Ordered work for repairing the credential lookups that kept four manuals from registering."
trigger_phrases:
  - "code mode variable prefix tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Code Mode manual variable prefixes

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

- [x] T001 Record the pre-change failure set from a fresh server — evidence: `clickup_official`, `magicpath`, `notion`, `obsidian` and `webflow` all reported `Error during batch registration`, which is why an earlier `list_tools` returned an empty array
- [x] T002 Confirm the prefixing rule against the owning skill — evidence: `mcp-code-mode/INSTALL-GUIDE.md` states `{manual_name}_{VAR}` and tables `figma` + `${FIGMA_API_KEY}` needing `figma_FIGMA_API_KEY`; `SKILL.md` repeats it as a warning
- [x] T003 Probe the undocumented part of the rule — evidence: registering a manual named `probe_under_score` referencing `${FOO_BAR}` produced the lookup `probe__under__score_FOO_BAR`, so each underscore in the manual NAME doubles while the variable name is untouched
- [x] T004 [P] Compute the exact lookup key for every credentialed manual and compare against the environment file — evidence: `figma` and `github` resolved; `notion`, `obsidian`, `clickup_official` and `webflow` did not
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Strip the duplicated prefix from the wrong references (`.utcp_config.json`) — evidence: `${notion_NOTION_TOKEN}` became `${NOTION_TOKEN}` and the three `${obsidian_OBSIDIAN_*}` references became bare, so their lookups now match the keys already present
- [x] T006 Add the two keys the ClickUp manual needs (`.env`) — evidence: `clickup__official_CLICKUP_API_KEY` and `clickup__official_CLICKUP_TEAM_ID` copied programmatically from the existing `clickup_CLICKUP_*` pair, values never displayed
- [x] T007 [P] Reject renaming `clickup_official` — evidence: `mcp-click-up/INSTALL-GUIDE.md` documents its tool names as `clickup_official.clickup_official_*`, so a rename would break every documented call site
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Start a fresh server against the real configuration and read every registration line — evidence: `notion` registered 24 tools and `obsidian` 12, both previously failing
- [x] T009 Confirm no working manual regressed — evidence: `aside`, `chrome_devtools_1/2`, `figma`, `github`, `gitkraken`, `magnific`, `mobbin` and `refero` all still registered
- [x] T010 Confirm the ClickUp variable error is gone — evidence: its `Variable ... not found` line no longer appears; it now fails on `npm error 404 ... @clickup/mcp-server`, an unrelated missing upstream package
- [x] T011 [P] Confirm no secret reached a tracked file — evidence: `.env` is gitignored and `git status` reports zero tracked changes from it
- [x] T012 State what remains and why — evidence: `webflow` has no credential recorded anywhere, and the ClickUp package is not served by the registry; neither is repairable from this repository
- [x] T013 Document the rule and every required key in `.env.example` — evidence: the prefix comment now states the underscore doubling with the `clickup__official_CLICKUP_API_KEY` example; `clickup__official_*` and `webflow_WEBFLOW_TOKEN` added; the MagicPath entry replaced by a note that no key belongs there
- [x] T014 Cross-check the template against what the config actually requires — evidence: all nine keys the config resolves are present in `.env.example`, with zero undocumented; `webflow_WEBFLOW_TOKEN` is the only one still absent from the real environment file
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every repairable manual registers on a fresh server, and each remaining failure names its cause
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
