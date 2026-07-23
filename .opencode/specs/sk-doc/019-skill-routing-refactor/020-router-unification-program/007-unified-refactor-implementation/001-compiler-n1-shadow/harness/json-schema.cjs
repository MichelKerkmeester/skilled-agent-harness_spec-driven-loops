// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ VALIDATOR: ZERO-DEPENDENCY JSON SCHEMA SUBSET                            ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { canonicalize } = require('../../000-contract-schemas/lib/canonical.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function resolveReference(rootSchema, reference) {
  if (!reference.startsWith('#/')) throw new Error(`unsupported schema reference: ${reference}`);
  return reference.slice(2).split('/').reduce((node, part) => node[part], rootSchema);
}

function matchesType(value, type) {
  if (type === 'object') return value !== null && typeof value === 'object' && !Array.isArray(value);
  if (type === 'array') return Array.isArray(value);
  if (type === 'integer') return Number.isSafeInteger(value);
  if (type === 'number') return typeof value === 'number' && Number.isFinite(value);
  if (type === 'null') return value === null;
  return typeof value === type;
}

function sameValue(left, right) {
  try {
    return canonicalize(left) === canonicalize(right);
  } catch (_) {
    return Object.is(left, right);
  }
}

function validateNode(schema, value, rootSchema, location) {
  if (!schema || typeof schema !== 'object') return [];
  if (schema.$ref) {
    return validateNode(resolveReference(rootSchema, schema.$ref), value, rootSchema, location);
  }

  const errors = [];
  if (schema.const !== undefined && !sameValue(value, schema.const)) {
    errors.push(`${location} must equal ${JSON.stringify(schema.const)}`);
  }
  if (schema.enum && !schema.enum.some((candidate) => sameValue(value, candidate))) {
    errors.push(`${location} is not in the allowed enum`);
  }
  if (schema.type && !matchesType(value, schema.type)) {
    errors.push(`${location} must be ${schema.type}`);
    return errors;
  }
  if (schema.oneOf) {
    const results = schema.oneOf.map((candidate) => (
      validateNode(candidate, value, rootSchema, location)
    ));
    const matches = results.filter((result) => result.length === 0).length;
    if (matches !== 1) errors.push(`${location} must match exactly one union branch; matched ${matches}`);
  }
  if (schema.allOf) {
    schema.allOf.forEach((candidate) => {
      if (candidate.if) {
        const conditionMatches = validateNode(candidate.if, value, rootSchema, location).length === 0;
        if (conditionMatches && candidate.then) {
          errors.push(...validateNode(candidate.then, value, rootSchema, location));
        }
      } else {
        errors.push(...validateNode(candidate, value, rootSchema, location));
      }
    });
  }
  if (typeof value === 'string') {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      errors.push(`${location} is shorter than ${schema.minLength}`);
    }
    if (schema.pattern && !(new RegExp(schema.pattern).test(value))) {
      errors.push(`${location} does not match ${schema.pattern}`);
    }
  }
  if (typeof value === 'number') {
    if (schema.minimum !== undefined && value < schema.minimum) {
      errors.push(`${location} is below ${schema.minimum}`);
    }
    if (schema.maximum !== undefined && value > schema.maximum) {
      errors.push(`${location} is above ${schema.maximum}`);
    }
  }
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      errors.push(`${location} has fewer than ${schema.minItems} items`);
    }
    if (schema.maxItems !== undefined && value.length > schema.maxItems) {
      errors.push(`${location} has more than ${schema.maxItems} items`);
    }
    if (schema.uniqueItems) {
      const keys = value.map((item) => canonicalize(item));
      if (new Set(keys).size !== keys.length) errors.push(`${location} contains duplicate items`);
    }
    if (schema.items) {
      value.forEach((item, index) => {
        errors.push(...validateNode(schema.items, item, rootSchema, `${location}[${index}]`));
      });
    }
  }
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    const properties = schema.properties || {};
    if (schema.required) {
      schema.required.forEach((key) => {
        if (!Object.prototype.hasOwnProperty.call(value, key)) {
          errors.push(`${location}.${key} is required`);
        }
      });
    }
    Object.entries(value).forEach(([key, child]) => {
      if (properties[key]) {
        errors.push(...validateNode(properties[key], child, rootSchema, `${location}.${key}`));
      } else if (schema.additionalProperties === false) {
        errors.push(`${location}.${key} is not allowed`);
      }
    });
  }
  return errors;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. PUBLIC VALIDATOR
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Assert that one artifact satisfies its frozen local V1 schema.
 *
 * @param {Object} schema - Parsed JSON Schema document.
 * @param {*} value - Artifact to validate.
 * @param {string} label - Artifact label used in failure output.
 * @returns {true} True when validation succeeds.
 */
function assertSchema(schema, value, label) {
  const errors = validateNode(schema, value, schema, '$');
  if (errors.length > 0) {
    throw new Error(`${label} schema errors:\n${errors.map((error) => `- ${error}`).join('\n')}`);
  }
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  assertSchema,
  validateNode,
};
