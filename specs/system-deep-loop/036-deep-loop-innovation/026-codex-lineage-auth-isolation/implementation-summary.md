---
title: "Implementation Summary"
description: "A credential guarantee was placed at the codex execution adapter, measured working, then withdrawn and reverted after a review found the patched module is not on the path that failed. The ignore rule for lineage homes survived; the record is kept because the investigation found real things."
trigger_phrases:
  - "implementation"
  - "summary"
  - "template"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/026-codex-lineage-auth-isolation"
    last_updated_at: "2026-09-05T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Recorded the withdrawal: the adapter fix is reverted, only the ignore rule survives"
    next_safe_action: "None; packet withdrawn"
    blockers: []
    key_decisions:
      - "Link the credential, never copy it: a copy writes an OAuth token into git history"
      - "Revert rather than repair, because the fix sat in a module the failing path never executes"
      - "Keep the record rather than delete it, because a wrong diagnosis that was believed is worth writing down"
    key_files:
      - "spec.md"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-038"
      parent_session_id: null
    open_questions:
      - "Which component relocates a lineage's CODEX_HOME is still unidentified"
      - "The reported timeout is unexplained: the 401 loop is bounded and exits in about nineteen seconds"
    answered_questions:
      - "Not a spawnSync pipe deadlock: spawnSync drains 5MB in 32ms, measured"
      - "Not a shared-state lock: an isolated fresh home fails identically"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | system-deep-loop/036-deep-loop-innovation/026-codex-lineage-auth-isolation |
| **Completed** | Not completed. Withdrawn 2026-08-30 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two things were built. One was reverted. One survived.

**Reverted: a credential guarantee at the codex execution adapter.** Given a relocated `CODEX_HOME`, it linked the operator's credential into that home before spawning anything. Given no credential reachable anywhere, it refused before spawning and returned a reason naming authentication, instead of starting a process that could only 401 and then wait out its timeout. It was placed at the adapter rather than at the caller on the argument that the adapter is the chokepoint every codex dispatch passes through.

That argument was wrong, and it is the reason the change is gone. See Verification below.

**Survived: the ignore rule for lineage homes.** A lineage home drops roughly twenty-five sqlite and journal files into the working tree, and nothing was ignoring them here. That rule is real, is fixed, and is independent of the reverted change.

Nothing else from this packet is in the tree. The investigation itself is the durable output, and it lives in `spec.md`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work ran as an investigation first and a change second. The symptom was that every `cli-codex` fan-out lineage died at iteration 1 with `spawnSync codex ETIMEDOUT`, retried once on a shorter budget, and produced no report.

Two candidate causes were eliminated by measurement before any code moved: a spawnSync pipe deadlock, ruled out because spawnSync drains 5MB in 32ms, and a shared-state lock, ruled out because an isolated fresh home fails identically. The remaining difference was the home itself, so the change went in at the adapter, and each acceptance criterion was demonstrated failing before the fix and passing after it.

A later security-and-correctness review of that change returned FAIL. The code was reverted. This document, `spec.md` and `acceptance-criteria.md` were kept.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Link the credential, never copy it | Lineage artifacts live inside a committed git repository. A copy writes an OAuth token into history. The link puts a path string in the object store, not the secret. This decision held under test and should bind any future attempt. |
| Do not abandon state isolation | It exists so concurrent lineages do not collide on session state, and that problem is real. The defect is that codex keeps its credential inside the home being isolated. |
| Fail loudly on a missing credential | A silent fallback to the operator's home makes an unauthenticated environment look authenticated, which is the failure this packet was chasing in the first place. |
| Revert rather than repair | The patched module is not on the path that failed. Repairing it would have produced a correct change to code the symptom never reaches. |
| Keep the record rather than delete it | The investigation found real defects, and a wrong diagnosis that was believed is worth more written down than deleted. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

**What was measured on the change, each shown failing first.**

| Case | Before | After |
|------|--------|-------|
| Lineage-style home | 900s timeout, 401 reconnect loop | status 0, answer returned, 4s |
| Credential form | not applicable | symlink, not a copy |
| No credential anywhere | 900s then 120s, reported as a timeout | 0s, names authentication |

**What the review found, which is why none of that shipped.**

The change was in a module the failing path never executes. The fan-out runner carries zero references to it: it builds its own argv and spawns through a different helper. Fan-out is exactly what the reported symptom was. The only importers of the patched module are a benchmark path and one stress test. That fact had already been stated in this investigation, in a different argument, and was not carried across to question the placement.

The root-cause mechanism does not reproduce. The 401 reconnect loop is bounded at five attempts and exits status 1 in about nineteen seconds. It does not hang, so a 401 does not become a timeout, and the reported timeout is left unexplained.

The change broke the only suite covering it. With no credential reachable, the stress suite went from 26 passing to 16 failing, because the new check read the operator's real home through a fixture that had been hermetic. Reverting restores 26 passing at exit 0, verified.

The guarantee also had a hole. The existence check followed symlinks, so a stale link reported absent, reached the create call, threw, and was treated as success, certifying a dangling link as a reachable credential.

**Credential exposure, checked after the revert.** The tree contains no `.codex-home` directory and no credential symlink. The real credential sits outside the repository at `~/.codex/auth.json`, mode 600. The code that would have created such a link is gone, so nothing is pending.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Limitations and Follow-ups

The reported timeout is still unexplained. On this evidence it is not the 401, and the 401 is a real but different defect.

Which component relocates a lineage's `CODEX_HOME` is still unidentified. No component in this repository sets one. The review proposed that the dispatch env allowlist forwards an ambient value whose name starts with the executor's prefix, so the value may arrive from outside the repository entirely. That path was proposed, not confirmed.

Two secondary defects found alongside are untouched, both in the caller rather than the adapter: the retry that shortens its own timeout from 900s to 120s, and the runner reporting a reconnect loop as a stall.

A correct attempt is not scheduled here. Its conditions are recorded in `spec.md` section 11: put the guarantee where the dispatch env is actually built so it covers the path that failed, resolve a link rather than testing existence through it, run the credential check after the availability check, and investigate the timeout separately.
<!-- /ANCHOR:limitations -->
