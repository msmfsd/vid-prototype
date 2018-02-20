import React from 'react';
import moment from 'moment'
import styled from 'styled-components';

const Panel = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  & > div {
    flex: 0 48%;
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 120px;
  padding: 10px;
  margin: 0 1% 10px 1%;
  background-color: ${props => props.status === 'ACTIVE' ? 'green' : 'black'};
  opacity: ${props => props.status === 'COMPLETED' ? 0.3 : 1};
`;

const Span = styled.span`
  display: block;
  width: 100%;
  padding: 0;
  margin-bottom: 5px;
`;

const Button = styled.button`
  background-color: #fff;
  color: #444;
  font-size: 18px;
  margin-right: 5px;
  cursor: pointer;
  &:disabled {
    cursor: default;
    opacity: 0.4;
  }
`;

const Consults = ({
  role,
  consults,
  liveConsult,
  beginConsult,
  endConsult,
}) => (
  <Panel>
    {!consults && <Row>Loading consults..</Row>}
    {!!consults && consults.map(consult => (
      <Row key={consult._id} status={consult.status}>
        <Span>{consult.status}</Span>
        <Span>
          Consult with <b>{
            role === 'Doctor'
            ? consult.patientId
            : consult.doctorId}</b>
        </Span>
        <Span>{moment(consult.dateScheduled).format('LLL')}</Span>
        <Span>
          {(consult.status === 'SCHEDULED' || consult.status === 'ACTIVE') && role === 'Doctor' && (
            <Button
              onClick={() => {
                if (consult.status === 'SCHEDULED') beginConsult(consult._id)
                else if (consult.status === 'ACTIVE') endConsult()
              }}
            >{consult.status === 'SCHEDULED' ? 'Begin consult' : 'End consult'}</Button>
          )}
          {!liveConsult && consult.status === 'ACTIVE' && role === 'Patient' && (
            <Button
              onClick={() => {
                beginConsult(consult._id)
              }}
            >Join consult</Button>
          )}
        </Span>
      </Row>
    ))}
  </Panel>
);

export default Consults;
