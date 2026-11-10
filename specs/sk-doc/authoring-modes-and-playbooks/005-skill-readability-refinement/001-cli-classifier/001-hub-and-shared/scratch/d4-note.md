The run ended after three rounds without a pass on one finding: move the README's note that `v0.1.0.0` and `v0.2.0.0` are the Jev hub's releases from before it became mode `cli-jev` into a changelog entry. Declined: the note explains the two oldest rows of the release table directly below it, so it describes what the table holds rather than authoring history, it is unchanged from HEAD, and changelogs are out of this program's scope.

A read of the diff then restored what the fixer had dropped:
- The README, `SKILL.md` and `ROUTER.md` intros, which had been replaced with use-when lines. The router's two-stage routing sentence (the hub picks the mode, this router picks the leaves) is back in its overview, and the README's Purpose again says the current mode answers through the `jev` CLI with a stored key and the hub stays ready for another mode without changing its public identity. The copy of `SKILL.md`'s no-packet-local-logic sentence the fixer had added in section 2 was removed, since the restored intro holds it.
- `router_state: active`, which the fixer had cut from three descriptions of `ROUTER.md`; the router's frontmatter still declares it.

Kept: the shared scripts README gains a structure tree, checked against the folder and listed in `scratch/approved-blocks.md`, and its three helpers each get a list of their facts; the shared README lists its three helpers one per line and gains two related links.
A repair review followed.

The repair run passed at review 6 with the hand fixes intact: the three intros match HEAD, and `router_state: active` is back in all three router descriptions. The eight lines the diff check lists as lost are the relocations described above.

The skill's independent pre-commit review relabelled the shared README's two new links: the hub is "cli-classifier hub", not a packet, and `scripts/README.md` covers all three helpers, so it reads "Shared helper scripts".
