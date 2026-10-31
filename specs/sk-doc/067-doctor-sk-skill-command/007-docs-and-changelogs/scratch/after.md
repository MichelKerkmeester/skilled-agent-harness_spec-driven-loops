# Doc gates and evidence, final state, 2026-10-30

$ python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py README.md .skilled/commands/README.txt .skilled/commands/doctor/scripts/README.markdown .skilled/skills/sk-doc/feature-catalog/feature-catalog.md .skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/manual-testing-playbook.md
PASS README.md: references=386 unresolved=0 examples=0 allowed=0
PASS .skilled/commands/README.txt: references=105 unresolved=0 examples=0 allowed=0
PASS .skilled/commands/doctor/scripts/README.markdown: references=179 unresolved=0 examples=0 allowed=0
PASS .skilled/skills/sk-doc/feature-catalog/feature-catalog.md: references=38 unresolved=0 examples=0 allowed=0
PASS .skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/manual-testing-playbook.md: references=57 unresolved=0 examples=0 allowed=0
SUMMARY files=5 pass=5 fail=0
EXIT=0

$ node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --skill sk-doc
OK   [H] sk-doc

checked=1 passed=1 failed=0 fixed=0
EXIT=0

$ node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs
OK    cli-classifier  a24927396214ab841312a00a75e03ae22c74b0002f3b1edbd2925288a5002197
OK    cli-external-orchestration  6cd87adea8cbe4a8e64c8b18880ce8373305abb3453f1cf7b5efcda115576035
OK    cli-orca  9193b5032798148726de1eaabf59627d5834ecbadb9592eec7f24247818d7600
OK    mcp-code-mode  e8614e5a111ea5e51370589f56929693242c8a71496af4f9d6914526dfc79b11
OK    mcp-tooling  ae46caf44c544357cb42c1db8fe59f16f8c8c36d208762a044641533713d7d6c
OK    sk-code  ca3140a9cc674676d41f81b4dca887bdb7818cfd4507594c88fe493aa30475f7
OK    sk-design  1cdca644379a5ebd716621fd8abb38a6ecdd0af0ae15df1a9bce6da62f78c723
OK    sk-doc  6a6f43c89c0e179080f2649894488095ebf8c53f4212812e56e6d8f36469c600
OK    sk-git  7a43047865f9ddf8917e365ab30f18f5653fa50a0b58eb12dea365a4f64edab3
OK    sk-prompt  922a3899ce9d8ff96ed63d41689318e6b802471452a0647c8ab261c0d84bdb71
OK    system-deep-loop  839a2b3e0d8968484af6a562e5b605b6ade7527579e1fca636496098d1ad60c0
OK    system-skill-advisor  14ce65e7ff94fe7a5b50c089acd7422d4b843e3623c850cc7a1888b6b38a27c4
OK    system-spec-kit  1fbc955023a8eb474ff4c18b7eb12d7bb0b7e2aa5f29725c1dd69e1ca440c0d1

checked=13 fresh=13 failed=0
EXIT=0

$ node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs

checked=13 fresh=13 stale=0 errored=0
EXIT=0

$ node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs --check
OK    cli-classifier               declared= 40 signals= 44 missing=  0
OK    cli-external-orchestration   declared= 89 signals= 96 missing=  0
OK    mcp-tooling                  declared=115 signals=130 missing=  0
OK    sk-code                      declared= 70 signals=108 missing=  0
OK    sk-design                    declared=120 signals=219 missing=  0
OK    sk-doc                       declared=243 signals=259 missing=  0
OK    system-deep-loop             declared= 29 signals= 34 missing=  0

checked=7 hub(s), missing=0
RESULT: PASSED
EXIT=0

