---
title: "Decision Record: Remove OpenCode v1 support from the repository"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "070-opencode-v1-removal operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal"
    last_updated_at: "2026-11-19T17:44:43.302Z"
    last_updated_by: "decision-record-writer"
    recent_action: "Recorded operator decisions"
    next_safe_action: "Review the recorded operator decisions"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "decision-record-writer"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Remove OpenCode v1 support from the repository

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Native deep-loop lineages are dropped, not ported to OpenCode 2. | They depended on the v1-only `run --command` path. | None | Phase 001 fanout-run.cjs native-lineage refusal |
| Q002 | Delete opencode-v1.db*, storage/ and the pre-v2-default backup from the Mac, without archiving. | Not stated. | None | 003 scratch/mac-cleanup.txt |
| Q003 | Run the removal as a refactor split into three phase children. | Not stated. | None | 070 spec.md phase map |
| Q004 | Clean up the Mac after the repo work, with the rollback stated. | Not stated. | None | 003 scratch/mac-cleanup.txt |
| Q005 | Run the AC-004 live checks and rename the leftover dual/opencode2 names. | Not stated. | None | 003 AC-004, 002 rename commit 3ef324c3de1 |
| Q006 | Run the deep review on cli-pi with DeepSeek V4.1 Flash at max, since cli-opencode refused a dirty primary checkout. | Not stated. | None | 070 review/review-report.md |
| Q007 | Approve the full review-fix plan, closing A5 as intended and waiving the after-the-fact ordering checks by ADR. | Not stated. Evidence: yes_no, option false, overlap 0, imperative false, shift false. | None | 001 ADR-002, 002 ADR-001, 003 ADR-002 |
| Q008 | Merge the branch straight into main with no pull request, following sk-git, so the v2 battery runs on main. | Not stated. | None | 002 T015, AC-008, merge commit 06d02096e90 |
| Q009 | Restore the archived review folder over the halted run, and list the wrapper refusal and its test as justified OpenCode 1 survivors. | Not stated. | None | 003-v1-docs-and-playbooks-sweep/scratch/justified.txt, 003 tasks.md CHK-012 and CHK-023, 003 implementation-summary.md |
| Q010 | Run the five-iteration deep review through cli-pi with deepseek-v4.1-flash-1017 at max, because cli-opencode refuses dispatch from the primary checkout. | Not stated. | None | review/deep-review-config.json, review/review-report.md |
| Q011 | Fix all eight P2 advisories from the third review in a new phase 004, worked in a worktree and merged to main. | Not stated. | None | 004-v2-review-p2-fixes, merge afb63707a44 |
| Q012 | Delete the merged remote branch worktrees/477-opencode-v1-removal. | Not stated. | None | origin branch list |
| Q013 | Add an opencode-v2-only topic and a hy4 lane preset to the local alignment configs and run the doc alignment on hy4. | Not stated. | None | 004 implementation-summary.md (How It Was Delivered) |
| Q014 | Write the cli-opencode v2.0.1.0 changelog for the loopback battery server and push it to main. | Not stated. | None | cli-opencode changelog v2.0.1.0, commit ce9b6f25b92 |
| Q015 | Fix the five doc lines the doc alignment found, without rerunning its critic, and push to main. | Not stated. | None | 004 implementation-summary.md (How It Was Delivered) |
| Q016 | Leave the duplicate changelog commit on the primary checkout's local main and hand over a rebase recipe. | Not stated. | None | primary checkout local main |
| Q017 | Fix all four open items: rename nativeDual, rerun the doc critic, fix the reducer tests in their own spec folder, and refresh the session-handover build. | Not stated. | None | 004 implementation-summary.md; commits 686de1cb4ea, 9cd204a87b0, af471c253e2; 007-expansive-depth-mode/015-reducer-test-focus-contract |
| Q018 | Purge every OpenCode 1 reference outside history, including the refusal, the remove-v1 helper and their tests, superseding phase 003 ADR-001 and its justified-list approach. | Not stated. | 003-v1-docs-and-playbooks-sweep ADR-001 | 005-v1-reference-purge/decision-record.md ADR-001 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:df9261d4-6090-4b52-892b-db52ff291ccd:toolu_01SUmr1p2K3xgiCHfLujsaUf:1 -->

