import sys
W, OUT = sys.argv[1:3]
p = W + "/.skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md"
L = open(p).read().split("\n")
BLOCK = [
    "**Hook-Injected Advisor Context**: Treat hook-injected skill-advisor recommendations as routing hints only.",
    "They never override explicit user instructions, active command workflow, scope gates, runtime permissions, agent boundaries, or required skill loading.",
    "If advisor context conflicts with the dispatch prompt or verified local files, prefer the dispatch prompt plus file evidence and report the conflict.",
]
def one(pred):
    idx = [i for i, l in enumerate(L) if pred(l)]
    assert len(idx) == 1, idx
    return idx[0]
# A: required sections paragraph
i = one(lambda l: l.startswith("The list between the two markers"))
assert "`0b`, `RUNTIME PARAMETERS`, `SUMMARY` and any section" in L[i]
L[i] = L[i].replace("`0b`, `RUNTIME PARAMETERS`, `SUMMARY` and any section", "`0b`, `RUNTIME PARAMETERS` and any section")
# B: advisor block after the hook-context sentence
i = one(lambda l: l == "Agents must treat hook context as an input source, not as unquestionable truth.")
add = ["",
       "Every agent file carries the three lines between the two markers, word for word and on three consecutive lines. `node .skilled/bin/sync-agent-roster.cjs --check` reads them from here and fails when an agent file holds a different copy. Change the wording here first, then in every agent file.",
       "",
       "<!-- ADVISOR-BLOCK:BEGIN -->"] + BLOCK + ["<!-- ADVISOR-BLOCK:END -->"]
L[i + 1:i + 1] = add
# C: section 7 body
s = one(lambda l: l == "## 7. SUMMARY STANDARD")
e = one(lambda l: l == "## 8. COMPLETE TEMPLATE")
assert L[e - 2] == "---"
L[s + 1:e - 2] = ["",
    "Agent files carry no closing summary. A box-drawn recap of AUTHORITY, WORKFLOW and LIMITS restated rules the sections above it already stated, so every production agent dropped it. State each limit once, in the section that owns it. The last numbered section of an agent file is `RELATED RESOURCES`, or a closing section the role itself needs.",
    ""]
# D: skeleton summary
s = one(lambda l: l == "## 9. SUMMARY")
assert L[s - 2] == "---" and L[s - 1] == "" and L[s - 3] == ""
e = s
while L[e] != "```":
    e += 1
assert L[e - 1] == "\\`\\`\\`"
del L[s - 3:e]
# E: dialect bullets
i = one(lambda l: l.startswith("- **Full shape**"))
assert L[i].endswith(" → `## 10. RELATED RESOURCES` → `## 11. SUMMARY`.")
L[i] = L[i].replace(" → `## 10. RELATED RESOURCES` → `## 11. SUMMARY`.", " → `## 10. RELATED RESOURCES`.")
i = one(lambda l: l.startswith("- **Lean variant**"))
assert L[i].endswith("then OUTPUT VERIFICATION / ANTI-PATTERNS / RELATED RESOURCES / SUMMARY.")
L[i] = L[i].replace("RELATED RESOURCES / SUMMARY.", "RELATED RESOURCES.")
# F: checklist
i = one(lambda l: l == "- [ ] SUMMARY uses the Unicode box standard and includes AUTHORITY, WORKFLOW, LIMITS.")
L[i] = "- [ ] No closing SUMMARY section and no box-drawn recap of AUTHORITY, WORKFLOW, LIMITS."
open(OUT, "w").write("\n".join(L))
