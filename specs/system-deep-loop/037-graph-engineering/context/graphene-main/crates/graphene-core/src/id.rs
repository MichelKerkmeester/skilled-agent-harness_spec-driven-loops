//! Identifiers: self-identifying, content-anchored, deterministic.
//!
//! Three properties, each load-bearing (spec 01 §6):
//!
//! - **Self-identifying.** A user copies a bare id out of the UI into a fresh
//!   agent session with no context. The prefix makes it unmistakable, so the
//!   skill's trigger is reliable.
//! - **Stable across edits.** A node id anchors on `(graph, name)`, not on the
//!   full spec, so editing a node's prompt does not break every reference.
//! - **Deterministic.** Replaying a log reproduces every id, which is what makes
//!   replay diffable and retry idempotent.

use std::fmt;

use data_encoding::BASE32_NOPAD;
use serde::{Deserialize, Deserializer, Serialize, Serializer};

/// Number of hash bytes kept in an id. 16 bytes → 26 base32 characters.
const ID_BYTES: usize = 16;

macro_rules! id_type {
    ($name:ident, $prefix:literal, $doc:literal) => {
        #[doc = $doc]
        #[derive(Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
        pub struct $name(String);

        impl $name {
            pub const PREFIX: &'static str = $prefix;

            /// Wrap an already-formed id, validating its shape.
            pub fn parse(s: &str) -> Result<Self, IdError> {
                if !s.starts_with($prefix) {
                    return Err(IdError::WrongPrefix { expected: $prefix, got: s.to_string() });
                }
                let body = &s[$prefix.len()..];
                if body.len() != encoded_len() {
                    return Err(IdError::BadLength {
                        expected: encoded_len(),
                        got: body.len(),
                        id: s.to_string(),
                    });
                }
                if !body.bytes().all(|b| b.is_ascii_lowercase() || b.is_ascii_digit()) {
                    return Err(IdError::BadAlphabet(s.to_string()));
                }
                Ok(Self(s.to_string()))
            }

            /// Derive from content. Same inputs always yield the same id.
            pub fn derive(parts: &[&[u8]]) -> Self {
                Self(format!("{}{}", $prefix, anchor(parts)))
            }

            pub fn as_str(&self) -> &str {
                &self.0
            }

            /// The part after the prefix.
            pub fn body(&self) -> &str {
                &self.0[$prefix.len()..]
            }
        }

        impl fmt::Display for $name {
            fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
                f.write_str(&self.0)
            }
        }

        impl fmt::Debug for $name {
            fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
                write!(f, "{}({})", stringify!($name), self.0)
            }
        }

        impl Serialize for $name {
            fn serialize<S: Serializer>(&self, s: S) -> Result<S::Ok, S::Error> {
                s.serialize_str(&self.0)
            }
        }

        impl<'de> Deserialize<'de> for $name {
            fn deserialize<D: Deserializer<'de>>(d: D) -> Result<Self, D::Error> {
                let s = String::deserialize(d)?;
                Self::parse(&s).map_err(serde::de::Error::custom)
            }
        }

        impl AsRef<str> for $name {
            fn as_ref(&self) -> &str {
                &self.0
            }
        }
    };
}

id_type!(GraphId, "gg_", "A graph. Roots are seeded, not content-anchored (spec 01 §6).");
id_type!(NodeId, "gn_", "A work node. Anchored on `(graph, name)` so it survives spec edits.");
id_type!(BeliefId, "gb_", "A belief. Anchored on `(graph, content, provenance, source)`.");
id_type!(ClaimId, "gc_", "A claim on a node by a session.");
id_type!(FindingId, "gf_", "A review finding against a node.");
id_type!(NogoodId, "gx_", "A recorded jointly-inconsistent set.");

/// A session identifier. Caller-supplied and opaque — Graphene never derives it,
/// because a session is a worker owned by whoever started it.
#[derive(Clone, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
#[serde(transparent)]
pub struct SessionId(pub String);

impl fmt::Display for SessionId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(&self.0)
    }
}

impl fmt::Debug for SessionId {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "SessionId({})", self.0)
    }
}

/// An actor: a session, a human, or the system itself.
#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
#[serde(tag = "kind", rename_all = "kebab-case")]
pub enum Actor {
    Session { id: SessionId },
    Human { id: String },
    System,
}

impl Actor {
    pub fn session(id: impl Into<String>) -> Self {
        Actor::Session { id: SessionId(id.into()) }
    }
    pub fn human(id: impl Into<String>) -> Self {
        Actor::Human { id: id.into() }
    }
}

impl fmt::Display for Actor {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Actor::Session { id } => write!(f, "session:{id}"),
            Actor::Human { id } => write!(f, "human:{id}"),
            Actor::System => f.write_str("system"),
        }
    }
}

const fn encoded_len() -> usize {
    // base32 without padding: ceil(bytes * 8 / 5)
    (ID_BYTES * 8).div_ceil(5)
}

/// Domain-separated, length-prefixed content anchor.
///
/// Length prefixing matters: without it `["ab", "c"]` and `["a", "bc"]` would
/// hash identically, so two different nodes could collide into one id.
fn anchor(parts: &[&[u8]]) -> String {
    let mut hasher = blake3::Hasher::new();
    for part in parts {
        hasher.update(&(part.len() as u64).to_le_bytes());
        hasher.update(part);
    }
    let digest = hasher.finalize();
    BASE32_NOPAD.encode(&digest.as_bytes()[..ID_BYTES]).to_ascii_lowercase()
}

