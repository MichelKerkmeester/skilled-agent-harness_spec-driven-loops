# Iteration 19: HVR compliance + adversarial header re-check

> dimension: hvr+correctness | model: gpt-5.6-sol effort=high tier=fast | sandbox: read-only
> status: 0 | timedOut: false

- **[P1] Rewritten skill READMEs retain Oxford commas**
  
  `.opencode/skills/sk-doc/create-command/README.md:12`  
  `.opencode/skills/sk-doc/create-agent/README.md:65`  
  `.opencode/skills/sk-doc/create-manual-testing-playbook/README.md:68`
  
  Evidence: Added prose includes “frontmatter, gates, and structure”, “anti-patterns, and related resources” and “its feature set, and whether”. These directly violate the Oxford-comma ban in `sk-doc/shared/references/hvr-rules.md:112` and the phase acceptance criterion.
  
  Fix: Remove the comma before the final `and`, then sweep all 14 rewritten skill READMEs for `, and` and `, or`.

- **[P1] Newly authored code READMEs also contain Oxford commas**
  
  `.opencode/skills/cli-external-orchestration/cli-opencode/scripts/hooks/codex/README.md:24`  
  `.opencode/skills/mcp-tooling/mcp-figma/scripts/README.md:12`  
  `.opencode/skills/sk-design/design-mcp-open-design/tests/README.md:12`
  
  Evidence: These added files contain unambiguous serial lists such as “setup, connect, daemon, and diagnostic scripts” and “the live-transport capability check, and return reconciliation”. This contradicts the program’s HVR-clean claim for the code README batches.
  
  Fix: Remove the serial comma from each inline list and run the same check across all 124 added READMEs.

- **[P1] Uppercase transform mangled two additional case-sensitive path tokens**
  
  `.opencode/skills/sk-doc/create-benchmark/references/skill-benchmark/skill-benchmark-storage-guide.md:62`  
  `.opencode/skills/sk-doc/create-benchmark/references/skill-benchmark/skill-benchmark-storage-guide.md:142`
  
  Evidence: The transform changed `benchmark/` to `BENCHMARK/` and `.md` to `.MD`. The body immediately below still names the real directory and extension as `benchmark/` and `.md`. `git diff` confirms these were header-only case transformations.
  
  Fix: Preserve the identifiers with code spans:
  
  ```markdown
  ## 2. THE HUB `benchmark/` TREE
  ## 5. BOUNDARY: THE REPORT `.md` IS RENDERER-OWNED
  ```

Verified clean in scope: no introduced em dashes or semicolons were found in the 124 added READMEs or added lines of the 14 skill READMEs.

Review verdict: CONDITIONAL
