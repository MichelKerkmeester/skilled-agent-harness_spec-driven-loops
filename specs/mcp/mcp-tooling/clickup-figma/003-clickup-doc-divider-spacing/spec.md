---
title: "Feature Specification: ClickUp doc divider spacing on API-written pages"
description: "Every divider the hosted ClickUp MCP writes into a doc page gets an empty line under it, and the mcp-click-up skill did not say so. Agents pushed pages, read back clean markdown and reported success while the page showed a double gap under each divider."
trigger_phrases:
  - "clickup doc divider spacing"
  - "clickup doc divider spacing on api written pages"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: ClickUp doc divider spacing on API-written pages

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-05 |
| **Branch** | `main` (no branch created) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every divider the hosted ClickUp MCP writes into a doc page gets an empty line under it, so a page built from markdown shows a double gap under each `* * *`. The markdown read-back returns the same text with or without the gap, so an agent that verifies its push that way reports success. The `mcp-click-up` skill named three ClickUp import traps but not this one, and gave no way to detect or fix it.

### Purpose
An agent that pushes doc pages through `mcp-click-up` knows the gap will appear, detects it with the plain-text read-back and removes it in the ClickUp editor with a check that proves the page text did not change.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
Observed 2026-11-05 through Code Mode on doc 2kyq4d0p-147395 (65 pages) and scratch doc 2kyq4d0p-147455.

create_document_page with "#### Basics\n* * *\n*   `Who`: X\n", then get_document_pages content_format "text/plain":
  "Basics\n \nWho: X\n"
Same result for "---", "***", "___", "- - -", blank lines around the divider, update replace, update append,
and a full copy of a page from the original doc. "<hr>" came back as literal text.

Original page 2kyq4d0p-102035, built in the ClickUp editor, "text/plain":
  "Basics\n Who gets it: Creator"

Both pages return the same "text/md": "#### Basics\n\n* * *\n\n*   `Who gets it`: ..."

Editor DOM on an API-written page: hr.ql-divider followed by <div class="ql-block"><br></div>.
After a Delete key press on that empty block, "text/plain" reads "Basics\n Who" and "text/md" is unchanged.
Run over 65 pages: 432 tight dividers, 0 gaps left, 65 of 65 markdown read-backs equal to the baseline.
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Document the divider gap, its plain-text check and the editor fix in `references/mcp-tools.md` section 8
- Add a doc page divider line to the `SKILL.md` section 0 contract and a symptom entry to `references/troubleshooting.md`
- Correct the section 8 example to read `document_id` and `page_id`, the fields the server returns
- Record in section 4 that no tool deletes a document or a page
- Bump the mode to 1.2.10.0 with a changelog entry and regenerate the Hermes copy
- Make the import check and the gap removal a required routine after every page write, with a Code Mode program that runs both, in `references/mcp-tools.md` section 8 (mode 1.2.11.0)
- Restore the sk-create-benchmark trigger the hub vocabulary routes, and let the document validator accept a deliberate section 0
- Move the compiled-routing directive in the `mcp-tooling` and `sk-doc` hub `ROUTER.md` files back into `## 5. MACHINE ROUTER`, where `validate_skill_package.py` reads it, and release each hub one patch step
- Check both ClickUp logins once per session before the first write, and ask the user for any that is missing (`mcp-click-up` 1.2.14.0)
- Run the gap pass in a browser already logged in to ClickUp, in a background tab: an Aside program first, and a Chrome program through a new `chrome_devtools_live` manual (`--autoConnect`) as the fallback (`mcp-click-up` 1.2.12.0, `mcp-chrome-devtools` 1.0.21.0), plus a note in `mcp-aside-devtools` that `openTab` leaves the user's view alone (1.1.8.0)
- Fix what an alignment review of those releases found: tabs closed by page ID in `finally` blocks, routing phrases for the readiness check and the live manual in both stages, the six new MCP tools catalogued, two playbook scenarios, and docs that still described two manuals, 61 tools or the old approval order (`mcp-click-up` 1.2.15.0, `mcp-chrome-devtools` 1.0.22.0, `mcp-aside-devtools` 1.1.9.0, `mcp-tooling` 1.9.7.0)
- Fix what a second review found: a live-run claim the Chrome gap pass's page-ID tracking never had, approval steps without their timing, a readiness scenario that could not open its approval tab, three Chrome docs that still named two manuals, eighteen hub changelog spec lines with a level label, and packet docs that no longer matched what shipped (`mcp-click-up` 1.2.16.0, `mcp-chrome-devtools` 1.0.23.0, `mcp-tooling` 1.9.8.0)

