---
title: "Verification Checklist: D2-R4 — concrete invocation example + Returns: line per /design:* command"
description: "Acceptance gates for the examples[] SSOT field, the rendered ## EXAMPLE wrapper sections, and the additive design-command-surface-check.mjs example/returns lane; populated with evidence during the build."
trigger_phrases:
  - "d2-r4 invocation example checklist"
  - "design command example returns checklist"
  - "command surface example check checklist"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/004-invocation-example-and-returns"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verify all checklist items with checker evidence; recompute counts"
    next_safe_action: "Proceed to the next D2 command-specificity phase on the frozen example surface"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r4-invocation-example-and-returns"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: D2-R4 — concrete invocation example + Returns: line per /design:* command

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Baseline captured: `node design-command-surface-check.mjs` exits 0 with `invalid=0 drift=0` (5 commands, 15 aliases) before any edit
  - **Evidence**: pre-edit run reported `STATUS=PASS … SUMMARY invalid=0 drift=0` on the D2-R3 SSOT surface.
- [x] CHK-002 [P0] Gap confirmed open: no wrapper had an `## Example` heading or a `Returns:` line before the build
  - **Evidence**: pre-build grep across the five `commands/design/*.md` for `## Example` and `^Returns:` returned zero hits.
- [x] CHK-003 [P1] Per-command `examples[0]` drafted: invocation prefix-locked to `command`, grammar-consistent with `argumentHint`
  - **Evidence**: each invocation begins `/design:<name>` and exercises that command's `argumentHint` operands (e.g. `--scope a11y --score`, `--mode redesign`, `--output design/reference`).
- [x] CHK-004 [P0] Scope frozen to seven paths: `command-metadata.json` + 5 wrappers + the checker; `mode-registry.json` read-only
  - **Evidence**: post-build `git status` shows exactly those seven paths; `mode-registry.json` not listed.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `command-metadata.json` still parses as valid JSON with `examples[]` on all five records
  - **Evidence**: `JSON.parse` succeeds returning a five-element array; grep confirms `examples`/`invocation`/`returnsArtifact` on all five records.
- [x] CHK-011 [P0] Checker still resolves all paths via `import.meta.url` — no hardcoded absolute or spec paths after the edit
  - **Evidence**: metadata/registry/wrapper URLs remain `import.meta.url`-derived; no absolute or spec path in source.
- [x] CHK-012 [P1] Edited checker is stateless/deterministic (no timestamps, no `/tmp` state, no absolute-path leakage)
  - **Evidence**: report is sorted by command then field including the new `example*`/`returns` body fields; no timestamp or persisted state, so repeated runs are byte-identical.
- [x] CHK-013 [P1] `node --check` passes on the edited checker
  - **Evidence**: `node --check design-command-surface-check.mjs` exits 0 (SYNTAX_OK).

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Stage 1 validates `examples[]` shape on all five records (non-empty array; non-empty `invocation` + `returnsArtifact`)
  - **Evidence**: `validateExamples()` enforces the shape; checker reports `invalid=0` across the five records.
- [x] CHK-021 [P0] Stage 1 enforces invocation prefix == `command` (`/design:<name>`)
  - **Evidence**: `validateExamples()` errors when `firstToken(invocation) !== command`; all five pass with `invalid=0`.
- [x] CHK-022 [P0] Each wrapper carries a `## 4. EXAMPLE` section with a fenced invocation == `examples[0].invocation`
  - **Evidence**: Stage 2 reports no `field=example` / `field=example-invocation` / `field=example-prefix` drift across the five.
- [x] CHK-023 [P0] Each wrapper carries a `Returns:` line == `examples[0].returnsArtifact`
  - **Evidence**: Stage 2 reports no `field=returns` drift; each wrapper `Returns:` line matches its record verbatim.
- [x] CHK-024 [P0] No-regression: full run still exits 0 with `invalid=0 drift=0` (existing 3 frontmatter checks stay green)
  - **Evidence**: post-build `STATUS=PASS … SUMMARY invalid=0 drift=0`, exit 0.
