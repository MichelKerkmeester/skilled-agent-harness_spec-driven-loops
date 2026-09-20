---
title: "Implementation Plan: Close every deferred and pre-existing failure the Pi carve-out surfaced"
description: "Fix each producer of a false claim rather than the files it accused, in an order that keeps every intermediate state honest."
trigger_phrases:
  - "deferred closure plan"
  - "drift verifier tracked only"
  - "hard rule guard generalisation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/067-deferred-closure"
    last_updated_at: "2026-09-08T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "All workstreams shipped and verified"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-067-deferred-closure"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Close every deferred and pre-existing failure the Pi carve-out surfaced

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

Six findings, one shape: a producer emitting a claim that is not true, and a pile of accused files
downstream of it. The whole plan follows from refusing to fix the pile.

The drift gate is the clearest case. It reported 6,248 findings and 3,513 errors, and a note in
`sk-code-opencode/SKILL.md` told readers to measure a packet-scoped delta against it rather than
expect rc 0. Measured by area, 4,515 findings sat in `barter/`, `.worktrees/` and `tmp/` — every one
gitignored. A scan of the working tree is not a scan of the repository, and no amount of editing
those files would have changed that.

### Overview

Measure before touching anything, fix each producer, then fix only what genuinely remains. The
order matters because every step changes the measurement the next one depends on.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- Every finding classified by measurement, not by reading. Done: counts per area and per rule.
- Each classification separates "the checker is wrong" from "the file is wrong".

### Definition of Done

- All three drift guards PASS with `Errors: 0`.
- The playbook validator passes for every cell.
- Every hook suite passes under the runner its README names.
- No tracked file was exempted to achieve any of the above.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Fix the producer, then re-measure. Applied five times:

| Producer | Wrong claim | Fix |
|----------|-------------|-----|
| `iter_code_files` / `check_router_paths` | Working tree = repository | Consult `git ls-files`; `None` outside a checkout keeps the tool standalone |
| `check_json` | JSONL is malformed JSON | Recognise it: two or more lines that each parse |
| Playbook snippets | Content missing | It was present under different heading words; align the words |
| The CI guard | Two hardcoded packets stand for six | Enumerate `cli-*` and assert the count |
| `hooks/README.md` | A vitest suite runs under `node --test` | Split the command |

### Key Components

| Component | Change |
|-----------|--------|
| `verify_alignment_drift.py` | `tracked_paths()` helper; both walks filter through it; `is_jsonl()` guard in `check_json` |
| `dispatch-rule-checks.mjs` | `binaryOnPathCheck()` factory + four registrations; `HEADLESS_DISPATCH_SHAPES` replaces the single opencode regex |
| `dispatch-rule-checks.test.mjs` | Guard enumerates packets; stdin and availability coverage; drifted assertion replaced by an id assertion |
| Four `cli-*/SKILL.md` | Seven `hard_rules` entries removed |
| 21 source files | Headers, shebangs, strict mode |
| 84 playbook snippets | Two headings, one sentence |

### Data Flow

The drift wrapper passes `--root REPO_ROOT`; the verifier now asks git what that root actually
contains before walking it. Nothing else in the invocation changes, so the wrapper and its three
guards keep their existing contract.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Speaks the old contract as | Handling |
|---------|---------------------------|----------|
| `sk-code-opencode/SKILL.md` | "the wrapper scans the whole repository … report a packet-scoped delta" | Replaced; the gate now requires rc 0 |
| `hooks/dispatch/README.md` | Already correct about the vitest runner | Untouched |
| Runtime recursion guard | Enforces self-dispatch for codex/cursor/devin | Untouched; only the frontmatter duplicate is removed |
| `/doctor` runtime mirrors | Checks `sync-agents-pi.cjs --check` | Untouched and still in sync |
| `.opencode/logs/cli-dispatch-audit.log` | Names the retired package in past dispatches | Untouched; it records what ran |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Detail in `tasks.md`. Ordering constraint: measure → fix producers → re-measure → fix the residue.
Fixing files before the producers would have "fixed" 6,227 files that were never wrong.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Check | Proves |
|-------|--------|
| `run-all-drift-guards.sh` | REQ-001; all three guards, not just the one that was red |
| Per-area error counts before and after | The reduction came from the scanner's scope and the JSONL fix, not from exempting tracked files |
| `bash -n` on each edited shell script, `py_compile` on each Python one | The 21 mechanical fixes did not break a file |
| `validate-playbook-package.cjs` | REQ-003 |
| `validate_document.py` on an edited snippet | The heading rename did not break the doc contract it also has to satisfy |
| Packet-enumerating CI guard | REQ-004, and it fails if a seventh packet appears unscanned |
| Three hook suites under their own runners | REQ-005, REQ-007 |
| `sync-agents-pi.cjs --check` | The corrected comment did not change generator output |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status |
|------------|--------|
| `git ls-files` at the scan root | Present; absence degrades to the old behavior by design |
| Consumers of the sourced pipeline scripts | Read: each sets `set -uo pipefail` before sourcing, making the addition a no-op |
| Operator decision on retiring the agent mirror | Open by choice; recorded in `spec.md` §9 with its rollback |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

**To undo this: `git revert <commit>`.** Every change is a tracked working-tree edit; no migration,
no generated state, nothing sent anywhere. One file was deleted in the predecessor packet, none here.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
measure ──> verifier fixes ──> re-measure ──> fix the 21 real files ──> drift gate green
        └──> playbook headings ──> playbook gate green
        └──> hard-rule engine ──> CI guard generalised ──> hook suites green
```

The verifier fixes must land before the file fixes: the 21 real errors are only identifiable once
the 3,492 false ones stop drowning them.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Workstream | Files | Shape |
|------------|-------|-------|
| Drift verifier | 2 | Small, high leverage: 3,492 of 3,513 errors |
| Real drift errors | 21 | Mechanical, individually verified |
| Playbook snippets | 84 | One scripted, uniform rename |
| Hard-rule engine | 7 | Behavior change; warn-only widening |
| Docs and references | 5 | Wording |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-change Checklist

- Findings counted per area and per rule before the first edit.
- The JSONL hypothesis verified across all 217 files, not sampled.
- Each shell consumer read before adding strict mode to a sourced file.

### Rollback Procedure

1. `git revert <commit>` restores the verifier, the engine, the snippets and the 21 files together.
2. Re-run the three guards and confirm the previous counts return.

### Data Reversal

None. No persisted state and no deletions in this packet.
<!-- /ANCHOR:enhanced-rollback -->
