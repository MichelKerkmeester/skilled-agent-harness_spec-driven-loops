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
  RECEIPT_FIXTURES,
  RECONCILIATION_FIXTURES,
  STALE_RECEIPT_FIXTURE,
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
  reconcileTransportReturn,
  validateReconciliationRecord,
  validateReturnEvidence,
} from '../return-reconciliation.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. TEST HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function collectStringPaths(value, path = [], paths = []) {
  if (typeof value === 'string') {
    paths.push(path);
    return paths;
  }
  if (value === null || typeof value !== 'object') return paths;
  for (const key of Object.keys(value)) collectStringPaths(value[key], [...path, key], paths);
  return paths;
}

function setPath(value, path, replacement) {
  let cursor = value;
  for (const key of path.slice(0, -1)) cursor = cursor[key];
  cursor[path.at(-1)] = replacement;
}

function expectedReceiptPayloadError(path) {
  const field = path.join('.');
  const exact = {
    schemaVersion: 'receipt.schemaVersion:invalid',
    receiptId: 'receipt.receiptId:invalid-metadata-identifier',
    pairedMode: 'receipt.pairedMode:invalid-enum',
    'skDesignGate.status': 'receipt.skDesignGate.status:must-be-verified',
    'operation.kind': 'receipt.operation.kind:invalid-enum',
    'operation.tool': 'receipt.operation.tool:not-allowed-for-kind',
    'corpusContext.name': 'receipt.corpusContext.name:invalid-enum',
    'corpusContext.generation.state': 'receipt.corpusContext.generation.state:invalid-enum',
    'corpusContext.availability': 'receipt.corpusContext.availability:invalid-enum',
    'corpusContext.proof.outcome': 'receipt.corpusContext.proof.outcome:invalid-enum',
    'corpusContext.proof.evidenceStatus': 'receipt.corpusContext.proof.evidenceStatus:invalid-enum',
    'corpusContext.proof.provenanceStatus': 'receipt.corpusContext.proof.provenanceStatus:invalid-enum',
    'corpusContext.proof.licenseStatus': 'receipt.corpusContext.proof.licenseStatus:invalid-enum',
    'corpusContext.proof.useLabel': 'receipt.corpusContext.proof.useLabel:invalid-enum',
    'corpusContext.proof.semanticRole': 'receipt.corpusContext.proof.semanticRole:invalid-enum',
    'corpusContext.proof.transformationState': 'receipt.corpusContext.proof.transformationState:invalid-enum',
    'corpusContext.proof.fallbackState': 'receipt.corpusContext.proof.fallbackState:invalid-enum',
    'corpusContext.proof.targetChecks': 'receipt.corpusContext.proof.targetChecks:invalid-enum',
    'influence.purposeCode': 'receipt.influence.purposeCode:invalid',
    createdAt: 'receipt.createdAt:invalid-timestamp',
  };
  if (exact[field]) return exact[field];
  if (field.endsWith('Digest') || field.endsWith('Hash')) {
    return `receipt.${field}:invalid-hash`;
  }
  if (field === 'target.projectId'
    || field === 'target.resourceId'
    || field === 'corpusContext.proof.sourceId') {
    return `receipt.${field}:invalid-metadata-identifier`;
  }
  if (field.startsWith('corpusContext.proof.dimensions.')
    || field.startsWith('influence.allowedAxes.')) {
    return `receipt.${field}:invalid-enum`;
  }
  if (field.startsWith('influence.prohibitedReuse.')) {
    return 'receipt.influence.prohibitedReuse:fixed-list-required';
  }
  if (field.startsWith('cachePolicy.') || field.startsWith('authority.')) {
    return `receipt.${field}:fixed-value-required`;
  }
  throw new Error(`Missing payload falsifier expectation for ${field}`);
}