/// Hash arbitrary content to a stable hex digest, for dedup by content.
pub fn content_hash(bytes: &[u8]) -> String {
    blake3::hash(bytes).to_hex().to_string()
}

impl GraphId {
    /// Graphs are roots. The seed is recorded in `GRAPH_CREATE`, so replay
    /// reproduces the id without needing randomness in the fold.
    pub fn from_seed(seed: &str) -> Self {
        Self::derive(&[b"graph", seed.as_bytes()])
    }
}

impl NodeId {
    /// Anchored on the node's *name*, not its spec, so editing a prompt keeps
    /// every reference to the node intact.
    pub fn for_name(graph: &GraphId, name: &str) -> Self {
        Self::derive(&[b"node", graph.as_str().as_bytes(), name.as_bytes()])
    }

    /// A `forEach` child. Deterministic in `(parent, index)` so expansion
    /// replays identically.
    pub fn for_expansion(parent: &NodeId, index: u32) -> Self {
        Self::derive(&[b"node:expand", parent.as_str().as_bytes(), &index.to_le_bytes()])
    }
}

impl BeliefId {
    pub fn for_content(graph: &GraphId, content: &str, provenance: &str, source: &str) -> Self {
        Self::derive(&[
            b"belief",
            graph.as_str().as_bytes(),
            content.as_bytes(),
            provenance.as_bytes(),
            source.as_bytes(),
        ])
    }
}

impl ClaimId {
    pub fn for_claim(node: &NodeId, session: &SessionId, seq: u64) -> Self {
        Self::derive(&[
            b"claim",
            node.as_str().as_bytes(),
            session.0.as_bytes(),
            &seq.to_le_bytes(),
        ])
    }
}

impl FindingId {
    pub fn for_finding(review_node: &NodeId, index: u32) -> Self {
        Self::derive(&[b"finding", review_node.as_str().as_bytes(), &index.to_le_bytes()])
    }
}

impl NogoodId {
    /// Anchored on the *set*, so recording the same nogood twice is idempotent.
    /// Callers must pass a sorted, deduplicated list.
    pub fn for_set(graph: &GraphId, members: &[BeliefId]) -> Self {
        let mut parts: Vec<&[u8]> = Vec::with_capacity(members.len() + 2);
        parts.push(b"nogood");
        parts.push(graph.as_str().as_bytes());
        for m in members {
            parts.push(m.as_str().as_bytes());
        }
        Self::derive(&parts)
    }
}

#[derive(Debug, Clone, PartialEq, Eq, thiserror::Error)]
pub enum IdError {
    #[error("expected an id starting with `{expected}`, got `{got}`")]
    WrongPrefix { expected: &'static str, got: String },
    #[error("id `{id}` has a {got}-character body, expected {expected}")]
    BadLength { expected: usize, got: usize, id: String },
    #[error("id `{0}` contains characters outside the base32 alphabet")]
    BadAlphabet(String),
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn ids_are_deterministic() {
        let g = GraphId::from_seed("seed-1");
        assert_eq!(g, GraphId::from_seed("seed-1"));
        assert_ne!(g, GraphId::from_seed("seed-2"));

        let a = NodeId::for_name(&g, "fetch-customers");
        assert_eq!(a, NodeId::for_name(&g, "fetch-customers"));
        assert_ne!(a, NodeId::for_name(&g, "score-customers"));
    }

    #[test]
    fn ids_are_self_identifying_and_round_trip() {
        let g = GraphId::from_seed("s");
        let n = NodeId::for_name(&g, "n");
        assert!(n.as_str().starts_with("gn_"));
        assert_eq!(NodeId::parse(n.as_str()).unwrap(), n);
        assert!(BeliefId::parse(n.as_str()).is_err());
    }

    #[test]
    fn length_prefixing_prevents_part_boundary_collisions() {
        // Without length prefixes these would hash identically.
        assert_ne!(anchor(&[b"ab", b"c"]), anchor(&[b"a", b"bc"]));
    }

    #[test]
    fn node_ids_survive_spec_edits_but_not_renames() {
        let g = GraphId::from_seed("s");
        assert_eq!(NodeId::for_name(&g, "deploy"), NodeId::for_name(&g, "deploy"));
        assert_ne!(NodeId::for_name(&g, "deploy"), NodeId::for_name(&g, "deploy-v2"));
    }

    #[test]
    fn expansion_children_are_deterministic_in_index() {
        let g = GraphId::from_seed("s");
        let parent = NodeId::for_name(&g, "per-customer");
        assert_eq!(NodeId::for_expansion(&parent, 7), NodeId::for_expansion(&parent, 7));
        assert_ne!(NodeId::for_expansion(&parent, 7), NodeId::for_expansion(&parent, 8));
    }

    #[test]
    fn nogood_ids_are_set_anchored() {
        let g = GraphId::from_seed("s");
        let b1 = BeliefId::for_content(&g, "a", "derived", "src");
        let b2 = BeliefId::for_content(&g, "b", "derived", "src");
        let mut set = vec![b1.clone(), b2.clone()];
        set.sort();
        assert_eq!(NogoodId::for_set(&g, &set), NogoodId::for_set(&g, &set));
    }

    #[test]
    fn parse_rejects_malformed() {
        assert!(matches!(NodeId::parse("gb_abc"), Err(IdError::WrongPrefix { .. })));
        assert!(matches!(NodeId::parse("gn_short"), Err(IdError::BadLength { .. })));
        let bad = format!("gn_{}", "A".repeat(encoded_len()));
        assert!(matches!(NodeId::parse(&bad), Err(IdError::BadAlphabet(_))));
    }
}
