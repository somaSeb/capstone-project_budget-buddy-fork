import styled from "styled-components";

export const ModalBackround = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--modal-backround);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
`;
export const ModalContainer = styled.div`
  background: var(--modal-container-backround);
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  min-width: 80%;
`;
