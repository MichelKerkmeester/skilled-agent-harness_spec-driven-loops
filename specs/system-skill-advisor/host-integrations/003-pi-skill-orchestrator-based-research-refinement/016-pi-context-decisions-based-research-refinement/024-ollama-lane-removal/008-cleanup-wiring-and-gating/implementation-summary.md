---
title: "Implementation Summary"
description: "/doctor:update apply now cleans what the retired lane left on the machine it runs on, asks about the pulled shared model on every run and remembers no answer, and a lane term that returns to any tracked file outside specs/ fails a blocking CI job and the doctor tests."
trigger_phrases:
  - "cleanup wiring and gating implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/008-cleanup-wiring-and-gating"
    last_updated_at: "2026-11-21T07:50:22Z"
    last_updated_by: "generate-context"
    recent_action: "Implemented and verified phase 008"
    next_safe_action: "Run /local-doc-alignment and /local-skilled-alignment on the lane removal"
    packet_purpose: "Purpose: Every update removes what the lane left on the machine it runs on, asks about the pulled shared model each time, and any lane term that comes back fails CI and the doctor tests."
    blockers: []
    key_files:
      - "008-cleanup-wiring-and-gating/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:21afa2aa3e6ffb1fe5855e1f11a614de70855d4e3eee97ddac56eaecba1453b2"
      session_id: "scaffold-008-cleanup-wiring-and-gating"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "0b81ad2f-04a7-4ad7-b174-0b3f9930b833"
      workspace: "/Users/michelkerkmeester/worktrees/public/497-ollama-lane-removal"
      savedAt: "2026-11-21T07:50:22Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-cleanup-wiring-and-gating |
| **Completed** | 2026-11-21 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The lane cannot come back quietly, and an upgrade removes what it left behind. A lane term in any tracked file outside `specs/` now fails the blocking `lane-residue` job in `advisory-checks.yml` and the doctor test `lane-residue-gate.test.cjs`, and `/doctor:update apply` runs the cleanup after its rebuild step.

### Phase 8: cleanup-wiring-and-gating

The apply workflow runs the residue tool in apply mode on the machine it runs on. When the tool reports the pulled shared model in `askFirst`, the workflow asks the operator and passes `--shared-model delete` or `keep` to that one run; no answer is written to state, so the next run asks again. Repo mode now reads the four trigger index outputs by structure and fails when a lane path, phrase or spelling resolves outside `specs/` and the allowlist, which replaced the four whole-file rows phase 007 added. A malformed output makes it exit 2 rather than pass. The four hardening items from the first phase's review landed, and a backup copy of the advisor database counts as residue only when it still holds a lane object.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs` | Modified | Structural index check, fail-closed shape checks, backup inspection, hardening |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/sweep-lane-residue.vitest.ts` | Modified | 39 new cases, including two runs that each ask about the model |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/lane-residue-allowlist.json` | Modified | The four index-output rows removed |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md` | Modified | Documents the index check and the gate |
| `.skilled/commands/doctor/assets/doctor-update-apply.yaml`, `doctor-update-presentation.txt` | Modified | The cleanup step and its per-run model question |
| `.skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs` | Modified | Pins the step order and that no answer reaches state |
| `.skilled/commands/doctor/scripts/tests/lane-residue-gate.test.cjs` | Created | Fails when repo mode finds a live lane term |
| `.github/workflows/advisory-checks.yml`, `.github/workflows/README.md` | Modified | The blocking `lane-residue` job |
| Two `/doctor:update apply` playbook pages | Modified | The cleanup step, with the scripted run pointed at scratch locations |
| `.skilled/skills/system-skill-advisor/changelog/v2.0.0.0.md` | Modified | The upgrade step names the wired cleanup |
| The four trigger index outputs | Regenerated | Follow the spec doc edits |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

