---
title: "Implementation Plan: D5-R3 — DESIGN_DISPATCH_MANIFEST v1 schema + Gate-3 present-or-ASK pass-through"
description: "Define DESIGN_DISPATCH_MANIFEST v1 in sk-design/shared/context_loading_contract.md and append a present-or-ASK manifest pass-through to the 3 cli-* SKILLs, modeled on the Gate-3 spec-folder rule, under live GLM concurrency on cli-opencode."
trigger_phrases:
  - "d5-r3 design dispatch manifest plan"
  - "design dispatch manifest schema"
  - "present-or-ask manifest pass-through"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/003-design-dispatch-manifest"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all DoD and phase items complete with evidence"
    next_safe_action: "Regenerate description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/context_loading_contract.md"
      - ".opencode/skills/cli-codex/SKILL.md"
      - ".opencode/skills/cli-claude-code/SKILL.md"
      - ".opencode/skills/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "d5-r3-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: D5-R3 — DESIGN_DISPATCH_MANIFEST v1 schema + Gate-3 present-or-ASK pass-through

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Artifact type** | Markdown contract section + cli-* ALWAYS-rule insertion (no code, no DB, no build step) |
| **Schema home** | `.opencode/skills/sk-design/shared/context_loading_contract.md` (new section, additive) |
| **Pass-through targets** | `cli-opencode/SKILL.md`, `cli-codex/SKILL.md`, `cli-claude-code/SKILL.md` (append-only ALWAYS rule) |
| **Read-only references (cited, never edited)** | `design_proof_token.md` (loadedFiles convention), `cli_child_pairing.md` (return-path digest reconcile), `mode-registry.json` (mode validity) |
| **Mutation class** | Additive section in one shared contract + append-only insertion of ONE ALWAYS rule per cli-* + minimal trailing renumber |
| **Concurrency** | A separate GLM workstream is actively editing `cli-opencode` (and possibly siblings) |

### Overview
Define a `DESIGN_DISPATCH_MANIFEST v1` — the structured block a parent emits when dispatching design or UI work to a child CLI. The manifest names exactly what design **context, standards, and proof** the child must load and carry, so the child stops reconstructing context by guesswork. It builds on the two landed D5 pieces: the `Design Standards Loading` ALWAYS rule (the keyword-independent safety net that tells a child to load `sk-design` and resolve a mode) and the return-path transport-result contract (whose `designManifestDigest` already anticipates a parent dispatch manifest). The schema lives in `context_loading_contract.md` beside the existing CONTEXT MANIFEST vocabulary it extends; a present-or-ASK pass-through — the design twin of the proven Gate-3 spec-folder rule — is appended to each of the three cli-* SKILLs so a dispatch missing the manifest triggers an ASK instead of a silent launch.

The cli-* change is append-only and must NOT reflow, reformat, or touch any other section. A separate workstream is concurrently editing `cli-opencode`, so merge/clobber avoidance dominated the rollback plan: the implementer staged ONLY the exact rule-insertion hunk per file and treated a dirty/shifted target as a HALT. This packet is now BUILT and VERIFIED: the schema section and the three present-or-ASK rules are landed, the GLM WIP in `cli-opencode` is intact (13 → 27 lines, pure addition), and the only residual is the orchestrator-regenerated metadata.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The schema home is located and read: `context_loading_contract.md` §3 CONTEXT MANIFEST + §1 register-first gate + §4 register/dials already own the manifest vocabulary the new section reuses.
- [x] The present-or-ASK model is located: the Gate-3 spec-folder pass-through ALWAYS rule exists in all three cli-* and is the shape to clone.
- [x] The landed D5 spine is read: the `Design Standards Loading` ALWAYS rule (twin of code-standards) is present in all three cli-*, and the return-path contract already declares a parent-dispatch-manifest digest field.
- [x] Concurrency state captured: `cli-opencode/SKILL.md` is under live GLM edits; the other two are clean.
- [x] Manifest field set + validity rules drafted (evergreen, no spec/packet/phase IDs, no spec paths).

