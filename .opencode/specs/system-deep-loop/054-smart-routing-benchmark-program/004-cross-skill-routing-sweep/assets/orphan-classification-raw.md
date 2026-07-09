| skill | orphan file | class | proposed intent | 1-line rationale |
|---|---|---|---|---|
| deep-research | references/protocol/context_snapshot.md | ROUTABLE | codebase-scoped research initialization | Header says to load during INIT for codebase-scoped topics to capture bounded source/symbol pointers before the loop starts. |
| deep-research | references/convergence/convergence_reference_only.md | EXEMPT |  | Explicitly reference-only design archaeology/future optimization material, not part of the live executable stop contract. |
| deep-research | assets/deep_research_dashboard.md | EXEMPT |  | Auto-generated dashboard template/observability surface that is overwritten each iteration, not task-intent guidance for live execution. |
| deep-research | assets/deep_research_strategy.md | ROUTABLE | deep research strategy initialization and iteration tracking | Runtime template copied during init and read by orchestrator/agents every iteration for focus, questions, and state ownership. |
| deep-review | references/state/state_jsonl.md | ROUTABLE | deep review state-log validation and debugging | Defines JSONL config/iteration/event schemas used when validating reducers, dashboards, malformed state, and recovery events. |
| deep-review | references/protocol/completion_criteria.md | ROUTABLE | deep review completion verification | Authoritative definition-of-done checklist for accepting verdicts, debugging premature STOP, and reconciling review-report claims. |
| deep-review | references/protocol/loop_state_and_gates.md | ROUTABLE | deep review state-machine and quality-gate debugging | Provides task-time state transitions, error recovery, and Evidence/Scope/Coverage gates that decide whether STOP is safe. |
| deep-review | references/convergence/convergence_recovery.md | ROUTABLE | deep review convergence recovery | Used to select recovery strategies, verify convergence report fields, and debug graph-aware blocked STOP decisions. |
| deep-ai-council | assets/prompt_pack_round.md | ROUTABLE | AI council seat-round prompting | Seat prompt template with role/context/action/output contract required when running a council round. |
| deep-improvement | references/shared/heldout_and_gold_sets.md | ROUTABLE | evaluation fixture tiering and anti-overfit evidence | Shared visible/held-out/gold convention is live promotion evidence guidance across improvement lanes. |
| deep-improvement | references/shared/promotion_gate_contract.md | ROUTABLE | guarded candidate promotion | Formal accept/ship gate contract and rollback/promotion script pointers needed before mutating canonical targets. |
| deep-improvement | references/non_dev_ai_system/fixture_authoring.md | ROUTABLE | Lane D fixture authoring | Direct instructions for authoring/validating visible, held-out, and gold fixtures for Lane D packagings. |
| deep-improvement | references/non_dev_ai_system/grader_calibration.md | ROUTABLE | Lane D grader calibration | Task-time protocol for selecting/calibrating independent graders and diagnosing phantom-gap drift. |
| deep-improvement | references/model_benchmark/mixed_executor_methodology.md | ROUTABLE | model-benchmark multi-iteration sweep methodology | Provides operator guidance for mixed-executor 8+2 sweeps and adjudication false-positive filtering. |
| deep-improvement | references/agent_improvement/candidate_proposal_format.md | ROUTABLE | agent-improvement candidate proposal authoring | Defines candidate file structure, metadata, lineage, and mutation representation for proposal generation. |
| deep-improvement | references/agent_improvement/profiling_audit_log.md | ROUTABLE | dynamic profiling auditability | Documents profile-selection audit log location, entry shape, and retention for debugging profile choice. |
| deep-improvement | references/agent_improvement/score_dimensions.md | ROUTABLE | agent candidate scoring rubric | Defines the five scoring dimensions, weights, thresholds, and reproducibility inputs used to score candidates. |
| deep-improvement | assets/skill_benchmark/README.md | EXEMPT |  | Directory README/catalog for Lane C reference data and legacy fixture assets; useful for discovery, not task-intent routing. |
| deep-improvement | assets/skill_benchmark/fixtures/README.md | EXEMPT |  | Legacy Mode A fixture corpus catalog; superseded-but-supported inventory, not live per-task guidance. |
| deep-improvement | assets/skill_benchmark/fixtures/deep-loop-workflows/routing_precision.md | ROUTABLE | skill-benchmark routing precision probe | Contains a reproducible advisor-probe command/expected-results scorecard for checking system-deep-loop mode routing. |
| deep-improvement | assets/model_benchmark/README.md | EXEMPT |  | Top-level Lane B data-directory catalog listing fixtures/profiles and tree layout; scripts consume the data directly. |
| deep-improvement | assets/model_benchmark/benchmark-profiles/README.md | EXEMPT |  | Profile inventory README documenting canonical JSON configs; search/discovery catalog rather than live execution guidance. |
| deep-improvement | assets/model_benchmark/benchmark-fixtures/README.md | EXEMPT |  | Fixture taxonomy and inventory README for benchmark data; detailed discovery aid, not a specific live intent route. |
| deep-improvement | assets/model_benchmark/benchmark-fixtures/reviewer_schema.md | ROUTABLE | reviewer benchmark fixture authoring | Schema needed when authoring or validating reviewer-prompt regression fixtures and expected verdicts. |
| deep-improvement | assets/agent_improvement/README.md | EXEMPT |  | Lane A data/config directory catalog summarizing templates and ownership boundaries; keep as intentionally unrouted index. |
| deep-improvement | assets/agent_improvement/improvement_config_reference.md | ROUTABLE | improvement config tuning | Field-level reference explicitly used when adjusting dimension weights, stop thresholds, and runtime config switches. |
| deep-improvement | assets/agent_improvement/target-profiles/README.md | EXEMPT |  | Intentional empty-directory/path-consistency README for dynamic-only profiles; structural placeholder should stay unrouted. |

Summary: ROUTABLE 18; EXEMPT 9; PRUNE 0; NEEDS-HUMAN 0.
