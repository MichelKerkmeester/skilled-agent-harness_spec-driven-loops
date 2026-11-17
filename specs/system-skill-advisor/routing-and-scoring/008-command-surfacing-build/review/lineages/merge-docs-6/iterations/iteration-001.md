# Review Iteration 001

## Dispatcher

- Lineage: `merge-docs-6`, area `merge-docs`.
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder).
- Focus: traceability. The pass-six operator focus is the merge-docs area: this branch's net change to the twelve files a merge with main resolved, checking that nothing main added was lost and that each documentation claim is true of the code. `review/review-brief-6.txt` and `review/review-scope-6.txt` were read first; this iteration covers the area they assign to `merge-docs-6`.
- Diff base: `git -c core.fsmonitor=false diff 695f4191d36620b42b5f76a28c25e460fccdd0f7 85550ee946e -- <path>` for each of the twelve scope paths. `695f4191d` is both the branch's merge base and main's tip at the final merge `c88dabe8292`, so the net diff is exactly the branch's divergence from main; every line main held is visible as unchanged or as a removal.
- Merge-loss method: for each merge commit in `695f4191..85550ee` that touched a scope file, main's merge-base-to-tip additions were compared with the merge result by line. Only later rewrites by the branch itself were reported, and each was read in context.

## Files Reviewed

