# Goal — Compiled-Routing Coverage Build-Out & Genuine Default-On (015, Path 1)

> The standing goal for the **final phase** of packet 015: make the compiled skill-router *genuinely serve* every hub == legacy, then enable it by default. Supersedes the "flip the cohort" framing after the coverage finding. Companions: `goal.md` (the original program goal, 002–012, accurate history), `handover.md` (resume state), `compiled-routing-coverage-diagnosis.md` (the verified technical diagnosis + key files), `001-research/{synthesis,verification}-v1.md` (evidence base).

## 0. Current status + remaining work (updated 2026-07-21)

**SHIPPED (committed in the worktree, checkpoints `f19ee17179` → `85a5876dc8`):** all 7 hubs `compiled-serving` == legacy; **enabled by default** (`DEFAULT_ON_HUBS` = all 7, both resolver copies byte-identical); `SPECKIT_COMPILED_ROUTING=0` fleet kill-switch + per-hub reversibility proven; verified via automated tests (258/258), the compiled Lane C parity (7/7), and a compiled-routing LUNA-HIGH sweep (14/14); `011`+`013` packet docs reconciled (`validate --strict` Errors:0). Frozen scorer SHAs untouched throughout; no legacy routing decision changed; **v4 merge NOT done (operator-gated).**

**REMAINING WORK — to reach true END-TO-END:**

- **R1 — `sk-code:code-opencode` alignment gate** (explicit goal criterion): run the RESOURCE_MAP alignment / drift-guard gate (`verify_alignment_drift.py` + `run-all-drift-guards.sh`); confirm PASS or fix any drift the coverage build-out introduced (never touching frozen files or what legacy routes).
- **R2 — every MD via the right sk-doc mode** (explicit goal criterion): audit + conform every Markdown this program created/edited (7 `feature-catalog/.../compiled-routing-and-legacy-fallback.md` leaves → create-feature-catalog; 2 create-skill parent templates; `013` spec docs → system-spec-kit templates) against its governing sk-doc-mode validator.
- **R3 — EXHAUSTIVE MANUAL VERIFICATION** (operator directive: *"every related testing playbook scenario manually run and verified, every benchmark, EVERYTHING"*):
  - **Every manual-testing-playbook scenario, every hub** — NOT just the compiled-routing subset. For each scenario in each hub's `manual-testing-playbook/`, run it against the now-default-on compiled router and verify all four: routing target, expected detection markers, exact resource-loading paths, and user-visible outcome match the playbook's contract. Cover all 7 flipped hubs; confirm the 5 non-hubs still route legacy.
  - **Every benchmark** — run + verify + archive: the full skill-benchmark (Lane A/B/C per hub, all modes), the compiled Lane C parity (all 7), the FULL LUNA-HIGH manual-playbook sweep (all hubs, both planes — not only the compiled-routing scenarios), route-gold, and any other benchmark in the tree.
  - **EVERYTHING** — leave no related scenario or benchmark unrun; record each result PASS/SKIP/FAIL with durable evidence; SKIP only on genuine transport unavailability, never to skip work. Bar: frozen scorers unchanged, `DEFAULT_ON_HUBS` still 7, legacy byte-identical, `validate --strict` Errors:0.
- **R4 — non-blocking follow-ups:** advisor-enrichment cohort (`system-skill-advisor/.../compiled-routing-flag.ts` — decide flip-vs-document); SD-015 non-route-clause lock-in test; manifest provenance quirk (SKILL.md prose feeding `effectivePolicyHash`).

_Resume anchor: `013-compiled-coverage-buildout/handover.md`. Best run FRESH (prior session context exhausted)._

## 1. The destination

All seven hubs' compiled routers reach **production routing coverage** — compiled routes **byte-identical to legacy on their full scenario set** (no deferring real prompts) — and are then **enabled by default**, verified end to end.

When done:
- Each hub's compiled Lane-C parity sub-verdict is **`compiled-serving`** (compiled == legacy on *every* scenario), not `legacy-fallback-drifted`. sk-design already proves this is achievable (36 scenarios routed == legacy, 0 defers).
- The staged per-hub cohort flip lands all 7 (`DEFAULT_ON_HUBS` populated, both resolver copies in sync), with the 7 `SKILL.md` directives + both create-skill parent templates + catalog wording moved lockstep to default-on.
- `SPECKIT_COMPILED_ROUTING=0` remains the documented fleet-wide kill-switch; per-hub cohort removal restores prior behavior byte-for-byte.
- Verified by: compiled Lane C parity (compiled-serving ×7), LUNA-HIGH manual playbooks, the full 247-test vitest suite, `=0` + per-hub rollback drills, `validate --strict` Errors:0.
- The three frozen scorer files are **never edited** (SHA-256 unchanged start→end); no routing **decision** ever diverges from legacy (coverage is *built to match* legacy, never by changing what legacy routes); no runtime path reads under `.opencode/specs`.

## 2. Why this phase exists — the verified finding

The compiled-routing *mechanism* works and is byte-identical, but **coverage was only built out for sk-design.** Real parity run (`SPECKIT_COMPILED_ROUTING=1`, route-gold on):

