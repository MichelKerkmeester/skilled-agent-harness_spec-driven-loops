---
title: "Implementation Summary: sk-design mode consolidation"
description: "Evidence record for the four-mode/three-command sk-design hub after ADR-002 retired /interface:audit and /interface:foundations entirely, superseding the original permanent-subworkflow plan."
trigger_phrases:
  - "sk-design consolidation summary"
  - "four design mode implementation evidence"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/006-design-mode-consolidation"
    last_updated_at: "2026-07-27T07:52:44.000Z"
    last_updated_by: "claude"
    recent_action: "Superseded NFR-S01 by ADR-002; corrected checklist.md frontmatter description"
    next_safe_action: "Orchestrator runs validate.sh --strict, styles SHA-256 equality, and the design benchmark suite"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/mode-registry.json"
      - ".opencode/skills/sk-design/hub-router.json"
      - ".opencode/skills/sk-design/command-metadata.json"
      - ".opencode/skills/sk-design/design-interface/SKILL.md"
      - ".opencode/skills/sk-design/design-interface/assets/interface-preflight-card.md"
      - ".opencode/commands/doctor/scripts/parent-skill-check.cjs"
    completion_pct: 80
    open_questions: []
    answered_questions:
      - "Foundations and audit are retired entirely (ADR-002 supersedes ADR-001), not preserved as permanent interface-owned command subworkflows."
      - "The styles package remains in place; final byte-identity comparison has not run."
---
# Implementation Summary: sk-design Mode Consolidation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-design-mode-consolidation |
| **Status** | In Progress |
| **Started** | 2026-07-26 |
| **Completed** | Pending |
| **Level** | 3 |
| **Branch** | `skilled/v4.0.0.0` |
| **Current Stage** | Retirement outcome (ADR-002) shipped and verified for command/corpus/checker gates; styles equality, design benchmark, and `validate.sh --strict` remain to run |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:exec-summary -->
## Executive Summary

