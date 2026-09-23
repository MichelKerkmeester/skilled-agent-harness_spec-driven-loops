---
title: "Implementation Summary"
description: "A changed pi contribution delivers its full brief again, the advisor battery runs with 0 failed tests, every renamed environment variable is read once and the stale documentation surfaces match the code. A follow-up deletes the dead tri-daemon drill and repairs the CI corpus gate path."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/029-fix-remaining-advisor-defects"
    last_updated_at: "2026-09-23T16:44:00Z"
    last_updated_by: "implementing-agent"
    recent_action: "Pushed the follow-up as 40b23a70a6, where CI ran green on both branches"
    next_safe_action: "No next action: the packet is complete, pushed and green in CI"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts"
      - ".skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts"
      - ".skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts"
      - ".opencode/plugins/system-skill-advisor.js"
      - ".skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "029-implementation-2026-09-23"
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
| **Spec Folder** | 029-fix-remaining-advisor-defects |
| **Completed** | 2026-09-23 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Pi re-delivers a rotated recommendation and the advisor battery is green end to end. The half-landed dedup fix from packet 028 fell off the end of its function on a changed contribution, so pi's caller threw and a swallowed exception hid it. That return is restored and covered by a test, the 13 failing tests in 9 files are gone and the five stale documentation surfaces now match the code and packet 028's record carries its correction. Every renamed environment variable is read once again, the kill-switch table says which name each surface reads and the shim test's unavailable case runs every time. A follow-up merged main, deleted the dead tri-daemon drill and pointed the CI corpus gate at the baseline's archived path.

### Restore the pi advisor dedup return, renew the drifted advisor battery and close the stale documentation surfaces