function liveReadReceipt(receiptId = 'receipt-live-read') {
  const receipt = structuredClone(POSITIVE_RECEIPT_FIXTURE);
  receipt.receiptId = receiptId;
  receipt.operation = { kind: 'design-bearing-read', tool: 'get_file' };
  receipt.target.resourceId = 'index.html';
  return receipt;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CLOSED RECEIPTS
// ─────────────────────────────────────────────────────────────────────────────

for (const receipt of RECEIPT_FIXTURES) {
  test(`${receipt.receiptId} is valid closed metadata without a daemon`, () => {
    assert.deepEqual(validateGroundingReceipt(receipt), { valid: true, errors: [] });
  });
}

test('stale evidence remains valid offline but cannot authorize a live call', () => {
  assert.equal(validateGroundingReceipt(STALE_RECEIPT_FIXTURE).valid, true);
  const liveValidation = validateReceiptForLive(STALE_RECEIPT_FIXTURE);

  assert.equal(liveValidation.valid, false);
  assert.ok(
    liveValidation.errors.includes(
      'receipt.corpusContext.generation.state:current-required-for-live',
    ),
  );
});

test('closed receipt rejects raw cache fields without content sniffing', () => {
  const openDesignPayload = structuredClone(POSITIVE_RECEIPT_FIXTURE);
  openDesignPayload.cachedOpenDesignPayload = { html: '<html>cached output</html>' };
  const corpusPayload = structuredClone(POSITIVE_RECEIPT_FIXTURE);
  corpusPayload.rawCorpusPayload = { tokensCss: '.primary { color: red; }' };

  assert.ok(
    validateGroundingReceipt(openDesignPayload).errors.includes(
      'receipt.cachedOpenDesignPayload:unexpected',
    ),
  );
  assert.ok(
    validateGroundingReceipt(corpusPayload).errors.includes(
      'receipt.rawCorpusPayload:unexpected',
    ),
  );
});

test('every allowed receipt string field rejects raw HTML and CSS', () => {
  const stringPaths = collectStringPaths(POSITIVE_RECEIPT_FIXTURE);
  assert.ok(stringPaths.length >= 25);

  for (const payload of [
    '<button class="primary">Save</button>',
    '.primary { color: red; }',
  ]) {
    for (const path of stringPaths) {
      const receipt = structuredClone(POSITIVE_RECEIPT_FIXTURE);
      setPath(receipt, path, payload);
      const validation = validateGroundingReceipt(receipt);
      assert.ok(
        validation.errors.includes(expectedReceiptPayloadError(path)),
        `field guard did not reject payload at ${path.join('.')}: ${validation.errors.join(', ')}`,
      );
    }
  }
});

test('removing any receipt authority field invalidates the receipt', () => {
  for (const field of Object.keys(POSITIVE_RECEIPT_FIXTURE.authority)) {
    const receipt = structuredClone(POSITIVE_RECEIPT_FIXTURE);
    delete receipt.authority[field];
    assert.equal(validateGroundingReceipt(receipt).valid, false, `authority.${field}`);
  }
});

test('the proposal digest is mandatory and bound to the proposal snapshot', () => {
  const missingDigest = structuredClone(POSITIVE_RECEIPT_FIXTURE);
  delete missingDigest.influence.proposalDigest;
  assert.equal(validateGroundingReceipt(missingDigest).valid, false);

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
    receiptFixturesPassed: 3,
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
  assert.equal(capability.reason, 'daemon-unavailable');
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
      proposal: AWAITING_INPUT_RECONCILIATION_FIXTURE.proposal,
      modeEvidence: [],
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
    proposal: AWAITING_INPUT_RECONCILIATION_FIXTURE.proposal,
    modeEvidence: [],
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
  const receipt = liveReadReceipt();
  const proposal = structuredClone(ALIGNED_RECONCILIATION_FIXTURE.proposal);
  const artifactHash = digestMetadata('<html><body>live only</body></html>');
  let retainedPayload = null;

  const result = await executeLiveRead({
    offlineGate,
    receipt,
    proposal,
    modeEvidence: [
      {
        influenceId: 'primary-layout-relationship',
        classification: 'applied',
        artifactHash,
      },
    ],
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

test('proposal mutation across the capability await cannot change reconciliation', async () => {
  const offlineGate = runOfflineContractGate();
  const receipt = liveReadReceipt('receipt-toctou');
  const proposal = structuredClone(ALIGNED_RECONCILIATION_FIXTURE.proposal);
  const artifactHash = digestMetadata('<html>immutable snapshot</html>');

  const result = await executeLiveRead({
    offlineGate,
    receipt,
    proposal,
    modeEvidence: [{
      influenceId: 'primary-layout-relationship',
      classification: 'applied',
      artifactHash,
    }],
    client: {
      listTools: async () => {
        proposal.influences[0].proposedDisposition = 'reject';
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
  assert.equal(result.reconciliation.proposal.influences[0].proposedDisposition, 'apply');
  assert.equal(result.reconciliation.outcome, 'aligned');
});

test('awaiting_input continues, polls, fetches, and returns completed reconciliation', async () => {
  const offlineGate = runOfflineContractGate();
  const artifactContent = '<html><body>completed design</body></html>';
  const artifactHash = digestMetadata(artifactContent);
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
          artifacts: [{ path: 'index.html', hash: artifactHash }],
        };
      }
      assert.equal(tool, 'get_artifact');
      return { path: 'index.html', content: artifactContent };
    },
  };

  const result = await executeLiveRun({
    offlineGate,
    receipt: POSITIVE_RECEIPT_FIXTURE,
    proposal: ALIGNED_RECONCILIATION_FIXTURE.proposal,
    modeEvidence: [{
      influenceId: 'primary-layout-relationship',
      classification: 'applied',
      artifactHash,
    }],
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
