---
title: "Acceptance Criteria: Phase 8: vault"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "vault acceptance criteria"
  - "secret store criteria"
  - "vault closure gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/008-vault"
    last_updated_at: "2026-11-25T07:13:43Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-vault"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 8: vault

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skilled-bots/003-openbot-parity-build/008-vault
**Level:** 2
**Status:** Draft
**Date:** 2026-11-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

Four names keep the checks concrete. `skilled-test-value-7f3a` is the value the tests plant. `RUN` is the run folder the fixture prints. `STATE` is the identity's state root, so the store is `$STATE/secrets`. `FIXTURE` is the throwaway checkout the test builds under `scratch/`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a terminal, When the operator runs `bots secret set demo` and types a value, Then the value is stored and never echoed | `printf 'skilled-test-value-7f3a\n' \| node .skilled/bin/bots.cjs secret set demo` exits 0 and its output holds no value | Unmet | - |
| AC-002 | REQ-002 | Given a host with `security` on PATH, When `bots secret set demo` runs, Then the index records the backend it used, and `--store file` records `file` with a 0600 value file | `jq -r '.entries.demo.backend' "$STATE/secrets/index.json"` prints `file` after `--store file`, and `stat -f '%Lp' "$STATE/secrets/demo.value"` prints 600 | Unmet | - |
| AC-003 | REQ-003 | Given a stored value, When `bots secret list` runs, Then it prints the name, the backend and the timestamps and no value | `node .skilled/bin/bots.cjs secret list \| rg -c 'skilled-test-value-7f3a'` prints 0 | Unmet | - |
| AC-004 | REQ-004 | Given a stored name, When `bots secret forget demo` runs twice, Then both exit 0, the second says the name was not held, and `list` omits it | `node .skilled/bin/bots.cjs secret forget demo; echo "exit=$?"` prints `exit=0` twice and `bots secret list` omits `demo` | Unmet | - |
| AC-005 | REQ-005 | Given a `BOT.md` with `secrets: ../etc/passwd`, When the checker runs, Then it prints `FAIL: definition.secret-name-invalid` | `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs "$FIXTURE"` prints that line | Unmet | - |
| AC-006 | REQ-006 | Given a bot declaring `secrets: absent`, When `bots run` starts, Then it prints `refused before dispatch (secret-unknown)` and exits 4 | `node .skilled/bin/bots.cjs run pb-vault; echo "exit=$?"` prints the refusal line and `exit=4` | Unmet | - |
| AC-007 | REQ-007 | Given a bot declaring `secrets: demo` whose body prints its environment, When the run completes, Then the child saw `SKILLED_BOT_SECRET_DEMO` and the run folder holds no value | `rg -c 'skilled-test-value-7f3a' "$RUN"` prints 0, and the child's stdout holds `SKILLED_BOT_SECRET_DEMO=` | Unmet | - |
| AC-008 | REQ-008 | Given a completed run, When the record is read, Then `posture.secretsUsed` is `["demo"]`, and a record written before this phase validates with `[]` | `jq '.posture.secretsUsed' "$RUN/record.json"` prints `["demo"]`, and `tests/run-record.vitest.ts` passes a record without the field | Unmet | - |
| AC-009 | REQ-009 | Given a stored value, When a body, a question, an answer, a request prompt or a delivery message holds it, Then the run refuses `body-secret` or the delivery is not sent | `tests/secrets.vitest.ts` covers the five surfaces and `cd .skilled/skills/system-skilled-bots/runtime && npm test` exits 0 | Unmet | - |
| AC-010 | REQ-010 | Given an empty line or a known placeholder, When `bots secret set demo` runs, Then it exits 2 with `secret-empty` or `secret-placeholder` and stores nothing | `printf 'dev-secret-change-me-please-32chars\n' \| node .skilled/bin/bots.cjs secret set demo; echo "exit=$?"` prints `secret-placeholder` and `exit=2` | Unmet | - |
| AC-011 | REQ-011 | Given a backend that reports success and stores nothing, When `bots secret set demo` runs, Then it exits 2 with `secret-write-dropped` | `tests/secrets.vitest.ts` fake-backend case passes under `npm test` | Unmet | - |
| AC-012 | REQ-012 | Given the three lifted files, When the notices are read, Then each names its source path and its changes, and `THIRD_PARTY_NOTICES.md` holds three entries | `rg -c 'Apache-2.0' THIRD_PARTY_NOTICES.md` prints 3, and `rg -c 'Apache-2.0' .skilled/skills/system-skilled-bots/runtime/lib/secret-matcher.ts .skilled/skills/system-skilled-bots/runtime/lib/secrets-guard.ts .skilled/skills/system-skilled-bots/runtime/lib/vault-policy.ts` prints three lines | Unmet | - |
| AC-013 | REQ-013 | Given 20 stored values and a 10,000-character text, When `findSecretLiteral` runs, Then it returns the same match as a per-value scan and the existing dispatch tests still pass | `cd .skilled/skills/system-skilled-bots/runtime && npm test -- tests/secret-matcher.vitest.ts tests/dispatch.vitest.ts` exits 0 | Unmet | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No

AC-001 is unmet: no verb stores a value yet, so every later criterion has nothing to read.
<!-- /ANCHOR:closure -->
