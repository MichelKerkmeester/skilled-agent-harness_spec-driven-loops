---
title: "Implementation Plan: D2-R11 — Interface intent lanes as visible task projections"
description: "planning. Add an interface-record `tasks` array to command-metadata.json binding the 11 interface-mode INTENT_SIGNALS lanes, each carrying a class (sibling-command/argument/internal/hidden); project the visible lanes as an interface.md section; and extend design-command-surface-check.mjs with an interface-targeted lane gate plus negative fixtures — all additive, drift stays 0."
trigger_phrases:
  - "d2-r11 interface intent lanes plan"
  - "interface intent lanes design plan"
  - "interface task projections plan"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/011-interface-intent-lanes"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Bound interface tasks to INTENT_SIGNALS; checker PASS invalid=0 drift=0; 3 files scoped"
    next_safe_action: "Regenerate description.json + graph-metadata.json to clear residual generated-metadata"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r11-interface-intent-lanes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The lane set is reconciled to the live INTENT_SIGNALS keys, so the surface cannot drift from the router"
      - "tasks stays interface-targeted and is not added to the global REQUIRED_FIELDS, so the 4 siblings keep drift=0"
---
# Implementation Plan: D2-R11 — Interface intent lanes as visible task projections

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON data + Markdown wrapper + Node.js ESM (`.mjs`) validator |
| **Runtime** | `node` (project default), no new dependencies |
| **Inputs (read-only)** | `sk-design/design-interface/SKILL.md` (the `INTENT_SIGNALS` router block — the 11 lanes); `sk-design/mode-registry.json`; research §5 (D2-R11) for the lane-class taxonomy |
| **Mutated artifacts** | `sk-design/command-metadata.json` (interface record only); `.opencode/commands/design/interface.md` (body only); `sk-design/shared/scripts/design-command-surface-check.mjs` |
| **Validation** | `node design-command-surface-check.mjs` — additive interface-lane gate; `node --check` on the edited checker |

### Overview
The interface command collapses the interface mode's eleven router intent lanes into one opaque bridge, so a caller cannot see the distinct jobs it covers (invent a direction, produce N options, redesign an existing surface, run the pre-ship gate, hand a build to sk-code, name a realized look) or tell which apparent "lanes" are really sibling-command work, internal calibration, or non-surfaced tooling. D2-R11 surfaces the eleven lanes as visible task projections and binds them to the router so the surface and the mode cannot silently diverge. It is a three-part, strictly **additive** extension of the surface SSOT:

1. **Metadata** — add a `tasks` array to the `/design:interface` record in `command-metadata.json`. Each entry binds one interface-mode `INTENT_SIGNALS` lane to a `class` of `sibling-command` / `argument` / `internal` / `hidden`, plus the visible `label` and the `surface` (the `--mode` value it projects to, or the sibling it routes to). All eleven lanes are represented.
2. **Wrapper** — project the visible lanes as a new `## 3. INTERFACE TASK LANES` section in `commands/design/interface.md`: the `argument`-class lanes as selectable `--mode` values, the `sibling-command` lane as a named route to its owner, and the `internal` / `hidden` lanes named as not-surfaced. Subsequent sections renumber; the wrapper **frontmatter is frozen**.
3. **Checker** — extend `design-command-surface-check.mjs` with an **interface-targeted** lane gate: validate the `tasks` shape, reconcile the lane set against the `INTENT_SIGNALS` keys parsed from `design-interface/SKILL.md` (exactly the eleven lanes, no missing, no extras, no unknown lane), enforce the `class` enum, and add the negative-fixture guard that rejects any lane that should not become a command (any non-`argument` lane appearing as a `/design:*` command). Project the section in interface.md and fail its absence.

