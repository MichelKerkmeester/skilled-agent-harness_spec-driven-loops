---
title: "Goal: Phase 1: ux-and-component-map"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map"
    last_updated_at: "2026-11-25T22:05:00Z"
    last_updated_by: "child-authoring"
    recent_action: "Authored the child directive and its seven criteria"
    next_safe_action: "Meet the criteria, then ask the operator to approve the key map"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "w4-003-terminal-child-001"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 1: ux-and-component-map

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Fix the terminal screen before any Rust is written, in four design documents that draw every state at 80x24 and 120x40, bind every key, name every glyph and list every component's states, so phases 002 to 006 draw cells rather than decide them.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The four documents live in this packet's `design/`, and phase 002 copies them to `crates/bots-tui/design/` when the crate exists. The crate does not exist yet, so a document written there now would be a file with no owner. |
| D2 | One overlay, two shapes: a decision, which has no options and takes `y`, `n`, free text and `Esc`, and a choice, which has options and takes `1` to `9`, `n` and `Esc`. The advisory names two components and the parent's Q003 names one overlay, so one component with two shapes satisfies both. |
| D3 | The inbox draws its state as a word, not a glyph, because `open`, `answered` and `expired` are not among the seven group ids, and reusing `–` for `expired` would read as `stopped`. |
| D4 | `--ascii` and `--mono` are flags on the binary, passed through by `bots ui`, because the binary reads no environment variable of its own. `NO_COLOR` is read by the Node `ui` verb, not by the binary. |
| D5 | The banner key is `Alt+2`, not `Ctrl+P`, because `Ctrl+P` opens the palette in the same context. |
| D6 | The footer is two lines, so every bound key is drawn at 80 columns rather than dropped at the narrow size. |
| D7 | The overlay and the detail column draw a grant's kind and rung only when the item carries them, and draw nothing where they are absent, so the screen builds before packet phase 006 and lights up after it. |
| D8 | `t` enters text mode in the decision overlay, and `y` and `n` are shortcuts only outside it, so a free-text answer may begin with either letter. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `ls specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design | wc -l | tr -d ' '` prints 4, and the AC-001 block in `acceptance-criteria.md` prints `0` for unresolved pointers.
- [ ] The AC-002 block in `acceptance-criteria.md` prints `frames=53 bad=0` then `panels-misaligned=0`.
- [ ] The AC-003 block prints `29` then `0`, and the AC-004 block prints `7` then `2`.
- [ ] The AC-005 block prints `13` then `13`, the AC-008 block prints `4`, and the AC-011 block prints `4` then `1`, so the answered row's outcome word is carried by the requirement, the criterion and both design documents.
- [ ] The AC-006 block prints `0`, and the AC-009 block prints `5`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map --strict` prints `RESULT: PASSED`.
- [ ] The AC-007 block prints one line, which happens only when the operator approves the key map.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| `design/mockups.md` | Done | 27 states, 53 fenced frames: 26 at 80x24, 26 at 120x40, one at 30x7. The frame check prints `frames=53 bad=0` |
| `design/key-map.md` | Done | Six contexts, 29 bindings, four defect rules, the approval record |
| `design/glyph-table.md` | Done | Seven group ids, three added glyphs, the ASCII set, the answered row's outcome word, the colour rule |
| `design/component-inventory.md` | Done | 13 components, each with its reads, keys, states and frames, five pane states per data pane and one answered row state |
| `spec.md` | Done | REQ-001 to REQ-011, SC-001 to SC-006, eight open questions |
| `plan.md` | Done | Three phases, the testing strategy and the external orchestration section |
| `tasks.md` | Done | 31 tasks in three phases, six waves, 15 checklist rows |
| `acceptance-criteria.md` | Done | AC-001 to AC-011, each with a command block |
| Operator approval | Pending | `design/key-map.md` section 6 reads `Unmet`. AC-007 is the packet's exit |

### Deviations and findings

| Item | Note |
|------|------|
| The approval lands in three places | `design/key-map.md` section 6 holds it, AC-007 restates it, and `decision-record.md` takes it as a row when the operator answers. The packet carries that file, so the parent's handoff wording holds without a deviation. |
| The design folder ships from the packet | The parent's open question asks whether the documents live in the packet or in the crate. D1 answers it: the packet now, the crate when 002 creates it. |
| `--ascii` and `--mono` are flags, not variables | The legacy NFR-S01 and CHK-030 asked for an environment variable. The binary reads none, so the flag is the only route that works, and `NO_COLOR` is translated by the Node verb. |
| The banner key is corrected | The parent's defect row records `Ctrl+P` as the banner key. D5 makes it `Alt+2`, because `Ctrl+P` opens the palette in the same context. |
| The parent goal binds this phase | `specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/goal.md` names this phase in its row 001 and binds it. This goal carries no binding table of its own, because the parent holds the only one. |
| The frames are not traced from a picture | No repository has a TUI screenshot. The frames are drawn from the payload shapes, and `design/mockups.md` section 5 names the four screenshots and the 28 `--demo` captures they were checked against. |
| The first review's findings | `research/ui-review-1.md` U1-P0-1, U1-P0-2, U1-P1-1, U1-P1-6, U1-P1-7, U1-P1-8, U1-P1-9, U1-P1-11, U1-P2-2 and U1-P2-3 are applied here. U1-P0-3, U1-P1-2, U1-P1-3, U1-P1-4, U1-P1-5, U1-P1-10, U1-P2-1, U1-P2-4, U1-P2-5, U1-P2-6 and U1-P2-7 name the parent or a sibling as their owner and are not edited here. |
| The too-small message is ours | The reference's string is `Resize terminal · Ctrl+D exits` at `render.rs:32`. This packet draws `Too small · Ctrl+D exit`, so 003's REQ-016, T009, CHK-042 and AC-007 must grep the new wording when that child is fixed. |
| The answered row is a row state, not a pane state | The inbox keeps five pane states and gains one row state, `answered`, which draws `approved`, `denied` or `answered` until the next successful inbox read. The screen issues no read of its own after an answer, because the inbox read filters answered items out and an immediate read would drop the row before the word could be read. REQ-011 and AC-011 carry it, and the frame that draws it is the state index's to add. |
| The palette binds Backspace | The palette filters on typing, so it needs a key that deletes a filter character. The binding is `Backspace` in the `palette` context, drawn as `Bksp delete` in the palette footer, and it takes the key table from 28 bindings to 29. |
| The task list now shows what is done | T001 to T023 are marked done with the goal log's evidence, and the remaining work is the last wave plus the operator's key-map approval at T030. The AC-001 pointer check now cuts each pointer at the first `, ` before the file test, so the eight `path, REQ-NNN` pointers resolve. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| AC-006 compares lines, not a licence banner | The block now compares every line longer than 30 characters in the seventeen cited reference files against the four documents with `comm -12`, and prints `0`, so a copied block without its header is caught. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| Frames 1 and 17 were redrawn | The sample set gained two `nightly-report` rows, so frame 1 and frame 17 were redrawn at both sizes with the title `Activity · 7 groups · 10 rows`, and the prose now separates the body row count from the list row count. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
| The prose rules were applied | Every semicolon outside code was split into two sentences and every serial comma before a final `and` was dropped, across this child's documents. Taken by the assistant on 2026-11-26 under the operator's do-not-ask directive. |
<!-- /ANCHOR:log -->
