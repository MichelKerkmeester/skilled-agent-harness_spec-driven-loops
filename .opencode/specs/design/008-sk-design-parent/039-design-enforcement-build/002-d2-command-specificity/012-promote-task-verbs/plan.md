---
title: "Implementation Plan: D2-R12 — Promote high-value task verbs as command-visible projections"
description: "planning. Add taskProjections{verb,ownerMode,strictness,referenceSources,requires,fixtures} to command-metadata.json, generate a Task Projections section in the five wrappers, and extend design-command-surface-check.mjs to validate the projections, reconcile them with mode-registry aliases, and reject command creep via a negative corpus — all additive, drift stays 0."
trigger_phrases:
  - "d2-r12 promote task verbs plan"
  - "design command task projections plan"
  - "transform verbs command surface plan"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/012-promote-task-verbs"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Marked plan complete; all phases [x] with checker PASS invalid=0 drift=0 evidence"
    next_safe_action: "Regenerate description.json + graph-metadata.json to clear residual generated-metadata"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r12-promote-task-verbs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Strictness is enforced to advisory by the checker; the verbs are advisory routing aids"
      - "The command-creep guard bans minting any verb as a /design:<verb> command"
---
# Implementation Plan: D2-R12 — Promote high-value task verbs as command-visible projections

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
| **Inputs (read-only)** | `.opencode/skills/sk-design/mode-registry.json` (alias surface, for reconciliation); the owning modes' `references/` (for `referenceSources`); research §5 (D2-R12) for the projection shape |
| **Mutated artifacts** | `.opencode/skills/sk-design/command-metadata.json`; `.opencode/commands/design/{audit,foundations,interface,md-generator,motion}.md`; `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` |
| **Validation** | `node .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` — additive projection gate; `node --check` on the edited checker |

### Overview
D2-R12 makes eight high-value transform verbs visible at the command surface as **task projections of existing modes — not new modes and not new top-level commands**. The verbs (`typeset`, `colorize`, `bolder`, `quieter`, `distill`, `harden`, `polish`, `delight`) are buried in references and aliases today, invisible at the `/design:*` surface. The change is a three-part, strictly **additive** extension of the surface SSOT built in D2-R3:

1. **Metadata** — add a `taskProjections` array to each of the five records in `command-metadata.json`. Each entry is `{ verb, ownerMode, strictness, referenceSources, requires, fixtures }`. Records gain the verbs that belong to their mode; modes with no transform verbs carry an empty array so the field is uniform across all five records.
2. **Wrappers** — generate a `## 7. TASK PROJECTIONS` section (appended after the existing `## 6. EXAMPLE`) in each of the five `commands/design/*.md` files, listing the mode's projected verbs with their advisory strictness, plus a fixed **negative-corpus guard line** stating these verbs are task projections and never standalone commands.
3. **Checker** — extend `design-command-surface-check.mjs` to (a) require and validate the `taskProjections` schema, (b) reconcile each verb against the `mode-registry.json` alias surface (no cross-mode collision), (c) reject command creep (no verb may be minted as a `/design:<verb>` command), and (d) require the generated wrapper section + guard line.

#### Verb-set reconciliation (spec is source of truth)
spec.md §2 names the canonical eight transform verbs. The dispatch brief's illustrative verbs (`audit`, `design`, `animate`, `extract`) are **mode-level** verbs already covered by existing `mode-registry.json` aliases and the five commands themselves — they are NOT in scope here. D2-R12 promotes the **sub-mode transform verbs** the spec lists, mapping each to its owning mode. The work is no-regression: `mode-registry.json` is never mutated (the checker only reads it to reconcile), the existing drift fields (`description`, `argument-hint`, `allowed-tools`) stay matched because wrapper **frontmatter is frozen** (only the body gains a trailing section), all prior D2 additions (`argumentHint`, `examples`, `outputContract`, `discriminator`, `preconditions`, `toolPolicy`) are untouched, and the final surface-check state is `invalid=0 drift=0`.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] D2-R12 framing confirmed from spec.md + research §5: promote the eight transform verbs as command-visible task projections (NOT modes, NOT commands); each carries ownerMode/strictness/referenceSources/requires/fixtures; reject command creep via a negative corpus; the call stays advisory
- [x] The five SSOT records exist (D2-R1..R7 landed) and currently pass the surface-check at `invalid=0 drift=0` — additive baseline confirmed
- [x] Verb→ownerMode mapping drafted (foundations: typeset, colorize · interface: bolder, quieter, distill, delight · audit: harden, polish) and each `referenceSources` anchor confirmed to exist via Read
- [x] Scope frozen: `command-metadata.json` (add `taskProjections`), the five wrappers (append one body section only), and the checker — nothing else

