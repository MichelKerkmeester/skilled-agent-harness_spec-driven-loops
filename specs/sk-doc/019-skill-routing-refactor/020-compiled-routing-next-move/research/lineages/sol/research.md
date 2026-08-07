# Compiled Routing: Recommended Next Move

## 1. Executive Summary

The best next move is not another broad rewrite. Make activation state reproducible, make freshness enforceable, and leave publication safety intact until the closure inputs stabilize.

The recommended architecture is a derived dual-location contract:

- source-controlled authored activation manifests are the reproducibility authority;
- runtime activation manifests are disposable promoted serving mirrors;
- non-excused authored/runtime divergence is a defect;
- a temporary exception may excuse only a named hub and failure class, never the whole guard.

The current checkout also changes the premise behind Q2. Both authored and promoted resolvers presently fail for `cli-external-orchestration` and `sk-design`; promoted resolution does not succeed. Both resolver graphs re-enter mutable live `.opencode/skills` inputs, so a copied runtime engine is not a sealed closure. [SOURCE: .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:62] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/iterations/iteration-002.md:7]

## 2. Research Scope and Method

Five forced-depth iterations answered the operator's questions in order: manifest ownership, closure resolution, freshness enforcement, staging/rollback, and sequencing. Each iteration read externalized state, performed bounded repository research, wrote a cited narrative and structured delta, and passed the workflow's route-proof verifier. The supplied verified state was treated as baseline except where current command evidence directly contradicted it.

Research only: no product or routing implementation was changed. All writes stayed inside this detached lineage.

## 3. Decision

Adopt this contract:

1. **Authored source is authoritative.** Mint/refresh must leave the source-controlled manifest able to reproduce the serving state.
2. **Runtime is a promoted mirror.** Serving continues from `.opencode/bin/lib/compiled-routing`, but runtime-only activation edits are not durable authority.
3. **CI is the authoritative freshness blocker.** Local hooks provide feedback; they do not define merge safety.
4. **Exceptions are narrow and auditable.** A checked-in record names `hubId`, allowed failure reason, owner, rationale, evidence, creation time, and expiry/review date.
5. **Publication safety remains.** Keep staging, atomic rename, closure-bound rollback, finalize/revert cleanup, and terminal receipt cleanup.
6. **Complexity pruning waits.** Remove test-injection-only nested rename recovery only after affected closures compile and lifecycle tests reach their bodies.

## 4. Current-State Correction

The operator baseline says authored/runtime manifests and code are byte-identical and runtime resolution succeeds. That claim is not true for the current checkout:

- `compiled-route-sync.cjs --check` reports unresolved authored hubs including `cli-external-orchestration`, `sk-design`, and `sk-doc`. [SOURCE: .opencode/bin/compiled-route-sync.cjs:724] [SOURCE: .opencode/bin/compiled-route-sync.cjs:741]
- `compiled-route-sync.cjs --verify` reports promoted closure failure for `cli-external-orchestration` and `sk-design`. [SOURCE: .opencode/bin/compiled-route-sync.cjs:663] [SOURCE: .opencode/bin/compiled-route-sync.cjs:692]
- Authored and promoted resolver/engine hashes match in key places, but the `cli-external-orchestration` harness differs and the `sk-design` activation manifests differ. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/iterations/iteration-002.md:12]

**UNVERIFIED:** runtime success may describe an earlier live skill tree. Confirming that historical state requires the exact pre-restructure checkout; this lineage did not have it.

## 5. Q1 — Activation-Manifest Ownership

Authored-only without a runtime mirror does not fit the serving resolver, which reads the promoted activation root and falls back to legacy when serving authority, generation, or policy hashes do not match. [SOURCE: .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:24] [SOURCE: .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:103]

Runtime-authoritative ownership fits serving but breaks source reproducibility: the current writer resolves the canonical writable path in runtime, while the sync build later promotes from the authored implementation root. [SOURCE: .opencode/bin/lib/compiled-route-manifest.cjs:391] [SOURCE: .opencode/bin/lib/compiled-route-manifest.cjs:579] [SOURCE: .opencode/bin/compiled-route-sync.cjs:724]

Therefore, authored source plus a derived runtime mirror wins. It preserves isolated serving without letting a healthy runtime hide an unreproducible rebuild.

