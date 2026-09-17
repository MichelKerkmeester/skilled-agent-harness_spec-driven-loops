## Edit 1

File: `.opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs`

OLD:

~~~~text
  WORKSPACE_ROOT,
  buildContract,
~~~~

NEW:

~~~~text
  WORKSPACE_ROOT,
  absolutePath,
  buildContract,
~~~~

## Edit 2

File: `.opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs`

OLD:

~~~~text
const PLACEHOLDER_PATTERN = /\[[A-Z][A-Z0-9_]*(?:[- ][A-Z0-9_]+)*\]/g;
const RELATIVE_PATH_PATTERN = /(?:^|["'`\s:=({])((?:\.opencode|specs)\/[^\s"'`)},]+(?:\.md\.tmpl|\.[A-Za-z0-9_-]+))/g;
const DECLARED_MODE_PATH_PATTERN = /(?:^|["'`\s:=({\[])((?:\.opencode\/|\.\.?\/|[A-Za-z0-9_-]+\/)[A-Za-z0-9_./-]+\.(?:md|ya?ml|json)(?:#[A-Za-z0-9_.-]+)?)/g;

function toPosixPath(inputPath) {
~~~~

NEW:

~~~~text
const PLACEHOLDER_PATTERN = /\[[A-Z][A-Z0-9_]*(?:[- ][A-Z0-9_]+)*\]/g;
const RELATIVE_PATH_PATTERN = /(?:^|["'`\s:=({])((?:\.opencode|\.skilled|specs)\/[^\s"'`)},]+(?:\.md\.tmpl|\.[A-Za-z0-9_-]+))/g;
const DECLARED_MODE_PATH_PATTERN = /(?:^|["'`\s:=({\[])((?:\.opencode\/|\.skilled\/|\.\.?\/|[A-Za-z0-9_-]+\/)[A-Za-z0-9_./-]+\.(?:md|ya?ml|json)(?:#[A-Za-z0-9_.-]+)?)/g;

// The source tree sits under .skilled or .opencode, and a checkout may link one name to
// the other, so a document may spell a source either way. Sources are keyed under one
// spelling: a document that names the other root then neither adds a source nor hides one,
// and a recorded digest matches a derived source whichever name each was written with.
const SOURCE_ROOT_PREFIX_PATTERN = /^\.(?:opencode|skilled)\//;

function isSourceRootPath(sourcePath) {
  return SOURCE_ROOT_PREFIX_PATTERN.test(sourcePath);
}

function sourceKey(sourcePath) {
  return sourcePath.replace(SOURCE_ROOT_PREFIX_PATTERN, '.opencode/');
}

function toPosixPath(inputPath) {
~~~~

## Edit 3

File: `.opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs`

OLD:

~~~~text
  return toPosixPath(path.relative(WORKSPACE_ROOT, inputPath));
}

function absolutePath(sourcePath) {
  return path.resolve(WORKSPACE_ROOT, sourcePath);
}
~~~~

NEW:

~~~~text
  return toPosixPath(path.relative(WORKSPACE_ROOT, inputPath));
}
~~~~

## Edit 4

File: `.opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs`

OLD:

~~~~text
function isAuthoritySource(sourcePath) {
  if (!sourcePath.startsWith('.opencode/')) return false;
  if (isNonAuthoritySource(sourcePath)) return false;
~~~~

NEW:

~~~~text
function isAuthoritySource(sourcePath) {
  if (!isSourceRootPath(sourcePath)) return false;
  if (isNonAuthoritySource(sourcePath)) return false;
~~~~

## Edit 5

File: `.opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs`

OLD:

~~~~text
  if (/\/SKILL\.md$/.test(sourcePath)) return true;
  if (/\.opencode\/commands\/deep\//.test(sourcePath)) return true;
  if (/\/references\/protocol\//.test(sourcePath)) return true;
~~~~

NEW:

~~~~text
  if (/\/SKILL\.md$/.test(sourcePath)) return true;
  if (/\.(?:opencode|skilled)\/commands\/deep\//.test(sourcePath)) return true;
  if (/\/references\/protocol\//.test(sourcePath)) return true;
~~~~

## Edit 6

File: `.opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs`

OLD:

~~~~text
  if (/\/assets\/prompt[-_]pack[-_][^/]+\.md\.tmpl$/.test(sourcePath)) return true;
  if (/^\.opencode\/agents\/[^/]+\.md$/.test(sourcePath)) return true;
  if (/\/mode-registry\.json$/.test(sourcePath)) return true;
~~~~

NEW:

~~~~text
  if (/\/assets\/prompt[-_]pack[-_][^/]+\.md\.tmpl$/.test(sourcePath)) return true;
  if (/^\.(?:opencode|skilled)\/agents\/[^/]+\.md$/.test(sourcePath)) return true;
  if (/\/mode-registry\.json$/.test(sourcePath)) return true;
~~~~

## Edit 7

File: `.opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs`

OLD:

~~~~text
  if (options.force) {
    if (!normalized.startsWith('.opencode/') || isNonAuthoritySource(normalized)) return;
    sources.add(normalized);
    return;
  }
  if (!isAuthoritySource(normalized)) return;
  sources.add(normalized);
}
~~~~

NEW:

~~~~text
  if (options.force) {
    if (!isSourceRootPath(normalized) || isNonAuthoritySource(normalized)) return;
    sources.add(sourceKey(normalized));
    return;
  }
  if (!isAuthoritySource(normalized)) return;
  sources.add(sourceKey(normalized));
}
~~~~

## Edit 8

File: `.opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs`

OLD:

~~~~text
  if (!normalized || /^[a-z][a-z0-9+.-]*:\/\//i.test(normalized)) return null;
  if (normalized.startsWith('.opencode/')) return path.posix.normalize(normalized);
  if (normalized.startsWith('/')) return null;
  return path.posix.normalize(path.posix.join(baseDir, normalized));
}
~~~~

NEW:

~~~~text
  if (!normalized || /^[a-z][a-z0-9+.-]*:\/\//i.test(normalized)) return null;
  if (isSourceRootPath(normalized)) return sourceKey(path.posix.normalize(normalized));
  if (normalized.startsWith('/')) return null;
  return sourceKey(path.posix.normalize(path.posix.join(baseDir, normalized)));
}
~~~~

## Edit 9

File: `.opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs`

OLD:

~~~~text
  for (const candidate of extractPathCandidates(yamlText)) {
    if (/^\.opencode\/agents\/[^/]+\.md$/.test(candidate)) {
      addAuthoritySource(sources, candidate);
~~~~

NEW:

~~~~text
  for (const candidate of extractPathCandidates(yamlText)) {
    if (/^\.(?:opencode|skilled)\/agents\/[^/]+\.md$/.test(candidate)) {
      addAuthoritySource(sources, candidate);
~~~~

## Edit 10

File: `.opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs`

OLD:

~~~~text
function addDeclaredModeSources(sources, definition) {
  const modeRoot = path.posix.dirname(definition.modeSkillPath);
  const expectedSources = new Set(definition.sourcePaths || []);
  addDeclaredModeAuthoritySources(sources, readText(definition.modeSkillPath), modeRoot, modeRoot, expectedSources);
~~~~

NEW:

~~~~text
function addDeclaredModeSources(sources, definition) {
  const modeRoot = path.posix.dirname(sourceKey(definition.modeSkillPath));
  const expectedSources = new Set((definition.sourcePaths || []).map(sourceKey));
  addDeclaredModeAuthoritySources(sources, readText(definition.modeSkillPath), modeRoot, modeRoot, expectedSources);
~~~~

## Edit 11

File: `.opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs`

OLD:

~~~~text
    readText(definition.agentPath),
    path.posix.dirname(definition.agentPath),
    modeRoot,
~~~~

NEW:

~~~~text
    readText(definition.agentPath),
    path.posix.dirname(sourceKey(definition.agentPath)),
    modeRoot,
~~~~

## Edit 12

File: `.opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs`

OLD:

~~~~text
function checkEnumeratedSourceGaps(command, header) {
  const recordedSources = new Set((header.sourceDigests || []).map((digest) => digest.path));
  const referencedSources = deriveAuthoritySources(command);
  return referencedSources
    .filter((sourcePath) => !recordedSources.has(sourcePath))
    .map((sourcePath) => driftFailure(
~~~~

NEW:

~~~~text
function checkEnumeratedSourceGaps(command, header) {
  const recordedSources = new Set((header.sourceDigests || []).map((digest) => sourceKey(digest.path)));
  const referencedSources = deriveAuthoritySources(command);
  return referencedSources
    .filter((sourcePath) => !recordedSources.has(sourceKey(sourcePath)))
    .map((sourcePath) => driftFailure(
~~~~
