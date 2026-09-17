## Edit 1

File: `.skilled/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs`

OLD:

~~~~text
  return /^(\.\/)?\.(opencode|claude)\/agents\/[^/]+\.md$/.test(normalized)
    || /^(\.\/)?\.skilled\/agents\/[^/]+\.toml$/.test(normalized);
}
~~~~

NEW:

~~~~text
  return /^(\.\/)?\.(opencode|claude)\/agents\/[^/]+\.md$/.test(normalized)
    || /^(\.\/)?\.(?:skilled|opencode)\/agents\/[^/]+\.toml$/.test(normalized);
}
~~~~
