import CryptoKit
import Foundation

/// Line-delimited JSON protocol between phone and Mac — the framing,
/// handshake, and channel security are lifted from Tomte (ai-macintosh),
/// where this exact design runs over both transports in production. The
/// payloads are opencodego's own: mobile protocol v1, the stable contract
/// documented in docs/protocol-v1.md. The Mac adapter translates these to
/// whatever OpenCode API version is installed; the phone never sees
/// OpenCode's shapes.
///
/// ## Handshake
///
/// Neither "on my Wi-Fi" nor "knows the address" is an identity — so every
/// connection is authenticated and encrypted with the key both devices
/// derived when they paired (see Pairing):
///
/// 1. server → client   plain `challenge` event carrying a fresh nonce
/// 2. client → server   plain `auth` frame: device name, its own nonce, and
///                      an HMAC over both nonces keyed by the channel key
/// 3. server → client   sealed `ready` event — being able to seal against
///                      the session key (which mixes both nonces) is the
///                      server's proof, so the phone never talks to an
///                      impostor advertising our Bonjour type
/// 4. everything after  sealed frames both ways (ChaChaPoly, session key)
public enum Wire {
    public static let bonjourType = "_opencodego._tcp"
    /// Not 8765 — Tomte listens there, and both apps run on this Mac.
    public static let port: UInt16 = 8766

    // MARK: - Protocol v1 requests

    /// One request from the phone. `kind` selects the operation; the other
    /// fields are that operation's arguments, all optional so unknown or
    /// missing ones decode cleanly across app versions.
    public struct Request: Codable {
        /// "status" | "projects" | "sessions" | "models" | "prompt" |
        /// "resume" | "abort" | "permission" | "question" | "pending" |
        /// "transcript"
        public var kind: String
        /// prompt/resume: the phone-minted turn id, so an answer can outlive
        /// the socket that asked for it (iOS suspends sockets on background;
        /// the Mac's work continues and the phone reconnects with this id).
        public var turn: String?
        /// resume: how many events of this turn the phone has already seen.
        public var from: Int?
        /// prompt: worktree path to start in (new session), when `session`
        /// is absent.
        public var project: String?
        /// prompt/abort/transcript: the OpenCode session to continue.
        public var session: String?
        /// prompt: what the user said.
        public var text: String?
        /// prompt: files sent as context with this turn.
        public var attachments: [Attachment]?
        /// prompt: run this slash command instead of sending `text` as a
        /// plain prompt. OpenCode expands its own template — we send only
        /// the name and whatever the user typed after it.
        public var command: String?
        /// prompt: everything after the command name. Empty is valid.
        public var arguments: String?
        public var providerID: String?
        public var modelID: String?
        /// permission: which pending request this answers.
        public var permissionID: String?
        /// permission: "once" | "always" | "reject".
        public var reply: String?
        /// permission: what to do instead, on a reject. A denial that can
        /// carry direction is steering rather than a dead end.
        public var message: String?
        /// prompt: which agent to run as — "plan" disallows edits, which
        /// is the mode that makes steering from a phone safe.
        public var agent: String?
        /// changes: "git" (working tree) or "branch" (vs default branch).
        public var mode: String?
        /// session.rename: the new title.
        public var title: String?
        /// question: which ask this answers.
        public var questionID: String?
        /// question: selected labels per question, in order. A free-text
        /// answer travels as that question's single "label".
        public var answers: [[String]]?
        /// sessions: filter server-side rather than shipping everything and
        /// filtering on the phone — the session list can be thousands long.
        public var search: String?

        public init(kind: String) { self.kind = kind }
    }

    /// Client's answer to the server's challenge.
    public struct Auth: Codable {
        public var kind: String = "auth"
        public var name: String
        public var nonce: String
        public var tag: String
        /// True when this client can read Squeeze-compressed frames.
        public var compress: Bool?

        public init(name: String, nonce: String, tag: String, compress: Bool? = nil) {
            self.name = name
            self.nonce = nonce
            self.tag = tag
            self.compress = compress
        }
    }

