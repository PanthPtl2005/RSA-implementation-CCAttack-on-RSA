import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { rsaConfig, modPow, modInverse } from "./rsa.js";

const formatBigInt = (value) => value.toString();

function NavBar() {
  const location = useLocation();
  return (
    <nav className="nav-bar">
      <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>
        RSA Simulation
      </Link>
      <Link to="/cca" className={`nav-link ${location.pathname === "/cca" ? "active" : ""}`}>
        CCA Attack
      </Link>
    </nav>
  );
}

function CCAttack() {
  const [interceptedC, setInterceptedC] = useState("");
  const [attackResult, setAttackResult] = useState(null);
  const [error, setError] = useState("");

  const attack = () => {
    setError("");
    setAttackResult(null);

    const c = BigInt(interceptedC);
    if (c <= 0n) {
      setError("Enter a valid positive ciphertext integer.");
      return;
    }

    const { n, e, d } = rsaConfig;

    const r = 2n;
    const rInv = modInverse(r, n);

    const c1 = (c * modPow(r, e, n)) % n;

    const s1 = modPow(c1, d, n);

    const s = (s1 * rInv) % n;

    const m = s;

    const recoveredChar =
      m >= 32n && m <= 126n
        ? String.fromCharCode(Number(m))
        : `Non-printable (${formatBigInt(m)})`;

    setAttackResult({
      interceptedC: formatBigInt(c),
      r: formatBigInt(r),
      c1: formatBigInt(c1),
      s1: formatBigInt(s1),
      s: formatBigInt(s),
      m: formatBigInt(m),
      recoveredChar,
      explanation: `Chosen ciphertext attack: Multiply intercept with r^e, decrypt to get s1, multiply by r^-1 to recover original message m.`,
    });
  };

  const simulateFromMessage = (message) => {
    const { n, e } = rsaConfig;
    const ascii = BigInt(message.charCodeAt(0));
    const c = modPow(ascii, e, n);
    setInterceptedC(formatBigInt(c));
  };

  const steps = [
    { label: "Original message m", value: attackResult?.m, show: !!attackResult },
    { label: "Ciphertext c", value: attackResult?.interceptedC, show: !!attackResult },
    { label: "Random r", value: attackResult?.r, show: !!attackResult },
    { label: "c1 = c × r^e mod n", value: attackResult?.c1, show: !!attackResult },
    { label: "s1 = c1^d mod n", value: attackResult?.s1, show: !!attackResult },
    { label: "r⁻¹ mod n", value: attackResult ? "computed via Fermat" : "", show: !!attackResult },
    { label: "s = s1 × r⁻¹ mod n", value: attackResult?.s, show: !!attackResult },
    { label: "Recovered m = s", value: attackResult?.m, show: !!attackResult },
    { label: "Character", value: attackResult?.recoveredChar, show: !!attackResult },
  ];

  return (
    <main className="page-shell">
      <NavBar />

      <section className="hero-card">
        <div className="hero-copy">
          <h1>Chosen Ciphertext Attack on RSA</h1>
          <p className="hero-text">
            The CCA exploits RSA malleability. By transforming a ciphertext
            c = m^e mod n into c1 = c × r^e mod n and decrypting it, an attacker
            can recover the original message using only the public key.
          </p>
        </div>

        <div className="formula-panel">
          <p>Attack formula</p>
          <strong>c₁ = c × r^e mod n</strong>
          <p>Then decrypt c₁ to get s</p>
          <strong>m = s × r⁻¹ mod n</strong>
        </div>
      </section>

      <section className="workspace">
        <div className="input-card card">
          <p className="section-label">Enter intercepted ciphertext</p>
          <textarea
            value={interceptedC}
            onChange={(e) => setInterceptedC(e.target.value)}
            placeholder="Paste a ciphertext integer from the RSA simulation..."
          />
          <div className="action-row">
            <button className="primary-button" onClick={attack}>
              Run Attack
            </button>
            <button
              className="ghost-button"
              onClick={() => simulateFromMessage("A")}
            >
              Use sample (A)
            </button>
          </div>
          {error && <div className="status error">{error}</div>}
        </div>

        <div className="keys-card card">
          <p className="section-label">Attacker knows</p>
          <div className="key-grid">
            <article className="key-item">
              <span>Public key n</span>
              <strong>{formatBigInt(rsaConfig.n)}</strong>
            </article>
            <article className="key-item">
              <span>Public exponent e</span>
              <strong>{formatBigInt(rsaConfig.e)}</strong>
            </article>
            <article className="key-item">
              <span>Oracle access</span>
              <strong>Decrypt available</strong>
            </article>
          </div>
        </div>
      </section>

      {attackResult && (
        <>
          <section className="results-grid">
            <article className="card summary-card">
              <p className="section-label">Recovered plaintext</p>
              <p className="recovered-message">{attackResult.recoveredChar}</p>
            </article>
            <article className="card summary-card">
              <p className="section-label">Recovered ASCII</p>
              <p className="recovered-message">{attackResult.m}</p>
            </article>
            <article className="card summary-card">
              <p className="section-label">Attack explanation</p>
              <p className="attack-explanation">{attackResult.explanation}</p>
            </article>
          </section>

          <section className="card table-card">
            <p className="section-label">Attack steps</p>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Step</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {steps.map((step, i) => (
                    <tr key={i}>
                      <td>{step.label}</td>
                      <td className={step.label === "Character" ? "highlight-cell" : ""}>
                        {step.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

export default CCAttack;
