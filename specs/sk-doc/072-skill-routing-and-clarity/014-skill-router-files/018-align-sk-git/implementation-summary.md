---
title: "Implementation Summary"
description: "An operator-local alignment check over sk-git after the router move fixed 10 upheld findings in docs, a playbook and a config note, carried one routing item forward and left routing unchanged."
trigger_phrases:
  - "align sk git implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/018-align-sk-git"
    last_updated_at: "2026-10-29T21:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded the sk-git alignment check, its fixes and its recheck"
    next_safe_action: "Operator commits; pre-commit gates regenerate derived files"
    blockers: []
    key_files:
      - ".skilled/skills/sk-git/ROUTER.md"
      - ".skilled/skills/sk-git/SKILL.md"
      - ".skilled/skills/sk-git/README.md"
      - ".skilled/skills/sk-git/changelog/v1.11.6.0.md"
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
| **Spec Folder** | 018-align-sk-git |
| **Completed** | 2026-10-29 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The sk-git docs now point where the router actually lives. Ten upheld findings are fixed, and none of them changed what sk-git routes to.

### Phase 18: align-sk-git

You can trust the sk-git pointers again. Two GitHub MCP pointers that led nowhere now open `github-mcp-integration.md` sections 3 and 4. The README hook rows report counts that were measured, PASS=45 for commit-msg and PASS=80 for prepare-commit-msg. The changelog no longer claims a repointing that never happened, and the GIT-042 playbook scenario copies `hard-rules.json` so the advisory it tests actually fires.

One item needs routing data. D-1 wants `gitlens start review` pinned to sk-code, which takes an entry in `router-reach-allowlist.json` and `INTENT_SIGNALS`. It is carried to the routing follow-up in the parent spec.

### Files Changed

Paths are relative to the repository root.

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-git/SKILL.md` | Modified | The discovery sentence names only `references/` and `assets/`, matching `RESOURCE_BASES` (SKGIT-A-02) |
| `.skilled/skills/sk-git/ROUTER.md` | Modified | The negative is qualified to conditional resources, and the GITKRAKEN bullet says it loads on top of the always-loaded quick reference (X-01) |
| `.skilled/skills/sk-git/README.md` | Modified | The commit-msg row reports PASS=45 FAIL=0 and the prepare-commit-msg row PASS=80 FAIL=0, both measured (B-04, B-05) |
| `.skilled/skills/sk-git/changelog/v1.11.6.0.md` | Modified | The false repointing claim is replaced, and a spec-folder blockquote for 005-packet-and-standalone-migration is added (SKGIT-A-01, C-2) |
| `.skilled/skills/sk-git/references/finish-workflows.md` | Modified | The pointer goes to the sibling `github-mcp-integration.md` sections 3 and 4 (SKGIT-A-03) |
| `.skilled/skills/sk-git/assets/pr-template.md` | Modified | The tool pointer goes to `../references/github-mcp-integration.md` sections 3 and 4 (B-07) |
| `.skilled/skills/sk-git/leaf-manifest.config.json` | Modified | The `_note` separates the two ROUTER.md discovery roots from the manifest-reached catalog and playbook leaves (B-03) |
| `.skilled/skills/sk-git/manual-testing-playbook/git-preflight-advisory/advisory-fires-on-silent-scope-drop.md` | Modified | GIT-042 step 1 also copies `hard-rules.json` beside SKILL.md, and the scenario fires (B-01) |
| This phase's four spec documents | Modified | Record the run, the fixes and the recheck |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The scope step resolved 5 sk-git files across 27 first-parent commits from base `6a9946a800`. The battery passed 44 rows with 7 not applicable, and all 10 probes passed. Four DeepSeek V4.1 Flash lanes raised findings, the critic overturned 5, and 14 were upheld. The fix lane applied 10 and marked D-1 outside. The fix-lane checks passed. The recheck against the worktree then read pass 44, fail 3, not applicable 7, and each failure has a known cause. Last, the router-file resolver showed all 54 skill routers parse identically to HEAD.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Change no routing data in this phase | The packet decision is that no skill routes differently, so routing items go to the routing follow-up recorded in the parent spec |
| Fix router prose in a separate pass | The fix lane was barred from the router, so prose under the MACHINE ROUTER heading needed its own pass that left the routing data alone |
| Count S3-catalog-package as fixed after the recheck | The failing catalog row was an sk-design-diagram description mismatch outside sk-git, and once the leaf and root shared one description `validate_catalog_package.py` reported 0 fail |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| First battery, pushed tree | PASS: `{"pass":44,"not_applicable":7}` |
| Probes | PASS: `run-probes: pass=10 fail=0 cannot_run=0` |
| `package_skill.py --check --strict` | PASS: `Result: PASS` |
| `validate_document.py` | PASS: `Total issues: 0` on six files; ROUTER.md shows the pre-existing `document_type_fallback` notice, identical on HEAD |
| `check-markdown-links.cjs` | PASS: 0 broken markdown links |
| Recheck battery, worktree | FAIL 3, all classified: `{"pass":44,"fail":3,"not_applicable":7}`. S3 fixed after the recheck; S7 and S11 derived |
| Routing parse | PASS: all 54 skill routers parse identically to HEAD with the router-file resolver |
| `validate.sh --strict` on this folder | PASS: `RESULT: PASSED` with `Warnings: 0` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two recheck rows stay red until the commit.** S7-compiled-route-guard and S11-hermes-skills are derived. The pre-commit gates re-mint the activation manifests and regenerate the Hermes copies.
2. **D-1 stays open.** Pinning `gitlens start review` to sk-code needs routing data, so it waits for the routing follow-up.
<!-- /ANCHOR:limitations -->

---