Question:
```text
Native deep-loop lineages only run on v1: fanout-run.cjs:2399 rejects v2, because they rely on `opencode run --command deep/<loop>`. How should removing v1 handle them?
```

Options:
```text
Port to v2 route (Recommended)
Drop native lineages
Investigate first
```

Answer:
```text
Drop native lineages
```

### Q002
<!-- source: claude:df9261d4-6090-4b52-892b-db52ff291ccd:toolu_01SUmr1p2K3xgiCHfLujsaUf:2 -->

Question:
```text
On your Mac, which old v1 data should go? Removing the v1 package (~/.local/lib/node_modules/opencode-ai 1.19.4, 172M), the ~/.local/bin/opencode1 launcher and the dead ~/.opencode/bin PATH lines in ~/.zshrc is a given. Note that opencode-v1.db was written today at 09:30.
```

Options:
```text
opencode-v1.db (2.8G)
storage/ (13G)
pre-v2-default backup (2.1G)
Archive, don't delete
```

Answer:
```text
opencode-v1.db (2.8G), storage/ (13G), pre-v2-default backup (2.1G)
```

### Q003
<!-- source: claude:df9261d4-6090-4b52-892b-db52ff291ccd:toolu_01FMEdKSGxzQo2Bfpuu8hJyf:1 -->

Question:
```text
Research intent and phase decomposition for 070: should the packet be split into phase children?
```

Options:
```text
refactor + 3 phases (Recommended)
refactor, single packet
```

Answer:
```text
refactor + 3 phases (Recommended)
```

### Q004
<!-- source: claude:df9261d4-6090-4b52-892b-db52ff291ccd:toolu_01QfJgF24Ceboh2pMygCMAYk:2 -->

Question:
```text
Mac cleanup: remove OpenCode v1 from this machine now? It runs the fixed remove-v1 helper, which keeps your v2 `opencode` link. Then it deletes ~/.local/share/opencode/opencode-v1.db*, storage/ (13G) and pre-v2-default-20261024/ (2.1G), and removes the dead ~/.opencode/bin PATH lines from ~/.zshrc after backing it up. Rollback: `npm i -g --prefix ~/.local opencode-ai@1.19.4` brings the binary back, but the deleted databases and storage CANNOT be recovered.
```

Options:
```text
Yes, clean up the Mac
Install only, keep data
Not now
```

Answer:
```text
Yes, clean up the Mac
```

### Q005
<!-- source: claude:df9261d4-6090-4b52-892b-db52ff291ccd:toolu_01QfJgF24Ceboh2pMygCMAYk:3 -->

Question:
```text
Two follow-ups. AC-004 (a live deep-loop iteration and the plugin playbook scenario on v2) is still open, because a worker agent can't run the loop and the scenario commits into the checkout. Leftover names still say dual or opencode2 (opencode-dual-version.yml, feature-catalog/opencode-dual-version-dispatch/, opencode2-models-form.test.cjs). What should I do?
```

Options:
```text
Run AC-004 live
Waive AC-004 via ADR
Rename dual/opencode2 names
```

Answer:
```text
Run AC-004 live, Rename dual/opencode2 names
```

### Q006
<!-- source: claude:df9261d4-6090-4b52-892b-db52ff291ccd:toolu_01RPSecZgb2GJFcnPXeNGh4F:0 -->

Question:
```text
The 5-iteration deep review refused before iteration 1. cli-opencode review needs the MAIN checkout to be clean, and it has uncommitted changes from other work (.pi/settings.json, 10 spec metadata files, an untracked worktree-474-tmp/ folder) that I won't touch. How do you want to run it?
```

