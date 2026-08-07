# Deep Research Strategy — Compiled Routing Next Move

## 1. OVERVIEW

This detached lineage decides the next move for the compiled-routing subsystem. It treats the operator-supplied verified state as the baseline and spends one iteration on each ordered decision question.

## 2. TOPIC

Choose a long-term activation-manifest model, establish the exact authored/runtime closure-resolution discrepancy, place freshness enforcement, assess staging and rollback, and sequence the minimum safe work around the concurrent `sk-design` restructure.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1. Which activation-manifest ownership model should be the long-term contract, and what breaks under authored-only, runtime-authoritative, or a better third model?
- [x] Q2. What exact mechanism makes authored closure tracing fail for `cli-external-orchestration` and `sk-design` while byte-identical runtime manifests resolve?
- [x] Q3. Where should compiled-route freshness block—pre-commit, pre-push, CI, or session hook—and how should legitimately uncompilable in-progress hubs escape?
- [x] Q4. Should staging and rollback remain for a single-operator git-backed build tool, given the former live-runtime `rmSync` hazard?
- [x] Q5. What is the minimum sequenced work for reproducibility, self-reporting, and unattended safety, split into work safe now versus work that must wait for `sk-design`?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Do not implement fixes.
- Do not re-prove the supplied verified state unless repository evidence contradicts it.
- Do not redesign unrelated routing or registry systems.
- Do not write outside this detached lineage directory.

## 5. STOP CONDITIONS

- Run all five configured iterations even if convergence telemetry falls below `0.05`.
- Stop after iteration 5 and synthesize concrete recommendations with file-and-line evidence.
- Mark every unsupported or incompletely verified claim explicitly.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1. Which activation-manifest ownership model should be the long-term contract, and what breaks under authored-only, runtime-authoritative, or a better third model?
- Q2. What exact mechanism makes authored closure tracing fail for `cli-external-orchestration` and `sk-design` while byte-identical runtime manifests resolve?
- Q3. Where should compiled-route freshness block—pre-commit, pre-push, CI, or session hook—and how should legitimately uncompilable in-progress hubs escape?
- Q4. Should staging and rollback remain for a single-operator git-backed build tool, given the former live-runtime `rmSync` hazard?
- Q5. What is the minimum sequenced work for reproducibility, self-reporting, and unattended safety, split into work safe now versus work that must wait for `sk-design`?

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Reading the writer, sync tool, resolver, and guard together exposed the ownership split at the exact points where manifests are written, copied, served, and checked. (iteration 1)
- Driving both `--check` and `--verify`, then bypassing the resolver's fail-safe `null` with direct `compiledRoute/loadHubEngine` calls exposed the thrown child snapshot errors instead of stopping at "unresolved." (iteration 2)
- Reading the actual guard, hook installers, pre-commit/pre-push hooks, Codex hook wiring, and workflow files separated enforcement authority from developer feedback surfaces. (iteration 3)
- Separating staging, rename, rollback, cleanup, and git avoided the false binary of "keep all complexity" versus "trust git." Each mechanism covers a different failure window. (iteration 4)
- Treating Q5 as dependency ordering, not a fifth independent investigation, kept prior decisions load-bearing and exposed which changes can be verified before `sk-design` is compilable. (iteration 5)

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- A broad manifest grep was too noisy because unrelated design and template manifests dominate the repository; narrowing to compiled-routing code and activation paths produced usable evidence. (iteration 1)
- Manifest-byte comparison alone did not explain the failure, because the failing reads happen after the promoted engine re-enters live `.opencode/skills` inputs. (iteration 2)
- Broad hook searches were noisy because benchmark transcripts and manuals contain many incidental hook strings; narrowing to workflow and hook entrypoints produced usable evidence. (iteration 3)
- Broad repository grep was too noisy because many archived specs and unrelated rollback systems use the same terms; narrowing to `compiled-route-sync.cjs`, its tests, and git history produced usable evidence. (iteration 4)
- A broad grep for exception language was noisy because many unrelated systems use allow/bypass vocabulary; the useful evidence was in the guard, current workflow patterns, and the two affected child harnesses. (iteration 5)

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Authoritative pre-commit blocking: ruled out because local hooks are opt-in or bypassable and current worktree hook anchoring is not a reliable shared enforcement boundary. [SOURCE: .opencode/hooks/README.md:81] [SOURCE: .opencode/hooks/README.md:84] [SOURCE: .opencode/bin/install-codex-hooks.mjs:294] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Authoritative pre-commit blocking: ruled out because local hooks are opt-in or bypassable and current worktree hook anchoring is not a reliable shared enforcement boundary. [SOURCE: .opencode/hooks/README.md:81] [SOURCE: .opencode/hooks/README.md:84] [SOURCE: .opencode/bin/install-codex-hooks.mjs:294]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Authoritative pre-commit blocking: ruled out because local hooks are opt-in or bypassable and current worktree hook anchoring is not a reliable shared enforcement boundary. [SOURCE: .opencode/hooks/README.md:81] [SOURCE: .opencode/hooks/README.md:84] [SOURCE: .opencode/bin/install-codex-hooks.mjs:294]

