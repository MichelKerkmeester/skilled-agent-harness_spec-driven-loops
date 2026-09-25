---
title: "Implementation Summary: Pre-v4 spec folder upgrade path"
description: "One command with no language model brings a v3.x specs tree to a pass under v4 validate.sh --strict. It fills missing frontmatter, runs the existing repair tools on each failing packet and records what they cannot clear in upgrade-baseline.json, which the validator reports as warnings while any new finding stays an error."
trigger_phrases:
  - "pre-v4 upgrade summary"
  - "upgrade-legacy results"
  - "upgrade-baseline evidence"
  - "recorded findings verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/066-pre-v4-spec-upgrade"
    last_updated_at: "2026-09-25T06:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "Closed out: final proof reruns, full suites and the gate review passed"
    next_safe_action: "Operator approves the commit by explicit path"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs"
      - ".skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/graph/backfill-graph-metadata.ts"
    session_dedup:
      fingerprint: "sha256:c6679f6b86e214a38bc1e645da23154a59143ed2ebd0c426af200b8570fd6433"
      session_id: "abb8eac5-f92d-4f79-aab2-f81adb6c378b"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 066-pre-v4-spec-upgrade |
| **Completed** | 2026-09-25 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A user upgrading from v3.x now runs one command and their old spec folders pass `validate.sh --strict`. No language model is involved, so the upgrade costs no tokens, and an old finding no longer stops a workflow that reopens an old packet.

### The upgrade command

`runtime/cli/spec/upgrade-legacy.mjs` is a dry run until you pass `--apply`. It validates every packet under the specs roots, then works only on the active packets that fail. For each one it fills the frontmatter keys a spec document lacks without touching a value already there, and names any document whose frontmatter block it cannot read, which it leaves as is. It then runs `heal-spec-docs`, `repair-derived` and `migrate-generated-json` on that packet alone, validates again and writes every finding still standing into the packet's `upgrade-baseline.json`. A packet that already passes is never touched. Copies of spec trees inside `research/`, `review/` and `context/` are skipped. With `--include-archive`, archived packets are recorded but never rewritten. When a first validation cannot be read, `--apply` names the reason and writes nothing. When the packets still live in `.opencode/specs`, where v3 kept them, the command stops before any write and prints the move that puts them in `specs/`.

### Recorded findings in the validator

The validator reads `upgrade-baseline.json` and reports a listed finding as a warning marked `(recorded in upgrade-baseline.json)`. Everything else stays an error. A detail matches after line numbers are stripped, so a finding survives lines shifting above it. Each copy of a repeated detail has to be listed, so a new copy of an old finding still fails. The five rules a re-derive clears are never relaxed in an active packet, because their text repeats word for word each time metadata goes stale.

### A failed re-derive now says so

