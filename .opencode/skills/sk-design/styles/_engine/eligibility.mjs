// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Style Eligibility Gates                                                 ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// 1. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

import { compareRawStrings } from './ordering.mjs';

function normalizeFacet(value) {
  return String(value ?? '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function styleFacetSet(style) {
  const facets = new Set((style.facets ?? []).map(normalizeFacet));
  for (const capability of style.capabilities ?? []) facets.add(normalizeFacet(capability));
  for (const tokenAxis of style.tokenAxes ?? []) facets.add(normalizeFacet(tokenAxis.axis));
  for (const section of style.availableSections ?? []) facets.add(normalizeFacet(section));
  if (style.theme) facets.add(normalizeFacet(style.theme));
  if (style.provenance?.licenseStatus === 'restricted') {
    facets.add('license-restricted');
  }
  return facets;
}

function evaluateStyle(style, request) {
  const facets = styleFacetSet(style);
  const requiredFacets = (request.requiredFacets ?? []).map(normalizeFacet).filter(Boolean);
  const exclusions = (request.exclusions ?? []).map(normalizeFacet).filter(Boolean);
  const missingFacets = requiredFacets.filter((facet) => !facets.has(facet));
  const matchedExclusions = exclusions.filter((facet) => facets.has(facet));
  const provenanceAllowed = style.provenance?.status === 'known';
  const requiresExactReuse = request.usage === 'exact-reuse' || request.exactReuse === true;
  const rightsAllowed = !requiresExactReuse || (
    style.provenance?.rightsKnown === true
    && ['allowed', 'licensed', 'public-domain'].includes(style.provenance?.licenseStatus)
  );
  const reasons = [];
  if (missingFacets.length > 0) reasons.push(`missing-facets:${missingFacets.join(',')}`);
  if (matchedExclusions.length > 0) reasons.push(`excluded:${matchedExclusions.join(',')}`);
  if (!provenanceAllowed) reasons.push('provenance-missing');
  if (!rightsAllowed) reasons.push('rights-not-cleared');
  return {
    eligible: reasons.length === 0,
    reasons,
    matchedRequiredFacets: requiredFacets.filter((facet) => facets.has(facet)),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Decide candidate membership before any lexical ranker can observe records.
 *
 * @param {Object[]} styles - Manifest style records.
 * @param {Object} request - Generic retrieval request.
 * @returns {{eligible:Object[],rejected:Object[]}} Membership decision and audit trail.
 */
export function applyEligibility(styles, request = {}) {
  if (!Array.isArray(styles)) {
    const error = new TypeError('styles must be an array.');
    error.code = 'invalid-input';
    throw error;
  }
  const eligible = [];
  const rejected = [];
  for (const style of styles) {
    const evaluation = evaluateStyle(style, request);
    if (evaluation.eligible) {
      eligible.push({ ...style, eligibility: evaluation });
    } else {
      rejected.push({ id: style.id, slug: style.slug, reasons: evaluation.reasons });
    }
  }
  eligible.sort((left, right) => compareRawStrings(left.id, right.id));
  rejected.sort((left, right) => compareRawStrings(left.id, right.id));
  return { eligible, rejected };
}

/**
 * Return whether one style passes every deterministic membership gate.
 *
 * @param {Object} style - Manifest style record.
 * @param {Object} request - Generic retrieval request.
 * @returns {{eligible:boolean,reasons:string[],matchedRequiredFacets:string[]}} Gate result.
 */
export function evaluateEligibility(style, request = {}) {
  return evaluateStyle(style, request);
}
