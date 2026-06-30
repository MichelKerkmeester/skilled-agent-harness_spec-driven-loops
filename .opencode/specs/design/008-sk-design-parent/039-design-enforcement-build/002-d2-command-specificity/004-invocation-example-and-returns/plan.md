---
title: "Implementation Plan: D2-R4 — concrete invocation example + Returns: line per /design:* command"
description: "planning. Add examples[]{invocation,returnsArtifact} to command-metadata.json, render a per-command ## Example section (one fenced call + a Returns: line), and extend design-command-surface-check.mjs to enforce presence/parity additively without regressing the drift=0 PASS."
trigger_phrases:
  - "d2-r4 invocation example plan"
  - "design command example returns plan"
  - "command surface example check plan"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/004-invocation-example-and-returns"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Mark plan phases complete with checker evidence; set status complete"
    next_safe_action: "Proceed to the next D2 command-specificity phase on the frozen example surface"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r4-invocation-example-and-returns"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: D2-R4 — concrete invocation example + Returns: line per /design:* command

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
| **Inputs (read-only)** | `sk-design/mode-registry.json` (`workflowMode` set) |
| **Edited artifacts** | `sk-design/command-metadata.json`, `.opencode/commands/design/{audit,foundations,interface,md-generator,motion}.md`, `sk-design/shared/scripts/design-command-surface-check.mjs` |
| **Validation** | `node design-command-surface-check.mjs` — deterministic, exit-coded; `node --check` on the edited checker |

### Overview
The five `/design:*` wrappers carry a routing/identity surface (description, per-mode arg grammar, aliases, tool policy) but **no worked example and no statement of what the command returns** — each wrapper ends at its `## 2. INSTRUCTIONS` Return-Status block. This phase closes that gap by extending the existing SSOT-plus-gate pattern established in `003-command-metadata-ssot`:

1. **Add `examples[]{invocation,returnsArtifact}`** to each record in `command-metadata.json` (the SSOT already owns description/argumentHint/aliases/accepts/returns).
2. **Render a `## 3. EXAMPLE` section** into each wrapper body: one fenced invocation call plus a `Returns:` line, projected from the metadata example.
3. **Extend `design-command-surface-check.mjs`** with an additive example-surface lane: metadata-side validation of the new field (Stage 1) and a body-side drift check that the rendered `## EXAMPLE` / fenced invocation / `Returns:` line are present and match the SSOT (Stage 2). The invocation prefix must equal the command (`/design:<name>`), which equals the wrapper filename `<name>.md`.

This is **strictly additive and no-regression**: the checker today reports `STATUS=PASS … SUMMARY invalid=0 drift=0`. The new field is added to all five records and the new section to all five wrappers in the same change, so the existing three frontmatter checks (`description`, `argument-hint`, `allowed-tools`) stay green and the new example/returns checks land green — the gate must still exit 0 with `drift=0` after the build.

#### Evidence reconciliation (read before building)
The research cites `commands/design/audit.md:24` as "wrapper ends without an example or a Returns: line." Since that research snapshot, D2-R1/R2 extended the wrappers, so `audit.md` now ends at its line 28 Return-Status block. **The gap is unchanged** — no wrapper carries an `## Example` section or a `Returns:` line today (verified across all five files). The line number drifted; the finding stands.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Baseline captured: `node design-command-surface-check.mjs` exits 0 with `invalid=0 drift=0` (5 commands, 15 aliases) before any edit
  - **Evidence**: pre-edit run reported `STATUS=PASS … SUMMARY invalid=0 drift=0` on the D2-R3 SSOT surface.
- [x] Confirmed no wrapper currently had an `## Example` heading or a `Returns:` line (grep both, zero hits across the five files)
  - **Evidence**: pre-build grep over the five `commands/design/*.md` returned zero `## Example` / `^Returns:` hits.
- [x] Per-command example `{invocation,returnsArtifact}` drafted, each invocation consistent with that command's `argumentHint` grammar and prefixed `/design:<name>`
  - **Evidence**: five `examples[0]` records authored, each invocation prefixed `/design:<name>` and reusing `returns` verbatim as `returnsArtifact`.
- [x] Scope frozen: only `command-metadata.json`, the five wrappers, and the checker; `mode-registry.json` stays read-only/identity-only
  - **Evidence**: `git status` shows exactly the seven intended paths; `mode-registry.json` not listed.