The lane strings reconcile with the interface record's existing `argumentHint` (`<target> [--mode]` — the `argument`-class lanes are the `--mode` values), `proofFields`, and `deferToHubWhen` (the `sibling-command` / route-instead conditions). The work is no-regression: the four sibling records (`audit`, `foundations`, `md-generator`, `motion`) are untouched, `tasks` is **not** added to the global `REQUIRED_FIELDS` (so the four siblings never need it and their drift stays 0), `mode-registry.json` is never touched, every wrapper's frontmatter stays byte-frozen, and the final surface-check state is `invalid=0 drift=0`.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] D2-R11 framing confirmed from spec.md + research §5: bind `tasks` to the interface router `INTENT_SIGNALS`; promote directions/preflight/redesign/handoff as task projections; classify every lane; add negative fixtures
- [x] The eleven `INTENT_SIGNALS` lanes enumerated from `design-interface/SKILL.md` and frozen as the reconciliation set (see §3 lane table)
- [x] The prior-D2 SSOT exists and currently passes the surface-check at `invalid=0 drift=0` — additive baseline confirmed
- [x] Per-lane `label` / `class` / `surface` strings drafted and reconciled with the interface record's `argumentHint` (`--mode`), `deferToHubWhen`, and `proofFields`
- [x] Scope frozen: `command-metadata.json` (interface record `tasks` only), `interface.md` (add one body section), and the checker — nothing else

### Definition of Done
- [x] The `/design:interface` record carries a `tasks` array covering all eleven `INTENT_SIGNALS` lanes; every entry has `lane`, `label`, a `class` from the four-value enum, and `surface`; metadata still validates (`invalid=0`)
- [x] `interface.md` carries the projected `## 3. INTERFACE TASK LANES` section (argument lanes as `--mode`, the sibling route named, internal/hidden lanes named as not-surfaced); subsequent sections renumbered; frontmatter byte-unchanged
- [x] `node design-command-surface-check.mjs` passes additively: all prior-D2 drift still `0` AND the new interface-lane gate passes → overall `drift=0`, exit 0
- [x] The negative fixtures (synthetic breaks) each flip the checker to a non-zero exit: a lane removed, an unknown lane added, a `class` outside the enum, and a non-`argument` lane promoted to a command
- [x] `node --check` passes on the edited checker; `mode-registry.json` and the four sibling records/wrappers are byte-unchanged
- [x] No spec/packet/phase ID or spec path appears in the metadata, the wrapper, or the checker (evergreen [HARD])

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
SSOT projection + stateless drift-gate, extended one record deep and reconciled against a second source of truth. The metadata stays the single source of truth for the command surface; the wrapper is a generated projection of it; the checker is a deterministic, exit-coded validator that reads (never writes) the wrapper, the registry, and — new for D2-R11 — the interface mode's `INTENT_SIGNALS` block, so the surface and the router cannot drift apart. D2-R11 adds one nested array to **one** record (not the shared schema) and the first **cross-file reconciliation** assertion to the checker.

### Key Components
- **`command-metadata.json`** — the `/design:interface` record gains a `tasks` array; the four sibling records are untouched.
- **Lane sub-schema** — per entry: `lane` (an `INTENT_SIGNALS` key), `label` (the visible name), `class` (`sibling-command` | `argument` | `internal` | `hidden`), `surface` (the `--mode` value, or the sibling/route it points to). Each a non-empty string; `class` constrained to the enum.
- **Wrapper lane section** — a generated `## 3. INTERFACE TASK LANES` block in `interface.md` projecting the lanes, with `## PRECONDITIONS`, `## INSTRUCTIONS`, `## EMIT DELIVERABLE`, `## EXAMPLE` renumbered to `## 4` … `## 7`.
- **`design-command-surface-check.mjs`** — gains an interface-targeted Stage-1 `tasks` validator + lane-set reconciliation, a `class`-enum + negative-fixture guard, and a Stage-2 interface.md body rule. The global `REQUIRED_FIELDS` is **not** changed.
- **`design-interface/SKILL.md`** — read-only reconciliation source for the eleven `INTENT_SIGNALS` keys; never mutated.
- **`mode-registry.json`** — read-only `workflowMode` source; identity-only; never mutated.