$ node .skilled/bin/compiled-route-sync.cjs --check
55 closure files under authored root
  003-contract-schemas/lib/canonical.cjs
  003-contract-schemas/schemas/compiled-policy.v1.schema.json
  004-compiler-n1-shadow/compiler/compiler.cjs
  004-compiler-n1-shadow/compiler/errors.cjs
  004-compiler-n1-shadow/compiler/order.cjs
  004-compiler-n1-shadow/harness/json-schema.cjs
  005-decision-evaluator/lib/decision-contract.cjs
  005-decision-evaluator/lib/projector.cjs
  008-calibration/001-holdout-corpus/lib/calibration-corpus.cjs
  008-calibration/002-rank-vs-calibrated-contract/calibration-method-envelope.v1.json
  008-calibration/002-rank-vs-calibrated-contract/lib/calibration-contract.cjs
  009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json
  009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs
  009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs
  009-parent-hub-rollout/001-sk-code/lib/policy-card.cjs
  009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs
  009-parent-hub-rollout/002-system-deep-loop/fixtures/canary-cases.v1.json
  009-parent-hub-rollout/002-system-deep-loop/harness/build-artifacts.cjs
  009-parent-hub-rollout/002-system-deep-loop/lib/canary-router.cjs
  009-parent-hub-rollout/002-system-deep-loop/lib/policy-card.cjs
  009-parent-hub-rollout/002-system-deep-loop/lib/registry-compiler.cjs
  009-parent-hub-rollout/003-mcp-tooling/fixtures/canary-cases.v1.json
  009-parent-hub-rollout/003-mcp-tooling/harness/build-artifacts.cjs
  009-parent-hub-rollout/003-mcp-tooling/lib/policy-card.cjs
  009-parent-hub-rollout/003-mcp-tooling/lib/registry-compiler.cjs
  009-parent-hub-rollout/003-mcp-tooling/lib/router.cjs
  009-parent-hub-rollout/004-cli-external-orchestration/fixtures/canary-cases.v1.json
  009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs
  009-parent-hub-rollout/004-cli-external-orchestration/lib/policy-card.cjs
  009-parent-hub-rollout/004-cli-external-orchestration/lib/registry-compiler.cjs
  009-parent-hub-rollout/004-cli-external-orchestration/lib/router.cjs
  009-parent-hub-rollout/007-sk-doc/fixtures/canary-cases.v1.json
  009-parent-hub-rollout/007-sk-doc/harness/build-artifacts.cjs
  009-parent-hub-rollout/007-sk-doc/lib/policy-card.cjs
  009-parent-hub-rollout/007-sk-doc/lib/registry-compiler.cjs
  009-parent-hub-rollout/007-sk-doc/lib/router.cjs
  009-parent-hub-rollout/008-cli-classifier/fixtures/canary-cases.v1.json
  009-parent-hub-rollout/008-cli-classifier/harness/build-artifacts.cjs
  009-parent-hub-rollout/008-cli-classifier/lib/policy-card.cjs
  009-parent-hub-rollout/008-cli-classifier/lib/registry-compiler.cjs
  009-parent-hub-rollout/008-cli-classifier/lib/router.cjs
  009-parent-hub-rollout/009-sk-design/fixtures/canary-cases.v1.json
  009-parent-hub-rollout/009-sk-design/harness/build-artifacts.cjs
  009-parent-hub-rollout/009-sk-design/lib/canary-router.cjs
  009-parent-hub-rollout/009-sk-design/lib/policy-card.cjs
  009-parent-hub-rollout/009-sk-design/lib/registry-compiler.cjs
  013-live-activation/activation/cli-classifier/manifest.json
  013-live-activation/activation/cli-external-orchestration/manifest.json
  013-live-activation/activation/mcp-tooling/manifest.json
  013-live-activation/activation/sk-code/manifest.json
  013-live-activation/activation/sk-design/manifest.json
  013-live-activation/activation/sk-doc/manifest.json
  013-live-activation/activation/system-deep-loop/manifest.json
  014-runtime-engine/lib/compiled-route.cjs
  014-runtime-engine/lib/resolve.cjs
all 7 hubs resolve
all 55 served copies match their authored files
EXIT=0

## Document validators

$ python3 .skilled/skills/sk-doc/scripts/validate_document.py README.md --type readme
✅ VALID: README.md
Total issues: 0

$ python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/commands/doctor/scripts/README.markdown --type readme
✅ VALID: .skilled/commands/doctor/scripts/README.markdown
Total issues: 0

$ python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-doc/sk-create-skill/SKILL.md --type skill
✅ VALID: .skilled/skills/sk-doc/sk-create-skill/SKILL.md
Total issues: 0

$ python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md --type reference
✅ VALID: .skilled/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md
Total issues: 0

$ python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/manual-testing-playbook.md --type readme
✅ VALID: .skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/manual-testing-playbook.md
Total issues: 0

$ python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-doc/feature-catalog/feature-catalog.md --type readme
✅ VALID: .skilled/skills/sk-doc/feature-catalog/feature-catalog.md
Total issues: 0

$ python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-doc/feature-catalog/skill-format-conversion/skill-format-check-and-convert.md --type feature_catalog
✅ VALID: .skilled/skills/sk-doc/feature-catalog/skill-format-conversion/skill-format-check-and-convert.md
Total issues: 0

