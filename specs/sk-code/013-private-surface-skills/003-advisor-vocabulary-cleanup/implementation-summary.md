---
title: "Implementation Summary"
description: "The advisor no longer speaks of the retired Webflow and Obsidian surfaces, sixteen directory scans treat a local-* private skill by design, and @code and @review fall back to an advisor-named local-* skill when sk-code cannot route."
trigger_phrases:
  - "advisor vocabulary cleanup implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup"
    last_updated_at: "2026-10-24T20:00:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Resolved review round 4 (T108 to T112) and re-verified"
    next_safe_action: "Run the next independent review (T084), then commit and push (T074, T075)"
    blockers: []
    key_files:
      - "tasks.md"
      - "decision-record.md"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-advisor-vocabulary-cleanup"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-advisor-vocabulary-cleanup |
| **Completed** | 2026-10-24 (build and verification; independent review, commit and push pending) |
| **Level** | 3 |
| **Status** | In Progress |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The advisor now speaks only about the surface that still ships, and a `local-*` private skill is either visible to the local advisor or invisible to every tracked artifact, by design. `@code` and `@review` also route to an advisor-named `local-*` skill when `sk-code` cannot route, so the two surfaces moved into private skills stay reachable without any tracked vocabulary.

### Phase 3: advisor-vocabulary-cleanup

The vocabulary sweep removed the `obsidian plugin` hint token from the lexical lane, the OBSIDIAN and WEBFLOW workspace detection from the OpenCode plugin, and the `WEBFLOW` example from both tool schemas and the advisor README. The tests that named those surfaces now name `SKILLED`.

Sixteen scans state their rule for a top-level `local-*` entry, and the inventory in `spec.md` section 3 lists them so the count can be checked. Eight include it for the local advisor: the advisor graph scan, the source signature, the Python conflict-declaration reader, the Python signal-map reader, the Python skill-record discovery, the daemon watcher, the filesystem projection and the status scan. Each follows a symlink only when its realpath resolves inside the skills root or a root named in `SPECKIT_PRIVATE_SKILL_ROOTS`. A shared helper, `private-skill-target.ts`, holds that rule for TypeScript and `skill_advisor_runtime.py` holds its Python mirror. Both refuse a link to the skills root itself and resolve the trusted roots once per scan. Eight skip it by name before any filesystem probe: the compiler, the Hermes sync, the CI root-metadata gate, the doctor freshness panel, the command-bridge deriver, the skill-metadata regenerator, the router-signal generator and the cross-skill edge loader. The compiler and the deriver also refuse any other top-level symlink, which is safe because no tracked top-level skill is a link.

