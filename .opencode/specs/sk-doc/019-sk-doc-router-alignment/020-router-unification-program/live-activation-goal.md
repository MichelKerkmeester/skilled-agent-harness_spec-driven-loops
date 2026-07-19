# Live-Activation Goal — Unified Router from Shadow to Production

> **Mission:** Take the unified router from a proven-in-shadow replacement to a **live, activated** router across all skills. **Hyphen-naming migration is the first priority**, then green the benchmark suite, finish the incomplete compiled projections, and finally activate each hub one at a time behind a reversible fenced gate — with **real models running human-like playbook prompts** as the primary correctness gate. Execution fans out **maximally-parallel GPT agents** on the mechanical phases and strictly serializes the live activation.

This document is the structured plan of record for the next program. A condensed (<4000 char) goal-prompt form of it was delivered in chat for direct dispatch; this version is the authoritative, expanded reference.

---

## 1. Context & current state

### 1.1 What already exists (done + verified)
- **Design authority:** `020-router-unification-program/006-unified-refactor-research/unified-refactor-synthesis.md` (the 8-idea fusion, 4 seams, 7-stage migration model).
- **Shadow implementation:** `020-router-unification-program/007-unified-refactor-implementation/` — phases `000-008` plus 7 cross-phase coherence fixes and one re-review corner fix. All phase harnesses green against the real scorer (read-only); two independent xhigh re-reviews (one ALL-CLOSED, one 6/7 + the empty-overlay corner, now fixed).
- **Key invariant already held:** the shadow branch changed **0 files under `.opencode/skills/`**; the shared scorer trio is byte-identical; `route-gold` is deterministically green. Nothing is wired into live routing yet.

### 1.2 Per-hub readiness map (measured by the 006 canaries)
| Hub | Canary route-gold | Ready to activate? |
|---|---|---|
| **sk-code** (006/001) | GREEN (incl. surface-bundle certificate gate) | Yes |
| **mcp-tooling** (006/003) | GREEN (8 rows; composition + proof path) | Yes |
| **system-deep-loop** (006/002) | 4 real-green + **7 shadow-partial** (compiles 0 resource leaf-pairs) | **No — needs projections phase** |
| **fleet cleanup** (008) | `PREFLIGHT_BLOCKED` (correctly refuses; nothing rolled out) | n/a until hubs live |

### 1.3 The 20 pre-existing benchmark failures (P2 scope)
Reproduce identically at branch base `4ac2bdd02c` on a clean tree, so they are **pre-existing and unrelated to the shadow refactor**. They test **live** routing/surface config:
| Test file | Failing | Concern |
|---|---|---|
| `design-token-lint.vitest.ts` | 4 | sk-design token/route lint |
| `sk-code-router-sync.vitest.ts` | 1 | sk-code parent surface map == union(re-prefix(children)) |
| `surface-slice-sync.vitest.ts` | 7 | sk-code Rust surface slicing (rs/Cargo/napi/wasm/cdylib) |
| `playbook-mode.vitest.ts` | 3 | playbook mode routing |
| `design-dispatch-boundary-proof.vitest.ts` | 5 | sk-design dispatch boundary |

Some of these may resolve once the hyphen rename (P1) settles naming drift; run P2 **after** P1 so tests are fixed against final names.

### 1.4 Blast-radius shift (read this)
Unlike the shadow refactor, **this program edits live skills** — `SKILL.md`, `hub-router.json`, `mode-registry.json`, surface maps, and filesystem names. It also overlaps **active concurrent work** (a sk-design hyphen-rename session and the defaultMode flips left `main` with ~62 dirty `skills/` files). Every phase is therefore higher-blast, must be reversible, and must coordinate to avoid clobbering concurrent edits.

---

## 2. Objectives (four threads, in priority order)
1. **Hyphen-naming migration (FIRST)** — all non-Python filesystem names snake_case → hyphen-case, references intact.
2. **Green the benchmark suite** — fix the 20 live-routing test failures (real defects only), against final names.
3. **Finish incomplete projections** — every hub canary FULLY real-green before it may go live.
4. **Live activation** — wire the unified router into each hub, one at a time, reversible, validated by real models.

---

## 3. Phase plan

