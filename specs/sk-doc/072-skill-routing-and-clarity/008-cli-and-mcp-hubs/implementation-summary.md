---
title: "Implementation Summary: Phase 8: cli and mcp hubs"
description: "The cli-external-orchestration and cli-classifier hubs and all sixteen cli and mcp packets now open with a short routing statement and keep their machine detail in a final MACHINE ROUTER, the eighteen ledger entries are gone, and the six-step call sequence is written once instead of seven times."
trigger_phrases:
  - "cli and mcp hubs implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/008-cli-and-mcp-hubs"
    last_updated_at: "2026-10-28T14:45:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Moved two hubs and sixteen packets to the routing canon and fixed every review finding"
    next_safe_action: "Conductor landing"
    blockers: []
    key_files:
      - "scratch/before.md"
      - "scratch/after.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skill-routing-and-clarity-phase-008"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Did the mcp-tooling hub have to change? No. Its SMART ROUTING was 10 non-blank lines and 148 words at the baseline, inside both canon limits, and the research points at its two-stage statement as the model to copy. Its nine packets changed and the hub did not."
      - "Should the six cli packets that name only part of the helper set be extended to name all seven helpers? No. The shared statement was corrected to describe what the packets measurably carry, because adding helper names to six packets would change what each packet advertises to the vocabulary source, which is a vocabulary change rather than a shape one."
      - "Do the packets' LOADING_LEVELS ALWAYS rows restate the hub's first leaf slice? No. They name the in-packet resources a packet loads first, which is a separate layer from the hub ROUTER.md first slice, so they were left exactly as they stood."
      - "Is the mcp-magicpath packet part of this phase? No. Another session is deprecating the mode, so its packet, its ledger entry and its version are all untouched."
---

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary: Phase 8: cli and mcp hubs

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-cli-and-mcp-hubs |
| **Completed** | 2026-10-28 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The cli-external-orchestration and cli-classifier hubs, their eight packets and the eight mcp packets in scope now open with a short routing statement and keep their machine detail in a final `MACHINE ROUTER` section. The eighteen entries those hubs and packets held in the routing-shape ledger are gone, and the shared helper bodies are stated once, in `system-spec-kit/references/cli/shared-smart-router.md`.

### The shape, per file

Counted the way `package_skill.py` and `parent-skill-check` count: non-blank lines between the SMART ROUTING heading and the next heading, excluding `---`. Before is the ledger's recorded count, after is the same rule measured on the final file.

| File | SMART ROUTING (lines / words) | Machine router | Section after SMART ROUTING |
|------|-------------------------------|----------------|------------------------------|
| `.skilled/skills/cli-external-orchestration/SKILL.md` | 26 / 586 → 10 / 139 | `## 6. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` |
| `cli-claude-code/SKILL.md` | 87 / 808 → 6 / 124 | `## 9. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` |
| `cli-codex/SKILL.md` | 86 / 588 → 6 / 124 | `## 9. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` |
| `cli-cursor/SKILL.md` | 94 / 685 → 3 / 65 | `## 9. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` |
| `cli-devin/SKILL.md` | 85 / 605 → 3 / 63 | `## 9. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` |
| `cli-hermes/SKILL.md` | 82 / 610 → 6 / 118 | `## 9. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` |
| `cli-opencode/SKILL.md` | 64 / 1026 → 7 / 125 | `## 8. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` |
| `cli-pi/SKILL.md` | 57 / 492 → 5 / 115 | `## 9. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` |
| `.skilled/skills/cli-classifier/SKILL.md` | 24 / 334 → 11 / 140 | `## 6. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` |
| `cli-jev/SKILL.md` | 136 / 771 → 5 / 130 | `## 9. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` |
| `mcp-aside-devtools/SKILL.md` | 128 / 754 → 4 / 92 | `## 9. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` |
| `mcp-chrome-devtools/SKILL.md` | 128 / 736 → 4 / 77 | `## 9. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` |
| `mcp-click-up/SKILL.md` | 172 / 1107 → 5 / 115 | `## 9. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` |
| `mcp-figma/SKILL.md` | 142 / 1276 → 6 / 163 | `## 8. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` |
| `mcp-mobbin/SKILL.md` | 135 / 1161 → 5 / 132 | `## 10. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` |
| `mcp-notion/SKILL.md` | 177 / 1069 → 5 / 158 | `## 9. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` |
| `mcp-obsidian/SKILL.md` | 294 / 1676 → 4 / 96 | `## 9. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` |
| `mcp-refero/SKILL.md` | 132 / 1100 → 4 / 96 | `## 10. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` |

Every SMART ROUTING section is inside the 12-line and 180-word limits, the largest being `cli-classifier` at 11 lines and `mcp-figma` at 163 words. `MACHINE ROUTER` is the last H2 in all eighteen files, and no other H2 moved: the appendix was appended to a file whose numbering already ended above it, so `## 6.`, `## 8.`, `## 9.` and `## 10.` follow the file each one sits in.

