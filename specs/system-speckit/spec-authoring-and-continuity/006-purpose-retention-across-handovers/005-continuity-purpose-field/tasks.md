---
title: "Tasks: Phase 5: continuity-purpose-field"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "continuity purpose field tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: continuity-purpose-field

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Run every command from the worktree root. `RT` is `.skilled/skills/system-spec-kit/runtime`. `P` is `specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers`. `PR` is `$P/005-continuity-purpose-field/scratch/measure-continuity-purpose.mjs`. `TR` is `$RT/lib/continuity/thin-continuity-record.ts`. `SN` is `$RT/lib/continuity/authored-continuity-snapshot.ts`. `WF` is `$RT/cli/core/workflow.ts`. `VR` and `VC` are the two test commands in `plan.md` section 5. Step numbers refer to `plan.md` section 4.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [ ] T001 Confirm child 004 has shipped the helper (`$RT/lib/spec/packet-purpose.ts`). Verify: `rg -c 'export function (resolvePacketPurpose|formatPacketPurpose)' $RT/lib/spec/packet-purpose.ts` prints 2.
- [ ] T002 Confirm no other change added the field (`$RT`). Verify: `rg -l 'packet_purpose' $RT --glob '!**/dist/**' | wc -l` prints 0.
- [ ] T003 Record the runtime test baseline (`$RT/tests/`). Verify: `VR` prints `Test Files  2 passed (2)` and `Tests  58 passed (58)`.
- [ ] T004 Record the save writer test baseline (`$RT/cli/tests/save-continuity-write.vitest.ts`). Verify: `VC` prints `Tests  39 passed (39)`.
- [ ] T005 Record the probe baseline (`$PR`). Verify: `node $PR $RT $P | tail -2` prints `probe.ok=true errors=0 has_packet_purpose=false` and `rewrite.ok=true kept_in_markdown=false`.
- [ ] T006 Record both typecheck baselines (`$RT/tsconfig.json`, `$RT/cli/tsconfig.json`). Verify: both typecheck commands in `plan.md` section 5 print nothing and `0`.
- [ ] T007 Confirm each search text in steps 1 to 25 matches once (`plan.md`). Verify: for each step, `rg -c -F` on the first line of its current text prints 1 in its file.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [ ] T008 Apply step 1, re-export the helper (`$RT/api/index.ts`). Verify: `rg -c -F 'export { formatPacketPurpose, resolvePacketPurpose }' $RT/api/index.ts` prints 1.
- [ ] T009 Apply step 2, the field on the record type (`$TR`). Verify: `rg -c -F 'packet_purpose?: string;' $TR` prints 1.
- [ ] T010 Apply step 3, the facet input field (`$TR`). Verify: `rg -c -F 'packetPurpose?: string | null;' $TR` prints 1.
- [ ] T011 Apply step 4, the size limit (`$TR`). Verify: `rg -c -F 'const PACKET_PURPOSE_MAX_CHARS = 512;' $TR` prints 1.
- [ ] T012 Apply step 5, the Goal facet order (`$TR`). Verify: `rg -c -F 'goal: uniqueFacetItems([packetPurpose, nextSafeAction], 2),' $TR` prints 1.
- [ ] T013 Apply step 6, the normalizer (`$TR`). Verify: `rg -c -F 'function normalizePacketPurpose(value: unknown): string | undefined {' $TR` prints 1.
- [ ] T014 Apply step 7, the serialized position (`$TR`). Verify: `rg -c -F 'ordered.packet_purpose = record.packet_purpose;' $TR` prints 1.
- [ ] T015 Apply step 8, the budget drop (`$TR`). Verify: `rg -c -F 'delete compacted.packet_purpose;' $TR` prints 1.
- [ ] T016 Apply step 9, the validator read (`$TR`). Verify: `rg -c -F 'const packetPurpose = normalizePacketPurpose(input.packet_purpose);' $TR` prints 1.
- [ ] T017 Apply step 10, the normalized record (`$TR`). Verify: `rg -c -F '...(packetPurpose ? { packet_purpose: packetPurpose } : {}),' $TR` prints 1.
- [ ] T018 Apply step 11, the snapshot carry (`$SN`). Verify: `rg -c -F 'packet_purpose: currentRecord.packet_purpose' $SN` prints 1.
- [ ] T019 Apply step 12, the early record read and the facet input (`$SN`). Verify: `rg -c -F 'packetPurpose: currentRecord?.packet_purpose ?? null,' $SN` prints 1.
- [ ] T020 Apply step 13, the rewrite on the record read above (`$SN`). Verify: `rg -c -F 'const implementationSummaryPath' $SN` prints 1 and `rg -c -F 'if (currentSummary !== null) {' $SN` prints 1.
- [ ] T021 Apply step 14, the import (`$WF`). Verify: `rg -c -F 'import { formatPacketPurpose, readThinContinuityRecord, resolvePacketPurpose,' $WF` prints 1.
- [ ] T022 Apply step 15, the merge parameter (`$WF`). Verify: `rg -c -F '  packetPurpose: string | null,' $WF` prints 1.
- [ ] T023 Apply step 16, the writer-owned field (`$WF`). Verify: `rg -c -F '...(packetPurpose ? { packet_purpose: packetPurpose } : {}),' $WF` prints 1.
- [ ] T024 Apply step 17, the plan field (`$WF`). Verify: `rg -c -F '  packetPurpose: string | null;' $WF` prints 1.
- [ ] T025 Apply step 18, resolve the purpose for the leaf (`$WF`). Verify: `rg -c -F 'const purpose = resolvePacketPurpose(canonicalPath(resolution.leafPath));' $WF` prints 1.
- [ ] T026 Apply step 19, return it in the plan (`$WF`). Verify: `rg -c -F 'packetPointer, packetPurpose, dropped: update.dropped, hostPath };' $WF` prints 1.
- [ ] T027 Apply step 20, pass it to the final write (`$WF`). Verify: `rg -c -F 'plan.packetPurpose,' $WF` prints 1.
- [ ] T028 Apply step 21, the help text (`$RT/cli/continuity/generate-context.ts`). Verify: `rg -c -F 'packet_purpose is writer-owned too' $RT/cli/continuity/generate-context.ts` prints 1.
- [ ] T029 Apply step 22, the README bullet (`$RT/lib/continuity/README.md`). Verify: `rg -c 'packet_purpose. is an optional, writer-owned copy' $RT/lib/continuity/README.md` prints 1.
- [ ] T030 Apply step 23, the test import (`$RT/tests/thin-continuity-record.vitest.ts`). Verify: `rg -c -F '  buildContinuityFacets,' $RT/tests/thin-continuity-record.vitest.ts` prints 1.
- [ ] T031 Apply step 24, the two record tests (`$RT/tests/thin-continuity-record.vitest.ts`). Verify: `rg -c -F "describe('thin continuity packet_purpose'" $RT/tests/thin-continuity-record.vitest.ts` prints 1.
- [ ] T032 Apply step 25, the two save writer tests (`$RT/cli/tests/save-continuity-write.vitest.ts`). Verify: `rg -c "it\('(copies the nearest authored purpose|removes a stored purpose copy)" $RT/cli/tests/save-continuity-write.vitest.ts` prints 2.
- [ ] T033 Apply step 26, the snapshot test (`$RT/tests/authored-continuity-snapshot.vitest.ts`). Verify: `rg -c "it\('" $RT/tests/authored-continuity-snapshot.vitest.ts` prints 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [ ] T034 Build the runtime (`$RT/dist/`). Verify: `npm --prefix $RT run build; echo $?` prints `0` and `rg -c resolvePacketPurpose $RT/dist/api/index.js` prints 1.
- [ ] T035 Build the cli (`$RT/cli/dist/`). Verify: `npm --prefix $RT/cli run build; echo $?` prints `0` and `rg -c resolvePacketPurpose $RT/cli/dist/core/workflow.js` prints 2.
- [ ] T036 Run the runtime tests with the snapshot test (`$RT/tests/`). Verify: `VR` with `runtime/tests/authored-continuity-snapshot.vitest.ts` added prints `Test Files  3 passed (3)` and `Tests  61 passed (61)`.
- [ ] T037 Run the save writer tests (`$RT/cli/tests/save-continuity-write.vitest.ts`). Verify: `VC` prints `Tests  41 passed (41)`.
- [ ] T038 Typecheck both packages (`$RT/tsconfig.json`, `$RT/cli/tsconfig.json`). Verify: both commands print nothing and `0`.
- [ ] T039 Lint the changed files (`$RT`). Verify: the eslint command in `plan.md` section 5 with the snapshot test added prints nothing and `0`.
- [ ] T040 Check the API boundary (`$RT/cli/check-api-boundary.sh`). Verify: it prints `PASS: No lib/ -> api/ import violations found`.
- [ ] T041 Rerun the probe (`$PR`). Verify: `node $PR $RT $P | tail -2` prints `probe.ok=true errors=0 has_packet_purpose=true` and `rewrite.ok=true kept_in_markdown=true`.
- [ ] T042 Rerun the wider runtime set (`$RT/tests/`). Verify: the command in `plan.md` section 5 with the snapshot test added prints `Test Files  7 passed (7)` and `Tests  109 passed (109)`.
- [ ] T043 Rerun the wider cli set (`$RT/cli/tests/`). Verify: the command in `plan.md` section 5 prints `Tests  173 passed | 3 skipped (176)`.
- [ ] T044 Confirm the scope of the diff (worktree). Verify: `git status --short .skilled` lists the nine files in `spec.md` section 3 and nothing else.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] The probe prints `has_packet_purpose=true` and the save writer run prints `Tests  41 passed (41)`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Helper contract**: See `../004-compaction-purpose-line/plan.md` step 1
<!-- /ANCHOR:cross-refs -->

---
