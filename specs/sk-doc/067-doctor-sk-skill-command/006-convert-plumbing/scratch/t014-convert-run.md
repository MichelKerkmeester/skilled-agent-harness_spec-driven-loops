# `/doctor:sk-skill convert` run against a scratch skill

The workflow was walked step by step on a scratch skills root under the dispatcher scratch folder, with the
shipped `sk-skill-convert.cjs` and `sk-skill-check.cjs` driven through a context whose `skillsDir` points at
that root. The converter only converts a direct child of the skills root it is given, so a scratch root is
how a scratch skill is converted without touching a real one.

---

## 1. Plan (phase 2 of the workflow, writes nothing)

```text
$ node run-convert.cjs <repo> plan <scratch>/legacy-demo
exit 0
Conversion plan: legacy-demo
1. Add version: 1.0.0.0. Overwrite: <scratch>/legacy-demo/SKILL.md
2. Normalize allowed-tools as a YAML sequence. Overwrite: <scratch>/legacy-demo/SKILL.md
3. Remove inline machine router and link to ROUTER.md. Overwrite: <scratch>/legacy-demo/SKILL.md
4. Create sibling ROUTER.md from the router template. Create: <scratch>/legacy-demo/ROUTER.md
Backup existing files under: <scratch>/.state/doctor-sk-skill/legacy-demo/<timestamp>
Follow-up items:
- ROUTER.md retains template placeholder: [TODO: Name the request signals that reach this skill, and the resource families the router selects from.]
- ROUTER.md retains template placeholder: [TODO: Write one bullet per `INTENT_SIGNALS` key: the intent, the phrasing that fires it, and the exact files it loads.]
- ROUTER.md retains template placeholder: [TODO: Keep this section and the machine block below in sync. When a row changes here, change the matching map entry.]
```

Answer to the conversion question: **no**.

```text
$ diff <the skill folder's hashes before the plan> <its hashes after the no answer>
(no output)
```

Nothing under the skill folder changed, and no backup folder was created, so the run ends
`STATUS=CANCELLED ACTION=cancelled`.

---

## 2. Yes (phases 4 to 6 of the workflow)

```text
$ node run-convert.cjs <repo> apply <scratch>/legacy-demo --apply
exit 0
Conversion plan: legacy-demo
1. Add version: 1.0.0.0. Overwrite: <scratch>/legacy-demo/SKILL.md
2. Normalize allowed-tools as a YAML sequence. Overwrite: <scratch>/legacy-demo/SKILL.md
3. Remove inline machine router and link to ROUTER.md. Overwrite: <scratch>/legacy-demo/SKILL.md
4. Create sibling ROUTER.md from the router template. Create: <scratch>/legacy-demo/ROUTER.md
Backup existing files under: <scratch>/.state/doctor-sk-skill/legacy-demo/<timestamp>
Follow-up items:
- ROUTER.md retains template placeholder: [TODO: Name the request signals that reach this skill, and the resource families the router selects from.]
- ROUTER.md retains template placeholder: [TODO: Write one bullet per `INTENT_SIGNALS` key: the intent, the phrasing that fires it, and the exact files it loads.]
- ROUTER.md retains template placeholder: [TODO: Keep this section and the machine block below in sync. When a row changes here, change the matching map entry.]
Converted legacy-demo; router semantics match the snapshot.
Backup: <scratch>/.state/doctor-sk-skill/legacy-demo/2026-10-30T08-54-34-231Z
Router source: inline -> ROUTER.md
```

The backup folder it names holds the pre-write `SKILL.md` and the router proof snapshot:

```text
.state/doctor-sk-skill/legacy-demo/2026-10-30T08-54-34-231Z/SKILL.md
.state/doctor-sk-skill/legacy-demo/2026-10-30T08-54-34-231Z/before/SKILL.md
```

### Re-read through the check engine

```text
$ node run-convert.cjs <repo> check <scratch>/legacy-demo
exit 1
Skill check: legacy-demo (canon)

C1  PASS    Location: Direct child of the skills root.
C2  PASS    Input kind: Resolver verdict: router-md; input kind: canon.
C3  FINDING Format: Missing required sections: WHEN TO USE, HOW IT WORKS, RULES, REFERENCES
C4  FINDING Root metadata: Root metadata contract has violations. Codes: MANIFEST_REGENERATION_FAILED, MISSING_GENERATED_FILE, MISSING_REQUIRED_FILE, RRC-006.
C5  N/A     Intent signals: No intent signal list is available.
C6  INFO    Derived freshness: Not applicable: no graph-metadata.json.
C7  PASS    Router equivalence: Parsed 1 intent signal groups and 1 resource-map entries.
C8  INFO    Advisor home: Skill graph validates and its compiled view is fresh. Advisor queries completed; the skill appeared in 0 of 1 result(s).
C9  FINDING Runtime mirrors: Runtime mirror status: Claude:finding, OpenCode:finding, Pi:finding, Devin:finding, Hermes:pass, Codex:n/a, Cursor:n/a.
C10 FINDING Changelog: The skill changelog directory is missing.
C11 N/A     Description budget: This skill is not part of the repository description audit.
C12 FINDING Collisions: Collision checks found another SKILL.md declares the same name.
C13 INFO    Regression coverage: Regression corpus contains 0 matching cases.

Result: FINDINGS (5)
```

