# Alignment report: topic advisor-vector-refresh

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: topic, file set doc-set
- Target: `topic advisor-vector-refresh`
- Commits: `aaaff7dd9dfdef7289b08109f1948cecea899a94` to `aaaff7dd9dfdef7289b08109f1948cecea899a94`, 0 first-parent commits
- Files: 43, of which 0 uncommitted or untracked
- Owners: 3
- Findings: 27 (P0 0, P1 7, P2 20), 21 literal, 0 inferred, 0 outside the scope; 1 more overturned by the critic and not counted
- Open findings: 27 (0 handed off, 0 rebutted)
- Lanes: L1, L2, L3, L4
- Fix plan: [fix-plan.md](fix-plan.md)

## Surfaces

| Surface | Title | Fired | Files | Checks |
|---|---|---|---|---|
| D1 | Docs match the topic's current code | yes | 43 | lens only |
| D2 | Topic checks pass | yes | 0 | 1 |

## Battery

pass 1, fail 0, cannot run 0, not applicable 0

Grading: topic checks from topics.json; a doc-alignment run has no change-scoped battery.

Failures are not compared against the scope's start point in this version, so a failing row may be debt that predates the scope. Re-running a check at the start point needs a second checkout, which a report-only run does not create.

| Status | Severity | CI-gated | Check | Exit | ms |
|---|---|---|---|---|---|
| pass | P1 | no | `D2-advisor-runtime-tests` | 0 | 195218 |

## Checks that could not run

None.

## Findings by surface

### D1 Docs match the topic's current code

- **L2-1** P1 judgment `.skilled/skills/system-skill-advisor/ARCHITECTURE.md:130`: The daemon/freshness paragraph says the watcher only 'triggers an incremental rebuild', and the RUNTIME SUBSYSTEMS list never mentions the background vector refresh. The code runs refreshEmbeddingsInBackground after startup (advisor-server.ts:439) and after every watcher reindex (watcher.ts:496), at any lane weight, so the doc's account of the daemon's freshness loop omits the skill and command ve...
  - Evidence: `grep -n refreshEmbeddingsInBackground .skilled/skills/system-skill-advisor/runtime/advisor-server.ts .skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts` exit 0: .skilled/skills/system-skill-advisor/runtime/advisor-server.ts:439: void refreshEmbeddingsInBackground(startupSkillsRoot ?? undefined) .skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts:496: void refreshEmbeddingsInBackground(skillsRoot)
- **L3-1** P1 literal `.skilled/skills/system-skill-advisor/references/scoring/lane-weight-tuning.md:58`: The doc says the semantic_shadow lane 'carries the lowest fusion weight (0.05)'. The registry gives the lane defaultWeight: 0 on the live channel and 0.05 only on the shadow channel (lane-registry.ts:13), so its live contribution is zero, not 'small by design'. 0.05 is the shadow weight, which the same sentence then tells the reader to adjust separately, so the sentence contradicts itself and unde...
  - Evidence: `grep -n "semantic_shadow" .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts` exit 0: 13: { id: 'semantic_shadow', defaultWeight: 0, defaultShadowWeight: 0.05, live: true },
- **C1** P2 literal `.skilled/commands/doctor/assets/doctor-skill-advisor-presentation.txt:229`: The probe rule says an exit 75 from advisor_status means the daemon is absent. The CLI shim exits 75 with a staleDistWarning field in stderr JSON when the dist is missing or stale and --warm-only is set (skill-advisor.cjs:80), so a stale build is misread as an absent daemon and the route reports coverage unread instead of naming the build repair. The setup presentation already distinguishes the tw...
  - Evidence: `rg -n "staleDistWarning" .skilled/bin/skill-advisor.cjs` exit 0: 80: fail(result.message, warmOnly ? EXIT_RETRYABLE : EXIT_PROTOCOL, warmOnly ? { staleDistWarning: result.message } : {});
- **C2** P2 literal `.skilled/commands/doctor/assets/doctor-skill-advisor-presentation.txt:202`: The troubleshooting row says an advisor CLI exit 75 means the daemon is not running. The shim also exits 75 with a staleDistWarning field when the dist is missing or stale under --warm-only (skill-advisor.cjs:80), so the row sends an operator with a stale build to the wrong cause.
  - Evidence: `rg -n "staleDistWarning" .skilled/bin/skill-advisor.cjs` exit 0: 80: fail(result.message, warmOnly ? EXIT_RETRYABLE : EXIT_PROTOCOL, warmOnly ? { staleDistWarning: result.message } : {});
