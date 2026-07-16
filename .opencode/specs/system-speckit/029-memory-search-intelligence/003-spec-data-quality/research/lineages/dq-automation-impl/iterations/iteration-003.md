# Iteration 003 — B2: the /doctor auto-remediation tier

Focus: where the /doctor detector contract lives, how a guarded auto-remediation tier bolts on, which detectors get safe auto-fix vs report-only, and how the shared safe-fix engine is factored with B1. Reader class: A/L/gov. Floor: BYPASS.

## The /doctor contract (confirmed)

`/doctor <target>` is an argv router (`_routes.yaml` is the canonical manifest, `route-validate.py` is its CI assertion). Each route declares `mutating: read-only | add-only | mutates` (`route-validate.py:46 VALID_MUTATING`), a paired YAML asset (`doctor_<target>.yaml`), `allowed_flags`, `mcp_tools`, `gate3_location`, and `trigger_phrases` (`_routes.yaml:9-17`). Two route shapes already exist and are the two B2 precedents:

1. **Pure read-only** (`memory`, `causal-graph`): `doctor_memory.yaml` is `read-only by contract` with explicit `mutation_boundaries.allowed_targets`/`forbidden_targets` + a `validate_targets` validator (`doctor_memory.yaml:65-94`). Mutations are delegated to `/doctor:update`.
2. **Mixed read-only diagnostic + gated mutate** (`code-graph`): one route, `mutating: read-only` for the diagnostic Phase A, but with `--operation=rescan|prune-excludes|repair-nodes|...`, `--dry-run`, and `--confirm` flags (`_routes.yaml:79-84`) for the mutating operations.

**B2 build-ready design: add a `data-quality` route modeled on `code-graph` (shape 2), NOT on `memory` (shape 1).** The DQ route needs a mutating tier, and `code-graph` is the shipped precedent for "diagnostic by default, mutate behind `--confirm` + `--dry-run` in one route."

## The bolt-on (exact)

1. **Append a route to `_routes.yaml`:**
   - `target: data-quality`
   - `yaml: doctor_data-quality.yaml`
   - `mutating: mutates` (because the `--apply` tier writes; the default path is still dry-run)
   - `allowed_flags: ["--scope=specs|skills|commands|all", "--fix-class=safe", "--dry-run", "--confirm"]`
   - `gate3_location: "description.json / graph-metadata.json metadata fields + length-neutral HVR style swaps; never authored-doc bodies"`
   - `mcp_tools: []` (it shells the `dq-sweep.ts` runner; no MCP needed)
   - `trigger_phrases: ["spec data quality sweep", "fix description.json", "doc quality remediation", "dq auto-fix"]`
   Then re-run `route-validate.py` (asserts the paired asset exists = D, mutation enum = E, ≥1 trigger = G).
2. **Author `doctor_data-quality.yaml`** with the SAME `mutation_boundaries` + `validate_targets` machinery as `doctor_memory.yaml:65-94`, but INVERTED: `allowed_targets` = `description.json`, `graph-metadata.json`, and authored `*.md` (style-fix only); `forbidden_targets` = all the `*.sqlite` DBs (the exact mirror of doctor_memory which forbids the docs and allows the DBs). This reuse is the whole guardrail — the target validator is already written and battle-tested.
3. **Two intents in the YAML, mirroring code-graph:** `DIAGNOSE` (default, read-only, runs the runner with `--dry-run`, prints the band report) and `APPLY` (requires `--confirm`, runs the runner with `--apply --fix-class=safe`, batched, git-tracked). The interactive gates (`doctor_memory.yaml:99-113`) become the per-batch approval gates.

## The shared safe-fix engine (factoring with B1)

There is ONE engine and TWO front doors:
- **Engine:** `scripts/sweep/dq-sweep.ts` (built in iter 002) + its frozen `fixClass` allow-list.
- **Front door 1 (headless/scheduled):** the `dq-corpus-sweep.yml` CI workflow + the opt-in `post-merge` hook (B1).
- **Front door 2 (interactive/operator):** `/doctor data-quality` (B2) — same runner, but with per-batch human approval gates and the `--confirm` requirement.

B2 is NOT a second implementation; it is the interactive UX over the B1 engine. This satisfies the parent's "no new lane / reuse-first" rule and the prior lineages' "one safe-fix engine shared by B1+B2."

## Which detectors get safe auto-fix vs report-only

The classification is INHERITED from the iter-002 `fixClass` allow-list (deny-by-default). Mapped to /doctor's intent tiers:

| Detector | fixClass | /doctor DIAGNOSE | /doctor APPLY (`--confirm`) |
|---|---|---|---|
| missing/invalid `description.json` shape (parent Stage-1) | safe (regenerate from frontmatter) | report | auto-fix |
| `importance_tier`/`status`/`content_type` off-enum | safe (case-normalize to canonical) | report | auto-fix |
| frontmatter `trigger_phrases` not propagated to `description.json` | safe (additive metadata copy, subset) | report | auto-fix |
| HVR style (em-dash/semicolon/Oxford), fence-aware | safe (length-neutral swap) | report | auto-fix |
| unclosed `<!-- ANCHOR -->` | safe (append closer) | report | auto-fix |
| stale `graph-metadata` child-aggregation (parent caution) | RISKY (net-negative broad/narrow) | report | report-only |
| generic `description` body / requirement EARS gaps | risky (semantic authorship) | report | report-only |
| token-budget over-length | none (advisory signal) | report | report-only |
| never-retrieved (B3 telemetry) | none (retrieval-class, pays floor) | report | report-only |

The rule restated: **/doctor APPLY auto-fixes exactly the `fixClass:safe` set; everything `risky`/`none` is report-only regardless of `--confirm`.** `--confirm` unlocks the safe tier; it never unlocks the risky tier (that always needs a human edit, surfaced as a `fix:` suggestion like `post-save-review.ts` already emits).

## On-write vs retroactive timing

B2 is RETROACTIVE + INTERACTIVE (operator-invoked). It is the human-in-the-loop counterpart to B1's scheduled run and A1's on-write gate. Timing: on demand.

## Rollback

- Route: delete the `data-quality` block from `_routes.yaml` + the `doctor_data-quality.yaml` asset (the manifest's own removal instruction, `_routes.yaml:23`), re-run `route-validate.py`.
- Applied fixes: batched git commits → `git revert` (same as B1; safe fixes are length-neutral/additive).
- The route is dormant until a user types `/doctor data-quality`.

## Risks

- **RISK-B2a (mutation-boundary inversion error):** the DQ route ALLOWS doc/JSON writes that `doctor_memory` forbids; a copy-paste of the wrong allow/forbid set could let it write DBs. MITIGATION: the `validate_targets` validator runs before every write (`doctor_memory.yaml:84-94`); reuse it verbatim with the inverted lists, and add a contract test asserting the DBs are in `forbidden_targets`.
- **RISK-B2b (intent confusion):** an operator runs `--confirm` expecting a full fix and gets only the safe tier. MITIGATION: the DIAGNOSE report explicitly lists `riskyReportOnly` items with their `fix:` text so the human knows what was NOT auto-applied.
- **RISK-B2c (route-validate drift):** adding `mutating: mutates` without a real Gate-3 location fails E/required-keys. MITIGATION: the `gate3_location` string names the concrete metadata-field target; route-validate G/required-keys catches omissions in CI.

## Rollout order (B2 internal)

1. Land the B1 engine first (B2 has nothing to call otherwise).
2. Add the `data-quality` route as `mutating: read-only`, DIAGNOSE-only (report the band distribution). Ship + route-validate.
3. Add `doctor_data-quality.yaml` with the inverted `mutation_boundaries` + reused `validate_targets`.
4. Flip the route to `mutating: mutates`, add the APPLY intent behind `--confirm`, safe tier only, batched.

## Dead ends ruled out this iteration

- Mutating `doctor_memory.yaml` to add a fix tier — it is read-only by contract; the DBs are its targets, not docs; mutations there belong to `/doctor:update`. Add a NEW route instead. [evidence: `doctor_memory.yaml:21-27,45`]
- A second safe-fix implementation inside /doctor — B2 is the interactive front door over the B1 engine; one engine, two doors. [evidence: prior-lineage "one safe-fix engine" + parent no-new-lane]
- Letting `--confirm` unlock risky fixes — risky/none are report-only always; `--confirm` gates only the safe tier. [design; parent net-negative rail]

## Assessment

newInfoRatio: 0.70 — the route-modeled-on-code-graph choice, the inverted-mutation_boundaries reuse, and the explicit DIAGNOSE/APPLY×fixClass matrix are net-new build detail; some structural overlap with iter-002's classifier (shared engine) lowers novelty vs iters 1-2. Status: complete. Sources: `_routes.yaml:9-17,23,27-45,79-90`; `route-validate.py:7-21,46`; `doctor_memory.yaml:21-27,65-94,99-113`.
