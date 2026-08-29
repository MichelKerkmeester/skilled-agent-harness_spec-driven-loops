## R1 Mode Taxonomy

**Option A: activity lanes only (`implement`, `review`, `verify`, `debug`)**

Against: this loses the load-bearing surface axis. Current `sk-code` explicitly routes surface first, then intent/resources, with OPENCODE precedence over WEBFLOW markers (`.opencode/skills/sk-code/SKILL.md:69-118`). If each activity mode re-detects surface independently, precedence drift is likely. It also omits the required Phase 1.5 quality gate, which is distinct from both implementation and formal review (`.opencode/skills/sk-code/SKILL.md:33-43`).

**Option B: surface lanes only (`webflow`, `opencode`, `motion`)**

Against: surfaces are resource/evidence families, not user workflow modes. Both supported surfaces share the same lifecycle (`.opencode/skills/sk-code/references/phase_detection.md:16-17`, `.opencode/skills/sk-code/references/phase_detection.md:44-52`). `MOTION_DEV` is explicitly not a surface; it is a peer resource category loaded after surface selection (`.opencode/skills/sk-code/references/stack_detection.md:32`, `.opencode/skills/sk-code/references/smart_routing.md:150-152`).

**Option C: hybrid**

Against: a naive Cartesian product (`webflow-implement`, `opencode-debug`, etc.) would create too many packets and duplicate routing logic. The correct hybrid is **phase/mode packets over one shared surface router**.

**Recommendation: 5 modes**

- `code-implement`: owns Phase 0 research + Phase 1 implementation, implementation resource maps, authoring checklists, WEBFLOW implementation trio, OPENCODE authoring loads, and Motion.dev overlay consumption.
- `code-quality`: owns Phase 1.5 author-side quality gate, universal P0/P1/P2 severity, surface quality checklists, comment hygiene, and checklist evidence before done claims.
- `code-debug`: owns Phase 2 root-cause/debugging workflow, universal error recovery, surface debugging references, and escalation discipline.
- `code-verify`: owns Phase 3 verification, Iron Law completion evidence, surface verification commands, mutation/falsifier ritual, and completion-claim evidence.
- `code-review`: owns formal findings-first review baseline, severity ordering, security/correctness minimums, review checklists/playbooks, PR-state efficiency gates, and final review status contract.

## R2 Two-Axis Mapping

Surface detection should live in parent `shared/`, consumed by every mode.

Reasons:

- Current routing contract is **surface-first, intent-second**, not mode-first (`.opencode/skills/sk-code/references/smart_routing.md:34-37`).
- OPENCODE precedence is safety-critical and should exist once (`.opencode/skills/sk-code/references/stack_detection.md:36-58`).
- The existing router already has a deterministic shared preamble for stack, phase, smart routing, and universal quality (`.opencode/skills/sk-code/references/smart_routing.md:297-317`).
- Route-time loading already slices by detected surface and language rather than loading everything (`.opencode/skills/sk-code/references/smart_routing.md:462-471`).

Phase mapping:

| Existing phase | New mode |
| --- | --- |
| Phase 0 Research | `code-implement` |
| Phase 1 Implementation | `code-implement` |
| Phase 1.5 Code Quality Gate | `code-quality` |
| Phase 2 Debugging | `code-debug` |
| Phase 3 Verification | `code-verify` |
| Formal findings-first review | `code-review` |

`shared/` should own the reusable axis machinery: `stack_detection`, language sub-detection, surface precedence, surface evidence selection, Motion.dev overlay rules, and common resource-loading contracts. Modes own workflow contracts, not surface identity.

## R3 Fold-In Boundary

Confirm the boundary: `sk-code-review` should become `code-review`.

`code-review` owns:

- Findings-first doctrine, severity model, evidence rules, and finding schema (`.opencode/skills/sk-code-review/references/review_core.md:28-74`, `.opencode/skills/sk-code-review/references/review_core.md:77-116`).
- Interactive review UX and next-step behavior (`.opencode/skills/sk-code-review/references/review_ux_single_pass.md:26-49`).
- Baseline plus surface precedence, where security/correctness minimums never relax and surface conventions override generic style/build/test guidance (`.opencode/skills/sk-code-review/SKILL.md:47-100`).
- Output contract and exact final-line status (`.opencode/skills/sk-code-review/SKILL.md:312-373`).
- PR-state dedup/minimum-evidence gates (`.opencode/skills/sk-code-review/SKILL.md:451-521`).

Folder naming recommendation: use clean `code-review` with `packetSkillName: "code-review"`.

Reason: the parent pattern says the standard is `folder == packetSkillName`, and grandfathered mismatches are for existing mismatches only, not new ones (`.opencode/skills/sk-doc/references/skill_creation/parent_skills_nested_packets.md:63`, `.opencode/skills/sk-doc/references/skill_creation/parent_skills_nested_packets.md:135-137`).

