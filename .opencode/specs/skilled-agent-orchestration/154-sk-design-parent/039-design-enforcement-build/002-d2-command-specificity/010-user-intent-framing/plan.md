---
title: "Implementation Plan: D2-R10 — User-intent framing for the /design:* surface"
description: "planning. Add userIntent{job,ownedSignals} + copyGuard to command-metadata.json, reframe the five wrappers to lead with the user job and relocate mode-binding to an Internal binding section, and extend design-command-surface-check.mjs to require the intent lead and ban bridge-first phrases — all additive, prior D2 additions preserved, drift stays 0."
trigger_phrases:
  - "d2-r10 user intent framing plan"
  - "design command user intent plan"
  - "lead with user job design surface"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/010-user-intent-framing"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Marked plan phases complete; checker PASS invalid=0 drift=0; renumber safe 8 sections 5/5"
    next_safe_action: "Regenerate description.json + graph-metadata.json to clear residual generated-metadata"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r10-user-intent-framing"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "copyGuard scanned in the intent lead region only; the renumber is safe via name+anchor matching"
---
# Implementation Plan: D2-R10 — User-intent framing for the /design:* surface

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
| **Inputs (read-only)** | `sk-design/mode-registry.json` (mode aliases/intents); research §5 (D2-R10) for the framing shape |
| **Mutated artifacts** | `sk-design/command-metadata.json`; `.opencode/commands/design/{audit,foundations,interface,md-generator,motion}.md`; `sk-design/shared/scripts/design-command-surface-check.mjs` |
| **Validation** | `node design-command-surface-check.mjs` — additive intent-framing gate; `node --check` on the edited checker |

### Overview
Each `/design:*` wrapper currently opens with implementation framing — a "Thin bridge into the `sk-design` parent skill's `<mode>` mode" lead, then a `## PURPOSE` that pins the mode ("Pin the `<mode>` mode of the `sk-design` parent hub … loads the `<mode>` mode directly"). The user reads the plumbing before they read whether the command serves their job. D2-R10 inverts that: the wrapper leads with the **user's job** (the "I want to …" it answers, reconciled with the command's aliases and description), and the mode-binding mechanics move into a clearly-marked `Internal binding` section. The change is a three-part, strictly **additive** extension of the surface SSOT built in D2-R3, on top of the prior D2 additions:

1. **Metadata** — add a `userIntent{ job, ownedSignals }` object and a `copyGuard` (banned bridge-first lead phrases) array to each of the five records in `command-metadata.json`.
2. **Wrappers** — reframe each `commands/design/*.md`: replace the bridge-first lead line with the user job, rename `## 1. PURPOSE` to `## 1. USER INTENT` (job + owned signals), and relocate the mode-pinning mechanics into a new `## 2. INTERNAL BINDING` section; the existing named sections shift number but keep their names.
3. **Checker** — extend `design-command-surface-check.mjs` to (a) require `userIntent` + `copyGuard` and validate their shape and alias-reconciliation, and (b) fail any wrapper whose intent lead is missing, omits the user job, or contains a banned bridge-first phrase, or that has no `Internal binding` section.

The framing strings reconcile with each record's existing `aliases` (every `ownedSignals` entry must be one of that record's aliases) and its `description` (the `job` restates what the description promises in user voice). The work is no-regression: `mode-registry.json` is never touched; wrapper **frontmatter is frozen** (only the body lead and section numbering change); all prior D2 additions — `toolPolicy` (D2-R1), per-mode `argumentHint` (D2-R2), the SSOT + drift gate (D2-R3), `examples`/`Returns` (D2-R4), `outputContract`/Emit Deliverable (D2-R5), `discriminator`/sibling-discriminator (D2-R6), `preconditions` (D2-R7) — are preserved; and the final surface-check state is `drift=0`.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] D2-R10 framing confirmed from spec.md + research §5: lead with the user job, move mode-binding to an `Internal binding` section, ban bridge-first phrases via the copyGuard corpus
- [x] The five SSOT records exist (D2-R3 landed) and currently pass the surface-check at `invalid=0 drift=0` — additive baseline confirmed
- [x] Per-command `userIntent.job` / `ownedSignals` / `copyGuard` drafted and reconciled with each record's existing `aliases` (signal ⊆ aliases) and `description` (job restates the promise)
- [x] Scope frozen: `command-metadata.json` (add `userIntent` + `copyGuard`), the five wrappers (reframe lead + add `Internal binding`, body-only), and the checker — nothing else

