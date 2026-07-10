---
title: "Implementation Summary: Apply 015/005 metadata fixes and re-run the seeded sweep"
description: "Pending; filled by codex with edit ledger, delta-vs-baseline numbers, and recommendation."
trigger_phrases:
  - "metadata fixes summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/001-skill-graph/004-metadata-fixes-and-seeded-sweep-rerun"
    last_updated_at: "2026-05-14T01:00:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "research/sweep-results-after-fixes.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Implementation Summary: Apply 015/005 metadata fixes and re-run the seeded sweep

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-05-14 |
| **Branch** | `006-apply-metadata-fixes-and-resweep` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Applied all 8 concrete recommendations from 015/005 Section 4. No top-8 entries were skipped.

### Edit Ledger

| Skill | `SKILL.md` description | `derived.trigger_phrases` | `derived.key_topics` | Other fields |
|---|---|---|---|---|
| `cli-codex` | Updated to OpenAI-backed executor wording from audit example | Replaced generic CLI/cross-AI phrases with Codex repo analysis, PR review, web research, cross-model validation | Replaced generic family topics with `openai-codex-codegen`, `codex-exec`, `codex-pr-review`, `codex-web-research`, `cross-model-validation` plus Codex-specific support topics | none |
| `cli-gemini` | Updated to Google Search, architecture sweep, large-context wording from audit example | Replaced generic CLI/cross-AI phrases with Gemini Google Search research, architecture sweep, large-context code analysis | Replaced generic family topics with Google Search, large-context, Gemini architecture, and Gemini validation topics | none |
| `deep-review` | Unchanged; audit explicitly said to keep it | Unchanged | Replaced generic review/audit/convergence topics with multi-pass code audit, P0/P1/P2 findings, review-state JSONL, release readiness, residual risk, review convergence | none |
| `deep-ai-council` | Unchanged | Added council-specific multi-seat strategy, decision comparison, planning artifacts, convergence check phrases | Replaced thin/generic topics with seat perspectives, decision matrix, council state artifacts, strategy deliberation, planning convergence | none |
| `sk-code` | Unchanged | Replaced broad single-token language/tool triggers with surface-aware implementation and verification intent phrases | Unchanged | none |
| `cli-claude-code` | Updated to Anthropic-backed executor, deep reasoning, code edits, review, structured handoff wording | Unchanged | Replaced generic CLI family topics with Anthropic Claude Code, extended-thinking review, Claude editing, structured handoff topics | none |
| `deep-research` | Unchanged | Unchanged | Replaced generic loop topics with research question decomposition, evidence synthesis, research-state JSONL, source triangulation, research convergence, iteration deltas | none |
| `sk-code-review` | Unchanged | Unchanged | Replaced broad review/audit/security topics with findings-first PR review, security/correctness minimums, merge-readiness risk, surface-specific evidence, actionable line findings | none |

### Skipped Entries

None. All top-8 audit entries had concrete EXAMPLE blocks that could be applied mechanically.

### Cache Invalidation

Deleted `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/scorer/fixtures/.embeddings-cache/skill-embeddings.json` before the seeded sweep. The explicit `hf-local` measurement recreated the cache with `cacheHits 0`, `cacheMisses 12`, `seededSkills 12`, and `promptEmbeddings 24`; the cache file was removed again after measurement so the final workspace state remains invalidated.

### Sweep Delta

The default provider sweep skipped with `Failed to create context`, matching 015/004. The explicit local provider measurement ran and produced no movement versus 015/004.

