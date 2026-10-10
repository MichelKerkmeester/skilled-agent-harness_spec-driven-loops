---
title: "Implementation Summary"
description: "The review mode now detects surfaces through the shared sk-code contract, names the Obsidian surface, grades both finding shapes and ships as 1.7.0.0. Review found three small defects, all fixed."
trigger_phrases:
  - "review mode implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/002-review-mode"
    last_updated_at: "2026-10-10T14:00:00Z"
    last_updated_by: "claude-sonnet-5-5-reviewer"
    recent_action: "Verified; fix units applied and rechecked"
    next_safe_action: "Orchestrator runs the post-build generators"
    blockers: []
    key_files:
      - ".skilled/skills/sk-code/sk-code-review/SKILL.md"
      - ".skilled/skills/sk-code/sk-code-review/scripts/README.md"
      - "scratch/fix-units-applied.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-review-mode"
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
| **Spec Folder** | 002-review-mode |
| **Completed** | 2026-10-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A review of a generic Node repository no longer gets Webflow standards, an Obsidian plugin review now reports its own surface, and the findings checker grades the heading-shaped findings that `review-core.md` prescribes instead of passing them unseen. The mode's docs now agree with each other and with the tree, and the packet is released as 1.7.0.0.

### Phase 2: review-mode

The old `detect_surface_evidence` sent any path containing `package.json` or `src/` to Webflow and had no Obsidian branch. It now restates `shared/references/stack-detection.md` section 2 in the contract's precedence (OPENCODE, then OBSIDIAN, then WEBFLOW, then UNKNOWN), honours the contract's explicit non-Webflow wording and returns the contract's own surface names as the tokens in the output contract. A new optional `read_text` argument supplies file text for the content markers. SKILL.md and `review-core.md` point to the shared contract as the owner of the markers.

`check-review-findings.js` reads both shapes (`1. path:line Title` and `### 2 [P1] Title`) and accepts a column-0 `- Case:` line. `check-review-final-line.js` accepts extra spaces after `Not checked:`. A four-file fixture proves both shapes through both checkers, so a vacuous pass now fails the harness.

