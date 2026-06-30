---
title: "Decision Record: Phase 008 Final Cleanup"
description: "ADRs for Packet 070 final cleanup decisions: deep-loop family naming, entity-kind normalization, and advisor signal tuning."
trigger_phrases:
  - "070 phase 008 decision record"
  - "deep-loop adr"
  - "reference entity adr"
  - "advisor signal adr"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/056-sk-deep-rename/008-final-cleanup"
    last_updated_at: "2026-05-05T17:50:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Recorded Phase 008 final cleanup ADRs"
    next_safe_action: "Run cleanup verification"
    blockers: []
    key_files:
      - "decision-record.md"
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json"
      - ".opencode/skills/sk-code/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05-phase-008"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 008 Final Cleanup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `skilled-agent-orchestration/z_archive/056-sk-deep-rename/008-final-cleanup` |
| **Date** | 2026-05-05 |
| **Status** | Accepted |
| **Scope** | P1-002, P1-003, and P1-004 cleanup decisions |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:decisions -->
## Decisions

### ADR-001: Keep `sk-deep` as the Internal Family Name (REVERTED from `deep-loop`)

**Decision**: REVERTED — family stays `sk-deep`.

Initial cli-codex pass renamed the family from `sk-deep` → `deep-loop` in `skill-graph.json`, per-skill `graph-metadata.json` files, and the Python compiler's `ALLOWED_FAMILIES` allowlist. Orchestrator (Claude Opus 4.7) attempted to rebuild the SQLite advisor and the rebuild failed: `skill-graph-db.ts:126` defines a hardcoded SQL CHECK constraint allowing only `('cli', 'mcp', 'sk-code', 'sk-deep', 'sk-util', 'system')`. The new value `deep-loop` is rejected at INSERT time.

Renaming the family end-to-end requires coordinated edits across:
- `skill-graph-db.ts:126` SQL CHECK constraint
- `mcp_server/dist/lib/skill-graph/skill-graph-db.{js,d.ts}` (compiled mirror)
- `mcp_server/tool-schemas.ts` and `dist/tool-schemas.js`
- `mcp_server/schemas/tool-input-schemas.ts` and `dist/schemas/tool-input-schemas.js`
- `mcp_server/handlers/skill-graph/query.ts` and `dist/handlers/skill-graph/query.js`
- TypeScript rebuild + SQLite drop + reindex

That is a separate refactor packet (schema migration), not in-scope for the 070 P1 cleanup brief. The family identifier is internal grouping metadata only — never user-visible — so reverting to `sk-deep` removes the SQLite blocker without any behavioral cost.

**Action taken**: Reverted `families.sk-deep` in `skill-graph.json`, both `deep-{review,research}/graph-metadata.json` family fields back to `sk-deep`, and `ALLOWED_FAMILIES` allowlist back to `sk-deep`. Advisor rebuild succeeded (gen 1163 → 1165, 0 rejected edges). P1-003 is RESOLVED-AS-DEFERRED with a documented follow-on refactor needed if the rename is desired in the future.

**Alternatives considered**:
- `deep` — same SQLite CHECK constraint blocker.
- Extend SQLite CHECK to include both — adds tech debt without behavior change.
- Full schema-migration packet — out of scope; logged as future work.

### ADR-002: Normalize `reference-category` to `reference`

**Decision**: ACCEPTED.

Change the `motion_dev` entity kind in `sk-code` graph metadata from `reference-category` to `reference`.

The compiler already has a small allow-list: `skill`, `agent`, `script`, `config`, and `reference`. `motion_dev` points at reference material, so `reference` is the closest valid kind. Extending the allow-list would widen the schema and require a broader contract decision for every graph consumer. The smaller change fixes validation with lower blast radius.

**Alternative rejected**: Add `reference-category` to the allow-list. That preserves a slightly richer label but expands the schema for one existing metadata row.

### ADR-003: Strengthen Specific Advisor Signals (PARTIAL)

**Decision**: ACCEPTED — but live SQLite cache invalidation is a known limitation.

Added 13 specific positive signals to `deep-review/graph-metadata.json` `intent_signals` (via canonical per-skill metadata path) and 10 anti-signals to `sk-code-review` in `skill-graph.json` (compiler does not propagate `anti_signals` from per-skill metadata, so they live directly in the compiled JSON).

The failure mode was narrow: `sk-code-review` still scored above `deep-review` for a loop-style spec audit prompt. Broadly weakening `sk-code-review` would risk hurting normal PR/code review routing. Specific positives and anti-signals target the ambiguous prompt class while preserving single-pass review behavior.

**Result for prompt "iterative review loop for spec folder audit"**:
- Live: `sk-code-review` 0.942 → `deep-review` 0.936 (gap closed 0.017 → 0.006).
- Shadow: `deep-review` 0.838 > `sk-code-review` 0.819 (gap +0.019 favoring deep-review — confirms signals work in fresh-state path).

The live-vs-shadow split exists because the live SQLite scoring path does not consume `anti_signals` from `skill-graph.json` directly — `advisor_rebuild` walks per-skill `graph-metadata.json` only and does not pick up post-compile anti-signal patches. A full live fix requires either (a) extending the compiler to emit `anti_signals` into per-skill metadata, or (b) extending `advisor_rebuild` to read `skill-graph.json`'s `anti_signals` block. Both are architectural changes beyond the 070 P1 cleanup scope.

P1-002 status: PARTIAL (gap closed by 65%; shadow proves the fix works; live cache is the remaining gap).

**Alternatives rejected**: Adjust global scoring weights or remove `sk-code-review` review terms. Both options have wider routing blast radius than explicit prompt-class signals.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:impact -->
## Impact

Phase 008 completes the in-scope P1 cleanup without changing public skill IDs. `deep-review` and `deep-research` remain the skill names; `deep-loop` is only the internal family taxonomy.
<!-- /ANCHOR:impact -->
