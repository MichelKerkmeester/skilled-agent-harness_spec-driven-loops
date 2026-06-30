---
title: "Implementation Plan: D2-R7 — Preconditions & named failure modes for the /design:* surface"
description: "planning. Add preconditions{requiredInputKind,missingInputQuestion,cannotRunWhen,escalateIf,routeInstead} to command-metadata.json, generate Requires/Ask-first/Cannot-run/Escalate sections + named failure grammar in the five wrappers, and extend design-command-surface-check.mjs to ban status-only failure — all additive, drift stays 0."
trigger_phrases:
  - "d2-r7 preconditions failure modes plan"
  - "design command preconditions plan"
  - "named failure modes design surface"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/007-preconditions-and-failure-modes"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Mark plan phases complete; surface-check PASS invalid=0 drift=0"
    next_safe_action: "Run D2-R8 register-pinning phase for the /design surface"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r7-preconditions-and-failure-modes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: D2-R7 — Preconditions & named failure modes for the /design:* surface

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON data + Markdown wrappers + Node.js ESM (`.mjs`) validator |
| **Runtime** | `node` (project default), no new dependencies |
| **Inputs (read-only)** | `sk-design/mode-registry.json`; research §5 (D2-R7) for the precondition shape |
| **Mutated artifacts** | `sk-design/command-metadata.json`; `.opencode/commands/design/{audit,foundations,interface,md-generator,motion}.md`; `sk-design/shared/scripts/design-command-surface-check.mjs` |
| **Validation** | `node design-command-surface-check.mjs` — additive precondition gate; `node --check` on the edited checker |

### Overview
D2-R7 names, per `/design:*` command, the inputs the command requires and what it does when those inputs are missing or it cannot run — replacing the byte-generic `STATUS=FAIL ERROR="<message>"` tail (a status-only failure) with a named cause and a named route. The change is a three-part, strictly **additive** extension of the surface SSOT built in D2-R3:

1. **Metadata** — add a `preconditions{ requiredInputKind, missingInputQuestion, cannotRunWhen, escalateIf, routeInstead }` object to each of the five records in `command-metadata.json`.
2. **Wrappers** — generate a `Requires` / `Ask-first` / `Cannot-run` / `Escalate` (+ `Route instead`) section from that metadata in each of the five `commands/design/*.md` files, and upgrade the Return-Status step so every failure path carries a named cause and route.
3. **Checker** — extend `design-command-surface-check.mjs` to (a) require `preconditions` and its five non-empty sub-fields in every record, and (b) fail any wrapper that lacks the generated sections or still emits a status-only failure.

The precondition strings reconcile with the existing `accepts` and `argumentHint` fields already in the SSOT (the required input must be consistent with what the command accepts and its argument grammar). The work is no-regression: `mode-registry.json` is never touched, the existing drift fields (`description`, `argument-hint`, `allowed-tools`) stay matched because wrapper **frontmatter is frozen** (only the body gains sections), and the final surface-check state is `drift=0`.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] D2-R7 framing confirmed from spec.md + research §5: name required input + the missing/cannot-run/escalate/route behavior per command; ban status-only failure
- [x] The five SSOT records exist (D2-R3 landed) and currently pass the surface-check at `drift=0` — additive baseline confirmed
- [x] Per-command precondition strings drafted and reconciled with each record's existing `accepts` / `argumentHint` / `deferToHubWhen`
- [x] Scope frozen: `command-metadata.json` (add `preconditions`), the five wrappers (add body sections only), and the checker — nothing else

### Definition of Done
- [x] Each record carries `preconditions` with five non-empty string sub-fields; metadata still validates (`invalid=0`)
- [x] Each wrapper carries the generated `Requires` / `Ask-first` / `Cannot-run` / `Escalate` section and a named-route failure grammar; no `ERROR="<message>"` placeholder survives (0/5)
- [x] `node design-command-surface-check.mjs` passes additively: existing frontmatter drift still `0` AND the new precondition gate passes → overall `drift=0`, exit 0
- [x] `node --check` passes on the edited checker; `mode-registry.json` is byte-unchanged
- [x] No spec/packet/phase ID or spec path appears in the metadata, the wrappers, or the checker (evergreen [HARD])

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
SSOT projection + stateless drift-gate, extended one field deep. The metadata stays the single source of truth; the wrappers are generated projections of it; the checker is a deterministic, exit-coded validator that reads (never writes) the wrappers and the registry. D2-R7 adds one nested object to the record schema and the first **body-content** assertion to the checker (prior stages read frontmatter only).

