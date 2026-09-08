# sk-code-review changelog digest

Skill path: `.opencode/skills/sk-code/sk-code-review/` (changelog at `changelog/`). Versions covered: v1.0.0.0 through v1.6.0.0, all 7 entries that exist (fewer than 10). No entry carries a date field in its frontmatter or body, so no date range can be stated.

---

## Per version, newest first

### v1.6.0.0

`v1.6.0.0.md` rewrites the mode README as a purpose-first narrative on the refined skill README template, using the mcp-obsidian README as the reference shape. The README now opens with a one-line pitch blockquote and a problem-first OVERVIEW instead of an AT A GLANCE feature table, the severity taxonomy gets its own capability table inside OVERVIEW and the status-line triplet moves into a bullet list that keeps the canary strings intact. Every command, path, trigger phrase and invocation note from the previous version survives. The entry also re-aligns the README frontmatter version from `1.0.0.0` to `1.6.0.0` so the README matches the changelog lineage. Routing, trigger phrases, severity labels and the output contract are unchanged.

### v1.5.0.0

REMOVED from `references/`: `v1.5.0.0.md` moves six review checklists out of `references/` and into a new `assets/` folder, because they are artifacts a reviewer applies rather than doctrine a reviewer reads. MOVED PATH: `code_quality_checklist.md`, `security_checklist.md`, `solid_checklist.md`, `test_quality_checklist.md`, `fix-completeness-checklist.md` and `removal_plan.md` all go from `references/` to `assets/`, and the entry states that any external reference to `sk-code-review/references/<name>.md` for one of those files must be updated to `sk-code-review/assets/<name>.md`. Four genuine references stay behind: `review_core.md`, `review_ux_single_pass.md`, `quick_reference.md` and `pr_state_dedup.md`. The moved files also gain the asset template's `### Usage` subsection, `fix-completeness-checklist.md` gets restructured to match its siblings and the `SKILL.md` §2 Resource Domains prose is re-pathed. Nineteen manual-testing files, `graph-metadata.json`, the README table, sibling cross-links and two cross-skill `sk-code/references/opencode/{python,shell}/quality-standards.md` pointers were repointed in lockstep.

### v1.4.0.0

`v1.4.0.0.md` folds the sk-code-review slice of the packet 146 ponytail-based refinement into the review baseline, adding five review teachings on top of the existing contract without moving any floor. Two new §6 Maintainability rows in the code-quality checklist name hand-rolled standard-library behavior and custom code duplicating a native platform capability. A new §7 needed-ness prompt asks whether code was ever asked for and recommends removal rather than only simplification, defaulting to P2 and escalating to P1 when the unneeded code adds attack surface or contract obligations, with a new `Replacement` field on the removal-plan safe-to-remove-now table. A new §7 rule treats a concrete `ceiling:` comment as evidence that a too-simple KISS or YAGNI finding was deliberate and downgrades that P2, but never for security, authentication, persistence, sandboxing, public-contract or correctness findings. A new §9.3 `SK_CODE_REVIEW_DEPTH=lite|full|ultra` alias names and persists routing that already existed, resolved env over config over default, with `full` as the unset default. Finally a new `scripts/check-rule-copies.js` canary plus `scripts/check-rule-copies.test.sh` and a `.github/workflows/rule-canary-sync.yml` workflow assert that the `Review status:` verdict triplet and the cross-document Iron Law wording still read identically across `SKILL.md`, `README.md`, the v1.3.0.0 changelog, the dedup reference, root `CLAUDE.md` and `AGENTS.md`. The canary is a checker, never a generator, and the CI workflow fails closed if the canary is deleted or moved.

### v1.3.0.0

`v1.3.0.0.md` lands the sk-code-review portion of the packets 108 plus 110 auto-review uplift, applying five teachings distilled from a deep-research pass over the upstream `dzianisv/opencode-plugins` auto-review package, each cleared by a 5-of-5 unanimous deep-ai-council review via `cli-codex gpt-5.5 xhigh fast`. Every review output must now end with a plain-text final line of the form `Review status: APPROVED`, `Review status: REQUESTED_CHANGES` or `Review status: COMMENTED`, deliberately not Markdown bold, with the SKILL.md NEVER section forbidding any other final line. A `CODE-REVIEW` marker is injected at the start of the rendered-prompt boundary in the dispatcher YAMLs `deep_start-review-loop_auto.yaml` and `deep_start-review-loop_confirm.yaml`, with a `step_marker_scan` that fails fast if the marker is missing. An anti-repetition rule forbids restating a finding already reported in an earlier iteration of the same review. A pull-request-state dedup cache rooted at `.opencode/.sk-code-review-cache/` keys cached verdicts by `sha256(repo + pr_number + head_sha + base_sha + changed_files_digest)` and short-circuits a re-review with the prior verdict plus provenance, invalidating automatically when any keying input changes, documented in the new `references/pr-state-dedup.md`. An opt-in minimum-evidence gate controlled by `SK_CODE_REVIEW_MIN_CHANGED_LINES` can short-circuit a review on a small diff but never skips changes touching security, authentication, configuration, persistence, dependencies, sandbox boundaries or public-facing paths. The entry states the default is unchanged from prior releases and no migration is required. Source commits 73e9e361e, 74782acfb and baaeaad52.

### v1.2.0.0

`v1.2.0.0.md` is a low-content generated entry. It says the release updates sk-code-review with clearer support for prompt-writing guidance and git workflows, without naming a concrete mechanism. Files listed as modified are `SKILL.md`, `references/code-quality-checklist.md` and `references/solid-checklist.md`. No migration required.

