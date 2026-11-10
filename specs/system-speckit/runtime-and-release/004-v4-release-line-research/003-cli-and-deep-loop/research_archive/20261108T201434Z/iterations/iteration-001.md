# Iteration 001 — v4.0.2.0: Hermes Removal and DeepSeek Harness Parity

## Focus

- (a) Hermes removal: classify every live `hermes` reference in `.skilled/skills/cli-external-orchestration/**`, `.skilled/skills/system-deep-loop/**` and `.skilled/commands/deep/**`.
- (b) DeepSeek Harness: check the v4.0.2.0 "DeepSeek Harness" claims (thirteen dispatch rules, three patches, pinned dsh release, two-id model roster) against the `cli-deepseek-harness` packet and the `dsh` builder in `fanout-run.cjs`.

## Actions Taken

1. Read the run config for the stable lineage id and the v4.0.2.0 release note.
2. Ran a repo-wide case-insensitive `hermes` grep over `.skilled`. The first 200 matches were all `trigger-index.json` entries for the historical `071-cli-hermes-creation` spec packet, so the result could not classify live references.
3. Ran targeted `hermes` greps over the three focus directories. Result: 15 matches in `cli-external-orchestration` changelogs, 1 in a `system-deep-loop` changelog, 0 in `commands/deep`.
4. Read `cli-deepseek-harness/SKILL.md` (203 lines) for the dispatch contract and the release-note claims.
5. Grepped `dsh` in `fanout-run.cjs` with six lines of context and read the builder, cleanup and completion-validation paths.

## Findings

### F1 — P2 drift + missing guard: the dsh working-directory rule differs across the release note, the packet and the fan-out builder

- Type: drift (release note vs packet vs code); missing guard (bug class).
- Release introduced: v4.0.2.0.
- The release note says every `dsh` command "must use a throwaway home folder and start outside the repository" [SOURCE: .skilled/changelog/skilled/v4.0.2.0.md:114].
- The packet documents a narrower rule and an explicit fan-out exception: a single dispatch uses a scratch cwd outside the checkout, but deep-loop fan-out "runs with `cwd` set to its lineage directory and a disposable `DSH_HOME` under the OS temp directory" [SOURCE: .skilled/skills/cli-external-orchestration/cli-deepseek-harness/SKILL.md:105]. The packet's NEVER list forbids only the repository root as cwd [SOURCE: .skilled/skills/cli-external-orchestration/cli-deepseek-harness/SKILL.md:116].
- The builder sets `cwd: path.resolve(options.lineageDir)` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3056]. It has `repoRoot` in scope [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3005] but never compares the resolved cwd to it, so the packet's narrower "never the repository root" rule is not enforced on the fan-out path.
- Impact: an operator auditing by the release note would flag every normal fan-out run as non-compliant; conversely, a malformed `lineageDir` that resolves to the checkout root would dispatch from the root because the builder does not refuse it. The normal caller supplies a lineage directory, so the guard gap is defense-in-depth, not a demonstrated live failure.
- Confidence: high that the three texts disagree; medium that the missing root check is reachable from a real caller.
- Verify: `rg -n "start outside the repository" .skilled/changelog/skilled/v4.0.2.0.md`; `rg -n "cwd: path.resolve\\(options.lineageDir\\)" .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`; `rg -n "Never start dsh with the repository root" .skilled/skills/cli-external-orchestration/cli-deepseek-harness/SKILL.md`.

### F2 — P2 operator UX: one error message covers two missing patches

- Type: improvement (operator UX).
- Release introduced: v4.0.2.0.
- The builder checks the route patch and the lineage patch in one condition and throws `cli-deepseek-harness route or lineage patch is missing` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3011] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3012]. A missing route patch and a missing lineage patch are indistinguishable, so the operator must inspect both paths.
- Confidence: high.
- Verify: `rg -n "route or lineage patch is missing" .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`.

### F3 — P2 drift (minor): the note's "three patches" is the base composition, not the maximum

- Type: drift (release note vs code).
- Release introduced: v4.0.2.0.
- The note says "Three small config files, called patches, shape each run" [SOURCE: .skilled/changelog/skilled/v4.0.2.0.md:106].
- The builder always adds the route, lineage and guards patches, then optionally adds a persona patch [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3021] and an MCP patch [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3039]. A run with both carries five patches.
- Impact: low; the sentence describes the core three and does not say "only". It still understates the argv an operator sees in a persona or MCP run.
- Confidence: high.
- Verify: `rg -n "Three small config files" .skilled/changelog/skilled/v4.0.2.0.md`; `rg -n "personaPatch|mcpPatch" .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`.

## Questions Answered

- Hermes removal: no live `cli-hermes`, `.hermes/` or `hermes` shell-function reference remains in the three focus directories. All 16 matches are changelog history: 15 in `cli-external-orchestration` changelogs [SOURCE: .skilled/skills/cli-external-orchestration/changelog/v1.5.0.0.md:13] [SOURCE: .skilled/skills/cli-external-orchestration/changelog/v1.7.13.0.md:25] [SOURCE: .skilled/skills/cli-external-orchestration/changelog/v1.7.14.0.md:24] [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/changelog/v1.5.11.0.md:16] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/changelog/v1.4.8.0.md:19] and 1 in a `system-deep-loop` changelog [SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/changelog/v1.8.2.0.md:23]. `commands/deep` returned no matches. The 200+ `trigger-index.json` matches are generated historical spec paths [SOURCE: .skilled/skills/system-spec-kit/runtime/data/trigger-index.json:4146], not executor routing.
- DeepSeek Harness: the packet and builder agree on the pinned dsh release (`0.2.2-rc.1`) [SOURCE: .skilled/skills/cli-external-orchestration/cli-deepseek-harness/SKILL.md:10] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2948], the three core patches [SOURCE: .skilled/skills/cli-external-orchestration/cli-deepseek-harness/SKILL.md:64] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3015], and the two-route shape [SOURCE: .skilled/skills/cli-external-orchestration/cli-deepseek-harness/SKILL.md:10] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3006]. The thirteen-rule claim is declared in the packet [SOURCE: .skilled/skills/cli-external-orchestration/cli-deepseek-harness/SKILL.md:98]; the `hard-rules.json` contents and the builder's rule-by-rule coverage were not opened, so that part is UNKNOWN. The cwd drift in F1 is the one substantive mismatch.

## Questions Remaining

- Does `hard-rules.json` contain exactly thirteen entries, and does the fan-out builder enforce all thirteen or a subset?
- What are the exact members of `DSH_ALLOWED_MODELS` and the value of `DSH_DEFAULT_MODEL`? Does the default match the verified LLM Gateway id?
- Are there live Hermes references outside the three focus directories, e.g. in `.skilled/hooks/**`, runtime mirrors, root commands or generated `.dsh/` adapters?
- Can any caller pass a `lineageDir` that resolves to the repository root, making F1's missing guard reachable?
- Does the deep-loop prompt builder load the packet's `cli-reference.md` and `prompt-quality-card.md` as SKILL.md §2 says every run does?

## Next Focus

- Finish v4.0.2.0 by opening `hard-rules.json` and the `DSH_ALLOWED_MODELS`/`DSH_DEFAULT_MODEL` constants, then move to fan-out parity across executor kinds (v4.0.0.0/v4.0.0.16).
