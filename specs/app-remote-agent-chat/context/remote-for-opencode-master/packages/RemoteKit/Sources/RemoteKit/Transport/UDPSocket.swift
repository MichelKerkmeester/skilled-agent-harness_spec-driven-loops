import Foundation

/// One IPv4 UDP socket bound once and shared by STUN, hole punching, and the
/// data stream that follows — the NAT mapping created by the STUN request
/// must be the same mapping the punch uses and the same one the stream runs
/// over, so everything speaks from a single local port.
///
/// BSD sockets rather than Network.framework: this is datagram-oriented (many
/// candidate peers, one socket), not connection-oriented, and NWConnection
/// gives no way to keep one local port across many remote endpoints.
///
/// Ported from the Phase-0 spike (pairing-spike/PairingKit/UDPSocket.swift),
/// which validated the punch on real hardware over cellular.
final class UDPSocket {
    let fd: Int32
    private let queue = DispatchQueue(label: "com.timwilliams.opencodego.udp")
    private var source: DispatchSourceRead?
    private var closed = false

    /// Called on `queue` for every datagram: payload, source IP, source port.
    var onDatagram: ((Data, String, UInt16) -> Void)?

    init() throws {
        fd = socket(AF_INET, SOCK_DGRAM, 0)
        guard fd >= 0 else { throw PairingError.network("socket() failed") }
        var yes: Int32 = 1
        setsockopt(fd, SOL_SOCKET, SO_REUSEADDR, &yes, socklen_t(MemoryLayout<Int32>.size))
        var addr = sockaddr_in()
        addr.sin_family = sa_family_t(AF_INET)
        addr.sin_port = 0 // ephemeral; read back via localPort()
        addr.sin_addr.s_addr = INADDR_ANY
        let rc = withUnsafePointer(to: &addr) {
            $0.withMemoryRebound(to: sockaddr.self, capacity: 1) {
                bind(fd, $0, socklen_t(MemoryLayout<sockaddr_in>.size))
            }
        }
        guard rc == 0 else {
            Darwin.close(fd)
            throw PairingError.network("bind() failed: errno \(errno)")
        }
        startReceiving()
    }

    deinit { close() }

    func close() {
        guard !closed else { return }
        closed = true
        source?.cancel()
        source = nil
        Darwin.close(fd)
    }

    func localPort() -> UInt16 {
        var addr = sockaddr_in()
        var len = socklen_t(MemoryLayout<sockaddr_in>.size)
        _ = withUnsafeMutablePointer(to: &addr) {
            $0.withMemoryRebound(to: sockaddr.self, capacity: 1) {
                getsockname(fd, $0, &len)
            }
        }
        return UInt16(bigEndian: addr.sin_port)
    }

    func send(_ data: Data, to peer: PeerEndpoint) {
        send(data, toHost: peer.host, port: peer.port)
    }

    func send(_ data: Data, toHost host: String, port: UInt16) {
        guard !closed else { return }
        var addr = sockaddr_in()
        addr.sin_family = sa_family_t(AF_INET)
        addr.sin_port = port.bigEndian
        guard inet_pton(AF_INET, host, &addr.sin_addr) == 1 else { return }
        data.withUnsafeBytes { (buf: UnsafeRawBufferPointer) in
            _ = withUnsafePointer(to: &addr) {
                $0.withMemoryRebound(to: sockaddr.self, capacity: 1) {
                    sendto(fd, buf.baseAddress, buf.count, 0, $0,
                           socklen_t(MemoryLayout<sockaddr_in>.size))
                }
            }
        }
    }

    private func startReceiving() {
        let src = DispatchSource.makeReadSource(fileDescriptor: fd, queue: queue)
        src.setEventHandler { [weak self] in
            guard let self else { return }
            var buf = [UInt8](repeating: 0, count: 2048)
            var from = sockaddr_in()
            var fromLen = socklen_t(MemoryLayout<sockaddr_in>.size)
            let n = withUnsafeMutablePointer(to: &from) {
                $0.withMemoryRebound(to: sockaddr.self, capacity: 1) { sa in
                    recvfrom(self.fd, &buf, buf.count, 0, sa, &fromLen)
                }
            }
            guard n > 0 else { return }
            var ipBuf = [CChar](repeating: 0, count: Int(INET_ADDRSTRLEN))
            inet_ntop(AF_INET, &from.sin_addr, &ipBuf, socklen_t(INET_ADDRSTRLEN))
            self.onDatagram?(
                Data(buf[..<n]),
                String(cString: ipBuf),
                UInt16(bigEndian: from.sin_port)
            )
        }
        src.resume()
        source = src
    }
}

