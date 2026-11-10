# Iteration 10 — A9: version-aware hooks and guards

## Focus

Make the repo's own enforcement surfaces correct for **both** OpenCode versions:

- the five `opencode run` hard rules in `.skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json`
- the shared matcher/check engine in `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs`
- the dispatch classifier in `.skilled/hooks/dispatch/lib/dispatch-audit.mjs`
- the Pi-side guard `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts`
- the runtime consumer `.opencode/plugins/cli-dispatch-audit.js`
- and the question of whether `.opencode/hooks` is a host-loaded concept at all

The steering hypothesis was that name-based version inference is wrong in both directions. It is — and the failure is asymmetric: one version gets **mis-linted**, the other gets **not linted at all**.

## Actions Taken

1. Read the five rule declarations in `hard-rules.json` (each object keyed by `id`, `check`, `message`, `severity`).
2. Read the check implementations in `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:35` (`HEADLESS_DISPATCH_SHAPES`), `:124` (`stdin-redirect-required`), `:136` (`explicit-model-required`), `:142` (`no-bare-agent-general`), `:145` (`command-flag-for-slash-prompt`), `:152` (`share-requires-confirmation`).
3. Read the classifier in `.skilled/hooks/dispatch/lib/dispatch-audit.mjs:28` (shape table), `:51` (`EXECUTOR_BASENAMES`), `:199` (`directExecutor`), `:212` (the `opencode run` arm), `:265` (`hasDispatchEvidence` return), `:271` (`inspectDispatch`), `:290` (the `ambiguous` decision).
4. Read the Pi guard's decision path, `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts:183` (`shouldDenyPiDispatch`) and `:249`–`:257` (the two refusal strings), plus the call site at `:238`–`:247` where `inspectDispatch` is invoked and `shape` is resolved from `DISPATCH_SHAPES`.
5. Read the v2 `run` help capture at `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/cli-help/v2-run-help.txt` in full (flags, global flags, model format).
6. Confirmed the `.opencode/hooks` symlink target and enumerated the modules that import through it (`.opencode/plugins/*.js`).

## Findings

### F1 — v2 `run` flags, confirmed from the captured help (P0, primary source)

`provider/model#variant` for `--model`; `--agent string` still exists; `--format choice` is `default|json`; `--file`, `--title`, `--thinking`, `--continue`, `--session`, `--fork`, `--auto`, `--server`, `--standalone`. **Absent**: `--command`, `--share`, `--variant`, `--port`, `--attach`, `--dir`, `--pure`. [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/cli-help/v2-run-help.txt:1]

One detail the steering did not flag: **`--print-logs` is a global flag whose usefulness is gated by `--standalone`** — "server logs require --standalone". The v1 debugging recipe embedded in `explicit-model-required`'s message therefore does not work verbatim on v2, and v1's `--log-level DEBUG` is v2's enumerated `--log-level <all|trace|debug|…>` (lowercase choices). [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/cli-help/v2-run-help.txt:25]

### F2 — per-rule v1/v2 validity table (P0)

| Rule (`hard-rules.json` id) | Check impl | severity | v1 1.19.3 | v2 2.0.32 | Why |
|---|---|---|---|---|---|
| `stdin-redirect-required` | `dispatch-rule-checks.mjs:124` | error | ✅ valid | ✅ valid | Neither version's `run` closes an inherited stdin; v2's default even *attaches to a background service* before it reads the message, so the hang window is wider. The rule text is still true. |
| `explicit-model-required` | `:136` | error | ✅ valid | ⚠️ valid but stale message | The check is `/(^\|\s)(-m\|--model)(\s\|=)/` — format-agnostic, so v2's `provider/model#variant` passes. The *message* prescribes `--print-logs --log-level DEBUG`, which on v2 needs `--standalone` and a lowercase level. Behaviour correct, remediation wrong. |
| `no-bare-agent-general` | `:142` | warn | ✅ valid | ⚠️ unverified | v2 still has `--agent string`. Whether v2 *rejects* a bare top-level `general` is a v1 runtime fact that was never re-probed on v2. Advisory, so a false warn is cheap — keep it, but label it v1-only until probed. |
| `command-flag-for-slash-prompt` | `:145` | **error** | ✅ valid | ❌ **INVALID — hard block** | v2 `run` has **no `--command`**. The check demands a flag the v2 CLI does not have, at `severity: error`, which `evaluate` maps to `block` (`dispatch-rule-checks.mjs:296`). A valid v2 slash-command workflow is refused with no way to satisfy the guard. This is the P0. |
| `share-requires-confirmation` | `:152` | warn | ✅ valid | ⚪ vacuous | v2 has no `--share`; the check is `!/--share…/` so it passes trivially. Harmless, but it documents a flag that does not exist on one of the two targets. |

