---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Closed the 013 deep-review's remaining non-code-graph coco/ccc/rerank residue across six surfaces plus a seventh found mid-work (dead daemon-kill rules in the RM-8 process harness). The P0 GEMINI.md coco routing is gone, /memory:manage is scoped back to the memory DB, and the harness only classifies daemons that can still spawn."
trigger_phrases:
  - "cross-surface residue summary"
  - "013 residue followup summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-deprecate-coco-index/015-remediate-cross-surface-residue"
    last_updated_at: "2026-05-25T16:10:00Z"
    last_updated_by: "main-agent"
    recent_action: "7 surfaces fixed; grep 0, tsc clean, vitest 20/20"
    next_safe_action: "Commit the cross-surface residue packet to main"
    blockers: []
    key_files:
      - ".gemini/GEMINI.md"
      - ".opencode/commands/memory/manage.md"
      - ".opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "remediate-cross-surface-residue-001"
      parent_session_id: null
    completion_pct: 95
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
| **Spec Folder** | 015-remediate-cross-surface-residue |
| **Completed** | 2026-05-25 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The 014 deprecation deleted CocoIndex + the rerank sidecar, and the sibling `014-remediate-codegraph-naming` packet cleaned the code-graph docs. This packet closes the rest: the non-code-graph surfaces the 013 deep-review flagged, plus one more found while answering an operator question about leftover daemon-kill logic. Every surface now reflects reality — nothing routes to, declares, classifies, or ignores a deleted artifact.

### Gemini routing (the P0)
`.gemini/GEMINI.md` was the only routing doc still sending Gemini to the deleted `mcp__cocoindex_code__search`. It now mirrors the canonical `.claude/CLAUDE.md` HYBRID policy: Code Graph structural search + Grep for concept/similarity discovery, exact text search for literal tokens, `memory_search` for spec docs only.

### /memory:manage scoped back to its domain
The command declared a `ccc <status|reindex|feedback>` subcommand and a CCC MODE section routing to removed `ccc_*` tools — even though its `allowed-tools` never wired any code-graph tool (the route was vestigial). Removed it everywhere (description, argument-hint, validate/error lists, purpose, action, instructions, routing tree, the CCC MODE section, and the error-handling row) and renumbered the trailing sections so the contract reads cleanly as a memory-DB manager.

### RM-8 process harness only tracks daemons that can spawn
While checking for leftover daemon-kill logic, the `process-memory-harness.ts` RM-8 classifier still carried `cocoindex-daemon` / `cocoindex-mcp` / `rerank-sidecar` kill rules, a `ccc-daemon` classification, owner-marker paths for the deleted `mcp-coco-index` + `system-rerank-sidecar` skills, a `RERANK_SIDECAR_OWNER_TOKEN`, and synthetic fixtures for those daemons. Since the skills are deleted (the daemons can't spawn from this repo), the operator approved removing them. The live-daemon rules (code-graph, spec-memory, ollama) and the RM-8 owner-proof discipline are untouched, and the operational `process-sweep.ts` was already coco-agnostic.

### Small dead refs
`.gitignore` dropped `.cocoindex_code/`; the embedder sidecar's env allowlist dropped the dead `RERANK_` prefix (the file stays — it serves the live embedder sidecar); the `250-session-start` playbook's `.venv/bin/ccc` checks became "code-graph readiness" (what the hook actually inspects). The advisor's tracked `scripts/skill-graph.json` was already clean; the gitignored `database/` runtime copy was synced from it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.gemini/GEMINI.md` | Modified | coco routing → canonical HYBRID |
| `.opencode/commands/memory/manage.md` | Modified | removed ccc subcommand + CCC MODE; renumbered §18→17, §19→18 |
| `.gitignore` | Modified | dropped `.cocoindex_code/` |
| `.opencode/bin/lib/sidecar-env-allowlist.cjs` | Modified | dropped dead `RERANK_` env prefix |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/22--context-preservation/250-session-start-startup.md` | Modified | `.venv/bin/ccc` (×3) → code-graph readiness |
| `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts` | Modified | removed coco/rerank daemon-kill rules + ccc-daemon class + fixtures |
| `.opencode/skills/system-spec-kit/scripts/tests/process-memory-harness.vitest.ts` | Modified | updated fixture/assertions/counts |
| `.opencode/skills/system-spec-kit/scripts/tests/process-sweep.vitest.ts` | Modified | re-pointed sidecar test to ollama; dropped ccc-daemon test |
| advisor `database/skill-graph.json` (gitignored) | Synced | local runtime copy refreshed from clean tracked source |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Per-surface, verify-first. Each 013 finding was re-confirmed against current reality before editing (and the repo-wide sweep's extra hits were classified — cli-* `pkill ccc search`, frozen `F-AC3`/`409` fixtures, and accurate removal-prose were correctly kept). The nuanced surfaces were investigated against code: the embedder allowlist is live (3 importers, kept), the session-start hook checks a readiness marker not a binary, the `/memory:manage` ccc route was unwired, and `process-sweep.ts` was already clean. The RM-8 harness change was operator-approved and gated by `tsc` (0 errors) and both process-* vitests (20/20 pass after re-pointing fixtures to kept daemons).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Remove the `/memory:manage` ccc route entirely (not rewire to code_graph) | The route called deleted `ccc_*` tools and was never wired (`allowed-tools` is memory-only); code-graph lifecycle belongs to the code-graph skill's tools / `/doctor code-graph` |
| Remove the RM-8 daemon-kill rules (operator-approved) | The skills are deleted so the daemons can't spawn; the rules were dead branches referencing deleted paths. Live-daemon rules + the runtime `pkill` sweep (a separate mechanism) are unaffected |
| Keep `sidecar-env-allowlist.cjs`, drop only `RERANK_` | The file is the live embedder sidecar's env allowlist (3 importers); only the rerank prefix was dead |
| Re-point tests to kept daemons rather than delete coverage | Keeps project-daemon + expected-daemon classification coverage using code-graph + ollama |
| Sync (not commit) the gitignored `database/skill-graph.json` | It's a runtime artifact; the tracked `scripts/` source was already clean |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Per-target grep (all 7 surfaces) | PASS — 0 residue each |
| `tsc -p scripts/tsconfig.json` | PASS — 0 errors |
| `process-memory-harness.vitest.ts` + `process-sweep.vitest.ts` | PASS — 20/20 |
| No orphaned `ccc-daemon`/`isCccProcess` consumer | PASS — 0 |
| manage.md sections gap-free + argument-hint well-formed | PASS |
| `validate.sh <packet> --strict` | (run at finalization) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Three borderline residue candidates deferred** (observed, not fixed here): `deep-loop-runtime/lib/deep-loop/README.md` "Rerank sidecar: …sidecar_ledger.py" line, `system-spec-kit/manual_testing_playbook.md` "CCC stubs/trio" old naming, and `sidecar-client.ts:170` cross-encoder comment. Tracked for a future pass; none is a live coupling.
2. **`database/skill-graph.json` sync is local-only** (gitignored). It self-heals on the next compile/daemon restart; the committed source-of-truth (`scripts/`) is clean.
<!-- /ANCHOR:limitations -->
