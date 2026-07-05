---
title: "Implementation Summary: Review Registry and Metadata Backfill"
description: "Summary of the 14-finding disposition pass, the graph-metadata-parser.ts key_files fix, and the description-generator truncation fix."
trigger_phrases:
  - "review registry metadata backfill implementation summary"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/009-research-backlog-remediation/006-review-registry-and-metadata-backfill"
    last_updated_at: "2026-07-01T15:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Investigated by GPT-5.5 xhigh, dispositions/backfill/rebuild completed by Sonnet 5"
    next_safe_action: "Phase complete; move to child 007-parent-scaffold-and-governance-docs"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/description/packet-synopsis.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `deep-loops/030-deep-loop-improved/009-research-backlog-remediation/006-review-registry-and-metadata-backfill` |
| **Completed** | 2026-07-01 |
| **Level** | 1 |
| **Implemented by** | `openai/gpt-5.5-fast` (`--variant xhigh`) via `cli-opencode` (investigation + truncation fix), completed by Claude Sonnet 5 (dispositions, key_files generator fix, backfill) |
| **Verified by** | Claude Sonnet 5 (orchestrating session) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Dispositioned all 14 undispositioned review findings (glm's 9 + codex's 5) with direct current-code evidence; fixed a real generator gap where `graph-metadata.json`'s `key_files` never read a folder's own `spec.md` frontmatter (only doc prose), leaving `008-loop-systems-remediation` stuck with stale doc-only key_files despite its own frontmatter already naming the real runtime scripts; fixed the description-generator's mid-word truncation bug in both of its reachable code paths.

### Finding Dispositions