The `command-flag-for-slash-prompt` replacement for v2 is not a flag — it is a **different transport**. On v2 a `/family:name args` prompt cannot be expanded by `run`, so the v2-side rule must demand that the slash shape *not* be handed to `run` at all (use the command API route), or downgrade to a warn that names the v2 route. [SOURCE: .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:145]

### F3 — `opencode2` is invisible to every guard, in three independent places (P0)

The classifier recognises an executor by **exact basename**:

- `EXECUTOR_BASENAMES` is a `Set` containing `'opencode'` — not a prefix or pattern test, so `opencode2` is never a member. [SOURCE: .skilled/hooks/dispatch/lib/dispatch-audit.mjs:51]
- `directExecutor` returns `null` on any non-member before it ever looks at the subcommand. [SOURCE: .skilled/hooks/dispatch/lib/dispatch-audit.mjs:206]
- Even if it were admitted, the `opencode run` arm matches the literal next token, and the evidence regex is `\bopencode\s+run\b` — the word boundary fails against `opencode2 run` because `2` is a word character. [SOURCE: .skilled/hooks/dispatch/lib/dispatch-audit.mjs:212] [SOURCE: .skilled/hooks/dispatch/lib/dispatch-audit.mjs:248]
- The stdin rule's shape list repeats the same literal `/\bopencode\s+run\b/`, and the pipe carve-out repeats it a fourth time. [SOURCE: .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:36] [SOURCE: .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:128]

Consequence: `opencode2 run …` classifies as `kind: 'none'` at `inspectDispatch` — no dispatch evidence is accumulated for that segment — so the Pi guard **returns early** and the hard rules are **never evaluated**. [SOURCE: .skilled/hooks/dispatch/lib/dispatch-audit.mjs:290] [SOURCE: .skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts:268] The runtime audit plugin shares the same lib, so the audit trail is equally blind. [SOURCE: .opencode/plugins/cli-dispatch-audit.js:29]

This is worse than a false denial: it is a **silent hole**. The steering predicted "would it recognize an `opencode2` invocation" — the answer is no, and the failure mode is fail-*open*, not fail-closed.

### F4 — the mis-lint is a `opencode`-named v2 binary, and it is a hard block (P0)

After the official installer, `opencode` **is** v2. Every rule above is selected by binary name, so that user gets the v1 rule set applied to a v2 CLI. The only actively harmful one is `command-flag-for-slash-prompt`: severity `error` → `block`, unsatisfiable on v2. So the mis-lint is not "a warning that looks odd" — it is a refusal of a correct command. [SOURCE: .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:145]

The same name-based inference also fails the *other* way for the local side-by-side user: `opencode` → 1.19.3, `opencode2` → `opencode v2.0.32` (iteration 4). So binary name correlates with version in neither direction. **Detection by name is refuted.**

### F5 — a version-aware matcher design that does not spawn a probe per call (P1)

Constraints: `dispatch-audit.mjs` and `dispatch-rule-checks.mjs` are deliberately dependency-free, pure, and on a hot path that must work when the advisor is down; `evaluate` is called synchronously. Spawning `opencode --version` per bash call is not acceptable.

Proposed design, in the order the fixes should land:

