---
title: "Implementation Plan: nextOptions[] + handoff status grammar (no silent chain)"
description: "Additive handoff-grammar port onto the sk-design command-metadata SSOT, its surface-check drift gate, and the five /design:* wrappers: NEXT_OPTIONS resolve to known recipes, auto-chain is forbidden, holding STATUS=PASS drift=0 and hubRoute 23/5/0."
trigger_phrases:
  - "d6-r7 next options handoff grammar"
  - "handoff grammar design build"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/007-next-options-handoff-grammar"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Rename phase-deps/effort/enhanced-rollback anchors and mark gates complete"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/command-metadata.json"
      - ".opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: nextOptions[] + handoff status grammar (no silent chain)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | sk-design command projection layer (JSON SSOT + Node ESM checker + Markdown wrappers) |
| **SSOT file** | `.opencode/skills/sk-design/command-metadata.json` (five records, one per workflowMode) |
| **Checker** | `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` (drift gate) |
| **Wrappers** | `.opencode/commands/design/{audit,foundations,interface,md-generator,motion}.md` |
| **Change shape** | Additive only — new `handoff` metadata object, new validators, new wrapper section |

### Overview

The corpus that motivates this phase ends every command with an explicit follow-up grammar (a `## Output` block declaring what was produced and which named recipes may run next), whereas the sk-design wrappers today return a bare success tail (`STATUS=OK PRODUCES= NEXT= PROOF=`) plus a prose "recommend-only / never silently chains" line. The next hop is therefore legible to a human but not machine-checkable, and "no silent auto-chain" is asserted in prose rather than enforced.

This phase ports a typed **next-options + handoff status grammar** so each wrapper declares, in a checkable shape, what it produced and which **known recipes** may run next — and so a declared option that does not resolve to a known recipe, or any silent auto-chain, fails the checker. The grammar adds five tokens to the wrappers — `STATUS`, `PRODUCES`, `NEXT_OPTIONS`, `HANDOFF_REQUIRED`, `HANDOFF_REASON` — backed by a new `handoff` object in the SSOT and a new surface-check validator + drift detector. `STATUS` and `PRODUCES` already exist on the success tail; the net-new work is `NEXT_OPTIONS` (each entry resolving to a known recipe), `HANDOFF_REQUIRED`, and `HANDOFF_REASON`.

The work is scope-locked: the recipe **projection layer** (`argumentGrammar` + `choreography[]`, sibling phase 001 / D6-R1), the recipe **scorer cap** (sibling phase 002), and the broader **structural drift audit** (sibling phase 008) stay out of scope. This phase owns only the handoff grammar that 001 explicitly deferred here.

### Verified baseline (captured before any edit)

- `node .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` returns `STATUS=PASS STAGE=complete`, `METADATA commands=5 aliases=15 workflowModes=audit,foundations,interface,md-generator,motion`, `SUMMARY invalid=0 drift=0`, exit `0`.
- The SSOT already carries `next` (a non-empty `/design:*` command array), `pipeline.nextCommands` (a subset of `next`), and the wrapper success tail already emits `NEXT=`, `PRODUCES=`, `PROOF=`. No `handoff` object, `NEXT_OPTIONS`, `HANDOFF_REQUIRED`, or `HANDOFF_REASON` exists yet.
- Routing artifacts (`mode-registry.json`, and `hub-router.json` if present) are out of scope; the `hubRoute` floor (23 pass / 5 known-gap / 0 regression) is unaffected because no routing artifact or fixture is touched.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Spec deliverable read: add `STATUS`/`PRODUCES`/`NEXT_OPTIONS`/`HANDOFF_REQUIRED`/`HANDOFF_REASON` to the wrappers + `command-metadata.json`; the checker resolves every `NEXT_OPTIONS` entry to a known recipe; auto-chain forbidden unless requested. — Done: deliverable restated in §1; the `handoff` object carries all three net-new tokens
- [x] Baseline surface-check captured (`invalid=0 drift=0`, exit 0). — Done: green baseline captured before any edit
- [x] D6-R1 sequencing confirmed (see Dependencies): phase 001 lands first; this phase's `handoff` additions coexist with 001's `argumentGrammar`/`choreography[]` without clobbering them. — Done: R1 fields verified intact; `handoff` added beside them; `drift=0` after merge
- [x] Two design decisions resolved (see Dependencies): the `handoff` field name/shape, and wrapper grammar placement (dedicated section vs enriched success tail). — Done: grouped `handoff` object + dedicated `## HANDOFF GRAMMAR` section; success tail kept intact

