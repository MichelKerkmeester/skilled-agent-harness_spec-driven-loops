### V17
VERDICT: REFUTED
SEVERITY: propose P2 because the current logs contain canonical iteration rows, with no evidence that the gateway dropped them
EVIDENCE: `.skilled/skills/system-deep-loop/runtime/references/state-format.md:153` - the canonical row is `type: iteration`; `iteration_start` is not a final iteration record. The child log at `.../003-cli-and-deep-loop/research/deep-research-state.jsonl:5` has an iteration row; the read-only summary counted 26 iterations and zero containment or `iteration_start` rows.
COMMAND: Read-only recursive JSONL summary -> exit 0
CORRECTED CLAIM: -

### V18
VERDICT: CHANGED
SEVERITY: agree P1
EVIDENCE: `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:36` pins `0.99.2`; `:319-336` resolves the package manifest before `:374` compares versions. The installed command reports `1.5.0`, but the manifest probe found no matching package. Lines `:47-48` and `:399-403` explicitly report the fallback: `using jev CLI`.
COMMAND: `pi --version` and read-only package-manifest resolution probe -> exit 0
CORRECTED CLAIM: Pi transport is unavailable for the installed executable, but the evidence points to package resolution failing before the version comparison. The fallback to Jev CLI is reported, not silent.

### V19
VERDICT: CHANGED
SEVERITY: agree P1
EVIDENCE: `.skilled/skills/cli-classifier/ROUTER.md:67` and `cli-jev/ROUTER.md:117` advertise `jev urgency check`, `jev yes or no` and `jev probability`. `hub-router.json:33` has the longer keyword `jev probability judgment`, but not those exact entries. Compiled-route probes for all three standalone phrases returned `action: defer`.
COMMAND: `node .skilled/bin/compiled-route.cjs --hub cli-classifier --prompt '<phrase>'` for the three phrases -> exit 0
CORRECTED CLAIM: The three exact phrases are absent as hub-router keywords, though `jev probability` occurs within the longer `jev probability judgment` entry. Each standalone phrase defers at stage one.

### V20
VERDICT: CHANGED
SEVERITY: agree P1
EVIDENCE: `.skilled/skills/cli-external-orchestration/hub-router.json:104-130` contains routing vocabulary, while `mode-registry.json:37-49` has a separate alias list. The advisor command returned only `sk-code`; a compiled-route probe for the same prompt returned `cli-deepseek-harness`, while `opencode` alone returned `cli-opencode`.
COMMAND: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"opencode go route this task"}' --format json`; compiled-route probes -> exit 0
CORRECTED CLAIM: The advisor returns a single `sk-code` recommendation, not a ranking against `cli-external-orchestration`. Separately, compiled routing misroutes the full prompt to `cli-deepseek-harness`.

### V21
VERDICT: CONFIRMED
SEVERITY: agree P1
EVIDENCE: `.skilled/skills/cli-external-orchestration/SKILL.md:189` requires the resolved persona on every external dispatch. The prompt template at `.../deep-research/assets/prompt-pack-iteration.md.tmpl:2` carries a route line naming `@deep-research`, but no persona. `fanout-run.cjs:1629-1640` tells the child to read the persona file by path; the canonical prompt contract at `sk-prompt/assets/cli-prompt-quality-card.md:147` says the fanout runtime must inline it.
COMMAND: `nl -ba` reads of the cited skill, template and prompt assembly -> exit 0
CORRECTED CLAIM: -

### V22
VERDICT: CONFIRMED
SEVERITY: agree P1
EVIDENCE: `.../deep-research/assets/prompt-pack-iteration.md.tmpl:36` hardcodes `Max 12 tool calls total`; `deep-research-config.json:12` sets `maxToolCallsPerIteration` to `24`. The renderer at `runtime/lib/deep-loop/prompt-pack.ts:73-80` substitutes template tokens, but the budget line has no config token.
COMMAND: `rg -n 'maxToolCallsPerIteration' .skilled/skills/system-deep-loop -> exit 0`
CORRECTED CLAIM: -

### V23
VERDICT: CONFIRMED
SEVERITY: propose P2 because no production runtime importer was found, so the size alone does not show a user-facing failure
EVIDENCE: The module’s non-test TypeScript files total 3,117 lines. Its only runtime-tree importers are type-only: `mode-contracts/substrate-ports.ts:10` and `conditional-fanin/types.ts:16-19`. The remaining imports found are in unit tests.
COMMAND: `rg -n 'branch-leases-waves' .skilled/skills/system-deep-loop --glob '*.{ts,mts,cts,js,mjs,cjs}' --glob '!**/tests/**'`; `find ... | xargs wc -l` -> exit 0
CORRECTED CLAIM: -

### V24
VERDICT: CHANGED
SEVERITY: propose P2 because the package behavior is documented and the create.sh attribution is not confirmed
EVIDENCE: `package_skill.py:1955-1957` says `--strict` applies under `--check` or `--json`; `:1990-1996` packages otherwise, defaulting to the current directory at `:1843-1848`. Decision record `003-cli-and-deep-loop/decision-record.md:141` says containment recorded the three zip writes but did not revert them. Record `001-spec-kit-core/decision-record.md:491` says `specs/001-test-feature/` matched the create.sh probes and that no containment event recorded it.
COMMAND: `nl -ba` reads of `package_skill.py` and `rg -n` over the decision records -> exit 0
CORRECTED CLAIM: The `--strict` invocation without `--check` wrote three zips to the repository root, and containment recorded but did not revert them. The packet records the test-feature directory as created during the probe window and matching create.sh probes, but says containment did not record that directory; the attribution to create.sh is circumstantial.

BATCH DONE