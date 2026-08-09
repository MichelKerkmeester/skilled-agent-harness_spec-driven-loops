//! Budget and limits.
//!
//! > *"Put budget in the state. Tokens, dollars, and wall-clock time live in the
//! > state object and get enforced at edges."*
//!
//! Declared per node and per graph; actuals recorded at `done`; enforced at
//! `claim`. Overflow at plan time is a **check error, not a runtime surprise**
//! (spec 01 §5, spec 06 §5).

use serde::{Deserialize, Serialize};

use crate::refusal::{Refusal, RefusalCode, Suggestion};

/// A budget in three dimensions. `None` means "not constrained on this axis".
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq, Serialize, Deserialize)]
pub struct Budget {
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tokens: Option<u64>,
    /// Micro-USD, so money is integer arithmetic and never a float.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub micros_usd: Option<u64>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub wall_ms: Option<u64>,
}

/// Which dimension of a budget an operation ran into.
#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum Dimension {
    Tokens,
    MicrosUsd,
    WallMs,
}

impl Dimension {
    pub fn as_str(&self) -> &'static str {
        match self {
            Dimension::Tokens => "tokens",
            Dimension::MicrosUsd => "micros_usd",
            Dimension::WallMs => "wall_ms",
        }
    }
}

impl Budget {
    pub const UNLIMITED: Budget = Budget { tokens: None, micros_usd: None, wall_ms: None };

    pub fn tokens(n: u64) -> Self {
        Self { tokens: Some(n), ..Default::default() }
    }

    /// Sum, treating `None` as unconstrained: unconstrained plus anything is
    /// unconstrained, which is what makes an unbounded node visible in a
    /// graph-level check rather than silently absorbed.
    pub fn saturating_add(self, other: Budget) -> Budget {
        fn add(a: Option<u64>, b: Option<u64>) -> Option<u64> {
            match (a, b) {
                (Some(x), Some(y)) => Some(x.saturating_add(y)),
                _ => None,
            }
        }
        Budget {
            tokens: add(self.tokens, other.tokens),
            micros_usd: add(self.micros_usd, other.micros_usd),
            wall_ms: add(self.wall_ms, other.wall_ms),
        }
    }

    /// Does `self` fit within `cap`? Returns the first dimension that does not.
    pub fn fits_within(&self, cap: &Budget) -> Result<(), Dimension> {
        fn check(mine: Option<u64>, cap: Option<u64>, d: Dimension) -> Result<(), Dimension> {
            match (mine, cap) {
                (None, Some(_)) => Err(d),
                (Some(m), Some(c)) if m > c => Err(d),
                _ => Ok(()),
            }
        }
        check(self.tokens, cap.tokens, Dimension::Tokens)?;
        check(self.micros_usd, cap.micros_usd, Dimension::MicrosUsd)?;
        check(self.wall_ms, cap.wall_ms, Dimension::WallMs)?;
        Ok(())
    }
}

/// Recorded consumption. Always concrete — you cannot spend an unknown amount.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq, Serialize, Deserialize)]
pub struct Spend {
    #[serde(default)]
    pub tokens: u64,
    #[serde(default)]
    pub micros_usd: u64,
    #[serde(default)]
    pub wall_ms: u64,
}

impl std::ops::Add for Spend {
    type Output = Spend;

    fn add(self, other: Spend) -> Spend {
        Spend {
            tokens: self.tokens.saturating_add(other.tokens),
            micros_usd: self.micros_usd.saturating_add(other.micros_usd),
            wall_ms: self.wall_ms.saturating_add(other.wall_ms),
        }
    }
}

impl Spend {
    pub fn plus(self, other: Spend) -> Spend {
        self + other
    }

    /// Would admitting `next` exceed `cap` given what has already been spent?
    ///
    /// Names the dimension, so the refusal is actionable rather than "budget
    /// exhausted".
    pub fn admits(self, next: Spend, cap: &Budget) -> Result<(), Dimension> {
        let after = self + next;
        if let Some(c) = cap.tokens {
            if after.tokens > c {
                return Err(Dimension::Tokens);
            }
        }
        if let Some(c) = cap.micros_usd {
            if after.micros_usd > c {
                return Err(Dimension::MicrosUsd);
            }
        }
        if let Some(c) = cap.wall_ms {
            if after.wall_ms > c {
                return Err(Dimension::WallMs);
            }
        }
        Ok(())
    }

