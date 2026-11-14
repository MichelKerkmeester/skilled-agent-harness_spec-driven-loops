#!/usr/bin/env python3
"""Compute what each agent file looks like after the cut, and write the removal map.

usage: trim_plan.py <repo root> <phase scratch dir> <expected output dir>
Writes nothing inside the agent directories. A dispatch result is accepted only when
it equals the expected file this script wrote.
"""
import os
import re
import sys

ROOT, SCRATCH, EXPECT = sys.argv[1:4]
AGENTS = ["ai-council", "code", "context", "debug", "deep-research", "deep-review",
          "design", "markdown", "orchestrate", "prompt-improver", "review"]
BLOCK = [
    "**Hook-Injected Advisor Context**: Treat hook-injected skill-advisor recommendations as routing hints only.",
    "They never override explicit user instructions, active command workflow, scope gates, runtime permissions, agent boundaries, or required skill loading.",
    "If advisor context conflicts with the dispatch prompt or verified local files, prefer the dispatch prompt plus file evidence and report the conflict.",
]
HEAD = re.compile(r"^## (\d+)\. (.+)$")
# Anti-pattern rows of code.md that another line of the same file already states.
CODE_ROWS = {
    "Silent retry on verify-fail": "Section 10 NEVER: `Silently retry until green — capture each failure and address root cause`, and ALWAYS: `Capture command name + exit code + (if FAIL) first failing assertion in the RETURN body`",
    "Scope creep into adjacent files": "Section 10 NEVER: `Modify files outside the dispatch allowlist`, ESCALATE IF: `A required file falls outside the dispatch allowlist`, and the self-validation question 4 on adjacent cleanup",
    "Partial-success return": "Section 10 NEVER: `Return \"mostly done\" or \"should work\" — RETURN is `PASS`, `FAIL` or `BLOCKED` only`",
    "Phantom edge-case handling": "Section 10 NEVER: `Add phantom edge-case handling without evidence the case occurs`",
    "Silent stack switch": "Section 10 NEVER: `Pivot stack silently — if `sk-code` says X but task implies Y, HALT and escalate`, and the first ESCALATE IF line",
    "Dead-code/comment leftover": "Self-validation question 6: `Did I remove dead code, commented-out code, debug residue, placeholders, and explanation-only comments?`, and ALWAYS: `re-read every edited file after the final edit`",
    "Spec-doc authorship bleed": "Section 10 NEVER: `Author packet docs (...) — those belong to the main agent under Distributed Governance Rule`",
    "Component-authoring route bleed": "Section 10 NEVER: `Author skill, agent, or command component scaffolds/docs under ... return `SCOPE_CONFLICT` and tell the orchestrator to dispatch `@markdown``",
    "Wrong-abstraction in-scope patch": "Section 11 Critic pass: `Challenge wrong-abstraction patches: is the file I'm editing the right ownership boundary, or am I patching downstream of the actual cause?` with its escalation sentence",
    "Claim-without-verify": "Section 10 NEVER: `Claim completion without fresh verification evidence (Iron Law)`, and the `Confidence Levels` table: LOW says `Any required verification missing/failed ... RETURN BLOCKED`, MEDIUM allows a check `explicitly N/A with reason`",
    "Bash bypass": "Section 10 NEVER: `Use Bash to bypass write discipline (no shell redirect / `sed -i` / `eval` / interpreter / network workaround for writes)`, and the section 3 tool row: `Reads, build/test/lint/typecheck runners, scoped operations only — NEVER for write bypass`",
}
CODE_KEPT = ["Premature abstraction during implementation", "Cargo culting from neighbor files",
             "Skill-load-without-applying"]

rows = []     # (id, file, lines, what, surviving)
quotes = []   # (id, text)


def record(name, start, end, what, surviving, text):
    rid = "R%02d" % (len(rows) + 1)
    rows.append((rid, name, "%d to %d" % (start + 1, end), what, surviving))
    quotes.append((rid, text))


