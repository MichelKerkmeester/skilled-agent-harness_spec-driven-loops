import { describe, expect, it, vi } from 'vitest';

const orchestrationMocks = vi.hoisted(() => ({
  evaluateMemory: vi.fn(),
  findSimilarMemories: vi.fn(),
  reinforceExistingMemory: vi.fn(),
  updateExistingMemory: vi.fn(),
  logPeDecision: vi.fn(),
  getMemoryHashSnapshot: vi.fn(() => ({ content_hash: 'prior-hash' })),
  appendMutationLedgerSafe: vi.fn(() => true),
}));

vi.mock('../lib/cognitive/prediction-error-gate.js', () => ({
  ACTION: {
    CREATE: 'CREATE',
    REINFORCE: 'REINFORCE',
    SUPERSEDE: 'SUPERSEDE',
    UPDATE: 'UPDATE',
    CREATE_LINKED: 'CREATE_LINKED',
  },
  evaluateMemory: orchestrationMocks.evaluateMemory,
}));

vi.mock('../handlers/pe-gating.js', () => ({
  findSimilarMemories: orchestrationMocks.findSimilarMemories,
  reinforceExistingMemory: orchestrationMocks.reinforceExistingMemory,
  updateExistingMemory: orchestrationMocks.updateExistingMemory,
  logPeDecision: orchestrationMocks.logPeDecision,
}));

vi.mock('../handlers/memory-crud-utils.js', () => ({
  getMemoryHashSnapshot: orchestrationMocks.getMemoryHashSnapshot,
  appendMutationLedgerSafe: orchestrationMocks.appendMutationLedgerSafe,
}));

import { evaluateAndApplyPeDecision } from '../handlers/save/pe-orchestration.js';

function parsedMemory() {
  return {
    specFolder: 'system-spec-kit/provenance-fixture',
    filePath: '/workspace/provenance/spec.md',
    title: 'Automated save',
    triggerPhrases: ['automated provenance'],
    content: 'Automated caller content.',
    contentHash: 'hash-next',
    contextType: 'spec',
    importanceTier: 'important',
  };
}

function candidate() {
  return {
    id: 101,
    similarity: 0.95,
    content: 'Automated caller content.',
    stability: 2,
    difficulty: 3,
    file_path: '/workspace/provenance/spec.md',
    canonical_file_path: '/workspace/provenance/spec.md',
  };
}

describe('PE orchestration provenance threading', () => {
  it('passes caller provenance to update mutations', () => {
    const provenance = { provenanceSource: 'agent-save', provenanceActor: 'opencode-agent', tool: 'memory_save' };
    orchestrationMocks.findSimilarMemories.mockReturnValue([candidate()]);
    orchestrationMocks.evaluateMemory.mockReturnValue({
      action: 'UPDATE',
      existingMemoryId: 101,
      similarity: 0.91,
      reason: 'compatible high-similarity content',
    });
    orchestrationMocks.updateExistingMemory.mockReturnValue({
      status: 'updated',
      id: 202,
      specFolder: 'system-spec-kit/provenance-fixture',
      title: 'Automated save',
    });

    const result = evaluateAndApplyPeDecision(
      {} as any,
      parsedMemory() as any,
      new Float32Array([0.2, 0.8]),
      false,
      [],
      'success',
      '/workspace/provenance/spec.md',
      {},
      provenance,
    );

    expect(result.earlyReturn?.status).toBe('updated');
    expect(orchestrationMocks.updateExistingMemory).toHaveBeenCalledWith(
      101,
      expect.any(Object),
      expect.any(Float32Array),
      {},
      provenance,
    );
  });

  it('passes caller provenance to reinforce mutations', () => {
    const provenance = { provenanceSource: 'system-scheduler', provenanceActor: 'daemon-scheduler', tool: 'memory_save' };
    orchestrationMocks.findSimilarMemories.mockReturnValue([candidate()]);
    orchestrationMocks.evaluateMemory.mockReturnValue({
      action: 'REINFORCE',
      existingMemoryId: 101,
      similarity: 0.97,
      reason: 'duplicate content',
    });
    orchestrationMocks.reinforceExistingMemory.mockReturnValue({
      status: 'reinforced',
      id: 101,
      specFolder: 'system-spec-kit/provenance-fixture',
      title: 'Automated save',
    });

    const result = evaluateAndApplyPeDecision(
      {} as any,
      parsedMemory() as any,
      new Float32Array([0.2, 0.8]),
      false,
      [],
      'success',
      '/workspace/provenance/spec.md',
      {},
      provenance,
    );

    expect(result.earlyReturn?.status).toBe('reinforced');
    expect(orchestrationMocks.reinforceExistingMemory).toHaveBeenCalledWith(
      101,
      expect.any(Object),
      provenance,
    );
  });
});
