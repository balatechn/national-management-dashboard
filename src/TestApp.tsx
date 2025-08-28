import React from 'react'

function TestApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333' }}>🎉 MY Management Dashboard</h1>
      <p style={{ color: '#666' }}>
        If you can see this message, the React app is working correctly!
      </p>
      <div style={{ 
        backgroundColor: '#f0f0f0', 
        padding: '15px', 
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h2>Dashboard Status:</h2>
        <ul>
          <li>✅ React is loaded</li>
          <li>✅ Components are rendering</li>
          <li>✅ Styles are working</li>
          <li>🔄 Ready to load full dashboard...</li>
        </ul>
      </div>
      <button 
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
        onClick={() => alert('Dashboard is working!')}
      >
        Test Button
      </button>
    </div>
  )
}

export default TestApp