With one line restored, a changed contribution delivers its full brief again. When your recommended skill rotates mid-session, the new recommendation reaches you instead of dying inside a catch block. The rest of the round clears the road under it: the database-dir read takes one name from one root, the Claude hook and the OpenCode plugin find the renamed repository root first, the skill graph carries reciprocal edges again, the golden-hub fixture resolves its modules and the two baselines were renewed by the capture tools, so the advisor runtime battery runs green and every documentation surface describes the code as it stands.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts | Modified | Dead receipt write dropped and `return FULL_PI_DIRECTIVE_DELIVERY` restored |
| .skilled/hooks/dispatch/pi/directive-dedup.test.ts | Modified | Route-head-only re-delivery test added |
| .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts | Modified | DB-dir read collapsed to `env.SYSTEM_SKILL_ADVISOR_DB_DIR ?? defaultDbDir` |
| .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts | Modified | Root probe checks `.skilled` first and then `.opencode` |
| .opencode/plugins/system-skill-advisor.js | Modified | `resolveCompiledRouteStatusModule()` checks the plugin root and then `.skilled/bin`, and `advisorSourceSignature` reads `SYSTEM_SKILL_ADVISOR_DB_DIR` once |
| .skilled/skills/cli-external-orchestration/graph-metadata.json | Modified | Reciprocal sibling edges and corrected fields |
| .skilled/skills/cli-jev/graph-metadata.json | Modified | Reciprocal sibling edges and corrected fields |
| .skilled/skills/cli-orca/graph-metadata.json | Modified | Reciprocal sibling edges and corrected fields |
| .skilled/skills/mcp-tooling/graph-metadata.json | Modified | Reciprocal sibling edges and corrected fields |
| .skilled/skills/sk-git/graph-metadata.json | Modified | Reciprocal sibling edges and corrected fields |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json | Modified | Regenerated from the repaired metadata |
| .skilled/skills/system-skill-advisor/runtime/tests/parent-skill-check-fixtures.vitest.ts | Modified | `NODE_PATH` passed to the checker for the bare-tempdir hub copy |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json | Modified | Renewed by `capture-scorer-eval-baseline.mjs --write` and re-captured after the main merge (full-corpus top-1 151 to 152, memory_save 26 to 27) |
| .skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json | Modified | Renewed by `capture-local-native-divergence-ledger.mjs --write`, 85 to 75 entries, reviewed reason for `rr-iter3-061` restored, then re-captured after the main merge with reviewed reasons on four changed entries |
| .skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-corpus-parity.vitest.ts | Modified | pythonCorrect frozen count 114 to 112, `rr-hub6-204` and `rr-hub6-207` out of the accepted-regression list, comment corrected |
| .skilled/skills/system-skill-advisor/runtime/tests/parity/python-ts-parity.vitest.ts | Modified | pythonCorrect 109 to 106, tsAlsoCorrect 100 to 99, `rr-hub6-204` and `rr-hub6-207` out of the accepted-regression list, comment corrected |
| .skilled/skills/system-spec-kit/feature-catalog/ux-hooks/directive-lifecycle-dedup.md | Modified | Current dedup behavior described |
| .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md | Modified | Byte-identical full-contribution condition stated for the Pi dedup |
| .skilled/skills/system-skill-advisor/hooks/pi/README.md | Modified | Current dedup behavior described |
| .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md | Modified | Current fallback behavior described, and the kill-switch rows name what each surface reads |
| .skilled/skills/system-skill-advisor/hooks/lib/README.md | Modified | Current fallback behavior described |
| specs/system-skill-advisor/028-restore-pi-advisor-brief/implementation-summary.md | Modified | Correction note added, original numbers kept |
| specs/system-skill-advisor/028-restore-pi-advisor-brief/plan.md | Modified | Correction note added, original numbers kept |
| .skilled/bin/system-skill-advisor-launcher.cjs | Modified | List `SYSTEM_SKILL_ADVISOR_DB_DIR` once in the child env allowlist |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py | Modified | List `SYSTEM_SKILL_ADVISOR_DB_DIR` once in the native bridge allowlist |
| .skilled/commands/doctor/scripts/skill-graph-freshness.cjs | Modified | Read `SYSTEM_SKILL_ADVISOR_DB_DIR` once |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs | Modified | Delete `SYSTEM_SKILL_ADVISOR_DB_DIR` once |
| .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts | Modified | Check `OPENCODE_PROMPT_TIME` once |
| .skilled/skills/system-skill-advisor/runtime/tests/state-containment.vitest.ts | Modified | Delete `SYSTEM_SKILL_ADVISOR_DB_DIR` once |
| .skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts | Modified | Delete `SYSTEM_SKILL_ADVISOR_DB_DIR` once |
| .skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-trust-gate.vitest.ts | Modified | List `SYSTEM_SKILL_ADVISOR_DB_DIR` once |
| .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-trusted-prompt-time.vitest.ts | Modified | List `OPENCODE_PROMPT_TIME` once |
| .skilled/skills/system-skill-advisor/references/config/db-path-policy.md | Modified | One variable, plus how the retired `MK_` name reaches it |
| .skilled/skills/system-skill-advisor/references/runtime/daemon-lease-contract.md | Modified | One variable in both sentences |
| .skilled/bin/README.md | Modified | Drop the unread `CODEX_PROMPT_TIME` and the retired `mk-*-launcher` names |
| .skilled/skills/system-skill-advisor/runtime/tests/compat/shim.vitest.ts | Modified | Run the unavailable-branch case under the force-local switch |
| .skilled/skills/system-skill-advisor/runtime/tests/tri-daemon-drill.vitest.ts | Deleted | The opt-in drill for the retired two-daemon setup |
| .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/skill-advisor-cli.md | Modified | The drill's row dropped |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/skill-advisor-cli-fallback.md | Modified | Cites only the spec-kit scenarios that still exist (428 and 431) |
| .skilled/skills/system-skill-advisor/runtime/README.md | Modified | Drill sentence dropped from the `npm test` row |
| .skilled/skills/system-skill-advisor/runtime/tests/README.md | Modified | Drill dropped from the tree |
| .skilled/skills/system-skill-advisor/runtime/tests/tsconfig.tests.json | Modified | Drill dropped from the include list |
| .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-launcher-orphan-reaping.vitest.ts | Modified | `second.child.stdin` asserted non-null at its six uses |
| .github/workflows/routing-registry-drift.yml | Modified | Corpus-gate step and both baseline path filters name the archived baseline |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The earlier session built the code lanes on the worktree `worktrees/060-fix-remaining-advisor-defects`, forked from main at 1cc5dfa692: lane A (the pi dedup return) and lanes C to G (the root probes, the skill graph, the golden-hub fixture and the baselines). This session corrected lane B's DB-dir expression, corrected the two test comments, renewed the divergence ledger with its capture tool, applied the documentation lane H and wrote this packet.

