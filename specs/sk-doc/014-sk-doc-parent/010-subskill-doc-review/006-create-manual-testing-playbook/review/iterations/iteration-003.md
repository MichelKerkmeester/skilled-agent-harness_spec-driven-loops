# Deep Review Iteration 003

## Dispatcher

- Command: `/deep:review:auto`
- Target agent: `deep-review`
- Resolved route: `/deep:review:auto -> .opencode/agents/deep-review.md`
- Agent definition loaded: true
- Mode: `review`
- Review target: `.opencode/skills/sk-doc/create-manual-testing-playbook/`
- Review target type: `skill`
- Focus: correctness — tool/script/flag claim verification and template/section claim fidelity
- Budget profile: verify
- Status: complete

## Files Reviewed

- `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md`
- `.opencode/skills/sk-doc/create-manual-testing-playbook/README.md`
- `.opencode/skills/sk-doc/create-manual-testing-playbook/references/README.md`
- `.opencode/skills/sk-doc/create-manual-testing-playbook/references/prompt_voice.md`
- `.opencode/skills/sk-doc/create-manual-testing-playbook/references/examples.md`
- `.opencode/skills/sk-doc/create-manual-testing-playbook/assets/testing_playbook/manual_testing_playbook_template.md`
- `.opencode/skills/sk-doc/create-manual-testing-playbook/assets/testing_playbook/manual_testing_playbook_snippet_template.md`
- `.opencode/skills/sk-doc/shared/scripts/`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Root template still tells per-feature prompts to follow RCAF even though the workflow defaults to natural-human voice** -- `.opencode/skills/sk-doc/create-manual-testing-playbook/assets/testing_playbook/manual_testing_playbook_template.md:291` -- The primary workflow states the canonical `Prompt:` field defaults to natural-human voice and uses the RCAF wrapper only when the actor is an AI orchestrator [SOURCE: `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md:219`; SOURCE: `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md:221`; SOURCE: `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md:239`]. The dedicated per-feature snippet template correctly repeats that conditional rule [SOURCE: `.opencode/skills/sk-doc/create-manual-testing-playbook/assets/testing_playbook/manual_testing_playbook_snippet_template.md:76`]. The root template's orchestration section, however, says per-feature files should contain a “Prompt field following the Role -> Context -> Action -> Format contract” [SOURCE: `.opencode/skills/sk-doc/create-manual-testing-playbook/assets/testing_playbook/manual_testing_playbook_template.md:291`]. This is not a fabricated tool claim, but it is an outdated section/template claim that can push generated playbooks toward RCAF-only prompts.
   - Finding class: cross-consumer
   - Scope proof: Compared the primary workflow prompt rule, the dedicated snippet template, and the root template's per-feature guidance; only the root template line carries the unconditional RCAF-style wording.
   - Affected surface hints: [`root playbook template`, `per-feature prompt guidance`, `generated scenario prompts`]
   - Recommendation: Replace the root-template line with the current conditional wording: natural-human by default; use RCAF only when the actor is an AI orchestrator, linking to `references/prompt_voice.md` if needed.

## Traceability Checks

- Tool/script names verified: shared scripts directory contains `validate_document.py`, `extract_structure.py`, and `quick_validate.py`; README claims only `validate_document.py` and `extract_structure.py` as shared validators [SOURCE: `.opencode/skills/sk-doc/create-manual-testing-playbook/README.md:33`].
- Packet-local script claim verified: `.opencode/skills/sk-doc/create-manual-testing-playbook/scripts` is absent, matching the README claim that no packet-local `scripts/` directory currently exists [SOURCE: `.opencode/skills/sk-doc/create-manual-testing-playbook/README.md:32`].
- Validator flags verified: `validate_document.py --help` exposes `--type`, `--json`, `--blocking-only`, `--fix`, `--dry-run`, and `--no-exclude`; the reviewed docs only claim/use `--type reference` in command examples [SOURCE: `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md:260`; SOURCE: `.opencode/skills/sk-doc/create-manual-testing-playbook/README.md:63`].
- `extract_structure.py` invocation verified: `extract_structure.py --help` accepts a single `filepath`, matching the examples in `SKILL.md` and `README.md` [SOURCE: `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md:261`; SOURCE: `.opencode/skills/sk-doc/create-manual-testing-playbook/README.md:64`].
- `check-markdown-links.cjs` tool-name claim is not fabricated; the script exists at `.opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs`. Its exact CI coverage was not re-proven in this LEAF iteration.
- Asset backlink claims verified: the packet-local `assets/testing_playbook/` directory contains `manual_testing_playbook_template.md` and `manual_testing_playbook_snippet_template.md`; reference backlinks to those files resolve.
- Validation re-run: `validate_document.py` returned valid for `SKILL.md`, `README.md`, all four reference files, and both asset templates; asset templates still emit only non-blocking numbering warnings.

## Integration Evidence

- `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py --help`
- `python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py --help`
- `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py <target-doc> --type skill|readme|reference`
- Directory reads for `.opencode/skills/sk-doc/shared/scripts/` and `.opencode/skills/sk-doc/create-manual-testing-playbook/assets/testing_playbook/`
- Glob check for `.opencode/**/check-markdown-links.cjs`

## Edge Cases

- Existing P1/P2 findings remain active and were not re-filed as new findings.
- The `check-markdown-links.cjs` claim was verified at the tool-name/file-existence level only; CI breadth was not dynamically executed.
- `validate_document.py` warnings on asset templates remain non-blocking and are not promoted beyond prior carry-forward unless they affect a concrete template claim.

## Confirmed-Clean Surfaces

- No fabricated shared validator script names found in `SKILL.md`, `README.md`, references, or asset backlinks.
- No fabricated `validate_document.py` flags found in the reviewed docs.
- Packet-local assets named by `SKILL.md`, `README.md`, and references exist on disk.
- `extract_structure.py` command examples match the script's actual positional-argument interface.

## Ruled Out

- New P0/P1 in iteration 003: ruled out; the only new issue is a non-blocking template wording mismatch.
- Fabricated packet-local scripts: ruled out by README claim plus absent packet-local `scripts/` directory.
- Missing shared `validate_document.py` or `extract_structure.py`: ruled out by shared scripts directory and help output.
- Fabricated `--type` validator flag: ruled out by `validate_document.py --help`.

## Next Focus

- dimension: security
- focus area: safety boundaries, destructive-scenario handling, privileged access expectations, and release-readiness risk without re-filing known template/docs drift
- reason: Correctness claim verification is complete; final LEAF iteration should cover the remaining security/safety dimension before orchestrator synthesis.
- rotation status: traceability, maintainability, and correctness completed; security remains.
- blocked/productive carry-forward: productive — no fabricated tool/flag claims found; one P2 template claim mismatch added; blocked — reducer/final report and iteration 004 remain orchestrator-owned.
- required evidence: `SKILL.md` ESCALATE/RULES sections, root template destructive scenario guidance, snippet execution policy, validation/release gates
