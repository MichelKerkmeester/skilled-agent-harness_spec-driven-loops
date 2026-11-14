---
title: "Implementation Summary"
description: "Archived path hits are marked in JSON, proposed maps pass the preflight and the archive search signal no longer scores on review prompts. The sub-track routing fix is blocked."
trigger_phrases:
  - "proposal search and routing implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/009-proposal-search-and-routing"
    last_updated_at: "2026-11-14T09:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Built A11, A12 and B7 (242c719451, 0701a31ae5); B8 accepted as a miss"
    next_safe_action: "None for this phase"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/suggest-subtracks.mjs"
      - ".skilled/skills/system-spec-kit/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-proposal-search-and-routing"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "B8 routing: accept the miss (decision Q014)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-proposal-search-and-routing |
| **Completed** | 2026-11-14 (`242c719451`, `0701a31ae5`). A11, A12 and B7 closed. B8 accepted as a known miss by the operator (decision Q014) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The path recipe's JSON now says which listed paths are archived, a proposed map no longer trips the relocate preflight, and the archive search signal stopped winning a review prompt by accident. Sub-track requests that name a skill track still route to that skill, a miss the operator accepted.

### Phase 9: proposal-search-and-routing

- **A11.** The `path` recipe's JSON record carries `archivedPaths` beside the unchanged `paths` array. The text output is identical to before.
- **A12.** `suggest-subtracks.mjs` never proposes a group name an existing track folder already holds. A packet not named `NNN-slug` is named and no map is printed.
- **B7.** The signal "find a phrase in archived spec packets" became "quote a phrase in archived spec packets". The system-spec-kit score for the review prompt `rr-iter3-135` is now the same as with the signal removed (0.613602), and "look up a phrase in the archived spec packets" still ranks system-spec-kit first.
- **B8, accepted miss.** "suggest sub-tracks for the <skill> track" still ranks the named skill first. The best wording without a skill or track name, "suggest sub-tracks", put system-spec-kit first for the sk-git and sk-doc prompts but left the sk-code prompt 0.017779 short, so it was reverted. The signals stay as they were.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs` | Modified | `archivedPaths` |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/suggest-subtracks.mjs` | Modified | Group names and packet name check |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/rg-include-archive.vitest.ts`, `suggest-subtracks.vitest.ts` | Modified | Four cases |
| `.skilled/skills/system-spec-kit/graph-metadata.json` | Modified | The archive search signal |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Regenerated | By `skill_graph_compiler.py --export-json` |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json` | Recaptured | By `capture-scorer-eval-baseline.mjs --write` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two `dsh` briefs to DeepSeek V4.1 Flash at max reasoning ran in parallel on separate files, one for the code and one for the signals. The orchestrator committed the code half, merged `origin/main` into the branch, ran the graph compiler and the scorer, found the one moved row with `--misses`, recaptured the baseline and committed the signal half. Evidence: `scratch/build-evidence-code.md`, `scratch/build-evidence-signals.md`, `scratch/reproduce.txt`, `scratch/after.txt`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep `paths` and add `archivedPaths` beside it | The one production reader reads other fields, so nothing breaks (`scratch/path-record-readers.txt`) |
| Accept the scorer drop from 161 to 160 | The only moved row is `rr-iter3-135`, the review prompt whose earlier win came from the accidental `findings` match |
| Stop B8 rather than add a skill name to a signal | A skill name in a spec-kit signal would repeat the overfit reviewer B found in the hub vocabulary work |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Three suites before and after | 39 passed, then 43 passed, exit 0 |
| `COUNT` | `2 2`, was `2 0` |
| Path recipe text output, old against new | Identical, 14 lines |
| Full CLI `npm test` | PASS: 2599 passed, 0 failed |
| Advisor parity suites, then the full advisor suite | 64 passed; 1716 passed, exit 0 |
| `skill-graph-freshness.cjs --strict` | No signal drift, exit 0 |
| `validate.sh --strict` on this folder | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **B8 accepted as a miss.** Sub-track requests that name a skill track route to that skill, with system-spec-kit second. The operator chose this over a scorer change or a name exception (decision Q014).
2. **Advisor state in a worktree.** After a graph change, the Python compatibility check `T243-SA-022` fails until one advisor call rewrites the worktree's gitignored generation file. Seen here and resolved by a plain `advisor_recommend` call.
<!-- /ANCHOR:limitations -->

---
