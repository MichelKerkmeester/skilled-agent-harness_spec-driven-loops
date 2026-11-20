# Fix plan

Target: topic advisor-vector-refresh; head: aaaff7dd9dfdef7289b08109f1948cecea899a94

## In scope

### docs:.skilled/skills

- [ ] L3-1 P1 .skilled/skills/system-skill-advisor/references/scoring/lane-weight-tuning.md:58 The doc says the semantic_shadow lane 'carries the lowest fusion weight (0.05)'. The registry gives the lane defaultWeight: 0 on the live channel and 0.05 only on the shadow channel (lane-registry.ts:
  fix: - "The semantic lane scored higher than expected." The semantic_shadow lane is live in the registry but carries the lowe -> - "The semantic lane scored higher than expected." The semantic_shadow lane is live in the registry but its default live
- [ ] L3-3 P1 .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/ablation.md:22 runLaneAblation never reads the lane weight configuration and does not skip zero-weight lanes: it scores a baseline, then disables each of the five registered lanes in turn (ablation.ts:115-121), so t
  fix: `lib/scorer/ablation.ts` drives the ablation protocol: it reads the active lane weight configuration, runs the corpus wi -> `lib/scorer/ablation.ts` drives the ablation protocol: it scores a baseline, then runs the corpus once per registered la
- [ ] L3-5 P1 .skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/five-lane-fusion.md:63 semanticLaneHealth is only added to the status envelope when includeSemanticHealth or debug is set (advisor-status.ts:534). The scenario's step-1 command at line 47 passes neither, so the response car
  fix: - `advisor_status` reports `semantic_shadow` with `disabledReason: "lane_weight_zero"` and `laneEnabled: false`. -> - With `--include-semantic-health true`, `advisor_status` reports `semantic_shadow` with `disabledReason: "lane_weight_z
- [ ] C4 P2 .skilled/skills/system-skill-advisor/references/scoring/lane-weight-tuning.md:162 The related-reference line cites lane-registry.ts:7-19,32-38 as the live and shadow weight source. Lines 32-38 hold the two env-key constants, not weights; the per-lane values are the defaultWeight an
  fix: - `runtime/lib/scorer/lane-registry.ts:7-19,32-38`, live + shadow weight source-of-truth. -> - `runtime/lib/scorer/lane-registry.ts:8-19,44-46`, live + shadow weight source-of-truth.
- [ ] C5 P2 .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/command-meaning-matching.md:18 The overview says meaning matching works whenever the local embedder runs. The semantic lane's live default weight is 0 (lane-registry.ts:13), and withSemanticShadowPromptEmbedding returns before any 
  fix: It works only when the local embedder runs. Without it the advisor returns the phrase-only result. -> It works only when the local embedder runs and the semantic lane weight is above 0. Without either the advisor returns t
- [ ] C8 P2 .skilled/skills/system-skill-advisor/references/scoring/validation-baselines.md:147 The latency troubleshooting row names a slow semantic_shadow embedding lookup as a cause of uncached p95 > 25 ms without the lane-enabled condition. At the default live weight of 0 the lane returns be
  fix: | Uncached p95 > 25 ms | Scoring algorithm changed OR semantic_shadow lane embedding lookup slow | Profile via `runtime/ -> | Uncached p95 > 25 ms | Scoring algorithm changed OR, with the semantic lane enabled, its embedding lookup slow | Profi
- [ ] L3-2 P2 .skilled/skills/system-skill-advisor/references/scoring/lane-weight-tuning.md:86 The shadow-weight edit target is wrong. lane-registry.ts:32-38 holds the two env-key constants (LIVE_LANE_WEIGHTS_ENV_KEY at 37, SHADOW_LANE_WEIGHTS_ENV_KEY at 38), not weights. The shadow weight map 
  fix: Edit `runtime/lib/scorer/lane-registry.ts:7-19` (live weights) or `lane-registry.ts:32-38` (shadow weights). -> Edit `runtime/lib/scorer/lane-registry.ts:8-19` (live and shadow weights, per lane) or `lane-registry.ts:44-46` (`DEFAUL
- [ ] L3-4 P2 .skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/ablation.md:50 advisor_validate returns no ablation slice, so step 2 cannot be done from the response. Its slices are corpus, holdout, parity, safety and latency (advisor-validate.ts:722-760) and the output schema h
  fix: 2. Inspect the ablation slice in the response (or run ablation harness). -> 2. Run the ablation harness; `advisor_validate` returns no ablation slice.
- [ ] L3-6 P2 .skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md:79 The sentence reads as if a plain advisor_status call carries the semantic lane fields. semanticLaneHealth, and with it disabledReason and laneEnabled, is only added when includeSemanticHealth or debug
  fix: `advisor_status` reports `disabledReason: "lane_weight_zero"` and `laneEnabled: false`. -> `advisor_status --include-semantic-health true` reports `disabledReason: "lane_weight_zero"` and `laneEnabled: false`.
- [ ] L3-8 P2 .skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md:83 Both citations are stale. COSINE_THRESHOLD is declared at semantic-shadow.ts:27 and applied at 397; lines 10 and 147-150 are an import and the zero-weight guard. The VITEST token-overlap fallback is a
  fix: Cosine similarity below 0.2 is treated as no signal (`runtime/lib/scorer/lanes/semantic-shadow.ts:10, 147-150`). When th -> Cosine similarity below 0.2 is treated as no signal (`runtime/lib/scorer/lanes/semantic-shadow.ts:27, 397`). When the la
- [ ] L2-1 P1 .skilled/skills/system-skill-advisor/ARCHITECTURE.md:130 The daemon/freshness paragraph says the watcher only 'triggers an incremental rebuild', and the RUNTIME SUBSYSTEMS list never mentions the background vector refresh. The code runs refreshEmbeddingsInB
- [ ] L2-2 P1 .skilled/skills/system-skill-advisor/ARCHITECTURE.md:126 The scorer paragraph presents the semantic lane's cosine as 'the second way a command row can pass' without stating the lane's default weight of 0. lane-registry.ts:13 sets defaultWeight 0, and semant
- [ ] L2-3 P1 .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-status.md:23 The doc says status is fail-open 'even when the daemon is absent' and returns a well-formed envelope. With --warm-only and no daemon the CLI throws CliRetryableError (skill-advisor-cli.ts:1352-1353) a
- [ ] L3-7 P2 .skilled/skills/system-skill-advisor/manual-testing-playbook/operator-h5/degraded-daemon.md:62 The lane's coverage gate checks presence only: it fails when a required row has no vector at all (semantic-shadow.ts:383), and loadSkillEmbeddings returns every stored row without filtering model_id o

### docs:INSTALL-SKILLED.md

- [ ] L4-2 P2 INSTALL-SKILLED.md:96 The doc gives the embedder route's post-approval order as pull, start, scan. The route starts `ollama serve` first and runs `ollama pull` only once the server answers, then scans (doctor-skill-advisor
  fix: After your yes it pulls the model, starts the server and indexes every command. -> After your yes it starts the server, pulls the model and indexes every command.
- [ ] L4-1 P1 INSTALL-SKILLED.md:88 The doc says a local embedding model is enough for the advisor to match a command by meaning. The semantic lane's live default weight is 0 (lane-registry.ts:13), and withSemanticShadowPromptEmbedding 

### docs:.skilled/commands

- [ ] C1 P2 .skilled/commands/doctor/assets/doctor-skill-advisor-presentation.txt:229 The probe rule says an exit 75 from advisor_status means the daemon is absent. The CLI shim exits 75 with a staleDistWarning field in stderr JSON when the dist is missing or stale and --warm-only is s
  fix: An exit 75 from `advisor_status` means the daemon is absent, so the active embedder, both coverage objects, coverage sta -> An exit 75 from `advisor_status` with a `staleDistWarning` field in stderr JSON is a stale build, so report STATUS=FAIL 
- [ ] C2 P2 .skilled/commands/doctor/assets/doctor-skill-advisor-presentation.txt:202 The troubleshooting row says an advisor CLI exit 75 means the daemon is not running. The shim also exits 75 with a staleDistWarning field when the dist is missing or stale under --warm-only (skill-adv
  fix: | Advisor CLI exits 75 | The daemon is not running; a warm-only probe never starts it. `rebuild` does not need it | -> | Advisor CLI exits 75 | The daemon is not running, or the build is stale when stderr JSON carries `staleDistWarning`; a
- [ ] C3 P2 .skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml:150 The verify step names only the next daemon start as the refresh point for incomplete or unread coverage. The daemon also starts the shared refresh after each watcher reindex (watcher.ts:496), so a run
  fix: When coverage is incomplete or unread, name the next daemon start with Ollama up as the refresh point. -> When coverage is incomplete or unread, name the next daemon start or watcher reindex with Ollama up as the refresh point
- [ ] C6 P2 .skilled/commands/doctor/assets/doctor-setup.yaml:60 The embedder leg's status rules conflict. The first rule makes a reachable backend sufficient for PASS, and the next sentence makes incomplete coverage with a reachable backend DEGRADED. The same line
  fix: Report the leg PASS when data.semanticLaneHealth.backend.state is reachable; if that state is not reachable, report DEGR -> Report the leg PASS when data.semanticLaneHealth.backend.state is reachable and coverageComplete is true; if that state 
- [ ] C7 P2 .skilled/commands/doctor/assets/doctor-setup-presentation.txt:55 The presentation repeats the workflow's conflicting leg rule: it marks the leg PASS when the backend is reachable, then marks incomplete coverage with a reachable backend DEGRADED. The visible result 
  fix: Mark the leg PASS when the backend is reachable; an unreachable or missing-model backend is DEGRADED -> Mark the leg PASS when the backend is reachable and coverage is complete; an unreachable or missing-model backend is DEG
- [ ] L1-3 P2 .skilled/commands/doctor/assets/doctor-setup-presentation.txt:55 The presentation contract repeats the workflow's single refresh point. The daemon refreshes missing and stale skill and command vectors after startup and after each watcher reindex, so the next start 
  fix: say the daemon refreshes them on its next start with Ollama up. -> say the daemon refreshes them on its next start or its next watcher reindex, with Ollama up.
- [ ] L2-5 P2 .skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml:148 The doc names only 'its next start with Ollama up' as the refresh point. The daemon also refreshes after each watcher reindex (watcher.ts:496), and the presentation's own section 8 intro says 'on star
  fix: say the daemon refreshes them on its next start with Ollama up -> say the daemon refreshes them on its next start or watcher event with Ollama up
- [ ] L1-1 P2 .skilled/commands/doctor/assets/doctor-setup.yaml:60 The embedder leg gives a single cause for exit 75 and drops the stale-build branch that the advisor leg in the same file defines. The CLI shim exits 75 with a staleDistWarning field in stderr JSON whe
  fix: Exit 75 is SKIP, as for the advisor leg, because the daemon is not running. -> Exit 75 with a staleDistWarning field in stderr JSON is FAIL, with repair npm --prefix .skilled/skills/system-skill-advi
- [ ] L1-2 P2 .skilled/commands/doctor/assets/doctor-setup.yaml:60 The doc names only the next daemon start as the refresh point for incomplete coverage. The daemon also calls refreshEmbeddingsInBackground after every watcher reindex, so missing and stale skill and c
  fix: and say the daemon refreshes them on its next start with Ollama up. -> and say the daemon refreshes them on its next start or its next watcher reindex, with Ollama up.
- [ ] L2-6 P2 .skilled/commands/doctor/assets/doctor-skill-advisor-presentation.txt:304 The final-result rule names only 'its next start with Ollama up' as the refresh point, while the same file's section 8 intro says the daemon refreshes 'on start and after skill changes'. The code refr
  fix: say the daemon refreshes them on its next start with Ollama up -> say the daemon refreshes them on its next start or watcher event with Ollama up
- [ ] L2-4 P2 .skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml:92 'Exit 75 means no daemon is running' is narrower than the code. 75 is EXIT_RETRYABLE, also returned for a stale dist with a staleDistWarning field (skill-advisor.cjs:80) and for timeouts or backend-un

## Pre-existing or outside the scope