| File | Lines read | What was checked |
|------|-----------|------------------|
| `.github/workflows/spec-kit-check.yml` | 1-80, 315-374 | The new comment, the path filters, the three added Vibe checks, and the claim that `command-tree-parity.yml` carries the same checks |
| `.skilled/agents/markdown.md` | 194-200, 287-293 | The `/create:sk-skill` rename in the command table and related-resources table |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json` | 1 | The generated policy-hash change only |
| `.skilled/changelog/skilled/v4.0.2.1.md` | 38-60, 97-125, 470-495 | Every changed claim against the code and the sibling changelogs |
| `.skilled/commands/doctor/scripts/README.markdown` | 99-115, 232-240 | `agents-md-check`, `agents-md-embed`, `hook-wiring-check` claims against their scripts |
| `.skilled/hooks/shared/session-readers/README.md` | 20-55 | Contained-open, Codex custom-tool, DSH source-less message, Devin fallback claims |
| `.skilled/skills/system-spec-kit/SKILL.md` | 1-6 | Version `2.13.4.0` |
| `.skilled/skills/system-spec-kit/changelog/v2.13.4.0.md` | 1-32 | Every claim against `sync-runtime-mirrors.cjs` and `command-metadata.json` |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | 68-80 | The `MK_` aliases and the direct-call abstain claim |
| `.vibe/agents/markdown.toml` | 1 | Mirror of the canonical agent body |
| `CONTRIBUTING.md` | 190-200 | `/create:sk-skill` rename |
| `README.md` | 676-686, 1234-1242, 1718-1726 | Health-record paragraph, brief format, command rename |

Context evidence (read-only, outside the twelve paths): `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs`, `.github/workflows/command-tree-parity.yml`, `.skilled/commands/doctor/scripts/hook-wiring-check.cjs`, `.skilled/commands/doctor/scripts/agents-md-check.cjs`, `.skilled/commands/doctor/scripts/agents-md-embed.cjs`, `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`, `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts`, `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts`, `.skilled/commands/doctor/assets/doctor-setup.yaml`, `.skilled/hooks/shared/session-readers/{codex,dsh,devin}.mjs`, `.skilled/skills/system-spec-kit/command-metadata.json`.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The release note's system-spec-kit range stops one version short** -- `.skilled/changelog/skilled/v4.0.2.1.md:480` -- The paragraph says `system-spec-kit` has changelog entries "for this release" from `v2.12.41.0 to v2.13.3.0`, but the same tree carries `version: 2.13.4.0` at `.skilled/skills/system-spec-kit/SKILL.md:5` and `.skilled/skills/system-spec-kit/changelog/v2.13.4.0.md:11`, and the merge commit added `v2.13.4.0.md` when it bumped the skill. The range should end at `2.13.4.0`, or the v2.13.4.0 entry needs its own release note.
   Finding class: instance-only
   Scope proof: `rg -n "v2\\.12\\.41\\.0 to v2\\.13\\.[0-9]\\.0"` over the twelve scope files returns only line 480; every other skill range on that line matches its `SKILL.md` version (`sk-doc` 2.10.0.0, `system-skilled-doctor` 1.1.7.0, `system-deep-loop` 2.0.2.0, `system-skill-advisor` 1.1.0.0), so this is the one stale range.
   Affected surface hints: release notes, system-spec-kit changelog index, upgrade checklist
   Case: A reader auditing what v4.0.2.1 contains reads the closing index, sees the `system-spec-kit` sequence end at 2.13.3.0, and never opens v2.13.4.0, so the release-level summary omits the "no command file named skill.md" rule that the same merge added.

2. **The README promises a health record on every prompt hook without the OpenCode exception** -- `README.md:682` -- The added paragraph says "Every prompt hook run also writes a small health record", but the OpenCode integration is the committed plugin `.opencode/plugins/system-skill-advisor.js`, which shells out to the advisor CLI and imports no diagnostics writer; only the Claude-family hook calls `persistAdvisorHookDiagnosticRecord`, and the repo's own setup contract says "OpenCode has no prompt hook that writes one" (`.skilled/commands/doctor/assets/doctor-setup.yaml:59`). The release note carves this out at `.skilled/changelog/skilled/v4.0.2.1.md:114` ("The OpenCode plugin writes none"), so the two shipped docs disagree.
   Finding class: instance-only
   Scope proof: `rg -n "persistAdvisorHookDiagnosticRecord" .opencode/plugins` returns nothing, while `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:258` is the only non-test binding; `rg -n "hookHealth" .opencode/plugins` also returns nothing.
   Affected surface hints: README advisor section, OpenCode plugin delivery path, advisor_status observability
   Case: An OpenCode user reads the README, runs one prompt, then `advisor_status`; the response has no `hookHealth` section because the plugin never wrote a record, so the README's promise does not hold on that runtime.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | The merge-loss sweep over all twelve paths found no line main held that the merge dropped; every removal in `695f4191d..85550ee946e` is a branch rewrite read in context, and the two P2 findings are doc-vs-code mismatches, not lost main content. |
| `checklist_evidence` | notApplicable | The review target has no `checklist.md` at the packet root; the pass-six brief and scope file are the operative checklist and both were read. |
| `skill_agent` | pass | `.skilled/agents/markdown.md:197` and `:290` name `/create:sk-skill`, and `.skilled/commands/create/sk-skill.md` exists with the matching router heading; no scope file still names `/create:skill` except historical changelog text. |
| `agent_cross_runtime` | pass | The `.vibe/agents/markdown.toml` instructions string is byte-identical to the canonical `.skilled/agents/markdown.md` body (275 lines each), and the Claude/Cursor/OpenCode/Pi agent mirrors carry the same rename. |
| `feature_catalog_code` | notApplicable | No feature-catalog claim is touched by the twelve paths. |
| `playbook_capability` | notApplicable | No manual-testing-playbook claim is touched by the twelve paths. |

## Integration Evidence

- `.github/workflows/spec-kit-check.yml:353-355` adds `sync-skills-vibe.cjs --check`, `sync-prompts-vibe.cjs --check` and `sync-agents-vibe.cjs --check`; all three files exist under `.opencode/skills/system-spec-kit/runtime/cli/vibe/` and under the `.skilled` source.
- `.github/workflows/command-tree-parity.yml:17-20,44-47` filters on `.skilled/skills/**/SKILL.md`, `.opencode/skills/**/SKILL.md` and `.vibe/**`, and its `vibe-mirror` job at `:182-187` runs the same three checks after installing the workspace, so the added comment at `spec-kit-check.yml:24-25` and `:71-72` is true.
- `.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:261-278` contains `collapseDrift` with no allowlist and a case-insensitive `skill.md` match; `:385` pushes its result into the drift list, so the v2.13.4.0 changelog's failure claim is true.
- `.skilled/skills/system-spec-kit/command-metadata.json:239-244` gained exactly four owned signals, matching the v2.13.4.0 "four plain-word intent phrases" claim.
- `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:235-273` reads `.vibe/hooks.toml` line by line, and `:327-357` requires a shell command that starts node on the marker; the README's TOML-limitation sentence is true.
- `.skilled/commands/doctor/scripts/agents-md-check.cjs:448,673,787,885` runs four owners as children, matching the README's "Four of them"; `.skilled/commands/doctor/scripts/agents-md-embed.cjs:1439` returns 3 after a failed post-backup write, and `:821-831` refuses a symlinked router or Cursor mirror.
- `.skilled/hooks/shared/session-readers/codex.mjs:114` keeps a custom tool body as `arguments.input`; `dsh.mjs:244-255` keeps a source-less `user/message` injected; `devin.mjs:397-405` falls back to the transcript before `store_unreadable`.
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:317-326` emits a `skipped` diagnostic even when the switch is off, and `:442` carries the degraded flag; `advisor-status.ts:501-512` exposes the `hookHealth` section the release note names.

## Edge Cases

- Iteration numbering: this is the lineage's first iteration (`deep-review-state.jsonl` had only the run-open row), so `iteration-001.md` is correct.
- Merge-loss line matching over-reports: a rewritten paragraph appears as many absent lines, so each candidate was read in context. The only surviving candidates were the `/create:skill` rename (intentional, documented as breaking) and version bumps where the branch held a newer value than main.
- The final merge `c88dabe8292` adds `.skilled/skills/system-spec-kit/changelog/v2.13.4.0.md` itself; `git log --follow` shows no earlier commit for the file. The version-range miss in finding 1 is therefore a merge-introduced omission, not a pre-existing main defect.
- The `started`/`offered`, `isolation-check.sh`, `node -e` arrow and older-goal-row limits named by the brief were not re-reported; none of them is this area's code and no new input breaks them.

## Confirmed-Clean Surfaces

- **Merge loss:** no line main held in the twelve paths was dropped. `README.md`, `CONTRIBUTING.md`, `.skilled/hooks/shared/session-readers/README.md` and `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` differ from main only by additions or by rewrites the branch made itself; the two comment lines main held in `spec-kit-check.yml` were replaced by a more specific version of the same rule.
- **Rename truth:** `/create:sk-skill` is the only command file; no `skill.md` remains in any runtime command tree, `.skilled/commands/create/sk-skill.md` exists, and `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:215` maps a typed `/create:skill` to it.
- **The 12-of-44 figure:** the create command folder held 13 command files at the base (12 siblings hidden by `skill.md`), and the advisor's generated bridge corpus holds 44 unique commands, so the release note's count is true.
- **The v2.13.4.0 rule:** `collapseDrift` matches `skill.md` in any capitalisation and has no allowlist; the old base version carried `COLLAPSE_ALLOWLIST = new Set(['create/skill.md'])`, so the "used to allow one" sentence is true.
- **Workflow coverage:** the command-tree-parity path filters and the `vibe-mirror` job match the added comment, and the three added Vibe scripts exist on both the source and `.opencode` sides.

## Ruled Out

- **A lost main sentence in `README.md` health or brief prose:** the net diff adds lines only; `git diff c88dabe8292^2 c88dabe8292 -- README.md` is empty.
- **A stale runtime mirror of the renamed markdown agent:** `.vibe/agents/markdown.toml`'s instructions payload equals the canonical body exactly, and the other runtime mirrors carry the new spelling.
- **A false TOML-parser claim in the doctor README:** the `command` regex at `hook-wiring-check.cjs:263` really does reject a trailing comment or a single-quoted command, so the stated `hook-missing` outcome is accurate.
- **A false "four children" claim:** four `spawnSync` calls exist in `agents-md-check.cjs`; the stale "three child tools" wording lives in that script's own header comment, outside the twelve review paths, and is not a defect in the changed README.
- **A release-note claim that `/create:skill` still has a command alias:** no command file or runtime mirror answers to it; the only alias is the advisor's typed-input mapping, which the body states.

## Next Focus

- Dimension: correctness and security
- Focus area: the merge-added CI checks and the doc-authored behaviors they assert, plus the security posture of the new Vibe hook-wiring reading and the generated manifest change
- Reason: traceability is swept; the remaining risk is whether the added checks can pass while doing nothing, or can be made to read a command it should not trust
- Rotation status: traceability complete; correctness and security not started
- Required evidence: per-claim code or workflow read with file:line, and one concrete failing input per candidate
- Recovery note: none

Review verdict: PASS
