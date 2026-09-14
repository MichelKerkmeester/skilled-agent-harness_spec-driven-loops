# Resource Map - alignment lineage

Emit per the loop's resource-map duty: the sources this converged lineage read, from the
deltas. Every source below was read at 94a72a4931
(94a72a493192a7c9f5e21199ccc8ced356356de1, 2026-09-13T17:17:51+02:00).

## Governed texts (the research target)

- REPO RULES.md, 109 lines: the router. Sections 1-4 read in full. Source of F-102,
  F-201..F-210, F-301..F-307.
- repo-rules/blast-radius.md (154), repo-rules/communication.md (202),
  repo-rules/delegation-and-orchestration.md (230), repo-rules/evidence-and-proof.md
  (221), repo-rules/handoff-and-questions.md (165), repo-rules/presenting-decisions.md
  (156), repo-rules/prevent-overengineering.md (164),
  repo-rules/root-cause-and-debugging.md (159), repo-rules/scope-discipline.md (164),
  repo-rules/skill-hub-routing.md (122), repo-rules/uncertainty-and-honesty.md (144):
  the 11 rule files. Flagged five read in full; the other six read at Fires-when,
  rule-statement and cited-section depth.
- AGENTS.md section 8: the Delivery clause's other end (REPO RULES.md:80-82),
  two-paragraph structure.

## Git history

- Commit sequence and author timestamps: 4bc3e78b1c 17:40, 8db759d7af 14:14,
  e2d5b7b572 14:02, c91beb417b 12:25, 493859130e 11:47, bc2c04ba18 10:16 (all 09-12),
  ecdb026354 09-11, ced970a2c7 08-31, 65a337865a 08-31. Source of F-104, F-105, F-207,
  F-308.
- Diffs of the three post-11:47 commits: F-105, F-110 citations.

## Governance machinery

- .opencode/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs: the 8
  registered checks (:202-354, CHECKS :355-360). Source of F-102, F-106, F-201, F-206,
  F-302.
- .github/workflows/repo-rules-corpus.yml: the fail-closed CI trigger. Source of F-106.
- .opencode/commands/doctor/scripts/parent-skill-check.cjs: existence check. Source of
  F-103, F-304.
- .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md: head
  (sections 1-2), loaded for the synthesis document per communication.md:116-119.
- .pi/PLUGINS.md:16-17: the Pi ask extension, v2.10.0. Source of F-108, F-308.

## Packet corpus

- specs/sk-communication/006-sk-communication-clarity/spec.md:130,159,181,197: the
  006-phase-003 split facts. Source of F-107.
- specs/sk-communication/006-sk-communication-clarity/001-research-communication-
  context/research/iterations/iteration-005.md:59: the partly-unverified surfaces note.
  Source of F-108, F-308.
- specs/sk-doc/055-governance-doc-alignment/spec.md:32,80,99,136,157; plan.md:33,167;
  acceptance-criteria.md:59,60; tasks.md:59,63,64,68: the brief, AC-003, and the
  deferral. Source of F-107 and this report's continuation.
- specs/sk-prompt/007-sk-prompt-parent/002-architecture-decision/
  implementation-summary.md:61,96: the only in-repo AskUserQuestion mentions. Source of
  F-108, F-308.

## Lineage-local

- invocation-metadata.json: the runner-created executor record (cli-pi, glm-5.3-flash,
  reasoningEffort max). Source of F-304 and the receipts section of research.md.
