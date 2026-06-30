---
title: "Implementation Plan: INTERACTION STATE MATRIX proof lane"
description: "Plan to add an additive, conditional INTERACTION STATE MATRIX lane (states/events/transitions/forbidden/guards/uiByState/recovery/a11y/reducedMotion) to the sk-design context loading contract, mirror it as a fillable row on the proof-of-application card and as a binary section on the interface pre-flight card, and document the state/async trigger cues that activate the lane."
trigger_phrases:
  - "interaction state matrix plan"
  - "stateful ui proof lane design build"
  - "d6-r4 interaction state matrix"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/004-interaction-state-matrix"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark the plan Definition of Done complete after the verified mirrored-matrix build"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/context_loading_contract.md"
      - ".opencode/skills/sk-design/shared/assets/proof_of_application_card.md"
      - ".opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: INTERACTION STATE MATRIX proof lane

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown only (shared contract + two fill-in gate cards) |
| **Targets** | 3 sk-design files, scope-locked: 1 contract + 1 proof card + 1 pre-flight card |
| **Mirrored pattern** | The existing conditional proof blocks already in the same contract (`INTERFACE PREFLIGHT`, `AUDIT EVIDENCE`) and the binary sections already in the same pre-flight card |
| **Verification** | Structural presence (lane exists + mirrored consistently) + binary-box completeness + existing-gate no-regression + evergreen + scope-lock; no script or `mode-registry.json` change in this phase |

### Overview
Stateful UI work — loading, error, multi-step, optimistic-update flows — is the place craft most often leaks: an interface looks finished at the happy path and falls apart at the error, empty, or pending state. Today sk-design covers interaction states only as prose inside interface/harden/polish craft; there is no checkable lane that forces a stateful surface to enumerate its states, prove every event has a defined transition, and prove every error has a way out. designer-skills-main's state-machine skill supplies the missing *shape* (states / events / transitions / forbidden / guards), and this build ports that shape into the gate surface so interaction-state coverage becomes a fillable, binary-checkable conditional lane rather than implicit craft.

The build adds one conditional lane, the **INTERACTION STATE MATRIX**, in three mirrored homes:

1. **Contract (single source of truth)** — `context_loading_contract.md` gains the matrix field shape under REQUIRED PROOF FIELDS, a documented trigger condition (the state/async cues that activate the lane), and a conditional row in the HARD GATES table.
2. **Proof-of-application card (end-of-work)** — `proof_of_application_card.md` gains a fillable INTERACTION STATE MATRIX section mirroring the contract field, marked conditional (fill only for stateful surfaces).
3. **Interface pre-flight card (pre-delivery, the checkable form)** — `interface_preflight_card.md` gains a binary INTERACTION STATE MATRIX section whose boxes feed the existing SHIP/FIX verdict; non-stateful surfaces mark the section N/A.

The lane is **additive** and **conditional**: it changes no existing field, box, or verdict for the surfaces that already pass; it only adds a new lane that activates when the work is stateful.

**Honest enforcement scope (recorded up front):** this phase ships **no new script and no `mode-registry.json` change** — its scope is frozen to the three named markdown files. The enforceable floor is therefore structural and gate-walked, not auto-parsed:
- **Enforceable (via the existing Interface Pre-Flight HARD gate):** once present, the new binary matrix boxes on the pre-flight card are walked under the same mechanical rule as every other box — a single failed applicable box blocks a ship/ready/done claim. Presence-and-consistency of the lane across all three cards is structurally checkable.
- **Conditional / advisory triggering:** whether a given surface *is* stateful enough to require the lane is an NL judgment; the contract documents the trigger cues, but live triggering outside a fixture corpus is not deterministic.
- **Advisory (taste/correctness):** whether the modeled states, transitions, and guards are actually complete and correct cannot be proven by a checkbox — only structural presence is enforced, never the quality of the model.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] All three targets read in full before any edit, including the existing conditional proof blocks and binary sections to mirror — `context_loading_contract.md` §4/§5, `proof_of_application_card.md` §3/§6/§7, and `interface_preflight_card.md` §1-§11 read end to end
- [x] The additive pattern to follow is identified: the matrix field mirrors the existing `INTERFACE PREFLIGHT` / `AUDIT EVIDENCE` proof blocks in the contract, the existing proof-field rows in the application card, and the existing binary box sections in the pre-flight card — no new structural form is invented
- [x] The matrix field shape is fixed from the source vocabulary: states / events / transitions / forbidden / guards / uiByState / recovery / a11y / reducedMotion
- [x] Scope frozen to the 3 named markdown files; `mode-registry.json`, `proof_check.py`, `context_loaded_card.md`, and the audit/foundations cards are explicitly NOT in scope