### Definition of Done
- [x] `context_loading_contract.md` defines `DESIGN_DISPATCH_MANIFEST v1` with all required fields: `surface`, `taskType`, `skDesignLoaded`, registry-valid `workflowModes`, resolved `register`, `dials`, `loadedFiles`, `proofDemandBack`. — §7 field table (lines 160-189), 9 fields present
- [x] The validity rules are stated: `workflowModes` registry-valid + non-empty, `register` resolved (never `unknown`), `skDesignLoaded` true, `loadedFiles` non-empty. — validity-rules list (lines 178-185); `unknown` not dispatchable
- [x] All three cli-* SKILLs carry a present-or-ASK manifest pass-through ALWAYS rule modeled on the spec-folder rule: inline the manifest, else ASK before launch. — `grep -c "DESIGN_DISPATCH_MANIFEST"` = 1 each (cli-codex 361, cli-claude-code 356, cli-opencode item 14)
- [x] The manifest is reconciled with the two landed D5 pieces: it carries the `Design Standards Loading` resolution, and its digest is the one the return-path contract reconciles. — carries skDesignLoaded/modes/register/dials/loadedFiles; digest = return-path `designManifestDigest` (line 187)
- [x] The residual is named: an unmodifiable child CLI that ignores the inlined manifest is covered only by the parent-side floor. — residual paragraph (line 189) states the parent-side floor only
- [x] Evergreen: the deliverable section + the inserted rule carry no spec path, packet, phase, ADR, REQ, task, or finding ID. — evergreen grep over the deliverable returned nothing
- [x] Append-only held: each cli-* diff is exactly the inserted rule + the declared trailing renumber; the GLM workstream's edits are not clobbered. — 3 glm/zai markers intact in cli-opencode; GLM diff 13 → 27 lines, pure addition

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Structured carry plus present-or-ASK pass-through. The manifest is the digestable, dispatch-survivable form of the CONTEXT MANIFEST vocabulary already defined in `context_loading_contract.md`; the cli-* rule clones the present-or-ASK shape of the Gate-3 spec-folder pass-through (present + pre-approved, or ASK), substituting the manifest for the spec folder.

### Lowest-duplication home decision
The schema's home is `context_loading_contract.md` (the source-of-truth target), and that is genuinely the lowest-duplication home, not a coincidence:

| Candidate home | Verdict | Why |
|----------------|---------|-----|
| `sk-design/shared/context_loading_contract.md` | **CHOSEN** | §3 already owns SURFACE / TASK TYPE / REGISTER SOURCE / DIAL SOURCE / MODE BUNDLE LOADED; §1 owns the register-first gate; §4 owns register/dials/proof fields. The manifest is the structured form of that exact vocabulary — defining it here reuses the definitions rather than cloning them. |
| The return-path pairing contract | Rejected | That file owns the return-path transport-result schema. Putting the request-path manifest there splits it from its source vocabulary and would re-clone register/dials/loadedFiles. |
| A new mcp-open-design / sk-design reference file | Rejected | A new file would duplicate the §3 CONTEXT MANIFEST vocabulary it depends on. |

**Read-only references (cited by skill-relative path, never edited this phase):** the proof-token contract (for the `loadedFiles` `{path, sha256}` convention and the freshness/replay binding behind `proofDemandBack`); the return-path pairing contract (whose `designManifestDigest` is the digest of THIS manifest); `mode-registry.json` (the source of `workflowModes` validity).

### Exact content to add to `context_loading_contract.md` (new section after the final section)

