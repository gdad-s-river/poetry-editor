import React from 'react';
import Rheostat from 'rheostat';
import '../css/slider/base.css';
import '../css/slider/vertical.css';

const Slider = ({ values, ...rest }) => (
  <div
    style={{
      margin: '10% auto',
      height: '130px',
      width: '50%',
    }}
  >
    <Rheostat {...rest} values={values} />
  </div>
);

export default Slider;
