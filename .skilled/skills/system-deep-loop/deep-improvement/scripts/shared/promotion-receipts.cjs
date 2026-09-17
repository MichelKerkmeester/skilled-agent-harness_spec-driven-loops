'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const RECEIPT_KEY_ENV = 'DEEP_LOOP_PROMOTION_RECEIPT_KEY';
const RECEIPT_KEY_ID_ENV = 'DEEP_LOOP_PROMOTION_RECEIPT_KEY_ID';
const MIN_KEY_BYTES = 32;
const SHA256_HEX = /^[a-f0-9]{64}$/;

function canonicalize(value) {
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, canonicalize(value[key])]),
    );
  }
  return value;
}

function canonicalJson(value) {
  return JSON.stringify(canonicalize(value));
}

function requiredString(value, label) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Promotion receipt requires ${label}`);
  }
  return value;
}

function requiredHash(value, label) {
  requiredString(value, label);
  if (!SHA256_HEX.test(value)) {
    throw new Error(`Promotion receipt requires ${label} to be a lowercase SHA-256 digest`);
  }
  return value;
}

function validateArtifact(value, label, hashField = 'hash') {
  if (!value || typeof value !== 'object') {
    throw new Error(`Promotion receipt requires ${label}`);
  }
  requiredString(value.path, `${label}.path`);
  requiredHash(value[hashField], `${label}.${hashField}`);
}

function validatePayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error('Promotion receipt payload must be an object');
  }
  requiredString(payload.receiptType, 'receiptType');
  requiredString(payload.receiptId, 'receiptId');
  requiredString(payload.issuedAt, 'issuedAt');
  requiredString(payload.authority?.approvalIdentity, 'authority.approvalIdentity');
  requiredString(payload.authority?.evaluatorProfileId, 'authority.evaluatorProfileId');
  requiredString(payload.authority?.evaluatorAgentName, 'authority.evaluatorAgentName');
  requiredString(payload.authority?.evaluatorEpoch, 'authority.evaluatorEpoch');
  validateArtifact(payload.binding?.candidate, 'binding.candidate');
  validateArtifact(payload.binding?.target, 'binding.target', 'preimageHash');
  validateArtifact(payload.binding?.benchmarkReport, 'binding.benchmarkReport');
  validateArtifact(payload.binding?.repeatabilityReport, 'binding.repeatabilityReport');
  validateArtifact(payload.binding?.config, 'binding.config');
  validateArtifact(payload.binding?.manifest, 'binding.manifest');
  if (payload.binding?.score !== null) {
    validateArtifact(payload.binding?.score, 'binding.score');
    requiredHash(payload.binding.score.inputHash, 'binding.score.inputHash');
  }
  if (payload.receiptType === 'promotion-acceptance') {
    validateArtifact(payload.acceptance?.state, 'acceptance.state');
    validateArtifact(payload.acceptance?.candidateSnapshot, 'acceptance.candidateSnapshot');
    validateArtifact(payload.acceptance?.preAcceptBackup, 'acceptance.preAcceptBackup');
  }
}

function receiptKey(env = process.env) {
  const raw = env[RECEIPT_KEY_ENV];
  if (typeof raw !== 'string' || Buffer.byteLength(raw, 'utf8') < MIN_KEY_BYTES) {
    throw new Error(`${RECEIPT_KEY_ENV} must contain at least ${MIN_KEY_BYTES} bytes`);
  }
  return Buffer.from(raw, 'utf8');
}

function receiptKeyId(key, env = process.env) {
  const configured = env[RECEIPT_KEY_ID_ENV];
  if (configured && configured.trim()) {
    return configured.trim();
  }
  return crypto.createHash('sha256').update(key).digest('hex').slice(0, 16);
}

function sha256File(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function artifact(filePath, hashField = 'hash') {
  return { path: filePath, [hashField]: sha256File(filePath) };
}

function buildApprovalPayload(options) {
  const score = options.scorePath ? JSON.parse(fs.readFileSync(options.scorePath, 'utf8')) : null;
  if (score && (typeof score.inputHash !== 'string' || !SHA256_HEX.test(score.inputHash))) {
    throw new Error('Promotion approval requires a scored inputHash');
  }
  return {
    receiptType: 'promotion-approval',
    receiptId: options.receiptId || crypto.randomUUID(),
    issuedAt: options.issuedAt || new Date().toISOString(),
    authority: {
      approvalIdentity: options.approvalIdentity,
      evaluatorProfileId: options.evaluatorProfileId,
      evaluatorAgentName: options.evaluatorAgentName,
      evaluatorEpoch: options.evaluatorEpoch,
    },
    binding: {
      candidate: artifact(options.candidatePath),
      target: artifact(options.targetPath, 'preimageHash'),
      score: options.scorePath
        ? { ...artifact(options.scorePath), inputHash: score.inputHash }
        : null,
      benchmarkReport: artifact(options.benchmarkReportPath),
      repeatabilityReport: artifact(options.repeatabilityReportPath),
      config: artifact(options.configPath),
      manifest: artifact(options.manifestPath),
    },
  };
}

function issueApprovalReceipt(filePath, options, env = process.env) {
  return issueReceipt(filePath, buildApprovalPayload(options), env);
}

function signedBody(receipt) {
  const { authentication: _authentication, ...body } = receipt;
  return body;
}

function authenticate(payload, env = process.env) {
  validatePayload(payload);
  const key = receiptKey(env);
  const body = signedBody(payload);
  const mac = crypto.createHmac('sha256', key).update(canonicalJson(body)).digest('hex');
  return {
    ...body,
    authentication: {
      scheme: 'hmac-sha256',
      keyId: receiptKeyId(key, env),
      mac,
    },
  };
}

function verifyReceipt(receipt, expectedType, env = process.env) {
  validatePayload(receipt);
  if (receipt.receiptType !== expectedType) {
    throw new Error(`Promotion receipt type mismatch: expected ${expectedType}, got ${receipt.receiptType}`);
  }
  if (receipt.authentication?.scheme !== 'hmac-sha256') {
    throw new Error('Promotion receipt authentication scheme is invalid');
  }
  const key = receiptKey(env);
  const expectedKeyId = receiptKeyId(key, env);
  if (receipt.authentication?.keyId !== expectedKeyId) {
    throw new Error('Promotion receipt authentication key id is invalid');
  }
  const expected = crypto.createHmac('sha256', key)
    .update(canonicalJson(signedBody(receipt)))
    .digest();
  const observedHex = receipt.authentication?.mac;
  if (typeof observedHex !== 'string' || !SHA256_HEX.test(observedHex)) {
    throw new Error('Promotion receipt authentication failed');
  }
  const observed = Buffer.from(observedHex, 'hex');
  if (observed.length !== expected.length || !crypto.timingSafeEqual(observed, expected)) {
    throw new Error('Promotion receipt authentication failed');
  }
  return receipt;
}

function assertRegularReceiptPath(filePath) {
  if (fs.existsSync(filePath) && fs.lstatSync(filePath).isSymbolicLink()) {
    throw new Error(`Promotion receipt path must not be a symlink: ${filePath}`);
  }
  const parent = path.dirname(filePath);
  if (fs.existsSync(parent) && fs.lstatSync(parent).isSymbolicLink()) {
    throw new Error(`Promotion receipt parent must not be a symlink: ${parent}`);
  }
}

function issueReceipt(filePath, payload, env = process.env) {
  assertRegularReceiptPath(filePath);
  const receipt = authenticate(payload, env);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  let descriptor;
  try {
    descriptor = fs.openSync(filePath, 'wx', 0o600);
    fs.writeFileSync(descriptor, `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
    fs.fsyncSync(descriptor);
  } catch (error) {
    if (error?.code === 'EEXIST') {
      throw new Error(`Promotion receipt already exists and cannot be replaced: ${filePath}`);
    }
    throw error;
  } finally {
    if (descriptor !== undefined) {
      fs.closeSync(descriptor);
    }
  }
  return receipt;
}

function readVerifiedReceipt(filePath, expectedType, env = process.env) {
  assertRegularReceiptPath(filePath);
  const receipt = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return verifyReceipt(receipt, expectedType, env);
}

module.exports = {
  authenticate,
  buildApprovalPayload,
  canonicalJson,
  issueApprovalReceipt,
  issueReceipt,
  readVerifiedReceipt,
  sha256File,
  verifyReceipt,
};
