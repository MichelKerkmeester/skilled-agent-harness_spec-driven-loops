---
title: "Implementation Summary"
description: "Live Bladebro and Aside verdicts for the signed-in browser paths, corrected scenario forms in three browser playbooks, a Bladebro package with catalog, examples and server docs, and a review follow-up that fixed the findings of an independent review."
trigger_phrases:
  - "live runs and playbook fixes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/008-live-runs-and-playbook-fixes"
    last_updated_at: "2026-11-22T17:15:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Fixed the independent review findings for the browser hub and recorded them"
    next_safe_action: "Operator decides on commit and push of the review follow-up"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-22-live-runs-and-playbook-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-live-runs-and-playbook-fixes |
| **Status** | Complete |
| **Completed** | 2026-11-22 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The Bladebro and Aside browser modes now have live verdicts for their signed-in paths, and the playbook scenarios that failed on the installed tools are corrected. Bladebro passed four of five real-browser scenarios and Aside passed ten of fifteen. Each failure is recorded with its cause, and none was turned into a PASS.

This phase documents the work done on 2026-11-22, after 007 closed. The operator approved live runs against the operator's own ClickUp session and a signed-in Aside profile. Those runs showed that several scenario forms did not match the installed tools, so the forms were corrected and the playbooks re-validated. The Bladebro package also gained the catalog, examples and MCP server docs that its sibling modes already have. The unregistered 505 worktree was removed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/008-live-runs-and-playbook-fixes/` | Created | This packet: spec, plan, tasks, acceptance criteria, implementation summary, goal, graph metadata, description and `scratch/` |
| `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md` | Modified | Phase map row 8 and the 007 to 008 handoff row |
| `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md` | Modified | Binding rows for 007 and 008 |
| `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/graph-metadata.json` | Modified | `children_ids` gains 008. The scaffold also refreshed the derived fields |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-22--manual-testing-playbook--clickup-real-browser/` | Created, recorded | Run folder for five real-browser scenarios |
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/benchmark/reports/2026-11-22--manual-testing-playbook--signed-in-live/` | Created, recorded | Run folder for 15 signed-in scenario ids |
| `.skilled/skills/mcp-browser-use/{mcp-bladebro,mcp-aside-devtools}/benchmark/reports/README.md` | Modified | One index row per new run |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/real-browser/attach-mode-reads.md` | Created | Scenario BB-015 |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/manual-testing-playbook.md` | Modified | Root 1.1.0.0, section 5 latest-run line, section 12 index |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/feature-catalog/`, `examples/`, `mcp-servers/` | Created | Root and 17 catalog entries, three scripts with a README, two server READMEs |
| `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/manual-testing-playbook/` | Modified | Forms corrected in nine scenarios. Root 1.0.6.0 |
| `.skilled/skills/mcp-browser-use/mcp-aside-devtools/manual-testing-playbook/` | Modified | REPL and form fixes. Root 1.0.3.0 |
| `/Users/michelkerkmeester/worktrees/public/505-mcp-browser-use-hub` | Deleted | Unregistered 4.3 GB leftover, outside this repository |

The skill and playbook rows were written before this packet existed. This packet records them and does not change them.

### Review follow-up

An independent review of the first pass, run after commit `413d3268b8a`, found the problems below in the browser hub. The operator asked for all of them to be fixed.

| File | Action | Purpose |
|------|--------|---------|
| `mcp-bladebro/manual-testing-playbook/real-browser/attach-mode-reads.md` | Modified, 1.0.1.0 | The eval returns two booleans and never the hostname, which on a site with one subdomain per customer names the workspace. The `--port` citation names the catalog entry, because `cli-reference.md` does not list the flag |
| `mcp-bladebro/examples/attach-read.sh`, `examples/README.md` | Modified | The same two-boolean eval. The script refuses a URL with a quote or a backslash, because the URL sits in a quoted JavaScript string |
| `mcp-aside-devtools/manual-testing-playbook/probes-and-gaps/{console-probe,network-probe}.md`, `devtools-parity/cookies-storage.md` | Modified | A PASS reason opens with the outcome, so an index row never reads as a working capture |
| `mcp-aside-devtools/SKILL.md` (1.1.12.0), `feature-catalog/feature-catalog.md`, `feature-catalog/devtools-parity/{console-and-network-capture,cookies-and-storage}.md` | Modified | Console, network and context cookies are recorded as gaps on 1.26.626.1517, matching the live runs |
| `mcp-chrome-devtools/references/{session-management,troubleshooting,cdp-patterns}.md`, `feature-catalog/cli-bdg-lifecycle/session-status.md` | Modified | Every `bdg status` check uses `--json` and `.active`. Plain `bdg status` prints text, and its no-session text contains the word "active", so the old `grep -q "active"` test was always true |
| `mcp-chrome-devtools/manual-testing-playbook/manual-testing-playbook.md` | Modified, 1.0.7.0 | The hand-typed census of 22 scenarios is gone; the validator derives 30 across 7 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. The packet was scaffolded as a Level 2 phase child with `create.sh --phase --parent`, one phase, `--with-goal` and `--skip-branch`.
2. The level helper was run on the measured scope, 3,005 lines and 71 files, and it printed Level 2.
3. The Bladebro real-browser run and the Aside signed-in run were recorded with `record-playbook-run.cjs`. Both runs were read-only.
4. The BB-015 scenario was added, and the Bladebro playbook root moved to 1.1.0.0.
5. The Bladebro catalog, examples and MCP server docs were built from the sibling packages.
6. The Chrome DevTools and Aside scenario forms were corrected, and both playbook roots were bumped.
7. The 505 worktree was removed, after its read-only Vibe plugin folders were made writable.
8. The packet documents were written, and the parent's phase map, binding table and `graph-metadata.json` were amended.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A phase child under the browser hub, not a new top-level packet | The operator asked for the browser hub, and the phase map keeps 008 in sequence after 007 |
| Status Complete, with the FAIL verdicts kept | The operator asked for Complete. The FAILs are results of the runs, and turning them into PASS would hide the findings |
| BDG-015 left UNKNOWN | Its prompt compares sequential and parallel medians, and blocking Code Mode calls cannot show a parallel speedup. A redesign changes a playbook, which is outside this packet |
| A binding row for 007 added alongside 008 | `sk-create-goal` requires a row for each phase child on disk. The 007 row was missing |
| Read-only live steps, with no account data in the reports | The runs used the operator's own session. The reports carry verdicts and causes only |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate-playbook-package.cjs --package mcp-browser-use/mcp-bladebro` | Exit 0. `scenarios=15 violations=0 warnings=0` |
| `validate-playbook-package.cjs --package mcp-browser-use/mcp-aside-devtools` | Exit 0. `scenarios=29 violations=0 warnings=1`, and the warning is a census that predates this packet |
| `validate-playbook-package.cjs --package mcp-browser-use/mcp-chrome-devtools` | Exit 0. `scenarios=30 violations=0 warnings=2` at first, both census warnings that predate this packet. `warnings=0` after the review follow-up removed the hand-typed census |
| `validate_catalog_package.py --package mcp-browser-use/mcp-bladebro` | Exit 0. 0 violations. 18 markdown files in `feature-catalog/` |
| `awk` over each `results.csv` | Bladebro 4 PASS and 1 FAIL over 5 rows. Aside 10 PASS and 5 FAIL over 15 rows |
| Email-pattern scan of the six run files | 0 matches |
| `ls` of the 505 path and `git worktree list` | `ls` exits 1 with `No such file or directory`. No worktree is registered for 505, and no branch matches `*505*` |
| Port 9333 | `curl` exits 7, so the port is closed |
| `bdg` daemon, pid 47157 | Stopped on the operator's instruction after the first pass. `pgrep -f browser-debugger-cli` then found no process |
| `validate.sh --strict` on this child and on the parent | `RESULT: PASSED` with 0 errors and 0 warnings on this child after the review follow-up; `--recursive --strict` on the parent prints `RESULT: PASSED` for all 9 folders |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Rewritten Aside forms ran live afterwards.** The rerun `2026-11-22--manual-testing-playbook--rewritten-forms-rerun` gave 8 PASS and 2 FAIL. ASD-012 and ASD-013 failed because an early `return` in their `catch` dropped the logged line. With that fixed, `2026-11-22--manual-testing-playbook--probe-guard-fix` gave 2 PASS. The Chrome DevTools rewrites still have no live run, and BDG-015 stays UNKNOWN.
2. **BDG-015 is UNKNOWN.** Its scenario file still carries the original median-comparison prompt.
3. **Stale old forms in consumers.** The Aside `README.md`, references and `examples/` still show `/tmp` paths or the old forms, and the Code Mode `SKILL.md` examples and CM-012 remain. The Aside `SKILL.md` and catalog rows and the Chrome DevTools `bdg status` checks were fixed in the review follow-up. The `.active` field is read from the bdg 0.6.10 source (`formatStatusAsJson`, printed unwrapped by `CommandRunner` under `--json`), not from a live run.
4. **The first Aside failures are history.** The signed-in run's five FAILs (ASD-007, 016, 017, 018 and 019) stay in that run folder. All five passed in the `rewritten-forms-rerun` folder after their forms were corrected.
5. **Raw evidence is not in the repository.** Each run's `source.md` records that the raw evidence files were written outside the repository and were not kept. The verdicts can be re-read from the CSV but not from the raw output. BB-010, BB-011, BB-013 and BB-015 have no reason text.
6. **Stale branch metadata.** The parent's Branch row and 007's Branch row still name `worktrees/505-mcp-browser-use-hub`, which no longer exists.
7. **Committed.** The first pass is commit `413d3268b8a`, merged as `88ac6b93b7f` and pushed. The review follow-up is not committed yet.
8. **Chrome DevTools rewrites are still not live-tested.** No Chrome DevTools run folder exists. A live run of that lane needs the operator's approval.
<!-- /ANCHOR:limitations -->

---
