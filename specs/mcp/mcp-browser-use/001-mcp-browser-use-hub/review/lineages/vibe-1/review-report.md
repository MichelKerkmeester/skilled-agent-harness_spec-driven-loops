# Deep Review Report: mcp-browser-use hub

- Lineage: `vibe-1`
- Session: `fanout-vibe-1-1795511024070-2cuwlj`, generation 1, lineageMode `new`
- Review target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- Executor: cli-mistral-vibe, model deepseek-flash
- Iterations: 7 of 7
- Stop reason: `converged` (final new-findings ratio 0.0667 against a 0.10 threshold)
- Release-readiness state: `converged`

---

## 1. Executive Summary

**Overall verdict: CONDITIONAL**

- `hasAdvisories`: false (the verdict is not PASS, so the advisory flag does not apply)
- Active findings, the counts this verdict used: **P0 = 0, P1 = 2, P2 = 5**
- Search debt: 0. Failed required gates: none.
- Dimension coverage: 4 of 4 (correctness, security, traceability, maintainability), with correctness and traceability each covered twice and a final cross-reference pass.

The hub is structurally sound and its phase 015 fixes hold as behaviour, not only as prose. The compiled router replays all sixteen canary cases cleanly, the three-mode bundle rule works for the id form, the advisor 2.0.3.0 id-noun and staging changes reproduce on eleven live probes, both runtime mirrors are byte-identical to canonical, and six of the seven goal criteria are verified against shipped evidence. Two P1 findings keep the verdict at CONDITIONAL: a troubleshooting block that prescribes a Node downgrade the tool it is troubleshooting rejects, and a routing vocabulary that has no prose form for Aside so a request naming Aside either defers or silently loses it from a bundle.

**Adversarial self-check outcomes.** Both active P1 findings were re-run through Hunter, Skeptic and Referee at synthesis. The Referee confirmed both at P1 and changed nothing:

- `R2-P1-001` confirmed P1. The Skeptic's best case for P2 was that a reader would see the error again and recover. The Referee rejected it because the block is the *prescribed fix* for a Node-version error and following it reproduces that error, and because `nvm use 18` actively downgrades a working Node 20 environment, which breaks `bdg` entirely rather than leaving it unchanged.
- `R5-P1-001` confirmed P1. The Skeptic's best case was that bare `aside` is an ordinary English word, so the exclusion is deliberate. The Referee accepted the premise and rejected the conclusion: the exclusion is right, but the missing phrase forms are not, and `SKILL.md:77` defines `defer` as the outcome for a request that "names no mode" while these requests name one.

**Review scope.** The hub skill tree (`.skilled/skills/mcp-browser-use/`, 312 files across the hub and three mode packets), the compiled routing phase for the hub (`.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/`), the two runtime mirrors under `.claude/skills/`, the advisor 2.0.3.0 changelog and its live CLI, and the packet's own goal and phase documents. Benchmark report transcripts were excluded from every sweep.

**Operator review focus.** every phase's shipped work against its goal criteria, including the phase 015 fixes and the advisor 2.0.3.0 id-noun change

---

## 2. Planning Trigger