### v1.1.0.0

`v1.1.0.0.md` is a low-content generated entry with near-tautological prose about "introduces and sk code review". Files listed as modified are `SKILL.md`, `README.md` and five files under `references/`: `quick-reference.md`, `security-checklist.md`, `code-quality-checklist.md`, `solid-checklist.md` and `removal-plan.md`. No migration required.

### v1.0.0.0

RENAME and MOVED PATH: `v1.0.0.0.md` records that the standalone `sk-code-review` skill was folded into the `sk-code` parent hub as its findings-first `code-review` workflow mode, with every `sk-code-review` name reference repointed to the sk-code hub. The entry establishes the mode contract in `SKILL.md` as a stack-agnostic findings-first review baseline paired with sk-code surface-standards evidence, severity-ranked findings with `file:line` evidence and mandatory security and correctness minimums, plus `README.md`, four references (`review_core.md`, `review_ux_single_pass.md`, `pr_state_dedup.md`, `quick_reference.md`), the six reusable checklists under `assets/`, a manual-testing playbook of nine routing scenarios, `router-mode-a` and `live-mode-b` benchmark baselines and `scripts/check-rule-copies.js`. The mode produces findings-first output and never edits the code under review. Note the ordering quirk the entry itself calls out: v1.0.0.0 is the hub-establishment entry, while v1.1.0.0 through v1.5.0.0 predate it chronologically and are retained unchanged from the standalone skill lineage.

---

## Facts the v4 draft gets wrong or misses

Compared against `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md`. Nothing in the seven entries contradicts the draft outright. What follows is missing coverage.

- The machine-parsable final-line verdict contract is absent from the draft. `v1.3.0.0.md` makes `Review status: APPROVED` / `REQUESTED_CHANGES` / `COMMENTED` a mandatory last line that downstream consumers grep. The draft describes review only as a baseline-plus-overlay rebuild at line 315 and line 459 and never mentions the output contract, which is the part a consumer can break against.
- The two opt-in environment knobs are absent. `SK_CODE_REVIEW_MIN_CHANGED_LINES` (`v1.3.0.0.md`) and `SK_CODE_REVIEW_DEPTH=lite|full|ultra` (`v1.4.0.0.md`) are both user-facing controls. The draft's "Changed defaults" bullet at line 446 lists other defaults but neither of these, and no other line in the draft names them.
- The pull-request-state dedup cache is absent. `v1.3.0.0.md` creates `.opencode/.sk-code-review-cache/` with a documented content-hash key and invalidation rule. The draft never mentions a review cache, though the sk-code `mode-registry.json` still declares `"backendKind": "review-cache"` for this mode.
- The checklist relocation is missing from the migration section. `v1.5.0.0.md` explicitly states that any external reference to `sk-code-review/references/<name>.md` for one of the six moved checklists must become `sk-code-review/assets/<name>.md`. The draft's "Repoint what moved" bullet at line 444 covers the sk-code flat-path move in general terms but not this specific within-mode relocation, which is the kind of path a downstream repo is most likely to have hard-coded.
- The rule canary and its CI gate are absent. `v1.4.0.0.md` adds `scripts/check-rule-copies.js`, its self-test and `.github/workflows/rule-canary-sync.yml`, which fails closed if the canary is deleted or moved and which asserts Iron Law wording in root `CLAUDE.md` and `AGENTS.md`. The draft at line 309 mentions only "a pre-commit hygiene gate that had been silently skipped", a different gate.
- The behavioral review teachings are absent. The anti-repetition rule (`v1.3.0.0.md`), the reinvent-the-wheel maintainability rows, the needed-ness removal prompt and the `ceiling:` intentional-simplification downgrade (all `v1.4.0.0.md`) change what a reviewer flags. The draft says review was "rebuilt as a stack-agnostic baseline" at lines 315 and 459 without naming any of them.
- Minor, verified on disk rather than in the entries: `v1.0.0.0.md` and `v1.5.0.0.md` cite underscore filenames (`review_core.md`, `pr_state_dedup.md`, `code_quality_checklist.md`, `removal_plan.md`) but the shipped files are hyphenated (`review-core.md`, `pr-state-dedup.md`, `code-quality-checklist.md`, `removal-plan.md`). The changelog entries were not updated by the later kebab-case migration. The draft does not mention this, and it is a real trap for anyone following the v1.5.0.0 upgrade instruction literally.

---

## Current version and identity

- `SKILL.md` frontmatter version: `1.0.0.0` (`.opencode/skills/sk-code/sk-code-review/SKILL.md`, `version: 1.0.0.0`).
- Discrepancy worth flagging: the README frontmatter reads `version: 1.6.0.0` and the changelog lineage runs to v1.6.0.0, so `SKILL.md` is five entries behind both. `v1.6.0.0.md` re-aligned only the README and left `SKILL.md` at `1.0.0.0`.
- Identity: a MODE, not a hub and not standalone. There is no `mode-registry.json` at `.opencode/skills/sk-code/sk-code-review/`. The parent `.opencode/skills/sk-code/` holds `mode-registry.json`, `hub-router.json`, `description.json` and `graph-metadata.json`, and its registry lists `"workflowMode": "sk-code-review"` with `"packetKind": "workflow"`, `"backendKind": "review-cache"` and `"advisorRouting": {"routingClass": "metadata"}`, meaning the mode reaches the advisor through the sk-code hub identity rather than through an advisor entry of its own.