    // MARK: - Protocol v1 events

    /// One event from the Mac. Optional fields keyed by kind; unknown keys
    /// are ignored on decode, which is the whole version-skew strategy.
    ///
    /// Kinds:
    /// - handshake: `challenge`, `ready`, `failed`, `done`
    /// - answers:   `status`, `projects`, `sessions`, `part`, `permission`,
    ///              `diff`, `idle`
    /// - reconnection: `unknown` (resume for a turn the Mac never heard of —
    ///   ask again, nothing is wrong), `interrupted` (synthesised locally by
    ///   MacLink when a transport dies mid-answer; never on the wire)
    public struct Event: Codable {
        public var kind: String
        public var text: String?
        /// On `ready`: this Mac reads Squeeze-compressed frames.
        public var compress: Bool?
        /// On `ready`: what this Mac's OpenCode installation can do.
        public var capabilities: Capabilities?
        public var projects: [Project]?
        public var sessions: [Session]?
        /// On `part`: one streaming piece of the running turn.
        public var part: TurnPart?
        /// On `permission`: the agent wants to do something.
        public var permission: PermissionRequest?
        /// On `pending`: everything currently blocked awaiting an answer —
        /// what a push-woken phone asks for first.
        public var permissions: [PermissionRequest]?
        /// On `question` (one ask, live) and `pending` (all of them).
        public var question: QuestionRequest?
        public var questions: [QuestionRequest]?
        /// On `commands`: the slash commands this OpenCode offers.
        public var commands: [AgentCommand]?
        /// On `agents`: what the session can run as.
        public var agents: [AgentInfo]?
        /// On `todos`: the agent's plan for this turn, as it evolves.
        public var todos: [TodoItem]?
        /// On `changes`: the working tree's accumulated state.
        public var changes: WorkingChanges?
        /// On `models`: what this Mac's OpenCode is configured to run.
        public var models: [AgentModel]?
        /// On `models`: the one used when the phone doesn't pick.
        public var defaultModel: String?
        /// On `diff`: what the turn changed.
        public var diffs: [FileDiff]?
        /// On `status` and `part`: which OpenCode session this concerns —
        /// also how a `prompt` learns the id of the session it created.
        public var session: String?
        /// On `failed`: transient, worth retrying without asking the user.
        public var transient: Bool?
        /// Never on the wire. Set by MacLink on failures it synthesises
        /// itself, so callers can tell "couldn't reach the Mac" from "the
        /// Mac said no".
        public var local: Bool?

        public init(kind: String) { self.kind = kind }
    }

    public static func encode(_ event: Event) -> Data? {
        guard var data = try? JSONEncoder().encode(event) else { return nil }
        data.append(0x0A)
        return data
    }
}

// MARK: - Frame compression

public extension Wire {
    /// Frame compression, *inside* the seal — ciphertext doesn't compress,
    /// so the order is deflate → encrypt → frame. Negotiated, never assumed:
    /// each side advertises (`auth.compress` from the phone,
    /// `ready.compress` from the Mac) and compresses only for a peer that
    /// said yes. A compressed body starts with a 0x00 marker — a byte no
    /// JSON frame can begin with.
    enum Squeeze {
        static let marker: UInt8 = 0x00
        /// Below this, deflate overhead beats its savings — part events and
        /// handshake frames pass through untouched.
        static let threshold = 4096

        /// The body to seal: compressed-and-marked when it pays, the plain
        /// bytes when it doesn't. Never fails — worst case is the input back.
        public static func pack(_ plain: Data) -> Data {
            guard plain.count > threshold,
                  let squeezed = try? (plain as NSData).compressed(using: .zlib) as Data,
                  squeezed.count + 1 < plain.count
            else { return plain }
            return Data([marker]) + squeezed
        }

