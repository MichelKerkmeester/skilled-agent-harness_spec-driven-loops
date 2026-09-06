---
title: "Implementation Summary: A Gate That Can Actually Block"
description: "A changed-packet pull-request check replaces a weekly cron that reported success on a known-failure state."
trigger_phrases:
  - "retire the sweep summary"
  - "changed-packet validation workflow"
  - "pull request packet resolution"
  - "cron replaced by block gate"
  - "nearest ancestor spec"
  - "strict pass freshness sweep deleted"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/009-validation-rule-reduction/007-retire-the-sweep"
    last_updated_at: "2026-08-30T08:40:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Added a changed-packet pull-request gate and deleted the weekly sweep workflow"
    next_safe_action: "Optionally mark the new check required in branch protection"
    blockers: []
    key_files:
      - ".github/workflows/changed-packet-validation.yml"
      - ".github/workflows/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-speckit-041-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: A Gate That Can Actually Block

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-retire-the-sweep |
| **Status** | Complete |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`.github/workflows/changed-packet-validation.yml` runs on pull requests to
`main`. It resolves every changed path under `specs/` to the nearest ancestor
owning a `spec.md`, validates each resulting packet under `--strict
--no-recursive`, and fails if any of them does not report `RESULT: PASSED`.

`.github/workflows/strict-pass-freshness-sweep.yml` is deleted, and the workflow
index is updated in both directions.

The sweep script is kept. What made the old job unusable was the schedule and
the enforcement step, not the sweep itself, and the script remains runnable on
demand with its tests intact.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The resolution rule was the part worth testing, because a merge-blocking gate
that resolves packets wrongly either blocks good work or waves bad work through.
It was replayed against git history before being written into CI: a single
commit resolved to the one child packet it touched rather than to its parent,
and an eight-commit range resolved 129 changed files down to 15 distinct
packets, correctly listing a parent and a child separately when both had
changed.

The gate was then demonstrated in both directions. Over those 15 packets it
passes 15 of 15, so it would not have blocked the last eight commits of real
work — which is the property that decides whether a gate survives contact with
authors. Against `specs/cli-external-orchestration/029-cli-devin-revival`, a
packet known to fail from the phase 6 measurement, it blocks.

Two details are deliberate. The verdict is read from an explicit `RESULT:
PASSED` line rather than an exit code, because a stale compiled orchestrator
makes the validator refuse to run and print no rule output at all; an exit-code
check reads that silence as success, which is close to how the job being
replaced reported green. And the dependency-install block was carried over
verbatim from the deleted workflow, comments included, because it encodes two
failures already paid for: a workspace cannot be installed directly for want of
its own lockfile, and installing only the scripts workspace leaves every
TypeScript rule erroring in a way that looks like thousands of broken packets.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Rationale |
|----------|-----------|
| Scope the gate to changed packets | Roughly a fifth of the corpus fails on pre-existing authored content; a whole-tree gate would block every author for packets they never opened, which is why no blocking gate was ever turned on |
| Keep the sweep script, delete only the workflow | The schedule and the misreporting enforcement step were the problem; the script is a usable on-demand tool with its own tests |
| Require `RESULT: PASSED` rather than exit 0 | A validator that refuses to run emits nothing, and silence must fail rather than pass |
| Validate `--no-recursive` | A phase parent should not be blocked by children the pull request never opened; a changed child resolves to itself |
| Prove the gate passes before proving it blocks | A gate that blocks everything gets switched off, so "does it pass on real work" is the first question, not the last |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Status | Evidence |
|-------|--------|----------|
| Resolution, single commit | PASS | Resolves to the child packet touched, not the parent |
| Resolution, eight-commit range | PASS | 129 changed files to 15 distinct packets, parents and children both |
| Gate passes on real work | PASS | 15 of 15 packets validate clean |
| Gate blocks a broken packet | PASS | `029-cli-devin-revival` reports `Errors: 1`, `RESULT: FAILED` |
| Workflow well formed | PASS | YAML parses with expected trigger, job and four steps; embedded shell passes `bash -n` |
| Sweep script unbroken | PASS | Its own vitest suite and the hardening suite both pass |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The check is not yet required in branch protection.** It will run on pull
   requests, but making it mandatory is a repository setting outside this packet
   and outside what the working tree can change.

2. **The workflow itself was never executed.** GitHub Actions cannot run
   locally, so every part it depends on was tested directly instead: YAML parse,
   shell parse, resolution against real history, and the exact validate
   invocation in both directions. The install block is unexercised here and is
   trusted because it is carried over unchanged from a workflow that ran it.

3. **A packet deleted by a pull request is skipped rather than checked.** The
   diff filter excludes deletions, so removing a packet cannot fail this gate.

<!-- /ANCHOR:limitations -->
