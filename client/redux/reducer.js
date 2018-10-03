import auth from './modules/auth';
import notifs from './modules/notifs';
import info from './modules/info';

export default function createReducers(asyncReducers) {

  return {
    online: (v = true) => v,
    notifs,
    auth,
    info,
    ...asyncReducers,
  };

}
