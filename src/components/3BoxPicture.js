import React from "react";
import styled from "styled-components";
import Card from "../components/Card";
import Column from "../components/Column";
import Icon from "../components/Icon";
import { formatHandle } from "../helpers/utilities";
import { colors, responsive } from "../styles";


const StyledProfilePlaceholder = styled.input`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const BoxPicture = ({ name, socialMedia, ...props }) => (
  <StyledProfilePlaceholder id="fileInput" type="file" name="pic" className="light" accept="image/*" onChange={e => this.handleUpdatePic(e.target.files[0])} ref={ref => this.fileUpload = ref} />
);

export default BoxPicture;
