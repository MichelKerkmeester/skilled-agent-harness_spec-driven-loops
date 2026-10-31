## Edit 1

File: `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/alignment-validator.ts`

OLD:

~~~~text
  const opencodeFiles = normalizedFiles.filter((f) =>
    f.includes('.opencode/') || f.includes('/.opencode/')
  );
~~~~

NEW:

~~~~text
  const opencodeFiles = normalizedFiles.filter((f) =>
    /\.(?:skilled|opencode)\//.test(f)
  );
~~~~

## Edit 2

File: `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/alignment-validator.ts`

OLD:

~~~~text
  for (const [subpath, patterns] of Object.entries(ALIGNMENT_CONFIG.INFRASTRUCTURE_PATTERNS)) {
    const matchingFiles = opencodeFiles.filter((f) => f.includes(`.opencode/${subpath}`));
    if (matchingFiles.length > 0) {
~~~~

NEW:

~~~~text
  for (const [subpath, patterns] of Object.entries(ALIGNMENT_CONFIG.INFRASTRUCTURE_PATTERNS)) {
    const matchingFiles = opencodeFiles.filter((f) => f.includes(`.skilled/${subpath}`) || f.includes(`.opencode/${subpath}`));
    if (matchingFiles.length > 0) {
~~~~
