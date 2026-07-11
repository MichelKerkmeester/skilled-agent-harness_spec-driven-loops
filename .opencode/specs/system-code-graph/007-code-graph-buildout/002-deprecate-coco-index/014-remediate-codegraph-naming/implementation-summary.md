---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "system-code-graph's docs now describe the real tree-sitter skill instead of the deleted ccc/cocoindex bridge. Removed all literal ccc references plus the deprecation's botched ccc-to-structural-search rename residue across 13 docs; verified the actual code was already clean."
trigger_phrases:
  - "code-graph ccc residue summary"
  - "code-graph naming remediation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/002-deprecate-coco-index/014-remediate-codegraph-naming"
    last_updated_at: "2026-05-25T15:30:00Z"
    last_updated_by: "main-agent"
    recent_action: "Completed 13-doc cleanup; all residue-sweep gates green"
    next_safe_action: "Commit the remediation packet to main"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/feature_catalog/feature_catalog.md"
      - ".opencode/skills/system-code-graph/SKILL.md"
      - ".opencode/skills/system-code-graph/ARCHITECTURE.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "remediate-codegraph-naming-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-remediate-codegraph-naming |
| **Completed** | 2026-05-25 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

system-code-graph's source was already renamed to its own clean names during the 014 deprecation (`status.ts`/`scan.ts`/`verify.ts`, `code_graph_*` tools, tree-sitter engine, `lib/{ipc,shared,utils}/`), but its **documentation** never caught up. The 013 deep-review (iters 5–7) surfaced the residue; this packet aligns the docs to reality. You can now read any system-code-graph doc and it describes the real tree-sitter skill — no deleted `ccc` handlers, no phantom external "structural search" binary or bridge, no links to removed files.

### Cleared the literal `ccc` residue
Removed every `ccc` reference: the phantom `ccc-status.ts`/`ccc-reindex.ts`/`ccc-feedback.ts` handler entries (duplicates of the real `status.ts`/`scan.ts`/`verify.ts`), the dead `lib/ccc/` adapter, the deleted `feature_catalog/07--ccc-integration/` section, the deleted `references/integrations/ccc_bridge_integration.md` cross-refs, the dead `cccStatus`/`cccReindex`/`cccFeedback` schema fields in `tool_surface.md`, the ghost `retired-search-path.ts` and ghost test names, and the false "local `ccc` binary" prose.

### Cleared the *renamed* `ccc` residue (expanded scope)
The deprecation ran two global find-replaces — `ccc → "structural search"` and `ccc_* → "code_graph_* and detect_changes"` — that left misleading content the `ccc` grep can't catch. Removed: the false "structural search **bridge/binary/CLI/facade**" prose (code-graph is in-process tree-sitter, no binary), the phantom `code_graph_* and detect_changes` tool (4+ docs), the broken identifier `getstructural searchBinaryPath`, double-word garbles ("structural search search"), and the "separate semantic-index runtime" bridge claim (the runtime was cocoindex, now deleted). Verified against code: `code_graph_context` accepts `manual`/`graph` seeds only, there is no external binary, and there is no sqlite-vec/embedding path — so these were all false.

