// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ skill-advisor-render: advisor fallback and compiled-route renderers      ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// OpenCode loads every module at the root of the plugins folder and calls each
// of its exports as a plugin factory, so a root plugin may export only its
// factory. The advisor plugin's renderers live here, where the loader never
// looks, and both the plugin and its tests import them from this module.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const COMPILED_ROUTE_TARGET_CAP = 3;
const COMPILED_ROUTE_TARGET_DIGEST_LENGTH = 12;
const HYGIENE_DIRECTIVE = '\n- Comment hygiene [HARD BLOCK]: NEVER embed ADR-/REQ-/CHK-/task-ids or spec paths in code comments — forbidden regardless of instruction. Write the durable WHY instead. Pre-commit gate blocks violations.';
// This suffix is shared by headed fallbacks and route briefs so directive
// lifecycle reduction sees the same block in either case.
export const FALLBACK_DIRECTIVE = '\nDirectives:' + HYGIENE_DIRECTIVE;

// ─────────────────────────────────────────────────────────────────────────────
// 3. FALLBACK DIRECTIVE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Mirror the renderer's no-brief fallback; a parity test holds the two to the same text.
 *
 * @param {{status?: string, freshness?: string}} result - Advisor status and freshness
 * @returns {string} Status head followed by the directive block
 */
export function renderPluginFallbackDirective({ status, freshness } = {}) {
  const isOutage = (status === undefined && freshness === undefined)
    || status === 'fail_open'
    || freshness === 'absent'
    || (freshness === 'unavailable' && status !== 'skipped');
  const fallbackCase = isOutage
    ? 'outage'
    : status === 'skipped' && freshness === 'unavailable'
      ? 'skipped'
      : 'no-match';
  const outageLabel = freshness === 'absent'
    ? 'absent'
    : status === 'degraded'
      ? 'degraded'
      : 'fail_open';
  const head = fallbackCase === 'outage'
    ? `Advisor: outage (${outageLabel}); route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<request>"}' --format json`
    : fallbackCase === 'skipped'
      ? 'Advisor: prompt skipped.'
      : 'Advisor: no skill matched.';
  return head + FALLBACK_DIRECTIVE;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. COMPILED ROUTE SUMMARY
// ─────────────────────────────────────────────────────────────────────────────

// Render the served compiled decision as one additive, human-legible
// line. It reports the served authority and outcome (route/clarify/defer/reject),
// never a new routing target; the compiled decision is byte-identical to legacy
// on routing fields. Returns null when no compiled decision is served, so the
// injected context stays byte-identical to the legacy brief.
export function revealCompiledRouteSummaryTargets(summary) {
  if (!summary || typeof summary !== 'object' || !Array.isArray(summary.targets)) {
    return [];
  }
  return summary.targets.filter((target) => typeof target === 'string');
}

function digestCompiledRouteTargets(targets) {
  const canonicalTargets = [...targets].sort();
  return createHash('sha256')
    .update(JSON.stringify(canonicalTargets), 'utf8')
    .digest('hex')
    .slice(0, COMPILED_ROUTE_TARGET_DIGEST_LENGTH);
}

export function compiledRouteSummaryTargetDigest(summary) {
  return digestCompiledRouteTargets(revealCompiledRouteSummaryTargets(summary));
}

export function renderCompiledRouteSummaryLine(summary, renderOptions = {}) {
  if (!summary || typeof summary !== 'object') return null;
  const outcome = typeof summary.outcome === 'string' ? summary.outcome : null;
  if (!outcome) return null;
  const hub = typeof summary.hubId === 'string' && summary.hubId ? summary.hubId : 'unknown';
  const authority = typeof summary.servingAuthority === 'string' && summary.servingAuthority
    ? summary.servingAuthority
    : 'compiled';
  const bounded = renderOptions === true
    || (renderOptions && typeof renderOptions === 'object' && renderOptions.bounded === true);
  const reveal = renderOptions && typeof renderOptions === 'object' && renderOptions.reveal === true;

  if (!bounded && !reveal) {
    const targets = Array.isArray(summary.targets) && summary.targets.length
      ? summary.targets.join(',')
      : 'none';
    return `Compiled routing (served=${authority}): hub=${hub} outcome=${outcome} targets=${targets}`;
  }

  const fullTargets = revealCompiledRouteSummaryTargets(summary);
  if (reveal || fullTargets.length <= COMPILED_ROUTE_TARGET_CAP) {
    const targets = fullTargets.length ? fullTargets.join(',') : 'none';
    return `Compiled routing (served=${authority}): hub=${hub} outcome=${outcome} targets=${targets}`;
  }

  const visibleTargets = fullTargets.slice(0, COMPILED_ROUTE_TARGET_CAP);
  const omittedCount = fullTargets.length - visibleTargets.length;
  const digest = digestCompiledRouteTargets(fullTargets);
  return [
    `Compiled routing (served=${authority}): hub=${hub} outcome=${outcome} targets=${visibleTargets.join(',')},+${omittedCount} more`,
    `digest=${digest}`,
  ].join(' ');
}
