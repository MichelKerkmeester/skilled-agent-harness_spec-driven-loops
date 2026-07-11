# 1. RULE 1 PROPOSAL

## 1.1 File + Section + Exact Wording

The preference should be established in the phase-system source of truth, propagated into Gate 3, and reflected in the operational quick references. The same Gate 3 wording should be applied to both root `CLAUDE.md` and `AGENTS.md`; both currently contain the complete Gate 3 contract, despite the briefing stating that only root `CLAUDE.md` does. Constitutional `gate-enforcement.md` identifies `AGENTS.md §2` as canonical (`gate-enforcement.md:55-70`).

### `.opencode/skills/system-spec-kit/references/structure/phase_definitions.md`

In `§1 OVERVIEW → When Phases Apply`, replace the last sentence:

```diff
- The phase system is most commonly used with Level 3 and Level 3+ specifications, though any level can technically use phases.
+ The phase decomposition workflow is offered only when both qualification thresholds in §2 are met. Child phases inside an already-established phase parent may use the documentation level appropriate to that child's work.
```

After `§2 PHASE DETECTION → Detection Thresholds`, immediately after “If only one condition is met, the specification proceeds as a standard (non-phased) spec folder,” insert:

```markdown
### Phased-Packet Preference

**Governance rule:** "AI's should always prefer multi-phased specs over separate single spec folders, unless the task is small or new from current work."

This is a routing preference, not an override of phase qualification:

- When related work has a phase complexity score >= 25 AND documentation level >= 3, the AI MUST recommend one coordinated phased packet instead of separate top-level single-spec folders.
- When only one or neither threshold is met, the work MUST remain a standard non-phased spec. Related standard work should reuse or update an existing packet when its scope fits.
- New or unrelated work may start a new top-level packet. The new packet must still be evaluated independently: create it as a phased packet when both thresholds are met, otherwise create it as a standard packet.
- A small task does not justify creating a new sibling packet when it fits an active existing packet. Continue in the applicable existing packet or phase child instead.
```

This preserves the existing independent threshold contract at `phase_definitions.md:55-64` and `phase_system.md:27-35`.

### `.opencode/skills/system-spec-kit/SKILL.md`

In `§4 RULES → ALWAYS`, replace rules 5 and 16:

```diff
- 5. **Check for related specs before creating new folders** - Search keywords, review status
+ 5. **Prefer coordinated related packets before new top-level folders** - Check active and related specs, their scope, status, and Phase Documentation Map. When related work qualifies for phase decomposition, recommend one phased packet rather than separate single-spec folders.

- 16. **Suggest /speckit:plan :with-phases when task requires multi-phase decomposition** - Complex specs spanning multiple sessions or workstreams
+ 16. **Apply the phased-packet preference without bypassing qualification** - Suggest `/speckit:plan :with-phases` only when phase complexity score >= 25 AND documentation level >= 3. If either condition fails, use a standard packet; if the work is new or unrelated, create a separate packet and evaluate that packet independently.
```

### Root `CLAUDE.md` and root `AGENTS.md`

In each file, replace the current one-line `GATE 3` options entry:

```diff
- - **Options:** A) Existing | B) New | C) Update related | D) Skip | E) Phase folder (e.g., `specs/NNN-name/001-phase/`)
+ - **Options (stable labels):**
+   - **A) Existing** - Continue in the detected/current spec or its current phase child when the requested work fits that scope.
+   - **B) New** - Create a new top-level packet only when the work is new or unrelated to suitable existing packets. Evaluate the new packet independently for standard versus phased structure.
+   - **C) Update related** - Use another related existing spec when the current packet is not the best scope match.
+   - **D) Skip** - Explicitly skip documentation after the required warning or when an existing exemption applies. Never make this the default.
+   - **E) Extend phased packet** - Add or target a specific child under an existing phase parent, or decompose a related standard packet that now meets both phase-qualification thresholds.
+ - **Recommendation order:** Keep the A-E labels stable, but recommend `E` first for a distinct related workstream in an existing or qualifying phased packet; recommend `A` when the current packet or child already fits; recommend `C` when another related packet fits better; recommend `B` only for new/unrelated work; never recommend `D` by default. The user still makes the final selection.
+ - **Phase-qualification guard:** Creating a new phased packet or converting a standard packet into a phase parent requires BOTH phase complexity score >= 25/50 AND documentation level >= 3. If only one or neither condition is met, use a standard non-phased packet.
+ - **Routing definitions:** “Small” means exempt work or work that remains Level 1 after applying LOC guidance and all risk/complexity overrides. “New/unrelated” means outside the active packet's documented purpose, scope, requirements, and Phase Documentation Map, using the update-versus-create criteria in `references/workflows/quick_reference.md` §8.
```

