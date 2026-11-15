---
title: "Implementation Plan: Phase 4: offer-lookup-at-claim"
description: "The claim command re-stamps the sender's stored locator to the claim time, builds the shared history lookup section and prints it after the note body, all inside a fail-open guard. One receiver step is added to the handoff command, and the handover CLI suite proves the section, its position and the fail-open path."
trigger_phrases:
  - "offer lookup at claim plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: offer-lookup-at-claim

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js: CommonJS (`.cjs`) for the handover CLI, TypeScript for the history core |
| **Framework** | None |
| **Storage** | One JSON hook state file per session under `tmpdir()/speckit-claude-hooks/<projectHash>/` (`hook-state.ts:463-472`) |
| **Testing** | `node --test` for the handover CLI, `vitest` for the history core |

### Overview
`claim` gains two steps between reading the note and printing its body: it re-stamps the sender's stored locator to the claim time, then builds the shared section and prints it after the body. The re-stamp keeps the handle and rewrites only `mintedAt` and `provenance.capturedAt`, which is what the CLI's freshness check reads (`cli.ts:212-217`). Every step sits inside a guard that prints nothing on failure, so the claim keeps exiting 0 with the note body.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node --test .skilled/hooks/session-handover/tests/session-handover-cli.test.cjs` prints `ℹ fail 0`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-relaunch/001-history-lookup-handover-integration/004-offer-lookup-at-claim --strict --quiet` prints `RESULT: PASSED`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: fail-open CLI adapter. The claim is a read-mostly command that may add one best-effort write and one best-effort print, and neither may turn a successful claim into a failure.

### Key Components
- **`claim` in `session-handover.cjs:692-722`**: the one place the receiver's first output is composed. It already prints the body at line 706, the complete command at line 711 and the goal packet at line 717, so the section is appended after those and the complete command stays the closing line.
- **The re-stamp helper in `relaunch-core.cjs`**: reads the sender's locator, rewrites `mintedAt` and `provenance.capturedAt` to the claim time, and leaves `handle`, `runtime`, `sessionId`, `workspace`, `locatorKind` and `provenance.source` untouched. `stampHistoryLocator` in `compact-inject.ts:144-154` is the existing precedent for exactly this rewrite.
- **`buildHistoryLookupSection` (`lookup-offer.ts:132-138`)**: the only builder of the section text. It returns null when the capability flag is false or the workspace cannot run the CLI (`lookup-offer.ts:136`), so the claim never authors its own command text.
- **`persistHistoryLocator` (`locator-digest.ts:65-96`)**: proves the write kept the handle the caller minted, so a schema-rejected locator is reported as a failed write rather than a silent no-op.

### Data Flow
The note's `session_id` names the sender. `getStatePath(senderSessionId)` (`hook-state.ts:469-472`) resolves the sender's state file. The stored `historyLocator` is re-stamped to the claim time and persisted through the hook-state writer. `buildHistoryLookupSection` turns that locator into the section, and `claim` writes it to stdout after the note body. The receiver copies the command, which moves to the checkout root and runs the CLI with the sender's session id and handle (`lookup-offer.ts:70`).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reads `session-handover.cjs` and `hook-state.ts` and records the three lines `claim` prints today and the state path its locator lives under. Implementation adds the re-stamp to `relaunch-core.cjs`, prints the section after the note body in `claim`, and adds the receiver step to `handoff.md` section 5. Verification runs the handover CLI suite, the history locator suite and the packet validator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run the handover CLI suite from the repository root:

```bash
node --test .skilled/hooks/session-handover/tests/session-handover-cli.test.cjs
```

It must print `ℹ fail 0`, the summary shape the suite's own README records. The claim cases to add are: a section printed after the body for the sender session, a re-stamped `mintedAt` on a locator stored three hours earlier, a withheld section on a workspace without the CLI, and a fail-open case with no state file that still exits 0.

Run the history locator suite from `.skilled/skills/system-spec-kit/runtime`:

```bash
npx vitest run tests/history-locator.vitest.ts
```

It must exit 0 and keep the existing 600-character assertion at `history-locator.vitest.ts:451` passing.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Node.js, which the handover CLI already requires.
- Phase 3's locator in the sender's hook state file. Without it the claim prints no section and still exits 0.
- The built `lookup-offer` module, loaded inside the fail-open guard. Phase 2 owns where it lives.
- No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a claim that prints a section but exits non-zero, or a section whose command names the receiver's session instead of the sender's. Revert the scoped change to `session-handover.cjs`, `relaunch-core.cjs`, `handoff.md` and the claim tests. The receiver then falls back to the note alone, which is the behaviour this phase starts from.
<!-- /ANCHOR:rollback -->

---