`/speckit:plan` **is required**. The verdict is CONDITIONAL with two active P1 findings, and the verdict contract routes CONDITIONAL to planning for fixes. The two P1s are independent: one is a documentation defect in the Chrome DevTools packet, the other is a routing-vocabulary defect in the hub. Neither blocks release on its own, but both produce a wrong result on a plausible input, so they belong in a remediation plan rather than a changelog.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {
      "id": "R2-P1-001",
      "severity": "P1",
      "title": "The Node-version troubleshooting fix runs nvm install 18 while the same block and seven other documents require Node 20 or higher",
      "dimension": "security",
      "file": ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/references/troubleshooting.md:187",
      "findingClass": "instance-only",
      "scopeProof": "The nvm pattern appears at exactly two lines, both inside one troubleshooting block; the Node 20 requirement is stated in eleven places across the Chrome packet including the install script, the install guide and the changelog.",
      "affectedSurfaceHints": [
        "mcp-chrome-devtools/references/troubleshooting.md Node version block",
        "mcp-chrome-devtools/scripts/install.sh prerequisite check",
        "mcp-chrome-devtools/INSTALL-GUIDE.md dependency line"
      ]
    },
    {
      "id": "R5-P1-001",
      "severity": "P1",
      "title": "The intent vocabulary has no prose form for Aside, so a request that names Aside either defers or silently drops it from a bundle",
      "dimension": "correctness",
      "file": ".skilled/skills/mcp-browser-use/ROUTER.md:53",
      "findingClass": "instance-only",
      "scopeProof": "The gap is one vocabulary class in one file: every Aside keyword carries a qualifier while BLADEBRO carries bare bladebro. Replaying the two prompts through evaluateRoute returns defer and a two-mode orderedBundle, and all sixteen canary cases pass, so the defect sits outside the fixture coverage rather than in the fix.",
      "affectedSurfaceHints": [
        "ROUTER.md INTENT_SIGNALS ASIDE_DEVTOOLS",
        "hub-router.json vocabularyClasses",
        "graph-metadata.json intent_signals",
        "registry-compiler.cjs compiled routingModel",
        "fixtures/canary-cases.v1.json",
        "SKILL.md defer definition"
      ]
    },
    {
      "id": "R1-P1-001",
      "severity": "P2",
      "title": "ROUTER.md says Core Web Vitals is not advertised to the advisor, but graph-metadata.json intent_signals carries it",
      "dimension": "correctness",
      "file": ".skilled/skills/mcp-browser-use/ROUTER.md:33",
      "findingClass": "instance-only",
      "scopeProof": "The phrase appears at two metadata sites plus the one prose claim; the live advisor returns sk-code at 0.9295 for the prompt the original P1 named, so the contradiction is documentation drift rather than a routing defect.",
      "affectedSurfaceHints": ["ROUTER.md capability note", "graph-metadata.json intent_signals"]
    },
    {
      "id": "R1-P2-001",
      "severity": "P2",
      "title": "README.md carries version 1.1.4.0 while every other hub metadata file carries 1.1.3.0, and no changelog entry exists for 1.1.4.0",
      "dimension": "correctness",
      "file": ".skilled/skills/mcp-browser-use/README.md:8",
      "findingClass": "instance-only",
      "scopeProof": "SKILL.md, hub-router.json, mode-registry.json and description.json all read 1.1.3.0 and changelog/ holds five entries ending at v1.1.3.0.md, so the README frontmatter is the only 1.1.4.0 site.",
      "affectedSurfaceHints": ["README.md frontmatter version", "changelog/", "SKILL.md version authority line"]
    },
    {
      "id": "R2-P2-001",
      "severity": "P2",
      "title": "The Node-version fix pipes a downloaded script straight into bash with no digest gate, the pattern phase 015 removed from the Aside installer",
      "dimension": "security",
      "file": ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/references/troubleshooting.md:186",
      "findingClass": "instance-only",
      "scopeProof": "The line is one of two in the same block; the Aside packet shows the correct pattern at install.sh:88-99 with a pinned sha256 and an operator gate, and the Bladebro wrapper orders its digest check before execution at install.sh:166-176.",
      "affectedSurfaceHints": ["mcp-chrome-devtools/references/troubleshooting.md Node version block"]
    },
    {
      "id": "R4-P2-001",
      "severity": "P2",
      "title": "The hub README release index stops at 1.1.1.0 and omits the two newest releases, including the one that carries the phase 015 fixes",
      "dimension": "maintainability",
      "file": ".skilled/skills/mcp-browser-use/README.md:70",
      "findingClass": "instance-only",
      "scopeProof": "changelog/ lists five files and the README index returns three rows at :70-72, so the gap is exactly two rows in one table; the three mode packets each carry a complete changelog set.",
      "affectedSurfaceHints": ["README.md release index", "changelog/", "SKILL.md version authority line"]
    },
    {
      "id": "R7-P2-001",
      "severity": "P2",
      "title": "The Aside installer digest gate is enforced only by scripts/install.sh and documented nowhere, while seventeen documentation sites present the ungated vendor curl pipe bash as the install path",
      "dimension": "correctness",
      "file": ".skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:88",
      "findingClass": "instance-only",
      "scopeProof": "The gate is one block in one script and the omission is one sentence in one README row. A digest search over the Aside packet returns only scripts/install.sh, so no doc states the control; the vendor installer URL appears at seventeen sites across ten files, so the ungated path is the one the docs lead with.",
      "affectedSurfaceHints": [
        "mcp-aside-devtools/scripts/README.md install.sh row",
        "mcp-aside-devtools/feature-catalog/install/install-and-doctor.md install line",
        "mcp-aside-devtools/INSTALL-GUIDE.md step 3",
        "mcp-aside-devtools/README.md install block",
        "mcp-aside-devtools/SKILL.md install guidance"
      ]
    }
  ],
  "remediationWorkstreams": [
    {
      "id": "WS-1",
      "priority": "P1",
      "title": "Correct the Chrome DevTools Node-version troubleshooting block",
      "findingIds": ["R2-P1-001", "R2-P2-001"],
      "surface": ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/references/troubleshooting.md:178-196",
      "action": "Change the fix to install and select Node 20 or later, matching the block's own diagnosis at :179 and the eleven other Node 20 statements in the packet. Replace the piped curl with the packet's own gated pattern: download to a temporary file, verify a pinned sha256, then run it, and state that the step is operator-invoked.",
      "why": "Both defects are in one code block, so one edit closes both. The block currently prescribes a downgrade that breaks the tool it is troubleshooting, and it does so through an unverified pipe."
    },
    {
      "id": "WS-2",
      "priority": "P1",
      "title": "Give the Aside vocabulary a prose form",
      "findingIds": ["R5-P1-001"],
      "surface": ".skilled/skills/mcp-browser-use/ROUTER.md:53 and .skilled/skills/mcp-browser-use/hub-router.json vocabularyClasses",
      "action": "Add phrase forms that name Aside in prose without adding the bare word: `in aside`, `and aside`, `, aside`, `aside and`. Do not add bare `aside`, because `set this aside for now`, `put that aside and open the page` and `aside from that, ship it` all defer today and a bare keyword would route all three to the hub. Add a canary case for the prose three-mode prompt so the fixture covers the form that failed.",
      "why": "A request that names Aside currently either defers against the documented defer rule or silently loses Aside from a bundle. The fix must be phrase forms, not the bare word."
    },
    {
      "id": "WS-3",
      "priority": "P2",
      "title": "Repair the hub README release surface",
      "findingIds": ["R1-P2-001", "R4-P2-001"],
      "surface": ".skilled/skills/mcp-browser-use/README.md:8 and :70-72",
      "action": "Set the frontmatter version to 1.1.3.0 so it matches SKILL.md, hub-router.json, mode-registry.json and description.json, and add the 1.1.2.0 and 1.1.3.0 rows to the release index.",
      "why": "The release surface is wrong in both directions: it claims a version with no changelog entry and omits the two entries that exist. One edit closes both findings."
    },
    {
      "id": "WS-4",
      "priority": "P2",
      "title": "Disclose the Aside installer digest gate",
      "findingIds": ["R7-P2-001"],
      "surface": ".skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/README.md:55 and feature-catalog/install/install-and-doctor.md:24",
      "action": "Name the digest gate in the wrapper's own description, and present the wrapper before the raw vendor command in the feature catalog, saying that the wrapper pins the installer's sha256 and the raw command does not.",
      "why": "The packet's strongest supply-chain control is invisible at the point of install, and the documented first option bypasses it."
    },
    {
      "id": "WS-5",
      "priority": "P2",
      "title": "Correct the Core Web Vitals capability note",
      "findingIds": ["R1-P1-001"],
      "surface": ".skilled/skills/mcp-browser-use/ROUTER.md:33",
      "action": "Reword the note so it matches graph-metadata.json, which does carry `core web vitals` among its intent signals. The routing outcome is already correct, so this is a one-line accuracy fix.",
      "why": "A reader who trusts the note concludes the advisor cannot see Core Web Vitals for this hub, which is false."
    }
  ],
  "specSeed": [
    "A remediation phase should carry one criterion per workstream, each command-checkable: the troubleshooting block selects Node 20 or later and verifies a pinned digest before running a downloaded script; a prose three-mode prompt returns orderedBundle over all three modes; the README frontmatter version equals the newest changelog entry and the release index lists every changelog file; the Aside wrapper's description names its digest gate; ROUTER.md's Core Web Vitals note matches graph-metadata.json.",
    "The phase should add a canary case for the prose three-mode prompt, because the existing fixture covers only the id form and a green fixture hid the defect for a full phase.",
    "The phase should record that goal criterion 7 (`validate.sh --strict --recursive`) was never executed by this review lineage, so the remediation phase is the first place it can be proven."
  ],
  "planSeed": [
    "T1: edit `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/references/troubleshooting.md:178-196` so the fix selects Node 20 or later and verifies a pinned sha256 before running the downloaded installer; re-run `rg -n \"nvm install 1[0-9]\"` and expect no match below 20.",
    "T2: add Aside phrase forms to `ROUTER.md` `INTENT_SIGNALS` and `hub-router.json` `vocabularyClasses`, then replay `use chrome devtools, aside and bladebro` and `debug this page in aside` through `evaluateRoute` and expect a three-mode bundle and a single Aside route.",
    "T3: add a canary case for the prose three-mode prompt to `fixtures/canary-cases.v1.json` and confirm the fixture count rises to seventeen with all passing.",
    "T4: set `README.md` frontmatter to `1.1.3.0` and add the 1.1.2.0 and 1.1.3.0 rows to the release index; confirm `ls changelog/` and the index row count agree.",
    "T5: name the digest gate in `mcp-aside-devtools/scripts/README.md:55` and reorder the install options in `feature-catalog/install/install-and-doctor.md:24` so the wrapper comes first.",
    "T6: reword `ROUTER.md:33` to match `graph-metadata.json` on Core Web Vitals.",
    "T7: run `validate.sh --strict --recursive` on the packet, which this review could not execute, and record RESULT: PASSED for the parent and every child."
  ],
  "findingClasses": ["instance-only"],
  "affectedSurfacesSeed": [
    ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/references/troubleshooting.md",
    ".skilled/skills/mcp-browser-use/ROUTER.md",
    ".skilled/skills/mcp-browser-use/hub-router.json",
    ".skilled/skills/mcp-browser-use/README.md",
    ".skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/README.md",
    ".skilled/skills/mcp-browser-use/mcp-aside-devtools/feature-catalog/install/install-and-doctor.md",
    ".skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json"
  ],
  "fixCompletenessRequired": true
}
```

---

## 3. Active Finding Registry

Seven active findings. Every one was re-read at its shipped file:line in iteration 7 and is still active.

### P0

None.

### P1

**R2-P1-001 — The Node-version troubleshooting fix runs `nvm install 18` while the same block and seven other documents require Node 20 or higher**

- Dimension: security
- File: `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/references/troubleshooting.md:187`
- Evidence: the block's own comment at `:179` reads `# bdg requires Node.js 20.x or higher`, and the fix two lines later runs `nvm install 18` then `nvm use 18`. `INSTALL-GUIDE.md:180` states `engines.node >=20.0.0`, and eleven sites across the packet require Node 20.
- Impact: a reader who hits a Node-version error and follows the prescribed fix installs Node 18, which `bdg` 0.6.10 rejects, so the fix reproduces the error it diagnoses. On a machine already on Node 20, `nvm use 18` downgrades it and breaks a working install.
- Fix: select Node 20 or later in the block.
- Disposition: active, confirmed P1 at synthesis.
- Finding class: instance-only
- Scope proof: the `nvm` pattern appears at exactly two lines, both inside this block; the Node 14 sites elsewhere belong to the Bladebro launcher and are correct there.
- Affected surface hints: the troubleshooting block, the install script's prerequisite check, the install guide's dependency line.

