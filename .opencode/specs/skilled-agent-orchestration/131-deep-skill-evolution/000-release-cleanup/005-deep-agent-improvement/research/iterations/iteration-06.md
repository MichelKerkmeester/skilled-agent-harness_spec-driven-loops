# Iter 006 — Benchmark/promotion/rollback logic gaps

## Question

Does the deep-agent-improvement BENCHMARK (run-benchmark.cjs, benchmark-stability.cjs), PROMOTION (promote-candidate.cjs, promotion-gates.cjs), and ROLLBACK (rollback-candidate.cjs) surface contain NEW logic gaps — benchmark fixture/profile path expectations that do not match shipped assets, promotion-gate field mismatches beyond LG-0003, or rollback backup-path failure modes — NOT already captured in spec.md, audit-findings.jsonl, or iterations 01-05?

## Evidence (file:line citations required)

**Grep results for profiles-dir|profilesDir:**
- 5 matches in run-benchmark.cjs <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs" lines="69-73" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs" lines="258-271" />

**Grep results for fixtureDir|fixtures:**
- 28 matches across scripts, with key implementations in run-benchmark.cjs lines 80-93 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs" lines="80-93" /> and materialize-benchmark-fixtures.cjs lines 32-94 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/materialize-benchmark-fixtures.cjs" lines="32-94" />

**Grep results for backup|archive|\.bak:**
- 16 matches across scripts, with key logic in promote-candidate.cjs lines 297-308 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/promote-candidate.cjs" lines="297-308" /> and rollback-candidate.cjs lines 56-78 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/rollback-candidate.cjs" lines="56-78" />

**Grep results for score.delta|delta.total:**
- 4 matches across scripts, with field access in score-candidate.cjs line 600 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/score-candidate.cjs" lines="600-602" /> and promote-candidate.cjs lines 71-74 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/promote-candidate.cjs" lines="71-74" />

**Key evidence files read:**
- run-benchmark.cjs (profilesDir default, fixture loading logic) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs" lines="258-274" />
- benchmark-stability.cjs (stability measurement, weight optimization) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/benchmark-stability.cjs" lines="1-338" />
- promote-candidate.cjs (promotion gates, backup creation) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/promote-candidate.cjs" lines="233-253" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/promote-candidate.cjs" lines="297-308" />
- rollback-candidate.cjs (rollback execution) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/rollback-candidate.cjs" lines="56-78" />
- promotion-gates.cjs (gate constants, evaluation logic) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/lib/promotion-gates.cjs" lines="1-85" />
- benchmark-profiles/default.json (shipped profile with fixtureDir) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/assets/benchmark-profiles/default.json" lines="1-19" />
- promotion_rules.md (promotion policy) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/references/promotion_rules.md" lines="1-92" />
- promotion_gate_contract.md (gate contract) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/references/promotion_gate_contract.md" lines="30-60" />
- rollback_runbook.md (rollback procedure) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/references/rollback_runbook.md" lines="1-77" />
- benchmark_operator_guide.md (benchmark guide) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/references/benchmark_operator_guide.md" lines="1-100" />

**Cross-reference against known findings:**
- spec.md <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/005-deep-agent-improvement/spec.md" lines="1-306" /> - no benchmark/promotion/rollback logic gaps documented
- audit-findings.jsonl (file not found - phase 2 not yet executed)
- iteration-01.md (LG-0001..LG-0003) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/005-deep-agent-improvement/research/iterations/iteration-01.md" lines="1-67" /> - LG-0003 (promotion gate evaluation disconnect) addresses scoring vs promotion enforcement separation, not path expectations
- iteration-02.md (LG-0004) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/005-deep-agent-improvement/research/iterations/iteration-02.md" lines="1-64" /> - LG-0004 (benchmark threshold contradiction) addresses threshold values, not path expectations
- iteration-03.md (LG-0005) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/005-deep-agent-improvement/research/iterations/iteration-03.md" lines="1-57" /> - LG-0005 (integration scanning mirror path mismatch) - does not address benchmark/promotion/rollback paths
- iteration-04.md (zero findings) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/005-deep-agent-improvement/research/iterations/iteration-04.md" lines="1-63" />
- iteration-05.md (zero findings) <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/005-deep-agent-improvement/research/iterations/iteration-05.md" lines="1-53" />

