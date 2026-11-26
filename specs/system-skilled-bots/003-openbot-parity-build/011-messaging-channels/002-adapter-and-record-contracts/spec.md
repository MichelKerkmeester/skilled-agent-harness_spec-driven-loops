---
title: "Feature Specification: Phase 2: adapter-and-record-contracts"
description: "The design documents that fix the channel contracts before any code is written: the capability keys and the per-transport matrix, every channel record with its lifecycle and samples, the inbound acknowledge sequence per transport, the five numbered conformance rules and the operator runbook."
trigger_phrases:
  - "adapter and record contracts"
  - "phase 2 adapter and record contracts"
  - "channel capability matrix"
  - "channel inbound sequence"
  - "channel operator runbook"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: adapter-and-record-contracts

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
| **Phase** | 2 of 7 |
| **Predecessor** | 001-channel-ux-and-message-map |
| **Successor** | 003-link-roster-and-answer-gate |
| **Handoff Criteria** | The five design documents exist in `design/` and each one's check in `tasks.md` prints what it says |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the messaging channels phase parent. It runs beside `001-channel-ux-and-message-map`, and both feed the four build children.

**Scope Boundary**: Design documents in `design/` and nothing else. No TypeScript, no test, no edit to `contracts/`. The capability vocabulary, each record's lifecycle and the parts of each shape the contracts leave open, the acknowledge order per transport, the conformance rules and the operator steps are fixed here. Where the frozen contract is silent or short, this child designs around it and the parent spec lists the change for the contract's owner.

**Dependencies**:
- The channel records in `contracts/records.md` sections 11 to 16, the `channel list` payload in `contracts/cli-json.md` section 3.3, the refusals in `contracts/refusals.md` section 3.10, the state tree and the channel inbound sequence in `contracts/runtime-architecture.md` sections 2.1 and 3.4 and `contracts/versioning.md` rule 3
- The secret name grammar and environment key mapping of `contracts/records.md` section 8, which every derived name in `design/records.md` section 1.1 stays inside
- The reference adapter contract, its acknowledge policy, its capability record and its conformance checker [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-runtime/src/channel/adapter.rs:44-68] [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-bus/src/capabilities.rs:162-185] [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-conformance/src/lib.rs:374-470]
- The reference providers, for every wire fact the inbound sequence and the runbook state

**Deliverables**:
- `design/capabilities.md`, eight keys, three descriptor facts and a matrix with one column per transport
- `design/records.md`, every channel record with its fields, its samples and its lifecycle, the secret names a transport derives, the backoff table as data and the listen lease
- `design/inbound-sequence.md`, the common acknowledge order and one section per transport
- `design/conformance-rules.md`, rules R1 to R5 and the 25-case fixture
- `design/operator-runbook.md`, the setup, preflight, health and rotation steps per transport
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`declaredCapabilities` had no vocabulary and no matrix, the inbound acknowledge boundary was undefined and the `seen/` folder was named once with no content. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:202-203] The link record, the queue entry and `channel list --json` had no field list, the approval index had no key structure, REQ-017 stated five rules in one sentence and the operator prerequisites were a risk table, not a runbook. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:204-209] The packet contracts since gave every record a field table, and they still leave the lifecycles, the extra credentials and the acknowledge order to this phase. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md:461]

### Purpose
One design for the adapter and its records, so the build children implement shapes and orders rather than choose them.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Taken on 2026-11-26 in this worktree, before this phase wrote `design/`.

```text
$ rg -n 'acknowledge sequence is 011' specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md
461:The record is written after the durable enqueue and before the provider is acknowledged, so a redelivery finds it and enqueues nothing. The per-transport acknowledge sequence is 011's design child to fix.
$ rg -c 'bot_token|app_token|app_secret' specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md
EXIT=1
```

The first line is the contract handing this phase the acknowledge order. The second is the credential gap: the contract names one `secret` per channel and no second credential. After this phase, `ls design` lists five documents.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fix the capability keys, the descriptor facts and one matrix column per transport, as the conformance fixture's input.
- Restate every channel record's fields from the contracts, and add each one's key structure, lifecycle, samples and write order.
- Derive the extra secret names Slack, Signal and WhatsApp need inside the section 8 grammar and fix the Signal daemon and WhatsApp listener addresses.
- Fix the acknowledge order per transport: when the provider is told, what a stop leaves on disk and how a redelivery is caught.
- Number the five conformance rules and lay out the 25 cases they cover.
- Write the operator runbook per transport.

