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

  it('caps synthetic high rescue scores at the normalization ceiling', () => {
    __testables.resetTelemetryCounters();

    const result = __testables.computeRescueLayerScore(1, 1.4);

    expect(result).toEqual({
      score: 1,
      wouldHaveBeenCapped: true,
    });
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
