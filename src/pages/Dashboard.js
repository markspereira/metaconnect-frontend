import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import styled from "styled-components";
import Base from "../layouts/base";
import Button from "../components/Button";
import BoxPicture from "../components/3BoxPicture";
import Card from "../components/Card";
import Icon from "../components/Icon";
import Column from "../components/Column";
import QRCodeScanner from "../components/QRCodeScanner";
import QRCodeDisplay from "../components/QRCodeDisplay";
import Loader from "../components/Loader";
import camera from "../assets/camera.svg";
import qrcode from "../assets/qrcode.svg";
import { notificationShow } from "../reducers/_notification";
import { metaConnectionShow } from "../reducers/_metaConnection";
import {
  p2pRoomSendMessage,
  // p2pRoomRegisterListeners
} from "../reducers/_p2pRoom";
import {
  formatHandle,
  handleMetaConnectionURI,
  generateNewMetaConnection
} from "../helpers/utilities";
// import { colors, transitions } from "../styles";
import {getLocal} from "../helpers/localstorage";
import {getProfile} from "../helpers/3box";
import {socket} from "../helpers/socket";

const StyledQRCodeWrapper = styled(Column)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  min-height: 360px;
`;

const StyledText = styled.h4`
  margin-top: 12px;
  margin-bottom: -10px;
  weight: 700;
`

const StyledContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px auto;
`;

const StyledButton = styled(Button)`
  
`;

const StyledAvatar = styled(BoxPicture)`
  marginRight: 10px;
`;

const StyledMetaConnections = styled.div`
  display: flex;
  font-size: 52px;
  & span {
    font-size: 42px;
    line-height: 66px;
    margin: 0 8px;
  }
`;

const StyledMiniProfile = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledMetaConnectionsListWrapper = styled.div`
  width: 100%;
  margin: 20px auto;
`;

const StyledMetaConnectionsList = styled.div``;
const StyledMetaConnectionsItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin:  10px auto;
  text-align: left;
  cursor: pointer;
  padding: 0px 8px 10px 0 ;
  border-bottom: 1px solid rgba(255,255,255,0.5);

`;

const StyledMetaConnectionsEmpty = styled(StyledMetaConnectionsItem)`
  cursor: none;
