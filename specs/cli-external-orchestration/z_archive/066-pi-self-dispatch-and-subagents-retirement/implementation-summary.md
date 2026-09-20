---
title: "Implementation Summary: Let a Pi session dispatch cli-pi, and retire the pi-subagents route"
description: "What shipped across the three enforcement layers and the cli-pi documentation, the evidence behind each claim, and the two things this runtime could not verify."
trigger_phrases:
  - "pi self dispatch summary"
  - "cli-pi carve-out shipped"
  - "pi-subagents retired"
  - "executor audit exemption evidence"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/066-pi-self-dispatch-and-subagents-retirement"
    last_updated_at: "2026-09-08T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "All four workstreams shipped; adjacent findings closed in packet 067"
    next_safe_action: "Operator runs a live cli-pi dispatch from inside Pi, then the packet closes"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts"
      - ".opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts"
      - ".opencode/skills/cli-external-orchestration/cli-pi/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-066-pi-self-dispatch"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Let a Pi session dispatch cli-pi, and retire the pi-subagents route

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Complete pending AC-002 |
| **Completed** | 2026-09-08 |
| **Branch** | `skilled/v4.0.0.0` |
| **Files changed** | 23 modified, 1 created, 1 deleted |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**The prohibition came down in all three places that carried it, in that order.**

*The shared runtime* (`system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`) gained one constant,
`SELF_PRESENCE_EXEMPT_KINDS`, holding `cli-pi` alone, read by exactly two of the five guard layers:
`ancestry` and `lockfile`. Those are the layers that answer *"is the caller sitting inside this CLI
right now"*. `lineage`, `stack` and `env` are untouched for every kind.

*The Pi preflight hook* (`.opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts`) lost its
`dispatchSkill === "cli-pi"` deny branch and the paired "Pi cannot dispatch itself" block message. A
`cli-pi` dispatch now falls through to the same explicit-override rule as any sibling, so a dispatch
the user named is allowed and one they did not is still denied. The installed extension at
`.pi/extensions/dispatch-preflight-lint.ts` is a symlink to this file, so the deployment path carries
the change with no mirroring step.

*The documentation* lost the hard rule, the `CRITICAL — SELF-INVOCATION PROHIBITED` block, the
`detect_self_invocation()` guard and eleven cross-references across the packet, the hub and
`skills/README.txt`.

**`pi-subagents` was retired** from the activation trigger, the `AGENT_DELEGATION` router keywords,
hard rule 6, the README FAQ, four references, the prompt templates, the playbook index and the hub's
advisor vocabulary. `references/agent-delegation.md` was rewritten around Pi's built-in tools and the
CLI dispatch route rather than deleted, because it is a declared leaf in `leaf-manifest.json`. The
`PI-009` agent-bridge scenario was deleted with the package it tested.

**Three claims the hub made are now qualified rather than universal.** The hub's SKILL, README and
ROUTER each said, in some form, that every mode's guard blocks self-dispatch and that this is
non-negotiable. They now state the `cli-pi` carve-out beside the `cli-opencode` parallel-detached
asymmetry the hub already documented, and name the layers that still bind every mode.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Runtime first, hook second, documentation third. The ordering was not cosmetic: opening the hook
while the runtime still refused would have produced a dispatch that passes preflight and dies in the
guard, which is a worse failure than the clear denial it replaced. Documentation was written last so
it describes a state the code already had.

The baseline was captured before the first edit, not reconstructed after: 156 tests passing across
the two guard suites, `tsc --noEmit` clean, and a 319-line / 53-line residue inventory, all saved
under `scratch/baseline/`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

**The layer split (ADR-001).** "Inside pi they are allowed to use it" was read as the two layers that
mean *the caller is inside Pi*, not the two that mean *this process is already a dispatch chain*. A
Pi session may now dispatch pi; a `cli-pi` fan-out lineage still may not spawn another one. The
shipped adapter stress cell that asserts stack-layer recursion blocking was left untouched precisely
so it would fail if the carve-out ever reached that layer.

**One pre-existing test was rewritten rather than deleted.** `uses Pi state and home metadata while
keeping unconfirmed env surfaces absent` asserted that a Pi lockfile makes the guard refuse — the
behavior this packet deliberately changed. Its real subject was that Pi's state-path and home-dir
resolution works, so that half now asserts at `detectFromLockfile`, which is unchanged and still
reports the signal, while the guard's new verdict is asserted alongside it. The detector still tells
the truth about what it finds; the policy simply no longer acts on it.

**The version was not in conflict with the contract; the earlier reading of it was wrong.**
`sk-create-frontmatter` §3 sets a skill's anchor to
`max(SKILL.md frontmatter version, highest changelog/v*.md filename version)` and states that the
`SKILL.md` version *is* the anchor. §4's `major.minor.0.<gated edit count>` derivation applies only
to docs that are **not** a `SKILL.md`. With `changelog/v1.5.0.0.md` as the head, the anchor is
`1.5.0.0`, which is exactly what `SKILL.md` carries. The `1.4.0.17` figure quoted earlier came from
applying the child-doc rule to a `SKILL.md`, so there was no contract conflict to escalate and no
two-line flip to offer.