**R5-P1-001 — The intent vocabulary has no prose form for Aside, so a request that names Aside either defers or silently drops it from a bundle**

- Dimension: correctness
- File: `.skilled/skills/mcp-browser-use/ROUTER.md:53`
- Evidence: `ASIDE_DEVTOOLS` lists twenty-one keywords and every one carries a qualifier; `BLADEBRO` in the same block carries bare `bladebro`. `debug this page in aside` reaches the hub from the advisor at 0.82 and the router returns `defer` with no scores. `use chrome devtools, aside and bladebro` reaches the hub at 0.95 and the router returns `orderedBundle` over `[mcp-chrome-devtools, mcp-bladebro]`, dropping Aside silently.
- Impact: a reader who names Aside gets either a question they already answered or a bundle that omits the mode they named. `SKILL.md:77` defines `defer` as the outcome for a request that "names no mode", so the defer contradicts the documented contract.
- Fix: add phrase forms (`in aside`, `and aside`, `, aside`, `aside and`) and a canary case for the prose three-mode prompt. Do not add bare `aside`.
- Disposition: active, confirmed P1 at synthesis.
- Finding class: instance-only
- Scope proof: one vocabulary class in one file; all sixteen canary cases pass, so the defect is outside the fixture's coverage rather than a regression in the phase 015 fix.
- Affected surface hints: `ROUTER.md` `ASIDE_DEVTOOLS`, `hub-router.json` `vocabularyClasses`, `graph-metadata.json` `intent_signals`, the compiled `routingModel`, the canary fixture, the `SKILL.md` defer definition.

