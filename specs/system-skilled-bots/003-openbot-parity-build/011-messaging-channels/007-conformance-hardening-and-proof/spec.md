---
title: "Feature Specification: Phase 7: conformance-hardening-and-proof"
description: "The proof child: the five numbered conformance rules over all five transports through one capability-matrix driver, three hardening cases, the third-party notices, the operator documents and the whole-phase gate."
trigger_phrases:
  - "conformance hardening and proof"
  - "phase 7 conformance hardening and proof"
  - "channel conformance suite"
  - "messaging channels operator reference"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 7: conformance-hardening-and-proof

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-26 |
| **Branch** | `system-skilled-bots` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-daemon-and-webhook-transports |
| **Successor** | None. The parent's successor is `012-manual-testing-scenarios` |
| **Handoff Criteria** | The 25 conformance cases and the three hardening cases pass, the notices and the operator documents exist, the whole suite and the typecheck pass and `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` for all eight folders |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the messaging channels phase parent, the last child. It starts when children 003 to 006 have landed.

**Scope Boundary**: `tests/channel-conformance.vitest.ts`, the capability-matrix driver added to `tests/channel-support.ts`, the third-party notices section, the runtime README rows, the operator reference, two skill lines and one feature-catalog entry. No runtime module changes here. A conformance failure is fixed in the child that owns the module, and this child reruns.

**Dependencies**:
- Children 003 to 006: every module and the fake transport
- `../002-adapter-and-record-contracts/design/conformance-rules.md`, the rules, the 25-case fixture and the three extra cases
- `../002-adapter-and-record-contracts/design/capabilities.md` section 2, the matrix the driver iterates
- `../002-adapter-and-record-contracts/design/operator-runbook.md`, the source of the operator reference
- The reference checker the rules number [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-conformance/src/lib.rs:374-470]

**Deliverables**:
- `tests/channel-conformance.vitest.ts`: 25 cases named `<channel> <operation> R<n>` and three hardening cases
- The `## 011-messaging-channels` section of `THIRD_PARTY_NOTICES.md`
- `bots-run/references/messaging-channels.md`, the operator reference built from the runbook
- The runtime README rows, the run mode and hub lines, the feature-catalog entry and its row
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Each transport child proves its own transport. Nothing yet proves that all five keep the one contract the same way, that an undeclared operation never reaches a provider on any of them or that an operator can set one up from documents alone.

### Purpose
One suite that runs every rule over every cell of the capability matrix, and one operator reference, so the phase closes on evidence rather than on five separate claims.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Taken on 2026-11-26 in this worktree.

```text
$ rg -n 'reached the mock platform"' specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-conformance/src/lib.rs
422:            return Err(format!("undeclared {feature:?} reached the mock platform"));
$ ls .skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md; echo "exit=$?"
ls: .skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md: No such file or directory
exit=1
```

The reference asserts R2 by name. The notices file does not exist yet, because phase 001 creates it.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add the capability-matrix driver to `tests/channel-support.ts`, so one loop builds a case per transport and operation.
- Write the 25 conformance cases and the three hardening cases.
- Append the notices section, write the operator reference and add the README, skill and catalog lines.
- Run the whole-phase gate.

### Out of Scope
- A runtime module change - each module's owner child fixes it.
- A live run against a real provider - phase 012 holds the manual scenarios. Every check here runs without a token or a network.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skilled-bots/runtime/tests/channel-support.ts` | Modify | The capability-matrix driver |
| `.skilled/skills/system-skilled-bots/runtime/tests/channel-conformance.vitest.ts` | Create | 25 rule cases and 3 hardening cases |
| `.skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` | Modify | The `## 011-messaging-channels` section |
| `.skilled/skills/system-skilled-bots/runtime/lib/README.md` | Modify | One row per channel module, nine rows |
| `.skilled/skills/system-skilled-bots/bots-run/references/messaging-channels.md` | Create | The operator reference |
| `.skilled/skills/system-skilled-bots/bots-run/SKILL.md` | Modify | One line naming `bots channel` |
| `.skilled/skills/system-skilled-bots/SKILL.md` | Modify | One line naming `bots channel` |
| `.skilled/skills/system-skilled-bots/feature-catalog/operator-loop/messaging-channels.md` | Create | The feature entry |
| `.skilled/skills/system-skilled-bots/feature-catalog/feature-catalog.md` | Modify | The catalog row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids keep their pre-expansion numbers and are unique across children 003 to 007, as `../spec.md` section 4 maps them. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-017 | Rules R1 to R5 of `../002-adapter-and-record-contracts/design/conformance-rules.md` run as fixture tests over every cell of the capability matrix through the driver: an undeclared operation returns the unsupported result and records no wire call, and a declared one returns a receipt with no error, records at least one matching wire call carrying the intent's one idempotency key and names its platform message ids. That is 25 cases, 18 undeclared and 7 declared, each named `<channel> <operation> R<n>` |
| REQ-030 | Three hardening cases run on the same fake: a press whose sender id differs from the link record's `senderId` is refused `answer-not-approver` and records no wire call, a parked question holding a stored secret is withheld and records no wire call and a 5,000-character Telegram send records two wire calls with one idempotency key |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-018 | The lifted Apache-2.0 code carries one entry per file, appended to `.skilled/skills/system-skilled-bots/THIRD_PARTY_NOTICES.md` under a `## 011-messaging-channels` heading, naming its source path, its copyright line and a statement of changes. Phase 001 creates the file and each later phase appends its own section, so this phase adds no second notices file. No tinychannels code is copied, so no notice names it |
| REQ-031 | `bots-run/references/messaging-channels.md` carries, per transport, the credentials and scopes, the derived secret names, the setup commands, the preflight, health and rotation checks and the failure table of `../002-adapter-and-record-contracts/design/operator-runbook.md`, including the one Signal UNKNOWN. The runtime README lists the nine channel modules, the run mode and the hub name `bots channel` and the feature catalog has the entry and its row |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npx vitest run tests/channel-conformance.vitest.ts -t "^R2 "` prints `Tests  18 passed`
- **SC-002**: The three hardening cases pass
- **SC-003**: The whole suite and the typecheck pass from the final state
- **SC-004**: `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Children 003 to 006 | Nothing to prove | This child starts last |
| Risk | A case fails in a module this child does not own | The fix lands in the wrong file | The scope boundary sends it to the owner child |
| Risk | The operator reference drifts from the runbook | An operator sets the wrong secret name | T011 compares the derived names in both |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The conformance file runs in the same `vitest` pass as the rest, with no network and no sleep

### Security
- **NFR-S01**: Every case asserts the absence of a wire call where a secret or an unapproved sender is involved

### Reliability
- **NFR-R01**: A case name names its channel, operation and rule, so a failure points at one cell of the matrix
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a transport that declares no optional capability still runs R1 and R2 for each
- Maximum input: the chunked case of REQ-030 counts as one send under R4
- Failure path: a declared operation that throws fails R3 with the transport and operation in its name
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | One test file, one driver and seven document edits |
| Risk | 6/25 | No runtime change |
| Research | 4/20 | The design children fix every case |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which files are lifted under Apache-2.0? The pre-expansion acceptance list names four rakazo and turnstone files. If the build lifts none, REQ-018 is met by an empty section that says so.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`
- **Design children**: `../002-adapter-and-record-contracts/design/conformance-rules.md`, `../002-adapter-and-record-contracts/design/operator-runbook.md`
- **Next phase**: `../../012-manual-testing-scenarios/`
