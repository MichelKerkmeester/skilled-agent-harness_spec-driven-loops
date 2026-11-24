---
title: "Goal: Phase 3: mode-relocation"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "mode relocation goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/003-mode-relocation"
    last_updated_at: "2026-11-24T05:32:33Z"
    last_updated_by: "claude-code"
    recent_action: "Reran criteria 1, 2, 3 and 5 and ticked them"
    next_safe_action: "None; every goal criterion holds"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-21-browser-use-hub-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 3: mode-relocation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Chrome DevTools and Aside resolve as modes of mcp-browser-use, mcp-tooling registers its six other modes, the mutation guard sees their scripts at the new paths, and no live file under .skilled names their old mcp-tooling paths.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Changelogs and benchmark reports keep their old paths; they record history. |
| D2 | Generated files are rebuilt by their generators, never hand-edited. |
| D3 | Mode ids stay as they are; only the `mcp-tooling/` path segment changes (`../001-research/research/research.md` §7). |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] .skilled/skills/mcp-tooling/mode-registry.json lists 6 modes
- [x] rg for mcp-tooling/mcp-chrome-devtools or mcp-tooling/mcp-aside-devtools under .skilled excluding changelog and benchmark/reports folders, and for either id in .skilled/skills/mcp-tooling/{mode-registry.json,hub-router.json,leaf-manifest.json,ROUTER.md,SKILL.md,README.md}, prints no match
- [x] parent-skill-check.cjs exits 0 for .skilled/skills/mcp-tooling and for .skilled/skills/mcp-browser-use
- [x] node --test .skilled/bin/tests/mcp-installers.test.cjs exits 0
- [x] Both skill_dir values in .skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml point under .skilled/skills/mcp-browser-use, the pre-commit hook regex and the guard HOOK_PATTERN and DISCOVERY_GLOBS name mcp-browser-use/, and check-mcp-mutation-class.test.sh exits 0 with a case for a script under skills/mcp-browser-use/mcp-*
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Draft scope written | Done | spec.md marked refined after 001-research |
| Refine from 001-research | Done | spec.md section 3 classifies each file per `iteration-011.md` |
| Re-level | Done | `recommend-level.sh --loc 400 --files 70` printed Level 2; `upgrade-level.sh --to 2` added `acceptance-criteria.md` |
| Blast radius re-measured 2026-11-21 | Done | 41 outside files, 14 of them path-form; 29 inside `mcp-tooling` outside the two packets |
| T001 re-run at implement start | Done | Same counts: 41 / 14 / 29 |
| Guard widened before the move | Done | The new `mcp-browser-use/` test case failed first (35 passed, 2 failed), then passed (37 passed, 0 failed) |
| Packets moved | Done | `git mv` staged 176 `R100` renames; the in-packet path and hub-name edits stay unstaged |
| Criteria 1, 3, 4, 5, 2026-11-21 | Met | `jq` prints 6; both hub checks print `OK`; installer test 5/5; guard test 37/37 and the guard lists the moved scripts as PASS |
| Criterion 2 | Met | The three residual files were rewritten after the operator's answer. See the 2026-11-24 rerun below |
| `cite-drift-redirects.json` | Done | Rewritten on the operator's answer, recorded in `acceptance-criteria.md` AC-002 |
| Rerun 2026-11-24, criterion 1 | Met, ticked | `jq '.modes \| length' .skilled/skills/mcp-tooling/mode-registry.json` printed `6`, exit 0 |
| Rerun 2026-11-24, criterion 2 | Met, ticked | The old-path `rg -l` over `.skilled` and the id `rg -n` over the six old-hub files each print nothing, exit 1. The same id pattern counts 6 lines in the new hub's `mode-registry.json`, so the search works |
| Rerun 2026-11-24, criterion 3 | Met, ticked | `parent-skill-check.cjs` exits 0 for both hubs and prints `OK: parent-skill-check` with 0 warnings. It declares 6 modes for `mcp-tooling` and 3 for `mcp-browser-use` |
| Rerun 2026-11-24, criterion 4 | Met after the helper parity fix landed in 014 | `node --test .skilled/bin/tests/mcp-installers.test.cjs` exited 0 with `pass 5`, `fail 0` at 05:30Z. `cmp` on the two `_utils.sh` copies exits 0. The helper parity fix was still in flight in another lane, so the box stays open until that fix lands |
| Rerun 2026-11-24, criterion 5 | Met, ticked | Manifest lines 45 and 61 name `.skilled/skills/mcp-browser-use`. `pre-commit:726`, `HOOK_PATTERN` and both `DISCOVERY_GLOBS` entries name `mcp-browser-use/`. `check-mcp-mutation-class.test.sh` exits 0 with `Results: 51 passed, 0 failed`, including the `skills/mcp-browser-use/mcp-other` case |

### Deviations and findings

| Item | Note |
|------|------|
| Count dropped from 45 to 41 | The earlier count did not exclude `benchmark/reports/` |
| Sibling-packet rows unblocked | Operator, 2026-11-21: the four sibling packets keep their bare ids and parent D3 holds; the second criterion now checks the old hub's own files only, matching the amended parent criterion 3 |
| Guard pattern edits added | Operator, 2026-11-21: the hook regex, `HOOK_PATTERN`, `DISCOVERY_GLOBS`, manifest header and a `skills/mcp-browser-use/mcp-*` test case land here with the move (`spec.md` REQ-008) |
| `cite-drift-redirects.json` | Generated from git rename history, so it regenerates only after the operator commits the move |
| Criterion 2 conflicts with two frozen decisions | Three old-path hits remain. `semantic-probes.json` is historical with no change (`spec.md` section 3). `cite-drift-redirects.json` waits on a commit (D8). `mcp-tooling/mcp-figma/references/troubleshooting.md:488` spells the Chrome path in a sibling packet, which the operator fenced off. Only the operator can choose: amend the criterion, or allow a one-line sibling edit |
| Criterion 2 conflict resolved | The operator answered after 2026-11-21. `cite-drift-redirects.json` and `semantic-probes.json` were rewritten, and the broken path at `mcp-figma/references/troubleshooting.md:488` was fixed. The boxes stayed unticked until the 2026-11-24 deep review flagged them |
| Observability files not regenerated | They name the packets by bare id only, with no path, and their generator's default corpus is missing from this checkout |
<!-- /ANCHOR:log -->
