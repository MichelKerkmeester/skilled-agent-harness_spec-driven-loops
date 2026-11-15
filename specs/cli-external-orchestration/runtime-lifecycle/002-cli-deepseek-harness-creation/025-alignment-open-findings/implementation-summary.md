---
title: "Implementation Summary"
description: "Both red CI checks pass, the deep-review docs state the failed-required-gate FAIL rule, the handover docs name Mistral Vibe and the advisor reaches the executor_missing and packet-purpose wording."
trigger_phrases:
  - "alignment open findings implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/025-alignment-open-findings"
    last_updated_at: "2026-11-15T14:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Fixed the open alignment findings"
    next_safe_action: "Commit with the recompiled skill graph and the regenerated contract"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-025-alignment-open-findings"
      parent_session_id: null
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
| **Spec Folder** | 025-alignment-open-findings |
| **Completed** | 2026-11-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The markdown-link and playbook-package CI checks pass again. A reader of the deep-review skill now learns that a required gate still failing at the stop makes a FAIL, in one run and across lineages. A reader of the handover docs now finds Mistral Vibe among the runtimes that hand over on their own. The advisor now routes a question about an iteration with no executor to Deep Loop and a question about keeping the packet purpose to spec-kit.

### Phase 25: alignment-open-findings

Five benchmark links follow their packet to `hooks-plugins-extensions/goal/`. A playbook scenario loses its dated run line. The deep-review SKILL.md, the runtime catalog, the merge entry and the fan-out entry state the gate rule. The README, three hooks READMEs and the handover catalog entry name Vibe, and the hooks tree shows nineteen test files and the Vibe adapter. The release notes name the retired `deep-ai-council` folder. Two skills gain intent signals, and the reach allowlist records the `mode packet` dispute.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| Three `goal-hook/source.md` benchmark reports | Modified | Five links |
| `setup-native-module-health-and-mcp-installation.md` | Modified | Dated run line |
| `deep-review/SKILL.md` and three catalog entries | Modified | FAIL rule |
| `README.md`, three hooks READMEs, `session-handover-loop.md` | Modified | Mistral Vibe, test count |
| `.skilled/changelog/skilled/v4.0.2.1.md` | Modified | Retired mode folder |
| Two `graph-metadata.json` files and `skill-graph.json` | Modified | Intent signals |
| `router-reach-allowlist.json` | Modified | `mode packet` entry |
| `deep-review.contract.markdown` | Modified | Regenerated digest |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each doc claim was checked against `deep-review.yaml`, `fanout-merge.cjs`, `relaunch-core.cjs` and `hook-flags.cjs` first. Intent signals were added and the routing suites run after each change. Two phrases that moved a suite were dropped: `save a deep loop run` added a local-versus-native divergence on a save prompt, and `full-auto deep loop run` cost one holdout prompt.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Allowlist `mode packet` rather than add vocabulary | sk-doc declares the phrase exactly and loses by 0.002 to spec-kit's `packet` vocabulary, the same shape as the allowlisted `operator validation` |
| Name the retired folder in the notes rather than change the coverage check | The notes already cover the retirement, and the folder name lets a reader searching for it find the entry |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `check-markdown-links.cjs` | `0 broken` |
| `validate-playbook-package.cjs --strict` | exit 0 |
| Scorer, holdout, divergence and golden-prompt suites | 7/7, 6/6, 9/9, 39/39 |
| Corpus floors (`score-routing-corpus.py`) | `"overall_pass": true` |
| Ten structural routing steps | each exit 0 |
| `check-release-coverage.cjs` | `STATUS=OK` |
| `node scripts/check-contract-drift.cjs` | `[CONTRACT DRIFT] OK commands=2` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The routing corpus pin is still stale on main.** The AI Council retirement removed two holdout rows without recapturing the pin, so the CI corpus gate exits 2 before it scores. Its baseline belongs to another packet.
2. **Two advisor probes keep their winner.** "save the state of a full-auto deep loop run" still goes to spec-kit, which owns the save writer, because the phrase that moved it cost a holdout prompt. "switch the deepseek harness from the LLM Gateway route to OpenCode Go" returns an ordered bundle with cli-opencode first, which follows the hub's tie-break order for a prompt that names two executors.
<!-- /ANCHOR:limitations -->

---