The agent fallback runs `advisor_recommend` when `sk-code` returns UNKNOWN, uses a top pick whose `skillId` starts with `local-` as the standards overlay, and keeps the existing escalation (`@code`) or baseline-only review (`@review`) for any other pick.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/lib/private-skill-target.ts` | Created | Realpath containment helper for a top-level `local-*` symlink |
| `.skilled/skills/system-skill-advisor/runtime/tests/private-skill-target.vitest.ts` | Created | Eight containment cases, one counting that many links share one resolution of the trusted roots |
| `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts` | Modified | Graph scan follows a trusted `local-*` link, and both embedding refresh paths stop after three straight backend failures without touching a row that is already current |
| `.skilled/skills/system-skill-advisor/runtime/tests/skill-graph-db.vitest.ts` | Modified | Linked-inside and linked-outside cases |
| `.skilled/skills/system-skill-advisor/runtime/lib/freshness.ts` | Modified | Source signature follows a trusted `local-*` link |
| `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts` | Modified | Linked-inside, linked-outside and declared-root cases |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py` | Modified | Skip `local-*` before any probe, and skip any other top-level symlink |
| `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py` | Modified | Compiler real-folder, private-link and non-private-link cases, conflict-reader inclusion case, four trust cases and seven discovery cases |
| `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` | Modified | Never mirror a `local-*` entry |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes.test.mjs` | Modified | Real-folder and symlink cases |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | Modified | Skip `local-*` in root discovery |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs` | Modified | Synthetic `local-webflow` root case |
| `.skilled/commands/doctor/scripts/skill-graph-freshness.cjs` | Modified | Skip `local-*` in the on-disk read |
| `.skilled/skills/system-skill-advisor/runtime/tests/doctor/skill-graph-freshness-panel.vitest.ts` | Modified | No `local-webflow` ghost, stale or missing row |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts` | Modified | Dropped the `obsidian plugin` hint token |
| `.opencode/plugins/system-skill-advisor.js` | Modified | Workspace detection keeps only SKILLED |
| `.opencode/plugins/tests/system-skill-advisor.test.cjs` | Modified | Renamed the `webflow` fixture target |
| `.skilled/skills/system-skill-advisor/runtime/tests/system-skill-advisor-plugin.vitest.ts` | Modified | Deleted the OBSIDIAN and WEBFLOW detection rows |
| `.skilled/skills/system-skill-advisor/runtime/tests/advisor-surface-hint.vitest.ts` | Modified | `SURFACE_HINT` is `SKILLED` |
| `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts` | Modified | `surfaceHint` example is SKILLED |
| `.skilled/skills/system-skill-advisor/runtime/tools/advisor-recommend.ts` | Modified | Same description text |
| `.skilled/skills/system-skill-advisor/README.md` | Modified | Same sentence in the option list |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Modified | Source readers follow only a trusted `local-*` link, through the check in the runtime module |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_runtime.py` | Modified | Python containment check, resolved once per scan, and `SKILL.md` discovery that follows only a trusted `local-*` link |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs` | Modified | Skip `local-*` and linked folders before reading command metadata, export `metadataEntries`, run `main` only as the entry point |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs` | Modified | Skip `local-*` roots, take the skills root as a parameter, and refuse a `local-*` path given to `--root` |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs` | Modified | Skip `local-*` hubs before the first probe |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-derived-regenerator.test.cjs` | Modified | Regenerator listing, `--root` refusal and router-signal generator cases |
| `.skilled/skills/system-skill-advisor/runtime/lib/cross-skill-edges/metadata-loader.ts` | Modified | Skip a top-level `local-*` folder |
| `.skilled/skills/system-skill-advisor/runtime/tests/cross-skill-edges.vitest.ts` | Modified | One skip case |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-bridges-drift-guard.vitest.ts` | Modified | One case for the deriver skipping `local-*` and linked folders |
| `.skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts` | Modified | Watch a trusted `local-*` link |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts` | Modified | Filesystem projection reads a trusted `local-*` link |
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts` | Modified | Status scan counts a trusted `local-*` link |
| `.skilled/skills/system-skill-advisor/runtime/tests/daemon-freshness-foundation.vitest.ts` | Modified | Watch-target link cases |
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/settings-driven-invocation-parity.vitest.ts` | Modified | Hook counts re-derived from the committed settings file (3, 1, 8, 3) |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/python-ts-parity.vitest.ts` | Modified | Scores at the instant its counts were derived |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/ambiguity-slice.vitest.ts` | Modified | Scores at the baseline's capture instant |
| `.skilled/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts` | Modified | A live owner lease is spawn authority unless the lease records that its launcher does not supervise the model server |
| `.skilled/skills/system-spec-kit/runtime/tests/embedders/hf-local-client.vitest.ts` | Modified | Lease cases for supervision true, false and absent |
| `.skilled/bin/system-skill-advisor-launcher.cjs` | Modified | The owner lease records whether the launcher arms the shared model server |
| `.skilled/skills/system-skill-advisor/runtime/tests/launcher-model-server-default.vitest.ts` | Modified | The lease carries the supervision field for each flag value |
| `.skilled/skills/system-spec-kit/shared/tests/model-server-constants.test.ts` | Modified | Drift check for the lease field name |
| `.skilled/skills/system-skill-advisor/runtime/tests/lifecycle-derived-metadata.vitest.ts` | Modified | Age haircut falls at a later explicit date |
| `.skilled/skills/system-skill-advisor/runtime/tests/skill-graph-embedding-outage.vitest.ts` | Created | Embedding refresh happy path, dead-backend streak, and a current row keeping its vector after the outage trips (legacy column and adapter table) |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/projection-freshness.vitest.ts` | Modified | Projection link case |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Regenerated | Compiler output; only `generated_at` differs from `HEAD` |
| `.skilled/agents/code.md`, `.skilled/agents/review.md` | Modified | Advisor `local-*` fallback on an UNKNOWN route |
| `.claude/agents/code.md`, `.claude/agents/review.md` | Modified | Hand-kept twins carry the same body |
| `.codex/agents/code.toml`, `.codex/agents/review.toml`, `.pi/agents/code.md`, `.pi/agents/review.md` | Regenerated | Runtime mirrors rebuilt by the sync scripts |
| `.hermes/skills/agent-code/SKILL.md`, `.hermes/skills/agent-review/SKILL.md` | Regenerated | Hermes agent skills rebuilt by `sync-skills-hermes.cjs` so the Hermes parity check passes |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every behavior change followed a test-then-code pair, and each test was run red before its code task landed (see Red-first evidence). The suites named in the tasks were re-run from the final tree and their counts are in Final counts. The tracked fallback graph was regenerated by `skill_graph_compiler.py --export-json` and never hand-edited. The `.codex` and `.pi` mirrors were regenerated by their sync scripts. Round 1 of the independent review failed the phase (two P1, ten P2 findings); `tasks.md` Phase 10 resolves them, and each new guard was checked by removing it and watching its test fail: the Python guard (`pass=74, fail=2`), the helper's root-link and `..` cases, and the link check in the watcher, projection and status scan (one failing case each when the check accepts every link or none). A second independent review found one P1 and twelve P2 findings, and T085 to T093 resolve them with the same removal check: the Python discovery with the old glob swapped in (three cases failed), the router-signal generator, the regenerator listing, the bridge deriver and the cross-skill edge loader each with its skip removed (one failing case each). A third review found one P1 and five P2 findings, and T101 to T107 resolve them with the same check: the embedding outage order (both new cases failed with the old order), the `--root` guard, the lease field, the hidden-folder skip and the one-resolution count. A fourth review found no P0 or P1 and a few P2 findings, and T108 to T111 resolve them: the lease field now follows the launcher's real start decision (the two absent-library cases failed with the old expression), the lease cases no longer read the shell's database directory, and the `--root` guard compares the name in any case (the mixed-case case failed with the case-sensitive test). The next review, the commit and the push are the orchestrator's and are recorded in `tasks.md` as pending.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A followed `local-*` link must pass realpath containment against the skills root plus `SPECKIT_PRIVATE_SKILL_ROOTS` | A bare directory check would let a link make the advisor read an arbitrary directory (ADR-001) |
| Eight scans include `local-*` and eight exclude it | The local graph needs the private skill. No tracked artifact may carry one (ADR-002, ADR-003) |
| `skill-graph.json` is regenerated, never edited | The compiler is the single writer (ADR-005); the regenerated file differs from `HEAD` only in `generated_at` |
| The leaf-manifest gate is screened, not changed | Neither private source tree carries a `leaf-manifest.json` (ADR-004) |
| Agents fall back only to a `local-*` top pick | Any other pick keeps the old escalation, so the fallback cannot widen routing (ADR-008) |
| Dated 2026-10-24 amendments in `decision-record.md` | Plan counts were taken at an older base; the Proof's end state wins within D6 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Containment helper, graph scan, advisor-status, freshness panel, plugin vitest, surface-hint, native-scorer, lexical pair, projection freshness, daemon freshness | PASS: 8, 11, 22, 19, 91, 3, 22, 10, 3 and 22 passing |
| Python advisor suite | PASS: `Summary: pass=84, fail=0` |
| Hermes sync and plugin `node:test` | PASS: 6 of 6 and 42 of 42, exit 0 |
| Cross-skill edges, bridge drift guard and regenerator node test | PASS: 15 and 5 passing, and the node test prints `passed` |
| Root-metadata contract and leaf-manifest gate | PASS: `passed` and `checked=14 fresh=14 failed=0` |
| Ambiguity slice | PASS after the operator ruling: `live=19/24 baseline=19` with the clock pinned (`17/24` on the real clock before it) |
| Four agent-mirror drift checks and the Hermes parity check | PASS: all exit 0, doctor prints `STATUS=OK`, Hermes prints `PASS: 66 Hermes skill copies in sync` |
| In-scope surface sweep and graph signals | PASS: three D6-kept `webflow cms` lines; `sk-code` signals `[]`, `mcp-tooling` control `3` |
<!-- /ANCHOR:verification -->

---

### Baseline

Captured before the first edit. The ambiguity slice is expected red at baseline.

| Suite | Baseline |
|-------|----------|
| `private-skill-target.vitest.ts` | does not exist yet; T016 creates it |
| `skill-graph-db.vitest.ts` | 9 passing |
| `advisor-status.vitest.ts` | 18 passing |
| `test_skill_advisor.py` | `pass=69, fail=0` |
| `sync-skills-hermes.test.mjs` | 4 passing |
| `skill-root-metadata-contract.test.cjs` | `passed` |
| `skill-graph-freshness-panel.vitest.ts` | 18 passing |
| plugin `node:test` | 42 passing |
| plugin vitest | 94 passing |
| `advisor-surface-hint.vitest.ts` | 3 passing |
| `native-scorer.vitest.ts` | 22 passing |
| lexical pair | 10 passing |
| `ambiguity-slice.vitest.ts` | `live=17/24 baseline=19`, expected red |

### No-change decisions

| Decision | Proof |
|----------|-------|
| The native-scorer `webflow` prompt stays; its assertion is `expect(result.topSkill).toBe('sk-code')` at line 392 and the suite passes 22 | T044's read of lines 387 to 392 and its 22-passing run |
| `aliases.ts`, `leaf-aliases.json` and `scorer-calibration-baseline.json` carry no surface token; the corrected `skill_advisor.py` control `rg -c -i 'webflow\|obsidian'` prints `1` (the D6-kept `webflow cms` line; the file holds no `obsidian`) | T045's control and zero check |
| `ci-leaf-manifest-freshness.cjs` needs no change: 14 fleet manifests, 0 in either private source tree, and the gate reports `checked=14 fresh=14 failed=0` | T046's three commands |

### Red-first evidence

Each row is the count observed before the code task named in the second column. The text after the count is the behavior the case asserts, which is the reason it failed.

| Test task | Code task | Observed before the code change |
|-----------|-----------|---------------------------------|
| T018 | T020 | `1 failed, 9 passed`; the case asserts the linked `local-beta` skill is a `skill_nodes` row |
| T019 | T020 | passes before and after; the one failure in `1 failed, 10 passed` is T018's case, and this case proves the containment rejection |
| T021 | T024 | `1 failed, 18 passed`; the case asserts a linked `SKILL.md` rewrite changes the signature |
| T022 | T024 | passes before and after; the one failure in `1 failed, 19 passed` is T021's case, and this case proves the untrusted target is ignored |
| T023 | T024 | `2 failed, 19 passed`; red like T021, because nothing follows the declared-root link yet, so it is not a guard |
| T025 | T027 | `pass=69, fail=1` (`T246-GC-013`); the case asserts `local-private` is absent from the discovered list |
| T026 | T027 | `pass=69, fail=2` (`GC-013`, `GC-014`); the case asserts a linked target is not followed |
| T028 | T030 | `tests 5, pass 4, fail 1`; the real-folder case asserts the mirror writes no `local-webflow` folder |
| T029 | T030 | passes before and after; the one failure in `tests 6, pass 5, fail 1` is T028's case, and this case proves the symlink is never followed |
| T031 | T032 | `AssertionError`; `findSkillRoots` returned `['alpha', 'local-webflow']` where the case expects `['alpha']` |
| T033 | T034 | `1 failed, 18 passed`; the case asserts the panel shows no `local-webflow` row |

### Final counts

| Command | Final |
|---------|-------|
| containment helper | 8 passing |
| `skill-graph-db` | 11 passing |
| `advisor-status` | 22 passing |
| Python advisor | `pass=84, fail=0` |
| Hermes sync | 6 passing |
| root-metadata contract | `passed` |
| freshness panel | 19 passing |
| plugin `node:test` | 42 passing |
| plugin vitest | 91 passing |
| projection freshness | 3 passing |
| daemon freshness foundation | 22 passing |
| `advisor-surface-hint` | 3 passing |
| `native-scorer` | 22 passing |
| lexical pair | 10 passing |
| ambiguity slice | `live=19/24 baseline=19` with the clock pinned (`17/24` before the operator ruling) |
| in-scope surface sweep | 3 lines: `fusion.ts:600`, `fusion.ts:602`, `explicit.ts:131` |
| leaf-manifest gate | `checked=14 fresh=14 failed=0` |

### Deferred after phase 004

The routing probe that proves a real private skill wins an UNKNOWN route runs once phase 004 creates the two symlinks. It is not a gate for closing this phase.

```bash
cd "/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com"
SPECKIT_PRIVATE_SKILL_ROOTS="/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/local-skills:/Users/michelkerkmeester/MEGA/Development/Obsidian Plugin/local-skills" node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"implement a responsive webflow animation module"}' --format json | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log(JSON.parse(s).data.recommendations[0].skillId))"
```

Expected: `local-webflow`, the top `skillId`.

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The ambiguity slice is green once its clock is pinned.** `live=17/24` against `baseline=19` measured the calendar, because the derived lane discounts by age and the test read the real clock. With the clock fixed to the baseline's capture instant the live count is `19/24`, equal to the baseline (see the operator ruling amendment in `decision-record.md`).
2. **The private-skill routing probe is deferred.** It needs the two phase-004 symlinks and both external roots in `SPECKIT_PRIVATE_SKILL_ROOTS`; until then no real `local-*` skill has been routed (AC-035, ADR-008).
3. **Independent review, commit and push are not done here.** They are the orchestrator's (T072, T074, T075, T076).
4. **The follow-up tests were not observed red before their guards.** They were written after the guards; each was instead shown to fail when its guard was removed (see How It Was Delivered).
5. **The full runtime vitest run was red before this phase and is fixed.** The seven cases that failed on a clean `origin/main` (the baseline ambiguity slice, three hook-count cases, one parity case and two `skill_graph_scan` job cases) are resolved by the operator ruling, and `decision-record.md` gives each cause and fix. The full run now prints `Test Files  147 passed (147)` and `Tests  1225 passed | 8 skipped (1233)` with no `FAIL` line, after round 3 added eight cases and round 4 added two.
6. **Several record-time proofs are time-dependent.** The Baseline, No-change and Final-counts table-line proofs count to the end of the file, so they hold only for the block that is last. Count each block to the next heading instead.
<!-- /ANCHOR:limitations -->

---