- **C3** P2 literal `.skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml:150`: The verify step names only the next daemon start as the refresh point for incomplete or unread coverage. The daemon also starts the shared refresh after each watcher reindex (watcher.ts:496), so a running daemon recovers on the next skill change without a restart. Line 148 has the same defect, which L2-5 records; this line is a second occurrence that L2-5's fix does not cover.
  - Evidence: `rg -n "refreshEmbeddingsInBackground" .skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts` exit 0: 496: void refreshEmbeddingsInBackground(skillsRoot)
- **C4** P2 literal `.skilled/skills/system-skill-advisor/references/scoring/lane-weight-tuning.md:162`: The related-reference line cites lane-registry.ts:7-19,32-38 as the live and shadow weight source. Lines 32-38 hold the two env-key constants, not weights; the per-lane values are the defaultWeight and defaultShadowWeight fields at 9-13, and DEFAULT_SHADOW_WEIGHTS is at 44-46. L3-2 fixes the same stale range at line 86 but leaves this line wrong.
  - Evidence: `grep -n "LIVE_LANE_WEIGHTS_ENV_KEY\|SHADOW_LANE_WEIGHTS_ENV_KEY\|const DEFAULT_SHADOW_WEIGHTS" .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts` exit 0: 37:export const LIVE_LANE_WEIGHTS_ENV_KEY = 'SPECKIT_ADVISOR_LANE_WEIGHTS_JSON'; 38:export const SHADOW_LANE_WEIGHTS_ENV_KEY = 'SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON'; 44:const DEFAULT_SHADOW_WEIGHTS = Object.fromEntries(
- **C5** P2 literal `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/command-meaning-matching.md:18`: The overview says meaning matching works whenever the local embedder runs. The semantic lane's live default weight is 0 (lane-registry.ts:13), and withSemanticShadowPromptEmbedding returns before any prompt embed when that weight is <= 0 (semantic-shadow.ts:151-154), so no meaning pass is possible until SPECKIT_ADVISOR_LANE_WEIGHTS_JSON raises semantic_shadow above 0. The doc's own Command Vectors...
  - Evidence: `grep -n "semantic_shadow', defaultWeight" .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts && grep -n "DEFAULT_SCORER_LANE_WEIGHTS.semantic_shadow" .skilled/skills/system-skill...` exit 0: 13: { id: 'semantic_shadow', defaultWeight: 0, defaultShadowWeight: 0.05, live: true }, 151: if ((DEFAULT_SCORER_LANE_WEIGHTS.semantic_shadow ?? 0) <= 0) {
- **C6** P2 literal `.skilled/commands/doctor/assets/doctor-setup.yaml:60`: The embedder leg's status rules conflict. The first rule makes a reachable backend sufficient for PASS, and the next sentence makes incomplete coverage with a reachable backend DEGRADED. The same line therefore yields two different leg results for the same probe. The embedder route's own rule is coherent: STATUS=OK requires complete coverage and a reachable backend (doctor-skill-advisor-embedder.y...
  - Evidence: `sed -n "60p" .skilled/commands/doctor/assets/doctor-setup.yaml` exit 0: Report the leg PASS when data.semanticLaneHealth.backend.state is reachable; if that state is not reachable, report DEGRADED ... When coverage is incomplete and the backend is reachable, report DEGRADED with stale and missing counts
- **C7** P2 literal `.skilled/commands/doctor/assets/doctor-setup-presentation.txt:55`: The presentation repeats the workflow's conflicting leg rule: it marks the leg PASS when the backend is reachable, then marks incomplete coverage with a reachable backend DEGRADED. The visible result table therefore has no single rule for that probe.
  - Evidence: `sed -n "55p" .skilled/commands/doctor/assets/doctor-setup-presentation.txt` exit 0: Mark the leg PASS when the backend is reachable; an unreachable or missing-model backend is DEGRADED ... Incomplete coverage with a reachable backend is DEGRADED
- **C8** P2 literal `.skilled/skills/system-skill-advisor/references/scoring/validation-baselines.md:147`: The latency troubleshooting row names a slow semantic_shadow embedding lookup as a cause of uncached p95 > 25 ms without the lane-enabled condition. At the default live weight of 0 the lane returns before any prompt embed (semantic-shadow.ts:151-154), so it adds no lookup cost and cannot be the cause. The row sends an operator at the default configuration after a non-cause.
  - Evidence: `grep -n "DEFAULT_SCORER_LANE_WEIGHTS.semantic_shadow" .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts` exit 0: 151: if ((DEFAULT_SCORER_LANE_WEIGHTS.semantic_shadow ?? 0) <= 0) {

### D2 Topic checks pass

- **L2-2** P1 judgment `.skilled/skills/system-skill-advisor/ARCHITECTURE.md:126`: The scorer paragraph presents the semantic lane's cosine as 'the second way a command row can pass' without stating the lane's default weight of 0. lane-registry.ts:13 sets defaultWeight 0, and semantic-shadow.ts:151 returns before embedding when the live weight is <= 0, so at the shipped default no prompt embedding exists and the command meaning pass can never fire. The doc describes a behavior t...
  - Evidence: `grep -n semantic_shadow .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts && grep -n DEFAULT_SCORER_LANE_WEIGHTS.semantic_shadow .skilled/skills/system-skill-advisor/runtime/lib...` exit 0: 13: { id: 'semantic_shadow', defaultWeight: 0, defaultShadowWeight: 0.05, live: true }, 151: if ((DEFAULT_SCORER_LANE_WEIGHTS.semantic_shadow ?? 0) <= 0) {
- **L3-2** P2 literal `.skilled/skills/system-skill-advisor/references/scoring/lane-weight-tuning.md:86`: The shadow-weight edit target is wrong. lane-registry.ts:32-38 holds the two env-key constants (LIVE_LANE_WEIGHTS_ENV_KEY at 37, SHADOW_LANE_WEIGHTS_ENV_KEY at 38), not weights. The shadow weight map is DEFAULT_SHADOW_WEIGHTS at 44-46 and the per-lane values are the defaultShadowWeight fields at 9-13. The same stale range is repeated at line 162 ('lane-registry.ts:7-19,32-38').
  - Evidence: `grep -n "LIVE_LANE_WEIGHTS_ENV_KEY\|SHADOW_LANE_WEIGHTS_ENV_KEY\|const DEFAULT_SHADOW_WEIGHTS" .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts` exit 0: 37:export const LIVE_LANE_WEIGHTS_ENV_KEY = 'SPECKIT_ADVISOR_LANE_WEIGHTS_JSON'; 38:export const SHADOW_LANE_WEIGHTS_ENV_KEY = 'SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON'; 44:const DEFAULT_SHADOW_WEIGHTS = Object.fromEntries(

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

None.

## Overturned by the critic

The critic refuted these or showed they repeat another finding, so they are left out of every count above. Each keeps the severity its lane gave it.

### refuted

- **L2-7** P2 literal `.skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml:148`: The embedder route tells the operator to repair an unreachable backend by running /doctor:skill-advisor embedder, the route they are already in; the presentation's Next line (line 300) repeats the same pointer. The repair should name a route that adds information, such as /doctor:setup, whose embedder leg reports the same coverage and backend state. [D7, L2]
  - Evidence: `grep -n 'point to /doctor:skill-advisor embedder' .skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml` exit 0: ... lanes and point to /doctor:skill-advisor embedder. When the backend is reachable but coverage is incomplete, report the stale and missing counts for skills and commands and say the daemon refreshes them on its next start with Ollama up. STATUS=OK requires complete coverage and a reachable backend."
  - Critic override: refuted, lane severity P2. The embedder route is the only route that starts the server and pulls the model (doctor-skill-advisor-embedder.yaml phase_4_approved_steps), so pointing back to it is the retry path for an unreachable backend. The proposed replacement, /doctor:setup, is read-only: doctor/setup.md says it "writes nothing in the repository and never starts the advisor daemon", so it cannot repair an unreachable back...

## Probes awaiting the critic

None.

## Files no lane reviewed

None.

