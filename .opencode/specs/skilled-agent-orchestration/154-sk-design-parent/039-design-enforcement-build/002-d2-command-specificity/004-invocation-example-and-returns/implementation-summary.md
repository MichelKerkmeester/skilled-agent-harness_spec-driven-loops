---
title: "Implementation Summary: D2-R4 — concrete invocation example + Returns: line per /design:* command"
description: "Each /design:* command now carries a body-enforced worked example and a Returns: line reconciled to the metadata SSOT, gated by an additive lane in the surface-drift checker at drift=0."
trigger_phrases:
  - "d2-r4 invocation example implementation summary"
  - "design command example returns delivered"
  - "command surface example lane delivered"
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/004-invocation-example-and-returns"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Deliver examples[] SSOT, EXAMPLE wrapper sections, and the surface-check example lane"
    next_safe_action: "Proceed to the next D2 command-specificity phase on the frozen example surface"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r4-invocation-example-and-returns"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-invocation-example-and-returns |
| **Completed** | 2026-06-29 |
| **Level** | 2 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Every `/design:*` command now shows a real call and names the artifact it produces, and a deterministic gate keeps that example honest against the metadata SSOT. Before this phase the five wrappers documented the routing/identity surface but ended without a worked invocation or a `Returns:` line, so a caller could read the contract and still not see one concrete call or what it hands back. You can now read a fenced invocation and a `Returns:` statement in each wrapper, and the surface-check fails the moment either falls out of step with `command-metadata.json`.

### The examples[] SSOT field

`command-metadata.json` carries one `examples[]` array on each of the five records (audit, foundations, interface, md-generator, motion). Element `[0]` holds `{ invocation, returnsArtifact }`: the invocation is prefix-locked to its `command` (`/design:<name>`) and exercises that command's `argumentHint` grammar, and `returnsArtifact` reuses the record's abstract `returns` contract sentence verbatim as the concrete produced artifact. The addition is purely additive: every record keeps `outputContract` and every prior field; the file is still a valid JSON array of five records.

### The wrapper EXAMPLE section

Each wrapper gained one new body section rendering element `[0]`: a plain fenced invocation block plus a `Returns:` line. It was appended after D2-R5's `## 3. EMIT DELIVERABLE`, so it landed as `## 4. EXAMPLE` rather than the `## 3. EXAMPLE` the plan anticipated; the checker's tolerant heading match (`^##\s+(?:\d+\.\s+)?Example\b`) accepts either number. The wrapper frontmatter and the prior `## 3. EMIT DELIVERABLE` section were not touched, so D2-R5 and the D2-R1/R2 `allowed-tools` policy stay intact.

### The surface-check example lane

`design-command-surface-check.mjs` grew an additive example lane in both stages. Stage 1 adds `examples` to `REQUIRED_FIELDS` and validates each record: `examples` is a non-empty array, `invocation` and `returnsArtifact` are non-empty strings, and `invocation`'s first token equals the record `command` (any violation exits 2, INVALID). Stage 2 reads each wrapper body and projects from the SSOT: the EXAMPLE heading must be present (`field=example`), the first fenced invocation must equal `examples[0].invocation` (`field=example-invocation`) with a `/design:<name>` prefix derived from the filename (`field=example-prefix`), and the `Returns:` line must equal `examples[0].returnsArtifact` (`field=returns`). `DRIFT_FIELDS` and the sort order were extended with the new fields so the report stays deterministic; the three pre-existing frontmatter checks were left untouched.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/command-metadata.json` | Modified | Added `examples[]{invocation,returnsArtifact}` to all five records; `outputContract` and prior fields preserved |
| `.opencode/commands/design/audit.md` | Modified | Appended `## 4. EXAMPLE` (fenced invocation + `Returns:` line) after `## 3. EMIT DELIVERABLE` |
| `.opencode/commands/design/foundations.md` | Modified | Appended `## 4. EXAMPLE` section |
| `.opencode/commands/design/interface.md` | Modified | Appended `## 4. EXAMPLE` section |
| `.opencode/commands/design/md-generator.md` | Modified | Appended `## 4. EXAMPLE` section |
| `.opencode/commands/design/motion.md` | Modified | Appended `## 4. EXAMPLE` section |
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Modified | Added the example lane: `examples` in `REQUIRED_FIELDS`, Stage-1 shape/prefix validation, Stage-2 body example/invocation/prefix/returns drift |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The example values were authored from each record's existing contract: `returnsArtifact` reuses the `returns` sentence verbatim and the invocation exercises the `argumentHint` grammar, so the worked example produces exactly the contracted artifact. The checker was extended additively in the same change as the field and the sections, so the existing `drift=0` PASS was preserved end to end rather than reintroduced.

