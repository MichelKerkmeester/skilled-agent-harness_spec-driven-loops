# Iteration 2 - Command surface and routing

## Dimension

Correctness, traceability, and maintainability across the router, presentation contract, route manifest, setup workflow and script index.

## Files Reviewed

- `.skilled/commands/doctor/git.md:1`
- `.skilled/commands/doctor/assets/doctor-git-setup.yaml:1`
- `.skilled/commands/doctor/assets/doctor-git-presentation.txt:1`
- `.skilled/commands/doctor/_routes.yaml:237`
- `.skilled/commands/doctor/scripts/README.md:1`

The two code findings from Iteration 1 remain active and are carried in the canonical state record.

## Findings by Severity

### P0 Findings

None identified.

### P1 Findings

None identified.

### P2 Findings

1. **The required-input gate does not bind the documented `--target` alias** -- `.skilled/commands/doctor/git.md:16` -- The gate first requires a positional target and shows the startup menu when that token is absent. The later execution table advertises `--target=<name>` as a compatibility alias, so `/doctor:git --target=setup` has no documented path that binds the alias before the missing-target branch.

   - Evidence: positional-only target binding and missing-target handling are at [SOURCE: .skilled/commands/doctor/git.md:16]. The alias is listed later at [SOURCE: .skilled/commands/doctor/git.md:62].
   - Finding class: conflicting argument contract.
   - Scope proof: router and route manifest are in the bound manifest.
   - Affected surfaces: `/doctor:git` invocation and the setup target.
   - Concrete case: `/doctor:git --target=setup` has no positional token, so the mandatory gate directs the runner to show the menu before the later alias table can apply.
   - Recommendation: recognize `--target` inside the mandatory input gate before the missing-target check, or remove the alias from the documented surface.
   - Counterevidence sought: `list`, `?`, and `--list` are explicitly handled as no-target cases in the gate; no matching alias handling appears there.

2. **The mandatory input gate appears after other command content** -- `.skilled/commands/doctor/git.md:6` -- The required `<target>` argument is in frontmatter, but a comment, H1 and descriptive paragraph appear before the gate. The command authoring contract requires the gate immediately after frontmatter.

   - Evidence: frontmatter closes at [SOURCE: .skilled/commands/doctor/git.md:5], the skill-agent comment and introductory copy follow at [SOURCE: .skilled/commands/doctor/git.md:6], and the gate starts at [SOURCE: .skilled/commands/doctor/git.md:12]. The authoring rule is [SOURCE: .skilled/skills/sk-doc/sk-create-command/SKILL.md:225].
   - Finding class: command-structure nonconformance.
   - Scope proof: `git.md` is in the bound manifest.
   - Affected surfaces: initial command rendering and required-input handling.
   - Concrete case: a user sees the router introduction before the required-target gate, contrary to the required gate-first structure.
   - Recommendation: put the blocking gate immediately after frontmatter, before the skill marker, title and description.
   - Counterevidence sought: the gate does run before any workflow, so this is a structural violation rather than a skipped runtime gate.

3. **Visible command prose violates the Human Voice Rules punctuation standard** -- `.skilled/commands/doctor/assets/doctor-git-presentation.txt:262` -- The presentation contains four semicolons in user-facing next-step text. Its HVR scan exits 1 with a mechanical ceiling of 80/100, below the 85-point publish threshold. The router and scripts README also contain Oxford-comma candidates that are genuine authored prose.

   - Evidence: visible semicolons appear at [SOURCE: .skilled/commands/doctor/assets/doctor-git-presentation.txt:262], [SOURCE: .skilled/commands/doctor/assets/doctor-git-presentation.txt:263] and [SOURCE: .skilled/commands/doctor/assets/doctor-git-presentation.txt:264]. The router includes an Oxford comma at [SOURCE: .skilled/commands/doctor/git.md:10], and the scripts README has one at [SOURCE: .skilled/commands/doctor/scripts/README.md:65]. HVR bans semicolons and Oxford commas at [SOURCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:111]; the publish threshold is [SOURCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-publish-supplement.md:81].
   - Finding class: documentation-standard failure.
   - Scope proof: all cited command and README files are in the bound manifest.
   - Affected surfaces: user-visible next-step suggestions and command documentation.
   - Concrete case: the four semicolons occur in the presentation's suggestion table, outside code spans, so the command can render prose the publish scan rejects.
   - Recommendation: replace the semicolons with sentence breaks or conjunctions and remove the Oxford commas where they do not carry meaning.
   - Counterevidence sought: the YAML payload and literal commands were excluded from HVR scope; these hits are authored prose, not code or output copied from a source.

4. **The command description exceeds the documented 110-character target** -- `.skilled/commands/doctor/git.md:2` -- The command validator reports 133 characters, exceeding the authoring packet's soft target.

   - Evidence: the description is at [SOURCE: .skilled/commands/doctor/git.md:2]. The command authoring target is [SOURCE: .skilled/skills/sk-doc/sk-create-command/SKILL.md:212], and `validate_document.py --type command` reports `command_description_over_soft_target` with 133 characters.
   - Finding class: frontmatter budget nonconformance.
   - Scope proof: the command router is in the bound manifest.
   - Affected surfaces: command discovery and menu readability.
   - Concrete case: the single-line description is 23 characters over the 110-character target.
   - Recommendation: shorten the description while retaining the three target families and the read-only setup purpose.
   - Counterevidence sought: the validator exits 0 and labels this a warning, so it does not block structural validation.

## Traceability Checks

| Check | Result | Evidence |
|---|---|---|
| Route manifest, assets, flags, mutation classes and router/presentation parity | PASS | `bash .skilled/commands/doctor/scripts/route-validate.sh` exited 0. All 14 routes and 38 script invocations passed. It printed two informational duplicate-`--dry-run` warnings for other route groups. |
| Command structure | PASS with warning | `validate_document.py .skilled/commands/doctor/git.md --type command` exited 0. It reported one soft warning for the 133-character description. |
| Human Voice Rules | PARTIAL | `git.md` exited 0 with 97/100 mechanical ceiling; the presentation exited 1 with four hard punctuation blockers and 80/100 ceiling; scripts README exited 0 with 99/100 ceiling. Manual review confirmed the presentation semicolons and representative Oxford-comma hits are authored prose. |
| Documented commands | PASS / expected degraded case | `bash .skilled/scripts/install-git-hooks.sh --status` and `node .skilled/skills/sk-git/scripts/validate-message.mjs --explain` both exited 0. The script README's bare setup-check command ran and exited 3 with `UNKNOWN ai-tool-hooks`, as the setup YAML specifies when no tool is detected and `--tool` is absent. |

## SCOPE VIOLATIONS

No out-of-lineage writes were attempted. `route-validate.sh --self-test` and the full doctor test runner were not run because the documented self-test creates fixtures under `mktemp -d` and removes them [SOURCE: .skilled/commands/doctor/scripts/route-validate.sh:88]. The route validator's normal read-only mode was run. Mutating examples in the presentation were checked by path and read-only context only.

## Next Dimension

Review the sk-git skill, README, commit-message template, manual-testing playbook and feature catalog against their authoring contracts.

## Verdict
Review verdict: PASS
