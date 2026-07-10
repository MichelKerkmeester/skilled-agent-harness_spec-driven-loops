---
title: "Verification Checklist: README cluster update [system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/003-readme-cluster-update/checklist]"
description: "Verification checklist for the README cluster refresh: anchor-traced accuracy, env documentation, schema narrative, front-proxy and error-code surface, tool-count preservation, sk-git cross-ref, footer bump, and strict validation."
trigger_phrases:
  - "readme cluster update checklist"
  - "003 readme cluster update checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/014-docs-and-stress-test-refresh/003-readme-cluster-update"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Checklist items verified against shipped cluster edits"
    next_safe_action: "None binding; sibling 004 stress-test durability domain"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Verification Checklist: README Cluster Update

<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

- The Iron Law: no completion claim without the stack-appropriate verification (`validate.sh --strict` for docs) passing.
- Each item is checked `[x]` only with concrete evidence (source anchor, observed line, or validate result).
- Every behavioral claim added to the cluster must trace to a verified deployed source anchor.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] All three artifact files read in full before editing. <!-- README.md, mcp_server/README.md, ENV_REFERENCE.md read -->
- [x] CHK-002 [P0] Source anchors verified against deployed code (schema v30/migs 28-30, context-server:1014/:2126, checkpoints symbols, health block, front-proxy error codes, sk-git convention). <!-- all verified via rg/sed against source -->
- [x] CHK-003 [P0] `36`-tool count confirmed from `TOOL_DEFINITIONS` (`tool-schemas.ts`) before any number is touched. <!-- 36 entries confirmed; count preserved -->
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every added claim traces to a cited source anchor; no loose paraphrase. <!-- prose carries file:line citations where load-bearing -->
- [x] CHK-011 [P0] `-32001` documented precisely as the LIVE launcher retryable recycle error (not "removed"); only the index vector-drain outage path stopped surfacing its own class. <!-- error-code note states this precisely; cites launcher-session-proxy.cjs:18-22 -->
- [x] CHK-012 [P0] `-32002` documented as the non-retryable protocol fail-closed (terminal CLOSED). <!-- error-code note covers -32002 -->
- [x] CHK-013 [P0] Comment hygiene: edits are prose docs; no source CODE comment gains a spec-path/packet/finding label. <!-- docs-only; no code comments touched -->
- [x] CHK-014 [P1] Additive/surgical: new subsections + one env row + footer bump in the existing format; no doc restructure. <!-- additive subsections only -->
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `validate.sh --strict` on the packet exits Errors: 0. <!-- validate.sh --strict Errors: 0 -->
- [x] CHK-021 [P1] No code tests required (docs-only). <!-- test.ran=false; docs-only -->
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] SC1: `SPECKIT_BACKEND_ONLY` in skill README env section + ENV_REFERENCE §2 row, both sourced to `context-server.ts:2126`. <!-- env row + ENV_REFERENCE row added -->
- [x] CHK-031 [P0] SC2: §3.2 schema v28->v30 + `.needs-rebuild` subsection naming migs 28/29/30. <!-- subsection added -->
- [x] CHK-032 [P0] SC3: front-proxy / in-place daemon recycle / RSS-recycle subsection + error-code note (E429, -32001 LIVE, -32002 fail-closed). <!-- subsection + note added -->
- [x] CHK-033 [P1] SC4: `mcp_server/README.md` deep-reference parity (checkpoint-v2, enrichment marker, front-proxy, schema v30); `36`-tool reference unchanged. <!-- parity rows added; 36 preserved -->
- [x] CHK-034 [P1] SC5: footer bumped (version + 2026-06-02 + "Current docs cover" line). <!-- footer bumped -->
- [x] CHK-035 [P1] sk-git `wt/{NNNN}-{name}` + `.worktrees/{NNNN}-{name}` convention cross-referenced where the README covers git/worktree workflow. <!-- cross-ref added -->
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P1] No runtime/behavior change; docs-only. <!-- markdown + env-table edits only -->
- [x] CHK-041 [P0] No new external surface introduced by the docs. <!-- no commands/secrets added -->
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] `implementation-summary.md` reconciled to the shipped cluster edits with real evidence. <!-- impl-summary reconciled below -->
- [x] CHK-051 [P1] Continuity (`_memory.continuity`) updated at the packet boundary. <!-- completion_pct: 100 -->
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] All edits confined to the three artifact files in spec.md §3. <!-- README.md + mcp_server/README.md + ENV_REFERENCE.md only -->
- [x] CHK-061 [P1] Packet docs under `003-readme-cluster-update/`; `description.json` + `graph-metadata.json` present. <!-- packet docs + metadata present -->
- [x] CHK-062 [P1] No parent metadata or sibling child files touched. <!-- scope locked; no sibling/parent writes -->
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Area | Result | Status |
|------|--------|--------|
| Source-anchor accuracy | All claims traced to deployed source | complete |
| Env documentation (SC1) | `SPECKIT_BACKEND_ONLY` in README + ENV_REFERENCE | complete |
| Schema narrative (SC2) | v28->v30 + `.needs-rebuild` subsection | complete |
| Front-proxy + error codes (SC3) | subsection + E429/-32001/-32002 note | complete |
| mcp_server parity (SC4) | checkpoint-v2 + enrichment + front-proxy + v30; 36 preserved | complete |
| Footer + sk-git (SC5) | version/date/cover line bumped; wt/ convention cross-ref | complete |
| `validate.sh --strict` | Errors: 0 | complete |
<!-- /ANCHOR:summary -->