The doc fixes cover the cache location (`${XDG_CACHE_HOME:-$HOME/.cache}/sk-code-review/<repo-ref>.jsonl`, outside the reviewed repository), the deep-review ownership rule, one status vocabulary (`APPROVED`, `REQUESTED_CHANGES`, `COMMENTED`), the removal-plan urgency sentence, the unassigned CR-019, the playbook validator command, the README folder convention and the pre-rename mode names.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/sk-code-review/SKILL.md` | Modified | Version 1.7.0.0, shared-contract detector, shared pointer, surface and status tokens, cache path, playbook validator, mode names |
| `.skilled/skills/sk-code/sk-code-review/README.md` | Modified | Version, mode names, surface token, cache path, playbook validator, folder convention |
| `.skilled/skills/sk-code/sk-code-review/references/review-core.md` | Modified | Ownership rule, surface tokens, shared pointer |
| `.skilled/skills/sk-code/sk-code-review/references/quick-reference.md` | Modified | Deep-review YAML described as an external consumer |
| `.skilled/skills/sk-code/sk-code-review/references/review-ux-single-pass.md` | Modified | Gate-recommendation tokens match the status line |
| `.skilled/skills/sk-code/sk-code-review/references/pr-state-dedup.md` | Modified | Cache path and rationale |
| `.skilled/skills/sk-code/sk-code-review/assets/removal-plan.md` | Modified | Urgency-scale sentence |
| `.skilled/skills/sk-code/sk-code-review/manual-testing-playbook/manual-testing-playbook.md` | Modified | Scenario ID range without CR-019 |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-review-findings.js` | Modified | Heading shape and column-0 Case line |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js` | Modified | Extra spaces after `Not checked:` |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` | Modified | Two new exact-string entries |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh` | Modified | Seeded UX file and 14 new PASS lines |
| `.skilled/skills/sk-code/sk-code-review/scripts/README.md` | Modified | Checker, fixture and canary rows |
| `.skilled/skills/sk-code/sk-code-review/scripts/review-output-fixture/` | Created | Four review outputs, two shapes, good and bad |
| `.skilled/skills/sk-code/sk-code-review/changelog/v1.7.0.0.md` | Created | Changelog entry |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash applied 69 pre-planned units one at a time (64 edits, 5 file creations), each gated by its own check; the chain log shows 69 of 69 passing. The reviewer then reran every check independently: all 69 unit checks match, the 64 edits applied in memory to the committed text equal the working files byte for byte, and the five created files equal their sources under `scratch/units/`. The builder never captured the `scratch/*-before.txt` baselines, so the committed HEAD tree (`git archive HEAD`) stood in for every before state. Nothing was committed.

Review found three defects, written as five fix units (F001 to F005). DeepSeek applied them (5 of 5, no retries) and the reviewer reran everything: the five fix checks, both probes, `detect-probe.py` (six lines unchanged), the five goal criteria and the doc validators. The applied units are in `scratch/fix-units-applied.json`; `scratch/fix-units.json` is `[]`. Hermes regeneration, the leaf-manifest refresh and the compiled sk-code re-mint remain with the orchestrator.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Surface tokens are the contract's names (`OPENCODE`, `OBSIDIAN`, `WEBFLOW`, `UNKNOWN`) | The detector restates the contract, and the old `sk-code:code-*` tokens had no consumer outside the packet (no match anywhere else in the tree) |
| The detector is file-marker based; prompt words count only for the Obsidian plugin phrases and the non-Webflow guard | The contract names no other prompt words, and its symlink guard rejects a literal `.opencode/` test |
| The M-1 cache moves to the user cache directory | A per-user cache writes nothing into the reviewed repository and works across clones |
| One status vocabulary, `APPROVED`, `REQUESTED_CHANGES`, `COMMENTED` | These are the tokens `check-review-final-line.js` enforces |
| No agent file is edited and the `code-review` routing inputs stay | The agent's own three-way PR scale is outside the packet, and the frontmatter and trigger phrase feed the advisor |
| The canary pins only the new invariants (assessment tokens, gate-recommendation tokens, shared pointer) | Those are what this fix creates; a tamper of each pin was confirmed to fail |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Goal 1: `python3 -I scratch/detect-probe.py` | PASS: exit 0, six lines `generic-node-src: UNKNOWN`, `dependency-bump: UNKNOWN`, `obsidian-prompt: OBSIDIAN`, `hub-file: OPENCODE`, `webflow-path: WEBFLOW`, `obsidian-manifest: OBSIDIAN` |
| Goal 2: `check-review-findings.js` on `heading-shape-valid.md` and `heading-shape-restart.md` | PASS: `OK: findings are numbered once and each carries a Case line` exit 0; `FAIL: finding numbers restart or skip: expected 2, found 1` exit 1 |
| Goal 3: `bash check-rule-copies.test.sh` | PASS: exit 0, 68 `PASS` lines, ends `All rule-canary test cases passed` |
| Goal 4: `node check-rule-copies.js` | PASS: exit 0, `OK: all rule invariants present (6 exact-string file(s) + 2 Iron Law file(s) + 21 delivery-prefix anchor(s) + 2 example output(s)).` |
| Goal 5: `validate.sh <folder> --strict` | PASS: `RESULT: PASSED` (run after the derived metadata repair) |
| Before states reproduced from HEAD | Probe printed the six old tokens, the HEAD findings checker printed `OK: no numbered findings to check` on the restart fixture, the HEAD final-line checker rejected two spaces, canary 5 exact-string files, harness 54 PASS |
| Doc validators, 8 edited files | 7 files `Total issues: 0`; `pr-state-dedup.md` keeps its one pre-existing `missing_required_section: overview` error |
| Playbook under `--type playbook`, changelog | `Total issues: 0` each; changelog `hvr_scan.py` hard blockers 0 |
| Agent mirror, Codex and Pi checks | `12 agent(s) checked`, both `PASS: 12 agents are in sync.` |
| Scoped drift guard on `scripts/` | `[alignment-drift] PASS`, `Findings: 0` |
| Full drift guards | Only doc-claims fails (`1/4 checks passed`, hub-wide, 0 of 4 at HEAD); every remaining hit is outside sk-code-review: the sk-code-review hit count is 0 after F001 |
| Fix units F001 to F005 | PASS: five checks match, `gsap-probe.py` -> `gsap-call: WEBFLOW`, `route-probe.py` -> `route-obsidian-manifest: OBSIDIAN`, `detect-probe.py` unchanged |
| Hermes `--check` | PENDING-ORCHESTRATOR: 8 drifted copies including `sk-code-review` |
| Leaf manifest and compiled sk-code route | PENDING-ORCHESTRATOR: `checked=14 fresh=13 failed=1`, `sk-code stale-manifest`; sibling edits also change the hashed set |
| Scope check | 13 modified files and 2 new paths exactly as the plan lists, no agent or mirror row |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Finding f-iter011-002 item (e) is a deliberate exclusion.** Pinning the AGENTS.md-level review floors in the canary stays out (plan D8, which extends the canary only where a new invariant needs pinning), because those pins would make the canary fail on routine AGENTS.md edits. It is not a defect.
2. **Orchestrator items remain.** Hermes regeneration, the leaf-manifest refresh and the compiled sk-code re-mint run once after every child lands.
<!-- /ANCHOR:limitations -->

---