#### The eleven interface-mode lanes and their authored classes (reconciled with `INTENT_SIGNALS` + `argumentHint`)

| `INTENT_SIGNALS` lane | visible `label` | `class` | `surface` (where it shows up / routes to) |
|-----------------------|-----------------|---------|-------------------------------------------|
| `DESIGN_PRINCIPLES` | direction | `argument` | the default `--mode` — invent a distinctive interface direction |
| `VARIATION_DIVERSITY` | directions | `argument` | `--mode directions` — N debiased options (seed-of-thought) |
| `REDESIGN_INTAKE` | redesign | `argument` | `--mode redesign` — reshape an existing surface (already in the example) |
| `MECHANICAL_PREFLIGHT` | preflight | `argument` | `--mode preflight` — the pre-ship PASS/FAIL mechanical gate |
| `REAL_UI_LOOP` | handoff | `argument` | `--mode build` — real-UI loop + the required sk-code handoff manifest |
| `AESTHETICS` | aesthetic | `argument` | `--mode aesthetic` — name a realized look (brutalist, minimalist, …) |
| `UX_QUALITY` | quality | `sibling-command` | **routes to `/design:audit`** — accessibility, contrast, scoring; NOT a new interface command |
| `REGISTER_DIALS` | register | `internal` | always-load Brand-vs-Product calibration; an internal dial, never a chooser |
| `COPY_MOCK_DATA` | copy-gate | `internal` | the content delivery gate; runs inside delivery, not a standalone task |
| `REAL_SYSTEM_GROUNDING` | grounding | `internal` | the reuse-before-generate phase of the build lane |
| `REAL_WORLD_REFERENCE` | reference | `hidden` | Mobbin/Refero internal critique tooling; not surfaced to the caller |

The four lanes the research names for promotion — **directions, preflight, redesign, handoff** — are all `argument`-class (selectable `--mode` values). All four classes are represented. These `label`/`class` assignments are **authored candidates**: the implementer finalizes each `class` against the lane's `SKILL.md` semantics, but the HARD authoring rules are (a) the `tasks` lane set equals **exactly** the eleven `INTENT_SIGNALS` keys (no missing, no extras), (b) each entry's `class` is one of the four enum values, (c) the four named lanes are `argument`, (d) any lane whose work is owned by a sibling command is `sibling-command`, and (e) no non-`argument` lane is promoted to a `/design:*` command — the negative-fixture guard.

#### Lane-class taxonomy (the meaning the implementer projects and the checker guards)
- **`argument`** — a distinct interface job the command itself performs; surfaced as a `--mode` value in `argumentHint`.
- **`sibling-command`** — work whose owner is another `/design:*` command; surfaced as a named route, never duplicated as a new command.
- **`internal`** — a calibration or gate that runs inside the interface workflow; named as not-surfaced so callers do not mistake it for a selectable task.
- **`hidden`** — internal tooling/reference that is deliberately not exposed; named only to prove the lane is accounted for, not promotable.

