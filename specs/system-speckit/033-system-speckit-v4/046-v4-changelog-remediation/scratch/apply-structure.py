#!/usr/bin/env python3
"""046 structural pass: apply the 045 report's Sections 7/9/10-D to the corrected changelog.

045 precedent: the script refuses to write unless the input still hashes to the copy the
line numbers came from, and refuses unless the post-shape matches the composed expectation.
Line numbers are 1-indexed against the corrected 747-line file
(sha256 6e28071fd0c1f66b69947c00ff786981d62983314d474df3aee2cbfe532107ea).
"""
import hashlib
import sys
from collections import Counter
from pathlib import Path

TARGET = Path("specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md")

EXPECTED_SHA256 = "6e28071fd0c1f66b69947c00ff786981d62983314d474df3aee2cbfe532107ea"
EXPECTED_LINES = 747
# pre-shape (the pinned baseline, unchanged by the correction pass)
EXP_H2, EXP_H4, EXP_SEP, EXP_NBSP = 18, 56, 19, 44

def counts(lines):
    c = Counter()
    for ln in lines:
        if ln.startswith("## "):
            c["h2"] += 1
        elif ln.startswith("#### "):
            c["h4"] += 1
        elif ln == "---":
            c["sep"] += 1
        elif ln.startswith("&nbsp;"):
            c["nbsp"] += 1
    return c["h2"], c["h4"], c["sep"], c["nbsp"]

raw = TARGET.read_text()
lines = raw.split("\n")
if lines and lines[-1] == "":
    lines = lines[:-1]  # drop the trailing-newline phantom

sha = hashlib.sha256(raw.encode()).hexdigest()
assert sha == EXPECTED_SHA256, f"sentinel: expected {EXPECTED_SHA256[:16]}, got {sha[:16]}"
assert len(lines) == EXPECTED_LINES, f"lines: expected {EXPECTED_LINES}, got {len(lines)}"
h2, h4, sep, nbsp = counts(lines)
assert (h2, h4, sep, nbsp) == (EXP_H2, EXP_H4, EXP_SEP, EXP_NBSP), \
    f"pre-shape: got H2={h2} H4={h4} sep={sep} nbsp={nbsp}"

L = {i + 1: ln for i, ln in enumerate(lines)}  # 1-indexed access

def expect(n, prefix):
    assert L[n].startswith(prefix), f"anchor: L{n} = {L[n][:60]!r} does not start with {prefix!r}"

