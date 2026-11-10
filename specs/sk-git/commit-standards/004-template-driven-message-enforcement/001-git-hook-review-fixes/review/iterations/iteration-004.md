# Review Iteration 004 — D4 Maintainability

BINDING: target=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/git-hooks/
BINDING: maxIterations=5
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=maintainability
BINDING: specFolder=specs/sk-git/032-template-driven-message-enforcement/001-git-hook-review-fixes

- Dispatcher: /deep:review loop, iteration 4 of 5. Mode=review, target_agent=deep-review, run=4.
- Lineage: sessionId=dr-githooks-20261002T103712Z, parentSessionId=null, generation=1, lineageMode=new.
- Budget profile: verify (dispatch raised the ceiling: target 20, hard max 30).
- Target revision: carried from iteration 3's observation, main checkout HEAD `03afeb4552`; this iteration made no git call and cites main-checkout absolute paths only.
- Untrusted-content guard: no reviewed artifact carried directive-like text aimed at the reviewer; all content was treated as data.
- Agent definition loaded: `.skilled/agents/deep-review.md` was read before review actions.

## Dimension

D4 Maintainability: pattern compliance, documentation quality, clarity, and safe follow-on change cost across the 14 declared hook files. Six new P2 findings, all duplication / stale documentation / hardcoded-coupling defects; no new P0 or P1. The active P0 (R2-P0-001) and the five active P1 from D1 remain untouched and were not re-entered. The four swept security/correctness directions were not re-entered.

## Files Reviewed

14/14 declared scope files, fully read from the main checkout (absolute paths under `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/`):
- `.skilled/scripts/git-hooks/pre-commit` (16-27, 29-43, 52-54, 66-104, 106-229, 231-285, 287-477, 479-629)
- `.skilled/scripts/git-hooks/prepare-commit-msg` (47-58, 107, 112-133, 183-197, 209-256, 290-337)
- `.skilled/scripts/git-hooks/commit-msg` (38-57, 59-77)
- `.skilled/scripts/git-hooks/post-commit` (17-28, 33-39, 41-79)
- `.skilled/scripts/git-hooks/post-merge` (18-29, 31-37)
- `.skilled/scripts/git-hooks/post-rewrite` (19-30, 32-38)
- `.skilled/scripts/git-hooks/pre-push` (1-31, 40-51, 105-129, 136-220, 222-303, 305-344, 346-432, 434-474)
- `.skilled/scripts/git-hooks/lib/autostash-orphan-guard.sh` (1-80)
- `.skilled/scripts/git-hooks/lib/mass-deletion-guard.sh` (1-81)
- `.skilled/scripts/git-hooks/lib/message-contract-gate.sh` (1-60)
- `.skilled/scripts/install-git-hooks.sh` (1-20, 29-40, 45-50, 112-150, 152-209)
- `.skilled/hooks/git/pre-commit` (1-21, 24-27, 29-58, 60-85)
- `.skilled/skills/sk-git/scripts/validate-message.mjs` (6-18, 44-60, 204-210)
- `.skilled/skills/sk-git/scripts/lib/message-contract.mjs` (5-13, 29-31, 233-272, 278-316, 342, 355-367, 654-716)

Verification searches (main checkout): `SPECKIT_SKIP_DOC_MODEL_VALIDATE` (30 hits, none in hook code), `mass_deletion_staged_count` (2 hits: definition and one test), `source-root selection (identical in every hook script)` (9 hits).

## Findings by Severity

### P0 Findings

None new. The active P0 from iteration 2 (R2-P0-001, machine-wide hooks sourcing repo-controlled code) remains active at this revision and is the FAIL basis.

### P1 Findings

None new. The five D1 P1 findings remain active and were not re-raised: R1-P1-001 (prepare-commit-msg:189), R1-P1-002 (prepare-commit-msg:83), R1-P1-003 (message-contract.mjs:279), R1-P1-004 (pre-commit:79), R1-P1-005 (pre-push:203).