### Definition of Done
- [x] Each record carries `userIntent{ job, ownedSignals }` (job non-empty string, ownedSignals non-empty string array, every signal ∈ that record's `aliases`) and a non-empty `copyGuard` array; metadata still validates (`invalid=0`)
- [x] Each wrapper leads with its user job, carries a `## 1. USER INTENT` section (job + owned signals) and a `## 2. INTERNAL BINDING` section; no bridge-first phrase survives in the intent lead
- [x] `node design-command-surface-check.mjs` passes additively: existing frontmatter drift still `0`, all prior D2 sections still present, AND the new intent-framing gate passes → overall `drift=0`, exit 0
- [x] `node --check` passes on the edited checker; `mode-registry.json` is byte-unchanged
- [x] No spec/packet/phase ID or spec path appears in the metadata, the wrappers, or the checker (evergreen [HARD])

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
SSOT projection + stateless drift-gate, extended one record-object and one body-section deep. The metadata stays the single source of truth; the wrappers are generated projections of it; the checker is a deterministic, exit-coded validator that reads (never writes) the wrappers and the registry. D2-R10 adds two fields to the record schema (`userIntent`, `copyGuard`), one new wrapper section (`Internal binding`), and a body-content rule that scans the **intent lead region only** so the relocated mode-binding language is never falsely flagged.

### Key Components
- **`command-metadata.json`** — gains a `userIntent` object and a `copyGuard` array per record (five records, one per `/design:*` command).
- **`userIntent` sub-schema** — `job` (a non-empty string: the user-facing "I want to …" the command answers) and `ownedSignals` (a non-empty string array, each entry a member of the same record's `aliases`).
- **`copyGuard` corpus** — a non-empty string array of banned bridge-first lead phrases the intent lead must not contain (e.g. `Thin bridge`, `Pin the`, `parent skill's`, `parent hub to`, `loads the`, `mode directly`).
- **Wrapper user-intent lead** — the line after the H1 becomes the user job; a `## 1. USER INTENT` section projects `job` + `ownedSignals`.
- **Wrapper `## 2. INTERNAL BINDING` section** — the relocated mode-pinning mechanics (Pin the `<mode>` mode of the `sk-design` parent hub; hub owns routing; loads the `<mode>` mode directly; defer to the hub when the request spans more). This is the one region where bridge/pin language legitimately lives.
- **`design-command-surface-check.mjs`** — gains `userIntent` + `copyGuard` in `REQUIRED_FIELDS`, a Stage-1 shape + alias-reconciliation rule, and Stage-2 intent-lead / copyGuard / Internal-binding rules.
- **`mode-registry.json`** — read-only mode alias/intent source; never mutated.

#### Per-command framing content (authored, reconciled with each record's `aliases` + `description`)

| command | userIntent.job ("I want to …") | ownedSignals (⊆ that record's aliases) |
|---------|--------------------------------|----------------------------------------|
| `/design:audit` | I want to review, score, and harden the quality of a design surface I already have. | audit design quality; critique ui surface; score design readiness |
| `/design:foundations` | I want to design or repair the static visual system — color, type, layout, spacing, tokens — for a surface. | design visual system; define design tokens; plan static foundations |
| `/design:interface` | I want to invent or reshape a distinctive interface direction for a surface. | shape interface direction; redesign ui surface; make ui distinctive |
| `/design:md-generator` | I want to extract a live site's real measured CSS into a Style Reference DESIGN.md. | extract website css; generate design reference; capture design tokens |
| `/design:motion` | I want to design purposeful animation, transitions, or reduced-motion behavior for a component or state. | design motion behavior; plan micro interactions; specify animation states |

`copyGuard` is the shared bridge-first corpus carried per record (identical content allowed): `["Thin bridge", "Pin the", "parent skill's", "parent hub to", "loads the", "mode directly"]`. These are the templated implementation-framing phrases that currently open every wrapper; the checker bans them from the **intent lead region** only.

These are authored strings, not derived literals — but each must stay consistent with the same record's existing `aliases` (every `ownedSignals` entry is one of them) and `description` (the `job` restates the description's promise in user voice). The alias-subset reconciliation is enforced deterministically by the checker; the job↔description consistency is an authoring rule verified in the checklist.

#### Record shape (worked example — `interface`)
```json
{
  "command": "/design:interface",
  "ownerMode": "interface",
  "description": "Distinctive, intentional UI design: direction, palette, type, layout, motion. sk-design interface mode.",
  "aliases": ["shape interface direction", "redesign ui surface", "make ui distinctive"],
  "userIntent": {
    "job": "I want to invent or reshape a distinctive interface direction for a surface.",
    "ownedSignals": ["shape interface direction", "redesign ui surface", "make ui distinctive"]
  },
  "copyGuard": ["Thin bridge", "Pin the", "parent skill's", "parent hub to", "loads the", "mode directly"]
}
```
(Other fields — `argumentHint`, `accepts`, `returns`, `next`, `proofFields`, `deferToHubWhen`, `preconditions`, `discriminator`, `toolPolicy`, `outputContract` — are unchanged from the prior D2 stages.)

#### Reframed wrapper (worked example — `interface`; named sections shift number, keep their names)
```
# /design:interface

Use this when you want to invent or reshape a distinctive interface direction for a surface.

## 1. USER INTENT

This command answers the user job: "I want to invent or reshape a distinctive interface
direction for a surface." It owns the user signals: "shape interface direction",
"redesign ui surface", "make ui distinctive".

## 2. INTERNAL BINDING

Pin the `interface` mode of the `sk-design` parent hub. The hub owns routing across modes;
this command loads the `interface` mode directly. If the request spans more than `interface`,
defer to the hub's routing instead.

## 3. WHEN TO USE THIS, NOT A SIBLING      (was § 2 — sibling-discriminator anchors unchanged)
## 4. PRECONDITIONS                         (was § 3)
## 5. INSTRUCTIONS                          (was § 4)
## 6. EMIT DELIVERABLE                      (was § 5)
## 7. EXAMPLE                               (was § 6)
```
The lead line and `## 1. USER INTENT` body project `userIntent.job` + `ownedSignals` and contain no `copyGuard` phrase. `## 2. INTERNAL BINDING` is where the relocated `Pin the … mode` / `loads the … mode directly` language lives.

> **Renumber safety:** the checker matches `PRECONDITIONS`, `EMIT DELIVERABLE`, and `Example` by name with an optional leading number (`## (\d+\. )?…`), and matches the sibling-discriminator by HTML anchor, so shifting these sections from §2–§6 to §3–§7 does not change what the existing rules find. Only the named sections and anchors are load-bearing, not their numbers.

#### Checker rules (additive FAIL conditions)
Stage 1 — metadata validation (any violation → exit 2, INVALID):
1. `userIntent` and `copyGuard` are added to `REQUIRED_FIELDS`; a record missing either fails.
2. `userIntent` must be an object whose `job` is a non-empty string and whose `ownedSignals` is a non-empty string array.
3. Reconciliation: every `ownedSignals` entry must be a member of the same record's `aliases` (subset) — a signal that is not an alias fails.
4. `copyGuard` must be a non-empty string array.

Stage 2 — surface drift (any drift → exit 1, DRIFT):
5. Each wrapper must contain a `## <n>. USER INTENT` section, and the **intent lead region** (the lines from the first line after the H1 down to, but excluding, `## INTERNAL BINDING`) must contain the record's `userIntent.job` text — else drift `field: "user-intent"`.
6. **Ban bridge-first lead:** the intent lead region must NOT contain any of the record's `copyGuard` phrases — else drift `field: "user-intent"` naming the offending phrase.
7. Each wrapper must contain a `## <n>. INTERNAL BINDING` section (proof the mode-binding was relocated, not left in the lead) — else drift `field: "user-intent"`.

The existing rules (frontmatter `description`/`argument-hint`/`allowed-tools` drift, `ownerMode ∈ workflowMode`, alias-uniqueness, required-field presence, examples/Returns, Emit Deliverable artifact name, discriminator, preconditions markers + named-failure grammar) are unchanged. PASS (exit 0) holds only when metadata is valid AND zero frontmatter drift AND every wrapper carries a conformant user-intent lead, no banned phrase, and an Internal binding section.

### Data Flow
1. Checker resolves `command-metadata.json`, `mode-registry.json`, and the five wrapper paths from `import.meta.url` (no hardcoded absolute or spec paths) — unchanged.
2. Stage 1 validates the metadata, now including `userIntent` shape + `ownedSignals ⊆ aliases` + `copyGuard` non-emptiness.
3. Stage 2 parses each wrapper's frontmatter (existing drift), extracts the intent lead region and the `Internal binding` section, and asserts: job present in the lead, no copyGuard phrase in the lead, Internal binding section present.
4. Emits the existing deterministic, sorted, per-command report plus any `user-intent` drift entries; sets the exit code.

#### Expected build ordering
Add `userIntent` + `copyGuard` to the metadata first (Stage 1 stays valid). If the checker's Stage-2 intent rules land before the wrappers are reframed, they will transiently report `user-intent` drift on all five — the correct mid-build state, identical to the D2-R3/D2-R7 pattern. Reframing the wrapper leads + adding the Internal binding section clears it back to `drift=0`.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Extend the SSOT (`command-metadata.json`)
- [x] Add a `userIntent{ job, ownedSignals }` object + a `copyGuard` array to each of the five records, using the authored §3 table
- [x] Reconcile each `userIntent.ownedSignals` with the same record's `aliases` (subset) and each `userIntent.job` with the record's `description`
- [x] Confirm valid JSON, five records, no embedded IDs/paths (evergreen [HARD])

### Phase 2: Reframe the wrappers (`commands/design/*.md`)
- [x] Replace each bridge-first lead line with the record's user job; rename `## 1. PURPOSE` to `## 1. USER INTENT` (project `job` + `ownedSignals`)
- [x] Add a `## 2. INTERNAL BINDING` section carrying the relocated mode-pinning mechanics; renumber the existing `WHEN TO USE` / `PRECONDITIONS` / `INSTRUCTIONS` / `EMIT DELIVERABLE` / `Example` sections to §3–§7, keeping their names and the sibling-discriminator anchors intact
- [x] Keep wrapper frontmatter (`description`, `argument-hint`, `allowed-tools`) byte-frozen so existing drift stays 0; confirm no copyGuard phrase remains in the intent lead

### Phase 3: Extend the checker (`design-command-surface-check.mjs`)
- [x] Add `userIntent` + `copyGuard` to `REQUIRED_FIELDS`; validate `userIntent.job` non-empty string, `userIntent.ownedSignals` non-empty string array with every entry ∈ `aliases`, and `copyGuard` non-empty string array (Stage 1, exit 2)
- [x] Add the Stage-2 rules: require the `USER INTENT` section + the `job` text in the intent lead region, ban every `copyGuard` phrase in that region, and require the `INTERNAL BINDING` section (drift `field: "user-intent"`, exit 1)
- [x] Run `node --check`; confirm no spec/packet/phase ID or spec path is embedded (evergreen [HARD])

### Phase 4: Verification
- [x] Run `node design-command-surface-check.mjs` → `invalid=0`, `drift=0`, exit 0 (additive, no regression; all prior D2 sections still present)
- [x] Synthetic break: a re-introduced bridge-first phrase in a lead, a dropped `userIntent`, and an `ownedSignals` entry that is not an alias each flip the checker to a failing exit (negative proof of the new gate)
- [x] Confirm `mode-registry.json` is byte-unchanged; `git status` shows only the three intended targets

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Schema validation | `command-metadata.json` parses; every record has `userIntent{job,ownedSignals}` + non-empty `copyGuard` | `node` + checker Stage 1 |
| Alias reconciliation | every `ownedSignals` entry is a member of the same record's `aliases` | checker Stage 1 |
| Intent-lead presence | each wrapper leads with its user job and carries `## 1. USER INTENT` + `## 2. INTERNAL BINDING` | checker Stage 2 |
| Bridge-first ban | no copyGuard phrase appears in any wrapper's intent lead region | checker Stage 2 |
| No-regression | frontmatter drift stays 0; all prior D2 sections (discriminator, preconditions, Emit Deliverable, Example) still present; overall `drift=0` | checker (full run) |
| Negative control | a re-added bridge phrase, a removed `userIntent`, or a non-alias `ownedSignals` flips exit 0 → non-zero | manual edit + re-run |
| Non-mutation | `mode-registry.json` unchanged; checker `node --check` clean | `git diff` / `node --check` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `command-metadata.json` (D2-R3 SSOT) | Internal | Green | the record set `userIntent`/`copyGuard` attach to; must exist with five records |
| `command-metadata.json` `aliases` (D2-R3) | Internal | Green | the reconciliation source — `ownedSignals` must be a subset |
| `design-command-surface-check.mjs` (D2-R3) | Internal | Green | the gate being extended; its Stage-1/Stage-2 structure is the host |
| `mode-registry.json` | Internal (read-only) | Green | mode alias/intent reference; never mutated here |
| `commands/design/*.md` | Internal (mutated body-only) | Green | the projection targets; frontmatter must stay frozen, prior sections preserved |
| Node ESM runtime | External | Green | checker host |

**Coupling note:** D2-R10 widens the frozen record contract by two additive, namespaced fields (`userIntent`, `copyGuard`) and adds one wrapper section. Sibling D2 phases that also project off this metadata (e.g. discriminator D2-R6, preconditions D2-R7, and the not-yet-built register D2-R8 / pipeline D2-R9 / interface-lanes D2-R11) are unaffected because no existing field changes shape and the new wrapper section only shifts the numbering of name-matched sections.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the intent-lead reframing proves brittle to generate, or the new checker rule produces false drift on conformant wrappers (e.g. the copyGuard scan leaks into the Internal binding section).
- **Procedure**: revert the three edits — remove `userIntent` + `copyGuard` from each record, restore the bridge-first lead + `## 1. PURPOSE` and remove the `## 2. INTERNAL BINDING` section in each wrapper (renumbering back), and revert the checker's Stage-1/Stage-2 additions. Because every change is additive and `mode-registry.json` is untouched, the revert returns the surface to the prior D2 state (`drift=0`).

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Extend SSOT) ──> Phase 2 (Reframe wrappers) ──┐
                      └──> Phase 3 (Extend checker) ────┴──> Phase 4 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Extend SSOT | None | Reframe wrappers, Extend checker |
| Reframe wrappers | Extend SSOT | Verify |
| Extend checker | Extend SSOT | Verify |
| Verify | Reframe wrappers, Extend checker | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Extend SSOT (5 userIntent + copyGuard objects) | Low | 45–60 minutes |
| Reframe wrapper leads + Internal binding (5 files) | Low–Medium | 1–1.5 hours |
| Extend checker (Stage 1 reconciliation + Stage 2 lead/copyGuard rules) | Medium | 1.5–2 hours |
| Verification | Low | 30–45 minutes |
| **Total** | | **~3.75–5 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] `mode-registry.json` sha captured before any work (proves non-mutation after)
- [x] Confirmed exactly three target paths change: `command-metadata.json`, the five wrappers, the checker
- [x] Wrapper frontmatter diff confirmed empty (only body lead + sections change) so existing drift stays 0
- [x] Prior D2 sections (sibling-discriminator, PRECONDITIONS, EMIT DELIVERABLE, Example) confirmed present before and after

### Rollback Procedure
1. Remove `userIntent` + `copyGuard` from each record in `command-metadata.json`
2. Restore the bridge-first lead line + `## 1. PURPOSE` and remove the `## 2. INTERNAL BINDING` section in each of the five wrappers; renumber `WHEN TO USE` / `PRECONDITIONS` / `INSTRUCTIONS` / `EMIT DELIVERABLE` / `Example` back to §2–§6
3. Revert the `REQUIRED_FIELDS` additions and the Stage-1/Stage-2 user-intent rules in the checker
4. Re-run `node design-command-surface-check.mjs` → `drift=0` (prior D2 baseline restored); confirm `mode-registry.json` sha matches pre-work capture

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: file edits only; no persisted state

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum
- Adds userIntent{job,ownedSignals} + copyGuard to command-metadata.json, reframes wrapper leads to the user job, relocates mode-binding to an Internal binding section, extends design-command-surface-check.mjs to require the intent lead and ban bridge-first phrases
- Strictly additive: mode-registry.json untouched, frontmatter frozen, prior D2 additions preserved, final surface-check drift=0
-->