Every authored edit in this session went through cli-pi to MiMo V2.6 Pro on the LLM Gateway route (`llmgateway/mimo-v2.6-pro`, thinking high), one change per brief. The orchestrating Claude session wrote the briefs, checked each diff against the authorized paths and ran every gate. Scripted artifacts (builds, baseline captures, `description.json`, graph metadata) came from the repository's own scripts.

One delegate handback claimed it had observed that line 53 of this summary recorded the dedup fix, when that line was still the template heading. The pointer it added to packet 028's record was kept, because this summary now makes that pointer true. The earlier session's record, not re-run here, says a GPT 5.6 Luna verification dispatch returned OVERALL INCOMPLETE, with two gaps that were a sandbox-blocked hook smoke and refs that had moved on during the run rather than code defects.

A second pass, on the operator's instruction to leave nothing deferred, took the items the first pass had only named. Fourteen one-change briefs ran in two parallel waves of six and eight, each checked against its authorized path. The first battery after them failed one shim case on a load-sensitive race that predates this packet, so a fifteenth brief made that case deterministic. The Pi delivery check ran as a live three-turn RPC session from the worktree, which runs the same `input` handler as an interactive session.

Another session merged the first round into local main as bd269228cb while origin main moved on to 997cd8ee2e, so the two were merged on a detached HEAD inside the worktree (2dbaa8fd66). Main's side won on the four conflicting `graph-metadata.json` files because it carried every edge this packet added plus a cli-jev keyword fix. The skill graph was then regenerated. That keyword fix moved one scorer result and four local-native divergences, so both baselines were re-captured with reviewed reasons (2f5fc94ef2) and the result was pushed to main and skilled/v4.0.0.0. A follow-up on `worktrees/063-remove-tri-daemon-drill` then took the two items the operator decided: the drill deletion and the corpus-gate path. The drill file was removed with `git rm`. MiMo made every other edit through the same one-change briefs. Each was checked byte for byte against a generated expected file.

