---
title: "Implementation Summary: Close every deferred and pre-existing failure the Pi carve-out surfaced"
description: "What shipped across the drift verifier, the hard-rule engine, 84 playbooks and 21 source files, with the arithmetic that shows the gates went green by being correct rather than by being narrowed."
trigger_phrases:
  - "deferred closure summary"
  - "drift gate first clean run"
  - "hard rule registration closed"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/067-deferred-closure"
    last_updated_at: "2026-09-08T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "All six findings closed and three repo-wide gates green"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py"
      - ".opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-067-deferred-closure"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Close every deferred and pre-existing failure the Pi carve-out surfaced

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Complete |
| **Completed** | 2026-09-08 |
| **Branch** | `skilled/v4.0.0.0` |
| **Files changed** | 121 modified |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**The sk-code drift gate went from 3,513 errors to 0, and all three guards passed together for the
first time.** Two changes to the verifier did almost all of it. It now asks git what the scan root
actually contains, because a walk of the working tree is not a walk of the repository: `barter/`,
`.worktrees/` and `tmp/` are gitignored, and 3,275 errors lived there. And it recognises JSONL,
because 217 files it called malformed were line-delimited event captures that parse perfectly — all
217 checked, none broken. Twenty-one real errors survived both fixes and were repaired in the files:
module headers on four ambient `.d.ts` files and eight spec-packet runners, shebangs on five Python
scripts, strict mode on four shell scripts.

**The dispatch hard-rule engine stopped lying about what it enforces.** Eleven rules across four
packets named checks that did not exist, several at `severity: error`, silently doing nothing. The
CI guard that should have caught this listed two packets by name — `cli-opencode` and
`cli-claude-code`, which were the only two with no problem. It now enumerates the directory. Of the
eleven, the four `command-v-*` availability rules are implemented as PATH lookups; the stdin rule,
which recognised only `opencode run` while five packets declared it, now covers every headless CLI
shape; and the seven that cannot be answered from a command string were removed from `hard_rules`,
leaving their prose and their real runtime enforcement untouched.

**The 252 playbook failures were a vocabulary mismatch, not missing content.** All 84 snippets
already carried the command, evidence, verdict and triage the validator wanted — under the headings
`### Pass / Fail` and `### Failure Triage`. Those two words were aligned, and one sentence reworded
because the overclaim guard bans the ordinary word "classify" that appeared in an operator
instruction. 98 of 98 cells now pass.

**Two documented facts that were simply wrong were corrected**: `hooks/README.md` listed a vitest
suite in a `node --test` command line, and a test asserted `cli-claude-code` had one hard rule when
it has carried two since its permission-mode rule landed.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Measure, fix the producer, re-measure, then fix what genuinely remains. The order was the whole
method: fixing files first would have "repaired" thousands that were never wrong, and would have
left the scanner free to accuse the next batch.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

**Tracked-only, not a directory blocklist.** Excluding `barter/` and `.worktrees/` by name would
have worked today and rotted at the next vendored drop. Asking git is the definition of repository
content, and it degrades cleanly: outside a checkout the helper returns `None` and the verifier
behaves exactly as before, so it stays usable as a standalone tool.

**The gate was narrowed, so the arithmetic is the evidence.** Making a red gate green by trimming
its scope is the obvious way to fake this work. AC-002 exists to make that impossible to hide:
3,275 untracked + 217 false + 21 fixed = 3,513, with no tracked file exempted.

**Two 066 findings were withdrawn rather than acted on.** `sync-agents-pi.cjs` and `.pi/agents/`
were recorded as dead code; they are not. `/doctor` checks the mirror, it reports in sync, and
`.pi/SYNC.md` already described it as a deliverable with no installed consumer. Only its references
to the retired package were stale. Likewise `repair-derived.cjs` refusing `.opencode/specs/...` is
deliberate confinement with a written rationale — but it refused the exact path the operating rules
name, so the alias was added while real-path containment stayed intact. Reporting a finding as
overstated is part of closing it.

**Seven hard rules were removed rather than given weak implementations.** A self-invocation guard
cannot be answered from a command string, and inventing something that looks like enforcement is
worse than saying it is prose. The runtime guard that actually enforces it is untouched.

**Retiring the agent mirror was left open on purpose.** No surface reads `.pi/agents/`, but the
generator is CI-wired and working; deleting it is a product decision, not a lint cleanup, and it is
recorded in `spec.md` §9 with its rollback rather than taken unilaterally.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| sk-code drift gate | **all 3 guards PASSED**, `Errors: 0`, 20,798 files scanned — first clean run |
| Error attribution | 3,275 untracked + 217 JSONL + 21 fixed = 3,513, no tracked file exempted |
| JSONL hypothesis | 217/217 valid JSONL, measured across every accused file |
| Playbook validator | **PASS**, 98/98 cells, 0 missing / orphan / duplicate |
| sk-doc document validator | Renamed snippet `VALID`, 0 issues |
| Hook suites | node:test **23/23** · dispatch-audit vitest **74/74** · pi hook vitest **34/34** |
| Declared-check audit | **0 unregistered**, down from 11 |
| Shell + Python syntax | `bash -n` 4/4 · `py_compile` 5/5 |
| Agent mirror | `sync-agents-pi.cjs --check` PASS, 12 agents in sync |
| `repair-derived.cjs` | Accepts `.opencode/specs/...`; still refuses `.opencode/skills` |
| Pre-existing dirty files | 0 malformed JSON; `template-structure.vitest.ts` 8/8 |
| `validate.sh --strict` | `RESULT: PASSED`, `Errors: 0` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

**1,398 drift warnings remain and are not failures.** They are style advisories on tracked files —
missing `'use strict';` in `.cjs` scripts, absent Python docstrings in test fixtures. The verifier
treats warnings as non-blocking by design and prints that it is doing so. Turning them into errors
is a policy change nobody asked for; fixing them silently would touch hundreds of files across
packets this work has no claim on.

**The widened stdin rule changes behavior for five packets.** They declared the rule and never had
it fire. It is `severity: warn` everywhere, so the effect is an advisory on a dispatch missing
`</dev/null` — which is the documented cause of a silent indefinite hang — and never a denial. Two
existing hook tests asserted "no result at all" where they meant "not blocked"; both were corrected
and one new case pins the distinction.

**The availability checks now refuse a dispatch whose binary is absent.** That is the rule's stated
intent and previously never happened. They are fail-open by construction: no PATH, an unreadable
directory or any thrown error resolves to a pass, so only a conclusive absence refuses.

**Open by choice:** retiring `sync-agents-pi.cjs`, the 12 `.pi/agents/` mirrors and the `PI-010`
scenario. Nothing reads them; nothing about them is broken. It needs an operator yes.
<!-- /ANCHOR:limitations -->
