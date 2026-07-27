# Iteration 3: Freshness Enforcement Placement

## Focus
This iteration investigated Q3 only: where compiled-route freshness should block among pre-commit, pre-push, CI, and session hook, and what escape hatch can allow intentionally uncompilable in-progress hubs without hiding accidental stale compiled routing.

Selected interpretation: recommend the long-term enforcement placement from current repository wiring, with local hooks as developer ergonomics and CI as the authoritative merge gate. Deferred alternatives: implementing the exception manifest or changing hook scripts.

## Findings
1. The guard already exposes the taxonomy needed for enforcement, but today it has only global blocking, global warn-only, and JSON modes. It reports stale runtime manifests, authored drift, and inputs that do not compile; exits non-zero unless `--warn-only` is used; and currently returns three failures: `cli-external-orchestration` and `sk-design` as `inputs-do-not-compile`, plus `sk-doc` as `authored-drift`. [SOURCE: .opencode/bin/compiled-route-guard.cjs:13] [SOURCE: .opencode/bin/compiled-route-guard.cjs:21] [SOURCE: .opencode/bin/compiled-route-guard.cjs:22] [SOURCE: .opencode/bin/compiled-route-guard.cjs:23] [SOURCE: .opencode/bin/compiled-route-guard.cjs:24] [SOURCE: .opencode/bin/compiled-route-guard.cjs:83] [SOURCE: .opencode/bin/compiled-route-guard.cjs:85] [SOURCE: .opencode/bin/compiled-route-guard.cjs:88] [SOURCE: .opencode/bin/compiled-route-guard.cjs:126] [SOURCE: command: `node .opencode/bin/compiled-route-guard.cjs --json`]
2. Pre-commit is the wrong authoritative blocker because the current hook layer is local, opt-in, and bypassable, and the Codex hook installer check refuses to anchor from this linked worktree without an explicit `--allow-worktree`. The tracked pre-commit hook does block some staged-file invariants, but it does not invoke compiled-route freshness; the older `.opencode/hooks` README explicitly says hooks do nothing until installed and can be skipped with `git commit --no-verify`. [SOURCE: .opencode/scripts/install-git-hooks.sh:8] [SOURCE: .opencode/scripts/install-git-hooks.sh:16] [SOURCE: .opencode/scripts/install-git-hooks.sh:30] [SOURCE: .opencode/scripts/install-git-hooks.sh:31] [SOURCE: .opencode/scripts/install-git-hooks.sh:102] [SOURCE: .opencode/scripts/install-git-hooks.sh:108] [SOURCE: .opencode/scripts/install-git-hooks.sh:120] [SOURCE: .opencode/bin/install-codex-hooks.mjs:266] [SOURCE: .opencode/bin/install-codex-hooks.mjs:292] [SOURCE: .opencode/bin/install-codex-hooks.mjs:294] [SOURCE: .opencode/hooks/README.md:13] [SOURCE: .opencode/hooks/README.md:81] [SOURCE: .opencode/hooks/README.md:84] [SOURCE: command: `node .opencode/bin/install-codex-hooks.mjs --check`]
3. Pre-push is too late and too branch-policy-specific to be the primary freshness gate. The current pre-push hook only enforces owner-first naming for new remote branches and explicit remote-push permission for non-allowlisted branches; it has scoped bypass environment variables and fail-open behavior when its shared validator is missing or broken. That makes it useful as an optional last local warning, not the place to decide whether a stale compiled closure may enter `main`. [SOURCE: .opencode/scripts/git-hooks/pre-push:2] [SOURCE: .opencode/scripts/git-hooks/pre-push:8] [SOURCE: .opencode/scripts/git-hooks/pre-push:21] [SOURCE: .opencode/scripts/git-hooks/pre-push:22] [SOURCE: .opencode/scripts/git-hooks/pre-push:34] [SOURCE: .opencode/scripts/git-hooks/pre-push:36] [SOURCE: .opencode/scripts/git-hooks/pre-push:50] [SOURCE: .opencode/scripts/git-hooks/pre-push:55] [SOURCE: .opencode/scripts/git-hooks/pre-push:95] [SOURCE: .opencode/scripts/git-hooks/pre-push:132]
4. CI is the correct authoritative blocker because current GitHub Actions already hold repository-wide routing invariants at PR or main-push time, but none of the current hook or workflow files invoke `compiled-route-guard` or `compiled-route-sync`. `routing-registry-drift.yml` gates registry/advisor parity on pushes and PRs touching routing files, and `runtime-no-spec-import.yml` gates runtime `.opencode/bin/**` changes against spec-tree imports; a compiled-route freshness workflow should be the sibling gate that runs on routing inputs, activation manifests, compiled runtime artifacts, and the guard/sync tools. [SOURCE: .github/workflows/routing-registry-drift.yml:6] [SOURCE: .github/workflows/routing-registry-drift.yml:17] [SOURCE: .github/workflows/routing-registry-drift.yml:42] [SOURCE: .github/workflows/routing-registry-drift.yml:56] [SOURCE: .github/workflows/runtime-no-spec-import.yml:8] [SOURCE: .github/workflows/runtime-no-spec-import.yml:14] [SOURCE: .github/workflows/runtime-no-spec-import.yml:31] [SOURCE: .github/workflows/runtime-no-spec-import.yml:35] [SOURCE: .github/workflows/README.md:16] [SOURCE: .github/workflows/README.md:20] [SOURCE: .github/workflows/README.md:21] [SOURCE: command: `find .github/workflows .opencode/scripts/git-hooks .opencode/hooks -type f ... | xargs rg -n "compiled-route"` returned no matches]
5. Session hooks should warn, not block. Codex SessionStart currently runs session context, worktree guard, git-hook installation guard, and all-package dist freshness, each through short timeouts and fail-open fallback text; `check-git-hooks.sh` says it is intentionally non-fatal and always exits 0. This is the right surface for early visibility when a session starts with stale routing, but it cannot enforce merge safety because a session may not run before a push, and its own contract is warning-only. [SOURCE: .codex/hooks.json:3] [SOURCE: .codex/hooks.json:8] [SOURCE: .codex/hooks.json:13] [SOURCE: .codex/hooks.json:18] [SOURCE: .codex/hooks.json:27] [SOURCE: .opencode/bin/check-git-hooks.sh:5] [SOURCE: .opencode/bin/check-git-hooks.sh:17] [SOURCE: .opencode/bin/check-git-hooks.sh:18] [SOURCE: .opencode/bin/check-git-hooks.sh:92] [SOURCE: .opencode/bin/check-git-hooks.sh:97] [SOURCE: .opencode/skills/sk-git/references/continuous-integration.md:132] [SOURCE: .opencode/skills/sk-git/references/continuous-integration.md:145]
6. Recommended policy: CI blocks all unexcused `stale-manifest` and `authored-drift` failures, and also blocks `inputs-do-not-compile` unless the hub is listed in a versioned, machine-readable exception manifest with `hubId`, allowed `reason`, owner, rationale, creation time, expiry or review date, and evidence link. Pre-commit and session hooks may run the same evaluator in warn-only mode; pre-push may remain focused on branch safety. For `sk-design`, the escape hatch should allow only the known `inputs-do-not-compile` reason while the registry restructure is active; it should not allow `authored-drift` or stale serving for unrelated hubs. [INFERENCE: based on Findings 1-5, .opencode/bin/compiled-route-guard.cjs:85, .opencode/bin/compiled-route-guard.cjs:88, .github/workflows/README.md:16, and .opencode/scripts/git-hooks/pre-push:132]

