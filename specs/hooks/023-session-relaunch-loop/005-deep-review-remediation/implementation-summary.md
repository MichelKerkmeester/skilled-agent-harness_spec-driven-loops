---
title: "Implementation Summary"
description: "The twelve deep-review advisories and every follow-up finding are fixed with tests, the code matches sk-code-opencode and the docs match the code."
trigger_phrases:
  - "deep review remediation implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/005-deep-review-remediation"
    last_updated_at: "2026-10-18T18:14:17Z"
    last_updated_by: "generate-context"
    recent_action: "Extended 005 with the final review wave items and AC-008"
    next_safe_action: "Commit after operator approval, running frontmatter-version.mjs bump first"
    blockers: []
    key_files:
      - ".pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts"
      - ".skilled/skills/sk-doc/shared/scripts/extract_structure.py"
      - ".skilled/hooks/session-relaunch/tests/README.md"
      - ".skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json"
      - "specs/hooks/023-session-relaunch-loop/005-deep-review-remediation/acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:b3544182a8b5085bb6f1e36ea0ce992dea76e019e5963d7495761504e1af5494"
      session_id: "scaffold-005-deep-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-deep-review-remediation |
| **Completed** | 2026-10-18 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The relaunch loop no longer loses log lines, strands an armed record, or lets two killers race for one lock. The deep review passed the loop with twelve P2 advisories, and this phase fixed all twelve with tests first. It also fixed every further finding that the lane reviews and the sk-code-opencode alignment review raised on the way.

### Phase 5: deep-review-remediation

The killer and log path is safer. `relaunch.log` is appended with fsync at mode 0600, and a missing trailing newline is repaired, so concurrent writers keep every line. The killer waits out a 1 s unreadable transcript before giving up. Stale-lock takeover goes through an owner-pid mutex that is reclaimed by atomic rename and removed only by the killer that created it. The state directory is always 0700.

