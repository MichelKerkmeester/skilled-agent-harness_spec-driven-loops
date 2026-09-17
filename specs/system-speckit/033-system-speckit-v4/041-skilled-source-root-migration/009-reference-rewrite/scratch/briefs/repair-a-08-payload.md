## Edit 1

File: `.skilled/skills/system-spec-kit/runtime/lib/utils/index-scope.ts`

OLD:

~~~~text
  const normalizedPath = normalizeIndexScopePath(filePath);
  const match = normalizedPath.match(/(?:^|\/)\.skilled\/skills(?:\/([^/]+))?(?:\/|$)/i);
  return match ? (match[1] ?? null) : undefined;
~~~~

NEW:

~~~~text
  const normalizedPath = normalizeIndexScopePath(filePath);
  const match = normalizedPath.match(/(?:^|\/)\.(?:skilled|opencode)\/skills(?:\/([^/]+))?(?:\/|$)/i);
  return match ? (match[1] ?? null) : undefined;
~~~~
