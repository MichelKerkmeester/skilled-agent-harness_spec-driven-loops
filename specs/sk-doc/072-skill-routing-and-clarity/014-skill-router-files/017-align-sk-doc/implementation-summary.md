---
title: "Implementation Summary"
description: "The sk-doc docs, templates and catalogs now point at ROUTER.md wherever the router lives, and validate_document.py checks a ROUTER.md as a skill_router document. Routing did not change, and every recheck failure is classified."
trigger_phrases:
  - "align sk doc implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/017-align-sk-doc"
    last_updated_at: "2026-10-29T21:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded the sk-doc alignment check and its dispositions"
    next_safe_action: "Let the derived recheck failures re-mint at commit"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/scripts/validate_document.py"
      - ".skilled/skills/sk-doc/shared/assets/template-rules.json"
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
| **Spec Folder** | 017-align-sk-doc |
| **Completed** | 2026-10-29 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now follow any sk-doc playbook, catalog entry, template or README to the router and land in `ROUTER.md`. `validate_document.py` also checks a file named `ROUTER.md` as its own `skill_router` document type. Routing did not change: all 54 skill routers parse identically to HEAD.

### Phase 17: align-sk-doc

An operator-local alignment check ran over the 100 sk-doc files changed since base `6a9946a800`. Four read-only lanes found 24 findings (P0 0, P1 3, P2 21), after a critic overturned 11 more. A DeepSeek fix lane applied 23 FIXED lines, and a router-prose pass fixed the sk-design router descriptions the lane flagged. `validate_document.py` gained the `skill_router` type, with rules in `template-rules.json` and two tests in `scripts/tests/test_validator.py`, and the suite passes 15/15. `.env.example` now lists `ROUTING_SHAPE_DEBT_FILE` and `ROUTING_SHAPE_SKILLS_ROOT`.

Items not fixed in the fix lane, with their dispositions. There are no LEFT items.

| Item | Kind | Disposition |
|------|------|-------------|
| A-04 | OUTSIDE | Fixed in the router-prose pass: the chart and diagram router descriptions no longer claim a machine-readable projection they do not carry. |
| ENV-01 | OUTSIDE | Fixed: .env.example lists ROUTING_SHAPE_DEBT_FILE and ROUTING_SHAPE_SKILLS_ROOT under the internal overrides. |

### Files Changed

All paths are under `.skilled/skills/sk-doc/` unless they start with `.env` or name another skill.

| File | Action | Purpose |
|------|--------|---------|
| `scripts/validate_document.py`, `shared/assets/template-rules.json`, `scripts/tests/test_validator.py` | Modified | The `skill_router` type, its rules and two tests |
| `sk-create-skill/references/parent-skill/compiled-routing-lockstep-surfaces.json` | Modified | Five hub entries point at each hub's ROUTER.md |
| `ROUTER.md`, `sk-create-command/ROUTER.md`, `sk-create-goal/ROUTER.md` | Modified | All 15 registry modes in the overview; flowchart and chart sent to sk-design; accurate descriptions |
| `manual-testing-playbook/**`, `sk-create-benchmark/manual-testing-playbook/**`, `sk-create-frontmatter/manual-testing-playbook/**` | Modified | Triage lines, intent lists and anchors cite ROUTER.md |
| `feature-catalog/packet-authored-registry-routing/leaf-route-replay.md` and the root catalog | Modified | Gold is 64 rows; the contract validator described as two-state |
| `README.md`, `sk-create-diff/README.md`, `sk-create-feature-catalog/README.md`, `sk-create-readme/README.md`, `sk-create-skill/README.md`, `sk-create-skill/scripts/README.md` | Modified | ROUTER.md rows, the router canon and the script inventory |
| `sk-create-skill/assets/skill/skill-router-template.md`, `sk-create-skill/assets/skill/skill-readme-template.md`, `sk-create-agent/SKILL.md` | Modified | Template fields documented; routing dropped from the SKILL.md row; diagram work handed to sk-design |
| `.skilled/skills/sk-design/sk-design-chart/ROUTER.md`, `.skilled/skills/sk-design/sk-design-diagram/ROUTER.md` | Modified | Router-prose pass: descriptions match what each file carries |
| `.env.example` | Modified | Two routing-shape override rows |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modified | This phase's record |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The check resolved the file set, ran the battery (`{"pass":156,"not_applicable":4,"fail":1}`) and scored the routing probes (`pass=17 fail=1`). Four DeepSeek V4.1 Flash lanes reviewed code, skill docs, READMEs with changelogs and env, and routing. The critic overturned weak findings, the fix lane applied the rest that did not touch routing, and a prose pass fixed the router descriptions the fix lane could not. The validator type and env rows followed, and the recheck reran the full battery against the worktree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Give ROUTER.md its own document type | Before this phase `validate_document.py` had no type for a ROUTER.md, so no router rules applied to it |
| Leave the S2-2 changelog sentence unedited | The fix lane was barred from it, so only the anchor table changed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `package_skill.py --check --strict` (hub and nine packets) | PASS, each |
| `validate_document.py` (54 changed files) | 0 issues on 49 files; 5 end on a pre-existing `document_type_fallback` warning, 1 each, exit 0 |
| `check-markdown-links.cjs` | 0 broken markdown links |
| `test_validator.py` with `/usr/bin/python3` | `SUMMARY: 15/15 tests passed` |
| Recheck battery | `{"pass":190,"not_applicable":4,"fail":6}` |
| Recheck fail S2-skill-package | Derived: the compiled policy hash in the hub manifest re-mints at commit |
| Recheck fail S2-validate-document: `scripts/tests/skill-router-no-machine/ROUTER.md` | By design: the negative test fixture for the `skill_router` type, which `test_validator.py` expects to fail |
| Recheck fail S3-catalog-package | Fixed after this recheck: the sk-design-diagram catalog leaf and root now share one description, and `validate_catalog_package.py` reports 0 fail |
| Recheck fail S7-compiled-route-guard | Derived: the activation manifests re-mint at commit, by the pre-commit compiled-routing gate |
| Recheck fail S11-hermes-skills | Derived: the Hermes skill copies regenerate from source before the commit |
| Recheck fail S13-env-tokens | Tool artifact: the check reads the main checkout template; against the worktree template it reports `unlisted=0` |
| Router-file resolver | PASS: all 54 skill routers parse identically to HEAD |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Three recheck failures stay until commit.** S2-skill-package, S7 and S11 are derived files that re-mint or regenerate at commit, so they clear only then.
2. **The negative fixture always fails the battery.** `skill-router-no-machine/ROUTER.md` is built to fail the `skill_router` type, so expect it in every recheck.
<!-- /ANCHOR:limitations -->

---