### P2 Findings

1. **R4-P2-001 — The legacy `hooks/git/pre-commit` copy of the hygiene gate has already diverged from the installed hook: a checker crash passes silently** — `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/hooks/git/pre-commit:44-48` vs `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/git-hooks/pre-commit:79-93`.
   - Evidence: the installed hook classifies checker exits explicitly — `0|2` pass, `1` is a violation whose output is printed, any other exit blocks with "checker failed (exit N)" (pre-commit:80-93). The legacy copy runs the checker with `2>/dev/null`, counts only exit 1, and silently ignores every other exit (hooks/git/pre-commit:44-48); it also discards violation output. The two files otherwise duplicate the same gate body (agent-mirror-sync included) from the same header claim, while the legacy header itself says "The installed Git hook is .opencode/scripts/git-hooks/pre-commit" (hooks/git/pre-commit:3).
   - Scenario: a checker regression makes `check-comment-hygiene.sh` exit 3 for a staged file. `git commit` in the toolchain checkout is blocked by the installed hook (pre-commit:88-91); the same commit invoked through the legacy helper passes with no output and no CHK entry. Any future fix to this gate must be applied twice, and the second copy is not covered by the installer's ownership check (`OWNED_HOOK_SOURCE_DIRS`, install-git-hooks.sh:77).
   - Finding class: duplicated implementation drift. Scope proof: both scope files implement the same gate; the exit-code taxonomy exists in one and not the other. Affected surface hints: ["hooks/git/pre-commit legacy helper","install-git-hooks.sh ownership set","active R1-P1-004 fix location"]
   - Note: R1-P1-004 (working tree vs staged blob) is active in both copies; this finding is the drift itself, not a re-raise.

2. **R4-P2-002 — Attribution policy lives twice: the stamper hardcodes a vendor rule set while the validator reads the template's `attribution` block** — `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/git-hooks/prepare-commit-msg:107,112-133,189-193` vs `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/skills/sk-git/scripts/lib/message-contract.mjs:5-13,308-316,342,364-367`.
   - Evidence: the module header states the design contract — "Here the template IS the rulebook … a rule exists exactly once and the gates cannot disagree" (message-contract.mjs:5-13) — and the validator implements it: `isForbiddenAttribution` builds its regexes from `attribution.forbiddenKeys` and `attribution.forbiddenTrailerValuePattern` (message-contract.mjs:308-316), applies them at `--stage pre-stamp` (message-contract.mjs:364-367), and registers `attribution.forbidden` as a contract rule id (message-contract.mjs:342). The stamper does not read the contract at all: `FORBIDDEN_KEY_RE='^(Co-Authored-By|Claude-Session):'`, a case-insensitive "anthropic" word test, and the trailer-shape regex are hardcoded (prepare-commit-msg:107,112-133), and those hardcoded rules drive the drop loop (prepare-commit-msg:189-193).
   - Scenario: a repository's `commit-message-template.md` extends `attribution.forbiddenKeys` with `Kilo-Session`, or renames the vendor in `forbiddenTrailerValuePattern`. commit-msg then blocks a `Kilo-Session: …` line (validator reads the template), but prepare-commit-msg never strips it (stamper does not), so the designed "drop before stamping" path becomes a hard commit block; inversely, removing `Co-Authored-By` from the template leaves the stamper still silently deleting those lines. The gates disagree exactly because the policy lives twice.
   - Finding class: cross-consumer policy duplication. Scope proof: the two scope surfaces are the only attribution implementations; the stamper has no contract read (rg `skgit.contractDir` in prepare-commit-msg: zero hits). Affected surface hints: ["prepare-commit-msg hardcoded attribution rules","message-contract.mjs attribution block","template as single rulebook invariant"]
   - Distinct from active R1-P1-001 (subject deletion by the matcher); this is the policy-source split.

