---
title: "Implementation Summary: Retrieval drift remediation"
description: "The retrieval documents now describe the two lanes and five match classes the code implements, the manifest records every directory the walker prunes, the doctor detects a committed index that lags its manifest, and the finished retrofit pipeline left the lookup-time directory."
trigger_phrases:
  - "retrieval remediation summary"
  - "what shipped retrieval drift"
  - "committed pair doctor check"
  - "retrofit convention moved to ops"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/006-retrieval-drift-remediation"
    last_updated_at: "2026-09-06T16:10:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Closed the packet with every gate observed green"
    next_safe_action: "None; continue with the next research lane"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md"
      - ".opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs"
      - ".opencode/skills/system-spec-kit/runtime/cli/ops/retrofit-convention.mjs"
    session_dedup:
      fingerprint: "sha256:d2e178ce98cab9e2d25faaccc6a343d571889f3a6f034d646c0412c882e3d705"
      session_id: "2026-09-06-simplification-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Retrieval drift remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-retrieval-drift-remediation |
| **Completed** | 2026-09-06 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The research lane found the retrieval code correct and its documents wrong in nine places. All nine are closed. You can now copy the recipe from the search router and get the same result the conventions promise, read the five match-class labels the lookup actually emits, and ask the doctor whether the committed index was built together with its manifest.

### Documents that match the code

The conventions describe two lanes, not three; the concept lane and its embedded index are gone, the availability note names the generator, and section 8 tells you to declare phrases of two or more tokens because a single token can only match exactly. Section 9 gained the `dist` row and the `.opencode/specs` alias row. The router recipe is identical to section 2.1, the presentation asset lists all five labels, both READMEs give a test invocation that runs, and the lookup header says that `--limit 0` lifts the cap.

### A manifest that records what the walker does

`EXCLUSIONS` now carries `**/dist/**`, its comment says the list is folded into `manifestHash`, and the parity suite asserts every pruned directory name is recorded while declaring `dist` as the one divergence the ripgrep lane keeps. That suite had been failing on `dist` since the walker began pruning it; it passes now.

### A doctor that sees a split pair

`/doctor speckit-retrieval` compares the hash inside the committed index with the hash inside the committed manifest, a two-file read with no corpus walk, and reports `committed_pair_mismatch`. It also offers the cold-start latency harness as an optional check that writes to packet scratch, so the harness has a caller without touching the frozen fixture.

### The retrofit pipeline in the ops folder

`retrofit-convention.mjs` moved from `retrieval/` to `ops/`, its imports point back into `retrieval/lib/`, both tests and every document follow it, and the retrieval directory holds only what lookup time needs.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `references/retrieval/retrieval-conventions.md` | Modified | Two lanes, five classes, single-token rule, coverage rows |
| `commands/speckit/search.md`, `assets/search-presentation.txt` | Modified | Recipe parity and label list |
| `commands/doctor/assets/doctor-speckit-retrieval.yaml` | Modified | Committed-pair signal and activities |
| `runtime/cli/retrieval/lib/corpus.mjs` | Modified | `dist` in the exclusion record |
| `runtime/cli/tests/retrieval-coverage-parity.vitest.ts` | Modified | Index-only divergence and record assertion |
| `runtime/cli/ops/retrofit-convention.mjs` | Moved | Out of the lookup-time directory |
| `runtime/cli/tests/retrofit-convention-pipeline.vitest.ts` | Modified | Import path |
| `runtime/cli/retrieval/README.md`, `lib/README.md`, `ops/README.md`, `references/structure/grep-convention.md` | Modified | Paths, frozen fixtures, test commands |
| `runtime/cli/retrieval/lookup-trigger-index.mjs` | Modified | `--limit 0` documented |
| `runtime/data/trigger-index.json` and three fixtures | Regenerated | One run after the exclusion change |
| `AGENTS.md` | Modified | Maintenance row names the doctor |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every synthesis row was reproduced in the main checkout first and recorded in the research lane's `confirmed-findings.md`; one P1 row and one P2 row dropped there. The document edits ran as one literal-replacement script that aborts on any site it cannot find exactly once. The module moved with `git mv`, its imports were repointed, and `node --check` passed. The generator ran once, then the seven retrieval suites, the CLI check gate and the dist freshness check were read from their output.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the `promptSetHash` slot | Removing it changes every manifest hash and no reader benefits; the README now documents it as reserved |
| Keep the trigger lookup manual | The hook-system table records it as the manual fallback and Gate 1 instructs the model directly; the finding misread the column |
| Move the retrofit rather than delete it | The grep-convention reference still describes a repeatable pipeline; the ops folder is where maintenance tools live |
| Regenerate the index in this packet | The exclusion record feeds the manifest hash, so the committed pair had to be rebuilt together or the doctor's new check would fire on the next run |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Seven retrieval suites from `runtime/cli` | PASS, 7 files, 221 tests |
| `npm run check` in `runtime/cli` | PASS, zero import-policy violations |
| `dist-freshness.cjs check-all` | PASS, all watched outputs fresh |
| `generate-trigger-index.mjs --json` | published, zero malformed documents, index and manifest hashes equal |
| Residue search for the old retrofit path | no matches outside specs and changelogs |
| `validate.sh <this child> --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Frozen fixtures still pin an old hash** `latency-report.json` and `semantic-probes.json` name a snapshot no committed manifest carries. The README explains the pin; refreshing it means re-running the acceptance probes, which this packet did not do.
<!-- /ANCHOR:limitations -->

---
