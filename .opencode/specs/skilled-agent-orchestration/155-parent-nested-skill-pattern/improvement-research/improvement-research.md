# Improvement Research: the parent-skill pattern + the deep-loop setup

<!-- ANCHOR:references -->
**Scope:** forward-looking "what could we do better" for `deep-loop-workflows` (the parent-nested-skill pattern shipped in 155) + the broader `deep-loop-runtime` setup. NOT a defect review (a 10-iteration review already closed the bugs).
**Iterations:** `improvement-research/iterations/iteration-001.md … 005.md` — 5 × `opus-4.8` via claude2 (read-only). Five angles: routing/registry evolution, mode architecture, runtime backend, tooling/DX, systemic/meta. Per-seat findings in `deltas/iter-N.jsonl`.
**Result:** 23 improvements (7 P1, 10 P2, 6 P3) — **all invariant-preserving**. Round-2: the orchestrator host-verified the load-bearing claims (file:line below).
<!-- /ANCHOR:references-end -->

---

## Verdict: the architecture is SOUND — the work is making C-plus *real* + low-regret hardening

The meta-analysis (i05) validates the design: keep the parent-nested-skill pattern, keep the 2-skill (`workflows` + `runtime`) split, keep `deep-improvement` as one 4-lane packet, keep the `ai-council` grandfather (machine-guard it, don't rename). **No rearchitecture is recommended.** Every one of the 23 improvements preserves the invariants. The single biggest theme: the C-plus design's *guarantees are aspirational, not yet enforced* — and the pattern doesn't yet generalize to a second parent skill.

---

## The dominant cluster: make C-plus REAL (and reusable for skill #2)

The C-plus headline promise — *"a map change without a matching registry change fails CI"* — is **not true today**, host-verified:
- **No automated gate runs the guard.** No `.github/workflows/*` runs vitest; the pre-commit hook runs only comment-hygiene / card-sync / tool-ownership. The drift-guard test is green but **nothing executes it** — drift is caught only if someone manually runs vitest.
- **The guard + `/doctor` are hardcoded to the canonical skill.** `routing-registry-drift-guard.vitest.ts:32` asserts against the one `deep-loop-workflows` registry path; `/doctor` check 4a only confirms *that* skill's guard exists and 4b *skips* non-canonical skills. So a **second** parent skill scaffolded by `/create:parent-skill` passes `/doctor` green with **inert, unguarded** `advisorRouting` blocks (`parent-skill-check.cjs:283-288,300-301`).

Three converging fixes (do in this order):
1. **[P1·S·low] Wire the drift-guard + `parent-skill-check` into pre-commit/CI.** The guarantee already exists and is green; only execution is missing. Near-zero regret — this alone makes the central claim true. *(i04 top pick.)*
2. **[P1·M·low/med] Make the guard + `/doctor` registry-agnostic / per-skill.** Glob every parent-skill `mode-registry.json` and assert each (superset-tolerant); have `/doctor` enforce a *per-skill* drift-guard + a registry→advisor-map coverage check (the "`/doctor:advisor-sync`" capability — flag registry lexical/alias-fold modes missing from the hardcoded maps). This is the precondition to reuse `/create:parent-skill` for skill #2. *(i01, i02, i04 converge.)*
3. **[P1·M·low] Codegen the projection maps *from* the registry.** Flip the drift-guard's `assert`→`generate`: a build step emits the Python `DEEP_ROUTING_MODE_BY_KEY`/`DEEP_ROUTING_SKILLS` + TS `DEEP_MODE_BY_CANONICAL` + deep-alias groups from `mode-registry.json`, paired with a `--check` CI gate. Drift becomes impossible *by construction*, cross-language hand-edits vanish, and the inert-gap collapses to "run the generator." **The lexical regex weights cannot be codegen'd — they stay in Python by design.** *(i01 top pick; the regex caveat is the honest boundary.)*

Together these turn C-plus from "a test that exists" into "drift is structurally impossible + the pattern works for any parent skill."

## Other P1 improvements

4. **[P1·M·med] Make `deep-loop-runtime` genuinely self-contained.** It is "MCP-free in name but parasitic on `system-spec-kit`'s internal `node_modules` layout" — 8 deep `../../../system-spec-kit/mcp_server/node_modules/...` reach-ins for zod/better-sqlite3/tsx (host-verified: `coverage-graph-db.ts:3`, `executor-config.ts:3`, `prompt-pack.ts:3`), and it's the only deep-loop skill with no `package.json`. Give it its own manifest (pinned zod, better-sqlite3, tsx) + bare specifiers. Makes "frozen" mean *self-contained*, not *brittle-path-coupled*. *(i03 top pick.)*
5. **[P1·M·med] Unify loop-locking across the 4 graph-backed modes.** Host-verified inconsistency: `context` has a real lock (via its wrapper), `research`/`review` use *prose-only* "acquire lock" instructions, `ai-council` has **none** (0 lock refs in `deep_ai-council_auto.yaml`), and the *promoted* runtime `loop-lock.cjs` CLI is underused. Route all four through the promoted CLI — closes a real concurrency gap and gives the promoted plumbing its intended consumers. *(i05 top pick.)*

## P2 hardening (low-regret)

- **JSON Schema for `mode-registry.json`** — the routingClass/discriminator/backendKind enums are duplicated as ad-hoc literals across `parent-skill-check.cjs`, the drift-guard, and the scaffolder YAML; one schema dedupes them.
- **Guard the Python/TS alias-VALUE divergence** — the guard checks only Python key *presence*; the values differ (`deep:start-research-loop` vs `spec_kit:deep-research`) and are entirely unguarded.
- **Advisory mode-precision signal in the skill-benchmark** — the harness scores skill-id only, yet the fixtures already carry `expected.mode`; add an advisory per-mode signal (keep the parity-fixture split as the gate).
- **Lifecycle-taxonomy drift-guard** — 6 declared `stopReason`s vs a 7-value enum hand-maintained in the YAMLs (`userPaused`); routing got a guard, this didn't.
- **Race-safe `acquireLoopLock` stale-reclaim** (temp+rename last-writer-wins → two reclaimers can both acquire) and **atomic `fanout-merge` write** (`writeFileSync` → `writeStateAtomic`).

## Meta-validation (deliberately NOT recommended)

- **Don't rearchitect** — the 2-skill split + parent-nested pattern earn their keep.
- **Don't split `deep-improvement`** — its 4 lanes share candidate/dispatcher/scorer + loop-host/reduce-state seams; a split forks shared scripts and raises coupling.
- **Don't rename `ai-council`** — high-regret; keep the grandfather, machine-guard the folder≠packetSkillName allowlist, and fix the stale `@deep-ai-council` doc claim (the real agent is `@ai-council`).
- **Don't codegen the lexical regex weights** — they're tuning, not derivable data.

## Suggested sequencing

Phase 1 (this is the high-leverage core): #1 (CI wire) → #2 (registry-agnostic guard + `/doctor:advisor-sync`) → #3 (codegen the maps). Phase 2: #4 (runtime manifest) + #5 (unify locking). Phase 3: the P2 hardening. All preserve the invariants; none change a mode's behavior.