### Out of Scope
- Any code or test - the build children own them.
- Any edit to `contracts/` - frozen. Each gap is in the parent spec's section 8 for the owner.
- A transport beyond the five - out of scope for the whole phase.
- Pruning old seen records - a later packet's choice. One small file per inbound message is kept.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `design/capabilities.md` | Create | The keys, the descriptor facts, the matrix and how a transport uses its row |
| `design/records.md` | Create | Every channel record, the derived secret names, the backoff data, the listen lease and the write order of one prompt |
| `design/inbound-sequence.md` | Create | The common order and one section per transport |
| `design/conformance-rules.md` | Create | R1 to R5 and the fixture |
| `design/operator-runbook.md` | Create | Setup, preflight, health and rotation per transport |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `design/capabilities.md` fixes a closed set of boolean keys, the descriptor facts and one matrix column for each of `terminal`, `telegram`, `slack`, `signal` and `whatsapp`, each value with its source |
| REQ-002 | `design/records.md` gives a field table and a sample with `schemaVersion` for `channels/config.json`, the link record with its lockout, the approval index with its key structure, the queue entry with its state enum and the backoff table as data, the seen record, the listen lease, `operators.json` and `channel list --json` |
| REQ-003 | `design/records.md` section 1.1 names every credential each transport reads, as the configured secret name or a fixed suffix of it, each inside the `contracts/records.md` section 8 grammar |
| REQ-004 | `design/inbound-sequence.md` states per transport when the provider is acknowledged relative to the durable step and the seen record, what is on disk if the process stops between them and how a redelivery is recognized |
| REQ-005 | `design/conformance-rules.md` numbers the five rules, gives each its fixture and lays out the cases over the matrix |
| REQ-006 | `design/operator-runbook.md` gives per transport the credentials and scopes, the `bots secret set` and `bots channel link` commands, a preflight check, a health check and the rotation step |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | Every restated table names its contract section and says the contract wins on a difference, and no file under `contracts/` changes |
| REQ-008 | A fact no reference states is marked UNKNOWN or "not stated" with what would confirm it, never supplied from memory as fact |
| REQ-009 | Every acceptance criterion is answered by a command that runs without a tty, a token or a network |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The capability check prints 11
- **SC-002**: The records check prints 9 and `5 750000`
- **SC-003**: The inbound check prints 5 and 4, the conformance check prints 5, 18 and 7 and the runbook check prints 12 and 12
- **SC-004**: `git status --short specs/system-skilled-bots/003-openbot-parity-build/contracts` prints nothing
- **SC-005**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The frozen contracts | A restated table drifts from its source | Each table names its section and the contract wins, and the parent lists every gap |
| Risk | Derived secret names are a convention, not a key | An operator sets the wrong name | `operator-runbook.md` spells every name, and a missing one refuses `secret-unknown` before any I/O |
| Risk | Signal events in a disconnect gap | A message may be lost | Marked UNKNOWN in `inbound-sequence.md` section 4 with the manual run that confirms it, and told to the operator |
| Risk | A provider limit no reference states | A builder guesses | Each such limit is written as not stated, and the design does not depend on it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: An inbound message costs one seen-record read, one durable write and one seen-record write before the acknowledge
- **NFR-P02**: The design adds no runtime cost of its own

### Security
- **NFR-S01**: No credential value appears in `design/`. Only names and placeholders such as `$TELEGRAM_TOKEN`
- **NFR-S02**: The WhatsApp body is authenticated before it is parsed, and a missing, malformed and wrong signature answer the same way

### Reliability
- **NFR-R01**: Every acknowledge follows the durable step, so a stop never loses a message a provider would redeliver
- **NFR-R02**: A queue entry's state only moves forward, and a `sending` entry found at start becomes `unknown`
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a channel the config does not name has no row in `channel list` and no transport starts for it
- Maximum input: a WhatsApp body over 2 MiB answers `413` before its signature is computed
- Failure path: a stop between the durable step and the seen record is caught on redelivery by the request queue's own duplicate marker
- Two prompts for one item: the index holds one channel, and the other chat's press is refused `item-unknown`
- Adversarial input: an unsigned WhatsApp body answers `401` and is never parsed
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | Five design documents in one folder, no code |
| Risk | 9/25 | An acknowledge order per transport and a credential convention around a frozen contract |
| Research | 14/20 | Four reference providers, the reference adapter, capability record and checker and five contracts |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- How does a transport with several credentials name them inside a one-secret config? Decision: fixed suffixes on the configured name (`design/records.md` section 1.1). Reversal condition: `contracts/records.md` section 11 gains keys.
- Does the Telegram offset persist? Decision: no. The first poll after a restart starts at `0` and the seen record drops what was taken.
- Is the action id index 0-based like the reference? Decision: no, 1-based, so a button and a numbered reply send the same number.
- Which failures count toward the pairing lockout? Decision: a six-digit attempt that is not the pending code. Any other text from an unlinked chat is refused and counts nothing.
- Does signal-cli keep events for a disconnected client? UNKNOWN, `design/inbound-sequence.md` section 4.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Design documents**: the five files in `design/`
- **Parent Spec**: `../spec.md`
- **Contracts**: `../../contracts/`
- **Sibling children**: `../001-channel-ux-and-message-map/` and `../003-link-roster-and-answer-gate/` to `../007-conformance-hardening-and-proof/`
