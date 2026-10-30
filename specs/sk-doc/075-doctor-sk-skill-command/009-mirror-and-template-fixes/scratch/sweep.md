# Template sweep: router-in-SKILL.md wording

Rerun of the same-class producer inventory before the wording fix, so the class is
covered rather than the one instance.

## Command

```text
$ rg -n -i "SKILL\.md.{0,20}router|router.{0,20}in SKILL\.md" .skilled/skills/*/assets .skilled/skills/*/*/assets .skilled/skills/system-spec-kit/templates
```

## Hits and their classification

| Hit | Text | Verdict |
|-----|------|---------|
| `sk-doc/sk-create-skill/assets/skill/skill-leaf-manifest-config-template.json:2` | "...keep only the ones whose docs the skill's in-SKILL.md router actually routes into." | **Stale**: the machine router lives in the sibling `ROUTER.md`, so the author is told to look in the wrong file. This is the one this phase fixes. |
| `sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py:976` | "Machine router declared in both SKILL.md and ROUTER.md; neither is read." | Correct: the checker's finding text for a dual declaration, which names `ROUTER.md` as the surviving home in its `fix_hint`. |
| `sk-code/sk-code-skilled/assets/scripts/test_verify_alignment_drift.py:216` | "A minimal SKILL.md whose machine-router section names one RESOURCE_MAP leaf." | Correct: a fixture comment for the tolerance path, where a skill that still declares its router in `SKILL.md` stays readable. It is not authoring guidance. |
| `sk-code/sk-code-skilled/assets/scripts/test_verify_alignment_drift.py:287` | "Without --check-router the verifier never parses the SKILL.md router," | Correct: same tolerance path, describing what the default invocation skips. |
| `sk-code/sk-code-skilled/assets/scripts/test_verify_alignment_drift.py:302` | `self.write_file(root / "SKILL.md", "# skill\n\nRouter: `ROUTER.md`.\n")` | Correct: the fixture's `SKILL.md` points at the sibling `ROUTER.md`. |
| `sk-code/sk-code-skilled/assets/scripts/router-file-resolver.cjs:112` | "@param args.skillRoot - Skill root dir holding SKILL.md and optionally ROUTER.md." | Correct: names both files, with the router the optional one. |
| `sk-code/sk-code-skilled/assets/checklists/skill-authoring.md:52` | "Parent-hub skill: hub `SKILL.md`, `ROUTER.md`, `description.json`, ..." | Correct: a file inventory listing the router beside `SKILL.md`. |
| `sk-doc/sk-create-skill/assets/skill/skill-md-template.md:523` | "every skill and every mode packet owns `ROUTER.md` inside its own folder, linked from its own `SKILL.md`" | Correct: places the router in `ROUTER.md`. |
| `sk-doc/sk-create-skill/assets/skill/skill-md-template.md:967` | "Sibling Router \| `ROUTER.md` beside `SKILL.md` \| Its `## MACHINE ROUTER` section holds the only router pseudocode" | Correct. |
| `sk-doc/sk-create-skill/assets/skill/skill-smart-router.md:190` | "Router pseudocode left in `SKILL.md` instead of the sibling `ROUTER.md`" | Correct: an anti-pattern entry. |
| `sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-template.md:107` | "its own `ROUTER.md` beside its `SKILL.md` holding that packet's machine router" | Correct. |

## Result

One stale producer: the leaf-manifest config template's `_template` note. Every other
hit either places the router in the sibling `ROUTER.md` or describes the checker's
tolerance for a skill that has not moved it yet. No template outside the one fixed
here tells an author the router lives in `SKILL.md`.

## The literal phrase, before and after the fix

```text
$ rg -n "in-SKILL.md router" .skilled/skills
.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-leaf-manifest-config-template.json:2:  "_template": "..."
exit 0
```

```text
$ rg -n "in-SKILL.md router" .skilled/skills
exit 1
```

## Consumers of the changed template

```text
$ rg -n "skill-leaf-manifest-config-template" .skilled
.skilled/skills/sk-doc/leaf-manifest.json:168:        "assets/skill/skill-leaf-manifest-config-template.json",
.skilled/skills/sk-doc/manual-testing-playbook/token-cost-baseline/max-load.md:99
.skilled/skills/sk-doc/manual-testing-playbook/token-cost-baseline/max-load.md:295
.skilled/skills/sk-doc/ROUTER.md:366
.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:184
.skilled/skills/sk-doc/sk-create-skill/scripts/tests/create-journey-proof.test.cjs:24
.skilled/skills/system-skill-advisor/SKILL.md:212
```

Every consumer names the file's path, or reads its key structure
(`create-journey-proof.test.cjs` skips `_template` and compares keys only). `leaf-manifest.json`
records the path as a leaf and carries no content hash, so no generated manifest needs a
rerun for a prose change in `_template`.
