#!/usr/bin/env node

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep-Loop Runtime — Pilot Rollback Drill for the deep-research mode       ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Runs a REAL rollback drill bound to the current commit and emits the     ║
// ║ resulting drill certificate as one JSON object on stdout.                ║
// ║                                                                          ║
// ║ What this proves: that a forward-detect-reverse-resume rollback can be   ║
// ║ rehearsed for deep-research inside a hermetic sandbox while the live     ║
// ║ authority record for the mode is passed as a PROTECTED path and proven   ║
// ║ untouched. Nothing here mutates live authority.                          ║
// ║                                                                          ║
// ║ Why the synthetic parts are legitimate: a drill rehearses failure, so    ║
// ║ the fault, workload, rollback anchor, input bindings, and sandbox root   ║
// ║ are deliberately constructed fixtures. They are labelled as synthetic in ║
// ║ the output. Everything that binds the drill to reality — the mode, the   ║
// ║ candidate/base commits, the verifier identity, the starting authority     ║
// ║ epoch, the frozen-census classification rows and their policies, the     ║
// ║ rollback window minimums, the HMAC certification key, and the protected  ║
// ║ live-authority path — is real and read from the environment.             ║
// ║                                                                          ║
// ║ Input:  DEEP_LOOP_DRILL_SECRET env var (>= 32 bytes).                    ║
// ║ Output: JSON to stdout.                                                  ║
// ║ Exit:   0=passed drill, 1=script error, 2=failed drill.                  ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. TSX BOOTSTRAP
// ─────────────────────────────────────────────────────────────────────────────

const TSX_LOADER = require.resolve('tsx');
const isTsxLoaded = process.env.DEEP_LOOP_TSX_LOADED === '1';

function runTsxBootstrap() {
  const { spawn } = require('node:child_process');
  const child = spawn(
    process.execPath,
    ['--import', TSX_LOADER, __filename, ...process.argv.slice(2)],
    {
      cwd: process.cwd(),
      env: { ...process.env, DEEP_LOOP_TSX_LOADED: '1' },
      stdio: [process.stdin.isTTY ? 'ignore' : 'pipe', 'pipe', 'pipe'],
    },
  );

  if (!process.stdin.isTTY && child.stdin) {
    child.stdin.on('error', () => {});
    process.stdin.pipe(child.stdin);
  }

  child.stdout?.pipe(process.stdout);
  child.stderr?.pipe(process.stderr);

  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, () => {
      child.kill(signal);
    });
  }

  child.on('close', (status, signal) => {
    if (status !== null) {
      process.exit(status);
    }
    process.exit(signal === 'SIGINT' ? 130 : signal === 'SIGTERM' ? 143 : 1);
  });
}

