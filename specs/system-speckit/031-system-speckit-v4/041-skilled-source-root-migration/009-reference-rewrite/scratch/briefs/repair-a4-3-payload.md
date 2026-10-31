## Edit 1

File: `.skilled/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs`

OLD:

~~~~text
    .join('/');
  return /^(\.\/)?\.(opencode|claude)\/agents\/[^/]+\.md$/.test(normalized)
    || /^(\.\/)?\.(?:skilled|opencode)\/agents\/[^/]+\.toml$/.test(normalized);
~~~~

NEW:

~~~~text
    .join('/');
  return /^(\.\/)?\.(skilled|opencode|claude)\/agents\/[^/]+\.md$/.test(normalized)
    || /^(\.\/)?\.(?:skilled|opencode)\/agents\/[^/]+\.toml$/.test(normalized);
~~~~

## Edit 2

File: `.skilled/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs`

OLD:

~~~~text
    .join('/');
  return normalized.includes('.skilled/agents/') ? 'opencode-toml' : 'markdown';
}
~~~~

NEW:

~~~~text
    .join('/');
  return /\.(?:skilled|opencode)\/agents\//.test(normalized) ? 'opencode-toml' : 'markdown';
}
~~~~
