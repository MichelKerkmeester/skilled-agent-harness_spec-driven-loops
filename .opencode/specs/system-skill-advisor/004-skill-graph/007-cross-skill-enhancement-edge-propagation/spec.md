---
title: "Feature Specification: skill_graph_propagate_enhances — cross-skill auto-propagation MVP"
description: "Detect and propose missing inbound edges.enhances[] declarations across skills. Closes the manual-backfill pattern that surfaced twice in one day (cli-devin in 269ad9d75, cli-opencode in 99a606000). MVP scope: report mode + propose mode + apply mode with composite detection (family + asset-shape + sibling-transitivity) and propose-default approval gate."
trigger_phrases:
  - "skill_graph_propagate_enhances"
  - "cross-skill auto-propagation"
  - "inbound enhancement edges"
  - "skill-advisor edge propagation"
  - "007-cross-skill-enhancement-edge-propagation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/004-skill-graph/007-cross-skill-enhancement-edge-propagation"
    last_updated_at: "2026-05-15T15:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author Level 2 spec"
    next_safe_action: "Dispatch SWE-1.6"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "026-cross-skill-init"
      parent_session_id: null
    completion_pct: 15
    open_questions:
      - "Should the audit-mode run automatically once on advisor MCP server start, or stay strictly on-demand?"
      - "Schema field `enhance_when` location — per-enhancer skill graph-metadata.json (recommended) vs central rule manifest?"
    answered_questions:
      - "Module location: .opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/ (separate from lib/skill-graph/ which owns runtime SQLite indexing)"
      - "Default mode: report (no writes). Propose returns candidates without writing. Apply requires explicit candidate IDs or applyAllHighConfidence flag"
      - "Authority model: source-skill-owned. Patches go into source skill's graph-metadata.json edges.enhances[]"
      - "Edge types in scope: enhances ONLY. depends_on / siblings / conflicts_with stay manual"