### Out of Scope
- A script file for the editor pass - Code Mode takes the program as inline code, so it lives as a copyable block in the reference
- Router keywords for the divider gap - "doc page" and "document" already route to `references/mcp-tools.md`. The readiness and live-Chrome phrases are a separate need and are in scope above
- The Product Owner vendored copy - its own packet pulls this change

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/mcp-tooling/mcp-click-up/references/mcp-tools.md` | Modify | Divider subsection, ID fields, no-delete note, version 1.1.4.0 |
| `.skilled/skills/mcp-tooling/mcp-click-up/references/troubleshooting.md` | Modify | Symptom entry, version 1.0.2.0 |
| `.skilled/skills/mcp-tooling/mcp-click-up/SKILL.md` | Modify | Contract line, version 1.2.10.0 |
| `.skilled/skills/mcp-tooling/mcp-click-up/changelog/v1.2.10.0.md` | Create | Release note |
| `.hermes/skills/mcp-click-up/SKILL.md` | Modify | Regenerated by `sync-skills-hermes.cjs` |
| `.skilled/skills/mcp-tooling/ROUTER.md`, `.skilled/skills/sk-doc/ROUTER.md` | Modify | Directive back in section 5 |
| `mcp-tooling` and `sk-doc` `SKILL.md`, `description.json`, `hub-router.json`, `mode-registry.json`, `changelog/` | Modify and Create | Hub releases 1.9.5.0 and 2.4.3.0 |
| `.hermes/skills/mcp-tooling/ROUTER.md`, `.hermes/skills/sk-doc/ROUTER.md` | Modify | Regenerated copies |
| `.utcp_config.json` | Modify | New `chrome_devtools_live` manual with `--autoConnect` |
| `mcp-chrome-devtools` `SKILL.md`, `INSTALL-GUIDE.md`, `README.md`, manuals asset, `.skilled/skills/mcp-tooling/mcp-chrome-devtools/feature-catalog/feature-catalog.md`, `changelog/v1.0.21.0.md` | Modify and Create | The live manual and how to use it beside the user, mode 1.0.21.0 |
| `mcp-click-up` `references/mcp-tools.md`, `references/troubleshooting.md`, `SKILL.md`, `changelog/v1.2.12.0.md` | Modify and Create | Aside and Chrome live programs, mode 1.2.12.0 |
| `mcp-aside-devtools` `references/session-management.md`, `SKILL.md`, `changelog/v1.1.8.0.md` | Modify and Create | Background-tab behavior, mode 1.1.8.0 |
| `.hermes/skills/` copies of the three modes | Modify | Regenerated copies |
| `.skilled/skills/mcp-tooling/ROUTER.md`, `.skilled/skills/mcp-tooling/hub-router.json`, `.skilled/skills/mcp-tooling/graph-metadata.json`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json`, the compiled `mcp-tooling` manifest | Modify | Readiness and live-Chrome phrases in both routing stages, hub 1.9.7.0 |
| `.skilled/skills/mcp-tooling/mcp-click-up/feature-catalog/`, `.skilled/skills/mcp-tooling/mcp-click-up/manual-testing-playbook/`, `README.md` | Modify and Create | Six tool cards, MCP-M019 and MCP-M020, 14 Code Mode manuals in the root README |
| `mcp-click-up` `references/mcp-tools.md`, `INSTALL-GUIDE.md`, `mcp-servers/clickup-mcp/README.md`, `manual-testing-playbook/mcp-documents/readiness-check.md`, `SKILL.md`, `changelog/v1.2.16.0.md` | Modify and Create | Chrome verification note, MCP-write wording, approval timing, readiness scenario setup, mode 1.2.16.0 |
| `mcp-chrome-devtools` `mcp-servers/chrome-devtools-mcp/README.md`, `feature-catalog/feature-catalog.md`, `feature-catalog/mcp-parallel-instances/code-mode-invocation.md`, `SKILL.md`, `changelog/v1.0.23.0.md` | Modify and Create | All three manuals named, mode 1.0.23.0 |
| `mcp-tooling` `changelog/` (18 entries), `SKILL.md`, `description.json`, `hub-router.json`, `mode-registry.json`, `changelog/v1.9.8.0.md`, the compiled manifest and `skill-graph.json` | Modify and Create | Spec lines with paths only, hub 1.9.8.0 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `references/mcp-tools.md` explains the gap, the plain-text check and the editor fix | `rg -n 'Divider spacing on pages the server writes' references/mcp-tools.md` prints one heading line |
| REQ-002 | `SKILL.md` section 1 warns before any doc page write | `rg -n 'After every doc page write' SKILL.md` prints one line |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The troubleshooting guide names the symptom and points to the fix | `rg -n 'extra blank line under every divider' references/troubleshooting.md` prints one line |
| REQ-004 | The changed docs validate and the Hermes copy matches | `validate_document.py` reports 0 issues on the two references and the changelog, and `sync-skills-hermes.cjs --check` prints `PASS` |
| REQ-006 | Every page write runs the import check and gap removal without a second question | `rg -n 'Required after every page write' references/mcp-tools.md` prints one heading, and the program run on a gapped scratch page reports `gapsLeft: 0` and `textUnchanged: true` |
| REQ-007 | The gap pass runs in a browser already logged in to ClickUp without changing the user's view | Both section 8 programs, run as written on a gapped scratch page, report `login: false`, `gapsLeft: 0` and `textUnchanged: true`, and the user's active tabs are the same before and after an Aside run |
| REQ-008 | A missing ClickUp login is found and fixed with the user before the first write | The readiness program reports `not-connected`, `login`, `none` and the logged-in states correctly, and each has a written question, recheck and stop rule |
| REQ-009 | The browser programs close only the tab they opened, and every doc this work touched agrees with the live server | The readiness program run as written closes its own Chrome page by ID and its Aside tab, the readiness and live-Chrome probes route to their modes, the catalog and inventory count 67 tools, and the review's literal findings no longer match |
| REQ-010 | Each doc says only what its evidence shows, and the four skills agree with each other and with this packet | The Chrome gap pass note names the version that ran live, no Chrome doc counts two manuals, every changelog in the four skills passes `check_changelog_shape.py`, and `validate.sh --strict` on this packet prints `RESULT: PASSED` |
| REQ-005 | Both hubs and the mode meet the sk-create-skill package contract | `validate_skill_package.py` passes all three legs on `mcp-tooling` and `sk-doc`, and `package_skill.py --check --strict` passes on both hubs and on `mcp-click-up` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The four `rg` checks in section 4 each print their line
- **SC-002**: `node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "fix the extra blank line under dividers in a clickup doc page"` routes to `mcp-click-up` with the same policy hash as before
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | ClickUp editor DOM (`.ql-editor`, `hr.ql-divider`, `div.ql-block`) | The automated pass stops finding the empty blocks | The reference dates the selectors and keeps the manual Delete-key fix, which does not depend on them |
| Risk | ClickUp changes how the server writes dividers | Low | The plain-text check shows whether the gap still exists before any fix runs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---
