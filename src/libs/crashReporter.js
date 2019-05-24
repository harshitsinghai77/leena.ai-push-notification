/* global window */
import Raven from 'raven-js';

const ravenUrl = process.env.REACT_APP_RAVEN_JS_URL;
const appVersion = process.env.REACT_APP_VERSION;

const reportingEnabled = !!ravenUrl && !!appVersion;

// todo: move this to separate project
export default class CrashReporter {
  /**
   * logs error on sentry
   * @param error
   * @param context
   */
  static logException(error, context) {
    if (!reportingEnabled) return;
    Raven.captureException(error, {
      extra: context,
    });

    if (window.console && console.error) {
      console.error(error);
    }
  }

  /**
   * Initialize error reporter
   */
  static initialize() {
    if (!reportingEnabled) return;
    try {
      Raven.config(ravenUrl, { release: appVersion }).install();
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(e);
      }
    }
  }
}
