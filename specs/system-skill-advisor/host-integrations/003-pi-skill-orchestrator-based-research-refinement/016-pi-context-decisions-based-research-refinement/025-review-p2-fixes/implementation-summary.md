---
title: "Implementation Summary"
description: "The residue cleanup keeps a regular file an explicit server address names, notes a skipped dotenv line and finds a server under a spaced path; the gate docs state their limits, and the 024 records match their evidence."
trigger_phrases:
  - "review p2 fixes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/025-review-p2-fixes"
    last_updated_at: "2026-11-21T13:49:38Z"
    last_updated_by: "generate-context"
    recent_action: "Planned the review P2 fixes in spec, plan, tasks and acceptance criteria"
    next_safe_action: "Run speckit implement on the review P2 fixes"
    packet_purpose: "Purpose: Each advisory closes with a change that a command can check, and the 024 completion metadata matches its evidence, so a follow-up review can move the verdict toward PASS."
    blockers: []
    key_files:
      - "025-review-p2-fixes/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-025-review-p2-fixes"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "0b81ad2f-04a7-4ad7-b174-0b3f9930b833"
      workspace: "/Users/michelkerkmeester/worktrees/public/497-ollama-lane-removal"
      savedAt: "2026-11-21T13:49:38Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 20
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
| **Spec Folder** | 025-review-p2-fixes |
| **Status** | In Progress |
| **Completed** | Not yet: AC-024 waits on the follow-up `/deep:review` |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The lane cleanup no longer deletes a regular file just because `HF_EMBED_SERVER_URL` names it, M7 now tells you when a dotenv line was skipped, and a model server under a checkout path with spaces is found again. The gate's docs now state the push filter it really runs under and the whole-file limit of its allowlist, and the 024 epic's completion records match the evidence behind them.

### Fix the ten P2 advisories from the lane removal deep review

The residue tool had three defects, and each one now has a test that failed before its fix. An explicit server address can name any file, so a name it adds is listed for deletion only when it is a socket. A regular file there stays on disk and M4 notes it, while the four fixed server names keep their old rule. When the dotenv parser rejects a line, M7 adds a note naming the file and keeps its status, because marking it not checked would exit 2 and fail every `/doctor:update apply` over one odd line. `nodeScriptOf` now joins the words of a spaced script path up to the server script's name, and it stops at a word that is a script of its own.

