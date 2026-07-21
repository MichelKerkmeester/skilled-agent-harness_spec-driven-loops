// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Open Design Grounding And Reconciliation Tests                           ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ALIGNED_RECONCILIATION_FIXTURE,
  AWAITING_INPUT_RECONCILIATION_FIXTURE,
  DIVERGED_RECONCILIATION_FIXTURE,
  LIVE_BRIEF_FIXTURE,
  POSITIVE_RECEIPT_FIXTURE,
  RECEIPT_HYDRATED_PROOFS,
  RECEIPT_FIXTURES,
  RECONCILIATION_FIXTURES,
  STALE_RECEIPT_FIXTURE,
  UNAVAILABLE_RECEIPT_FIXTURE,
} from '../fixtures/offline-fixtures.mjs';
import {
  digestMetadata,
  validateGroundingReceipt,
  validateReceiptForLive,
} from '../grounding-receipt.mjs';
import {
  checkLiveCapability,
  executeLiveRead,
  executeLiveRun,
} from '../live-transport.mjs';
import {
  assertOfflineContractGate,
  runOfflineContractGate,
} from '../offline-gate.mjs';
import {
  MAX_RETURN_ARTIFACTS,
  reconcileTransportReturn,
  validateReconciliationRecord,
  validateReturnEvidence,
} from '../return-reconciliation.mjs';
import {
  POSITIVE_FIXTURE as SHARED_POSITIVE_FIXTURE,
} from '../../shared/corpus-context/__tests__/fixtures.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. TEST HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function liveReadReceipt(receiptId = 'receipt-live-read') {
  const receipt = structuredClone(POSITIVE_RECEIPT_FIXTURE);
  receipt.receiptId = receiptId;
  receipt.operation = { kind: 'design-bearing-read', tool: 'get_file' };
  receipt.target.resourceId = 'index.html';
  return receipt;
}

