---
title: "Implementation Summary: D2-R12 — Promote high-value task verbs as command-visible projections"
description: "Every command-metadata.json record now carries a taskProjections array promoting eight transform verbs as advisory, globally-unique task projections of their owning mode, projected as a TASK PROJECTIONS wrapper section and guarded by a design-command-surface-check.mjs gate that enforces schema, ownerMode parity, advisory strictness, global verb uniqueness, command-creep rejection, and a mode-registry alias cross-check."
trigger_phrases:
  - "d2-r12 promote task verbs summary"
  - "design command task projections summary"
  - "transform verbs command surface summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/012-promote-task-verbs"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Promoted 8 verbs as advisory taskProjections; checker PASS invalid=0 drift=0; 7 files scoped"
    next_safe_action: "Regenerate description.json + graph-metadata.json to clear residual generated-metadata"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r12-promote-task-verbs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Strictness is a closed advisory enum enforced by the checker; the verbs are routing aids, not commands"
      - "The command-creep guard bans minting any verb as a /design:<verb> command; verbs route into their owning mode"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-promote-task-verbs |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
| **Enforcement class** | advisory (metadata SSOT + deterministic surface gate) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Eight high-value transform verbs that a user actually types — `typeset`, `colorize`, `bolder`, `quieter`, `distill`, `delight`, `harden`, `polish` — used to live buried in the design modes' `references/` and alias surfaces, invisible at the `/design:*` command surface and with nothing stopping one from being mistakenly minted into a new `/design:<verb>` command. Each verb is now a visible, advisory task projection of exactly one mode, and a deterministic gate keeps that promotion honest: every verb is globally unique, owned by a single mode, and provably barred from becoming a standalone command. The verbs are advisory routing aids, not new commands and not a taste claim.

### `taskProjections[]` on every command record

