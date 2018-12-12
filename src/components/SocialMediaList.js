import React from "react";
import styled from "styled-components";
import Link from "../components/Link";
import Icon from "../components/Icon";
import twitter from "../assets/twitter.svg";
import telegram from "../assets/telegram.svg";
import github from "../assets/github.svg";
import linkedin from "../assets/linkedin.svg";
import phone from "../assets/phone.svg";
import email from "../assets/email.svg";

const StyledSocialMediaWrapper = styled.div`
  margin: 8px 0;
  display: flex;
  align-items: center;
`;

const StyledSocialMedia = styled.div`
  display: flex;
  align-items: center;
  & a > * {
    margin-left: 10px !important;
  }
  & a:first-child > div {
    margin-left: 0 !important;
  }
`;

const StyledInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledText = styled.h6`
  weight: 700;
`;

const StyledImage = styled.img`
  width: 27px;
  height: 27px;
  margin-bottom: -4px;
  margin-right: 5px;
`;

const SocialMediaList = ({ socialMedia, ...props }) => (
  <StyledSocialMediaWrapper {...props}>
    {!Object.keys(socialMedia).length ? (
      <StyledInfo>
        <Link to="/edit-social-media">
          <StyledImage src={require("../assets/social_add_transparent.svg")} />
        </Link>
        <Link to="/edit-social-media"><StyledText>Add Info</StyledText></Link>
      </StyledInfo>
    ) : (
      <StyledSocialMedia>
        {!!socialMedia.twitter && (
          <a
            href={`https://twitter.com/${socialMedia.twitter}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon icon={twitter} size={30} />
          </a>
        )}
        {!!socialMedia.telegram && (
          <a
            href={`https://t.me/${socialMedia.telegram}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon icon={telegram} size={30} />
          </a>
        )}
        {!!socialMedia.github && (
          <a
            href={`https://github.com/${socialMedia.github}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon icon={github} size={30} />
          </a>
        )}

        {!!socialMedia.linkedin && (
          <a
            href={`https://linkedin.com/in/${socialMedia.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon icon={linkedin} size={30} />
          </a>
        )}
        {!!socialMedia.email && (
          <a
            href={`mailto:${socialMedia.email}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon icon={email} size={30} />
          </a>
        )}
        {!!socialMedia.phone && (
          <a
            href={`tel:${socialMedia.phone}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon icon={phone} size={30} />
          </a>
        )}
        <Link to="/edit-social-media">
          <StyledImage src={require("../assets/social_add_transparent.svg")} />
        </Link>
        <Link to="/edit-social-media"><StyledText>Add Info</StyledText></Link>
      </StyledSocialMedia>
    )}
  </StyledSocialMediaWrapper>
);

export default SocialMediaList;
