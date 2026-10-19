---
title: "Implementation Summary"
description: "Every doc the OpenCode dual-compat build touched now names the version each dispatch shape belongs to, gives the OpenCode 2 form beside it or says there is none, and passes its sk-doc validator, DQI floor and human-voice scan."
trigger_phrases:
  - "documentation sweep implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/010-documentation-sweep"
    last_updated_at: "2026-10-19T05:40:00Z"
    last_updated_by: "template-author"
    recent_action: "Amended the sweep with the event correction found in phase 011"
    next_safe_action: "Phase complete. Continue phase 011 with the verification claim"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-documentation-sweep"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-documentation-sweep |
| **Completed** | 2026-10-19 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A reader who copies a cli-opencode command now knows which OpenCode it runs on, and gets the OpenCode 2 form beside it or a plain statement that there is none.

### Phase 10: documentation-sweep

Every line that uses an OpenCode 1 only flag now says so, through its own text, its heading or its doc's version note. Where OpenCode 2 has a form, it sits beside the OpenCode 1 line. The 27 playbook scenarios that use those flags each open with a version note. Where a scenario gives an OpenCode 2 twin, its pass lines say what a run shows on both versions: `step_start`, `tool_use`, `text` and `step_finish` events, each with a `sessionID`, and a 2.0.32 stream that can end with `text`. Behaviour no OpenCode 2 run has shown, such as how it routes `--agent`, is marked unverified on 2.0.32.

The SKILL.md version check now picks the same binary the dispatch resolver picks, and its pick was tested on a fixture PATH under bash and sh. The plugin, test and deep-loop READMEs describe the dual export, the new suites and the version resolver. A new catalog entry covers how a dispatch picks OpenCode 1 or 2. Changelog v1.5.0.0 records the build.

Phase 011's live runs then showed that the older event names (`session.started`, `message.delta`, `tool.call` and the rest) were wrong on OpenCode 1 too: both versions emit the same four events. An amendment rewrote them in 26 docs and tagged 11 docs whose OpenCode 1 lines the first search had left out (decision 18).

Two problems turned up along the way and are fixed. SKILL.md had gone over its 5,000-word limit in phase 006 and is now 4,899. The SKILL.md edits had also made the hub's compiled routing manifest stale, which the hub package check caught, so the manifest was re-minted.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| cli-opencode `SKILL.md`, `README.md`, seven references, `assets/prompt-templates.md`, `assets/prompt-quality-card.md` | Modified | Version tags, OpenCode 2 twins, the binary pick, the word-limit cut, version 1.5.0.0 |
| cli-opencode `manual-testing-playbook/` (root page and 27 scenarios) | Modified | Version notes, twins, pass readings and the event names |
| `feature-catalog/cli-dispatch-authorization`, `feature-catalog.md` | Modified | `opencode<digits>` executors and the version-aware rule checks |
| `feature-catalog/opencode-dual-version-dispatch/` | Created | How a dispatch picks OpenCode 1 or 2 |
| `cli-opencode/changelog/v1.5.0.0.md` | Created | The build's release entry |
| `cli-devin` and `cli-claude-code` references | Modified | Their OpenCode flag lines |
| `.opencode/plugins/README.md`, `.opencode/plugins/tests/README.md` | Modified | The dual export, the v2 suites, `opencode2` |
| deep-loop `runtime/scripts/README.md`, `runtime/tests/unit/README.md` | Modified | The resolver entry and the dual-dispatch suite |
| `command-support/deep/assets/compiled/README.md`, `command-support/doctor/scripts/README.md` | Modified | The moved manifest path; three blocked words |
| The hub's live and authored routing manifests | Modified | Re-minted after the SKILL.md edits |
| `.hermes/skills/cli-opencode/SKILL.md` | Regenerated | The generated Hermes copy |
| `doc-inventory.md` | Created | One row per doc, the findings and their closures |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator built the inventory from the 002 to 009 diffs and the v1-only search, and wrote one facts file every brief followed. DeepSeek wrote each doc in 23 briefs of one doc or one playbook group, then the catalog, the changelog and two READMEs. Luna reviewed in three groups and failed all three. The orchestrator checked each claim against the code or a saved probe before a fix: the v2 event names, the missing `opencode-go` provider, the resolver's PATH order and the spawn `cwd` were all confirmed (decision 12). Those facts went into the facts file, and five fix rounds followed, each verified by Luna until verify 4 passed. The orchestrator reran every validator, score, package check and search itself.

