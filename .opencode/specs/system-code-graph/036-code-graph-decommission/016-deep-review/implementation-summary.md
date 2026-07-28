---
title: "Implementation Summary"
description: "Two external review lanes ran the decommission to ground: 10 forced iterations found 17 P0/P1 findings plus a class of dead tests both lanes missed, and every confirmed finding is now fixed in its owning surface."
trigger_phrases:
  - "implementation"
  - "summary"
  - "deep review triage"
  - "impl summary core"
importance_tier: "important"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "system-code-graph/036-code-graph-decommission/016-deep-review"
    last_updated_at: "2026-07-28T09:42:16Z"
    last_updated_by: "claude-code"
    recent_action: "Remediated confirmed review findings across all workstreams"
    next_safe_action: "Validate the packet and push"
    blockers: []
    key_files:
      - "review/lineages/grok/review-report.md"
      - "review/lineages/deepseek/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-28-036-016-deep-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 016-deep-review |
| **Completed** | 2026-07-28 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The decommission got the adversarial audit it deserved, and the audit earned its keep. Two unrelated external models each ran 5 forced iterations against every touched surface; the grok lane's FAIL verdict was accurate on all 14 of its P0/P1 findings, and remediating them surfaced a further class of dead tests and dead code that both lanes missed. Every confirmed finding is fixed in its owning surface, and the packet's completion claims now match the repository.

### Two-lane review

The grok lane (cli-cursor, Grok 4.5 High) delivered a FAIL verdict with 5 P0, 9 P1, and 3 P2 findings across four dimensions. The deepseek lane (cli-opencode, DeepSeek v4 Pro) delivered CONDITIONAL with 1 P1 and 16 P2. Both lanes completed 5/5 iterations under a forced max-iterations stop policy, wrote only inside their lineage directories, and left standing review reports.

### Verify-first triage

Every P0/P1 was re-read at its cited line before any fix. Grok went 14/14 confirmed. Deepseek's recurring frame of an "external system_code_graph MCP server" was refuted (no such server exists), but its concrete pointers — the layer-definitions tool roster and the compact-topic tokenizer — were confirmed and fixed. The trust-tree signal deepseek questioned was deliberately kept: its permanently-absent value is the honest provenance treatment the decommission standardized.

### Remediation across five workstreams