`;

const StyledIcon = styled(Icon)``;

const StyledCameraToggle = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

let baseUrl =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "http://" + window.location.host
    : "http://metaconnect.org";

class Dashboard extends Component {
  constructor(props){
    super(props);
    this.socket = socket;
  }
  state = {
    scan: false,
    peer: '',
    icon: '',
    peerId: ''
  };

  componentDidMount() {
    this.socket.emit('info');
    this.socket.on('id', id => {
      if (id) {
        this.setState({ peer: id });
      }
    });
    this.socket.on('metaconnection', mtx => this.onMessage(mtx))
    this.socket.on('approval', msg => this.onApproval(msg))
  }

  componentDidUpdate() {

    getProfile();

    if (!this.props.loading && this.props.connected) {
    }
  }

  sendMessage = (peer, message) => {
    message.id = peer;
    this.socket.emit('metaconnection', message);
  };

  onApproval = msg => {
      if (msg) {
        let result = JSON.parse(msg);
        if (result.request) {
          this.openNewMetaConnection(result);
        } else if (result.approved) {
          this.props.notificationShow(
            `🎉${formatHandle(result.name)} approved your MetaConnection!🎉`,
            false,
            result.name
          );
        } else if (result.rejected) {
          this.props.notificationShow(
            `${formatHandle(result.name)} rejected your MetaConnection!💔`,
            true,
            result.name
          );
        }
      }
  };

  onMessage = message => {
    this.setState({peerId: message.id});
    this.openNewMetaConnection(message);
  };

  openNewMetaConnection = metaConnection =>
    this.props.metaConnectionShow(metaConnection);

  openExistingMetaConnection = metaConnection => {
    console.log('metaconnection: ', metaConnection)
    this.props.metaConnectionShow({
      peer: null,
      request: false,
      name: metaConnection.name,
      socialMedia: metaConnection.socialMedia,
      address: metaConnection.address,
      boxImage: metaConnection.boxImage,
    });
  };

  sendMetaConnection(peer) {
    const boxImage = getLocal('boxImage');
    const metaConnection = generateNewMetaConnection({
      peer: peer,
      name: this.props.name,
      socialMedia: this.props.socialMedia,
      address: this.props.address,
      boxImage
    });
    this.sendMessage(this.socket.id, metaConnection);
  }

  generateQRCodeURI = () => {
    const { peer } = this.state;
    const name = encodeURIComponent(this.props.name);
    const socialMedia = encodeURIComponent(
      JSON.stringify(this.props.socialMedia)
    );
    const address = getLocal('account').publicAddress;
    const boxImage = getLocal('boxImage');
    let uri = "";
    if (peer) {
      uri = `${baseUrl}?id=${peer}&name=${name}&socialMedia=${socialMedia}&address=${address}&boxImage=${boxImage}`;
    }

    return uri;
  };

  toggleQRCodeScanner = () => this.setState({ scan: !this.state.scan });

  onQRCodeError = err => {
    console.error(err);
    this.props.notificationShow("Something went wrong!", true);
  };


  onQRCodeValidate = data => {
    let result = null;
    if (data.startsWith("http:") || data.startsWith("https:")) {
      result = data;
    }
    return { data, result, onError: this.onQRCodeError };
  };

  onQRCodeScan = string => {
    const result = handleMetaConnectionURI(string);
    if (result) {
      result.id = result.peer;
      this.setState({peerId: result.peer});
      this.toggleQRCodeScanner();
      this.sendMetaConnection(result.peer);
      this.openNewMetaConnection(result);
    }
  };

  render() {
    return (
      <Base showSocialMedia>
        <StyledContainer>
          <StyledMetaConnections>
            {Object.keys(this.props.metaConnections).length || 0}
            <span>{` ❤️`}</span>
          </StyledMetaConnections>
            <StyledCameraToggle
              active={this.state.scan}
              onClick={this.toggleQRCodeScanner}>
              <StyledIcon
                icon={this.state.scan ? qrcode : camera}
                size={30}
                color={"dark"}
                onClick={this.toggleQRCodeScanner}
              />
            </StyledCameraToggle>
        </StyledContainer>
        <Card>
          <StyledQRCodeWrapper>
            <StyledText>Scan to connect!</StyledText>
            {this.state.scan ? (
              <QRCodeScanner
                onValidate={this.onQRCodeValidate}
                onError={this.onQRCodeError}
                onScan={this.onQRCodeScan}
                onClose={this.toggleQRCodeScanner}
              />
            ) : this.state.peer ? (
              <QRCodeDisplay data={this.generateQRCodeURI()} />
            ) : (
              <Loader size={320} color="dark" background="white" />
            )}
          </StyledQRCodeWrapper>
        </Card>
        <StyledMetaConnectionsListWrapper>
          <h2>Your MetaConnections</h2>
          {Object.keys(this.props.metaConnections).length ? (
            <StyledMetaConnectionsList>
              {Object.keys(this.props.metaConnections).map(key => (
                <StyledMetaConnectionsItem
                  key={key}
                  onClick={() =>
                    this.openExistingMetaConnection(
                      this.props.metaConnections[key]
                    )
                  }
                >
                  <StyledMiniProfile>
                    <StyledAvatar size={30} metaconnection imgHash={this.props.metaConnections[key].boxImage}/>
                    <h6>
                      {key}
                    </h6>
                  </StyledMiniProfile>
                  <StyledButton>View</StyledButton>
                </StyledMetaConnectionsItem>
              ))}
            </StyledMetaConnectionsList>
          ) : (
            <StyledMetaConnectionsEmpty>
              {"Go make some MetaConnections"}
            </StyledMetaConnectionsEmpty>
          )}
        </StyledMetaConnectionsListWrapper>
      </Base>
    );
  }
}

Dashboard.propTypes = {
  metaConnectionShow: PropTypes.func.isRequired,
  notificationShow: PropTypes.func.isRequired,
  p2pRoomSendMessage: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  socialMedia: PropTypes.object.isRequired,
  metaConnections: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  connected: PropTypes.bool.isRequired,
  userId: PropTypes.string.isRequired
};

const reduxProps = ({ account, p2pRoom }) => ({
  name: account.name,
  socialMedia: account.socialMedia,
  address: account.address,
  metaConnections: account.metaConnections,
  loading: p2pRoom.loading,
  connected: p2pRoom.connected,
  userId: p2pRoom.userId
});

export default connect(
  reduxProps,
  {
    metaConnectionShow,
    notificationShow,
    p2pRoomSendMessage,
  }
)(Dashboard);