Options:
```text
Same model via cli-pi (Recommended)
I'll clean main first
Cancel the review
```

Answer:
```text
Same model via cli-pi (Recommended)
```

### Q007
<!-- source: claude:df9261d4-6090-4b52-892b-db52ff291ccd:chat:de6a74e1-8a7b-4faf-93b2-a87c78db2f2e:ab97c033-d527-4da0-a987-7f9f06ee9599 -->

Question:
```text
Two calls are yours: is closing A5 as intended right, and should the ordering checks be waived by ADR (B5)? Reply "go" to run everything as planned, or tell me what to change.
```

Options: none

Answer:
```text
go
```

### Q008
<!-- source: claude:df9261d4-6090-4b52-892b-db52ff291ccd:toolu_01JGLm8ABkZHybxph9mhUZgS:0 -->

Question:
```text
The branch is pushed, and its message-contract check (the only required check) passed. The OpenCode v2 battery, which phase 002's last open row (AC-008) needs, only runs on a pull request into main. GitHub refused a manual run because the renamed workflow isn't on main yet. How should I get that CI run?
```

Options:
```text
Open a PR into main (Recommended)
Open the PR and merge if green
Stop here
```

Answer:
```text
just commit push merge no pr check sk git
```

### Q009
<!-- source: claude:df9261d4-6090-4b52-892b-db52ff291ccd:toolu_014XoUCDK7mM7o5eEntRU1yR:1 -->

Question:
```text
What should I do with the half-run review state in the primary checkout (old review/ archived, new partial files showing as tracked changes), and with the justified.txt gap (skilled-loop and its wrapper test carry OpenCode 1 refusal text but aren't listed)?
```

Options:
```text
Restore + fix list (Recommended)
Restore only
Leave as is
```

Answer:
```text
Restore + fix list (Recommended)
```

### Q010
<!-- source: claude:df9261d4-6090-4b52-892b-db52ff291ccd:toolu_01LDbDetpUVbnbkhVUmuFPTm:0 -->

Question:
```text
The DeepSeek Flash max rerun can't use cli-opencode: dispatch-iteration.cjs refuses it outside a linked worktree (line 684) and while the primary checkout has uncommitted paths (line 702; 6 paths now, owned by other sessions). How should I run the 5 iterations?
```

Options:
```text
cli-pi, same model (Recommended)
cli-deepseek-harness
Wait for clean main
```

Answer:
```text
cli-pi, same model (Recommended)
```

### Q011
<!-- source: claude:df9261d4-6090-4b52-892b-db52ff291ccd:toolu_01XiP3rTB9Tf1p3gJnuvRd5b:1 -->

Question:
```text
What should happen with the 8 P2 advisories (opencode2 launcher drift, battery server not pinned to localhost, bridge drops unknown hooks silently, dualPlugin name, remove-v1 test not in CI, 9-vs-13 parity cases, two packet-evidence mismatches)?
```

Options:
```text
Fix all in a phase 004 (Recommended)
Fix code ones only
Defer
```

Answer:
```text
Fix all in a phase 004 (Recommended)
```

### Q012
<!-- source: claude:df9261d4-6090-4b52-892b-db52ff291ccd:toolu_01XiP3rTB9Tf1p3gJnuvRd5b:2 -->

Question:
```text
Delete the remote branch worktrees/477-opencode-v1-removal? All its commits are in main; it can be re-pushed from e8068aec7cd if ever needed.
```

Options:
```text
Delete it (Recommended)
Keep it
```

Answer:
```text
Delete it (Recommended)
```

### Q013
<!-- source: claude:df9261d4-6090-4b52-892b-db52ff291ccd:toolu_01GE2GmHkMVPauriw6vdSKEz:0 -->

Question:
```text
/local-doc-alignment couldn't run: the opencode-v2-only topic isn't in your local topics.json (it existed only in the removed 477 worktree's copy), and its lanes can't use a custom config. Both files are gitignored private copies under .skilled/commands/assets/local-*. What should I do?
```

