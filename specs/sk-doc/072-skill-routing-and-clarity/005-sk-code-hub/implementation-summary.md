---
title: "Implementation Summary: Phase 5: sk-code hub and mode packets"
description: "The sk-code hub and its four packets now open with a short routing statement and keep their machine block in a final MACHINE ROUTER, one sentence names the routing authority, and the four sk-code ledger entries are gone."
trigger_phrases:
  - "sk-code hub and mode packets implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/005-sk-code-hub"
    last_updated_at: "2026-10-28T11:08:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Moved the sk-code hub and its packets to the routing canon"
    next_safe_action: "Conductor review and landing"
    blockers: []
    key_files:
      - "scratch/baseline.md"
      - "scratch/after.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skill-routing-and-clarity-phase-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Does sk-code keep its stage-two exemption and leave its 92 stage-one terms out of ROUTER.md? Yes: its ROUTER.md is a weight-1 surface and phase router, and pushing those terms into surface intents would change surface selection. Phase 004's open item is decided, not deferred."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary: Phase 5: sk-code hub and mode packets

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-sk-code-hub |
| **Completed** | 2026-10-28 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every sk-code document now opens with a short routing statement and keeps its machine block in a final `MACHINE ROUTER` section. One sentence names the routing authority, and the four sk-code entries are gone from the routing-shape ledger.

### The shape, per file

Counted the way `package_skill.py` counts: non-blank lines between the SMART ROUTING heading and the next heading, excluding `---`.

| File | SMART ROUTING (lines / words) | Machine router | Section after SMART ROUTING |
|------|-------------------------------|----------------|------------------------------|
| `.skilled/skills/sk-code/SKILL.md` | 67 / 787 → 3 / 143 | `## 6. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` at 61 |
| `sk-code-quality/SKILL.md` | 102 / 1760 → 8 / 147 | `## 9. MACHINE ROUTER`, last | `## 3. RESOURCES` at 67 |
| `sk-code-ci/SKILL.md` | 3 / 99 → unchanged | `MACHINE ROUTER`, last | `## 3. SURFACE STANDARDS` at 56 |
| `sk-code-skilled/SKILL.md` | 118 / 327 → 3 / 112 | `## 6. MACHINE ROUTER`, last | `## 3. SURFACE STANDARDS` at 57 |
| `sk-code-review/SKILL.md` | 312 / 2104 → 8 / 130 | `## 10. MACHINE ROUTER`, last | `## 3. HOW IT WORKS` at 63, from 415 |

The moved blocks are unchanged. The python block sets at `782195b82b^` and `782195b82b` are identical for the hub, quality and skilled. Review's block was split: the seven resolver functions are byte-identical in `review-core.md` §9 (checked function by function), and the entry point lost the resolver calls, the `precedence` dict and the return fields that carried them.

### Review's resolver algorithm

The 282-line pseudocode block held two jobs. The intent scoring and the resource loader stay in `## 10. MACHINE ROUTER`. The rule-override algorithm moved into `review-core.md` section 9, beside the floor, the precedence table and the outcomes it implements: `resolvable_files`, `resolve_rule_sources`, `inside_hub_checkout`, `surface_evidence`, `checklist_level`, `applied_overrides` and `rule_sources_line`. Section 2 of the packet names the move in one line.

The packet drops from 5,676 to 4,297 words, under the 5,000-word ceiling. The Extension Floors section is byte-identical, so `check-rule-copies.js` and its canary needed no change.

### One routing authority

`SKILL.md` §2 names it once: `hub-router.json` is the mode vocabulary, and `ROUTER.md` is the leaf-set router. Every other surface now points at that sentence:

- `ROUTER.md` line 18 calls itself the leaf-set authority and points at the hub sentence.
- `hub-router.json`'s `defaultResourceContract` and `mode-registry.json`'s description point at the same sentence.
- The feature catalog and its two-axis page describe `mode-registry.json` as the list of modes and packets.

`grep -i 'authoritative routing source' .skilled/skills/sk-code` finds nothing.

### ROUTER.md section 2

Section 2 no longer carries a keyword table. It explains how the `INTENT_SIGNALS` block in §9 is scored and sends the reader there. The phase boost reads `verification, debugging, code quality`; `testing` is removed because §9 has no TESTING intent. Section 9 is unchanged.

### Ledger, catalog and playbooks

The four sk-code entries came off `routing-shape-known-debt.json`, so `parent-skill-check` 12b passes with an empty ledger. `feature-catalog.md` and `two-axis-registry-driven-routing.md` were updated to the new authority sentence. The review playbook root and its seven intra-routing scenarios anchor `INTENT_SIGNALS`, `RESOURCE_MAP` and `DEFAULT_RESOURCES` at `## 10. MACHINE ROUTER` instead of section 2.

### Changelogs and carriers

sk-code v3.9.20.0, sk-code-quality v1.13.13.0, sk-code-skilled v2.1.12.0 and sk-code-review v1.9.11.0. The carriers stepped with them: `hub-router.json`, `mode-registry.json` and `description.json` to 3.9.20.0, `ROUTER.md` to 2.3.8.0, `review-core.md` to 1.5.7.0, the catalog pages and the playbook files by one patch. The `.hermes` copies, the activation manifest and `skill-graph.json` were regenerated.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The phase moved each block with a scratch transform script and checked the move before it ran the gates. `restructure.py` handled review, asserting the section boundaries and the two jobs inside the 282-line block before it cut; `reshape_skill.py` handled skilled; `replace_intent_table.py` replaced `ROUTER.md` §2. Each move was followed by a verifier that read the pre-edit file from `git show HEAD:` and compared the moved block, so a reword would have failed before the commit.

