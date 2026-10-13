---
title: "Implementation Summary: Example-tolerant drift guards"
description: "The sk-code router-sync and doc-claims drift guards now pass after an example surface is removed, with unchanged results on the full hub, four tests, one sk-code-opencode release and a five-iteration review."
trigger_phrases:
  - "example-tolerant drift guards implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/003-example-tolerant-drift-guards"
    last_updated_at: "2026-10-13T06:45:00Z"
    last_updated_by: "builder"
    recent_action: "Built, reviewed and released 1.2.4.0"
    next_safe_action: "Operator review and merge of worktrees/126-drift-guard-tolerance into main"
    blockers: []
    key_files:
      - ".skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs"
      - ".skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-doc-claims.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-026-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Example-tolerant drift guards

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-example-tolerant-drift-guards |
| **Completed** | 2026-10-13 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The sk-code drift guards now describe whatever surfaces the tree ships. Router-sync check 2 reads only the surface packets present on disk, check 3 skips archived route gold for a mode the leaf manifest no longer declares, and check 1a starts its prose scan at the first `## N. <NAME> MAP` heading. Doc-claims takes the surface count from the `surface` modes in `mode-registry.json`, so "two surfaces" passes on a two-surface hub and a stale count fails.

One checklist line, "mirror it across all three surfaces", counts runtime agent directories rather than hub surfaces. The widened count rule flagged it in a two-surface copy, so it got one row in the guard's existing allowlist. The review then added a named problem for a registry that does not parse, and moved two docs off the old three-surface wording.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs` | Modified | Existence filter, archived-gold skip, first-map anchor |
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-doc-claims.cjs` | Modified | Registry-derived surface count, one allowlist row, contained registry read |
| `.skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify-router-sync.test.cjs` | Modified | T1 to T3; the fixture root now sits where the guard looks for the repository root |
| `.skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify-doc-claims.test.cjs` | Modified | T4, a registry in the fixture hub, the unreadable-registry case |
| `.skilled/skills/sk-code/sk-code-opencode/SKILL.md`, `changelog/v1.2.4.0.md` | Modified, Created | sk-code-opencode 1.2.4.0 and the surfaces sentence |
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/README.md`, `scripts/README.md` | Modified | The surfaces rule described by the registry |
| `.hermes/skills/sk-code-opencode/SKILL.md` | Regenerated | Hermes copy in sync |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash made every edit outside this folder. Devin's daily quota was still exhausted (`resource_exhausted`), so every dispatch ran through cli-pi on `llmgateway/deepseek-v4.1-flash` at max thinking, one literal brief per change. Each diff was read and each test was rerun against the prior script before it was accepted.

Commits: `b6eef4ebbb` the four guard changes, their tests and the release; `1f0ca7deea` the review fixes; then this folder's docs and review artifacts. The pre-commit gate raised the two scripts READMEs' own versions.

Copy runs used a base copy under the session scratchpad: `.skilled` without `node_modules` (linked to the worktree), `.opencode`, `.github`, the two root docs and only `specs/sk-doc/z_archive/019-skill-routing-refactor/`. The removal recipe of research F84 ran from a scratchpad script. Every copy was deleted afterwards.

### Ledger

| ID | Outcome | Proof |
|----|---------|-------|
| P10-1 | Pass | `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` in the worktree exits 0 and prints `run-all-drift-guards: all 4 guards PASSED, 278 non-blocking warning(s)`. Every per-check line is PASS, as in the baseline; the one text change is the surfaces title, now `surface counts match mode-registry.json` |
| P10-2 | Pass | `node .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs` in the removal copy exits 0 and prints `router-sync: 5/5 checks passed`. The prior guard in the same copy exits 1 with `3/5`: check 2 `threw: ENOENT ... sk-code-webflow/SKILL.md`, check 3 the webflow and obsidian gold ids |
| P10-3 | Pass | `node .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs` in that copy with `## 4. WEBFLOW MAP` and its section removed exits 0 and prints `router-sync: 5/5 checks passed`; the prior guard prints `ROUTER.md section anchors not found (start=-1, end=15120)` for check 1a |
| P10-4 | Pass | `node verify-doc-claims.cjs --root <copy>/.skilled/skills/sk-code --checks surfaces` in a copy whose registry has two surface modes and whose docs say "two surfaces" exits 0 and prints `PASS check surfaces: surface counts match mode-registry.json`; the prior guard exits 1 with three `two-surface wording` problems |
| P10-5 | Pass | `node .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs --checks 2` prints the same two lines in the pristine copy and in the worktree (`diff` reports them identical): `PASS check 2: surface RESOURCE_MAP equals the children union plus the parent tier` |

