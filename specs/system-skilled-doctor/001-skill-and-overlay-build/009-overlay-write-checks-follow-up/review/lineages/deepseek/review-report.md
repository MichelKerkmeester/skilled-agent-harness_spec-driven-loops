# Deep Review Report — Phase 9 overlay write checks follow-up

Mode: review · Session `fanout-deepseek-1794439428470-vyb51k` · Generation 1 · Lineage `new` · Executor `cli-pi model=deepseek-v4.1-flash-1017` (detached fan-out lineage)
Review target: commits `c57b7e4cef..e97ca56e8d` on `main` — `.skilled/commands/doctor/scripts/overlay-engine.cjs`, its `tests/overlay-engine-*.test.cjs`, `.skilled/hooks/overlay-guard/opencode/`, `.skilled/commands/doctor/overlay.md` with `_routes.yaml` and `assets/doctor-overlay-*`, `.skilled/skills/system-skilled-doctor/references/overlays.md` and its `manual-testing-playbook/overlays/`
Iterations: 3 of 3 (stop policy `max-iterations`, stop reason `maxIterationsReached`)

---

## 1. Executive Summary

- **Overall verdict: CONDITIONAL**
- **hasAdvisories: false** (the reducer-owned value; four active P2 advisories are listed in Deferred Items)
- **Active findings:** P0 = 0 · P1 = 3 · P2 = 4
- **Review scope:** 16 files under the declared target; all four dimensions reviewed (correctness, security, traceability, maintainability). The regenerated trigger index and retrieval fixtures carried in the same commit range were treated as generator output, not review target.
- **Operator review focus:** Data-loss and safety paths first: lock takeover, layout link retarget, removal of dropped json-entry items, apply --relayout moves and backups. Then the strict write checks, the commit check and status --audit, the OpenCode adapter, and whether the command documents match the engine.

**What this verdict means.** No finding carries a P0 (no destructive data loss on a contract-allowed input). Three P1s must be fixed before this phase can close: a lock the previous release wrote is never taken over, `apply --relayout` can leave a live layout link dangling with no engine command that repairs it, and the relayout backup reads token-named files the documented `protectedPaths` control forbids `apply` from reading. Two of the three are on the exact paths the operator focus named first.

**What was confirmed clean.** Dropped-item removal is correctly gated on the recorded bytes and the entry's identity; the strict-write guard, the commit check's line-ending compare and the `**/` glob rewrite behave as specified; `status --audit` excludes managed, generated and dotenv paths and fails the status as the documents say; the OpenCode adapter resolves to `.opencode/plugins/overlay-guard.js`, shares one byte-identical core with the CLI hook family, and covers all four REQ-013 cases in its tests; REQ-001 holds at exactly 8 trigger phrases.

---

## 2. Planning Trigger