### Definition of Done
- [x] Each record carries `taskProjections` (an array; empty for `motion`/`md-generator`); every projection entry has a non-empty `verb`, an `ownerMode` equal to the record's `ownerMode`, `strictness: "advisory"`, a non-empty `referenceSources` array, a non-empty `requires` string, and a non-empty `fixtures` array; metadata still validates (`invalid=0`)
- [x] Each of the eight verbs maps to exactly one ownerMode (globally unique); no verb is minted as a `/design:<verb>` command (negative corpus); every projected verb reconciles with the registry (no cross-mode alias collision)
- [x] Each wrapper carries the generated `## 7. TASK PROJECTIONS` section listing its owned verbs (or the empty-projection notice) plus the negative-corpus guard line
- [x] `node design-command-surface-check.mjs` passes additively: existing frontmatter + example + discriminator + preconditions drift still `0` AND the new projection gate passes → overall `invalid=0 drift=0`, exit 0
- [x] Synthetic breaks are flagged: minting a verb-command, a verb→ownerMode mismatch, a non-advisory strictness, a duplicate verb, a removed wrapper verb token, or a removed guard line each flips the checker to a non-zero exit
- [x] `node --check` passes on the edited checker; `mode-registry.json` is byte-unchanged
- [x] No spec/packet/phase ID or spec path appears in the metadata, the wrappers, or the checker (evergreen [HARD])

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
SSOT projection + stateless drift-gate, extended one array-field deep, plus a registry-reconciliation read and a negative-corpus guard. The metadata stays the single source of truth; the wrappers are generated projections of it; the checker is a deterministic, exit-coded validator that reads (never writes) the wrappers and the registry. D2-R12 adds one array field to the record schema, a new metadata validator, a registry cross-read for alias reconciliation, and a new Stage-2 body assertion — all additive over the D2-R3..R7 spine.

