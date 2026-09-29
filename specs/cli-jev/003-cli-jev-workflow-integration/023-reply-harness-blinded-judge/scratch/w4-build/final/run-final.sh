#!/usr/bin/env bash
# Step 4 from the final state: the section 1 gates, alignment drift, per-doc validation, HVR and the phase validator.
# usage: run-final.sh   (writes under final/gates)
set -u
ROOT=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
cd "$ROOT" || exit 90
P=specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge
O=$P/scratch/w4-build/final/gates
rm -rf "$O"; mkdir -p "$O"
bash $P/scratch/w4-build/baseline/run-baseline.sh "$O" > /dev/null
H=.skilled/skills/sk-communication/benchmark/reply-harness
A=.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py
python3 $A --root $H > "$O/align-harness-default.txt" 2>&1; echo "align-harness-default rc=$?" >> "$O/rc.txt"
python3 $A --root $H --check-exact-headers > "$O/align-harness-exact-headers.txt" 2>&1; echo "align-harness-exact-headers rc=$?" >> "$O/rc.txt"
S=.skilled/skills/sk-communication
for f in $H/README.md $S/SKILL.md $S/README.md $S/changelog/v1.4.0.0.md \
  $S/feature-catalog/evaluation-and-observability/offline-judge-agreement.md $S/feature-catalog/feature-catalog.md \
  $S/manual-testing-playbook/release-gating/offline-judge-census-stops-at-label-gate.md $S/manual-testing-playbook/manual-testing-playbook.md; do
  k=$(echo "$f" | tr '/' '_' | sed 's/^\.//')
  python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py "$f" > "$O/vd.$k.txt" 2>&1; echo "vd $f rc=$?" >> "$O/rc.txt"
  python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py "$f" > "$O/hvr.$k.txt" 2>&1; echo "hvr $f rc=$? $(grep -m1 'hard blockers' "$O/hvr.$k.txt" | tr -s ' ')" >> "$O/rc.txt"
done
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P --strict > "$O/phase-validate.txt" 2>&1; echo "phase-validate rc=$? $(grep -m1 'RESULT' "$O/phase-validate.txt")" >> "$O/rc.txt"
cat "$O/rc.txt"