The conversion is complete and the skill reads back. The rows that still report `FINDING` are requirements a
two-file scratch fixture never met: the section shape, the root metadata files, the runtime copies, the
changelog and a name collision with another scratch fixture. The result keeps `STATUS=OK` for the conversion
and lists those rows and their repairs as the next step, which is what the workflow asks for.

---

## 3. Undo (phase 7 of the workflow, printed and never run by the route)

```text
$ cp "<backup>/SKILL.md" "<scratch>/legacy-demo/SKILL.md"
$ rm "<scratch>/legacy-demo/ROUTER.md"
```

```text
$ diff <hashes before the conversion> <hashes after the undo>
(no output)
```

The skill folder matches its pre-conversion hashes again.

---

## 4. Refusals (phase 2, each prints `REFUSE:` and ends `STATUS=FAIL`)

```text
$ node run-convert.cjs <repo> plan <scratch>/local-demo
exit 1
RESERVED_PREFIX: A local- prefixed skill is filtered by the format and advisor gates.
```

```text
$ node run-convert.cjs <repo> plan <scratch>/dual-demo
exit 1
DUAL_DECLARATION: Resolver verdict dual-declaration: both SKILL.md and ROUTER.md declare a machine router.
```

The workflow renders each as `REFUSE: <the reason the refusal list carries>` followed by
`STATUS=FAIL ERROR="<code>"`, and writes nothing.

---

## 5. The two field follow-ups, each with its own yes

A scratch skill with a 140-character description and no `allowed-tools`:

```text
$ node run-convert.cjs <repo> plan <scratch>/long-description
exit 1
DESCRIPTION_TOO_LONG: The description is 140 characters; the 130-character limit needs a separately approved trim.
```

The workflow prints the plan section's field follow-ups and asks:

```text
- Description: 140 characters, over the 130-character budget
- allowed-tools: not declared, so a least-privilege list is proposed

Trim the description to 130 characters or fewer? [yes/no]
Declare allowed-tools as [Read, Grep, Glob] for this skill? [yes/no]
```

Answer to the trim: **yes**, so the workflow writes that one field and reruns the plan. A 134-character trim
is still over budget, and the plan says so rather than converting:

```text
$ node run-convert.cjs <repo> plan <scratch>/long-description
exit 1
DESCRIPTION_TOO_LONG: The description is 134 characters; the 130-character limit needs a separately approved trim.
```

A 113-character trim fits:

```text
$ node run-convert.cjs <repo> plan <scratch>/long-description
exit 1
ALLOWED_TOOLS_MISSING: SKILL.md must declare allowed-tools exactly once before conversion.
```

Answer to the allowed-tools proposal: **yes**, so the workflow writes `allowed-tools: [Read, Grep, Glob]` and
reruns the plan:

```text
$ node run-convert.cjs <repo> plan <scratch>/long-description
exit 0
Conversion plan: long-description
1. Add version: 1.0.0.0. Overwrite: <scratch>/long-description/SKILL.md
2. Remove inline machine router and link to ROUTER.md. Overwrite: <scratch>/long-description/SKILL.md
3. Create sibling ROUTER.md from the router template. Create: <scratch>/long-description/ROUTER.md
Backup existing files under: <scratch>/.state/doctor-sk-skill/long-description/<timestamp>
Follow-up items:
- ROUTER.md retains template placeholder: [TODO: Name the request signals that reach this skill, and the resource families the router selects from.]
- ROUTER.md retains template placeholder: [TODO: Write one bullet per `INTENT_SIGNALS` key: the intent, the phrasing that fires it, and the exact files it loads.]
- ROUTER.md retains template placeholder: [TODO: Keep this section and the machine block below in sync. When a row changes here, change the matching map entry.]
```

Each follow-up needed its own yes, neither was defaulted, and the engine stayed the authority on when the
conversion may proceed.
