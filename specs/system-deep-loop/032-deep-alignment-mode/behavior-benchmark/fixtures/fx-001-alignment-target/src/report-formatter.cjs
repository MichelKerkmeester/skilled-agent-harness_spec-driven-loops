'use strict';

/**
 * Format a resolved deep-alignment lane's findings into a short Markdown
 * block. Small, standalone helper used as fixture code -- it has no
 * dependency on any adapter's internals, just the flat findings shape
 * every authority adapter already returns.
 */

function formatSeverityCounts(findings) {
  const counts = { P0: 0, P1: 0, P2: 0 };
  for (const finding of findings) {
    if (finding && Object.prototype.hasOwnProperty.call(counts, finding.severity)) {
      counts[finding.severity] += 1;
    }
  }
  return counts;
}

function formatLaneSection(lane, findings) {
  const counts = formatSeverityCounts(findings);
  const header = `## Lane: ${lane.authority} / ${lane.artifactClass}`;
  const summary = `P0:${counts.P0} P1:${counts.P1} P2:${counts.P2}`;
  const lines = [header, '', summary];
  for (const finding of findings) {
    lines.push(`- [${finding.severity}] ${finding.type}: ${finding.message}`);
  }
  return lines.join('\n');
}

module.exports = { formatSeverityCounts, formatLaneSection };
