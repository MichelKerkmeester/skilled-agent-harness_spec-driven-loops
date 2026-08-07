# Iteration 003 — Foundations Invocation and Ownership Boundary

## Focus

Trace foundations procedures from the public command, executable workflow assets, interface doctrine, tests, and shared utilities. Decide what folds into interface, what remains shared, and whether foundations still needs a distinct workflow after the hub contracts to four modes.

## Actions Taken

1. Inventoried the foundations, interface, shared, and `/interface:*` surfaces without modifying the researched files.
2. Read the public `/interface:foundations` router and its auto/confirm workflow contracts.
3. Traced foundations procedure-card selection, static-system artifacts, interface token-planning overlap, and shared contract boundaries.
4. Inspected command-surface and corpus tests to separate current-topology assertions from independently exercised behavior.

## Findings

### 1. Foundations is independently invoked, not merely declared in a routing table

The command names a distinct user job—designing a visual system, defining tokens, and planning static foundations—and routes away when audit, overall direction, extraction, motion, or transport dominates. It has its own required input, visible artifact, auto/confirm workflows, and accepted-value handoff boundary. That is sufficient evidence of a real workflow even without runtime telemetry. [SOURCE: .opencode/commands/interface/foundations.md:16] [SOURCE: .opencode/commands/interface/foundations.md:23] [SOURCE: .opencode/commands/interface/foundations.md:34] [SOURCE: .opencode/commands/interface/foundations.md:68] [SOURCE: .opencode/commands/interface/foundations.md:83]

### 2. The three foundations procedure cards are invoked by the foundations workflow, not by ordinary interface work

The auto workflow explicitly loads the foundations packet, then selects at most one of `tweakable-design-controls`, `component-system-inventory`, or `hierarchy-rhythm-review` before producing static-system artifacts. Ordinary interface doctrine does create a compact color/type/layout/signature token plan, but that is a lighter planning step; the searched interface command and interface packet did not select the foundations procedure cards. [SOURCE: .opencode/commands/interface/assets/interface-foundations-auto.yaml:183] [SOURCE: .opencode/commands/interface/assets/interface-foundations-auto.yaml:187] [SOURCE: .opencode/commands/interface/assets/interface-foundations-auto.yaml:191] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/design-principles.md:78]

Implication: move those cards and the foundations-specific reference/corpus family with the interface-owned foundations subworkflow. Do not promote them to global shared doctrine.

### 3. Fold foundations into `design-interface` as a named internal subworkflow, while preserving `/interface:foundations` as a compatibility alias

The four-survivor target can remove `foundations` as an advisor-visible hub mode without erasing its invocation semantics. The surviving interface packet should own a `foundations` leaf/subworkflow with the current static-axis intake, artifact contract, procedure selection, corpus grounding, and handoff. Keep the public command as a compatibility router during migration; route it to `workflowMode=interface` plus a typed foundations leaf rather than flattening it into generic interface instructions. [SOURCE: .opencode/commands/interface/foundations.md:49] [SOURCE: .opencode/commands/interface/foundations.md:55] [SOURCE: .opencode/commands/interface/foundations.md:70] [SOURCE: .opencode/commands/interface/assets/interface-foundations-auto.yaml:169]

This preserves a distinct workflow but not a distinct skill identity.

### 4. Shared ownership should stop at mode-neutral contracts and utilities

The foundations workflows already depend on shared lifecycle, context-loading, and code-handoff contracts. Shared checker documentation also distinguishes neutral parsing/checker infrastructure from foundations-owned rhythm and naming checks. Keep the neutral vocabulary, lifecycle/evidence contracts, table helper, and cross-mode numeric/proof gates in `shared/`; keep static-system authoring algorithms, axes, examples, relationship blueprint, and foundations-only validators under the interface-owned leaf. [SOURCE: .opencode/commands/interface/foundations.md:44] [SOURCE: .opencode/commands/interface/assets/interface-foundations-auto.yaml:149] [SOURCE: .opencode/skills/sk-design/shared/scripts/README.md:18] [SOURCE: .opencode/skills/sk-design/shared/scripts/README.md:31]

### 5. Existing tests are migration constraints, not proof that foundations must remain a mode

The command-contract test requires `foundations` in the registry and maps it to `/interface:foundations`; the surface test also exercises parity for that command. Those assertions prove compatibility coupling to the current topology. The foundations corpus tests independently protect relationship-blueprint behavior, so that executable behavior must move with the subworkflow. The topology assertions should change only after a compatibility route exists; the corpus behavior tests should remain and be repointed, not deleted. [SOURCE: .opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs:12] [SOURCE: .opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs:36] [SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.test.mjs:120] [SOURCE: .opencode/skills/sk-design/design-foundations/corpus/tests/README.md:18] [SOURCE: .opencode/skills/sk-design/design-foundations/corpus/tests/README.md:19]

## Ruled-Out Directions

- **Flatten all foundations behavior into shared doctrine.** Rejected because the public command owns a concrete intake, procedure selection, artifact, validation, and handoff sequence; shared doctrine cannot replace that execution contract. [SOURCE: .opencode/commands/interface/foundations.md:51] [SOURCE: .opencode/commands/interface/assets/interface-foundations-auto.yaml:187]
- **Keep foundations advisor-visible solely because current tests require the mode key.** Rejected because those tests assert the present registry and command projection; they are compatibility consumers to migrate, not independent evidence for the future topology. [SOURCE: .opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs:36]

## Questions Answered

- **Which `design-foundations` capabilities are actually invoked, and should they fold into interface or shared?** Answered substantially. The public foundations job and its procedure/corpus/validation workflow are real and should survive as a named interface-owned subworkflow. Only mode-neutral contracts, vocabulary, and utilities remain shared. The current public command should remain as a staged compatibility alias.

## Questions Remaining

- Which audit checks are independently invoked, versus serving as interface completion gates?
- What ordered compatibility, rollback, and verification stages should the build packet execute?
- Does the four-survivor topology preserve the single advisor identity or intentionally split it?
- Should styles ownership remain hub-shared, become a separate asset package, or be dependency-injected into surviving skills?
- Production invocation frequency remains unavailable; prior iterations established bounded call cardinality but not telemetry.

## Next Focus

Trace `design-audit` commands, executable checks, and interface completion gates. Separate independently requested audit workflows from checks that can become an interface-owned validation phase.