| vectorLabel | accuracyTotal | Delta | todayCorrect | Delta | intentDescribed | Delta | flippedFromBaseline | Delta |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| V0-baseline-015-002 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | 0.3333 | +0.0000 | 0 | +0 |
| V1-pre-015-002 | 0.6667 | +0.0000 | 1.0000 | +0.0000 | 0.3333 | +0.0000 | 0 | +0 |
| V2-slightly-higher | 0.6667 | +0.0000 | 1.0000 | +0.0000 | 0.3333 | +0.0000 | 0 | +0 |
| V3-medium | 0.6667 | +0.0000 | 1.0000 | +0.0000 | 0.3333 | +0.0000 | 0 | +0 |
| V4-aggressive | 0.6667 | +0.0000 | 1.0000 | +0.0000 | 0.3333 | +0.0000 | 0 | +0 |
| V5-explicit-heavy | 0.6667 | +0.0000 | 1.0000 | +0.0000 | 0.3333 | +0.0000 | 0 | +0 |
| V6-cosine-dominant | 0.6667 | +0.0000 | 1.0000 | +0.0000 | 0.3333 | +0.0000 | 0 | +0 |

Detailed report: `research/sweep-results-after-fixes.md`.

### Recommendation

Stay at semantic weight `0.05`. The metadata edits produced `+0.0000` delta on `accuracyTotal`, `todayCorrectAccuracy`, and `intentDescribedAccuracy` across every vector, with `flippedFromBaseline` still `0`. Raising the weight has no empirical support from this corpus; the next useful move is a harder corpus or a sweep projection that embeds richer skill metadata, not a lane-weight change.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read 015/006 packet docs and 015/005 `research/audit-report.md`, applied the eight concrete audit examples by hand with scoped patches, deleted the embeddings cache, ran the default and explicit local seeded sweeps, wrote the 006 delta report, and verified JSON/frontmatter discovery for all 17 active skills.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Why |
|----------|-----|
| Edit only `description:` frontmatter and `derived.*` fields | Preserves SKILL.md body content and graph-metadata schema |
| Apply only entries with concrete EXAMPLE phrasing | Vague entries get skipped, not fabricated |
| Delete cache file outright | Simpler than per-row invalidation; cold-cache budget is acceptable |
| Recommendation stays advisory | lane-registry.ts unchanged; weight changes are a separate packet |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Gate | Status | Evidence |
|------|--------|----------|
| Strict spec validation | Pass | This packet strict validation exited 0 with 0 errors / 0 warnings; parent 015 strict recursive validation exited 0 with 0 errors / 0 warnings |
| Typecheck | Pass | `npm run typecheck` from `.opencode/skills/system-spec-kit/mcp_server` exited 0 |
| TypeScript build | Pass | `npx tsc --build` from `.opencode/skills/system-spec-kit` exited 0 |
| Sweep re-run | Pass/expected variance failure | Default provider: 1 passed / 1 skipped. Explicit `EMBEDDINGS_PROVIDER=hf-local`: ran with `cacheMisses 12`, then failed the intentional variance assertion because all vectors stayed identical |
| All 17 skills discoverable | Pass | Node discovery sanity parsed 17 `graph-metadata.json` files and 17 `SKILL.md` frontmatter blocks with 0 failures |
| No new regressions | Pass | `npm exec --workspace=@spec-kit/mcp-server -- vitest run skill_advisor`: 41 passed / 1 failed test file, 300 passed / 1 failed / 1 skipped tests; the only failure is the known `plugin-bridge.vitest.ts` forced-local fail-open baseline |
| Sweep delta documented | Pass | `research/sweep-results-after-fixes.md` includes per-vector delta columns and per-case routing diff table |
| Recommendation cited with numbers | Pass | Recommendation stays at `0.05` because all measured deltas are `+0.0000` and flips remain `0` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Single-corpus signal**: this packet still uses the same 24-prompt corpus as 015/003 + 015/004. Real-world prompt distribution may differ.
2. **Edits are mechanical**: codex applies the EXAMPLE phrasings literally. If the example is too generic, the actual quality lift may be smaller than the recommendation suggested.
3. **Recommendation horizon**: tuning is point-in-time and may need revisiting if SKILL.md descriptions change again outside this packet.
<!-- /ANCHOR:limitations -->