The doc work closes the other advisories. The workflow comment, the catalog page and the 008 plan say the gate runs on every pull request and on pushes to `main` and `skilled/**`. The catalog page and the tool header say an exact-path allowlist row exempts the whole file. The 32 allowlist reasons no longer cite line numbers. Phase 005 closed with T053 and AC-014, the 024 parent and 016 row 24 read Complete, the 024 goal ticks four of its five criteria, and phases 001 and 006 carry an Evidence clause on every checked row.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs` | Modified | Socket-only rule for a name an explicit address adds (line 1340), the dotenv note (line 1533), the spaced script path in `nodeScriptOf` (line 1251), and header decisions 3 and 7 |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/sweep-lane-residue.vitest.ts` | Modified | Real-socket fixture, regular-file case, dotenv rejected-line case, script-match table and one header sentence |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/lane-residue-allowlist.json` | Modified | 32 reasons drop their line numbers; the 47 paths are unchanged |
| `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/lane-residue-gate-and-cleanup.md` | Modified | Push filter wording, the whole-file limit and version `1.0.1.0` |
| `.github/workflows/advisory-checks.yml` | Modified | Comment lines 23 to 25 only |
| `runtime/data/trigger-index.json` and three `retrieval/fixtures` outputs | Regenerated | The last write, by `generate-trigger-index.mjs` |
| `../024-ollama-lane-removal/008-cleanup-wiring-and-gating/plan.md` | Modified | Lines 370, 375 and 400 drop the every-push claim |
| `../024-ollama-lane-removal/goal.md` | Modified | Criteria 1, 2, 3 and 5 ticked, and one progress row through `goal.cjs packet-log` |
| `../024-ollama-lane-removal/005-shared-embeddings-package/` | Modified | T053 and AC-014 closed across spec, plan, tasks, acceptance criteria and summary, and one goal log row |
| `../024-ollama-lane-removal/spec.md` | Modified | Status and phase-map row 5 read Complete |
| `../024-ollama-lane-removal/001-residue-check-and-cleanup-tool/tasks.md`, `../024-ollama-lane-removal/006-prose-docs-and-changelogs/tasks.md` | Modified | 12 and 11 Evidence clauses |
| `../spec.md` | Modified | Row 24 reads Complete, and row 25 lists this packet |
| `graph-metadata.json` and `description.json` in the edited folders | Regenerated | `repair-derived.cjs --apply` |
| This packet's `tasks.md`, `acceptance-criteria.md`, `spec.md` and this summary | Modified | Ticks, evidence and status |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The baseline came first, on `bf3bca7a8b1`: the Vitest file passed 92 of 92, the gate test 2 of 2, and repo mode exited 0 at 47 of 47. The new tests went in next and ran against the unfixed tool. The file exited 1 with `3 failed | 95 passed (98)`, the three failures being the regular-file case, the dotenv case and the spaced-path row, while the real-socket case passed as planned. The three fixes then took the file to 98 of 98. The independent review then found that an installed CLI with no script extension, such as `node /opt/homebrew/bin/eslint <server path>`, read as the model server. `nodeScriptOf` now joins words only when the first is an absolute path that is no file on disk, returns no script for `-e` and `-p`, and skips the value of `-r`, `--import` and `--loader`. Five rows for those cases took the file to 103 of 103.

The wording, allowlist and metadata edits followed. Each new sentence in a file the allowlist does not exempt was checked against both vocabularies before it was written. The gates then ran on the final state, `repair-derived` refreshed the generated metadata, and the trigger index was regenerated as the last write. Nothing is committed; the conductor commits after review.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The socket rule sits in `checkModelServer` (destructive-path hardening gap, R2-P2-001) | The review names `deleteServerFile`, which does not exist. The deletion list is built in `checkModelServer`, so the rule goes where the list is made. |
| M7 adds a note and keeps its status (false-negative status, R9-P2-001) | NOT_CHECKED exits 2 in `machineExitCode`, so every `/doctor:update apply` would fail over one rejected line. |
| `nodeScriptOf` matches a later word ending in `/hf-model-server.cjs` and slices the original line (input-parsing edge case, R1-P2-001) | It is the plan's shortest-prefix rule in one pass, and it keeps any doubled space that ps printed. |
| The whole-file limit is documented, not enforced per term (gate blind spot, R1-P2-002) | The review names the documentation option as sufficient. |
| The allowlist reasons drop their line numbers (documentation drift, R4-P2-001) | The check never verified those numbers, so they could only drift. |
| Three sites say every pull request and pushes to `main` and `skilled/**` (doc-to-config drift R3-P2-003, doc-code drift R7-P2-001) | That is the real trigger, and the trigger itself is unchanged. |
| Goal logs gain rows and never lose one (completion-metadata drift, R3-P2-001 and R3-P2-002) | The log is append-only, so each new Complete row supersedes the older Pending and not-committed rows. |
| Evidence clauses cite a file line or a command (evidence-less checklist rows, R10-P2-001) | A checked row is a claim, and the clause names what backs it. |
| 024 goal criterion 4 stays unticked | It says the alignment findings "are fixed and committed". C-08, the bodies of the tagged releases, waits on the operator after merge, and BAT-01, a latency test that also fails on main, was left unchanged. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| G1 `VITEST tests/sweep-lane-residue.vitest.ts` | Exit 0, 103 of 103 after the review fix; the baseline was 92 of 92 |
| G2 and G4 `node --test lane-residue-gate.test.cjs` | Exit 0, 2 of 2, the planted-term case passed |
| G3 `sweep-lane-residue.mjs repo --json` | Exit 0, 47 of 47 allowlist rows matched, live 0, after the regeneration |
| G5 real-socket case | Machine exit 1 before apply and 0 after |
| G6 strict 024, recursive | `RESULT: PASSED` for the parent and its eight children |
| G7 strict 025 | `RESULT: PASSED` |
| G8 strict 016 | `RESULT: PASSED` |
| G9 `generate-trigger-index.mjs` | Exit 0, run as the last write |
| G10 typechecks and shared tests | Both typechecks exit 0, shared tests 9 of 9, two `No such file` lines |
| G11 comment hygiene | No line |
| `npm run typecheck` in `runtime/cli` | Exit 0 |
| Measured `runsModelServer` command | `true true`; the spaced row returned false on the unfixed tool |
| G12 follow-up `/deep:review` | Not run; the conductor runs it next |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **SL4-005 is still open.** AC-024 and T034 wait on the follow-up `/deep:review`, which decides whether the real-socket fixture closes the deferred fixture-realism item. The packet stays In Progress until it does.
2. **024 reads Complete beside one open goal criterion.** Criterion 4 cannot hold as written while C-08 waits on the operator after merge. Amending it the way criterion 3 was amended would make the tick and the status agree, and that is the operator's call.
3. **The `npm ci` flags are not on record.** The conducting session reports exit 0 in the three packages, but not whether `--offline --no-audit --no-fund` were passed. This run observed the absence checks, both typechecks and the shared tests.
4. **Some cases have no test.** A directory or a symlink at an address name takes the same `isSocket()` rule as the regular file, with no test of its own. A command whose first word after node has no script extension, such as `node -r foo /p/hf-model-server.cjs`, is now listed as a model server but never owned. Apply then keeps the server files while that process runs, which errs toward keeping them.
5. **One adjacent site still says "every push".** `.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md:25` says the doctor test runs `repo` on every push. It is outside this packet's files, so it is reported, not changed.
6. **The continuity frontmatter is stale.** No `/speckit:save` ran, so `_memory.continuity` in this packet still describes the planning session.
<!-- /ANCHOR:limitations -->

---