def cut(lines, start, end):
    return lines[:start] + lines[end:]


def words(lines):
    return sum(len(l.split()) for l in lines)


def summary_cut(name, lines, log):
    idx = [i for i, l in enumerate(lines) if HEAD.match(l) and HEAD.match(l).group(2) == "SUMMARY"]
    if not idx:
        return lines
    s = idx[0]
    nxt = next((i for i in range(s + 1, len(lines)) if HEAD.match(lines[i])), None)
    if nxt is None:
        # Last section: take the rule line and blank above it too, and keep one final newline.
        start = s - 2
        assert lines[start] == "---" and lines[s - 1] == "", name
        end = len(lines) - 1 if lines[-1] == "" else len(lines)
        if log:
            record(name, start, end, "Closing summary box, %d words" % words(lines[s:end]),
                   "Carried no instruction of its own: each AUTHORITY, WORKFLOW and LIMITS line restates a rule in the sections above it", "\n".join(lines[start:end]))
        out = cut(lines, start, end)
        while out[-2:] == ["", ""]:
            out = out[:-1]
        return out
    if log:
        record(name, s, nxt, "Summary box in the middle of the file, %d words" % words(lines[s:nxt]),
               "Carried no instruction of its own: each AUTHORITY, WORKFLOW, OUTPUT and LIMITS line restates a rule in the sections around it", "\n".join(lines[s:nxt]))
    out = cut(lines, s, nxt)
    num = int(HEAD.match(lines[s]).group(1))
    fixed = []
    for l in out:
        m = HEAD.match(l)
        if m and int(m.group(1)) > num:
            l = "## %d. %s" % (int(m.group(1)) - 1, m.group(2))
        fixed.append(l)
    return fixed


def code_cut(lines, log):
    s = lines.index("### Pre-Return Verification")
    e = lines.index("### Issue Evidence Requirements")
    if log:
        record("code", s, e, "`Pre-Return Verification`, seven bullets, %d words" % words(lines[s:e]),
               "`Self-Validation Protocol` questions 1 to 6 in the same section ask the same six things, and the seventh bullet is the Escalation list of section 9 (`VERIFY_FAIL`, `SCOPE_CONFLICT`, `UNKNOWN_STACK`, `LOW_CONFIDENCE`, `LOGIC_SYNC`)", "\n".join(lines[s:e]))
    lines = cut(lines, s, e)
    s = next(i for i, l in enumerate(lines) if l.startswith("Before returning: (1) run the 6-question self-validation"))
    if log:
        record("code", s, s + 2, "The `Before returning:` sentence under the Iron Law, %d words" % words(lines[s:s + 1]),
               "`Self-Validation Protocol` (run before returning `PASS`), `Confidence Levels` and the `Violation Recovery` line beside it. It also called the seven questions six", "\n".join(lines[s:s + 2]))
    lines = cut(lines, s, s + 2)
    for title, surviving in CODE_ROWS.items():
        s = next(i for i, l in enumerate(lines) if l.startswith("| **%s** |" % title))
        if log:
            record("code", s, s + 1, "Anti-pattern row `%s`, %d words" % (title, words(lines[s:s + 1])), surviving, lines[s])
        lines = cut(lines, s, s + 1)
    for title in CODE_KEPT:
        assert any(l.startswith("| **%s** |" % title) for l in lines), title
    return lines


def context_cut(lines, log):
    s = next(i for i, l in enumerate(lines) if l.startswith("Use exact tools when the query gives exact evidence handles"))
    e = s
    while not lines[e].startswith("7. **Unavailable tool**"):
        e += 1
    start = s
    while lines[start - 1] == "":
        start -= 1
    end = e + 1
    assert lines[start - 1] == "---" and lines[end] == "" and lines[end + 1] == "---", "context layout"
    if log:
        record("context", start, end + 2, "Routing list after the anti-pattern table, %d words" % words(lines[start:end + 2]),
               "`Query Routing Matrix` in section 2 has a row for each of items 1 to 6, the matrix says `widen the pattern before concluding`, and item 7 is the second and third bullet of `Denied Capability Guard`", "\n".join(lines[start:end + 2]))
    # Keep the rule line above and one blank after it.
    return lines[:start] + [""] + lines[end + 2:] if lines[end + 2] != "" else lines[:start] + lines[end + 2:]


