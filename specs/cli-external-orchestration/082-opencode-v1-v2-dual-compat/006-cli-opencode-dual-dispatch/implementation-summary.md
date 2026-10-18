---
title: "Implementation Summary"
description: "The deep-loop runtime now reads the OpenCode major from parsed --version output and builds the matching argv: today's argv on v1, run --standalone with model#variant on v2, and a fail-closed refusal for native lineages on v2."
trigger_phrases:
  - "cli opencode dual dispatch implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/006-cli-opencode-dual-dispatch"
    last_updated_at: "2026-10-18T21:40:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the phase docs from the scratch evidence ledger"
    next_safe_action: "Phase complete. Start phase 007, install guidance and setup helper"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs"
      - ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts"
      - ".skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-cli-opencode-dual-dispatch"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-cli-opencode-dual-dispatch |
| **Status** | Complete |
| **Completed** | 2026-10-18 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The deep-loop runtime no longer assumes the binary is called `opencode` or that it speaks v1. A new resolver finds the binary, runs its `--version` through an argv array, parses the output with the same rule as the dispatch guard, and refuses when the output does not parse. The two builders then pick a renderer from the parsed major.

### Phase 6: cli-opencode-dual-dispatch

- **Resolver.** `$OPENCODE_BIN` wins when set, with no fallback. Otherwise PATH is walked in order, and inside each directory `opencode2` comes before `opencode`. A result is cached by realpath, size and mtime, and a refusal is never cached. The refusal names both binaries and carries the probe output.
- **cli-opencode builder.** v1 keeps today's argv exactly. v2 gets `run --standalone -m <model>#<variant> --format json`, with `--auto` for danger-full-access, and no `--dir`, `--variant`, `--command`, `--pure`, `--share`, `--port` or `--dangerously-skip-permissions`. The directory travels as the spawn cwd, which the dispatch now honours.
- **Native builder.** v1 keeps today's argv. v2 refuses, because v2 `run` has no `--command` and a live probe showed it does not expand a slash message.
- **Availability check.** It goes through the resolver, so `opencode2` alone counts as available.
- **SKILL.md.** The version guard accepts both majors and picks the same binary as the runtime. The default invocation lines state both renderings.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs` | Created | The resolver: binary order, probe, parse, refusal and cache. |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modified | Both renderers, the native v2 refusal, the availability check, the dispatch cwd and the binary identity for a path-qualified `OPENCODE_BIN`. |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts` | Created | 23 cases: the P, A and D rows, the adversarial table, PATH order, the cache and parser parity with the guard's resolver. |
| `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` | Modified | The version guard and the two default invocation lines. |
| Five deep-loop test files | Modified | Each stub named `opencode` answers `--version`, and four native tests get a v1 stub env (decisions 11 and 18). |
| `plan.md` | Modified | The v2 `--auto` flag and the per-directory PATH order. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator took the baseline and ran one live v2 probe that settled the working directory, the slash-message route and the child environment. Luna wrote the red suite, and the orchestrator recorded 21 of 23 cases failing first. Luna then wrote the resolver and the renderers, and DeepSeek wrote the doc lines. A cross-family review found one P1 and two P2s in each lane. All six were confirmed and fixed, and so was a stress contract the first full run caught. The orchestrator reran both suites, ran one builder smoke dispatch per version, and watched the process list during the full suite to show that no test reached a real binary.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| PATH order first, `opencode2` before `opencode` only inside one directory | The literal order would have made the existing tests skip their stub and spawn this machine's real `opencode2`, with a model call. Side-by-side installs in one directory still resolve to v2. |
| Every test stub named `opencode` answers `--version` | The resolver refuses output that does not parse (L3), so a silent stub would fail closed. |
| v2 danger-full-access maps to `--auto` | v2 `run` lists `--auto` and not `--dangerously-skip-permissions`. On v1 the latter is a hidden alias of `--auto`, so the v1 argv stays unchanged. |
| Native lineages refuse on v2 | A bare `/probe/echo` message reached v2 as raw text, and the model only found the command file by searching with its tools (L4). |
| The resolver is a separate CommonJS module | The builders are synchronous CommonJS. The suite imports the guard's ES-module parser and asserts both agree on every fixture string, so no 005 file changed. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Deep-loop baseline (T001): `cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage` | 166 files, 2718 passed, 8 skipped (`scratch/deep-loop-suite-before.txt`) |
| Red run (T007): the new suite, before the change | 21 of 23 failed first; D1 and D3 pin today's argv (`scratch/red-first-failures.txt`) |
| New suite after the change (T013) | 23 of 23 (`scratch/green-run.txt`), and 42 passed with the stress fanout suite after the fixes |
| Full deep-loop suite after the change (T014) | 167 files, 2741 passed, 0 failed, 8 skipped (`scratch/deep-loop-suite-after.txt`) |
| Smoke dispatch on 1.19.3 (T015): the builder, exit status, token and lineage file | Exit 0, token, lineage file, 0.002699 USD (`scratch/smoke/v1`) |
| Smoke dispatch on 2.0.32 (T016): the builder with `--standalone`, exit status, token and lineage file | Exit 0, token, lineage file, 0.001162 USD (`scratch/smoke/v2`) |
| Child environment (T017): fixture plugin log line `AI_SESSION_CHILD=1` | Logged in `setup()` and `session.prompt` (`scratch/smoke/v2/smoke-v2-plugin.jsonl`) |
| No real binary reached by the suite | 0 watcher lines during the final run (`scratch/real-binary-watch.txt`) |
| Static checks CHK-004 to CHK-006, CHK-010, CHK-011, CHK-030, CHK-031, CHK-041 | All met (`scratch/static-checks.txt`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Native lineages stop on a side-by-side install.** With both binaries in `~/.local/bin`, the resolver picks `opencode2`, so every native lineage refuses until `OPENCODE_BIN=opencode` is set. The v2 route, `session.command`, needs a session id and is outside this phase.
2. **Every cli-opencode lineage on this machine now goes to v2.** That follows the frozen binary order. Set `OPENCODE_BIN=opencode` to keep v1.
3. **v2 has no opencode-go model here.** The runtime default `opencode-go/deepseek-v4.1-flash` fails on v2 until that credential is added to v2. Carried to 007 (decision 12).
4. **v2 wraps the prompt in quotes.** A v2 lineage prompt reaches the model inside literal double quotes. The model still followed it. Carried to 011 (decision 6).
5. **Spawn by name.** The dispatch spawns the resolved name, not the realpath, so a binary swapped between the build and the spawn would run unprobed. The window is the length of one build.
<!-- /ANCHOR:limitations -->

---
