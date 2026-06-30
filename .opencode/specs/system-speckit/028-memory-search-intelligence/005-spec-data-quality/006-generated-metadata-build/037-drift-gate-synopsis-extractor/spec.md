---
title: "Feature Specification: Drift Gate and Shared Synopsis Extractor [template:level_2/spec.md]"
description: "The spec-kit generated metadata has no persisted proof that a stored causal_summary or description still matches the current docs, and the two fields are produced by two different extractors so they legitimately diverge from the same source. This phase adds a generated-metadata drift gate that re-derives one folder and compares the generated fields ignoring volatile timestamps, plus one shared synopsis extractor used by both fields with field-specific length limits, both shipped behind a default-OFF flag and a grandfather report mode."
trigger_phrases:
  - "generated metadata drift gate"
  - "shared synopsis extractor"
  - "derive packet synopsis"
  - "check generated metadata drift"
  - "source doc hashes"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/006-generated-metadata-build/037-drift-gate-synopsis-extractor"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented drift gate and shared extractor behind the default-OFF flag, all gates green"
    next_safe_action: "Decide the scoped migration that flips SPECKIT_GENERATED_METADATA_DRIFT_GATE on"
    blockers: []
    key_files:
      - "../031-generated-metadata-quality-research/research/research.md"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Whether the fixes ship guarded, they ship behind a default-OFF flag and a grandfather report mode"
      - "source_doc_hashes persists inside graph-metadata.json under derived, optional and flag-gated, not a sidecar"
---
# Feature Specification: Drift Gate and Shared Synopsis Extractor

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope and verification evidence.
- Remove placeholders, stale status and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | COMPLETE |
| **Created** | 2026-06-22 |
| **Branch** | `037-drift-gate-synopsis-extractor` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The spec-kit generated metadata can silently fall out of sync with the docs it summarizes, and nothing proves otherwise. Two findings from the 031 generated-JSON quality research drive this phase.

First, there is no persisted proof that a stored `causal_summary` or `description` still matches the current docs. The `memory_save` path emits only an advisory, and neither strict validation nor a dry-run backfill re-derives a folder to confirm the stored synopsis fields are current. A doc can change while the generated `causal_summary` and `description` keep the stale text, and no gate catches it. The research ranks this as proposal 10, a P1 drift gate, and notes it pairs with adding `source_doc_hashes` so a re-derive has a cheap freshness key to compare against.

Second, the `description` field and the `causal_summary` field are produced by two different extractors. Because the two extractors apply different precedence and trimming over the same source doc, the two fields legitimately diverge even when nothing is stale, so a reader cannot trust that the short `description` and the longer `causal_summary` describe the same thing. The research ranks this as proposal 11, a P1 shared synopsis extractor, and prescribes one `derivePacketSynopsis` helper with explicit precedence used for both fields with field-specific length limits.

Both fixes touch live generators that run across the whole spec tree, and many existing folders already carry drifted or divergently-extracted synopsis text. A hard gate flipped on at once would mass-fail those folders, so every behavioral change in this phase MUST ship behind a default-OFF flag or a grandfather report mode and graduate only after a scoped migration.

### Purpose
Add two convergent freshness and consistency fixes to the generated-metadata surface. The first is a `checkGeneratedMetadataDrift(specFolder)` function used by strict validation and dry-run backfill that re-derives one folder, compares the generated fields ignoring volatile timestamps, and reports drift, paired with persisting `source_doc_hashes` as the freshness key. The second is one shared `derivePacketSynopsis` helper with explicit precedence and field-specific length limits used for both the `description` and the `causal_summary` fields, so the two fields stop diverging from the same source. Both ship guarded so existing files report rather than fail until a migration lands.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `checkGeneratedMetadataDrift(specFolder)` function that re-derives one folder, compares the stored `description` and `causal_summary` against a fresh derivation ignoring volatile timestamps, and returns a drift report rather than mutating the folder.
- Persisting `source_doc_hashes` on the generated metadata so the drift gate has a cheap freshness key, with the hashes computed over the source docs the synopsis derives from.
- One shared `derivePacketSynopsis(specFolder, options)` helper with explicit precedence and field-specific length limits, used for both the `description` field and the `causal_summary` field so they stop diverging from the same source doc.
- A default-OFF flag that gates the drift gate enforcement, and a grandfather report mode that reports drift on existing folders without failing strict validation until a migration runs.
- Wiring the drift gate as a report-only read into strict validation and into dry-run backfill, never as a write side effect.
- A vitest covering the drift-detection path, the no-drift path, the shared-extractor precedence, and the grandfather report mode.

