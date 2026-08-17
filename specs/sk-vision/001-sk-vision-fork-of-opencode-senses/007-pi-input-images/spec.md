---
title: "Feature Specification: sk-vision 007 Pi input.images auto-inspect"
description: "Wire a bounded input.images auto-inspect into the Pi extension factory, mirroring the OpenCode AttachmentInjector 2s-grace behavior."
trigger_phrases:
  - "sk-vision input images"
  - "sk-vision pi auto-inspect"
  - "sk-vision attachment injector"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/007-pi-input-images"
    last_updated_at: "2026-08-16T12:00:00.000Z"
    last_updated_by: "pi"
    recent_action: "Implemented bounded pi input.images auto-inspect hook."
    next_safe_action: "Run 010 quality gate after 008/009 complete."
    blockers: []
    key_files:
      - "spec.md"
      - ".opencode/skills/sk-vision/pi/sk-vision.ts"
      - ".pi/extensions/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-007-pi-input-images"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-vision 007 Pi input.images auto-inspect

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 006-skill-contract-realignment |
| **Successor** | 008-feature-catalog |
| **Handoff Criteria** | `on("input")` handler present with bounded 2s grace; evidence injected via `action: "transform"`; never blocks or raises; `.pi/extensions/README.md` P1-gap note removed; `pi --offline --approve` exit 0. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is a **leaf phase** under the sk-vision packet root.

**Scope Boundary**: `.opencode/skills/sk-vision/pi/sk-vision.ts` + `.pi/extensions/README.md` (+ skill README if it mentions the gap). No runtime `src/` changes. No OpenCode plugin changes.

**Dependencies**:
- 005-pi-adapter shipped the factory and symlink (satisfied).
- Pi `on("input")` event carries `event.images` (confirmed in installed pi docs, extensions.md).

**Deliverables**:
- Bounded input.images auto-inspect in the Pi factory.
- README gap note removed and replaced with the shipped behavior.

