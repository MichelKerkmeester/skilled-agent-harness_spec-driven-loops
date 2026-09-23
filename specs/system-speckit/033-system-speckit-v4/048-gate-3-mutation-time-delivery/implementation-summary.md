---
title: "Implementation Summary"
description: "The Gate-3 menu stops riding every write-intent turn and is delivered once, at the first real mutation, through each runtime's strongest channel; Pi answers through an interactive dialog."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/048-gate-3-mutation-time-delivery"
    last_updated_at: "2026-09-22T07:10:00Z"
    last_updated_by: "implementer"
    recent_action: "Recorded the shipped work, the final-state verification and the two honest boundaries"
    next_safe_action: "None; the packet closed on its local implementation commit"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs"
      - ".skilled/skills/system-spec-kit/runtime/hooks/pi/spec-gate-enforce.ts"
      - ".skilled/skills/system-spec-kit/runtime/tests/spec-gate-pi-extension.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-048-gate-3-mutation-time-delivery"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 048-gate-3-mutation-time-delivery |
| **Status** | Complete |
| **Completed** | 2026-09-22 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The gate no longer greets every write-intent turn with a questionnaire. `spec-gate-core.mjs` still opens the same session gate and still parses the same A-D answers, but the menu now reaches the operator at the first non-exempt `write`/`edit` — once per session, through whatever channel the runtime actually has: an interactive dialog on Pi, a tool-call notice on the other CLIs, a one-shot deferral where nothing better exists.

The repetition ended because the suppression fact moved onto disk. `spec-gate-core.mjs` now persists `questionDeliveredAtMs`, `questionDeliveredChannel` and `questionDeliveredCount` inside the existing per-session gate-state file, so each fresh hook process reads the same answer the last one wrote. The in-memory lifecycle-epoch receipts stay exactly where they were: telemetry. The classify adapters for Claude, Codex, Devin and Cursor (`runtime/hooks/{runtime}/spec-gate-classify.mjs`) emit nothing at all, their enforce siblings emit `GATE_3_MUTATION_NOTICE` once and acknowledge it through `result.observe()` only after the envelope is on the wire. Pi's `runtime/hooks/pi/spec-gate-enforce.ts` gates the dialog on the core's additive `gateOpenUndelivered` flag, asks with `ctx.ui.select` plus `ctx.ui.input`, persists the answer through the new `bindGate3Answer()`, and blocks that one call with a retry reason naming the bound folder. The OpenCode plugin (`.opencode/plugins/system-spec-gate.js`) pushes `GATE_3_DEFERRED_INSTRUCTION` once instead of the menu and re-arms the marker on session resume and compaction.

Creating the folder you just named also works now. `resolvePlannedPacketPath()` in `spec-gate-core.mjs` accepts a not-yet-created `.opencode/specs/<NNN-name>` answer when its parent already exists under a specs root, while rejecting `..` segments, out-of-root parents, non-packet leaves, and — after a live probe caught the first guard accepting one — a path that already exists as a file.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` | Modified | Reframed notice/deferral constants, persisted delivery marker with re-arm, `bindGate3Answer`, `shouldDeliverGate3Deferral`, `recordGate3NoticeDelivered`, `rearmGate3NoticeDelivery`, planned-packet binding |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.test.mjs` | Modified | 90 → 107 tests: delivery contract, re-arm, programmatic binding, five new-folder binding cases |
| `.skilled/skills/system-spec-kit/runtime/hooks/{claude,codex,devin,cursor}/spec-gate-classify.mjs` | Modified | Classify opens the gate and emits nothing |
| `.skilled/skills/system-spec-kit/runtime/hooks/{claude,codex,devin,cursor}/spec-gate-enforce.mjs` | Modified | Once-per-session notice on advise, marker recorded post-envelope |
| `.skilled/skills/system-spec-kit/runtime/hooks/pi/spec-gate-classify.ts` | Modified | No menu; one-shot deferral only when `ctx.hasUI` is false |
| `.skilled/skills/system-spec-kit/runtime/hooks/pi/spec-gate-enforce.ts` | Modified | Interactive bind dialog at the first undelivered write/edit |
| `.skilled/skills/system-spec-kit/runtime/tests/spec-gate-pi-extension.vitest.ts` | Created | Fake-`ExtensionAPI` suite proving the Pi contract end to end |
| `.skilled/skills/system-spec-kit/vitest.config.ts` | Modified | Symlink-base resolve alias so hook sources under `.skilled/` can be tested |
| `.skilled/skills/system-spec-kit/runtime/hooks/{claude/spec-gate-claude.test.mjs,codex/spec-gate-codex.test.mjs,devin/spec-gate-devin.test.mjs,cursor/spec-gate-prebind.test.mjs}` | Modified | Classify-silence and mutation-notice assertions |
| `.opencode/plugins/system-spec-gate.js`, `.opencode/plugins/tests/system-spec-gate.test.cjs` | Modified | One-shot deferral relay, resume re-arm, updated suite |
| `.skilled/hooks/injection-contract.md`, `.skilled/hooks/README.md`, `.skilled/skills/system-spec-kit/runtime/hooks/README.md` | Modified | Delivery contract, kill-switch effect, artifact table |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/README.md` and the five per-runtime hook READMEs | Modified | Delivery/API/environment tables and channel descriptions |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/spec-mutation-gate-enforce.md` | Modified | Expectations now match the mutation-time output |
| `specs/system-speckit/033-system-speckit-v4/spec.md`, `timeline.md`, both `graph-metadata.json` files, and this packet | Modified/Created | Phase registration, timelines, derived metadata, evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work ran in the local worktree `.worktrees/058-gate-3-mutation-time-delivery` on branch `worktrees/058-gate-3-mutation-time-delivery`, never pushed. Baseline counts came from the base commit `2cb1bdb800` exported with `git archive` so the deltas are measured, not remembered: core 90 tests → 107, adapters 59 → 59 (cursor 16 → 17), plugin 11 → 11, Pi suite 0 → 9.

