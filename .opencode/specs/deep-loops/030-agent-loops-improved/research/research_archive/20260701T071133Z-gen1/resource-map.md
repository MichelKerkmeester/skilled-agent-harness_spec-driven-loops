# Resource Map: Agent Loops Improved Perfection Audit (Fan-Out Synthesis)

Merged from the `glm` and `gpt` fan-out lineages. See `research.md` §11 for per-lineage source maps.

## Packet Documents
| File | Type | Description |
|------|------|-------------|
| `spec.md` | Root spec | Phase-parent spec with 8-phase Phase Documentation Map; `key_files: []` empty |
| `graph-metadata.json` (root + `008-loop-systems-remediation`) | Metadata | `key_files` omits real implementation surfaces; `last_active_child_id: null` |
| `description.json` | Metadata | Packet description truncated mid-word |
| Phase-parent/child `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Docs | Status drift, template scaffolds, stale `completion_pct`, weak test evidence |

## Phase Children (8 phases)
| Phase | Folder | Status claim | Key Issue |
|-------|--------|--------|-----------|
| 001 | `001-reference-research` | Complete | `plan.md`/`tasks.md` template-default; `completion_pct: 0` |
| 002 | `002-deep-loop-runtime` | Complete | Phase Doc Map 18 rows at Draft; old-packet-number refs |
| 003 | `003-deep-loop-workflows` | Complete | 2 of 3 ADR sub-phases missing `decision-record.md`; 0 `checklist.md` |
| 004 | `004-system-spec-kit` | Complete | `plan.md` template-default (170 lines, unmodified) |
| 005 | `005-skill-interconnection` | Complete | `plan.md` template-default (170 lines, unmodified) |
| 006 | `006-ux-observability-automation` | Complete | Phase Doc Map 6 rows at Draft; weak test evidence (005, 006) |
| 007 | `007-testing` | Complete | Phase Doc Map 2 rows at Draft |
| 008 | `008-loop-systems-remediation` | Complete (claimed) / In Progress (evidence) | `tasks.md`/`implementation-summary.md` still template-default despite `007-fan-out-hardening` child shipping real fixes |

## Review Lineages
| Lineage | Iterations | Status | Key Issue |
|---------|-----------|--------|-----------|
| codex | 50 | CONDITIONAL (maxIterationsReached, stopPolicy=max-iterations) | 0 findings in registry — root cause: 50 non-padded salvage placeholders confuse the reducer's file glob (F-012/F-014) |
| glm | 11 | CONDITIONAL | 9 findings all `status:"?"` unset; 7/8 dimensions CONDITIONAL |
| native | 1 (crashed) | abandoned | >21h stale `.deep-review.lock`; `packet_id` references a non-existent pre-migration path |

## Deep-Loop Runtime/Workflow Infrastructure
| File | Purpose | Finding(s) |
|------|---------|------------|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Fan-out dispatch + per-lineage timeout | 4h hard-cap with no override (`computeLineageTimeoutMs:884-888`) |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs` | Cross-lineage registry merge | Silently drops any lineage registry not using the exact `keyFindings` array key (`mergeResearchRegistries:472`) — confirmed dropped 18/26 findings in this run |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` | Concurrency pool + stall watchdog | No observability alert wired to stall detection |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Research workflow | `step_fanout_spawn_cli` omits `--convergence-threshold` in its documented command; live ephemeral markers at lines 301, 319, 1099 |
| `.opencode/commands/deep/assets/deep_review_auto.yaml` | Review workflow | Live ephemeral markers at lines 395, 408, 988 |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` | Executor/fan-out config schema | `REASONING_EFFORTS` has no `max` value (only up to `xhigh`); per-lineage `iterations` required for `config.maxIterations` to reach a fan-out lineage prompt |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts` and related suites | Test coverage | No regression coverage for convergence-threshold propagation or timeout-cap adequacy |

## Validation Surfaces
| File | Role |
|------|------|
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | Strict/semantic packet validation — proposed new checks: phase-map status sync, completion_pct cross-file agreement, template-default detection, packet-id reference consistency, ADR-folder completeness, comment-hygiene lint |

## Net-New Discoveries Beyond Either Lineage's Own Map
- `research/lineages/glm/iterations/iteration-{1-18}.md` duplicate non-padded copies of `iteration-{001-018}.md` (§3.3 of `research.md`) — found only during root-level synthesis, not by glm's own self-report.
- `research/deep-research-findings-registry.json` (root, merged) — contains only gpt's 8 findings; glm's 18 are silently absent due to the schema-mismatch merge bug (§4.1 of `research.md`) — found only during root-level synthesis.
- `review/lineages/native/.deep-review.lock` (stale, dangerous — references a non-existent old packet path).
- `review/lineages/codex/iterations/iteration-{1-50}.md` (50 non-padded salvage-placeholder duplicates).
- `.opencode/specs/skilled-agent-orchestration/123-agent-loops-improved/review/lineages/glm/review-report.md` (orphaned pre-migration artifact; one of 14 total old-packet-number references across 7 files).
