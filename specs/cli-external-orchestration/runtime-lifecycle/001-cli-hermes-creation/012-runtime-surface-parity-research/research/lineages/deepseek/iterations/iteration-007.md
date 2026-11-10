# Iteration 7: Hook Parity

## Focus

Inventory the repo's hook packages against each runtime's hook surface. Which packages reach which
runtimes, which are runtime-specific by nature, and which are simply unported? Reconcile against the
Hermes hook-parity work, which already answered the question for one runtime.

## Findings

### F1. The architecture: 20 concern packages, 29 hooks, one registry, four JSON dialects

`.opencode/hooks/<concern>/<runtime>/` holds one adapter per runtime that needs one. `hook-registry.json`
names 29 hooks with a concern and a per-runtime binding list, and `sync-hook-registrations.cjs` renders
the four registration files from it (iteration 6). Registered binding counts:
**claude 21, codex 18, cursor 17, devin 21**. Pi has a registry entry with no file — it has no
`hooks.json` dialect at all.
[SOURCE: file:.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json]
[SOURCE: shell adapter-directory census under `.opencode/hooks/**/<runtime>/`]

### F2. The adapter matrix (directory census, 20 concerns × 6 runtimes)

| Concern | opencode | claude | codex | cursor | devin | pi |
|---|---|---|---|---|---|---|
| completion | yes | yes | yes | yes | yes | yes |
| dispatch | yes | yes | yes | yes | yes | yes |
| mcp-route-guard | yes | yes | yes | yes | yes | yes |
| post-edit-quality | yes | yes | yes | yes | yes | yes |
| skill-advisor | yes | yes | yes | yes | yes | yes |
| spec-gate | yes | yes | yes | yes | yes | yes |
| session-lifecycle | . | yes | yes | yes | yes | yes |
| session-cleanup | yes | yes | yes | yes | yes | . |
| task-dispatch | yes | yes | **.** | yes | yes | yes |
| goal | (symlink) | . | . | yes | yes | yes |
| dist-freshness | yes | yes | yes | yes | yes | (bundled) |
| git-hooks-check | . | yes | yes | yes | yes | (bundled) |
| git-worktree-guard | . | yes | yes | yes | yes | (bundled) |
| git-primary-reconcile | . | yes | yes | . | . | yes (bundled) |
| git-preflight | yes | . | . | . | . | yes |
| sk-vision | yes | . | . | (rule) | yes | yes |
| hook-install | . | yes | . | yes | yes | . |
| permission-policy | . | . | . | . | yes | . |
| directive-lifecycle | . | yes | . | . | . | . |
| codex-watchdog | yes | . | . | . | . | . |

Six concerns reach **every** runtime: `completion`, `dispatch`, `mcp-route-guard`, `post-edit-quality`,
`skill-advisor`, `spec-gate`. Three more reach five of six (`session-lifecycle` lacks OpenCode,
`session-cleanup` lacks Pi, `task-dispatch` lacks Codex).
[SOURCE: shell census `os.walk('.opencode/hooks')` for `<concern>/<runtime>` directories]

### F3. Runtime-specific by nature — and the Hermes work already named them

`.hermes/SYNC.md` §6 ends with the reconciliation this iteration was asked to reuse: "Every hook fails
open. Not bridged by nature: `codex-watchdog` (OpenCode), `directive-lifecycle` (Claude),
`permission-policy` (Devin), `hook-install`."
[SOURCE: file:.hermes/SYNC.md:88]

The matrix agrees exactly: `codex-watchdog` is OpenCode-only (it is an OpenCode-hosted watcher for
Codex hook installs), `directive-lifecycle` Claude-only, `permission-policy` Devin-only (Devin is the
only runtime with a `PermissionRequest` event, iteration 1), and `hook-install` exists only where an
installer is needed. **Verdict: four absences that are correct by nature, zero unported.**

`sk-vision` absent for Claude is also correct by nature and already documented:
"Claude has no sk-vision integration."
[SOURCE: file:.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/command-scope.cjs:10]

### F4. The two cells that look like gaps and are not

- **Cursor's `sk-vision`.** No `sk-vision/cursor` adapter directory exists, but Cursor reaches the same
  capability through a rule file: `.cursor/rules/sk-vision.md -> ../../.opencode/skills/sk-vision/hooks/cursor/vision-rule.md`.
  A directory-based census understates Cursor; the surface is present in a different mechanism.
  [SOURCE: shell `ls -la .cursor/rules/`]
- **Pi's `dist-freshness`, `git-hooks-check`, `git-worktree-guard`, `git-primary-reconcile`.** No
  per-concern directories, but one extension bundles all four:
  `.pi/extensions/session-start-advisories.ts:34-40` declares four checks with their concern names
  (`git-worktree-guard`, `git-hooks-check` → `session-lifecycle` → primary reconcile, `dist-freshness`)
  and runs them with the same warn-only contract "cursor/devin wire into their SessionStart chain".
  [SOURCE: file:.pi/extensions/session-start-advisories.ts:34-48]

**After both corrections, hook parity is the most complete surface in this research: every concern
reaches every runtime that can host it.**

### F5. Pi is the hook surface with the least protection — hand-authored bridges, no registry, no checker

`.pi/SYNC.md` states it three times:

- "Unlike every sibling runtime, Pi's guard layer is **native code, not config**: `extensions/*.ts` are
  hand-authored factories that bridge the repo's shared guard cores into Pi's lifecycle-event API.
  There is no `hooks.json` dialect here at all."