### P2

**R1-P1-001 — `ROUTER.md` says Core Web Vitals is not advertised to the advisor, but `graph-metadata.json` `intent_signals` carries it**

- Dimension: correctness. File: `.skilled/skills/mcp-browser-use/ROUTER.md:33`. Raised P1 in iteration 1, downgraded to P2 in iteration 3 when the live advisor returned `sk-code` at 0.9295 for the prompt the P1 named. The contradiction stands; the predicted routing consequence does not reproduce. Fix: reword the note. Finding class: instance-only. Scope proof: the phrase appears at two metadata sites plus the one prose claim.

**R1-P2-001 — `README.md` carries version 1.1.4.0 while every other hub metadata file carries 1.1.3.0, and no changelog entry exists for 1.1.4.0**

- Dimension: correctness. File: `.skilled/skills/mcp-browser-use/README.md:8`. `SKILL.md`, `hub-router.json`, `mode-registry.json` and `description.json` all read 1.1.3.0; `changelog/` holds five entries ending at `v1.1.3.0.md`. Fix: set the frontmatter to 1.1.3.0. Finding class: instance-only. Scope proof: the README frontmatter is the only 1.1.4.0 site.

**R2-P2-001 — The Node-version fix pipes a downloaded script straight into bash with no digest gate**

