---
title: "Goal: Phase 13: skilled-and-doc-alignment"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment"
    last_updated_at: "2026-11-25T20:02:11Z"
    last_updated_by: "create-goal"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "w3-013-skilled-and-doc-alignment"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 13: skilled-and-doc-alignment

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close the packet's `.skilled` changes and the docs that describe them on a checked surface rather than an assumed one, so no skill doc names a verb the CLI lacks and no catalog entry describes a field the runtime dropped, as phase 13 of the parent goal's OpenBot parity build.

**Parent goal:** `../goal.md` binds this phase, and its decisions outrank this file's detail.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The `system-skilled-bots` topic lands before the doc run, because `/local-doc-alignment` shows its no-topic display and stops when no topic matches, so no doc run can happen until the entry exists [SOURCE: .skilled/commands/local-doc-alignment.md:41]. |
| D2 | The fix pass is a hand edit, not `--fix literal`, because the literal applier reaches only the exact literal findings the critic did not overturn, and 36 of the 40 findings the last full run reported were `judgment` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment/spec.md:114]. |
| D3 | A finding whose code root is wrong is recorded and handed to 014, never fixed by editing the doc to agree with the runtime [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment/spec.md:183]. |
| D4 | The clean criterion is read from the last run of each command only, and a `new` bucket above `0` reopens the fix pass [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment/spec.md:186]. |
| D5 | No new surface in `surface-map.yaml` and no new alignment command, because S1 to S16 already fire for a `.skilled` scope [SOURCE: .skilled/commands/assets/local-skilled-alignment/surface-map.yaml:103]. |
| D6 | The `specs/` tree stays out of the doc run's scope, so this packet's own docs are checked by `validate.sh` and not by the doc run [SOURCE: .skilled/commands/local-doc-alignment.md:82]. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node -e "const t=require('./.skilled/commands/assets/local-doc-alignment/topics.json');const x=t.topics['system-skilled-bots'];console.log(x.codeRoots.length, x.checks.length)"` prints `3 3`, so `topics.json` resolves the `system-skilled-bots` topic with three `codeRoots` and three `checks`.
- [ ] `S=${XDG_STATE_HOME:-$HOME/.local/state}/local-skilled-alignment/system-skilled-bots; D=${XDG_STATE_HOME:-$HOME/.local/state}/local-doc-alignment/system-skilled-bots; for R in "$S" "$D"; do F=$(ls -t "$R"/*/report.md | head -1); ls "$F" "${F%report.md}findings.json" "${F%report.md}fix-plan.md" && rg -c '^- Open findings: 0$' "$F"; done` exits 0 and prints `1` twice, so each command's newest report folder holds `report.md`, `findings.json` and `fix-plan.md` and reads `- Open findings: 0`.
- [ ] `rg -n '^\| (still_open|new) \| 0 \|' "$(ls -t "${XDG_STATE_HOME:-$HOME/.local/state}/local-skilled-alignment/system-skilled-bots"/*/recheck.md | head -1)"` prints two lines, so the recheck's `still_open` and `new` buckets both read `0`.
- [ ] `node -e "const fs=require('fs'),p=require('path');const S=p.join(process.env.XDG_STATE_HOME||p.join(process.env.HOME,'.local/state'),'local-skilled-alignment/system-skilled-bots');const ids=new Set();for(const r of fs.readdirSync(S)){const f=p.join(S,r,'findings.json');if(fs.existsSync(f))for(const x of require(f))ids.add(x.id);}const h=[...fs.readFileSync('scratch/rebuttals.md','utf8').matchAll(/^## (\S+)/gm)].map(m=>m[1]);console.log(h.length, h.filter(id=>!ids.has(id)).length)"` prints the `scratch/rebuttals.md` heading count and `0`, so a declined finding carries a reason and names an id a run's `findings.json` carries.
- [ ] `node .skilled/bin/bots.cjs --help | rg -o '^  [a-z]+' | sort -u | wc -l` prints the same number as `node -e "const s=require('fs').readFileSync('.skilled/bin/bots.cjs','utf8');const m=s.match(/const VERB_SPECS = \{([\s\S]*?)\n\};/);console.log([...m[1].matchAll(/^  ([a-z]+):/gm)].length)"`, so `USAGE` and `VERB_SPECS` agree on one verb set.
- [ ] `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .skilled/skills/system-skilled-bots` exits 0, `python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py` exits 0, and `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/system-skilled-bots/manual-testing-playbook` prints `violations=0`.
- [ ] `rg -n 'local-skilled-alignment|local-doc-alignment|Open findings: 0' implementation-summary.md` prints at least three lines, and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Goal authored | Done | `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment` prints `RESULT: PASSED` |
| Packet validates | Done | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment --strict` prints `RESULT: PASSED` |
| Topic entry | Pending | `rg -c 'system-skilled-bots' .skilled/commands/assets/local-doc-alignment/topics.json` exits 1, the measured gap `spec.md` records |
| Both alignment runs | Pending | `ls "${XDG_STATE_HOME:-$HOME/.local/state}/local-doc-alignment/system-skilled-bots"` exits 1, so no doc run has been made here |
| Acceptance criteria | Pending | All eight rows in `acceptance-criteria.md` read `Unmet` |

### Deviations and findings

| Item | Note |
|------|------|
| Parent goal | `specs/system-skilled-bots/003-openbot-parity-build/goal.md:78` binds this phase through its row `013-skilled-and-doc-alignment/goal.md`, which this file supplies. No parent decision or criterion changes, so the parent goal needs no amendment and no resend. |
| Report folder, not the newest folder | `--recheck` writes `recheck.md` into a new run folder that holds no `report.md`, so the report criteria read the newest folder that holds a `report.md` rather than the newest folder under the root. |
| Plan section not added | `plan.md` already carries §8 External orchestration and the three implementation phases, so this run added no plan section and left the file unchanged. |
| Scaffold tokens outside this goal's write scope | `implementation-summary.md` still carries six unfilled value tokens, which the implementation run fills when it writes that file. `validate.sh --strict` reports them as one warning on a Draft packet, not as an error. |
<!-- /ANCHOR:log -->
