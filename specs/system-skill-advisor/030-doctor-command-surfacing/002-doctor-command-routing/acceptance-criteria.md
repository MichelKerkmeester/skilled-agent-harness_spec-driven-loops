---
title: "Acceptance Criteria: Doctor command routing: the skill advisor surfaces runnable /doctor:x target lines"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "doctor command routing acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/035-doctor-command-routing"
    last_updated_at: "2026-10-15T16:30:00Z"
    last_updated_by: "speckit-plan"
    recent_action: "Authored one acceptance criterion per requirement"
    next_safe_action: "Run /speckit:implement and meet the criteria in task order"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-035-2026-10-15"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Doctor command routing: the skill advisor surfaces runnable /doctor:x target lines

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skill-advisor/035-doctor-command-routing
**Level:** 2
**Status:** Complete
**Date:** 2026-10-15
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. Gate IDs refer to `plan.md` section 5.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the slice file exists, When G8 runs, Then it scores only the slice and the pinned corpus hashes are unchanged | G8 output, plus G3 holdout-independence passing and `git diff --stat` showing no change to the three pinned corpora. Observed: G8 exit 0, 2 passed. The slice test reads only the slice, the compatibility file and the baseline date. `git status` shows no change to the three pinned corpora, and G3 holdout-independence passed | Met | - |
| AC-002 | REQ-002 | Given the T001 per-prompt snapshot, When every wave has landed, Then no row that passed at T001 fails | G11 report with zero lost rows, plus G3 ratchet output. Observed: G11 exit 0, lost 0, gained 0, missing 0. G3 ratchet passed in the 66-test run | Met | - |
| AC-003 | REQ-003 | Given `_routes.yaml`, When the deriver runs, Then each route has one bridge with the documented id, `skillId` and `ownerMode`, and `--check` reports `fresh` | G1 output and the doctor entries in `command-bridges.generated.json`. Observed: G1 exit 0, `"status": "fresh"`, doctorRoutes 16, ids `command-doctor-<command>[-<target>]` with `skillId` and `ownerMode` from the `skill_agent` tag | Met | - |
| AC-004 | REQ-004 | Given an admitted doctor bridge, When both scorers load, Then it is active in both under one inventory id, and its Python markers are slash strings only | `scoring-compatibility.json` entries, G5 and G7 output. Observed: 15 doctor ids in both lists under one inventory id. Python markers are the runnable slash strings only. G5 pass=66 fail=0, G7 11 passed | Met | - |
| AC-005 | REQ-005 | Given a prompt where a skill and a doctor bridge both pass, When the TypeScript scorer ranks them, Then the skill is first, and a typed doctor command keeps the doctor bridge first | The T014 ordering test, failing under its mutation check, then passing. Observed: `doctor-ordering.vitest.ts` 10 passed. Ordering rule a no-op: 2 of 6 failed. Slash exemption removed: 1 failed | Met | - |
| AC-006 | REQ-006 | Given a doctor recommendation, When the brief renders, Then it shows the runnable `/doctor:<command> <target>` string as the top line or as a second line after the skill, inside the token cap | T015 renderer tests and G4 hook tests. Observed: `doctor-brief-render.vitest.ts` 7 passed, including the token cap test. G4 143 files passed | Met | - |
| AC-007 | REQ-007 | Given `/doctor:setup`, When it runs, Then it lists every doctor target, prints a repair command per failing leg and writes nothing | G2 output and the T028 `git status --short` before and after. Observed: G2 exit 0. The T028 run lists 17 targets, names a repair command per failing leg, and the working-tree hash was identical before and after | Met | - |
| AC-008 | REQ-008 | Given the pinned regime, When "Help me set up skilled" and "check my environment variables" are scored, Then they return `/doctor:setup` and `/doctor:env list` | T027 scorer output for both prompts. Observed: Pinned slice and live daemon: `use /doctor:setup 0.90/0.12 pass` and `use /doctor:env list 0.90/0.16 pass` | Met | - |
| AC-009 | REQ-009 | Given Wave A has landed, When each Wave B route is activated alone, Then G11 shows zero lost rows before the next route starts, and `/doctor:deep-loop` and the `/doctor:mcp` sub-actions have no compatibility entry | One G11 report per wave task, T018 and T020 through T023, plus `scoring-compatibility.json`. Observed: One G11 report per wave, each lost 0. `/doctor:deep-loop` and `/doctor:mcp` sub-actions have no compatibility entry | Met | - |
| AC-010 | REQ-010 | Given the final diff, When it is read, Then no lane weight, threshold or confidence constant changed | `git diff` of `lib/scorer/` showing only the ordering rule and the generated blocks. Observed: `git diff` of `lib/scorer/` shows only the two doctor rules in `fusion.ts` and the generated block in `projection.ts` | Met | - |
| AC-011 | REQ-011 | Given the reach probe, When an admitted phrase is renamed, Then G9 fails, and with the phrase restored it passes | T019 mutation check output. Observed: Phrase renamed without regenerating: `STATUS=FAIL` exit 1. Restored: `STATUS=OK phrases=82 bridges=15` | Met | - |
| AC-012 | REQ-012 | Given no recommendation passes, When the prompt uses setup, install, check or configure wording, Then the fallback carries one sentence naming `/doctor:setup`. When the prompt is plain and unrelated, Then no hint appears. The directive block is unchanged in both cases | T016 tests for both prompts, the hint test failing when the flag check is deleted, and the recorded byte delta. Observed: `hooks/doctor-setup-hint.vitest.ts` 8 passed. Renderer flag check deleted: 2 failed. Hook flag forced false: 5 failed. Byte delta +47. The directive block is unchanged in both live probes | Met | - |
| AC-013 | REQ-013 | Given the manifest, When it is read, Then `/doctor:env` has an entry with trigger phrases, `/doctor:update` has plain-word phrases and the header names the deriver as its consumer | `_routes.yaml` diff and G2 output. Observed: `_routes.yaml` diff shows the `/doctor:env` entry, three `/doctor:update` phrases and a header naming the deriver. G2 exit 0 | Met | - |
| AC-014 | REQ-014 | Given the new command, When the mirror and catalog checks run, Then every mirror exists and the catalog lists 10 doctor commands | G10 output and `.skilled/commands/README.txt`. Observed: G10 five checks exit 0. `.skilled/commands/README.txt` lists 10 doctor commands | Met | - |
| AC-015 | REQ-015 | Given the CI workflows, When each job that runs the bridge generator is listed, Then every one installs the `yaml` parser, through an install step added where it was missing | T010 job list in `scratch/ci-yaml-check.md` and the workflow diff. Observed: `scratch/ci-yaml-check.md` lists each job and its install line. Every job already installs the parser, so the workflow diff is empty | Met | - |
| AC-016 | REQ-016 | Given the playbook and the catalog, When an agent with no context reads a doctor routing scenario, Then it finds exact commands, exact expected text and a PASS/FAIL rule, and the playbook validator, the catalog validator and `hvr_scan.py` report no blocker | Scenario files DOC-385 to DOC-391, `validate-playbook-package.cjs` and `validate_catalog_package.py` output, the playbook inventory test and the `hvr_scan.py` results. Observed: DOC-385 to DOC-391 carry exact commands, expected text and PASS/FAIL rules, and the orchestrator ran them. Playbook validator `violations=0` over 61 scenarios, inventory test passed, both catalog validators PASS, `hvr_scan.py` 0 hard blockers on every new doc | Met | - |
| AC-017 | REQ-017 | Given a healthy install on a runtime other than Claude Code, When `/doctor:setup` runs its sk-git leg, Then the leg passes `--tool=<name>`, exit 3 reads as DEGRADED and never FAIL, and the workflow, presentation contract, router and DOC-391 agree | The battery run per runtime and the four docs. Observed: no `--tool` and `CLAUDECODE` unset gave `STATUS=DEGRADED ... unknown=1` exit 3, `--tool=codex` gave `STATUS=OK checks=11` exit 0, `--tool=hermes` exit 2. `doctor-setup.yaml:53` passes the flag for the six known tools and maps exit 3 to DEGRADED, the presentation contract and `setup.md` carry DEGRADED, DOC-391 no longer calls exit 3 FAIL. `route-validate.sh` exit 0 | Met | - |
| AC-018 | REQ-018 | Given a passing skill and a doctor bridge, When the prompt quotes `/doctor:` mid-sentence, Then the skill ranks first in both scorers, and a prompt that starts with the command keeps the bridge first | `doctor-ordering.vitest.ts` and the Python ordering check, each failing under its mutation. Observed: 11 of 11 passed, 1 failed with the substring rule restored. Python `pass=66, fail=0`, and `pass=65, fail=1` with the old rule | Met | - |
| AC-019 | REQ-019 | Given no recommendation passes, When the prompt says "check what time the tide turns" or "check with my doctor", Then no hint appears, and setup, install, configure and tooling-check prompts still get it | `doctor-setup-hint.vitest.ts` and the plugin parity test. Observed: 116 of 116 passed across the hint, plugin and Pi suites after T046. The original regex in the hook only: 2 failed. In both copies: 1 failed. The T046 regex with `doctor` restored in both copies: "check with my doctor" failed | Met | - |
| AC-020 | REQ-020 | Given a build older than its source, When the reach probe runs, Then it exits 2 and prints no reach verdict | Mutation run. Observed: stale build exit 2 naming the stale dist, guard disabled exit 0 on the same stale build, restored `STATUS=OK phrases=82 bridges=15` exit 0 | Met | - |
| AC-021 | REQ-021 | Given DOC-391 and `setup.md`, When they are read, Then they name the `/tmp/system-skill-advisor` socket directory as the only write outside the repository | The two docs against `.skilled/bin/skill-advisor.cjs:85-102`. Observed: both name it, and DOC-391 notes the working-tree comparison cannot see it | Met | - |
| AC-022 | REQ-022 | Given DOC-385 to DOC-391, When a reader opens the source files section, Then a link to `scorer-fusion/doctor-command-routing.md` resolves | The seven files and the playbook validator. Observed: one backlink per file, target exists, `validate-playbook-package.cjs` `violations=0` over 61 scenarios | Met | - |
| AC-023 | REQ-023 | Given the advisor feature catalog, When its rows are counted, Then every row has a page and the overview counts match | Catalog validator and row count. Observed: the OpenCode native-hook row is gone, the overview says 43 features for 43 leaf files and the hooks group says 4. `PASS: 0 violations` | Met | - |
| AC-024 | REQ-024 | Given the command tree, When the README totals are read, Then both say 39 | `README.md:80` and `README.md:1074`. Observed: 39 entry points, 36 across 6 groups plus 3 root utilities, matching `.skilled/commands/README.txt` | Met | - |
| AC-025 | REQ-025 | Given the registry README and every touched doc, When they are read and scanned, Then the registry names DOC-385 to DOC-391 and `/doctor:setup`, and each doc reports 0 hard blockers | Registry line 26 and `hvr_scan.py` per doc. Observed: line 26 lists DOC-385 to DOC-391. All 15 touched docs report `hard blockers: 0`, including three that carried 1, 2 and 27 at HEAD | Met | - |
| AC-026 | REQ-026 | Given the 59 short prompts in `scratch/short-prompts.json`, When each is scored with and without the doctor bridges, Then every prompt that routes to a skill without them routes to the same skill with the same confidence and uncertainty, in process and live | `scratch/short-prompt-probe.mjs` and the live CLI. Observed: before the fix 7 lost and 2 changed (`scratch/short-prompts-before.json`). After: `TOTAL=59 LOST=0 CHANGED=0` (`scratch/short-prompts-after.json`) and `LIVE_DIFF=0` (`scratch/short-prompts-live.json`). `tests/scorer/doctor-bridge-isolation.vitest.ts` 39 of 39, with the old pass order 24 of 39 failed | Met | - |
| AC-027 | REQ-027 | Given three passing skills and a passing doctor bridge, When the result is cut to three, Then the doctor bridge is still in it | `tests/scorer/doctor-ordering.vitest.ts` and the live CLI. Observed: "update skilled to the latest release" returns sk-code, system-deep-loop, `command-doctor-update`. Ordering test 24 of 24, old function 8 failed | Met | - |
| AC-028 | REQ-028 | Given "please run /doctor:setup for me", "/doctor:sk-code" and a quoted command, When each scorer ranks them, Then the typed bridge is first and the quoted one is not | Live CLI, ordering test and Python suite. Observed: `command-doctor-setup` first live. Python `pass=68, fail=0`, old file `pass=66, fail=2` | Met | - |
| AC-029 | REQ-029 | Given the advisor leg's exits, When the workflow reads them, Then a stale build is FAIL with the build command, a stopped daemon SKIP, a non-live graph DEGRADED and a sk-git exit 2 ERROR | `.skilled/commands/doctor/assets/doctor-setup.yaml:53-56`. Observed: the leg text states each rule, YAML parses and `route-validate.sh` reports 14 routes OK. The stale-build case is derived from `.skilled/bin/skill-advisor.cjs:70-79`, not reproduced | Met | - |
| AC-030 | REQ-030 | Given an activated phrase under three words, When the reach probe runs, Then it fails that phrase, and the manifest header names every add-a-target step | `scripts/tests/doctor-phrase-reach.test.cjs`. Observed: 3 of 3, the new test failed with the guard disabled. Final probe `STATUS=OK phrases=82 bridges=15` | Met | - |
| AC-031 | REQ-031 | Given a long paste and the listed wording, When the hint check runs, Then it ends fast and hits only the intended prompts | `tests/hooks/doctor-setup-hint.vitest.ts`. Observed: 600,000 characters took 15,794 ms with the old check and 2 ms now. 18 of 18, old check 7 failed. Plugin suite 303 of 303 | Met | - |
| AC-032 | REQ-032 | Given a bare number as a standalone phrase, When the deriver runs, Then it exits with a named error | Scratch run. Observed: exit 1, `must be an array of non-empty strings`, manifest restored and `--check` fresh | Met | - |
| AC-033 | REQ-033 | Given a 20-token cap, When the brief renders a skill with a doctor companion, Then no `Also:` text appears | `tests/doctor-brief-render.vitest.ts`. Observed: 8 of 8, old render.ts 1 failed | Met | - |
| AC-034 | REQ-034 | Given the old scorer, When the new slice and probe run, Then they fail on the bugs this remediation fixed | Observed: slice against the scorer from before T047 failed 13 rows, with only T047 applied 6 rows. Probe against the scorer from before T047 missed 9 phrases | Met | - |
| AC-035 | REQ-035 | Given the spec-kit docs, When they are read, Then each `advisor_status` passes `--workspace-root`, the README lists five doctor commands and the catalog says seven routers and 14 routes | Observed: six lines changed, catalog validator `PASS: 0 violations` for both packages | Met | - |
| AC-036 | REQ-036 | Given the root README and the two indexes, When compared with the files on disk, Then counts, verdicts and script lists match | Observed: seven routed commands, 23 YAML workflows, `setup.md` and `doctor-phrase-reach.cjs` listed, 0 hard voice blockers before and after | Met | - |
| AC-037 | REQ-037 | Given the advisor docs, When compared with the code, Then the typed rule, ordering, activation, `Also:` line and hint wording match | Observed: ten files changed, 0 new hard voice blockers, Hermes copy resynced (`PASS: 68 Hermes skill copies in sync`) | Met | - |
| AC-038 | REQ-038 | Given the three false statements, When corrected in place, Then the entries are true and the sk-doc hub passes its check | Observed: `validate_document.py --type changelog` 0 issues on both entries, `parent-skill-check.cjs .skilled/skills/sk-doc` exit 0 with 0 warnings | Met | - |
| AC-039 | REQ-039 | Given the implementation summary, When read against the repository, Then status, validator rows and limitations are current | Observed: status Complete and committed from `1996cf02a6`, the playbook row states the advisor SKIP, Known Limitations renumbered with the closed items removed | Met | - |
| AC-040 | REQ-040 | Given the eleven short prompts, When scored in process and through the live CLI, Then each tops on its owner and the per-prompt comparison shows lost 0 and missing 0 | Observed: in process and live, sk-git for the six git prompts, system-spec-kit for four, mcp-tooling for "mcp tools"; comparison lost 0, gained 0, missing 0; isolation test 52 of 52, 11 failed with the old metadata | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

Every criterion is met with observed evidence. The packet is not committed, which is the operator's step.
<!-- /ANCHOR:closure -->
