import Foundation

/// Minimal RFC 5389 STUN Binding client, run over the shared `UDPSocket` so
/// the discovered reflexive mapping is the one the hole punch reuses. Asking
/// a STUN server from a different socket would return a different NAT mapping
/// and the punch would aim at a port nothing is listening on.
///
/// Ported unchanged in substance from the Phase-0 spike.
enum Stun {
    static let magicCookie: UInt32 = 0x2112_A442

    /// Public servers. These only ever see a UDP packet with a random
    /// transaction id from the device's NAT address — no account, no payload,
    /// nothing tied to the user. Two so a single outage isn't a hard failure.
    static let servers: [(String, UInt16)] = [
        ("stun.l.google.com", 19302),
        ("stun1.l.google.com", 19302),
    ]

    static func bindingRequest() -> (Data, Data) {
        var msg = Data()
        msg.append(contentsOf: [0x00, 0x01, 0x00, 0x00]) // Binding request, len 0
        withUnsafeBytes(of: magicCookie.bigEndian) { msg.append(contentsOf: $0) }
        var txid = Data(count: 12)
        txid.withUnsafeMutableBytes { buf in
            _ = SecRandomCopyBytes(kSecRandomDefault, 12, buf.baseAddress!)
        }
        msg.append(txid)
        return (msg, txid)
    }

    /// Parse a Binding response; returns the reflexive endpoint from
    /// XOR-MAPPED-ADDRESS, or nil if this isn't our response.
    static func parseReflexive(_ data: Data, txid: Data) -> PeerEndpoint? {
        guard data.count >= 20 else { return nil }
        let bytes = [UInt8](data)
        // Binding success response 0x0101, matching transaction id.
        guard bytes[0] == 0x01, bytes[1] == 0x01 else { return nil }
        guard Data(bytes[8 ..< 20]) == txid else { return nil }
        var i = 20
        while i + 4 <= bytes.count {
            let type = UInt16(bytes[i]) << 8 | UInt16(bytes[i + 1])
            let len = Int(UInt16(bytes[i + 2]) << 8 | UInt16(bytes[i + 3]))
            let valueStart = i + 4
            guard valueStart + len <= bytes.count else { return nil }
            if type == 0x0020, len >= 8, bytes[valueStart + 1] == 0x01 { // XOR-MAPPED, IPv4
                let rawPort: UInt16 = UInt16(bytes[valueStart + 2]) << 8 | UInt16(bytes[valueStart + 3])
                let port: UInt16 = rawPort ^ UInt16(truncatingIfNeeded: magicCookie >> 16)
                var ipParts: [String] = []
                for j in 0 ..< 4 {
                    let cookieByte = UInt8(truncatingIfNeeded: magicCookie >> (8 * (3 - j)))
                    ipParts.append(String(bytes[valueStart + 4 + j] ^ cookieByte))
                }
                return PeerEndpoint(host: ipParts.joined(separator: "."), port: port)
            }
            i = valueStart + len + (4 - len % 4) % 4 // attrs are 4-byte aligned
        }
        return nil
    }

    /// Resolve a STUN host to IPv4 (first A record). Blocking, so callers run
    /// it off the main thread.
    static func resolve(_ host: String) -> String? {
        var hints = addrinfo()
        hints.ai_family = AF_INET
        hints.ai_socktype = SOCK_DGRAM
        var res: UnsafeMutablePointer<addrinfo>?
        guard getaddrinfo(host, nil, &hints, &res) == 0, let first = res else { return nil }
        defer { freeaddrinfo(res) }
        var addr = sockaddr_in()
        memcpy(&addr, first.pointee.ai_addr, MemoryLayout<sockaddr_in>.size)
        var buf = [CChar](repeating: 0, count: Int(INET_ADDRSTRLEN))
        inet_ntop(AF_INET, &addr.sin_addr, &buf, socklen_t(INET_ADDRSTRLEN))
        return String(cString: buf)
    }
}