        /// The JSON bytes out of an opened frame, whichever form it took.
        /// Nil only for a marked body that fails to inflate — corruption,
        /// which callers treat exactly like a frame that fails to decrypt.
        public static func unpack(_ body: Data) -> Data? {
            guard body.first == marker else { return body }
            return try? (body.dropFirst() as NSData).decompressed(using: .zlib) as Data
        }
    }
}

// MARK: - Channel security

public extension Wire {
    /// Everything both ends need to run the handshake and seal traffic.
    enum Security {
        public static func nonce() -> String {
            Data((0 ..< 16).map { _ in UInt8.random(in: .min ... .max) }).hexEncoded
        }

        /// The client's proof that it holds the pairing channel key.
        public static func authTag(
            channelKey: SymmetricKey, serverNonce: String, clientNonce: String, name: String
        ) -> String {
            let payload = Data("opencodego-auth|\(serverNonce)|\(clientNonce)|\(name)".utf8)
            return Data(HMAC<SHA256>.authenticationCode(for: payload, using: channelKey))
                .hexEncoded
        }

        public static func verify(
            tag: String, channelKey: SymmetricKey,
            serverNonce: String, clientNonce: String, name: String
        ) -> Bool {
            guard let tagData = Data(hexEncoded: tag) else { return false }
            let payload = Data("opencodego-auth|\(serverNonce)|\(clientNonce)|\(name)".utf8)
            return HMAC<SHA256>.isValidAuthenticationCode(
                tagData, authenticating: payload, using: channelKey
            )
        }

        /// Per-connection key: mixing both nonces means a replayed transcript
        /// never decrypts, and sealing with it doubles as the server's proof
        /// of identity.
        public static func sessionKey(
            channelKey: SymmetricKey, serverNonce: String, clientNonce: String
        ) -> SymmetricKey {
            HKDF<SHA256>.deriveKey(
                inputKeyMaterial: channelKey,
                salt: Data("\(serverNonce)|\(clientNonce)".utf8),
                info: Data("opencodego-session".utf8),
                outputByteCount: 32
            )
        }
    }

    /// Seals/opens newline-framed payloads once the handshake is done.
    struct SecureChannel {
        private struct Envelope: Codable { var s: Data }
        private let key: SymmetricKey

        public init(key: SymmetricKey) { self.key = key }

        /// `plaintext` is a complete JSON frame WITHOUT the trailing newline;
        /// the result includes it.
        public func seal(_ plaintext: Data) -> Data? {
            guard let box = try? ChaChaPoly.seal(plaintext, using: key),
                  var data = try? JSONEncoder().encode(Envelope(s: box.combined))
            else { return nil }
            data.append(0x0A)
            return data
        }

        /// Nil when the frame isn't a valid envelope or fails to decrypt —
        /// callers must treat that as a protocol violation and drop the
        /// connection, not skip the frame.
        public func open(_ frame: Data) -> Data? {
            guard let env = try? JSONDecoder().decode(Envelope.self, from: frame),
                  let box = try? ChaChaPoly.SealedBox(combined: env.s)
            else { return nil }
            return try? ChaChaPoly.open(box, using: key)
        }
    }
}

extension Data {
    var hexEncoded: String { map { String(format: "%02x", $0) }.joined() }

    init?(hexEncoded: String) {
        guard hexEncoded.count % 2 == 0 else { return nil }
        var data = Data(capacity: hexEncoded.count / 2)
        var index = hexEncoded.startIndex
        while index < hexEncoded.endIndex {
            let next = hexEncoded.index(index, offsetBy: 2)
            guard let byte = UInt8(hexEncoded[index ..< next], radix: 16) else { return nil }
            data.append(byte)
            index = next
        }
        self = data
    }
}

/// Splits a byte stream into newline-delimited frames.
public struct LineFramer {
    private var buffer = Data()

    public init() {}

    public mutating func push(_ data: Data) -> [Data] {
        buffer.append(data)
        var frames: [Data] = []
        while let idx = buffer.firstIndex(of: 0x0A) {
            frames.append(buffer[buffer.startIndex ..< idx])
            buffer = buffer[buffer.index(after: idx)...]
        }
        return frames
    }
}
