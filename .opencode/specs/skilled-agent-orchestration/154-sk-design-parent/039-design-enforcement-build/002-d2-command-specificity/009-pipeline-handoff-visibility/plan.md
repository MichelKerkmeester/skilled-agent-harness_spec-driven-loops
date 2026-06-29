---
title: "Implementation Plan: D2-R9 — Pipeline & handoff visibility across the /design:* surface"
description: "planning. Add pipeline{stage,acceptsFrom,produces,nextCommands,proofRequired} to command-metadata.json, generate a Pipeline & Handoff section + PRODUCES/NEXT/PROOF status tail in the five wrappers, and extend design-command-surface-check.mjs to enforce a fully-declared, recommend-only pipeline graph reconciled with next — all additive, drift stays 0."
trigger_phrases:
  - "d2-r9 pipeline handoff plan"
  - "design command pipeline visibility plan"
  - "design build handoff plan"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/009-pipeline-handoff-visibility"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Built D2-R9; checker PASS invalid=0 drift=0; 7 files scoped; plan marked complete"
    next_safe_action: "Regenerate description.json + graph-metadata.json to clear residual generated-metadata"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r9-pipeline-handoff-visibility"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Recommend-only enforced positively (marker + bidirectional graph) instead of a phrase ban"
---
# Implementation Plan: D2-R9 — Pipeline & handoff visibility across the /design:* surface

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
| **Inputs (read-only)** | `sk-design/mode-registry.json` (workflowMode source); `sk-design/shared/sk_code_handoff.md` (the build-handoff card the pipeline terminates into); research §5 (D2-R9) for the pipeline shape |
| **Mutated artifacts** | `sk-design/command-metadata.json`; `.opencode/commands/design/{audit,foundations,interface,md-generator,motion}.md`; `sk-design/shared/scripts/design-command-surface-check.mjs` |
| **Validation** | `node design-command-surface-check.mjs` — additive pipeline gate; `node --check` on the edited checker |

### Overview
D2-R9 makes the design pipeline legible at the command layer: each of the five `/design:*` commands states its **place** in the flow `md-generator → interface/foundations → motion → audit → sk-code` — what it accepts upstream, what it produces, what it recommends next, and how its decision hands to build. Today the wrappers expose no pipeline projection; the flow lives only in routing data and child packets, so it is invisible where a user actually invokes a command. The change is a three-part, strictly **additive** extension of the surface SSOT built in D2-R3:

1. **Metadata** — add a `pipeline{ stage, acceptsFrom, produces, nextCommands, proofRequired }` object to each of the five records in `command-metadata.json`.
2. **Wrappers** — generate a `Pipeline & Handoff` section from that metadata in each of the five `commands/design/*.md` files (naming the stage, upstream sources, produced artifact, the recommend-only next commands, and the `sk-code` build-handoff card), and upgrade the success status tail to `STATUS=OK PRODUCES=<artifact> NEXT=<recommended-commands> PROOF=<proof-fields>`.
3. **Checker** — extend `design-command-surface-check.mjs` to (a) require `pipeline` and its sub-fields in every record, (b) reconcile the pipeline against the existing fields (`nextCommands ⊆ next`, `produces == outputContract.primaryArtifactName`, `proofRequired == proofFields`), (c) enforce a **fully-declared, internally-consistent graph** (`acceptsFrom` is the exact inverse of the other records' `nextCommands`, so no handoff edge is invisible at either end and stages are unique), and (d) fail any wrapper missing the Pipeline & Handoff section, the `sk-code` handoff line, the recommend-only marker, or the `PRODUCES=/NEXT=/PROOF=` status tail.

The pipeline strings reconcile with fields already in the SSOT: `produces` mirrors each record's `outputContract.primaryArtifactName`, `proofRequired` mirrors its `proofFields`, and **`nextCommands` reconciles with the existing `next` field** (every entry must be in `next`). The work is no-regression: `mode-registry.json` is never touched, the existing drift fields (`description`, `argument-hint`, `allowed-tools`) stay matched because wrapper **frontmatter is frozen** (only the body gains a section and the OK tail is upgraded), and the final surface-check state is `invalid=0 drift=0`. All prior D2 additions (arg grammar, examples, output contract, sibling discriminator, preconditions) are preserved.

**Recommend-only is the load-bearing invariant.** `nextCommands` are surfaced as a `NEXT=` recommendation in the status tail and as a recommend-only line in the wrapper; no command auto-invokes its successor. The checker confirms this positively (required `Recommend-only:` marker + `NEXT=` recommendation grammar) and structurally (the pipeline graph is declared on both ends, so there is no hidden chain), rather than by a brittle phrase ban that would false-positive on the section's own negative assertions.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] D2-R9 framing confirmed from spec.md + research §5: each command makes its pipeline place visible (accepts/produces/next + build handoff); status tail carries PRODUCES/NEXT/PROOF; recommend-only, never silent chain
- [x] The five SSOT records exist (D2-R3..D2-R7 landed) and currently pass the surface-check at `invalid=0 drift=0` — additive baseline confirmed
- [x] Per-command pipeline values drafted and reconciled with each record's existing `next` (nextCommands ⊆ next), `outputContract.primaryArtifactName` (produces), and `proofFields` (proofRequired)
- [x] The pipeline graph confirmed internally consistent: `acceptsFrom` is the exact inverse of the other records' `nextCommands`; `md-generator` is the origin (empty `acceptsFrom`); five distinct stage labels
- [x] Scope frozen: `command-metadata.json` (add `pipeline`), the five wrappers (add one body section + upgrade the OK tail only), and the checker — nothing else

### Definition of Done
- [x] Each record carries `pipeline` with valid sub-fields; metadata still validates (`invalid=0`)
- [x] `nextCommands ⊆ next`, `produces == outputContract.primaryArtifactName`, `proofRequired == proofFields`, and `acceptsFrom == inverse(nextCommands)` hold for all five records (reconciliation with `next` is enforced, not just asserted)
- [x] Each wrapper carries the generated `Pipeline & Handoff` section (stage, accepts-from, produces, recommend-only next commands, `sk-code` build-handoff card) and a `STATUS=OK PRODUCES=<artifact> NEXT=<commands> PROOF=<fields>` tail
- [x] `node design-command-surface-check.mjs` passes additively: existing drift still `0` AND the new pipeline gate passes → overall `invalid=0 drift=0`, exit 0
- [x] Synthetic breaks flag: removing `pipeline`, listing a `nextCommands` entry not in `next`, breaking the `acceptsFrom` inverse, dropping the `sk-code` handoff line, or removing the recommend-only marker each flips the checker to a non-zero exit
- [x] `node --check` passes on the edited checker; `mode-registry.json` is byte-unchanged
- [x] No spec/packet/phase ID or spec-folder path appears in the metadata, the wrappers, or the checker (evergreen [HARD])

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
SSOT projection + stateless drift-gate, extended with a cross-record graph reconciliation. The metadata stays the single source of truth; the wrappers are generated projections of it; the checker is a deterministic, exit-coded validator that reads (never writes) the wrappers and the registry. D2-R9 adds one nested object to the record schema, the first **cross-record consistency rule** (the pipeline graph), and a second body-content assertion to the checker (after the D2-R7 preconditions body rule).

### Key Components
- **`command-metadata.json`** — gains a `pipeline` object per record (five records, one per `/design:*` command).
- **Pipeline sub-schema** — `stage` (string), `acceptsFrom` (string array of `/design:*` commands), `produces` (string), `nextCommands` (non-empty string array of `/design:*` commands), `proofRequired` (non-empty string array).
- **Wrapper Pipeline & Handoff section** — a generated `## 6. PIPELINE & HANDOFF` block projecting the pipeline, with the existing `## 6. EXAMPLE` renumbered to `## 7. EXAMPLE`. (Current wrapper layout: §1 PURPOSE, §2 WHEN TO USE / sibling-discriminator, §3 PRECONDITIONS, §4 INSTRUCTIONS, §5 EMIT DELIVERABLE, §6 EXAMPLE → §7.)
- **Wrapper status tail** — the INSTRUCTIONS Return-Status success line becomes `STATUS=OK PRODUCES=<artifact> NEXT=<recommended-commands> PROOF=<proof-fields>` (the `STATUS=OK` substring still present, so the D2-R7 token check is unaffected).
- **`design-command-surface-check.mjs`** — gains `pipeline` in `REQUIRED_FIELDS` and `DRIFT_FIELDS`, a Stage-1 sub-field + reconciliation rule, a Stage-1 cross-record graph rule, and a Stage-2 wrapper-body rule.
- **`mode-registry.json`** — read-only `workflowMode` source; identity-only; never mutated.
- **`shared/sk_code_handoff.md`** — read-only; the durable build-handoff card the pipeline terminates into. The wrapper section references it as the `sk-code` boundary; the file itself is not modified.

#### Per-command pipeline content (authored, reconciled with each record's `next` / `outputContract.primaryArtifactName` / `proofFields`)

| command | stage | acceptsFrom | produces | nextCommands (⊆ next) | proofRequired |
|---------|-------|-------------|----------|------------------------|---------------|
| `/design:md-generator` | `extract` | *(none — pipeline origin)* | `Style Reference DESIGN.md` | `/design:foundations`, `/design:interface`, `/design:audit` | `sourceUrl`, `extractedTokensDigest`, `fidelityScore` |
| `/design:interface` | `direction` | `/design:audit`, `/design:foundations`, `/design:md-generator`, `/design:motion` | `Interface Direction Spec` | `/design:foundations`, `/design:motion`, `/design:audit` | `target`, `register`, `designDials`, `preflightResult` |
| `/design:foundations` | `system` | `/design:audit`, `/design:interface`, `/design:md-generator`, `/design:motion` | `Visual System Foundations Plan` | `/design:interface`, `/design:motion`, `/design:audit` | `axis`, `target`, `tokenDecisions`, `contrastEvidence` |
| `/design:motion` | `behavior` | `/design:audit`, `/design:foundations`, `/design:interface` | `Motion Design Spec` | `/design:interface`, `/design:foundations`, `/design:audit` | `componentState`, `motionPurpose`, `timingModel`, `reducedMotionPath` |
| `/design:audit` | `review` | `/design:foundations`, `/design:interface`, `/design:md-generator`, `/design:motion` | `Design Quality Audit Report` | `/design:foundations`, `/design:interface`, `/design:motion` | `target`, `evidenceInventory`, `severityFindings`, `qualityScore` |

These are authored values, not free invention: `produces` equals each record's existing `outputContract.primaryArtifactName`; `proofRequired` equals its `proofFields`; **`nextCommands` is a subset of its existing `next`** (here equal to `next`); and `acceptsFrom` is the **exact inverse** of the other records' `nextCommands` — i.e. `A.acceptsFrom = { B : A ∈ B.nextCommands }`, which makes `md-generator` the origin (no upstream command) and every handoff edge declared at both ends. Stage labels are five distinct nouns naming each command's place. The reconciliation is verified by the checker deterministically.

#### Record shape (worked example — `md-generator`, the pipeline origin)
```json
{
  "command": "/design:md-generator",
  "ownerMode": "md-generator",
  "next": ["/design:foundations", "/design:interface", "/design:audit"],
  "proofFields": ["sourceUrl", "extractedTokensDigest", "fidelityScore"],
  "outputContract": { "primaryArtifactName": "Style Reference DESIGN.md" },
  "pipeline": {
    "stage": "extract",
    "acceptsFrom": [],
    "produces": "Style Reference DESIGN.md",
    "nextCommands": ["/design:foundations", "/design:interface", "/design:audit"],
    "proofRequired": ["sourceUrl", "extractedTokensDigest", "fidelityScore"]
  }
}
```
(All other fields — `description`, `argumentHint`, `aliases`, `accepts`, `returns`, `deferToHubWhen`, `preconditions`, `discriminator`, `toolPolicy`, `outputContract.*` — are unchanged from prior D2 stages.)

#### Generated wrapper section (projected from `pipeline`; EXAMPLE renumbers §6 → §7)
```
## 6. PIPELINE & HANDOFF

- **Stage:** extract — the pipeline origin (md-generator -> interface/foundations -> motion -> audit -> sk-code).
- **Accepts from:** a live source URL; this stage has no upstream design command.
- **Produces:** Style Reference DESIGN.md, carrying sourceUrl, extractedTokensDigest, fidelityScore.
- **Hands to next (recommend-only):** /design:foundations, /design:interface, /design:audit -- emitted as NEXT=, never auto-invoked.
- **Hands to build:** when the design decision moves to implementation, hand off to sk-code via the shared sk-code handoff card (.opencode/skills/sk-design/shared/sk_code_handoff.md).
- **Recommend-only:** this command never silently chains; the user or the sk-design hub chooses the next step.
```
And the INSTRUCTIONS Return-Status success line is upgraded (the `STATUS=OK` substring is preserved):
```
- Success: `STATUS=OK PRODUCES=<artifact> NEXT=<recommended-commands> PROOF=<proof-fields>`
```

#### Checker rules (additive FAIL conditions)
Stage 1 — metadata validation (any violation → exit 2, INVALID):
1. `pipeline` is added to `REQUIRED_FIELDS`; a record missing it fails.
2. `pipeline` must be an object whose sub-fields validate: `stage` non-empty string; `acceptsFrom` a string array of known `/design:*` commands (no self-reference); `produces` non-empty string; `nextCommands` a **non-empty** string array of known commands (no self-reference); `proofRequired` a non-empty string array.
3. Reconciliation with existing fields: `nextCommands` ⊆ `next`; `produces == outputContract.primaryArtifactName`; `proofRequired` set-equal `proofFields`.
4. Cross-record graph rule: for every record `A`, `A.pipeline.acceptsFrom` must equal `{ B.command : A.command ∈ B.pipeline.nextCommands }` (exact inverse — no dangling or invisible handoff edge), and the five `stage` labels must be unique.

Stage 2 — surface drift (any drift → exit 1, DRIFT):
5. Each wrapper body must contain a `## <n>. PIPELINE & HANDOFF` section with the markers `Stage:`, `Accepts from:`, `Produces:`, `Hands to next`, `Hands to build:`, `Recommend-only:`.
6. The section must reference every `nextCommands` entry (token presence) and an `sk-code` build-handoff line (presence of `sk-code`, mirroring the discriminator hub-line check).
7. The wrapper must contain the upgraded status tail tokens `PRODUCES=`, `NEXT=`, and `PROOF=`. A missing section, marker, command token, `sk-code` line, or status tail is reported as a drift entry with `field: "pipeline"`.

The existing rules (frontmatter drift, `ownerMode ∈ workflowMode`, alias-uniqueness, examples, output contract, discriminator, preconditions) are unchanged. PASS (exit 0) holds only when metadata is valid AND the pipeline reconciles with `next`/contract/proof AND the graph is fully declared AND zero frontmatter drift AND every wrapper carries a conformant Pipeline & Handoff section and status tail.

### Data Flow
1. Checker resolves `command-metadata.json`, `mode-registry.json`, and the five wrapper paths from `import.meta.url` (no hardcoded absolute or spec paths) — unchanged.
2. Stage 1 validates each record (now including `pipeline` sub-fields + reconciliation) and then runs the cross-record graph rule over the whole array.
3. Stage 2 parses each wrapper's frontmatter (existing drift) AND scans the body for the Pipeline & Handoff markers, the `nextCommands` tokens, the `sk-code` line, and the `PRODUCES=/NEXT=/PROOF=` tail.
4. Emits the existing deterministic, sorted, per-command report plus any `pipeline` drift entries; sets the exit code.

#### Expected build ordering
Add `pipeline` to the metadata first (Stage 1 must stay valid — the graph rule needs all five `nextCommands` present at once, so author all five records before re-running). If the checker's Stage-2 body rule lands before the wrappers carry the section, it will transiently report `pipeline` drift on all five — the correct mid-build state, identical to the D2-R3/D2-R7 pattern. Generating the wrapper sections clears it back to `drift=0`.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Extend the SSOT (`command-metadata.json`)
- [x] Add a `pipeline` object with the five sub-fields to each of the five records, using the authored §3 table
- [x] Reconcile each record: `nextCommands ⊆ next`, `produces == outputContract.primaryArtifactName`, `proofRequired == proofFields`
- [x] Confirm the graph is the exact inverse (`acceptsFrom = inverse(nextCommands)`), `md-generator` has empty `acceptsFrom`, and the five `stage` labels are distinct
- [x] Confirm valid JSON, five records, no embedded IDs/paths (evergreen [HARD])

### Phase 2: Generate the wrapper sections (`commands/design/*.md`)
- [x] Insert the generated `## 6. PIPELINE & HANDOFF` block in each wrapper, projected from its `pipeline`; renumber `## 6. EXAMPLE` to `## 7. EXAMPLE`
- [x] Upgrade each Return-Status success line to `STATUS=OK PRODUCES=<artifact> NEXT=<commands> PROOF=<fields>`
- [x] Reference the `sk-code` build-handoff card and the recommend-only line in every section; never an imperative auto-chain
- [x] Keep wrapper frontmatter (`description`, `argument-hint`, `allowed-tools`) byte-frozen so existing drift stays 0

### Phase 3: Extend the checker (`design-command-surface-check.mjs`)
- [x] Add `pipeline` to `REQUIRED_FIELDS` and `DRIFT_FIELDS`; add a `validatePipeline` Stage-1 rule (sub-field validity + `nextCommands ⊆ next` + `produces`/`proofRequired` reconciliation) → exit 2
- [x] Add the cross-record `validatePipelineGraph` rule (`acceptsFrom == inverse(nextCommands)` + unique stages) → exit 2
- [x] Add the Stage-2 `expectedPipelineDrift` rule (`extractPipelineSection`, marker presence, `nextCommands` tokens, `sk-code` handoff line, `PRODUCES=/NEXT=/PROOF=` tail) → exit 1, drift `field: "pipeline"`
- [x] Run `node --check`; confirm no spec/packet/phase ID or path is embedded (evergreen [HARD])

### Phase 4: Verification
- [x] Run `node design-command-surface-check.mjs` → `invalid=0`, `drift=0`, exit 0 (additive, no regression)
- [x] Synthetic breaks: a removed `pipeline`, a `nextCommands` entry outside `next`, a broken `acceptsFrom` inverse, a dropped `sk-code` line, and a removed `Recommend-only:` marker each flip the exit code (negative proof of the new gate)
- [x] Confirm `mode-registry.json` and `shared/sk_code_handoff.md` are byte-unchanged; `git status` shows only the three intended targets

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Schema validation | `command-metadata.json` parses; every record has `pipeline` with valid sub-fields | `node` + checker Stage 1 |
| Reconciliation with `next` | `nextCommands ⊆ next`, `produces == primaryArtifactName`, `proofRequired == proofFields` for all five | checker Stage 1 |
| Graph consistency | `acceptsFrom == inverse(nextCommands)`; unique stages; `md-generator` origin | checker Stage 1 (cross-record) |
| Surface presence | each wrapper carries the Pipeline & Handoff markers, the `nextCommands` tokens, the `sk-code` line, and the `PRODUCES=/NEXT=/PROOF=` tail | checker Stage 2 |
| Recommend-only | each section carries the `Recommend-only:` marker; the OK tail uses `NEXT=` recommendation grammar (no imperative chain) | checker Stage 2 |
| No-regression | frontmatter drift stays 0; prior D2 sections (example/contract/discriminator/preconditions) intact; overall `drift=0` | checker (full run) |
| Synthetic break | removing `pipeline` / out-of-`next` nextCommand / broken inverse / dropped `sk-code` line / removed marker each flips exit 0 → non-zero | manual edit + re-run |
| Non-mutation | `mode-registry.json` and `shared/sk_code_handoff.md` unchanged; checker `node --check` clean | `git diff` / `node --check` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `command-metadata.json` (D2-R3 SSOT + D2-R4..R7 fields) | Internal | Green | the record set `pipeline` attaches to; `next`, `outputContract`, `proofFields` are the reconciliation anchors |
| `design-command-surface-check.mjs` (D2-R3..R7) | Internal | Green | the gate being extended; its Stage-1/Stage-2 structure is the host |
| `mode-registry.json` | Internal (read-only) | Green | `workflowMode` set source; never mutated here |
| `shared/sk_code_handoff.md` | Internal (read-only) | Green | the build-handoff card the pipeline terminates into; referenced, never modified |
| `commands/design/*.md` | Internal (mutated body-only) | Green | the projection targets; frontmatter must stay frozen |
| Node ESM runtime | External | Green | checker host |

**Coupling note:** D2-R9 widens the frozen record contract from D2-R3 by one nested object and adds the first cross-record rule. It is the first stage to consume three existing fields at once (`next`, `outputContract.primaryArtifactName`, `proofFields`) as reconciliation anchors, so it is order-sensitive on those fields being present — they are (D2-R2/R5 landed). No existing field changes shape; sibling D2 phases are unaffected because `pipeline` is additive and namespaced.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the pipeline graph rule proves brittle, the wrapper section is hard to generate consistently, or the new checker rule produces false drift on conformant wrappers.
- **Procedure**: revert the three edits — remove the `pipeline` object from each record, remove the generated `## 6. PIPELINE & HANDOFF` section + restore `## 6. EXAMPLE` and the prior OK status line in each wrapper, and revert the checker's Stage-1/Stage-2 additions. Because every change is additive and `mode-registry.json` / `shared/sk_code_handoff.md` are untouched, the revert returns the surface to the prior D2 state (`drift=0`).

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
| Extend SSOT (5 pipeline objects + graph) | Low–Medium | 45–75 minutes |
| Generate wrapper sections (5 files + tail) | Low–Medium | 1–1.5 hours |
| Extend checker (Stage 1 + graph + Stage 2 body rule) | Medium | 1.5–2 hours |
| Verification (incl. synthetic breaks) | Low | 30–45 minutes |
| **Total** | | **~3.75–5 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] `mode-registry.json` and `shared/sk_code_handoff.md` sha captured before any work (proves non-mutation after)
- [x] Confirmed exactly three target paths change: `command-metadata.json`, the five wrappers, the checker
- [x] Wrapper frontmatter diff confirmed empty (only the body gains a section + the OK tail is upgraded) so existing drift stays 0

### Rollback Procedure
1. Remove the `pipeline` object from each record in `command-metadata.json`
2. Remove the generated `## 6. PIPELINE & HANDOFF` section, restore `## 6. EXAMPLE`, and restore the prior `STATUS=OK` success line in each of the five wrappers
3. Revert the `REQUIRED_FIELDS`/`DRIFT_FIELDS` additions and the `validatePipeline` / `validatePipelineGraph` / `expectedPipelineDrift` rules in the checker
4. Re-run `node design-command-surface-check.mjs` → `drift=0` (prior D2 baseline restored); confirm `mode-registry.json` + `shared/sk_code_handoff.md` sha match pre-work capture

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: file edits only; no persisted state

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum
- Adds pipeline{stage,acceptsFrom,produces,nextCommands,proofRequired} to command-metadata.json, generates wrapper Pipeline & Handoff sections + PRODUCES/NEXT/PROOF tail, extends design-command-surface-check.mjs with reconciliation + a fully-declared graph rule
- Strictly additive: mode-registry.json + sk_code_handoff.md untouched, frontmatter frozen, final surface-check invalid=0 drift=0
-->