### Out of Scope
- The scoped backfill boundary, the identity resolver, the merge-path lineage guard, the description idempotency, the status enum, and the global-cache upsert. Those are the separate P0 proposals 1, 2, 3, 5, 6, 8 from the same research and are decomposed into their own phases.
- Any change to how the source docs themselves are authored. This phase reads the docs and derives a synopsis, it does not rewrite spec content.
- Auto-repair of a drifted folder. The gate reports drift, it does not silently regenerate, because a regenerate would itself churn the very files the 031 research is trying to stop churning.
- Flipping the drift gate to a hard strict-mode failure. The default-OFF flag and the grandfather report mode stay the shipped behavior until a scoped migration cleans the existing folders, which is a follow-on decision.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` | Modify | Route the `description` field through the shared `derivePacketSynopsis` helper instead of its current local extractor, behind the flag |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | Modify | Route the `causal_summary` field through the shared `derivePacketSynopsis` helper, add `checkGeneratedMetadataDrift`, and persist `source_doc_hashes` |
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | Modify | Wire the drift gate as a report-only read in strict mode, default-OFF with a grandfather report mode |
| `.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts` | Modify | Surface the drift report in dry-run backfill without mutating the folder |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts` | Modify | Add the `source_doc_hashes` field to the generated-metadata schema |
| `.opencode/skills/system-spec-kit/scripts/tests/generated-metadata-drift.vitest.ts` | Create | Cover drift detection, no-drift, shared-extractor precedence, and grandfather report mode |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The drift gate and the shared extractor MUST ship behind a default-OFF flag and a grandfather report mode, so existing folders that carry drifted or divergently-extracted synopsis text report rather than fail strict validation | With the flag OFF, strict validation on a known-drifted existing folder exits at its current code and emits a grandfather drift report, and only with the flag ON does the gate change the verdict |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The phase SHALL add `checkGeneratedMetadataDrift(specFolder)` that re-derives one folder, compares the stored `description` and `causal_summary` against a fresh derivation ignoring volatile timestamps, and returns a drift report without mutating the folder | A unit run on a folder whose doc changed after the stored synopsis returns a drift report, a run on an in-sync folder returns no drift, and neither run writes to the folder |
| REQ-003 | The phase SHALL persist `source_doc_hashes` on the generated metadata as the freshness key the drift gate compares against | The generated metadata carries `source_doc_hashes` over the source docs the synopsis derives from, and a doc edit changes its hash so the gate can detect drift cheaply |
| REQ-004 | The phase SHALL introduce one shared `derivePacketSynopsis` helper with explicit precedence and field-specific length limits, used for both the `description` and the `causal_summary` fields | Both fields call the one helper, a unit assertion confirms they derive from the same precedence over the same source doc, and each field honors its own length limit |
| REQ-005 | The drift gate SHALL be wired as a report-only read into strict validation and dry-run backfill, never as a write side effect | A strict run and a dry-run backfill surface the drift report and leave the folder bytes unchanged, proven by a no-write assertion |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With the flag OFF, a strict run on a known-drifted existing folder emits a grandfather drift report and does not change the existing exit code, and only with the flag ON does the gate alter the verdict, proving the guarded rollout.
- **SC-002**: `checkGeneratedMetadataDrift` returns a drift report for a folder whose doc changed after the stored synopsis and no drift for an in-sync folder, and writes nothing in either case.
- **SC-003**: The `description` and `causal_summary` fields both derive from the one shared `derivePacketSynopsis` helper with the same precedence over the same source doc, each honoring its own length limit, proven by a unit assertion that flipping the source doc moves both fields together.
- **SC-004**: A doc edit changes the persisted `source_doc_hashes`, giving the gate a cheap freshness key, and the dry-run backfill surfaces the drift without mutating the folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A hard drift gate flipped on at once mass-fails existing folders that carry drifted or divergently-extracted synopsis text | High | Ship behind a default-OFF flag and a grandfather report mode, graduate only after a scoped migration |
| Risk | Re-deriving a synopsis inside the gate could itself churn the generated files the 031 research is trying to stop churning | High | The gate reports drift only and never writes, the no-write assertion in REQ-005 proves it |
| Risk | Switching `description` to the shared extractor changes existing stored descriptions and produces a diff wave | Med | Land the extractor switch behind the same flag and treat the first diff wave as the migration, not as a gate failure |
| Dependency | The 031 generated-JSON quality research seams (`folder-discovery.ts`, `graph-metadata-parser.ts`) | Internal, Green | The research verified the two-extractor divergence and the missing-drift-proof findings to file:line, so the seams are known |
| Dependency | The shared identity resolver and the merge-path guard from the P0 proposals | Internal, Yellow | This phase does not gate on them, but the drift gate is cleaner once the resolver lands, so sequence after the P0 work where practical |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The drift gate re-derives one folder per call and reads the persisted `source_doc_hashes` as a cheap first check, so a strict run does not re-derive folders whose hashes are unchanged.