`backfill-graph-metadata` exits 1 when a folder fails. `repair-derived` used to report such a folder as repaired, and now prints `FAILED`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/cli/spec/upgrade-legacy.mjs` | Created | The upgrade command |
| `runtime/lib/validation/orchestrator.ts` | Modified | Recorded-findings hook in `validateFolder` |
| `runtime/cli/graph/backfill-graph-metadata.ts` | Modified | Exit 1 when a folder fails |
| `runtime/tests/upgrade-baseline.vitest.ts` | Created | Hook tests |
| `runtime/cli/tests/upgrade-legacy.vitest.ts` | Created | Command tests in a throwaway repository |
| `runtime/cli/tests/graph-metadata-backfill.vitest.ts` | Modified | Exit-status tests |
| `runtime/cli/spec/README.md` | Modified | Names the command |
| `.skilled/skills/system-spec-kit/changelog/v4.0.0.1.md` | Created | Release notes for everything since the v4.0.0.0 tag |
| `scratch/harness/` | Modified | Proof runner, scope checks and a v4 packet count |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

MiMo v2.6 Pro wrote every code change through cli-pi, one brief at a time. I read each diff and ran each gate myself. A review of the first build found five real defects: duplicate details relaxed by one listing, archive status judged below the caller's root, a first validation that could fail silently, a record step that could hide damage and a frontmatter step that rewrote 803 authored titles on v3.0. Each was fixed with a test. The frontmatter step was rebuilt to fill missing keys only. Checked on all 1,512 v3.0 spec documents, it wrote 132 of them, rewrote no existing block and changed nothing on a second run.

The proof runs then took the command over real trees from the `v3.0.0.0` and `v3.6.0.0` tags, each in a sandbox holding a copy of the skill. That run caught one more defect: the recorder de-duplicated a detail the validator prints twice, so 7 of 170 recorded packets on v3.0 and 2 of 995 on v3.6 still failed. The recorder now lists every copy.

Gathering the closing evidence turned up five more gaps, all closed on 2026-09-25:
- The new command used the old boxed header that the JavaScript style guide bars from new files, and the new hook test had no header at all.
- No test covered a packet still failing after `--apply`, so one was added, after a hand run on a real packet showed the exit 2.
- Two spec edge cases disagreed with the code: silent skipping of unreadable frontmatter, and the refusal of `.opencode/specs`. The operator kept the code in both cases and added a per-file report for the first.
- The proof script named its file lists by tag, so two runs of one tag shared them. The timings show no result was affected.

The gate review then scored the build 86 of 100 and failed it on one P1. The move the command printed for a v3 tree started with `git mv`, which stops on the `specs` link both v3 tags track, so the advice failed for the users it was written for. The printed line now removes the link first, and its test builds that layout, runs the printed line and upgrades the result. The same review found that overlapping `--roots` listed a packet twice, which is fixed with a test. Its other suggestions are listed under Known Limitations.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Record what the tools cannot clear instead of building new transforms | Every active packet passes with recording alone. A transform would edit authored documents for findings that no longer block anything, so none cleared the bar the plan set |
| Fill only missing frontmatter keys, never rewrite one | The shared backfill regenerates whole blocks, and on v3.0 it rewrote 803 authored titles |
| Touch only packets that fail at the start, and record only those | A passing packet is never a target, so a failure there is damage from a step, and recording it would hide the damage |
| Run the TypeScript tools from source through the tsx loader | A source module must not depend on a build that can be stale |
| Judge a packet's place below the first `specs` directory in the repository | A root inside `z_archive` still marks its packets archived, and a research copy's own `specs` folder cannot hide the research folder that holds it |
| Count packets by v4's own rule | The operator set this on 2026-09-24. Folders that hold a `spec.md` without an `NNN-slug` name are not packets to v4 and are left alone |
| Ask for the v4 layout instead of repairing the v3 one | The derivation tools resolve every packet against a top-level `specs/`. With packets only under `.opencode/specs`, or with `specs` linked to it, `description.json` is never written and the packet keeps failing. With the packets moved to `specs/` and a link back, the same packet passes. Both v3 tags track `specs` as a link to `.opencode/specs`, so the printed move removes that link first: the gate review found that a bare `git mv` stops with "destination already exists" there, and the fixed line was measured on a tracked link, an untracked link and no link at all. Widening the shared discovery library for a layout the v4 notes already say to leave was not worth its blast radius. The operator confirmed this on 2026-09-25 and the spec edge case was amended |
| Name each document whose frontmatter cannot be read, and leave it as is | The operator chose this on 2026-09-25 over the spec's first wording, which left the whole folder untouched and exited non-zero. That wording would have kept failing the packets holding 23 such documents on v3.0 and 45 on v3.6 |
| Release notes in a new `v4.0.0.1.md` | The operator chose a new file over editing the released v4.0.0.0 notes, and asked that it cover every change since the tag |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Final proof, v3.0.0.0 with `--include-archive`, 2026-09-25 | PASS. 328 of 328 after `--apply`, from 2: active 170 of 170, archived 158 of 158 |
| Final proof, v3.6.0.0 with `--include-archive`, 2026-09-25 | PASS. 1,890 of 1,890 after `--apply`, from 0: active 995 of 995, archived 895 of 895 |
| Dry run, both final sandboxes | PASS. Exit 1 and the specs manifest unchanged |
| Second `--apply`, both final sandboxes | PASS. Manifest identical |
| Scope, both final sandboxes | PASS. No new `.md` file, no archived file changed apart from its new baseline, no changed status line |
| Negative control, both final sandboxes | PASS. A new broken link in an upgraded packet prints `RESULT: FAILED` with `x SPEC_DOC_INTEGRITY` |
| Unreadable frontmatter on real trees | Reported. 23 `left as is` lines on v3.0 and 48 on v3.6, and every packet holding one still passes |
| Earlier proof runs, 2026-09-24 | PASS. The same results over all four runs, active only and with archives, for both tags |
| Code the final proofs ran | The final file apart from the printed v3 move and the root dedupe, which cannot act in a sandbox with one real `specs/` root |
| v3 move printed on refusal | PASS. Exit 0 and the right layout in four committed throwaway repositories: tracked relative link, tracked absolute link, untracked link, no link. The earlier line failed on the three with a link |
| Failed re-derive on a real packet | PASS. `repair-derived` printed `FAILED ... re-derive: exit 1` and exited 2, and the command exited 2 naming the packet |
| Command tests | PASS. 17 of 17 |
| Hook tests | PASS. 10 of 10 |
| Full `cli` Vitest project | PASS. 1,550 passed, 19 skipped, 0 failed; the baseline was 1,531 passed, and 19 tests are new |
| Full `root` Vitest project | PASS. 1,274 passed, 13 skipped, 0 failed; the baseline was 1,264 passed, and 10 tests are new |
| `tsc --noEmit`, `runtime` and `runtime/cli` | PASS. Exit 0 |
| `eslint` on the changed files | No new error. The 5 unused-variable errors in `orchestrator.ts` are the same at the base commit |
| Comment hygiene on changed code | PASS. The pre-commit checker exits 0 on every changed code, test and harness file |
| `validate.sh --strict` on this packet | PASS. `RESULT: PASSED`, 0 errors, 0 warnings, and all 7 criteria closeable |
| Gate review, mode 4 | PASS on re-run, 90 of 100, no P0 or P1. The first run scored 86 and failed on one P1, the printed v3 move, since fixed and tested as above |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Run it at upgrade time.** The command records whatever fails when it runs. Run again after new work, it would record new mistakes too. The dry run lists every packet a run would record, so check it first.
2. **Folders that are not v4 packets are left alone.** v3.6 holds 28 folders with a `spec.md` but no packet name: backup copies, test fixtures, review scopes and three letter-suffixed names such as `002b-`. The command never touches them. CI validates such a folder only when a pull request changes it, and blocks only when it passed on the base, so they cannot newly block a pull request.
3. **Generated titles can be clipped.** A document with no frontmatter gets the shared library's title, which carries the packet path and is cut from the front past 120 characters.
4. **An empty value stays empty.** A key that is present with no value counts as present, so its finding is recorded instead of filled.
5. **Broken YAML inside a closed block is read line by line.** The library reads a block as key and value lines, so a block with both fences but, say, an unterminated quote counts as readable. Missing keys are then added below the broken line. The authored lines stay byte for byte, and the YAML stays as broken as it was.
6. **The commit hook is stricter.** Because a failed re-derive now exits non-zero, the pre-commit hook blocks a commit whose metadata cannot be re-derived. On 2026-09-24 that held for none of the 4,114 packets in this checkout. `SPECKIT_SKIP_SPEC_REMINT=1` bypasses it.
7. **Packets must sit in `specs/` first.** A tree still under `.opencode/specs` needs one move before the command runs: `rm -f specs && git mv .opencode/specs specs && ln -s ../specs .opencode/specs`. The command prints it.
8. **The proof runs are heavy.** Each tag's sandbox is about 800 MB, and a v3.6 run with archives takes most of an hour.
9. **A baseline only grows, and nothing checks who wrote it.** A later `--apply` over a packet that fails again records the new finding too, a fixed finding is never pruned from the file, and the validator does not read `recordedBy`, so a hand-written baseline can hide a finding. The gate review suggested refusing to extend an existing baseline without an explicit flag. That is the next change worth making.
10. **Smaller review suggestions not taken.**
    - Two definitions are written twice: the never-recorded rule list and the archive test, once in the command and once in the validator. They agree on every case found in this repository.
    - A checkout without `node_modules` fails with a stack trace instead of an install hint.
    - A root inside `z_archive` without `--include-archive` reports `no spec folders found` without naming the flag.
    - A dry run exits 1 both for an unreadable packet and for a failing one.
    - The printed v3 move uses paths relative to the repository root, so pasted from a subdirectory it fails without doing harm.
    - 50 lines of the command run past 100 characters.
<!-- /ANCHOR:limitations -->

---


