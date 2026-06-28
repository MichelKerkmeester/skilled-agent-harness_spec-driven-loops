# Iteration 8: `/design:*` Deliverable Shape

## Focus

[D2-4 / D2] `/design:*` deliverable/output shape is unspecified at the command layer. This pass did not re-cover D2-1 argument grammar, D2-2 concrete invocation examples, or D2-3 sibling discriminators. It narrowed to the artifact contract: whether the public command wrapper names the thing the user gets back beyond `STATUS=OK` or `STATUS=FAIL`.

## Actions Taken

1. Re-read the deep-research quick reference and output contract to keep the iteration scoped to evidence-backed findings and the required iteration/state/delta artifacts. [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/references/guides/quick_reference.md:83] [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/references/state/state_outputs.md:37]
2. Reviewed iterations 5-7 to avoid duplicating the generic argument-hint, missing example, and sibling-discriminator angles. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/iterations/iteration-005.md:26] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/iterations/iteration-006.md:17] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/iterations/iteration-007.md:24]
3. Read the current `/design:*` wrappers and `mode-registry.json` to verify the command-visible output surface. [SOURCE: .opencode/commands/design/audit.md:26] [SOURCE: .opencode/commands/design/foundations.md:26] [SOURCE: .opencode/commands/design/interface.md:26] [SOURCE: .opencode/commands/design/md-generator.md:26] [SOURCE: .opencode/commands/design/motion.md:26] [SOURCE: .opencode/skills/sk-design/mode-registry.json:14]
4. Read child mode contracts to derive real deliverable names from existing mode behavior. [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:239] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:276] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:176] [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:249] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:269]
5. Compared the `impeccable-main` command docs pattern, where command pages name expected output and artifacts instead of returning status only. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/CLAUDE.md:287] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/site/content/skills/audit.md:80] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/site/content/skills/document.md:89]

## Findings

### F1 - The `/design:*` wrappers expose process status, not a deliverable contract

Evidence:
- Every checked wrapper ends with `### Step 2: Return Status`, then only `STATUS=OK` or `STATUS=FAIL ERROR="<message>"`. [SOURCE: .opencode/commands/design/audit.md:26] [SOURCE: .opencode/commands/design/audit.md:27] [SOURCE: .opencode/commands/design/foundations.md:26] [SOURCE: .opencode/commands/design/foundations.md:27] [SOURCE: .opencode/commands/design/interface.md:26] [SOURCE: .opencode/commands/design/interface.md:27] [SOURCE: .opencode/commands/design/md-generator.md:26] [SOURCE: .opencode/commands/design/md-generator.md:27] [SOURCE: .opencode/commands/design/motion.md:26] [SOURCE: .opencode/commands/design/motion.md:27]
- The wrappers do name the pinned mode and tell the executor to apply that child mode to `$ARGUMENTS`, but the public command file does not state the artifact produced by that mode. [SOURCE: .opencode/commands/design/interface.md:19] [SOURCE: .opencode/commands/design/interface.md:24] [SOURCE: .opencode/commands/design/md-generator.md:19] [SOURCE: .opencode/commands/design/md-generator.md:24]
- `mode-registry.json` is currently routing identity only: `workflowMode`, `backendKind`, `packet`, aliases, and `advisorRouting`. It has no `outputContract`, `primaryArtifact`, `reportShape`, `handoffEnvelope`, or `fileOutputs` fields. [SOURCE: .opencode/skills/sk-design/mode-registry.json:5] [SOURCE: .opencode/skills/sk-design/mode-registry.json:14] [SOURCE: .opencode/skills/sk-design/mode-registry.json:21] [SOURCE: .opencode/skills/sk-design/mode-registry.json:69]

Buildable recommendation:
- Add a structured `commandSurface.outputContract` block per mode, either in `mode-registry.json` or a sibling command metadata file:
  - `primaryArtifactName`: e.g. `DESIGN.md`, `findings-first audit report`, `interface preflight card`, `foundations handoff card`, `motion pattern card`.
  - `artifactKind`: `file`, `report`, `card`, `manifest`, or `handoff`.
  - `requiredFields`: the minimal named fields that must appear in the deliverable.
  - `fileOutputs`: file paths or generated filenames when the mode writes concrete files.
  - `statusLine`: status remains allowed, but it follows the artifact statement instead of replacing it.
- Generate or drift-check a `### Step 2: Emit Deliverable` section in every `/design:*` wrapper before the status line. The status line should confirm execution; it should not be the only visible output.

Enforceability:
- ENFORCEABLE on the command corpus. A static checker can fail any `/design:*` wrapper whose final visible output contract is only `STATUS=OK/FAIL`, or whose named artifact does not match metadata.
- ENFORCEABLE on metadata. Every mode can be required to declare one `primaryArtifactName` and one `artifactKind`.
- ADVISORY at runtime. Whether a human-readable artifact is good enough still requires review.

### F2 - Child modes already own concrete artifact shapes; the command layer just fails to project them

