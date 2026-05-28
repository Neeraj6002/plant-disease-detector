export default function Footer() {
  return (
    <footer
      style={{
        padding: '24px 48px',
        borderTop: '1px solid #E8E8E4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        backgroundColor: '#FBFBF9', // Using the Neutral background token from your UI system
        gap: 16,
        fontFamily: '"Plus Jakarta Sans", sans-serif', // Using the Label/Body font token
      }}
    >
      {/* Branding and Copyright on the Left */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span 
          style={{ 
            fontSize: 12, 
            fontWeight: 600, 
            color: '#2E6F40', // Primary Green token
            letterSpacing: '-0.01em'
          }}
        >
          Botanical Intelligence
        </span>
        <span 
          style={{ 
            fontSize: 11, 
            color: '#8A8A80', 
            whiteSpace: 'nowrap', 
            flexShrink: 0 
          }}
        >
          © 2024 Botanical Intelligence. A Scientific Publishing Initiative.
        </span>
      </div>

      {/* Navigation Links on the Right */}
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        {['Technical Documentation', 'Botanical Journal', 'Privacy Policy', 'Methodology'].map(link => (
          <a
            key={link}
            href="#"
            style={{
              fontSize: 11.5,
              color: '#6B6B63',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseOver={e => (e.currentTarget.style.color = '#2E6F40')} // Hovers into Primary Green
            onMouseOut={e => (e.currentTarget.style.color = '#6B6B63')}
          >
            {link}
          </a>
        ))}
      </div>
    </footer>
  );
}