1. **Name-admit, version-decline.** Widen the *matcher* only: `EXECUTOR_BASENAMES` gains `'opencode2'`; the `opencode run` arm becomes `/^opencode\d*$/`; every `\bopencode\s+run\b` literal becomes `\bopencode\d*\s+run\b`. This is a pure widening — it can only add lint coverage, never remove it, so it cannot break a v1 user. [SOURCE: .skilled/hooks/dispatch/lib/dispatch-audit.mjs:51]
2. **Rules carry applicability.** Each rule object gains `appliesTo: ["v1"] | ["v2"] | ["v1","v2"]`, plus optional `v2Replacement` text. `evaluate` skips a rule whose `appliesTo` excludes the resolved version. Default when the field is absent is `["v1","v2"]` so today's sidecars keep working unchanged.
3. **Version resolution is tri-state and memoised, never inferred from the name.** `resolveTargetVersion(executor)` → `'v1' | 'v2' | 'unknown'`, from one `--version` probe cached per (binary, mtime) for the process lifetime, with a documented timeout. Parsing must tolerate both observed formats: bare `1.19.3` and prefixed `opencode v2.0.32` — strip an optional `opencode v`.
4. **`unknown` degrades to the intersection.** Evaluate only rules valid on both versions. This makes an unprobeable host conservative-but-usable rather than blocked: `stdin-redirect-required` and `explicit-model-required` still fire, `command-flag-for-slash-prompt` does not.
5. **Command-shape evidence as a second signal.** `--command`, `--share`, `--variant`, `--attach`, `--port`, `--dir`, `--pure` appearing in an `opencode run` command is itself v1 evidence; `--standalone` and a `#variant` in the `-m` value are v2 evidence. Use it to override `unknown` when the probe is unavailable, and to *widen* the resolver to `'v1+v2'` when a command mixes evidence.
6. **Availability rule for `opencode`, which does not exist today.** `binaryOnPathCheck` covers codex, cursor-agent, devin, pi, hermes, jev — not opencode. Adding one must test the *resolved* binary, which is exactly why the resolver must be by version and the binary list must contain both names.

### F6 — `.opencode/hooks` is not a host concept on either version (P2, answers the steering sub-question)

`.opencode/hooks` is a symlink to `../.skilled/hooks`, sitting beside the `agents`, `commands`, `skills`, `bin`, `scripts` and `repo-rules` symlinks. Nothing loads it as a directory of host hooks on either version:

- Its consumers are **ES-module imports from the repo's plugins**, e.g. `.opencode/plugins/cli-dispatch-audit.js` importing `'../hooks/dispatch/lib/dispatch-audit.mjs'` and `'../hooks/shared/hook-flags.cjs'`. [SOURCE: .opencode/plugins/cli-dispatch-audit.js:29] [SOURCE: .opencode/plugins/cli-dispatch-audit.js:35]
- The tree itself is a **cross-runtime adapter layout**, not an OpenCode one: `.opencode/hooks/goal/` ships `opencode`, `pi`, `cursor`, `devin` adapter directories and deliberately no `claude`, which only makes sense for a repo-owned dispatcher. [SOURCE: .skilled/skills/cli-external-orchestration/cli-claude-code/benchmark/reports/2026-07-29--manual-testing-playbook--goal-hook/skill-benchmark-report.md:51]
- The one host-native hooks surface referenced anywhere in the repo is a **user-level** `~/.opencode/hooks.json` behind a `[features].opencode_hooks` flag — a different path, a different scope, and per that doc a Claude-Code-compatibility feature, not this directory. [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook-validation.md:134]

So: no version work is needed *inside* `.opencode/hooks` for host loading. But see F7 — the directory's **reachability** is version-sensitive after all.

### F7 — v2's per-plugin layout silently breaks every `../hooks/…` import depth (P1, new)

Every importer reaches the hook libs at `../hooks/…`, which resolves correctly only because the plugin file sits **flat** at `.opencode/plugins/<name>.js`. The documented v2 layout is a per-plugin directory (`.opencode/plugins/<name>/index.js`, carried question from iteration 4). Under that layout the identical import resolves to `.opencode/plugins/hooks/…` — a directory that does not exist — and **every** plugin that imports a hook lib fails at load time, on v2 only.