- Dimension: security. File: `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/references/troubleshooting.md:186`. The Aside wrapper shows the correct pattern at `install.sh:88-99` and the Bladebro wrapper orders its digest check before execution at `install.sh:166-176`. Fix: download, verify a pinned sha256, then run. Finding class: instance-only. Scope proof: one of two lines in the same block.

**R4-P2-001 — The hub README release index stops at 1.1.1.0 and omits the two newest releases**

- Dimension: maintainability. File: `.skilled/skills/mcp-browser-use/README.md:70`. `changelog/` holds five entries; the index lists three. The two missing rows are the newest two, and `v1.1.3.0.md` is the entry that records the phase 015 fixes. Fix: add both rows. Finding class: instance-only. Scope proof: exactly two rows in one table.

**R7-P2-001 — The Aside installer digest gate is enforced only by `scripts/install.sh` and documented nowhere**

- Dimension: correctness (raised by the cross-reference pass). File: `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:88`. The wrapper compares `shasum -a 256` against a pinned `INSTALLER_SHA256` and exits 1 on mismatch. No document in the packet mentions it: a digest search returns only the script, and `scripts/README.md:55` describes the wrapper without naming the digest. Meanwhile the vendor installer URL appears at seventeen sites across ten files, and `feature-catalog/install/install-and-doctor.md:24` lists the raw command first. Fix: name the gate in the wrapper's description and present the wrapper first. Finding class: instance-only. Scope proof: one block in one script, one sentence in one README row.

---

## 4. Remediation Workstreams

Ordered: P1 first, then P2 advisories.

| Order | Workstream | Priority | Findings | Surface |
|---|---|---|---|---|
| 1 | Correct the Chrome DevTools Node-version troubleshooting block | P1 | R2-P1-001, R2-P2-001 | `mcp-chrome-devtools/references/troubleshooting.md:178-196` |
| 2 | Give the Aside vocabulary a prose form | P1 | R5-P1-001 | `ROUTER.md:53`, `hub-router.json` `vocabularyClasses`, canary fixture |
| 3 | Repair the hub README release surface | P2 | R1-P2-001, R4-P2-001 | `README.md:8`, `README.md:70-72` |
| 4 | Disclose the Aside installer digest gate | P2 | R7-P2-001 | `mcp-aside-devtools/scripts/README.md:55`, `feature-catalog/install/install-and-doctor.md:24` |
| 5 | Correct the Core Web Vitals capability note | P2 | R1-P1-001 | `ROUTER.md:33` |

Two pairs merge because one edit closes both. `R2-P1-001` and `R2-P2-001` are adjacent lines in one code block. `R1-P2-001` and `R4-P2-001` are the same README release surface wrong in both directions: it claims a version with no changelog entry and omits the two entries that exist.

---

## 5. Spec Seed

