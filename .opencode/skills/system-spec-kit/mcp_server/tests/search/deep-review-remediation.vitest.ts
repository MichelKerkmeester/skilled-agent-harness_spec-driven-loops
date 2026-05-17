import { describe, expect, it } from 'vitest';

import {
  applyRetrievalRescueLayer,
  __testables,
} from '../../lib/search/rerank/retrieval-rescue.js';
import type { PipelineRow } from '../../lib/search/pipeline/types.js';

describe('deep-review retrieval rescue remediation', () => {
  it('boosts decision_record rows when artifactClass asks for decisions', () => {
    const row: PipelineRow = {
      id: 1,
      title: 'ADR',
      file_path: '/repo/adr.md',
      spec_folder: 'specs/001-example',
      document_type: 'decision_record',
      content: 'Rationale.',
    };

    const withoutArtifact = __testables.lexicalScore('roadmap', row);
    const withArtifact = __testables.lexicalScore('roadmap', row, 'decision');

    expect(withArtifact.score).toBeGreaterThan(withoutArtifact.score);
    expect(withArtifact.signals).toContain('doc:0.24');
  });

  it('clamps synthetic over-ceiling rescue scores at the defense-in-depth cap', () => {
    __testables.resetTelemetryCounters();

    // Defense-in-depth: cap clamps the formula even when rescueScore exceeds
    // the [0,1] bound it normally has. With rescueScore = 1.4, uncapped =
    // 1 * 0.03 + 1.4 * 0.78 = 1.122 → clamped to 1.0 by RESCUE_SCORE_CAP.
    const result = __testables.computeRescueLayerScore(1, 1.4);

    expect(result).toBe(1);
  });

  it('records rescue hit-rate telemetry when rescue changes top-k ordering', () => {
    __testables.resetTelemetryCounters();
    const rows: PipelineRow[] = [
      {
        id: 1,
        title: 'Generic result',
        file_path: '/repo/spec.md',
        spec_folder: 'specs/001-generic',
        document_type: 'spec',
        content: 'Generic content.',
        score: 0.8,
      },
      {
        id: 2,
        title: 'Deep review decision',
        file_path: '/repo/decision-record.md',
        spec_folder: 'specs/002-review',
        document_type: 'decision_record',
        content: 'P0 remediation rescue cap rationale ADR-013 decision.',
        trigger_phrases: '["P0 remediation rescue cap ADR-013"]',
        score: 0.05,
      },
    ];

    const ranked = applyRetrievalRescueLayer('P0 remediation rescue cap ADR-013', rows, {
      artifactClass: 'decision',
    });

    expect(ranked[0]?.id).toBe(2);
    expect(__testables.telemetryCounters.rescueRuns).toBe(1);
    expect(__testables.telemetryCounters.rescueTopKHits).toBeGreaterThan(0);
  });
});
