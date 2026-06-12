# Iteration 014 (wave 2, gpt-5.5-fast xhigh) — R8 CI golden-fixture lint design

**Verdict:** A golden-fixture lint is feasible and should be implemented as deterministic CI for contract drift: template shape, router linkage, forbidden vocabulary, expected fixtures, and recorded transcript metadata. It cannot prove live dynamic model adherence without a correct `--command` transcript or a mechanical renderer; use it as PR guard plus separate live/recorded probe evidence.

## [CONSTRAINT] R8 Is A Drift Guard
- Evidence: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/029-deep-research-remediation/L8-command-adherence/disposition.md:32 — "R8 CI golden-fixture lint: lints artifacts, cannot observe model behavior, and would NOT have caught this bug"
- Detail: The repo's latest disposition demotes CI golden-fixture lint from true adherence mechanism to artifact consistency guard. It can prove contracts and committed captures are shaped correctly, but not that a model will honor them in a fresh dynamic run.
- Recommendation: Name the CI job `render-contract-drift`, not `adherence`; pair it with a separate live or recorded-transcript probe gate when behavioral evidence is required.

## [MECHANISM] Use Structural Guard Pattern
- Evidence: .opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh:8 — "Four structural checks (no semantic/NLP matching — pointer presence,"
- Detail: The existing guard is deterministic: fixed file inventory, regex checks, Python JSON parsing, PASS/FAIL lines, exit 1 on drift. Render-contract lint should copy that style rather than invoking models.
- Recommendation: Add `node .opencode/commands/scripts/check-render-contracts.cjs <repo-root>` with `CHECK 1..N`, per-surface `PASS/FAIL`, final `GUARD PASS/FAIL`, and exit code 1 for any missing token, fixture drift, or forbidden vocabulary.

## [REFINEMENT] Static Envelope Is Checkable
- Evidence: .opencode/commands/memory/assets/search_presentation.txt:41 — "MEMORY:SEARCH \"<query>\" intent=<detected_intent> results=<count>"
- Detail: Without a live model, CI can check that each presentation asset has required fenced templates, header regex, divider, footer regex, row shape, field mapping, score format rule, and forbidden-vocabulary rules. It can also check router files reference and load the presentation asset before rendering.
- Recommendation: Use a manifest entry per surface: `{id, router, presentation, templateSection, requiredHeaderRegex, requiredFooterRegex, rowRegexes, forbiddenRegexes, allowedInlineCopies}`.

## [CONSTRAINT] Captured Diff Needs Transcript
- Evidence: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/029-deep-research-remediation/L8-command-adherence/probe.sh:28 — "grep -qE '^MEMORY:SEARCH \".+\" intent=[a-z_]+ results=[0-9]+' \"$f\""
- Detail: A golden expected-envelope fixture can be diffed against a captured render only if CI has either a deterministic renderer output or a committed transcript. Dynamic result content cannot be regenerated model-free unless the fixture owns the data source and renderer.
- Recommendation: Store `expected.txt`, optional `captured.txt`, and `capture-metadata.json` per fixture; CI normalizes whitespace/code fences, checks ordered regex matches, and fails if metadata lacks `command`, `args`, `model`, `variant`, `opencodeVersion`, `capturedAt`, and `dispatch=--command`.

## [MECHANISM] Reject Bad Capture Protocol
- Evidence: .opencode/skills/cli-opencode/SKILL.md:268 — "slash-command text inside a `run` message is NOT expanded"
- Detail: Recorded transcript fixtures are only meaningful if produced through the registered command runtime. Raw slash-text captures test the wrong path and should be accepted only as labeled negative controls.
- Recommendation: Make transcript lint fail unless the metadata invocation includes `opencode run --command <family>/<name>`; allow `raw-slash-negative-control=true` only for negative-control fixtures.

## [NEW-FEATURE] Wire Like Existing CI
- Evidence: .github/workflows/prompt-card-sync.yml:15 — "GUARD=\".opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh\""
- Detail: The repo already wires deterministic guards through a PR workflow that checks out the repo and runs a standalone script. Render-contract lint should follow the same CI shape.
- Recommendation: Add `.github/workflows/render-contract-sync.yml` on PR to `main`, run `node .opencode/commands/scripts/check-render-contracts.cjs .`, and archive an optional JSON report with per-command failures.

## [REFINEMENT] Manual Playbook Supplies Evidence Contract
- Evidence: .opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md:75 — "Exact command transcript or MCP call payload."
- Detail: Manual playbooks already define the evidence shape for behavioral validation: command transcript, JSON/MCP excerpt, exit code, and verdict. CI can validate committed evidence completeness, while live model capture remains a manual/nightly concern.
- Recommendation: Add per-command playbook scenarios that point to the golden fixture IDs; CI checks fixture completeness, and release/manual runs refresh the transcript fixtures through `probe.sh` or command-specific gauntlets.
