# Lead Steer: Review Scope and Rulings

These rulings are the dispatcher's answers for this lineage. They bind inside the lineage directory and grant no write outside it.

## 1. Review Target

The bound `spec_folder` names the packet that owns the writes. The review target is the shipped work of the v4.0.0.12 release, not the packet's spec docs. Review these files for perfect adherence to the repository's authoring standards and for correct cross-repo references. All advisor paths are under `.skilled/skills/system-skill-advisor/`.

**Advisor code**
- `runtime/lib/render.ts`, `runtime/lib/scorer/fusion.ts`, `runtime/lib/scorer/projection.ts`, `runtime/scripts/skill_advisor.py`
- `runtime/scripts/command-bridges/` (`derive-command-bridges.cjs`, `scoring-compatibility.json`, `README.md`)
- `hooks/claude/user-prompt-submit.ts`, `hooks/pi/prompt-advisor.ts`
- `.opencode/plugins/system-skill-advisor.js`, `.opencode/plugins/lib/skill-advisor-render.js`
- `.skilled/commands/doctor/scripts/doctor-phrase-reach.cjs`
- New tests under `runtime/tests/`: `doctor-*.vitest.ts`, `hooks/doctor-setup-hint*`, `scorer/doctor-ordering*`, and `runtime/stress-test/skill-advisor/single-writer-lease-stress.vitest.ts`

**Command**
- `.skilled/commands/doctor/setup.md`, `assets/doctor-setup.yaml`, `assets/doctor-setup-presentation.txt`
- The `/doctor:setup` and `/doctor:skill-advisor` routes in `.skilled/commands/doctor/_routes.yaml`, `assets/doctor-router-reach.yaml`, `assets/doctor-skill-advisor-rebuild.yaml`
- The five runtime mirrors: `.claude/commands/doctor/setup.md`, `.codex/prompts/doctor-setup.md`, `.cursor/commands/doctor-setup.md`, `.pi/prompts/doctor-setup.md`, `.hermes/prompts/doctor-setup.md`

**Skill docs**
- Advisor playbook scenarios DOC-385 to DOC-391 in `manual-testing-playbook/doctor-commands/` and the playbook index
- Feature catalog leaves `feature-catalog/scorer-fusion/doctor-command-routing.md`, `feature-catalog/hooks-and-plugin/claude-hook.md`, `feature-catalog/hooks-and-plugin/opencode-plugin-bridge.md` and `feature-catalog/feature-catalog.md`
- `hooks/skill-advisor-hook.md`, `hooks/pi/README.md`, the advisor `README.md` and `SKILL.md`

**Cross-repo**
- Root `README.md` (the doctor command list and the `/doctor:setup` entry), `.skilled/commands/README.txt`
- `.skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md`, and the system-spec-kit `SKILL.md` where it names doctor commands

**Changelogs**
- `.skilled/skills/system-skill-advisor/changelog/v0.16.0.0.md`, `.skilled/skills/system-spec-kit/changelog/v2.8.0.0.md`, `.skilled/changelog/skilled/v4.0.0.12.md`

## 2. Standards to Judge Against

- Each doc artifact against its sk-doc authoring mode contract: `.skilled/skills/sk-doc/sk-create-command/` (router, presentation and YAML split, runtime mirrors), `sk-create-manual-testing-playbook/`, `sk-create-feature-catalog/`, `sk-create-readme/`, `sk-create-skill/`, `sk-create-changelog/`, and the Human Voice Rules in `sk-create-with-human-voice/`.
- Code against `.skilled/skills/sk-code/sk-code-opencode/`: SKILL.md section 3 including "plugins never write to the TUI", the TypeScript, JavaScript and Python checklists in `assets/checklists/`, and the shared references.
- Check that every place in the repo that lists doctor commands or advisor capabilities names `/doctor:setup` and the doctor routing correctly, that every path and command a doc cites exists and runs as written, and that the root README points to it where a user would look.

## 3. Dimensions

Correctness, traceability, maintainability, and standards conformance. Record standards-conformance findings under the maintainability dimension. Security is secondary: report a security defect if you see one, but do not spend an iteration on it.

Spread the five iterations so each scope group above gets a deep pass. Suggested order: inventory plus advisor code correctness, command and mirrors, skill docs, cross-repo references and the root README, changelogs plus a final cross-check of earlier findings.

## 4. Rulings

- Use the repo's own validators where they exist: `validate_document.py`, `hvr_scan.py`, the playbook and catalog validators, `route-validate.sh`, `command-catalog-mirror-check.cjs`, the sk-code drift guards. Run Python with `PYTHONDONTWRITEBYTECODE=1` so no `__pycache__` is written outside this directory. Send any validator output file into this lineage directory.
- Do NOT run vitest, tsc builds, npm installs, or any test runner: they write caches outside this directory. Read the tests instead.
- Prefix every git command with `GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.fsmonitor GIT_CONFIG_VALUE_0=false`. Read-only git only (log, show, diff, ls-files).
- Cite `path:line` for every finding, with a concrete failure case: what a reader or runtime does, and what goes wrong. A finding without a failure case is at most P2.
- Every iteration state record carries the route-proof fields: `"mode":"review"`, `"target_agent":"deep-review"`, `"agent_definition_loaded":true`, `"resolved_route":"Resolved route: mode=review target_agent=deep-review"`.
- Do not edit any file under review. Write only inside this lineage directory.
