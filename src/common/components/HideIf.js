import React from 'react';

function HideIf({ hide = false, children }) {
  if (!hide) {
    return children;
  }
  return <span />;
}

export default HideIf;