## Ruled Out
- Authoritative pre-commit blocking: ruled out because local hooks are opt-in or bypassable and current worktree hook anchoring is not a reliable shared enforcement boundary. [SOURCE: .opencode/hooks/README.md:81] [SOURCE: .opencode/hooks/README.md:84] [SOURCE: .opencode/bin/install-codex-hooks.mjs:294]
- Authoritative pre-push blocking: ruled out because the current pre-push hook enforces remote branch safety, not content correctness, and already has scoped bypasses. [SOURCE: .opencode/scripts/git-hooks/pre-push:21] [SOURCE: .opencode/scripts/git-hooks/pre-push:22] [SOURCE: .opencode/scripts/git-hooks/pre-push:132]
- Session hook as a blocker: ruled out because current SessionStart guards are explicitly non-fatal visibility surfaces. [SOURCE: .opencode/bin/check-git-hooks.sh:17] [SOURCE: .opencode/bin/check-git-hooks.sh:18]

## Dead Ends
No dead-end research path needs reducer promotion. The productive path was comparing the guard's current exit taxonomy against the real hook and CI surfaces.

## Edge Cases
- Ambiguous input: "session hook" could mean Codex, Claude, OpenCode, or Copilot. I used Codex because this detached lineage runs under `cli-codex`, then cited shared sk-git parity docs where they describe cross-runtime SessionStart guard intent.
- Contradictory evidence: None for Q3 placement. Current guard failures are compatible with iteration 2's finding that live routing inputs can be intentionally mid-restructure.
- Missing dependencies: There is no existing compiled-route exception manifest to inspect; the exact schema recommendation is an inference, not a verified current file.
- Partial success: Config says progressive synthesis is enabled, but this dispatched leaf explicitly forbids editing `research.md`; I left synthesis for the orchestrator rather than violating the write boundary.

