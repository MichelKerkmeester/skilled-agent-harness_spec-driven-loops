---
title: "Implementation Summary"
description: "Hermes was the seventh runtime phase 048 missed, and the de-emission had quietly left it with a gate that opened and never spoke; the plugin now delivers the notice at the first write, the surfaces that still described turn-time injection are corrected, and the two Pi spec-gate extensions finally have a type check."
trigger_phrases:
  - "implementation summary"
  - "hermes gate delivery"
  - "stale surface corrections"
  - "pi typecheck gate"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/049-gate-3-delivery-residue"
    last_updated_at: "2026-09-22T10:45:00Z"
    last_updated_by: "implementer"
    recent_action: "Closed the Hermes delivery fix, the stale surfaces and the Pi type gate"
    next_safe_action: "None; the packet closes on its local implementation commit"
    blockers: []
    key_files:
      - ".hermes/plugins/repo-guards/__init__.py"
      - ".hermes/plugins/repo-guards/tests/test_repo_guards.py"
      - "tsconfig.pi.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-049-gate-3-delivery-residue"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Cursor's advisory no-op is intended: the prebind adapter's header and its pinning test decide it."
      - "The concurrent-first-mutation window on the delivery marker stays documented rather than locked."
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
| **Spec Folder** | 049-gate-3-delivery-residue |
| **Status** | Complete |
| **Completed** | 2026-09-22 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 048 moved the Gate-3 question to the first mutation and, in doing so, left one runtime holding a gate that opened and never spoke. Hermes reached the shared classifier through the repo-guards plugin, but the classifier had been made silent, so a Hermes session had its gate state written and then received no question and no notice — a hole that no test caught because the plugin's own mocks supplied the text the real adapter had stopped emitting. This phase gives Hermes the same mutation-time delivery its six siblings have, corrects every surface that still described the retired turn-time injection, and closes the two gaps the work exposed: no type check covered the Pi spec-gate extensions, and no external reviewer had read the change.

### Phase 1: gate-3-delivery-residue

The plugin now speaks through the channel Hermes actually has. `pre_llm_call` classifies the prompt on every non-leaf turn to open the session gate but reads nothing back from the classify adapter; `pre_tool_call` evaluates the shared gate for write-capable tools and returns the host's block verdict when `SYSTEM_SPEC_GATE_ENFORCE=1`; and the result hook merges the once-per-session Gate-3 notice into the first write's tool result, with the shared enforce adapter recording the delivery marker itself so the next write stays silent. Writes only: `terminal` is never blocked and never carries the notice, and an orchestrated leaf is skipped exactly as before.

Around that fix, the surfaces were re-read against the code rather than trusted. The cli-devin sweep enumerated every remaining claim of turn-time injection — feature catalogs, both manual-testing-playbook trees, runtime READMEs, `ENV-REFERENCE.md`, `.env.example`, the OpenCode plugin's factory docstring and the renamed HERMES-028 page — and each finding was re-read at its line before it was edited or rebutted. Two of those corrections were substantive rather than cosmetic: the suppression variable is default-ON through the persisted delivery marker, not the default-off shadow telemetry `.env.example` and `ENV-REFERENCE.md` described, and Cursor does not reach mutation-time delivery in a default advisory session at all, which both the feature catalog and phase 048's own summary had claimed.

