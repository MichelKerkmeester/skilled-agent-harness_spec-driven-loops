---
title: "Implementation Summary: sk-communication voice routing"
description: "Two commands carried the same hand-distilled voice rubric and the skill defined plain English nowhere. Four bullets became a route to the one standard, three stayed because the standard does not cover them, and no gate moved."
trigger_phrases:
  - "sk-communication voice routing result"
  - "rewrite command rubric removed"
  - "projection standard adoption result"
  - "novice analogy exception"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/045-communication-voice-routing"
    last_updated_at: "2026-08-31T20:30:00Z"
    last_updated_by: "stream-6"
    recent_action: "Rerouted sk-communication and its two rewrite commands to the Human Voice Rules"
    next_safe_action: "Sweep the 73 pre-existing em dashes with hvr_scan.py"
    blockers: []
    key_files:
      - ".opencode/commands/rewrite/response.md"
      - ".opencode/commands/rewrite/response-by-external-agent.md"
      - ".opencode/skills/sk-communication/SKILL.md"
      - ".opencode/skills/sk-communication/references/visual-explanation.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "stream-6-045-communication-voice-routing"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Does the runtime package carry a voice rubric that needed rerouting? No. It carries one sentence, the systemInstruction of a versioned prompt profile, duplicated across two modules."
      - "Does sk-doc's hub root need a change for this? No. sk-communication is on the advisor denylist on purpose, so no inbound routing surface should learn its vocabulary."
      - "Should the novice depth level be corrected to match the standard's analogy limits? No. It departs on purpose and the departure is now recorded where a future voice pass would find it."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 045-communication-voice-routing |
| **Completed** | 2026-08-31 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The interesting part of this packet was deciding what **not** to move. A rubric that looks like duplicated voice guidance is usually part standard and part contract, and cutting the whole thing because four of its six lines are copied would delete the two lines nothing else carries.

`sk-communication` used the phrase "plain English" seven times in its `SKILL.md` and defined it nowhere. The definition had migrated into the two projection commands as a six-bullet rubric, distilled by hand in a prior packet whose dispatch brief pointed the author at "the plain-English standard in `.opencode/skills/sk-communication/SKILL.md`". That standard did not exist, which is exactly why a rubric had to be invented, and then invented a second time for the second command.

Four of the six bullets restate the Human Voice Rules. Those four are gone, replaced by the path to the standard, the path to the mode's scope gate, and a pointer to the one place that now says which parts of the standard a projection excludes. The remaining bullets stayed. Which turn is the target, whose claims are the accuracy baseline, and which spans are byte-pinned are all projection questions, and the standard has no opinion on any of them.

### Files Changed

| File | Change | Bytes |
|---|---|---|
| `.opencode/commands/rewrite/response.md` | Step 4 rerouted, `Standard By Reference` note added | 5,828 to 6,429 |
| `.opencode/commands/rewrite/response-by-external-agent.md` | Branch A rerouted, Branch B and C limitation named | 12,974 to 13,811 |
| `.opencode/skills/sk-communication/SKILL.md` | New `The Wording Standard` subsection, one NEVER rule, two route entries | 17,612 to 20,104 |
| `.opencode/skills/sk-communication/references/visual-explanation.md` | The `novice` departure recorded | 5,139 to 5,725 |

The packet grew the files rather than shrinking them, which is the honest result of replacing a compressed copy with a pointer plus the reasoning the copy never carried. What shrank is the number of places the standard lives, from three to one.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baselines first, into `scratch/`, before any edit. The scanner was proved against its own fixtures before any number it produced was trusted: the dirty fixture reported 6 hard blockers and exit 1, the clean fixture reported none and exit 0.

The inventory was a grep for the four rubric phrases across the whole live tree, then a second grep for tone vocabulary across the whole skill, because the first would have missed a location that phrased the same guidance differently. The runtime package was read rather than assumed. Inbound citations of the command step headings were checked before any heading was renamed, which is what kept `/rewrite:explain-visually` out of the diff.

The packet was then dogfooded through the mode it adopts. `hvr_scan.py` over `SKILL.md` after the first edit reported 53 hard blockers against a baseline of 52. The one I added was an em dash in the new Related Skills bullet, written to match the surrounding style. It was removed and the count returned to 52.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