3. **R4-P2-003 — `install-git-hooks.sh` usage header describes a gate that no longer exists, omits a live gate, and repeats a pre-push clause** — `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/install-git-hooks.sh:11,15,17,188`.
   - Evidence: line 11 says pre-commit "runs validate-doc-model-refs.js (advisory)", but the hook states the doc-model validator moved to CI (pre-commit:52-54) and no hook code reads `SPECKIT_SKIP_DOC_MODEL_VALIDATE` — the 30 grep hits are the installer itself (:17,:188), the tests, README and historical specs; the current hook does not mention it. The header omits the spec derived-metadata gate (pre-commit:479-629) and its `SPECKIT_SKIP_SPEC_REMINT` bypass, which the hook prints on every block. Line 15's pre-push sentence describes the remote-permission gate twice — "…unless this push is approved: creating a branch needs it named, updating it accepts a blanket approval; (2) blocks any push (new or update) to a branch outside the remote allowlist …" — a duplicated, half-merged clause that no gate matches.
   - Scenario: an operator blocked by `[gate:spec-remint]` reads the installer's advertised bypass list (repeated in the install output at :188) and tries `SPECKIT_SKIP_DOC_MODEL_VALIDATE=1`; nothing changes. Conversely, an operator trusts line 11 and expects an advisory model-reference warning that no longer runs.
   - Finding class: stale documentation (in-scope installer). Scope proof: the installer's own header and footer are the only usage documentation for this file. Cross-reference: the dead bypass mentions are already recorded as a follow-up outside `.skilled/skills/sk-doc`'s packet sk-doc/062 (implementation-summary.md:177); this packet's target includes the file, so the defect is filed here. Affected surface hints: ["install-git-hooks.sh usage block","doc-model validator removal","spec-remint bypass omission"]

4. **R4-P2-004 — `pre-push` header documents two removed gates and omits the gates that now run** — `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/git-hooks/pre-push:1-31`.
   - Evidence: item 1's label was deleted, leaving orphaned continuation prose ("grammar (updates to an existing remote branch are always naming-exempt…)", pre-push:4-6) for a naming gate the code says was removed (pre-push:227-229). Item 4, "Test suites: discovered suites report failures, or block when enforced" (pre-push:13), describes gates the code says "moved to CI" (pre-push:353-355). The header never mentions the mass-deletion gate (gate 0, pre-push:155-183), the compiled-routing gate or its routing-commit-parity half (pre-push:346-432), and its only advertised bypass is `SPECKIT_ALLOW_REMOTE_PUSH` (:28) — the code prints `SPECKIT_SKIP_PREPUSH_ROUTE_GATE`, `SPECKIT_SKIP_PREPUSH_TRACK_GATE` and `SPECKIT_ALLOW_MASS_DELETION` when those gates block.
   - Scenario: a push is blocked by `[gate:mass-deletion]`; the maintainer reads the header's five-item inventory (which has no gate 0 and no `SPECKIT_ALLOW_MASS_DELETION`) and looks for a test-suites runner that no longer exists. The header is the file's only quick-reference and it now misstates both the gate set and the bypass map.
   - Finding class: stale documentation. Scope proof: header vs the gate sites read in full in the same file. Affected surface hints: ["pre-push header gate inventory","removed naming/test gates","mass-deletion and routing bypasses"]

