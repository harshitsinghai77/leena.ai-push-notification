import React from 'react';
import { Link } from '@reach/router';
import './pageNotFound.css';

const PageNotFound = () => (
  <div className="notfoundid">
    <div className="notfound">
      <div className="notfound-404">
        <h1>404</h1>
      </div>
      <h2>Oops, The Page you are looking for can't be found!</h2>
      <div className="notfound-search">
        <Link to="/">
          {' '}
          <button type="button">Go Home</button>
        </Link>
      </div>
    </div>
  </div>
);

export default React.memo(PageNotFound);