Measured across the family, `cli-pi` is now the most conformant of the six: its `SKILL.md` matches
its changelog head, where `cli-claude-code` sits at `1.4.0.0` against a `1.5.0.0` head and
`cli-codex` at `1.8.0.0` against a `1.9.0.0` head. Both are stale anchors in their own packets.

One genuine deviation survives and is recorded rather than fixed here: `README.md` is a child doc,
so §4 wants its build segment to carry a real edit count, and every README in the family carries
`0` instead. That is a fleet-wide convention drift across six packets, not a defect this packet
introduced, and correcting it belongs to whoever owns the frontmatter fleet.

**The retirement is recorded in the changelog, not in the references.** The operator chose removal
over "mark deprecated", so the reference prose names no retired package; a reader who still has it
installed is served by `changelog/v1.5.0.0.md`.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Guard suites (`executor-audit`, `fanout-run`) | **170 passed**, 0 failed, against a **156**-passing pre-edit baseline. Delta +14, all of them the new cases |
| `npm run typecheck` | Exit 0; error set unchanged from baseline (both empty) |
| Exemption applies | `cli-pi` allowed on an ancestry-only signal and on a lockfile-only signal |
| Exemption is keyed (negative control) | 10 parameterized cases: the other five kinds still refuse on both layers. Fails if the exemption is written kind-agnostically |
| Recursion still bounded (negative control) | `cli-pi` still refused with `recursion-guard-lineage` and `recursion-guard-stack` |
| Adapter stress suite (negative control) | `cli-pi.vitest.ts` **19 passed, 1 skipped**, file untouched — the carve-out did not reach the stack layer |
| Pi preflight hook | **33 passed**, including a new row proving an unnamed `cli-pi` dispatch is still denied |
| Playbook package validator | Zero `missing-playbook`, `orphan-playbook`, `duplicate-playbook-cell`, `invalid-playbook`, `playbook-metadata` failures |
| Residue | `pi-subagents`: zero hits outside `changelog/` and `benchmark/reports/`. `self-invocation` in `cli-pi`: only the surviving stress cell and one index link to it |
| sk-code alignment-drift gate | Wrapper exits non-zero on a documented repo-wide backlog of 6,248 findings, all under `.worktrees/` and `tmp/`. **Packet-scoped delta: zero** — no file this packet changed, and no file anywhere under `cli-external-orchestration/`, appears in the findings. `stack-folders` and `router-sync` (13/13) both PASS |
| `validate.sh --strict` | `RESULT: PASSED`, `Errors: 0` |

The Pi hook tests needed a harness shim to run at all: the extensions are authored against their
installed location under `.pi/extensions/`, where `../../.opencode/...` resolves to the repo root,
while the checked-in copies sit two levels deeper. `scratch/vitest.pi-hook.config.mts` aliases that
one specifier. It is a test-harness file in the packet's scratch, and no shipped file was changed to
accommodate it.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

**AC-002 is unverified, not passed.** The Pi preflight hook runs inside Pi. Its unit tests prove the
deny branch is gone from the source and that the override path now allows a named `cli-pi` dispatch;
they do not prove that a real Pi session's dispatch reaches the binary. That check is
operator-only (`T097`) and the packet reports it as outstanding rather than inferring it from
AC-001.

**Adjacent findings — all closed in `../067-deferred-closure/`** on the operator's direction that
nothing stay deferred. Two of them were overstated here and are corrected in that packet:

- `cli-pi` declares four hard rules and none enforces what it says — **confirmed and closed.** The
  audit turned out to be fleet-wide: 11 unregistered checks across four packets, and the CI guard
  meant to catch them scanned only the two packets that were clean.
- The playbook validator's 252 failures — **confirmed and closed.** All 84 snippets carried the
  required content under different heading words.
- `repair-derived.cjs` refusing the `.opencode/specs` path — **overstated.** It is deliberate
  confinement with a written rationale, not a bug; the alias was added without weakening it.
- `sync-agents-pi.cjs` and the `.pi/agents/` mirrors as dead code — **overstated.** `/doctor`
  checks the mirror, it reports in sync, and `.pi/SYNC.md` already documented it as a deliverable
  with no installed consumer. Only its references to the retired package were stale. Retiring it is
  a product decision left open with its rollback recorded.
- `PI-010 project-agent-override` — follows the same correction; it validates a working generator.
- `extensions/pi-fast-mode-w-subagent-support` — **investigated and live.** It is an OpenAI
  service-tier router with subagent handoff over an environment variable, has its own spec packet,
  and is enabled. The name is coincidental; it is not the retired package.
<!-- /ANCHOR:limitations -->