This changes the recommendation/default, not the user-choice invariant. The existing `system-spec-kit/SKILL.md:458-460,483-485` still requires asking rather than autonomously selecting.

### `.opencode/skills/system-spec-kit/references/workflows/quick_reference.md`

Replace `§8 UPDATE VS CREATE DECISION` with:

```markdown
## 8. UPDATE, PHASE, OR CREATE DECISION

### CONTINUE or UPDATE Existing Work When:

✅ Iterative development of the same feature  
✅ Bug fixes to the existing implementation  
✅ Scope escalation within the same outcome  
✅ Enhancement of existing functionality  
✅ Resuming paused work  
✅ The request fits the active packet's purpose, scope, requirements, or Phase Documentation Map

### PREFER A PHASED PACKET When:

✅ The work is related to one coordinated outcome  
✅ Phase complexity score >= 25 AND documentation level >= 3  
✅ The work contains distinct workstreams that would otherwise become separate top-level single-spec folders

The phased-packet preference does not override qualification. If only one or neither threshold is met, continue or update a standard non-phased packet.

### CREATE New Top-Level Work When:

❌ Distinct feature with a separate outcome  
❌ Different requirement or separate user story outside the current scope  
❌ Alternative strategy that must remain independently governed  
❌ Complete redesign that supersedes rather than extends the current packet  
❌ Unrelated work with no requirement, implementation, or dependency continuity

New/unrelated work is allowed to use Option B, but the new packet must still be evaluated independently. If it meets both phase thresholds, create a new phased packet; otherwise create a standard packet.

**Small-task definition:** “Small” means exempt work or work that remains Level 1 after LOC guidance and all secondary risk/complexity factors are applied. A Level 2 or Level 3 task that does not phase-qualify is not automatically “small”; it remains standard because the phase thresholds were not both met.
```

Replace `§9 CONFIRMATION OPTIONS` with the same final A-E behavior:

```markdown
## 9. CONFIRMATION OPTIONS

When Gate 3 applies, always present all five stable labels and ask the user to choose:

**Option A:** Continue in the detected/current spec or current phase child when its scope fits.  
**Option B:** Create a new top-level packet for new/unrelated work; independently evaluate whether that new packet qualifies for phases.  
**Option C:** Update another related existing spec when it is a better scope match.  
**Option D:** Skip spec documentation after the required warning or under an existing exemption.  
**Option E:** Extend a phased packet by adding or targeting a specific child, or decompose a related standard packet that meets both phase thresholds.

**Recommendation priority:** `E` for a distinct related workstream in an existing or qualifying phased packet; otherwise `A` when the current packet fits; otherwise `C` for another related packet; `B` only for new/unrelated work; `D` is never the default.

**AI Agent Rule:** Recommend the best-fit option using this priority, but NEVER select it autonomously. The user must choose A/B/C/D/E.
```

### `.opencode/skills/system-spec-kit/references/structure/folder_routing.md`

In `§9 BYPASS OPTIONS → Session Preferences`, replace the conflicting `"new folder"` row:

```diff
-| `"new folder"` | Always create new spec folder            |
+| `"new folder"` | Treat as an explicit Option B request for the current task. Still evaluate the new packet for standard versus phased structure; do not treat the phrase as standing permission to move related work out of an active phased packet. |
```

### `.opencode/skills/system-spec-kit/references/structure/sub_folder_versioning.md`

In `§1 OVERVIEW → When to Use`, remove the existing invitation to mix unrelated work into one parent:

```diff
- - Separating unrelated tasks within a parent spec folder
+ - Separating distinct but related iterations within the parent spec's documented scope; genuinely unrelated work belongs in a separate top-level packet
```

## 1.2 Interaction With Existing Thresholds

**When both thresholds are met:** For related work, the AI recommends a coordinated phased packet instead of separate single-spec siblings. For new/unrelated work, Option B remains appropriate, but the new packet itself should be phased because it independently qualifies.

**When only one or neither threshold is met:** The preference does not create a phase parent. The task remains a standard non-phased packet, exactly as required by `phase_system.md:29-35` and `phase_definitions.md:57-64`. Related work routes through A or C; new/unrelated work routes through B.

