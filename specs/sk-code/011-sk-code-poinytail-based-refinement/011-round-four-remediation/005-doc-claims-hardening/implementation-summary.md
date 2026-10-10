---
title: "Implementation Summary"
description: "The sk-code documentation claim checker now reports stale path-shaped link labels and dead anchors, leaves conditional loading bullets alone and answers a missing --root with a usage error."
trigger_phrases:
  - "doc claims hardening implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/005-doc-claims-hardening"
    last_updated_at: "2026-10-10T18:30:00Z"
    last_updated_by: "sonnet-verifier"
    recent_action: "Applied the review fixes and reran every goal criterion"
    next_safe_action: "Orchestrator runs the Hermes write and the sk-code re-mint, then commits"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-doc-claims-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-doc-claims-hardening |
| **Completed** | 2026-10-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The sk-code documentation claim checker now catches the stale link labels and dead anchors that passed unseen, stays quiet on conditional loading bullets and fails cleanly on a bad `--root`. The OpenCode guardrails text no longer carries the four semicolons the voice scan counted as hard blockers.

### Phase 5: doc-claims-hardening

`verify_doc_claims.cjs` gained four behaviors. A `--root` that is not a directory prints the usage line with `--root is not a directory: <path>` and exits 2, the same code the checker uses for a bad `--checks` value. A path-shaped link label that does not start with `./` or `../` passes only when it ends its own existing target path or names a real file from the doc's packet, the hub or the doc's folder. Link targets and backticked paths with a `#anchor` are resolved against the target file's headings by GitHub's slug (outside fenced code, with `-1` and `-2` suffixes for repeats) and against explicit `<a id>` and `<a name>` values. A `### Surface-aware loading` bullet that contains `when`, `if`, `unless`, `only` or `matched` is no longer an every-route claim, and the ALWAYS row is never skipped.

Four new test cases prove each behavior, the guardrails text is now free of semicolons, and the packet moves to 1.2.1.0 with a changelog entry.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_doc_claims.cjs` | Modified | Root check, label check, anchor resolution, condition rule |
| `.skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify_doc_claims.test.cjs` | Modified | Four new test cases, 10 in total |
| `.skilled/skills/sk-code/sk-code-opencode/references/shared/workflow-guardrails.md` | Modified | Four semicolons rewritten as sentence breaks |
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/README.md` | Modified | Checker row names link labels and anchors |
| `.skilled/skills/sk-code/sk-code-opencode/SKILL.md` | Modified | Version 1.2.0.0 to 1.2.1.0 |
| `.skilled/skills/sk-code/sk-code-opencode/changelog/v1.2.1.0.md` | Created | Changelog entry |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash built the work as 21 single-edit units from the planner's dispatch file, each checked on its own. A Sonnet verifier then reran every task and goal criterion, ran the new test file against the HEAD checker (pass 6, fail 4, each failure one of the four new cases), probed the anchor and label rules on a throwaway hub and read the full diff. Nothing was committed. The Hermes generator, the compiled-route re-mint and the other orchestrator steps were not run.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Anchors use GitHub's heading slug | `validate_document.py` already assumes it and no repo link validator resolved anchors before |
| A label passes when it ends its own target or names a real file in the packet, hub or folder | A short label over another packet's file is legitimate, so only a label that names no real file is stale |
| Conditional words apply to files and globs alike, and the ALWAYS row is never skipped | The live `ROUTER.md` bullets state their condition with these words and the one every-route bullet uses none |
| A bad `--root` exits 2 | It reuses the code the checker already gives a bad `--checks` value |
| Guardrails semicolons become full stops with no word change | The content stays a faithful move and the voice scan reaches 0 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Goal 1: `node --test verify_doc_claims.test.cjs` | PASS: exit 0, `tests 12`, `pass 12`, `fail 0` after the review fixes added two cases. Before them the file had 10 tests, and the HEAD checker gave pass 6, fail 4 on those |
| Goal 2: `verify_doc_claims.cjs --root /nonexistent-dir` | PASS: exit 2, one stderr line, `usage: verify_doc_claims [--root <hub dir>] [--checks paths,names,surfaces,tiers] (--root is not a directory: /nonexistent-dir)` |
| Goal 3: checker over `scratch/repro-fixture` | PASS: exit 1, `doc.md:3` label, `doc.md:4` link anchor, `doc.md:5` anchor and `PASS check tiers` |
| Goal 4: `grep -c 'sk-code-opencode/'` on checker output, `grep -c ';'` on the guardrails text | PASS: 0 and 0. The live checker prints `doc-claims: 4/4 checks passed`, exit 0, now that children 002 and 004 have landed their fixes |
| Goal 5: `validate.sh --strict` | PASS: `RESULT: PASSED` |
| Drift umbrella | `run-all-drift-guards: all 4 guards PASSED`, exit 0 |
| Markdown checks | `validate_document.py` Total issues 0 on all four files. Guardrails hard blockers 4 to 0, SKILL.md stays 25, changelog 0 |
| Doctor and leaf manifest | `PASS: 13d-packet-version`, `OK: parent-skill-check`, `leaf-manifest.json OK` |
| Hermes `--check` | DRIFT sk-code-opencode, expected until the orchestrator regenerates |
| Scope | `git status` over sk-code-opencode shows exactly the six files in Files Changed |

**Review result.** Every Known Limitation 1 to 5 from round three is fixed and proven. The verifier's cosmetic unit R001 and the parallel reviewer's eight units R01 to R08 (link syntax inside a code span is no longer checked, an elided `.../` label is skipped, fences nest by character and length, `--root` with no value gets the usage error, emphasis is stripped from heading slugs, Setext and indented headings define anchors, and two new test cases) were applied as T050 to T060. Three stale OpenCode labels were also fixed (T061 to T063).

**Orchestrator steps, 2026-10-10.** The Hermes generator wrote 6 of 70 copies, and `sync-skills-hermes.cjs --check` prints `PASS: 70 Hermes skill copies in sync`. The sk-code manifest was re-minted and copied over its archive copy (`cmp` exit 0), and `compiled-route-guard.cjs` prints `sk-code fresh` and `All hubs fresh or excused`. The trigger index was rebuilt, and its `--check` exits 0.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Heading slugs follow the common GitHub rules only.** ATX, indented and Setext headings define anchors, and emphasis is stripped. Rarer forms, such as HTML headings or explicit anchor tags, are not read.
<!-- /ANCHOR:limitations -->

---
