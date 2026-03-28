import { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { rsaConfig, simulateRsa } from "./rsa.js";
import CCAttack from "./CCAttack.jsx";

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

function SimulationPage() {
  const sampleAscii = "72 69 76 76 79 32 82 83 65";
  const [draftMessage, setDraftMessage] = useState(sampleAscii);
  const [message, setMessage] = useState(sampleAscii);

  let simulation;

  try {
    simulation = {
      result: simulateRsa(message),
      error: "",
    };
  } catch (error) {
    simulation = {
      result: null,
      error: error.message,
    };
  }

  const keyFacts = [
    { label: "Prime p", value: formatBigInt(rsaConfig.p) },
    { label: "Prime q", value: formatBigInt(rsaConfig.q) },
    { label: "Modulus n = p x q", value: formatBigInt(rsaConfig.n) },
    { label: "phi(n)", value: formatBigInt(rsaConfig.phi) },
    { label: "Public exponent e", value: formatBigInt(rsaConfig.e) },
    { label: "Private exponent d", value: formatBigInt(rsaConfig.d) },
  ];

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage(draftMessage);
  };

  const loadSample = () => {
    setDraftMessage(sampleAscii);
    setMessage(sampleAscii);
  };

  const clearMessage = () => {
    setDraftMessage("");
    setMessage("");
  };

  return (
    <main className="page-shell">
      <NavBar />

      <section className="hero-card">
        <div className="hero-copy">
          <h1>See each ASCII code encrypt into RSA ciphertext.</h1>
          <p className="hero-text">
            This simulation uses the common RSA public exponent 65537 and
            builds a valid demo key pair from two primes so each ASCII code can
            be encrypted with modular arithmetic.
          </p>
        </div>

        <div className="formula-panel">
          <p>Encryption</p>
          <strong>c = m^e mod n</strong>
          <p>Decryption</p>
          <strong>m = c^d mod n</strong>
        </div>
      </section>

      <section className="workspace">
        <form className="input-card card" onSubmit={handleSubmit}>
          <label className="section-label" htmlFor="message">
            Enter ASCII codes (0-127), space-separated
          </label>
          <textarea
            id="message"
            value={draftMessage}
            onChange={(event) => setDraftMessage(event.target.value)}
            placeholder="e.g. 72 69 76 76 79 (spell HELLO in ASCII)"
          />
          <div className="hint-row">
            <span>{draftMessage.trim() ? draftMessage.trim().split(/\s+/).filter(Boolean).length : 0} codes</span>
            <span>ASCII codes 0-127, space-separated</span>
          </div>
          <div className="action-row">
            <button className="primary-button" type="submit">
              Simulate RSA
            </button>
            <button className="ghost-button" type="button" onClick={loadSample}>
              Load sample
            </button>
            <button className="ghost-button" type="button" onClick={clearMessage}>
              Clear
            </button>
          </div>

          {simulation.error ? (
            <div className="status error">{simulation.error}</div>
          ) : (
            <div className="status success">
              Message encrypted and decrypted successfully.
            </div>
          )}
        </form>

        <div className="keys-card card">
          <p className="section-label">RSA setup</p>
          <div className="key-grid">
            {keyFacts.map((item) => (
              <article className="key-item" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="results-grid">
        <article className="card summary-card">
          <p className="section-label">Input ASCII codes</p>
          <div className="chip-row">
            {simulation.result?.asciiValues.map((value, index) => (
              <span className="chip" key={`${value}-${index}`}>
                {value}
              </span>
            ))}
          </div>
        </article>

        <article className="card summary-card">
          <p className="section-label">Encrypted output (Ciphertext)</p>
          <div className="chip-row encrypted">
            {simulation.result?.encryptedValues.map((value, index) => (
              <span className="chip encrypted-chip" key={`${value}-${index}`}>
                {value}
              </span>
            ))}
          </div>
        </article>

        <article className="card summary-card">
          <p className="section-label">Decrypted ASCII codes</p>
          <div className="chip-row">
            {simulation.result?.rows.map((row, index) => (
              <span className="chip" key={`dec-${index}`}>
                {row.decryptedAscii}
              </span>
            ))}
          </div>
        </article>

        <article className="card summary-card">
          <p className="section-label">Recovered characters</p>
          <p className="recovered-message">
            {simulation.result?.decryptedMessage || "Waiting for valid input"}
          </p>
        </article>
      </section>

      <section className="card table-card">
        <div className="table-heading">
          <div>
            <p className="section-label">Character-by-character simulation</p>
            <p className="table-subtitle">
              Each row shows the ASCII code, RSA ciphertext, and decrypted
              value for the same character.
            </p>
          </div>
        </div>

        {simulation.result ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>ASCII</th>
                  <th>Char</th>
                  <th>Encrypted</th>
                  <th>Decrypted ASCII</th>
                  <th>Recovered</th>
                </tr>
              </thead>
              <tbody>
                {simulation.result.rows.map((row) => (
                  <tr key={`${row.index}-${row.ascii}`}>
                    <td>{row.index}</td>
                    <td>{row.ascii}</td>
                    <td>{row.character === " " ? "Space" : row.character}</td>
                    <td>{row.encrypted}</td>
                    <td>{row.decryptedAscii}</td>
                    <td>{row.decryptedCharacter === " " ? "Space" : row.decryptedCharacter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            Enter valid ASCII codes to generate the RSA steps.
          </div>
        )}
      </section>
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<SimulationPage />} />
      <Route path="/cca" element={<CCAttack />} />
    </Routes>
  );
}

export default App;