## 6. Q2 — Exact Closure-Resolution Mechanism

The shared mechanism is live-input re-entry:

1. The authored or promoted `compiled-route.cjs` loads a hub engine from its respective `009-parent-hub-rollout` tree.
2. The hub's `build-artifacts.cjs` walks back to the repository root.
3. It sets `SKILL_ROOT` to live `.opencode/skills/<hub>`.
4. Snapshot compilation therefore depends on mutable live registry and skill files, not solely on the copied compiled closure. [SOURCE: .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:21] [SOURCE: .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:62] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs:48] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/006-sk-design/harness/build-artifacts.cjs:42]

The hub-specific failures are concrete:

- `cli-external-orchestration`: the authored child enumerates three packets, but the live registry also declares `cli-cursor`; `loadSnapshot()` dereferences the missing source. The promoted harness separately references absent `cli-devin`. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs:64] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs:105] [SOURCE: .opencode/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs:77] [SOURCE: .opencode/skills/cli-external-orchestration/mode-registry.json:78]
- `sk-design`: the live registry now has four top-level modes while the compiled registry compiler still requires exactly six and throws `AUTHORED_INPUT_INVALID`. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/006-sk-design/lib/registry-compiler.cjs:296] [SOURCE: .opencode/skills/sk-design/mode-registry.json:5]

## 7. Q3 — Freshness Enforcement

Use CI as the authoritative blocker:

- Pre-commit is opt-in/bypassable and currently does not run compiled-route freshness. [SOURCE: .opencode/hooks/README.md:81] [SOURCE: .opencode/scripts/install-git-hooks.sh:120]
- Pre-push is already a branch/push-policy surface with scoped bypasses, not a content-correctness authority. [SOURCE: .opencode/scripts/git-hooks/pre-push:21] [SOURCE: .opencode/scripts/git-hooks/pre-push:132]
- SessionStart guards are intentionally short, non-fatal visibility checks. [SOURCE: .codex/hooks.json:3] [SOURCE: .opencode/bin/check-git-hooks.sh:17]
- CI already owns routing-registry and runtime-import invariants on PRs and `main` pushes. [SOURCE: .github/workflows/routing-registry-drift.yml:6] [SOURCE: .github/workflows/runtime-no-spec-import.yml:8]

Policy:

- block every unexcused `stale-manifest`, `authored-drift`, and `inputs-do-not-compile`;
- permit a temporary `sk-design` exception only for `inputs-do-not-compile`;
- never let that exception excuse stale serving, authored drift, or another hub;
- print active exception identity and expiry in CI output;
- run the same evaluator in warn-only mode at session start or pre-commit for fast feedback.

The exception schema is a recommendation, not an existing verified repository contract.

## 8. Q4 — Staging and Rollback

Retain the safety mechanisms. The simplify case is legitimate—the tool and tests are large—but it does not outweigh the failure windows these mechanisms close.

- Staging removes the former live-root deletion window by copying and verifying an isolated candidate before publication. [SOURCE: .opencode/bin/compiled-route-sync.cjs:767] [SOURCE: .opencode/bin/compiled-route-sync.cjs:814]
- Atomic rename narrows publication to a swap after verification. [SOURCE: .opencode/bin/compiled-route-sync.cjs:817] [SOURCE: .opencode/bin/compiled-route-sync.cjs:821]
- Retained rollback preserves the exact displaced runtime closure and binds finalize/revert to closure fingerprints. [SOURCE: .opencode/bin/compiled-route-sync.cjs:566] [SOURCE: .opencode/bin/compiled-route-sync.cjs:580] [SOURCE: .opencode/bin/compiled-route-sync.cjs:803]
- Terminal cleanup makes interrupted finalize/revert cleanup resumable without deleting newer publication state. [SOURCE: .opencode/bin/compiled-route-sync.cjs:612] [SOURCE: .opencode/bin/compiled-route-sync.cjs:637]
- Git recovers tracked history; it does not atomically swap a live multi-directory serving root or bind a runtime rollback sibling to the displaced closure. [INFERENCE: based on .opencode/bin/compiled-route-sync.cjs:566 and .opencode/bin/compiled-route-sync.cjs:817]

