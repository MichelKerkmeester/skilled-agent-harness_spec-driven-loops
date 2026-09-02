---
title: "Implementation Summary: Hub surface truth"
description: "The hub's full-toolkit intent claimed to enumerate the whole tree and listed 128 of 252 leaves. Completing it was the small part. The lasting part is a new check that compares a document against the registry it describes, which nothing had ever done."
trigger_phrases:
  - "hub surface truth summary"
  - "full inventory 252"
  - "command column invariant"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/052-routing-completeness/005-hub-surface-truth"
    last_updated_at: "2026-09-02T18:00:00Z"
    last_updated_by: "phase-5-hub-surface-truth"
    recent_action: "Authored the phase impl-summary from packet docs and git"
    next_safe_action: "Flip AC-002 to Met, since the manifest fix has since landed"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/ROUTER.md"
      - ".opencode/skills/sk-doc/README.md"
      - ".opencode/commands/doctor/scripts/parent-skill-check.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-052-005-hub-surface-truth"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Finding 25, a hub manifest contract two packets do not honour, remains Planned"
    answered_questions:
      - "The full-toolkit intent now lists all 252 leaves, each resolving on disk"
      - "AC-002 is materially met: sk-create-diff now shows /create:diff in its own row"
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
| **Packet** | sk-doc/052-routing-completeness/005-hub-surface-truth |
| **Level** | 3 |
| **Delivery** | Shipped. The parent goal LOG records this phase Done |
| **Date** | 2026-09-02 (git author dates of `98a327edf9`, `08eb67a0de` and `8bb9011584`) |
| **Register findings** | 19, 21, 22, 23 and 24 read Fixed. 20 and 25 remain Planned |
| **Gate** | Invariant 6c in `.opencode/commands/doctor/scripts/parent-skill-check.cjs` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every automated check in this area reads a registry. None of them compared a document against
the registry it describes. That gap, rather than any one instance of drift, is what this
phase found and closed.

### The inventory claimed completeness and was not complete

The `FULL_INVENTORY` intent in `.opencode/skills/sk-doc/ROUTER.md` is the single explicit
full-toolkit intent, and it is the one place that promises to enumerate the whole hub. It
listed **128 of 252 leaves**. It now lists all 252, each verified to resolve on disk.
Completing the list was chosen over narrowing the claim, because it was achievable without
touching a policy file.

### The readme still described a smaller hub

An earlier fix had named every mode in the link table and stopped there, so the description,
the trigger phrases and the at-a-glance table each still omitted six domains. All three now
name the current mode set. The description was rewritten inside its budget rather than
appended to, which matters because a summary surface truncates and a tail-appended fix
disappears at the point it is read.

### The check is the part that lasts

The existing invariant proved only that a mode is mentioned somewhere in the hub table, so a
mode could ship a working command in five runtime trees and still show a dash. Invariant 6c
requires a declared command to appear in its own row.