**Asset directory verification:**
- assets/ directory listing shows: benchmark-fixtures/, benchmark-profiles/, improvement_config.json, and other config files <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/assets" />
- target-profiles/ directory does NOT exist under assets/ (find_file_by_name returned no results)

## Findings

### LG-0006: Benchmark profilesDir default path does not match shipped assets (P1)

**Severity:** P1

**Description:** run-benchmark.cjs line 258 sets the default `profilesDir` to `.opencode/skills/deep-agent-improvement/assets/target-profiles` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs" line="258" />. However, the actual shipped directory structure under assets/ contains `benchmark-profiles/` (not `target-profiles/`) as confirmed by directory listing and the presence of `benchmark-profiles/default.json` <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/assets/benchmark-profiles/default.json" lines="1-19" />. The `target-profiles/` directory does not exist in the shipped assets.

This is a logic gap because:
1. The loadProfile function at lines 69-78 attempts to load profiles from the non-existent `target-profiles/` directory when no explicit `--profiles-dir` argument is provided <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs" lines="69-78" />
2. Operators following the benchmark_operator_guide.md example command (which does not include `--profiles-dir`) will encounter a "profile not found" error <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/references/benchmark_operator_guide.md" lines="36-43" />
3. The shipped `benchmark-profiles/default.json` profile exists but cannot be discovered via the default path

The fixture loading logic at lines 85-93 correctly handles both `profile.fixtureDir` and `profile.benchmark.fixtureDir` fields <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs" lines="85-93" />, and the shipped default.json profile correctly specifies both `fixtureDir` and `benchmark.fixtureDir` pointing to the existing `benchmark-fixtures/` directory <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-agent-improvement/assets/benchmark-profiles/default.json" lines="7-14" />. However, the profilesDir default path mismatch prevents the profile from being loaded in the first place.

**in_scope_check:**
- already_in_spec: false
- already_in_audit_findings: false
- distinct_from_LG0003: LG-0003 addresses promotion gate evaluation disconnect (scoring vs enforcement), this gap addresses path expectation mismatch
- distinct_from_LG0004: LG-0004 addresses benchmark threshold values (75/80/85), this gap addresses directory path mismatch

## Gaps for next iter

- Determine whether the default profilesDir in run-benchmark.cjs should be changed to `benchmark-profiles` (aligning implementation with shipped assets) or whether a `target-profiles/` directory should be created and populated (aligning assets with the implementation default)
- Update benchmark_operator_guide.md to include the `--profiles-dir` flag in example commands if the default path cannot be changed
- Verify that materialize-benchmark-fixtures.cjs has the same profilesDir default and would encounter the same issue

## JSONL delta row

{"iter_id":"iteration-06","timestamp_utc":"2026-05-24T03:47:00Z","executor":"cli-devin","model":"swe-1.6","iter_role":"breadth","status":"complete","findings_count":1,"gaps_count":1,"primary_evidence_files":[".opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs",".opencode/skills/deep-agent-improvement/scripts/benchmark-stability.cjs",".opencode/skills/deep-agent-improvement/scripts/promote-candidate.cjs",".opencode/skills/deep-agent-improvement/scripts/rollback-candidate.cjs",".opencode/skills/deep-agent-improvement/scripts/lib/promotion-gates.cjs",".opencode/skills/deep-agent-improvement/assets/benchmark-profiles/default.json",".opencode/skills/deep-agent-improvement/references/promotion_rules.md",".opencode/skills/deep-agent-improvement/references/promotion_gate_contract.md",".opencode/skills/deep-agent-improvement/references/rollback_runbook.md",".opencode/skills/deep-agent-improvement/references/benchmark_operator_guide.md"]}
