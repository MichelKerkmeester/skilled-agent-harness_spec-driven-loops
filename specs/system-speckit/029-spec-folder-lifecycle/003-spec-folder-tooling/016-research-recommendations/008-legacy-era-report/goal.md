---
title: "Goal: Legacy-era report and detection"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/008-legacy-era-report"
    last_updated_at: "2026-10-08T12:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Phase built and verified"
    next_safe_action: "Commit with wave 1"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/repo-era.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Legacy-era report and detection

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Build a unified, read-only packet classifier that detects five pre-v4 signals with one shared classifier using explicit exclusion filtering and header alias normalization, enabling the era report to feed detection results into /doctor:update check, upgrade-legacy preflight, and the weekly corpus sweep.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One shared packet classifier with explicit exclusion list covering research lineages, scratch, changelog, and git-ignored paths to prevent counting containment copies |
| D2 | Header alias table normalizes drifting spellings (impl-summary-core, implementation-summary-core, implementation-summary, resource-map variants) for correct document routing |
| D3 | Read-only analysis module with no mutations, fed into three entry points: /doctor:update check (layout and signal counts), upgrade-legacy preflight (frontmatter findings), weekly sweep (optional era context) |
| D4 | Built in wave 1 by GPT-6 Luna max on the fast tier through cli-codex: `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 codex -a never exec --model gpt-6-luna -c model_reasoning_effort="max" -c service_tier="fast" --sandbox workspace-write "<brief>" </dev/null`. One brief per task group in tasks.md, each naming its files and the check that proves it |
| D5 | Reviewed read-only by DeepSeek V4.1 Flash max through cli-pi on the OpenCode Go route with `--tools read,grep,find,ls`. The builder applies a finding only after confirming it in the code, for at most two rounds |
| D6 | The builder writes only the files in spec.md Files to Change, its tests and this folder. The orchestrator reverts any other write |
| D7 | Its tests go in a new file, `runtime/cli/tests/repo-era.vitest.ts`, so wave 1 shares no test file with phase 005 |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] PacketClassifier walks a 20-packet fixture and counts every packet exactly once (exit 0 from unit test)
- [x] Exclusion list filters research lineages, scratch, changelog, and git-ignored paths (exit 0 from four exclusion test cases)
- [x] Layout detection returns correct v3 vs v4 classification for both layouts (exit 0 from layout test cases)
- [x] Era report runs consistently and produces the same packet count across multiple invocations on the same input
- [x] Header aliases normalize all implementation-summary spelling variants to canonical name (exit 0 from alias test cases)
- [x] Five independent signal detectors work on pre-v4 fixture examples and all signals are counted (exit 0 from signal detector tests)
- [x] Latest spec-kit CLI test suite passes with no new failures (exit 0 from npm run test -- spec-kit)

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning documents written | Done | spec.md, plan.md, tasks.md, acceptance-criteria.md, implementation-summary.md |
| Exclusion list and header aliases | Done | `EXCLUSION_RULES` and `HEADER_ALIASES` in `repo-era.mjs`, separate frozen tables |
| Classifier and report | Done | `classifyRepo` and `buildReport`; corpus run 4431 packets, equal to an independent `find` count of 4431 |
| Layout detection with provenance | Done | v3, v4 and both fixtures pass; this repository reports `v4` with residue 0 |
| Dry-run report lines | Done | `upgrade-legacy` dry run prints the provenance, layout and frontmatter lines |
| README section | Done | `Repo Era Report` in `runtime/cli/spec/README.md` |
| Tests | Done | `repo-era.vitest.ts` 6 passed; with `upgrade-legacy.vitest.ts` 24 passed |
| Cross-family review | Done | DeepSeek round 1: F1 P0 (archives pruned), F2 P2 (residue matched prose), F3 P2 (YAML level ignored); all fixed |
| Whole-suite gates | Done | CLI test exit 0 with 162 files and 1648 tests passed against a baseline of 161 and 1639; `run check`, typecheck and build exit 0; hook tests 184 run, 0 fail |
| Validation | Done | `validate.sh --strict` prints `RESULT: PASSED`; `check-goal.cjs` passes |
| Goal binding in parent | Done | The parent goal.md lists SH-09 for this phase |

### Deviations and findings

| Item | Note |
|------|------|
| 22-packet fixture, not 20 | The main fixture adds archived packets at top-level, track-level and nested depth, so it counts 22 packets |
| Functions, not classes | `classifyRepo` and `buildReport` replace the PacketClassifier and EraReport classes the tasks named |
| Doctor integration left to phase 009 | T009 names `doctor-update-check.yaml`; no doctor file was touched here |
| Findings printed, not routed | The dry run prints layout and frontmatter lines only; the spec's wording about routing findings to repair stages is not built |
| Weekly sweep caller not added | The spec lists it as an optional caller added separately |
| Test command | The CLI package test (`npm --prefix .skilled/skills/system-spec-kit/runtime/cli test`) ran, not the root script the criteria name |
| No test pins the dry-run lines | They were checked by running the dry run |
| REQ-003 is undefined | AC-004 and AC-008 cite it, and spec.md has no such requirement |
<!-- /ANCHOR:log -->