It was proven to fail four ways before it was trusted: on the dash form, on a wrong command
string, on a deleted row, and green again on restore. It shipped exiting non-zero on the one
real instance it was written to catch. That was deliberate. Shipping it as a warning would
have made it another check that has only ever passed, which is the shape of every finding in
this packet. The one-line manifest fix it pointed at landed with the routing pass that owns
that file, `08eb67a0de`, which also gave two packets the keyword-triggers line the hub says
every packet carries.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-doc/ROUTER.md` | Modified (`98a327edf9`, 128 lines added) | `FULL_INVENTORY` completed from 128 to 252 leaves |
| `.opencode/skills/sk-doc/README.md` | Modified (`98a327edf9`) | Description, trigger phrases and at-a-glance table brought onto the current mode set |
| `.opencode/commands/doctor/scripts/parent-skill-check.cjs` | Modified (`98a327edf9`, 22 lines) | Invariant 6c, the command column check |
| `.../parent-skill-check-command-column.test.cjs` | Created (`98a327edf9`, 285 lines) | The four failure modes the invariant must catch, plus the restore case |
| `.opencode/skills/sk-doc/SKILL.md` | Modified (`08eb67a0de`) | The hidden command restored to the mode table, which closes the failing check |
| `.opencode/skills/sk-doc/sk-create-frontmatter/SKILL.md` | Modified (`08eb67a0de`) | Keyword-triggers line the hub contract requires |
| `.opencode/skills/sk-doc/sk-create-repo-rule/SKILL.md` | Modified (`08eb67a0de`) | Keyword-triggers line the hub contract requires |
| `research/findings-register.md` | Modified (`8bb9011584`) | Five findings recorded closed, and the check that keeps them closed added to the checks table |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The registry was treated as the source of truth throughout, and the document moved to match
it. That direction is not arbitrary. A registry is machine-read at route time, so a document
that disagrees with it is wrong by construction rather than merely out of date.

The check shipped red on purpose, with its fix prepared and landing in the commit that owns
the file it touches. Splitting them that way kept the routing file under one owner and kept
the check honest, since a check introduced green on the same commit as its fix has never
demonstrated that it can fail.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The registry is the source of truth and the document moves | The registry is what routes. A document contradicting it is wrong rather than stale |
| Every fix gets a check | A hand-found defect that stays hand-found comes back. Five findings here were all found by eye |
| A new check is shown failing before it is trusted | Invariant 6c was proven to fail on the dash form, on a wrong command string and on a deleted row, then to pass on restore |
| The inventory was completed rather than its claim narrowed | Completing it needed no policy file change, and narrowing the claim would have removed the hub's only full enumeration |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Every check below was run and its output read. The rows map to AC-001 through AC-004 in
`acceptance-criteria.md`.

| Check | Result |
|-------|--------|
| `FULL_INVENTORY` leaf count against the hub leaf manifest | 252 paths, matching the manifest count, each resolving on disk. This satisfies AC-001 |
| `grep -n 'sk-create-diff' .opencode/skills/sk-doc/SKILL.md` | Line 35 shows `/create:diff` in the mode's own row rather than a dash. Re-run while writing this summary, so AC-002 is now materially met although its row still reads Unmet |
| Readme summary surfaces against the mode registry | Description, trigger phrases and at-a-glance table each name all six previously missing domains. This satisfies AC-003 |
| Invariant 6c negative controls, `parent-skill-check-command-column.test.cjs` | Fails on the dash form, on a wrong command string and on a deleted row, passes on restore. This satisfies AC-004 |
| Invariant 6c on the live tree at ship time | Exited non-zero on the one real instance, by design |
| Invariant 6c after `08eb67a0de` | The manifest line it pointed at is fixed, so the check has both failed and passed on real data |
| `validate.sh specs/sk-doc/052-routing-completeness --strict --recursive` | PASS for this folder, Errors 0 |
| `hvr_scan.py` on this document | 0 hard blockers |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

**AC-002 still reads Unmet although its condition now holds.** The grep in its verification
cell passes today. The row was written while the fix was still prepared and unlanded, and it
is left as written here rather than flipped from a different phase's summary.

**Finding 25 remains Planned.** A contract stated in the hub manifest is not honoured by two
packets. Nothing in this phase addressed it, and no check covers it.

**Invariant 6c covers one column, not the whole document.** It proves that a declared command
appears in its own row. A hub document can still disagree with its registry in every other
respect without failing anything, which is the same class of gap this phase was created to
close.

**The 252 figure was not independently recounted here.** It comes from `98a327edf9` and from
AC-001, both of which report the count matching the leaf manifest with each path resolving on
disk. This summary cites that evidence rather than re-deriving it.
**The phase `spec.md` still reads Draft.** Its scaffold was never filled in, and the durable
content of this phase lives in `goal.md`, `acceptance-criteria.md` and the research documents
instead. This summary therefore carries no Status row, since asserting one here would
contradict `spec.md` and would claim a closure the acceptance criteria have not reached.
<!-- /ANCHOR:limitations -->
