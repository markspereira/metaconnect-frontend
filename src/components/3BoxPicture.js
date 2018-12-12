import React, {Component} from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import {threeBoxUpdateImage} from "../reducers/_3box";
import {saveLocal, getLocal} from "../helpers/localstorage";
// import { colors } from "../styles";

const StyledContainer = styled.div`
  margin-right: 10px;
`

const StyledProfilePlaceholder = styled.input`
  background-color: transparent;
  border-style: none;
  border-radius: 30px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: ${props => `${props.size}px`};
  height: ${props => `${props.size}px`};
  overflow: hidden;
  opacity: 0;
  padding: 0 15px;
  position: absolute;
  reprops.size-mode: contain;
  text-align: center;
  -webkit-box-sizing: border-box;
`;

const BackgroundImage = styled.img`
  width: ${props => `${props.size}px`};
  height: ${props => `${props.size}px`};
  border-radius: 30px;
  background-color: black;
  background-repeat: no-repeat;
  object-fit: cover;
`;

const AvatarImage = styled.img`
  width: ${props => `${props.size}px`};
  object-fit: cover;
`;



class BoxPicture extends Component {
  state = {
    delay: 500,
    editPic: true,
    removePic: true,
    imgHash: ''
  };
  componentDidMount() {
    this.getImage();
  };
  getImage = async () => {
    // const box = window.box;
    // const image = box ? await box.public.get('image') : null;
    // box && this.setState({imgHash: image});
    if (this.props.metaconnection) {
      this.setState({imgHash: this.props.imgHash})
    } else {
      const imgHash = await getLocal('boxImage');
      if (imgHash.length && imgHash !== this.state.imgHash) {
        this.setState({imgHash});
      }
    }

  };
  handleUpdatePic = async (photoFile) => {
    const box = window.box;
    const {editPic} = this.state;
    console.log('PHOTO FILE: ', photoFile);
    const formData = new window.FormData();
    formData.append('path', photoFile);
    // this.setState({ buffer: formData, disableSave: false, editPic: true, removeUserPic: false });
    const fetch = editPic && await window.fetch('https://ipfs.infura.io:5001/api/v0/add', {
      method: 'post',
      'Content-Type': 'multipart/form-data',
      body: formData
    });
    const returnedData = editPic && await fetch.json();
    box && await box.public.set('image', returnedData.Hash);
    console.log('returnedData: ', returnedData);
    saveLocal('boxImage', returnedData.Hash);
    this.setState({imgHash: returnedData.Hash});
    // this.props.threeBoxUpdateImage(returnedData.Hash);
  };
  render() {
    console.log('SIZE OF PROP: ', this.props.imgHash)
    return (
      <StyledContainer>
        <StyledProfilePlaceholder size={this.props.size || 50} id="fileInput" type="file" name="pic" className="light" accept="image/*" onChange={e => this.handleUpdatePic(e.target.files[0])} ref={ref => this.fileUpload = ref} />
        {this.state.imgHash ? <BackgroundImage size={this.props.size || 50} className="profPic" src={`https://ipfs.infura.io/ipfs/${this.state.imgHash}`} alt="profile" />
         : <AvatarImage size={this.props.size || 50} className="profPic" src={require('../assets/avatar.svg')} alt="profile" />}
      </StyledContainer>
    );
  }
}

BoxPicture.propTypes = {
  threeBoxUpdateImage: PropTypes.func.isRequired
};

const reduxProps = ({ threeBox }) => ({
  image: threeBox.image,
});

export default connect(
  reduxProps,
  {
    threeBoxUpdateImage
  }
)(BoxPicture);