# ── content anchors (the corrected lines the ranges depend on) ──────────────
expect(1, "---")
expect(11, "This release is about shape.")
expect(13, "The failure paths got the same care.")
expect(15, "Most of this does not change how you call the system.")
expect(17, "- **The memory database is gone.**")
expect(18, "- **The `/interface:*` commands are now `/design:*`")
expect(22, "## What's New at a Glance")
expect(25, "- **Specs at the top level.**")
expect(37, "- **Sign in, not API keys.**")
expect(40, "- **Docs that make anything.**")
expect(41, "- **One code skill, two axes.**")
expect(42, "- **Safer git.**")
expect(44, "- **Every bridge, one hub.**")
expect(52, "- **Gate 3 asks four options.**")
expect(58, "Most of the framework's skills stopped standing alone")
expect(60, "Six families made the move:")
expect(62, "The reasons for the hubs that stuck are practical:")
expect(64, "- **One place to maintain**")
expect(69, "None of this was hand-assembled.")
expect(73, "## Spec Kit")
expect(158, "The Spec-Kit Check workflow fires on every mirror source")
expect(162, "## The Skill Advisor")
expect(196, "Codex sessions now launch the advisor under the Node runtime")
expect(200, "## Documentation as a System")
expect(202, "The doc skill grew up.")
expect(204, "#### Parent Skills, Nested Modes and the Tool That Builds Them")
expect(206, "Two shapes of skill exist now.")
expect(208, "A mode is one of two kinds:")
expect(210, "- a workflow packet that does work")
expect(211, "- a read-only surface packet that only supplies evidence")
expect(213, "`sk-doc` is the worked example.")
expect(215, "`sk-doc` is also where the shape itself comes from.")
expect(219, "A few names you type changed.")
expect(221, "&nbsp;")
expect(248, "The Human Voice Rules moved into their own")
expect(252, "## The Deep Loops, Unified and Extended")
expect(304, "Every ledger mode is now on the authoritative path.")
expect(308, "## Orchestrating Other AIs")
expect(375, "#### Pi Dispatches Pi")
expect(377, "Pi removed its subagents feature during the cycle")
expect(379, "This is the one carve-out from the self-invocation rule")
expect(381, "&nbsp;")
expect(383, "#### A Closed Roster")
expect(385, "Pi reaches six authenticated providers")
expect(387, "One deliberate asymmetry is worth knowing")
expect(391, "#### The Cache Extension Learned What Caching Costs")
expect(408, "The gateway behind Pi's DeepSeek and GLM routes is DevPass")
expect(410, "They can be measured, and were, across thirteen requests")
expect(417, "The gap between those two is the part worth carrying away")
expect(419, "Same extension, same optimisation, roughly half the value")
expect(427, "That is the standalone bridge only.")
expect(431, "## Hooks, Goals and the Runtime")
expect(468, "The Gate-3 spec question also stays quiet on read-only turns")
expect(472, "## The Design Surface")
expect(489, "One honest caveat. The other six hubs resolve through a compiled router contract first.")
expect(525, "## One Code Skill")
expect(556, "Language slicing now covers every language")
expect(560, "## Safer Git")
expect(600, "Also folded in: a command-time advisory surfaces the relevant git rule")
expect(604, "## Prompt Engineering")
expect(618, "The earlier `sk-improve-prompt` to `sk-prompt` skill rename")
expect(622, "## MCP Tooling")
expect(632, "`mcp-webflow` was removed from the hub")
expect(662, "The three former bridges, Figma among them, lost their own")
expect(666, "## Agent Discipline")
expect(687, "Two guards came from watching sessions fail")
expect(691, "## Plain-English Output")
expect(703, "A reply benchmark under `benchmark/reply-harness/` measures the rules")
expect(707, "Projection is off for everyone until you opt in")
expect(711, "## Upgrade Notes")
expect(715, "- **Renames to adopt.**")
expect(716, "- **Repoint what moved.**")
expect(717, "- **Drop removed surfaces.**")
expect(718, "- **Changed defaults.**")
expect(719, "- **Reconcile your own skills.**")
expect(723, "## Internal Seams")
expect(725, "No user-facing change in this section.")
expect(729, "- **Advisor extracted to its own package.**")
expect(736, "- **Root routers replace the shared file.**")
expect(738, "## After This Draft")
assert "doc-quality` to `create-quality-control`" in L[715], "L715: F-011 anchor missing"
assert "upgrading-a-skill-to-v4.md" in L[719], "L719: adopter-guide anchor missing"

# ── the composed pieces (T) ──────────────────────────────────────────────────
GLANCE = [
    L[25],  # Specs at the top level (verbatim)
    "- **Gate 3 asks four options.** Existing, New, Related and Skip.",
    "- **Deep loops, one home.** Research, review, ai-council, agent-improvement and the benchmark run as one skill, on any executor you name, several in parallel, with every run replayable from a typed evidence ledger.",
    "- **Fan-outs never rewind your files.** A lane that writes outside its own directory leaves your tree exactly as it was and drops a copy of what it wrote into a quarantine you can read.",
    "- **Two hubs graduated.** `cli-jev` answers judgment questions through the `jev` CLI, and `cli-orca` bridges Orca's eight official skills. Both are standalone skills now.",
    L[37],  # Sign in, not API keys (verbatim)
    L[41],  # One code skill, two axes (verbatim)
    L[44],  # Every bridge, one hub (verbatim)
    "- **Design becomes a hub.** `sk-design` went from one skill to a parent of four modes.",
    L[40],  # Docs that make anything (verbatim)
    "- **One prompt skill.** Prompt work lives in `sk-prompt`, a standalone skill with seven frameworks behind `/prompt:improve`.",
    "- **A local vision skill.** `sk-vision` reads screenshots for text-only models through a private Moondream runtime, off by default, on demand through `/vision`.",
    "- **Goals live in the packet.** A session binds to a spec packet and that packet's `goal.md` is the goal, on OpenCode, Pi, Cursor and Devin alike.",
    L[42],  # Safer git (verbatim)
    "- **Plain-English replies, by opt-in.** The projection lane rewrites terse CLI output into readable prose. Nothing rewrites rewrites your output until you flip the switch.",
]

