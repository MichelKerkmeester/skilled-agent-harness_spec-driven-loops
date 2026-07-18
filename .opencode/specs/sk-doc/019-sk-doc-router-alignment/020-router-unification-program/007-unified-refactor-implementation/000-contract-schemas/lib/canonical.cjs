'use strict';

const crypto = require('crypto');

const DOMAIN_TAGS = Object.freeze({
  CompiledPolicyV1: 'speckit.router.CompiledPolicyV1',
  CorrectionOverlayV1: 'speckit.router.CorrectionOverlayV1',
  EffectivePolicyV1: 'speckit.router.EffectivePolicyV1',
  RouteRequestV1: 'speckit.router.RouteRequestV1',
  RouteDecisionV1: 'speckit.router.RouteDecisionV1',
  RouteProofV1: 'speckit.router.RouteProofV1',
  UncertaintyBudgetV1: 'speckit.router.UncertaintyBudgetV1',
  AdvisorProjectionV1: 'speckit.router.AdvisorProjectionV1',
  TypedRouteGoldV1: 'speckit.router.TypedRouteGoldV1',
  PolicyCardV1: 'speckit.router.PolicyCardV1'
});

const DIGEST_FIELDS = Object.freeze([
  'basePolicyHash',
  'overlayHash',
  'effectivePolicyHash'
]);

function assertPlainObject(value, label) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${label} must be a plain object`);
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) {
    throw new TypeError(`${label} must be a plain object`);
  }
}

function assertValidUnicode(value, path) {
  for (let index = 0; index < value.length; index += 1) {
    const codeUnit = value.charCodeAt(index);
    if (codeUnit >= 0xd800 && codeUnit <= 0xdbff) {
      const nextCodeUnit = value.charCodeAt(index + 1);
      if (!(nextCodeUnit >= 0xdc00 && nextCodeUnit <= 0xdfff)) {
        throw new TypeError(`${path} contains a lone high surrogate`);
      }
      index += 1;
      continue;
    }
    if (codeUnit >= 0xdc00 && codeUnit <= 0xdfff) {
      throw new TypeError(`${path} contains a lone low surrogate`);
    }
  }
}

function serializeCanonical(value, path = '$') {
  if (value === null) return 'null';
  if (typeof value === 'string') {
    assertValidUnicode(value, path);
    return JSON.stringify(value);
  }
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') {
    if (!Number.isFinite(value) || !Number.isSafeInteger(value)) {
      throw new TypeError(`${path} must be a finite safe integer or decimal string`);
    }
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    const items = value.map((item, index) => {
      if (item === undefined) {
        throw new TypeError(`${path}[${index}] must not be undefined`);
      }
      return serializeCanonical(item, `${path}[${index}]`);
    });
    return `[${items.join(',')}]`;
  }
  assertPlainObject(value, path);
  const members = [];
  const keys = Object.keys(value).sort((left, right) => {
    if (left < right) return -1;
    if (left > right) return 1;
    return 0;
  });
  for (const key of keys) {
    assertValidUnicode(key, `${path} object key`);
    const item = value[key];
    if (key === 'overlayHash' && item === null) continue;
    if (item !== undefined) {
      members.push(`${JSON.stringify(key)}:${serializeCanonical(item, `${path}.${key}`)}`);
    }
  }
  return `{${members.join(',')}}`;
}

function omitFields(value, fields) {
  assertPlainObject(value, 'artifact');
  const omitted = new Set(fields);
  return Object.fromEntries(Object.entries(value).filter(([key]) => !omitted.has(key)));
}

function normalizeOptionalOverlay(value) {
  assertPlainObject(value, 'identity body');
  if (value.overlayHash !== null) {
    return value;
  }
  return omitFields(value, ['overlayHash']);
}

function canonicalize(value) {
  return serializeCanonical(value);
}

function canonicalBytes(value) {
  return Buffer.from(canonicalize(value), 'utf8');
}

function hashArtifact(domainTag, value) {
  if (!Object.values(DOMAIN_TAGS).includes(domainTag)) {
    throw new TypeError(`unregistered domain tag: ${domainTag}`);
  }
  if (!/^[\x20-\x7e]+$/.test(domainTag) || domainTag.includes('\0')) {
    throw new TypeError('domain tag must be printable non-NUL ASCII');
  }
  return crypto
    .createHash('sha256')
    .update(Buffer.from(domainTag, 'ascii'))
    .update(Buffer.from([0]))
    .update(canonicalBytes(value))
    .digest('hex');
}

function computeBasePolicyHash(policy) {
  return hashArtifact(DOMAIN_TAGS.CompiledPolicyV1, omitFields(policy, DIGEST_FIELDS));
}

function computeOverlayHash(overlay) {
  return hashArtifact(
    DOMAIN_TAGS.CorrectionOverlayV1,
    omitFields(overlay, ['overlayHash'])
  );
}

function effectiveIdentityBody(policy) {
  const body = {
    activationGeneration: policy.activationGeneration,
    basePolicyHash: policy.basePolicyHash,
    overlayHash: policy.overlayHash,
    schemaVersion: policy.schemaVersion
  };
  return normalizeOptionalOverlay(body);
}

function computeEffectivePolicyHash(policy) {
  return hashArtifact(DOMAIN_TAGS.EffectivePolicyV1, effectiveIdentityBody(policy));
}

function computeRequestFactsHash(request) {
  return hashArtifact(
    DOMAIN_TAGS.RouteRequestV1,
    omitFields(request, ['requestFactsHash'])
  );
}

function computeProofHash(proof) {
  return hashArtifact(DOMAIN_TAGS.RouteProofV1, omitFields(proof, ['proofHash']));
}

function computeProjectionHash(type, projection, field = 'projectionHash') {
  if (!Object.prototype.hasOwnProperty.call(DOMAIN_TAGS, type)) {
    throw new TypeError(`unknown projection type: ${type}`);
  }
  return hashArtifact(DOMAIN_TAGS[type], omitFields(projection, [field]));
}

module.exports = {
  DOMAIN_TAGS,
  canonicalize,
  canonicalBytes,
  hashArtifact,
  omitFields,
  normalizeOptionalOverlay,
  computeBasePolicyHash,
  computeOverlayHash,
  effectiveIdentityBody,
  computeEffectivePolicyHash,
  computeRequestFactsHash,
  computeProofHash,
  computeProjectionHash
};
