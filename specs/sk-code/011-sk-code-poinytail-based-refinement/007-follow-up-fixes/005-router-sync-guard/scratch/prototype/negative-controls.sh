#!/usr/bin/env bash
# Seeded-defect controls for the router-sync guard. Each control copies the sk-code tree and
# the two files the guard reads outside it into a fresh mktemp directory, seeds one defect,
# runs the copied guard and requires the expected FAIL line and exit status. The repository
# is never changed, and nothing is deleted.
#
# GUARD_SRC_DIR holds verify_router_sync.cjs and router_replay_lib.cjs. Default: the repository's
# assets/scripts folder, which is where the built guard lives.
set -u

REPO="$(git rev-parse --show-toplevel)"
GUARD_SRC_DIR="${GUARD_SRC_DIR:-${REPO}/.skilled/skills/sk-code/sk-code-opencode/assets/scripts}"
GOLD_REL="specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/compiled/route-gold.typed.json"
DEST_REL=".skilled/skills/sk-code/sk-code-opencode/assets/scripts"

base="$(mktemp -d)"
mkdir -p "${base}/.skilled/skills/sk-doc/sk-create-skill" "${base}/$(dirname "${GOLD_REL}")"
cp -R "${REPO}/.skilled/skills/sk-code" "${base}/.skilled/skills/"
cp -R "${REPO}/.skilled/skills/sk-doc/sk-create-skill/scripts" "${base}/.skilled/skills/sk-doc/sk-create-skill/"
cp "${REPO}/${GOLD_REL}" "${base}/${GOLD_REL}"

caught=0
total=0

# control NAME CHECKS EXPECT_EXIT EXPECT_TEXT [SEED_COMMAND...]
control() {
  local name="$1" checks="$2" expect_exit="$3" expect_text="$4"
  shift 4
  local t
  t="$(mktemp -d)"
  cp -R "${base}/." "${t}/"
  cp "${GUARD_SRC_DIR}/verify_router_sync.cjs" "${GUARD_SRC_DIR}/router_replay_lib.cjs" "${t}/${DEST_REL}/"
  if [ "$#" -gt 0 ]; then
    (cd "${t}" && "$@") || { echo "seed failed: ${name}"; total=$((total + 1)); return; }
  fi
  local out rc
  out="$(SK_SKILLS_ROOT="${t}/.skilled/skills" node "${t}/${DEST_REL}/verify_router_sync.cjs" --checks "${checks}" 2>&1)"
  rc=$?
  total=$((total + 1))
  if [ "${rc}" -eq "${expect_exit}" ] && printf '%s\n' "${out}" | grep -F -q -- "${expect_text}"; then
    caught=$((caught + 1))
    echo "ok      ${name}: exit=${rc}, found: ${expect_text}"
  else
    echo "MISS    ${name}: exit=${rc} (expected ${expect_exit}), wanted: ${expect_text}"
    printf '%s\n' "${out}" | head -20 | sed 's/^/        /'
  fi
}

control "C0 clean tree, checks 1a 2 3 4" "1a,2,3,4" 0 "router-sync: 4/4 checks passed"

control "C1 dead route in the machine router" "1a" 1 "dead route: shared/references/universal/error-recovery.md" \
  node -e 'require("fs").unlinkSync(".skilled/skills/sk-code/shared/references/universal/error-recovery.md")'

control "C2 orphan reference doc" "1b" 1 "orphan (routable doc no router names): sk-code-webflow/references/zz-orphan-probe.md" \
  sh -c 'printf "# probe\n" > .skilled/skills/sk-code/sk-code-webflow/references/zz-orphan-probe.md'

control "C3 leaf dropped from the manifest" "3" 1 "is not a manifest leaf" \
  node -e 'const fs=require("fs");const f=".skilled/skills/sk-code/leaf-manifest.json";const m=JSON.parse(fs.readFileSync(f,"utf8"));const x=m.modes.find(q=>q.workflowMode==="sk-code-opencode");x.leaves=x.leaves.slice(1);fs.writeFileSync(f,JSON.stringify(m,null,2));'

control "C4 playbook expects an unrouted doc" "4" 1 "expects references/shared/does-not-exist.md, which the router does not emit" \
  node -e 'const fs=require("fs");const f=".skilled/skills/sk-code/sk-code-webflow/manual-testing-playbook/implementation-quality/implementation-routing.md";const s=fs.readFileSync(f,"utf8");const n=s.replace(/^(\s*-\s*)references\/\S+\.md\s*$/m,"$1references/shared/does-not-exist.md");if(n===s)throw new Error("no expected line");fs.writeFileSync(f,n);'

control "C5 route-gold missing" "3" 1 "route-gold not found" \
  node -e 'const fs=require("fs");const f="specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/compiled/route-gold.typed.json";fs.renameSync(f,f+".moved");'

echo "negative controls: ${caught}/${total} behaved as expected"
[ "${caught}" -eq "${total}" ]
