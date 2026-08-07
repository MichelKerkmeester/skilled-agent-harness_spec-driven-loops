---
title: "Implementation Summary: Phase 1: research"
description: "Completed /deep:research fan-out over the Refero MCP surface: 10/10 iterations across three first-attempt lineages, canonical synthesis with 66 citations and three preserved conflicts, existing refero UTCP manual validated as-is."
trigger_phrases:
  - "refero research summary"
  - "mcp-refero phase 001 summary"
  - "refero fan-out results"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/009-mcp-refero/001-research"
    last_updated_at: "2026-07-16T15:05:07Z"
    last_updated_by: "claude"
    recent_action: "Compiled canonical research.md + resource-map.md from 3 completed lineages"
    next_safe_action: "Author mcp-refero transport packet in phase 002 from research/research.md"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/009-mcp-refero/001-research/research/research.md"
      - ".opencode/specs/mcp-tooling/009-mcp-refero/001-research/research/resource-map.md"
      - ".opencode/specs/mcp-tooling/009-mcp-refero/001-research/research/deep-research-findings-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-001-refero-research-complete"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "End-to-end OAuth handshake through mcp-remote remains Inferred (protected-resource-metadata 404) pending operator authorization"
    answered_questions:
      - "Code Mode callable form? Doubled prefix refero.refero_refero_<tool> (live-verified); confirm with tool_info after registration"
      - "Plan gating? Pro 8,000 MCP calls/month; Free tier has NO MCP access"
      - "Existing refero UTCP manual? Validated as-is by all three lineages — no changes needed"
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
# Implementation Summary: Phase 1: research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Completed** | 2026-07-16 |
| **Level** | 1 |
| **Phase** | 1 of 4 |
| **Successor** | ../002-skill-authoring/ |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

A completed deep-research fan-out over the Refero MCP developer surface — 10/10 iterations, forced depth:

- `research/research.md` — canonical 17-section synthesis (48KB, 66 `[SOURCE:]` citations): Cross-Lineage Reconciliation Ledger (14 rows), findings A–H, Eliminated Alternatives (25 rows), Divergence Map, 10 open questions, Convergence Report; all five validator anchors paired.
- `research/resource-map.md` — consolidated from lineage maps + external-URL inventory (17 rows), local paths re-verified.
- `research/deep-research-findings-registry.json` + `fanout-attribution.md` — merged (2 registries + 1 registry-less lineage weighed via its synthesis), 7 key findings.

Key findings feeding phase 002: 18 merged findings incl. the full 8-tool Refero surface; Code Mode callable is the doubled-prefix `refero.refero_refero_<tool>` form (live-verified, glm's single-prefix form was a convention misapplication); Pro plan 8,000 MCP calls/month, Free tier has no MCP; `response_format` spans the seven text tools, never the image tool; the EXISTING `refero` UTCP manual is validated byte-for-byte as-is — phase 003 verifies rather than edits it.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

One fan-out run via the deep-research command workflow (`fanout-run.cjs`, concurrency 3) with the scoped-`CODEX_HOME` launch recipe root-caused on the 008 run; registry merge via `fanout-merge.cjs`; orchestrator-dispatched synthesis with conflict preservation:

| Lineage | Executor | Iterations | Duration | Result |
|---------|----------|------------|----------|--------|
| sol | cli-codex gpt-5.6-sol xhigh fast | 5/5 | ~23.9 min | fulfilled first-attempt, 40.7KB synthesis |
| glm | cli-opencode zai-coding-plan/glm-5.2 max | 2/2 | ~20.0 min | fulfilled first-attempt, 18KB synthesis |
| luna | cli-codex gpt-5.6-luna max fast | 3/3 | ~23.0 min | fulfilled first-attempt, 29.6KB synthesis |

Zero failed attempts across the pool — direct validation of the scoped-`CODEX_HOME` fix (same luna model needed 6 futile attempts + a solo rerun on 008 without it).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

- **Launch recipe carried forward from 008:** codex lineages on `danger-full-access` (network is load-bearing; `workspace-write` blocks it) under scoped `CODEX_HOME` with `project_doc_max_bytes=0` (prevents repo-gate over-application by codex workers).
- **Conflict posture:** three cross-lineage conflicts preserved, not averaged — callable-name form (resolved toward sol's live evidence, with mandatory post-registration `tool_info` confirmation), gating documentation (glm's negative finding scoped to the marketing-site layer), `response_format` scope (local catalog corroborates sol).
- **UTCP manual left untouched:** all lineages validate the existing registration; phase 003 performs read-only verification only.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## 5. VERIFICATION

- Pool exit `status: ok`, all three lineages `fulfilled` (run summary JSON) with 5/2/3 iteration files present per lineage.
- Merge reported `merged_lineages: 2, skipped_no_registry: 1, key_findings: 7`; the registry-less lineage's findings enter via its synthesis file.
- Synthesis agent re-verified the doubled-prefix callable claim against the local live-verified catalog before compiling, and re-checked all 13 local resource-map paths.
- `tasks.md` 10/10 `[x]` with evidence; phase folder re-validated `--strict` at close-out.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

- End-to-end OAuth through `mcp-remote` is Inferred, not confirmed (protected-resource-metadata endpoint 404s); first live call requires operator authorization.
- Paid-only capabilities were not probed live (no Pro credential in the loop); they carry citations from doc.refero.design, flagged as documented-not-exercised.
- 10 open questions remain in `research/research.md`; phase 002 marks unconfirmed facts UNKNOWN rather than inventing them.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- **Specification**: `spec.md` · **Plan**: `plan.md` · **Tasks**: `tasks.md`
- **Canonical research**: `research/research.md`
<!-- /ANCHOR:cross-refs -->
