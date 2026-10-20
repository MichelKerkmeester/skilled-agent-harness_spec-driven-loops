---
title: "Feature Specification: Phase 23: sk-vision runtime fixes from the post-merge research"
description: "The post-merge research fix list left nine sk-vision rows open: a setup teardown that leaked every handle but one, a grace that downgraded when the session model could not be read, seven tests sitting under src/, an untested OpenCode host adapter, a setup that failed on a host without session.hook, and four runtime lifetime slips. This phase fixes each one with a failing-then-passing test and a recorded mutation, moves the misplaced tests behind a layout guard, and adds a CI step that runs the sk-vision suite on the v1 battery leg."
trigger_phrases:
  - "sk vision runtime fixes"
  - "sk vision runtime fixes from the post merge"
  - "sk vision fix list rows"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 23: sk-vision runtime fixes from the post-merge research

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-20 |
| **Branch** | `worktrees/160-sk-vision-runtime-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 23 |
| **Handoff Criteria** | Rows 4, 5, 13, 15, 20, 23, 24, 25 and 26 of the fix list are fixed with recorded mutations, and the sk-vision suite and the v1 battery pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The post-merge research fix list in `../014-post-merge-deep-research/research/research.md` §9 names nine sk-vision defects, two of them P1: setup disposal released only some of the handles it held, and a `ctx.session.get` that threw silently downgraded the automatic image check to the 2 s grace instead of waiting for the evidence. The remaining P2 and P3 rows left seven tests under `src/`, the OpenCode host adapter with no test at all, a setup that failed instead of degrading on a host without `session.hook`, and four runtime lifetime slips — an unhandled startup ping timer, an unguarded `ctx.command.transform`, a 5 s probe timeout that made a slow cold import look missing, and a `mkdir` cleanup that could remove a venv the client did not create.

### Purpose
Every one of those nine rows is fixed in this phase, each proven by a test that fails on the old code and passes on the fix, with the sk-vision suite green in CI.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The nine fix-list rows 4, 5, 13, 15, 20, 23, 24, 25 and 26, their tests and their mutation records.
- The test layout guard, the OpenCode host-adapter test and the CI step that runs the sk-vision suite.
- The doc paths the moved tests invalidated, the new probe-timeout env row and the OpenCode 2 bump checklist.
- This folder's spec, plan, tasks and implementation summary, and the parent phase map rows.

### Out of Scope
- The other 25 rows of the fix list - owned by sibling groups 021, 022, 024, 025 and 026.
- The local v2 battery environment failure - it reproduces before any edit and is treated as an environment baseline.
- The built `hooks/opencode/sk-vision.js` - git-ignored build output that is never committed.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-vision/vision-runtime/src/plugin.ts` | Modify | Rows 4, 5, 20 and 24: release every setup handle through `Promise.allSettled`, set `guaranteed` when the session read throws, return the command-only cleanup without `session.hook`, and wrap the command transform in the fail-open guard |
| `.skilled/skills/sk-vision/vision-runtime/src/runtime/client.ts` | Modify | Rows 23, 25 and 26: hold, `unref()` and clear the startup ping timer; share `probe()` with the env-driven timeout; remove only a venv this call created |
| `.skilled/skills/sk-vision/vision-runtime/tests/plugin.test.ts` | Move + Modify | Moved out of `src/`; gains the row 4, row 5, row 20 and row 24 tests |
| `.skilled/skills/sk-vision/vision-runtime/tests/runtime/client.test.ts` | Move + Modify | Moved out of `src/`; gains the row 23, row 25 and row 26 tests |
| `.skilled/skills/sk-vision/vision-runtime/tests/host-adapter.test.ts` | Create | Row 15: loads `hooks/opencode/sk-vision.ts` against a stub context and checks the `event`, `chat.message`, `tool` and `dispose` hooks plus the `enabled: false` path |
| `.skilled/skills/sk-vision/vision-runtime/tests/layout.test.ts` | Create | Row 13: fails when any `*.test.ts` sits under `src/` |
| `.skilled/skills/sk-vision/vision-runtime/tests/model-modality.test.ts` | Move | Row 13: moved from `src/` with its imports rewritten |
| `.skilled/skills/sk-vision/vision-runtime/tests/evidence/prompt-evidence.test.ts` | Move | Row 13: moved from `src/evidence/` with its imports rewritten |
| `.skilled/skills/sk-vision/vision-runtime/tests/opencode/attachments.test.ts` | Move | Row 13: moved from `src/opencode/` with its imports rewritten |
| `.skilled/skills/sk-vision/vision-runtime/tests/opencode/tools.test.ts` | Move | Row 13: moved from `src/opencode/` with its imports rewritten |
| `.skilled/skills/sk-vision/vision-runtime/tests/providers/photon.test.ts` | Move | Row 13: moved from `src/providers/` with its imports rewritten |
| `.skilled/skills/sk-vision/SKILL.md` | Modify | Row 25: the `SK_VISION_PROBE_TIMEOUT_MS` env row |
| `.github/workflows/opencode-dual-version.yml` | Modify | Row 15: the `Run the sk-vision runtime suite` step on the v1 battery leg |
| `.skilled/skills/sk-vision/feature-catalog/host-adapters/devin-hook.md` | Modify | Row 13: test paths updated after the move |
| `.skilled/skills/sk-vision/feature-catalog/host-adapters/opencode-plugin.md` | Modify | Row 13 test paths and the row 20 `### OpenCode 2 bump check` subsection |
| `.skilled/skills/sk-vision/feature-catalog/host-adapters/pi-extension.md` | Modify | Row 13: test paths updated after the move |
| `.skilled/skills/sk-vision/feature-catalog/host-adapters/vision-cli.md` | Modify | Row 13: test paths updated after the move |
| `.skilled/skills/sk-vision/feature-catalog/pixel-analysis/crop.md` | Modify | Row 13: test paths updated after the move |
| `.skilled/skills/sk-vision/feature-catalog/pixel-analysis/metadata.md` | Modify | Row 13: test paths updated after the move |
| `.skilled/skills/sk-vision/feature-catalog/runtime-core/json-rpc-runtime.md` | Modify | Row 13: test paths updated after the move |
| `.skilled/skills/sk-vision/feature-catalog/scene-understanding/inspect.md` | Modify | Row 13: test paths updated after the move |
| `.skilled/skills/sk-vision/manual-testing-playbook/guaranteed-vision/auto-inspect-guarantee.md` | Modify | Row 13: test paths updated after the move |
| `.skilled/skills/sk-vision/manual-testing-playbook/guaranteed-vision/classifier-and-env.md` | Modify | Row 13: test paths updated after the move |
| `.skilled/skills/sk-vision/manual-testing-playbook/host-adapters/opencode-plugin.md` | Modify | Row 13: test paths updated after the move |
| `.skilled/skills/sk-vision/manual-testing-playbook/host-adapters/vision-cli.md` | Modify | Row 13: test paths updated after the move |
| `.skilled/skills/sk-vision/manual-testing-playbook/manual-testing-playbook.md` | Modify | Row 13: test paths updated after the move |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/023-sk-vision-runtime-fixes/spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modify | This folder's records, filled from the scaffold |
| `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/spec.md` | Modify | The phase 23 row and the 014-to-023 handoff row in the phase map |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

