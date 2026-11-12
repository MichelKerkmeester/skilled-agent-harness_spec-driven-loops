# Iteration 3: Mechanism A — a gate in AGENTS.md

## Focus

Mechanism A from the candidate list: a gate in `AGENTS.md` that routes a write request into workflow steps. This iteration asks what the text would cost, where it would actually reach, and what it would break — with the reach question settled by the runtime mirrors rather than assumed.

## Actions Taken

1. Read the runtime mirror inventories that state where each runtime takes its instructions (`.claude/README.md`, `.codex/README.md`, `.cursor/README.md`, `.devin/README.md`, `.pi/README.md`, `.pi/SYNC.md`, `.dsh/README.md`).
2. Read `.cursor/rules/skill-routing.md` in full, because Cursor is the runtime whose instruction source is a generated rule rather than `AGENTS.md`.
3. Read `AGENTS.md`'s section markers and measured its shipped/local split.
4. Read `REPO RULES.md`'s preface and trigger-table shape, together with `AGENTS.md` Gate 5 and Gate 6, to compare the two load points.
5. Read the doctor skill's `agents-md` command contract to establish who owns the shipped sections.

## Findings

1. **Six of the seven runtimes load the root `AGENTS.md` natively, so a new gate written there would reach them without a copy.** Claude states the repository has no separate Claude instruction file "so there is no second copy to drift" [SOURCE: .claude/README.md:39], Codex calls it "the shared instruction file for every runtime" [SOURCE: .codex/README.md:39], Devin loads it once the Claude import is off [SOURCE: .devin/README.md:31], Pi loads it "from the working directory and its parents" [SOURCE: .pi/README.md:31] with the loader's candidate list recorded as `AGENTS.override.md`, `AGENTS.md`, `AGENTS.MD`, `CLAUDE.md`, `CLAUDE.MD` [SOURCE: .pi/SYNC.md:93], and DSH lists it as the shared instruction file [SOURCE: .dsh/README.md:131].

2. **Cursor does not: it receives a 2257-byte routing rule and a generated Gate 1 pointer, so any gate outside that pointer block is invisible there.** `.cursor/rules/skill-routing.md` is `alwaysApply: true`, contains routing bullets plus one fenced `spec-kit:gate1-pointer` block generated from the root `AGENTS.md` [SOURCE: .cursor/rules/skill-routing.md:2] [SOURCE: .cursor/rules/skill-routing.md:12] [SOURCE: .cursor/rules/skill-routing.md:20], and the README names it as Cursor's instruction surface — "the routing rule ... Its Gate 1 block is a pointer generated from the root `AGENTS.md`" [SOURCE: .cursor/README.md:39]. The generator is `sync-gate1-pointers.cjs` and it rewrites that one block [SOURCE: .cursor/rules/skill-routing.md:27].

3. **`AGENTS.md` is a shipped artifact, not this repository's private notes: lines 1-295 are shipped by Skilled and only lines 296-300 are repository-owned.** The repo-local block opens and closes on a marker pair and states "/doctor:agents-md keeps every line here; the sections above are shipped by Skilled" [SOURCE: AGENTS.md:296] [SOURCE: AGENTS.md:299]. A new gate written above the marker is therefore a product change restored into every adopting project by the embed/restore engine [SOURCE: .skilled/commands/doctor/agents-md.md:27] [SOURCE: .skilled/skills/system-skilled-doctor/README.md:41].

4. **The resident cost is paid on every session, including sessions that never touch a workflow.** The file is 27,372 bytes across 300 lines, which at the usual 4-bytes-per-token ratio is roughly 6.8k tokens held in context for the session's life. `.cursor/rules/skill-routing.md` at 2257 bytes is the cheap end of the same surface, and `REPO RULES.md` at 12,443 bytes is the middle: it is loaded once, at the first write, only because Gate 5 says so [SOURCE: AGENTS.md:91].

5. **The repository's own precedent is that an `AGENTS.md` gate routes away to a file; it never embeds the steps.** Gate 2 sends the caller to a skill's `ROUTER.md` [SOURCE: AGENTS.md:68], Gate 5 sends the caller to `REPO RULES.md`'s trigger table [SOURCE: AGENTS.md:91], Gate 6 sends the caller to the reply rule files [SOURCE: AGENTS.md:101]. The one gate that does embed a procedure, Gate 3, embeds a question and four labels rather than a workflow.

6. **A write-time routing gate would be the fourth stop-and-ask surface on the same event, and the ordering rules already cost attention.** Gate 3 is a HARD block asked first on any write [SOURCE: AGENTS.md:72], Gate 5 loads rules on the first write of the session [SOURCE: AGENTS.md:91], and the artifact trigger routes the first code and `.md` write through a skill [SOURCE: AGENTS.md:68]. Each already has its own output line the operator can see (`SKILL ROUTING`, `REPO RULES`, and the A/B/C/D question), and a fourth line competes with the same turn's budget.

