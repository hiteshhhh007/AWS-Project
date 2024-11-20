import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  CognitoIdentityProviderClient, 
  SignUpCommand, 
  InitiateAuthCommand, 
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand
} from "@aws-sdk/client-cognito-identity-provider";
import { jwtDecode } from 'jwt-decode';

const COGNITO_CLIENT_ID = '2ja86u8mktgqt252nsdf2ms3fs';

const cognitoClient = new CognitoIdentityProviderClient({
  region: 'us-east-1'
});

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      loading: false,
      error: null,
      pendingUsername: null,

      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      signUp: async ({ username, email, password }) => {
        set({ loading: true, error: null });
        try {
          const command = new SignUpCommand({
            ClientId: COGNITO_CLIENT_ID,
            Username: username,
            Password: password,
            UserAttributes: [
              {
                Name: 'email',
                Value: email
              },
              {
                Name: 'name',
                Value: username
              }
            ]
          });

          const response = await cognitoClient.send(command);
          set({ pendingUsername: username });
          return true;
        } catch (error) {
          set({ error: error.message || 'An error occurred during sign up' });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      signIn: async ({ username, password }) => {
        set({ loading: true, error: null });
        try {
          const command = new InitiateAuthCommand({
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: COGNITO_CLIENT_ID,
            AuthParameters: {
              USERNAME: username,
              PASSWORD: password
            }
          });

          const response = await cognitoClient.send(command);
          const { AccessToken, IdToken } = response.AuthenticationResult;
          
          // Decode the ID token to get user information
          const decodedToken = jwtDecode(IdToken);
          
          set({ 
            accessToken: AccessToken,
            user: {
              userId: decodedToken.sub,
              username: decodedToken.name || username,
              email: decodedToken.email
            },
            pendingUsername: null
          });
          
          return true;
        } catch (error) {
          set({ error: error.message || 'An error occurred during sign in' });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      confirmSignUp: async (code) => {
        const { pendingUsername } = get();
        if (!pendingUsername) {
          set({ error: 'No pending confirmation. Please sign up first.' });
          return false;
        }

        set({ loading: true, error: null });
        try {
          const command = new ConfirmSignUpCommand({
            ClientId: COGNITO_CLIENT_ID,
            Username: pendingUsername,
            ConfirmationCode: code.toString() // Ensure code is a string
          });

          await cognitoClient.send(command);
          set({ pendingUsername: null }); // Clear pending username after successful confirmation
          return true;
        } catch (error) {
          set({ error: error.message || 'An error occurred during confirmation' });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      resendCode: async () => {
        const { pendingUsername } = get();
        if (!pendingUsername) {
          set({ error: 'No pending confirmation. Please sign up first.' });
          return false;
        }

        set({ loading: true, error: null });
        try {
          const command = new ResendConfirmationCodeCommand({
            ClientId: COGNITO_CLIENT_ID,
            Username: pendingUsername
          });

          await cognitoClient.send(command);
          return true;
        } catch (error) {
          set({ error: error.message || 'An error occurred while resending code' });
          return false;
        } finally {
          set({ loading: false });
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          pendingUsername: null,
          error: null
        });
        localStorage.removeItem('auth-storage');
        window.location.href = '/';
      },

      isAuthenticated: () => {
        const state = get();
        return !!(state.user && state.accessToken);
      },

      getSession: () => {
        const state = get();
        if (!state.user || !state.accessToken) {
          return null;
        }
        return {
          user: state.user,
          accessToken: state.accessToken
        };
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        pendingUsername: state.pendingUsername
      })
    }
  )
);
