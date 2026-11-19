---
title: "Implementation Summary"
description: "The doc alignment check of the merged advisor change found 20 open findings across 15 docs, 5 P1 and 15 P2. Six describe behavior this packet changed; the rest predate it. Nothing was fixed."
trigger_phrases:
  - "doc alignment check implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/016-doc-alignment-check"
    last_updated_at: "2026-11-19T09:31:34Z"
    last_updated_by: "generate-context"
    recent_action: "Recorded the doc alignment scope answer"
    next_safe_action: "Decide which doc alignment findings become fix work"
    packet_purpose: "Purpose: One doc alignment report names every live doc that misdescribes the merged advisor behavior, so the operator can decide what to fix."
    blockers: []
    key_files:
      - ".skilled/commands/assets/local-doc-alignment/topics.json"
      - "evidence/report.md"
    session_dedup:
      fingerprint: "sha256:5de57288963729dcd2414840c27fa96ae57836ba5034aa1e026ec1374822dd6f"
      session_id: "0b81ad2f-04a7-4ad7-b174-0b3f9930b833"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "0b81ad2f-04a7-4ad7-b174-0b3f9930b833"
      workspace: "/Users/michelkerkmeester/MEGA/Development/Skilled"
      savedAt: "2026-11-19T09:31:34Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 016-doc-alignment-check |
| **Completed** | 2026-11-19 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The doc alignment check now covers the skill advisor, and its first run found 20 open findings in the docs that describe the merged change: 5 P1 and 15 P2. Six of them describe behavior this packet changed. The other fourteen were already wrong before the merge.

### Phase 16: doc-alignment-check

