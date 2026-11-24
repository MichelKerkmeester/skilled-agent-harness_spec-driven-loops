# Review Iteration 001

## Dispatcher

- Mode: review (fan-out lineage `pi-1`, generation 1, session `fanout-pi-1-1795511024070-2cuwlj`)
- Executor: `cli-pi` `deepseek-v4.1-flash-1017`, reasoning max
- Dimension: correctness
- Review target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder, 522 seeded files)
- Operator review focus: every phase's shipped work against its goal criteria, including the phase 015 fixes and the advisor 2.0.3.0 id-noun change. This iteration addressed it by checking phase 015's three completion criteria against the shipped source rather than against its prose: the three-mode bundle alias and canary case, the id-noun and bare-`staging` removal, and the Aside installer digest pin.

## Files Reviewed

- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/015-fix-follow-up-review-findings/goal.md:40-70`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/015-fix-follow-up-review-findings/spec.md:30-100`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/015-fix-follow-up-review-findings/implementation-summary.md:30-80`
- `.skilled/skills/system-skill-advisor/changelog/v2.0.3.0.md:20-60`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:326-340`, `:1231-1241`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts:59-100`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:108-114`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:86-130`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json:158-172`
- `.skilled/skills/mcp-browser-use/hub-router.json` (bladebro-aliases, vocabularyClasses)
- `.skilled/skills/mcp-browser-use/description.json:1-4`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:1-110`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh:20-55`

## Findings - New

### P0 Findings

None.

### P1 Findings

None. The phase 015 fixes that this iteration could reach hold at source in every case tested; see Confirmed-Clean Surfaces.

### P2 Findings

1. **The `..` session-dir guard rejects legal directory names, not only traversal** -- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh:32` -- The guard `case "$SESSION_DIR" in *..*)` matches the two dots as a substring anywhere in the argument, so it fails closed on any directory whose name merely contains `..`. The comment above it states the intent ("A '..' segment would climb back out of ./tmp"), which is a segment rule, not a substring rule.
Case: `bash .skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh https://example.com ./tmp/run..1` prints `FAIL: session-dir must not contain a .. segment (got './tmp/run..1')` and exits 1, although `./tmp/run..1` stays inside the session folder and the following `./tmp/*` arm would accept it.
Finding class: `narrow-correctness`
Scope proof: read at the guard, lines 30-45 of the same file; the `./tmp/*` arm directly below shows the accepted shape the substring check pre-empts.
Affected surface hints: `.skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh`, the Aside manual-testing playbook entries that call it (`manual-testing-playbook/repl-evidence/repl-screenshot-artifact.md`), and `benchmark/reports/2026-11-21--manual-testing-playbook--app-running-rerun`.