Options:
```text
Add topic + hy4 preset, run (Recommended)
Add topic, default lanes
Skip doc alignment
```

Answer:
```text
Add topic + hy4 preset, run (Recommended)
```

### Q014
<!-- source: claude:df9261d4-6090-4b52-892b-db52ff291ccd:toolu_01GE2GmHkMVPauriw6vdSKEz:1 -->

Question:
```text
A cli-opencode changelog entry is due: v2.0.0.0 predates phase 004. The proposed v2.0.1.0 patch would cover only the reader-visible fix, the doctor battery's private server now bound to 127.0.0.1 (the plugin-builder rename and test/CI changes are housekeeping). Write it?
```

Options:
```text
Write v2.0.1.0, push (Recommended)
Write, include rename
No changelog
```

Answer:
```text
Write v2.0.1.0, push (Recommended)
```

### Q015
<!-- source: claude:df9261d4-6090-4b52-892b-db52ff291ccd:toolu_0164yx1kABZ42gN8PFkg9q9d:0 -->

Question:
```text
/local-doc-alignment (hy4 lanes) found 5 P1 doc mismatches, which I verified against the code: goal-plugin.md:52 and goal-carry-over.md:181 say skilled-loop adds --standalone 'when opencode --help lists it' (it always adds it after the version check); a cli-opencode playbook (base-non-interactive-invocation.md:53) says 'brew install opencode' (v2 installs only via opencode-setup.sh v2); dist-freshness-enforcement.md:36,40 says the OpenCode plugin uses console.warn (it logs and injects a system message). Its critic didn't run: OpenCode Go hit its monthly limit. What next?
```

Options:
```text
Fix all 5, push (Recommended)
Rerun critic first
Leave for later
```

Answer:
```text
Fix all 5, push (Recommended)
```

### Q016
<!-- source: claude:df9261d4-6090-4b52-892b-db52ff291ccd:toolu_0164yx1kABZ42gN8PFkg9q9d:1 -->

Question:
```text
My original changelog commit 7ee80c87364 is still on the primary checkout's local main (its content landed on origin as ce9b6f25b92), next to another session's unpushed 10c36989450; local main is ahead 2, behind 4. sk-git forbids me resetting a dirty, shared primary. How should it be handled?
```

Options:
```text
Leave it, give recipe (Recommended)
Revert locally
```

Answer:
```text
Leave it, give recipe (Recommended)
```

### Q017
<!-- source: claude:df9261d4-6090-4b52-892b-db52ff291ccd:toolu_014qiLxCB2oNdcAyRq7KCEbA:0 -->

Question:
```text
Which open items should I fix now? The Spec-Kit Check failure (3 deep-research-reducer tests expect a '## 11. NEXT FOCUS' section) sits in code another session is actively changing for the expansive-depth packet, whose files are uncommitted in your primary checkout.
```

Options:
```text
Rename nativeDual
Rerun doc critic
Fix reducer tests
Session-handover dist
```

Answer:
```text
Rename nativeDual, Rerun doc critic, Fix reducer tests, Session-handover dist
```

### Q018
<!-- source: claude:df9261d4-6090-4b52-892b-db52ff291ccd:toolu_01LEuBJv6XJoYzCSwUdue9EZ:0 -->

Question:
```text
On current main, 36 files outside specs/, changelogs and benchmarks still mention OpenCode 1. None runs it. 32 are on the justified list: refusal code and tests that stop an OpenCode 1 binary from launching (~8 files), the remove-v1 cleanup helper with its tests and docs (~3), dated observations measured on OpenCode 1 (~10), the version-parser test corpus, a frozen test fixture, the root README and the generated trigger index. Four more, added this session, describe the refusal. How far should the purge go?
```

Options:
```text
Keep guards, drop rest (Recommended)
Purge everything
Keep as is
```

Answer:
```text
Purge everything
```

<!-- /ANCHOR:operator-answers-verbatim -->