| Hub | match | safe-defer | UNSAFE-misroute | stale | Work |
|---|---|---|---|---|---|
| sk-design | 36 | 0 | 1 (TV-003) | – | reference impl; fix 1 over-detect only |
| sk-code | 3 | 19 | 0 | – | **build coverage** (largest gap) |
| cli-external-orchestration | 3 | 0 | 0 | – | build coverage |
| mcp-tooling | 1 | 8 | 1 (MT-008) | – | build coverage + fix over-detect |
| sk-prompt | 0 | 0 | 0 | – | build coverage |
| sk-doc | — | — | — | stale | re-mint → assess → build |
| system-deep-loop | — | — | — | stale | re-mint → assess → build |

- **safe-defer** = compiled defers, legacy routes → legacy fallback (byte-identical outcome, but NOT "serving"). The build-out converts these to real `match`.
- **UNSAFE-misroute** = compiled routes to a target legacy doesn't (TV-003 `[interface,foundations]` vs `[interface]`; MT-008 `[md-generator,mcp-refero]` vs `[mcp-refero]`, fails gold). Must be fixed.

## 3. The plan

**A. Per-hub coverage build-out (the core work).** For each thin hub (sk-code, cli-ext, mcp-tooling, sk-prompt, then sk-doc/system-deep-loop post-remint): grow the hub's compiled policy — `registry-compiler.cjs` detectors + `router.cjs`/`canary-router.cjs` + `fixtures/canary-cases.v1.json` — so the compiled decision routes == legacy on the hub's full playbook + route-gold scenario set. **Model on sk-design** (`006-parent-hub-rollout/006-sk-design`, 562-line compiler). Compiled must route the SAME targets legacy routes; never add or drop a target.

**B. Fix the 2 over-detection bugs.** sk-design TV-003 and mcp-tooling MT-008 — compiled adds a 2nd target legacy doesn't. Make compiled route ⊆ legacy exactly.

**C. Re-mint the 2 stale manifests** (sk-doc gen5, system-deep-loop gen3). Freshness = manifest `{generation, effectivePolicyHash}` must equal `compileCanonicalParent(current authored inputs)`. **No refresh tool exists** — `mint` is create-if-absent only. Build a safe refresh path (write current `{gen+1, hash}`, servingAuthority unchanged), or hand-regenerate + verify via the freshness check. This reveals their true coverage → then build them out.

**D. Staged per-hub default-on flip** (once every hub is `compiled-serving`). Persist `DEFAULT_ON_HUBS` (authored twin + `compiled-route-sync.cjs`); lockstep the 7 `SKILL.md` directives + both create-skill templates + catalog wording; stop-on-first-failure in the controller's recommended order; `=0` fleet kill-switch; per-hub reversible.

**E. Formalize a spec child.** On start, open `015/013-compiled-coverage-buildout/` (Gate 3, Option D) seeded from this goal; author docs via the right `sk-doc` mode; keep `findings-traceability.md` current.

## 4. Verification (per hub, before any flip)
- Compiled == legacy on ALL its scenarios (route-gold parity); **0 unsafe-misroute, 0 defer on covered scenarios** → parity sub-verdict `compiled-serving`.
- LUNA-HIGH two-plane acceptance (routing + gold holdout), archived under `<hub>/benchmark/compiled-routing/<run-label>/`.
- After flip: routing byte-identical proof; `=0` → all legacy; cohort-remove → byte-exact restore.
- Fleet: 18-file / 247-test vitest green; frozen scorer SHA unchanged; `validate --strict` Errors:0.

## 5. Hard constraints (NEVER)
- Edit the 3 frozen scorer files (`router-replay.cjs` `d5e13da…`, `score-skill-benchmark.cjs` `d5a9cc7…`, `load-playbook-scenarios.cjs` `5029f22…`).
- Change what **legacy** routes; break byte-exact reversibility; let runtime read under `.opencode/specs`; flip a non-hub (sk-git, system-code-graph, system-skill-advisor, system-spec-kit, mcp-code-mode); flip any hub before its parity is `compiled-serving`.
- Touch the 2 pre-existing strays (`mcp-tooling/008-mcp-aside/…`, `system-deep-loop/032-…`).
- **Merge to v4 is operator-gated** — never merge.

## 6. Execution
- **Workspace:** worktree `.worktrees/0089-sk-doc-default-routing-cutover` (branch `sk-doc/0089-default-routing-cutover`). Commit there.
- **Models:** prefer **GPT-5.6 xhigh (fast)** for implementation via cli-codex; **native Claude Sonnet 5 xhigh** alongside; verify every dispatched fix independently (frozen SHA, compiled==legacy, no flip until green, 247 tests, git scope) before committing.
- **Reference:** sk-design's `006-parent-hub-rollout/006-sk-design` is the worked example of full coverage — copy its structure.
- **Context:** best run **fresh** (this session is heavy + post-compaction); use `compiled-routing-coverage-diagnosis.md` as the technical handoff.