5. **R4-P2-005 — A machine-wide hook hardcodes the authored-copy path of one spec packet; archiving that packet makes routing commits fail closed** — `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/git-hooks/pre-commit:351` (consumed at :410-444, :459-473).
   - Evidence: `ROUTE_AUTHORED="$REPO_ROOT/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/${ROUTE_RUNTIME#"$ROUTE_SOURCE/bin/lib/compiled-routing/"}"` embeds a packet location inside a hook that runs machine-wide. Every precondition of the re-mint loop fails closed: `ROUTE_AUTHORED_FILE` is in the `ROUTE_NEEDED` loop and a missing file blocks with "cannot be re-minted, missing" (pre-commit:415-423); the copy step blocks on the same path (:438-444). The comment above it says the authored copy "takes the same layout-relative suffix rather than a second hardcoded path" (:349-351), but the prefix is exactly that.
   - Scenario: the packet is archived or renamed (routine after a refactor). The next commit staging any routing input (`.skilled/skills/*/SKILL.md`, hub-router.json, mode-registry.json) enters the gate at :314-319, resolves no authored manifest, and blocks with a message naming a path the author never touched; the escape is `SPECKIT_SKIP_ROUTE_REMINT=1` until someone edits the hook.
   - Finding class: hardcoded coupling. Scope proof: the authored-copy prefix is the only packet-literal path in the 14 scope files; the layout module provides the runtime root but not the authored root. Affected surface hints: ["pre-commit route re-mint","specs/sk-doc packet archival","ROUTE_AUTHORED path"]

6. **R4-P2-006 — The source-root selection prologue is copy-pasted into eight in-scope scripts (nine repo-wide) with only a comment asserting the invariant** — `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/git-hooks/pre-commit:16-27`, `prepare-commit-msg:47-58`, `post-commit:17-28`, `post-merge:18-29`, `post-rewrite:19-30`, `pre-push:40-51`, `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/hooks/git/pre-commit:10-21`, `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.skilled/scripts/install-git-hooks.sh:29-40`.
   - Evidence: each copy is preceded by ">>> source-root selection (identical in every hook script)" and repeats the same twelve lines (sentinel check, `.skilled` → `.opencode` fallback, `_in_toolchain_repo`). A grep for the marker returns nine files in the main checkout; the ninth, `.skilled/bin/check-git-hooks.sh:37`, is outside this target and reinforces that the block is a pattern, not a shared unit. The repo already keeps shared shell logic in `lib/message-contract-gate.sh` with a one-line sourcing contract (commit-msg:51-57), so the shared-home pattern exists.
   - Scenario: a future change to the sentinel path or precedence (say, a new toolchain root, or tightening the fallback) requires eight coordinated edits. A missed hook keeps the old rule: that hook then disagrees with the rest about whether a checkout ships the toolchain, so its `_in_toolchain_repo`-scoped blocks silently fail open exactly where they should block — the per-file only/no-sentinel behavior differs hook by hook with no test asserting the invariant the comment claims.
   - Finding class: duplication. Scope proof: all eight copies are byte-identical today (no drift yet); the risk is change cost, not a present divergence. Affected surface hints: ["source-root selection prologue","_in_toolchain_repo gates","shared lib/ precedent","bin/check-git-hooks.sh ninth copy (out of scope)"]

## Traceability Checks

- spec_code (core): **pass — carried from iteration 3, not re-run.** D3 matched spec.md:69,92,107,70 to the resolver, CLI flags, `--status` reporting and the skip policy; this iteration found no new spec-drift and made no counter-claim.
- checklist_evidence (core): **fail — carried from iteration 3, not re-run.** R3-P2-001, R3-P2-002 and R3-P2-005 remain active; this iteration added no checklist evidence.
- skill_agent (overlay): **pass — carried from iteration 3, not re-run.**
- agent_cross_runtime (overlay): **notApplicable — carried.** Native git hooks have no per-runtime adapters (hooks/git/README.md:52).
- feature_catalog_code (overlay): **partial — carried from iteration 3.** R3-P2-003 remains active; not re-inspected here.
- playbook_capability (overlay): **deferred — carried from iteration 3.** Not executed; explicitly not a pass.
- Maintainability protocol: no overlay protocol maps to this dimension; the check is the read-and-compare evidence recorded in the six findings.

## Integration Evidence