**Concrete definition of “small”:**

| Classification | Checkable definition | Routing effect |
|---|---|---|
| Exempt/trivial | Fewer than five changed characters in one file, or whitespace-only work | No spec is required under the existing exemption. |
| Small | Remains Level 1 after applying `<100 LOC` soft guidance and checking risk, dependencies, architecture, and testing needs | Standard non-phased handling; prefer A/C over a needless sibling B when related. |
| Not small but non-qualifying | Level 2+, or otherwise substantial, but does not satisfy both phase thresholds | Standard non-phased handling because qualification failed, not because the work is small. |

This distinction is necessary because the repository does not have a “Level 1 exempt tier.” Exempt work and Level 1 work are separate categories (`level_decision_matrix.md:62-80,109-120`; `quick_reference.md:364-368`).

**Concrete definition of “new/unrelated to current work”:** Apply the existing `quick_reference.md §8` criteria against the active packet's `spec.md` purpose/scope, requirements, and Phase Documentation Map. Iterative development, bug fixes, scope escalation, enhancements, and resumed work are related. A distinct feature, different requirement, separate user story, independent alternative strategy, complete redesign, or work with no connection is new/unrelated (`quick_reference.md:230-251`). For a phase parent, the active context is resolved through `derived.last_active_child_id` or child statuses (`quick_reference.md:475-486`; root `CLAUDE.md:211-213`).

## 1.3 Conflicts / Overlaps With Existing Docs

- **Direct conflict:** `folder_routing.md §9` maps the literal phrase `"new folder"` to “Always create new spec folder” (`folder_routing.md:344-353`). That bypasses related-work and phased-packet evaluation.
- **Direct conflict:** `sub_folder_versioning.md` currently lists “Separating unrelated tasks within a parent spec folder” as a use case (`sub_folder_versioning.md:30-35`). That is too aggressive for either phase parents or versioned parents.
- **Threshold ambiguity:** `phase_definitions.md:31` says any level can technically use phases, while `phase_definitions.md:57-64` and `phase_system.md:29-35` require both thresholds. The proposed wording distinguishes qualification of a parent from documentation levels used by its children.
- **Partial coverage:** `system-spec-kit/SKILL.md` already requires checking related specs and suggesting phase decomposition (`SKILL.md:455-470`), but it does not make phased coordination the preferred topology.
- **Partial coverage:** `quick_reference.md §8` already prefers updates for iterative development and new specs for unrelated work (`quick_reference.md:230-251`).
- **Partial coverage:** `quick_reference.md §9` already offers E, but only says it is shown for high complexity or existing phased content and does not identify it as the preferred recommendation (`quick_reference.md:255-265`).
- **Partial coverage:** Root `CLAUDE.md` and `AGENTS.md` already say to verify that proposed top-level work is not a child of an existing packet and to nest it when scoped (`CLAUDE.md:232-237`; `AGENTS.md:232-237`).
- **Partial coverage:** `folder_routing.md` prefers a specific child path over a phase-parent root for continuity saves (`folder_routing.md:251-258`), but that governs save targeting, not Gate 3 topology.
- **No relevant routing rule:** `spec-folder-naming.md` governs naming and sequential child numbering, not whether to create a child or sibling (`spec-folder-naming.md:20-31`).
- **Cross-runtime finding:** `.claude/CLAUDE.md` contains only tool-routing and logic-sync rules; it has no Gate 3 text (`.claude/CLAUDE.md:1-9`). Root `CLAUDE.md` and `AGENTS.md`, however, both contain the full Gate 3 section.

## 1.4 Risks / Guardrails

The main risk is treating any open phase parent as a permanent catch-all and folding unrelated work into it. That would dilute the parent's root purpose, produce misleading Phase Documentation Maps, and conflict with scope-lock governance.

The proposed guardrails prevent this by requiring:

- A scope comparison against the parent `spec.md`, requirements, and Phase Documentation Map before recommending E.
- Existing update-versus-create criteria rather than a new scoring axis.
- B for genuinely new/unrelated work.
- Both qualification thresholds before converting a standard packet or creating a new phased packet.
- A/C rather than E when non-qualifying related work belongs in a standard packet.
- Explicit user selection after the AI makes its recommendation.

# 2. RULE 2 PROPOSAL

## 2.1 File + Section + Exact Wording