The moved blocks are unchanged. Every machine line and every fenced block is the same multiset as at `HEAD` in all eighteen files (`scratch/after.md` §5), and the read-only review found the same over the eighteen `.hermes` mirrors: 0 machine lines lost, 0 fenced blocks altered, no machine line duplicated.

### The call sequence, written once

At `HEAD` each of the seven cli packets ended its SMART ROUTING with a numbered **Call sequence** of six steps, and each copy pointed at `shared-smart-router.md` for the function body. The same six steps were therefore written seven times. The seven copies are gone. What remains is one pointer line in `cli-pi` and the shared statement itself, which is where the helpers and their call order already lived.

The packets keep their task-intent maps: `INTENT_SIGNALS`, `RESOURCE_MAP`, `LOADING_LEVELS` and `UNKNOWN_FALLBACK_CHECKLIST` are still inline in each packet, because they decide something the hub does not. What was deleted is only what restated the hub: the first-slice leaf list, which `ROUTER.md` §2 owns.

`cli-claude-code` carried the longer restatement. Its §8 REFERENCES opened with a `Start with` list of six resources, four more than the hub's two-leaf slice. The list is gone: the section now says the hub `ROUTER.md` names the two leaves a Claude Code dispatch starts from and that the `ALWAYS` tier in §9 names the baseline, which is what the hub actually says.

### The shared statement

`system-spec-kit/references/cli/shared-smart-router.md` is where the shared helper bodies live, and the phase made it the one place that states them. Three lines changed:

- The opening paragraph now describes the seven packets as they measurably are. None defines any of the seven helpers; every packet names `discover_markdown_resources()` and `_guard_in_skill()`; only `cli-hermes` names `score_intents()` and `select_intents()`; `cli-hermes` and `cli-opencode` name `load_if_available()` and `get_routing_key()`.
- The `route_<PROVIDER>_resources` line gained `hermes`, so the slug list names all seven providers rather than six. The research had this as a phase 002 item and it was still open when this phase started.
- The closing pointer sends a reader to "each skill's final `MACHINE ROUTER` section" rather than "`SKILL.md` §2 Smart Routing", which is where the dictionaries now sit.

The file steps from 1.6.1.0 to 1.6.2.0.

### Pointers repointed

Sixty-three support documents named a section number that moved, and every one of the 283 changed lines among them is a section pointer. The bulk is the `intra-routing-recall` prompt files under six mcp packets, forty-nine of them, which point at `SKILL.md` §2 for the intent model and the router; §2 is now the prose summary. The rest is seven manual-testing playbooks, three `providers-and-models.md` references, two feature catalogs, one `ask-mode-read-only.md` and `mcp-obsidian/references/mcp-tools.md`.

### Ledger, mirrors and carriers

The eighteen entries came off `routing-shape-known-debt.json`, so `parent-skill-check` 12b passes with no debt for either changed hub and one entry for `mcp-tooling`, which is `mcp-magicpath`. The ledger drops from 26 entries to 8; the eight that stay belong to `cli-orca`, `mcp-code-mode`, `mcp-magicpath`, `sk-git`, `sk-prompt`, `sk-vision`, `system-skill-advisor` and `system-spec-kit`.

The three compiled-route manifests were refreshed and copied over the archived activation copies that `compiled-route-sync` compares. Eighteen `.hermes` mirrors were regenerated, and the check reports 67 copies in sync. `skill-graph.json` needed no regeneration: the freshness gate finds no stale row, no zombie, no ghost and no signal drift.

### Changelogs and versions

One patch step for each changed skill, and eighteen new changelog files:

| Skill | Before | After |
|-------|--------|-------|
| cli-external-orchestration | 1.7.9.0 | 1.7.10.0 |
| cli-claude-code | 1.5.4.0 | 1.5.5.0 |
| cli-codex | 1.9.9.0 | 1.9.10.0 |
| cli-cursor | 1.5.5.0 | 1.5.6.0 |
| cli-devin | 1.4.8.0 | 1.4.9.0 |
| cli-hermes | 1.0.7.0 | 1.0.8.0 |
| cli-opencode | 1.5.4.0 | 1.5.5.0 |
| cli-pi | 1.5.17.0 | 1.5.18.0 |
| cli-classifier | 0.8.3.0 | 0.8.4.0 |
| cli-jev | 0.1.7.0 | 0.1.8.0 |
| mcp-aside-devtools | 1.1.4.0 | 1.1.4.1 |
| mcp-chrome-devtools | 1.0.16.0 | 1.0.16.1 |
| mcp-click-up | 1.2.5.0 | 1.2.6.0 |
| mcp-figma | 1.1.6.0 | 1.1.7.0 |
| mcp-mobbin | 1.1.3.0 | 1.1.4.0 |
| mcp-notion | 0.1.2.0 | 0.1.3.0 |
| mcp-obsidian | 0.24.2.0 | 0.24.3.0 |
| mcp-refero | 1.1.4.0 | 1.1.5.0 |

