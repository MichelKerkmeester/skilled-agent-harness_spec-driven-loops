---
title: "Tasks: Phase 15: fix-follow-up-review-findings"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "fix follow up review findings tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 15: fix-follow-up-review-findings

<!-- SPECKIT_LEVEL: 2 -->

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

`H` is `.skilled/skills/mcp-browser-use`. `A` is `.skilled/skills/system-skill-advisor/runtime`. The probe prompts are the five in `spec.md` Measured Behavior.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Reproduce each P1 with the reviewer's own case (`../review/lineages/*/iterations/`). Verify: each finding has a check row in `../review/review-report.md`. Evidence: the report's P1 table, corrected for the staging and design rows.
- [x] T002 Attribute each advisor lift to its anchor clause with a temporary debug line (`$A/lib/scorer/fusion.ts`). Verify: `git diff -- $A/lib/scorer/fusion.ts` is empty after the trace. Evidence: noun-only lifts for system-deep-loop, mcp-tooling, mcp-code-mode, cli-orca and cli-classifier; the debug line was reverted with `git checkout`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Count the id noun only beside another lexical token (`$A/lib/scorer/fusion.ts`). Verify: the probe prints no lift for loop, tooling and mode. Evidence: `probe-F2` shows "fix the infinite loop" and "update the build tooling" at none, and mcp-code-mode gone from "the mode rollout".
- [x] T004 Drop the bare `staging` explicit entry and hint, add `staging portal` (`$A/lib/scorer/lanes/explicit.ts`, `lanes/lexical.ts`). Verify: the config-loader probe no longer lifts the hub, and MBU-PB-06 keeps its stage-one pass. Evidence: probe shows sk-code only; in-process replay shows no pass flip.
- [x] T005 Re-pin `doctor-none-04` to no recommendation (`$A/scripts/routing-accuracy/doctor-prompts.jsonl`). Verify: `npx vitest run tests/doctor-routing-slice.vitest.ts` passes. Evidence: `Tests 2 passed (2)`. Approved as Q009.
- [x] T006 Remove `mcp-code-mode` from the hub keyword comment (`$H/SKILL.md`). Verify: the projected hub keywords hold no `code`. Evidence: projection probe prints `keywords (31): []` for that pattern.
- [x] T007 Add `mcp-bladebro` to Bladebro's aliases (`$H/hub-router.json`). Verify: the bundle prompt routes three modes. Evidence: `route orderedBundle mcp-chrome-devtools,mcp-aside-devtools,mcp-bladebro`.
- [x] T008 Add the three-mode bundle canary case (`.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json`). Verify: the harness exits 0 with the alias and 1 without it. Evidence: `without alias exit=1` ("gold mismatch"), `restored exit=0`.
- [x] T009 [P] Replace the Aside console and network cell (`$H/SKILL.md`). Verify: `rg -n 'page.on' $H/SKILL.md` prints nothing. Evidence: `rg exit=1`.
- [x] T010 [P] Reject `..` in the session dir (`$H/mcp-aside-devtools/examples/repl-evidence-capture.sh`). Verify: with a stub `aside`, `./tmp/../../x` exits 1 at the guard and `./tmp/run1` passes it. Evidence: guard message for both `..` paths and for `/etc`; `./tmp` and `./tmp/run1` reach the REPL step.
- [x] T011 [P] Download, pin and verify the Aside installer (`$H/mcp-aside-devtools/scripts/install.sh`). Verify: `bash -n` exits 0 and no `install.sh` under `.skilled/skills` pipes curl into a shell. Evidence: `syntax-ok`; the repo-wide grep exits 1. The pinned digest is the sha256 of the installer read in full.
- [x] T012 [P] Sync `ROUTER.md` with `hub-router.json` (`$H/ROUTER.md`). Verify: the vocabulary diff script prints 0. Evidence: `vocabulary differences 0`.
- [x] T013 [P] Bump hub metadata to 1.1.3.0, write its changelog and regenerate the advisor intent signals (`$H/*.json`, `$H/SKILL.md`, `$H/changelog/v1.1.3.0.md`, `$H/graph-metadata.json`). Verify: `grep -rn 1.1.2.0` over the JSON metadata and `SKILL.md` prints nothing, and `generate-router-intent-signals.cjs --write --hub mcp-browser-use` prints RESULT: PASSED. Evidence: no match; `added=2, orphans=0`. The README was not a version defect: each doc keeps its own version line.
- [x] T014 [P] Fix the reports index, the playbook pointer and the `leaf-scopes.json` line (`$H/benchmark/reports/README.md`, `$H/manual-testing-playbook/manual-testing-playbook.md`, `$H/README.md`). Verify: the index lists both 2026-11-24 runs. Evidence: two new rows.
- [x] T015 Write advisor release 2.0.3.0 (`.skilled/skills/system-skill-advisor/SKILL.md`, `changelog/v2.0.3.0.md`). Verify: `SKILL.md` version reads 2.0.3.0. Evidence: line 5.
- [x] T016 Re-mint the activation manifest and its archive copy. Verify: `compiled-route-guard.cjs --json` shows 0 stale hubs. Evidence: 8 hubs fresh.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Run the full advisor suite (`$A`). Verify: only the known `system-skilled-bots` test fails. Evidence: 2,737 passed, 4 skipped, 1 failed, the same counts as the 014 baseline.
- [x] T018 Run the in-process ratchet metrics. Verify: all eight equal the committed variant. Evidence: full 161, unknown 14, gnff 5, holdout 49, ambiguity 21, review 25, memory save 27, delegation 22.
- [x] T019 Run the 52-row two-stage replay. Verify: only MBU-PB-04 fails. Evidence: `{"PASS":51,"FAIL":1}`, recorded under `compiled-routing/2026-11-24--two-stage-replay--compiled--follow-up/`.
- [x] T020 Run the hub checks. Verify: each prints a clean result. Evidence: `parent-skill-check` OK with 0 warnings; installer test `pass 5 fail 0`; playbook validators `violations=0 warnings=0` for the three modes and the hub; `quality-gate.cjs --worktree` prints `NO_BLOCKER_FOUND`.
- [x] T021 Validate the hub epic. Verify: `validate.sh --strict --recursive` prints RESULT: PASSED for every folder. Evidence: recorded in `implementation-summary.md`.
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
- **Review**: See `../review/review-report.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A moved advisor pin is a blocker until the operator answers.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: REQ-001 to REQ-007.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: sections 1 to 4.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: the Aside installer fetched and read before pinning.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `bash -n` passes on both changed scripts and `npm run build` exits 0 for the advisor. Evidence: `syntax-ok` twice; `build=0`.
- [x] CHK-011 [P0] No debug code is left in the scorer. Evidence: the trace line was reverted; `quality-gate.cjs --worktree` reports 0 findings.
- [x] CHK-012 [P1] The installer refuses a changed script and names the fix. Evidence: the mismatch branch exits 1 and says to read the new script before bumping the digest.
- [x] CHK-013 [P1] Comments carry the why, not finding ids. Evidence: `quality-gate.cjs` reports no comment-hygiene finding.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md` reads Closeable Yes.
- [x] CHK-021 [P0] Manual testing complete. Evidence: the path guard with a stub `aside`, and the installer digest computed by hand.
- [x] CHK-022 [P1] Edge cases tested. Evidence: `./tmp/a/../../..` is rejected; "run the doctor update check" still lifts the doctor skill.
- [x] CHK-023 [P1] Error scenarios validated. Evidence: the canary harness throws a gold mismatch without the alias.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding has a class. Evidence: bundle drop and id noun are class-of-bug; page.on, path guard and installer are instance-only.
- [x] CHK-FIX-002 [P0] Same-class inventory done. Evidence: every id noun of four or more letters was probed; the repo-wide grep finds no other curl-to-shell installer; the vocabulary diff covers all three modes.
- [x] CHK-FIX-003 [P0] Consumer inventory done. Evidence: ratchet, parity, command slice, doctor slice, divergence ledger and the replay all ran.
- [x] CHK-FIX-004 [P0] The path guard was tested with joined, outside-root and fallback inputs. Evidence: `./tmp/../../x`, `./tmp/a/../../..`, `/etc` and the default `./tmp`.
- [x] CHK-FIX-005 [P1] Matrix axes listed. Evidence: the replay covers 52 rows over mode, tie-break, paraphrase, negative, rb, playbook, defer, contract and bundle kinds.
- [x] CHK-FIX-006 [P1] Global-state variant. Evidence: the advisor runs used a fresh temporary database directory and forced local scoring.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the fix commits named in `implementation-summary.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: the only new constant is a public sha256 digest.
- [x] CHK-031 [P0] Input validation implemented. Evidence: the session-dir guard rejects `..`; the installer rejects a changed script.
- [x] CHK-032 [P1] Auth and authz: N/A. No change touches sign-in or permissions.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same seven requirements. Evidence: REQ-001 to REQ-007 in all three.
- [x] CHK-041 [P1] Code comments adequate. Evidence: the noun rule, the staging change and the digest pin each carry their reason.
- [x] CHK-042 [P2] README updated. Evidence: the hub README `leaf-scopes.json` row.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch only. Evidence: probes, traces and the downloaded installer live in the session scratchpad.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: this packet has no scratch folder.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-24
<!-- /ANCHOR:summary -->
