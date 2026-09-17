---
title: "Implementation Summary"
description: "A parent goal resent in chat is now the chat slice: no frontmatter, comments, anchors, dividers or section numbers, and never more than 4,000 characters. Every surface an agent reads before sending says so, and the renderer drops heading numbers."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/038-goal-unification/013-goal-chat-send-shape"
    last_updated_at: "2026-09-16T19:03:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Defined the chat slice and the 4,000-character send cap on every goal send surface"
    next_safe_action: "Operator review of the AGENTS.md goal posture wording, then commit"
    blockers: []
    key_files:
      - ".opencode/hooks/goal/lib/goal-slice.cjs"
      - "AGENTS.md"
      - ".opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "6d11af6f-653e-4807-aca8-1c09c81640c1"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Heading section numbers count as file scaffolding: the copy the operator set had unnumbered headings"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-goal-chat-send-shape |
| **Completed** | 2026-09-16 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

When you resend a parent goal in chat now, you send its chat slice: the durable slice without
frontmatter, HTML comments, anchor markers, `---` dividers or heading section numbers, and never more
than 4,000 characters. The rule sits wherever an agent decides what to send, so the copy you set with
`/goal` no longer arrives full of file scaffolding.

### The renderer, one regex wider

`renderChatSlice` in `.opencode/hooks/goal/lib/goal-slice.cjs` already removed comments and dividers.
It now also drops a heading's section number, so `## 1. DURABLE DIRECTIVE` becomes
`## DURABLE DIRECTIVE`. A trailing dot is required, which keeps a heading such as `### 2026 scope`
intact. The same module's resend reminder, which Pi, Cursor, Devin and OpenCode inject while a resend
is pending, now names the chat slice and carries the 4,000 figure. No length enforcement was added:
the rule lives in the docs and the reminder, as the operator decided.

### The rule, where the send decision is made

Every surface that told an agent to send "the durable slice, frontmatter excluded" now names the chat
slice and the cap. That covers the `AGENTS.md` goal posture row, which also overrides the resend wording
inside the older packet goal files, and the spec-kit `SKILL.md` goal paragraph. It covers Section 5 of
the set-string playbook, which now says the chat slice differs from the Section 2 objective shape and
adds the cut-first rule. It covers the goal template's Operator copy paragraph, the resend payload and
the Claude Code and Codex bind lines in the three lifecycle workflow assets, and both resume reminders.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/hooks/goal/lib/goal-slice.cjs` | Modified | Heading section numbers dropped from the chat slice, reminder names the chat slice and the cap |
| `.opencode/hooks/goal/lib/goal-slice.test.cjs` | Modified | New chat slice case, updated heading assertions, reminder cap assertion |
| `AGENTS.md` | Modified | Goal posture row defines the chat slice, states the cap and overrides file wording |
| `.opencode/skills/system-spec-kit/SKILL.md` | Modified | Goal paragraph renders the chat slice under the cap |
| `.opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md` | Modified | Section 5 defines the chat slice and adds the cap |
| `.opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl` | Modified | Operator copy paragraph |
| `.opencode/skills/system-spec-kit/runtime/cli/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap` | Regenerated | lazy-goal snapshot, stale since the template changed on 2026-09-11 |
| `.opencode/commands/speckit/assets/speckit-plan.yaml`, `speckit-implement.yaml`, `speckit-complete.yaml` | Modified | Resend payload, bind lines, objective shape note |
| `.opencode/commands/speckit/assets/speckit-resume-auto.yaml`, `speckit-resume-confirm.yaml` | Modified | Resume reminder |
| `.hermes/skills/system-spec-kit/SKILL.md` | Regenerated | Hermes copy of the edited `SKILL.md` |
| `.opencode/skills/system-spec-kit/runtime/data/trigger-index.json` and its fixtures | Regenerated | Committed trigger index over the edited corpus |
| `../goal.md`, `../spec.md` | Modified | Binding row 013, phase map row 13 and its handoff row |
| `goal.md`, `description.json`, `graph-metadata.json` here and in the parent | Created or regenerated | Child goal and packet metadata |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A read-only audit came first and listed every surface that instructs a goal send. Baselines were
captured before any edit. The updated goal-slice tests then ran against the unchanged module and failed
4 of 16, the new case on its section-number assertion, which is the negative control for the one code
change. After the change the suite passed 16 of 16, and the goal hook and plugin suites passed in full.

The template edit was followed by one `-u` run on the golden snapshot file and a plain rerun of the
whole file. The real `goal.cjs packet` read on the parent confirmed the rendered shape end to end. The
Hermes copy, the metadata and the trigger index were regenerated by their own generators, and strict
validation ran on this phase and on the parent.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Section numbers count as scaffolding | The copy the operator accepted and set had unnumbered headings. |
| No length enforcement code | The operator placed the rule in the docs and the injected reminder. |
| Override instead of rewriting 167 goal files | The `AGENTS.md` row loads on every turn, while rewriting the files would change every parent's slice hash and trigger resends across bound sessions. |
| Compact two table separator rows in the parent goal | Binding row 013 took the parent slice to 4,014 characters. Three-dash separator cells change no word and bring it to 3,990. |
| Record the amendment in `spec.md` | The ADR text in phase 002 stays as recorded, and the amendment names each decision it extends. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Negative control: updated goal-slice tests before the code change | FAIL as expected, 4 of 16, new case at `goal-slice.test.cjs:115` |
| `node --test .opencode/hooks/goal/lib/goal-slice.test.cjs` | PASS, 16 of 16 |
| Goal hook suites (`bin`, `cursor`, `devin`, `lib`, `pi`) | PASS, 136 of 136 |
| Goal plugin suites including the offer contract | PASS, 147 of 147 |
| `speckit-goal-offer-contract.test.cjs` after the YAML edits | PASS, 5 of 5 |
| `scaffold-golden-snapshots.vitest.ts` without `-u` | PASS, 12 of 12, one snapshot updated before it |
| `goal.cjs packet` on the parent | PASS, `chat_slice` 3,661 characters, 0 comments, 0 dividers, 0 numbered headings |
| Comment hygiene on both changed code files | PASS, exit 0 each |
| `verify_alignment_drift.py --root .opencode/hooks/goal` | PASS, 0 findings |
| `sync-skills-hermes.cjs --check` after the sync | PASS, 68 copies in sync |
| `trigger-index.vitest.ts` after the index regeneration | PASS |
| `validate.sh --strict` on this phase | PASS, `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Older goal files still carry their own resend wording.** 167 packet goal files have an Operator copy paragraph and 79 say to resend the full text. The `AGENTS.md` row overrides them, but an agent that reads only a file meets the old wording.
2. **The parent slice has 10 characters of headroom.** It measures 3,990, so the next binding row needs a real cut in the playbook's Section 4 order.
3. **Nested phase parents report `packet_budget=unknown`.** `isPhaseChild` treats a nested phase parent as a child while the validator applies the budget to it. Recorded, not changed.
4. **In-process runtimes keep the old reminder until restarted.** The docs carry the same rule meanwhile.
5. **Descriptive goal docs still restate the older wording.** The goal hook README, `goal-plugin.md` and `hook-system.md` describe the resend without instructing it, and were left for a follow-up.
<!-- /ANCHOR:limitations -->

---