The orchestrator verified acceptance independently: `node design-command-surface-check.mjs` reports `STATUS=PASS … SUMMARY invalid=0 drift=0` (exit 0) with the `examples[]`, `outputContract`, and frontmatter parity all green across the five records. A synthetic break — a record whose `examples[0].returnsArtifact` no longer matched the wrapper's `Returns:` line — drove `STATUS=DRIFT drift=1`, proving the gate bites; restoring the line returned it to `drift=0`. D2-R5's `## 3. EMIT DELIVERABLE` sections (5/5), the `outputContract` records (5/5), and the D2-R1/R2 `allowed-tools` frontmatter (5/5) were all confirmed preserved; `command-metadata.json` is valid JSON; `node --check` passes on the checker. This summary's own re-run reproduced `STATUS=PASS invalid=0 drift=0` and confirmed the seven-file scope with `mode-registry.json` byte-unchanged.

One false alarm is worth recording: a case-sensitive grep initially read `## EMIT DELIVERABLE` as 0/5 because it searched for title-case `Emit Deliverable`. The real heading is the preserved `## 3. EMIT DELIVERABLE`; the diff is purely additive and nothing in D2-R5 was lost.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reused each record's `returns` sentence verbatim as `returnsArtifact` | Keeps the concrete example and the abstract contract in lockstep, and lets the gate enforce the wrapper `Returns:` line == `returnsArtifact` with no editorial gap |
| Appended `## 4. EXAMPLE` after `## 3. EMIT DELIVERABLE` instead of renumbering | Purely additive: it closes the missing-example gap without touching D2-R5's section or the frontmatter |
| Gated the body `Returns:` line == metadata `returnsArtifact`; left `returnsArtifact` == `returns` editorial | Byte-equality belongs on the projection the renderer controls; the contract-restatement consistency is a build-time read, not a moving gate |
| Kept the heading match tolerant of the numeric prefix | The section can sit at any slot number as upstream phases add sections, so the example lane does not break when the wrapper grows |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node design-command-surface-check.mjs` | PASS (`STATUS=PASS … invalid=0 drift=0`, exit 0) |
| Stage 1: `examples[]` shape on all five records (non-empty array, non-empty fields) | PASS (`invalid=0`) |
| Stage 1: `examples[0].invocation` first token == record `command` | PASS (all five prefix-locked) |
| Stage 2: each wrapper `## 4. EXAMPLE` fenced invocation == `examples[0].invocation` | PASS (no `example` / `example-invocation` / `example-prefix` drift) |
| Stage 2: each wrapper `Returns:` line == `examples[0].returnsArtifact` | PASS (no `returns` drift) |
| Negative control: `returnsArtifact` != wrapper `Returns:` line | DRIFT (`drift=1`, gate bites); restore → `drift=0` (orchestrator-verified) |
| `node --check design-command-surface-check.mjs` | PASS (SYNTAX_OK) |
| `command-metadata.json` valid JSON, five records | PASS |
| D2-R5 `## 3. EMIT DELIVERABLE` preserved | PASS (5/5) |
| `outputContract` preserved on all records | PASS (5/5) |
| D2-R1/R2 `allowed-tools` frontmatter preserved | PASS (5/5: four `Read, Glob, Grep`; md-generator adds `Write, Edit, Bash`) |
| `mode-registry.json` byte-unchanged | PASS (not in `git status`; never written) |
| Scope = seven files (metadata + 5 wrappers + checker) | PASS |
| Evergreen (no spec/packet/phase IDs in artifacts) | PASS |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Example operands are placeholders.** The invocation operands (`src/components/Checkout.tsx`, `https://stripe.com`, `dashboard-shell`, `modal-open-close`, `marketing-site`) are illustrative, not real repo paths. The gate enforces only the `/design:<name>` prefix and the `Returns:` line, not operand validity or reachability.
2. **`returnsArtifact` == `returns` is editorial, not gated.** Today they are byte-identical because `returnsArtifact` reuses `returns` verbatim, but only the wrapper `Returns:` line == `examples[0].returnsArtifact` is enforced. A future divergence between `returns` and `returnsArtifact` would not fail the checker.
3. **The EXAMPLE section number is not a stable anchor.** It rendered as `## 4. EXAMPLE` because D2-R5 took slot 3; the tolerant heading regex matches any numeric prefix, so an upstream phase adding a section could shift the number without failing. This is intentional, but the number must not be relied on as an anchor.
4. **Generated metadata is regenerated downstream.** `description.json` (level `1`) and `graph-metadata.json` (status `planned`) are owned by the generation step; `validate.sh` reports their integrity/drift as residual after this doc edit, and the orchestrator regenerates them rather than hand-editing.

<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification addendum
- examples[] SSOT field + ## 4. EXAMPLE wrapper sections + additive surface-check example lane delivered at drift=0
- Returns line gated == returnsArtifact; returnsArtifact == returns editorial; example operands are placeholders
-->
