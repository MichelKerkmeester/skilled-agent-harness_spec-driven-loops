//! Ids a coverage report names over and over, stored once.
//!
//! A report says, for every obligation and line, which tests and phases
//! reached it, and for every test and phase, what it reached. On a
//! 3,900-test run that is some twenty million names drawn from a few tens of
//! thousands of distinct ones -- test ids, phase ids, obligation ids and file
//! paths. Held as owned strings each was its own allocation of about a
//! hundred bytes, and analysing that run peaked above 4 GB. An `Id` is a
//! shared pointer to one copy: sixteen bytes in a list, and a clone is a
//! count. It serializes as the string it holds, so nothing a report writes
//! changes.

use std::{
    borrow::Borrow,
    collections::{HashMap, HashSet},
    fmt,
    hash::{BuildHasherDefault, Hash, Hasher},
    ops::Deref,
    sync::Arc,
};

/// The hash an analysis's own maps of ids use: Fx, the multiply-rotate hash
/// rustc uses for its tables. The standard SipHash resists keys chosen to
/// collide, which costs a run's millions of lookups of its own ids -- test,
/// phase and obligation names it made itself -- and buys them nothing.
#[derive(Default, Clone, Copy)]
pub struct FxHasher {
    hash: u64,
}

const FX_SEED: u64 = 0x51_7c_c1_b7_27_22_0a_95;

impl FxHasher {
    fn add(&mut self, word: u64) {
        self.hash = (self.hash.rotate_left(5) ^ word).wrapping_mul(FX_SEED);
    }
}

impl Hasher for FxHasher {
    fn write(&mut self, bytes: &[u8]) {
        let mut chunks = bytes.chunks_exact(8);
        for chunk in &mut chunks {
            self.add(u64::from_le_bytes(chunk.try_into().expect("eight bytes")));
        }
        let rest = chunks.remainder();
        if !rest.is_empty() {
            let mut word = [0_u8; 8];
            word[..rest.len()].copy_from_slice(rest);
            self.add(u64::from_le_bytes(word) ^ ((rest.len() as u64) << 56));
        }
    }

    fn write_u8(&mut self, value: u8) {
        self.add(u64::from(value));
    }

    fn write_u32(&mut self, value: u32) {
        self.add(u64::from(value));
    }

    fn write_u64(&mut self, value: u64) {
        self.add(value);
    }

    fn write_usize(&mut self, value: usize) {
        self.add(value as u64);
    }

    fn finish(&self) -> u64 {
        self.hash
    }
}

pub type FastHash = BuildHasherDefault<FxHasher>;
pub type FastMap<K, V> = HashMap<K, V, FastHash>;
pub type FastSet<T> = HashSet<T, FastHash>;

use serde::{Serialize, Serializer};

#[derive(Clone, PartialEq, Eq, PartialOrd, Ord)]
pub struct Id(Arc<str>);

impl Id {
    pub fn as_str(&self) -> &str {
        &self.0
    }
}

impl Deref for Id {
    type Target = str;
    fn deref(&self) -> &str {
        &self.0
    }
}

impl Borrow<str> for Id {
    fn borrow(&self) -> &str {
        &self.0
    }
}

impl AsRef<str> for Id {
    fn as_ref(&self) -> &str {
        &self.0
    }
}

// Hashes as the text it holds, so a set of ids can be searched with a `&str`.
impl Hash for Id {
    fn hash<H: Hasher>(&self, state: &mut H) {
        (*self.0).hash(state);
    }
}

impl fmt::Debug for Id {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        fmt::Debug::fmt(&*self.0, formatter)
    }
}

impl fmt::Display for Id {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        fmt::Display::fmt(&*self.0, formatter)
    }
}

impl Serialize for Id {
    fn serialize<S: Serializer>(&self, serializer: S) -> Result<S::Ok, S::Error> {
        serializer.serialize_str(&self.0)
    }
}

impl From<&str> for Id {
    fn from(value: &str) -> Self {
        Self(Arc::from(value))
    }
}

impl From<String> for Id {
    fn from(value: String) -> Self {
        Self(Arc::from(value))
    }
}

impl From<&String> for Id {
    fn from(value: &String) -> Self {
        Self(Arc::from(value.as_str()))
    }
}

impl From<Id> for String {
    fn from(value: Id) -> Self {
        value.0.to_string()
    }
}

impl PartialEq<str> for Id {
    fn eq(&self, other: &str) -> bool {
        &*self.0 == other
    }
}

impl PartialEq<&str> for Id {
    fn eq(&self, other: &&str) -> bool {
        &*self.0 == *other
    }
}

impl PartialEq<String> for Id {
    fn eq(&self, other: &String) -> bool {
        &*self.0 == other.as_str()
    }
}