/// A candidate address for the peer, written to and read from the CloudKit
/// rendezvous record as "ip:port".
public struct PeerEndpoint: Hashable, Sendable {
    public var host: String
    public var port: UInt16

    public init(host: String, port: UInt16) {
        self.host = host
        self.port = port
    }

    public init?(_ text: String) {
        let parts = text.split(separator: ":")
        guard parts.count == 2, let port = UInt16(parts[1]) else { return nil }
        host = String(parts[0])
        self.port = port
    }

    public var text: String { "\(host):\(port)" }
}

/// Local IPv4 interface addresses that are legitimate LAN candidates.
///
/// **Tunnel interfaces are excluded, and this is the whole point.** A VPN
/// such as Tailscale presents a `utun*` interface carrying a `100.64.0.0/10`
/// address that is reachable from the peer *because the VPN already solved
/// NAT traversal*. Publishing it as a candidate makes the punch succeed over
/// the tunnel — the app would then appear to work anywhere while actually
/// depending on a VPN the user may quit at any moment. (The spike hit exactly
/// this and recorded a false pass; see pairing-spike/DESIGN.md, 2026-07-25.)
/// Carrier CGNAT addresses live in the same range and are unreachable from
/// outside anyway, so dropping the range costs nothing real.
enum LocalAddresses {
    /// Interface name prefixes that carry tunnels rather than physical links.
    private static let tunnelPrefixes = ["utun", "tun", "tap", "ipsec", "ppp", "gpd"]

    static func ipv4() -> [String] {
        var out: [String] = []
        var ifaddr: UnsafeMutablePointer<ifaddrs>?
        guard getifaddrs(&ifaddr) == 0 else { return out }
        defer { freeifaddrs(ifaddr) }
        var ptr = ifaddr
        while let p = ptr {
            defer { ptr = p.pointee.ifa_next }
            guard let sa = p.pointee.ifa_addr, sa.pointee.sa_family == sa_family_t(AF_INET) else {
                continue
            }
            let flags = Int32(p.pointee.ifa_flags)
            guard flags & IFF_UP != 0, flags & IFF_LOOPBACK == 0 else { continue }
            let name = String(cString: p.pointee.ifa_name)
            if Self.tunnelPrefixes.contains(where: { name.hasPrefix($0) }) { continue }
            var addr = sockaddr_in()
            memcpy(&addr, sa, MemoryLayout<sockaddr_in>.size)
            var ipBuf = [CChar](repeating: 0, count: Int(INET_ADDRSTRLEN))
            inet_ntop(AF_INET, &addr.sin_addr, &ipBuf, socklen_t(INET_ADDRSTRLEN))
            let ip = String(cString: ipBuf)
            guard !ip.hasPrefix("169.254."), !ip.isCarrierGradeNAT else { continue }
            out.append(ip)
        }
        return out
    }
}

extension String {
    var isPrivateIPv4: Bool {
        if hasPrefix("10.") || hasPrefix("192.168.") { return true }
        guard hasPrefix("172.") else { return false }
        let parts = split(separator: ".")
        guard parts.count == 4, let second = Int(parts[1]) else { return false }
        return (16 ... 31).contains(second)
    }

    /// `100.64.0.0/10` — RFC 6598 shared address space: carrier NAT *and*
    /// Tailscale's assigned range. Reaching a peer here means some other
    /// layer already did the traversal, so it must never be treated as our
    /// own path.
    var isCarrierGradeNAT: Bool {
        guard hasPrefix("100.") else { return false }
        let parts = split(separator: ".")
        guard parts.count == 4, let second = Int(parts[1]) else { return false }
        return (64 ... 127).contains(second)
    }
}
