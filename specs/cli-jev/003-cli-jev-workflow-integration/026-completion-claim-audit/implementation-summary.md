---
title: "Implementation Summary: Phase 26: completion-claim-audit (Planned)"
description: "Nothing is built yet. This phase is Planned: its spec, plan, tasks and goal describe one read-only script that counts the completion sentinel's claim-regex errors on labeled turns and measures whether a Jev or Deem noul reads a completion claim better. It was released on 2026-09-29 and waits on 30 claim labels."
trigger_phrases:
  - "completion claim audit summary"
  - "completion claim audit status"
  - "score-completion-claims planned"
  - "completion claim audit results"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/026-completion-claim-audit"
    last_updated_at: "2026-09-29T17:00:00Z"
    last_updated_by: "authoring-leaf"
    recent_action: "Authored the Planned phase documents from research item R4"
    next_safe_action: "Released 2026-09-29 (parent goal D3): run T001, then T002"
    blockers:
      - "Label gate: no claim label exists"
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/026-completion-claim-audit/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/026-completion-claim-audit/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-026-completion-claim-audit"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Who reads the completion sentinel's advisory"
      - "Where do real Stop-turn rows come from"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 26: completion-claim-audit (Planned)

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 026-completion-claim-audit |
| **Status** | Planned |
| **Completed** | Not completed. The phase is Planned |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is Planned, and no script, test, run or commit exists for it.

### Phase 26: completion-claim-audit

The plan adds `score-completion-claims.mjs` (proposed) under `.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/`. Its default run imports `detectCompletionClaim` from `.skilled/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs`, runs it over a rows file the operator names, prints fires and per-word counts, then prints the regex's false fires and missed claims on labeled rows and stops at a label gate of 30, with zero model calls. Past the gate, a Deem arm and a Jev arm, each behind its own switch and checks, ask one `noul` per labeled row and print one verdict per column under the Keep Rule in `spec.md` section 4. See `spec.md` for the requirements and `plan.md` for the order of work.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `goal.md`, `implementation-summary.md` | Authored | Planning documents for this phase. No code or skill file has changed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The planning documents were written on 2026-09-29 from R4 and open question 9 in `../001-deep-research/research/research.md` and the carried table in `../007-classifier-deep-research/research/research.md` section 12. Every cited line in the sentinel, its Claude adapter and `.claude/settings.json` was reopened at the worktree HEAD, and the pattern was run on phase 003's 50 rows with counts only: 4 fires. The operator's "Bind and release" amended parent goal D3 on 2026-09-29 and released the phase, which builds in number order. The build waits on 30 claim labels.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The census imports `detectCompletionClaim` | A copied pattern could drift from the one the Stop hook runs, and then the census would measure the wrong regex |
| The model reads the same 400-character tail | The regex sees only that tail, so a model reading more text would win on information rather than judgment |
| Jev needs `--accept-payload` | The rows are the operator's conversation, and phase 003 found secrets its redaction misses. Deem keeps the text on the machine |
| A `keep` serves nothing | R4 has no reader and What Not To Build row 31 drops live judgment, so a result changes behavior only through a later phase |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Build, tests and runs | Not run. Nothing is built |
| Planning documents | `validate.sh --strict` and `check-goal.cjs` run on this folder after authoring. Their output is reported by the authoring session, not recorded here as a build result |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The phase may close at its label gate.** No claim label exists, and phase 003's rows are Pi goal turns rather than Stop turns.
2. **The power is low.** 30 labeled rows allow a keep only with at least 5 discordant wins and no loss, and the regex fires on only 4 of today's 50 rows.
3. **Counts can drift.** The 50 rows and 4 fires are from 2026-09-29. The build recounts them at its own HEAD.
<!-- /ANCHOR:limitations -->

---
