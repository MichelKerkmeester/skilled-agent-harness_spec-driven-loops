# Review Iteration 002

## Dispatcher

- Lineage: `docs-merge-10`, area `docs-merge`.
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder).
- Focus: security and maintainability, the two dimensions iteration 1 left open. The pass-ten operator focus still binds: each docs claim is judged against HEAD code, and each merge path is judged for both-side retention. This iteration re-read the nine scope files under these two lenses and checked the surfaces the first pass named but did not exercise.
- Iteration 1's four findings were carried forward, not re-reported; their status is unchanged and their evidence was re-read for the final verdict.
- `steer.md` does not exist in the lineage directory, so no lead ruling applied.
- The holdout rule and the recorded limits were honoured exactly as in iteration 1.

## Files Reviewed

| File | Lines read | Security lens | Maintainability lens |
|------|-----------|---------------|----------------------|
| `.skilled/skills/system-skill-advisor/README.md` | 1-280 (re-read the changed paragraph and both runtime lists) | No secret, token, shell example or trust boundary in the changed line | The Vibe omission remains a reader trap; the 47-row sentence is exact |
| `.skilled/skills/system-skill-advisor/SKILL.md` | 1-223 (re-read the changed sentence and the adapter list) | `hookHealth` is prompt-free by construction | Adapter list still omits Vibe |
| `.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md` | 1-251 (re-read the hook and no-edit sections) | The example record carries no prompt text | Summary-vs-body no-edit mismatch remains |
| `.env.example` | 401-416 (re-read the changed block in place) | The added variable is a path with no credential; the file stays a template | The comment names the scorer and its default in one line |
| `.skilled/skills/sk-doc/SKILL.md` | 1-153 (re-read the mode table and version authority) | No executable surface | Hub version and changelog agree |
| `.skilled/skills/sk-doc/sk-create-skill/ROUTER.md` | 1-208 (re-read the resource map and pseudocode) | No path escapes the skill root; `_guard_in_skill` enforces containment | Eight assets named and eight present; parent tree names real files |
| `.skilled/commands/doctor/assets/doctor-install-presentation.txt` | 1-204 (re-read the step table and status lines) | No secret; the printed commands are operator-run | The "nine" count and the stale DSH pair remain the two defects |
| `.skilled/changelog/skilled/v4.0.2.1.md` | 1-405 (re-read the Vibe and Skill Advisor sections) | The dotenv-guard description names no value and no key | The Vibe count and rank claims hold; the 18-entry count is exact |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts` | 1-373 (re-read the merged suites) | The holdout guard refuses a per-row publication; the fixture writes only to a temp dir | Both merged suites are independent and use real exported fields |

Context evidence (read-only, outside the nine scope paths): `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:50-64,442-463`, `.skilled/commands/doctor/assets/symlink-manifest.json:runtimes`, `.skilled/commands/doctor/scripts/symlink-engine.cjs:428-444`, `.vibe/hooks.toml:1-152`, `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:1-80`, `.skilled/skills/system-skill-advisor/runtime/tests/command-meaning-anchor.vitest.ts:435-449`.

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. Carried active: F001 (the doctor-install contract test still pins the pre-merge presentation text).

### P2 Findings

None new. Carried active: F002 (the "nine" count), F003 (the Vibe omission in both runtime enumerations), F004 (the no-edit release bullet).

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `agent_cross_runtime` | pass | The runtime adapter set is complete at HEAD: `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs` proxies the compiled Claude handler, Pi and DSH lazily import the same module, and the six thin shims under `system-spec-kit/runtime/hooks/` exist. The one defect is documentation, not adapter coverage: `README.md:244` and `SKILL.md:205` omit Vibe (F003). |
| `skill_agent` | pass | `.skilled/skills/sk-doc/SKILL.md:29` and `.skilled/skills/sk-create-skill/ROUTER.md:27,33,97` agree with `.skilled/commands/create/sk-skill.md` on `/create:sk-skill`; `/create:skill-parent` also resolves. |
| `feature_catalog_code` | notApplicable | No feature-catalog claim is touched by the nine files. |
| `playbook_capability` | notApplicable | No playbook claim is touched by the nine files. |

## Integration Evidence

- **Prompt-free hook record:** `metrics.ts:50-64` declares a closed schema of timestamp, runtime, status, freshness, duration, cacheHit and optional diagnostics; `persistAdvisorHookDiagnosticRecord` destructures away `skillLabel` and `errorDetails` unless `SKILL_ADVISOR_DEBUG` is set (`:451-463`). The eager write path passes `requireDebug: false`, so a disabled hook still records. The changelog's "no prompt text" and "disabled hook writes one too" claims hold.
- **Holdout guard:** the merged test's `publishedHoldoutIds` reads `rows`, `attachedRows`, `typedRows` and `needsModeRows`; the baseline publishes none of the corpus's holdout ids, and the test fails on a corpus that marks no holdout row. The guard is a real publication check, not a tautology.
- **Doctor runtime manifest:** `symlink-manifest.json` has eight runtime keys; `symlink-engine.cjs:435-438` throws `unknown runtime` for anything else. The merged presentation's eight-name list is the accepted set, and "nine" is the error in F002.
- **Doctor contract consumer:** `doctor-install-contract.test.cjs:240-241` asserts the pre-merge sentences; HEAD's asset has neither. F001 stays active.
- **Vibe hook count:** `.vibe/hooks.toml` has 18 `[[hooks]]` entries, and the presentation's operator-facing runtime list includes `vibe` and `dsh`; the manifest backs both.
- **Merged routing test fields:** `capture-command-routing-baseline.mjs` exports `assertFitRowsUnique` and emits `plain_stages` and `fit`; the merged tests read those exact fields, so the branch's tests and main's host-selection tests compose rather than shadow each other.

## Edge Cases

- **Measurement claims:** the Vibe 18-entry count, the 8-of-24 sealed decline rows and the 28-of-45 tuned count were checked against `.vibe/hooks.toml` and the committed baseline aggregates and hold. The changelog's sealed-row fixture count of "1" does not map cleanly to the baseline's `plain.holdout` fields (`own=2`, `attached=0`, `combined=2`); the sentence may describe the bench's own fixture regime rather than this capture, so it is recorded as unverified rather than as a finding.
- **Command inventory words:** the changelog's "44 tracked commands" names the command files, while `TRACKED_COMMANDS` holds 63 command strings and `COMMAND_ROWS` 57 ids; the README's "47 command rows" names the scorer rows. The three numbers describe three inventories and are not in conflict.
- **Version words:** `README.md` carries a document version (0.12.22.0) while `SKILL.md` and `changelog/v1.1.0.0.md` carry the skill release (1.1.0.0). The advisor has no `description.json` version file to reconcile, and the hub's own version-authority rule applies to `sk-doc`, not here.
- **Security lens:** the nine files are prose, a template and a test. The changed `.env.example` line is a test-only path, not a credential, and the changed docs contain no token, shell expansion, absolute secret or trust-boundary decision. A clean result, not skipped coverage.
- **Maintainability lens:** the two runtime enumerations and the stale DSH line are the whole future-reader cost; no third duplicate or dead reference was found across the nine files.

## Confirmed-Clean Surfaces

- **Doctor step table:** the six ordered steps, their classes and the caveat line are internally consistent and match the route assets they point at.
- **sk-doc version authority:** `SKILL.md`, `description.json`, `mode-registry.json`, `hub-router.json` and `changelog/v2.10.0.0.md` all read 2.10.0.0.
- **ROUTER resource map:** every markdown path in `RESOURCE_MAP` exists, and the eight skill templates named in the intent model are present.
- **Merged routing test:** imports, helper types and both `describe` blocks are coherent; no duplicate helper, unused import or missing export.
- **v4.0.2.1 merge:** the branch's Vibe section and main's Node, dotenv and handover sections both survive; the 98 main-side lines and the 16 branch-side lines are all present.
- **Hook diagnostics:** the closed schema and the debug-only optional fields match the documented "prompt-free" claim.
- **Security scan:** no secret, private key, token-shaped string, embedded instruction or absolute home path appears in the nine files.

## Ruled Out

- **A prompt leak through `hookHealth`:** the persisted record is built from a closed schema and strips the two debug fields unless the flag is set.
- **A holdout outcome in the merged test's published maps:** the test's guard reads all four publication maps and the committed baseline carries no holdout id.
- **A command count contradiction:** 44 command files, 47 scorer rows and 57 command-row ids are three named inventories, not three versions of one number.
- **A version-authority drift in sk-doc:** five files carry 2.10.0.0.
- **A missing parent-hub template:** every path the ROUTER's step tree names resolves under `assets/parent-skill/`.
- **A security surface in the docs diff:** the only added line is a test-only path, and no doc change introduces a command, secret or trust decision.
- **A third stale runtime claim:** the six-runtime lists in the two advisor files are the only two; the hook contract document already carries Vibe.

## Next Focus

- Dimension: none remaining
- Focus area: synthesis of the four carried findings and the iteration 1 evidence
- Reason: all four dimensions now have a full pass; security and maintainability produced no new finding, and the carried P1/P2 set is the terminal state this lineage should report
- Rotation status: correctness, traceability, security and maintainability complete
- Required evidence: the stop decision from `convergence.cjs` and the carried finding set
- Recovery note: none

Review verdict: CONDITIONAL