**Changelog**:
- Record the change in the skill changelog if one exists; otherwise record in this child's implementation-summary.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
OpenCode users get automatic sk-vision evidence when they attach an image (the plugin's `AttachmentInjector` preloads analysis with a 2s grace and injects a `<SK-VISION>` block). Pi users do not: `.pi/extensions/README.md` records "`input.images` not wired (P1 gap)". The parent packet's 005 handoff called the hook optional, but closing it completes the dual-host parity the packet's vision promised.

### Purpose
Give Pi the same bounded auto-inspect: when user input carries `event.images`, run a 2s-grace preload and inject evidence into the message via `action: "transform"`. Never block message submission, never raise, and never analyze extension-injected traffic.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `pi.on("input", ...)` to `.opencode/skills/sk-vision/pi/sk-vision.ts`.
- Behavior: only when `event.source !== "extension"` and `event.images` is non-empty; `Promise.race` between the provider analysis and a 2s timeout; on success, `return { action: "transform", text: event.text + "\n\n" + evidenceBlock }` (evidence block uses the `<SK-VISION>` envelope); on timeout or failure, `return { action: "continue" }` (silent fallback).
- Per-image cache with a small bound (reuse the AttachmentInjector's key = path + mtime + size idea; a simple Map with max ~32 entries).
- Never `await` the full GPU run; the 2s race is the cap.
- Update `.pi/extensions/README.md` rows (remove the P1-gap wording; describe the shipped hook).
- Update the skill `README.md`/`SKILL.md` only if they document the gap (006-001 rewrote them; check whether the gap is mentioned — if yes, update; if no, do not touch).

### Out of Scope
- OpenCode plugin changes (its injector already works).
- Runtime `src/` or `python/` changes (the provider API already supports the needed calls).
- Adding new tools or renaming existing ones.
- `context/` edits.
- Streaming-aware steer/followUp routing beyond the documented `streamingBehavior` passthrough (keep the default: only handle `undefined`/`followUp`... actually: return `continue` for `steer` mid-stream inputs — mirror `input-transform-streaming.ts` guidance).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-vision/pi/sk-vision.ts` | Modify | Add bounded `on("input")` handler |
| `.pi/extensions/README.md` | Modify | Remove P1-gap note; describe shipped behavior |
| `.opencode/skills/sk-vision/README.md` | Modify only if gap mentioned | Keep docs truthful |

### Implementer copy pack (follow exactly)

Stop and report if any of these is true: you are about to await an unbounded GPU call inside the input hook; you are about to analyze `event.source === "extension"` traffic; you are about to touch the OpenCode plugin or runtime src; you are about to invent a new tool name.

**File 1 — `pi/sk-vision.ts` input hook.** Read these first:
- `.opencode/skills/sk-vision/vision-runtime/src/opencode/attachments.ts` (the injector to mirror: key, cache bound 32, 2s race, never raise)
- `/Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/extensions.md` "Input Events" section (event shape: `text`, `images`, `source`, `streamingBehavior`; results: `continue`/`transform`/`handled`)
- `examples/extensions/input-transform.ts` + `input-transform-streaming.ts` for the transform pattern

Skeleton (fill from the attachment injector's logic):

```typescript
const inputEvidenceCache = new Map<string, string>(); // bounded ~32

pi.on("input", async (event) => {
  if (event.source === "extension") return { action: "continue" as const };
  if (event.streamingBehavior === "steer") return { action: "continue" as const };
  const images = event.images ?? [];
  if (images.length === 0) return { action: "continue" as const };
  // bounded preload: race analysis vs 2s timeout; cache hit serves instantly
  // on success: return { action: "transform", text: `${event.text}\n\n${evidence}` }
  // on timeout/error: return { action: "continue" }  // never raise
  return { action: "continue" as const };
});
```

Requirements:
- The handler must be added inside the existing `skVision` factory function so it shares the `RuntimeClient`/provider.
- `event.images` items: confirm their shape from the installed pi types (`InputEvent`) — path strings and/or data; reuse `makeImageSource`/`sourceLabel` helpers already in the file.
- The 2s cap is `Promise.race` with `setTimeout` — never `await` the raw provider call.
- Any thrown error inside the handler must be caught and converted to `{ action: "continue" }` (a thrown input hook could break message processing).
- Do not register anything new with `pi.registerTool`; do not touch the 13 existing registrations.
- Keep `session_shutdown` closing the client (already present).

**File 2 — `.pi/extensions/README.md`.** Replace the row that says "`input.images` not wired (P1 gap)" with the shipped description: bounded 2s-grace auto-inspect on attached images, extension-sourced traffic skipped, transform injection of `<SK-VISION>` evidence.

Close this child with:

```bash
rg -n 'on\("input"\)' .opencode/skills/sk-vision/pi/sk-vision.ts          # exit 0
rg -n "not wired" .pi/extensions/README.md                                # exit 1 expected
cd .opencode/skills/sk-vision/vision-runtime && bun run build && bun test # exit 0 (no src change, but prove no regression)
pi --offline --approve                                                    # exit 0; extension loads, session not fail-closed
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-vision/001-sk-vision-fork-of-opencode-senses/007-pi-input-images --strict
```
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Input hook present in factory | `rg 'on\("input"\)'` exit 0; handler inside factory function |
| REQ-002 | Bounded grace | 2s `Promise.race` cap; no unbounded await of provider |
| REQ-003 | Never raises, never blocks | try/catch around handler body → `continue`; no await outside race |
| REQ-004 | Skips extension traffic | `event.source === "extension"` → `continue` |
| REQ-005 | README gap note gone | `rg "not wired" .pi/extensions/README.md` exit 1 |
| REQ-006 | No session fail-closed | `pi --offline --approve` exit 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P1 | Transform injection on success | Evidence in `<SK-VISION>` envelope appended via `action: "transform"` |
| REQ-P2 | Steer passthrough | `streamingBehavior === "steer"` → `continue` |
| REQ-P3 | No scope creep | Files outside Files to Change untouched |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [ ] `rg -n 'on\("input"\)' .opencode/skills/sk-vision/pi/sk-vision.ts` exit 0
- [ ] 2s race present (grep for `2_000` or `Promise.race` in the handler)
- [ ] `rg -n "not wired" .pi/extensions/README.md` exit 1
- [ ] `bun run build && bun test` in vision-runtime exit 0
- [ ] `pi --offline --approve` exit 0 (session not fail-closed)
- [ ] This child `validate.sh --strict` exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Input hook throws and breaks message flow | High | try/catch → continue; test with a forced error |
| Risk | Blocking GPU work on input | High | 2s race cap; never await raw call |
| Risk | Image shape drift in pi types | Medium | Read installed types first; adapt via existing helpers |
| Dependency | 005 factory + symlink | Shipped | Stop if factory missing |
<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

### Answered Questions
- **Q**: Should the input hook analyze extension-injected messages? **A**: No — `event.source === "extension"` returns `continue`.

### Open Questions
- None.
<!-- /ANCHOR:questions -->

