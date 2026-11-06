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
- [x] T013 Add the required routine and its program (`M/references/mcp-tools.md` 1.1.5.0, `M/SKILL.md` 1.2.11.0, `M/references/troubleshooting.md` 1.0.3.0, `M/changelog/v1.2.11.0.md`). Verify: `node --check` on the extracted program prints nothing and `package_skill.py --check --strict` passes.
- [x] T014 Run the program on a gapped scratch page (doc `2kyq4d0p-147455`). Verify: the report shows `gapsLeft: 0` and `textUnchanged: true`. Logged out it reported `login: true` and touched nothing. Logged in it reported `gapsBefore: 3`, `presses: 3`, `gapsLeft: 0`, `textUnchanged: true`, `importDiff: []`. A push with a paragraph above a divider reported `importDiff: ["Intro line.", "* * *"]`, the line ClickUp turned into `## Intro line.`
- [x] T015 Restore the `benchmark/README.md` trigger in `sk-doc/sk-create-benchmark/SKILL.md` (1.6.6.0), which a readability pass had pluralized. Verify: `ci-hub-vocabulary-source.cjs --hub sk-doc` prints `RESULT: PASSED`, where it reported drift=1.
- [x] T016 Let `validate_document.py` accept a deliberate section 0 as the start of the H2 sequence (`sk-doc/shared/scripts/validate_document.py`, new `scripts/tests/test_h2_numbering_start.py`). Verify: the test passes 5 of 5 and fails 2 of 5 on the old validator, `mcp-click-up` and `mcp-notion` `SKILL.md` report 0 issues, and 45 of 46 sk-doc tests pass, the one failure being `test_readme_manifest.py`, which fails the same way without this change.
- [x] T017 Find why ClickUp asked for a login on every run. Verify: both Chrome DevTools manuals carried `--isolated=true`. With a saved profile instead, the login still ended on restart: ClickUp stores it as `refresh_token_meta: {"session":true}`, and the fixed program then reported `login: true`. The saved profile was reverted.
- [x] T018 Add `chrome_devtools_live` (`.utcp_config.json`, `mcp-chrome-devtools` 1.0.21.0). Verify: the parsed config lists `chrome_devtools_1` and `chrome_devtools_2` with `--isolated=true` and `chrome_devtools_live` with `--autoConnect`, the manuals snapshot matches the config entry for entry, and a background `new_page` became the selected page while the user's tab stayed in place.
- [x] T019 Rewrite section 8 with Aside first and Chrome live as the fallback, and catch a late login redirect (`M/references/mcp-tools.md`, `M/references/troubleshooting.md`, `M/SKILL.md` 1.2.12.0). Verify: the Aside program as written passed on ZZ test E and the Chrome program as written on ZZ test C, each `gapsLeft: 0`, `textUnchanged: true`, `login: false`. Earlier runs passed on ZZ test J, M, B and A, and the user's active tabs were the same before and after the run on B. The fixed Chrome program on a logged-out browser reported `login: true`, `editor: false`, where the old one reported `login: false`.
- [x] T020 Record that Aside's `openTab` works beside the user (`mcp-aside-devtools/references/session-management.md`, mode 1.1.8.0). Verify: the probe showed the user's active tabs unchanged, the new tab `active: false`, and `chrome.tabs.create` refused.
- [x] T021 Split the Aside pass into calls under Code Mode's 30-second limit (`M/references/mcp-tools.md`, `M/SKILL.md` 1.2.13.0, `M/changelog/v1.2.13.0.md`). Verify: on ZZ test K (74 dividers) the old single call timed out after 30 s, though the pass finished inside Aside. The new program as written cleared ZZ test N in 1 call, and with the work window cut to 3 s it cleared ZZ test O in 2 calls on one tab, 74 presses, text unchanged, no tab left open. Batch F, G, H, I, L: 7 gaps to 0, the user's active tabs the same after every page. Aside stayed minimized and never came to the front. A logged-out Aside run was not done, because `/login` redirects a logged-in browser to the workspace, so it cannot be faked without logging the user out.
- [x] T022 Take `gapsLeft` from the editor in both programs and report the plain-text count as `plainHits` (`M/references/mcp-tools.md`). Verify: on ZZ test K, N and O the old report said `gapsLeft: 1` with every divider tight, the hit being an image after a code block. With the fix, the Aside program on ZZ test P and the Chrome program on ZZ test Q each report 74 presses, `gapsLeft: 0`, `plainHits: 1`, text unchanged.
- [x] T023 Add a first-use readiness check (`M/references/mcp-tools.md` section 3, `M/SKILL.md` section 1 and 1.2.14.0, `M/references/troubleshooting.md`, `M/ROUTER.md` setup keywords, `M/changelog/v1.2.14.0.md`). Verify: with an empty mcp-remote store, registration timed out with 0 tools and an approval given after it wrote no token. Approving while registration waited listed 67 tools and saved a token, and a reconnect then listed 67 tools with no new tab. The program as written read `mcp: ok, browser: aside`, then with `aside` and `clickup_official` unregistered read `mcp: not-connected, browser: chrome`. Registering both again brought them back with no question. `aside` returned `Not connected` after idling and came back on re-registration. The isolated Chrome read `/login`. Hub routing still sends a login prompt, a `cupt` task named "Fix login bug" and a doc page request to `mcp-click-up`.
- [x] T024 Close the readiness and Chrome gap-pass tabs by page ID in `finally` blocks, and scope the check to MCP writes (`M/references/mcp-tools.md`, `M/SKILL.md`, `mcp-chrome-devtools/SKILL.md`). Verify: the readiness program as written read `mcp: ok`, then Chrome pages `[4]` before, its own page `8`, `[4]` after. After re-registering `aside` it read `browser: aside` with 0 tabs left. A first run caught `.catch()` on a Code Mode call, which is not a Promise, and both programs now use `try`/`catch`. The Chrome gap pass with `select_page` was not run live, since that needs a new gapped scratch page.
- [x] T025 Route the readiness check and the live manual in both stages (`mcp-tooling/ROUTER.md`, `hub-router.json`, `graph-metadata.json`, compiled manifest, `skill-graph.json`). Verify: in a worktree advisor, P01 "check whether ClickUp MCP is approved and ClickUp is logged in" moved from `sk-code` to `mcp-click-up`, P06, P07 and P13 resolve `mcp-chrome-devtools`, and "fix login bug in the checkout form" and "write an MCP server in TypeScript" still go to `sk-code`. `skill-graph-freshness.cjs --strict` exits 0.
- [x] T026 Catalog the six tools the server added and add playbook scenarios MCP-M019 and MCP-M020 (`M/feature-catalog/`, `M/manual-testing-playbook/`, `M/references/mcp-tools.md` section 5). Verify: a live registration listed 67 tools and the inventory sums to 67 with 67 rows. `validate_catalog_package.py` passes every package, and `validate-playbook-package.cjs` passes with 0 violations and no new warnings.
- [x] T027 Fix the review's doc findings: 14 manuals in the root README, the live-instance catalog entry, the three-manual asset, the read-only attach rule, the approval order in the README, and 29 changelog spec lines. Verify: `check_changelog_shape.py` passes 47 of 47 entries across the three modes.
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