Author the new work as a **fresh sub-parent under `020`** (proposed `021-live-activation`) with phase children, each meeting spec-kit doc levels. Gate-3 = extend this program (not a new top-level packet). Build → gate → commit per phase; STRICT SEQUENTIAL where noted. Fan out per §5.

### P1 — Hyphen-naming migration (FIRST PRIORITY)
- **P1.1 Scope** the rename: ALL non-Python filesystem names snake_case → hyphen-case, EXCEPT (a) Python files/modules, (b) tool-mandated names (`__tests__`, `__fixtures__`, leading-`_`, framework-required dirs), (c) already-migrated hyphen-pilot trees.
- **P1.2 Central setup (serial):** allocate a repo-wide `.rename-map.tsv` (`OLD<TAB>NEW`), do the `git mv` renames centrally to avoid git-index races, preserve `R`-status history (never delete+add), snapshot the base.
- **P1.3 Parallel reference-fix (fan out — §5):** one agent per disjoint subtree/hub, each applying every OLD→NEW reference per the map (markdown links, wikilinks, backticked paths, `SKILL.md` resource-maps, JSON/YAML path values, code imports), each writing a report and running its own local check.
- **P1.4 Barrier reconcile (serial):** whole-repo link-check + `validate --recursive`; a reconcile agent fixes cross-subtree seams; scan for gitignored leftovers.
- **Coordinate:** `sk-doc/017` is the naming authority — align with its convention/rollout; for sk-design, **build on / wait for** the concurrent rename session rather than racing it; never double-rename.
- **Acceptance:** target trees fully hyphen-cased; 0 broken links; history preserved; Python + tool-mandated names untouched.

### P2 — Green the benchmark suite
- **P2.1 Triage** each of the 20 failures: real defect vs artifact of concurrent in-flight work vs already-resolved-by-P1. Run each test against a clean base tree to separate pre-existing-real from churn.
- **P2.2 Fix** the real defects in the live routing/surface config (sk-code surface map + Rust slicing; sk-design token lint + dispatch boundary; playbook mode). Prefer surgical config edits, against the final hyphen names.
- **P2.3 Verify** the full 17-file skill-benchmark vitest suite green (run via the spec-kit vitest binary from the scripts dir; no `--dir`).
- **Acceptance:** `Test Files: 17 passed`, `Tests: 0 failed`; no scorer edit; route-gold unaffected.
- **Dependency:** P1 (final names).

### P3 — Finish incomplete compiled projections
- **P3.1** Diagnose why system-deep-loop compiles 0 resource leaf-pairs (the compiled policy lacks the resource projection its route decisions need).
- **P3.2** Complete the compiled resource projection for every hub whose canary shows `shadow-partial`, so the 002 compatibility projector reproduces the full `(intent, resource)` observation.
- **Acceptance:** each per-hub canary is FULLY real-green (0 shadow-partial rows), scored by the real read-only `evaluateRouteGold`; scorer byte-identical.
- **Dependency:** gates system-deep-loop's P4 activation.

### P4 — Live activation (Stage 6; STRICT SEQUENTIAL, one hub at a time — NOT parallelized)
- Wire the unified router into each live hub behind the **fenced-CAS activation selector**. This EDITS live `SKILL.md` / `hub-router.json` / `mode-registry.json`.
- **Order by readiness:** sk-code → mcp-tooling (both canary-green now) → system-deep-loop (after P3) → remaining hubs.
- **Per-hub gate (all required before promote):**
  1. Compiled policy activation manifest minted (compiled serving authority, generation, effective policy hash).
  2. `route-gold` stays **byte-green** for that hub through the flip.
  3. **Real-model playbook routing verified** (see §4) across the three model subjects.
  4. **PROVEN rollback drill** — fenced CAS back to the retained legacy generation, byte-exact, hub re-serving legacy.
  5. Legacy path stays reachable until the compiled path is green in production.
- **Acceptance:** hub serves the compiled policy; route-gold green; real-model routing at parity; rollback demonstrated.
- **Dependency:** P1 (names), P2 (green baseline), P3 (for system-deep-loop).

---

## 4. Testing methodology (the primary correctness gate)

Deterministic `route-gold` proves config-replay equivalence, but the **primary** validation for activation is **real models on human-like prompts**.

