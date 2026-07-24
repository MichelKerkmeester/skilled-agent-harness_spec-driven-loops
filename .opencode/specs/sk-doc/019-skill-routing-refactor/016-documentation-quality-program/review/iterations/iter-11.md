# Iteration 11: code READMEs — sk-prompt, advisor, mcp-tooling, code-graph, cli, mcp-code-mode

> dimension: accuracy | model: gpt-5.6-sol effort=high tier=fast | sandbox: read-only
> status: 0 | timedOut: false

- **[P1] SWE 1.6 eval-loop validation command targets a removed eval-rig**

  `.opencode/skills/sk-prompt/prompt-models/benchmarks/001-swe-1.6-eval-loop/scripts/README.md:31`

  Evidence: The advertised `node scripts/loop.cjs --mock --max-iters 2` loads `../002-eval-rig` through `loop.cjs:27` and `score-variant.cjs:30-32`. No `benchmarks/002-eval-rig/` directory exists; the current top-level directories are `001-swe-1.6-eval-loop`, `002-swe-1.6-extraction-rerun`, and `003-minimax-prompt-framework`.

  Fix: Restore the shared eval-rig at the expected location or update `RIG_ROOT` and all consumers to its current location before presenting this as a working validation command.

- **[P1] Extraction-rerun validation command fails on two stale package paths**

  `.opencode/skills/sk-prompt/prompt-models/benchmarks/002-swe-1.6-extraction-rerun/scripts/README.md:31`

  Evidence: `confirm-variant.cjs:26-31` requires modules from sibling directories named `003-eval-loop` and `002-eval-rig`; neither directory exists. Module loading therefore fails before `--mock` can exercise the confirmation pipeline.

  Fix: Point `EVAL_PACKET` at the current SWE loop package and restore or retarget `RIG_PACKET`; remove the validation claim until the command runs against the current layout.

- **[P1] Both eval-loop READMEs document exit codes the loops do not emit**

  `.opencode/skills/sk-prompt/prompt-models/benchmarks/001-swe-1.6-eval-loop/scripts/README.md:35`  
  `.opencode/skills/sk-prompt/prompt-models/benchmarks/003-minimax-prompt-framework/eval-loop/scripts/README.md:36`

  Evidence: Both `loop.cjs` implementations break on convergence or mutation exhaustion, write synthesis, and return naturally—exit `0`. Reaching `--max-iters` also returns `0`, not `1`. Exit `1` is used for a rejected iteration-one sanity gate; exit `2` is pause; uncaught failures exit `3`.

  Fix: Document `0` as normal loop completion, including convergence, exhaustion, and budget termination; document `1` as sanity-gate rejection, `2` as pause, and `3` as fatal error.

- **[P1] Code-graph doctor README names consumers that never call this script**

  `.opencode/skills/system-code-graph/scripts/README.md:30`

  Evidence: No reference to `system-code-graph/scripts/doctor.sh` exists under `.opencode/commands/doctor/`. `mcp-doctor.sh:367-455` implements its own `diagnose_mk_code_index()` checks, while `_routes.yaml:83-100` routes code-graph diagnostics through MCP/CLI status tools.

  Fix: Describe `doctor.sh` as a standalone operator check. State that `/doctor` uses separate code-graph diagnostics rather than claiming it invokes this script.

- **[P1] Node ABI warning is described as install-time but is not wired into installation**

  `.opencode/skills/mcp-code-mode/mcp-server/scripts/README.md:3`

  Evidence: `mcp-server/package.json` does not exist or appear in `git ls-files`, and repository-wide search found no non-documentation caller of `scripts/check-node.cjs`. The script therefore cannot run as an npm install hook in the checked-in tree.

  Fix: Restore a package manifest with an install/postinstall entry or invoke `check-node.cjs` from the actual installer. Otherwise describe it as a manual diagnostic.

- **[P2] Figma README incorrectly says every executable script sources `_common.sh`**

  `.opencode/skills/mcp-tooling/mcp-figma/scripts/README.md:12`

  Evidence: `print-utcp-snippets.sh` does not source `_common.sh`; `rg -n source scripts/*.sh` confirms only the operational scripts do.

  Fix: Exclude both `_common.sh` and `print-utcp-snippets.sh` from that statement.

- **[P2] Chrome overview incorrectly attributes installation to the read-only doctor**

  `.opencode/skills/mcp-tooling/mcp-chrome-devtools/scripts/README.md:12`

  Evidence: It says both scripts “install and verify” `bdg`, but `doctor.sh` only probes `bdg` directly or through `npx --no-install`; `install.sh:232` is the only script that runs `npm install -g`.

  Fix: Say `install.sh` installs and verifies `bdg`, while `doctor.sh` reports whether it is already resolvable.

Broken-link check: all relative Markdown link targets across the 34 scoped READMEs resolved. Sampled JavaScript passed `node --check`; sampled shell scripts passed `bash -n`.

Adjacent observations: none.