The two changed hubs' `description.json`, `hub-router.json` and `mode-registry.json` carry the same versions, which is what check 13a reads, and 13b reads the newest changelog entry back. `mcp-tooling` stays at 1.8.9.0, because its `SKILL.md` did not change.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The phase ran in two dispatches at the same time. One was a Luna worker through `cli-codex`, running `gpt-6-luna` at max reasoning effort with the `fast` service tier. The other was a DeepSeek worker through `cli-pi`, running DeepSeek V4.1 Flash through LLMGATEWAY. The two ran side by side on the same change, and no record of which worker wrote which file survived, so this summary names neither worker for a file and measures the result as one change.

The restructure was proven before the gates ran. Each mover in `.scratch-dc90/072-008/` reads the pristine `HEAD` copy from its `orig/` directory and slices by line range, asserting the target boundaries before it cuts, and each is paired with a verifier that compares the result back against that copy: `no_lost_lines.py` proves every original line still appears in order, `machine-lines.py` and `machine-proof.py` compare the declaration counts, `section_check.py` compares every section outside SMART ROUTING, and `verify_packet.py` and `audit.py` report the shape and the moved-block bytes. The gates then ran as one set: `scratch/gates.sh` runs 39 commands and prints one line per gate, and `scratch/before.md` and `scratch/after.md` record the two runs.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:review -->
## Review Fixes

A read-only review of the uncommitted diff returned no P0, two P1 and three P2 findings (`report.md` ends `FINDINGS: P0=0 P1=2 P2=3`). All five are fixed in the working tree.

| Finding | Fix |
|---------|-----|
| P1-1 Two mcp packets linked the shared helper reference one level too high | `mcp-aside-devtools/SKILL.md:244` and `mcp-chrome-devtools/SKILL.md:222` now read `../../system-spec-kit/references/cli/shared-smart-router.md`, which resolves from `.skilled/skills/mcp-tooling/<packet>/`. The two mirrors carry the `.hermes` depth instead, `../../../.skilled/skills/system-spec-kit/...`. Both forms resolve, and no link validator exists to have caught the old one. |
| P1-2 The shared statement claimed call sequences the packets do not carry | `shared-smart-router.md:17` was rewritten to the measured table. The old line said all seven packets name `score_intents`, `select_intents` and `load_if_available`, and that six name `get_routing_key` while `cli-opencode` omits it. Only `cli-hermes` names the first two, and `cli-opencode` does name `get_routing_key`. |
| P2-3 The two mcp packets' pattern list began at "Pattern 3" | The two surviving bullets are now `Pattern 1` and `Pattern 2` in both files and both mirrors, with no 3 or 4 left. |
| P2-4 `cli-opencode` still called §2 alone the routing authority | `cli-opencode/SKILL.md:222` now reads "Smart Routing (Section 2) is the summary. The final `MACHINE ROUTER` section of this file is the single routing authority." |
| P2-5 Eight packets named a signal id `hub-router.json` does not define | All eight now name the `routerSignals` id rather than the stage-two `INTENT_SIGNALS` token: `cli-codex`, `cli-claude-code`, `cli-cursor`, `cli-devin`, `mcp-click-up`, `mcp-figma`, `mcp-obsidian`, `mcp-refero`. The five packets that already used the id were the model. |

The review also checked and cleared ten items, and one of them is worth recording: it found all 314 added `§N` pointers resolving to a section with that number, 121 links on added lines resolving except the four in P1-1, and seven live prompts taking the same route as `main`.
<!-- /ANCHOR:review -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The `mcp-tooling` hub was left as it is | Its SMART ROUTING was 10 lines and 148 words at the baseline, inside both limits, and the research names its two-stage statement as the model the canon wants. Changing it would have been churn with a real chance of losing the example. |
| The packets keep their task-intent maps | The canon keeps a packet's map where it decides something the hub does not. Which reference a Claude Code dispatch loads first is a packet decision; which packet a dispatch reaches is the hub's. Only the second was removed from the packets. |
| The shared statement was corrected, not the six packets extended | Extending six packets to name all seven helpers would change what each advertises to the vocabulary source, which is the vocabulary problem phase 004 settled, not a shape one. The file now says what the packets carry. |
| The `LOADING_LEVELS` `ALWAYS` rows were left alone | They name the resources a packet loads on every invocation, which is a separate layer from the hub `ROUTER.md` first slice. Treating them as a restatement would have made a packet load nothing of its own. |
| A signal name says `routerSignals`, not `INTENT_SIGNALS` | The hub scores `hub-router.json` `routerSignals` in stage one and `ROUTER.md` `INTENT_SIGNALS` in stage two. A packet sentence that says "the hub's `CODEX` signal" names the stage-two key while describing the stage-one decision, which is the drift this programme exists to remove. |
| The two killed patterns were renumbered rather than restored | Their facts survive in the sentence that points at `shared-smart-router.md`. Re-adding them would have restored duplication to fix a count. |
| `mcp-magicpath` was not touched | Another session is deprecating the mode. Its packet, its ledger entry and its version all stay, and the `mcp-tooling` 12b line reports one known debt because of it. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:deviations -->
## Deviations