The final state was verified in one pass after the last edit: core `107 tests / 104 pass / 0 fail / 3 skipped` (`107/107` with `--experimental-test-module-mocks`), the four adapter suites `59/59`, the runtime root vitest project `1292 passed / 13 skipped / 0 failed` across 109 files, and the OpenCode plugin suite `11/11`. A separate process-level boundary check piped real Claude envelopes through the adapters and captured the exact wire output: classify empty with the gate open, first advisory carrying the notice, second silent, enforce-on denying with the composed detail. Both strict validations pass from that state.

One mid-run probe changed the code: a candidate path that existed as a file was accepted by the planned-path relaxation. The guard now refuses any existing target and the corpus carries the case, which is why `spec-gate-core.test.mjs` has 107 rather than 106 tests.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| De-emit at the adapter, not in the core's `classifyIntent` | The gate state must stay open for the enforce-side delivery, and `GATE_3_QUESTION` must stay byte-identical for the shadow corpus and the skill-advisor policy block |
| Persist the delivery marker in the session gate state | Every hook invocation is a fresh process; the old in-memory epoch/receipt shadow could never suppress the repeat, which is exactly why the existing opt-in suppression was inert |
| Reuse `SYSTEM_SPEC_GATE_3_DELIVERY_SUPPRESSION` with inverted semantics | The repo dislikes option proliferation; the default has to be quiet, and only an explicit `0` restores emit-every-time |
| Ask at the mutation even when enforcement is off | Asking the operator is not enforcement; only enforce-on turns the delivery into a block, so advisory mode keeps today's non-blocking behavior |
| `bash` never opens the dialog | The gate's contract is write/edit; a shell command that happens to mutate something is still advise-only, and prompting on every shell call would recreate the noise |
| Leave the AGENTS.md Gate-3 prose untouched | Explicit operator decision: hooks only. The static contract still tells a model to ask and wait, so an instruction-literal model can still stop on a write-intent turn even with the hooks fixed |
| No interactive dialog for the non-Pi runtimes in this phase | Each of them gets the strongest channel it already has (deny reason or tool-call context); inventing five more dialogs is a separate design question |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Core corpus, `node --test` | PASS — 107 tests / 104 pass / 0 fail / 3 self-skipping; with `--experimental-test-module-mocks` 107/107 |
| Four adapter suites, `node --test` | PASS — 59/59 (claude 13, codex 14, devin 15, cursor 17) |
| Runtime root vitest project | PASS — 106 files passed / 3 skipped; 1292 tests passed / 13 skipped / 0 failed |
| Pi extension suite | PASS — 9/9 through the production handlers |
| Live Pi proof, recorded later by phase 050 | PASS. A headless parent-mode run delivered the question once through classify-deferral, and a TUI run showed the dialog, the refusal naming the bound folder and a passing retry. Evidence: ../050-ci-cleanup-pi-proof/evidence/ |
| OpenCode plugin suite | PASS — 11/11, including the deferral relay and child no-op |
| CLI boundary check (real adapter processes) | PASS — classify `stdout=[]` exit 0 with state `open`; first advisory carries the notice; second silent; enforce-on denies with `GATE_3_DENY_DETAIL` |
| Pre-change baseline (base commit `2cb1bdb800`) | PASS — core 90/87/0/3; adapters 13+14+15+16; plugin 11/11; no Pi suite existed |
| `validate.sh 048-gate-3-mutation-time-delivery --strict` | PASS — 0 errors |
| `validate.sh 033-system-speckit-v4 --recursive --strict` | PASS for the parent and 48 of 49 children — the one failure is the pre-existing `030-spec-kit-simplification-research` goal-slice error, which reproduces from the pre-change tree |
| `git status --porcelain`, scoped diff | PASS — only the enumerated files changed; temp fixtures removed; `scratch/` holds `.gitkeep` only |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The Pi dialog is proven through the extension handler contract, not a live TUI keystroke pass.** `runtime/tests/spec-gate-pi-extension.vitest.ts` drives the real handlers with a fake `ExtensionAPI`, which exercises the select/input/bind/block sequence against the documented `ctx.ui` contract; it does not prove how a human keystroke behaves in a live TUI. `runtime/tsconfig.json` also excludes `hooks/pi/**`, so these two files get no `tsc` gate — a type error there surfaces only when Pi loads the extension.
2. **One out-of-spec playbook page still shows the old classify output.** `specs`-external `.skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/codex-hook-parity.md` step 2 expects `additionalContext` on a `UserPromptSubmit` classify run. Its updated expectation is empty output plus an opened state file. It sits outside this packet's declared file list, so it was left for a follow-up rather than edited silently.
3. **The shared AGENTS.md Gate-3 prose is deliberately unchanged.** A model that follows the static contract literally can still stop on a write-intent turn; the hooks no longer inject the menu, which is the part this phase owns.
4. **Suppression is only as durable as the session state file.** If state is evicted (session deletion or the stale sweep), a re-opened gate delivers once more. That is the intended fail-open direction: losing state costs one extra ask, never a missed one.
5. **Cursor's prompt-classification event remains unconfirmed** under the installed CLI, so its classify silence is structural. Delivery therefore rides the confirmed `preToolUse` path, but only while the gate is open, and with no usable prompt event the gate opens only under `SYSTEM_SPEC_GATE_ENFORCE=1` or a session-start `SYSTEM_SPEC_FOLDER` declaration — a default advisory Cursor session is a documented no-op for Gate-3 delivery, not an asking one.
<!-- /ANCHOR:limitations -->

---
