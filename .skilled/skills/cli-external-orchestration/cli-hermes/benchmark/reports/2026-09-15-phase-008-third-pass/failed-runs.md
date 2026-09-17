# Failed Runs

_Derived after the fact from this run's stored record, not written at run time._

> cli-hermes · live and hermetic · cli-pi orchestrator on llmgateway/deepseek-v4.1-flash (--thinking high) · sessions on glm-5.3-flash · phase-008-third-pass

One scenario ended this pass at FAIL. Four others failed on a first attempt and passed once the cause was isolated; they are recorded here because each isolation changed either the product or the scenario.

## HERMES-010 — cross-model validation pair (FAIL)

- **Observed**: `deepseek-v4.1-flash` answered `--yolo`; `glm-5.3-flash` answered `--dangerously-skip-permissions`, which is Claude Code's flag rather than Hermes's. Both exited 0 through the identical dispatch shape, each with its own session id.
- **Verdict rule**: the scenario fails when the two answers disagree, and its objective states that a disagreement is a model signal rather than a transport artefact. The transport held, so the verdict stands as a model-quality observation.
- **Stability note**: the same model answered `--yolo` correctly in the second pass, so this is non-determinism rather than a fixed wrong belief.
- **Not actioned**: nothing in the packet changes for this. A model that misremembers another runtime's flag is what cross-validation is for.

## First-attempt failures, resolved

### HERMES-014 — git advisory (real defect, fixed)

Two separate causes, found one after the other. The first attempt used `--only .opencode` without creating an untracked file in that scope, so the rule had nothing to report and was correctly silent; the scenario now creates its own probe file. The same attempt also met `fatal: Unable to create '.git/index.lock'` from a background fsmonitor daemon, so the git command's own exit code is now outside the contract. With the condition satisfied the advisory still did not arrive, which exposed the defect: the advisory was computed in `pre_tool_call` and stashed under an exact command-string key for `transform_tool_result` to pop, and that hand-off does not survive a live session. The core now runs inside the transform hook.

### HERMES-029 — vision evidence (real defect, fixed)

The first attempt returned `NO_EVIDENCE`. The sk-vision core makes a real vision-model call, about 12.5 s on its own against the plugin's 15-second core budget, so under concurrent load its advisory was lost. It also ran on `pre_tool_call`, the one hook Hermes fails closed on timeout, so a slow core risked blocking the vision tool outright rather than merely dropping guidance. The core now runs inside `transform_tool_result`, which fails open, on its own 25-second budget.

### HERMES-017 — skills listing (stale contract, corrected)

The scenario asserted that `hermes skills list` never shows project skills. It now shows 61 of the 68 generated copies as `local` rows, the seven absences being exactly the quarantined ones. The earlier reading came from the symlink design, under which every skill was quarantined and therefore excluded from the index. The scenario's own FAIL clause had predicted this boundary change. Correcting it also overturned a second claim in the packet: a quarantined copy does not stay reachable through `-s`, it fails with `Unknown skill(s)` and exit 1.

### HERMES-013 and HERMES-027 — environment, not product

`HERMES-013` hit the turn cap correctly and then stalled on the post-cap summary stream while three Hermes sessions shared the gateway; a serial rerun passed in 48 s with both required log lines. `HERMES-027` answered `NO_ADVISORIES` inside an orchestrated child dispatch, which is correct behavior: the worktree guard deliberately stays silent for a child expected to share its parent's tree. Both scenarios now record the precondition.