An Opus worker reran the measurements at `e758041df47`, wired the workflow, built the index check, made the repo check gating only after repo mode printed `live : 0`, and proved apply on fixture roots only. The review returned REQUESTED_CHANGES: the index check defaulted a missing or renamed phrase-variants map to empty, so a lane spelling could pass the blocking job. The worker made every malformed shape exit 2 with three new cases, made the backup copy check inspect the file, and isolated the scripted playbook run. The worker stalled during its final reruns, so the conductor stopped it, read both fixes, reran the suites, repo mode and the planted fixture, regenerated the index as the last write and committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The workflow asks and passes `--shared-model` for one run | An agent-run update has no terminal for the tool to ask on, and decision D5 forbids remembering the answer |
| A structural index check replaces the four whole-file rows | Whole-file rows would hide any future lane term in those outputs |
| Malformed index outputs exit 2 | A check that defaults a missing map to empty reports clean when it checked nothing |
| Inspect backup copies instead of flagging all of them (conductor amendment to ADR-002) | Otherwise any normal rebuild after the removal leaves machine mode unable to read clean |
| Keep the advisory job's existing `name:` | Renaming a check others may depend on is the operator's call |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `sweep-lane-residue.mjs repo` | exit 0: 46 rows, 46 matched; index read by structure, 1069 lane paths, 389 lane phrases, 0 outside; live 0 |
| Planted lane term in a fixture repo with an empty allowlist | exit 1, `live : 1` |
| Machine mode on a fixture after apply | exit 0, nothing left (the worker's run) |
| Machine mode on the operator's machine, read only | exit 1: M2 (4), M6 (model server did not answer), M8 (27 worktrees) |
| `sweep-lane-residue.vitest.ts` | 90 passed, rerun by the conductor |
| `lane-residue-gate.test.cjs` and `doctor-update-contract.test.cjs` | 22 passed, 0 failed, rerun by the conductor |
| Doctor `run-all.sh` | 7 suites passed |
| Mirror check, link check | 260 mirrors in sync; 0 broken |
| actionlint, `check-gate-inputs.sh` | exit 0; `RESULT: PASSED` |
| `generate-trigger-index.mjs --check` | exit 0 after the last regeneration |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Machine mode still exits 1 on the operator's machine.** It clears once the operator runs `npm ci`, answers yes to the model question in a real `/doctor:update apply`, and retires the older worktrees that still hold the lane.
2. **The tool fails when it inherits `GIT_DIR`.** That was already true at `S`; a git hook that runs it would need to unset the variable first.
3. **Whether the `lane-residue` job is a required status check** depends on branch protection, which this run did not change.
4. **The advisory job's name** still describes its older purpose; renaming it is the operator's call.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:alignment-pass -->
## Alignment Pass

Two report-only alignment runs over the branch at `6820170d3b1`: the doc run (`local-doc-alignment`, `20261121T080521Z`) and the skilled run (`local-skilled-alignment`, `20261121T080516Z`). Each finding was checked against the code before any edit.

| Finding | Run | Verdict | Evidence |
|---------|-----|---------|----------|
| L1-1 | doc | fixed | The workflows README row and the `advisory-checks.yml` header comment now name the exact-path allowlist and the per-entry index check (`isOutside` in `checkIndexOutputs`) instead of "any tracked file". |
| L3-1 | doc | fixed | `ARCHITECTURE.md` read path says four lanes; `LANE_DEFINITIONS` in `lane-registry.ts` holds four. |
| L4-1 | doc | fixed | `skill_graph_scan` row lists `skillsRoot` plus the `SkillGraphIndexResult` fields, with `docs` when the doc-trigger harvest is on; `scan.ts` returns `{ skillsRoot, ...scanResult }`, so the literal fix, which left out `docs`, was not used as written. |
| N1 | doc | fixed | The `ENV-REFERENCE.md` row, `lane-fusion.md` and the `.env.example` comment say the launcher does not forward `SPECKIT_ADVISOR_RRF_FUSION`; it is absent from `CHILD_ENV_ALLOWLIST` and `NATIVE_BRIDGE_ENV_ALLOWLIST`. No allowlist was changed. |
| BAT-01 | doc | recorded | Scorer latency test (uncached p95 80.451 ms against 60); conductor triage: it fails on main too under machine load. Not changed. |
| L3-2 | doc | fixed | `skill-graph-drift.md` failure row describes discard and rescan; `removeOutdatedDatabase` deletes the file and its sidecars, nothing migrates. |
| L3-4 | doc | fixed | LC-004 rewritten to seed a schema version 1 file with a marker table and expect version 2, no marker and rebuilt rows; root playbook row and the LC-005 link label follow. |
| L2-1 | doc | fixed | The apply YAML `when` names vector objects, embedding columns, the model name in bytes and copies that cannot be opened, as `checkDatabases` and `inspectSqliteFile` do. |
| N2 | doc | fixed | `cli-front-door-contract.md`: warm-only attaches only to a live daemon, exits `75` without spawning, and still runs the command (`ensureDaemonReady`). |
| N3 | doc | fixed | `freshness-contract.md` drops `freshness-detector.ts`, which `.skilled/skills/system-skill-advisor/runtime/lib/freshness/` does not hold. |
| N4 | doc | fixed | `validation-baselines.md` points at `.skilled/skills/system-skill-advisor/runtime/bench/latency-bench.ts`, which `advisor-validate.ts` imports. |
| N5 | doc | fixed | Workflows README says 16 gate-critical suites; the step lists 16 `.test.mjs` files. |
| N6 | doc | fixed | Lease contract says 5 second heartbeat and stale at 30 seconds in sections 2, 3 and 4 (`DEFAULT_HEARTBEAT_MS`, `DEFAULT_STALE_AFTER_MS`, stale when heartbeat age reaches `staleAfterMs`). |
| N7 | doc | fixed | The dead-PID variant now runs in process through `mcp-diagnostics-stress.vitest.ts` (1 passed); no documented direct daemon entrypoint exists and the launcher drops the variable. |
| L3-3 | doc | fixed | Drift source 4 describes the SQLite `SCHEMA_VERSION` discard; graph-metadata `schema_version` 1 or 2 is accepted (`SUPPORTED_SCHEMA_VERSIONS`). |
| L4-2 | doc | fixed | `.skilled/skills/system-spec-kit/shared/README.md` preamble drops the provider-credential clause; all 8 table variables are in `.env.example`, `env-reader-table.mjs --check` exit 0. |
| L4-3 | doc | fixed | Scorer README `fusion.ts` row: weighted blend by default, RRF only under the flag (`useRrfFusion`). |
| L2-2 | doc | fixed | Presentation section 9 gains Stopped, Refused and Failed lines for the tool's `stopped`, `refused` and `failed` actions. |
| B-1 | skilled | fixed | Same row as L4-1; this literal kept `scanResult` and `sourceSignature`, neither of which the handler returns, so it was not used. |
| PRB-01 | skilled | recorded | Operator's routing decision: no advisor vocabulary added, so frozen routing baselines do not move. The route is documented in `update.md` section 6 and presentation section 9. |
| PRB-02 | skilled | recorded | Same decision as PRB-01. |
| A-1 | skilled | fixed | The `it.each` fixture is made by `mkdtemp` under the short system temp root and removed in `afterEach`; the suite passes 91 of 91 with the default TMPDIR and with a 132-character TMPDIR, where the baseline failed 1. |
| A-4 | skilled | recorded | No code change. `phase_7_lane_cleanup` runs after `phase_6_rebuild_prompt`; `checkDatabases` lists `skill-graph.sqlite` only when it holds a lane object, the schema version 2 tables hold none (machine mode M3 `absent` on this checkout), and a version 1 file it deletes is derived state the next scan rebuilds. |
| C-7 | skilled | fixed | `PROSE_TERMS` gains `hf model server`, `hf embed server`, `local embedding server`, `model server supervision` and `sidecar env allowlist`, with a repo-mode test; the 6 live files it found were fixed in prose, and no allowlist row was added. |
| ENV-01 | skilled | not real | `grep -c` of the token in `capture-command-routing-baseline.mjs` at HEAD is 0; it was added and removed within the branch, and repo mode, which carries the token as an identifier term, reports live 0. |
| ENV-02 | skilled | not real | `grep -c VITEST` in the same file at HEAD is 0; same history. |
| A-3 | skilled | fixed | Comment says three sibling modules: `artifact.mjs`, `normalize.mjs` and `esm-entry.mjs`, each loading only Node built-ins or each other. |
| B-3 | skilled | fixed | `.skilled/skills/system-spec-kit/runtime/cli/README.md` tree line and retrieval row name the lane residue sweep, its CI job and the doctor cleanup. |
| B-5 | skilled | fixed | Tests README row describes the 13 authored-phrase anchor cases the file holds. |
| B-6 | skilled | fixed | `.skilled/skills/system-skill-advisor/runtime/tests/skill-graph/README.md` description, trigger phrase, overview and commands point at `skill-graph-db.vitest.ts`; three rows in `.skilled/skills/system-skill-advisor/runtime/tests/README.md` say the folder holds only its README. |
| B-7 | skilled | fixed | `ARCHITECTURE.md` says 21 flat modules and 13 domain folders, the counts `ls` returns. |
| B-8 | skilled | fixed | Anchors read `8-18` and `43-45`; `LANE_DEFINITIONS` ends at line 18, so the literal's unchanged `8-19` was also corrected. |
| C-3 | skilled | fixed | Spec-kit `ROUTER.md` memory domain names epistemic vectors; `.skilled/skills/system-spec-kit/references/memory/` holds no embedding file. |
| C-4 | skilled | fixed | `VOYAGE_API_KEY` bullet removed from the spec-kit `SKILL.md` security section; no spec-kit code reads it. |
| C-6 | skilled | fixed | `validation-and-enforcement.md` drops the deleted doc-model reference check (`GUARDED_COUNT = 19`). |
| B-2 | skilled | fixed | New catalog leaf `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/lane-residue-gate-and-cleanup.md` and its root section; `validate_catalog_package.py --package system-spec-kit` exit 0. |
| C-5 | skilled | fixed | The comment-hygiene playbook row drops the doc-model CI sentence; `advisory-checks.yml` has no such step. |
| C-1 | skilled | fixed | `.skilled/bin/README.md` description, trigger phrase and blockquote no longer name the deleted server. |
| C-2 | skilled | fixed | `.skilled/bin/lib/README.md` description and two trigger phrases describe the bridge and compiled-routing groups the folder holds. |
| D-1 | skilled | recorded | No routing vocabulary added. `update.md` section 6 and presentation section 9 say the cleanup is reached only through `/doctor:update apply`; the probes stand as the operator's routing decision. |
| A-2 | skilled | not real | Overturned by the critic: renaming the job is the operator's call, listed under Known Limitations. |
| B-4 | skilled | not real | Overturned by the critic: the doctor update apply playbooks cover the cleanup. |
| Bare `embeddings` | conductor | recorded | Not added to the vocabulary: it would flag 37 more files (13 changelogs, the rest retired-memory history, teaching examples, a negative assertion and a routing keyword); its one advisor-lane hit is the L4-1 row, fixed above. |
| Pre-commit comments | conductor | fixed | `.skilled/scripts/git-hooks/pre-commit` no longer says the doc-model reference validator moved to CI; the validator was deleted with the shared embeddings package. |
| Parity test path | conductor | fixed | `package-root-parity.vitest.ts` builds its nested start folder as `shared/nested`, not the deleted package's path; 42 passed. |
| S5, S6, S13 lanes | skilled | recorded | Lane C stalled on a shell loop and returned nothing, so READMEs, changelogs and env docs were covered by battery rows only in that run. |
<!-- /ANCHOR:alignment-pass -->