```text
## DESIGN DISPATCH MANIFEST

`DESIGN_DISPATCH_MANIFEST v1` is the structured carry a parent emits when dispatching design or UI work to a child. The CONTEXT MANIFEST names loaded files for the parent's own decision; the dispatch manifest makes that same resolution survive the dispatch boundary as a digestable block the child receives inline.

| Field | Type | Required | Meaning |
|---|---:|---:|---|
| `version` | integer | yes | Contract version; `1` for v1. |
| `surface` | string | yes | The surface the design work targets: route, page, frame, file, or artifact. |
| `taskType` | string | yes | One of advice, build, redesign, generation, audit, dispatch (the CONTEXT MANIFEST task-type set). |
| `skDesignLoaded` | boolean | yes | Whether the hub was loaded before the manifest was resolved. Must be `true` to dispatch design work. |
| `workflowModes` | string array | yes | Non-empty list of registry-valid modes (interface / foundations / motion / audit / md-generator), validated against `mode-registry.json`. |
| `register` | string | yes | `Brand` or `Product`. Must be a resolved value; `unknown` is rejected at dispatch. |
| `dials` | object | yes | `VARIANCE`, `MOTION`, `DENSITY` (the Register And Dials shape). |
| `loadedFiles` | array | yes | Non-empty `{path, sha256}` entries for the design-context files the child must carry, using the proof-token loadedFiles convention by reference. |
| `proofDemandBack` | object | yes | The proof the parent demands back: a proof-of-application card, and — when Open Design is used — a transport result whose dispatch-manifest digest recomputes to this manifest. |

Validity rules: `skDesignLoaded` true; `register` resolved (never `unknown`); `workflowModes` non-empty and every mode registry-valid; `loadedFiles` non-empty. A manifest that fails any rule is not dispatchable — the parent ASKs instead of launching.

The manifest travels INLINE in the dispatch payload, never as a path the child resolves. It is the request-path companion to the return-path transport result: the parent recomputes the manifest digest from what it emitted and reconciles it against what the child returns.
```

### Exact cli-* ALWAYS rule text (insert verbatim in all three files; only the leading list number differs)

```text
**Pass the design dispatch manifest to the dispatched session** — when dispatching design or UI work, inline a `DESIGN_DISPATCH_MANIFEST v1` block in the prompt (the child cannot resolve skill paths, so the manifest travels in the payload, not by reference): `skDesignLoaded` true, `register` resolved to Brand or Product (never `unknown`), registry-valid `workflowModes`, `dials`, `loadedFiles`, and `proofDemandBack`. If the manifest cannot be assembled — sk-design not loaded, register unresolved, or no registry-valid mode — ASK before launching the child rather than starting a silent design dispatch. The child returns the demanded proof; the parent reconciles it on the return path.
```

### Append-only insertion contract (per cli-* file)
Locate the anchor by CONTENT — the unique string `Design Standards Loading (surface-aware contract)` — never by trusting a line number; the GLM workstream may have shifted `cli-opencode` lines. Insert the new manifest rule on the line IMMEDIATELY AFTER the `Design Standards Loading` rule and BEFORE the next existing ALWAYS item; renumber trailing items by their single leading digit only.

| File | Insert after (content anchor) | Renumber |
|------|-------------------------------|----------|
| `cli-claude-code/SKILL.md` | the `Design Standards Loading (surface-aware contract)` rule | trailing items shift by one digit each |
| `cli-codex/SKILL.md` | the `Design Standards Loading (surface-aware contract)` rule | trailing items shift by one digit each |
| `cli-opencode/SKILL.md` | the `Design Standards Loading (surface-aware contract)` rule (DIRTY — GLM WIP; handle last, see §7) | trailing items shift by one digit each |

The `Code Standards Loading` number is unaffected (the manifest rule inserts after `Design Standards Loading`, which is itself after code-standards), so the `cli-opencode` cross-reference to the code-standards rule stays valid. Confirm no other `ALWAYS rule N` cross-reference breaks before committing.

### What NOT to touch (HARD scope freeze)
- Do NOT reflow, rewrap, reindent, or reformat any file.
- Do NOT edit frontmatter, the H1, section headers, the NEVER / ESCALATE blocks, References, or any other section.
- Do NOT change the wording of any existing ALWAYS item — the only permitted change to existing items is the single leading integer of items following the insertion point.
- Do NOT redefine the proof-token, return-path, or mode-registry contracts; reference them.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Ground and fix boundaries
- [x] Re-read `context_loading_contract.md` §1/§3/§4; confirm the new section reuses (not re-clones) the SURFACE / TASK TYPE / register / dials vocabulary. — §7 reuses §3 task-type set + Register And Dials shape
- [x] Re-read the Gate-3 spec-folder pass-through rule in each cli-* (the present-or-ASK model) and the landed `Design Standards Loading` rule (the insertion anchor). — anchor `Design Standards Loading (surface-aware contract)` matched in all 3 cli-*
- [x] Re-read the return-path contract's `designManifestDigest` field and the proof-token `loadedFiles` convention to fix the reconciliation + citation boundary. — both cited in §7, not redefined
- [x] Capture cli-opencode concurrency state (`git status`); classify each target clean or dirty. — cli-opencode DIRTY (GLM WIP); cli-codex / cli-claude-code clean

