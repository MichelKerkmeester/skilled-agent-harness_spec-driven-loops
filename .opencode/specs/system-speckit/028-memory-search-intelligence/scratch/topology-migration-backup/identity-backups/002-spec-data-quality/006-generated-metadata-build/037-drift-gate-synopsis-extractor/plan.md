---
title: "Implementation Plan: Drift Gate and Shared Synopsis Extractor [template:level_2/plan.md]"
description: "Build one shared derivePacketSynopsis helper used for both the description and causal_summary fields, a checkGeneratedMetadataDrift function that re-derives one folder and compares the generated fields ignoring volatile timestamps, a persisted source_doc_hashes freshness key, and a report-only drift wiring into strict validation and dry-run backfill, all behind a default-OFF flag and a grandfather report mode."
trigger_phrases:
  - "generated metadata drift gate"
  - "shared synopsis extractor"
  - "derive packet synopsis"
  - "check generated metadata drift"
  - "source doc hashes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-spec-data-quality/006-generated-metadata-build/037-drift-gate-synopsis-extractor"
    last_updated_at: "2026-07-04T17:11:55.086Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented per plan, all phases complete and gates green"
    next_safe_action: "Decide the scoped migration that flips the flag on"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts"
      - ".opencode/skills/system-spec-kit/scripts/spec/validate.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Drift Gate and Shared Synopsis Extractor

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript spec-kit MCP lib plus a Bash validate wrapper |
| **Framework** | spec-kit generated-metadata generators and the validate.sh strict gate |
| **Storage** | The generated `graph-metadata.json` and `description.json` files, plus a persisted `source_doc_hashes` freshness key |
| **Testing** | A vitest covering drift detection, no-drift, shared-extractor precedence, and grandfather report mode |

### Overview
This phase implements proposals 10 and 11 from the 031 generated-JSON quality research. Proposal 11 introduces one shared `derivePacketSynopsis` helper with explicit precedence and field-specific length limits, used for both the `description` field in `folder-discovery.ts` and the `causal_summary` field in `graph-metadata-parser.ts`, so the two fields stop diverging from the same source doc. Proposal 10 adds a `checkGeneratedMetadataDrift(specFolder)` function that re-derives one folder, compares the stored `description` and `causal_summary` against a fresh derivation ignoring volatile timestamps, and reports drift, paired with persisting `source_doc_hashes` as the cheap freshness key. The gate is wired as a report-only read into strict validation and dry-run backfill and never as a write side effect. Both behaviors ship behind a default-OFF flag and a grandfather report mode so the many existing folders that carry drifted or divergently-extracted synopsis text report rather than mass-fail until a scoped migration lands.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable) — vitest 11/11
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One shared extractor plus a read-only drift gate over unchanged source docs. The extractor is a single helper both generators call, replacing two divergent local extractors. The drift gate re-derives one folder and compares against the stored fields, returning a report rather than writing. Both paths are flag-gated so the existing folders report under a grandfather mode until a migration runs.

### Key Components
- **`derivePacketSynopsis(specFolder, options)`**: one helper with explicit precedence and field-specific length limits. The `description` field calls it with the short limit, the `causal_summary` field calls it with the longer limit, so both derive from the same precedence over the same source doc.
- **`checkGeneratedMetadataDrift(specFolder)`**: re-derives the folder, compares the stored `description` and `causal_summary` against the fresh derivation ignoring volatile timestamps, and returns a drift report. It never mutates the folder.
- **`source_doc_hashes`**: a persisted freshness key over the source docs the synopsis derives from, added to the generated-metadata schema so the gate has a cheap first check before re-deriving.
- **The flag and grandfather mode**: a default-OFF flag gates enforcement, and a grandfather report mode reports drift on existing or ungraded folders without changing the verdict until the flag is ON.

### Data Flow
The generators call the one shared `derivePacketSynopsis` to produce both fields. On a strict run or a dry-run backfill, the gate reads the persisted `source_doc_hashes`, and when they differ from the current docs it re-derives the folder through the same shared extractor, compares the stored `description` and `causal_summary` against the fresh derivation ignoring volatile timestamps, and emits a drift report. With the flag OFF the report is grandfathered and the verdict is unchanged, with the flag ON the report changes the verdict. No path writes to the folder.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `folder-discovery.ts` description extractor | Derives the `description` field with a local extractor distinct from the `causal_summary` extractor | route the `description` field through the shared `derivePacketSynopsis` helper, behind the flag | grep shows the `description` field calls `derivePacketSynopsis` and the old local extractor body is gone or unreferenced |
| `graph-metadata-parser.ts` causal_summary extractor | Derives the `causal_summary` field with a second extractor that diverges from the description path | route the `causal_summary` field through the same shared `derivePacketSynopsis` helper with the longer length limit | grep shows both fields share one extractor and a unit assertion confirms they move together when the source doc changes |
| `graph-metadata-parser.ts` drift function | No drift function, `memory_save` emits only an advisory | add `checkGeneratedMetadataDrift(specFolder)` that re-derives and compares ignoring volatile timestamps and returns a report without writing | a unit run returns drift for a changed folder, no drift for an in-sync folder, and a no-write assertion holds |
| `graph-metadata-schema.ts` schema | The generated-metadata schema has no freshness key for the synopsis fields | add the `source_doc_hashes` field to the schema | the schema parses a folder carrying `source_doc_hashes` and a doc edit changes the hash |
| `validate.sh` strict mode | Runs the existing shallow generated-JSON shape checks with no drift read | wire the drift gate as a report-only read, default-OFF with a grandfather report mode | a strict run on a drifted folder emits a grandfather report and leaves the verdict unchanged with the flag OFF, and changes the verdict with the flag ON |
| `backfill-graph-metadata.ts` dry-run | Dry-run backfill reports the planned refresh but no synopsis drift | surface the drift report in dry-run without mutating the folder | a dry-run backfill on a drifted folder prints the drift report and the folder bytes are unchanged |
| Generated metadata files | Carry drifted or divergently-extracted synopsis text from before this phase | leave unchanged at flip time, the grandfather report mode reports rather than rewrites them, a migration is a follow-on | no folder is rewritten by this phase, the no-write assertion covers the generators in report mode |