### Definition of Done
- [x] `INTERACTION STATE MATRIX` field block added to `context_loading_contract.md` under REQUIRED PROOF FIELDS with the fixed nine-part shape, plus a documented trigger condition and a conditional HARD GATES row — `### Interaction State Matrix` under §4 (line 117) + the §5 gate row (line 177)
- [x] The matrix mirrored as a conditional fillable section on `proof_of_application_card.md` (same field set, marked stateful-only) — `## 8. INTERACTION STATE MATRIX` (line 88)
- [x] The matrix mirrored as a binary section on `interface_preflight_card.md` whose boxes feed the SHIP/FIX verdict, with N/A for non-stateful surfaces and VERDICT renumbered without dropping any existing box — `## 11. INTERACTION STATE MATRIX` (line 163), VERDICT renumbered to `## 12` (line 186)
- [x] State/async trigger cues documented in the contract so a stateful-UI prompt activates the lane (advisory triggering; registry aliases flagged as a deferred follow-up) — trigger cues live in the contract field shape; `mode-registry.json` aliases recorded as deferred, not built
- [x] No-regression: every existing contract proof block, every existing pre-flight box, every existing proof-card field, and the existing gates (Interface Pre-Flight, proof card `proof_check.py`) behave unchanged for non-stateful surfaces — pre-flight §1-§10 verbatim; contract additive (0 removed); `proof_check.py` untouched
- [x] Evergreen [HARD]: no spec/packet/phase IDs or spec paths embedded in any of the three shipped files — orchestrator evergreen scan clean

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### The matrix field shape (contract SSOT)
Add one new conditional block under `context_loading_contract.md` §4 REQUIRED PROOF FIELDS, in the same `text` fenced form as the existing `INTERFACE PREFLIGHT` and `AUDIT EVIDENCE` blocks. Fixed nine-part shape, fixed order:

```text
INTERACTION STATE MATRIX:
surface/component:
trigger: stateful | async | loading/error | multi-step | optimistic-update   (why the lane applies)
states:
- <state>: <one-line meaning>            (idle, loading, success, error, empty, disabled, ...)
events:
- <event> -> <from state> -> <to state>
transitions: every event maps to a defined target state | gaps: __
forbidden:
- <impossible state pair> (e.g. loading + error at once) -> prevented by: __
guards:
- <transition>: <condition that must hold> (e.g. submit: isValid && !pending)
uiByState:
- <state>: <visible UI representation>   (no invisible state; covers hover/focus/active/disabled)
recovery:
- <error/terminal state>: <documented way out>   (no dead ends)
a11y:
- per-state: focus target on transition, async state announced (aria-live), disabled semantics
reducedMotion:
- state-transition motion has a reduced-motion alternative (crossfade or instant) | N/A
verdict: COMPLETE | GAPS (list)
```

| Field | Meaning | Why it is in the lane |
|---|---|---|
| `states` | Every distinct mode the surface can occupy | The eliminate-implicit-state lever; no state may be left unnamed |
| `events` | The triggers that move between states (click, submit, timeout, response, blur) | Makes the cause of each transition explicit |
| `transitions` | Each event mapped to a defined target state | Proves no undefined / dead transition |
| `forbidden` | Impossible state combinations and how they are prevented | Ports the "eliminate impossible states" benefit (no loading+error at once) |
| `guards` | Conditions a conditional transition requires | Makes validity/permission/not-pending explicit, not implicit |
| `uiByState` | The visible representation of each state, including hover/focus/active/disabled | No invisible state; the interaction-state visuals are owned here |
| `recovery` | The documented way out of every error/terminal state | Ports "every state has a way out", no dead ends |
| `a11y` | Per-state focus management, async announcement, disabled semantics | State changes must be perceivable, not only visual |
| `reducedMotion` | A reduced-motion alternative for every state-transition animation | Ties the lane to the existing motion/reduced-motion box |