### Authoritative pre-push blocking: ruled out because the current pre-push hook enforces remote branch safety, not content correctness, and already has scoped bypasses. [SOURCE: .opencode/scripts/git-hooks/pre-push:21] [SOURCE: .opencode/scripts/git-hooks/pre-push:22] [SOURCE: .opencode/scripts/git-hooks/pre-push:132] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Authoritative pre-push blocking: ruled out because the current pre-push hook enforces remote branch safety, not content correctness, and already has scoped bypasses. [SOURCE: .opencode/scripts/git-hooks/pre-push:21] [SOURCE: .opencode/scripts/git-hooks/pre-push:22] [SOURCE: .opencode/scripts/git-hooks/pre-push:132]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Authoritative pre-push blocking: ruled out because the current pre-push hook enforces remote branch safety, not content correctness, and already has scoped bypasses. [SOURCE: .opencode/scripts/git-hooks/pre-push:21] [SOURCE: .opencode/scripts/git-hooks/pre-push:22] [SOURCE: .opencode/scripts/git-hooks/pre-push:132]

### Blocking primarily in pre-commit, pre-push, or session hooks: Q3 evidence already ruled those out as authoritative boundaries; CI is the unattended merge-safety point. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/iterations/iteration-003.md:10] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/iterations/iteration-003.md:11] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/iterations/iteration-003.md:13] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Blocking primarily in pre-commit, pre-push, or session hooks: Q3 evidence already ruled those out as authoritative boundaries; CI is the unattended merge-safety point. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/iterations/iteration-003.md:10] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/iterations/iteration-003.md:11] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/iterations/iteration-003.md:13]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Blocking primarily in pre-commit, pre-push, or session hooks: Q3 evidence already ruled those out as authoritative boundaries; CI is the unattended merge-safety point. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/iterations/iteration-003.md:10] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/iterations/iteration-003.md:11] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/iterations/iteration-003.md:13]

### Continuing the current advisory-only drift report: ruled out for Q1 because it detects the failure but still permits source/runtime divergence to persist. [SOURCE: .opencode/bin/compiled-route-guard.cjs:21] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Continuing the current advisory-only drift report: ruled out for Q1 because it detects the failure but still permits source/runtime divergence to persist. [SOURCE: .opencode/bin/compiled-route-guard.cjs:21]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Continuing the current advisory-only drift report: ruled out for Q1 because it detects the failure but still permits source/runtime divergence to persist. [SOURCE: .opencode/bin/compiled-route-guard.cjs:21]

