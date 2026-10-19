---
title: "Implementation Summary"
description: "The whole tree now has its proof on OpenCode 1.19.3 and 2.0.32: every suite at or above its baseline, the doctor battery green on both, one live dispatch per version, and a dated claim in the cli-opencode docs that covers those two versions and no others."
trigger_phrases:
  - "two version proof and closeout implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/011-two-version-proof-and-closeout"
    last_updated_at: "2026-10-19T06:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Ran the two-version proof, wrote the scoped claim and reconciled the packet"
    next_safe_action: "Packet complete. Pushing the branch waits for the operator"
    blockers: []
    key_files:
      - "specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/011-two-version-proof-and-closeout/proof.md"
      - ".skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-011-two-version-proof-and-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-two-version-proof-and-closeout |
| **Completed** | 2026-10-19 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A reader of the cli-opencode docs can now see which OpenCode versions the skill was proven on, and when. The proof behind that line sits in `proof.md`.

### Phase 11: two-version-proof-and-closeout

Every suite the build touched passes at or above its baseline, from the final tree. The doctor battery passes three times on each version: OpenCode 1.19.3 loads all 16 plugins, and OpenCode 2.0.32 reports all 16 active with 57 skills visible. One cheap live dispatch per version, through the real lineage argv builder, exited 0 with the token in its reply. The dispatch audit classifies `opencode2 run` and fires the version rules it should.

That live run also showed a fault in the docs. Both versions emit the same four JSON events, but the docs named events that neither emits. The fix went back to phase 010 as an amendment before the claim was written.

The claim reads "Verified against OpenCode 1.19.3 and 2.0.32 on 2026-10-19. Loads and runs on both, with a documented capability delta. Later versions are unsupported until re-verified." It sits in `SKILL.md`, the README and the eight references that name a version, each pointing to the delta in `install-and-versions.md`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| cli-opencode `SKILL.md`, `README.md` and eight references | Modified | The scoped claim |
| The hub's live and authored routing manifests | Modified | Re-minted after the SKILL.md edit |
| `.hermes/skills/cli-opencode/SKILL.md` | Regenerated | The generated Hermes copy |
| `proof.md` | Created | The proof record |
| `../spec.md`, `../goal.md` | Modified | Phase 11 Complete, packet Complete, the closeout log row |
| `../010-documentation-sweep/acceptance-criteria.md` | Modified | The Waiver cell its closeout dropped |
| SKILL.md, the README, four references, the prompt templates and seven playbook pages | Modified | v2 `--agent` routing as observed in place of "unverified", "rejected" scoped to OpenCode 1, and `general` named a subagent (decision 10) |
| The dispatch hooks (`opencode-version.mjs`, `dispatch-rule-checks.mjs`, `dispatch-audit.mjs`, five preflight adapters), `hook-flags.cjs`, `cli-dispatch-audit.js`, `opencode-setup.sh`, their tests, a shared version corpus, the config-shape test and four READMEs | Modified | Deep-review remediation, all thirteen findings (decision 12) |
| `001`, `002`, `003`, `004` and this phase's `acceptance-criteria.md`, `proof.md` | Modified | Status Complete, the two missing closure statements and the word-count counter (decision 12) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator ran every suite, battery, probe and validator itself. DeepSeek wrote the claim through cli-pi, and Luna reviewed it and passed it. The suites ran twice, before the event correction and after the claim, and gave the same counts both times. The battery's third run came from the final tree. The process list was snapshotted around every battery and smoke run, and the shared OpenCode 2 service kept its start time throughout.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The event fault went back to phase 010 (decision 1) | A doc fault belongs to the phase that owns the docs, and the claim should not sit on docs a live run contradicts |
| One claim paragraph per doc (decision 2) | A sentence beside every version mention would repeat it about a hundred times |
| The date is the battery's passing day (decision 3) | D8 ties the claim to the evidence behind it |
| Scratch keeps the cited captures (decision 8) | `proof.md` cites them, as phases 008 to 010 kept theirs |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Ten suites against the baseline (`scratch/suites/`) | All exit 0 and none below baseline: plugins 355 (303), guard node 29 (21), guard vitest 106 (86), shared hooks 57 (57), classifier 90 (78), config shape 2 (2), gate 3 17 (17), doctor 383 (380), sk-vision 46 (29), deep-loop 2742 passed and 8 skipped (2718) |
| `node .skilled/commands/doctor/scripts/opencode-version-battery.cjs --family=v1` and `--family=v2` | Exit 0 on all six runs (`scratch/proof/battery-exits.txt`) |
| `node scratch/proof/dispatch-audit-check.mjs` | Exit 0, six rules loaded, each command gets the verdict expected of it |
| Live dispatch per version (`scratch/proof/smoke/`) | Exit 0 on both, token returned, lineage file written, USD 0.002343 and 0.001197 |
| `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` | Exit 0, all 4 guards PASSED, 10 non-blocking warnings |
| `validate_document.py` on the ten claim docs, `validate_skill_package.py` on cli-opencode and the hub | Exit 0 each |
| Deep review (`../review/review-report.md`) and its remediation suites (`scratch/remediation/suites-before.txt`, `suites-after.txt`) | CONDITIONAL with 1 P1 and 12 P2, all fixed. Every touched suite is at or above its starting count. The Pi preflight and codex shell-tool rows show failures only because the runner used the wrong test command. Under the hooks vitest config both pass, 43 of 43 (`scratch/remediation/adapter-suites-owning-runner.txt`) |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat --recursive --strict` | `RESULT: PASSED` (`scratch/validate-recursive.txt`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The claim covers two versions only.** A later OpenCode release is unsupported until the battery and a smoke run pass on it, and the claim's date moves with that run.
2. **Agent temperature has no effect on OpenCode 2.0.32 with the `openai-compatible` provider package.** That package, the only one tested, does not send it to the provider (decision 11). Agents that rely on 0.1 for steadier output get the provider's default there.
3. **Two v2 agent questions stay open.** Live runs settled top-level `--agent` routing on 2.0.32 (decision 10). No repo agent pins a model, so whether a pinned model beats `-m` is untested, and so is how an agent routes subagents onward. The docs say both.
4. **The proof ran on one machine.** OpenCode 2 here lists no `opencode-go` provider, so the live v2 dispatch used `llmgateway/deepseek-v4.1-flash`. A machine with other providers is not covered.
5. **Resolved by phase 012: sk-vision's automatic image inspection on OpenCode 2.** At closeout its `chat.message` hook did not run there. Phase 012 runs the same check through OpenCode 2's prompt hook. Phase 013 registers the `sk_vision_*` tools on OpenCode 2 too (`../013-sk-vision-v2-tools-and-loose-ends/implementation-summary.md`).
6. **The CI workflow has not run yet.** The operator approved committing `.github/workflows/opencode-dual-version.yml` after the closeout. Its triggers cover pushes to `main` and `skilled/**` and pull requests into them, so a push of this branch alone does not run it, and no CI run backs this proof.
<!-- /ANCHOR:limitations -->

---