### Definition of Done
- [x] Every record in `command-metadata.json` carries a non-empty `examples[]` whose first element has non-empty `invocation` + `returnsArtifact`, and whose invocation prefix equals the record `command`
  - **Evidence**: checker Stage 1 reports `invalid=0`; grep confirms `examples`/`invocation`/`returnsArtifact` on all five records.
- [x] Every wrapper carries a `## EXAMPLE` section with one fenced call (== `examples[0].invocation`) and a `Returns:` line (== `examples[0].returnsArtifact`)
  - **Evidence**: rendered as `## 4. EXAMPLE` (after D2-R5's `## 3. EMIT DELIVERABLE`); Stage 2 reports no example/invocation/prefix/returns drift across the five.
- [x] `node design-command-surface-check.mjs` still exits 0 with `invalid=0 drift=0`; removing or mangling any one example/Returns line makes it exit non-zero (proven on a throwaway mutation, then reverted)
  - **Evidence**: `STATUS=PASS … invalid=0 drift=0` (exit 0); orchestrator synthetic break (`returnsArtifact` != `Returns:` line) → `STATUS=DRIFT drift=1`, restored → `drift=0`.
- [x] `node --check` passes on the edited checker; `mode-registry.json` byte-unchanged
  - **Evidence**: `node --check` → SYNTAX_OK; `mode-registry.json` absent from `git status`.
- [x] No spec/packet/phase ID or spec path embedded in the wrappers, metadata, or checker (evergreen [HARD])
  - **Evidence**: checker resolves paths from `import.meta.url`; example operands are illustrative literals, no spec/packet/phase token in any artifact.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
SSOT projection + additive drift-gate. `command-metadata.json` remains the single upstream contract; the wrapper body is a projection of it; the checker diffs the projection. This phase adds one field to the SSOT and one body-read lane to the existing two-stage checker — it does not invent a new mechanism.

### Key Components
- **`command-metadata.json` — new `examples[]` field** (per record): an array of `{ invocation, returnsArtifact }`. The wrapper renders element `[0]`; the array allows future additional examples without a schema change.
- **Wrapper `## 3. EXAMPLE` section** — a fenced invocation block plus a `Returns:` line, placed after `## 2. INSTRUCTIONS` so it directly closes the "ends without an example/Returns" evidence.
- **`design-command-surface-check.mjs` — extended**: `examples` joins `REQUIRED_FIELDS`; Stage 1 validates the field shape and the invocation prefix; Stage 2 reads each wrapper body and drift-checks the rendered example against the SSOT.
- **`mode-registry.json`** — read-only `workflowMode` source; never mutated.

#### `examples[]` record shape (worked example — `md-generator`)
```json
"examples": [
  {
    "invocation": "/design:md-generator https://stripe.com --output design/reference",
    "returnsArtifact": "a Style Reference DESIGN.md and extracted token data under the output directory"
  }
]
```

#### Rendered wrapper section (house style, numbered to follow PURPOSE/INSTRUCTIONS)
````text
## 3. EXAMPLE

```
/design:md-generator https://stripe.com --output design/reference
```

Returns: a Style Reference DESIGN.md and extracted token data under the output directory
````

#### Recommended per-command examples (deterministic prefix; prose authored in the build)
| command | invocation (prefix-locked) | returnsArtifact (recommended) |
|---------|----------------------------|-------------------------------|
| `/design:audit` | `/design:audit src/components/Checkout.tsx --scope a11y --score` | a findings-first design quality report with severity, evidence, owners, and a readiness score |
| `/design:foundations` | `/design:foundations color marketing-site` | a static visual-system plan with token decisions and contrast evidence |
| `/design:interface` | `/design:interface dashboard-shell --mode redesign` | a deliberate interface direction with rationale, visual choices, critique, and handoff notes |
| `/design:md-generator` | `/design:md-generator https://stripe.com --output design/reference` | a Style Reference DESIGN.md and extracted token data under the output directory |
| `/design:motion` | `/design:motion modal-open-close --library framer-motion` | a motion plan with timing, easing, interaction states, performance notes, and reduced-motion behavior |

The **deterministic** constraints are: each invocation begins `/design:<name>` (== the wrapper filename stem) and exercises that command's `argumentHint` grammar; the `returnsArtifact` reconciles with the record's existing `returns` contract sentence (recommended: restate or reuse `returns` verbatim as the concrete produced artifact). The literal placeholder values (`src/components/Checkout.tsx`, `https://stripe.com`, etc.) are illustrative, not real repo paths, and carry no spec/packet/phase token.

#### accepts / returns reconciliation
- `accepts` (existing) describes the inputs → the example invocation must consume an input shape consistent with it.
- `returns` (existing) is the abstract contract sentence → `examples[0].returnsArtifact` is its concrete restatement, and the wrapper `Returns:` line renders `returnsArtifact`.
- Reconciliation is satisfied structurally: the deterministic checker enforces `Returns:` line == `examples[0].returnsArtifact`; the `returnsArtifact` ↔ `returns` consistency is a build-time editorial check (checklist CHK), not a byte-equality gate.

#### Checker rules (additive — failure conditions)
Stage 1 — metadata validation (any violation → exit 2, INVALID):
1. `examples` missing from any record (joins `REQUIRED_FIELDS`).
2. `examples` not a non-empty array, or `examples[].invocation` / `examples[].returnsArtifact` not a non-empty string.
3. `examples[].invocation` first whitespace token ≠ the record `command` (the SSOT-side "invocation prefix ≠ command" guard).

Stage 2 — surface drift (any drift → exit 1, DRIFT), per wrapper, reading the **body**:
4. no `## Example` section (tolerant heading match, see below) → drift `field=example`.
5. first fenced block's invocation line ≠ `examples[0].invocation` → drift `field=example-invocation`.
6. invocation first token ≠ `/design:<name>` derived from the wrapper filename → drift `field=example-prefix` (belt-and-suspenders mirror of rule 3 at the body layer; satisfies the spec's "invocation prefix ≠ the command filename").
7. no `Returns:` line, or its text ≠ `examples[0].returnsArtifact` → drift `field=returns`.

PASS (exit 0) only when metadata is valid AND zero drift across all five wrappers — including the three pre-existing frontmatter checks.

#### Parsing contract (pin so the renderer and checker agree)
- **Heading match:** `^##\s+(?:\d+\.\s+)?Example\b` (case-insensitive, tolerant of the `3.` numeric prefix) — so `## 3. EXAMPLE` matches.
- **Fenced invocation:** the first triple-backtick fence inside the EXAMPLE section; its first non-empty content line is the invocation (plain fence, no language tag).
- **Returns line:** a body line matching `^Returns:\s*(.+)$`; capture group is compared to `examples[0].returnsArtifact`.
- The renderer MUST emit exactly these shapes so the projection is byte-exact.

### Data Flow
1. Checker resolves `command-metadata.json`, `mode-registry.json`, and the five wrapper paths from `import.meta.url` (no hardcoded absolute or spec paths) — unchanged.
2. Stage 1 validates the metadata, now including `examples[]` shape + invocation-prefix rule.
3. Stage 2 parses each wrapper's frontmatter (existing three fields) **and body** (new EXAMPLE/Returns lane), projects expected values from metadata, and diffs.
4. Emits the deterministic sorted per-command drift report + summary counts; sets the exit code. `DRIFT_FIELDS` / sort ordering is extended with the new body fields so output stays deterministically ordered.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Author the SSOT example field
- [x] Capture baseline (`node design-command-surface-check.mjs` → `invalid=0 drift=0`) — pre-edit PASS recorded
- [x] Add `examples[]{invocation,returnsArtifact}` to all five records in `command-metadata.json`, prefix-locked to each `command` and grammar-consistent with `argumentHint` — five records carry `examples[0]`
- [x] Reconcile each `returnsArtifact` with the record's existing `returns`/`accepts` — `returnsArtifact` reuses the `returns` sentence verbatim (byte-identical)
- [x] Confirm valid JSON, no embedded IDs/paths (evergreen [HARD]) — JSON parses as five records; no spec/packet/phase token

### Phase 2: Render the wrapper sections + extend the checker
- [x] Add a `## EXAMPLE` section to each of the five wrappers (fenced invocation + `Returns:` line), byte-matching the parsing contract — rendered as `## 4. EXAMPLE` after D2-R5's `## 3. EMIT DELIVERABLE`
- [x] Extend `design-command-surface-check.mjs`: `examples` in `REQUIRED_FIELDS`; Stage 1 field-shape + invocation-prefix validation; Stage 2 body-read EXAMPLE/invocation/prefix/Returns lane; `DRIFT_FIELDS`/sort extended — `validateExamples()` + `expectedExampleDrift()` present
- [x] Keep the three existing frontmatter checks untouched; no new dependency on `mode-registry.json` beyond `workflowMode` — `FRONTMATTER_DRIFT_FIELDS` unchanged; checker `invalid=0 drift=0`

### Phase 3: Verification
- [x] `node --check` the edited checker; run `node design-command-surface-check.mjs` → `invalid=0 drift=0`, exit 0 — SYNTAX_OK; `STATUS=PASS invalid=0 drift=0`
- [x] Negative proof: a record whose `returnsArtifact` != the wrapper `Returns:` line → checker exits non-zero with the expected drift field; revert — orchestrator: `STATUS=DRIFT drift=1`, restored → `drift=0`
- [x] Confirm `mode-registry.json` byte-unchanged; re-read all edited artifacts for evergreen (no IDs/paths) — registry absent from `git status`; artifacts carry no spec/packet/phase token

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Schema validation | `examples[]` present + well-shaped on all 5 records | `node` + checker Stage 1 |
| Structural rule | each `examples[].invocation` prefix == `command` (`/design:<name>`) | checker Stage 1 |
| Body drift | wrapper `## EXAMPLE` / fenced invocation / `Returns:` line vs metadata projection | checker Stage 2 |
| No-regression | full run still `invalid=0 drift=0` (existing 3 frontmatter checks stay green) | checker exit 0 |
| Negative control | removed/mangled example or Returns → non-zero exit, expected drift field | manual local mutation + revert |
| Determinism | two runs produce byte-identical output | `diff` of two `--json` runs |
| Non-mutation | `mode-registry.json` unchanged | `git diff` / sha compare |
| Syntax | edited checker parses | `node --check design-command-surface-check.mjs` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `command-metadata.json` (D2-R3) | Internal (SSOT) | Green | upstream contract this phase extends with `examples[]` |
| `design-command-surface-check.mjs` (D2-R3) | Internal (gate) | Green | the two-stage checker this phase extends additively |
| `.opencode/commands/design/*.md` | Internal (edited) | Green | the five wrappers that receive the `## EXAMPLE` section |
| `mode-registry.json` | Internal (read-only) | Green | `workflowMode` set source; never mutated |
| Node ESM runtime | External | Green | checker host |

**Coupling note:** the `examples[].invocation` / `returnsArtifact` field names and the EXAMPLE/Returns parsing contract become part of the frozen surface contract. Downstream D2 phases (e.g. D2-R5 deliverable output-contract) read the same SSOT and must not break this projection.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the example projection proves non-deterministic, or the body-read lane regresses the existing frontmatter checks.
- **Procedure**: revert the `examples[]` additions in `command-metadata.json`, remove the `## 3. EXAMPLE` sections from the five wrappers, and revert the checker to its two-stage (frontmatter-only) form. `mode-registry.json` was never touched, so it needs no reversal.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Author SSOT examples) ──> Phase 2 (Render sections + extend checker) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Author SSOT examples | None | Render + extend |
| Render + extend checker | Author SSOT examples | Verify |
| Verify | Render + extend checker | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Author SSOT examples (5 records) | Low | 30–45 minutes |
| Render 5 wrapper sections | Low | 30 minutes |
| Extend checker (Stage 1 + body lane) | Medium | 1.5–2 hours |
| Verification (incl. negative control) | Low | 30–45 minutes |
| **Total** | | **~3–4 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline `node design-command-surface-check.mjs` exit 0 / `drift=0` captured before edits — pre-edit PASS recorded
- [x] `mode-registry.json` sha captured before any work (proves non-mutation after) — registry absent from `git status` post-build
- [x] Confirmed exactly seven paths changed (metadata + 5 wrappers + checker), no others — `git status` shows exactly those seven

### Rollback Procedure
1. Revert `examples[]` in `command-metadata.json`
2. Remove the `## 3. EXAMPLE` section from each of the five wrappers
3. Revert `design-command-surface-check.mjs` to the frontmatter-only two-stage form
4. Verify `git status` shows no other change; `mode-registry.json` sha matches pre-work capture; checker exits 0 `drift=0`

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: file edits only; no persisted state

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum
- Adds examples[] to command-metadata.json, renders ## EXAMPLE sections, extends the surface-check additively
- No-regression: gate must still exit 0 drift=0 after the build; mode-registry.json untouched; artifacts evergreen
-->