`/speckit:plan` **is required**: three active P1 findings have concrete file:line evidence and each needs a code change plus a test that fails today.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    { "id": "R1-P1-001", "severity": "P1", "dimension": "correctness", "file": ".skilled/commands/doctor/scripts/overlay-engine.cjs:2236" },
    { "id": "R1-P1-002", "severity": "P1", "dimension": "correctness", "file": ".skilled/commands/doctor/scripts/overlay-engine.cjs:4740" },
    { "id": "R2-P1-001", "severity": "P1", "dimension": "security", "file": ".skilled/commands/doctor/scripts/overlay-engine.cjs:4622" },
    { "id": "R2-P2-001", "severity": "P2", "dimension": "security", "file": ".skilled/commands/doctor/assets/doctor-overlay-presentation.txt:540" },
    { "id": "R3-P2-001", "severity": "P2", "dimension": "traceability", "file": ".skilled/commands/doctor/assets/doctor-overlay-status.yaml:58" },
    { "id": "R3-P2-002", "severity": "P2", "dimension": "traceability", "file": ".skilled/skills/system-skilled-doctor/manual-testing-playbook/overlays/relayout-moves-sources.md:44" },
    { "id": "R3-P2-003", "severity": "P2", "dimension": "traceability", "file": ".skilled/skills/system-skilled-doctor/manual-testing-playbook/overlays/stale-lock-takeover.md:48" }
  ],
  "remediationWorkstreams": [
    "WS-1 lock takeover accepts the owner line an earlier release wrote",
    "WS-2 relayout never leaves a live link the follow-up apply cannot retarget",
    "WS-3 the relayout backup honours the protectedPaths read control",
    "WS-A docs and playbook corrections (P2, advisory)"
  ],
  "specSeed": "Phase 9 needs a follow-up: one REQ for the lock line format, one for the relayout link outcome, one restating the protectedPaths read control over every read path; plus the two playbook scenarios and the one workflow text that the P2s name.",
  "planSeed": "T-A: teach isLockOwnerGone that a pid with no host token is a local pid, with a test built from the earlier owner-line shape. T-B: make relayout refuse, record, or repair a link it rewrites, with a playbook scenario that carries a layout link. T-C: route the relayout backup through the same read check the planner uses, with a test on a token-named file inside a moved folder. T-D: fix the status workflow text and the presentation skipped row.",
  "findingClasses": [
    "producer-branch gap",
    "cross-command state gap",
    "control bypass on a second read path",
    "documentation-wording mismatch",
    "documentation cross-reference to a non-existent route",
    "coverage gap on a documented outcome",
    "coverage gap on an input the earlier release left on disk"
  ],
  "affectedSurfacesSeed": [
    ".build-lock and every vendoring project that upgrades with a leftover lock",
    "sync-state.json link records and layout links created before this release",
    "relayout-runs/<stamp>/ backup folder and its commit exposure",
    "protectedPaths and the two places isProtectedReadPath is consulted",
    "the status route's display step and the presentation next-command table",
    "the manual-testing-playbook relayout and lock scenarios",
    "overlay-engine-follow-up.test.cjs fixtures"
  ],
  "fixCompletenessRequired": true
}
```

---

## 3. Active Finding Registry

| ID | Sev | Title | Dimension | file:line | Evidence | Impact | Fix recommendation | Disposition | findingClass | scopeProof | affectedSurfaceHints |
|---|---|---|---|---|---|---|---|---|---|---|---|
| R1-P1-001 | P1 | Legacy lock line is never taken over | correctness | `.skilled/commands/doctor/scripts/overlay-engine.cjs:2236` | `isLockOwnerGone` requires ` pid=(\d+) ` **and** ` host=(\S+) `; `git show c57b7e4cef:...:1981` shows the earlier owner line had no host token | A lock left by a killed run of the earlier release still blocks every later run until a hand delete | Treat a pid with no host token as a local pid (the earlier format could only be written locally), or read the line as local when the host token is absent, and add a test built from the earlier shape | Open | producer-branch gap | One writer (`:2255`) and one reader (`:2234`) of the lock line; no other code path rewrites or normalizes it | `.build-lock`, `apply`/`capture`/`adopt`/`relayout`, `overlays.md:99`, lock tests `:107-148` |
| R1-P1-002 | P1 | `apply --relayout` leaves a live layout link dangling and the documented follow-up apply cannot retarget it | correctness | `.skilled/commands/doctor/scripts/overlay-engine.cjs:4740` | `:4740` says the live link is left alone; `:4742` writes only the manifest; the retarget gate is `isRecordedLink` (`:1662`, `:1701`) and `loadState` defaults `links` to `{}` (`:488`) | A tree whose state predates the link records gets a dangling link and `BLOCKED layout: ... exists but is not the link to ...`, exit 1 — the documented outcome is unreachable and no engine command repairs it | Either retarget the live link inside relayout for a link that still points where the manifest said, or record the pre-move target so the follow-up apply can retarget it; add a playbook/test fixture that carries a layout link | Open | cross-command state gap | No relayout path calls `ensureSymlink` or `writeStateIfChanged`; `planLayoutLinks` needs either `current === link.target` or a state record | `overlay.md:108`, `references/overlays.md:91`, `apply.yaml:104`, `_routes.yaml:664`, `presentation.txt:113`, `relayoutLinkTargets:4633` |
| R2-P1-001 | P1 | `apply --relayout` reads and copies token-named files that `apply` refuses to read | security | `.skilled/commands/doctor/scripts/overlay-engine.cjs:4622` | `copyForBackup` skips only `isEnvName` (`:4618`) and reads every other file (`:4622`); `isProtectedReadPath` (`:1899-1901`) is consulted only at `:2001` and `:2137` | Bytes of a file the reference says may be read only when an entry names it exactly are read and written into `relayout-runs/<stamp>/`, a folder the documented gitignore example does not exclude | Apply the same read check to the backup walk: skip a token-named path the entry's `protectedPaths` does not name, and print it as `skipped` | Open | control bypass on a second read path | The only read on the relayout path is `:4724 → :4622`; the two protected-read call sites are both in the apply planner | `relayout-runs/<stamp>/`, `protectedPaths`, `references/overlays.md:103,106`, `presentation.txt:540` |
| R2-P2-001 | P2 | The relayout `skipped` row names the wrong rule and the wrong outcome | security | `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:540` | The engine skips only a dotenv name (`:4580`, `:4618`); a nested dotenv moves with its folder (`:4732`) | An operator is told a credential file "never opened … stayed where it was" when it may have moved with its folder | Reword the row: a `skipped` line means a dotenv-named copy was not backed up, and a top-level one stayed while a nested one moved with its folder | Open | documentation-wording mismatch | The only producer of `skipped` is `:4715`/`:4618`; the move is one `renameSync` of the folder | `presentation.txt:518`, `:540`, `overlays.md:103` |
| R3-P2-001 | P2 | The status workflow names `/doctor:overlay relayout`, a target that does not exist | traceability | `.skilled/commands/doctor/assets/doctor-overlay-status.yaml:58` | The router binds `status|apply|repin` (`overlay.md:55-61`); `COMMAND_WORDS` has no `relayout` (`:96`); every other doc prints `/doctor:overlay apply --relayout` | The operator copies a command that fails with the unknown-target message | Change the step to name `/doctor:overlay apply --relayout`, and the `:28` invariant to `apply --relayout` | Open | documentation cross-reference to a non-existent route | The string occurs exactly once in the tree | status route display step, `overlay.md` §3, `presentation.txt` next-command table |
| R3-P2-002 | P2 | No playbook scenario or test exercises the relayout link retarget the reference promises | traceability | `.skilled/skills/system-skilled-doctor/manual-testing-playbook/overlays/relayout-moves-sources.md:44` | Both relayout scenarios build `"layoutLinks":[]`; `tests/overlay-engine-follow-up.test.cjs:549` does the same | The documented retarget outcome is verified nowhere and `relayoutLinkTargets` has no regression guard | Add a scenario and a test whose manifest carries a layout link into the moved copy | Open | coverage gap on a documented outcome | The relayout link branch is `:4633-4655` and `:4673-4690`, untouched by every fixture | `references/overlays.md:91`, `overlay.md:108`, `presentation.txt:113`, `apply.yaml:104` |
| R3-P2-003 | P2 | The canonical lock scenario writes only the current owner-line format | traceability | `.skilled/skills/system-skilled-doctor/manual-testing-playbook/overlays/stale-lock-takeover.md:48` | `:48` and `:54` both write `pid=%s host=%s %s`; the four lock tests cover dead pid, live pid, no pid, another host | A green scenario is read as proof the takeover works for every lock on disk | Add one step that writes the earlier shape and expects the takeover | Open | coverage gap on an input the earlier release left on disk | The scenario calls itself the canonical operator contract at `:10` | this scenario, `references/overlays.md:99`, `:107-148` lock tests |

No finding is contested; no finding was downgraded at the final self-check. Each P1's Hunter/Skeptic/Referee pass is recorded in its iteration file under the claim-adjudication packet.

---

## 4. Remediation Workstreams

**P1 — must fix before the phase closes**

1. **WS-1 · Lock takeover across the release boundary** (R1-P1-001). One condition in `isLockOwnerGone`, one test built from the earlier owner-line shape, one playbook step (which also closes R3-P2-003). Watch the cross-host case: a lock from another host must still refuse.
2. **WS-2 · Relayout and the live link** (R1-P1-002). Decide the contract: retarget inside relayout, or record the pre-move target so the follow-up apply may retarget. Either way the tree must never be left with a link no engine command can repair. Add the missing fixture (which also closes R3-P2-002).
3. **WS-3 · Protected reads on the relayout backup** (R2-P1-001). Route the backup walk through the same check the planner uses. Keep the `skipped` line truthful for both the top-level and nested dotenv cases.

**P2 — advisory, schedule with the above**

4. **WS-A · Documentation corrections.** `presentation.txt:540` and `:518` (R2-P2-001), `doctor-overlay-status.yaml:58` and `:28` (R3-P2-001).

---

## 5. Spec Seed

- Add a requirement that the lock takeover reads every owner-line shape this repository has ever written, naming the earlier `pid=<n> <stamp>` shape and the cross-host refusal in the same row.
- Restate REQ-011 so it says what happens to the live link: either relayout retargets it, or it records the pre-move target so the follow-up apply may.
- Extend the credential requirement (currently an NFR under "Security") to say it holds for **every** read path, naming the relayout backup and the capture path, so a future read path cannot bypass it silently.
- Add one line to REQ-015 that a workflow may name only a target the router binds or a flag the engine accepts.
- Add a requirement that every new operator-facing behaviour has a playbook scenario whose fixture can actually reach it.

## 6. Plan Seed

- `T-A` Read `isLockOwnerGone` and `acquireLock`; add the host-absent branch; add a test that writes the earlier shape through `printf`; add the playbook step.
- `T-B` Read `relayoutUnderLock`, `relayoutLinkTargets`, `planLayoutLinks` and `loadState`; pick the contract; implement; add a fixture with a layout link into the moved copy in the follow-up suite and in the relayout scenario.
- `T-C` Read `copyForBackup` and `isProtectedReadPath`; pass the entry's allowed paths into the backup; add a test with a token-named file inside a moved folder.
- `T-D` Fix the two display texts; rerun `route-validate.sh` and the contract test.
- `T-E` Rerun the whole gate after each fix: `node --test tests/` in `.skilled/commands/doctor/scripts`, `route-validate.sh`, the OpenCode hook tests, `sync-runtime-mirrors.cjs --check`, `quality-gate.cjs`.

## 7. Traceability Status

**Core Protocols**

- `spec_code` — **partial**. Verified: REQ-001 (8 trigger phrases), REQ-003 on the apply path, REQ-004 (recorded-item provenance and the hand-edit refusal), REQ-005, REQ-006, REQ-007, REQ-009, REQ-010, REQ-012, REQ-013. Not met: REQ-002 for a lock the earlier release wrote (R1-P1-001), REQ-011's link retarget (R1-P1-002), and the security NFR behind R2-P1-001. REQ-017 depends on `tasks.md` T027/T028, still open.
- `checklist_evidence` — **partial**. `tasks.md` T005, T006, T009, T010, T013, T014, T015, T018 are marked `[x]`; three of those verify sentences mis-state what the tests do (T005 omits the legacy shape, T013 names no link retarget, T015 says "allows an owned one"). CHK-010 to CHK-051 are all unticked, so the checklist claims no lint, docs or file-organization result this review could contradict.
- `AC_COVERAGE` — **exempt**: the review target type is `files`, not a spec folder.

**Overlay Protocols**

- `skill_agent` — **pass**: `overlay.md:6` carries `<!-- skill_agent: system-skilled-doctor -->`, and every document read lives in that skill.
- `agent_cross_runtime` — **pass**: the OpenCode adapter is a relative symlink to `.opencode/plugins/overlay-guard.js`; all four imports resolve; `.opencode/hooks/overlay-guard/lib/overlay-guard.cjs` is byte-identical to the `.skilled` copy; the `command-contract.json` overlay hunks agree with the router.
- `feature_catalog_code` — **notApplicable**: no feature catalog exists for `system-skilled-doctor`.
- `playbook_capability` — **partial**: seven scenarios read; three match the engine exactly (the protected-path `MISS` line, the lock refusal lines, the relayout print order); two carry the coverage gaps in R3-P2-002 and R3-P2-003; two read only for fixture shape.

---

## 8. Deferred Items

- **Barter's tree** was not available, so none of Barter's six reported problems could be re-verified from its own evidence; `handover-to-barter.md` is the packet's record of them.
- **`route-validate.sh`, `node --test`, `sync-runtime-mirrors.cjs --check` and `quality-gate.cjs` were not run**: this lineage may not write outside its own directory, so every claim rests on direct reads of code, tests, documents and the git history. Test *existence and content* is verified; test *execution* is not. The next agent to run the phase's gates should treat that as the one unclosed evidence gap.
- **`tasks.md` T022 to T028** (commit, 5-iteration review, fresh-Opus synthesis, fix plan, alignment, changelog, tag) remain open by plan. The `system-skilled-doctor` skill version still reads `1.1.5.0`; T027 owns the `v1.1.6.0` note.
- **The hook's fail-open rule** and **the pin-moving-commit skip** are stated contracts and out of scope, as the spec says.
- **The regenerated trigger index and retrieval fixtures** in this commit range were treated as generator output, not reviewed.

## Dimension Expansion Map

- Dimensions reviewed: correctness (iteration 1), security (iteration 2), traceability and maintainability (iteration 3).
- Completed pivots: 2 (correctness → security, security → traceability/maintainability). Failed pivots: 0. Audited overrides: 0.
- Swept directions: none repeated; each iteration entered a new surface.
- Pivot lineage: D1 CONDITIONAL → D2 CONDITIONAL → D3/D4 CONDITIONAL (P2 advisories only).
- Remaining frontier: `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs` was never opened by this lineage; the respect in which its 223 added lines do or do not pin the four review-named defects is unverified here.

## 9. Search Ledger

Review-depth state was captured per iteration as `filesReviewed`, `traceabilityChecks`, `ruledOut` and `graphEvents` rather than as v2 `searchLedger` rows (the fan-out lineage rendered v1 records). What each iteration actually searched:

- **Iteration 1** — read every function on the four operator-named safety paths end to end, then read the document sentences that describe them; ruled out 5 candidate defects (backup-after-move, midway rename, hand-edit deletion, empty-file lock window, item-key loss). 2 findings.
- **Iteration 2** — read the strict-write guard, the commit check, the glob compiler, the audit and the OpenCode adapter, then resolved the adapter through its symlink and checked every import; ruled out 6 candidates (broken imports, patch-body parsing, exclude shadowing, CRLF compare, fail-open git, tool-vocabulary drift). 2 findings.
- **Iteration 3** — compared every route step, workflow step, presentation row and playbook scenario against the engine's print order, exit codes and flags; ruled out 6 candidates (audit exit code, status lock, "then applies", stale MISS wording, skill version, contract drift). 3 findings.

*Search-depth v2 fields (`reviewDepthApplicability`, `targetSelection`, `searchCoverage`) are absent because the lineage emitted v1 records; the registry consumed all three deltas cleanly (`openFindingsCount` 7, `corruptionCount` 0).*

## 10. Audit Appendix

**Convergence.** Weighted new-finding ratio per iteration: 1.000 (2 P1), 0.375 (1 P1 + 1 P2), 0.158 (3 P2). Trend falling; the loop stopped on the `max-iterations` cap, not on convergence, so the last iteration's P2s are not evidence of exhaustion.

**Coverage.** Sixteen files read; three of the four dimensions closed with code-level evidence. Findings per dimension: correctness 2, security 2, traceability 3, maintainability 0. No P0.

**Ruled-out claims (17 total).** Correctness: backup-after-move, midway rename as data loss, dropped-item hand-edit deletion, lock empty-file window, item-key loss on a throwing plan. Security: broken adapter imports, write-as-patch parsing, exclude shadowing an owned path, CRLF compare, fail-open commit check without git, cross-runtime tool vocabulary. Traceability/maintainability: audit exit code, status lock, relayout "then applies", stale playbook MISS wording, missing skill version, contract drift.

**Sources reviewed.** `overlay-engine.cjs` (lock, layout-link, json-entry, apply, relayout, status, audit, guard, commit-check and CLI sections, ~1,900 lines read); `tests/overlay-engine-follow-up.test.cjs`; `tests/overlay-engine-strict-writes.test.cjs` (not opened — see frontier); `.skilled/hooks/overlay-guard/opencode/overlay-guard.js` and its resolved target; `.skilled/hooks/overlay-guard/{lib,dsh,cursor}/`; `tests/opencode-overlay-guard.test.mjs`; `overlay.md`; `_routes.yaml`; `assets/doctor-overlay-{status,apply}.yaml`; `assets/doctor-overlay-presentation.txt`; `references/overlays.md`; three playbook scenarios in full and four in part; `sk-create-command/assets/command-contract.json`; `spec.md` and `tasks.md`; the `git diff` and `git show` of `c57b7e4cef`.

**Cross-reference appendix.**

*Core Protocols* — `spec_code`: partial; `checklist_evidence`: partial; `AC_COVERAGE`: exempt.
*Overlay Protocols* — `skill_agent`: pass; `agent_cross_runtime`: pass; `feature_catalog_code`: notApplicable; `playbook_capability`: partial.

**Release readiness:** `in-progress` — `stopReason` is `maxIterationsReached` with three active P1s, so the packet is neither `converged` nor `release-blocking`.