### Do not spend the next iteration trying to prove current runtime success for `cli-external-orchestration` and `sk-design`; current evidence contradicts it. The smallest useful follow-up is to decide how guard enforcement should treat "known uncompilable because live inputs are mid-restructure" versus "unintended stale compiled closure." -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Do not spend the next iteration trying to prove current runtime success for `cli-external-orchestration` and `sk-design`; current evidence contradicts it. The smallest useful follow-up is to decide how guard enforcement should treat "known uncompilable because live inputs are mid-restructure" versus "unintended stale compiled closure."
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Do not spend the next iteration trying to prove current runtime success for `cli-external-orchestration` and `sk-design`; current evidence contradicts it. The smallest useful follow-up is to decide how guard enforcement should treat "known uncompilable because live inputs are mid-restructure" versus "unintended stale compiled closure."

### Keeping every nested rename recovery branch at current size without pruning: not ruled out as unsafe, but not recommended as the minimum next move. The tests demonstrate behavior, yet the prompt baseline says roughly 100 lines of test-injection-only nested rename recovery remain oversized. [SOURCE: .opencode/bin/compiled-route-sync.cjs:705] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:863] [INFERENCE: based on current failure-injection-only entry points plus the supplied verified baseline] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Keeping every nested rename recovery branch at current size without pruning: not ruled out as unsafe, but not recommended as the minimum next move. The tests demonstrate behavior, yet the prompt baseline says roughly 100 lines of test-injection-only nested rename recovery remain oversized. [SOURCE: .opencode/bin/compiled-route-sync.cjs:705] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:863] [INFERENCE: based on current failure-injection-only entry points plus the supplied verified baseline]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Keeping every nested rename recovery branch at current size without pruning: not ruled out as unsafe, but not recommended as the minimum next move. The tests demonstrate behavior, yet the prompt baseline says roughly 100 lines of test-injection-only nested rename recovery remain oversized. [SOURCE: .opencode/bin/compiled-route-sync.cjs:705] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:863] [INFERENCE: based on current failure-injection-only entry points plus the supplied verified baseline]

### Pure activation-manifest byte comparison was ruled out as a sufficient explanation. `cli-external-orchestration` manifests are byte-identical, yet both authored and promoted resolver paths currently return `null`; the failing operation is snapshot compilation from live skill inputs. [SOURCE: command: focused manifest `shasum -a 256`] [SOURCE: command: snapshot loader comparison] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Pure activation-manifest byte comparison was ruled out as a sufficient explanation. `cli-external-orchestration` manifests are byte-identical, yet both authored and promoted resolver paths currently return `null`; the failing operation is snapshot compilation from live skill inputs. [SOURCE: command: focused manifest `shasum -a 256`] [SOURCE: command: snapshot loader comparison]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Pure activation-manifest byte comparison was ruled out as a sufficient explanation. `cli-external-orchestration` manifests are byte-identical, yet both authored and promoted resolver paths currently return `null`; the failing operation is snapshot compilation from live skill inputs. [SOURCE: command: focused manifest `shasum -a 256`] [SOURCE: command: snapshot loader comparison]

### Pure authored-only ownership with no runtime mirror: ruled out because the serving resolver reads the promoted activation root, not the authored spec tree. [SOURCE: .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:24] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Pure authored-only ownership with no runtime mirror: ruled out because the serving resolver reads the promoted activation root, not the authored spec tree. [SOURCE: .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:24]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Pure authored-only ownership with no runtime mirror: ruled out because the serving resolver reads the promoted activation root, not the authored spec tree. [SOURCE: .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:24]

### Pure runtime-authoritative ownership: ruled out for long-term use because it makes rebuilds non-reproducible unless a separate source sync is added. [SOURCE: .opencode/bin/compiled-route-guard.cjs:17] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Pure runtime-authoritative ownership: ruled out for long-term use because it makes rebuilds non-reproducible unless a separate source sync is added. [SOURCE: .opencode/bin/compiled-route-guard.cjs:17]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Pure runtime-authoritative ownership: ruled out for long-term use because it makes rebuilds non-reproducible unless a separate source sync is added. [SOURCE: .opencode/bin/compiled-route-guard.cjs:17]

