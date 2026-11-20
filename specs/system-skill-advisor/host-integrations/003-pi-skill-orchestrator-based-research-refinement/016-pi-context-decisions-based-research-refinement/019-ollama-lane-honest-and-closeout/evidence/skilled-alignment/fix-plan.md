# Fix plan

Target: worktrees/480-ollama-lane-honest-and-closeout; head: aaaff7dd9dfdef7289b08109f1948cecea899a94

## In scope

### unowned

- [ ] BAT-01 P0 -:- S2-skill-root-metadata failed (exit 1).
- [ ] BAT-02 P0 -:- S3-catalog-package failed (exit 1).
- [ ] BAT-03 P0 -:- S7-skill-graph-freshness failed (exit 1).
- [ ] PRB-01 P1 -:- Probe P01 "check the advisor's vector coverage for skills and commands" expected system-skill-advisor; top-1 was nothing.
- [ ] PRB-02 P1 -:- Probe P02 "turn on the semantic lane and see whether routing improves" expected system-skill-advisor; top-1 was command-doctor-helper.
- [ ] PRB-03 P1 -:- Probe P03 "why is the advisor daemon not refreshing stale skill vectors in the background" expected system-skill-advisor; top-1 was command-doctor-skill-advisor-rebuild.
- [ ] PRB-04 P1 -:- Probe P04 "run an ablation comparing the semantic lane against the lexical baseline" expected system-skill-advisor; top-1 was sk-code.
- [ ] PRB-05 P1 -:- Probe P05 "explain which lane contributed to this routing recommendation" expected system-skill-advisor; top-1 was nothing.
- [ ] PRB-06 P1 -:- Probe P06 "make the advisor daemon shut down cleanly when the session ends" expected system-skill-advisor; top-1 was nothing.
- [ ] PRB-07 P1 -:- Probe P07 "narrow the watcher so it only reindexes the skill I just edited" expected system-skill-advisor; top-1 was nothing.
- [ ] PRB-08 P1 -:- Probe P08 "diagnose why the advisor reports degraded when Ollama is offline" expected system-skill-advisor; top-1 was command-doctor-helper.
- [ ] PRB-09 P1 -:- Probe P09 "regenerate the command bridges so command vectors become embeddable" expected system-skill-advisor; top-1 was nothing.
- [ ] PRB-10 P1 -:- Probe P11 "show the advisor status with semantic lane health" expected system-skill-advisor; top-1 was command-doctor-helper.
- [ ] PRB-11 P1 -:- Probe P12 "disable the background vector refresh for this session" expected system-skill-advisor; top-1 was nothing.

### skill:.skilled/skills/system-skill-advisor

- [ ] B-03 P1 .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/ablation.md:37 The change added a new feature claim at line 24 (196-row corpus, 156 vs 161 correct, 7 flips) but the leaf's Validation And Tests table still lists only advisor-validate.vitest.ts. semantic-shadow-abl
- [ ] D-02 P1 .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:383 The incomplete_skill_vectors gate checks vector presence, not currency. cachedVectors is built from loadSkillEmbeddings(), which returns contentHash but the map keeps only row.embedding, and the gate 
- [ ] A2 P2 .skilled/skills/system-skill-advisor/runtime/tests/scorer/semantic-shadow-ablation.vitest.ts:179 The comment "Keep every projection row as a candidate; unseeded rows receive no cosine match" is false, and the behavior it describes is what the ablation now measures. createFixtureProjection sets so
- [ ] A3 P2 .skilled/skills/system-skill-advisor/runtime/advisor-server.ts:390 Two changed behaviors have no test. (1) The heartbeat moved from after startSkillGraphDaemon to immediately after initSkillGraphDb (advisor-server.ts:390), which is the fix that makes the new HEARTBEA
- [ ] ENV-01 P2 .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1445 SYSTEM_SKILL_ADVISOR_EMBED_REFRESH is read in changed code but .env.example does not list it.
- [ ] ENV-02 P2 .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:372 VITEST is read in changed code but .env.example does not list it.
- [ ] B-07 P2 .skilled/skills/system-skill-advisor/SKILL.md:111 The SKILL.md advisor_status sentence enumerates the opt-in diagnostics and names only includeEmbeddingsHealth: 'with includeEmbeddingsHealth, an opt-in embeddingsHealth covering provider resolution an
- [ ] B-05 P2 .skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/ablation.md:58 SC-005 now carries two ablation records in one Expected Signals list: line 58 keeps 'The recorded ablation covered 193 prompts. It scored 149 with semantic_shadow and 150 without it', and line 59 adds
- [ ] B-06 P2 .skilled/skills/system-skill-advisor/manual-testing-playbook/operator-h5/degraded-daemon.md:61 The new OP-001 expected signal says 'With includeSemanticHealth enabled and Ollama unavailable, semantic health reports DEGRADED'. The status envelope carries no DEGRADED value: semanticLaneHealth.bac
- [ ] X-05 P2 .skilled/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/native-status-transitions.md:69 The new background vector refresh and the new `includeSemanticHealth` status surface have no manual testing step. native-status-transitions.md:69 says 'With `includeSemanticHealth` enabled, the respon
- [ ] C-03 P2 .skilled/skills/system-skill-advisor/README.md:48 The skill README tells a reader to set SPECKIT_ADVISOR_LANE_WEIGHTS_JSON='{"semantic_shadow":0.05}' 'to enable its live scoring' and stops there. The scope adds a precondition the same release note st

