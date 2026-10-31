---
title: "Implementation Summary: Phase 1: trigger-index-freshness"
description: "The committed trigger index is fresh again, its phrase-quality bucket can carry every class, and the retrieval doctor judges staleness by content instead of mtime."
trigger_phrases:
  - "trigger index freshness implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-doctor-audit-followups/001-trigger-index-freshness"
    last_updated_at: "2026-10-03T05:27:40Z"
    last_updated_by: "build-orchestrator"
    recent_action: "Built, regenerated and verified the phase"
    next_safe_action: "Parent session applies the ADR-002 handoff and regenerates the index after every packet lands"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs"
      - ".skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml"
      - ".skilled/skills/system-spec-kit/runtime/data/trigger-index.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-trigger-index-freshness"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-trigger-index-freshness |
| **Completed** | 2026-10-03 |
| **Level** | 3 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The committed trigger index matches the corpus again, and the retrieval doctor now decides staleness from content rather than file times. The generator labels a folder-echo phrase the same way the per-document validator does, so the phrase-quality bucket finally counts every class it promises.

### Phase 1: trigger-index-freshness

`generate-trigger-index.mjs` judges each owner of a single-token phrase with that owner's packet-folder tokens, through the validator's own `packetFolderTokens`, so `folder-token-fallback` reaches `generation-diagnostics.json` (43 phrases over 69 documents after regeneration). The retrieval doctor's phase 0 now runs `generate-trigger-index.mjs --check --json` as its verdict, the mtime sample is supporting evidence at low severity, and the byte-identical proof names `/doctor:rebuild` as its owner. The conventions no longer assert a missing `.opencode/specs` symlink, their ripgrep observations were re-run at 15.2.0, and the retrieval README no longer claims `CLAUDE.md` is a symlink. The index and its three sidecars were regenerated once, at the end of the build.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` | Modified | Judge each owner with its own folder tokens; counting rule for disagreeing owners |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts` | Modified | Case proving `folder-token-fallback` reaches the bucket with per-owner document counts |
| `.skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml` | Modified | `--check` verdict in phase 0, `index_content_stale` signal, mtime demoted, byte-identical owner, `/doctor:speckit` forms |
| `.skilled/commands/doctor/_routes.yaml` | Modified | The route declares the `--check` invocation, so route-validate checks it |
| `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | Modified | §9 alias row, §2.5 and §4 re-tested at 15.2.0, counting rule |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md` | Modified | Symlink claim removed; bucket row; `/doctor:speckit` forms |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | Regenerated | Fresh over 23,056 documents |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/{corpus-manifest,generation-diagnostics,phrase-variants}.json` | Regenerated | Same generator run, one manifest hash |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The baseline `--check` and bucket were captured first, every finding was re-checked (`scratch/findings-recheck.md`), and the generator change was proven by a fixture before regeneration. Regeneration ran the exact command `/doctor:rebuild`'s generator leg runs, directly, rather than the whole rebuild, which also rebuilds the advisor databases this phase does not touch. Mirror sync scripts ran before regeneration and each `--check` exits 0. The build orchestrator wrote the changes directly instead of dispatching CLI executors, because it runs as a leaf worker that may not dispatch other agents. Nothing was committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Judge only single-token phrases per owner | Folder context changes no other class, so the extra judging is confined to the one place it can matter |
| Count documents per owner class and phrases once, folder-token-fallback winning | Documents then match the validator exactly; a phrase can carry only one label, and the folder echo is the more specific finding |
| Make `--check` the doctor's verdict and keep mtime as evidence | mtime moves on checkout and copy without any phrase changing; `--check` compares what the corpus declares |
| Hand off the 033 continuity edit | ADR-002: the file is outside this build's owned files |
| Update the §4 counts rather than pin the old ones | The exit codes are the contract; counts move with the corpus, and the no-hit phrase has to be built at run time because quoting it makes this document match |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check --json` before | FAIL as recorded: exit 1, 177 stale, 176 missing |
| Same command after regeneration | PASS: exit 0, fresh true, 0 stale, 0 missing, 0 obsolete, 23,056 scanned |
| `manifestHash` across the index and three sidecars | PASS: one value |
| `npx vitest run tests/trigger-index.vitest.ts tests/retrieval-coverage-parity.vitest.ts` | PASS: 74 of 74 |
| `npx vitest run --config ../../vitest.config.ts --project cli` | PASS: 158 files passed, 3 skipped; 1,650 tests passed, 19 skipped |
| `bash .skilled/commands/doctor/scripts/route-validate.sh` and `--self-test` | PASS: both exit 0 |
| ripgrep 15.2.0 re-test | PASS: the §2.5 hazard still holds; §4 exit codes unchanged (`scratch/ripgrep-retest.md`) |
| `git status --porcelain` under `retrieval/fixtures/` | Only the three generator sidecars changed; the five frozen fixtures did not |
| Mirror sync scripts `--check` (codex, pi, hermes prompts, runtime mirrors) | PASS: all four exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Handled at each commit: index freshness.** Other packets edited spec documents in the same build, so the parent session regenerated the index after every packet landed and again after merging main; `generate-trigger-index.mjs --check` exits 0 on the final tree.
2. **Resolved in phase 003: the 033 continuity paths** (ADR-002), applied as T023.
3. **Regeneration bypassed the full `/doctor:rebuild` flow.** It ran the leg's exact generator command, without the backup snapshot (git holds the prior bytes) and without the advisor database steps.
4. **Resolved in phase 003: the `/doctor <target>` form in other speckit docs**, replaced by the invocation sweep (T024).
<!-- /ANCHOR:limitations -->

---
