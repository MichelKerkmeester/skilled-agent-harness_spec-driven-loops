# Iteration 5: header-uppercase transform — did it mangle anything?

> dimension: correctness | model: gpt-5.6-sol effort=high tier=fast | sandbox: read-only
> status: 0 | timedOut: false

- **[P0] Backtick spans were replaced with literal NUL bytes**

  `.opencode/skills/sk-design/design-md-generator/references/writing-style-guide.md:149`  
  `.opencode/skills/sk-prompt/prompt-models/references/vision-audit-benchmark.md:36`

  Evidence: The transform changed ``(`## Tokens — Colors`)`` and `` `--file` `` into `NUL 0 NUL`. `od` confirms byte sequences `00 30 00`; both Markdown files are consequently detected as generic `data`.

  Fix: Restore:

  ```markdown
  ## 6. COLOUR NAMING (`## Tokens — Colors`)
  ## 2. TRANSPORT (direct API — opencode `--file` is broken here)
  ```

- **[P1] CamelCase Motion API identifiers were uppercased into different names**

  `.opencode/skills/sk-code/code-webflow/references/animation/animate-and-timelines.md:72`  
  `.opencode/skills/sk-code/code-webflow/references/animation/animate-and-timelines.md:111`

  Evidence: `repeatType` became `REPEATTYPE`, and `animateMini` became `ANIMATEMINI`. The body still imports and calls `animateMini` at lines 116–118. This violates the stated internal-cap identifier exemption.

  Fix: Preserve or code-format the identifiers:

  ```markdown
  ## 3. animate(target, keyframes, options) - DURATION, EASING, DELAY, REPEAT, `repeatType`
  ## 5. `animateMini` FOR TREE-SHAKABLE BUNDLES
  ```

- **[P1] Canonical file, tool, and skill identifiers were uppercased as prose**

  `.opencode/skills/sk-design/design-interface/references/design-process/resource-loading-notes.md:24`  
  `.opencode/skills/mcp-tooling/mcp-figma/references/figma-cli-reference.md:354`  
  `.opencode/skills/sk-prompt/prompt-improve/references/design-generation-patterns.md:100`  
  `.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk-code-known-deviations.md:105`

  Evidence: The transform produced `CONTEXT-LOADING-CONTRACT.MD`, `FIGMA-DS-CLI`, and `SK-CODE`. The actual filename exists as `context-loading-contract.md`; the Figma document repeatedly identifies `figma-ds-cli` as the canonical binary; surrounding documents consistently name the skill `sk-code`.

  Fix: Wrap these identifiers in code spans while uppercasing only prose: `` `context-loading-contract.md` ``, `` `figma-ds-cli` ``, and `` `sk-code` ``.

Verified clean: all 11 transformed H2s in `code-opencode/SKILL.md` and `create-flowchart/SKILL.md`; no changed links, URLs, ordinary parentheticals, or `name(...)` signatures were mangled.

Adjacent observations: `validate_document.py` separately reports a missing `OVERVIEW` in `vision-audit-benchmark.md`; that predates this pass’s header-transform focus.
