---
title: "Tasks: D2-R4 — concrete invocation example + Returns: line per /design:* command"
description: "Ordered build tasks with verification for adding examples[] to command-metadata.json, rendering the ## EXAMPLE wrapper sections, and extending design-command-surface-check.mjs additively."
trigger_phrases:
  - "d2-r4 invocation example tasks"
  - "design command example returns tasks"
  - "command surface example check tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/004-invocation-example-and-returns"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Mark all build tasks complete with one-line checker evidence"
    next_safe_action: "Proceed to the next D2 command-specificity phase on the frozen example surface"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
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
# Tasks: D2-R4 — concrete invocation example + Returns: line per /design:* command

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Baseline + author the SSOT example field (30–45 min)

- [x] T001 Capture the pre-edit baseline: run `node design-command-surface-check.mjs` and record `STATUS=PASS … invalid=0 drift=0` (`.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs`) [5m] — pre-edit PASS recorded
- [x] T002 Grep the five wrappers for an existing `## Example` heading and a `Returns:` line; confirm zero hits (gap still open) (`.opencode/commands/design/*.md`) [5m] — zero hits pre-build
- [x] T003 Add the `examples[]{invocation,returnsArtifact}` field to all five records in `command-metadata.json`; element `[0]` per record, invocation prefix-locked to `command` and grammar-consistent with `argumentHint` (`.opencode/skills/sk-design/command-metadata.json`) [20m] — five `examples[0]` records, prefix-locked
- [x] T004 [P] Reconcile each `returnsArtifact` with the record's existing `returns`/`accepts` so the worked example produces the contracted artifact (`.opencode/skills/sk-design/command-metadata.json`) [10m] — `returnsArtifact` reuses `returns` verbatim
- [x] T005 Confirm `command-metadata.json` parses as valid JSON and embeds no spec/packet/phase ID or spec path (evergreen [HARD]) [5m] — JSON parses as five records; no spec token

**Verify Phase 1:** JSON parses; all five records carry a non-empty `examples[]`; each `examples[0].invocation` first token == the record `command`.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Render the wrapper sections (30 min)

- [x] T006 Add a `## EXAMPLE` section to `audit.md` (fenced invocation == `examples[0].invocation` + `Returns: <returnsArtifact>`) after the prior section (`.opencode/commands/design/audit.md`) [6m] — `## 4. EXAMPLE` at line 40
- [x] T007 [P] Add the `## EXAMPLE` section to `foundations.md` (`.opencode/commands/design/foundations.md`) [6m] — `## 4. EXAMPLE` at line 40
- [x] T008 [P] Add the `## EXAMPLE` section to `interface.md` (`.opencode/commands/design/interface.md`) [6m] — `## 4. EXAMPLE` at line 40
- [x] T009 [P] Add the `## EXAMPLE` section to `md-generator.md` (`.opencode/commands/design/md-generator.md`) [6m] — `## 4. EXAMPLE` at line 42
- [x] T010 [P] Add the `## EXAMPLE` section to `motion.md` (`.opencode/commands/design/motion.md`) [6m] — `## 4. EXAMPLE` at line 40
- [x] T011 Confirm each rendered section byte-matches the parsing contract: tolerant `## …Example` heading, a plain triple-backtick fence whose first non-empty line is the invocation, and a `^Returns:\s` line (`.opencode/commands/design/*.md`) [10m] — Stage 2 reports zero example/invocation/returns drift

### Extend the checker (1.5–2 hours)

- [x] T012 Add `"examples"` to `REQUIRED_FIELDS` in `design-command-surface-check.mjs` (`.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs`) [10m] — `examples` present in `REQUIRED_FIELDS`
- [x] T013 Stage 1: validate `examples` is a non-empty array; each element has non-empty `invocation` + `returnsArtifact`; `examples[].invocation` first token == record `command` → violations exit 2 (INVALID) [30m] — `validateExamples()` enforces all three
- [x] T014 Stage 2: read each wrapper **body** (not only frontmatter); locate the `## Example` section via `^##\s+(?:\d+\.\s+)?Example\b` (case-insensitive) → absent = drift `field=example` [25m] — `extractExampleSection()` + `field=example`
- [x] T015 Stage 2: extract the first fenced block's invocation line; diff against `examples[0].invocation` (drift `field=example-invocation`); assert its first token == `/design:<name>` from the wrapper filename (drift `field=example-prefix`) [25m] — both fields in `expectedExampleDrift()`
- [x] T016 Stage 2: capture the `^Returns:\s*(.+)$` line; diff against `examples[0].returnsArtifact` (drift `field=returns`); absent = drift `field=returns` actual `<missing>` [20m] — `extractReturnsArtifact()` + `field=returns`
- [x] T017 Extend `DRIFT_FIELDS` and `compareDrift` ordering with the new body fields so the report stays deterministically sorted; keep the three existing frontmatter checks untouched [15m] — `DRIFT_FIELDS` extended; `FRONTMATTER_DRIFT_FIELDS` unchanged
- [x] T018 Confirm no spec/packet/phase ID or spec path is embedded in the checker; paths still resolved from `import.meta.url` (evergreen [HARD]) [5m] — `import.meta.url`-derived paths; no spec token

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Verify the gate (30–45 min)

#### Functional
- [x] T019 `node --check .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` → exits 0 (syntax) [5m] — SYNTAX_OK
- [x] T020 Run `node design-command-surface-check.mjs` → confirm `STATUS=PASS … invalid=0 drift=0`, exit 0 (no-regression: existing 3 frontmatter checks + new example/returns checks all green) [10m] — `STATUS=PASS invalid=0 drift=0`, exit 0
- [x] T021 Negative control: a record whose `returnsArtifact` != the wrapper `Returns:` line → checker exits non-zero with `field=returns`; then revert [10m] — orchestrator: `STATUS=DRIFT drift=1`, restored → `drift=0`
- [x] T022 Run the checker twice; `diff` the two `--json` outputs → byte-identical (determinism) [5m] — sorted, stateless output; repeated runs byte-identical
- [x] T023 Confirm `mode-registry.json` is byte-unchanged (sha / `git diff`) [5m] — registry absent from `git status`
- [x] T024 Confirm `git status` shows only the seven intended paths changed (metadata + 5 wrappers + checker) [5m] — exactly seven paths listed

#### Documentation
- [x] T025 Re-read the metadata, the five wrappers, and the checker; confirm evergreen (no IDs/paths) [5m] — no spec/packet/phase token; `import.meta.url` paths
- [x] T026 Mark all checklist items with evidence; author `implementation-summary.md` [10m] — checklist 16/16 P0 + 11/11 P1; `implementation-summary.md` authored

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `command-metadata.json` carries a well-shaped `examples[]` on all five records (prefix-locked invocations)
- [x] All five wrappers carry a `## EXAMPLE` section (fenced call + `Returns:` line) projected from the SSOT — rendered as `## 4. EXAMPLE`
- [x] `node design-command-surface-check.mjs` exits 0 `drift=0`; negative control proves it fails on a mismatched example
- [x] `node --check` passes on the checker; `mode-registry.json` byte-unchanged
- [x] `checklist.md` fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Upstream SSOT**: `003-command-metadata-ssot` (the metadata + checker this phase extends)
- **Research**: See `044-design-routing-and-integration-research/research/research.md` §5 (D2-R4)

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail (effort estimates + explicit verification tasks)
- Adds examples[] to command-metadata.json, renders ## EXAMPLE sections, extends the surface-check additively
- No-regression: gate must still exit 0 drift=0; negative control proves the new check bites
-->
