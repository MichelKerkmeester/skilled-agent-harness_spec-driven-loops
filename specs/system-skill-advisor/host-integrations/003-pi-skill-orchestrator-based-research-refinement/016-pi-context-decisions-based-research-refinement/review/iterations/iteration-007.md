# Iteration 7: maintainability, adversarial recheck of G5-I6-P1-001, seed-bound parity, unread-module sweep

## Dispatcher

- Run 7 of 7 (extended run, lineage completed-continue, generation 5, session 2026-11-23T21:41:17.101Z), native @deep-review LEAF.
- Iteration number derived from the state log: 6 iteration records, so this is 7, matching the prompt pack.
- Operator focus addressed: every read stayed on runtime/ (lib, scorer, scripts including the Python fallback) and hooks/. The one prose claim checked is a code comment in a runtime file (shared-payload.ts:6-7) that names a CI workflow, so it counts as a comment contradicting the repository.
- Doctrine loaded: .skilled/skills/sk-code/sk-code-review/references/review-core.md section 2 (severity, reach calibration).

## Dimension

Maintainability, with an adversarial recheck. Three jobs: (1) a Skeptic pass on G5-I6-P1-001; (2) whether the TypeScript-only seed bound is a parity gap; (3) a sweep of the five largest scope files no earlier narrative cites.

## Files Reviewed

- .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:165-180, :255-330, :395-440
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:448, :490-560
- .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1607-1652
- .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-parity.vitest.ts:41-52, :132-157 (context, test)
- .skilled/skills/system-skill-advisor/runtime/tests/scorer/typed-command-routing.vitest.ts:59-70 (context, test)
- .skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:125-211 (context, test)
- .skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json (context, 74 entries)
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl (context, 196 rows)
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs:1-53
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs (header, every catch site, function-length table)
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs (header, every catch site)
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs (header, catch and TODO scan)
- .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py (header, except and TODO scan)
- .skilled/skills/system-skill-advisor/runtime/lib/shared/shared-payload.ts:1-45, :236-237, full diff against its source
- .skilled/skills/system-spec-kit/runtime/lib/context/shared-payload.ts (context only, outside the target)

## Findings - New

### P0 Findings

None.

### P1 Findings

None new.

### P2 Findings

1. **The local copy of the shared payload contract names a drift watcher that does not exist, and the two copies have already drifted** -- .skilled/skills/system-skill-advisor/runtime/lib/shared/shared-payload.ts:6 -- The header says the file is "Duplicated from system-spec-kit/runtime/lib/context/shared-payload.ts" and that "Drift is watched by .github/workflows/isolation-check.yml's reverse-direction audit" [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/shared/shared-payload.ts:4-7]. That workflow is not in the repository. `ls .github/workflows` lists no isolation workflow, and `git log -1 -- .github/workflows/isolation-check.yml` returns da72e9676b0 ("remove the shared code-graph contracts and its consumers"), the commit that removed it. Even when it existed, the comment describes it as catching "any new cross-skill import", which is not content drift. The copies differ on 115 diff lines today. Some of that is the planned inlining of `assertNever` and the label sanitizer [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/shared/shared-payload.ts:13-45]. Some of it is contract: the advisor copy accepts two envelope kinds, `startup_brief` and `session_snapshot`, that the spec-kit copy does not [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/shared/shared-payload.ts:236-237]. The spec-kit copy also carries doc comments on each exported type that the local copy lost. No test under runtime/tests names shared-payload, so nothing compares the two copies.
   Finding class: stale-guard-claim / duplicated-contract-drift
   Scope proof: shared-payload.ts is in reviewScopeFiles; the spec-kit copy and the workflows folder were read only as context
   Affected surface hints: .skilled/skills/system-skill-advisor/runtime/lib/shared/shared-payload.ts:1-45 and its kind list near :236; a content-level comparison test, or a header that names the real guard
   Case: a fix to the envelope validation in .skilled/skills/system-spec-kit/runtime/lib/context/shared-payload.ts lands, no CI job compares the copies, so the advisor keeps the old check while its header tells the next maintainer that CI watches for drift.

## Skeptic recheck of G5-I6-P1-001 (job 1)

Severity I would defend: **P1, kept**. Confidence drops from 0.8 to 0.7. No severity-change row is emitted.

- tmpdir(): on macOS, `os.tmpdir()` returns `$TMPDIR`, a per-user `/var/folders/.../T/` folder with mode 0700, so another account cannot pre-create the metrics folder. On Linux, `$TMPDIR` is usually unset, so it returns `/tmp`, which is shared and mode 1777. The metrics root is `join(tmpdir(), 'speckit-skill-advisor-metrics')` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:171]. Linux `fs.protected_symlinks` does not help: it applies only to sticky world-writable folders, and the attacker's 0755 metrics folder is neither.
- Hosts: the hooks ship for Claude, Pi, Vibe and DSH (hooks/claude, hooks/pi, hooks/vibe, hooks/dsh). Nothing in the target restricts them to macOS, and the code carries non-darwin branches (iteration 6). So a Linux host with more than one account is within the stated contract. At a trust boundary such as a shared temp folder, review-core.md section 2 brings every value the outside can send into reach. The downgrade trigger, a documented and enforced macOS-only runtime, is not met.
- What a record holds: by default the diagnostic writer strips `skillLabel` and `errorDetails`, and keeps them only when SKILL_ADVISOR_DEBUG is set [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:422-428]. This weakens the disclosure half of the claim. An attacker who plants a regular file they own sees only timing, cache-hit and generation fields. The integrity half does not depend on content. `appendFile` and then `chmod(path, 0o600)` follow a planted symlink [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:308-309] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:271-276]. A failed folder chmod only sets `dirReady = false` and the write still goes ahead [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:259-266]. So any file the victim owns gets a JSON line appended and its mode changed to 0600, on every prompt by default. An attacker-owned folder can also feed forged outcome lines to advisor_status and advisor_validate.
- New detail from this pass: the trim path reads through the symlink and then renames a temp file over the link [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:310-321]. Once the target holds more than 300 lines, a copy of its last 200 lines ends up in the attacker's folder. The copy has mode 0600 and the victim owns it, so the attacker cannot read it but can delete it. This adds no disclosure.
- Why P1 and not P2: the reach is named and the code's own comment promises the guarantee ("only that user may read them", metrics.ts:172). Two sibling stores already enforce it (route-receipt.ts:282-290, directive-lifecycle-store.py:38-69). The impact is victim-side file corruption and a mode change through a path the attacker chooses. G5-I2-P1-001 was accepted at P1 on the same shared-/tmp threat model, and a lower call here would be inconsistent. It stays below P0 because the attacker does not choose the content and there is no code execution.