| ID | Disposition | Evidence |
|----|-------------|----------|
| glm P1-001 | resolved | `fanout-run.cjs` `setupBindings` block pre-binds review_target/review_target_type/review_dimensions/spec_folder/execution_mode/lineage_mode for review/context loops |
| glm P1-002 | resolved | Non-zero exit/timeout throws (not returns), preventing pool from recording a failed lineage as fulfilled |
| glm P1-003 | resolved | `cli-guards.cjs` `ARTIFACT_MISS` retryable class exists for mixed salvage (salvaged>0 && failed>0) |
| glm P1-004 | resolved | `--dangerously-skip-permissions` gated behind explicit `danger-full-access` opt-in; default lineages run under normal CLI permission enforcement |
| glm P1-005 | resolved | `fanout-run.vitest.ts` contains the exact named regression test ("exit-0/no-artifact... not fulfilled"); independently re-run, passes |
| glm P1-006 | resolved | 008's Phase Documentation Map shows all 7 children Complete, no placeholders; 009's own Status correctly reads "In Progress" (not falsely Complete) while children remain pending |
| glm P1-007 | resolved (this cycle) | `graph-metadata-parser.ts` fixed to read frontmatter `key_files`; root + 008 regenerated with real surfaces |
| glm P2-009-001 | resolved | `lag_ceiling_exceeded`/`lag_ceiling_abort` map to typed `warning`/`failed`, never fall through to `unknown` |
| glm P1-011-001 | resolved | `reconstructReviewRegistryFromState()` exists and is wired in `fanout-merge.cjs` (shipped by 009/001) |
| codex F001 | resolved | Same evidence as glm P1-006 |
| codex F002 | **active** | `deep_review_auto.yaml`'s `step_create_config` always generates a fresh `sessionId: "{ISO_8601_NOW}"` rather than reusing the fan-out lineage's own `session_id` (present in `fanout-run.cjs`'s general params but not threaded into the review-specific `setupBindings`) |
| codex F003 | **active** | `fanout-run.cjs` sets `agentName = 'deep-review'` (the LEAF one-iteration agent) for review loops, and the prompt says "execute the review loop" — still asks the leaf agent to run the full multi-iteration loop |
| codex F004 | resolved | `fanout-run.vitest.ts` independently re-run: 34/34 pass; cited failure doesn't reproduce |
| codex F005 | resolved | `deep_review_auto.yaml:395` is now durable prose with no marker; fixed by 009/003 |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `review/lineages/glm/deep-review-findings-registry.json` | Modified | Added `disposition` + `disposition_evidence` to all 9 findings |
| `review/lineages/codex/deep-review-findings-registry.json` | Modified | Added `status`/`disposition`/`disposition_evidence` to all 5 findings. **Left untouched**: the registry's own aggregate `openFindingsCount`/`resolvedFindingsCount`/`findingsBySeverity`/`convergenceScore`/`graphDecision` fields — these feed a `resolvedFindings` array split whose exact downstream-consumer contract (deep-review's own reducer/graph-decision logic) wasn't investigated; changing them without understanding that contract risked a worse inconsistency than leaving them as pre-existing values |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | Modified | `deriveKeyFiles()` now merges `spec.md` frontmatter `_memory.continuity.key_files` (via the existing `extractFrontmatterArray()` utility) ahead of doc-prose-derived candidates |
| `.opencode/skills/system-spec-kit/mcp_server/lib/description/packet-synopsis.ts` | Modified (by dispatch) | Added `truncateSynopsisAtWordBoundary()`; `derivePacketSynopsis()` now uses it instead of a raw `.slice()` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` | Modified (by dispatch) | `extractDescription()`'s 3 call sites now use the shared word-boundary clamp instead of raw `.slice()` |
| `.opencode/skills/system-spec-kit/mcp_server/tests/generator-hardening.vitest.ts` | Modified | New RED-tested regression: a real file named only in `spec.md` frontmatter `key_files` (not doc prose) is now included in `derived.key_files` |
| `.opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts` | Modified (by dispatch) | New regression: legacy (drift-gate-off) path doesn't cut mid-word |
| `.opencode/skills/deep-loops/030-deep-loop-improved/008-loop-systems-remediation/graph-metadata.json`, root `graph-metadata.json`, root `description.json` | Regenerated | Real `key_files`; non-truncated description |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Dispatched to `openai/gpt-5.5-fast` (`--variant xhigh`) via `cli-opencode` with concrete live-repro evidence (the exact truncation bug's current output, the two `.slice()` call-site locations, and 2 pre-verified finding leads). The dispatch did real investigative work for most of Part A (per its own narration: verified prompt bindings, salvage-retry logic, permission-bypass gating, lag-ceiling status mapping, and registry-reconstruction existence) and correctly implemented the truncation fix in both reachable code paths with regression tests — but got absorbed into a long build-system debugging detour (`tsc --build` silently not emitting `dist/` despite exit 0) and **never wrote its Part A investigation conclusions back into the registry JSON files**. It stopped and asked for approval on two scope-boundary questions (adding `graph-metadata-parser.ts` to allowed writes; allowing a `description.json` rewrite) rather than guessing past its instructions — correct behavior, but it left Part A entirely undone and Part B partially blocked.

This orchestrating session picked up from there: independently re-verified each of the dispatch's partial conclusions against live code (not transcribed blindly — confirmed via direct file reads and one live test re-run per finding), investigated the remaining unconfirmed findings itself (codex F002, F003 — concluding these are still genuinely open, unlike the dispatch's other leads), approved and implemented both flagged deviations (the `graph-metadata-parser.ts` fix, with its own RED-before-GREEN test; the `description.json` regeneration), wrote the 14 dispositions into both registries, rebuilt, and regenerated all affected metadata.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Approved both of the dispatch's flagged deviations** after independently confirming each was a genuine, narrowly-scoped gap (not scope creep): `graph-metadata-parser.ts` needed the fix because the scoped backfill script's invocation was correct but the underlying generator ignored frontmatter entirely; `description.json` is exactly the artifact Part C's own verification step needed to produce.
- **Did not blindly transcribe the dispatch's own narrated conclusions into the registries.** Independently re-checked each cited file/line myself, and for the two findings the dispatch was uncertain about (codex F002/F003), did the investigation from scratch rather than defaulting to "probably fine."
- **`deriveKeyFiles()` fix is purely additive** (merges one more candidate source, never removes existing prose-extraction behavior) — confirmed safe by running the full existing `graph-metadata`/`generator-hardening`/`folder-discovery` test suites (72+16 tests) plus the full `mcp_server` suite before finalizing.
- **Left codex's registry aggregate counts untouched.** Tagging individual findings' `disposition` is safe and matches the task's actual intent; recalculating `openFindingsCount`/`convergenceScore`/`graphDecision` risked breaking a downstream contract (the deep-review reducer/graph-decision logic) that wasn't part of this backlog item's investigation.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

1. **RED-before-GREEN for the `deriveKeyFiles()` fix**: wrote a fixture test asserting a frontmatter-only-referenced real file appears in `derived.key_files`; confirmed it failed against unmodified code (`['spec.md']` only), then passed after the fix.
2. **Regression sweep**: `generator-hardening.vitest.ts` (16/16), `graph-metadata-schema.vitest.ts` + `generated-metadata-integrity.vitest.ts` + `p0-c-graph-metadata-laundering.vitest.ts` + `graph-metadata-lineage.vitest.ts` + `graph-metadata-integration.vitest.ts` + `identity-resolver-merge-safety.vitest.ts` + `path-boundary.vitest.ts` (72/72 combined) — all independently re-run, all pass.
3. **Full `mcp_server` suite**: run in full; the only failures (4, in `integration-search-pipeline.vitest.ts`) are attributable to a transient SQLite single-writer-lock conflict from an unrelated concurrent process (pid confirmed already exited, no longer holding the lock) — pre-existing environmental flakiness unrelated to this change, not a regression.
4. **Truncation fix, live repro**: root `description.json` regenerated — was `"...carry known gaps in resilienc"` (mid-word), now `"...carry known gaps in"` (clean boundary).
5. **Key_files backfill, live check**: `008-loop-systems-remediation/graph-metadata.json` now lists `fanout-run.cjs`/`fanout-merge.cjs`/`cli-guards.cjs` first; root's does too.
6. **`validate.sh`** on `008-loop-systems-remediation` and the root packet (parent-level), independently re-run: both **PASSED, 0 errors**.
7. **Finding-level re-verification**: for each of the 12 "resolved" dispositions, read the exact current file/line cited, or (for P1-005 and F004) independently re-ran the specific named test to confirm it currently passes.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- codex F002 and F003 remain genuinely open (session-id not reused into review-init bindings; LEAF agent naming/scope mismatch in the fan-out prompt) — correctly dispositioned `active`, not silently marked resolved. Not fixed here since fixing them is new behavior change, not backlog/registry housekeeping — track as a follow-up candidate.
- codex registry's aggregate summary fields (`openFindingsCount`, `convergenceScore`, `graphDecision`) were deliberately left unrecalculated (see Key Decisions) — a future pass that understands the deep-review reducer contract could reconcile these properly.
<!-- /ANCHOR:limitations -->
