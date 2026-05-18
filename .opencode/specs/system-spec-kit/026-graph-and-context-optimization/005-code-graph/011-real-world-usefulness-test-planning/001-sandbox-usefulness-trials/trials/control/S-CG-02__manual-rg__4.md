# Control: .opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts

## Import/header lines
```
5:import { applyAmbiguity, isAmbiguousTopTwo } from './ambiguity.js';
6:import { attributionReason, dominantLane, isDerivedDominant } from './attribution.js';
13:import { normalize } from '../affordance-normalizer.js';
14:import { scoreDerivedLane } from './lanes/derived.js';
15:import { scoreExplicitLane } from './lanes/explicit.js';
16:import { scoreGraphCausalLane } from './lanes/graph-causal.js';
17:import { scoreLexicalLane } from './lanes/lexical.js';
18:import { scoreSemanticShadowLane } from './lanes/semantic-shadow.js';
19:import { loadAdvisorProjection } from './projection.js';
20:import { SCORING_CALIBRATION } from './scoring-constants.js';
21:import { isReadOnlyExplainer, matchesPhraseBoundary } from './text.js';
28:import { isLiveScorerLane } from './lane-registry.js';
40:import type { NormalizedAffordance } from '../affordance-normalizer.js';

```

## Basename dependents
```
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-validate.ts:12:import { scoreAdvisorPrompt } from '../lib/scorer/fusion.js';
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts:12:import { scoreAdvisorPrompt } from '../lib/scorer/fusion.js';
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/metrics.ts:515:  | 'spec_kit.scorer.fusion_live_weight_share'
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/metrics.ts:540:  { name: 'spec_kit.scorer.fusion_live_weight_share', type: 'gauge', labels: ['lane'] },
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/ambiguity.ts:10:// The ranking sort in fusion.ts uses `score`, so computing ambiguity on a
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/ablation.ts:5:import { scoreAdvisorPrompt } from './fusion.js';
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/scoring-constants.ts:5:// `lib/scorer/fusion.ts` (`confidenceFor`, `uncertaintyFor`, and
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/scoring-constants.ts:15: * Confidence-assembly knobs used by `confidenceFor` in `fusion.ts`.
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/scoring-constants.ts:67: * Uncertainty-assembly knobs used by `uncertaintyFor` in `fusion.ts`.
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/scoring-constants.ts:99: * Per-skill routing biases applied by `primaryIntentBonus` in `fusion.ts`.
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts:253:  if (/\b(corpus ids?|first-100 predictions|continuation prompts|routing study config|confusion matrix|source-mix note|prompt template|packet-local)\b/.test(promptLower)) {
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts:291:      speckitMetrics.setGauge('spec_kit.scorer.fusion_live_weight_share', weights[lane] / liveTotal, { lane });
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/graph-causal.ts:93:  // the clamp covers the full signed range [-1, 1] so fusion sees both positive
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/bench/scorer-calibration.bench.ts:14:import { scoreAdvisorPrompt } from '../lib/scorer/fusion.js';
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/bench/scorer-bench.ts:11:import { scoreAdvisorPrompt } from '../lib/scorer/fusion.js';
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/affordance-normalizer.test.ts:14:import { scoreAdvisorPrompt } from '../lib/scorer/fusion.js';
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts:125:// COMPILE-TIME-ONLY internal seam used by the scorer fusion path. Affordance
.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:457:        description: 'Evaluation mode. Defaults to ablation; use k_sensitivity for raw pre-fusion RRF K analysis.'
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-recommend.vitest.ts:14:vi.mock('../../lib/scorer/fusion.js', () => ({
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:263:          fusionMethod: 'trigger',
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-recommend-unavailable.vitest.ts:12:vi.mock('../../lib/scorer/fusion.js', () => ({
.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:116:  fusion: number | null;
.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:138:  scoreResolution: 'intentAdjusted' | 'fusion' | 'score' | 'semantic' | 'none';
.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:591:  const fusion = toNullableNumber(rawResult.rrfScore);
.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:592:  if (fusion !== null) return fusion;
.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:602:  if (toNullableNumber(rawResult.rrfScore) !== null) return 'fusion';
.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:864:        fusion: toNullableNumber(rawResult.rrfScore),
.opencode/skills/system-spec-kit/mcp_server/stress_test/skill-advisor/scorer-fusion-stress.vitest.ts:4:// Exercises scorer fusion and ambiguity behavior from feature catalog
.opencode/skills/system-spec-kit/mcp_server/stress_test/skill-advisor/scorer-fusion-stress.vitest.ts:5:// 04--scorer-fusion and 06--mcp-surface advisor recommendation paths.
.opencode/skills/system-spec-kit/mcp_server/stress_test/skill-advisor/scorer-fusion-stress.vitest.ts:9:import { scoreAdvisorPrompt } from '../../skill_advisor/lib/scorer/fusion.js';
.opencode/skills/system-spec-kit/mcp_server/stress_test/skill-advisor/scorer-fusion-stress.vitest.ts:36:describe('skill advisor scorer fusion stress behavior', () => {
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/routing-fixtures.affordance.test.ts:6:import { scoreAdvisorPrompt } from '../lib/scorer/fusion.js';
.opencode/skills/system-spec-kit/mcp_server/stress_test/skill-advisor/scorer-extras-stress.vitest.ts:8:import { scoreAdvisorPrompt } from '../../skill_advisor/lib/scorer/fusion.js';
.opencode/skills/system-spec-kit/mcp_server/stress_test/skill-advisor/five-lane-fusion-stress.vitest.ts:5:import { scoreAdvisorPrompt } from '../../skill_advisor/lib/scorer/fusion.js';
.opencode/skills/system-spec-kit/mcp_server/stress_test/skill-advisor/five-lane-fusion-stress.vitest.ts:33:describe('sa-019 — Five-lane fusion', () => {
.opencode/skills/system-spec-kit/mcp_server/stress_test/skill-advisor/five-lane-fusion-stress.vitest.ts:54:      keywords: ['packet 044 stress routing', 'five lane fusion'],
.opencode/skills/system-spec-kit/mcp_server/stress_test/skill-advisor/five-lane-fusion-stress.vitest.ts:61:    const result = scoreAdvisorPrompt('generate vitest stress tests for packet 044 five lane fusion remediation', {
.opencode/skills/system-spec-kit/mcp_server/stress_test/skill-advisor/five-lane-fusion-stress.vitest.ts:82:        keywords: ['routing stress', 'fusion audit'],
.opencode/skills/system-spec-kit/mcp_server/stress_test/skill-advisor/five-lane-fusion-stress.vitest.ts:88:        keywords: ['routing stress', 'fusion audit'],
.opencode/skills/system-spec-kit/mcp_server/stress_test/skill-advisor/five-lane-fusion-stress.vitest.ts:100:    const result = scoreAdvisorPrompt('implement routing stress fusion audit', {
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/lane-attribution.test.ts:6:import { scoreAdvisorPrompt } from '../lib/scorer/fusion.js';
.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/w5-shadow-learned-weights.vitest.ts:16:import { __testables as stage2Testables } from '../../lib/search/pipeline/stage2-fusion.js';
.opencode/skills/system-spec-kit/mcp_server/stress_test/search-quality/query-surrogates-stress.vitest.ts:57:    const match = matchSurrogates('how does reciprocal rank fusion improve search', surrogates);
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/scorer/advisor-quality-049-003.vitest.ts:12:import { scoreAdvisorPrompt } from '../../lib/scorer/fusion.js';
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/scorer/advisor-quality-049-003.vitest.ts:197:    // against `update`. The guard is exercised through fusion.ts when a real
.opencode/skills/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:183:        queries: ['graph retrieval regression', 'rrf fusion stability'],
.opencode/skills/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:30:} from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skills/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:31:import type { FusionResult, RankedList } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skills/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:277:    it('cross-variant fusion normalizes to [0,1] when enabled', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:438:  it('totalItems reflects unique IDs across all fusions', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:454:  it('aggregates multi-query sensitivity per query instead of cross-query fusion', () => {
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts:11:import { scoreAdvisorPrompt } from '../../lib/scorer/fusion.js';
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts:102:  it('AC-5 semantic shadow scores but contributes 0.00 to live fusion', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts:5:import { executeStage2 } from '../lib/search/pipeline/stage2-fusion';
.opencode/skills/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:2:// Converted from: unit-rrf-fusion.test.ts (custom runner)
.opencode/skills/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:4:import type { FusionResult } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skills/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:5:import { fuseResults, fuseResultsMulti, fuseResultsCrossVariant, SOURCE_TYPES, DEFAULT_K } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skills/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:181:  it('C138-T1: multi-source fusion with 3+ sources works', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:510:        specFolder: 'specs/022-hybrid-rag-fusion',
.opencode/skills/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:523:      expect(content).toContain('/spec_kit:resume specs/022-hybrid-rag-fusion');
.opencode/skills/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:7:import * as rrfFusion from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skills/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:558:    it('T031-RRF-01: unified_search available from rrf-fusion', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:562:    it('T031-RRF-02: is_rrf_enabled available from rrf-fusion', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:566:    it('T031-RRF-03: SOURCE_TYPES available from rrf-fusion', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:571:    it('T031-RRF-04: hybridSearchEnhanced uses RRF fusion internally', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:755:  it('C138-T3: graph source type is defined in rrf-fusion', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:759:  it('C138-T4: RRF fusion accepts graph as a valid source', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:831:  it('C138-P0-T5: adaptive graph weight from fusion profile applied', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:832:    // The graph channel weight should come from the adaptive fusion weights,
.opencode/skills/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:835:    // Verify results returned (graph was included in fusion)
.opencode/skills/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:1109:describe('Degree channel fusion regression coverage', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:1110:  it('keeps degree ranking in the final fusion when graph returns no results', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:1165:  it('T023: graph-present fusion keeps lexical evidence grouped under the keyword channel', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:71:    { id: 102, content: 'Hybrid search uses reciprocal rank fusion to combine sparse and dense scores. '.repeat(2) },
.opencode/skills/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:102:    { id: 502, content: 'Evaluation reports summarize fusion-channel impact and reranker uplift. '.repeat(2) },
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/parity/python-ts-parity.vitest.ts:12:import { scoreAdvisorPrompt } from '../../lib/scorer/fusion.js';
.opencode/skills/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:93:describe('Stage 2 fusion regression coverage', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:135:    const { __testables } = await import('../lib/search/pipeline/stage2-fusion');
.opencode/skills/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:158:    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion');
.opencode/skills/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:190:    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion');
.opencode/skills/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:201:      // attentionScore is now independent and not set by stage2 fusion
.opencode/skills/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:213:    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion');
.opencode/skills/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:253:    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion');
.opencode/skills/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:272:    // attentionScore is now independent and not set by stage2 fusion
.opencode/skills/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:279:  it('T-degradation: fusion continues when DB unavailable', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:284:    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion');
.opencode/skills/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:314:    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion');
.opencode/skills/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:338:    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion');
.opencode/skills/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:361:    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion');
.opencode/skills/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:388:    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion');
.opencode/skills/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:408:    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion');
.opencode/skills/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:420:    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion');
.opencode/skills/system-spec-kit/mcp_server/tests/query-surrogates.vitest.ts:128:    const content = 'Reciprocal Rank Fusion (RRF) is a fusion method.';
.opencode/skills/system-spec-kit/mcp_server/tests/query-surrogates.vitest.ts:423:Set the k parameter to control the fusion weight.
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:1890:        fusionMethod: effectiveMode,
.opencode/skills/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:15:  '001-memory-search-routing-tuning/001-search-fusion-tuning',
.opencode/skills/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:16:  '001-memory-search-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty',
.opencode/skills/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:17:  '001-memory-search-routing-tuning/001-search-fusion-tuning/002-add-reranker-telemetry',
.opencode/skills/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:18:  '001-memory-search-routing-tuning/001-search-fusion-tuning/003-continuity-search-profile',
.opencode/skills/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:19:  '001-memory-search-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum',
.opencode/skills/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:20:  '001-memory-search-routing-tuning/001-search-fusion-tuning/005-doc-surface-alignment',
.opencode/skills/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:21:  '001-memory-search-routing-tuning/001-search-fusion-tuning/006-continuity-profile-validation',
.opencode/skills/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:23:  '001-memory-search-routing-tuning/002-content-routing-accuracy/001-fix-delivery-progress-confusion',
.opencode/skills/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:24:  '001-memory-search-routing-tuning/002-content-routing-accuracy/002-fix-handover-drop-confusion',
.opencode/skills/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:72:    const prompt = readText('001-memory-search-routing-tuning/001-search-fusion-tuning/prompts/deep-research-prompt.md');
.opencode/skills/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:74:      '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-memory-search-routing-tuning/001-search-fusion-tuning',
.opencode/skills/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:79:      '001-memory-search-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum/plan.md',
.opencode/skills/system-spec-kit/mcp_server/tests/migration-lineage-identity.vitest.ts:83:      '001-memory-search-routing-tuning/002-content-routing-accuracy/002-fix-handover-drop-confusion/plan.md',
.opencode/skills/system-spec-kit/mcp_server/tests/empty-result-recovery.vitest.ts:68:    spec_folder: 'specs/system-spec-kit/022-hybrid-rag-fusion',
.opencode/skills/system-spec-kit/mcp_server/tests/empty-result-recovery.vitest.ts:133:      specFolder: 'specs/system-spec-kit/022-hybrid-rag-fusion/filters/fusion-only',
.opencode/skills/system-spec-kit/mcp_server/tests/empty-result-recovery.vitest.ts:277:      specFolder: 'specs/system-spec-kit/022-hybrid-rag-fusion/filters/fusion-only',
.opencode/skills/system-spec-kit/mcp_server/tests/empty-result-recovery.vitest.ts:286:      'fusion',
.opencode/skills/system-spec-kit/mcp_server/tests/empty-result-recovery.vitest.ts:360:      specFolder: 'specs/system-spec-kit/022-hybrid-rag-fusion/filters/fusion-only',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:206:      fusionMethod: 'trigger',
.opencode/skills/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:201:      query: 'implementation details for hybrid rag fusion pipeline',
.opencode/skills/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:223:      query: 'implementation details for hybrid rag fusion pipeline',
.opencode/skills/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:241:      query: 'the complete architecture of the advanced fusion pipeline v3',
.opencode/skills/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:279:    const payload = buildRecoveryPayload(makeCtx({ query: 'hybrid rag fusion pipeline' }));
.opencode/skills/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:284:    const payload = buildRecoveryPayload(makeCtx({ query: 'hybrid rag fusion pipeline implementation' }));
.opencode/skills/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:301:      query: 'implementation details for hybrid rag fusion pipeline stage two',
.opencode/skills/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:311:      query: 'stage2 fusion (rrfScore normalized)',
.opencode/skills/system-spec-kit/mcp_server/tests/validation-metadata.vitest.ts:24:import { __testables as stage2Testables } from '../lib/search/pipeline/stage2-fusion';
.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-corpus-parity.vitest.ts:11:import { scoreAdvisorPrompt } from '../../lib/scorer/fusion.js';
.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1462:        fusionMethod: 'rrf',
.opencode/skills/system-spec-kit/mcp_server/lib/eval/eval-db.ts:65:  -- Final fused results after RRF/fusion
.opencode/skills/system-spec-kit/mcp_server/lib/eval/eval-db.ts:72:    fusion_method TEXT DEFAULT 'rrf',
.opencode/skills/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:14:} from '@spec-kit/shared/algorithms/adaptive-fusion';
.opencode/skills/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:15:import type { FusionWeights } from '@spec-kit/shared/algorithms/adaptive-fusion';
.opencode/skills/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:16:import type { RrfItem } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skills/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:63:    vi.doUnmock('../../shared/algorithms/rrf-fusion.js');
.opencode/skills/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:156:  it('T9: flag OFF returns standard fusion results', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:172:  it('T10: flag ON returns adaptive fusion results', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:187:  it('T10b: partial rollout without identity fails closed to standard fusion', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:240:  it('T12: degraded contract is assembled by hybridAdaptiveFuse when adaptive fusion throws', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:242:    vi.doMock('@spec-kit/shared/algorithms/rrf-fusion', async () => {
.opencode/skills/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:243:      const actual = await vi.importActual<typeof import('@spec-kit/shared/algorithms/rrf-fusion')>(
.opencode/skills/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:244:        '@spec-kit/shared/algorithms/rrf-fusion'
.opencode/skills/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:259:    const dynamicFusion = await import('@spec-kit/shared/algorithms/adaptive-fusion');
.opencode/skills/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:270:      failureMode: 'adaptive_fusion_error: simulated adaptive failure',
.opencode/skills/system-spec-kit/mcp_server/tests/remediation-008-docs.vitest.ts:14:describe('008 search fusion and reranker remediation docs', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:250:        specFolder: 'specs/042-rag-fusion',
.opencode/skills/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:260:    expect(callOptions).toMatchObject({ specFolder: 'specs/042-rag-fusion' });
.opencode/skills/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:7:import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skills/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:8:import type { RankedList, FusionResult } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skills/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:198: * final metrics reflect per-query sensitivity rather than a synthetic fusion
.opencode/skills/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:322: * Intent classes aligned with adaptive-fusion.ts weight profiles.
.opencode/skills/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:351:  /** Pre-computed ranked lists for fusion (one per retrieval channel) */
.opencode/skills/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:610: * @param k - RRF smoothing constant to use for fusion
.opencode/skills/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts:45:      file_path: '/workspace/.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/019-sprint-9-extra-features/implementation-summary.md',
.opencode/skills/system-spec-kit/mcp_server/tests/hybrid-search-context-headers.vitest.ts:50:      ['022-hybrid-rag-fusion/019-sprint-9-extra-features', 'Description'],
.opencode/skills/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:7:import { fuseResultsMulti, SOURCE_TYPES } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skills/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:8:import type { RankedList, FusionResult } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skills/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:114:  describe('RRF fusion with 5 channels (flag enabled)', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:177:  describe('RRF fusion without degree (flag disabled) is identical to 4-channel', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/embedding-expansion.vitest.ts:149:      makeMockMemory(3, 'hybrid retrieval fusion recall semantic candidates'),
.opencode/skills/system-spec-kit/mcp_server/tests/embedding-expansion.vitest.ts:185:      makeMockMemory(1, 'semantic retrieval fusion candidates ranking scoring'),
.opencode/skills/system-spec-kit/mcp_server/tests/embedding-expansion.vitest.ts:366:      makeMockMemory(1, 'fusion retrieval ranking scoring candidates vectors similarity'),
.opencode/skills/system-spec-kit/mcp_server/handlers/eval-reporting.ts:44:import type { RankedList } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skills/system-spec-kit/mcp_server/handlers/eval-reporting.ts:332:  'hybrid search fusion',
.opencode/skills/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:113:  fusionMethod?: string;
.opencode/skills/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:219:        (eval_run_id, query_id, result_memory_ids, scores, fusion_method, latency_ms)
.opencode/skills/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:226:      params.fusionMethod ?? 'rrf',
.opencode/skills/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:151:      // Simulate post-fusion results with chunk metadata
.opencode/skills/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:197:  it('S4-INT-03: R1+N4 Interaction — MPAB operates on post-fusion scores not pre-boosted', withEnvVars(
.opencode/skills/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:200:      // MPAB takes scores as-is from the fusion pipeline (post-RRF, post-normalization)
.opencode/skills/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:201:      // It does NOT apply its own boosting to raw pre-fusion scores
.opencode/skills/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:202:      const fusionScores = [0.7, 0.3, 0.2]; // Simulated post-RRF fusion scores
.opencode/skills/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:203:      const mpabScore = computeMPAB(fusionScores);
.opencode/skills/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:246:        fusionMethod: 'rrf',
.opencode/skills/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:259:    it('T005-13: logFinalResult stores fusion_method correctly', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:261:      const { queryId, evalRunId } = logSearchQuery({ query: 'fusion-method-test' });
.opencode/skills/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:262:      logFinalResult({ evalRunId, queryId, fusionMethod: 'rrf' });
.opencode/skills/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:265:        'SELECT fusion_method FROM eval_final_results WHERE eval_run_id = ? AND query_id = ?'
.opencode/skills/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:266:      ).get(evalRunId, queryId) as { fusion_method: string };
.opencode/skills/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:269:      expect(row.fusion_method).toBe('rrf');
.opencode/skills/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:297:      logFinalResult({ evalRunId, queryId, fusionMethod: 'rrf' });
.opencode/skills/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:72:    addTraceEntry(trace, 'fusion', 30, 25, 8);
.opencode/skills/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:110:      'candidate', 'filter', 'fusion', 'rerank', 'fallback', 'final-rank',
.opencode/skills/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:146:      'embedding_timeout', 'bm25_only', 0.6, 'delayed', ['fusion']
.opencode/skills/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:189:      ['fusion', 'rerank', 'final-rank']
.opencode/skills/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:193:    expect(contract.degradedStages).toContain('fusion');
.opencode/skills/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:225:      'fusion',
.opencode/skills/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:56:  fusionLatencyMs: number;
.opencode/skills/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:188:      fusionLatencyMs: 0,
.opencode/skills/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:243:    t.latency.fusionLatencyMs +
.opencode/skills/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:657:      fusionLatencyMs: t.latency.fusionLatencyMs,
.opencode/skills/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:242:    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion.js');
.opencode/skills/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:270:    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion.js');
.opencode/skills/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:303:    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion.js');
.opencode/skills/system-spec-kit/mcp_server/lib/telemetry/trace-schema.ts:13:  'fusion',
.opencode/skills/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts:6:// Pipeline position: after RRF fusion, before state filtering.
.opencode/skills/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:30:    source: 'shared/algorithms/rrf-fusion.ts',
.opencode/skills/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:103: *   `recordNegativeFeedbackEvent`, and Stage 2 (`search/pipeline/stage2-fusion.ts`)
.opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:110:    const keywords = extractKeywords('Hybrid RAG fusion for memory retrieval');
.opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:113:    expect(keywords).toContain('fusion');
.opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:188:        description: 'Hybrid RAG fusion pipeline combining vector and keyword retrieval',
.opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:189:        keywords: ['hybrid', 'rag', 'fusion', 'pipeline', 'combining', 'vector', 'keyword', 'retrieval'],
.opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:211:    const results = findRelevantFolders('hybrid rag fusion vector', mockCache);
.opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:232:    const broadResults = findRelevantFolders('system memory vector fusion cache', mockCache);
.opencode/skills/system-spec-kit/mcp_server/tests/eval-db.vitest.ts:187:      expect(cols).toContain('fusion_method');
.opencode/skills/system-spec-kit/mcp_server/tests/eval-db.vitest.ts:242:        INSERT INTO eval_final_results (eval_run_id, query_id, fusion_method)
.opencode/skills/system-spec-kit/mcp_server/tests/eval-db.vitest.ts:313:    it('T004-24: fusion_method defaults to rrf in eval_final_results', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/eval-db.vitest.ts:321:        SELECT fusion_method FROM eval_final_results WHERE id = ?
.opencode/skills/system-spec-kit/mcp_server/tests/eval-db.vitest.ts:322:      `).get(insertResult.lastInsertRowid) as { fusion_method: string };
.opencode/skills/system-spec-kit/mcp_server/tests/eval-db.vitest.ts:324:      expect(row.fusion_method).toBe('rrf');
.opencode/skills/system-spec-kit/mcp_server/tests/mmr-reranker.vitest.ts:2:// Maximal Marginal Relevance for post-fusion diversity pruning.
.opencode/skills/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts:38:// Mock the RRF fusion so we can control its output.
.opencode/skills/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts:39:vi.mock('../../shared/algorithms/rrf-fusion', () => ({
.opencode/skills/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts:63:// Mock adaptive fusion using the current public export surface.
.opencode/skills/system-spec-kit/mcp_server/tests/pipeline-integration.vitest.ts:64:vi.mock('../../shared/algorithms/adaptive-fusion', () => ({
.opencode/skills/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:51:    spec_folder: 'specs/system-spec-kit/022-hybrid-rag-fusion',
.opencode/skills/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:245:  it('T7: adaptive fusion flag changes output characteristics', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:295:    const { getAdaptiveWeights, INTENT_WEIGHT_PROFILES } = await import('../../shared/algorithms/adaptive-fusion');
.opencode/skills/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:309:    const { getAdaptiveWeights, DEFAULT_WEIGHTS } = await import('../../shared/algorithms/adaptive-fusion');
.opencode/skills/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:322:    const { INTENT_WEIGHT_PROFILES } = await import('../../shared/algorithms/adaptive-fusion');
.opencode/skills/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:460:    const { hybridAdaptiveFuse } = await import('../../shared/algorithms/adaptive-fusion');
.opencode/skills/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:466:    // When flag is off, hybridAdaptiveFuse returns standard fusion results.
.opencode/skills/system-spec-kit/mcp_server/tests/graph-scoring-integration.vitest.ts:13:} from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skills/system-spec-kit/mcp_server/tests/rrf-fusion.vitest.ts:2:// Converted from: rrf-fusion.test.ts (custom runner)
.opencode/skills/system-spec-kit/mcp_server/tests/rrf-fusion.vitest.ts:15:} from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skills/system-spec-kit/mcp_server/tests/rrf-fusion.vitest.ts:29:  it('T021: RRF fusion with default k=40 parameter', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:18:  fusionMethod?: string;
.opencode/skills/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:32:vi.mock('../lib/search/pipeline/stage2-fusion', () => ({
.opencode/skills/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:181:    mockStage2.mockRejectedValue(new Error('RRF fusion NaN overflow'));
.opencode/skills/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:6:// System A: Channel fusion weights (adaptive-fusion.ts INTENT_WEIGHT_PROFILES)
.opencode/skills/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:18:} from '@spec-kit/shared/algorithms/adaptive-fusion';
.opencode/skills/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:19:import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skills/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:20:import type { RrfItem, FusionResult, RankedList } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skills/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:21:import type { FusionWeights } from '@spec-kit/shared/algorithms/adaptive-fusion';
.opencode/skills/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:146:  it('System A (adaptive fusion) uses channel weights, not attribute weights', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:188:  it('RRF fusion scores are RANK-based, not attribute-based (no overlap with System B)', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:265:  it('adaptive fusion preserves all input items (no data loss)', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:283:  it('adaptive fusion results are sorted by descending rrfScore', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:112:    expect(t.latency.fusionLatencyMs).toBe(0);
.opencode/skills/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:163:    recordLatency(t, 'fusionLatencyMs', 30);
.opencode/skills/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:168:    expect(t.latency.fusionLatencyMs).toBe(30);
.opencode/skills/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:183:    recordLatency(t, 'fusionLatencyMs', NaN);
.opencode/skills/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:184:    expect(t.latency.fusionLatencyMs).toBe(0);
.opencode/skills/system-spec-kit/mcp_server/tests/quality-gate-exception.vitest.ts:33:      specFolder: '022-hybrid-rag-fusion',
.opencode/skills/system-spec-kit/mcp_server/tests/quality-gate-exception.vitest.ts:40:      specFolder: '022-hybrid-rag-fusion',
.opencode/skills/system-spec-kit/mcp_server/tests/quality-gate-exception.vitest.ts:45:      specFolder: '022-hybrid-rag-fusion',
.opencode/skills/system-spec-kit/mcp_server/tests/quality-gate-exception.vitest.ts:79:      specFolder: '022-hybrid-rag-fusion',
.opencode/skills/system-spec-kit/mcp_server/tests/quality-gate-exception.vitest.ts:87:      specFolder: '022-hybrid-rag-fusion',
.opencode/skills/system-spec-kit/mcp_server/tests/quality-gate-exception.vitest.ts:100:      specFolder: '022-hybrid-rag-fusion',
.opencode/skills/system-spec-kit/mcp_server/tests/quality-gate-exception.vitest.ts:108:      specFolder: '022-hybrid-rag-fusion',
.opencode/skills/system-spec-kit/mcp_server/tests/quality-gate-exception.vitest.ts:140:      specFolder: '022-hybrid-rag-fusion',
.opencode/skills/system-spec-kit/mcp_server/tests/quality-gate-exception.vitest.ts:158:      specFolder: '022-hybrid-rag-fusion',
.opencode/skills/system-spec-kit/mcp_server/tests/quality-gate-exception.vitest.ts:169:      specFolder: '022-hybrid-rag-fusion',
.opencode/skills/system-spec-kit/mcp_server/tests/pipeline-architecture-remediation.vitest.ts:7:import { __testables as stage2Testables } from '../lib/search/pipeline/stage2-fusion';
.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:10:import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:11:import { adaptiveFuse, getAdaptiveWeights, isAdaptiveFusionEnabled } from '@spec-kit/shared/algorithms/adaptive-fusion';
.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:64:import type { FusionResult } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:92:  /** Classified query intent for adaptive fusion weight selection (e.g. 'understand', 'fix_bug'). */
.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:103:   * When true, stop after channel collection and return pre-fusion candidates.
.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:108:   * When true, return immediately after adaptive/RRF fusion so Stage 2/3 can
.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1000: * Enhanced hybrid search with RRF fusion.
.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1248:    // C138/T315: Build weighted fusion lists once from lightweight adaptive
.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1261:    const fusionWeights = adaptiveEnabled
.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1264:    const { semanticWeight, keywordWeight, graphWeight: adaptiveGraphWeight } = fusionWeights;
.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1269:    const fusionLists = lists
.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1282:      fusionLists.push({
.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1289:    const graphList = fusionLists.find((list) => list.source === 'graph');
.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1290:    const vectorList = fusionLists.find((list) => list.source === 'vector');
.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1291:    const passthroughLists = fusionLists.filter((list) => list.source !== 'graph' && list.source !== 'vector' && list.source !== 'keyword');
.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1296:        weights: typeof fusionWeights,
.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1304:        fusionWeights,
.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1310:      : fuseResultsMulti(fusionLists);
.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1358:  // -- Aggregation stage: MPAB chunk-to-memory aggregation (after fusion, before state filter) --
.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1400:  // In the top-k window. Prevents single-channel dominance in fusion output.
.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1733: * immediately after intra-query fusion and before downstream aggregation,
.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1810:  // P3-03 FIX: Use hybridSearchEnhanced (with RRF fusion) instead of
.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:198: * Channel minimum-representation promotion after fusion.
.opencode/skills/system-spec-kit/mcp_server/tests/memory-context-session-state.vitest.ts:127:      discoverSpecFolder: vi.fn(() => 'system-spec-kit/022-hybrid-rag-fusion/026-memory-database-refinement'),
.opencode/skills/system-spec-kit/mcp_server/tests/memory-context-session-state.vitest.ts:152:        specFolder: 'system-spec-kit/022-hybrid-rag-fusion/026-memory-database-refinement',
.opencode/skills/system-spec-kit/mcp_server/tests/memory-context-session-state.vitest.ts:158:          folder: 'system-spec-kit/022-hybrid-rag-fusion/026-memory-database-refinement',
.opencode/skills/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:46:This memory documents the Sprint 0 measurement foundation for the hybrid RAG fusion refinement project.
.opencode/skills/system-spec-kit/mcp_server/tests/quality-loop.vitest.ts:60:- Implement hybrid fusion scoring calibration
.opencode/skills/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:44:import * as rrfFusion from '@spec-kit/shared/algorithms/rrf-fusion.js';
.opencode/skills/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:53:const STAGE2_SOURCE = fs.readFileSync(path.join(SERVER_ROOT, 'lib', 'search', 'pipeline', 'stage2-fusion.ts'), 'utf-8');
.opencode/skills/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:246:    it('T635: Hybrid search uses fusion-based ranking', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:258:    it('T637: RRF fusion available for hybrid ranking', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:262:    it('T638: Deduplication handled in RRF fusion', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/calibrated-overlap-bonus.vitest.ts:12:} from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skills/system-spec-kit/mcp_server/tests/encoding-intent.vitest.ts:70:      'fusion scoring because it provides better result diversity.',
.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:227:          input: 'why did search ranking regress after the fusion change?',
.opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-4-stage-search-pipeline.vitest.ts:81:describe('Gate D regression 13 — 4-stage search pipeline / RRF fusion', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-4-stage-search-pipeline.vitest.ts:181:      query: 'show the Gate D reader-ready 4-stage search pipeline fusion contract',
.opencode/skills/system-spec-kit/mcp_server/tests/gate-d-regression-4-stage-search-pipeline.vitest.ts:224:      fusionMethod: 'rrf',
.opencode/skills/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:54:/** Runtime fusion weight for the degree channel. Keep aligned with the boost cap. */
.opencode/skills/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:315:      'The fusion layer combines scores from multiple channels.',
.opencode/skills/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:406:      'The fourth key insight about result fusion.',
.opencode/skills/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:147:      fusion: 0.68,
.opencode/skills/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:200:    expect(result.trace?.scoreResolution).toBe('fusion');
.opencode/skills/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:40:  /** N2a cap for RRF fusion overflow prevention. */
.opencode/skills/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:42:  /** N2b cap for RRF fusion overflow prevention. */
.opencode/skills/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:118:  /** Current N2a fusion score. */
.opencode/skills/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:120:  /** Current N2b fusion score. */
.opencode/skills/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:36:} from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skills/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:206:      // RRF fusion with normalization
.opencode/skills/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:249:      // RRF fusion works
.opencode/skills/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:572:    it('16. Full pipeline: query → classify → budget → fusion → score → truncate', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:656:    it('18. Channel representation promotes missing channels after RRF fusion', () => {
.opencode/skills/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:711:      const fusionResults: FusionResult[] = [
.opencode/skills/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:719:      const originalOrder = fusionResults.map(r => r.id);
.opencode/skills/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:721:      normalizeRrfScores(fusionResults);
.opencode/skills/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:724:      for (const r of fusionResults) {
.opencode/skills/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:730:      expect(fusionResults[0].rrfScore).toBe(1.0);
.opencode/skills/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:731:      expect(fusionResults[fusionResults.length - 1].rrfScore).toBeCloseTo(0, 4);
.opencode/skills/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:734:      const normalizedOrder = fusionResults.map(r => r.id);
.opencode/skills/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts:20:import { SOURCE_TYPES } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skills/system-spec-kit/mcp_server/lib/search/result-explainability.ts:8:// Stage 2 fusion. Two tiers:
.opencode/skills/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:7:  content: `Detailed result content ${index + 1} for fusion scoring decisions and retrieval context.`,
.opencode/skills/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:147:      query: 'Find fusion scoring decisions',
.opencode/skills/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:168:    expect(sessionState.activeGoal).toBe('Find fusion scoring decisions');
.opencode/skills/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:170:    expect(goalRefinement.activeGoal).toBe('Find fusion scoring decisions');
.opencode/skills/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:174:    const initial = await handleMemorySearch({ query: 'Find fusion scoring decisions' });
.opencode/skills/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:191:      query: 'Find fusion scoring decisions',
.opencode/skills/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts:22:// --- T002: RRF fusion ---
.opencode/skills/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts:26:} from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skills/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts:27:import type { RankedList } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skills/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:221:    'specs/022-hybrid-rag-fusion',
.opencode/skills/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:267:    'specs/022-hybrid-rag-fusion',
.opencode/skills/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:312:  `).run('hist-1', 1, null, 'Alpha Memory', 'ADD', now, 0, 'tester', 'specs/022-hybrid-rag-fusion');
.opencode/skills/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:325:  `).run(1, later, 'UPDATE', 'hash-beta', 2, 1, 0.82, 'seed conflict', 'beta preview', 'alpha preview', 0, null, 'specs/022-hybrid-rag-fusion', later);
.opencode/skills/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:358:  `).run(1, 'scope_check', 'allow', 1, 'specs/022-hybrid-rag-fusion::/tmp/specs/022/alpha.md::_', 'tenant-a', 'user-a', 'agent-a', 'sess-1', 'seed governance', '{"phase":"seed"}', later);
.opencode/skills/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:364:  `).run('sess-1', 'active', 'specs/022-hybrid-rag-fusion', 'checkpoint test', 'seed', 'summary', '[]', '{"phase":"seed"}', now, later);
.opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts:29:/** Channel names matching SOURCE_TYPES in rrf-fusion.ts */
.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:103:  /** RRF fusion score (0–1). */
.opencode/skills/system-spec-kit/mcp_server/lib/search/channel-representation.ts:64: * Analyse a post-fusion top-k result set and, when the feature flag is
.opencode/skills/system-spec-kit/mcp_server/lib/search/channel-representation.ts:77: * @param topK              - Ordered top-k results from RRF fusion.
.opencode/skills/system-spec-kit/mcp_server/lib/search/search-utils.ts:204:    fusionIntent: resolvedFusionIntent,
.opencode/skills/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:7:// Use inside the hybrid-search pipeline after RRF/RSF fusion.
.opencode/skills/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts:80: * @param fusedResults      - Post-fusion results, ordered by score descending.
.opencode/skills/system-spec-kit/mcp_server/lib/search/query-expander.ts:55:  fusion: ['merge', 'combine'],
.opencode/skills/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:62: * double-counting in the fusion pipeline.
.opencode/skills/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts:20:// Integration point: called at the end of Stage 2 fusion, after
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2b-enrichment.ts:4:// B4 DECOMPOSITION: Extracted from stage2-fusion.ts steps 8-9.
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:7:// This stage avoids downstream fusion/reranking, but may apply temporal
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:29://       optional temporal-contiguity boost applied before downstream fusion
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:533: * This stage does not apply Stage 2 fusion/reranking signals. Vector-channel
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:173: * Intent-aware weighting factors applied during fusion.
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:241: * Stage 2 output containing scored rows and fusion metadata.
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:357: * Executor signature for Stage 2 fusion and signal integration.
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:34:import { executeStage2 } from './stage2-fusion.js';
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:23:// 1a. Recency fusion          — time-decay bonus for recent memories
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:37:// Internally (RRF / RSF fusion). Post-search intent weighting is
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:81:import { getAdaptiveWeights, isAdaptiveFusionEnabled } from '@spec-kit/shared/algorithms/adaptive-fusion';
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:127:/** Recency fusion weight — controls how much recency score contributes to the fused score.
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:131:/** Recency fusion cap — maximum bonus a candidate can receive from recency fusion.
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:177:        `[stage2-fusion] SPECKIT_LEARNED_STAGE2_BLEND_WEIGHT=${raw} exceeds the ${MAX_LEARNED_BLEND_WEIGHT} guard; clamping. Promotion is a small guarded blend, not a flip.`
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:221:        console.warn(`[stage2-fusion] learned stage2 model at ${modelPath} is invalid; shadow scoring will use manual-only fallback`);
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:235:        console.warn(`[stage2-fusion] learned stage2 model load failed: ${message}`);
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:307:    // must not be overwritten with the fusion/ranking score.
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:320:    // must not be overwritten with the fusion/ranking score.
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:495:    console.warn(`[stage2-fusion] provenance edge fetch failed: ${message}`);
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:524:    console.warn(`[stage2-fusion] provenance community fetch failed (non-fatal): ${message}`);
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:613:    console.warn(`[stage2-fusion] strengthenOnAccess failed for id ${memoryId}: ${message}`);
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:625: * during fusion. Calling this on hybrid results would double-count intent.
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:768:    console.warn(`[stage2-fusion] learned trigger query failed: ${message}`);
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:780:      console.warn(`[stage2-fusion] negative feedback stats failed: ${message}`);
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:866:    console.warn(`[stage2-fusion] usage ranking failed: ${message}`);
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:911:      console.warn(`[stage2-fusion] applyTestingEffect failed for id ${row.id}: ${message}`);
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:947:    console.warn('[stage2-fusion] adaptive access signal write failed:', (err as Error)?.message ?? err);
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:962: *   1a. Recency fusion     (all types — time-decay bonus)
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1024:      console.warn(`[stage2-fusion] session boost failed: ${message}`);
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1029:  // -- 1a. Recency fusion --
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1035:    const fusionIntent = resolveFusionIntentContract({
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1040:    const adaptiveRecencyEnabled = Boolean(fusionIntent) && isAdaptiveFusionEnabled();
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1047:      const recencyWeight = adaptiveRecencyEnabled && fusionIntent
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1048:        ? getAdaptiveWeights(fusionIntent, resolveRowDocumentType(row)).recencyWeight
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1067:    console.warn(`[stage2-fusion] recency fusion failed: ${message}`);
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1089:      console.warn(`[stage2-fusion] causal boost failed: ${message}`);
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1133:      console.warn(`[stage2-fusion] co-activation spreading failed: ${message}`);
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1153:      console.warn(`[stage2-fusion] community boost failed: ${message}`);
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1209:      console.warn(`[stage2-fusion] graph signals failed: ${message}`);
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1220:      console.warn(`[stage2-fusion] usage ranking skipped (db unavailable): ${message}`);
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1231:    console.warn(`[stage2-fusion] graph evidence provenance failed: ${message}`);
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1245:      console.warn(`[stage2-fusion] testing effect skipped (db unavailable): ${message}`);
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1251:  // Hybrid search (RRF / RSF) incorporates intent weighting during fusion —
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1264:      console.warn(`[stage2-fusion] intent weights failed: ${message}`);
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1277:      console.warn(`[stage2-fusion] artifact routing failed: ${message}`);
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1293:    console.warn(`[stage2-fusion] feedback signals failed: ${message}`);
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1335:            `[stage2-fusion] shadow-learned id=${row.id} manual=${shadow.manualScore.toFixed(4)} learned=${shadow.learnedScore.toFixed(4)} delta=${shadow.delta.toFixed(4)}`
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1351:      console.warn(`[stage2-fusion] learned stage2 shadow scoring failed: ${message}`);
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1379:    console.warn(`[stage2-fusion] validation signal scoring failed: ${message}`);
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1402:        '[stage2-fusion] Graph channel active (bounded_runtime) but zero contribution — causal_edges table may be sparse or candidates lack graph connectivity'
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1411:      'fusion',
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:12:// MPAB MUST remain AFTER RRF fusion (Stage 2).
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:312: * @param results     - Pipeline rows from Stage 2 fusion.
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:529: * RRF fusion (Stage 2). It is intentionally placed in Stage 3.
.opencode/skills/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:8:// Spec: system-spec-kit/023-hybrid-rag-fusion-refinement/014-feedback-signal-pipeline

```