## Seed-bound parity (job 2)

Ruled out as a separate finding. The seed bound is a deliberate TypeScript-only behavior, and the parity design catches its routed effect where the corpus reaches it.

- The bound and its marker exist only in TypeScript [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:493-560], with `SEED_BOUND_GAP = 0.000001` at fusion.ts:448. The Python `_apply_graph_boosts` only adds transitive boosts to targets that already score and never caps one [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:1607-1652].
- The parity tests do not compare mechanisms. They compare top-1 outcomes. `local-native-divergence-ratchet.vitest.ts` runs the Python scorer over the union of the labeled and harder corpora and keys every top-1 divergence against an approved ledger (local-native-divergence-ratchet.vitest.ts:125, :171, :204-207). If the missing bound changed a corpus route, that divergence would fail the ratchet unless someone approved it. The labeled corpus holds 14 typed-command prompts out of 196 rows. The ledger holds 3 approved typed-slash divergences (/deep:review, /deep:research, /memory:save), and the reason recorded for each is alias naming or tie-breaking, not graph lending.
- The two other parity surfaces do not reach the bound. `skill-advisor-cli-parity.vitest.ts:41-52` has nine "Use <skill>" prompts and no typed slash command. `typed-command-routing.vitest.ts:59-70` pins the bound on a fixture graph against `scoreAdvisorPrompt` only, with no Python run.
- Verdict: the parity tests should catch this gap only where the corpus routes differently, and the ratchet does that. A corpus row that triggers the bound on the live graph would make the test stronger. That is test coverage, already covered in substance by G5-I3-P2-001 (fallback predicates with no shared fixture). It does not need a new finding.

## Unread-module sweep (job 3)

95 of the 154 reviewScopeFiles are not cited by any narrative from iterations 1 to 6. The five largest:

| File | Lines | Result |
|---|---|---|
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs | 2734 | Clean. All five bare catches carry a reason and convert the error to a typed result or a `LogError` (:1918-1925, :2097-2103, :2724-2730). The longest function is `execBodyCommand` at about 174 lines (:351). It is long but a single parser, so no finding. |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs | 1527 | Clean. The catches at :311-317, :360-366 and :1507-1513 return null or false on a parse failure or an entry-point check, and each call site handles that. |
| .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs | 1333 | Clean on the swallowed-error and TODO scan. Line-by-line reading not done. |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py | 1188 | Clean on the scan: no `except:` or `except Exception` and no TODO. Line-by-line reading not done. |
| .skilled/skills/system-skill-advisor/runtime/lib/shared/shared-payload.ts | 1107 | One P2 (G5-I7-P2-001). |

Limit, stated honestly: the 24-call budget allowed headers, every catch site and a function-length table, not a full line-by-line read of about 7,900 lines. The searchLedger row records this as a scan.

## Traceability Checks

- spec_code (core): partial. A new comment-versus-repository contradiction: shared-payload.ts:6-7 names a CI watcher that commit da72e9676b0 removed. The contradictions carried forward (G5-I1-P1-001, G5-I2-P2-001, G5-I6-P1-001 at metrics.ts:172) are unchanged.

## Integration Evidence

- CI surface: .github/workflows/, listed. It has no isolation-check.yml. Only routing-registry-drift.yml, skill-advisor-stress.yml and skill-doc-frontmatter.yml match the advisor.

## Edge Cases

- G5-I6-P1-001 rests on a multi-account Linux host. On a single-user Mac it cannot be reached. That stays the downgrade trigger.
- The seed-bound check relies on the ratchet run by iteration 2 (vitest 206/206). This pass did not rerun it.

## Confirmed-Clean Surfaces

- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs: error handling at every catch site.
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs: error handling at every catch site.

## Ruled Out

- The missing Python seed bound as its own parity finding: the divergence ratchet catches any routed effect on the corpus, and the leftover test-coverage gap belongs under G5-I3-P2-001.
- A downgrade of G5-I6-P1-001 to P2: the reach is named on Linux, and the default prompt-free record weakens only the disclosure half.

## Next Focus

- Dimension: synthesis. This is the last iteration of the run.
- Focus area: carry list for synthesis. Active: three P1s (G5-I1-P1-001, G5-I2-P1-001, G5-I6-P1-001) and 16 P2s.
- Reason: the max-iterations stop is reached.
- Rotation status: all four dimensions covered, and the extension passes cleared depth.
- Blocked/productive carry-forward: do not reopen the parity suites or the trust-boundary scan. A future pass could read derive-command-bridges.cjs and skill_graph_compiler.py line by line, and the other 90 uncited files.
- Required evidence: none for this run.

## Verdict

Three P1s and no P0 remain active. This pass kept G5-I6-P1-001 at P1 and added one P2.

Review verdict: CONDITIONAL
