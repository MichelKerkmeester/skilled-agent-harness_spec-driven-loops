'use strict';

const path = require('node:path');

const specFolder = path.resolve(
  '.opencode/specs/sk-code/019-split-doc-template-alignment',
);
const artifactDir = path.resolve(
  '.opencode/specs/sk-code/019-split-doc-template-alignment/review/xhigh-verify/lineages/xhigh-b',
);
const resolverPath = path.resolve(
  '.opencode/skills/system-deep-loop/runtime/lib/deep-loop/artifact-root.cjs',
);

const resolver = require(resolverPath);
resolver.resolveArtifactRoot = () => ({
  artifactDir,
  artifactRootDir: artifactDir,
  artifactSubfolder: null,
  artifactArchiveRoot: path.join(artifactDir, '_archive'),
});

const reducer = require(path.resolve(
  '.opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs',
));
const result = reducer.reduceReviewState(specFolder, {
  write: true,
  lenient: false,
  createMissingAnchors: false,
  emitResourceMap: process.argv.includes('--emit-resource-map'),
});

process.stdout.write(`${JSON.stringify({
  registryPath: result.registryPath,
  dashboardPath: result.dashboardPath,
  strategyPath: result.strategyPath,
  openFindingsCount: result.registry.openFindingsCount,
  findingsBySeverity: result.registry.findingsBySeverity,
  convergenceScore: result.registry.convergenceScore,
  corruptionCount: result.corruptionWarnings.length,
  resourceMapSkipped: result.resourceMapSkipped,
  resourceMapSkipReason: result.resourceMapSkipReason,
}, null, 2)}\n`);