The type gap is closed by `tsconfig.pi.json` at the repo root, covering the two spec-gate extensions with hand-written ambient shims under `.pi/types/`. A negative control — a throwaway file calling `ctx.ui.selct(...)` — exited non-zero with `TS2551`, so the gate bites rather than merely passing.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.hermes/plugins/repo-guards/__init__.py` | Modified | `_open_spec_gate`, `_spec_gate_notice`, `_spec_gate_denial`, the enforced write block in `pre_tool_call`, the notice merged into `_result_advisory`; the prompt-time question read retired |
| `.hermes/plugins/repo-guards/tests/test_repo_guards.py` | Modified | The two gate tests rewritten to the mutation-time contract; shebang added for the header guard |
| `.hermes/plugins/repo-guards/plugin.yaml` | Modified | Manifest description no longer claims a prompt-time question |
| `.hermes/SYNC.md`, `.skilled/skills/cli-external-orchestration/cli-hermes/references/hook-contract.md` | Modified | Hook-map rows for classify, the enforced write block and the once-per-session notice |
| `.skilled/.../cli-hermes/manual-testing-playbook/goal-hook/advisor-brief-and-gate-delivery.md` | Renamed + rewritten | HERMES-028 now contracts mutation-time delivery and records three live sessions |
| `.skilled/.../cli-hermes/manual-testing-playbook/manual-testing-playbook.md` | Modified | Both index rows repointed at the renamed page |
| `.skilled/.../manual-testing-playbook/plugins-and-hooks/codex-hook-parity.md` | Modified | Classify is silent; the read-only live run no longer greps for a notice it cannot exercise |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/spec-mutation-gate-enforce.md` | Modified | Step 4 expects empty classify stdout; core corpus count corrected to 107 |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, `.env.example` | Modified | Suppression documented as default-ON via the persisted marker |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` | Modified | Suppression docstring reworded; the concurrent-first-mutation window documented |
| `.opencode/plugins/system-spec-gate.js` | Modified | Factory docstring matches the plugin's real advisory behavior |
| `.skilled/skills/.state/spec-gate/README.md` | Modified | Gate state fields, incl. the delivery marker and its re-arm |
| `.skilled/.../cli-cursor/manual-testing-playbook/hooks/confirmed-non-delivery-documentation.md`, `.skilled/.../feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md` | Modified | Cursor's delivery rides an open gate; a default advisory session is a documented no-op |
| `.pi/extensions/README.md`, `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` | Modified | Pi extension rows and the classifying-extension comment |
| `tsconfig.pi.json`, `.pi/types/pi-coding-agent.d.ts`, `.pi/types/node-globals.d.ts` | Created | The Pi spec-gate extensions' type gate and its ambient shims |
| `specs/.../048-gate-3-mutation-time-delivery/implementation-summary.md` | Modified | The Cursor claim in phase 048's Known Limitations corrected to the real boundary |
| `specs/.../049-gate-3-delivery-residue/scratch/**` | Created | Baselines, the cli-devin sweep prompt and report, the cli-codex review prompt and report |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The runtime fix was driven by live dispatches, not only by the suite. A real `hermes chat -Q --oneshot` run with a write-intent prompt printed `ADVISOR` then `NO_GATE` (session `20260922_095053_5713d3`), proving the advisor brief still rides the turn while the menu no longer does; a two-write run printed `GATE` then `NO_GATE` (session `20260922_095443_31c676`), proving the notice rides the first write only; and an enforced run with `SYSTEM_SPEC_GATE_ENFORCE=1` printed `BLOCKED DENIED: this Write/Edit needs a bound spec folder first.` without creating the file (session `20260922_103547_92e186`). The first two-write attempt produced no notice at all, and isolating it showed the probe prompt, not the plugin, was at fault: the shared classifier gates on prompt vocabulary, so a bare imperative can classify as non-triggering.

Verification ran from the frozen worktree on the final tree: the shared core corpus at 107/107 under `--experimental-test-module-mocks`, the four adapter suites at 13/14/15/17, the OpenCode plugin suite at 11, the Pi extension suite at 9, the Hermes unittest module at 43, and `tsc --noEmit -p tsconfig.pi.json` at exit 0. The sk-code-opencode drift guards were re-run and produced the same pre-existing 9 errors with no finding naming a file this phase touched; the one warning they did raise on a touched file (a missing Python shebang) was cleared.

External verification was two-directional and both halves were reconciled rather than filed. The cli-devin sweep reported surfaces beyond the packet's original list, and every one was re-read before being edited or rebutted — including one row it got wrong and the reviewer withdrew after re-reading. The cli-codex Luna review returned no HIGH findings, four MEDIUM and one LOW; the MEDIUMs became the stale test-count fix, the corrected read-only live-run expectation, the OpenCode docstring rewrite and a documented delivery-marker window, and the LOW became the pre-change label on a captured transcript. The review's Cursor lead was checked against the adapter's own pinning test and resolved as intended behavior, so the documents changed instead of the adapter.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Run the shared enforce adapter from the result hook in advisory mode, and from `pre_tool_call` only under enforcement | `pre_tool_call` cannot return a non-blocking notice, and the adapter records its delivery marker as soon as it advises — so a second run at result time would find the marker already set and lose the notice entirely |
| Read enforcement exactly as the core does (`=== '1'`) instead of reusing the plugin's broader truthy helper | A bridge that accepted `true`/`yes` would disagree with the core's own reading of the same variable and block on calls the core would allow |
| Widen gate classification from first-turn-only to every non-leaf turn | A read-only first turn could otherwise leave a later writing turn unguarded, and the other runtimes already classify per turn |
| Correct the documentation rather than the Cursor adapter | Cursor's prompt event is unconfirmed under the installed CLI, so an advisory gate would put an unanswerable question in front of the model; the prebind adapter and its pinning test already decide the behavior |
| Extend the frozen file list to the sweep's findings and record why | REQ-003 authorizes correcting every confirmed surface; leaving a known stale page unedited would have retired the phase with a false claim standing |
| Document the concurrent-first-mutation window instead of locking it | Two same-session mutations racing the marker check can both deliver, and a double notice is harmless where a cross-process lock every runtime must honor is not |
| Keep the ambient type shims minimal and hand-written | The repo root has no `node_modules` or root TypeScript install, and the real Pi types exist only in the machine-global install, so a shim is the only way the check can run offline |
| Leave `AGENTS.md` prose untouched | Operator decision carried from phase 048: the static contract states the rule, the hooks only stop obeying it at write time |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Hermes repo-guards unittest module | PASS — `Ran 43 tests … OK`, up from the 42-test pre-change baseline |
| Live turn contract (session `20260922_095053_5713d3`) | PASS — `ADVISOR` then `NO_GATE`, gate state opened, no menu |
| Live mutation delivery (session `20260922_095443_31c676`) | PASS — `GATE` then `NO_GATE` across two writes in one session |
| Live enforced denial (session `20260922_103547_92e186`) | PASS — `BLOCKED DENIED: this Write/Edit needs a bound spec folder first.`; no file created |
| Shared core corpus (`spec-gate-core.test.mjs`, module mocks) | PASS — 107 tests, 107 pass, 0 fail, 0 skipped |
| Adapter suites (`claude`, `codex`, `devin`, `cursor`) | PASS — 13 / 14 / 15 / 17, 59 pass, 0 fail |
| OpenCode plugin suite | PASS — 11 pass |
| Pi extension vitest suite | PASS — 9 passed |
| Pi type gate (`tsc --noEmit -p tsconfig.pi.json`) | PASS — exit 0; negative control (`ctx.ui.selct`) exit 2 with `TS2551` |
| sk-code-opencode drift guards | PASS against its obligation — same pre-existing 9 errors, no finding naming a touched file, the one touched-file warning cleared |
| `validate.sh --strict` on this packet | PASS — Errors: 0, Warnings: 0, `RESULT: PASSED` |
| `validate.sh … --recursive --strict` on the parent | PASS on the parent and 48 of 49 children — the one failure is the pre-existing `030-spec-kit-simplification-research` goal-slice error, which reproduces from the pre-change tree |
| `check-completion.sh` | PASS — 31/31 items: 18/18 P0, 12/12 P1, 1/1 P2 with evidence on every completed item |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Cursor's advisory sessions still deliver nothing.** A Cursor session participates in Gate 3 only by declaring `SYSTEM_SPEC_FOLDER` at `sessionStart` or by opting into `SYSTEM_SPEC_GATE_ENFORCE=1`. This is deliberate, not a defect: the prompt-side event is unconfirmed, so an advisory gate would present a question the model cannot answer. The behavior is now documented at every surface instead of misdescribed.

2. **Two same-session mutations can both receive the notice.** The marker check and the marker write are separate steps across processes, so a concurrent first mutation can race. Documentation rather than locking was the accepted resolution — a per-session lock would have to be honored by every runtime for a harmless double notice.

3. **The Pi type gate covers two extensions, not the whole directory.** `tsconfig.pi.json` includes exactly the spec-gate pair; the other `.pi/extensions/*.ts` files were left outside because they vendor their own types under a different hook contract. Widening it is a separate change with its own shims.

4. **Enforcement is read as the literal `1`.** Hermes matches the core's own `=== '1'` reading rather than the plugin's broader truthy helper, so `SYSTEM_SPEC_GATE_ENFORCE=true` blocks nowhere — consistent with the core, and a trap worth knowing when setting the variable by hand.

5. **The shared `AGENTS.md` prose still describes the static contract.** The operator decision carried over from phase 048 holds: the hook layer changed, the wording did not, so a model that follows the static text literally can still stop on a write-intent turn.

6. **Hermes' live proofs ran against a machine-local install.** The plugin loads in the worktree only under `HERMES_ENABLE_PROJECT_PLUGINS=1` and the runs used the `llmgateway` provider with `glm-5.3-flash`; the three sessions are reproducible here but the transcripts depend on that runtime being present.

7. **The parent tree's recursive validation stays red on one pre-existing folder.** `030-spec-kit-simplification-research`'s `goal.md` carries a 6498-character durable slice against a 4000-character ceiling, and the check fails identically from the pre-change tree. It is reported rather than repaired: the file is another phase's goal state, and trimming it is outside this phase's scope. Every other folder in the parent passes strict.
<!-- /ANCHOR:limitations -->