### Re-arguing Q1-Q4: the iteration prompt explicitly marks those focuses evidence-complete and asks Q5 to use them as constraints. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/prompts/iteration-005.md:9] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/prompts/iteration-005.md:21] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Re-arguing Q1-Q4: the iteration prompt explicitly marks those focuses evidence-complete and asks Q5 to use them as constraints. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/prompts/iteration-005.md:9] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/prompts/iteration-005.md:21]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-arguing Q1-Q4: the iteration prompt explicitly marks those focuses evidence-complete and asks Q5 to use them as constraints. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/prompts/iteration-005.md:9] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/prompts/iteration-005.md:21]

### Removing staging and copying directly into the serving root: ruled out because the old `rmSync(RUNTIME_ROOT)`-then-copy pattern is the exact live-runtime deletion hazard Q4 asks to consider. [SOURCE: command: `git show 19b87f67a1 -- .opencode/bin/compiled-route-sync.cjs | rg -n -C 10 "rmSync\\(RUNTIME_ROOT"`] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Removing staging and copying directly into the serving root: ruled out because the old `rmSync(RUNTIME_ROOT)`-then-copy pattern is the exact live-runtime deletion hazard Q4 asks to consider. [SOURCE: command: `git show 19b87f67a1 -- .opencode/bin/compiled-route-sync.cjs | rg -n -C 10 "rmSync\\(RUNTIME_ROOT"`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Removing staging and copying directly into the serving root: ruled out because the old `rmSync(RUNTIME_ROOT)`-then-copy pattern is the exact live-runtime deletion hazard Q4 asks to consider. [SOURCE: command: `git show 19b87f67a1 -- .opencode/bin/compiled-route-sync.cjs | rg -n -C 10 "rmSync\\(RUNTIME_ROOT"`]

### Removing staging/rollback before closure tests can run: Q4 evidence makes the former live-runtime deletion hazard and retained rollback binding load-bearing safety concerns. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/iterations/iteration-004.md:8] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/iterations/iteration-004.md:10] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Removing staging/rollback before closure tests can run: Q4 evidence makes the former live-runtime deletion hazard and retained rollback binding load-bearing safety concerns. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/iterations/iteration-004.md:8] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/iterations/iteration-004.md:10]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Removing staging/rollback before closure tests can run: Q4 evidence makes the former live-runtime deletion hazard and retained rollback binding load-bearing safety concerns. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/iterations/iteration-004.md:8] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/iterations/iteration-004.md:10]

### Runtime success in the current checkout was ruled out by `--verify` and direct `resolveRoute` reproduction. [SOURCE: command: `node .opencode/bin/compiled-route-sync.cjs --verify`] [SOURCE: command: direct authored/runtime `resolveRoute` comparison] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Runtime success in the current checkout was ruled out by `--verify` and direct `resolveRoute` reproduction. [SOURCE: command: `node .opencode/bin/compiled-route-sync.cjs --verify`] [SOURCE: command: direct authored/runtime `resolveRoute` comparison]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Runtime success in the current checkout was ruled out by `--verify` and direct `resolveRoute` reproduction. [SOURCE: command: `node .opencode/bin/compiled-route-sync.cjs --verify`] [SOURCE: command: direct authored/runtime `resolveRoute` comparison]

### Session hook as a blocker: ruled out because current SessionStart guards are explicitly non-fatal visibility surfaces. [SOURCE: .opencode/bin/check-git-hooks.sh:17] [SOURCE: .opencode/bin/check-git-hooks.sh:18] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Session hook as a blocker: ruled out because current SessionStart guards are explicitly non-fatal visibility surfaces. [SOURCE: .opencode/bin/check-git-hooks.sh:17] [SOURCE: .opencode/bin/check-git-hooks.sh:18]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Session hook as a blocker: ruled out because current SessionStart guards are explicitly non-fatal visibility surfaces. [SOURCE: .opencode/bin/check-git-hooks.sh:17] [SOURCE: .opencode/bin/check-git-hooks.sh:18]

