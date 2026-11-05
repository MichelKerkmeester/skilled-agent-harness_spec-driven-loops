# Review Report: 021 Deprecate Fundamentals

## 1. Executive Summary

**Overall verdict: CONDITIONAL**

- `hasAdvisories: false` (the verdict is CONDITIONAL, so P2 advisories are listed separately)
- Active findings: **P0 = 0, P1 = 1, P2 = 8**
- Review scope: the worktree change set against baseline `10474a9567`, covering the retirement of
  `sk-design-fundamentals`, the move of its screen value guidance into `sk-code-frontend`, the
  chart research-citation cleanup, the compiled-routing manifests and the agent mirrors.
- Iterations: 5 of 5. Stop reason: `maxIterationsReached`.
- Operator review focus: "Change set in this worktree vs baseline 10474a9567: sk-design-fundamentals
  retired (folder removed, hub cut to three modes, routing/compiled manifests/agent/mirrors
  updated); sk-code-frontend gained web-visual-values, web-visual-hierarchy, web-motion-and-interaction
  references, tokens.css and routing intents; sk-design-chart research citations removed. Check
  correctness, lost guidance, dangling references to fundamentals, routing reach and doc accuracy."

The retirement is structurally complete: the folder is gone, the hub registers three modes with no
default, the compiled sk-design contract defers a no-signal prompt, and no live file names the
retired folder. The move is also substantially complete: the three new references carry V1-V41,
H1-H36 and M1-M57, `tokens.css` moved with its contrast annotations, and the five baseline value
prompts all reach `sk-code-frontend`.

One routing defect keeps the verdict at CONDITIONAL. The new `code-frontend-visual` vocabulary
documents "design review findings" and "review this screen" as visual-review phrases, but the
review-class keyword wins the hub route: "design review", "design review findings" and "review
this design" resolve to `sk-code-review` alone, so `web-visual-hierarchy.md` is not loaded. The
same family of prompts used to reach the retired values mode, and the replacement owner never
sees them.

Rule sources: none. Overrides: none. Refused: none. Ignored: none. Conflicts: none.

## 2. Planning Trigger

