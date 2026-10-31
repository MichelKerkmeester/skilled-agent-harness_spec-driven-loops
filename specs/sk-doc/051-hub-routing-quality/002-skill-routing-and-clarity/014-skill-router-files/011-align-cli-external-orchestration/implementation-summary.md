---
title: "Implementation Summary"
description: "An operator-local alignment check over cli-external-orchestration found 19 upheld findings after the router move. The fix lane fixed 19, every other item has a disposition, and the recheck passes 142 checks with only derived or since-fixed failures."
trigger_phrases:
  - "align cli external orchestration implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/011-align-cli-external-orchestration"
    last_updated_at: "2026-10-29T20:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded the cli-external-orchestration alignment check, its fixes and the recheck"
    next_safe_action: "Commit so the pre-commit gates re-mint the derived files"
    blockers: []
    key_files:
      - "specs/sk-doc/072-skill-routing-and-clarity/014-skill-router-files/011-align-cli-external-orchestration/spec.md"
      - "specs/sk-doc/072-skill-routing-and-clarity/014-skill-router-files/011-align-cli-external-orchestration/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0274-packet-router-migration"
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
| **Spec Folder** | 011-align-cli-external-orchestration |
| **Completed** | 2026-10-29 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The cli-external-orchestration docs now match the router move. 19 upheld findings were fixed, and routing did not change.

### Phase 11: align-cli-external-orchestration

You can trust the cli-external-orchestration docs to point at `ROUTER.md` where they mean the machine router. The check read 73 changed files in four lanes and counted 19 findings, after the critic overturned 17 more. The fix lane fixed 19 of them. The fix lane left no item and marked none as outside its reach.

The recheck battery reads `{"fail":4,"pass":142,"not_applicable":3}`. Each failure is classified: S2-skill-package derived; S3-catalog-package fixed after this recheck; S7-compiled-route-guard derived; S11-hermes-skills derived. All 54 skill routers parse identically to HEAD, so no skill routes differently.

### Files Changed

Paths are relative to `.skilled/skills/cli-external-orchestration/` unless they start with `.skilled/`.

| File | Action | Purpose |
|------|--------|---------|
| `{cli-claude-code,cli-opencode}/manual-testing-playbook/intra-routing-recall/*.md` (18 files) | Modified | Fix lane: A-01 |
| the `intra-routing-recall/*.md` scenarios (20 files, 30 lines) | Modified | Fix lane: A-03 |
| `cli-claude-code/references/providers-and-models.md` | Modified | Fix lane: A-04 |
| `cli-pi/README.md` | Modified | Fix lane: A-05, B-06 |
| the `cli-executor-dispatch-routing` feature catalog entry | Modified | Fix lane: A-06 |
| `README.md` | Modified | Fix lane: A-07 |
| `cli-cursor/SKILL.md` and `cli-devin/SKILL.md` | Modified | Fix lane: A-08 |
| the cli-claude-code `cost-and-background` and `agent-routing` scenarios, and the cli-codex `codex-cloud` and `cli-invocation` scenarios | Modified | Fix lane: A-09 |
| `cli-opencode/manual-testing-playbook/external-dispatch/self-invocation-refusal.md` | Modified | Fix lane: B-01 |
| the `cross-repo-cross-server` `self-invocation-guard-nested.md` scenario | Modified | Fix lane: B-02 |
| `cli-{claude-code,codex,cursor,opencode,pi}/references/providers-and-models.md` | Modified | Fix lane: B-07 |
| `orchestrate-agent-multi-step.md` and `orchestrate-agent-multi-agent.md` | Modified | Fix lane: B-09 |
| `cli-opencode/references/self-invocation-guard.md` | Modified | Fix lane: C-03 |
| `SKILL.md` | Modified | Fix lane: C-06 |
| `cli-cursor/manual-testing-playbook/execution-modes/ask-mode-read-only.md` | Modified | Fix lane: C-09 |
| `cli-pi/assets/prompt-quality-card.md`, the cli-pi playbook files and the cli-hermes playbook | Modified | Fix lane: D-02 |
| the `ordered-bundle-cli-transport-compiled-routing.md` scenario | Modified | Fix lane: D-05 |
| `cli-opencode/manual-testing-playbook/manual-testing-playbook.md` | Modified | Fix lane: F-01 |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` (this folder) | Modified | Record the check and its evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

An operator-local alignment check resolved the files changed since base `6a9946a800` and ran the battery on the pushed tree. Four read-only lanes reviewed the files with DeepSeek V4.1 Flash workers, the advisor scored the probe prompts, and a critic overturned weak findings. A DeepSeek fix lane then applied the upheld findings that do not change routing, and a follow-up pass fixed the router prose the fix lane was barred from. Last, a recheck reran the full battery against the worktree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Bar the fix lane from routing data | The packet decision is that no skill routes differently, so routing items go to the routing follow-up |
| Fix router prose in a separate pass | The prose sits inside the MACHINE ROUTER section, which the fix lane may not edit |
| Classify each recheck failure instead of re-minting it | The derived files re-mint at commit through the pre-commit gates |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| First-run battery | `{"pass":128,"not_applicable":3}` |
| Routing probes | `no probes` |
| Fix-lane check | PASS: `package_skill.py --check --strict` on the hub and its 7 packets: PASS |
| Fix-lane check | PASS: `validate_document.py` on the 55 changed markdown files: Total issues: 0. It flagged a missing OVERVIEW in the cli-pi `prompt-quality-card.md`, which was there before. Section 1 OVERVIEW was added and the rest renumbered |
| Fix-lane check | PASS: `check-markdown-links.cjs`: OK, 0 broken markdown links |
| Recheck battery | `{"fail":4,"pass":142,"not_applicable":3}`; failures: S2-skill-package derived; S3-catalog-package fixed after this recheck; S7-compiled-route-guard derived; S11-hermes-skills derived |
| Router parse compare | PASS: all 54 skill routers parse identically to HEAD |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The derived failures stay until a commit.** S2-skill-package, S7-compiled-route-guard, S11-hermes-skills re-mint or regenerate at commit, through the pre-commit gates. This phase made no commit, so the recheck still shows them.
2. **No routing probes ran for this skill.** The router parse compare is the routing proof here.
<!-- /ANCHOR:limitations -->

---