Prune only the oversized nested failure-injection surface after green closure and lifecycle coverage. Do not trade away staging or rollback to make the file smaller.

## 9. Q5 — Minimum Sequenced Work

### Safe before `sk-design` settles

1. **Fix manifest authority.** Make mint/refresh update authored authority and promote a byte-equivalent runtime mirror. Verify zero unexcused authored drift.
2. **Fix `cli-external-orchestration`.** Source every live registry packet, including `cli-cursor`, and reconcile the promoted `cli-devin` drift. Verify `--check` no longer names this hub.
3. **Make the guard exception-aware.** Add a checked-in exception manifest and explicit `excused`, `exceptionId`, and `expiresAt` output. Default to non-excusing.
4. **Add CI blocking.** Trigger on routing inputs, authored activation manifests, compiled-runtime artifacts, and guard/sync tool changes. Keep session/pre-commit evaluation advisory.

### Wait for `sk-design`

5. Update the compiled `sk-design` contract to the post-restructure registry shape.
6. Re-mint authored activation, promote runtime, remove the temporary exception, and require `--check`, `--verify`, and lifecycle tests to pass without exemptions.
7. With lifecycle bodies green, prune test-only nested rename recovery while preserving observable staging, rollback, closure-drift rejection, and terminal cleanup behavior.

## 10. Safe-Now / Wait Matrix

| Work | Safe now? | Dependency | Verification / escape |
|---|---:|---|---|
| Source-authoritative/runtime-mirror writer contract | Yes | None | Byte equality for non-excused hubs; revert failed publication |
| `cli-external-orchestration` closure repair | Yes | Current live registry | Hub disappears from `--check` failures |
| Exception-aware guard output | Yes | Failure taxonomy already exists | Unknown/expired exceptions fail closed |
| CI freshness gate | Yes | Exception evaluator | Artificial unexcused drift fails; local hooks irrelevant |
| `sk-design` compiler contract | No | Registry restructure contract settles | `--check` and `--verify` pass without exception |
| Remove `sk-design` exception | No | New manifest minted and promoted | CI remains green without exemption |
| Prune nested rename recovery | No | Lifecycle tests execute and pass | Keep current implementation if recovery behavior regresses |

## 11. Recommendations

Treat reproducibility as the first dependency, not as a follow-up to CI. Blocking a known-unreproducible contract would only normalize exceptions.

Then repair the independent `cli-external-orchestration` closure and add the exception-aware guard plus CI. This creates unattended safety while allowing the legitimate `sk-design` restructure to continue visibly.

Keep publication safety unchanged until the system can run its lifecycle suite again. Complexity reduction comes last.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---:|
| Pure authored-only with no runtime mirror | Serving resolver reads the promoted activation root | `.opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:24` | 1 |
| Pure runtime-authoritative manifests | Runtime-only writes are not reproducible from authored source | `.opencode/bin/lib/compiled-route-manifest.cjs:391`; `.opencode/bin/compiled-route-sync.cjs:724` | 1 |
| Manifest-byte comparison as Q2 explanation | Snapshot compilation re-enters live skill inputs | `iteration-002.md:9-12` | 2 |
| Assume promoted runtime succeeds now | `--verify` and direct resolver probes contradict it | `iteration-002.md:8` | 2 |
| Pre-commit as authoritative gate | Local, opt-in, bypassable | `.opencode/hooks/README.md:81-84` | 3 |
| Pre-push as authoritative gate | Branch-policy surface with bypasses | `.opencode/scripts/git-hooks/pre-push:21-22` | 3 |
| Session hook as blocker | Session guards are intentionally non-fatal | `.opencode/bin/check-git-hooks.sh:17-18` | 3 |
| Direct copy into live runtime root | Reintroduces the former deletion/partial-copy hazard | `.opencode/bin/compiled-route-sync.cjs:767-821` | 4 |
| Git as operational rollback | Does not bind or atomically swap the displaced live closure | `.opencode/bin/compiled-route-sync.cjs:566-580` | 4 |
| Prune publication recovery before green tests | Would remove safety while lifecycle coverage is blocked | `.opencode/bin/tests/compiled-route-manifest.test.cjs:521`; `:863` | 4-5 |

## Divergence Map

