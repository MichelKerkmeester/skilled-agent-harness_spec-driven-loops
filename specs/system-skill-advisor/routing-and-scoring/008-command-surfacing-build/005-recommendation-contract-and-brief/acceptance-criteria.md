---
title: "Acceptance Criteria: Phase 5: recommendation-contract-and-brief"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "recommendation contract and brief acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/005-recommendation-contract-and-brief"
    last_updated_at: "2026-11-13T02:10:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Marked each criterion with evidence rerun on a57ce61a13"
    next_safe_action: "None, packet closeable"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-recommendation-contract-and-brief"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 5: recommendation-contract-and-brief

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
**Packet:** `system-skill-advisor/routing-and-scoring/008-command-surfacing-build/005-recommendation-contract-and-brief`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

`ADV` is `.skilled/skills/system-skill-advisor/runtime`. `REC` is `node .skilled/bin/skill-advisor.cjs advisor_recommend --format json --json`. `C`, `M`, `P` and `ROLL` are the commands named in `tasks.md`. AC-015 to AC-017 form the CARRY-003 group.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the schema, When a recommendation with `kind`, `command`, `policy` and `ownerSkillId` is parsed, Then it passes, and with `consequence` added it fails | `npx vitest run tests/schemas/advisor-tool-schemas.vitest.ts` in `ADV` reports 0 failed Evidence: Rerun on `a57ce61a13`: the schema test file passed inside an 11-file vitest run, 68 passed and 0 failed | Met | - |
| AC-002 | REQ-002 | Given a fresh build, When `/speckit:plan add a login page` is recommended, Then the top entry carries `kind` `command`, `command` `/speckit:plan`, `policy` `start` and `ownerSkillId` `system-spec-kit`, and the readme prompt's `sk-doc` entry carries `policy` `start` | `$REC '{"prompt":"/speckit:plan add a login page"}' \| jq -c '.data.recommendations[0] \| {kind,command,policy,ownerSkillId}'` and the T019 readme command Evidence: Rerun: printed `{"kind":"command","command":"/speckit:plan","policy":"start","ownerSkillId":"system-spec-kit"}`, and the readme command printed `{"skillId":"sk-doc","command":"/create:readme","policy":"start"}` | Met | - |
| AC-003 | REQ-003 | Given six constructed results, When each is rendered, Then each head matches `plan.md` section 3 exactly and is at most 320 characters before `\nDirectives:`, and the six live heads contain no `command-` | `npx vitest run tests/command-brief-golden.vitest.ts` in `ADV`, and `rg -c "command-" scratch/brief-heads-after.txt` prints nothing Evidence: Rerun: `tests/command-brief-golden.vitest.ts` passed, its six heads match the six in `plan.md` exactly, and `rg -c "command-" scratch/brief-heads-after.txt` printed nothing with exit 1 | Met | - |
| AC-004 | REQ-004 | Given a fresh build, When `save context` is recommended, Then exactly one entry carries `/speckit:save` | `$REC '{"prompt":"save context"}' \| jq '[.data.recommendations[] \| select(.command == "/speckit:save")] \| length'` prints 1 Evidence: Rerun: printed 1 | Met | - |
| AC-005 | REQ-005 | Given all changes, When the floors run, Then `P` prints `[159,50,20,5]`, `node $C \| $M` prints typed 24 of 44, tune combined 9 of 45, holdout combined 0 of 44 and false offers 0 of 35, `ROLL` prints `{"ask":17,"run":7,"start":20}`, the derive check prints `fresh` and the suite reports 0 failed | The T051 command outputs Evidence: Rerun: `P` printed `[159,50,20,5]`, `M` printed typed 24 of 44, tune combined 9 of 45, holdout combined 0 of 44 and false offers 0 of 35, `ROLL` printed `{"ask":17,"run":7,"start":20}` and the derive check printed `fresh`. Read: `scratch/suite-after.txt` 1513 passed, 0 failed. A later suite run of mine came after other workers changed advisor source and is not evidence about this commit | Met | - |
| AC-006 | REQ-006 | Given a degraded result, When the prompt types `/speckit:save`, Then the entry keeps `command` and `policy`, and When the prompt is a plain readme request, Then `command-create-readme` becomes one `sk-doc` entry with no command | `npx vitest run tests/cli-degraded-command-contract.vitest.ts` in `ADV` reports 0 failed Evidence: Rerun: `tests/cli-degraded-command-contract.vitest.ts` passed, 0 failed | Met | - |
| AC-007 | REQ-007 | Given a CLI row with no new field, When the hook renders it, Then the head contains `system-spec-kit → /speckit:save (start)` | `npx vitest run tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts` in `ADV` reports 0 failed Evidence: Rerun: `tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts` passed, 0 failed | Met | - |
| AC-008 | REQ-008 | Given the generated table, When `command-doctor-update` is read, Then its policy is `ask` | `rg -n "'command-doctor-update': \{ command: '/doctor:update', policy: 'ask'" ADV/lib/command-attach.ts` prints one line Evidence: Rerun: printed line 97 of `lib/command-attach.ts` | Met | - |
| AC-009 | REQ-009 | Given the retirement, When the bridge file and the labels are searched, Then `allow-list.json` is gone, no scored id is a `command-spec-kit-plan`, `-complete`, `-implement` or `-resume` id, and five relabels are listed | `test ! -e ADV/scripts/command-bridges/allow-list.json`, the T034 `jq` output `[]`, `rg -c "command-spec-kit-(plan\|complete\|implement\|resume)\b" ADV --glob '!dist' --glob '!**/changelog/**' --glob '!**/shadow-diff.md'` prints nothing, and `scratch/relabel-list.txt` has 5 lines Evidence: Rerun: `allow-list.json` is gone, the T034 `jq` printed `[]` and `scratch/relabel-list.txt` has 5 lines. Rerun on 2026-11-13 after the fixture at `tests/command-offer.vitest.ts:27` was changed to `command-speckit-plan`: the `rg` printed nothing, exit 1 | Met | - |
| AC-010 | REQ-010 | Given the Python scorer, When it is searched, Then no `"/prompt"` row or branch remains and the alias folds still exist | `rg -n '"/prompt"' ADV/scripts/skill_advisor.py` prints nothing, `rg -n "command-memory-save" ADV/lib/scorer/aliases.ts` prints one line, and `python3 ADV/tests/python/test_skill_advisor.py` exits 0 Evidence: Rerun: the `"/prompt"` search printed nothing with exit 1, `aliases.ts:15` holds `command-memory-save` and the Python tests printed `pass=89, fail=0` | Met | - |
| AC-011 | REQ-011 | Given the change, When the code is searched and typechecked, Then no `HAND_AUTHORED` constant remains and `routingEnabled` is required | `rg -n "HAND_AUTHORED" ADV --glob '!dist'` prints nothing, `rg -n "readonly routingEnabled: boolean;" ADV/lib/scorer/projection.ts` prints one line and `npm run typecheck` in `ADV` exits 0 Evidence: Rerun: the `HAND_AUTHORED` search printed nothing with exit 1, `projection.ts:66` holds the required field and the typecheck exited 0 | Met | - |
| AC-012 | REQ-012 | Given a fresh build, When the git hooks prompt goes through the hook, Then its head contains `/doctor:git hooks (ask)`, and the schema has no `argumentHint` | The git hooks line of `scratch/brief-heads-after.txt`, and `rg -n "argumentHint" ADV/schemas/advisor-tool-schemas.ts` prints nothing Evidence: Read: line 5 of `scratch/brief-heads-after.txt` holds `sk-git → /doctor:git hooks (ask)`. Rerun: the `argumentHint` search printed nothing with exit 1 | Met | - |
| AC-013 | REQ-013 | Given the docs, When they are searched, Then each names the fields or the head form and none names the allow-list as live | The T038, T039 and T040 verify commands Evidence: Rerun: the hook doc search printed lines 58 and 65 to 70, the catalog entry counted 4 `ownerSkillId` lines, the README holds `COMMAND_ROWS` at line 50 and the `allow-list.json` search printed nothing | Met | - |
| AC-014 | REQ-014 | Given all changes, When `AGENTS.md` is diffed and the hook is timed three times, Then `AGENTS.md` is unchanged and the middle median and p95 stay within +25 ms and +40 ms | `git -c core.fsmonitor=false diff --quiet HEAD -- AGENTS.md` exits 0, and the six timing files in `scratch/` Evidence: Rerun: the `AGENTS.md` diff exited 0. Read: middle median 179.86 to 192.83 ms (+12.97) and middle p95 240.23 to 250.18 ms (+9.95) | Met | - |
| AC-015 | REQ-015 | CARRY-003 (a). Given the default capture, When it runs, Then `typed_same_owner_ambiguous` is `[]` and `P` still prints `[159,50,20,5]` | `node $C \| $M` fourth line, and `P` Evidence: Rerun: the fourth line printed `[]` and `P` printed `[159,50,20,5]` | Met | - |
| AC-016 | REQ-016 | CARRY-003 (b). Given the compatibility file and a fixture skills root, When the deriver runs, Then the four Python rows are absent and the fixture's metadata command is enabled in both runtimes | `jq -c '[.python[].id \| select(test("^command-spec-kit-(plan\|complete\|implement\|resume)$"))]' ADV/scripts/command-bridges/scoring-compatibility.json` prints `[]`, and `npx vitest run tests/command-policy-derivation.vitest.ts` in `ADV` reports 0 failed Evidence: Rerun: the `jq` printed `[]`, because the four rows now carry the `command-speckit-*` ids, and the derivation test passed with 0 failed | Met | - |
| AC-017 | REQ-017 | CARRY-003 (c). Given a fresh build, When `show me which packets mention the token cap` is recommended, Then an entry carries `/speckit:search` with `policy` `run`, and false offers stay 0 of 35 | `$REC '{"prompt":"show me which packets mention the token cap"}' \| jq -c '[.data.recommendations[] \| select(.command == "/speckit:search") \| .policy]'` prints `["run"]`, and `node $C \| $M` third line Evidence: Rerun: printed `["run"]`, and the third `M` line printed `{"count":0,"total":35}` | Met | - |
| AC-019 | REQ-019 | Given a re-capture after the source fix, When row `nm-sk-doc-01` is scored, Then its top is `sk-doc` with no command, the diff holds no two-word window of its prompt, and typed recall, plain recall, false offers and the four pinned numbers are not lower | `jq -c '.rows["nm-sk-doc-01"] \| {top, offered}'` on the baseline file prints `{"top":"sk-doc","offered":false}`, the T056 window check prints nothing, and the T057 `M` and `P` outputs Evidence: Rerun: printed `{"top":"sk-doc","offered":false}`. The added line in `sk-doc/graph-metadata.json` holds no two-word window of the prompt. `M` and `P` printed the AC-005 numbers | Met | - |
| AC-018 | REQ-018 | Given Ollama serving `nomic-embed-text`, When the sk-doc reach check runs, Then it prints `outranked=0` and `RESULT: PASSED`, and Given a fixture where a command owned by another hub wins, Then that phrase still counts as `outranked` | `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs --hub sk-doc` exits 0, and `node .skilled/skills/sk-doc/sk-create-skill/scripts/tests/ci-router-vocabulary-reach.test.cjs` exits 0 Evidence: Read: `scratch/reach-after.txt` `outranked=0`, `RESULT: PASSED`. A later run with Ollama up, after another worker edited `sk-doc/ROUTER.md`, exited 0 with `outranked=0`, `probe-error=0`, `RESULT: PASSED` on its second try after the first hit 43 probe errors. The reach test file exited 0 | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT
**Closeable:** Yes

Every row is `Met`. The build is committed as `a57ce61a13`. AC-009 became `Met` on 2026-11-13, after the last old id under `ADV`, a fixture head in `tests/command-offer.vitest.ts`, was changed to `command-speckit-plan`.
<!-- /ANCHOR:closure -->
