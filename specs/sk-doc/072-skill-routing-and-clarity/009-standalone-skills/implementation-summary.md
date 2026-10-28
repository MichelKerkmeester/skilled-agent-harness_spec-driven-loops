---
title: "Implementation Summary: Phase 9: Standalone skills"
description: "Six standalone skills now open with a short routing statement and keep their machine detail in a final MACHINE ROUTER, the standalone generator reads leaf scopes so system-skill-advisor's hooks root is Markdown only, and sk-git fits the word cap by pointing at its references."
trigger_phrases:
  - "standalone skills implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/009-standalone-skills"
    last_updated_at: "2026-10-28T15:45:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Moved six standalone skills to the canon and fixed every review finding"
    next_safe_action: "Conductor landing"
    blockers: []
    key_files:
      - "scratch/before.md"
      - "scratch/after.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skill-routing-and-clarity-phase-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Could the hooks/ leaf scope be fixed by editing JSON alone? No. The standalone path in generate-leaf-manifest.cjs walked every configured leaf root and never read leaf-scopes.json, so the generator gained the hub's scope reader, its error codes and a containment check."
      - "Did sk-git have to lose its router body to fit the 5,000-word cap? No. The review found the body had been cut down to a pointer and it was restored; three prose subsections now point at their references instead, and the file lands at 4,896 words."
      - "What happened to sk-vision? Nothing. Another session is deprecating it, so its ledger entry, its manifest and its SKILL.md are unchanged and the phase touched six of the seven roots."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary: Phase 9: Standalone skills

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-standalone-skills |
| **Completed** | 2026-10-28 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every standalone skill that is staying in this repository now opens with a short routing statement and keeps its machine detail in a final `MACHINE ROUTER` section. The six entries these skills held in the routing-shape ledger are gone. The leaf generator learned to read a standalone skill's scopes, so `system-skill-advisor` no longer hands the router nine TypeScript, Python and JSON files.

### The shape, per file

Counted the way `package_skill.py` counts: non-blank lines between the SMART ROUTING heading and the next heading, excluding `---`. Before is the ledger's recorded count, after is the same rule measured on the final file.

| File | SMART ROUTING (lines / words) | Machine router | Section after SMART ROUTING |
|------|-------------------------------|----------------|------------------------------|
| `.skilled/skills/cli-orca/SKILL.md` | 103 / 714 → 5 / 132 | `## 8. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` |
| `.skilled/skills/mcp-code-mode/SKILL.md` | 129 / 773 → 5 / 118 | `## 10. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` |
| `.skilled/skills/sk-git/SKILL.md` | 135 / 639 → 6 / 109 | `## 9. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` |
| `.skilled/skills/sk-prompt/SKILL.md` | 174 / 1019 → 6 / 121 | `## 10. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` |
| `.skilled/skills/system-skill-advisor/SKILL.md` | 226 / 1987 → 8 / 90 | `## 9. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` |
| `.skilled/skills/system-spec-kit/SKILL.md` | 312 / 1712 → 6 / 102 | `## 8. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` |

Every section is inside the 12-line and 180-word limits. SMART ROUTING stays `## 2` in all six files and `MACHINE ROUTER` is the last H2 in each, so nothing was renumbered and no other section had to move. The whole-file diff of each file is the version bump, the new §2 body and the moved block; the review proved that by diffing each file with those two sections removed.

The moved blocks are unchanged. Every machine line, matched by the canon's own names, is byte-identical to `HEAD` in all six files: `INTENT_SIGNALS`, `RESOURCE_MAP`, `LOADING_LEVELS`, `NOISY_SYNONYMS`, `COMMAND_BOOSTS`, `UNKNOWN_FALLBACK_CHECKLIST`, `DEFAULT_RESOURCE`, `RESOURCE_BASES`, `UNKNOWN_FALLBACK`, `FOREIGN_OWNERS`, `ORCA_PLACEMENT`, `discover_markdown_resources` and `_guard_in_skill`, 6 to 9 lines per file (`scratch/after.md` §5).

### The generator learns standalone scopes

The requirement that limits `system-skill-advisor`'s `hooks/` root to Markdown could not be met by editing a JSON file. The standalone path in `generate-leaf-manifest.cjs` called `collectStandaloneLeaves(skillDir, cfg)` and walked every configured leaf root, with no look at `leaf-scopes.json`. The hub path read that file; the standalone path never did.