- **Source scenarios:** each hub's `manual_testing_playbook` — simple, natural, human-like prompts (not synthetic router-declaration probes).
- **Model subjects (run each scenario through all three):**
  - **GPT-5.6-LUNA** — reasoning `high`, service tier `fast`.
  - **GPT-SOL** — reasoning `medium`, service tier `fast`.
  - **MiniMax M3** — consult `sk-prompt/prompt-models` for the exact dispatch profile before use (small-model dispatch rule).
- **What to check per scenario:** does the subject route to the **correct skill, the correct mode, and the correct document/resource**? Compare the subject's routing declaration + tool-use against the playbook's expected target.
- **Harness:** build/extend the **live** skill-benchmark. It currently dispatches exclusively via cli-opencode (`live-executor.cjs`); add a **cli-codex executor adapter** (mirror the live-executor contract; reuse `extractRoutingJson`/`parseRoutedDeclaration`) so both transports parse identically. Raise the per-scenario timeout for `xhigh`/`high` and auto-fallback to a lower effort on timeout (logged). Document the transport-fidelity caveat (codex event stream differs from opencode `tool_use`).
- **Gate rule:** a hub does not promote (P4) until its playbook scenarios route correctly across the three models, alongside green route-gold.
- **Matrix to record:** `hub × model × scenario → {routed skill, mode, document, pass/fail, fallback used}`.
- **Nondeterminism:** models are not byte-deterministic — define a pass threshold per scenario (correct routing across N repeats), not exact-match.

---

## 5. GPT max-parallelization strategy

**Principle: scale concurrency to the work's independence, not a fixed cap. Fan out wide on mechanical/isolated work; serialize only what is genuinely stateful or live.** The ~2-concurrent cap used during the shadow build applied to *dependent build→verify chains*; it does **not** apply to partition-isolated fan-out.

1. **Partition into disjoint file-ownership units.** Split each mechanical phase so every agent writes to a **non-overlapping** file set — by skill hub, by subtree, by test file, by hub. Give each agent an explicit "write ONLY inside `<tree>`" boundary. Disjoint ownership ⇒ no merge conflicts even in one shared worktree.
2. **Fan out one agent per partition, concurrently — 5-10+.** For embarrassingly-parallel work (reference-fixing after rename, per-hub projection, per-file test fix, N-way read-only review), run many agents at once, not two.
3. **Central setup → parallel execute → barrier reconcile.**
   - *Setup (serial, central):* allocate the rename map / work-list, do conflict-prone shared ops (`git mv`, index writes) once, snapshot the base.
   - *Execute (parallel):* N agents, each owning a disjoint partition, each producing a report file (`.rfx<N>-report.md` style) ending in a `DONE`/`BLOCKED` sentinel.
   - *Barrier (serial):* a single whole-repo pass that sees all partitions together (`validate --recursive`, link-check, route-gold sweep); a reconcile agent fixes cross-partition seams.
4. **Isolation model.** Partition-isolated writes → **shared worktree is safe** (disjoint files never conflict). Genuinely-overlapping parallel writes → **per-agent git worktree** (`isolation: worktree`). Reads → always safe to fan out N-way (adversarial reviewers, multi-lens verification).
5. **Model / effort tiers.** BUILD / mechanical: `gpt-5.6-sol` high, fast. VERIFY / adversarial: `gpt-5.6-sol` xhigh, fast (refute-first; neutral "code correctness reviewer" framing to dodge content filters, structural self-trace on block). Hardest cross-cutting reasoning (design, reconcile): `sol`/`luna` **max**. Small models (MiniMax) via `sk-prompt/prompt-models`.
6. **Serialize the live activation (P4).** The one phase that must **not** be parallelized: live hub activation is stateful (shared route-gold, fenced-CAS, production config). One hub at a time, gated, rollback-drilled. Parallel live flips = unbounded blast radius.
7. **Orchestration mechanics.** Dispatch each agent as a background codex (`AI_SESSION_CHILD=1 codex exec … </dev/null`); capture per-PID for targeted kill; poll every 2-3 min; kill+retry any hung > 15 min. A completion watchdog waits for all partition report sentinels before the reconcile barrier fires. Keep per-agent logs + a final aggregate.
8. **The proven pattern (already running).** The concurrent sk-design rename session demonstrates this exactly: a `.rename-map.tsv` + **5 reference-fix agents**, each owning a disjoint sk-design subtree (audit/foundations, interface/motion, md-generator/styles, hub-level, command-surface), each reporting `RFX#-DONE`, then a `design-command-surface-check` barrier. Replicate this shape per hub for P1, and per failing-file/hub for P2 and P3.

