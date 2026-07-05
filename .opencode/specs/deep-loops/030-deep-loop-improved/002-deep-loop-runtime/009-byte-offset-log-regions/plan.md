---
title: "Implementation Plan: Phase 9: Byte-Offset Log Regions"
description: "Plan for the shipped iteration transcript byte-offset metadata and dashboard/schema readers."
trigger_phrases:
  - "byte-offset log regions"
  - "transcript log offset"
  - "iteration log slice"
  - "log seek by offset"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/002-deep-loop-runtime/009-byte-offset-log-regions"
    last_updated_at: "2026-07-01T21:36:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold plan with shipped log-offset metadata content from spec.md"
    next_safe_action: "Use this plan as documentation for the completed byte-offset transcript metadata"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts"
      - ".opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs"
      - ".opencode/commands/deep/assets/deep_research_auto.yaml"
    session_dedup:
      fingerprint: "sha256:009a5e7c9d2b4f6081c3e5a7890b2d4f6a8c0e2d4f6b8a0c2e4d6f8a1b3c5e0a"
      session_id: "scaffold-content-remediation-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 9: Byte-Offset Log Regions

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript post-dispatch validation, CommonJS reducer, YAML command schema |
| **Framework** | Deep-loop iteration transcript logging and dashboard reduction |
| **Storage** | JSONL iteration records plus transcript log files |
| **Testing** | Spec acceptance requires stamped offsets in state JSONL, reducer display of optional fields, seek/read recovery, and compatibility with old records; no dedicated test file is named in spec.md |

### Overview
This phase shipped optional `logOffset`, `logSize`, and `logPath` fields on iteration records. `post-dispatch-validate.ts` stamps the byte range after transcript writes, `reduce-state.cjs` displays the fields when present, and `deep_research_auto.yaml` documents them in the iteration schema.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented: tooling had to scan whole transcript logs to find an iteration.
- [x] Success criteria measurable: seek to `logOffset`, read `logSize` bytes from `logPath`, and recover the iteration transcript without scanning.
- [x] Dependencies identified: iteration records already write to a known transcript path.

### Definition of Done
- [x] Iteration record type includes optional `logOffset`, `logSize`, and `logPath`.
- [x] `post-dispatch-validate.ts` stamps absolute path and byte range around transcript writes.
- [x] `reduce-state.cjs` reads and displays offset metadata when present.
- [x] `deep_research_auto.yaml` schema includes the optional fields.
- [x] Older records missing the fields still load/display without error.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Write-time byte-range indexing for transcript slices, consumed opportunistically by reducers and tooling.

### Key Components
- **`post-dispatch-validate.ts`**: Captures file size before and after writing an iteration transcript block and stamps the resulting byte offset/size/path.
- **Iteration record optional fields**: `logOffset`, `logSize`, and `logPath` identify the exact transcript region.
- **`reduce-state.cjs`**: Reads and surfaces the optional fields in dashboard output.
- **`deep_research_auto.yaml`**: Documents the optional schema fields for generated state records.

### Data Flow
After an iteration transcript block is written, `post-dispatch-validate.ts` records the starting byte position, byte count, and absolute log path on the iteration record. Reducers and tools can then open `logPath`, seek to `logOffset`, and read `logSize` bytes directly; records created before this phase simply omit the fields.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts` | Writes/stamps iteration validation records | Add transcript byte-range metadata | Spec acceptance reads stamped JSONL records |
| `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs` | Reduces state for dashboard output | Display offset fields when present | Spec acceptance runs reducer on stamped state |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Command/schema artifact | Add optional field definitions | Schema review verifies field presence |

Required inventories:
- Same-class producers: inspect iteration record write paths before stamping offsets.
- Consumers of changed symbols: reducer/dashboard display handles optional fields without requiring them.
- Matrix axes: new records with offsets, old records without offsets, zero/positive byte ranges, absolute path validity, and log rotation after write.
- Algorithm invariant: offsets describe the exact file and byte range as written; if logs rotate later, consumers must treat stamped offsets as invalid rather than following rotated files.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm transcript writes happen before offset metadata is stamped.
- [x] Confirm fields must be optional for backward compatibility with older state files.
- [x] Document log rotation as invalidating stamped offsets.

### Phase 2: Core Implementation
- [x] Add optional `logOffset`, `logSize`, and `logPath` fields to iteration records.
- [x] Stamp byte offset, byte size, and absolute log path in `post-dispatch-validate.ts`.
- [x] Update `reduce-state.cjs` to display the fields when present.
- [x] Update `deep_research_auto.yaml` with optional field definitions.

### Phase 3: Verification
- [x] Verify stamped records contain numeric byte values and a non-empty absolute path.
- [x] Verify direct seek/read recovers the iteration transcript slice.
- [x] Verify records without these optional fields load and display without error.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| State readback | State JSONL after a test run contains `logOffset`, `logSize`, and absolute `logPath` | Spec acceptance criteria; no dedicated test file named |
| Direct seek | Open `logPath`, seek to `logOffset`, read `logSize` bytes, recover transcript | Script/manual check |
| Compatibility | Older records missing optional fields load in `reduce-state.cjs` | Reducer run on pre-change state |
| Schema/display | Reducer output and YAML schema include fields | `reduce-state.cjs` run and schema review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Stable transcript write path | Internal | Complete | Offset stamping requires a known file path and append position |
| Log rotation policy | Operational | Documented caveat | Rotated logs invalidate offsets; phase does not attempt rotation following |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Offset stamping produces incorrect byte ranges, breaks older records, or exposes invalid paths in reducer output.
- **Procedure**: Revert stamping in `post-dispatch-validate.ts`, optional display in `reduce-state.cjs`, and schema additions in `deep_research_auto.yaml`; consumers fall back to full-log scanning.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
