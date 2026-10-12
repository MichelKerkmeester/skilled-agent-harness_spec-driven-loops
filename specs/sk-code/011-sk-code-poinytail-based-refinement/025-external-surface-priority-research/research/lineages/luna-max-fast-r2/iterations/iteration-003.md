# Iteration 3: Compiled-routing re-mint dependency

## Focus
Q8: estimate the cost and blast radius of fixing the authored-source dependency on `specs/sk-doc/z_archive/019-skill-routing-refactor/`, compare that with documenting the pruning prerequisite, and recommend R7 or no recommendation. This dispatch explicitly selects Q8 even though the strategy’s generated Next Focus names Q11.

## Actions Taken
- Read the config, state log, strategy, findings registry, prior iterations, and deep-research skill. Q8 is unchecked at strategy line 50; the exhausted-approach entries at lines 105-113 concern the `--surfaces` path, not this re-mint dependency.
- Ran `rg -n --hidden "z_archive/019|skill-routing-refactor" .skilled .github` (exit 0). Direct references include the compiled layout, the generated serving manifest, CI path filters, a no-spec-import check, historical architecture links, and old-path fixtures/redirects. The main runtime dependency is derived in `compiled-route-sync.cjs` from the authored program path in the compiled layout.
- Summarized the archived program tree (Python command, exit 0): the `009-parent-hub-rollout` directory contains activation manifests and `route-gold.typed.json` files for all seven hubs; `013-live-activation` contains their live activation manifests; `014-runtime-engine` contains the resolver. The program also contains coverage and historical artifacts.
- Throwaway copy without `specs/`: `/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T//r2-luna-max-fast-r2-i3.TkCj`. After removing only that copy’s `specs/`, `node .skilled/bin/compiled-route-sync.cjs --check` exited 1 with `errno: -2`, `code: ENOENT`, `syscall: lstat`, `path: .../specs`. `compiled-route-guard.cjs` exited 0 and ended with “All hubs fresh or excused: serving matches inputs, and the runtime matches its source.” `compiled-route-manifest.cjs refresh --hub sk-code --skill-root .skilled/skills/sk-code` exited 0 with `"refreshed":true`.
- Throwaway copy retaining the prepared `specs/sk-doc/z_archive/019-skill-routing-refactor/` closure: `/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T//r2-luna-max-fast-r2-i3.TIJ1`. `node .skilled/bin/compiled-route-sync.cjs` exited 0 and reported “promoted 62 closure files”. The guard exited 0. A subsequent manifest refresh exited 1 with `"causeCode":"publication-locked"` because the sync had retained its rollback; this is a publication lifecycle result, not evidence that the archived source is insufficient.

## Findings
| PRESENCE | Re-mint traces a mutable authored program rooted under `specs/`: sync resolves `specs` at startup, derives `IMPL_ROOT` from the compiled layout, and reads the authored resolver there. | [SOURCE: .skilled/bin/compiled-route-sync.cjs:38-46]; [SOURCE: .skilled/bin/lib/compiled-route-layout.cjs:54]; [SOURCE: .skilled/bin/lib/README.md:58] | P1 |
| BREAK | Removing `specs/` breaks `compiled-route-sync --check` before it can trace, with exit 1 and `ENOENT` / `lstat` on the missing `specs` path. In the same copy, the serving guard and activation-manifest refresh still passed, so the shipped runtime can remain healthy while re-minting is unavailable. | [INFERENCE: based on the no-specs throwaway probe above; exit 1 `code: ENOENT`, `syscall: lstat`, `path: .../specs`; guard exit 0; manifest refresh exit 0] | P1 |
| PRESENCE | The authored closure is shared by the seven hubs listed in sync; the archived rollout tree holds per-hub activation manifests and route-gold fixtures, plus the live activation manifests and runtime resolver. The preserved-copy sync promoted 62 traced files. | [SOURCE: .skilled/bin/compiled-route-sync.cjs:52-60]; [SOURCE: .skilled/bin/lib/compiled-routing/serving-closure.manifest.json:3]; [INFERENCE: based on the archived-closure Python summary (exit 0) and preserved-copy sync output (exit 0)] | P1 |
| DOC | A user who pruned `specs/` gets a Node `ENOENT` with no instruction to restore the archived source. The doctor’s compiled-route leg runs the guard, which passed in the no-specs copy, so it does not reveal that the authored source needed for re-mint is gone. Existing library guidance says to change the authored program under `specs/` and republish. | [SOURCE: .skilled/bin/lib/README.md:58]; [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:158-160]; [INFERENCE: based on the no-specs throwaway probe] | P1 |