- One criterion per workstream, each command-checkable: the troubleshooting block selects Node 20 or later and verifies a pinned digest before running a downloaded script; a prose three-mode prompt returns `orderedBundle` over all three modes; the README frontmatter version equals the newest changelog entry and the release index lists every changelog file; the Aside wrapper's description names its digest gate; `ROUTER.md`'s Core Web Vitals note matches `graph-metadata.json`.
- Add a canary case for the prose three-mode prompt. The existing fixture covers only the id form, and a green fixture hid the defect for a full phase.
- Record that goal criterion 7 (`validate.sh --strict --recursive`) was never executed by this review lineage, so the remediation phase is the first place it can be proven.
- Record that the Aside vocabulary fix must not add bare `aside`, because three ordinary-English probes defer today and a bare keyword would route all three to the hub.

---

## 6. Plan Seed

- **T1** Edit `mcp-chrome-devtools/references/troubleshooting.md:178-196` so the fix selects Node 20 or later and verifies a pinned sha256 before running the downloaded installer. Verify with `rg -n "nvm install 1[0-9]"` returning no match below 20.
- **T2** Add Aside phrase forms to `ROUTER.md` `INTENT_SIGNALS` and `hub-router.json` `vocabularyClasses`. Verify by replaying `use chrome devtools, aside and bladebro` and `debug this page in aside` through `evaluateRoute`, expecting a three-mode bundle and a single Aside route.
- **T3** Add a canary case for the prose three-mode prompt to `fixtures/canary-cases.v1.json`. Verify the fixture count rises to seventeen with all passing.
- **T4** Set `README.md` frontmatter to `1.1.3.0` and add the 1.1.2.0 and 1.1.3.0 rows to the release index. Verify `ls changelog/` and the index row count agree.
- **T5** Name the digest gate in `mcp-aside-devtools/scripts/README.md:55` and reorder the install options in `feature-catalog/install/install-and-doctor.md:24` so the wrapper comes first.
- **T6** Reword `ROUTER.md:33` to match `graph-metadata.json` on Core Web Vitals.
- **T7** Run `validate.sh --strict --recursive` on the packet and record RESULT: PASSED for the parent and every child. This review could not execute it.

---

## 7. Traceability Status

**Core protocols.** Both pass.

| Protocol | Status | Evidence | Unresolved drift |
|---|---|---|---|
| `spec_code` | pass | `goal.md:1`; `mode-registry.json:1` | Goal criterion 7 is unverified, not failed: `validate.sh` is banned by this lineage's write surface and writes outside the lineage directory. |
| `checklist_evidence` | pass | `015-fix-follow-up-review-findings/goal.md:1`; `system-skill-advisor/changelog/v2.0.3.0.md:1` | Phase 015 criterion 3's replay half is the same unexecutable `validate.sh` item. |

**Overlay protocols.** Five applicable, all pass.

| Protocol | Status | Evidence | Unresolved drift |
|---|---|---|---|
| `skill_agent` | pass | `mode-registry.json:15`, `:39` | None. The hub declares no agent or command binding and ships none: `command: null` on all three mode entries, stated as the contract in the schema description. |
| `agent_cross_runtime` | pass | `.claude/skills/mcp-browser-use/SKILL.md:5`; `.claude/skills/mcp-browser-use/mode-registry.json:3` | None. Both mirrors are byte-identical to canonical at 312 files each; `diff -rq` returns no output for either skill. |
| `feature_catalog_code` | pass | `mcp-bladebro/references/cli-reference.md:34`; `references/install-and-verify.md:83` | None. All seven Bladebro commands the feature catalog names resolve to a documented site. |
| `playbook_capability` | pass | `manual-testing-playbook.md:152`; `mcp-aside-devtools/.../console-network-capture.md:33` | None. The index and the `hub-routing/` folder agree on all seven scenario ids, and the Aside parity scenario is capability-honest about the `page.on` gap. |
| `cross_reference_reverification` | pass | `troubleshooting.md:187`; `ROUTER.md:53`; `README.md:8` | None. All six findings active before this pass were re-read at their shipped file:line and all six remain active. |

**`AC_COVERAGE`.** Exempt. The target is a spec folder, but this lineage reviewed the shipped skill tree and the packet's goal documents rather than an `acceptance-criteria.md` lifecycle, so no acceptance-criteria coverage signal applies.

