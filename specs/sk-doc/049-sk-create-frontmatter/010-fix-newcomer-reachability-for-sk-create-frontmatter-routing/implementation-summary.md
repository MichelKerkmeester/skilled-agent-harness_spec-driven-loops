---
title: "Implementation Summary: fix newcomer reachability for sk-create-frontmatter routing"
description: "Ten plain-language phrases on all five routing surfaces moved newcomer prompts resolving to the mode from zero of ten to six of ten, with one phrase dropped for over-capture and two refused, the compiled routing refreshed, and committed tool-digest drift re-pinned across the canaries."
trigger_phrases:
  - "newcomer reachability result"
  - "six of ten newcomer prompts"
  - "alias over-capture dropped"
  - "tool digest drift re-pinned"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/049-sk-create-frontmatter/010-fix-newcomer-reachability-for-sk-create-frontmatter-routing"
    last_updated_at: "2026-09-06T00:00:00Z"
    last_updated_by: "implementation"
    recent_action: "Closed the phase with every gate green"
    next_safe_action: "Commit the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-049-010-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-fix-newcomer-reachability-for-sk-create-frontmatter-routing |
| **Status** | Complete |
| **Completed** | 2026-09-06 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The mode became reachable by people who do not know the word frontmatter. Before this phase every
one of the eighteen declared triggers resolved to `sk-create-frontmatter` and none of ten prompts a
newcomer would type did. After it, six of the ten resolve to the mode with a compiled target, four
of them above 0.90.

Ten plain-language phrases were added to stage one and to all four stage-two surfaces at once, so
no phrase produces a hub-only hit. One, `missing a field`, captured a phone-number form prompt and
was replaced by `validator says my file is missing`. Two candidates, `version number` and
`version line`, were probed first and refused, since they already reach the hub on a Node version
question and a changelog prompt.

The registry and hub router are pinned compiled-routing sources, so the edit carried the manifest
re-mint, the artifact rebuild and the digest re-pin. The canary then stayed red on two benchmark
scripts another commit had moved at HEAD. Those digests were re-pinned in the canary, the shared pin
source and the four sibling canaries.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `sk-doc/graph-metadata.json` | Modified | Ten phrases in `intent_signals` and `derived.trigger_phrases` |
| `sk-doc/mode-registry.json`, `sk-doc/hub-router.json`, `sk-doc/ROUTER.md` | Modified | The same ten at stage two |
| `sk-create-frontmatter/SKILL.md` | Modified | The same ten on the keyword line |
| `013-live-activation/activation/sk-doc/manifest.json` (runtime and authored) | Re-minted | Fingerprint `9b9fc1f0b479...` |
| `009-parent-hub-rollout/007-sk-doc/harness/validate-canary.cjs` | Modified | Three authored digests and two tool digests re-pinned, one durable comment |
| `009-parent-hub-rollout/007-sk-doc/{activation,compiled}/*` | Regenerated | Five artifacts |
| `005-decision-evaluator/harness/protected-digests.json` | Modified | The two tool digests |
| `009-parent-hub-rollout/{001,002,003,004}-*/harness/validate-canary.cjs` | Modified | The two tool digests |
| `../spec.md`, `../goal.md` | Modified | Phase map row 10, handoff row, binding row, progress row, open question |
| This folder | Added | Phase 010 documents and metadata pair |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The same ten prompts were replayed at advisor generation 605 before any edit and at generation 606
after the compile, with the eighteen declared triggers replayed alongside so a gain on one set could
not hide a loss on the other. Every added phrase was replayed against an out-of-domain prompt. The
guard was read stale after the registry edit and fresh after the re-mint.

### 3. The phrases

| Phrase | Prompt it serves |
|--------|------------------|
| `yaml header` | write the YAML header for this doc |
| `goes at the top of the file` | what goes at the top of the file |
| `version number at the top` | what version number do I put at the top |
| `importance tier` | which importance tier should this reference get |
| `versioning pass` | is it safe to re-run the versioning pass |
| `stopped showing up in suggestions` | my skill stopped showing up in suggestions |
| `validator says my file is missing` | the validator says my file is missing a field |
| `description too long` | the description warning |
| `edit count` | how many times has this file been edited |
| `field the validator wants` | the validator names a field |