The gates then ran as one set: `scratch/gates.sh` runs 35 gates and prints one line per gate. `scratch/baseline.md` and `scratch/after.md` record the two runs.

No executor dispatch is recorded for this phase. The work is the scratch scripts, the verifiers and the commit `782195b82b`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One sentence names the routing authority; the other files point at it | Three documents each claimed a different authority, and the catalog carried a fourth. Naming the split once in the hub removes the possibility of disagreement without deleting any file's own content. |
| `ROUTER.md` §2 points at §9 instead of generating a table from it | The spec allowed either. A generated table would still be a second copy in prose, and the two copies had already drifted in both directions. §2 now explains the scoring model, which §9 cannot, and the keywords live once. |
| sk-code keeps its stage-two exemption, and the 92 stage-one terms stay out of §9 | sk-code's `ROUTER.md` is a weight-1 surface and phase router: every route loads `DEFAULT_RESOURCE` and its intents mix packets. Pushing terms such as `review`, `json` and `shell` into weight-1 surface intents would change surface selection for prompts that route correctly today. Phase 004 left this open; this phase decides to keep the exemption and record it. 12b passes with an empty ledger because the exemption is a property of the hub, not debt the ledger absorbs. |
| The review override algorithm moved into `review-core.md` §9, not a script | It implements the floor, the precedence table and the `Rule sources:` line that `review-core.md` §8 defines, so the algorithm sits beside the doctrine it applies. A script would add an executable surface and a test harness for code the reviewer reads, not only runs. |
| The Extension Floors lines were left byte-identical rather than updating `check-rule-copies.js` | The spec allowed either, and no rule changed here. A pinned line that does not need to move is the cheaper and safer choice, and the canary still proves the copies match. |
| `sk-code-ci` was not edited | It already had a 3-line SMART ROUTING and its `MACHINE ROUTER` last, and it carries no ledger entry. Editing it would have been churn. |
| Every changed skill steps a patch version | The change is routing shape and prose only: no route, resource or rule changed. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:deviations -->
## Deviations

1. **Files outside spec.md's Files to Change.** `routing-shape-known-debt.json`; `review-core.md`; the feature catalog and its two-axis page; the review playbook root and seven intra-routing scenarios; `ROUTER.md`, `hub-router.json`, `mode-registry.json` and `description.json`; the `.hermes` copies; the activation manifest; `skill-graph.json`; four changelogs.
2. **The baseline file is `scratch/baseline.md`**, as the phase brief named it. Task T002 named `scratch/before.md`.
3. **No `/speckit:plan` run (T003).** `plan.md` §4 fixed the five-step order, and the runner in `scratch/` supplied the verify command.
4. **`sk-code-ci` was not edited (T005).** It was already at the canon shape, so the task closed without a change.
5. **`ROUTER.md` §2 was replaced with prose**, the second option spec.md §3 offered, rather than generated from §9.
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Full gate set (`scratch/gates.sh`), 35 gates | 35 of 35 exit 0; the 34 baseline gates are as in the baseline |
| `parent-skill-check` 12b with an empty ledger | `PASS: 12b-routing-shape: hub and 4 packet(s) follow the routing canon (0 known debt)` |
| `package_skill.py --check --strict`, four packets | `Result: PASS` for quality, skilled, review and ci; advisories only |
| `check-rule-copies.js` | OK: 8 exact-string files, 2 Iron Law files, 21 delivery-prefix anchors, 6 extension floors, 2 example outputs |
| `tests/check-rule-copies.test.sh` | `All rule-canary test cases passed`, exit 0 |
| Extension Floors section, `782195b82b^` vs `HEAD` | `diff` empty |
| `sk-code-review/SKILL.md` words | 5,676 → 4,297 (ceiling 5,000) |
| Routing accuracy | 155/195, 49/66, 19/24, identical to the baseline |
| `compiled-route-guard.cjs --json` | 7 of 7 `fresh`, failures 0 |
| Router reach | wrong-hub 0, outranked 0, no-reach 0, allowed 9 (baseline the same) |
| `validate.sh --recursive --strict` | `RESULT: PASSED` |

Detail: `scratch/after.md`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The 92 stage-one terms are still carried by no intent.** That is a decision, not a gap left open: sk-code keeps its stage-two exemption for the reason in Key Decisions. The check cannot show the gap because its sk-code line prints `stage-two=0` by design. A later phase that gives sk-code a mode-vocabulary stage two has to revisit the decision.
2. **The `v1.9.11.0` changelog says the review packet dropped to 4,274 words.** The check's own count at the commit is 4,297; the changelog figure was taken before the last edit. Both are under the ceiling, and the measured number is the one recorded here.
3. **The transform scripts and their verifiers are not committed.** They live in `.scratch-dc90/072-005/`. The evidence inside the packet is the runner `scratch/gates.sh` and the two gate tables, which land with these docs.
<!-- /ANCHOR:limitations -->
