---
title: "Feature Specification: Phase 1: ux-and-component-map"
description: "The design documents that fix the terminal screen before any Rust is written: one ASCII frame per state at 80x24 and 120x40, the key map with its contexts and drawn labels, the glyph table with its ASCII fallback, and the component inventory with a state list for every component."
trigger_phrases:
  - "ux and component map"
  - "phase 1 ux and component map"
  - "terminal screen design"
  - "bots ui mockups"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: ux-and-component-map

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-25 |
| **Branch** | `system-skilled-bots` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 of 6 |
| **Predecessor** | None |
| **Successor** | `002-architecture-and-contracts` |
| **Handoff Criteria** | The key map is approved as a pre-build step, after the `ui-review-2.md` fixes land, and every component lists its states: `design/key-map.md` section 6 carries the approval with the key set it covers, and `design/component-inventory.md` names at least one state for each of its thirteen components |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Terminal screen children: UX, architecture, shell, panes, answer flow, hardening specification.

**Scope Boundary**: The four design documents and nothing else. No Rust, no crate, no CLI verb, no test. The frames, the keys, the glyphs and the component states are fixed here, and phases 002 to 006 build against them.

**Dependencies**:
- The parent's operator decisions Q002 to Q009, which fix the six children, the free-text answer, the fallback tab keys, the three new glyphs, the refusal of `insta`, the screenshot set, the grant drawn only when the item carries it, and the `NO_COLOR` route. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:224-231]
- Phase 001's `bots activity --json` and `bots inbox --json` shapes, which the activity and inbox frames draw. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md, REQ-002]
- Phase 002's `bots routines --json` shape, which the routines frame draws. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md, REQ-007]
- `bots status --json`, which exists today and which the header frame draws. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/status.ts:103-114]

**Deliverables**:
- `design/mockups.md`, twenty-seven states, each drawn at both sizes except the too-small screen.
- `design/key-map.md`, twenty-nine bindings with their context, action, drawn label and drawing frame.
- `design/glyph-table.md`, the eight glyphs, the ASCII set and the colour rule.
- `design/component-inventory.md`, thirteen components with a state list each.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The screen has no agreed shape. The pre-expansion phase 003 named four tabs, an approval overlay and six status markers in prose, and left the layout, the key contexts and the component states to whoever wrote the Rust. Three of its own requirements then collided: `1` both picked option 1 and approved once, `?` marked scheduled, recurring and unknown alike, and the banner named `Ctrl+P` for the inbox when `Ctrl+P` opens the palette. A build started from that prose would invent the answers, and each invention would be a decision nobody recorded. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:243-250]

### Purpose
One approved map of every frame, key, glyph and component state, so the build draws cells rather than deciding layout.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Before this phase, taken on 2026-11-25:

```text
$ ls .skilled/crates/bots-tui/design
ls: .skilled/crates/bots-tui/design: No such file or directory
EXIT=1

$ ls specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design
ls: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design: No such file or directory
EXIT=1

$ rg -c 'design/' specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md
5
EXIT=0
```

After this phase:

```text
$ ls specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design
component-inventory.md
glyph-table.md
key-map.md
mockups.md
EXIT=0
```

The two `No such file or directory` lines are the measured gap: the parent names a design folder five times and neither location held one, so nothing fixed a frame, a key or a glyph. The third line is that count of five, and it is the reason this phase exists rather than a later one. The last block is the gap closed: four documents, and `.skilled/crates/bots-tui/design` still absent because the crate does not exist until phase 002.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Draw one ASCII frame per screen state at 80x24 and 120x40 in `design/mockups.md`, with the frame grammar, the state index and the too-small screen.
- Bind every key in `design/key-map.md` with its context, its action, the label the frame draws and the frame that draws it, and record the operator's approval of the map.
- Map the seven group ids, the unknown value and the ASCII fallback in `design/glyph-table.md`.
- List the thirteen components with what each reads, the keys each binds and every state each can be in, in `design/component-inventory.md`.
- Name the JSON each surface reads and the phase that owns it, so a reader can tell which payload a pane depends on.

