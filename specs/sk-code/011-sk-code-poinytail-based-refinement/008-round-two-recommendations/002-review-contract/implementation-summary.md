---
title: "Implementation Summary"
description: "Built: every sk-code review finding carries a case line, the review reads the connected code first, findings are numbered once across severity groups, and the review agent states its report order. The Codex, Pi and Hermes review mirrors wait for the orchestrator to regenerate them."
trigger_phrases:
  - "review contract implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/002-review-contract"
    last_updated_at: "2026-10-10T07:51:31Z"
    last_updated_by: "review-contract-builder"
    recent_action: "Built review contract edits, checker and harness cases"
    next_safe_action: "Committed with its sibling children in folder order"
    blockers:
      - "Goal criterion 4 waits for the orchestrator to regenerate the Codex, Pi and Hermes review mirrors"
    key_files:
      - ".skilled/skills/sk-code/sk-code-review/SKILL.md"
      - ".skilled/skills/sk-code/sk-code-review/scripts/check-review-findings.js"
      - ".skilled/agents/review.md"
      - ".claude/agents/review.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-008-002-review-contract"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-review-contract |
| **Completed** | Built on 2026-10-10. Goal criterion C4 is pending the orchestrator's mirror regeneration |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every finding in the `sk-code-review` mode now carries a `- Case:` sub-line that names the input or situation producing the wrong result. The review reads the connected code in Phase 1 before it reports, and findings are numbered once across the P0, P1 and P2 groups, so the first P1 finding continues after the last P0 finding. The review agent adds a reproducing case to each evidence row, plans its connected-code reads inside the read budget, and states its report order. A new checker, `check-review-findings.js`, fails a finding with no case line or a numbering restart, and four harness cases cover it.

### Phase 2: review-contract

