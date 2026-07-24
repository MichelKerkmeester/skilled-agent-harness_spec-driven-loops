# Iteration 4: sk-code mode-registry.json + mcp-tooling leaf-manifest.json data

> dimension: correctness+regression | model: gpt-5.6-sol effort=high tier=fast | sandbox: read-only
> status: 0 | timedOut: false

- **[P1] Lowercase manifest entry no longer matches the ClickUp router’s resource identity**

  [.opencode/skills/mcp-tooling/leaf-manifest.json:29](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0097-sk-doc-documentation-quality/.opencode/skills/mcp-tooling/leaf-manifest.json:29)

  **Evidence:** The manifest now declares `references/install-guide.md`, while [mcp-click-up/SKILL.md:173](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/0097-sk-doc-documentation-quality/.opencode/skills/mcp-tooling/mcp-click-up/SKILL.md:173) still routes INSTALL intent to `references/INSTALL-GUIDE.md`. Calling the actual resource-contract consumer produced:

  ```text
  INSTALL-GUIDE.md → pairs: [], unresolved: ["mcp-click-up/references/INSTALL-GUIDE.md"]
  install-guide.md → pairs: [{workflowMode:"mcp-click-up", leafResourceId:"references/install-guide.md"}], unresolved: []
  ```

  No `leaf-aliases.json` bridges the names. `git ls-tree HEAD` also shows both case variants tracked with the same blob, so this was not a completed rename. The local byte-regeneration check passes only because this case-insensitive checkout exposes one directory entry; a case-sensitive checkout will enumerate both tracked files.

  **Fix:** Complete the rename: remove the uppercase Git entry, update every `references/INSTALL-GUIDE.md` router/link reference to `references/install-guide.md`, regenerate the manifest, and run `--check` on a case-sensitive CI filesystem.

Adjacent observations: `sk-code`’s `resourceContractVersion: 1` matches its manifest and the consumer contract constant; both reviewed JSON files parse successfully.

Review status: REQUESTED_CHANGES
