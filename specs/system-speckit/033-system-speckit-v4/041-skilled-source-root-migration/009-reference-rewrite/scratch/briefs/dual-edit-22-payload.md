## Edit 1

File: `.skilled/skills/system-spec-kit/runtime/lib/validation/generated-metadata-integrity.ts`

OLD:

~~~~text
  }
  if (/^(\.opencode\/)?specs\//.test(normalized)) {
    return false;
~~~~

NEW:

~~~~text
  }
  if (/^(\.(?:skilled|opencode)\/)?specs\//.test(normalized)) {
    return false;
~~~~
