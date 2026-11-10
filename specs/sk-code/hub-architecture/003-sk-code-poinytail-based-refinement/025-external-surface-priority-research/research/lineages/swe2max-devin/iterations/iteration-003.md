# Iteration 3: Q8/F20 — every reader of `specs/sk-doc/z_archive/019-skill-routing-refactor/` and the cost of the re-mint dependency

## Focus

Q8: what does fixing the compiled-routing re-mint dependency on `specs/sk-doc/z_archive/019-skill-routing-refactor/` cost across every hub, versus documenting it (R7 or a reasoned no)? Interpretation: "fixing" covers both moving the authored closure into `.skilled/` and making the tools tolerate/absence-report cleanly; evidence came from a full reader census plus two throwaway APFS copies of the prepared base (one with `specs/` deleted entirely, one keeping only the 019 folder).

## Actions Taken

- `rg -n "z_archive/019|skill-routing-refactor" .skilled .github` — full reader census (14 distinct readers).
- `find`/`du` on the 019 packet — 73MB archive; the serving-relevant slice is `015-router-unification-program/` (traced closure + per-hub activation twins).
- Read `.skilled/bin/lib/compiled-route-layout.cjs:30-90`, `compiled-route-sync.cjs:1-45`, `compiled-route-guard.cjs:34-70,114-165`, `compiled-route-manifest.cjs:17-45`, `.skilled/bin/lib/compiled-route-manifest.cjs` (activationRoot write sites), `serving-closure.manifest.json`, `.github/workflows/routing-registry-drift.yml:55-120`, `check-no-spec-imports.cjs:75-137`, pre-commit:491-499.
- Throwaway copy X2 (`rm -rf "$X2/specs"`): ran `compiled-route-sync.cjs --check`, `compiled-route-guard.cjs`, `compiled-route-manifest.cjs mint --hub sk-code`, `parent-skill-check.cjs` — recorded exits and error text.
- Throwaway copy X1 (base as-is, `specs/` holds only the 019 folder): `compiled-route-sync.cjs --check` → exit 0, "all 55 served copies match their authored files".
- Confirmed `specs/sk-doc/019-skill-routing-refactor` (non-archive path) does not exist in the worktree.

## Findings

