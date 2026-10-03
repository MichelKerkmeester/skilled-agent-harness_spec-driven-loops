---
title: "Goal: Banners and Folder Docs"
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
    packet_pointer: "sk-code/007-sk-code-obsidian-surface/009-banners-and-folder-docs"
    last_updated_at: "2026-10-03T12:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "None; every criterion is met"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-03-child-goal-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Banners and Folder Docs

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make `node tools/naming/scan-folder-docs.mjs` exit 0 by writing the folder docs it demands, and replace the `styles.css` Chinese preamble and delimiter banners with an English header and numbered upper-case box-drawing sections, without moving a rendered pixel.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The 249-file per-source `MODULE:` banner pass gated by `scan-comments.mjs` is not part of this phase. |
| D2 | The `styles.css` change is comment-structure only and the file is sectioned in place, not split. |
| D3 | Folder-doc pairing follows the live scan, not an earlier reference list. |
| D4 | `styles.css` is re-fingerprinted in the manifest rather than recaptured, and only because a byte-equality guard proved the edit comment-only. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node tools/naming/scan-folder-docs.mjs` reports 10 folders scanned, 9 owing README and CODE, 1 owing README only, and exits 0
- [x] A resolver over the 19 folder docs checks 56 links and slashed paths and finds 0 broken
- [x] `grep -c '======' styles.css` returns 0 and the file opens with an English header followed by 33 numbered box-drawing sections
- [x] The transform's guard confirms `stripComments(before) === stripComments(after)` for `styles.css`
- [x] `npm run screenshots:verify` reports 180 entries current with no capture run
- [x] `npx tsc --noEmit` exits 0, `npm run build` exits 0, `npx vitest run` passes 386 across 49 files and `npm run lint` reports its 115-problem baseline unchanged
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
| 19 folder docs, stylesheet sectioning, manifest re-fingerprint | Done (2026-08-28) | `tasks.md` T010 to T013 |
| Scanner, resolver, screenshots, baseline gates | Done | `tasks.md` T020 to T024; `implementation-summary.md` Verification |
| Phase status | Complete | `spec.md` metadata |

### Deviations and findings

| Item | Note |
|------|------|
| Banner count wording | `spec.md` scenario 2 and the summary speak of 34 banner comments replaced: the preamble plus 33 section banners |
| Section titles | The stylesheet section titles translate the original Chinese notes rather than re-audit each rule |
<!-- /ANCHOR:log -->