7. **The trivial-edit exemption would need its own exception, because the existing exemptions are written per gate.** §6 exempts "a trivial fix of a few characters in one file" [SOURCE: AGENTS.md:245] and Gate 5 restates it as "a few characters in one file" [SOURCE: AGENTS.md:99]. A new workflow gate that fired on any write would capture exactly the edits both exemptions release, so it would need a third written exemption or it would contradict them.

8. **A gate is instruction, not enforcement, and this repository already has the vocabulary to say so.** The verification standards treat a claim without observed evidence as inference [SOURCE: AGENTS.md:123], and nothing in the chat path verifies that a routed workflow ran. So the gate's realistic outcome is that the agent either runs the steps or explains why it did not — a visible behavior change, not a guaranteed one.

9. **The cheapest place for the same routing decision already exists and is read only on writes.** `REPO RULES.md` is explicitly "a router, not a rulebook" and matches on the action about to be taken [SOURCE: REPO RULES.md:1] [SOURCE: REPO RULES.md:11], which is the same shape a workflow-routing gate needs, at a load point that is skipped for read-only turns.

## Ruled Out

- Proposing that Cursor be given a full `AGENTS.md` copy: the repository treats divergence between runtimes as drift, and the Cursor README names a single generator for the one generated block [SOURCE: .cursor/README.md:72]. A copy would need a second sync mechanism to stay true.
- Proposing the gate be written inside the repo-local block: that would fix this repository and ship nothing, which cannot answer a question about every chat session.

## Dead Ends

- "Write the gate and let each runtime mirror pick it up": false for Cursor, which reads only its own rule file plus the generated pointer. Any mechanism that relies on `AGENTS.md` alone has a known blind runtime.
- "Make the gate a HARD BLOCK": a hard block on a write that a user asked for turns every documentation edit into a workflow decision, and it contradicts the §6 trivial-edit exemption the framework sells as its low-friction path.

## Edge Cases

- Ambiguous input: "a gate in AGENTS.md" was read as new text in the shipped sections, not as a change to an existing gate's wording. Both were considered later in finding 5, where editing an existing line is shown to be the shape the repo already uses.
- Contradictory evidence: none. Six runtimes read the file and one does not; that is a reach gap, not a conflict.
- Missing dependencies: no Cursor runtime was available to observe live; the rule file and its README were read instead.
- Partial success: no runtime sessions were executed; reach is established from checked-in mirror contracts and generator paths, which is the same evidence the READMEs assert.

## Sources Consulted

- `.claude/README.md:39`, `.codex/README.md:39`, `.cursor/README.md:39`, `:72`, `.devin/README.md:31`, `.pi/README.md:31`, `.pi/SYNC.md:93`, `.dsh/README.md:131`
- `.cursor/rules/skill-routing.md:2`, `:12`, `:20`, `:27`
- `AGENTS.md:68`, `:72`, `:91`, `:99`, `:101`, `:123`, `:245`, `:296`, `:299`
- `REPO RULES.md:1`, `:11`
- `.skilled/commands/doctor/agents-md.md:27`, `.skilled/skills/system-skilled-doctor/README.md:41`

## Assessment

- New information ratio: 0.8
- Questions addressed: For each candidate mechanism (AGENTS.md gate, shared step reference, hook injection, template and validate.sh enforcement, advisor-driven command invocation), what does it cost and what does it break? — the AGENTS.md-gate branch only.
- Questions answered: none fully; the mechanism comparison needs the other four branches, which iterations 4-7 supply.
- Novelty justification: the Cursor reach gap, the shipped/local split and the per-gate exemption pattern are new; the general fact that AGENTS.md is loaded everywhere was already known.

## Reflection

- What worked and why: reading the mirrors rather than the root file settled reach. The root file cannot say who reads it, and the Cursor rule's generated-block comment is the single line that turns "AGENTS.md is universal" into "AGENTS.md plus one pointer".
- What did not work and why: starting from token cost. The cost is real but secondary; the reach gap and the shipped-surface blast radius would each sink the mechanism before cost mattered.
- What I would do differently: read the mirror inventory before the gate text for every mechanism, since the same reach question decides hooks (iteration 6) and command invocation (iteration 7).

## Recommended Next Focus

Mechanism B: a small shared step reference that both paths read — `spec-authoring-card.md` is 9,699 bytes and already carries an Acceptance/Verify pair per section, so the question is whether one more section-level rule is enough and what makes both paths actually load it.
