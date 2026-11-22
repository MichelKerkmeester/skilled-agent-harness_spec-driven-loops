---
title: "Feature Specification: Phase 8: live-runs-and-playbook-fixes"
description: "Records the 2026-11-22 live Bladebro and Aside runs, adds Bladebro's attach-mode scenario, catalog, examples and MCP server docs, fixes the playbook forms the live runs showed to be wrong, and removes a leftover 505 worktree."
trigger_phrases:
  - "live runs and playbook fixes"
  - "phase 8 live runs and playbook fixes"
  - "bladebro live clickup run"
  - "aside signed-in run"
  - "bladebro attach mode scenario"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 8: live-runs-and-playbook-fixes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-22 |
| **Branch** | `worktrees/514-playbook-run-recording` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-bladebro-parity-and-changelogs |
| **Successor** | None |
| **Handoff Criteria** | Every run and fix named here has a recorded report folder or a passing validator result, and the open items in section 10 are named for a later packet |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the mcp-browser-use hub program. It records work the operator approved on 2026-11-22, after 007 closed: live runs against the operator's own ClickUp session in Bladebro and a signed-in Aside profile, the playbook fixes those runs forced, the Bladebro extras that 007 left out, and removal of a leftover worktree. The operator asked for these docs to sit in the browser-hub program as a phase child.

**Scope Boundary**: the two run folders, the Bladebro scenario and package additions, the form fixes in the Chrome DevTools and Aside playbooks, the worktree removal and this packet's own documents. This packet changes no skill or playbook file. It does not touch `specs/sk-doc/authoring-modes-and-playbooks/007-playbook-run-recording/`, which another agent is editing.

**Dependencies**:
- 007-bladebro-parity-and-changelogs, whose acceptance criterion AC-006 named 13 Aside scenarios as waiting for an operator yes. This phase runs them.
- Bladebro 4.8.2 and Aside 1.26.626.1517 installed on the operator's macOS arm64 machine.

**Deliverables**:
- Two run folders under the Bladebro and Aside benchmark reports, with index rows.
- Scenario BB-015 `real-browser/attach-mode-reads.md`, and the Bladebro playbook root at 1.1.0.0 with 15 scenarios.
- Bladebro `feature-catalog/`, `examples/` and `mcp-servers/`.
- Form fixes in the Chrome DevTools playbook (root 1.0.6.0) and the Aside playbook (root 1.0.3.0).
- This packet, its parent amendments and its validation output.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 13 signed-in Aside scenarios that 007 deferred had no recorded verdict, and Bladebro had no scenario for reading a browser the operator already had open. Bladebro also had no catalog, examples or MCP server docs. The first live runs also showed that several scenario forms did not match the installed tools. Aside rejects `page.on` for console and request capture, has no `page.context`, and redirects `/tmp` writes into its own session folder. The Bladebro clone run failed because no page target could launch. A 4.3 GB unregistered worktree, `505-mcp-browser-use-hub`, with its branch already deleted, was still on disk.

### Purpose
The operator gets live verdicts for both browser modes, scenario forms that match what the installed tools accept, a Bladebro catalog and examples, and a clean worktree list. A failed scenario stays recorded as a failure, and a rewritten form stays unverified until a live run passes it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ ls .skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-22--manual-testing-playbook--clickup-real-browser .skilled/skills/mcp-browser-use/mcp-aside-devtools/benchmark/reports/2026-11-22--manual-testing-playbook--signed-in-live; ls /Users/michelkerkmeester/worktrees/public/505-mcp-browser-use-hub; git -c core.fsmonitor=false worktree list | grep 505 || echo "no 505 worktree registered"
.skilled/skills/mcp-browser-use/mcp-aside-devtools/benchmark/reports/2026-11-22--manual-testing-playbook--signed-in-live:
README.md
results.csv
source.md