- `install-git-hooks.sh:45,169-183` installs from `$SOURCE_ROOT/scripts/git-hooks` only; the legacy `.skilled/hooks/git/pre-commit` is not in `OWNED_HOOK_SOURCE_DIRS` and is not installed — the drift in R4-P2-001 is a manual-invocation surface, and the fix must still cover it.
- `commit-msg:51-57` sources `lib/message-contract-gate.sh` through the HOOK_DIR resolver — the in-repo precedent for shared hook logic referenced by R4-P2-006.
- `pre-commit:305-351,415-444` consumes `compiled-route-manifest.cjs`, `compiled-route-guard.cjs` and `compiled-route-layout.cjs`; the authored-copy path is the hardcoded integration in R4-P2-005.
- `prepare-commit-msg:60` invokes `commit-id-naming.sh` (allocator outside scope); its absence of a contract read is the R4-P2-002 scope proof.

## Edge Cases / Ambiguities

- `mass_deletion_staged_count` (mass-deletion-guard.sh:41-44) has no production caller: the grep shows only the definition and `tests/mass-deletion-guard.test.sh:58`. The lib's header still says "refuse a commit or push" (:5) and `mass_deletion_report` still documents a `commit` mode (:63-64). This is a dead-surface cleanup question with no live behavioral impact, so it is recorded as ruled-out rather than filed as a finding.
- R4-P2-006 is prospective: the eight prologue copies are identical today, so the finding is change cost, not current divergence; it is P2 on that basis.
- The pre-push header drift (R4-P2-004) is documentation-only; no runtime path reads the header.
- The target revision is carried from iteration 3 (`03afeb4552`); the worktree-075 copies were again not read as target.
- Prior-record note: an earlier lineage (sk-doc/062) recorded the dead `SPECKIT_SKIP_DOC_MODEL_VALIDATE` mentions as a follow-up outside its own packet; R4-P2-003 files the install-header instance here because this packet's scope includes `install-git-hooks.sh`.
- Iteration timestamp is approximate (run start 10:37:12Z); no clock call was within budget.

## Confirmed-Clean Surfaces

- The eight in-scope source-root prologues are textually identical today (sentinel paths and precedence match).
- `lib/message-contract-gate.sh` keeps one implementation of the validator path and the rules-declared probe, sourced by both commit-msg and pre-push — the shared-lib pattern works where it is used.
- `pre-commit`'s route re-mint confirmation logic matches its comments (index-versus-HEAD reasoning at :450-457) and the spec-remint staging/confirmation paths are internally consistent.
- `install-git-hooks.sh` ownership and `--status` behavior were re-read and show no new defects; the only issue is the usage header (R4-P2-003).
- `mass-deletion-guard.sh` verdict semantics remain fail-open and match their docblock; no live caller misuses the staged helper.

## Ruled Out

- Prologue text drift: none exists today (all eight copies byte-identical); the duplication risk is filed as R4-P2-006, not as a present divergence.
- Dead mass-deletion staged/commit surface: reachable only from its own test; cleanup-only, no behavioral impact, not filed.
- Installer installing the legacy helper: it does not; the ownership set covers only `.skilled|.opencode/scripts/git-hooks` (install-git-hooks.sh:77) — re-confirmed clean.

## Verdict

1 active P0 (R2-P0-001) plus 5 active P1 carried from iterations 1-3 → FAIL, per the severity mapping. Six new P2 maintainability findings, no new P0/P1. newFindingsRatio=0.14 (weighted new 6 / accumulated 44; P0=10, P1=5, P2=1). Novelty justification: all six findings are new maintainability directions (legacy-copy drift, attribution-policy duplication, two stale gate inventories, hardcoded packet path, prologue duplication); none duplicates a prior finding, and R4-P2-001 cites active R1-P1-004 without re-raising it.

## Next Dimension

All four dimensions are complete. Iteration 5 (the max-iterations cap under `stopPolicy=max-iterations`) is the continuity/synthesis pass: re-check the active P0/P1 against the final revision, confirm the new P2 documentation set, and prepare the release-readiness read.

Review verdict: FAIL