## Sources Consulted
- .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/deep-research-config.json:17
- .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/deep-research-state.jsonl:3
- .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/deep-research-state.jsonl:4
- .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/deep-research-strategy.md:15
- .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/prompts/iteration-003.md:16
- .opencode/bin/compiled-route-guard.cjs:13
- .opencode/bin/compiled-route-guard.cjs:21
- .opencode/bin/compiled-route-guard.cjs:83
- .opencode/bin/compiled-route-guard.cjs:85
- .opencode/bin/compiled-route-guard.cjs:88
- .opencode/bin/compiled-route-guard.cjs:126
- .opencode/scripts/git-hooks/pre-commit:46
- .opencode/scripts/git-hooks/pre-push:21
- .opencode/scripts/git-hooks/pre-push:132
- .opencode/scripts/install-git-hooks.sh:8
- .opencode/scripts/install-git-hooks.sh:120
- .opencode/hooks/README.md:81
- .opencode/hooks/README.md:84
- .codex/hooks.json:3
- .codex/hooks.json:18
- .opencode/bin/check-git-hooks.sh:17
- .github/workflows/routing-registry-drift.yml:6
- .github/workflows/runtime-no-spec-import.yml:14
- .github/workflows/README.md:16
- command: `node .opencode/bin/compiled-route-guard.cjs --json`
- command: `node .opencode/bin/install-codex-hooks.mjs --check`
- command: `find .github/workflows .opencode/scripts/git-hooks .opencode/hooks -type f ... | xargs rg -n "compiled-route"`

## Assessment
- New information ratio: 1.00
- Questions addressed: Q3 freshness guard enforcement and exception semantics
- Questions answered: Q3. CI should be the authoritative blocker; session and pre-commit should warn or optionally assist; pre-push should stay focused on push safety. The escape hatch should be a reviewed, expiring, machine-readable exception for specific hub/reason pairs, visible in CI output.

## Reflection
- What worked and why: Reading the actual guard, hook installers, pre-commit/pre-push hooks, Codex hook wiring, and workflow files separated enforcement authority from developer feedback surfaces.
- What did not work and why: Broad hook searches were noisy because benchmark transcripts and manuals contain many incidental hook strings; narrowing to workflow and hook entrypoints produced usable evidence.
- What I would do differently: If implementation were in scope, I would first design the exception schema and then make the CI evaluator print the active exceptions beside the guard failures so reviewers can audit every bypass.

## Recommended Next Focus
Q4 should assess staging and rollback with this enforcement placement in mind: CI can stop bad source/runtime state before merge, but staging and rollback protect the live local serving root during the build/publish operation itself.