$ python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/standalone-skill/check-a-skill-against-the-skilled-format.md --type playbook_feature
✅ VALID: .skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/standalone-skill/check-a-skill-against-the-skilled-format.md
Total issues: 0

$ python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/standalone-skill/convert-an-older-skilled-skill.md --type playbook_feature
✅ VALID: .skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/standalone-skill/convert-an-older-skilled-skill.md
Total issues: 0

$ python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/standalone-skill/convert-a-plain-skill.md --type playbook_feature
✅ VALID: .skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/standalone-skill/convert-a-plain-skill.md
Total issues: 0

$ python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/standalone-skill/refuse-a-hub-candidate.md --type playbook_feature
✅ VALID: .skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/standalone-skill/refuse-a-hub-candidate.md
Total issues: 0

## Package validators

$ node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook
contract=operator-scenario routing_gold_contract=routing-gold strict=on
manifest=.skilled/skills/sk-doc/sk-create-manual-testing-playbook/playbook-corpus-manifest.json
warn_packages=
PASS package=sk-doc/sk-create-skill tier=FAIL_CLOSED scenarios=11 categories=2 operator=11 routing_gold_excluded=0 violations=0 warnings=0
exit=0
EXIT=0

$ node .skilled/skills/sk-doc/sk-create-skill/scripts/validate-playbook-topology.cjs
PASS  SD-018  agent-dispatch/markdown-agent-cli-claude-code.md  pairs=1  mode=sk-create-changelog
PASS  SD-020  agent-dispatch/markdown-agent-cli-opencode.md  pairs=1  mode=sk-create-changelog
PASS  SD-011  cross-cli-dispatch/large-prompt-stress.md  pairs=4  mode=sk-create-skill
PASS  SD-012  cross-cli-dispatch/multi-step-dispatch.md  pairs=9  mode=sk-create-skill → sk-create-quality-control → sk-create-changelog
PASS  SD-010  cross-cli-dispatch/short-prompt-baseline.md  pairs=1  mode=sk-create-changelog
BLOCK (unknown id)  document-validation/citation-drift-census-across-doc-families.md  class=null  excluded_from_denominators=true
BLOCK (unknown id)  document-validation/citation-drift-scan.md  class=null  excluded_from_denominators=true
BLOCK (unknown id)  document-validation/shared-frontmatter-value-warning.md  class=null  excluded_from_denominators=true
PASS  SD-H04  holdout/changelog-natural.md  pairs=1  mode=sk-create-changelog
PASS  SD-H02  holdout/doc-quality-natural.md  pairs=4  mode=sk-create-quality-control
PASS  SD-H09  holdout/ind-changelog.md  pairs=1  mode=sk-create-changelog
PASS  SD-H07  holdout/ind-doc-quality.md  pairs=4  mode=sk-create-quality-control
PASS  SD-H13  holdout/ind-feature-catalog.md  pairs=1  mode=sk-create-feature-catalog
PASS  SD-H11  holdout/ind-optimization.md  pairs=2  mode=sk-create-quality-control
PASS  SD-H08  holdout/ind-readme.md  pairs=2  mode=sk-create-readme
PASS  SD-H06  holdout/ind-skill-creation.md  pairs=4  mode=sk-create-skill
PASS  SD-H03  holdout/readme-natural.md  pairs=2  mode=sk-create-readme
PASS  SD-H01  holdout/skill-creation-natural.md  pairs=4  mode=sk-create-skill
PASS  SD-003  intent-detection/agent-command.md  pairs=4  mode=sk-create-agent+sk-create-command
PASS  SD-001  intent-detection/doc-quality.md  pairs=4  mode=sk-create-quality-control
PASS  SD-016  intent-detection/optimization.md  pairs=2  mode=sk-create-quality-control
PASS  SD-002  intent-detection/skill-creation.md  pairs=4  mode=sk-create-skill
PASS  SD-006  resource-loading/mixed-references-assets.md  pairs=2  mode=sk-create-readme
PASS  SD-004  resource-loading/references-global-only.md  pairs=1  mode=sk-create-with-human-voice
PASS  SD-015  token-cost-baseline/max-load.md  pairs=120  mode=sk-create-skill+sk-create-skill-parent+sk-create-readme+sk-create-agent+sk-create-command+sk-create-feature-catalog+sk-create-manual-testing-playbook+sk-create-benchmark+sk-create-changelog+sk-create-diff+sk-create-frontmatter+sk-create-quality-control+sk-create-repo-rule+sk-create-with-human-voice
PASS  SD-014  token-cost-baseline/medium-load.md  pairs=4  mode=sk-create-skill
PASS  SD-013  token-cost-baseline/minimal-load.md  pairs=1  mode=sk-create-with-human-voice
PASS  SD-009  unknown-fallback/disambiguation-required.md  pairs=2  mode=sk-create-feature-catalog+sk-create-manual-testing-playbook
PASS  SD-008  unknown-fallback/no-keyword-match.md  pairs=0  mode=UNKNOWN