- The inventory row for `extensions/*.ts`: "**hand-authored** guard bridges … Behavioral drift only;
  **no checker**."
- "**`extensions/` has no drift checker.** The bridges are hand-authored against the shared guard
  cores; a core behavior change surfaces only at runtime or in the manual-testing playbook."
  [SOURCE: file:.pi/SYNC.md:18,29,113]

This compounds iteration 6's finding: Pi's two generated trees (agents, prompts) have unwired
`--check` modes, and its one hand-authored guard layer has no checker at all. Pi is the runtime where
a shared-core change can go unnoticed on three surfaces at once.

### F6. Hermes answers hook parity with a bridge table, and it is the only runtime whose answer is by design

The plugin maps six Hermes hook points onto repo guard cores: `pre_llm_call` (skill-advisor brief +
Gate 3 question), `pre_tool_call` (six guards: self-dispatch refusal, read-only refusal,
dispatch-preflight-lint, git-preflight advisory, mcp-route-guard, task-dispatch guard, sk-vision),
`transform_tool_result` (staged advisories + post-edit-quality), `pre_verify`
(`completion-evidence-stop.cjs`), `on_session_start` (`goal.cjs bind --runtime hermes`), four system
prompt sections, and `on_session_end` (session-stop + session-cleanup).
[SOURCE: file:.hermes/SYNC.md:75-88]

Two design notes that generalize: every hook fails open, and the tool-result transform is
deliberately where the post-edit core runs — "because both hooks run on bounded worker threads and a
post-hook stage would race the transform."
[SOURCE: file:.hermes/SYNC.md:81,88]

### F7. The mechanism that makes cross-runtime hook parity enforceable: one flag vocabulary, four languages

`hook-flags.env` documents a master switch (`SYSTEM_HOOKS_DISABLED`) plus **22 per-concern switches**
(`SYSTEM_SPEC_GATE_DISABLED`, `SYSTEM_GOAL_DISABLED`, `SYSTEM_TASK_DISPATCH_DISABLED`, …), and the
file states they are "Read by `.opencode/hooks/shared/hook-flags.{cjs,mjs,ts,sh}`" with env
overriding file, so a single switch disables the same concern in every runtime's adapter.
[SOURCE: file:.opencode/hooks/hook-flags.env:1-22]

**Why this belongs in the parity picture:** the flag layer is the only cross-runtime contract in the
hook surface that is shared verbatim rather than translated, which is why hook parity is achievable
here and why the Pi/Hermes divergences in F5/F6 are about *bridging*, not about behavior.

## Sources Consulted

- `file:.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` (29 hooks,
  runtime table, per-hook bindings)
- Shell census: `os.walk('.opencode/hooks')` for `<concern>/<runtime>` directories; `.pi/extensions/`
  listing; `.cursor/rules/` listing
- `file:.hermes/SYNC.md:75-90` (the bridge table and the not-bridged-by-nature list)
- `file:.pi/SYNC.md:18,29,45,113`; `file:.pi/extensions/session-start-advisories.ts:34-48`
- `file:.opencode/hooks/hook-flags.env`
- `file:.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/command-scope.cjs:10`

## Assessment

`newInfoRatio: 0.80` — The charter asked which hook packages are unported; the answer is **none**,
once two mechanism differences are corrected for, and that negative result is itself the finding —
hooks are the surface where this repo's parity discipline actually holds. New: the 20×6 matrix, the
Hermeistic reconciliation confirmed against the directory census, and Pi's guard layer as the one
hook surface with no registry entry and no checker of any kind.

Confidence: **high** on the matrix and the Hermes reconciliation (directory census plus the registry's
own binding table). **Moderate** on the two "not a gap" corrections — the Cursor rule file and the Pi
bundle are read, but whether they are *behaviorally* equivalent to a dedicated adapter was not
verified by running either runtime.

## Reflection

Worked: treating the directory census as one lens and the registry as another, then chasing every
disagreement between them. Both disagreements (`cursor/sk-vision`, `pi/dist-freshness`) resolved into
mechanism differences rather than gaps, and the chase is what produced F5's Pi finding.

Failed: the first matrix pass counted `goal/opencode` as a working adapter. Iteration 4 had already
established that the file there is a browsability-only symlink that "nothing loads through", so the
OpenCode goal cell is marked `(symlink)` rather than `yes`.

Ruled out: recommending a Pi hook-drift checker as a *parity* fix. The gap is real but it is a
maintenance risk on a hand-authored layer, not a runtime missing a surface; it belongs in the drift-
detection iteration, ranked on cost, not in the parity column.

## Recommended Next Focus

Iteration 8: What Devin can carry — read `.devin/` in full and the Devin CLI contract; enumerate every
repo-carriable surface Devin supports and every one it does not, with the config file or flag that
proves each. This is the boundary any Devin parity work must respect. Carry forward the confirmed
halves: Devin reads `.devin/agents/<name>/AGENT.md` (12 nested symlinks into `.claude/agents`), the
eight-event `hooks.v1.json` (generated from the registry, and the only runtime with `PermissionRequest`
and `PostCompaction`), `mcp_config.json` (Devin-owned real file), `config.local.json` (gitignored),
inherited rules (no `.devin/rules/`), strict-YAML frontmatter parsing, and no command surface by
operator directive.