## Options and Recommendation
| R7 candidate | Add a pruning prerequisite beside the existing source-location guidance at `.skilled/bin/lib/README.md:58`: retain `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/` when pruning `specs/`, then run `node .skilled/bin/compiled-route-sync.cjs --check` and the sync command. | Small documentation change; users retain the authored closure. | A user who has already deleted the folder still needs to restore it; the current error gives no next step. | Leaving the docs as-is is cheaper, but the observed ENOENT leaves re-mint broken and opaque. |
| Relocate authored source | Move the authored closure into `.skilled/` and update `.skilled/bin/lib/compiled-route-layout.cjs:54`, `.skilled/bin/compiled-route-sync.cjs:38-46`, source-location docs, the no-spec-import rule, and the CI path filters at `.github/workflows/routing-registry-drift.yml:66,112`; revalidate the common closure against all seven hubs. | High: moves a substantial archived source tree and changes the shared build/runtime publication path and its checks. | A shared closure or publication mismatch can affect all seven hubs; duplicated authored and serving copies can drift. | R7 is cheaper, though it only protects users who follow the pruning instruction and does not recover an already-pruned tree. |

The smallest supported recommendation is the R7 documentation prerequisite. The observed boundary is re-minting: the compiled guard and refresh still worked without `specs/`. Moving the whole authored program into `.skilled/` is broader than the demonstrated failure. One checklist step can be consolidated into the existing all-hub `compiled-route-sync.cjs --check`; extend its missing-source diagnostic to print the retention/restore instruction. That command cannot recover source after it has been deleted.

## Questions Answered
- Q8: F20, what does fixing the compiled-routing re-mint dependency on specs/sk-doc/z_archive/019-skill-routing-refactor/ cost across every hub, versus documenting it (R7 or a reasoned no)?

## Questions Remaining
- Q10: exact R1-R4 edits, touched files, residual breakage, and minimum scope.
- Q11: other example assumptions and the complete external-user flow.
- Q12: challenge X1-X9 and identify new rejections.

## Next Focus
Q11, matching the strategy’s generated Next Focus after Q8 is resolved.

## Ruled Out
- Treating `compiled-route-guard.cjs` as a re-mintability check: it returned exit 0 with `specs/` absent and checks served-runtime freshness instead.

## Edge Cases
- Missing dependency: removing `specs/` removes the authored root required by sync.
- Partial probe: the second copy’s manifest refresh was intentionally sequenced after a sync that retained a publication rollback; the observed publication lock is recorded above and is not attributed to the archived-folder dependency.

## Sources Consulted
- `.skilled/bin/compiled-route-sync.cjs:38-60`
- `.skilled/bin/lib/compiled-route-layout.cjs:54`
- `.skilled/bin/lib/compiled-routing/serving-closure.manifest.json:3`
- `.skilled/bin/lib/README.md:58`
- `.skilled/commands/doctor/assets/doctor-update-apply.yaml:158-160`
- `.github/workflows/routing-registry-drift.yml:66,112,172`
- `rg -n --hidden "z_archive/019|skill-routing-refactor" .skilled .github` (exit 0)
- Archived-tree summary and both throwaway probe outputs (exit statuses recorded above).

## Assessment
- New information ratio: 0.75 (2 fully new, 2 partially new; the dependency premise was already stated, while its failure boundary and runtime behavior were directly probed).
- Questions addressed: Q8.
- Questions answered: Q8.

## Reflection
- What worked: testing the authored sync, served guard, and manifest refresh separately exposed that only re-mint fails after pruning.
- What did not work: the post-sync manifest refresh was blocked by the publication lock retained by the successful sync; it does not answer anything about source availability.
- Next adjustment: test the source-retention instruction as part of the external-user flow and inspect related release/doctor guidance in the Q11 pass.

## Scope Violations
None.
