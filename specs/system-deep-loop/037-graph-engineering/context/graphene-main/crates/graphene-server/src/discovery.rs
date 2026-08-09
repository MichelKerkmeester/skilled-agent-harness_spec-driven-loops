//! Finding, starting, and outliving a server.
//!
//! The port is OS-assigned and written on bind, so there is nothing to
//! configure and nothing to collide. A stale file whose pid is dead is replaced
//! by the next attach.

use std::path::{Path, PathBuf};

use serde::{Deserialize, Serialize};

use crate::protocol::PROTOCOL_VERSION;

pub const SERVER_FILE: &str = "server.json";

#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct ServerInfo {
    pub pid: u32,
    pub port: u16,
    pub protocol: u32,
    pub store: PathBuf,
    pub started_at: i64,
}

impl ServerInfo {
    pub fn url(&self) -> String {
        format!("ws://127.0.0.1:{}/ws", self.port)
    }

    pub fn http(&self) -> String {
        format!("http://127.0.0.1:{}", self.port)
    }

    /// Is the recorded process still alive?
    ///
    /// Signal 0 runs the permission and existence checks without delivering
    /// anything. It must not fork to ask: a failed spawn under process pressure
    /// would read as "dead", and `find_live` deletes the record of anything it
    /// believes dead — evicting a running server and starting a second one for
    /// the same store.
    ///
    /// `EPERM` means the process exists and belongs to someone else. Only
    /// `ESRCH` — no such process — is death.
    pub fn is_alive(&self) -> bool {
        #[cfg(unix)]
        {
            let Ok(pid) = i32::try_from(self.pid) else { return false };
            let Some(pid) = rustix::process::Pid::from_raw(pid) else { return false };
            match rustix::process::test_kill_process(pid) {
                Ok(()) => true,
                Err(e) => e != rustix::io::Errno::SRCH,
            }
        }
        #[cfg(not(unix))]
        {
            true
        }
    }

    pub fn speaks_our_protocol(&self) -> bool {
        self.protocol == PROTOCOL_VERSION
    }
}

/// `.graphene/server.json`, beside the store.
pub fn info_path(store_path: &Path) -> PathBuf {
    store_path.parent().map(|d| d.join(SERVER_FILE)).unwrap_or_else(|| PathBuf::from(SERVER_FILE))
}

pub fn read(store_path: &Path) -> Option<ServerInfo> {
    let raw = std::fs::read_to_string(info_path(store_path)).ok()?;
    serde_json::from_str(&raw).ok()
}

/// A usable server for this store, or `None`.
///
/// A dead pid or a protocol mismatch both count as "no server" — the caller
/// then starts one, which replaces the stale record.
pub fn find_live(store_path: &Path) -> Option<ServerInfo> {
    let info = read(store_path)?;
    if !info.is_alive() {
        let _ = std::fs::remove_file(info_path(store_path));
        return None;
    }
    Some(info)
}

pub fn write(store_path: &Path, info: &ServerInfo) -> std::io::Result<()> {
    let path = info_path(store_path);
    if let Some(dir) = path.parent() {
        std::fs::create_dir_all(dir)?;
    }
    let tmp = path.with_extension("json.tmp");
    std::fs::write(&tmp, serde_json::to_vec_pretty(info)?)?;
    std::fs::rename(tmp, path)
}

pub fn clear(store_path: &Path) {
    let _ = std::fs::remove_file(info_path(store_path));
}

#[derive(Debug, thiserror::Error)]
pub enum DiscoveryError {
    #[error("a server is running for this store but speaks protocol {found}; this binary speaks {ours}. Upgrade the binary, or stop the running server.")]
    ProtocolMismatch { found: u32, ours: u32 },
    #[error("io: {0}")]
    Io(#[from] std::io::Error),
}

/// Return a live, compatible server — refusing rather than speaking a stale
/// protocol.
pub fn require_compatible(store_path: &Path) -> Result<Option<ServerInfo>, DiscoveryError> {
    match find_live(store_path) {
        None => Ok(None),
        Some(info) if info.speaks_our_protocol() => Ok(Some(info)),
        Some(info) => {
            Err(DiscoveryError::ProtocolMismatch { found: info.protocol, ours: PROTOCOL_VERSION })
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// A counter, not a clock: `SystemTime::now()` is coarse enough that two
    /// threads share a directory and race `write`'s rename against its own tmp.
    static NEXT: std::sync::atomic::AtomicUsize = std::sync::atomic::AtomicUsize::new(0);

    fn tmp() -> PathBuf {
        let d = std::env::temp_dir().join(format!(
            "graphene-disc-{}-{}",
            std::process::id(),
            NEXT.fetch_add(1, std::sync::atomic::Ordering::SeqCst)
        ));
        std::fs::create_dir_all(&d).unwrap();
        d.join("store.db")
    }

    fn info(pid: u32, protocol: u32) -> ServerInfo {
        ServerInfo { pid, port: 7717, protocol, store: PathBuf::from("/x"), started_at: 0 }
    }

    #[test]
    fn info_round_trips_beside_the_store() {
        let store = tmp();
        let i = info(std::process::id(), PROTOCOL_VERSION);
        write(&store, &i).unwrap();
        assert_eq!(read(&store).unwrap(), i);
        assert_eq!(info_path(&store).file_name().unwrap(), "server.json");
    }

    #[test]
    fn a_dead_pid_is_treated_as_no_server_and_the_file_is_cleared() {
        let store = tmp();
        write(&store, &info(u32::MAX - 1, PROTOCOL_VERSION)).unwrap();
        assert!(find_live(&store).is_none());
        assert!(read(&store).is_none(), "the stale record is removed");
    }

    #[test]
    fn our_own_pid_reads_as_alive() {
        let store = tmp();
        write(&store, &info(std::process::id(), PROTOCOL_VERSION)).unwrap();
        assert!(find_live(&store).is_some());
    }

    #[test]
    fn a_protocol_mismatch_refuses_rather_than_speaking_a_stale_contract() {
        let store = tmp();
        write(&store, &info(std::process::id(), PROTOCOL_VERSION + 9)).unwrap();
        assert!(matches!(require_compatible(&store), Err(DiscoveryError::ProtocolMismatch { .. })));
    }

    /// `find_live` deletes what it believes dead, so a liveness check that can
    /// fail open is a check that evicts a running server.
    #[test]
    fn liveness_never_reports_dead_without_esrch() {
        let store = tmp();
        write(&store, &info(std::process::id(), PROTOCOL_VERSION)).unwrap();

        for _ in 0..2_000 {
            assert!(find_live(&store).is_some(), "the live record was evicted");
        }
        assert!(read(&store).is_some(), "the record survives repeated checks");
    }

    #[test]
    fn a_pid_owned_by_another_user_counts_as_alive() {
        let store = tmp();
        write(&store, &info(1, PROTOCOL_VERSION)).unwrap();
        assert!(find_live(&store).is_some(), "EPERM means it exists, not that it is gone");
    }

    #[test]
    fn no_file_means_no_server_not_an_error() {
        let store = tmp();
        assert!(require_compatible(&store).unwrap().is_none());
    }
}