impl PartialEq<Id> for String {
    fn eq(&self, other: &Id) -> bool {
        self.as_str() == &*other.0
    }
}

impl PartialEq<Id> for str {
    fn eq(&self, other: &Id) -> bool {
        self == &*other.0
    }
}

impl PartialEq<Id> for &str {
    fn eq(&self, other: &Id) -> bool {
        *self == &*other.0
    }
}

#[cfg(test)]
impl Id {
    /// Whether two ids hold one copy of their text, which is the point of them.
    pub(crate) fn same_allocation(&self, other: &Id) -> bool {
        Arc::ptr_eq(&self.0, &other.0)
    }
}

/// One `Id` per distinct text, for the life of one view.
#[derive(Default)]
pub struct Interner {
    ids: FastSet<Id>,
}

impl Interner {
    pub fn id(&mut self, text: &str) -> Id {
        if let Some(id) = self.ids.get(text) {
            return id.clone();
        }
        let id = Id::from(text);
        self.ids.insert(id.clone());
        id
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Texts a report holds, including the awkward ones: shared prefixes,
    /// case, the empty string, escapes JSON must write, and text outside ASCII.
    const TEXTS: [&str; 14] = [
        "",
        "a",
        "A",
        "ab",
        "a/b",
        "h11/tests/test_x.py::test_b[2-50]",
        "h11/tests/test_x.py::test_b[10-50]",
        "h11/tests/test_x.py::test_b",
        "python-phase:9",
        "python-phase:10",
        "quote \" and backslash \\",
        "tab\tnewline\ncontrol\u{1}",
        "unicodé ✓ 名前",
        "z",
    ];

    #[test]
    fn ids_order_hash_and_serialize_exactly_as_their_strings() {
        use std::collections::{BTreeSet, HashSet};
        let mut interner = Interner::default();
        let ids = TEXTS
            .iter()
            .map(|text| interner.id(text))
            .collect::<Vec<_>>();
        // Ordering: every pair compares as its strings do, so a set of ids
        // iterates in the order a set of strings did.
        for (left, left_text) in ids.iter().zip(TEXTS) {
            for (right, right_text) in ids.iter().zip(TEXTS) {
                assert_eq!(
                    left.cmp(right),
                    left_text.cmp(right_text),
                    "{left_text:?} vs {right_text:?}"
                );
            }
        }
        let by_id = ids.iter().cloned().collect::<BTreeSet<_>>();
        let by_text = TEXTS
            .iter()
            .map(|text| text.to_string())
            .collect::<BTreeSet<_>>();
        assert_eq!(
            by_id.iter().map(|id| id.as_str()).collect::<Vec<_>>(),
            by_text.iter().map(String::as_str).collect::<Vec<_>>()
        );
        // Lookup by text, in hashed and ordered sets alike.
        let hashed = ids.iter().cloned().collect::<HashSet<_>>();
        for text in TEXTS {
            assert!(hashed.contains(text), "{text:?}");
            assert!(by_id.contains(text), "{text:?}");
        }
        assert!(!hashed.contains("absent"));
        // Serialization, alone and in a list, is the string's own.
        for (id, text) in ids.iter().zip(TEXTS) {
            assert_eq!(
                serde_json::to_string(id).unwrap(),
                serde_json::to_string(text).unwrap()
            );
            assert_eq!(id.to_string(), text);
            assert_eq!(format!("{id:?}"), format!("{text:?}"));
            let owned = String::from(text);
            assert_eq!(*id, text);
            assert_eq!(*id, owned);
            assert_eq!(owned, *id);
            assert_eq!(text, *id);
        }
        assert_eq!(
            serde_json::to_string(&ids).unwrap(),
            serde_json::to_string(&TEXTS).unwrap()
        );
    }

    #[test]
    fn an_id_is_the_text_it_holds_everywhere_it_is_seen() {
        let mut interner = Interner::default();
        let first = interner.id("h11/tests/test_x.py::test_a");
        let again = interner.id("h11/tests/test_x.py::test_a");
        assert!(
            Arc::ptr_eq(&first.0, &again.0),
            "one copy per distinct text"
        );
        assert_eq!(first, "h11/tests/test_x.py::test_a");
        assert_eq!(
            serde_json::to_string(&vec![first.clone()]).unwrap(),
            r#"["h11/tests/test_x.py::test_a"]"#
        );
        let mut set = std::collections::BTreeSet::new();
        set.insert(interner.id("b"));
        set.insert(interner.id("a"));
        assert!(set.contains("a"), "found by text");
        assert_eq!(
            set.into_iter().map(String::from).collect::<Vec<_>>(),
            ["a", "b"]
        );
    }
}
