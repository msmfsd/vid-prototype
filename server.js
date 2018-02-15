import mongoose from 'mongoose';
import http from 'http';
import path from 'path';
import twilio from 'twilio';
import express from 'express';
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import {startDatabase, initDatabase} from './server/db';
import {getUsers, getUserById} from './server/routes/User'
import {getConsults, getConsultById, updateConsultStatusById} from './server/routes/Consult'
import randomName from './randomname';

// init
dotenv.load();

// Twilio
const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const app = express();
const port = process.env.PORT || 5000;

// init db
startDatabase();
app.use(initDatabase);
app.use(bodyParser.json());

// users
app.get('/api/users', getUsers);
app.get('/api/user/:id', getUserById);
// consults
app.get('/api/consults', getConsults);
app.get('/api/consult/:id', getConsultById);
app.put('/api/consult/:id', updateConsultStatusById);

/**
 * Generate an Access Token for a chat application user - it generates a random
 * username for the client requesting a token, and takes a device ID as a query
 * parameter.
 */
app.get('/api/token', (request, response) => {
  const identity = randomName();

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created.
  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET
  );

  // Assign the generated identity to the token.
  token.identity = identity;

  // Grant the access token Twilio Video capabilities.
  const grant = new VideoGrant();
  token.addGrant(grant);

  // Serialize the token to a JWT string and include it in a JSON response.
  response.send({
    identity: identity,
    token: token.toJwt()
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