verdict=PASS valid=26 blocked=0 unenrolled=3 total=29
EXIT=0

$ /usr/bin/python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py --package sk-doc
PACKAGE sk-doc: PASS tier=fail violations=0
PASS: 0 violations (all enforced catalog checks).
EXIT=0

## Requirement evidence

$ rg -c "/doctor:sk-skill" README.md .skilled/commands/README.txt .skilled/commands/doctor/scripts/README.markdown .skilled/skills/sk-doc/sk-create-skill/SKILL.md
README.md:2
.skilled/commands/README.txt:1
.skilled/commands/doctor/scripts/README.markdown:2
.skilled/skills/sk-doc/sk-create-skill/SKILL.md:1
EXIT=0

$ rg -n "doctor:sk-skill convert|create:skill-parent" .skilled/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md
34:- You are creating a brand-new skill from scratch. Use `/create:skill` or `/create:skill-parent` directly. See [creation-workflow.md](creation-workflow.md) and [parent-skills-nested-packets.md](../parent-skill/parent-skills-nested-packets.md)
39:- `/create:skill-parent` - parent-hub scaffold (`create` or `update`). Argument order is `<skill-name> [create|update] [--modes <m1,m2,...>] [--surfaces <s1,s2,...>] [--path <dir>]`
46:- `/doctor:sk-skill convert <name-or-path>` - in-place conversion for a skill that stays single: it plans, waits for your yes, and moves a legacy machine router into the sibling `ROUTER.md`. It refuses a hub candidate, so a skill with two or more jobs still goes to `/create:skill-parent`
62:| Two or more distinct jobs | Convert to a parent hub (class H) with `/create:skill-parent` |
82:`/create:skill-parent` has no convert-in-place flag, so keeping your own single skill is a merge-time choice, not a `/create:*` operation. A skill that stays single does convert in place, and that path is `/doctor:sk-skill convert`.
98:Use existing tooling only. `/create:skill-parent` is the scaffold. `create` will not write on top of an occupied folder (`requires_existing_skill: false`). There is no in-place `--convert` flag here, because converting a skill into a hub is a scaffold-then-move, not an edit. A single skill does convert in place, through `/doctor:sk-skill convert`, and that command refuses a hub candidate so your two-job skill lands here.
112:**Failure this prevents:** `/create:skill-parent <name> create` stopping because the folder already exists, or the scaffold overwriting your customized `SKILL.md` and references.
114:### Step 3. Scaffold the hub with `/create:skill-parent`
117:@markdown /create:skill-parent <skill-name> create --modes <mode1,mode2,...> [--surfaces <s1,s2,...>] [--path .skilled/skills] [:auto|:confirm]
125:@markdown /create:skill-parent sk-code create --modes quality,review --surfaces acme,opencode
176:That is the scoped generator `/create:skill-parent` already runs. Do not run fleet `ci-skill-root-metadata.cjs --fix` unless you intend to regenerate generated files across every scanned root.
190:**Failure this prevents:** shipping a hub that scaffolds but does not pass the same gate `/create:skill-parent` and `/doctor:skill-advisor parent-skill` require.
192:If you need another mode later, use `/create:skill-parent <skill-name> update --modes ...`. Do not re-run `create` on the live folder.
202:**Convert a single skill in place.** When the skill has one job and is still in a plain shape, or its machine router still sits inside `SKILL.md`, run `/doctor:sk-skill convert <name-or-path>`. It prints the plan first and writes only after your yes. It adds the four-part `version`, normalizes `allowed-tools`, moves the machine router section verbatim into the sibling `ROUTER.md` and links to it from Smart Routing. The write stops and restores the pre-edit bytes when the parsed router would come out different. Run `/doctor:sk-skill check <name-or-path>` first if you want the gap row by row without any write.
255:- `.skilled/commands/create/skill-parent.md` - `/create:skill-parent` operations `create` and `update`
EXIT=0