`/speckit:plan` is required because the verdict is CONDITIONAL and one P1 remains active.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": ["R1-P1-001", "R1-P2-002", "R2-P2-003", "R2-P2-004", "R3-P2-005", "R3-P2-006", "R4-P2-007", "R5-P2-008", "R5-P2-009"],
  "remediationWorkstreams": ["WS-1 visual-review routing reach", "WS-2 metadata and packet accuracy", "WS-3 lost guidance and session guidance"],
  "specSeed": [
    "Add the bare visual-review phrases to the sk-code visual vocabulary and make the hub bundle sk-code-frontend beside sk-code-review when a visual-review phrase wins.",
    "Record the eight routing prompts by text in phase 1 AC-005, or narrow the criterion to the five baseline prompts.",
    "Refresh the sk-code hub surface table and description.json for the visual references and tokens.css."
  ],
  "planSeed": [
    "Replay the exact failing phrases after the route change and add them to the sk-code canary fixture.",
    "Add web-accessibility-patterns.md to the WEB_VISUAL_HIERARCHY load set or mark the A-anchors as follow-on reads.",
    "Restore the shadow-animation technique as a V or M item.",
    "Amend M33 so the client redirect is explicitly UX-only and server-side refusal remains required."
  ],
  "findingClasses": {
    "cross-consumer": ["R1-P1-001", "R3-P2-005"],
    "instance-only": ["R1-P2-002", "R2-P2-003", "R2-P2-004", "R4-P2-007"],
    "class-of-bug": ["R3-P2-006", "R5-P2-008", "R5-P2-009"]
  },
  "affectedSurfacesSeed": [
    "sk-code hub-router and compiled canary",
    "sk-code-frontend ROUTER and review pass",
    "sk-code SKILL and description.json",
    "sk-design graph metadata",
    "phase 1 and phase 2 packet evidence"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Severity | Title | Dimension | File:line | Evidence | Impact | Fix | Finding class |
|----|----------|-------|-----------|-----------|----------|--------|-----|---------------|
| R1-P1-001 | P1 | Visual-review vocabulary never reaches the frontend surface | correctness | `.skilled/skills/sk-code/hub-router.json:90` | `compiled-route --hub sk-code` returns `single [sk-code-review]` for "design review", "design review findings" and "review this design"; "review this screen" bundles correctly | A visual-review request is handled as code review without `web-visual-hierarchy.md` | Add the bare phrases and make the visual-review decision bundle the frontend surface; replay the exact phrases | cross-consumer |
| R1-P2-002 | P2 | Graph metadata still advertises the retired values vocabulary | correctness | `.skilled/skills/sk-design/graph-metadata.json:178` | Ten fundamentals phrases remain in `derived.intent_signals`; the top-level 111-signal array is clean | A metadata consumer or future advisor path can treat sk-design as the values owner | Rebuild `derived.intent_signals` from the three surviving modes, or drop it | instance-only |
| R2-P2-003 | P2 | Phase 2 changed-file table names a file that never changed | traceability | `specs/sk-design/021-deprecate-fundamentals/002-retire-fundamentals/implementation-summary.md:75` | `git diff 10474a9567 --stat -- <path>` prints nothing; the file has no fundamentals or frontend reference | The audit trail claims a repoint that was never made | Drop the row, or make the repoint | instance-only |
| R2-P2-004 | P2 | Phase 1 routing criterion mixes five and eight prompts | traceability | `specs/sk-design/021-deprecate-fundamentals/001-frontend-upgrade/acceptance-criteria.md:62` | The Given clause says five baseline prompts; the verification cell says all eight; no prompt list exists | The routing evidence cannot be reproduced from the packet | Name the eight prompts and their output, or narrow to five | instance-only |
| R3-P2-005 | P2 | Hub canonical surface description omits the visual references | maintainability | `.skilled/skills/sk-code/SKILL.md:44` | The surface table, surface list and layout comment omit the three refs and `tokens.css`; `description.json` keeps the old wording and `lastUpdated: 2026-10-10` | A future editor can add a second values surface instead of extending the frontend packet | Update the three description sites and `description.json` | cross-consumer |
| R3-P2-006 | P2 | Shadow-animation performance rule did not move | maintainability | `.skilled/skills/sk-code/sk-code-frontend/references/web-visual-values.md:247` | The retired `depth-and-detail.md` pseudo-element opacity technique has no successor in V20-V27 or M27 | A hover-elevation request can produce a `transition: box-shadow` repaint | Add the technique as a V or M item with its duration band | class-of-bug |
| R4-P2-007 | P2 | Session-expiry exception can be read as client-side authorization | security | `.skilled/skills/sk-code/sk-code-frontend/references/web-motion-and-interaction.md:361` | M33 permits a client redirect "since the server is no longer in the loop" and never restates server-side refusal | A reader can implement a UX redirect as the authorization boundary | State that the server still refuses data requests and cached data is cleared | instance-only |
| R5-P2-008 | P2 | Visual-review intent does not load the accessibility reference it cites | maintainability | `.skilled/skills/sk-code/sk-code-frontend/ROUTER.md:112` | `WEB_VISUAL_HIERARCHY` loads three files; the review pass cites `web-accessibility-patterns.md` at seven A-anchors | A reviewer following the load policy cannot open the criterion behind a critical finding | Add the file to the load set or mark the anchors as follow-on reads | class-of-bug |
| R5-P2-009 | P2 | Hub canary never exercises the new visual vocabulary | maintainability | `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json:190` | Nine cases; the only frontend bundle case uses the pre-existing CASCADE prompt; no `code-frontend-visual` keyword | The regression harness cannot catch finding 1 or a future tie-break change | Add one canary per new intent, including the failing "design review" phrase | class-of-bug |

## 4. Remediation Workstreams

### WS-1: Visual-review routing reach (P1, must fix before merge)

1. Add `design review`, `design review findings` and `review this design` to the visual vocabulary
   in `.skilled/skills/sk-code/hub-router.json` and mirror them in the stage-two
   `.skilled/skills/sk-code/sk-code-frontend/ROUTER.md`.
2. Make a visual-review match bundle `sk-code-frontend` beside `sk-code-review` instead of losing
   the tie-break. Replay the exact phrases and the existing `review this screen` control.
3. Add the phrases to the sk-code canary fixture (R5-P2-009) so the fix is protected.

### WS-2: Metadata and packet accuracy (P2, schedule with WS-1)

1. Rebuild `derived.intent_signals` in `.skilled/skills/sk-design/graph-metadata.json` (R1-P2-002).
2. Drop or correct the false phase-2 file row (R2-P2-003) and name the eight prompts in phase-1
   AC-005 (R2-P2-004).
3. Update the sk-code surface table, surface list, layout comment and `description.json`, including
   `lastUpdated` (R3-P2-005).

### WS-3: Lost guidance and session guidance (P2, follow-up)

1. Restore the pseudo-element shadow-animation technique in `web-visual-values.md` Section 5 or
   `web-motion-and-interaction.md` performance (R3-P2-006).
2. Amend M33 so the client redirect is explicitly UX-only (R4-P2-007).
3. Resolve the `WEB_VISUAL_HIERARCHY` load-set mismatch (R5-P2-008).

## 5. Spec Seed

- Add to phase 2 or a follow-on packet: "A visual-review request routes to `sk-code-review` with
  `sk-code-frontend` as evidence, and the documented phrases `design review`, `design review
  findings` and `review this design` all produce that bundle."
- Add to phase 1: the exact eight routing prompts and their replay output.
- Add to phase 2: the canonical surface descriptors are part of the acceptance evidence, not only
  the router and the agent.
- Add to phase 1: the retired depth reference's shadow-animation technique is a required carry-over.

## 6. Plan Seed

- One routing task: vocabulary + bundle rule + replay + canary case.
- One metadata task: graph metadata, phase summaries, acceptance evidence and hub descriptors.
- One content task: shadow-animation item and M33 wording.
- One load-set task: `WEB_VISUAL_HIERARCHY` resource map or follow-on-read note.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | The folder is deleted, the hub has three modes, the chart citations are gone, and the phase map statuses match. The routing handoff is partial because R1-P1-001 is active. |
| `checklist_evidence` | partial | All recorded acceptance rows are `Met`. Two evidence-recording defects remain (R2-P2-003, R2-P2-004). The packet's `validate.sh --strict` claims were not re-run by this lineage because the gate is outside its write surface. |

### Overlay Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `skill_agent` | pass | `.skilled/agents/design.md` routes the decide path to the three new references; the capability scan maps the same files. |
| `agent_cross_runtime` | pass | `.claude`, `.codex`, `.pi` and `.hermes` mirrors carry the same description and decide path. |
| `feature_catalog_code` | notApplicable | No feature-catalog entry changed. |
| `playbook_capability` | pass | `verify-router-sync.cjs` 5/5, including the new visual-values scenario. |

`AC_COVERAGE: pass (all recorded acceptance rows are Met; two evidence-recording defects are tracked as P2)`. The
`resource-map.md` file is absent, so the Resource Map Coverage Gate did not run.

## 8. Deferred Items

- P2 items in WS-2 and WS-3 do not block the structural retirement and can ship with the P1 fix.
- The existing `mcp-figma` playbook row for `node-to-token-markup.md` is a report defect only; the
  scenario itself does not need a content change unless the owner wants one.
- The `WEB_VISUAL_HIERARCHY` accessibility load-set mismatch is advisory while the A-checks are
  inline; it becomes material if a reviewer is expected to cite the A-anchor in every finding.

## 9. Dimension Expansion Map

| Dimension | Iteration | Coverage | Result |
|-----------|-----------|----------|--------|
| correctness | 1 | complete | Retirement verified; one routing-reach P1 |
| traceability | 2 | complete | Versions and changelogs agree; two recording defects |
| maintainability | 3 | complete | One lost guidance item; one descriptor omission |
| security | 4 | complete | No secret/path/injection issue; one M33 wording defect |
| maintainability + traceability | 5 | complete | Load-set and canary coverage gaps |

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: no direction was swept without a finding; each iteration produced a distinct artifact
- Remaining frontier: none beyond the WS-1/2/3 items above

## 10. Search Ledger

*No search-depth state captured (legacy v1 record).*

The review's own search covered: dangling `sk-design-fundamentals` strings across six runtime
trees; the five baseline routing prompts; the documented visual-review phrases; the retired
references' heading map; the three new references' link sets; the changed manifests' path safety;
and the hub canary's prompt set.

## 11. Audit Appendix

### Convergence Summary

- Iterations: 5 of 5. Stop reason: `maxIterationsReached`.
- New-finding ratios: 1.0, 1.0, 1.0, 1.0, 1.0. Every iteration raised new findings, so a
  convergence STOP would have been a false positive. The forced-depth policy ran to the cap.
- Severity trajectory: P1 stayed at 1 (R1-P1-001); P2 grew from 1 to 8.
- No P0 was raised, downgraded or carried.

### Coverage Summary

- All four dimensions have at least one full iteration.
- Core protocols: `spec_code` partial, `checklist_evidence` partial.
- Overlay protocols: `skill_agent` pass, `agent_cross_runtime` pass, `feature_catalog_code`
  notApplicable, `playbook_capability` pass.
- 48 scope files are declared in `deep-review-config.json`; the findings cover the routing,
  metadata, reference, agent and playbook surfaces that changed.

### Ruled-Out Claims

- No live path to the deleted fundamentals folder; remaining hits are historical records and
  retrieval corpus data.
- No stale default mode in sk-design; `defaultMode` is null and the compiled route defers.
- No wholesale false changed-file table; one false row across three summaries.
- No secret, absolute path or prompt-injection directive in the new references or manifests.
- No wholesale loss of the retired references; eight of nine have complete successors.

### Sources Reviewed

- `specs/sk-design/021-deprecate-fundamentals/spec.md` and the three phase packets
- `.skilled/skills/sk-design/{SKILL.md,ROUTER.md,hub-router.json,mode-registry.json,description.json,command-metadata.json,graph-metadata.json,leaf-manifest.json}`
- `.skilled/skills/sk-code/{SKILL.md,ROUTER.md,hub-router.json,mode-registry.json,description.json,leaf-manifest.json,graph-metadata.json}`
- `.skilled/skills/sk-code/sk-code-frontend/` (SKILL, ROUTER, README, three new references,
  `tokens.css`, playbook scenario)
- `.skilled/skills/sk-design/sk-design-chart/` (SKILL, four cleaned files, changelog)
- `.skilled/agents/design.md` plus the four runtime mirrors
- `.skilled/skills/mcp-tooling/mcp-figma/` (SKILL, three playbook files, changelog)
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/009-sk-design/` (compiler and canary)
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json`
- `deep-review-state.jsonl`, `deep-review-findings-registry.json`, `deep-review-strategy.md` and
  `deep-review-dashboard.md` in this lineage
