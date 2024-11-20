import { CognitoIdentityProviderClient, InitiateAuthCommand, SignUpCommand, ConfirmSignUpCommand, ResendConfirmationCodeCommand } from "@aws-sdk/client-cognito-identity-provider";
import { AWS_CONFIG } from '../lib/aws-config';

const cognitoClient = new CognitoIdentityProviderClient({
  region: AWS_CONFIG.REGION
});

export const authService = {
  async login(username, password) {
    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: AWS_CONFIG.COGNITO_CLIENT_ID,
      AuthParameters: { USERNAME: username, PASSWORD: password }
    });
    return cognitoClient.send(command);
  },

  async signUp(username, email, password) {
    const command = new SignUpCommand({
      ClientId: AWS_CONFIG.COGNITO_CLIENT_ID,
      Username: username,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'name', Value: username }
      ]
    });
    return cognitoClient.send(command);
  },

  async confirmSignUp(username, code) {
    const command = new ConfirmSignUpCommand({
      ClientId: AWS_CONFIG.COGNITO_CLIENT_ID,
      Username: username,
      ConfirmationCode: code
    });
    return cognitoClient.send(command);
  },

  async resendConfirmationCode(username) {
    const command = new ResendConfirmationCodeCommand({
      ClientId: AWS_CONFIG.COGNITO_CLIENT_ID,
      Username: username
    });
    return cognitoClient.send(command);
  }
};
