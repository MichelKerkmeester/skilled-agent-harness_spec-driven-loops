# Iteration 007 — detection markers + command/agent hand-off (Facets 6+7)
_Executor: GLM-5.2, read-only; orchestrated by Opus._

## Iteration 7 findings — detection markers + command/agent hand-off

### A. Detection markers

**[P1] Council #27 CONFIRMED — bare extensions are not OPENCODE-surface markers**
- **code-opencode doc:** `SKILL.md:16` — "Detection markers: `.opencode/`, `SKILL.md`, `.cjs`/`.mjs`/`.ts`/`.py`/`.sh`, `graph-metadata`, `spec-folder`, `argparse`."
- **reality:** the canonical detection contract `shared/references/stack_detection.md:40-56` is unambiguous: the **surface** detector is path-only — "CWD under `.opencode/` OR any changed/target file under `.opencode/`". Extensions enter only at §3 (line 86), where they are a **language sub-detector** used to pick *which* language trio, never to decide OPENCODE vs WEBFLOW vs UNKNOWN. The bare-extension list matches *any* repo and would route a stray `src/foo.ts` to OPENCODE if it were a surface marker — which is exactly why §2's test-case table (lines 110) returns UNKNOWN for a root `package.json` with no `.opencode/` target.
- **recommendation:** rewrite `SKILL.md:16` to separate the two concerns: (1) surface trigger = path under `.opencode/` (canonical), (2) language sub-detection = the extension → trio map from `stack_detection.md` §3. Drop the false implication that `.ts`/`.py`/`.sh` are surface markers. This is a correctness defect that mis-attributes routing authority.

**[P2] Detection markers omit YAML — the command-execution stack is invisible**
- **code-opencode doc:** `SKILL.md:30` defines the CONFIG language as "JSON/JSONC descriptors" only; the marker list at line 16 mentions no YAML.
- **reality:** YAML is a first-class OpenCode-system-code authoring surface. `.opencode/commands/{deep,speckit,memory,doctor,create,design}/assets/*_{auto,confirm}.yaml` (≈44 files), `.opencode/commands/doctor/_routes.yaml`, and `design/assets/design_*_*.yaml` are load-bearing execution-path files that the `command_authoring.md` checklist itself treats as part of the command shape (lines 36, 47).
- **recommendation:** add a YAML row to the `stack_detection.md` §3 sub-detection table and a `references/yaml/` (or extend CONFIG to cover YAML) in `code-opencode/SKILL.md:30`. Without it, a YAML-command edit loads no language standard.

**[P3] Detection markers omit IPC socket artifacts and the daemon runtime**
- **code-opencode doc:** `SKILL.md:16` lists no `.sock`, no daemon/IPC markers.
- **reality:** `.opencode/bin/lib/launcher-ipc-bridge.cjs:13` defines `SOCKET_FILE_NAME = 'daemon-ipc.sock'`; `getSocketPath` / `SOCKET_PATH` / `socketPath` appear across `bin/lib/*.cjs`. The three daemon CLIs (`spec-memory.cjs`, `code-index.cjs`, `skill-advisor.cjs`) own a `.sock` IPC transport. This is core system code that code-opencode is supposed to govern but its detection/standards layer never names.
- **recommendation:** add daemon/IPC as a named subsystem in the OPENCODE-surface evidence (markers + a reference note). The spec charter itself flags "`.sock` IPC" as a missing stack (facet 6, line 75).

### Council-seed verification (#27)
**CONFIRMED.** The bare extensions (`.cjs`/`.mjs`/`.ts`/`.py`/`.sh`) at `code-opencode/SKILL.md:16` are **not** OPENCODE-surface markers per the canonical contract. They are language sub-detectors (`stack_detection.md:86-96`). Listing them as surface markers overclaims and contradicts the router's own §4 test cases (lines 106-111), which return UNKNOWN for generic-Node repos. The path marker `.opencode/` is the sole authoritative surface trigger; `SKILL.md` / `graph-metadata` / `spec-folder` / `argparse` are corroborating content markers, not surface triggers either.

### Missing-stack inventory (real `.opencode` stacks the detection markers omit)
| Stack | Evidence | Status in code-opencode |
|---|---|---|
| YAML command execution paths | `.opencode/commands/*/assets/*.yaml` (≈44 files), `doctor/_routes.yaml` | **Absent** — CONFIG covers JSON/JSONC only (`SKILL.md:30`) |
| Daemon IPC (`.sock`) | `bin/lib/launcher-ipc-bridge.cjs:13` (`daemon-ipc.sock`), `SOCKET_PATH` refs | **Absent** from markers and standards |
| Vitest configs | 7× `vitest.config.ts` + `vitest.stress.config.ts` across mcp_server/runtime roots | **Absent** from markers (verify-doctrine mentions vitest, but not config as a file class) |
| Native / better-sqlite3 addons | `system-spec-kit/package.json`, `system-code-graph/package.json`, `system-spec-kit/scripts/package.json` depend on sqlite; ABI rebuild is a known reality (charter facet 2/9) | **Absent** — no `.node`/node-gyp guidance in any language trio |
| JSONL loop state | `deep-research-state.jsonl`, `ai-council-state.jsonl`, `observability-events.jsonl` across specs | **Absent** — data format the deep-loop runtime writes; runtime code unmentioned (facet 8) |
| `tsconfig.build.json` build convention | `system-spec-kit/tsconfig.json`, `system-code-graph/tsconfig.json` | Covered in verify-doctrine (charter facet 2), not in detection/marker layer |