#### Record shape (worked example — the interface `tasks` array, abbreviated)
```json
{
  "command": "/design:interface",
  "ownerMode": "interface",
  "argumentHint": "<target> [--mode]",
  "tasks": [
    { "lane": "DESIGN_PRINCIPLES",     "label": "direction",  "class": "argument",         "surface": "default --mode: invent a distinctive interface direction" },
    { "lane": "VARIATION_DIVERSITY",   "label": "directions", "class": "argument",         "surface": "--mode directions: N debiased options" },
    { "lane": "REDESIGN_INTAKE",       "label": "redesign",   "class": "argument",         "surface": "--mode redesign: reshape an existing surface" },
    { "lane": "MECHANICAL_PREFLIGHT",  "label": "preflight",  "class": "argument",         "surface": "--mode preflight: pre-ship PASS/FAIL gate" },
    { "lane": "REAL_UI_LOOP",          "label": "handoff",    "class": "argument",         "surface": "--mode build: real-UI loop + sk-code handoff manifest" },
    { "lane": "AESTHETICS",            "label": "aesthetic",  "class": "argument",         "surface": "--mode aesthetic: name a realized look" },
    { "lane": "UX_QUALITY",            "label": "quality",    "class": "sibling-command",  "surface": "route to /design:audit" },
    { "lane": "REGISTER_DIALS",        "label": "register",   "class": "internal",         "surface": "always-load calibration dial; not a chooser" },
    { "lane": "COPY_MOCK_DATA",        "label": "copy-gate",  "class": "internal",         "surface": "content delivery gate" },
    { "lane": "REAL_SYSTEM_GROUNDING", "label": "grounding",  "class": "internal",         "surface": "reuse-before-generate phase" },
    { "lane": "REAL_WORLD_REFERENCE",  "label": "reference",  "class": "hidden",           "surface": "Mobbin/Refero internal critique tooling" }
  ]
}
```
(Every other interface-record field — `description`, `aliases`, `returns`, `next`, `proofFields`, `deferToHubWhen`, `preconditions`, `discriminator`, `outputContract` — is unchanged from the prior-D2 SSOT.)

#### Generated wrapper section (projected from `tasks`; INSTRUCTIONS renumbers to §5)
```
## 3. INTERFACE TASK LANES

This command covers several distinct kinds of interface work. Pick the lane that
matches the request; if none fits, defer to the `sk-design` hub.

- **direction** (default) — invent a distinctive interface direction.
- **directions** (`--mode directions`) — produce N debiased options.
- **redesign** (`--mode redesign`) — reshape an existing surface.
- **preflight** (`--mode preflight`) — run the pre-ship PASS/FAIL mechanical gate.
- **handoff** (`--mode build`) — run the real-UI loop and emit the sk-code handoff manifest.
- **aesthetic** (`--mode aesthetic`) — name a realized look (e.g. brutalist, minimalist).
- **quality** — accessibility, contrast, and scoring are NOT this command; route to `/design:audit`.
- Internal lanes (register calibration, copy gate, system grounding, real-world reference) run
  inside the workflow and are not selectable tasks.
```

#### Checker rules (additive FAIL conditions, interface-targeted)
Stage 1 — metadata validation (any violation → exit 2, INVALID):
1. Resolve the `/design:interface` record. It must carry `tasks` as a non-empty array. (The four sibling records are exempt — `tasks` is **not** in `REQUIRED_FIELDS`.)
2. Each entry must have `lane`, `label`, `class`, `surface` as non-empty strings; `class` must be one of `sibling-command`, `argument`, `internal`, `hidden`.
3. **Reconciliation:** parse the `INTENT_SIGNALS` keys from `design-interface/SKILL.md` (the fenced router block). The set of `tasks[].lane` must equal that key set exactly — every lane covered, no extras, no unknown lane.
4. **Negative-fixture guard:** no entry whose `class !== "argument"` may name a `/design:*` command as its `surface`, and no `lane` may be promoted into the top-level `COMMANDS` set. A lane that should not become a command but does → INVALID.

Stage 2 — surface drift (any drift → exit 1, DRIFT):
5. `interface.md` must contain a `## INTERFACE TASK LANES` section that names each `argument`-class `label`, names the `sibling-command` route (`/design:audit`), and flags the internal/hidden lanes as not-surfaced. A missing section or a missing argument-lane label is reported as a drift entry with `field: "task-lanes"`, scoped to `/design:interface`.

The existing rules (frontmatter `description` / `argument-hint` / `allowed-tools` drift, the example/returns/deliverable/discriminator/preconditions gates, `ownerMode ∈ workflowMode`, alias-uniqueness, required-field presence) are unchanged. PASS (exit 0) holds only when metadata is valid AND zero prior-D2 drift AND the interface lane set reconciles AND `interface.md` carries the projected section.