The fix reuses the hub's machinery rather than adding a second rule. `buildManifestBytes` now reads the scopes file on the standalone branch too, and `collectStandaloneLeaves` takes the parsed scopes. It calls the same `collectScopedLeaves` and `walkLeafFiles` the hub path calls, uses the same error codes, and adds one check the hub path does not need: every scope has to sit under one of the mode's declared leaf roots, or generation fails with `OUT_OF_ROOT_LEAF_SCOPE`. A scope whose mode has no config entry fails with `ORPHAN_LEAF_SCOPE_MODE`. The index-file exclusion is re-applied to scoped candidates, so `feature-catalog/feature-catalog.md` still stays out.

`parseArgs` also accepts `<skillDir> --check` alongside `--check <skillDir>`, which is the order the new test uses. `HEAD`'s parser rejected it with exit 2.

The new file, `system-skill-advisor/leaf-scopes.json`, is a bare array in the same shape as the hub copy, and it names only Markdown under `hooks/`:

```text
hooks/skill-advisor-hook.md
hooks/skill-advisor-hook-validation.md
hooks/claude/README.md
hooks/lib/README.md
hooks/pi/README.md
```

plus the three whole-directory scopes the skill already routed: `feature-catalog`, `manual-testing-playbook` and `references`.

### The hook leaves the manifest dropped

Nine leaves, none added, and every removed path is a non-Markdown file under `hooks/`: seven `.ts`, one `.py`, one `.json`.

```text
hooks/claude/directive-lifecycle-boundary.ts
hooks/claude/user-prompt-submit.ts
hooks/lib/directive-lifecycle-contract.ts
hooks/lib/directive-lifecycle-file-store.ts
hooks/lib/directive-lifecycle-store.py
hooks/lib/directive-lifecycle-vectors.json
hooks/lib/directive-lifecycle.ts
hooks/lib/skill-advisor-cli-fallback.ts
hooks/pi/prompt-advisor.ts
```

The manifest goes from 136 leaves to 127 and the alias file loses the same nine pairs, so the two stay mirror images. No non-Markdown leaf is left anywhere in that skill's manifest.

The new test is the proof that the code was needed. `generate-leaf-manifest-standalone-scopes.test.cjs` builds fixtures, runs the generator, and asserts the `.md`-only outcome. Copied into a probe directory next to `HEAD`'s generator, it exits 1 on the first assertion, with `hooks/runtime.ts` leaking into the leaves because `HEAD` never reads the scopes file.

### sk-git, held under the word ceiling

`sk-git/SKILL.md` measures 5,000 words at `HEAD`, exactly at `MAX_SKILL_MD_WORDS = 5000` in `package_skill.py`, which fails above that number. The canon shape plus the router body did not fit, so the prose gives way instead of the router: the continuous-integration, remote-push and preflight-advisory subsections now state their rule once and link to the reference that carries the detail, `references/continuous-integration.md`, `references/remote-branch-policy.md`, `scripts/hooks/README.md` and `scripts/lib/README.md`. The file ends at 4,896 words by `wc -w`, 4,895 by `package_skill.py`'s own count, and every intent table, loading level and default resource is unchanged.

### Pointers repointed