- Saturated direction: binary authored-only versus runtime-only ownership. The derived mirror model dominates both.
- Saturated direction: local hook as authoritative safety boundary. CI is the only shared unattended merge gate among the compared surfaces.
- Saturated direction: remove all staging/rollback because the repo is git-backed. Source history and live publication cover different failure domains.
- Contradiction frontier: historical runtime success versus current promoted-resolution failure.
- Remaining frontier: the post-restructure `sk-design` registry contract and the smallest externally equivalent rename-recovery implementation.
- Council artifacts: none; no divergent pivots were run.

## 12. Open Questions

All five research questions are answered for the current checkout. Implementation planning still needs:

- the exact owner and expiry date for the temporary `sk-design` exception;
- the final post-restructure `sk-design` mode contract;
- a focused confirmation of the promoted `cli-devin` mismatch before editing;
- the acceptance boundary for pruning nested rename recovery.

## 13. Risks and Caveats

- The verified baseline appears to describe a different checkout state; do not use its runtime-success claim as current evidence.
- A source-authoritative writer change can itself create a two-location partial-write problem unless the write/promotion transaction and failure semantics are specified.
- Exception manifests can become permanent bypass registries without expiry and CI visibility.
- CI path filters must cover every real hub input or freshness will remain advisory for unlisted changes.
- Pruning before lifecycle tests execute would convert an evidence gap into a safety regression.

## 14. Evidence Quality and Verification Status

Confirmed:

- Five iteration narrative/state/delta triplets passed the mechanical route-proof verifier.
- Current `--check`, `--verify`, guard JSON, direct resolver probes, hashes, source reads, hook wiring, and workflow wiring support the decisions above.
- The reducer resolves 5/5 questions and records 36 structured findings.

Not verified:

- historical runtime success under the earlier live skill tree;
- when the concurrent `sk-design` restructure will finish;
- the proposed exception schema in implementation;
- lifecycle test-body behavior after the closure failures are repaired.

External packet warning:

- Strict validation of the target spec root exits `2` because the root contains no Level-1 spec documents and reports three missing required files. The detached lineage contract forbids creating those files outside this artifact directory. Lineage-specific validation remains green: five narrative/state/delta triplets, synthesis, registry, dashboard, resource map, terminal event, and lock cleanup all passed.

## 15. Sources

Primary source families:

- `.opencode/bin/compiled-route-sync.cjs`
- `.opencode/bin/compiled-route-guard.cjs`
- `.opencode/bin/lib/compiled-route-manifest.cjs`
- `.opencode/bin/lib/compiled-routing/014-runtime-engine/lib/`
- authored and promoted `009-parent-hub-rollout` children for `cli-external-orchestration` and `sk-design`
- `.opencode/skills/cli-external-orchestration/mode-registry.json`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/bin/tests/compiled-route-manifest.test.cjs`
- `.opencode/scripts/git-hooks/`, `.codex/hooks.json`, and `.github/workflows/`
- iteration narratives `iterations/iteration-001.md` through `iteration-005.md`

The generated evidence inventory is in `resource-map.md`.

## 16. Glossary

- **Authored manifest:** source-controlled activation input used to reproduce a build.
- **Runtime manifest:** promoted activation mirror read by the serving resolver.
- **Closure:** copied runtime dependency set plus its content fingerprint.
- **Freshness:** agreement between current hub inputs, authored activation, and promoted serving state.
- **Exception:** a checked-in, bounded waiver for one hub/failure class.
- **Staging:** isolated candidate runtime root built and verified before publication.
- **Rollback:** exact displaced runtime closure retained for post-publish recovery.

## 17. Convergence Report

- Stop reason: `maxIterationsReached`
- Stop policy: `max-iterations`
- Total iterations: 5
- Questions answered: 5 / 5
- Remaining research questions: 0
- `newInfoRatio` trend: `1.00 → 1.00 → 1.00 → 1.00 → 0.85`
- Mean `newInfoRatio`: `0.97`
- Convergence threshold: `0.05`
- Convergence before iteration 5: telemetry only by operator instruction
- Source coverage recorded by reducer: 109 code references, 43 other references
- Divergent pivots: 0
- Final status: evidence complete for the five ordered questions; implementation remains out of scope
