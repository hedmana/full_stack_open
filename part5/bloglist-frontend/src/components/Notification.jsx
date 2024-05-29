import PropTypes from 'prop-types';

const Notification = ({ message, classVal }) => {
  if (message === null) {
    return null;
  }

  return <div className={classVal}>{message}</div>;
};

Notification.propTypes = {
  message: PropTypes.string,
  classVal: PropTypes.string,
};

export default Notification;
