---
title: "Feature Specification: Phase 7: review-remediation"
description: "The deep review of the history lookup packet left twelve P2 advisories: the claim path can print a command that cannot answer, mint for a transcript from another project, write state before its checkout guard, and keep a dead prepare-time mint. The packet docs, catalog and receiver guidance also drift from the code."
trigger_phrases:
  - "review remediation"
  - "phase 7 review remediation"
  - "history lookup review fixes"
  - "claim lookup transcript cwd check"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 7: review-remediation

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/399-hook-feature-subtracks` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-docs-and-live-hop-proof |
| **Successor** | None |
| **Handoff Criteria** | All twelve P2 findings in `../review/review-report.md` are fixed or corrected in the docs, and the handover suite and history vitests pass against the post-merge baseline. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the history lookup handover integration. It fixes the twelve P2 advisories the deep review left. The operator chose "Fix all P2s".

**Scope Boundary**: The claim-path code, the lookup entry and command, the receiver guidance and the packet, catalog and playbook docs the review named. The Vibe locator belongs to another session and is out of scope.

**Dependencies**:
- The merged review report at `../review/review-report.md`.
- The compiled spec-kit runtime, rebuilt with `npm run build` after `cli.ts` changes.

**Deliverables**:
- Claim-path code fixes, each with a test that fails before the fix.
- Corrected packet, catalog, playbook and receiver docs.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A claimed note can print a lookup command that answers `session_not_found` when `CLAUDE_CONFIG_DIR` is set, can mint a locator for a transcript from another project, and writes the sender's hook state before it checks that the receiver shares the checkout. The prepare-time mint is overwritten at claim before anything prints it, a broken build reports the bad-arguments code, and the packet docs, catalog and receiver guidance disagree with the code.

### Purpose
A claimed note prints a lookup command only when that command can answer from the sender's own transcript in the receiver's checkout, and every doc the review named matches the code.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
The lookup entry, copied into a checkout with no compiled core, run from that checkout:

```text
$ node .skilled/hooks/session-handover/bin/history-lookup.mjs --session s --handle h browse '{}'
{"ok":false,"code":"operation_invalid"}
exit 2
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Make the lookup command resolve the Claude transcript store under `CLAUDE_CONFIG_DIR`, as the claim-time mint already does (R1-P2-001).
- Check that the receiver and the note share a checkout before minting, and check that the transcript's recorded working folder belongs to that checkout (OM-002, R1-P2-002).
- Drop the prepare-time mint and its prepare locator tests, which the operator chose over reusing it (R1-P2-003, OM-003).
- Give the lookup entry a distinct refusal code when the compiled core cannot load (R1-P2-005).
- Correct the receiver guidance, the packet docs, and the catalog and playbook titles and triggers (R1-P2-004, OM-001, OM-003 SC-003, OM-004, OM-005, OM-006, OM-007).

### Out of Scope
- A Vibe history locator. The Vibe session owns it and starts after this phase merges.
- Renaming the catalog and playbook files. The operator chose to rename only the titles and triggers so no link breaks.
- The Claude reader's own default store root in `claude.mjs`. The lookup command passes the root it resolves, so the reader default is not on the claim path.
- A way to renew a claimed note's locator after 30 minutes. The guidance states the window instead.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/history/cli.ts` | Modify | Claude store root honours `CLAUDE_CONFIG_DIR`. New `core_unavailable` refusal code in the union. |
| `.skilled/hooks/session-handover/lib/relaunch-core.cjs` | Modify | Checkout guard before the mint. Transcript working-folder check in the mint. |
| `.skilled/hooks/session-handover/bin/session-handover.cjs` | Modify | Remove the prepare-time mint. |
| `.skilled/hooks/session-handover/bin/history-lookup.mjs` | Modify | Print `core_unavailable` when the core cannot load. |
| `.skilled/hooks/session-handover/tests/session-handover-cli.test.cjs` | Modify | Drop the prepare locator tests, rework the stale-locator test, add guard, cwd and redeem tests. |
| `.skilled/hooks/session-handover/tests/history-lookup-entry.test.cjs` | Modify | Test the new refusal code. |
| `.skilled/hooks/session-handover/README.md`, `.skilled/hooks/session-handover/bin/README.md`, `.skilled/hooks/injection-contract.md`, `.skilled/skills/system-spec-kit/runtime/hooks/lib/history/README.md` | Modify | Claim-only mint, the refusal code tables and the transcript check. |
| `.skilled/commands/speckit/handoff.md` and its runtime mirrors, `.skilled/changelog/skilled/v4.0.2.1.md` | Modify | The 30-minute locator window. |
| `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/compaction-history-lookup.md`, its playbook page, `feature-catalog.md`, `manual-testing-playbook.md`, `packet-purpose-carry.md` and `session-recovery-spec-kit-resume.md` | Modify | Title, trigger phrases and link labels. |
| `../spec.md`, `../004-offer-lookup-at-claim/`, `../005-deprecate-compaction-offer/`, `../006-docs-and-live-hop-proof/` | Modify | Doc drift the review named. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A claim whose sender transcript sits under `CLAUDE_CONFIG_DIR` prints a command that answers with that transcript's turns. | A claim-then-redeem test with the transcript only under `CLAUDE_CONFIG_DIR` gets `ok: true` and the fixture text. It fails before the fix. |
| REQ-002 | A claim from another checkout writes no hook state for the sender. | A test claims a note whose `cwd` is a second checkout and finds no state file keyed to that checkout. It fails before the fix. |
| REQ-003 | The mint refuses a transcript whose recorded working folder belongs to another checkout. | A claim test whose transcript records another checkout's folder prints no lookup section. It fails before the fix. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | `prepare` mints no locator. | `rg -n 'mintHandoverLocator' .skilled/hooks/session-handover/bin/session-handover.cjs` prints nothing, and the claim test checks that the claim-written locator recomputes to its handle. |
| REQ-005 | The lookup entry prints `core_unavailable` when the compiled core cannot load. | The entry test, with the real entry and no core, reads `{"ok":false,"code":"core_unavailable"}` and exit 2. |
| REQ-006 | Receiver step 3 and the changelog state the 30-minute locator window. | `rg -n '30 minutes' .skilled/commands/speckit/handoff.md .skilled/changelog/skilled/v4.0.2.1.md` prints a line from each. |
| REQ-007 | The packet docs, catalog and playbook match the code. | Each doc line the review named is corrected, and `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/hooks/session-handover/tests/*.test.cjs` passes every test. The delta from the post-merge baseline of 999 names each removed, moved and added test.
- **SC-002**: The history and compaction vitests pass every test. The delta from the post-merge baseline of 149 names each added test.
- **SC-003**: Each new code test fails on the pre-fix code and passes after it.
- **SC-004**: `validate.sh --strict --recursive` on the parent packet prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The compiled runtime under `runtime/dist` | The handover tests import it, so a stale build tests old code | Run `npm run build` after each `cli.ts` change, before the node suite |
| Risk | A session that moved to another checkout after it started records its first folder in the transcript, so the cwd check refuses its note | Low | The claim fails closed: the note still prints, only without the lookup section |
| Risk | A transcript whose first working-folder line sits past the read bound | Low | The bound is 256 KiB. The largest first Codex line measured is 19,040 bytes over 200 rollouts, and a Claude transcript's first `cwd` line sits within 5,466 bytes over 300 transcripts |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator settled the merge, the prepare mint and the entry names through the ask tool on 2026-11-15.
<!-- /ANCHOR:questions -->

---