.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-22--manual-testing-playbook--clickup-real-browser:
README.md
results.csv
source.md
ls: /Users/michelkerkmeester/worktrees/public/505-mcp-browser-use-hub: No such file or directory
no 505 worktree registered
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Record the Bladebro real-browser run: BB-010, BB-011, BB-012, BB-013 and BB-015. BB-012 and BB-015 targeted `app.clickup.com`. Every step was read-only.
- Record the Aside signed-in run on 1.26.626.1517 for 15 scenario ids, the 13 that 007 deferred plus the two preconditions ASD-003 and ASD-006.
- Add BB-015, reads by attaching to a running browser, and bump the Bladebro playbook root to 1.1.0.0.
- Build Bladebro's `feature-catalog/`, `examples/` and `mcp-servers/` so it has the same package shape as its sibling modes.
- Record the scenario-form fixes made after live failures in the Chrome DevTools and Aside playbooks.
- Remove the unregistered 505 worktree.

### Out of Scope
- Commit, push and install. These wait for the operator's approval.
- A redesign of BDG-015. It stays UNKNOWN because its prompt measures a parallel speedup that blocking Code Mode calls cannot show.
- Stale old forms in the Aside `SKILL.md`, its references and its feature catalog, in the Chrome DevTools references, and in the Code Mode `SKILL.md` examples and CM-012. These are open items in section 10.
- Rebuilding the trigger index. It waits until the new files are tracked.
- `.skilled/changelog/system-deep-loop/deep-ai-council`. It stays a real folder because its packet was retired on purpose in commit `adbba5a06a9`, and nothing links to it.
- Re-running the earlier 2026-11-22 Aside folders from 007, `app-closed-safe-set` and `routing-recall`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-22--manual-testing-playbook--clickup-real-browser/` | Create | Run folder: README, results.csv and source for five scenarios |
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/benchmark/reports/2026-11-22--manual-testing-playbook--signed-in-live/` | Create | Run folder: README, results.csv and source for 15 scenarios |
| `.skilled/skills/mcp-browser-use/{mcp-bladebro,mcp-aside-devtools}/benchmark/reports/README.md` | Modify | One index row per run |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/real-browser/attach-mode-reads.md` | Create | Scenario BB-015 |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/manual-testing-playbook.md` | Modify | Root 1.1.0.0, the section 5 latest-run line and the section 12 cross-reference index |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/feature-catalog/` | Create | Root file and 17 entries in five categories |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/examples/` | Create | README and three scripts: `agent-browser-read.sh`, `run-step-plan.sh`, `attach-read.sh` |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/mcp-servers/{bladebro-cli,bladebro-mcp}/README.md` | Create | Two server READMEs |
| `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/manual-testing-playbook/` | Modify | Form fixes in BDG-003, 005, 006, 011, 012, 014, 016, 017 and 018, and root 1.0.6.0 |
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/manual-testing-playbook/` | Modify | REPL and form fixes, and root 1.0.3.0 |
| `/Users/michelkerkmeester/worktrees/public/505-mcp-browser-use-hub` | Delete | Unregistered leftover, 4.3 GB, outside this repository |
| `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/` | Create, Modify | This child, plus the parent's phase map, binding table and `graph-metadata.json` |