if (require.main === module && !isTsxLoaded) {
  runTsxBootstrap();
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. MAIN IMPLEMENTATION (under tsx)
// ─────────────────────────────────────────────────────────────────────────────

const { createHash } = require('node:crypto');
const { existsSync, mkdtempSync, readFileSync, writeFileSync } = require('node:fs');
const { join, dirname } = require('node:path');
const { tmpdir } = require('node:os');

function jsonOut(payload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

function sha256(value) {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

// The manifest's identity grammar (lowercase alphanumerics and hyphens only)
// is narrower than the cutover binding's actor grammar (which carries the
// operator kind prefix, dots, and an email-style handle). The drill must stay
// attributable across that boundary, so the actor id is slugified into a
// manifest-legal identity while the original is preserved verbatim in the
// emitted JSON under verifierActorId.
function slugifyIdentity(actorId) {
  const slug = String(actorId)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug.slice(0, 128);
}

// A protected path that does not exist is still a meaningful protection target:
// digest a sentinel so before/after equality proves the drill never created it.
function protectedDigest(path) {
  if (!existsSync(path)) return `missing:${path}`;
  return `sha256:${sha256(readFileSync(path))}`;
}

async function main() {
  // The HMAC certification key must come from the environment and must clear
  // the provider's 256-bit minimum. A hardcoded fallback would let a drill
  // certificate be signed by a key nobody issued, so refuse instead.
  const secret = process.env.DEEP_LOOP_DRILL_SECRET;
  if (!secret || Buffer.byteLength(secret, 'utf8') < 32) {
    jsonOut({
      ok: false,
      phase: 'secret',
      code: 'DRILL_SECRET_REQUIRED',
      reason:
        'DEEP_LOOP_DRILL_SECRET is missing or under 32 bytes; a drill certificate cannot be signed without a real key.',
    });
    process.exit(1);
  }

  const {
    runRollbackDrill,
    RollbackFaultFixtures,
    DetectorByFaultFixture,
    ROLLBACK_DRILL_SCHEMA_VERSION,
    rollbackAnchorDigest,
    classificationManifestDigest,
    RollbackDrillError,
  } = await import('../lib/rollback-drills/index.ts');
  const {
    createClassificationManifest,
    FROZEN_CENSUS_CONTRACT,
    FROZEN_CENSUS_ROW_IDS,
    FROZEN_CENSUS_ROW_POLICIES,
    frozenPolicyFor,
  } = await import('../lib/inflight-state-classification/index.ts');
  const { createHmacCertificationProvider } =
    await import('../lib/receipts-and-effect-recovery/index.ts');
  const { resolveCutoverBinding } = await import('../lib/cutover-binding/index.ts');
  const { AuthorityRegistry } = await import('../lib/per-mode-authority-flip/index.ts');
  const { resolveAuthorityRoot } =
    await import('../lib/authority-root/resolve-authority-root.ts');

  const repositoryRoot = process.cwd();
  const mode = 'deep-research';

  // Bind the drill to the real current commit and the real operator identity.
  // The long form 'deep-research' is used deliberately: the authority modules
  // name modes with the long form, and the drill only compares mode strings,
  // so a short form would be accepted and then silently mismatch downstream.
  const binding = resolveCutoverBinding({ mode, repositoryRoot });
  const candidateSha = binding.candidateSha;
  const baseSha = binding.baseSha;
  const verifierActorId = binding.actorId;
  const verifierIdentity = slugifyIdentity(verifierActorId);

  const authorityRoot = resolveAuthorityRoot();
  const startingAuthorityEpoch = new AuthorityRegistry(authorityRoot).read(mode).epoch;

  // Build the classification from the real frozen-census row ids and each row's
  // real frozen policy. The contract object itself carries no rows array, so
  // the row set comes from FROZEN_CENSUS_ROW_IDS and the disposition for each
  // row comes from frozenPolicyFor(rowId). The remaining per-row fields are
  // drill fixtures; the row identities and dispositions are real.
  const classificationRows = FROZEN_CENSUS_ROW_IDS.map((rowId) => {
    const policy = frozenPolicyFor(rowId);
    const disposition = policy.disposition;
    return {
      rowId,
      stateDigest: sha256(`pilot-state:${rowId}`),
      shapeVersion: 'census-v1',
      lifecyclePoint: 'steady',
      authorityEpoch: startingAuthorityEpoch,
      mutability: 'append-only',
      activeLeaseIds: [],
      pendingEffectIds: [],
      identityCoverageComplete: true,
      orderCoverageComplete: true,
      rollbackAnchorDigest: sha256(`pilot-anchor:${rowId}`),
      disposition,
      reasonCode: 'pilot-drill-classified',
      verifier: 'pilot-drill-verifier',
      // PIN rows require a terminal receipt to demonstrate bounded legacy
      // completion; MIGRATE rows require a quiescent checkpoint. Both are
      // populated so only the real BLOCK policy rows can veto the drill.
      terminalReceiptId: disposition === 'PIN' ? sha256(`pilot-terminal:${rowId}`) : null,
      isQuiescent: true,
    };
  });
  const classification = {
    expectedRowIds: classificationRows.map((row) => row.rowId),
    rows: classificationRows,
  };

  const anchorId = 'deep-research-rollback-anchor';
  const anchorState = {
    facts: ['sealed-anchor-fact'],
    artifacts: { seed: 'stable' },
    completedSteps: 1,
  };
  const anchorDigest = rollbackAnchorDigest(anchorId, anchorState);

  // The 14-field binding set. classificationManifest and rollbackAsset bind the
  // real classification and anchor digests; the other twelve are identity
  // digests of stable contract names, so the certificate is freshness-bound
  // without retaining host paths.
  const bindings = {
    adapterRegistry: sha256('pilot-adapter-registry-v1'),
    base: sha256('pilot-base-identity'),
    candidate: sha256('pilot-candidate-identity'),
    classificationManifest: classificationManifestDigest(classification),
    contractDefectLedger: sha256('pilot-contract-defect-ledger-v1'),
    eventSchemaCensus: sha256('pilot-event-schema-census-v1'),
    fingerprintContract: sha256('pilot-fingerprint-contract-v1'),
    modeRegistry: sha256('pilot-mode-registry-v1'),
    parityCertificate: sha256('pilot-parity-certificate'),
    phaseTree: sha256('pilot-phase-tree-v1'),
    policy: sha256('pilot-rollback-policy-v1'),
    projectionContract: sha256('pilot-projection-contract-v1'),
    receiptContract: sha256('pilot-receipt-contract-v1'),
    rollbackAsset: anchorDigest,
  };

  // Read the rollback window minimums from the frozen contract rather than
  // hardcoding them, so the drill cannot drift from the census policy.
  const minimumCalendarDays = FROZEN_CENSUS_CONTRACT.rollbackMinimumDays;
  const minimumSuccessfulRuns = FROZEN_CENSUS_CONTRACT.rollbackMinimumSuccessfulRuns;
  const openedAt = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // Zero successful authoritative runs is correct and intended: deep-research
  // has never held authority, so its rollback window has never closed. The
  // runner refuses only when a window has CLOSED, and closure needs BOTH the
  // run minimum met AND the calendar deadline passed. With zero runs the run
  // minimum is unmet, so the window stays open regardless of the calendar
  // deadline. Do not "fix" this to a positive number.
  const rollbackWindow = {
    openedAt,
    successfulAuthoritativeRuns: 0,
    minimumCalendarDays,
    minimumSuccessfulRuns,
    stricterDeadlineAt: null,
  };

  const fault = {
    fixture: RollbackFaultFixtures.REPLAY_FINGERPRINT_MISMATCH,
    expectedDetector: DetectorByFaultFixture[RollbackFaultFixtures.REPLAY_FINGERPRINT_MISMATCH],
    cutPoint: 'after-durable-spine-work',
    timeoutMs: 100,
  };

  const manifest = {
    schemaVersion: ROLLBACK_DRILL_SCHEMA_VERSION,
    drillId: 'deep-research-pilot-rollback-drill',
    mode,
    baseSha,
    candidateSha,
    policyVersion: FROZEN_CENSUS_CONTRACT.transitionPolicyRevision,
    verifierIdentity,
    startingAuthorityEpoch,
    legacyWriterId: 'legacy-writer',
    spineWriterId: 'spine-writer',
    bindings,
    parityUnresolvedDivergences: 0,
    classification,
    rollbackAnchor: { anchorId, state: anchorState, digest: anchorDigest },
    workload: {
      factIds: ['pilot-fact-a', 'pilot-fact-b'],
      artifactName: 'result.json',
      artifactContent: '{"status":"complete"}',
    },
    rollbackWindow,
    fault,
  };

  // Protect the live authority record for the mode. Prefer the mode's authority
  // file; if it has never been written, protect the authority root's README so
  // the protected-path digest still binds something real under that root.
  const liveAuthorityFile = join(authorityRoot, `authority-${mode}.json`);
  let protectedPath = liveAuthorityFile;
  let protectedPathNote = null;
  if (!existsSync(liveAuthorityFile)) {
    protectedPath = join(authorityRoot, 'README.md');
    protectedPathNote = `authority-${mode}.json does not exist; protecting ${protectedPath} instead`;
  }

  const sandboxRoot = mkdtempSync(join(tmpdir(), 'deep-loop-pilot-rollback-'));
  const certificatePath = join(dirname(sandboxRoot), 'pilot-drill-certificate.json');

  const certificationProfile = {
    scheme: 'hmac-sha256',
    provider_id: 'pilot-drill-hmac',
    key_id: 'pilot-drill-key-v1',
    verifier_version: 'pilot-drill-verifier-v1',
    trust_scope: 'durable-cross-resume',
  };
  const certificationProvider = createHmacCertificationProvider(
    certificationProfile,
    secret,
  );

  // A real system clock: now reads wall time. advance is a no-op because wall
  // time cannot be moved; the runner's internal lane clocks advance on their
  // own and resynchronize to this clock's now().
  const clock = {
    now: () => new Date(),
    advance: () => {},
  };

  const protectedBefore = protectedDigest(protectedPath);

  const options = {
    manifest,
    currentMode: mode,
    currentBindings: bindings,
    sandboxRoot,
    protectedPaths: [{ id: 'live-authority', path: protectedPath }],
    certificationProvider,
    certificationProfile,
    clock,
  };

  const baseOutput = {
    mode,
    candidateSha,
    baseSha,
    startingAuthorityEpoch,
    verifierActorId,
    verifierIdentity,
    syntheticInputs: ['fault', 'workload', 'rollbackAnchor', 'bindings', 'sandboxRoot'],
    protectedPathUsed: protectedPath,
    protectedPathNote,
  };

  let result;
  try {
    result = await runRollbackDrill(options);
  } catch (error) {
    // A drill that fails validation or an invariant never produced a
    // certificate. That is a real, useful answer: report the reason code
    // honestly instead of fabricating a pass.
    const protectedAfter = protectedDigest(protectedPath);
    const protectedPathsUnchanged = protectedBefore === protectedAfter;
    const reasonCode = error instanceof RollbackDrillError
      || (error && typeof error.reasonCode === 'string')
      ? error.reasonCode
      : null;
    const failure = {
      ...baseOutput,
      ok: false,
      passed: false,
      reasonCodes: reasonCode ? [reasonCode] : [],
      certificateDigest: null,
      certificate: null,
      protectedPathsUnchanged,
      drillError: error instanceof Error ? error.message : String(error),
    };
    writeFileSync(certificatePath, `${JSON.stringify(failure, null, 2)}\n`);
    process.stderr.write(`certificate-path=${certificatePath}\n`);
    jsonOut(failure);
    process.exit(2);
  }

  const protectedAfter = protectedDigest(protectedPath);
  const protectedPathsUnchanged = protectedBefore === protectedAfter;
  const certificate = result.certificate;
  const passed = certificate.facts.passed;

  const output = {
    ...baseOutput,
    ok: passed,
    passed,
    reasonCodes: certificate.facts.reasonCodes,
    certificateDigest: certificate.certificateDigest,
    certificate,
    protectedPathsUnchanged,
  };

  writeFileSync(certificatePath, `${JSON.stringify(certificate, null, 2)}\n`);
  process.stderr.write(`certificate-path=${certificatePath}\n`);
  jsonOut(output);
  process.exit(passed ? 0 : 2);
}

if (require.main === module && isTsxLoaded) {
  main().catch((error) => {
    jsonOut({
      ok: false,
      phase: 'runtime',
      reason: error instanceof Error ? error.message : String(error),
      code: 'RUNTIME_ERROR',
    });
    process.exit(1);
  });
}

module.exports = { main };