None. The fix list rates no row in this group P0; its two highest-ranked rows, 4 and 5, are P1.

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Row 4 (P1, teardown leak): setup disposal releases the prompt hook, tools, command and inspection client through `Promise.allSettled` and rethrows the first rejection. | The test `releases every handle and rethrows the first error when one disposal fails` in `vision-runtime/tests/plugin.test.ts` passes; `scratch/mutation/row04-old-code.txt` shows it failing on the original `src/plugin.ts` and passing on the fix. |
| REQ-002 | Row 5 (P1, grace downgrade): a `ctx.session.get` that throws asks for the full wait by setting `guaranteed`; a host with no `get`, or a model off the text-only list, still gets the 2 s grace. | The changed test `waits for the evidence when reading the session model fails` (renamed from `asks for the grace when the host cannot report the session model`) expects `true`; `scratch/mutation/row05-old-code.txt` shows the failure on the original and the pass on the fix. |
| REQ-003 | Row 13 (P2): no `*.test.ts` sits under `src/`; seven tests move to `vision-runtime/tests/` in the same subfolders with imports rewritten, and the doc paths follow. | `bun test` stayed at 67 after the move; `vision-runtime/tests/layout.test.ts` fails when a test file is restored under `src/` (`scratch/mutation/row13-guard-old-layout.txt`); the paths are updated in 8 feature-catalog and 5 manual-testing-playbook files. |
| REQ-004 | Row 15 (P2): `vision-runtime/tests/host-adapter.test.ts` loads `hooks/opencode/sk-vision.ts` against a stub context and checks the `event`, `chat.message`, `tool` (13 names, equal to `skVisionTools`) and `dispose` hooks, plus the `enabled: false` path; CI runs the suite. | Both tests pass; three hand-broken adapters each fail the test (`scratch/mutation/row15-wiring-mutations.txt`), with the adapter source unchanged; the new `Run the sk-vision runtime suite` step runs `bun test tests` and `bunx tsc --noEmit` on the v1 battery leg. |
| REQ-005 | Row 20 (P2): setup returns the command-only cleanup when the host has no `session.hook`, instead of failing, and the hand-kept `V2PluginContext` carries its re-check note plus a bump checklist. | The test `keeps the command and skips inspection on a host without session.hook` passes and fails on the original (`scratch/mutation/row20-old-code.txt`); `### OpenCode 2 bump check` is present in `feature-catalog/host-adapters/opencode-plugin.md`. |
| REQ-006 | Row 23 (P3): `vision-runtime/src/runtime/client.ts` keeps the 15 s startup ping timer handle, calls `unref()` and clears it in `finally`. | The test `clears the startup ping timer after a fast ping` records `hasRef()` inside a `clearTimeout` wrapper; `scratch/mutation/row23-old-code.txt` shows it failing on the original, failing on the fix with only `unref()` removed, and passing on the fix. |
| REQ-007 | Row 24 (P3): `ctx.command.transform` is wrapped in the same fail-open guard as tool registration. | The test `keeps image inspection and the tools when command registration fails` passes; `scratch/mutation/row24-old-code.txt` shows it failing on the original and passing on the fix. |
| REQ-008 | Row 25 (P3): the interpreter and `uv` probes share `probe()`; the timeout comes from `SK_VISION_PROBE_TIMEOUT_MS`, default 30 000 ms; a probe killed by its timeout counts as present, while a non-zero exit, a missing binary or an abort from `close()` counts as absent. | The test `treats a probe that outlives its timeout as present` (stub sleeps 1 s then exits 1, timeout 100 ms) passes; the env row is in `SKILL.md`; `scratch/mutation/row25-old-code.txt` shows the failure on the original and the pass on the fix. |
| REQ-009 | Row 26 (P3): after `mkdir(venv, { recursive: true })`, a closed client removes `venv` with `rmdir` only when this call created it. | The test `removes only a venv it made when close() lands during mkdir` passes, and its first phase proves a pre-existing venv is kept; `scratch/mutation/row26-old-code.txt` shows the failure on the original and the pass on the fix. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All nine rows carry a test plus a mutation record in `scratch/mutation/`, and every record fails on the original code and passes on the fix.
- **SC-002**: The sk-vision suite reports 76 pass, 0 fail across 10 files (67 plus 9 new), and `tsc --noEmit` exits 0 (`scratch/final/bun-test.txt`, `scratch/final/tsc.txt`).
- **SC-003**: Nothing outside the nine rows changes: the plugin suite stays at 397 pass, the v1 battery exits 0 with 3 PASS, and the v2 battery keeps its baseline exit 1 (`scratch/final/plugins-tail.txt`, `scratch/final/battery-v1.txt`, `scratch/final/battery-v2.txt`).
- **SC-004**: A clean-env run of `bun test tests` gives 73 pass and 0 fail, and CI owns the same suite through the new step (`scratch/final/ci-like.txt`).
- **SC-005**: Product review round 2 passes all nine rows (`scratch/final/luna-review-2.txt`).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `../014-post-merge-deep-research/research/research.md` §9, rows 4, 5, 13, 15, 20, 23, 24, 25 and 26 | The nine rows and their severities would rest on memory | Every requirement cites its row number and severity from that list |
| Dependency | The pinned OpenCode v1 and v2 batteries and the plugin suite | Rows 4, 5 and 20 change host-facing behaviour, so a regression would surface only there | The baseline and final runs exist in `scratch/baseline/` and `scratch/final/`; the plugin suite and both batteries were rerun |
| Risk | The local v2 battery fails in this worktree before any edit, listing all 17 plugins as `status failed` | A reader could take an environment failure for a regression | Treated as an environment baseline with the criterion "no change"; CI's OpenCode Dual-Version Battery on the pushed commit is the authoritative v2 check |
| Risk | `V2PluginContext` is hand-typed because the published v2 context declares no `session` or `tool` domain | A later OpenCode 2 bump could change a member setup calls | The type carries a re-check comment and the bump checklist is in `feature-catalog/host-adapters/opencode-plugin.md` |
| Risk | The host-adapter test drives a stub context and a stub python that answers pings | The test could pass while a real host wiring breaks | The test reads the shipped adapter source and CI runs it on the v1 leg; three hand-broken adapters prove it fails when wiring moves |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The dispatch fixed the scope, and the fix list plus the recorded runs answered what each row must change and how it is proven.
<!-- /ANCHOR:questions -->

---
