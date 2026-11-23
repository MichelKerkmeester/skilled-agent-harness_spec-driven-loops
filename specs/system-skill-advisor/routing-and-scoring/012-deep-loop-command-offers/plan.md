---
title: "Implementation Plan: Offer the right deep-loop command and flags from explicit loop wording"
description: "Narrow the advisor's deep-loop command gate to explicit loop asks and score loop wording at stage one. Teach the offer, the flags, the setup and the way forward in the deep command assets. Prove it by rerunning the baseline probe set, the advisor tests and the command reference gates."
trigger_phrases:
  - "deep loop command offers plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Offer the right deep-loop command and flags from explicit loop wording

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (advisor runtime), Markdown and YAML (command assets and skill docs) |
| **Framework** | The skill advisor's scorer and command-attach step; the deep command presentation contracts |
| **Storage** | None. `command-prompts.jsonl` and `command-routing-baseline.json` are committed fixtures |
| **Testing** | vitest in the advisor runtime; the packet probe kit `scratch/probes/probe.mjs` |

### Overview
The advisor's deep-loop gate in `command-attach.ts` opens on an explicit loop ask in place of depth wording. One mode cue can then resolve a route the hub deferred, and `explicit.ts` scores loop wording beside a research or review cue. The deep command assets gain an offer section, question-tool setup and named ways forward, and the hub and mode packets drop their drift. The proof is the baseline probe set rerun with the same file, the advisor vitest suite, a corpus recapture and the two command reference gates.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `scratch/probes/results-spec-baseline.json` exists, and `spec.md` quotes its run in the Measured Behavior block.
- [ ] `git status --short .skilled/skills/system-skill-advisor` printed nothing when the baseline ran.
- [ ] `scratch/decisions.md` is read by every lane before its first edit.

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded`.
- [ ] `npx vitest run` in `.skilled/skills/system-skill-advisor/runtime` reports zero failed tests, and the probe rerun prints `live` for all 69 rows.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A three-stage gate. The scorer picks the skill, the hub router picks the mode, and the attach step decides whether the command rides along.

### Key Components
- **`command-attach.ts`, the attach step (stage three)**: owns the gate. It fails today because the gate reads depth wording, so V6, H1a and H1b reach one mode and still print `cmd=-`. It also defers E1 and E3, which name one mode.
- **`scorer/lanes/explicit.ts`, the explicit lane (stage one)**: needs a loop-beside-cue rule. Without it R2, V2, V4, H7 and H10 never reach the hub.
- **Deep presentation files and command documents**: the text the AI reads after an `ask` row. Without the offer section no document says what the question holds or which flags fit.

### Data Flow
A prompt enters `advisor_recommend`. The scorer ranks skills, and the explicit lane is where loop wording now counts. When `system-deep-loop` tops, `compiled-route.cjs` resolves a mode or defers. `attachCommand` then adds `/deep:research` or `/deep:review` with policy `ask` only when the prompt makes an explicit loop ask. The brief reaches the AI, which reads the command document, asks the one offer question and runs `:auto` with the composed flags on a yes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `command-attach.ts` `DEPTH_WORDING` and the gate at the `skillId === 'system-deep-loop'` branch | Producer of the deep command row | update | `npx vitest run tests/command-attach.vitest.ts` |
| `scorer/lanes/explicit.ts` phrase table and loop rules | Producer of stage-one hub evidence | update | probe rerun on the stage-one and negative groups |
| `handlers/advisor-recommend.ts` | Consumer that carries the attached command into the recommendation | unchanged | probe rerun shows `cmd=` on the gain group |
| `scripts/routing-accuracy/capture-command-routing-baseline.mjs` | Consumer that calls `attachCommand` per corpus row | unchanged | recapture prints `false_offer` and `false_offer_attached` |
| `runtime/lib/render.ts` brief head | Consumer that prints `→ /deep:research (ask)` | unchanged | `command-brief-golden.vitest.ts` in the full suite |
| Deep presentation files, command documents and YAML | The contract the AI follows after the row | update | `validate-command-references.cjs`, `rg` on the new sections |
| Hub `hub-router.json`, `ROUTER.md`, `graph-metadata.json` | Stage-two vocabulary and its advisor projection | update | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-deep-loop` |

Required inventories:
- Same-class producers: `rg -n 'DEPTH_REQUEST|DEPTH_WORDING' .skilled/skills/system-skill-advisor/runtime/lib`.
- Consumers of changed symbols: `rg -n 'attachCommand|DEPTH_WORDING' .skilled/skills/system-skill-advisor/runtime --glob '*.ts' --glob '*.mjs'`.
- Matrix axes: the loop-ask clause (named, count or iterations word, passes, typed, continue), the route action (`route` or `defer`), and the mode cue (research, review, both, none). The probe groups in `scratch/probes/probes-spec-baseline.json` are the rows.
- Algorithm invariant: a `/deep:*` row is attached only when the prompt types the command or makes an explicit loop ask. The adversarial cases are depth-only (R7), refusal (N6), question about the loop (N10) and past-run summary (N9).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads `scratch/decisions.md` and captures the 69-probe baseline in `scratch/probes/results-spec-baseline.json`. Implementation runs five lanes in one worktree: A changes the advisor code, tests, `dist` and baseline; B the deep command docs; C the deep-loop skill docs and hub routing; H the fresh holdout rows; and V runs the gates. Verification reruns the same probe file, the advisor vitest suite, the corpus recapture, `sync-runtime-mirrors.cjs --check`, `validate-command-references.cjs` and `validate.sh --strict`.

A fresh-review round reopens the packet. Setup reproduces the reported prompts through the prompt hook. Implementation fixes the refusal, question, spelling, symptom and subject readings in `command-attach.ts` and their Python copies, narrows D2 as ADR-004 records, and adds every prompt to the shared fixture. Verification reruns both suites, the predicate comparison, the 69 probes and the corpus, then corrects the changelog and AC-008.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `attachCommand` on each loop-ask clause, each depth word and the mode-cue path | vitest, `tests/command-attach.vitest.ts` |
| Integration | The 69-probe set through the CLI; the routing corpus through `capture-command-routing-baseline.mjs` | `scratch/probes/probe.mjs`, the capture script |
| Manual | One recorded session each on F3, F5 and F6, checking that the first visible response is one question whose recommended option carries the expected flag | `runtime/scripts/routing-accuracy/run-command-behaviour.mjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Advisor runtime build (`npm run build` in `.skilled/skills/system-skill-advisor/runtime`) | Internal | Green | The CLI refuses a stale `dist`, so no probe or corpus check runs |
| The compiled-contract generator for `.skilled/commands/deep/assets/compiled/` | Internal | Yellow, not yet run in this packet | The compiled contracts drift from their sources |
| A recorded behaviour run for the offer text | Internal | Yellow, manual | The offer section's effect on a model stays inferred |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any REQ-004 negative changes its top skill or `cmd=` value on the rerun, or the recaptured `false_offer` count over the earlier rows rises.
- **Procedure**: revert the packet's commit, run `npm run build` in the advisor runtime, and rerun the probe file to confirm the baseline block returns.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation (A, B, C, H) ──► Verification (V)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Nothing | Implementation, because every lane reads the decisions and the baseline |
| Implementation | Setup. Lane H also waits on lane A's tuning | Verification |
| Verification | Implementation | Packet close |
<!-- /ANCHOR:phase-deps -->

---