Before the push, origin main had moved fifteen commits past the follow-up's base. They included the CI cleanup in `system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof`, which had made the same corpus-gate path fix (b566f9fc28) and fixed the Spec-Kit Check failure (5b522489a2). The follow-up merged main (bce9d6b06c) without a conflict and this record was corrected to match. It then reached main and skilled/v4.0.0.0 as 40b23a70a6, where CI ran green on every workflow it triggered.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Collapse the DB-dir read to one variable rather than add a second name | No file reads another name, so a second name would be dead configuration the next reader has to chase |
| Read each renamed variable once everywhere, not only in the fallback | Commit 4bd27731f3a turned every new-then-legacy pair into the same name twice, and the legacy `MK_` name still reaches the new one through the env alias bridge, so one read keeps the behavior and drops dead text |
| Fix the kill-switch table rather than the Python CLI | The Python CLI's disable check is a test switch for its unavailable branch, read from its compat contract. Making it honor the hook kill-switches would silence the parity scripts whenever an operator mutes hooks |
| Make the shim case deterministic with the force-local switch | Its old skip read the daemon state once, so a loaded run failed it and a warm machine never ran it. The force-local switch reaches the same branch every time |
| Delete the tri-daemon drill rather than rewrite it | The operator's call. It exercised a two-daemon setup that no longer exists and has failed at setup since commit 7388a0abaf8 deleted the code-index launcher it copies |
| Correct packet 028's record with a note instead of a rewrite | Its original numbers stand as evidence and the note carries the correction beside them |
| Renew baselines only through the capture tools | Hand edits move the goalposts without a trace, so the reason lands beside each captured change |
| Restore the reviewed reason for `rr-iter3-061` | The capture tool writes keyword-based boilerplate, and this entry's committed human-reviewed reason and date (2026-09-07) still describe why it diverges |
| Correct the two test comments | Both named ids absent from their lists and failed the comment-hygiene checker, so the corpus-parity comment now states that `rr-hub6-204` and `rr-hub6-207` left the list, and the python-ts comment spells both ids out |
| Take main's side on the four `graph-metadata.json` conflicts | Main carried every edge this packet added plus the cli-jev keyword fix. Taking it also cleared two topology warnings |
| Fix the corpus gate's path in its own commit | The failure predates this packet. Commit b566f9fc28 made the same change first, so after the merge the two commits agree and neither may be reverted alone |
| Leave the Spec-Kit Check failure alone | Its five failing `pi enforce` tests failed the same way before this packet's merge. Commit 5b522489a2 later traced them to the Linux runner's `/tmp` temp dir, which the spec gate exempts. It fixed them in CI |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Pi dedup suite (`.skilled/hooks/dispatch/pi/directive-dedup.test.ts` under `.skilled/hooks/vitest.config.ts`) | PASS: 15 of 15 pass against this packet's `prompt-advisor.ts`. Negative control against 028's file: 8 of 15 fail (`expected undefined to deeply equal { suppressed: false }` and `TypeError: Cannot read properties of undefined (reading 'suppressed')`), and this packet's file was restored byte-identical afterwards |
| Advisor runtime battery (`npm --prefix .skilled/skills/system-skill-advisor/runtime test`) | PASS: first run 889 passed, 2 failed (both the local-native divergence ratchet), 7 skipped of 898. After the ledger capture: 891 passed, 0 failed, 7 skipped of 898, exit 0, 126.8 s. Final run after the last edit: 891 passed, 0 failed, 7 skipped of 898, exit 0, 122.4 s |
| Compiled hook smoke (stdin to `dist/hooks/claude/user-prompt-submit.js`) | PASS: `status: "ok"`, freshness `live`, 1941 ms, brief `Advisor: live; use sk-doc 0.94/0.12 pass.` |
| Advisor status | PASS: freshness live, 21 skills |
| Builds (`npm --prefix .skilled/skills/system-skill-advisor/runtime run build` and `npm --prefix .skilled/skills/system-spec-kit/runtime run build`) | PASS: both exit 0 and the compiled `dist/hooks/lib/skill-advisor-cli-fallback.js` carries the single DB-dir read |
| Comment hygiene (`check-comment-hygiene.sh` on the edited sources and tests) | PASS: exit 0 on all eight edited source and test files |
| Packet 028 strict validation after its correction and derived-metadata repair | PASS: RESULT: PASSED, Errors 0, Warnings 0 |
| Repeated-name search, syntax and allowlist identity (lanes I and K) | PASS: the search finds nothing, `node --check` passes on four JavaScript files, `py_compile` passes on `skill_advisor.py`, the old and new allowlists hold the same 21 and 41 members and comment hygiene exits 0 on eleven files |
| Second-pass suites | PASS: advisor runtime build exit 0, OpenCode plugin suite 29 of 29, Pi dedup suite 15 of 15, doctor freshness script exit 0 |
| Advisor runtime battery after lanes I to K | PASS: the first run failed 1 (the shim race, `expected +0 to be 2`) with 890 passed. After lane K: 891 passed, 0 failed, 7 skipped of 898, exit 0, 132.6 s. The 7 skips are 4 static skips, 2 opt-in ablation cases and the opt-in tri-daemon drill |
| Live Pi check (three-turn RPC session from the worktree) | PASS: turn 1 carried `Advisor: live; use sk-git 0.88/0.12 pass.`, the byte-identical turn 2 carried nothing while the advisor reported `ok` with a cache hit and turn 3 carried `Advisor: live; use sk-doc 0.88/0.12 pass.` Control with `SPECKIT_PI_DIRECTIVE_DEDUP=0`: all three turns carried the line |
| Opt-in tri-daemon drill (`SPECKIT_RUN_TRI_DAEMON_DRILL=1`), first round | FAIL, predates this packet: its setup copies `.skilled/bin/system-code-index-launcher.cjs`, absent at HEAD since commit 7388a0abaf8. Lane M deleted the drill |
| Merged tree (lane L) | PASS after the re-capture: before it the battery failed 3 tests, all ratchets reporting improvements (full-corpus top-1 152 against 151, memory_save 27 against 26, four changed ledger entries), with the Pi dedup suite at 15 of 15 and the OpenCode plugin suite at 29 of 29. After it: 891 passed, 0 failed, 7 skipped of 898, 123.9 s |
| CI on 2f5fc94ef2 | Two workflows failed for reasons outside the pushed change. The Routing Registry Drift Guard died with `FileNotFoundError` on the moved baseline (fixed on main by b566f9fc28, the same change as lane N). Spec-Kit Check failed five `pi enforce` tests in `spec-gate-pi-extension.vitest.ts`, which fail the same way on 997cd8ee2e (fixed on main by 5b522489a2). Every other workflow passed on both branches (27 runs across 14 workflows) |
| Drill deletion and type check (lane M) | PASS: no drill reference remains outside spec and changelog folders, `tsc --noEmit -p runtime/tests/tsconfig.tests.json` exits 0 (the orphan-reaping test alone had six `TS18047` errors at HEAD) and the battery ran 891 passed, 0 failed, 6 skipped of 897, exit 0, 151.4 s |
| CI corpus gate (lane N) | PASS locally: the step read from the edited workflow, run from its working directory with no advisor database, exits 0 with `overall_pass` true and no threshold failures (joint TT 103, FT 3, FF 1, gate-3 F1 0.9843) |
| CI on 4072bb9e7a (origin main merged into the follow-up) | PASS: every workflow green on both branches (17 runs), including the corpus gate at the archived path |
| Follow-up merged with origin main (bce9d6b06c) | PASS: no conflicts and the workflow matches both path fixes line for line. The advisor battery on the merged tree ran 891 passed, 0 failed, 6 skipped of 897, exit 0, 135.6 s |
| CI on 40b23a70a6 (the pushed follow-up) | PASS: 21 runs across 11 workflows on both branches, all green, including the Routing Registry Drift Guard. Spec-Kit Check did not trigger on these paths |
| Packet 029 strict validation (`validate.sh --strict`) | PASS: RESULT: PASSED, Errors 0, Warnings 0 (validate.sh --strict, 2026-09-23) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The Pi check ran over RPC, not a terminal.** The three-turn session runs the same `input` handler as an interactive session. A terminal session was not opened.
2. **The divergence ledger follows the worktree daemon's live database.** The Python scorer reads `runtime/database/skill-graph.sqlite`, and a rebuild can move its tops again as one did this round. The fix is a capture with reviewed reasons, which is how this round renewed it.
3. **This packet's corpus-gate commit duplicates another packet's.** Commits 5ba4c78aac and b566f9fc28 make the same three-line change. Reverting either one alone would put the old path back.
<!-- /ANCHOR:limitations -->