This converts a carried open question into a blocking layout constraint: either v2's flat-file loading survives, or all 16 plugins need their import depths rebased (`../../hooks/…`), or a `.opencode/plugins/hooks` symlink is added. Cheapest fix if per-plugin dirs are mandatory: the symlink, one line, no 16-file churn. [SOURCE: .opencode/plugins/cli-dispatch-audit.js:29]

### F8 — how the observed "does not prove one direct executor" refusal arises (P2)

Mechanism, from `inspectDispatch`: a command is `direct` only when exactly one segment yields an executor **and** no other segment produced dispatch evidence; if any executor was found but the command is not clean, or a segment merely *looks* like a dispatch, the result is `ambiguous` — and `ambiguous` is an unconditional deny with the opaque message. [SOURCE: .skilled/hooks/dispatch/lib/dispatch-audit.mjs:290] [SOURCE: .skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts:252]

So `opencode run --help` alone should classify `direct` (denial message would be the *named-executor* one), while a command that also contains a second unproven segment — `opencode2 run --help`, a `mkdir`, a redirect — tips to `ambiguous`. The children's exact command string was not recorded, so **which of the two refusals they hit is not reproducible from the packet**; iteration 4's note conflated both binaries in one sitting. Marked UNVERIFIED, low value to chase: the Class-1 defect (F3) is established independently.

One observation that *is* solid and worth keeping: the `ambiguous` branch is the guard's softest edge and the `command-flag-for-slash-prompt` P0 sits right behind it, so **any** v2 user whose slash prompt is wrapped in a compound command meets the opaque message first and never learns the real reason.

## Questions Answered

- **How must hooks, guards and plugin dependencies become version-aware so neither version breaks?** Answered at the level of design + exact file list: name-admit (`opencode\d*`) in the matcher, `appliesTo` on every rule, tri-state memoised `--version` resolution that degrades to the rule intersection on `unknown`, command-shape evidence as the override, plus the `../hooks/…` import-depth constraint that binds plugin layout to hook reachability. F2–F7.

## Questions Remaining

- Does **v1 1.19.3 accept `-m provider/model#variant`**, or does the `#variant` form fail there? Binds whether one model string can serve both.
- Does **v2 reject a bare top-level `--agent general`** as v1 does? Keep `no-bare-agent-general` advisory until probed.
- Does a `#` in an unquoted `provider/model#variant` survive shell comment handling in every shell the repo dispatches through (bash ok by word-position rule; zsh, fish and `sh -c` unverified)? If any shell truncates it, the argv pattern is itself unsafe and must be quoted in every documented recipe.
- Does v2's loader accept `.opencode/plugins/*.js` flat, or require per-plugin directories? Now blocking (F7), not merely structural.
- What is the v2 command-expansion route for a `/family:name args` prompt that replaces `run --command` — `POST /api/session/{id}/command` (iteration 7's carried question)?
- Is `opencode run` on v2 safe against a **stale background service** (`--standalone` omitted)? If not, v2 needs a sibling rule to `stdin-redirect-required` whose subject is service attachment, not stdin.
- Does `~/.opencode/hooks.json` behind `[features].opencode_hooks` exist on 1.19.3 or 2.0.32? Unverified either way; if it does, it is a third hook surface the repo does not use.
- All earlier carried questions remain open (plugin default-export shapes, `plugins` vs `plugin` key, flat plugin loading, `session.messages` signature, `ctx.tui`, v2 event scheme, `run --format json` schema).

## Next Focus

A10 (or the highest-value open surface): close the two blocking items with the cheapest evidence — (a) does v1 accept `provider/model#variant` and does it reject `--agent general`; (b) does v2 load flat `.opencode/plugins/*.js`. Both are one probe each and both change the design: (a) decides whether one model string serves both skill packets, (b) decides between the symlink and a 16-file rebase.

## SCOPE VIOLATIONS

None. No file outside `research/iterations/iteration-010.md` and `research/deltas/iter-010.jsonl` was created, modified or deleted. Every researched path was read only.