---

## 6. Executors & dispatch
- Keep **≥2 codex** running (far more during parallel fan-out per §5); per-PID kill; append `</dev/null`.
- **BUILD:** cli-codex `gpt-5.6-sol`, reasoning `high`, tier `fast`.
- **VERIFY:** cli-codex `gpt-5.6-sol`, reasoning `xhigh`, tier `fast`, refute-first / adversarial; neutral framing to avoid content-filter blocks, structural self-trace fallback.
- **Model-subject runs:** cli-opencode (native live path) + the new cli-codex adapter.
- **Discipline:** READ `.opencode/skills/cli-external-orchestration/cli-X/SKILL.md` before composing any cli-X prompt. Executor name is the HOW; it runs inside the skill's workflow, never replaces it.

---

## 7. Hard constraints & invariants
- **NEVER edit the shared scorer** — `router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`. Pin their sha256 and re-hash after every phase. A required scorer edit is a migration failure → escalate.
- **Route-gold stays green** through every activation (deterministic equivalence preserved per hub).
- **Reversible + fenced-CAS**; one hub at a time; retained legacy generation always restorable; legacy reachable until compiled is green.
- **Comment hygiene [HARD]:** no spec paths or artifact ids in **code** comments — durable WHY only. (Prose/plan docs like this one may reference paths freely.)
- **No over-emission / no skill-name branch** in the router logic (data-driven only).

---

## 8. Git & integration
- Work in an **isolated worktree**; conventional commit per phase (≤100-char subject, lowercase imperative after the scope).
- Push only to **allowlisted** remotes (`main`, `skilled/v*`); **ask before** any non-allowlisted push. The pre-push hook requires `SPECKIT_ALLOW_REMOTE_PUSH=1` for allowlisted release branches.
- Fast-forward discipline; rebase onto the current release tip before integration.
- Preserve rename history (`R`-status) across P1 waves; verify no old+new duplicate folders after merge.

---

## 9. Cadence & escalation
- **Cadence:** poll running AIs every 2–3 min (kill + retry any hung > 15 min); operator update ~every 5 min.
- **Escalate ONCE** if: a scorer edit is genuinely required; route-gold goes red uncorrectably; a rollback drill fails; the hyphen rename conflicts with concurrent work; or a hub cannot reach real-model routing parity. Escalate with the conflicting facts, a one-line root cause, and the decision needed.

---

## 10. DONE criteria
1. **Naming (P1):** all in-scope non-Python files hyphen-cased; references intact; link-checks clean; Python + tool-mandated names untouched; history preserved.
2. **Benchmark (P2):** the 20 failures fixed; full 17-file skill-benchmark suite green.
3. **Projections (P3):** every hub canary FULLY real-green (0 shadow-partial).
4. **Activation (P4):** each hub serving the compiled policy behind the fenced gate, with route-gold green + real-model playbook routing verified across LUNA/SOL/MiniMax + a proven rollback drill.
5. **System:** `validate --recursive --strict` clean on the new sub-parent; route-gold sweep green across all hubs; scorer trio byte-identical.

---

## 11. Risks & open questions
- **Hyphen-first coordination** — P1 now leads, and it collides directly with the live sk-design rename session; confirm that session is complete (or partition around it) before touching sk-design names. Doing naming first means P2/P4 work against stable names (fewer double-fixes), which is why it is prioritized.
- **Hyphen-rename scope** — "all files" is broad; confirm whether the scope is the router-relevant skills or repo-wide, and defer to `sk-doc/017`'s canonical scope where they overlap.
- **Real-model nondeterminism** — define a per-scenario pass threshold rather than exact-match; record fallbacks.
- **cli-codex tool-use fidelity** — weaker tool-use corroboration than opencode; score the codex path primarily on the stated routing declaration and flag the gap.
- **Activation is a real production change** — the first live flip is the highest-blast step; demonstrate the rollback drill on a canary before the real promote.