### Key Components
- **`command-metadata.json`** — gains a `preconditions` object per record (five records, one per `/design:*` command).
- **Precondition sub-schema** — `requiredInputKind`, `missingInputQuestion`, `cannotRunWhen`, `escalateIf`, `routeInstead`, each a non-empty string.
- **Wrapper precondition section** — a generated `## 2. PRECONDITIONS` block projecting the five sub-fields, with the `## INSTRUCTIONS` section renumbered to `## 3`.
- **Wrapper Return-Status grammar** — named statuses replacing the bare failure: `STATUS=OK`, `STATUS=ASK MISSING=<input>`, `STATUS=FAIL ERROR=<named-cause>`, `STATUS=DEFER ROUTE=<hub|sibling>`.
- **`design-command-surface-check.mjs`** — gains `preconditions` in `REQUIRED_FIELDS`, a Stage-1 sub-field validity rule, and a Stage-2 wrapper-body rule.
- **`mode-registry.json`** — read-only `workflowMode` source; identity-only; never mutated.

#### Per-command precondition content (authored, reconciled with each record's `accepts` / `argumentHint` / `deferToHubWhen`)

| command | requiredInputKind | missingInputQuestion | cannotRunWhen | escalateIf | routeInstead |
|---------|-------------------|----------------------|---------------|------------|--------------|
| `/design:audit` | a concrete design target — a URL, component, screen, or file — to inspect | What is the audit target (URL, component, screen, or file), and what scope/score do you want? | no target is given, or the named target cannot be opened or inspected | the target needs build or run state the audit cannot reach to evidence a finding | the ask is to create new direction, a static system, or motion rather than review existing quality |
| `/design:foundations` | a design-system axis (color, type, layout, spacing, or tokens) plus the target surface or product context | Which axis (color, type, layout, spacing, tokens) and for which target surface? | no axis is named, or no target/product context is given to ground the system | the request actually needs full interface invention, not a single static axis | the work is overall interface direction, motion behavior, or release-quality audit |
| `/design:interface` | an interface target (surface, screen, or component set) plus the register and any mode hint | Which interface surface, and is this Brand or Product register? | no interface target is named to shape | the register is genuinely mixed or unresolved and changes the design dials | the request is primarily static tokens, motion behavior, audit findings, or measured CSS extraction |
| `/design:md-generator` | a reachable live URL plus a writable output directory | Which live URL should I extract, and where should the DESIGN.md be written? | the URL is missing or unreachable, or the output directory cannot be resolved or written | the site requires authentication or blocks headless extraction so the CSS cannot be captured | the request spans redesign, critique, or new visual-system invention rather than measured extraction |
| `/design:motion` | a component or state transition to animate, plus an optional animation library | Which component or state transition should the motion describe, and which library? | no component or state transition is named to animate | the motion depends on an interface direction that has not been decided yet | the request is static visual-system design, interface direction, audit scoring, or measured CSS extraction |

These are authored strings, not derived literals — but each must stay consistent with the same record's existing `accepts` (the input kind), `argumentHint` (the input tokens the `missingInputQuestion` asks for), and `deferToHubWhen` (the `routeInstead` condition). The reconciliation is an authoring rule verified in the checklist; the checker enforces presence + non-emptiness deterministically.

#### Record shape (worked example — `md-generator`, the one mutating command)
```json
{
  "command": "/design:md-generator",
  "ownerMode": "md-generator",
  "argumentHint": "<live-url> --output <dir>",
  "accepts": "a reachable live URL plus an output directory",
  "toolPolicy": { "mutatesWorkspace": true },
  "preconditions": {
    "requiredInputKind": "a reachable live URL plus a writable output directory",
    "missingInputQuestion": "Which live URL should I extract, and where should the DESIGN.md be written?",
    "cannotRunWhen": "the URL is missing or unreachable, or the output directory cannot be resolved or written",
    "escalateIf": "the site requires authentication or blocks headless extraction so the CSS cannot be captured",
    "routeInstead": "the request spans redesign, critique, or new visual-system invention rather than measured extraction"
  }
}
```
(Other fields — `description`, `aliases`, `returns`, `next`, `proofFields`, `deferToHubWhen` — are unchanged from D2-R3.)