**The new text went into `SKILL.md`, not a new reference file.** The skill's own router returns `{"lane": "projection", "resources": [], "note": "subsystem map is inline in SKILL.md"}` for every projection request, so a file under `references/` would never be loaded by the lane that needs it. It would also have required regenerating `leaf-manifest.json` and `leaf-aliases.json`.

**Two parts of the standard are excluded, and saying so was the point.** `VOICE PERSONALITY` asks for opinions, mixed feeling and controlled imperfection in writing you own. A projection carries someone else's message, so following it would invent a reaction the original never held, which is a fidelity failure wearing a voice improvement as cover. The scoring bands are excluded because nothing in either lane is a document being published. A route that did not name these would have been worse than the copy it replaced.

**The commands cite the standard and the scope gate, never the mode's `SKILL.md`.** The projection lane needs the rules and the exemptions, not the apply-or-score workflow. That keeps the runtime load at 26,342 bytes instead of 38,798.

**`explain-visually` was left alone.** Its Step 4 and Step 5 headings are cited by name from `feature-catalog/explanation/depth-calibrated-explanation.md` and `manual-testing-playbook/explanation/depth-flag-changes-words-not-facts.md`. Its depth rubric selects assumed knowledge rather than voice. Only its backing reference was touched, and only to record the `novice` exception.

**The `novice` analogy departure was written down rather than corrected.** The standard caps analogies at one per concept and puts them after the technical statement. Leading with one is right for a reader with no background. Without the note, the next voice pass would read a working rubric as a defect.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

All evidence is in `scratch/`, captured before and after.

| Check | Baseline | Final |
|---|---|---|
| `validate_document.py response.md --type command` | VALID, 0 issues | VALID, 0 issues |
| `validate_document.py response-by-external-agent.md --type command` | VALID, 0 issues | VALID, 0 issues |
| `validate_document.py explain-visually.md --type command` | VALID, 1 pre-existing description warning | unchanged, frontmatter untouched |
| `package_skill.py --check --strict` | PASS | PASS |
| `hvr_scan.py` hard blockers, five surfaces | 1, 9, 11, 52, 11 | 1, 9, 11, 52, 11 |
| `hvr_scan.py` deductions, `response.md` | -6 | -5 |
| Live copies of the rerouted rubric | 2 | 0 |
| Scoped diff | clean | 4 files, 37 insertions, 15 deletions, no stray file |

The scanner self-test is the negative control. It reproduced a known-bad result before any of its clean results were believed.

Every path and heading the new text cites was checked against the filesystem, including the two relative links from `SKILL.md` into `sk-doc` and the four `hvr-rules.md` section headings named in prose. The `.claude` command mirrors were confirmed to be per-file symlinks resolving to the edited files.

Each authored document in this packet scans at 0 hard blockers. The `, and` findings the scanner reports on them are review-severity candidates worth 0 points, and each sampled one joins two independent clauses rather than closing a list.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

**The standard reaches Branch A only.** Branches B and C of `/rewrite:response-by-external-agent` hand the target to an external or local model under `COPY_EDITING_INSTRUCTION`, a one-line compiled constant. Those paths are held to fidelity validation and the exact-original fallback instead. The command now says so. Carrying the standard into the prompt profile is a package change with its own gate and was not attempted.

**73 pre-existing hard blockers remain** across the four touched files, all em dashes and semicolons, 52 of them in `SKILL.md` alone. They predate this packet, they did not move, and sweeping them is a content rewrite outside a routing change's scope. `hvr_scan.py` is the tool whenever an owner wants that pass.

**Two adjacent defects were recorded and not fixed.** `COPY_EDITING_INSTRUCTION` is duplicated at `src/config/local-provider.ts:64` and `src/runtime/external-cli-projection.ts:38` rather than shared, and no test asserts its value beyond non-emptiness. Both are TypeScript changes gated by the package's `npm run check`, outside this packet's scope.

**Nothing was committed.** The tree is shared by concurrent streams, so the four modified files and this spec folder are left uncommitted, exactly as the stream brief requires.
<!-- /ANCHOR:limitations -->

---
