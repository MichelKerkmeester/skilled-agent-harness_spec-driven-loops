GOAL: Finish packet 015 END TO END — the compiled skill-router GENUINELY SERVING every hub == legacy, then ENABLED BY DEFAULT, verified via tests + a compiled Lane C benchmark + LUNA-HIGH playbooks. All routing code aligned to sk-code:code-opencode; every MD via the right sk-doc mode.

WORKSPACE: work ONLY in worktree .worktrees/0089-sk-doc-default-routing-cutover (branch sk-doc/0089-default-routing-cutover). Commit there. MERGE TO v4 IS OPERATOR-GATED (never merge).

THE FINDING (verified): the compiled-routing MECHANISM works + is byte-identical, but routing COVERAGE was built out only for sk-design. Real parity run (SPECKIT_COMPILED_ROUTING=1): sk-design routes 36 scenarios == legacy, 0 defers (production-grade). The rest are THIN and DEFER most real prompts (safe fallback to legacy, NOT "serving"): sk-code 3 match/19 defer, cli-ext 3, mcp-tooling 1, sk-prompt 0. sk-doc + system-deep-loop have STALE manifests (unevaluable until re-mint). Plus 2 over-detection bugs. So the earlier flip returned 0 hubs because thin hubs aren't compiled-serving, not because the router is broken; full coverage is PROVEN feasible (sk-design). Nothing flipped/committed; DEFAULT_ON_HUBS empty both resolvers; frozen scorer INTACT.

DO (Path 1 — build full coverage, no concessions):
1. PER-HUB COVERAGE BUILD-OUT (core): for each thin hub (sk-code, cli-ext, mcp-tooling, sk-prompt; then sk-doc/system-deep-loop post-remint) grow the compiled policy — registry-compiler.cjs detectors + router.cjs/canary-router.cjs + fixtures/canary-cases.v1.json — so compiled routes == legacy on the hub's FULL playbook + route-gold set (0 defers on covered scenarios). MODEL ON sk-design (006-parent-hub-rollout/006-sk-design). Compiled must route the SAME targets legacy routes — never add/drop one.
2. FIX 2 over-detection bugs: sk-design TV-003 (compiled [interface,foundations] vs legacy [interface]); mcp-tooling MT-008 (compiled [md-generator,mcp-refero] vs legacy [mcp-refero], fails gold). Compiled ⊆ legacy exactly.
3. RE-MINT stale manifests (sk-doc gen5, system-deep-loop gen3). Freshness = manifest {generation,effectivePolicyHash} must equal compileCanonicalParent(current inputs). NO refresh tool exists (mint is create-if-absent) — build a safe refresh (write current {gen+1,hash}, servingAuthority unchanged) or hand-regen + verify. Then build them out.
4. STAGED per-hub default-on flip, ONLY once every hub's parity is `compiled-serving`: persist DEFAULT_ON_HUBS (authored twin + compiled-route-sync.cjs) + lockstep 7 SKILL.md directives + BOTH create-skill templates + catalog wording, stop-on-first-failure, =0 fleet kill-switch, per-hub reversible.
5. Open spec child 015/013-compiled-coverage-buildout (Gate 3 = D) seeded from goal-coverage-buildout.md; docs via sk-doc modes; keep findings-traceability.md current.

VERIFY per hub BEFORE flip: compiled==legacy on ALL scenarios (0 unsafe-misroute, 0 defer-on-covered) → sub-verdict compiled-serving; LUNA-HIGH two-plane, archived <hub>/benchmark/compiled-routing/<run-label>/. After flip: byte-identical proof; =0 → all legacy; cohort-remove → byte-exact restore. Fleet: 247-test vitest green; frozen scorer SHA unchanged; validate --strict Errors:0.

NEVER: edit the 3 frozen scorer files (router-replay / score-skill-benchmark / load-playbook-scenarios); change what LEGACY routes; break byte-exact reversibility; runtime read under .opencode/specs; flip a non-hub (sk-git, system-code-graph, system-skill-advisor, system-spec-kit, mcp-code-mode) or any hub before compiled-serving; touch the 2 strays (mcp-tooling/008-mcp-aside, system-deep-loop/032).

MODELS: prefer GPT-5.6 xhigh fast (cli-codex) for implementation, native Claude Sonnet 5 xhigh alongside; verify every dispatched fix before commit. Reference: sk-design.

READ FIRST: 015/goal-coverage-buildout.md · 015/compiled-routing-coverage-diagnosis.md (key files, per-hub parity) · 015/goal.md + handover.md · 001-research/synthesis-v1.md. Run FRESH.
