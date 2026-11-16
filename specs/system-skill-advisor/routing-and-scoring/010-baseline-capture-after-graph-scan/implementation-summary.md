---
title: "Implementation Summary"
description: "Planned, not built. A baseline capture run straight after a skill graph scan was reported to read old state, and this packet holds the plan to reproduce it and find the cause."
trigger_phrases:
  - "baseline capture after graph scan implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/010-baseline-capture-after-graph-scan"
    last_updated_at: "2026-11-16T13:22:25Z"
    last_updated_by: "generate-context"
    recent_action: "Built the host capture file and closed the stale capture as not reproduced"
    next_safe_action: "Verify the Barter session knows which commit holds the capture file"
    packet_purpose: "Purpose: A host has a supported way to hold its own captured values."
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts"
      - ".skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts"
      - "specs/system-skill-advisor/routing-and-scoring/010-baseline-capture-after-graph-scan/handover-to-barter.md"
    session_dedup:
      fingerprint: "sha256:da7976784dcfb72b8ed75031093e5f0ef71c9f8a6974d2fffda25b2c87206586"
      session_id: "scaffold-010-baseline-capture-after-graph-scan"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "3912763e-4a15-47d7-994e-71d31bbf339f"
      workspace: "/Users/michelkerkmeester/worktrees/public/425-repin-engine-limits-intake"
      savedAt: "2026-11-16T13:22:25Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-baseline-capture-after-graph-scan |
| **Completed** | 2026-11-16 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

A host with its own hub vocabulary can now keep its own captured routing values in `.host.json` files beside the upstream ones. The two tests that read the captured fixtures read a host file when it exists, so every row stays guarded on the host.

The stale capture after a scan was not reproduced. Ten runs of the report's shape on a private copy of the tree printed `same`, and no file the capture reads changed between its two captures.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts` | Modified | Reads `command-routing-baseline.host.json` when it exists. The recapture hint names the redirect command when it reads the host file. Two new tests cover the choice of file |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts` | Modified | Reads `local-native-approved-divergences.host.json` when it exists |
| `scratch/repro-capture-after-scan.sh`, `scratch/trace-reads.mjs`, `scratch/summarize-inputs.sh` | Created | The reproduction, the read tracer it uses to list the capture's inputs and the summary of input hashes |
| `scratch/repro-results.txt`, `scratch/inputs-at-capture.txt` | Created | Ten result lines and the input hashes per run |
| `scratch/host-capture-check.sh`, `scratch/host-capture-check/` | Created | The end-to-end check for host capture files and its four test summaries |
| `handover-to-barter.md` | Created | The result for the vendoring project, what to record next time and how to write host files |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

The reproduction ran against a private copy of `.skilled` and `.opencode` in a scratch folder, with `node_modules` linked to the checkout. Its scan wrote to a private `SYSTEM_SKILL_ADVISOR_DB_DIR`, which also gave its daemon its own socket scope. No tracked file in the checkout was edited for the reproduction.

The two test files were prototyped in the checkout, saved and reverted. Three briefs then applied them through Mistral Vibe on deepseek-flash. Brief 01 added the failing tests, brief 02 the host file for the slice test and brief 03 the host file for the ratchet. Each run ended `exit_code= 0 outcome= finished`, and each edited file matched the expected bytes.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Build after the plan was read | The operator first chose analyze and plan, then approved the build on 2026-11-16 |
| A host file is named `<upstream name>.host.json` and sits beside the upstream file | The operator chose a host capture file beside the upstream one. One naming rule serves both tests |
| A host writes its file by redirecting the capture's stdout | The capture script is not in this packet's scope, and `--write` targets the upstream file |
| The file choice is a small function in each test file, unit-tested in the slice test | Two copies are not a pattern. The ratchet's copy is covered by the end-to-end check |
| Close part A as not reproduced, with no change to the capture | Ten runs printed `same`. The spec rules out a wait or retry before a cause is named |
| Run the reproduction on a private copy | A flipped run edits sk-code's router files, and the scan writes advisor state that other sessions share |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Two fixture tests before the change, on HEAD | `Tests  13 passed (13)` |
| Slice test after brief 01 | `Tests  2 failed \| 4 passed (6)`, both `ReferenceError: capturePath is not defined` |
| Slice test after brief 02 | `Tests  6 passed (6)` |
| Two fixture tests after brief 03 | `Test Files  2 passed (2)`, `Tests  15 passed (15)` |
| `scratch/host-capture-check.sh` on a private copy | Upstream vocabulary 15 passed. Host vocabulary with no host file `2 failed \| 13 passed`. Host vocabulary with host files 15 passed. A later vocabulary change against the host files `2 failed \| 13 passed` |
| Reproduction, ten runs | `wc -l scratch/repro-results.txt` prints 10, all `result=same` |
| Inputs between the two captures | `the wait changed: nothing` and `capture 2 changed: nothing` for all ten runs |
| sk-code `graph-metadata.json` during each run | A 200 ms poll saw one state in each plain run and two in each flipped run: the original and the regenerate write. Nothing rewrote it after the regenerate step, with a warm daemon or a fresh one |
| `quality-gate.cjs` on the two test files | `gate=NO_BLOCKER_FOUND`, `findings: 0` |
| Advisor suite, whole, once | `Tests  9 failed \| 1705 passed \| 8 skipped (1722)`. The failures are in five files this packet did not touch. Rerun alone: `4 failed \| 7 passed (11)`. None reads the captured fixtures. No whole-suite count from HEAD exists, so calling them not ours is inference. Only test files changed here, and other builders had uncommitted edits to `compiled-route.cjs` and the sk-code canary router |
| `validate.sh --strict` | `RESULT: PASSED (errors=0 warnings=1)` |
| Whole advisor suite on the final tree, `npx vitest run` | `Test Files 178 passed (178)`, `Tests 1714 passed \| 8 skipped (1722)`, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **The report is not explained.** The capture's `top` depends only on files by reading, and no input changed in ten runs. The cause may lie in the vendoring project's setup. `handover-to-barter.md` lists what to record at the next occurrence.
2. **The copy's scan ran without an embedder.** It reported `embedded=0 embedFailed=14`, adapter unavailable. The default capture does not read embeddings, but the vendoring project's scan may have taken that path.
3. **The reproduction ran the generator directly.** The vendoring project ran the overlay engine's `apply`, with the regenerate step inside it, and its overlays may also write sk-code's `graph-metadata.json`. The copy could not simulate those overlays.
4. **The copy shared some code with the checkout.** `node_modules` and `@spec-kit/shared` resolved into the checkout. Neither holds routing inputs.
5. **A host file replaces the upstream file whole.** It is not merged with it, so a host recaptures it when an intended change moves a row.
6. **Two docs still name only the upstream files.** `runtime/tests/README.md` and `runtime/scripts/routing-accuracy/README.md` were outside this packet's file list.
<!-- /ANCHOR:limitations -->

---


