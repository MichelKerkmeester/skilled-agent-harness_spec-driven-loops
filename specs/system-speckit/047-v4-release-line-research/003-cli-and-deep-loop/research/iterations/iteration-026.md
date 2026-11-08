# Iteration 026 — Hub shared code and assets; three mode packets vs the argv builder

## Focus

Unread ground from the previous focus: the shared code and assets of `cli-external-orchestration`, and the three mode packets not yet audited in depth (`cli-claude-code`, `cli-cursor`, `cli-opencode`). Two questions per the brief: for each shared script, what calls it and does its documented behaviour match the code; for the three packets, do the reference docs' command lines and flags match what `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` actually emits, with `path:line` on both sides.

Prior registry findings were treated as negative context: `--pure`, the codex/devin hard-rule gaps, rosters, `ROUTER.md` versions and the stale 20 MB cap citation are not restated.

## Actions Taken

1. Enumerated the hub tree. Structure: one `shared/references` directory, five hub-level JSON manifests (`hub-router.json`, `mode-registry.json`, `leaf-manifest.json`, `description.json`, `graph-metadata.json`), seven mode directories, each with `ROUTER.md`, `SKILL.md`, `hard-rules.json`, `references/`, `manual-testing-playbook/` and `changelog/`. Only one mode ships executable code: `cli-opencode/scripts/` with `opencode-setup.sh`, `probe-worktree-confinement.cjs` and four test files.
2. Grepped every `.cjs`/`.mjs`/`.js`/`.ts`/`.sh` under the hub: the entire hub's executable surface is those eight files under `cli-opencode/`, plus three playbook fixtures. No hub-level build, lint or dispatch script exists — the hub is documentation and manifests only, and all dispatch code lives in `system-deep-loop`.
3. Located the argv builders in `fanout-run.cjs` and read the Claude, Cursor and OpenCode branches ([SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2355], [:2455], [:2655]).
4. Compared each branch's emitted flags against the corresponding packet's `references/cli-reference.md` and `references/agent-delegation.md`.
5. Checked the two shared scripts for callers and for documented-vs-actual behaviour: `probe-worktree-confinement.cjs` and `opencode-setup.sh`.
6. Ran the Flash-pin regex against the model ids printed in the docs to test the drift mechanically rather than by reading.

## Findings

**f-iter026-001 — drift, P2. Nine documented OpenCode 2 dispatch lines show an effort the runtime overrides.**

`isFlashMaxPinnedModel()` matches `deepseek-v4.1-flash-1017` and `pinReasoningEffortForModel()` returns `'max'` for it unconditionally, discarding any caller-supplied effort ([SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2456], [:2462], and the assignment that consumes it at [:2475]). Running the same regex against the ids the docs print confirms `PINNED -> max` for `llmgateway/deepseek-v4.1-flash-1017`.

`agent-delegation.md` uses `-m llmgateway/deepseek-v4.1-flash-1017#high` on nine lines, including the canonical per-route table and the captured-result recipe ([SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md:246], [:419]). The runtime can never emit those command lines for that model. A reader copying the doc's own v2 examples gets a lower effort than any real dispatch, and the doc's statement of the pin at [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md:80] sits forty lines above examples that contradict it.

Release introduced: v4.0.0.x dual-version dispatch; the pin and the v2 examples appear to have landed in different commits. Confidence: high for the mismatch, medium for the release attribution.

Verify: test `/(^|\/)(deepseek-v4\.1-flash(-1017)?)$/` against `llmgateway/deepseek-v4.1-flash-1017` → true; then `rg -c 'flash-1017#high' .skilled/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md` → 9.

**f-iter026-002 — bug, P2. The README's structure tree prints an unrunnable setup command.**

`cli-opencode/README.md` documents the helper in its file tree as a bare invocation with no argument ([SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/README.md:184]). The script requires a mode: `usage()` prints `<v2|both|v1|check>` and the dispatch is a four-arm `case "$1"` whose catch-all calls `usage >&2` and exits 2 ([SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:502], [:525], [:532]). Under the script's own `set -euo pipefail`, an empty `$1` can fail even earlier as an unbound variable. Every other page is correct — `install-and-versions.md` states the four-mode contract twice ([SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md:150]) — so the README tree is the single stray.

Verify: `bash .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh; echo $?` → non-zero (prints usage, changes nothing).

**f-iter026-003 — misalignment + operator UX, P1. The Cursor read-only posture is undocumented, and the doc's own read-only example contradicts the doc's own trust rule.**

The runtime's read-only branch does not run in the repo at all. It creates a neutral workspace under `$TMPDIR/deep-loop-cursor-neutral-workspace`, refuses it unless it is a real, current-user-owned directory with no `.cursor/` inside, and then dispatches `--mode plan --trust --workspace <neutral> --add-dir <repoRoot>` ([SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2705], with the fail-closed guard immediately above). The stated reason is that `--workspace` decides which `.cursor/` hooks and MCP config are loaded, so a repo-root read-only leaf could be made to write or hang by hooks that the read-only mode does not govern.