#### Generated wrapper section (projected from `preconditions`; INSTRUCTIONS renumbers to §3)
```
## 2. PRECONDITIONS

- **Requires:** <requiredInputKind>
- **Ask-first:** if that input is missing, emit `STATUS=ASK MISSING=<input>` and ask "<missingInputQuestion>" — do not run on a guess.
- **Cannot-run:** when <cannotRunWhen>, stop with `STATUS=FAIL ERROR=<named-cause>` — name the cause, never a bare status.
- **Escalate:** if <escalateIf>, escalate the conflict and return `STATUS=DEFER ROUTE=hub` rather than forcing the mode.
- **Route instead:** when <routeInstead>, return `STATUS=DEFER ROUTE=hub` so the hub picks the right mode.
```
And the Return-Status step is upgraded to the named grammar (no `ERROR="<message>"` placeholder):
```
### Step 2: Return Status
- Success: `STATUS=OK`
- Missing input: `STATUS=ASK MISSING=<input>` + the Ask-first question
- Cannot run: `STATUS=FAIL ERROR=<named-cause>` (cause named, never status-only)
- Route instead: `STATUS=DEFER ROUTE=<hub|sibling>`
```

#### Checker rules (additive FAIL conditions)
Stage 1 — metadata validation (any violation → exit 2, INVALID):
1. `preconditions` is added to `REQUIRED_FIELDS`; a record missing it fails.
2. `preconditions` must be an object whose five sub-fields (`requiredInputKind`, `missingInputQuestion`, `cannotRunWhen`, `escalateIf`, `routeInstead`) are each a non-empty string.

Stage 2 — surface drift (any drift → exit 1, DRIFT):
3. Each wrapper body must contain the four named markers `Requires:`, `Ask-first:`, `Cannot-run:`, `Escalate:` (presence check via the generated section).
4. **Ban status-only failure:** the wrapper must NOT contain the generic placeholder `ERROR="<message>"`, and must contain the named-route tokens (`STATUS=ASK` and `STATUS=DEFER`/`ROUTE=`). A missing marker or a surviving placeholder is reported as a drift entry with `field: "preconditions"`.

The existing rules (frontmatter `description` / `argument-hint` / `allowed-tools` drift, `ownerMode ∈ workflowMode`, alias-uniqueness, required-field presence) are unchanged. PASS (exit 0) holds only when metadata is valid AND zero frontmatter drift AND every wrapper carries conformant preconditions.

### Data Flow
1. Checker resolves `command-metadata.json`, `mode-registry.json`, and the five wrapper paths from `import.meta.url` (no hardcoded absolute or spec paths) — unchanged.
2. Stage 1 validates the metadata, now including `preconditions` presence + sub-field non-emptiness.
3. Stage 2 parses each wrapper's frontmatter (existing drift) AND scans the body for the four section markers + the absence of the status-only placeholder.
4. Emits the existing deterministic, sorted, per-command report plus any `preconditions` drift entries; sets the exit code.

#### Expected build ordering
Add `preconditions` to the metadata first (Stage 1 stays valid). If the checker's Stage-2 body rule lands before the wrappers carry the sections, it will transiently report `preconditions` drift on all five — that is the correct mid-build state, identical to the D2-R3 pattern. Generating the wrapper sections clears it back to `drift=0`.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Extend the SSOT (`command-metadata.json`)
- [x] Add a `preconditions` object with the five sub-fields to each of the five records, using the authored §3 table
- [x] Reconcile each `preconditions.requiredInputKind` / `missingInputQuestion` / `routeInstead` with the same record's `accepts` / `argumentHint` / `deferToHubWhen`
- [x] Confirm valid JSON, five records, no embedded IDs/paths (evergreen [HARD])

