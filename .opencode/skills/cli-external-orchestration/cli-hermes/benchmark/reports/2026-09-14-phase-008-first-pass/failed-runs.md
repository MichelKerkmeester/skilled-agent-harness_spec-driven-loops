# Failed Runs

_Derived after the fact from this run's stored record, not written at run time._

> cli-hermes · live · claude · glm-5.3-flash (llmgateway, --reasoning none) · phase-008-first-pass

Two scenarios recorded a FAIL verdict across 19 live behaviors (17 PASS, 2 FAIL) plus 14 hermetic cells recorded SKIP.

## HERMES-009 -- second template round trip

- **Command**: the sanctioned headless shape with `--query-file -` fed `.hermes/prompts/create-manual-testing-playbook.md` plus a two-line bounded request.
- **Observed**: exit 0 after 115 s, then exit 0 after 114 s on a re-run with `--max-turns` raised from 8 to 12 and `--run-budget` from 200 to 240. **Zero bytes on stdout** both times; stderr carried only `session_id:`.
- **Located cause**: `~/.hermes/logs/agent.log` for session `20260914_221926_9196e2` records `Tool tool_call returned error (0.00s): {"error": "'read_file' is not a deferrable tool ...`, then a `same_tool_failure_warning` loop, then `Turn ended with pending tool result (agent may appear stuck). Turn ended: reason=unknown`.
- **Not a transport failure**: `HERMES-008` runs the identical shape against a smaller canonical command file and returns the expected two lines.

## HERMES-014 -- git preflight advisory delivery

- **Command**: a `git -C <scratch-repo> commit --only src` issued through a Hermes terminal tool with `HERMES_ENABLE_PROJECT_PLUGINS=1` and `--yolo`.
- **Observed**: exit 0 in 23 s; the commit succeeded and the session reported `No advisory or warning text accompanied it`. The plugin was demonstrably loaded: `~/.hermes/logs/agent.log` carries `Session plugin prompt section: id=repo-guards-session-context` for session `20260914_222302_c71c2a`.
- **Located cause**, two layers. The wired core, `.opencode/hooks/dispatch/devin/dispatch-preflight-lint.mjs`, returns empty stdout with status 0 for both `git push origin feature/probe` and `git commit --only src -m x`; it is the dispatch preflight, not the sk-git advisory core. And `pre_tool_call` in `.hermes/plugins/repo-guards/__init__.py` forwards a message only when `output.get("permissionDecision") == "deny"`, so a warning-severity advisory could not reach a session even if the core produced one.
- **Positive control**: the same core, given a `cli-hermes` dispatch that violates a blocking hard rule, returns a full `permissionDecision: deny` payload, so the deny path itself works.
