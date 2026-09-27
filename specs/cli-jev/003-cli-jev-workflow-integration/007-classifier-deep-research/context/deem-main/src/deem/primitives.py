"""Core value types for Deem.

Deem is a System One ("machine reflexes") decision model: given a state and
a set of typed questions it returns typed, calibrated decisions instead of
free text.  This module defines the frozen value objects shared by the prompt
builder (:mod:`deem.format`), the debiasing helpers (:mod:`deem.debias`)
and the training/eval pipelines.

Question types map 1:1 onto the three Deem primitives:

* :class:`ChoiceQuestion` — pick one of 2–255 supplied options.
* :class:`ScoreQuestion`  — rate against 2–10 ordered descriptive levels.
* :class:`NoulQuestion`   — probability that a proposition is true.

Result types mirror the wire contract of ``POST /v1/systemone``.

All types are plain frozen dataclasses with no runtime dependencies beyond
the Python 3.10 standard library.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import (
    Iterator,
    Mapping,
    Optional,
    Union,
)

__all__ = [
    "MAX_OPTIONS",
    "MAX_LEVELS",
    "DeemError",
    "ChoiceQuestion",
    "NoulQuestion",
    "ScoreQuestion",
    "QuestionSet",
    "ChoiceResult",
    "NoulResult",
    "ScoreResult",
    "AnyQuestion",
    "AnyResult",
]

#: Documented cardinality cap (Jev-compatible): a question may present at most
#: 255 lettered options (indices 0..254).
MAX_OPTIONS = 255

#: Ordered descriptive levels are linguistic, not reliably orderable; the cap
#: is low on purpose.
MAX_LEVELS = 10


class DeemError(ValueError):
    """Raised when a Deem value object is constructed with invalid data."""


def _check_text(value: object, name: str) -> str:
    if not isinstance(value, str):
        raise TypeError(f"{name} must be str, got {type(value).__name__}")
    if not value:
        raise DeemError(f"{name} must be a non-empty string")
    return value


def _check_labels(
    values: object, name: str, min_count: int, max_count: int
) -> list:
    if isinstance(values, str) or not isinstance(values, (list, tuple)):
        raise TypeError(f"{name} must be a list of strings")
    labels = list(values)
    if not (min_count <= len(labels) <= max_count):
        raise DeemError(
            f"{name} must contain between {min_count} and {max_count} "
            f"entries, got {len(labels)}"
        )
    seen = set()
    for label in labels:
        if not isinstance(label, str):
            raise TypeError(f"{name} entries must be str, got {type(label).__name__}")
        if not label:
            raise DeemError(f"{name} entries must be non-empty strings")
        if "\n" in label:
            # The prompt format is line-oriented; a newline inside an option
            # or level text would make the lettered-option block ambiguous.
            raise DeemError(f"{name} entries must not contain newlines")
        if label in seen:
            raise DeemError(f"{name} entries must be unique, got duplicate {label!r}")
        seen.add(label)
    return labels


@dataclass(frozen=True)
class ChoiceQuestion:
    """Pick exactly one option from a supplied list of 2–255 options.

    ``criteria`` is free-form metadata (e.g. ``{"max_latency_s": 30}``); it
    never appears in the rendered prompt.
    """

    instructions: str
    options: list
    criteria: Optional[dict] = None

    def __post_init__(self) -> None:
        object.__setattr__(
            self, "instructions", _check_text(self.instructions, "instructions")
        )
        object.__setattr__(
            self, "options", _check_labels(self.options, "options", 2, MAX_OPTIONS)
        )
        if self.criteria is not None:
            if not isinstance(self.criteria, dict):
                raise TypeError("criteria must be a dict or None")
            object.__setattr__(self, "criteria", dict(self.criteria))


@dataclass(frozen=True)
class NoulQuestion:
    """Probability that a proposition is true. Read out as a value in [0, 1]."""

    instructions: str

    def __post_init__(self) -> None:
        object.__setattr__(
            self, "instructions", _check_text(self.instructions, "instructions")
        )


@dataclass(frozen=True)
class ScoreQuestion:
    """Rate against 2–10 ordered descriptive levels.

    ``levels`` is ordered from lowest to highest by convention; the caller
    supplies the ordering and the expected score is computed over the
    0-based indices of that ordering.
    """

    instructions: str
    levels: list

    def __post_init__(self) -> None:
        object.__setattr__(
            self, "instructions", _check_text(self.instructions, "instructions")
        )
        object.__setattr__(
            self, "levels", _check_labels(self.levels, "levels", 2, MAX_LEVELS)
        )


AnyQuestion = Union[ChoiceQuestion, NoulQuestion, ScoreQuestion]


@dataclass(frozen=True)
class QuestionSet:
    """An ordered collection of questions keyed by caller-supplied id.

    The insertion order of ``mapping`` defines the prompt's question order and
    therefore the answer-slot indices (question *k* — 1-based — gets
    ``Answer k: (``).  Behaves as a read-only mapping.
    """

    mapping: dict

    @classmethod
    def of(cls, **mapping: AnyQuestion) -> "QuestionSet":
        """Convenience constructor: ``QuestionSet.of(route=q1, triage=q2)``."""
        return cls(mapping)

    def __post_init__(self) -> None:
        if not isinstance(self.mapping, Mapping):
            raise TypeError("mapping must be a dict of question id -> question")
        mapping = dict(self.mapping)
        if not mapping:
            raise DeemError("QuestionSet must contain at least one question")
        for qid, question in mapping.items():
            _check_text(qid, "question id")
            if not isinstance(question, (ChoiceQuestion, NoulQuestion, ScoreQuestion)):
                raise TypeError(
                    f"question {qid!r} has unsupported type "
                    f"{type(question).__name__}"
                )
        object.__setattr__(self, "mapping", mapping)

    # -- mapping protocol -------------------------------------------------
 #

    def __getitem__(self, key: str) -> AnyQuestion:
        return self.mapping[key]

    def __iter__(self) -> Iterator[str]:
        return iter(self.mapping)

    def __len__(self) -> int:
        return len(self.mapping)

    def __contains__(self, key: object) -> bool:
        return key in self.mapping

    def keys(self):
        return self.mapping.keys()

    def values(self):
        return self.mapping.values()

    def items(self):
        return self.mapping.items()


@dataclass(frozen=True)
class ChoiceResult:
    """Result for a Choice question: chosen option text, full calibrated
    distribution over option texts, and derived confidence."""

    choice: str
    probabilities: dict
    confidence: float


@dataclass(frozen=True)
class NoulResult:
    """Result for a Noul question: probability the proposition is true."""

    value: float


@dataclass(frozen=True)
class ScoreResult:
    """Result for a Score question.

    ``expected`` is the expected 0-based level index
    (``sum(i * p(level_i))`` over the ordering supplied in the question.
    """

    level: str
    probabilities: dict
    expected: float
    confidence: float


AnyResult = Union[ChoiceResult, NoulResult, ScoreResult]
