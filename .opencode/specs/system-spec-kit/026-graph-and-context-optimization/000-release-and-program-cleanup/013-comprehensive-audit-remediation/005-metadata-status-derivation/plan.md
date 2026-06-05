---
title: "Implementation Plan: Phase 5: metadata-status-derivation"
description: "Inject a spec.md metadata-table status read into collectPacketDocs so deriveStatus honors Draft/Placeholder table status over the implementation-summary heuristic, then reconcile the cited 026/027 metadata data files to disk and spec reality."
trigger_phrases:
  - "metadata status derivation plan"
  - "table status fallback plan"
  - "026 027 metadata reconciliation"
  - "deriveStatus precedence"
  - "graph metadata parser plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/013-comprehensive-audit-remediation/005-metadata-status-derivation"
    last_updated_at: "2026-06-04T20:45:44Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Landed E7 parser fix then targeted 026/027 metadata edits"
    next_safe_action: "Defer dist rebuild and backfill regen to central"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-metadata-status-derivation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: metadata-status-derivation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (mcp_server) + JSON/Markdown spec metadata |
| **Framework** | None (Node parser module) |
| **Storage** | Filesystem spec docs; graph-metadata.json derived blocks |
| **Testing** | Vitest (graph-metadata-schema.vitest.ts) |

### Overview
The root fix adds a single load-bearing read: `collectPacketDocs` now consults the spec.md metadata-table `Status` cell when YAML frontmatter has no status, so a Draft/Placeholder spec is no longer derived as complete from implementation-summary presence. The data work reconciles the cited 026/027 metadata files to disk and spec truth, preferring honest minimal edits over hand-listing large tables.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-module parser with a ranked status-derivation chain.

### Key Components
- **`extractMetadataTableStatus(content)`**: regex-matches the `| **Status** | <value> |` row and returns the raw value.
- **`collectPacketDocs`**: sets `doc.status = frontmatterStatus ?? tableStatus` for spec.md so the ranked chain in `deriveStatus` sees a non-null spec status.

### Data Flow
Spec doc content -> frontmatter scalar (status) OR spec.md table status -> `normalizeDerivedStatus` -> `deriveStatus` ranked chain -> `derived.status` in graph-metadata.json.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `collectPacketDocs` (producer) | builds `doc.status` for each canonical doc | update: add spec.md table-status fallback | typecheck clean; fixture test asserts `draft` |
| `deriveStatus` ranked chain (consumer) | reads `doc.status` for spec.md at the tail of the ranked list | unchanged: now receives a populated spec status | existing YAML-status tests stay green |
| lean-phase-parent existingStatus branch | preserves curated status when no implementation-summary | unchanged | graph-metadata-refresh.vitest.ts unaffected (YAML status) |
| 026/027 graph-metadata.json data | persisted derived.status | update cited rows to match table reality | validate --strict + grep |

Required inventories:
- Same-class producers: `rg -n 'extractFrontmatterScalar\(.*status' mcp_server/lib/graph/graph-metadata-parser.ts`.
- Consumers of changed symbols: `rg -n 'extractMetadataTableStatus|collectPacketDocs|deriveStatus' mcp_server/lib/graph`.
- Matrix axes: {YAML status present, absent} x {table status present, absent} x {implementation-summary present, absent} x {checklist present, absent}.
- Algorithm invariant: a spec whose only status is a Draft/Placeholder table row must NOT derive `complete`; YAML status keeps strict precedence over the table.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read parser deriveStatus + normalizeDerivedStatus + collectPacketDocs
- [x] Confirm real 027 003/006 specs carry table-only Draft status
- [x] Confirm git diff state of each cited data file

### Phase 2: Core Implementation
- [x] Add `extractMetadataTableStatus` helper (E7)
- [x] Wire spec.md table-status fallback into collectPacketDocs (E7)
- [x] Reconcile cited 026/027 metadata data files (E1-E6, E8, E9)

### Phase 3: Verification
- [x] Typecheck the parser module via project tsconfig
- [x] Authored Draft + Placeholder fixture tests (vitest run deferred to central)
- [x] validate.sh --strict on every edited 026/027 packet
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Draft/Placeholder table-status -> derived.status not complete | Vitest |
| Integration | validate.sh --strict per edited packet | spec validate.sh |
| Manual | JSON.parse sanity on every edited JSON metadata file | node -e |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Rebuilt mcp_server dist | Internal | Yellow (deferred to central) | Backfill cannot use the new parser until rebuilt |
| Global backfill-graph-metadata.ts run | Internal | Yellow (deferred to central) | E3/E6 hand-edits stay durable via E7 but are not mass-regenerated |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A backfill regen with the new parser produces unexpected status flips on phase parents or YAML-status specs.
- **Procedure**: Revert the two-block change in `graph-metadata-parser.ts` and the fixture test; data edits are independent and revert per file via git.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