2. **The id-noun anchor can be starved by the six-entry evidence cap** -- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts:100` -- `promptNamesIdNoun` (`fusion.ts:337`) needs a `token:` entry other than the noun, but the lexical lane truncates evidence to six entries after unshifting every `hint:` entry (`lexical.ts:81` then `:93`, `:100`). A skill that matches two or more category hints can therefore lose the second `token:` entry that would have satisfied the newly added conjunction, so the noun stops naming the skill for a prompt that does share another word with it.
Case: a prompt whose skill match produces `hint:` entries plus one token hit, e.g. `hint:staging site`, `hint:staging url`, `hint:staging portal`, `hint:…`, `hint:…`, `token:devtools` and a sixth entry consumes the budget before the second token is pushed; the noun branch then reads a truncated list.
Finding class: `narrow-correctness`
Scope proof: the cap is read at `lexical.ts:100` and the consumer is read at `fusion.ts:334-338`; the chain hint-first ordering is read at `lexical.ts:78-93`.
Affected surface hints: `.skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts`, `.skills/system-skill-advisor/runtime/lib/scorer/fusion.ts`, and the routing-accuracy fixtures that pin noun-only rows (`runtime/scripts/routing-accuracy/doctor-prompts.jsonl`).

3. **Removing `mcp-code-mode` from the keyword list leaves the phrase in the hub description, so the lexical lane can still see it** -- `.skilled/skills/mcp-browser-use/description.json:3` -- The changelog claims the hub "no longer lists `mcp-code-mode` among its keywords". That is true of `keywords`, and the sentence that survives in `description` ("`mcp-code-mode` is shared infrastructure and not a hub member") joins the same candidate haystack the lexical lane scores against (`lexical.ts:66-69` includes `skill.description`). A prompt that mentions `mcp-code-mode` therefore still contributes a token hit to the hub's lexical score, which is the near-miss class the change was meant to close.
Case: a prompt naming only the shared substrate, such as "call mcp-code-mode for this tool", still puts `token:mcp-code-mode`-style overlap on the hub's lexical lane through the description text, where a truly absent phrase would contribute nothing.
Finding class: `narrow-correctness`
Scope proof: the keywords array is read at `description.json:2` (16 entries, none of them the phrase) and the surviving prose sentence at `:3`; the candidate assembly is read at `lexical.ts:66-69`.
Affected surface hints: `.skills/mcp-browser-use/description.json`, `.skills/mcp-browser-use/graph-metadata.json` (generated intent signals), `.skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts`.

## Traceability Checks

| Protocol | Class | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | pass | Phase 015's scope table (`spec.md:96-104`) names `hub-router.json`, the canary fixture, the Aside example, the Aside installer and `fusion.ts`; each was read and each carries the named change at `hub-router.json` (bladebro-aliases includes `mcp-bladebro`), `canary-cases.v1.json:158` (`three-mode-ids-ordered-bundle`), `repl-evidence-capture.sh:32`, `install.sh:14`, `fusion.ts:334`. |
| `checklist_evidence` | core | partial | `goal.md:79-83` marks all three completion criteria `[x]`. Criteria 1 and the installer strand of the fix are evidenced at source. Criterion 2 ("the five probe prompts no longer lift a skill they do not name") cannot be confirmed from source alone, because it is a scorer-output claim and running the advisor suite writes runtime state outside this lineage's write surface. Criterion 3 (`validate.sh --strict --recursive`) was not run for the same reason. |
| `feature_catalog_code` | overlay | notApplicable | The hub has no `feature-catalog/` directory in the seeded scope; its capability table is `SKILL.md:36-45`. |
| `playbook_capability` | overlay | partial | The Aside manual-testing playbook entry that uses the changed example (`manual-testing-playbook/repl-evidence/repl-screenshot-artifact.md`) still describes the `./tmp` default and does not mention the new `..` rejection, so the playbook understates the guard a caller will hit. |

## Integration Evidence

- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:128` reaches `route(snapshot, bundle ? bundle.kind : 'orderedBundle', ordered)`, and `:96` resolves `bundleRules` by kind; the three-mode canary row at `fixtures/canary-cases.v1.json:158` exercises that path.
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1234` is the only caller of `promptNamesIdNoun`; the advisor's `SKILL.md` and the 2.0.3.0 changelog both describe the conjunction, and the call site matches that description.

## Edge Cases

- **Scorer-output claims are not provable from source.** Phase 015 criterion 2 and the 2.0.3.0 changelog's ratchet table are output measurements. This iteration read the implementation and the pinned fixtures but did not execute the scorer, so those claims are `partial`, not `pass`. A follow-up run with a read-only scorer invocation would settle them.
- **`description.json` prose is a scoring input.** The line between "keyword list" and "description" is not a scoring boundary, because `lexical.ts` scores the description too. Findings 3 is recorded at P2 rather than higher because the phrase still has to appear in the prompt, and a prompt about code (the observed failure) does not contain it.
- **Line numbers for `hub-router.json` are not cited** because the file is machine-shaped JSON whose arrays are long; the array membership was verified by parsing the file, and the exact keyword arrays are named in Finding 3's scope proof.

## Confirmed-Clean Surfaces

- The three-mode bundle alias is present: `hub-router.json` `bladebro-aliases.keywords` carries `mcp-bladebro` (parsed, not grepped), and the canary corpus carries `three-mode-ids-ordered-bundle` with all three ids at `fixtures/canary-cases.v1.json:158-172`.
- The bare `staging` explicit entry is gone: `explicit.ts:110-113` holds only `staging url`, `staging site`, `staging website`, `staging portal`, each mapped to `mcp-browser-use` at 0.65; `lanes/lexical.ts` holds no `staging` entry.
- The Aside installer pin is real and not a placeholder: `install.sh:14` holds `readonly INSTALLER_SHA256="4e1065…cf90"`, and `:93-99` compares `shasum -a 256` against it before `bash "$installer"` at `:103`.
- The id-noun conjunction exists as described: `fusion.ts:334-338` requires `noun.length >= 4`, a phrase-boundary match, and a `token:` entry that is not the noun itself.

## Ruled Out

- **`install.sh` leaves the fetched archive unverified** -- ruled out as a finding: `install.sh:11-13` states the limitation in the pinned-digest comment ("The pin covers this script only; the archive it fetches is not verified"), and 015's D2 decision scopes the fix to the script.
- **`$(...)` in a URL executes on the local shell in `repl-evidence-capture.sh`** -- ruled out: bash does not rescan the result of a parameter expansion for command substitution, so `output="$(aside repl "…'$URL'…")"` passes the literal text to `aside`; the single-quote and backslash guard covers the JS string escape, which is the boundary the script claims.
- **`exactBundle` can drop a mode from the ordered bundle** -- ruled out at the read: `router.cjs:128` passes the full `ordered` array to `route`, and the bundle kind only selects the decision label.

## Next Focus

- Dimension: correctness (second pass) then security
- Focus area: the compiled-routing engine (`compiled-route.cjs`, `014-runtime-engine/lib/resolve.cjs`, `registry-compiler.cjs`, `policy-card.cjs`) and the activation manifests, including the archived finding that `compiled-route.cjs:29` ignored the activation-root override
- Reason: the engine is the largest unreviewed correctness surface in scope and carries the archived P2 that no lineage confirmed after phase 014
- Rotation status: correctness remains open (bundle and advisor strands done, engine strand not started)
- Blocked/productive carry-forward: productive, direct source reads with parsed fixtures
- Required evidence: direct reads at the override and resolution lines, plus the manifest/fence-state contents they read

Review verdict: PASS
