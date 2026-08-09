//! Time, without a clock.
//!
//! `graphene-core` never reads the system clock. Time enters only as event
//! payload, because a fold that consults wall-clock time is not replayable
//! (spec 03 §6).
//!
//! Two axes, and conflating them is a common and expensive error (spec 02 §8):
//!
//! - [`Seq`] — the logical clock. "What did we believe when node X ran?"
//! - [`Timestamp`] — wall time supplied by a caller. "What was true on 3 March?"

use std::fmt;

use serde::{Deserialize, Serialize};

/// The logical clock: a monotonic per-store event sequence number.
///
/// Assigned by the store on append, never by the caller, and the only ordering
/// the fold ever relies on.
#[derive(
    Clone, Copy, Debug, Default, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize,
)]
#[serde(transparent)]
pub struct Seq(pub u64);

impl Seq {
    pub const ZERO: Seq = Seq(0);

    pub fn next(self) -> Seq {
        Seq(self.0 + 1)
    }
}

impl fmt::Display for Seq {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.0)
    }
}

/// Wall-clock time in milliseconds since the Unix epoch, **always supplied by a
/// caller**. Core never produces one.
#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
#[serde(transparent)]
pub struct Timestamp(pub i64);

impl Timestamp {
    pub fn millis(&self) -> i64 {
        self.0
    }
}

impl fmt::Display for Timestamp {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.0)
    }
}

/// When a fact was true in the world.
///
/// A source that cannot supply one gets `imputed: true` — **never a silent
/// default**, because a silently imputed timestamp makes "what was true on
/// 3 March" quietly wrong (spec 02 §8).
#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct ObservedAt {
    pub at: Timestamp,
    /// True when the caller could not supply a real observation time and this
    /// was filled from `recorded_at`.
    #[serde(default)]
    pub imputed: bool,
}

impl ObservedAt {
    pub fn observed(at: Timestamp) -> Self {
        Self { at, imputed: false }
    }

    /// Explicitly marked as filled in because the source has no notion of
    /// observation time.
    pub fn imputed(at: Timestamp) -> Self {
        Self { at, imputed: true }
    }
}

/// Ordering of two observations of the same subject.
///
/// **Resolution is by `observed_at`, not by arrival** (spec 02 §8): a
/// later-arriving, earlier-observed fact does not supersede a newer one.
/// Ties break by `Seq` so the result is total and deterministic.
pub fn observation_order(
    a_observed: ObservedAt,
    a_seq: Seq,
    b_observed: ObservedAt,
    b_seq: Seq,
) -> std::cmp::Ordering {
    a_observed.at.cmp(&b_observed.at).then_with(|| a_seq.cmp(&b_seq))
}

/// Does `candidate` supersede `existing`?
///
/// Only when it observed the world *later*. An out-of-order delivery of an older
/// observation is recorded but does not overwrite.
pub fn supersedes(
    candidate_observed: ObservedAt,
    candidate_seq: Seq,
    existing_observed: ObservedAt,
    existing_seq: Seq,
) -> bool {
    observation_order(candidate_observed, candidate_seq, existing_observed, existing_seq)
        == std::cmp::Ordering::Greater
}

/// A validity interval, closed when a superseding observation arrives.
#[derive(Clone, Copy, Debug, PartialEq, Eq, Default, Serialize, Deserialize)]
pub struct Validity {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub until: Option<Timestamp>,
}

impl Validity {
    pub fn open() -> Self {
        Self { until: None }
    }
    pub fn closed_at(t: Timestamp) -> Self {
        Self { until: Some(t) }
    }
    pub fn is_open(&self) -> bool {
        self.until.is_none()
    }
}

/// A lease deadline.
///
/// **Expiry is evaluated against a clock supplied at query time and is never
/// stored as state** (spec 04 §2.2) — otherwise the fold would depend on
/// wall-clock and stop being replayable.
#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct Deadline(pub Timestamp);

impl Deadline {
    /// `now` is passed in by the caller. Core never asks what time it is.
    pub fn is_expired_at(&self, now: Timestamp) -> bool {
        now.0 >= self.0 .0
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn later_observation_supersedes() {
        let old = ObservedAt::observed(Timestamp(1_000));
        let new = ObservedAt::observed(Timestamp(2_000));
        assert!(supersedes(new, Seq(2), old, Seq(1)));
    }

    #[test]
    fn out_of_order_arrival_does_not_supersede() {
        // Arrives later (higher seq) but observed the world earlier.
        let earlier_observation = ObservedAt::observed(Timestamp(1_000));
        let newer_observation = ObservedAt::observed(Timestamp(2_000));
        assert!(!supersedes(
            earlier_observation,
            Seq(9), // arrived last
            newer_observation,
            Seq(1), // arrived first
        ));
    }

    #[test]
    fn equal_observation_times_break_by_seq() {
        let t = ObservedAt::observed(Timestamp(1_000));
        assert!(supersedes(t, Seq(2), t, Seq(1)));
        assert!(!supersedes(t, Seq(1), t, Seq(2)));
    }

    #[test]
    fn imputed_is_explicit() {
        assert!(!ObservedAt::observed(Timestamp(1)).imputed);
        assert!(ObservedAt::imputed(Timestamp(1)).imputed);
    }

    #[test]
    fn deadlines_need_a_caller_supplied_now() {
        let d = Deadline(Timestamp(500));
        assert!(!d.is_expired_at(Timestamp(499)));
        assert!(d.is_expired_at(Timestamp(500)));
        assert!(d.is_expired_at(Timestamp(501)));
    }
}