MCP_ORCA_TAIL = " The Orca bridge took the opposite road later in the cycle: it left the hub as a mode and now ships as the standalone `cli-orca` skill."
DESIGN_CAVEAT = "One honest caveat. The other six hubs resolve through a compiled router contract first. This hub's routing is still the registry and the root router alone, with the compiled closure planned, not shipped."
UP715 = L[715].replace(
    "`doc-quality` to `create-quality-control`",
    "`/doc:quality` to the `sk-create-quality-control` packet (the old command is gone)",
)
assert UP715 != L[715], "L715 F-011 replace did not fire"
UP716 = L[716].replace(
    "- **Repoint what moved.** `specs` went from",
    "- **Repoint what moved.** The tracked source root now lives under `.skilled/`. `specs` went from",
)
assert UP716 != L[716], "L716 lead replace did not fire"
UP719 = "- **Reconcile your own skills.** A step-by-step guide with the decision rule, the single-to-parent procedure using `/create:skill-parent` and the validation steps lives at `sk-create-skill/references/skill/upgrading-a-skill-to-v4.md`."
APPENDIX_LEDGER = "- **The evidence ledger, its protocol and its admission checks.** The deep-loop ledger, protocol and admission work landed after this document's draft. The deep-loop runtime's own records are the durable history."
APPENDIX_PATHS = "The `.opencode/` spellings in this document are not uniform. The skills, agents and commands trees still answer at their `.opencode/` paths through tracked symlinks into `.skilled/`, the tracked sources themselves live under `.skilled/`, and `.opencode/bin` and `.opencode/hooks` are gone. Read those two from their `.skilled/` locations."

# ── assemble ─────────────────────────────────────────────────────────────────
out = []
def rng(a, b):  # inclusive 1-indexed range, verbatim
    out.extend(L[i] for i in range(a, b + 1))
def item(text):
    out.append(text)
def gap():
    item("")

# head: frontmatter, H1, intro (with the two breaking bullets), unchanged
rng(1, 19)
gap()
item("## Why This Release")
gap()
item(L[58]); gap()          # the merged One Shape thesis, mood sentence already cut
item(L[60]); gap()          # six families made the move
item(L[206]); gap()         # two shapes of skill exist now (moved from Documentation)
item(L[208]); gap()         # a mode is one of two kinds:
item(L[210]); item(L[211]); gap()
item(L[62]); gap()          # the reasons for the hubs that stuck
item(L[64]); item(L[65]); item(L[66]); item(L[67]); gap()
item(L[69])                 # none of this was hand-assembled ... sections below
gap(); item("---"); gap()

item("## What's New at a Glance")
gap()
out.extend(GLANCE)
gap(); item("---"); gap()

rng(73, 158); gap(); item("---"); gap()      # Spec Kit, untouched, family 1
rng(252, 304); gap(); item("---"); gap()     # The Deep Loops, 2nd
# Orchestrating, 3rd: Pi Dispatches Pi + A Closed Roster folded into one H4;
# the asymmetry paragraph moves to the appendix
item("## Orchestrating Other AIs"); gap()
rng(310, 374); gap()
item("#### A Closed Roster"); gap()
item(L[377]); gap(); item(L[379]); gap(); item(L[385])
gap(); item("&nbsp;"); gap()
rng(391, 427); gap(); item("---"); gap()

rng(162, 196); gap(); item("---"); gap()     # The Skill Advisor, 4th
rng(525, 556); gap(); item("---"); gap()     # One Code Skill, family 1
# MCP Tooling, family 2: the cli-orca graduation folded in
rng(622, 631); gap()
item(L[632] + MCP_ORCA_TAIL); gap(); item("&nbsp;"); gap()
rng(636, 663); gap(); item("---"); gap()

# The Design Surface, family 3: the double caveat trimmed to one statement
rng(472, 488); gap()
item(DESIGN_CAVEAT); gap(); item("&nbsp;"); gap()
rng(493, 522); gap(); item("---"); gap()

# Documentation as a System, family 4: generic mechanics moved to the WHY,
# the sk-doc instance and the renamed commands stay
item("## Documentation as a System"); gap()
item(L[202]); gap()
item(L[204]); gap()
item(L[213]); gap(); item(L[215]); gap(); item(L[219])
gap(); item("&nbsp;"); gap()
rng(223, 248); gap(); item("---"); gap()

rng(604, 618); gap(); item("---"); gap()     # Prompt Engineering, family 5
rng(431, 468); gap(); item("---"); gap()     # Hooks, Goals and the Runtime
rng(560, 600); gap(); item("---"); gap()     # Safer Git
rng(666, 688); gap(); item("---"); gap()     # Agent Discipline
rng(691, 707); gap(); item("---"); gap()     # Plain-English Output