### Out of Scope
- Any Rust, crate or test - phases 002 to 006 build against these documents, and a design phase that ships code has two sources of truth.
- `bots activity --json`, `bots inbox --json` and `bots routines --json` - phases 001 and 002 own those verbs, and this phase draws the shapes they document.
- The `ui` verb and its two refusals - 002 owns them.
- Colour values beyond the System and Mono palettes - meaning is in the glyph and the label, so a palette is decoration.
- A screenshot of our own screen - it does not exist yet, so the four reference screenshots are linked instead.
- `insta` and any snapshot file - the operator refused it, and the frames here are what the tests assert against.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `design/mockups.md` | Create | Twenty-six states at 80x24 and 120x40, plus the too-small screen at 30x7 |
| `design/key-map.md` | Create | Twenty-nine bindings across six contexts, the four defect rules, the approval record |
| `design/glyph-table.md` | Create | Eight glyphs, the ASCII set, the inbox's own words, the colour rule |
| `design/component-inventory.md` | Create | Thirteen components, each with its reads, its keys and its states |
| `spec.md` | Modify | This specification |
| `plan.md` | Modify | The approach, the waves and the external orchestration |
| `tasks.md` | Modify | The ordered tasks, grouped into waves |
| `acceptance-criteria.md` | Modify | One criterion per requirement, each answered without a tty |
| `goal.md` | Create | The durable directive, bound to the parent goal |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `design/` holds the four documents at the paths this spec names, and every `SOURCE` pointer in them resolves to a file that exists and a line inside it. Pointers into the gitignored `specs/system-skilled-bots/context/` are checked when it is present and skipped by name when it is absent. |
| REQ-002 | `design/mockups.md` draws every state in its index at 80x24 and at 120x40, except the too-small screen, which is drawn at 30x7: one fenced block per state per size, each block exactly 24 or 40 lines and no line wider than its size, and the too-small block exactly 7 lines and no line wider than 30. Each frame is addressed by its section heading and its size marker, so a test loads it by name rather than by line number. |
| REQ-003 | `design/key-map.md` binds every key with its context, its action, the label the frame draws and the frame that draws it, and no key carries two meanings inside one context. A key that answers is bound only outside text mode, so a free-text answer may begin with `y` or `n`. |
| REQ-004 | `design/glyph-table.md` maps the seven group ids to seven glyphs in the payload's order, gives `?` plus the raw value for a state the table does not name, and gives the ASCII fallback set. |
| REQ-005 | `design/component-inventory.md` lists every component with what it reads, the keys it binds and every state it can be in, and each state names the frame that draws it. |
| REQ-006 | No openhuman code or text is copied: every openhuman pointer is a path and a line range, no fenced block in `design/` reproduces a line of openhuman source, and the too-small message is our own wording rather than the reference's. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | The operator approves the key map, and the approval names the date and the key set it covers. |
| REQ-008 | The design documents name the JSON each surface reads and the phase that owns it, so a reader can tell which payload a pane depends on. |
| REQ-009 | The design documents name the four screenshots in `context/screenshots/` and the openhuman `--demo` capture, so the visual reference is traceable. The files are gitignored, and `specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/research/context-manifest.md` records their sources and sha256 values. |
| REQ-010 | Every acceptance criterion is answered by a command that runs without a tty. |
| REQ-011 | The design documents fix the answered row. An answer that exits 0 puts its outcome word, `approved`, `denied` or `answered`, on the row, and the row stays drawn until the next successful inbox read, which is the next 5 second poll. The row is not counted as open, so the banner count drops at once. No document says the screen refreshes at once after an answer. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `ls design` prints the four documents, and `rg -c '\[SOURCE: ' design/*.md` prints a non-zero count for each of them.
- **SC-002**: `rg -c '^\*\*80x24\*\*$' design/mockups.md` and `rg -c '^\*\*120x40\*\*$' design/mockups.md` print `26` each, and 26 is the number of index rows drawn at both sizes, because the twenty-sixth is the too-small screen at 30x7.
- **SC-003**: `rg -n '^\| \*\*Approved\*\* \|' design/key-map.md` prints one row, and it reads `Met` once the operator answers.
- **SC-004**: `rg -c '^\| [0-9]+ \| ' design/component-inventory.md` prints 13.
- **SC-005**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map --strict` prints `RESULT: PASSED`.
- **SC-006**: `rg -l 'outcome word' design/component-inventory.md design/glyph-table.md spec.md acceptance-criteria.md | wc -l | tr -d ' '` prints 4, so the answered row is carried by the requirement, the criterion and both design documents.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The parent's operator decisions Q002 to Q009 | The frames would have no fixed key set or glyph set | The decisions are recorded in the parent's `decision-record.md` and restated in `design/key-map.md` section 3 and `design/glyph-table.md` section 2 |
| Dependency | Phase 001's `bots activity --json` and `bots inbox --json` shapes | The activity and inbox frames would draw a payload that does not exist | The frames draw the shapes 001's REQ-002 and REQ-003 name, and 002's fixture carries them |
| Risk | A GPL-3.0 design reference invites copying | High | Every openhuman pointer is a path and a line range, no fenced block reproduces its text, and 006 greps for openhuman identifiers and GPL headers |
| Risk | The frames drift from the build | Medium | 003, 004 and 005 assert their buffers against these frames, so a frame that changes is a design change with a diff |
| Risk | The key map is approved and then amended silently | Medium | The approval names the key set it covers, so an added key is visibly a new approval rather than a quiet edit |
| Risk | The design folder is authored here and shipped in the crate | Low | The parent's open question puts the shipped copy at `.skilled/crates/bots-tui/design/`. 002 copies these four documents there when it creates the crate, and the handoff criteria name that step |

**Where the approval is recorded.** The parent's phase handoff says the operator's approval is recorded in this child's `decision-record.md`, and this packet carries one. The answer is recorded in `design/key-map.md` section 6, restated as `acceptance-criteria.md` AC-007, and added as a row in `decision-record.md` when it is given, so the handoff's wording holds without a deviation. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:280]
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A frame is 24 or 40 lines and at most 120 columns, so a reader can check one without scrolling.
- **NFR-P02**: The design adds no runtime cost: it is four markdown files and no process.

### Security
- **NFR-S01**: No credential, token or state-root path appears in `design/`. The frames use invented ids and one fixed timestamp.
- **NFR-S02**: No openhuman source line is reproduced, so no GPL text enters the tree.

### Reliability
- **NFR-R01**: Every `SOURCE` pointer resolves in a checkout that has the gitignored reference folder, and `research/context-manifest.md` records how to rebuild that folder, so a reader can follow each claim.
- **NFR-R02**: Every state in the component inventory names a frame, so no state is described without being drawn.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a pane with no rows draws its own one-line empty message, and the banner row is blank rather than absent, so the body does not move when an item arrives.
- Maximum input: a 2,000-row list draws 17 rows at 80x24 and 33 at 120x40. The list scrolls and the selection stays visible.
- Failure path: a read that exits non-zero keeps the rows, sets the stale flag and puts the first stderr line in the status row. The screen does not exit.
- Narrow terminal: below 24 columns or 8 rows the frame draws `Too small · Ctrl+D exit` and nothing else.
- Closed input: the input closes with an item selected. Nothing is written and the binary exits 0.
- An item that closes under an open overlay: the overlay says the item is no longer open and disables every key but `Esc` and `Ctrl+C`, except while the overlay is sending, where the answer's own result decides.
- An answer that exits 0: the row keeps its outcome word and the banner count drops at once, and the row leaves on the next successful inbox read rather than at once.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Four markdown documents in one folder. No code, no dependency, no runtime surface |
| Risk | 6/25 | A GPL reference and an approval gate. Nothing ships and nothing runs |
| Research | 12/20 | Six reference repositories read for shape, and five phase specs read for the payloads |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does the design folder ship in the crate or in the packet? Decision: authored in the packet's `design/`, copied to `.skilled/crates/bots-tui/design/` by 002, because the crate does not exist until 002 creates it and the parent's open question names the crate path as the shipped one.
- Does the ASCII fallback need a selector? Decision: yes, `--ascii` on the binary, passed through by `bots ui --ascii`, because the binary reads no environment variable of its own and a fallback with no selector is a table nobody can reach.
- Does `NO_COLOR` reach the binary? Decision: no. The `ui` verb reads it and passes `--mono`, so the binary stays environment-free and the pre-expansion NFR-S01 holds.
- Is the banner's key `Alt+2` or `Ctrl+P`? Decision: `Alt+2`, because the parent's defect table says `Ctrl+P` opens the palette and the banner must name the inbox tab key.
- How does a free-text answer begin with `y` or `n`? Decision: `t` enters text mode, and `y` and `n` are shortcuts only outside it, because a shortcut that fires on the first letter of an answer is a decision the operator did not make.
- Does the overlay draw a grant before packet phase 006 lands one? Decision: only when the item carries it. The overlay and the detail column draw a grant's kind and rung when the item carries them and draw nothing where they are absent, so the screen builds before 006 and lights up after it.
- Where is the operator's approval recorded? Decision: `design/key-map.md` section 6, AC-007, and a row in this packet's `decision-record.md`, which exists and which the parent's handoff names.
- Does the screen refresh at once after an answer? Decision: no. The row keeps its outcome word and stays drawn until the next successful inbox read, because the inbox read filters answered items out and an immediate read would drop the row before the word could be read.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Design documents**: `design/mockups.md`, `design/key-map.md`, `design/glyph-table.md`, `design/component-inventory.md`
- **Parent Spec**: `../spec.md`
- **Parent Goal**: `../goal.md`, whose binding row for this phase makes this packet's `goal.md` authoritative for it
- **Sibling children**: `002-architecture-and-contracts/`, `003-shell-and-navigation/`, `004-panes/`, `005-answer-flow/`, `006-hardening-and-proof/`
- **Pre-expansion documents**: `../context/legacy-003/`, gitignored, kept for reference only