Evidence:
- `md-generator` explicitly produces `tokens.json`, a user-path `DESIGN.md`, validation pass/fail output, and optional visual artifacts. [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:239] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:255] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:262] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:267]
- `audit` produces a findings-first report ordered P0-P3, and accepted findings become a backlog card through the shared `sk-code` handoff envelope. [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:276] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:282]
- `interface` already has a checkable preflight card and a required `sk-code` build manifest with locked tokens, signature moves, motion budget, reuse list, risks, and never-change constraints. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:176] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:178] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:180]
- `foundations` produces a compact implementation handoff with named tokens, usage rules, responsive breakpoints, and explicit risks, then a foundations-owned handoff card with register posture, source evidence, output schema, CSS/theme token names, breakpoint intent, checks, and risks. [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:249] [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:253]
- `motion` produces motion pattern cards before handoff and then fills a motion-owned stack-boundary field naming CSS transitions, Web Animations, View Transitions, `motion/react`, GSAP, an existing project system, or no animation library. [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:269] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:274]

Buildable recommendation:
- Start with a hand-authored output map, then enforce traceability to child mode phrases:
  - `/design:md-generator` returns `tokens.json`, `DESIGN.md`, validation messages, and optional preview/report artifacts.
  - `/design:audit` returns a scored findings-first audit report and, only for accepted fixes, a backlog handoff card.
  - `/design:interface` returns an interface direction/preflight card, and a build manifest when implementation handoff is in scope.
  - `/design:foundations` returns a foundations handoff card naming tokens, usage rules, breakpoints, checks, and risks.
  - `/design:motion` returns a motion pattern card and implementation handoff naming states, timing, easing, reduced-motion fallback, mechanism, and performance risks.
- Add fixture checks that assert each wrapper's artifact phrase contains at least one mode-owned output keyword. This keeps the command layer honest without parsing the full child skill semantically.

Enforceability:
- ENFORCEABLE for presence and traceability: command output metadata can be checked against mode-owned output keywords.
- PARTLY ENFORCEABLE for field completeness: required fields are deterministic once metadata exists, but the content quality of those fields remains judgment-based.
- ADVISORY for final artifact quality and taste.

### F3 - `impeccable-main` shows the missing public-doc pattern: expected output is first-class

Evidence:
- The corpus contribution guide requires command docs to include `Try it` with one or two concrete examples and expected output. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/CLAUDE.md:287] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/CLAUDE.md:291]
- Its audit docs say the user gets back a single ticket-tracker-ready document, then the `Try it` section includes an `Expected output:` block. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/site/content/skills/audit.md:70] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/site/content/skills/audit.md:80]
- Its document docs name the output as a fixed-section `DESIGN.md` plus `.impeccable/design.json`, and state that other commands read `DESIGN.md` on invocation. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/site/content/skills/document.md:89] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/site/content/skills/document.md:91]
- Its shape docs visually label `brief.md` as the output of `/impeccable shape`, and later state that standalone shape is for getting the brief rather than the full implementation flow. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/site/content/skills/shape.md:8] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/site/content/skills/shape.md:9] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/site/content/skills/shape.md:57]

Buildable recommendation:
- Borrow the output-contract convention, not the whole site system. Each `/design:*` wrapper should carry a compact artifact line, while richer docs or generated README surfaces can carry the longer expected-output block.
- Suggested wrapper format:
  - `Returns: <primary artifact name>`.
  - `Includes: <3-6 required fields or files>`.
  - `When implementation follows: <handoff envelope or manifest name>`.
  - `Status: STATUS=OK/FAIL`.
- Add a docs parity checker: every command-level example from D2-2 must have a sibling `Expected output` or `Returns` block naming the same `primaryArtifactName` as metadata.

Enforceability:
- ENFORCEABLE for wrapper/doc presence, metadata parity, and example-to-artifact consistency.
- ENFORCEABLE for deterministic corpus checks that the named output is not a generic phrase like `result`, `design output`, or `status`.
- ADVISORY for editorial clarity and whether the expected-output sample teaches the mode well.

## Questions Answered

- Q1: `/design:*` needs a named deliverable contract in addition to argument grammar, examples, and sibling discriminators. Status is execution metadata, not the artifact.
- Q1: The first output map should derive from child mode contracts. No live mode behavior change is required to make command docs more specific.
- Q5: The artifact contract is mostly enforceable: command wrappers, metadata, docs examples, and child-keyword traceability are deterministic on a test corpus. Final artifact quality remains advisory.

## Questions Remaining

- Should `commandSurface.outputContract` live inside `mode-registry.json`, or should command metadata stay separate so the registry remains routing-only?
- Should wrappers include only the compact `Returns` line while richer expected-output blocks live in generated docs, or should the command files themselves carry both?
- Should the command return protocol add a machine-readable line such as `DELIVERABLE="<artifact>"` alongside `STATUS=OK`, or is metadata-backed prose enough for enforcement?

## Next Focus

Continue D2 with the metadata home and generated-surface decision: define the smallest command metadata schema that can project argument hints, examples, sibling discriminators, deliverable contracts, and docs/checker fixtures without moving mode behavior out of child packets.
