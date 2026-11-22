---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "live runs and playbook fixes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/008-live-runs-and-playbook-fixes"
    last_updated_at: "2026-11-22T12:00:50Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded what the packet documents and the checks run on the authoring date"
    next_safe_action: "Operator reviews the packet; commit and push wait for approval"
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
| `validate-playbook-package.cjs --package mcp-browser-use/mcp-chrome-devtools` | Exit 0. `scenarios=30 violations=0 warnings=2`, and both census warnings predate this packet |
| `validate_catalog_package.py --package mcp-browser-use/mcp-bladebro` | Exit 0. 0 violations. 18 markdown files in `feature-catalog/` |
| `awk` over each `results.csv` | Bladebro 4 PASS and 1 FAIL over 5 rows. Aside 10 PASS and 5 FAIL over 15 rows |
| Email-pattern scan of the six run files | 0 matches |
| `ls` of the 505 path and `git worktree list` | `ls` exits 1 with `No such file or directory`. No worktree is registered for 505, and no branch matches `*505*` |
| Port 9333 | `curl` exits 7, so the port is closed |
| `bdg` daemon, pid 47157 | Still running at the last check. It was not stopped |
| `validate.sh --strict` on this child and on the parent | Run last. The printed `RESULT:` lines are reported with the completion message |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Rewritten Aside forms ran live afterwards.** The rerun `2026-11-22--manual-testing-playbook--rewritten-forms-rerun` gave 8 PASS and 2 FAIL. ASD-012 and ASD-013 failed because an early `return` in their `catch` dropped the logged line. With that fixed, `2026-11-22--manual-testing-playbook--probe-guard-fix` gave 2 PASS. The Chrome DevTools rewrites still have no live run, and BDG-015 stays UNKNOWN.
2. **BDG-015 is UNKNOWN.** Its scenario file still carries the original median-comparison prompt.
3. **Stale old forms in consumers.** The Aside `SKILL.md`, `README.md`, references, feature catalog and `examples/` still show `/tmp` paths or the old forms. The Chrome DevTools references and the Code Mode `SKILL.md` examples and CM-012 also remain.
4. **Aside failures stand.** ASD-016 expects an h1 that example.com no longer has. The five Aside FAIL verdicts stay until their scenarios are corrected in a later packet.
5. **Raw evidence is not in the repository.** Each run's `source.md` records that the raw evidence files were written outside the repository and were not kept. The verdicts can be re-read from the CSV but not from the raw output. BB-010, BB-011, BB-013 and BB-015 have no reason text.
6. **Stale branch metadata.** The parent's Branch row and 007's Branch row still name `worktrees/505-mcp-browser-use-hub`, which no longer exists.
7. **Not committed.** Commit and push wait for the operator's approval. The trigger index needs a rebuild after the new files are tracked.
8. **Background daemon.** The `bdg` daemon, pid 47157, is still running and needs the operator's decision.
<!-- /ANCHOR:limitations -->

---