| class | claim | evidence | sev |
|---|---|---|---|
| ORDER | The authored-program root is a single constant `AUTHORED_PROGRAM_DIR = specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program`, deliberately "named once here so the pre-commit hook, the guard and the sync tool all move together" | `.skilled/bin/lib/compiled-route-layout.cjs:50-55` | P2 |
| BREAK | With `specs/` deleted, `compiled-route-sync.cjs --check` crashes with a raw Node `ENOENT lstat …/specs` stack trace, exit 1 — no message naming the missing authored closure or any remedy. Re-mint promotion (sync build) dies identically since it shares `IMPL_ROOT` | copy `$X2=/var/folders/…/r2-swe2max-i3-nospec.K6aS`: `node .skilled/bin/compiled-route-sync.cjs --check` → exit 1, `code:'ENOENT' path:'…/specs'`; `compiled-route-sync.cjs:40` | P1 |
| BREAK | With `specs/` deleted, `compiled-route-guard.cjs` exits 0 printing "All hubs fresh or excused: serving matches inputs, and the runtime matches its source" — a false green: `authoredDrift()` returns `null` when the authored manifest is absent, so the authored-drift leg silently drops out while serving keeps working on the promoted copy | copy `$X2`: guard exit 0, all 7 hubs "fresh"; `.skilled/bin/compiled-route-guard.cjs:65-70` | P1 |
| OK | `compiled-route-manifest.cjs mint|refresh|freshness` writes activation manifests under the **runtime root** `.skilled/bin/lib/compiled-routing/013-live-activation/activation/<hub>/manifest.json` (activationRoot derives from the runtime-root binding), not under `specs/` — mint on an existing hub still exits 1 with `causeCode:"already-exists"` in the no-specs copy, i.e. mint itself does not need `specs/`; what needs `specs/` is the authored-twin compare (guard) and closure trace (sync) | copy `$X2` mint output `manifestPath":".skilled/bin/lib/compiled-routing/013-live-activation/…"`; `.skilled/bin/lib/compiled-route-manifest.cjs:85-88,268-276,417-425` | P2 |
| OK | Keeping ONLY `specs/sk-doc/z_archive/019-skill-routing-refactor/` under `specs/` is sufficient: `sync --check` exit 0, "all 7 hubs resolve / all 55 served copies match their authored files" | copy `$X1=/var/folders/…/r2-swe2max-i3-019only.w3U3` | P2 |
| PRESENCE | The authored slice actually consumed is `015-router-unification-program/`: the 62-file traced closure (`003-contract-schemas`, `004-compiler-n1-shadow`, `005-decision-evaluator`, `008-calibration`, `009-parent-hub-rollout`, `013-live-activation`, `014-runtime-engine`) plus 7 per-hub activation twins (`manifest.json`, `manifest.candidate/prior/serving-prior.json`, `fence-state.json`, `activation-record.json`, `serving-flip-record.json`). The other ~70MB (research packets, real-model logs, sibling programs) is serving-inert | `.skilled/bin/lib/compiled-routing/serving-closure.manifest.json:3-14`; `find …/013-live-activation/activation -type f` (7 hubs: cli-classifier, cli-external-orchestration, mcp-tooling, sk-code, sk-design, sk-doc, system-deep-loop) | P2 |
| PRESENCE | CI dependency: `.github/workflows/routing-registry-drift.yml` path-filters both push and PR triggers on `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/**` — the authored tree is a watched drift input, not just a build input | `.github/workflows/routing-registry-drift.yml:66,112` | P1 |
| PRESENCE | `check-no-spec-imports.cjs` forbids `require`/`import` of, or any single quoted literal containing, `specs/sk-doc/(z_archive/)?019-skill-routing-refactor`; `compiled-route-layout.cjs` encodes the path as `path.join` segments, which the literal-string regex cannot match — the segment encoding is load-bearing against this guard | `.skilled/bin/check-no-spec-imports.cjs:75-76,137`; `.skilled/bin/lib/compiled-route-layout.cjs:52-55` | P1 |
| PRESENCE | Pre-commit wires the same triple (`ROUTE_MINT`, `ROUTE_GUARD`, `ROUTE_LAYOUT`) when a skill edit is staged — so a contributor on a specs-pruned checkout hits the sync crash at commit time, via the hook, not only when running tools by hand | `.skilled/scripts/git-hooks/pre-commit:497-499` | P1 |
| BREAK | `sk-code-skilled/assets/scripts/verify-router-sync.cjs` reads `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/compiled/route-gold.typed.json` — the **pre-archive** path, which no longer exists; the script is already broken today, independent of pruning | `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:17`; `ls specs/sk-doc/019-skill-routing-refactor` → ENOENT | P2 |
| DOC | Doc/data readers that rot for a pruned user but don't break serving: `compiled-routing-architecture.md:115-116` (links into the packet as "spec history"), `skill-root-metadata-contract.md:81` (cites stale non-archive path), `cite-drift-redirects.json` (`.opencode` mirror redirects), `pre-commit.test.sh:38,62`, `baseline-readme-verdicts.json:10547+`, `semantic-probes.json:1019`, `sk-design` benchmark report :209, `system-spec-kit` changelog v0.2.23.0 | paths as listed in census | P2 |
| OK | `parent-skill-check.cjs` (doctor leg) is green with `specs/` absent — doctor's parent-skill gate has no authored-closure dependency | copy `$X2`: exit 0, "all hard invariants passed, 0 warnings" | P2 |

## Cost / blast radius of the two candidate fixes (for R7)