### spec:specs/system-skill-advisor/host-integrations

- [ ] X-01 P2 specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/tasks.md:137 CHK-020 is a P0 testing-checklist item marked `[x]` while its own evidence says two acceptance criteria are unmet: 'Every AC row is Met except AC-011 and AC-013, which wait on finalization.' The same 
- [ ] X-02 P2 specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/plan.md:29 The plan still describes the pre-amendment lane-live refresh: 'at the default weight 0 the daemon still makes no Ollama call. The refresh helper returns at once at weight 0' (line 29), '`refreshSkillE
- [ ] X-03 P2 specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/spec.md:215 The spec's edge case says 'a startup scan that blocks for more than 3 minutes now gets the server reaped', but the launcher's startup grace is 5 minutes (`HEARTBEAT_STARTUP_GRACE_MS = 300_000` at syst
- [ ] X-04 P2 specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/description.json:8 The 019 packet's own metadata was never refreshed after the implementation. description.json still carries `lastUpdated: 2026-11-19T17:05:15.920Z` and `memorySequence: 0`; goal.md:11-14 still says `la

### framework:.skilled/changelog

- [ ] C-04 P2 .skilled/changelog/skilled/v4.1.0.0.md:220 The open release note now contradicts itself about whether the daemon probes a backend. Line 220, unchanged by this scope, says the embedder 'points straight to its one registered model at daemon star

### command:doctor

- [ ] D-03 P2 .skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml:148 The /doctor:skill-advisor embedder route tells the operator to repair an unreachable backend by running /doctor:skill-advisor embedder, which is the route they are already in. doctor-skill-advisor-pre
  fix: say routing continues on the other lanes and point to /doctor:skill-advisor embedder. -> say routing continues on the other lanes and point to /doctor:setup, whose embedder leg reports the same coverage and ba

### command:create

- [ ] D-04 P2 .skilled/commands/create/assets/create-command-auto.yaml:470 The new bridge-regeneration activity sits in step_5_validation, whose enforcement is HARD_BLOCK, but it adds no quality_gates entry and no validation_command line, so nothing can fail when the bridges

## Pre-existing or outside the scope

### unowned

- [ ] C-01 P1 .env.example:408 The scope adds SYSTEM_SKILL_ADVISOR_EMBED_REFRESH, an operator-settable switch read at .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:1445 and forwarded to the daemon c (unchanged in range)
  fix: # SYSTEM_SKILL_ADVISOR_THRESHOLD_CONFIDENCE=0.8 # Advisor recommend confidence threshold -> # SYSTEM_SKILL_ADVISOR_THRESHOLD_CONFIDENCE=0.8 # Advisor recommend confidence threshold # SYSTEM_SKILL_ADVISOR_EMBED_RE
- [ ] C-02 P2 README.md:203 The root README's Skill Routing section describes the advisor as a resident daemon and says nothing about the capability this scope adds: after startup IPC is ready and after each watcher reindex the  (unchanged in range)

### skill:.skilled/skills/system-skill-advisor

- [ ] B-01 P1 .skilled/skills/system-skill-advisor/references/runtime/freshness-contract.md:146 The freshness contract still tells a reader that the daemon never writes SQLite on its own: 'The daemon is NOT responsible for: Rebuilding the index automatically. SQLite database writes happen throug (unchanged in range)
- [ ] B-02 P1 .skilled/skills/system-skill-advisor/references/scoring/lane-weight-tuning.md:58 The lane-tuning reference still states the semantic lane 'carries the lowest fusion weight (0.05), so its live contribution is small by design'. The shipped default live weight is 0 (DEFAULT_SCORER_LA (unchanged in range)
- [ ] D-01 P1 .skilled/skills/system-skill-advisor/graph-metadata.json:66 The v1.3.0.0 features have no advisor routing vocabulary. graph-metadata.json is byte-identical between base and head, and the only new trigger_phrases in the diff are in changelog/v1.3.0.0.md, which  (unchanged in range)
- [ ] B-08 P2 .skilled/skills/system-skill-advisor/leaf-aliases.json:1 Battery row S2-skill-root-metadata fails with STALE_GENERATED_FILE: leaf-aliases.json does not match the projection of its leaf-manifest.json. Confirmed cause: the committed file holds 120 rows while  (pre-existing (critic))
- [ ] B-04 P2 .skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md:26 The background vector refresh is a new capability with its own env var (SYSTEM_SKILL_ADVISOR_EMBED_REFRESH), its own coverage function (embeddingCoverage), its own start sites (advisor-server.ts, watc (unchanged in range)
- [ ] B-09 P2 .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/pasted-reply-stripping.md:49 Battery row S3-catalog-package fails with two packet_history_metadata violations: pasted-reply-stripping.md:49 and hooks-and-plugin/weak-follow-up-route-receipt-guard.md:50. Confirmed cause: both line (pre-existing (critic))
- [ ] D-05 P2 .skilled/skills/system-skill-advisor/graph-metadata.json:98 S7-skill-graph-freshness fails on SIGNAL DRIFT compiled vs disk for system-skill-advisor. Cause confirmed in the repository: the compiled runtime/scripts/skill-graph.json carries 31 signals for the sk (pre-existing (critic))

