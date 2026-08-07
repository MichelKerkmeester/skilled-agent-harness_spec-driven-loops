# Deep Review Iteration 002

## Dispatcher

- Mode: review
- Target agent: deep-review
- Target: `.opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation`
- Focus: security
- Focus area: path handling, shell/process gates, write authority, Open Design transport boundaries, md-generator execution surfaces, and retained preflight checks
- Budget profile: verify
- Route proof: Resolved route: mode=review target_agent=deep-review

## Files Reviewed

- `.opencode/skills/sk-code/code-review/references/review-core.md`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/hub-router.json`
- `.opencode/skills/sk-design/command-metadata.json`
- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/commands/interface/design.md`
- `.opencode/commands/interface/motion.md`
- `.opencode/commands/interface/design-reference.md`
- `.opencode/skills/sk-design/shared/creation-contract.md`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md`
- `.opencode/skills/sk-design/design-md-generator/procedures/design-system-extraction.md`
- `.opencode/skills/sk-design/design-md-generator/references/guided-run.md`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/output-policy.ts`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts`
- `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts`
- `.opencode/skills/sk-design/design-md-generator/backend/tests/output-policy.test.ts`
- `.opencode/skills/sk-design/design-md-generator/backend/tests/guided-run.test.ts`
- `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md`
- `.opencode/skills/sk-design/design-mcp-open-design/scripts/_common.sh`
- `.opencode/skills/sk-design/design-interface/assets/interface-preflight-card.md`
- `.opencode/commands/doctor/scripts/parent-skill-check.cjs`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Guided md-generator can delete and rewrite an arbitrary `--design-md` path outside the output policy** -- `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:275` -- The wrapper validates only `--output` through `resolveOutputPath()` during preflight [SOURCE: `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:165`], then independently resolves `--design-md` with `path.resolve(process.cwd(), options.designMd)` [SOURCE: `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:275`]. In the STUDY leak-retry path that unchecked file is removed and rewritten [SOURCE: `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:337`; SOURCE: `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:349`]. This bypasses the declared single output boundary: `output-policy.ts` is the shared positive allowlist for generated artifacts [SOURCE: `.opencode/skills/sk-design/design-md-generator/backend/scripts/output-policy.ts:44`], and the shared command contract says `md-generator` may write only through its owned extraction pipeline and declared output policy [SOURCE: `.opencode/skills/sk-design/shared/creation-contract.md:176`].
   - Finding class: cross-consumer
   - Scope proof: `rg -n "designMd|resolvedDesignMd|resolveOutputPath|rmSync\\(|writeFileSync\\(" guided-run.ts guided-run.test.ts references/guided-run.md` found output-policy checks for `--output`, but no matching `--design-md` policy guard or negative test before the delete/write path.
   - Affected surface hints: md-generator guided-run wrapper; STUDY retry path; output-policy contract; `/interface:design-reference`; design-md-generator tests
   - Content hash: `sha256:19bb504ad33707c2a5f0118ce34191244af9d2f409ab143c49e6d9f7aeb1cac1`
   - Claim adjudication:
     ```json
     {
       "type": "gate-relevant-p1",
       "claim": "The md-generator guided runner can mutate a DESIGN.md path that was not checked by the shared output policy.",
       "evidenceRefs": [
         ".opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:165",
         ".opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:275",
         ".opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:337",
         ".opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:349",
         ".opencode/skills/sk-design/design-md-generator/backend/scripts/output-policy.ts:44",
         ".opencode/skills/sk-design/shared/creation-contract.md:176"
       ],
       "counterevidenceSought": "Checked guided-run tests, the guided-run reference, output-policy tests, and the shared creation contract. Tests cover safe and unsafe output paths but do not cover unsafe designMd paths; the reference says the wrapper checks existing tokens.json and DESIGN.md paths, but implementation only policy-checks output.",
       "alternativeExplanation": "The path is user supplied and the retry only runs after a leak check, so this is not a remote exploit by itself. It is still a write-authority boundary failure because the mutating mode's documented policy is positive allowlisting, and this write target bypasses it.",
       "finalSeverity": "P1",
       "confidence": "high",
       "downgradeTrigger": "Downgrade to P2 if maintainers intentionally allow --design-md outside the declared output boundary and document a separate confirmation and overwrite policy for that target."
     }
     ```

### P2 Findings

None.

## Traceability Checks

- `spec_code`: partial. Security write-boundary claims are mostly enforced by registry/tool-surface metadata and `output-policy.ts`, but guided-run leaves `--design-md` outside the shared write policy.
- `skill_agent`: partial. The parent hub, Open Design transport, command wrappers, and doctor checks keep read-only and transport boundaries legible; md-generator remains the exception requiring remediation.
- `checklist_evidence`: pending. This iteration did not re-run the packet checklist gates; it used implementation reads and existing tests as direct security evidence.
- `feature_catalog_code`: pending. Not retried because the strategy marks prior partial feature-catalog coverage as blocked for this lineage.
- `playbook_capability`: pending. Not retried because the strategy marks prior partial playbook coverage as blocked for this lineage.

## Integration Evidence

- `/interface:design` and `/interface:motion` frontmatter grants only Read/Glob/Grep [SOURCE: `.opencode/commands/interface/design.md:4`; SOURCE: `.opencode/commands/interface/motion.md:4`].
- `/interface:design-reference` is the only public command wrapper with Write/Edit/Bash grants [SOURCE: `.opencode/commands/interface/design-reference.md:4`].
- `mode-registry.json` marks `interface` and `motion` as non-mutating and `md-generator` as `mutatesWorkspace:true` [SOURCE: `.opencode/skills/sk-design/mode-registry.json:40`; SOURCE: `.opencode/skills/sk-design/mode-registry.json:82`].
- `mode-registry.json` marks `design-mcp-open-design` as a transport with Write/Edit/Task forbidden and `mutatesWorkspace:false` [SOURCE: `.opencode/skills/sk-design/mode-registry.json:103`].
- `parent-skill-check.cjs` validates transport packets as advisor-invisible, non-workspace-mutating, and Write/Edit/Task-forbidden [SOURCE: `.opencode/commands/doctor/scripts/parent-skill-check.cjs:531`].
- Open Design documents live-tool verification and explicit confirmation gates for mutating/destructive verbs [SOURCE: `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md:139`; SOURCE: `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md:150`].
- The interface preflight card is a quality/mechanical gate, not a shell or write-authority gate [SOURCE: `.opencode/skills/sk-design/design-interface/assets/interface-preflight-card.md:26`; SOURCE: `.opencode/skills/sk-design/design-interface/assets/interface-preflight-card.md:201`].

## Edge Cases

- Code graph data was unavailable; this iteration used direct reads, exact searches, and test inspection as graphless fallback evidence.
- The guided-run P1 requires `--study`, an existing `--design-md`, a detected STUDY source leak, and an author retry path. That lowers exploitability but not the boundary classification because the delete/write target bypasses the declared policy.
- Open Design's mutating gates are explicitly prose gates, not structural interceptors. The skill documents this as an accepted transport tradeoff, so no active security finding was filed for that surface.
- The broad first security search entered large generated/example corpora and was not used as finding evidence; narrow line reads superseded it.

## Confirmed-Clean Surfaces

- `output-policy.ts` uses a positive allowlist for generated output directories and rejects paths inside the skills tree or outside `.opencode/specs` / approved sandbox [SOURCE: `.opencode/skills/sk-design/design-md-generator/backend/scripts/output-policy.ts:44`; SOURCE: `.opencode/skills/sk-design/design-md-generator/backend/tests/output-policy.test.ts:24`; SOURCE: `.opencode/skills/sk-design/design-md-generator/backend/tests/output-policy.test.ts:31`].
- `extract.ts` requires `--output`, rejects invalid output-policy results, then rewrites downstream output to the resolved absolute path before writing artifacts [SOURCE: `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:265`; SOURCE: `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:270`; SOURCE: `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:277`].
- Open Design transport setup avoids a global `od`, uses the app-bundled daemon CLI, and warns that daemon HTTP ports are ephemeral rather than hardcoded [SOURCE: `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md:104`; SOURCE: `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md:110`; SOURCE: `.opencode/skills/sk-design/design-mcp-open-design/scripts/_common.sh:41`].
- The doctor parent-skill check covers transport and Write-grant metadata invariants for registry-level tool surfaces [SOURCE: `.opencode/commands/doctor/scripts/parent-skill-check.cjs:531`; SOURCE: `.opencode/commands/doctor/scripts/parent-skill-check.cjs:555`].

## Ruled Out

- No P0 candidate found: there is no evidence of auth bypass, remote code execution without a user-selected command, destructive data loss outside an explicit local CLI path, or secret exposure.
- No new security escalation for the active correctness P1: stale retired foundations/audit identities remain a live handoff correctness issue, but this pass found no evidence that they grant extra tools or bypass write gates.
- No finding for the Open Design transport's lack of structural confirmation interceptor: the skill names the tradeoff and confines writes to the external tool rather than this repo.
- No finding for the seven retained interface preflight checks: they are visual/content/motion readiness checks, not claimed shell or path-safety controls.

## Next Focus

- dimension: traceability
- focus area: spec/code claims, checklist evidence rows, final verification claims, and remaining packet readiness evidence
- reason: security completed with one new write-boundary P1 and no P0; correctness still carries one active P1 and one P2
- rotation status: D1 correctness complete, D2 security complete, proceed to D3 traceability
- blocked/productive carry-forward: productive direct-read plus exact-search fallback; avoid broad searches through `styles/`, `benchmark/`, `review/`, and generated example corpora
- required evidence: checklist rows, implementation-summary gate table, command/test outputs cited by the packet, style SHA/benchmark/validate pending claims, and whether reducer-owned evidence matches current files

Review verdict: CONDITIONAL