Each test was run alone with `node --test --test-name-pattern`, first against the script as it stood before its change, then after.

| ID | Test | Before | After |
|----|------|--------|-------|
| T1 | leg 2 passes when an example surface packet is not on disk | before: exit 1 | after: exit 0 |
| T2 | leg 3 skips archived gold for a mode the manifest no longer declares | before: exit 1 | after: exit 0 |
| T3 | leg 1a scans the prose maps from the first map heading when the Webflow map is gone | before: exit 1 | after: exit 0 |
| T4 | a registry with two surface modes accepts two-surface wording and reports three | before: exit 1 | after: exit 0 |

### Review findings

A five-iteration `/deep:review :auto` ran over `b6eef4ebbb` on cli-pi DeepSeek V4.1 Flash at max effort: verdict PASS with advisories, 0 P0, 0 P1, 9 P2. Each finding was checked against the code before it was fixed or rejected. Artifacts are in `review/`.

| ID | Severity | Outcome | Proof or reason |
|----|----------|---------|-----------------|
| RV-1 | P2 | Fixed | R1-P2-001, an unreadable registry crashed doc-claims with no check line. The read is now contained; the new test exits 1 on the prior script and 0 now (`1f0ca7deea`) |
| RV-2 | P2 | Rejected | R1-P2-002, "one surface" wording is unmatched. Live sk-code docs use "one surface" five times in non-count senses ("picks one surface"), so matching it would fail the operator's tree |
| RV-3 | P2 | Rejected | R2-P2-001, symlinked docs escape the directory walks. The walks predate this phase and are unchanged by it; doc-claims documents the skip on purpose |
| RV-4 | P2 | Fixed | R3-P2-001, `spec.md` Files to Change now lists the scripts READMEs and the generated Hermes copy |
| RV-5 | P2 | Fixed | R3-P2-002, the packet SKILL.md and `scripts/README.md` now describe the surfaces rule by the registry, and the Hermes copy is regenerated (`1f0ca7deea`) |
| RV-6 | P2 | Fixed | R3-P2-003, AC-006 now cites the sk-code doctor 13d check |
| RV-7 | P2 | Rejected | R4-P2-001, no unit test for the allowlist row. The live wrapper, the completion gate, fails loudly if the row stops matching, and a fixture copying the live line would mirror the implementation |
| RV-8 | P2 | Rejected | R4-P2-002, the count words appear in a map and a regex. Two adjacent instances with no live defect; the restraint rule waits for a third |
| RV-9 | P2 | Rejected | R5-P2-001, a map heading removed with its body kept is skipped. That state needs a half-done edit the documented removal never makes, and a stricter anchor would break the removal tolerance this phase adds |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The count rule matches plural number words from two to ten | Plural forms are count claims; singular "one surface" appears in live docs in other senses |
| One allowlist row instead of narrowing the rule | The guard's own comment asks for a row rather than a weaker rule, and the line is true about runtime directories |
| A registry with no surface modes is not special-cased | Any count claim then fails, which is the right answer for such a hub |
| The scripts README row changed with D4 | It described the rule as "matches the three-surface hub", which the change made false |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/skills/sk-code/sk-code-opencode/scripts/tests/` | 23 pass, 0 fail |
| `run-all-drift-guards.sh` | Exit 0, all 4 guards PASSED, 278 non-blocking warnings (baseline 278) |
| `parent-skill-check.cjs .skilled/skills/sk-code` | Exit 0, `13d-packet-version: 5 mode packet(s) match their newest changelog entry` |
| `sync-skills-hermes.cjs --check` | 68 copies in sync |
| Changelog and README `validate_document.py` | 0 issues |
| `/deep:review :auto`, 5 iterations | PASS with advisories; 4 P2 fixed, 5 rejected with reasons |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A user surface outside the two built-in lists is checked only through the owned-leaf branch of check 2.** Nothing fails for it, but union equality is not checked (research F96).
2. **The doc-claims `paths` check still lists the dead links a removal leaves.** The user fixes them, as the guide says; it stays out of this phase's scope.
3. **Review dispatches ran pi with `--no-extensions` through a scratchpad PATH shim.** The global pi extension links into the main checkout and collides with the worktree's copy, which stops every pi start in a worktree.
<!-- /ANCHOR:limitations -->