Required inventories:
- Same-class producers: `rg -n 'causal_summary|description|derivePacketSynopsis|deriveCausalSummary' .opencode/skills/system-spec-kit/mcp_server`.
- Consumers of changed symbols: `rg -n 'checkGeneratedMetadataDrift|source_doc_hashes|derivePacketSynopsis' .opencode/skills/system-spec-kit`.
- Matrix axes: flag OFF grandfather, flag ON enforce, drifted folder, in-sync folder, missing source_doc_hashes, missing source doc, shared-extractor precedence, no-write assertion.
- Algorithm invariant: both fields derive from one shared extractor with field-specific limits, the drift gate re-derives and compares ignoring volatile timestamps and never writes, the gate reports under grandfather mode until the flag is ON, and `source_doc_hashes` is the cheap freshness key.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the two divergent extractors in `folder-discovery.ts` and `graph-metadata-parser.ts` and capture their current precedence and length limits
- [x] Define the default-OFF flag name and the grandfather report mode contract for the drift gate
- [x] Decide where `source_doc_hashes` persists and which source docs feed the synopsis derivation
- [x] Enumerate the volatile timestamp fields the drift comparison must ignore — the gate compares only the two synopsis strings, so timestamps are excluded by construction

### Phase 2: Core Implementation
- [x] Author the shared `derivePacketSynopsis(specContent, field)` helper with explicit precedence and field-specific length limits
- [x] Route the `description` field and the `causal_summary` field through the shared helper, behind the flag
- [x] Add `checkGeneratedMetadataDrift(specFolder)` that re-derives, compares ignoring volatile timestamps, and returns a report without writing
- [x] Add the `source_doc_hashes` field to the schema and persist it on generation
- [x] Wire the drift gate as a report-only read into strict validation and dry-run backfill, default-OFF with a grandfather report mode

### Phase 3: Verification
- [x] With the flag OFF, drift resolves to a non-blocking `info` and with the flag ON to a blocking `error` (verdict change proven via `resolveGeneratedMetadataDrift`)
- [x] `checkGeneratedMetadataDrift` returns drift for a changed folder and no drift for an in-sync folder, writing nothing in either case
- [x] Both fields derive from the one shared extractor with the same precedence over the same source doc, each honoring its own length limit
- [x] A doc edit changes the persisted `source_doc_hashes` and the backfill surfaces the drift without mutating the folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The shared extractor precedence and field-specific limits, the drift compare ignoring volatile timestamps, the no-write assertion, and the `source_doc_hashes` freshness key | `generated-metadata-drift.vitest.ts` |
| Integration | The flag OFF grandfather report and the flag ON verdict change through strict validation and dry-run backfill | `generated-metadata-drift.vitest.ts` plus a strict and a dry-run invocation |
| Manual | Confirm a real existing drifted folder reports under grandfather mode without being rewritten | inspection of a known-drifted folder under the report mode |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The two divergent extractors in `folder-discovery.ts` and `graph-metadata-parser.ts` | Internal | Green | The shared extractor cannot replace them if their precedence is not captured first |
| The generated-metadata schema in `graph-metadata-schema.ts` | Internal | Green | `source_doc_hashes` cannot persist without the schema field |
| The `validate.sh` strict gate and the backfill dry-run path | Internal | Green | The drift gate has no report surface without these wiring points |
| The shared identity resolver and merge-path guard from the P0 proposals | Internal | Yellow | This phase does not gate on them, but the drift gate is cleaner once the resolver lands |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The shared extractor produces a worse synopsis than the two local extractors, or the drift gate false-fires on a valid folder.
- **Procedure**: Set the flag OFF to drop back to grandfather report mode, then if needed revert the extractor routing so each field uses its prior local extractor. No folder was rewritten because the gate never wrote, so there is no data to revert.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Core Implementation | Med | 4-6 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **6-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] The default-OFF flag confirmed off in the shipped default
- [ ] The grandfather report mode proven to leave the verdict unchanged on a drifted folder
- [ ] The no-write assertion staged for both generators in report mode

### Rollback Procedure
1. Set the drift-gate flag OFF to return to grandfather report mode
2. Revert the extractor routing so `description` and `causal_summary` use their prior local extractors
3. Remove the `source_doc_hashes` schema field if it blocks parsing
4. Confirm no generated folder was rewritten because the gate never wrote

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the gate reads and reports only and writes no folder, so there is no migrated data to reverse
<!-- /ANCHOR:enhanced-rollback -->

---