| option | what it changes | cost | risk | cheaper move and why it fails |
|---|---|---|---|---|
| Move authored closure into `.skilled/` | Repoint `AUTHORED_PROGRAM_DIR` (layout.cjs:54) — but `sync.cjs:40` derives `IMPL_ROOT` via `path.relative('specs', …)`, so the derivation must be reworked for a non-specs root; 2 CI path filters (routing-registry-drift.yml:66,112); regenerate `serving-closure.manifest.json` `generatedFrom`; move only the 62-file closure + 7-hub activation twins (splitting a spec packet's archival unit); update `compiled-routing-architecture.md` links; `check-no-spec-imports` ban list becomes moot for this tree but stays for others | ~6-10 touched files + a partial spec-packet move + re-mint + CI filter churn across all 7 hubs | Splits an archived packet; the traced-subset move leaves `015-*` permanently torn between two roots; still leaves `verify-router-sync.cjs` broken and docs stale | A documented keep-rule is cheaper but does nothing for users who already pruned or never read it — and the guard still false-passes, so it doesn't fix the silent-drift leg |
| Keep location; surgical failure-mode fix (recommended R7 shape) | (a) `sync.cjs`: validate `IMPL_ROOT`/`SPECS_ROOT` before `lstat` and die with "authored compiled-routing closure missing at specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program — restore that folder or re-clone" (~5 lines, leverages existing `validateRealDirectory` at sync.cjs:212); (b) `guard.cjs:67`: treat missing `AUTHORED_ROOT` as a named failure/warning instead of `null`, so drift-blindness is visible; (c) one documented keep-rule line where external users are told they may prune `specs/` | 2 small code edits + 1 doc line; no file moves; zero blast radius on serving | Touches a shared guard verdict path — needs a fixture/test row, but the guard already has excuse/failure plumbing | Moving the closure (above) is the bigger fix; it solves the same user-visible failures at much higher churn, and still can't help a user who deletes `.skilled/` content |

## External-user stuck points (operator lens)

1. `sync --check`/re-mint → unhandled `ENOENT` stack with `path:'…/specs'`; no next-step guidance. One existing command extension fixes it: a `validateRealDirectory` pre-flight in `compiled-route-sync.cjs` naming the folder to restore.
2. `compiled-route-guard` → exit 0 "All hubs fresh" while the authored source is gone: the user is told the runtime "matches its source" when no source exists — misinformation, not just a missing check. Extending the existing guard (missing authored root → failure class) is the single highest-leverage fix; it also converts the hidden dependency into a self-documenting error.
3. `verify-router-sync.cjs` → points at the pre-archive path; fails today regardless — its error would also be a raw ENOENT.
4. Pre-commit hook → the sync/mint chain fires on staged skill edits, so the crash surfaces at commit time on a pruned checkout.

## Questions Answered

- Q8: F20, what does fixing the compiled-routing re-mint dependency on specs/sk-doc/z_archive/019-skill-routing-refactor/ cost across every hub, versus documenting it (R7 or a reasoned no)? — Answered: R7 = keep location, fix the two failure modes (sync ENOENT → named error; guard missing-authored → visible failure) + one documented keep-rule. Moving into `.skilled/` is a reasoned **no**: higher churn, splits an archive packet, and doesn't fix the false-green guard, which is the actual information-loss bug.

## Questions Remaining

- Q10, Q11, Q12 (untouched this iteration). Refinement of F20 (new evidence): the dependency is not "re-mint needs specs" — mint writes the runtime root; the real dependency is `sync` (trace + `--check`) and the guard's authored-drift leg.

## Ruled Out

- "Move the whole 019 packet into `.skilled/`" — 73MB of spec history/research/real-model logs has no serving role; only the traced closure subset is consumed, and moving a subset splits the archival packet.
- "`compiled-route-manifest mint` requires the authored tree" — contradicted by observation: mint targets the runtime root and ran (exit 1 `already-exists`) with `specs/` absent.

## Dead Ends

- None new for the strategy list beyond the two ruled-out rows above.

## Edge Cases

- Contradictory evidence: F20's framing vs. observed mint behavior — preserved both; the refined claim cites the mint output and `activationRoot()` write sites.
- Missing dependency: none — the prepared base copy provided both needed states (019-only and specs-absent).
- Partial success: `compiled-route-manifest` other verbs (`refresh`, `freshness`) and `run-all-drift-guards.sh` (`sk-code-skilled/scripts/run-all-drift-guards.sh`) not re-run in copies; sync/guard/mint covered the dependency.

## Sources Consulted

- `.skilled/bin/lib/compiled-route-layout.cjs:30-90`
- `.skilled/bin/compiled-route-sync.cjs:1-45,195-212`
- `.skilled/bin/compiled-route-guard.cjs:34-70,114-165`
- `.skilled/bin/compiled-route-manifest.cjs:17-45`; `.skilled/bin/lib/compiled-route-manifest.cjs:17-29,85-88,261-276,390-425,462,806`
- `.skilled/bin/lib/compiled-routing/serving-closure.manifest.json`
- `.skilled/bin/check-no-spec-imports.cjs:75-137`; `.skilled/scripts/git-hooks/pre-commit:191,497-499`
- `.github/workflows/routing-registry-drift.yml:55-120`
- `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:17`
- Throwaway copies: `$X2` (specs absent) and `$X1` (019-only), commands and exits as logged above

## Assessment

- New information ratio: 0.80
- Questions addressed: Q8 (full)
- Questions answered: Q8

## Reflection

- What worked: the two-state throwaway-copy experiment settled the question decisively — 019-only proves the documented keep-rule is sufficient, specs-absent exposes the exact failure modes (crash vs. false-green), which redirected R7 from "move files" to "fix failure modes".
- What did not: nothing material; the reader census plus copies covered all seven hubs' dependency surface in one pass.
- What I would do differently: nothing — the copy harness was the right instrument; remaining depth (who rewrites the authored twin after a mint) is a Q11-adjacent detail, not needed for the R7 decision.

## Recommended Next Focus

Q11 — the wider external-user flow and other hubs/tooling assuming obsidian+webflow (sk-prompt benchmark JSON, mcp-tooling feature-catalog, cli-orca README and benchmark report already surfaced as compiled-route readers worth rechecking under that lens). Secondary: who writes the authored activation twin after mint (pre-commit chain vs. activate-hub.cjs) — small, feeds the R7 fix text.
