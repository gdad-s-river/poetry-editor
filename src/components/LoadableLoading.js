import React from 'react';

function LoadableLoading(props) {
  if (props.error) {
    return (
      <div>
        Error! <button onClick={props.retry}>Retry Loading</button>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}

export default LoadableLoading;
