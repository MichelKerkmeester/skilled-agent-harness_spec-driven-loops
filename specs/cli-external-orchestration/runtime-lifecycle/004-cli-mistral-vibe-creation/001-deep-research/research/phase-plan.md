# Phase Plan: cli-mistral-vibe build

Ranked build phases for `004-cli-mistral-vibe-creation`, children 004 onward. Merged from both lineages' phase rankings (`lineages/*/research.md`), reshaped to the phase pattern the Hermes and DeepSeek Harness parents used. Every phase pins `vibe 3.1.2`.

| Phase | Folder | Focus | Handoff check | Depends on |
|---|---|---|---|---|
| 004 | `004-vibe-contract-pin/` | One authenticated print-mode dispatch with an isolated `VIBE_HOME`, capturing `export.json`, `--output json` and `streaming` payloads, the exit code, stdin behavior and the process name in the ancestor walk; a hand-written model row for each roster model | `evidence/` holds the export, both payloads and the exit code; open questions 1, 3, 4 and 7 are answered | Operator key in `MISTRAL_API_KEY` |
| 005 | `005-cli-mistral-vibe-skill-packet/` | Mode packet: `SKILL.md`, `ROUTER.md`, `hard-rules.json`, references (cli-reference, providers-and-models, runtime folder, hooks), prompt card | `hard-rules.json` parses and every rule names its check; `validate_document.py` reports 0 issues | 004 |
| 006 | `006-vibe-runtime-folder-and-mirrors/` | `.vibe/config.toml` with closed `allowed_models`, generated `agents/*.toml`, skills and prompts mirrors with `--check`, `SYNC.md` | `vibe config schema` accepts the config under `--trust`; each generator `--check` exits 0 | 005 |
| 007 | `007-dispatch-recognition-and-hard-rules/` | Dispatch preflight in `.skilled/hooks/dispatch/lib/` for `vibe -p`: isolated `VIBE_HOME`, `--output-dir`, roster model, no repo-root cwd | Each hard rule refuses its own violating command and accepts the documented shape | 005 |
| 008 | `008-vibe-repo-guards/` | Classify all 21 OpenCode plugins as hook, skill or not portable; port the deny-capable guards as strict `pre_tool` hooks and post-edit quality as a strict `post_tool` hook | The classification table covers 21 of 21; each ported guard blocks a crafted violation and allows a clean call; settles the hook wire format | 006 |
| 009 | `009-deep-loop-executor-kind/` | `cli-mistral-vibe` in `executor-config.ts`, `fanout-run.cjs` adapter, env allowlist, recursion guard, exit mapping, stress fixture and YAML branches | One lineage runs a research iteration end to end; exit 3 scores partial; executor unit and stress suites pass | 007 |
| 010 | `010-hub-registration-and-routing/` | Mode registry, hub router, advisor vocabulary, compiled routing, agent tables | The hub routes a "delegate to vibe" prompt to the mode at both routing stages | 009 |
| 011 | `011-vibe-context-and-goal-hooks/` | `session_start` hook carrying the packet goal slice and session context | A dispatch's first turn carries the goal slice; the fixture test passes | 008 |
| 012 | `012-playbook-docs-and-closeout/` | Manual-testing playbook, cross-runtime docs, feature catalog, recursive strict validation | `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` | 010, 011 |

## Deferred

- **ACP supervisor.** Optional second dispatch mode, worth building only after print mode is proven.
- **Session-relaunch loop.** Vibe has no idle or compaction event; only an outer supervisor could drive it.
- **Turn-stopping guards** (completion evidence, ask surface). No strict `post_agent`; not portable.
- **Sandbox mode.** No CLI or config field; the kind fails closed on a sandbox request.
