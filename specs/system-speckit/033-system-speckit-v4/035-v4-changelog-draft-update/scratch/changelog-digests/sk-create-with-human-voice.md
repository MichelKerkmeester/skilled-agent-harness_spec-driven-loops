# sk-create-with-human-voice changelog digest

Skill path: `.opencode/skills/sk-doc/sk-create-with-human-voice/`. Versions covered: v1.0.0.0 through v1.1.0.0, oldest to newest. Only two entries exist in `changelog/`, so this is the whole history rather than the last ten. Neither entry carries a date field in its frontmatter or its body, so no date range can be stated from the entries themselves.

---

## Per version, newest first

### v1.1.0.0

From `v1.1.0.0.md`. The Human Voice Rules standard moved into the packet that applies it, and the packet's references and assets were brought onto the shapes `sk-create-skill` publishes. RENAME: the standard moved from `.opencode/skills/sk-doc/shared/references/hvr-rules.md` to `sk-create-with-human-voice/references/hvr-rules.md`, with the body byte-identical apart from one relative link the move broke. BREAKING for anything that hardcoded the old path: roughly thirty live consumers were repointed, among them the hub `ROUTER.md` resource map, the `leaf-aliases.json` projection that lets `sk-create-quality-control` still reach the file, the generated `leaf-manifest.json`, three hub playbook scenarios, the `sk-create-readme` and `sk-create-skill` templates, `sk-communication`, the `/create:with-human-voice` and `/rewrite:*` command surfaces, `repo-rules/communication.md`, and the ten spec-kit templates that emit an HVR reference line into generated spec docs. `scripts/hvr_scan.py` now resolves the standard one directory up rather than three, with `DEFAULT_RULES_PATH` walking `parents[1] / "references" / "hvr-rules.md"`, and its fail-closed floors are unchanged so an unparseable standard still exits 2. The two references and the report asset were conformed to the packet templates, opening on `## 1. OVERVIEW`, and `contextType` moved off the undefined value `reference` onto the enum the frontmatter contract publishes. The entry records that this reverses the v1.0.0.0 decision not to move the file, because the headline count of 641 referencing files turned out to be 614 frozen spec documents plus a handful of live consumers. Frozen surfaces kept the old path: the 614 spec documents under `specs/`, the compiled-routing benchmark reports under `sk-doc/benchmark/` and `system-deep-loop/benchmark/`, and the v1.0.0.0 entry itself. The spec-kit golden snapshot was updated by substituting the one changed line rather than by a `vitest -u` rerun.

### v1.0.0.0

From `v1.0.0.0.md`. The packet was created as the workflow that actually runs the Human Voice Rules, which had sat in `sk-doc/shared/references/` with hundreds of files pointing at them and nothing executing them. New in this version: a scope gate in `references/scope-and-exemptions.md` that decides which spans the standard governs, holding quotations, error strings, commands, code, generated files, released changelog entries and byte-pinned fixtures permanently out of scope. A mechanical pass, `scripts/hvr_scan.py`, parses the punctuation bans, hard blocker words, phrase blockers and soft deductions out of `hvr-rules.md` on every invocation, so the packet holds no copy of any term list. Precedence arithmetic prevents double-charging: one occurrence costs one penalty, the longest matching term claims the span, a word listed as both an extended blocker and context-dependent is charged once as the blocker, and a transition costs a point only from its third use onward. A verification step requires re-running the scanner on the rewritten text and reporting both numbers, and a report template carries the exemptions, both scores, the judgment findings and the accepted exceptions. The entry notes that the scanner over-reports by design, that a clean mechanical result is not a clean document, that the 100-point scale switches past roughly 400 lines to hard blockers plus deduction density, and that the scanner fails closed with exit 2 on a thin parse. `sk-create-quality-control` kept the file-level audit and its `HVR` routing vocabulary, and no alias moved between the two. This entry also recorded the decision that the standard would not move, which v1.1.0.0 reversed.

---

## Facts the v4 draft gets wrong or misses

Checked against `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md`, 463 lines.

- The draft never names this mode or the Human Voice Rules anywhere. A grep for `human voice`, `human-voice` and `hvr` across all 463 lines returns no hit. Both changelog entries describe a new `/create:with-human-voice` command surface and a runnable scanner, so a whole authoring surface is missing from the release notes. Source: `v1.0.0.0.md` and `v1.1.0.0.md`.
- Draft line 132 lists the sk-doc packets by name (`sk-create-skill`, `sk-create-readme`, `sk-create-agent`, `sk-create-diff`, `sk-create-changelog`, `sk-create-repo-rule`, `sk-create-quality-control`) then says "and the rest". `sk-create-with-human-voice` is one of the fourteen and one of the twelve command-bound packets, and it falls into the unnamed remainder. The counts themselves check out: `mode-registry.json` carries fourteen `sk-create-*` workflow modes and twelve `/create:*` bindings. Source: `v1.0.0.0.md`, `v1.1.0.0.md`.
- The draft's "Internal Seams" section (lines 450 to 463) lists moved and repointed surfaces of exactly this kind, including the shared frontmatter parser at line 463, but omits the standard's relocation out of `sk-doc/shared/references/` into the packet and the roughly thirty live consumers repointed with it, `repo-rules/communication.md` and the ten spec-kit spec-doc templates among them. Source: `v1.1.0.0.md`.
- The draft does not record that the ten spec-kit templates changed the HVR reference line they emit into generated spec docs, which is visible to anyone reading a newly generated spec document. Source: `v1.1.0.0.md`.
- No statement in the draft contradicts either entry. Everything above is an omission rather than an error.

---

## Current version and identity

`SKILL.md` frontmatter declares `version: 1.1.0.0`, matching the newest changelog entry. Identity: a mode, not a hub and not standalone. Its own root holds no `mode-registry.json`, and its parent `.opencode/skills/sk-doc/` holds `mode-registry.json`, `hub-router.json` and `description.json`, which is the parent-hub metadata set. The registry carries the entry `"workflowMode": "sk-create-with-human-voice"` bound to the command `/create:with-human-voice`, so the mode is reached through the `sk-doc` hub router rather than by its own advisor identity.