### B. Command + agent hand-off

**[P2] `code-opencode/SKILL.md` §1 command list omits `/design`**
- **code-opencode doc:** `SKILL.md:1` (referenced via §1 hand-off) lists the command set as "`/deep, /speckit, /memory, /doctor, /create`".
- **reality:** `.opencode/commands/` contains six groups: `create, deep, design, doctor, memory, speckit`. `design/` has 5 live commands (`interface.md`, `audit.md`, `foundations.md`, `motion.md`, `md-generator.md`).
- **recommendation:** defensible to omit (design routes through `sk-design`, a sibling, not system-code under code-opencode). If the omission is intentional, state the boundary explicitly ("`/design` is owned by the sk-design surface, not this one"). If not, add it. Currently the list reads as exhaustive.

**[P3] `command_authoring.md` cites a nonexistent command and mirror path**
- **code-opencode doc:** `command_authoring.md:35` and `:65` cite `.opencode/commands/create/sk-skill.md` as a canonical example; `:38`, `:49`, `:58` cite `.opencode/prompts/` as a mirror destination.
- **reality:** `ls .opencode/commands/create/` returns `skill.md` and `skill-parent.md` — no `sk-skill.md`. `.opencode/prompts/` does not exist (`ls` returns "No such file or directory"); only `.claude/commands/` exists.
- **recommendation:** fix `sk-skill.md` → `skill.md`; remove or qualify the `.opencode/prompts/` mirror claim (it is a dead path in this repo). *(Overlaps facet-5 checklist-content coverage; flagged here as a facet-7 dead-integration-reference.)*

**[P3] `agent_authoring.md` mirror set duplicates OpenCode, omits Codex**
- **code-opencode doc:** `agent_authoring.md:40` — "the repo-managed mirror set: `.opencode/agents/`, `.claude/agents/`, and `.opencode/agents/`"; `:60` repeats the same triplicate.
- **reality:** `.opencode/agents/README.txt:8` states the sibling runtimes are `.claude/agents/` (.md) and `.codex/agents/` (.toml). `.opencode/agents/` is listed twice; `.codex/agents/` is missing entirely.
- **recommendation:** replace the second `.opencode/agents/` with `.codex/agents/`. *(Overlaps facet 5; flagged here as a hand-off/mirror-destination staleness.)*

**[P4] §1 agent hand-off statement is correct but non-exhaustive**
- **code-opencode doc:** `SKILL.md:1` (§1) — "worked by the review/code/debug agents."
- **reality:** `.opencode/agents/README.txt` confirms `review`, `code`, `debug` all exist; these are the correct implement/debug/verify-phase hand-off targets. Other system-code-working agents (`deep-research`, `deep-review`, `deep-improvement`, `ai-council`, `markdown`, `orchestrate`, `context`) exist but are owned by their respective skill workflows, not code-opencode's phase hand-off.
- **recommendation:** no change required — the §1 statement is accurately scoped to the workflow-phase hand-off. Document only if precision is desired.

### Angles to pursue next
1. **YAML as a first-class OpenCode authoring stack** — does any `references/yaml/` style/quality trio need to exist, or does CONFIG subsume it? Inspect a `_auto.yaml`/`_confirm.yaml` execution-path file's actual schema and check whether the CONFIG quality standards cover YAML shape.
2. **Daemon IPC as a code-opencode subsystem** — the `.sock` transport (`launcher-ipc-bridge.cjs`, `launcher-session-proxy.cjs`, `model-server-supervision.cjs`) is substantial system code with no surface-evidence coverage; assess whether a `references/opencode/ipc/` or a shared-tier note is warranted (cross-references facet 8 deep-loop logic conventions).
3. **Native-module ABI reality** — confirm `rebuild-native-modules.sh` (charter facet 2) existence/path and whether the SIGBUS/ABI gotcha belongs in detection markers vs verify-doctrine (facet 9 overlap).
4. **JSONL state schema** — the deep-loop runtime writes structured JSONL with a stable shape; is this authoring-adjacent (warrants a data-contract reference) or purely runtime behavior (facet 8)? Decide the boundary before iteration 8.
5. **Codex-runtime mirror reality** — `.codex/agents/` does not exist in this repo; verify whether the agent/command authoring checklists should describe Codex mirror *targets* (aspirational) or only *present* mirrors (`.claude/`). This affects the corrective text for the `agent_authoring.md` triplicate bug.

*(15 files read; emitting at cap.)*
