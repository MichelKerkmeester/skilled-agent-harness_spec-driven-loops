---
title: "Feature Specification: design-interface SKILL.md word-cap relief"
description: "Content reorganisation inside the design-interface mode to reclaim headroom against the 5,000-word SKILL.md hard cap, which stood at nine words after the motion merge, by relocating the motion downstream sequence to its already-mapped gate reference and removing third-copy prose, while leaving the parseable in-skill router byte-identical."
trigger_phrases:
  - "skill word cap relief"
  - "design-interface SKILL.md word count"
  - "sk-design 5000 word cap"
  - "motion prose relocation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/014-skill-word-cap-relief"
    last_updated_at: "2026-07-27T19:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Trimmed design-interface/SKILL.md 4991 to 4760 words; router block byte-identical."
    next_safe_action: "Re-run package_skill --check and parent-skill-check before committing SKILL.md."
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/SKILL.md"
      - ".opencode/skills/sk-design/design-interface/references/motion/animation-decision-framework.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "resource-loading-notes.md is on disk but absent from RESOURCE_MAP — pre-existing D5 gap, not fixed here"
    answered_questions:
      - "Should the relief be a command split? No — 013 concluded the cap is a SKILL.md constraint, not a command constraint."
      - "Should the relocated motion prose become a new file? No — a new file would break the D5 connectivity gate without a router edit."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: design-interface SKILL.md word-cap relief
<!-- SPECKIT_LEVEL: 2 -->
<!-- PHASE_LINKS: parent=../spec.md; predecessor=013-design-command-decomposition-research -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete — 4,991 to 4,760 words; both gates green; router byte-identical |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/014-template-conformance` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `013-design-command-decomposition-research` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`design-interface/SKILL.md` measured 4,991 words against the 5,000-word hard cap enforced by `package_skill.py` (`MAX_SKILL_MD_WORDS`) — nine words of headroom. That figure is not incidental: the file was trimmed from 5,234 words purely to clear the cap after the retired `motion` mode's content was folded in during `010-motion-merge`. With nine words left, the cap has stopped being a ceiling and become a zero-sum budget. The next person to add an intent, a rule, or a resource row must delete something to make room, and the cheapest-looking thing to delete is rarely the least load-bearing thing. That silent-deletion pressure is the actual risk this packet addresses, not the word count itself.

The relief has to come from prose, because the file also contains a fenced Python block — `DEFAULT_RESOURCE`, `INTENT_SIGNALS`, `RESOURCE_MAP` — that is machine-parsed. It drives deterministic in-skill routing and the skill-benchmark D5 connectivity gate, which requires every reference and asset on disk to appear in at least one `RESOURCE_MAP` entry. The router is frozen: moving it, splitting it, or trimming keywords out of it to buy words would trade a documentation problem for a routing defect.

### Purpose

Reclaim usable headroom by content reorganisation inside the one mode: relocate the motion downstream sequence into the motion reference that already loads first on every motion task, and remove prose that is a third or fourth statement of something the file already says elsewhere. Predecessor `013-design-command-decomposition-research` established what this packet must not do — both of its independent 10-iteration lineages concluded the cap is a `SKILL.md` constraint rather than a command constraint, and that a command split would cost roughly nine files and 440 metadata lines to buy the same relief.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Measuring the baseline with the checker's own method (`len(content.split())` over the raw file including frontmatter, per `package_skill.py`), not an approximation.
- Relocating the Motion Design Workflow downstream sequence out of `SKILL.md` §3 into `references/motion/animation-decision-framework.md`, which is already first in every `MOTION_*` `RESOURCE_MAP` entry.
- Removing duplicated explanation where the same resource is described in both the Resource Loading Levels table and the Core References index, applying a one-home rule: the table owns tier plus when-to-load plus path; the index owns what the file is.
- Removing residue prose describing retired modes, and prose that restates a rule already stated normatively in `RULES` or `SUCCESS CRITERIA`.
- Correcting the stale manual-testing-playbook sub-path in §5, which named a snake_case directory and an `<NN>--` numbering scheme that do not exist on disk.

### Out of Scope

- Any edit to the fenced router block: `DEFAULT_RESOURCE`, `INTENT_SIGNALS`, `RESOURCE_MAP`, the resilience guards, or the routing-flow comment. Frozen and verified byte-identical.
- Splitting `/interface:design` into multiple commands, or any change to `mode-registry.json`, `command-metadata.json`, `hub-router.json`, or command docs — settled against by predecessor `013`.
- `design-mcp-open-design/`, `design-interface/manual-testing-playbook/`, and `design-interface/scripts/`, all under concurrent edit by other sessions.
- Deduplicating the restraint-gate ordering guarantee, which is deliberately stated three times because `RESOURCE_MAP` has no ordering semantics.
- Fixing the pre-existing D5 gap on `resource-loading-notes.md`, which would require a router edit.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/design-interface/SKILL.md` | Modify | Prose-only reduction, 4,991 to 4,760 words; router block untouched |
| `.opencode/skills/sk-design/design-interface/references/motion/animation-decision-framework.md` | Modify | Receives the relocated eight-step motion sequence as a new §7 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The fenced router block is byte-identical before and after, including all intent keys, keyword lists, `RESOURCE_MAP` entries, and `DEFAULT_RESOURCE` | SHA-256 of the extracted fenced block matches the `HEAD` version exactly; per-section byte comparison of `INTENT_SIGNALS`, `RESOURCE_MAP`, and `DEFAULT_RESOURCE` all report identical |
| REQ-002 | `package_skill.py design-interface --check` returns PASS, with the word count strictly below the 5,000-word cap and materially clear of it | Checker reports PASS and a word count at or below 4,800, versus the 4,991 baseline |
| REQ-003 | The D5 connectivity property is no worse than baseline — every reference and asset on disk that was reachable from a `RESOURCE_MAP` entry before is still reachable after | Set difference of on-disk `references/**.md` plus `assets/**.md` against mapped paths yields the same single pre-existing entry as the `HEAD` baseline, and no new one |
| REQ-004 | The restraint-gate ordering guarantee survives in all three engineered positions | The ALWAYS resource row naming the gate is verbatim, the gate is still first in every `MOTION_*` `RESOURCE_MAP` entry, and ALWAYS rule 11 still requires it before any timing or easing choice |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `parent-skill-check.cjs` on the sk-design hub reports OK with 0 warnings, unchanged from baseline | Runner prints `OK: parent-skill-check — all hard invariants passed, 0 warnings`, including `10b-byte-drift` PASS |
| REQ-006 | No guidance is deleted outright — every removed sentence is either relocated to a reference that loads on the same trigger, or is a second statement of something the file still says elsewhere | Each removal is traceable in `implementation-summary.md` to a surviving home, named by file and section |
| REQ-007 | Every relative link in both edited files resolves on disk | Link resolution sweep over both files reports zero broken targets |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Headroom against the hard cap goes from single digits to at least 200 words, so a routine addition no longer forces a compensating deletion.
- **SC-002**: A reader following any motion trigger still reaches the full ordered sequence — gate, purpose and budget, timing, reduced-motion, three cards, handoff — because the reference carrying it is the one that loads first on every motion intent.
- **SC-003**: The reduction is verifiable rather than asserted: baseline and final counts are produced by the checker's own counting method, and the router's byte-identity is proven by hash rather than by inspection.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Creating a new sub-document under `references/motion/` would leave it absent from `RESOURCE_MAP` | D5 connectivity gate fails, and the only fix is a router edit that this packet forbids | Relocate into an existing mapped reference instead of creating a file; no router edit and no `leaf-manifest.json` regeneration needed |
| Risk | Trimming a parenthetical from the Resource Loading Levels table deletes the only description of a resource | Real guidance lost under cover of deduplication | One-home rule applied per resource; the `context-loading-contract.md` row keeps its parenthetical because that file has no Core References entry |
| Risk | Deduplicating the restraint-gate statements looks like an easy 40-word win | Ordering guarantee lost, since `RESOURCE_MAP` cannot express ordering | Treated as frozen in §3 Out of Scope and verified by REQ-004 |
| Dependency | `SKILL.md` is under concurrent edit pressure from other sessions in the same hub | A lost concurrent edit, or an edit landing on top of a stale read | Working-tree collision check before the first edit and again before final verification |
| Dependency | `system-spec-kit` `node_modules` is being emptied intermittently by a concurrent session | `validate.sh` fails with `ERR_MODULE_NOT_FOUND` on `zod`, unrelated to content | Retry spaced out; never run `npm install`, which would race the other session |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: The reduction must leave the file structurally easier to extend, not merely shorter. The one-home rule is the durable part: after this packet, a resource is described in exactly one of the two indexes, so a future editor updating a description has one place to change rather than two that can drift.