### Definition of Done
- [x] All five SSOT records carry a valid `handoff` object (`nextOptions[]`, `handoffRequired`, `handoffReason`); no existing field removed or mutated. — Done: additive only; `commands=5` with `handoff` on each
- [x] Every `nextOptions[].command` resolves to a known recipe in `command-metadata.json` (one of the five `/design:*` commands), is not the record's own command, and the `nextOptions[].command` set equals the record `next` set. — Done: `validateHandoff` enforces resolution, no-self, lockstep
- [x] Surface-check requires and drift-gates the `handoff` object; an unknown next option fails the checker; a silent auto-chain (missing `HANDOFF_REQUIRED=false` / recommend-only assertion) fails the checker. — Done: unknown-option bite `invalid=1`, missing-`handoffRequired` bite `invalid=2`; both reverted
- [x] All five wrappers carry the handoff grammar (`NEXT_OPTIONS`, `HANDOFF_REQUIRED`, `HANDOFF_REASON`) matching the SSOT. — Done: five `## HANDOFF GRAMMAR` sections; `drift=0`
- [x] `design-command-surface-check.mjs` returns `STATUS=PASS ... invalid=0 drift=0`, exit 0. — Done: `STATUS=PASS commands=5 invalid=0 drift=0`, exit 0 (orchestrator-verified)
- [x] `mode-registry.json` (and `hub-router.json` if present) byte-unchanged; `hubRoute` 23/5/0 unaffected. — Done: registry + router untouched by this phase; hubRoute 23/5/0
- [x] No spec path, phase number, or artifact id embedded in any shipped artifact — metadata strings, wrapper text, or checker comment (evergreen [HARD]). — Done: evergreen scan clean across SSOT, checker, five wrappers

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-source-of-truth projection with a deterministic drift gate. The `handoff` object is authored by hand in the SSOT; the surface-check is the regen/drift hook proving every wrapper's handoff grammar equals the SSOT. The checker — not a generator — is the contract that "wrappers match metadata". The grammar makes the next hop legible and makes the unknown-option and silent-chain cases blocking.

### Key Components

| Target | Class | What changes |
|--------|-------|--------------|
| `.opencode/skills/sk-design/command-metadata.json` | EDIT — additive | Add a `handoff` object to each of the five records. Preserve every existing field. |
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | EDIT — additive | Add `handoff` to the required-field set; add a metadata validator (`nextOptions[]` resolve to known recipes, not self, set equals `next`; `handoffRequired` boolean; `handoffReason` non-empty); add a wrapper-drift detector for the handoff grammar tokens; register the new drift field. |
| `.opencode/commands/design/{audit,foundations,interface,md-generator,motion}.md` | EDIT — additive | Add one handoff-grammar section per wrapper carrying `NEXT_OPTIONS`, `HANDOFF_REQUIRED`, `HANDOFF_REASON`. Leave existing sections, the success tail, and frontmatter intact. |
| `.opencode/skills/sk-design/mode-registry.json` (and `hub-router.json` if present) | UNCHANGED — identity | Read-only reference. No edit; `hubRoute` untouched. |

> **Target derivation honesty:** spec §3 names the wrappers + `command-metadata.json` explicitly. The checker `design-command-surface-check.mjs` is the enforcement mechanism named in spec §4 ("checker resolves every NEXT_OPTIONS entry") and §5 ("fails the checker"), so it is an in-scope target even though §3 does not relist it. It is the same checker that phases 001 and 008 also extend.

### Proposed metadata shape (buildable contract)

`handoff` (additive — groups the next-options + handoff grammar; does not replace `next`):

```
"handoff": {
  "nextOptions": [
    { "command": "/design:foundations", "when": "the accepted direction needs a static token/color/type/spacing system" },
    { "command": "/design:motion",      "when": "the surface needs animation, transition, or reduced-motion behavior" },
    { "command": "/design:audit",       "when": "the surface is ready for findings-first review, scoring, or hardening" }
  ],
  "handoffRequired": false,
  "handoffReason": "recommend-only; the user or the sk-design hub chooses the next step, never an automatic chain"
}
```

The checker asserts: every `nextOptions[].command` is one of the five known recipes (resolves in `command-metadata.json`), is not the record's own command, and the `nextOptions[].command` set equals the record `next` set — so `next`, `pipeline.nextCommands` (⊆ `next`), and `handoff.nextOptions` stay in lockstep (one source of truth, drift stays 0). `handoffRequired` is the static recommend-only flag (always `false` for these wrappers; auto-chain is only legal when the live request explicitly asks for it). `handoffReason` is a non-empty rationale.