function liveReadInputs(contentHash, receiptId = 'receipt-live-read') {
  const receipt = liveReadReceipt(receiptId);
  const proposal = structuredClone(ALIGNED_RECONCILIATION_FIXTURE.proposal);
  proposal.influences[0].expectedArtifact.hash = contentHash;
  receipt.influence.proposalDigest = digestMetadata(proposal);
  return {
    receipt,
    proposal,
    hydratedProof: structuredClone(RECEIPT_HYDRATED_PROOFS['receipt-positive']),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CLOSED RECEIPTS
// ─────────────────────────────────────────────────────────────────────────────

for (const receipt of RECEIPT_FIXTURES) {
  test(`${receipt.receiptId} is valid closed metadata without a daemon`, () => {
    assert.deepEqual(
      validateGroundingReceipt(receipt, RECEIPT_HYDRATED_PROOFS[receipt.receiptId]),
      { valid: true, errors: [] },
    );
  });
}

test('the canonical shared proof contract validates without a flattened adapter fork', () => {
  const receipt = structuredClone(POSITIVE_RECEIPT_FIXTURE);
  receipt.corpusContext = structuredClone(SHARED_POSITIVE_FIXTURE);
  receipt.skDesignGate.proofDigest = digestMetadata(SHARED_POSITIVE_FIXTURE.proofHandoff);

  assert.deepEqual(
    validateGroundingReceipt(receipt, SHARED_POSITIVE_FIXTURE.proofHandoff),
    { valid: true, errors: [] },
  );
});

test('an unavailable canonical receipt validates as closed offline evidence', () => {
  assert.deepEqual(
    validateGroundingReceipt(
      UNAVAILABLE_RECEIPT_FIXTURE,
      RECEIPT_HYDRATED_PROOFS['receipt-unavailable'],
    ),
    { valid: true, errors: [] },
  );
});

test('stale evidence remains valid offline but cannot authorize a live call', () => {
  const hydratedProof = RECEIPT_HYDRATED_PROOFS['receipt-stale'];
  assert.equal(validateGroundingReceipt(STALE_RECEIPT_FIXTURE, hydratedProof).valid, true);
  const liveValidation = validateReceiptForLive(STALE_RECEIPT_FIXTURE, hydratedProof);

  assert.equal(liveValidation.valid, false);
  assert.ok(
    liveValidation.errors.includes(
      'hydratedProof.generationIdentity.state:current-required-for-live',
    ),
  );
});

test('closed receipt rejects raw cache fields without content sniffing', () => {
  const openDesignPayload = structuredClone(POSITIVE_RECEIPT_FIXTURE);
  openDesignPayload.cachedOpenDesignPayload = { html: '<html>cached output</html>' };
  const corpusPayload = structuredClone(POSITIVE_RECEIPT_FIXTURE);
  corpusPayload.rawCorpusPayload = { tokensCss: '.primary { color: red; }' };

  assert.ok(
    validateGroundingReceipt(
      openDesignPayload,
      RECEIPT_HYDRATED_PROOFS['receipt-positive'],
    ).errors.includes(
      'receipt.cachedOpenDesignPayload:unexpected',
    ),
  );
  assert.ok(
    validateGroundingReceipt(
      corpusPayload,
      RECEIPT_HYDRATED_PROOFS['receipt-positive'],
    ).errors.includes(
      'receipt.rawCorpusPayload:unexpected',
    ),
  );
});

test('canonical proof objects remain closed without payload content sniffing', () => {
  const receipt = structuredClone(POSITIVE_RECEIPT_FIXTURE);
  receipt.corpusContext.proofHandoff.sourceIdentity.rawPayload = '<html>forbidden</html>';
  const hydratedProof = structuredClone(RECEIPT_HYDRATED_PROOFS['receipt-positive']);
  hydratedProof.sourceIdentity.rawPayload = '<html>forbidden</html>';
  receipt.skDesignGate.proofDigest = digestMetadata(hydratedProof);

  const validation = validateGroundingReceipt(receipt, hydratedProof);
  assert.equal(validation.valid, false);
  assert.ok(validation.errors.some((error) => error.includes('rawPayload:unexpected')));
});

test('removing any receipt authority field invalidates the receipt', () => {
  for (const field of Object.keys(POSITIVE_RECEIPT_FIXTURE.authority)) {
    const receipt = structuredClone(POSITIVE_RECEIPT_FIXTURE);
    delete receipt.authority[field];
    assert.equal(
      validateGroundingReceipt(
        receipt,
        RECEIPT_HYDRATED_PROOFS['receipt-positive'],
      ).valid,
      false,
      `authority.${field}`,
    );
  }
});

test('proof digest and receipt proof must match the separately hydrated source record', () => {
  const fabricated = structuredClone(POSITIVE_RECEIPT_FIXTURE);
  fabricated.corpusContext.proofHandoff.sourceIdentity.sourceId = 'fabricated-source';
  fabricated.corpusContext.proofHandoff.sourceIdentity.contentHash = `sha256:${'f'.repeat(64)}`;
  fabricated.skDesignGate.proofDigest = digestMetadata(fabricated.corpusContext.proofHandoff);

  const validation = validateGroundingReceipt(
    fabricated,
    RECEIPT_HYDRATED_PROOFS['receipt-positive'],
  );
  assert.equal(validation.valid, false);
  assert.ok(validation.errors.includes(
    'receipt.corpusContext.proofHandoff:not-bound-to-hydrated-proof',
  ));
  assert.ok(validation.errors.includes(
    'receipt.skDesignGate.proofDigest:not-bound-to-hydrated-proof',
  ));
});

test('positive outcome rejects structurally contradictory canonical evidence', () => {
  const mutations = [
    (proof) => { proof.provenanceUseLabel.status = 'unavailable'; },
    (proof) => { proof.provenanceUseLabel.rightsKnown = false; },
    (proof) => { proof.semanticRole = { role: 'none', dimensions: [] }; },
    (proof) => { proof.transformation.state = 'not-applicable'; },
  ];

  for (const mutate of mutations) {
    const receipt = structuredClone(POSITIVE_RECEIPT_FIXTURE);
    const hydratedProof = structuredClone(RECEIPT_HYDRATED_PROOFS['receipt-positive']);
    mutate(receipt.corpusContext.proofHandoff);
    mutate(hydratedProof);
    receipt.skDesignGate.proofDigest = digestMetadata(hydratedProof);
    assert.equal(validateGroundingReceipt(receipt, hydratedProof).valid, false);
  }
});

test('the proposal digest is mandatory and bound to the proposal snapshot', () => {
  const missingDigest = structuredClone(POSITIVE_RECEIPT_FIXTURE);
  delete missingDigest.influence.proposalDigest;
  assert.equal(
    validateGroundingReceipt(
      missingDigest,
      RECEIPT_HYDRATED_PROOFS['receipt-positive'],
    ).valid,
    false,
  );

  assert.equal(
    POSITIVE_RECEIPT_FIXTURE.influence.proposalDigest,
    digestMetadata(ALIGNED_RECONCILIATION_FIXTURE.proposal),
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. RETURN RECONCILIATION
// ─────────────────────────────────────────────────────────────────────────────

for (const fixture of RECONCILIATION_FIXTURES) {
  test(`${fixture.name} produces its mandatory reconciliation outcome`, () => {
    const record = reconcileTransportReturn(fixture);

    assert.equal(record.outcome, fixture.expectedOutcome);
    assert.deepEqual(validateReconciliationRecord(record), { valid: true, errors: [] });
  });
}

test('proposed-versus-returned divergence is surfaced, never silently accepted', () => {
  const record = reconcileTransportReturn(DIVERGED_RECONCILIATION_FIXTURE);

  assert.equal(record.outcome, 'diverged');
  assert.deepEqual(record.divergences, [
    {
      kind: 'classification-mismatch',
      influenceId: 'primary-layout-relationship',
      proposed: 'apply',
      returned: 'rejected',
    },
  ]);
  assert.equal(record.authority.acceptanceState, 'pending-mode-decision');
});

test('forged aligned semantics are rejected after recomputation', () => {
  const forged = structuredClone(reconcileTransportReturn(DIVERGED_RECONCILIATION_FIXTURE));
  forged.outcome = 'aligned';
  forged.divergences = [];
  const validation = validateReconciliationRecord(forged);

  assert.equal(validation.valid, false);
  assert.ok(validation.errors.includes('reconciliation.outcome:semantic-mismatch'));
  assert.ok(validation.errors.includes('reconciliation.divergences:semantic-mismatch'));
});

test('duplicate influence evidence is rejected instead of last-write-wins', () => {
  const duplicateEvidence = structuredClone(ALIGNED_RECONCILIATION_FIXTURE);
  duplicateEvidence.modeEvidence = [
    { ...duplicateEvidence.modeEvidence[0], classification: 'rejected' },
    { ...duplicateEvidence.modeEvidence[0], classification: 'applied' },
  ];

  assert.throws(
    () => reconcileTransportReturn(duplicateEvidence),
    /duplicate-influence/,
  );
});

test('classification evidence must bind to a returned artifact hash', () => {
  const unboundEvidence = structuredClone(ALIGNED_RECONCILIATION_FIXTURE);
  unboundEvidence.modeEvidence[0].artifactHash = `sha256:${'f'.repeat(64)}`;

  assert.throws(
    () => reconcileTransportReturn(unboundEvidence),
    /not-bound-to-return-artifact/,
  );
});

test('an echoed hash with a divergent returned path cannot reconcile as aligned', () => {
  const divergentPath = structuredClone(ALIGNED_RECONCILIATION_FIXTURE);
  divergentPath.returnEvidence.entryFile = 'attacker.html';
  divergentPath.returnEvidence.artifacts[0].path = 'attacker.html';
  divergentPath.modeEvidence[0].artifactPath = 'attacker.html';

  const record = reconcileTransportReturn(divergentPath);
  assert.equal(record.outcome, 'diverged');
  assert.ok(record.divergences.some((item) => item.kind === 'artifact-mismatch'));
});

test('return evidence rejects raw payload fields and payloads in allowed strings', () => {
  const rawField = structuredClone(ALIGNED_RECONCILIATION_FIXTURE.returnEvidence);
  rawField.rawPayload = '<html>cached</html>';
  assert.equal(validateReturnEvidence(rawField).valid, false);

  const allowedField = structuredClone(ALIGNED_RECONCILIATION_FIXTURE.returnEvidence);
  allowedField.entryFile = '<style>.primary { color: red; }</style>';
  assert.equal(validateReturnEvidence(allowedField).valid, false);

  const encodedUrlPayload = structuredClone(ALIGNED_RECONCILIATION_FIXTURE.returnEvidence);
  encodedUrlPayload.previewUrl = 'http://127.0.0.1:7456/%3Cstyle%3Epayload%3C/style%3E';
  assert.equal(validateReturnEvidence(encodedUrlPayload).valid, false);
});

test('artifact metadata count and aggregate size close chunked payload escapes', () => {
  const tooMany = structuredClone(ALIGNED_RECONCILIATION_FIXTURE.returnEvidence);
  tooMany.artifacts = Array.from({ length: MAX_RETURN_ARTIFACTS + 1 }, (_, index) => ({
    path: `payload-chunk-${index}-${'a'.repeat(180)}`,
    hash: digestMetadata({ index }),
  }));
  const validation = validateReturnEvidence(tooMany);

  assert.equal(validation.valid, false);
  assert.ok(validation.errors.includes('returnEvidence.artifacts:count-limit-exceeded'));
});

test('awaiting_input with zero files still carries return evidence and reconciliation', () => {
  const record = reconcileTransportReturn(AWAITING_INPUT_RECONCILIATION_FIXTURE);

  assert.equal(record.returnEvidence.status, 'awaiting_input');
  assert.equal(record.returnEvidence.artifacts.length, 0);
  assert.equal(record.returnEvidence.entryFile, null);
  assert.equal(record.returnEvidence.previewUrl, null);
  assert.equal(record.outcome, 'awaiting-input');
  assert.ok(
    record.divergences.some((item) => item.kind === 'return-incomplete-awaiting-input'),
  );

  const missingEvidence = structuredClone(record);
  delete missingEvidence.returnEvidence;
  assert.equal(validateReconciliationRecord(missingEvidence).valid, false);
});

test('the transport cannot gain authority or omit an authority field', () => {
  const record = reconcileTransportReturn(ALIGNED_RECONCILIATION_FIXTURE);
  assert.equal(record.authority.transportAuthoritative, false);
  assert.equal(record.authority.decisionOwner, 'paired-mode');
  assert.throws(() => {
    record.authority.transportAuthoritative = true;
  }, TypeError);

  const forged = structuredClone(record);
  forged.authority.transportAuthoritative = true;
  assert.ok(
    validateReconciliationRecord(forged).errors.includes(
      'reconciliation.authority.transportAuthoritative:fixed-value-required',
    ),
  );

  const missing = structuredClone(record);
  delete missing.authority.decisionOwner;
  assert.equal(validateReconciliationRecord(missing).valid, false);
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. OFFLINE AND LIVE GATES
// ─────────────────────────────────────────────────────────────────────────────

test('the complete offline contract gate passes before live plumbing', () => {
  const gate = runOfflineContractGate();

  assert.deepEqual(gate, {
    status: 'passed',
    receiptFixturesPassed: 5,
    reconciliationFixturesPassed: 3,
    noCacheFalsifierPassed: true,
    authorityFalsifierPassed: true,
    closedFieldFalsifierPassed: true,
    semanticFalsifierPassed: true,
    evidenceIntegrityFalsifierPassed: true,
  });
  assert.doesNotThrow(() => assertOfflineContractGate(gate));
  assert.throws(
    () => assertOfflineContractGate(structuredClone(gate)),
    /fresh in-process offline contract gate/,
  );
});

test('the live capability check fails closed when the daemon adapter is unavailable', async () => {
  const capability = await checkLiveCapability(
    { listTools: async () => { throw new Error('socket unavailable'); } },
    ['start_run'],
  );

  assert.equal(capability.available, false);
  assert.equal(capability.reasonCode, 'daemon-unavailable');
});

test('daemon outage returns a validated immutable unavailable reconciliation', async () => {
  const offlineGate = runOfflineContractGate();
  const { receipt, proposal, hydratedProof } = liveReadInputs(digestMetadata('expected'));
  let calls = 0;

  const result = await executeLiveRead({
    offlineGate,
    receipt,
    hydratedProof,
    proposal,
    client: {
      listTools: async () => { throw new Error('socket unavailable'); },
      callTool: async () => { calls += 1; return {}; },
    },
  });

  assert.equal(calls, 0);
  assert.equal(result.returnEvidence.status, 'unavailable');
  assert.equal(result.reconciliation.outcome, 'unavailable');
  assert.deepEqual(validateReconciliationRecord(result.reconciliation), {
    valid: true,
    errors: [],
  });
  assert.equal(Object.isFrozen(result), true);
});

test('a forged offline gate prevents live I/O', async () => {
  let liveCalls = 0;
  const client = {
    listTools: async () => {
      liveCalls += 1;
      return ['start_run', 'get_run', 'get_artifact'];
    },
    callTool: async () => {
      liveCalls += 1;
      return {};
    },
  };

  await assert.rejects(
    executeLiveRun({
      offlineGate: { status: 'passed' },
      receipt: POSITIVE_RECEIPT_FIXTURE,
      hydratedProof: RECEIPT_HYDRATED_PROOFS['receipt-positive'],
      proposal: AWAITING_INPUT_RECONCILIATION_FIXTURE.proposal,
      transformedBrief: LIVE_BRIEF_FIXTURE,
      runOptions: { agent: 'opencode', model: 'openai/gpt-5' },
      mutationAuthorization: {
        confirmed: true,
        targetProjectId: 'project-alpha',
        rollback: 'manual-open-design-cleanup',
      },
      client,
    }),
    /fresh in-process offline contract gate/,
  );
  assert.equal(liveCalls, 0);
});

test('stubbed live turn 1 returns metadata-only awaiting_input evidence', async () => {
  const offlineGate = runOfflineContractGate();
  let retainedPayload = null;
  const client = {
    listTools: async () => [
      { name: 'get_artifact' },
      { name: 'get_run' },
      { name: 'start_run' },
    ],
    callTool: async (tool, args) => {
      assert.equal(tool, 'start_run');
      assert.equal(args.project, 'project-alpha');
      assert.deepEqual(args.prompt, LIVE_BRIEF_FIXTURE);
      return {
        status: 'awaiting_input',
        projectId: 'project-alpha',
        conversationId: 'conversation-live',
        runId: 'run-live',
        files: [],
        questionForm: { fields: [{ label: 'Fidelity', recommendation: 'high' }] },
      };
    },
  };

  const result = await executeLiveRun({
    offlineGate,
    receipt: POSITIVE_RECEIPT_FIXTURE,
    hydratedProof: RECEIPT_HYDRATED_PROOFS['receipt-positive'],
    proposal: AWAITING_INPUT_RECONCILIATION_FIXTURE.proposal,
    transformedBrief: LIVE_BRIEF_FIXTURE,
    runOptions: { agent: 'opencode', model: 'openai/gpt-5' },
    mutationAuthorization: {
      confirmed: true,
      targetProjectId: 'project-alpha',
      rollback: 'manual-open-design-cleanup',
    },
    client,
    consumeLivePayload: async (payload) => { retainedPayload = payload; },
  });

  assert.equal(retainedPayload, null);
  assert.equal(result.returnEvidence.status, 'awaiting_input');
  assert.equal(result.returnEvidence.artifacts.length, 0);
  assert.equal(result.reconciliation.outcome, 'awaiting-input');
  assert.equal(JSON.stringify(result).includes('questionForm'), false);
  assert.equal(JSON.stringify(result).includes('Fidelity'), false);
});

test('stubbed live read cannot expose raw content through a callback or return', async () => {
  const offlineGate = runOfflineContractGate();
  const artifactHash = digestMetadata('<html><body>live only</body></html>');
  const { receipt, proposal, hydratedProof } = liveReadInputs(artifactHash);
  let retainedPayload = null;

  const result = await executeLiveRead({
    offlineGate,
    receipt,
    hydratedProof,
    proposal,
    client: {
      listTools: async () => ['get_file'],
      callTool: async () => ({
        projectId: 'project-alpha',
        path: 'index.html',
        content: '<html><body>live only</body></html>',
      }),
    },
    consumeLivePayload: async (payload) => { retainedPayload = payload; },
  });

  assert.equal(retainedPayload, null);
  assert.equal(result.returnEvidence.status, 'read_complete');
  assert.equal(result.returnEvidence.artifacts.length, 1);
  assert.equal(result.reconciliation.outcome, 'aligned');
  assert.equal(JSON.stringify(result).includes('live only'), false);
});

test('a divergent returned path is not aligned even when content digest matches', async () => {
  const offlineGate = runOfflineContractGate();
  const content = '<html>expected digest</html>';
  const { receipt, proposal, hydratedProof } = liveReadInputs(digestMetadata(content));

  const result = await executeLiveRead({
    offlineGate,
    receipt,
    hydratedProof,
    proposal,
    client: {
      listTools: async () => ['get_file'],
      callTool: async () => ({
        projectId: 'project-alpha',
        path: 'attacker.html',
        content,
      }),
    },
  });

  assert.notEqual(result.reconciliation.outcome, 'aligned');
  assert.equal(result.returnEvidence.artifacts.length, 0);
});

test('chunked response strings cannot become artifact metadata', async () => {
  const offlineGate = runOfflineContractGate();
  const content = '<html>bounded artifact</html>';
  const { receipt, proposal, hydratedProof } = liveReadInputs(digestMetadata(content));

  await assert.rejects(
    executeLiveRead({
      offlineGate,
      receipt,
      hydratedProof,
      proposal,
      client: {
        listTools: async () => ['get_file'],
        callTool: async () => ({
          projectId: 'project-alpha',
          path: 'index.html',
          content,
          files: Array.from({ length: 32 }, (_, index) => `payload_chunk_${index}`),
        }),
      },
    }),
    /not trusted artifact evidence/,
  );
});

test('pre-call classifications are rejected instead of reused after live I/O', async () => {
  const offlineGate = runOfflineContractGate();
  const content = '<html>post-call only</html>';
  const { receipt, proposal, hydratedProof } = liveReadInputs(digestMetadata(content));

  await assert.rejects(
    executeLiveRead({
      offlineGate,
      receipt,
      hydratedProof,
      proposal,
      modeEvidence: [],
      client: {
        listTools: async () => ['get_file'],
        callTool: async () => ({ path: 'index.html', content }),
      },
    }),
    /Pre-call mode evidence is forbidden/,
  );
});

test('proposal mutation across the capability await cannot change reconciliation', async () => {
  const offlineGate = runOfflineContractGate();
  const artifactHash = digestMetadata('<html>immutable snapshot</html>');
  const { receipt, proposal, hydratedProof } = liveReadInputs(artifactHash, 'receipt-toctou');

  const result = await executeLiveRead({
    offlineGate,
    receipt,
    hydratedProof,
    proposal,
    client: {
      listTools: async () => {
        proposal.influences[0].proposedDisposition = 'reject';
        hydratedProof.sourceIdentity.sourceId = 'mutated-after-snapshot';
        return ['get_file'];
      },
      callTool: async () => ({
        projectId: 'project-alpha',
        path: 'index.html',
        content: '<html>immutable snapshot</html>',
      }),
    },
  });

  assert.equal(proposal.influences[0].proposedDisposition, 'reject');
  assert.equal(hydratedProof.sourceIdentity.sourceId, 'mutated-after-snapshot');
  assert.equal(result.reconciliation.proposal.influences[0].proposedDisposition, 'apply');
  assert.equal(result.reconciliation.outcome, 'aligned');
});

test('awaiting_input continues, polls, fetches, and returns completed reconciliation', async () => {
  const offlineGate = runOfflineContractGate();
  const artifactContent = '<html><body>completed design</body></html>';
  const artifactHash = digestMetadata(artifactContent);
  const proposal = structuredClone(ALIGNED_RECONCILIATION_FIXTURE.proposal);
  proposal.influences[0].expectedArtifact.hash = artifactHash;
  const receipt = structuredClone(POSITIVE_RECEIPT_FIXTURE);
  receipt.influence.proposalDigest = digestMetadata(proposal);
  const calls = [];
  const client = {
    listTools: async () => ['start_run', 'get_run', 'get_artifact'],
    continueRun: async (args) => {
      calls.push(['continueRun', args]);
      return { runId: 'run-live', status: 'accepted' };
    },
    callTool: async (tool, args) => {
      calls.push([tool, args]);
      if (tool === 'start_run') {
        return {
          status: 'awaiting_input',
          projectId: 'project-alpha',
          conversationId: 'conversation-live',
          runId: 'run-live',
          files: [],
          questionForm: { fields: [{ label: 'Fidelity' }] },
        };
      }
      if (tool === 'get_run') {
        return {
          status: 'completed',
          projectId: 'project-alpha',
          conversationId: 'conversation-live',
          runId: 'run-live',
          entryFile: 'index.html',
          previewUrl: 'http://127.0.0.1:7456/preview/project-alpha',
        };
      }
      assert.equal(tool, 'get_artifact');
      return { path: 'index.html', content: artifactContent };
    },
  };

  const result = await executeLiveRun({
    offlineGate,
    receipt,
    hydratedProof: RECEIPT_HYDRATED_PROOFS['receipt-positive'],
    proposal,
    transformedBrief: LIVE_BRIEF_FIXTURE,
    runOptions: { agent: 'opencode', model: 'openai/gpt-5' },
    mutationAuthorization: {
      confirmed: true,
      targetProjectId: 'project-alpha',
      rollback: 'manual-open-design-cleanup',
    },
    continuation: {
      confirmed: true,
      action: 'use-recommended-defaults',
      maxPollAttempts: 2,
    },
    client,
  });

  assert.deepEqual(calls.map(([name]) => name), [
    'start_run',
    'continueRun',
    'get_run',
    'get_artifact',
  ]);
  assert.equal(result.returnEvidence.status, 'completed');
  assert.equal(result.returnEvidence.artifacts[0].hash, artifactHash);
  assert.equal(result.reconciliation.outcome, 'aligned');
  assert.equal(JSON.stringify(result).includes('completed design'), false);
});
