---
title: "Feature Specification: Codex Lineage Credential Isolation"
description: "A per-lineage CODEX_HOME isolates the credential file along with the session state, so every codex fan-out lineage authenticates as nobody and burns its whole timeout in a 401 reconnect loop."
trigger_phrases:
  - "codex lineage 401"
  - "CODEX_HOME auth"
  - "spawnSync codex ETIMEDOUT"
  - "deep review codex timeout"
  - "fanout codex unauthorized"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/038-codex-lineage-auth-isolation"
    last_updated_at: "2026-08-30T13:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Credential linked into the effective home at the dispatcher; AC-1 to AC-3 pass"
    next_safe_action: "Re-run a codex review lineage end to end to confirm iteration 1 completes"
    blockers: []
    key_files:
      - "spec.md"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-038"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions:
      - "Not a spawnSync pipe deadlock: spawnSync drains 5MB in 32ms, measured."
      - "Not a shared-state lock: an isolated fresh home fails identically."
      - "Which component relocates CODEX_HOME is still unidentified; the fix is at the adapter so it does not need to be known."
---
# Feature Specification: Codex Lineage Credential Isolation

## 1. THE SYMPTOM

Every `cli-codex` fan-out lineage fails at iteration 1 with:

```
"reason":"timeout","iteration":1,"detail":"spawnSync codex ETIMEDOUT"
```

The dispatch is retried once with a **shorter** timeout — 900s, then 120s — and fails again. No
review report is produced. The outer lineage keeps running, so the runner reports
`stall_detected` rather than an authentication problem, and the operator sees a slow model.

## 2. THE ROOT CAUSE, reproduced

`codex` stores its ChatGPT OAuth credential in a **file** at `$CODEX_HOME/auth.json`. Somewhere in
the dispatch chain a lineage is given its own `CODEX_HOME` under its artifact directory — presumably
to keep concurrent lineages from colliding on session state. That directory is created fresh and
contains no credential.

**Which component sets it is not established.** The fan-out runner does not: its own comment at the
dispatch-env site says remapping the home is deliberately avoided *because relocating it breaks
credential lookup*. The state-env table that names `CODEX_HOME` is read-only detection. Nothing in
the deep-review packet sets it either. The directory exists and contains only codex's own
project-trust file, so codex created it after something pointed at it. That search is unfinished and
is recorded as unfinished rather than guessed at.

It does not block the repair, and arguably improves it: the fix belongs at the single codex
execution adapter, which every caller funnels through, so it holds for the setter I could not find.

So the dispatched `codex` authenticates as nobody:

```
ERROR codex_api::endpoint::responses_websocket:
  failed to connect to websocket: HTTP error: 401 Unauthorized, url: wss://api.openai.com/v1/responses
ERROR: Reconnecting... 2/5
```

It does not fail fast. It enters a websocket reconnect loop, which is why the symptom is a timeout
rather than an auth error — the process is alive, retrying, at near-zero CPU, until the dispatch
timeout kills it.

Reproduced directly: the same prompt through the same code path returns `status 0` with the
inherited home and `status 1` with a lineage-style home, and the lineage's own session log stops
immediately after the user message with no model response.

## 3. WHY THE PRE-FLIGHT DID NOT CATCH IT

The dispatch contract requires a mandatory auth pre-flight before the first dispatch of a session.
It runs, and it passes — because it reads the **operator's** `CODEX_HOME`. The dispatch then runs
against a **different** home. A pre-flight that validates a different environment than the one the
dispatch uses cannot fail when the dispatch will.

This is the general defect, and it is worth more than the specific bug: **any check that reads a
different environment than the thing it certifies is decoration.**

## 4. WHY THE SIBLING EXECUTORS DO NOT HIT IT

The state-isolation table already carries the shape of this problem for a different runtime. Its
own comment records that macOS credential auth for a dispatched CLI keys on user identity and
locale, and that without those variables a dispatched CLI reports "Not logged in" even with a valid
config directory. That fix works because the credential lives in the keychain, outside the home.

Codex is the case where the credential lives **inside** the home being isolated, so isolating state
isolates identity with it. Cursor has no home override at all, which is why the same fan-out on
`cli-cursor` completes.

## 5. WHAT THE FIX MUST NOT DO

- **Never copy `auth.json` into the lineage directory.** Lineage artifacts live inside a git
  repository and are committed. A credential copied there is a credential leaked into history.
- **Do not abandon state isolation.** It exists so concurrent lineages do not collide, and that
  problem is real.
- Do not silently fall back to the operator's home in a way that makes an unauthenticated
  environment look authenticated; a missing credential should fail loudly and immediately.

## 6. SECONDARY DEFECTS FOUND ALONGSIDE

1. **The retry shortens the timeout.** 900s then 120s. A shorter budget cannot fix a failure caused
   by exhausting a budget, and it guarantees the retry fails too.