You can now run `/local-doc-alignment advisor-pasted-reply` to check every live doc that names the pasted-reply strip, the hook crash fallback, route receipts or the confidence threshold against the 13 source files that implement them. The run here read 15 docs in 4 lanes and its check, the advisor vitest suite, passed with 424 tests and 1 skipped.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/assets/local-doc-alignment/topics.json` | Modified | Adds the `advisor-pasted-reply` topic |
| `evidence/report.md`, `findings.json`, `fix-plan.md`, `scope-summary.json`, `overturned.json` | Created | Copies of the run's output |
| `evidence/topics-entry.json` | Created | A tracked copy of the gitignored topic entry |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The confirm workflow ran step by step on 2026-11-19, with run folder `~/.local/state/local-doc-alignment/Skilled/20261119T055032Z`. The scope step printed `docs=15 lanes=4 checks=1`. The check `D2-advisor-hook-tests` passed in 114 seconds. The four lanes ran on `opencode-go` and returned in 591 to 1,293 seconds. The critic returned in 1,565 seconds. `aggregate-findings.cjs` printed `STATUS=OK ... findings=20 P0=0 P1=5 P2=15 ... overturned=1`. The prune kept 6 runs and removed this run's lane scratch.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Scope checkpoint: approved as split, 15 docs in 4 lanes | Operator answer at the scope checkpoint |
| Lane preset: `opencode-go` | Operator answer at the lane checkpoint, offered beside `codex`, `vibe-deepseek` and battery-only with the parent D2 and D3 tension named |
| Phrase terms, not `pasted` or `receipt` | The bare words match 45 and 75 docs about other features |
| The critic's refutation of L1-1 stands | The Claude row documents the shim boundary, and the shim returns `{}` on its error paths (`system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:142` to `190`) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

### Triage

"This change" means the merge `57d3f5d9159` made the doc's claim false or left the new behavior out. "Pre-existing" means the claim was wrong before the merge. Rows marked checked were opened in the repository during triage, and the others rest on the lane or critic evidence in `evidence/findings.json`.

| ID | Sev | Doc | Cause | Triage |
|----|-----|-----|-------|--------|
| L4-4 | P1 | `ENV-REFERENCE.md:382` | This change: the packet wrote the threshold-read sentence, and the launcher's `CHILD_ENV_ALLOWLIST` (`.skilled/bin/system-skill-advisor-launcher.cjs:131`) does not pass the variable to the daemon. Checked | Fix |
| L4-2 | P1 | `ENV-REFERENCE.md:157` | This change: route receipts ignore `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP` | Fix |
| L4-1 | P2 | `ENV-REFERENCE.md:153` | This change: the cadence sentence omits the route receipt outcome | Fix |
| L1-2 | P2 | `hooks/skill-advisor-hook.md:57` | This change: the catch also returns `{}` when the payload has no prompt string | Fix |
| L1-4 | P2 | `feature-catalog/cli-surface/advisor-recommend.md:49` | This change: the degraded path tests the stripped task, not the raw prompt | Fix |
| N2 | P2 | `feature-catalog/cli-surface/skill-advisor-cli.md:55` | This change touched the fallback module the row describes | Fix |
| L3-2 | P1 | `ux-hooks/cli-hook-transport-down-fail-open.md:54` | Pre-existing: `gtimeout` is not installed here. Checked | Fix separately |
| L1-3 | P1 | `hooks/lib/README.md:13` | Pre-existing: the in-process brief path the overview names is not the production path | Fix separately |
| L2-4 | P1 | `cli-warm-only-no-spawn.md:46` | Pre-existing: `mk-skill-advisor-launcher` does not exist, the launcher is `system-skill-advisor-launcher.cjs`. Checked | Fix separately |
| L2-5 | P2 | `cli-warm-only-no-spawn.md:16` | Pre-existing | Fix separately |
| N6 | P2 | `cli-warm-only-no-spawn.md:95` | Pre-existing | Fix separately |
| L3-1 | P2 | `cli-hook-transport-down-fail-open.md:14` | Pre-existing | Fix separately |
| L4-3 | P2 | `ENV-REFERENCE.md:159` | Pre-existing: the merge changed only the threshold row of this file | Fix separately |
| L2-1 | P2 | `scorer-fusion/lane-attribution.md:29` | Pre-existing | Fix separately |
| L2-2 | P2 | `scorer-fusion/lane-attribution.md:69` | Pre-existing | Fix separately |
| L2-3 | P2 | `cli-runtime-warm-only-fallbacks.md:28` | Pre-existing | Fix separately |
| N1 | P2 | `advisor-recommend.md:72` | Pre-existing | Fix separately |
| N3 | P2 | `skill-advisor-cli.md:28` | Pre-existing | Fix separately |
| N4 | P2 | `manual-testing-playbook.md:190` | Pre-existing | Fix separately |
| N5 | P2 | `advisor-validate.md:40` | Unclear: the merge added a corpus row, so the baseline numbers may be stale from this change or from earlier ones | Recheck before fixing |
| L1-1 | P1 | `hooks/skill-advisor-hook.md:67` | Refuted by the critic | None |

### Checks

| Check | Result |
|-------|--------|
| `doc-alignment.cjs scope --topic advisor-pasted-reply` | PASS, `STATUS=OK` with 15 docs |
| `python3 -m json.tool topics.json` | PASS, exit 0 |
| Topic check `D2-advisor-hook-tests` | PASS, 424 passed and 1 skipped |
| `ls evidence` | `findings.json`, `fix-plan.md`, `overturned.json`, `report.md`, `scope-summary.json` |
| Run folder holds no `applied.json` | PASS, the run had no `--fix` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Docs that name none of the terms are out of scope.** The skill's own `SKILL.md`, `README.md` and the bench `README.md` describe the advisor without the topic phrases, so this run did not read them. Phase 015's lanes B and C cover them.
2. **The topic lives on this machine only.** `.gitignore:247` ignores `/.skilled/commands/assets/local-*`, so the `advisor-pasted-reply` entry in `topics.json` is in no commit. A copy of the entry is in `evidence/topics-entry.json`, so another checkout can add it back under `topics`.
3. **One model family.** The lanes and the critic all ran DeepSeek V4.1 Flash, so the triage rests on one lens plus the spot checks marked above.
<!-- /ANCHOR:limitations -->

---