Other modified files in the worktree belong to other packets, such as `specs/sk-doc/authoring-modes-and-playbooks/007-playbook-run-recording/`. They are not listed here.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each run folder's `results.csv` holds one row per scenario, and its README tally matches the CSV: Bladebro 4 PASS and 1 FAIL over five rows, Aside 10 PASS and 5 FAIL over 15 rows |
| REQ-002 | `validate-playbook-package.cjs --package mcp-browser-use/mcp-bladebro` exits 0 with `scenarios=15` and `violations=0` |
| REQ-003 | `validate-playbook-package.cjs` exits 0 with `violations=0` for `mcp-aside-devtools` and `mcp-chrome-devtools` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `validate_catalog_package.py --package mcp-browser-use/mcp-bladebro` exits 0 with 0 violations |
| REQ-005 | Every FAIL in a run folder names its cause in the reason cell, and no FAIL is re-labelled PASS |
| REQ-006 | The path `/Users/michelkerkmeester/worktrees/public/505-mcp-browser-use-hub` does not exist, and no worktree or branch for it is registered |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The two `results.csv` files hold 5 and 15 rows, with 4 and 10 PASS verdicts. `awk -F, 'NR>2 && $3=="PASS"'` over each file counts them.
- **SC-002**: The Bladebro playbook validator exits 0 and prints `scenarios=15` with `violations=0`.
- **SC-003**: `ls /Users/michelkerkmeester/worktrees/public/505-mcp-browser-use-hub` exits 1, and `git worktree list` has no line for 505.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The signed-in Aside profile and the operator's ClickUp session | Without them the 15 Aside scenarios and the Bladebro real-browser scenarios cannot re-run | Each run needed an operator yes. The runs stayed read-only and recorded no page text, workspace or cookie name |
| Dependency | Chrome listening on port 9333 for BB-015 | Attach mode cannot read a browser it cannot reach | Aside was quit and relaunched with `--remote-debugging-port=9333`. The port was confirmed closed afterwards |
| Risk | Rewritten scenario forms that have no live run yet | A wrong form can pass review and still fail on the tool | They stay listed as unverified in section 10 and in the goal log. None is counted as a verdict |
| Risk | A cookie-bearing browser profile copy existed during BB-012 | Credential exposure | The copy was cookie-only with the credential-store files removed, and it was deleted after the run |
| Risk | Deleting the 505 worktree was irreversible | Work lost if anything in it was unmerged | The orchestrator reported nothing unmerged and the branch was already deleted. This packet cannot verify the first part, so it names the risk and does not claim it was checked |
| Risk | The parent's Branch row and 007's Branch row still name `worktrees/505-mcp-browser-use-hub` | Stale metadata points at a folder that no longer exists | Named as an open item. The parent and 007 are outside this packet's edit scope |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A. No service runs in this packet. The browser runs belong to the scenarios.
- **NFR-P02**: N/A. No throughput target applies to recorded verdicts.

### Security
- **NFR-S01**: No report quotes a cookie value, an email address, an account id, page text or a workspace name. An email-pattern scan of the six run files returned 0 matches.
- **NFR-S02**: A staged browser-profile copy is deleted after its run, and the copy excludes the credential-store files.

### Reliability
- **NFR-R01**: The operator's Aside app is left running as the operator normally runs it, and port 9333 is closed afterwards. `curl` to `127.0.0.1:9333` returned exit 7 when checked.
- **NFR-R02**: N/A. No error budget applies to recorded verdicts.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: BB-010, BB-011, BB-013 and BB-015 carry no reason text in `results.csv`, so their README cells read `not recorded`. The run folders do not invent a reason.
- Maximum input: Aside's `aside repl` calls start with `page` null. The REPL scenarios therefore ran in one REPL process after ASD-006 opened its tab, and each REPL reason cell says so.
- Failure path: BB-012's `see content`, `see model` and `act eval` calls each exited 1 with `Chrome launch failed: no page target available`. It was not retried, so its verdict stays FAIL.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | About 71 files and about 3,000 changed lines under the browser hub, counted by `git diff --numstat` and `wc -l` |
| Risk | 12/25 | A live signed-in browser, a cookie-bearing profile copy and an irreversible worktree deletion |
| Research | 8/20 | Twenty scenarios run live, and each tool form was checked against the installed binary |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which rewritten forms need a live run before they count as verified? Aside's `./tmp` and `./artifacts` paths, `$eval('title')`, a names-only cookie read, Chrome page-id parsing and `bdg status .active` have no live run yet.
- BDG-015 stays UNKNOWN. Its scenario file still carries the original prompt, which compares sequential and parallel medians. Blocking Code Mode calls cannot show a parallel speedup, so the scenario needs a redesign in a later packet.
- Do the stale old forms in the Aside `SKILL.md`, its `README.md`, its references and its feature catalog, the Chrome DevTools references, and the Code Mode `SKILL.md` examples and CM-012 need the same rewrite? The Aside `examples/` also need it: `repl-evidence-capture.sh` defaults its output to `/tmp/aside-evidence`, and `examples/README.md` lists `/tmp` paths.
- A `bdg` daemon, pid 47157, was started by `bdg --version` and was still running at the last check. Should the operator stop it?
- The trigger index needs a rebuild once the new files are tracked.
<!-- /ANCHOR:questions -->

---
