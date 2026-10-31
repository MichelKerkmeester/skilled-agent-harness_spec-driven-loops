---
title: "Goal: Trigger phrase quality enforcement"
description: "The durable directive this packet executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/013-trigger-phrase-quality-enforcement"
    last_updated_at: "2026-09-07T06:20:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Closed every criterion"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-simplification-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Trigger phrase quality enforcement

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close every confirmed finding from the retrieval lane's second round so that the phrases the convention bans are named by the judge, counted by the generator and surfaced by the doctor, and every document that describes the retrieval scripts matches them, with nothing deferred.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The judge lives in one dependency-free module and every enforcer imports or re-exports it; the generator counts, it never deletes |
| D2 | The new classes warn, like every class before them; cleaning the owning documents is their owners' content decision |
| D3 | Rule documents stay out of the trigger index because Gate 5 loads them through the trigger table; the exclusion is documented rather than reversed |
| D4 | The variants sidecar stays as the documented operator trace of raw spellings |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend the full text
of this file in chat so the operator can update their copy. A child goal change
that alters a parent decision or criterion is an amendment to the parent: apply
it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [x] Every row of the retrieval lane's round-two section names a fix, a document change or a recorded decision
- [x] The judge rejects single-token and numbers-only phrases with their own classes and a test asserts it
- [x] The committed diagnostics carry a phraseQuality bucket and two regenerations produce one hash
- [x] validate.sh --strict prints RESULT: PASSED for this child
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
| Packet opened | Done | this file |
| Eight P1 and twelve P2 rows censused; five decisions re-verified | Done | `../001-ripgrep-search-system/research/confirmed-findings.md` §6 |
| Judge, generator, doctor, presentation, README and conventions changes | Done | `implementation-summary.md` Files Changed |
| Gates | Done | syntax checks, five suites, two regenerations, sk-doc validator, strict validation |

### Deviations and findings

| Item | Note |
|------|------|
| An existing test admitted bare symbols | The convention's own two-token rule disallows them; the case was corrected and the reason written beside it, and the Include list now says a symbol needs a second token. |
| The corpus stays polluted | 826 documents own single-token phrases, most from a repo-wide frontmatter sweep; the bucket makes that visible on every run, and the cleanup belongs to the packets' owners. |
<!-- /ANCHOR:log -->
