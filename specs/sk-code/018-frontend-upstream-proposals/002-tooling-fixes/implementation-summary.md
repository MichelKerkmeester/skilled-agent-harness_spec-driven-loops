---
title: "Implementation Summary"
description: "The intent-signal generator records the phrases it adds and reports and prunes the ones a router stopped declaring; router reach defaults to concurrency 2."
trigger_phrases:
  - "tooling fixes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/018-frontend-upstream-proposals/002-tooling-fixes"
    last_updated_at: "2026-11-03T08:33:54Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Built and verified the orphan check and the reach default"
    next_safe_action: "Commit and push phase 002, then open phase 003 with its reach baseline."
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ae286a84-7880-4ce7-a5fe-7d1335e09c78"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-tooling-fixes |
| **Completed** | 2026-11-03 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A router phrase the generator carried into a hub's advisor vocabulary, and that a router later renames, is now reported by `--check` and removed by `--write`. A default router-reach run now probes two at a time, so advisor load no longer reads as unreachable phrases.

### Phase 2: tooling-fixes

The generator records each phrase it adds in `intent_signals_generated`. An orphan is an entry there that no router declares any more and that `intent_signals_keep` does not list. Hand-curated signals are never in the provenance list, so they are never orphans.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs` | Modified | Provenance, orphan report, prune, keep list |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs` | Modified | Default concurrency 2, exported for its test |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | Modified | Admit and validate the two new lists |
| `.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md` | Modified | Document the lists and the new finding code |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/` | Created, modified | Orphan, reach-default and metadata-gate tests |
| `.skilled/skills/sk-doc/sk-create-skill/changelog/v1.10.0.0.md`, `SKILL.md` | Created, modified | Release note and version |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The setup runs came first: reach at 8 and 2, the keep-marker note and the caller list. The orphan definition went to the operator after the specced one flagged 184 live signals. DeepSeek V4.1 Flash max built the change. This session reran the suite, broke the logic to watch the new tests fail, checked `--write --hub` isolation in a scratch tree, and an independent DeepSeek pass verified every criterion.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| An orphan is a generated signal no router declares (ADR-001) | The specced definition flagged 184 live signals, nearly all curated, and would turn CI red under D2 |
| A sibling keep list, not an in-string marker | The advisor reads `intent_signals` as literal phrases, so a prefix would be scored |
| Default concurrency 2 (ADR-002) | No run refused at either setting here; 2 costs about 0.5 s per 48 uncached probes |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/` | 97/97, exit 0 (90 at baseline) |
| Logic disabled | 3 of 7 new tests fail, exit 1; restored 7/7, exit 0 |
| Live `--check` | 0 orphans on 7 hubs, no file written |
| `ci-skill-root-metadata.cjs` | 13 passed, 0 failed |
| `parent-skill-check.cjs .skilled/skills/sk-doc` | All hard invariants passed |
| `--write --hub alpha-hub` in a scratch tree | alpha pruned and extended, beta unchanged |
| Independent verification | `scratch/verify-002.md`, 7 of 7 met |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Phrases generated before this release carry no provenance.** If a router drops one, it stays until removed by hand once. Each hub's next `--write` starts its list.
2. **The reach-default test pins the constant, not the call site.** A refactor that stopped reading `DEFAULT_CONCURRENCY` would still pass it.
<!-- /ANCHOR:limitations -->

---
