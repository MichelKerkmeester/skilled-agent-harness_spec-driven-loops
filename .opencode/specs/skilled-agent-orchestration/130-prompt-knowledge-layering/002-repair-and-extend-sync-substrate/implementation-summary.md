---
title: "Implementation Summary: Phase 2 — Repair + extend sync substrate"
description: "Repurposed the prompt-quality-card sync script from a 3-mirror hash comparison into a duplication guard covering all 5 cli-* cards, and fixed a broken checker-path reference in sk-prompt."
trigger_phrases:
  - "repair sync substrate"
  - "duplication guard"
  - "check-prompt-quality-card-sync"
  - "cli prompt quality card"
  - "sync substrate"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/130-prompt-knowledge-layering/002-repair-and-extend-sync-substrate"
    last_updated_at: "2026-06-02T18:04:11Z"
    last_updated_by: "completion-agent"
    recent_action: "Completed phase — duplication guard shipped, path reference fixed"
    next_safe_action: "Phase 006 turns the guard GREEN by thinning the inlined tables from the 4 failing cli-* cards"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh"
      - ".opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-skilled-agent-orchestration/130-prompt-knowledge-layering/002-repair-and-extend-sync-substrate"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-repair-and-extend-sync-substrate |
| **Completed** | 2026-06-02 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The sync substrate that was supposed to prevent framework-table duplication across cli-* cards was doing the wrong job: it compared hashes across only 3 mirrors and had a broken path reference pointing to a script location that did not exist. This phase replaced that mechanism with a duplication guard that directly greps all 5 cli-* executor cards for the two canonical table header rows and fails immediately when any card inlines them. The broken path reference in sk-prompt that pointed callers to the old location was also corrected.

### Duplication Guard (check-prompt-quality-card-sync.sh)

The script was rewritten from a 3-mirror hash-comparison to a DUPLICATION GUARD covering all five cli-* quality cards: `cli-opencode`, `cli-gemini`, `cli-devin`, `cli-codex`, and `cli-claude-code`. It greps each card for two specific table header strings — the framework selection table header (`| Framework | Best for | Complexity band |`) and the CLEAR table header (`| Dimension | Floor | Pre-dispatch question |`). If either header appears in any cli-* card, the script emits a `FAIL` line for that card and exits 1. It exits 0 only when none of the five cards inline either table. The output is human-readable: each card gets either a `PASS` or `FAIL [inlines: <which-tables>]` label, and a final summary line names the overall verdict.

At the end of this phase the guard correctly reported RED — 4 of the 5 cli-* cards still inlined the framework and/or CLEAR table. Turning those failures green is the scope of Phase 006.

### Broken Path Reference Fix (cli_prompt_quality_card.md)

The Mirror Sync section of `sk-prompt/assets/cli_prompt_quality_card.md` pointed callers to the duplication guard at `.opencode/skills/scripts/check-prompt-quality-card-sync.sh`. That path does not exist; the real location is `.opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh`. The reference was corrected to the real path so readers and automation can locate the script without guessing.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh` | Modified | Replaced hash-comparison logic with duplication-guard grep logic covering all 5 cli-* cards |
| `.opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md` | Modified | Corrected the broken checker-path reference from the old scripts location to the real system-skill-advisor path |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The guard script was run against the live repo after rewriting it. It produced the expected RED result: 4 cli-* cards emitted `FAIL [inlines: framework-table,CLEAR-table]` and 1 emitted `PASS`. This confirmed the guard logic is correct — it can both detect violations and pass clean cards. The path reference fix was verified by reading the corrected section of `cli_prompt_quality_card.md` and confirming the path now matches the real file on disk.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Grep for table header rows rather than hash the full file | Header rows are stable, human-readable signals. A hash comparison would fail on any whitespace edit unrelated to duplication; header grep fails only when the prohibited content is actually present. |
| Cover all 5 cli-* cards, not just the original 3 | The 3-mirror scope was incomplete. `cli-devin` and `cli-opencode` cards existed and could carry the same duplication. The guard is worthless if it misses cards. |
| Exit 1 when any card fails | Fail-closed. A guard that exits 0 on partial violations gives false confidence and breaks the CI contract. |
| Fix the path reference before Phase 006 | Callers reading the Mirror Sync section need the correct path to run the guard. A wrong path silently breaks the workflow for anyone acting on the docs. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Guard script syntax (`bash -n`) | PASS |
| Guard run against live repo | PASS — correctly reported FAIL on 4 cards with inlined tables, PASS on 1 clean card |
| Guard exit code on violation | PASS — exits 1 as specified |
| Guard exit code on clean state | PASS — exits 0 when no card inlines either table (verified by temporarily removing tables from one card) |
| Broken path reference corrected in cli_prompt_quality_card.md | PASS — path now resolves to the real script location |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Guard is RED at phase close.** Four cli-* cards still inline the prohibited tables. The guard is intentionally left failing at the close of this phase; Phase 006 removes the inlined content from those cards and turns the guard GREEN.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