### Data flow
1. Implementer authors the `handoff` object per record in the SSOT.
2. Implementer extends the surface-check: required field, metadata validator, and the handoff wrapper-drift detector.
3. Implementer adds the handoff-grammar section to each wrapper to match the SSOT.
4. Surface-check runs; drift must be 0 and metadata must be valid; an injected unknown option / removed `HANDOFF_REQUIRED` must make it bite, then revert.

### Enforcement honesty (code-enforced vs advisory)
- **Code-enforced (the checker bites):** presence + well-formedness of the `handoff` object; every `NEXT_OPTIONS` entry resolves to a known recipe and is not the own command; `handoff.nextOptions` set equals `next`; `handoffRequired` is boolean; `handoffReason` is non-empty; each wrapper's handoff section carries the `NEXT_OPTIONS` / `HANDOFF_REQUIRED` / `HANDOFF_REASON` tokens and every option command (drift=0); the no-silent-chain assertion is present and `HANDOFF_REQUIRED=false`. An unknown next option and a silent auto-chain both fail the checker, per spec §5.
- **Advisory:** whether the *recommended* options are the right pipeline for a given live request, and whether a live model honors "no auto-chain unless requested" on an open-ended prompt outside the fixture surface. The grammar makes the next hop legible and the unknown-option / silent-chain cases blocking on the static surface; it cannot certify the live model picks the tasteful next step. (Mirrors the research honest framing: structural presence enforceable, application/taste advisory.)

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Schema + SSOT
- [x] Confirm D6-R1 sequencing and the two design decisions (Dependencies) before touching the SSOT. — Done: R1 fields confirmed intact; grouped `handoff` + dedicated section decided
- [x] Add a `handoff` object to each of the five records; set `nextOptions[].command` to exactly the record `next` set, each with a non-empty `when`. — Done: five objects added, `nextOptions == next`, every `when` populated
- [x] Set `handoffRequired: false` and a non-empty `handoffReason` per record; keep all reason text evergreen (no spec id/path). — Done: recommend-only flag + reason on each; evergreen
- [x] Preserve every existing field; change nothing in `mode-registry.json`. — Done: additive only; registry byte-unchanged

### Phase 2: Surface-check enforcement
- [x] Add `handoff` to the required-field set. — Done: a record missing `handoff` reports INVALID
- [x] Add a metadata validator: `nextOptions[]` non-empty; each `command` resolves to a known recipe and is not the own command; `nextOptions[].command` set equals `next`; `handoffRequired` boolean; `handoffReason` non-empty. — Done: `validateHandoff` enforces all clauses (+ no-duplicate, non-empty `when`, `handoffRequired` must be `false`)
- [x] Add a wrapper-drift detector asserting each wrapper's handoff section carries `NEXT_OPTIONS=`, `HANDOFF_REQUIRED=`, `HANDOFF_REASON=`, every `nextOptions[].command`, and the no-silent-chain assertion; register the new drift field in the drift-field set. — Done: detector wired; new drift field registered
- [x] Keep all comments evergreen — no spec path, phase id, or artifact number in the code. — Done: evergreen scan clean