### `.opencode/skills/system-spec-kit/references/structure/phase_definitions.md`

After `§4 PHASE LIFECYCLE → Phase Status Values`, insert:

```markdown
### Extending an Existing Phase Parent

**Governance rule:** "Also when they are working inside a phased spec they should prefer adding new phases to that instead of create a new separate spec folder."

When the current work is already inside a phase parent:

1. Use Option A when the requested work fits the current active, draft, or paused child phase.
2. Prefer Option E when the work is a distinct but related workstream within the parent's documented purpose and scope. Add the next sequential child phase and update the Phase Documentation Map.
3. Use Option C when another related existing packet is a better scope match.
4. Use Option B only when the work is new or unrelated to the phase parent's purpose, requirements, and Phase Documentation Map.
5. Option D remains an explicit documentation opt-out and is never the default.

The phase-qualification thresholds govern whether a standard packet may become a phase parent. An already-established phase parent does not need to requalify for every later child, but every new child must remain inside the parent's documented scope and use the documentation level appropriate to that child. A standard non-phased packet may not gain phase children unless both qualification thresholds are met.
```

### `.opencode/skills/system-spec-kit/references/workflows/quick_reference.md`

Replace the existing `**Phased Packets**` paragraph in `§8`:

```diff
- **Phased Packets**: If the target spec already has child phase folders,
- resume/update in the active child phase - not the coordination root.
- Use the root only for coordination snapshots, phase-map updates,
- and tree-truth verification.
+ **Phased Packets:** If the target already has child phase folders, use the active child when the work fits that child's scope. For a distinct but related workstream, prefer Option E and add the next sequential child phase instead of creating a new top-level sibling packet. Use the coordination root only for phase-map updates, root-scope decisions, and tree-truth verification. Use Option B only when the work is outside the phase parent's documented purpose and scope.
```

### `.opencode/skills/system-spec-kit/references/workflows/spec_folder_authoring_checklist.md`

In `§2 PRE-CHECKS`, insert:

```markdown
- [ ] Before creating a new top-level packet, check whether the current work is inside a phase parent.
- [ ] If it is, compare the request with the parent `spec.md` purpose, scope, requirements, and Phase Documentation Map.
- [ ] Continue in the current child when its scope fits; otherwise prefer a new child phase for a distinct related workstream. Create a separate top-level packet only for new/unrelated work.
- [ ] Do not convert a standard packet into a phase parent unless phase complexity score >= 25 AND documentation level >= 3.
```

### Root `CLAUDE.md` and root `AGENTS.md`

The Gate 3 replacement supplied in §1.1 is a shared edit that implements both rules and should be applied once. The Rule 2-specific controlling sentence is:

```markdown
- **Recommendation order:** Keep the A-E labels stable, but recommend `E` first for a distinct related workstream in an existing or qualifying phased packet; recommend `A` when the current packet or child already fits; recommend `C` when another related packet fits better; recommend `B` only for new/unrelated work; never recommend `D` by default. The user still makes the final selection.
```

All five options are intentionally addressed:

| Option | Rule 2 behavior |
|---|---|
| A | Continue in the active/current child if its scope fits. |
| B | New top-level packet only for work outside the phase-parent scope. |
| C | Another related packet when it is a better fit than the active parent. |
| D | Explicit opt-out only; never default. |
| E | Recommended for a distinct related workstream requiring a new child phase. |

## 2.2 Interaction With Existing Thresholds

**If the related work is complex enough to phase-qualify:** In an existing phased packet, use A if the current child fits or E for a distinct related workstream. In a standard packet, E may be recommended only after both thresholds are met and the user approves decomposition.

**If the related work does not independently phase-qualify:** Two cases must be distinguished.

- If the parent is already a valid phase parent, the thresholds have already governed its topology. Small work should normally stay in the fitting current child through A. A distinct related workstream may use E without converting a new standard packet into a phase parent.
- If the packet is currently standard/non-phased, the AI must not add phase children. Use A or C for related work, or B for new/unrelated work.

**If the work is new/unrelated:** Use B regardless of the current parent being open. Then evaluate the new packet independently: both thresholds produce a new phased packet; otherwise it remains standard.

Under Rule 2, the Rule 1 “small” exception does not justify a separate sibling packet when small work fits the active child. It means the AI should avoid unnecessary decomposition: use A rather than E or B. Only a distinct related workstream should receive a new child phase.

## 2.3 Conflicts / Overlaps With Existing Docs

