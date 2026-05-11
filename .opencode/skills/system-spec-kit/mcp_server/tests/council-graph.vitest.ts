import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

type HandlerResponse = { content: Array<{ type: string; text: string }> };

type CouncilGraphModules = {
  closeDb: () => void;
  handleCouncilGraphUpsert: (args: Record<string, unknown>) => Promise<HandlerResponse>;
  handleCouncilGraphQuery: (args: Record<string, unknown>) => Promise<HandlerResponse>;
  handleCouncilGraphStatus: (args: Record<string, unknown>) => Promise<HandlerResponse>;
  handleCouncilGraphConvergence: (args: Record<string, unknown>) => Promise<HandlerResponse>;
};

const originalDbDir = process.env.SPEC_KIT_DB_DIR;
const tempDirs: string[] = [];
let activeCloseDb: (() => void) | null = null;

function parseResponse(response: HandlerResponse): Record<string, unknown> {
  return JSON.parse(response.content[0]?.text ?? '{}') as Record<string, unknown>;
}

async function loadCouncilGraphModules(): Promise<CouncilGraphModules> {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-council-graph-'));
  tempDirs.push(tempDir);
  process.env.SPEC_KIT_DB_DIR = tempDir;
  vi.resetModules();

  const dbModule = await import('../lib/council-graph/council-graph-db.js');
  const upsertModule = await import('../handlers/council-graph/upsert.js');
  const queryModule = await import('../handlers/council-graph/query.js');
  const statusModule = await import('../handlers/council-graph/status.js');
  const convergenceModule = await import('../handlers/council-graph/convergence.js');

  activeCloseDb = dbModule.closeDb;

  return {
    closeDb: dbModule.closeDb,
    handleCouncilGraphUpsert: upsertModule.handleCouncilGraphUpsert,
    handleCouncilGraphQuery: queryModule.handleCouncilGraphQuery,
    handleCouncilGraphStatus: statusModule.handleCouncilGraphStatus,
    handleCouncilGraphConvergence: convergenceModule.handleCouncilGraphConvergence,
  };
}

