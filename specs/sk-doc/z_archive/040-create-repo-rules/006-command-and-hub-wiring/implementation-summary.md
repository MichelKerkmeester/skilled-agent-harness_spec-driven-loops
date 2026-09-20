---
title: "Implementation Summary: Phase 6: Command and Hub Wiring"
description: "The mode is reachable: four registries at exactly +1 each and verified by read-back, a command with three assets, and a mirror that follows. Two of the four registries turned out to be keyed objects rather than lists, which reading a sibling entry first caught before it corrupted a shared file."
trigger_phrases:
  - "hub registration done"
  - "count delta verification"
  - "mirror resolves"
  - "pre-existing broken leaves"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/040-create-repo-rules/006-command-and-hub-wiring"
    last_updated_at: "2026-08-31T11:33:12Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Registered the mode across four registries and authored the command"
    next_safe_action: "Exercise the mode on a real accept and a borderline refusal"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-command-and-hub-wiring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-command-and-hub-wiring |
| **Completed** | 2026-08-31 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`sk-create-repo-rule` is reachable. Four registries name it, `/create:repo-rule` exists with
its three assets, and the cross-runtime mirror resolves.

### Exactly one entry per registry, verified by reading back

| Registry | Before | After |
|----------|--------|-------|
| `mode-registry.json` | 12 | 13 |
| `hub-router.json` signals | 12 | 13 |
| `command-metadata.json` | 11 | 12 |
| `leaf-manifest.json` | 12 | 13 |

Each entry was then loaded and inspected. A count that rose is not the same as an entry
that is correct, and a write that succeeds is not the same as either.

### Routing separates the likely confusion

`sk-create-skill` is what a rule request gets mistaken for. The vocabulary class is
constraint-shaped on purpose — "we should always", "stop doing", "retire a rule" — and a
probe with *"i want to add a repo rule that stops us doing X"* matches this mode and not
`sk-create-skill`.

### Retire defaults to confirm

The command router overrides the suffix: `retire` runs interactive even under `:auto`,
unless the operator writes `retire :auto` explicitly. It deletes a file and removes two
router rows; making that the one operation you cannot trigger by accident costs nothing.

### Files Changed

| File | Action |
|------|--------|
| `commands/create/repo-rule.md` | Created — thin router |
| `commands/create/assets/create-repo-rule-{auto,confirm}.yaml` | Created — workflow assets |
| `commands/create/assets/create-repo-rule-presentation.txt` | Created — presentation contract |
| `.claude/commands/create/repo-rule.md` | Created — mirror symlink |
| `sk-doc/{mode-registry,hub-router,command-metadata,leaf-manifest}.json` | Modified — one entry each |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baseline, then edit, then read back — because this is the one phase where a write can
succeed and change nothing, and the failure would surface later as an apparent routing bug.

Each registry's shape was read from a sibling entry before the new one was written, so the
edit matches the file's own conventions rather than an imposed shape. Two of the four turned
out not to be lists at all: `hub-router.json` keys `routerSignals` and `vocabularyClasses`
by mode name, and assuming a list would have produced a malformed file the whole hub loads.

The regression sweep found six broken leaf references — and they are **not mine**. Replaying
the check against `HEAD`'s manifest returned the same six, in `sk-create-changelog` and
`sk-create-quality-control`. All seven of the new mode's leaves resolve. Recorded rather
than fixed: they belong to other modes and to no phase of this packet.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Read a sibling entry in each registry first | Two of the four are keyed objects, not lists. Assuming a list would have corrupted a file twelve other modes load |
| Verify by read-back and count delta, not by exit code | A successful write that adds nothing is invisible otherwise, and shows up later as a routing bug |
| Constraint-shaped routing vocabulary | `sk-create-skill` is the likely confusion. Keywords are the words someone uses about *limits*, not about capability |
| `retire` defaults to confirm even under `:auto` | It deletes a file and two rows. Requiring an explicit `retire :auto` costs nothing and removes the accidental case |
| Leave the six pre-existing broken leaves | Verified identical at HEAD, in other modes, owned by no phase of this packet |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| All four registries parse after editing | PASS - 4 of 4 |
| Count delta exactly +1 in each | PASS - 12→13, 12→13, 11→12, 12→13 |
| Each new entry read back and inspected | PASS - present and correct in all four |
| Mirror followed to a real file | PASS - resolves to the `.opencode` original |
| Rule-shaped request outranks `sk-create-skill` | PASS - probe matches this mode, zero matches for the sibling |
| All 13 modes resolve their `SKILL.md` | PASS |
| All 12 commands resolve their file | PASS |
| New mode's leaves resolve | PASS - 7 of 7 |
| Corpus, router and `AGENTS.md` untouched | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Six pre-existing broken leaf references remain**, in `sk-create-changelog` and `sk-create-quality-control`. Verified identical at HEAD. Out of scope, and now recorded so the next reader does not attribute them to this work.
2. **Only the `.claude/` mirror was created.** Whether `.codex/`, `.cursor/`, `.pi/` or `.devin/` carry command directories was never enumerated — the open question phase 6 recorded and did not close. Only `.claude/` was observed to have one.
3. **Routing was probed, not exercised.** The keyword match was computed from the vocabulary class; no live advisor query ran. The advisor's connection has been intermittent all session.
4. **The workflow YAML is structurally sound and untested.** Neither asset has driven a real invocation. Phase 7 is where that happens.
5. **The presentation contract is a first draft.** Sibling contracts run considerably longer; this one covers the paths the mode has and no more.
<!-- /ANCHOR:limitations -->

---


