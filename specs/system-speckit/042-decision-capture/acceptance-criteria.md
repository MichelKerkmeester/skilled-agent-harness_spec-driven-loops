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

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when every row below is Met, Waived or Superseded. A Waived or Superseded row names an ADR that exists in decision-record.md.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 042-decision-capture
**Level:** 2
**Status:** Draft
**Date:** 2026-11-01

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given one Claude AskUserQuestion answer, When the live probe and capture path run, Then each question and available answer is normalized once. | tasks.md:38, tasks.md:48, tasks.md:49 | Unmet | - |
| AC-002 | REQ-002 | Given a missed tool answer and a plain-chat question, When the transcript sweep runs, Then the missed answer is recovered and only a clearly matched chat reply enters the save payload. | tasks.md:50 | Unmet | - |
| AC-003 | REQ-003 | Given a product question and a process question, When the capture filter runs, Then the product question may proceed and the process question creates no queue event or tracked entry. | tasks.md:51 | Unmet | - |
| AC-004 | REQ-004 | Given a confirmed answer and its session context, When the session model rewrites it, Then the payload has decided, why, supersedes and carried by fields. An unstated reason is labelled Not stated. | tasks.md:52 | Unmet | - |
| AC-005 | REQ-005 | Given a bound standard packet or phase packet, When the writer resolves an entry, Then standard decisions use the bound packet, cross-phase decisions use the parent and phase-local decisions use the selected child. | tasks.md:53 | Unmet | - |
| AC-006 | REQ-006 | Given a source event with a stable question id, When full-auto save runs twice, Then the second run leaves decision-record.md byte-identical with no duplicate entry. | tasks.md:54, tasks.md:57 | Unmet | - |
| AC-007 | REQ-007 | Given a question with options and an answer, When the writer appends it, Then the same id links the concise decision to the exact question, options and answer in the tracked appendix. | tasks.md:55 | Unmet | - |
| AC-008 | REQ-008 | Given a markerless packet with a resolvable current level, When the writer creates decision-record.md, Then it writes the matching level marker first and the detected level is unchanged before and after. | tasks.md:39, tasks.md:56 | Unmet | - |
| AC-009 | REQ-009 | Given Codex, OpenCode, Pi or Devin, When its answer surface is probed, Then confirmed delivery enables its adapter and an unresolved result stays UNKNOWN with the adapter disabled. | tasks.md:61, tasks.md:62, tasks.md:63, tasks.md:64, tasks.md:65 | Unmet | - |
| AC-010 | REQ-010 | Given eligible unconsumed queue events, When the session ends, Then the Stop hook reports a pending count without writing a decision entry. | tasks.md:58 | Unmet | - |

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

**Closeable:** No.

Implementation and feature tests have not run. Every criterion remains Unmet.

<!-- /ANCHOR:closure -->