### Treating git as the rollback mechanism for post-publish gates: ruled out because current rollback binding uses runtime fingerprints and active publication state, while git has no knowledge of a local publication's displaced sibling or runtime-only external activation manifests. [SOURCE: .opencode/bin/compiled-route-sync.cjs:566] [SOURCE: .opencode/bin/compiled-route-sync.cjs:580] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:564] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating git as the rollback mechanism for post-publish gates: ruled out because current rollback binding uses runtime fingerprints and active publication state, while git has no knowledge of a local publication's displaced sibling or runtime-only external activation manifests. [SOURCE: .opencode/bin/compiled-route-sync.cjs:566] [SOURCE: .opencode/bin/compiled-route-sync.cjs:580] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:564]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating git as the rollback mechanism for post-publish gates: ruled out because current rollback binding uses runtime fingerprints and active publication state, while git has no knowledge of a local publication's displaced sibling or runtime-only external activation manifests. [SOURCE: .opencode/bin/compiled-route-sync.cjs:566] [SOURCE: .opencode/bin/compiled-route-sync.cjs:580] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:564]

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Continuing the current advisory-only drift report: ruled out for Q1 because it detects the failure but still permits source/runtime divergence to persist. [SOURCE: .opencode/bin/compiled-route-guard.cjs:21] (iteration 1)
- Pure authored-only ownership with no runtime mirror: ruled out because the serving resolver reads the promoted activation root, not the authored spec tree. [SOURCE: .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:24] (iteration 1)
- Pure runtime-authoritative ownership: ruled out for long-term use because it makes rebuilds non-reproducible unless a separate source sync is added. [SOURCE: .opencode/bin/compiled-route-guard.cjs:17] (iteration 1)
- Do not spend the next iteration trying to prove current runtime success for `cli-external-orchestration` and `sk-design`; current evidence contradicts it. The smallest useful follow-up is to decide how guard enforcement should treat "known uncompilable because live inputs are mid-restructure" versus "unintended stale compiled closure." (iteration 2)
- Pure activation-manifest byte comparison was ruled out as a sufficient explanation. `cli-external-orchestration` manifests are byte-identical, yet both authored and promoted resolver paths currently return `null`; the failing operation is snapshot compilation from live skill inputs. [SOURCE: command: focused manifest `shasum -a 256`] [SOURCE: command: snapshot loader comparison] (iteration 2)
- Runtime success in the current checkout was ruled out by `--verify` and direct `resolveRoute` reproduction. [SOURCE: command: `node .opencode/bin/compiled-route-sync.cjs --verify`] [SOURCE: command: direct authored/runtime `resolveRoute` comparison] (iteration 2)
- Authoritative pre-commit blocking: ruled out because local hooks are opt-in or bypassable and current worktree hook anchoring is not a reliable shared enforcement boundary. [SOURCE: .opencode/hooks/README.md:81] [SOURCE: .opencode/hooks/README.md:84] [SOURCE: .opencode/bin/install-codex-hooks.mjs:294] (iteration 3)
- Authoritative pre-push blocking: ruled out because the current pre-push hook enforces remote branch safety, not content correctness, and already has scoped bypasses. [SOURCE: .opencode/scripts/git-hooks/pre-push:21] [SOURCE: .opencode/scripts/git-hooks/pre-push:22] [SOURCE: .opencode/scripts/git-hooks/pre-push:132] (iteration 3)
- Session hook as a blocker: ruled out because current SessionStart guards are explicitly non-fatal visibility surfaces. [SOURCE: .opencode/bin/check-git-hooks.sh:17] [SOURCE: .opencode/bin/check-git-hooks.sh:18] (iteration 3)
- Keeping every nested rename recovery branch at current size without pruning: not ruled out as unsafe, but not recommended as the minimum next move. The tests demonstrate behavior, yet the prompt baseline says roughly 100 lines of test-injection-only nested rename recovery remain oversized. [SOURCE: .opencode/bin/compiled-route-sync.cjs:705] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:863] [INFERENCE: based on current failure-injection-only entry points plus the supplied verified baseline] (iteration 4)
- Removing staging and copying directly into the serving root: ruled out because the old `rmSync(RUNTIME_ROOT)`-then-copy pattern is the exact live-runtime deletion hazard Q4 asks to consider. [SOURCE: command: `git show 19b87f67a1 -- .opencode/bin/compiled-route-sync.cjs | rg -n -C 10 "rmSync\\(RUNTIME_ROOT"`] (iteration 4)
- Treating git as the rollback mechanism for post-publish gates: ruled out because current rollback binding uses runtime fingerprints and active publication state, while git has no knowledge of a local publication's displaced sibling or runtime-only external activation manifests. [SOURCE: .opencode/bin/compiled-route-sync.cjs:566] [SOURCE: .opencode/bin/compiled-route-sync.cjs:580] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:564] (iteration 4)
- Blocking primarily in pre-commit, pre-push, or session hooks: Q3 evidence already ruled those out as authoritative boundaries; CI is the unattended merge-safety point. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/iterations/iteration-003.md:10] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/iterations/iteration-003.md:11] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/iterations/iteration-003.md:13] (iteration 5)
- Re-arguing Q1-Q4: the iteration prompt explicitly marks those focuses evidence-complete and asks Q5 to use them as constraints. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/prompts/iteration-005.md:9] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/prompts/iteration-005.md:21] (iteration 5)
- Removing staging/rollback before closure tests can run: Q4 evidence makes the former live-runtime deletion hazard and retained rollback binding load-bearing safety concerns. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/iterations/iteration-004.md:8] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/iterations/iteration-004.md:10] (iteration 5)

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