### 4. Routing measurement

| Newcomer prompt | Before, generation 605 | After, generation 606 |
|-----------------|------------------------|-----------------------|
| what goes at the top of the file | nothing | `sk-doc` 0.9389, target `sk-create-frontmatter` |
| validator says my file is missing a field the neighbour has | nothing | 0.9336, target |
| what version number do I put at the top of a new doc | nothing | 0.82, hub only |
| my skill description is 500 characters and something is warning | nothing | nothing |
| my skill stopped showing up in suggestions but runs when I name it | nothing | 0.9103, target |
| how many times has this file really been edited | nothing | nothing |
| add the version line to this command file | 0.82, hub only | 0.82, hub only |
| is it safe to re-run the versioning pass | 0.82, hub only | 0.8464, target |
| which importance tier should this reference get | 0.8836, hub only | 0.8836, target |
| write the YAML header for this doc | 0.82, hub only | 0.9419, target |

Declared triggers: eighteen of eighteen resolve to the mode after, as before.

Out-of-domain replays after the swap: a license comment at the top of a file, a form missing a
phone-number field, a listing-page description too long, a wiki edit count and an npm search miss
route nothing to the mode.

Version probes: `what is the version number of node` and `the version line at the top of this doc`
reach `sk-doc` at 0.82 before any alias, and `bump the version number in package.json` reaches
`sk-code`. Adding the aliases would have resolved the Node question to the frontmatter mode.

### 5. The digest drift

| Digest | Owner | State at HEAD | Action |
|--------|-------|---------------|--------|
| `SKILL.md`, `hub-router.json`, `mode-registry.json`, `packets/sk-create-frontmatter/SKILL.md` | This phase | Moved by this phase | Re-pinned |
| `load-playbook-scenarios.cjs`, `score-skill-benchmark.cjs` | `system-deep-loop` benchmark | Moved in `2f21545e3e`, clean | Re-pinned in six pin files |
| Sibling hub sources | Other hubs | `system-deep-loop`, `mcp-tooling` and `cli-external-orchestration` hub `SKILL.md` files moved at HEAD | Not touched. Those canaries stay red on their own sources. `sk-code` reads `GREEN` |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Drop `missing a field` for a narrower phrase | It captured a form prompt at 0.8966. ADR-001 |
| Refuse the version phrases | They already reach the hub on unrelated prompts, and a command file carries no version by the mode's own standard. ADR-002 |
| Re-pin the tool digests in every live pin, restore the evidence files a first pass touched | Committed drift closes in one pass, and evidence records what was true when written. ADR-003 |
| No default mode in the hub router | The hub doctrine forbids a silent default |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Keyword line versus registry aliases | identical, 28 entries |
| `parent-skill-check.cjs .opencode/skills/sk-doc` | all hard invariants passed, 0 warnings |
| `compiled-route-guard.cjs` | all hubs fresh |
| `compiled-route-sync.cjs --verify` | `move-simulation OK` |
| `validate-canary.cjs` for sk-doc | `REAL-GREEN`, 23 of 23 rows |
| Sibling canaries | `sk-code` GREEN. The other three red on their own hub sources, recorded |
| `validate.sh --strict` on the parent and this phase | recorded by the closing run |
| `hvr_scan.py` on every document here | recorded by the closing run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Four of ten newcomer prompts still stop short.** Two at the hub floor with no target, two at
   nothing. The vocabulary is present. This is the scorer dilution phases 008 and 009 recorded, and
   it belongs to `system-skill-advisor`.
2. **Two aliases were refused on purpose.** `version number` and `version line` would misroute a
   Node version question. The two prompts they served stay hub-only.
3. **Three sibling canaries are red on their own hub sources.** Their `SKILL.md` files moved at HEAD
   after their last re-pin. Their owners re-pin them.
4. **A first hash replacement rewrote nine evidence files.** They were restored from HEAD before
   any gate ran. Nothing of theirs is in this phase's diff.
<!-- /ANCHOR:limitations -->
