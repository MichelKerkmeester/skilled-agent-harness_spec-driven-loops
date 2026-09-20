---
title: "Implementation Summary: Phase 4: advisor-routing-update"
description: "Completed sk-git graph-metadata.json and advisor explicit-lane boost updates; verified live routing with no regressions."
trigger_phrases:
  - "gitkraken advisor routing summary"
  - "phase 004 summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/014-gitkraken-mcp-integration/004-advisor-routing-update"
    last_updated_at: "2026-07-15T04:22:47Z"
    last_updated_by: "claude"
    recent_action: "Updated graph-metadata.json and explicit.ts, verified live routing"
    next_safe_action: "Proceed to phase 005"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/graph-metadata.json"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-004-advisor-routing-update"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-advisor-routing-update |
| **Completed** | 2026-07-10 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Extended sk-git's graph metadata and the skill advisor's curated explicit-author lane with GitKraken vocabulary, then verified live routing behavior end-to-end with the real advisor MCP tools — not just static config edits.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-git/graph-metadata.json` | Modified | Added `gitkraken` to `domains`; added `gitkraken`/`gitlens`/`cross-platform pr`/`multi-provider issue` to `intent_signals`, `derived.trigger_phrases`, `derived.key_topics`, `derived.intent_signals`; added the new reference doc to `key_files`/`entities`/`source_docs` |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts` | Modified | Added `gitkraken: [['sk-git', 0.9]]` to `TOKEN_BOOSTS`; added `'gitlens launchpad': [['sk-git', 0.85]]` to `PHRASE_BOOSTS` — 2 lines, purely additive |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Checked `git status` on the shared scorer directory before touching it, since a concurrent live session was actively editing sibling files there — confirmed `explicit.ts` itself was clean and the collision risk was low. Made both edits, then verified live: typecheck, two targeted vitest suites, and three real `advisor_recommend` calls (one GitKraken-specific, one ambiguous-but-correct, one plain-git regression check) rather than trusting the config edit alone.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| `gitkraken` token weight 0.9 (vs `git`'s 1.0) | One tier below the strongest possible signal — `git` is maximally generic for this skill, `gitkraken` is a strong but more specific brand token |
| No manual `advisor_rebuild` | `advisor_status` reported `freshness: "live"` with a generation freshly bumped by the file watcher immediately after the edits — the daemon already picked up the change; a manual rebuild would have been redundant |
| Deferred the heavy `advisor_validate` regression bundle to phase 005 | It's a repo-wide gate, not phase-004-specific; running it once at the end of the packet (phase 005) avoids running it twice |
| Verified live with real `advisor_recommend` calls, not just static config review | A collision or over-broad boost only shows up in actual scored output; static review alone would have missed the `ambiguous: true` result on the first smoke-test prompt |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| JSON validity | Pass | `graph-metadata.json` parses; only additive changes |
| Typecheck | Pass | `npm run typecheck` in `system-skill-advisor/mcp_server` clean after the `explicit.ts` edit |
| Vocabulary-agreement vitest | Pass | 1 file, 5 tests |
| Scorer-eval baseline ratchet | Pass | 1 file, 7 tests — no regression from the two new boosts |
| Latency benchmark test | Flaky, unrelated | `native-scorer.vitest.ts`'s `AC-6` p95-latency assertion failed once (106ms vs 50ms threshold) under concurrent machine load from another live session's benchmark work, then passed cleanly on isolated re-run (a pure timing assertion, not a correctness check — unaffected by a 2-line additive content change) |
| Routing smoke test 1 | Pass, informative | `"check my gitlens launchpad for PRs that need review across our repos"` → sk-git 0.704 (top), confidence 0.8985, `ambiguous: true` (sk-code close second at 0.675 — the prompt genuinely blends git-review and code-review language via the shared `pr`/`review` tokens); new reference doc appeared in `matchedDocs` |
| Routing smoke test 2 | Pass | `"use gitkraken to create an issue on our jira board and check pull requests across gitlab and azure devops"` → sk-git 0.676, confidence 0.8834, unambiguous, sk-code a distant second at 0.249 |
| Regression smoke test | Pass | `"commit my staged changes with a conventional commit message"` → sk-git 0.753, confidence 0.9249, single unambiguous recommendation — matches pre-existing sk-git routing behavior |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **First smoke-test prompt was ambiguous (sk-git vs sk-code)** — genuinely reflects the prompt's blended git-review/code-review vocabulary, not a bug; sk-git still ranked first. Not addressed further since forcing an artificial disambiguation boost risks distorting real code-review routing.
2. **Full `advisor_validate` regression bundle not run in this phase** — deferred to phase 005 as a repo-wide terminal gate.
<!-- /ANCHOR:limitations -->
