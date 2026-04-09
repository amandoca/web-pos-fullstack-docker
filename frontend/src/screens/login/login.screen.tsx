import "./login-screen.css";

import { getAppConfig } from "../../shared/config/app-config";

import { useLoginScreen } from "./login-screen.hooks";

const appConfig = getAppConfig();

// Renderiza a tela de entrada do sistema.
export function LoginScreen() {
  const {
    configurationMessage,
    isLoading,
    errorMessage,
    handleGoogleLogin,
    loginHintMessage,
  } = useLoginScreen();

  return (
    <main className="login-screen">
      <section className="login-shell">
        <div className="login-shell-body">
          <section className="login-panel">
            <header className="login-shell-brand">
              <div className="login-brand-mark">
                <img src={appConfig.brandLogo} alt={appConfig.brandName} />
              </div>

              <div className="login-shell-brand-copy">
                <strong>{appConfig.brandName}</strong>
                <span>{appConfig.systemTitle}</span>
              </div>
            </header>

            <div className="login-copy">
              <h1>Acesso ao sistema</h1>
              <p>Entre com sua conta Google para acessar o WEB POS.</p>
            </div>

            <section className="login-form" aria-label="Acesso com Google">
              <p className="login-hint">{loginHintMessage}</p>

              {configurationMessage ? (
                <p className="login-warning">{configurationMessage}</p>
              ) : null}

              {errorMessage ? (
                <p className="login-error">{errorMessage}</p>
              ) : null}

              <button
                className="login-submit"
                type="button"
                disabled={isLoading || Boolean(configurationMessage)}
                onClick={handleGoogleLogin}
              >
                {isLoading ? "Conectando..." : "Entrar com Google"}
              </button>
            </section>
          </section>

          <aside className="login-visual" aria-hidden="true">
            <div className="login-visual-stage">
              <div className="login-visual-blob" />
              <div className="login-visual-wave" />
              <img
                className="login-visual-image"
                src="/images/login-operator.png"
                alt=""
              />
              <div className="login-visual-counter" />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
