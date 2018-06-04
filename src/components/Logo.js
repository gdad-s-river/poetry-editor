import React from 'react';

function Logo({ hasEditorFocus }) {
  const color = hasEditorFocus ? '#ffffff' : '#000000';
  return (
    <div style={{ fontSize: '3rem', fontWeight: 'bold', color: color }}>
      Poetry Editor
    </div>
  );
}

export default Logo;