**Resource Map Coverage Gate.** Omitted. `resource-map.md` is absent from the packet, so the gate is skipped rather than failed.

---

## 8. Deferred Items

- **Goal criterion 7 is unverified.** `validate.sh --strict --recursive` on this packet is the one completion criterion this lineage could not execute, because the write surface bans `validate.sh` and the command writes outside the lineage directory. It is recorded as unverified in iterations 3, 6 and 7 and must be run by the remediation phase. This is a coverage limit of the review, not a defect in the packet.
- **The canary harness's artifact-writing half was not run.** `loadSnapshot` and `evaluateRoute` were exercised in memory and all sixteen cases passed, but `buildArtifacts` writes into `.skilled/bin/lib/compiled-routing/...`, outside this lineage's write surface, so the artifact-writing path is unproven here.
- **The advisor regression suite was not re-run.** The eleven live probes reproduce every 2.0.3.0 claim, but the suite's own ratchet metrics were taken from the changelog rather than re-measured.
- **The three mode packets' feature catalogs were swept only for the Bladebro command set.** The Chrome and Aside catalogs were checked on the specific claims the hub capability matrix repeats, not exhaustively.
- **The 31-scenario Chrome and Aside playbooks were read only at the parity scenario.** The hub playbook set was checked exhaustively; the two large mode playbooks were not.
- **No `frontier` object exists in the registry**, so there is no follow-up review node to list.

---

## Dimension Expansion Map

- Saturated directions: none recorded. `divergence.saturatedDirections` is empty.
- Completed pivots: none. `divergence.completed` is empty.
- Failed pivots: none. `divergence.failed` is empty.
- Audited overrides: none. `divergence.overrides` is empty.
- Council artifact references: none.
- Selected review directions: correctness (iterations 1 and 5), security (iteration 2), traceability (iterations 3 and 6), maintainability (iteration 4), cross-reference (iteration 7).
- Remaining frontier: none. The run reached its iteration cap with the final new-findings ratio below the convergence threshold.

This section records breadth only. It does not alter the verdict, the advisory flag, the finding registry or the self-check results.

---

## Search Ledger

- `searchCoverage`: required bug classes `undocumented_control`, `scope_widening`, `stale_finding`, `merged_workstream`; all four covered; `scope_widening` and `stale_finding` ruled out; none deferred or blocked; `graphCoverageMode` `graphless_fallback`.
- `candidateCoverage`: 21 bug classes covered across the run, 21 ruled out, none deferred, none blocked. The classes that produced findings are `contract_mismatch`, `stale_index`, `vocabulary_gap`, `silent_partial_route` and `undocumented_control`.
- `searchDebt`: empty. `hasSearchDebt` is false, so search debt is not part of the CONDITIONAL verdict.
- `ruledOutCandidates`: 20 entries, each with a rationale and evidence reference.
- `cleanSearchProof`: 20 entries, each with a proof statement naming the read or search that settled it.

Selected ruled-out directions, with evidence:

- The phase 015 three-mode bundle fix not working: ruled out, the id-form prompt returns all three modes and all sixteen canary cases pass (`router.cjs:96`).
- The advisor 2.0.3.0 changelog overstating the id-noun or staging change: ruled out, eleven live probes reproduce every claim including the disclosed 0.45 anchor limitation (`changelog/v2.0.3.0.md:1`).
- The six advisor-only intent signals being stage-one/stage-two drift: ruled out, `routerPolicy.discoveryClassesContract` documents discovery classes as defer evidence only (`hub-router.json:1`).
- The runtime mirrors having drifted from canonical: ruled out, `diff -rq` returns no output for either skill at 312 files each (`.claude/skills/mcp-browser-use/SKILL.md:5`).
- The hub promising an agent or slash command it does not ship: ruled out, `command: null` on all three mode entries (`mode-registry.json:15`).
- The Aside parity scenario overclaiming console or network capture: ruled out, the scenario records the `page.on` throw and fails an overclaiming verdict (`console-network-capture.md:33`).
- The Node 14 and Node 20 requirements contradicting each other across the hub: ruled out, they belong to different packets with different launchers.
- The Aside packet recommending an ungated install without operator consent: ruled out, every install site frames it as an explicit operator decision (`INSTALL-GUIDE.md:21`).

---

## Audit Appendix

### Convergence

