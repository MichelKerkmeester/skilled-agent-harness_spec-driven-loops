import CryptoKit

/// The trust that lets this process's own workspace talk to this process's
/// own server: a channel key minted at launch, held in memory, never
/// persisted and never sent anywhere. The workspace reads it directly and
/// runs the ordinary Wire handshake over 127.0.0.1 — one code path for
/// every client, and a 256-bit random key nobody outside the process can
/// guess. Notably this works on a Mac with zero pairings, which is what
/// makes the workspace usable before any other device exists.
enum LoopbackTrust {
    static let key = SymmetricKey(size: .bits256)
}