Nothing in the cursor packet documents this. A grep for `neutral` across the whole mode returns only an unrelated spec-gate note. Worse, the doc's read-only example is `cursor-agent -p "..." --mode plan --model composer-2.5` with no `--trust` ([SOURCE: .skilled/skills/cli-external-orchestration/cli-cursor/references/cli-reference.md:150]), while the same file states that an untrusted directory refuses every tool unless `--trust`, `--yolo` or `-f` is passed ([SOURCE: .skilled/skills/cli-external-orchestration/cli-cursor/references/cli-reference.md:234], [:277]). An operator reproducing the doc's example on a fresh clone either gets the trust refusal or, having added `--trust` in the repo root, loads the repo's hooks — the exact configuration the runtime spends thirty lines preventing. The `--workspace` and `--add-dir` rows do exist in the flag table ([SOURCE: .skilled/skills/cli-external-orchestration/cli-cursor/references/cli-reference.md:120]) but are never tied to the read-only recipe.

Release introduced: v4.0.0.x (cursor read-only isolation). Confidence: high.

Verify: `rg -n 'neutral' .skilled/skills/cli-external-orchestration/cli-cursor/ -g '*.md'` → no hit for the workspace; then read lines 144-160 of the same `cli-reference.md` against lines 234 and 277.

**f-iter026-004 — drift, P2. `--standalone` is mandatory for OpenCode 2 child dispatch but is documented as an optional boolean.**

The v2 branch hard-codes `--standalone` into every dispatch it builds ([SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2520]). The flag table describes it only as "Run with a private server instead of the background service", with no note that a dispatched child requires it ([SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md:108]). The requirement is stated once, in prose, in a different file ([SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md:81]). A reader who builds a v2 child from the flag table alone omits it; the same table's note that v2 has no `--dir` ([SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md:123]) pushes exactly that reader toward hand-building a dispatch.

Confidence: medium-high — the flag exists and the runtime treats it as required; whether its absence actually breaks a child is asserted in prose, not tested this iteration.

Verify: `rg -n 'standalone' .skilled/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md` → 3 hits, none saying "required for dispatch".

**f-iter026-005 — improvement, P2. The per-CLI sandbox mapping exists in two incompatible shapes.**

The OpenCode, Cursor and Codex builders each derive their own flags inline from `resolvedSandbox`, and the Cursor branch says so explicitly in a comment ("kept independent of `resolveCursorApprovalMode()` in executor-config.ts") ([SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2655]). The Claude branch does the opposite: it consumes a pre-resolved permission string produced elsewhere ([SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3621]). So the same concept — "what does `workspace-write` mean for this CLI" — is expressed as inline extension in three places and as a shared resolver in a fourth, and a reader of `buildClaudeLineageCommand` cannot tell what a sandbox tier produces without jumping 1,260 lines. This is the concrete cost behind the "one resolver" extension already recorded in earlier iterations; it is logged separately because it is a shape difference, not a missing call.

Verify: `rg -n 'resolvedSandbox ===' .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` and `rg -n 'resolveClaudePermissionMode' .skilled/skills/system-deep-loop/runtime/`.

## Questions Answered

None fully. The parent-hub question is half-closed: the hub is structurally a hub (five hub-level manifests, seven mode directories each carrying `ROUTER.md`, `SKILL.md` and `hard-rules.json`), and all executable logic sits in `system-deep-loop` rather than in the hub. What is still unproven is conformance under `package_skill.py --strict`, unchanged from the previous twenty-five iterations.

## Questions Remaining

- Hub canon under `package_skill.py --strict` across the hub and its seven modes — carried again.
- Mid-run executor failure (devin `resource_exhausted`, a builder throw): still unread. This iteration read only builders, never the failure path.
- `--pure` validity for the installed OpenCode; unknown-token `{...}` render policy — both carried.
- New: is `deep-loop-cursor-neutral-workspace` deliberately outside documented config? The env override exists (`DEEP_LOOP_CURSOR_NEUTRAL_WORKSPACE`) but no packet or config documents it.
- New: does any test exercise the Flash pin? `pinReasoningEffortForModel` is described as mirroring `executor-config.ts`, so a divergence between the two copies would be silent.

## Next Focus

The executor failure path, finally: read what a single-executor run records when a builder throws (`buildClaudeLineageCommand` throws `inputError` on a missing binary at its first line) and when a spawned CLI returns a quota error. That is now twenty-six iterations unread and it is the one remaining question with a plausible P0 behind it.

## SCOPE VIOLATIONS

None. `opencode-setup.sh` was read, never executed; no repository path was written.
