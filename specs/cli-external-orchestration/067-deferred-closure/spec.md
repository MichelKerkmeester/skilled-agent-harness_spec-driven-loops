---
title: "Feature Specification: Close every deferred and pre-existing failure the Pi carve-out surfaced"
description: "Packet 066 recorded six adjacent findings and left two repo-wide gates red. The operator directed that nothing stay deferred, so this packet fixes the producers: a drift verifier scanning trees that are not repository content, a JSON check calling valid JSONL malformed, a hard-rule guard that scanned two of six packets, and a documented test command that cannot run."
trigger_phrases:
  - "deferred closure"
  - "alignment drift gate green"
  - "jsonl false positive"
  - "hard rule check registration"
  - "playbook verdict triage headings"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/067-deferred-closure"
    last_updated_at: "2026-09-08T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "All six findings closed; three repo-wide gates green"
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
    answered_questions:
      - "Operator directed on 2026-09-08 that nothing stay deferred, including pre-existing failures"
---
# Feature Specification: Close every deferred and pre-existing failure the Pi carve-out surfaced

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-08 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Packet 066 shipped its carve-out and recorded six adjacent findings it was not scoped to fix. Two
repo-wide gates were red at the time and had been for long enough that one of them carried a written
carve-out telling readers to ignore it. The operator directed that nothing stay deferred.

Every finding turned out to be a producer emitting a false or unreachable claim, not a backlog of
real defects:

| Finding | What was actually wrong |
|---------|------------------------|
| sk-code alignment-drift gate red, 6,248 findings | The verifier walked the whole working tree. 4,515 findings were in `barter/`, `.worktrees/` and `tmp/` — all gitignored, none of them repository content |
| 217 `JSON-PARSE` errors | Every one is valid JSONL: line-delimited session-event captures with a `.json` extension. The checker reported them as malformed. All 217 verified, zero genuinely broken |
| 252 playbook validator failures across all six `cli-*` packets | The 84 snippets carry all required content under different heading words (`### Pass / Fail`, `### Failure Triage`), and the overclaim guard bans the ordinary word "classify" used in an operator instruction |
| 11 hard rules declaring checks that do not exist | The CI guard meant to catch this hardcoded two packets — `cli-opencode` and `cli-claude-code`, the only two that were clean. Four packets went unscanned, several rules at `severity: error` silently doing nothing |
| `dispatch-audit.test.mjs` fails under `node --test` | It is a vitest suite. `hooks/README.md` lists it in a `node --test` command line; `dispatch/README.md` already documents it correctly |
| A stale assertion in `dispatch-rule-checks.test.mjs` | It asserted `cli-claude-code` has one hard rule; the packet has carried two since its permission-mode rule was added, so the assertion was failing rather than guarding |

Two further 066 findings proved to be **overstated rather than real**, and are corrected here rather
than acted on:

- `.pi/agents/` and `sync-agents-pi.cjs` are not accidental dead code. `.pi/SYNC.md` already
  documented the mirror as a deliverable with no installed consumer, the generator is wired into the
  `/doctor` runtime-mirror check, and it reports in sync. Only its references to the retired package
  were stale.
- `repair-derived.cjs` refusing `.opencode/specs/...` is deliberate confinement with a written
  rationale, not a bug. It was still wrong to refuse the exact path the operating rules name.

### Purpose

Every gate that can be run is green because the thing it measures is correct, not because it was
narrowed to pass; and no rule, test command or document claims something that is not true.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **The drift verifier**: scan repository content (files git tracks) rather than the working tree, and recognise JSONL.
- **The 21 real drift errors** that survive those two fixes, fixed in the files themselves.
- **The 84 playbook snippets**: heading words aligned to the validator, one sentence reworded.
- **The dispatch hard-rule engine**: implement the four availability checks, widen the stdin rule to every headless CLI, remove the seven rules that cannot be answered from a command string, and make the CI guard scan every packet.
- **Two wrong or stale test facts**: the `hooks/README.md` command and the drifted assertion.
- **Stale references to the retired package** in `.pi/SYNC.md`, the spec-kit pi README and one code comment.
- **`repair-derived.cjs`**: accept the `.opencode/specs` alias without weakening the real-path guard.

### Out of Scope