### Data Flow
1. Checker resolves `command-metadata.json`, `mode-registry.json`, the five wrapper paths, and — new — `design-interface/SKILL.md` from `import.meta.url` (no hardcoded absolute or spec paths).
2. Stage 1 validates the metadata; for the interface record it additionally validates `tasks`, parses `INTENT_SIGNALS` keys from the SKILL block, reconciles the lane set, and runs the negative-fixture guard.
3. Stage 2 parses each wrapper's frontmatter (existing drift) and, for `interface.md`, scans the body for the `## INTERFACE TASK LANES` section + the projected lane labels and route.
4. Emits the existing deterministic, sorted, per-command report plus any `task-lanes` drift entries; sets the exit code.

#### Expected build ordering
Add the interface `tasks` array first (Stage 1 reconciliation can then pass). If the checker's Stage-2 body rule lands before `interface.md` carries the section, it will transiently report `task-lanes` drift on `/design:interface` — that is the correct mid-build state, identical to the prior-D2 pattern. Projecting the wrapper section clears it back to `drift=0`.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Extend the SSOT (`command-metadata.json`, interface record)
- [x] Enumerate the eleven `INTENT_SIGNALS` lanes from `design-interface/SKILL.md` and freeze them as the reconciliation set
- [x] Add a `tasks` array to the `/design:interface` record using the §3 lane table; one entry per lane with `lane` / `label` / `class` / `surface`
- [x] Reconcile `argument`-class `surface` values with the record's `argumentHint` (`--mode` tokens) and the `sibling-command` route with `deferToHubWhen`
- [x] Confirm valid JSON, the four sibling records untouched, no embedded IDs/paths (evergreen [HARD])

### Phase 2: Project the wrapper section + extend the checker
- [x] Insert the generated `## 3. INTERFACE TASK LANES` block in `interface.md`; renumber `PRECONDITIONS`/`INSTRUCTIONS`/`EMIT DELIVERABLE`/`EXAMPLE` to §4…§7; keep frontmatter byte-frozen
- [x] Add the interface-targeted Stage-1 `tasks` validator, the `INTENT_SIGNALS` lane-set reconciliation, the `class`-enum check, and the negative-fixture guard (exit 2)
- [x] Add the Stage-2 interface.md body rule (require the section + the argument labels + the sibling route; drift `field: "task-lanes"`, exit 1)
- [x] Run `node --check`; confirm no spec/packet/phase ID or path is embedded (evergreen [HARD])

### Phase 3: Verification
- [x] Run `node design-command-surface-check.mjs` → `invalid=0`, `drift=0`, exit 0 (additive, no regression on the prior-D2 gates)
- [x] Run the negative fixtures (remove a lane, add an unknown lane, set a bad `class`, promote a non-`argument` lane to a command) → each flips exit 0 → non-zero; restore
- [x] Confirm `mode-registry.json`, the four sibling records, and the four sibling wrappers are byte-unchanged; `git status` shows only the three intended targets

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Schema validation | interface record carries `tasks`; every entry has four non-empty fields; `class` in the enum | `node` + checker Stage 1 |
| Lane reconciliation | `tasks[].lane` set equals the eleven `INTENT_SIGNALS` keys parsed from `design-interface/SKILL.md` | checker Stage 1 |
| Surface projection | `interface.md` carries `## INTERFACE TASK LANES` with each argument label + the `/design:audit` route | checker Stage 2 |
| Negative fixtures | a removed lane / unknown lane / bad `class` / non-`argument` lane promoted to a command each flips exit 0 → non-zero | manual synthetic break + re-run |
| No-regression | prior-D2 frontmatter + example/discriminator/preconditions drift stays 0; overall `drift=0` | checker (full run) |
| Non-mutation | `mode-registry.json`, four sibling records, four sibling wrappers unchanged; `node --check` clean | `git diff` / `node --check` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `command-metadata.json` (prior-D2 SSOT) | Internal | Green | the record `tasks` attaches to; the interface record must exist |
| `design-interface/SKILL.md` `INTENT_SIGNALS` | Internal (read-only) | Green | the eleven-lane reconciliation source; the lane set is bound to it |
| `design-command-surface-check.mjs` (prior-D2) | Internal | Green | the gate being extended; its Stage-1/Stage-2 structure is the host |
| `mode-registry.json` | Internal (read-only) | Green | `workflowMode` set source; never mutated here |
| `commands/design/interface.md` | Internal (mutated body-only) | Green | the projection target; frontmatter must stay frozen |
| Node ESM runtime | External | Green | checker host |

