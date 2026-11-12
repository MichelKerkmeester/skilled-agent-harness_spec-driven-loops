---
title: "Tasks: Phase 11: sparse-checkout-rollout"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "sparse checkout rollout tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 11: sparse-checkout-rollout

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Every path below is written from the repository root. `P` is shorthand for `specs/system-speckit/runtime-and-release/006-test-cycle-speed/011-sparse-checkout-rollout` in prose, and commands spell that path in full.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the reference cone and the symlink trap it records (`.github/workflows/rule-canary-sync.yml`). Verify: `sed -n '26,33p' .github/workflows/rule-canary-sync.yml` prints the `with:` block with `filter: blob:none`, the three entries `/AGENTS.md`, `/.skilled/skills/sk-code/`, `/.opencode/skills`, and `sparse-checkout-cone-mode: false`.
- [ ] T002 Run the parse-and-coverage check on the reference workflow before any edit (`.github/workflows/rule-canary-sync.yml`). Verify: `python3 -c 'import re,sys,yaml;w=yaml.safe_load(open(sys.argv[1]));e=[x.strip().lstrip("/") for j in w["jobs"].values() for s in j["steps"] for x in ((s.get("with") or {}).get("sparse-checkout") or "").splitlines() if x.strip()];t=[v for j in w["jobs"].values() for s in j["steps"] for v in [s.get("run"),s.get("name"),s.get("working-directory"),*((s.get("with") or {}).values())] if isinstance(v,str)];p={m for v in t for m in re.findall(r"(?<![\w./-])((?:\.skilled|\.opencode|\.pi)/[A-Za-z0-9._/*-]+)",v)};b=[x for x in sorted(p) if not any(x==q.rstrip("/") or x.startswith(q.rstrip("/")+"/") for q in e)];print("MISSING: "+", ".join(b) if b else "OK "+str(len(e))+" entries")' .github/workflows/rule-canary-sync.yml` prints `OK 3 entries`.
- [ ] T003 Record each edited workflow's latest checkout step duration (`P/scratch/checkout-baseline.md`). Read the step with `gh run view <id> --json jobs`, use the slowest job's figure when a workflow has more than one, and write one row per workflow in the form `| workflow.yml | 57 s |`. Verify: `rg -c '\| [0-9]+ s \|$' specs/system-speckit/runtime-and-release/006-test-cycle-speed/011-sparse-checkout-rollout/scratch/checkout-baseline.md` prints 7.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the four-entry cone to the checkout step (`prompt-card-sync.yml`). The guard is called through `.opencode/skills`, so that symlink entry stays. Verify: `python3 -c 'import re,sys,yaml;w=yaml.safe_load(open(sys.argv[1]));e=[x.strip().lstrip("/") for j in w["jobs"].values() for s in j["steps"] for x in ((s.get("with") or {}).get("sparse-checkout") or "").splitlines() if x.strip()];t=[v for j in w["jobs"].values() for s in j["steps"] for v in [s.get("run"),s.get("name"),s.get("working-directory"),*((s.get("with") or {}).values())] if isinstance(v,str)];p={m for v in t for m in re.findall(r"(?<![\w./-])((?:\.skilled|\.opencode|\.pi)/[A-Za-z0-9._/*-]+)",v)};b=[x for x in sorted(p) if not any(x==q.rstrip("/") or x.startswith(q.rstrip("/")+"/") for q in e)];print("MISSING: "+", ".join(b) if b else "OK "+str(len(e))+" entries")' .github/workflows/prompt-card-sync.yml` prints `OK 4 entries`.
- [ ] T005 Add the five-entry cone to the checkout step (`repo-rules-corpus.yml`). The validation switch loads `hook-flags.cjs`, so `/.skilled/hooks/shared/` stays. Verify: `python3 -c 'import re,sys,yaml;w=yaml.safe_load(open(sys.argv[1]));e=[x.strip().lstrip("/") for j in w["jobs"].values() for s in j["steps"] for x in ((s.get("with") or {}).get("sparse-checkout") or "").splitlines() if x.strip()];t=[v for j in w["jobs"].values() for s in j["steps"] for v in [s.get("run"),s.get("name"),s.get("working-directory"),*((s.get("with") or {}).values())] if isinstance(v,str)];p={m for v in t for m in re.findall(r"(?<![\w./-])((?:\.skilled|\.opencode|\.pi)/[A-Za-z0-9._/*-]+)",v)};b=[x for x in sorted(p) if not any(x==q.rstrip("/") or x.startswith(q.rstrip("/")+"/") for q in e)];print("MISSING: "+", ".join(b) if b else "OK "+str(len(e))+" entries")' .github/workflows/repo-rules-corpus.yml` prints `OK 5 entries`.
- [ ] T006 Add the one-entry cone and keep the existing depth (`runtime-no-spec-import.yml`). Verify: `python3 -c 'import re,sys,yaml;w=yaml.safe_load(open(sys.argv[1]));e=[x.strip().lstrip("/") for j in w["jobs"].values() for s in j["steps"] for x in ((s.get("with") or {}).get("sparse-checkout") or "").splitlines() if x.strip()];t=[v for j in w["jobs"].values() for s in j["steps"] for v in [s.get("run"),s.get("name"),s.get("working-directory"),*((s.get("with") or {}).values())] if isinstance(v,str)];p={m for v in t for m in re.findall(r"(?<![\w./-])((?:\.skilled|\.opencode|\.pi)/[A-Za-z0-9._/*-]+)",v)};b=[x for x in sorted(p) if not any(x==q.rstrip("/") or x.startswith(q.rstrip("/")+"/") for q in e)];print("MISSING: "+", ".join(b) if b else "OK "+str(len(e))+" entries")' .github/workflows/runtime-no-spec-import.yml` prints `OK 1 entries`.
- [ ] T007 Add the two-entry cone to the checkout step (`chart-corpus.yml`). Verify: `python3 -c 'import re,sys,yaml;w=yaml.safe_load(open(sys.argv[1]));e=[x.strip().lstrip("/") for j in w["jobs"].values() for s in j["steps"] for x in ((s.get("with") or {}).get("sparse-checkout") or "").splitlines() if x.strip()];t=[v for j in w["jobs"].values() for s in j["steps"] for v in [s.get("run"),s.get("name"),s.get("working-directory"),*((s.get("with") or {}).values())] if isinstance(v,str)];p={m for v in t for m in re.findall(r"(?<![\w./-])((?:\.skilled|\.opencode|\.pi)/[A-Za-z0-9._/*-]+)",v)};b=[x for x in sorted(p) if not any(x==q.rstrip("/") or x.startswith(q.rstrip("/")+"/") for q in e)];print("MISSING: "+", ".join(b) if b else "OK "+str(len(e))+" entries")' .github/workflows/chart-corpus.yml` prints `OK 2 entries`.
- [ ] T008 Add the two-entry cone to the checkout step (`diagram-corpus.yml`). Verify: `python3 -c 'import re,sys,yaml;w=yaml.safe_load(open(sys.argv[1]));e=[x.strip().lstrip("/") for j in w["jobs"].values() for s in j["steps"] for x in ((s.get("with") or {}).get("sparse-checkout") or "").splitlines() if x.strip()];t=[v for j in w["jobs"].values() for s in j["steps"] for v in [s.get("run"),s.get("name"),s.get("working-directory"),*((s.get("with") or {}).values())] if isinstance(v,str)];p={m for v in t for m in re.findall(r"(?<![\w./-])((?:\.skilled|\.opencode|\.pi)/[A-Za-z0-9._/*-]+)",v)};b=[x for x in sorted(p) if not any(x==q.rstrip("/") or x.startswith(q.rstrip("/")+"/") for q in e)];print("MISSING: "+", ".join(b) if b else "OK "+str(len(e))+" entries")' .github/workflows/diagram-corpus.yml` prints `OK 2 entries`.
- [ ] T009 Add the one-entry cone to both checkout steps (`pi-extension-tests.yml`). The discover job and the matrix job each need it. Verify: `python3 -c 'import re,sys,yaml;w=yaml.safe_load(open(sys.argv[1]));e=[x.strip().lstrip("/") for j in w["jobs"].values() for s in j["steps"] for x in ((s.get("with") or {}).get("sparse-checkout") or "").splitlines() if x.strip()];t=[v for j in w["jobs"].values() for s in j["steps"] for v in [s.get("run"),s.get("name"),s.get("working-directory"),*((s.get("with") or {}).values())] if isinstance(v,str)];p={m for v in t for m in re.findall(r"(?<![\w./-])((?:\.skilled|\.opencode|\.pi)/[A-Za-z0-9._/*-]+)",v)};b=[x for x in sorted(p) if not any(x==q.rstrip("/") or x.startswith(q.rstrip("/")+"/") for q in e)];print("MISSING: "+", ".join(b) if b else "OK "+str(len(e))+" entries")' .github/workflows/pi-extension-tests.yml` prints `OK 2 entries`.
- [ ] T010 Add the eight-entry cone to the checkout step (`sk-code-script-tests.yml`). `/.npmrc` and the sk-doc leaf contract are part of the set. Verify: `python3 -c 'import re,sys,yaml;w=yaml.safe_load(open(sys.argv[1]));e=[x.strip().lstrip("/") for j in w["jobs"].values() for s in j["steps"] for x in ((s.get("with") or {}).get("sparse-checkout") or "").splitlines() if x.strip()];t=[v for j in w["jobs"].values() for s in j["steps"] for v in [s.get("run"),s.get("name"),s.get("working-directory"),*((s.get("with") or {}).values())] if isinstance(v,str)];p={m for v in t for m in re.findall(r"(?<![\w./-])((?:\.skilled|\.opencode|\.pi)/[A-Za-z0-9._/*-]+)",v)};b=[x for x in sorted(p) if not any(x==q.rstrip("/") or x.startswith(q.rstrip("/")+"/") for q in e)];print("MISSING: "+", ".join(b) if b else "OK "+str(len(e))+" entries")' .github/workflows/sk-code-script-tests.yml` prints `OK 8 entries`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Confirm the edited set is exactly the seven planned files (`P/plan.md`). Verify: `git status --porcelain .github/workflows | wc -l` prints 7, and `git status --porcelain .github/workflows | rg -c '\.github/workflows/(prompt-card-sync|repo-rules-corpus|runtime-no-spec-import|chart-corpus|diagram-corpus|pi-extension-tests|sk-code-script-tests)\.yml$'` prints 7.
- [ ] T012 Confirm the workflow diff adds lines only (`prompt-card-sync.yml`). Verify: `git diff HEAD --numstat -- .github/workflows | awk '$2 != 0 {print}'` prints nothing.
- [ ] T013 Push the branch after the operator's go-ahead, then record each workflow's new checkout duration and the sk-code test count (`P/scratch/checkout-after.md`). Read the step with `gh run view <id> --json jobs` on the run the push starts, use the slowest job's figure, and read the log with `gh run view <id> --log`. Verify: `python3 -c 'import re,sys;f=lambda p:{m[0]:int(m[1]) for m in re.findall(r"([a-z-]+\.yml)[^\d\n]*(\d+) s",open(p).read())};a=f(sys.argv[1]);b=f(sys.argv[2]);bad=[k for k in a if b.get(k,10**9)>=a[k]];print("REGRESSED: "+", ".join(bad) if bad else "ALL LOWER")' specs/system-speckit/runtime-and-release/006-test-cycle-speed/011-sparse-checkout-rollout/scratch/checkout-baseline.md specs/system-speckit/runtime-and-release/006-test-cycle-speed/011-sparse-checkout-rollout/scratch/checkout-after.md` prints `ALL LOWER`, and `gh run view <id> --log | rg -c 'tests [1-9][0-9]*'` prints a count of at least 1.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `P/scratch/checkout-after.md` makes the comparison print `ALL LOWER`
- [ ] The sk-code post-push log reports a nonzero test count
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Reference cone**: See `.github/workflows/rule-canary-sync.yml`
- **Measured baseline**: See ADR-010 in `specs/system-speckit/repo-operations/002-ci-workflow-efficiency/004-setup-caching-provisioning/decision-record.md`
<!-- /ANCHOR:cross-refs -->

---