afterEach(() => {
  activeCloseDb?.();
  activeCloseDb = null;
  vi.resetModules();
  if (originalDbDir === undefined) {
    delete process.env.SPEC_KIT_DB_DIR;
  } else {
    process.env.SPEC_KIT_DB_DIR = originalDbDir;
  }

  while (tempDirs.length > 0) {
    const tempDir = tempDirs.pop();
    if (tempDir) fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

describe('dedicated council graph handlers', () => {
  it('upserts prompt-safe council graph data and queries unresolved disagreements and decision support', async () => {
    const {
      handleCouncilGraphUpsert,
      handleCouncilGraphQuery,
      handleCouncilGraphStatus,
      handleCouncilGraphConvergence,
    } = await loadCouncilGraphModules();
    const specFolder = 'specs/council-graph-live';
    const sessionId = 'council-session-1';

    const upsertResponse = parseResponse(await handleCouncilGraphUpsert({
      specFolder,
      sessionId,
      nodes: [
        { id: 'session', kind: 'SESSION', name: 'Council session', artifactPath: 'ai-council/ai-council-state.jsonl' },
        { id: 'seat-a', kind: 'SEAT', name: 'Analytical seat', roundId: 'round-001' },
        { id: 'claim-1', kind: 'CLAIM', name: 'Use dedicated graph' },
        { id: 'evidence-1', kind: 'EVIDENCE', name: 'Deep-loop graph is research/review only' },
        { id: 'disagreement-1', kind: 'DISAGREEMENT', name: 'Critical unresolved dissent', metadata: { severity: 'P1' } },
        { id: 'decision-1', kind: 'DECISION', name: 'Dedicated derived graph', metadata: { confidence: 0.8 } },
      ],
      edges: [
        { id: 'edge-seat', sourceId: 'seat-a', targetId: 'session', relation: 'PARTICIPATES_IN' },
        { id: 'edge-support', sourceId: 'claim-1', targetId: 'decision-1', relation: 'SUPPORTS' },
        { id: 'edge-evidence', sourceId: 'evidence-1', targetId: 'decision-1', relation: 'EVIDENCE_FOR' },
        { id: 'edge-dissent', sourceId: 'disagreement-1', targetId: 'decision-1', relation: 'CONTRADICTS' },
        { id: 'edge-self', sourceId: 'decision-1', targetId: 'decision-1', relation: 'SUPPORTS' },
      ],
    }));

    expect(upsertResponse.status).toBe('ok');
    expect((upsertResponse.data as Record<string, unknown>).insertedNodes).toBe(6);
    expect((upsertResponse.data as Record<string, unknown>).insertedEdges).toBe(4);
    expect((upsertResponse.data as Record<string, unknown>).rejectedSelfLoops).toEqual(['edge-self']);

    const unresolvedResponse = parseResponse(await handleCouncilGraphQuery({
      specFolder,
      sessionId,
      queryType: 'unresolved_disagreements',
    }));
    const unresolvedData = unresolvedResponse.data as Record<string, unknown>;
    expect(unresolvedResponse.status).toBe('ok');
    expect(unresolvedData.totalUnresolved).toBe(1);
    expect(unresolvedData.sourceOfTruth).toBe('derived_from_ai_council_artifacts');

    const supportResponse = parseResponse(await handleCouncilGraphQuery({
      specFolder,
      sessionId,
      queryType: 'decision_support',
      nodeId: 'decision-1',
    }));
    const support = ((supportResponse.data as Record<string, unknown>).support as Array<Record<string, unknown>>)[0];
    expect(support.supportCount).toBe(1);
    expect(support.evidenceCount).toBe(1);

    const chainResponse = parseResponse(await handleCouncilGraphQuery({
      specFolder,
      sessionId,
      queryType: 'evidence_chain',
      nodeId: 'decision-1',
    }));
    const chain = (chainResponse.data as Record<string, unknown>).chain as Array<Record<string, unknown>>;
    expect(chain.map((step) => (step.node as Record<string, unknown>).id)).toEqual(
      expect.arrayContaining(['decision-1', 'claim-1', 'evidence-1']),
    );

    const statusResponse = parseResponse(await handleCouncilGraphStatus({ specFolder, sessionId }));
    const statusData = statusResponse.data as Record<string, unknown>;
    expect(statusData.readiness).toBe('ready');
    expect(statusData.nodesByKind).toMatchObject({ DECISION: 1, DISAGREEMENT: 1, EVIDENCE: 1 });

    const convergenceResponse = parseResponse(await handleCouncilGraphConvergence({ specFolder, sessionId }));
    const convergenceData = convergenceResponse.data as Record<string, unknown>;
    expect(convergenceData.decision).toBe('STOP_BLOCKED');
    expect(convergenceData.reason).toContain('blocking');
  });

  it('treats empty upsert as an explicit no-op success', async () => {
    const { handleCouncilGraphUpsert, handleCouncilGraphStatus } = await loadCouncilGraphModules();
    const specFolder = 'specs/council-graph-empty-upsert';
    const sessionId = 'empty-upsert-session';

    const upsertResponse = parseResponse(await handleCouncilGraphUpsert({ specFolder, sessionId }));
    const upsertData = upsertResponse.data as Record<string, unknown>;
    expect(upsertResponse.status).toBe('ok');
    expect(upsertData.noOp).toBe(true);
    expect(upsertData.insertedNodes).toBe(0);
    expect(upsertData.insertedEdges).toBe(0);

    const statusResponse = parseResponse(await handleCouncilGraphStatus({ specFolder, sessionId }));
    const statusData = statusResponse.data as Record<string, unknown>;
    expect(statusData.totalNodes).toBe(0);
    expect(statusData.readiness).toBe('empty');
  });

  it('allows convergence when agreement, evidence, confidence, and blockers meet thresholds', async () => {
    const { handleCouncilGraphUpsert, handleCouncilGraphConvergence } = await loadCouncilGraphModules();
    const specFolder = 'specs/council-graph-live';
    const sessionId = 'council-session-2';

    await handleCouncilGraphUpsert({
      specFolder,
      sessionId,
      nodes: [
        { id: 'seat-a', kind: 'SEAT', name: 'Analytical seat' },
        { id: 'seat-b', kind: 'SEAT', name: 'Critical seat' },
        { id: 'claim-1', kind: 'CLAIM', name: 'Graph is dedicated' },
        { id: 'evidence-1', kind: 'EVIDENCE', name: 'Artifact contract is stable' },
        { id: 'decision-1', kind: 'DECISION', name: 'Implement council graph', metadata: { confidence: 0.82 } },
        { id: 'recommendation-1', kind: 'RECOMMENDATION', name: 'Keep graph derived', metadata: { confidence: 0.88 } },
      ],
      edges: [
        { id: 'agree-a', sourceId: 'seat-a', targetId: 'decision-1', relation: 'AGREES_WITH' },
        { id: 'agree-b', sourceId: 'seat-b', targetId: 'decision-1', relation: 'AGREES_WITH' },
        { id: 'support-1', sourceId: 'claim-1', targetId: 'decision-1', relation: 'SUPPORTS' },
        { id: 'evidence-1', sourceId: 'evidence-1', targetId: 'decision-1', relation: 'EVIDENCE_FOR' },
        { id: 'recommends-1', sourceId: 'decision-1', targetId: 'recommendation-1', relation: 'RECOMMENDS' },
      ],
    });

    const response = parseResponse(await handleCouncilGraphConvergence({
      specFolder,
      sessionId,
      roundId: 'round-001',
      persistSnapshot: true,
    }));
    const data = response.data as Record<string, unknown>;
    const signals = data.signals as Record<string, unknown>;
    expect(response.status).toBe('ok');
    expect(data.decision).toBe('STOP_ALLOWED');
    expect(data.snapshotPersistence).toBe('persisted');
    expect(signals.agreementRatio).toBe(1);
    expect(signals.unresolvedCriticalDisagreements).toBe(0);
  });

  it('continues convergence when non-blocking thresholds are not met', async () => {
    const { handleCouncilGraphUpsert, handleCouncilGraphConvergence } = await loadCouncilGraphModules();
    const specFolder = 'specs/council-graph-live';
    const sessionId = 'council-session-continue';

    await handleCouncilGraphUpsert({
      specFolder,
      sessionId,
      nodes: [
        { id: 'claim-1', kind: 'CLAIM', name: 'Graph is useful' },
        { id: 'decision-1', kind: 'DECISION', name: 'Continue council graph', metadata: { confidence: 0.82 } },
      ],
      edges: [
        { id: 'support-1', sourceId: 'claim-1', targetId: 'decision-1', relation: 'SUPPORTS' },
      ],
    });

    const response = parseResponse(await handleCouncilGraphConvergence({ specFolder, sessionId }));
    const data = response.data as Record<string, unknown>;
    expect(response.status).toBe('ok');
    expect(data.decision).toBe('CONTINUE');
    expect(data.reason).toContain('failing signals');
  });

  it('redacts arbitrary metadata from prompt-safe query output', async () => {
    const { handleCouncilGraphUpsert, handleCouncilGraphQuery } = await loadCouncilGraphModules();
    const specFolder = 'specs/council-graph-metadata';
    const sessionId = 'metadata-session';
    const longStatus = 'x'.repeat(120);

    await handleCouncilGraphUpsert({
      specFolder,
      sessionId,
      nodes: [
        {
          id: 'decision-1',
          kind: 'DECISION',
          name: 'Metadata safety decision',
          metadata: {
            confidence: 0.91,
            status: longStatus,
            secretToken: 'should-not-surface',
            nested: { raw: 'artifact text' },
          },
        },
      ],
    });

    const response = parseResponse(await handleCouncilGraphQuery({
      specFolder,
      sessionId,
      queryType: 'decision_support',
      nodeId: 'decision-1',
    }));
    const support = ((response.data as Record<string, unknown>).support as Array<Record<string, unknown>>)[0];
    const node = support.node as Record<string, unknown>;
    const metadata = node.metadata as Record<string, unknown>;
    expect(metadata.confidence).toBe(0.91);
    expect(String(metadata.status).length).toBeLessThanOrEqual(83);
    expect(metadata.secretToken).toBeUndefined();
    expect(metadata.nested).toBeUndefined();
    expect(JSON.stringify(node)).not.toContain('should-not-surface');
    expect(JSON.stringify(node)).not.toContain('artifact text');
  });

  it('blocks convergence for empty derived graphs instead of returning false-safe success', async () => {
    const { handleCouncilGraphStatus, handleCouncilGraphConvergence } = await loadCouncilGraphModules();
    const specFolder = 'specs/council-graph-empty';
    const sessionId = 'empty-session';

    const statusResponse = parseResponse(await handleCouncilGraphStatus({ specFolder, sessionId }));
    const statusData = statusResponse.data as Record<string, unknown>;
    expect(statusData.readiness).toBe('empty');
    expect(statusData.signals).toBeNull();
    expect((statusData.recovery as Record<string, unknown>).mode).toBe('derived_replay');

    const convergenceResponse = parseResponse(await handleCouncilGraphConvergence({ specFolder, sessionId }));
    const convergenceData = convergenceResponse.data as Record<string, unknown>;
    expect(convergenceData.decision).toBe('STOP_BLOCKED');
    expect(convergenceData.readiness).toBe('empty');
  });
});
