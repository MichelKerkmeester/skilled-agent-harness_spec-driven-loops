## Edit 1

File: `.skilled/skills/system-spec-kit/runtime/lib/utils/index-scope.ts`

OLD:

~~~~text
    ? ['\\.opencode/specs', 'specs']
    : [`\\.opencode/${folder}`];
  return folderRoots.some(root =>
~~~~

NEW:

~~~~text
    ? ['\\.opencode/specs', 'specs']
    : [`\\.(?:skilled|opencode)/${folder}`];
  return folderRoots.some(root =>
~~~~
