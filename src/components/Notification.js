import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { colors, shadows, responsive, transitions } from "../styles";
import Button from '../components/Button';
import twitterLogo from '../assets/twitter.svg';

const StyledButton = styled(Button)`
  width: 100%;
  height: auto;
  margin: 20px 0;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;


const StyledNotification = styled.div`
  position: fixed;
  z-index: 20;
  width: calc(100% - 20px);
  max-width: 400px;
  top: 0;
  right: 0;
  margin: 10px;
  text-align: center;
  padding: 15px 20px;
  border-radius: 8px;
  text-align: center;
  transition: ${transitions.base};
  background: rgb(${colors.white});
  color: ${({ error }) =>
    error ? `rgb(${colors.red})` : `rgb(${colors.dark})`};
  box-shadow: ${shadows.medium};
  transform: ${({ show }) =>
    show ? "translate3d(0, 0, 0)" : "translate3d(0, -1000px, 0);"};
  @media screen and (${responsive.sm.max}) {
    top: auto;
    bottom: 0;
    transform: ${({ show }) =>
      show ? "translate3d(0, 0, 0)" : "translate3d(0, 1000px, 0);"};
  }
`;

const Notification = ({ show, error, message, name, button, ...props }) => (
  <StyledNotification show={show} error={error} {...props}>
    {message}
    {!error && <StyledButton color="twitterBlue" textTransform="uppercase" type="submit" onClick={() => window.open(`http://twitter.com/share?text=🎉I just metaconnected with @${name}! Throw away your business card and start metaconnecting now! 👉 &url=https://metaconnect.org/&hashtags=digitalidentity,savetheplanet&`)}>
      Share on Twitter <span role="img"><img style={{width: 25, }} src={twitterLogo} alt=""/></span>
    </StyledButton>}
  </StyledNotification>
);

Notification.propTypes = {
  show: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
};

const reduxProps = ({ notification }) => ({
  error: notification.error,
  show: notification.show,
  message: notification.message,
  name: notification.name,
});

export default connect(
  reduxProps,
  null
)(Notification);