def block_align(name, lines, log):
    if name == "design":
        s = next(i for i, l in enumerate(lines) if l.startswith("**Hook-Injected Advisor Context**"))
        e = s
        while lines[e] != "":
            e += 1
        old = lines[s:e]
        assert " ".join(old).split() == " ".join(BLOCK).split(), "design words differ"
        if log:
            record(name, s, e, "Advisor block, wrapped at a different width", "Replaced by the shared block. The words are the same, only the line breaks differ", "\n".join(old))
        return lines[:s] + BLOCK + lines[e:]
    if name == "markdown":
        s = next(i for i, l in enumerate(lines) if l.startswith("Treat hook-injected skill-advisor recommendations as routing hints only."))
        old = lines[s]
        assert old.split() == " ".join(BLOCK).split()[3:], "markdown words differ"
        if log:
            record(name, s, s + 1, "Advisor block, on one line and without its label", "Replaced by the shared block. The words are the same, and the label `**Hook-Injected Advisor Context**:` is added", old)
        return lines[:s] + BLOCK + lines[s + 1:]
    return lines


def plan(tree, name, log):
    lines = open(os.path.join(ROOT, tree, "agents", name + ".md")).read().split("\n")
    lines = block_align(name, lines, log)
    if name == "code":
        lines = code_cut(lines, log)
    if name == "context":
        lines = context_cut(lines, log)
    lines = summary_cut(name, lines, log)
    assert "\n".join(BLOCK) in "\n".join(lines), name + " lacks the shared block"
    return lines


total = 0
stats = []
for name in AGENTS:
    for tree in (".skilled", ".claude"):
        out = plan(tree, name, tree == ".skilled")
        d = os.path.join(EXPECT, tree.strip("."))
        os.makedirs(d, exist_ok=True)
        open(os.path.join(d, name + ".md"), "w").write("\n".join(out))
        if tree == ".skilled":
            before = words(open(os.path.join(ROOT, tree, "agents", name + ".md")).read().split("\n"))
            total += words(out)
            stats.append((name, before, words(out)))

doc = ["# Removal map: every block this phase removes, written before any cut", "",
       "Each row names the block and the line that still carries its rule, or the reason it carried no instruction. The full text of each block follows the table, so a removed block can be restored from this file.", "",
       "| ID | File | Lines before the cut | Block | Surviving line, or why it carried no instruction |", "|---|---|---|---|---|"]
for rid, name, span, what, surviving in rows:
    doc.append("| %s | `%s.md` | %s | %s | %s |" % (rid, name, span, what, surviving.replace("|", "\\|")))
doc += ["", "## Rows of the `code.md` anti-pattern table that stay", "",
        "A row stays when no other line of the file states its case. They are marked `kept, unique`.", ""]
notes = {"Premature abstraction during implementation": "no rule in section 10 names abstraction",
         "Cargo culting from neighbor files": "the NEVER line names the habit, the row alone lists what to check: stack, lifecycle, data shape and error contract",
         "Skill-load-without-applying": "the row alone names the failure of reading the skill and not extracting its route"}
for title in CODE_KEPT:
    doc.append("- `%s`: kept, unique, because %s" % (title, notes[title]))
doc += ["", "## Full text of each removed block", ""]
for rid, text in quotes:
    doc += ["### " + rid, "", "~~~text", text, "~~~", ""]
open(os.path.join(SCRATCH, "removal-map.md"), "w").write("\n".join(doc))
print("rows", len(rows))
for name, before, after in stats:
    print("%-16s %6d -> %6d" % (name, before, after))
print("total after", total)
