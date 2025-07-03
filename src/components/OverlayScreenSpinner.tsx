'use client'

export default function OverlaySpinner({ message }: { message?: string }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          border: '5px solid #3F82B2',
          borderTop: '5px solid transparent',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          animation: 'spin 1s linear infinite',
          marginBottom: message ? '1rem' : 0,
        }}
      />
      {message && (
        <div
          style={{
            color: '#3F82B2',
            fontWeight: 'bold',
            fontSize: '1rem',
            userSelect: 'none',
          }}
        >
          {message}
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg) }
            100% { transform: rotate(360deg) }
          }
        `}
      </style>
    </div>
  )
}