Agent-facing guidance no longer recommends deleted tools (context server tip, tool-schema descriptions, session-prime recovery list, compact-topic tokenizer, layer-definitions rosters). The cursor Write hook no longer spawns the deleted freshness hook. Broken or subject-less tests are gone: the plugin bridge test, two working-set tests, four launcher tests, the launcher-fork drift guard, and the removed-contract import in the trust-vocabulary test. The durability stress and substrate harness no longer wire the retired daemon, the matrix manifest dropped its two structural-search cells, and the docs/metadata layer (plugins README, spec-kit advisor edges, sk-doc roster) is clean. The 015 closeout now tells the truth: the checklist was never created, and the suite completed with its 3 accounted-for failures.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp-server/context-server.ts` | Modified | Replace the structural-search tip with Grep/Glob doctrine; drop stale comments |
| `mcp-server/tool-schemas.ts` | Modified | Remove deleted-server recommendations and the migration comment |
| `mcp-server/hooks/claude/session-prime.ts` | Modified | Drop deleted tools from the recovery list |
| `mcp-server/hooks/claude/compact-inject.ts` | Modified | Stop tokenizing retired tool names as topics |
| `mcp-server/hooks/cursor/post-tool-use.mjs` | Modified | Remove the deleted freshness-hook spawn and fix the chain comments |
| `mcp-server/lib/architecture/layer-definitions.ts` | Modified | Remove retired tools from the layer rosters |
| `mcp-server/handlers/session-resume.ts` | Modified | Delete the dead launcher-path resolver and stale provenance refs |
| `mcp-server/tests/opencode-plugin.vitest.ts` | Deleted | Whole file tested a deleted plugin |
| `mcp-server/tests/launcher-code-index-*.vitest.ts` (4 files) | Deleted | Required the deleted launcher at module load |
| `mcp-server/tests/lib/process-liveness-drift.vitest.ts` | Deleted | Drift guard for a fork that no longer exists |
| `mcp-server/tests/compact-merger.vitest.ts` | Modified | Excise two working-set tests and the deleted import |
| `mcp-server/tests/m8-trust-state-vocabulary.vitest.ts` | Modified | Retire the block importing the removed contracts module |
| `mcp-server/tests/hook-precompact.vitest.ts` | Modified | Flip the topic expectation to match the trimmed tokenizer |
| `mcp-server/tests/context-server.vitest.ts` | Modified | Remove the retired guard block and dead module dir |
| `mcp-server/stress-test/durability/release-cleanup-new-surfaces-stress.vitest.ts` | Modified | Strip the deleted import, CLI shim, and assertions |
| `mcp-server/stress-test/substrate/run-substrate-stress-harness.mjs` | Modified | Remove the retired daemon wiring end to end |
| `mcp-server/stress-test/substrate/substrate-harness-hardening.vitest.ts` | Modified | Drop the two suites covering removed harness exports |
| `mcp-server/stress-test/substrate/substrate-runner-harness.vitest.ts` | Modified | Honest single-daemon wording |
| `mcp-server/matrix-runners/matrix-manifest.json` + 2 templates | Modified/Deleted | Remove the two structural-search matrix cells |
| `.opencode/plugins/README.md` | Modified | Drop deleted plugin tree lines |
| `.opencode/skills/system-spec-kit/graph-metadata.json` | Modified | Prune advisor edges to the removed skill |
| `sk-doc .../skill-root-metadata-contract.md` | Modified | Remove the removed skill from the S-tier roster |
| `015-verification-and-closeout/` docs | Modified | Completion honesty: checklist claim retracted, suite status finalized |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Findings were treated as hypotheses: each was re-read at its cited line before any fix, which is what caught deepseek's refuted framing while still salvaging its two real pointers. Fixes landed as structural edits (whole functions, whole branches, whole test blocks), not line-pattern deletions — an early pattern-based pass on the substrate harness was reverted and redone structurally after it left dangling code. Verification ran per workstream: typecheck at 0 errors, each touched suite re-run green, and the harness compared against a HEAD baseline to prove the one remaining failure predates the remediation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the trust-tree absent signal | Its permanently-absent value is the honest provenance treatment the decommission standardized; neither lane flagged the code itself |
| Delete subject-less tests whole rather than stub them | A test whose subject no longer exists asserts nothing; stubs would be false coverage |
| Keep the stale-dist janitor entry for the removed skill | The finalize-dist list actively cleans old compiled artifacts; removing the entry would strand them |
| Record inert residue instead of chasing zero string hits | Fixture strings, env-var names in scope helpers, and eval-baseline labels carry no live behavior; they are listed below, not silently ignored |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

### Finding triage (grok lane)

| ID | Verdict | Fix |
|----|---------|-----|
| P0-001 live tip recommends deleted tool | CONFIRMED | Tip rewritten to Grep/Glob doctrine |
| P0-002 tool-schemas advertise deleted server | CONFIRMED | Both descriptions rewritten |
| P0-003 plugin test imports deleted modules | CONFIRMED | File deleted |
| P0-004 compact-merger imports deleted tracker | CONFIRMED | Import + two tests excised, third kept |
| P0-005 durability stress imports deleted schemas | CONFIRMED | Import, shim, and assertions stripped |
| P1-001 session-prime lists deleted tools | CONFIRMED | Line removed |
| P1-002/003 cursor hook spawns deleted target | CONFIRMED | Constant, spawn, and comments removed |
| P1-004 015 claims absent checklist Created | CONFIRMED | Claim retracted honestly |
| P1-005 015 Complete vs In-Progress conflict | CONFIRMED | Suite status finalized across spec/plan/tasks/summary |
| P1-006 matrix F5/F6 still applicable | CONFIRMED | Rows removed, both templates deleted |
| P1-007 plugins README documents deleted plugins | CONFIRMED | Tree lines removed |
| P1-008 spec-kit advisor edges to removed skill | CONFIRMED | Both edges pruned |
| P1-009 substrate harness wires retired daemon | CONFIRMED | Structural strip of all wiring |
| P2-001/002/003 tokenizer, roster, comment | CONFIRMED | All three fixed alongside |

### Finding triage (deepseek lane)

| Item | Verdict | Outcome |
|------|---------|---------|
| "External system_code_graph MCP server" framing | REFUTED | No such server exists; no action |
| F010 residual-claim wording | CONFIRMED | 015 wording corrected: four test/stress imports had survived |
| layer-definitions tool rosters | CONFIRMED | Retired tools removed |
| compact-inject topic tokenizer | CONFIRMED | Regex trimmed |
| trust-tree absent signal | REFUTED as defect | Deliberately kept as the honest provenance value |

### Self-audit additions (missed by both lanes)

| Surface | Outcome |
|---------|---------|
| Four launcher tests + fork drift guard requiring the deleted launcher | Deleted (5 files) |
| Trust-vocabulary block importing the removed contracts module | Retired |
| Dead launcher-path resolver in session-resume | Deleted with its stale provenance refs |
| hook-precompact topic expectation | Flipped to match the trimmed tokenizer |
| Runner-harness two-daemon wording | Corrected to single-daemon truth |

### Checks

| Check | Result |
|-------|--------|
| Typecheck | PASS — 0 errors |
| compact-merger / hardening / context-server / hook-precompact / m8 | PASS — all green after fixes |
| Substrate harness vs HEAD baseline | The memory_search timeout reproduces identically at HEAD (pre-existing, environmental); the retired-daemon connect FAIL present at HEAD is eliminated |
| Residual sweep (`--hidden --no-ignore`, archival exclusions) | Remaining hits are inert: fixture strings, env-var names in the index-scope helper, eval-baseline labels, and the stale-dist janitor entry |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The substrate harness memory_search timeout is unresolved.** It reproduces identically with the pre-remediation harness, so it is environmental (cold child daemon under concurrent database churn), not a regression from this phase. It needs its own investigation.
2. **Inert string residue remains by decision.** The index-scope helper still exposes structural-search env-var names and exclusion globs with no live consumer, the eval warm-start runner models a historical structural baseline, and the compact-merger input field keeps a legacy name. These carry no live behavior and are recorded here rather than churned.
3. **Fresh-clone verification remains open debt** carried forward from 015; neither lane could perform it and this phase did not either.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->