- **Deleting `sync-agents-pi.cjs`, `.pi/agents/` or the `PI-010` scenario.** Not dead: `/doctor` checks the mirror and it is in sync. Removing a working, CI-wired capability is a product decision needing an explicit yes, not a lint cleanup.
- **The 1,398 remaining drift warnings.** Warnings are non-blocking by design and the verifier says so; they are style advisories on tracked files, not failures.
- **`.opencode/logs/cli-dispatch-audit.log`.** Append-only history of dispatches that really ran.
- **Another session's uncommitted work** in the tree at session start (spec-kit template examples, advisor fixtures). Verified well-formed and passing their own suite; not this packet's to commit or revert.
- **The self-invocation guards of `cli-codex`, `cli-cursor` and `cli-devin`.** Their frontmatter claim is removed because it was never enforced there; the runtime guard that does enforce it is untouched.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-code-opencode/assets/scripts/verify_alignment_drift.py` | Modify | `tracked_paths()` + JSONL recognition; both walks consult the tracked set |
| `sk-code-opencode/SKILL.md` | Modify | Replace the interim-backlog carve-out with the real contract: wrapper rc 0 |
| `hooks/dispatch/lib/dispatch-rule-checks.mjs` | Modify | Four `command-v-*` checks, widened stdin shapes |
| `hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | Modify | CI guard enumerates packets; new coverage; stale assertion fixed |
| `hooks/README.md` | Modify | Split the vitest suite out of the `node --test` line |
| `hooks/dispatch/pi/dispatch-preflight-lint.test.ts` | Modify | Two cases meant "not blocked"; add the advisory case |
| `cli-{codex,cursor,devin,pi}/SKILL.md` | Modify | Remove 7 unenforceable `hard_rules` entries |
| 84 × `manual-testing-playbook/**/stress|fanout-stress/*.md` | Modify | `### Verdict`, `### Triage`, one reworded sentence |
| 21 files (4 `.d.ts`, 8 `.ts`, 5 `.py`, 4 `.sh`) | Modify | Module headers, shebangs, strict mode |
| `.pi/SYNC.md`, `system-spec-kit/runtime/cli/pi/README.md`, `sync-agents-pi.cjs` | Modify | Retired-package references corrected |
| `system-spec-kit/runtime/cli/spec/repair-derived.cjs` | Modify | Accept the `.opencode/specs` alias; real-path containment unchanged |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The sk-code drift gate exits 0 on a clean tree, with no suppression of anything this repository authors |
| REQ-002 | No check reports a valid file as malformed |
| REQ-003 | The playbook package validator passes for every cell |
| REQ-004 | Every `check:` a SKILL.md declares resolves to a registered check, enforced by a guard that scans all packets |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Every documented test command runs the suite it names |
| REQ-006 | No document names the retired package as a live consumer |
| REQ-007 | Widening a rule to five more packets does not newly block any dispatch |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `run-all-drift-guards.sh` reports all 3 guards PASSED with `Errors: 0`.
- **SC-002**: `validate-playbook-package.cjs` reports PASS for 98/98 cells.
- **SC-003**: Every hook suite passes under the runner its own README names.
- **SC-004**: Zero declared checks are unregistered, proven by a guard that fails if a packet is added and left unscanned.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Narrowing the scanner hides real findings | High — a green gate that measures nothing | Tracked-only removes untracked content, never a tracked file. The 21 tracked errors were fixed, not exempted |
| Risk | Widening the stdin rule blocks working dispatches | Medium | The rule is `severity: warn` in all six packets; a violation advises and never denies. Proven by the new hook case |
| Risk | The availability checks refuse a valid dispatch | Medium | Fail-open by construction: refuse only when PATH is readable and the binary is conclusively absent |
| Risk | Adding `set -uo pipefail` to a sourced script changes the caller | Medium | Every consumer sets it before sourcing, so it is a runtime no-op; verified by reading each caller and `bash -n` |
| Risk | Removing hard rules reads as removing enforcement | Medium | The 7 removed rules never fired; their prose and the runtime guard are untouched |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Honesty

- **NFR-H01**: A gate passes because its subject is correct, never because its scope was trimmed to exclude the failure.
- **NFR-H02**: A finding that proves overstated is corrected in the record rather than quietly dropped.

### Maintainability

- **NFR-M01**: Each fix lands in the producer of the wrong claim, so the same class cannot recur file by file.
- **NFR-M02**: The guard that failed to catch the rot enumerates its subjects instead of listing them.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Scanner scope

- Run outside a git checkout: `tracked_paths()` returns `None` and the verifier walks the tree as before, so it stays usable as a standalone tool.
- A tracked file inside an otherwise ignored directory is still scanned, because the rule is per-file, not per-directory.

### JSONL

- A single-line file that fails the whole-document parse is still reported. Only two or more lines that each parse independently count as JSONL, so a truncated document cannot pass as one.

### Availability checks

- No `PATH` in the environment: pass. A guard that cannot see PATH must not invent a refusal.
- The command does not invoke the binary: pass, the rule is not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Whether to retire `sync-agents-pi.cjs`, the `.pi/agents/` mirror and the `PI-010` scenario now that no surface reads them. Deliberately not decided here: the mirror works and `/doctor` checks it, so removing it is a product call needing an explicit yes. To undo if that yes comes: delete the generator, the 12 tracked mirrors, the scenario, and the two `/doctor` entries that name them.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Closure Gate**: See `acceptance-criteria.md`
- **Origin**: `../066-pi-self-dispatch-and-subagents-retirement/` recorded every finding this packet closes
<!-- /ANCHOR:related-docs -->