### Key Components
- **`command-metadata.json`** — gains a `taskProjections` array per record (five records; the verbs concentrate in `audit`/`foundations`/`interface`, with `motion`/`md-generator` carrying `[]`).
- **Projection sub-schema** — `verb` (non-empty string), `ownerMode` (string equal to the record's `ownerMode` and ∈ `workflowMode` set), `strictness` (string, closed enum `{"advisory"}`), `referenceSources` (non-empty string array of durable skill-internal reference anchors), `requires` (non-empty string), `fixtures` (non-empty string array of named fixture identifiers).
- **Wrapper Task Projections section** — a generated `## 7. TASK PROJECTIONS` block appended after `## 6. EXAMPLE`, listing each owned verb + its advisory strictness + the negative-corpus guard line; for `motion`/`md-generator` it states the empty-projection notice.
- **`design-command-surface-check.mjs`** — gains `taskProjections` in `REQUIRED_FIELDS`, a Stage-1 projection validator (`validateTaskProjections`), a registry-alias reconciliation read, a global verb-uniqueness + command-creep guard, and a Stage-2 wrapper-body drift rule (`expectedTaskProjectionsDrift`).
- **`mode-registry.json`** — read-only alias source for reconciliation; identity-only; never mutated.

#### Verb → ownerMode mapping (authored; each `referenceSources` anchor confirmed to exist via Read before pinning)

| verb | ownerMode | strictness | referenceSources (verified-existing anchors) | requires |
|------|-----------|-----------|----------------------------------------------|----------|
| `typeset` | foundations | advisory | `design-foundations/references/type/typography_system.md`; `design-foundations/assets/token_starter.md` | a type system or target surface to set |
| `colorize` | foundations | advisory | `design-foundations/references/color/oklch_workflow.md`; `design-foundations/references/color/palette_theming.md` | a palette or surface to color |
| `bolder` | interface | advisory | `design-interface/references/design-process/design_principles.md`; `design-audit/references/transform_remediation.md` | an interface surface to push louder |
| `quieter` | interface | advisory | `design-interface/references/design-process/design_principles.md`; `design-audit/references/transform_remediation.md` | an interface surface to calm |
| `distill` | interface | advisory | `design-interface/references/design-process/variation_diversity.md`; `design-audit/references/transform_remediation.md` | an interface surface to reduce to essentials |
| `delight` | interface | advisory | `design-interface/references/design-process/real_ui_loop.md`; `design-audit/references/transform_remediation.md` | an interface surface to add an earned moment to |
| `harden` | audit | advisory | `design-audit/references/hardening_edge_cases.md`; `design-audit/references/transform_remediation.md` | a built surface to harden for production |
| `polish` | audit | advisory | `design-audit/references/critique_hardening.md`; `design-audit/references/transform_remediation.md` | a near-final surface to assess for polish readiness |

`motion` and `md-generator` carry `taskProjections: []` (no transform verbs project onto them).

**Authoring notes (verified against the live skill tree):**
- The verbs are durable transform-verb names and the `referenceSources` are durable skill-internal source anchors — both evergreen-safe (the evergreen [HARD] ban targets spec/phase packet numbers and spec paths, not skill source anchors).
- `transform_application.md` is NOT yet built (it is separate D1 work) — do NOT cite it; the canonical buried-verb source that exists is `design-audit/references/transform_remediation.md`.
- No sk-design gold corpus exists yet (D3 work), so `fixtures` entries are named identifiers a future corpus consumes (e.g. `typeset.positive`, `typeset.negative.mint-command`), NOT file paths.
- Implementer Reads each `referenceSources` path before pinning; if a named anchor is absent, pin the nearest existing reference in the owning mode's `references/`.

#### Record shape (worked example — `foundations`)
```json
{
  "command": "/design:foundations",
  "ownerMode": "foundations",
  "taskProjections": [
    {
      "verb": "typeset",
      "ownerMode": "foundations",
      "strictness": "advisory",
      "referenceSources": [
        "design-foundations/references/type/typography_system.md",
        "design-foundations/assets/token_starter.md"
      ],
      "requires": "a type system or target surface to set",
      "fixtures": ["typeset.positive", "typeset.negative.mint-command"]
    },
    {
      "verb": "colorize",
      "ownerMode": "foundations",
      "strictness": "advisory",
      "referenceSources": [
        "design-foundations/references/color/oklch_workflow.md",
        "design-foundations/references/color/palette_theming.md"
      ],
      "requires": "a palette or surface to color",
      "fixtures": ["colorize.positive", "colorize.negative.mint-command"]
    }
  ]
}
```
(All other fields — `description`, `argumentHint`, `aliases`, `accepts`, `returns`, `examples`, `next`, `proofFields`, `deferToHubWhen`, `preconditions`, `discriminator`, `toolPolicy`, `outputContract` — are unchanged from D2-R1..R7.)

#### Generated wrapper section (projected from `taskProjections`; appended after `## 6. EXAMPLE`)
For a mode with projected verbs (`foundations` shown):
```
## 7. TASK PROJECTIONS

These transform verbs are advisory task projections of this mode — type them and the mode applies the matching reference lane. They are NOT standalone commands and NOT new modes.

- **typeset** (advisory) — set a type system or target surface; applies the typography/token reference lane.
- **colorize** (advisory) — color a palette or surface; applies the color reference lane.

**Negative corpus:** none of these verbs is a `/design:<verb>` command. A request that asks to mint one as a top-level command is rejected; the verb routes into this mode instead.
```
For a mode with no projected verbs (`motion`/`md-generator`):
```
## 7. TASK PROJECTIONS

No transform-verb projections own this mode. Transform verbs route to their owning mode (foundations, interface, or audit), never to a new command.

**Negative corpus:** none of the design transform verbs is a `/design:<verb>` command.
```

#### Checker rules (additive FAIL conditions)
Stage 1 — metadata validation (any violation → exit 2, INVALID):
1. `taskProjections` is added to `REQUIRED_FIELDS`; a record missing it fails.
2. `taskProjections` must be an array (empty allowed). Each entry must be an object with: `verb` (non-empty string); `ownerMode` (non-empty string equal to the record's `ownerMode` and ∈ the `workflowMode` set); `strictness` ∈ `{"advisory"}`; `referenceSources` (non-empty string array); `requires` (non-empty string); `fixtures` (non-empty string array).
3. **Global verb uniqueness:** each `verb` appears in exactly one record's `taskProjections` across the whole metadata (a verb belongs to one ownerMode).
4. **Command-creep / negative corpus:** for every projected verb `V`, `/design:<V>` must NOT be in the expected command set nor in `commandSetForModes(workflowModes)`. Minting a verb as a command is rejected here (and the existing "command is not in the expected /design:* set" rule catches a stray `/design:<V>` record).
5. **Alias reconciliation:** read each mode's `aliases` from `mode-registry.json`; a verb owned by mode `M` must NOT appear as a whole-word token in any other mode `N ≠ M` alias list (no cross-mode routing collision).

Stage 2 — surface drift (any drift → exit 1, DRIFT):
6. Each wrapper body must contain a `## 7. TASK PROJECTIONS` section (presence check); a missing section is a drift entry with `field: "taskProjections"`.
7. For a mode with projected verbs, the section must contain each owned `verb` token; a missing verb token is a drift entry.
8. Every wrapper section must contain the negative-corpus guard marker (the fixed `Negative corpus:` line); a missing marker is a drift entry.

The existing rules (frontmatter drift, `ownerMode ∈ workflowMode`, alias-uniqueness, example/discriminator/preconditions drift, output-contract validity, required-field presence) are unchanged. PASS (exit 0) holds only when metadata is valid AND zero frontmatter/example/discriminator/precondition drift AND every wrapper carries a conformant Task Projections section.

### Data Flow
1. Checker resolves `command-metadata.json`, `mode-registry.json`, and the five wrapper paths from `import.meta.url` (no hardcoded absolute or spec paths) — unchanged.
2. Stage 1 validates the metadata, now including `taskProjections` schema, verb uniqueness, command-creep rejection, and registry-alias reconciliation.
3. Stage 2 parses each wrapper's frontmatter (existing drift) AND scans the body for the `## 7. TASK PROJECTIONS` section, its owned verb tokens, and the negative-corpus guard line.
4. Emits the existing deterministic, sorted, per-command report plus any `taskProjections` drift entries; sets the exit code.

#### Expected build ordering
Add `taskProjections` to the metadata first (Stage 1 stays valid once every record carries the field). If the checker's Stage-2 body rule lands before the wrappers carry the section, it will transiently report `taskProjections` drift on all five — the correct mid-build state, identical to the D2-R3..R7 pattern. Generating the wrapper sections clears it back to `drift=0`.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Extend the SSOT (`command-metadata.json`)
- [x] Add a `taskProjections` array to each of the five records, using the §3 verb→ownerMode mapping; `motion`/`md-generator` get `[]`
- [x] For each projection, set `verb`, `ownerMode` (= record's ownerMode), `strictness: "advisory"`, `referenceSources` (confirmed-existing anchors), `requires`, and named `fixtures`
- [x] Confirm valid JSON, five records, each verb globally unique, no `/design:<verb>` minted, no embedded IDs/paths (evergreen [HARD])

### Phase 2: Generate the wrapper sections (`commands/design/*.md`)
- [x] Append the generated `## 7. TASK PROJECTIONS` block after `## 6. EXAMPLE` in each wrapper, projected from its `taskProjections`; include the negative-corpus guard line
- [x] For `motion`/`md-generator`, append the empty-projection notice + guard line
- [x] Keep wrapper frontmatter (`description`, `argument-hint`, `allowed-tools`) byte-frozen so existing drift stays 0

### Phase 3: Extend the checker (`design-command-surface-check.mjs`)
- [x] Add `taskProjections` to `REQUIRED_FIELDS`; add `validateTaskProjections` (schema + ownerMode parity + advisory strictness + global verb uniqueness + command-creep rejection) → violations exit 2 (Stage 1)
- [x] Read mode aliases from `mode-registry.json` and add the cross-mode alias-collision reconciliation rule (Stage 1)
- [x] Add `expectedTaskProjectionsDrift`: require the `## 7. TASK PROJECTIONS` section, each owned verb token, and the negative-corpus guard marker (drift `field: "taskProjections"`, exit 1)
- [x] Run `node --check`; confirm no spec/packet/phase ID or spec path is embedded (evergreen [HARD])

### Phase 4: Verification
- [x] Run `node design-command-surface-check.mjs` → `invalid=0`, `drift=0`, exit 0 (additive, no regression)
- [x] Confirm each synthetic break flags (see Testing Strategy negative controls)
- [x] Confirm `mode-registry.json` is byte-unchanged; `git status` shows only the three intended targets

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Schema validation | `command-metadata.json` parses; every record has `taskProjections`; each entry has the six fields with correct types and `strictness: "advisory"` | `node` + checker Stage 1 |
| Verb integrity | the eight verbs are globally unique; each `ownerMode` equals the record's `ownerMode` and ∈ workflowModes | checker Stage 1 |
| Command-creep / negative corpus | no `/design:<verb>` exists; minting one is rejected | checker Stage 1 |
| Alias reconciliation | no projected verb collides with another mode's registry aliases | checker Stage 1 (reads `mode-registry.json`) |
| Surface presence | each wrapper carries `## 7. TASK PROJECTIONS`, its owned verb tokens, and the `Negative corpus:` guard line | checker Stage 2 |
| No-regression | frontmatter/example/discriminator/precondition drift stays 0; overall `drift=0` | checker (full run) |
| Negative control — mint verb-command | adding a `/design:harden` record flips exit 0 → 2 | manual edit + re-run |
| Negative control — ownerMode mismatch | setting a verb's `ownerMode` to a different mode flips exit 0 → 2 | manual edit + re-run |
| Negative control — non-advisory strictness | setting `strictness: "enforceable"` flips exit 0 → 2 | manual edit + re-run |
| Negative control — duplicate verb | listing a verb under two records flips exit 0 → 2 | manual edit + re-run |
| Negative control — removed verb token | deleting a verb from a wrapper section flips exit 0 → 1 (drift) | manual edit + re-run |
| Negative control — removed guard line | deleting the `Negative corpus:` line flips exit 0 → 1 (drift) | manual edit + re-run |
| Non-mutation | `mode-registry.json` unchanged; checker `node --check` clean | `git diff` / `node --check` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `command-metadata.json` (D2-R3 SSOT) | Internal | Green | the record set `taskProjections` attaches to; must exist with five records |
| `design-command-surface-check.mjs` (D2-R3) | Internal | Green | the gate being extended; its Stage-1/Stage-2 structure is the host |
| `mode-registry.json` | Internal (read-only) | Green | `workflowMode` set + alias surface for reconciliation; never mutated here |
| Owning modes' `references/` | Internal (read-only) | Green | source of the verified `referenceSources` anchors |
| `commands/design/*.md` | Internal (mutated body-only) | Green | the projection targets; frontmatter must stay frozen |
| Node ESM runtime | External | Green | checker host |

**Coupling note:** D2-R12 widens the frozen record contract from D2-R3 by one additive array field. Sibling D2 phases that also project off this metadata (arg-grammar, output contract, preconditions, discriminator) are unaffected because `taskProjections` is additive and namespaced; no existing field changes shape. The verbs and `referenceSources` are durable source anchors — they do NOT depend on any spec/phase ID, so the artifacts stay evergreen.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the projection section proves brittle to generate, the registry reconciliation produces false collisions, or the new checker rule produces false drift on conformant wrappers.
- **Procedure**: revert the three edits — remove the `taskProjections` array from each record, remove the generated `## 7. TASK PROJECTIONS` section from each wrapper, and revert the checker's `REQUIRED_FIELDS` addition, `validateTaskProjections`, the registry-alias read, and `expectedTaskProjectionsDrift`. Because every change is additive and append-only and `mode-registry.json` is untouched, the revert returns the surface to the D2-R7 state (`invalid=0 drift=0`).

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
| Extend SSOT (8 projections across 5 records) | Low–Medium | 1–1.5 hours |
| Generate wrapper sections (5 files, append-only) | Low | 45–60 minutes |
| Extend checker (validator + registry reconcile + drift rule) | Medium | 1.5–2 hours |
| Verification (PASS + six negative controls) | Low–Medium | 45–60 minutes |
| **Total** | | **~4–5 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] `mode-registry.json` sha captured before any work (proves non-mutation after)
- [x] Confirmed exactly three target paths change: `command-metadata.json`, the five wrappers, the checker
- [x] Wrapper frontmatter diff confirmed empty (only a trailing body section is appended) so existing drift stays 0

### Rollback Procedure
1. Remove the `taskProjections` array from each record in `command-metadata.json`
2. Remove the appended `## 7. TASK PROJECTIONS` section from each of the five wrappers
3. Revert the `REQUIRED_FIELDS` addition, `validateTaskProjections`, the registry-alias read, and `expectedTaskProjectionsDrift` in the checker
4. Re-run `node design-command-surface-check.mjs` → `invalid=0 drift=0` (D2-R7 baseline restored); confirm `mode-registry.json` sha matches pre-work capture

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: file edits only; no persisted state

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum
- Adds taskProjections[] to command-metadata.json (eight transform verbs by ownerMode), generates a wrapper Task Projections section with a negative-corpus guard, extends design-command-surface-check.mjs with a projection validator + registry-alias reconciliation + command-creep rejection + body drift rule
- Strictly additive: mode-registry.json untouched, frontmatter frozen, all prior D2 additions preserved, final surface-check invalid=0 drift=0
-->
