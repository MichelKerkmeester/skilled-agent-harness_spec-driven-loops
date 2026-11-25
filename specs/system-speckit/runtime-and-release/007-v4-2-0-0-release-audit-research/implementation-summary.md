---
title: "Implementation Summary"
description: "A two-lineage deep-research run audited the v4.2.0.0 release notes against v4.1.0.0..HEAD and confirmed 16 findings, three of them P1."
trigger_phrases:
  - "v4 2 0 0 release audit research implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research"
    last_updated_at: "2026-11-25T10:48:21Z"
    last_updated_by: "generate-context"
    recent_action: "Fixed both audit bugs and updated the v4.2.0.0 release notes"
    next_safe_action: "Review the diff, then commit the fixes and the release notes"
    packet_purpose: "Purpose: One synthesis that lists, with a commit hash and a `file:line` for each, every user-visible change the notes miss, every note the code contradicts and every bug found in code shipped in the window."
    blockers: []
    key_files:
      - ".skilled/changelog/skilled/v4.2.0.0.md"
      - ".skilled/commands/doctor/scripts/overlay-engine.cjs"
      - "specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:6b509cba340261ad324ed7c6b4886ec97e4e7327f2c44c7e245de19779a14b36"
      session_id: "scaffold-007-v4-2-0-0-release-audit-research"
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
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-v4-2-0-0-release-audit-research |
| **Completed** | 2026-11-25 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

The audit is done and nothing in the product changed. `research/research.md` lists 16 confirmed findings against the v4.2.0.0 notes: 9 missing entries, 5 drifted claims and 2 bugs. Three are P1: the unannounced Stop-hook answer recording, the Bladebro install line without `--ignore-scripts`, and `worktree-naming.sh` losing its executable bit.

### The audit

Two lineages, cli-codex and cli-devin, read the same window and packet list and proposed 26 distinct candidates. The orchestrator re-checked each one in the repository and rejected 10, with the deciding check named in the synthesis.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scratch/window-commits.txt` | Created | The 1084 non-merge commits in the window |
| `scratch/recent-packets.txt` | Created | The 21 recently touched packets |
| `research/` | Created | Lineage state, merged registry, resource map and the synthesis `research.md` |
| `spec.md` | Modified | The generated findings fence under Open Questions |
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modified | `isUnderRootSkilled` lowercases before comparing, so `root/Skilled/...` is refused |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs` | Modified | One test for a case-variant source |
| `worktree-naming.sh`, `worktree-naming.test.sh`, `skill_advisor.py` | Mode 100644 to 100755 | Restores the executable bit two window commits dropped |
| `.skilled/changelog/skilled/v4.2.0.0.md` | Modified | Nine missing entries, the Bladebro install line, two counts, the component list, the fallback caveat and six spec folders |
| `decision-record.md` | Created by the Claude Stop hook | The operator's loop choice, recorded unasked. Kept as evidence for finding M1 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

`fanout-run.cjs` ran both lineages in the background (exit 0, codex 76 minutes, devin 15 minutes, both stopped at the 10-iteration cap). `fanout-merge.cjs` merged them, `reduce-state.cjs` emitted the resource map, and the orchestrator verified each candidate with notes greps, cited-line reads and read-only commands before writing `research.md`. `synthesis-closeout.cjs` then recorded `synthesis_complete` through the append gateway.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Same topic for both lineages, default depth | Two model families on the same questions give a second lens, and the operator approved a convergence stop that expansive depth would change |
| Per-iteration timeout 1,800 s instead of 900 s | xhigh iterations on this repository could pass 15 minutes. None timed out |
| Severity of the Python fallback drift set by reach, not tally | The fallback serves only when the advisor daemon is unreachable, so it is P2 although one lineage said P1 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Fan-out run | `status: ok`, 2 of 2 lineages succeeded, every failure class 0 |
| Route proof | 10 of 10 state rows per lineage carry `target_agent: "deep-research"` |
| Containment | `git status` shows no write outside this packet beyond the pre-existing `graph-metadata.json` change |
| Python scorer count (D3) | `python3 -I test_skill_advisor.py` prints `pass=134, fail=0` |
| Overlay guard count (D4) | `node --test` prints `tests 21`, `pass 21` |
| Exec bit (B1) | `git diff --summary v4.1.0.0 HEAD` prints `mode change 100755 => 100644` |
| `typed` bug rejection | three `--force-local` probes returned `typed=True` |
| B2 regression test | Fails without the fix (`fail 1`), passes with it (`pass 1`) |
| Overlay engine suites | Two-suite baseline 113 of 113, after the fix 114 of 114. All 12 suites: 539 of 539 |
| sk-git naming suite | `PASS=190 FAIL=0` |
| Exec bits | `git ls-files -s` prints `100755` for all three, and the script runs directly |
| Quality gate | `quality-gate.cjs --files` on both changed files: 0 P0, 0 P1, 0 P2 |
| Release notes | `check_changelog_shape.py` PASS (baseline FAIL on 3 sentences and a 10.2 mean), `hvr_scan.py` 0 hard blockers (baseline 2), `validate_document.py` VALID, every glance anchor and all 16 spec folders resolve |
| Packet validation | `validate.sh --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **The audit is not exhaustive.** Both lineages stopped at the iteration cap, not on convergence, and only 5 of 26 candidates were found by both. A further `--extend` round, or a pass over the components line 823 does not name, would likely find more.
2. **Large suite totals were not rerun.** The advisor, deep-loop and doctor totals stay UNKNOWN, because each run writes outside the packet.
<!-- /ANCHOR:limitations -->

---


