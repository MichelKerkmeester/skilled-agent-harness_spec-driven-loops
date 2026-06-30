# What Changed in 147: The Deep Loop Workflow Consolidation

> Spec 147 merged five public deep-loop mode skills into one `deep-loop-workflows` hub backed by `deep-loop-runtime`, preserved stable commands and agents, then validated the destructive cleanup and reviewed the adjacent skill-system surface.

---

## THE UNIFYING PRINCIPLE

The packet followed one operating rule. Public identity belongs in one hub, reusable machinery belongs in one runtime backend and mode-specific behavior belongs behind an explicit mode discriminator. That separation let the framework reduce five public skill identities to one without flattening the five workflows into a single vague skill.

The packet did not treat consolidation as a rename. It first captured parity and ownership, then moved runtime plumbing, then introduced the merged hub, then repointed commands, agent mirrors and advisor routing, then cleaned the old paths only after the replacement surface existed. When later review found a missing deletion gate, phase 009 added the council graph probe and corrected the checklist instead of pretending the original gate had passed.

That rule shaped every section below.

---

## 1. BASELINE AND RUNTIME OWNERSHIP

**Before**

The five deep-loop modes each carried public skill identity and shared runtime concerns close to their old surfaces. There was not yet a packet-local baseline that later phases could use to separate expected behavior from migration noise.

**After**

Phase 001 produced the parity baseline and runtime-ownership ADR without changing any live skill. Phase 002 promoted generic plumbing into `deep-loop-runtime` while keeping every old public entrypoint as a byte-compatible shim. The promoted runtime contracts included runtime capabilities, artifact root handling, loop-lock CLI behavior and lifecycle taxonomy.

**Impact**

The packet gained a stable control plane before any public surface moved. Later phases could change names, paths and routing while still checking against the same phase-001 baseline and the same runtime ownership decision.

**Why this came first**

A consolidation that starts by deleting old identities has no way to prove it preserved behavior. Spec 147 started with evidence and ownership so every later phase had something concrete to compare against.

---

## 2. ONE PUBLIC HUB WITH FIVE MODES

**Before**

The framework exposed five public deep-loop skill identities. That made each workflow visible, but it also scattered graph metadata, advisor identity and shared documentation across five places.

**After**

Phase 003 created `deep-loop-workflows/` as one public skill with five mode packets and one advisor identity. The hub `SKILL.md` routes by mode and carries no per-mode implementation logic. The hub `graph-metadata.json` has `skill_id`, `name` and folder equal to `deep-loop-workflows`, with `family=deep-loop`.

**Impact**

The public shape became easier to reason about. Operators see one skill family, one hub identity and five explicit modes instead of five public skills that each have to stay aligned with the same runtime doctrine.

**Why a hub and not a flat merge**

The five workflows still have distinct mode behavior. The hub keeps one identity for routing and documentation, while mode packets keep the differences explicit and recoverable.

---

## 3. COMMANDS AND AGENT MIRRORS

**Before**

The `/deep` command surface and native deep-loop agents pointed at the old skill paths. The user-facing names were stable, but the implementation references still followed the five-skill layout.

**After**

Phase 004 repointed the `/deep` command surface off the old skill paths and onto the merged `deep-loop-workflows` packet. Phase 005 repointed the five native deep-loop agent bodies across all three runtime mirrors. Command names, agent names and dispatch contracts stayed unchanged.

**Impact**

Users kept the same commands and agents while the framework moved underneath them. The consolidation reduced internal skill identity without turning the migration into a user-facing command migration.

**Why preserve names**

Names are part of the operator contract. Spec 147 changed the backing skill reference because that was the actual architectural problem, not the commands and agents users already knew.

---

## 4. ADVISOR GRAPH AND MODE ROUTING

**Before**

Advisor graph and scorer behavior recognized five `deep-*` skill IDs. That matched the old public layout, but it would have kept the old identities alive after the hub shipped.

**After**

Phase 006 migrated advisor graph and scoring to one `deep-loop-workflows` skill plus a mode-alias and discriminator layer. The family correction for `deep-ai-council`, `deep-improvement` and the merged node happened first. Both routing-parity fixtures assert `deep-loop-workflows` and the concrete mode, with vitest green.

**Impact**

The advisor now recommends the merged skill identity while still carrying enough mode information to dispatch the right workflow. The family correction prevented routing from failing closed during the migration.

**Why aliases and discriminators**