Cutover compatibility: preserve `sk-code-review` as a legacy alias/redirect during migration, but do not make the child packet name `sk-code-review`. The internal packet should be clean; compatibility belongs in hub routing/advisor aliasing and consumer updates.

## R4 Migration / Cutover

Recommended sequence:

1. Freeze current routing fixtures for representative prompts: WEBFLOW, OPENCODE, UNKNOWN, Motion.dev cross-stack, Phase 1.5 quality, Phase 3 verify, and explicit `sk-code-review`.
2. Add `sk-code/mode-registry.json` and `sk-code/hub-router.json` modeled on `sk-design`, with all modes `routingClass: "metadata"` like the shipped design registry (`.opencode/skills/sk-design/mode-registry.json:26-116`).
3. Convert `sk-code/SKILL.md` into a thin hub that routes by registry and keeps no per-mode workflow logic, matching the parent invariant (`.opencode/skills/sk-design/SKILL.md:41-62`, `.opencode/skills/sk-doc/references/skill_creation/parent_skills_nested_packets.md:60-64`).
4. Move surface/router material into parent `shared/`: surface detection, language sub-detection, Motion.dev overlay rules, resource slicing, and default preamble.
5. Create child packets in this order: `code-implement`, `code-quality`, `code-debug`, `code-verify`, `code-review`.
6. Move current `sk-code-review` content into `sk-code/code-review/`, preserving review output contract and PR-state gates before changing consumers.
7. Keep exactly one parent `graph-metadata.json`; do not add graph metadata to child packets or `shared/` (`.opencode/skills/sk-doc/references/skill_creation/parent_skills_nested_packets.md:66-74`).
8. Update consumers from `sk-code-review` to `sk-code` mode `code-review`, leaving a legacy alias/redirect until workflow references and advisor fixtures pass.
9. Run parity checks against the frozen fixtures: surface precedence, phase mapping, review baseline, exact final review status, and advisor routing.
10. Remove the legacy top-level `sk-code-review` route only after explicit `sk-code-review` prompts resolve to parent `sk-code` + mode `code-review`.

## R5 Native Invocability

Parent invocability:

- Parent `SKILL.md` frontmatter remains `name: sk-code`, with a description saying it is the single advisor-routable code-family hub.
- Parent owns the one `graph-metadata.json`; child packets and `shared/` have none (`.opencode/skills/sk-design/SKILL.md:68-81`, `.opencode/skills/sk-doc/references/skill_creation/parent_skills_nested_packets.md:66-74`).
- Parent routing reads `mode-registry.json`; it must not hardcode mode behavior (`.opencode/skills/sk-design/SKILL.md:87-91`).

Mode invocability:

- Each child has its own `SKILL.md` with `name`, `description`, `allowed-tools`, `version`, and optional `metadata`.
- Each registry entry has `workflowMode`, `backendKind`, `toolSurface`, `packet`, `packetSkillName`, and `advisorRouting.routingClass: "metadata"` (`.opencode/skills/sk-design/mode-registry.json:27-43`).
- Child packets stay self-contained with their own references/assets, but consume parent `shared/` for surface evidence.
- Do not put `graph-metadata.json` in any mode packet.

## Recommended Taxonomy

| mode | folder | owns | tool-surface |
| --- | --- | --- | --- |
| `implement` | `code-implement` | Research, implementation, WEBFLOW implementation trio, OPENCODE authoring loads, Motion.dev overlay consumption | Mutating: Read, Write, Edit, Bash, Grep, Glob, Task |
| `quality` | `code-quality` | Phase 1.5 quality gate, P0/P1/P2 author checks, comment hygiene, surface checklists | Mostly mutating: Read, Edit, Bash, Grep, Glob |
| `debug` | `code-debug` | Root-cause debugging, error recovery, failing-command isolation, escalation after repeated failed fixes | Mutating: Read, Edit, Bash, Grep, Glob, Task |
| `verify` | `code-verify` | Surface verification commands, Iron Law evidence, mutation/falsifier ritual, completion checks | Non-mutating by default: Read, Bash, Grep, Glob |
| `review` | `code-review` | Findings-first review, security/correctness baseline, review checklists, output contract, PR-state gates | Read-only review plus cache: Read, Bash, Grep, Glob, limited Write for review cache |

## Open Risks

- Legacy `sk-code-review` explicit invocation may regress unless an alias/redirect is preserved through cutover.
- Moving paths will break internal relative links unless child packet references are repointed systematically.
- `code-review` needs a narrow exception for PR-state cache writes while still forbidding implementation fixes.
- The advisor must continue surfacing one parent identity; adding child `graph-metadata.json` would create multi-ID brittleness.
- Parity fixtures need to cover OPENCODE-over-WEBFLOW precedence because that is the easiest high-impact regression.