Moving each router into a final section broke every pointer that named `§2`. `sk-prompt`'s own `manual-testing-playbook/` held fourteen of them across eight files, and all fourteen now name the section their content sits in: `grep -rn '§2' .skilled/skills/sk-prompt/manual-testing-playbook/` returns 0 rows. Eleven became `§10`; three were rewritten instead, because the section number alone no longer says what is there: `the final MACHINE ROUTER section's primary detection`, `the final MACHINE ROUTER section's routing tables`, `the final MACHINE ROUTER section's select_intents() pseudocode`, and the same shape in the ambiguity playbook.

### Ledger, mirrors and carriers

The six entries came off `routing-shape-known-debt.json`, 26 entries to 20, and the ratchet still passes 4 of 4 against its frozen snapshot, so nothing was raised to let them off. Seven `.hermes` mirrors were regenerated, one per changed skill plus `sk-create-skill`. Two compiled-route manifests were refreshed and copied over the archived activation copies that `compiled-route-sync` compares: `sk-doc`, because `sk-create-skill` changed inside it, and `mcp-tooling`, because `mcp-code-mode` is one of its packets. `skill-graph-freshness` reports no stale, zombie, ghost or signal-drift row and writes nothing.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The six files went out as two parallel dispatches, a Luna worker on `cli-codex` (gpt-6-luna, max, fast tier) and a DeepSeek worker on `cli-pi` with DeepSeek V4.1 Flash through LLMGATEWAY. Both ran to completion, so unlike the previous phase there was no resume and no half-changed tree to reconcile. No per-file attribution was recorded, which is why the task list names the two workers and not which file each one held.

The gates ran as one set before and after. `scratch/gates.sh` runs 39 gates and prints one line per gate, name, exit and last output line; `scratch/before.md` and `scratch/after.md` record the two runs and the raw logs sit beside them. The first after run came back with two red gates, which is recorded below rather than smoothed over.

A read-only review of the uncommitted diff then ran over the whole change, and its findings were fixed in the working tree before this summary was written.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:review -->
## Review Fixes

The review of the uncommitted diff at `HEAD` `9fdae0b7d4` returned no P0, three P1 and two P2 findings (`report.md` ends `FINDINGS: P0=0 P1=3 P2=2`). All five are fixed in the working tree.

| Finding | Fix |
|---------|-----|
| P1-1 sk-git and system-spec-kit lost content when their routers moved | sk-git's `route_git_resources` carried its full body again, `UNKNOWN_FALLBACK` included, so the no-match outcome is named in the file (`grep -c UNKNOWN_FALLBACK` reads 3). system-spec-kit took the review's second option: the pointer comment at `SKILL.md:479` now states this skill's own terms, `_task_text` also reads `task.command`, `score_intents` adds `+6` for a `COMMAND_BOOSTS` prefix, and keywords match as substrings. |
| P1-2 Fourteen `§2` pointers in sk-prompt's playbook named content that had moved | All fourteen repointed; `grep -rn '§2'` over the playbook returns 0 rows. The pointer the review also named in `system-spec-kit/references/cli/shared-smart-router.md` was outside the approved amendment and is recorded as a known limitation instead. |
| P1-3 sk-git replaced a leaf-selecting body with a pointer | Restored. `route_git_resources` walks `RESOURCE_MAP` per intent, loads `ON_DEMAND` on its keywords, falls back to `DEFAULT_RESOURCE` and returns the `UNKNOWN_FALLBACK` payload with its checklist. Only `select_intents` points at the shared pattern. |
| P2-4 Two new SMART ROUTING claims were false | `cli-orca/SKILL.md:64` now says only an Orca-qualified phrase selects a lane, except the recovery lane, which names a runtime failure state. `system-spec-kit/SKILL.md:85` now says the resource domains, loading levels and intent tables sit in `MACHINE ROUTER`, and the generic scoring loop is in `references/cli/shared-smart-router.md` section 2. |
| P2-5 Four changelog entries did not describe the change truthfully | mcp-code-mode now reads "five lines" in the description and the body. sk-git's entry says the loading-level table and the surviving pseudocode sit in the machine section and that two generic loops point at the shared pattern. system-spec-kit drops "scoring pseudocode" from its unchanged list and says the scoring loop points at its canonical body. system-skill-advisor gained the bullet the same version shipped: the `hooks/` leaf root is Markdown only, nine non-`.md` files left the manifest and the alias file, and no route changed. |

The review also cleared four things this phase relies on: every fenced block that moved in cli-orca, mcp-code-mode, sk-prompt and system-skill-advisor is byte-identical; all 212 links and anchors in the twelve changed `SKILL.md` copies resolve; the generator's fourteen probed input shapes all fail closed with a specific code where they should; and `sk-vision` is untouched.
<!-- /ANCHOR:review -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The standalone branch reads `leaf-scopes.json` rather than gaining an extension filter | One rule then covers both skill classes. The hub path already had a scope reader with error codes and a containment check, and a second rule for extensions would have to be kept in step with it forever. |
| The `hooks/` scope names five Markdown paths instead of the directory | A directory scope re-admits every `.ts` file under it, which is the bug. Naming the five routed Markdown paths is the narrowest statement that still routes them. |
| sk-git's prose points at its references rather than the router losing its body | The router body is what selects leaves. The cap counts words, so the words that could move were the ones already repeated in the references. |
| Every changed `SKILL.md` steps the third version segment | The change is routing shape and prose only, no route, keyword or resource changed, and the files keep one convention so a bump means one thing. |
| `sk-create-skill` stepped to 1.7.3.0 | The generator changed inside that skill, so its version has to move even though its own routing did not. |
| `sk-vision` was left alone | Another session is deprecating it. Restructuring it would be work thrown away, and its ledger entry is honest about the debt staying. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:deviations -->
## Deviations

1. **Files outside spec.md's Files to Change.** `routing-shape-known-debt.json`; the new `generate-leaf-manifest-standalone-scopes.test.cjs`; `system-skill-advisor/leaf-scopes.json`; six `leaf-aliases.json` files; `sk-create-skill/SKILL.md` and its changelog at 1.7.3.0; two compiled-route manifests and their two archived activation copies; seven `.hermes` mirrors; six changelogs.
2. **Scope amendment, approved by the conductor.** Moving `sk-prompt`'s router broke fourteen `§2` pointers in its own `manual-testing-playbook/`, across eight files. They were repointed in this phase because the break is this phase's and the files are `sk-prompt`'s own leaves. The amendment brief counted fifteen; the diff carries fourteen changed lines, and a count at `HEAD` finds fourteen `§2` occurrences in that folder.
3. **One pointer the amendment did not cover.** `system-spec-kit/references/cli/shared-smart-router.md:179` still says each skill's `SKILL.md` §2 Smart Routing holds the inline dictionaries. For these six skills that is now the machine section. It is outside the approved scope and is recorded as a known limitation rather than fixed quietly.
4. **Two red gates were repaired inside the phase.** The first after run failed `route-guard` and `sk-code-setup` on one stale `mcp-tooling` manifest. Re-minting that hub is a regeneration of a generated file, not a scope change, and it is recorded in `scratch/after.md` §1 with both runs.
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Full gate set (`scratch/gates.sh`), 39 gates | 39 of 39 exit 0 in the final run; the first after run had two red, both from one stale manifest |
| `package_skill.py --check --strict`, six changed files | `Result: PASS` on all six, and on the other eight, so fourteen of fourteen |
| `generate-leaf-manifest.cjs --check`, same six | `leaf-manifest.json OK` with a hash each |
| `generate-leaf-manifest-standalone-scopes.test.cjs` | passes here, exits 1 against `HEAD`'s generator |
| Generator test files and the debt ratchet | 13 of 13 pass across six files |
| `routing-shape-known-debt-ratchet.test.cjs` | 4 of 4 pass, ledger 26 → 20 entries |
| `compiled-route-guard.cjs --json` | 7 of 7 `fresh`, failures 0 |
| `compiled-route-sync.cjs --check` | 55 of 55 served copies match |
| `sync-skills-hermes.cjs --check` | `PASS: 67 Hermes skill copies in sync` |
| `check-contract-drift.cjs` | `OK commands=3` |
| Routing accuracy | 155/195, 49/66, 19/24, identical to the baseline |
| `validate.sh --strict` and `--recursive --strict` | `RESULT: PASSED` on both |

Detail: `scratch/after.md`. Baseline: `scratch/before.md`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One stale sentence survives in a shared reference.** `system-spec-kit/references/cli/shared-smart-router.md:179` still points a reader at each skill's `SKILL.md` §2 for the inline dictionaries. That file is outside this phase's scope and was not in the approved amendment. The sentence is wrong for the six skills this phase moved and right for nothing else, so it needs a one-line fix in a later pass.
2. **The word count differs by one between two counting rules.** `wc -w` gives 4,896 for `sk-git/SKILL.md` and `package_skill.py` counts 4,895 by its own rule, the same one-word gap the previous phase recorded. Either rule leaves the file inside the 5,000-word cap.
3. **The over-cap reading was not saved as a file.** The high-water mark while the router body was restored is not on disk, so the measured pair this record stands on is `HEAD` at 5,000 words and the final file at 4,896. Both are reproducible from the tree.
4. **The per-file order was not recorded.** `CHK-022` asks whether the largest file changed last, and with two workers running in parallel no order exists to check. The coverage is per-file comparison against `HEAD` plus a gate run over the final tree.
5. **The packet's scratch files are untracked.** `scratch/before.md`, `scratch/after.md` and `scratch/gates.sh` land with these docs, and `scratch/before.md` is the one a broad add would sweep in.
<!-- /ANCHOR:limitations -->