### Renumbered cleanly
Removing the `07--ccc-integration` section from `feature_catalog.md` and `manual_testing_playbook.md` left numbering gaps, so DOCTOR and the following sections were renumbered (feature_catalog 9→8; playbook 14–18→13–17) with matching ToC anchors, and the inventory counts were corrected (feature_catalog 17→14 features / 8→7 groups; playbook 19→16 scenarios).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/handlers/README.md` | Modified | ccc-*.ts → real handlers; dropped "ccc bridge" prose; added missing `classify-query-intent.ts` |
| `README.md` | Modified | §3.5 reframed `structural search Bridge` → `INDEX LIFECYCLE` with real handler paths; removed bridge cross-ref; fixed semantic-runtime prose |
| `SKILL.md` | Modified | removed dead `ccc_`/`ccc` keywords, dead `structural` INTENT_SIGNAL + resource block, bridge refs (×3), phantom-tool garble (×4), `(structural search)` garble |
| `feature_catalog/feature_catalog.md` | Modified | removed `07--ccc-integration` section + ToC + table row; renumbered DOCTOR 9→8; fixed counts; phantom-tool + seed garbles |
| `references/runtime/tool_surface.md` | Modified | removed 3 phantom `cccStatus`→`lib/ccc/` rows + 3 phantom "structural" binary rows + bridge cross-ref + seed/phantom-tool garbles |
| `manual_testing_playbook/manual_testing_playbook.md` | Modified | removed `07--ccc-integration` section + ToC + table row; renumbered 14–18→13–17; fixed counts + garbles |
| `mcp_server/tools/README.md` | Modified | dropped `ccc_*` from tool list; ghost telemetry test → real |
| `mcp_server/lib/shared/README.md` | Modified | removed `retired-search-path.ts` rows + broken `getstructural searchBinaryPath` + "ccc binary path" |
| `mcp_server/tests/README.md` | Modified | ghost `…retired-search-telemetry-passthrough.vitest.ts` → real test |
| `mcp_server/tests/lib/README.md` | Modified | removed `shared/retired-search-path.ts` ref |
| `mcp_server/stress_test/code-graph/README.md` | Modified | "CCC bridge" prose + ghost `ccc-integration-stress.vitest.ts` |
| `ARCHITECTURE.md` | Modified | "structural search bridge" subsystem → "Index lifecycle"; fixed diagram + topology comment; dropped false sqlite-vec/semantic-runtime claims |
| `feature_catalog/mcp-tool-surface/01-tool-registrations.md` | Modified | phantom `code_graph_* and detect_changes` tool name |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Surgical per-file edits, gated by grep. Before each removal I mapped the reference to the real tree (handler files, tool dispatch, test files, seed providers) so replacements point at things that exist and I didn't delete anything live. The 013 deep-review findings were independently re-verified by exact grep first — and that verification caught my own broken comprehensive-grep pattern, which had falsely returned "0 residue." The fix is documentation-only; the actual code was confirmed clean (no `.ts` leakage of the renamed identifiers).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reframe README §3.5 rather than delete it | `code_graph_status`/`scan`/`verify` are real tools whose only doc home was that section; deleting would lose them, so it became "INDEX LIFECYCLE" pointing at real handlers |
| Delete the `07--ccc-integration` catalog/playbook sections outright | They were pure duplicates of the real scan/verify/status sections under the dead ccc-bridge framing, linking to a deleted dir |
| Expand scope to the `ccc → "structural search"` rename residue | It's the same defect and directly violates "code-graph uses its own names"; leaving it would be grep-clean for `ccc` while still describing a phantom external binary |
| Renumber sections to avoid gaps | A ToC jumping 12→14 reads like a defect I introduced; renumbering keeps the cleaned docs professional |
| Verify seed providers / sqlite-vec from code before reframing | Avoided fabricating capability claims — confirmed seeds are manual/graph only and there's no embedding path, so the "semantic seed"/"sqlite-vec" prose was provably residue |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `rg -i ccc` over system-code-graph (excl changelog/dist/package-lock) | PASS — 0 matches |
| Dead-link sweep (`07--ccc-integration`, `ccc_bridge_integration`, `retired-search-path`, `lib/ccc`, ghost tests) | PASS — 0 |
| Full rename-residue sweep (`code_graph_* and detect_changes`, `structural search`, `getstructural`/`searchBinaryPath`, `separate semantic-index runtime`, `retired-search`) | PASS — 0 (only ARCHITECTURE.md's explicit *negation* of the runtime remains, intentional) |
| Replacement targets exist (status/scan/verify/classify-query-intent handlers, real context test, code-graph-tools.ts) | PASS |
| Code leakage check (`structural search`/`getstructural` in `*.ts`) | PASS — 0 (docs-only) |
| ToC↔heading numbering (feature_catalog 1–8, playbook 1–17) | PASS — gap-free, consistent |
| `validate.sh <packet> --strict` | (run at finalization — see commit) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Scope is system-code-graph only.** Other 013 deep-review residue findings — `.gemini/GEMINI.md` coco routing (P0), `/memory:manage` ccc subcommand, advisor `database/skill-graph.json`, `.gitignore`, `.opencode/bin/lib/sidecar-env-allowlist.cjs` `RERANK_`, and the system-spec-kit `250-session-start` `.venv/bin/ccc` playbook — are out of scope here and remain for a separate remediation per the operator directive ("make sure **code graph** uses his own unique names").
2. **`tool-schemas.ts` path references not audited.** Several docs cite `mcp_server/tool-schemas.ts`; that file's existence/accuracy was not part of this ccc-scoped pass (no `ccc` content).
<!-- /ANCHOR:limitations -->
