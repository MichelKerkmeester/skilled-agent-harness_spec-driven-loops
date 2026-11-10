---
title: "Implementation Plan: Phase 12: sk-vision-v2-prompt-hook"
description: "Extract sk-vision's evidence assembly into one method both hosts call, then register OpenCode 2's prompt hook to run it and append the evidence to the prompt text. Proved by unit tests and a live run on a private OpenCode 2.0.32 server."
trigger_phrases:
  - "sk vision v2 prompt hook plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 12: sk-vision-v2-prompt-hook

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, bundled by Bun |
| **Framework** | OpenCode plugin API: `@opencode-ai/plugin` 1.17.15 for OpenCode 1, `@opencode/plugin` 2.0.32 shapes declared locally for OpenCode 2 |
| **Storage** | None. Inline images are written to temp files, as on OpenCode 1 |
| **Testing** | `bun test`, `tsc --noEmit`, the plugin `node --test` suites and a live private `opencode2 serve` |

### Overview
`AttachmentInjector.handle` builds the evidence and pushes it as a message part, which only OpenCode 1 accepts. The plan extracts the builder into `evidenceText`, keeps `handle` on top of it, and has `createSetup` register OpenCode 2's prompt hook when automatic inspection is on. The hook maps the prompt's files to file parts, reads the session model to choose between the full wait and the grace, and appends the result to `prompt.text`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified: the hook and session shapes were read from the published 2.0.32 types

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing at or above the baseline
- [ ] Docs updated (spec, plan, tasks, the plugin README and the injection contract)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One evidence builder, two host adapters. OpenCode 1 pushes the text as a part in `chat.message`, and OpenCode 2 appends it to the mutable prompt in `session.hook("prompt")`.

### Key Components
- `AttachmentInjector.evidenceText(images, guaranteed)`: the cache, grace, materialise and render steps, returning the text or null.
- `createSetup`'s prompt hook: the `/vision` template path first, then automatic inspection.
- `createDefaultAutoInspect(directory)`: null unless `SK_VISION_AUTOINSPECT=1`, so no vision runtime starts otherwise.

### Data Flow
Prompt submitted → the template match wins if it matches → otherwise image and PDF files become file parts → `session.get` gives the model → `isTextOnlyModel` picks the full wait or the grace → `evidenceText` → the text is appended after a blank line → the model reads the prompt.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `attachments.ts` `handle` | OpenCode 1 producer of the evidence part | Update: now calls `evidenceText` | sk-vision suite, review of the diff |
| `plugin.ts` `createSetup` | OpenCode 2 `setup` entry | Update: the prompt hook runs automatic inspection | Four new tests and the live run |
| `.opencode/plugins/tests/v2-hard-plugins.test.cjs` | Asserts sk-vision's v2 registrations | Unchanged: without the flag and template it still registers only the command | Plugin suite count |
| `.opencode/plugins/README.md`, `.skilled/hooks/injection-contract.md` | Describe the OpenCode 2 gap | Update | `validate_document.py` |
| Pi and Devin adapters | Use the evidence core, not `AttachmentInjector` | Not a consumer | `rg -n "AttachmentInjector" .skilled` |

Matrix axes: automatic inspection on or off, template present or absent, template matched or not, file mime image, PDF or other, model listed text-only, other or unknown.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The new prompt-hook path: text-only model, non-image file, template precedence, rejection | `bun test` |
| Integration | sk-vision's OpenCode 2 registrations and the plugin suite | `node --test .opencode/plugins/tests/` |
| Manual | One prompt with an image on a private OpenCode 2.0.32 server, with the flag on and off | `scratch/proof/run-vision.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| OpenCode 2.0.32 prompt hook with a mutable prompt | External | Green | No place to attach evidence on OpenCode 2 |
| The local vision runtime (Moondream through Python) | Internal | Green | The live run would show only the notice block |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The prompt hook breaks prompts on OpenCode 2, or OpenCode 1 behaviour changes.
- **Procedure**: Unset `SK_VISION_AUTOINSPECT`, which turns the new path off. For a code rollback, revert the phase commit and rebuild the bundle.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (baselines, types) ──► Core (extract, hook, tests) ──► Verify (suites, live run, review)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes |
| Core Implementation | Med | 1 hour |
| Verification | Med | 1 hour |
| **Total** | | **2 to 3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created: not needed, no data changes
- [x] Feature flag configured: `SK_VISION_AUTOINSPECT` gates the new path
- [x] Monitoring alerts set: not applicable, `SK_VISION_DEBUG=1` logs hook failures

### Rollback Procedure
1. Unset `SK_VISION_AUTOINSPECT` in the environment that starts OpenCode 2.
2. Revert the phase commit and run `bun run build` in `vision-runtime`.
3. Rerun the sk-vision and plugin suites.
4. No stakeholder notice: the flag is opt-in.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
