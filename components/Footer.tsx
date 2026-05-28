export default function Footer() {
  return (
    <>
      <style>{`
        .footer {
          padding: 20px 48px;
          border-top: 1px solid #E8E8E4;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
          background-color: #FBFBF9;
          gap: 16px;
          font-family: "Plus Jakarta Sans", sans-serif;
        }
        .footer-links {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }
        .footer-link {
          font-size: 11.5px;
          color: #6B6B63;
          text-decoration: none;
          transition: color 0.15s ease;
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          .footer {
            padding: 16px 20px;
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .footer-links {
            gap: 16px;
            justify-content: flex-start;
          }
        }

        @media (max-width: 480px) {
          .footer {
            padding: 14px 16px;
          }
          .footer-links {
            gap: 12px;
          }
          .footer-link {
            font-size: 11px;
          }
        }
      `}</style>

      <footer className="footer">
        {/* Branding */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#2E6F40', letterSpacing: '-0.01em' }}>
            Botanical Intelligence
          </span>
          <span style={{ fontSize: 11, color: '#8A8A80', whiteSpace: 'nowrap', flexShrink: 0 }}>
            © 2024 Botanical Intelligence. A Scientific Publishing Initiative.
          </span>
        </div>

        {/* Links */}
        <div className="footer-links">
          {['Technical Documentation', 'Botanical Journal', 'Privacy Policy', 'Methodology'].map(link => (
            <a
              key={link}
              href="#"
              className="footer-link"
              onMouseOver={e => (e.currentTarget.style.color = '#2E6F40')}
              onMouseOut={e => (e.currentTarget.style.color = '#6B6B63')}
            >
              {link}
            </a>
          ))}
        </div>
      </footer>
    </>
  );
}