### Reliability
- **NFR-R01**: No behavioural change to routing is acceptable as a side effect of a documentation edit. Byte-identity of the parsed block is the only acceptable evidence, since a semantically-equivalent rewrite would still be a change to a parsed artifact.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Error Scenarios
- **`SKILL.md` goes dirty in the working tree mid-flight**: stop editing, report exactly which edits landed, and never revert the other session's changes — a deferred correct answer beats a lost concurrent edit.
- **The achievable saving turns out to be trivial, or every candidate cut costs real guidance**: a documented "the file is already tight, here is where the words are and why none should go" is the correct outcome; manufacturing a reduction by deleting substance is not.
- **A trim removes the last on-disk link to a `procedures/` card**: acceptable only because `procedures/` is outside the D5 scan (which covers `references/` and `assets/`) and because the Section 3 selection table links all eight cards with their triggers; every card link is nevertheless retained in the Core References index.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Resolved**: the on-record proposal was a new sub-document under `references/motion/`; it was evaluated and deliberately not taken, because a new file is invisible to `RESOURCE_MAP` and repairing that requires the frozen router. Appending to `animation-decision-framework.md` delivers the same relocation with strictly better load semantics — that reference is already first in all six `MOTION_*` entries, so the sequence now loads on every motion intent rather than on a new conditional one.
- **Unresolved (pre-existing, not this packet's scope)**: `references/design-process/resource-loading-notes.md` exists on disk but appears in no `RESOURCE_MAP` entry, so it is unreachable by the D5 connectivity gate. Verified identical at `HEAD`, so it predates this work; fixing it means editing the router, which this packet froze.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent**: `.opencode/specs/sk-design/014-template-conformance/spec.md`
- **Predecessor**: `../013-design-command-decomposition-research/`