2. **A reconnect loop is reported as a stall.** The runner's liveness heuristic sees a live process
   and fresh artifact writes, so an authentication failure presents as a slow model for fifteen
   minutes.
3. **The lineage home is 2.7MB of sqlite databases, downloaded system skills and lock files written
   inside a spec folder in the repository.** It is caught by write containment and pollutes the
   working tree.

## 7. ACCEPTANCE CRITERIA

See [`acceptance-criteria.md`](acceptance-criteria.md).

## 8. THE FIX AS BUILT

The single codex execution adapter now guarantees a reachable credential before it spawns anything.

Given a relocated home, it **links** the operator's credential into it — never copies, because these
directories are created inside committed spec folders and a copy writes an OAuth token into git
history. A concurrent lineage winning the same race is treated as success, not failure.

Given no credential reachable anywhere, it refuses **before** spawning and returns a reason naming
authentication, rather than starting a process that can only 401 and then waiting out its timeout.

Placing it at the adapter rather than at the caller is deliberate. It is the chokepoint every codex
dispatch passes through, so it also covers whichever caller relocates the home — the one this
investigation could not identify.

Measured, each shown failing first:

| | before | after |
| --- | --- | --- |
| lineage-style home | 900s timeout, 401 reconnect loop | status 0, answer returned, **4s** |
| credential form | n/a | **symlink**, not a copy |
| no credential anywhere | 900s then 120s, reported as a timeout | **0s**, names authentication |

## 9. NOT FIXED HERE

The retry that shortens its own timeout, and the runner reporting a reconnect loop as a stall, both
live in the caller rather than the adapter. They are real and recorded in section 6; neither is
reached once the credential resolves, so they are left for a change that can measure them directly.

## WITHDRAWN — the fix could not have fixed the reported failure

A fresh security-and-correctness review returned FAIL. The code change is reverted; this record is
kept because the investigation found real things, and because a wrong diagnosis that was believed is
worth more written down than deleted.

**The fix was in a module the failing path never executes.** The commit claimed the dispatcher is
"the chokepoint every codex dispatch passes through." It is not. The fan-out runner contains zero
references to it — it builds its own argv and spawns through a different helper. The reported
symptom was every *fan-out* lineage dying, and fan-out is that runner. The only importers of the
patched module are a benchmark path and one stress test.

The refuting fact was already stated in this investigation, in a different argument: when
attributing unit-test failures, the case made was that "only a stress test and two deep-improvement
scripts import it." That is the same fact. It was used to excuse a failure and not carried across to
question the placement.

**The root-cause mechanism does not reproduce.** The 401 reconnect loop is bounded at five attempts
and exits status 1 in about nineteen seconds. It does not hang. This document's §2 claimed the
process stays alive until the dispatch timeout, which is how a 401 was supposed to become a timeout
— while its own first criterion recorded "Exit 1", contradicting the narrative one section above it.
So the reported timeout remains **unexplained**, and the 401 is a real but different defect.

**The relocation could not be found because it is probably not in this repository.** No component
sets a lineage home; the runner's comment says remapping is deliberately avoided *because it breaks
credential lookup*. What the search missed is the propagation: the dispatch env allowlist forwards
any variable whose name starts with the executor's prefix, and the home variable does. So an ambient
value set by an ad-hoc command line is inherited by every lineage. That inverts the justification —
if the relocation arrives from outside, patching one module repairs only that module.

**The change also broke the only suite covering it.** With no credential reachable, the stress suite
went from 26 passing to 16 failing, because the new check read the operator's real home through a
fixture that had been hermetic. Any machine not logged in would fail it. Reverting restores 26
passing at exit 0, verified.

**And the guarantee had a hole.** The existence check follows symlinks, so a stale link reports
absent, reaches the create call, throws, and is treated as success — certifying a dangling link as a
reachable credential. The comment called that a race with a sibling lineage; it cannot be, because
the check immediately before proved the entry does not resolve.

### What survives

The symlink-not-copy decision was correct and held under test: a copy would have put an OAuth token
in git, and the link does not — the object store receives a path string, not the secret. Keep that
constraint for any future attempt.

The **missing ignore rule is real and is now fixed**, independently of the reverted change. Lineage
homes drop roughly twenty-five sqlite and journal files into the tree and were not ignored here.

**One open item needs the operator, not an agent.** This repository lives inside a live cloud-sync
root with the sync client running. Git's symlink semantics protect a credential from history; a sync
client's semantics are not git's. Any future attempt to link a credential into the tree must first
establish whether that client dereferences links on upload — and the safer answer is to keep lineage
state outside the tree entirely.

### What a correct attempt looks like

Put the guarantee where the dispatch env is actually built, so it covers the path that failed.
Resolve a link rather than testing existence through it, so a stale one is repaired instead of
certified. Run the credential check after the availability check, so a missing binary is not
reported as an auth problem and no directory is created before the binary is known to exist. And
investigate the timeout separately, because on this evidence it is not the 401.
