---
title: "Implementation Summary"
description: "What the five-iteration inventory produced, how it was verified and the two deviations worth carrying forward."
trigger_phrases:
  - "inventory summary"
  - "memory surface findings"
  - "research outcome"
  - "containment false positive"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/017-memory-database-decommission/006-legacy-memory-surface-inventory"
    last_updated_at: "2026-09-02T19:47:00Z"
    last_updated_by: "claude-code"
    recent_action: "Filled the Level 1 planning docs for the completed inventory research"
    next_safe_action: "Confirm phases 002 and 003 cite this synthesis"
    blockers: []
    key_files:
      - "research/lineages/luna-max/research.md"
      - "research/lineages/luna-max/inventory.external.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-049-memory-decommission"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-legacy-memory-surface-inventory |
| **Status** | Complete |
| **Completed** | 2026-09-02 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The packet no longer plans its rewire and its deletion against an estimate. Five forced research iterations produced a classified census of every surface in the repository that names the system-spec-memory subsystem, and the two build phases now have a worklist instead of a guess.

### The classified inventory

The synthesis at `research/lineages/luna-max/research.md` records 18,799 external paths and 92,554 matching hit lines, each carrying a path, a line, a surface type, a reference kind, a lifecycle label, an owning phase and a concrete action. Counts are broken out three ways: by surface type, by reference kind and by owning phase. The tree being deleted is represented once as an aggregate, and its 41 exposed tools are listed by name, which confirms the parent's tool count.

The parent's other estimates did not survive contact. The tracked server tree is 1,481 files rather than 1,480. The 373-flag figure reproduces on neither scope, since the server tree carries 410 flag identifiers and the external scope carries 872. The roughly 167 consumer figure turns out to be a logical ownership estimate rather than a path count, and it still needs owner-by-owner reconciliation.

Five seams still speak the old contract and would break under a broad deletion: `workflow.ts` importing the server indexing API, orphan and session cleanup sharing daemon and socket logic, shared embeddings and the HF model server and IPC serving system-skill-advisor, deep-loop YAML and reducer and ledger state using memory persistence and templates and install scripts and catalogs that generate future consumers. Against those, section 11 sets a preserve set naming what must survive phase 003.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/lineages/luna-max/iterations/iteration-001.md` to `iteration-005.md` | Created | One file per forced iteration, widening from registrations to consumers to parity |
| `research/lineages/luna-max/research.md` | Created | The synthesis: counts, worklists, break-risk seams, preserve set |
| `research/lineages/luna-max/inventory.external.json` | Created | The authoritative row-level artifact, 69 MB, kept out of git |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modified | Level 1 packet docs describing the completed run |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One detached lineage on `cli-codex` with model `gpt-5.6-luna`, max reasoning, fast service tier. Stop policy was `max-iterations` at five, and convergence was recorded as telemetry only, so the loop never synthesized early. All five iterations completed in a single attempt. Every write landed inside `research/lineages/luna-max/`, and no parent document, memory database or git index was touched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Five forced iterations with convergence as telemetry | An inventory that stops when new information slows is an inventory with holes in it |
| The row artifact is authoritative and the synthesis tables are summaries | A summary cannot answer an owner-by-owner question, and the build phases need the rows |
| Scan case-insensitively with `--no-ignore-global` | The default ignore behavior was hiding root `opencode.json` and `.utcp_config.json` |
| Classify lifecycle by path structure | A conservative structural label triages 18,799 paths without claiming semantic knowledge it does not have |
| Treat the mcp-server tree as one aggregate | The tree being deleted would otherwise flood the consumer counts it exists to inform |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Five iterations completed, stop reason recorded | PASS. `iteration-001.md` through `iteration-005.md` on disk, stop reason `maxIterationsReached` in `research.md` |
| Final case-insensitive scan-to-artifact parity audit | PASS. Zero extra rows, zero stale rows, zero parser errors, zero required-field omissions, zero exclusion violations, zero malformed path keys |
| Row completeness | PASS. 92,554 rows across 18,799 paths, each with all seven required fields |
| Negative controls after bypassing the global ignore | PASS. `.devin`, `.claude/hooks`, root `CLAUDE.md`, root `REPO RULES.md` and `.utcp_config.json` return zero target rows |
| Packet docs | `validate.sh --strict` on this folder |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The driver's final verdict was rejected on a containment false positive.** The sibling research phase 005 relaunched concurrently, and its untracked files were counted against this lineage as a containment breach. Nothing was lost: all five iterations, the synthesis and the row artifact are intact on disk, and every one of them sits inside this lineage directory.
2. **The row artifact is 69 MB and stays out of git.** `research/lineages/luna-max/inventory.external.json` is cited by path and read directly. It is reproducible from the recorded scan rather than recoverable from history, and it should not be opened casually.
3. **Lifecycle is a path-structure label, not a semantic verdict.** A live implementation target that happens to sit under a research or report directory reads as historical. Phase 002 must re-open ambiguous rows at edit time.
4. **No repository tests were run by this lineage.** Repository tooling and out-of-scope writes were prohibited, so the implementation phases own the authoritative runtime and test gates.
<!-- /ANCHOR:limitations -->

---