### Phase 2: Author schema + pass-through
- [x] Add the `DESIGN DISPATCH MANIFEST` section to `context_loading_contract.md` (field table + validity rules + inline-payload + digest-reconcile note), additive after the final existing section. — `## 7. DESIGN DISPATCH MANIFEST` appended (lines 160-189)
- [x] Insert the present-or-ASK manifest rule into `cli-claude-code/SKILL.md` (clean) after the `Design Standards Loading` anchor; renumber trailing items. — item 11 (line 356); trailing items renumbered
- [x] Insert the same rule into `cli-codex/SKILL.md` (clean); renumber trailing items. — item 13 (line 361); trailing items renumbered
- [x] Insert the same rule into `cli-opencode/SKILL.md` (DIRTY — re-confirm anchor by content; do NOT bulk-stage; isolate the design hunk from GLM WIP). — item 14 stacked on GLM WIP; 3 glm/zai markers intact (13 → 27 lines)

### Phase 3: Verification
- [x] Confirm all required manifest fields + validity rules are present and the block name `DESIGN_DISPATCH_MANIFEST` is a stable, lint-findable token. — 9 fields + 6 validity rules; block name grep-findable
- [x] Confirm the present-or-ASK rule is present in all three cli-* and that an absent manifest maps to ASK, not a silent launch. — `grep -c` = 1 each; explicit ASK branch in each rule
- [x] Confirm reconciliation: the manifest carries the `Design Standards Loading` resolution, and its digest is the one the return-path contract reconciles. — carries the load-time resolution; digest = return-path `designManifestDigest`
- [x] Confirm the residual is named and not overstated. — residual paragraph names the parent-side floor; no deterministic guarantee claimed over an unmodifiable child
- [x] Evergreen scan over the deliverable section + the inserted rule (no spec/packet/phase/ADR/REQ/task/finding ID, no spec path). — evergreen grep returned nothing
- [x] `git diff` per cli-* shows exactly the inserted rule + the declared renumber; GLM hunks untouched. — cli-codex / cli-claude-code: one added rule + renumber; cli-opencode: rule stacked, GLM WIP untouched

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Check | Scope | Command / method |
|-------|-------|------------------|
| Schema completeness | All required fields + validity rules present | Manual read of the new section against the field list |
| Lint-findable block | The block name + required field names are stable tokens | `grep -n "DESIGN_DISPATCH_MANIFEST"` finds the section; field names enumerable |
| Pass-through presence | All 3 cli-* carry the manifest rule | `grep -c "DESIGN_DISPATCH_MANIFEST"` returns `>= 1` per cli-* file |
| Present-or-ASK shape | Missing manifest → ASK, not silent launch | Read the rule wording: explicit ASK branch present |
| Reconciliation | Carries Design Standards Loading; digest reconciled on return | Walkthrough against the landed D5 pieces |
| Byte-unchanged (cli-*) | Only the insertion + renumber changed | `git diff <file>` hunk inspection: one added block + N single-char number edits |
| Evergreen | No ephemeral IDs / spec paths | `grep -nE "specs/|packet|phase[ -]|ADR-|REQ-|finding"` over the deliverable returns nothing |
| No clobber | GLM WIP intact in cli-opencode | the manifest hunk is the only net-new change attributable to this task |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `context_loading_contract.md` §3/§4 vocabulary | Internal (extended) | Green — exists | Cannot reuse the manifest vocabulary; would have to re-clone it |
| Gate-3 spec-folder pass-through rule (3 cli-*) | Internal (model) | Green — exists | No present-or-ASK shape to clone |
| `Design Standards Loading` ALWAYS rule (3 cli-*) | Internal (insertion anchor + reconcile) | Green — landed | Anchor moved/reformatted → HALT, re-locate by content |
| Return-path pairing contract (`designManifestDigest`) | Internal (cited) | Green — exists | Cannot reconcile the manifest digest on the return path |
| `design_proof_token.md` (`loadedFiles` convention) | Internal (cited) | Green — exists | Cannot reference the loadedFiles + freshness convention |
| `mode-registry.json` (workflowModes validity) | Internal (cited) | Green — exists | Cannot define registry-valid modes |
| `cli-opencode/SKILL.md` insertion anchor | Internal | **DIRTY — GLM WIP in working tree** | Mixed unstaged hunks; cannot cleanly partial-stage → see §7 |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A cli-* byte-diff shows an unintended change, the GLM workstream's edits would be staged/clobbered, the `Design Standards Loading` anchor cannot be matched by content, or the manifest section conflicts with the cited contracts.
- **Procedure**: `git checkout -- <file>` to discard a clean-file insertion, or `git restore --staged <file>` then re-edit if a wrong hunk was staged. The `context_loading_contract.md` section is additive and removable as a single block. Each cli-* change is a single self-contained hunk and independently reversible.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Ground + boundaries) ──> Phase 2 (Author schema, then insert clean cli-*, then dirty cli-*) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Ground + boundaries | None | Author |
| Author schema | Ground | cli-* inserts |
| Insert clean (claude-code, codex) | Schema + concurrency state | Verify |
| Insert dirty (opencode) | Schema + concurrency decision | Verify |
| Verify | All inserts | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Ground + fix boundaries | Low | 20 minutes |
| Author schema section | Medium | 45 minutes |
| Insert clean cli-* (claude-code, codex) | Low | 15 minutes |
| Insert dirty cli-* (opencode, isolation) | Medium (concurrency) | 15 minutes |
| Verification (grep + byte-diff + evergreen) | Low | 20 minutes |
| **Total** | | **~2 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Concurrency HALT conditions (any one → STOP and report)
1. The unique anchor `Design Standards Loading (surface-aware contract)` is missing, duplicated, or reworded in a target → the GLM workstream may have reformatted it. HALT; do not force the insertion.
2. `cli-opencode/SKILL.md` still carries unstaged GLM changes at staging time and interactive partial-add is unavailable → do NOT run `git add <file>` (it would stage the GLM WIP too). Leave the manifest hunk unstaged, report, and coordinate (let GLM commit first, then apply on a clean tree, or stage via an explicitly verified path).
3. A `git diff` of any target shows a hunk this task did not author → STOP; another workstream is mid-edit.
4. The target's line numbers no longer match this plan AND content-anchor re-location also fails → HALT (the file changed structurally).