| Iteration | Dimension | New findings | newFindingsRatio | Verdict |
|---|---|---|---|---|
| 1 | correctness | 2 (1 P1, 1 P2) | 1.0 | CONDITIONAL |
| 2 | security | 2 (1 P1, 1 P2) | 0.5 | CONDITIONAL |
| 3 | traceability | 0 (1 downgrade) | 0.4167 | CONDITIONAL |
| 4 | maintainability | 1 (1 P2) | 0.1429 | CONDITIONAL |
| 5 | correctness (2nd) | 1 (1 P1) | 0.3571 | CONDITIONAL |
| 6 | traceability (2nd) | 0 | 0.0 | CONDITIONAL |
| 7 | cross-reference | 1 (1 P2) | 0.0667 | CONDITIONAL |

- Final convergence score: 0.9333 against a 0.10 threshold. The final iteration's new-findings ratio of 0.0667 is below the threshold, so the run converged rather than merely exhausting its iteration cap.
- Stop reason: `converged`.
- Release-readiness state: `converged` (no active P0, converged stop, CONDITIONAL verdict).
- Registry integrity: `corruptionCount` 0, `fieldWarnings` empty, `corruptionWarnings` empty, `strategyWarning` null at every reducer pass.

### Coverage

- Dimensions: 4 of 4 covered. Correctness twice, traceability twice, security once, maintainability once, cross-reference once.
- Iterations dispatched: 7 of 7.
- Files reviewed across the run: the hub skill tree, the compiled routing phase, both runtime mirrors, the advisor changelog and CLI, and the packet's goal and phase documents.

### Ruled-out claims

Twenty ruled-out directions are recorded in the registry with evidence. The eight most load-bearing are listed in the Search Ledger above.

### Sources reviewed

`steer.md` (absent at every iteration, so no lead ruling applied), `review-scope-files.txt` (522 paths), `goal.md`, `015-fix-follow-up-review-findings/{goal.md,spec.md,implementation-summary.md,tasks.md}`, `002-hub-scaffold/spec.md`, `005-routing-and-surfaces/spec.md`, `006-verification/implementation-summary.md`, `001-research/research/{deep-research-state.jsonl,research.md}`, `.skilled/skills/mcp-browser-use/` (hub metadata, three mode packets, playbooks, changelogs, scripts, feature catalogs), `.skilled/skills/mcp-tooling/` (five named files), `.skilled/skills/system-skill-advisor/{changelog/v2.0.3.0.md,runtime/lib/scorer/lanes/explicit.ts}`, `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/`, `.skilled/bin/skill-advisor.cjs`, `.skilled/commands/doctor/scripts/parent-skill-check.cjs`, `.claude/skills/{mcp-browser-use,mcp-tooling}/`.

### Cross-reference appendix

**Core Protocols**

- `spec_code` — pass. Goal criteria 1 through 6 verified against shipped evidence; criterion 7 unverified and named as a coverage limit.
- `checklist_evidence` — pass. Phase 015 criteria 1 and 2 verified as behaviour; criterion 3's replay half unverified for the same reason.

**Overlay Protocols**

- `skill_agent` — pass. No agent or command binding is claimed or missing.
- `agent_cross_runtime` — pass. Both mirrors byte-identical to canonical.
- `feature_catalog_code` — pass. Seven Bladebro commands all resolve.
- `playbook_capability` — pass. Seven scenario ids agree; the parity scenario is capability-honest.
- `cross_reference_reverification` — pass. All six pre-existing active findings re-read and still active.

### Replay validation

The compiled router was replayed in memory against its own fixture: `loadSnapshot` compiled the model from `mode-registry.json`, `hub-router.json` and `SKILL.md`, and `evaluateRoute` scored all sixteen canary cases. Sixteen passed. The three-mode id prompt returned `orderedBundle` over all three modes at score 8 each, and the four bundle rules in the compiled model include the triple. The replay agrees with the fixture's expectations, so the persisted routing result is reproducible from current source.

### Lineage integrity

- State log rows: one config row, seven iteration rows, two claim-adjudication rows. Every row was written through the append gateway; the projection was never written directly.
- Deltas: `deltas/iter-001.jsonl` through `deltas/iter-007.jsonl`, each with its canonical iteration record as the first line.
- Iteration artifacts: `iterations/iteration-001.md` through `iteration-007.md`, each ending with exactly one `Review verdict:` line.
- No file outside `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/review/lineages/vibe-1` was created, modified or deleted by this lineage.
