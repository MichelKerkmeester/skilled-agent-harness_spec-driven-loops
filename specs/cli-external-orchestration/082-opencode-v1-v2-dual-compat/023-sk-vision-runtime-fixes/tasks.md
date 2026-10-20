---
title: "Tasks: Phase 23: sk-vision runtime fixes from the post-merge research"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk vision runtime fixes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 23: sk-vision runtime fixes from the post-merge research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the baseline before any edit (`scratch/baseline/`) Done: sk-vision `bun test` 67 pass 0 fail, `tsc` exit 0, the plugin suite 397 pass, battery v1 exit 0 and battery v2 exit 1 — the v2 failure is present before the first edit.
- [x] T002 Confirm the nine rows and their severities in the fix list (`../014-post-merge-deep-research/research/research.md` §9) Done: rows 4 and 5 are P1; rows 13, 15 and 20 are P2; rows 23, 24, 25 and 26 are P3.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Row 4: release every setup handle through `Promise.allSettled` and rethrow the first rejection (`vision-runtime/src/plugin.ts`, `vision-runtime/tests/plugin.test.ts`) Done: the test `releases every handle and rethrows the first error when one disposal fails` passes. Evidence: `scratch/mutation/row04-old-code.txt` — fails on the original file, passes on the fix.
- [x] T004 [P] Row 5: set `guaranteed` when `ctx.session.get` throws, so the full wait applies (`vision-runtime/src/plugin.ts`, `vision-runtime/tests/plugin.test.ts`) Done: `waits for the evidence when reading the session model fails` expects `true`, and a host with no `get` or a model off the text-only list still gets the 2 s grace. Evidence: `scratch/mutation/row05-old-code.txt`.
- [x] T005 Row 13: move the seven tests out of `src/` with `git mv`, rewrite their imports, add the layout guard and update the doc paths (`vision-runtime/tests/`, `vision-runtime/tests/layout.test.ts`, 8 feature-catalog files, 5 manual-testing-playbook files) Done: `bun test` stayed at 67 after the move (68 with the guard), and the guard fails when any `*.test.ts` sits under `src/`. Evidence: `scratch/mutation/row13-guard-old-layout.txt`.
- [x] T006 Row 15: test the shipped OpenCode hook adapter against a stub context and add the CI step (`vision-runtime/tests/host-adapter.test.ts`, `.github/workflows/opencode-dual-version.yml`) Done: the test checks the `event`, `chat.message`, `tool` (13 names, equal to `skVisionTools`) and `dispose` hooks plus `enabled: false`; the new `Run the sk-vision runtime suite` step runs `bun test tests` and `bunx tsc --noEmit` on the v1 battery leg. Evidence: `scratch/mutation/row15-wiring-mutations.txt` and `scratch/final/ci-like.txt`.
- [x] T007 Row 20: return the command-only cleanup on a host without `session.hook`, record the hand-kept type and add the bump checklist (`vision-runtime/src/plugin.ts`, `vision-runtime/tests/plugin.test.ts`, `feature-catalog/host-adapters/opencode-plugin.md`) Done: `keeps the command and skips inspection on a host without session.hook` passes, and the `### OpenCode 2 bump check` subsection is present. Evidence: `scratch/mutation/row20-old-code.txt`.
- [x] T008 [P] Row 23: hold the 15 s startup ping timer, call `unref()` and clear it in `finally` (`vision-runtime/src/runtime/client.ts`, `vision-runtime/tests/runtime/client.test.ts`) Done: `clears the startup ping timer after a fast ping` records `hasRef()` inside a `clearTimeout` wrapper. Evidence: `scratch/mutation/row23-old-code.txt` — fails on the original, fails on the fix with only `unref()` removed, passes on the fix.
- [x] T009 [P] Row 24: wrap `ctx.command.transform` in the same fail-open guard as tool registration (`vision-runtime/src/plugin.ts`, `vision-runtime/tests/plugin.test.ts`) Done: `keeps image inspection and the tools when command registration fails` passes. Evidence: `scratch/mutation/row24-old-code.txt`.
- [x] T010 [P] Row 25: share `probe()` between the interpreter and `uv`, take the timeout from `SK_VISION_PROBE_TIMEOUT_MS` (default 30 000 ms), count a timed-out probe as present and add the env row (`vision-runtime/src/runtime/client.ts`, `vision-runtime/tests/runtime/client.test.ts`, `SKILL.md`) Done: `treats a probe that outlives its timeout as present` passes with a stub that sleeps 1 s then exits 1 at a 100 ms timeout. Evidence: `scratch/mutation/row25-old-code.txt`.
- [x] T011 [P] Row 26: remove the venv with `rmdir` only when this call created it (`vision-runtime/src/runtime/client.ts`, `vision-runtime/tests/runtime/client.test.ts`) Done: `removes only a venv it made when close() lands during mkdir` passes, and its first phase proves a pre-existing venv is kept. Evidence: `scratch/mutation/row26-old-code.txt`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run the sk-vision build, suite and type check (`scratch/final/bun-test.txt`, `scratch/final/tsc.txt`) Done: `bun run build` exit 0; `bun test` 76 pass, 0 fail across 10 files (67 plus 9 new); `tsc --noEmit` exit 0.
- [x] T013 Run the suite in a clean environment (`scratch/final/ci-like.txt`) Done: with an empty HOME and no `SK_VISION` variables, `bun test tests` gives 73 pass and 0 fail across 9 files.
- [x] T014 Run the plugin suite (`scratch/final/plugins-tail.txt`) Done: 397 pass, 0 fail, unchanged from the baseline.
- [x] T015 Run the v1 battery (`scratch/final/battery-v1.txt`) Done: exit 0 with 3 PASS.
- [x] T016 Run the v2 battery (`scratch/final/battery-v2.txt`) Done: exit 1, unchanged from the baseline — family-present PASS, skill-visible PASS with 57 entries, plugin-active FAIL listing all 17 plugins as `status failed`; this is the environment baseline and CI's battery on the pushed commit is the authoritative v2 check.
- [x] T017 Review round 1 with Luna, read-only (`scratch/final/luna-review-1.txt`) Done: FAIL on rows 20, 23 and 26; row 20's tool check was reverted as redundant, row 23's test now proves `unref()`, and row 26's test proves a pre-existing venv is kept.
- [x] T018 Review round 2 with Luna, read-only (`scratch/final/luna-review-2.txt`) Done: PASS on all nine rows.
- [x] T019 Fill this folder's records and the parent phase rows (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `../spec.md`) Done: every placeholder replaced, and the parent carries the phase 23 row in the documentation map and the 014-to-023 handoff row.
- [x] T020 Run strict validation of this folder (`bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/023-sk-vision-runtime-fixes --strict`) Done: `RESULT: PASSED` with no errors.
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
<!-- /ANCHOR:cross-refs -->

---