- **Partial coverage:** `quick_reference.md §8` already says phased work should resume in the active child rather than the coordination root (`quick_reference.md:248-251`), but it does not say what to do when a new related workstream appears.
- **Partial coverage:** `quick_reference.md §16` already exposes `create.sh --phase --parent ...` for adding child phases to an existing parent (`quick_reference.md:507-517`). The mechanism exists; the routing preference does not.
- **Partial coverage:** `phase_definitions.md` describes parent maps, child back-references, and phase lifecycle (`phase_definitions.md:114-174`) but does not govern later A-versus-B-versus-E choices.
- **Partial coverage:** `sub_folder_versioning.md` says Option A may create numbered subfolders and distinguishes temporal versions from spatial phases (`sub_folder_versioning.md:62-94,174-190`). Agents need the proposed scope rule to avoid using versioning as a loophole for unrelated work.
- **Partial coverage:** `folder_routing.md` recommends explicit child paths for phased continuity saves (`folder_routing.md:251-258`), but does not govern creation of new child phases.
- **Partial coverage:** `spec_folder_authoring_checklist.md` applies when creating a phase child (`spec_folder_authoring_checklist.md:24-29`) but currently has no pre-check requiring preference over a sibling top-level packet.
- **Existing support:** `spec-folder-naming.md` already requires child numbering to be sequential within the parent (`spec-folder-naming.md:24-31`).
- **No contradiction in Claude supplement:** `.claude/CLAUDE.md` has no Gate 3 or phase-routing policy, so no edit is required there if Claude instances also consume the repository-level universal governance.

## 2.4 Risks / Guardrails

The aggressive-application risk is phase-parent scope creep: a parent may remain active for months, causing agents to place every later task beneath it solely because it is open.

The proposed heuristic guards against this by requiring a positive relationship to the parent's documented purpose, scope, requirements, or Phase Documentation Map. “Currently open” is not sufficient. A fitting current child routes to A; a distinct related workstream routes to E; related work owned elsewhere routes to C; work outside the parent scope routes to B. Small related fixes stay in the current child rather than creating phase fragmentation.

# 3. GATE 3 OPTION-SET CHANGES

## 3.1 Current A-E Behavior (as read)

Root `CLAUDE.md` and root `AGENTS.md` currently summarize Gate 3 as `A) Existing | B) New | C) Update related | D) Skip | E) Phase folder`, with E illustrated by a child path (`CLAUDE.md:126-138`; `AGENTS.md:126-138`). `quick_reference.md` expands A as detected-folder reuse, B as a new suggested folder, C as updating a shown related spec, D as skipping with a technical-debt warning, and E as adding a phase to an existing spec, shown only for high-complexity or already-phased content (`quick_reference.md:255-265`). No source read assigns a preferred default among A-E. The skill requires user choice and prohibits autonomous create-versus-update decisions (`SKILL.md:458-460,483-485`).

## 3.2 Recommended Change

Keep the stable A-E labels and their displayed order to reduce cross-runtime compatibility risk, but change their wording and recommendation priority to `E → A → C → B → D` when applicable. E becomes the recommended option for a distinct related workstream in an existing or newly qualifying phased packet. A remains preferred when the current packet or child already fits. C handles related work owned by another packet. B becomes the recommended option only for new/unrelated work, with independent phase qualification applied to the new packet. D remains available but is never the default. The AI recommends and explains the best-fit option but still asks the user to choose.

This synthesizes both maintainer rules without weakening the existing dual threshold or the “never decide autonomously” requirement.

# 4. OPEN QUESTIONS / ASSUMPTIONS

- **Later-child qualification:** The files clearly require both thresholds before phase decomposition, but they do not explicitly state whether an already-established phase parent must requalify every time a child is added. This proposal resolves the ambiguity by treating the thresholds as a gate on creating/converting the parent, not on every later related child.
- **Generated governance mirrors:** Root `CLAUDE.md` and `AGENTS.md` currently contain identical Gate 3 text, while `gate-enforcement.md` calls `AGENTS.md` canonical. The files read do not state whether one root file is generated from the other. The maintainer should apply the same wording to both or use the repository's existing mirror-generation process if one exists.
- **Option-rendering implementation:** The read documents identify `gate-3-classifier.ts` as authoritative for trigger classification, but they do not establish whether any runtime parser depends on the prose option descriptions. The proposal therefore preserves the A-E labels and order and changes only wording plus recommendation priority.