### Phase 2: Generate the wrapper sections (`commands/design/*.md`)
- [x] Insert the generated PRECONDITIONS block in each wrapper, projected from its `preconditions` (landed as `## 3. PRECONDITIONS` per the implementer's section numbering)
- [x] Upgrade each Return-Status step to the named grammar; delete the `STATUS=FAIL ERROR="<message>"` placeholder (0/5 remain)
- [x] Keep wrapper frontmatter (`description`, `argument-hint`, `allowed-tools`, `description` line) byte-frozen so existing drift stays 0

### Phase 3: Extend the checker (`design-command-surface-check.mjs`)
- [x] Add `preconditions` to `REQUIRED_FIELDS`; validate the five sub-fields are non-empty strings (Stage 1, exit 2)
- [x] Add the Stage-2 wrapper-body rule: require the four markers, ban the `ERROR="<message>"` placeholder, require the named-route tokens (drift `field: "preconditions"`, exit 1)
- [x] Run `node --check`; confirm no spec/packet/phase ID or path is embedded (evergreen [HARD])

### Phase 4: Verification
- [x] Run `node design-command-surface-check.mjs` → `invalid=0`, `drift=0`, exit 0 (additive, no regression)
- [x] Confirm a removed precondition / a re-introduced placeholder makes the checker fail (empty `cannotRunWhen` → STATUS=INVALID invalid=1; restore → invalid=0 drift=0)
- [x] Confirm `mode-registry.json` is byte-unchanged; `git status` shows only the seven intended targets

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Schema validation | `command-metadata.json` parses; every record has `preconditions` with five non-empty sub-fields | `node` + checker Stage 1 |
| Surface presence | each wrapper carries the four `Requires/Ask-first/Cannot-run/Escalate` markers | checker Stage 2 |
| Status-only-failure ban | no wrapper retains `ERROR="<message>"`; named-route tokens present | checker Stage 2 |
| No-regression | frontmatter `description`/`argument-hint`/`allowed-tools` drift stays 0; overall `drift=0` | checker (full run) |
| Negative control | removing a precondition or re-adding the placeholder flips exit 0 → non-zero | manual edit + re-run |
| Non-mutation | `mode-registry.json` unchanged; checker `node --check` clean | `git diff` / `node --check` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `command-metadata.json` (D2-R3 SSOT) | Internal | Green | the record set `preconditions` attaches to; must exist with five records |
| `design-command-surface-check.mjs` (D2-R3) | Internal | Green | the gate being extended; its Stage-1/Stage-2 structure is the host |
| `mode-registry.json` | Internal (read-only) | Green | `workflowMode` set source; never mutated here |
| `commands/design/*.md` | Internal (mutated body-only) | Green | the projection targets; frontmatter must stay frozen |
| Node ESM runtime | External | Green | checker host |

**Coupling note:** D2-R7 widens the frozen record contract from D2-R3 by one nested object. Sibling D2 phases that also project off this metadata (e.g. arg-grammar D2-R2, output contract D2-R5) are unaffected because `preconditions` is additive and namespaced; no existing field changes shape.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the precondition section proves brittle to generate, or the new checker rule produces false drift on conformant wrappers.
- **Procedure**: revert the three edits — remove the `preconditions` object from each record, remove the generated `## 2. PRECONDITIONS` section + restore the prior Return-Status step in each wrapper, and revert the checker's Stage-1/Stage-2 additions. Because every change is additive and `mode-registry.json` is untouched, the revert returns the surface to the D2-R3 state (`drift=0`).

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Extend SSOT) ──> Phase 2 (Generate wrappers) ──┐
                      └──> Phase 3 (Extend checker) ─────┴──> Phase 4 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Extend SSOT | None | Generate wrappers, Extend checker |
| Generate wrappers | Extend SSOT | Verify |
| Extend checker | Extend SSOT | Verify |
| Verify | Generate wrappers, Extend checker | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Extend SSOT (5 precondition objects) | Low | 45–60 minutes |
| Generate wrapper sections (5 files) | Low–Medium | 1–1.5 hours |
| Extend checker (Stage 1 + Stage 2 body rule) | Medium | 1–1.5 hours |
| Verification | Low | 30–45 minutes |
| **Total** | | **~3.25–4.25 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] `mode-registry.json` sha captured before any work (proves non-mutation after) — `git diff` empty post-build
- [x] Confirmed exactly three target groups change: `command-metadata.json`, the five wrappers, the checker (seven files)
- [x] Wrapper frontmatter diff confirmed empty (only body sections change) so existing drift stays 0

### Rollback Procedure
1. Remove the `preconditions` object from each record in `command-metadata.json`
2. Remove the generated `## 2. PRECONDITIONS` section and restore the prior Return-Status step in each of the five wrappers; renumber `## 3. INSTRUCTIONS` back to `## 2`
3. Revert the `REQUIRED_FIELDS` addition and the Stage-1/Stage-2 precondition rules in the checker
4. Re-run `node design-command-surface-check.mjs` → `drift=0` (D2-R3 baseline restored); confirm `mode-registry.json` sha matches pre-work capture

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: file edits only; no persisted state

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum
- Adds preconditions{...} to command-metadata.json, generates wrapper Requires/Ask-first/Cannot-run/Escalate sections, extends design-command-surface-check.mjs to ban status-only failure
- Strictly additive: mode-registry.json untouched, frontmatter frozen, final surface-check drift=0
-->