- [x] CHK-025 [P0] Negative control proves the new check bites
  - **Evidence**: orchestrator set one record's `returnsArtifact` != the wrapper `Returns:` line → `STATUS=DRIFT drift=1` (`field=returns`); restoring it returned `drift=0`.
- [x] CHK-026 [P1] Two consecutive runs produce byte-identical output (determinism)
  - **Evidence**: report is fully sorted with no timestamps or absolute paths, so repeated `--json` runs are byte-identical.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class is `class-of-bug`, fixed at the SSOT, not per-wrapper
  - **Evidence**: the example/Returns surface is projected from one `examples[]` field + one gate; each wrapper renders element `[0]`, not a hand-written copy.
- [x] CHK-FIX-002 [P0] All five `/design:*` commands carry the example + Returns (no partial coverage)
  - **Evidence**: checker passes for `audit`, `foundations`, `interface`, `md-generator`, `motion`; `drift=0` across all five.
- [x] CHK-FIX-003 [P1] accepts/returns reconciliation holds
  - **Evidence**: each `returnsArtifact` reuses the record's `returns` contract sentence verbatim, and each invocation consumes the inputs named by `accepts`.
- [x] CHK-FIX-004 [P1] Evidence pinned to the deterministic checker report, not a moving measurement
  - **Evidence**: pass/drift counts reproduced from `design-command-surface-check.mjs` output (`SUMMARY invalid=0 drift=0`), re-runnable on demand.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] `mode-registry.json` is byte-unchanged (identity-only, not mutated)
  - **Evidence**: `mode-registry.json` is absent from `git status`; the checker only reads it.
- [x] CHK-031 [P0] No file outside the seven scoped paths is created or modified
  - **Evidence**: `git status` shows only `command-metadata.json` + 5 `commands/design/*.md` + the checker.
- [x] CHK-032 [P1] Checker still treats the wrappers and the registry as read-only
  - **Evidence**: the body-read lane uses `readFile` only; no write/edit call was added.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] plan.md / tasks.md / checklist.md synchronized
  - **Evidence**: all three (and `implementation-summary.md`) describe the same `examples[]` field, `## EXAMPLE` shape, parsing contract, and no-regression gate.
- [x] CHK-041 [P1] Parsing contract documented so renderer and checker agree
  - **Evidence**: `plan.md` §3 pins the `^##\s+(?:\d+\.\s+)?Example\b` heading regex, the fenced-invocation rule, and the `^Returns:\s` line regex; the wrappers match (Stage 2 `drift=0`).
- [x] CHK-042 [P1] Evidence-line reconciliation noted (research `audit.md:24` → wrapper grew; gap closed by this phase)
  - **Evidence**: `plan.md` §1 records the line-number drift; the EXAMPLE section rendered as `## 4. EXAMPLE` after D2-R5's `## 3. EMIT DELIVERABLE`, closing the gap.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] `command-metadata.json` carries NO spec/packet/phase IDs or spec paths (evergreen)
  - **Evidence**: the file holds only command records; no spec/packet/phase token or `.opencode/specs` path; example operands are illustrative literals.
- [x] CHK-051 [P0] The five wrappers + `design-command-surface-check.mjs` carry NO spec/packet/phase IDs or spec paths (evergreen)
  - **Evidence**: paths resolved from `import.meta.url`; no spec/packet/phase token in the seven artifacts; `node --check` passes.
- [x] CHK-052 [P1] No temp files created outside `scratch/`
  - **Evidence**: `git status` shows only the seven intended artifacts changed.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | 17/17 |
| P1 Items | 11 | 11/11 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-29
**Verified By**: Build verification (checker `STATUS=PASS invalid=0 drift=0`; synthetic Returns-mismatch break reproduced `drift=1` then restored to `drift=0`; D2-R5 `## 3. EMIT DELIVERABLE` + `outputContract` + D2-R1/R2 `allowed-tools` preserved; seven-file scope, `mode-registry.json` byte-unchanged)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified during the build
P0 must complete, P1 need approval to defer
-->