`command-metadata.json` gained a `taskProjections` array on all five records. Each entry carries `verb`, `ownerMode` (equal to the record's own `ownerMode`), `strictness: "advisory"`, a non-empty `referenceSources` array of durable skill-internal anchors, a `requires` string, and a named `fixtures` array. The eight verbs concentrate in three modes and the field stays uniform across all five records:

- **`/design:audit`** — `harden`, `polish`
- **`/design:foundations`** — `typeset`, `colorize`
- **`/design:interface`** — `bolder`, `quieter`, `distill`, `delight`
- **`/design:md-generator`** — `[]` (no transform verb projects onto it)
- **`/design:motion`** — `[]` (no transform verb projects onto it)

Every prior D2 field — `description`, `argumentHint`, `aliases`, `accepts`, `returns`, `examples`, `next`, `proofFields`, `deferToHubWhen`, `preconditions`, `discriminator`, `toolPolicy`, `outputContract` — is preserved untouched on each record.

### Projected `## TASK PROJECTIONS` section in all five wrappers

Each of the five `commands/design/*.md` wrappers gained a `## TASK PROJECTIONS` body section appended after its existing example section. For a mode that owns verbs (`audit`, `foundations`, `interface`), the section lists each owned verb with its advisory strictness; for `motion`/`md-generator` it states the empty-projection notice. Every section ends with a fixed negative-corpus guard line stating these verbs are task projections and never `/design:<verb>` commands. All prior sections and the wrapper frontmatter (`description`, `argument-hint`, `allowed-tools`) were preserved byte-for-byte, so the prior D2 frontmatter-drift gate stays green.

### Extended gate in `design-command-surface-check.mjs`

The checker was extended additively. `taskProjections` was added to `REQUIRED_FIELDS`, and `validateTaskProjections` enforces, in Stage 1: the array shape; each entry's `verb`/`ownerMode`/`requires` non-empty and `referenceSources`/`fixtures` non-empty arrays; `ownerMode` parity with the record and membership in the `workflowMode` set; `strictness` in the closed enum `{"advisory"}`; **global verb uniqueness** (a verb belongs to exactly one record across the whole metadata); and **command-creep rejection** (no verb may be minted as a `/design:<verb>` command). It also reads each mode's `aliases` from `mode-registry.json` and rejects a cross-mode alias collision (a verb owned by mode M must not be a whole-word alias of any other mode N). Stage 2 requires the `## TASK PROJECTIONS` section, each owned verb token, and the negative-corpus guard marker in every wrapper, reporting misses as drift `field: "taskProjections"`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/command-metadata.json` | Modified | Added a `taskProjections` array to each of the five records (eight advisory projections across audit/foundations/interface; empty for motion/md-generator); every prior field preserved |
| `.opencode/commands/design/audit.md` | Modified | Appended a `## TASK PROJECTIONS` section (harden, polish) + negative-corpus guard line; all prior sections + frontmatter preserved |
| `.opencode/commands/design/foundations.md` | Modified | Appended a `## TASK PROJECTIONS` section (typeset, colorize) + guard line; all prior sections + frontmatter preserved |
| `.opencode/commands/design/interface.md` | Modified | Appended a `## TASK PROJECTIONS` section (bolder, quieter, distill, delight) + guard line; all prior sections + frontmatter preserved |
| `.opencode/commands/design/md-generator.md` | Modified | Appended the empty-projection notice + guard line; all prior sections + frontmatter preserved |
| `.opencode/commands/design/motion.md` | Modified | Appended the empty-projection notice + guard line; all prior sections + frontmatter preserved |
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Modified | Added `taskProjections` to `REQUIRED_FIELDS` + `validateTaskProjections` (schema + ownerMode parity + advisory strictness + global verb uniqueness + command-creep rejection) + a mode-registry alias cross-mode collision check + a Stage-2 body rule |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The build ran SSOT-first: the `taskProjections` arrays landed in `command-metadata.json` before the wrapper sections and the checker rules, so Stage-1 validation could pass as soon as the gate arrived. The promotion was kept deliberately advisory — `strictness` is a closed enum the checker enforces — and the command-creep guard was added in the same pass so the surface can never mint a verb into a `/design:<verb>` command. `mode-registry.json` was read for alias reconciliation but never written.

The implementer (cli-codex gpt-5.5 xhigh fast) edited exactly seven scope-locked files and the orchestrator verified acceptance independently. `node design-command-surface-check.mjs` returns `STATUS=PASS invalid=0 drift=0` (exit 0) with `taskProjections` plus every prior D2 field green; the five wrappers carry the `## TASK PROJECTIONS` section (5/5); `command-metadata.json` parses as valid JSON; `node --check` passes on the checker; and `mode-registry.json` is byte-unchanged. The gate was confirmed to bite with a synthetic break — a duplicate verb across two records flips the checker to `STATUS=INVALID` "taskProjections[0].verb typeset is already owned by /design:audit" (`invalid=1`) — and restoring returns it to `invalid=0 drift=0`. Every change is additive; scope held to exactly seven files.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Promote the verbs as advisory task projections, not new modes or commands | The verbs are the action words users type; surfacing them as projections of an owning mode keeps the surface legible without fracturing it into eight thin commands |
| Enforce `strictness` as a closed `{"advisory"}` enum in the checker | An advisory projection is a routing aid, not an authority or taste claim; making the checker reject any non-advisory value keeps that promise machine-checked, not just authored once |
| Add a global verb-uniqueness + command-creep guard | A verb must belong to exactly one mode and must never become a `/design:<verb>` command; the guard fails a duplicate verb or a minted verb-command so the rule is enforced at the source, not in prose |
| Read `mode-registry.json` aliases to reconcile, never mutate it | A verb owned by one mode must not collide with another mode's alias; the cross-read catches routing collisions while keeping the registry read-only |
| Keep every record carrying the field (empty for motion/md-generator) | A uniform `taskProjections` field across all five records keeps the SSOT schema regular and makes a missing field a clear Stage-1 failure |
| Scope to the spec's eight sub-mode transform verbs only | The brief's `audit`/`design`/`animate`/`extract` are mode-level verbs already covered by the five commands and registry aliases; promoting them would duplicate the existing surface |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node design-command-surface-check.mjs` | PASS `STATUS=PASS invalid=0 drift=0` (exit 0); `taskProjections` + all prior D2 fields green |
| `taskProjections` schema | 8 entries across 5 records, each with non-empty `verb`/`ownerMode`/`requires` and non-empty `referenceSources`/`fixtures` |
| ownerMode parity + workflowMode membership | every `ownerMode` equals the record's `ownerMode` and is in the workflowMode set (audit, foundations, interface, md-generator, motion) |
| `strictness` enum | every entry is `"advisory"`; a non-advisory value is rejected (exit 2) |
| Global verb uniqueness | the eight verbs each appear in exactly one record's `taskProjections` |
| Command-creep / negative corpus | no `/design:<verb>` exists; minting one is rejected (exit 2) |
| Alias reconciliation | no projected verb collides with another mode's `mode-registry.json` aliases |
| TASK PROJECTIONS sections | all five wrappers carry the section (5/5) with owned verbs (or empty notice) + the `Negative corpus:` guard line |
| Synthetic break (orchestrator-verified) | a duplicate verb across two records → `STATUS=INVALID` "taskProjections[0].verb typeset is already owned by /design:audit" (`invalid=1`); restoring → `invalid=0 drift=0` |
| No-regression | all prior D2 fields (argumentHint/examples/outputContract/discriminator/preconditions/toolPolicy) + frontmatter drift stay green; overall `drift=0` |
| `node --check` on checker | PASS (valid ESM) |
| `command-metadata.json` JSON parse | PASS (5 records) |
| Non-mutation | `git status`: `mode-registry.json` byte-unchanged |
| Scope | `git status`: exactly 7 files changed (metadata, 5 wrappers, checker) |

### Test Coverage Summary

| Surface | Channel | Status |
|---------|---------|--------|
| `taskProjections` schema + ownerMode parity + advisory enum + global verb uniqueness + command-creep | Stage 1 `validateTaskProjections` | PASS |
| Cross-mode alias collision against `mode-registry.json` | Stage 1 alias reconciliation | PASS |
| TASK PROJECTIONS section + owned verb tokens + guard line | Stage 2 body rule | PASS |
| Prior D2 (toolPolicy/argumentHint/SSOT/examples/contract/discriminator/preconditions) | full run | PASS, intact |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Residual generated-metadata errors are expected.** Strict `validate.sh` reports `GENERATED_METADATA_INTEGRITY` violations because `description.json` still records `level "1"` and the source fingerprint predates this Level 2 upgrade; the orchestrator regenerates `description.json` and `graph-metadata.json` via `generate-context.js`. They are not hand-written here.
2. **Strictness is machine-guarded for shape, not for taste.** The checker proves each verb is advisory, globally unique, owned by one mode, and never minted as a command. It does not judge whether a given verb's authored `ownerMode` is the semantically best fit; that mapping was authored against the modes' reference lanes and is a deterministic command-surface contract, not a design-taste claim.
3. **`fixtures` are named identifiers, not files.** No sk-design gold corpus exists yet (separate D3 work), so the `fixtures` entries are named identifiers a future corpus will consume (e.g. `typeset.positive`, `typeset.negative.mint-command`), not file paths.
<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification addendum
- Post-implementation: taskProjections[] (eight advisory transform verbs by ownerMode) + TASK PROJECTIONS wrapper sections + Stage-1/Stage-2 gate with global verb uniqueness + command-creep rejection + mode-registry alias cross-check
- Strictly additive; mode-registry untouched; frontmatter frozen; all prior D2 additions preserved; final surface-check invalid=0 drift=0
-->