The event correction ran as rounds 6 to 9. DeepSeek wrote through cli-pi on llmgateway, the same model, because the devin daily quota was spent. Luna's events review raised three P1s (the v2 tool name, a dropped `step_start` check, the timestamp type) and its version-note review three more (an `--agent` caveat on scenarios without `--agent`). Each verify passed after its round.

The SKILL.md cut and the manifest re-mint came from the orchestrator's own package checks, not from the reviews. A substitution test showed that the SKILL.md bytes alone moved the policy hash (decision 14).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One shared facts file (decision 2) | Twenty-some dispatches had to state the same versions and flags |
| v2 twins keep the default model id and carry a provider check (decision 12) | v2 here lists no `opencode-go`, and the id is the dispatch's real default |
| `</dev/null` stays on both versions (decision 12) | The hang is seen on OpenCode 1 and unverified on 2; dropping a safety step on an unverified version would weaken it |
| Twins that pick `markdown` or `deep-review` directly were left (decision 12) | They mirror OpenCode 1 examples that already do so, a pre-existing routing fault |
| Rule 7 covers `version` only (decision 7) | Two descriptions stated wrong facts |
| The routing manifest was re-minted and copied to its authored path (decision 14) | The policy hash covers every packet SKILL.md byte |
| The empty `OPENCODE_BIN` P2 was declined (decision 15) | The resolver still refuses the dispatch, and SKILL.md has no word room |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <doc> --type <type>` on each touched doc | 52 of 52 exit 0 (`scratch/checks/after.tsv`) |
| `python3 .skilled/skills/sk-doc/shared/scripts/extract_structure.py <doc>` for `dqi.total` on each touched doc | Lowest 77, every row 75 or more |
| `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py <doc>` on each touched doc | 52 of 52 exit 0, no hard finding |
| Package checks (`doc-inventory.md` Package checks) | cli-opencode, the hub, cli-devin and cli-claude-code exit 0; playbook package exit 0, 55 scenarios; catalog exit 0; routing sync exit 0; Hermes `--check` PASS |
| v1-only search over the 52 docs (`scratch/checks/v1-hits-context.txt`) | 404 hits, none untagged |
| `rg -n "Verified against OpenCode"` over the touched docs | No hit |
| Phase-004 docs (`scratch/checks/review-docs-final.tsv`) | Same validator and HVR exits before and after |
| Reviews (`scratch/reviews/`) | Three FAIL; verifies 1, 2 and 3 FAIL with 7, 2 and 2 items open; verify 4 PASS. Event correction: events review FAIL (3 P1), verify PASS; version-note review FAIL (3 P1), verify PASS |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Most OpenCode 2 twins are unrun.** No twin was dispatched in this phase. Their flags come from the saved v2 help. The event names were checked against four live streams (the 006 and 011 smoke runs, one per version each), which carried no `--agent`, so v2 `--agent` routing stays unverified.
2. **v2 here has no `opencode-go` provider.** The twins keep the default id, which a reader on this machine has to swap for `llmgateway/deepseek-v4.1-flash` after checking `opencode2 models`.
3. **The `/doctor:opencode` route doc does not exist.** It waits for Q1, as phase 008 decided.
4. **Pre-existing problems stay.** The reviews found seven outside this sweep's scope, listed in `doc-inventory.md`, among them the mixed `deepseek-v4-flash` and `deepseek-v4.1-flash` spellings on OpenCode 1 lines.
5. **SKILL.md sits at 4,899 of 5,000 words.** Phase 011's verification line fits, but any further addition needs a cut.
<!-- /ANCHOR:limitations -->

---