1. **Files outside spec.md's Files to Change.** `routing-shape-known-debt.json`; `system-spec-kit/references/cli/shared-smart-router.md`; the three compiled-route manifests and their three archived activation copies; the two changed hubs' `description.json`, `hub-router.json` and `mode-registry.json`; 63 support documents; eighteen `.hermes` mirrors; eighteen changelogs. Each one is a carrier of a change made in scope: a ledger row to delete, a shared statement that described the old shape, a hash that covers a changed file, a version, a pointer or a mirror.

2. **`plan.md` and T007 say three hub routing sections; two were shortened.** `mcp-tooling` was already inside the limits, so it needed no edit. The tasks file records the two that changed and why the third did not.

3. **Two changelogs step the fourth version segment.** `mcp-aside-devtools` goes 1.1.4.0 to 1.1.4.1 and `mcp-chrome-devtools` 1.0.16.0 to 1.0.16.1, where the other sixteen step the third segment. Both changelog files, both `SKILL.md` frontmatter lines and the checks that read them agree, so no gate reports it; it is recorded here because a reader comparing bumps will notice.

4. **The `hermes` slug in `shared-smart-router.md` closed a phase 002 item.** The research listed "`shared-smart-router.md` six to seven" as a phase 002 correctness fix. It was still six at `HEAD`, so it was fixed here, in the file this phase already had to edit.
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Full gate set (`scratch/gates.sh`), 39 gates | 39 of 39 exit 0, the same 39 the baseline ran |
| `parent-skill-check` 12b, three hubs | `hub and 7 packet(s) ... (0 known debt)`, `hub and 1 packet(s) ... (0 known debt)`, `hub and 9 packet(s) ... (1 known debt)` |
| `package_skill.py --check --strict`, eighteen changed files | `Result: PASS` on all eighteen, and no advisory on either changed hub |
| `routing-shape-known-debt-ratchet.test.cjs` | 4 of 4 pass |
| `compiled-route-guard.cjs --json` | 7 of 7 `fresh`, failures 0 |
| `compiled-route-sync.cjs --check` | 55 of 55 served copies match |
| `sync-skills-hermes.cjs --check` | `PASS: 67 Hermes skill copies in sync` |
| `check-contract-drift.cjs` | `OK commands=3` |
| Routing accuracy | 155/195, 49/66, 19/24, identical to the baseline |
| Live route, six prompts across the three hubs | Same decision and targets as the review's seven-prompt run against `main`, exit 0 each |
| `validate.sh --strict` and `--recursive --strict` | `RESULT: PASSED`, exit 0 both |

Detail: `scratch/after.md`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`cli-opencode/SKILL.md` is two words under a hard cap.** `package_skill.py` enforces `MAX_SKILL_MD_WORDS = 5000` with a hard failure, and it counts 4,998 words in that file; `wc -w` counts 4,999. Any further prose in it fails the check, so the next change to that packet has to cut before it adds.

2. **Two packets step the fourth version segment while sixteen step the third.** Recorded under deviations. Nothing reads it as a defect, and the next reader comparing bumps will see the inconsistency.

3. **`mcp-tooling/SKILL.md` keeps the older shape.** It has no `MACHINE ROUTER` heading and keeps its compiled-routing blockquote inside SMART ROUTING. It is inside the canon limits and outside this phase's diff, so it was left as it is; it is the one hub of the three still in the older form.

4. **The per-packet order was not recorded.** The two dispatches ran in parallel, so T004's step and CHK-022's row cannot be shown as an order. What stands in their place is the per-file comparison against `HEAD` over the final tree.

5. **The runner's default output directory names an earlier phase's path.** `scratch/gates.sh` takes the directory as its first argument, so both runs passed theirs explicitly; the default is the one line in the runner that is not this phase's.

6. **`package_skill.py` advisories on packets are not part of the 39 gates.** The runner checks the fourteen skill roots. Run against a packet, thirteen of the sixteen packets carry the 3,000-word recommendation advisory, and every one of them already carried it at `HEAD`: no file crossed the threshold because of this change, and every packet passes.
<!-- /ANCHOR:limitations -->