### Reliability
- **NFR-R01**: The drift gate is deterministic on a fixed folder and source doc set, so the drift report is stable across reruns of the same inputs, and it never mutates the folder it reads.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A folder with no source docs to derive from: the gate reports an empty derivation rather than scoring a missing synopsis as drift.
- A folder missing `source_doc_hashes` because it predates this phase: the grandfather report mode treats it as ungraded and reports rather than failing, until the migration backfills the hashes.

### Error Scenarios
- A source doc that fails to read: the gate reports a read error for that folder rather than silently treating the synopsis as in-sync.
- The flag ON but the shared extractor unavailable: the gate fails at import with a clear contract error rather than falling back to the two divergent extractors.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | Two generators routed through one shared extractor, one drift function, one schema field, and one guarded gate wiring across validate and backfill |
| Risk | 9/25 | No ranking or retrieval change, risk is the guarded rollout and not churning the files the research protects |
| Research | 4/20 | Seams verified to file:line in 031 research.md section 4, proposals 10 and 11 |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- RESOLVED: `source_doc_hashes` persists inside `graph-metadata.json` under `derived`, optional and flag-gated, so a flag-off derive and legacy files omit it cleanly and no non-source change churns it.
- RESOLVED: the shared `derivePacketSynopsis` precedence is Overview paragraph, then Problem/Purpose first sentence, then frontmatter description, then title heading, then first body line. Both fields share that one precedence and differ only in the length ceiling.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:verdict -->
## 11. VERDICT

P1 hardening, buildable behind a guard. This phase implements the two P1 synopsis-and-freshness proposals from the 031 generated-JSON quality research, the drift gate at proposal 10 and the shared synopsis extractor at proposal 11. It touches generation and validation, not retrieval or ranking, and the research already verified both findings to file:line, the two-extractor divergence in `folder-discovery.ts` and `graph-metadata-parser.ts` and the missing drift proof on the `memory_save` advisory. The build is one shared extractor used by both fields, one `checkGeneratedMetadataDrift` re-derive-and-compare function, one persisted `source_doc_hashes` freshness key, and a report-only wiring into strict validation and dry-run backfill, all behind a default-OFF flag and a grandfather report mode so the existing folders that carry the drifted and divergently-extracted text report rather than mass-fail. The gate reports drift and never writes, which keeps it from churning the generated files the research exists to stop churning. The direction is GO-on-cost and the rollout is guarded.
<!-- /ANCHOR:verdict -->