### Staging discipline
- Stage clean files (`cli-codex`, `cli-claude-code`) individually only after `git diff` confirms the hunk is exactly the insertion + declared renumber.
- NEVER `git add .` or `git add` a directory; stage each verified file by explicit path.
- For the dirty `cli-opencode`, make the edit but isolate staging per HALT condition 2.

### Named residual (honest enforcement ceiling)
An unmodifiable child CLI may ignore the inlined manifest entirely — the parent cannot force it to load the named files or honor the resolved register. The enforceable floor is parent-side only: the present-or-ASK gate at dispatch (manifest present + valid, else ASK; lint-findable block + required fields) and the return-path demand-back re-validation of what the child returns. Path-resolvability ceiling: codex/claude-code children cannot resolve skill paths, so the manifest MUST be inlined; even inlined, a fully unmodifiable child that drops it is covered only by the parent demand-back floor.

### Data Reversal
- **Has data migrations?** No. One additive contract section + three single-hunk cli-* insertions; reversal is `git checkout -- <file>` per file.

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~190 lines)
- Core + Level 2 addendum (phase deps, effort, enhanced rollback)
- Deliverable: one additive schema section + three append-only cli-* ALWAYS-rule insertions
- Concurrency HALT conditions + the named residual dominate the enhanced rollback
-->
