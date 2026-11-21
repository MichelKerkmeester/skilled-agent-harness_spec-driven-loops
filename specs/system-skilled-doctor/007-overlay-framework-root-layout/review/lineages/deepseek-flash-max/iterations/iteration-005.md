# Review Iteration 005

## Dispatcher

- Target spec folder: `specs/system-skilled-doctor/007-overlay-framework-root-layout`
- Review packet root: `specs/system-skilled-doctor/007-overlay-framework-root-layout/review/lineages/deepseek-flash-max`
- Frontier node: `F-1-004` at depth 1 of 3
- Dimension: security
- Focus: Frontier node F-1-004: security
- Executor: cli-mistral-vibe model=deepseek-flash (inline, no nested dispatch)
- Operator review focus: follow-up round after remediation. This iteration checks the security posture of the remediated hook and plugin surfaces, which is the part of the operator focus that asks whether the fixes introduced no regression.

## Files Reviewed

| File | Lines | Why |
|------|-------|-----|
| `barter/ai-speckit/overlays/root/opencode/plugins/barter-overlay-guard.js` | 1-50 | OpenCode write guard over the shared core; fail-open decision |
| `barter/ai-speckit/overlays/root/opencode/plugins/barter-git-write-gate.js` | 1-72 | OpenCode bash gate; fail-closed decision |
| `barter/ai-speckit/skilled/.skilled/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs` | 1-187 | Path canonicalisation, layout matching, engine invocation |
| `barter/ai-speckit/skilled/.skilled/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs` | 169-170, 2150-2320 | `INTERESTING_GIT`, `evaluateCommand` tail, CLI entrypoint |
| `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit` | 1-172 | Trust boundary of the commit gate |
| `barter/ai-speckit/skilled/.skilled/hooks/overlay-guard/{claude,codex,devin,cursor}/overlay-guard.*` | entrypoints | Fail-mode parity across adapters |
| `barter/ai-speckit/overlays/root/opencode/plugins/tests/barter-git-write-gate.test.cjs` | 170-192 | Fallback-path assertion |
| `barter/ai-speckit/skilled/.skilled/skills/sk-git/scripts/hooks/barter-git-write-gate.test.mjs` | whole | Fail-open coverage |

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Git write gate fails open and silently through its CLI entrypoint** -- `barter/ai-speckit/skilled/.skilled/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs:2313` -- Both entrypoint branches end in `main().catch(() => process.exit(0))`. Exit 0 with no decision written is the allow outcome for every runtime this hook serves, so any rejection that escapes `main()` lets the command run. The OpenCode wrapper over the same `evaluateCommand` does the opposite: `overlays/root/opencode/plugins/barter-git-write-gate.js:57-62` refuses an interesting git command when evaluation throws. One gate, two entrypoints, opposite failure modes, and the CLI side writes no diagnostic at all, so an operator cannot tell a gate failure from a clean allow.
   Finding class: security-hardening
   Scope proof: read `barter-git-write-gate.mjs:2310-2320` (both `catch` arms) and `barter-git-write-gate.js:48-63` (the plugin's `catch`); the asymmetry is visible in the two files alone.
   Affected surface hints: `barter/ai-speckit/skilled/.skilled/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs`, `barter/ai-speckit/overlays/root/opencode/plugins/barter-git-write-gate.js`, `barter/ai-speckit/skilled/.skilled/skills/sk-git/scripts/hooks/barter-git-write-gate.test.mjs`
   Case: a runtime invokes the hook, `main()` rejects after `readStdin()` resolves but before `deny()` writes (for example `process.stdout.write` raising EPIPE because the parent closed the pipe), and the hook exits 0. The shell command the gate was asked to judge then runs unchecked, and nothing on stderr says the gate failed.

   ```json
   {
     "type": "claim",
     "claim": "The CLI entrypoint of the git write gate treats any main() rejection as an allow and reports nothing, while the OpenCode wrapper over the same evaluator refuses.",
     "evidenceRefs": [
       "barter/ai-speckit/skilled/.skilled/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs:2313",
       "barter/ai-speckit/skilled/.skilled/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs:2317",
       "barter/ai-speckit/overlays/root/opencode/plugins/barter-git-write-gate.js:57"
     ],
     "counterevidenceSought": "Checked whether main() can reject at all: readStdin() resolves rather than rejects, JSON.parse is caught at :2286, evaluateCommand is caught at :2298-2306, and runtimeSessionDir at :2239-2245 only reads env vars and payload fields. The residual throw surface is deny()'s stdout write and any future edit to main().",
     "alternativeExplanation": "The exit-0 arm may be deliberate so a broken hook never blocks a commit. That reading is contradicted by the plugin wrapper, which refuses in the same situation, and by the absence of any stderr note, which the overlay guards do write before approving.",
     "finalSeverity": "P2",
     "confidence": "high",
     "downgradeTrigger": "Drop to informational if a maintainer records that the CLI hook is intentionally advisory and the plugin is the only enforcing entrypoint."
   }
   ```

2. **A missing prompt-card guard skips its check with no message** -- `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:73` -- The card-sync block runs only when `[ "$CARD_SURFACE_STAGED" -eq 1 ] && [ -f "$CARD_GUARD" ]`. When a prompt-skill path is staged and the guard script is absent, the whole condition is false, so nothing runs and nothing prints. The neighbouring hygiene block handles the same situation the other way: `:54-56` prints `WARNING: vendored comment hygiene checker is missing; skipping check.` A partial vendored copy therefore drops one check silently and announces the other.
   Finding class: security-hardening
   Scope proof: read `pre-commit:59-81` end to end; the `-f` test is the only gate on the card check and there is no `else` arm.
   Affected surface hints: `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit`, `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/tests/pre-commit.test.cjs`
   Case: a vendored tree is copied without `skilled/.skilled/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh`, a commit stages `.skilled/skills/sk-prompt/SKILL.md`, and the commit passes with no output about the missing guard.

   ```json
   {
     "type": "claim",
     "claim": "The pre-commit card-sync check is skipped silently when its guard script is missing, unlike the hygiene check which warns.",
     "evidenceRefs": [
       "barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:73",
       "barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:55"
     ],
     "counterevidenceSought": "Confirmed the guard exists in the current tree (check-prompt-quality-card-sync.sh, 6278 bytes), so no live commit reaches the silent branch today. Searched the hook for any other diagnostic on this path and found none.",
     "alternativeExplanation": "The author may have judged a missing optional guard not worth a message. That does not explain why the adjacent block warns for the same condition.",
     "finalSeverity": "P2",
     "confidence": "high",
     "downgradeTrigger": "Drop if the vendored tree is guaranteed complete by the apply step and a test asserts that guarantee."
   }
   ```

## Traceability Checks

| Check | Protocol | Result | Evidence |
|-------|----------|--------|----------|
| `checklist_evidence` | core | pass | Completion criterion 5 re-executed read-only: `node .skilled/commands/doctor/scripts/overlay-engine.cjs --guard .skilled/skills/sk-git/sk-git-skilled/SKILL.md` prints `refuse: ... keep its copy at ../overlays/framework/skills/sk-git/sk-git-skilled/SKILL.md ...` and names the framework source root |
| `decision_alignment` | core | pass | D2 (sibling-only `overlayDir`) holds in the guard core: `overlaysRootFor` at `barter-overlay-guard-core.cjs:60-70` resolves the setting against the tree and `matchLayout:75-80` refuses a folder that is not the one the setting names |
| `integration_naming` | core | pass | The three named surfaces are cited by path: `overlays/root/opencode/plugins/barter-overlay-guard.js`, `overlays/root/opencode/scripts/git-hooks/pre-commit`, `skilled/.skilled/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs` |

## Integration Evidence

- `barter/ai-speckit/overlays/root/opencode/plugins/barter-overlay-guard.js:7` imports the core from `../../.skilled/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs`, so the applied copy and the overlay source copy share one implementation.
- `barter/ai-speckit/overlays/root/opencode/plugins/barter-git-write-gate.js:14` imports `evaluateCommand` from `../skills/sk-git/scripts/hooks/barter-git-write-gate.mjs`, which is the same module whose CLI entrypoint carries finding 1.
- `git config --get core.hooksPath` in `barter/ai-speckit` returns `skilled/.opencode/scripts/git-hooks`, so `pre-commit` runs from its installed location and `$SCRIPT_DIR/../../..` at `:6` resolves to `barter/ai-speckit/skilled` as intended.

## Edge Cases

- **Latent install-mode hazard.** `pre-commit:6` computes `TREE_ROOT` as `$SCRIPT_DIR/../../..`. That is correct for the `core.hooksPath` install in use, but a `.git/hooks/pre-commit` symlink install would resolve one level above the repository, and the re-resolution block at `:87-91` would not recover it because neither probe path exists there. Recorded as an edge case rather than a finding: the repository does not use that install mode, and `.git/hooks` holds no non-sample hook.
- **Overlay guard fail-open is deliberate and uniform.** `barter-overlay-guard.js:19-22` warns and allows when the core throws. All four upstream adapters do the same: `claude/overlay-guard.cjs:71-74`, `codex/overlay-guard.cjs:76`, `devin/overlay-guard.cjs:72`, `cursor/overlay-guard.mjs:67-70`. Because the behaviour is consistent and each arm writes a stderr note, it is not recorded as a divergence. The git write gate is the outlier precisely because it is not consistent.
- **`sniffPayload` patch coverage is untested.** `barter-overlay-guard-core.cjs:129-138` scans `command`, `input` and `patch` for `*** Add File:` markers, but `barter-overlay-guard.test.cjs` exercises only `filePath` and `path` payloads (`:103`, `:110`, `:117`, `:141`). No evidence in this tree shows which field name the OpenCode patch tool uses, so the gap is recorded as unverified coverage rather than a finding.

## Confirmed-Clean Surfaces

- `barter-overlay-guard-core.cjs:170` skips a target outside the tree by design, and `canonicalPath:25-41` resolves symlinks on both sides, so a link inside the tree that points out is allowed and a link outside that points in is still guarded.
- `barter-overlay-guard-core.cjs:172` passes `targetPath` as an argv element to `spawnSync`, so no shell interpolation reaches the engine.
- `barter-overlay-guard-core.cjs:75-80` requires the tree to hold the engine and the overlays root to hold the manifest before a layout is accepted, so a stray folder with a manifest cannot steer the guard.
- `barter-overlay-guard-core.cjs:100` throws rather than guessing when no layout matches, which is what makes the plugin's warn-and-allow arm reachable only on a real misconfiguration.
- `barter-git-write-gate.js:56` is live code, not a dead branch: `evaluateCommand` returns prefixed text through `insideRefusal`/`outsideRefusal`/`couldNotEvaluate` at `barter-git-write-gate.mjs:1732`, `:1737` and `:2018`, so a real refusal keeps its specific reason.
- `pre-commit:156-157` and `:164-165` read the engine's exit status correctly: in bash the status of `VAR="$(cmd)"` is the status of `cmd`, so a non-zero engine exit reaches the `if`.
- `pre-commit:124-132` scans with `-z`, so a non-ASCII vendored path cannot slip past the ownership check as a quoted string.
- `pre-commit:120-146` fails closed when a vendored path is staged and no manifest is found, which is the R2-P1-001 remediation holding under a security reading.
- Every `SPECKIT_SKIP_*` bypass is named at the refusal site that it bypasses: `:21`, `:51`, `:77`, `:142`, `:161`, `:167`.

## Ruled Out

- **Engine refusal prefix mismatch.** Considered that `barter-overlay-guard.js:175` matches `/^refuse:/im` while the engine might print another prefix. Executed the guard read-only and the engine prints `refuse: ...`, so the match holds.
- **`$?` clobbered by the assignment.** Considered that `STATUS_OUT="$(...)"` resets `$?` before the test. It does not: bash propagates the command substitution's status through the assignment, so the check is sound.
- **Unvalidated `overlayDir` steering the manifest probe.** Considered that `pre-commit:106` resolves `overlayDir` without validation. The engine validates the same setting and refuses a bad value, so the probe can only pick a manifest the engine would then reject.
- **`INTERESTING_GIT` too narrow to catch a refused command.** Considered that `barter-git-write-gate.js:57` would swallow a refusal for a command the pattern misses. `INTERESTING_GIT` is `/\b(?:git|gh)\b/` (`barter-git-write-gate.mjs:169`), and every refusal `evaluateCommand` returns is already prefixed and re-thrown at `:56`, so the generic arm is only reached for a thrown error.

## Next Focus

- Dimension: maintainability
- Focus area: run-level pass over `overlay-engine.cjs` and the packet docs, plus the two Skilled-side completion criteria that no earlier iteration executed
- Reason: security is now covered for F-1-004 and maintainability is the only dimension the reducer still lists as uncovered
- Rotation status: F-1-004 security complete; F-1-002 and F-1-006 carry one P2 each into synthesis
- Blocked/productive carry-forward: productive -- the hook trust-boundary read opened two concrete fail-open asymmetries
- Required evidence: `changelog/v1.2.0.0.md` naming `/doctor:overlay apply --relayout`; a read of the engine's largest functions for duplication and naming drift; the packet docs against the shipped behaviour
- Recovery note: `node --test` on the engine suites still cannot run inside this lineage because the suites write fixtures outside the write surface; record that limit rather than claiming a pass

Review verdict: PASS