**Coupling note:** D2-R11 extends the SSOT for **one** record (interface) by one nested array; it deliberately does **not** add `tasks` to the global `REQUIRED_FIELDS`, so the four sibling records and the cross-surface task-verb work that follows (D2-R12) are unaffected and their drift stays 0. The new dependency is the bind to `INTENT_SIGNALS`: if a lane is added to or removed from the interface mode's router, the reconciliation makes the surface-check fail until `tasks` is updated — that coupling is the point of the gate.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the lane projection proves brittle to generate, the `INTENT_SIGNALS` parse is fragile, or the new checker rule produces false drift on the conformant interface wrapper.
- **Procedure**: revert the three edits — remove the `tasks` array from the interface record, remove the `## 3. INTERFACE TASK LANES` section and restore the prior section numbering in `interface.md`, and revert the checker's interface-targeted Stage-1/Stage-2 additions. Because every change is additive, scoped to the interface record/wrapper, and `mode-registry.json` plus the four siblings are untouched, the revert returns the surface to the prior-D2 state (`invalid=0 drift=0`).

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Extend SSOT) ──> Phase 2 (Project wrapper + Extend checker) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Extend SSOT | None | Project wrapper + Extend checker |
| Project wrapper + Extend checker | Extend SSOT | Verify |
| Verify | Project wrapper + Extend checker | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Extend SSOT (one 11-entry `tasks` array, reconciled) | Low–Medium | 45–60 minutes |
| Project the interface.md section (one file, renumber) | Low | 30–45 minutes |
| Extend checker (Stage 1 reconciliation + guard, Stage 2 body rule) | Medium | 1.5–2 hours |
| Verification (functional + four negative fixtures) | Low–Medium | 45–60 minutes |
| **Total** | | **~3.5–4.75 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] `mode-registry.json` and the four sibling records/wrappers sha captured before any work (proves non-mutation after)
- [x] Confirmed exactly three target paths change: `command-metadata.json` (interface record), `interface.md` (body), the checker
- [x] `interface.md` frontmatter diff confirmed empty (only body sections change) so existing drift stays 0

### Rollback Procedure
1. Remove the `tasks` array from the `/design:interface` record in `command-metadata.json`
2. Remove the `## 3. INTERFACE TASK LANES` section from `interface.md` and renumber §4…§7 back to §3…§6
3. Revert the interface-targeted Stage-1 (`tasks` validator + `INTENT_SIGNALS` reconciliation + negative-fixture guard) and Stage-2 (`task-lanes` body rule) additions in the checker
4. Re-run `node design-command-surface-check.mjs` → `invalid=0 drift=0` (prior-D2 baseline restored); confirm the captured shas match

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: file edits only; no persisted state

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum
- Adds a `tasks` array to the interface record in command-metadata.json (11 INTENT_SIGNALS lanes, each classed), projects an INTERFACE TASK LANES section in interface.md, extends design-command-surface-check.mjs with an interface-targeted lane gate + reconciliation + negative fixtures
- Strictly additive: tasks NOT in global REQUIRED_FIELDS, four siblings + mode-registry.json untouched, frontmatter frozen, final surface-check invalid=0 drift=0
-->
</content>
</invoke>
