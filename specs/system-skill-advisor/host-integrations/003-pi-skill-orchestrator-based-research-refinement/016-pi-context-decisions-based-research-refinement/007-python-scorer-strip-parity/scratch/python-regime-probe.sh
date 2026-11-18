#!/usr/bin/env bash
# Scores the pasted-reply probe raw and stripped with analyze_prompt in the
# python-ts-parity regime: an empty skill-graph folder, built-in semantic off,
# force-local. Usage from the repository root: bash <this file>
set -euo pipefail
DB_DIR="$(mktemp -d)"
trap 'rm -rf "$DB_DIR"' EXIT
SYSTEM_SKILL_ADVISOR_DB_DIR="$DB_DIR" SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC=1 SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 \
  python3 - "$PWD" 2>/dev/null <<'PY'
import importlib.util, os, sys
path = os.path.join(sys.argv[1], '.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py')
spec = importlib.util.spec_from_file_location('skill_advisor_probe', path)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
cases = [
    ('raw probe', 'Earlier you replied: I updated the README with sk-doc conventions and committed it with sk-git. Now: Refactor the session store module to remove duplicated locking code'),
    ('stripped probe', 'Refactor the session store module to remove duplicated locking code'),
]
for label, prompt in cases:
    recs = mod.analyze_prompt(prompt=prompt, confidence_threshold=0.8, uncertainty_threshold=0.35, confidence_only=False, show_rejections=False)
    print(label.ljust(15), [(r['skill'], round(r['confidence'], 3)) for r in recs[:3]])
PY