# Upgrade Notes: F-011 spelling, the .skilled root fact, the adopter pointer
item("## Upgrade Notes"); gap()
item(L[713]); gap()
item(UP715); gap(); item(UP716); gap(); item(L[717]); gap(); item(L[718]); gap(); item(UP719)
gap(); item("---"); gap()

# Appendix: Under the Hood — the two non-repeated seams, the no-owner one-liner,
# the roster asymmetry, and the corrected alias-reading sentence (no "every")
item("## Appendix: Under the Hood"); gap()
item(L[725]); gap()
item(L[729]); gap(); item(L[736]); gap(); item(APPENDIX_LEDGER)
gap()
item(L[387])
gap()  # paragraph to paragraph: blank only, the measured convention needs no spacer here
item(APPENDIX_PATHS)

new_text = "\n".join(out) + "\n"
new_lines = new_text.split("\n")
if new_lines and new_lines[-1] == "":
    new_lines = new_lines[:-1]

# ── post-shape ───────────────────────────────────────────────────────────────
n2, n4, s2, b2 = counts(new_lines)
if (n2, n4, s2, b2) != (17, 55, 18, 43):
    def by_sec(ls):
        cur, d = "<head>", {}
        for ln in ls:
            if ln.startswith("## "):
                cur = ln[3:].strip()
            if ln.startswith("&nbsp;"):
                d[cur] = d.get(cur, 0) + 1
        return d
    print("nbsp/section OLD:", by_sec(lines))
    print("nbsp/section NEW:", by_sec(new_lines))
    assert (n2, n4, s2, b2) == (17, 55, 18, 43), f"post-shape: H2={n2} H4={n4} sep={s2} nbsp={b2}"

titles = [ln[3:] for ln in new_lines if ln.startswith("## ")]
EXPECTED_TITLES = [
    "Why This Release", "What's New at a Glance", "Spec Kit",
    "The Deep Loops, Unified and Extended", "Orchestrating Other AIs", "The Skill Advisor",
    "One Code Skill", "MCP Tooling", "The Design Surface", "Documentation as a System",
    "Prompt Engineering", "Hooks, Goals and the Runtime", "Safer Git",
    "Agent Discipline", "Plain-English Output", "Upgrade Notes", "Appendix: Under the Hood",
]
assert titles == EXPECTED_TITLES, f"H2 order: {titles}"

joined = "\n".join(new_lines)
for gone in ("You feel this change", "One Shape for Every Skill\n## ", "## After This Draft",
             "266 commits", "178 recommendations", "102 relative", "28KB command",
             "3,000-line", "#### Pi Dispatches Pi", "And Where It Is Narrower"):
    assert gone not in joined, f"expected gone: {gone!r}"
assert joined.count("496 lines to 284") == 1, "496->284: only the Agent Discipline body survives"
assert joined.count("eighteen of the twenty-two") == 1, "18-of-22: only the Hermes body survives"
for there in ("## Why This Release", "## Appendix: Under the Hood", "#### A Closed Roster",
              "cli-orca` skill", "upgrading-a-skill-to-v4.md", "tracked source root now lives under `.skilled/`",
              "run replayable from a typed evidence ledger", "read those two from their `.skilled/` locations",
              "mcp-figma", "`/interface:*` to `/design:extract`"):
    assert there in joined, f"expected present: {there!r}"
assert joined.count("`cli-orca` skill") == 1, "cli-orca graduation: exactly one"

# every &nbsp; still sits directly between a content block and the next heading/blank
bad = [i + 1 for i, ln in enumerate(new_lines)
       if ln.startswith("&nbsp;") and (i > 0 and new_lines[i - 1] != "" or i + 1 < len(new_lines) and new_lines[i + 1] != "")]
assert not bad, f"&nbsp; sandwich: {bad}"

# the non-%% walls must still be zero (045 census: prose line = >4 sentences or >500 chars)
import re
def sentences(t):
    return len(re.findall(r"[.!?](?:\s|$)", t))
walls = 0
in_fence = False
for ln in new_lines:
    if ln.startswith("```"):
        in_fence = not in_fence
        continue
    if in_fence or not ln.strip():
        continue
    if ln.startswith("#") or ln.startswith("-") or ln.startswith("|") or ln.startswith("&nbsp;") or ln.startswith("---"):
        continue
    if sentences(ln) > 4 or len(ln) > 500:
        walls += 1
assert walls == 0, f"walls: {walls}"

TARGET.write_text(new_text)
print(f"OK: wrote {TARGET} — {len(new_lines)} lines, H2={n2} H4={n4} sep={s2} nbsp={b2}, walls=0")