Operator-supplied verified baseline:

- `.opencode/bin/compiled-route-sync.cjs` promotes roughly 62 authored dependencies into `.opencode/bin/lib/compiled-routing`, and seven hubs can serve without spec-tree reads while retaining legacy fallback.
- Staging plus atomic rename, retained rollback, SHA-256 closure binding, inode/device reload detection, dead writer-lease reclamation, and terminal receipt cleanup remain justified.
- Speculative three-way external-manifest reconciliation was removed.
- Roughly 100 lines of test-injection-only nested rename recovery and an oversized 916-line packet remain.
- Editing hub routing inputs without re-minting silently drops a hub to legacy; `compiled-route-guard.cjs` reports freshness but is advisory.
- Authored and runtime activation manifests coexist, but re-mint writes only runtime. Runtime can be healthy while a source rebuild is unreproducible.
- Six of seven hubs serve compiled. `sk-design` is legitimately uncompilable during a concurrent registry restructure.
- `compiled-route-sync.cjs --check` and 17 lifecycle tests fail before test bodies because authored closure tracing cannot resolve `cli-external-orchestration` and `sk-design`, even though authored/runtime manifests and code are byte-identical and runtime resolution succeeds.
- `resource-map.md` is not present at the target spec root; the coverage gate is skipped.
- Startup Spec Kit Memory context was unavailable, so this lineage relies on the verified baseline plus repository evidence.

## 13. RESEARCH BOUNDARIES

- Max iterations: 5
- Convergence threshold: 0.05
- Stop policy: max-iterations
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: enabled
- Executor lineage: `cli-codex`, model `gpt-5.6-sol`
- Session: `fanout-sol-1785122678068-tumo3g`
- Artifact root: `.opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol`
