VERDICT: FIX

- [P1] .skilled/skills/sk-doc/sk-create-changelog/README.md:127 | claims | the replacement pass cell correctly stops attributing the format checks to the validator, but it drops two claims the HEAD cell carried and `SKILL.md` section 9 item 4 still enforces: the prose opens with the summary first, and the spec-folder blockquote is present only when the source is a spec folder. "The tier sections" covers the summary's presence, not its order, and "the spec-folder line" drops the condition. Keep the validator correction and restore both claims to the hand-check list | replace line 127 with:
```
| Global format | `python3 .skilled/skills/sk-doc/scripts/validate_document.py <changelog-file> --type changelog` | `✅ VALID`: the required frontmatter keys are present, at least one trigger phrase is declared and a version file names its version in a phrase. The summary-first order, the tier sections, the spec-folder line when sourced from a spec and the upgrade guidance are checked by hand against `SKILL.md` section 9 |
```