    /// Refusal for an exhausted dimension, carrying the numbers.
    pub fn refuse(dimension: Dimension, limit: u64, actual: u64) -> Refusal {
        Refusal::new(
            RefusalCode::BudgetExhausted,
            Suggestion::ReduceScopeOrRaiseBudget,
            format!("the graph's `{}` budget is exhausted", dimension.as_str()),
        )
        .with_detail(crate::refusal::Detail {
            dimension: Some(dimension.as_str().to_string()),
            limit: Some(limit),
            actual: Some(actual),
            ..Default::default()
        })
    }
}

/// Structural caps. **The task-graph guardrails, made mechanical** — a plan
/// exceeding any of these fails `check` at authoring time, never mid-run at
/// node 500 (spec 01 §7).
#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct Limits {
    pub max_nodes: u32,
    pub max_concurrency: u32,
    /// Per loop.
    pub max_rounds: u32,
    pub max_depth: u32,
    /// Per `forEach` expansion.
    pub max_for_each: u32,
    /// Spawned agents, per graph.
    pub max_spawn: u32,
}

impl Default for Limits {
    fn default() -> Self {
        Self {
            max_nodes: 500,
            max_concurrency: 16,
            max_rounds: 3,
            max_depth: 20,
            max_for_each: 200,
            max_spawn: 64,
        }
    }
}

impl Limits {
    pub fn exceeded(what: &str, limit: u64, actual: u64) -> Refusal {
        Refusal::new(
            RefusalCode::LimitExceeded,
            Suggestion::ReduceScopeOrRaiseBudget,
            format!("`{what}` limit exceeded: {actual} > {limit}"),
        )
        .with_detail(crate::refusal::Detail {
            dimension: Some(what.to_string()),
            limit: Some(limit),
            actual: Some(actual),
            ..Default::default()
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn unconstrained_plus_anything_is_unconstrained() {
        let a = Budget::tokens(100);
        let b = Budget::UNLIMITED;
        assert_eq!(a.saturating_add(b).tokens, None);
    }

    #[test]
    fn an_unbounded_node_cannot_fit_a_bounded_graph() {
        let child = Budget::UNLIMITED;
        let cap = Budget::tokens(1_000);
        assert_eq!(child.fits_within(&cap), Err(Dimension::Tokens));
    }

    #[test]
    fn fits_within_names_the_failing_dimension() {
        let child = Budget { tokens: Some(10), micros_usd: Some(999), wall_ms: None };
        let cap = Budget { tokens: Some(100), micros_usd: Some(500), wall_ms: None };
        assert_eq!(child.fits_within(&cap), Err(Dimension::MicrosUsd));
    }

    #[test]
    fn spend_admission_names_the_dimension() {
        let so_far = Spend { tokens: 900, ..Default::default() };
        let cap = Budget::tokens(1_000);
        assert!(so_far.admits(Spend { tokens: 100, ..Default::default() }, &cap).is_ok());
        assert_eq!(
            so_far.admits(Spend { tokens: 101, ..Default::default() }, &cap),
            Err(Dimension::Tokens)
        );
    }

    #[test]
    fn budget_refusal_carries_the_numbers() {
        let r = Spend::refuse(Dimension::Tokens, 1_000, 1_050);
        assert_eq!(r.code, RefusalCode::BudgetExhausted);
        let d = r.detail().unwrap();
        assert_eq!(d.limit, Some(1_000));
        assert_eq!(d.actual, Some(1_050));
        assert_eq!(d.dimension.as_deref(), Some("tokens"));
    }

    #[test]
    fn money_is_integer_arithmetic() {
        let s = Spend { micros_usd: 1, ..Default::default() }
            + Spend { micros_usd: 2, ..Default::default() };
        assert_eq!(s.micros_usd, 3);
    }
}