---
# Feature Specification: skill_graph_propagate_enhances — cross-skill auto-propagation MVP

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-15 |
| **Branch** | `main` (no feature branch per operator policy) |
| **Track** | `system-spec-kit/026-graph-and-context-optimization/006-skill-advisor` |
| **Phase ID** | `007-cross-skill-enhancement-edge-propagation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

When a new skill ships, system-skill-advisor's daemon + indexer correctly auto-discover the new skill's own outbound edges. But the architecture has no mechanism to update OTHER skills' `edges.enhances[]` lists to include the new arrival. The cli-devin v1.0.2.0 work (commits 269ad9d75 and 99a606000) had to manually backfill this pattern TWICE in the same day — once for cli-devin (which prompted the audit) and once for cli-opencode (which had silently lacked the same edges since it shipped). The audit-by-coincidence model is brittle: cli-opencode's gap could have remained unnoticed indefinitely.

### Purpose

Build the smallest MVP that detects missing inbound `enhances` edges across the repo, surfaces them to the operator with provenance + confidence, and (in opt-in apply mode) writes them into the source skill's `graph-metadata.json` with auto-marker fields for future audits. Catch the next family-member shipment automatically; surface existing drift across all skills in one pass.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- New module: `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/` with files: `types.ts`, `metadata-loader.ts`, `detect-inbound-enhances.ts`, `context-template.ts`, `apply-graph-metadata-patch.ts`, `index.ts`.
- New MCP tool: `skill_graph_propagate_enhances` with modes `report` / `propose` / `apply`. Default mode: `report`.
- Composite detection: family-membership inference (weight up to 0.45) + asset-shape inference (up to 0.30) + sibling-edge transitivity (up to 0.15). Hard threshold: ≥ 0.80 high-confidence, ≥ 0.60 medium-confidence, default tool threshold 0.75.
- Asset-shape rule encoded in source skill's `graph-metadata.json` as new optional `enhance_when` field (additive schema change; schema_version stays at 2; the new field is ignored by existing parsers).
- Apply mode writes into source skill's `graph-metadata.json edges.enhances[]` with auto-marker fields (`auto_added_at`, `auto_added_reason`). Idempotent — skips edges that already exist.
- Edge weight clipped to [0.3, 0.7]. Context strings inferred from same-family exemplar (verbatim copy) or templated substitution (`routes codex delegation requests` → `routes devin delegation requests` for target name).
- Tests: 3 vitest fixtures matching the patterns in `tests/skill-graph-handlers.vitest.ts`:
  - Fixture 1: cli-family new arrival → expect 2 high-confidence candidates (sk-prompt + system-skill-advisor)
  - Fixture 2: non-family new arrival → expect 0 candidates
  - Fixture 3: re-run after apply → idempotent (0 new candidates)
- MCP tool registration in `tools/skill-graph-tools.ts` (or wherever the existing tools are registered).

### Out of Scope

- Daemon-event-triggered auto-apply (codex research recommends NOT writing from the watcher; defer to v2)
- Semantic / embedding-based detection (too expensive, hard to audit; defer to v2)
- Auto-propagation of `depends_on` / `siblings` / `conflicts_with` (only `enhances`)
- Schema version bump to 3 (additive-only stays at v2)
- Persistent audit JSON file under `mcp_server/audit/` (codex research: creates another repo artifact to maintain; MCP return value is enough)
- LLM-generated context strings at runtime (deterministic templating only)
- Backfill commits for all existing skills (one-time operator decision after running audit pass; not in this phase)
- CI/pre-commit integration that fails on missing edges (defer to v2 after propose-mode is well-trusted)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/types.ts` | Create | Type definitions: `PropagationMode`, `InboundEnhanceCandidate`, `CandidateRuleEvidence`, `DetectInboundEnhancesOptions` |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/metadata-loader.ts` | Create | Load all skill `graph-metadata.json` files from disk, normalize, group by family |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/detect-inbound-enhances.ts` | Create | Composite detector — family + asset-shape + sibling-transitivity scoring |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/context-template.ts` | Create | Deterministic context-string + weight inference from same-family exemplars |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/apply-graph-metadata-patch.ts` | Create | Idempotent JSON-patcher that writes new `enhances[]` entries into source skill's `graph-metadata.json` with auto-marker fields |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/index.ts` | Create | Public entry point: `proposeInboundEnhances({ skillsRoot, mode, minConfidence, ... })` |
| `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/propagate-enhances.ts` | Create | MCP tool handler wrapping the public entry point |
| `.opencode/skills/system-skill-advisor/mcp_server/tools/skill-graph-tools.ts` | Modify | Register `skill_graph_propagate_enhances` tool spec |
| `.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts` | Modify | Wire the new handler into the tool router |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/cross-skill-edges.vitest.ts` | Create | 3 fixture tests covering detection + apply + idempotence |
| `.opencode/skills/sk-prompt/graph-metadata.json` | Modify | Add `enhance_when` field declaring the prompt_quality_card rule |
| `.opencode/skills/system-skill-advisor/graph-metadata.json` | Modify | Add `enhance_when` field declaring the routable-skill rule |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Composite detector emits zero candidates against current HEAD state (post-backfill) | `propagateInboundEnhances({ mode: 'report' })` returns `candidates: []` because cli-* peers all have their inbound edges already present after 269ad9d75 + 99a606000 + baf39fd49 |
| REQ-002 | Composite detector detects gaps when fixtures synthetically remove existing inbound edges | Test fixture removes the `sk-prompt → cli-devin` edge from `sk-prompt/graph-metadata.json`; detector returns 1 candidate with confidence ≥ 0.80 and source `sk-prompt` |
| REQ-003 | Apply mode is idempotent | Running apply twice with the same candidate IDs results in 1 edge added, not 2. Re-running detect after apply returns 0 candidates for that edge |
| REQ-004 | Apply mode writes auto-marker fields | New edges in source `graph-metadata.json` carry `auto_added_at` (ISO 8601 UTC) and `auto_added_reason` (provenance string) per the codex research |
| REQ-005 | Edge type filtered to `enhances` only | Detector never emits `depends_on` / `siblings` / `conflicts_with` candidates. Hardcoded in detector + tested |
| REQ-006 | MCP tool registered and reachable | `mcp__mk_skill_advisor__skill_graph_propagate_enhances` invokable via the advisor MCP server; appears in `tools/list` |
| REQ-007 | Schema additive only | Existing `graph-metadata.json` parsers accept files with the new `enhance_when` field without errors. No `schema_version` bump |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | `enhance_when` field declared on sk-prompt | sk-prompt's `graph-metadata.json` includes `enhance_when: { skill_has_asset: "assets/cli_prompt_quality_card.md", weight: 0.4, context_template: "prompt quality card" }` |
| REQ-009 | `enhance_when` field declared on system-skill-advisor | system-skill-advisor's `graph-metadata.json` includes `enhance_when: { skill_has_files: ["SKILL.md", "graph-metadata.json"], weight: 0.7, context_template: "routes ${target.id} delegation requests" }` |
| REQ-010 | Confidence math matches codex research | Family contribution ≤ 0.45, asset-shape ≤ 0.30, sibling-transitivity ≤ 0.15. Max possible: 0.90. High-confidence cutoff 0.80. Tool default minConfidence 0.75 |
| REQ-011 | Edge weight inferred from same-family exemplars + clipped to [0.3, 0.7] | If existing same-family enhances entries have weights `[0.4, 0.4, 0.4]`, inferred weight is `0.4`. If weights vary, use median |
| REQ-012 | Context inference is deterministic | Either verbatim copy from exemplar OR template substitution. Never an LLM call at runtime |
| REQ-013 | Test fixtures use synthetic skills (not the real cli-* skills) | Fixtures are synthetic skills built per-test (e.g. via `mkdtempSync` + scaffolded `graph-metadata.json` files) and do not depend on production state. Static-file fixtures under `tests/fixtures/cross-skill-edges/` are an acceptable alternative pattern. |

### P2 — Nice-to-have (may defer)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-014 | `dryRun` flag default true | Tool default behavior is non-destructive even in `apply` mode unless `dryRun: false` is explicitly passed |
| REQ-015 | Stable candidate IDs | Each candidate has an `id` field that is a content hash of `(source, target, edge_type)`. Stable across runs so operator can reference specific IDs to apply |
| REQ-016 | Markdown report mode | Tool optionally outputs a human-readable Markdown summary of candidates (in addition to JSON) for operator inspection |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Running `skill_graph_propagate_enhances({ mode: 'report' })` against current HEAD (post v1.0.2.0 backfills) returns 0 candidates with no errors.
- **SC-002**: Synthetic fixture removing the `sk-prompt → cli-devin` enhances edge produces 1 candidate at confidence ≥ 0.80 with reason `"family-inference: 4/4 cli-family share"` or similar.
- **SC-003**: Apply mode round-trip (detect → apply → re-detect) yields 0 new candidates on the second detect (idempotent).
- **SC-004**: 3 vitest fixtures pass: cli-family arrival → 2 candidates; non-family arrival → 0 candidates; idempotent re-run → 0 candidates.
- **SC-005**: Bundled strict-validate passes on the phase folder.
- **SC-006**: MCP tool surfaces via `tools/list` and accepts the documented input schema.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | system-skill-advisor existing modules (`lib/skill-graph/`, `lib/derived/`, `handlers/`) | Module structure must follow existing patterns | Read `lib/skill-graph/skill-graph-db.ts`, `tools/skill-graph-tools.ts`, `handlers/skill-graph/validate.ts` for the pattern; do not import from `lib/skill-graph/` (separation per codex recommendation) |
| Risk | Detection false positives outside cli-* family | Med | Default tool threshold 0.75 + composite scoring + report-mode default mean false positives surface as "low-confidence candidates" the operator can ignore |
| Risk | Apply-mode edge writes break existing parsers | Low | Schema-additive only (auto-marker fields are ignored by existing code); pre-write JSON validation; tests round-trip parse |
| Risk | Edge-type expansion creep | Low | Hardcoded `enhances` filter + explicit test asserting other edge types never emitted |
| Risk | Snapshot drift after apply | Low | After apply, runtime daemon picks up the file change and re-indexes; `skill_graph_compiler.py` regenerated separately by operator (already a documented step) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Full repo scan (20 skills) completes in < 2s on a stock machine (no embedding calls)
- **NFR-P02**: Apply mode writes are O(1) per candidate (single jq-equivalent JSON read-modify-write)

### Security
- **NFR-S01**: Apply mode MUST NOT write outside `.opencode/skills/*/graph-metadata.json`. Path traversal guarded
- **NFR-S02**: Auto-marker fields are advisory metadata — never used as runtime trust signal (no "skip validation if auto_added" logic)

### Reliability
- **NFR-R01**: Idempotent across re-runs. Apply-mode write checks if edge exists before append
- **NFR-R02**: Validation runs before write — malformed JSON in target file causes apply to skip that target, not corrupt it
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- **Empty `enhances[]`**: source skill with no existing enhancements yields no candidates (family-share denominator = 0). Detector returns early
- **Single existing enhancement**: family-share metric requires ≥ 3 entries per codex research; skip family-inference for sources below the threshold (asset-shape can still match)
- **Same-family circular**: skill A is `family: cli` and enhances cli-codex; if A's family is cli too, detector skips (do not self-enhance via family-share — only enhance NON-self family members)

### Error Scenarios
- **Malformed source `graph-metadata.json`**: catch JSON.parse errors per skill; continue with remaining skills; report in tool output as `errors: [{ skill_id, error }]`
- **Target skill not in skill_nodes table**: skip candidate generation for that target with a `reason: "target not registered"` warning
- **Write permission denied**: apply mode catches EACCES, reports per candidate `applied: false, error: "EACCES"`, continues

### State Transitions
- **Existing edge exists in DB but NOT in source `graph-metadata.json`**: this is drift the system can't safely auto-fix. Report-only; operator decides whether to update source or remove from DB
- **Edge declared with different weight in source vs auto-inferred**: detector sees the edge as existing (matches on source_id + target_id + edge_type, ignores weight); no candidate emitted
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | ~200 LOC new + 3 test fixtures + 1 MCP tool wiring + 2 schema-additive jq patches |
| Risk | 8/25 | Additive only. Default mode is read-only. Apply gated on candidate IDs. No daemon-triggered writes |
| Research | 5/20 | Codex's 630-line research is the design baseline — already in `.opencode/specs/skilled-agent-orchestration/104-cli-devin-creation/evidence/cross-skill-auto-propagation-research-codex-2026-05-15.md` |
| **Total** | **25/70** | **Level 2** (well below Level 3 threshold; comfortable Level 2) |

Justification for Level 2 (not Level 1): aggregate LOC + cross-file changes + new MCP tool wiring + tests exceed Level 1's 100 LOC ceiling. Justification for not Level 3: no architectural decisions beyond the codex-research baseline; no ADRs required; single-module change.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the audit-mode run once automatically on advisor MCP server start (cold-start surface), or stay strictly on-demand? **Recommendation**: on-demand only in v1; daemon-trigger is v2 work
- Should `enhance_when` fields support multiple rules per skill (array of rules)? E.g. sk-prompt might want to enhance both `family: cli` skills with `prompt_quality_card.md` AND `family: deep` skills with the same asset. **Recommendation**: support array form from v1 (low cost; future-proofs)
- Asset-shape rule discoverability — when an operator authors a new enhancer skill, how do they know to add the `enhance_when` field? **Recommendation**: document in sk-doc skill_creation.md as a v2 follow-up
<!-- /ANCHOR:questions -->
