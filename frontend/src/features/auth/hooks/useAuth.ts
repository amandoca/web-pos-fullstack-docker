import { useCallback } from "react";

import {
  getFirebaseAuthorizationConfig,
  getFirebaseEnvironmentStatus,
  isFirebaseConfigured,
} from "../../../application/firebase";
import {
  loginRequest,
  logoutRequest,
  restoreSessionRequest,
} from "../../../application/store/auth/auth.slice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../application/store/hooks";
import { type RootState } from "../../../application/store/root-reducer";

// Centraliza o acesso ao estado de autenticação no Redux.
export function useAuth() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state: RootState) => state.auth);
  const firebaseEnvironmentStatus = getFirebaseEnvironmentStatus();
  const firebaseAuthorizationConfig = getFirebaseAuthorizationConfig();

  // Dispara a action de login que será tratada pela saga.
  const login = useCallback(
    function login() {
      dispatch(loginRequest());
    },
    [dispatch],
  );

  // Dispara a action de logout para encerrar a sessão.
  const logout = useCallback(
    function logout() {
      dispatch(logoutRequest());
    },
    [dispatch],
  );

  // Pede ao Redux para restaurar a sessão salva.
  const restoreSession = useCallback(
    function restoreSession() {
      dispatch(restoreSessionRequest());
    },
    [dispatch],
  );

  return {
    currentUser: auth.currentUser,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    errorMessage: auth.errorMessage,
    hasAuthorizedEmailsConfigured:
      firebaseAuthorizationConfig.hasRoleConfiguration,
    isFirebaseConfigured: isFirebaseConfigured(),
    missingFirebaseKeys: firebaseEnvironmentStatus.missingKeys,
    login,
    logout,
    restoreSession,
  };
}