The adapters now share one note-path, threshold and seed-parser helper in `lib/nudge.cjs`, and one process lookup in `lib/relaunch-core.cjs`. Every arm path restarts a killer for an armed record whose killer is not running. The Skip seed suffix has balanced parentheses, and the parser still reads the old spelling.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modified | Append-only log, `ensureStateDir` export, `liveKillerPid`, `findLoopChildPid`, balanced suffix |
| `.skilled/hooks/session-relaunch/lib/killer.cjs` | Modified | Transcript grace, takeover mutex, inode-matched release, state dir mode |
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Modified | Shared `plannedNotePath`, `relaunchThreshold`, `notePathFromSeed`; legacy suffix |
| `.skilled/hooks/session-relaunch/lib/context-usage.cjs` | Modified | `DEFAULT_TAIL_BYTES` constant |
| `.skilled/hooks/session-relaunch/{claude,codex,hermes}/*`, `pi/session-relaunch.ts`, `.opencode/plugins/session-relaunch.js` | Modified | Shared helpers, killer restart on an armed record, headers and types |
| `.skilled/bin/skilled-loop` | Modified | Balanced suffix, header |
| `.skilled/hooks/session-relaunch/tests/*`, `pi/session-relaunch.test.ts`, `.opencode/plugins/tests/session-relaunch.test.cjs`, `.hermes/plugins/repo-guards/tests/test_session_relaunch.py` | Modified | A test per fix (328 to 375 node tests, 14 to 21 Pi tests) |
| `.skilled/bin/README.md`, concern README, catalog leaf, Claude, Pi/OpenCode and command-runtimes playbooks | Modified | Docs match the changed behavior |
| `../003-command-trigger-runtimes/tasks.md`, `../scratch/contracts/interface-contract.md` | Modified | Evidence pointers and superseded relaunch order |
| `.pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts`, `tests/extension.test.ts`, three READMEs | Modified | Duplicate `/fast` guard that yields to a global install, with the agent dir from `PI_CODING_AGENT_DIR` |
| `.skilled/skills/sk-doc/shared/scripts/extract_structure.py`, `.skilled/skills/sk-doc/scripts/tests/test_extract_structure_regressions.py` | Modified | README checklist key `has_toc` renamed to `no_toc` |
| `.skilled/hooks/session-relaunch/tests/README.md` | Created | Tests folder README |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` | Modified | Session-relaunch folder and its tests folder added to the frozen manifest |
| `specs/hooks/023-session-relaunch-loop/001-claude-relaunch-loop/plan.md`, `specs/hooks/023-session-relaunch-loop/004-integration-review-and-docs-closure/plan.md`, `specs/hooks/023-session-relaunch-loop/004-integration-review-and-docs-closure/acceptance-criteria.md` | Modified | Halts heading and cross-references; AC-005 citation split |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

SWE (cli-devin `swe-2-max`) built every code lane, tests first, and a fresh SWE session reviewed each one. Codex was out of quota, so this followed parent decision D5. Claude markdown agents made the doc changes through the sk-doc modes. Briefs that touched the killer went through the prompt-improver first. The orchestrator confirmed every finding in the code before dispatching a fix, and reran the full gate after every lane. The run is recorded at `../scratch/run-ledger.md:421`-`:458`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The seed parser takes the raw absolute path | `skilled-loop` passes the path unescaped, so unescaping or trimming would corrupt a valid path |
| Restart the killer on an armed record with no live lock owner, with no timers | The killer's exclusive lock create already arbitrates a restart that lands while a killer starts |
| Pi reads its config once per event, not once per session | A per-session cache would freeze the config kill switch until restart |
| Accept the last killer-lock fix by orchestrator diff review | Three review rounds on that block found only narrower edge cases; all were fixed with tests |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test` concern and OpenCode tests | PASS, 375/375 (baseline 328) |
| Pi vitest, registration vitest, pytest | PASS, 21/21, 7/7, 62/62 |
| tsc, shellcheck | PASS, exit 0 |
| Hook sync, mirrors, Hermes prompts | PASS 32, 192, 38 |
| Drift guards | PASS 4/4, 278 warnings (baseline 278) |
| Doc validators | 0 issues on every edited doc; playbook package PASS 102/0; catalog package PASS |
| Final gate, orchestrator run at 20:02 today | Every step rc 0: node 375/375, pytest 62/62, Pi relaunch vitest 21/21, registration vitest 7/7, tsc 0, shellcheck 0, hook sync PASS 32, mirrors PASS 192, hermes prompts PASS 38, drift 4/4 (278 warnings, baseline 278), OpenCode import ok, readme manifest gaps 18, Pi Fast Mode vitest 83/83 and tsc 0, sk-doc rename harness 4/4 when run alone. Reported by the orchestrator, not rerun in this session. |
| Rerun in this session | Deep-review node test 1/1 exit 0, verify-iteration vitest 31/31 exit 0, extract_structure pytest 4/4 exit 0 |
| `validate.sh specs/hooks/023-session-relaunch-loop --recursive --strict` (closing run) | RESULT: PASSED for the parent and all five children (001 to 005), Errors 0, Warnings 0, exit 0 |
| Not rerun in this session | Pi Fast Mode vitest and tsc: the package `@earendil-works/pi-coding-agent` does not resolve in this worktree, so the 83/83 and tsc figures stay the orchestrator's |
| `validate.sh` parent `--recursive --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:final-review-wave -->
## Final Review Wave Open Items

- **001 plan heading.** The halts heading now reads `Halts for This Phase and Common Halts` (`specs/hooks/023-session-relaunch-loop/001-claude-relaunch-loop/plan.md:170`), and its cross-reference at `:227` matches it. The complexity check counts the phase headings correctly.
- **004 AC-005 citation.** The range became two single-line citations, which the coverage check can parse (`specs/hooks/023-session-relaunch-loop/004-integration-review-and-docs-closure/acceptance-criteria.md:63`).
- **Pi Fast Mode duplicate guard.** The extension yields to a global install at a different real path, and it compares paths lexically. The agent dir comes from `PI_CODING_AGENT_DIR` through Pi's `getAgentDir()`. Without this, the main checkout registered `/fast` twice. Tests cover the main checkout, a global install, no global install and an agent dir override (`.pi/extensions/pi-fast-mode-w-subagent-support/tests/extension.test.ts:266`).
- **sk-doc README checklist.** The key `has_toc` became `no_toc`, so the check name states the rule it enforces (`.skilled/skills/sk-doc/shared/scripts/extract_structure.py:682`).
- **Session-relaunch tests README and manifest.** The tests folder has a README, and the durable directory manifest lists the session-relaunch folder and its tests folder (`.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json:61`).
- **Deep-loop reducer and verifier fixes.** These belong to `specs/system-deep-loop/038-review-and-cli-lineage/009-findings-summary-integrity/`, which is Complete and validates `RESULT: PASSED`.
<!-- /ANCHOR:final-review-wave -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Pid reuse.** A recycled pid can make a dead lock or mutex owner look alive, so a takeover waits until that process exits. Every pid-liveness check has this limit.
2. **Doc versions.** The edited docs' `version` fields are raised at commit time by `frontmatter-version.mjs bump`, not in the working tree.
3. **Pi suite not rerun here.** The Pi extension imports `@earendil-works/pi-coding-agent`, which this worktree does not resolve. The orchestrator used a temporary `node_modules` link and removed it (`specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:462`).
4. **Final gate figures are the orchestrator's.** The 20:02 run is recorded as reported. This session reran only the packet 009 suites and the extract_structure pytest.
<!-- /ANCHOR:limitations -->


---


