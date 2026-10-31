# Iteration 5: What a default-on integration would need, cost and risk

**Focus:** Q5 — assembling the constraints from iterations 1-4 into an integration shape: reader, cadence, label lifecycle, qualification, record, cost and the risk register.

## Findings

### F5-01 — There is a documented surface but no reader; the first need is a consumer and an action policy
The scan is already documented in sk-doc's verification table (`README.md` §8 row: default zero-call, `--jev` needs `--out`), the feature catalog, the playbook scenario SD-021, and one SKILL.md sentence. Nothing parses its output: 032's own record says "No reader is named. A keep here serves nothing." A default-on version needs a named consumer — the README check row is the natural place — plus a policy for what the verdict changes: advisory line, never a gate, because the model half needs a credential and flips near the threshold (F1-07). [SOURCE: .skilled/skills/sk-doc/README.md:191; specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan/implementation-summary.md:173-174; .skilled/skills/sk-doc/feature-catalog/document-validation/citation-drift-scan.md]

### F5-02 — Cost: minutes per run today, seconds after the read-side fix; the model side is flat in corpus size
With the recorded numbers: default census ~171s, draw ~381s, model arm 40.9s / 121 calls / ~41k planned input tokens (F2-01). Per-commit cadence is infeasible (minutes); a periodic (e.g. weekly) advisory run is trivial. The model cost does not grow with corpus size — it scales with labeled rows (F4-05) — so the levers that matter for default-on cost are the read-side prefilter (8,667 docs → 82 citing, F2-02), the adaptive reruns (~65 calls, F2-06) and the free aggregation fix (F2-03). [SOURCE: iterations 1-4 evidence; .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:1036]

### F5-03 — The label lifecycle is the operational bottleneck, and the only sustainable shape is a frozen benchmark plus explicit re-draws
The draw refuses to overwrite a labels file once any row carries a labeler (`draw: refusing to overwrite …, operator labels present`), every row pins the commit it was read at, and the 40-row gate needs all 20 live rows labeled by a human. A default-on scanner cannot auto-label: the tractable shape is this 40-row set as a frozen regression benchmark (its calls replay for free forever, F1-04) plus an explicit re-draw + re-label cycle per period or per new corpus. [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:1274-1287 (draw refusal), :404-420 (commit pins), :70 (LABEL_GATE); 042 scratch/evidence/labels/032-decisions.md]

### F5-04 — Qualification must widen beyond provider and model
`requalifyNotice` fires only when provider or model changes. Changes to the instruction text (hashed on the gate line but not in the report), the window radius, the rerun count, the keep rule, or the row set all silently change what the keep measured. A default-on scanner should pin instruction hash, keep-rule hash and row-set hash into `report.json` and require requalification when any of them changes. [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:719-726,662; ~/.skilled/.labels/runs/032-jev.stdout.txt (instruction hash only on stdout)]

### F5-05 — The record must carry per-row outcomes and the kind split before a reader can act
The report is aggregate-only; a reader that says "N drifted citations confirmed in skill X" needs per-row results and the live/constructed split (F3-01, F3-05). Otherwise the only actionable statement is the verdict line itself — which is exactly what 032's limitation says serves nothing. [SOURCE: ~/.skilled/.labels/runs/032-jev-20261001/report.json; iteration-003.md F3-05]

### F5-06 — Risk register for a default-on scanner
1. **Claim-less rows** (3/20 live rows carry no claim, F2-04) → fix the payload unit or exclude them from the draw.
2. **Threshold-adjacent flips** (F=3; one supports rerun at exactly 0.5, F1-07) → keep three reruns; prefer the min-rule aggregation (F2-03).
3. **Silent skip** — without jev 0.6.2 or a credential the arm prints a skip and exits 0 (safe failure, useless signal) → health-check the arm separately.
4. **Privacy** — `calls.jsonl` holds committed doc text; the output must stay outside the repository (as it did) and never be committed.
5. **Untested decision branches** — no coverage for sign-test/flip stops or disagreeing reruns (F3-07).
6. **Moving surface** — the Deem arm was removed after the measurement (commit 7c2bb6e3d1); do not couple a default-on path to a second backend.
7. **No zero-call value** — the dead-citation half currently finds only sandboxed fixture noise (F3-06), so the integration is honest only if it is presented as a model-backed measurement, not a lint. [SOURCE: iterations 1-4; .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:973-1005; git show 7c2bb6e3d1 --stat]

### F5-07 — Recommended integration shape
Advisory, periodic, benchmark-anchored: (a) census with a prefilter and pre-registered hashes; (b) the frozen 40-row set as the regression sample; (c) aggregation fix + per-kind columns + per-row outcomes in the report; (d) claim-less-row payload fix; (e) requalification widened to instruction/rule/row-set; (f) tests for the sign/flip/disagreement paths; (g) reader = the sk-doc verification row plus a periodic report line; never blocking a commit; (h) expansion to spec acceptance-criteria citations only after an illustrative-reference classifier exists (F4-04). [SOURCE: synthesis of iterations 1-4]

## Sources Consulted

- `.skilled/skills/sk-doc/README.md:183-191` (verification table)
- `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` (`:70`, `:662`, `:719-726`, `:973-1005`, `:1036`, `:1274-1287`)
- `~/.skilled/.labels/runs/032-jev.stdout.txt`, `~/.skilled/.labels/runs/032-jev-20261001/report.json`
- `specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan/implementation-summary.md:169-177`
- `git show 7c2bb6e3d1 --stat` (Deem-arm removal)
- Iterations 1-4 of this lineage

## Assessment

- **newInfoRatio:** 0.8
- **Novelty justification:** The integration shape, the label-lifecycle conclusion, the widened-qualification need and the risk register are new synthesis; individual constraints are inherited from iterations 1-4.
- **Confidence:** High for F5-01..F5-05 (source-backed), medium-high for F5-07 (recommendation, not measured).

## Reflection

- **What worked:** Assembling each iteration's constraint into a single integration shape; checking the actual consumer surfaces (README table, hooks, test runner) rather than assuming one exists.
- **What failed:** Nothing attempted failed. An assumption that `run-script-tests.sh` would be a natural hook failed quickly — it runs Python tests only, so it cannot host the node scan.
- **Ruled out:** "Wire it into the pre-commit hook" — ruled out on cost (minutes per run; per-commit cadence infeasible). "Auto-label with a model" — ruled out by the design: the draw and gate exist to keep labels human.

## Recommended Next Focus

None — this is the fifth and final iteration; synthesis follows.