### Phase 3: Wrapper projection + verification
- [x] Add the handoff-grammar section to all five wrappers reflecting their `handoff` object; keep the existing success tail (`NEXT=`/`PRODUCES=`/`PROOF=`) and `PIPELINE & HANDOFF` section intact. — Done: five `## HANDOFF GRAMMAR` sections; success tail + pipeline prose preserved
- [x] Run the surface-check; resolve any drift until `invalid=0 drift=0`, exit 0. — Done: `STATUS=PASS commands=5 invalid=0 drift=0`, exit 0
- [x] Negative probe (scratch only): inject an unknown `nextOptions` command and a removed `HANDOFF_REQUIRED` token; confirm the checker bites on each; revert. — Done: unknown-option `invalid=1`; missing-`handoffRequired` `invalid=2`; both reverted
- [x] Confirm `mode-registry.json` byte-unchanged and `hubRoute` 23/5/0 unaffected. — Done: registry untouched; hubRoute 23/5/0

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tool |
|-----------|-------|------|
| Schema validity | SSOT parses; five records; `handoff` present and well-formed | `node design-command-surface-check.mjs` (metadata stage) |
| Known-recipe resolution | Every `nextOptions[].command` resolves to one of the five recipes; not self; set equals `next` | surface-check metadata stage |
| Drift gate | Each wrapper handoff section carries the three grammar tokens + every option command; matches SSOT | surface-check surface stage → `drift=0` |
| Unknown-option negative | An injected unknown `nextOptions` command fails the checker, then revert | surface-check (manual, scratch only) |
| Silent-chain negative | A wrapper missing `HANDOFF_REQUIRED=false` / recommend-only assertion fails the checker, then revert | surface-check (manual, scratch only) |
| No-regression | Existing fields, registry identity, prior passes, and `hubRoute` 23/5/0 all hold | re-run surface-check; diff `mode-registry.json` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| D6-R1 sequencing (phase 001 lands first) | Internal (ordering) | **Needs confirm** | Phases 001 and 007 both edit `command-metadata.json` + `design-command-surface-check.mjs` + the five wrappers. 001 ports `argumentGrammar`/`choreography[]` and explicitly defers `nextOptions[]` + STATUS handoff grammar to here. **Required order: 001 → 007 → 008.** If 007 runs before 001, rebase the `handoff` additions onto 001's landed metadata/checker so neither set of additive fields is clobbered; re-run the surface-check to `drift=0` after merge. |
| `handoff` field name/shape | Internal (logic-sync) | **Needs confirm** | The spec lists the grammar tokens (`NEXT_OPTIONS`/`HANDOFF_REQUIRED`/`HANDOFF_REASON`); 001 deferred a `nextOptions[]` field here. Recommendation: group them under one `handoff` object (`nextOptions[]`, `handoffRequired`, `handoffReason`) for cohesion, and confirm the name coheres with 001's landed metadata before authoring. |
| Wrapper grammar placement | Internal (design) | **Needs confirm** | Recommendation: add a dedicated handoff-grammar section and keep the existing success tail (`NEXT=`/`PRODUCES=`/`PROOF=`) intact (fully additive, no regression). Alternative: enrich the success tail with the three new tokens — higher-risk, requires moving the checker's status-token set in lockstep. Pick one and keep checker + wrappers in lockstep so drift stays 0. |
| `next` / `pipeline.nextCommands` already present | Internal | Green (already enforced) | `next` is the canonical next-command list; `handoff.nextOptions` enriches it with rationale + handoff flags. Preserve as-is; the checker ties the three together. |
| Surface-check stays the single drift gate | Internal | Green | The broader structural drift audit (route fixtures, generated-doc comparison) is sibling phase 008; do not pull it in. |
| Node runtime for the ESM checker | External | Green | Required to run the surface-check; no new packages. |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger:** surface-check cannot reach `drift=0`, an existing field/behavior regresses, or the `hubRoute` floor moves.
- **Procedure:** revert the SSOT, the surface-check, and the five wrappers to the pre-change state; re-run the surface-check to confirm the restored baseline (`invalid=0 drift=0`, exit 0). All artifacts are plain text under version control, so revert is a clean checkout with no data migration.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Schema + SSOT) ──> Phase 2 (Surface-check) ──> Phase 3 (Wrappers + verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Schema + SSOT | D6-R1 sequencing + design decisions | Surface-check, Wrappers |
| Surface-check | Schema + SSOT | Wrappers verification |
| Wrappers + verify | Schema, Surface-check | None |

Order matters: if wrappers are edited before the checker knows the `handoff` grammar, the run is not a meaningful drift gate; if the checker requires `handoff` before the SSOT carries it, the metadata stage fails closed.

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Schema + SSOT (5 records × `handoff` object) | Low-Medium | 1-1.5 hours |
| Surface-check (1 validator + 1 drift detector) | Medium | 1.5-2.5 hours |
| Wrappers (5 × handoff section) + verification + negative probes | Low-Medium | 1-1.5 hours |
| **Total** | | **3.5-5.5 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline surface-check output captured (`invalid=0 drift=0`, exit 0). — captured before any edit
- [x] `mode-registry.json` hash recorded before edits to prove identity preservation. — registry confirmed byte-unchanged after the work
- [x] Working tree clean except the in-scope artifacts (SSOT, checker, five wrappers). — change set limited to those seven files

### Rollback Procedure
1. **Immediate:** restore the SSOT, the surface-check, and the five wrappers from the last clean state.
2. **Verify:** re-run the surface-check; confirm `invalid=0 drift=0`, exit 0.
3. **Confirm identity:** diff `mode-registry.json` against the recorded hash; confirm `hubRoute` 23/5/0 if exercised.

### Data Reversal
- **Has data migrations?** No — text-only artifacts under version control.
- **Reversal procedure:** plain revert; no database or generated-state to unwind.

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Additive handoff-grammar port onto an existing, passing command surface
- Preserves STATUS=PASS drift=0 and hubRoute 23/5/0; registry stays identity-only
- Scope-locked against sibling phases 001 / 002 / 008; ordering 001 -> 007 -> 008
-->