### Three mirrored homes
- **Contract** — the field shape above + a trigger sentence ("this lane applies when the surface is stateful: loading/error/empty/disabled, async fetch, form submit, multi-step wizard, optimistic update") + one new conditional row in the §5 HARD GATES table ("Interaction State Matrix | A stateful-UI ship/ready claim before its states, transitions, guards, recovery, and reduced-motion handling are modeled"). The contract is the only place the field is *defined*; the two cards reference it.
- **Proof-of-application card** — a new numbered section after APPLICATION WITNESS (`## 8. INTERACTION STATE MATRIX`), a fillable status table over the same nine dimensions, with `[ ] pass [ ] fail [ ] N/A` per row and an explicit "fill only when the surface is stateful" note. Honest: this section is **carried by the proof-card discipline, not auto-gated** — `proof_check.py` is out of scope, so it is not parsed by the existing four-field gate. The mechanical enforcement for stateful surfaces lives on the pre-flight card.
- **Interface pre-flight card** — a new binary section (`## 11. INTERACTION STATE MATRIX (stateful surfaces only; else N/A)`) with one `[ ]` box per dimension, inserted *before* the verdict so its boxes feed it; the existing `## 11. VERDICT` is renumbered to `## 12. VERDICT` with no box added or removed. This is the **checkable form**, gated by the existing Interface Pre-Flight HARD gate: for a stateful surface, a single failed matrix box = FIX.

### Binary box derivation (pre-flight card)
Each contract field becomes one binary box:

```text
| Every distinct state is enumerated (idle/loading/success/error/empty/disabled as applicable), none implicit | [ ] |
| Every event maps to a defined target state, no undefined transition | [ ] |
| Impossible states are named and structurally prevented (no simultaneous loading + error) | [ ] |
| Conditional transitions carry an explicit guard (validity, permission, not-pending) | [ ] |
| Every state has a visible UI representation, including hover/focus/active/disabled, no invisible state | [ ] |
| Every error or terminal state has a documented recovery path, no dead end | [ ] |
| Per-state accessibility: focus target on transition, async state announced (aria-live), disabled semantics | [ ] |
| State-transition motion has a reduced-motion alternative (crossfade or instant) | [ ] |
```

### Additive / no-regression contract
- The contract block, the proof-card section, and the pre-flight section are all **new additions**; no existing field, box, gate row, or verdict semantics is changed.
- The pre-flight VERDICT renumber (11 → 12) is a header-number edit only; every existing box in §1-§10 keeps its text and position.
- For a non-stateful surface, the lane is marked N/A and the cards behave exactly as today (consistent with the existing N/A boxes such as grid/bento and real imagery).
- `proof_check.py` is untouched, so its four-field gate over the proof card is byte-for-byte unchanged; the new proof-card section is conditional reader content it does not parse.
- `mode-registry.json` is untouched; the trigger cues live in the contract as documented vocabulary, not as new registry aliases.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Contract (source of truth)
- [x] Add the `INTERACTION STATE MATRIX` field block (fixed nine-part shape) under REQUIRED PROOF FIELDS in `context_loading_contract.md`, in the same fenced form as the existing conditional proof blocks — `### Interaction State Matrix` under §4 (line 117)
- [x] Add the trigger condition sentence naming the state/async cues that activate the lane (the advisory triggering vocabulary) — trigger line carried in the field shape
- [x] Add one conditional row to the §5 HARD GATES table for the matrix; keep all existing gate rows unchanged — gate row at line 177; existing rows unchanged

### Phase 2: Mirror into the two cards
- [x] Add `## 8. INTERACTION STATE MATRIX` to `proof_of_application_card.md` after APPLICATION WITNESS: a conditional fillable status table over the nine dimensions, marked stateful-only, with the honest "carried by discipline, not auto-gated" note — `## 8` at line 88
- [x] Add `## 11. INTERACTION STATE MATRIX (stateful surfaces only; else N/A)` to `interface_preflight_card.md` as a binary box section feeding the verdict, and renumber the existing VERDICT section to `## 12` without dropping any box — `## 11` at line 163, `## 12. VERDICT` at line 186
- [x] Confirm the field set is identical across all three homes (contract shape == proof-card rows == pre-flight boxes) — same nine dimensions across contract, proof card, and pre-flight card

