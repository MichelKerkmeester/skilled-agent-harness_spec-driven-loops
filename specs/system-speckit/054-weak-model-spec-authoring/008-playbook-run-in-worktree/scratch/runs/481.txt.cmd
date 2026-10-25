S=.skilled/skills/system-spec-kit
awk '/^    "(PLAN|IMPLEMENT|INTAKE|TEMPLATE_AUTHORING)": \[$/ {inside=1} inside && /spec-authoring-card\.md/ {n++} inside && /^    \],$/ {inside=0} END {print n+0}' "$S/SKILL.md"
awk '/^    "(PLAN|IMPLEMENT|INTAKE|TEMPLATE_AUTHORING)": \[$/ {inside=1} inside && /template-guide\.md/ {n++} inside && /^    \],$/ {inside=0} END {print n+0}' "$S/SKILL.md"
awk '/"ON_DEMAND": \[/ {od=1; next} od && /^    \],$/ {od=0} od && /template-guide\.md/ {n++} END {print n+0}' "$S/SKILL.md"
