---
title: "Acceptance Criteria: Automatic operator decision capture"
description: "The criteria this packet must satisfy before it may close, each tied to a task and observable evidence."
trigger_phrases:
  - "decision capture acceptance criteria"
  - "operator decision verification"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Automatic operator decision capture

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when every row below is Met, Waived or Superseded. A Waived or Superseded row names an ADR that exists in decision-record.md.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 042-decision-capture
**Level:** 3
**Status:** Complete
**Date:** 2026-11-01

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given one Claude AskUserQuestion answer, When the live probe and capture path run, Then each question and available answer is normalized once. | tasks.md:38, tasks.md:48, tasks.md:49 Observed: the live probe's payload carried tool_response.answers (scratch/t001-probe/T001-result.md). Fed that payload, redacted, the registered adapter queues exactly one record with the exact question, options and answer, and queues none when it reads a wrong key. | Met | - |
| AC-002 | REQ-002 | Given a missed tool answer and a plain-chat question, When the transcript sweep runs, Then the missed answer is recovered and only a clearly matched chat reply enters the save payload. | tasks.md:50 Observed: sweep tests 10/10; a sweep of the main session transcript recovered 53 answered questions, and an independent count of its 17 typed prompts matched the single chat candidate. | Met | - |
| AC-003 | REQ-003 | Given a product question and a process question, When the capture filter runs, Then the product question may proceed and the process question creates no queue event or tracked entry. | tasks.md:51 Observed: the filter drops the real Q004 workspace question and the Gate 3 shapes and keeps the Q002 meta-question and Q005; a dropped question never reaches the queue. | Met | - |
| AC-004 | REQ-004 | Given a confirmed answer and its session context, When the session model rewrites it, Then the payload has decided, why, supersedes and carried by fields. An unstated reason is labelled Not stated. | tasks.md:52 Observed: the save rejects an entry missing `decided`, and an entry with no `why` is written as `Not stated.` with `None` for supersedes. | Met | - |
| AC-005 | REQ-005 | Given a bound standard packet or phase packet, When the writer resolves an entry, Then standard decisions use the bound packet, cross-phase decisions use the parent and phase-local decisions use the selected child. | tasks.md:53 Observed: save tests write a standard target to itself, cross-phase to the parent, local to the leaf, and nothing for two-child paths. | Met | - |
| AC-006 | REQ-006 | Given a source event with a stable question id, When full-auto save runs twice, Then the second run leaves decision-record.md byte-identical with no duplicate entry. | tasks.md:54, tasks.md:57 Observed: two identical full-auto saves leave decision-record.md byte-identical with one Q001 row. | Met | - |
| AC-007 | REQ-007 | Given a question with options and an answer, When the writer appends it, Then the same id links the concise decision to the exact question, options and answer in the tracked appendix. | tasks.md:55 Observed: one id links the row and the appendix item; fenced values, a piped option and a quoted heading round-trip exactly. | Met | - |
| AC-008 | REQ-008 | Given a markerless packet with a resolvable current level, When the writer creates decision-record.md, Then it writes the matching level marker first and the detected level is unchanged before and after. | tasks.md:39, tasks.md:56 Observed: a markerless Level 2 fixture gets `<!-- SPECKIT_LEVEL: 2 -->` first and detectLevel reads 2 before and after; without the guard the same shape reads 3. | Met | - |
| AC-009 | REQ-009 | Given Codex, OpenCode, Pi or Devin, When its answer surface is probed, Then confirmed delivery enables its adapter and an unresolved result stays UNKNOWN with the adapter disabled. | tasks.md:61, tasks.md:62, tasks.md:63, tasks.md:64, tasks.md:65, tasks.md:66, tasks.md:67 Observed: OpenCode and Devin store the answer in their sessions, so their save-time readers are enabled (Q006) and pass 6 of 6 and 5 of 5 on redacted real samples. Codex and Pi have no observed answered call and stay UNKNOWN with no adapter. No runtime besides Claude has a live hook, because no hook payload was probed. | Met | - |
| AC-010 | REQ-010 | Given eligible unconsumed queue events, When the session ends, Then the Stop hook reports a pending count without writing a decision entry. | tasks.md:58 Observed: the compiled Stop hook printed one systemMessage for two pending answers, nothing on the next run, and wrote no decision entry. | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| Met | Verified. The Verification cell names evidence that was actually observed. |
| Unmet | Not yet satisfied. Blocks closure. |
| Waived | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| Superseded | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write a dash when a row is Met or Unmet. Write an ADR id when a row is Waived or Superseded. The named decision must exist in decision-record.md.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes.

All ten criteria are Met. The live probe settled AC-001 and the Claude hook is registered. AC-009 is met by the OpenCode and Devin transcript readers the operator chose over a waiver (Q006), while Codex and Pi stay UNKNOWN with no adapter, as REQ-009 requires. The commit waits for the main session (Q007).

<!-- /ANCHOR:closure -->