### Phase 3: Verification
- [x] Structural presence: the lane exists in all three files with a consistent nine-part field set — grep confirms the matrix in the contract, proof card, and pre-flight card
- [x] Binary completeness: every pre-flight matrix box is binary and feeds the SHIP/FIX verdict; N/A is available for non-stateful surfaces — `## 11` binary boxes feed the `## 12` verdict; N/A available
- [x] No-regression: existing contract proof blocks, existing pre-flight boxes §1-§10, existing proof-card fields, and the `proof_check.py` four-field gate are unchanged; a non-stateful surface walks the cards exactly as before — pre-flight §1-§10 verbatim; contract additive; `proof_check.py` untouched
- [x] Trigger documented: the contract names the state/async cues; the registry-alias addition is recorded as a deferred follow-up, not silently claimed as done — trigger cues in the contract; `mode-registry.json` aliases deferred
- [x] Evergreen + scope audit: grep the three files for spec/packet/phase IDs and spec paths (none); confirm only the three named files would change and `mode-registry.json` / `proof_check.py` / `context_loaded_card.md` are untouched — orchestrator-verified scope clean, evergreen clean

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Presence (contract) | The matrix field block exists under REQUIRED PROOF FIELDS with the nine-part shape + a HARD GATES row | grep the field names + the gate row; visual read of the fenced block |
| Presence (mirrors) | The same field set appears on the proof card section and the pre-flight binary section | grep each field/box across the two cards; confirm one-to-one with the contract |
| Binary completeness | Every pre-flight matrix box is binary and the verdict consumes them | read §11 boxes + the renumbered §12 verdict; confirm a single fail = FIX |
| Conditional behavior | A non-stateful surface marks the lane N/A and passes as before | walk the cards for a static surface; confirm no new required box bites |
| No-regression (gate) | `proof_check.py` over the proof card | output + exit identical to baseline (the four-field gate is untouched) |
| No-regression (cards) | Existing pre-flight boxes §1-§10 and existing contract proof blocks | read-diff confirms no existing box/field/verdict semantics changed |
| Trigger documentation | The state/async cues activate the lane | confirm the trigger sentence is present; confirm registry-alias work is flagged deferred, not claimed |
| Evergreen lint | All three shipped files | grep finds no spec/packet/phase IDs or spec paths |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `context_loading_contract.md` REQUIRED PROOF FIELDS + HARD GATES structure | Internal | Green | No SSOT home / pattern for the new field block |
| `proof_of_application_card.md` conditional-section + proof-row precedent | Internal | Green | No mirror pattern for the end-of-work card |
| `interface_preflight_card.md` binary-box + verdict precedent | Internal | Green | No binary checkable form / verdict to feed |
| designer-skills-main state-machine modeling shape (states/events/transitions/forbidden/guards) | External (corpus) | Green | No source vocabulary for the matrix fields |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the matrix boxes mis-fail a non-stateful surface, the pre-flight verdict renumber breaks an existing box reference, or any existing gate (Interface Pre-Flight, proof-card `proof_check.py`) changes behavior.
- **Procedure**: Revert the three touched files. The lane is purely additive, so reverting restores the prior cards and contract exactly; the verdict section returns to §11. No script, registry, data, or migration to unwind.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Contract) ──> Phase 2 (Mirror cards) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Contract | None | Mirror cards (the cards reference the contract field shape) |
| Mirror cards | Contract (fixes the field set to mirror) | Verify |
| Verify | Contract, Mirror cards | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Contract (field block + trigger + gate row) | Low | 30 minutes |
| Mirror cards (proof-card section + pre-flight binary section + renumber) | Low-Medium | 45 minutes |
| Verification (presence + no-regression + conditional + evergreen + scope) | Low | 45 minutes |
| **Total** | | **~2 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline captured: current `proof_check.py` output over the proof card, and a read-snapshot of the pre-flight §1-§11 and the contract §4/§5 before edit — captured pre-edit
- [x] Confirm only the 3 scope-locked files are staged — change set limited to the contract, proof card, and pre-flight card
- [x] Confirm `mode-registry.json`, `proof_check.py`, and `context_loaded_card.md` are NOT modified — orchestrator-verified untouched

### Rollback Procedure
1. `git checkout -- <the 3 files>` to restore the originals
2. Re-run `proof_check.py` over the proof card and confirm output + exit are restored to baseline
3. No database, migration, registry, or downstream consumer to reconcile (markdown only)

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: File revert only

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum (phase deps, effort, enhanced rollback)
- Additive conditional INTERACTION STATE MATRIX lane mirrored across contract + proof card + pre-flight card
- Honest split: presence/consistency + binary boxes enforceable via the existing Interface Pre-Flight gate; live triggering + modeling quality advisory; no script or registry change this phase
-->