**This packet's scope changed after the original plan (ADR-001) was written and partially attempted.** ADR-001 planned to keep `/interface:foundations` and `/interface:audit` permanent by embedding them beneath `design-interface` via a new `commandSubworkflows` array. That design turned out to violate the create-skill parent-hub doctrine's rule that every packet is one entry in `modes[]` — a second ownership array is not allowed. **ADR-002 supersedes ADR-001**: the operator retired both commands entirely rather than extract audit as a standalone skill (the canonical research's original ranked recommendation).

The authored `sk-design` topology now has the four registered modes (`interface`, `motion`, `md-generator`, `design-mcp-open-design`) and three commands (`/interface:design`, `/interface:motion`, `/interface:design-reference`). The audit surface (70 files / 6,202 lines) and two dead AI-fingerprint parity scripts (915 lines) are deleted. Foundations is flattened into `design-interface/` — its `contract.md`/`README.md`/`changelog/` were deleted rather than preserved, while its procedures, corpus, and scripts moved flat into `design-interface/`. Seven load-bearing anti-slop checks are folded into `design-interface/assets/interface-preflight-card.md` section 11; no scoring/severity apparatus was carried over. `shared/procedures/polish-gate-orchestration.md` was rewritten (not deleted) for its five live consumers, six unfixable playbook scenarios were deleted, and a pre-existing dangling `command-metadata.json` reference was fixed.

Command-contract, command-surface, corpus, and parent-hub gates all pass at the final topology (see Verification below). **Three gates have not been run and must not be claimed as passing**: the design benchmark suite, the final styles SHA-256 equality check against the frozen `scratch/styles.sha256.before` baseline, and `validate.sh --strict` — the orchestrator runs that last one after this reconciliation pass.
<!-- /ANCHOR:exec-summary -->

<!-- ANCHOR:what-built -->
## What Was Built

### Four-Mode Registry, Three Commands, No Subworkflow Layer

`mode-registry.json` registers exactly `interface`, `motion`, `md-generator`, and `design-mcp-open-design`. The `commandSubworkflows` array, `extensions["command-subworkflows"]`, `commandSubworkflowSignals`, `canonicalBySubworkflow`, `commandSubworkflowBundles`, and `transformVerbRouting.excludedAliases` — the entire ownership layer ADR-001 planned to add — are deleted instead. Three commands remain: `/interface:design`, `/interface:motion`, `/interface:design-reference`. `design-command-surface-check.mjs` confirms the final state: `commands=3 aliases=9 invalid=0 drift=0` (baseline was `commands=5 aliases=15 invalid=0 drift=0`).

### Audit Surface Deleted

The former audit peer tree — `design-interface/audit/`, `assets/audit/`, `references/audit/` — is deleted outright: 70 files, 6,202 lines. Its severity model, scoring dimensions, reports, and comparison corpus are gone with it; this is an accepted cost of ADR-002, not a regression to chase. The two AI-fingerprint parity scripts (`ai-fingerprint-registry-check.mjs`, 383 lines; `ai-fingerprint-fixture-check.mjs`, 532 lines) are deleted as dead code with no other consumer.

Seven binary anti-slop checks judged load-bearing are folded into `design-interface/assets/interface-preflight-card.md` section 11 (204 -> 211 lines). No scoring or severity apparatus was carried over.

### Foundations Flattened, Not Relocated

`design-interface/foundations/` no longer exists as a subtree. Its `contract.md`, `README.md`, and `changelog/` (judged packet-mimicking ceremony) are deleted rather than preserved. `procedures/` (3 cards), `corpus/`, and `scripts/` (3 Python checkers) moved flat into `design-interface/`, with references and assets now at `design-interface/references/foundations/` and `assets/foundations/`. A new `VISUAL_SYSTEM` intent signal was added to `design-interface/SKILL.md` INTENT_SIGNALS + RESOURCE_MAP, with a matching `visual-system` task lane in `command-metadata.json` and `commands/interface/design.md`, so the inherited foundations resources stay reachable from `/interface:design`.

### Downstream Consumers Repaired, Not Extended

`shared/procedures/polish-gate-orchestration.md` was rewritten (not deleted) around the interface preflight card because five live consumers still reference it. Six playbook scenarios that assumed live audit/foundations routing targets were deleted as unfixable: `mode-routing/audit-mode.md`, `transform-verb-framing/should-it-be-audit.md`, `parity-behavior/shared-polish-gate-selection-proof.md`, `parity-behavior/audit-procedure-selection-proof.md`, `transform-verb-framing/foundations-excluded-aliases.md`, `transform-verb-framing/audit-excluded-aliases.md`. A pre-existing dangling reference in `command-metadata.json` — pointing at a `design-audit/references/transform-remediation.md` directory that never existed — was fixed as a byproduct.

### Frozen Baseline Evidence

Packet-local `scratch/` contains the pre-change foundations inventory (48 files), audit inventory (70 files), a full 7,812-row styles SHA-256 manifest, a routing hash snapshot, and the pre-change benchmark run. These preserve rollback and baseline-comparison capability without modifying the frozen styles package.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The session first captured baselines: foundations/audit file inventories, source hashes, the 7,812-row styles manifest, and focused package/command/corpus/checker baselines. Implementing ADR-001's `commandSubworkflows` design against the create-skill parent-hub doctrine surfaced the one-entry-per-packet conflict described above; the operator then chose retirement (ADR-002) over standalone-skill extraction.

Delivery under ADR-002 deleted the audit surface and the two dead fingerprint parity scripts, flattened foundations into `design-interface/` without preserving its contract/README/changelog, folded the load-bearing anti-slop checks into the interface preflight card, rewrote the polish-gate procedure for its live consumers, deleted the now-unfixable playbook scenarios, contracted the registry to four modes and three commands, and fixed the pre-existing dangling command-metadata reference along the way.

Command-contract, command-surface, corpus, and parent-hub gates were rerun at the final topology and are green (see Verification). **Not run in this delivery**: the design benchmark suite, the final styles SHA-256 equality comparison, and `validate.sh --strict` — these are the orchestrator's next steps after this documentation reconciliation.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Retire `/interface:audit` and `/interface:foundations` entirely (ADR-002, supersedes ADR-001) | `commandSubworkflows` violated the create-skill one-entry-per-packet doctrine rule; embedding was not implementable as designed |
| Do not extract audit as a standalone skill (research recommendation 3, reconsidered and rejected again) | Avoids reopening a second advisor identity question ADR-001 had already closed |
| Fold 7 anti-slop checks into the interface preflight card, drop the scoring apparatus | Keeps the checks with real evidence value; does not maintain unused severity/reporting ceremony |
| Delete foundations' `contract.md`/`README.md`/`changelog/` rather than preserve them | Judged packet-mimicking ceremony once foundations was no longer a subworkflow identity |
| Styles remain byte-unchanged | Bounds blast radius; baseline captured, final equality still pending |
| Historical reports stay historical | Old paths in benchmark reports, changelogs, and before-snapshots remain valid evidence, not live routing defects |

See `decision-record.md` for full context, including ADR-001 (Superseded by ADR-002) and ADR-002 (Accepted) with their alternatives.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

This is the authoritative gate-evidence table for this packet. Every claim below is either a baseline -> final pair that was actually run, or explicitly marked NOT run. Nothing here is inferred.

| Gate | Baseline | Final |
|---|---|---|
| `interface-command-contract.test.mjs` | 8 pass / 0 fail | 8 pass / 0 fail |
| `design-command-surface-check.test.mjs` | 7 pass / 0 fail | 7 pass / 0 fail |
| `design-command-surface-check.mjs` | `commands=5 aliases=15 invalid=0 drift=0` | `commands=3 aliases=9 invalid=0 drift=0` |
| `parent-skill-check.cjs` | `OK — 0 warnings` | `OK — 0 warnings` |
| Corpus tests (interface + motion) | — | 70 passing, 0 failing |
| Live `design-audit/`/`design-foundations/` references | 152 | 0 |

**Explicitly NOT run** — these must not be claimed as passing anywhere in this packet:
- The design benchmark suite.
- `styles/` SHA-256 equality against the frozen `scratch/styles.sha256.before` (7,812-row baseline).
- `validate.sh --strict` — the orchestrator runs this after this reconciliation pass.

Baseline capture (recorded before any change, in `scratch/`): `foundations-files.before.txt` (48 files), `audit-files.before.txt` (70 files), `styles.sha256.before` (7,812 rows), `routing.sha256.before`, `benchmark-before/`.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:remaining-work -->
## Remaining Work

1. **Styles equality** — compare the 7,812-row `scratch/styles.sha256.before` manifest against a fresh post-change manifest, byte-for-byte.
2. **Design benchmark suite** — run it fresh against the four-mode/three-command topology; the pre-change route gold encoded the retired six-mode/subworkflow model and is no longer a valid comparison baseline.
3. **`validate.sh --strict`** — run against this packet after this documentation reconciliation (orchestrator-owned next step).

This packet's spec-folder documents (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, this summary, `handover.md`) are reconciled to the ADR-002 outcome as of this pass. Advisor/graph metadata (`description.json`, `graph-metadata.json`) and any compiled-routing regeneration are out of scope for this documentation-accuracy pass and were not touched.
<!-- /ANCHOR:remaining-work -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The final styles invariant is not yet proven.** The 7,812-row baseline exists and no styles edit was intended, but completion requires a fresh post-change manifest comparison.
2. **The design benchmark suite has not been rerun.** Any pre-change route gold that encoded the retired six-mode/subworkflow model is stale and must not be reused as-is.
3. **`validate.sh --strict` has not run against this packet.** This is the orchestrator's next step after this documentation reconciliation.
4. **Retirement is an accepted capability loss, not a defect.** Any workflow that depended on standalone audit scoring, reports, or the foundations command has no replacement surface — this is the intended outcome of ADR-002, not something to "fix."
5. **The worktree may still contain unrelated concurrent changes.** No broad restore operation is safe; only this packet's paths were touched in this documentation pass.
<!-- /ANCHOR:limitations -->

<!-- ANCHOR:risks-realized -->
## Risks Realized

| Risk | Occurred | Impact | Response |
|------|----------|--------|----------|
| `commandSubworkflows` design violates create-skill doctrine | Yes | ADR-001's embed-and-preserve plan was not implementable as designed | Resolved via ADR-002 retirement rather than a workaround |
| Audit review capability is lost entirely | Yes (accepted) | Standalone scoring/reports/corpus no longer exist | 7 anti-slop checks folded into the interface preflight card instead |
| Historical old paths create false-positive migration scope | Yes | Grep across all historical reports would overflow a single record | Path-scoped searches distinguish live defects (152 -> 0) from legitimate history |
| Styles content changes during the change | Not observed | Completion proof still pending | Styles left untouched; final 7,812-row manifest comparison still to run |
<!-- /ANCHOR:risks-realized -->

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Embed foundations and audit as permanent `interface` command subworkflows (ADR-001) | Retired both entirely (ADR-002) | `commandSubworkflows` violated the create-skill one-entry-per-packet doctrine rule |
| Relocate foundations/audit trees with 112-file accounting, preserving README/changelog/contract.md | Audit surface deleted (70 files/6,202 lines); foundations flattened with contract.md/README.md/changelog/ deleted, not preserved | Once retired, there was no subworkflow identity left to justify preserving those ceremony files |
| Preserve audit scoring, reports, fingerprints as an independently invocable gate | 7 binary anti-slop checks folded into the interface preflight card; scoring apparatus not carried over | The scoring apparatus only made sense for a standalone audit workflow, which no longer exists |
| Run final benchmark immediately after registry contraction | Deferred — NOT run in this pass | Pre-change route gold encoded the retired topology and needs a fresh baseline, not a rerun against stale gold |
<!-- /ANCHOR:deviations -->

<!-- ANCHOR:follow-up -->
## Follow-Up Items

- [x] Reconcile spec, plan, tasks, checklist, decision-record, and this summary to the ADR-002 outcome without marking unrun gates complete (this pass, 2026-07-27).
- [ ] Prove final styles SHA-256 equality across all 7,812 tracked paths.
- [ ] Run the design benchmark suite fresh against the four-mode/three-command topology.
- [ ] Run `validate.sh --strict` (orchestrator-owned next step).
<!-- /ANCHOR:follow-up -->
