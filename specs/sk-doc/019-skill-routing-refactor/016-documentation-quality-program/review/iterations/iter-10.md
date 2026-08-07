# Iteration 10: code READMEs — system-spec-kit + sk-code

> dimension: accuracy | model: gpt-5.6-sol effort=high tier=fast | sandbox: read-only
> status: 0 | timedOut: false

- **[P0] Validation commands cannot run from the documented directory**

  `.opencode/skills/system-spec-kit/mcp-server/api/README.md:66`  
  `.opencode/skills/system-spec-kit/mcp-server/configs/README.md:82`

  Evidence: Both instruct running `npm test` from the repository root. The root `package.json` has no `test` script; executing the API command returned `npm error Missing script: "test"`.

  Fix: Run each test from its owning package, e.g. `cd .opencode/skills/system-spec-kit/scripts && npx vitest run tests/import-policy-rules.vitest.ts --config ../mcp-server/vitest.config.ts --root .`, and `cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/config-cognitive.vitest.ts`.

- **[P0] Hook-support README points to a nonexistent test suite**

  `.opencode/skills/system-spec-kit/mcp-server/tests/_support/hooks/README.md:30`

  Evidence: The documented target `tests/hooks-runtime-detection.vitest.ts` does not exist. `rg` shows the replay harness is actually imported by `tests/hook-session-stop-replay.vitest.ts`.

  Fix: Replace the command with `npx vitest run tests/hook-session-stop-replay.vitest.ts`, or add the missing suite if a separate runtime-detection test was intended.

- **[P0] Local-LLM README contains multiple stale or broken source references**

  `.opencode/skills/system-spec-kit/manual-testing-playbook/local-llm-query-intelligence/README.md:112`

  Evidence: The README claims 10 Vitest files and 53 tests, but the directory contains five `*.vitest.ts` files and 21 direct `it`/`test` declarations. `ollama-quality.vitest.ts`, `shared/embeddings/causal-graph-db.ts`, and `.vscode/mcp.json` do not exist. Line 118 also lists `opencode.json` twice.

  Fix: Recompute the test inventory, remove the deleted quality-suite reference, point causal-graph documentation at the current implementation, and list only MCP configuration files that exist.

- **[P1] Loader README documents an API and native-capture path that do not exist**

  `.opencode/skills/system-spec-kit/scripts/loaders/README.md:14`

  Evidence: Lines 21–29 document `preferredCaptureSource`, `SYSTEM_SPEC_KIT_CAPTURE_SOURCE`, native fallback, `loadData()`, `loadFromJsonFile()`, and `loadFromNativeCapture()`. Actual `data-loader.ts:55-70` accepts only `dataFile` and `specFolderArg`, requires structured JSON, and throws `NO_DATA_FILE` when absent. `index.ts` exports only `loadCollectedData`.

  Fix: Rewrite the overview, I/O table, and entrypoints around `loadCollectedData()` and structured JSON input, or restore the documented capture API.

- **[P1] Doctor scenario inventory disagrees with the files on disk**

  `.opencode/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md:15`

  Evidence: `find` returns 20 scenario Markdown files, excluding the README—not 25. There are no three code-graph scenario files or `/doctor:mcp` scenario. The folder has six doctor-update files and three version-migration files, while lines 21–22 claim seven and two. Line 31 also says filenames use `NNN-doctor-...`, but the actual filenames have no numeric prefix.

  Fix: Regenerate the counts and categories from the current 20 files and document the real naming convention; otherwise add the missing scenarios.

- **[P1] Four Webflow asset READMEs assign the OPENCODE surface**

  `.opencode/skills/sk-code/code-webflow/assets/integrations/README.md:80`  
  `.opencode/skills/sk-code/code-webflow/assets/patterns/README.md:82`  
  `.opencode/skills/sk-code/code-webflow/assets/scripts/README.md:81`  
  `.opencode/skills/sk-code/code-webflow/assets/templates/README.md:83`

  Evidence: Each declares `sk-code surface | OPENCODE` and applies TypeScript/Python/Shell/config conventions. `mode-registry.json:63-72` classifies their parent packet as the `code-webflow` surface, and the files themselves contain browser, DOM, Webflow, CSS, and HTML assets.

  Fix: Change the surface to `WEBFLOW`, describe the applicable frontend/browser conventions, and remove the nearby claims that these folders route reviewers to OpenCode-specific checks.

- **[P1] Spec-script dependency rule contradicts both the README and implementation**

  `.opencode/skills/system-spec-kit/scripts/spec/README.md:86`

  Evidence: Line 86 says spec scripts must not depend on generated `dist/` output. Line 96 says `validate.sh` trusts compiled MCP-server output after a freshness check. `validate.sh:23-32` defines several `dist` paths, and `validate.sh:985-1014` executes the compiled validation orchestrator.

  Fix: Narrow the rule to prohibit source modules from importing generated output while explicitly allowing shell entrypoints to execute freshness-verified compiled validators.

Adjacent observations: none. A mechanical check of Markdown link targets across all 47 changed READMEs found no missing link destinations.

Review status: REQUESTED_CHANGES