The old skill IDs still express useful intent. The new system preserves that intent as mode selection, not as five public skill nodes.

---

## 5. GOVERNANCE AND FRAMEWORK DOCUMENTATION

**Before**

The packet had shipped behavior and documentation that could diverge as the consolidation moved. Framework docs still described the five-skill model, and governance needed to catch up to the actual surface.

**After**

Phase 007 recorded the governance decision and reconciled phase docs to shipped reality. It did no build work. Phase 008 rewrote cross-repo framework documentation from the five-skill model to the two-skill model: one `deep-loop-workflows` hub with modes plus the frozen MCP-free `deep-loop-runtime` backend. The merged skill was version-stamped, and `mode-registry.json` became the terminology source.

**Impact**

The docs now teach the architecture that actually shipped. The governance record, packet state and implementation no longer tell three different stories.

**Why docs were part of the migration**

Skill routing is learned through documentation as much as code. If the docs kept teaching five public skills, the old model would survive in operator behavior even after the files moved.

---

## 6. OLD-SKILL DELETION AND THE MISSING DOCTOR GATE

**Before**

The destructive old-skill deletion had shipped, but packet-156 deep review found that the phase-009 B1 gate was incomplete. `/doctor deep-loop` was supposed to probe `council-graph.sqlite`, not only `deep-loop-graph.sqlite`, and that council probe had not been implemented.

**After**

Phase 009 added council scope, council-graph probe and staleness checks, `ai-council/**` inventory, council convergence sampling and council replay recommendation to `.opencode/commands/doctor/assets/doctor_deep-loop.yaml`. It widened the `deep-loop` route flags in `.opencode/commands/doctor/_routes.yaml`. It also reconciled `checklist.md`, marked CHK-060 verified with `skill_graph_scan` `rejectedEdges=0` and created `decision-record.md` to descope CHK-065 because byte-identical phase-001 parity replay is unrecoverable at rewritten paths.

**Impact**

The deletion guard now checks both graphs that matter. The packet also tells the truth about what cannot be recovered: byte-identical replay is gone, behavioral parity evidence is the accepted substitute.

**Why this correction mattered**

A destructive cleanup gate is only meaningful if it probes the state that deletion can break. The old-skill deletion affected more than the deep-loop coverage graph, so `/doctor deep-loop` needed council graph coverage too.

---

## 7. THE SYSTEM REVIEW

**Before**

The consolidation packet and its sibling skill-system packets had shipped, but their combined surface still needed an operator-directed review. The highest-risk question was not whether one file changed correctly. It was whether the trio was functionally sound across the merged deep-loop work, MCP skill install doctor standardization and parent nested skill pattern.

**After**

Phase 010 delivered a read-only deep review of `147-deep-loop-workflows`, `148-mcp-skill-install-doctor-standardization` and `117-parent-nested-skill-pattern`. It produced `review/review-report.md` with a CONDITIONAL PASS verdict. The review found zero P0 findings, three P1 findings, 35 P2 findings and about seven refuted findings. It refuted the broken-requires hypothesis by resolving all 23 cross-skill requires, re-checked packet 153 with `validate.sh --strict` and confirmed the surviving P1s carry concrete file and line citations.

**Impact**

The packet closed with a calibrated review rather than a vague confidence claim. The trio is functionally sound, and the remaining work is named: the three P1s, the `skill_creation.md` split and the P2 dead-path sweep belong to a follow-on remediation phase.

**Why conditional pass is the right verdict**

The review found no P0 blocker, but it also found a contained completion-honesty and dead-path cluster. Calling that clean would hide the work. Calling it failed would overstate the risk. Conditional pass preserves both facts.

---

## CURRENT STATE

Spec 147 now ships one public `deep-loop-workflows` hub with five mode packets, one `deep-loop-runtime` backend, stable `/deep` commands, stable native agent names and advisor routing that resolves to the merged skill plus concrete mode. The old five-skill model is removed from the public surface and from framework documentation.

The deletion validation has been corrected so `/doctor deep-loop` covers both `deep-loop-graph.sqlite` and `council-graph.sqlite`. Phase 009 verification passed for hub graph metadata, council graph probe, route validation, council status and query and convergence smoke, five old directory deletion, convergence loop types and both edited YAML files. Phase 010 delivered the system review with zero P0 findings, three P1 findings and a named remediation handoff. The packet is complete, with follow-on work limited to the review's remediation items and generated metadata saves where the orchestrator owns them.