The mode's SKILL.md gained the Phase 1 connected-code step, the Phase 3 numbering rule and the Case line in its output template. The README example and the review-core schema and suggested shape carry the same Case line, and the review-core `id` row now takes the finding's list number. The canonical review agent and its hand-kept Claude fork carry the same three agent edits, which the identical-range diffs confirm.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/sk-code-review/SKILL.md` | Modified | Phase 1 connected-code step, Phase 3 numbering rule, Case line and P1 numbering in the output template |
| `.skilled/skills/sk-code/sk-code-review/README.md` | Modified | Case line in the findings example |
| `.skilled/skills/sk-code/sk-code-review/references/review-core.md` | Modified | Case row, list-number `id` row and the suggested shape |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-review-findings.js` | Created | Case and numbering checker, exit codes 0, 1 and 2 |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh` | Modified | Four findings-checker harness cases; the harness prints 54 PASS lines |
| `.skilled/skills/sk-code/sk-code-review/scripts/README.md` | Modified | Checker row, validation block and harness row |
| `.skilled/agents/review.md` | Modified | Reproducing case in the evidence table, connected-code read budget, report order |
| `.claude/agents/review.md` | Modified | The same three edits in the hand-kept fork |
| `.skilled/skills/sk-code/leaf-manifest.json` | Regenerated, bytes unchanged | Leaf manifest reports fresh |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` | Re-minted, bytes unchanged | Compiled sk-code manifest, fresh |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json` | Copied | Byte-identical copy of the re-minted manifest |
| `.codex/agents/review.toml`, `.pi/agents/review.md`, `.hermes/skills/agent-review/SKILL.md`, `.hermes/skills/sk-code-review/SKILL.md` | Deferred | The orchestrator runs the three generators after both builders finish |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The build ran the tasks in `tasks.md` in order, starting with baseline captures in this folder's `scratch/` directory. The edits went to the canonical texts first, then the checker, then the harness cases. The Claude fork got the agent edits by hand. The Codex, Pi and Hermes generators were not run in write mode, because two builders work in the same worktree and each generator rewrites every agent mirror. The orchestrator runs them once after both builds, then reruns goal criterion 4. Nothing was committed. The manifest and leaf steps ran as written.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The case is one `- Case:` sub-line anywhere in a finding block, and the template fixes it as the first sub-bullet | The checker proves presence without parsing layout, and the template carries the position |
| Numbers run 1 onward across every severity group | One sequence lets a reader say "fix 2 and 5" without asking which group |
| No version bump and no changelog entry | A changelog entry is a release action, and the phase 004 and 005 precedent leaves it out |
| The review-core id takes the list number | One numbering across the agent doc, the skill and the schema. This extends the brief's list and can be dropped |
| The section 8 per-format lists in the review agent keep their order | The new report-order paragraph governs. The mismatch is named under Known Limitations |
| The deep-review copies of the finding format are untouched | They belong to a separate agent and need their own amendment |
| The harness keeps its closing line `All rule-canary test cases passed` | Open question 4: the count is 54 PASS lines plus that closing line, and no line starts with `FAIL` |

---
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Each row is the real result from the run in this session. Full output is under `scratch/`.

| Goal criterion | Command result | Result |
|----------------|----------------|--------|
| C1 harness prints 54 PASS lines and exits 0 | `check-rule-copies.test.sh` printed 54 `PASS` lines, then `All rule-canary test cases passed`, `exit=0` | PASS |
| C2 case lines, connected-code step and numbering text | `rg -n '^\s*- Case: '` over the three files gave 3 hits; `Read the connected code` gave 1; `numbered once across all three groups` gave 1; exit 0 | PASS |
| C3 agent edits present and the fork matches | Three identical-range diffs empty, exit 0. `Reproducing case` gave 3 per agent file, `connected code` 1 and `Report order` 1 per file | PASS |
| C4 five mirror checks exit 0 | check-agent-mirror-sync --all: 12 agents, all mirrors in sync; Codex and Pi --check: 12 agents in sync; Hermes --check: 70 copies in sync; runtime mirrors: 187 in sync; all exit 0 (orchestrator rerun after one generator run each) | PASS |
| C5 leaf and compiled manifests fresh, archive identical | `checked=14 fresh=14 failed=0`, `leaf-manifest.json OK`, `sk-code fresh`, `cmp` silent, exit 0 | PASS |
| C6 `validate.sh --strict` prints RESULT: PASSED | `validate.sh <folder> --strict`: `RESULT: PASSED`, exit 0, Errors 0, Warnings 0 | PASS |

Other checks: the canary `check-rule-copies.js` printed the expected OK line with exit 0. The checker's direct runs gave exit 1 with `FAIL: finding 1 has no Case: line`, exit 1 with `FAIL: finding numbers restart or skip: expected 2, found 1`, and exit 2 with `cannot read` on a missing file. The doc validator reported 0 blocking issues on each of the four edited sk-code-review Markdown files, and the review agent kept its one non-blocking `non_sequential_numbering` warning. The drift guards passed with the same output as before the change.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Mirrors are not regenerated yet.** The Codex, Pi and Hermes review copies and the Hermes `sk-code-review` copy stay stale until the orchestrator runs the generators. Goal criterion C4 cannot pass before then.
2. **Section 8 ordering in the review agent.** The per-format lists keep their current order. The new report-order paragraph governs.
3. **Deep-review copies** of the finding format carry no case rule. A follow-up amendment would cover them.
4. **Checker visibility depends on git tracking.** The drift guard counts the new script only once it is staged. The scan reported 3 files while it is untracked.
5. **Compiled freshness compares the generation and the effective policy hash.** The sk-code SKILL.md body edits did not change that hash, so the route guard reported sk-code as fresh before the re-mint, where tasks.md expected stale. The re-mint rewrote the same bytes.
6. **The review agent's evidence table** widened its rows past the header padding. Markdown renders it, and the validator reported no new issue.
<!-- /ANCHOR:limitations -->

---
