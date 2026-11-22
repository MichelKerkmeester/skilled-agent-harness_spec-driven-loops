---
title: "Decision Record: Align system-deep-loop code with sk-code and its code-folder READMEs with the sk-doc create-readme standard"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "006-sk-code-and-readme-alignment operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/006-sk-code-and-readme-alignment"
    last_updated_at: "2026-11-22T05:38:43.604Z"
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
# Decision Record: Align system-deep-loop code with sk-code and its code-folder READMEs with the sk-doc create-readme standard

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Run a read-only audit of every code file and README first, then fix its findings in parallel lanes. | Not stated. | None | plan.md, the audit lanes |
| Q002 | Merge main, rerun the gate and push the first alignment pass. | Not stated. | None | push through e9588c57f00 |
| Q003 | Build the 33 behaviour-changing items and propose a default for each of the other 50. | Not stated. | None | commits cfe004b132e..f4ace7e740b, implementation-summary.md |
| Q004 | Document the per-script exit codes and stderr prefixes the scripts already use, and leave their behaviour alone. | Not stated. | None | commit 23da225543d |
| Q005 | Accept the 22 structure, typing and error defaults: drop the exported any, explain each swallowed error, share only two duplicated helpers. | Not stated. | None | commits de972038aba, f7f084fc914 |
| Q006 | Add an opt-in tests type check outside CI and accept the other test defaults. | Not stated. | None | commit 992ae998d16 |
| Q007 | Fix the documents, leave the shared README validator alone, and accept the other docs defaults. | Not stated. | None | commits 3fbc871e111, 0c52017ed96, 1fadbc33da4 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_014RMPuL8noFKK6Dx5RNmGUy:2 -->

Question:
```text
How should it run? First a read-only audit: sk-code checks on every code file, and every README checked against its folder's code and the /create:readme template, using sk-doc's audit_readmes and reference checkers. Then fixes in parallel lanes, a gate, and a push after your yes.
```

Options:
```text
Audit, then fix in parallel (Recommended)
Audit only first
```

Answer:
```text
Audit, then fix in parallel (Recommended)
```

### Q002
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01Km22QaKdP2XMTT3NVHL3UG:0 -->

Question:
```text
The alignment pass is 20 commits plus the decision save. Code changes are TSDoc, catch typing and comments, plus 9 READMEs rewritten or corrected and 1 created. Gate green: 3967 passed, 0 failed, validate 16/16, typecheck clean, README checkers 79/79, sk-code quality gate found no blocker. Main has moved one commit, so I'd merge it and rerun the gate first. Push?
```

Options:
```text
Merge, regate, push (Recommended)
Keep local
```

Answer:
```text
Merge, regate, push (Recommended)
```

### Q003
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01Km22QaKdP2XMTT3NVHL3UG:1 -->

Question:
```text
The audit left 83 items it didn't build. 33 would change behaviour, e.g.: writes with no path containment check (append-state-record.cjs:115); a sandbox setup that runs `rm -rf` after accepting a /tmp/ path; three swallowed errors; locale-dependent sorts that feed digests; a playbook validator that finds 0 tests. 50 need a decision, e.g. exit 3 vs 64 for usage errors, an exported `any`, tests outside every tsconfig. All are listed with file:line in the 006 implementation-summary. How should they be handled?
```

Options:
```text
Fix the 33, propose the 50 (Recommended)
Show me the list first
Only the safety ones now
```

Answer:
```text
Fix the 33, propose the 50 (Recommended)
```

### Q004
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01W5PiaTUWXw5z33Gv86Y8S9:0 -->

Question:
```text
Group 1 of 4, exit codes and script contracts (6 items). Defaults: leave behaviour alone and write down what the scripts already do. List the per-script exit codes in the script-interface contract rather than making them all one code (the YAML workflows read them). Keep today's stderr prefixes; 90 test assertions match them. Record fanout-run.cjs (6,246 lines) as a reviewed single-responsibility exception instead of splitting it. Keep `--create-missing-anchors` as a no-op so callers still passing it don't break. Accept the current header and WHY-comment forms.
```

Options:
```text
Accept all 6 defaults (Recommended)
Defaults, but unify exit codes
Defaults, but split fanout-run.cjs
```

Answer:
```text
Accept all 6 defaults (Recommended)
```

### Q005
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01W5PiaTUWXw5z33Gv86Y8S9:1 -->

Question:
```text
Group 2 of 4, structure, typing and errors (22 items). Defaults: remove the exported `any` with method syntax (types only). Give every deliberately swallowed error a WHY comment. Pull out only two duplicates: the fs helper with three byte-identical copies, and nine pivot helpers. Leave per-folder `isRecord` and comparator copies as they are, since merging them would change meaning. Fix TSDoc that names APIs that no longer exist. No bulk line wrapping, no splits of replay-critical functions. Two defaults change behaviour: the provenance reducer would record the real fail-closed reason, which changes the replay fingerprint on those paths, and resume-reducer would stop disguising programmer errors as 'unreadable ledger'.
```

Options:
```text
Accept all 22 defaults (Recommended)
Defaults minus the two behaviour fixes
Comments and typing only
```

Answer:
```text
Accept all 22 defaults (Recommended)
```

### Q006
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01W5PiaTUWXw5z33Gv86Y8S9:2 -->

Question:
```text
Group 3 of 4, tests (7 items). Defaults: add a separate `tsconfig.tests.json` with a `typecheck:tests` script. That type-checks the 220 test files and two pivot scripts nothing checks today; it reports an error baseline, and joins CI only once it reaches zero. Put the always-skipped fan-out probe behind an opt-in env flag. Rename the phase-named test identifiers (`PHASE_TWO_*`). Keep the real-log test dependency on purpose, with a comment. Keep the council report as a frozen record. Add one shape test for mode-contracts.
```

Options:
```text
Accept all 7 defaults (Recommended)
Defaults, and fix test type errors now
```

Answer:
```text
Accept all 7 defaults (Recommended)
```

### Q007
<!-- source: claude:91021a9f-dca3-4cb7-9743-2973efffa465:toolu_01W5PiaTUWXw5z33Gv86Y8S9:3 -->

Question:
```text
Group 4 of 4, docs and doc-quality bars (13 items). Defaults: fix the documents and leave the shared validator alone. List the gitignored runtime file in its README. Move a README's deferred-scope section into a packet backlog. Rename two playbook category headings to CONTENTS. Validate skill READMEs in readme mode, not code-folder mode. Reword `100/100` scores that trip the packet-id rule. Set the @markdown agent's quality bar for code-folder READMEs to the workflow's own floor of 70; today it's 75. That edits the agent definition in 6 runtime mirrors.
```

Options:
```text
Accept all 13 defaults (Recommended)
Defaults, keep the bar at 75
```

Answer:
```text
Accept all 13 defaults (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