$ ls -la .skilled/changelog/sk-doc/create-skill .skilled/changelog/sk-doc/parent .skilled/changelog/sk-doc/create-command .skilled/changelog/system-skill-advisor
lrwxr-xr-x@ 1 michelkerkmeester  staff  47 30 Oct 09:40 .skilled/changelog/sk-doc/create-command -> ../../skills/sk-doc/sk-create-command/changelog
lrwxr-xr-x@ 1 michelkerkmeester  staff  45 30 Oct 09:40 .skilled/changelog/sk-doc/create-skill -> ../../skills/sk-doc/sk-create-skill/changelog
lrwxr-xr-x@ 1 michelkerkmeester  staff  29 30 Oct 09:40 .skilled/changelog/sk-doc/parent -> ../../skills/sk-doc/changelog
lrwxr-xr-x@ 1 michelkerkmeester  staff  40 30 Oct 09:40 .skilled/changelog/system-skill-advisor -> ../skills/system-skill-advisor/changelog
EXIT=0

## Privacy scans

$ rg -n "local-[a-z]" README.md .skilled/commands/README.txt .skilled/commands/doctor/scripts/README.markdown .skilled/skills/sk-doc/sk-create-skill/SKILL.md .skilled/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md .skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/manual-testing-playbook.md .skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/standalone-skill/check-a-skill-against-the-skilled-format.md .skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/standalone-skill/convert-an-older-skilled-skill.md .skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/standalone-skill/convert-a-plain-skill.md .skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/standalone-skill/refuse-a-hub-candidate.md .skilled/skills/sk-doc/feature-catalog/feature-catalog.md .skilled/skills/sk-doc/feature-catalog/skill-format-conversion/skill-format-check-and-convert.md
README.md:1595:**Q: What does "local-first" mean for continuity?**
EXIT=0

$ rg -n "/Users/" README.md .skilled/commands/README.txt .skilled/commands/doctor/scripts/README.markdown .skilled/skills/sk-doc/sk-create-skill/SKILL.md .skilled/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md .skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/manual-testing-playbook.md .skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/standalone-skill/check-a-skill-against-the-skilled-format.md .skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/standalone-skill/convert-an-older-skilled-skill.md .skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/standalone-skill/convert-a-plain-skill.md .skilled/skills/sk-doc/sk-create-skill/manual-testing-playbook/standalone-skill/refuse-a-hub-candidate.md .skilled/skills/sk-doc/feature-catalog/feature-catalog.md .skilled/skills/sk-doc/feature-catalog/skill-format-conversion/skill-format-check-and-convert.md
EXIT=1

## Dry forms of the check and the plan, on shipped skills

$ node .skilled/commands/doctor/scripts/sk-skill-check.cjs check sk-git
Skill check: sk-git (canon)

C1  PASS    Location: Direct child of the skills root.
C2  PASS    Input kind: Resolver verdict: router-md; input kind: canon.
C3  PASS    Format: Strict package validation passed.
C4  PASS    Root metadata: Root metadata contract passed.
C5  PASS    Intent signals: The intent signals differ from the scaffold defaults.
C6  PASS    Derived freshness: Generated derived content is current.
C7  PASS    Router equivalence: Parsed 5 intent signal groups and 5 resource-map entries.
C8  INFO    Advisor home: Skill graph validates and its compiled view is fresh. Advisor queries completed; the skill appeared in 3 of 3 result(s).
C9  PASS    Runtime mirrors: Runtime mirror status: Claude:pass, OpenCode:pass, Pi:pass, Devin:pass, Hermes:pass, Codex:n/a, Cursor:n/a.
C10 PASS    Changelog: The versioned changelog and index link resolve.
C11 PASS    Description budget: Description is OK at 122 characters.
C12 PASS    Collisions: No duplicate, reserved-prefix or runtime-persona collision found.
C13 INFO    Regression coverage: Regression corpus contains 6 matching cases.

Result: PASS
EXIT=0

$ node .skilled/commands/doctor/scripts/sk-skill-check.cjs check | tail -3
system-spec-kit             PASS      PASS             PASS

Roots: 13; result: PASS
EXIT=0

$ node .skilled/commands/doctor/scripts/sk-skill-convert.cjs plan sk-git
Conversion plan: sk-git
SKILL.md frontmatter is already normalized; no conversion is needed.
Writes: none
EXIT=0

