---
title: "Goal: Phase 6: relocate-resume-and-preflight"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "relocate resume and preflight goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/006-relocate-resume-and-preflight"
    last_updated_at: "2026-11-14T06:10:59Z"
    last_updated_by: "markdown-agent"
    recent_action: "Applied the plan verification of 2026-11-14 and recorded decision D5"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-relocate-resume-and-preflight"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 6: relocate-resume-and-preflight

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make a rerun of the same relocation map finish any step that stopped the first run, and make the preflight refuse a source that never existed and two spellings of one folder.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The exit status of `relocate.mjs` keeps its three meanings: 0 nothing left to do, 1 work found on a dry run, 2 a refusal or a failed step. Phase 008 amends this for one case of the close. |
| D2 | Every finding is reproduced in a `mktemp` copy before its fix. No run touches the real `specs/` tree. |
| D3 | A finished map still ends on `relocate: nothing to do` with exit 0. |
| D4 | No code comment names a spec path, a packet number or a finding id. |
| D5 | A rerun repeats the close only until the sweep has passed once. A moved packet's own validation verdict is printed by every run that reaches the close and never keeps the map open. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] In a `mktemp` copy where `cite-drift-scan.mjs` exits 1 once, the second `relocate.mjs --apply` of the same map prints `step redirect table (cite-drift-scan --rebuild-redirects): ok` and exits 0, and the third prints `relocate: nothing to do`
- [ ] Where `sweep-track-roots.mjs` exits 1 once, the second `--apply` prints `close sweep-track-roots: ok` and exits 0, and where `validate.sh` fails for the moved packet on every call, run 1 exits 2 and run 2 prints `relocate: nothing to do` and exits 0
- [ ] A two-entry map with one entry already moved by `git mv` and uncommitted exits 0 under `--apply`, and an uncommitted edit outside both entries still exits 2
- [ ] Where the migrate step exits 1 once, the second `--apply` prints `step description identity (migrate-generated-json --only): ok`
- [ ] `relocate.mjs --from zeta/999-typo --to zeta/001-a`, with no such source, exits 2 and prints no `ledger` line
- [ ] On a case-insensitive volume, a map naming `nu/001-a` and `nu/001-A` exits 2 and `git status --porcelain` prints nothing
- [ ] From `.skilled/skills/system-spec-kit/runtime/cli`, `../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli tests/relocate.vitest.ts tests/archive-track.vitest.ts` exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning documents authored | Done | `spec.md`, `plan.md` and `tasks.md` in this folder, 2026-11-14 |
| Suite before any change | Done | `relocate.vitest.ts` and `archive-track.vitest.ts`: `Test Files  2 passed (2)`, `Tests  77 passed (77)`, exit 0, on 2026-11-14 |
| Implementation | Pending | Not started |

### Deviations and findings

| Item | Note |
|------|------|
| Open question: A4 fixture | Reviewer A's fixture held `"parentChain": []` after the failed run. Whether it held `[]` before the move is UNKNOWN. T001 reproduces with a `create.sh` scaffold and records the value before and after. |
| Open question: A5 record of a move | Which record proves a move happened is UNKNOWN until T001 lists the candidates. The plan names a ledger batch and the source path at `HEAD`. Neither covers an untracked source or a move committed between runs. REQ-006 refuses those and names the move back, which T001 runs before the refusal names it. |
| Decided 2026-11-14: what keeps a map open | The plan verifier showed that rerunning the close until it passed would keep a map open forever when a moved packet fails its own validation. The operator took the verifier's default, recorded as D5. Today's behavior for that case stays: run 1 exits 2 and run 2 prints `relocate: nothing to do`. |
| Plan verified 2026-11-14 | Verifier findings 1, 5, 6, 7, 8, 15 and the `buildPlan` line of 17 are applied in `spec.md`, `plan.md` and `tasks.md`. The ledger has one reader, `relocate.mjs`, observed with `rg -l 'relocation-ledger' .skilled --glob '!*.md' --glob '!node_modules/**'` on 2026-11-14. |
| Findings confirmed by the orchestrator | A1 and B6 were re-read in the code by the orchestrator. A3, A4 and A5 are reviewer reports that T001 reproduces before any fix. |
| Out of scope: renumber resume | A stopped `--renumber` leaves no map to rerun. Reviewer A reports it under the handover claims, not as a numbered finding. Not planned here. |
<!-- /ANCHOR:log -->
